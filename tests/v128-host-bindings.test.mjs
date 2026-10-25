// Actual adapter source, isolated callback-contract QA; not whole-game/browser QA.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const source = fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const start = source.indexOf('  /* ---------- v128 余温温室适配 ---------- */');
const endMarker = '  /* ---------- v128 余温温室适配结束 ---------- */';
const end = source.indexOf(endMarker, start) + endMarker.length;
assert.ok(start >= 0 && end > start);
const adapter = source.slice(start, end);
let checks = 0;
const equal = (a, b, label) => { checks++; assert.deepEqual(a, b, label); };
const ok = (v, label) => { checks++; assert.ok(v, label); };
const copy = v => JSON.parse(JSON.stringify(v));
const ownKey = 'goddead_v128_remaining_warmth';
const gates = { morning: true, watch: true, line: true, connected: true, accepted: true, refused: true, appointed: true };
let mn = { reconciled: ['door'], pending: null, draft: { confession: '' } }, oldBusy = false, governance = { rulings: { offering: 'A' } };
const calls = { get: [], set: [], remove: [], has: [], schedule: [], clear: [], navigate: [], button: [], scroll: [] };
let cfg;
const doc = {}, actualRuleSentinel = {};
const instance = Object.freeze({ getState: () => 'state', unlocked: () => 'unlock', canVisit: () => 'visit', bridgeAllows: target => 'bridge:' + target });
const context = vm.createContext({
  document: doc, currentScene: 'offering', reduced: true, veilBusy: false, pendingSceneFocus: null,
  GoddeadWarmthRules: { create: () => actualRuleSentinel },
  GoddeadWarmthGarden: { create: config => { cfg = config; return instance; } },
  store: { get: (...args) => { calls.get.push(args); return 'raw'; }, set: (...args) => calls.set.push(args) },
  localStorage: { removeItem: key => calls.remove.push(key) },
  morningNameUnlocked: () => gates.morning, getMorningName: () => mn, mnUpstreamBusy: () => oldBusy,
  watchUnlocked: () => gates.watch, line4Unlocked: () => gates.line, getLine4: () => ({ connected: gates.connected }),
  getDL: () => ({ accepted: gates.accepted }), getCancel: () => ({ refused: gates.refused }), getActing: () => ({ appointed: gates.appointed }),
  parseAndValidateGovernance: () => governance,
  buttonAvailable: id => { calls.button.push(id); return id === 'available'; },
  AutoAdvance: { has: scene => { calls.has.push(scene); return scene === 'occupied'; }, schedule: (...args) => calls.schedule.push(args), clear: source => calls.clear.push(source) },
  goScene: target => calls.navigate.push(target),
});
vm.runInContext(adapter, context, { filename: 'script.js#actual-v128-adapter' });
equal(Object.keys(cfg).sort(), ['document', 'rules', 'readRaw', 'writeRaw', 'removeOwn', 'currentScene', 'unlocked', 'upstreamBusy', 'captureRuling', 'buttonAvailable', 'hasAdvance', 'schedule', 'clearAdvance', 'navigate', 'setArrivalFocus', 'transitionBusy', 'reduced'].sort());
equal(cfg.document, doc); equal(cfg.rules, actualRuleSentinel); equal(cfg.reduced, true);
equal(cfg.readRaw(), 'raw'); cfg.writeRaw('chapter-json'); cfg.removeOwn();
equal(calls.get, [[ownKey, '{}']]); equal(calls.set, [[ownKey, 'chapter-json']]); equal(calls.remove, [ownKey]);
equal(cfg.currentScene(), 'offering'); context.currentScene = 'threshold'; equal(cfg.currentScene(), 'threshold');
equal(cfg.unlocked(), true);
for (const name of Object.keys(gates)) { gates[name] = false; equal(cfg.unlocked(), false, 'missing ' + name); gates[name] = true; }
mn.reconciled = []; equal(cfg.unlocked(), false); mn.reconciled = ['door']; equal(cfg.unlocked(), true);
equal(cfg.upstreamBusy(), false); oldBusy = true; equal(cfg.upstreamBusy(), true); oldBusy = false;
mn.pending = { kind: 'old' }; equal(cfg.upstreamBusy(), true); mn.pending = null;
mn.draft.confession = 'seven'; equal(cfg.upstreamBusy(), true); mn.draft.confession = ''; equal(cfg.upstreamBusy(), false);
for (const ruling of ['A', 'B', null]) { governance.rulings.offering = ruling; equal(cfg.captureRuling(), ruling); }
equal(cfg.buttonAvailable('available'), true); equal(cfg.buttonAvailable('hidden'), false); equal(calls.button, ['available', 'hidden']);
equal(cfg.hasAdvance('occupied'), true); equal(cfg.hasAdvance('empty'), false); equal(calls.has, ['occupied', 'empty']);
const fire = () => {};
cfg.schedule('source', 'target', 1200, fire); equal(calls.schedule[0].slice(0, 2), ['source', 'target']);
equal(Object.keys(calls.schedule[0][2]).sort(), ['before', 'delay']); equal(calls.schedule[0][2].delay, 1200); equal(calls.schedule[0][2].before, fire);
cfg.clearAdvance('owned-source'); equal(calls.clear, ['owned-source']); cfg.navigate('target'); equal(calls.navigate, ['target']);
const focusEl = { scrollIntoView: options => calls.scroll.push(copy(options)), focus: () => { throw Error('Adapter must not directly focus'); } };
cfg.setArrivalFocus(focusEl); equal(context.pendingSceneFocus, focusEl); equal(calls.scroll, [{ block: 'start', behavior: 'auto' }]);
equal(cfg.transitionBusy(), false); context.veilBusy = true; equal(cfg.transitionBusy(), true);
equal(vm.runInContext('getRemainingWarmth()', context), 'state'); equal(vm.runInContext('remainingWarmthUnlocked()', context), 'unlock');
equal(vm.runInContext('remainingWarmthCanVisit()', context), 'visit'); equal(vm.runInContext("remainingWarmthBridgeAllows('unending-gallery')", context), 'bridge:unending-gallery');
ok(/replayMorningNamePending\(name\);\s*warmthGarden\.onScene\(name\);\s*springLetter\.onScene\(name\);\s*if \(name === "remembrance"\) syncProgressGuide\(\);/.test(source), 'scene lifecycle hook after old pending before progress');
ok(/focusMorningNameArrival\(name\);\s*warmthGarden\.focusArrival\(name\);/.test(source), 'focus hook order');
ok(/forgetMorningNameState\(\);\s*warmthGarden\.forget\(\);\s*springLetter\.forget\(\);\s*forgetCodexFolds\(\);/.test(source), 'forget only own state');
ok(/syncMorningNameAll\(\);\s*warmthGarden\.sync\(\);\s*springLetter\.sync\(\);\s*revealScene\(scenes\.threshold\);\s*syncDoorOpenState\(\);\s*route\(\);/.test(source), 'cold start only sync before route');
const completeStart = source.indexOf('    const complete = () => {', source.indexOf('  const goScene ='));
const completeEnd = source.indexOf('\n    };', completeStart);
const complete = source.slice(completeStart, completeEnd);
ok(complete.indexOf('currentScene = name') < complete.indexOf('sceneInit(name)'), 'currentScene first');
ok(complete.indexOf('sceneInit(name)') < complete.indexOf('warmthGarden.focusArrival(name)'), 'settlement before focus');
ok(complete.indexOf('warmthGarden.focusArrival(name)') < complete.indexOf('veilBusy = false'), 'actual transition remains busy during both hooks');
ok(!/\.sync\(/.test(complete.slice(complete.indexOf('veilBusy = false'))), 'no invented later sync');
console.log(JSON.stringify({ status: 'pass', checks, configKeys: Object.keys(cfg).length, adapterSha256: createHash('sha256').update(adapter).digest('hex'), sourceSha256: createHash('sha256').update(source).digest('hex'), limits: ['Executes exact actual adapter source against callback sentinels; does not validate upstream chapter gameplay, true browser event/focus behavior, storage durability, old route outcomes, or public deployment.'] }, null, 2));
