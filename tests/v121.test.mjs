import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8'),html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=source.indexOf('  /* ============================================================\n     v121 清晨名重'),end=source.indexOf('  /* ---------- 痕迹室「下一步」 ----------',start);
assert.ok(start>0&&end>start);
const moduleSource=source.slice(start,end),key='goddead_v121_morning_name',desk='morning-name-balance';
const hypotheses=Array.from({length:6},(_,i)=>[`${i}:heavy`,`${i}:light`]).flat();
const plan=[[1,1,1,2,2,2],[1,0,2,1,0,2],[0,1,2,0,1,2]];
const cases={door:{claim:'2:heavy',results:['left','right','right']},seven:{claim:'4:light',results:['left','level','right']},refuse:{claim:'0:light',results:['right','right','level']}};
// Independent physical masses: baseline ten, exceptional token twelve or eight.
function physical(pans,id){if(!Array.isArray(pans)||pans.length!==6||![...pans].every(p=>[0,1,2].includes(p)))return null;let l=0,r=0,nl=0,nr=0;const [odd,kind]=id.split(':');for(let i=0;i<6;i++){const weight=i===Number(odd)?kind==='heavy'?12:8:10;if(pans[i]===1){l+=weight;nl++;}if(pans[i]===2){r+=weight;nr++;}}return nl<1||nl!==nr?null:l>r?'left':l<r?'right':'level';}
const oracleCandidates=history=>hypotheses.filter(id=>history.every(h=>physical(h.pans,id)===h.result));
export function makeV121({initial=null,choice='door',done=true,busy=false,dpDraft='',dpPending=null,reduced=false}={}) {
 const memory=new Map([['goddead_v29_branches',JSON.stringify({visited:{confession:false},lastChoice:{confession:choice}})],['goddead_v30_branch_depth','{"old":true}'],['goddead_v53_route_belief','{"old":true}'],['goddead_v54_return_pressure','{"scores":{"confession":3}}'],['goddead_v120_dawn_pulse','{"old":true}']]);
 if(initial!==null)memory.set(key,typeof initial==='string'?initial:JSON.stringify(initial));
 const elements=new Map(),writes=[],schedules=[],scheduled=new Set(),context={done,busy,dpDraft,dpPending};
 const element=id=>({id,hidden:false,disabled:false,textContent:'',children:[],attrs:{},listeners:[],className:'',open:false,scrollIntoView(){},classList:{values:new Set(),toggle(c,b){b?this.values.add(c):this.values.delete(c);}},setAttribute(k,v){this.attrs[k]=String(v);},replaceChildren(...els){this.children=els;},addEventListener(type,fn){this.listeners.push(fn);}});
 const $=s=>{const id=s.replace(/^#/,'');if(!elements.has(id))elements.set(id,element(id));return elements.get(id);};
 const api=new Function('store','$','reduced','AutoAdvance','AudioEngine','buttonAvailable','document','localStorage','dawnPulseUnlocked','getDawnPulse','dpUpstreamBusy','getBranches',`let currentScene='remembrance',navigation='',pendingSceneFocus=null;const goScene=s=>{navigation=s;currentScene=s;};${moduleSource}
 return{get:getMorningName,normalize:normalizeMorningName,compare:mnCompare,canWeigh:mnCanWeigh,candidates:mnCandidates,proven:mnProven,unlocked:morningNameUnlocked,can:morningNameDeskCanVisit,bridge:morningNameBridgeAllows,revisit:chooseMnRevisit,enter:chooseMnEnter,resume:chooseMnResume,cycle:cycleMnTag,weigh:weighMnTags,undo:undoMnWeigh,claim:chooseMnClaim,finish:finishMnReview,sync:syncMorningNameAll,forget:forgetMorningNameState,go:s=>{currentScene=s;},arrive:s=>{currentScene=s;resolveMorningNamePendingOnArrival(s);replayMorningNamePending(s);},navigation:()=>navigation};`)
 ({get:(k,f)=>memory.get(k)??f,set:(k,v)=>{memory.set(k,String(v));writes.push(k);}},$,reduced,{has:s=>scheduled.has(s),schedule:(s,t,opt)=>{schedules.push({source:s,target:t,delay:opt.delay});scheduled.add(s);},clear:s=>scheduled.delete(s)},{whoosh(){},tick(){}},id=>{const e=elements.get(id);return !e||!e.hidden&&!e.disabled;},{createElement:()=>element('')},{removeItem:k=>memory.delete(k)},()=>context.done,()=>({repairs:context.done?['down']:[],draft:{valve:context.dpDraft},pending:context.dpPending}),()=>context.busy,()=>JSON.parse(memory.get('goddead_v29_branches')));
 return {...api,memory,elements,writes,context,schedules,arrive:s=>{scheduled.clear();api.arrive(s);},setChoice:c=>{const b=JSON.parse(memory.get('goddead_v29_branches'));b.lastChoice.confession=c;memory.set('goddead_v29_branches',JSON.stringify(b));}};
}
function open(g){g.revisit();g.arrive('confession');g.enter();g.arrive(desk);}
function setPans(g,pans){const current=g.get().draft.pans;for(let i=0;i<6;i++)for(let n=0;n<(pans[i]-current[i]+3)%3;n++)g.cycle(i);}
function solve(g){for(const pans of plan.slice(g.get().draft.history.length)){setPans(g,pans);g.weigh();}g.claim(cases[g.get().draft.confession].claim);}
const sample=makeV121();let comparisons=0,validPans=0;
for(let code=0;code<729;code++){let n=code;const pans=Array.from({length:6},()=>{const p=n%3;n=Math.floor(n/3);return p;});if(physical(pans,'0:heavy')!==null)validPans++;
 for(const id of hypotheses){const [i,p]=id.split(':');assert.equal(sample.compare(pans,Number(i),p),physical(pans,id));comparisons++;}
 for(const result of ['left','level','right'])if(sample.canWeigh(pans)){const h=[{pans,result}];assert.deepEqual(sample.candidates(h),oracleCandidates(h));}
}
assert.equal(validPans,140);assert.equal(comparisons,8748);
const signatures=new Set();
for(const id of hypotheses){const h=plan.map(pans=>({pans,result:physical(pans,id)}));signatures.add(h.map(x=>x.result).join(','));for(let n=0;n<=3;n++)assert.deepEqual(sample.candidates(h.slice(0,n)),oracleCandidates(h.slice(0,n)));assert.deepEqual(sample.candidates(h),[id]);}
assert.equal(signatures.size,12);
for(const a of ['left','level','right'])for(const b of ['left','level','right'])for(const c of ['left','level','right']){const h=plan.map((pans,i)=>({pans,result:[a,b,c][i]}));assert.deepEqual(sample.candidates(h),oracleCandidates(h));}
for(const [choice,m] of Object.entries(cases)) {
 const g=makeV121({choice}),old=[...g.memory];g.sync();g.revisit();assert.equal(g.bridge('confession'),true);assert.equal(g.bridge('vein'),false);assert.equal(g.bridge('echo'),false);g.arrive('confession');assert.equal(JSON.parse(g.memory.get('goddead_v29_branches')).visited.confession,false);g.enter();assert.equal(g.can(),true);g.arrive(desk);
 assert.deepEqual(g.get().draft.pans,[0,0,0,0,0,0]);g.claim(m.claim);g.finish();assert.equal(g.get().pending,null,'unweighed guesses cannot leave');g.cycle(0);const invalid=g.memory.get(key);g.weigh();assert.equal(g.memory.get(key),invalid,'unequal pans cannot count');g.undo(true);
 setPans(g,plan[0]);g.weigh();assert.equal(g.get().draft.history[0].result,m.results[0]);setPans(g,[1,0,0,0,0,0]);
 const cold=makeV121({choice,initial:g.memory.get(key)});cold.arrive(desk);assert.deepEqual(cold.get().draft,g.get().draft,'cold save retains unweighed layout and history');cold.undo();assert.deepEqual(cold.get().draft.pans,plan[0]);assert.equal(cold.get().draft.history.length,0);cold.weigh();cold.setChoice(choice==='door'?'seven':'door');solve(cold);
 assert.deepEqual(cold.get().draft.history.map(h=>h.result),m.results,'captured confession remains fixed');assert.equal(cold.proven(cold.get()),true);cold.claim(m.claim==='0:heavy'?'1:light':'0:heavy');assert.equal(cold.elements.get('mn-finish').disabled,true);assert.match(cold.elements.get('mn-status').textContent,/排除/);cold.claim(m.claim);
 const full=cold.get().draft;cold.go('confession');cold.sync();cold.enter();cold.arrive(desk);assert.deepEqual(cold.get().draft,full,'fully proved but unsent case survives re-entry');cold.finish();const pending=cold.get();assert.equal(pending.pending.kind,'reconcile');assert.equal(pending.reviewRuns,0);cold.cycle(0);assert.deepEqual(cold.get(),pending);
 const sourceCold=makeV121({choice,initial:pending});sourceCold.arrive(desk);assert.equal(sourceCold.schedules.at(-1).target,'confession');sourceCold.arrive('confession');sourceCold.arrive('confession');assert.equal(sourceCold.get().reviewRuns,1);assert.deepEqual(sourceCold.get().reconciled,[choice]);assert.equal(sourceCold.get().draft.confession,'');
 for(const [k,v]of old)assert.equal(g.memory.get(k),v,'all old keys preserved');assert.equal(g.writes.every(k=>k===key),true);
 sourceCold.enter();sourceCold.arrive(desk);solve(sourceCold);sourceCold.finish();sourceCold.arrive('confession');assert.equal(sourceCold.get().reviewRuns,2);assert.equal(sourceCold.get().reconciled.length,1);
 for(const kind of ['revisit','enter','reconcile']){const p=makeV121({choice});p.revisit();if(kind!=='revisit'){p.arrive('confession');p.enter();}if(kind==='reconcile'){p.arrive(desk);solve(p);p.finish();}const original=p.get();assert.equal(original.pending.kind,kind);
  for(const field of ['source','target','feedback','kind',...(kind==='revisit'?[]:['confession'])]){const changed=structuredClone(original);changed.pending[field]='bad';assert.equal(p.normalize(changed).pending,null);}const extra=structuredClone(original);extra.pending.extra=true;assert.equal(p.normalize(extra).pending,null);
  if(kind==='reconcile'){const fake=structuredClone(original);fake.draft.history[0].result='level';assert.equal(p.normalize(fake).pending,null);const wrong=structuredClone(original);wrong.draft.claim='5:heavy';assert.equal(p.normalize(wrong).pending,null);}
  const off=makeV121({choice,initial:original});off.arrive('threshold');assert.equal(off.get().pending.kind,kind);assert.equal(off.schedules.length,0);off.go('remembrance');off.sync();off.resume();if(kind!=='revisit')assert.equal(off.navigation(),original.pending.source);
 }
 const stalled=makeV121({choice,initial:pending,busy:true});stalled.arrive('confession');assert.equal(stalled.get().pending.kind,'reconcile');stalled.context.busy=false;stalled.arrive('confession');assert.equal(stalled.get().reviewRuns,1);
 const limited=makeV121({choice});open(limited);for(let i=0;i<3;i++){setPans(limited,plan[0]);limited.weigh();}assert.equal(limited.get().draft.history.length,3);assert.equal(limited.proven(limited.get()),false);const fullRaw=limited.memory.get(key);limited.weigh();limited.cycle(0);assert.equal(limited.memory.get(key),fullRaw);limited.undo(true);assert.equal(limited.get().draft.history.length,0);
}
{
 const g=makeV121();assert.equal(g.compare(new Array(6),0,'heavy'),null);assert.equal(g.compare([4,0,0,0,0,0],0,'heavy'),null);assert.equal(g.compare(plan[0],6,'heavy'),null);assert.equal(g.compare(plan[0],0,'bad'),null);assert.deepEqual(g.candidates([{pans:plan[0],result:'left',extra:true}]),[]);
 const malformed={visited:{room:true,desk:true},draft:{confession:'door',pans:new Array(6),history:[{pans:plan[0],result:'left'},{pans:plan[1],result:'left'},{pans:plan[2],result:'right'}],claim:'bad'},reconciled:['door','bad','door'],reviewRuns:1e30,lastReview:'bad'};
 const normalized=g.normalize(malformed);assert.deepEqual(normalized.draft.pans,Array(6).fill(0));assert.equal(normalized.draft.history.length,1);assert.equal(normalized.draft.claim,'');assert.deepEqual(normalized.reconciled,['door']);assert.equal(normalized.reviewRuns,1);assert.equal(normalized.lastReview,'');
 const bad=makeV121({initial:'{bad'});assert.equal(bad.memory.get(key),'{bad');assert.equal(bad.can(),false);bad.sync();bad.elements.get('mn-entry-btn').listeners[0]({isTrusted:false});assert.equal(bad.get().pending,null);
 open(g);g.forget();assert.equal(g.memory.has(key),false);assert.equal(g.memory.has('goddead_v54_return_pressure'),true);assert.equal(g.elements.get('mn-desk-empty').hidden,true);assert.equal(g.elements.get('mn-claim-0-heavy').attrs['aria-pressed'],'false');
}
for(const opts of [{done:false},{busy:true},{dpDraft:'up'},{dpPending:{kind:'repair'}}]){const g=makeV121(opts);g.sync();g.revisit();assert.equal(g.get().pending,null);if(opts.done===false){assert.equal(g.bridge('confession'),false);assert.equal(g.can(),false);}}
{const g=makeV121({choice:'bad'});g.revisit();g.arrive('confession');g.enter();assert.equal(g.get().pending,null);assert.equal(g.elements.get('mn-desk-entry-btn').disabled,true);const reduced=makeV121({reduced:true});reduced.revisit();assert.equal(reduced.schedules[0].delay,300);}
{
 const a=source.indexOf('    if (BRANCH_SCENES.includes(target) && !branchState.visited[target]'),b=source.indexOf('\n\n',a),guard=source.slice(a,b);
 const route=new Function('target','morningNameBridgeAllows',`const BRANCH_SCENES=['echo','vein','confession'],branchState={visited:{}},AUDIT_BRANCH_OUTCOME={},auditGuardState={outcome:'none'},beliefGuard={branches:{}},BELIEF_SCENE_BRANCH={};const innocentWitnessProtectionBridgeAllows=()=>false,unspokenPersonhoodBridgeAllows=()=>false,unfinishedThoughtBridgeAllows=()=>false,lostWeightBridgeAllows=()=>false,exactTeaBridgeAllows=()=>false,riverEchoBridgeAllows=()=>false,dawnPulseBridgeAllows=()=>false;${guard}return target;`);
 const g=makeV121();assert.equal(route('confession',g.bridge),'corridor');g.revisit();assert.equal(route('confession',g.bridge),'confession');assert.equal(route('echo',g.bridge),'corridor');assert.equal(route('vein',g.bridge),'corridor');g.forget();assert.equal(route('confession',g.bridge),'corridor');
}
assert.match(source,/resolveMorningNamePendingOnArrival\(name\);\s*replayMorningNamePending\(name\);/);assert.match(source,/focusDawnPulseArrival\(name\);\s*focusMorningNameArrival\(name\);/);
assert.match(source,/forgetDawnPulseState\(\);\s*forgetMorningNameState\(\);\s*forgetCodexFolds/);assert.match(source,/syncDawnPulseAll\(\);\s*syncMorningNameAll\(\);\s*revealScene/);assert.match(source,/if \(st\.repairs\.length\) return morningNameProgressStep\(\)/);
assert.doesNotMatch(moduleSource,/innerHTML|showScene/);assert.match(moduleSource,/if\(event\.isTrusted\)fn\(\)/);
for(let i=0;i<6;i++){assert.ok(html.includes(`id="mn-tag-${i}" type="button"`));for(const p of ['heavy','light'])assert.ok(html.includes(`id="mn-claim-${i}-${p}" type="button"`));}
for(const asset of ['confession-dawn','morning-name-balance']){assert.ok(html.includes(`data-src="assets/v121-${asset}.webp"`));const b=readFileSync(new URL(`../assets/v121-${asset}.webp`,import.meta.url));assert.equal(b.toString('ascii',0,4),'RIFF');assert.ok(b.length<300*1024);}
console.log(`v121 morning name: ${comparisons} independent physical comparisons, 140 equal-pan layouts, 12 unique three-weigh signatures and three cold-review paths passed`);
