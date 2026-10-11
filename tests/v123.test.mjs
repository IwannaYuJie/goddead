import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=readFileSync(new URL('../directory.js',import.meta.url),'utf8');
const main=readFileSync(new URL('../script.js',import.meta.url),'utf8');
const metadata=new Map([...html.matchAll(/<section\s+([^>]+)>(.*?)<\/section>/gs)].map(([,attrs,body])=>{const get=k=>new RegExp(k+'="([^"]*)"').exec(attrs)?.[1]??'';return [get('data-scene'),{title:get('data-title'),kicker:body.match(/<p class="sec-kicker">(.*?)<\/p>/s)?.[1]??''}];}));
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const menuHTML=html.slice(html.indexOf('<aside class="ritual-menu"'),html.indexOf('</aside>',html.indexOf('<aside class="ritual-menu"')));
const originals=[...menuHTML.matchAll(/<a\s+([^>]+)>(.*?)<\/a>/gs)].map(([,attrs,text])=>({attrs:Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]])),text:text.replace(/<[^>]*>/g,'').trim(),hidden:/\bhidden\b/.test(attrs)}));
assert.equal(originals.length,278);
assert.equal(new Set(originals.map(a=>a.attrs.href)).size,276,'two existing menu aliases remain');
let observed;
const sandbox={window:{},MutationObserver:class{constructor(fn){observed=fn;}observe(){}}};
vm.runInNewContext(source,sandbox); const api=sandbox.window.GoddeadDirectory;
assert.equal(api.normalize('  ＡＢＣ—１２ - Sky\nCloth  '),'abc—12 sky cloth');
for(const [text,query,want] of [['灵车场 jammed-yard','yard 灵车',true],['入口 ABC','ａｂｃ',true],['abc','[a]',false],['abc','a c',true],['abc','a z',false],['abc','.*',false],['abc','   ',true]])assert.equal(api.matches(text,query),want);
const mainHashes='threshold protocol corridor watch switchboard deadletter cancellation acting offering reliquary remembrance'.split(' ');
const unnumbered='dawn-weaving-mill day-night-loom sky-cloth-drying-terrace weatherless-bus-shelter season-dispatch-board four-season-platform shadowless-photo-studio double-exposure-camera unreceived-shadow-darkroom wake-for-another-hotel borrowed-dawn-clockroom shared-morning-veranda'.split(' ');
const boundaries=[[2,'annex'],[4,'aftermath'],[8,'facts'],[18,'handcraft'],[24,'dawn-first'],[31,'dawn-last'],[Infinity,'revisit']];
for(const a of originals){const target=a.attrs.href.slice(1),n=parseInt(a.text,10)||0;const expected=mainHashes.includes(target)?'main':unnumbered.includes(target)?'dawn-first':boundaries.find(([max])=>n<=max)[1];assert.equal(api.classify(target,a.text),expected,a.text);}
// Small DOM facade tests identity and lifecycle only. Native Chrome supplies layout/focus acceptance.
class Element {
 constructor(tag,doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.attrs={};this.listeners={};this.hidden=false;this.inert=false;this.disabled=false;this.open=false;this.value='';this.textContent='';this.className='';this.classList={contains:c=>this.className.split(' ').includes(c),toggle:(c,on)=>{const set=new Set(this.className.split(' ').filter(Boolean));on?set.add(c):set.delete(c);this.className=[...set].join(' ');}};}
 append(...nodes){for(const n of nodes){if(n.parent)n.parent.children.splice(n.parent.children.indexOf(n),1);n.parent=this;this.children.push(n);}}
 setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}fire(type,event={}){event.target??=this;event.preventDefault??=()=>{event.prevented=true;};for(const f of this.listeners[type]??[])f(event);return event;}
 descendants(){return this.children.flatMap(n=>[n,...n.descendants()]);}
 querySelector(s){return this.descendants().find(n=>n.id===s.slice(1))??null;}
 querySelectorAll(s){return this.descendants().filter(n=>s.startsWith('a[')?n.tagName==='A':['BUTTON','INPUT','SUMMARY','A'].includes(n.tagName));}
 closest(s){if(s==='details')return this.tagName==='DETAILS'?this:this.parent?.closest(s)??null;return this.tagName==='A'?this:this.parent?.closest(s)??null;}
 contains(n){return n===this||this.descendants().includes(n);}
 getClientRects(){for(let p=this;p;p=p.parent)if(p.hidden||p.inert||p.classList.contains('locked')||p.attrs['data-menu-filtered']==='true')return [];return [{}];} // Deliberately keeps boxes inside closed details, as Chromium can.
 focus(){if(this.getClientRects().length&&(!this.closest('details')||this.closest('details').open||this.tagName==='SUMMARY'))this.ownerDocument.activeElement=this;}
}
const doc={listeners:{},createElement:tag=>new Element(tag,doc),addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);},fire(event){event.preventDefault=()=>{event.prevented=true;};for(const fn of this.listeners.keydown??[])fn(event);return event;}};
const menu=doc.createElement('aside'),stage=doc.createElement('main'),trigger=doc.createElement('button'),scrim=doc.createElement('button');menu.inert=true;
const add=(id,tag='button')=>{const n=doc.createElement(tag);n.id=id;menu.append(n);return n;};
const close=add('menu-close'),search=add('menu-search','input'),clear=add('menu-search-clear'),count=add('menu-count','p'),empty=add('menu-empty','p'),expand=add('menu-expand-all'),fold=add('menu-fold-all'),root=add('menu-groups','nav');
const anchors=originals.map(o=>{const n=doc.createElement('a');Object.assign(n.attrs,o.attrs);n.id=o.attrs.id;n.textContent=o.text;n.hidden=o.hidden;n.className=o.attrs.class??'';root.append(n);return n;});
const gateSnapshot=()=>anchors.map(a=>[a.id,a.getAttribute('href'),a.hidden,a.className,a.getAttribute('aria-hidden')]);
const before=gateSnapshot(),routes=[];let current='threshold';
const ui=api.attach({menu,stage,trigger,close,scrim,currentScene:()=>current,sceneFor:t=>({getAttribute:()=>metadata.get(t)?.title,querySelector:()=>({textContent:metadata.get(t)?.kicker})}),navigate:t=>routes.push(t)});
assert.deepEqual(gateSnapshot(),before,'reparenting preserves original gate attributes');
assert.equal(root.descendants().filter(n=>n.tagName==='A').length,278);
assert.ok(anchors.every(a=>root.contains(a)),'same anchor objects retained');
const query=q=>{search.value=q;search.fire('input');};
const results=()=>anchors.filter(a=>a.getAttribute('data-menu-filtered')==='false');
// Three availability profiles, including locked-only and aria-hidden-only legacy gates.
for(let profile=0;profile<3;profile++){
 anchors.forEach((a,i)=>{a.hidden=profile===0?!mainHashes.slice(0,3).concat(['offering','remembrance']).includes(a.attrs.href.slice(1)):profile===1?i%4===0:false;a.className=profile===1&&i%4===1?'locked':'';a.setAttribute('aria-hidden',String(profile===1&&i%4===2));});
 for(const q of ['', '灵车','ｄａｗｎ','31','echo','yard 灵车','挪车','goddead','[x]','不存在的入口']){
  query(q);const terms=q.normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean);
  const expected=anchors.filter(a=>!a.hidden&&!a.classList.contains('locked')&&a.getAttribute('aria-hidden')!=='true'&&terms.every(t=>`${a.textContent} ${a.attrs.href.slice(1).replaceAll('-',' ')} ${metadata.get(a.attrs.href.slice(1))?.title??''} ${metadata.get(a.attrs.href.slice(1))?.kicker??''}`.toLowerCase().includes(t)));
  assert.deepEqual(results(),expected,`availability profile ${profile}, ${q}`);
 }
}
query('');ui.setOpen(true);assert.equal(doc.activeElement,close);assert.equal(stage.inert,true);assert.equal(menu.inert,false);
fold.fire('click');assert.ok(root.children.every(s=>!s.open));query('dawn');assert.ok(root.children.filter(s=>!s.hidden).every(s=>s.open));assert.equal(expand.disabled,true);query('');assert.ok(root.children.every(s=>!s.open),'clearing restores folds');
expand.fire('click');assert.ok(root.children.filter(s=>!s.hidden).every(s=>s.open));
query('jammed yard');assert.equal(results().length,1);doc.fire({key:'Enter',target:search,isComposing:true});assert.equal(routes.length,0);doc.fire({key:'Enter',target:search});assert.deepEqual(routes,['jammed-yard']);assert.equal(stage.inert,false);assert.equal(doc.activeElement,trigger);
ui.setOpen(true);query('不存在的入口');search.focus();doc.fire({key:'Enter',target:search});assert.equal(doc.activeElement,search);assert.equal(empty.hidden,false);
query('dawn');doc.fire({key:'Enter',target:search});assert.equal(doc.activeElement,results()[0]);
query('');fold.fire('click');const lastSummary=root.children.filter(s=>!s.hidden).at(-1).children[0];lastSummary.focus();assert.equal(doc.fire({key:'Tab',target:lastSummary}).prevented,true);assert.equal(doc.activeElement,close,'Tab skips links inside closed details');doc.fire({key:'Tab',shiftKey:true,target:close});assert.equal(doc.activeElement,lastSummary);
const gate=anchors.find(a=>a.attrs.href==='#jammed-yard');gate.hidden=true;observed([{target:gate}]);assert.equal(gate.getAttribute('data-menu-filtered'),'true');gate.hidden=false;observed([{target:gate}]);assert.equal(gate.getAttribute('data-menu-filtered'),'false');
current='jammed-yard';ui.refresh();assert.equal(gate.getAttribute('aria-current'),'page');
doc.fire({key:'Escape',target:search});assert.equal(menu.inert,true);assert.equal(stage.inert,false);assert.equal(doc.activeElement,trigger);stage.inert=true;ui.setOpen(true);scrim.fire('click');assert.equal(stage.inert,true,'preexisting stage inert restored');
assert.ok(html.indexOf('directory.js?v=123')<html.indexOf('script.js?v=123'));
assert.match(menuHTML,/role="dialog"[^>]*aria-modal="true"[^>]*inert/);
assert.match(main,/menu\.classList\.contains\("open"\).*contenteditable/);
assert.doesNotMatch(source,/localStorage|sessionStorage|store\.(set|get)|location\.hash\s*=/,'directory owns no storage or second router');
assert.doesNotMatch(css,/\.scene-branch\s*\{\s*overflow:\s*hidden/);
assert.doesNotMatch(css.slice(css.indexOf('/* ---------- 目录抽屉'),css.indexOf('/* ----------  toast')),/visibility:\s*hidden/,'opening must focus before slide animation completes');
// A scene-focus retry already queued before the drawer opens must also stop there.
{
 const start=main.indexOf('  const focusReliably = (el) => {'),end=main.indexOf('  /* 下一次 goScene',start);
 const queue=[],focusDocument={activeElement:null};let drawerOpen=false,tries=0,accept=false;
 const focusMenu={classList:{contains:()=>drawerOpen}},host={classList:{contains:()=>true}};
 const title={setAttribute(){},closest:()=>host,focus(){tries++;if(accept)focusDocument.activeElement=this;}};
 const focus=new Function('menu','document','setTimeout',main.slice(start,end)+'return focusReliably;')(focusMenu,focusDocument,fn=>queue.push(fn));
 drawerOpen=true;focus(title);assert.equal(tries,0);assert.equal(queue.length,0,'inert scene never queues a deferred focus steal');
 drawerOpen=false;focus(title);assert.equal(tries,1);assert.equal(queue.length,1);
 drawerOpen=true;queue.shift()();assert.equal(tries,1);assert.equal(queue.length,0,'a preexisting retry cancels while menu is open');
 drawerOpen=false;accept=true;focus(title);assert.equal(focusDocument.activeElement,title,'ordinary navigation still focuses its title');
}
console.log('v123 directory: 278 original anchors, three gate profiles, Unicode/AND search and modal lifecycle passed');
