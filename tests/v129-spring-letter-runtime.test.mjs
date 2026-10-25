// Independent runtime unit QA. This DOM/event facade is explicitly NOT a browser.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {Element} from './qa-dom.mjs';

const ROOM='unaddressed-spring-letter';
const TARGETS={tomorrow:'threshold',stranger:'deadletter',unsent:'remembrance'};
const LETTERS=['window','drawer','chair'];
const PATHS={window:[0,1,5,4,8,9,5,6,2,3,7,11,10],drawer:[3,2,6,7,11,10,6,5,1,0,4,5,9,8],chair:[1,0,4,5,1,2,3,7,11,10,6,5,9,8,4]};
const base=()=>({version:129,visited:false,outcomes:[],letterCount:0,lastLetter:null,draft:null,pending:null});
const active=(letter='window',sealed=false)=>({...base(),visited:true,draft:{letter,path:sealed?[...PATHS[letter]]:[PATHS[letter][0]],sealed}});
const enter=()=>({kind:'enter',source:'deadletter',target:ROOM});
const delivery=(letter='window',recipient='tomorrow')=>({kind:'deliver',source:ROOM,target:TARGETS[recipient],letter,recipient});
const j=x=>JSON.parse(JSON.stringify(x));
const runtimeFile=process.argv[2]||fileURLToPath(new URL('../spring-letter.js',import.meta.url));
const runtime=fs.readFileSync(runtimeFile,'utf8');
const rule=fs.readFileSync(new URL('../spring-letter-rules.js',import.meta.url),'utf8');
const realm=vm.createContext(Object.create(null));
vm.runInContext(rule,realm);
vm.runInContext(`for(const name of ['document','window','localStorage','sessionStorage','fetch','XMLHttpRequest','setTimeout','setInterval','requestAnimationFrame'])Object.defineProperty(globalThis,name,{get(){throw Error('Direct forbidden global '+name)}});`,realm);
vm.runInContext(runtime,realm,{filename:runtimeFile});
const factory=realm.GoddeadSpringLetter, rules=realm.GoddeadSpringLetterRules.create();
let assertions=0;
const ok=(v,l)=>{assertions++;assert.ok(v,l)};
const eq=(a,b,l)=>{assertions++;assert.deepEqual(j(a),j(b),l)};
const cases=[],failures=[];
function test(name,fn){try{fn();cases.push({name,status:'pass'})}catch(e){const f={name,status:'fail',error:e.message.split('\n')[0]};cases.push(f);failures.push(f)}}

function makeDOM(){
 const doc=new Element('document','document'),ids=new Map(),scenes={};
 const add=(id,parent=doc,tag='div',attrs={})=>{const e=new Element(id,tag,attrs);ids.set(id,e);parent.appendChild(e);return e};
 doc.getElementById=id=>ids.get(id)||null;
 doc.createElementNS=(_,tag)=>new Element('',tag);
 doc.createElement=tag=>new Element('',tag);
 for(const s of [ROOM,'deadletter','threshold','remembrance','corridor'])scenes[s]=add('scene-'+s,doc,'section',{'data-scene':s});
 const room=scenes[ROOM],post=scenes.deadletter,rem=scenes.remembrance;
 for(const id of ['sl-title','sl-intro','sl-room-image','sl-collection-summary','sl-collection-note'])add(id,room);
 add('sl-waiting',room,'p',{hidden:''});
 const empty=add('sl-empty',room);add('sl-last-letter',empty);
 for(const l of LETTERS){add('sl-take-'+l,empty,'button');add('sl-source-'+l+'-note',empty)}
 const work=add('sl-workbench',room,'div',{hidden:''});
 for(const id of ['sl-letter-name','sl-letter-text','sl-instructions','sl-route-progress','sl-route-history','sl-route-available','sl-feedback'])add(id,work);
 const board=add('sl-board',work),svg=add('sl-map',board,'svg');add('sl-edges',svg,'g');
 for(let n=0;n<12;n++){const b=add('sl-node-'+n,board,'button',{'data-sl-node':n});add('num-'+n,b,'span',{'data-sl-number':''});add('mark-'+n,b,'span',{'data-sl-mark':''})}
 for(const a of ['hint','undo','reset','seal','unseal'])add('sl-'+a,work,'button',a==='unseal'?{hidden:''}:{});
 const recipients=add('sl-recipients',work,'div',{hidden:''});for(const r of Object.keys(TARGETS))add('sl-send-'+r,recipients,'button');
 const panel=add('sl-post-panel',post,'div',{hidden:''});add('sl-enter',panel,'button');add('sl-post-note',panel);add('sl-post-response',panel);
 const ep=add('sl-entry-panel',rem,'div',{hidden:''});add('sl-entry',ep,'button');add('sl-resume',ep,'button',{hidden:''});add('sl-entry-note',ep);add('sl-entry-response',ep);
 const codex=add('sl-codex',rem,'div',{hidden:''});add('sl-codex-summary',codex);
 for(const l of LETTERS)for(const r of Object.keys(TARGETS)){const el=add('sl-codex-'+l+'-'+r,codex);el.textContent='尚未留下这份回响'}
 for(const [r,target] of Object.entries(TARGETS)){const p=add('sl-echo-'+r,scenes[target],'div',{hidden:''});add('sl-echo-'+r+'-title',p,'h3');for(const l of LETTERS){const e=add('sl-echo-'+r+'-'+l,p,'p',{hidden:''});e.textContent='FIXED '+l+':'+r}}
 add('unaddressed-spring-letter-link',doc,'a',{hidden:''});
 for(const id of ['return-1-btn','return-2-btn','return-3-btn','receipt-btn','return-room-entry-tubes','return-room-entry-cabinet','return-room-entry-receipt','old-extra-action'])add(id,post,'button');
 add('old-child',ids.get('receipt-btn'),'span');add('old-exit',post,'a',{href:'#corridor'});
 add('old-exit-button',post,'button',{'data-go':'switchboard',class:'exit-link'});
 return {doc,ids,el:id=>ids.get(id),scenes};
}

function harness({state=base(),raw,scene=ROOM,qualified=true,busy=false,transition=false,available=LETTERS,reduced=false}={}){
 const dom=makeDOM(),h={...dom,raw:raw===undefined?JSON.stringify(state):raw,scene,qualified,busy,transition,available:[...available],reduced,writes:[],timers:new Map(),schedules:[],clears:[],focus:[],navigation:[],oldCalls:[],unavailable:new Set(),removed:0};
 const config={document:h.doc,rules,readRaw:()=>h.raw,writeRaw:v=>{assert.equal(typeof v,'string','writeRaw expects JSON string');h.raw=v;h.writes.push(JSON.parse(v))},removeOwn:()=>{h.raw=null;h.removed++},currentScene:()=>h.scene,unlocked:()=>h.qualified,upstreamBusy:()=>h.busy,availableLetters:()=>[...h.available],transitionBusy:()=>h.transition,reduced:h.reduced,
 buttonAvailable:id=>{const e=h.el(id);return !!e&&!e.disabled&&!e.hidden&&!e.closest('[hidden]')&&!h.unavailable.has(id)},
 hasAdvance:source=>{assert.equal(typeof source,'string','hasAdvance requires source');return h.timers.has(source)},
 schedule:(source,target,delay,onFire)=>{const timer={source,target,delay,onFire,owner:'chapter'};h.timers.set(source,timer);h.schedules.push(timer)},
 clearAdvance:source=>{assert.equal(typeof source,'string','clearAdvance requires source');h.clears.push(source);h.timers.delete(source)},
 navigate:target=>h.navigation.push(target),setArrivalFocus:el=>{assert.ok(el&&typeof el==='object'&&el.id,'focus requires DOM element');h.focus.push(el.id)}};
 for(const e of h.scenes.deadletter.querySelectorAll('button:not([id^="sl-"])'))e.addEventListener('click',()=>h.oldCalls.push(e.id));
 h.api=factory.create(config);
 h.state=()=>j(h.api.getState());
 h.click=(id,{trusted=true,key,type='click'}={})=>{
  const target=h.el(id),e={target,type,key,isTrusted:trusted,currentTarget:null,stop:false,immediate:false,defaultPrevented:false,preventDefault(){this.defaultPrevented=true},stopPropagation(){this.stop=true},stopImmediatePropagation(){this.stop=true;this.immediate=true}};
  const path=[];for(let n=target;n;n=n.parentElement)path.push(n);
  for(const capture of [true,false])for(const n of capture?[...path].reverse():path){for(const l of n.listeners.get(type)||[])if(l.capture===capture){e.currentTarget=n;l.handler.call(n,e);if(e.immediate)break}if(e.stop)return e}
  return e;
 };
 h.arrive=(name,{veil=true}={})=>{if(h.scene!==name)h.timers.clear();h.scene=name;h.transition=veil;h.api.onScene(name);h.api.focusArrival(name);h.transition=false};
 h.fire=source=>{const t=h.timers.get(source);ok(t,'timer exists');h.timers.delete(source);t.onFire?.();h.arrive(t.target)};
 h.external=source=>h.timers.set(source,{source,owner:'old'});
 h.api.sync();return h;
}

test('frozen exact public contract',()=>{ok(Object.isFrozen(factory),'namespace');const h=harness();ok(Object.isFrozen(h.api),'instance');eq(Object.keys(h.api).sort(),['getState','unlocked','canVisit','onScene','sync','focusArrival','forget','progressStep'].sort(),'API')});
test('read raw JSON and sync are read-only',()=>{const s=active(),h=harness({state:s});eq(h.state(),s,'canonical read');h.api.sync();h.api.sync();eq(h.writes,[],'read-only');const c=h.api.getState();c.draft.path.push(1);eq(h.state(),s,'detached output')});
test('new empty state not written',()=>{const h=harness({raw:null});eq(h.state(),base(),'empty');eq(h.writes,[],'no implicit creation')});
test('enter, single source timer, double click, actual arrival',()=>{const h=harness({scene:'deadletter'});h.click('sl-enter');eq(h.state().pending,enter(),'enter persisted');h.click('sl-enter');eq(h.schedules.length,1,'one timer');eq(h.schedules[0].delay,650,'normal delay');h.fire('deadletter');ok(h.state().visited,'visited');eq(h.state().draft,null,'empty table');eq(h.focus,['sl-title'],'one title');h.api.focusArrival(ROOM);eq(h.focus.length,1,'focus consumed')});
test('reduced boolean delay',()=>{const h=harness({scene:'deadletter',reduced:true});h.click('sl-enter');eq(h.schedules[0].delay,80,'reduced bool')});
for(const letter of LETTERS)for(const recipient of Object.keys(TARGETS))test('real module path '+letter+'/'+recipient,()=>{
 const h=harness({state:{...base(),visited:true},available:[letter]});h.click('sl-take-'+letter);
 eq(h.state().draft,active(letter).draft,'captured start');eq(h.el('sl-undo').disabled,true,'initial undo disabled');
 const raw=h.raw;h.click('sl-hint');eq(h.raw,raw,'hint read-only');
 for(const n of PATHS[letter].slice(1)){h.click('sl-node-'+n);ok(!h.el('sl-undo').disabled,'undo reenabled')}
 ok(!h.el('sl-seal').disabled,'seal reenabled when solved');h.click('sl-seal');ok(h.state().draft.sealed,'sealed');
 h.click('sl-unseal');ok(!h.state().draft.sealed,'reopen');h.click('sl-seal');
 h.click('sl-send-'+recipient);eq(h.state().letterCount,0,'not before arrival');eq(h.state().pending,delivery(letter,recipient),'target captured');
 h.click('sl-send-'+recipient);eq(h.schedules.length,1,'double send inert');h.fire(ROOM);
 eq(h.state().letterCount,1,'arrival count');eq(h.state().outcomes,[letter+':'+recipient],'outcome');eq(h.state().draft,null,'consumed');eq(h.state().pending,null,'pending consumed');
 eq(h.focus,['sl-echo-'+recipient+'-title'],'actual arrival focus');ok(!h.el('sl-echo-'+recipient).hidden,'echo');
 const committed=h.raw;h.api.onScene(TARGETS[recipient]);h.api.focusArrival(TARGETS[recipient]);eq(h.raw,committed,'repeated arrival no write');eq(h.focus.length,1,'historical visit no focus');
 h.arrive('remembrance');ok(!h.el('sl-codex').hidden,'codex visible');ok(h.el('sl-codex-'+letter+'-'+recipient).textContent!=='尚未留下这份回响','codex text updated');ok(h.api.progressStep().done,'one finishes chapter');
});
test('dead end hint and undo do not change captured source',()=>{const h=harness({state:active()});for(const n of [1,5,6,2,3,7,11,10])h.click('sl-node-'+n);const raw=h.raw;h.click('sl-hint');eq(h.raw,raw,'hint readonly');ok(/撤回/.test(h.el('sl-feedback').textContent),'recoverable explanation');h.click('sl-undo');eq(h.state().draft.path.length,8,'undo works');h.click('sl-reset');eq(h.state().draft,active().draft,'reset captured');});
test('source reload restores lock and replay only on actual scene hook',()=>{const s={...base(),pending:enter()},h=harness({state:s,scene:'deadletter'});eq(h.writes,[],'bootstrap readonly');eq(h.schedules,[],'no bootstrap replay');ok(h.el('receipt-btn').inert,'source lock');h.arrive('deadletter');eq(h.schedules.length,1,'source replay during veil');h.fire('deadletter');ok(h.state().visited,'replay enters')});
test('delivery reload and target refresh consume once',()=>{const s={...active('chair',true),pending:delivery('chair','unsent')},h=harness({state:s});h.arrive(ROOM);h.fire(ROOM);const h2=harness({raw:h.raw,scene:'remembrance'});h2.arrive('remembrance');eq(h2.state().letterCount,1,'count once');eq(h2.writes,[],'target read-only');eq(h2.focus,[],'no historic focus')});
test('third route cancels pending and preserves sealed letter even busy',()=>{const s={...active('drawer',true),pending:delivery('drawer','stranger')},h=harness({state:s,busy:true});h.arrive('corridor');eq(h.state().pending,null,'cancel only pending');eq(h.state().draft,s.draft,'keep letter');eq(h.state().letterCount,0,'not delivered')});
test('fake name is not actual arrival',()=>{const s={...active('window',true),pending:delivery()},h=harness({state:s});const raw=h.raw;h.api.onScene('threshold');eq(h.raw,raw,'no fake commit')});
for(const flag of ['qualified','busy'])test('target arrival paused on '+flag,()=>{const s={...active('window',true),pending:delivery()},h=harness({state:s,[flag]:flag==='busy'});h.arrive('threshold');eq(h.state(),s,'preserve pending without commit')});
test('old first blocks new and retains timer',()=>{const h=harness({scene:'deadletter'});h.external('deadletter');const raw=h.raw;h.click('sl-enter');eq(h.raw,raw,'no enter raw');eq(h.timers.get('deadletter').owner,'old','timer preserved')});
test('new first locks every old button, allows normal link, restores exact attrs',()=>{const h=harness({scene:'deadletter'}),old=h.el('receipt-btn');old.setAttribute('inert','prior');old.setAttribute('aria-disabled','mixed');old.setAttribute('data-sl-locked','prior');const assignments=old.disabledAssignments;h.click('sl-enter');h.click('old-child');h.click('old-extra-action');eq(h.oldCalls,[],'old events suppressed');const ev=h.click('old-exit');eq(ev.defaultPrevented,false,'exit usable');h.api.sync();h.arrive('corridor');eq(old.getAttribute('inert'),'prior','inert restored');eq(old.getAttribute('aria-disabled'),'mixed','aria restored');eq(old.getAttribute('data-sl-locked'),'prior','marker restored');eq(old.disabledAssignments,assignments,'native disabled never assigned');h.click('old-extra-action');eq(h.oldCalls,['old-extra-action'],'old unlocked')});
test('same-source onScene keeps owned timer for forget',()=>{const h=harness({scene:'deadletter'});h.click('sl-enter');h.api.onScene('deadletter');eq(h.schedules.length,1,'no replace');h.api.forget();eq(h.clears,['deadletter'],'only own source clear');eq(h.raw,null,'own removed')});
test('actual old data-go exit remains usable while entering',()=>{const h=harness({scene:'deadletter'});h.click('sl-enter');ok(!h.el('old-exit-button').inert,'old navigation not inert');const ev=h.click('old-exit-button');eq(ev.defaultPrevented,false,'navigation not captured');eq(h.oldCalls,['old-exit-button'],'old exit reached');h.arrive('corridor');eq(h.state().pending,null,'exit cancels enter')});
test('forget cannot cancel other chapter timer',()=>{const h=harness({state:active()});h.external(ROOM);h.api.forget();eq(h.clears,[],'no other clear');eq(h.timers.get(ROOM).owner,'old','other timer intact')});
for(const kind of ['untrusted','unavailable','busy','transition','unqualified','wrong-scene','old-timer'])test('event gate '+kind,()=>{const h=harness({state:active()});if(kind==='unavailable')h.unavailable.add('sl-node-1');if(kind==='busy')h.busy=true;if(kind==='transition')h.transition=true;if(kind==='unqualified')h.qualified=false;if(kind==='wrong-scene')h.scene='corridor';if(kind==='old-timer')h.external(ROOM);const raw=h.raw;h.click('sl-node-1',{trusted:kind!=='untrusted'});eq(h.raw,raw,'invalid action no write')});
test('sealed nodes disabled, unseal re-enables',()=>{const h=harness({state:active('window',true)});for(let n=0;n<12;n++)ok(h.el('sl-node-'+n).disabled,'sealed node '+n);h.click('sl-unseal');for(let n=0;n<12;n++)ok(!h.el('sl-node-'+n).disabled,'open node '+n)});
test('source availability is captured per letter',()=>{const h=harness({state:{...base(),visited:true},available:['window']});const raw=h.raw;h.click('sl-take-drawer');eq(h.raw,raw,'locked source');h.click('sl-take-window');h.available=['chair'];h.api.sync();h.click('sl-node-1');eq(h.state().draft.letter,'window','same captured source')});
test('qualification hides history and link without erasing',()=>{const s={...base(),visited:true,outcomes:['window:tomorrow'],letterCount:1,lastLetter:{letter:'window',recipient:'tomorrow'}},h=harness({state:s,scene:'threshold',qualified:false});eq(h.state(),s,'history retained');ok(h.el('sl-echo-tomorrow').hidden,'echo gated');ok(h.el('unaddressed-spring-letter-link').hidden,'directory gated');eq(h.api.canVisit(),false,'deep link denied')});
test('count caps and repeats dedupe',()=>{const s={...active('window',true),outcomes:['window:tomorrow'],letterCount:9999,lastLetter:{letter:'window',recipient:'tomorrow'},pending:delivery()},h=harness({state:s});h.arrive('threshold');eq(h.state().letterCount,9999,'cap');eq(h.state().outcomes,['window:tomorrow'],'dedupe')});
test('malformed pending keeps valid draft/history',()=>{for(const pending of [{...delivery(),target:'offering'},{...delivery(),x:1},{kind:'enter',source:ROOM,target:ROOM}]){const s={...active('window',true),pending},h=harness({state:s});eq(h.state().pending,null,'pending rejected');eq(h.state().draft,s.draft,'valid draft retained');eq(h.writes,[],'normalization readonly')}});
test('bad draft cancels dependent pending',()=>{const s={...active('window',true),pending:delivery()};s.draft.path=[0,4];const h=harness({state:s});eq(h.state().draft,null,'bad route removed');eq(h.state().pending,null,'dependent delivery removed')});
test('base/history shapes invalid default only in memory',()=>{const cases=[{...base(),version:128},{...base(),extra:1},{...base(),lastLetter:{}},{...base(),letterCount:1},{...active(),visited:false},{...base(),outcomes:['bad']},{...base(),letterCount:-1},{...base(),letterCount:1.5}];for(const s of cases){const h=harness({state:s});eq(h.state(),base(),'reject bad base');eq(h.writes,[],'no default write')}});
test('canonical outcomes dedupe and sort',()=>{const s={...base(),visited:true,outcomes:['chair:unsent','window:tomorrow','chair:unsent'],letterCount:2,lastLetter:{letter:'chair',recipient:'unsent'}},h=harness({state:s});eq(h.state().outcomes,['window:tomorrow','chair:unsent'],'canonical outcomes')});

console.log(JSON.stringify({status:failures.length?'fail':'pass',cases:cases.length,assertions,failures,runtimeSha256:createHash('sha256').update(runtime).digest('hex'),limits:['DOM/event unit facade only, actual rules module; does not prove native browser input, layout, complete host integration or publication.']},null,2));
if(failures.length)process.exitCode=1;
