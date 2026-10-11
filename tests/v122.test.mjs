import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const a=source.indexOf('  /* ============================================================\n     v117 灵车场');
const b=source.indexOf('  /* ============================================================\n     v118 渡河码头',a);
assert.ok(a>0&&b>a);
const moduleSource=source.slice(a,b),key='goddead_v117_hearse_yard';
export function makeV122({initial=null,unlocked=true}={}) {
 const memory=new Map([['goddead_v116_dream_mending','{"original":true}'],['goddead_v118_river_ferry','{"original":true}']]);
 if(initial!==null)memory.set(key,typeof initial==='string'?initial:JSON.stringify(initial));
 const elements=new Map(),writes=[],schedules=[],scheduled=new Set();
 const el=id=>({id,hidden:false,disabled:false,textContent:'',attrs:{},children:[],listeners:[],style:{setProperty(k,v){this[k]=v;}},classList:{values:new Set(),toggle(c,on){on?this.values.add(c):this.values.delete(c);}},setAttribute(k,v){this.attrs[k]=String(v);},replaceChildren(...els){this.children=els;},addEventListener(type,fn){this.listeners.push(fn);}});
 const $=s=>{const id=s.replace(/^#/,'');if(!elements.has(id))elements.set(id,el(id));return elements.get(id);};
 const api=new Function('store','$','$$','reduced','AutoAdvance','AudioEngine','buttonAvailable','document','localStorage','dreamMendingUnlocked','getDreamMending','dmCourtEligible','DM_VERDICT_OUTCOME_IDS',`let currentScene='remembrance';${moduleSource}
 return {get:getHearseYard,normalize:normalizeHearseYard,sync:syncHearseYardAll,entry:chooseHyEntry,hearse:chooseHyHearse,method:chooseHyMethod,tap:tapHyLot,undo:undoHyYard,reset:resetHyYard,finish:finishHyDeparture,abandon:chooseHyAbandon,driver:chooseHyDriverReturn,forget:forgetHearseYardState,eligible:hyCourtEligible,bridge:hearseYardBridgeAllows,blocks:()=>hyBlocks.map(b=>({...b})),sel:()=>hySel,go:s=>{currentScene=s;},arrive:s=>{currentScene=s;resolveHearseYardPendingOnArrival(s);replayHearseYardPending(s);},hearses:HY_HEARSES,methods:HY_METHODS,table:HY_HEARSE_TABLE};`)
 ({get:(k,f)=>memory.get(k)??f,set:(k,v)=>{memory.set(k,String(v));writes.push(k);}},$,()=>[],false,{has:s=>scheduled.has(s),schedule:(s,t)=>{schedules.push([s,t]);scheduled.add(s);},clear:s=>scheduled.delete(s)},{whoosh(){},tick(){}},id=>{const e=elements.get(id);return !e||!e.hidden&&!e.disabled;},{createElement:()=>el('')},{removeItem:k=>memory.delete(k)},()=>unlocked,()=>({courtOutcomes:['a','b','c'],pending:null,activeMender:null}),()=>true,['a','b','c']);
 return {...api,memory,elements,writes,schedules,arrive:s=>{scheduled.clear();api.arrive(s);}};
}
// Independent translation model: move one unit at a time and test every occupied square.
export function oracleMove(blocks,index,start) {
 const cart=blocks[index],axis=cart.h?'c':'r';
 if(!Number.isInteger(start)||start<0||start+cart.len>5||start===cart[axis])return null;
 const cells=cart=>Array.from({length:cart.len},(_,n)=>`${cart.r+(cart.h?0:n)}:${cart.c+(cart.h?n:0)}`);
 const walls=new Set(blocks.flatMap((v,i)=>i===index?[]:cells(v))),direction=Math.sign(start-cart[axis]);
 for(let p=cart[axis]+direction;;p+=direction){if(cells({...cart,[axis]:p}).some(c=>walls.has(c)))return null;if(p===start)break;}
 return blocks.map((v,i)=>i===index?{...v,[axis]:start}:{...v});
}
const positions=blocks=>blocks.map(v=>v.h?v.c:v.r);
export function oraclePlan(blocks) {
 const key=bs=>positions(bs).join(','),queue=[blocks],seen=new Map([[key(blocks),null]]);
 for(let cursor=0;cursor<queue.length;cursor++) {
  const current=queue[cursor];
  if(current[0].c+current[0].len===5){const plan=[];for(let k=key(current);seen.get(k);k=seen.get(k).from)plan.unshift(seen.get(k).move);return plan;}
  current.forEach((v,i)=>{for(let p=0;p<=5-v.len;p++){const next=oracleMove(current,i,p);if(next&&!seen.has(key(next))){seen.set(key(next),{from:key(current),move:[i,p]});queue.push(next);}}});
 }
 return null;
}
function open(g,hearse,method){g.entry();g.arrive('hearse-gate');g.hearse(hearse);g.arrive('jammed-yard');if(method!=='dawn')g.method(method);}
export function move(g,[i,p]){const v=g.blocks()[i],old=v.h?v.c:v.r,edge=p<old?p:p+v.len-1;if(g.sel()!==i)g.tap(v.r*5+v.c);g.tap(v.h?v.r*5+edge:edge*5+v.c);}
const expected=[[4,9,12],[5,8,13],[6,10,14]],sample=makeV122();let recovered=0,oracleChecks=0;
for(const [hi,hearse]of sample.hearses.entries())for(const [mi,method]of sample.methods.entries()) {
 const g=makeV122(),old=[...g.memory];open(g,hearse,method);const initial=g.blocks(),plan=oraclePlan(initial);
 assert.equal(plan.length,expected[hi][mi],'all nine original shortest solutions stay fixed');
 // Compare every legal first translation with the persisted production move, including the swept path.
 initial.forEach((v,i)=>{for(let p=0;p<=5-v.len;p++){const next=oracleMove(initial,i,p);if(next){const trial=makeV122({initial:g.get()});trial.arrive('jammed-yard');move(trial,[i,p]);assert.deepEqual(trial.blocks(),next);assert.equal(trial.get().draft.moves,1);oracleChecks++;}}});
 let current=g;
 for(const step of plan) {
  const before=current.blocks(),want=oracleMove(before,...step);move(current,step);
  assert.deepEqual(current.blocks(),want);assert.deepEqual(current.get().draft.positions,positions(want));
  const saved=current.memory.get(key),cold=makeV122({initial:saved});cold.arrive('jammed-yard');
  assert.deepEqual(cold.blocks(),want);assert.deepEqual(cold.get().draft,current.get().draft);assert.equal(cold.sel(),-1);
  cold.undo();assert.deepEqual(cold.blocks(),before);assert.equal(cold.get().draft.moves,current.get().draft.moves-1);
  const undoCold=makeV122({initial:cold.get()});undoCold.arrive('jammed-yard');move(undoCold,step);
  assert.deepEqual(undoCold.get().draft,current.get().draft,'undo then move reconstructs exactly the same draft');current=undoCold;recovered++;
 }
 assert.equal(current.elements.get('hy-board').classList.values.has('is-done'),true);
 current.undo();assert.equal(current.elements.get('hy-board').classList.values.has('is-done'),false);current.finish();assert.equal(current.get().pending,null);move(current,plan.at(-1));
 current.finish();const pending=current.get();assert.equal(pending.pending.kind,'finish');assert.equal(pending.departRuns,0);assert.equal(current.elements.get('hy-undo').disabled,true);
 current.undo();current.reset();current.method('dawn');assert.deepEqual(current.get(),pending,'in-flight controls preserve the solved draft');
 const cold=makeV122({initial:pending});cold.arrive('jammed-yard');assert.deepEqual(cold.blocks(),current.blocks());assert.deepEqual(cold.schedules.at(-1),['jammed-yard',sample.table[hearse].target]);
 cold.arrive(sample.table[hearse].target);cold.arrive(sample.table[hearse].target);assert.equal(cold.get().departRuns,1);assert.deepEqual(cold.get().departs,[`${hearse}:${method}`]);assert.equal(cold.get().draft.hearse,'');
 cold.driver(sample.table[hearse].target);cold.arrive('hearse-gate');assert.equal(cold.get().activeDriver,null);
 for(const [k,v]of old)assert.equal(g.memory.get(k),v,'v116 / v118 original raw bytes stay intact');assert.equal(current.writes.every(k=>k===key),true);
}
{
 const g=makeV122();open(g,'reliquary-hearse','dawn');const initial=g.blocks(),step=oraclePlan(initial)[0];move(g,step);const draft=g.get().draft,raw=g.memory.get(key);
 g.go('hearse-gate');g.sync();g.hearse('reliquary-hearse');g.arrive('jammed-yard');assert.deepEqual(g.get().draft,draft,'same vehicle resumes the same captured hour and positions');
 g.tap(10);g.tap(4);assert.equal(g.memory.get(key),raw,'selection and off-axis rejection never write progress');
 g.reset();assert.deepEqual(g.blocks(),initial);assert.equal(g.get().draft.moves,0);assert.equal(g.elements.get('hy-undo').disabled,true);
 move(g,step);g.method('noon');assert.equal(g.get().draft.moves,0);assert.equal(g.get().draft.undo.length,0);assert.equal(g.get().draft.method,'noon');
 move(g,oraclePlan(g.blocks())[0]);g.go('hearse-gate');g.sync();g.hearse('protocol-hearse');g.arrive('jammed-yard');assert.equal(g.get().draft.method,'dawn');assert.equal(g.get().draft.moves,0);
 move(g,oraclePlan(g.blocks())[0]);g.abandon();g.arrive('hearse-gate');assert.equal(g.get().draft.hearse,'');
 g.forget();assert.equal(g.memory.has(key),false);assert.equal(g.elements.get('hy-undo').disabled,true);assert.equal(g.memory.get('goddead_v118_river_ferry'),'{"original":true}');
}
{
 const g=makeV122();open(g,'reliquary-hearse','dawn');const initial=g.blocks(),step=oraclePlan(initial)[0],back=positions(initial)[step[0]];
 for(let n=0;n<130;n++)move(g,[step[0],n%2===0?step[1]:back]);
 assert.equal(g.get().draft.moves,130);assert.equal(g.get().draft.baseMoves,66);assert.equal(g.get().draft.undo.length,64);assert.deepEqual(g.blocks(),initial);
 let cold=makeV122({initial:g.get()});cold.arrive('jammed-yard');
 for(let n=0;n<64;n++){cold.undo();const restored=makeV122({initial:cold.get()});restored.arrive('jammed-yard');assert.deepEqual(restored.get().draft,cold.get().draft);cold=restored;}
 assert.equal(cold.get().draft.moves,66);assert.equal(cold.get().draft.undo.length,0);assert.equal(cold.elements.get('hy-undo').disabled,true);
 const raw=cold.memory.get(key);cold.undo();assert.equal(cold.memory.get(key),raw);move(cold,step);assert.equal(cold.get().draft.moves,67);assert.equal(cold.get().draft.undo.length,1);cold.undo();assert.deepEqual(cold.blocks(),initial);
}
{
 const g=makeV122();open(g,'reliquary-hearse','dawn');const fresh=g.get(),initial=g.blocks(),plan=oraclePlan(initial);move(g,plan[0]);move(g,plan[1]);const good=g.get();
 const corrupt=d=>{const s=structuredClone(good);d(s.draft);const restored=makeV122({initial:s});restored.arrive('jammed-yard');assert.deepEqual(restored.get().draft,fresh.draft,'malformed progress safely restarts just this board');};
 for(const value of [null,{},[],[-1],new Array(initial.length),positions(initial).map((p,i)=>i===0?4:p)])corrupt(d=>d.positions=value);
 for(const count of [-1,NaN,Infinity,'2',1.5,Number.MAX_SAFE_INTEGER+1])corrupt(d=>d.moves=count);
 corrupt(d=>d.undo=[null]);corrupt(d=>d.undo=Array(65).fill(d.positions));corrupt(d=>d.undo[0][0]=3);corrupt(d=>d.undo[1]=d.undo[0]);corrupt(d=>delete d.positions);corrupt(d=>d.undo=[]);corrupt(d=>d.baseMoves=1);corrupt(d=>delete d.baseMoves);
 const double=structuredClone(good);double.draft.undo=[positions(initial)];double.draft.moves=1;assert.deepEqual(g.normalize(double).draft,fresh.draft,'two vehicles cannot change in one history edge');
 // Both endpoint layouts are collision-free, but the target car jumps through two blockers.
 const before=g.blocks(),after=before.map((v,i)=>i===0?{...v,c:3}:{...v});
 const occupied=after.flatMap(v=>Array.from({length:v.len},(_,n)=>(v.r+(v.h?0:n))*5+v.c+(v.h?n:0)));
 assert.equal(new Set(occupied).size,occupied.length,'the jumped-to endpoint itself is collision-free');assert.equal(oracleMove(before,0,3),null,'the independent unit-step model finds the blocker in between');
 const through=structuredClone(good);through.draft.positions=positions(after);through.draft.undo=[positions(before)];through.draft.moves=70;through.draft.baseMoves=69;assert.deepEqual(g.normalize(through).draft,fresh.draft,'valid-looking endpoints cannot pass a blocked swept path');
 const legacy=structuredClone(good);legacy.draft={hearse:'reliquary-hearse',method:'dawn'};assert.deepEqual(g.normalize(legacy).draft,fresh.draft,'old two-field draft migrates to its original layout');
 for(const step of plan.slice(2))move(g,step);g.finish();const oldFlight=g.get();oldFlight.draft={hearse:'reliquary-hearse',method:'dawn'};
 const flight=makeV122({initial:oldFlight});flight.arrive('jammed-yard');assert.equal(flight.get().pending.kind,'finish');assert.deepEqual(flight.schedules.at(-1),['jammed-yard','reliquary']);flight.arrive('reliquary');flight.arrive('reliquary');assert.equal(flight.get().departRuns,1);
 const signed=flight.get();signed.draft={hearse:'',method:'dawn'};const oldSigned=makeV122({initial:signed});oldSigned.arrive('reliquary');assert.equal(oldSigned.get().activeDriver.depart,'reliquary-hearse:dawn');assert.equal(oldSigned.bridge('protocol'),false);oldSigned.driver('reliquary');oldSigned.arrive('hearse-gate');assert.equal(oldSigned.get().activeDriver,null);
}
{
 const locked=makeV122({unlocked:false});locked.sync();locked.entry();locked.tap(10);locked.undo();assert.equal(locked.memory.has(key),false);
 const g=makeV122();open(g,'reliquary-hearse','dawn');move(g,oraclePlan(g.blocks())[0]);const raw=g.memory.get(key);g.elements.get('hy-undo').listeners[0]({isTrusted:false});assert.equal(g.memory.get(key),raw);g.elements.get('hy-undo').listeners[0]({isTrusted:true});assert.equal(g.get().draft.moves,0);
}
assert.match(html,/id="hy-undo" type="button" disabled/);assert.match(source,/onTrustedHy\('#hy-undo', undoHyYard\)/);
assert.doesNotMatch(moduleSource,/刷新页面会把车都推回原位|innerHTML/);assert.match(moduleSource,/刷新接着挪/);
assert.match(css,/\.scene-hearse-gate,\s*\.scene-jammed-yard,\s*\.scene-hearing-of-the-last-cart \{ overflow-y: auto; overflow-x: hidden; \}/,'three hearse scenes let players scroll to controls');
console.log(`v122 hearse recovery: ${recovered} solved-path cold/undo round trips, ${oracleChecks} independent first translations, nine original minima and 130-move bounded checkpoint passed`);
