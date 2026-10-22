(function (root) {
  "use strict";

  function create(config) {
    const {
      EXACT_TEA_VERSION,
      ET_HOUSE,
      ET_TABLE,
      ET_COURT,
      ET_ORDERS,
      ET_ORDER_TABLE,
      ET_METHODS,
      ET_METHOD_TABLE,
      ET_POUR_IDS,
      ET_VERDICT_TABLE,
      ET_VERDICT_OUTCOME_IDS,
      ET_ENTRY_FEEDBACK,
      ET_ABANDON_FEEDBACK,
      ET_COURT_ENTRY_FEEDBACK,
      ET_SERVER_RETURN_FEEDBACK,
      ET_VESSELS,
    } = config;

    /* 纯函数：把第 from 只倒进第 to 只，倒到对方满或自己空为止 */
    function etPourStep(caps, levels, from, to) {
      if (from === to || !ET_VESSELS.includes(from) || !ET_VESSELS.includes(to)) return levels.slice();
      const next = levels.slice();
      const amount = Math.min(next[from], caps[to] - next[to]);
      next[from] -= amount;
      next[to] += amount;
      return next;
    }

    /* 纯函数：哪一只量器里正好是客人要的口数（没有就是 -1） */
    function etMatch(levels, amount) {
      return levels.indexOf(amount);
    }

    /* 纯函数：从全空开始，最少几步能量出 amount（灌满 / 倒空 / 互倒各算一步） */
    function etMinSteps(caps, amount) {
      const start = caps.map(() => 0);
      const seen = new Set([start.join(',')]);
      let frontier = [start];
      for (let depth = 0; frontier.length && depth < 40; depth++) {
        const next = [];
        for (const levels of frontier) {
          if (levels.includes(amount)) return depth;
          const moves = [];
          ET_VESSELS.forEach((i) => {
            const full = levels.slice(); full[i] = caps[i]; moves.push(full);
            const empty = levels.slice(); empty[i] = 0; moves.push(empty);
            ET_VESSELS.forEach((j) => { if (i !== j) moves.push(etPourStep(caps, levels, i, j)); });
          });
          moves.forEach((m) => { const k = m.join(','); if (!seen.has(k)) { seen.add(k); next.push(m); } });
        }
        frontier = next;
      }
      return -1;
    }

    function etServeFeedback(order, method) {
      return `${ET_ORDER_TABLE[order].title}：${ET_METHOD_TABLE[method].result}`;
    }

    function defaultExactTea() {
      const latest = {};
      ET_ORDERS.forEach((b) => { latest[b] = ''; });
      return {
        version: EXACT_TEA_VERSION,
        visited: { house: false, table: false, court: false },
        draft: { order: '', method: 'clay' },
        pours: [],
        courtOutcomes: [],
        pourRuns: 0,
        courtRuns: 0,
        latestMethodByOrder: latest,
        lastOutcome: '',
        activeServer: null,
        pending: null,
      };
    }

    function clampEtCount(n) {
      const v = Math.floor(Number(n));
      return Number.isFinite(v) ? Math.min(9999, Math.max(0, v)) : 0;
    }

    function normalizeExactTea(raw) {
      const d = defaultExactTea();
      if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== EXACT_TEA_VERSION) return d;
      const v = raw.visited && typeof raw.visited === 'object' ? raw.visited : {};
      d.visited = { house: v.house === true, table: v.table === true, court: v.court === true };
      const dr = raw.draft && typeof raw.draft === 'object' ? raw.draft : {};
      d.draft = { order: ET_ORDERS.includes(dr.order) ? dr.order : '', method: ET_METHODS.includes(dr.method) ? dr.method : 'clay' };
      const pours = new Set(Array.isArray(raw.pours) ? raw.pours : []);
      d.pours = ET_POUR_IDS.filter((id) => pours.has(id));
      const outcomes = new Set(Array.isArray(raw.courtOutcomes) ? raw.courtOutcomes : []);
      d.courtOutcomes = ET_VERDICT_OUTCOME_IDS.filter((id) => outcomes.has(id));
      d.pourRuns = clampEtCount(raw.pourRuns);
      d.courtRuns = clampEtCount(raw.courtRuns);
      const latest = raw.latestMethodByOrder && typeof raw.latestMethodByOrder === 'object' ? raw.latestMethodByOrder : {};
      ET_ORDERS.forEach((b) => {
        d.latestMethodByOrder[b] = ET_METHODS.includes(latest[b]) && d.pours.includes(`${b}:${latest[b]}`) ? latest[b] : '';
      });
      if (typeof raw.lastOutcome === 'string' && (d.pours.includes(raw.lastOutcome) || d.courtOutcomes.includes(raw.lastOutcome))) d.lastOutcome = raw.lastOutcome;
      const a = raw.activeServer;
      if (a && typeof a === 'object' && !Array.isArray(a) && Object.keys(a).length === 1 && d.pours.includes(a.pour)) d.activeServer = { pour: a.pour };
      d.pending = normalizeEtPending(raw.pending, d);
      return d;
    }

    function etCourtProgress(st) {
      const orders = new Set();
      const methods = new Set();
      st.pours.forEach((id) => {
        const [order, method] = id.split(':');
        orders.add(order);
        methods.add(method);
      });
      return { orders: orders.size, methods: methods.size };
    }

    function etCourtEligible(st) {
      const p = etCourtProgress(st);
      return p.orders === ET_ORDERS.length && p.methods === ET_METHODS.length;
    }

    function expectedEtPending(p, st) {
      const clean = !st.activeServer;
      switch (p.kind) {
        case 'entry':
          return clean ? { feedback: ET_ENTRY_FEEDBACK, kind: 'entry', target: ET_HOUSE } : null;
        case 'order': {
          const b = ET_ORDER_TABLE[p.order];
          if (!b || !clean) return null;
          return { order: p.order, feedback: b.feedback, kind: 'order', source: ET_HOUSE, target: ET_TABLE };
        }
        case 'serve': {
          const b = ET_ORDER_TABLE[p.order];
          if (!b || !ET_METHOD_TABLE[p.method] || !clean || st.draft.order !== p.order || st.draft.method !== p.method) return null;
          return { order: p.order, feedback: etServeFeedback(p.order, p.method), kind: 'serve', method: p.method, pour: `${p.order}:${p.method}`, source: ET_TABLE, target: b.target };
        }
        case 'abandon':
          return st.draft.order ? { feedback: ET_ABANDON_FEEDBACK, kind: 'abandon', source: ET_TABLE, target: ET_HOUSE } : null;
        case 'server-return': {
          if (!st.activeServer) return null;
          const order = st.activeServer.pour.split(':')[0];
          return { feedback: ET_SERVER_RETURN_FEEDBACK, from: ET_ORDER_TABLE[order].target, kind: 'server-return', pour: st.activeServer.pour, target: ET_HOUSE };
        }
        case 'court-entry':
          return clean && etCourtEligible(st) ? { feedback: ET_COURT_ENTRY_FEEDBACK, kind: 'court-entry', target: ET_COURT } : null;
        case 'verdict': {
          const a = ET_VERDICT_TABLE[p.action];
          if (!a || !clean || !st.visited.court || !etCourtEligible(st)) return null;
          return { action: p.action, feedback: a.feedback, kind: 'verdict', outcome: a.outcome, source: ET_COURT, target: a.target };
        }
        default:
          return null;
      }
    }

    function normalizeEtPending(p, st) {
      if (!p || typeof p !== 'object' || Array.isArray(p) || typeof p.kind !== 'string') return null;
      const expected = expectedEtPending(p, st);
      if (!expected) return null;
      const keys = Object.keys(p).sort();
      const want = Object.keys(expected).sort();
      if (keys.length !== want.length || keys.some((k, i) => k !== want[i] || p[k] !== expected[k])) return null;
      return expected;
    }

    return Object.freeze({
      etPourStep,
      etMatch,
      etMinSteps,
      etServeFeedback,
      defaultExactTea,
      clampEtCount,
      normalizeExactTea,
      etCourtProgress,
      etCourtEligible,
      expectedEtPending,
      normalizeEtPending,
    });
  }

  root.GoddeadTeaRules = Object.freeze({ create });
})(globalThis);
