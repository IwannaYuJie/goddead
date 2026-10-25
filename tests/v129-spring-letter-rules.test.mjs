// Codex independent design oracle and acceptance tests; no production implementation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';

const file = new URL('../spring-letter-rules.js', import.meta.url);
const source = fs.readFileSync(file, 'utf8');
let assertions = 0;
let report;
const sandbox = {
  check(value, label) { assertions++; assert.ok(value, label); },
  same(actual, expected, label) {
    assertions++;
    assert.equal(JSON.stringify(actual), JSON.stringify(expected), label);
  },
  finish(value) { report = JSON.parse(JSON.stringify(value)); },
};

function independentAcceptance() {
  const api = GoddeadSpringLetterRules.create();
  check(Object.isFrozen(GoddeadSpringLetterRules), 'namespace frozen');
  check(Object.isFrozen(api), 'instance frozen');
  same(Object.keys(api).sort(), ['layout','createDraft','normalizeDraft','analyze','options','step','undo','reset','seal','hint'].sort(), 'exact API');
  const graphs = {
    window: {start:0,end:10,solutions:2,edges:[[0,1],[1,5],[2,3],[2,6],[3,7],[4,5],[4,8],[5,6],[5,9],[7,11],[8,9],[10,11]]},
    drawer: {start:3,end:8,solutions:4,edges:[[0,1],[0,4],[1,5],[2,3],[2,6],[4,5],[5,6],[5,9],[6,7],[6,10],[7,11],[8,9],[10,11]]},
    chair: {start:1,end:4,solutions:16,edges:[[0,1],[0,4],[1,2],[1,5],[2,3],[3,7],[4,5],[4,8],[5,6],[5,9],[6,10],[7,11],[8,9],[10,11]]},
  };
  const result = [];
  const pair = (a,b) => [Math.min(a,b), Math.max(a,b)].join(':');
  for (const [letter,g] of Object.entries(graphs)) {
    // Independent oracle enumerates trails as remaining edge pairs, not module masks/DFS helpers.
    const records = [];
    function walk(path, remaining) {
      const current = path[path.length-1];
      const next = remaining.filter(e => e.includes(current)).map(e => e.find(n=>n!==current)).sort((a,b)=>a-b);
      records.push({path, next, complete: remaining.length===0 && current===g.end});
      for (const node of next) walk([...path,node], remaining.filter(e=>pair(...e)!==pair(current,node)));
    }
    walk([g.start],g.edges);
    const solutions = records.filter(r=>r.complete).map(r=>r.path);
    same(solutions.length,g.solutions,letter+' independent complete route count');
    check(records.some(r=>!r.complete && !r.next.length),letter+' has recoverable dead end');
    const prefix = (full,part) => part.every((n,i)=>full[i]===n);
    function expectedHint(path) {
      if (solutions.some(s=>s.length===path.length && prefix(s,path))) return {next:null,undo:0};
      for (let keep=path.length;keep>0;keep--) {
        const part=path.slice(0,keep);
        const possible=solutions.filter(s=>prefix(s,part));
        if (possible.length) return {next:Math.min(...possible.map(s=>s[keep])),undo:path.length-keep};
      }
      throw new Error('oracle unexpectedly unsolvable');
    }
    same(api.layout(letter),{letter,rows:3,cols:4,start:g.start,end:g.end,edges:g.edges},letter+' graph matches design');
    const foreign=api.layout(letter);foreign.edges[0][0]=99;foreign.edges.push([9,9]);
    same(api.layout(letter).edges,g.edges,letter+' graph output isolated');
    same(api.createDraft(letter),{letter,path:[g.start],sealed:false},letter+' initial path');
    for (const rec of records) {
      const draft=Object.freeze({letter,path:Object.freeze([...rec.path]),sealed:false});
      const before=JSON.stringify(draft);
      const label=letter+':'+rec.path.join(',');
      same(api.normalizeDraft(draft),draft,label+' normalize');
      const usedEdges=rec.path.slice(1).map((n,i)=>g.edges.findIndex(e=>pair(...e)===pair(rec.path[i],n)));
      same(api.analyze(draft),{current:rec.path.at(-1),used:rec.path.length-1,total:g.edges.length,complete:rec.complete,stuck:!rec.complete&&!rec.next.length,available:rec.next,visitedEdges:usedEdges},label+' analysis');
      same(api.options(draft),rec.next,label+' options');
      for (let node=0;node<12;node++) {
        same(api.step(draft,node),rec.next.includes(node)?{letter,path:[...rec.path,node],sealed:false}:null,label+' move '+node);
      }
      same(api.undo(draft),{letter,path:rec.path.length>1?rec.path.slice(0,-1):rec.path,sealed:false},label+' undo');
      same(api.reset(draft),{letter,path:[g.start],sealed:false},label+' reset');
      same(api.hint(draft),expectedHint(rec.path),label+' minimum rewind hint');
      same(api.seal(draft,false),draft,label+' unsealed copy');
      same(api.seal(draft,true),rec.complete?{letter,path:rec.path,sealed:true}:null,label+' seal gate');
      same(JSON.stringify(draft),before,label+' all APIs preserve input');
      const mutable=api.normalizeDraft(draft);mutable.path[0]=99;
      same(api.normalizeDraft(draft).path,rec.path,label+' normalize output isolated');
      const optionCopy=api.options(draft);optionCopy.push(99);
      same(api.options(draft),rec.next,label+' options output isolated');
      if (rec.complete) {
        const sealed={letter,path:[...rec.path],sealed:true};
        same(api.normalizeDraft(sealed),sealed,label+' sealed accepted');
        same(api.options(sealed),[],label+' sealed no options');
        same(api.undo(sealed),sealed,label+' sealed undo inert');
        same(api.reset(sealed),sealed,label+' sealed reset inert');
        same(api.seal(sealed,false),draft,label+' open letter');
        same(api.hint(sealed),{next:null,undo:0},label+' sealed complete hint');
        for(let n=0;n<12;n++)same(api.step(sealed,n),null,label+' sealed step rejected '+n);
      }
    }
    result.push({letter,prefixes:records.length,solutions:solutions.length,deadEnds:records.filter(r=>!r.complete&&!r.next.length).length});
  }

  let getters=0,coercions=0;
  const valid=()=>({letter:'window',path:[0],sealed:false});
  const extra=valid();extra.extra=1;
  const sym=valid();sym[Symbol('x')]=1;
  const arrayExtra=valid();arrayExtra.path.extra=1;
  const arraySym=valid();arraySym.path[Symbol('x')]=1;
  const arrayAccessor=valid();Object.defineProperty(arrayAccessor.path,'0',{get(){getters++;return 0;}});
  const objectAccessor=valid();Object.defineProperty(objectAccessor,'path',{get(){getters++;return [0];}});
  const custom=Object.assign(Object.create({foo:1}),valid());
  const customArray=valid();Object.setPrototypeOf(customArray.path,{...Array.prototype});
  const nullArray=valid();Object.setPrototypeOf(nullArray.path,null);
  const inherited=Object.create(valid());
  const hiddenExtra=valid();Object.defineProperty(hiddenExtra,'extra',{value:1});
  const sparse=valid();sparse.path=Array(1);
  const evil={valueOf(){coercions++;return 0;},toString(){coercions++;return 'window';}};
  const invalid=[null,undefined,false,true,0,NaN,'',[],{},extra,sym,arrayExtra,arraySym,arrayAccessor,objectAccessor,custom,customArray,nullArray,inherited,hiddenExtra,sparse,
    {letter:'window',path:[],sealed:false},{letter:'window',path:[1],sealed:false},
    {letter:'window',path:[0,1,0],sealed:false},{letter:'window',path:[0,4],sealed:false},
    {letter:'window',path:[0,1],sealed:true},{letter:'window',path:[0],sealed:0},
    {letter:'window',path:[0,'1'],sealed:false},{letter:'window',path:[0,NaN],sealed:false},
    {letter:'window',path:[0,12],sealed:false},{letter:'window',path:[0,-1],sealed:false},
    {letter:'window',path:[0,1.5],sealed:false},{letter:'window',path:[0,evil],sealed:false},
    {letter:evil,path:[0],sealed:false},{letter:'__proto__',path:[0],sealed:false},
    {letter:'chair',path:[0],sealed:false},Object.assign(()=>{},valid())];
  for(const [i,bad] of invalid.entries()) {
    for(const name of ['normalizeDraft','analyze','options','undo','reset','hint'])same(api[name](bad),null,`invalid ${i} ${name}`);
    same(api.step(bad,1),null,`invalid ${i} step`);
    same(api.seal(bad,false),null,`invalid ${i} seal`);
  }
  for(const bad of [null,undefined,{},[],false,1,'WINDOW','__proto__',Symbol('x'),evil]) {
    same(api.layout(bad),null,'invalid graph');same(api.createDraft(bad),null,'invalid new draft');
  }
  for(const bad of [undefined,null,false,'1',-1,12,1.2,Infinity,NaN,evil,Symbol('x')])same(api.step(valid(),bad),null,'invalid node');
  for(const bad of [0,1,'true',null,undefined,{},evil])same(api.seal(valid(),bad),null,'invalid seal');
  const nullProto=Object.assign(Object.create(null),valid());
  same(api.normalizeDraft(nullProto),valid(),'null-prototype record accepted');
  const nonenum=valid();Object.defineProperty(nonenum,'letter',{value:'window',enumerable:false});
  same(api.normalizeDraft(nonenum),valid(),'non-enumerable ordinary own data accepted');
  same(getters,0,'no accessor execution');same(coercions,0,'no coercion execution');
  finish({graphs:result,rejectedDraftShapes:invalid.length,getters,coercions});
}

vm.runInNewContext(source+'\n('+independentAcceptance.toString()+')();',sandbox,{timeout:10000,filename:'v129-independent-rules-acceptance'});
console.log(JSON.stringify({status:'pass',assertions,moduleSha256:createHash('sha256').update(source).digest('hex'),...report,limits:['Pure rules only; does not prove production UI, storage, routing, accessibility or publication.']},null,2));
