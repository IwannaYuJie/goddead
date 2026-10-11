/* v126 — v108 beam geometry and canonical state; configuration stays in script.js. */
(function (root) {
  "use strict";

  function create(config) {
    const {
      BORROWED_LIGHT_VERSION,
      LB_OFFICE,
      LB_FLOOR,
      LB_COURT,
      LB_N,
      LB_MODELS,
      LB_MODEL_TABLE,
      LB_METHODS,
      LB_METHOD_TABLE,
      LB_BEAM_IDS,
      LB_VERDICT_TABLE,
      LB_VERDICT_OUTCOME_IDS,
      LB_ENTRY_FEEDBACK,
      LB_ABANDON_FEEDBACK,
      LB_COURT_ENTRY_FEEDBACK,
      LB_LAMPLIGHTER_RETURN_FEEDBACK,
    } = config;

    function lbStart(entry) {
      if (entry.side === 'west') return { r: entry.pos, c: 0, dr: 0, dc: 1 };
      if (entry.side === 'east') return { r: entry.pos, c: LB_N - 1, dr: 0, dc: -1 };
      return { r: 0, c: entry.pos, dr: 1, dc: 0 };
    }

    /* 纯函数：沿光路走，碰到镜子按朝向折 90°，碰到石柱停下；返回走过的格、出口与折数 */
    function lbTrace(layout, states, entry) {
      let { r, c, dr, dc } = lbStart(entry);
      let bounces = 0;
      let mirror = 0;
      const order = {};
      for (let i = 0; i < layout.length; i++) if (layout[i] === 'm') order[i] = mirror++;
      const path = [];
      for (let step = 0; step < 80; step++) {
        if (r < 0 || r >= LB_N || c < 0 || c >= LB_N) return { path, exit: [r, c], bounces, blocked: false };
        path.push([r, c]);
        const cell = layout[r * LB_N + c];
        if (cell === '#') return { path, exit: null, bounces, blocked: true };
        if (cell === 'm') {
          if (states[order[r * LB_N + c]] === 0) [dr, dc] = [-dc, -dr];
          else [dr, dc] = [dc, dr];
          bounces += 1;
        }
        r += dr;
        c += dc;
      }
      return { path, exit: null, bounces, blocked: false };
    }

    /* 纯函数：这种光在这组镜面下有没有照进那间屋的窗（底边） */
    function lbLit(model, method, states) {
      const m = LB_MODEL_TABLE[model];
      const res = lbTrace(m.layout, states, m.entries[method]);
      return Boolean(res.exit && res.exit[0] === LB_N && res.exit[1] === m.window);
    }

    /* 纯函数：把光路换算成 0–100 坐标的折线点 */
    function lbBeamPoints(model, method, states) {
      const m = LB_MODEL_TABLE[model];
      const entry = m.entries[method];
      const res = lbTrace(m.layout, states, entry);
      const unit = 100 / LB_N;
      const center = ([r, c]) => [(c + 0.5) * unit, (r + 0.5) * unit];
      const pts = [];
      if (entry.side === 'west') pts.push([0, (entry.pos + 0.5) * unit]);
      else if (entry.side === 'east') pts.push([100, (entry.pos + 0.5) * unit]);
      else pts.push([(entry.pos + 0.5) * unit, 0]);
      res.path.forEach((cell) => pts.push(center(cell)));
      if (res.exit) {
        const [r, c] = res.exit;
        const last = res.path.length ? center(res.path[res.path.length - 1]) : pts[0];
        if (r >= LB_N) pts.push([last[0], 100]);
        else if (r < 0) pts.push([last[0], 0]);
        else if (c >= LB_N) pts.push([100, last[1]]);
        else pts.push([0, last[1]]);
      }
      return { points: pts.map(([x, y]) => `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`).join(' '), trace: res };
    }

    function lbShineFeedback(model, method) {
      return `${LB_MODEL_TABLE[model].title}：${LB_METHOD_TABLE[method].result}`;
    }

    function defaultBorrowedLight() {
      const latest = {};
      LB_MODELS.forEach((b) => { latest[b] = ''; });
      return {
        version: BORROWED_LIGHT_VERSION,
        visited: { office: false, floor: false, court: false },
        draft: { model: '', method: 'dawn' },
        beams: [],
        courtOutcomes: [],
        beamRuns: 0,
        courtRuns: 0,
        latestMethodByModel: latest,
        lastOutcome: '',
        activeLamplighter: null,
        pending: null,
      };
    }

    function clampLbCount(n) {
      const v = Math.floor(Number(n));
      return Number.isFinite(v) ? Math.min(9999, Math.max(0, v)) : 0;
    }

    function normalizeBorrowedLight(raw) {
      const d = defaultBorrowedLight();
      if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== BORROWED_LIGHT_VERSION) return d;
      const v = raw.visited && typeof raw.visited === 'object' ? raw.visited : {};
      d.visited = { office: v.office === true, floor: v.floor === true, court: v.court === true };
      const dr = raw.draft && typeof raw.draft === 'object' ? raw.draft : {};
      d.draft = { model: LB_MODELS.includes(dr.model) ? dr.model : '', method: LB_METHODS.includes(dr.method) ? dr.method : 'dawn' };
      const beams = new Set(Array.isArray(raw.beams) ? raw.beams : []);
      d.beams = LB_BEAM_IDS.filter((id) => beams.has(id));
      const outcomes = new Set(Array.isArray(raw.courtOutcomes) ? raw.courtOutcomes : []);
      d.courtOutcomes = LB_VERDICT_OUTCOME_IDS.filter((id) => outcomes.has(id));
      d.beamRuns = clampLbCount(raw.beamRuns);
      d.courtRuns = clampLbCount(raw.courtRuns);
      const latest = raw.latestMethodByModel && typeof raw.latestMethodByModel === 'object' ? raw.latestMethodByModel : {};
      LB_MODELS.forEach((b) => {
        d.latestMethodByModel[b] = LB_METHODS.includes(latest[b]) && d.beams.includes(`${b}:${latest[b]}`) ? latest[b] : '';
      });
      if (typeof raw.lastOutcome === 'string' && (d.beams.includes(raw.lastOutcome) || d.courtOutcomes.includes(raw.lastOutcome))) d.lastOutcome = raw.lastOutcome;
      const a = raw.activeLamplighter;
      if (a && typeof a === 'object' && !Array.isArray(a) && Object.keys(a).length === 1 && d.beams.includes(a.beam)) d.activeLamplighter = { beam: a.beam };
      d.pending = normalizeLbPending(raw.pending, d);
      return d;
    }

    function lbCourtProgress(st) {
      const models = new Set();
      const methods = new Set();
      st.beams.forEach((id) => {
        const [model, method] = id.split(':');
        models.add(model);
        methods.add(method);
      });
      return { models: models.size, methods: methods.size };
    }

    function lbCourtEligible(st) {
      const p = lbCourtProgress(st);
      return p.models === LB_MODELS.length && p.methods === LB_METHODS.length;
    }

    function expectedLbPending(p, st) {
      const clean = !st.activeLamplighter;
      switch (p.kind) {
        case 'entry':
          return clean ? { feedback: LB_ENTRY_FEEDBACK, kind: 'entry', target: LB_OFFICE } : null;
        case 'model': {
          const b = LB_MODEL_TABLE[p.model];
          if (!b || !clean) return null;
          return { model: p.model, feedback: b.feedback, kind: 'model', source: LB_OFFICE, target: LB_FLOOR };
        }
        case 'shine': {
          const b = LB_MODEL_TABLE[p.model];
          if (!b || !LB_METHOD_TABLE[p.method] || !clean || st.draft.model !== p.model || st.draft.method !== p.method) return null;
          return { model: p.model, feedback: lbShineFeedback(p.model, p.method), kind: 'shine', method: p.method, beam: `${p.model}:${p.method}`, source: LB_FLOOR, target: b.target };
        }
        case 'abandon':
          return st.draft.model ? { feedback: LB_ABANDON_FEEDBACK, kind: 'abandon', source: LB_FLOOR, target: LB_OFFICE } : null;
        case 'lamplighter-return': {
          if (!st.activeLamplighter) return null;
          const model = st.activeLamplighter.beam.split(':')[0];
          return { feedback: LB_LAMPLIGHTER_RETURN_FEEDBACK, from: LB_MODEL_TABLE[model].target, kind: 'lamplighter-return', beam: st.activeLamplighter.beam, target: LB_OFFICE };
        }
        case 'court-entry':
          return clean && lbCourtEligible(st) ? { feedback: LB_COURT_ENTRY_FEEDBACK, kind: 'court-entry', target: LB_COURT } : null;
        case 'verdict': {
          const a = LB_VERDICT_TABLE[p.action];
          if (!a || !clean || !st.visited.court || !lbCourtEligible(st)) return null;
          return { action: p.action, feedback: a.feedback, kind: 'verdict', outcome: a.outcome, source: LB_COURT, target: a.target };
        }
        default:
          return null;
      }
    }

    function normalizeLbPending(p, st) {
      if (!p || typeof p !== 'object' || Array.isArray(p) || typeof p.kind !== 'string') return null;
      const expected = expectedLbPending(p, st);
      if (!expected) return null;
      const keys = Object.keys(p).sort();
      const want = Object.keys(expected).sort();
      if (keys.length !== want.length || keys.some((k, i) => k !== want[i] || p[k] !== expected[k])) return null;
      return expected;
    }

    return Object.freeze({
      lbStart,
      lbTrace,
      lbLit,
      lbBeamPoints,
      lbShineFeedback,
      defaultBorrowedLight,
      clampLbCount,
      normalizeBorrowedLight,
      lbCourtProgress,
      lbCourtEligible,
      expectedLbPending,
      normalizeLbPending,
    });
  }

  root.GoddeadLightRules = Object.freeze({ create });
})(globalThis);
