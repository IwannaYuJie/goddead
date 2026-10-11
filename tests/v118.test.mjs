import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = source.indexOf('  /* ============================================================\n     v118 渡河码头');
const end = source.indexOf('  /* ============================================================\n     v119 河岸回声', start);
assert.ok(start > 0 && end > start);
const moduleSource = source.slice(start, end);
assert.equal((moduleSource.match(/addEventListener\(/g) || []).length, 1);
assert.match(moduleSource, /if \(e\.isTrusted\) handler\(e\)/);
assert.doesNotMatch(moduleSource, /innerHTML/);

export function makeV118({ initial = null, upstreamDone = true, upstreamBusy = false } = {}) {
  const memory = new Map([['old-chapter', '{unchanged']]);
  if (initial !== null) memory.set('goddead_v118_river_ferry', typeof initial === 'string' ? initial : JSON.stringify(initial));
  const writes = [];
  const store = { get: (k, f) => memory.has(k) ? memory.get(k) : f, set: (k, v) => { memory.set(k, String(v)); writes.push(k); } };
  const elements = new Map();
  const makeElement = (id = '') => ({ id, hidden: false, disabled: false, textContent: '', children: [], attrs: {},
    classList: { values: new Set(), toggle(c, on) { on ? this.values.add(c) : this.values.delete(c); }, contains(c) { return this.values.has(c); } },
    setAttribute(k, v) { this.attrs[k] = String(v); }, getAttribute(k) { return this.attrs[k] ?? null; },
    replaceChildren(...c) { this.children = c; }, addEventListener() {},
  });
  const $ = (s) => { const id = s.replace(/^#/, ''); if (!elements.has(id)) elements.set(id, makeElement(id)); return elements.get(id); };
  const schedules = [];
  const upstream = { courtOutcomes: upstreamDone ? ['a', 'b', 'c'] : ['a'], pending: upstreamBusy ? { kind: 'finish' } : null, activeDriver: null };
  const api = new Function('store', '$', '$$', 'reduced', 'AutoAdvance', 'AudioEngine', 'buttonAvailable', 'document', 'localStorage',
    'hearseYardUnlocked', 'getHearseYard', 'hyCourtEligible', 'HY_VERDICT_OUTCOME_IDS',
    `let currentScene = 'remembrance'; let navigation = ''; const goScene = s => { navigation = s; currentScene = s; };
    ${moduleSource}
    return { get: getRiverFerry, normalize: normalizeRiverFerry, unlocked: riverFerryUnlocked, entry: chooseRvEntry, parcel: chooseRvParcel,
      method: chooseRvMethod, tap: tapRvPassenger, sail: sailRvRiver, undo: undoRvRiver, reset: resetRvRiver, finish: finishRvDeparture,
      abandon: chooseRvAbandon, ferryman: chooseRvFerrymanReturn, receipt: chooseRvReceipt, courtEntry: chooseRvCourtEntry, verdict: chooseRvVerdict,
      go: s => { currentScene = s; }, arrive: s => { currentScene = s; resolveRiverFerryPendingOnArrival(s); syncRiverFerryAll(); },
      sync: syncRiverFerryAll, replayPending: replayRiverFerryPending, bridge: riverFerryBridgeAllows, eligible: rvCourtEligible,
      gateOk: rvGateCanVisit, yardOk: riverCrossingCanVisit, courtOk: rvCourtCanVisit, forget: forgetRiverFerryState,
      configs: RV_METHOD_TABLE, parcels: RV_PARCEL_TABLE, verdicts: RV_VERDICT_TABLE, departIds: RV_DEPART_IDS,
      cross: rvCross, replay: rvReplay, solved: rvOut, crew: () => rvCrew, navigation: () => navigation };
    `)(store, $, () => [], false, { schedule: (s, t) => schedules.push([s, t]), has: () => false, clear() {} }, { whoosh() {}, tick() {} },
      id => { const e = elements.get(id); return !e || (!e.hidden && !e.disabled); }, { createElement: () => makeElement() },
      { removeItem: k => memory.delete(k) }, () => true, () => upstream, () => true, ['a', 'b', 'c']);
  return { ...api, memory, elements, schedules, writes };
}

/* 独立判定：逐个同行者比较岸位，不复用生产位掩码安全检查。 */
function oracle(config, state, crew) {
  const onRight = Array.from({ length: config.count }, (_, i) => Boolean(state.mask & (1 << i)));
  const picked = onRight.map((_, i) => i).filter(i => crew & (1 << i));
  const unsafe = (people, unattended) => config.edges.some(([a, b]) => people[a] === unattended && people[b] === unattended);
  if (unsafe(onRight, !Boolean(state.boat))) return null;
  if (picked.length > config.capacity || picked.some(i => onRight[i] !== Boolean(state.boat))) return null;
  const after = onRight.map((right, i) => picked.includes(i) ? !right : right);
  if (unsafe(after, Boolean(state.boat))) return null;
  return { mask: after.reduce((m, right, i) => m + (right ? 1 << i : 0), 0), boat: 1 - state.boat };
}

export function independentPlan(config) {
  const key = s => `${s.mask}:${s.boat}`;
  const queue = [{ mask: 0, boat: 0 }];
  const previous = new Map([['0:0', null]]);
  for (const state of queue) {
    if (state.mask === (1 << config.count) - 1 && state.boat === 1) {
      const path = [];
      for (let k = key(state); previous.get(k); k = previous.get(k).from) path.unshift(previous.get(k).crew);
      return path;
    }
    for (let crew = 0; crew < 1 << config.count; crew++) {
      const next = oracle(config, state, crew);
      if (next && !previous.has(key(next))) { previous.set(key(next), { from: key(state), crew }); queue.push(next); }
    }
  }
  throw new Error('No crossing path');
}

const reference = makeV118();
for (const [method, config] of Object.entries(reference.configs)) {
  for (let mask = 0; mask < 1 << config.count; mask++) for (let boat = 0; boat < 2; boat++) for (let crew = 0; crew < 1 << config.count; crew++) {
    const expected = oracle(config, { mask, boat }, crew);
    const actual = reference.cross(config, { mask, boat }, crew);
    assert.deepEqual(actual.state || null, expected, `${method} ${mask}:${boat} + ${crew}`);
  }
  const path = independentPlan(config);
  assert.equal(path.length, { skiff: 7, rowing: 7, night: 9 }[method]);
  assert.equal(reference.solved({ parcel: 'watch-parcel', method, trips: path }), true);
  assert.deepEqual(reference.replay(method, [...path, 'bad', 0]).trips, path);
  assert.deepEqual(reference.replay(method, [1.5, ...path]).trips, []);
}
assert.equal(reference.cross(reference.configs.skiff, { mask: 0, boat: 0 }, -1).error, 'invalid');
assert.equal(reference.cross(reference.configs.skiff, { mask: 0, boat: 0 }, 8).error, 'invalid');
assert.equal(reference.cross(reference.configs.skiff, { mask: 100, boat: 0 }, 0).error, 'invalid');
assert.equal(reference.cross(reference.configs.skiff, { mask: 0, boat: 2 }, 0).error, 'invalid');

function open(g, parcel, method = 'skiff') {
  if (!g.get().visited.gate) { g.go('remembrance'); g.entry(); g.arrive('ferry-landing'); }
  g.go('ferry-landing'); g.parcel(parcel); g.arrive('river-crossing');
  if (method !== 'skiff') g.method(method);
}
function move(g, crew) { for (let i = 0; i < 6; i++) if (crew & (1 << i)) g.tap(i); g.sail(); }
function solve(g) { for (const crew of independentPlan(g.configs[g.get().draft.method])) move(g, crew); }

/* 九种配置实际走生产输入 → 冷恢复 → 签收；所有写入只落新键。 */
for (const parcel of Object.keys(reference.parcels)) for (const method of Object.keys(reference.configs)) {
  let g = makeV118(); open(g, parcel, method);
  const initialRaw = g.memory.get('goddead_v118_river_ferry');
  g.finish(); assert.equal(g.get().pending, null, 'cannot deliver before arriving');
  g.sail(); assert.equal(g.memory.get('goddead_v118_river_ferry'), initialRaw, 'unsafe empty first trip never writes');
  const path = independentPlan(g.configs[method]);
  move(g, path[0]);
  const first = g.get();
  g.undo(); assert.deepEqual(g.get().draft.trips, []);
  move(g, path[0]); assert.deepEqual(g.get(), first, 'undo and replay restore the same canonical state');
  g = makeV118({ initial: g.get() }); g.go('river-crossing'); g.sync();
  assert.deepEqual(g.get().draft.trips, [path[0]], 'reload keeps the boat and banks');
  assert.equal(g.crew(), 0, 'reload clears only passenger selection');
  for (const crew of path.slice(1)) move(g, crew);
  assert.equal(g.solved(g.get().draft), true);
  g.finish(); const pending = g.get();
  assert.equal(pending.pending.kind, 'finish');
  g.sail(); g.method('night'); g.abandon(); assert.deepEqual(g.get(), pending, 'first pending locks competing inputs');
  const target = g.parcels[parcel].target;
  assert.equal(g.bridge(target), true);
  g = makeV118({ initial: pending }); g.go('river-crossing'); g.replayPending('river-crossing');
  assert.deepEqual(g.schedules, [['river-crossing', target]], 'feedback-source reload re-arms a legal delivery');
  g.arrive(target); g.arrive(target);
  assert.equal(g.get().departRuns, 1, 'repeated arrival books once');
  assert.deepEqual(g.get().departs, [`${parcel}:${method}`]);
  assert.equal(g.bridge(target), true, 'unsigned ferryman maintains the narrow bridge');
  g.go('remembrance'); g.receipt(); assert.equal(g.navigation(), target, 'receipt guide really opens its old room');
  g.ferryman(target); g.arrive('ferry-landing');
  assert.equal(g.get().activeFerryman, null);
  assert.equal(g.bridge(target), false, 'signing retracts temporary passage');
  assert.equal(g.memory.get('old-chapter'), '{unchanged');
  assert.equal(g.writes.every(k => k === 'goddead_v118_river_ferry'), true);
}

/* 三航法与三托运覆盖，全部裁定与重复记账。 */
{
  const g = makeV118();
  for (const [parcel, method] of [['reliquary-parcel', 'skiff'], ['deadletter-parcel', 'rowing'], ['watch-parcel', 'night']]) {
    open(g, parcel, method); solve(g); g.finish(); g.arrive(g.parcels[parcel].target);
    g.ferryman(g.parcels[parcel].target); g.arrive('ferry-landing');
  }
  assert.equal(g.eligible(g.get()), true);
  for (const [action, verdict] of Object.entries(g.verdicts)) {
    g.go('remembrance'); g.courtEntry(); g.arrive('hearing-of-the-last-bank'); g.verdict(action);
    const cold = makeV118({ initial: g.get() }); cold.arrive(verdict.target); cold.arrive(verdict.target);
    assert.equal(cold.get().courtRuns, g.get().courtRuns + 1);
    g.arrive(verdict.target);
  }
  assert.equal(g.get().courtOutcomes.length, 3);
  assert.equal(g.get().courtRuns, 3);
  open(g, 'reliquary-parcel'); solve(g); g.finish(); g.arrive('reliquary');
  assert.equal(g.get().departRuns, 4); assert.equal(g.get().departs.length, 3);
  g.ferryman('reliquary'); g.arrive('ferry-landing');
  const initial = g.get(); g.go('watch'); g.parcel('watch-parcel'); g.sail(); assert.deepEqual(g.get(), initial, 'off-scene inputs do nothing');
  g.forget(); assert.equal(g.memory.has('goddead_v118_river_ferry'), false); assert.equal(g.memory.get('old-chapter'), '{unchanged');
}
{
  const g = makeV118(); open(g, 'watch-parcel');
  g.tap(0); g.tap(1); assert.equal(g.crew(), 1, 'capacity overflow keeps the original selection');
  g.sail(); assert.equal(g.get().draft.trips.length, 0, 'wrong passenger leaves conflict, no trip consumed');
  g.tap(0); g.tap(1); g.sail(); assert.deepEqual(g.get().draft.trips, [2]);
  g.reset(); assert.deepEqual(g.get().draft.trips, []);
  g.tap(1); g.sail(); g.method('night'); assert.deepEqual(g.get().draft.trips, []);
  g.abandon(); g.arrive('ferry-landing'); assert.equal(g.get().draft.parcel, '');
  for (const options of [{ upstreamDone: false }, { upstreamBusy: true }]) {
    const locked = makeV118(options); locked.entry(); assert.equal(locked.schedules.length, 0);
    if (!options.upstreamDone) assert.equal(locked.gateOk(), false);
  }
  const bad = makeV118({ initial: '{bad' }); assert.equal(bad.get().visited.gate, false); assert.equal(bad.memory.get('goddead_v118_river_ferry'), '{bad');
  const raw = { ...g.get(), draft: { parcel: 'watch-parcel', method: 'skiff', trips: [2, 0, 99, 1] }, extra: 'ignored' };
  const normalized = makeV118({ initial: raw }).get(); assert.deepEqual(normalized.draft.trips, [2, 0]); assert.equal('extra' in normalized, false);
  const invalidFinish = { ...normalized, pending: { parcel: 'watch-parcel', method: 'skiff', kind: 'finish', source: 'river-crossing', target: 'watch', depart: 'watch-parcel:skiff', feedback: `${reference.parcels['watch-parcel'].title}：${reference.configs.skiff.result}` } };
  assert.equal(makeV118({ initial: invalidFinish }).get().pending, null, 'a forged finish needs a completed legal trip history');
  const fresh = makeV118(); fresh.entry(); const entry = fresh.get();
  assert.ok(entry.pending);
  for (const mutation of [{ ...entry.pending, extra: true }, { ...entry.pending, target: 'watch' }, { ...entry.pending, feedback: 'fake' }]) assert.equal(makeV118({ initial: { ...entry, pending: mutation } }).get().pending, null);
}
/* Execute actual early mainline guards with all old progress locked. */
{
  const a = source.indexOf('  const resolveScene = (name) => {');
  const b = source.indexOf('    /* v62 反听总台守卫', a);
  const guards = source.slice(a, b).replace('  const resolveScene = (name) => {', '');
  const route = new Function('name', 'riverFerryBridgeAllows', `const reliquaryUnlocked=()=>false; const hearseYardBridgeAllows=()=>false; const regretReclamationBridgeAllows=()=>false; const forgivenessLandfillBridgeAllows=()=>false; const watchUnlocked=()=>false; const line4Unlocked=()=>false; ${guards} return target;`);
  for (const parcel of Object.keys(reference.parcels)) {
    const g = makeV118(); open(g, parcel); solve(g); g.finish();
    const target = g.parcels[parcel].target;
    assert.equal(route(target, g.bridge), target);
    g.arrive(target); assert.equal(route(target, g.bridge), target);
    g.ferryman(target); g.arrive('ferry-landing'); assert.equal(route(target, g.bridge), 'corridor');
  }
}
for (const scene of ['ferry-landing', 'river-crossing', 'hearing-of-the-last-bank']) {
  assert.ok(html.includes(`data-scene="${scene}"`));
  assert.ok(html.includes(`data-src="assets/v118-${scene}.webp"`));
  const webp = readFileSync(new URL(`../assets/v118-${scene}.webp`, import.meta.url));
  assert.equal(webp.toString('ascii', 0, 4), 'RIFF'); assert.ok(webp.length < 300 * 1024);
}
assert.match(source, /resolveRiverFerryPendingOnArrival\(name\);\s*replayRiverFerryPending\(name\);/);
assert.match(source, /forgetHearseYardState\(\);\s*forgetRiverFerryState\(\);\s*forgetRiverEchoState\(\);\s*forgetCodexFolds\(\);/);
assert.match(source, /syncHearseYardAll\(\);\s*syncRiverFerryAll\(\);\s*syncRiverEchoAll\(\);\s*revealScene/);
assert.match(source, /return riverFerryProgressStep\(\)/);
assert.match(source, /const goScene = \(name\) =>/);
assert.doesNotMatch(moduleSource, /showScene/);
console.log('v118 river ferry: exhaustive transition oracle and nine lifecycle paths passed');
