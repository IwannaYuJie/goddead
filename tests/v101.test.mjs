// tests/v101.test.mjs
// v101 黎明织造厂 / Dawn Weaving Mill comprehensive test suite

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const scriptSrc = readFileSync(resolve(rootDir, 'script.js'), 'utf8');
const indexHtml = readFileSync(resolve(rootDir, 'index.html'), 'utf8');
const stylesCss = readFileSync(resolve(rootDir, 'styles.css'), 'utf8');

// 1. Exact start and end extraction assertions for v101 module slice
const v101ExactMarkerStart = '/* ============================================================\n   v101 黎明织造厂';
const v101ExactMarkerEnd = '/* ============================================================\n   v102 没有天气的候车亭';

const v101SliceStart = scriptSrc.indexOf(v101ExactMarkerStart);
const v101SliceEnd = scriptSrc.indexOf(v101ExactMarkerEnd, v101SliceStart);

assert.ok(v101SliceStart > -1, `Could not find exact v101 start marker in script.js (${v101ExactMarkerStart})`);
assert.ok(v101SliceEnd > v101SliceStart, `Could not find exact v101 end marker in script.js (${v101ExactMarkerEnd})`);

const v101ModSrc = scriptSrc.slice(v101SliceStart, v101SliceEnd);

// Extract resolveScene function directly from script.js
const resolveSceneMatch = scriptSrc.match(/const resolveScene = \(name\) => \{[\s\S]*?\n  \};\n/);
assert.ok(resolveSceneMatch, 'Could not extract resolveScene from script.js');
const resolveSceneSrc = resolveSceneMatch[0];

// Independent reference coordinate DFS based on (row, col) + Manhattan adjacency
function refBfs(pattern, material) {
  if (typeof pattern !== 'string' || pattern.length !== 9 || (material !== 'l' && material !== 'n')) return [];
  const grid = [];
  for (let r = 0; r < 3; r++) {
    grid.push([pattern[r * 3], pattern[r * 3 + 1], pattern[r * 3 + 2]]);
  }

  const visited = new Set();
  function dfs(r, c) {
    const key = r * 3 + c;
    if (visited.has(key)) return;
    visited.add(key);
    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3 && grid[nr][nc] === material) {
        dfs(nr, nc);
      }
    }
  }

  for (let r = 0; r < 3; r++) {
    if (grid[r][0] === material) {
      dfs(r, 0);
    }
  }

  return Array.from(visited).sort((a, b) => a - b);
}

function refHasPath(pattern, material) {
  const reached = refBfs(pattern, material);
  return [2, 5, 8].some((right) => reached.includes(right));
}

function refClassifyDawnPattern(pattern) {
  if (typeof pattern !== 'string' || pattern.length !== 9 || !/^[.ln]{9}$/.test(pattern)) return '';
  const light = refHasPath(pattern, 'l');
  const night = refHasPath(pattern, 'n');
  if (light && night) return 'day-and-night-lived-apart';
  if (light) return 'the-hundred-and-first-day-began';
  if (night) return 'the-night-learned-to-live-without-dawn';
  return '';
}

// 2. Parse tag definitions from index.html to reflect actual initial HTML attributes (hidden, disabled, classes)
const elementRegistry = new Map();
const tagRegex = /<([a-zA-Z0-9-]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g;
let match;
while ((match = tagRegex.exec(indexHtml)) !== null) {
  const tagName = match[1].toLowerCase();
  const attrsStr = match[2];
  const id = match[3];

  const hidden = /\bhidden\b/.test(attrsStr);
  const disabled = /\bdisabled\b/.test(attrsStr);
  const classMatch = attrsStr.match(/\bclass="([^"]+)"/);
  const classes = classMatch ? classMatch[1].trim().split(/\s+/) : [];
  const hrefMatch = attrsStr.match(/\bhref="([^"]+)"/);
  const href = hrefMatch ? hrefMatch[1] : null;

  elementRegistry.set(id, {
    tagName,
    hidden,
    disabled,
    classes,
    href,
  });
}

function createV101Harness({
  v100Eligible = true,
  v100CourtOutcomes = ['mourning-without-crying', 'century-without-dawn', 'candle-that-never-lights'],
  v100Pending = null,
  v100ActiveMourner = null,
  initialStore = null,
  currentHash = 'dawn-weaving-mill',
} = {}) {
  const mem = new Map();
  if (initialStore !== null) {
    mem.set('goddead_v101_dawn_weaving', typeof initialStore === 'string' ? initialStore : JSON.stringify(initialStore));
  }

  const v100Fixture = {
    pending: v100Pending,
    courtOutcomes: [...v100CourtOutcomes],
    activeMourner: v100ActiveMourner,
  };
  mem.set('goddead_v100_hundredth_wake', JSON.stringify(v100Fixture));

  const store = {
    get: (k, def) => (mem.has(k) ? mem.get(k) : def),
    set: (k, v) => mem.set(k, String(v)),
    memo: (k, fn) => fn(),
  };

  const listeners = new Map();
  const els = new Map();

  const mkEl = (id = '') => {
    const meta = elementRegistry.get(id) || {
      tagName: 'div',
      hidden: false,
      disabled: false,
      classes: [],
      href: null,
    };

    const initialClassSet = new Set(meta.classes);

    const elObj = {
      id,
      tagName: meta.tagName.toUpperCase(),
      hidden: meta.hidden,
      disabled: meta.disabled,
      textContent: '',
      children: [],
      attrs: {},
      classList: {
        set: initialClassSet,
        add(c) { this.set.add(c); },
        remove(c) { this.set.delete(c); },
        toggle(c, on) { on ? this.set.add(c) : this.set.delete(c); },
        contains(c) { return this.set.has(c); },
      },
      setAttribute(k, v) {
        this.attrs[k] = String(v);
        if (k === 'hidden') this.hidden = true;
        if (k === 'disabled') this.disabled = true;
      },
      getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; },
      removeAttribute(k) {
        delete this.attrs[k];
        if (k === 'hidden') this.hidden = false;
        if (k === 'disabled') this.disabled = false;
      },
      replaceChildren(...c) { this.children = c; },
      appendChild(c) { this.children.push(c); },
      addEventListener(evt, handler) {
        if (!listeners.has(id)) listeners.set(id, []);
        listeners.get(id).push({ evt, handler });
      },
      querySelector(sel) {
        const cls = sel.replace(/^\./, '');
        const findIn = (node) => {
          if (node.classList && node.classList.contains && node.classList.contains(cls)) return node;
          if (node.children) {
            for (const ch of node.children) {
              const res = findIn(ch);
              if (res) return res;
            }
          }
          return null;
        };
        return findIn(this);
      },
    };

    if (meta.href) elObj.attrs.href = meta.href;

    // Precreate dw-tile-mark and dw-tile-text for dw-cell buttons
    if (id.startsWith('dw-cell-')) {
      const mark = {
        tagName: 'SPAN',
        children: [],
        attrs: { 'aria-hidden': 'true' },
        classList: { contains: (c) => c === 'dw-tile-mark' },
        textContent: '·',
      };
      const text = {
        tagName: 'SPAN',
        children: [],
        attrs: {},
        classList: { contains: (c) => c === 'dw-tile-text' },
        textContent: '空白',
      };
      elObj.children = [mark, text];
    }

    return elObj;
  };

  const $ = (sel) => {
    if (!sel) return null;
    const id = sel.replace(/^#/, '');
    if (!elementRegistry.has(id)) return null;
    if (!els.has(id)) els.set(id, mkEl(id));
    return els.get(id);
  };

  const $$ = (sel) => {
    if (sel === '[id^="dw-"][aria-pressed]') {
      return Array.from(elementRegistry.keys()).filter((id) => id.startsWith('dw-')).map((id) => $(`#${id}`));
    }
    return [];
  };

  const schedules = [];
  const AutoAdvance = {
    schedule: (scene, target, opts) => schedules.push({ scene, target, opts }),
    has: (scene) => schedules.some((s) => s.scene === scene),
    clear: (scene) => {
      const idx = schedules.findIndex((s) => s.scene === scene);
      if (idx !== -1) schedules.splice(idx, 1);
    },
    clearAll: () => {
      schedules.length = 0;
    },
  };

  const AudioEngine = { whoosh() {}, tick() {} };

  const buttonAvailable = (id) => {
    const el = $(`#${id}`);
    if (!el) return false;
    return !el.disabled && !el.hidden;
  };

  const doc = {
    createElement: (tag) => {
      const obj = {
        tagName: tag.toUpperCase(),
        hidden: false,
        disabled: false,
        textContent: '',
        children: [],
        attrs: {},
        classList: {
          set: new Set(),
          add(c) { this.set.add(c); },
          remove(c) { this.set.delete(c); },
          toggle(c, on) { on ? this.set.add(c) : this.set.delete(c); },
          contains(c) { return this.set.has(c); },
        },
        setAttribute(k, v) { this.attrs[k] = String(v); },
        getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; },
        replaceChildren(...c) { this.children = c; },
        appendChild(c) { this.children.push(c); },
        addEventListener(type, fn) { (this.listeners = this.listeners || {})[type] = fn; },
        querySelector(sel) {
          const cls = sel.replace(/^\./, '');
          const findIn = (node) => {
            if (node.classList && node.classList.contains && node.classList.contains(cls)) return node;
            if (node.children) {
              for (const ch of node.children) {
                const res = findIn(ch);
                if (res) return res;
              }
            }
            return null;
          };
          return findIn(this);
        },
      };
      return obj;
    },
  };

  const loc = { hash: `#${currentHash}` };
  const hist = { replaceState(st, title, url) { loc.hash = url; } };

  const getHundredthWake = () => v100Fixture;
  const wkCourtEligible = () => v100Eligible;
  const WK_VERDICT_OUTCOME_IDS = ['mourning-without-crying', 'century-without-dawn', 'candle-that-never-lights'];

  const compiledCode = `
    let currentScene = "${currentHash}";
    const location = loc;
    const history = hist;

    // Upstream stubs for resolveScene
    const reliquaryUnlocked = () => true;
    const regretReclamationBridgeAllows = () => false;
    const forgivenessLandfillBridgeAllows = () => false;
    const watchUnlocked = () => true;
    const line4Unlocked = () => true;
    const getLine4 = () => ({ connected: true });
    const getDL = () => ({ accepted: true });
    const getCancel = () => ({ refused: true });
    const getActing = () => ({ appointed: true });
    const getListening = () => ({ pendingTarget: null, visited: { console: true }, history: [] });
    const LISTENING_CONSOLE = "listening-console";
    const LISTENING_ROOMS = [];
    const getSidetone = () => ({ visited: {} });
    const getFailure = () => ({ pendingTarget: null, visited: { desk: true }, selections: {} });
    const FAILURE_DESK = "failure-desk";
    const FAILURE_ROOMS = [];
    const getDepth = () => ({ deepVisited: {} });
    const DEEP_SCENES = [];
    const DEEP_PARENT = {};
    const getBranches = () => ({ visited: {} });
    const getAudit = () => ({ outcome: "" });
    const getBelief = () => ({ pendingTarget: null, branches: {} });
    const BRANCH_SCENES = [];
    const AUDIT_BRANCH_OUTCOME = {};
    const BELIEF_SCENE_BRANCH = {};
    const innocentWitnessProtectionBridgeAllows = () => false;
    const unspokenPersonhoodBridgeAllows = () => false;
    const unfinishedThoughtBridgeAllows = () => false;
    const lostWeightBridgeAllows = () => false;
    const getReview = () => ({ outcome: "", visited: {} });
    const getValuation = () => ({ outcome: "", visited: {}, marks: [] });
    const getFloor = () => ({ outcome: "", visited: {}, marks: [] });
    const getSettlement = () => ({ settled: false, outcome: "", visited: {} });
    const SETTLE_NAME_SCENE = {};
    const SETTLE_RESULT_SCENES = [];
    const SETTLE_RESULT_OUTCOME = {};
    const settleUnlocked = () => true;
    const getAnomaly = () => ({ pendingTarget: null, visits: {} });
    const ANOMALY_BACKROOM_SCENES = [];
    const ANOMALY_SCENE_BACKROOM = {};
    const getEvidence = () => ({ pendingTarget: null, visits: {} });
    const EVIDENCE_SCENES = [];
    const EVIDENCE_SCENE_KEY = {};
    const getLedger = () => ({ pendingTarget: null, visits: {} });
    const LEDGER_SCENES = [];
    const LEDGER_SCENE_KEY = {};
    const harmArchaeologyBridgeAllows = () => false;
    const getAppeal = () => ({ pendingTarget: null, visits: {} });
    const APPEAL_SCENES = [];
    const APPEAL_SCENE_KEY = {};
    const getCross = () => ({ pendingTarget: null, visits: { desk: true } });
    const getForecourt = () => ({ visited: { threshold: true } });
    const FORECOURT_SCENES = [];
    const FORECOURT_VISIT_KEY = {};
    const getLateral = () => ({ lastAction: "" });
    const getKnockNet = () => ({ lastAction: "" });
    const getPaperback = () => ({ lastScene: "", lastAction: "" });
    const getCallback = () => ({ outcome: "" });
    const getProxy = () => ({ outcome: "" });
    const LATERAL_V31_TARGET = {};
    const KNOCK_V31_TARGET = {};
    const parseAndValidateGovernance = () => ({ hudUnlocked: false, rulings: {} });
    const lastWordBankBridgeAllows = () => false;
    const dreamCustomsBridgeAllows = () => false;
    const tombstonePatentOfficeBridgeAllows = () => false;
    const apocalypseWarrantyBridgeAllows = () => false;
    const realityRefundCounterBridgeAllows = () => false;
    const selfAuthenticityBridgeAllows = () => false;
    const firstPersonRationingBridgeAllows = () => false;
    const orphanedFactBridgeAllows = () => false;
    const existenceRenunciationBridgeAllows = () => false;
    const nonexistenceDebtCollectionBridgeAllows = () => false;
    const unhappenedEventAuctionBridgeAllows = () => false;
    const accomplishedFactEvictionBridgeAllows = () => false;
    const causelessConsequenceRefugeeBridgeAllows = () => false;
    const lateCauseMaternityBridgeAllows = () => false;
    const witnessLiabilityBridgeAllows = () => false;
    const unseenClaimsBridgeAllows = () => false;
    const returnedKnocksBridgeAllows = () => false;
    const stoppedClocksBridgeAllows = () => false;
    const heldBreathBridgeAllows = () => false;
    const vigilCandlesBridgeAllows = () => false;
    const deadRoadsBridgeAllows = () => false;
    const hundredthWakeBridgeAllows = () => false;
    const endingReturnCanVisitGallery = () => true;
    const endingReturnCanVisitOffice = () => true;
    const causalMailCanVisitBefore = () => true;
    const causalMailCanVisitVault = () => true;
    const causalMailCanVisitSorter = () => true;
    const causalScarCanVisitRoom = () => true;
    const counterfactualCanVisitSpindle = () => true;
    const counterfactualCanVisitLoom = () => true;
    const counterfactualCanVisitNursery = () => true;
    const counterfactualCanVisitRoom = () => true;
    const bloodlessCanVisitGenealogy = () => true;
    const bloodlessCanVisitArchive = () => true;
    const bloodlessCanVisitChildhood = () => true;
    const bloodlessCanVisitCourt = () => true;
    const generationLoansCanVisitOffice = () => true;
    const generationLoansCanVisitVault = () => true;
    const generationLoansCanVisitClearing = () => true;
    const generationLoansCanVisitForeclosure = () => true;
    const posthumousCensusCanVisitHall = () => true;
    const posthumousCensusCanVisitArchive = () => true;
    const posthumousCensusCanVisitBooth = () => true;
    const posthumousCensusCanVisitNullification = () => true;
    const deadParliamentCanVisitRotunda = () => true;
    const deadParliamentCanVisitChamber = () => true;
    const deadParliamentCanVisitSeverance = () => true;
    const deadParliamentCanVisitRepublic = () => true;
    const deathDiplomacyCanVisitMinistry = () => true;
    const deathDiplomacyCanVisitBorder = () => true;
    const deathDiplomacyCanVisitAutopsy = () => true;
    const deathDiplomacyCanVisitWar = () => true;
    const lastWordBankCanVisitBank = () => true;
    const lastWordBankCanVisitMint = () => true;
    const lastWordBankCanVisitVault = () => true;
    const lastWordBankCanVisitDefault = () => true;
    const dreamCustomsCanVisitCustoms = () => true;
    const dreamCustomsCanVisitTerminal = () => true;
    const dreamCustomsCanVisitBureau = () => true;
    const dreamCustomsCanVisitYard = () => true;
    const tombstonePatentOfficeCanVisitOffice = () => true;
    const tombstonePatentOfficeCanVisitOssuary = () => true;
    const tombstonePatentOfficeCanVisitExamination = () => true;
    const tombstonePatentOfficeCanVisitTribunal = () => true;
    const apocalypseWarrantyCanVisitOffice = () => true;
    const apocalypseWarrantyCanVisitMorgue = () => true;
    const apocalypseWarrantyCanVisitBench = () => true;
    const apocalypseWarrantyCanVisitYard = () => true;
    const realityRefundCounterCanVisitCounter = () => true;
    const realityRefundCounterCanVisitIncinerator = () => true;
    const realityRefundCounterCanVisitInspection = () => true;
    const realityRefundCounterCanVisitCourt = () => true;
    const selfAuthenticityCanVisitOffice = () => true;
    const selfAuthenticityCanVisitVault = () => true;
    const selfAuthenticityCanVisitExamination = () => true;
    const selfAuthenticityCanVisitTribunal = () => true;
    const firstPersonRationingCanVisitBureau = () => true;
    const firstPersonRationingCanVisitArchive = () => true;
    const firstPersonRationingCanVisitChamber = () => true;
    const firstPersonRationingCanVisitCourt = () => true;
    const unspokenPersonhoodCanVisitCourt = () => true;
    const unspokenPersonhoodCanVisitArchive = () => true;
    const unspokenPersonhoodCanVisitExamination = () => true;
    const unspokenPersonhoodCanVisitTribunal = () => true;
    const unfinishedThoughtCanVisitAsylum = () => true;
    const unfinishedThoughtCanVisitArchive = () => true;
    const unfinishedThoughtCanVisitLab = () => true;
    const unfinishedThoughtCanVisitHearing = () => true;
    const regretReclamationCanVisitPlant = () => true;
    const regretReclamationCanVisitWeighhouse = () => true;
    const regretReclamationCanVisitSmelting = () => true;
    const regretReclamationCanVisitFurnace = () => true;
    const forgivenessLandfillCanVisit = () => true;
    const inertHarmCertificateVaultCanVisit = () => true;
    const mercyBurialTrenchCanVisit = () => true;
    const harmlessnessFinalWellCanVisit = () => true;
    const harmArchaeologyBureauCanVisit = () => true;
    const forensicMercyExcavationCanVisit = () => true;
    const crimeSceneWithoutOffenderCanVisit = () => true;
    const secondHarmHearingCourtCanVisit = () => true;
    const innocentWitnessProtectionBureauCanVisit = () => true;
    const identityCausalityLaundryCanVisit = () => true;
    const memoryRelocationSafehouseCanVisit = () => true;
    const anonymousTruthLifetimeCourtCanVisit = () => true;
    const orphanedFactClaimOfficeCanVisit = () => true;
    const factInheritanceVaultCanVisit = () => true;
    const causalEstateExecutionDeskCanVisit = () => true;
    const ownerlessTruthEstateCourtCanVisit = () => true;
    const existenceRenunciationRegistryCanVisit = () => true;
    const proofOfNonexistenceArchiveCanVisit = () => true;
    const ontologicalDisinheritanceChamberCanVisit = () => true;
    const civilNonexistenceFinalTribunalCanVisit = () => true;
    const nonexistenceDebtCollectionAgencyCanVisit = () => true;
    const absenceArrearsLedgerVaultCanVisit = () => true;
    const ontologicalRepossessionChamberCanVisit = () => true;
    const unpayableExistenceBankruptcyCourtCanVisit = () => true;
    const auctionHouseForEventsThatNeverHappenedCanVisit = () => true;
    const catalogueOfUnoccupiedRealityCanVisit = () => true;
    const counterfactualBiddingFloorCanVisit = () => true;
    const retroactiveOccurrenceTitleCourtCanVisit = () => true;
    const accomplishedFactEvictionAuthorityCanVisit = () => true;
    const condemnedHistorySurveyOfficeCanVisit = () => true;
    const retroactiveDemolitionYardCanVisit = () => true;
    const finalOccupancyAppealCourtCanVisit = () => true;
    const causelessConsequenceRefugeeAuthorityCanVisit = () => true;
    const borrowedCauseSponsorshipOfficeCanVisit = () => true;
    const causalBorderProcessingStationCanVisit = () => true;
    const finalAsylumTribunalForCauselessConsequencesCanVisit = () => true;
    const lateCauseMaternityWardCanVisit = () => true;
    const reverseBirthOrderRegistryCanVisit = () => true;
    const firstCauseCustodyCourtCanVisit = () => true;
    const witnessBureauCanVisit = () => true;
    const eyelidActuarialRoomCanVisit = () => true;
    const blindExemptionHearingCanVisit = () => true;
    const unseenOfficeCanVisit = () => true;
    const retroactiveWitnessDeskCanVisit = () => true;
    const courtOfTheUnwitnessedCanVisit = () => true;
    const rkOfficeCanVisit = () => true;
    const knockerBoothCanVisit = () => true;
    const rkCourtCanVisit = () => true;
    const scShopCanVisit = () => true;
    const clockBenchCanVisit = () => true;
    const scCourtCanVisit = () => true;
    const hbCounterCanVisit = () => true;
    const bellowsCounterCanVisit = () => true;
    const hbCourtCanVisit = () => true;
    const lwBureauCanVisit = () => true;
    const balanceRoomCanVisit = () => true;
    const lwCourtCanVisit = () => true;
    const vcHallCanVisit = () => true;
    const candleBoardCanVisit = () => true;
    const vcCourtCanVisit = () => true;
    const rdOfficeCanVisit = () => true;
    const roadTableCanVisit = () => true;
    const rdCourtCanVisit = () => true;
    const wkHallCanVisit = () => true;
    const cardAltarCanVisit = () => true;
    const wkCourtCanVisit = () => true;
    const weatherlessShelterBridgeAllows = () => false;
    const wsHallCanVisit = () => false;
    const seasonDispatchBoardCanVisit = () => false;
    const fourSeasonPlatformCanVisit = () => false;
    const weatherlessShelterAvailable = () => false;
    const getWeatherlessShelter = () => ({ pending: null });
    const chooseWsEntry = () => {};
    const shadowlessPhotographyBridgeAllows = () => false;
    const shadowlessPhotoStudioCanVisit = () => false;
    const doubleExposureCameraCanVisit = () => false;
    const unreceivedShadowDarkroomCanVisit = () => false;
    const wakeForAnotherHotelBridgeAllows = () => false;
    const yesterdayBreakfastBridgeAllows = () => false;
    const ybShopCanVisit = () => false;
    const breakfastCounterCanVisit = () => false;
    const ybCourtCanVisit = () => false;
    const ahHotelCanVisit = () => false;
    const borrowedDawnClockroomCanVisit = () => false;
    const sharedMorningVerandaCanVisit = () => false;

    ${v101ModSrc}

    ${resolveSceneSrc}

    return {
      go: (s) => {
        if (currentScene !== s) {
          AutoAdvance.clearAll();
          currentScene = s;
          loc.hash = '#' + s;
        }
      },
      currentScene: () => currentScene,
      resolveScene,
      resolvePending: resolveDawnWeavingPendingOnArrival,
      replayPending: replayDawnWeavingPending,
      syncAll: syncDawnWeavingAll,
      get: getDawnWeaving,
      save: saveDawnWeaving,
      unlocked: dawnWeavingUnlocked,
      available: dawnWeavingAvailable,
      connections: dwConnections,
      classify: classifyDawnPattern,
      normalize: normalizeDawnWeaving,
      expectedPending: expectedDwPending,
      bridge: dawnWeavingBridgeAllows,
      hallOk: dwHallCanVisit,
      loomOk: dayNightLoomCanVisit,
      terraceOk: skyClothTerraceCanVisit,
      forget: forgetDawnWeavingState,
      chooseDwEntry,
      chooseDwStart,
      chooseDwCell,
      chooseDwMode,
      chooseDwExample,
      chooseDwSample,
      chooseDwDelivery,
      chooseDwCourierReturn,
      chooseDwAbandon,
      chooseDwUnweave,
      setMode: (m) => { dwCurrentMode = m; },
      getMode: () => dwCurrentMode,
      getExampleIndex: () => dwExampleIndex,
      getExampleShown: () => dwExampleShown,
      DW_ENDING_TABLE,
      DW_ENDING_IDS,
    };
  `;

  const api = new Function(
    'store', '$', '$$', 'reduced', 'AutoAdvance', 'AudioEngine', 'buttonAvailable',
    'document', 'localStorage', 'getHundredthWake', 'wkCourtEligible', 'WK_VERDICT_OUTCOME_IDS',
    'loc', 'hist',
    compiledCode
  )(
    store, $, $$, false, AutoAdvance, AudioEngine, buttonAvailable,
    doc, { removeItem: (k) => mem.delete(k) }, getHundredthWake, wkCourtEligible, WK_VERDICT_OUTCOME_IDS,
    loc, hist
  );

  const click = (id, trusted = true) => {
    const list = listeners.get(id) || [];
    const event = { isTrusted: trusted, preventDefault() {} };
    for (const { evt, handler } of list) {
      if (evt === 'click') handler(event);
    }
  };

  return { ...api, mem, els, listeners, schedules, $, $$, click, loc };
}

// ------------------------------------------------------------
// Test Suites
// ------------------------------------------------------------

test('v101: 19,683 all pattern exhaustive independent coordinate DFS audit and exact outcome counts', () => {
  const h = createV101Harness();
  const chars = ['.', 'l', 'n'];
  let countNone = 0;
  let countLight = 0;
  let countNight = 0;
  let countDual = 0;

  for (let i = 0; i < 19683; i++) {
    let temp = i;
    let pat = '';
    for (let pos = 0; pos < 9; pos++) {
      pat += chars[temp % 3];
      temp = Math.floor(temp / 3);
    }

    const actualClass = h.classify(pat);
    const refClass = refClassifyDawnPattern(pat);
    assert.strictEqual(actualClass, refClass, `Pattern ${pat} classification mismatch`);

    const actualL = h.connections(pat, 'l').sort((a, b) => a - b);
    const refL = refBfs(pat, 'l');
    assert.deepStrictEqual(actualL, refL, `Pattern ${pat} light connections mismatch`);

    const actualN = h.connections(pat, 'n').sort((a, b) => a - b);
    const refN = refBfs(pat, 'n');
    assert.deepStrictEqual(actualN, refN, `Pattern ${pat} night connections mismatch`);

    if (actualClass === '') countNone++;
    else if (actualClass === 'the-hundred-and-first-day-began') countLight++;
    else if (actualClass === 'the-night-learned-to-live-without-dawn') countNight++;
    else if (actualClass === 'day-and-night-lived-apart') countDual++;
  }

  assert.strictEqual(countNone, 14793, 'Expected none count 14793');
  assert.strictEqual(countLight, 2351, 'Expected light count 2351');
  assert.strictEqual(countNight, 2351, 'Expected night count 2351');
  assert.strictEqual(countDual, 188, 'Expected dual count 188');
  assert.strictEqual(countNone + countLight + countNight + countDual, 19683, 'Total sum must be 19683');
});

test('v101: Invalid pattern and boundary rejection tests (diagonal, row-wrap, empty, invalid chars)', () => {
  const h = createV101Harness();

  const diagLight = 'l...l...l';
  assert.strictEqual(h.classify(diagLight), '', 'Diagonal path must not connect');

  const rowWrap = '..ll.....';
  assert.strictEqual(h.classify(rowWrap), '', 'Row wrap must not connect');

  assert.strictEqual(h.classify('.........'), '', 'Empty pattern must produce empty classification');

  const noLeft = '.ll.ll...';
  assert.strictEqual(h.classify(noLeft), '', 'Pattern without left entrance (col 0 all .) must not connect');

  const noRight = 'll.ll....';
  assert.strictEqual(h.classify(noRight), '', 'Pattern without right exit (col 2 all .) must not connect');

  const disjoint = 'l.l...l..';
  assert.strictEqual(h.classify(disjoint), '', 'Disjoint cells without continuous path must not connect');

  assert.strictEqual(h.classify('lllllllllX'), '', 'Too long string must be invalid');
  assert.strictEqual(h.classify('llll'), '', 'Too short string must be invalid');
  assert.strictEqual(h.classify('abcdefghi'), '', 'Illegal characters must be invalid');
  assert.strictEqual(h.classify(null), '', 'Null must be invalid');
});

test('v101: Static index.html, scenes count (238), CSS, and Assets inspection', () => {
  const sections = Array.from(indexHtml.matchAll(/<section\b[^>]*\bdata-scene="([^"]+)"/g), (m) => m[1]);
  const uniqueScenes = Array.from(new Set(sections));
  assert.strictEqual(sections.length, 238, 'Total <section data-scene> count in index.html must be 238');
  assert.strictEqual(uniqueScenes.length, 238, 'All data-scene attributes must be unique (no duplicates)');
  assert.ok(uniqueScenes.includes('dawn-weaving-mill'), 'dawn-weaving-mill scene must exist');
  assert.ok(uniqueScenes.includes('day-night-loom'), 'day-night-loom scene must exist');
  assert.ok(uniqueScenes.includes('sky-cloth-drying-terrace'), 'sky-cloth-drying-terrace scene must exist');

  const requiredIds = [
    'dw-hall-figure', 'dw-hall-endings', 'dw-hall-note', 'dw-continue', 'dw-new', 'dw-courier-link',
    'dw-loom-figure', 'dw-board', 'dw-light-status', 'dw-night-status', 'dw-loom-panel',
    'dw-mode-cycle', 'dw-mode-light', 'dw-mode-night', 'dw-mode-erase', 'dw-mode-hint',
    'dw-example-btn', 'dw-example-note', 'dw-example-pattern', 'dw-sample-btn', 'dw-abandon',
    'dw-terrace-figure', 'dw-terrace-pattern', 'dw-terrace-panel', 'dw-terrace-title',
    'dw-terrace-story', 'dw-terrace-target', 'dw-deliver', 'dw-unweave',
    'dw-entry-threshold', 'dw-entry-note-threshold', 'dw-entry-response-threshold',
    'dw-entry-remembrance', 'dw-entry-note-remembrance', 'dw-entry-response-remembrance',
    'dw-memory', 'dw-codex', 'dw-codex-grid', 'dw-hook',
    'dawn-weaving-mill-link', 'day-night-loom-link', 'sky-cloth-drying-terrace-link',
    'dw-courier-threshold', 'dw-echo-threshold', 'dw-courier-return-threshold',
    'dw-courier-remembrance', 'dw-echo-remembrance', 'dw-courier-return-remembrance',
    'dw-courier-unending-gallery', 'dw-echo-unending-gallery', 'dw-courier-return-unending-gallery',
  ];
  for (let i = 0; i < 9; i++) requiredIds.push(`dw-cell-${i}`);

  for (const id of requiredIds) {
    assert.ok(elementRegistry.has(id), `Required HTML ID missing: #${id}`);
  }

  // Pre-sync DOM visibility checks: dw-new is initially hidden in HTML markup
  const initialNewEl = elementRegistry.get('dw-new');
  assert.strictEqual(initialNewEl.hidden, true, 'dw-new must initially have hidden attr in HTML markup');

  // Verify hrefs in HTML for nav links
  assert.strictEqual(elementRegistry.get('dawn-weaving-mill-link').href, '#dawn-weaving-mill');
  assert.strictEqual(elementRegistry.get('day-night-loom-link').href, '#day-night-loom');
  assert.strictEqual(elementRegistry.get('sky-cloth-drying-terrace-link').href, '#sky-cloth-drying-terrace');

  const webpFiles = [
    'v101-dawn-weaving-mill.webp',
    'v101-day-night-loom.webp',
    'v101-sky-cloth-drying-terrace.webp',
  ];
  for (const file of webpFiles) {
    const p = resolve(rootDir, 'assets', file);
    assert.ok(existsSync(p), `WebP image must exist: ${file}`);
    const size = readFileSync(p).length;
    assert.ok(size < 300 * 1024, `Image ${file} size ${size} bytes must be < 300KB`);
  }

  assert.ok(stylesCss.includes('.dw-board'), 'styles.css must contain .dw-board');
  assert.ok(stylesCss.includes('.dw-tile'), 'styles.css must contain .dw-tile');
  assert.ok(stylesCss.includes('.dw-receipt-card'), 'styles.css must contain .dw-receipt-card');
});

test('v101: Seven pending kinds lifecycle, listener triggers, and saved JSON restore across targets', () => {
  // We will construct the 7 kinds through trusted listener clicks:
  // 1. entry from threshold
  // 2. entry from remembrance
  // 3. start
  // 4. sample
  // 5. unweave
  // 6. delivery (3 outcomes: light, night, dual)
  // 7. courier-return & abandon

  // 1. Entry from threshold
  const h1 = createV101Harness({ currentHash: 'threshold' });
  h1.syncAll();
  assert.strictEqual(h1.$('dw-entry-threshold').hidden, false);
  assert.strictEqual(h1.$('dw-entry-threshold').disabled, false);
  h1.click('dw-entry-threshold', true);
  const pEntryThresh = h1.get().pending;
  assert.strictEqual(pEntryThresh.kind, 'entry');
  assert.strictEqual(pEntryThresh.source, 'threshold');
  assert.strictEqual(pEntryThresh.target, 'dawn-weaving-mill');

  // 2. Entry from remembrance
  const h2 = createV101Harness({ currentHash: 'remembrance' });
  h2.syncAll();
  h2.click('dw-entry-remembrance', true);
  const pEntryRem = h2.get().pending;
  assert.strictEqual(pEntryRem.kind, 'entry');
  assert.strictEqual(pEntryRem.source, 'remembrance');

  // Test pending order: route -> resolve -> replay across harness target/source/unrelated
  const h2Target = createV101Harness({ initialStore: h2.get(), currentHash: 'dawn-weaving-mill' });
  const r2T = h2Target.resolveScene('dawn-weaving-mill');
  assert.strictEqual(r2T, 'dawn-weaving-mill');
  h2Target.resolvePending(r2T);
  h2Target.replayPending(r2T);
  assert.strictEqual(h2Target.get().visited.hall, true);
  assert.strictEqual(h2Target.get().pending, null);

  // 3. Start
  h2Target.syncAll();
  assert.strictEqual(h2Target.$('dw-new').hidden, false, 'dw-new becomes visible in hall when visited');
  assert.strictEqual(h2Target.$('dw-new').disabled, false);
  h2Target.click('dw-new', true);
  const pStart = h2Target.get().pending;
  assert.strictEqual(pStart.kind, 'start');
  assert.strictEqual(pStart.source, 'dawn-weaving-mill');
  assert.strictEqual(pStart.target, 'day-night-loom');

  // 4. Sample
  const hLoom = createV101Harness({
    currentHash: 'day-night-loom',
    initialStore: {
      version: 101,
      visited: { hall: true, loom: true, terrace: false },
      draft: { pattern: 'lll......' },
      endings: [],
      latestWeaveByEnding: { 'the-hundred-and-first-day-began': '', 'the-night-learned-to-live-without-dawn': '', 'day-and-night-lived-apart': '' },
      weaveRuns: 0,
      lastOutcome: '',
      activeCourier: null,
      pending: null,
    },
  });
  hLoom.syncAll();
  assert.strictEqual(hLoom.$('dw-sample-btn').disabled, false);
  hLoom.click('dw-sample-btn', true);
  const pSample = hLoom.get().pending;
  assert.strictEqual(pSample.kind, 'sample');
  assert.strictEqual(pSample.source, 'day-night-loom');
  assert.strictEqual(pSample.target, 'sky-cloth-drying-terrace');

  // 5. Unweave
  const hTerrace = createV101Harness({
    currentHash: 'sky-cloth-drying-terrace',
    initialStore: {
      version: 101,
      visited: { hall: true, loom: true, terrace: true },
      draft: { pattern: 'lll......' },
      endings: [],
      latestWeaveByEnding: { 'the-hundred-and-first-day-began': '', 'the-night-learned-to-live-without-dawn': '', 'day-and-night-lived-apart': '' },
      weaveRuns: 0,
      lastOutcome: '',
      activeCourier: null,
      pending: null,
    },
  });
  hTerrace.syncAll();
  hTerrace.click('dw-unweave', true);
  const pUnweave = hTerrace.get().pending;
  assert.strictEqual(pUnweave.kind, 'unweave');
  assert.strictEqual(pUnweave.target, 'day-night-loom');

  // 6. Delivery (3 outcomes tested)
  // Delivery light
  const hDelivL = createV101Harness({
    currentHash: 'sky-cloth-drying-terrace',
    initialStore: {
      version: 101,
      visited: { hall: true, loom: true, terrace: true },
      draft: { pattern: 'lll......' },
      endings: [],
      latestWeaveByEnding: { 'the-hundred-and-first-day-began': '', 'the-night-learned-to-live-without-dawn': '', 'day-and-night-lived-apart': '' },
      weaveRuns: 0,
      lastOutcome: '',
      activeCourier: null,
      pending: null,
    },
  });
  hDelivL.click('dw-deliver', true);
  assert.strictEqual(hDelivL.get().pending.target, 'threshold');

  // Delivery night
  const hDelivN = createV101Harness({
    currentHash: 'sky-cloth-drying-terrace',
    initialStore: {
      version: 101,
      visited: { hall: true, loom: true, terrace: true },
      draft: { pattern: 'nnn......' },
      endings: [],
      latestWeaveByEnding: { 'the-hundred-and-first-day-began': '', 'the-night-learned-to-live-without-dawn': '', 'day-and-night-lived-apart': '' },
      weaveRuns: 0,
      lastOutcome: '',
      activeCourier: null,
      pending: null,
    },
  });
  hDelivN.click('dw-deliver', true);
  assert.strictEqual(hDelivN.get().pending.target, 'remembrance');

  // Delivery dual
  const hDelivD = createV101Harness({
    currentHash: 'sky-cloth-drying-terrace',
    initialStore: {
      version: 101,
      visited: { hall: true, loom: true, terrace: true },
      draft: { pattern: 'lll...nnn' },
      endings: [],
      latestWeaveByEnding: { 'the-hundred-and-first-day-began': '', 'the-night-learned-to-live-without-dawn': '', 'day-and-night-lived-apart': '' },
      weaveRuns: 0,
      lastOutcome: '',
      activeCourier: null,
      pending: null,
    },
  });
  hDelivD.click('dw-deliver', true);
  assert.strictEqual(hDelivD.get().pending.target, 'unending-gallery');

  // 7. Courier return & Abandon
  const hCour = createV101Harness({
    currentHash: 'unending-gallery',
    initialStore: {
      version: 101,
      visited: { hall: true, loom: true, terrace: true },
      draft: { pattern: '.........' },
      endings: ['day-and-night-lived-apart'],
      latestWeaveByEnding: { 'the-hundred-and-first-day-began': '', 'the-night-learned-to-live-without-dawn': '', 'day-and-night-lived-apart': 'lll...nnn' },
      weaveRuns: 1,
      lastOutcome: 'day-and-night-lived-apart',
      activeCourier: { outcome: 'day-and-night-lived-apart', pattern: 'lll...nnn' },
      pending: null,
    },
  });
  hCour.syncAll();
  hCour.click('dw-courier-return-unending-gallery', true);
  assert.strictEqual(hCour.get().pending.kind, 'courier-return');
  assert.strictEqual(hCour.get().pending.target, 'dawn-weaving-mill');

  // Abandon
  const hAban = createV101Harness({
    currentHash: 'day-night-loom',
    initialStore: {
      version: 101,
      visited: { hall: true, loom: true, terrace: true },
      draft: { pattern: 'lll......' },
      endings: [],
      latestWeaveByEnding: { 'the-hundred-and-first-day-began': '', 'the-night-learned-to-live-without-dawn': '', 'day-and-night-lived-apart': '' },
      weaveRuns: 0,
      lastOutcome: '',
      activeCourier: null,
      pending: null,
    },
  });
  hAban.syncAll();
  hAban.click('dw-abandon', true);
  assert.strictEqual(hAban.get().pending.kind, 'abandon');
  assert.strictEqual(hAban.get().pending.target, 'dawn-weaving-mill');
});

test('v101: Repeated arrival at delivery target books only once; source guard keeps source figure visible', () => {
  const deliverySaved = {
    version: 101,
    visited: { hall: true, loom: true, terrace: true },
    draft: { pattern: 'lll......' },
    endings: [],
    latestWeaveByEnding: { 'the-hundred-and-first-day-began': '', 'the-night-learned-to-live-without-dawn': '', 'day-and-night-lived-apart': '' },
    weaveRuns: 0,
    lastOutcome: '',
    activeCourier: null,
    pending: {
      feedback: '门外的人第一次有了影子。门仍然开着，影子却留在了外面。',
      kind: 'delivery',
      outcome: 'the-hundred-and-first-day-began',
      pattern: 'lll......',
      source: 'sky-cloth-drying-terrace',
      target: 'threshold',
    },
  };

  const h = createV101Harness({ initialStore: deliverySaved, currentHash: 'threshold' });
  const t1 = h.resolveScene('threshold');
  h.go(t1);
  h.resolvePending(t1);
  h.replayPending(t1);

  assert.strictEqual(h.get().weaveRuns, 1);
  assert.strictEqual(h.get().pending, null);

  // Second arrival must not book again
  h.resolvePending('threshold');
  h.replayPending('threshold');
  assert.strictEqual(h.get().weaveRuns, 1);

  // Source guard: terrace figure remains visible when pending from terrace
  const hSrc = createV101Harness({ initialStore: deliverySaved, currentHash: 'sky-cloth-drying-terrace' });
  assert.strictEqual(hSrc.terraceOk(), true);
  hSrc.syncAll();
  assert.strictEqual(hSrc.$('dw-terrace-figure').hidden, false);
});

test('v101: Upstream v100 byte-snapshot invariance, activeMourner preserved, and cold lock verification', () => {
  const v100Snapshot = JSON.stringify({
    pending: null,
    courtOutcomes: ['mourning-without-crying', 'century-without-dawn', 'candle-that-never-lights'],
    activeMourner: { rite: 'mourning-unending', tokens: 42 },
  });

  const h = createV101Harness({
    currentHash: 'remembrance',
    v100Pending: null,
    v100ActiveMourner: { rite: 'mourning-unending', tokens: 42 },
  });

  // Snapshot before
  const beforeBytes = h.mem.get('goddead_v100_hundredth_wake');
  assert.strictEqual(beforeBytes, v100Snapshot);

  // Operate v101 actions
  h.click('dw-entry-remembrance', true);
  h.go('dawn-weaving-mill');
  h.resolvePending('dawn-weaving-mill');
  h.syncAll();

  // Snapshot after
  const afterBytes = h.mem.get('goddead_v100_hundredth_wake');
  assert.strictEqual(afterBytes, beforeBytes, 'v100 storage must be strictly untouched by v101 actions');

  // Verify v100 pending locks all new routes and bridges
  const hLocked = createV101Harness({ v100Pending: { kind: 'wake-incense', target: 'wake-hall' } });
  assert.strictEqual(hLocked.available(), false);
  assert.strictEqual(hLocked.bridge('threshold'), false);
  assert.strictEqual(hLocked.hallOk(), false);
  assert.strictEqual(hLocked.loomOk(), false);
  assert.strictEqual(hLocked.terraceOk(), false);
});

test('v101: Handler wrong scene, pending locks, raw arrays forgery, and unexpected keys rejection', () => {
  const h = createV101Harness({ currentHash: 'corridor' });

  // Calling cell / start / mode while in wrong scene must not progress
  h.chooseDwCell(0);
  assert.strictEqual(h.get().draft.pattern, '.........');

  h.chooseDwStart(true);
  assert.strictEqual(h.get().pending, null);

  h.chooseDwSample();
  assert.strictEqual(h.get().pending, null);

  h.chooseDwDelivery();
  assert.strictEqual(h.get().pending, null);

  // Forged raw array input
  assert.deepStrictEqual(h.normalize([]).draft.pattern, '.........');

  // Forged object with unknown keys
  const forged = {
    version: 101,
    visited: { hall: true, loom: true, terrace: true },
    draft: { pattern: 'lll......' },
    endings: ['the-hundred-and-first-day-began'],
    latestWeaveByEnding: { 'the-hundred-and-first-day-began': 'lll......' },
    weaveRuns: 1,
    lastOutcome: 'the-hundred-and-first-day-began',
    activeCourier: null,
    pending: null,
    extraHack: true,
  };
  const norm = h.normalize(forged);
  assert.strictEqual('extraHack' in norm, false, 'normalize must strip unexpected root properties');
});

test('v101: Courier link in hall exact href to delivery destination and active courier lifecycle', () => {
  const h = createV101Harness({
    currentHash: 'dawn-weaving-mill',
    initialStore: {
      version: 101,
      visited: { hall: true, loom: true, terrace: true },
      draft: { pattern: '.........' },
      endings: ['day-and-night-lived-apart'],
      latestWeaveByEnding: {
        'the-hundred-and-first-day-began': '',
        'the-night-learned-to-live-without-dawn': '',
        'day-and-night-lived-apart': 'lll...nnn',
      },
      weaveRuns: 1,
      lastOutcome: 'day-and-night-lived-apart',
      activeCourier: { outcome: 'day-and-night-lived-apart', pattern: 'lll...nnn' },
      pending: null,
    },
  });

  h.syncAll();
  const courierLink = h.$('dw-courier-link');
  assert.strictEqual(courierLink.hidden, false);
  assert.strictEqual(courierLink.getAttribute('href'), '#unending-gallery');

  // New button must be disabled while courier is active
  assert.strictEqual(h.$('dw-new').disabled, true);
});

function v101FlowExtractMaterials(container) {
  if (!container || !container.children) return [];
  return container.children.map((child) => child.getAttribute('data-material'));
}

function v101FlowExecuteStep(h, sceneTarget) {
  const resolved = h.resolveScene(sceneTarget);
  h.go(resolved);
  h.resolvePending(resolved);
  h.replayPending(resolved);
  h.syncAll();
  return resolved;
}

test('v101: Serial THREE endings from clean ownstate via captured trusted listener clicks only', () => {
  const initialV100 = JSON.stringify({
    pending: null,
    courtOutcomes: ['mourning-without-crying', 'century-without-dawn', 'candle-that-never-lights'],
    activeMourner: null,
  });

  const h = createV101Harness({ currentHash: 'threshold' });
  assert.strictEqual(h.mem.get('goddead_v100_hundredth_wake'), initialV100);
  assert.strictEqual(h.mem.has('goddead_v101_dawn_weaving'), false);

  // --- 1. First ending: Day / Light (第一百零一天) ---
  h.syncAll();
  h.click('dw-entry-threshold', true);
  const pEntry1 = h.get().pending;
  assert.strictEqual(pEntry1.kind, 'entry');
  assert.strictEqual(pEntry1.source, 'threshold');
  assert.strictEqual(pEntry1.target, 'dawn-weaving-mill');

  v101FlowExecuteStep(h, 'dawn-weaving-mill');
  assert.strictEqual(h.get().visited.hall, true);
  assert.strictEqual(h.get().pending, null);

  // Hall -> start new weave
  h.click('dw-new', true);
  assert.strictEqual(h.get().pending.kind, 'start');
  assert.strictEqual(h.get().pending.target, 'day-night-loom');

  v101FlowExecuteStep(h, 'day-night-loom');
  assert.strictEqual(h.get().visited.loom, true);
  assert.strictEqual(h.get().draft.pattern, '.........');

  // Edit via light mode cell 0, 1, 2
  h.click('dw-mode-light', true);
  assert.strictEqual(h.getMode(), 'light');
  h.click('dw-cell-0', true);
  h.click('dw-cell-1', true);
  h.click('dw-cell-2', true);
  assert.strictEqual(h.get().draft.pattern, 'lll......');

  // Sample -> terrace
  h.click('dw-sample-btn', true);
  const pSample1 = h.get().pending;
  assert.strictEqual(pSample1.kind, 'sample');
  assert.strictEqual(pSample1.outcome, 'the-hundred-and-first-day-began');
  assert.strictEqual(pSample1.pattern, 'lll......');

  v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');
  assert.strictEqual(h.get().visited.terrace, true);

  const terraceMat1 = v101FlowExtractMaterials(h.$('dw-terrace-pattern'));
  assert.deepStrictEqual(terraceMat1, ['l', 'l', 'l', '.', '.', '.', '.', '.', '.']);

  // Deliver -> threshold
  h.click('dw-deliver', true);
  const pDeliv1 = h.get().pending;
  assert.strictEqual(pDeliv1.kind, 'delivery');
  assert.strictEqual(pDeliv1.outcome, 'the-hundred-and-first-day-began');
  assert.strictEqual(pDeliv1.target, 'threshold');

  // Before arrival: draft is frozen in pending, endings not recorded yet
  assert.strictEqual(h.get().endings.length, 0);
  assert.strictEqual(h.get().weaveRuns, 0);

  v101FlowExecuteStep(h, 'threshold');
  assert.deepStrictEqual(h.get().endings, ['the-hundred-and-first-day-began']);
  assert.strictEqual(h.get().weaveRuns, 1);
  assert.strictEqual(h.get().lastOutcome, 'the-hundred-and-first-day-began');
  assert.deepStrictEqual(h.get().activeCourier, {
    outcome: 'the-hundred-and-first-day-began',
    pattern: 'lll......',
  });

  const receiptMat1 = v101FlowExtractMaterials(h.$('dw-courier-pattern-threshold'));
  assert.deepStrictEqual(receiptMat1, terraceMat1);

  // Return to hall via courier receipt
  h.click('dw-courier-return-threshold', true);
  v101FlowExecuteStep(h, 'dawn-weaving-mill');
  assert.strictEqual(h.get().activeCourier, null);

  // --- 2. Second ending: Night (不用天亮的夜) via remembrance entry ---
  v101FlowExecuteStep(h, 'remembrance');
  h.click('dw-entry-remembrance', true);
  v101FlowExecuteStep(h, 'dawn-weaving-mill');

  h.click('dw-new', true);
  v101FlowExecuteStep(h, 'day-night-loom');

  h.click('dw-mode-night', true);
  assert.strictEqual(h.getMode(), 'night');
  h.click('dw-cell-0', true);
  h.click('dw-cell-1', true);
  h.click('dw-cell-2', true);
  assert.strictEqual(h.get().draft.pattern, 'nnn......');

  h.click('dw-sample-btn', true);
  v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');

  const terraceMat2 = v101FlowExtractMaterials(h.$('dw-terrace-pattern'));
  assert.deepStrictEqual(terraceMat2, ['n', 'n', 'n', '.', '.', '.', '.', '.', '.']);

  h.click('dw-deliver', true);
  assert.strictEqual(h.get().pending.target, 'remembrance');
  v101FlowExecuteStep(h, 'remembrance');
  assert.strictEqual(h.get().weaveRuns, 2);
  assert.deepStrictEqual(h.get().endings, [
    'the-hundred-and-first-day-began',
    'the-night-learned-to-live-without-dawn',
  ]);

  const receiptMat2 = v101FlowExtractMaterials(h.$('dw-courier-pattern-remembrance'));
  assert.deepStrictEqual(receiptMat2, terraceMat2);

  h.click('dw-courier-return-remembrance', true);
  v101FlowExecuteStep(h, 'dawn-weaving-mill');
  assert.strictEqual(h.get().activeCourier, null);

  // --- 3. Third ending: Dual (昼夜从此分居) ---
  h.click('dw-new', true);
  v101FlowExecuteStep(h, 'day-night-loom');

  h.click('dw-mode-light', true);
  h.click('dw-cell-0', true);
  h.click('dw-cell-1', true);
  h.click('dw-cell-2', true);

  h.click('dw-mode-night', true);
  h.click('dw-cell-6', true);
  h.click('dw-cell-7', true);
  h.click('dw-cell-8', true);
  assert.strictEqual(h.get().draft.pattern, 'lll...nnn');

  h.click('dw-sample-btn', true);
  v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');

  const terraceMat3 = v101FlowExtractMaterials(h.$('dw-terrace-pattern'));
  assert.deepStrictEqual(terraceMat3, ['l', 'l', 'l', '.', '.', '.', 'n', 'n', 'n']);

  h.click('dw-deliver', true);
  assert.strictEqual(h.get().pending.target, 'unending-gallery');
  v101FlowExecuteStep(h, 'unending-gallery');
  assert.strictEqual(h.get().weaveRuns, 3);
  assert.deepStrictEqual(h.get().endings, [
    'the-hundred-and-first-day-began',
    'the-night-learned-to-live-without-dawn',
    'day-and-night-lived-apart',
  ]);

  const receiptMat3 = v101FlowExtractMaterials(h.$('dw-courier-pattern-unending-gallery'));
  assert.deepStrictEqual(receiptMat3, terraceMat3);

  h.click('dw-courier-return-unending-gallery', true);
  v101FlowExecuteStep(h, 'dawn-weaving-mill');
  assert.strictEqual(h.get().activeCourier, null);

  // Verify codex hook and latest map independent values
  assert.strictEqual(h.get().latestWeaveByEnding['the-hundred-and-first-day-began'], 'lll......');
  assert.strictEqual(h.get().latestWeaveByEnding['the-night-learned-to-live-without-dawn'], 'nnn......');
  assert.strictEqual(h.get().latestWeaveByEnding['day-and-night-lived-apart'], 'lll...nnn');

  // --- 4. Repeat Light Pattern with different weave: llll..... gives runs=4, latest light updated ---
  h.click('dw-new', true);
  v101FlowExecuteStep(h, 'day-night-loom');

  h.click('dw-mode-light', true);
  h.click('dw-cell-0', true);
  h.click('dw-cell-1', true);
  h.click('dw-cell-2', true);
  h.click('dw-cell-3', true);
  assert.strictEqual(h.get().draft.pattern, 'llll.....');

  h.click('dw-sample-btn', true);
  v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');
  h.click('dw-deliver', true);
  v101FlowExecuteStep(h, 'threshold');

  assert.strictEqual(h.get().weaveRuns, 4);
  assert.strictEqual(h.get().endings.length, 3);
  assert.strictEqual(h.get().latestWeaveByEnding['the-hundred-and-first-day-began'], 'llll.....');
  assert.strictEqual(h.get().latestWeaveByEnding['the-night-learned-to-live-without-dawn'], 'nnn......');
  assert.strictEqual(h.get().latestWeaveByEnding['day-and-night-lived-apart'], 'lll...nnn');

  // Verify hook visible on completion
  assert.strictEqual(h.$('dw-hook').hidden, false);

  // Upstream storage byte invariance check
  assert.strictEqual(h.mem.get('goddead_v100_hundredth_wake'), initialV100);
});
test('v101: Draft, edit, and example lifecycle from clean entry without artificial fields', () => {
  const h = createV101Harness({ currentHash: 'threshold' });
  h.syncAll();

  // False untrusted events must be strictly ignored
  h.click('dw-entry-threshold', false);
  assert.strictEqual(h.get().pending, null);

  h.click('dw-entry-threshold', true);
  v101FlowExecuteStep(h, 'dawn-weaving-mill');

  h.click('dw-new', true);
  v101FlowExecuteStep(h, 'day-night-loom');

  // Mode defaults to 'cycle'
  assert.strictEqual(h.getMode(), 'cycle');

  // Untrusted cell click ignored
  h.click('dw-cell-0', false);
  assert.strictEqual(h.get().draft.pattern, '.........');

  // Cycle material on cell 0: . -> l -> n -> .
  h.click('dw-cell-0', true);
  assert.strictEqual(h.get().draft.pattern, 'l........');
  const btnCell0L = h.$('dw-cell-0');
  assert.strictEqual(btnCell0L.getAttribute('data-material'), 'l');
  assert.strictEqual(btnCell0L.children[0].textContent, '☀');
  assert.strictEqual(btnCell0L.children[1].textContent, '晨光');
  assert.ok(btnCell0L.getAttribute('aria-label').includes('第1行第1列 晨光'));

  h.click('dw-cell-0', true);
  assert.strictEqual(h.get().draft.pattern, 'n........');
  const btnCell0N = h.$('dw-cell-0');
  assert.strictEqual(btnCell0N.getAttribute('data-material'), 'n');
  assert.strictEqual(btnCell0N.children[0].textContent, '☾');
  assert.strictEqual(btnCell0N.children[1].textContent, '夜线');
  assert.ok(btnCell0N.getAttribute('aria-label').includes('第1行第1列 夜线'));

  h.click('dw-cell-0', true);
  assert.strictEqual(h.get().draft.pattern, '.........');
  const btnCell0Dot = h.$('dw-cell-0');
  assert.strictEqual(btnCell0Dot.getAttribute('data-material'), '.');
  assert.strictEqual(btnCell0Dot.children[0].textContent, '·');
  assert.strictEqual(btnCell0Dot.children[1].textContent, '空白');

  // Explicit mode paint & persistence check
  h.click('dw-mode-night', true);
  assert.strictEqual(h.getMode(), 'night');
  h.click('dw-cell-4', true);
  assert.strictEqual(h.get().draft.pattern, '....n....');
  // Second click in night mode stays night
  h.click('dw-cell-4', true);
  assert.strictEqual(h.get().draft.pattern, '....n....');

  // Erase mode
  h.click('dw-mode-erase', true);
  assert.strictEqual(h.getMode(), 'erase');
  h.click('dw-cell-4', true);
  assert.strictEqual(h.get().draft.pattern, '.........');

  // Example button lifecycle: first index 0 shown then cycle 3
  assert.strictEqual(h.getExampleShown(), false);
  assert.strictEqual(h.getExampleIndex(), -1);

  h.click('dw-example-btn', true);
  assert.strictEqual(h.getExampleShown(), true);
  assert.strictEqual(h.getExampleIndex(), 0);
  assert.strictEqual(h.$('dw-example-pattern').hidden, false);
  const exMat0 = v101FlowExtractMaterials(h.$('dw-example-pattern'));
  assert.deepStrictEqual(exMat0, ['l', 'l', 'l', '.', '.', '.', '.', '.', '.']);

  h.click('dw-example-btn', true);
  assert.strictEqual(h.getExampleIndex(), 1);
  const exMat1 = v101FlowExtractMaterials(h.$('dw-example-pattern'));
  assert.deepStrictEqual(exMat1, ['n', 'n', 'n', '.', '.', '.', '.', '.', '.']);

  h.click('dw-example-btn', true);
  assert.strictEqual(h.getExampleIndex(), 2);
  const exMat2 = v101FlowExtractMaterials(h.$('dw-example-pattern'));
  assert.deepStrictEqual(exMat2, ['l', 'l', 'l', '.', '.', '.', 'n', 'n', 'n']);

  h.click('dw-example-btn', true);
  assert.strictEqual(h.getExampleIndex(), 0);

  // Verify examples did not pollute draft
  assert.strictEqual(h.get().draft.pattern, '.........');

  // Paint a valid pattern for sample-unweave test naturally via clicks
  h.click('dw-mode-light', true);
  h.click('dw-cell-0', true);
  h.click('dw-cell-1', true);
  h.click('dw-cell-2', true);
  assert.strictEqual(h.get().draft.pattern, 'lll......');

  // Sample -> Terrace -> Unweave -> Loom keeps pattern
  h.click('dw-sample-btn', true);
  v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');
  assert.strictEqual(h.get().draft.pattern, 'lll......');

  h.click('dw-unweave', true);
  v101FlowExecuteStep(h, 'day-night-loom');
  assert.strictEqual(h.get().draft.pattern, 'lll......');

  // Abandon -> Hall -> Continue keeps pattern and runs=0
  h.click('dw-abandon', true);
  v101FlowExecuteStep(h, 'dawn-weaving-mill');
  assert.strictEqual(h.get().draft.pattern, 'lll......');
  assert.strictEqual(h.get().weaveRuns, 0);

  h.click('dw-continue', true);
  v101FlowExecuteStep(h, 'day-night-loom');
  assert.strictEqual(h.get().draft.pattern, 'lll......');

  // Reload naturally painted draft from actual store in a fresh harness: mode resets to cycle, example hidden, pattern preserved
  const hReload = createV101Harness({ initialStore: h.get(), currentHash: 'day-night-loom' });
  v101FlowExecuteStep(hReload, 'day-night-loom');
  assert.strictEqual(hReload.get().draft.pattern, 'lll......');
  assert.strictEqual(hReload.getMode(), 'cycle');
  assert.strictEqual(hReload.getExampleShown(), false);
  assert.strictEqual(hReload.$('dw-example-pattern').hidden, true);

  // Fresh New start resets draft to empty
  h.click('dw-abandon', true);
  v101FlowExecuteStep(h, 'dawn-weaving-mill');
  h.click('dw-new', true);
  v101FlowExecuteStep(h, 'day-night-loom');
  assert.strictEqual(h.get().draft.pattern, '.........');
});
test('v101: Canonical pending cold matrix from live flow snapshots', () => {
  // We produce genuine pending snapshots across all flow stages from clean state (10 snapshots)
  const snapshots = [];

  // Snapshot 1: Entry from threshold
  {
    const h = createV101Harness({ currentHash: 'threshold' });
    h.syncAll();
    h.click('dw-entry-threshold', true);
    snapshots.push({ label: 'entry-threshold', st: h.get(), p: h.get().pending });
  }

  // Snapshot 2: Entry from remembrance
  {
    const h = createV101Harness({ currentHash: 'remembrance' });
    h.syncAll();
    h.click('dw-entry-remembrance', true);
    snapshots.push({ label: 'entry-remembrance', st: h.get(), p: h.get().pending });
  }

  // Snapshot 3: Start from hall
  {
    const h = createV101Harness({ currentHash: 'threshold' });
    h.syncAll();
    h.click('dw-entry-threshold', true);
    v101FlowExecuteStep(h, 'dawn-weaving-mill');
    h.click('dw-new', true);
    snapshots.push({ label: 'start', st: h.get(), p: h.get().pending });
  }

  // Snapshot 4: Sample from loom
  {
    const h = createV101Harness({ currentHash: 'threshold' });
    h.syncAll();
    h.click('dw-entry-threshold', true);
    v101FlowExecuteStep(h, 'dawn-weaving-mill');
    h.click('dw-new', true);
    v101FlowExecuteStep(h, 'day-night-loom');
    h.click('dw-mode-light', true);
    h.click('dw-cell-0', true);
    h.click('dw-cell-1', true);
    h.click('dw-cell-2', true);
    h.click('dw-sample-btn', true);
    snapshots.push({ label: 'sample', st: h.get(), p: h.get().pending });
  }

  // Snapshot 5: Unweave from terrace
  {
    const h = createV101Harness({ currentHash: 'threshold' });
    h.syncAll();
    h.click('dw-entry-threshold', true);
    v101FlowExecuteStep(h, 'dawn-weaving-mill');
    h.click('dw-new', true);
    v101FlowExecuteStep(h, 'day-night-loom');
    h.click('dw-mode-light', true);
    h.click('dw-cell-0', true);
    h.click('dw-cell-1', true);
    h.click('dw-cell-2', true);
    h.click('dw-sample-btn', true);
    v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');
    h.click('dw-unweave', true);
    snapshots.push({ label: 'unweave', st: h.get(), p: h.get().pending });
  }

  // Snapshot 6: Delivery (Light -> threshold)
  {
    const h = createV101Harness({ currentHash: 'threshold' });
    h.syncAll();
    h.click('dw-entry-threshold', true);
    v101FlowExecuteStep(h, 'dawn-weaving-mill');
    h.click('dw-new', true);
    v101FlowExecuteStep(h, 'day-night-loom');
    h.click('dw-mode-light', true);
    h.click('dw-cell-0', true);
    h.click('dw-cell-1', true);
    h.click('dw-cell-2', true);
    h.click('dw-sample-btn', true);
    v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');
    h.click('dw-deliver', true);
    snapshots.push({ label: 'delivery-light', st: h.get(), p: h.get().pending });
  }

  // Snapshot 7: Delivery (Night -> remembrance)
  {
    const h = createV101Harness({ currentHash: 'remembrance' });
    h.syncAll();
    h.click('dw-entry-remembrance', true);
    v101FlowExecuteStep(h, 'dawn-weaving-mill');
    h.click('dw-new', true);
    v101FlowExecuteStep(h, 'day-night-loom');
    h.click('dw-mode-night', true);
    h.click('dw-cell-0', true);
    h.click('dw-cell-1', true);
    h.click('dw-cell-2', true);
    h.click('dw-sample-btn', true);
    v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');
    h.click('dw-deliver', true);
    snapshots.push({ label: 'delivery-night', st: h.get(), p: h.get().pending });
  }

  // Snapshot 8: Delivery (Dual -> unending-gallery)
  {
    const h = createV101Harness({ currentHash: 'threshold' });
    h.syncAll();
    h.click('dw-entry-threshold', true);
    v101FlowExecuteStep(h, 'dawn-weaving-mill');
    h.click('dw-new', true);
    v101FlowExecuteStep(h, 'day-night-loom');
    h.click('dw-mode-light', true);
    h.click('dw-cell-0', true);
    h.click('dw-cell-1', true);
    h.click('dw-cell-2', true);
    h.click('dw-mode-night', true);
    h.click('dw-cell-6', true);
    h.click('dw-cell-7', true);
    h.click('dw-cell-8', true);
    h.click('dw-sample-btn', true);
    v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');
    h.click('dw-deliver', true);
    snapshots.push({ label: 'delivery-dual', st: h.get(), p: h.get().pending });
  }

  // Snapshot 9: Courier return from threshold
  {
    const h = createV101Harness({ currentHash: 'threshold' });
    h.syncAll();
    h.click('dw-entry-threshold', true);
    v101FlowExecuteStep(h, 'dawn-weaving-mill');
    h.click('dw-new', true);
    v101FlowExecuteStep(h, 'day-night-loom');
    h.click('dw-mode-light', true);
    h.click('dw-cell-0', true);
    h.click('dw-cell-1', true);
    h.click('dw-cell-2', true);
    h.click('dw-sample-btn', true);
    v101FlowExecuteStep(h, 'sky-cloth-drying-terrace');
    h.click('dw-deliver', true);
    v101FlowExecuteStep(h, 'threshold');
    h.click('dw-courier-return-threshold', true);
    snapshots.push({ label: 'courier-return', st: h.get(), p: h.get().pending });
  }

  // Snapshot 10: Abandon from loom
  {
    const h = createV101Harness({ currentHash: 'threshold' });
    h.syncAll();
    h.click('dw-entry-threshold', true);
    v101FlowExecuteStep(h, 'dawn-weaving-mill');
    h.click('dw-new', true);
    v101FlowExecuteStep(h, 'day-night-loom');
    h.click('dw-abandon', true);
    snapshots.push({ label: 'abandon', st: h.get(), p: h.get().pending });
  }

  assert.strictEqual(snapshots.length, 10);

  // Verify each captured snapshot behavior across Source, Target, and Unrelated routes
  for (const { label, st, p } of snapshots) {
    assert.ok(p !== null, `Snapshot pending must be non-null for ${label}`);
    const srcScene = p.kind === 'courier-return' ? p.from : p.source;
    const tgtScene = p.target;

    // 1. Fresh harness at Source Scene preserves pending, feedback, keeps figure/panel visible, schedules auto-advance
    const hSource = createV101Harness({ initialStore: st, currentHash: srcScene });
    const resolvedSrc = hSource.resolveScene(srcScene);
    assert.strictEqual(resolvedSrc, srcScene, `Source resolution mismatch for ${label}`);
    hSource.go(resolvedSrc);
    hSource.resolvePending(resolvedSrc);
    hSource.replayPending(resolvedSrc);

    assert.notStrictEqual(hSource.get().pending, null, `Pending should be preserved at source for ${label}`);
    assert.strictEqual(hSource.get().pending.kind, p.kind);
    assert.strictEqual(hSource.get().pending.target, tgtScene);
    assert.strictEqual(hSource.schedules.length, 1, `AutoAdvance schedule expected for ${label}`);
    assert.strictEqual(hSource.schedules[0].target, tgtScene);

    // Check visible source figure/panel where applicable
    if (srcScene === 'dawn-weaving-mill') {
      assert.strictEqual(hSource.$('dw-hall-figure').hidden, false);
    } else if (srcScene === 'day-night-loom') {
      assert.strictEqual(hSource.$('dw-loom-figure').hidden, false);
      assert.strictEqual(hSource.$('dw-loom-panel').hidden, false);
    } else if (srcScene === 'sky-cloth-drying-terrace') {
      assert.strictEqual(hSource.$('dw-terrace-figure').hidden, false);
      assert.strictEqual(hSource.$('dw-terrace-panel').hidden, false);
    }

    // 2. Fresh harness at Target Scene settles once; duplicate arrival does not duplicate count
    const hTarget = createV101Harness({ initialStore: st, currentHash: tgtScene });
    const runsBefore = hTarget.get().weaveRuns;
    const resolvedTgt = hTarget.resolveScene(tgtScene);
    assert.strictEqual(resolvedTgt, tgtScene, `Target resolution mismatch for ${label}`);
    hTarget.go(resolvedTgt);
    hTarget.resolvePending(resolvedTgt);
    hTarget.replayPending(resolvedTgt);

    assert.strictEqual(hTarget.get().pending, null, `Pending should clear on arrival for ${label}`);
    const runsAfterFirst = hTarget.get().weaveRuns;

    if (p.kind === 'delivery') {
      assert.strictEqual(runsAfterFirst, runsBefore + 1);
    } else {
      assert.strictEqual(runsAfterFirst, runsBefore);
    }

    // Duplicate arrival
    hTarget.resolvePending(tgtScene);
    hTarget.replayPending(tgtScene);
    assert.strictEqual(hTarget.get().weaveRuns, runsAfterFirst, `Duplicate arrival must not re-increment for ${label}`);

    // 3. Fresh harness at Unrelated Corridor cancels pending without booking
    const hCorridor = createV101Harness({ initialStore: st, currentHash: 'corridor' });
    const resolvedCorridor = hCorridor.resolveScene('corridor');
    hCorridor.go(resolvedCorridor);
    hCorridor.resolvePending(resolvedCorridor);
    hCorridor.replayPending(resolvedCorridor);

    assert.strictEqual(hCorridor.get().pending, null, `Unrelated corridor must cancel pending for ${label}`);
    assert.strictEqual(hCorridor.get().weaveRuns, runsBefore, `Canceled pending must not count run for ${label}`);
  }
});
test('v101: Source progressEntryButton mapping extracted from script.js resolves actual HTML dw entry', () => {
  const fnMatch = scriptSrc.match(/const progressEntryButton = \(prefix\) => [^;\n]+;/);
  assert.ok(fnMatch, 'Could not find progressEntryButton definition in script.js');

  const progressEntryButtonFn = new Function('$', `${fnMatch[0]}; return progressEntryButton;`)((sel) => {
    const id = sel.replace(/^#/, '');
    return elementRegistry.has(id) ? { id, ...elementRegistry.get(id) } : null;
  });

  // Verify dw-entry-remembrance exists and is located within #dw-codex in indexHtml via balanced div nesting scan
  const codexIdIndex = indexHtml.indexOf('id="dw-codex"');
  assert.ok(codexIdIndex !== -1, '#dw-codex must exist in index.html');
  const codexOpenTagStart = indexHtml.lastIndexOf('<div', codexIdIndex);
  assert.ok(codexOpenTagStart !== -1, 'Opening div for #dw-codex must exist');

  const codexOpenTagEnd = indexHtml.indexOf('>', codexIdIndex);
  assert.ok(codexOpenTagEnd !== -1, 'Opening tag closure for #dw-codex must exist');

  const divTokenRegex = /<div\b[^>]*>|<\/div>/g;
  divTokenRegex.lastIndex = codexOpenTagEnd + 1;
  let depth = 1;
  let codexCloseTagIndex = -1;

  let tokenMatch;
  while ((tokenMatch = divTokenRegex.exec(indexHtml)) !== null) {
    if (tokenMatch[0].startsWith('</div')) {
      depth--;
      if (depth === 0) {
        codexCloseTagIndex = tokenMatch.index;
        break;
      }
    } else {
      depth++;
    }
  }

  assert.ok(codexCloseTagIndex !== -1, 'Matching closing </div> for #dw-codex must exist');
  const dwCodexSubtreeHtml = indexHtml.slice(codexOpenTagStart, codexCloseTagIndex + '</div>'.length);
  assert.ok(dwCodexSubtreeHtml.includes('id="dw-entry-remembrance"'), 'dw-entry-remembrance must reside inside exact dw-codex subtree');

  // dw must resolve to dw-entry-remembrance inside remembrance codex
  const dwEntry = progressEntryButtonFn('dw');
  assert.ok(dwEntry, 'progressEntryButton("dw") must return an element');
  assert.strictEqual(dwEntry.id, 'dw-entry-remembrance');
  assert.strictEqual(elementRegistry.has('dw-entry-remembrance'), true);

  // Known legacy prefix pattern compatibility (-entry-btn)
  const wkEntry = progressEntryButtonFn('wk');
  assert.ok(wkEntry, 'progressEntryButton("wk") must resolve to #wk-entry-btn');
  assert.strictEqual(wkEntry.id, 'wk-entry-btn');
  assert.strictEqual(elementRegistry.has('wk-entry-btn'), true);

  // Fallback pattern compatibility when prefix-entry exists
  const mockFallbackPrefix = 'mock-legacy-fallback';
  elementRegistry.set(`${mockFallbackPrefix}-entry`, { tagName: 'button', hidden: true });
  try {
    const fallbackEntry = progressEntryButtonFn(mockFallbackPrefix);
    assert.ok(fallbackEntry, 'progressEntryButton must resolve fallback #${prefix}-entry when -entry-btn is absent');
    assert.strictEqual(fallbackEntry.id, `${mockFallbackPrefix}-entry`);
  } finally {
    elementRegistry.delete(`${mockFallbackPrefix}-entry`);
  }

  // Unknown subsystem must resolve to null
  const unkn = progressEntryButtonFn('unknown-subsystem');
  assert.strictEqual(unkn, null);
});
