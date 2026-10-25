#!/usr/bin/env node
// Independent design/implementation QA only. No production implementation.
// Usage: node tests/v128-warmth-rules.test.mjs [alternate/rules.js]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

let assertions = 0;
const ok = (value, label) => { assertions++; assert.ok(value, label); };
const eq = (actual, expected, label) => { assertions++; assert.deepEqual(actual, expected, label); };
const GOAL = 511;
const METHODS = ['affected', 'initialBoard', 'toggle', 'solution', 'hint', 'createDraft',
  'normalizeDraft', 'boardOf', 'move', 'undo', 'reset', 'hold'].sort();
const FIELDS = ['capturedRuling', 'baseParity', 'moves', 'holding'].sort();
const CASES = [
  { ruling: 'A', board: 238, valves: [0, 4, 8] },
  { ruling: 'B', board: 341, valves: [1, 3, 5, 7] },
  { ruling: null, board: 0, valves: [0, 2, 4, 6, 8] },
];

// The oracle uses boolean cells and Manhattan adjacency, not bitwise toggle masks.
const cellsOf = board => Array.from({ length: 9 }, (_, index) => Math.floor(board / (2 ** index)) % 2 === 1);
const boardOfCells = cells => cells.reduce((sum, warm, index) => sum + (warm ? 2 ** index : 0), 0);
function affectedOracle(index) {
  const row = Math.floor(index / 3), column = index % 3;
  return Array.from({ length: 9 }, (_, cell) => cell).filter(cell =>
    Math.abs(Math.floor(cell / 3) - row) + Math.abs(cell % 3 - column) <= 1);
}
function pressOracle(board, index) {
  const cells = cellsOf(board);
  for (const cell of affectedOracle(index)) cells[cell] = !cells[cell];
  return boardOfCells(cells);
}
const selection = parity => cellsOf(parity).flatMap((pressed, index) => pressed ? [index] : []);
const replayOracle = (board, moves) => moves.reduce(pressOracle, board);
const initialOracle = ruling => CASES.find(item => item.ruling === ruling).board;
const draftBoardOracle = draft => replayOracle(replayOracle(initialOracle(draft.capturedRuling), selection(draft.baseParity)), draft.moves);
const parityOf = moves => boardOfCells(moves.reduce((bits, index) => { bits[index] = !bits[index]; return bits; }, Array(9).fill(false)));
const copyDraft = draft => ({ capturedRuling: draft.capturedRuling, baseParity: draft.baseParity, moves: [...draft.moves], holding: draft.holding });
const freezeDraft = draft => Object.freeze({ ...draft, moves: Object.freeze([...draft.moves]) });

function runOracle() {
  const distances = Array(512).fill(-1), queue = [GOAL];
  distances[GOAL] = 0;
  let directedEdges = 0;
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const board = queue[cursor];
    for (let index = 0; index < 9; index++) {
      const next = pressOracle(board, index);
      directedEdges++;
      eq(pressOracle(next, index), board, `oracle double toggle ${board}/${index}`);
      if (distances[next] === -1) { distances[next] = distances[board] + 1; queue.push(next); }
    }
  }
  eq(queue.length, 512, 'oracle BFS reaches all boards');
  eq(directedEdges, 4608, 'oracle examines all directed edges');
  const solutions = new Map();
  for (let parity = 0; parity < 512; parity++) {
    const valves = selection(parity), board = replayOracle(GOAL, valves);
    ok(!solutions.has(board), `unique parity image ${parity}`);
    solutions.set(board, valves);
    eq(valves.length, distances[board], `parity set is BFS-shortest ${board}`);
  }
  eq(solutions.size, 512, 'all parity images distinct');
  let crossPairs = 0, reducingHints = 0;
  for (let board = 0; board < 512; board++) {
    let validSets = 0;
    for (let parity = 0; parity < 512; parity++) {
      if (replayOracle(board, selection(parity)) === GOAL) validSets++;
      crossPairs++;
    }
    eq(validSets, 1, `exactly one solving parity for ${board}`);
    if (board !== GOAL) {
      eq(distances[pressOracle(board, solutions.get(board)[0])], distances[board] - 1, `oracle hint reduces ${board}`);
      reducingHints++;
    }
  }
  const distribution = Array.from({ length: 10 }, (_, distance) => distances.filter(value => value === distance).length);
  eq(distribution, [1, 9, 36, 84, 126, 126, 84, 36, 9, 1], 'distance distribution');
  for (const item of CASES) {
    eq(solutions.get(item.board), item.valves, `initial solution ${String(item.ruling)}`);
    eq(distances[item.board], item.valves.length, `initial minimum ${String(item.ruling)}`);
  }
  return { distances, solutions, report: { states: queue.length, directedEdges, parityImages: solutions.size,
    stateParityPairs: crossPairs, reducingHints, distanceDistribution: distribution,
    initialMinimums: CASES.map(item => ({ ruling: item.ruling, board: item.board, moves: item.valves.length })) } };
}

function ownData(object, name, label) {
  const descriptor = Object.getOwnPropertyDescriptor(object, name);
  ok(descriptor && Object.hasOwn(descriptor, 'value'), `${label}: own data ${name}`);
  return descriptor.value;
}
function plainArray(actual, expected, label) {
  ok(Array.isArray(actual), `${label}: array`);
  const expectedValues = Array.from(expected);
  eq(Reflect.ownKeys(actual).filter(key => key !== 'length').map(String), Array.from(expectedValues, (_, index) => String(index)), `${label}: no extra/sparse keys`);
  const values = Array.from(expectedValues, (_, index) => ownData(actual, String(index), label));
  eq(values, expectedValues, label);
}
function assertDraft(actual, expected, label, input) {
  ok(actual !== null && typeof actual === 'object' && !Array.isArray(actual), `${label}: object`);
  eq(Reflect.ownKeys(actual).sort(), FIELDS, `${label}: exact fields`);
  for (const key of ['capturedRuling', 'baseParity', 'holding']) eq(ownData(actual, key, label), expected[key], `${label}: ${key}`);
  plainArray(ownData(actual, 'moves', label), expected.moves, `${label}: moves`);
  if (input) {
    ok(actual !== input, `${label}: independent record`);
    ok(actual.moves !== input.moves, `${label}: independent moves`);
  }
}
function throwsTypeError(fn, label) {
  let error;
  try { fn(); } catch (caught) { error = caught; }
  ok(error && error.name === 'TypeError', `${label}: throws TypeError`);
}

function runImplementation(modulePath, oracle) {
  const source = fs.readFileSync(modulePath, 'utf8');
  const sandbox = Object.create(null);
  const context = vm.createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(`
    globalThis.__qaForbiddenCalls = 0;
    const forbidden = () => { __qaForbiddenCalls++; throw new Error('Forbidden impurity'); };
    Date = new Proxy(Date, { apply: forbidden, construct: forbidden, get: forbidden });
    Math.random = forbidden;
    for (const name of ['document', 'window', 'localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest',
      'setTimeout', 'setInterval', 'performance', 'crypto', 'navigator']) {
      Object.defineProperty(globalThis, name, { configurable: false, get: forbidden });
    }
  `, context);
  const before = vm.runInContext('Reflect.ownKeys(globalThis)', context);
  const beforeDescriptors = vm.runInContext('Object.getOwnPropertyDescriptors(globalThis)', context);
  function unchangedExistingGlobals(label) {
    const current = vm.runInContext('Object.getOwnPropertyDescriptors(globalThis)', context);
    for (const key of before) {
      const original = beforeDescriptors[key], next = current[key];
      ok(next, `${label}: global retained ${String(key)}`);
      for (const field of ['value', 'get', 'set', 'writable', 'enumerable', 'configurable']) {
        ok(Object.is(next[field], original[field]), `${label}: global descriptor unchanged ${String(key)}.${field}`);
      }
    }
  }
  vm.runInContext(source, context, { filename: modulePath, timeout: 5000 });
  const after = vm.runInContext('Reflect.ownKeys(globalThis)', context);
  eq(Array.from(after).filter(key => !before.includes(key)), ['GoddeadWarmthRules'], 'only declared registry global added');
  eq(Array.from(before).filter(key => !after.includes(key)), [], 'no existing globals deleted');
  unchangedExistingGlobals('module load');
  const registry = context.GoddeadWarmthRules;
  ok(registry && Object.isFrozen(registry), 'frozen registry');
  eq(Reflect.ownKeys(registry), ['create'], 'exact registry');
  ok(typeof registry.create === 'function', 'factory exists');
  const api = registry.create();
  ok(api && Object.isFrozen(api), 'frozen API');
  eq(Reflect.ownKeys(api).sort(), METHODS, 'exact 12 methods');
  for (const method of METHODS) ok(typeof api[method] === 'function', `${method} callable`);
  let transitions = 0, solutions = 0, parityDrafts = 0;
  for (let index = 0; index < 9; index++) {
    const first = api.affected(index), second = api.affected(index);
    plainArray(first, affectedOracle(index), `affected ${index}`);
    plainArray(second, affectedOracle(index), `affected repeat ${index}`);
    ok(first !== second, `affected fresh ${index}`);
  }
  for (let board = 0; board < 512; board++) {
    const first = api.solution(board), second = api.solution(board);
    plainArray(first, oracle.solutions.get(board), `solution ${board}`);
    plainArray(second, oracle.solutions.get(board), `solution repeat ${board}`);
    ok(first !== second, `solution fresh ${board}`);
    eq(api.hint(board), oracle.solutions.get(board)[0] ?? null, `hint ${board}`);
    eq(replayOracle(board, Array.from(first)), GOAL, `solution reaches warm ${board}`);
    solutions++;
    for (let index = 0; index < 9; index++) {
      const next = api.toggle(board, index);
      eq(next, pressOracle(board, index), `toggle ${board}/${index}`);
      eq(api.toggle(next, index), board, `double toggle ${board}/${index}`);
      transitions++;
    }
  }
  for (const item of CASES) {
    eq(api.initialBoard(item.ruling), item.board, `initial ${String(item.ruling)}`);
    const expected = { capturedRuling: item.ruling, baseParity: 0, moves: [], holding: false };
    const first = api.createDraft(item.ruling), second = api.createDraft(item.ruling);
    assertDraft(first, expected, 'create draft');
    assertDraft(second, expected, 'create fresh draft', first);
    for (let parity = 0; parity < 512; parity++) {
      const draft = freezeDraft({ ...expected, baseParity: parity, moves: [0, 8, 0] });
      eq(api.boardOf(draft), draftBoardOracle(draft), `checkpoint derivation ${String(item.ruling)}/${parity}`);
      assertDraft(api.normalizeDraft(draft), draft, 'normalize frozen checkpoint', draft);
      parityDrafts++;
    }
  }

  let replaySteps = 0, undoSteps = 0;
  for (const item of CASES) {
    let current = api.createDraft(item.ruling);
    const fullHistory = [];
    for (let step = 0; step < 233; step++) {
      const index = (step * step + 3 * step + Math.floor(step / 7)) % 9;
      const previous = freezeDraft(copyDraft(current));
      fullHistory.push(index);
      current = api.move(previous, index);
      const earlier = fullHistory.slice(0, Math.max(0, fullHistory.length - 64));
      const expected = { capturedRuling: item.ruling, baseParity: parityOf(earlier), moves: fullHistory.slice(-64), holding: false };
      assertDraft(current, expected, `move ${String(item.ruling)}/${step}`, previous);
      eq(api.boardOf(current), replayOracle(item.board, fullHistory), `full replay ${String(item.ruling)}/${step}`);
      const reloaded = api.normalizeDraft(JSON.parse(JSON.stringify(current)));
      assertDraft(reloaded, expected, 'JSON reload', current);
      eq(api.boardOf(reloaded), replayOracle(item.board, fullHistory), 'JSON reload board');
      current = reloaded;
      replaySteps++;
    }
    const checkpoint = copyDraft(current);
    for (let step = 1; step <= 64; step++) {
      const previous = freezeDraft(copyDraft(current));
      current = api.undo(previous);
      const expected = { ...checkpoint, moves: checkpoint.moves.slice(0, 64 - step) };
      assertDraft(current, expected, `undo checkpoint ${step}`, previous);
      eq(api.boardOf(current), replayOracle(item.board, fullHistory.slice(0, 233 - step)), `undo board ${step}`);
      undoSteps++;
    }
    const checkpointOnly = freezeDraft(copyDraft(current));
    assertDraft(api.undo(checkpointOnly), checkpointOnly, 'undo stops at checkpoint', checkpointOnly);
    assertDraft(api.reset(checkpointOnly), { capturedRuling: item.ruling, baseParity: 0, moves: [], holding: false }, 'reset preserves case', checkpointOnly);
    let solved = api.createDraft(item.ruling);
    for (const index of item.valves) solved = api.move(freezeDraft(solved), index);
    eq(api.boardOf(solved), GOAL, 'solved draft');
    const solvedFrozen = freezeDraft(solved);
    const held = api.hold(solvedFrozen, true);
    assertDraft(held, { ...solved, holding: true }, 'raise solved', solvedFrozen);
    const heldFrozen = freezeDraft(held);
    assertDraft(api.normalizeDraft(heldFrozen), held, 'normalize held', heldFrozen);
    assertDraft(api.move(heldFrozen, 0), held, 'held move locked', heldFrozen);
    assertDraft(api.undo(heldFrozen), held, 'held undo locked', heldFrozen);
    assertDraft(api.hold(heldFrozen, true), held, 'repeat raise', heldFrozen);
    assertDraft(api.hold(heldFrozen, false), { ...held, holding: false }, 'put down', heldFrozen);
    assertDraft(api.reset(heldFrozen), { capturedRuling: item.ruling, baseParity: 0, moves: [], holding: false }, 'held reset preserves case', heldFrozen);
    const unsolved = freezeDraft({ capturedRuling: item.ruling, baseParity: 0, moves: [], holding: false });
    assertDraft(api.hold(unsolved, true), unsolved, 'cannot raise cold roots', unsolved);
    assertDraft(api.hold(unsolved, false), unsolved, 'put down cold draft', unsolved);
  }

  const valid = () => ({ capturedRuling: null, baseParity: 0, moves: [], holding: false });
  const invalid = [];
  const add = (label, raw) => invalid.push({ label, raw });
  for (const raw of [null, undefined, false, true, 0, 511, '', 'A', Symbol('x'), 1n, [], () => {},
    new Date(0), new Map(), new Set(), new Uint8Array(4), new Number(0), /x/]) add(`non-record ${typeof raw}`, raw);
  for (const field of FIELDS) { const raw = valid(); delete raw[field]; add(`missing ${field}`, raw); }
  for (const field of ['board', 'solved', 'extra']) add(`unknown ${field}`, { ...valid(), [field]: field === 'board' ? 511 : true });
  const extraHidden = valid(); Object.defineProperty(extraHidden, 'extra', { value: true }); add('hidden extra', extraHidden);
  const extraSymbol = valid(); extraSymbol[Symbol('extra')] = true; add('symbol extra', extraSymbol);
  for (const ruling of ['', 'a', 'C', undefined, false, 0, new String('A')]) add(`bad ruling ${String(ruling)}`, { ...valid(), capturedRuling: ruling });
  for (const baseParity of [-1, 512, 0.5, NaN, Infinity, '0', false, null, undefined, 0n]) add('bad checkpoint', { ...valid(), baseParity });
  for (const holding of [0, 1, 'false', null, undefined, new Boolean(false)]) add('bad holding', { ...valid(), holding });
  add('holding unsolved', { ...valid(), holding: true });
  for (const moves of [null, undefined, {}, '012', new Uint8Array([0]), Array(1), [0, , 2], Array(65).fill(0),
    [-1], [9], [0.5], [NaN], [Infinity], ['0'], [null], [false], [undefined], [0n], [new Number(0)]]) add('invalid moves', { ...valid(), moves });
  const extraArray = [0]; extraArray.extra = 1; add('array extra property', { ...valid(), moves: extraArray });
  const hiddenArray = [0]; Object.defineProperty(hiddenArray, 'extra', { value: 1 }); add('array hidden extra', { ...valid(), moves: hiddenArray });
  const symbolArray = [0]; symbolArray[Symbol('extra')] = 1; add('array symbol extra', { ...valid(), moves: symbolArray });
  class ExoticRecord { constructor() { Object.assign(this, valid()); } }
  class ExoticArray extends Array {}
  add('class record', new ExoticRecord());
  add('custom prototype record', Object.assign(Object.create({ marker: true }), valid()));
  add('array subclass', { ...valid(), moves: new ExoticArray(0, 1) });
  for (const exotic of [new Date(0), new Map(), new Set()]) {
    add('exotic instance with four valid fields', Object.assign(exotic, valid()));
  }
  let getterCalls = 0;
  for (const field of FIELDS) {
    const raw = valid(); Object.defineProperty(raw, field, { enumerable: true, get() { getterCalls++; return valid()[field]; } });
    add(`accessor ${field}`, raw);
  }
  const accessorMoves = [0]; Object.defineProperty(accessorMoves, '0', { enumerable: true, get() { getterCalls++; return 0; } });
  add('array accessor', { ...valid(), moves: accessorMoves });
  const extraAccessor = valid(); Object.defineProperty(extraAccessor, 'extra', { get() { getterCalls++; return 0; } });
  add('hidden extra accessor', extraAccessor);
  const exoticAccessorPrototype = Object.create(null);
  Object.defineProperty(exoticAccessorPrototype, 'constructor', { get() { getterCalls++; return Object; } });
  add('exotic inherited accessor', Object.assign(Object.create(exoticAccessorPrototype), valid()));
  const ownTagAccessor = valid();
  Object.defineProperty(ownTagAccessor, Symbol.toStringTag, { get() { getterCalls++; return 'Object'; } });
  add('own toStringTag accessor', ownTagAccessor);
  const inheritedTagPrototype = Object.create(null);
  Object.defineProperty(inheritedTagPrototype, Symbol.toStringTag, { get() { getterCalls++; return 'Object'; } });
  add('inherited toStringTag accessor', Object.assign(Object.create(inheritedTagPrototype), valid()));
  const arrayTagAccessor = [0];
  Object.defineProperty(arrayTagAccessor, Symbol.toStringTag, { get() { getterCalls++; return 'Array'; } });
  add('array toStringTag accessor', { ...valid(), moves: arrayTagAccessor });
  for (const { label, raw } of invalid) {
    eq(api.normalizeDraft(raw), null, `normalize rejects ${label}`);
    for (const method of ['boardOf', 'undo', 'reset']) throwsTypeError(() => api[method](raw), `${method} rejects ${label}`);
    throwsTypeError(() => api.move(raw, 0), `move rejects ${label}`);
    throwsTypeError(() => api.hold(raw, false), `hold rejects ${label}`);
  }
  eq(getterCalls, 0, 'invalid accessors were never invoked');
  const nullPrototype = Object.assign(Object.create(null), valid(), { moves: Object.freeze([0, 1]) });
  const hiddenFields = {};
  for (const [key, value] of Object.entries(valid())) Object.defineProperty(hiddenFields, key, { value });
  const crossRealm = vm.runInNewContext('({capturedRuling:null,baseParity:13,moves:[0,8,0],holding:false})');
  const frozenCrossRealm = vm.runInNewContext('Object.freeze({capturedRuling:"A",baseParity:0,moves:Object.freeze([0]),holding:false})');
  for (const [label, raw] of [['null prototype', nullPrototype], ['nonenumerable data fields', hiddenFields],
    ['cross realm', crossRealm], ['frozen cross realm', frozenCrossRealm], ['frozen', freezeDraft(valid())]]) {
    const expected = copyDraft(raw);
    assertDraft(api.normalizeDraft(raw), expected, `accept ${label}`, raw);
    eq(api.boardOf(raw), draftBoardOracle(expected), `derive ${label}`);
    assertDraft(api.undo(raw), { ...expected, moves: expected.moves.slice(0, -1) }, `undo ${label}`, raw);
  }
  let mutablePurityChecks = 0;
  for (const original of [
    { capturedRuling: 'A', baseParity: 17, moves: [8, 1, 8], holding: false },
    { capturedRuling: 'A', baseParity: 0, moves: [0, 4, 8], holding: true },
    { capturedRuling: null, baseParity: 3, moves: Array.from({ length: 64 }, (_, index) => index % 9), holding: false },
  ]) {
    const calls = [
      ['normalizeDraft', raw => api.normalizeDraft(raw)], ['boardOf', raw => api.boardOf(raw)],
      ['move', raw => api.move(raw, 4)], ['undo', raw => api.undo(raw)], ['reset', raw => api.reset(raw)],
      ['hold true', raw => api.hold(raw, true)], ['hold false', raw => api.hold(raw, false)],
    ];
    for (const [label, call] of calls) {
      const raw = copyDraft(original), oldMoves = raw.moves, before = copyDraft(raw);
      const result = call(raw);
      eq(copyDraft(raw), before, `${label}: mutable input values unchanged`);
      ok(raw.moves === oldMoves, `${label}: input array reference unchanged`);
      if (typeof result === 'object' && result !== null) {
        ok(result !== raw && result.moves !== oldMoves, `${label}: independent output`);
      }
      mutablePurityChecks++;
    }
  }
  const badIndex = [-1, 9, 0.5, NaN, Infinity, '0', null, undefined, false, 0n, Symbol('index'), {}];
  const badBoard = [-1, 512, 0.5, NaN, Infinity, '0', null, undefined, false, 0n, Symbol('board'), {}];
  const held = freezeDraft({ capturedRuling: 'A', baseParity: 0, moves: [0, 4, 8], holding: true });
  for (const value of badIndex) {
    throwsTypeError(() => api.affected(value), 'affected invalid index');
    throwsTypeError(() => api.toggle(0, value), 'toggle invalid index');
    throwsTypeError(() => api.move(valid(), value), 'move invalid index');
    throwsTypeError(() => api.move(held, value), 'held move still validates index');
  }
  for (const value of badBoard) {
    throwsTypeError(() => api.toggle(value, 0), 'toggle invalid board');
    throwsTypeError(() => api.solution(value), 'solution invalid board');
    throwsTypeError(() => api.hint(value), 'hint invalid board');
  }
  for (const value of ['a', 'C', '', undefined, 0, false, {}, new String('A')]) {
    throwsTypeError(() => api.initialBoard(value), 'invalid initial ruling');
    throwsTypeError(() => api.createDraft(value), 'invalid draft ruling');
  }
  for (const value of [undefined, null, 0, 1, 'true', {}, new Boolean(false)]) {
    throwsTypeError(() => api.hold(valid(), value), 'invalid hold boolean');
    throwsTypeError(() => api.hold(held, value), 'held validates hold boolean');
  }
  let coercionCalls = 0;
  const coercionTrap = { [Symbol.toPrimitive]() { coercionCalls++; throw new Error('coercion'); } };
  for (const call of [() => api.affected(coercionTrap), () => api.initialBoard(coercionTrap),
    () => api.toggle(coercionTrap, 0), () => api.toggle(0, coercionTrap), () => api.solution(coercionTrap),
    () => api.hint(coercionTrap), () => api.createDraft(coercionTrap), () => api.move(held, coercionTrap),
    () => api.hold(held, coercionTrap)]) throwsTypeError(call, 'primitive parameter never coerced');
  eq(api.normalizeDraft({ ...valid(), baseParity: coercionTrap }), null, 'checkpoint never coerced');
  eq(api.normalizeDraft({ ...valid(), moves: [coercionTrap] }), null, 'move entry never coerced');
  eq(coercionCalls, 0, 'no coercion hook invoked');
  eq(vm.runInContext('__qaForbiddenCalls', context), 0, 'no observed time/random/DOM/storage/network/timer use');
  eq(Array.from(vm.runInContext('Reflect.ownKeys(globalThis)', context)), Array.from(after), 'API calls did not add/remove globals');
  unchangedExistingGlobals('API calls');
  return { path: path.resolve(modulePath), sha256: createHash('sha256').update(source).digest('hex'),
    methods: METHODS.length, states: solutions, directedTransitions: transitions, checkpointDrafts: parityDrafts,
    longHistory: { movesPerCase: 233, cases: CASES.length, totalMoves: replaySteps, totalUndoSteps: undoSteps },
    rejectedDraftFixtures: invalid.length, mutablePurityChecks, accessorInvocations: getterCalls, coercionInvocations: coercionCalls, observedForbiddenCalls: 0 };
}

const oracle = runOracle();
const modulePath = process.argv[2] || fileURLToPath(new URL('../warmth-rules.js', import.meta.url));
const implementation = modulePath ? runImplementation(modulePath, oracle) : null;
console.log(JSON.stringify({ status: 'pass', mode: modulePath ? 'implementation' : 'oracle-only', assertions,
  oracle: oracle.report, implementation,
  limits: modulePath ? ['Pure rules only: does not verify browser UI, storage transactions, routing, accessibility, art integration or publication.',
    'Runtime impurity traps cover observed calls, not a formal static proof of all possible behavior.'] :
    ['No implementation loaded or tested. This proves the independent design oracle and runs no browser/frontend acceptance.'] }, null, 2));
