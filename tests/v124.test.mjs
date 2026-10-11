import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=source.indexOf('  const outstandingProgressStep =');
const end=source.indexOf('  /* v91 不是三轴模板',start);
const helper=source.slice(start,end);
const rows=[...helper.matchAll(/^\s*\[(\d+), ("[^"]+"), (\w+), (.*?), ("[^"]*"), ("(?:\\.|[^"\\])*")\],$/gm)].map(([,v,name,get,gate,field,selector])=>({v:+v,name:JSON.parse(name),get,gate,field:JSON.parse(field),selector:JSON.parse(selector)}));
assert.deepEqual(rows.map(r=>r.v),Array.from({length:59},(_,i)=>i+63));
// Parse actual markup ancestry. Facade proves routing and visibility contracts, not rendered layout.
class Node {
 constructor(tag,attrs,parent){this.tag=tag;this.attrs=attrs;this.parent=parent;this.hidden='hidden' in attrs;this.id=attrs.id||'';this.dataset={scene:attrs['data-scene']};this.textContent='';this.disabled=false;this.isConnected=true;this.listeners={};this.classList={add(){},remove(){}};}
 getAttribute(k){return this.attrs[k]??null;} setAttribute(k,v){this.attrs[k]=v;} removeAttribute(k){delete this.attrs[k];}
 closest(s){for(let n=this;n;n=n.parent)if(s==='[hidden]'?n.hidden:s==='.scene'?!!n.dataset.scene:s==='[id$="-codex"]'?n.id.endsWith('-codex'):false)return n;return null;}
 addEventListener(t,f){this.listeners[t]=f;} replaceChildren(...n){this.children=n;} scrollIntoView(){this.scrolled=true;} focus(){this.focused=true;}
}
const stack=[],nodes=[];
for(const token of html.matchAll(/<\/?([a-zA-Z0-9-]+)([^>]*)>|([^<]+)/g)){
 if(token[3]){if(stack.length)stack.at(-1).textContent+=token[3];continue;}
 const [,tag,raw]=token;if(token[0].startsWith('</')){if(stack.at(-1)?.tag!==tag.toLowerCase())throw Error(`unbalanced ${tag}`);stack.pop();continue;}
 const attrs=Object.fromEntries([...raw.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(([,k,v])=>[k,v??'']));
 const n=new Node(tag.toLowerCase(),attrs,stack.at(-1));nodes.push(n);
 if(!['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'].includes(n.tag)&&!token[0].endsWith('/>'))stack.push(n);
}
const byId=new Map(nodes.filter(n=>n.id).map(n=>[n.id,n]));
const scenes=Object.fromEntries(nodes.filter(n=>n.dataset.scene).map(n=>[n.dataset.scene,n]));
assert.equal(Object.keys(scenes).length,280);
assert.ok(nodes.filter(n=>n.tag==='button'&&n.attrs['data-go']==='threshold'&&n.closest('.scene')?.dataset.scene==='eyelid-archive').every(n=>!n.closest('[hidden]')),'original eyelid exit stays outside both hidden receipts');
const select=s=>s.startsWith('#')?[byId.get(s.slice(1))].filter(Boolean):nodes.filter(n=>n.tag==='button'&&n.id.startsWith(JSON.parse(s.match(/\^=(".*")/)[1])));
const states=new Map(rows.map(r=>[r.v,{pending:null}])),locked=new Set(),reads=[];
const scope={scenes,$:s=>select(s)[0]??null,$$:select};
const bounded=[['SCENE_FOR_CAUCUS','caucus'],['SCENE_FOR_COUNTERPART','counterpart'],['SCENE_FOR_RESERVE','reserve'],['SCENE_FOR_CONTRABAND','contraband'],['SCENE_FOR_PRIOR_ART','priorArt'],['SCENE_FOR_PROOF','proof'],['REALITY_REFUND_SCENE_FOR_PROOF','proof'],['SELF_AUTHENTICITY_SCENE_FOR_PROVENANCE','provenance'],['FIRST_PERSON_RATIONING_SCENE_FOR_ENTITLEMENT','entitlement'],['UNSPOKEN_PERSONHOOD_SCENE_FOR_EVIDENCE','evidence'],['UNFINISHED_THOUGHT_SCENE_FOR_TRACE','trace'],['REGRET_RESIDUE_TABLE','residue']];
for(const [table] of bounded)scope[table]=new Proxy({}, {get:(_,key)=>key==='undefined'?undefined:table==='REGRET_RESIDUE_TABLE'?{target:key}:key});

for(const r of rows){scope[r.get]=()=>{reads.push(r.v);return states.get(r.v);};if(!r.gate.startsWith('()'))scope[r.gate]=()=>!locked.has(r.v);}
// v64/65 have the actual shared ending-return gate in their registry.
states.get(63).unendingUnlocked=true;
const ctx=vm.createContext(scope);vm.runInContext(helper,ctx);
const step=()=>vm.runInContext('outstandingProgressStep()',ctx);
const reset=()=>{for(const r of rows)states.set(r.v,{pending:null,unendingUnlocked:r.v===63});locked.clear();nodes.forEach(n=>{n.hidden='hidden' in n.attrs;});};
for(const r of rows){
 reset();states.get(r.v).pending={target:'threshold'};
 assert.match(step().title,new RegExp(`^v${r.v} `));assert.equal(step().destination,'threshold');assert.equal(step().receiptId,'');
 // Pending wins even if a same-chapter active receipt also exists.
 if(r.field)states.get(r.v)[r.field]={target:'protocol'};
 assert.match(step().title,/事务在途/);
 if(r.v>=66){locked.add(r.v);reads.length=0;assert.equal(step(),null);assert.ok(!reads.includes(r.v),'locked chapter getter ignored');}
 if(!r.field)continue;
 reset();const receipts=r.v===64?[byId.get('causal-echo-protocol')]:select(r.selector);
 assert.ok(receipts.length>=1,`v${r.v} original return controls exist`);
 for(const receipt of receipts){
  reset();for(const other of receipts)other.hidden=true;
  for(let n=receipt;n;n=n.parent)n.hidden=false;
  receipt.disabled=true; // Disabled away from a scene does not erase the actual receipt location.
  states.get(r.v)[r.field]=r.v>=70&&r.v<=81?{[bounded[r.v-70][1]]:receipt.closest('.scene').dataset.scene}:{target:r.v===64?'protocol':'unused'};
  const result=step();assert.match(result.title,/等待签收/);
  assert.equal(result.destination,receipt.closest('.scene').dataset.scene,`v${r.v} ${receipt.id}`);
  assert.equal(result.receiptId,receipt.id);assert.equal(result.target,null);
 }
 if(r.v!==64){reset();states.get(r.v)[r.field]={};assert.equal(step().destination,'','missing original receipt gives a waiting hint without guessed route');}
}
reset();states.get(63).activeEnding='ascension';assert.equal(step(),null,'a selected ending is not a receipt');
states.get(121).pending={target:'threshold'};states.get(72).pending={target:'protocol'};assert.match(step().title,/^v72 /);
states.get(72).pending=null;assert.match(step().title,/^v121 /);
states.get(121).pending={target:'missing'};assert.equal(step().destination,'');
reset();states.get(63).unendingUnlocked=false;states.get(64).activeEcho={target:'protocol'};assert.equal(step(),null);
// Actual getters execute against an explicit completed unlock-cache boundary. Native QA checks the real unlock chain.
// All 59 reject malformed pending/active data and perform no writes.
const memory=new Map(),writes=[];
const actual=vm.createContext({$:()=>null,$$:()=>[],document:{},store:{get:(k,f)=>memory.get(k)??f,set:(k,v)=>{writes.push(k);memory.set(k,v);},memo:(k,f)=>true},localStorage:{getItem:k=>memory.get(k)??null},currentScene:'remembrance',reduced:true,AutoAdvance:{},parseAndValidateGovernance:()=>({unlockedEndings:['ascension','madness','oblivion','nightwatch']}),setTimeout:()=>0});
vm.runInContext(source.slice(source.indexOf('  const ENDING_RETURN_KEY'),source.indexOf('  /* ============================================================\n     走廊：残页 + 封印的门'))+'\n'+source.slice(source.indexOf('const LATE_CAUSE_KEY'),source.indexOf('  /* ---------- 痕迹室「下一步」 ----------')),actual);
const evaluate=x=>vm.runInContext(x,actual),clone=x=>JSON.parse(JSON.stringify(x));
for(let i=0;i<bounded.length;i++)for(const destination of Object.values(clone(evaluate(bounded[i][0]))).map(v=>typeof v==='object'?v.target:v)){
 const prefix=rows.find(r=>r.v===70+i).selector.match(/\^=\"([^\"]+)\"/)[1];const receipt=byId.get(prefix+destination);
 assert.ok(receipt,`v${70+i} actual table maps to an original receipt`);assert.equal(receipt.closest('.scene').dataset.scene,destination);
}
const keys=[...source.matchAll(/const \w+KEY = ['"](goddead_v(\d+)_[^'"]+)['"]/g)].map(([,key,v])=>({key,v:+v}));
for(const r of rows){
 const key=keys.find(k=>k.v===r.v)?.key;assert.ok(key,`v${r.v} original key`);
 const pristine=clone(evaluate(r.get+'()'));assert.equal(pristine.pending,null);
 memory.set(key,JSON.stringify({...pristine,pending:{kind:'invented',target:'threshold'},...(r.field?{[r.field]:{unknown:'receipt'}}:{})}));
 const before=[...memory];const st=clone(evaluate(r.get+'()'));
 assert.equal(st.pending,null,`v${r.v} malformed pending rejected`);if(r.field)assert.equal(st[r.field],null,`v${r.v} malformed active rejected`);
 assert.deepEqual([...memory],before,`v${r.v} getter read-only`);
}
assert.equal(writes.length,0);
// Fourteen handcraft getter contracts: all records/courts complete still retains every valid active receipt.
const crafts=[['YesterdayBreakfast','YESTERDAY_BREAKFAST','YB','SERVING','serving'],['TodayPress','TODAY_PRESS','TS','PRINT','print'],['InkMixing','INK_MIXING','MX','MIX','mix'],['BorrowedLight','BORROWED_LIGHT','LB','BEAM','beam'],['ExactTea','EXACT_TEA','ET','POUR','pour'],['LastSweep','LAST_SWEEP','SW','SWEEP','sweep'],['PuttingBack','PUTTING_BACK','PB','PLACE','place'],['PaperCut','PAPER_CUT','PC','CUT','cut'],['ClearedOfferings','CLEARED_OFFERINGS','CO','CLEAR','clear'],['ForgottenLocks','FORGOTTEN_LOCKS','LK','UNLOCK','unlock'],['LinenRoom','LINEN_ROOM','LN','FOLD','fold'],['DreamMending','DREAM_MENDING','DM','MEND','mend'],['HearseYard','HEARSE_YARD','HY','DEPART','depart'],['RiverFerry','RIVER_FERRY','RV','DEPART','depart']];
for(const [name,key,prefix,record,activeKey]of crafts){
 const st=clone(evaluate(`default${name}()`)),r=rows.find(r=>r.get==='get'+name);
 const field=Object.keys(st).find(k=>Array.isArray(st[k])&&k!=='courtOutcomes');st[field]=clone(evaluate(`${prefix}_${record}_IDS`));st.courtOutcomes=clone(evaluate(`${prefix}_VERDICT_OUTCOME_IDS`));
 for(const id of st[field]){
  st[r.field]={[activeKey]:id};memory.set(evaluate(key+'_KEY'),JSON.stringify(st));
  const normalized=clone(evaluate(r.get+'()'));assert.deepEqual(normalized[r.field],st[r.field],`${name} active ${id} remains after completion`);
  reset();states.set(r.v,normalized);const receipt=select(r.selector)[0];for(let n=receipt;n;n=n.parent)n.hidden=false;
  assert.match(step().title,new RegExp(`^v${r.v} `));assert.equal(step().receiptId,receipt.id);
 }
}
assert.equal(writes.length,0);
// Paint clears stale href and same-room continuation only focuses the original control.
const guideStart=source.indexOf('  const progressGuide ='),paintStart=source.indexOf('  const paintProgressGuide ='),paintEnd=source.indexOf('  /* v98.1',paintStart);
const paint=source.slice(paintStart,source.indexOf('\n  };',paintStart)+6);
const vars=source.slice(guideStart,source.indexOf('  const progressLabel',guideStart));
const focusStart=source.indexOf('  const focusProgressTarget ='),focusEnd=source.indexOf('  /* ---------- 初始化 ---------- */',focusStart);
const painting=vm.createContext({$:s=>byId.get(s.slice(1)),scenes,currentScene:'remembrance',document:{createElement:()=>new Node('li',{},null)},reduced:true,setTimeout:()=>0,setCodexFolded(){},next:null});
vm.runInContext(vars+'\nconst currentProgressStep=()=>next;\n'+paint+'\n'+source.slice(focusStart,focusEnd),painting);
const render=next=>{painting.next=next;vm.runInContext('paintProgressGuide()',painting);};
const link=byId.get('progress-guide-continue'),go=byId.get('progress-guide-go'),receipt=byId.get('last-word-bank-remittance-return-remembrance');
render({title:'等待',items:['签收'],target:null,destination:'remembrance',receiptId:receipt.id});assert.equal(link.getAttribute('href'),'#remembrance');assert.equal(link.hidden,false);assert.equal(go.hidden,true);
let prevented=false;link.listeners.click({preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(receipt.focused,true);assert.equal(receipt.scrolled,true);
render({title:'入口',items:[],target:null});assert.equal(link.hidden,true);assert.equal(link.getAttribute('href'),null);assert.equal(link.textContent,'');
render(null);assert.equal(byId.get('progress-guide').hidden,true);assert.equal(link.getAttribute('href'),null);
assert.match(html,/directory\.js\?v=124/);
assert.ok(source.indexOf('const outstanding = outstandingProgressStep()')<source.indexOf('    const er = getEndingReturn();',source.indexOf('const currentProgressStep')));
console.log('v124 guide: 59 normalized getter boundaries, original receipt ancestry, priority and fourteen completed handcraft chapters passed');
