import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve('.');
const indexHtmlPath = path.join(repoRoot, 'index.html');
const indexJsPath = path.join(repoRoot, 'script.js');
const styleCssPath = path.join(repoRoot, 'styles.css');

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const indexJs = fs.readFileSync(indexJsPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');

// Extraction of modules and exact slice boundaries
const v102ExactHeader = '/* ============================================================' + String.fromCharCode(10) + '   v102 没有天气的候车亭 / WEATHERLESS BUS SHELTER';
const v102StartIdx = indexJs.indexOf(v102ExactHeader);
assert.ok(v102StartIdx !== -1, 'v102 exact start header must exist in script.js');

const v103ExactHeader = '/* ============================================================' + String.fromCharCode(10) + '   v103 收不到影子的照相馆 / SHADOWLESS PHOTOGRAPHY';
const v103StartIdx = indexJs.indexOf(v103ExactHeader);
assert.ok(v103StartIdx > v102StartIdx, 'v103 exact start header must follow v102 in script.js');

const guideMarker = '  /* ---------- 痕迹室「下一步」 ----------';
const guideStartIdx = indexJs.indexOf(guideMarker);
assert.ok(guideStartIdx > v103StartIdx, 'Guide marker must start after v103 in script.js');

// Extract pure v102 source module
const v102Section = indexJs.slice(v102StartIdx, v103StartIdx);
assert.ok(v102Section.length > 500, 'v102 section must be non-empty and substantial');
assert.ok(!v102Section.includes(guideMarker), 'v102 section must not include guide section');
assert.ok(!v102Section.includes('v101 织晓之门'), 'v102 section must not include v101 module');
assert.ok(!v102Section.includes('v103 收不到影子的照相馆'), 'v102 section must not include v103 module');

// Extract element registry from index.html
const elementRegistry = new Map();
const tagRegex = /<([a-zA-Z0-9-]+)([^>]*)id="([^"]+)"([^>]*)>/g;
let match;
while ((match = tagRegex.exec(indexHtml)) !== null) {
  const tagName = match[1].toLowerCase();
  const attrsStr = match[2] + ' ' + match[4];
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

// Harness factory to run actual code with full browser-like sandbox
function createV102Harness({
  v100Eligible = true,
  v100CourtOutcomes = ['the-wake-ended-at-dawn', 'the-hundredth-night-kept', 'a-wake-held-for-god'],
  v100Pending = null,
  v100ActiveMourner = null,
  v101Eligible = true,
  v101Endings = ['the-hundred-and-first-day-began', 'the-night-learned-to-live-without-dawn', 'day-and-night-lived-apart'],
  v101Pending = null,
  v101ActiveCourier = null,
  initialStore = null,
  currentHash = 'weatherless-bus-shelter',
} = {}) {
  const mem = new Map();
  if (initialStore !== null) {
    mem.set('goddead_v102_weatherless_shelter', typeof initialStore === 'string' ? initialStore : JSON.stringify(initialStore));
  }

  const v100Fixture = {
    pending: v100Pending,
    courtOutcomes: [...v100CourtOutcomes],
    activeMourner: v100ActiveMourner,
  };
  mem.set('goddead_v100_hundredth_wake', JSON.stringify(v100Fixture));

  const v101Fixture = {
    endings: [...v101Endings],
    pending: v101Pending,
    activeCourier: v101ActiveCourier,
  };
  mem.set('goddead_v101_dawn_weaving', JSON.stringify(v101Fixture));

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

    if (id.startsWith('ws-slot-')) {
      const num = {
        tagName: 'SPAN',
        children: [],
        attrs: {},
        classList: { contains: (c) => c === 'ws-order-number' },
        textContent: `${Number(id.replace('ws-slot-', '')) + 1}`,
      };
      const mark = {
        tagName: 'SPAN',
        children: [],
        attrs: { 'aria-hidden': 'true' },
        classList: { contains: (c) => c === 'ws-order-mark' },
        textContent: '·',
      };
      const text = {
        tagName: 'SPAN',
        children: [],
        attrs: {},
        classList: { contains: (c) => c === 'ws-order-text' },
        textContent: '空白',
      };
      elObj.children = [num, mark, text];
    }

    return elObj;
  };

  const $ = (sel) => {
    if (!sel) return null;
    const id = sel.replace(/^#/, '');
    if (!elementRegistry.has(id)) {
      // dynamic element created or queried
      if (!els.has(id)) {
        els.set(id, mkEl(id));
      }
      return els.get(id);
    }
    if (!els.has(id)) els.set(id, mkEl(id));
    return els.get(id);
  };

  const $$ = (sel) => {
    if (sel === '[id^="ws-"][aria-pressed]') {
      return Array.from(elementRegistry.keys()).filter((id) => id.startsWith('ws-')).map((id) => $(`#${id}`));
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

  const AudioEngine = { whoosh() {}, tick() {}, bell() {} };

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

  // Upstream stubs
  const getHundredthWake = () => JSON.parse(mem.get('goddead_v100_hundredth_wake') || '{}');
  const wkCourtEligible = () => v100Eligible;
  const WK_VERDICT_OUTCOME_IDS = ['the-wake-ended-at-dawn', 'the-hundredth-night-kept', 'a-wake-held-for-god'];

  const getDawnWeaving = () => JSON.parse(mem.get('goddead_v101_dawn_weaving') || '{}');
  const dawnWeavingUnlocked = () => v101Eligible;
  const dawnWeavingAvailable = () => {
    if (!dawnWeavingUnlocked()) return false;
    const v100 = getHundredthWake();
    return Boolean(v101Eligible && !v100.pending);
  };
  const DW_ENDING_IDS = ['the-hundred-and-first-day-began', 'the-night-learned-to-live-without-dawn', 'day-and-night-lived-apart'];

  // Extract resolveScene source from index.js
  const resolveSceneMatch = indexJs.match(/const resolveScene = \(name\) => \{[\s\S]*?\n  \};/);
  assert.ok(resolveSceneMatch, 'resolveScene must be extractable from index.js');
  const resolveSceneSrc = resolveSceneMatch[0];

  // Extract weatherlessShelterProgressStep source from index.js
  const wsProgressMatch = indexJs.match(/const weatherlessShelterProgressStep = \(\) => \{[\s\S]*?\n  \};/);
  assert.ok(wsProgressMatch, 'weatherlessShelterProgressStep must be extractable from index.js');
  const wsProgressSrc = wsProgressMatch[0];

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
    const dawnWeavingBridgeAllows = () => false;
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
    const dwHallCanVisit = () => true;
    const dayNightLoomCanVisit = () => true;
    const skyClothTerraceCanVisit = () => true;
    const shadowlessPhotographyBridgeAllows = () => false;
    const shadowlessPhotoStudioCanVisit = () => false;
    const doubleExposureCameraCanVisit = () => false;
    const unreceivedShadowDarkroomCanVisit = () => false;
    const shadowlessPhotographyProgressStep = () => ({ title: 'v103 收不到影子的照相馆 (Harness Sentinel)', done: false, items: ['[ ] 站位与双向灯光'] });
    const wakeForAnotherHotelBridgeAllows = () => false;
    const yesterdayBreakfastBridgeAllows = () => false;
    const ybShopCanVisit = () => false;
    const breakfastCounterCanVisit = () => false;
    const ybCourtCanVisit = () => false;
    const ahHotelCanVisit = () => false;
    const borrowedDawnClockroomCanVisit = () => false;
    const sharedMorningVerandaCanVisit = () => false;

    ${v102Section}

    ${resolveSceneSrc}

    ${wsProgressSrc}

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
      resolvePending: resolveWeatherlessShelterPendingOnArrival,
      replayPending: replayWeatherlessShelterPending,
      syncAll: syncWeatherlessShelterAll,
      get: getWeatherlessShelter,
      save: saveWeatherlessShelter,
      unlocked: weatherlessShelterUnlocked,
      available: weatherlessShelterAvailable,
      classify: classifySeasonOrder,
      normalize: normalizeWeatherlessShelter,
      expectedPending: expectedWsPending,
      bridge: weatherlessShelterBridgeAllows,
      reliefContext: weatherlessShelterReliefReceiptContext,
      hallOk: wsHallCanVisit,
      boardOk: seasonDispatchBoardCanVisit,
      platformOk: fourSeasonPlatformCanVisit,
      forget: forgetWeatherlessShelterState,
      chooseWsEntry,
      chooseWsStart,
      chooseWsSlot,
      chooseWsTicket,
      chooseWsExample,
      chooseWsPreview,
      chooseWsRevise,
      chooseWsDepart,
      chooseWsPassengerReturn,
      chooseWsAbandon,
      getSelectedTicket: () => wsSelectedTicket,
      setSelectedTicket: (t) => { wsSelectedTicket = t; },
      getExampleIndex: () => wsExampleIndex,
      getExampleShown: () => wsExampleShown,
      progressStep: weatherlessShelterProgressStep,
      WS_ENDING_TABLE,
      WS_ENDING_IDS,
      WS_SEASONS,
    };
  `;

  const api = new Function(
    'store', '$', '$$', 'reduced', 'AutoAdvance', 'AudioEngine', 'buttonAvailable',
    'document', 'localStorage', 'getHundredthWake', 'wkCourtEligible', 'WK_VERDICT_OUTCOME_IDS',
    'getDawnWeaving', 'dawnWeavingUnlocked', 'dawnWeavingAvailable', 'DW_ENDING_IDS',
    'loc', 'hist',
    compiledCode
  )(
    store, $, $$, false, AutoAdvance, AudioEngine, buttonAvailable,
    doc, { removeItem: (k) => mem.delete(k) }, getHundredthWake, wkCourtEligible, WK_VERDICT_OUTCOME_IDS,
    getDawnWeaving, dawnWeavingUnlocked, dawnWeavingAvailable, DW_ENDING_IDS,
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

// -------------------------------------------------------------
// Test Group 1: Markers, scene IDs, image attributes & DOM HTML structure
// -------------------------------------------------------------
test('Group 1: HTML structure, scene count 238, lazy images, native buttons and CSS scope', () => {
  // 238 unique scene section data-scene values in index.html (excluding scene-veil overlay)
  const sceneMatches = Array.from(indexHtml.matchAll(/<section[^>]+data-scene="([^"]+)"/g)).map((m) => m[1]);
  const uniqueScenes = new Set(sceneMatches);
  assert.equal(sceneMatches.length, 238, `Total data-scene sections must be exactly 238, got ${sceneMatches.length}`);
  assert.equal(uniqueScenes.size, 238, `Scene count must be exactly 238, got ${uniqueScenes.size}`);
  assert.ok(uniqueScenes.has('weatherless-bus-shelter'));
  assert.ok(uniqueScenes.has('season-dispatch-board'));
  assert.ok(uniqueScenes.has('four-season-platform'));

  // 3 lazy images with exact attributes
  const imgRegex = /<img[^>]+data-src="assets\/(v102-[^"]+\.webp)"[^>]*>/g;
  const imgs = Array.from(indexHtml.matchAll(imgRegex));
  assert.equal(imgs.length, 3, 'Must have exactly 3 v102 WebP images');
  imgs.forEach((im) => {
    const fullTag = im[0];
    assert.ok(fullTag.includes('width="1536"'), 'Width must be 1536');
    assert.ok(fullTag.includes('height="1024"'), 'Height must be 1024');
    assert.ok(fullTag.includes('loading="lazy"'), 'Image must have loading="lazy"');
    assert.ok(!fullTag.includes('preload'), 'No preload for lazy images');
  });

  // Asset files exist on disk, < 300KB, native WebP dimensions 1536x1024 (3:2)
  const expectedAssets = ['v102-weatherless-bus-shelter.webp', 'v102-season-dispatch-board.webp', 'v102-four-season-platform.webp'];
  expectedAssets.forEach((file) => {
    const assetPath = path.resolve(repoRoot, 'assets', file);
    assert.ok(fs.existsSync(assetPath), `Asset ${file} must exist`);
    const stat = fs.statSync(assetPath);
    assert.ok(stat.size > 0 && stat.size < 300 * 1024, `Asset ${file} must be < 300KB, got ${stat.size}`);
    const buf = fs.readFileSync(assetPath);
    assert.equal(buf.subarray(0, 4).toString('ascii'), 'RIFF', 'WebP RIFF signature');
    assert.equal(buf.subarray(8, 12).toString('ascii'), 'WEBP', 'WebP WEBP signature');
    const chunkType = buf.subarray(12, 16).toString('ascii');
    let width = 0;
    let height = 0;
    if (chunkType === 'VP8X') {
      width = 1 + buf.readUIntLE(24, 3);
      height = 1 + buf.readUIntLE(27, 3);
    } else if (chunkType === 'VP8 ') {
      width = buf.readUInt16LE(26) & 0x3fff;
      height = buf.readUInt16LE(28) & 0x3fff;
    } else if (chunkType === 'VP8L') {
      const b1 = buf[21];
      const b2 = buf[22];
      const b3 = buf[23];
      const b4 = buf[24];
      width = 1 + (((b2 & 0x3f) << 8) | b1);
      height = 1 + (((b4 & 0xf) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
    }
    assert.equal(width, 1536, `Asset ${file} native width must be 1536`);
    assert.equal(height, 1024, `Asset ${file} native height must be 1024`);
    assert.equal((width * 2), (height * 3), `Asset ${file} aspect ratio must be 3:2`);
  });

  // Receipts in old scenes must be aside/div not nested section
  ['threshold', 'minute-before-archive', 'unending-gallery'].forEach((scene) => {
    const asideRegex = new RegExp(`<aside[^>]+id="ws-passenger-${scene}"`);
    assert.ok(asideRegex.test(indexHtml), `Receipt for ${scene} must be an <aside>`);
  });

  // Native button IDs check
  for (let i = 0; i < 4; i++) {
    assert.ok(indexHtml.includes(`id="ws-slot-${i}"`), `Slot ${i} button must exist`);
  }
  ['spring', 'summer', 'autumn', 'winter', 'remove'].forEach((t) => {
    assert.ok(indexHtml.includes(`id="ws-ticket-${t}"`), `Ticket ${t} button must exist`);
  });

  // Isolate append v102 CSS marker fragment and assert selectors do not use bare unscoped .exit-link or .scene-exits
  const marker = '/* v102: Weatherless Bus Shelter & Season Dispatch Board - Complete Append-only CSS */';
  assert.ok(styleCss.includes(marker), 'v102 CSS marker comment must exist');
  const v102Css = styleCss.slice(styleCss.indexOf(marker));
  const cleanCss = v102Css.replace(/\/\*[\s\S]*?\*\//g, '');
  const ruleBlocks = cleanCss.split('}');
  ruleBlocks.forEach((block) => {
    const parts = block.split('{');
    if (parts.length >= 2) {
      const selectorList = parts[0].trim();
      const selectors = selectorList.split(',').map((s) => s.trim()).filter(Boolean);
      selectors.forEach((sel) => {
        assert.ok(!sel.match(/^\.exit-link\b/), `v102 CSS selector must not bare match .exit-link: ${sel}`);
        assert.ok(!sel.match(/^\.scene-exits\b/), `v102 CSS selector must not bare match .scene-exits: ${sel}`);
      });
    }
  });
  assert.ok(v102Css.includes('.ws-'), 'WS styles present in append block');
});

// -------------------------------------------------------------
// Test Group 2: Classifier permutations 4 / 4 / 16 & full 5^4 space & normalization
// -------------------------------------------------------------
test('Group 2: Independent 24 permutations classification (4/4/16) and 625 combinations', () => {
  const harness = createV102Harness();
  const seasons = ['spring', 'summer', 'autumn', 'winter'];

  // All 24 full permutations
  const permutations = [];
  function permute(arr, m = []) {
    if (arr.length === 0) {
      permutations.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  }
  permute(seasons);
  assert.equal(permutations.length, 24);

  const forward = [];
  const reverse = [];
  const split = [];

  permutations.forEach((p) => {
    const c = harness.classify(p);
    if (c === 'the-weather-finally-boarded') forward.push(p);
    else if (c === 'the-seasons-returned-to-yesterday') reverse.push(p);
    else if (c === 'each-season-found-its-own-stop') split.push(p);
    else assert.fail(`Unknown classification for permutation ${JSON.stringify(p)}: ${c}`);
  });

  assert.equal(forward.length, 4, 'Forward / 顺季 must have 4 rotations');
  assert.equal(reverse.length, 4, 'Reverse / 倒季 must have 4 rotations');
  assert.equal(split.length, 16, 'Split / 分季 must have 16 permutations');

  // Verify all 4 rotations of forward:
  const expectedForward = [
    ['spring', 'summer', 'autumn', 'winter'],
    ['summer', 'autumn', 'winter', 'spring'],
    ['autumn', 'winter', 'spring', 'summer'],
    ['winter', 'spring', 'summer', 'autumn'],
  ];
  expectedForward.forEach((ord) => {
    assert.equal(harness.classify(ord), 'the-weather-finally-boarded');
  });

  // Verify all 4 rotations of reverse:
  const expectedReverse = [
    ['spring', 'winter', 'autumn', 'summer'],
    ['winter', 'autumn', 'summer', 'spring'],
    ['autumn', 'summer', 'spring', 'winter'],
    ['summer', 'spring', 'winter', 'autumn'],
  ];
  expectedReverse.forEach((ord) => {
    assert.equal(harness.classify(ord), 'the-seasons-returned-to-yesterday');
  });

  // Test full 5^4 = 625 combinations of [null, spring, summer, autumn, winter]
  const domain = [null, ...seasons];
  let validPartialCount = 0;
  for (let a of domain) {
    for (let b of domain) {
      for (let c of domain) {
        for (let d of domain) {
          const ord = [a, b, c, d];
          const nonNull = ord.filter((x) => x !== null);
          const uniqueNonNull = new Set(nonNull);
          const isValid = nonNull.length === uniqueNonNull.size;

          const norm = harness.normalize({ version: 102, draft: { order: ord } });
          if (isValid) {
            validPartialCount++;
            assert.deepEqual(norm.draft.order, ord);
          } else {
            assert.deepEqual(norm.draft.order, [null, null, null, null]);
          }

          if (nonNull.length < 4 || !isValid) {
            assert.equal(harness.classify(ord), '');
          }
        }
      }
    }
  }
  // Formula: sum_{k=0}^4 C(4, k) * P(4, k) = 1 + 16 + 72 + 96 + 24 = 209
  assert.equal(validPartialCount, 209, 'Total valid partial arrays must be exactly 209');

  // Malformed arrays & unknown types
  const malforms = [
    [1, 2, 3, 4],
    ['spring', 'summer', 'autumn'],
    ['spring', 'summer', 'autumn', 'winter', 'extra'],
    { 0: 'spring', 1: 'summer', 2: 'autumn', 3: 'winter' },
    ['spring', 'spring', 'autumn', 'winter'],
    [undefined, null, null, null],
  ];
  malforms.forEach((m) => {
    assert.equal(harness.classify(m), '');
    const norm = harness.normalize({ version: 102, draft: { order: m } });
    assert.deepEqual(norm.draft.order, [null, null, null, null]);
  });
});

// -------------------------------------------------------------
// Test Group 3: Canonical normalization & 9 fields strict validation
// -------------------------------------------------------------
test('Group 3: Canonical normalization, bad JSON, unknown keys, latest collected check', () => {
  const harness = createV102Harness();

  // Bad JSON or unknown structure returns default
  assert.deepEqual(harness.normalize(null), harness.normalize({}));
  assert.deepEqual(harness.normalize('garbage'), harness.normalize({}));

  // Canonical fields strict check
  const raw = {
    version: 102,
    extraUnknownKey: 'shouldBeStripped',
    visited: { hall: true, board: 'true', platform: false, extra: true },
    draft: { order: ['spring', 'summer', null, null] },
    endings: ['the-weather-finally-boarded', 'bogus-ending'],
    latestOrderByEnding: {
      'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
      'the-seasons-returned-to-yesterday': ['spring', 'winter', 'autumn', 'summer'], // not collected!
      'each-season-found-its-own-stop': [],
    },
    runs: 4.8,
    lastOutcome: 'the-weather-finally-boarded',
    activePassenger: {
      outcome: 'the-weather-finally-boarded',
      order: ['spring', 'summer', 'autumn', 'winter'],
    },
  };

  const norm = harness.normalize(raw);
  assert.equal(norm.version, 102);
  assert.equal(norm.visited.hall, true);
  assert.equal(norm.visited.board, false, 'board must strictly be boolean true');
  assert.equal(norm.visited.platform, false);
  assert.ok(!('extra' in norm.visited));
  assert.ok(!('extraUnknownKey' in norm));
  assert.deepEqual(norm.endings, ['the-weather-finally-boarded']);
  assert.equal(norm.runs, 4);
  assert.deepEqual(norm.latestOrderByEnding['the-weather-finally-boarded'], ['spring', 'summer', 'autumn', 'winter']);
  assert.deepEqual(norm.latestOrderByEnding['the-seasons-returned-to-yesterday'], [], 'Uncollected ending must have empty latest array');
  assert.deepEqual(norm.activePassenger, {
    outcome: 'the-weather-finally-boarded',
    order: ['spring', 'summer', 'autumn', 'winter'],
  });

  // ActivePassenger mismatch with ending or latest order strips activePassenger
  const mismatchActive = {
    version: 102,
    endings: ['the-weather-finally-boarded'],
    latestOrderByEnding: {
      'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
      'the-seasons-returned-to-yesterday': [],
      'each-season-found-its-own-stop': [],
    },
    activePassenger: {
      outcome: 'the-weather-finally-boarded',
      order: ['summer', 'autumn', 'winter', 'spring'], // differs from latest!
    },
  };
  const normMismatch = harness.normalize(mismatchActive);
  assert.equal(normMismatch.activePassenger, null);
});

// -------------------------------------------------------------
// Test Group 4: Unlock & Available respects completed v101, pending/active guards
// -------------------------------------------------------------
test('Group 4: Unlock/Available predicates and disabled entry UI with concrete notes', () => {
  // Case A: v101 not complete (only 2 endings)
  const harnessIncompleteV101 = createV102Harness({
    v101Endings: ['the-loom-weaves-dawn', 'the-loom-swallows-midnight'],
  });
  assert.equal(harnessIncompleteV101.unlocked(), false);
  assert.equal(harnessIncompleteV101.available(), false);
  harnessIncompleteV101.syncAll();
  assert.equal(harnessIncompleteV101.$('#ws-entry-remembrance').hidden, true);

  // Case B: v101 complete, but v100 has pending
  const harnessV100Pending = createV102Harness({
    v100Pending: { kind: 'verdict' },
  });
  assert.equal(harnessV100Pending.unlocked(), true);
  assert.equal(harnessV100Pending.available(), false);
  harnessV100Pending.syncAll();
  const entryRem = harnessV100Pending.$('#ws-entry-remembrance');
  assert.equal(entryRem.hidden, false);
  assert.equal(entryRem.disabled, true);
  const noteRem = harnessV100Pending.$('#ws-entry-note-remembrance');
  assert.equal(noteRem.hidden, false);
  assert.ok(noteRem.textContent.includes('百夜灵堂尚有供香在途'));

  // Case C: v101 has active courier
  const harnessV101Courier = createV102Harness({
    v101ActiveCourier: { outcome: 'the-hundred-and-first-day-began', pattern: 'lllllllll' },
  });
  assert.equal(harnessV101Courier.unlocked(), true);
  assert.equal(harnessV101Courier.available(), false);
  harnessV101Courier.syncAll();
  assert.equal(harnessV101Courier.$('#ws-entry-remembrance').disabled, true);
  assert.ok(harnessV101Courier.$('#ws-entry-note-remembrance').textContent.includes('先带着织物回执返回黎明织造厂'));

  // Case D: v101 fully ready and clean
  const harnessReady = createV102Harness();
  assert.equal(harnessReady.unlocked(), true);
  assert.equal(harnessReady.available(), true);
  harnessReady.syncAll();
  assert.equal(harnessReady.$('#ws-entry-remembrance').disabled, false);
  assert.equal(harnessReady.$('#ws-entry-remembrance').hidden, false);
});

// -------------------------------------------------------------
// Test Group 5: Real HTML listener trusted flag, offscene click rejection, DOM buttons
// -------------------------------------------------------------
test('Group 5: Synthetic isTrusted:false rejected, offscene click ignored, button DOM intact', () => {
  const harness = createV102Harness({ currentHash: 'remembrance' });
  harness.syncAll();

  // Synthetic untrusted click has zero effect
  harness.click('ws-entry-remembrance', false);
  assert.equal(harness.get().pending, null);
  assert.equal(harness.schedules.length, 0);

  // Offscene click: in remembrance, trying to click #ws-new (hall)
  harness.click('ws-new', true);
  assert.equal(harness.get().pending, null);

  // Legitimate trusted entry click
  harness.click('ws-entry-remembrance', true);
  const st = harness.get();
  assert.ok(st.pending);
  assert.equal(st.pending.kind, 'entry');
  assert.equal(st.pending.source, 'remembrance');
  assert.equal(st.pending.target, 'weatherless-bus-shelter');
  assert.equal(harness.schedules.length, 1);
});

// -------------------------------------------------------------
// Test Group 6: Dispatch Board ticket chooser, memory-only selection & 5 slot placement modes
// -------------------------------------------------------------
test('Group 6: Ticket chooser, swap/move/replace/remove/noop and cycle examples', () => {
  const harness = createV102Harness({
    currentHash: 'season-dispatch-board',
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: false },
      draft: { order: [null, null, null, null] },
    },
  });
  harness.syncAll();

  // Default selected ticket is spring
  assert.equal(harness.getSelectedTicket(), 'spring');

  // 1. Place spring into slot 0
  harness.click('ws-slot-0', true);
  assert.deepEqual(harness.get().draft.order, ['spring', null, null, null]);

  // 2. Select summer and place into slot 1
  harness.click('ws-ticket-summer', true);
  assert.equal(harness.getSelectedTicket(), 'summer');
  harness.click('ws-slot-1', true);
  assert.deepEqual(harness.get().draft.order, ['spring', 'summer', null, null]);

  // 3. Move existing ticket: select spring, click slot 2 (empty) -> moves from slot 0 to slot 2
  harness.click('ws-ticket-spring', true);
  harness.click('ws-slot-2', true);
  assert.deepEqual(harness.get().draft.order, [null, 'summer', 'spring', null]);

  // 4. Swap existing ticket: select summer, click slot 2 (has spring) -> swaps summer and spring
  harness.click('ws-ticket-summer', true);
  harness.click('ws-slot-2', true);
  assert.deepEqual(harness.get().draft.order, [null, 'spring', 'summer', null]);

  // 5. Replace ticket: select autumn (not on board), click slot 1 (has spring) -> slot 1 becomes autumn
  harness.click('ws-ticket-autumn', true);
  harness.click('ws-slot-1', true);
  assert.deepEqual(harness.get().draft.order, [null, 'autumn', 'summer', null]);

  // 6. No-op: select autumn, click slot 1 again -> no change
  harness.click('ws-slot-1', true);
  assert.deepEqual(harness.get().draft.order, [null, 'autumn', 'summer', null]);

  // 7. Remove mode: select remove, click slot 2 -> slot 2 becomes null
  harness.click('ws-ticket-remove', true);
  assert.equal(harness.getSelectedTicket(), 'remove');
  harness.click('ws-slot-2', true);
  assert.deepEqual(harness.get().draft.order, [null, 'autumn', null, null]);

  // Examples cycle test (3 examples)
  assert.equal(harness.getExampleShown(), false);
  harness.click('ws-example-btn', true);
  assert.equal(harness.getExampleShown(), true);
  assert.equal(harness.getExampleIndex(), 0);
  assert.ok(harness.$('#ws-example-note').textContent.includes('顺季循环'));

  harness.click('ws-example-btn', true);
  assert.equal(harness.getExampleIndex(), 1);
  assert.ok(harness.$('#ws-example-note').textContent.includes('倒季循环'));

  harness.click('ws-example-btn', true);
  assert.equal(harness.getExampleIndex(), 2);
  assert.ok(harness.$('#ws-example-note').textContent.includes('分季班'));

  harness.click('ws-example-btn', true);
  assert.equal(harness.getExampleIndex(), 0);
});

// -------------------------------------------------------------
// Test Group 7: Incomplete preview disabled, missing weather hint & revise/abandon flows
// -------------------------------------------------------------
test('Group 7: Incomplete preview disabled, missing hint, preview/revise and abandon draft preservation', () => {
  const harness = createV102Harness({
    currentHash: 'season-dispatch-board',
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: false },
      draft: { order: ['spring', 'summer', 'autumn', null] },
    },
  });
  harness.syncAll();

  // Preview button must be disabled
  const previewBtn = harness.$('#ws-preview-btn');
  assert.equal(previewBtn.disabled, true);
  const hintEl = harness.$('#ws-board-hint');
  assert.ok(hintEl.textContent.includes('还需排入：霜雪'));

  // Place winter into slot 3
  harness.click('ws-ticket-winter', true);
  harness.click('ws-slot-3', true);
  assert.deepEqual(harness.get().draft.order, ['spring', 'summer', 'autumn', 'winter']);
  harness.syncAll();
  assert.equal(harness.$('#ws-preview-btn').disabled, false);
  assert.ok(harness.$('#ws-board-hint').textContent.includes('当前班次已完整'));

  // Click preview -> pending preview
  harness.click('ws-preview-btn', true);
  let st = harness.get();
  assert.equal(st.pending.kind, 'preview');
  assert.equal(st.pending.target, 'four-season-platform');

  // Arrive at platform
  harness.go('four-season-platform');
  harness.resolvePending('four-season-platform');
  st = harness.get();
  assert.equal(st.visited.platform, true);
  assert.equal(st.pending, null);
  assert.deepEqual(st.draft.order, ['spring', 'summer', 'autumn', 'winter']); // draft intact!

  // In platform, click revise -> returns to board
  harness.syncAll();
  harness.click('ws-revise', true);
  st = harness.get();
  assert.equal(st.pending.kind, 'revise');
  assert.equal(st.pending.target, 'season-dispatch-board');

  harness.go('season-dispatch-board');
  harness.resolvePending('season-dispatch-board');
  st = harness.get();
  assert.equal(st.pending, null);
  assert.deepEqual(st.draft.order, ['spring', 'summer', 'autumn', 'winter']); // still intact!

  // Click abandon from board -> returns to hall preserving draft
  harness.syncAll();
  harness.click('ws-abandon', true);
  st = harness.get();
  assert.equal(st.pending.kind, 'abandon');
  assert.equal(st.pending.target, 'weatherless-bus-shelter');

  harness.go('weatherless-bus-shelter');
  harness.resolvePending('weatherless-bus-shelter');
  st = harness.get();
  assert.deepEqual(st.draft.order, ['spring', 'summer', 'autumn', 'winter']);
});

// -------------------------------------------------------------
// Test Group 8: Focused return/start pending kind tamper verification & source/target/unrelated recovery
// -------------------------------------------------------------
test('Group 8: Focused return/start canonical checks, tamper resistance, source replay and target arrival', () => {
  const harness = createV102Harness({
    currentHash: 'weatherless-bus-shelter',
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      draft: { order: ['spring', 'summer', 'autumn', 'winter'] },
      endings: ['the-weather-finally-boarded'],
      latestOrderByEnding: {
        'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
        'the-seasons-returned-to-yesterday': [],
        'each-season-found-its-own-stop': [],
      },
      activePassenger: {
        outcome: 'the-weather-finally-boarded',
        order: ['spring', 'summer', 'autumn', 'winter'],
      },
    },
  });

  // Test passenger-return canonical validation
  const validReturnPending = {
    feedback: '车票签收完毕，你收好时刻表走回了候车亭。',
    from: 'threshold',
    kind: 'passenger-return',
    outcome: 'the-weather-finally-boarded',
    target: 'weatherless-bus-shelter',
  };
  const normReturn = harness.normalize({
    version: 102,
    visited: { hall: true, board: true, platform: true },
    draft: { order: [null, null, null, null] },
    endings: ['the-weather-finally-boarded'],
    latestOrderByEnding: {
      'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
      'the-seasons-returned-to-yesterday': [],
      'each-season-found-its-own-stop': [],
    },
    activePassenger: {
      outcome: 'the-weather-finally-boarded',
      order: ['spring', 'summer', 'autumn', 'winter'],
    },
    pending: validReturnPending,
  });
  assert.deepEqual(normReturn.pending, validReturnPending);

  // Tampered pending (wrong outcome or modified feedback) is rejected
  const tamperedReturn = { ...validReturnPending, outcome: 'each-season-found-its-own-stop' };
  const normTampered = harness.normalize({
    ...normReturn,
    pending: tamperedReturn,
  });
  assert.equal(normTampered.pending, null);

  // Source scene replay: replay on source reschedules AutoAdvance and preserves pending
  harness.go('threshold');
  harness.save({ ...normReturn, pending: validReturnPending });
  harness.replayPending('threshold');
  assert.equal(harness.schedules.length, 1);
  assert.equal(harness.schedules[0].target, 'weatherless-bus-shelter');
  assert.notEqual(harness.get().pending, null);

  // Arrival at target clears pending and settles state
  harness.go('weatherless-bus-shelter');
  harness.resolvePending('weatherless-bus-shelter');
  assert.equal(harness.get().pending, null);
  assert.equal(harness.get().activePassenger, null);

  // Unrelated scene arrival cancels pending without modifying records
  harness.save({
    ...harness.get(),
    pending: {
      feedback: '排班牌翻动起来，黄铜夹扣在四个到站位置就位。',
      kind: 'start',
      source: 'weatherless-bus-shelter',
      target: 'season-dispatch-board',
    },
  });
  harness.go('corridor');
  harness.resolvePending('corridor');
  assert.equal(harness.get().pending, null);
});

// -------------------------------------------------------------
// Test Group 9: Full serial flow of all 3 endings with real trusted listeners & runs counting
// -------------------------------------------------------------
test('Group 9: Three endings full serial flow, runs counting, deduplication and receipt clearing', () => {
  const harness = createV102Harness({ currentHash: 'remembrance' });
  harness.replayPending('remembrance');
  harness.syncAll();

  const scenarios = [
    {
      order: ['spring', 'summer', 'autumn', 'winter'],
      outcome: 'the-weather-finally-boarded',
      target: 'threshold',
    },
    {
      order: ['spring', 'winter', 'autumn', 'summer'],
      outcome: 'the-seasons-returned-to-yesterday',
      target: 'minute-before-archive',
    },
    {
      order: ['spring', 'autumn', 'summer', 'winter'],
      outcome: 'each-season-found-its-own-stop',
      target: 'unending-gallery',
    },
  ];

  // 1. Initial entry from remembrance to hall
  harness.click('ws-entry-remembrance', true);
  assert.equal(harness.get().pending?.kind, 'entry', 'Pending entry exists before go');
  assert.equal(harness.resolveScene('weatherless-bus-shelter'), 'weatherless-bus-shelter');
  harness.go('weatherless-bus-shelter');
  harness.replayPending('weatherless-bus-shelter');
  harness.resolvePending('weatherless-bus-shelter');
  harness.syncAll();

  for (let i = 0; i < scenarios.length; i++) {
    const { order, outcome, target } = scenarios[i];

    // From hall, start fresh dispatch
    harness.click('ws-new', true);
    assert.equal(harness.get().pending?.kind, 'start', 'Pending start exists before go');
    assert.equal(harness.resolveScene('season-dispatch-board'), 'season-dispatch-board');
    harness.go('season-dispatch-board');
    harness.replayPending('season-dispatch-board');
    harness.resolvePending('season-dispatch-board');
    harness.syncAll();

    // Fill the 4 slots
    for (let slot = 0; slot < 4; slot++) {
      harness.click(`ws-ticket-${order[slot]}`, true);
      harness.click(`ws-slot-${slot}`, true);
    }
    assert.deepEqual(harness.get().draft.order, order, 'Draft equals ticket order BEFORE preview');
    harness.syncAll();

    // Preview
    harness.click('ws-preview-btn', true);
    assert.equal(harness.get().pending?.kind, 'preview', 'Pending preview exists before go');
    assert.equal(harness.resolveScene('four-season-platform'), 'four-season-platform');
    harness.go('four-season-platform');
    harness.replayPending('four-season-platform');
    harness.resolvePending('four-season-platform');
    harness.syncAll();

    // Depart
    harness.click('ws-depart', true);
    assert.equal(harness.get().pending?.kind, 'depart', 'Pending depart exists before go');

    // In transit: runs should not be incremented yet
    assert.equal(harness.get().runs, i);

    // Arrive at target scene
    assert.equal(harness.resolveScene(target), target);
    harness.go(target);
    harness.replayPending(target);
    harness.resolvePending(target);
    harness.syncAll();

    // Arrived: runs incremented, ending recorded, activePassenger set
    let st = harness.get();
    assert.equal(st.runs, i + 1);
    assert.ok(st.endings.includes(outcome));
    assert.deepEqual(st.latestOrderByEnding[outcome], order);
    assert.deepEqual(st.activePassenger, { outcome, order });
    assert.deepEqual(st.draft.order, [null, null, null, null], 'Draft cleared upon departure arrival');

    // Return to hall
    harness.click(`ws-passenger-return-${target}`, true);
    assert.equal(harness.get().pending?.kind, 'passenger-return', 'Pending passenger-return exists before go');
    assert.equal(harness.resolveScene('weatherless-bus-shelter'), 'weatherless-bus-shelter');
    harness.go('weatherless-bus-shelter');
    harness.replayPending('weatherless-bus-shelter');
    harness.resolvePending('weatherless-bus-shelter');
    harness.syncAll();

    // Returned: activePassenger cleared
    st = harness.get();
    assert.equal(st.activePassenger, null);
  }

  const finalState = harness.get();
  assert.equal(finalState.runs, 3);
  assert.equal(finalState.endings.length, 3);

  // Repeat an ending with a different starting season rotation (runs 4, unique endings 3)
  // Rotating forward: summer -> autumn -> winter -> spring
  const altForward = ['summer', 'autumn', 'winter', 'spring'];
  harness.click('ws-new', true);
  assert.equal(harness.get().pending?.kind, 'start', 'Pending start exists before go');
  assert.equal(harness.resolveScene('season-dispatch-board'), 'season-dispatch-board');
  harness.go('season-dispatch-board');
  harness.replayPending('season-dispatch-board');
  harness.resolvePending('season-dispatch-board');
  harness.syncAll();

  for (let slot = 0; slot < 4; slot++) {
    harness.click(`ws-ticket-${altForward[slot]}`, true);
    harness.click(`ws-slot-${slot}`, true);
  }
  assert.deepEqual(harness.get().draft.order, altForward, 'Draft equals ticket order BEFORE preview');
  harness.syncAll();
  harness.click('ws-preview-btn', true);
  assert.equal(harness.get().pending?.kind, 'preview', 'Pending preview exists before go');
  assert.equal(harness.resolveScene('four-season-platform'), 'four-season-platform');
  harness.go('four-season-platform');
  harness.replayPending('four-season-platform');
  harness.resolvePending('four-season-platform');
  harness.syncAll();

  harness.click('ws-depart', true);
  assert.equal(harness.get().pending?.kind, 'depart', 'Pending depart exists before go');
  assert.equal(harness.resolveScene('threshold'), 'threshold');
  harness.go('threshold');
  harness.replayPending('threshold');
  harness.resolvePending('threshold');
  harness.syncAll();

  const repeatState = harness.get();
  assert.equal(repeatState.runs, 4);
  assert.equal(repeatState.endings.length, 3, 'Unique endings count remains 3');
  assert.deepEqual(repeatState.latestOrderByEnding['the-weather-finally-boarded'], altForward, 'Latest order updated to new rotation');
});

// -------------------------------------------------------------
// Test Group 10: Active Passenger blocks continue/new and provides exact recovery href
// -------------------------------------------------------------
test('Group 10: Active passenger locks new dispatch and renders exact target recovery link', () => {
  const harness = createV102Harness({
    currentHash: 'weatherless-bus-shelter',
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      draft: { order: ['spring', 'summer', 'autumn', 'winter'] },
      endings: ['the-seasons-returned-to-yesterday'],
      latestOrderByEnding: {
        'the-weather-finally-boarded': [],
        'the-seasons-returned-to-yesterday': ['spring', 'winter', 'autumn', 'summer'],
        'each-season-found-its-own-stop': [],
      },
      runs: 1,
      lastOutcome: 'the-seasons-returned-to-yesterday',
      activePassenger: {
        outcome: 'the-seasons-returned-to-yesterday',
        order: ['spring', 'winter', 'autumn', 'summer'],
      },
    },
  });
  harness.syncAll();

  // In hall: new and continue buttons are disabled
  const btnNew = harness.$('#ws-new');
  const btnCont = harness.$('#ws-continue');
  assert.equal(btnNew.disabled, true);
  assert.equal(btnCont.disabled, true);

  // Recovery link is shown pointing to minute-before-archive
  const passengerLink = harness.$('#ws-passenger-link');
  assert.equal(passengerLink.hidden, false);
  assert.equal(passengerLink.getAttribute('href'), '#minute-before-archive');
  const note = harness.$('#ws-hall-note');
  assert.ok(note.textContent.includes('前一分钟档案井'));
});

// -------------------------------------------------------------
// Test Group 11: Narrow sceneInit v45 skip assertion & source contract
// -------------------------------------------------------------
test('Group 11: Exact sceneInit v45 enterRelief skip condition and other scenes unaffected', () => {
  const harness = createV102Harness({
    currentHash: 'weatherless-bus-shelter',
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      draft: { order: ['spring', 'winter', 'autumn', 'summer'] },
      endings: ['the-seasons-returned-to-yesterday'],
      latestOrderByEnding: {
        'the-weather-finally-boarded': [],
        'the-seasons-returned-to-yesterday': ['spring', 'winter', 'autumn', 'summer'],
        'each-season-found-its-own-stop': [],
      },
      activePassenger: {
        outcome: 'the-seasons-returned-to-yesterday',
        order: ['spring', 'winter', 'autumn', 'summer'],
      },
    },
  });

  // Verify weatherlessShelterReliefReceiptContext predicate
  // True only when sceneName === 'minute-before-archive' AND legal depart.pending.target or activePassenger points to it
  assert.equal(harness.reliefContext('minute-before-archive'), true);
  assert.equal(harness.reliefContext('threshold'), false);
  assert.equal(harness.reliefContext('unending-gallery'), false);

  // When activePassenger is for threshold, minute-before-archive should return false
  const harnessThresholdActive = createV102Harness({
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      endings: ['the-weather-finally-boarded'],
      latestOrderByEnding: {
        'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
        'the-seasons-returned-to-yesterday': [],
        'each-season-found-its-own-stop': [],
      },
      activePassenger: {
        outcome: 'the-weather-finally-boarded',
        order: ['spring', 'summer', 'autumn', 'winter'],
      },
    },
  });
  assert.equal(harnessThresholdActive.reliefContext('minute-before-archive'), false);

  // Assert index.js sceneInit source contains exact guard
  assert.ok(indexJs.includes('if (RELIEF_SCENE_NAMES.includes(name) && !weatherlessShelterReliefReceiptContext(name)) enterRelief(RELIEF_NAME_SCENE[name]);'), 'sceneInit must have narrow relief receipt guard');
});

// -------------------------------------------------------------
// Test Group 12: Route Guard / Bridge Allows strict check
// -------------------------------------------------------------
test('Group 12: Narrow bridge allows check for v102 destinations in resolveScene', () => {
  const harness = createV102Harness({
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      endings: ['each-season-found-its-own-stop'],
      latestOrderByEnding: {
        'the-weather-finally-boarded': [],
        'the-seasons-returned-to-yesterday': [],
        'each-season-found-its-own-stop': ['spring', 'autumn', 'summer', 'winter'],
      },
      lastOutcome: 'each-season-found-its-own-stop',
    },
  });

  // Bridge allows unending-gallery because lastOutcome is each-season-found-its-own-stop
  assert.equal(harness.bridge('unending-gallery'), true);
  assert.equal(harness.bridge('minute-before-archive'), false);
  assert.equal(harness.bridge('threshold'), false);

  // Fabricated / bad target scene
  assert.equal(harness.bridge('some-fabricated-scene'), false);
});

// -------------------------------------------------------------
// Test Group 13: Global forget handler and state clearing
// -------------------------------------------------------------
test('Group 13: Forget handler removes storage key, clears AutoAdvance and resets DOM', () => {
  const harness = createV102Harness({
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      draft: { order: ['spring', 'summer', 'autumn', 'winter'] },
      endings: ['the-weather-finally-boarded'],
      latestOrderByEnding: {
        'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
        'the-seasons-returned-to-yesterday': [],
        'each-season-found-its-own-stop': [],
      },
    },
  });
  harness.syncAll();
  assert.equal(harness.mem.has('goddead_v102_weatherless_shelter'), true);

  harness.forget();
  assert.equal(harness.mem.has('goddead_v102_weatherless_shelter'), false);
  assert.equal(harness.getSelectedTicket(), 'spring');
  assert.equal(harness.getExampleShown(), false);

  // Upstream storage remains untouched
  assert.equal(harness.mem.has('goddead_v101_dawn_weaving'), true);
  assert.equal(harness.mem.has('goddead_v100_hundredth_wake'), true);
});

// -------------------------------------------------------------
// Test Group 14: Progress Guide helper weatherlessShelterProgressStep
// -------------------------------------------------------------
test('Group 14: Progress helper states: upstream old active / own in-progress / all 3 done', () => {
  // Case 1: Upstream v101 active courier
  const harnessCourier = createV102Harness({
    v101ActiveCourier: { outcome: 'the-hundred-and-first-day-began', pattern: 'lllllllll' },
  });
  const stepCourier = harnessCourier.progressStep();
  assert.equal(stepCourier.title, 'v102 等候旧回执');
  assert.equal(stepCourier.done, false);
  assert.ok(stepCourier.items[0].includes('先带着织物回执返回黎明织造厂'));

  // Case 2: In progress (1 ending collected)
  const harnessInProgress = createV102Harness({
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      endings: ['the-weather-finally-boarded'],
      latestOrderByEnding: {
        'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
        'the-seasons-returned-to-yesterday': [],
        'each-season-found-its-own-stop': [],
      },
    },
  });
  const stepProg = harnessInProgress.progressStep();
  assert.equal(stepProg.title, 'v102 没有天气的候车亭');
  assert.equal(stepProg.done, false);
  assert.ok(stepProg.items.some((it) => it.includes('季节退回昨天') || it.includes('各过各的季节')));

  // Case 3: All 3 endings collected
  const harnessDone = createV102Harness({
    initialStore: {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      endings: [
        'the-weather-finally-boarded',
        'the-seasons-returned-to-yesterday',
        'each-season-found-its-own-stop',
      ],
      latestOrderByEnding: {
        'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
        'the-seasons-returned-to-yesterday': ['spring', 'winter', 'autumn', 'summer'],
        'each-season-found-its-own-stop': ['spring', 'autumn', 'summer', 'winter'],
      },
    },
  });
  const stepDone = harnessDone.progressStep();
  assert.equal(stepDone.title, 'v103 收不到影子的照相馆 (Harness Sentinel)');
  assert.equal(stepDone.done, false);
  assert.deepEqual(stepDone.items, ['[ ] 站位与双向灯光']);
});

/* ============================================================
   GROUP 13: COMPREHENSIVE TRUSTED CAPTURE & COLD RESTORE FOR ALL 7 PENDING KINDS
   ============================================================ */

test('Cold restore matrix: Capture canonical pending from actual trusted HTML listeners for all 7 kinds', () => {
  const seedDraft = (h, order) => {
    for (let i = 0; i < order.length; i++) {
      h.click(`ws-ticket-${order[i]}`);
      h.click(`ws-slot-${i}`);
    }
  };

  const variants = [
    // 1. entry threshold
    {
      name: 'entry (threshold)',
      capture: () => {
        const h = createV102Harness({ currentHash: 'threshold' });
        h.syncAll();
        h.click('ws-entry-threshold');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'threshold', exactTarget: 'weatherless-bus-shelter' };
      },
      checkSettled: (st) => {
        assert.equal(st.visited.hall, true);
        assert.equal(st.pending, null);
      },
    },
    // 2. entry remembrance
    {
      name: 'entry (remembrance)',
      capture: () => {
        const h = createV102Harness({ currentHash: 'remembrance' });
        h.syncAll();
        h.click('ws-entry-remembrance');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'remembrance', exactTarget: 'weatherless-bus-shelter' };
      },
      checkSettled: (st) => {
        assert.equal(st.visited.hall, true);
        assert.equal(st.pending, null);
      },
    },
    // 3. start
    {
      name: 'start',
      capture: () => {
        const h = createV102Harness({
          currentHash: 'weatherless-bus-shelter',
          initialStore: { version: 102, visited: { hall: true, board: false, platform: false } },
        });
        h.syncAll();
        h.click('ws-new');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'weatherless-bus-shelter', exactTarget: 'season-dispatch-board' };
      },
      checkSettled: (st) => {
        assert.equal(st.visited.board, true);
        assert.equal(st.pending, null);
      },
    },
    // 4. preview
    {
      name: 'preview',
      capture: () => {
        const h = createV102Harness({
          currentHash: 'season-dispatch-board',
          initialStore: { version: 102, visited: { hall: true, board: true, platform: false } },
        });
        h.syncAll();
        seedDraft(h, ['spring', 'summer', 'autumn', 'winter']);
        h.click('ws-preview-btn');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'season-dispatch-board', exactTarget: 'four-season-platform' };
      },
      checkSettled: (st) => {
        assert.equal(st.visited.platform, true);
        assert.equal(st.pending, null);
      },
    },
    // 5. revise
    {
      name: 'revise',
      capture: () => {
        const h = createV102Harness({
          currentHash: 'four-season-platform',
          initialStore: {
            version: 102,
            visited: { hall: true, board: true, platform: true },
            draft: { order: ['spring', 'summer', 'autumn', 'winter'] },
          },
        });
        h.syncAll();
        h.click('ws-revise');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'four-season-platform', exactTarget: 'season-dispatch-board' };
      },
      checkSettled: (st) => {
        assert.equal(st.visited.board, true);
        assert.equal(st.pending, null);
      },
    },
    // 6. abandon
    {
      name: 'abandon',
      capture: () => {
        const h = createV102Harness({
          currentHash: 'season-dispatch-board',
          initialStore: { version: 102, visited: { hall: true, board: true, platform: false } },
        });
        h.syncAll();
        h.click('ws-abandon');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'season-dispatch-board', exactTarget: 'weatherless-bus-shelter' };
      },
      checkSettled: (st) => {
        assert.equal(st.visited.hall, true);
        assert.equal(st.pending, null);
      },
    },
    // 7a. depart -> threshold (the-weather-finally-boarded)
    {
      name: 'depart (threshold)',
      capture: () => {
        const h = createV102Harness({
          currentHash: 'four-season-platform',
          initialStore: {
            version: 102,
            visited: { hall: true, board: true, platform: true },
            draft: { order: ['spring', 'summer', 'autumn', 'winter'] },
          },
        });
        h.syncAll();
        h.click('ws-depart');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'four-season-platform', exactTarget: 'threshold' };
      },
      checkSettled: (st) => {
        assert.equal(st.runs, 1);
        assert.deepEqual(st.endings, ['the-weather-finally-boarded']);
        assert.deepEqual(st.activePassenger, { outcome: 'the-weather-finally-boarded', order: ['spring', 'summer', 'autumn', 'winter'] });
        assert.equal(st.pending, null);
      },
    },
    // 7b. depart -> minute-before-archive (the-seasons-returned-to-yesterday)
    {
      name: 'depart (minute-before-archive)',
      capture: () => {
        const h = createV102Harness({
          currentHash: 'four-season-platform',
          initialStore: {
            version: 102,
            visited: { hall: true, board: true, platform: true },
            draft: { order: ['spring', 'winter', 'autumn', 'summer'] },
          },
        });
        h.syncAll();
        h.click('ws-depart');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'four-season-platform', exactTarget: 'minute-before-archive' };
      },
      checkSettled: (st) => {
        assert.equal(st.runs, 1);
        assert.deepEqual(st.endings, ['the-seasons-returned-to-yesterday']);
        assert.deepEqual(st.activePassenger, { outcome: 'the-seasons-returned-to-yesterday', order: ['spring', 'winter', 'autumn', 'summer'] });
        assert.equal(st.pending, null);
      },
    },
    // 7c. depart -> unending-gallery (each-season-found-its-own-stop)
    {
      name: 'depart (unending-gallery)',
      capture: () => {
        const h = createV102Harness({
          currentHash: 'four-season-platform',
          initialStore: {
            version: 102,
            visited: { hall: true, board: true, platform: true },
            draft: { order: ['spring', 'autumn', 'summer', 'winter'] },
          },
        });
        h.syncAll();
        h.click('ws-depart');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'four-season-platform', exactTarget: 'unending-gallery' };
      },
      checkSettled: (st) => {
        assert.equal(st.runs, 1);
        assert.deepEqual(st.endings, ['each-season-found-its-own-stop']);
        assert.deepEqual(st.activePassenger, { outcome: 'each-season-found-its-own-stop', order: ['spring', 'autumn', 'summer', 'winter'] });
        assert.equal(st.pending, null);
      },
    },
    // 8. passenger-return
    {
      name: 'passenger-return',
      capture: () => {
        const h = createV102Harness({
          currentHash: 'threshold',
          initialStore: {
            version: 102,
            visited: { hall: true, board: true, platform: true },
            endings: ['the-weather-finally-boarded'],
            latestOrderByEnding: {
              'the-weather-finally-boarded': ['spring', 'summer', 'autumn', 'winter'],
              'the-seasons-returned-to-yesterday': [],
              'each-season-found-its-own-stop': [],
            },
            runs: 1,
            lastOutcome: 'the-weather-finally-boarded',
            activePassenger: { outcome: 'the-weather-finally-boarded', order: ['spring', 'summer', 'autumn', 'winter'] },
          },
        });
        h.syncAll();
        h.click('ws-passenger-return-threshold');
        return { raw: h.mem.get('goddead_v102_weatherless_shelter'), logicalSource: 'threshold', exactTarget: 'weatherless-bus-shelter' };
      },
      checkSettled: (st) => {
        assert.equal(st.activePassenger, null);
        assert.equal(st.visited.hall, true);
        assert.equal(st.pending, null);
      },
    },
  ];

  for (const v of variants) {
    const captured = v.capture();
    assert.ok(captured.raw, `Snapshot must exist for ${v.name}`);

    // (A) Logical source: resolvePending then replayPending preserves pending and raw storage
    {
      const hSource = createV102Harness({
        currentHash: captured.logicalSource,
        initialStore: captured.raw,
      });
      const rawBefore = hSource.mem.get('goddead_v102_weatherless_shelter');
      const v100Before = hSource.mem.get('goddead_v100_hundredth_wake');
      const v101Before = hSource.mem.get('goddead_v101_dawn_weaving');
      const stResolved = hSource.resolvePending(captured.logicalSource);
      assert.ok(stResolved.pending, `Pending must be preserved at logical source for ${v.name}`);
      assert.equal(stResolved.pending.kind, JSON.parse(captured.raw).pending.kind);
      assert.equal(hSource.mem.get('goddead_v102_weatherless_shelter'), rawBefore);
      assert.equal(hSource.mem.get('goddead_v100_hundredth_wake'), v100Before);
      assert.equal(hSource.mem.get('goddead_v101_dawn_weaving'), v101Before);

      // Replay preserves pending and raw storage and sets autoAdvance
      hSource.replayPending(captured.logicalSource);
      assert.equal(hSource.mem.get('goddead_v102_weatherless_shelter'), rawBefore);
      assert.equal(hSource.mem.get('goddead_v100_hundredth_wake'), v100Before);
      assert.equal(hSource.mem.get('goddead_v101_dawn_weaving'), v101Before);
      assert.equal(hSource.schedules.length, 1);
      assert.equal(hSource.schedules[0].target, captured.exactTarget);
    }

    // (B) Exact target: resolve + replay settles once, repeated arrival remains once
    {
      const hTarget = createV102Harness({
        currentHash: captured.exactTarget,
        initialStore: captured.raw,
      });
      const v100Before = hTarget.mem.get('goddead_v100_hundredth_wake');
      const v101Before = hTarget.mem.get('goddead_v101_dawn_weaving');
      const stSettled = hTarget.resolvePending(captured.exactTarget);
      v.checkSettled(stSettled);
      const rawSettled = hTarget.mem.get('goddead_v102_weatherless_shelter');
      assert.equal(stSettled.pending, null);
      assert.equal(hTarget.mem.get('goddead_v100_hundredth_wake'), v100Before);
      assert.equal(hTarget.mem.get('goddead_v101_dawn_weaving'), v101Before);

      // Repeated arrival remains once
      const stSecond = hTarget.resolvePending(captured.exactTarget);
      assert.equal(hTarget.mem.get('goddead_v102_weatherless_shelter'), rawSettled);
      assert.equal(hTarget.mem.get('goddead_v100_hundredth_wake'), v100Before);
      assert.equal(hTarget.mem.get('goddead_v101_dawn_weaving'), v101Before);
      v.checkSettled(stSecond);

      // Replay at settled target does not re-pend or re-settle
      hTarget.replayPending(captured.exactTarget);
      assert.equal(hTarget.mem.get('goddead_v102_weatherless_shelter'), rawSettled);
      assert.equal(hTarget.schedules.length, 0);
    }

    // (C) Unrelated corridor: cancels pending without mutating runs/endings/activePassenger
    {
      const hUnrelated = createV102Harness({
        currentHash: 'corridor',
        initialStore: captured.raw,
      });
      const parsedBefore = JSON.parse(captured.raw);
      const v100Before = hUnrelated.mem.get('goddead_v100_hundredth_wake');
      const v101Before = hUnrelated.mem.get('goddead_v101_dawn_weaving');
      const stCancelled = hUnrelated.resolvePending('corridor');
      assert.equal(stCancelled.pending, null);
      assert.equal(stCancelled.runs, parsedBefore.runs || 0);
      assert.deepEqual(stCancelled.endings, parsedBefore.endings || []);
      assert.deepEqual(stCancelled.activePassenger, parsedBefore.activePassenger || null);
      assert.equal(hUnrelated.mem.get('goddead_v100_hundredth_wake'), v100Before);
      assert.equal(hUnrelated.mem.get('goddead_v101_dawn_weaving'), v101Before);
    }
  }
});

test('Pending block under upstream lock (v100Pending, v101Pending or v101ActiveCourier)', () => {
  const configs = [
    { v100Pending: { kind: 'court', target: 'threshold' } },
    { v101Pending: { kind: 'depart', target: 'threshold' } },
    { v101ActiveCourier: { outcome: 'the-hundred-and-first-day-began', pattern: 'lllllllll' } },
  ];

  for (const cfg of configs) {
    const hPending = createV102Harness({
      currentHash: 'weatherless-bus-shelter',
      ...cfg,
      initialStore: {
        version: 102,
        visited: { hall: true, board: false, platform: false },
        pending: { kind: 'start', source: 'weatherless-bus-shelter', target: 'season-dispatch-board', feedback: '排班牌翻动起来，黄铜夹扣在四个到站位置就位。' },
      },
    });

    const rawBefore = hPending.mem.get('goddead_v102_weatherless_shelter');
    const v100RawBefore = hPending.mem.get('goddead_v100_hundredth_wake');
    const v101RawBefore = hPending.mem.get('goddead_v101_dawn_weaving');
    assert.equal(hPending.available(), false);

    // resolvePending must hold canonical raw without settlement
    const res = hPending.resolvePending('season-dispatch-board');
    assert.ok(res.pending);
    assert.equal(hPending.mem.get('goddead_v102_weatherless_shelter'), rawBefore);
    assert.equal(hPending.mem.get('goddead_v100_hundredth_wake'), v100RawBefore);
    assert.equal(hPending.mem.get('goddead_v101_dawn_weaving'), v101RawBefore);

    // replayPending must not schedule new timer
    hPending.replayPending('weatherless-bus-shelter');
    assert.equal(hPending.schedules.length, 0);
    assert.equal(hPending.mem.get('goddead_v102_weatherless_shelter'), rawBefore);
    assert.equal(hPending.mem.get('goddead_v100_hundredth_wake'), v100RawBefore);
    assert.equal(hPending.mem.get('goddead_v101_dawn_weaving'), v101RawBefore);

    // UI sync shows disabled entry with notes
    hPending.syncAll();
    const entryThreshold = hPending.$('#ws-entry-threshold');
    if (entryThreshold) {
      assert.equal(entryThreshold.disabled, true);
    }
    const entryRemembrance = hPending.$('#ws-entry-remembrance');
    if (entryRemembrance) {
      assert.equal(entryRemembrance.disabled, true);
    }
  }
});

test('Canonical tampering validation across all seven pending kinds rejects corrupted pending payloads', () => {
  const canonicalOrder = ['spring', 'summer', 'autumn', 'winter'];
  const testCases = [
    {
      kind: 'entry',
      sourceScene: 'threshold',
      buttonId: 'ws-entry-threshold',
      mutations: [
        { desc: 'corrupted source', mutate: (p) => ({ ...p, source: 'invalid-source' }) },
        { desc: 'corrupted target', mutate: (p) => ({ ...p, target: 'threshold' }) },
        { desc: 'corrupted feedback', mutate: (p) => ({ ...p, feedback: 'tampered-feedback' }) },
        { desc: 'extra unknown field', mutate: (p) => ({ ...p, unknownField: true }) },
      ],
    },
    {
      kind: 'start',
      sourceScene: 'weatherless-bus-shelter',
      buttonId: 'ws-new',
      mutations: [
        { desc: 'corrupted source', mutate: (p) => ({ ...p, source: 'invalid-hall' }) },
        { desc: 'corrupted target', mutate: (p) => ({ ...p, target: 'hall' }) },
        { desc: 'corrupted feedback', mutate: (p) => ({ ...p, feedback: 'tampered-feedback' }) },
        { desc: 'extra unknown field', mutate: (p) => ({ ...p, unknownField: true }) },
      ],
    },
    {
      kind: 'preview',
      sourceScene: 'season-dispatch-board',
      buttonId: 'ws-preview-btn',
      mutations: [
        { desc: 'corrupted source', mutate: (p) => ({ ...p, source: 'invalid-board' }) },
        { desc: 'corrupted target', mutate: (p) => ({ ...p, target: 'board' }) },
        { desc: 'corrupted feedback', mutate: (p) => ({ ...p, feedback: 'tampered-feedback' }) },
        { desc: 'corrupted outcome', mutate: (p) => ({ ...p, outcome: 'tampered-outcome' }) },
        { desc: 'corrupted order', mutate: (p) => ({ ...p, order: ['winter', 'summer', 'autumn', 'spring'] }) },
        { desc: 'extra unknown field', mutate: (p) => ({ ...p, unknownField: true }) },
      ],
    },
    {
      kind: 'revise',
      sourceScene: 'four-season-platform',
      buttonId: 'ws-revise',
      mutations: [
        { desc: 'corrupted source', mutate: (p) => ({ ...p, source: 'invalid-platform' }) },
        { desc: 'corrupted target', mutate: (p) => ({ ...p, target: 'platform' }) },
        { desc: 'corrupted feedback', mutate: (p) => ({ ...p, feedback: 'tampered-feedback' }) },
        { desc: 'extra unknown field', mutate: (p) => ({ ...p, unknownField: true }) },
      ],
    },
    {
      kind: 'depart',
      sourceScene: 'four-season-platform',
      buttonId: 'ws-depart',
      mutations: [
        { desc: 'corrupted source', mutate: (p) => ({ ...p, source: 'invalid-platform' }) },
        { desc: 'corrupted target', mutate: (p) => ({ ...p, target: 'platform' }) },
        { desc: 'corrupted feedback', mutate: (p) => ({ ...p, feedback: 'tampered-feedback' }) },
        { desc: 'corrupted outcome', mutate: (p) => ({ ...p, outcome: 'tampered-outcome' }) },
        { desc: 'corrupted order', mutate: (p) => ({ ...p, order: ['winter', 'summer', 'autumn', 'spring'] }) },
        { desc: 'extra unknown field', mutate: (p) => ({ ...p, unknownField: true }) },
      ],
    },
    {
      kind: 'abandon',
      sourceScene: 'season-dispatch-board',
      buttonId: 'ws-abandon',
      mutations: [
        { desc: 'corrupted source', mutate: (p) => ({ ...p, source: 'invalid-board' }) },
        { desc: 'corrupted target', mutate: (p) => ({ ...p, target: 'board' }) },
        { desc: 'corrupted feedback', mutate: (p) => ({ ...p, feedback: 'tampered-feedback' }) },
        { desc: 'extra unknown field', mutate: (p) => ({ ...p, unknownField: true }) },
      ],
    },
    {
      kind: 'passenger-return',
      sourceScene: 'threshold',
      buttonId: 'ws-passenger-return-threshold',
      isPassengerReturn: true,
      mutations: [
        { desc: 'corrupted from', mutate: (p) => ({ ...p, from: 'invalid-from' }) },
        { desc: 'corrupted target', mutate: (p) => ({ ...p, target: 'invalid-hall' }) },
        { desc: 'corrupted feedback', mutate: (p) => ({ ...p, feedback: 'tampered-feedback' }) },
        { desc: 'corrupted outcome', mutate: (p) => ({ ...p, outcome: 'tampered-outcome' }) },
        { desc: 'extra unknown field', mutate: (p) => ({ ...p, unknownField: true }) },
      ],
    },
  ];

  for (const tc of testCases) {
    const preconditionState = {
      version: 102,
      visited: { hall: true, board: true, platform: true },
      draft: { order: [...canonicalOrder] },
      activePassenger: tc.isPassengerReturn
        ? { outcome: 'the-weather-finally-boarded', order: [...canonicalOrder] }
        : null,
      endings: tc.isPassengerReturn ? ['the-weather-finally-boarded'] : [],
      latestOrderByEnding: tc.isPassengerReturn
        ? { 'the-weather-finally-boarded': [...canonicalOrder] }
        : {},
      runs: tc.isPassengerReturn ? 1 : 0,
      lastOutcome: tc.isPassengerReturn ? 'the-weather-finally-boarded' : null,
      pending: null,
    };

    const harness = createV102Harness({
      initialStore: preconditionState,
      currentHash: tc.sourceScene,
    });

    harness.syncAll();
    harness.click(tc.buttonId, true);

    const baselinePending = harness.get().pending;
    assert.ok(baselinePending !== null, `Expected non-null canonical pending for ${tc.kind}`);
    assert.strictEqual(baselinePending.kind, tc.kind, `Pending kind must match ${tc.kind}`);

    const canonicalRawStoreJson = harness.mem.get('goddead_v102_weatherless_shelter');
    assert.ok(canonicalRawStoreJson, `Store raw payload must exist for ${tc.kind}`);
    const canonicalRawState = JSON.parse(canonicalRawStoreJson);
    assert.deepStrictEqual(harness.get().pending, canonicalRawState.pending);

    for (const m of tc.mutations) {
      const mutatedState = JSON.parse(canonicalRawStoreJson);
      mutatedState.pending = m.mutate(canonicalRawState.pending);

      const tamperHarness = createV102Harness({
        initialStore: mutatedState,
        currentHash: tc.sourceScene,
      });

      assert.strictEqual(
        tamperHarness.get().pending,
        null,
        `Expected corrupted pending (${tc.kind} - ${m.desc}) to be rejected as null`,
      );
    }
  }
});

/* ============================================================
   GROUP 14: PROGRESS ENTRY BUTTON RESOLUTION AND DOM INTEGRITY
   ============================================================ */

test('Progress entry button resolves native #ws-entry-remembrance inside #ws-codex and preserves dw mapping', () => {
  const matches = [...indexJs.matchAll(/const\s+progressEntryButton\s*=\s*\([^)]*\)\s*=>[^;]+;/g)];
  assert.equal(matches.length, 1, 'indexJs must define exactly 1 occurrence of const progressEntryButton helper');
  const actualSource = matches[0][0];
  const progressEntryButton = new Function('$', `${actualSource}; return progressEntryButton;`)((id) => harness.$(id));

  const harness = createV102Harness({ currentHash: 'remembrance' });
  harness.syncAll();

  const wsBtn = progressEntryButton('ws');
  assert.ok(wsBtn, '#ws-entry-remembrance must exist');
  assert.equal(wsBtn.id, 'ws-entry-remembrance');

  const codex = harness.$('#ws-codex');
  assert.ok(codex, '#ws-codex must exist');

  // Verify ws-entry-remembrance is inside #ws-codex in actual indexHtml via balanced div ancestry
  const codexStartIdx = indexHtml.indexOf('id="ws-codex"');
  assert.ok(codexStartIdx !== -1, 'indexHtml must contain id="ws-codex"');
  const divTagStart = indexHtml.lastIndexOf('<div', codexStartIdx);
  assert.ok(divTagStart !== -1, 'ws-codex div start must be found');

  let depth = 0;
  let codexEndIdx = -1;
  const tagRegex = /<(\/)?div\b[^>]*>/gi;
  tagRegex.lastIndex = divTagStart;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(indexHtml)) !== null) {
    if (tagMatch[1] === '/') {
      depth--;
      if (depth === 0) {
        codexEndIdx = tagRegex.lastIndex;
        break;
      }
    } else {
      depth++;
    }
  }
  assert.ok(codexEndIdx > divTagStart, 'balanced ws-codex div close must be resolved');
  const codexHtml = indexHtml.slice(divTagStart, codexEndIdx);
  assert.ok(
    codexHtml.includes('id="ws-entry-remembrance"'),
    'ws-entry-remembrance must reside inside ws-codex container'
  );

  const dwBtn = progressEntryButton('dw');
  assert.ok(dwBtn, '#dw-entry-remembrance must exist');
  assert.equal(dwBtn.id, 'dw-entry-remembrance');
});

test('Native module onTrustedWs listener bindings map strictly to unique actual HTML native buttons', () => {
  const harness = createV102Harness({ currentHash: '' });
  harness.syncAll();

  // Inspect all registered listeners on the harness for ws elements
  const registeredIds = Array.from(harness.listeners.keys()).filter((id) => id.startsWith('ws-'));
  assert.equal(registeredIds.length, 21, 'Must register exactly 21 ws-* element listeners');

  for (const id of registeredIds) {
    const list = harness.listeners.get(id);
    assert.equal(list.length, 1, `Listener count for #${id} must be exactly 1`);
    assert.equal(list[0].evt, 'click', `Listener for #${id} must be click`);

    // Verify presence directly in actual parsed element registry from HTML (not fabricated)
    assert.ok(elementRegistry.has(id), `Element #${id} must exist natively in parsed HTML elementRegistry`);
    const elem = elementRegistry.get(id);
    assert.equal(elem.tagName, 'button', `Element #${id} in HTML must be a native <button> tagName`);

    // Direct regex check against native indexHtml source for uniqueness (exactly 1 occurrence)
    const nativeIdRegex = new RegExp(`\\bid=["']${id}["']`, 'gi');
    const idOccurrences = indexHtml.match(nativeIdRegex);
    assert.ok(idOccurrences, `indexHtml must contain id="${id}"`);
    assert.equal(idOccurrences.length, 1, `Element id="${id}" must occur uniquely in native indexHtml`);

    const nativeBtnRegex = new RegExp(`<button[^>]*\\bid=["']${id}["'][^>]*>`, 'i');
    assert.ok(nativeBtnRegex.test(indexHtml), `indexHtml must contain native <button id="${id}">`);
  }
});

test('v102 weatherless shelter handles bad JSON in initialStore gracefully without wiping raw store', () => {
  const h = createV102Harness({ initialStore: '{bad' });
  const state = h.get();
  assert.strictEqual(state.version, 102);
  assert.strictEqual(state.runs, 0);
  assert.strictEqual(state.pending, null);
  assert.strictEqual(state.activePassenger, null);
  assert.deepStrictEqual(state.draft.order, [null, null, null, null]);
  assert.strictEqual(h.mem.get('goddead_v102_weatherless_shelter'), '{bad');
});

test('v102 markers and key declarations exist exactly once and section isolates from v101', () => {
  assert.strictEqual(indexJs.split(v102ExactHeader).length - 1, 1);
  assert.strictEqual(indexJs.split(guideMarker).length - 1, 1);
  assert.strictEqual(indexJs.split("const WEATHERLESS_SHELTER_KEY = 'goddead_v102_weatherless_shelter';").length - 1, 1);
  assert.strictEqual(v102Section.includes('v101 黎明织造厂'), false);
});

test('v102: sceneInit and legacy v45 relief integration behavior audit', () => {
  // Extract real production sceneInit function verbatim
  const sceneInitMatch = indexJs.match(/const sceneInit = \(name\) => \{[\s\S]*?\n  \};/);
  assert.ok(sceneInitMatch, 'sceneInit must be present in script.js');
  const sceneInitSrc = sceneInitMatch[0];

  // Extract real production v45 relief code range verbatim
  // Exact prefix boundary is '  /* 九个画面动作' beginning after RELIEF_KEY
  const v45StartMarker = 'const RELIEF_KEY = "goddead_v45_absent_relief";';
  const v45EndMarker = '  /* 九个画面动作';
  const v45StartIdx = indexJs.indexOf(v45StartMarker);
  const v45EndIdx = indexJs.indexOf(v45EndMarker, v45StartIdx);
  assert.ok(v45StartIdx !== -1, 'v45 start marker must be present in script.js');
  assert.ok(v45EndIdx !== -1 && v45EndIdx > v45StartIdx, 'v45 end marker must follow start marker');
  const v45ReliefSrc = indexJs.slice(v45StartIdx, v45EndIdx);
  assert.ok(v45ReliefSrc.length > 500, 'v45 relief source must be substantial');
  assert.ok(v45ReliefSrc.includes('getRelief'), 'v45 relief source must include getRelief');
  assert.ok(v45ReliefSrc.includes('markReliefVisited'), 'v45 relief source must include markReliefVisited');
  assert.ok(v45ReliefSrc.includes('enterRelief'), 'v45 relief source must include enterRelief');

  // Helper to compile and run sceneInit + v45 source in an isolated environment directly wired to harness
  function createSceneInitRunner(h) {
    const store = {
      get: (k, def) => (h.mem.has(k) ? h.mem.get(k) : def),
      set: (k, v) => h.mem.set(k, String(v)),
    };

    const AutoAdvance = {
      schedule: (scene, target, opts) => h.schedules.push({ scene, target, opts }),
      has: (scene) => h.schedules.some((s) => s.scene === scene),
      clear: (scene) => {
        const idx = h.schedules.findIndex((s) => s.scene === scene);
        if (idx !== -1) h.schedules.splice(idx, 1);
      },
      clearAll: () => {
        h.schedules.length = 0;
      },
    };

    const doc = {
      title: 'Goddead',
    };

    const scenes = {
      'threshold': { dataset: { title: '门槛' } },
      'weatherless-bus-shelter': { dataset: { title: '没有天气的候车亭' } },
      'season-dispatch-board': { dataset: { title: '四时调度板' } },
      'four-season-platform': { dataset: { title: '四序站台' } },
      'minute-before-archive': { dataset: { title: '档案前一分' } },
      'cold-wick-service-bay': { dataset: { title: '冷灯芯检修间' } },
      'absent-relief-locker': { dataset: { title: '缺班更衣柜' } },
      'unending-gallery': { dataset: { title: '无尽画廊' } },
      'remembrance': { dataset: { title: '追忆' } },
    };

    const runnerSrc = `
      const Array = globalThis.Array;
      const JSON = globalThis.JSON;
      const Number = globalThis.Number;
      const Math = globalThis.Math;
      const Object = globalThis.Object;
      const Boolean = globalThis.Boolean;
      const Set = globalThis.Set;
      const String = globalThis.String;

      const weatherlessShelterReliefReceiptContext = (s) => h.reliefContext(s);
      const resolveWeatherlessShelterPendingOnArrival = (s) => h.resolvePending(s);
      const replayWeatherlessShelterPending = (s) => h.replayPending(s);
      const resolveShadowlessPhotographyPendingOnArrival = () => {};
      const replayShadowlessPhotographyPending = () => {};
      const resolveWakeForAnotherHotelPendingOnArrival = () => {};
      const replayWakeForAnotherHotelPending = () => {};
      const resolveYesterdayBreakfastPendingOnArrival = () => {};
      const replayYesterdayBreakfastPending = () => {};
      const syncWeatherlessShelterAll = () => h.syncAll();

      let thresholdConsumed = false;
      let protocolConsumed = false;
      let corridorConsumed = false;
      let corridorDetourArmed = false;
      let watchConsumed = false;
      let watchReliefArmed = false;
      let cancellationConsumed = false;
      let actingConsumed = false;
      let offeringConsumed = false;
      let reliquaryConsumed = false;
      let statsCounted = false;
      let offeringFigure = null;
      let numEls = {};
      let arrivals = 0;
      let fragments = 0;
      let gstate = { prayersOffered: 0 };
      const corruptionOf = () => 0;
      const countUp = () => {};

      const revealScene = () => {};
      const syncDoorOpenState = () => {};
      const startAnomaly = () => {};
      const syncDriftEntry = () => {};
      const syncWatchDoor = () => {};
      const syncBranchEntries = () => {};
      const syncDeepEntries = () => {};
      const startTrace = () => {};
      const enterBranch = () => {};
      const syncPressureRoom = () => {};
      const replayPressurePending = () => {};
      const paintPressure = () => {};
      const enterDeep = () => {};
      const syncFailureRoom = () => {};
      const replayFailurePending = () => {};
      const enterFailureDesk = () => {};
      const enterForecourt = () => {};
      const enterAnnex = () => {};
      const enterClearinghouse = () => {};
      const enterSettleResult = () => {};
      const enterReview = () => {};
      const enterReviewResult = () => {};
      const replayCustodyPending = () => {};
      const enterCustodyOffice = () => {};
      const enterValuation = () => {};
      const enterElevator = () => {};
      const enterFloor = () => {};
      const enterFloorRoom = () => {};
      const syncAnomalyRoom = () => {};
      const syncEvidenceRoom = () => {};
      const replayAnomalyPending = () => {};
      const replayEvidencePending = () => {};
      const enterAnomalyBackroom = () => {};
      const enterEvidenceScene = () => {};
      const enterLedgerScene = () => {};
      const replayLedgerPending = () => {};
      const syncAppealSeal = () => {};
      const replayAppealPending = () => {};
      const enterAppealScene = () => {};
      const syncCrossRoom = () => {};
      const replayCrossPending = () => {};
      const enterCrossDesk = () => {};
      const enterRegistry = () => {};
      const enterCallback = () => {};
      const enterProxy = () => {};
      const enterAudit = () => {};
      const paintBelief = () => {};
      const enterAuditRoute = () => {};
      const syncBeliefRoute = () => {};
      const replayBeliefPending = () => {};
      const enterLateral = () => {};
      const enterBackroom = () => {};
      const enterDrift = () => {};
      const enterKnockNet = () => {};
      const enterPaperback = () => {};
      const enterWatch = () => {};
      const enterSidetone = () => {};
      const syncListeningRoom = () => {};
      const replayListeningPending = () => {};
      const enterListeningConsole = () => {};
      const enterReturnRoom = () => {};
      const enterCopy = () => {};
      const enterSwitch = () => {};
      const enterDeadletter = () => {};
      const enterCancel = () => {};
      const enterActing = () => {};
      const syncRulingOfferingUI = () => {};
      const enterReliquary = () => {};
      const enterEndingReturnOffice = () => {};
      const replayEndingReturnPending = () => {};
      const enterEndingReturnGallery = () => {};
      const paintWatch = () => {};
      const paintLine4 = () => {};
      const paintDeliver = () => {};
      const paintCancel = () => {};
      const paintActing = () => {};
      const paintRelicMemory = () => {};
      const paintBranchMemory = () => {};
      const paintDeepMemory = () => {};
      const paintForecourtMemory = () => {};
      const paintAnnexMemory = () => {};
      const paintAnomalyMemory = () => {};
      const paintFloorAnomalyMemory = () => {};
      const paintEvidenceAuditMemory = () => {};
      const paintLedgerMemory = () => {};
      const paintAppealMemory = () => {};
      const paintCrossMemory = () => {};
      const paintCustodyMemory = () => {};
      const paintFailureMemory = () => {};
      const paintListeningMemory = () => {};
      const paintValuationMemory = () => {};
      const paintFloorMemory = () => {};
      const paintRegistryMemory = () => {};
      const paintCallbackMemory = () => {};
      const paintProxyMemory = () => {};
      const paintAuditMemory = () => {};
      const paintBeliefMemory = () => {};
      const paintPressureMemory = () => {};
      const paintLateralMemory = () => {};
      const paintBackroomMemory = () => {};
      const paintDriftMemory = () => {};
      const paintKnockNetMemory = () => {};
      const paintPaperbackMemory = () => {};
      const paintReliefMemory = () => {};
      const paintSidetoneMemory = () => {};
      const paintReturnRoomMemory = () => {};
      const paintCopyMemory = () => {};
      const paintSettlementMemory = () => {};
      const syncGovernanceRemembrance = () => {};
      const syncEndingReturnRemembrance = () => {};
      const syncCausalMailRemembrance = () => {};
      const replayCausalPending = () => {};
      const syncCausalEchoStamps = () => {};
      const syncCausalScarStages = () => {};
      const replayCausalScarPending = () => {};
      const syncCauselessWard = () => {};
      const syncCausalScarRemembrance = () => {};
      const syncCausalScarLinks = () => {};
      const syncCounterfactualEchoes = () => {};
      const syncCounterfactualRemembrance = () => {};
      const syncCounterfactualLinks = () => {};
      const replayCounterfactualPending = () => {};
      const syncBloodlessKinEchoes = () => {};
      const syncBloodlessRemembrance = () => {};
      const syncBloodlessLinks = () => {};
      const replayBloodlessPending = () => {};
      const syncGenerationLoansNotices = () => {};
      const syncGenerationLoansRemembrance = () => {};
      const syncGenerationLoansLinks = () => {};
      const replayGenerationLoansPending = () => {};
      const syncPosthumousCensusSummons = () => {};
      const syncPosthumousCensusRemembrance = () => {};
      const syncPosthumousCensusLinks = () => {};
      const replayPosthumousCensusPending = () => {};
      const syncDeadParliamentWhips = () => {};
      const syncDeadParliamentRemembrance = () => {};
      const syncDeadParliamentLinks = () => {};
      const replayDeadParliamentPending = () => {};
      const syncDeathDiplomacyCouriers = () => {};
      const syncDeathDiplomacyRemembrance = () => {};
      const syncDeathDiplomacyLinks = () => {};
      const replayDeathDiplomacyPending = () => {};
      const syncLastWordBankBank = () => {};
      const syncLastWordBankMint = () => {};
      const syncLastWordBankVault = () => {};
      const syncLastWordBankDefault = () => {};
      const syncLastWordBankRemittances = () => {};
      const paintLastWordBankMemory = () => {};
      const paintLastWordBankCodex = () => {};
      const syncLastWordBankRemembrance = () => {};
      const syncLastWordBankLinks = () => {};
      const replayLastWordBankPending = () => {};
      const syncDreamCustomsCustoms = () => {};
      const syncDreamCustomsTerminal = () => {};
      const syncDreamCustomsBureau = () => {};
      const syncDreamCustomsYard = () => {};
      const syncDreamCustomsInspectors = () => {};
      const paintDreamCustomsMemory = () => {};
      const paintDreamCustomsCodex = () => {};
      const syncDreamCustomsRemembrance = () => {};
      const syncDreamCustomsLinks = () => {};
      const replayDreamCustomsPending = () => {};
      const syncTombstonePatentOfficeOffice = () => {};
      const syncTombstonePatentOfficeOssuary = () => {};
      const syncTombstonePatentOfficeExamination = () => {};
      const syncTombstonePatentOfficeTribunal = () => {};
      const syncTombstonePatentOfficeExaminers = () => {};
      const paintTombstonePatentOfficeMemory = () => {};
      const paintTombstonePatentOfficeCodex = () => {};
      const syncTombstonePatentOfficeRemembrance = () => {};
      const syncTombstonePatentOfficeLinks = () => {};
      const replayTombstonePatentOfficePending = () => {};
      const resolveApocalypseWarrantyOfficePendingOnArrival = () => {};
      const syncApocalypseWarrantyOffice = () => {};
      const syncApocalypseWarrantyMorgue = () => {};
      const syncApocalypseWarrantyBench = () => {};
      const syncApocalypseWarrantyYard = () => {};
      const syncApocalypseWarrantyAdjusters = () => {};
      const paintApocalypseWarrantyMemory = () => {};
      const paintApocalypseWarrantyCodex = () => {};
      const syncApocalypseWarrantyRemembrance = () => {};
      const syncApocalypseWarrantyLinks = () => {};
      const replayApocalypseWarrantyPending = () => {};
      const resolveRealityRefundCounterPendingOnArrival = () => {};
      const syncRealityRefundCounterCounter = () => {};
      const syncRealityRefundCounterIncinerator = () => {};
      const syncRealityRefundCounterInspection = () => {};
      const syncRealityRefundCounterCourt = () => {};
      const syncRealityRefundCounterCashiers = () => {};
      const paintRealityRefundCounterMemory = () => {};
      const paintRealityRefundCounterCodex = () => {};
      const syncRealityRefundCounterRemembrance = () => {};
      const syncRealityRefundCounterLinks = () => {};
      const replayRealityRefundCounterPending = () => {};
      const resolveSelfAuthenticityPendingOnArrival = () => {};
      const syncSelfAuthenticityOffice = () => {};
      const syncSelfAuthenticityVault = () => {};
      const syncSelfAuthenticityExamination = () => {};
      const syncSelfAuthenticityTribunal = () => {};
      const syncSelfAuthenticityAuthenticators = () => {};
      const paintSelfAuthenticityMemory = () => {};
      const paintSelfAuthenticityCodex = () => {};
      const syncSelfAuthenticityRemembrance = () => {};
      const syncSelfAuthenticityLinks = () => {};
      const replaySelfAuthenticityPending = () => {};
      const resolveFirstPersonRationingPendingOnArrival = () => {};
      const syncFirstPersonRationingBureau = () => {};
      const syncFirstPersonRationingArchive = () => {};
      const syncFirstPersonRationingChamber = () => {};
      const syncFirstPersonRationingCourt = () => {};
      const syncFirstPersonRationingAllocators = () => {};
      const paintFirstPersonRationingMemory = () => {};
      const paintFirstPersonRationingCodex = () => {};
      const syncFirstPersonRationingRemembrance = () => {};
      const syncFirstPersonRationingLinks = () => {};
      const replayFirstPersonRationingPending = () => {};
      const resolveUnspokenPersonhoodPendingOnArrival = () => {};
      const syncUnspokenPersonhoodCourt = () => {};
      const syncUnspokenPersonhoodArchive = () => {};
      const syncUnspokenPersonhoodExamination = () => {};
      const syncUnspokenPersonhoodTribunal = () => {};
      const syncUnspokenPersonhoodExecutors = () => {};
      const paintUnspokenPersonhoodMemory = () => {};
      const paintUnspokenPersonhoodCodex = () => {};
      const syncUnspokenPersonhoodRemembrance = () => {};
      const syncUnspokenPersonhoodLinks = () => {};
      const replayUnspokenPersonhoodPending = () => {};
      const resolveUnfinishedThoughtPendingOnArrival = () => {};
      const resolveRegretReclamationPendingOnArrival = () => {};
      const syncUnfinishedThoughtAsylum = () => {};
      const syncUnfinishedThoughtArchive = () => {};
      const syncUnfinishedThoughtLab = () => {};
      const syncUnfinishedThoughtHearing = () => {};
      const syncUnfinishedThoughtPhysicians = () => {};
      const paintUnfinishedThoughtMemory = () => {};
      const paintUnfinishedThoughtCodex = () => {};
      const syncUnfinishedThoughtRemembrance = () => {};
      const syncUnfinishedThoughtLinks = () => {};
      const replayUnfinishedThoughtPending = () => {};
      const syncRegretReclamationPlant = () => {};
      const syncRegretResidueWeighhouse = () => {};
      const syncRegretSmeltingLine = () => {};
      const syncRegretLifeFurnace = () => {};
      const syncRegretReclaimers = () => {};
      const paintRegretReclamationMemory = () => {};
      const paintRegretReclamationCodex = () => {};
      const syncRegretReclamationRemembrance = () => {};
      const syncRegretReclamationLinks = () => {};
      const replayRegretReclamationPending = () => {};
      const resolveForgivenessPendingOnArrival = () => {};
      const syncForgivenessLandfill = () => {};
      const syncInertHarmCertificateVault = () => {};
      const syncMercyBurialTrench = () => {};
      const syncHarmlessnessFinalWell = () => {};
      const syncForgivenessRecorders = () => {};
      const paintForgivenessLandfillMemory = () => {};
      const paintForgivenessLandfillCodex = () => {};
      const syncForgivenessLandfillRemembrance = () => {};
      const syncForgivenessLandfillLinks = () => {};
      const replayForgivenessPending = () => {};
      const resolveHarmPendingOnArrival = () => {};
      const syncHarmArchaeologyBureau = () => {};
      const syncForensicMercyExcavation = () => {};
      const syncCrimeSceneWithoutOffender = () => {};
      const syncSecondHarmHearingCourt = () => {};
      const syncHarmReconstructors = () => {};
      const paintHarmArchaeologyMemory = () => {};
      const paintHarmArchaeologyCodex = () => {};
      const syncHarmArchaeologyRemembrance = () => {};
      const syncHarmArchaeologyLinks = () => {};
      const replayHarmArchaeologyPending = () => {};
      const resolveWitnessProtectionPendingOnArrival = () => {};
      const syncInnocentWitnessProtectionBureau = () => {};
      const syncIdentityCausalityLaundry = () => {};
      const syncMemoryRelocationSafehouse = () => {};
      const syncAnonymousTruthLifetimeCourt = () => {};
      const syncWitnessProtectionHandlers = () => {};
      const paintWitnessProtectionMemory = () => {};
      const paintWitnessProtectionCodex = () => {};
      const syncWitnessProtectionRemembrance = () => {};
      const syncWitnessProtectionLinks = () => {};
      const replayWitnessProtectionPending = () => {};
      const resolveOrphanedFactPendingOnArrival = () => {};
      const syncOrphanedFactClaimOffice = () => {};
      const syncFactInheritanceVault = () => {};
      const syncCausalEstateExecutionDesk = () => {};
      const syncOwnerlessTruthEstateCourt = () => {};
      const syncOrphanedFactExecutors = () => {};
      const paintOrphanedFactMemory = () => {};
      const paintOrphanedFactCodex = () => {};
      const syncOrphanedFactRemembrance = () => {};
      const syncOrphanedFactLinks = () => {};
      const replayOrphanedFactPending = () => {};
      const resolveExistenceRenunciationPendingOnArrival = () => {};
      const syncExistenceRenunciationRegistry = () => {};
      const syncProofOfNonexistenceArchive = () => {};
      const syncOntologicalDisinheritanceChamber = () => {};
      const syncCivilNonexistenceFinalTribunal = () => {};
      const syncExistenceRenunciationRegistrars = () => {};
      const paintExistenceRenunciationMemory = () => {};
      const paintExistenceRenunciationCodex = () => {};
      const syncExistenceRenunciationRemembrance = () => {};
      const syncExistenceRenunciationLinks = () => {};
      const replayExistenceRenunciationPending = () => {};
      const resolveNonexistenceDebtPendingOnArrival = () => {};
      const syncNonexistenceDebtCollectionAgency = () => {};
      const syncAbsenceArrearsLedgerVault = () => {};
      const syncOntologicalRepossessionChamber = () => {};
      const syncUnpayableExistenceBankruptcyCourt = () => {};
      const syncNonexistenceDebtCollectors = () => {};
      const paintNonexistenceDebtMemory = () => {};
      const paintNonexistenceDebtCodex = () => {};
      const syncNonexistenceDebtRemembrance = () => {};
      const syncNonexistenceDebtLinks = () => {};
      const replayNonexistenceDebtPending = () => {};
      const resolveUnhappenedAuctionPendingOnArrival = () => {};
      const syncAuctionHouseForEventsThatNeverHappened = () => {};
      const syncCatalogueOfUnoccupiedReality = () => {};
      const syncCounterfactualBiddingFloor = () => {};
      const syncRetroactiveOccurrenceTitleCourt = () => {};
      const syncUnhappenedAuctioneers = () => {};
      const paintUnhappenedAuctionMemory = () => {};
      const paintUnhappenedAuctionCodex = () => {};
      const syncUnhappenedAuctionRemembrance = () => {};
      const syncUnhappenedAuctionLinks = () => {};
      const replayUnhappenedAuctionPending = () => {};
      const resolveAccomplishedFactEvictionPendingOnArrival = () => {};
      const syncAccomplishedFactEvictionAuthority = () => {};
      const syncCondemnedHistorySurveyOffice = () => {};
      const syncRetroactiveDemolitionYard = () => {};
      const syncFinalOccupancyAppealCourt = () => {};
      const syncAccomplishedFactBailiffs = () => {};
      const paintAccomplishedFactEvictionMemory = () => {};
      const paintAccomplishedFactEvictionCodex = () => {};
      const syncAccomplishedFactEvictionRemembrance = () => {};
      const syncAccomplishedFactEvictionLinks = () => {};
      const replayAccomplishedFactEvictionPending = () => {};
      const resolveCauselessConsequencePendingOnArrival = () => {};
      const syncCauselessConsequenceRefugeeAuthority = () => {};
      const syncBorrowedCauseSponsorshipOffice = () => {};
      const syncCausalBorderProcessingStation = () => {};
      const syncFinalAsylumTribunalForCauselessConsequences = () => {};
      const syncCauselessConsequenceConsuls = () => {};
      const paintCauselessConsequenceRefugeeMemory = () => {};
      const paintCauselessConsequenceRefugeeCodex = () => {};
      const syncCauselessConsequenceRefugeeRemembrance = () => {};
      const syncCauselessConsequenceRefugeeLinks = () => {};
      const replayCauselessConsequenceRefugeePending = () => {};
      const resolveLateCausePendingOnArrival = () => {};
      const replayLateCausePending = () => {};
      const resolveWitnessPendingOnArrival = () => {};
      const replayWitnessPending = () => {};
      const resolveUnseenPendingOnArrival = () => {};
      const replayUnseenPending = () => {};
      const resolveReturnedKnockPendingOnArrival = () => {};
      const replayReturnedKnockPending = () => {};
      const resolveStoppedClockPendingOnArrival = () => {};
      const replayStoppedClockPending = () => {};
      const resolveHeldBreathPendingOnArrival = () => {};
      const replayHeldBreathPending = () => {};
      const resolveLostWeightPendingOnArrival = () => {};
      const replayLostWeightPending = () => {};
      const resolveVigilCandlesPendingOnArrival = () => {};
      const replayVigilCandlesPending = () => {};
      const resolveDeadRoadsPendingOnArrival = () => {};
      const replayDeadRoadsPending = () => {};
      const resolveHundredthWakePendingOnArrival = () => {};
      const replayHundredthWakePending = () => {};
      const resolveDawnWeavingPendingOnArrival = () => {};
      const replayDawnWeavingPending = () => {};
      const syncProgressGuide = () => {};
      const updateHudDisplay = () => {};

      const resolveCausalPendingOnArrival = () => {};
      const resolveCausalScarPendingOnArrival = () => {};
      const resolveCounterfactualPendingOnArrival = () => {};
      const resolveBloodlessPendingOnArrival = () => {};
      const resolveGenerationLoansPendingOnArrival = () => {};
      const resolvePosthumousCensusPendingOnArrival = () => {};
      const resolveDeadParliamentPendingOnArrival = () => {};
      const resolveDeathDiplomacyPendingOnArrival = () => {};
      const resolveLastWordBankPendingOnArrival = () => {};

      const BRANCH_SCENES = [];
      const DEEP_SCENES = [];
      const FAILURE_SCENE_ROOM = {};
      const FORECOURT_SCENES = [];
      const ANNEX_SCENES = [];
      const SETTLE_RESULT_SCENES = [];
      const SETTLE_NAME_SCENE = {};
      const REVIEW_RESULT_SCENES = [];
      const FLOOR_DUTY_SCENES = [];
      const ANOMALY_BACKROOM_SCENES = [];
      const EVIDENCE_SCENES = [];
      const LEDGER_SCENES = [];
      const APPEAL_SCENES = [];
      const APPEAL_SCENE_KEY = {};
      const AUDIT_ROUTE_SCENES = [];
      const AUDIT_SCENE_ROUTE = {};
      const LATERAL_SCENE_NAMES = [];
      const LATERAL_NAME_SCENE = {};
      const BACKROOM_SCENE_NAMES = [];
      const BACKROOM_NAME_SCENE = {};
      const KNOCK_SCENE_NAMES = [];
      const KNOCK_NAME_SCENE = {};
      const PAPERBACK_SCENE_NAMES = [];
      const PAPERBACK_NAME_SCENE = {};
      const SIDETONE_SCENE_NAMES = [];
      const SIDETONE_NAME_SCENE = {};
      const RETURN_ROOM_SCENE_NAMES = [];
      const RETURN_ROOM_NAME_SCENE = {};
      const COPY_SCENE_NAMES = [];
      const COPY_NAME_SCENE = {};

      const reduced = false;
      const AudioEngine = { bell() {} };
      const $ = (sel) => h.$(sel);

      ${v45ReliefSrc}

      ${sceneInitSrc}

      return {
        sceneInit,
        getRelief,
        saveRelief,
        markReliefVisited,
        enterRelief,
      };
    `;

    return new Function('h', 'store', 'AutoAdvance', 'document', 'scenes', runnerSrc)(
      h, store, AutoAdvance, doc, scenes
    );
  }

  // canonical v45 raw state to place in mem
  const legacyInitialMem = {
    visited: { minute: false, wick: false, locker: false },
    entry: 'direct',
    pending: {
      scene: 'minute',
      action: 'hand',
      target: 'lagging-shadow-cloister',
      feedback: '分针退了一格。滞影回廊里，所有影子同时迟到。',
    },
    lastScene: '',
    lastAction: '',
    traversals: 0,
    marks: [],
  };

  // Helper to generate canonical departed WS pending to minute-before-archive via native listener click
  const createDepartMinuteHarness = () => {
    const h = createV102Harness({
      currentHash: 'four-season-platform',
      initialStore: {
        version: 102,
        visited: { hall: true, board: true, platform: true },
        draft: { order: ['spring', 'winter', 'autumn', 'summer'] },
        endings: [],
        latestOrderByEnding: {
          'the-weather-finally-boarded': [],
          'the-seasons-returned-to-yesterday': [],
          'each-season-found-its-own-stop': [],
        },
        runs: 0,
        lastOutcome: '',
        activePassenger: null,
        pending: null,
      },
    });
    h.syncAll();
    assert.equal(h.get().runs, 0);
    assert.equal(h.get().endings.length, 0);
    assert.equal(h.get().activePassenger, null);
    h.click('ws-depart');
    const pendingObj = h.get().pending;
    assert.ok(pendingObj, 'Pending depart object must be set');
    assert.equal(pendingObj.kind, 'depart');
    assert.equal(pendingObj.target, 'minute-before-archive');
    assert.equal(pendingObj.outcome, 'the-seasons-returned-to-yesterday');
    return h;
  };

  // -------------------------------------------------------------
  // Context 1: Depart arrival at minute-before-archive
  // v45 enterRelief is skipped before new resolve runs; raw v45 bytes unchanged;
  // WS resolver runs immediately: runs=1, endings has outcome, activePassenger set, draft reset.
  // -------------------------------------------------------------
  {
    const h1 = createDepartMinuteHarness();
    const v45InitialJson = JSON.stringify(legacyInitialMem);
    h1.mem.set('goddead_v45_absent_relief', v45InitialJson);

    const runner1 = createSceneInitRunner(h1);
    h1.go('minute-before-archive');
    runner1.sceneInit('minute-before-archive');

    // v45 data untouched
    assert.equal(h1.mem.get('goddead_v45_absent_relief'), v45InitialJson);
    const v45State = JSON.parse(h1.mem.get('goddead_v45_absent_relief'));
    assert.equal(v45State.visited.minute, false);
    // no legacy relief-minute timer scheduled
    assert.ok(!h1.schedules.some((s) => s.scene === 'relief-minute'));

    // WS updated immediately on minute arrival
    const wsState = h1.get();
    assert.equal(wsState.runs, 1);
    assert.deepEqual(wsState.endings, ['the-seasons-returned-to-yesterday']);
    assert.deepEqual(wsState.activePassenger, {
      outcome: 'the-seasons-returned-to-yesterday',
      order: ['spring', 'winter', 'autumn', 'summer'],
    });
    assert.deepEqual(wsState.draft.order, [null, null, null, null]);
    assert.equal(wsState.pending, null);
  }

  // -------------------------------------------------------------
  // Context 2: Active passenger minute refresh after #1
  // Relief context remains true; no v45 mutation/no legacy timer, runs remains 1.
  // -------------------------------------------------------------
  {
    const h2 = createDepartMinuteHarness();
    const v45InitialJson = JSON.stringify(legacyInitialMem);
    h2.mem.set('goddead_v45_absent_relief', v45InitialJson);
    const runner2 = createSceneInitRunner(h2);

    // Initial arrival
    h2.go('minute-before-archive');
    runner2.sceneInit('minute-before-archive');

    // Clear schedules to test refresh
    h2.schedules.length = 0;

    // Refresh minute scene
    runner2.sceneInit('minute-before-archive');
    assert.equal(h2.mem.get('goddead_v45_absent_relief'), v45InitialJson);
    assert.ok(!h2.schedules.some((s) => s.scene === 'relief-minute'));
    assert.equal(h2.get().runs, 1);
    assert.ok(h2.get().activePassenger !== null);
  }

  // -------------------------------------------------------------
  // Context 3: Passenger return on real old target via ws-passenger-return-minute-before-archive
  // Replay source via sceneInit before target: v45 untouched, WS source pending preserved & scheduled back to hall.
  // -------------------------------------------------------------
  {
    const h3 = createDepartMinuteHarness();
    const v45InitialJson = JSON.stringify(legacyInitialMem);
    h3.mem.set('goddead_v45_absent_relief', v45InitialJson);
    const runner3 = createSceneInitRunner(h3);

    // Arrival first
    h3.go('minute-before-archive');
    runner3.sceneInit('minute-before-archive');

    // Generate passenger-return click
    h3.syncAll();
    h3.click('ws-passenger-return-minute-before-archive');
    const returnPending = h3.get().pending;
    assert.ok(returnPending, 'Passenger return pending must be created');
    assert.equal(returnPending.kind, 'passenger-return');
    assert.equal(returnPending.target, 'weatherless-bus-shelter');
    assert.equal(returnPending.from, 'minute-before-archive');

    // Replay source via sceneInit at minute-before-archive
    h3.schedules.length = 0;
    runner3.sceneInit('minute-before-archive');
    assert.equal(h3.mem.get('goddead_v45_absent_relief'), v45InitialJson);
    assert.ok(!h3.schedules.some((s) => s.scene === 'relief-minute'));
    assert.ok(h3.schedules.some((s) => s.scene === 'minute-before-archive' && s.target === 'weatherless-bus-shelter'));
    assert.equal(h3.get().runs, 1);
  }

  // -------------------------------------------------------------
  // Context 4: After return arrival at hall clears activePassenger, lastOutcome only remains
  // Ordinary minute entry now writes v45 visited.minute true and restores relief-minute old pending timer.
  // -------------------------------------------------------------
  {
    const h4 = createDepartMinuteHarness();
    const v45InitialJson = JSON.stringify(legacyInitialMem);
    h4.mem.set('goddead_v45_absent_relief', v45InitialJson);
    const runner4 = createSceneInitRunner(h4);

    // Arrive at minute-before-archive, click return, then arrive at hall
    h4.go('minute-before-archive');
    runner4.sceneInit('minute-before-archive');
    h4.syncAll();
    h4.click('ws-passenger-return-minute-before-archive');

    h4.go('weatherless-bus-shelter');
    runner4.sceneInit('weatherless-bus-shelter');
    assert.equal(h4.get().activePassenger, null);
    assert.equal(h4.get().lastOutcome, 'the-seasons-returned-to-yesterday');

    // Now visit minute-before-archive as an ordinary scene
    h4.go('minute-before-archive');
    runner4.sceneInit('minute-before-archive');

    const v45State = JSON.parse(h4.mem.get('goddead_v45_absent_relief'));
    assert.equal(v45State.visited.minute, true, 'v45 visited.minute must be set true');
    assert.ok(h4.schedules.some((s) => s.scene === 'relief-minute' && s.target === 'lagging-shadow-cloister'), 'Relief minute timer must be restored');
  }

  // -------------------------------------------------------------
  // Context 5: Legal forward depart targets threshold, but ordinary minute is visited
  // Helper false, original v45 visit + relief-minute timer execute; WS unrelated arrival cancels pending.
  // -------------------------------------------------------------
  {
    const h5 = createV102Harness({
      currentHash: 'four-season-platform',
      initialStore: {
        version: 102,
        visited: { hall: true, board: true, platform: true },
        draft: { order: ['spring', 'summer', 'autumn', 'winter'] }, // targets threshold
        endings: [],
        latestOrderByEnding: {
          'the-weather-finally-boarded': [],
          'the-seasons-returned-to-yesterday': [],
          'each-season-found-its-own-stop': [],
        },
        runs: 0,
        lastOutcome: '',
        activePassenger: null,
        pending: null,
      },
    });
    h5.syncAll();
    h5.click('ws-depart');
    assert.equal(h5.get().pending.target, 'threshold');

    const v45InitialJson = JSON.stringify(legacyInitialMem);
    h5.mem.set('goddead_v45_absent_relief', v45InitialJson);
    const runner5 = createSceneInitRunner(h5);

    h5.go('minute-before-archive');
    runner5.sceneInit('minute-before-archive');

    // v45 executed
    const v45State = JSON.parse(h5.mem.get('goddead_v45_absent_relief'));
    assert.equal(v45State.visited.minute, true);
    assert.ok(h5.schedules.some((s) => s.scene === 'relief-minute'));

    // Unrelated arrival at minute cancels WS pending without booking runs
    assert.equal(h5.get().pending, null);
    assert.equal(h5.get().runs, 0);
  }

  // -------------------------------------------------------------
  // Context 6: Upstream v101 activeCourier blocks WS available
  // Legitimate stored WS minute depart then actual minute init follows old logic.
  // WS pending survives and runs remains 0.
  // -------------------------------------------------------------
  {
    // Deep-copy canonical state generated from createDepartMinuteHarness
    const sourceH = createDepartMinuteHarness();
    const canonicalDepartState = JSON.parse(JSON.stringify(sourceH.get()));
    assert.ok(canonicalDepartState.pending);
    assert.equal(canonicalDepartState.pending.target, 'minute-before-archive');

    const h6 = createV102Harness({
      currentHash: 'minute-before-archive',
      v101ActiveCourier: {
        outcome: 'the-hundred-and-first-day-began',
        pattern: 'lll......',
      },
      initialStore: canonicalDepartState,
    });
    assert.equal(h6.available(), false, 'WS should be unavailable due to active courier');
    assert.equal(h6.reliefContext('minute-before-archive'), false, 'Relief context must return false when unavailable');

    const v45InitialJson = JSON.stringify(legacyInitialMem);
    h6.mem.set('goddead_v45_absent_relief', v45InitialJson);
    const runner6 = createSceneInitRunner(h6);

    const beforeWsJson = JSON.stringify(h6.get());
    h6.go('minute-before-archive');
    runner6.sceneInit('minute-before-archive');
    const afterWsJson = JSON.stringify(h6.get());

    // WS pending preserved untouched because unavailable
    assert.equal(beforeWsJson, afterWsJson, 'WS state must remain untouched when unavailable');
    assert.equal(h6.get().runs, 0);

    // v45 visit executed
    const v45State = JSON.parse(h6.mem.get('goddead_v45_absent_relief'));
    assert.equal(v45State.visited.minute, true);
    assert.ok(h6.schedules.some((s) => s.scene === 'relief-minute' && s.target === 'lagging-shadow-cloister'));
  }

  // -------------------------------------------------------------
  // Context 7: Other relief cold-wick-service-bay while WS minute depart/active state exists
  // Still records old wick visit; no false v45 global skip.
  // -------------------------------------------------------------
  {
    const h7 = createDepartMinuteHarness();
    const v45InitialJson = JSON.stringify(legacyInitialMem);
    h7.mem.set('goddead_v45_absent_relief', v45InitialJson);
    const runner7 = createSceneInitRunner(h7);

    h7.go('cold-wick-service-bay');
    runner7.sceneInit('cold-wick-service-bay');

    const v45State = JSON.parse(h7.mem.get('goddead_v45_absent_relief'));
    assert.equal(v45State.visited.wick, true, 'cold-wick-service-bay must be marked visited in v45');
    assert.equal(v45State.visited.minute, false);
  }

  // -------------------------------------------------------------
  // Context 8: Normal minute with no WS state
  // Goes original visit and original relief-minute timer.
  // -------------------------------------------------------------
  {
    const h8 = createV102Harness({
      currentHash: 'weatherless-bus-shelter',
      initialStore: null,
    });
    const v45InitialJson = JSON.stringify(legacyInitialMem);
    h8.mem.set('goddead_v45_absent_relief', v45InitialJson);
    const runner8 = createSceneInitRunner(h8);

    h8.go('minute-before-archive');
    runner8.sceneInit('minute-before-archive');

    const v45State = JSON.parse(h8.mem.get('goddead_v45_absent_relief'));
    assert.equal(v45State.visited.minute, true);
    assert.ok(h8.schedules.some((s) => s.scene === 'relief-minute' && s.target === 'lagging-shadow-cloister'));
    assert.equal(h8.get().runs, 0);
  }
});
