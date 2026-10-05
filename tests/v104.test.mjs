/**
 * .v104-gemini/v104-tests-base.mjs
 *
 * Exact Gemini v104 isolated production test BASE complete file.
 * Sole frontend/tests/docs author: gemini-3.7-flash-high. Verified independently by Codex.
 * Flat harness API for v104 替别人醒来的旅馆 (WAKE FOR ANOTHER HOTEL).
 * Prefix for tests/v104.test.mjs.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const PROJECT_ROOT = process.cwd();
const SCRIPT_PATH = path.join(PROJECT_ROOT, 'script.js');
const HTML_PATH = path.join(PROJECT_ROOT, 'index.html');
const CSS_PATH = path.join(PROJECT_ROOT, 'styles.css');

export const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
export const htmlSource = fs.readFileSync(HTML_PATH, 'utf8');
export const cssSource = fs.readFileSync(CSS_PATH, 'utf8');

// --- Exact v104 AH Module Extraction ---
export const AH_MODULE_HEADER = '/* ============================================================\n   v104 替别人醒来的旅馆 / WAKE FOR ANOTHER HOTEL';
export const AH_MODULE_END_MARKER = 'AH_OLD_TARGETS.forEach((scene) => onTrustedAh(`#ah-wake-return-${scene}`, () => chooseAhWakeReturn(scene)));';

const startIdx = scriptSource.indexOf(AH_MODULE_HEADER);
if (startIdx === -1) {
  throw new Error('Could not find v104 AH module header in script.js');
}
const endIdx = scriptSource.indexOf(AH_MODULE_END_MARKER, startIdx);
if (endIdx === -1) {
  throw new Error('Could not find v104 AH module end marker in script.js');
}
export const ahModuleSource = scriptSource.slice(startIdx, endIdx + AH_MODULE_END_MARKER.length);

// Constants from authoritative design and production slice
export const AH_KEY = 'goddead_v104_wake_for_another_hotel';
export const AH_VERSION = 104;

export const AH_HOTEL = 'wake-for-another-hotel';
export const AH_CLOCKROOM = 'borrowed-dawn-clockroom';
export const AH_VERANDA = 'shared-morning-veranda';

export const AH_OLD_TARGETS = ['threshold', 'remembrance', 'unending-gallery'];
export const AH_ENTRY_SOURCES = ['threshold', 'remembrance', 'shadowless-photo-studio'];

export const AH_ROOM_NAMES = [
  '1 号房（你的空床）',
  '2 号房（未见面的旅人）',
  '3 号房（未登记的人）',
];

export const AH_ROOM_SHORT_NAMES = [
  '1 号（你的房间）',
  '2 号（隔壁旅人）',
  '3 号（未登记房）',
];

export const AH_ENDING_IDS = [
  'dawn-waited-outside-the-doors',
  'you-woke-in-a-borrowed-morning',
  'someone-woke-on-your-behalf',
  'three-rooms-shared-one-dawn',
];

export const AH_ENDING_TABLE = {
  'dawn-waited-outside-the-doors': {
    id: 'dawn-waited-outside-the-doors',
    title: '天亮留在门外',
    category: '无晨门',
    target: 'unending-gallery',
    placeName: '无终局陈列廊',
    story: '窗外已亮，铃声却被三扇门留在外面。空床与旅人仍陷在各自的梦刻里，陈列廊收下一夜未曾开门的安静。',
    receiptTitle: '晨铃签收 · 天亮留在门外',
    echoLead: '陈列廊尽头的门扇紧扣，晨光只在门槛外停顿。',
    preview: '没有任何一间房停在晨门（0刻）。晨铃将寄往无终局陈列廊。',
    summary: '三钟皆非 0 刻（20 种可能）',
  },
  'you-woke-in-a-borrowed-morning': {
    id: 'you-woke-in-a-borrowed-morning',
    title: '你醒在别人的清晨里',
    category: '仅自己醒',
    target: 'threshold',
    placeName: '门外',
    story: '你的空床响起了晨铃，隔壁却依然沉睡。你替整座旅馆推开门，早晨属于借来那一刻的人。',
    receiptTitle: '晨铃签收 · 你醒在别人的清晨里',
    echoLead: '门外的台阶泛起属于隔壁房间的微光，空床已先于天亮醒来。',
    preview: '仅 1 号房停在晨门（0刻）。晨铃将寄往门外。',
    summary: '仅 1 号房为 0 刻（5 种可能）',
  },
  'someone-woke-on-your-behalf': {
    id: 'someone-woke-on-your-behalf',
    title: '有人替你醒来',
    category: '仅别人醒',
    target: 'remembrance',
    placeName: '痕迹室',
    story: '你仍未睁眼，隔壁已替你答应了今天。痕迹室收下一张替你醒来的早晨签收单。',
    receiptTitle: '晨铃签收 · 有人替你醒来',
    echoLead: '痕迹墙上留着一张隔壁房客写下的叫醒字条。',
    preview: '仅隔壁（2 或 3 号）停在晨门（0刻）。晨铃将寄往痕迹室。',
    summary: '仅 2 或 3 号房为 0 刻（10 种可能）',
  },
  'three-rooms-shared-one-dawn': {
    id: 'three-rooms-shared-one-dawn',
    title: '三间房共用一次天亮',
    category: '全员醒来',
    target: 'unending-gallery',
    placeName: '无终局陈列廊',
    story: '三座梦钟同时归零。没有谁借走谁的一刻，三间房在同一次晨铃声中彻底清醒。',
    receiptTitle: '晨铃签收 · 三间房共用一次天亮',
    echoLead: '陈列廊的画框中同时映出三座齐鸣的铜钟。',
    preview: '三间房全部停在晨门（0刻）。晨铃将寄往无终局陈列廊。',
    summary: '三间房均为 0 刻（唯一解 [0,0,0]）',
  },
};

export const AH_ENTRY_FEEDBACK = '旅馆前台的钥匙排成三格，铜牌上刻着未干的水汽。';
export const AH_START_FEEDBACK = '推开梦钟房的铜门，三座转动的指针正等待借出一刻。';
export const AH_PREVIEW_FEEDBACK = '走上回廊，三座冻结的钟面与清晨帘门静立眼前。';
export const AH_REVISE_FEEDBACK = '退回梦钟房，重新拨动隔壁房间的一刻。';
export const AH_ABANDON_FEEDBACK = '收起钥匙，暂且退回替别人醒来的旅馆前台。';
export const AH_WAKE_RETURN_FEEDBACK = '晨铃签收完毕，你带着晨铃回执走回了旅馆前台。';

// Upstream PH Endings
export const PH_ENDING_IDS = [
  'absence-shared-a-portrait',
  'one-visitor-kept-two-shadows',
  'the-shadow-attended-in-your-place',
  'nobody-was-kept-in-the-frame',
];

// Native fixed 20 button IDs bound with onTrustedAh in production
export const AH_NATIVE_BUTTON_IDS = [
  'ah-entry-threshold',
  'ah-entry-remembrance',
  'ah-entry-studio',
  'ah-new',
  'ah-continue',
  'ah-borrow-0-1',
  'ah-borrow-0-2',
  'ah-borrow-1-0',
  'ah-borrow-1-2',
  'ah-borrow-2-0',
  'ah-borrow-2-1',
  'ah-reset',
  'ah-example-btn',
  'ah-preview-btn',
  'ah-abandon',
  'ah-wake',
  'ah-revise',
  'ah-wake-return-threshold',
  'ah-wake-return-remembrance',
  'ah-wake-return-unending-gallery',
];

// Upstream quiet 22 keys snapshot for write isolation assertion
export const QUIET_22_KEYS = [
  'goddead_v82_forgiveness_landfill',
  'goddead_v83_harm_archaeology',
  'goddead_v84_innocent_witness_protection',
  'goddead_v85_orphaned_fact_claims',
  'goddead_v86_existence_renunciation',
  'goddead_v87_nonexistence_debt_collection',
  'goddead_v88_unhappened_event_auction',
  'goddead_v89_accomplished_fact_eviction',
  'goddead_v90_causeless_consequence_refugee',
  'goddead_v91_late_cause_maternity',
  'goddead_v92_witness_liability',
  'goddead_v93_unseen_claims',
  'goddead_v94_returned_knocks',
  'goddead_v95_stopped_clocks',
  'goddead_v96_held_breath',
  'goddead_v97_lost_weight',
  'goddead_v98_vigil_candles',
  'goddead_v99_roads_for_the_dead',
  'goddead_v100_hundredth_wake',
  'goddead_v101_dawn_weaving',
  'goddead_v102_weatherless_shelter',
  'goddead_v103_shadowless_photography',
];

// --- HTML Parsing for IDs and Initial State ---
function parseHtmlElements(html) {
  const elements = new Map();
  const tagRegex = /<([a-zA-Z0-9\-]+)([^>]*)id=["']([^"']+)["']([^>]*)>/g;
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const tagName = match[1].toLowerCase();
    const id = match[3];
    const attrsRaw = match[2] + ' ' + match[4];
    const isHidden = /\bhidden\b/i.test(attrsRaw);
    const isDisabled = /\bdisabled\b/i.test(attrsRaw);
    elements.set(id, {
      id,
      tagName,
      hidden: isHidden,
      disabled: isDisabled,
    });
  }
  return elements;
}

const PARSED_HTML_ELEMENTS = parseHtmlElements(htmlSource);

/**
 * Creates an in-memory DOM mock node with truthful recursive textContent
 * and simulated tree behavior.
 */
function createMockNode(id, tagName = 'div', initialHidden = false, initialDisabled = false) {
  const children = [];
  const attributes = new Map();
  const classListSet = new Set();
  const listeners = new Map();
  let rawDirectText = '';

  const node = {
    id: id || '',
    tagName: tagName.toUpperCase(),
    hidden: Boolean(initialHidden),
    disabled: Boolean(initialDisabled),
    style: {},
    children,
    parentNode: null,

    setAttribute(name, val) {
      attributes.set(name, String(val));
      if (name === 'aria-pressed') {
        node.ariaPressed = String(val);
      }
    },
    getAttribute(name) {
      return attributes.get(name) || null;
    },
    hasAttribute(name) {
      return attributes.has(name);
    },
    removeAttribute(name) {
      attributes.delete(name);
    },

    appendChild(child) {
      if (!child) return child;
      if (child.parentNode) child.parentNode.removeChild(child);
      child.parentNode = node;
      children.push(child);
      return child;
    },
    removeChild(child) {
      const idx = children.indexOf(child);
      if (idx !== -1) {
        children.splice(idx, 1);
        child.parentNode = null;
      }
      return child;
    },
    remove() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    },
    replaceChildren(...newChildren) {
      while (children.length > 0) {
        const c = children.pop();
        if (c) c.parentNode = null;
      }
      rawDirectText = '';
      for (const item of newChildren) {
        if (!item) continue;
        if (item.nodeType === 11) {
          while (item.children.length > 0) {
            node.appendChild(item.children[0]);
          }
        } else {
          node.appendChild(item);
        }
      }
    },
    hasChildNodes() {
      return children.length > 0;
    },

    querySelectorAll(selector) {
      const res = [];
      const isClass = selector.startsWith('.');
      const clsName = isClass ? selector.slice(1) : null;
      function walk(curr) {
        for (const c of curr.children) {
          if (isClass && c.classList && c.classList.contains(clsName)) {
            res.push(c);
          } else if (selector.startsWith('#') && c.id === selector.slice(1)) {
            res.push(c);
          }
          walk(c);
        }
      }
      walk(node);
      return res;
    },

    addEventListener(event, handler) {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(handler);
    },
    _listenerCount(event) {
      const list = listeners.get(event);
      return list ? list.length : 0;
    },
    _fire(event, eventObj) {
      const list = listeners.get(event) || [];
      for (const fn of list) {
        fn(eventObj);
      }
    },
  };

  Object.defineProperty(node, 'textContent', {
    get() {
      if (children.length === 0) return rawDirectText;
      return children.map((c) => c.textContent).join('');
    },
    set(val) {
      while (children.length > 0) {
        const c = children.pop();
        if (c) c.parentNode = null;
      }
      rawDirectText = String(val);
    },
    configurable: true,
    enumerable: true,
  });

  node.classList = {
    add(...cls) {
      cls.forEach((c) => classListSet.add(c));
    },
    remove(...cls) {
      cls.forEach((c) => classListSet.delete(c));
    },
    contains(c) {
      return classListSet.has(c);
    },
  };

  Object.defineProperty(node, 'className', {
    get() {
      return Array.from(classListSet).join(' ');
    },
    set(v) {
      classListSet.clear();
      if (v) v.trim().split(/\s+/).forEach((c) => classListSet.add(c));
    },
  });

  return node;
}

/**
 * FLAT HARNESS FACTORY
 * Provides createAhHarness(opts)
 */
export function createAhHarness(opts = {}) {
  const mem = new Map();
  const writes = [];
  const schedules = [];
  const clears = [];
  const capturedListeners = new Map();
  let audioWhooshCount = 0;
  let audioTickCount = 0;

  const currentSceneRef = {
    value: opts.initialScene || 'threshold',
  };

  const phFlags = Object.assign(
    {
      phUnlocked: true,
      phAvailable: true,
      phPending: null,
      phActivePrint: null,
      phEndings: [...PH_ENDING_IDS],
    },
    opts.phFlags || {}
  );

  if (opts.initialStore !== undefined && opts.initialStore !== null) {
    const val = typeof opts.initialStore === 'object' ? JSON.stringify(opts.initialStore) : String(opts.initialStore);
    mem.set(AH_KEY, val);
  }

  const nodes = new Map();
  for (const [id, info] of PARSED_HTML_ELEMENTS.entries()) {
    nodes.set(id, createMockNode(id, info.tagName, info.hidden, info.disabled));
  }

  function getNode(id) {
    if (!nodes.has(id)) return null;
    return nodes.get(id);
  }

  function buttonAvailable(id) {
    const btn = getNode(id);
    if (!btn) return false;
    if (btn.disabled || btn.hidden) return false;
    return true;
  }

  const AutoAdvance = {
    schedule(fromScene, toScene, options) {
      schedules.push({ from: fromScene, to: toScene, options });
    },
    clear(scene) {
      clears.push(scene);
      for (let i = schedules.length - 1; i >= 0; i--) {
        if (schedules[i].from === scene) {
          schedules.splice(i, 1);
        }
      }
    },
    has(scene) {
      return schedules.some((s) => s.from === scene);
    },
  };

  const AudioEngine = {
    whoosh() {
      audioWhooshCount++;
    },
    tick() {
      audioTickCount++;
    },
  };

  const store = {
    get(k, fallback = null) {
      return mem.has(k) ? mem.get(k) : fallback;
    },
    set(k, v) {
      writes.push({ key: k, value: v });
      mem.set(k, String(v));
    },
    memo(name, fn) {
      return fn();
    },
  };

  const localStorage = {
    getItem(k) {
      return mem.has(k) ? mem.get(k) : null;
    },
    setItem(k, v) {
      mem.set(k, String(v));
    },
    removeItem(k) {
      mem.delete(k);
    },
  };

  const documentMock = {
    createElement(tag) {
      return createMockNode('', tag, false, false);
    },
    getElementById(id) {
      return getNode(id);
    },
    querySelector(selector) {
      if (selector.startsWith('#')) {
        return getNode(selector.slice(1));
      }
      return null;
    },
    querySelectorAll(selector) {
      const res = [];
      for (const node of nodes.values()) {
        if (selector === '[id^="ah-"][aria-pressed]') {
          if (node.id.startsWith('ah-') && node.hasAttribute('aria-pressed')) {
            res.push(node);
          }
        }
      }
      return res;
    },
  };

  function $(selector) {
    return documentMock.querySelector(selector);
  }

  function $$(selector) {
    return documentMock.querySelectorAll(selector);
  }

  // Upstream PH contract functions
  function shadowlessPhotographyUnlocked() {
    return Boolean(phFlags.phUnlocked);
  }

  function shadowlessPhotographyAvailable() {
    return Boolean(phFlags.phAvailable);
  }

  function getShadowlessPhotography() {
    return {
      endings: phFlags.phEndings,
      pending: phFlags.phPending,
      activePrint: phFlags.phActivePrint,
    };
  }

  // VM Sandbox execution context
  const sandbox = {
    console,
    Math,
    Array,
    Object,
    Number,
    String,
    Boolean,
    Set,
    JSON,
    store,
    localStorage,
    AutoAdvance,
    AudioEngine,
    document: documentMock,
    $,
    $$,
    buttonAvailable,
    reduced: false,
    currentScene: currentSceneRef.value,
    shadowlessPhotographyUnlocked,
    shadowlessPhotographyAvailable,
    getShadowlessPhotography,
    PH_ENDING_IDS,
    // Captured module exports
    ahModuleExports: {},
  };

  // Setup getter/setter for currentScene in sandbox
  Object.defineProperty(sandbox, 'currentScene', {
    get() {
      return currentSceneRef.value;
    },
    set(v) {
      currentSceneRef.value = v;
    },
    configurable: true,
  });

  const wrappedScript = `
${ahModuleSource}

ahModuleExports.AH_KEY = AH_KEY;
ahModuleExports.AH_VERSION = AH_VERSION;
ahModuleExports.AH_ENDING_TABLE = AH_ENDING_TABLE;
ahModuleExports.AH_EXAMPLES = AH_EXAMPLES;
ahModuleExports.isValidAhClocks = isValidAhClocks;
ahModuleExports.classifyAhClocks = classifyAhClocks;
ahModuleExports.describeAhAwakeRooms = describeAhAwakeRooms;
ahModuleExports.defaultWakeForAnotherHotel = defaultWakeForAnotherHotel;
ahModuleExports.normalizeWakeForAnotherHotel = normalizeWakeForAnotherHotel;
ahModuleExports.normalizeAhPending = normalizeAhPending;
ahModuleExports.expectedAhPending = expectedAhPending;
ahModuleExports.wakeForAnotherHotelUnlocked = wakeForAnotherHotelUnlocked;
ahModuleExports.wakeForAnotherHotelAvailable = wakeForAnotherHotelAvailable;
ahModuleExports.getWakeForAnotherHotel = getWakeForAnotherHotel;
ahModuleExports.saveWakeForAnotherHotel = saveWakeForAnotherHotel;
ahModuleExports.resolveWakeForAnotherHotelPendingOnArrival = resolveWakeForAnotherHotelPendingOnArrival;
ahModuleExports.replayWakeForAnotherHotelPending = replayWakeForAnotherHotelPending;
ahModuleExports.wakeForAnotherHotelBridgeAllows = wakeForAnotherHotelBridgeAllows;
ahModuleExports.ahHotelCanVisit = ahHotelCanVisit;
ahModuleExports.borrowedDawnClockroomCanVisit = borrowedDawnClockroomCanVisit;
ahModuleExports.sharedMorningVerandaCanVisit = sharedMorningVerandaCanVisit;
ahModuleExports.syncWakeForAnotherHotelAll = syncWakeForAnotherHotelAll;
ahModuleExports.forgetWakeForAnotherHotelState = forgetWakeForAnotherHotelState;
`;

  const context = vm.createContext(sandbox);
  vm.runInContext(wrappedScript, context);

  const api = sandbox.ahModuleExports;

  // Initial sync call
  api.syncWakeForAnotherHotelAll();

  // Capture registered click listeners on all mocked nodes
  for (const [id, node] of nodes.entries()) {
    if (node._listenerCount('click') > 0) {
      capturedListeners.set(id, node);
    }
  }

  // Flat Harness Return Object
  return {
    // Storage & State
    get: () => api.getWakeForAnotherHotel(),
    save: (st) => api.saveWakeForAnotherHotel(st),
    raw: () => mem.get(AH_KEY),
    mem,
    writes,
    resetWrites: () => {
      writes.length = 0;
    },

    // Navigation & Arrival lifecycle
    getScene: () => currentSceneRef.value,
    setScene: (s) => {
      currentSceneRef.value = s;
    },
    arrive: (targetScene) => {
      currentSceneRef.value = targetScene;
      const res = api.resolveWakeForAnotherHotelPendingOnArrival(targetScene);
      api.replayWakeForAnotherHotelPending(targetScene);
      api.syncWakeForAnotherHotelAll();
      return res;
    },
    replay: (s) => {
      const scene = s || currentSceneRef.value;
      api.replayWakeForAnotherHotelPending(scene);
    },
    sync: () => {
      api.syncWakeForAnotherHotelAll();
    },

    // Simulated click dispatch
    click: (buttonId, isTrusted = true) => {
      const node = nodes.get(buttonId);
      if (!node) throw new Error(`Mock node not found: ${buttonId}`);
      node._fire('click', { isTrusted: Boolean(isTrusted) });
    },

    // Gates, Bridge & Validation
    isValid: (clocks) => api.isValidAhClocks(clocks),
    classify: (clocks) => api.classifyAhClocks(clocks),
    normalize: (raw) => api.normalizeWakeForAnotherHotel(raw),
    normalizePending: (p, st) => api.normalizeAhPending(p, st),
    expectedPending: (p, st) => api.expectedAhPending(p, st),
    bridge: (targetScene) => api.wakeForAnotherHotelBridgeAllows(targetScene),
    canHotel: () => api.ahHotelCanVisit(),
    canClockroom: () => api.borrowedDawnClockroomCanVisit(),
    canVeranda: () => api.sharedMorningVerandaCanVisit(),
    forget: () => api.forgetWakeForAnotherHotelState(),

    // Flags, Schedules & Node inspections
    flags: phFlags,
    nodes,
    getNode,
    listeners: capturedListeners,
    schedules,
    clears,
    clearTimers: () => {
      schedules.length = 0;
      clears.length = 0;
    },
    getAudioCounts: () => ({ whoosh: audioWhooshCount, tick: audioTickCount }),
    tables: {
      ENDING_TABLE: AH_ENDING_TABLE,
      ENDING_IDS: AH_ENDING_IDS,
      EXAMPLES: api.AH_EXAMPLES,
    },
  };
}

// --- Independent 36 State BFS & Oracle Generator ---
export function generateIndependent36Oracle() {
  const allTuples = [];
  const valid36 = [];
  const classes = {
    'dawn-waited-outside-the-doors': [],
    'you-woke-in-a-borrowed-morning': [],
    'someone-woke-on-your-behalf': [],
    'three-rooms-shared-one-dawn': [],
  };

  for (let c0 = 0; c0 < 6; c0++) {
    for (let c1 = 0; c1 < 6; c1++) {
      for (let c2 = 0; c2 < 6; c2++) {
        const tuple = [c0, c1, c2];
        allTuples.push(tuple);
        if ((c0 + c1 + c2) % 6 === 0) {
          valid36.push(tuple);
          const is0_0 = c0 === 0;
          const is0_1 = c1 === 0;
          const is0_2 = c2 === 0;
          if (is0_0 && is0_1 && is0_2) {
            classes['three-rooms-shared-one-dawn'].push(tuple);
          } else if (is0_0 && !is0_1 && !is0_2) {
            classes['you-woke-in-a-borrowed-morning'].push(tuple);
          } else if (!is0_0 && (is0_1 || is0_2)) {
            classes['someone-woke-on-your-behalf'].push(tuple);
          } else if (!is0_0 && !is0_1 && !is0_2) {
            classes['dawn-waited-outside-the-doors'].push(tuple);
          }
        }
      }
    }
  }

  // BFS Reachability from initial [3, 2, 1]
  const keyOf = (t) => `${t[0]},${t[1]},${t[2]}`;
  const start = [3, 2, 1];
  const queue = [{ state: start, dist: 0, path: [] }];
  const visitedDist = new Map();
  const shortestPaths = new Map();
  visitedDist.set(keyOf(start), 0);
  shortestPaths.set(keyOf(start), []);

  const borrowActions = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 0 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
    { from: 2, to: 1 },
  ];

  while (queue.length > 0) {
    const { state, dist, path } = queue.shift();
    for (const act of borrowActions) {
      const next = [state[0], state[1], state[2]];
      next[act.from] = (next[act.from] + 5) % 6;
      next[act.to] = (next[act.to] + 1) % 6;
      const k = keyOf(next);
      if (!visitedDist.has(k)) {
        visitedDist.set(k, dist + 1);
        shortestPaths.set(k, [...path, act]);
        queue.push({ state: next, dist: dist + 1, path: [...path, act] });
      }
    }
  }

  return {
    allTuples,
    valid36,
    classes,
    visitedDist,
    shortestPaths,
    minZeroDistance: visitedDist.get('0,0,0'),
  };
}

// --- 16 Canonical Pending Fixture Generator ---
export function captureAhPendingCases() {
  const oracle = generateIndependent36Oracle();
  const cases = [];

  // 1-3. Entry from 3 sources
  for (const src of AH_ENTRY_SOURCES) {
    cases.push({
      kind: 'entry',
      source: src,
      target: AH_HOTEL,
      feedback: AH_ENTRY_FEEDBACK,
      setup: (h) => {
        h.setScene(src);
      },
    });
  }

  // 4-5. Start from hotel (fresh: true and fresh: false)
  cases.push({
    kind: 'start',
    source: AH_HOTEL,
    target: AH_CLOCKROOM,
    fresh: true,
    feedback: AH_START_FEEDBACK,
    setup: (h) => {
      const st = h.get();
      st.visited.hotel = true;
      h.save(st);
      h.setScene(AH_HOTEL);
    },
  });

  cases.push({
    kind: 'start',
    source: AH_HOTEL,
    target: AH_CLOCKROOM,
    fresh: false,
    feedback: AH_START_FEEDBACK,
    setup: (h) => {
      const st = h.get();
      st.visited.hotel = true;
      h.save(st);
      h.setScene(AH_HOTEL);
    },
  });

  // 6. Preview from clockroom
  cases.push({
    kind: 'preview',
    source: AH_CLOCKROOM,
    target: AH_VERANDA,
    clocks: [3, 2, 1],
    feedback: AH_PREVIEW_FEEDBACK,
    setup: (h) => {
      const st = h.get();
      st.visited.hotel = true;
      st.visited.clockroom = true;
      st.draft.clocks = [3, 2, 1];
      h.save(st);
      h.setScene(AH_CLOCKROOM);
    },
  });

  // 7. Revise from veranda
  cases.push({
    kind: 'revise',
    source: AH_VERANDA,
    target: AH_CLOCKROOM,
    feedback: AH_REVISE_FEEDBACK,
    setup: (h) => {
      const st = h.get();
      st.visited.hotel = true;
      st.visited.clockroom = true;
      st.visited.veranda = true;
      st.draft.clocks = [3, 2, 1];
      h.save(st);
      h.setScene(AH_VERANDA);
    },
  });

  // 8-11. Wake from veranda for each of the 4 ending categories
  const representativeClocks = {
    'dawn-waited-outside-the-doors': [3, 2, 1],
    'you-woke-in-a-borrowed-morning': [0, 1, 5],
    'someone-woke-on-your-behalf': [1, 0, 5],
    'three-rooms-shared-one-dawn': [0, 0, 0],
  };

  for (const endId of AH_ENDING_IDS) {
    const clk = representativeClocks[endId];
    const meta = AH_ENDING_TABLE[endId];
    cases.push({
      kind: 'wake',
      source: AH_VERANDA,
      target: meta.target,
      outcome: endId,
      clocks: [...clk],
      feedback: meta.story,
      setup: (h) => {
        const st = h.get();
        st.visited.hotel = true;
        st.visited.clockroom = true;
        st.visited.veranda = true;
        st.draft.clocks = [...clk];
        h.save(st);
        h.setScene(AH_VERANDA);
      },
    });
  }

  // 12-15. Wake-return from the ending targets
  for (const endId of AH_ENDING_IDS) {
    const clk = representativeClocks[endId];
    const meta = AH_ENDING_TABLE[endId];
    cases.push({
      kind: 'wake-return',
      source: meta.target,
      target: AH_HOTEL,
      outcome: endId,
      clocks: [...clk],
      feedback: AH_WAKE_RETURN_FEEDBACK,
      setup: (h) => {
        const st = h.get();
        st.visited.hotel = true;
        st.visited.clockroom = true;
        st.visited.veranda = true;
        if (!st.endings.includes(endId)) st.endings.push(endId);
        st.latestClocksByEnding[endId] = [...clk];
        st.activeWake = { outcome: endId, clocks: [...clk] };
        h.save(st);
        h.setScene(meta.target);
      },
    });
  }

  // 16. Abandon from clockroom
  cases.push({
    kind: 'abandon',
    source: AH_CLOCKROOM,
    target: AH_HOTEL,
    feedback: AH_ABANDON_FEEDBACK,
    setup: (h) => {
      const st = h.get();
      st.visited.hotel = true;
      st.visited.clockroom = true;
      h.save(st);
      h.setScene(AH_CLOCKROOM);
    },
  });

  return cases;
}

// Canonical keysets oracle for 7 kinds
export const AH_PENDING_KEYSETS = {
  entry: ['feedback', 'kind', 'source', 'target'],
  start: ['feedback', 'fresh', 'kind', 'source', 'target'],
  preview: ['clocks', 'feedback', 'kind', 'source', 'target'],
  revise: ['feedback', 'kind', 'source', 'target'],
  wake: ['clocks', 'feedback', 'kind', 'outcome', 'source', 'target'],
  'wake-return': ['clocks', 'feedback', 'kind', 'outcome', 'source', 'target'],
  abandon: ['feedback', 'kind', 'source', 'target'],
};


/**
 * .v104-gemini/v104-tests-core-corrected.mjs
 *
 * Exact Gemini v104 isolated production test CORE test groups (corrected).
 * Sole frontend/tests/docs author: gemini-3.7-flash-high. Verified independently by Codex.
 * Appended to .v104-gemini/v104-tests-base.mjs to form the full test suite.
 */

function plainJson(val) {
  if (val === undefined) return undefined;
  return JSON.parse(JSON.stringify(val));
}

// Map from from/to indices to native button IDs
const BORROW_BTN_MAP = {
  '0,1': 'ah-borrow-0-1',
  '0,2': 'ah-borrow-0-2',
  '1,0': 'ah-borrow-1-0',
  '1,2': 'ah-borrow-1-2',
  '2,0': 'ah-borrow-2-0',
  '2,1': 'ah-borrow-2-1',
};

/**
 * Capture actual 16 pending cases by genuinely driving native button callbacks.
 */
function captureActualAhPendingCases() {
  const oracle = generateIndependent36Oracle();
  const cases = [];

  // 1-3. Entry from 3 sources
  const entrySources = [
    { src: 'threshold', btn: 'ah-entry-threshold' },
    { src: 'remembrance', btn: 'ah-entry-remembrance' },
    { src: 'shadowless-photo-studio', btn: 'ah-entry-studio' },
  ];

  for (const { src, btn } of entrySources) {
    const h = createAhHarness({ initialScene: src });
    h.click(btn, true);
    const rawVal = h.raw();
    const st = plainJson(h.get());
    assert.ok(st.pending, `Entry from ${src} must produce pending`);
    assert.equal(st.pending.kind, 'entry');
    assert.equal(st.pending.source, src);
    assert.equal(st.pending.target, AH_HOTEL);
    assert.equal(st.pending.feedback, AH_ENTRY_FEEDBACK);
    cases.push({
      name: `entry-${src}`,
      state: st,
      pending: plainJson(st.pending),
      raw: rawVal,
    });
  }

  // Helper to get a harness in clockroom at target clocks via BFS native clicks
  function createHarnessAtClocks(targetClocks) {
    const h = createAhHarness({ initialScene: 'threshold' });
    h.click('ah-entry-threshold', true);
    h.clearTimers();
    h.arrive(AH_HOTEL);
    h.click('ah-new', true);
    h.clearTimers();
    h.arrive(AH_CLOCKROOM);

    const k = `${targetClocks[0]},${targetClocks[1]},${targetClocks[2]}`;
    const path = oracle.shortestPaths.get(k);
    if (!path) throw new Error(`Unreachable BFS target clocks: ${k}`);

    for (const step of path) {
      const btnId = BORROW_BTN_MAP[`${step.from},${step.to}`];
      h.click(btnId, true);
    }
    assert.deepEqual(plainJson(h.get().draft.clocks), plainJson(targetClocks));
    return h;
  }

  // 4. Start from hotel fresh: true
  {
    const h = createAhHarness({ initialScene: 'threshold' });
    h.click('ah-entry-threshold', true);
    h.clearTimers();
    h.arrive(AH_HOTEL);
    h.click('ah-new', true);
    const rawVal = h.raw();
    const st = plainJson(h.get());
    assert.ok(st.pending);
    assert.equal(st.pending.kind, 'start');
    assert.equal(st.pending.fresh, true);
    assert.equal(st.pending.source, AH_HOTEL);
    assert.equal(st.pending.target, AH_CLOCKROOM);
    cases.push({
      name: 'start-fresh-true',
      state: st,
      pending: plainJson(st.pending),
      raw: rawVal,
    });
  }

  // 5. Start from hotel fresh: false
  {
    const h = createAhHarness({ initialScene: 'threshold' });
    h.click('ah-entry-threshold', true);
    h.clearTimers();
    h.arrive(AH_HOTEL);
    h.click('ah-continue', true);
    const rawVal = h.raw();
    const st = plainJson(h.get());
    assert.ok(st.pending);
    assert.equal(st.pending.kind, 'start');
    assert.equal(st.pending.fresh, false);
    assert.equal(st.pending.source, AH_HOTEL);
    assert.equal(st.pending.target, AH_CLOCKROOM);
    cases.push({
      name: 'start-fresh-false',
      state: st,
      pending: plainJson(st.pending),
      raw: rawVal,
    });
  }

  // 6. Preview from clockroom
  {
    const h = createHarnessAtClocks([3, 2, 1]);
    h.click('ah-preview-btn', true);
    const rawVal = h.raw();
    const st = plainJson(h.get());
    assert.ok(st.pending);
    assert.equal(st.pending.kind, 'preview');
    assert.deepEqual(plainJson(st.pending.clocks), [3, 2, 1]);
    assert.equal(st.pending.source, AH_CLOCKROOM);
    assert.equal(st.pending.target, AH_VERANDA);
    cases.push({
      name: 'preview',
      state: st,
      pending: plainJson(st.pending),
      raw: rawVal,
    });
  }

  // 7. Revise from veranda
  {
    const h = createHarnessAtClocks([3, 2, 1]);
    h.click('ah-preview-btn', true);
    h.clearTimers();
    h.arrive(AH_VERANDA);
    h.click('ah-revise', true);
    const rawVal = h.raw();
    const st = plainJson(h.get());
    assert.ok(st.pending);
    assert.equal(st.pending.kind, 'revise');
    assert.equal(st.pending.source, AH_VERANDA);
    assert.equal(st.pending.target, AH_CLOCKROOM);
    cases.push({
      name: 'revise',
      state: st,
      pending: plainJson(st.pending),
      raw: rawVal,
    });
  }

  // 8-11. Wake from veranda for each ending
  const repClocks = {
    'dawn-waited-outside-the-doors': [3, 2, 1],
    'you-woke-in-a-borrowed-morning': [0, 1, 5],
    'someone-woke-on-your-behalf': [1, 0, 5],
    'three-rooms-shared-one-dawn': [0, 0, 0],
  };

  for (const endId of AH_ENDING_IDS) {
    const clk = repClocks[endId];
    const meta = AH_ENDING_TABLE[endId];
    const h = createHarnessAtClocks(clk);
    h.click('ah-preview-btn', true);
    h.clearTimers();
    h.arrive(AH_VERANDA);
    h.click('ah-wake', true);
    const rawVal = h.raw();
    const st = plainJson(h.get());
    assert.ok(st.pending);
    assert.equal(st.pending.kind, 'wake');
    assert.equal(st.pending.outcome, endId);
    assert.deepEqual(plainJson(st.pending.clocks), plainJson(clk));
    assert.equal(st.pending.source, AH_VERANDA);
    assert.equal(st.pending.target, meta.target);
    cases.push({
      name: `wake-${endId}`,
      state: st,
      pending: plainJson(st.pending),
      raw: rawVal,
    });
  }

  // 12-15. Wake-return from target scene
  for (const endId of AH_ENDING_IDS) {
    const clk = repClocks[endId];
    const meta = AH_ENDING_TABLE[endId];
    const h = createHarnessAtClocks(clk);
    h.click('ah-preview-btn', true);
    h.clearTimers();
    h.arrive(AH_VERANDA);
    h.click('ah-wake', true);
    h.clearTimers();
    h.arrive(meta.target);

    const btnReturnId = `ah-wake-return-${meta.target}`;
    h.click(btnReturnId, true);
    const rawVal = h.raw();
    const st = plainJson(h.get());
    assert.ok(st.pending);
    assert.equal(st.pending.kind, 'wake-return');
    assert.equal(st.pending.outcome, endId);
    assert.deepEqual(plainJson(st.pending.clocks), plainJson(clk));
    assert.equal(st.pending.source, meta.target);
    assert.equal(st.pending.target, AH_HOTEL);
    cases.push({
      name: `wake-return-${endId}`,
      state: st,
      pending: plainJson(st.pending),
      raw: rawVal,
    });
  }

  // 16. Abandon from clockroom
  {
    const h = createHarnessAtClocks([3, 2, 1]);
    h.click('ah-abandon', true);
    const rawVal = h.raw();
    const st = plainJson(h.get());
    assert.ok(st.pending);
    assert.equal(st.pending.kind, 'abandon');
    assert.equal(st.pending.source, AH_CLOCKROOM);
    assert.equal(st.pending.target, AH_HOTEL);
    cases.push({
      name: 'abandon',
      state: st,
      pending: plainJson(st.pending),
      raw: rawVal,
    });
  }

  assert.equal(cases.length, 16, 'Must capture exactly 16 native pending cases');
  return cases;
}

// ----------------------------------------------------------------------------
// TEST GROUPS 1 TO 12
// ----------------------------------------------------------------------------

test('Group 1: Static structure, header/markers, asset attributes and native button counts', () => {
  // AH Header and End Marker exact count 1 in scriptSource
  const headerCount = (scriptSource.match(new RegExp(AH_MODULE_HEADER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  const markerCount = (scriptSource.match(new RegExp(AH_MODULE_END_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  assert.equal(headerCount, 1, 'AH_MODULE_HEADER must appear exactly once in script.js');
  assert.equal(markerCount, 1, 'AH_MODULE_END_MARKER must appear exactly once in script.js');

  // Substantial source (>30KB)
  const ahByteLength = Buffer.byteLength(ahModuleSource, 'utf8');
  assert.ok(ahByteLength > 30 * 1024, `ahModuleSource must be substantial (>30KB), got ${ahByteLength} bytes`);

  // Exclude guide/PH pollution in ahModuleSource
  assert.equal(ahModuleSource.includes('/* ============================================================\n   GUIDE HELPER'), false);
  assert.equal(ahModuleSource.includes('/* ============================================================\n   v103 收不到影子的照相馆'), false);

  // Exact styles/script cache=v104
  assert.ok(htmlSource.includes('href="styles.css?v=113"'), 'styles.css must have ?v=113');
  assert.ok(htmlSource.includes('src="script.js?v=113"'), 'script.js must have ?v=113');

  // Exact 262 unique sections (HTML section IDs include scene- prefix)
  const sectionMatches = htmlSource.match(/<section\b[^>]*\bid=["']([^"']+)["']/g) || [];
  const sectionIds = new Set();
  const duplicateSectionIds = [];
  sectionMatches.forEach((m) => {
    const idMatch = m.match(/\bid=["']([^"']+)["']/);
    if (idMatch) {
      const id = idMatch[1];
      if (sectionIds.has(id)) duplicateSectionIds.push(id);
      sectionIds.add(id);
    }
  });
  assert.equal(duplicateSectionIds.length, 0, `Duplicate sections found: ${duplicateSectionIds.join(', ')}`);
  assert.equal(sectionIds.size, 262, `Expected exactly 262 unique sections, found ${sectionIds.size}`);
  assert.ok(sectionIds.has('scene-wake-for-another-hotel'));
  assert.ok(sectionIds.has('scene-borrowed-dawn-clockroom'));
  assert.ok(sectionIds.has('scene-shared-morning-veranda'));

  // 20 Fixed native button IDs: raw HTML occurrences count 1, BUTTON tag with type="button", 1 listener
  const h = createAhHarness();
  assert.equal(AH_NATIVE_BUTTON_IDS.length, 20);
  const uniqueBtnIds = new Set(AH_NATIVE_BUTTON_IDS);
  assert.equal(uniqueBtnIds.size, 20);

  for (const btnId of AH_NATIVE_BUTTON_IDS) {
    const idRegex = new RegExp(`id=["']${btnId}["']`, 'g');
    const rawMatches = htmlSource.match(idRegex) || [];
    assert.equal(rawMatches.length, 1, `Button id="${btnId}" must appear exactly once in raw HTML`);

    const buttonTagRegex = new RegExp(`<button\\b[^>]*id=["']${btnId}["'][^>]*>`, 'i');
    const tagMatch = htmlSource.match(buttonTagRegex);
    assert.ok(tagMatch, `Node #${btnId} must be a native <button> tag`);
    assert.ok(/type=["']button["']/i.test(tagMatch[0]), `Button #${btnId} must have type="button"`);

    const node = h.nodes.get(btnId);
    assert.ok(node, `Button #${btnId} must exist in HTML mock`);
    assert.equal(node._listenerCount('click'), 1, `Button #${btnId} must have exactly 1 click listener`);
  }
  assert.equal(h.listeners.size, 20);

  // Unknown getNode returns null
  assert.equal(h.getNode('non-existent-button-id'), null);

  // Balanced tag stack proving #ah-entry-remembrance inside #ah-codex inside #scene-remembrance
  function findAncestorsInHtml(targetId) {
    const tokens = htmlSource.match(/<\/?([a-zA-Z0-9\-]+)([^>]*)>/g) || [];
    const stack = [];
    let ancestors = null;
    for (const token of tokens) {
      const isClosing = token.startsWith('</');
      const isSelfClosing = token.endsWith('/>');
      const tagMatch = token.match(/<\/?([a-zA-Z0-9\-]+)/);
      if (!tagMatch) continue;
      const tag = tagMatch[1].toLowerCase();
      if (['img', 'meta', 'link', 'br', 'hr', 'input'].includes(tag)) continue;

      if (isClosing) {
        stack.pop();
      } else {
        const idMatch = token.match(/\bid=["']([^"']+)["']/);
        const elemId = idMatch ? idMatch[1] : '';
        if (elemId === targetId) {
          ancestors = stack.map((s) => s.id).filter(Boolean);
          break;
        }
        if (!isSelfClosing) {
          stack.push({ tag, id: elemId });
        }
      }
    }
    return ancestors;
  }
  const remembranceAncestors = findAncestorsInHtml('ah-entry-remembrance');
  assert.ok(remembranceAncestors, 'Must find ah-entry-remembrance in HTML tree');
  assert.ok(remembranceAncestors.includes('ah-codex'), 'ah-entry-remembrance must be descendant of ah-codex');
  assert.ok(remembranceAncestors.includes('scene-remembrance'), 'ah-entry-remembrance must be descendant of scene-remembrance');

  // 3 WebP images verification: v104- prefix, paths, size < 300KB
  const images = [
    'assets/v104-wake-for-another-hotel.webp',
    'assets/v104-borrowed-dawn-clockroom.webp',
    'assets/v104-shared-morning-veranda.webp',
  ];
  for (const imgPath of images) {
    const fullPath = path.join(PROJECT_ROOT, imgPath);
    assert.ok(fs.existsSync(fullPath), `Asset file ${imgPath} must exist`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size < 300 * 1024, `Asset ${imgPath} size (${stat.size}B) must be under 300KB`);
    assert.ok(htmlSource.includes(imgPath), `index.html must reference ${imgPath}`);

    // Verify RIFF WebP header
    const fd = fs.openSync(fullPath, 'r');
    const buf = Buffer.alloc(12);
    fs.readSync(fd, buf, 0, 12, 0);
    fs.closeSync(fd);
    assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
    assert.equal(buf.toString('ascii', 8, 12), 'WEBP');
  }
});

test('Group 2: Independent 216 tuple oracle, 36 valid states, BFS reachability and borrow transitions', () => {
  const oracle = generateIndependent36Oracle();
  assert.equal(oracle.allTuples.length, 216);
  assert.equal(oracle.valid36.length, 36);

  // Distribution check: 20 none, 5 self, 10 other, 1 all
  assert.equal(oracle.classes['dawn-waited-outside-the-doors'].length, 20);
  assert.equal(oracle.classes['you-woke-in-a-borrowed-morning'].length, 5);
  assert.equal(oracle.classes['someone-woke-on-your-behalf'].length, 10);
  assert.equal(oracle.classes['three-rooms-shared-one-dawn'].length, 1);

  // All 36 reachable from [3,2,1] via borrow transitions; min distance to [0,0,0] is 3
  assert.equal(oracle.visitedDist.size, 36);
  assert.equal(oracle.minZeroDistance, 3);

  const borrowActions = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 0 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
    { from: 2, to: 1 },
  ];

  const hDomain = createAhHarness({ initialScene: AH_CLOCKROOM });
  for (let r0 = 0; r0 < 6; r0++) {
    for (let r1 = 0; r1 < 6; r1++) {
      for (let r2 = 0; r2 < 6; r2++) {
        const tuple = [r0, r1, r2];
        const expectedValid = (r0 + r1 + r2) % 6 === 0;
        assert.strictEqual(hDomain.isValid(tuple), expectedValid, `isValid mismatch for tuple ${JSON.stringify(tuple)}`);
        let expectedClass = '';
        if (expectedValid) {
          const zeros = (r0 === 0 ? 1 : 0) + (r1 === 0 ? 1 : 0) + (r2 === 0 ? 1 : 0);
          if (zeros === 0) {
            expectedClass = 'dawn-waited-outside-the-doors';
          } else if (zeros === 3) {
            expectedClass = 'three-rooms-shared-one-dawn';
          } else if (zeros === 1 && r0 === 0) {
            expectedClass = 'you-woke-in-a-borrowed-morning';
          } else {
            expectedClass = 'someone-woke-on-your-behalf';
          }
        }
        assert.strictEqual(hDomain.classify(tuple), expectedClass, `classify mismatch for tuple ${JSON.stringify(tuple)}`);
      }
    }
  }
  // For EACH of the 36 states x 6 actions = 216 transitions, test click dispatch, independent math, inverse restoration, and classify
  for (const state of oracle.valid36) {
    for (const act of borrowActions) {
      const h = createAhHarness({ initialScene: AH_CLOCKROOM });
      const st = plainJson(h.get());
      st.visited.hotel = true;
      st.visited.clockroom = true;
      st.draft.clocks = [...state];
      h.save(st);
      h.sync();

      const btnId = BORROW_BTN_MAP[`${act.from},${act.to}`];
      h.click(btnId, true);

      const nextExpected = [...state];
      nextExpected[act.from] = (nextExpected[act.from] + 5) % 6;
      nextExpected[act.to] = (nextExpected[act.to] + 1) % 6;

      const afterClocks = plainJson(h.get().draft.clocks);
      assert.deepEqual(afterClocks, nextExpected, `Native click #${btnId} on [${state.join(',')}] must yield independent math [${nextExpected.join(',')}]`);

      // Independent classify check
      let expectedClass = '';
      const c0 = nextExpected[0] === 0;
      const c1 = nextExpected[1] === 0;
      const c2 = nextExpected[2] === 0;
      if (c0 && c1 && c2) expectedClass = 'three-rooms-shared-one-dawn';
      else if (c0 && !c1 && !c2) expectedClass = 'you-woke-in-a-borrowed-morning';
      else if (!c0 && (c1 || c2)) expectedClass = 'someone-woke-on-your-behalf';
      else expectedClass = 'dawn-waited-outside-the-doors';
      assert.equal(h.classify(afterClocks), expectedClass);

      // Inverse action restores state
      const inverseBtnId = BORROW_BTN_MAP[`${act.to},${act.from}`];
      h.click(inverseBtnId, true);
      assert.deepEqual(plainJson(h.get().draft.clocks), plainJson(state), `Inverse native click #${inverseBtnId} must restore original state`);
    }
  }

  // Verify that all 36 valid states (including the 20 none-zero) enable preview button
  const hPreview = createAhHarness({ initialScene: AH_CLOCKROOM });
  const baseSt = plainJson(hPreview.get());
  baseSt.visited.hotel = true;
  baseSt.visited.clockroom = true;
  hPreview.save(baseSt);

  for (const state of oracle.valid36) {
    const curr = plainJson(hPreview.get());
    curr.draft.clocks = [...state];
    hPreview.save(curr);
    hPreview.sync();
    const btn = hPreview.getNode('ah-preview-btn');
    assert.equal(btn.disabled, false, `Preview button must be enabled for valid clocks [${state.join(',')}]`);
  }
});

test('Group 3: Normalization invariants, strict field rules, corrupted JSON and getter safety', () => {
  const h = createAhHarness();

  // Baseline default state
  const def = plainJson(h.normalize(null));
  assert.equal(def.version, 104);
  assert.deepEqual(def.draft.clocks, [3, 2, 1]);
  assert.deepEqual(def.visited, { hotel: false, clockroom: false, veranda: false });
  assert.deepEqual(def.endings, []);
  assert.deepEqual(def.latestClocksByEnding, {});
  assert.equal(def.runs, 0);
  assert.equal(def.lastOutcome, '');
  assert.equal(def.activeWake, null);
  assert.equal(def.pending, null);

  // Literal 9 top field keyset explicit, not copied from actual output
  const EXPECTED_TOP_KEYS = [
    'activeWake',
    'draft',
    'endings',
    'lastOutcome',
    'latestClocksByEnding',
    'pending',
    'runs',
    'version',
    'visited',
  ];
  assert.deepEqual(Object.keys(def).sort(), EXPECTED_TOP_KEYS.sort());

  // Non-initial valid clocks preserved under version: 104
  const validNonInitial = plainJson(h.normalize({
    version: 104,
    visited: { hotel: true, clockroom: true, veranda: false },
    draft: { clocks: [0, 1, 5] },
  }));
  assert.deepEqual(validNonInitial.draft.clocks, [0, 1, 5]);
  assert.equal(validNonInitial.visited.hotel, true);
  assert.equal(validNonInitial.visited.clockroom, true);

  // Corrupted clocks -> resets draft to [3,2,1], NEVER to [0,0,0], preserving visited
  const badDrafts = [
    { version: 104, visited: { hotel: true, clockroom: true, veranda: false }, draft: { clocks: [0, 0, 1] } }, // sum % 6 !== 0
    { version: 104, visited: { hotel: true, clockroom: true, veranda: false }, draft: { clocks: [0, 0, 0, 0] } },
    { version: 104, visited: { hotel: true, clockroom: true, veranda: false }, draft: { clocks: ['3', '2', '1'] } },
    { version: 104, visited: { hotel: true, clockroom: true, veranda: false }, draft: { clocks: [-1, 2, 5] } },
    { version: 104, visited: { hotel: true, clockroom: true, veranda: false }, draft: { clocks: [null, 2, 1] } },
  ];
  for (const bad of badDrafts) {
    const norm = plainJson(h.normalize(bad));
    assert.deepEqual(norm.draft.clocks, [3, 2, 1]);
    assert.equal(norm.visited.hotel, true);
    assert.equal(norm.visited.clockroom, true);
  }

  // Runs clamping
  assert.equal(plainJson(h.normalize({ version: 104, runs: -5 })).runs, 0);
  assert.equal(plainJson(h.normalize({ version: 104, runs: 12000 })).runs, 9999);
  assert.equal(plainJson(h.normalize({ version: 104, runs: '10' })).runs, 0);

  // Latest clocks stripping for uncollected/mismatched endings
  const weirdLatest = {
    version: 104,
    endings: ['dawn-waited-outside-the-doors'],
    latestClocksByEnding: {
      'dawn-waited-outside-the-doors': [3, 2, 1], // valid
      'three-rooms-shared-one-dawn': [0, 0, 0], // uncollected ending -> stripped
      'you-woke-in-a-borrowed-morning': [3, 2, 1], // mismatch classification -> stripped
      'fake-ending': [0, 0, 0], // fake ending -> stripped
    },
  };
  const normLatest = plainJson(h.normalize(weirdLatest));
  assert.deepEqual(Object.keys(normLatest.latestClocksByEnding), ['dawn-waited-outside-the-doors']);
  assert.deepEqual(normLatest.latestClocksByEnding['dawn-waited-outside-the-doors'], [3, 2, 1]);

  // Active wake stripping when outcome uncollected or clocks mismatch
  const badActiveWake = {
    version: 104,
    endings: ['dawn-waited-outside-the-doors'],
    latestClocksByEnding: { 'dawn-waited-outside-the-doors': [3, 2, 1] },
    activeWake: { outcome: 'dawn-waited-outside-the-doors', clocks: [0, 1, 5], extraField: 123 },
  };
  assert.equal(plainJson(h.normalize(badActiveWake)).activeWake, null);

  // Active wake valid -> extra field stripped
  const validActiveWake = {
    version: 104,
    endings: ['dawn-waited-outside-the-doors'],
    latestClocksByEnding: { 'dawn-waited-outside-the-doors': [3, 2, 1] },
    activeWake: { outcome: 'dawn-waited-outside-the-doors', clocks: [3, 2, 1], extra: 'strip_me' },
  };
  assert.deepEqual(plainJson(h.normalize(validActiveWake)).activeWake, {
    outcome: 'dawn-waited-outside-the-doors',
    clocks: [3, 2, 1],
  });

  // Corrupted raw JSON in storage: getter returns default, memory preserved without new writes
  h.mem.set(AH_KEY, '{invalid json');
  h.resetWrites();
  const gotState = plainJson(h.get());
  assert.deepEqual(gotState, def);
  assert.equal(h.raw(), '{invalid json');
  assert.equal(h.writes.length, 0);
});

test('Group 4: Shared trusted clicks, double click lockout and first-lock protection', () => {
  // Clean timer-first lock (independent timer gate: button initially enabled then presetschedules.from same current scene without sync)
  {
    const hTimer = createAhHarness({ initialScene: 'threshold' });
    assert.equal(hTimer.getNode('ah-entry-threshold').disabled, false);
    hTimer.schedules.push({ from: 'threshold', to: 'arbitrary-dest' });
    const rawBefore = hTimer.raw();
    const writesBefore = hTimer.writes.length;
    const audioBefore = hTimer.getAudioCounts();
    const schedsBefore = hTimer.schedules.length;

    hTimer.click('ah-entry-threshold', true);

    assert.equal(hTimer.raw(), rawBefore);
    assert.equal(hTimer.writes.length, writesBefore);
    assert.deepEqual(hTimer.getAudioCounts(), audioBefore);
    assert.equal(hTimer.schedules.length, schedsBefore);
    assert.equal(plainJson(hTimer.get()).pending, null);
  }

  // Clean enabled untrusted click snapshot: stable raw, writes, audio, schedules
  {
    const hUntrusted = createAhHarness({ initialScene: 'threshold' });
    assert.equal(hUntrusted.getNode('ah-entry-threshold').disabled, false);
    const rawBefore = hUntrusted.raw();
    const writesBefore = hUntrusted.writes.length;
    const audioBefore = hUntrusted.getAudioCounts();
    const schedsBefore = hUntrusted.schedules.length;

    hUntrusted.click('ah-entry-threshold', false);

    assert.equal(hUntrusted.raw(), rawBefore);
    assert.equal(hUntrusted.writes.length, writesBefore);
    assert.deepEqual(hUntrusted.getAudioCounts(), audioBefore);
    assert.equal(hUntrusted.schedules.length, schedsBefore);
    assert.equal(plainJson(hUntrusted.get()).pending, null);
  }

  // Separate clean offscene click snapshot: stable raw, writes, audio, schedules
  {
    const hOff = createAhHarness({ initialScene: 'remembrance' });
    const rawBefore = hOff.raw();
    const writesBefore = hOff.writes.length;
    const audioBefore = hOff.getAudioCounts();
    const schedsBefore = hOff.schedules.length;

    hOff.click('ah-entry-threshold', true);

    assert.equal(hOff.raw(), rawBefore);
    assert.equal(hOff.writes.length, writesBefore);
    assert.deepEqual(hOff.getAudioCounts(), audioBefore);
    assert.equal(hOff.schedules.length, schedsBefore);
    assert.equal(plainJson(hOff.get()).pending, null);
  }

  const h = createAhHarness({ initialScene: 'threshold' });

  // Untrusted click is ignored
  h.click('ah-entry-threshold', false);
  assert.equal(plainJson(h.get()).pending, null);
  assert.equal(h.schedules.length, 0);

  // Trusted click succeeds
  h.click('ah-entry-threshold', true);
  assert.ok(plainJson(h.get()).pending);
  assert.equal(h.schedules.length, 1);

  // Double entry packet ignored (pending already exists)
  h.click('ah-entry-threshold', true);
  assert.equal(h.schedules.length, 1);

  // Off-scene click ignored
  h.setScene('remembrance');
  h.click('ah-entry-threshold', true);
  assert.equal(h.schedules.length, 1);

  // Move to hotel and test clockroom entry
  h.clearTimers();
  h.arrive(AH_HOTEL);
  assert.equal(plainJson(h.get()).visited.hotel, true);

  // Untrusted start rejected
  h.click('ah-new', false);
  assert.equal(plainJson(h.get()).pending, null);

  // Trusted start succeeds
  h.click('ah-new', true);
  assert.ok(plainJson(h.get()).pending);
  assert.equal(plainJson(h.get()).pending.kind, 'start');

  // Arrive in clockroom
  h.clearTimers();
  h.arrive(AH_CLOCKROOM);

  // Borrow button untrusted rejected
  const initialClocks = plainJson(h.get().draft.clocks);
  h.click('ah-borrow-0-1', false);
  assert.deepEqual(plainJson(h.get().draft.clocks), initialClocks);

  // Borrow button trusted modifies clocks
  h.click('ah-borrow-0-1', true);
  assert.notDeepEqual(plainJson(h.get().draft.clocks), initialClocks);
});

test('Group 5: Six loans, wrap 0->5 / 5->0, UI rotation, data attributes and loan graph', () => {
  const h = createAhHarness({ initialScene: AH_CLOCKROOM });
  const all6Directions = [
    { from: 0, to: 1, initial: [0, 0, 0], expected: [5, 1, 0] },
    { from: 0, to: 2, initial: [5, 1, 0], expected: [4, 1, 1] },
    { from: 1, to: 0, initial: [4, 1, 1], expected: [5, 0, 1] },
    { from: 1, to: 2, initial: [5, 0, 1], expected: [5, 5, 2] },
    { from: 2, to: 0, initial: [5, 5, 2], expected: [0, 5, 1] },
    { from: 2, to: 1, initial: [0, 5, 1], expected: [0, 0, 0] },
  ];

  for (const dir of all6Directions) {
    const st = plainJson(h.get());
    st.visited.hotel = true;
    st.visited.clockroom = true;
    st.draft.clocks = [...dir.initial];
    h.save(st);
    h.sync();

    const btnId = BORROW_BTN_MAP[`${dir.from},${dir.to}`];
    h.click(btnId, true);
    assert.deepEqual(plainJson(h.get().draft.clocks), dir.expected, `Action ${btnId} must yield ${dir.expected}`);

    const connNode = h.getNode('ah-clockroom-connections');
    const diagram = connNode.querySelectorAll('.ah-loan-diagram')[0];
    assert.ok(diagram);
    assert.equal(diagram.getAttribute('data-from'), String(dir.from + 1));
    assert.equal(diagram.getAttribute('data-to'), String(dir.to + 1));

    const thirdIdx = 3 - dir.from - dir.to;
    assert.ok(connNode.textContent.includes(`${AH_ROOM_SHORT_NAMES[dir.from]}（${dir.initial[dir.from]} ⟶ ${dir.expected[dir.from]}）`));
    assert.ok(connNode.textContent.includes(`${AH_ROOM_SHORT_NAMES[dir.to]}（${dir.initial[dir.to]} ⟶ ${dir.expected[dir.to]}）`));
    assert.ok(connNode.textContent.includes(`${AH_ROOM_SHORT_NAMES[thirdIdx]}（第 ${dir.expected[thirdIdx]} 刻 · 保持不变）`));

    // Check all 6 tick elements and hand rotation angle for each clock card
    const clockContainer = h.getNode('ah-clockroom-clocks');
    const cards = clockContainer.querySelectorAll('.ah-clock-card');
    assert.equal(cards.length, 3);
    cards.forEach((card, idx) => {
      const val = dir.expected[idx];
      assert.equal(card.getAttribute('data-room'), String(idx + 1));
      assert.equal(card.getAttribute('data-value'), String(val));
      if (val === 0) {
        assert.ok(card.classList.contains('is-awake'));
      } else {
        assert.ok(card.classList.contains('is-dreaming'));
      }

      const ticks = card.querySelectorAll('.ah-clock-tick');
      assert.equal(ticks.length, 6, 'Clock face must render exactly 6 ticks');
      ticks.forEach((t, tIdx) => {
        assert.ok(t.classList.contains(`is-tick-${tIdx}`));
      });

      const hand = card.querySelectorAll('.ah-clock-hand')[0];
      assert.ok(hand);
      assert.equal(hand.style.transform, `rotate(${val * 60}deg)`);
    });
  }
});

test('Group 6: Reset initial, example 4-cycle display only without store pollution, continue vs new', () => {
  const h = createAhHarness({ initialScene: AH_CLOCKROOM });
  const st = plainJson(h.get());
  st.visited.hotel = true;
  st.visited.clockroom = true;
  st.draft.clocks = [0, 0, 0];
  st.runs = 3;
  st.endings = ['three-rooms-shared-one-dawn'];
  st.latestClocksByEnding = { 'three-rooms-shared-one-dawn': [0, 0, 0] };
  h.save(st);
  h.sync();

  const snapshotRaw = h.raw();
  h.resetWrites();

  // Example button cycle
  const exBtn = h.getNode('ah-example-btn');
  const exPanel = h.getNode('ah-example-panel');
  const exNote = h.getNode('ah-example-note');

  assert.equal(exPanel.hidden, true);

  // Click 1: example 0 [3,2,1]
  h.click('ah-example-btn', true);
  assert.equal(exPanel.hidden, false);
  assert.ok(exNote.textContent.includes('天亮留在门外'));
  assert.deepEqual(plainJson(h.get().draft.clocks), [0, 0, 0]);
  assert.equal(h.raw(), snapshotRaw);
  assert.equal(h.writes.length, 0);

  // Click 2: example 1 [0,1,5]
  h.click('ah-example-btn', true);
  assert.ok(exNote.textContent.includes('你醒在别人的清晨里'));
  assert.equal(h.raw(), snapshotRaw);
  assert.equal(h.writes.length, 0);

  // Click 3: example 2 [1,0,5]
  h.click('ah-example-btn', true);
  assert.ok(exNote.textContent.includes('有人替你醒来'));
  assert.equal(h.raw(), snapshotRaw);
  assert.equal(h.writes.length, 0);

  // Click 4: example 3 [0,0,0]
  h.click('ah-example-btn', true);
  assert.ok(exNote.textContent.includes('三间房共用一次天亮'));
  assert.equal(h.raw(), snapshotRaw);
  assert.equal(h.writes.length, 0);

  // Click 5: wrap back to example 0 [3,2,1]
  h.click('ah-example-btn', true);
  assert.ok(exNote.textContent.includes('天亮留在门外'));
  assert.equal(h.raw(), snapshotRaw);
  assert.equal(h.writes.length, 0);

  // Reset button resets draft to [3,2,1] without altering runs/endings/latest
  h.click('ah-reset', true);
  const resetSt = plainJson(h.get());
  assert.deepEqual(resetSt.draft.clocks, [3, 2, 1]);
  assert.equal(resetSt.runs, 3);
  assert.deepEqual(resetSt.endings, ['three-rooms-shared-one-dawn']);
  assert.deepEqual(resetSt.latestClocksByEnding, { 'three-rooms-shared-one-dawn': [0, 0, 0] });

  // Move back to hotel and test fresh:false continue vs fresh:true new
  h.setScene(AH_HOTEL);
  h.sync();
  // Modify draft in memory
  resetSt.draft.clocks = [1, 0, 5];
  h.save(resetSt);

  // Hotel note neutral
  const hotelNote = h.getNode('ah-hotel-note');
  assert.ok(hotelNote.textContent.includes('前台柜台上放着 1、2、3 号房钥匙'));

  // Continue (fresh: false) preserves draft on arrival
  h.click('ah-continue', true);
  h.clearTimers();
  h.arrive(AH_CLOCKROOM);
  assert.deepEqual(plainJson(h.get().draft.clocks), [1, 0, 5]);

  // Start (fresh: true) resets draft to [3,2,1] on arrival
  h.setScene(AH_HOTEL);
  h.sync();
  h.click('ah-new', true);
  h.clearTimers();
  h.arrive(AH_CLOCKROOM);
  assert.deepEqual(plainJson(h.get().draft.clocks), [3, 2, 1]);
});

test('Group 7: Preview / veranda frozen state, revise, abandon, continue and no runs ledger increment', () => {
  const h = createAhHarness({ initialScene: AH_CLOCKROOM });
  const st = plainJson(h.get());
  st.visited.hotel = true;
  st.visited.clockroom = true;
  st.draft.clocks = [2, 2, 2]; // 20 none-zero category
  h.save(st);
  h.sync();

  // Preview [2,2,2]
  h.click('ah-preview-btn', true);
  h.clearTimers();
  h.arrive(AH_VERANDA);

  assert.equal(plainJson(h.get()).visited.veranda, true);
  assert.equal(plainJson(h.get()).runs, 0);
  assert.deepEqual(plainJson(h.get()).endings, []);

  // Check veranda summary
  const vSummary = h.getNode('ah-veranda-summary');
  assert.ok(vSummary.textContent.includes('天亮留在门外'));

  // Revise returns to clockroom, draft preserved, runs unchanged
  h.click('ah-revise', true);
  h.clearTimers();
  h.arrive(AH_CLOCKROOM);
  assert.deepEqual(plainJson(h.get().draft.clocks), [2, 2, 2]);
  assert.equal(plainJson(h.get()).runs, 0);

  // Abandon returns to hotel, draft preserved, runs unchanged
  h.click('ah-abandon', true);
  h.clearTimers();
  h.arrive(AH_HOTEL);
  assert.deepEqual(plainJson(h.get().draft.clocks), [2, 2, 2]);
  assert.equal(plainJson(h.get()).runs, 0);
});

test('Group 8: captureActualAhPendingCases 16 items, 7 keyset oracle, ordered asymmetric tamper and pollution rejection', () => {
  const actualCases = captureActualAhPendingCases();
  assert.equal(actualCases.length, 16);

  const h = createAhHarness();

  for (const c of actualCases) {
    const p = plainJson(c.pending);
    const kind = p.kind;
    const expectedKeys = AH_PENDING_KEYSETS[kind];
    assert.ok(expectedKeys, `Keyset must exist for kind: ${kind}`);

    const actualKeys = Object.keys(p).sort();
    assert.deepEqual(actualKeys, [...expectedKeys].sort(), `Pending keys for ${c.name} must match exact keyset`);

    // Accepted first against baseline state
    const accepted = plainJson(h.normalizePending(p, c.state));
    assert.ok(accepted, `Canonical pending must be accepted for ${c.name}`);
    assert.deepEqual(accepted, p);

    // Single field feedback pollution
    const pollutedFeedback = { ...p, feedback: 'Wrong feedback' };
    assert.equal(h.normalizePending(pollutedFeedback, c.state), null, `Polluted feedback must reject for ${c.name}`);

    // Extra unknown field pollution
    const pollutedExtra = { ...p, extraField: 'bogus' };
    assert.equal(h.normalizePending(pollutedExtra, c.state), null, `Extra field pollution must reject for ${c.name}`);

    // Target pollution
    const pollutedTarget = { ...p, target: 'unrelated-scene' };
    assert.equal(h.normalizePending(pollutedTarget, c.state), null, `Target pollution must reject for ${c.name}`);

    // Source pollution
    const pollutedSource = { ...p, source: 'unrelated-scene' };
    assert.equal(h.normalizePending(pollutedSource, c.state), null, `Source pollution must reject for ${c.name}`);

    // Missing required key
    for (const key of expectedKeys) {
      const missingKeyObj = { ...p };
      delete missingKeyObj[key];
      assert.equal(h.normalizePending(missingKeyObj, c.state), null, `Missing key ${key} must reject for ${c.name}`);
    }

    // Clocks pollution & asymmetric ordering tamper
    if (p.clocks) {
      // Reversed clocks
      const reversedClocks = [...p.clocks].reverse();
      if (!reversedClocks.every((v, i) => v === p.clocks[i])) {
        const tamperedClocks = { ...p, clocks: reversedClocks };
        assert.equal(h.normalizePending(tamperedClocks, c.state), null, `Tampered ordered clocks must reject for ${c.name}`);
      }

      // Invalid digit clocks
      const invalidDigit = { ...p, clocks: [p.clocks[0], p.clocks[1], 99] };
      assert.equal(h.normalizePending(invalidDigit, c.state), null, `Invalid digit clocks must reject for ${c.name}`);
    }

    // Start fresh non-boolean pollution
    if (kind === 'start') {
      const nonBoolFresh = { ...p, fresh: 'true' };
      assert.equal(h.normalizePending(nonBoolFresh, c.state), null, `Non-boolean fresh must reject for ${c.name}`);
    }

    // Wake / Wake-return outcome pollution
    if (kind === 'wake' || kind === 'wake-return') {
      const wrongOutcome = { ...p, outcome: 'fake-outcome' };
      assert.equal(h.normalizePending(wrongOutcome, c.state), null, `Wrong outcome must reject for ${c.name}`);
    }
  }
});

test('Group 9: 16 cases x (source/target/unrelated) = 48 cold tests and PH flags stubs gate protection', () => {
  const actualCases = captureActualAhPendingCases();
  assert.equal(actualCases.length, 16);

  // For each of the 16 cases, run 3 cold scenarios = 48 fresh VM instances:
  // 1. Cold replay at logical source
  // 2. Cold arrive at target
  // 3. Cold arrive at unrelated scene
  for (const c of actualCases) {
    // 1. Source cold replay
    {
      const hSource = createAhHarness({ initialStore: c.raw, initialScene: c.pending.source });
      const rawBefore = hSource.raw();
      hSource.resetWrites();
      hSource.replay(c.pending.source);
      assert.equal(hSource.raw(), rawBefore, `Source replay raw must not mutate for ${c.name}`);
      assert.equal(hSource.writes.length, 0, `Source replay must have 0 writes for ${c.name}`);
      assert.equal(hSource.schedules.length, 1, `Source replay must reschedule navigation for ${c.name}`);
      assert.equal(hSource.schedules[0].from, c.pending.source);
      assert.equal(hSource.schedules[0].to, c.pending.target);
    }

    // 2. Target cold arrival
    {
      const hTarget = createAhHarness({ initialStore: c.raw, initialScene: c.pending.source });
      hTarget.clearTimers();
      hTarget.arrive(c.pending.target);
      const st = plainJson(hTarget.get());
      assert.equal(st.pending, null, `Pending must be resolved upon arrival at target for ${c.name}`);

      // If wake: runs incremented, activeWake set
      if (c.pending.kind === 'wake') {
        assert.equal(st.runs, 1);
        assert.deepEqual(st.endings, [c.pending.outcome]);
        assert.ok(st.activeWake);
        assert.equal(st.activeWake.outcome, c.pending.outcome);
      }

      // If wake-return: activeWake cleared
      if (c.pending.kind === 'wake-return') {
        assert.equal(st.activeWake, null);
      }

      // Refresh target -> no new banking/ledger increment, raw byte-exact and writes count stable
      const runsAfter = st.runs;
      const rawBeforeSecondArrival = hTarget.raw();
      const writesCountBeforeSecondArrival = hTarget.writes.length;
      hTarget.arrive(c.pending.target);
      assert.equal(plainJson(hTarget.get()).runs, runsAfter);
      assert.equal(hTarget.raw(), rawBeforeSecondArrival, `Second arrival raw must be byte-exact for ${c.name}`);
      assert.equal(hTarget.writes.length, writesCountBeforeSecondArrival, `Second arrival writes count must be stable for ${c.name}`);
    }

    // 3. Unrelated scene arrival cancels pending without ledger booking
    {
      const hUnrelated = createAhHarness({ initialStore: c.raw, initialScene: c.pending.source });
      hUnrelated.clearTimers();
      hUnrelated.arrive('unrelated-scene-hash');
      const st = plainJson(hUnrelated.get());
      assert.equal(st.pending, null, `Pending must be cancelled on unrelated scene arrival for ${c.name}`);
      if (c.pending.kind === 'wake') {
        assert.equal(st.runs, 0, 'No run booking on cancelled wake');
        assert.deepEqual(st.endings, []);
      }
    }
  }

  // PH flags stubs gate protection: pending stub and activePrint stub tested separately
  const testCasePh = actualCases[0];
  const phStubs = [
    { name: 'phPending', flags: { phPending: { kind: 'print' }, phActivePrint: null } },
    { name: 'phActivePrint', flags: { phPending: null, phActivePrint: { outcome: 'test-print' } } },
  ];

  for (const { name: stubName, flags: stubFlags } of phStubs) {
    // Baseline harness: assert positive availability before locking flags
    const hBasePh = createAhHarness({ initialStore: testCasePh.raw, initialScene: testCasePh.pending.source });
    assert.equal(hBasePh.canHotel(), true, `Hotel must be visitable before ${stubName} lock`);

    // Blocked harness with specific stub
    const hPhBlocked = createAhHarness({
      initialStore: testCasePh.raw,
      initialScene: testCasePh.pending.source,
      phFlags: {
        phUnlocked: true,
        phAvailable: true,
        phEndings: [...PH_ENDING_IDS],
        ...stubFlags,
      },
    });

    const rawBeforePh = hPhBlocked.raw();
    const writesBeforePh = hPhBlocked.writes.length;

    // Getter still reads state
    const stBlocked = plainJson(hPhBlocked.get());
    assert.ok(stBlocked.pending, `Pending must be readable despite ${stubName}`);
    assert.equal(hPhBlocked.canHotel(), false, `Hotel canVisit must return false under ${stubName}`);
    assert.equal(hPhBlocked.canClockroom(), false, `Clockroom canVisit must return false under ${stubName}`);
    assert.equal(hPhBlocked.canVeranda(), false, `Veranda canVisit must return false under ${stubName}`);

    // Attempt unrelated arrival + replay under busy stub: no raw/pending/writes loss
    hPhBlocked.arrive('unrelated-scene-hash');
    hPhBlocked.replay(testCasePh.pending.source);
    assert.equal(hPhBlocked.raw(), rawBeforePh, `Raw state must not mutate on arrival/replay under ${stubName}`);
    assert.equal(hPhBlocked.writes.length, writesBeforePh, `No writes on arrival/replay under ${stubName}`);
    assert.deepEqual(plainJson(hPhBlocked.get().pending), testCasePh.pending, `Pending must not be cleared under ${stubName}`);
  }
});

test('Group 10: Four serial results + repeat runs 5, ending dedup 4, latest updated, gallery titles and 22 quiet keys isolation', () => {
  // Scope: 22 quiet keys are arbitrary tokens for upstream write isolation, not canonical upstream contract
  const h = createAhHarness({ initialScene: 'threshold' });

  // Baseline 22 upstream quiet keys
  QUIET_22_KEYS.forEach((k) => {
    h.mem.set(k, JSON.stringify({ version: 1, sampleData: k }));
  });
  const quietSnapshots = new Map();
  QUIET_22_KEYS.forEach((k) => quietSnapshots.set(k, h.mem.get(k)));

  // Drive all 4 endings in series
  const endingScenarios = [
    { name: 'dawn-waited-outside-the-doors', clocks: [3, 2, 1], target: 'unending-gallery' },
    { name: 'you-woke-in-a-borrowed-morning', clocks: [0, 1, 5], target: 'threshold' },
    { name: 'someone-woke-on-your-behalf', clocks: [1, 0, 5], target: 'remembrance' },
    { name: 'three-rooms-shared-one-dawn', clocks: [0, 0, 0], target: 'unending-gallery' },
  ];

  const oracle = generateIndependent36Oracle();

  for (let i = 0; i < 4; i++) {
    const sc = endingScenarios[i];
    // Entry
    h.setScene('threshold');
    h.click('ah-entry-threshold', true);
    h.clearTimers();
    h.arrive(AH_HOTEL);

    // New start
    h.click('ah-new', true);
    h.clearTimers();
    h.arrive(AH_CLOCKROOM);

    // BFS loans to reach clocks
    const k = `${sc.clocks[0]},${sc.clocks[1]},${sc.clocks[2]}`;
    const path = oracle.shortestPaths.get(k);
    for (const step of path) {
      h.click(BORROW_BTN_MAP[`${step.from},${step.to}`], true);
    }

    // Preview
    h.click('ah-preview-btn', true);
    h.clearTimers();
    h.arrive(AH_VERANDA);

    // Wake
    h.click('ah-wake', true);
    h.clearTimers();
    h.arrive(sc.target);

    // Check receipt node text at actual arrival
    const receiptNode = h.getNode(`ah-wake-receipt-title-${sc.target}`);
    assert.ok(receiptNode, `Receipt title node must exist for target ${sc.target}`);
    assert.ok(receiptNode.textContent.includes(AH_ENDING_TABLE[sc.name].title), `Receipt title node must contain ${AH_ENDING_TABLE[sc.name].title}`);

    // Verify run booked & activeWake set
    const stMid = plainJson(h.get());
    assert.equal(stMid.runs, i + 1);
    assert.equal(stMid.endings.length, i + 1);
    assert.ok(stMid.activeWake);
    assert.equal(stMid.activeWake.outcome, sc.name);
    assert.deepEqual(stMid.latestClocksByEnding[sc.name], sc.clocks);

    // Return to hotel
    h.click(`ah-wake-return-${sc.target}`, true);
    h.clearTimers();
    h.arrive(AH_HOTEL);
    assert.equal(plainJson(h.get()).activeWake, null);
  }

  // 5th run: Repeat 'someone-woke-on-your-behalf' with DIFFERENT configuration [2, 0, 4]
  {
    h.setScene(AH_HOTEL);
    h.sync();
    h.click('ah-new', true);
    h.clearTimers();
    h.arrive(AH_CLOCKROOM);

    const k = '2,0,4';
    const path = oracle.shortestPaths.get(k);
    for (const step of path) {
      h.click(BORROW_BTN_MAP[`${step.from},${step.to}`], true);
    }

    h.click('ah-preview-btn', true);
    h.clearTimers();
    h.arrive(AH_VERANDA);
    h.click('ah-wake', true);
    h.clearTimers();
    h.arrive('remembrance');

    const receiptNote = h.getNode('ah-wake-receipt-note-remembrance');
    assert.ok(receiptNote.textContent.includes('2 号房（未见面的旅人）'), 'Receipt note must specify 2 号房 for [2,0,4]');

    const st5 = plainJson(h.get());
    assert.equal(st5.runs, 5);
    assert.equal(st5.endings.length, 4, 'Endings must dedup to 4');
    // Latest updated for someone-woke-on-your-behalf to [2,0,4]
    assert.deepEqual(st5.latestClocksByEnding['someone-woke-on-your-behalf'], [2, 0, 4]);
    // Other 3 remain identical
    assert.deepEqual(st5.latestClocksByEnding['dawn-waited-outside-the-doors'], [3, 2, 1]);
    assert.deepEqual(st5.latestClocksByEnding['you-woke-in-a-borrowed-morning'], [0, 1, 5]);
    assert.deepEqual(st5.latestClocksByEnding['three-rooms-shared-one-dawn'], [0, 0, 0]);

    h.click('ah-wake-return-remembrance', true);
    h.clearTimers();
    h.arrive(AH_HOTEL);
  }

  // Verify gallery titles differentiation (Ending 0 vs Ending 3 both in unending-gallery)
  assert.equal(AH_ENDING_TABLE['dawn-waited-outside-the-doors'].receiptTitle, '晨铃签收 · 天亮留在门外');
  assert.equal(AH_ENDING_TABLE['three-rooms-shared-one-dawn'].receiptTitle, '晨铃签收 · 三间房共用一次天亮');

  // Verify 22 quiet keys remain byte-identical
  for (const k of QUIET_22_KEYS) {
    assert.equal(h.mem.get(k), quietSnapshots.get(k), `Quiet key ${k} must remain untouched`);
  }
});

test('Group 11: Missing latest codex safety, 4 geometry cells, v105 text hook, active wake links and transaction guards', () => {
  const h = createAhHarness({ initialScene: 'remembrance' });
  const st = plainJson(h.get());
  st.endings = ['dawn-waited-outside-the-doors'];
  // Corrupt / omit latest
  st.latestClocksByEnding = {};
  h.save(st);
  h.sync();

  const grid = h.getNode('ah-codex-grid');
  assert.ok(grid);
  const cells = grid.querySelectorAll('.ah-codex-cell');
  assert.equal(cells.length, 4);

  // Missing latest shows fallback safely without fake answer
  assert.ok(cells[0].textContent.includes('该结果暂无可读钟面'));
  assert.ok(cells[0].textContent.includes('天亮留在门外'));
  assert.ok(cells[1].textContent.includes('？？？'));

  // Complete all 4 endings -> reveals v105 text hook and populates 4 codex cells
  st.endings = [...AH_ENDING_IDS];
  st.latestClocksByEnding = {
    'dawn-waited-outside-the-doors': [3, 2, 1],
    'you-woke-in-a-borrowed-morning': [0, 1, 5],
    'someone-woke-on-your-behalf': [1, 0, 5],
    'three-rooms-shared-one-dawn': [0, 0, 0],
  };
  h.save(st);
  h.sync();

  const populatedCells = grid.querySelectorAll('.ah-codex-cell');
  assert.equal(populatedCells.length, 4);
  populatedCells.forEach((cell) => {
    assert.ok(cell.classList.contains('is-unlocked'));
    const cards = cell.querySelectorAll('.ah-clock-card');
    assert.equal(cards.length, 3, 'Each codex cell must render 3 clock cards');
  });

  // 4 Separate echo IDs
  AH_ENDING_IDS.forEach((endId) => {
    const echoNode = h.getNode(`ah-echo-${endId}`);
    assert.ok(echoNode, `Echo node #ah-echo-${endId} must exist`);
    assert.equal(echoNode.hidden, false);
    assert.ok(echoNode.textContent.includes(AH_ENDING_TABLE[endId].title));
  });

  const hook = h.getNode('ah-hook');
  assert.equal(hook.hidden, false);
  assert.ok(hook.textContent.includes('【只出售昨日的早餐铺】住客终于醒来，早餐却还停在昨天。'));

  // Active wake link precision
  st.activeWake = { outcome: 'three-rooms-shared-one-dawn', clocks: [0, 0, 0] };
  st.visited.hotel = true;
  h.save(st);
  h.sync();

  const wakeLink = h.getNode('ah-active-wake-link');
  assert.equal(wakeLink.hidden, false);
  assert.equal(wakeLink.getAttribute('href'), '#unending-gallery');

  // Clockroom & Veranda closed when activeWake exists
  assert.equal(h.canClockroom(), false);
  assert.equal(h.canVeranda(), false);
  assert.equal(h.canHotel(), true);
});

test('Group 12: Forget lifecycle, normalized source cleanup, timer clearing and DOM / aria-pressed reset', () => {
  // 1. Canonical entry generated from REAL native button callback
  const hEntry = createAhHarness({ initialScene: 'threshold' });
  hEntry.click('ah-entry-threshold', true);
  const canonicalRaw = hEntry.raw();
  const canonicalState = plainJson(hEntry.get());
  assert.ok(canonicalState.pending, 'Native click must produce pending');
  assert.equal(canonicalState.pending.source, 'threshold');

  // Assert accepted baseline in normalizer
  assert.deepEqual(plainJson(hEntry.normalizePending(canonicalState.pending, canonicalState)), canonicalState.pending);

  // Load canonical entry into test harness
  const h = createAhHarness({ initialStore: canonicalRaw, initialScene: AH_HOTEL });
  const st = plainJson(h.get());
  st.visited.hotel = true;
  st.visited.clockroom = true;
  st.visited.veranda = true;
  st.endings = [...AH_ENDING_IDS];
  st.runs = 10;
  h.save(st);
  h.sync();

  // Snapshot writes BEFORE forget
  const writesBeforeForget = h.writes.length;

  // Set aria-pressed on some buttons
  h.getNode('ah-new').setAttribute('aria-pressed', 'true');
  h.getNode('ah-preview-btn').setAttribute('aria-pressed', 'true');

  // Schedule timers: AH scenes + pending source + unrelated scope
  h.schedules.push({ from: AH_HOTEL, to: AH_CLOCKROOM });
  h.schedules.push({ from: 'threshold', to: AH_HOTEL });
  h.schedules.push({ from: 'unrelated-unending-gallery', to: 'unrelated' });

  // Forget state
  h.forget();

  // Storage key removed
  assert.equal(h.mem.get(AH_KEY), undefined);

  // Timers: AH scenes and threshold pending source cleared, unrelated preserved
  assert.equal(h.schedules.some((s) => s.from === AH_HOTEL), false);
  assert.equal(h.schedules.some((s) => s.from === 'threshold'), false);
  assert.equal(h.schedules.some((s) => s.from === 'unrelated-unending-gallery'), true);

  // Buttons and aria-pressed reset
  assert.equal(h.getNode('ah-new').getAttribute('aria-pressed'), 'false');
  assert.equal(h.getNode('ah-preview-btn').getAttribute('aria-pressed'), 'false');

  // Memory & codex hidden
  assert.equal(h.getNode('ah-memory').hidden, true);
  assert.equal(h.getNode('ah-codex').hidden, true);

  // Getter returns fresh default without writing to storage; forget+get doesn't save
  const freshGet = plainJson(h.get());
  assert.equal(freshGet.runs, 0);
  assert.deepEqual(freshGet.endings, []);
  assert.equal(h.writes.length, writesBeforeForget, 'forget + get must not issue any new writes');

  // 2. Forged raw source case: cannot clear unrelated old timer; normalized pending is null, own key removed only, foreign mem unaffected
  const hForged = createAhHarness();
  const foreignKey = 'goddead_v103_shadowless_photography';
  const foreignVal = JSON.stringify({ version: 103, preserved: true });
  hForged.mem.set(foreignKey, foreignVal);

  // Forged raw pending with invalid source and tampered structure
  const forgedRaw = JSON.stringify({
    version: 104,
    visited: { hotel: true, clockroom: false, veranda: false },
    draft: { clocks: [3, 2, 1] },
    pending: { kind: 'entry', source: 'unrelated-old-source', target: AH_HOTEL, feedback: 'Forged' },
  });
  hForged.mem.set(AH_KEY, forgedRaw);

  // Assert normalizePending normalizes forged pending to null
  const forgedParsed = JSON.parse(forgedRaw);
  assert.equal(hForged.normalizePending(forgedParsed.pending, forgedParsed), null);

  // Schedule unrelated old timer
  hForged.schedules.push({ from: 'unrelated-old-source', to: AH_HOTEL });
  hForged.schedules.push({ from: 'other-foreign-scene', to: 'nowhere' });

  // Forget forged
  hForged.forget();

  // AH_KEY removed, but foreign key completely unaffected
  assert.equal(hForged.mem.get(AH_KEY), undefined);
  assert.equal(hForged.mem.get(foreignKey), foreignVal);

  // Unrelated old source timer was NOT cleared because canonical pending source was null/invalid
  assert.equal(hForged.schedules.some((s) => s.from === 'unrelated-old-source'), true);
  assert.equal(hForged.schedules.some((s) => s.from === 'other-foreign-scene'), true);
});

// ----------------------------------------------------------------------------
// TEST GROUPS 13 TO 15 (INTEGRATION, RESOLVE DELEGATES, GUIDE & LIFECYCLE)
// ----------------------------------------------------------------------------

test('Group 13: Full resolveScene integration with real AH guard delegates, pending bridges, governance mutations and gallery routing', () => {
  // Extract exact resolveScene source body from script.js
  const resolveStart = scriptSource.indexOf('const resolveScene = (name) => {');
  assert.ok(resolveStart !== -1, 'Must find resolveScene declaration in script.js');
  const resolveEnd = scriptSource.indexOf('\n  };', resolveStart);
  assert.ok(resolveEnd !== -1, 'Must find resolveScene closing in script.js');
  const actualResolveSource = scriptSource.slice(resolveStart, resolveEnd + '\n  };'.length);

  // Clean the v103 prelude by removing ONLY the four AH test stub declarations
  // (wakeForAnotherHotelBridgeAllows, ahHotelCanVisit, borrowedDawnClockroomCanVisit, sharedMorningVerandaCanVisit)
  // so they can be injected as dynamic newFunction parameters / runtime delegates.
  const oldPreludeRaw = `
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
    let mockGov = { hudUnlocked: true, rulings: { acting: false, offering: false } };
    let parseAndValidateGovernance = () => mockGov;
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
    const weatherlessShelterBridgeAllows = () => false;
    const shadowlessPhotographyBridgeAllows = () => false;
    const endingReturnCanVisitGallery = () => false;
    const endingReturnCanVisitOffice = () => false;
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
    const wsHallCanVisit = () => true;
    const seasonDispatchBoardCanVisit = () => true;
    const fourSeasonPlatformCanVisit = () => true;
    const shadowlessPhotoStudioCanVisit = () => true;
    const doubleExposureCameraCanVisit = () => true;
    const unreceivedShadowDarkroomCanVisit = () => true;
  `;

  // Function builder executing resolveScene with dynamic delegates
  function buildRunner(h, govState = { hudUnlocked: true, rulings: { acting: false, offering: false } }) {
    const fnBody = `
      ${oldPreludeRaw}
      mockGov = ${JSON.stringify(govState)};
      const yesterdayBreakfastBridgeAllows = () => false;
      const ybShopCanVisit = () => false;
      const breakfastCounterCanVisit = () => false;
      const ybCourtCanVisit = () => false;
      const todayPressBridgeAllows = () => false;
      const tsPressCanVisit = () => false;
      const composingStoneCanVisit = () => false;
      const tsCourtCanVisit = () => false;
      const inkMixingBridgeAllows = () => false;
      const mxRoomCanVisit = () => false;
      const mixingDishCanVisit = () => false;
      const mxCourtCanVisit = () => false;
      const borrowedLightBridgeAllows = () => false;
      const lbOfficeCanVisit = () => false;
      const mirrorFloorCanVisit = () => false;
      const lbCourtCanVisit = () => false;
      const exactTeaBridgeAllows = () => false;
      const etHouseCanVisit = () => false;
      const pouringTableCanVisit = () => false;
      const etCourtCanVisit = () => false;
      const lastSweepBridgeAllows = () => false;
      const swOfficeCanVisit = () => false;
      const dustFloorCanVisit = () => false;
      const swCourtCanVisit = () => false;
      const puttingBackBridgeAllows = () => false;
      const pbOfficeCanVisit = () => false;
      const markedFloorCanVisit = () => false;
      const pbCourtCanVisit = () => false;
      const paperCutBridgeAllows = () => false;
      const pcOfficeCanVisit = () => false;
      const cuttingTableCanVisit = () => false;
      const pcCourtCanVisit = () => false;
      const clearedOfferingsBridgeAllows = () => false;
      const coRoomCanVisit = () => false;
      const offeringStandsCanVisit = () => false;
      const coCourtCanVisit = () => false;
      ${actualResolveSource}
      return resolveScene(targetSceneName);
    `;
    const runner = new Function(
      'targetSceneName',
      'wakeForAnotherHotelBridgeAllows',
      'ahHotelCanVisit',
      'borrowedDawnClockroomCanVisit',
      'sharedMorningVerandaCanVisit',
      'location',
      'history',
      fnBody
    );

    return (target) => {
      const loc = { hash: '#' + target };
      const hist = {
        replaceState(_st, _t, url) {
          loc.hash = url;
        },
      };
      const res = runner(
        target,
        (s) => h.bridge(s),
        () => h.canHotel(),
        () => h.canClockroom(),
        () => h.canVeranda(),
        loc,
        hist
      );
      return { resolved: res, finalHash: loc.hash };
    };
  }

  // 1. Locked cold routing -> all 3 new scenes fallback to remembrance
  {
    const hLocked = createAhHarness({
      phFlags: { phUnlocked: false, phAvailable: false, phPending: null, phActivePrint: null, phEndings: [] },
    });
    // Governance guards run earlier than new AH route guards. Target scene fallback to remembrance occurs late
    // without recursive governance re-pass. Therefore locked new scenes return 'remembrance' and hash '#remembrance'.
    const resolveCtx1 = buildRunner(hLocked, { hudUnlocked: true, rulings: { acting: false, offering: false } });
    for (const scene of [AH_HOTEL, AH_CLOCKROOM, AH_VERANDA]) {
      const { resolved, finalHash } = resolveCtx1(scene);
      assert.equal(resolved, 'remembrance');
      assert.equal(finalHash, '#remembrance');
    }

    const resolveCtx2 = buildRunner(hLocked, { hudUnlocked: true, rulings: { acting: true, offering: false } });
    for (const scene of [AH_HOTEL, AH_CLOCKROOM, AH_VERANDA]) {
      const { resolved, finalHash } = resolveCtx2(scene);
      assert.equal(resolved, 'remembrance');
      assert.equal(finalHash, '#remembrance');
    }

    // Direct resolve('remembrance') before AH guards continues to observe governance rulings
    assert.equal(resolveCtx1('remembrance').resolved, 'acting');
    assert.equal(resolveCtx2('remembrance').resolved, 'offering');

    // With governance satisfied, locked fallback remains 'remembrance'
    const resolveGovDone = buildRunner(hLocked, { hudUnlocked: true, rulings: { acting: true, offering: true } });
    for (const scene of [AH_HOTEL, AH_CLOCKROOM, AH_VERANDA]) {
      const { resolved, finalHash } = resolveGovDone(scene);
      assert.equal(resolved, 'remembrance');
      assert.equal(finalHash, '#remembrance');
    }
  }

  // 2. Canonical pending-first: visited cannot override pending lock
  {
    const nativeCases = captureActualAhPendingCases();
    const wakeOtherCase = nativeCases.find((c) => c.pending.kind === 'wake' && c.pending.outcome === 'someone-woke-on-your-behalf');
    assert.ok(wakeOtherCase, 'Must find captured native someone-woke-on-your-behalf pending case');

    const hPending = createAhHarness({ initialStore: wakeOtherCase.raw, initialScene: AH_VERANDA });
    const normPending = hPending.normalizePending(wakeOtherCase.pending, hPending.get());
    assert.ok(normPending, 'normalizePending must accept captured native wake');
    assert.equal(normPending.outcome, 'someone-woke-on-your-behalf');
    assert.ok(hPending.get().pending, 'Pending must be non-null in store');

    const st = plainJson(hPending.get());
    st.visited.hotel = true;
    st.visited.clockroom = true;
    st.visited.veranda = true;
    hPending.save(st);

    // Pending wake allows exact pending target 'remembrance' and pending source AH_VERANDA
    assert.equal(hPending.canHotel(), false);
    assert.equal(hPending.canClockroom(), false);
    assert.equal(hPending.canVeranda(), true);
    assert.equal(hPending.bridge('remembrance'), true);

    const resolve = buildRunner(hPending, { hudUnlocked: true, rulings: { acting: true, offering: true } });
    assert.equal(resolve('remembrance').resolved, 'remembrance');
    assert.equal(resolve(AH_HOTEL).resolved, 'remembrance');
    assert.equal(resolve(AH_CLOCKROOM).resolved, 'remembrance');
    assert.equal(resolve(AH_VERANDA).resolved, AH_VERANDA);
  }

  // 3. Four endings native BFS setups -> canonical wake captured, accepted -> exact target allowed
  const oracle = generateIndependent36Oracle();
  const testEndings = [
    { id: 'dawn-waited-outside-the-doors', clocks: [3, 2, 1], target: 'unending-gallery' },
    { id: 'you-woke-in-a-borrowed-morning', clocks: [0, 1, 5], target: 'threshold' },
    { id: 'someone-woke-on-your-behalf', clocks: [1, 0, 5], target: 'remembrance' },
    { id: 'three-rooms-shared-one-dawn', clocks: [0, 0, 0], target: 'unending-gallery' },
  ];

  for (const item of testEndings) {
    const h = createAhHarness({ initialScene: 'threshold' });
    h.click('ah-entry-threshold', true);
    h.clearTimers();
    h.arrive(AH_HOTEL);
    h.click('ah-new', true);
    h.clearTimers();
    h.arrive(AH_CLOCKROOM);

    const k = `${item.clocks[0]},${item.clocks[1]},${item.clocks[2]}`;
    const path = oracle.shortestPaths.get(k);
    for (const step of path) {
      h.click(BORROW_BTN_MAP[`${step.from},${step.to}`], true);
    }
    h.click('ah-preview-btn', true);
    h.clearTimers();
    h.arrive(AH_VERANDA);

    // Click native wake
    h.click('ah-wake', true);
    const p = plainJson(h.get().pending);
    assert.ok(p);
    assert.equal(p.kind, 'wake');
    assert.equal(p.target, item.target);

    // Real AH bridge exercises across both governance ruling states
    if (item.target === 'remembrance') {
      const resolveGovCtx1 = buildRunner(h, { hudUnlocked: true, rulings: { acting: false, offering: false } });
      const resolveGovCtx2 = buildRunner(h, { hudUnlocked: true, rulings: { acting: true, offering: false } });
      assert.equal(resolveGovCtx1('remembrance').resolved, 'remembrance', 'AH bridge must bypass acting guard when pending wake target is remembrance');
      assert.equal(resolveGovCtx2('remembrance').resolved, 'remembrance', 'AH bridge must bypass offering guard when pending wake target is remembrance');

      const hBaseClean = createAhHarness({ initialScene: 'threshold' });
      const baseResolve1 = buildRunner(hBaseClean, { hudUnlocked: true, rulings: { acting: false, offering: false } });
      const baseResolve2 = buildRunner(hBaseClean, { hudUnlocked: true, rulings: { acting: true, offering: false } });
      assert.equal(baseResolve1('remembrance').resolved, 'acting');
      assert.equal(baseResolve2('remembrance').resolved, 'offering');
    }

    const resolveGov = buildRunner(h, { hudUnlocked: true, rulings: { acting: true, offering: true } });
    assert.equal(resolveGov(p.target).resolved, item.target, `Exact target ${item.target} must be bridged by resolveScene`);

    // Arrive at target -> activeWake set
    h.clearTimers();
    h.arrive(p.target);
    assert.ok(plainJson(h.get()).activeWake);
    assert.equal(resolveGov(p.target).resolved, item.target, `Active wake must continue to bridge ${item.target}`);

    // Return to hotel
    h.click(`ah-wake-return-${item.target}`, true);
    assert.equal(resolveGov(AH_HOTEL).resolved, AH_HOTEL);
    h.clearTimers();
    h.arrive(AH_HOTEL);
    assert.equal(plainJson(h.get()).activeWake, null);

    // Completed lastOutcome narrow bridge
    assert.equal(resolveGov(item.target).resolved, item.target);

    // Temporary unavailable denies bridge under both governance contexts and gallery stub
    h.flags.phAvailable = false;
    assert.equal(h.bridge(item.target), false);
    const resolveUnavailCtx1 = buildRunner(h, { hudUnlocked: true, rulings: { acting: false, offering: false } });
    const resolveUnavailCtx2 = buildRunner(h, { hudUnlocked: true, rulings: { acting: true, offering: false } });
    if (item.target === 'remembrance') {
      assert.equal(resolveUnavailCtx1('remembrance').resolved, 'acting');
      assert.equal(resolveUnavailCtx2('remembrance').resolved, 'offering');
    } else if (item.target === 'unending-gallery') {
      assert.equal(resolveUnavailCtx1('unending-gallery').resolved, 'remembrance');
      assert.equal(resolveUnavailCtx2('unending-gallery').resolved, 'remembrance');
    }
    h.flags.phAvailable = true;
  }

  // 4. Two gallery results distinguish actual unique panel managed by core
  assert.equal(AH_ENDING_TABLE['dawn-waited-outside-the-doors'].target, 'unending-gallery');
  assert.equal(AH_ENDING_TABLE['three-rooms-shared-one-dawn'].target, 'unending-gallery');
  assert.notEqual(AH_ENDING_TABLE['dawn-waited-outside-the-doors'].title, AH_ENDING_TABLE['three-rooms-shared-one-dawn'].title);

  // 5. Real 2 governance branches and baseline resolution without AH bridge
  {
    const hGov = createAhHarness();
    // Context 1: acting is false -> resolves to acting
    const resolve1 = buildRunner(hGov, { hudUnlocked: true, rulings: { acting: false, offering: false } });
    assert.equal(resolve1('remembrance').resolved, 'acting');

    // Context 2: acting is true, offering is false -> resolves to offering
    const resolve2 = buildRunner(hGov, { hudUnlocked: true, rulings: { acting: true, offering: false } });
    assert.equal(resolve2('remembrance').resolved, 'offering');

    // Context 3: both rulings satisfied -> remembrance passes
    const resolve3 = buildRunner(hGov, { hudUnlocked: true, rulings: { acting: true, offering: true } });
    assert.equal(resolve3('remembrance').resolved, 'remembrance');
  }
});

test('Group 14: progressEntryButton exact anchor extraction, HTMLRegistry balanced ancestor, and AH/PH progress helpers', () => {
  // 1. Compile and assert ACTUAL progressEntryButton precisely from scriptSource
  const peMarker = 'const progressEntryButton = (prefix) =>';
  const peIdx = scriptSource.indexOf(peMarker);
  assert.ok(peIdx !== -1, 'progressEntryButton marker must exist in script.js');
  const peEndIdx = scriptSource.indexOf(';', peIdx);
  const progressEntryButtonSource = scriptSource.slice(peIdx, peEndIdx + 1);

  // Assert it's the exact unique one-line arrow function ending with semicolon
  assert.ok(progressEntryButtonSource.includes('prefix === "ah" ? $("#ah-entry-remembrance")'));
  assert.ok(!progressEntryButtonSource.includes('\n  };'));

  const mockHarness = createAhHarness();
  const peFn = new Function('$', `return (${progressEntryButtonSource.slice('const progressEntryButton = '.length, -1)});`)((sel) => {
    if (typeof sel === 'string' && sel.startsWith('#')) {
      const node = mockHarness.getNode(sel.slice(1));
      if (node) return node;
    }
    return null;
  });

  assert.equal(peFn('ah'), mockHarness.getNode('ah-entry-remembrance'));
  assert.equal(peFn('ph'), mockHarness.getNode('ph-entry-remembrance'));
  assert.equal(peFn('ws'), mockHarness.getNode('ws-entry-remembrance'));
  assert.equal(peFn('dw'), mockHarness.getNode('dw-entry-remembrance'));
  assert.equal(peFn('wk'), mockHarness.getNode('wk-entry-btn'));
  assert.equal(peFn('unknown-prefix'), null);

  // Header exact unique occurrence in scriptSource
  const peHeaderMatches = scriptSource.match(/const progressEntryButton = \(prefix\) =>/g) || [];
  assert.equal(peHeaderMatches.length, 1);

  // 2. Real HTMLRegistry balanced ancestor proof for #ah-entry-remembrance in #ah-codex in #scene-remembrance
  const tokens = htmlSource.match(/<\/?([a-zA-Z0-9\-]+)([^>]*)>/g) || [];
  const stack = [];
  let remembranceEntryAncestors = null;

  for (const token of tokens) {
    const isClosing = token.startsWith('</');
    const isSelfClosing = token.endsWith('/>');
    const tagMatch = token.match(/<\/?([a-zA-Z0-9\-]+)/);
    if (!tagMatch) continue;
    const tag = tagMatch[1].toLowerCase();
    if (['img', 'meta', 'link', 'br', 'hr', 'input'].includes(tag)) continue;

    if (isClosing) {
      stack.pop();
    } else {
      const idMatch = token.match(/\bid=["']([^"']+)["']/);
      const elemId = idMatch ? idMatch[1] : '';
      if (elemId === 'ah-entry-remembrance') {
        remembranceEntryAncestors = stack.map((s) => s.id).filter(Boolean);
        break;
      }
      if (!isSelfClosing) {
        stack.push({ tag, id: elemId });
      }
    }
  }
  assert.ok(remembranceEntryAncestors);
  assert.ok(remembranceEntryAncestors.includes('ah-codex'));
  assert.ok(remembranceEntryAncestors.includes('scene-remembrance'));

  // 3. Compile ACTUAL AHhelper and PHhelper using explicit state/table stubs
  const ahHelperStart = scriptSource.indexOf('const wakeForAnotherHotelProgressStep = () => {');
  const ahHelperEnd = scriptSource.indexOf('const shadowlessPhotographyProgressStep = () => {');
  const actualAHHelperSource = scriptSource.slice(ahHelperStart, ahHelperEnd);

  const phHelperStart = ahHelperEnd;
  const phHelperEnd = scriptSource.indexOf('const weatherlessShelterProgressStep = () => {');
  const actualPHHelperSource = scriptSource.slice(phHelperStart, phHelperEnd);

  const guideScope = {
    ahUnlocked: true,
    ahAvailable: true,
    ahState: {
      visited: { hotel: false, clockroom: false, veranda: false },
      draft: { clocks: [3, 2, 1] },
      endings: [],
      latestClocksByEnding: {},
      runs: 0,
      lastOutcome: '',
      activeWake: null,
      pending: null,
    },
    phUnlocked: true,
    phAvailable: true,
    phState: {
      visited: { studio: true, camera: true, darkroom: true },
      endings: [...PH_ENDING_IDS],
      latestPairByEnding: {},
      runs: 4,
      lastOutcome: '',
      activePrint: null,
      pending: null,
    },
    wsState: { activePassenger: null, pending: null },
    dwState: { activeCourier: null, pending: null },
    hwState: { pending: null },
  };

  const PH_ENDING_TABLE = {
    'absence-shared-a-portrait': { title: '缺席共用了一张肖像', placeName: '痕迹室', category: '双重缺席' },
    'one-visitor-kept-two-shadows': { title: '一人留下两道影子', placeName: '门外', category: '双重实像' },
    'the-shadow-attended-in-your-place': { title: '影子替你赴约', placeName: '无终局陈列廊', category: '实像在前' },
    'nobody-was-kept-in-the-frame': { title: '画框未留一人', placeName: '无终局陈列廊', category: '虚像在前' },
  };

  const runnerContext = vm.createContext({
    wakeForAnotherHotelUnlocked: () => guideScope.ahUnlocked,
    yesterdayBreakfastUnlocked: () => false,
    wakeForAnotherHotelAvailable: () => guideScope.ahAvailable,
    getWakeForAnotherHotel: () => guideScope.ahState,
    shadowlessPhotographyUnlocked: () => guideScope.phUnlocked,
    shadowlessPhotographyAvailable: () => guideScope.phAvailable,
    getShadowlessPhotography: () => guideScope.phState,
    getWeatherlessShelter: () => guideScope.wsState,
    getDawnWeaving: () => guideScope.dwState,
    getHundredthWake: () => guideScope.hwState,
    AH_ENDING_IDS,
    AH_ENDING_TABLE,
    PH_ENDING_IDS,
    PH_ENDING_TABLE,
    WS_ENDING_TABLE: { 1: { placeName: '候车亭' } },
  });

  vm.runInContext(
    `
    ${actualAHHelperSource}
    ${actualPHHelperSource}
    globalThis.ahProgress = wakeForAnotherHotelProgressStep;
    globalThis.phProgress = shadowlessPhotographyProgressStep;
  `,
    runnerContext
  );

  // AH Unlocked false -> null
  guideScope.ahUnlocked = false;
  assert.equal(runnerContext.ahProgress(), null);
  guideScope.ahUnlocked = true;

  // Unvisited hotel -> initial prompt
  guideScope.ahState.visited.hotel = false;
  assert.equal(runnerContext.ahProgress().target, 'ah');
  assert.ok(runnerContext.ahProgress().items[0].includes('入住'));

  // Visited hotel, unvisited clockroom -> clockroom prompt
  guideScope.ahState.visited.hotel = true;
  guideScope.ahState.visited.clockroom = false;
  assert.ok(runnerContext.ahProgress().items[0].includes('铜门'));

  // Visited clockroom -> missing endings prompt
  guideScope.ahState.visited.clockroom = true;
  assert.ok(runnerContext.ahProgress().items[0].includes('尚未听见的晨门唤醒'));

  // Pending takes precedence
  guideScope.ahState.pending = { kind: 'wake', source: AH_VERANDA, target: 'threshold' };
  assert.ok(runnerContext.ahProgress().items[0].includes('旅馆事务正在进行'));
  guideScope.ahState.pending = null;

  // Active wake prompt
  guideScope.ahState.activeWake = { outcome: 'someone-woke-on-your-behalf', clocks: [1, 0, 5] };
  assert.ok(runnerContext.ahProgress().items[0].includes('痕迹室'));
  guideScope.ahState.activeWake = null;

  // Completed all 4 -> v105 text hook
  guideScope.ahState.endings = [...AH_ENDING_IDS];
  const completedStep = runnerContext.ahProgress();
  assert.equal(completedStep.done, true);
  assert.equal(completedStep.target, null);
  assert.ok(completedStep.items[0].includes('【只出售昨日的早餐铺】'));

  // PH complete delegates to AH helper
  const phResult = runnerContext.phProgress();
  assert.equal(phResult.done, true);
  assert.ok(phResult.items[0].includes('【只出售昨日的早餐铺】'));

  // PH pending / active retains precedence
  guideScope.phState.activePrint = { outcome: 'absence-shared-a-portrait' };
  const phActiveResult = runnerContext.phProgress();
  assert.equal(phActiveResult.target, 'ph');
  assert.ok(phActiveResult.items[0].includes('有一张照片已送往'));
});

test('Group 15: Source lifecycle contracts, sceneInit PH->AH->Guide->HUD chaining, bootstrap order, and syncPhEntries', () => {
  // 1. Unique 3 route guards in scriptSource
  const hotelGuardMatches = scriptSource.match(/if \(target === "wake-for-another-hotel" && !ahHotelCanVisit\(\)\) target = "remembrance";/g) || [];
  const clockGuardMatches = scriptSource.match(/if \(target === "borrowed-dawn-clockroom" && !borrowedDawnClockroomCanVisit\(\)\) target = "remembrance";/g) || [];
  const verandaGuardMatches = scriptSource.match(/if \(target === "shared-morning-veranda" && !sharedMorningVerandaCanVisit\(\)\) target = "remembrance";/g) || [];
  assert.equal(hotelGuardMatches.length, 1);
  assert.equal(clockGuardMatches.length, 1);
  assert.equal(verandaGuardMatches.length, 1);

  // 2. Exact Governance and Gallery bridge terms count
  const govBridgeMatches = scriptSource.match(/!wakeForAnotherHotelBridgeAllows\(target\)/g) || [];
  const galleryBridgeMatches = scriptSource.match(/!wakeForAnotherHotelBridgeAllows\('unending-gallery'\)/g) || [];
  assert.equal(govBridgeMatches.length, 2, 'Must have 2 occurrences of AH bridge in governance block');
  assert.equal(galleryBridgeMatches.length, 1, 'Must have 1 occurrence of AH bridge in gallery block');

  // 3. Exact sceneInit PH resolve/replay -> AH resolve/replay -> guide -> HUD
  const initStart = scriptSource.indexOf('const sceneInit = (name) => {');
  assert.ok(initStart !== -1);
  const initEnd = scriptSource.indexOf('\n  };', initStart);
  const initSource = scriptSource.slice(initStart, initEnd + '\n  };'.length);

  const phResolveIdx = initSource.indexOf('resolveShadowlessPhotographyPendingOnArrival(name);');
  const phReplayIdx = initSource.indexOf('replayShadowlessPhotographyPending(name);');
  const ahResolveIdx = initSource.indexOf('resolveWakeForAnotherHotelPendingOnArrival(name);');
  const ahReplayIdx = initSource.indexOf('replayWakeForAnotherHotelPending(name);');
  const guideIdx = initSource.indexOf('if (name === "remembrance") syncProgressGuide();');
  const hudIdx = initSource.indexOf('updateHudDisplay();');

  assert.ok(phResolveIdx !== -1 && phReplayIdx !== -1);
  assert.ok(ahResolveIdx !== -1 && ahReplayIdx !== -1);
  assert.ok(guideIdx !== -1 && hudIdx !== -1);
  assert.ok(phResolveIdx < phReplayIdx);
  assert.ok(phReplayIdx < ahResolveIdx);
  assert.ok(ahResolveIdx < ahReplayIdx);
  assert.ok(ahReplayIdx < guideIdx);
  assert.ok(guideIdx < hudIdx);

  // 4. Exact bottom bootstrap: syncCauselessConsequenceRefugeeLinks -> PHsync -> AHsync -> revealScene -> syncDoorOpenState -> route
  const lastRefugeeSyncIdx = scriptSource.lastIndexOf('syncCauselessConsequenceRefugeeLinks();');
  assert.ok(lastRefugeeSyncIdx !== -1);
  const bootstrapChunk = scriptSource.slice(lastRefugeeSyncIdx, lastRefugeeSyncIdx + 1200);

  const phSyncIdx = bootstrapChunk.indexOf('syncShadowlessPhotographyAll();');
  const ahSyncIdx = bootstrapChunk.indexOf('syncWakeForAnotherHotelAll();');
  const revealIdx = bootstrapChunk.indexOf('revealScene(scenes.threshold);');
  const doorIdx = bootstrapChunk.indexOf('syncDoorOpenState();');
  const routeIdx = bootstrapChunk.indexOf('route();');

  assert.ok(phSyncIdx !== -1 && ahSyncIdx !== -1);
  assert.ok(revealIdx !== -1 && doorIdx !== -1 && routeIdx !== -1);
  assert.ok(phSyncIdx < ahSyncIdx);
  assert.ok(ahSyncIdx < revealIdx);
  assert.ok(revealIdx < doorIdx);
  assert.ok(doorIdx < routeIdx);

  // 5. Global forget exact chaining: PH -> AH -> codexFold
  const forgetPhIdx = scriptSource.indexOf('forgetShadowlessPhotographyState();');
  const forgetAhIdx = scriptSource.indexOf('forgetWakeForAnotherHotelState();');
  const forgetCodexIdx = scriptSource.indexOf('forgetCodexFolds();');
  assert.ok(forgetPhIdx !== -1 && forgetAhIdx !== -1 && forgetCodexIdx !== -1);
  assert.ok(forgetPhIdx < forgetAhIdx);
  assert.ok(forgetAhIdx < forgetCodexIdx);

  // 6. syncPhEntries calls syncAhEntries safely without recursion
  assert.ok(scriptSource.includes("if (typeof syncAhEntries === 'function') syncAhEntries();"));
  const ahSyncFnIdx = scriptSource.indexOf('function syncAhEntries(');
  assert.ok(ahSyncFnIdx !== -1);
  const ahSyncFnEnd = scriptSource.indexOf('\n}', ahSyncFnIdx);
  const ahSyncFnSource = scriptSource.slice(ahSyncFnIdx, ahSyncFnEnd);
  assert.equal(ahSyncFnSource.includes('syncPhEntries('), false, 'syncAhEntries must not recursively call syncPhEntries');

  // 7. Old v45 enterRelief condition retained exact existing narrow WS guard
  assert.ok(scriptSource.includes('if (RELIEF_SCENE_NAMES.includes(name) && !weatherlessShelterReliefReceiptContext(name)) enterRelief(RELIEF_NAME_SCENE[name]);'));
});
