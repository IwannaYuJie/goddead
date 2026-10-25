/**
 * spring-letter.js
 * GoddeadSpringLetter - v129 "没有地址的春信 / A Letter Without an Address"
 * Runtime controller and host integration.
 */
(function () {
  'use strict';

  if (Object.prototype.hasOwnProperty.call(globalThis, 'GoddeadSpringLetter')) {
    return;
  }

  var VALID_LETTERS = ['window', 'drawer', 'chair'];
  var VALID_RECIPIENTS = ['tomorrow', 'stranger', 'unsent'];
  var VALID_OUTCOMES = [
    'window:tomorrow', 'window:stranger', 'window:unsent',
    'drawer:tomorrow', 'drawer:stranger', 'drawer:unsent',
    'chair:tomorrow',  'chair:stranger',  'chair:unsent'
  ];

  var RECIPIENT_TARGETS = {
    tomorrow: 'threshold',
    stranger: 'deadletter',
    unsent: 'remembrance'
  };

  var LETTER_NAMES = {
    window: '风没有写门牌',
    drawer: '灰里留着一句话',
    chair: '空椅借出一个位置'
  };

  var LETTER_TEXTS = {
    window: '窗台的叶子替你截住了一封信。信封里没有邮票，只有一阵折好了的风。／「如果你还记得那盏灯，请把它留给下一位晚归的人。」',
    drawer: '那只抽屉终于肯打开了。纸的边缘烧缺了一角，缺口长出一条很细的绿线。／「没有说完的事，可以先放在这里。明天也算一种回答。」',
    chair: '椅脚边压着一封平平整整的信。它没有署名，却给收件人留了足够的空白。／「不必坐满每一把椅子。有人经过时，能歇一会儿就好。」'
  };

  var ECHO_TEXTS = {
    'tomorrow:window': '门缝下多了一道浅绿的折痕。明天开门时，你会知道有人替你把灯留着。',
    'tomorrow:drawer': '门外还没有脚步。你把那句没说完的话放在门槛上，给明天留了位置。',
    'tomorrow:chair': '门前摆着一把小椅子。它不催你出发，只让明天回来的人有地方歇脚。',
    'stranger:window': '投递所第一次把一封信放进了「可领取」的格子。经过的人能从纸里听到风。',
    'stranger:drawer': '灰纸被放进一格空柜。有人终于可以收下一个问题，而不必替它作答。',
    'stranger:chair': '格柜里腾出一个空位。信上只写着：如果你累了，这里还坐得下。',
    'unsent:window': '痕迹墙留住了那阵风。你可以等到想起某个人时，再给它一个方向。',
    'unsent:drawer': '那句未完的话安静地留在墙边。它没有被烧掉，也不必今天就成为答案。',
    'unsent:chair': '墙边多了一把画在纸上的椅子。暂时没人坐下，位置仍然算数。'
  };

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function isPlainObjectOrNullProto(val) {
    if (val === null || typeof val !== 'object') {
      return false;
    }
    var proto = Object.getPrototypeOf(val);
    return proto === null || proto === Object.prototype;
  }

  function isDenseOrdinaryArray(val) {
    if (!Array.isArray(val) || Object.getPrototypeOf(val) !== Array.prototype) {
      return false;
    }
    if (Object.getOwnPropertySymbols(val).length > 0) {
      return false;
    }
    var len = val.length;
    var keys = Object.getOwnPropertyNames(val);
    if (keys.length !== len + 1) {
      return false;
    }
    for (var i = 0; i < len; i += 1) {
      var desc = Object.getOwnPropertyDescriptor(val, String(i));
      if (!desc || desc.get || desc.set) {
        return false;
      }
    }
    var lenDesc = Object.getOwnPropertyDescriptor(val, 'length');
    if (!lenDesc || lenDesc.get || lenDesc.set) {
      return false;
    }
    return true;
  }

  function validateExactOwnProps(obj, expectedProps) {
    if (!isPlainObjectOrNullProto(obj)) {
      return false;
    }
    if (Object.getOwnPropertySymbols(obj).length > 0) {
      return false;
    }
    var names = Object.getOwnPropertyNames(obj);
    if (names.length !== expectedProps.length) {
      return false;
    }
    for (var i = 0; i < expectedProps.length; i += 1) {
      var prop = expectedProps[i];
      var desc = Object.getOwnPropertyDescriptor(obj, prop);
      if (!desc || desc.get || desc.set) {
        return false;
      }
    }
    return true;
  }

  function defaultState() {
    return {
      version: 129,
      visited: false,
      outcomes: [],
      letterCount: 0,
      lastLetter: null,
      draft: null,
      pending: null
    };
  }

  function validateLastLetter(raw) {
    if (raw === null) {
      return null;
    }
    if (!validateExactOwnProps(raw, ['letter', 'recipient'])) {
      return undefined;
    }
    var l = raw.letter;
    var r = raw.recipient;
    if (VALID_LETTERS.indexOf(l) === -1 || VALID_RECIPIENTS.indexOf(r) === -1) {
      return undefined;
    }
    return { letter: l, recipient: r };
  }

  function validatePending(raw) {
    if (raw === null) {
      return null;
    }
    if (!isPlainObjectOrNullProto(raw)) {
      return undefined;
    }
    var kindDesc = Object.getOwnPropertyDescriptor(raw, 'kind');
    if (!kindDesc || kindDesc.get || kindDesc.set || typeof raw.kind !== 'string') {
      return undefined;
    }
    var kind = raw.kind;
    if (kind === 'enter') {
      if (!validateExactOwnProps(raw, ['kind', 'source', 'target'])) {
        return undefined;
      }
      if (raw.source !== 'deadletter' || raw.target !== 'unaddressed-spring-letter') {
        return undefined;
      }
      return {
        kind: 'enter',
        source: 'deadletter',
        target: 'unaddressed-spring-letter'
      };
    }
    if (kind === 'deliver') {
      if (!validateExactOwnProps(raw, ['kind', 'source', 'target', 'letter', 'recipient'])) {
        return undefined;
      }
      var l = raw.letter;
      var r = raw.recipient;
      if (raw.source !== 'unaddressed-spring-letter') {
        return undefined;
      }
      if (VALID_LETTERS.indexOf(l) === -1 || VALID_RECIPIENTS.indexOf(r) === -1) {
        return undefined;
      }
      if (raw.target !== RECIPIENT_TARGETS[r]) {
        return undefined;
      }
      return {
        kind: 'deliver',
        source: 'unaddressed-spring-letter',
        target: raw.target,
        letter: l,
        recipient: r
      };
    }
    return undefined;
  }

  function sortOutcomes(arr) {
    var copy = [];
    for (var i = 0; i < VALID_OUTCOMES.length; i += 1) {
      var item = VALID_OUTCOMES[i];
      if (arr.indexOf(item) !== -1 && copy.indexOf(item) === -1) {
        copy.push(item);
      }
    }
    return copy;
  }

  function parseAndValidateState(raw, rules) {
    if (!validateExactOwnProps(raw, ['version', 'visited', 'outcomes', 'letterCount', 'lastLetter', 'draft', 'pending'])) {
      return null;
    }
    if (raw.version !== 129 || typeof raw.visited !== 'boolean') {
      return null;
    }

    if (!isDenseOrdinaryArray(raw.outcomes)) {
      return null;
    }
    var cleanOutcomes = [];
    for (var i = 0; i < raw.outcomes.length; i += 1) {
      var outId = raw.outcomes[i];
      if (typeof outId !== 'string' || VALID_OUTCOMES.indexOf(outId) === -1) {
        return null;
      }
      if (cleanOutcomes.indexOf(outId) === -1) {
        cleanOutcomes.push(outId);
      }
    }
    cleanOutcomes = sortOutcomes(cleanOutcomes);

    var count = raw.letterCount;
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 0 || count > 9999) {
      return null;
    }
    if (count < cleanOutcomes.length) {
      return null;
    }

    if (count === 0 && raw.lastLetter !== null) {
      return null;
    }
    var last = validateLastLetter(raw.lastLetter);
    if (last === undefined) {
      return null;
    }
    if (count === 0) {
      if (cleanOutcomes.length !== 0 || last !== null) {
        return null;
      }
    } else {
      if (last === null) {
        return null;
      }
      var targetOutcome = last.letter + ':' + last.recipient;
      if (cleanOutcomes.indexOf(targetOutcome) === -1) {
        return null;
      }
    }

    var validDraft = null;
    if (raw.draft !== null) {
      validDraft = rules.normalizeDraft(raw.draft);
      if (validDraft === null) {
        // malformed draft discarded
      }
    }

    var validPending = validatePending(raw.pending);
    if (validPending === undefined) {
      validPending = null;
    }

    if (raw.visited === false) {
      if (cleanOutcomes.length > 0 || count > 0 || last !== null || raw.draft !== null) {
        return null;
      }
      if (validPending !== null && validPending.kind !== 'enter') {
        return null;
      }
    }

    if (validPending && validPending.kind === 'deliver') {
      if (!raw.visited || !validDraft || !validDraft.sealed || validDraft.letter !== validPending.letter) {
        validPending = null;
      } else {
        var info = rules.analyze(validDraft);
        if (!info || !info.complete) {
          validPending = null;
        }
      }
    }

    return {
      version: 129,
      visited: raw.visited,
      outcomes: cleanOutcomes,
      letterCount: count,
      lastLetter: last,
      draft: validDraft,
      pending: validPending
    };
  }

  function deepCloneState(s) {
    if (!s) {
      return defaultState();
    }
    var outCopy = [];
    for (var i = 0; i < s.outcomes.length; i += 1) {
      outCopy.push(s.outcomes[i]);
    }
    var draftCopy = null;
    if (s.draft) {
      var pCopy = [];
      for (var p = 0; p < s.draft.path.length; p += 1) {
        pCopy.push(s.draft.path[p]);
      }
      draftCopy = {
        letter: s.draft.letter,
        path: pCopy,
        sealed: s.draft.sealed
      };
    }
    var lastCopy = null;
    if (s.lastLetter) {
      lastCopy = {
        letter: s.lastLetter.letter,
        recipient: s.lastLetter.recipient
      };
    }
    var pendingCopy = null;
    if (s.pending) {
      if (s.pending.kind === 'enter') {
        pendingCopy = {
          kind: 'enter',
          source: 'deadletter',
          target: 'unaddressed-spring-letter'
        };
      } else {
        pendingCopy = {
          kind: 'deliver',
          source: 'unaddressed-spring-letter',
          target: s.pending.target,
          letter: s.pending.letter,
          recipient: s.pending.recipient
        };
      }
    }
    return {
      version: 129,
      visited: s.visited,
      outcomes: outCopy,
      letterCount: s.letterCount,
      lastLetter: lastCopy,
      draft: draftCopy,
      pending: pendingCopy
    };
  }

  function create(config) {
    var doc = config.document;
    var rules = config.rules;
    var readRaw = config.readRaw;
    var writeRaw = config.writeRaw;
    var removeOwn = config.removeOwn;
    var currentScene = config.currentScene;
    var isUnlocked = config.unlocked;
    var isUpstreamBusy = config.upstreamBusy;
    var getAvailableLetters = config.availableLetters;
    var isButtonAvailable = config.buttonAvailable;
    var hasAdvance = config.hasAdvance;
    var schedule = config.schedule;
    var clearAdvance = config.clearAdvance;
    var navigate = config.navigate;
    var setArrivalFocus = config.setArrivalFocus;
    var isTransitionBusy = config.transitionBusy;

    var ownedTimerSource = null;
    var arrivalFocusToken = null;
    var localHint = null;
    var localFeedback = '';
    var deadletterLockedButtons = [];

    function delayMs() {
      return (config && config.reduced === true) ? 80 : 650;
    }

    function readStateInternal() {
      var rawString = null;
      try {
        rawString = readRaw();
      } catch (err) {
        return defaultState();
      }
      if (!rawString || typeof rawString !== 'string') {
        return defaultState();
      }
      var parsed;
      try {
        parsed = JSON.parse(rawString);
      } catch (err) {
        return defaultState();
      }
      var s = parseAndValidateState(parsed, rules);
      if (!s) {
        return defaultState();
      }
      return s;
    }

    function saveState(s) {
      var canonical = deepCloneState(s);
      writeRaw(JSON.stringify(canonical));
    }

    function isDeadletterCaptureActive() {
      var s = readStateInternal();
      return !!(s.pending && s.pending.kind === 'enter' && currentScene() === 'deadletter');
    }

    function captureDeadletterButtons(e) {
      if (!isDeadletterCaptureActive()) {
        return;
      }
      var target = e.target;
      while (target && target !== doc) {
        if (target.tagName === 'BUTTON' && (!target.id || target.id.indexOf('sl-') !== 0) && !target.hasAttribute('data-go')) {
          var insidePost = target.closest('#scene-deadletter');
          if (insidePost) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return;
          }
        }
        target = target.parentNode;
      }
    }

    doc.addEventListener('click', captureDeadletterButtons, true);
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        captureDeadletterButtons(e);
      }
    }, true);

    function lockDeadletterButtons() {
      if (deadletterLockedButtons.length > 0) {
        return;
      }
      var postScene = doc.getElementById('scene-deadletter');
      if (!postScene) {
        return;
      }
      var btns = postScene.querySelectorAll('button:not([id^="sl-"])');
      for (var i = 0; i < btns.length; i += 1) {
        var btn = btns[i];
        if (btn.hasAttribute('data-go')) {
          continue;
        }
        deadletterLockedButtons.push({
          el: btn,
          wasInert: btn.hasAttribute('inert'),
          inertVal: btn.getAttribute('inert'),
          prevAria: btn.getAttribute('aria-disabled'),
          prevLocked: btn.getAttribute('data-sl-locked')
        });
        btn.setAttribute('inert', '');
        btn.setAttribute('aria-disabled', 'true');
        btn.setAttribute('data-sl-locked', 'true');
      }
    }

    function unlockDeadletterButtons() {
      for (var i = 0; i < deadletterLockedButtons.length; i += 1) {
        var item = deadletterLockedButtons[i];
        if (item.el) {
          if (!item.wasInert) {
            item.el.removeAttribute('inert');
          } else if (item.inertVal !== null) {
            item.el.setAttribute('inert', item.inertVal);
          }
          if (item.prevAria === null) {
            item.el.removeAttribute('aria-disabled');
          } else {
            item.el.setAttribute('aria-disabled', item.prevAria);
          }
          if (item.prevLocked === null) {
            item.el.removeAttribute('data-sl-locked');
          } else {
            item.el.setAttribute('data-sl-locked', item.prevLocked);
          }
        }
      }
      deadletterLockedButtons = [];
    }

    function updateDeadletterLockState(s) {
      if (s.pending && s.pending.kind === 'enter' && currentScene() === 'deadletter') {
        lockDeadletterButtons();
      } else {
        unlockDeadletterButtons();
      }
    }

    function canVisit() {
      var s = readStateInternal();
      if (!isUnlocked()) {
        return false;
      }
      if (s.visited) {
        return true;
      }
      if (s.pending && s.pending.kind === 'enter') {
        return true;
      }
      return false;
    }

    function canAct(btnId, expectedScene, isResume) {
      if (currentScene() !== expectedScene) {
        return false;
      }
      if (!isUnlocked()) {
        return false;
      }
      if (isUpstreamBusy()) {
        return false;
      }
      if (isTransitionBusy && isTransitionBusy()) {
        return false;
      }
      if (hasAdvance && hasAdvance(expectedScene)) {
        return false;
      }
      var s = readStateInternal();
      if (!isResume && s.pending) {
        return false;
      }
      if (btnId && isButtonAvailable && !isButtonAvailable(btnId)) {
        return false;
      }
      return true;
    }

    function renderBoard(s, info) {
      var board = doc.getElementById('sl-board');
      if (!board) {
        return;
      }
      var edgesG = doc.getElementById('sl-edges');
      var draft = s.draft;
      var graph = rules.layout(draft.letter);

      if (edgesG) {
        while (edgesG.firstChild) {
          edgesG.removeChild(edgesG.firstChild);
        }
        var visitedEdges = (info && info.visitedEdges) ? info.visitedEdges : [];
        for (var e = 0; e < graph.edges.length; e += 1) {
          var edge = graph.edges[e];
          var u = edge[0];
          var v = edge[1];
          var uCol = u % 4;
          var uRow = Math.floor(u / 4);
          var vCol = v % 4;
          var vRow = Math.floor(v / 4);
          var x1 = 50 + 100 * uCol;
          var y1 = 50 + 100 * uRow;
          var x2 = 50 + 100 * vCol;
          var y2 = 50 + 100 * vRow;

          var line = doc.createElementNS(SVG_NS, 'line');
          line.setAttribute('x1', String(x1));
          line.setAttribute('y1', String(y1));
          line.setAttribute('x2', String(x2));
          line.setAttribute('y2', String(y2));
          var isUsed = visitedEdges.indexOf(e) !== -1;
          line.setAttribute('class', isUsed ? 'sl-line is-used' : 'sl-line');
          edgesG.appendChild(line);
        }
      }

      var avail = (info && info.available) ? info.available : [];
      var curr = (info && info.current !== undefined) ? info.current : draft.path[draft.path.length - 1];
      var isCur = (currentScene() === 'unaddressed-spring-letter');
      var isPending = !!s.pending;
      var sealed = !!draft.sealed;
      var busy = isUpstreamBusy();
      var hasTimer = !!(hasAdvance && hasAdvance('unaddressed-spring-letter'));
      var wrongSceneOrLocked = !isCur || isPending || sealed || busy || hasTimer;

      for (var n = 0; n < 12; n += 1) {
        var btn = doc.getElementById('sl-node-' + n);
        if (!btn) {
          continue;
        }
        var isCurrent = (n === curr);
        var isStart = (n === graph.start);
        var isEnd = (n === graph.end);
        var isAvail = avail.indexOf(n) !== -1;
        var isHint = localHint && (localHint.next === n);

        btn.classList.toggle('is-current', isCurrent);
        btn.classList.toggle('is-start', isStart && !isCurrent);
        btn.classList.toggle('is-end', isEnd && !isCurrent);
        btn.classList.toggle('is-available', isAvail);
        btn.classList.toggle('is-hint', !!isHint);

        btn.disabled = wrongSceneOrLocked;

        var mark = btn.querySelector('[data-sl-mark]');
        if (mark) {
          if (isCurrent) {
            mark.textContent = '笔';
          } else if (isStart) {
            mark.textContent = '起';
          } else if (isEnd) {
            mark.textContent = '终';
          } else {
            mark.textContent = '';
          }
        }

        var label = '第 ' + (n + 1) + ' 点';
        if (isCurrent) {
          label += '，当前笔尖';
        } else if (isStart) {
          label += '，起笔点';
        } else if (isEnd) {
          label += '，信口终点';
        }
        if (isAvail) {
          label += '，可连接';
        }
        btn.setAttribute('aria-label', label);
      }
    }

    function syncSceneSpringLetter(s) {
      var isCur = (currentScene() === 'unaddressed-spring-letter');
      var waitingEl = doc.getElementById('sl-waiting');
      var emptyEl = doc.getElementById('sl-empty');
      var workbenchEl = doc.getElementById('sl-workbench');

      var qualified = isUnlocked();
      var busy = isUpstreamBusy();
      var curHasTimer = !!(hasAdvance && hasAdvance('unaddressed-spring-letter'));

      if (!isCur) {
        return;
      }

      if (!qualified || busy) {
        if (waitingEl) {
          waitingEl.hidden = false;
          waitingEl.textContent = busy ? '温室尚有未了结的事务，请先完成温室再来照看春信。' : '春信摊平室暂时无法进入。';
        }
        if (emptyEl) {
          emptyEl.hidden = true;
        }
        if (workbenchEl) {
          workbenchEl.hidden = true;
        }
        var btnWindowDis = doc.getElementById('sl-take-window');
        var btnDrawerDis = doc.getElementById('sl-take-drawer');
        var btnChairDis = doc.getElementById('sl-take-chair');
        if (btnWindowDis) {
          btnWindowDis.disabled = true;
        }
        if (btnDrawerDis) {
          btnDrawerDis.disabled = true;
        }
        if (btnChairDis) {
          btnChairDis.disabled = true;
        }
        return;
      }

      if (waitingEl) {
        waitingEl.hidden = true;
      }

      var isPending = !!s.pending || curHasTimer;

      if (!s.draft) {
        if (emptyEl) {
          emptyEl.hidden = false;
        }
        if (workbenchEl) {
          workbenchEl.hidden = true;
        }

        var lastP = doc.getElementById('sl-last-letter');
        if (lastP) {
          if (s.lastLetter) {
            var lTitle = LETTER_NAMES[s.lastLetter.letter] || s.lastLetter.letter;
            var rTitle = (s.lastLetter.recipient === 'tomorrow') ? '寄往明天的自己' : (s.lastLetter.recipient === 'stranger' ? '留给下一位路过的人' : '已安放留存（今天先不寄）');
            lastP.textContent = '上一封春信来自「' + lTitle + '」，' + rTitle + '。目前累计寄出或安放 ' + s.letterCount + ' 封。';
          } else {
            lastP.textContent = '还没有寄出春信。';
          }
        }

        var availLetters = getAvailableLetters ? getAvailableLetters() : [];
        var btnWindow = doc.getElementById('sl-take-window');
        var noteWindow = doc.getElementById('sl-source-window-note');
        var hasWindow = availLetters.indexOf('window') !== -1;
        if (btnWindow) {
          btnWindow.disabled = isPending || !hasWindow;
        }
        if (noteWindow) {
          noteWindow.textContent = hasWindow ? '（窗台已解锁）' : '（需在温室窗台安放一盆新芽）';
        }

        var btnDrawer = doc.getElementById('sl-take-drawer');
        var noteDrawer = doc.getElementById('sl-source-drawer-note');
        var hasDrawer = availLetters.indexOf('drawer') !== -1;
        if (btnDrawer) {
          btnDrawer.disabled = isPending || !hasDrawer;
        }
        if (noteDrawer) {
          noteDrawer.textContent = hasDrawer ? '（抽屉已解锁）' : '（需在温室抽屉安放一盆新芽）';
        }

        var btnChair = doc.getElementById('sl-take-chair');
        var noteChair = doc.getElementById('sl-source-chair-note');
        var hasChair = availLetters.indexOf('chair') !== -1;
        if (btnChair) {
          btnChair.disabled = isPending || !hasChair;
        }
        if (noteChair) {
          noteChair.textContent = hasChair ? '（空椅已解锁）' : '（需在温室空椅旁安放一盆新芽）';
        }
      } else {
        if (emptyEl) {
          emptyEl.hidden = true;
        }
        if (workbenchEl) {
          workbenchEl.hidden = false;
        }

        var letterKey = s.draft.letter;
        var nameEl = doc.getElementById('sl-letter-name');
        if (nameEl) {
          nameEl.textContent = LETTER_NAMES[letterKey] || letterKey;
        }
        var textEl = doc.getElementById('sl-letter-text');
        if (textEl) {
          textEl.textContent = LETTER_TEXTS[letterKey] || '';
        }

        var info = rules.analyze(s.draft);
        renderBoard(s, info);

        var progressEl = doc.getElementById('sl-route-progress');
        if (progressEl && info) {
          progressEl.textContent = '信路墨线：' + info.used + ' / ' + info.total + ' 条。' + (info.complete ? '（已完整连通）' : (info.stuck ? '（无路可走，请退回）' : ''));
        }

        var histEl = doc.getElementById('sl-route-history');
        if (histEl) {
          var readablePath = [];
          for (var p = 0; p < s.draft.path.length; p += 1) {
            readablePath.push(s.draft.path[p] + 1);
          }
          histEl.textContent = '当前笔迹：' + readablePath.join(' → ');
        }

        var availEl = doc.getElementById('sl-route-available');
        if (availEl && info) {
          if (s.draft.sealed) {
            availEl.textContent = '信已封好，若需修改请先拆开。';
          } else if (info.available.length === 0) {
            availEl.textContent = info.complete ? '所有墨线已走完，可以封信。' : '当前没有可继续行进的相邻点。';
          } else {
            var availNums = [];
            for (var a = 0; a < info.available.length; a += 1) {
              availNums.push(info.available[a] + 1);
            }
            availEl.textContent = '下一笔可走向：第 ' + availNums.join('、') + ' 点。';
          }
        }

        var fbEl = doc.getElementById('sl-feedback');
        if (fbEl) {
          fbEl.textContent = localFeedback;
        }

        var btnHint = doc.getElementById('sl-hint');
        var btnUndo = doc.getElementById('sl-undo');
        var btnReset = doc.getElementById('sl-reset');
        var btnSeal = doc.getElementById('sl-seal');
        var btnUnseal = doc.getElementById('sl-unseal');
        var recipientsEl = doc.getElementById('sl-recipients');

        var sealed = s.draft.sealed;

        if (btnHint) {
          btnHint.disabled = isPending || sealed;
        }
        if (btnUndo) {
          btnUndo.disabled = isPending || sealed || s.draft.path.length <= 1;
        }
        if (btnReset) {
          btnReset.disabled = isPending || sealed || s.draft.path.length <= 1;
        }
        if (btnSeal) {
          btnSeal.hidden = sealed;
          btnSeal.disabled = isPending || !info || !info.complete;
        }
        if (btnUnseal) {
          btnUnseal.hidden = !sealed;
          btnUnseal.disabled = isPending;
        }
        if (recipientsEl) {
          recipientsEl.hidden = !sealed;
        }

        var sendTomorrow = doc.getElementById('sl-send-tomorrow');
        var sendStranger = doc.getElementById('sl-send-stranger');
        var sendUnsent = doc.getElementById('sl-send-unsent');
        if (sendTomorrow) {
          sendTomorrow.disabled = isPending;
        }
        if (sendStranger) {
          sendStranger.disabled = isPending;
        }
        if (sendUnsent) {
          sendUnsent.disabled = isPending;
        }
      }

      var summaryEl = doc.getElementById('sl-collection-summary');
      if (summaryEl) {
        summaryEl.textContent = '已收集余韵 ' + s.outcomes.length + ' / 9 份，累计送出或安放 ' + s.letterCount + ' 封。完成任意一封即算作走过春天。';
      }
    }

    function syncDeadletter(s) {
      var panel = doc.getElementById('sl-post-panel');
      if (!panel) {
        return;
      }
      var qualified = isUnlocked();
      if (!qualified) {
        panel.hidden = true;
        return;
      }
      panel.hidden = false;
      var busy = isUpstreamBusy();
      var hasTimer = !!(hasAdvance && hasAdvance('deadletter'));
      var enterBtn = doc.getElementById('sl-enter');
      var resp = doc.getElementById('sl-post-response');
      if (enterBtn) {
        enterBtn.disabled = busy || !!s.pending || hasTimer;
      }
      if (resp) {
        resp.textContent = busy ? '温室尚有未了结的事务，请先完成温室。' : '';
      }
    }

    function syncRemembrance(s) {
      var panel = doc.getElementById('sl-entry-panel');
      var qualified = isUnlocked();
      var busy = isUpstreamBusy();
      var hasTimer = !!(hasAdvance && hasAdvance('remembrance'));

      if (panel) {
        if (!qualified) {
          panel.hidden = true;
        } else {
          panel.hidden = false;
          var btnEntry = doc.getElementById('sl-entry');
          var btnResume = doc.getElementById('sl-resume');
          var resp = doc.getElementById('sl-entry-response');
          if (btnEntry) {
            btnEntry.disabled = busy || !!s.pending || hasTimer;
          }
          if (btnResume) {
            var canResume = !!(s.pending || (s.visited && s.draft));
            btnResume.hidden = !canResume;
            btnResume.disabled = busy || hasTimer;
          }
          if (resp) {
            resp.textContent = busy ? '温室尚有未了结的事务，请先完成温室。' : '';
          }
        }
      }

      var codexSection = doc.getElementById('sl-codex');
      if (codexSection) {
        codexSection.hidden = !qualified || (!s.visited && s.outcomes.length === 0);
      }

      var codexSummary = doc.getElementById('sl-codex-summary');
      if (codexSummary) {
        codexSummary.textContent = '春信余韵记录（' + s.outcomes.length + ' / 9）：';
      }

      for (var l = 0; l < VALID_LETTERS.length; l += 1) {
        for (var r = 0; r < VALID_RECIPIENTS.length; r += 1) {
          var id = VALID_LETTERS[l] + ':' + VALID_RECIPIENTS[r];
          var pEl = doc.getElementById('sl-codex-' + VALID_LETTERS[l] + '-' + VALID_RECIPIENTS[r]);
          if (pEl) {
            var isCollected = (s.outcomes.indexOf(id) !== -1);
            if (isCollected) {
              pEl.classList.add('is-collected');
              var fullEchoKey = VALID_RECIPIENTS[r] + ':' + VALID_LETTERS[l];
              var echoText = ECHO_TEXTS[fullEchoKey] || '';
              pEl.textContent = '【已留下回响】' + echoText;
            } else {
              pEl.classList.remove('is-collected');
              pEl.textContent = '尚未留下这份回响';
            }
          }
        }
      }
    }

    function syncEchoes(s) {
      var qualified = isUnlocked();
      var echoes = ['tomorrow', 'stranger', 'unsent'];
      for (var i = 0; i < echoes.length; i += 1) {
        var rec = echoes[i];
        var panel = doc.getElementById('sl-echo-' + rec);
        if (!panel) {
          continue;
        }
        var targetScene = RECIPIENT_TARGETS[rec];
        var hasAny = false;
        for (var l = 0; l < VALID_LETTERS.length; l += 1) {
          var letKey = VALID_LETTERS[l];
          var outKey = letKey + ':' + rec;
          var letP = doc.getElementById('sl-echo-' + rec + '-' + letKey);
          if (letP) {
            var collected = qualified && (s.outcomes.indexOf(outKey) !== -1);
            letP.hidden = !collected;
            if (collected) {
              hasAny = true;
              var fullKey = rec + ':' + letKey;
              if (ECHO_TEXTS[fullKey]) {
                letP.textContent = ECHO_TEXTS[fullKey];
              }
            }
          }
        }
        panel.hidden = !qualified || !hasAny || (currentScene() !== targetScene);
      }
    }

    function syncDirectory(s) {
      var dirLink = doc.getElementById('unaddressed-spring-letter-link');
      if (dirLink) {
        dirLink.hidden = !isUnlocked() || !s.visited;
      }
    }

    function sync() {
      var s = readStateInternal();
      updateDeadletterLockState(s);
      syncSceneSpringLetter(s);
      syncDeadletter(s);
      syncRemembrance(s);
      syncEchoes(s);
      syncDirectory(s);
    }

    function handleEnter(e) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct('sl-enter', 'deadletter', false)) {
        return;
      }
      var s = readStateInternal();
      s.pending = {
        kind: 'enter',
        source: 'deadletter',
        target: 'unaddressed-spring-letter'
      };
      saveState(s);
      ownedTimerSource = 'deadletter';
      schedule('deadletter', 'unaddressed-spring-letter', delayMs(), function () {
        if (ownedTimerSource === 'deadletter') {
          ownedTimerSource = null;
        }
      });
      sync();
    }

    function handleTakeLetter(e, letter, btnId) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct(btnId, 'unaddressed-spring-letter', false)) {
        return;
      }
      var s = readStateInternal();
      if (!s.visited || s.draft !== null) {
        return;
      }
      var avail = getAvailableLetters ? getAvailableLetters() : [];
      if (avail.indexOf(letter) === -1) {
        return;
      }
      var newDraft = rules.createDraft(letter);
      if (!newDraft) {
        return;
      }
      s.draft = newDraft;
      localHint = null;
      localFeedback = '取出了「' + LETTER_NAMES[letter] + '」，请从起笔描画相连墨线。';
      saveState(s);
      sync();
    }

    function handleNodeClick(e, nodeIndex) {
      if (!e.isTrusted) {
        return;
      }
      var btnId = 'sl-node-' + nodeIndex;
      if (!canAct(btnId, 'unaddressed-spring-letter', false)) {
        return;
      }
      var s = readStateInternal();
      if (!s.draft || s.draft.sealed) {
        return;
      }
      var stepped = rules.step(s.draft, nodeIndex);
      if (!stepped) {
        var info = rules.analyze(s.draft);
        if (info && info.available.indexOf(nodeIndex) === -1) {
          localFeedback = '第 ' + (nodeIndex + 1) + ' 点与当前笔尖没有未走的直接墨线。';
          sync();
        }
        return;
      }
      s.draft = stepped;
      localHint = null;
      localFeedback = '走到第 ' + (nodeIndex + 1) + ' 点。';
      saveState(s);
      sync();
    }

    function handleUndo(e) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct('sl-undo', 'unaddressed-spring-letter', false)) {
        return;
      }
      var s = readStateInternal();
      if (!s.draft || s.draft.sealed || s.draft.path.length <= 1) {
        return;
      }
      var undone = rules.undo(s.draft);
      if (!undone) {
        return;
      }
      s.draft = undone;
      localHint = null;
      localFeedback = '已退回上一个墨点。';
      saveState(s);
      sync();
    }

    function handleReset(e) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct('sl-reset', 'unaddressed-spring-letter', false)) {
        return;
      }
      var s = readStateInternal();
      if (!s.draft || s.draft.sealed || s.draft.path.length <= 1) {
        return;
      }
      var res = rules.reset(s.draft);
      if (!res) {
        return;
      }
      s.draft = res;
      localHint = null;
      localFeedback = '已重新回到起笔点。';
      saveState(s);
      sync();
    }

    function handleHint(e) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct('sl-hint', 'unaddressed-spring-letter', false)) {
        return;
      }
      var s = readStateInternal();
      if (!s.draft || s.draft.sealed) {
        return;
      }
      var h = rules.hint(s.draft);
      if (!h) {
        return;
      }
      localHint = h;
      if (h.undo > 0) {
        localFeedback = '前方无完整连线：先撤回 ' + h.undo + ' 步，再走到第 ' + (h.next + 1) + ' 点。';
      } else if (h.next !== null) {
        localFeedback = '指路：下一笔可以走向第 ' + (h.next + 1) + ' 点。';
      } else {
        localFeedback = '所有墨线已完整连通。';
      }
      sync();
    }

    function handleSeal(e, sealVal, btnId) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct(btnId, 'unaddressed-spring-letter', false)) {
        return;
      }
      var s = readStateInternal();
      if (!s.draft) {
        return;
      }
      var res = rules.seal(s.draft, sealVal);
      if (!res) {
        return;
      }
      s.draft = res;
      localHint = null;
      localFeedback = sealVal ? '信已封好，请选择去向。' : '信件已拆开，可以继续调整笔迹。';
      saveState(s);
      sync();
    }

    function handleSend(e, recipient, btnId) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct(btnId, 'unaddressed-spring-letter', false)) {
        return;
      }
      var s = readStateInternal();
      if (!s.draft || !s.draft.sealed) {
        return;
      }
      var info = rules.analyze(s.draft);
      if (!info || !info.complete) {
        return;
      }
      var target = RECIPIENT_TARGETS[recipient];
      if (!target) {
        return;
      }
      s.pending = {
        kind: 'deliver',
        source: 'unaddressed-spring-letter',
        target: target,
        letter: s.draft.letter,
        recipient: recipient
      };
      saveState(s);
      ownedTimerSource = 'unaddressed-spring-letter';
      schedule('unaddressed-spring-letter', target, delayMs(), function () {
        if (ownedTimerSource === 'unaddressed-spring-letter') {
          ownedTimerSource = null;
        }
      });
      sync();
    }

    function handleRemembranceEntry(e) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct('sl-entry', 'remembrance', false)) {
        return;
      }
      navigate('deadletter');
    }

    function handleRemembranceResume(e) {
      if (!e.isTrusted) {
        return;
      }
      if (!canAct('sl-resume', 'remembrance', true)) {
        return;
      }
      var s = readStateInternal();
      if (s.pending) {
        navigate(s.pending.source);
        return;
      }
      if (s.visited && s.draft) {
        navigate('unaddressed-spring-letter');
      }
    }

    function bindEvents() {
      var enterBtn = doc.getElementById('sl-enter');
      if (enterBtn) {
        enterBtn.addEventListener('click', handleEnter);
      }
      var btnWindow = doc.getElementById('sl-take-window');
      if (btnWindow) {
        btnWindow.addEventListener('click', function (e) {
          handleTakeLetter(e, 'window', 'sl-take-window');
        });
      }
      var btnDrawer = doc.getElementById('sl-take-drawer');
      if (btnDrawer) {
        btnDrawer.addEventListener('click', function (e) {
          handleTakeLetter(e, 'drawer', 'sl-take-drawer');
        });
      }
      var btnChair = doc.getElementById('sl-take-chair');
      if (btnChair) {
        btnChair.addEventListener('click', function (e) {
          handleTakeLetter(e, 'chair', 'sl-take-chair');
        });
      }
      for (var n = 0; n < 12; n += 1) {
        (function (idx) {
          var btn = doc.getElementById('sl-node-' + idx);
          if (btn) {
            btn.addEventListener('click', function (e) {
              handleNodeClick(e, idx);
            });
          }
        })(n);
      }
      var btnUndo = doc.getElementById('sl-undo');
      if (btnUndo) {
        btnUndo.addEventListener('click', handleUndo);
      }
      var btnReset = doc.getElementById('sl-reset');
      if (btnReset) {
        btnReset.addEventListener('click', handleReset);
      }
      var btnHint = doc.getElementById('sl-hint');
      if (btnHint) {
        btnHint.addEventListener('click', handleHint);
      }
      var btnSeal = doc.getElementById('sl-seal');
      if (btnSeal) {
        btnSeal.addEventListener('click', function (e) {
          handleSeal(e, true, 'sl-seal');
        });
      }
      var btnUnseal = doc.getElementById('sl-unseal');
      if (btnUnseal) {
        btnUnseal.addEventListener('click', function (e) {
          handleSeal(e, false, 'sl-unseal');
        });
      }
      var sendTomorrow = doc.getElementById('sl-send-tomorrow');
      if (sendTomorrow) {
        sendTomorrow.addEventListener('click', function (e) {
          handleSend(e, 'tomorrow', 'sl-send-tomorrow');
        });
      }
      var sendStranger = doc.getElementById('sl-send-stranger');
      if (sendStranger) {
        sendStranger.addEventListener('click', function (e) {
          handleSend(e, 'stranger', 'sl-send-stranger');
        });
      }
      var sendUnsent = doc.getElementById('sl-send-unsent');
      if (sendUnsent) {
        sendUnsent.addEventListener('click', function (e) {
          handleSend(e, 'unsent', 'sl-send-unsent');
        });
      }
      var remEntry = doc.getElementById('sl-entry');
      if (remEntry) {
        remEntry.addEventListener('click', handleRemembranceEntry);
      }
      var remResume = doc.getElementById('sl-resume');
      if (remResume) {
        remResume.addEventListener('click', handleRemembranceResume);
      }
    }

    bindEvents();

    function onScene(name) {
      if (name !== currentScene()) {
        return;
      }

      var qualified = isUnlocked();
      var upBusy = isUpstreamBusy();
      var s = readStateInternal();

      if (s.pending !== null) {
        var p = s.pending;
        if (name === p.target) {
          if (qualified && !upBusy) {
            if (p.kind === 'enter') {
              s.visited = true;
              s.pending = null;
              arrivalFocusToken = 'enter';
              saveState(s);
              if (ownedTimerSource === p.source) {
                ownedTimerSource = null;
              }
            } else if (p.kind === 'deliver') {
              var outcomeId = p.letter + ':' + p.recipient;
              if (s.outcomes.indexOf(outcomeId) === -1) {
                s.outcomes.push(outcomeId);
                s.outcomes = sortOutcomes(s.outcomes);
              }
              s.letterCount = Math.min(9999, s.letterCount + 1);
              s.lastLetter = {
                letter: p.letter,
                recipient: p.recipient
              };
              s.draft = null;
              s.pending = null;
              arrivalFocusToken = p.recipient;
              saveState(s);
              localHint = null;
              localFeedback = '';
              if (ownedTimerSource === p.source) {
                ownedTimerSource = null;
              }
            }
          } else {
            if (ownedTimerSource === p.source) {
              ownedTimerSource = null;
            }
          }
        } else if (name === p.source) {
          if (qualified && !upBusy) {
            if (hasAdvance && !hasAdvance(p.source)) {
              ownedTimerSource = p.source;
              schedule(p.source, p.target, delayMs(), function () {
                if (ownedTimerSource === p.source) {
                  ownedTimerSource = null;
                }
              });
            }
          }
        } else {
          s.pending = null;
          saveState(s);
          ownedTimerSource = null;
          arrivalFocusToken = null;
          localHint = null;
          localFeedback = '';
        }
      } else {
        if (arrivalFocusToken !== null) {
          var expectedScene = (arrivalFocusToken === 'enter') ? 'unaddressed-spring-letter' : RECIPIENT_TARGETS[arrivalFocusToken];
          if (name !== expectedScene) {
            arrivalFocusToken = null;
          }
        }
      }

      sync();
    }

    function focusArrival(name) {
      if (!arrivalFocusToken) {
        return;
      }
      var expectedTarget = (arrivalFocusToken === 'enter') ? 'unaddressed-spring-letter' : RECIPIENT_TARGETS[arrivalFocusToken];
      if (name !== expectedTarget) {
        arrivalFocusToken = null;
        return;
      }
      if (name !== currentScene() || !isUnlocked()) {
        return;
      }

      var token = arrivalFocusToken;
      arrivalFocusToken = null;

      var targetEl = null;
      if (token === 'enter') {
        targetEl = doc.getElementById('sl-title');
      } else {
        targetEl = doc.getElementById('sl-echo-' + token + '-title');
      }
      if (targetEl && setArrivalFocus) {
        setArrivalFocus(targetEl);
      }
    }

    function forget() {
      try {
        removeOwn();
      } catch (err) {
        // swallow
      }
      if (ownedTimerSource !== null) {
        if (clearAdvance) {
          clearAdvance(ownedTimerSource);
        }
        ownedTimerSource = null;
      }
      arrivalFocusToken = null;
      unlockDeadletterButtons();
      localHint = null;
      localFeedback = '';
      var postResp = doc.getElementById('sl-post-response');
      if (postResp) {
        postResp.textContent = '';
      }
      var entryResp = doc.getElementById('sl-entry-response');
      if (entryResp) {
        entryResp.textContent = '';
      }
      sync();
    }

    function progressStep() {
      var s = readStateInternal();
      if (!isUnlocked()) {
        return null;
      }
      var busy = isUpstreamBusy();
      if (busy) {
        return {
          title: '没有地址的春信',
          items: ['先完成温室未了结的事务，再前往无主投递所查看新的春信。'],
          target: 'rw-resume',
          done: false
        };
      }

      var hasDone = s.letterCount > 0;
      var active = !!(s.pending || (s.visited && s.draft));
      var target = active ? 'sl-resume' : 'sl';

      var desc = [];
      if (!s.visited) {
        desc.push('前往无主投递所格柜，在侧桌摊开一封没有地址的春信。');
      } else if (s.draft) {
        desc.push('继续描画手中来自「' + LETTER_NAMES[s.draft.letter] + '」的信路，封好后寄出。');
      } else if (hasDone) {
        desc.push('你已完成过一封春信。可随时回到侧桌，尝试描画其他来信或体验不同去向的余韵。');
      } else {
        desc.push('在侧桌选择一封来信，亲手描画一笔信路。');
      }

      return {
        title: '没有地址的春信',
        items: desc,
        target: target,
        done: hasDone
      };
    }

    return Object.freeze({
      getState: function () {
        return readStateInternal();
      },
      unlocked: isUnlocked,
      canVisit: canVisit,
      onScene: onScene,
      sync: sync,
      focusArrival: focusArrival,
      forget: forget,
      progressStep: progressStep
    });
  }

  var GoddeadSpringLetter = Object.freeze({
    create: create
  });

  Object.defineProperty(globalThis, 'GoddeadSpringLetter', {
    value: GoddeadSpringLetter,
    writable: false,
    enumerable: true,
    configurable: false
  });
})();
