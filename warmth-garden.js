/* warmth-garden.js — v128 "余温温室 / THE GARDEN OF REMAINING WARMTH" runtime */
'use strict';

(function () {
  if (typeof globalThis.GoddeadWarmthGarden !== 'undefined') {
    return;
  }

  const STORAGE_KEY = 'goddead_v128_remaining_warmth';
  const VERSION = 128;

  const PLACEMENT_MAP = Object.freeze({
    window: 'threshold',
    drawer: 'offering',
    chair: 'unending-gallery'
  });

  const PLACEMENT_WHITELIST = Object.freeze(['window', 'drawer', 'chair']);

  const CASE_TEXTS = Object.freeze({
    A: {
      caseName: '灰保住了原来的形状',
      wish: '叶脉像未展开的信',
      note: '愿离开之后，还会有人替我把灯关上。'
    },
    B: {
      caseName: '余响沿根须回到土里',
      wish: '叶背留着一圈细小的钟纹',
      note: '愿最后一句话，能找到一双不用回答的耳朵。'
    },
    null: {
      caseName: '没有判词也能活下来',
      wish: '一株没有标签的白芽',
      note: '愿没有写下来的事，也能有一个春天。'
    }
  });

  const PLACEMENT_TITLES = Object.freeze({
    window: '有一阵风认出了你',
    drawer: '没有被回答，也没有被烧尽',
    chair: '缺席也有了需要浇水的东西'
  });

  const INTRO_TEXT = '炉火早就熄了。你拉开盛灰的抽屉，里面却有一小块地方还暖着。不是神的手。也许只是某个愿望，终于学会了不等回答。';
  const FULLWARM_TEXT = '根底已经暖了。它不需要你证明什么，只等你选个地方。';

  function createDefaultState() {
    return {
      version: VERSION,
      visited: false,
      outcomes: [],
      plantCount: 0,
      lastPlant: null,
      draft: null,
      pending: null
    };
  }

  function cloneOutcomeArray(arr) {
    return Array.isArray(arr) ? arr.slice() : [];
  }

  function cloneLastPlant(lp) {
    if (!lp || typeof lp !== 'object') return null;
    return {
      placement: lp.placement,
      capturedRuling: lp.capturedRuling
    };
  }

  function cloneDraft(d) {
    if (!d || typeof d !== 'object') return null;
    return {
      capturedRuling: d.capturedRuling,
      baseParity: d.baseParity,
      moves: Array.isArray(d.moves) ? d.moves.slice() : [],
      holding: Boolean(d.holding)
    };
  }

  function clonePending(p) {
    if (!p || typeof p !== 'object') return null;
    if (p.kind === 'enter') {
      return {
        kind: 'enter',
        source: 'offering',
        target: 'remaining-warmth-garden'
      };
    }
    if (p.kind === 'place') {
      return {
        kind: 'place',
        source: 'remaining-warmth-garden',
        target: p.target,
        placement: p.placement,
        capturedRuling: p.capturedRuling
      };
    }
    return null;
  }

  function cloneState(s) {
    return {
      version: VERSION,
      visited: Boolean(s.visited),
      outcomes: cloneOutcomeArray(s.outcomes),
      plantCount: s.plantCount,
      lastPlant: cloneLastPlant(s.lastPlant),
      draft: cloneDraft(s.draft),
      pending: clonePending(s.pending)
    };
  }

  function isPlainObject(val) {
    if (!val || typeof val !== 'object') return false;
    const proto = Object.getPrototypeOf(val);
    return proto === null || proto === Object.prototype;
  }

  function normalizeState(parsed, rules) {
    if (!isPlainObject(parsed)) {
      return createDefaultState();
    }

    const descriptors = Object.getOwnPropertyDescriptors(parsed);
    const keys = Reflect.ownKeys(descriptors);
    const expectedKeys = ['version', 'visited', 'outcomes', 'plantCount', 'lastPlant', 'draft', 'pending'];

    if (keys.length !== expectedKeys.length) {
      return createDefaultState();
    }
    for (let i = 0; i < expectedKeys.length; i++) {
      const k = expectedKeys[i];
      if (typeof k !== 'string') return createDefaultState();
      const desc = descriptors[k];
      if (!desc || 'get' in desc || 'set' in desc || !desc.enumerable) {
        return createDefaultState();
      }
    }

    if (descriptors.version.value !== VERSION) {
      return createDefaultState();
    }

    const visitedVal = descriptors.visited.value;
    if (typeof visitedVal !== 'boolean') {
      return createDefaultState();
    }
    const visited = visitedVal;

    // outcomes validation
    const outcomesVal = descriptors.outcomes.value;
    if (!Array.isArray(outcomesVal)) {
      return createDefaultState();
    }
    const outcomeSet = new Set();
    for (let i = 0; i < outcomesVal.length; i++) {
      const item = outcomesVal[i];
      if (typeof item !== 'string' || !PLACEMENT_WHITELIST.includes(item)) {
        return createDefaultState();
      }
      outcomeSet.add(item);
    }
    const normalizedOutcomes = [];
    for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
      if (outcomeSet.has(PLACEMENT_WHITELIST[i])) {
        normalizedOutcomes.push(PLACEMENT_WHITELIST[i]);
      }
    }

    // plantCount validation
    const pcVal = descriptors.plantCount.value;
    if (typeof pcVal !== 'number' || !Number.isInteger(pcVal) || pcVal < 0 || pcVal > 9999) {
      return createDefaultState();
    }
    const plantCount = pcVal;
    if (plantCount < normalizedOutcomes.length) {
      return createDefaultState();
    }

    // lastPlant validation
    const lpVal = descriptors.lastPlant.value;
    let lastPlant = null;
    if (plantCount === 0) {
      if (normalizedOutcomes.length !== 0 || lpVal !== null) {
        return createDefaultState();
      }
    } else {
      if (normalizedOutcomes.length === 0 || !isPlainObject(lpVal)) {
        return createDefaultState();
      }
      const lpDesc = Object.getOwnPropertyDescriptors(lpVal);
      const lpKeys = Reflect.ownKeys(lpDesc);
      if (lpKeys.length !== 2) {
        return createDefaultState();
      }
      if (!lpDesc.placement || !lpDesc.capturedRuling ||
          'get' in lpDesc.placement || 'get' in lpDesc.capturedRuling ||
          'set' in lpDesc.placement || 'set' in lpDesc.capturedRuling) {
        return createDefaultState();
      }
      const p = lpDesc.placement.value;
      const r = lpDesc.capturedRuling.value;
      if (!outcomeSet.has(p)) {
        return createDefaultState();
      }
      if (r !== 'A' && r !== 'B' && r !== null) {
        return createDefaultState();
      }
      lastPlant = { placement: p, capturedRuling: r };
    }

    // draft validation
    const draftVal = descriptors.draft.value;
    let draft = null;
    if (draftVal !== null) {
      try {
        draft = rules.normalizeDraft(draftVal);
      } catch {
        draft = null;
      }
    }

    // False visited cannot have history or draft
    if (!visited) {
      if (plantCount > 0 || normalizedOutcomes.length > 0 || lastPlant !== null || draft !== null) {
        return createDefaultState();
      }
    }

    // pending validation
    const pendingVal = descriptors.pending.value;
    let pending = null;
    if (pendingVal !== null && isPlainObject(pendingVal)) {
      const pDesc = Object.getOwnPropertyDescriptors(pendingVal);
      const pKeys = Reflect.ownKeys(pDesc);
      for (let i = 0; i < pKeys.length; i++) {
        const pk = pKeys[i];
        if (typeof pk !== 'string') {
          pKeys.length = 0;
          break;
        }
        const d = pDesc[pk];
        if (!d || 'get' in d || 'set' in d) {
          pKeys.length = 0;
          break;
        }
      }

      if (pDesc.kind) {
        const kind = pDesc.kind.value;
        if (kind === 'enter') {
          if (pKeys.length === 3 &&
              pDesc.source && pDesc.source.value === 'offering' &&
              pDesc.target && pDesc.target.value === 'remaining-warmth-garden') {
            pending = { kind: 'enter', source: 'offering', target: 'remaining-warmth-garden' };
          }
        } else if (kind === 'place') {
          if (pKeys.length === 5 &&
              pDesc.source && pDesc.source.value === 'remaining-warmth-garden' &&
              pDesc.target && pDesc.placement && pDesc.capturedRuling) {
            const placement = pDesc.placement.value;
            const target = pDesc.target.value;
            const capturedRuling = pDesc.capturedRuling.value;
            if (PLACEMENT_WHITELIST.includes(placement) &&
                PLACEMENT_MAP[placement] === target &&
                visited && draft !== null && Boolean(draft.holding) &&
                rules.boardOf(draft) === 511 &&
                capturedRuling === draft.capturedRuling) {
              pending = {
                kind: 'place',
                source: 'remaining-warmth-garden',
                target: target,
                placement: placement,
                capturedRuling: capturedRuling
              };
            }
          }
        }
      }
    }

    return {
      version: VERSION,
      visited: visited,
      outcomes: normalizedOutcomes,
      plantCount: plantCount,
      lastPlant: lastPlant,
      draft: draft,
      pending: pending
    };
  }

  function create(config) {
    const doc = config.document;
    const rules = config.rules;

    let arrivalFocusToken = null;
    let activeHintIndex = null;
    let hoveredIndex = null;
    let focusedIndex = null;

    let offeringLockApplied = false;
    let oldLockPriorStates = null;
    let ownedTimerSource = null;

    function parseCurrentState() {
      const raw = config.readRaw();
      if (typeof raw !== 'string') {
        return createDefaultState();
      }
      try {
        const parsed = JSON.parse(raw);
        return normalizeState(parsed, rules);
      } catch {
        return createDefaultState();
      }
    }

    function writeState(st) {
      const clean = normalizeState(st, rules);
      try {
        config.writeRaw(JSON.stringify(clean));
      } catch {
        // swallow storage errors
      }
      return clean;
    }

    function isGardenQualified() {
      try {
        return Boolean(config.unlocked());
      } catch {
        return false;
      }
    }

    function isUpstreamBusy() {
      try {
        return Boolean(config.upstreamBusy());
      } catch {
        return false;
      }
    }

    function isTransitionBusy() {
      try {
        return Boolean(config.transitionBusy());
      } catch {
        return false;
      }
    }

    const OLD_CONTROL_IDS = Object.freeze([
      'prayer-offer',
      'prayer-input',
      'ruling-offering-btn-a',
      'ruling-offering-btn-b',
      'continue-offering-btn'
    ]);

    function applyOfferingLock() {
      if (offeringLockApplied) return;
      oldLockPriorStates = new Map();
      for (let i = 0; i < OLD_CONTROL_IDS.length; i++) {
        const id = OLD_CONTROL_IDS[i];
        const el = doc.getElementById(id);
        if (el) {
          const priorInert = el.getAttribute('inert');
          const priorAriaDisabled = el.getAttribute('aria-disabled');
          const priorDataRwLocked = el.getAttribute('data-rw-locked');

          let appliedInert = false;
          if (priorInert === null) {
            el.setAttribute('inert', '');
            appliedInert = true;
          }

          let appliedAria = false;
          if (priorAriaDisabled !== 'true') {
            el.setAttribute('aria-disabled', 'true');
            appliedAria = true;
          }

          let appliedData = false;
          if (priorDataRwLocked !== 'true') {
            el.setAttribute('data-rw-locked', 'true');
            appliedData = true;
          }

          oldLockPriorStates.set(id, {
            inert: priorInert,
            appliedInert: appliedInert,
            ariaDisabled: priorAriaDisabled,
            appliedAria: appliedAria,
            dataRwLocked: priorDataRwLocked,
            appliedData: appliedData
          });
        }
      }
      offeringLockApplied = true;
    }

    function releaseOfferingLock() {
      if (!offeringLockApplied) return;
      for (let i = 0; i < OLD_CONTROL_IDS.length; i++) {
        const id = OLD_CONTROL_IDS[i];
        const el = doc.getElementById(id);
        if (el && oldLockPriorStates && oldLockPriorStates.has(id)) {
          const prior = oldLockPriorStates.get(id);

          if (prior.appliedData) {
            if (el.getAttribute('data-rw-locked') === 'true') {
              if (prior.dataRwLocked !== null) {
                el.setAttribute('data-rw-locked', prior.dataRwLocked);
              } else {
                el.removeAttribute('data-rw-locked');
              }
            }
          }

          if (prior.appliedAria) {
            if (el.getAttribute('aria-disabled') === 'true') {
              if (prior.ariaDisabled !== null) {
                el.setAttribute('aria-disabled', prior.ariaDisabled);
              } else {
                el.removeAttribute('aria-disabled');
              }
            }
          }

          if (prior.appliedInert) {
            if (el.getAttribute('inert') === '') {
              if (prior.inert !== null) {
                el.setAttribute('inert', prior.inert);
              } else {
                el.removeAttribute('inert');
              }
            }
          }
        }
      }
      oldLockPriorStates = null;
      offeringLockApplied = false;
    }

    function syncOfferingFirstLock(st) {
      const cur = config.currentScene();
      const needsLock = (cur === 'offering' &&
                         st.pending !== null &&
                         st.pending.kind === 'enter' &&
                         st.pending.source === 'offering');
      if (needsLock) {
        applyOfferingLock();
      } else {
        releaseOfferingLock();
      }
    }

    function isOfferingLockActive() {
      const cur = config.currentScene();
      if (cur !== 'offering') return false;
      const st = parseCurrentState();
      return (st.pending !== null && st.pending.kind === 'enter' && st.pending.source === 'offering');
    }

    doc.addEventListener('click', function (e) {
      if (!isOfferingLockActive()) return;
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      for (let i = 0; i < OLD_CONTROL_IDS.length; i++) {
        const id = OLD_CONTROL_IDS[i];
        if (id === 'prayer-input') continue;
        if (target.id === id || target.closest('#' + id)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
      }
    }, true);

    doc.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (!isOfferingLockActive()) return;
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      if (target.id === 'prayer-input' || target.closest('#prayer-input')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);

    function isElementInert(el) {
      if (!el) return true;
      if (el.closest('[inert]')) return true;
      if (el.closest('.is-disabled')) return true;
      const menu = el.closest('#directory, #menu, .drawer, .modal');
      if (menu && (menu.getAttribute('aria-hidden') === 'true' || menu.hasAttribute('hidden'))) {
        return true;
      }
      return false;
    }

    function scheduleChapterAdvance(source, target) {
      const delay = config.reduced ? 300 : 1200;
      ownedTimerSource = source;
      config.schedule(source, target, delay, function () {
        if (ownedTimerSource === source) {
          ownedTimerSource = null;
        }
      });
    }

    function checkActionReady(e, expectedScene, btnId, allowPending) {
      if (!e || !e.isTrusted) return false;
      if (config.currentScene() !== expectedScene) return false;
      if (!isGardenQualified()) return false;
      if (isUpstreamBusy()) return false;
      if (isTransitionBusy()) return false;
      if (config.hasAdvance(expectedScene)) return false;
      if (btnId && !config.buttonAvailable(btnId)) return false;
      if (btnId) {
        const el = doc.getElementById(btnId);
        if (isElementInert(el)) return false;
      }
      const st = parseCurrentState();
      if (!allowPending && st.pending !== null) return false;
      return true;
    }

    function getEffectivePreviewIndex() {
      if (hoveredIndex !== null) return hoveredIndex;
      if (focusedIndex !== null) return focusedIndex;
      return null;
    }

    function setFeedback(text) {
      const fb = doc.getElementById('rw-feedback');
      if (fb) {
        fb.textContent = text;
      }
    }

    function renderDOM() {
      const qualified = isGardenQualified();
      const upBusy = isUpstreamBusy();
      const curScene = config.currentScene();
      const st = parseCurrentState();
      syncOfferingFirstLock(st);

      // Directory link
      const dirLink = doc.getElementById('remaining-warmth-garden-link');
      if (dirLink) {
        if (qualified && st.visited) {
          dirLink.removeAttribute('hidden');
        } else {
          dirLink.setAttribute('hidden', '');
        }
      }

      // Echo panels in 3 old scenes
      for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
        const p = PLACEMENT_WHITELIST[i];
        const echoPanel = doc.getElementById('rw-echo-' + p);
        if (echoPanel) {
          if (qualified && st.outcomes.includes(p)) {
            echoPanel.removeAttribute('hidden');
          } else {
            echoPanel.setAttribute('hidden', '');
          }
        }
      }

      // Remembrance entry panel
      const entryPanel = doc.getElementById('rw-entry-panel');
      const entryBtn = doc.getElementById('rw-entry-btn');
      const resumeBtn = doc.getElementById('rw-resume-entry-btn');
      const entryResp = doc.getElementById('rw-entry-response');
      const isRemScene = (curScene === 'remembrance');

      if (entryPanel) {
        if (qualified) {
          entryPanel.removeAttribute('hidden');
          const entryNote = doc.getElementById('rw-entry-note');
          if (entryNote) {
            if (upBusy) {
              entryNote.textContent = '前置晨名事务仍在运转，请稍候。';
            } else {
              entryNote.textContent = st.visited
                ? (st.plantCount > 0 ? '余温温室已留有新芽。可重访温室。' : '余温温室已敞开。')
                : '炉火之下尚有一处余温，可前往炉台查看。';
            }
          }
          if (entryResp) {
            entryResp.textContent = '';
          }
          const hasDraftToResume = st.visited && st.draft !== null;
          const hasPendingToResume = st.pending !== null;
          if (hasDraftToResume || hasPendingToResume) {
            if (resumeBtn) {
              resumeBtn.removeAttribute('hidden');
            }
          } else {
            if (resumeBtn) {
              resumeBtn.setAttribute('hidden', '');
            }
          }
        } else {
          entryPanel.setAttribute('hidden', '');
          if (resumeBtn) {
            resumeBtn.setAttribute('hidden', '');
          }
        }
      }

      if (entryBtn) {
        const hasAdvRem = config.hasAdvance('remembrance');
        entryBtn.disabled = !qualified || !isRemScene || upBusy || (st.pending !== null) || hasAdvRem;
      }
      if (resumeBtn) {
        const hasDraftToResume = st.visited && st.draft !== null;
        const hasPendingToResume = st.pending !== null;
        const hasResumeTarget = hasDraftToResume || hasPendingToResume;
        const hasAdvRem = config.hasAdvance('remembrance');
        resumeBtn.disabled = !qualified || !isRemScene || !hasResumeTarget || upBusy || hasAdvRem;
      }

      // Remembrance codex section
      const codexSec = doc.getElementById('rw-codex');
      if (codexSec) {
        if (qualified && st.outcomes.length > 0) {
          codexSec.removeAttribute('hidden');
          const summaryEl = doc.getElementById('rw-codex-summary');
          if (summaryEl) {
            summaryEl.textContent = '温室记录已留存 ' + st.outcomes.length + ' 处陈设。选择一处即可完成本章，亦可探索全部三处。';
          }
          for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
            const p = PLACEMENT_WHITELIST[i];
            const pEl = doc.getElementById('rw-codex-' + p);
            if (pEl) {
              if (st.outcomes.includes(p)) {
                pEl.removeAttribute('hidden');
                pEl.textContent = PLACEMENT_TITLES[p];
              } else {
                pEl.removeAttribute('hidden');
                pEl.textContent = '尚未留下';
              }
            }
          }
        } else {
          codexSec.setAttribute('hidden', '');
        }
      }

      // Offering panel
      const offPanel = doc.getElementById('rw-offering-panel');
      const enterBtn = doc.getElementById('rw-enter-btn');
      const isOffScene = (curScene === 'offering');

      if (offPanel) {
        if (qualified) {
          offPanel.removeAttribute('hidden');
          const offStatus = doc.getElementById('rw-offering-status');
          if (offStatus) {
            if (st.pending && st.pending.kind === 'enter') {
              offStatus.textContent = '灰层下的余温已唤起，正待移步温室……';
            } else if (upBusy) {
              offStatus.textContent = '前置晨名事务仍在运转，请稍候。';
            } else {
              offStatus.textContent = '余烬未冷。抽屉夹层似乎留有微光。';
            }
          }
        } else {
          offPanel.setAttribute('hidden', '');
        }
      }

      if (enterBtn) {
        const hasAdvOff = config.hasAdvance('offering');
        enterBtn.disabled = !qualified || !isOffScene || upBusy || (st.pending !== null) || hasAdvOff;
      }

      // Offering response message
      const offResp = doc.getElementById('rw-offering-response');
      if (offResp) {
        if (st.pending && st.pending.kind === 'enter' && curScene === 'offering') {
          offResp.textContent = '抽屉下的微温被拢入掌心，正前往温室……';
        } else {
          offResp.textContent = '';
        }
      }

      // Waiting status indicator
      const waitingEl = doc.getElementById('rw-waiting');
      if (waitingEl) {
        if (qualified && upBusy) {
          waitingEl.removeAttribute('hidden');
          waitingEl.textContent = '前置事务仍在运转，请稍候。';
        } else {
          waitingEl.setAttribute('hidden', '');
          waitingEl.textContent = '';
        }
      }

      // Garden scene rendering
      const introEl = doc.getElementById('rw-intro');
      if (introEl) {
        introEl.textContent = INTRO_TEXT;
      }

      const emptySec = doc.getElementById('rw-empty');
      const workSec = doc.getElementById('rw-workbench');
      const placeSec = doc.getElementById('rw-placement');
      const newPotBtn = doc.getElementById('rw-new-pot-btn');
      const isGardenScene = (curScene === 'remaining-warmth-garden');
      const draft = st.draft;
      const hasAdvGarden = config.hasAdvance('remaining-warmth-garden');

      if (!draft) {
        if (emptySec) emptySec.removeAttribute('hidden');
        if (workSec) workSec.setAttribute('hidden', '');
        if (placeSec) placeSec.setAttribute('hidden', '');

        const prevEl = doc.getElementById('rw-preview');
        if (prevEl) prevEl.textContent = '';

        const lastPlantEl = doc.getElementById('rw-last-plant');
        if (lastPlantEl) {
          if (st.lastPlant) {
            const t = PLACEMENT_TITLES[st.lastPlant.placement] || '';
            const c = CASE_TEXTS[String(st.lastPlant.capturedRuling)] || CASE_TEXTS['null'];
            lastPlantEl.textContent = '上一次安放：' + t + ' (' + c.caseName + ')';
          } else {
            lastPlantEl.textContent = '抽屉空空如也，尚无新芽。';
          }
        }
        if (newPotBtn) {
          newPotBtn.disabled = !qualified || !isGardenScene || !st.visited || upBusy || (st.pending !== null) || hasAdvGarden;
        }

        // Disable all workbench buttons & placement buttons when no draft
        for (let i = 0; i < 9; i++) {
          const btn = doc.getElementById('rw-cell-' + i);
          if (btn) {
            btn.classList.remove('is-warm', 'is-preview', 'is-hint');
            btn.setAttribute('aria-pressed', 'false');
            btn.disabled = true;
            btn.setAttribute('aria-disabled', 'true');
          }
        }
        const hintBtn = doc.getElementById('rw-hint-btn');
        if (hintBtn) {
          hintBtn.disabled = true;
          hintBtn.setAttribute('aria-disabled', 'true');
        }
        const undoBtn = doc.getElementById('rw-undo-btn');
        if (undoBtn) {
          undoBtn.disabled = true;
          undoBtn.setAttribute('aria-disabled', 'true');
        }
        const resetBtn = doc.getElementById('rw-reset-btn');
        if (resetBtn) {
          resetBtn.disabled = true;
          resetBtn.setAttribute('aria-disabled', 'true');
        }
        const holdBtn = doc.getElementById('rw-hold-btn');
        if (holdBtn) {
          holdBtn.disabled = true;
          holdBtn.setAttribute('aria-disabled', 'true');
        }
        const lowerBtn = doc.getElementById('rw-lower-btn');
        if (lowerBtn) {
          lowerBtn.disabled = true;
          lowerBtn.setAttribute('aria-disabled', 'true');
        }
        for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
          const pBtn = doc.getElementById('rw-place-' + PLACEMENT_WHITELIST[i]);
          if (pBtn) {
            pBtn.disabled = true;
            pBtn.setAttribute('aria-disabled', 'true');
          }
        }
      } else {
        if (emptySec) emptySec.setAttribute('hidden', '');
        if (workSec) workSec.removeAttribute('hidden');
        if (newPotBtn) {
          newPotBtn.disabled = true;
        }

        const caseData = CASE_TEXTS[String(draft.capturedRuling)] || CASE_TEXTS['null'];
        const caseEl = doc.getElementById('rw-case');
        if (caseEl) caseEl.textContent = caseData.caseName;
        const wishEl = doc.getElementById('rw-wish');
        if (wishEl) wishEl.textContent = caseData.wish + ' — ' + caseData.note;

        const board = rules.boardOf(draft);
        const isFull = (board === 511);

        // Preview calculation
        const previewIdx = getEffectivePreviewIndex();
        let currentPreviewMask = 0;
        let previewText = '';
        if (previewIdx !== null && !draft.holding && st.pending === null) {
          const aff = rules.affected(previewIdx);
          for (let a = 0; a < aff.length; a++) {
            currentPreviewMask |= (1 << aff[a]);
          }
          const names = aff.map(function (idx) { return idx + 1; }).join('、');
          previewText = '预演影响格：' + names;
        }
        const prevEl = doc.getElementById('rw-preview');
        if (prevEl) {
          prevEl.textContent = previewText;
        }

        // Grid cells
        for (let i = 0; i < 9; i++) {
          const btn = doc.getElementById('rw-cell-' + i);
          if (btn) {
            const isWarm = (board & (1 << i)) !== 0;
            const isPreview = (currentPreviewMask & (1 << i)) !== 0;
            const isHint = (activeHintIndex === i);

            btn.classList.toggle('is-warm', isWarm);
            btn.classList.toggle('is-preview', isPreview);
            btn.classList.toggle('is-hint', isHint);

            btn.setAttribute('aria-pressed', isWarm ? 'true' : 'false');

            const aff = rules.affected(i);
            const affNames = aff.map(function (idx) { return (idx + 1); }).join('、');
            const row = Math.floor(i / 3) + 1;
            const col = (i % 3) + 1;
            btn.setAttribute('aria-label', '第' + row + '行第' + col + '位，' + (isWarm ? '暖' : '冷') + '，波及格：' + affNames);

            const numSpan = btn.querySelector('[data-rw-number]');
            if (numSpan) numSpan.textContent = String(i + 1);
            const stSpan = btn.querySelector('[data-rw-state]');
            if (stSpan) stSpan.textContent = isWarm ? '暖' : '冷';
            const mkSpan = btn.querySelector('[data-rw-mark]');
            if (mkSpan) mkSpan.textContent = isWarm ? '●' : '○';

            const cellDisabled = !qualified || !isGardenScene || upBusy || (st.pending !== null) || draft.holding || hasAdvGarden;
            btn.disabled = cellDisabled;
            if (cellDisabled) {
              btn.setAttribute('aria-disabled', 'true');
            } else {
              btn.removeAttribute('aria-disabled');
            }
          }
        }

        // Progress
        const progEl = doc.getElementById('rw-progress');
        if (progEl) {
          let warmCount = 0;
          for (let b = 0; b < 9; b++) {
            if ((board & (1 << b)) !== 0) warmCount++;
          }
          let progText = '温热格：' + warmCount + ' / 9';
          if (draft.moves.length > 0) {
            progText += '，最近步数：' + draft.moves.length;
          }
          if (draft.baseParity !== 0) {
            progText += '（较早的余温已记入灰床）';
          }
          progEl.textContent = progText;
        }

        // Action buttons
        const hintBtn = doc.getElementById('rw-hint-btn');
        const undoBtn = doc.getElementById('rw-undo-btn');
        const resetBtn = doc.getElementById('rw-reset-btn');
        const holdBtn = doc.getElementById('rw-hold-btn');
        const lowerBtn = doc.getElementById('rw-lower-btn');

        const baseActionDisabled = !qualified || !isGardenScene || upBusy || (st.pending !== null) || draft.holding || hasAdvGarden;

        if (hintBtn) {
          hintBtn.disabled = baseActionDisabled;
          if (baseActionDisabled) {
            hintBtn.setAttribute('aria-disabled', 'true');
          } else {
            hintBtn.removeAttribute('aria-disabled');
          }
        }
        if (undoBtn) {
          const undoDisabled = baseActionDisabled || (draft.moves.length === 0);
          undoBtn.disabled = undoDisabled;
          if (undoDisabled) {
            undoBtn.setAttribute('aria-disabled', 'true');
          } else {
            undoBtn.removeAttribute('aria-disabled');
          }
        }
        if (resetBtn) {
          resetBtn.disabled = baseActionDisabled;
          if (baseActionDisabled) {
            resetBtn.setAttribute('aria-disabled', 'true');
          } else {
            resetBtn.removeAttribute('aria-disabled');
          }
        }

        if (draft.holding) {
          if (holdBtn) {
            holdBtn.setAttribute('hidden', '');
            holdBtn.disabled = true;
          }
          if (lowerBtn) {
            lowerBtn.removeAttribute('hidden');
            const lowerDisabled = !qualified || !isGardenScene || upBusy || (st.pending !== null) || hasAdvGarden;
            lowerBtn.disabled = lowerDisabled;
            if (lowerDisabled) {
              lowerBtn.setAttribute('aria-disabled', 'true');
            } else {
              lowerBtn.removeAttribute('aria-disabled');
            }
          }
        } else {
          if (lowerBtn) {
            lowerBtn.setAttribute('hidden', '');
            lowerBtn.disabled = true;
          }
          if (holdBtn) {
            holdBtn.removeAttribute('hidden');
            const holdDisabled = !qualified || !isGardenScene || upBusy || (st.pending !== null) || !isFull || hasAdvGarden;
            holdBtn.disabled = holdDisabled;
            if (holdDisabled) {
              holdBtn.setAttribute('aria-disabled', 'true');
            } else {
              holdBtn.removeAttribute('aria-disabled');
            }
          }
        }

        // Placements
        if (placeSec) {
          if (draft.holding && isFull) {
            placeSec.removeAttribute('hidden');
            for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
              const p = PLACEMENT_WHITELIST[i];
              const pBtn = doc.getElementById('rw-place-' + p);
              if (pBtn) {
                const placeDisabled = !qualified || !isGardenScene || upBusy || (st.pending !== null) || hasAdvGarden;
                pBtn.disabled = placeDisabled;
                if (placeDisabled) {
                  pBtn.setAttribute('aria-disabled', 'true');
                } else {
                  pBtn.removeAttribute('aria-disabled');
                }
              }
            }
          } else {
            placeSec.setAttribute('hidden', '');
            for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
              const pBtn = doc.getElementById('rw-place-' + PLACEMENT_WHITELIST[i]);
              if (pBtn) {
                pBtn.disabled = true;
                pBtn.setAttribute('aria-disabled', 'true');
              }
            }
          }
        }
      }

      // Collected memories & collection note
      for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
        const p = PLACEMENT_WHITELIST[i];
        const el = doc.getElementById('rw-collected-' + p);
        if (el) {
          if (st.outcomes.includes(p)) {
            el.textContent = PLACEMENT_TITLES[p];
          } else {
            el.textContent = '尚未留下';
          }
        }
      }
      const colNote = doc.getElementById('rw-collection-note');
      if (colNote) {
        colNote.textContent = st.plantCount > 0
          ? '温室已有植株安放，其他陈设可随意留驻。'
          : '选择一处陈设安放植株即可完成本章，亦可探索全部三处。';
      }
    }

    // BIND EVENTS ONCE
    function bindEvents() {
      // Enter button on offering scene
      const enterBtn = doc.getElementById('rw-enter-btn');
      if (enterBtn) {
        enterBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'offering', 'rw-enter-btn', false)) return;

          const st = parseCurrentState();
          st.pending = {
            kind: 'enter',
            source: 'offering',
            target: 'remaining-warmth-garden'
          };
          writeState(st);
          renderDOM();

          const resp = doc.getElementById('rw-offering-response');
          if (resp) {
            resp.textContent = '抽屉下的微温被拢入掌心，正前往温室……';
          }
          scheduleChapterAdvance('offering', 'remaining-warmth-garden');
        });
      }

      // Entry navigation from remembrance
      const entryRemBtn = doc.getElementById('rw-entry-btn');
      if (entryRemBtn) {
        entryRemBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'remembrance', 'rw-entry-btn', false)) return;
          config.navigate('offering');
        });
      }

      // Resume navigation from remembrance
      const resumeRemBtn = doc.getElementById('rw-resume-entry-btn');
      if (resumeRemBtn) {
        resumeRemBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'remembrance', 'rw-resume-entry-btn', true)) return;

          const st = parseCurrentState();
          let targetScene = null;
          if (st.pending !== null) {
            targetScene = st.pending.source;
          } else if (st.visited && st.draft !== null) {
            targetScene = 'remaining-warmth-garden';
          }
          if (targetScene && targetScene !== config.currentScene()) {
            config.navigate(targetScene);
          }
        });
      }

      // New pot button in visited garden
      const newPotBtn = doc.getElementById('rw-new-pot-btn');
      if (newPotBtn) {
        newPotBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'remaining-warmth-garden', 'rw-new-pot-btn', false)) return;

          const st = parseCurrentState();
          if (!st.visited || st.draft !== null) return;

          const ruling = config.captureRuling();
          st.draft = rules.createDraft(ruling);
          writeState(st);
          activeHintIndex = null;
          hoveredIndex = null;
          focusedIndex = null;
          setFeedback('新取了一钵泥灰。试着将余温拨向各处。');
          renderDOM();
        });
      }

      // Grid cells click & preview
      for (let i = 0; i < 9; i++) {
        (function (cellIndex) {
          const btn = doc.getElementById('rw-cell-' + cellIndex);
          if (!btn) return;

          btn.addEventListener('pointerenter', function () {
            if (config.currentScene() !== 'remaining-warmth-garden') return;
            hoveredIndex = cellIndex;
            renderDOM();
          });

          btn.addEventListener('pointerleave', function () {
            hoveredIndex = null;
            renderDOM();
          });

          btn.addEventListener('focus', function () {
            if (config.currentScene() !== 'remaining-warmth-garden') return;
            focusedIndex = cellIndex;
            renderDOM();
          });

          btn.addEventListener('blur', function () {
            focusedIndex = null;
            renderDOM();
          });

          btn.addEventListener('click', function (e) {
            if (!checkActionReady(e, 'remaining-warmth-garden', 'rw-cell-' + cellIndex, false)) return;

            const st = parseCurrentState();
            if (!st.visited || st.draft === null || st.draft.holding) return;

            st.draft = rules.move(st.draft, cellIndex);
            writeState(st);
            activeHintIndex = null;

            const board = rules.boardOf(st.draft);
            const aff = rules.affected(cellIndex).map(function (x) { return x + 1; }).join('、');
            if (board === 511) {
              setFeedback('第 ' + (cellIndex + 1) + ' 格拨动（波及 ' + aff + '）。' + FULLWARM_TEXT);
            } else {
              setFeedback('第 ' + (cellIndex + 1) + ' 格拨动（波及 ' + aff + '）。');
            }
            renderDOM();
          });
        })(i);
      }

      // Hint button
      const hintBtn = doc.getElementById('rw-hint-btn');
      if (hintBtn) {
        hintBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'remaining-warmth-garden', 'rw-hint-btn', false)) return;

          const st = parseCurrentState();
          if (!st.visited || st.draft === null || st.draft.holding) return;

          const board = rules.boardOf(st.draft);
          const nextIndex = rules.hint(board);
          if (nextIndex === null) {
            activeHintIndex = null;
            setFeedback(FULLWARM_TEXT);
          } else {
            activeHintIndex = nextIndex;
            const r = Math.floor(nextIndex / 3) + 1;
            const c = (nextIndex % 3) + 1;
            setFeedback('可尝试拨动第 ' + (nextIndex + 1) + ' 格（第' + r + '行第' + c + '列）。');
          }
          renderDOM();
        });
      }

      // Undo button
      const undoBtn = doc.getElementById('rw-undo-btn');
      if (undoBtn) {
        undoBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'remaining-warmth-garden', 'rw-undo-btn', false)) return;

          const st = parseCurrentState();
          if (!st.visited || st.draft === null || st.draft.holding) return;
          if (st.draft.moves.length === 0) return;

          st.draft = rules.undo(st.draft);
          writeState(st);
          activeHintIndex = null;
          if (st.draft.moves.length === 0 && st.draft.baseParity !== 0) {
            setFeedback('已撤回至最初记录点。较早的余温已融于灰床。');
          } else {
            setFeedback('撤回了最近一步。');
          }
          renderDOM();
        });
      }

      // Reset button
      const resetBtn = doc.getElementById('rw-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'remaining-warmth-garden', 'rw-reset-btn', false)) return;

          const st = parseCurrentState();
          if (!st.visited || st.draft === null || st.draft.holding) return;

          st.draft = rules.reset(st.draft);
          writeState(st);
          activeHintIndex = null;
          setFeedback('重新铺平了灰床。');
          renderDOM();
        });
      }

      // Hold button
      const holdBtn = doc.getElementById('rw-hold-btn');
      if (holdBtn) {
        holdBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'remaining-warmth-garden', 'rw-hold-btn', false)) return;

          const st = parseCurrentState();
          if (!st.visited || st.draft === null || rules.boardOf(st.draft) !== 511) return;

          st.draft = rules.hold(st.draft, true);
          writeState(st);
          activeHintIndex = null;
          hoveredIndex = null;
          focusedIndex = null;
          setFeedback('盆泥已温，双手捧起。可选一处陈设安放。');
          renderDOM();
        });
      }

      // Lower button
      const lowerBtn = doc.getElementById('rw-lower-btn');
      if (lowerBtn) {
        lowerBtn.addEventListener('click', function (e) {
          if (!checkActionReady(e, 'remaining-warmth-garden', 'rw-lower-btn', false)) return;

          const st = parseCurrentState();
          if (!st.visited || st.draft === null || !st.draft.holding) return;

          st.draft = rules.hold(st.draft, false);
          writeState(st);
          setFeedback('轻轻放回工台。仍可调整或安放。');
          renderDOM();
        });
      }

      // 3 Placements
      for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
        (function (placement) {
          const btn = doc.getElementById('rw-place-' + placement);
          if (!btn) return;
          btn.addEventListener('click', function (e) {
            if (!checkActionReady(e, 'remaining-warmth-garden', 'rw-place-' + placement, false)) return;

            const st = parseCurrentState();
            if (!st.visited || st.draft === null) return;
            if (!st.draft.holding || rules.boardOf(st.draft) !== 511) return;

            const targetScene = PLACEMENT_MAP[placement];
            st.pending = {
              kind: 'place',
              source: 'remaining-warmth-garden',
              target: targetScene,
              placement: placement,
              capturedRuling: st.draft.capturedRuling
            };
            writeState(st);
            renderDOM();
            setFeedback('捧着新芽，走出门去……');
            scheduleChapterAdvance('remaining-warmth-garden', targetScene);
          });
        })(PLACEMENT_WHITELIST[i]);
      }
    }

    bindEvents();

    // NINE FROZEN EXPOSED METHODS
    function getState() {
      return cloneState(parseCurrentState());
    }

    function unlocked() {
      return isGardenQualified();
    }

    function canVisit() {
      if (!isGardenQualified()) return false;
      const st = parseCurrentState();
      return st.visited || (st.pending !== null && st.pending.kind === 'enter');
    }

    function bridgeAllows(target) {
      if (target !== 'unending-gallery') return false;
      if (!isGardenQualified()) return false;
      const st = parseCurrentState();
      const pendingPlaceChair = st.pending !== null &&
                                st.pending.kind === 'place' &&
                                st.pending.placement === 'chair';
      const committedChair = st.outcomes.includes('chair');
      return pendingPlaceChair || committedChair;
    }

    function onScene(name) {
      if (name !== config.currentScene()) {
        return;
      }

      const qualified = isGardenQualified();
      const upBusy = isUpstreamBusy();
      let st = parseCurrentState();

      if (st.pending !== null) {
        const p = st.pending;
        if (name === p.target) {
          // Target reached!
          if (qualified && !upBusy) {
            if (p.kind === 'enter') {
              st.visited = true;
              st.pending = null;
              writeState(st);
              if (ownedTimerSource === p.source) {
                ownedTimerSource = null;
              }
            } else if (p.kind === 'place') {
              const outcomeSet = new Set(st.outcomes);
              outcomeSet.add(p.placement);
              const nextOutcomes = [];
              for (let i = 0; i < PLACEMENT_WHITELIST.length; i++) {
                if (outcomeSet.has(PLACEMENT_WHITELIST[i])) {
                  nextOutcomes.push(PLACEMENT_WHITELIST[i]);
                }
              }
              st.outcomes = nextOutcomes;
              st.plantCount = Math.min(9999, st.plantCount + 1);
              st.lastPlant = {
                placement: p.placement,
                capturedRuling: p.capturedRuling
              };
              st.draft = null;
              st.pending = null;
              arrivalFocusToken = p.placement;
              writeState(st);
              setFeedback('');
              activeHintIndex = null;
              hoveredIndex = null;
              focusedIndex = null;
              if (ownedTimerSource === p.source) {
                ownedTimerSource = null;
              }
            }
          } else {
            // Target arrived but upstreamBusy or unqualified:
            // Host clears timers before sceneInit. We retain pending/draft but drop stale timer ownership.
            if (ownedTimerSource === p.source) {
              ownedTimerSource = null;
            }
          }
        } else if (name === p.source) {
          // Source re-entered or onScene called on source.
          if (qualified && !upBusy) {
            if (!config.hasAdvance(p.source)) {
              // Only schedule new advance if not already running.
              // Host goScene returns early on same-current-scene so owned timer is preserved.
              scheduleChapterAdvance(p.source, p.target);
            }
          }
        } else {
          // Third-scene arrival: cancels pending even if upstreamBusy, preserving draft/history.
          st.pending = null;
          writeState(st);
          ownedTimerSource = null;
          arrivalFocusToken = null;
          setFeedback('');
          activeHintIndex = null;
          hoveredIndex = null;
          focusedIndex = null;
        }
      } else {
        if (arrivalFocusToken !== null && name !== PLACEMENT_MAP[arrivalFocusToken]) {
          arrivalFocusToken = null;
        }
      }

      renderDOM();
    }

    function sync() {
      // Read-only on chapter storage; MUST NOT settle, cancel, replay or navigate
      renderDOM();
    }

    function focusArrival(name) {
      if (!arrivalFocusToken) return;
      const expectedTarget = PLACEMENT_MAP[arrivalFocusToken];
      if (name !== expectedTarget) {
        arrivalFocusToken = null;
        return;
      }
      if (name !== config.currentScene() || !isGardenQualified()) {
        return;
      }

      const token = arrivalFocusToken;
      arrivalFocusToken = null;
      const titleId = 'rw-echo-' + token + '-title';
      const titleEl = doc.getElementById(titleId);
      if (titleEl) {
        config.setArrivalFocus(titleEl);
      }
    }

    function forget() {
      try {
        config.removeOwn();
      } catch {
        // swallow
      }
      if (ownedTimerSource !== null) {
        config.clearAdvance(ownedTimerSource);
        ownedTimerSource = null;
      }
      arrivalFocusToken = null;
      activeHintIndex = null;
      hoveredIndex = null;
      focusedIndex = null;
      releaseOfferingLock();
      setFeedback('');
      const offResp = doc.getElementById('rw-offering-response');
      if (offResp) offResp.textContent = '';
      const entryResp = doc.getElementById('rw-entry-response');
      if (entryResp) entryResp.textContent = '';
      const prevEl = doc.getElementById('rw-preview');
      if (prevEl) prevEl.textContent = '';
      renderDOM();
    }

    function progressStep() {
      if (!isGardenQualified()) {
        return null;
      }

      if (isUpstreamBusy()) {
        return {
          title: '等待前置事务平息',
          items: ['晨名或旧章正在运转，请稍候'],
          target: 'mn-resume',
          done: false
        };
      }

      const st = parseCurrentState();

      if (st.pending !== null) {
        if (st.pending.kind === 'enter') {
          return {
            title: '前往温室',
            items: ['已从炉灰中引出余温，前往余温温室'],
            target: 'rw-resume',
            destination: 'remaining-warmth-garden',
            receiptId: '',
            done: false
          };
        }
        if (st.pending.kind === 'place') {
          return {
            title: '安放新芽',
            items: ['温室新芽已温热捧起，前往安放处'],
            target: 'rw-resume',
            destination: st.pending.target,
            receiptId: '',
            done: false
          };
        }
      }

      if (st.visited && st.draft !== null) {
        return {
          title: '料理温床',
          items: ['温室内泥灰尚有余热，继续照料新芽'],
          target: 'rw-resume',
          done: false
        };
      }

      if (st.plantCount > 0) {
        return {
          title: '余温温室',
          items: ['已留下一抹春意。可随时重访温室或探索其他陈设'],
          target: 'rw',
          done: true
        };
      }

      return {
        title: '寻访余温',
        items: ['炉火虽熄，盛灰的抽屉里尚有一缕暖意'],
        target: 'rw',
        done: false
      };
    }

    return Object.freeze({
      getState: getState,
      unlocked: unlocked,
      canVisit: canVisit,
      bridgeAllows: bridgeAllows,
      onScene: onScene,
      sync: sync,
      focusArrival: focusArrival,
      forget: forget,
      progressStep: progressStep
    });
  }

  globalThis.GoddeadWarmthGarden = Object.freeze({
    create: create
  });
})();
