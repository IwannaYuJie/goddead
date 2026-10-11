import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { lightRules, lightRulesSource } from './helpers/light-rules.mjs';

const oracle = JSON.parse(readFileSync(new URL('./fixtures/v108-light-oracle.json', import.meta.url), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const config = freeze(clone(oracle.config));
const rules = lightRules.create(config);
const names = ['lbStart', 'lbTrace', 'lbLit', 'lbBeamPoints', 'lbShineFeedback', 'defaultBorrowedLight', 'clampLbCount', 'normalizeBorrowedLight', 'lbCourtProgress', 'lbCourtEligible', 'expectedLbPending', 'normalizeLbPending'];
assert.deepEqual(Object.keys(rules), names);
assert.ok(Object.isFrozen(lightRules)); assert.ok(Object.isFrozen(rules));
const isolated = vm.createContext({}); vm.runInContext(lightRulesSource, isolated);
assert.equal(vm.runInContext('typeof GoddeadLightRules.create', isolated), 'function');
assert.doesNotMatch(lightRulesSource, /\b(?:document|localStorage|sessionStorage|setTimeout|AudioEngine|fetch)\b|window\./);
const pureStart = lightRulesSource.indexOf('    function lbStart(entry)');
const pureEnd = lightRulesSource.indexOf('    return Object.freeze({', pureStart);
assert.equal(createHash('sha256').update(lightRulesSource.slice(pureStart, pureEnd).replace(/^  /gm, '')).digest('hex'), oracle.pureFunctionsSha256);

// Independent finite-direction model: use compass headings and reflection tables,
// instead of the production implementation's signed-vector swaps.
const reflectionCoverage = new Set();
const referenceTrace = (layout, states, entry, size = 5) => {
  const delta = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const reflect = [[1, 0, 3, 2], [3, 2, 1, 0]];
  const positions = [...layout].flatMap((cell, index) => cell === 'm' ? [index] : []);
  let row = entry.side === 'north' ? 0 : entry.pos;
  let col = entry.side === 'east' ? size - 1 : entry.side === 'west' ? 0 : entry.pos;
  let heading = entry.side === 'east' ? 3 : entry.side === 'west' ? 1 : 2;
  let bounces = 0; const path = [];
  for (let budget = 80; budget > 0; budget--) {
    if (row < 0 || col < 0 || row >= size || col >= size) return { path, exit: [row, col], bounces, blocked: false };
    path.push([row, col]);
    const at = row * size + col;
    if (layout[at] === '#') return { path, exit: null, bounces, blocked: true };
    if (layout[at] === 'm') {
      const orientation = states[positions.indexOf(at)] === 0 ? 0 : 1;
      reflectionCoverage.add(`${orientation}:${heading}`);
      heading = reflect[orientation][heading]; bounces++;
    }
    row += delta[heading][0]; col += delta[heading][1];
  }
  return { path, exit: null, bounces, blocked: false };
};
const referencePoints = (trace, entry, size = 5) => {
  const unit = 100 / size;
  const center = ([row, col]) => [(2 * col + 1) * unit / 2, (2 * row + 1) * unit / 2];
  const start = entry.side === 'west' ? [0, (entry.pos + 0.5) * unit] : entry.side === 'east' ? [100, (entry.pos + 0.5) * unit] : [(entry.pos + 0.5) * unit, 0];
  const points = [start, ...trace.path.map(center)];
  if (trace.exit) {
    const [row, col] = trace.exit;
    points.push([col < 0 ? 0 : col >= size ? 100 : (col + 0.5) * unit, row < 0 ? 0 : row >= size ? 100 : (row + 0.5) * unit]);
  }
  return points.map(point => point.map(value => Math.round(value * 10) / 10).join(',')).join(' ');
};
assert.equal(oracle.beams.length, 1344);
const summaries = new Map();
for (const sample of oracle.beams) {
  const model = config.LB_MODEL_TABLE[sample.model];
  const entry = model.entries[sample.method], states = freeze(clone(sample.states));
  const trace = rules.lbTrace(model.layout, states, entry);
  assert.deepEqual(trace, sample.trace, `legacy trace ${sample.model}/${sample.method}/${sample.mask}`);
  assert.deepEqual(trace, referenceTrace(model.layout, states, entry), 'independent reflections, pillars and exits');
  const geometry = rules.lbBeamPoints(sample.model, sample.method, states);
  assert.deepEqual(geometry.trace, trace);
  assert.equal(geometry.points, sample.points);
  assert.equal(geometry.points, referencePoints(trace, entry));
  const lit = rules.lbLit(sample.model, sample.method, states);
  assert.equal(lit, sample.lit);
  assert.equal(lit, !!trace.exit && trace.exit[0] === 5 && trace.exit[1] === model.window);
  const key = `${sample.model}:${sample.method}`;
  if (!summaries.has(key)) summaries.set(key, { count: 0, flips: Infinity });
  if (lit) {
    const summary = summaries.get(key); summary.count++;
    summary.flips = Math.min(summary.flips, states.reduce((sum, value, i) => sum + (value !== model.init[i]), 0));
  }
}
assert.deepEqual([...reflectionCoverage].sort(), ['0:0', '0:1', '0:2', '0:3', '1:0', '1:1', '1:2', '1:3']);
assert.deepEqual([...summaries.values()].map(s => [s.count, s.flips]), [[4, 4], [8, 3], [4, 3], [8, 2], [4, 3], [8, 3], [8, 4], [16, 4], [8, 3]]);
for (const solution of oracle.solutions) {
  const model = config.LB_MODEL_TABLE[solution.model];
  assert.equal(rules.lbLit(solution.model, solution.method, model.init), false);
  assert.equal(rules.lbLit(solution.model, solution.method, freeze(solution.best.states)), true);
  assert.deepEqual(summaries.get(`${solution.model}:${solution.method}`), { count: solution.solutionCount, flips: solution.best.flips });
}
const empty = '.'.repeat(25);
assert.deepEqual(rules.lbTrace(empty, [], { side: 'north', pos: 2 }), { path: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]], exit: [5, 2], bounces: 0, blocked: false });
assert.deepEqual(rules.lbTrace('.#' + '.'.repeat(23), [], { side: 'west', pos: 0 }), { path: [[0, 0], [0, 1]], exit: null, bounces: 0, blocked: true });
const central = '.'.repeat(12) + 'm' + '.'.repeat(12);
for (const [side, orientation, exit] of [['west', 0, [-1, 2]], ['west', 1, [5, 2]], ['east', 0, [5, 2]], ['east', 1, [-1, 2]], ['north', 0, [2, -1]], ['north', 1, [2, 5]]]) {
  assert.deepEqual(rules.lbTrace(central, [orientation], { side, pos: 2 }).exit, exit);
}
const firstTrace = rules.lbTrace(empty, [], { side: 'north', pos: 2 });
firstTrace.path[0][0] = 99; firstTrace.exit[0] = 99;
assert.deepEqual(rules.lbTrace(empty, [], { side: 'north', pos: 2 }), referenceTrace(empty, [], { side: 'north', pos: 2 }), 'fresh path cells and exit');
for (const sample of oracle.cases) {
  const raw = freeze(clone(sample.raw)), result = rules.normalizeBorrowedLight(raw);
  assert.deepEqual(result, sample.normalized, 'legacy canonical state');
  assert.deepEqual(rules.normalizeBorrowedLight(freeze(result)), result, 'idempotent canonical state');
}
const first = rules.defaultBorrowedLight(), second = rules.defaultBorrowedLight();
assert.equal(Object.keys(first).length, 11);
for (const field of ['visited', 'draft', 'beams', 'courtOutcomes', 'latestMethodByModel']) assert.notEqual(first[field], second[field]);
first.visited.office = true; first.beams.push('fake'); first.latestMethodByModel['deadletter-model'] = 'dusk';
assert.deepEqual(second, rules.defaultBorrowedLight());
for (const [input, expected] of [[undefined, 0], [null, 0], [NaN, 0], [Infinity, 0], [-Infinity, 0], [-2, 0], [3.99, 3], ['7.8', 7], [99999, 9999]]) assert.equal(rules.clampLbCount(input), expected);
const all = rules.defaultBorrowedLight(); all.beams = [...config.LB_BEAM_IDS]; all.visited.court = true;
assert.deepEqual(rules.lbCourtProgress(freeze(clone(all))), { models: 3, methods: 3 });
assert.equal(rules.lbCourtEligible(all), true);
assert.equal(rules.lbCourtEligible({ ...all, beams: all.beams.filter(id => !id.endsWith(':dusk')) }), false);
assert.equal(rules.lbCourtEligible({ ...all, beams: all.beams.filter(id => !id.startsWith('protocol-model:')) }), false);
for (const model of config.LB_MODELS) for (const method of config.LB_METHODS) assert.equal(rules.lbShineFeedback(model, method), `${config.LB_MODEL_TABLE[model].title}：${config.LB_METHOD_TABLE[method].result}`);
const validPending = oracle.cases.filter(sample => sample.normalized.pending);
assert.deepEqual(validPending.map(sample => sample.normalized.pending.kind), ['entry', 'model', 'shine', 'abandon', 'lamplighter-return', 'court-entry', 'verdict']);
let pendingFieldChecks = 0;
for (const { normalized: state } of validPending) {
  const st = freeze(clone(state)), p = st.pending, accepted = rules.normalizeLbPending(p, st);
  assert.deepEqual(accepted, p); assert.notEqual(accepted, p);
  assert.deepEqual(rules.expectedLbPending(p, st), p);
  for (const key of Object.keys(p)) {
    const missing = { ...p }; delete missing[key];
    assert.equal(rules.normalizeLbPending(missing, st), null, `${p.kind} missing ${key}`);
    assert.equal(rules.normalizeLbPending({ ...p, [key]: 'forged' }, st), null, `${p.kind} forged ${key}`);
    pendingFieldChecks += 2;
  }
  assert.equal(rules.normalizeLbPending({ ...p, extra: true }, st), null);
  if (!['abandon', 'lamplighter-return'].includes(p.kind)) assert.equal(rules.normalizeLbPending(p, { ...st, activeLamplighter: { beam: 'deadletter-model:dawn' } }), null);
  if (p.kind === 'shine') assert.equal(rules.normalizeLbPending(p, { ...st, draft: { ...st.draft, method: 'dusk' } }), null);
  if (['court-entry', 'verdict'].includes(p.kind)) assert.equal(rules.normalizeLbPending(p, { ...st, beams: [] }), null);
  if (p.kind === 'verdict') assert.equal(rules.normalizeLbPending(p, { ...st, visited: { court: false } }), null);
  if (p.kind === 'lamplighter-return') assert.equal(rules.normalizeLbPending(p, { ...st, activeLamplighter: null }), null);
}
for (const pending of [null, [], 'entry', {}, { kind: 'invented' }]) assert.equal(rules.normalizeLbPending(pending, all), null);
const otherConfig = clone(config); otherConfig.LB_N = 100; otherConfig.BORROWED_LIGHT_VERSION = 999;
const other = lightRules.create(freeze(otherConfig));
const limited = other.lbTrace('.'.repeat(10000), [], { side: 'north', pos: 0 });
assert.equal(limited.path.length, 80); assert.equal(limited.exit, null); assert.equal(limited.blocked, false); assert.equal(limited.bounces, 0);
assert.deepEqual(other.lbStart({ side: 'east', pos: 2 }), { r: 2, c: 99, dr: 0, dc: -1 });
assert.deepEqual(rules.lbStart({ side: 'east', pos: 2 }), { r: 2, c: 4, dr: 0, dc: -1 });
assert.equal(other.defaultBorrowedLight().version, 999); assert.equal(rules.defaultBorrowedLight().version, 108);
assert.deepEqual(config, oracle.config, 'configuration remains untouched');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.deepEqual([...html.matchAll(/<script src="([^"]+)"[^>]*>/g)].map(match => match[1]), ['directory.js?v=126', 'ink-rules.js?v=126', 'light-rules.js?v=126', 'script.js?v=126']);
assert.match(html, /styles\.css\?v=126/);
console.log(`v126 light rules: 1,344 legacy/independent traces and SVG paths, 63 canonical cases, ${pendingFieldChecks} strict pending field checks passed`);
