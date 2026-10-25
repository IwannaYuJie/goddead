import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { teaRules, teaRulesSource } from './helpers/tea-rules.mjs';

const oracle = JSON.parse(readFileSync(new URL('./fixtures/v109-tea-oracle.json', import.meta.url), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};
const config = freeze(clone(oracle.config)), rules = teaRules.create(config);
const names = ['etPourStep', 'etMatch', 'etMinSteps', 'etServeFeedback', 'defaultExactTea', 'clampEtCount', 'normalizeExactTea', 'etCourtProgress', 'etCourtEligible', 'expectedEtPending', 'normalizeEtPending'];
assert.deepEqual(Object.keys(rules), names);
assert.ok(Object.isFrozen(teaRules)); assert.ok(Object.isFrozen(rules));
const isolated = vm.createContext({}); vm.runInContext(teaRulesSource, isolated);
assert.equal(vm.runInContext('typeof GoddeadTeaRules.create', isolated), 'function');
assert.doesNotMatch(teaRulesSource, /\b(?:document|localStorage|sessionStorage|setTimeout|AudioEngine|fetch)\b|window\./);
const a = teaRulesSource.indexOf('    /* 纯函数：把第 from'), b = teaRulesSource.indexOf('    return Object.freeze({', a);
assert.equal(createHash('sha256').update(teaRulesSource.slice(a, b).replace(/^  /gm, '')).digest('hex'), oracle.pureFunctionsSha256);

// Independent overflow model: split the combined source/receiver water at the
// receiver rim, instead of computing production's min(source, free space).
const referencePour = (caps, levels, from, to) => {
  const result = [...levels];
  if (from === to) return result;
  const combined = levels[from] + levels[to];
  result[from] = combined > caps[to] ? combined - caps[to] : 0;
  result[to] = combined > caps[to] ? caps[to] : combined;
  return result;
};
const firstMatch = (levels, amount) => {
  for (let i = 0; i < levels.length; i++) if (levels[i] === amount) return i;
  return -1;
};
assert.equal(oracle.states.length, 768);
for (const sample of oracle.states) {
  const caps = config.ET_METHOD_TABLE[sample.method].caps, levels = freeze(clone(sample.levels));
  for (const move of sample.pours) {
    const result = rules.etPourStep(caps, levels, move.from, move.to);
    assert.deepEqual(result, move.next, 'old full-range pour');
    assert.deepEqual(result, referencePour(caps, levels, move.from, move.to), 'independent overflow pour');
    assert.notEqual(result, levels, 'fresh result even for no-op');
    assert.equal(result.reduce((sum, v) => sum + v, 0), levels.reduce((sum, v) => sum + v, 0), 'water conserved');
    assert.ok(result.every((v, i) => Number.isInteger(v) && v >= 0 && v <= caps[i]), 'within vessel rims');
    assert.deepEqual(levels, sample.levels, 'frozen input intact');
  }
  for (let i = 0; i < config.ET_ORDERS.length; i++) {
    const amount = config.ET_ORDER_TABLE[config.ET_ORDERS[i]].amount;
    assert.equal(rules.etMatch(levels, amount), sample.matches[i]);
    assert.equal(rules.etMatch(levels, amount), firstMatch(levels, amount));
  }
}
for (const invalid of [-1, 3, 0.5, '0', null, NaN]) {
  const levels = freeze([1, 2, 3]);
  assert.deepEqual(rules.etPourStep([3, 5, 8], levels, invalid, 0), levels);
  assert.deepEqual(rules.etPourStep([3, 5, 8], levels, 0, invalid), levels);
}

// Enumerate a complete state graph first. A queue computes one shortest-path
// tree for every target amount, independently of production's frontier rounds.
const graphFor = caps => {
  const graph = new Map();
  for (let x = 0; x <= caps[0]; x++) for (let y = 0; y <= caps[1]; y++) for (let z = 0; z <= caps[2]; z++) {
    const levels = [x, y, z], edges = [];
    for (let i = 0; i < 3; i++) {
      for (const volume of [0, caps[i]]) { const next = [...levels]; next[i] = volume; edges.push(next.join(',')); }
      for (let j = 0; j < 3; j++) if (i !== j) edges.push(referencePour(caps, levels, i, j).join(','));
    }
    graph.set(levels.join(','), edges);
  }
  const distance = new Map([['0,0,0', 0]]), queue = ['0,0,0'];
  for (let head = 0; head < queue.length; head++) {
    const state = queue[head];
    for (const next of graph.get(state)) if (!distance.has(next)) { distance.set(next, distance.get(state) + 1); queue.push(next); }
  }
  return { graph, distance };
};
const graphs = new Map(config.ET_METHODS.map(method => [method, graphFor(config.ET_METHOD_TABLE[method].caps)]));
for (const sample of oracle.minima) {
  const caps = config.ET_METHOD_TABLE[sample.method].caps, distances = graphs.get(sample.method).distance;
  const qualifying = [...distances].filter(([state]) => state.split(',').map(Number).includes(sample.amount)).map(([, d]) => d);
  const expected = qualifying.length ? Math.min(...qualifying) : -1;
  assert.equal(rules.etMinSteps(caps, sample.amount), sample.steps, 'legacy minimum');
  assert.equal(rules.etMinSteps(caps, sample.amount), expected, 'complete independent state graph');
}
assert.deepEqual(config.ET_METHODS.map(method => config.ET_ORDERS.map(order => rules.etMinSteps(config.ET_METHOD_TABLE[method].caps, config.ET_ORDER_TABLE[order].amount))), [[4, 6, 5], [4, 3, 4], [4, 6, 7]]);
assert.equal(rules.etMinSteps(freeze([3, 6, 9]), 1), -1);
assert.equal(rules.etMinSteps(freeze([3, 6, 9]), 0), 0);
assert.equal(rules.etMinSteps(freeze([3, 6, 9]), 9), 1);
assert.equal(rules.etMatch([7, 7, 0], 7), 0);
const freshPour = rules.etPourStep([3, 5, 8], [3, 0, 0], 0, 1); freshPour[0] = 99;
assert.deepEqual(rules.etPourStep([3, 5, 8], [3, 0, 0], 0, 1), [0, 3, 0]);

for (const sample of oracle.cases) {
  const result = rules.normalizeExactTea(freeze(clone(sample.raw)));
  assert.deepEqual(result, sample.normalized);
  assert.deepEqual(rules.normalizeExactTea(freeze(result)), result, 'canonical idempotence');
}
const first = rules.defaultExactTea(), second = rules.defaultExactTea();
assert.equal(Object.keys(first).length, 11);
for (const field of ['visited', 'draft', 'pours', 'courtOutcomes', 'latestMethodByOrder']) assert.notEqual(first[field], second[field]);
first.visited.house = true; first.pours.push('fake'); first.latestMethodByOrder['echo-order'] = 'copper';
assert.deepEqual(second, rules.defaultExactTea());
for (const [input, expected] of [[undefined, 0], [null, 0], [NaN, 0], [Infinity, 0], [-Infinity, 0], [-2, 0], [3.99, 3], ['7.8', 7], [99999, 9999]]) assert.equal(rules.clampEtCount(input), expected);
const all = rules.defaultExactTea(); all.pours = [...config.ET_POUR_IDS]; all.visited.court = true;
assert.deepEqual(rules.etCourtProgress(freeze(clone(all))), { orders: 3, methods: 3 });
assert.equal(rules.etCourtEligible(all), true);
assert.equal(rules.etCourtEligible({ ...all, pours: all.pours.filter(id => !id.endsWith(':porcelain')) }), false);
assert.equal(rules.etCourtEligible({ ...all, pours: all.pours.filter(id => !id.startsWith('echo-order:')) }), false);
for (const order of config.ET_ORDERS) for (const method of config.ET_METHODS) assert.equal(rules.etServeFeedback(order, method), `${config.ET_ORDER_TABLE[order].title}：${config.ET_METHOD_TABLE[method].result}`);
const valid = oracle.cases.filter(sample => sample.normalized.pending);
assert.deepEqual(valid.map(s => s.normalized.pending.kind), ['entry', 'order', 'serve', 'abandon', 'server-return', 'court-entry', 'verdict']);
let pendingFieldChecks = 0;
for (const { normalized: state } of valid) {
  const st = freeze(clone(state)), p = st.pending, accepted = rules.normalizeEtPending(p, st);
  assert.deepEqual(accepted, p); assert.notEqual(accepted, p); assert.deepEqual(rules.expectedEtPending(p, st), p);
  for (const key of Object.keys(p)) {
    const missing = { ...p }; delete missing[key];
    assert.equal(rules.normalizeEtPending(missing, st), null);
    assert.equal(rules.normalizeEtPending({ ...p, [key]: 'forged' }, st), null);
    pendingFieldChecks += 2;
  }
  assert.equal(rules.normalizeEtPending({ ...p, extra: true }, st), null);
  if (!['abandon', 'server-return'].includes(p.kind)) assert.equal(rules.normalizeEtPending(p, { ...st, activeServer: { pour: 'echo-order:clay' } }), null);
  if (p.kind === 'serve') assert.equal(rules.normalizeEtPending(p, { ...st, draft: { ...st.draft, method: 'copper' } }), null);
  if (['court-entry', 'verdict'].includes(p.kind)) assert.equal(rules.normalizeEtPending(p, { ...st, pours: [] }), null);
  if (p.kind === 'verdict') assert.equal(rules.normalizeEtPending(p, { ...st, visited: { court: false } }), null);
  if (p.kind === 'server-return') assert.equal(rules.normalizeEtPending(p, { ...st, activeServer: null }), null);
}
for (const pending of [null, [], 'entry', {}, { kind: 'invented' }]) assert.equal(rules.normalizeEtPending(pending, all), null);
const otherConfig = clone(config); otherConfig.EXACT_TEA_VERSION = 999; otherConfig.ET_VESSELS = [0, 1];
const other = teaRules.create(freeze(otherConfig));
assert.equal(other.defaultExactTea().version, 999); assert.equal(rules.defaultExactTea().version, 109);
assert.deepEqual(other.etPourStep([3, 5, 8], [3, 0, 0], 0, 2), [3, 0, 0]);
assert.deepEqual(rules.etPourStep([3, 5, 8], [3, 0, 0], 0, 2), [0, 0, 3]);
assert.deepEqual(config, oracle.config, 'configuration intact');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.deepEqual([...html.matchAll(/<script src="([^"]+)"[^>]*>/g)].map(m => m[1]), ['directory.js?v=128', 'ink-rules.js?v=128', 'light-rules.js?v=128', 'tea-rules.js?v=128', 'warmth-rules.js?v=128', 'warmth-garden.js?v=128', 'script.js?v=128']);
assert.match(html, /styles\.css\?v=128/);
console.log(`v127 tea rules: 6,912 legacy/independent pours, 2,304 matches, 36 minimum paths, 63 canonical cases, ${pendingFieldChecks} strict pending field checks passed`);
