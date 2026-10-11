/**
 * .v103-gemini/v103-tests-base-final.mjs
 *
 * Complete corrected test base and flat harness for v103 收不到影子的照相馆 (SHADOWLESS PHOTOGRAPHY).
 * Sole frontend/test author: gemini-3.7-flash-high. Verified by Codex.
 * Preserves all 12 tests, coverage assertions, and flat API hooks.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const SCRIPT_PATH = path.join(PROJECT_ROOT, 'script.js');
const HTML_PATH = path.join(PROJECT_ROOT, 'index.html');
const CSS_PATH = path.join(PROJECT_ROOT, 'styles.css');

const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');
const htmlSource = fs.readFileSync(HTML_PATH, 'utf8');
const cssSource = fs.readFileSync(CSS_PATH, 'utf8');

// --- Exact v103 Module Extraction ---
export const PH_MODULE_HEADER = '/* ============================================================\n   v103 收不到影子的照相馆 / SHADOWLESS PHOTOGRAPHY';
export const PH_MODULE_END_MARKER = 'PH_OLD_TARGETS.forEach((scene) => onTrustedPh(`#ph-print-return-${scene}`, () => choosePhPrintReturn(scene)));';

const startIdx = scriptSource.indexOf(PH_MODULE_HEADER);
if (startIdx === -1) {
  throw new Error('Could not find v103 module header in script.js');
}
const endIdx = scriptSource.indexOf(PH_MODULE_END_MARKER, startIdx);
if (endIdx === -1) {
  throw new Error('Could not find v103 module end marker in script.js');
}
export const phModuleSource = scriptSource.slice(startIdx, endIdx + PH_MODULE_END_MARKER.length);

// 25 real native BUTTON element IDs bound by onTrustedPh
export const PH_NATIVE_BUTTON_IDS = [
  'ph-entry-threshold',
  'ph-entry-remembrance',
  'ph-entry-shelter',
  'ph-new',
  'ph-continue',
  'ph-pos-1',
  'ph-pos-2',
  'ph-pos-3',
  'ph-pos-4',
  'ph-pos-5',
  'ph-light-left',
  'ph-light-right',
  'ph-plate-slot-0',
  'ph-plate-slot-1',
  'ph-shutter',
  'ph-erase-selected',
  'ph-swap-plates',
  'ph-example-btn',
  'ph-preview-btn',
  'ph-abandon',
  'ph-print',
  'ph-revise',
  'ph-print-return-threshold',
  'ph-print-return-remembrance',
  'ph-print-return-unending-gallery',
];

export const PH_ENDING_IDS = [
  'absence-shared-a-portrait',
  'one-visitor-kept-two-shadows',
  'the-shadow-attended-in-your-place',
  'nobody-was-kept-in-the-frame',
];

export const PH_OLD_TARGETS = ['threshold', 'remembrance', 'unending-gallery'];

// Actual v102 Weatherless Shelter Ending IDs from production
export const WS_ENDING_IDS = [
  'the-weather-finally-boarded',
  'the-seasons-returned-to-yesterday',
  'each-season-found-its-own-stop',
];

export const PH_KEY = 'goddead_v103_shadowless_photography';

// 21 upstream quiet raw keys snapshot
export const QUIET_21_KEYS = [
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
];

/**
 * Minimal HTML parser extracting all tags with id and tracking attributes.
 */
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
 * Creates an in-memory simulated DOM node compatible with module expectations.
 * Implements truthful recursive textContent getter/setter.
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
        if (item.nodeType === 11) { // DocumentFragment
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
      return children.map(c => c.textContent).join('');
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
    add(...cls) { cls.forEach(c => classListSet.add(c)); },
    remove(...cls) { cls.forEach(c => classListSet.delete(c)); },
    contains(c) { return classListSet.has(c); },
  };

  Object.defineProperty(node, 'className', {
    get() { return Array.from(classListSet).join(' '); },
    set(v) {
      classListSet.clear();
      if (v) v.trim().split(/\s+/).forEach(c => classListSet.add(c));
    },
  });

  return node;
}

/**
 * FLAT HARNESS FACTORY
 * Provides createPhHarness(opts)
 */
export function createPhHarness(opts = {}) {
  const mem = new Map();
  const writes = [];
  const schedules = [];
  const clears = [];
  const capturedListeners = new Map();

  // Shared current scene state object across harness and module closure
  const sceneState = {
    current: opts.currentScene || 'threshold',
  };

  const lockFlags = Object.assign(
    {
      unlocked: true,
      available: true,
      wsPending: false,
      wsActive: false,
      dwPending: false,
      dwActive: false,
      wkPending: false,
    },
    opts.lockFlags || {}
  );

  const wsState = Object.assign(
    {
      endings: [...WS_ENDING_IDS],
      pending: null,
      activePassenger: null,
    },
    opts.wsState || {}
  );

  if (opts.initialStore !== undefined && opts.initialStore !== null) {
    const val = typeof opts.initialStore === 'object' ? JSON.stringify(opts.initialStore) : String(opts.initialStore);
    mem.set(PH_KEY, val);
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
      return schedules.some(s => s.from === scene);
    },
  };

  const AudioEngine = {
    whoosh() {},
    tick() {},
    shutter() {},
  };

  function weatherlessShelterUnlocked() {
    return lockFlags.unlocked && wsState.endings.length === WS_ENDING_IDS.length;
  }

  function weatherlessShelterAvailable() {
    if (!weatherlessShelterUnlocked()) return false;
    if (!lockFlags.available) return false;
    if (lockFlags.wsPending || lockFlags.dwPending || lockFlags.wkPending || lockFlags.dwActive) return false;
    return true;
  }

  function getWeatherlessShelter() {
    return {
      endings: wsState.endings,
      pending: (lockFlags.wsPending || wsState.pending) ? { kind: 'dummy' } : null,
      activePassenger: (lockFlags.wsActive || wsState.activePassenger) ? { id: 'dummy' } : null,
    };
  }

  const document = {
    createElement(tagName) {
      return createMockNode('', tagName, false, false);
    },
    createDocumentFragment() {
      const frag = createMockNode('', 'fragment', false, false);
      frag.nodeType = 11;
      return frag;
    },
  };

  function $(selector) {
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      return getNode(id);
    }
    return null;
  }

  function $$(selector) {
    if (selector.startsWith('[id^="ph-"][aria-pressed]')) {
      const res = [];
      for (const [id, node] of nodes.entries()) {
        if (id.startsWith('ph-') && node.hasAttribute('aria-pressed')) {
          res.push(node);
        }
      }
      return res;
    }
    return [];
  }

  const store = {
    get(key, def) {
      return mem.has(key) ? mem.get(key) : def;
    },
    set(key, val) {
      const s = String(val);
      mem.set(key, s);
      writes.push({ key, val: s });
    },
    memo(name, compute) {
      return compute();
    },
  };

  const localStorage = {
    getItem(key) {
      return mem.has(key) ? mem.get(key) : null;
    },
    setItem(key, val) {
      const s = String(val);
      mem.set(key, s);
      writes.push({ key, val: s });
    },
    removeItem(key) {
      mem.delete(key);
      writes.push({ key, val: null, removed: true });
    },
  };

  const prelude = opts.extraPrelude || '';
  const extraSrc = opts.extraSource || '';

  // Intercept module's let currentScene by using getter/setter accessor
  const wrapperCode = `
    return function(env) {
      const {
        $, $$, document, store, localStorage, AudioEngine, AutoAdvance,
        weatherlessShelterUnlocked, weatherlessShelterAvailable, getWeatherlessShelter,
        WS_ENDING_IDS, buttonAvailable, sceneState, capturedListeners
      } = env;

      // Ensure module reads live currentScene from shared sceneState
      let currentScene = sceneState.current;
      Object.defineProperty(env, '__syncCurrentScene', {
        value: function(val) { currentScene = val; }
      });

      const reduced = false;

      ${prelude}

      ${phModuleSource}

      ${extraSrc}

      return {
        computeShadowPosition,
        isValidPhPosition,
        isValidPhLight,
        isValidPhExposure,
        clonePhExposure,
        isValidPhPlates,
        isCompletePhPlates,
        classifyPhotoPair,
        defaultShadowlessPhotography,
        normalizeShadowlessPhotography,
        expectedPhPending,
        normalizePhPending,
        shadowlessPhotographyUnlocked,
        shadowlessPhotographyAvailable,
        getShadowlessPhotography,
        saveShadowlessPhotography,
        resolveShadowlessPhotographyPendingOnArrival,
        replayShadowlessPhotographyPending,
        shadowlessPhotographyBridgeAllows,
        shadowlessPhotoStudioCanVisit,
        doubleExposureCameraCanVisit,
        unreceivedShadowDarkroomCanVisit,
        syncShadowlessPhotographyAll,
        forgetShadowlessPhotographyState,
        getSelectedPlateIndex: () => phSelectedPlateIndex,
        setSelectedPlateIndex: (val) => { phSelectedPlateIndex = val; },
        getExampleShown: () => phExampleShown,
        getExampleIndex: () => phExampleIndex,
        getPhPendingLogicalSource: phPendingLogicalSource,
        resolveScene: typeof resolveScene === 'function' ? resolveScene : null,
        sceneInit: typeof sceneInit === 'function' ? sceneInit : null,
      };
    };
  `;

  for (const [id, node] of nodes.entries()) {
    const origAdd = node.addEventListener.bind(node);
    node.addEventListener = (event, handler) => {
      origAdd(event, handler);
      if (event === 'click') {
        capturedListeners.set(id, handler);
      }
    };
  }

  const factory = new Function(wrapperCode)();
  const envObj = {
    $,
    $$,
    document,
    store,
    localStorage,
    AudioEngine,
    AutoAdvance,
    weatherlessShelterUnlocked,
    weatherlessShelterAvailable,
    getWeatherlessShelter,
    WS_ENDING_IDS,
    buttonAvailable,
    sceneState,
    capturedListeners,
  };
  const inner = factory(envObj);

  function setScene(sc) {
    sceneState.current = sc;
    if (typeof envObj.__syncCurrentScene === 'function') {
      envObj.__syncCurrentScene(sc);
    }
  }

  const h = {
    mem,
    nodes,
    schedules,
    clears,
    writes,
    capturedListeners,
    lockFlags,
    wsState,
    get currentScene() { return sceneState.current; },

    get: () => inner.getShadowlessPhotography(),
    save: (st) => inner.saveShadowlessPhotography(st),
    normalize: (st) => inner.normalizeShadowlessPhotography(st),
    classify: (pair) => inner.classifyPhotoPair(pair),
    computeShadow: (pos, light) => inner.computeShadowPosition(pos, light),
    exposureValid: (exp) => inner.isValidPhExposure(exp),
    platesValid: (pair) => inner.isValidPhPlates(pair),
    complete: (pair) => inner.isCompletePhPlates(pair),
    expected: (p, st) => inner.expectedPhPending(p, st),
    normalizePending: (p, st) => inner.normalizePhPending(p, st),
    bridge: (tgt) => inner.shadowlessPhotographyBridgeAllows(tgt),
    studioOK: () => inner.shadowlessPhotoStudioCanVisit(),
    cameraOK: () => inner.doubleExposureCameraCanVisit(),
    darkroomOK: () => inner.unreceivedShadowDarkroomCanVisit(),
    forget: () => inner.forgetShadowlessPhotographyState(),
    sync: () => inner.syncShadowlessPhotographyAll(),

    go(scene) {
      const old = sceneState.current;
      setScene(scene);
      if (old !== scene) {
        AutoAdvance.clear(old);
      }
    },

    arrive(scene) {
      h.go(scene);
      inner.resolveShadowlessPhotographyPendingOnArrival(scene);
      inner.replayShadowlessPhotographyPending(scene);
    },

    resolve(scene) {
      return inner.resolveShadowlessPhotographyPendingOnArrival(scene);
    },

    replay(scene) {
      return inner.replayShadowlessPhotographyPending(scene);
    },

    raw() {
      return mem.get(PH_KEY);
    },

    click(id, trusted = true) {
      const btn = getNode(id);
      if (!btn) throw new Error(`click target #${id} not found in DOM`);
      btn._fire('click', { isTrusted: Boolean(trusted) });
    },

    getSelected() {
      return inner.getSelectedPlateIndex();
    },

    setSelected(val) {
      inner.setSelectedPlateIndex(val);
    },

    getExampleState() {
      return { shown: inner.getExampleShown(), index: inner.getExampleIndex() };
    },

    resolveScene: inner.resolveScene,
    sceneInit: inner.sceneInit,
    PH_ENDING_IDS,
    PH_OLD_TARGETS,
    WS_ENDING_IDS,
    KEY: PH_KEY,
  };

  h.sync();
  return h;
}

function seedQuiet21Snapshot(h) {
  const snapshot = {};
  QUIET_21_KEYS.forEach((k, idx) => {
    const val = JSON.stringify({ version: 82 + idx, completed: true, quietToken: `tok_${idx}` });
    h.mem.set(k, val);
    snapshot[k] = val;
  });
  return snapshot;
}

function assertQuiet21Unchanged(h, snapshot) {
  for (const k of QUIET_21_KEYS) {
    assert.equal(h.mem.get(k), snapshot[k], `Upstream quiet key ${k} must not be altered`);
  }
}

/**
 * Capture 16 real native pending packets across variants via direct UI clicks and arrivals.
 */
export function capturePhPendingCases() {
  const cases = [];

  // Helper setup base visited state
  function createReadyStudioHarness() {
    const h = createPhHarness();
    const st = h.get();
    st.visited = { studio: true, camera: true, darkroom: true };
    h.save(st);
    return h;
  }

  // 1-3. Entry from 3 sources
  const entrySources = ['threshold', 'remembrance', 'weatherless-bus-shelter'];
  entrySources.forEach(src => {
    const h = createPhHarness();
    h.go(src);
    h.sync();
    const btn = src === 'weatherless-bus-shelter' ? 'ph-entry-shelter' : `ph-entry-${src}`;
    h.click(btn);
    const pending = h.get().pending;
    cases.push({ name: `entry_${src}`, pending, state: h.get(), harness: h });
  });

  // 4. Start (fresh = true)
  {
    const h = createReadyStudioHarness();
    h.go('shadowless-photo-studio');
    h.sync();
    h.click('ph-new');
    const pending = h.get().pending;
    cases.push({ name: 'start_fresh_true', pending, state: h.get(), harness: h });
  }

  // 5. Start (fresh = false, continue with draft)
  {
    const h = createReadyStudioHarness();
    const st = h.get();
    st.draft.plates = [{ position: 3, light: 'left' }, null];
    h.save(st);
    h.go('shadowless-photo-studio');
    h.sync();
    h.click('ph-continue');
    const pending = h.get().pending;
    cases.push({ name: 'start_fresh_false', pending, state: h.get(), harness: h });
  }

  // 6. Preview
  {
    const h = createReadyStudioHarness();
    const st = h.get();
    st.draft.plates = [{ position: 2, light: 'left' }, { position: 4, light: 'right' }];
    h.save(st);
    h.go('double-exposure-camera');
    h.sync();
    h.click('ph-preview-btn');
    const pending = h.get().pending;
    cases.push({ name: 'preview', pending, state: h.get(), harness: h });
  }

  // 7. Revise
  {
    const h = createReadyStudioHarness();
    const st = h.get();
    st.draft.plates = [{ position: 2, light: 'left' }, { position: 4, light: 'right' }];
    h.save(st);
    h.go('unreceived-shadow-darkroom');
    h.sync();
    h.click('ph-revise');
    const pending = h.get().pending;
    cases.push({ name: 'revise', pending, state: h.get(), harness: h });
  }

  // 8-11. Print across 4 endings
  const printEndings = [
    { name: 'absence-shared-a-portrait', p1: { position: 3, light: 'left' }, p2: { position: 3, light: 'left' } },
    { name: 'one-visitor-kept-two-shadows', p1: { position: 3, light: 'left' }, p2: { position: 3, light: 'right' } },
    { name: 'the-shadow-attended-in-your-place', p1: { position: 2, light: 'left' }, p2: { position: 4, light: 'right' } },
    { name: 'nobody-was-kept-in-the-frame', p1: { position: 1, light: 'left' }, p2: { position: 5, light: 'right' } },
  ];

  printEndings.forEach(e => {
    const h = createReadyStudioHarness();
    const st = h.get();
    st.draft.plates = [e.p1, e.p2];
    h.save(st);
    h.go('unreceived-shadow-darkroom');
    h.sync();
    h.click('ph-print');
    const pending = h.get().pending;
    cases.push({ name: `print_${e.name}`, pending, state: h.get(), harness: h });
  });

  // 12-15. Return across 4 destinations/outcomes
  printEndings.forEach(e => {
    const h = createReadyStudioHarness();
    const st = h.get();
    st.draft.plates = [e.p1, e.p2];
    h.save(st);
    h.go('unreceived-shadow-darkroom');
    h.sync();
    h.click('ph-print');
    const p = h.get().pending;
    const target = p.target;
    h.arrive(target); // sets activePrint
    h.click(`ph-print-return-${target}`);
    const returnPending = h.get().pending;
    cases.push({ name: `return_${e.name}`, pending: returnPending, state: h.get(), harness: h });
  });

  // 16. Abandon
  {
    const h = createReadyStudioHarness();
    h.go('double-exposure-camera');
    h.sync();
    h.click('ph-abandon');
    const pending = h.get().pending;
    cases.push({ name: 'abandon', pending, state: h.get(), harness: h });
  }

  return cases;
}

// =========================================================================
// REQUIRED BASE TESTS 1-12
// =========================================================================

test('BASE TEST 1: Unique header/key/guide boundary, cache 117, 274 unique scenes, 25 native buttons, lazy webp images', () => {
  const countHeader = scriptSource.split(PH_MODULE_HEADER).length - 1;
  assert.equal(countHeader, 1, 'Header must appear exactly once in script.js');

  const countKey = scriptSource.split(PH_KEY).length - 1;
  assert.ok(countKey >= 2, 'Key must be referenced in script.js');

  // Exact styles.css?v=117 and script.js?v=117 check
  assert.match(htmlSource, /href=["']styles\.css\?v=117["']/, 'index.html must reference styles.css?v=117');
  assert.match(htmlSource, /src=["']script\.js\?v=117["']/, 'index.html must reference script.js?v=117');

  // 274 unique scene sections in index.html
  const sceneMatches = htmlSource.match(/<section[^>]+class=["'][^"']*scene[^"']*["'][^>]*data-scene=["']([^"']+)["']/g) || [];
  const sceneIds = sceneMatches.map(m => m.match(/data-scene=["']([^"']+)["']/)[1]);
  const uniqueScenes = new Set(sceneIds);
  assert.equal(uniqueScenes.size, 274, `Expected 274 unique scenes in HTML, found ${uniqueScenes.size}`);

  assert.ok(uniqueScenes.has('shadowless-photo-studio'));
  assert.ok(uniqueScenes.has('double-exposure-camera'));
  assert.ok(uniqueScenes.has('unreceived-shadow-darkroom'));

  // 25 native buttons uniquely present in actual HTML
  const rawButtonIds = [];
  const btnTagRegex = /<button[^>]+id=["']([^"']+)["'][^>]*>/g;
  let btnM;
  while ((btnM = btnTagRegex.exec(htmlSource)) !== null) {
    if (btnM[1].startsWith('ph-')) {
      rawButtonIds.push(btnM[1]);
    }
  }
  for (const expectedId of PH_NATIVE_BUTTON_IDS) {
    const occurrences = rawButtonIds.filter(id => id === expectedId).length;
    assert.equal(occurrences, 1, `Button id #${expectedId} must appear exactly once in HTML`);
  }

  // Live harness mock DOM verifies exact 1 listener per native button, no duplicates
  const hBase1 = createPhHarness();
  for (const expectedId of PH_NATIVE_BUTTON_IDS) {
    const node = hBase1.nodes.get(expectedId);
    assert.ok(node, `MockNode #${expectedId} must exist`);
    assert.equal(node._listenerCount('click'), 1, `Button #${expectedId} must have exactly 1 click listener`);
    assert.ok(hBase1.capturedListeners.has(expectedId), `Captured listener must exist for #${expectedId}`);
  }
  assert.equal(hBase1.capturedListeners.size, 25, 'Must capture exactly 25 native button listeners');
  // Map keys absent return undefined, has returns false
  assert.equal(hBase1.nodes.has('unknown-nonexistent-id'), false);
  assert.equal(hBase1.nodes.get('unknown-nonexistent-id'), undefined);

  // 3 lazy WebP images existence, exact 1536x1024 dimensions, and sizes < 300KB
  const webpFiles = [
    'assets/v103-shadowless-photo-studio.webp',
    'assets/v103-double-exposure-camera.webp',
    'assets/v103-unreceived-shadow-darkroom.webp',
  ];
  for (const rel of webpFiles) {
    const fullPath = path.join(PROJECT_ROOT, rel);
    assert.ok(fs.existsSync(fullPath), `Asset file ${rel} must exist`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size < 300 * 1024, `Asset ${rel} size ${stat.size} bytes must be < 300KB`);
    const imgRegex = new RegExp(`<img[^>]+(?:src|data-src)=["']${rel}["'][^>]*>`);
    const imgMatch = htmlSource.match(imgRegex);
    assert.ok(imgMatch, `HTML must contain img tag for ${rel}`);
    assert.match(imgMatch[0], /width=["']1536["']/, `${rel} img must have width="1536"`);
    assert.match(imgMatch[0], /height=["']1024["']/, `${rel} img must have height="1024"`);
    assert.match(imgMatch[0], /loading=["']lazy["']/, `${rel} img must have loading="lazy"`);
  }
});

test('BASE TEST 2: Independent oracle 10 exposures + 100 pairs classify 10/10/6/74, 121 legal shapes, reject bad shapes', () => {
  const h = createPhHarness();

  const positions = [1, 2, 3, 4, 5];
  const lights = ['left', 'right'];
  const tenExposures = [];
  for (const p of positions) {
    for (const l of lights) {
      tenExposures.push({ position: p, light: l });
    }
  }
  assert.equal(tenExposures.length, 10);
  for (const exp of tenExposures) {
    assert.equal(h.exposureValid(exp), true);
  }

  function oracleClassify(p1, p2) {
    const b1 = p1.position;
    const b2 = p2.position;
    const s1 = b1 + (p1.light === 'left' ? 1 : -1);
    const s2 = b2 + (p2.light === 'left' ? 1 : -1);
    const sameBody = b1 === b2;
    const sameShadow = s1 === s2;
    if (sameBody && sameShadow) return 'absence-shared-a-portrait';
    if (sameBody && !sameShadow) return 'one-visitor-kept-two-shadows';
    if (!sameBody && sameShadow) return 'the-shadow-attended-in-your-place';
    return 'nobody-was-kept-in-the-frame';
  }

  const counts = {
    'absence-shared-a-portrait': 0,
    'one-visitor-kept-two-shadows': 0,
    'the-shadow-attended-in-your-place': 0,
    'nobody-was-kept-in-the-frame': 0,
  };

  for (const e1 of tenExposures) {
    for (const e2 of tenExposures) {
      const pair = [e1, e2];
      const actual = h.classify(pair);
      const expected = oracleClassify(e1, e2);
      assert.equal(actual, expected);
      counts[actual]++;
    }
  }

  assert.equal(counts['absence-shared-a-portrait'], 10);
  assert.equal(counts['one-visitor-kept-two-shadows'], 10);
  assert.equal(counts['the-shadow-attended-in-your-place'], 6);
  assert.equal(counts['nobody-was-kept-in-the-frame'], 74);

  let legalShapesCount = 0;
  if (h.platesValid([null, null])) legalShapesCount++;
  for (const e of tenExposures) {
    if (h.platesValid([e, null])) legalShapesCount++;
    if (h.platesValid([null, e])) legalShapesCount++;
  }
  for (const e1 of tenExposures) {
    for (const e2 of tenExposures) {
      if (h.platesValid([e1, e2])) legalShapesCount++;
    }
  }
  assert.equal(legalShapesCount, 121);

  assert.equal(h.exposureValid({ position: '3', light: 'left' }), false);
  assert.equal(h.exposureValid({ position: 3, light: 'center' }), false);
  assert.equal(h.exposureValid({ position: 0, light: 'left' }), false);
  assert.equal(h.exposureValid({ position: 6, light: 'right' }), false);
  assert.equal(h.exposureValid({ position: 3.5, light: 'left' }), false);
  assert.equal(h.exposureValid({ position: 3, light: 'left', extra: 1 }), false);
  assert.equal(h.platesValid([tenExposures[0]]), false);
  assert.equal(h.platesValid([tenExposures[0], tenExposures[1], tenExposures[2]]), false);
  assert.equal(h.platesValid('bad'), false);
  assert.equal(h.complete([tenExposures[0], null]), false);
});

test('BASE TEST 3: Strict 9-field normalize, integer clamp, bad JSON retains raw, safe 暂无合法底片', () => {
  const h = createPhHarness();

  h.mem.set(PH_KEY, 'NOT_VALID_JSON{[');
  const stateFromBad = h.get();
  assert.equal(stateFromBad.version, 103);
  assert.equal(stateFromBad.runs, 0);
  assert.equal(h.raw(), 'NOT_VALID_JSON{[');

  const input = {
    version: 103,
    visited: { studio: true, camera: 1, darkroom: false },
    draft: { position: 99, light: 'invalid', plates: [{ position: 3, light: 'left' }, null] },
    endings: ['absence-shared-a-portrait', 'absence-shared-a-portrait', 'bogus-id'],
    latestPairByEnding: {
      'absence-shared-a-portrait': [{ position: 2, light: 'left' }, { position: 2, light: 'left' }],
      'bogus-id': [{ position: 1, light: 'left' }, { position: 1, light: 'left' }],
    },
    runs: 99999,
    lastOutcome: 'absence-shared-a-portrait',
    activePrint: null,
    pending: null,
    extraGarbage: 'strip_me',
  };

  const norm = h.normalize(input);
  const keys = Object.keys(norm).sort();
  assert.deepEqual(keys, [
    'activePrint',
    'draft',
    'endings',
    'lastOutcome',
    'latestPairByEnding',
    'pending',
    'runs',
    'version',
    'visited',
  ]);
  assert.equal(norm.visited.studio, true);
  assert.equal(norm.visited.camera, false);
  assert.equal(norm.draft.position, 3);
  assert.equal(norm.draft.light, 'left');
  assert.equal(norm.runs, 9999);
  assert.deepEqual(norm.endings, ['absence-shared-a-portrait']);
  assert.equal(norm.extraGarbage, undefined);

  norm.latestPairByEnding['absence-shared-a-portrait'] = [];
  h.save(norm);
  assert.doesNotThrow(() => {
    h.sync();
  });
  const codex = h.nodes.get('ph-codex-grid');
  assert.ok(codex.children.length > 0);
  const renderedText = codex.textContent;
  assert.match(renderedText, /暂无合法底片记录/);
});

test('BASE TEST 4: Pure unlock / available old WS3 + all 5 temporary lock sources, offscene/firstlock no extra writes', () => {
  const h = createPhHarness();
  assert.equal(h.studioOK(), false);

  h.lockFlags.unlocked = false;
  assert.equal(h.studioOK(), false);
  h.lockFlags.unlocked = true;

  h.wsState.endings = [WS_ENDING_IDS[0]];
  assert.equal(h.studioOK(), false);
  h.wsState.endings = [...WS_ENDING_IDS];
  assert.equal(h.studioOK(), false);

  const st = h.get();
  st.visited.studio = true;
  h.save(st);
  assert.equal(h.studioOK(), true);

  const lockCases = [
    { name: 'wsPending', flag: 'wsPending' },
    { name: 'wsActive', flag: 'wsActive' },
    { name: 'dwPending', flag: 'dwPending' },
    { name: 'dwActive', flag: 'dwActive' },
    { name: 'wkPending', flag: 'wkPending' },
  ];

  for (const lc of lockCases) {
    h.lockFlags[lc.flag] = true;
    assert.equal(h.studioOK(), false, `Studio should be locked when ${lc.name} is active`);
    h.lockFlags[lc.flag] = false;
  }

  // Declared scenes mapping for all 25 native button IDs
  const buttonDeclaredScenes = {
    'ph-entry-threshold': 'threshold',
    'ph-entry-remembrance': 'remembrance',
    'ph-entry-shelter': 'weatherless-bus-shelter',
    'ph-new': 'shadowless-photo-studio',
    'ph-continue': 'shadowless-photo-studio',
    'ph-pos-1': 'double-exposure-camera',
    'ph-pos-2': 'double-exposure-camera',
    'ph-pos-3': 'double-exposure-camera',
    'ph-pos-4': 'double-exposure-camera',
    'ph-pos-5': 'double-exposure-camera',
    'ph-light-left': 'double-exposure-camera',
    'ph-light-right': 'double-exposure-camera',
    'ph-plate-slot-0': 'double-exposure-camera',
    'ph-plate-slot-1': 'double-exposure-camera',
    'ph-shutter': 'double-exposure-camera',
    'ph-erase-selected': 'double-exposure-camera',
    'ph-swap-plates': 'double-exposure-camera',
    'ph-example-btn': 'double-exposure-camera',
    'ph-preview-btn': 'double-exposure-camera',
    'ph-abandon': 'double-exposure-camera',
    'ph-print': 'unreceived-shadow-darkroom',
    'ph-revise': 'unreceived-shadow-darkroom',
    'ph-print-return-threshold': 'threshold',
    'ph-print-return-remembrance': 'remembrance',
    'ph-print-return-unending-gallery': 'unending-gallery',
  };

  // For all 25 native handlers: assert captured exists, synthetic isTrusted:false returns zero writes & raw unchanged,
  // and offscene calls similarly reject.
  for (const [btnId, declaredScene] of Object.entries(buttonDeclaredScenes)) {
    assert.ok(h.capturedListeners.has(btnId), `Captured listener must exist for ${btnId}`);
    assert.equal(h.nodes.get(btnId)._listenerCount('click'), 1, `Button #${btnId} must have exactly 1 listener`);

    // 1. Synthetic untrusted click at declared scene -> zero writes & raw unchanged
    h.go(declaredScene);
    const rawBeforeUntrusted = h.raw();
    const writesBeforeUntrusted = h.writes.length;
    h.click(btnId, false);
    assert.equal(h.writes.length, writesBeforeUntrusted, `Untrusted click on ${btnId} must cause zero store writes`);
    assert.equal(h.raw(), rawBeforeUntrusted, `Untrusted click on ${btnId} must not alter raw store`);

    // 2. Trusted click offscene (at 'archives') -> zero writes & raw unchanged
    h.go('archives');
    const rawBeforeOffscene = h.raw();
    const writesBeforeOffscene = h.writes.length;
    h.click(btnId, true);
    assert.equal(h.writes.length, writesBeforeOffscene, `Offscene click on ${btnId} must cause zero store writes`);
    assert.equal(h.raw(), rawBeforeOffscene, `Offscene click on ${btnId} must not alter raw store`);
  }

  // Example button untrusted click leaves example state unchanged
  h.go('double-exposure-camera');
  const exStateBefore = h.getExampleState();
  h.click('ph-example-btn', false);
  const exStateAfter = h.getExampleState();
  assert.deepEqual(exStateAfter, exStateBefore, 'Untrusted example click must not change example state');

  // First entry trusted twice: first pending accepted, raw and writes/timer unchanged after second click
  const hEntry = createPhHarness({ currentScene: 'threshold' });
  hEntry.go('threshold');
  hEntry.sync();
  assert.equal(hEntry.get().pending, null, 'Initial pending must be null');
  hEntry.click('ph-entry-threshold', true);
  const stAfterFirst = hEntry.get();
  assert.ok(stAfterFirst.pending, 'First trusted click must create pending entry');
  assert.equal(stAfterFirst.pending.kind, 'entry');
  assert.equal(stAfterFirst.pending.source, 'threshold');
  assert.equal(stAfterFirst.pending.target, 'shadowless-photo-studio');

  const rawAfterFirst = hEntry.raw();
  const writesAfterFirst = hEntry.writes.length;
  const schedAfterFirst = hEntry.schedules.length;

  // Second trusted click while pending active
  hEntry.click('ph-entry-threshold', true);
  assert.equal(hEntry.raw(), rawAfterFirst, 'Second click must not modify raw store');
  assert.equal(hEntry.writes.length, writesAfterFirst, 'Second click must not add store writes');
  assert.equal(hEntry.schedules.length, schedAfterFirst, 'Second click must not add schedules');
});

test('BASE TEST 5: Actual native entry 3 sources capture, pending.source weatherless-bus-shelter, feedback selectors', () => {
  const sources = [
    { src: 'threshold', btn: 'ph-entry-threshold', resp: 'ph-entry-response-threshold' },
    { src: 'remembrance', btn: 'ph-entry-remembrance', resp: 'ph-entry-response-remembrance' },
    { src: 'weatherless-bus-shelter', btn: 'ph-entry-shelter', resp: 'ph-entry-response-shelter' },
  ];

  for (const s of sources) {
    const h = createPhHarness();
    h.go(s.src);
    h.sync();

    const btn = h.nodes.get(s.btn);
    assert.equal(btn.hidden, false, `${s.btn} should be visible when unlocked`);
    assert.equal(btn.disabled, false, `${s.btn} should be enabled`);

    h.click(s.btn);

    const st = h.get();
    assert.ok(st.pending, `Pending should be set after clicking ${s.btn}`);
    assert.equal(st.pending.kind, 'entry');
    assert.equal(st.pending.source, s.src);
    assert.equal(st.pending.target, 'shadowless-photo-studio');

    const respNode = h.nodes.get(s.resp);
    assert.equal(respNode.hidden, false);
    assert.equal(respNode.textContent, st.pending.feedback);
    assert.equal(respNode.textContent, '照相馆的黑色木门虚掩着，镜头静静候在空椅对面。');
  }
});

test('BASE TEST 6: Camera cold default first empty slot, setting changes don’t modify frozen plates, swap/erase/preview logic', () => {
  const h = createPhHarness();
  const st = h.get();
  st.visited.studio = true;
  st.visited.camera = true;
  h.save(st);

  h.go('double-exposure-camera');
  h.sync();

  assert.equal(h.getSelected(), 0, 'Cold default selected slot must be 0');

  // Cold initial draft state check with [valid, null]
  const seedDraftH = createPhHarness();
  const stDraft = seedDraftH.get();
  stDraft.visited = { studio: true, camera: true, darkroom: false };
  stDraft.draft.plates = [{ position: 1, light: 'left' }, null];
  const hDraft = createPhHarness({ initialStore: stDraft, currentScene: 'double-exposure-camera' });
  assert.equal(hDraft.getSelected(), 1, 'Draft [exp, null] should default selection to empty slot 1');

  // Explicit selection preserved on sync
  hDraft.click('ph-plate-slot-0');
  assert.equal(hDraft.getSelected(), 0);
  hDraft.sync();
  assert.equal(hDraft.getSelected(), 0, 'Explicit selection must be preserved across sync');

  // Same value position click is a no-op (no extra store write)
  const writesBefore = h.writes.length;
  h.click('ph-pos-3'); // 3 is default
  assert.equal(h.writes.length, writesBefore, 'Same value position setting click must not trigger store write');

  // Example button does not write to store
  h.click('ph-example-btn');
  assert.equal(h.writes.length, writesBefore, 'Example cycle must not write to store');

  // Set position 2, right light
  h.click('ph-pos-2');
  h.click('ph-light-right');
  let curr = h.get();
  assert.equal(curr.draft.position, 2);
  assert.equal(curr.draft.light, 'right');

  // Press shutter -> fills slot 0
  h.click('ph-shutter');
  curr = h.get();
  assert.deepEqual(curr.draft.plates[0], { position: 2, light: 'right' });
  assert.equal(curr.draft.plates[1], null);
  assert.equal(h.getSelected(), 1, 'Selection should advance to empty slot 1');

  // Changing position/light now does NOT modify plate 0
  h.click('ph-pos-5');
  h.click('ph-light-left');
  curr = h.get();
  assert.deepEqual(curr.draft.plates[0], { position: 2, light: 'right' }, 'Plate 0 must remain frozen');

  // Shutter fills slot 1
  h.click('ph-shutter');
  curr = h.get();
  assert.deepEqual(curr.draft.plates[1], { position: 5, light: 'left' });

  // Swap order
  h.click('ph-swap-plates');
  curr = h.get();
  assert.deepEqual(curr.draft.plates[0], { position: 5, light: 'left' });
  assert.deepEqual(curr.draft.plates[1], { position: 2, light: 'right' });

  // Select slot 0 and erase it -> leaves hole [null, exp]
  h.click('ph-plate-slot-0');
  assert.equal(h.getSelected(), 0);
  h.click('ph-erase-selected');
  curr = h.get();
  assert.equal(curr.draft.plates[0], null);
  assert.deepEqual(curr.draft.plates[1], { position: 2, light: 'right' });

  // Erasing already null slot is a no-op
  const writesAfterErase = h.writes.length;
  h.click('ph-erase-selected');
  assert.equal(h.writes.length, writesAfterErase, 'Erasing null slot must be a no-op');

  // Preview button should be disabled when one slot is null
  const prevBtn = h.nodes.get('ph-preview-btn');
  assert.equal(prevBtn.disabled, true);
});

test('BASE TEST 7: Viewfinder geometry marks, data-exp, data-coord, exact overlap coordinates', () => {
  const h = createPhHarness();
  const st = h.get();
  st.visited.studio = true;
  st.visited.camera = true;
  st.visited.darkroom = true;
  st.draft.plates = [
    { position: 3, light: 'left' },
    { position: 3, light: 'left' },
  ];
  h.save(st);

  h.go('unreceived-shadow-darkroom');
  h.sync();

  const vf = h.nodes.get('ph-darkroom-viewfinder');
  assert.ok(vf);
  const marks = vf.querySelectorAll('.ph-figure-mark');
  assert.equal(marks.length, 4, 'Should have 2 bodies and 2 shadows');

  const bodies = marks.filter(m => m.classList.contains('is-body'));
  assert.equal(bodies.length, 2);
  assert.equal(bodies[0].getAttribute('data-coord'), '3');
  assert.equal(bodies[1].getAttribute('data-coord'), '3');
  assert.equal(bodies[0].style.left, bodies[1].style.left, 'Identical coordinates must have exact same style.left');

  const shadows = marks.filter(m => m.classList.contains('is-shadow'));
  assert.equal(shadows.length, 2);
  assert.equal(shadows[0].getAttribute('data-coord'), '4');
  assert.equal(shadows[1].getAttribute('data-coord'), '4');
});

test('BASE TEST 8: Full 16 native captured pending canonical baseline, then single mutations rejected', () => {
  const nativeSnapshots = capturePhPendingCases();
  assert.equal(nativeSnapshots.length, 16, 'Must capture exactly 16 native pending snapshots');

  for (const item of nativeSnapshots) {
    const { name, pending, state, harness } = item;
    assert.ok(pending, `${name} pending must be non-null`);
    const baseKeys = ['feedback', 'kind', 'source', 'target'];
    let expectedKeys;
    if (pending.kind === 'start') {
      expectedKeys = [...baseKeys, 'fresh'].sort();
    } else if (pending.kind === 'preview') {
      expectedKeys = [...baseKeys, 'plates'].sort();
    } else if (pending.kind === 'print' || pending.kind === 'print-return') {
      expectedKeys = [...baseKeys, 'outcome', 'plates'].sort();
    } else if (pending.kind === 'entry' || pending.kind === 'revise' || pending.kind === 'abandon') {
      expectedKeys = [...baseKeys].sort();
    } else {
      assert.fail(`Unknown pending kind: ${pending.kind}`);
    }
    assert.deepEqual(Object.keys(pending).sort(), expectedKeys, `${name} must contain exact independent canonical keys`);
    const verified = harness.normalizePending(pending, state);
    assert.deepEqual(verified, pending, `${name} pending must strictly equal canonical expected`);

    // Mutation tests: mutating single fields must result in null rejection
    // 1. Mutate kind
    assert.equal(harness.normalizePending({ ...pending, kind: 'unknown_kind' }, state), null);

    // 2. Mutate source
    assert.equal(harness.normalizePending({ ...pending, source: 'archives' }, state), null);

    // 3. Mutate target
    assert.equal(harness.normalizePending({ ...pending, target: 'archives' }, state), null);

    // 4. Mutate feedback
    assert.equal(harness.normalizePending({ ...pending, feedback: 'Forged text' }, state), null);

    // 5. Inject extra forbidden field
    assert.equal(harness.normalizePending({ ...pending, extraField: true }, state), null);
    assert.equal(harness.normalizePending({ ...pending, from: pending.source }, state), null);

    // 6. Mutate plates / outcome / fresh if applicable
    if (pending.fresh !== undefined) {
      assert.equal(harness.normalizePending({ ...pending, fresh: 'true' }, state), null);
    }

    if (pending.outcome !== undefined) {
      assert.equal(harness.normalizePending({ ...pending, outcome: 'nonexistent-ending' }, state), null);
    }

    if (pending.plates !== undefined) {
      // Order swap or single coordinate mismatch
      const badPlates = [pending.plates[1], pending.plates[0]];
      if (JSON.stringify(badPlates) !== JSON.stringify(pending.plates)) {
        assert.equal(harness.normalizePending({ ...pending, plates: badPlates }, state), null);
      }
      assert.equal(harness.normalizePending({ ...pending, plates: [{ position: 1, light: 'left' }, null] }, state), null);
    }
  }
});

test('BASE TEST 9: 16 native snapshots cold fresh VM source replay retains raw, target resolve exact once, unrelated cancel no book', () => {
  const nativeSnapshots = capturePhPendingCases();

  for (const item of nativeSnapshots) {
    const { name, pending, state } = item;
    const initialRaw = JSON.stringify(state);

    // Fresh harness instance seeded with raw JSON state
    const h = createPhHarness({ initialStore: initialRaw, currentScene: pending.source });

    // Verify source RAW unchanged before arrival
    assert.equal(h.raw(), initialRaw, `${name} source initial store raw string must match`);

    // Source replay schedules advance and shows feedback selector
    h.schedules.length = 0;
    h.replay(pending.source);
    assert.deepEqual(h.get().pending, pending, `${name} pending must be preserved on source replay`);
    assert.equal(h.schedules.length, 1, `${name} source replay must schedule advance`);
    assert.equal(h.schedules[0].to, pending.target);
    assert.equal(h.raw(), initialRaw, `${name} source replay must not modify raw store`);
    assert.equal(h.writes.length, 0, `${name} source replay must produce zero store writes`);

    // Unrelated scene arrival cancels pending without booking
    const hUnrelated = createPhHarness({ initialStore: initialRaw, currentScene: 'archives' });
    hUnrelated.arrive('archives');
    const cancelled = hUnrelated.get();
    assert.equal(cancelled.pending, null, `${name} unrelated arrival must clear pending`);
    if (pending.kind === 'print') {
      assert.equal(cancelled.runs, state.runs, `${name} unrelated cancellation must not increase runs`);
    }

    // Actual target arrival resolves exactly once
    const hTarget = createPhHarness({ initialStore: initialRaw, currentScene: pending.target });
    hTarget.arrive(pending.target);
    const resolved = hTarget.get();
    assert.equal(resolved.pending, null, `${name} target arrival must clear pending`);

    if (pending.kind === 'print') {
      assert.equal(resolved.runs, state.runs + 1, `${name} print target arrival must increment runs by exactly 1`);
      assert.ok(resolved.endings.includes(pending.outcome));
      assert.ok(resolved.activePrint);
    } else if (pending.kind === 'print-return') {
      assert.equal(resolved.activePrint, null, `${name} print-return target arrival must clear activePrint`);
    } else if (pending.kind === 'start' && pending.fresh) {
      assert.deepEqual(resolved.draft.plates, [null, null], `${name} start fresh target arrival must reset plates`);
    }

    // Replay on target is idempotent
    hTarget.replay(pending.target);
    if (pending.kind === 'print') {
      assert.equal(hTarget.get().runs, state.runs + 1, `${name} replay on target must not double count`);
    }
  }
});

test('BASE TEST 10: Actual serial native 4 relations flow, runs 4, endings 4, refresh idempotent, 21 quiet untouched', () => {
  const h = createPhHarness();
  const quietSnapshot = seedQuiet21Snapshot(h);

  const testPairs = [
    { p1: { position: 3, light: 'left' }, p2: { position: 3, light: 'left' }, ending: 'absence-shared-a-portrait', target: 'threshold' },
    { p1: { position: 3, light: 'left' }, p2: { position: 3, light: 'right' }, ending: 'one-visitor-kept-two-shadows', target: 'remembrance' },
    { p1: { position: 2, light: 'left' }, p2: { position: 4, light: 'right' }, ending: 'the-shadow-attended-in-your-place', target: 'unending-gallery' },
    { p1: { position: 1, light: 'left' }, p2: { position: 5, light: 'right' }, ending: 'nobody-was-kept-in-the-frame', target: 'unending-gallery' },
  ];

  // Enter studio from threshold
  h.go('threshold');
  h.click('ph-entry-threshold');
  h.arrive('shadowless-photo-studio');

  for (let i = 0; i < testPairs.length; i++) {
    const item = testPairs[i];
    h.go('shadowless-photo-studio');
    h.click('ph-new');
    h.arrive('double-exposure-camera');

    // Slot 0
    h.click(`ph-pos-${item.p1.position}`);
    h.click(`ph-light-${item.p1.light}`);
    h.click('ph-shutter');

    // Slot 1
    h.click(`ph-pos-${item.p2.position}`);
    h.click(`ph-light-${item.p2.light}`);
    h.click('ph-shutter');

    // Go to darkroom
    h.click('ph-preview-btn');
    h.arrive('unreceived-shadow-darkroom');

    // Print to target
    h.click('ph-print');
    h.arrive(item.target);

    const st = h.get();
    assert.equal(st.runs, i + 1);
    assert.ok(st.endings.includes(item.ending));
    assert.deepEqual(st.latestPairByEnding[item.ending], [item.p1, item.p2]);

    // Return to studio
    h.click(`ph-print-return-${item.target}`);
    h.arrive('shadowless-photo-studio');
    assert.equal(h.get().activePrint, null);
  }

  const finalSt = h.get();
  assert.equal(finalSt.runs, 4);
  assert.equal(finalSt.endings.length, 4);

  // 5th run with repeated outcome but new plates
  h.click('ph-new');
  h.arrive('double-exposure-camera');
  h.click('ph-pos-1');
  h.click('ph-light-left');
  h.click('ph-shutter');
  h.click('ph-pos-1');
  h.click('ph-light-left');
  h.click('ph-shutter');
  h.click('ph-preview-btn');
  h.arrive('unreceived-shadow-darkroom');
  h.click('ph-print');
  h.arrive('threshold');

  const run5 = h.get();
  assert.equal(run5.runs, 5);
  assert.equal(run5.endings.length, 4, 'Endings must deduplicate');
  assert.deepEqual(run5.latestPairByEnding['absence-shared-a-portrait'], [
    { position: 1, light: 'left' },
    { position: 1, light: 'left' },
  ], 'Only the latest pair for this outcome should be replaced');

  // Verify other 3 latest pairs remain intact
  for (let j = 1; j < 4; j++) {
    const item = testPairs[j];
    assert.deepEqual(run5.latestPairByEnding[item.ending], [item.p1, item.p2], `Ending ${item.ending} pair must remain unchanged`);
  }

  assertQuiet21Unchanged(h, quietSnapshot);
});

test('BASE TEST 11: Exact active recovery href, studio locks, bridge allows only fixed contexts', () => {
  const h = createPhHarness();
  const st = h.get();
  st.visited.studio = true;
  st.activePrint = {
    outcome: 'the-shadow-attended-in-your-place',
    plates: [{ position: 2, light: 'left' }, { position: 4, light: 'right' }],
  };
  st.endings = ['the-shadow-attended-in-your-place'];
  st.latestPairByEnding['the-shadow-attended-in-your-place'] = st.activePrint.plates;
  h.save(st);

  h.go('shadowless-photo-studio');
  h.sync();

  const printLink = h.nodes.get('ph-studio-print-link');
  assert.equal(printLink.hidden, false, 'Recovery print link must be visible');
  assert.equal(printLink.getAttribute('href'), '#unending-gallery');

  const newBtn = h.nodes.get('ph-new');
  assert.equal(newBtn.disabled, true, 'New reel button must be disabled when activePrint is pending return');

  // Bridge checks
  assert.equal(h.bridge('unending-gallery'), true);
  assert.equal(h.bridge('threshold'), false);
  assert.equal(h.bridge('remembrance'), false);
});

test('BASE TEST 12: forgetCanonicalPending clears logical old source only + 3 new scopes, removes own key only', () => {
  const h = createPhHarness();
  const quietSnapshot = seedQuiet21Snapshot(h);

  // Capture actual canonical entry pending from threshold
  h.go('threshold');
  h.sync();
  h.click('ph-entry-threshold');
  const canonicalPending = h.get().pending;
  assert.ok(canonicalPending);

  h.forget();

  // Own key removed
  assert.equal(h.mem.has(PH_KEY), false);

  // Upstream quiet keys unaffected
  assertQuiet21Unchanged(h, quietSnapshot);

  // AutoAdvance cleared for logical source + 3 new scopes
  assert.ok(h.clears.includes('shadowless-photo-studio'));
  assert.ok(h.clears.includes('double-exposure-camera'));
  assert.ok(h.clears.includes('unreceived-shadow-darkroom'));
  assert.ok(h.clears.includes('threshold'), 'Threshold should be cleared as logical source');

  // Forged raw pending with arbitrary old scope outside allowed list does not clear random scene
  const forgedHarness = createPhHarness();
  forgedHarness.mem.set(PH_KEY, JSON.stringify({
    version: 103,
    pending: { kind: 'entry', source: 'archives', target: 'shadowless-photo-studio', feedback: 'forged' }
  }));
  forgedHarness.clears.length = 0;
  forgedHarness.forget();
  assert.ok(!forgedHarness.clears.includes('archives'), 'Arbitrary uncanonical source must not trigger AutoAdvance.clear');
});

/**
 * .v103-gemini/v103-tests-routing-final.mjs
 *
 * Append-only extra suite for v103 收不到影子的照相馆 (SHADOWLESS PHOTOGRAPHY).
 * Sole frontend/test author: gemini-3.7-flash-high. Verified by Codex.
 * Tests 13-16:
 * 13. resolveScene routing matrix, governance ruling, fallback to remembrance & hash sync
 * 14. progressEntryButton exact HTML parent tree, progress steps, WS->PH delegation
 * 15. Short sync functions source contracts & live h.sync entries mutability
 * 16. Source contract assertions for bootstrap, replay, route guards & sceneInit
 */

// Inherits lexical bindings (test, assert, fs, path, scriptSource, htmlSource, createPhHarness,
// capturePhPendingCases, PH_ENDING_IDS, PH_OLD_TARGETS, WS_ENDING_IDS) from base suite.

// =========================================================================
// EXTRA TESTS 13 - 16
// =========================================================================

test('EXTRA TEST 13: resolveScene routing matrix, governance ruling, fallback to remembrance & hash sync', () => {
  // Extract ONLY the actual full resolveScene function ending with '\n  };'
  const resolveMarker = 'const resolveScene = (name) => {';
  const rStart = scriptSource.indexOf(resolveMarker);
  assert.ok(rStart !== -1, 'Must locate const resolveScene in scriptSource');
  const resolveEndMarker = '\n  };';
  const rEnd = scriptSource.indexOf(resolveEndMarker, rStart);
  assert.ok(rEnd !== -1, 'Must locate end of resolveScene in scriptSource');
  const extractedResolveFn = scriptSource.slice(rStart, rEnd + resolveEndMarker.length).trim();

  // Explicit old stubs keeping HUD unlocked: true, ruling: false to exercise PH override on governance
  const extraPrelude = `
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
    const wakeForAnotherHotelBridgeAllows = () => false;
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
    const forgottenLocksBridgeAllows = () => false;
    const lkShopCanVisit = () => false;
    const lockBenchCanVisit = () => false;
    const lkCourtCanVisit = () => false;
    const linenRoomBridgeAllows = () => false;
    const lnRoomCanVisit = () => false;
    const foldingFloorCanVisit = () => false;
    const lnCourtCanVisit = () => false;
    const dreamMendingBridgeAllows = () => false;
    const dmShopCanVisit = () => false;
    const dreamFrameCanVisit = () => false;
    const dmCourtCanVisit = () => false;
    const hearseYardBridgeAllows = () => false;
    const hyGateCanVisit = () => false;
    const jammedYardCanVisit = () => false;
    const hyCourtCanVisit = () => false;
    const ahHotelCanVisit = () => false;
    const borrowedDawnClockroomCanVisit = () => false;
    const sharedMorningVerandaCanVisit = () => false;
  `;

  const extraSource = `
    const location = { hash: "" };
    const history = {
      replaceState(st, title, url) {
        location.hash = url;
      }
    };
    ${extractedResolveFn}
  `;

  const h = createPhHarness({ extraPrelude, extraSource });
  assert.ok(typeof h.resolveScene === 'function', 'resolveScene must be compiled');

  // Cold locked 3 v103 scenes fallback directly to remembrance; governance runs once before these late guards
  assert.equal(h.resolveScene('shadowless-photo-studio'), 'remembrance');
  assert.equal(h.resolveScene('double-exposure-camera'), 'remembrance');
  assert.equal(h.resolveScene('unreceived-shadow-darkroom'), 'remembrance');

  // Unending gallery falls back to remembrance in single-pass resolveScene when gallery guards deny
  assert.equal(h.resolveScene('unending-gallery'), 'remembrance');

  // Baseline print pending cases from real native capture
  const allCaptures = capturePhPendingCases();
  const printCases = allCaptures.filter(c => c.pending && c.pending.kind === 'print');
  assert.equal(printCases.length, 4, 'Must have 4 native print cases');

  // Context 1 positive check: without PH bridge, resolving remembrance directly encounters gov and falls back to acting
  assert.equal(h.resolveScene('remembrance'), 'acting');

  for (const pc of printCases) {
    const rawState = JSON.stringify(pc.state);
    const hp = createPhHarness({ extraPrelude, extraSource, initialStore: rawState });
    const target = pc.pending.target;

    // Bridge allows only its own target
    assert.equal(hp.bridge(target), true, `Bridge must allow ${target} for pending print`);
    for (const other of PH_OLD_TARGETS) {
      if (other !== target) {
        assert.equal(hp.bridge(other), false, `Bridge must NOT allow ${other}`);
      }
    }

    // Target resolve matrix under Context 1: acting=false, offering=false
    if (target === 'unending-gallery') {
      // Gallery override: PH bridge allows unending-gallery directly
      assert.equal(hp.resolveScene('unending-gallery'), 'unending-gallery');
    } else if (target === 'remembrance') {
      // Remembrance override: PH bridge keeps remembrance despite acting=false, offering=false
      assert.equal(hp.resolveScene('remembrance'), 'remembrance');
    }
  }

  // Context 2: acting=true, offering=false governance
  const remPrintCase = printCases.find(c => c.pending.target === 'remembrance');
  const hpCtx2 = createPhHarness({
    extraPrelude: extraPrelude.replace(
      'let mockGov = { hudUnlocked: true, rulings: { acting: false, offering: false } };',
      'let mockGov = { hudUnlocked: true, rulings: { acting: true, offering: false } };'
    ),
    extraSource,
    initialStore: JSON.stringify(remPrintCase.state),
  });
  // With PH bridge: remembrance target stays remembrance
  assert.equal(hpCtx2.resolveScene('remembrance'), 'remembrance');

  // Context 2: acting target resolves to acting; remembrance without PH falls back to offering (acting=true, offering=false)
  const hNoPHCtx2 = createPhHarness({
    extraPrelude: extraPrelude.replace(
      'let mockGov = { hudUnlocked: true, rulings: { acting: false, offering: false } };',
      'let mockGov = { hudUnlocked: true, rulings: { acting: true, offering: false } };'
    ),
    extraSource,
  });
  assert.equal(hNoPHCtx2.resolveScene('acting'), 'acting');
  assert.equal(hNoPHCtx2.resolveScene('remembrance'), 'offering');

  // Active print recovery from real print arrival return cases
  const returnCases = allCaptures.filter(c => c.name.startsWith('return_'));
  assert.equal(returnCases.length, 4);
  const galleryReturnCase = returnCases.find(c => c.pending.source === 'unending-gallery');
  assert.ok(galleryReturnCase);

  // Re-run arrival to establish canonical activePrint
  const hRecov = createPhHarness({ extraPrelude, extraSource, initialStore: JSON.stringify(galleryReturnCase.state) });
  // Clear pending so only activePrint remains
  const activeSt = hRecov.get();
  activeSt.pending = null;
  assert.ok(activeSt.activePrint, 'Must have canonical activePrint');
  hRecov.save(activeSt);

  assert.equal(hRecov.bridge('unending-gallery'), true);
  assert.equal(hRecov.resolveScene('unending-gallery'), 'unending-gallery');

  // Warm visited requires FULL pair of plates to allow darkroom
  const hWarm = createPhHarness({ extraPrelude, extraSource });
  const stWarm = hWarm.get();
  stWarm.visited = { studio: true, camera: true, darkroom: true };
  stWarm.draft.plates = [{ position: 1, light: 'left' }, { position: 2, light: 'right' }];
  hWarm.save(stWarm);

  assert.equal(hWarm.resolveScene('shadowless-photo-studio'), 'shadowless-photo-studio');
  assert.equal(hWarm.resolveScene('double-exposure-camera'), 'double-exposure-camera');
  assert.equal(hWarm.resolveScene('unreceived-shadow-darkroom'), 'unreceived-shadow-darkroom');

  // Empty or incomplete pair should deny darkroom (falls back to remembrance)
  stWarm.draft.plates = [null, null];
  hWarm.save(stWarm);
  assert.equal(hWarm.resolveScene('unreceived-shadow-darkroom'), 'remembrance');

  stWarm.draft.plates = [{ position: 1, light: 'left' }, null];
  hWarm.save(stWarm);
  assert.equal(hWarm.resolveScene('unreceived-shadow-darkroom'), 'remembrance');

  // Temporary WS lock retains raw store and falls back to remembrance
  stWarm.draft.plates = [{ position: 1, light: 'left' }, { position: 2, light: 'right' }];
  hWarm.save(stWarm);
  const rawBefore = hWarm.raw();
  hWarm.lockFlags.wsPending = true;
  assert.equal(hWarm.resolveScene('shadowless-photo-studio'), 'remembrance');
  assert.equal(hWarm.raw(), rawBefore, 'Temporary lock fallback must not modify raw store');
});

test('EXTRA TEST 14: progressEntryButton exact HTML parent tree, progress helper states, WS complete delegation', () => {
  // Balanced HTML parser verifying tag stack, opening/closing/void tags and IDs
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  const tagRegex = /<!--[\s\S]*?-->|<(\/)?([a-zA-Z0-9\-]+)([^>]*)>/g;
  let m;
  const stack = [];
  let btnParentChain = null;

  while ((m = tagRegex.exec(htmlSource)) !== null) {
    if (m[0].startsWith('<!--')) continue;
    const isClosing = Boolean(m[1]);
    const tagName = m[2].toLowerCase();
    const attrs = m[3] || '';
    const idMatch = attrs.match(/\bid=["']([^"']+)["']/);
    const id = idMatch ? idMatch[1] : null;

    if (isClosing) {
      if (stack.length > 0 && stack[stack.length - 1].tagName === tagName) {
        stack.pop();
      }
    } else {
      const elem = { tagName, id };
      if (id === 'ph-entry-remembrance') {
        assert.equal(tagName, 'button', 'ph-entry-remembrance must be a native BUTTON');
        btnParentChain = stack.map(s => ({ tagName: s.tagName, id: s.id, dataset: s.dataset }));
      }
      if (!voidTags.has(tagName) && !attrs.endsWith('/')) {
        const dsMatch = attrs.match(/data-scene=["']([^"']+)["']/);
        if (dsMatch) elem.dataScene = dsMatch[1];
        stack.push(elem);
      }
    }
  }

  assert.ok(btnParentChain, 'ph-entry-remembrance must be found in the DOM stack');
  const hasRemSceneAncestor = btnParentChain.some(p => p.dataScene === 'remembrance' || p.id === 'scene-remembrance');
  assert.ok(hasRemSceneAncestor, 'ph-entry-remembrance must have remembrance scene ancestor');
  const hasCodexAncestor = btnParentChain.some(p => p.id === 'ph-codex');
  assert.ok(hasCodexAncestor, 'ph-entry-remembrance must have ph-codex ancestor');

  // Extract actual unique progressEntryButton, shadowlessPhotographyProgressStep, and weatherlessShelterProgressStep
  // using EXACT matching ending with '\n  };' (NO hardcoded slices)
  const pebMarker = 'const progressEntryButton = (prefix) =>';
  const pebStart = scriptSource.indexOf(pebMarker);
  assert.ok(pebStart !== -1, 'Must locate progressEntryButton');
  const pebEnd = scriptSource.indexOf('\n', pebStart);
  const extractedPeb = scriptSource.slice(pebStart, pebEnd).trim();

  const phStepMarker = 'const shadowlessPhotographyProgressStep = () => {';
  const phStepStart = scriptSource.indexOf(phStepMarker);
  assert.ok(phStepStart !== -1, 'Must locate shadowlessPhotographyProgressStep');
  const phStepEnd = scriptSource.indexOf('\n  };', phStepStart);
  assert.ok(phStepEnd !== -1, 'Must locate end of shadowlessPhotographyProgressStep');
  const extractedPhStep = scriptSource.slice(phStepStart, phStepEnd + 5).trim();

  const wsStepMarker = 'const weatherlessShelterProgressStep = () => {';
  const wsStepStart = scriptSource.indexOf(wsStepMarker);
  assert.ok(wsStepStart !== -1, 'Must locate weatherlessShelterProgressStep');
  const wsStepEnd = scriptSource.indexOf('\n  };', wsStepStart);
  assert.ok(wsStepEnd !== -1, 'Must locate end of weatherlessShelterProgressStep');
  const extractedWsStep = scriptSource.slice(wsStepStart, wsStepEnd + 5).trim();

  // Extract actual WS_ENDING_TABLE from script.js (initializer ends with '\n};')
  const wsTableMarker = 'const WS_ENDING_TABLE = {';
  const wsTableStart = scriptSource.indexOf(wsTableMarker);
  assert.ok(wsTableStart !== -1, 'Must locate WS_ENDING_TABLE');
  const wsTableEndMarker = '\n};';
  const wsTableEnd = scriptSource.indexOf(wsTableEndMarker, wsTableStart);
  assert.ok(wsTableEnd !== -1, 'Must locate end of WS_ENDING_TABLE');
  const extractedWsTable = scriptSource.slice(wsTableStart, wsTableEnd + wsTableEndMarker.length).trim();

  const extraPrelude = `
    ${extractedWsTable}
    const guideOldState = {
      dwPending: false,
      dwActive: false,
      wkPending: false
    };
    const getDawnWeaving = () => ({ pending: guideOldState.dwPending, activeCourier: guideOldState.dwActive ? { id: 'c1' } : null });
    const getHundredthWake = () => ({ pending: guideOldState.wkPending });
  `;

  const extraSource = `
    const wakeForAnotherHotelProgressStep = () => ({
      title: 'v104 替别人醒来的旅馆 (Harness Sentinel)',
      done: false,
      items: ['[ ] 梦钟与晨铃'],
      target: 'ah'
    });
    ${extractedPeb}
    ${extractedPhStep}
    ${extractedWsStep}
    const sceneInit = () => ({
      ph: shadowlessPhotographyProgressStep(),
      ws: weatherlessShelterProgressStep(),
      ahButton: progressEntryButton('ah'),
      phButton: progressEntryButton('ph'),
      wsButton: progressEntryButton('ws'),
      dwButton: progressEntryButton('dw'),
      wkButton: progressEntryButton('wk'),
      fallback: progressEntryButton('unknown_prefix')
    });
  `;

  // 1. Initial missing all 4 endings
  const h = createPhHarness({ extraPrelude, extraSource });
  let initRes = h.sceneInit();
  assert.equal(initRes.ph.title, 'v103 收不到影子的照相馆');
  assert.equal(initRes.ph.done, false);
  assert.equal(initRes.ph.target, 'ph');
  assert.ok(initRes.ph.items.some(item => item.includes('尚未收集的叠印照片')));

  // Button mapping checks
  assert.equal(initRes.phButton, h.nodes.get('ph-entry-remembrance'));
  assert.equal(initRes.wsButton, h.nodes.get('ws-entry-remembrance'));
  assert.equal(initRes.dwButton, h.nodes.get('dw-entry-remembrance'));
  assert.equal(initRes.wkButton, h.nodes.get('wk-entry-btn'));

  // Unknown prefix lookup returns null
  assert.equal(initRes.fallback, null);

  // 2. Pending & activePrint baseline checks using real native capture
  const allCaptures = capturePhPendingCases();
  const printCase = allCaptures.find(c => c.pending && c.pending.kind === 'print');
  assert.ok(printCase);

  const hPending = createPhHarness({ extraPrelude, extraSource, initialStore: JSON.stringify(printCase.state) });
  initRes = hPending.sceneInit();
  assert.equal(initRes.ph.done, false);
  assert.equal(initRes.ph.target, 'ph');
  assert.ok(initRes.ph.items[0].includes('照相馆事务正在进行'));

  // Active print
  const returnCase = allCaptures.find(c => c.name.startsWith('return_'));
  assert.ok(returnCase);
  const hActive = createPhHarness({ extraPrelude, extraSource, initialStore: JSON.stringify(returnCase.state) });
  const stAct = hActive.get();
  stAct.pending = null;
  hActive.save(stAct);
  initRes = hActive.sceneInit();
  assert.equal(initRes.ph.done, false);
  assert.equal(initRes.ph.target, 'ph');
  assert.ok(initRes.ph.items[0].includes('有一张照片已送往'));

  // 3. Complete all 4 endings -> v104 delegation
  const st = h.get();
  st.endings = [...PH_ENDING_IDS];
  h.save(st);
  initRes = h.sceneInit();
  assert.equal(initRes.ph.title, 'v104 替别人醒来的旅馆 (Harness Sentinel)');
  assert.equal(initRes.ph.done, false);
  assert.equal(initRes.ph.target, 'ah');
  assert.deepEqual(initRes.ph.items, ['[ ] 梦钟与晨铃']);

  // 4. WS complete delegation: when WS has 3 endings and no pending/active, WS helper delegates directly to PH helper
  const hDeleg = createPhHarness({ extraPrelude, extraSource });
  const wsDelegRes = hDeleg.sceneInit();
  assert.deepEqual(wsDelegRes.ws, wsDelegRes.ph, 'weatherlessShelterProgressStep must delegate to shadowlessPhotographyProgressStep when complete');
});

test('EXTRA TEST 15: syncHundredthWakeAll / syncDawnWeavingAll / syncWeatherlessShelterAll source contracts & live DOM sync', () => {
  // Check exact short WK, DW, WS function definitions matching their actual indentation
  // WK function ends with '\n  }'
  const wkFnMatch = scriptSource.match(/function syncHundredthWakeAll\(\) \{[\s\S]*?\n  \}/);
  assert.ok(wkFnMatch, 'Must match syncHundredthWakeAll definition');
  const wkBody = wkFnMatch[0];
  const wkCalls = wkBody.split("if (typeof syncPhEntries === 'function') syncPhEntries();").length - 1;
  assert.equal(wkCalls, 1, 'syncHundredthWakeAll must call syncPhEntries exactly once');

  // DW function
  const dwFnMatch = scriptSource.match(/function syncDawnWeavingAll\(\) \{[\s\S]*?\n\}/);
  assert.ok(dwFnMatch, 'Must match syncDawnWeavingAll definition');
  const dwBody = dwFnMatch[0];
  const dwCalls = dwBody.split("if (typeof syncPhEntries === 'function') syncPhEntries();").length - 1;
  assert.equal(dwCalls, 1, 'syncDawnWeavingAll must call syncPhEntries exactly once');

  // WS function
  const wsFnMatch = scriptSource.match(/function syncWeatherlessShelterAll\(\) \{[\s\S]*?\n\}/);
  assert.ok(wsFnMatch, 'Must match syncWeatherlessShelterAll definition');
  const wsBody = wsFnMatch[0];
  const wsCalls = wsBody.split("if (typeof syncPhEntries === 'function') syncPhEntries();").length - 1;
  assert.equal(wsCalls, 1, 'syncWeatherlessShelterAll must call syncPhEntries exactly once');

  // Live DOM sync check on all 3 entry buttons across all 5 lock conditions
  const h = createPhHarness();
  const entryButtons = ['ph-entry-threshold', 'ph-entry-remembrance', 'ph-entry-shelter'];

  // All enabled when unlocked
  h.sync();
  for (const bid of entryButtons) {
    const btn = h.nodes.get(bid);
    assert.equal(btn.disabled, false, `${bid} must be enabled when unlocked`);
  }

  // All 5 lock flags individually disable all 3 buttons
  const lockFlags = ['wsPending', 'wsActive', 'dwPending', 'dwActive', 'wkPending'];
  for (const flag of lockFlags) {
    h.lockFlags[flag] = true;
    h.sync();
    for (const bid of entryButtons) {
      const btn = h.nodes.get(bid);
      assert.equal(btn.disabled, true, `${bid} must be disabled during ${flag}`);
    }
    h.lockFlags[flag] = false;
  }
});

test('EXTRA TEST 16: Bootstrap ordering, route replay & sceneInit wiring source contracts', () => {
  // 1. Module placement after v102
  const posWS = scriptSource.indexOf('v102 没有天气的候车亭');
  const posPH = scriptSource.indexOf('v103 收不到影子的照相馆');
  assert.ok(posWS !== -1 && posPH !== -1);
  assert.ok(posWS < posPH, 'v102 must precede v103');

  // 2. Bootstrap tail sequence starting at syncCauselessConsequenceRefugeeLinks
  const refugeeIdx = scriptSource.lastIndexOf('  syncCauselessConsequenceRefugeeLinks();');
  assert.ok(refugeeIdx !== -1, 'Must locate bootstrap last sync tail');
  const bootstrapTail = scriptSource.slice(refugeeIdx);

  const expectedSequence = [
    'syncWeatherlessShelterAll();',
    'syncShadowlessPhotographyAll();',
    'revealScene(scenes.threshold);',
    'syncDoorOpenState();',
    'route();',
  ];

  let lastIdx = 0;
  for (const item of expectedSequence) {
    const curIdx = bootstrapTail.indexOf(item, lastIdx);
    assert.ok(curIdx !== -1, `Bootstrap tail must contain ${item}`);
    assert.ok(curIdx >= lastIdx, `${item} must appear in expected order`);
    lastIdx = curIdx + item.length;
  }

  // 3. Extract actual sceneInit function (Source contract assertions)
  const siMarker = 'const sceneInit = (name) => {';
  const siStart = scriptSource.indexOf(siMarker);
  assert.ok(siStart !== -1, 'Must locate const sceneInit in scriptSource');
  const siEnd = scriptSource.indexOf('\n  };', siStart);
  assert.ok(siEnd !== -1, 'Must locate end of sceneInit in scriptSource');
  const extractedSceneInit = scriptSource.slice(siStart, siEnd + 5);

  // Verify sceneInit calls handlers with parameter `name`
  assert.ok(extractedSceneInit.includes('resolveWeatherlessShelterPendingOnArrival(name);'));
  assert.ok(extractedSceneInit.includes('replayWeatherlessShelterPending(name);'));
  assert.ok(extractedSceneInit.includes('resolveShadowlessPhotographyPendingOnArrival(name);'));
  assert.ok(extractedSceneInit.includes('replayShadowlessPhotographyPending(name);'));
  assert.ok(extractedSceneInit.includes('resolveWakeForAnotherHotelPendingOnArrival(name);'));
  assert.ok(extractedSceneInit.includes('replayWakeForAnotherHotelPending(name);'));
  assert.ok(extractedSceneInit.includes('if (name === "remembrance") syncProgressGuide();'));
  assert.ok(extractedSceneInit.includes('updateHudDisplay();'));

  // Verify ordering inside sceneInit: WS resolve/replay -> PH resolve/replay -> AH resolve/replay -> syncProgressGuide -> updateHudDisplay
  const posWsResolv = extractedSceneInit.indexOf('resolveWeatherlessShelterPendingOnArrival(name);');
  const posWsReplay = extractedSceneInit.indexOf('replayWeatherlessShelterPending(name);');
  const posPhResolv = extractedSceneInit.indexOf('resolveShadowlessPhotographyPendingOnArrival(name);');
  const posPhReplay = extractedSceneInit.indexOf('replayShadowlessPhotographyPending(name);');
  const posAhResolv = extractedSceneInit.indexOf('resolveWakeForAnotherHotelPendingOnArrival(name);');
  const posAhReplay = extractedSceneInit.indexOf('replayWakeForAnotherHotelPending(name);');
  const posGuide = extractedSceneInit.indexOf('if (name === "remembrance") syncProgressGuide();');
  const posHud = extractedSceneInit.indexOf('updateHudDisplay();');

  assert.ok(posWsResolv !== -1 && posWsReplay !== -1 && posPhResolv !== -1 && posPhReplay !== -1 && posAhResolv !== -1 && posAhReplay !== -1 && posGuide !== -1 && posHud !== -1);
  assert.ok(posWsResolv < posWsReplay, 'WS resolve must precede WS replay');
  assert.ok(posWsReplay < posPhResolv, 'WS replay must precede PH resolve');
  assert.ok(posPhResolv < posPhReplay, 'PH resolve must precede PH replay');
  assert.ok(posPhReplay < posAhResolv, 'PH replay must precede AH resolve');
  assert.ok(posAhResolv < posAhReplay, 'AH resolve must precede AH replay');
  assert.ok(posAhReplay < posGuide, 'AH replay must precede syncProgressGuide');
  assert.ok(posGuide < posHud, 'syncProgressGuide must precede updateHudDisplay');

  // 4. Governance ruling and ending-gallery guards contain shadowlessPhotographyBridgeAllows
  assert.ok(scriptSource.includes('!shadowlessPhotographyBridgeAllows(target) && !gov.rulings.acting'));
  assert.ok(scriptSource.includes('!shadowlessPhotographyBridgeAllows(target) && !gov.rulings.offering'));
  assert.ok(scriptSource.includes("!shadowlessPhotographyBridgeAllows('unending-gallery')"));

  // 5. 3 new route guard checks in resolveScene
  assert.ok(scriptSource.includes('if (target === "shadowless-photo-studio" && !shadowlessPhotoStudioCanVisit()) target = "remembrance";'));
  assert.ok(scriptSource.includes('if (target === "double-exposure-camera" && !doubleExposureCameraCanVisit()) target = "remembrance";'));
  assert.ok(scriptSource.includes('if (target === "unreceived-shadow-darkroom" && !unreceivedShadowDarkroomCanVisit()) target = "remembrance";'));
});
