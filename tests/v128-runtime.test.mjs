#!/usr/bin/env node
// Independent runtime unit QA. The DOM/event facade is NOT a real browser.
// Usage: node tests/v128-runtime.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const RUNTIME = fileURLToPath(new URL('../warmth-garden.js', import.meta.url));
const RULES = fileURLToPath(new URL('../warmth-rules.js', import.meta.url));
const GARDEN = 'remaining-warmth-garden';
const PLACES = { window: 'threshold', drawer: 'offering', chair: 'unending-gallery' };
const TITLES = { window: '有一阵风认出了你', drawer: '没有被回答，也没有被烧尽', chair: '缺席也有了需要浇水的东西' };
const OLD = ['prayer-offer', 'prayer-input', 'ruling-offering-btn-a', 'ruling-offering-btn-b', 'continue-offering-btn'];
const PUBLIC = ['getState', 'unlocked', 'canVisit', 'bridgeAllows', 'onScene', 'sync', 'focusArrival', 'forget', 'progressStep'].sort();
const TOP = ['version', 'visited', 'outcomes', 'plantCount', 'lastPlant', 'draft', 'pending'].sort();
const json = value => JSON.parse(JSON.stringify(value));
const base = () => ({ version: 128, visited: false, outcomes: [], plantCount: 0, lastPlant: null, draft: null, pending: null });
const runtimeSource = fs.readFileSync(RUNTIME, 'utf8');
const ruleSource = fs.readFileSync(RULES, 'utf8');
const acceptedRulesSha = 'd935b2cfdefd9417aea070433fb4619855234942a9748d4eb7849d76deecbe72';
assert.equal(createHash('sha256').update(ruleSource).digest('hex'), acceptedRulesSha, 'This runtime suite must use the actually accepted Gemini rules bytes');
const sandbox = vm.createContext(Object.create(null));
vm.runInContext(ruleSource, sandbox, { filename: RULES });
vm.runInContext(`
  globalThis.__qaForbiddenCalls = 0;
  for (const name of ['window', 'document', 'localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest', 'navigator',
    'setTimeout', 'setInterval', 'requestAnimationFrame', 'crypto']) {
    Object.defineProperty(globalThis, name, { configurable: false, get() { __qaForbiddenCalls++; throw new Error('Unexpected direct global: ' + name); } });
  }
`, sandbox);
const beforeGlobals = vm.runInContext('Object.getOwnPropertyDescriptors(globalThis)', sandbox);
vm.runInContext(runtimeSource, sandbox, { filename: RUNTIME });
const factory = sandbox.GoddeadWarmthGarden;
const rules = sandbox.GoddeadWarmthRules.create();
let assertions = 0;
const ok = (v, label) => { assertions++; assert.ok(v, label); };
const eq = (a, b, label) => { assertions++; assert.deepEqual(a, b, label); };
const equalState = (a, b, label) => eq(json(a), json(b), label);
const tests = [], failures = [];
function test(name, fn) {
  const start = assertions;
  try { fn(); tests.push({ name, status: 'pass', assertions: assertions - start }); }
  catch (error) {
    const location = error.stack?.split('\n').find(line => /^\s+at file:/.test(line))?.trim();
    const detail = { name, status: 'fail', assertions: assertions - start, error: error.message.split('\n')[0], location };
    tests.push(detail); failures.push(detail);
  }
}

class Element {
  constructor(id, tag = 'div', attrs = {}) {
    this.id = id; this.tagName = tag.toUpperCase(); this.attributes = new Map();
    this.children = []; this.parentElement = null; this.listeners = new Map(); this.textContent = '';
    this.disabledAssignments = 0; this._disabled = false;
    this.attributes.set('id', id);
    for (const [k, v] of Object.entries(attrs)) this.setAttribute(k, v);
    this.classList = {
      contains: token => this.className.split(/\s+/).includes(token),
      add: (...tokens) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...tokens])].join(' '); },
      remove: (...tokens) => { this.className = this.className.split(/\s+/).filter(t => t && !tokens.includes(t)).join(' '); },
      toggle: (token, force) => { const yes = force === undefined ? !this.classList.contains(token) : Boolean(force); yes ? this.classList.add(token) : this.classList.remove(token); return yes; },
    };
    this.dataset = new Proxy({}, {
      get: (_, key) => this.getAttribute('data-' + String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase())) ?? undefined,
      set: (_, key, value) => { this.setAttribute('data-' + String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase()), value); return true; },
    });
  }
  appendChild(child) { child.parentElement = this; this.children.push(child); return child; }
  get className() { return this.getAttribute('class') || ''; }
  set className(v) { this.setAttribute('class', v); }
  get hidden() { return this.hasAttribute('hidden'); }
  set hidden(v) { v ? this.setAttribute('hidden', '') : this.removeAttribute('hidden'); }
  get inert() { return this.hasAttribute('inert'); }
  set inert(v) { v ? this.setAttribute('inert', '') : this.removeAttribute('inert'); }
  get disabled() { return this._disabled; }
  set disabled(v) { this.disabledAssignments++; this._disabled = Boolean(v); this._disabled ? this.attributes.set('disabled', '') : this.attributes.delete('disabled'); }
  setAttribute(k, v) { this.attributes.set(k, String(v)); if (k === 'disabled') { this.disabledAssignments++; this._disabled = true; } }
  getAttribute(k) { return this.attributes.has(k) ? this.attributes.get(k) : null; }
  hasAttribute(k) { return this.attributes.has(k); }
  removeAttribute(k) { this.attributes.delete(k); if (k === 'disabled') { this.disabledAssignments++; this._disabled = false; } }
  matches(selector) {
    return selector.split(',').some(part => {
      const s = part.trim();
      if (s.startsWith('#')) return this.id === s.slice(1);
      if (s.startsWith('.')) return s.slice(1).split('.').every(c => this.classList.contains(c));
      const m = s.match(/^\[([^=\]]+)(?:=["']?([^"'\]]*)["']?)?\]$/);
      if (m) return m[2] === undefined ? this.hasAttribute(m[1]) : this.getAttribute(m[1]) === m[2];
      return this.tagName.toLowerCase() === s.toLowerCase();
    });
  }
  closest(selector) { for (let e = this; e; e = e.parentElement) if (e.matches(selector)) return e; return null; }
  querySelectorAll(selector) { return this.children.flatMap(c => [...(c.matches(selector) ? [c] : []), ...c.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  contains(child) { return child === this || this.children.some(c => c.contains(child)); }
  addEventListener(type, handler, options) {
    const list = this.listeners.get(type) || []; list.push({ handler, capture: options === true || Boolean(options?.capture) }); this.listeners.set(type, list);
  }
  removeEventListener(type, handler) { this.listeners.set(type, (this.listeners.get(type) || []).filter(l => l.handler !== handler)); }
}

function makeDOM() {
  const doc = new Element('document', 'document'), byId = new Map();
  const add = (id, parent = doc, tag = 'div', attrs = {}) => { const el = new Element(id, tag, attrs); byId.set(id, el); parent.appendChild(el); return el; };
  doc.getElementById = id => byId.get(id) || null;
  const stage = add('stage'), scenes = {};
  for (const name of [GARDEN, 'offering', 'remembrance', 'threshold', 'unending-gallery', 'corridor']) scenes[name] = add('scene-' + name, stage, 'section', { class: 'scene', 'data-scene': name });
  const g = scenes[GARDEN], off = scenes.offering, rem = scenes.remembrance;
  add('rw-title', g, 'h2', { tabindex: '-1' }); add('rw-room-image', g, 'img'); add('rw-intro', g);
  add('rw-waiting', g, 'p', { hidden: '' });
  const empty = add('rw-empty', g); add('rw-last-plant', empty); add('rw-new-pot-btn', empty, 'button');
  const work = add('rw-workbench', g, 'div', { hidden: '' });
  for (const id of ['rw-case', 'rw-wish', 'rw-instructions', 'rw-progress', 'rw-preview', 'rw-feedback']) add(id, work);
  const grid = add('rw-grid', work, 'div', { role: 'group' });
  for (let i = 0; i < 9; i++) {
    const cell = add('rw-cell-' + i, grid, 'button', { class: 'rw-cell qa-preserve', 'data-rw-cell': i });
    for (const part of ['number', 'state', 'mark']) add(`qa-${i}-${part}`, cell, 'span', { ['data-rw-' + part]: '' });
  }
  for (const action of ['hint', 'undo', 'reset', 'hold', 'lower']) add('rw-' + action + '-btn', work, 'button', action === 'lower' ? { hidden: '' } : {});
  const placement = add('rw-placement', g, 'div', { hidden: '' });
  for (const p of Object.keys(PLACES)) add('rw-place-' + p, placement, 'button');
  for (const p of Object.keys(PLACES)) add('rw-collected-' + p, g);
  add('rw-collection-note', g);
  const offPanel = add('rw-offering-panel', off, 'div', { hidden: '' });
  for (const id of ['rw-offering-status', 'rw-offering-response']) add(id, offPanel);
  add('rw-enter-btn', offPanel, 'button');
  const entry = add('rw-entry-panel', rem, 'div', { hidden: '' });
  for (const id of ['rw-entry-note', 'rw-entry-response']) add(id, entry);
  add('rw-entry-btn', entry, 'button'); add('rw-resume-entry-btn', entry, 'button', { hidden: '' });
  const codex = add('rw-codex', entry, 'div', { class: 'codex-section' });
  add('rw-codex-summary', codex);
  for (const p of Object.keys(PLACES)) add('rw-codex-' + p, codex);
  for (const [p, scene] of Object.entries(PLACES)) {
    const echo = add('rw-echo-' + p, scenes[scene], 'div', { hidden: '' });
    add('rw-echo-' + p + '-title', echo, 'h3', { tabindex: '-1' });
  }
  const directory = add('directory'); add('remaining-warmth-garden-link', directory, 'a', { hidden: '', href: '#' + GARDEN });
  for (const id of OLD) add(id, off, id === 'prayer-input' ? 'input' : 'button');
  add('qa-old-child', byId.get('ruling-offering-btn-a'), 'span');
  add('qa-normal-exit', off, 'a', { href: '#corridor' });
  return { doc, byId, stage, scenes, el: id => byId.get(id) };
}

function harness({ state, raw, scene = GARDEN, ruling = 'A', qualified = true, busy = false, transition = false } = {}) {
  const dom = makeDOM();
  const h = { ...dom, scene, ruling, qualified, busy, transition, raw: raw === undefined ? (state === undefined ? null : JSON.stringify(state)) : raw,
    writes: [], writeAttempts: 0, schedules: [], clears: [], navigations: [], focus: [], captureCalls: 0, removed: 0, oldCalls: [], prayerReads: 0, unavailable: new Set(), timers: new Map() };
  Object.defineProperty(h.el('prayer-input'), 'value', { get() { h.prayerReads++; return 'PRIVATE TEST SENTINEL'; }, set() { throw Error('Runtime must not write prayer.value'); } });
  for (const id of OLD.filter(x => x !== 'prayer-input')) h.el(id).addEventListener('click', () => { h.oldCalls.push(id); if (id === 'prayer-offer') void h.el('prayer-input').value; });
  h.el('prayer-input').addEventListener('keydown', e => { if (e.key === 'Enter') { h.oldCalls.push('prayer-input'); void h.el('prayer-input').value; } });
  const config = {
    document: h.doc, rules,
    readRaw: () => h.raw,
    writeRaw: value => { h.writeAttempts++; if (typeof value !== 'string') throw Error('writeRaw must receive serialized chapter JSON'); h.raw = value; h.writes.push(json(JSON.parse(value))); },
    removeOwn: () => { h.raw = null; h.removed++; },
    currentScene: () => h.scene, unlocked: () => h.qualified, upstreamBusy: () => h.busy,
    transitionBusy: () => h.transition, captureRuling: () => { h.captureCalls++; return h.ruling; },
    buttonAvailable: id => { const e = h.el(id); return Boolean(e && !h.unavailable.has(id) && !e.disabled && !e.hidden && !e.closest('[hidden]')); },
    hasAdvance: source => h.timers.has(source),
    schedule: (source, target, delay, onFire) => { const record = { source, target, delay, onFire, owner: 'chapter' }; h.schedules.push(record); h.timers.set(source, record); },
    clearAdvance: source => { h.clears.push(source); h.timers.delete(source); },
    navigate: target => { h.navigations.push(target); },
    setArrivalFocus: el => h.focus.push(el.id), reduced: true,
  };
  h.api = factory.create(config);
  h.state = () => json(h.api.getState());
  h.dispatch = (id, type = 'click', options = {}) => {
    const target = h.el(id); if (!target) throw Error('Missing fixture element: ' + id);
    if (type === 'focus') h.doc.activeElement = target;
    if (type === 'blur' && h.doc.activeElement === target) h.doc.activeElement = null;
    const e = { type, target, currentTarget: null, isTrusted: options.isTrusted ?? true, key: options.key,
      defaultPrevented: false, stopped: false, immediate: false,
      preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; },
      stopImmediatePropagation() { this.immediate = true; this.stopped = true; } };
    const path = []; for (let el = target; el; el = el.parentElement) path.push(el);
    for (const el of [...path].reverse()) {
      for (const listener of el.listeners.get(type) || []) if (listener.capture) { e.currentTarget = el; listener.handler.call(el, e); if (e.immediate) break; }
      if (e.stopped) return e;
    }
    // Native focus/blur and pointerenter/leave participate in capture, but do
    // not bubble. A delegated non-capture listener must not pass accidentally.
    const bubblePath = ['focus', 'blur', 'pointerenter', 'pointerleave'].includes(type) ? [target] : path;
    for (const el of bubblePath) {
      for (const listener of el.listeners.get(type) || []) if (!listener.capture) { e.currentTarget = el; listener.handler.call(el, e); if (e.immediate) break; }
      if (e.stopped) break;
    }
    return e;
  };
  h.click = (id, options) => h.dispatch(id, 'click', options);
  h.arrive = (target, { transition = true } = {}) => {
    h.timers.clear(); // Actual host goScene clears timers before sceneInit.
    h.scene = target; h.transition = transition;
    h.api.onScene(target); h.api.focusArrival(target);
    h.transition = false; // Actual host does NOT call sync again here.
  };
  h.fire = source => { const record = h.timers.get(source); ok(record, 'scheduled timer exists'); h.timers.delete(source); record.onFire?.(); h.arrive(record.target); };
  h.externalTimer = source => h.timers.set(source, { source, owner: 'old' });
  h.effectSnapshot = () => JSON.stringify({ raw: h.raw, writes: h.writes.length, writeAttempts: h.writeAttempts, schedules: h.schedules.length, navigations: h.navigations,
    captureCalls: h.captureCalls, feedback: h.el('rw-feedback').textContent, cellClasses: Array.from({ length: 9 }, (_, i) => h.el('rw-cell-' + i).className) });
  h.api.sync();
  return h;
}

function draft(ruling = 'A', { solved = false, holding = false, moves = [] } = {}) {
  let d = rules.createDraft(ruling);
  for (const i of solved ? rules.solution(rules.initialBoard(ruling)) : moves) d = rules.move(d, i);
  return json(holding ? rules.hold(d, true) : d);
}
const activeState = (ruling = 'A', options = {}) => ({ ...base(), visited: true, draft: draft(ruling, options) });
function pendingState(ruling = 'A', placement = 'window') {
  const s = activeState(ruling, { solved: true, holding: true });
  s.pending = { kind: 'place', source: GARDEN, target: PLACES[placement], placement, capturedRuling: ruling }; return s;
}
const entered = () => ({ ...base(), visited: true });

test('frozen factory, exact 9 API, no unrelated global changes', () => {
  ok(Object.isFrozen(factory)); eq(Object.keys(factory), ['create']); const h = harness();
  ok(Object.isFrozen(h.api)); eq(Object.keys(h.api).sort(), PUBLIC);
  const after = vm.runInContext('Object.getOwnPropertyDescriptors(globalThis)', sandbox);
  eq(Reflect.ownKeys(after).filter(k => !Reflect.has(beforeGlobals, k)), ['GoddeadWarmthGarden']);
  for (const key of Reflect.ownKeys(beforeGlobals)) for (const field of ['value', 'get', 'set', 'writable', 'enumerable', 'configurable']) eq(after[key][field], beforeGlobals[key][field]);
});
test('empty factory/sync/get/progress/guards are storage-read-only and no automatic pot', () => {
  const h = harness({ scene: 'threshold' }); h.api.sync(); h.api.getState(); h.api.progressStep(); h.api.canVisit(); h.api.bridgeAllows('unending-gallery');
  equalState(h.state(), base()); eq(h.writes.length, 0); eq(h.schedules.length, 0); eq(h.navigations.length, 0); eq(h.captureCalls, 0);
  ok(h.el('remaining-warmth-garden-link').hidden); ok(!h.api.canVisit()); ok(!h.api.bridgeAllows('unending-gallery'));
});

for (const ruling of ['A', 'B', null]) for (const [placement, target] of Object.entries(PLACES)) test(`lifecycle ${ruling}/${placement} actual host transition order`, () => {
  const h = harness({ scene: 'offering', ruling }); h.click('rw-enter-btn');
  equalState(h.state().pending, { kind: 'enter', source: 'offering', target: GARDEN }); eq(h.captureCalls, 0); eq(h.state().draft, null);
  ok(h.api.canVisit()); ok(h.el('remaining-warmth-garden-link').hidden);
  h.fire('offering'); ok(h.state().visited); eq(h.state().pending, null); eq(h.state().draft, null); eq(h.captureCalls, 0);
  ok(!h.el('rw-new-pot-btn').disabled, 'entry render must remain usable after host releases veil without resync');
  ok(!h.el('remaining-warmth-garden-link').hidden);
  h.click('rw-new-pot-btn'); eq(h.captureCalls, 1); eq(h.state().draft.capturedRuling, ruling);
  const hintRaw = h.raw, hintWrites = h.writes.length; h.click('rw-hint-btn'); eq(h.raw, hintRaw); eq(h.writes.length, hintWrites);
  for (const i of rules.solution(rules.boardOf(h.state().draft))) h.click('rw-cell-' + i);
  eq(rules.boardOf(h.state().draft), 511); eq(h.state().plantCount, 0);
  h.click('rw-hold-btn'); ok(h.state().draft.holding); eq(h.state().plantCount, 0);
  h.click('rw-lower-btn'); ok(!h.state().draft.holding); eq(h.state().plantCount, 0);
  h.click('rw-hold-btn'); h.click('rw-place-' + placement);
  eq(h.state().pending.target, target); const writtenBeforeArrival = h.writes.length;
  h.click('rw-place-' + placement); eq(h.writes.length, writtenBeforeArrival, 'double placement only one pending');
  if (placement === 'chair') ok(h.api.bridgeAllows(target));
  h.fire(GARDEN); eq(h.writes.length, writtenBeforeArrival + 1, 'one atomic arrival write');
  equalState(h.state(), { ...base(), visited: true, outcomes: [placement], plantCount: 1, lastPlant: { placement, capturedRuling: ruling } });
  eq(h.writes.at(-1).draft, null); eq(h.writes.at(-1).pending, null); eq(h.focus.length, 1); eq(h.focus[0], 'rw-echo-' + placement + '-title');
  h.api.focusArrival(target); eq(h.focus.length, 1, 'focus token consumed');
  const cold = harness({ raw: h.raw, scene: target, ruling }); cold.arrive(target); eq(cold.writes.length, 0); eq(cold.focus.length, 0);
  cold.arrive(GARDEN); eq(cold.state().draft, null); eq(cold.captureCalls, 0); ok(cold.el('rw-placement').hidden);
  cold.click('rw-place-' + placement); eq(cold.writes.length, 0, 'readonly lastPlant cannot resubmit');
  cold.ruling = ruling === 'A' ? 'B' : 'A'; cold.click('rw-new-pot-btn'); eq(cold.captureCalls, 1); eq(cold.state().draft.capturedRuling, cold.ruling);
  cold.click('rw-cell-0'); const captured = cold.state().draft.capturedRuling; cold.ruling = null; cold.click('rw-reset-btn');
  eq(cold.state().draft.capturedRuling, captured); eq(cold.captureCalls, 1); eq(cold.state().draft.moves.length, 0);
});

const actionRecipes = [
  ['enter', 'rw-enter-btn', 'offering', () => base()],
  ['ordinary remembrance', 'rw-entry-btn', 'remembrance', () => entered()],
  ['resume remembrance', 'rw-resume-entry-btn', 'remembrance', () => activeState()],
  ['new pot', 'rw-new-pot-btn', GARDEN, () => entered()],
  ['cell', 'rw-cell-0', GARDEN, () => activeState('A', { moves: [1] })],
  ['hint', 'rw-hint-btn', GARDEN, () => activeState('A', { moves: [1] })],
  ['undo', 'rw-undo-btn', GARDEN, () => activeState('A', { moves: [1] })],
  ['reset', 'rw-reset-btn', GARDEN, () => activeState('A', { moves: [1] })],
  ['hold', 'rw-hold-btn', GARDEN, () => activeState('A', { solved: true })],
  ['lower', 'rw-lower-btn', GARDEN, () => activeState('A', { solved: true, holding: true })],
  ...Object.keys(PLACES).map(p => ['place ' + p, 'rw-place-' + p, GARDEN, () => activeState('A', { solved: true, holding: true })]),
];
const gates = {
  untrusted: () => ({ isTrusted: false }),
  'wrong source': h => { h.scene = 'corridor'; },
  'lost qualification': h => { h.qualified = false; },
  'old upstream busy': h => { h.busy = true; },
  'existing source timer': (h, id, source) => { h.externalTimer(source); },
  'host transition': h => { h.transition = true; },
  'host unavailable': (h, id) => { h.unavailable.add(id); },
  'native disabled': (h, id) => { h.el(id).disabled = true; },
  'button hidden': (h, id) => { h.el(id).hidden = true; },
  'ancestor hidden': h => { h.stage.hidden = true; },
  'button inert': (h, id) => { h.el(id).inert = true; },
  'ancestor inert': h => { h.stage.inert = true; },
};
for (const [name, id, source, makeState] of actionRecipes) test(`${name} accepts ordinary trusted available action`, () => {
  const h = harness({ scene: source, state: makeState() }); const before = h.effectSnapshot();
  h.click(id); ok(h.effectSnapshot() !== before, 'positive control prevents vacuous gate acceptance');
});
for (const [name, id, source, makeState] of actionRecipes) for (const [gate, setGate] of Object.entries(gates)) test(`${name} rejects ${gate}`, () => {
  const h = harness({ scene: source, state: makeState() }); const options = setGate(h, id, source) || {};
  const before = h.effectSnapshot(); h.click(id, options); eq(h.effectSnapshot(), before, 'blocked action has no mutation/navigation/feedback effect');
});
for (const [name, id, source, makeState] of actionRecipes.filter(a => a[0] !== 'resume remembrance')) test(`${name} rejects own pending`, () => {
  const state = makeState(); state.pending = { kind: 'enter', source: 'offering', target: GARDEN };
  const h = harness({ scene: source, state }); const before = h.effectSnapshot(); h.click(id); eq(h.effectSnapshot(), before);
});
for (const [name, id, source, makeState] of actionRecipes) for (const gate of ['busy', 'unqualified', 'wrong scene']) test(`${name} native disabled for ${gate}`, () => {
  const h = harness({ scene: source, state: makeState() });
  if (gate === 'busy') h.busy = true; if (gate === 'unqualified') h.qualified = false; if (gate === 'wrong scene') h.scene = 'corridor';
  h.api.sync(); ok(h.el(id).disabled, 'new native control accurately disabled');
});

test('read-only sync/progress/get do not settle, cancel, replay or navigate', () => {
  for (const scene of [GARDEN, 'threshold', 'corridor']) {
    const h = harness({ state: pendingState(), scene }); const raw = h.raw;
    for (let i = 0; i < 3; i++) { h.api.sync(); h.api.getState(); h.api.progressStep(); h.api.canVisit(); }
    eq(h.raw, raw); eq(h.writes.length, 0); eq(h.schedules.length, 0); eq(h.navigations.length, 0);
  }
});
for (const kind of ['enter', 'place']) test(`${kind} source cold replay ignores transitionBusy without rewriting pending`, () => {
  const state = kind === 'enter' ? { ...base(), pending: { kind: 'enter', source: 'offering', target: GARDEN } } : pendingState();
  const h = harness({ state, scene: state.pending.source }); const raw = h.raw;
  h.arrive(state.pending.source); eq(h.raw, raw); eq(h.writes.length, 0); eq(h.schedules.length, 1); eq(h.schedules[0].target, state.pending.target);
});
for (const ruling of ['A', 'B', null]) for (const [placement, target] of Object.entries(PLACES)) {
  test(`cold pending ${ruling}/${placement} target settles once with no live timer`, () => {
    const state = pendingState(ruling, placement);
    const h = harness({ state, scene: target, ruling });
    eq(h.schedules.length, 0); eq(h.writes.length, 0);
    h.arrive(target);
    equalState(h.state(), { ...entered(), outcomes: [placement], plantCount: 1, lastPlant: { placement, capturedRuling: ruling } });
    eq(h.writes.length, 1); eq(h.captureCalls, 0); eq(h.schedules.length, 0);
    eq(h.focus, ['rw-echo-' + placement + '-title']);
    h.arrive(target); eq(h.writes.length, 1); eq(h.focus.length, 1);
  });
  test(`cold pending ${ruling}/${placement} source replay then actual target arrival`, () => {
    const state = pendingState(ruling, placement);
    const h = harness({ state, scene: GARDEN, ruling }); const raw = h.raw;
    h.arrive(GARDEN); eq(h.raw, raw); eq(h.writes.length, 0);
    eq(h.schedules.length, 1); eq(h.schedules[0].target, target);
    h.api.onScene(GARDEN); eq(h.schedules.length, 1, 'same-source route cannot duplicate an owned advance');
    h.fire(GARDEN); eq(h.state().plantCount, 1); eq(h.state().draft, null); eq(h.state().pending, null);
    eq(h.writes.length, 1); eq(h.captureCalls, 0);
  });
}
for (const kind of ['enter', 'place']) for (const where of ['source', 'target', 'third']) test(`${kind} upstream busy ${where} arrival`, () => {
  const state = kind === 'enter' ? { ...base(), pending: { kind: 'enter', source: 'offering', target: GARDEN } } : pendingState();
  const scene = where === 'third' ? 'corridor' : state.pending[where];
  const h = harness({ state, scene, busy: true }); const raw = h.raw;
  h.arrive(scene); eq(h.schedules.length, 0);
  if (where === 'third') { eq(h.state().pending, null); equalState(h.state().draft, state.draft); eq(h.writes.length, 1); }
  else { eq(h.raw, raw); eq(h.writes.length, 0); ok(h.state().pending); }
});
test('onScene ignores claimed scene differing from currentScene', () => {
  const h = harness({ state: pendingState(), scene: GARDEN }); const raw = h.raw;
  h.api.onScene('threshold'); eq(h.raw, raw); eq(h.writes.length, 0); eq(h.schedules.length, 0);
});
test('lost qualification preserves raw and pending at source/target; closes garden/gallery guard', () => {
  for (const placement of Object.keys(PLACES)) for (const scene of [GARDEN, PLACES[placement]]) {
    const h = harness({ state: pendingState('B', placement), scene, qualified: false }); const raw = h.raw;
    h.arrive(scene); h.api.sync(); eq(h.raw, raw); eq(h.writes.length, 0); eq(h.schedules.length, 0);
    ok(!h.api.canVisit()); ok(!h.api.bridgeAllows('unending-gallery')); eq(h.api.progressStep(), null);
  }
});

test('source replay first lock keeps existing old timer', () => {
  const h = harness({ state: pendingState(), scene: GARDEN }); h.externalTimer(GARDEN); h.transition = true; h.api.onScene(GARDEN);
  eq(h.schedules.length, 0); eq(h.timers.get(GARDEN).owner, 'old'); eq(h.writes.length, 0);
});
for (const source of ['offering', GARDEN]) test(`forget clears only owned ${source} source`, () => {
  const state = source === 'offering' ? base() : activeState('A', { solved: true, holding: true });
  const h = harness({ state, scene: source }); h.click(source === 'offering' ? 'rw-enter-btn' : 'rw-place-window');
  const other = source === 'offering' ? GARDEN : 'offering'; h.externalTimer(other); h.api.forget();
  eq(h.clears, [source]); eq(h.timers.get(other)?.owner, 'old'); eq(h.removed, 1); eq(h.raw, null); eq(h.state().draft, null);
});
test('offpath route cancellation does not clear an old timer installed in sceneInit', () => {
  const h = harness({ state: activeState('A', { solved: true, holding: true }), scene: GARDEN }); h.click('rw-place-window');
  h.timers.clear(); h.scene = 'corridor'; h.externalTimer(GARDEN); h.transition = true; h.api.onScene('corridor'); h.transition = false;
  eq(h.state().pending, null); ok(h.state().draft.holding); eq(h.clears, []); eq(h.timers.get(GARDEN)?.owner, 'old');
  h.api.forget(); eq(h.clears, [], 'old timer cannot retain stale chapter ownership');
});
test('fired timer releases ownership before route; subsequent forget leaves old timers', () => {
  const h = harness({ state: activeState('A', { solved: true, holding: true }), scene: GARDEN }); h.click('rw-place-window'); h.fire(GARDEN);
  h.externalTimer(GARDEN); h.externalTimer('offering'); h.api.forget(); eq(h.clears, []); eq(h.timers.size, 2);
});
for (const kind of ['enter', 'place']) for (const gate of ['busy', 'unqualified']) test(`${kind} actual target route releases timer ownership even if ${gate} postpones settlement`, () => {
  const source = kind === 'enter' ? 'offering' : GARDEN;
  const target = kind === 'enter' ? GARDEN : 'threshold';
  const h = harness({ scene: source, state: kind === 'enter' ? base() : activeState('A', { solved: true, holding: true }) });
  h.click(kind === 'enter' ? 'rw-enter-btn' : 'rw-place-window'); eq(h.timers.get(source)?.owner, 'chapter');
  if (gate === 'busy') h.busy = true; else h.qualified = false;
  h.arrive(target); ok(h.state().pending, 'postponed transaction remains intact'); eq(h.timers.size, 0);
  h.externalTimer(source); h.api.forget(); eq(h.clears, [], 'route already cleared chapter timer; this later timer is not owned');
  eq(h.timers.get(source)?.owner, 'old');
});
test('same-source onScene retains a real owned timer for later forget', () => {
  const h = harness({ scene: 'offering' }); h.click('rw-enter-btn');
  h.api.onScene('offering'); eq(h.schedules.length, 1); eq(h.timers.get('offering')?.owner, 'chapter');
  h.api.forget(); eq(h.clears, ['offering']); eq(h.timers.size, 0);
});

for (const cold of [false, true]) test(`offering capture gate ${cold ? 'cold pending' : 'new first'} blocks four clicks and Enter, preserves privacy`, () => {
  const state = cold ? { ...base(), pending: { kind: 'enter', source: 'offering', target: GARDEN } } : base();
  const h = harness({ state, scene: 'offering' }); if (!cold) h.click('rw-enter-btn');
  for (const trusted of [false, true]) {
    for (const id of ['prayer-offer', 'ruling-offering-btn-a', 'ruling-offering-btn-b', 'continue-offering-btn', 'qa-old-child']) {
      const e = h.click(id, { isTrusted: trusted }); ok(e.defaultPrevented && e.immediate, 'capture precedes target handler');
    }
    const e = h.dispatch('prayer-input', 'keydown', { key: 'Enter', isTrusted: trusted }); ok(e.defaultPrevented && e.immediate);
  }
  eq(h.oldCalls, []); eq(h.prayerReads, 0); ok(!h.click('qa-normal-exit').defaultPrevented);
  for (const id of OLD) eq(h.el(id).disabledAssignments, 0, 'old native disabled untouched');
  h.arrive('corridor'); for (const id of OLD) ok(!h.el(id).inert, 'chapter-owned inert released');
});
test('old first existing timer prevents new enter and chapter storage write', () => {
  const h = harness({ scene: 'offering' }); h.externalTimer('offering'); const raw = h.raw; h.click('rw-enter-btn');
  eq(h.raw, raw); eq(h.writes.length, 0); eq(h.schedules.length, 0); eq(h.timers.get('offering').owner, 'old');
});
test('old lock preserves preexisting attributes and external changes, never disabled', () => {
  const h = harness({ scene: 'offering' }); const a = h.el('prayer-offer'), b = h.el('ruling-offering-btn-a');
  a.setAttribute('inert', ''); a.setAttribute('aria-disabled', 'preexisting'); a.setAttribute('data-rw-locked', 'old-owner'); a.disabled = true;
  const oldDisabledWrites = a.disabledAssignments; h.click('rw-enter-btn');
  b.setAttribute('aria-disabled', 'external-owner'); b.setAttribute('data-rw-locked', 'external-owner'); b.disabled = true;
  const bWrites = b.disabledAssignments; h.arrive('corridor');
  ok(a.inert); eq(a.getAttribute('aria-disabled'), 'preexisting'); eq(a.getAttribute('data-rw-locked'), 'old-owner'); ok(a.disabled); eq(a.disabledAssignments, oldDisabledWrites);
  eq(b.getAttribute('aria-disabled'), 'external-owner'); eq(b.getAttribute('data-rw-locked'), 'external-owner'); ok(b.disabled); eq(b.disabledAssignments, bWrites);
});
test('old lock retains exact preexisting inert value', () => {
  const h = harness({ scene: 'offering' }), el = h.el('prayer-offer');
  el.setAttribute('inert', 'preexisting-owner'); h.click('rw-enter-btn'); h.arrive('corridor');
  eq(el.getAttribute('inert'), 'preexisting-owner'); eq(el.disabledAssignments, 0);
});
test('old lock release leaves a changed external inert value', () => {
  const h = harness({ scene: 'offering' }), el = h.el('prayer-offer');
  h.click('rw-enter-btn'); el.setAttribute('inert', 'external-owner'); h.arrive('corridor');
  eq(el.getAttribute('inert'), 'external-owner'); eq(el.disabledAssignments, 0);
});

const history = () => ({ ...pendingState('A', 'window'), outcomes: ['drawer'], plantCount: 1, lastPlant: { placement: 'drawer', capturedRuling: 'B' } });
for (const kind of ['enter', 'place']) {
  const validPending = kind === 'enter' ? { kind: 'enter', source: 'offering', target: GARDEN } : history().pending;
  for (const field of Object.keys(validPending)) for (const mutation of ['missing', 'replacement-extra', 'invalid']) test(`bad ${kind} pending ${field} ${mutation} preserves draft/history`, () => {
    const state = history(); state.pending = { ...validPending };
    if (mutation !== 'invalid') delete state.pending[field];
    if (mutation === 'replacement-extra') state.pending.extra = 'bad';
    if (mutation === 'invalid') state.pending[field] = field === 'capturedRuling' ? 'B' : 'invalid';
    const h = harness({ state }); const expected = { ...state, pending: null };
    equalState(h.state(), expected); eq(h.writes.length, 0); eq(h.raw, JSON.stringify(state));
  });
  test(`extra ${kind} pending field preserves draft/history`, () => {
    const state = history(); state.pending = { ...validPending, extra: true }; const h = harness({ state });
    equalState(h.state(), { ...state, pending: null }); eq(h.writes.length, 0);
  });
}
test('invalid draft drops only draft and dependent place pending, keeps history', () => {
  const state = history(); state.draft.extra = true; const h = harness({ state });
  equalState(h.state(), { ...state, draft: null, pending: null }); eq(h.writes.length, 0);
});
for (const value of [false, true, 7, 'place', [], ['place'], {}]) test(`bad pending container ${JSON.stringify(value)} preserves draft/history`, () => {
  const state = history(); state.pending = value; const h = harness({ state });
  equalState(h.state(), { ...state, pending: null }); eq(h.writeAttempts, 0); eq(h.raw, JSON.stringify(state));
});
test('bad draft does not discard independent legal enter pending or collected history', () => {
  const state = history(); state.draft.moves = ['0']; state.pending = { kind: 'enter', source: 'offering', target: GARDEN };
  const h = harness({ state, scene: 'offering' });
  equalState(h.state(), { ...state, draft: null }); eq(h.writeAttempts, 0);
});
for (const state of [
  { ...activeState(), visited: false },
  { ...history(), visited: false },
  { ...entered(), visited: 1 },
  { ...entered(), version: 127 },
]) test(`invalid base consistency ${JSON.stringify({ visited: state.visited, version: state.version, count: state.plantCount, draft: !!state.draft })} defaults read-only`, () => {
  const h = harness({ state }); equalState(h.state(), base()); eq(h.writeAttempts, 0); eq(h.raw, JSON.stringify(state));
});
for (const field of TOP) for (const mutation of ['missing', 'extra']) test(`invalid top ${field} ${mutation} defaults without raw rewrite`, () => {
  const state = history(); if (mutation === 'missing') delete state[field]; else state['extra-' + field] = true;
  const h = harness({ state }); equalState(h.state(), base()); eq(h.raw, JSON.stringify(state)); eq(h.writes.length, 0);
});
for (const count of [-1, 10000, 0.5, '1', null]) test(`invalid count ${String(count)} defaults`, () => {
  const state = history(); state.plantCount = count; const h = harness({ state }); equalState(h.state(), base()); eq(h.writes.length, 0);
});
test('outcomes normalize distinct fixed order; count/lastPlant consistency', () => {
  const state = { ...entered(), outcomes: ['chair', 'window', 'chair', 'drawer'], plantCount: 3, lastPlant: { placement: 'chair', capturedRuling: null } };
  const h = harness({ state }); eq(h.state().outcomes, ['window', 'drawer', 'chair']); eq(h.writes.length, 0);
  for (const bad of [
    { ...state, plantCount: 2 }, { ...state, plantCount: 0 }, { ...state, outcomes: ['unknown'] },
    { ...state, lastPlant: null }, { ...state, lastPlant: { ...state.lastPlant, extra: true } },
    { ...state, lastPlant: { placement: 'window' } }, { ...state, lastPlant: { placement: 'chair', capturedRuling: 'C' } },
  ]) equalState(harness({ state: bad }).state(), base());
});
test('count saturates at9999 but atomically consumes each new completed draft', () => {
  const state = history(); state.plantCount = 9999; const h = harness({ state, scene: 'threshold' }); h.arrive('threshold');
  eq(h.state().plantCount, 9999); eq(h.state().draft, null); eq(h.state().pending, null); eq(h.writes.length, 1);
});
test('successive new pots accumulate canonical outcomes, repeated placement increments only new pot count', () => {
  let prior = entered();
  for (const [index, [placement, ruling]] of [['chair', null], ['drawer', 'B'], ['window', 'A'], ['chair', 'A']].entries()) {
    const state = { ...prior, draft: draft(ruling, { solved: true, holding: true }), pending: pendingState(ruling, placement).pending };
    const h = harness({ state, scene: PLACES[placement] }); h.arrive(PLACES[placement]);
    eq(h.state().plantCount, index + 1); eq(h.state().draft, null); eq(h.state().pending, null); eq(h.writes.length, 1);
    equalState(h.state().lastPlant, { placement, capturedRuling: ruling });
    const expected = Object.keys(PLACES).filter(p => prior.outcomes.includes(p) || p === placement);
    eq(h.state().outcomes, expected);
    h.arrive(PLACES[placement]); eq(h.state().plantCount, index + 1); eq(h.writes.length, 1);
    prior = h.state();
  }
  eq(prior.outcomes, ['window', 'drawer', 'chair']); eq(prior.plantCount, 4);
});

test('runtime long history/checkpoint/undo/reload delegates accepted pure rules', () => {
  let h = harness({ state: activeState(null), scene: GARDEN }), expected = rules.createDraft(null);
  for (let n = 0; n < 81; n++) {
    const i = (n * 7 + Math.floor(n / 5)) % 9; h.click('rw-cell-' + i); expected = rules.move(expected, i);
    equalState(h.state().draft, expected); if (n % 17 === 0) h = harness({ raw: h.raw, scene: GARDEN });
  }
  eq(h.state().draft.moves.length, 64);
  for (let n = 0; n < 64; n++) { h.click('rw-undo-btn'); expected = rules.undo(expected); equalState(h.state().draft, expected); }
  ok(h.el('rw-undo-btn').disabled); eq(h.state().draft.baseParity, expected.baseParity);
  if (expected.baseParity !== 0) ok(/较早|检查点/.test(h.el('rw-progress').textContent + h.el('rw-feedback').textContent), 'checkpoint explanation visible');
  const raw = h.raw; h.click('rw-undo-btn'); eq(h.raw, raw);
});
test('grid class/spans, native disabled, focus/pointer previews and hint are truthful', () => {
  const h = harness({ state: activeState(null), scene: GARDEN });
  for (let i = 0; i < 9; i++) {
    const e = h.el('rw-cell-' + i); ok(e.classList.contains('rw-cell')); ok(e.classList.contains('qa-preserve'));
    eq(e.querySelector('[data-rw-number]').textContent, String(i + 1)); eq(e.querySelector('[data-rw-state]').textContent, '冷'); eq(e.querySelector('[data-rw-mark]').textContent, '○');
    eq(e.getAttribute('aria-pressed'), 'false'); ok(!e.disabled);
  }
  for (const i of [0, 1, 4]) {
    h.dispatch('rw-cell-' + i, 'focus'); const affected = Array.from(rules.affected(i));
    const marked = Array.from({ length: 9 }, (_, index) => index).filter(index => h.el('rw-cell-' + index).classList.contains('is-preview'));
    eq(marked, affected); const text = h.el('rw-preview').textContent;
    for (const index of affected) ok(text.includes(String(index + 1)), 'focus preview includes actual affected index');
    h.dispatch('rw-cell-8', 'pointerenter'); h.dispatch('rw-cell-8', 'pointerleave');
    eq(Array.from({ length: 9 }, (_, index) => index).filter(index => h.el('rw-cell-' + index).classList.contains('is-preview')), affected, 'pointer leaving preserves keyboard preview');
    h.dispatch('rw-cell-' + i, 'blur'); eq(h.el('rw-preview').textContent, '');
  }
  h.dispatch('rw-cell-0', 'pointerenter'); h.dispatch('rw-cell-4', 'focus'); h.dispatch('rw-cell-4', 'blur');
  eq(Array.from({ length: 9 }, (_, i) => i).filter(i => h.el('rw-cell-' + i).classList.contains('is-preview')), Array.from(rules.affected(0)), 'blur preserves still-hovered preview');
  h.dispatch('rw-cell-0', 'pointerleave'); eq(h.el('rw-preview').textContent, '');
  const raw = h.raw; h.click('rw-hint-btn'); eq(h.raw, raw); const expectedHint = rules.hint(0);
  eq(Array.from({ length: 9 }, (_, i) => i).filter(i => h.el('rw-cell-' + i).classList.contains('is-hint')), [expectedHint]);
  h.click('rw-cell-' + expectedHint); ok(!h.el('rw-cell-' + expectedHint).classList.contains('is-hint'));
});
test('native action-specific disabled and placement visibility', () => {
  const cold = harness({ state: activeState(), scene: GARDEN }); ok(cold.el('rw-hold-btn').disabled); ok(cold.el('rw-undo-btn').disabled); ok(cold.el('rw-placement').hidden);
  const held = harness({ state: activeState('A', { solved: true, holding: true }), scene: GARDEN });
  for (const id of ['rw-cell-0', 'rw-hint-btn', 'rw-undo-btn', 'rw-reset-btn']) ok(held.el(id).disabled, id);
  ok(!held.el('rw-lower-btn').disabled); ok(!held.el('rw-placement').hidden);
  for (const p of Object.keys(PLACES)) ok(!held.el('rw-place-' + p).disabled);
  const pending = harness({ state: pendingState(), scene: GARDEN });
  for (const id of ['rw-lower-btn', ...Object.keys(PLACES).map(p => 'rw-place-' + p)]) ok(pending.el(id).disabled, id);
});
for (const placement of Object.keys(PLACES)) test(`same-instance ${placement} completion hides placement panel before garden revisit`, () => {
  const h = harness({ state: activeState('A', { solved: true, holding: true }), scene: GARDEN });
  ok(!h.el('rw-placement').hidden); h.click('rw-place-' + placement); h.fire(GARDEN);
  eq(h.state().draft, null); ok(h.el('rw-placement').hidden, 'consumed pot cannot retain visible placement controls');
  h.arrive(GARDEN); ok(h.el('rw-placement').hidden); ok(!h.el('rw-empty').hidden); ok(h.el('rw-workbench').hidden);
  for (const p of Object.keys(PLACES)) ok(h.el('rw-place-' + p).disabled, 'hidden controls also reflect no active pot');
});
for (const target of [GARDEN, 'corridor']) test(`enter response is not stale after actual ${target} arrival`, () => {
  const h = harness({ scene: 'offering' }); h.click('rw-enter-btn');
  const old = h.el('rw-offering-response').textContent; ok(old.length > 0);
  h.arrive(target); ok(h.el('rw-offering-response').textContent !== old, 'old in-transit message must be cleared or replaced');
  eq(h.state().pending, null);
});
for (const target of ['threshold', 'corridor']) test(`place response is not stale after actual ${target} arrival`, () => {
  const h = harness({ state: activeState('A', { solved: true, holding: true }), scene: GARDEN }); h.click('rw-place-window');
  const old = h.el('rw-feedback').textContent; ok(old.length > 0);
  h.arrive(target); ok(h.el('rw-feedback').textContent !== old, 'old leaving message must not persist after completion/cancel');
  eq(h.state().pending, null);
});
test('forget clears all chapter response panels without leaving a visible pot selector', () => {
  const h = harness({ state: activeState('A', { solved: true, holding: true }), scene: GARDEN });
  for (const id of ['rw-entry-response', 'rw-offering-response', 'rw-feedback', 'rw-preview']) h.el(id).textContent = 'QA stale response';
  h.api.forget();
  for (const id of ['rw-entry-response', 'rw-offering-response', 'rw-feedback', 'rw-preview']) eq(h.el(id).textContent, '', id);
  ok(h.el('rw-placement').hidden); eq(h.raw, null);
});
test('directory requires actual visited; gallery bridge is narrow and qualification-dependent', () => {
  for (const state of [base(), { ...base(), pending: { kind: 'enter', source: 'offering', target: GARDEN } }]) ok(harness({ state }).el('remaining-warmth-garden-link').hidden);
  const h = harness({ state: pendingState(null, 'chair') }); ok(!h.el('remaining-warmth-garden-link').hidden); ok(h.api.bridgeAllows('unending-gallery'));
  for (const target of ['offering', 'threshold', GARDEN, 'unknown']) ok(!h.api.bridgeAllows(target));
  h.qualified = false; h.api.sync(); ok(h.el('remaining-warmth-garden-link').hidden); ok(!h.api.bridgeAllows('unending-gallery'));
});
test('guide prioritizes activity, uses visible targets and empty pending receipt ID', () => {
  const h = harness({ state: history(), scene: 'remembrance' }); const raw = h.raw, pending = h.api.progressStep();
  eq(pending.done, false); eq(pending.target, 'rw-resume'); eq(pending.receiptId, ''); eq(pending.destination, 'threshold');
  ok(!h.el('rw-resume-entry-btn').hidden); eq(h.raw, raw); eq(h.writes.length, 0);
  const completed = { ...entered(), outcomes: ['drawer'], plantCount: 1, lastPlant: { placement: 'drawer', capturedRuling: null } };
  const done = harness({ state: completed, scene: 'remembrance' }); ok(done.api.progressStep().done); eq(done.api.progressStep().target, 'rw');
  ok(done.el('rw-codex-drawer').textContent.includes(TITLES.drawer));
});
test('focus one-shot only for actual matching qualified arrival; stale token discarded offpath', () => {
  const h = harness({ state: pendingState('A', 'chair'), scene: 'unending-gallery' }); h.api.onScene('unending-gallery');
  h.api.focusArrival('threshold'); eq(h.focus.length, 0);
  h.scene = 'corridor'; h.api.onScene('corridor'); h.scene = 'unending-gallery'; h.api.focusArrival('unending-gallery'); eq(h.focus.length, 0);
  const q = harness({ state: pendingState(), scene: 'threshold' }); q.api.onScene('threshold'); q.qualified = false; q.api.focusArrival('threshold'); eq(q.focus.length, 0);
});
test('every recorded write has exactly seven JSON fields, no secret or borrowed key', () => {
  const h = harness({ state: activeState('B'), scene: GARDEN }); h.click('rw-cell-0'); h.click('rw-reset-btn');
  for (const s of h.writes) { eq(Object.keys(s).sort(), TOP); ok(!JSON.stringify(s).includes('PRIVATE TEST SENTINEL')); eq(s.version, 128); }
  eq(h.prayerReads, 0);
});

test('corrupt/nonobject JSON is default without rewriting raw', () => {
  for (const raw of ['{bad', 'null', '[]', '"text"', 'false', '128', '{"version":128}']) {
    const h = harness({ raw }); equalState(h.state(), base()); h.api.sync(); h.api.progressStep(); eq(h.raw, raw); eq(h.writeAttempts, 0);
  }
});
test('getState returns independent drafts, arrays, pending and lastPlant', () => {
  const h = harness({ state: history() }); const raw = h.raw, output = h.api.getState();
  output.outcomes.push('chair'); output.draft.moves.push(1); output.pending.target = 'unknown'; output.lastPlant.capturedRuling = null;
  equalState(h.state(), history()); eq(h.raw, raw); eq(h.writeAttempts, 0);
});
test('waiting status is meaningful only while upstream work is busy and read-only', () => {
  const h = harness({ state: activeState(), busy: true }); const raw = h.raw;
  ok(!h.el('rw-waiting').hidden); ok(h.el('rw-waiting').textContent.length > 0);
  h.busy = false; h.api.sync(); ok(h.el('rw-waiting').hidden); eq(h.raw, raw); eq(h.writeAttempts, 0);
});
test('old-room waiting copy names upstream work rather than private prayer', () => {
  const h = harness({ state: entered(), scene: 'offering', busy: true });
  const offering = h.el('rw-offering-status').textContent, entry = h.el('rw-entry-note').textContent;
  ok(!/祷告|祷词/.test(offering)); ok(/清晨|晨光|名签|回执|前置|上游|旧事/.test(offering));
  ok(/清晨|晨光|名签|回执|前置|上游|旧事/.test(entry), 'remembrance entry should explain unresolved upstream work');
  eq(h.writeAttempts, 0);
});
test('all codex/outcome labels retain the fixed three afterword titles', () => {
  const state = { ...entered(), outcomes: ['window', 'drawer', 'chair'], plantCount: 3, lastPlant: { placement: 'chair', capturedRuling: 'B' } };
  const h = harness({ state, scene: 'remembrance' });
  for (const p of Object.keys(PLACES)) { ok(h.el('rw-codex-' + p).textContent.includes(TITLES[p])); ok(h.el('rw-collected-' + p).textContent.includes(TITLES[p])); }
  eq(h.writeAttempts, 0);
});
test('legal pending remembrance resume navigates to source only, without mutation', () => {
  for (const state of [history(), { ...base(), pending: { kind: 'enter', source: 'offering', target: GARDEN } }]) {
    const h = harness({ state, scene: 'remembrance' }); const raw = h.raw; h.click('rw-resume-entry-btn');
    eq(h.navigations, [state.pending.source]); eq(h.raw, raw); eq(h.writeAttempts, 0); eq(h.schedules.length, 0);
  }
});
test('source replay refusing an old timer does not claim it for forget', () => {
  const h = harness({ state: pendingState(), scene: GARDEN }); h.externalTimer(GARDEN); h.api.onScene(GARDEN); h.api.forget();
  eq(h.schedules.length, 0); eq(h.clears, []); eq(h.timers.get(GARDEN)?.owner, 'old');
});
test('old lock release does not recreate externally removed inert/aria marks', () => {
  const h = harness({ scene: 'offering' }); const e = h.el('prayer-offer');
  e.setAttribute('inert', ''); e.setAttribute('aria-disabled', 'true'); h.click('rw-enter-btn');
  e.removeAttribute('inert'); e.removeAttribute('aria-disabled'); h.arrive('corridor');
  ok(!e.inert); eq(e.getAttribute('aria-disabled'), null); eq(e.disabledAssignments, 0);
});
test('busy source pending keeps old capture lock and never reads private prayer', () => {
  const state = { ...base(), pending: { kind: 'enter', source: 'offering', target: GARDEN } };
  const h = harness({ state, scene: 'offering', busy: true }); h.arrive('offering');
  ok(h.click('prayer-offer').defaultPrevented); ok(h.dispatch('prayer-input', 'keydown', { key: 'Enter' }).defaultPrevented);
  ok(!h.dispatch('prayer-input', 'keydown', { key: 'Escape' }).defaultPrevented);
  eq(h.prayerReads, 0); eq(h.oldCalls, []); eq(h.writeAttempts, 0); eq(h.schedules.length, 0);
});
test('runtime uses only supplied document/storage/navigation callbacks; no direct global IO', () => {
  eq(vm.runInContext('__qaForbiddenCalls', sandbox), 0);
  const after = vm.runInContext('Object.getOwnPropertyDescriptors(globalThis)', sandbox);
  eq(Reflect.ownKeys(after).filter(k => !Reflect.has(beforeGlobals, k)), ['GoddeadWarmthGarden']);
  for (const key of Reflect.ownKeys(beforeGlobals)) for (const field of ['value', 'get', 'set', 'writable', 'enumerable', 'configurable']) eq(after[key][field], beforeGlobals[key][field]);
});
test('QA facade mirrors actual placement/codex ancestors and nonbubbling focus events', () => {
  const h = harness({ state: activeState() });
  eq(h.el('rw-placement').parentElement.id, 'scene-' + GARDEN);
  eq(h.el('rw-codex').parentElement.id, 'rw-entry-panel');
  let captured = 0, bubbled = 0;
  h.doc.addEventListener('focus', () => captured++, true);
  h.doc.addEventListener('focus', () => bubbled++);
  h.dispatch('rw-cell-0', 'focus'); eq(captured, 1); eq(bubbled, 0);
});

const report = {
  status: failures.length ? 'fail' : 'pass', assertions, tests: tests.length, passedTests: tests.length - failures.length, failedTests: failures.length,
  runtime: { path: RUNTIME, sha256: createHash('sha256').update(runtimeSource).digest('hex') },
  rules: { path: RULES, sha256: createHash('sha256').update(ruleSource).digest('hex'), actualAcceptedImplementation: true },
  failures,
  limits: ['Lightweight DOM/event unit facade, NOT a real browser or proof of native trusted events, CSS layout, focus delivery, accessible-name computation, image rendering, actual old route guards or publication.',
    'isTrusted true/false values are simulated test inputs; no browser trust bypass was used.',
    'Actual host sequencing is modeled: clear timers, set currentScene, onScene and focus hooks while transitionBusy=true, then release busy with no resync.',
    'Chapter-only callback storage records writes in memory; browser storage durability and old key invariance require separate native integration QA.'],
};
console.log(JSON.stringify(report, null, 2));
assert.equal(failures.length, 0, 'All runtime acceptance cases must pass');
