import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=source.indexOf('  /* ============================================================\n     v119 河岸回声');
const end=source.indexOf('  /* ============================================================\n     v120 清晨脉搏',start);
assert.ok(start>0&&end>start);
const moduleSource=source.slice(start,end);
const key='goddead_v119_river_echo';
const banks=['both-banks-inhabited','one-seat-kept-for-god','river-still-flowing'];
const expected={
  knock:[['steps','steps','bell','knock','steps'],['knock','knock','steps','rest','knock'],['knock','bell','steps','knock','knock']],
  steps:[['bell','steps','bell','bell','knock'],['steps','knock','steps','steps','rest'],['bell','steps','steps','knock','steps']],
  bell:[['knock','bell','steps','knock','knock'],['rest','steps','knock','rest','rest'],['bell','bell','knock','steps','bell']],
};
export function makeV119({initial=null,voice='knock',bank=banks[0],done=true,busy=false,reduced=false}={}){
 const memory=new Map([['goddead_v29_branches',JSON.stringify({visited:{echo:false,vein:false,confession:false},lastChoice:{echo:voice}})],['goddead_v54_return_pressure','{"scores":{"echo":2}}'],['goddead_v118_river_ferry','{"untouched":true}']]);
 if(initial!==null)memory.set(key,typeof initial==='string'?initial:JSON.stringify(initial));
 const writes=[],elements=new Map(),schedules=[],timers=new Map(),scheduledScenes=new Set();let timerId=0;
 const element=(id='')=>({id,hidden:false,disabled:false,children:[],textContent:'',className:'',attrs:{},listeners:[],
  classList:{values:new Set(),toggle(c,b){b?this.values.add(c):this.values.delete(c);},remove(c){this.values.delete(c);},contains(c){return this.values.has(c);}},
  setAttribute(k,v){this.attrs[k]=String(v);},replaceChildren(...els){this.children=els;},addEventListener(type,fn){this.listeners.push(fn);}});
 const $=s=>{const id=s.replace(/^#/,'');if(!elements.has(id))elements.set(id,element(id));return elements.get(id);};
 const $$=s=>s==='#re-call .re-beat'?$('#re-call').children:[];
 const context={done,busy,bank};
 const api=new Function('store','$','$$','reduced','AutoAdvance','AudioEngine','buttonAvailable','document','localStorage','riverFerryUnlocked','getRiverFerry','rvCourtEligible','rvUpstreamBusy','getBranches','setTimeout','clearTimeout',
 `let currentScene='remembrance',navigation='';const goScene=s=>{navigation=s;currentScene=s;};
 ${moduleSource}
 return{get:getRiverEcho,normalize:normalizeRiverEcho,unlocked:riverEchoUnlocked,wellCan:riverEchoWellCanVisit,bridge:riverEchoBridgeAllows,
 revisit:chooseReRevisit,enter:chooseReEnter,resume:chooseReResume,tap:tapReTone,undo:undoReAnswer,finish:finishReReply,listen:listenReCall,stop:clearRiverEchoPlayback,
 pattern:rePattern,prefix:rePrefix,complete:reComplete,forget:forgetRiverEchoState,sync:syncRiverEchoAll,playing:()=>rePlaying,
 go:s=>{clearRiverEchoPlayback();currentScene=s;},arrive:s=>{currentScene=s;resolveRiverEchoPendingOnArrival(s);replayRiverEchoPending(s);},navigation:()=>navigation};`)
 ({get:(k,f)=>memory.get(k)??f,set:(k,v)=>{memory.set(k,String(v));writes.push(k);}},$,$$,reduced,
 {has:s=>scheduledScenes.has(s),schedule:(s,t)=>{schedules.push([s,t]);scheduledScenes.add(s);},clear:s=>scheduledScenes.delete(s)},
 {whoosh(){},knock(){},tick(){},bell(){}},id=>{const e=elements.get(id);return !e||!e.disabled&&!e.hidden;},{createElement:()=>element()},
 {removeItem:k=>memory.delete(k)},()=>context.done,()=>({pending:context.busy?{kind:'finish'}:null,activeFerryman:null,courtOutcomes:context.done?banks:[],lastOutcome:context.bank}),()=>context.done,()=>false,
 ()=>JSON.parse(memory.get('goddead_v29_branches')),
 (fn,delay)=>{const id=++timerId;timers.set(id,{fn,delay});return id;},id=>timers.delete(id));
 const arrive=s=>{scheduledScenes.clear();api.arrive(s);};
 const runTimers=()=>{for(const [id,t]of [...timers].sort((a,b)=>a[1].delay-b[1].delay)){if(timers.has(id)){timers.delete(id);t.fn();}}};
 return{...api,arrive,memory,writes,elements,context,schedules,timers,runTimers,setVoice:v=>{const b=JSON.parse(memory.get('goddead_v29_branches'));b.lastChoice.echo=v;memory.set('goddead_v29_branches',JSON.stringify(b));}};
}
function open(g){g.revisit();g.arrive('echo');g.enter();g.arrive('river-echo-well');}
function answer(g,path){for(const t of path)g.tap(t);}
const base=makeV119();let prefixChecks=0;
for(const [v,paths]of Object.entries(expected))for(let b=0;b<banks.length;b++){
 const path=paths[b];assert.deepEqual(base.pattern(v,banks[b]),path);
 for(let length=0;length<=5;length++)for(let code=0;code<4**length;code++){
  let n=code;const input=Array.from({length},()=>{const t=['knock','steps','bell','rest'][n%4];n=Math.floor(n/4);return t;});
  let correct=0;while(correct<length&&input[correct]===path[correct])correct++;
  assert.deepEqual(base.prefix(v,banks[b],input),input.slice(0,correct));prefixChecks++;
 }
 const g=makeV119({voice:v,bank:banks[b]});const old=[...g.memory];open(g);
 const raw=g.memory.get(key);g.finish();assert.equal(g.memory.get(key),raw);
 const wrong=['knock','steps','bell','rest'].find(t=>t!==path[0]);g.tap(wrong);assert.equal(g.memory.get(key),raw,'wrong first beat never writes');
 g.tap(path[0]);g.undo();assert.equal(g.get().draft.answer.length,0);g.tap(path[0]);g.tap(path[1]);
 const cold=makeV119({initial:g.memory.get(key),voice:v,bank:banks[b]});cold.arrive('river-echo-well');assert.deepEqual(cold.get().draft.answer,path.slice(0,2));
 cold.context.bank=banks[(b+1)%3];cold.setVoice(v==='bell'?'knock':'bell');answer(cold,path.slice(2));assert.deepEqual(cold.get().draft.answer,path,'captured call remains stable after upstream changes');
 cold.go('echo');cold.sync();cold.enter();assert.deepEqual(cold.get().draft.answer,path,'completed but unsent draft survives leave and resume');cold.arrive('river-echo-well');cold.finish();
 const pending=cold.get();assert.equal(pending.pending.kind,'reply');assert.equal(pending.runs,0);cold.tap(path[0]);assert.deepEqual(cold.get(),pending);
 const sourceCold=makeV119({initial:pending,voice:v,bank:banks[b]});sourceCold.arrive('river-echo-well');assert.deepEqual(sourceCold.schedules.at(-1),['river-echo-well','echo']);sourceCold.arrive('echo');sourceCold.arrive('echo');
 assert.equal(sourceCold.get().runs,1);assert.deepEqual(sourceCold.get().heard,[`${v}:${banks[b]}`]);assert.equal(sourceCold.get().lastReply,`${v}:${banks[b]}`);assert.equal(sourceCold.get().draft.voice,'');
 assert.equal(sourceCold.bridge('echo'),true);assert.equal(sourceCold.bridge('vein'),false);assert.equal(sourceCold.bridge('watch'),false);
 for(const [k,val]of old)assert.equal(g.memory.get(k),val,'production interaction never changes old keys');assert.equal(g.writes.every(k=>k===key),true);
 // A second same reply is a repeat run, not a new collection cell.
 sourceCold.enter();sourceCold.arrive('river-echo-well');answer(sourceCold,path);sourceCold.finish();sourceCold.arrive('echo');assert.equal(sourceCold.get().runs,2);assert.equal(sourceCold.get().heard.length,1);
 // All three pending kinds reject altered source, target, feedback and context.
 for(const kind of ['revisit','enter','reply']){
  const probe=makeV119({voice:v,bank:banks[b]});probe.revisit();if(kind!=='revisit'){probe.arrive('echo');probe.enter();}if(kind==='reply'){probe.arrive('river-echo-well');answer(probe,path);probe.finish();}
  const original=probe.get();assert.equal(original.pending.kind,kind);
  for(const field of ['source','target','feedback','kind',...(kind==='revisit'?[]:['voice','bank'])]){
   const changed=structuredClone(original);changed.pending[field]='tampered';assert.equal(probe.normalize(changed).pending,null,`${kind} ${field}`);
  }
  if(kind==='reply'){const changed=structuredClone(original);changed.draft.answer.pop();assert.equal(probe.normalize(changed).pending,null,'reply requires all five matching beats');}
 }
}
assert.equal(prefixChecks,12285);
{
 const g=makeV119();open(g);g.tap('steps');g.tap('steps');g.undo(true);assert.deepEqual(g.get().draft.answer,[]);
 g.listen();assert.equal(g.playing(),true);const before=g.memory.get(key);g.tap('steps');assert.equal(g.memory.get(key),before);g.runTimers();assert.equal(g.playing(),false);assert.equal(g.timers.size,0);
 g.listen();g.go('echo');assert.equal(g.playing(),false);assert.equal(g.timers.size,0);g.runTimers();assert.equal(g.playing(),false);
 const h=makeV119({reduced:true});open(h);h.listen();assert.equal(Math.max(...[...h.timers.values()].map(t=>t.delay)),1100);h.runTimers();assert.equal(h.playing(),false);
 g.forget();assert.equal(g.memory.has(key),false);assert.equal(g.memory.has('goddead_v29_branches'),true);assert.equal(g.elements.get('re-well-empty').hidden,true);
}
for(const opts of [{done:false},{busy:true}]){const g=makeV119(opts);g.sync();g.revisit();assert.equal(g.get().pending,null);assert.equal(g.wellCan(),false);assert.equal(g.bridge('echo'),false);}
{
 const g=makeV119({voice:'bad'});g.revisit();g.arrive('echo');g.enter();assert.equal(g.get().pending,null);assert.equal(g.elements.get('re-well-entry-btn').disabled,true);
 const bad=makeV119({initial:'{bad'});assert.equal(bad.get().visited.well,false);assert.equal(bad.memory.get(key),'{bad');assert.equal(bad.wellCan(),false);
 assert.deepEqual(bad.normalize([]),bad.get());assert.equal(bad.normalize({runs:1e30}).runs,0);assert.equal(bad.normalize({runs:-1}).runs,0);
 const ready=makeV119();ready.sync();ready.elements.get('re-entry-btn').listeners[0]({isTrusted:false});assert.equal(ready.get().pending,null);ready.go('echo');ready.revisit();assert.equal(ready.get().pending,null);
 const g2=makeV119();g2.revisit();assert.equal(g2.bridge('echo'),true);g2.arrive('echo');g2.enter();assert.equal(g2.wellCan(),true);g2.arrive('remembrance');g2.resume();assert.equal(g2.navigation(),'echo','pending resumes source via actual navigation helper');
}
// Run the actual early branch guard with every old permission false.
{
 const a=source.indexOf('    if (BRANCH_SCENES.includes(target) && !branchState.visited[target]');const b=source.indexOf('\n\n',a);assert.ok(a>0&&b>a);
 const guard=source.slice(a,b);const route=new Function('target','riverEchoBridgeAllows',`const BRANCH_SCENES=['echo','vein','confession'];const branchState={visited:{}};const AUDIT_BRANCH_OUTCOME={echo:'echoed',vein:'pulsed',confession:'confessed'};const auditGuardState={outcome:''};const beliefGuard={pendingTarget:'',branches:{}};const BELIEF_SCENE_BRANCH={};const innocentWitnessProtectionBridgeAllows=()=>false;const unspokenPersonhoodBridgeAllows=()=>false;const unfinishedThoughtBridgeAllows=()=>false;const lostWeightBridgeAllows=()=>false;const exactTeaBridgeAllows=()=>false;const dawnPulseBridgeAllows=()=>false;${guard}return target;`);
 const g=makeV119();assert.equal(route('echo',g.bridge),'corridor');g.revisit();assert.equal(route('echo',g.bridge),'echo');assert.equal(route('vein',g.bridge),'corridor');g.arrive('echo');assert.equal(route('echo',g.bridge),'echo');g.forget();assert.equal(route('echo',g.bridge),'corridor');
}
assert.equal((moduleSource.match(/addEventListener\(/g)||[]).length,1);assert.match(moduleSource,/if \(e\.isTrusted\) fn\(\)/);assert.doesNotMatch(moduleSource,/innerHTML/);
assert.match(source,/resolveRiverEchoPendingOnArrival\(name\);\s*replayRiverEchoPending\(name\);/);
assert.match(source,/next\.scrollTop = 0;\s*focusRiverEchoArrival\(name\);/);
assert.match(source,/AutoAdvance\.clearAll\(\);\s*clearRiverEchoPlayback\(\);/);
assert.match(source,/forgetRiverFerryState\(\);\s*forgetRiverEchoState\(\);\s*forgetDawnPulseState\(\);\s*forgetCodexFolds\(\);/);
assert.match(source,/syncRiverFerryAll\(\);\s*syncRiverEchoAll\(\);\s*syncDawnPulseAll\(\);\s*revealScene/);
assert.match(source,/return riverEchoProgressStep\(\)/);assert.match(source,/const goScene = \(name\) =>/);
for(const asset of ['archive-river-window','river-echo-well']){assert.ok(html.includes(`data-src="assets/v119-${asset}.webp"`));const b=readFileSync(new URL(`../assets/v119-${asset}.webp`,import.meta.url));assert.equal(b.toString('ascii',0,4),'RIFF');assert.ok(b.length<300*1024);}
assert.ok(html.includes('data-scene="river-echo-well"'));assert.ok(html.includes('id="re-archive"'));
console.log(`v119 river echo: ${prefixChecks} independent prefixes and nine cold-reply paths passed`);
