import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=source.indexOf('  /* ============================================================\n     v120 清晨脉搏');
const end=source.indexOf('  /* ============================================================\n     v121 清晨名重',start);
assert.ok(start>0&&end>start);
const moduleSource=source.slice(start,end),key='goddead_v120_dawn_pulse';
const models={
 down:{kinds:'SSCCSCCSS',initial:[1,1,3,3,1,0,3,1,1],entry:[0,3],exit:[8,1],solution:[0,0,2,1,0,3,0,0,0]},
 up:{kinds:'CSSCSCSSC',initial:[2,1,1,2,1,3,1,1,2],entry:[6,3],exit:[2,1],solution:[1,0,0,0,0,2,0,0,3]},
 isolate:{kinds:'CCSSSSSCC',initial:[2,0,0,0,0,0,0,3,0],entry:[2,0],exit:[6,2],solution:[1,2,1,1,1,1,1,0,3]},
};
const neighbors=[[-1,1,3,-1],[-1,2,4,0],[-1,-1,5,1],[0,4,6,-1],[1,5,7,3],[2,-1,8,4],[3,7,-1,-1],[4,8,-1,6],[5,-1,-1,7]];
// Independent bit-mask ports and disjoint-set connectivity, separate from production BFS.
function oracle(model,turns){
 const masks=turns.map((t,i)=>model.kinds[i]==='S'?[10,5][t]:[3,6,12,9][t]);
 const parent=Array.from({length:9},(_,i)=>i),find=i=>parent[i]===i?i:find(parent[i]);
 const leaks=[];
 for(let i=0;i<9;i++)for(let d=0;d<4;d++)if(masks[i]&(1<<d)){
  const j=neighbors[i][d],terminal=(model.entry[0]===i&&model.entry[1]===d)||(model.exit[0]===i&&model.exit[1]===d);
  if(j<0){if(!terminal)leaks.push([i,d]);}
  else if(!(masks[j]&(1<<((d+2)%4))))leaks.push([i,d]);
  else parent[find(i)]=find(j);
 }
 const lit=(masks[model.entry[0]]&(1<<model.entry[1]))?parent.map((_,i)=>i).filter(i=>find(i)===find(model.entry[0])):[];
 const outlet=lit.includes(model.exit[0])&&Boolean(masks[model.exit[0]]&(1<<model.exit[1]));
 return{lit,leaks,outlet,complete:outlet&&lit.length===9&&!leaks.length};
}
export function makeV120({initial=null,valve='down',done=true,busy=false,reDraft='',rePending=null,reduced=false}={}){
 const memory=new Map([['goddead_v29_branches',JSON.stringify({visited:{vein:false},lastChoice:{vein:valve}})],['goddead_v30_branch_depth','{"old":true}'],['goddead_v53_route_belief','{"old":true}'],['goddead_v54_return_pressure','{"scores":{"vein":3}}'],['goddead_v119_river_echo','{"old":true}']]);
 if(initial!==null)memory.set(key,typeof initial==='string'?initial:JSON.stringify(initial));
 const elements=new Map(),writes=[],schedules=[],scheduled=new Set(),context={done,busy,reDraft,rePending};
 const element=id=>({id,hidden:false,disabled:false,textContent:'',children:[],attrs:{},listeners:[],className:'',querySelector:()=>null,scrollIntoView(){},
  classList:{values:new Set(),toggle(c,b){b?this.values.add(c):this.values.delete(c);}},
  setAttribute(k,v){this.attrs[k]=String(v);},replaceChildren(...els){this.children=els;},addEventListener(type,fn){this.listeners.push(fn);}});
 const $=s=>{const id=s.replace(/^#/,'');if(!elements.has(id))elements.set(id,element(id));return elements.get(id);};
 const api=new Function('store','$','reduced','AutoAdvance','AudioEngine','buttonAvailable','document','localStorage','riverEchoUnlocked','getRiverEcho','reUpstreamBusy','getBranches',
 `let currentScene='remembrance',navigation='',pendingSceneFocus=null;const goScene=s=>{navigation=s;currentScene=s;};${moduleSource}
 return{get:getDawnPulse,normalize:normalizeDawnPulse,analyze:dpAnalyze,ports:dpPorts,unlocked:dawnPulseUnlocked,workCan:dawnPulseWorkCanVisit,bridge:dawnPulseBridgeAllows,
 revisit:chooseDpRevisit,enter:chooseDpEnter,resume:chooseDpResume,rotate:rotateDpTile,undo:undoDpTurn,finish:finishDpRepair,sync:syncDawnPulseAll,forget:forgetDawnPulseState,
 go:s=>{currentScene=s;},arrive:s=>{currentScene=s;resolveDawnPulsePendingOnArrival(s);replayDawnPulsePending(s);},focus:focusDawnPulseArrival,navigation:()=>navigation};`)
 ({get:(k,f)=>memory.get(k)??f,set:(k,v)=>{memory.set(k,String(v));writes.push(k);}},$,reduced,
 {has:s=>scheduled.has(s),schedule:(s,t,opt)=>{schedules.push({source:s,target:t,delay:opt.delay});scheduled.add(s);},clear:s=>scheduled.delete(s)},
 {whoosh(){},tick(){}},id=>{const e=elements.get(id);return !e||!e.hidden&&!e.disabled;},
 {createElement:()=>element(''),createElementNS:()=>element('')},{removeItem:k=>memory.delete(k)},()=>context.done,
 ()=>({heard:context.done?['knock:both-banks-inhabited']:[],draft:{voice:context.reDraft},pending:context.rePending}),()=>context.busy,()=>JSON.parse(memory.get('goddead_v29_branches')));
 return{...api,arrive:s=>{scheduled.clear();api.arrive(s);},memory,writes,elements,context,schedules,
 setValve:v=>{const b=JSON.parse(memory.get('goddead_v29_branches'));b.lastChoice.vein=v;memory.set('goddead_v29_branches',JSON.stringify(b));}};
}
function open(g){g.revisit();g.arrive('vein');g.enter();g.arrive('dawn-pulse-manifold');}
function solve(g){const d=g.get().draft,m=models[d.valve];for(let i=0;i<9;i++){const n=(m.solution[i]-d.turns[i]+(m.kinds[i]==='S'?2:4))%(m.kinds[i]==='S'?2:4);for(let k=0;k<n;k++)g.rotate(i);}}
function compact(r){return{lit:r.lit,leaks:r.leaks.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),outlet:r.outlet,complete:r.complete};}
let matrixChecks=0;
const sample=makeV120();
for(const [v,m]of Object.entries(models)){
 const solutions=[];
 for(let code=0;code<8192;code++){
  let n=code;const turns=Array.from({length:9},(_,i)=>{const domain=m.kinds[i]==='S'?2:4,r=n%domain;n=Math.floor(n/domain);return r;});
  const expected=oracle(m,turns),actual=compact(sample.analyze(v,turns));assert.deepEqual(actual,expected);matrixChecks++;if(expected.complete)solutions.push(turns);
 }
 assert.deepEqual(solutions,[m.solution]);assert.equal(m.kinds.split('').filter(k=>k==='S').length,5);
 assert.equal(m.solution.reduce((n,t,i)=>n+(t-m.initial[i]+(m.kinds[i]==='S'?2:4))%(m.kinds[i]==='S'?2:4),0),14);
 const g=makeV120({valve:v}),old=[...g.memory];g.revisit();assert.equal(g.bridge('vein'),true);assert.equal(g.bridge('echo'),false);g.arrive('vein');assert.equal(JSON.parse(g.memory.get('goddead_v29_branches')).visited.vein,false);
 g.enter();assert.equal(g.workCan(),true);g.arrive('dawn-pulse-manifold');assert.deepEqual(g.get().draft.turns,m.initial);
 const raw=g.memory.get(key);g.finish();assert.equal(g.memory.get(key),raw);g.rotate(0);g.undo();assert.deepEqual(g.get().draft.turns,m.initial);g.rotate(0);g.rotate(1);
 const draft=g.get().draft,cold=makeV120({initial:g.memory.get(key),valve:v});cold.arrive('dawn-pulse-manifold');assert.deepEqual(cold.get().draft,draft);
 cold.setValve(v==='up'?'down':'up');solve(cold);assert.equal(cold.analyze(v,cold.get().draft.turns).complete,true,'captured valve remains fixed after changing upstream');
 cold.go('vein');cold.sync();cold.enter();assert.deepEqual(cold.get().draft.turns,m.solution,'solved but unsent draft resumes intact');cold.arrive('dawn-pulse-manifold');cold.finish();const pending=cold.get();assert.equal(pending.pending.kind,'repair');assert.equal(pending.repairRuns,0);
 cold.rotate(0);assert.deepEqual(cold.get(),pending,'rotation is locked during pending');const sourceCold=makeV120({initial:pending,valve:v});sourceCold.arrive('dawn-pulse-manifold');assert.equal(sourceCold.schedules.at(-1).target,'vein');sourceCold.arrive('vein');sourceCold.arrive('vein');
 assert.equal(sourceCold.get().repairRuns,1);assert.deepEqual(sourceCold.get().repairs,[v]);assert.equal(sourceCold.get().lastRepair,v);assert.equal(sourceCold.get().draft.valve,'');
 for(const [k,value]of old)assert.equal(g.memory.get(k),value,'new operations preserve every old key');assert.equal(g.writes.every(k=>k===key),true);
 sourceCold.enter();sourceCold.arrive('dawn-pulse-manifold');solve(sourceCold);sourceCold.finish();sourceCold.arrive('vein');assert.equal(sourceCold.get().repairRuns,2);assert.equal(sourceCold.get().repairs.length,1);
 for(const kind of ['revisit','enter','repair']){
  const p=makeV120({valve:v});p.revisit();if(kind!=='revisit'){p.arrive('vein');p.enter();}if(kind==='repair'){p.arrive('dawn-pulse-manifold');solve(p);p.finish();}
  const original=p.get();assert.equal(original.pending.kind,kind);
  for(const field of ['source','target','feedback','kind',...(kind==='revisit'?[]:['valve'])]){const changed=structuredClone(original);changed.pending[field]='bad';assert.equal(p.normalize(changed).pending,null);}
  const extra=structuredClone(original);extra.pending.extra=true;assert.equal(p.normalize(extra).pending,null);
  if(kind==='repair'){const broken=structuredClone(original);broken.draft.turns[0]=(broken.draft.turns[0]+1)%(m.kinds[0]==='S'?2:4);assert.equal(p.normalize(broken).pending,null,'repair requires complete matching captured pipework');}
  const off=makeV120({initial:original,valve:v});off.arrive('threshold');assert.equal(off.get().pending.kind,kind);assert.equal(off.schedules.length,0);off.go('remembrance');off.sync();off.resume();if(kind!=='revisit')assert.equal(off.navigation(),original.pending.source);
 }
 const stalled=makeV120({initial:pending,valve:v,busy:true});stalled.arrive('vein');assert.equal(stalled.get().pending.kind,'repair');assert.equal(stalled.get().repairRuns,0);stalled.context.busy=false;stalled.arrive('vein');assert.equal(stalled.get().repairRuns,1);
}
assert.equal(matrixChecks,24576);
{
 const g=makeV120();open(g);g.rotate(0);g.rotate(2);g.undo(true);assert.deepEqual(g.get().draft.turns,models.down.initial);assert.deepEqual(g.get().draft.undo,[]);
 for(let i=0;i<130;i++)g.rotate(i%9);assert.equal(g.get().draft.undo.length,64);const before=g.get().draft.turns.slice();g.rotate(2);g.undo();assert.deepEqual(g.get().draft.turns,before);
 g.forget();assert.equal(g.memory.has(key),false);assert.equal(g.memory.has('goddead_v54_return_pressure'),true);assert.equal(g.elements.get('dp-work-empty').hidden,true);
 const bad=makeV120({initial:'{bad'});assert.equal(bad.get().visited.work,false);assert.equal(bad.memory.get(key),'{bad');assert.equal(bad.workCan(),false);
 assert.equal(bad.analyze('bad',[]),null);assert.equal(bad.analyze('down',new Array(9).fill(4)),null);
 assert.equal(bad.analyze('down',new Array(9)),null,'missing array slots cannot be valid pipes');
 const malformed={visited:{well:true,work:true},draft:{valve:'down',turns:[0],undo:[0]},repairs:['down','bad','down'],repairRuns:1e30,lastRepair:'bad'};
 assert.deepEqual(bad.normalize(malformed).draft,{valve:'down',turns:models.down.initial,undo:[]});assert.deepEqual(bad.normalize(malformed).repairs,['down']);assert.equal(bad.normalize(malformed).repairRuns,1);assert.equal(bad.normalize(malformed).lastRepair,'');
 malformed.draft.turns=models.down.initial;malformed.draft.undo=[0,'bad',2,3];assert.deepEqual(bad.normalize(malformed).draft.undo,[2,3]);
}
for(const opts of [{done:false},{busy:true},{reDraft:'bell'},{rePending:{kind:'reply'}}]){const g=makeV120(opts);g.sync();g.revisit();assert.equal(g.get().pending,null);if(!opts.done&&'done'in opts){assert.equal(g.bridge('vein'),false);assert.equal(g.workCan(),false);}}
{
 const invalid=makeV120({valve:'bad'});invalid.revisit();invalid.arrive('vein');invalid.enter();assert.equal(invalid.get().pending,null);assert.equal(invalid.elements.get('dp-work-entry-btn').disabled,true);
 const g=makeV120();g.sync();g.elements.get('dp-entry-btn').listeners[0]({isTrusted:false});assert.equal(g.get().pending,null);g.go('vein');g.revisit();assert.equal(g.get().pending,null);
 const reduced=makeV120({reduced:true});reduced.revisit();assert.equal(reduced.schedules[0].delay,300);
}
// Actual early branch guard: the new exception grants only vein while the old v119 one remains separate.
{
 const a=source.indexOf('    if (BRANCH_SCENES.includes(target) && !branchState.visited[target]'),b=source.indexOf('\n\n',a),guard=source.slice(a,b);
 const route=new Function('target','dawnPulseBridgeAllows',`const BRANCH_SCENES=['echo','vein','confession'],branchState={visited:{}},AUDIT_BRANCH_OUTCOME={},auditGuardState={outcome:'none'},beliefGuard={branches:{}},BELIEF_SCENE_BRANCH={};const innocentWitnessProtectionBridgeAllows=()=>false,unspokenPersonhoodBridgeAllows=()=>false,unfinishedThoughtBridgeAllows=()=>false,lostWeightBridgeAllows=()=>false,exactTeaBridgeAllows=()=>false,riverEchoBridgeAllows=()=>false,morningNameBridgeAllows=()=>false;${guard}return target;`);
 const g=makeV120();assert.equal(route('vein',g.bridge),'corridor');g.revisit();assert.equal(route('vein',g.bridge),'vein');assert.equal(route('echo',g.bridge),'corridor');assert.equal(route('confession',g.bridge),'corridor');g.arrive('vein');assert.equal(route('vein',g.bridge),'vein');g.forget();assert.equal(route('vein',g.bridge),'corridor');
}
assert.equal((moduleSource.match(/addEventListener\(/g)||[]).length,1);assert.doesNotMatch(moduleSource,/innerHTML|showScene/);assert.match(moduleSource,/if\(event\.isTrusted\)fn\(\)/);
assert.match(source,/resolveDawnPulsePendingOnArrival\(name\);\s*replayDawnPulsePending\(name\);/);assert.match(source,/focusRiverEchoArrival\(name\);\s*focusDawnPulseArrival\(name\);/);
assert.match(source,/forgetRiverEchoState\(\);\s*forgetDawnPulseState\(\);\s*forgetMorningNameState\(\);\s*forgetCodexFolds/);assert.match(source,/syncRiverEchoAll\(\);\s*syncDawnPulseAll\(\);\s*syncMorningNameAll\(\);\s*revealScene/);assert.match(source,/if \(st\.heard\.length\) return dawnPulseProgressStep\(\)/);
for(let i=0;i<9;i++)assert.ok(html.includes(`id="dp-turn-${i}" type="button"`));assert.ok(html.includes('data-scene="dawn-pulse-manifold"'));
for(const asset of ['well-dawn-window','dawn-pulse-manifold']){assert.ok(html.includes(`data-src="assets/v120-${asset}.webp"`));const b=readFileSync(new URL(`../assets/v120-${asset}.webp`,import.meta.url));assert.equal(b.toString('ascii',0,4),'RIFF');assert.ok(b.length<300*1024);}
console.log(`v120 dawn pulse: ${matrixChecks} independent pipe states, three unique solutions and cold-repair paths passed`);
