/* Goddead v123: pure directory rules and a native, storage-free drawer. */
(() => {
  'use strict';
  const groups = [
    ['main', '主线房间'], ['annex', '门厅与副楼'], ['aftermath', '终局与旧事'],
    ['facts', '事实与责任'], ['handcraft', '见证与手作'], ['dawn-first', '清晨工坊 · 上'],
    ['dawn-last', '清晨工坊 · 下'], ['revisit', '清晨回访'],
  ];
  const main = new Set(['threshold','protocol','corridor','watch','switchboard','deadletter','cancellation','acting','offering','reliquary','remembrance']);
  const unnumbered = new Set(['dawn-weaving-mill','day-night-loom','sky-cloth-drying-terrace','weatherless-bus-shelter','season-dispatch-board','four-season-platform','shadowless-photo-studio','double-exposure-camera','unreceived-shadow-darkroom','wake-for-another-hotel','borrowed-dawn-clockroom','shared-morning-veranda']);
  const normalize = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[-\s]+/gu, ' ').trim();
  function classify(target, label) {
    if (main.has(target)) return 'main';
    if (unnumbered.has(target)) return 'dawn-first';
    const number = Number(/^\d+/.exec(label)?.[0] ?? 0);
    return number <= 2 ? 'annex' : number <= 4 ? 'aftermath' : number <= 8 ? 'facts'
      : number <= 18 ? 'handcraft' : number <= 24 ? 'dawn-first' : number <= 31 ? 'dawn-last' : 'revisit';
  }
  function matches(text, query) {
    const terms = normalize(query).split(' ').filter(Boolean), haystack = normalize(text);
    return terms.every(term => haystack.includes(term));
  }
  const available = link => !link.hidden && !link.classList.contains('locked') && link.getAttribute('aria-hidden') !== 'true';

  function attach({menu, trigger, close, stage, scrim, currentScene, sceneFor, navigate}) {
    const doc = menu.ownerDocument, root = menu.querySelector('#menu-groups');
    const search = menu.querySelector('#menu-search'), clear = menu.querySelector('#menu-search-clear');
    const count = menu.querySelector('#menu-count'), empty = menu.querySelector('#menu-empty');
    const expand = menu.querySelector('#menu-expand-all'), fold = menu.querySelector('#menu-fold-all');
    const records = Array.from(menu.querySelectorAll('a[href^="#"]')).map(link => {
      const target = link.getAttribute('href').slice(1), label = link.textContent.trim(), scene = sceneFor(target);
      return {link, target, group:classify(target,label), text:[label,target,scene?.getAttribute('data-title'),scene?.querySelector('.sec-kicker')?.textContent].filter(Boolean).join(' ')};
    });
    const links = new Set(records.map(record => record.link)), sections = new Map();
    for (const [id, title] of groups) {
      const details = doc.createElement('details'), summary = doc.createElement('summary');
      const label = doc.createElement('span'), tally = doc.createElement('span'), list = doc.createElement('div');
      details.id = `menu-group-${id}`; details.className = 'menu-group'; details.open = id === 'main';
      label.textContent = title; tally.className = 'menu-group-count'; list.className = 'menu-group-links';
      summary.append(label,tally); details.append(summary,list); root.append(details);
      sections.set(id,{details,tally,list});
    }
    records.forEach(record => sections.get(record.group).list.append(record.link));
    let open = false, oldStageInert = false, searchFolds = null, results = [];

    function refresh() {
      const querying = normalize(search.value) !== '';
      if (querying && !searchFolds) searchFolds = new Map(Array.from(sections,([id,s])=>[id,s.details.open]));
      if (!querying && searchFolds) {
        for (const [id,wasOpen] of searchFolds) sections.get(id).details.open = wasOpen;
        searchFolds = null;
      }
      const totals = new Map(groups.map(([id])=>[id,0])); let usable = 0;
      results = [];
      for (const record of records) {
        const allowed = available(record.link), match = allowed && matches(record.text,search.value);
        if (allowed) usable++;
        record.link.setAttribute('data-menu-filtered',String(!match));
        if (record.target === currentScene()) record.link.setAttribute('aria-current','page');
        else record.link.removeAttribute('aria-current');
        if (match) { results.push(record); totals.set(record.group,totals.get(record.group)+1); }
      }
      for (const [id,section] of sections) {
        const n = totals.get(id); section.details.hidden = n === 0; section.tally.textContent = String(n);
        if (querying && n) section.details.open = true;
      }
      count.textContent = `显示 ${results.length} / ${usable} 个入口`;
      empty.hidden = results.length !== 0;
      clear.hidden = search.value.length === 0;
      expand.disabled = fold.disabled = querying || !results.length;
    }

    function setOpen(next) {
      if (next === open) return;
      if (next) {
        search.value = ''; refresh();
        const current = records.find(record=>record.target===currentScene()&&available(record.link));
        if (current) sections.get(current.group).details.open = true;
        oldStageInert = stage.inert; stage.inert = true; menu.inert = false;
      } else {
        menu.inert = true; stage.inert = oldStageInert;
      }
      open = next; menu.classList.toggle('open',open); menu.setAttribute('aria-hidden',String(!open));
      trigger.setAttribute('aria-expanded',String(open)); scrim.hidden = !open;
      if (open) { root.scrollTop = 0; close.focus({preventScroll:true}); }
      else trigger.focus({preventScroll:true});
    }

    trigger.addEventListener('click',()=>setOpen(true));
    close.addEventListener('click',()=>setOpen(false)); scrim.addEventListener('click',()=>setOpen(false));
    search.addEventListener('input',refresh);
    clear.addEventListener('click',()=>{search.value='';refresh();search.focus();});
    expand.addEventListener('click',()=>{if(!expand.disabled)for(const s of sections.values())if(!s.details.hidden)s.details.open=true;});
    fold.addEventListener('click',()=>{if(!fold.disabled)for(const s of sections.values())s.details.open=false;});
    menu.addEventListener('click',event=>{
      const link = event.target.closest?.('a[href]');
      if (!links.has(link)) return;
      if (!available(link)||link.getAttribute('data-menu-filtered')==='true') {event.preventDefault();return;}
      setOpen(false);
    });
    doc.addEventListener('keydown',event=>{
      if (!open) return;
      if (event.key==='Escape') {event.preventDefault();setOpen(false);return;}
      if (event.key==='Enter'&&event.target===search&&!event.isComposing) {
        event.preventDefault();
        if (results.length===1) {const target=results[0].target;setOpen(false);navigate(target);}
        else if (results.length) results[0].link.focus();
        return;
      }
      if (event.key!=='Tab') return;
      // Chromium may retain a layout box inside a closed details; its links still cannot receive focus.
      const focusable=Array.from(menu.querySelectorAll('button,input,summary,a[href]')).filter(el=>{
        const section=el.closest('details');
        return !el.disabled&&el.getClientRects().length>0&&(!section||section.open||el.tagName==='SUMMARY');
      });
      const first=focusable[0],last=focusable.at(-1),focused=doc.activeElement;
      if (event.shiftKey&&(focused===first||!menu.contains(focused))) {event.preventDefault();last?.focus();}
      else if (!event.shiftKey&&(focused===last||!menu.contains(focused))) {event.preventDefault();first?.focus();}
    });
    const observer = new MutationObserver(changes=>{if(open&&changes.some(change=>links.has(change.target)))refresh();});
    observer.observe(menu,{subtree:true,attributes:true,attributeFilter:['hidden','class','aria-hidden']});
    refresh();
    return {refresh,setOpen};
  }
  window.GoddeadDirectory = Object.freeze({classify,matches,normalize,available,groups,attach});
})();
