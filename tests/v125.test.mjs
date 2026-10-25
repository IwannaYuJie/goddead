import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { inkRules, inkRulesSource } from './helpers/ink-rules.mjs';

const oracle = JSON.parse(readFileSync(new URL('./fixtures/v107-ink-oracle.json', import.meta.url), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const config = freeze(clone(oracle.config));
const rules = inkRules.create(config);
const names = ['mxMix', 'mxDistance', 'mxTargetColor', 'mxCss', 'mxPourFeedback', 'defaultInkMixing', 'clampMxCount', 'normalizeInkMixing', 'mxCourtProgress', 'mxCourtEligible', 'expectedMxPending', 'normalizeMxPending'];
assert.deepEqual(Object.keys(rules), names);
assert.ok(Object.isFrozen(inkRules));
assert.ok(Object.isFrozen(rules));
// The standalone file runs without a DOM, timers, storage or application source.
const isolated = vm.createContext({});
vm.runInContext(inkRulesSource, isolated);
assert.equal(vm.runInContext('typeof GoddeadInkRules.create', isolated), 'function');
assert.doesNotMatch(inkRulesSource, /\b(?:document|window|localStorage|sessionStorage|setTimeout|AudioEngine|fetch)\b/);
// Compare the full moved block with a fingerprint captured before migration.
const pureStart = inkRulesSource.indexOf('    /* 纯函数：按份数混出颜色');
const pureEnd = inkRulesSource.indexOf('    return Object.freeze({', pureStart);
const pure = inkRulesSource.slice(pureStart, pureEnd).replace(/^  /gm, '');
assert.equal(createHash('sha256').update(pure).digest('hex'), oracle.pureFunctionsSha256);
assert.equal(oracle.palette.length, 343);
const passingCounts = config.MX_INKS.map(() => config.MX_METHODS.map(() => 0));
for (const sample of oracle.palette) {
  const parts = freeze(Object.fromEntries(config.MX_PIGMENTS.map((name, i) => [name, sample.parts[i]])));
  const color = rules.mxMix(parts);
  assert.deepEqual(color, sample.rgb, `legacy RGB ${sample.parts}`);
  // Independently combine paper and pigment masses before dividing once.
  const total = sample.parts.reduce((sum, value) => sum + value, 0);
  const algebra = config.MX_PAPER.map((paper, channel) => Math.round((
    sample.parts.reduce((sum, value, i) => sum + value * config.MX_PIGMENT_TABLE[config.MX_PIGMENTS[i]].rgb[channel], 0)
    + paper * Math.max(0, config.MX_MAX_PARTS - total)
  ) / Math.max(config.MX_MAX_PARTS, total)));
  assert.deepEqual(color, algebra, `independent pigment mass ${sample.parts}`);
  config.MX_INKS.forEach((ink, i) => {
    const target = rules.mxTargetColor(ink);
    const distance = rules.mxDistance(color, target);
    assert.equal(distance, sample.distances[i]);
    const squared = color.reduce((sum, channel, c) => sum + (channel - target[c]) ** 2, 0);
    assert.ok(Math.abs(distance - Math.sqrt(squared) / 441.673 * 100) < 1e-12);
    config.MX_METHODS.forEach((method, m) => {
      const accepted = distance <= config.MX_METHOD_TABLE[method].tolerance;
      assert.equal(accepted, sample.passes[i][m]);
      if (accepted) passingCounts[i][m]++;
    });
  });
}
assert.deepEqual(passingCounts, [[4, 1, 1], [59, 18, 2], [44, 12, 4]]);
assert.deepEqual(rules.mxMix(null), config.MX_PAPER);
assert.deepEqual(rules.mxMix({ red: Infinity, yellow: -Infinity, indigo: NaN }), config.MX_PIGMENT_TABLE.red.rgb);
assert.deepEqual(rules.mxMix({ red: '0.5', yellow: '1.49', indigo: 'bad' }), rules.mxMix({ red: 1, yellow: 1, indigo: 0 }));
assert.equal(rules.mxDistance([0, 0, 0], [0, 0, 0]), 0);
assert.equal(rules.mxCss([10, 20, 30]), 'rgb(10, 20, 30)');
for (const ink of config.MX_INKS) for (const method of config.MX_METHODS) {
  assert.equal(rules.mxPourFeedback(ink, method), `${config.MX_INK_TABLE[ink].title}：${config.MX_METHOD_TABLE[method].result}`);
}
for (const sample of oracle.cases) {
  const raw = freeze(clone(sample.raw));
  const result = rules.normalizeInkMixing(raw);
  assert.deepEqual(result, sample.normalized, 'legacy canonical save and pending');
  assert.deepEqual(rules.normalizeInkMixing(freeze(result)), result, 'canonicalization is idempotent');
}
const first = rules.defaultInkMixing(), second = rules.defaultInkMixing();
assert.equal(Object.keys(first).length, 11);
for (const field of ['visited', 'draft', 'mixes', 'courtOutcomes', 'latestMethodByInk']) {
  assert.notEqual(first[field], second[field], `${field} is a fresh object`);
}
first.visited.room = true; first.mixes.push('fake'); first.latestMethodByInk['corridor-ink'] = 'exact';
assert.deepEqual(second, rules.defaultInkMixing());
for (const [input, expected] of [[undefined, 0], [null, 0], [NaN, 0], [Infinity, 0], [-Infinity, 0], [-2, 0], [3.99, 3], ['7.8', 7], [99999, 9999]]) {
  assert.equal(rules.clampMxCount(input), expected);
}
const all = rules.defaultInkMixing(); all.mixes = [...config.MX_MIX_IDS]; all.visited.court = true;
assert.deepEqual(rules.mxCourtProgress(freeze(clone(all))), { inks: 3, methods: 3 });
assert.equal(rules.mxCourtEligible(all), true);
assert.equal(rules.mxCourtEligible({ ...all, mixes: config.MX_MIX_IDS.filter(id => !id.endsWith(':exact')) }), false);
assert.equal(rules.mxCourtEligible({ ...all, mixes: config.MX_MIX_IDS.filter(id => !id.startsWith('switchboard-ink:')) }), false);
const validPending = oracle.cases.filter(sample => sample.normalized.pending);
assert.deepEqual(validPending.map(sample => sample.normalized.pending.kind), ['entry', 'ink', 'pour', 'abandon', 'apprentice-return', 'court-entry', 'verdict']);
let pendingFieldChecks = 0;
for (const { normalized: state } of validPending) {
  const st = freeze(clone(state)), p = st.pending;
  const accepted = rules.normalizeMxPending(p, st);
  assert.deepEqual(accepted, p); assert.notEqual(accepted, p);
  assert.deepEqual(rules.expectedMxPending(p, st), p);
  for (const key of Object.keys(p)) {
    const missing = { ...p }; delete missing[key];
    assert.equal(rules.normalizeMxPending(missing, st), null, `${p.kind} missing ${key}`);
    assert.equal(rules.normalizeMxPending({ ...p, [key]: 'forged' }, st), null, `${p.kind} forged ${key}`);
    pendingFieldChecks += 2;
  }
  assert.equal(rules.normalizeMxPending({ ...p, extra: true }, st), null);
  if (p.kind !== 'abandon' && p.kind !== 'apprentice-return') {
    assert.equal(rules.normalizeMxPending(p, { ...st, activeApprentice: { mix: 'corridor-ink:rough' } }), null);
  }
  if (p.kind === 'pour') assert.equal(rules.normalizeMxPending(p, { ...st, draft: { ...st.draft, method: 'exact' } }), null);
  if (p.kind === 'court-entry' || p.kind === 'verdict') assert.equal(rules.normalizeMxPending(p, { ...st, mixes: [] }), null);
  if (p.kind === 'verdict') assert.equal(rules.normalizeMxPending(p, { ...st, visited: { court: false } }), null);
  if (p.kind === 'apprentice-return') assert.equal(rules.normalizeMxPending(p, { ...st, activeApprentice: null }), null);
}
for (const p of [null, [], 'entry', {}, { kind: 'invented' }]) assert.equal(rules.normalizeMxPending(p, all), null);
// Separate factories retain separate configuration; no hidden singleton save state.
const otherConfig = clone(config); otherConfig.MX_PAPER = [10, 20, 30]; otherConfig.INK_MIXING_VERSION = 999;
const other = inkRules.create(freeze(otherConfig));
assert.deepEqual(other.mxMix({}), [10, 20, 30]);
assert.deepEqual(rules.mxMix({}), [236, 224, 196]);
assert.equal(other.defaultInkMixing().version, 999); assert.equal(rules.defaultInkMixing().version, 107);
assert.deepEqual(config, oracle.config, 'factory and rules do not mutate configuration');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"[^>]*>/g)].map(match => match[1]);
assert.deepEqual(scripts, ['directory.js?v=129', 'ink-rules.js?v=129', 'light-rules.js?v=129', 'tea-rules.js?v=129', 'warmth-rules.js?v=129', 'warmth-garden.js?v=129', 'spring-letter-rules.js?v=129', 'spring-letter.js?v=129', 'script.js?v=129']);
assert.match(html, /styles\.css\?v=129/);
console.log(`v125 ink rules: 343 legacy/independent palettes, 63 canonical save cases, ${pendingFieldChecks} strict pending field checks passed`);
