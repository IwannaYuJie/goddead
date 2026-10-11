/* v125 — v107 ink mathematics and canonical state; configuration stays in script.js. */
(function (root) {
  "use strict";

  function create(config) {
    const {
      INK_MIXING_VERSION,
      MX_ROOM,
      MX_DISH,
      MX_COURT,
      MX_PIGMENTS,
      MX_PIGMENT_TABLE,
      MX_PAPER,
      MX_MAX_PARTS,
      MX_INKS,
      MX_INK_TABLE,
      MX_METHODS,
      MX_METHOD_TABLE,
      MX_MIX_IDS,
      MX_VERDICT_ACTIONS,
      MX_VERDICT_TABLE,
      MX_VERDICT_OUTCOME_IDS,
      MX_ENTRY_FEEDBACK,
      MX_ABANDON_FEEDBACK,
      MX_COURT_ENTRY_FEEDBACK,
      MX_APPRENTICE_RETURN_FEEDBACK,
      MX_OLD_TARGETS,
    } = config;

    /* 纯函数：按份数混出颜色（三色加权平均，再按总份数盖过纸色） */
    function mxMix(parts) {
      const p = MX_PIGMENTS.map((k) => Math.max(0, Math.min(MX_MAX_PARTS, Math.round(Number(parts && parts[k]) || 0))));
      const total = p.reduce((a, b) => a + b, 0);
      if (!total) return MX_PAPER.slice();
      const density = Math.min(1, total / MX_MAX_PARTS);
      return [0, 1, 2].map((c) => {
        const ink = MX_PIGMENTS.reduce((sum, k, i) => sum + MX_PIGMENT_TABLE[k].rgb[c] * p[i], 0) / total;
        return Math.round(MX_PAPER[c] * (1 - density) + ink * density);
      });
    }

    /* 纯函数：两种颜色的色差（0–100%） */
    function mxDistance(a, b) {
      return (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 441.673) * 100;
    }

    function mxTargetColor(ink) {
      return mxMix(MX_INK_TABLE[ink].parts);
    }

    function mxCss(rgb) {
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    function mxPourFeedback(ink, method) {
      return `${MX_INK_TABLE[ink].title}：${MX_METHOD_TABLE[method].result}`;
    }

    function defaultInkMixing() {
      const latest = {};
      MX_INKS.forEach((b) => { latest[b] = ''; });
      return {
        version: INK_MIXING_VERSION,
        visited: { room: false, dish: false, court: false },
        draft: { ink: '', method: 'rough' },
        mixes: [],
        courtOutcomes: [],
        mixRuns: 0,
        courtRuns: 0,
        latestMethodByInk: latest,
        lastOutcome: '',
        activeApprentice: null,
        pending: null,
      };
    }

    function clampMxCount(n) {
      const v = Math.floor(Number(n));
      return Number.isFinite(v) ? Math.min(9999, Math.max(0, v)) : 0;
    }

    function normalizeInkMixing(raw) {
      const d = defaultInkMixing();
      if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== INK_MIXING_VERSION) return d;
      const v = raw.visited && typeof raw.visited === 'object' ? raw.visited : {};
      d.visited = { room: v.room === true, dish: v.dish === true, court: v.court === true };
      const dr = raw.draft && typeof raw.draft === 'object' ? raw.draft : {};
      d.draft = { ink: MX_INKS.includes(dr.ink) ? dr.ink : '', method: MX_METHODS.includes(dr.method) ? dr.method : 'rough' };
      const mixes = new Set(Array.isArray(raw.mixes) ? raw.mixes : []);
      d.mixes = MX_MIX_IDS.filter((id) => mixes.has(id));
      const outcomes = new Set(Array.isArray(raw.courtOutcomes) ? raw.courtOutcomes : []);
      d.courtOutcomes = MX_VERDICT_OUTCOME_IDS.filter((id) => outcomes.has(id));
      d.mixRuns = clampMxCount(raw.mixRuns);
      d.courtRuns = clampMxCount(raw.courtRuns);
      const latest = raw.latestMethodByInk && typeof raw.latestMethodByInk === 'object' ? raw.latestMethodByInk : {};
      MX_INKS.forEach((b) => {
        d.latestMethodByInk[b] = MX_METHODS.includes(latest[b]) && d.mixes.includes(`${b}:${latest[b]}`) ? latest[b] : '';
      });
      if (typeof raw.lastOutcome === 'string' && (d.mixes.includes(raw.lastOutcome) || d.courtOutcomes.includes(raw.lastOutcome))) d.lastOutcome = raw.lastOutcome;
      const a = raw.activeApprentice;
      if (a && typeof a === 'object' && !Array.isArray(a) && Object.keys(a).length === 1 && d.mixes.includes(a.mix)) d.activeApprentice = { mix: a.mix };
      d.pending = normalizeMxPending(raw.pending, d);
      return d;
    }

    function mxCourtProgress(st) {
      const inks = new Set();
      const methods = new Set();
      st.mixes.forEach((id) => {
        const [ink, method] = id.split(':');
        inks.add(ink);
        methods.add(method);
      });
      return { inks: inks.size, methods: methods.size };
    }

    function mxCourtEligible(st) {
      const p = mxCourtProgress(st);
      return p.inks === MX_INKS.length && p.methods === MX_METHODS.length;
    }

    function expectedMxPending(p, st) {
      const clean = !st.activeApprentice;
      switch (p.kind) {
        case 'entry':
          return clean ? { feedback: MX_ENTRY_FEEDBACK, kind: 'entry', target: MX_ROOM } : null;
        case 'ink': {
          const b = MX_INK_TABLE[p.ink];
          if (!b || !clean) return null;
          return { ink: p.ink, feedback: b.feedback, kind: 'ink', source: MX_ROOM, target: MX_DISH };
        }
        case 'pour': {
          const b = MX_INK_TABLE[p.ink];
          if (!b || !MX_METHOD_TABLE[p.method] || !clean || st.draft.ink !== p.ink || st.draft.method !== p.method) return null;
          return { ink: p.ink, feedback: mxPourFeedback(p.ink, p.method), kind: 'pour', method: p.method, mix: `${p.ink}:${p.method}`, source: MX_DISH, target: b.target };
        }
        case 'abandon':
          return st.draft.ink ? { feedback: MX_ABANDON_FEEDBACK, kind: 'abandon', source: MX_DISH, target: MX_ROOM } : null;
        case 'apprentice-return': {
          if (!st.activeApprentice) return null;
          const ink = st.activeApprentice.mix.split(':')[0];
          return { feedback: MX_APPRENTICE_RETURN_FEEDBACK, from: MX_INK_TABLE[ink].target, kind: 'apprentice-return', mix: st.activeApprentice.mix, target: MX_ROOM };
        }
        case 'court-entry':
          return clean && mxCourtEligible(st) ? { feedback: MX_COURT_ENTRY_FEEDBACK, kind: 'court-entry', target: MX_COURT } : null;
        case 'verdict': {
          const a = MX_VERDICT_TABLE[p.action];
          if (!a || !clean || !st.visited.court || !mxCourtEligible(st)) return null;
          return { action: p.action, feedback: a.feedback, kind: 'verdict', outcome: a.outcome, source: MX_COURT, target: a.target };
        }
        default:
          return null;
      }
    }

    function normalizeMxPending(p, st) {
      if (!p || typeof p !== 'object' || Array.isArray(p) || typeof p.kind !== 'string') return null;
      const expected = expectedMxPending(p, st);
      if (!expected) return null;
      const keys = Object.keys(p).sort();
      const want = Object.keys(expected).sort();
      if (keys.length !== want.length || keys.some((k, i) => k !== want[i] || p[k] !== expected[k])) return null;
      return expected;
    }

    return Object.freeze({
      mxMix,
      mxDistance,
      mxTargetColor,
      mxCss,
      mxPourFeedback,
      defaultInkMixing,
      clampMxCount,
      normalizeInkMixing,
      mxCourtProgress,
      mxCourtEligible,
      expectedMxPending,
      normalizeMxPending,
    });
  }

  root.GoddeadInkRules = Object.freeze({ create });
})(globalThis);
