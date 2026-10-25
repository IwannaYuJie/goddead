// Independent QA probe. Reports findings; does not modify implementation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const modulePath = fileURLToPath(new URL('../warmth-rules.js', import.meta.url));
const source = fs.readFileSync(modulePath, 'utf8');
const context = vm.createContext(Object.create(null));
const descriptorsBefore = vm.runInContext('Object.getOwnPropertyDescriptors(globalThis)', context);
vm.runInContext(source, context, { filename: modulePath, timeout: 5000 });
const api = context.GoddeadWarmthRules.create();
let getterCalls = 0;
const valid = () => ({ capturedRuling: null, baseParity: 0, moves: [], holding: false });
const invalid = [];
const add = (label, raw) => invalid.push({ label, raw });
add('record with empty null-rooted custom prototype', Object.assign(Object.create(Object.create(null)), valid()));
const constructorAccessorProto = Object.create(null);
Object.defineProperty(constructorAccessorProto, 'constructor', { get() { getterCalls++; return Object; } });
add('record with inherited constructor accessor', Object.assign(Object.create(constructorAccessorProto), valid()));
const tagAccessorProto = Object.create(null);
Object.defineProperty(tagAccessorProto, Symbol.toStringTag, { get() { getterCalls++; return 'Object'; } });
add('record with inherited toStringTag accessor', Object.assign(Object.create(tagAccessorProto), valid()));
const clonedObjectProto = Object.create(null, Object.getOwnPropertyDescriptors(Object.prototype));
add('record with cloned Object prototype descriptors', Object.assign(Object.create(clonedObjectProto), valid()));
const fakeObjectProto = Object.create(null);
const FakeObject = function Object() {};
Object.defineProperty(fakeObjectProto, 'constructor', { value: FakeObject });
Object.defineProperty(FakeObject, 'prototype', { value: fakeObjectProto });
add('record with named Object constructor impostor', Object.assign(Object.create(fakeObjectProto), valid()));
const customMoves = [0];
Object.setPrototypeOf(customMoves, Object.create(Object.prototype));
add('moves with same-depth custom prototype', { ...valid(), moves: customMoves });
const constructorMoves = [0];
const arrayConstructorProto = Object.create(Object.prototype);
Object.defineProperty(arrayConstructorProto, 'constructor', { get() { getterCalls++; return Array; } });
Object.setPrototypeOf(constructorMoves, arrayConstructorProto);
add('moves with inherited constructor accessor', { ...valid(), moves: constructorMoves });
const tagMoves = [0];
const arrayTagProto = Object.create(Object.prototype);
Object.defineProperty(arrayTagProto, Symbol.toStringTag, { get() { getterCalls++; return 'Array'; } });
Object.setPrototypeOf(tagMoves, arrayTagProto);
add('moves with inherited toStringTag accessor', { ...valid(), moves: tagMoves });
const clonedArrayProto = [];
Object.setPrototypeOf(clonedArrayProto, Object.prototype);
Object.defineProperty(clonedArrayProto, 'constructor', { value: Array });
const clonedArrayMoves = [0];
Object.setPrototypeOf(clonedArrayMoves, clonedArrayProto);
add('moves with Array-branded custom prototype', { ...valid(), moves: clonedArrayMoves });
const fakeArrayProto = [];
Object.setPrototypeOf(fakeArrayProto, Object.prototype);
const FakeArray = function Array() {};
Object.defineProperty(fakeArrayProto, 'constructor', { value: FakeArray });
Object.defineProperty(FakeArray, 'prototype', { value: fakeArrayProto });
const fakeArrayMoves = [0];
Object.setPrototypeOf(fakeArrayMoves, fakeArrayProto);
add('moves with named Array constructor impostor', { ...valid(), moves: fakeArrayMoves });

const failures = [];
const methods = {
  boardOf: raw => api.boardOf(raw),
  move: raw => api.move(raw, 0),
  undo: raw => api.undo(raw),
  reset: raw => api.reset(raw),
  hold: raw => api.hold(raw, false),
};
for (const { label, raw } of invalid) {
  let normalization;
  try { normalization = api.normalizeDraft(raw); }
  catch (error) { normalization = { unexpectedError: error.name }; }
  if (normalization !== null) failures.push({ fixture: label, method: 'normalizeDraft', issue: 'accepted non-plain prototype' });
  for (const [method, invoke] of Object.entries(methods)) {
    let error;
    try { invoke(raw); } catch (caught) { error = caught; }
    if (error?.name !== 'TypeError') failures.push({ fixture: label, method, issue: error ? `unexpected ${error.name}` : 'accepted non-plain prototype' });
  }
}
assert.equal(getterCalls, 0);

const hidden = {};
for (const [key, value] of Object.entries(valid())) Object.defineProperty(hidden, key, { value });
const accepted = [
  ['ordinary', valid()],
  ['null prototype', Object.assign(Object.create(null), valid())],
  ['nonenumerable own data', hidden],
  ['frozen', Object.freeze({ ...valid(), moves: Object.freeze([0, 8]) })],
  ['cross realm', vm.runInNewContext('({ capturedRuling:null, baseParity:0, moves:[0,8], holding:false })')],
  ['frozen cross realm', vm.runInNewContext('Object.freeze({ capturedRuling:null, baseParity:0, moves:Object.freeze([0,8]), holding:false })')],
];
for (const [label, raw] of accepted) {
  const result = api.normalizeDraft(raw);
  assert.ok(result, label);
  assert.notEqual(result, raw, `${label}: independent record`);
  assert.notEqual(result.moves, raw.moves, `${label}: independent array`);
  assert.equal(JSON.stringify(result), JSON.stringify({ capturedRuling: raw.capturedRuling, baseParity: raw.baseParity, moves: [...raw.moves], holding: raw.holding }), label);
}

const originals = [
  { capturedRuling: 'A', baseParity: 17, moves: [8, 1, 8], holding: false },
  { capturedRuling: 'A', baseParity: 0, moves: [0, 4, 8], holding: true },
  { capturedRuling: null, baseParity: 3, moves: Array.from({ length: 64 }, (_, index) => index % 9), holding: false },
];
let mutationChecks = 0;
for (const original of originals) {
  for (const [label, invoke] of Object.entries({ normalizeDraft: raw => api.normalizeDraft(raw), ...methods, holdTrue: raw => api.hold(raw, true) })) {
    const raw = JSON.parse(JSON.stringify(original));
    const before = JSON.stringify(raw), oldMoves = raw.moves;
    const result = invoke(raw);
    assert.equal(JSON.stringify(raw), before, `${label}: no input mutation`);
    assert.equal(raw.moves, oldMoves, `${label}: no array replacement`);
    if (result && typeof result === 'object') {
      assert.notEqual(result, raw, `${label}: independent output record`);
      assert.notEqual(result.moves, oldMoves, `${label}: independent output array`);
    }
    mutationChecks++;
  }
}
const descriptorsAfter = vm.runInContext('Object.getOwnPropertyDescriptors(globalThis)', context);
for (const key of Reflect.ownKeys(descriptorsBefore)) {
  const before = descriptorsBefore[key], after = descriptorsAfter[key];
  assert.ok(after);
  for (const field of ['value', 'get', 'set', 'writable', 'enumerable', 'configurable']) assert.equal(after[field], before[field]);
}
assert.deepEqual(Reflect.ownKeys(descriptorsAfter).filter(key => !Reflect.has(descriptorsBefore, key)), ['GoddeadWarmthRules']);
console.log(JSON.stringify({
  status: failures.length ? 'fail' : 'pass',
  path: modulePath,
  sha256: createHash('sha256').update(source).digest('hex'),
  prototypeFixtures: invalid.length,
  defects: failures,
  checksPassed: { getterCalls, acceptedFixtures: accepted.length, mutationChecks, existingGlobalsPreserved: true, onlyNewGlobal: 'GoddeadWarmthRules' },
  limits: 'Targeted pure-rule diagnostics only, not browser, runtime integration, or publication acceptance.'
}, null, 2));
assert.equal(failures.length, 0, 'All invalid prototype fixtures must be rejected');
