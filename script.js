/* ============================================================
   GODDEAD — 神已死，门犹在
   场景探索 / 氛围音引擎 / 门与敲门 / 低语轮替 / 守则异变 / 焚献祷告 / 彩蛋群
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const body = document.body;

  /* ---------- 安全读写 ---------- */
  const store = {
    get(key, fallback) {
      try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* 遗忘也是一种重量 */ }
    },
  };

  /* ---------- 状态 ---------- */
  let awake = store.get("goddead_awake", "false") === "true";
  let arrivals = Number(store.get("goddead_arrivals", "0")) || 0;
  let fragments = Number(store.get("goddead_fragment_count", "0")) || 0;

  let gstate = {};
  try { gstate = JSON.parse(store.get("goddead_state", "{}")) || {}; } catch { gstate = {}; }
  gstate.prayersOffered = Number(gstate.prayersOffered) || 0;

  const corruptionOf = () =>
    Math.min(100, fragments * 1.5 + gstate.prayersOffered * 3 + arrivals * 0.5);

  const saveState = () => {
    gstate.corruption = corruptionOf();
    store.set("goddead_state", JSON.stringify(gstate));
  };

  /* ============================================================
     v28 神圣平衡与代理神明协议 (Governance & Divine Balance)
     ============================================================ */
  const GOV_KEY = "goddead_v28_governance";
  const VALID_ENDINGS = ["ascension", "madness", "oblivion", "nightwatch"];
  const RULING_DELTAS = {
    acting: {
      A: { E: 20, A: -15, R: 15 },
      B: { E: -15, A: 10, R: -5 }
    },
    offering: {
      A: { E: -15, A: 25, R: -10 },
      B: { E: 20, A: -20, R: 20 }
    },
    reliquary: {
      A: { E: 10, A: 10, R: -15 },
      B: { E: -20, A: -20, R: 40 }
    }
  };

  const RULING_CONSEQUENCES = {
    acting: {
      A: "【甲】你接管了代行权能。灵质升华 (+20)，灰烬被驱散 (-15)，虚空共鸣激荡 (+15)。",
      B: "【乙】你选择默默值守。灵质衰退 (-15)，灰烬略微凝聚 (+10)，共鸣归于平静 (-5)。"
    },
    offering: {
      A: "【甲】你将祷词彻底摧毁。灵质流失 (-15)，灰烬剧烈堆积 (+25)，共鸣被封印 (-10)。",
      B: "【乙】你提炼了祷告的余响。灵质充盈 (+20)，灰烬在烈焰中消散 (-20)，共鸣爆发 (+20)。"
    },
    reliquary: {
      A: "【甲】你将遗物归入永久档案。灵质与灰烬微增 (+10, +10)，万魂共鸣被压制 (-15)。",
      B: "【乙】你解封了遗物中的绝响。灵质与灰烬剧烈溃散 (-20, -20)，万魂共鸣彻底苏醒 (+40)。"
    }
  };

  const parseAndValidateGovernance = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(GOV_KEY, "{}")) || {};
    } catch { raw = {}; }

    const version = 28;
    const cycleCount = typeof raw.cycleCount === "number" && raw.cycleCount >= 1 ? Math.floor(raw.cycleCount) : 1;
    const hudUnlocked = raw.hudUnlocked === true;

    let unlockedEndings = [];
    if (Array.isArray(raw.unlockedEndings)) {
      unlockedEndings = [...new Set(raw.unlockedEndings)].filter((id) => VALID_ENDINGS.includes(id));
    }

    const rawRulings = raw.rulings && typeof raw.rulings === "object" ? raw.rulings : {};
    const rulings = { acting: null, offering: null, reliquary: null };

    if (rawRulings.acting === "A" || rawRulings.acting === "B") {
      rulings.acting = rawRulings.acting;
      if (rawRulings.offering === "A" || rawRulings.offering === "B") {
        rulings.offering = rawRulings.offering;
        if (rawRulings.reliquary === "A" || rawRulings.reliquary === "B") {
          rulings.reliquary = rawRulings.reliquary;
        }
      }
    }

    let res = { E: 50, A: 50, R: 20 };
    const clamp = (val) => Math.max(0, Math.min(100, val));

    for (const sceneKey of ["acting", "offering", "reliquary"]) {
      const choice = rulings[sceneKey];
      if (choice && RULING_DELTAS[sceneKey][choice]) {
        const d = RULING_DELTAS[sceneKey][choice];
        res.E = clamp(res.E + d.E);
        res.A = clamp(res.A + d.A);
        res.R = clamp(res.R + d.R);
      }
    }

    let resultStatus = null;
    if (res.E <= 0 || res.A <= 0 || res.R >= 100) {
      resultStatus = "collapse";
    } else if (rulings.acting && rulings.offering && rulings.reliquary) {
      if (res.E >= 70 && res.E > res.A && res.E > res.R) {
        resultStatus = "ascension";
      } else if (res.R >= 50 && res.R >= res.E && res.R >= res.A) {
        resultStatus = "madness";
      } else if (res.A >= 60 && res.A > res.E) {
        resultStatus = "oblivion";
      } else {
        resultStatus = "nightwatch";
      }
    }

    if (resultStatus && VALID_ENDINGS.includes(resultStatus) && !unlockedEndings.includes(resultStatus)) {
      unlockedEndings.push(resultStatus);
    }

    return {
      version,
      cycleCount,
      resources: res,
      rulings,
      resultStatus,
      unlockedEndings,
      hudUnlocked,
    };
  };

  const saveGovernance = (st) => store.set(GOV_KEY, JSON.stringify(st));

  /* ---------- 神圣遗物科状态与契约 ---------- */
  const getRelic = () => {
    try {
      const parsed = JSON.parse(store.get("goddead_reliquary", "{}"));
      return {
        items: Array.isArray(parsed.items) && parsed.items.length === 3
          ? [Boolean(parsed.items[0]), Boolean(parsed.items[1]), Boolean(parsed.items[2])]
          : [false, false, false],
        sealed: Boolean(parsed.sealed),
        sealedAt: Number(parsed.sealedAt) || 0,
      };
    } catch {
      return { items: [false, false, false], sealed: false, sealedAt: 0 };
    }
  };

  const saveRelic = (data) => {
    store.set("goddead_reliquary", JSON.stringify(data));
  };

  const reliquaryUnlocked = () =>
    watchUnlocked() &&
    line4Unlocked() &&
    getLine4().connected &&
    getDL().accepted &&
    getCancel().refused &&
    getActing().appointed &&
    (gstate.prayersOffered > 0);

  /* ---------- 元素 ---------- */
  const statusLine = $("#status-line");
  const message = $("#arrival-message");
  const menu = $("#ritual-menu");
  const menuTrigger = $("#menu-trigger");
  const menuClose = $("#menu-close");
  const soundToggle = $("#sound-toggle");
  const crossMark = $("#cross-mark");
  const arrivalCount = $("#arrival-count");
  const reliquaryLink = $("#reliquary-link");
  const reliquarySlot = $("#reliquary-slot");
  const gateReliquary = $("#gate-reliquary");
  const doorScene = $("#door-scene");
  const doorBtn = $("#door-btn");
  const doorImg = $("#door-img");
  const doorOpenImg = $("#door-open-img");
  const seamWhisper = $("#seam-whisper");
  const heroArt = $("#hero-art");
  const veil = $("#scene-veil");
  const rulesCount = $("#rules-count");
  const ruleSevenNote = $("#rule-seven-note");
  const bandsEl = $("#bands");
  const prayerInput = $("#prayer-input");
  const prayerOffer = $("#prayer-offer");
  const prayerResponse = $("#prayer-response");
  const offeringFigure = $(".offering-figure");
  const burnLayer = $("#burn-layer");

  const toast = (text) => {
    message.textContent = text;
    message.classList.remove("show");
    void message.offsetWidth;
    message.classList.add("show");
  };

  /* ============================================================
     氛围音引擎（WebAudio 合成：低鸣 / 敲门 / 低钟 / 风声）
     ============================================================ */
  const AudioEngine = (() => {
    let ctx = null;
    let master = null;
    let ready = false;
    let muted = store.get("goddead_muted", "false") === "true";

    const noiseBuffer = (seconds) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
      return buf;
    };

    const ensure = () => {
      if (ready) {
        if (ctx && ctx.state === "suspended") ctx.resume();
        return;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);

      /* 低鸣：两个微失谐的低频正弦 + 棕噪声，滤波缓慢呼吸 */
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 240;
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.05;
      [54, 54.45].forEach((f) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        o.connect(droneGain);
        o.start();
      });
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer(3);
      noise.loop = true;
      const nGain = ctx.createGain();
      nGain.gain.value = 0.012;
      noise.connect(nGain);
      nGain.connect(filter);
      droneGain.connect(filter);
      filter.connect(master);
      noise.start();
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 90;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      ready = true;
    };

    const knock = (vol = 0.5) => {
      if (!ready) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(105, t);
      o.frequency.exponentialRampToValueAtTime(38, t + 0.16);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.25);
    };

    const bell = (base = 96) => {
      if (!ready) return;
      const t = ctx.currentTime;
      [1, 1.5, 2.02].forEach((m, i) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = base * m;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.11 / (i + 1), t);
        g.gain.exponentialRampToValueAtTime(0.0008, t + 2.6);
        o.connect(g);
        g.connect(master);
        o.start(t);
        o.stop(t + 2.7);
      });
    };

    const whoosh = () => {
      if (!ready) return;
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(1);
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 1.2;
      f.frequency.setValueAtTime(240, t);
      f.frequency.exponentialRampToValueAtTime(920, t + 0.45);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);
      src.connect(f);
      f.connect(g);
      g.connect(master);
      src.start(t);
      src.stop(t + 0.7);
    };

    /* 钟针反向时的轻响 */
    const tick = () => {
      if (!ready) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = 1900;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.035, t);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.045);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.05);
    };

    /* 日光灯低鸣：120Hz 锯齿 + 高频噪点 + 快速小幅闪动，只在值夜室供电 */
    let humNodes = null;
    const hum = (on) => {
      if (!ready) return;
      if (on && !humNodes) {
        const t = ctx.currentTime;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.011, t + 1.8);
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = 120;
        const og = ctx.createGain();
        og.gain.value = 0.35;
        const hiss = ctx.createBufferSource();
        hiss.buffer = noiseBuffer(2);
        hiss.loop = true;
        const hf = ctx.createBiquadFilter();
        hf.type = "highpass";
        hf.frequency.value = 5200;
        const hg = ctx.createGain();
        hg.gain.value = 0.12;
        const flicker = ctx.createOscillator();
        flicker.type = "square";
        flicker.frequency.value = 13;
        const fg = ctx.createGain();
        fg.gain.value = 0.0035;
        flicker.connect(fg);
        fg.connect(g.gain);
        o.connect(og);
        og.connect(g);
        hiss.connect(hf);
        hf.connect(hg);
        hg.connect(g);
        g.connect(master);
        o.start(t);
        hiss.start(t);
        flicker.start(t);
        humNodes = { o, hiss, flicker, g };
      } else if (!on && humNodes) {
        const t = ctx.currentTime;
        const nodes = humNodes;
        humNodes = null;
        nodes.g.gain.cancelScheduledValues(t);
        nodes.g.gain.setValueAtTime(nodes.g.gain.value, t);
        nodes.g.gain.linearRampToValueAtTime(0.0001, t + 0.7);
        setTimeout(() => {
          nodes.o.stop();
          nodes.hiss.stop();
          nodes.flicker.stop();
          nodes.g.disconnect();
        }, 900);
      }
    };

    /* 极远处的电话铃：双音轮响两轮，只响一次；vol 可调更远的铃 */
    const phoneRing = (vol = 1) => {
      if (!ready) return;
      const t0 = ctx.currentTime;
      for (let round = 0; round < 2; round++) {
        for (let i = 0; i < 10; i++) {
          const t = t0 + round * 1.1 + i * 0.055;
          const o = ctx.createOscillator();
          o.type = "sine";
          o.frequency.value = i % 2 === 0 ? 941 : 1183;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.016 * vol, t + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0008, t + 0.05);
          o.connect(g);
          g.connect(master);
          o.start(t);
          o.stop(t + 0.06);
        }
      }
    };

    /* 插头触点：一下很轻的接触声，接线时响 */
    const plug = () => {
      if (!ready) return;
      const t = ctx.currentTime;
      [0, 0.045].forEach((dt, i) => {
        const o = ctx.createOscillator();
        o.type = "square";
        o.frequency.setValueAtTime(i === 0 ? 1350 : 640, t + dt);
        o.frequency.exponentialRampToValueAtTime(190, t + dt + 0.03);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.028 / (i + 1), t + dt);
        g.gain.exponentialRampToValueAtTime(0.0006, t + dt + 0.05);
        o.connect(g);
        g.connect(master);
        o.start(t + dt);
        o.stop(t + dt + 0.06);
      });
    };

    /* 气送管：一团被吸走的空气，高音滑向低处，很轻 */
    const tube = (vol = 1) => {
      if (!ready) return;
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(1);
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 2.2;
      f.frequency.setValueAtTime(1400, t);
      f.frequency.exponentialRampToValueAtTime(260, t + 0.5);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05 * vol, t + 0.12);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      src.connect(f);
      f.connect(g);
      g.connect(master);
      src.start(t);
      src.stop(t + 0.7);
    };

    /* 印章：一记闷头落下的章，低频一击 + 极短的纸面噪声 */
    const stamp = () => {
      if (!ready) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(46, t + 0.1);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.11, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.2);
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(0.2);
      const hf = ctx.createBiquadFilter();
      hf.type = "lowpass";
      hf.frequency.value = 900;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.03, t);
      ng.gain.exponentialRampToValueAtTime(0.0006, t + 0.07);
      src.connect(hf);
      hf.connect(ng);
      ng.connect(master);
      src.start(t);
      src.stop(t + 0.1);
    };

    /* 检索走卡：两三下很轻的机械触点，像卡片被拖过读卡口，检索时响 */
    const type = () => {
      if (!ready) return;
      const t = ctx.currentTime;
      [0, 0.07, 0.16].forEach((dt, i) => {
        const o = ctx.createOscillator();
        o.type = "square";
        o.frequency.setValueAtTime(1750 - i * 320, t + dt);
        o.frequency.exponentialRampToValueAtTime(320, t + dt + 0.025);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.02 / (i + 1), t + dt);
        g.gain.exponentialRampToValueAtTime(0.0005, t + dt + 0.04);
        o.connect(g);
        g.connect(master);
        o.start(t + dt);
        o.stop(t + dt + 0.05);
      });
    };

    /* 代神席电闸：机械闸刀摩擦 + 触点敲击，节流 */
    const switchFriction = (() => {
      let last = 0;
      return () => {
        if (!ready) return;
        const now = performance.now();
        if (now - last < 45) return;
        last = now;
        const t = ctx.currentTime;
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer(0.08);
        const f = ctx.createBiquadFilter();
        f.type = "bandpass";
        f.Q.value = 2.5;
        f.frequency.setValueAtTime(620, t);
        f.frequency.exponentialRampToValueAtTime(180, t + 0.07);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.018, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        src.connect(f);
        f.connect(g);
        g.connect(master);
        src.start(t);
        src.stop(t + 0.09);
      };
    })();

    const switchContact = (() => {
      let last = 0;
      return () => {
        if (!ready) return;
        const now = performance.now();
        if (now - last < 60) return;
        last = now;
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        o.type = "square";
        o.frequency.setValueAtTime(840, t);
        o.frequency.exponentialRampToValueAtTime(210, t + 0.02);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.012, t);
        g.gain.exponentialRampToValueAtTime(0.0003, t + 0.03);
        o.connect(g);
        g.connect(master);
        o.start(t);
        o.stop(t + 0.035);
      };
    })();

    /* 继电器锁定：低沉一击 */
    const relayLock = () => {
      if (!ready) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(92, t);
      o.frequency.exponentialRampToValueAtTime(36, t + 0.18);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.14, t);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.22);
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 320;
      o.connect(f);
      f.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.26);
      /* 触点颤音 */
      [0, 0.03, 0.07].forEach((dt, i) => {
        const c = ctx.createOscillator();
        c.type = "square";
        c.frequency.value = 450 - i * 90;
        const cg = ctx.createGain();
        cg.gain.setValueAtTime(0.008 / (i + 1), t + dt);
        cg.gain.exponentialRampToValueAtTime(0.0002, t + dt + 0.04);
        c.connect(cg);
        cg.connect(master);
        c.start(t + dt);
        c.stop(t + dt + 0.05);
      });
    };

    /* 线路底噪：极轻的带通噪声，缓慢起伏，只在交换台供电 */
    let lineNodes = null;
    const lineNoise = (on) => {
      if (!ready) return;
      if (on && !lineNodes) {
        const t = ctx.currentTime;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.007, t + 2.2);
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer(3);
        src.loop = true;
        const bf = ctx.createBiquadFilter();
        bf.type = "bandpass";
        bf.frequency.value = 820;
        bf.Q.value = 0.7;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.11;
        const lg = ctx.createGain();
        lg.gain.value = 0.003;
        lfo.connect(lg);
        lg.connect(g.gain);
        src.connect(bf);
        bf.connect(g);
        g.connect(master);
        src.start(t);
        lfo.start(t);
        lineNodes = { src, lfo, g };
      } else if (!on && lineNodes) {
        const t = ctx.currentTime;
        const nodes = lineNodes;
        lineNodes = null;
        nodes.g.gain.cancelScheduledValues(t);
        nodes.g.gain.setValueAtTime(nodes.g.gain.value, t);
        nodes.g.gain.linearRampToValueAtTime(0.0001, t + 0.6);
        setTimeout(() => {
          nodes.src.stop();
          nodes.lfo.stop();
          nodes.g.disconnect();
        }, 800);
      }
    };

    const toggle = () => {
      muted = !muted;
      store.set("goddead_muted", String(muted));
      if (ready && master) {
        master.gain.linearRampToValueAtTime(muted ? 0 : 1, ctx.currentTime + 0.3);
      }
      return muted;
    };

    /* 金属重压/卡扣声：审查压印遗物时响 */
    const clamp = () => {
      if (!ready) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.setValueAtTime(180, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.12);
    };

    return {
      ensure, knock, bell, whoosh, tick, hum, phoneRing, plug, tube, stamp, type, clamp, lineNoise,
      switchFriction, switchContact, relayLock, toggle,
      get muted() { return muted; },
    };
  })();

  window.addEventListener("pointerdown", () => AudioEngine.ensure(), { once: true });
  window.addEventListener("keydown", () => AudioEngine.ensure(), { once: true });

  const paintSoundToggle = () => {
    soundToggle.textContent = AudioEngine.muted ? "默" : "声";
    soundToggle.classList.toggle("muted", AudioEngine.muted);
    soundToggle.setAttribute("aria-label", AudioEngine.muted ? "打开声音" : "关闭声音");
  };
  soundToggle.addEventListener("click", () => {
    AudioEngine.ensure();
    const muted = AudioEngine.toggle();
    paintSoundToggle();
    toast(muted ? "声音沉下去了。" : "它又开始低鸣。");
  });
  paintSoundToggle();

  /* ============================================================
     灰烬粒子场
     ============================================================ */
  const canvas = $("#ash-field");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const mouse = { x: -9999, y: -9999 };
  const ashes = [];
  const bursts = [];
  const rings = [];

  const resizeCanvas = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resizeCanvas();

  const makeAsh = () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 0.5 + Math.random() * 1.6,
    vx: (Math.random() - 0.5) * 0.12,
    vy: -(0.06 + Math.random() * 0.22),
    phase: Math.random() * Math.PI * 2,
    ps: 0.002 + Math.random() * 0.01,
    alpha: 0.08 + Math.random() * 0.22,
    ember: Math.random() < 0.12,
  });

  for (let i = 0; i < 90; i++) ashes.push(makeAsh());

  const spawnBurst = (x, y, n = 14, gold = false) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 0.8 + Math.random() * 3.2;
      bursts.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 0.6,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        gold: gold || Math.random() < 0.25,
      });
    }
    rings.push({ x, y, r: 6, life: 1 });
  };

  const emberStorm = () => {
    for (let i = 0; i < 140; i++) {
      bursts.push({
        x: Math.random() * W,
        y: -20 - Math.random() * H * 0.4,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1 + Math.random() * 2.6,
        life: 1,
        decay: 0.004 + Math.random() * 0.008,
        gold: Math.random() < 0.5,
      });
    }
  };

  const drawField = () => {
    ctx.clearRect(0, 0, W, H);

    for (const p of ashes) {
      p.phase += p.ps;
      p.x += p.vx + Math.sin(p.phase) * 0.22;
      p.y += p.vy;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 16900) {
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / 130) * 0.7;
        p.x += (dx / d) * f;
        p.y += (dy / d) * f;
      }

      if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
      if (p.x < -8) p.x = W + 8;
      if (p.x > W + 8) p.x = -8;

      if (p.ember) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(141, 43, 39, ${p.alpha * 0.25})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 74, 66, ${p.alpha + 0.25})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(179, 174, 165, ${p.alpha})`;
        ctx.fill();
      }
    }

    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy -= 0.012;
      b.vx *= 0.985;
      b.life -= b.decay;
      if (b.life <= 0 || b.y > H + 30) { bursts.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, 1.1 + b.life * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = b.gold
        ? `rgba(200, 168, 96, ${b.life * 0.85})`
        : `rgba(192, 74, 66, ${b.life * 0.85})`;
      ctx.fill();
    }

    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.r += 2.6;
      r.life -= 0.03;
      if (r.life <= 0) { rings.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(141, 43, 39, ${r.life * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  /* ============================================================
     自定义光标
     ============================================================ */
  const dot = $("#cursor-dot");
  const ringEl = $("#cursor-ring");
  const ringPos = { x: -100, y: -100 };

  if (finePointer && !reduced) {
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      body.classList.add("has-cursor");
      dot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
    }, { passive: true });

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, input, [data-hover]")) body.classList.add("link-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, input, [data-hover]")) body.classList.remove("link-hover");
    });
  }

  /* ============================================================
     场景路由（哈希驱动，一幕一幕探索）
     ============================================================ */

  /* ---------- 统一自动转场调度器：场景作用域、可取消 ----------
     只在玩家主动操作后调度；初始化恢复或直接打开 hash 时不触发。
     普通模式延迟约 0.9–1.36 秒，reduced-motion 缩短到约 0.34 秒。 */
  const AutoAdvance = (() => {
    const timers = new Map();
    const baseDelay = () => reduced ? 350 : 900 + Math.floor(Math.random() * 420);

    const clear = (scene) => {
      const t = timers.get(scene);
      if (t) { clearTimeout(t.id); timers.delete(scene); }
    };

    const clearAll = () => {
      timers.forEach((t) => clearTimeout(t.id));
      timers.clear();
    };

    const schedule = (scene, target, options = {}) => {
      if (!initialRouteDone) return;
      clear(scene);
      const ms = options.delay ?? baseDelay();
      /* 代际令牌：主定时器与看门狗共享同一条记录，
         已触发/已取消后记录不在 timers 里，看门狗自动空转；
         同 scope 的新 timer 是另一条记录，旧看门狗绝不会劫持 */
      const record = { id: 0, target };
      const fire = () => {
        if (timers.get(scene) !== record) return;
        timers.delete(scene);
        if (options.before) options.before();
        goScene(target);
      };
      const id = setTimeout(fire, ms);
      record.id = id;
      timers.set(scene, record);
      /* 看门狗：主定时器丢失时按同一条 fire 兜底 */
      setTimeout(fire, ms + 2000);
      if (options.onSchedule) options.onSchedule(ms);
    };

    return { schedule, clear, clearAll, has: (scene) => timers.has(scene) };
  })();

  const scenes = {};
  $$(".scene").forEach((s) => { scenes[s.dataset.scene] = s; });
  let currentScene = "threshold";
  let veilBusy = false;
  let statsCounted = false;
  let initialRouteDone = false;

  /* 自动转场的会话内消耗标记：只在 timer 真正触发前一刻置 true，
     离场/取消后由 sceneInit 重置，保证回退回来仍能再次主动触发；
     持久状态恢复或直接 hash 进入时不参与判定。 */
  let thresholdConsumed = false;
  let protocolConsumed = false;
  let corridorConsumed = false;
  /* v44：本拍任一残页支线（v29/v44）已被接受时为 true，回场景时复位 */
  let corridorDetourArmed = false;
  let watchConsumed = false;
  /* v45：值夜室入口被接受后为 true（本拍原动作不得改写目的地），回值夜室复位 */
  let watchReliefArmed = false;
  /* v46：交换台旁线入口被接受后为 true（本拍四条 patch 按钮不得迟到写旧状态），回交换台复位 */
  let switchSidetoneArmed = false;
  /* v47：投递所退件后室入口被接受后为 true（本拍三退件按钮与回执不得迟到写旧状态），回投递所复位 */
  let deadletterReturnRoomArmed = false;
  /* v48：注销科留副入口被接受后为 true（本拍检索表单与拒绝按钮不得迟到写旧状态），回注销科复位 */
  let cancellationCopyArmed = false;
  let cancellationConsumed = false;
  let actingConsumed = false;
  let offeringConsumed = false;
  let reliquaryConsumed = false;

  const revealScene = (scene) => {
    const els = scene.querySelectorAll(".reveal:not(.in)");
    els.forEach((el, i) => setTimeout(() => el.classList.add("in"), 140 + i * 130));
  };

  const sceneInit = (name) => {
    const scene = scenes[name];
    document.title = scene.dataset.title || "Goddead";
    revealScene(scene);
    if (name === "threshold") { thresholdConsumed = false; syncDoorOpenState(); }
    if (name === "protocol") { protocolConsumed = false; startAnomaly(); syncDriftEntry(); }
    if (name === "corridor") { corridorConsumed = false; corridorDetourArmed = false; syncWatchDoor(); syncBranchEntries(); syncDeepEntries(); startTrace(); }
    if (BRANCH_SCENES.includes(name)) enterBranch(name);
    if (DEEP_SCENES.includes(name)) enterDeep(name);
    if (FORECOURT_SCENES.includes(name)) enterForecourt(name);
    if (ANNEX_SCENES.includes(name)) enterAnnex(name);
    if (name === "annex-clearinghouse") enterClearinghouse();
    if (SETTLE_RESULT_SCENES.includes(SETTLE_NAME_SCENE[name])) enterSettleResult(SETTLE_NAME_SCENE[name]);
    if (name === "anomaly-review") enterReview();
    if (REVIEW_RESULT_SCENES.includes(name)) enterReviewResult(name);
    if (name === "unclaimed-valuation") enterValuation();
    if (name === "quota-elevator") enterElevator();
    if (name === "unnumbered-floor") enterFloor();
    if (FLOOR_DUTY_SCENES.includes(name)) enterFloorRoom(name);
    if (name === "night-shift-registry") enterRegistry();
    if (name === "midnight-callback") enterCallback();
    if (name === "proxy-admission") enterProxy();
    if (name === "return-audit") enterAudit();
    if (AUDIT_ROUTE_SCENES.includes(name)) enterAuditRoute(name);
    if (LATERAL_SCENE_NAMES.includes(name)) enterLateral(LATERAL_NAME_SCENE[name]);
    if (BACKROOM_SCENE_NAMES.includes(name)) enterBackroom(BACKROOM_NAME_SCENE[name]);
    if (name === "protocol-drift") enterDrift();
    if (KNOCK_SCENE_NAMES.includes(name)) enterKnockNet(KNOCK_NAME_SCENE[name]);
    if (PAPERBACK_SCENE_NAMES.includes(name)) enterPaperback(PAPERBACK_NAME_SCENE[name]);
    if (name === "watch") { watchConsumed = false; watchReliefArmed = false; enterWatch(); }
    if (RELIEF_SCENE_NAMES.includes(name)) enterRelief(RELIEF_NAME_SCENE[name]);
    if (SIDETONE_SCENE_NAMES.includes(name)) enterSidetone(SIDETONE_NAME_SCENE[name]);
    if (RETURN_ROOM_SCENE_NAMES.includes(name)) enterReturnRoom(RETURN_ROOM_NAME_SCENE[name]);
    if (COPY_SCENE_NAMES.includes(name)) enterCopy(COPY_NAME_SCENE[name]);
    if (name === "switchboard") enterSwitch();
    if (name === "deadletter") enterDeadletter();
    if (name === "cancellation") { cancellationConsumed = false; enterCancel(); }
    if (name === "acting") { actingConsumed = false; enterActing(); }
    if (name === "offering") { offeringConsumed = false; if (offeringFigure) { offeringFigure.classList.remove("ignited"); offeringFigure.setAttribute("aria-label", "一座沉寂的焚献炉"); } syncRulingOfferingUI(); }
    if (name === "reliquary") { reliquaryConsumed = false; enterReliquary(); }
    if (name === "ninth") AudioEngine.bell(58);
    if (name === "remembrance") {
      paintWatch();
      paintLine4();
      paintDeliver();
      paintCancel();
      paintActing();
      paintRelicMemory();
      paintBranchMemory();
      paintDeepMemory();
      paintForecourtMemory();
      paintAnnexMemory();
      paintAnomalyMemory();
      paintValuationMemory();
      paintFloorMemory();
      paintRegistryMemory();
      paintCallbackMemory();
      paintProxyMemory();
      paintAuditMemory();
      paintLateralMemory();
      paintBackroomMemory();
      paintDriftMemory();
      paintKnockNetMemory();
      paintPaperbackMemory();
      paintReliefMemory();
      paintSidetoneMemory();
      paintReturnRoomMemory();
      paintCopyMemory();
      paintSettlementMemory();
      syncGovernanceRemembrance();
      if (!statsCounted) {
        statsCounted = true;
        countUp(numEls.arrivals, arrivals);
        countUp(numEls.fragments, fragments);
        countUp(numEls.prayers, gstate.prayersOffered);
        countUp(numEls.corruption, corruptionOf(), "%", 1);
      }
    }
    updateHudDisplay();
  };

  /* 分层进度守卫：每个场景直接声明自己的全部前置依赖，而不是依赖分支顺序。
     神圣遗物科 = 7 项依赖全备；
     代神席 = 5 项依赖；
     注销科 = 4 项依赖；
     投递所 = 3 项依赖；
     交换台 = 2 项依赖；
     值夜室 = 1 项依赖。
     任一依赖不满足即向依赖链上游归并（reliquary→offering→acting→cancellation→deadletter→switchboard→watch→corridor），
     陈旧/篡改状态也会落到最终可达场景。 */
  const resolveScene = (name) => {
    let target = name;
    if (target === "reliquary" && !reliquaryUnlocked()) target = "offering";
    if (target === "offering" && !(watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted && getCancel().refused && getActing().appointed)) target = "acting";
    if (target === "acting" && !(watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted && getCancel().refused)) target = "cancellation";
    if (target === "cancellation" && !(watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted)) target = "deadletter";
    if (target === "deadletter" && !(watchUnlocked() && line4Unlocked() && getLine4().connected)) target = "switchboard";
    if (target === "switchboard" && !(watchUnlocked() && line4Unlocked())) target = "watch";
    if (target === "watch" && !watchUnlocked()) target = "corridor";

    /* v30 深层守卫：未到访的深层区域直达回退到父支线（先于 v29 守卫执行，
       父支线同样未访问时由下面的 v29 守卫继续拦回走廊，直达不解锁） */
    const depthState = getDepth();
    if (DEEP_SCENES.includes(target) && !depthState.deepVisited[target]) target = DEEP_PARENT[target];

    /* v29 支线守卫：未访问过的支线直达一律落回走廊，干净存档不得越过走廊守卫。
       v39 窄例外：本轮归路核验的中间档 outcome（echoed/pulsed/confessed）是设计的强制落点，
       放行对应的回声/血管/忏悔场景；其余直达仍落回走廊。 */
    const branchState = getBranches();
    const auditGuardState = getAudit();
    if (BRANCH_SCENES.includes(target) && !branchState.visited[target] && AUDIT_BRANCH_OUTCOME[target] !== auditGuardState.outcome) target = "corridor";

    /* v33 结果房守卫：仅本轮 outcome 对应或曾到访时允许直达，否则规范化回复核科；
       复核科本身不设守卫，直接 hash 采用 neutral 顺序。
       v34 破封坠井是设计的强制落点：本轮 v34 outcome 为 breach 时同样放行误报井 */
    const reviewState = getReview();
    const valuationState = getValuation();
    if (target === "evidence-vault" && !(reviewState.outcome === "vault" || reviewState.visited.evidenceVault)) target = "anomaly-review";
    if (target === "false-positive-shaft" && !(reviewState.outcome === "shaft" || reviewState.visited.falsePositiveShaft || valuationState.outcome === "breach")) target = "anomaly-review";

    /* v34 定额电梯守卫：仅本轮 outcome 为 quota 或曾真实到访时允许直达，
       否则规范化回估值室；估值室本身不设守卫，直接 hash 开 neutral 批次。
       v35 缺层电梯高信号落点是设计的强制落点：本轮 v35 outcome 为 high 时放行 */
    const floorState = getFloor();
    if (target === "quota-elevator" && !(valuationState.outcome === "quota" || valuationState.visited.quotaElevator || floorState.outcome === "high")) target = "unclaimed-valuation";

    /* v52 三债结算守卫：总容量（只读 v51 floor(debt/3) 求和）< 3 时结算所直达
       回退闭目档案室；三间结果房只有本轮对应合法结果（settled + outcome 实时
       派生一致）或历史 visit 才准入，否则先回结算所（不够资格再由上一条继续
       回退档案室）。伪造 state 无法越过：outcome 与 allocations 在 getSettlement
       里逐字段重算。 */
    const settleGuard = getSettlement();
    if (SETTLE_NAME_SCENE[target] && SETTLE_RESULT_SCENES.includes(SETTLE_NAME_SCENE[target])) {
      const rk = SETTLE_NAME_SCENE[target];
      if (!((settleGuard.settled && settleGuard.outcome === SETTLE_RESULT_OUTCOME[rk]) || settleGuard.visited[rk])) target = "annex-clearinghouse";
    }
    if (target === "annex-clearinghouse" && !settleUnlocked()) target = "eyelid-archive";

    /* v31 门前守卫（v40 起启用）：未访问过的 v31 场景直达一律落回门外。
       真实路径全部只读放行——v31 热点/守则分流/前段内部动作在点击时持久化 visited，
       v34/v35/v37/v38/v39 落点读各自 outcome/marks；
       v40 侧廊只放行本轮 lastAction 严格对应的唯一目标，其余未访问直达仍守卫 */
    const forecourtGuard = getForecourt();
    if (FORECOURT_SCENES.includes(target) && !forecourtGuard.visited[FORECOURT_VISIT_KEY[target]]) {
      const lateralGuard = getLateral();
      const knockGuard = getKnockNet();
      const paperbackGuard = getPaperback();
      const callbackGuard = getCallback();
      const proxyGuard = getProxy();
      const forecourtAllowed =
        LATERAL_V31_TARGET[lateralGuard.lastAction] === target
        || KNOCK_V31_TARGET[knockGuard.lastAction] === target
        /* v44 唯一窄例外：lastScene=shadow && lastAction=catch 放行回返夹道 */
        || (target === "return-passage" && paperbackGuard.lastScene === "shadow" && paperbackGuard.lastAction === "catch")
        || (target === "return-passage" && (valuationState.outcome === "under" || valuationState.marks.includes("crossedBrokenFloorScale") || floorState.outcome === "debt" || callbackGuard.outcome === "contaminated" || proxyGuard.outcome === "contaminated" || auditGuardState.outcome === "lost"))
        || (target === "peephole-chamber" && (callbackGuard.outcome === "uncertain" || proxyGuard.outcome === "paranoid"))
        || (target === "glyph-niche" && (floorState.marks.includes("brushedMirrorCabinWithOldPlate") || proxyGuard.outcome === "unnamed"))
        /* v52 唯一窄例外：本轮零前登记库「摘下零前空牌」是设计的强制落点，
           其余未访问直达仍守卫 */
        || (target === "glyph-niche" && settleGuard.lastScene === "registry" && settleGuard.lastAction === "plate");
      if (!forecourtAllowed) target = "threshold";
    }

    /* Governance 路由守卫：活动 Cycle 中若缺失前面 Ruling，回退至最早缺失场景 */
    const gov = parseAndValidateGovernance();
    if (gov.hudUnlocked) {
      if ((target === "reliquary" || target === "remembrance") && !gov.rulings.acting) {
        target = "acting";
      } else if ((target === "reliquary" || target === "remembrance") && !gov.rulings.offering) {
        target = "offering";
      }
    }

    /* 地址栏同步到最终落点，避免停在未解锁场景的假状态 */
    if (target !== name && location.hash === "#" + name) {
      history.replaceState(null, "", "#" + target);
    }
    return target;
  };

  /* 可靠聚焦：场景从 visibility:hidden 过渡期间 focus() 会被静默拒绝，
     因此同步首试 + 有界重试验收（document.activeElement 落位即停），
     且目标所属场景不再是 active 时立即放弃，绝不跨场景抢焦点 */
  const focusReliably = (el) => {
    if (!el) return;
    el.setAttribute("tabindex", "-1");
    let tries = 0;
    const attempt = () => {
      const host = el.closest(".scene");
      if (host && !host.classList.contains("active")) return;
      el.focus({ preventScroll: true });
      if (document.activeElement === el) return;
      if (++tries < 12) setTimeout(attempt, 120);
    };
    attempt();
  };

  /* 下一次 goScene 完成后优先聚焦的元素（由 begin / next-cycle / retry 处理器指定） */
  let pendingSceneFocus = null;

  const goScene = (name) => {
    if (!scenes[name] || veilBusy) return;
    name = resolveScene(name);
    if (name === currentScene) return;
    AutoAdvance.clearAll();
    veilBusy = true;
    stopAnomaly();
    stopTrace();
    leaveWatch();
    leaveSwitch();
    leaveDeadletter();
    leaveCancel();
    leaveActing();
    leaveReliquary();
    closeCollapseModal();
    veil.classList.add("on");
    AudioEngine.whoosh();
    let completed = false;
    const complete = () => {
      if (completed) return;
      completed = true;
      const prev = scenes[currentScene];
      if (prev) {
        prev.classList.remove("active");
        prev.scrollTop = 0;
      }
      const next = scenes[name];
      next.classList.add("active");
      currentScene = name;
      sceneInit(name);
      if (location.hash !== "#" + name) location.hash = name;
      next.scrollTop = 0;
      /* 焦点恢复与 veil 收尾必须和场景切换同一拍完成：
         依赖嵌套定时器时，内层定时器一旦丢失就会造成
         veilBusy 永久卡死、veil 常亮与焦点悬空（QA 实测复现） */
      let focusEl = null;
      if (collapseModal && !collapseModal.hasAttribute("hidden") && retryGovernanceBtn) focusEl = retryGovernanceBtn;
      if (!focusEl && pendingSceneFocus && pendingSceneFocus.getClientRects().length > 0) focusEl = pendingSceneFocus;
      pendingSceneFocus = null;
      const title = focusEl || next.querySelector(".sec-title, .ninth-rule, .dead-title");
      if (title) focusReliably(title);
      veil.classList.remove("on");
      veilBusy = false;
    };
    setTimeout(complete, reduced ? 60 : 480);
    /* 看门狗：主转场定时器丢失时兜底完成同一条 complete，路由器永不卡死 */
    setTimeout(complete, reduced ? 600 : 2000);
  };

  const route = () => {
    const name = (location.hash || "#threshold").slice(1);
    goScene(scenes[name] ? name : "threshold");
    initialRouteDone = true;
  };
  window.addEventListener("hashchange", route);

  /* 场景出口按钮 */
  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) goScene(go.dataset.go);
  });

  /* ============================================================
     经文带（滚动速度驱动）
     ============================================================ */
  const bands = $$(".band").map((band) => {
    const track = band.querySelector(".band-track");
    const unit = track.innerHTML;
    let guard = 0;
    while (track.scrollWidth < window.innerWidth * 1.6 && guard < 24) {
      track.innerHTML += unit;
      guard++;
    }
    const doubled = track.innerHTML;
    track.innerHTML = doubled + doubled;
    return {
      el: track,
      dir: Number(band.dataset.dir) || 1,
      offset: 0,
      period: track.scrollWidth / 2 || 1,
      hover: false,
    };
  });

  bandsEl.addEventListener("pointerenter", () => bands.forEach((b) => (b.hover = true)));
  bandsEl.addEventListener("pointerleave", () => bands.forEach((b) => (b.hover = false)));

  let scrollBoost = 0;

  /* 彩蛋：凝视经文 3 秒，显出不属于经文的一句 */
  let gazeTimer = null;
  let phraseFound = false;
  bandsEl.addEventListener("pointerenter", () => {
    if (phraseFound) return;
    gazeTimer = setTimeout(() => {
      phraseFound = true;
      bandsEl.classList.add("revealed");
      toast("经文里混入了一句不是经文的话。");
    }, 3000);
  });
  bandsEl.addEventListener("pointerleave", () => clearTimeout(gazeTimer));

  /* ============================================================
     视差 + 主循环
     ============================================================ */
  const parTarget = { x: 0, y: 0 };
  const par = { x: 0, y: 0 };

  if (finePointer && !reduced) {
    window.addEventListener("mousemove", (e) => {
      parTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
      parTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  const loop = () => {
    drawField();

    if (finePointer) {
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      const s = ringEl.offsetWidth / 2;
      ringEl.style.transform = `translate(${ringPos.x - s}px, ${ringPos.y - s}px)`;

      par.x += (parTarget.x - par.x) * 0.05;
      par.y += (parTarget.y - par.y) * 0.05;
      heroArt.style.transform = `translate3d(${par.x * 18}px, ${par.y * 12}px, 0)`;
      doorScene.style.transform = `translate3d(${par.x * -8}px, ${par.y * -5}px, 0)`;
    }

    for (const b of bands) {
      const speed = (0.42 + scrollBoost) * b.dir * (b.hover ? 0.12 : 1);
      b.offset -= speed;
      if (b.offset <= -b.period) b.offset += b.period;
      if (b.offset > 0) b.offset -= b.period;
      b.el.style.transform = `translate3d(${b.offset}px, 0, 0)`;
    }
    scrollBoost *= 0.94;

    requestAnimationFrame(loop);
  };

  if (reduced) {
    drawField();
  } else {
    requestAnimationFrame(loop);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    resizeCanvas();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      bands.forEach((b) => (b.period = b.el.scrollWidth / 2));
    }, 250);
  });

  /* ============================================================
     门：纪年 / 敲门 / 低语 / 进入
     ============================================================ */
  const DEATH_DATE = new Date("2026-07-02T00:00:00");
  const eraDays = Math.max(1, Math.floor((Date.now() - DEATH_DATE.getTime()) / 86400000) + 1);
  $("#era-line").textContent = `神死后的第 ${eraDays} 天`;

  /* 子夜彩蛋 */
  const midnight = new Date().getHours() === 0;
  if (midnight) body.classList.add("midnight");

  /* 苏醒状态：门在呼吸 */
  const syncAwake = () => {
    body.classList.toggle("awake", awake);
    statusLine.textContent = awake ? "门在呼吸 · 别靠太近" : "门后没有声音 · 暂时";
  };

  /* 门的不规律颤动 */
  const doorPulse = () => {
    doorScene.classList.add("pulse");
    setTimeout(() => doorScene.classList.remove("pulse"), 340);
  };

  if (!reduced) {
    const schedulePulse = () => {
      const wait = awake ? 2600 + Math.random() * 3000 : 5200 + Math.random() * 5600;
      setTimeout(() => { doorPulse(); schedulePulse(); }, wait);
    };
    schedulePulse();
  }

  /* 敲门 */
  const knockReplies = ["咚。", "咚。咚。", "咚。咚。咚。"];
  let knocks = 0;
  let totalKnocks = 0;
  let ajarTimer = null;
  let decayTimer = null;

  const shakeDoor = () => {
    if (reduced) return;
    [doorImg, doorOpenImg].forEach((img) => img.classList.remove("shaken"));
    void doorImg.getBoundingClientRect();
    [doorImg, doorOpenImg].forEach((img) => img.classList.add("shaken"));
  };

  const closeDoor = () => {
    doorScene.classList.remove("ajar", "opened");
    seamWhisper.textContent = "";
  };

  /* 根据持久苏醒状态恢复门的视觉与可访问性：完成后重新进入 threshold，
     门保持打开且可主动触发转场，但不会自行跳转。 */
  const syncDoorOpenState = () => {
    if (awake) {
      doorScene.classList.add("opened");
      doorBtn.setAttribute("aria-label", "门已打开，点击或按 Enter、Space 继续");
    } else {
      doorScene.classList.remove("opened");
      doorBtn.setAttribute("aria-label", "一扇紧闭的门。可以敲门。不建议。");
    }
    /* v43：回到首页时按当前会话敲门数恢复或隐藏回敲窗口 */
    syncCounterKnockWindow();
  };

  const tryScheduleThreshold = () => {
    if (thresholdConsumed) return;
    AutoAdvance.schedule("threshold", "protocol", {
      before: () => { knocks = 0; thresholdConsumed = true; },
      onSchedule: () => toast("门在你身后合上了。"),
    });
  };

  const knock = () => {
    /* v31 首选锁定：任一门前转场（三敲或热点）已排定后，忽略门/热点输入，
       第一条已接受的转场锁定归宿；离场取消后回来仍可正常敲门/再武装 */
    if (AutoAdvance.has("threshold")) return;
    /* 门已打开的状态下，任何主动激活都重新武装转场（用于 timer 被取消后）。 */
    if (doorScene.classList.contains("opened")) {
      shakeDoor();
      AudioEngine.knock();
      tryScheduleThreshold();
      return;
    }

    knocks++;
    totalKnocks++;
    shakeDoor();
    AudioEngine.knock();
    clearTimeout(decayTimer);

    if (knocks >= 4) {
      knocks = 0;
      clearTimeout(ajarTimer);
      closeDoor();
      AutoAdvance.clear("threshold");
      statusLine.textContent = "门后重归安静。它记下了你的节奏。";
      toast("不要敲第四下。");
      syncCounterKnockWindow();
      return;
    }

    statusLine.textContent = knockReplies[knocks - 1];

    if (knocks === 3) {
      doorScene.classList.add("ajar", "opened");
      seamWhisper.textContent = "……进来";
      AudioEngine.bell();
      doorBtn.setAttribute("aria-label", "门已打开，点击或按 Enter、Space 继续");
      if (!awake) {
        awake = true;
        store.set("goddead_awake", "true");
        body.classList.add("awake");
      }
      statusLine.textContent = "门已经开了。你侧身挤了进去。";
      clearTimeout(ajarTimer);
      tryScheduleThreshold();
    } else {
      /* 敲到一半停手，门当作无事发生 */
      decayTimer = setTimeout(() => {
        if (!doorScene.classList.contains("ajar")) {
          knocks = 0;
          syncAwake();
          syncCounterKnockWindow();
        }
      }, 2600);
    }

    /* v43：每次敲门后同步回敲窗口（1/2 显露、3/0 隐藏） */
    syncCounterKnockWindow();

    /* 彩蛋：敲满七下，它敲回来 */
    if (totalKnocks === 7) {
      setTimeout(() => {
        shakeDoor();
        AudioEngine.knock();
        toast("它敲了回来。");
      }, 1600);
    }
  };

  doorBtn.addEventListener("click", knock);
  doorBtn.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      knock();
    }
  });

  /* 低语：画叉的位置，血红色，时隐时现 */
  const whisperSpots = $$(".whisper");
  const whisperPool = [
    "别出声", "祂还在听", "门后没有人", "不要数符号",
    "它在数你", "别回答", "你已经被看见了", "灯灭之前离开",
    "不要敲第四下", "门记得每一张脸", "第七条是假的", "回来",
  ];

  if (reduced) {
    whisperSpots[0].textContent = "别出声";
    whisperSpots[0].classList.add("on");
  } else {
    const revealWhisper = (spot) => {
      const phrase = whisperPool[Math.floor(Math.random() * whisperPool.length)];
      spot.innerHTML = Array.from(phrase)
        .map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`)
        .join("");
      spot.classList.add("on");
      setTimeout(() => {
        spot.classList.remove("on");
        setTimeout(() => { spot.textContent = ""; }, 1400);
      }, 2600 + Math.random() * 2600);
    };

    const cycleWhispers = () => {
      const free = whisperSpots.filter((s) => !s.classList.contains("on"));
      if (free.length) {
        revealWhisper(free.splice(Math.floor(Math.random() * free.length), 1)[0]);
        /* 偶尔两处同时低语 */
        if (Math.random() < 0.4 && free.length) {
          revealWhisper(free[Math.floor(Math.random() * free.length)]);
        }
      }
      setTimeout(cycleWhispers, 1500 + Math.random() * 3200);
    };
    setTimeout(cycleWhispers, 1600);
  }

  /* ============================================================
     文字的异变：页面上的字会自己换一笔
     ============================================================ */
  const corruptPool = "祂死门血肉骨影空哑";

  if (!reduced) {
    let corrupting = false;
    const corruptChar = () => {
      corrupting = false;
      if (document.hidden) return scheduleCorrupt();
      const candidates = $$(".frag, .sec-desc, .ninth-text, .colophon-whisper")
        .filter((el) => el.children.length === 0 && el.textContent.trim().length > 5
          && el.closest(".scene").classList.contains("active"));
      if (!candidates.length) return scheduleCorrupt();
      const el = candidates[Math.floor(Math.random() * candidates.length)];
      const text = el.textContent;
      const i = 1 + Math.floor(Math.random() * (text.length - 2));
      const wrong = corruptPool[Math.floor(Math.random() * corruptPool.length)];
      if (text[i] === wrong) return scheduleCorrupt();
      corrupting = true;
      el.dataset.orig = text;
      el.innerHTML = text.slice(0, i)
        + `<span class="corrupted">${wrong}</span>`
        + text.slice(i + 1);
      setTimeout(() => {
        el.textContent = el.dataset.orig;
        delete el.dataset.orig;
        corrupting = false;
      }, 1300 + Math.random() * 900);
      scheduleCorrupt();
    };
    const scheduleCorrupt = () => {
      setTimeout(corruptChar, 9000 + Math.random() * 14000);
    };
    scheduleCorrupt();
  }

  /* ============================================================
     远处的敲门声（守则其二：假装没有听见）
     ============================================================ */
  const tremble = () => {
    if (reduced) return;
    body.classList.add("tremor");
    setTimeout(() => body.classList.remove("tremor"), 260);
  };

  if (!reduced) {
    const distantKnock = () => {
      if (!document.hidden) {
        tremble();
        AudioEngine.knock(0.13);
        if (Math.random() < 0.35) {
          setTimeout(() => { tremble(); AudioEngine.knock(0.09); }, 700);
        }
      }
      setTimeout(distantKnock, 42000 + Math.random() * 52000);
    };
    setTimeout(distantKnock, 26000 + Math.random() * 20000);
  }

  /* ============================================================
     守则：异变与回应
     ============================================================ */
  let anomalyTimer = null;
  let restoreTimer = null;
  let nineWindow = false;
  let ruleSevenClicks = 0;

  const startAnomaly = () => {
    stopAnomaly();
    if (reduced) return;
    const tick = () => {
      anomalyTimer = setTimeout(() => {
        if (currentScene !== "protocol") return;
        if (Math.random() < 0.65) {
          rulesCount.textContent = "玖";
          rulesCount.classList.add("wrong");
          nineWindow = true;
          restoreTimer = setTimeout(() => {
            rulesCount.textContent = "捌";
            rulesCount.classList.remove("wrong");
            nineWindow = false;
          }, 5200);
        }
        tick();
      }, 7000 + Math.random() * 8000);
    };
    tick();
  };

  const stopAnomaly = () => {
    clearTimeout(anomalyTimer);
    clearTimeout(restoreTimer);
    anomalyTimer = null;
    nineWindow = false;
    if (rulesCount) {
      rulesCount.textContent = "捌";
      rulesCount.classList.remove("wrong");
    }
  };

  rulesCount.addEventListener("click", () => {
    if (nineWindow) {
      nineWindow = false;
      toast("你数出了第九条。它一直在等你数出来。");
      goScene("ninth");
    } else {
      toast("数过了。是捌条。——暂时是捌条。");
    }
  });

  const ruleResponses = {
    1: "你没有听见任何回应。很好。",
    2: "门后没有人。真的没有。",
    3: "九个。你数了，对吧。",
    4: "低语不喜欢被逐字重复。",
    5: "回来的路，你还记得吗？",
    6: "现在几点？你确定吗？",
    7: "别再点这一条了。",
    8: "确认无效。",
  };

  const tryScheduleProtocol = () => {
    if (protocolConsumed) return;
    AutoAdvance.schedule("protocol", "corridor", {
      before: () => { protocolConsumed = true; },
      onSchedule: () => toast("守则已读。走廊在前方。"),
    });
  };

  /* v31 真实分流：其二→回返夹道，其三/其七→失号龛，其四→倒置窥孔；其一保持原主线走廊；
     v37 起其六分流至午夜回拨台；v38 起其八分流至门外代审窗；v39 起其五分流至归路核验站
     （原文与反馈逐字不变，仅目的地变更）。
     「玖」异常走 rulesCount 原逻辑，不被分流覆盖。 */
  const RULE_DETOUR = { 2: "return-passage", 3: "glyph-niche", 4: "peephole-chamber", 5: "return-audit", 6: "midnight-callback", 7: "glyph-niche", 8: "proxy-admission" };

  $$(".rules-list li").forEach((li) => {
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "button");
    const activate = () => {
      /* v31 首选锁定：任一规则已排定转场后，第一条已接受的转场锁定归宿，
         忽略本场景其他规则输入；「玖」异常走 rulesCount 原逻辑，不受此锁影响 */
      if (AutoAdvance.has("protocol")) return;
      const n = li.dataset.rule;
      li.classList.remove("touched");
      void li.offsetWidth;
      li.classList.add("touched");
      AudioEngine.knock();
      if (n === "7") {
        ruleSevenClicks++;
        if (ruleSevenClicks === 3) ruleSevenNote.textContent = "它知道你注意到它了。";
        if (ruleSevenClicks === 6) ruleSevenNote.textContent = "停下。";
        if (ruleSevenClicks >= 9) {
          ruleSevenClicks = 0;
          ruleSevenNote.textContent = "它在看你读这一条。";
          toast("第七条原谅你了。这次。");
          return;
        }
      }
      toast(ruleResponses[n] || "……");
      const detour = RULE_DETOUR[n];
      if (detour) {
        /* v39：其五分流时同时登记核验站入口（entry=protocol，mark answeredProtocolFive） */
        if (n === "5") markAuditEntry("protocol");
        /* v37：其六分流时同时登记回拨台入口（entry=protocol，mark answeredProtocolSix） */
        if (n === "6") markCallbackEntry("protocol");
        /* v38：其八分流时同时登记代审窗入口（entry=protocol，mark answeredProtocolEight） */
        if (n === "8") markProxyEntry("protocol");
        /* v40 守卫配套：分流落点是 v31 场景时，到访标记在点击时立即持久化（同 v31 热点契约） */
        if (FORECOURT_SCENES.includes(detour)) markForecourtVisited(detour);
        /* 分流取代主线 AutoAdvance；首选锁定已保证此处无未触发 timer，
           clear 仅作防御；点击「玖」仍走 goScene("ninth")，clearAll 会取消这里的调度 */
        AutoAdvance.clear("protocol");
        AutoAdvance.schedule("protocol", detour, {
          delay: branchDelay(),
          before: () => { protocolConsumed = true; },
        });
      } else {
        tryScheduleProtocol();
      }
    };
    li.addEventListener("click", activate);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  /* ============================================================
     v29 旁路支线：回声档案室 / 血管维修井 / 忏悔称量室
     状态统一存 goddead_v29_branches，容错旧/坏 JSON；
     只读不写任何 v28 治理与旧主线状态。
     ============================================================ */
  const BRANCH_KEY = "goddead_v29_branches";
  const BRANCH_SCENES = ["echo", "vein", "confession"];
  const getBranches = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(BRANCH_KEY, "{}")) || {};
    } catch { raw = {}; }
    const visited = {};
    const lastChoice = {};
    BRANCH_SCENES.forEach((b) => {
      visited[b] = Boolean(raw.visited && raw.visited[b] === true);
      lastChoice[b] = typeof (raw.lastChoice && raw.lastChoice[b]) === "string" ? raw.lastChoice[b] : null;
    });
    return { visited, lastChoice };
  };
  const saveBranches = (st) => store.set(BRANCH_KEY, JSON.stringify(st));

  /* 分支转场延迟：普通模式约 0.7–1.0 秒，reduced-motion 约 0.3 秒 */
  const branchDelay = () => reduced ? 300 : 700 + Math.floor(Math.random() * 300);

  const BRANCH_META = {
    echo: {
      responseEl: "#echo-response",
      intro: "回声不是说出去的话。档案室的门自己开了。",
      choices: {
        knock: { btn: "#echo-choice-knock", target: "threshold", response: "敲声顺着听筒爬回门外。它认得你的手。" },
        steps: { btn: "#echo-choice-steps", target: "corridor", response: "脚步声一遍比一遍近。你回到了走廊。" },
        /* v30：03:17 的铃改接入失真转接室（深层），值班室出口移到转接室内 */
        bell: { btn: "#echo-choice-bell", target: "echo-transfer", response: "03:17 的铃没有停。它被转接进了一条失真的线路。" },
      },
    },
    vein: {
      responseEl: "#vein-response",
      intro: "墙里的血管在井下交汇。维修井接受了你的登记。",
      choices: {
        down: { btn: "#vein-choice-down", target: "corridor", response: "顺流。血记得下坡的路，你回到了走廊。" },
        up: { btn: "#vein-choice-up", target: "protocol", response: "逆流。守则的第一条开始发痒。" },
        /* v30：隔离闸改接入逆流泵房（深层），值夜室出口移到泵房应急梯 */
        isolate: { btn: "#vein-choice-isolate", target: "vein-pump", response: "隔离阀后面不是井底。是一间仍在工作的泵房。" },
      },
    },
    confession: {
      responseEl: "#confession-response",
      intro: "忏悔不按句计费，按重量。称量室校准了秤。",
      choices: {
        door: { btn: "#confession-choice-door", target: "protocol", response: "秤承认了那三记敲击。守则等你回去。" },
        seven: { btn: "#confession-choice-seven", target: "corridor", response: "第七条被称出了重量。走廊收下这份坦白。" },
        /* v30：拒绝忏悔改登记进无名罪籍库（深层），不再直接跳回声档案室 */
        refuse: { btn: "#confession-choice-refuse", target: "confession-ledger", response: "拒绝也有重量。它被登记进了一册无名的罪籍。" },
      },
    },
  };

  const syncBranchEntries = () => {
    const st = getBranches();
    BRANCH_SCENES.forEach((b) => {
      const entry = $("#branch-entry-" + b);
      const link = $("#" + b + "-link");
      [entry, link].forEach((el) => {
        if (!el) return;
        if (st.visited[b]) el.removeAttribute("hidden");
        else el.setAttribute("hidden", "");
      });
    });
  };

  const paintBranchChoice = (sceneKey) => {
    const meta = BRANCH_META[sceneKey];
    const st = getBranches();
    Object.keys(meta.choices).forEach((ck) => {
      const btn = $(meta.choices[ck].btn);
      if (btn) btn.setAttribute("aria-pressed", st.lastChoice[sceneKey] === ck ? "true" : "false");
    });
  };

  const enterBranch = (sceneKey) => {
    const meta = BRANCH_META[sceneKey];
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = "";
    paintBranchChoice(sceneKey);
  };

  /* 分支选择：点击/键盘激活 → 短反馈 → 自动进入目标；没有第二个必点按钮 */
  const chooseBranch = (sceneKey, choiceKey) => {
    const meta = BRANCH_META[sceneKey];
    const choice = meta.choices[choiceKey];
    if (!choice) return;
    const st = getBranches();
    st.lastChoice[sceneKey] = choiceKey;
    saveBranches(st);
    paintBranchChoice(sceneKey);

    const ok = !choice.guard || choice.guard();
    const target = ok ? choice.target : "corridor";
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = ok ? choice.response : choice.failResponse;
    AudioEngine.knock(0.16);
    /* v30：选择的目标是深层区域时，到访标记在点击时立即持久化（同 v29 残页分流契约） */
    if (DEEP_SCENES.includes(target)) markDeepVisited(target);
    AutoAdvance.schedule(sceneKey, target, { delay: branchDelay() });
  };

  BRANCH_SCENES.forEach((sceneKey) => {
    const meta = BRANCH_META[sceneKey];
    Object.keys(meta.choices).forEach((choiceKey) => {
      const btn = $(meta.choices[choiceKey].btn);
      if (btn) btn.addEventListener("click", () => chooseBranch(sceneKey, choiceKey));
    });
  });

  const paintBranchMemory = () => {
    const memory = $("#branch-memory");
    if (!memory) return;
    const st = getBranches();
    const names = { echo: "回声档案室", vein: "血管维修井", confession: "忏悔称量室" };
    const visitedNames = BRANCH_SCENES.filter((b) => st.visited[b]).map((b) => names[b]);
    if (visitedNames.length === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `你走过 ${visitedNames.length} 条旁路：${visitedNames.join("、")}。主线没有因此变短，但你不再只有一条走廊。`;
    memory.hidden = false;
  };

  /* ============================================================
     v30 深层支线：失真转接室 / 逆流泵房 / 无名罪籍库
     三间二级区域构成可循环三角网络，各保留差异化出口；
     状态独立存 goddead_v30_branch_depth，容错坏 JSON，
     不读不写 v28 治理、v29 支线与旧主线状态。
     ============================================================ */
  const DEPTH_KEY = "goddead_v30_branch_depth";
  const DEEP_SCENES = ["echo-transfer", "vein-pump", "confession-ledger"];
  const DEEP_PARENT = { "echo-transfer": "echo", "vein-pump": "vein", "confession-ledger": "confession" };
  const getDepth = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(DEPTH_KEY, "{}")) || {};
    } catch { raw = {}; }
    const deepVisited = {};
    const lastDeepChoice = {};
    DEEP_SCENES.forEach((d) => {
      deepVisited[d] = Boolean(raw.deepVisited && raw.deepVisited[d] === true);
      lastDeepChoice[d] = typeof (raw.lastDeepChoice && raw.lastDeepChoice[d]) === "string" ? raw.lastDeepChoice[d] : null;
    });
    return { deepVisited, lastDeepChoice };
  };
  const saveDepth = (st) => store.set(DEPTH_KEY, JSON.stringify(st));

  const DEEP_META = {
    "echo-transfer": {
      responseEl: "#echo-transfer-response",
      choices: {
        relay: { btn: "#echo-transfer-choice-relay", target: "vein-pump", response: "失真的语音顺着铜管爬进了血管维护网。" },
        seal: { btn: "#echo-transfer-choice-seal", target: "protocol", response: "你的声音被封进蜡筒。守则背面多了一行空白。" },
        bell: {
          btn: "#echo-transfer-choice-bell", target: "watch", response: "03:17 再次响起。这一回，值班的人接听了。",
          failResponse: "铃声没有找到值班的人。回声把你放回走廊。",
          failTarget: "corridor",
          guard: () => watchUnlocked(),
        },
      },
    },
    "vein-pump": {
      responseEl: "#vein-pump-response",
      choices: {
        release: { btn: "#vein-pump-choice-release", target: "echo-transfer", response: "回声压力泄进了转接室。听筒轻轻发烫。" },
        sediment: { btn: "#vein-pump-choice-sediment", target: "confession-ledger", response: "黑色沉积物沉进罪籍管道。档案页变重了。" },
        ladder: {
          btn: "#vein-pump-choice-ladder", target: "watch", response: "应急梯尽头，是值夜室的地面。",
          failResponse: "应急梯中途断开。你落回了守则的台阶。",
          failTarget: "protocol",
          guard: () => watchUnlocked(),
        },
      },
    },
    "confession-ledger": {
      responseEl: "#confession-ledger-response",
      choices: {
        crossout: { btn: "#ledger-choice-crossout", target: "echo-transfer", response: "划掉的名字没有消失。它变成了一段失真的语音。" },
        archive: { btn: "#ledger-choice-archive", target: "vein-pump", response: "你被归档为仍在场的见证者。泵房开始按你的脉搏运转。" },
        reject: {
          btn: "#ledger-choice-reject", target: () => (watchUnlocked() ? "watch" : "corridor"), response: "整份记录被拒收。三处档案同时咳嗽了一声。",
          failResponse: "记录退回原处。守则替你签收了一行。",
          failTarget: "protocol",
          guard: () => DEEP_SCENES.every((d) => getDepth().deepVisited[d]),
        },
      },
    },
  };

  const syncDeepEntries = () => {
    const st = getDepth();
    DEEP_SCENES.forEach((d) => {
      const entry = $("#branch-entry-" + d);
      const link = $("#" + d + "-link");
      [entry, link].forEach((el) => {
        if (!el) return;
        if (st.deepVisited[d]) el.removeAttribute("hidden");
        else el.setAttribute("hidden", "");
      });
    });
  };

  /* 到访标记在点击时立即持久化：即便转场被回退取消，入口也已出现 */
  const markDeepVisited = (sceneKey) => {
    const st = getDepth();
    if (st.deepVisited[sceneKey]) return;
    st.deepVisited[sceneKey] = true;
    saveDepth(st);
    syncDeepEntries();
  };

  const paintDeepChoice = (sceneKey) => {
    const meta = DEEP_META[sceneKey];
    const st = getDepth();
    Object.keys(meta.choices).forEach((ck) => {
      const btn = $(meta.choices[ck].btn);
      if (btn) btn.setAttribute("aria-pressed", st.lastDeepChoice[sceneKey] === ck ? "true" : "false");
    });
  };

  const enterDeep = (sceneKey) => {
    const meta = DEEP_META[sceneKey];
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = "";
    paintDeepChoice(sceneKey);
  };

  /* 深层选择：点击/键盘激活 → 短反馈 → 自动进入目标；
     条件动作给出差异化出口（watch / corridor / protocol），没有第二个必点按钮 */
  const chooseDeep = (sceneKey, choiceKey) => {
    const meta = DEEP_META[sceneKey];
    const choice = meta.choices[choiceKey];
    if (!choice) return;
    const st = getDepth();
    st.lastDeepChoice[sceneKey] = choiceKey;
    saveDepth(st);
    paintDeepChoice(sceneKey);

    const ok = !choice.guard || choice.guard();
    const target = ok
      ? (typeof choice.target === "function" ? choice.target() : choice.target)
      : (choice.failTarget || "corridor");
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = ok ? choice.response : choice.failResponse;
    AudioEngine.knock(0.16);
    if (DEEP_SCENES.includes(target)) markDeepVisited(target);
    AutoAdvance.schedule(sceneKey, target, { delay: branchDelay() });
  };

  DEEP_SCENES.forEach((sceneKey) => {
    const meta = DEEP_META[sceneKey];
    Object.keys(meta.choices).forEach((choiceKey) => {
      const btn = $(meta.choices[choiceKey].btn);
      if (btn) btn.addEventListener("click", () => chooseDeep(sceneKey, choiceKey));
    });
  });

  const paintDeepMemory = () => {
    const memory = $("#deep-memory");
    if (!memory) return;
    const st = getDepth();
    const names = { "echo-transfer": "失真转接室", "vein-pump": "逆流泵房", "confession-ledger": "无名罪籍库" };
    const visitedNames = DEEP_SCENES.filter((d) => st.deepVisited[d]).map((d) => names[d]);
    if (visitedNames.length === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `你下到了更深的地方：${visitedNames.join("、")}。档案不承认见过你。`;
    memory.hidden = false;
  };

  /* ============================================================
     v31 门前三岔：倒置窥孔 / 失号龛 / 回返夹道
     状态独立存 goddead_v31_forecourt_weave，容错坏 JSON；
     不读不写 v28/v29/v30 与旧主线状态；三个新场景不设解锁门槛，
     干净存档可从门外热点进入，也允许直接 hash 直达（直达即到访）。
     ============================================================ */
  const FORECOURT_KEY = "goddead_v31_forecourt_weave";
  const FORECOURT_SCENES = ["peephole-chamber", "glyph-niche", "return-passage"];
  const FORECOURT_MARKS = [
    "witnessed", "heardInside", "refusedSight",
    "countedNine", "erasedSeven", "tookBlank",
    "followedInward", "knockedInside", "walkedBackward",
  ];
  const FORECOURT_VISIT_KEY = { "peephole-chamber": "peephole", "glyph-niche": "glyph", "return-passage": "returnPassage" };
  const FORECOURT_TRANSITIONS_CAP = 9999;

  const getForecourt = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(FORECOURT_KEY, "{}")) || {};
    } catch { raw = {}; }
    const visited = {};
    Object.values(FORECOURT_VISIT_KEY).forEach((k) => {
      visited[k] = Boolean(raw.visited && raw.visited[k] === true);
    });
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => FORECOURT_MARKS.includes(m)))]
      : [];
    const lastChoice = typeof raw.lastChoice === "string" && FORECOURT_MARKS.includes(raw.lastChoice)
      ? raw.lastChoice
      : null;
    let transitions = Number(raw.transitions);
    if (!Number.isFinite(transitions) || transitions < 0) transitions = 0;
    transitions = Math.min(FORECOURT_TRANSITIONS_CAP, Math.floor(transitions));
    return { visited, marks, lastChoice, transitions };
  };
  const saveForecourt = (st) => store.set(FORECOURT_KEY, JSON.stringify(st));

  const FORECOURT_META = {
    "peephole-chamber": {
      responseEl: "#peephole-response",
      choices: {
        witnessed: { btn: "#peephole-choice-witness", target: "protocol", response: "镜后那只眼，比你晚眨了一次。" },
        heardInside: { btn: "#peephole-choice-listen", target: "return-passage", response: "敲门声从你身后传来。你明明还在门外。" },
        refusedSight: { btn: "#peephole-choice-close", target: "eyelid-archive", response: "黑镜替你继续看着。" },
      },
    },
    "glyph-niche": {
      responseEl: "#glyph-response",
      choices: {
        countedNine: { btn: "#glyph-choice-count", target: "peephole-chamber", response: "你数到九。墙里只回了八声。" },
        erasedSeven: { btn: "#glyph-choice-erase", target: "protocol", response: "第七号消失后，守则多出一行空白。" },
        tookBlank: { btn: "#glyph-choice-blank", target: "unnumbered-vestibule", response: "没有编号的门，为你让出了一条路。" },
      },
    },
    "return-passage": {
      responseEl: "#return-response",
      choices: {
        followedInward: { btn: "#return-choice-follow", target: "glyph-niche", response: "脚印在第七步拐进了墙里。" },
        knockedInside: { btn: "#return-choice-knock", target: "protocol", response: "门外的你，假装没有听见。" },
        walkedBackward: { btn: "#return-choice-backward", target: "reverse-stairwell", response: "你没有转身，却看见走廊迎面而来。" },
      },
    },
  };

  /* 目录入口：首次到访后原子恢复，未访问保持 hidden 不可聚焦 */
  const FORECOURT_LINKS = { "peephole-chamber": "#peephole-link", "glyph-niche": "#glyph-link", "return-passage": "#return-link" };
  const syncForecourtLinks = () => {
    const st = getForecourt();
    FORECOURT_SCENES.forEach((s) => {
      const link = $(FORECOURT_LINKS[s]);
      if (!link) return;
      if (st.visited[FORECOURT_VISIT_KEY[s]]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markForecourtVisited = (sceneKey) => {
    const st = getForecourt();
    const key = FORECOURT_VISIT_KEY[sceneKey];
    if (!key || st.visited[key]) return;
    st.visited[key] = true;
    saveForecourt(st);
    syncForecourtLinks();
  };

  const paintForecourtChoice = (sceneKey) => {
    const meta = FORECOURT_META[sceneKey];
    const st = getForecourt();
    Object.keys(meta.choices).forEach((mark) => {
      const btn = $(meta.choices[mark].btn);
      if (btn) btn.setAttribute("aria-pressed", st.lastChoice === mark ? "true" : "false");
    });
  };

  const enterForecourt = (sceneKey) => {
    markForecourtVisited(sceneKey);
    const meta = FORECOURT_META[sceneKey];
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = "";
    paintForecourtChoice(sceneKey);
    /* v34：未满定额回到回返夹道时展示一次性回流反馈 */
    paintValuationUnderReturn(sceneKey, responseEl);
    /* v35：门债遣返落点一次性反馈；恢复登记所入口的 aria-pressed */
    if (sceneKey === "return-passage") consumeFloorOutcome("debt", responseEl);
    paintFloorEntry(sceneKey);
    /* v37：恢复回拨入口的 aria-pressed */
    paintCallbackEntry(sceneKey);
  };

  /* 前段动作：点击/键盘激活 → 点击时持久化 → 短反馈 → 自动转场；没有第二个继续按钮。
     已有未触发转场时忽略重复激活：marks 不重复、transitions 不重复累计、不重复调度。 */
  const chooseForecourt = (sceneKey, mark) => {
    const meta = FORECOURT_META[sceneKey];
    const choice = meta && meta.choices[mark];
    if (!choice) return;
    if (AutoAdvance.has(sceneKey)) return;
    const st = getForecourt();
    if (!st.marks.includes(mark)) st.marks.push(mark);
    st.lastChoice = mark;
    st.transitions = Math.min(FORECOURT_TRANSITIONS_CAP, st.transitions + 1);
    saveForecourt(st);
    paintForecourtChoice(sceneKey);
    /* v40 守卫配套：前段内部动作的落点同为 v31 场景时，到访标记在点击时立即持久化 */
    if (FORECOURT_SCENES.includes(choice.target)) markForecourtVisited(choice.target);

    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = choice.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, choice.target, { delay: branchDelay() });
  };

  FORECOURT_SCENES.forEach((sceneKey) => {
    const meta = FORECOURT_META[sceneKey];
    Object.keys(meta.choices).forEach((mark) => {
      const btn = $(meta.choices[mark].btn);
      if (btn) btn.addEventListener("click", () => chooseForecourt(sceneKey, mark));
    });
  });

  /* 门外三个热点：干净存档立即可发现。点击即持久化 visited 并计一次改道，
     短反馈后自动转场；已有排队转场（含敲门主路径）时忽略，幂等且不抢门。 */
  const FORECOURT_HOTSPOTS = {
    "hotspot-peephole": { target: "peephole-chamber", note: "日蚀后面，有什么在回看你。" },
    "hotspot-glyph": { target: "glyph-niche", note: "符号少了一个。它让你跟过去数。" },
    "hotspot-return": { target: "return-passage", note: "痕迹在门内侧折返。它等你很久了。" },
  };

  Object.keys(FORECOURT_HOTSPOTS).forEach((id) => {
    const btn = $("#" + id);
    const spot = FORECOURT_HOTSPOTS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (AutoAdvance.has("threshold")) return;
      const st = getForecourt();
      st.visited[FORECOURT_VISIT_KEY[spot.target]] = true;
      st.transitions = Math.min(FORECOURT_TRANSITIONS_CAP, st.transitions + 1);
      saveForecourt(st);
      syncForecourtLinks();
      btn.classList.add("touched");
      setTimeout(() => btn.classList.remove("touched"), 1200);
      AudioEngine.knock();
      statusLine.textContent = spot.note;
      AutoAdvance.schedule("threshold", spot.target, { delay: branchDelay() });
    });
  });

  /* 痕迹页单行：按已访问项显示，保持八张统计卡不变 */
  const paintForecourtMemory = () => {
    const memory = $("#forecourt-memory");
    if (!memory) return;
    const st = getForecourt();
    const names = [];
    if (st.visited.peephole) names.push("窥孔");
    if (st.visited.glyph) names.push("失号龛");
    if (st.visited.returnPassage) names.push("回返夹道");
    if (names.length === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `门前旁路：${names.join(" / ")}；你在门外改道 ${st.transitions} 次。`;
    memory.hidden = false;
  };

  /* ============================================================
     v32 门内副楼：闭目档案室 / 无号前厅 / 逆向阶井
     状态独立存 goddead_v32_inner_annex，容错坏 JSON；
     不读不写 v28/v29/v30/v31 与旧主线状态；三间新房不设解锁门槛，
     直接 hash 进入只记 visited，不自动触发任何动作。
     ============================================================ */
  const ANNEX_KEY = "goddead_v32_inner_annex";
  const ANNEX_SCENES = ["eyelid-archive", "unnumbered-vestibule", "reverse-stairwell"];
  const ANNEX_MARKS = [
    "searchedSealedSight", "heardBoxBlink", "filedOwnShadow",
    "hungBlankOnTenth", "leftPrintInBlankLedger", "choseUnnumberedExit",
    "climbedTowardLowerFloor", "crossedZerothStep", "lookedBackWithoutTurning",
  ];
  const ANNEX_VISIT_KEY = { "eyelid-archive": "eyelidArchive", "unnumbered-vestibule": "unnumberedVestibule", "reverse-stairwell": "reverseStairwell" };
  const ANNEX_TRANSITIONS_CAP = 9999;

  const getAnnex = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(ANNEX_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const visited = {};
    Object.values(ANNEX_VISIT_KEY).forEach((k) => {
      visited[k] = Boolean(raw.visited && raw.visited[k] === true);
    });
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => ANNEX_MARKS.includes(m)))].slice(0, ANNEX_MARKS.length)
      : [];
    const lastChoice = typeof raw.lastChoice === "string" && ANNEX_MARKS.includes(raw.lastChoice)
      ? raw.lastChoice
      : "";
    let transitions = Number(raw.transitions);
    if (!Number.isFinite(transitions) || transitions < 0) transitions = 0;
    transitions = Math.min(ANNEX_TRANSITIONS_CAP, Math.floor(transitions));
    return { visited, marks, lastChoice, transitions };
  };
  const saveAnnex = (st) => store.set(ANNEX_KEY, JSON.stringify(st));

  const ANNEX_META = {
    "eyelid-archive": {
      responseEl: "#eyelid-response",
      choices: {
        searchedSealedSight: { btn: "#eyelid-choice-search", target: "unnumbered-vestibule", response: "抽屉里没有照片，只有一扇尚未编号的门。" },
        heardBoxBlink: { btn: "#eyelid-choice-listen", target: "protocol", response: "盒子每合一次，守则就少承认你一秒。" },
        filedOwnShadow: { btn: "#eyelid-choice-file", target: "threshold", response: "档案柜收下影子，把人退回门外。" },
      },
    },
    "unnumbered-vestibule": {
      responseEl: "#vestibule-response",
      choices: {
        hungBlankOnTenth: { btn: "#vestibule-choice-tenth", target: "reverse-stairwell", response: "前厅只有九扇门。第十扇在你脚下打开。" },
        leftPrintInBlankLedger: { btn: "#vestibule-choice-print", target: "eyelid-archive", response: "台账拒绝姓名，只收录你曾经看过什么。" },
        choseUnnumberedExit: { btn: "#vestibule-choice-exit", target: "corridor", response: "所有门同时退后，只有走廊没有移动。" },
      },
    },
    "reverse-stairwell": {
      responseEl: "#stairwell-response",
      choices: {
        climbedTowardLowerFloor: { btn: "#stairwell-choice-climb", target: "eyelid-archive", response: "你登上七级台阶，抵达一排闭着的眼睑。" },
        crossedZerothStep: { btn: "#stairwell-choice-zeroth", target: "unnumbered-vestibule", response: "第零级没有高度，却把门的编号全部抹掉。" },
        lookedBackWithoutTurning: { btn: "#stairwell-choice-lookback", target: "protocol", response: "守则从背后念出你的正面。" },
      },
    },
  };

  /* 目录入口：首次到访后原子恢复，未访问保持 hidden 不可聚焦 */
  const ANNEX_LINKS = { "eyelid-archive": "#eyelid-link", "unnumbered-vestibule": "#vestibule-link", "reverse-stairwell": "#stairwell-link" };
  const syncAnnexLinks = () => {
    const st = getAnnex();
    ANNEX_SCENES.forEach((s) => {
      const link = $(ANNEX_LINKS[s]);
      if (!link) return;
      if (st.visited[ANNEX_VISIT_KEY[s]]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记：首次真正进入（含直接 hash）立即持久化 */
  const markAnnexVisited = (sceneKey) => {
    const st = getAnnex();
    const key = ANNEX_VISIT_KEY[sceneKey];
    if (!key || st.visited[key]) return;
    st.visited[key] = true;
    saveAnnex(st);
    syncAnnexLinks();
  };

  const paintAnnexChoice = (sceneKey) => {
    const meta = ANNEX_META[sceneKey];
    const st = getAnnex();
    Object.keys(meta.choices).forEach((mark) => {
      const btn = $(meta.choices[mark].btn);
      if (btn) btn.setAttribute("aria-pressed", st.lastChoice === mark ? "true" : "false");
    });
  };

  const enterAnnex = (sceneKey) => {
    markAnnexVisited(sceneKey);
    const meta = ANNEX_META[sceneKey];
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = "";
    paintAnnexChoice(sceneKey);
    /* v33：恢复第四入口的 aria-pressed；两分回入口副楼时展示一次「已复核」反馈 */
    paintReviewEntry(sceneKey);
    paintReviewedReturn(sceneKey, responseEl);
    /* v35：恢复前厅第五入口的 aria-pressed */
    paintFloorEntry(sceneKey);
    /* v51：恢复刻痕牌与阈值异常的原子状态（只重绘不播报） */
    syncAnnexDebts(sceneKey);
    /* v52：按实时总容量恢复「合签三债」入口的显隐 */
    syncSettleEntries();
  };

  /* 副楼动作：首选锁定——已有未触发转场时忽略后续鼠标/Enter/Space 与其他动作；
     第一次被接受时立即保存 mark、lastChoice 与 transitions，短反馈后自动转场 */
  const chooseAnnex = (sceneKey, mark) => {
    const meta = ANNEX_META[sceneKey];
    const choice = meta && meta.choices[mark];
    if (!choice) return;
    if (AutoAdvance.has(sceneKey)) return;
    const st = getAnnex();
    if (!st.marks.includes(mark)) st.marks.push(mark);
    st.lastChoice = mark;
    st.transitions = Math.min(ANNEX_TRANSITIONS_CAP, st.transitions + 1);
    saveAnnex(st);
    paintAnnexChoice(sceneKey);
    addAnnexDebt(choice.btn);

    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = choice.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, choice.target, { delay: branchDelay() });
  };

  ANNEX_SCENES.forEach((sceneKey) => {
    const meta = ANNEX_META[sceneKey];
    Object.keys(meta.choices).forEach((mark) => {
      const btn = $(meta.choices[mark].btn);
      if (btn) btn.addEventListener("click", () => chooseAnnex(sceneKey, mark));
    });
  });

  /* ============================================================
     v51 副楼三债：13 个既有动作按 见证5/失号4/逆行4 各 +1（上限 9），
     任一达 3 原子解锁对应房间的一次条件异常（图像切换，异常热点作为
     新增分支出现在内层区域；13 个旧热点全部保留可见/可聚焦/可点击）。
     独立容错状态键，不读写 v32/v33/v35 或主线；既有反馈/mark/首选锁/
     AutoAdvance 全部保留，只附加记账与阈值切换。 */
  const DEBTS_KEY = "goddead_v51_annex_debts";
  const DEBTS_CAP = 9;
  const DEBTS_THRESHOLD = 3;
  const DEBT_KINDS = ["witness", "unnumbered", "reverse"];
  const DEBT_CN = { witness: "见证", unnumbered: "失号", reverse: "逆行" };
  const DEBT_ORDINALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  /* 13 个既有动作 → 债值映射（见证 5 / 失号 4 / 逆行 4） */
  const DEBT_BY_BTN = {
    "#eyelid-choice-listen": "witness",
    "#eyelid-choice-review": "witness",
    "#vestibule-choice-print": "witness",
    "#stairwell-choice-lookback": "witness",
    "#stairwell-choice-review": "witness",
    "#eyelid-choice-search": "unnumbered",
    "#eyelid-choice-file": "unnumbered",
    "#vestibule-choice-tenth": "unnumbered",
    "#vestibule-choice-exit": "unnumbered",
    "#vestibule-choice-review": "reverse",
    "#vestibule-choice-floor": "reverse",
    "#stairwell-choice-climb": "reverse",
    "#stairwell-choice-zeroth": "reverse",
  };
  /* 三个阈值异常：异变图、异常热点（新增分支，压内层区域）、播报、逐字反馈与目的地 */
  const DEBT_ANOMALY = {
    "eyelid-archive": {
      debt: "witness", img: "assets/annex-eyelid-witness.webp", anomalyBtn: "#eyelid-debt-witness",
      unlockNote: "闭眼的东西睁开了。", response: "三只眼睛没有看你。它们在核对你身后站着几个你。", target: "unnumbered-vestibule",
      figLabel: "黑漆归档柜下半部三只黄铜眼睑抽屉微微开启，露出潮湿苍白、互相不同方向凝视的眼球",
      baseFigLabel: "黑漆归档柜前一只抽屉微开、露出无号黑色视线档片，左桌放着黄铜听音盒与短听筒，右桌放着红蜡封口的黑色证物袋，前景地面的人形影子被狭长归档缝切断",
    },
    "unnumbered-vestibule": {
      debt: "unnumbered", img: "assets/annex-vestibule-tenth.webp", anomalyBtn: "#vestibule-debt-tenth",
      unlockNote: "门的数目对不上了。", response: "你没有推门。门从你的编号里向内打开。", target: "reverse-stairwell",
      figLabel: "环形九门保持不动，中央无把手黑门的阴影里显出一圈更窄更深的第十扇门框，门楣空白",
      baseFigLabel: "环形前厅环绕九扇挂空白骨瓷号牌的封门，最深处的无把手黑门前悬着独立空白号牌，左前景矮台上摊开无号台账与指印泥，右前景墙柱上有黑色复核投递槽与一枚暗红微光的地下层按钮",
    },
    "reverse-stairwell": {
      debt: "reverse", img: "assets/annex-stairwell-double.webp", anomalyBtn: "#stairwell-debt-double",
      unlockNote: "镜子里多了一座阶井。", response: "镜中的脚先落地，你的脚才想起该抬起来。", target: "eyelid-archive",
      figLabel: "左上窄长黑镜里出现一套与现实楼梯方向相反、透视不可能成立的重复阶井，现实构图不变",
      baseFigLabel: "上下折返的黑石楼梯共用中央平台，台阶上的脚印同时朝向两个方向，左上墙面挂着只映出背后的窄长黑镜，平台横贯一道暗红发亮的第零级接缝，右下扶手柱上放着黄铜异常申报盒与复核章",
    },
  };
  const DEBT_BASE_IMG = {
    "eyelid-archive": "assets/annex-eyelid-tactile.webp",
    "unnumbered-vestibule": "assets/annex-vestibule-tactile.webp",
    "reverse-stairwell": "assets/annex-stairwell-tactile.webp",
  };

  const getDebts = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(DEBTS_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const debts = {};
    DEBT_KINDS.forEach((k) => {
      let n = Number(raw.debts && raw.debts[k]);
      if (!Number.isFinite(n) || n < 0) n = 0;
      debts[k] = Math.min(DEBTS_CAP, Math.floor(n));
    });
    const unlocked = {};
    ANNEX_SCENES.forEach((s) => { unlocked[s] = Boolean(raw.unlocked && raw.unlocked[s] === true); });
    return { debts, unlocked };
  };
  const saveDebts = (st) => store.set(DEBTS_KEY, JSON.stringify(st));

  /* 刻痕牌：三行刻痕跨三牌同步；每行 0–9 个独立刻痕元素组成正规进度组件
     （不用文本符号/emoji），首次补齐 9 个 <b>，之后只切 dp-tick-on 与 aria-label */
  const paintDebtPlate = () => {
    const st = getDebts();
    DEBT_KINDS.forEach((k) => {
      document.querySelectorAll(`.dp-ticks[data-debt-ticks="${k}"]`).forEach((el) => {
        if (el.childElementCount !== DEBTS_CAP) {
          el.textContent = "";
          for (let i = 0; i < DEBTS_CAP; i += 1) {
            const tick = document.createElement("b");
            tick.className = "dp-tick";
            tick.setAttribute("aria-hidden", "true");
            el.appendChild(tick);
          }
        }
        const n = st.debts[k];
        Array.from(el.children).forEach((tick, i) => {
          tick.classList.toggle("dp-tick-on", i < n);
        });
        el.setAttribute("aria-label", `${DEBT_CN[k]} ${n} 道刻痕，上限 ${DEBTS_CAP} 道`);
      });
    });
  };

  /* 债值播报：写当前场景牌面的 aria-live（隐藏场景不播报） */
  const announceDebt = (msg) => {
    const live = document.querySelector("section.scene.active .dp-live");
    if (live) live.textContent = msg;
  };

  /* 阈值原子切换：图像、异常热点、figure 描述同一拍完成；
     13 个旧热点始终保留，不再隐藏任何 base 热点；刷新恢复只重绘不播报 */
  const syncAnnexDebts = (sceneKey) => {
    const meta = DEBT_ANOMALY[sceneKey];
    if (!meta) return;
    const st = getDebts();
    const on = st.unlocked[sceneKey] === true && st.debts[meta.debt] >= DEBTS_THRESHOLD;
    const section = $(`#scene-${sceneKey}`);
    if (!section) return;
    const figure = section.querySelector("figure.branch-figure");
    const img = figure && figure.querySelector(".branch-img");
    const wantSrc = on ? meta.img : DEBT_BASE_IMG[sceneKey];
    if (img && img.getAttribute("src") !== wantSrc) img.setAttribute("src", wantSrc);
    if (figure) figure.setAttribute("aria-label", on ? meta.figLabel : meta.baseFigLabel);
    const anomaly = $(meta.anomalyBtn);
    if (anomaly) {
      if (on) anomaly.removeAttribute("hidden");
      else { anomaly.setAttribute("hidden", ""); anomaly.setAttribute("aria-pressed", "false"); }
    }
  };

  /* 记账：只在既有动作被首选锁接受后调用，一次动作 +1，上限 9；
     达阈值原子解锁一次并播报，刻痕音很轻 */
  const addAnnexDebt = (btnSel) => {
    const kind = DEBT_BY_BTN[btnSel];
    if (!kind) return;
    const st = getDebts();
    if (st.debts[kind] >= DEBTS_CAP) return;
    st.debts[kind] = Math.min(DEBTS_CAP, st.debts[kind] + 1);
    saveDebts(st);
    paintDebtPlate();
    /* v52：债值跨过 3/6/9 时总容量可能变化，同步「合签三债」入口显隐 */
    syncSettleEntries();
    AudioEngine.knock(0.08);
    const plate = document.querySelector("section.scene.active .debt-plate");
    if (plate) { plate.classList.remove("dp-stir"); void plate.offsetWidth; plate.classList.add("dp-stir"); }
    let msg = `${DEBT_CN[kind]}留下第${DEBT_ORDINALS[st.debts[kind]]}道刻痕`;
    const room = ANNEX_SCENES.find((s) => DEBT_ANOMALY[s].debt === kind);
    if (room && st.debts[kind] >= DEBTS_THRESHOLD && !st.unlocked[room]) {
      st.unlocked[room] = true;
      saveDebts(st);
      msg += `。${DEBT_ANOMALY[room].unlockNote}`;
      syncAnnexDebts(room);
    }
    announceDebt(msg);
  };

  /* 阈值异常触发：直接 hash / 合成点击越权保护——未解锁一律无效；
     与所在房间共用同一把首选锁，逐字反馈后自动转场到既有相邻场景 */
  const chooseDebtAnomaly = (sceneKey) => {
    const meta = DEBT_ANOMALY[sceneKey];
    if (!meta) return;
    const st = getDebts();
    if (!(st.unlocked[sceneKey] === true && st.debts[meta.debt] >= DEBTS_THRESHOLD)) return;
    if (AutoAdvance.has(sceneKey)) return;
    const btn = $(meta.anomalyBtn);
    if (btn) btn.setAttribute("aria-pressed", "true");
    const annexMeta = ANNEX_META[sceneKey];
    const responseEl = annexMeta && $(annexMeta.responseEl);
    if (responseEl) responseEl.textContent = meta.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, meta.target, { delay: branchDelay() });
  };

  ANNEX_SCENES.forEach((sceneKey) => {
    const btn = $(DEBT_ANOMALY[sceneKey].anomalyBtn);
    if (btn) btn.addEventListener("click", () => chooseDebtAnomaly(sceneKey));
    /* 变体图预载，阈值切换无闪烁 */
    const pre = new Image();
    pre.src = DEBT_ANOMALY[sceneKey].img;
  });
  paintDebtPlate();
  ANNEX_SCENES.forEach(syncAnnexDebts);

  /* 痕迹页单行：按已访问项显示，保持八张统计卡不变 */
  const paintAnnexMemory = () => {
    const memory = $("#annex-memory");
    if (!memory) return;
    const st = getAnnex();
    const names = [];
    if (st.visited.eyelidArchive) names.push("闭目档案");
    if (st.visited.unnumberedVestibule) names.push("无号前厅");
    if (st.visited.reverseStairwell) names.push("逆向阶井");
    if (names.length === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `门内副楼：${names.join(" / ")}；你在没有楼层的地方改道 ${st.transitions} 次。`;
    memory.hidden = false;
  };

  /* ============================================================
     v52 副楼三债结算：v51 三种债值成为可重复使用的结算容量。
     每类本轮可投入容量 = floor(v51 对应 debt / 3)（0..3，只读 v51，绝不减少
     或改写 v51 state）；总容量 >= 3 时三副楼刻痕牌各出现原生按钮「合签三债」，
     与场景首选锁共用，逐字反馈后自动进入结算所。
     结算所每轮正好投入 3 枚债印（图内三机关 = 原生 hotspot），第三枚后保留
     反馈一拍自动结算：严格多数 → 对应结果房，1/1/1 → 稀有 balanced 落
     #protocol-drift（v42 直 hash 本就始终允许，v52 不读写 v42 状态）。
     独立容错状态键 SETTLE_KEY（v52 唯一存储键），不读写 v28–v51 或主线状态；
     无确认/继续按钮。 */
  const SETTLE_KEY = "goddead_v52_annex_settlement";
  const SETTLE_SCENES = ["house", "gallery", "registry", "appeals"];
  const SETTLE_RESULT_SCENES = ["gallery", "registry", "appeals"];
  const SETTLE_SCENE_NAME = {
    house: "annex-clearinghouse",
    gallery: "unreturned-witness-gallery",
    registry: "registry-before-zero",
    appeals: "descending-appeals-stair",
  };
  const SETTLE_NAME_SCENE = {
    "annex-clearinghouse": "house",
    "unreturned-witness-gallery": "gallery",
    "registry-before-zero": "registry",
    "descending-appeals-stair": "appeals",
  };
  const SETTLE_KINDS = ["witness", "unnumbered", "reverse"];
  const SETTLE_KIND_CN = { witness: "见证", unnumbered: "失号", reverse: "逆行" };
  const SETTLE_OUTCOMES = ["", "witness", "unnumbered", "reverse", "balanced"];
  /* 结算落点：严格多数 → 对应结果房；1/1/1 → 稀有 balanced 落 v42 巡查台 */
  const SETTLE_OUTCOME_TARGET = {
    witness: "unreturned-witness-gallery",
    unnumbered: "registry-before-zero",
    reverse: "descending-appeals-stair",
    balanced: "protocol-drift",
  };
  /* 结果房 ← 对应 outcome（直 hash 守卫用） */
  const SETTLE_RESULT_OUTCOME = { gallery: "witness", registry: "unnumbered", appeals: "reverse" };
  const SETTLE_NUM_CAP = 9999;
  const SETTLE_ENTRY_FEEDBACK = "三债同签。结算所开门，点清你带来的刻痕。";
  const SETTLE_ORDINALS = ["零", "一", "二", "三"];
  /* 每次投入的短反馈：按类与该类本轮第几枚逐字 */
  const SETTLE_DEPOSIT_LEAD = {
    witness: "眼形印眨了一下。",
    unnumbered: "空白瓷盘没有接住影子。",
    reverse: "逆阶模型退后了一级。",
  };
  const settleDepositFeedback = (kind, count) =>
    `${SETTLE_DEPOSIT_LEAD[kind]}${SETTLE_KIND_CN[kind]}债印落下第${SETTLE_ORDINALS[count]}枚。`;
  /* 第三枚后的结算句（追加在第三枚投入反馈之后，逐字） */
  const SETTLE_FINAL = {
    witness: "三印归位。眼形印不肯再闭上——结算所把你判给无归见证席。",
    unnumbered: "三印归位。瓷盘仍然空白——结算所把你判给零前登记库。",
    reverse: "三印归位。逆阶模型倒着走完一级——结算所把你判给倒诉阶。",
    balanced: "三印各一，谁也不肯多数。结算所第一次无法判决，把你退给一块正在漂移的守则板。",
  };
  /* 三间结果房的九个画面动作：真实图中物件上的原生 button，逐字反馈与精确目标 */
  const SETTLE_ACTIONS = {
    gallery: {
      horn: { btn: "#settle-gallery-action-horn", target: "unseated-listening-booth", feedback: "蜡筒没有录下声音，只把你听见它的那一刻倒放了一遍。" },
      seal: { btn: "#settle-gallery-action-seal", target: "witness-carbon-archive", feedback: "印章闭着眼落下，复写纸却多出一位未曾到场的见证人。" },
      chair: { btn: "#settle-gallery-action-chair", target: "eyelid-archive", feedback: "椅背没有映出脸。档案柜却为你的后脑开了三只眼。" },
    },
    registry: {
      plate: { btn: "#settle-registry-action-plate", target: "glyph-niche", feedback: "牌面比零更早，所以所有数字都从它身后绕行。" },
      press: { btn: "#settle-registry-action-press", target: "blank-receipt-press", feedback: "压印机落下时没有留下字，只把空白压得更深了一层。" },
      door: { btn: "#settle-registry-action-door", target: "unnumbered-floor", feedback: "门没有编号。你跨过去以后，身后的楼层先被注销。" },
    },
    appeals: {
      mirror: { btn: "#settle-appeals-action-mirror", target: "reverse-stairwell", feedback: "镜里的你先走完了楼梯，才回头等你的第一步。" },
      gavel: { btn: "#settle-appeals-action-gavel", target: "return-audit", feedback: "法槌从桌底向上落下，把你的归路判成了一次上诉。" },
      bell: { btn: "#settle-appeals-action-bell", target: "bellless-ward", feedback: "钟体摇了三次。病房里每张床却同时回答了第四声。" },
    },
  };
  const SETTLE_RESPONSE_EL = { house: "#settle-response", gallery: "#settle-gallery-response", registry: "#settle-registry-response", appeals: "#settle-appeals-response" };
  const SETTLE_LINKS = { house: "#settle-house-link", gallery: "#settle-gallery-link", registry: "#settle-registry-link", appeals: "#settle-appeals-link" };
  const SETTLE_ENTRY_BTNS = { "eyelid-archive": "#eyelid-settle-entry", "unnumbered-vestibule": "#vestibule-settle-entry", "reverse-stairwell": "#stairwell-settle-entry" };
  const SETTLE_DEPOSIT_BTNS = { witness: "#settle-deposit-witness", unnumbered: "#settle-deposit-unnumbered", reverse: "#settle-deposit-reverse" };

  /* 本轮可投入容量：只读 v51 债值，floor(debt / 3)，每类 0..3；绝不写 v51 */
  const settleCapacity = () => {
    const debts = getDebts().debts;
    const cap = {};
    SETTLE_KINDS.forEach((k) => { cap[k] = Math.floor(debts[k] / 3); });
    return cap;
  };
  const settleUnlocked = () => {
    const cap = settleCapacity();
    return SETTLE_KINDS.reduce((sum, k) => sum + cap[k], 0) >= 3;
  };
  /* 三枚 allocations 的结算结果：严格多数 → 该类；1/1/1 → balanced */
  const settleOutcomeOf = (allocations) => {
    const counts = { witness: 0, unnumbered: 0, reverse: 0 };
    allocations.forEach((a) => { counts[a] += 1; });
    const majority = SETTLE_KINDS.find((k) => counts[k] >= 2);
    return majority || "balanced";
  };

  const getSettlement = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(SETTLE_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const num = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n) || n < 0) n = 0;
      return Math.min(SETTLE_NUM_CAP, Math.floor(n));
    };
    const visited = {};
    SETTLE_SCENES.forEach((s) => { visited[s] = Boolean(raw.visited && raw.visited[s] === true); });
    const cycle = num(raw.cycle);
    const history = {};
    SETTLE_OUTCOMES.slice(1).forEach((o) => { history[o] = num(raw.history && raw.history[o]); });
    const actions = {};
    SETTLE_RESULT_SCENES.forEach((s) => {
      Object.keys(SETTLE_ACTIONS[s]).forEach((a) => { actions[`${s}-${a}`] = num(raw.actions && raw.actions[`${s}-${a}`]); });
    });
    /* allocations 归一：长度 <= 3、白名单、每类不超实时容量、合法连续前缀；
       首个非法项起全部截断，伪造序列不可能拼出非法投入 */
    const cap = settleCapacity();
    let allocations = [];
    if (Array.isArray(raw.allocations)) {
      for (const a of raw.allocations) {
        if (allocations.length >= 3) break;
        if (!SETTLE_KINDS.includes(a)) break;
        if (allocations.filter((x) => x === a).length >= cap[a]) break;
        allocations.push(a);
      }
    }
    /* settled 派生重算：必须长度恰 3 且 outcome 与实时多数推导一致 */
    let outcome = SETTLE_OUTCOMES.includes(raw.outcome) ? raw.outcome : "";
    let settled = raw.settled === true && allocations.length === 3 && outcome !== "" && settleOutcomeOf(allocations) === outcome;
    if (!settled) {
      outcome = "";
      if (allocations.length >= 3) allocations = allocations.slice(0, 2);
    }
    /* pending 两种严格形态，逐字段校验：
       settle：第三枚已接受、结算转场未完成（type/outcome/target/feedback 与固定表一致）；
       action：结果房动作已接受、转场未完成（scene/action/target/feedback 与动作表一致）；
       任一字段错配即归 null。pending 只恢复反馈与转场，不得重复累计 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const p = raw.pending;
      if (p.type === "settle" && settled && p.outcome === outcome && p.target === SETTLE_OUTCOME_TARGET[outcome]) {
        const third = allocations[2];
        const expected = settleDepositFeedback(third, allocations.filter((x) => x === third).length) + SETTLE_FINAL[outcome];
        if (p.feedback === expected) pending = { type: "settle", outcome, target: p.target, feedback: expected };
      } else if (p.type === "action") {
        const acts = SETTLE_ACTIONS[p.scene];
        const act = acts && acts[p.action];
        if (act && p.target === act.target && p.feedback === act.feedback) {
          pending = { type: "action", scene: p.scene, action: p.action, target: act.target, feedback: act.feedback };
        }
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配（v31 glyph-niche 窄例外用） */
    const lastScene = SETTLE_RESULT_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && SETTLE_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    return { visited, cycle, history, actions, allocations, settled, outcome, pending, lastScene, lastAction };
  };
  const saveSettlement = (st) => store.set(SETTLE_KEY, JSON.stringify(st));

  const syncSettleLinks = () => {
    const st = getSettlement();
    SETTLE_SCENES.forEach((s) => {
      const link = $(SETTLE_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记：首次真正进入（含合法直达）立即持久化，目录入口原子恢复 */
  const markSettlementVisited = (sceneKey) => {
    const st = getSettlement();
    if (!SETTLE_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    saveSettlement(st);
    syncSettleLinks();
  };

  const settleDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  /* 「合签三债」入口：总容量 >= 3 才出现；hidden 时不可聚焦、合成点击无效 */
  const syncSettleEntries = () => {
    const on = settleUnlocked();
    Object.values(SETTLE_ENTRY_BTNS).forEach((sel) => {
      const btn = $(sel);
      if (!btn) return;
      if (on) btn.removeAttribute("hidden");
      else { btn.setAttribute("hidden", ""); btn.setAttribute("aria-pressed", "false"); }
    });
  };

  /* 结算所重绘：三行实体凹槽（每行 3 孔，点亮已投数）+ 三机关按钮状态。
     凹槽是图内物件，容器 pointer-events:none，只读可访问文本 */
  const paintClearinghouse = () => {
    const st = getSettlement();
    const cap = settleCapacity();
    const locked = AutoAdvance.has("annex-clearinghouse") || st.settled;
    SETTLE_KINDS.forEach((k) => {
      const used = st.allocations.filter((a) => a === k).length;
      const slotsEl = document.querySelector(`[data-settle-slots="${k}"]`);
      if (slotsEl) {
        Array.from(slotsEl.children).forEach((slot, i) => {
          slot.classList.toggle("st-slot-on", i < used);
        });
        slotsEl.setAttribute("aria-label", `${SETTLE_KIND_CN[k]}凹槽 已投 ${used} 枚，本轮容量 ${cap[k]} 枚`);
      }
      const btn = $(SETTLE_DEPOSIT_BTNS[k]);
      if (btn) {
        btn.disabled = locked || used >= cap[k];
        btn.setAttribute("aria-pressed", used > 0 ? "true" : "false");
      }
    });
  };

  /* 进入结算所：到访标记；合法 settle pending（第三枚反馈拍刷新/离场后重返）
     重播逐字反馈并只重建一次目标转场，timer 触发前才清 pending */
  const enterClearinghouse = () => {
    markSettlementVisited("house");
    const st = getSettlement();
    const responseEl = $(SETTLE_RESPONSE_EL.house);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.type === "settle") {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("annex-clearinghouse", p.target, {
        delay: settleDelay(),
        before: () => {
          const s = getSettlement();
          if (s.pending && s.pending.type === "settle") {
            s.pending = null;
            saveSettlement(s);
          }
        },
      });
    }
    paintClearinghouse();
  };

  /* 投入债印：在任何状态读写、反馈、音效、timer 前校验 live scene；
     同拍首选锁 + 实时容量校验，快速 click/Enter/Space 同拍不得重复计数；
     第三枚立即派生 outcome、累计历史、持久化 settle pending，保留反馈一拍后自动结算 */
  const depositSettlement = (kind) => {
    if (!SETTLE_KINDS.includes(kind)) return;
    if (currentScene !== "annex-clearinghouse") return;
    if (AutoAdvance.has("annex-clearinghouse")) return;
    const st = getSettlement();
    if (st.settled) return;
    if (st.allocations.length >= 3) return;
    const cap = settleCapacity();
    const used = st.allocations.filter((a) => a === kind).length;
    if (used >= cap[kind]) return;
    st.allocations.push(kind);
    const count = used + 1;
    const responseEl = $(SETTLE_RESPONSE_EL.house);
    if (st.allocations.length === 3) {
      const outcome = settleOutcomeOf(st.allocations);
      const target = SETTLE_OUTCOME_TARGET[outcome];
      const feedback = settleDepositFeedback(kind, count) + SETTLE_FINAL[outcome];
      st.settled = true;
      st.outcome = outcome;
      st.history[outcome] = Math.min(SETTLE_NUM_CAP, st.history[outcome] + 1);
      st.pending = { type: "settle", outcome, target, feedback };
      saveSettlement(st);
      if (responseEl) responseEl.textContent = feedback;
      AudioEngine.knock(0.16);
      AutoAdvance.schedule("annex-clearinghouse", target, {
        delay: settleDelay(),
        before: () => {
          const s = getSettlement();
          if (s.pending && s.pending.type === "settle") {
            s.pending = null;
            saveSettlement(s);
          }
        },
      });
      paintClearinghouse();
      return;
    }
    saveSettlement(st);
    if (responseEl) responseEl.textContent = settleDepositFeedback(kind, count);
    AudioEngine.knock(0.08);
    paintClearinghouse();
  };

  SETTLE_KINDS.forEach((kind) => {
    const btn = $(SETTLE_DEPOSIT_BTNS[kind]);
    if (btn) btn.addEventListener("click", () => depositSettlement(kind));
  });

  /* 三副楼「合签三债」入口：live scene + 实时总容量 + 场景首选锁三重校验，
     未达门槛一律零副作用；已结算（且 settle pending 已消费）再点开启新 cycle，
     未结算的进行中 cycle 原样续投，历史统计跨 cycle 保留 */
  const chooseSettleEntry = (sceneKey) => {
    if (currentScene !== sceneKey) return;
    if (!settleUnlocked()) return;
    if (AutoAdvance.has(sceneKey)) return;
    const st = getSettlement();
    if (st.settled && !st.pending) {
      st.cycle = Math.min(SETTLE_NUM_CAP, st.cycle + 1);
      st.allocations = [];
      st.settled = false;
      st.outcome = "";
    }
    saveSettlement(st);
    const btn = $(SETTLE_ENTRY_BTNS[sceneKey]);
    if (btn) btn.setAttribute("aria-pressed", "true");
    const annexMeta = ANNEX_META[sceneKey];
    const responseEl = annexMeta && $(annexMeta.responseEl);
    if (responseEl) responseEl.textContent = SETTLE_ENTRY_FEEDBACK;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, "annex-clearinghouse", { delay: branchDelay() });
  };

  ANNEX_SCENES.forEach((sceneKey) => {
    const btn = $(SETTLE_ENTRY_BTNS[sceneKey]);
    if (btn) btn.addEventListener("click", () => chooseSettleEntry(sceneKey));
  });

  /* 结果房重绘：锁定拍内三个热点 disabled；动作计数 > 0 保持 pressed */
  const paintSettleResult = (sceneKey) => {
    const st = getSettlement();
    const locked = AutoAdvance.has("settle-" + sceneKey);
    Object.keys(SETTLE_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(SETTLE_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.actions[`${sceneKey}-${actionId}`] > 0 ? "true" : "false");
    });
  };

  /* 进入结果房：到访标记；合法 action pending 属于本场景时重播逐字反馈并
     只重建一次目标转场 */
  const enterSettleResult = (sceneKey) => {
    markSettlementVisited(sceneKey);
    const st = getSettlement();
    const responseEl = $(SETTLE_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.type === "action" && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("settle-" + sceneKey, p.target, {
        delay: settleDelay(),
        before: () => {
          const s = getSettlement();
          if (s.pending && s.pending.type === "action" && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            saveSettlement(s);
          }
        },
      });
    }
    paintSettleResult(sceneKey);
  };

  /* 九个结果动作：在任何状态读写、反馈、音效、timer 前校验 live scene；
     第一项被接受后同场景三个热点立即 disabled（同拍竞争只记一次），
     逐字反馈 + 动作计数 + lastScene/lastAction 持久化后自动转场，无确认/继续按钮 */
  const runSettleAction = (sceneKey, actionId) => {
    const act = SETTLE_ACTIONS[sceneKey] && SETTLE_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== SETTLE_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("settle-" + sceneKey)) return;
    const st = getSettlement();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    st.actions[`${sceneKey}-${actionId}`] = Math.min(SETTLE_NUM_CAP, st.actions[`${sceneKey}-${actionId}`] + 1);
    st.pending = { type: "action", scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    saveSettlement(st);
    const responseEl = $(SETTLE_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule("settle-" + sceneKey, act.target, {
      delay: settleDelay(),
      before: () => {
        const s = getSettlement();
        if (s.pending && s.pending.type === "action" && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          saveSettlement(s);
        }
      },
    });
    paintSettleResult(sceneKey);
  };

  SETTLE_RESULT_SCENES.forEach((sceneKey) => {
    Object.keys(SETTLE_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(SETTLE_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runSettleAction(sceneKey, actionId));
    });
  });

  syncSettleEntries();
  syncSettleLinks();

  /* 痕迹页单行：合签轮数、四路结算统计与九动作合计，保持八张统计卡不变 */
  const paintSettlementMemory = () => {
    const memory = $("#settlement-memory");
    if (!memory) return;
    const st = getSettlement();
    const rounds = st.history.witness + st.history.unnumbered + st.history.reverse + st.history.balanced;
    const actionTotal = Object.values(st.actions).reduce((sum, n) => sum + n, 0);
    if (rounds === 0 && !st.visited.house) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `三债结算：合签 ${rounds} 轮；见证 ${st.history.witness} / 失号 ${st.history.unnumbered} / 逆行 ${st.history.reverse} / 均衡 ${st.history.balanced}；九个结算动作共 ${actionTotal} 次。`;
    memory.hidden = false;
  };

  /* ============================================================
     v33 异常复核科：可重复复核支线 + 异常保全库 / 误报回收井
     状态独立存 goddead_v33_anomaly_review，容错坏 JSON；
     不读不写 v28–v32 与主线状态；档案顺序由「入口 + cycle」从白名单矩阵
     确定性轮换，禁止裸随机；直接 hash 进入复核科采用 neutral 顺序，
     只展示第一份档案，不自动判断。
     ============================================================ */
  const REVIEW_KEY = "goddead_v33_anomaly_review";
  const REVIEW_SCENES = ["anomaly-review", "evidence-vault", "false-positive-shaft"];
  const REVIEW_RESULT_SCENES = ["evidence-vault", "false-positive-shaft"];
  const REVIEW_ENTRIES = ["neutral", "eyelid", "vestibule", "stairwell"];
  const REVIEW_CASES = ["baseline", "aperture", "rail", "shadow"];
  const REVIEW_MARKS = [
    "sentEyeForReview", "submittedUnnumberedDoor", "reportedUpwardDescent",
    "sealedClearestAnomaly", "returnedBaselineToVestibule", "leftThroughBrokenSeal",
    "retrievedRejectedCase", "appendedFalseReport", "admittedExtraItem",
  ];
  const REVIEW_VISIT_KEY = { "anomaly-review": "review", "evidence-vault": "evidenceVault", "false-positive-shaft": "falsePositiveShaft" };
  const REVIEW_OUTCOMES = ["", "vault", "returned", "shaft"];
  const REVIEW_NUM_CAP = 9999;

  /* 确定性轮换矩阵：行 = 各入口 cycle 0 的顺序，每行恰含一份 baseline 与两份不同异常；
     后续 cycle 按（入口行 + cycle）对矩阵循环移位——同入口连续两轮顺序不同，
     四种档案在多次复核中都会出现 */
  const REVIEW_ORDER_MATRIX = [
    ["baseline", "aperture", "rail"],
    ["shadow", "baseline", "aperture"],
    ["rail", "shadow", "baseline"],
    ["aperture", "baseline", "shadow"],
  ];
  const REVIEW_ENTRY_ROW = { eyelid: 0, vestibule: 1, stairwell: 2, neutral: 3 };
  const reviewOrderFor = (entry, cycle) => REVIEW_ORDER_MATRIX[(REVIEW_ENTRY_ROW[entry] + cycle) % REVIEW_ORDER_MATRIX.length].slice();
  const isValidReviewOrder = (order) => Array.isArray(order) && order.length === 3
    && order.every((c) => REVIEW_CASES.includes(c))
    && new Set(order).size === 3
    && order.filter((c) => c === "baseline").length === 1;

  const getReview = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(REVIEW_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const visited = {};
    Object.values(REVIEW_VISIT_KEY).forEach((k) => {
      visited[k] = Boolean(raw.visited && raw.visited[k] === true);
    });
    const entry = REVIEW_ENTRIES.includes(raw.entry) ? raw.entry : "neutral";
    const num = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n) || n < 0) n = 0;
      return Math.min(REVIEW_NUM_CAP, Math.floor(n));
    };
    const cycle = num(raw.cycle);
    const order = isValidReviewOrder(raw.order) ? raw.order.slice() : reviewOrderFor(entry, cycle);
    let round = num(raw.round);
    if (round > 3) round = 3;
    const decisions = Array.isArray(raw.decisions)
      ? raw.decisions
          .filter((d) => d && typeof d === "object" && REVIEW_CASES.includes(d.caseId)
            && (d.choice === "anomaly" || d.choice === "baseline") && typeof d.correct === "boolean")
          .filter((d, i, arr) => arr.findIndex((x) => x.caseId === d.caseId) === i)
          .slice(0, round)
      : [];
    const outcome = REVIEW_OUTCOMES.includes(raw.outcome) ? raw.outcome : "";
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => REVIEW_MARKS.includes(m)))].slice(0, REVIEW_MARKS.length)
      : [];
    return {
      visited, entry, cycle, order, round,
      correct: num(raw.correct),
      streak: num(raw.streak),
      bestStreak: num(raw.bestStreak),
      mistakes: num(raw.mistakes),
      completedRuns: num(raw.completedRuns),
      vaultEntries: num(raw.vaultEntries),
      shaftEntries: num(raw.shaftEntries),
      decisions, outcome, marks,
    };
  };
  const saveReview = (st) => store.set(REVIEW_KEY, JSON.stringify(st));

  /* 新一轮：由副楼入口、误报井工单或目录重进触发。order 按当前 cycle 生成后再递增，
     使设计矩阵的 cycle 0 行即首轮顺序，且同入口连续两轮顺序不同；
     本轮 round/分数/decisions/outcome 全部清零，bestStreak 与计数跨轮保留 */
  const startReview = (entry) => {
    const st = getReview();
    st.entry = REVIEW_ENTRIES.includes(entry) ? entry : "neutral";
    st.order = reviewOrderFor(st.entry, st.cycle);
    st.cycle = Math.min(REVIEW_NUM_CAP, st.cycle + 1);
    st.round = 0;
    st.correct = 0;
    st.streak = 0;
    st.mistakes = 0;
    st.decisions = [];
    st.outcome = "";
    saveReview(st);
  };

  const REVIEW_CASE_ASSETS = {
    baseline: "assets/anomaly-review-baseline.webp",
    aperture: "assets/anomaly-review-aperture.webp",
    rail: "assets/anomaly-review-rail.webp",
    shadow: "assets/anomaly-review-shadow.webp",
  };
  const REVIEW_CASE_LABELS = ["第一份档案", "第二份档案", "第三份档案"];

  /* 目录入口：首次到访后原子恢复，未访问保持 hidden 不可聚焦 */
  const REVIEW_LINKS = { "anomaly-review": "#review-link", "evidence-vault": "#vault-link", "false-positive-shaft": "#shaft-link" };
  const syncReviewLinks = () => {
    const st = getReview();
    REVIEW_SCENES.forEach((s) => {
      const link = $(REVIEW_LINKS[s]);
      if (!link) return;
      if (st.visited[REVIEW_VISIT_KEY[s]]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记：首次真正进入（含直接 hash）立即持久化 */
  const markReviewVisited = (sceneKey) => {
    const st = getReview();
    const key = REVIEW_VISIT_KEY[sceneKey];
    if (!key || st.visited[key]) return;
    st.visited[key] = true;
    saveReview(st);
    syncReviewLinks();
  };

  /* 档案图交叉淡化：双层 img 只切 opacity，不位移不放大，避免动画被误判为异常。
     每层 img 携带自己的 data-case 标记：shadow 案的逆向灯影在源图顶部，
     桌面槽位按该标记单独上移构图（移动端维持原裁切）；逐层标记保证
     换档淡化期间离场层仍按自己的构图淡出，不会被新案的裁切拽动 */
  let reviewCaseFront = true;
  const showReviewCase = (caseId, idx) => {
    const front = $(reviewCaseFront ? "#review-case-img-a" : "#review-case-img-b");
    const back = $(reviewCaseFront ? "#review-case-img-b" : "#review-case-img-a");
    const src = REVIEW_CASE_ASSETS[caseId];
    if (front && back && src && front.getAttribute("src") !== src) {
      back.setAttribute("src", src);
      back.setAttribute("data-case", caseId);
      back.classList.add("is-front");
      front.classList.remove("is-front");
      reviewCaseFront = !reviewCaseFront;
    }
    const label = $("#review-case-label");
    if (label) label.textContent = `${REVIEW_CASE_LABELS[Math.min(idx, 2)]} · 共三份`;
  };

  const paintReviewSlip = (st) => {
    const correctEl = $("#review-stat-correct");
    const streakEl = $("#review-stat-streak");
    const mistakesEl = $("#review-stat-mistakes");
    const bestEl = $("#review-stat-best");
    if (correctEl) correctEl.textContent = st.correct;
    if (streakEl) streakEl.textContent = st.streak;
    if (mistakesEl) mistakesEl.textContent = st.mistakes;
    if (bestEl) bestEl.textContent = st.bestStreak;
  };

  const paintReviewDecisions = (pressedChoice) => {
    const anomalyBtn = $("#review-choice-anomaly");
    const baselineBtn = $("#review-choice-baseline");
    if (anomalyBtn) anomalyBtn.setAttribute("aria-pressed", pressedChoice === "anomaly" ? "true" : "false");
    if (baselineBtn) baselineBtn.setAttribute("aria-pressed", pressedChoice === "baseline" ? "true" : "false");
  };

  /* 整室重绘：复核签 + 当前 round 的档案 + 判断按钮复位。
     恢复只展示当前轮次，不续跑任何已丢失的 timer */
  const paintReview = () => {
    const st = getReview();
    paintReviewSlip(st);
    const idx = Math.min(st.round, 2);
    showReviewCase(st.order[idx], idx);
    paintReviewDecisions("");
  };

  /* 进入复核科：已完成的轮次（含结果已分流）以 neutral 开一轮新档案；
     正在进行的轮次原位恢复；从未开轮的直达（cycle 0）以 neutral 开首轮，
     只展示第一份档案，绝不自动判断 */
  const enterReview = () => {
    markReviewVisited("anomaly-review");
    /* v35 缺层电梯中间档落点：强制 neutral 新轮并展示一次性落点反馈 */
    const v35Arrival = getFloor().outcome === "review";
    if (v35Arrival) startReview("neutral");
    const st = getReview();
    if (st.outcome !== "" || st.round >= 3) startReview("neutral");
    else if (st.cycle === 0 && st.round === 0) startReview("neutral");
    const responseEl = $("#review-response");
    if (responseEl) responseEl.textContent = "";
    if (v35Arrival && responseEl) consumeFloorOutcome("review", responseEl);
    paintReview();
  };

  /* 两分回入口副楼：outcome 记 returned，按本轮入口返回；neutral 回闭目档案室 */
  const REVIEW_ENTRY_TARGET = { eyelid: "eyelid-archive", vestibule: "unnumbered-vestibule", stairwell: "reverse-stairwell", neutral: "eyelid-archive" };

  /* 每轮判断：第一项被接受后，另一个按钮、连点与 Enter/Space 重复事件全部忽略；
     立即反馈并更新账面，短反馈后自动换档，第三轮自动分流，无第二个继续按钮 */
  const decideReview = (choice) => {
    if (AutoAdvance.has("anomaly-review") || AutoAdvance.has("anomaly-review-round")) return;
    const st = getReview();
    if (st.outcome !== "" || st.round >= 3) return;
    const caseId = st.order[st.round];
    if (!REVIEW_CASES.includes(caseId)) return;
    const choseAnomaly = choice === "anomaly";
    const correct = choseAnomaly === (caseId !== "baseline");
    st.decisions.push({ caseId, choice: choseAnomaly ? "anomaly" : "baseline", correct });
    st.round = Math.min(3, st.round + 1);
    let feedback;
    if (correct) {
      st.correct += 1;
      st.streak += 1;
      if (st.streak > st.bestStreak) st.bestStreak = st.streak;
      feedback = choseAnomaly ? "档案边缘渗出一条新编号。复核值 +1。" : "房间保持原样。你第一次因为没看见而被记录。";
    } else {
      st.mistakes += 1;
      st.streak = 0;
      feedback = choseAnomaly ? "复核科收走你的确信。误报 +1。" : "变化没有消失，只是被登记成了你。";
    }
    const responseEl = $("#review-response");
    if (responseEl) responseEl.textContent = feedback;
    AudioEngine.knock(0.16);
    paintReviewSlip(st);
    paintReviewDecisions(choseAnomaly ? "anomaly" : "baseline");

    if (st.round >= 3) {
      /* 第三轮只允许结算一次：completedRuns 精确加一，vault/shaft 计数至多各加一 */
      st.completedRuns = Math.min(REVIEW_NUM_CAP, st.completedRuns + 1);
      let target;
      if (st.correct >= 3) {
        st.outcome = "vault";
        st.vaultEntries = Math.min(REVIEW_NUM_CAP, st.vaultEntries + 1);
        target = "evidence-vault";
      } else if (st.correct === 2) {
        st.outcome = "returned";
        target = REVIEW_ENTRY_TARGET[st.entry];
      } else {
        st.outcome = "shaft";
        st.shaftEntries = Math.min(REVIEW_NUM_CAP, st.shaftEntries + 1);
        target = "false-positive-shaft";
      }
      saveReview(st);
      AutoAdvance.schedule("anomaly-review", target, { delay: branchDelay() });
    } else {
      saveReview(st);
      /* 轮内换档与跨场景转场使用不同 scope，离场时由 clearAll 一并清除 */
      AutoAdvance.schedule("anomaly-review-round", "anomaly-review", {
        delay: branchDelay(),
        before: () => {
          const cur = getReview();
          showReviewCase(cur.order[Math.min(cur.round, 2)], cur.round);
          paintReviewDecisions("");
        },
      });
    }
  };

  const reviewAnomalyBtn = $("#review-choice-anomaly");
  const reviewBaselineBtn = $("#review-choice-baseline");
  if (reviewAnomalyBtn) reviewAnomalyBtn.addEventListener("click", () => decideReview("anomaly"));
  if (reviewBaselineBtn) reviewBaselineBtn.addEventListener("click", () => decideReview("baseline"));

  /* 三间 v32 副楼的第四入口动作：只附加入口，原九动作逐字、mark、反馈与目的地不变 */
  const REVIEW_ENTRY_META = {
    "eyelid-archive": { btn: "#eyelid-choice-review", entry: "eyelid", mark: "sentEyeForReview", response: "没有睁开的眼被装进黑色证物袋，送去复核。" },
    "unnumbered-vestibule": { btn: "#vestibule-choice-review", entry: "vestibule", mark: "submittedUnnumberedDoor", response: "没有编号的门被登记为待复核案。" },
    "reverse-stairwell": { btn: "#stairwell-choice-review", entry: "stairwell", mark: "reportedUpwardDescent", response: "同时向上的下行梯被盖上待复核章。" },
  };

  const paintReviewEntry = (sceneKey) => {
    const meta = REVIEW_ENTRY_META[sceneKey];
    if (!meta) return;
    const btn = $(meta.btn);
    if (btn) btn.setAttribute("aria-pressed", getReview().marks.includes(meta.mark) ? "true" : "false");
  };

  /* 第四入口与副楼原九动作共用同一把首选锁（同一 AutoAdvance scope） */
  const chooseReviewEntry = (sceneKey) => {
    const meta = REVIEW_ENTRY_META[sceneKey];
    if (!meta) return;
    if (AutoAdvance.has(sceneKey)) return;
    startReview(meta.entry);
    const st = getReview();
    if (!st.marks.includes(meta.mark)) st.marks.push(meta.mark);
    saveReview(st);
    paintReviewEntry(sceneKey);
    addAnnexDebt(meta.btn);
    const annexMeta = ANNEX_META[sceneKey];
    const responseEl = annexMeta && $(annexMeta.responseEl);
    if (responseEl) responseEl.textContent = meta.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, "anomaly-review", { delay: branchDelay() });
  };

  Object.keys(REVIEW_ENTRY_META).forEach((sceneKey) => {
    const btn = $(REVIEW_ENTRY_META[sceneKey].btn);
    if (btn) btn.addEventListener("click", () => chooseReviewEntry(sceneKey));
  });

  /* 两分回入口副楼时的「已复核」反馈：仅本轮 outcome 为 returned 且入口匹配时
     展示一次，随即消耗，不重复出现 */
  const paintReviewedReturn = (sceneKey, responseEl) => {
    const meta = REVIEW_ENTRY_META[sceneKey];
    if (!meta) return;
    const st = getReview();
    if (st.outcome !== "returned" || st.entry !== meta.entry) return;
    if (responseEl) responseEl.textContent = "复核科已登记这一处异常。房间维持原判。";
    st.outcome = "";
    saveReview(st);
  };

  /* 结果房动作：首选锁定 + 立即反馈 + 自动转场，无第二个继续按钮 */
  const REVIEW_RESULT_META = {
    "evidence-vault": {
      responseEl: "#vault-response",
      choices: {
        sealedClearestAnomaly: { btn: "#vault-choice-seal", target: "eyelid-archive", response: "证物匣闭合时，闭目档案室少了一只眼。" },
        returnedBaselineToVestibule: { btn: "#vault-choice-return", target: "unnumbered-vestibule", response: "没有编号的门拒绝签收，于是把自己打开。" },
        leftThroughBrokenSeal: { btn: "#vault-choice-leave", target: "corridor", response: "编号在中途断裂，断口后面是经文走廊。" },
      },
    },
    "false-positive-shaft": {
      responseEl: "#shaft-response",
      choices: {
        retrievedRejectedCase: { btn: "#shaft-choice-retrieve", target: "anomaly-review", response: "工单背面已经换了一套异常。复核重新开始。", restart: true },
        appendedFalseReport: { btn: "#shaft-choice-append", target: "protocol", response: "守则新增一条：凡看错者，视为看见。" },
        admittedExtraItem: { btn: "#shaft-choice-admit", target: "threshold", response: "回收井退回你的名字，把人送到门外。" },
      },
    },
  };

  const paintReviewResult = (sceneKey) => {
    const meta = REVIEW_RESULT_META[sceneKey];
    const st = getReview();
    Object.keys(meta.choices).forEach((mark) => {
      const btn = $(meta.choices[mark].btn);
      if (btn) btn.setAttribute("aria-pressed", st.marks.includes(mark) ? "true" : "false");
    });
  };

  const enterReviewResult = (sceneKey) => {
    markReviewVisited(sceneKey);
    const meta = REVIEW_RESULT_META[sceneKey];
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = "";
    paintReviewResult(sceneKey);
    /* v34：破封坠回误报井时展示一次性回流反馈；恢复第四入口的 aria-pressed */
    paintValuationBreachReturn(sceneKey, responseEl);
    paintValuationEntry(sceneKey);
  };

  const chooseReviewResult = (sceneKey, mark) => {
    const meta = REVIEW_RESULT_META[sceneKey];
    const choice = meta && meta.choices[mark];
    if (!choice) return;
    if (AutoAdvance.has(sceneKey)) return;
    const st = getReview();
    if (!st.marks.includes(mark)) st.marks.push(mark);
    saveReview(st);
    /* 工单：开启新 cycle 并自动回复核科（沿用本轮入口，轮换继续移位） */
    if (choice.restart) startReview(st.entry);
    paintReviewResult(sceneKey);
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = choice.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, choice.target, { delay: branchDelay() });
  };

  REVIEW_RESULT_SCENES.forEach((sceneKey) => {
    const meta = REVIEW_RESULT_META[sceneKey];
    Object.keys(meta.choices).forEach((mark) => {
      const btn = $(meta.choices[mark].btn);
      if (btn) btn.addEventListener("click", () => chooseReviewResult(sceneKey, mark));
    });
  });

  /* 痕迹页单行：完成轮数 / 最佳连续 / 保全与误报回收次数，保持八张统计卡不变 */
  const paintAnomalyMemory = () => {
    const memory = $("#anomaly-memory");
    if (!memory) return;
    const st = getReview();
    if (!st.visited.review && !st.visited.evidenceVault && !st.visited.falsePositiveShaft) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `异常复核：完成 ${st.completedRuns} 轮，最佳连续 ${st.bestStreak}，保全 ${st.vaultEntries} 次，误报回收 ${st.shaftEntries} 次。`;
    memory.hidden = false;
  };

  /* ============================================================
     v34 无主估值室：可重复估值支线 + 定额电梯
     状态独立存 goddead_v34_unclaimed_valuation，容错坏 JSON；
     不读不写 v28–v33 与主线状态；批次由「入口 + cycle」从白名单矩阵
     确定性轮换，禁止裸随机；点击即执行，无确认页、无第二个继续按钮。
     ============================================================ */
  const VAL_KEY = "goddead_v34_unclaimed_valuation";
  const VAL_SCENES = ["unclaimed-valuation", "quota-elevator"];
  const VAL_ENTRIES = ["neutral", "vault", "shaft"];
  const VAL_RELICS = ["thirteenthClock", "toothKey", "hollowIdol", "blackWaxLung", "unopenedEye", "receiptBone"];
  const VAL_MARKS = [
    "sentEvidenceToValuation", "declaredRejectAsAsset",
    "sentQuotaToVestibule", "crossedBrokenFloorScale", "droppedQuotaIntoCorridor",
    ...VAL_RELICS,
  ];
  const VAL_VISIT_KEY = { "unclaimed-valuation": "valuation", "quota-elevator": "quotaElevator" };
  const VAL_OUTCOMES = ["", "quota", "under", "breach"];
  const VAL_NUM_CAP = 9999;

  /* 确定性批次矩阵：行 = 各入口 cycle 0 的批次，每行三件不同证物；
     后续 cycle 按（入口行 + cycle）循环移位——同入口连续两批不同，六件都会出现 */
  const VAL_BATCH_MATRIX = [
    ["thirteenthClock", "toothKey", "hollowIdol"],
    ["blackWaxLung", "unopenedEye", "receiptBone"],
    ["thirteenthClock", "blackWaxLung", "hollowIdol"],
    ["toothKey", "unopenedEye", "receiptBone"],
  ];
  const VAL_ENTRY_ROW = { vault: 0, shaft: 1, neutral: 2 };
  const valBatchFor = (entry, cycle) => VAL_BATCH_MATRIX[(VAL_ENTRY_ROW[entry] + cycle) % VAL_BATCH_MATRIX.length].slice();
  const isValidValBatch = (batch) => Array.isArray(batch) && batch.length === 3
    && batch.every((r) => VAL_RELICS.includes(r))
    && new Set(batch).size === 3;

  /* 两种入口条件：误报井退件自带 1 点溢价但封印更脆；直达与 vault 相同 */
  const VAL_ENTRY_INIT = {
    vault: { value: 0, integrity: 5, quota: 6 },
    shaft: { value: 1, integrity: 4, quota: 7 },
    neutral: { value: 0, integrity: 5, quota: 6 },
  };

  const getValuation = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(VAL_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const visited = {};
    Object.values(VAL_VISIT_KEY).forEach((k) => {
      visited[k] = Boolean(raw.visited && raw.visited[k] === true);
    });
    const entry = VAL_ENTRIES.includes(raw.entry) ? raw.entry : "neutral";
    const num = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n) || n < 0) n = 0;
      return Math.min(VAL_NUM_CAP, Math.floor(n));
    };
    const cycle = num(raw.cycle);
    const batch = isValidValBatch(raw.batch) ? raw.batch.slice() : valBatchFor(entry, cycle);
    const opened = Array.isArray(raw.opened)
      ? [...new Set(raw.opened.filter((r) => batch.includes(r)))].slice(0, 3)
      : [];
    /* ledger 只接受与 opened 顺序一一对应的已计算记录，重载不重算效果 */
    const ledger = Array.isArray(raw.ledger)
      ? raw.ledger
          .filter((l) => l && typeof l === "object" && VAL_RELICS.includes(l.relic)
            && Number.isFinite(Number(l.valueGain)) && Number(l.valueGain) >= 0
            && Number.isFinite(Number(l.damageTaken)) && Number(l.damageTaken) >= 0
            && typeof l.effect === "string")
          .filter((l, i) => l.relic === opened[i])
          .slice(0, opened.length)
          .map((l) => ({ relic: l.relic, valueGain: num(l.valueGain), damageTaken: num(l.damageTaken), effect: l.effect }))
      : [];
    const outcome = VAL_OUTCOMES.includes(raw.outcome) ? raw.outcome : "";
    /* 过期/畸形组合归一：有结果的批次不再活动；活动批次不可能已满三件 */
    let active = raw.active === true && outcome === "";
    if (active && opened.length >= 3) active = false;
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => VAL_MARKS.includes(m)))].slice(0, VAL_MARKS.length)
      : [];
    return {
      visited, entry, cycle, batch, opened, ledger,
      value: num(raw.value),
      integrity: num(raw.integrity),
      quota: Math.max(1, num(raw.quota) || VAL_ENTRY_INIT[entry].quota),
      nextDamageShield: num(raw.nextDamageShield),
      remainingValueBonus: num(raw.remainingValueBonus),
      revealExact: raw.revealExact === true,
      active, outcome,
      bestSettlement: num(raw.bestSettlement),
      completedRuns: num(raw.completedRuns),
      quotaMetRuns: num(raw.quotaMetRuns),
      underRuns: num(raw.underRuns),
      breachRuns: num(raw.breachRuns),
      marks,
    };
  };
  const saveValuation = (st) => store.set(VAL_KEY, JSON.stringify(st));

  /* 新批次：由结果房入口或已完成批次的重进触发。batch 按当前 cycle 生成后再递增，
     使设计矩阵的 cycle 0 行即首批；入口初值写入，本批 ledger/outcome 清空 */
  const startValuation = (entry) => {
    const st = getValuation();
    st.entry = VAL_ENTRIES.includes(entry) ? entry : "neutral";
    st.batch = valBatchFor(st.entry, st.cycle);
    st.cycle = Math.min(VAL_NUM_CAP, st.cycle + 1);
    const init = VAL_ENTRY_INIT[st.entry];
    st.value = init.value;
    st.integrity = init.integrity;
    st.quota = init.quota;
    st.opened = [];
    st.ledger = [];
    st.nextDamageShield = 0;
    st.remainingValueBonus = 0;
    st.revealExact = false;
    st.active = true;
    st.outcome = "";
    saveValuation(st);
  };

  const VAL_RELIC_META = {
    thirteenthClock: { name: "十三时钟", asset: "assets/valuation-thirteenth-clock.webp", base: 2, damage: 1, omen: "钟面多出一格，秒针少走一次。", feedback: "钟替下一件证物少活了一秒。" },
    toothKey: { name: "齿门钥", asset: "assets/valuation-tooth-key.webp", base: 3, damage: 2, omen: "钥匙的齿形与这里每个人的牙都相同。", feedback: "钥匙记住了前面已经打开过几只匣子。" },
    hollowIdol: { name: "空神像", asset: "assets/valuation-hollow-idol.webp", base: 4, damage: 3, omen: "像内没有神，只有一个比外壳更大的空腔。", feedback: "最后一只匣子打开后，空腔把前两件也算进了自己。" },
    blackWaxLung: { name: "黑蜡肺", asset: "assets/valuation-black-wax-lung.webp", base: 2, damage: 2, omen: "它只在别人停止呼吸时起伏。", feedback: "肺替还没打开的匣子各吸进一点价值。" },
    unopenedEye: { name: "未睁之眼", asset: "assets/valuation-unopened-eye.webp", base: 1, damage: 1, omen: "眼皮内侧写着柜台正在隐瞒的数字。", feedback: "闭着的眼把剩余数字看得一清二楚。" },
    receiptBone: { name: "无主回执骨", asset: "assets/valuation-receipt-bone.webp", base: 2, damage: 0, omen: "骨头两端都盖着退件章，中间没有身体。", feedback: "没有收件人的骨头，被按普通附件计价。", feedbackShaft: "退件章被估值室当成了两次所有权转移。" },
  };

  /* 目录入口：首次到访后原子恢复，未访问保持 hidden 不可聚焦 */
  const VAL_LINKS = { "unclaimed-valuation": "#valuation-link", "quota-elevator": "#elevator-link" };
  const syncValuationLinks = () => {
    const st = getValuation();
    VAL_SCENES.forEach((s) => {
      const link = $(VAL_LINKS[s]);
      if (!link) return;
      if (st.visited[VAL_VISIT_KEY[s]]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  const markValuationVisited = (sceneKey) => {
    const st = getValuation();
    const key = VAL_VISIT_KEY[sceneKey];
    if (!key || st.visited[key]) return;
    st.visited[key] = true;
    saveValuation(st);
    syncValuationLinks();
  };

  const paintValuationSlip = (st) => {
    const valueEl = $("#val-stat-value");
    const integrityEl = $("#val-stat-integrity");
    const quotaEl = $("#val-stat-quota");
    const bestEl = $("#val-stat-best");
    const breachEl = $("#val-stat-breach");
    if (valueEl) valueEl.textContent = st.value;
    if (integrityEl) integrityEl.textContent = st.integrity;
    if (quotaEl) quotaEl.textContent = st.quota;
    if (bestEl) bestEl.textContent = st.bestSettlement;
    if (breachEl) breachEl.textContent = st.breachRuns;
  };

  /* 未估值只显示名称与征兆；未睁之眼揭示剩余准确数字；已估值锁定并显示实收 */
  const paintValuationRelics = (st) => {
    st.batch.forEach((relic, i) => {
      const meta = VAL_RELIC_META[relic];
      const btn = $("#val-relic-" + i);
      const img = $("#val-relic-img-" + i);
      const nameEl = $("#val-relic-name-" + i);
      const omenEl = $("#val-relic-omen-" + i);
      const resultEl = $("#val-relic-result-" + i);
      if (!btn || !meta) return;
      /* 当前批次卡图必须可靠加载解码：eager 加载 + 换批时先隐去旧图，
         新图解码完成再现身——不留白、不闪旧图、不错位 */
      if (img) {
        const showImg = () => img.classList.remove("is-loading");
        if (img.getAttribute("src") !== meta.asset) {
          img.classList.add("is-loading");
          img.addEventListener("load", showImg, { once: true });
          img.setAttribute("src", meta.asset);
          if (img.complete && img.naturalWidth > 0) showImg();
        } else {
          showImg();
        }
      }
      if (nameEl) nameEl.textContent = meta.name;
      const ledgerEntry = st.ledger.find((l) => l.relic === relic);
      const isOpen = st.opened.includes(relic);
      if (isOpen && ledgerEntry) {
        if (omenEl) omenEl.textContent = meta.omen;
        if (resultEl) resultEl.textContent = `+${ledgerEntry.valueGain} · 封印 -${ledgerEntry.damageTaken}`;
        btn.disabled = true;
        btn.setAttribute("aria-label", `${meta.name}，已估值：+${ledgerEntry.valueGain}，封印 -${ledgerEntry.damageTaken}`);
      } else {
        if (st.revealExact) {
          const gain = meta.base + st.remainingValueBonus
            + (relic === "toothKey" ? st.opened.length : 0)
            + (relic === "hollowIdol" && st.opened.length === 2 ? 2 : 0)
            + (relic === "receiptBone" && st.entry === "shaft" ? 2 : 0);
          const damage = Math.max(0, meta.damage - st.nextDamageShield);
          if (omenEl) omenEl.textContent = meta.omen;
          if (resultEl) resultEl.textContent = `预计 +${gain} · 封印 -${damage}`;
        } else {
          if (omenEl) omenEl.textContent = meta.omen;
          if (resultEl) resultEl.textContent = "";
        }
        btn.disabled = !st.active || st.outcome !== "";
        btn.setAttribute("aria-label", `${meta.name}，${meta.omen}`);
      }
    });
  };

  const paintValuationSettle = (st) => {
    const btn = $("#val-settle");
    if (!btn) return;
    btn.disabled = !(st.active && st.outcome === "" && st.opened.length >= 1);
  };

  const paintValuation = () => {
    const st = getValuation();
    paintValuationSlip(st);
    paintValuationRelics(st);
    paintValuationSettle(st);
  };

  /* 进入估值室：已完成（含已分流）的批次以 neutral 开新批次；
     正在进行的批次原位恢复；直达开 neutral 首批，不自动估值、不自动结算 */
  const enterValuation = () => {
    markValuationVisited("unclaimed-valuation");
    const st = getValuation();
    if (!st.active || st.outcome !== "") startValuation("neutral");
    const responseEl = $("#valuation-response");
    if (responseEl) responseEl.textContent = "";
    paintValuation();
  };

  /* 结算：每批只允许完成一次，由 active/outcome 守卫保证；
     满额进定额电梯、未满回回返夹道、破封坠回误报井 */
  const settleValuation = (st, kind) => {
    st.completedRuns = Math.min(VAL_NUM_CAP, st.completedRuns + 1);
    st.active = false;
    st.outcome = kind;
    const responseEl = $("#valuation-response");
    let target;
    if (kind === "quota") {
      st.quotaMetRuns = Math.min(VAL_NUM_CAP, st.quotaMetRuns + 1);
      st.bestSettlement = Math.max(st.bestSettlement, st.value);
      target = "quota-elevator";
      if (responseEl) responseEl.textContent = "定额计合上了盖子。电梯为这批东西下来。";
    } else if (kind === "under") {
      st.underRuns = Math.min(VAL_NUM_CAP, st.underRuns + 1);
      st.bestSettlement = Math.max(st.bestSettlement, st.value);
      target = "return-passage";
      if (responseEl) responseEl.textContent = "定额未满。估值室开始退货。";
    } else {
      st.breachRuns = Math.min(VAL_NUM_CAP, st.breachRuns + 1);
      target = "false-positive-shaft";
      if (responseEl) responseEl.textContent = "封印破了。估值室不再听你说话。";
    }
    saveValuation(st);
    paintValuation();
    AutoAdvance.schedule("unclaimed-valuation", target, { delay: branchDelay() });
  };

  /* 估值一件：最先被接受的点击立即锁定该证物，连点/竞争动作忽略；
     先结算当前加成，再扣除经十三时钟修正后的封印损耗 */
  const valuateRelic = (idx) => {
    if (AutoAdvance.has("unclaimed-valuation") || AutoAdvance.has("valuation-batch")) return;
    const st = getValuation();
    if (!st.active || st.outcome !== "" || st.integrity <= 0) return;
    const relic = st.batch[idx];
    const meta = relic && VAL_RELIC_META[relic];
    if (!meta || st.opened.includes(relic)) return;
    let gain = meta.base + st.remainingValueBonus;
    let effect = "";
    if (relic === "toothKey" && st.opened.length > 0) { gain += st.opened.length; effect = "orderBonus"; }
    if (relic === "hollowIdol" && st.opened.length === 2) { gain += 2; effect = "thirdBonus"; }
    if (relic === "receiptBone" && st.entry === "shaft") { gain += 2; effect = "shaftBonus"; }
    const damage = Math.max(0, meta.damage - st.nextDamageShield);
    st.nextDamageShield = 0;
    if (relic === "thirteenthClock") { st.nextDamageShield = 1; effect = "shieldNext"; }
    if (relic === "blackWaxLung") { st.remainingValueBonus += 1; effect = "boostRemaining"; }
    if (relic === "unopenedEye") { st.revealExact = true; effect = "reveal"; }
    st.value += gain;
    st.integrity = Math.max(0, st.integrity - damage);
    st.opened.push(relic);
    st.ledger.push({ relic, valueGain: gain, damageTaken: damage, effect });
    if (!st.marks.includes(relic)) st.marks.push(relic);
    const responseEl = $("#valuation-response");
    if (responseEl) responseEl.textContent = relic === "receiptBone" && st.entry === "shaft" ? meta.feedbackShaft : meta.feedback;
    AudioEngine.knock(0.16);

    if (st.integrity <= 0) {
      settleValuation(st, "breach");
      return;
    }
    if (st.opened.length >= 3) {
      settleValuation(st, st.value >= st.quota ? "quota" : "under");
      return;
    }
    saveValuation(st);
    paintValuation();
    /* 批次锁：0.7–1.0s（reduced 0.3s）后解除，不切换页面；
       与盖章锁、跨场景转场分 scope，离场由 clearAll 一并清除 */
    AutoAdvance.schedule("valuation-batch", "unclaimed-valuation", { delay: branchDelay(), before: () => {} });
  };

  VAL_RELICS.forEach((_, i) => {
    const btn = $("#val-relic-" + i);
    if (btn) btn.addEventListener("click", () => valuateRelic(i));
  });

  /* 盖章结算：主动止损，不是继续按钮；至少估值一件后随时可用。
     批次锁只约束剩余证物，不阻止盖章——已接受的估值均已持久化 */
  const settleBtn = $("#val-settle");
  if (settleBtn) settleBtn.addEventListener("click", () => {
    if (AutoAdvance.has("unclaimed-valuation")) return;
    const st = getValuation();
    if (!st.active || st.outcome !== "" || st.opened.length === 0) return;
    settleValuation(st, st.value >= st.quota ? "quota" : "under");
  });

  /* v33 两个结果房的第四入口：只附加入口，与原动作共用各自场景首选锁 */
  const VAL_ENTRY_META = {
    "evidence-vault": { btn: "#vault-choice-valuation", entry: "vault", mark: "sentEvidenceToValuation", responseEl: "#vault-response", response: "未封存的证物被搬上估值柜台。" },
    "false-positive-shaft": { btn: "#shaft-choice-valuation", entry: "shaft", mark: "declaredRejectAsAsset", responseEl: "#shaft-response", response: "退件被钉上资产标签，送去估值。" },
  };

  const paintValuationEntry = (sceneKey) => {
    const meta = VAL_ENTRY_META[sceneKey];
    if (!meta) return;
    const btn = $(meta.btn);
    if (btn) btn.setAttribute("aria-pressed", getValuation().marks.includes(meta.mark) ? "true" : "false");
  };

  const chooseValuationEntry = (sceneKey) => {
    const meta = VAL_ENTRY_META[sceneKey];
    if (!meta) return;
    if (AutoAdvance.has(sceneKey)) return;
    startValuation(meta.entry);
    const st = getValuation();
    if (!st.marks.includes(meta.mark)) st.marks.push(meta.mark);
    saveValuation(st);
    paintValuationEntry(sceneKey);
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = meta.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, "unclaimed-valuation", { delay: branchDelay() });
  };

  Object.keys(VAL_ENTRY_META).forEach((sceneKey) => {
    const btn = $(VAL_ENTRY_META[sceneKey].btn);
    if (btn) btn.addEventListener("click", () => chooseValuationEntry(sceneKey));
  });

  /* 一次性回流反馈：未满定额回到回返夹道时展示一次，随即消费 outcome */
  const paintValuationUnderReturn = (sceneKey, responseEl) => {
    if (sceneKey !== "return-passage") return;
    const st = getValuation();
    if (st.outcome !== "under") return;
    if (responseEl) responseEl.textContent = "估值室退回了这批东西。欠额被写在夹道背面。";
    st.outcome = "";
    saveValuation(st);
  };

  /* 一次性回流反馈：破封坠回误报井时展示一次，随即消费 outcome */
  const paintValuationBreachReturn = (sceneKey, responseEl) => {
    if (sceneKey !== "false-positive-shaft") return;
    const st = getValuation();
    if (st.outcome !== "breach") return;
    if (responseEl) responseEl.textContent = "破损证物比工单先落到底部。回收井把裂口登记在你名下。";
    st.outcome = "";
    saveValuation(st);
  };

  /* 定额电梯：点击即反馈并自动转场，无第二个继续按钮 */
  const ELEVATOR_META = {
    sentQuotaToVestibule: { btn: "#elevator-choice-vestibule", target: "unnumbered-vestibule", response: "货梯停在没有编号的一层，门比轿厢先打开。" },
    crossedBrokenFloorScale: { btn: "#elevator-choice-scale", target: "return-passage", response: "红针指向墙内，回返夹道从刻度后面经过。" },
    droppedQuotaIntoCorridor: { btn: "#elevator-choice-corridor", target: "corridor", response: "证物箱先落进经文，轿厢随后才找到楼层。" },
  };

  const paintElevator = () => {
    const st = getValuation();
    Object.keys(ELEVATOR_META).forEach((mark) => {
      const btn = $(ELEVATOR_META[mark].btn);
      if (btn) btn.setAttribute("aria-pressed", st.marks.includes(mark) ? "true" : "false");
    });
  };

  const enterElevator = () => {
    markValuationVisited("quota-elevator");
    const responseEl = $("#elevator-response");
    if (responseEl) responseEl.textContent = "";
    paintElevator();
    /* v35：高信号落点一次性反馈；恢复第四入口的 aria-pressed */
    consumeFloorOutcome("high", responseEl);
    paintFloorEntry("quota-elevator");
  };

  const chooseElevator = (mark) => {
    const meta = ELEVATOR_META[mark];
    if (!meta) return;
    if (AutoAdvance.has("quota-elevator")) return;
    const st = getValuation();
    if (!st.marks.includes(mark)) st.marks.push(mark);
    saveValuation(st);
    paintElevator();
    const responseEl = $("#elevator-response");
    if (responseEl) responseEl.textContent = meta.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule("quota-elevator", meta.target, { delay: branchDelay() });
  };

  Object.keys(ELEVATOR_META).forEach((mark) => {
    const btn = $(ELEVATOR_META[mark].btn);
    if (btn) btn.addEventListener("click", () => chooseElevator(mark));
  });

  /* 痕迹页单行：完成批数 / 满额 / 破损 / 最佳结算，保持八张统计卡不变 */
  const paintValuationMemory = () => {
    const memory = $("#valuation-memory");
    if (!memory) return;
    const st = getValuation();
    if (!st.visited.valuation && !st.visited.quotaElevator) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `无主估值：完成 ${st.completedRuns} 批，满额 ${st.quotaMetRuns} 批，破损 ${st.breachRuns} 批，最佳结算 ${st.bestSettlement}。`;
    memory.hidden = false;
  };

  /* ============================================================
     v35 无号层：横向枢纽 + 三间值班房 + 缺层电梯
     状态独立存 goddead_v35_unnumbered_floor，容错坏 JSON；
     不读不写 v28–v34 与主线状态；同轮同房只结算一次；
     点击即执行，无确认页、无继续按钮、无新结局。
     ============================================================ */
  const FLOOR_KEY = "goddead_v35_unnumbered_floor";
  const FLOOR_SCENES = ["unnumbered-floor", "bellless-ward", "seeping-records", "reverse-laundry", "night-shift-registry"];
  const FLOOR_DUTY_SCENES = ["bellless-ward", "seeping-records", "reverse-laundry"];
  const FLOOR_ENTRIES = ["neutral", "vestibule", "quota", "passage", "floor"];
  const FLOOR_ROOMS = ["ward", "records", "laundry"];
  const FLOOR_MARKS = [
    "pressedMissingBasementFloor", "stoppedNeedleAtUnmarkedFloor",
    "heardMuteNightstand", "changedBreathingBedding", "crawledIVTubeIntoWall",
    "driedNamelessPage", "drankSeepedInk", "letRecordsSinkFurther",
    "cutLeadingDrum", "woreReflectionlessUniform", "brushedMirrorCabinWithOldPlate",
    "caughtTomorrowPermit", "openedNightShiftRegistry",
    "borrowedMuteBellPermit", "claimedBlankNamePermit", "signedReverseBadge",
  ];
  const FLOOR_VISIT_KEY = { "unnumbered-floor": "floor", "bellless-ward": "ward", "seeping-records": "records", "reverse-laundry": "laundry", "night-shift-registry": "nightShiftRegistry" };
  const FLOOR_OUTCOMES = ["", "high", "review", "debt"];
  const FLOOR_NUM_CAP = 9999;
  const FLOOR_SIGNAL_CAP = 12; /* 3+4+3 + 无铃证 +2：本轮理论上限 */
  const FLOOR_DEBT_CAP = 8;    /* 1+2+1 + 反面工牌 +4 */
  /* v36 值班证：permit 与修正值必须互相一致，permitCycle 必须与当前 cycle 一致 */
  const FLOOR_PERMITS = ["none", "muteBell", "blankName", "reverseBadge"];
  const FLOOR_PERMIT_VALUES = { none: [0, 0], muteBell: [2, 0], blankName: [0, 2], reverseBadge: [0, 4] };

  const getFloor = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(FLOOR_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const visited = {};
    Object.values(FLOOR_VISIT_KEY).forEach((k) => {
      visited[k] = Boolean(raw.visited && raw.visited[k] === true);
    });
    const entry = FLOOR_ENTRIES.includes(raw.entry) ? raw.entry : "neutral";
    const num = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n) || n < 0) n = 0;
      return Math.min(FLOOR_NUM_CAP, Math.floor(n));
    };
    let cycle = num(raw.cycle);
    if (cycle < 1) cycle = 1;
    const completed = Array.isArray(raw.completed)
      ? [...new Set(raw.completed.filter((r) => FLOOR_ROOMS.includes(r)))].slice(0, 3)
      : [];
    let settled = raw.settled === true;
    let outcome = FLOOR_OUTCOMES.includes(raw.outcome) ? raw.outcome : "";
    /* 过期组合归一：无结算标记不保留 outcome；不足两房的结算视为过期 */
    if (!settled) outcome = "";
    if (settled && completed.length < 2) { settled = false; outcome = ""; }
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => FLOOR_MARKS.includes(m)))].slice(0, FLOOR_MARKS.length)
      : [];
    /* v36 值班证字段：旧 v35 存档安全默认 none/0/0；
       非法组合或过期证件（permitCycle 与当前 cycle 不一致）归一为 none */
    let permit = FLOOR_PERMITS.includes(raw.permit) ? raw.permit : "none";
    let permitSignal = num(raw.permitSignal);
    let permitDebt = num(raw.permitDebt);
    const permitCycle = num(raw.permitCycle);
    const permitValues = FLOOR_PERMIT_VALUES[permit];
    if (permitSignal !== permitValues[0] || permitDebt !== permitValues[1] || permitCycle !== cycle) {
      permit = "none";
      permitSignal = 0;
      permitDebt = 0;
    }
    return {
      visited, entry, cycle, completed, settled, outcome,
      signal: Math.min(FLOOR_SIGNAL_CAP, num(raw.signal)),
      debt: Math.min(FLOOR_DEBT_CAP, num(raw.debt)),
      completedRuns: num(raw.completedRuns),
      highRuns: num(raw.highRuns),
      reviewRuns: num(raw.reviewRuns),
      debtRuns: num(raw.debtRuns),
      bestRoute: num(raw.bestRoute),
      permit, permitSignal, permitDebt, permitCycle: permit === "none" ? cycle : permitCycle,
      permitRuns: num(raw.permitRuns),
      muteBellRuns: num(raw.muteBellRuns),
      blankNameRuns: num(raw.blankNameRuns),
      reverseBadgeRuns: num(raw.reverseBadgeRuns),
      marks,
    };
  };
  const saveFloor = (st) => store.set(FLOOR_KEY, JSON.stringify(st));

  /* 目录入口：首次到访后原子恢复，未访问保持 hidden 不可聚焦 */
  const FLOOR_LINKS = { "unnumbered-floor": "#floor-link", "bellless-ward": "#ward-link", "seeping-records": "#records-link", "reverse-laundry": "#laundry-link", "night-shift-registry": "#registry-link" };
  const syncFloorLinks = () => {
    const st = getFloor();
    FLOOR_SCENES.forEach((s) => {
      const link = $(FLOOR_LINKS[s]);
      if (!link) return;
      if (st.visited[FLOOR_VISIT_KEY[s]]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  const markFloorVisited = (sceneKey) => {
    const st = getFloor();
    const key = FLOOR_VISIT_KEY[sceneKey];
    if (!key || st.visited[key]) return;
    st.visited[key] = true;
    saveFloor(st);
    syncFloorLinks();
  };

  const FLOOR_SLIP_IDS = {
    "unnumbered-floor": "floor",
    "bellless-ward": "ward",
    "seeping-records": "records",
    "reverse-laundry": "laundry",
  };
  const paintFloorSlip = (sceneKey, st) => {
    const p = FLOOR_SLIP_IDS[sceneKey];
    if (!p) return;
    const completedEl = $(`#${p}-stat-completed`);
    const signalEl = $(`#${p}-stat-signal`);
    const debtEl = $(`#${p}-stat-debt`);
    if (completedEl) completedEl.textContent = `${st.completed.length}/3`;
    if (signalEl) signalEl.textContent = st.signal;
    if (debtEl) debtEl.textContent = st.debt;
    const bestEl = $("#floor-stat-best");
    if (sceneKey === "unnumbered-floor" && bestEl) bestEl.textContent = st.bestRoute;
  };

  /* 值班房动作：前两条为本房值班（同轮只接受第一次并记入 completed），
     第三条为无收益穿行/离开；全部首选锁 + 短反馈 + 自动转场 */
  const FLOOR_ROOM_META = {
    "bellless-ward": {
      responseEl: "#ward-response",
      choices: {
        heardMuteNightstand: { btn: "#ward-choice-listen", duty: true, signal: 2, debt: 0, target: "reverse-laundry", response: "没有铃声。床头柜里却有人先说了“收到”。" },
        changedBreathingBedding: { btn: "#ward-choice-sheet", duty: true, signal: 3, debt: 1, target: "unnumbered-floor", response: "床单被下面不存在的胸口顶起，又慢慢落下。" },
        crawledIVTubeIntoWall: { btn: "#ward-choice-tube", duty: false, target: "seeping-records", response: "输液管把你当作一滴过大的药，送进潮湿的墙后。" },
      },
    },
    "seeping-records": {
      responseEl: "#records-response",
      choices: {
        driedNamelessPage: { btn: "#records-choice-dry", duty: true, signal: 2, debt: 0, target: "unnumbered-floor", response: "纸干了。你的名字却从背面慢慢渗出来。" },
        drankSeepedInk: { btn: "#records-choice-drink", duty: true, signal: 4, debt: 2, target: "bellless-ward", response: "墨水记住了你的喉咙，档案池暂时忘了你的名字。" },
        letRecordsSinkFurther: { btn: "#records-choice-sink", duty: false, target: "unnumbered-vestibule", response: "档案井下降一格，上方的无号前厅跟着空出一层。" },
      },
    },
    "reverse-laundry": {
      responseEl: "#laundry-response",
      choices: {
        cutLeadingDrum: { btn: "#laundry-choice-drum", duty: true, signal: 2, debt: 0, target: "seeping-records", response: "滚筒停了。里面那件衣服还在继续转身。" },
        woreReflectionlessUniform: { btn: "#laundry-choice-uniform", duty: true, signal: 3, debt: 1, target: "unnumbered-floor", response: "镜面里少了一个人，工服里却多了一次呼吸。" },
        brushedMirrorCabinWithOldPlate: { btn: "#laundry-choice-mirror", duty: false, target: "glyph-niche", response: "镜面认得这个号码，把你送回失号龛继续遗失。" },
      },
    },
  };

  const paintFloorRoom = (sceneKey) => {
    const meta = FLOOR_ROOM_META[sceneKey];
    const st = getFloor();
    const room = FLOOR_VISIT_KEY[sceneKey];
    Object.keys(meta.choices).forEach((mark) => {
      const choice = meta.choices[mark];
      const btn = $(choice.btn);
      if (!btn) return;
      /* 已完成房间的两条值班动作 disabled 保留可见，穿行/离开动作继续可用 */
      btn.disabled = choice.duty && (st.settled || st.completed.includes(room));
      btn.setAttribute("aria-pressed", st.marks.includes(mark) ? "true" : "false");
    });
    paintFloorSlip(sceneKey, st);
  };

  const enterFloorRoom = (sceneKey) => {
    markFloorVisited(sceneKey);
    const meta = FLOOR_ROOM_META[sceneKey];
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = "";
    paintFloorRoom(sceneKey);
    /* v37：恢复现场回拨按钮的 pending/completed 状态（只读 v37 键） */
    paintCallbackRoom(sceneKey);
  };

  const chooseFloorAction = (sceneKey, mark) => {
    const meta = FLOOR_ROOM_META[sceneKey];
    const choice = meta && meta.choices[mark];
    if (!choice) return;
    if (AutoAdvance.has(sceneKey)) return;
    const st = getFloor();
    const room = FLOOR_VISIT_KEY[sceneKey];
    if (choice.duty) {
      /* 同轮同房只结算一次；本轮已结算（settled）不再接受值班 */
      if (st.settled || st.completed.includes(room)) return;
      st.signal = Math.min(FLOOR_SIGNAL_CAP, st.signal + choice.signal);
      st.debt = Math.min(FLOOR_DEBT_CAP, st.debt + choice.debt);
      st.completed.push(room);
    }
    if (!st.marks.includes(mark)) st.marks.push(mark);
    saveFloor(st);
    paintFloorRoom(sceneKey);
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = choice.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, choice.target, { delay: branchDelay() });
  };

  FLOOR_DUTY_SCENES.forEach((sceneKey) => {
    const meta = FLOOR_ROOM_META[sceneKey];
    Object.keys(meta.choices).forEach((mark) => {
      const btn = $(meta.choices[mark].btn);
      if (btn) btn.addEventListener("click", () => chooseFloorAction(sceneKey, mark));
    });
  });

  /* 大厅三扇门与夜班登记窗：始终可选，已完成房间仍可重访 */
  const FLOOR_DOORS = {
    "floor-door-ward": { target: "bellless-ward", response: "门后没有铃声。" },
    "floor-door-records": { target: "seeping-records", response: "门后在渗水。" },
    "floor-door-laundry": { target: "reverse-laundry", response: "门后滚筒先停了。" },
    "floor-door-registry": { target: "night-shift-registry", response: "地面少了一块砖，登记窗从下面升了起来。", mark: "openedNightShiftRegistry", entry: "floor" },
  };

  const paintFloorHub = () => {
    const st = getFloor();
    paintFloorSlip("unnumbered-floor", st);
    const btn = $("#floor-elevator-btn");
    const label = $("#floor-elevator-label");
    if (btn && label) {
      const ready = !st.settled && st.completed.length >= 2;
      btn.disabled = !ready;
      label.textContent = ready ? "召回没有楼层的电梯" : "缺层电梯仍封死";
    }
  };

  /* 进入大厅：已结算的上一轮在此开新轮（cycle+1，本轮清空，累计保留；
     outcome 随旧轮一并消费）；直接 hash 只记 visited，不自动动作 */
  const enterFloor = () => {
    markFloorVisited("unnumbered-floor");
    const st = getFloor();
    if (st.settled) {
      st.cycle = Math.min(FLOOR_NUM_CAP, st.cycle + 1);
      st.completed = [];
      st.signal = 0;
      st.debt = 0;
      st.settled = false;
      st.outcome = "";
      /* v36：新 cycle 同时清空值班证，累计领证次数保留 */
      st.permit = "none";
      st.permitSignal = 0;
      st.permitDebt = 0;
      st.permitCycle = st.cycle;
      saveFloor(st);
    }
    const responseEl = $("#floor-response");
    if (responseEl) responseEl.textContent = "";
    paintFloorHub();
  };

  Object.keys(FLOOR_DOORS).forEach((id) => {
    const btn = $("#" + id);
    const door = FLOOR_DOORS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (AutoAdvance.has("unnumbered-floor")) return;
      /* v36 登记窗：与三门共用大厅首选锁，点击即记 mark 与 entry */
      if (door.mark) {
        const st = getFloor();
        st.entry = door.entry;
        if (!st.marks.includes(door.mark)) st.marks.push(door.mark);
        saveFloor(st);
        btn.setAttribute("aria-pressed", "true");
      }
      const responseEl = $("#floor-response");
      if (responseEl) responseEl.textContent = door.response;
      AudioEngine.knock(0.16);
      AutoAdvance.schedule("unnumbered-floor", door.target, { delay: branchDelay() });
    });
  });

  /* 缺层电梯：完成任意两房解锁；只结算一次，routeScore = max(0, 信号 - 门债) 三档分流 */
  const floorElevatorBtn = $("#floor-elevator-btn");
  if (floorElevatorBtn) floorElevatorBtn.addEventListener("click", () => {
    if (AutoAdvance.has("unnumbered-floor")) return;
    const st = getFloor();
    if (st.settled || st.completed.length < 2) return;
    const routeScore = Math.max(0, st.signal - st.debt);
    st.completedRuns = Math.min(FLOOR_NUM_CAP, st.completedRuns + 1);
    st.bestRoute = Math.max(st.bestRoute, routeScore);
    const responseEl = $("#floor-response");
    let target;
    if (routeScore >= 4) {
      st.highRuns = Math.min(FLOOR_NUM_CAP, st.highRuns + 1);
      st.outcome = "high";
      target = "quota-elevator";
      if (responseEl) responseEl.textContent = "缺层电梯认出了你的信号，把你抬回仍有定额的高度。";
    } else if (routeScore >= 2) {
      st.reviewRuns = Math.min(FLOOR_NUM_CAP, st.reviewRuns + 1);
      st.outcome = "review";
      target = "anomaly-review";
      if (responseEl) responseEl.textContent = "这条路线没有编号，只能先交给复核科承认。";
    } else {
      st.debtRuns = Math.min(FLOOR_NUM_CAP, st.debtRuns + 1);
      st.outcome = "debt";
      target = "return-passage";
      if (responseEl) responseEl.textContent = "门债比楼层更重。电梯把你吐回写着“回来”的夹道。";
    }
    st.settled = true;
    saveFloor(st);
    paintFloorHub();
    AudioEngine.knock(0.16);
    AutoAdvance.schedule("unnumbered-floor", target, { delay: branchDelay() });
  });

  /* 两处入口：前厅第五动作与定额电梯第四动作，与所在场景共用首选锁 */
  const FLOOR_ENTRY_META = {
    "unnumbered-vestibule": { btn: "#vestibule-choice-floor", entry: "vestibule", mark: "pressedMissingBasementFloor", responseEl: "#vestibule-response", response: "按钮没有下沉。整座前厅却往上抬了一层。" },
    "quota-elevator": { btn: "#elevator-choice-floor", entry: "quota", mark: "stoppedNeedleAtUnmarkedFloor", responseEl: "#elevator-response", response: "指针越过零，停在一块没有被刻出来的黄铜上。" },
    "return-passage": { btn: "#return-choice-registry", entry: "passage", mark: "caughtTomorrowPermit", responseEl: "#return-response", response: "墙缝吐出一张盖着明日日期的值班证，背面写着无号层。", target: "night-shift-registry" },
  };

  const paintFloorEntry = (sceneKey) => {
    const meta = FLOOR_ENTRY_META[sceneKey];
    if (!meta) return;
    const btn = $(meta.btn);
    if (btn) btn.setAttribute("aria-pressed", getFloor().marks.includes(meta.mark) ? "true" : "false");
  };

  const chooseFloorEntry = (sceneKey) => {
    const meta = FLOOR_ENTRY_META[sceneKey];
    if (!meta) return;
    if (AutoAdvance.has(sceneKey)) return;
    const st = getFloor();
    st.entry = meta.entry;
    if (!st.marks.includes(meta.mark)) st.marks.push(meta.mark);
    saveFloor(st);
    paintFloorEntry(sceneKey);
    addAnnexDebt(meta.btn);
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = meta.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, meta.target || "unnumbered-floor", { delay: branchDelay() });
  };

  Object.keys(FLOOR_ENTRY_META).forEach((sceneKey) => {
    const btn = $(FLOOR_ENTRY_META[sceneKey].btn);
    if (btn) btn.addEventListener("click", () => chooseFloorEntry(sceneKey));
  });

  /* 三档落点一次性反馈：高信号回定额电梯、中间值交复核科（强制 neutral 新轮）、
     低值坠回回返夹道；展示一次即消费 outcome */
  const consumeFloorOutcome = (tier, responseEl) => {
    const st = getFloor();
    if (st.outcome !== tier) return false;
    if (tier === "high" && responseEl) responseEl.textContent = "缺层电梯认出了你的信号，把你抬回仍有定额的高度。";
    if (tier === "review" && responseEl) responseEl.textContent = "这条路线没有编号，只能先交给复核科承认。";
    if (tier === "debt" && responseEl) responseEl.textContent = "门债比楼层更重。电梯把你吐回写着“回来”的夹道。";
    st.outcome = "";
    saveFloor(st);
    return true;
  };

  /* ============================================================
     v36 夜班登记所：每 cycle 限领一张值班证，领取立即加值并自动回大厅
     ============================================================ */
  const REGISTRY_META = {
    muteBell: { btn: "#permit-choice-mute-bell", resultEl: "#permit-result-mute-bell", name: "无铃证", signal: 2, debt: 0, mark: "borrowedMuteBellPermit", counter: "muteBellRuns", response: "空铃在证背摇了一下，没有出声。楼层信号多认了你两次。" },
    blankName: { btn: "#permit-choice-blank-name", resultEl: "#permit-result-blank-name", name: "失名牌", signal: 0, debt: 2, mark: "claimedBlankNamePermit", counter: "blankNameRuns", response: "号牌没有名字，门债却把你的姓名写了两遍。" },
    reverseBadge: { btn: "#permit-choice-reverse-badge", resultEl: "#permit-result-reverse-badge", name: "反面工牌", signal: 0, debt: 4, mark: "signedReverseBadge", counter: "reverseBadgeRuns", response: "你在背面签字。正面的四道门同时记住了这笔债。" },
  };
  const REGISTRY_PERMIT_LABEL = { none: "未领", muteBell: "无铃证", blankName: "失名牌", reverseBadge: "反面工牌" };

  const paintRegistry = () => {
    const st = getFloor();
    const permitEl = $("#registry-stat-permit");
    const signalEl = $("#registry-stat-signal");
    const debtEl = $("#registry-stat-debt");
    const bestEl = $("#registry-stat-best");
    if (permitEl) permitEl.textContent = REGISTRY_PERMIT_LABEL[st.permit];
    if (signalEl) signalEl.textContent = st.permitSignal;
    if (debtEl) debtEl.textContent = st.permitDebt;
    if (bestEl) bestEl.textContent = st.bestRoute;
    const claimed = st.permit !== "none";
    Object.keys(REGISTRY_META).forEach((key) => {
      const meta = REGISTRY_META[key];
      const btn = $(meta.btn);
      const resultEl = $(meta.resultEl);
      if (!btn) return;
      btn.disabled = claimed;
      btn.setAttribute("aria-pressed", st.permit === key ? "true" : "false");
      if (resultEl) resultEl.textContent = st.permit === key ? `已领 · +${meta.signal} / 门债 +${meta.debt}` : "";
    });
  };

  /* 进入登记所：从已 settled 状态进入先开 v35 新 cycle 再允许领证；
     直接 hash 只记 visited，不自动领取 */
  const enterRegistry = () => {
    markFloorVisited("night-shift-registry");
    const st = getFloor();
    if (st.settled) {
      st.cycle = Math.min(FLOOR_NUM_CAP, st.cycle + 1);
      st.completed = [];
      st.signal = 0;
      st.debt = 0;
      st.settled = false;
      st.outcome = "";
      st.permit = "none";
      st.permitSignal = 0;
      st.permitDebt = 0;
      st.permitCycle = st.cycle;
      saveFloor(st);
    }
    const responseEl = $("#registry-response");
    if (responseEl) responseEl.textContent = "";
    paintRegistry();
  };

  /* 领取一张值班证：第一次合法选择立即写入并加值，三卡竞争/连点/Enter/Space
     只认第一张；同一 cycle 不得再次领取或重复加值 */
  const claimPermit = (permitKey) => {
    const meta = REGISTRY_META[permitKey];
    if (!meta) return;
    if (AutoAdvance.has("night-shift-registry")) return;
    const st = getFloor();
    if (st.settled || st.permit !== "none") return;
    st.signal = Math.min(FLOOR_SIGNAL_CAP, st.signal + meta.signal);
    st.debt = Math.min(FLOOR_DEBT_CAP, st.debt + meta.debt);
    st.permit = permitKey;
    st.permitSignal = meta.signal;
    st.permitDebt = meta.debt;
    st.permitCycle = st.cycle;
    st.permitRuns = Math.min(FLOOR_NUM_CAP, st.permitRuns + 1);
    st[meta.counter] = Math.min(FLOOR_NUM_CAP, st[meta.counter] + 1);
    if (!st.marks.includes(meta.mark)) st.marks.push(meta.mark);
    saveFloor(st);
    paintRegistry();
    const responseEl = $("#registry-response");
    if (responseEl) responseEl.textContent = meta.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule("night-shift-registry", "unnumbered-floor", { delay: branchDelay() });
  };

  Object.keys(REGISTRY_META).forEach((permitKey) => {
    const btn = $(REGISTRY_META[permitKey].btn);
    if (btn) btn.addEventListener("click", () => claimPermit(permitKey));
  });

  /* 痕迹页单行：领证次数与三张分布，保持八张统计卡不变 */
  const paintRegistryMemory = () => {
    const memory = $("#registry-memory");
    if (!memory) return;
    const st = getFloor();
    if (!st.visited.nightShiftRegistry) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `夜班登记：领证 ${st.permitRuns} 次，无铃 ${st.muteBellRuns}，失名 ${st.blankNameRuns}，反面 ${st.reverseBadgeRuns}。`;
    memory.hidden = false;
  };

  /* 痕迹页单行：完成轮数 / 最佳路线 / 抬回 / 门债遣返，保持八张统计卡不变 */
  const paintFloorMemory = () => {
    const memory = $("#floor-memory");
    if (!memory) return;
    const st = getFloor();
    if (!st.visited.floor && !st.visited.ward && !st.visited.records && !st.visited.laundry) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `无号层值班：完成 ${st.completedRuns} 轮，最佳路线 ${st.bestRoute}，抬回 ${st.highRuns} 次，门债遣返 ${st.debtRuns} 次。`;
    memory.hidden = false;
  };

  /* ============================================================
     v37 午夜回拨台：守则其六 / 回返夹道双入口 + 三线现场回拨
     状态独立存 goddead_v37_midnight_callback，容错坏 JSON；
     不读不写 v28–v34、v35 结算字段与主线状态；
     点击即执行，无确认页、继续按钮或结算按钮。
     ============================================================ */
  const CALLBACK_KEY = "goddead_v37_midnight_callback";
  const CALLBACK_ENTRIES = ["neutral", "protocol", "passage"];
  const CALLBACK_LINES = ["ward", "records", "laundry"];
  const CALLBACK_MARKS = [
    "answeredProtocolSix", "answeredLateWallCall",
    "connectedWardLine", "connectedRecordsLine", "connectedLaundryLine",
    "reportedWardLine", "reportedRecordsLine", "reportedLaundryLine",
  ];
  const CALLBACK_NUM_CAP = 9999;
  const CALLBACK_LINE_VALUES = { ward: [3, 0], records: [2, 1], laundry: [1, 2] };
  const CALLBACK_ROOM_SCENE = { ward: "bellless-ward", records: "seeping-records", laundry: "reverse-laundry" };

  const getCallback = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(CALLBACK_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const visited = { callback: Boolean(raw.visited && raw.visited.callback === true) };
    const entry = CALLBACK_ENTRIES.includes(raw.entry) ? raw.entry : "neutral";
    const num = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n) || n < 0) n = 0;
      return Math.min(CALLBACK_NUM_CAP, Math.floor(n));
    };
    let cycle = num(raw.cycle);
    if (cycle < 1) cycle = 1;
    const completedLines = Array.isArray(raw.completedLines)
      ? [...new Set(raw.completedLines.filter((l) => CALLBACK_LINES.includes(l)))].slice(0, 2)
      : [];
    let pendingLine = raw.pendingLine === "none" || CALLBACK_LINES.includes(raw.pendingLine) ? raw.pendingLine : "none";
    /* pending 不能同时出现在 completedLines */
    if (completedLines.includes(pendingLine)) pendingLine = "none";
    /* 分值必须由 completedLines 唯一重算，不信任存档里的伪造分值 */
    let verification = 0;
    let lineDebt = 0;
    completedLines.forEach((l) => {
      verification += CALLBACK_LINE_VALUES[l][0];
      lineDebt += CALLBACK_LINE_VALUES[l][1];
    });
    /* 不足两条的 settled / outcome 归一为未结算；
       outcome 必须由 completedLines 唯一推导，不信任空白或与组合不匹配的存档值 */
    let derivedOutcome = "";
    if (completedLines.length >= 2) {
      if (completedLines.includes("ward") && completedLines.includes("records")) derivedOutcome = "clear";
      else if (completedLines.includes("ward") && completedLines.includes("laundry")) derivedOutcome = "uncertain";
      else derivedOutcome = "contaminated";
    }
    let settled = raw.settled === true;
    let outcome = derivedOutcome;
    if (completedLines.length < 2) { settled = false; outcome = ""; }
    if (!settled) outcome = "";
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => CALLBACK_MARKS.includes(m)))].slice(0, CALLBACK_MARKS.length)
      : [];
    return {
      visited, entry, cycle, pendingLine, completedLines,
      verification, lineDebt, settled, outcome,
      completedRuns: num(raw.completedRuns),
      clearRuns: num(raw.clearRuns),
      uncertainRuns: num(raw.uncertainRuns),
      contaminatedRuns: num(raw.contaminatedRuns),
      bestRoute: Math.min(4, num(raw.bestRoute)),
      marks,
    };
  };
  const saveCallback = (st) => store.set(CALLBACK_KEY, JSON.stringify(st));

  /* 入口登记：守则其六与回返夹道共用（只写 v37 键） */
  const markCallbackEntry = (entryId) => {
    const st = getCallback();
    st.entry = CALLBACK_ENTRIES.includes(entryId) ? entryId : "neutral";
    const mark = entryId === "protocol" ? "answeredProtocolSix" : "answeredLateWallCall";
    if (!st.marks.includes(mark)) st.marks.push(mark);
    saveCallback(st);
  };

  const syncCallbackLink = () => {
    const link = $("#callback-link");
    if (!link) return;
    if (getCallback().visited.callback) link.removeAttribute("hidden");
    else link.setAttribute("hidden", "");
  };

  const markCallbackVisited = () => {
    const st = getCallback();
    if (st.visited.callback) return;
    st.visited.callback = true;
    saveCallback(st);
    syncCallbackLink();
  };

  const CALLBACK_LINE_META = {
    ward: { btn: "#callback-line-ward", resultEl: "#callback-result-ward", mark: "connectedWardLine", response: "总机把没有铃声的那一段线路塞进你耳后。" },
    records: { btn: "#callback-line-records", resultEl: "#callback-result-records", mark: "connectedRecordsLine", response: "墨水沿电话线爬上来，把这一段接成了潮湿的黑色。" },
    laundry: { btn: "#callback-line-laundry", resultEl: "#callback-result-laundry", mark: "connectedLaundryLine", response: "黄铜线穿过镜面，把你的声音挂进那件工服。" },
  };
  const CALLBACK_REPORT_META = {
    "bellless-ward": { line: "ward", btn: "#ward-choice-callback", mark: "reportedWardLine", response: "你说“没有铃声”。总机记录了三次完全相同的铃响。" },
    "seeping-records": { line: "records", btn: "#records-choice-callback", mark: "reportedRecordsLine", response: "你念出空白姓名栏。总机用你的号码补上了那一格。" },
    "reverse-laundry": { line: "laundry", btn: "#laundry-choice-callback", mark: "reportedLaundryLine", response: "你报告“没有倒影”。滚筒替你留下了两份相反的录音。" },
  };

  const paintCallback = () => {
    const st = getCallback();
    const doneEl = $("#callback-stat-done");
    const verificationEl = $("#callback-stat-verification");
    const debtEl = $("#callback-stat-debt");
    const bestEl = $("#callback-stat-best");
    if (doneEl) doneEl.textContent = `${st.completedLines.length}/2`;
    if (verificationEl) verificationEl.textContent = st.verification;
    if (debtEl) debtEl.textContent = st.lineDebt;
    if (bestEl) bestEl.textContent = st.bestRoute;
    CALLBACK_LINES.forEach((line) => {
      const meta = CALLBACK_LINE_META[line];
      const btn = $(meta.btn);
      const resultEl = $(meta.resultEl);
      if (!btn) return;
      const isPending = st.pendingLine === line;
      const isDone = st.completedLines.includes(line);
      btn.disabled = st.settled || isDone || (st.pendingLine !== "none" && !isPending);
      btn.setAttribute("aria-pressed", isPending || isDone ? "true" : "false");
      if (resultEl) {
        if (isDone) resultEl.textContent = `已回拨 · 核实 +${CALLBACK_LINE_VALUES[line][0]} / 线债 +${CALLBACK_LINE_VALUES[line][1]}`;
        else if (isPending) resultEl.textContent = "接通中 · 在现场等你回拨";
        else resultEl.textContent = "";
      }
    });
  };

  /* 自动结算：完成两条后回到回拨台，一个反馈节拍后按组合分流；
     没有结算按钮、确认页或继续按钮 */
  const settleCallback = () => {
    const st = getCallback();
    if (st.settled || st.completedLines.length < 2) return;
    const routeScore = Math.max(0, st.verification - st.lineDebt);
    st.completedRuns = Math.min(CALLBACK_NUM_CAP, st.completedRuns + 1);
    st.bestRoute = Math.min(4, Math.max(st.bestRoute, routeScore));
    const has = (l) => st.completedLines.includes(l);
    const responseEl = $("#callback-response");
    let target;
    if (has("ward") && has("records")) {
      st.clearRuns = Math.min(CALLBACK_NUM_CAP, st.clearRuns + 1);
      st.outcome = "clear";
      target = "anomaly-review";
      if (responseEl) responseEl.textContent = "两条现场报告互相承认。复核科愿意把这次来电当成证据。";
    } else if (has("ward") && has("laundry")) {
      st.uncertainRuns = Math.min(CALLBACK_NUM_CAP, st.uncertainRuns + 1);
      st.outcome = "uncertain";
      target = "peephole-chamber";
      if (responseEl) responseEl.textContent = "两条线路只对上了一半。倒置窥孔要求亲眼再看一次。";
    } else {
      st.contaminatedRuns = Math.min(CALLBACK_NUM_CAP, st.contaminatedRuns + 1);
      st.outcome = "contaminated";
      target = "return-passage";
      if (responseEl) responseEl.textContent = "线债吃掉了全部核实。回返夹道接起第三条线，用你的声音说“回来”。";
    }
    st.settled = true;
    saveCallback(st);
    paintCallback();
    AudioEngine.knock(0.16);
    AutoAdvance.schedule("midnight-callback", target, { delay: branchDelay() });
  };

  /* 进入回拨台：已结算则开新 cycle（pending/completed/分值/outcome 清空，累计保留）；
     正在 pending 或只完成一条时原位恢复；直接 hash 只记 visited，不自动接线 */
  const enterCallback = () => {
    markCallbackVisited();
    const st = getCallback();
    if (st.settled) {
      st.cycle = Math.min(CALLBACK_NUM_CAP, st.cycle + 1);
      st.pendingLine = "none";
      st.completedLines = [];
      st.settled = false;
      st.outcome = "";
      saveCallback(st);
      const responseEl = $("#callback-response");
      if (responseEl) responseEl.textContent = "";
      paintCallback();
      return;
    }
    const responseEl = $("#callback-response");
    if (responseEl) responseEl.textContent = "";
    paintCallback();
    /* 第二次回拨回到台上：自动结算 */
    settleCallback();
  };

  /* 接通一条线路：只写 pending 与 pending mark，不加分值；
     有 pending 时另外两条 disabled；重进回拨台点已接通线路可重新接回现场，
     不重复写 mark、不加分值、不影响计数 */
  const connectLine = (line) => {
    const meta = CALLBACK_LINE_META[line];
    if (!meta) return;
    if (AutoAdvance.has("midnight-callback")) return;
    const st = getCallback();
    if (st.settled || st.completedLines.includes(line)) return;
    if (st.pendingLine !== "none" && st.pendingLine !== line) return;
    const reconnect = st.pendingLine === line;
    if (!reconnect) {
      st.pendingLine = line;
      if (!st.marks.includes(meta.mark)) st.marks.push(meta.mark);
      saveCallback(st);
    }
    paintCallback();
    const responseEl = $("#callback-response");
    if (responseEl) responseEl.textContent = meta.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule("midnight-callback", CALLBACK_ROOM_SCENE[line], { delay: branchDelay() });
  };

  CALLBACK_LINES.forEach((line) => {
    const btn = $(CALLBACK_LINE_META[line].btn);
    if (btn) btn.addEventListener("click", () => connectLine(line));
  });

  /* 现场回拨：与房间既有三动作共用首选锁；回拨成功才入 completedLines、
     加分值、清空 pending 并自动回回拨台；选择既有动作离开时 pending 保留 */
  const paintCallbackRoom = (sceneKey) => {
    const meta = CALLBACK_REPORT_META[sceneKey];
    if (!meta) return;
    const st = getCallback();
    const btn = $(meta.btn);
    if (!btn) return;
    btn.disabled = st.settled || st.pendingLine !== meta.line || st.completedLines.includes(meta.line);
    btn.setAttribute("aria-pressed", st.completedLines.includes(meta.line) ? "true" : "false");
  };

  const reportLine = (sceneKey) => {
    const meta = CALLBACK_REPORT_META[sceneKey];
    if (!meta) return;
    if (AutoAdvance.has(sceneKey)) return;
    const st = getCallback();
    if (st.settled || st.pendingLine !== meta.line || st.completedLines.includes(meta.line)) return;
    st.completedLines.push(meta.line);
    st.pendingLine = "none";
    /* 分值与 completedLines 同步重算后落盘，存档不得残留旧值 */
    st.verification += CALLBACK_LINE_VALUES[meta.line][0];
    st.lineDebt += CALLBACK_LINE_VALUES[meta.line][1];
    if (!st.marks.includes(meta.mark)) st.marks.push(meta.mark);
    saveCallback(st);
    paintCallbackRoom(sceneKey);
    const roomMeta = FLOOR_ROOM_META[sceneKey];
    const responseEl = roomMeta && $(roomMeta.responseEl);
    if (responseEl) responseEl.textContent = meta.response;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule(sceneKey, "midnight-callback", { delay: branchDelay() });
  };

  Object.keys(CALLBACK_REPORT_META).forEach((sceneKey) => {
    const btn = $(CALLBACK_REPORT_META[sceneKey].btn);
    if (btn) btn.addEventListener("click", () => reportLine(sceneKey));
  });

  /* 回返夹道第五入口：与原四动作共用首选锁 */
  const callbackEntryBtn = $("#return-choice-callback");
  if (callbackEntryBtn) callbackEntryBtn.addEventListener("click", () => {
    if (AutoAdvance.has("return-passage")) return;
    markCallbackEntry("passage");
    callbackEntryBtn.setAttribute("aria-pressed", "true");
    const responseEl = $("#return-response");
    if (responseEl) responseEl.textContent = "墙里的电话比铃声晚响了八分钟。听筒正在读守则其六。";
    AudioEngine.knock(0.16);
    AutoAdvance.schedule("return-passage", "midnight-callback", { delay: branchDelay() });
  });

  const paintCallbackEntry = (sceneKey) => {
    if (sceneKey !== "return-passage" || !callbackEntryBtn) return;
    callbackEntryBtn.setAttribute("aria-pressed", getCallback().marks.includes("answeredLateWallCall") ? "true" : "false");
  };

  /* 痕迹页单行：完成轮数 / 清线 / 疑线 / 污线 / 最佳线路，保持八张统计卡不变 */
  const paintCallbackMemory = () => {
    const memory = $("#callback-memory");
    if (!memory) return;
    const st = getCallback();
    if (!st.visited.callback) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `午夜回拨：完成 ${st.completedRuns} 轮，清线 ${st.clearRuns}，疑线 ${st.uncertainRuns}，污线 ${st.contaminatedRuns}，最佳线路 ${st.bestRoute}。`;
    memory.hidden = false;
  };

  /* ============================================================
     v38 门外代审窗：门板第四热点 / 守则其八双入口 + 三问两判
     状态独立存 goddead_v38_proxy_admission，容错坏 JSON；
     proof/debt/错误类型/outcome 必须由合法 decisions 重算；
     不读不写 v28–v37 与主线状态；点击即执行，无确认/继续按钮。
     ============================================================ */
  const PROXY_KEY = "goddead_v38_proxy_admission";
  const PROXY_ENTRIES = ["threshold", "protocol", "direct"];
  const PROXY_VISITOR_IDS = ["nurse", "postman", "umbrella", "widow"];
  const PROXY_QUESTION_IDS = ["name", "shadow", "knock"];
  const PROXY_MARKS = ["openedProxyWindow", "answeredProtocolEight", "judgedNurse", "judgedPostman", "judgedUmbrella", "judgedWidow"];
  const PROXY_NUM_CAP = 9999;

  /* 四轮确定性 roster：行 = cycle 0 的顺序，按（入口行 + cycle）循环移位 */
  const PROXY_ROSTER_MATRIX = [
    ["nurse", "postman", "umbrella"],
    ["postman", "widow", "nurse"],
    ["umbrella", "widow", "postman"],
    ["widow", "nurse", "umbrella"],
  ];
  const PROXY_ENTRY_ROW = { threshold: 0, protocol: 1, direct: 2 };
  const proxyRosterFor = (entry, cycle) => PROXY_ROSTER_MATRIX[(PROXY_ENTRY_ROW[entry] + cycle) % PROXY_ROSTER_MATRIX.length].slice();
  const isValidProxyRoster = (roster) => Array.isArray(roster) && roster.length === 3
    && roster.every((v) => PROXY_VISITOR_IDS.includes(v))
    && new Set(roster).size === 3;

  const PROXY_VISITORS = {
    nurse: {
      name: "无铃夜班护士", present: true, asset: "assets/proxy-visitor-nurse.webp",
      statement: "“我来接没人肯接的下一班。”",
      questions: { name: "“编号被铃声擦掉了，名字还在今天的值班簿里。”", shadow: "她抬手时，影子也在同一刻碰到玻璃。", knock: "三声。每一声都从门外传来。" },
      correct: "问讯窗承认她仍在场。你的名字从她的空编号牌上退了下来。",
      wrong: "你把仍在场的人留在门外。窥孔开始重新核对你。",
      judgedMark: "judgedNurse",
    },
    postman: {
      name: "倒签邮差", present: false, asset: "assets/proxy-visitor-postman.webp",
      statement: "“我只送还没有写完的那一封。”",
      questions: { name: "“收件人是你。寄件日期比你的到访早一天。”", shadow: "他的手没有动，影子已经把信封推进门缝。", knock: "嘴里数到三，门上却留下四次回声。" },
      correct: "黑封蜡停在门槛外。那封信只好继续写你的名字。",
      wrong: "你放行了发生在本人之前的投递。回返夹道多出一双脚印。",
      judgedMark: "judgedPostman",
    },
    umbrella: {
      name: "黑伞信使", present: true, asset: "assets/proxy-visitor-umbrella.webp",
      statement: "“伞是门里的人借我的。我来还。”",
      questions: { name: "“名字没有写在纸上。门环认得握过它的手。”", shadow: "信使、黑伞与三枚门环在地上同时偏向左侧。", knock: "他用伞柄敲三次；黄铜每次都留下新的凹痕。" },
      correct: "门环认出了那只手。黑伞合上时，门外少了一场雨。",
      wrong: "你拒绝了还伞的人。门后的雨开始从窥孔里落下。",
      judgedMark: "judgedUmbrella",
    },
    widow: {
      name: "空襁褓妇人", present: false, asset: "assets/proxy-visitor-widow.webp",
      statement: "“孩子已经睡了。请别让门把祂吵醒。”",
      questions: { name: "她报出的名字，正是代审簿刚写给你的那个。", shadow: "她的双臂是空的；墙上影子却在轻拍一个婴儿。", knock: "第一声从门后传来，随后她才抬起手。" },
      correct: "襁褓的影子留在墙上，妇人却从问讯窗外消失了。",
      wrong: "你让一个借用你名字的回声入内。失号龛替它擦掉了编号。",
      judgedMark: "judgedWidow",
    },
  };
  const PROXY_QUESTION_META = {
    name: { btn: "#proxy-question-name", resultEl: "#proxy-question-result-name" },
    shadow: { btn: "#proxy-question-shadow", resultEl: "#proxy-question-result-shadow" },
    knock: { btn: "#proxy-question-knock", resultEl: "#proxy-question-result-knock" },
  };
  const PROXY_OUTCOME_META = {
    verified: { target: "protocol", feedback: "三份证词互相承认。守则同意把你登记为访客。" },
    paranoid: { target: "peephole-chamber", feedback: "你把仍在场的人挡在门外。倒置窥孔要求先核对门卫。" },
    contaminated: { target: "return-passage", feedback: "你放行的那道回声已经从里面敲门。回返夹道负责把它送回来。" },
    unnamed: { target: "glyph-niche", feedback: "门债盖过了全部在场证。失号龛收走了代审簿上的名字。" },
  };

  const getProxy = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(PROXY_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const visited = Boolean(raw.visited === true);
    const entry = PROXY_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    const num = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n) || n < 0) n = 0;
      return Math.min(PROXY_NUM_CAP, Math.floor(n));
    };
    const cycle = num(raw.cycle);
    const roster = isValidProxyRoster(raw.roster) ? raw.roster.slice() : proxyRosterFor(entry, cycle);
    /* decisions 只接受当前 roster 内、按 roster 顺序形成的连续已判断前缀：
       off-roster 与跳位/out-of-order 决策全部丢弃，不得推进 index 或计分 */
    const decisions = {};
    if (raw.decisions && typeof raw.decisions === "object" && !Array.isArray(raw.decisions)) {
      for (const v of roster) {
        const c = raw.decisions[v];
        if (c === "admit" || c === "refuse") decisions[v] = c;
        else break;
      }
    }
    const decisionIds = Object.keys(decisions);
    /* questioned 至少丢弃 off-roster 数据，避免污染 UI 与已问统计 */
    const questioned = {};
    if (raw.questioned && typeof raw.questioned === "object" && !Array.isArray(raw.questioned)) {
      Object.keys(raw.questioned).forEach((v) => {
        if (roster.includes(v) && Array.isArray(raw.questioned[v])) {
          questioned[v] = [...new Set(raw.questioned[v].filter((q) => PROXY_QUESTION_IDS.includes(q)))].slice(0, 3);
        }
      });
    }
    /* proof/debt/错误类型必须由合法 decisions 重算，不信任存档伪造数字 */
    let proof = 0;
    let doorDebt = 0;
    let admittedEcho = false;
    let rejectedPresent = false;
    decisionIds.forEach((v) => {
      const meta = PROXY_VISITORS[v];
      const correct = (decisions[v] === "admit") === meta.present;
      if (correct) proof += 2;
      else {
        doorDebt += 1;
        if (decisions[v] === "admit") admittedEcho = true;
        else rejectedPresent = true;
      }
    });
    const index = decisionIds.length;
    /* settled 与 outcome 完全由三条有效、当前 roster、连续 decisions 推导：
       三条合法 decisions 即视为已结算（raw.settled 不被信任），
       修复状态在下一次正常保存时持久化 */
    let derivedOutcome = "";
    if (index >= 3) {
      if (proof === 6 && doorDebt === 0) derivedOutcome = "verified";
      else if (proof === 4 && rejectedPresent) derivedOutcome = "paranoid";
      else if (proof === 4 && admittedEcho) derivedOutcome = "contaminated";
      else derivedOutcome = "unnamed";
    }
    const settled = index >= 3;
    const outcome = settled ? derivedOutcome : "";
    /* settle 副作用的完成标记：派生值无法区分，单独持久化；
       不足三判时归一为未完成 */
    const settleDone = index >= 3 && raw.settleDone === true;
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => PROXY_MARKS.includes(m)))].slice(0, PROXY_MARKS.length)
      : [];
    return {
      visited, entry, cycle, roster, decisions, questioned, index,
      proof, doorDebt, admittedEcho, rejectedPresent, settled, outcome,
      bestProof: num(raw.bestProof),
      totalJudgments: num(raw.totalJudgments),
      marks,
      settleDone,
    };
  };
  const saveProxy = (st) => store.set(PROXY_KEY, JSON.stringify(st));

  /* 入口登记：门板第四热点与守则其八共用（只写 v38 键）；
     新 cycle 未开始时 roster 必须按当前 entry 重建 */
  const markProxyEntry = (entryId) => {
    const st = getProxy();
    st.entry = PROXY_ENTRIES.includes(entryId) ? entryId : "direct";
    if (st.index === 0) st.roster = proxyRosterFor(st.entry, st.cycle);
    const mark = entryId === "threshold" ? "openedProxyWindow" : "answeredProtocolEight";
    if (!st.marks.includes(mark)) st.marks.push(mark);
    saveProxy(st);
  };

  const syncProxyLink = () => {
    const link = $("#proxy-link");
    if (!link) return;
    if (getProxy().visited) link.removeAttribute("hidden");
    else link.setAttribute("hidden", "");
  };

  const markProxyVisited = () => {
    const st = getProxy();
    if (st.visited) return;
    st.visited = true;
    saveProxy(st);
    syncProxyLink();
  };

  const proxyDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  /* 当前访客图换图：先隐去旧图，新图解码完成再现身，不留白不闪旧图 */
  const showProxyVisitor = (visitorId) => {
    const img = $("#proxy-visitor-img");
    const meta = PROXY_VISITORS[visitorId];
    if (!img || !meta) return;
    const showImg = () => img.classList.remove("is-loading");
    if (img.getAttribute("src") !== meta.asset) {
      img.classList.add("is-loading");
      img.addEventListener("load", showImg, { once: true });
      img.setAttribute("src", meta.asset);
      if (img.complete && img.naturalWidth > 0) showImg();
    } else {
      showImg();
    }
  };

  const paintProxy = () => {
    const st = getProxy();
    const doneEl = $("#proxy-stat-done");
    const proofEl = $("#proxy-stat-proof");
    const debtEl = $("#proxy-stat-debt");
    const askedEl = $("#proxy-stat-asked");
    const bestEl = $("#proxy-stat-best");
    const askedCount = Object.values(st.questioned).reduce((n, qs) => n + qs.length, 0);
    if (doneEl) doneEl.textContent = `${st.index}/3`;
    if (proofEl) proofEl.textContent = st.proof;
    if (debtEl) debtEl.textContent = st.doorDebt;
    if (askedEl) askedEl.textContent = askedCount;
    if (bestEl) bestEl.textContent = st.bestProof;
    /* 反馈节拍内仍显示刚被判的访客并锁死其按钮，拍点过后才换到下一位 */
    const beatPending = AutoAdvance.has("proxy-admission-step");
    const visitorId = st.roster[beatPending ? Math.max(0, st.index - 1) : Math.min(st.index, 2)];
    const meta = PROXY_VISITORS[visitorId];
    showProxyVisitor(visitorId);
    const nameEl = $("#proxy-visitor-name");
    const statementEl = $("#proxy-visitor-statement");
    if (nameEl) nameEl.textContent = meta.name;
    if (statementEl) statementEl.textContent = meta.statement;
    const askedHere = st.questioned[visitorId] || [];
    const locked = st.settled || beatPending || Boolean(st.decisions[visitorId]);
    PROXY_QUESTION_IDS.forEach((qId) => {
      const qMeta = PROXY_QUESTION_META[qId];
      const btn = $(qMeta.btn);
      const resultEl = $(qMeta.resultEl);
      if (!btn) return;
      const asked = askedHere.includes(qId);
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", asked ? "true" : "false");
      if (resultEl) resultEl.textContent = asked ? meta.questions[qId] : "";
    });
    const admitBtn = $("#proxy-judge-admit");
    const refuseBtn = $("#proxy-judge-refuse");
    if (admitBtn) {
      admitBtn.disabled = locked;
      admitBtn.setAttribute("aria-pressed", st.decisions[visitorId] === "admit" ? "true" : "false");
    }
    if (refuseBtn) {
      refuseBtn.disabled = locked;
      refuseBtn.setAttribute("aria-pressed", st.decisions[visitorId] === "refuse" ? "true" : "false");
    }
  };

  /* 进入代审窗：已结算则开下一个确定性 cycle（历史 bestProof/totalJudgments 保留）；
     直接 hash 只记 visited，开启/恢复正常 cycle，不自动问讯或判断 */
  const enterProxy = () => {
    markProxyVisited();
    const st = getProxy();
    if (st.settled) {
      st.cycle = Math.min(PROXY_NUM_CAP, st.cycle + 1);
      st.roster = proxyRosterFor(st.entry, st.cycle);
      st.decisions = {};
      st.questioned = {};
      st.settled = false;
      st.settleDone = false;
      st.outcome = "";
      saveProxy(st);
    }
    const responseEl = $("#proxy-response");
    if (responseEl) responseEl.textContent = "";
    paintProxy();
  };

  /* 三项问讯：只展开证词并记录 questioned，不切场景、不加减分；
     已问项 pressed，重复询问只重播短声音 */
  const askProxy = (qId) => {
    const qMeta = PROXY_QUESTION_META[qId];
    if (!qMeta) return;
    if (AutoAdvance.has("proxy-admission") || AutoAdvance.has("proxy-admission-step")) return;
    const st = getProxy();
    if (st.settled) return;
    const visitorId = st.roster[Math.min(st.index, 2)];
    if (!visitorId || st.decisions[visitorId]) return;
    const askedHere = st.questioned[visitorId] || [];
    AudioEngine.knock(0.12);
    if (askedHere.includes(qId)) return;
    if (!st.questioned[visitorId]) st.questioned[visitorId] = [];
    st.questioned[visitorId].push(qId);
    saveProxy(st);
    paintProxy();
  };

  PROXY_QUESTION_IDS.forEach((qId) => {
    const btn = $(PROXY_QUESTION_META[qId].btn);
    if (btn) btn.addEventListener("click", () => askProxy(qId));
  });

  /* 第三人判断后自动结算一次，按 decisions 推导四档；
     settle 副作用以 settleDone 为完成标记：已结算过的批次不重复结算 */
  const settleProxy = () => {
    const st = getProxy();
    if (st.index < 3 || st.settleDone) return;
    st.settled = true;
    st.outcome = (() => {
      if (st.proof === 6 && st.doorDebt === 0) return "verified";
      if (st.proof === 4 && st.rejectedPresent) return "paranoid";
      if (st.proof === 4 && st.admittedEcho) return "contaminated";
      return "unnamed";
    })();
    st.settleDone = true;
    st.bestProof = Math.max(st.bestProof, st.proof);
    saveProxy(st);
    const meta = PROXY_OUTCOME_META[st.outcome];
    paintProxy();
    const responseEl = $("#proxy-response");
    if (responseEl) responseEl.textContent = meta.feedback;
    AudioEngine.knock(0.16);
    AutoAdvance.schedule("proxy-admission", meta.target, { delay: proxyDelay() });
  };

  /* 两个判断：第一次被接受的判断锁住当前访客全部问讯与判断按钮；
     立即反馈并持久化，短节拍后自动换下一人；第三人自动结算 */
  const judgeProxy = (choice) => {
    if (AutoAdvance.has("proxy-admission") || AutoAdvance.has("proxy-admission-step")) return;
    const st = getProxy();
    if (st.settled || st.index >= 3) return;
    const visitorId = st.roster[st.index];
    const meta = visitorId && PROXY_VISITORS[visitorId];
    if (!meta || st.decisions[visitorId]) return;
    const correct = (choice === "admit") === meta.present;
    st.decisions[visitorId] = choice === "admit" ? "admit" : "refuse";
    st.totalJudgments = Math.min(PROXY_NUM_CAP, st.totalJudgments + 1);
    if (!st.marks.includes(meta.judgedMark)) st.marks.push(meta.judgedMark);
    saveProxy(st);
    const responseEl = $("#proxy-response");
    if (responseEl) responseEl.textContent = correct ? meta.correct : meta.wrong;
    AudioEngine.knock(0.16);
    if (Object.keys(st.decisions).length >= 3) {
      /* 第三人：先给判断反馈一个节拍，再换结算反馈并转场 */
      AutoAdvance.schedule("proxy-admission-step", "proxy-admission", {
        delay: proxyDelay(),
        before: () => settleProxy(),
      });
    } else {
      /* 步进与跨场景转场分 scope，离场由 clearAll 一并清除；
         先排定再重绘：节拍内仍显示刚被判的访客并锁死其按钮 */
      AutoAdvance.schedule("proxy-admission-step", "proxy-admission", {
        delay: proxyDelay(),
        before: () => {
          const el = $("#proxy-response");
          if (el) el.textContent = "";
          paintProxy();
        },
      });
    }
    paintProxy();
  };

  const proxyAdmitBtn = $("#proxy-judge-admit");
  const proxyRefuseBtn = $("#proxy-judge-refuse");
  if (proxyAdmitBtn) proxyAdmitBtn.addEventListener("click", () => judgeProxy("admit"));
  if (proxyRefuseBtn) proxyRefuseBtn.addEventListener("click", () => judgeProxy("refuse"));

  /* 门板第四热点：与门外三热点共用首选锁；干净存档立即可发现，
     第一个被接受的热点或第三次敲门决定去向 */
  const proxyHotspotBtn = $("#hotspot-proxy-admission");
  if (proxyHotspotBtn) proxyHotspotBtn.addEventListener("click", () => {
    if (AutoAdvance.has("threshold")) return;
    markProxyEntry("threshold");
    proxyHotspotBtn.classList.add("touched");
    setTimeout(() => proxyHotspotBtn.classList.remove("touched"), 1200);
    AudioEngine.knock();
    statusLine.textContent = "门缝从里面拉开。值班员把你的影子登记成了代理人。";
    AutoAdvance.schedule("threshold", "proxy-admission", { delay: branchDelay() });
  });

  /* 痕迹页单行：判断总数与最高在场证，保持八张统计卡不变 */
  const paintProxyMemory = () => {
    const memory = $("#proxy-memory");
    if (!memory) return;
    const st = getProxy();
    if (!st.visited) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `门外代审：你替门判断了 ${st.totalJudgments} 次；最高留下 ${st.bestProof} 份在场证。`;
    memory.hidden = false;
  };

  /* ============================================================
     v39 归路核验站：守则其五入口 + 三岔枢纽任选两条 + 每条两判断
     状态独立存 goddead_v39_return_audit，容错坏 JSON；
     recall/misstep/wrongRoute/settled/outcome 必须由合法 decisions 重算；
     不读不写 v28–v38 与主线状态；点击即执行，无确认/继续按钮。
     ============================================================ */
  const AUDIT_KEY = "goddead_v39_return_audit";
  const AUDIT_ENTRIES = ["protocol", "direct"];
  const AUDIT_ROUTES = ["echo", "vein", "confession"];
  const AUDIT_ROUTE_SCENES = ["echo-turn", "vein-turnstile", "confession-locker"];
  const AUDIT_SCENE_ROUTE = { "echo-turn": "echo", "vein-turnstile": "vein", "confession-locker": "confession" };
  /* v29 守卫窄例外：中间档 outcome 放行的既有支线场景 */
  const AUDIT_BRANCH_OUTCOME = { echo: "echoed", vein: "pulsed", confession: "confessed" };
  const AUDIT_MARKS = ["answeredProtocolFive", "auditedEcho", "auditedVein", "auditedConfession"];
  const AUDIT_NUM_CAP = 9999;

  const AUDIT_ROUTE_META = {
    echo: {
      scene: "echo-turn",
      responseEl: "#echo-turn-response",
      cardBtn: "#audit-route-echo",
      selectFeedback: "黄铜台面亮起声波纹。最近的门，反而最远。",
      choices: {
        first: { btn: "#echo-turn-choice-first", correct: true, feedback: "你走进最轻的那声。其余回声晚了一步，没能穿上你的影子。" },
        loud: { btn: "#echo-turn-choice-loud", correct: false, feedback: "最响的回声替你回答。岔廊把它登记成了先到的人。" },
      },
      mark: "auditedEcho",
    },
    vein: {
      scene: "vein-turnstile",
      responseEl: "#vein-turnstile-response",
      cardBtn: "#audit-route-vein",
      selectFeedback: "黄铜台面亮起脉管。闸机开始数你的心跳。",
      choices: {
        pale: { btn: "#vein-turnstile-choice-pale", correct: true, feedback: "停搏给你让出半步。闸机没有来得及记住你的体温。" },
        pulse: { btn: "#vein-turnstile-choice-pulse", correct: false, feedback: "红色脉冲把你夹进管壁。下一次心跳带走了你的方向。" },
      },
      mark: "auditedVein",
    },
    confession: {
      scene: "confession-locker",
      responseEl: "#confession-locker-response",
      cardBtn: "#audit-route-confession",
      selectFeedback: "黄铜台面亮起封蜡。寄存柜替你留出了一格。",
      choices: {
        blank: { btn: "#confession-locker-choice-blank", correct: true, feedback: "空白牌没有认出你。所有柜门同时假装从未打开。" },
        named: { btn: "#confession-locker-choice-named", correct: false, feedback: "你的名字从牌上消失，随即从每只柜子里被念了一遍。" },
      },
      mark: "auditedConfession",
    },
  };
  const AUDIT_OUTCOME_META = {
    verified: { target: "protocol", feedback: "两段路线互相承认。守则允许你继续记得回来。" },
    lost: { target: "return-passage", feedback: "两段路线都指向你身后。回返夹道已经替你转过身。" },
    echoed: { target: "echo", feedback: "错误的回声先一步抵达档案室。它正在等原件签收。" },
    pulsed: { target: "vein", feedback: "闸机把迷路登记成一次维护请求。血管井已为你开盖。" },
    confessed: { target: "confession", feedback: "寄存柜拒绝退还你的名字。忏悔称量室负责核对重量。" },
  };

  const getAudit = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(AUDIT_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const visited = Boolean(raw.visited === true);
    const entry = AUDIT_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    const num = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n) || n < 0) n = 0;
      return Math.min(AUDIT_NUM_CAP, Math.floor(n));
    };
    const cycle = num(raw.cycle);
    /* order：route 白名单过滤、去重、一轮最多两条 */
    let order = Array.isArray(raw.order)
      ? [...new Set(raw.order.filter((r) => AUDIT_ROUTES.includes(r)))].slice(0, 2)
      : [];
    /* decisions 只接受按 order 形成的连续合法前缀（decision 必须是该 route 的
       两个合法 choice 之一）；off-route 与跳位决策全部丢弃，不得推进计数 */
    const decisions = {};
    if (raw.decisions && typeof raw.decisions === "object" && !Array.isArray(raw.decisions)) {
      for (const r of order) {
        const c = raw.decisions[r];
        if (typeof c === "string" && AUDIT_ROUTE_META[r].choices[c]) decisions[r] = c;
        else break;
      }
    }
    order = order.slice(0, Object.keys(decisions).length);
    const completedCount = order.length;
    /* recall/misstep/wrongRoute/settled/outcome 全部由合法 decisions 重算，不信任存档 */
    let recall = 0;
    let misstep = 0;
    let wrongRoute = "";
    order.forEach((r) => {
      if (AUDIT_ROUTE_META[r].choices[decisions[r]].correct) recall += 1;
      else {
        misstep += 1;
        wrongRoute = r;
      }
    });
    const settled = completedCount >= 2;
    let outcome = "";
    if (settled) {
      if (recall === 2 && misstep === 0) outcome = "verified";
      else if (recall === 0 && misstep === 2) outcome = "lost";
      else outcome = AUDIT_BRANCH_OUTCOME[wrongRoute] || "";
    }
    /* settleDone / arrivalPending 只标记结算副作用与结算转场是否执行，不参与结果派生；
       不足两条合法 decisions 时归一为未完成 */
    const settleDone = settled && raw.settleDone === true;
    const arrivalPending = settled && raw.arrivalPending === true;
    /* pendingRoute 只能是未完成的白名单 route，否则清空 */
    const pendingRoute = !settled && AUDIT_ROUTES.includes(raw.pendingRoute) && !order.includes(raw.pendingRoute)
      ? raw.pendingRoute
      : "";
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => AUDIT_MARKS.includes(m)))].slice(0, AUDIT_MARKS.length)
      : [];
    return {
      visited, entry, cycle, pendingRoute, order, decisions, completedCount,
      recall, misstep, wrongRoute, settled, outcome, settleDone, arrivalPending,
      bestRecall: num(raw.bestRecall),
      totalAudits: num(raw.totalAudits),
      marks,
    };
  };
  const saveAudit = (st) => store.set(AUDIT_KEY, JSON.stringify(st));

  /* 守则其五入口登记（只写 v39 键） */
  const markAuditEntry = (entryId) => {
    const st = getAudit();
    st.entry = AUDIT_ENTRIES.includes(entryId) ? entryId : "direct";
    if (!st.marks.includes("answeredProtocolFive")) st.marks.push("answeredProtocolFive");
    saveAudit(st);
  };

  const syncAuditLink = () => {
    const link = $("#audit-link");
    if (!link) return;
    if (getAudit().visited) link.removeAttribute("hidden");
    else link.setAttribute("hidden", "");
  };

  const markAuditVisited = () => {
    const st = getAudit();
    if (st.visited) return;
    st.visited = true;
    saveAudit(st);
    syncAuditLink();
  };

  const auditDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintAudit = () => {
    const st = getAudit();
    const doneEl = $("#audit-stat-done");
    const recallEl = $("#audit-stat-recall");
    const misstepEl = $("#audit-stat-misstep");
    const bestEl = $("#audit-stat-best");
    if (doneEl) doneEl.textContent = `${st.completedCount}/2`;
    if (recallEl) recallEl.textContent = st.recall;
    if (misstepEl) misstepEl.textContent = st.misstep;
    if (bestEl) bestEl.textContent = st.bestRecall;
    const locked = st.settled || AutoAdvance.has("return-audit") || AutoAdvance.has("return-audit-step");
    AUDIT_ROUTES.forEach((r) => {
      const btn = $(AUDIT_ROUTE_META[r].cardBtn);
      if (!btn) return;
      const done = st.order.includes(r);
      btn.disabled = locked || done;
      btn.setAttribute("aria-pressed", done ? "true" : "false");
    });
  };

  const paintAuditRoute = (route) => {
    const meta = AUDIT_ROUTE_META[route];
    if (!meta) return;
    const st = getAudit();
    const decided = st.decisions[route];
    const locked = st.settled || Boolean(decided) || AutoAdvance.has("return-audit") || AutoAdvance.has("return-audit-step");
    Object.keys(meta.choices).forEach((c) => {
      const btn = $(meta.choices[c].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", decided === c ? "true" : "false");
    });
  };

  /* 进入核验站：结算反馈未转场时先补结算节拍（刷新安全）；
     结算与转场都完成后开新 cycle（历史 bestRecall/totalAudits 保留）；
     直接 hash 只记 visited，开启/恢复正常 cycle，不自动选择路线 */
  const enterAudit = () => {
    markAuditVisited();
    const st = getAudit();
    const responseEl = $("#audit-response");
    if (st.settled && st.arrivalPending) {
      /* 结算节拍：第二条路线的即时反馈已在路线场景保留一拍，
         这里换结算反馈再保留一拍，随后自动进入派生目的地 */
      paintAudit();
      const meta = AUDIT_OUTCOME_META[st.outcome];
      if (meta) {
        if (responseEl) responseEl.textContent = meta.feedback;
        AudioEngine.knock(0.16);
        AutoAdvance.schedule("return-audit", meta.target, {
          delay: auditDelay(),
          before: () => {
            const s = getAudit();
            s.arrivalPending = false;
            saveAudit(s);
          },
        });
      }
      return;
    }
    if (st.settled) {
      st.cycle = Math.min(AUDIT_NUM_CAP, st.cycle + 1);
      st.order = [];
      st.decisions = {};
      st.pendingRoute = "";
      st.settleDone = false;
      st.arrivalPending = false;
      saveAudit(st);
    }
    if (responseEl) responseEl.textContent = "";
    paintAudit();
    /* 返回核验站后焦点落到第一个未完成路线卡 */
    if (st.order.length > 0) {
      const next = AUDIT_ROUTES.find((r) => !st.order.includes(r));
      const btn = next && $(AUDIT_ROUTE_META[next].cardBtn);
      if (btn) pendingSceneFocus = btn;
    }
  };

  /* 进入路线场景：恢复/登记 pendingRoute（刷新与直接 hash 安全），不自动判断。
     reload 窗口修复：判断写入后回程/结算 timer 只在内存——若即时反馈拍内刷新，
     该 route 已判断但节拍丢失，这里重播逐字即时反馈并重新排定：
     第一条继续自动回 hub；第二条继续 即时反馈→hub 结算反馈→派生目的地，
     settleAudit 以 settleDone 保证副作用严格一次 */
  const enterAuditRoute = (sceneName) => {
    const route = AUDIT_SCENE_ROUTE[sceneName];
    if (!route) return;
    const st = getAudit();
    if (!st.settled && !st.order.includes(route) && st.pendingRoute !== route) {
      st.pendingRoute = route;
      saveAudit(st);
    }
    const meta = AUDIT_ROUTE_META[route];
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = "";
    paintAuditRoute(route);
    const decided = st.decisions[route];
    if (decided && !st.arrivalPending) {
      const choice = meta.choices[decided];
      if (responseEl && choice) responseEl.textContent = choice.feedback;
      if (st.settled) {
        AutoAdvance.schedule("return-audit-step", "return-audit", {
          delay: auditDelay(),
          before: () => settleAudit(),
        });
      } else {
        AutoAdvance.schedule("return-audit-step", "return-audit", { delay: auditDelay() });
      }
    }
  };

  /* 选择路线：立即反馈并自动进入对应区域；已完成路线 disabled+pressed，
     第一条完成后不替玩家选择第二条 */
  const selectAuditRoute = (route) => {
    const meta = AUDIT_ROUTE_META[route];
    if (!meta) return;
    if (AutoAdvance.has("return-audit") || AutoAdvance.has("return-audit-step")) return;
    const st = getAudit();
    if (st.settled || st.order.includes(route) || st.order.length >= 2) return;
    st.pendingRoute = route;
    saveAudit(st);
    const responseEl = $("#audit-response");
    if (responseEl) responseEl.textContent = meta.selectFeedback;
    AudioEngine.knock(0.12);
    paintAudit();
    AutoAdvance.schedule("return-audit-step", meta.scene, { delay: auditDelay() });
  };

  AUDIT_ROUTES.forEach((route) => {
    const btn = $(AUDIT_ROUTE_META[route].cardBtn);
    if (btn) btn.addEventListener("click", () => selectAuditRoute(route));
  });

  /* 两条路线完成后自动结算一次；settleDone 为副作用完成标记，不参与派生 */
  const settleAudit = () => {
    const st = getAudit();
    if (!st.settled || st.settleDone) return;
    st.settleDone = true;
    st.arrivalPending = true;
    st.bestRecall = Math.max(st.bestRecall, st.recall);
    st.totalAudits = Math.min(AUDIT_NUM_CAP, st.totalAudits + 1);
    saveAudit(st);
  };

  /* 每条路线的两个判断：第一次被接受即锁定该区域两按钮（同节拍竞争只记一次）；
     即时反馈一拍后：第一条自动回核验站，第二条回核验站换结算反馈再自动转场。
     守卫：只接受当前场景对应且 pendingRoute 合法的 route——
     隐藏/off-route 按钮的程序化竞争不得推进 order/decisions */
  const judgeAudit = (route, choiceKey) => {
    const meta = AUDIT_ROUTE_META[route];
    const choice = meta && meta.choices[choiceKey];
    if (!choice) return;
    if (AutoAdvance.has("return-audit") || AutoAdvance.has("return-audit-step")) return;
    const st = getAudit();
    if (st.settled || st.decisions[route] || st.order.length >= 2) return;
    if (currentScene !== meta.scene || st.pendingRoute !== route) return;
    st.decisions[route] = choiceKey;
    st.order.push(route);
    st.pendingRoute = "";
    if (!st.marks.includes(meta.mark)) st.marks.push(meta.mark);
    saveAudit(st);
    const responseEl = $(meta.responseEl);
    if (responseEl) responseEl.textContent = choice.feedback;
    AudioEngine.knock(0.16);
    paintAuditRoute(route);
    if (st.order.length >= 2) {
      /* 第二条：先保留即时反馈一拍；到核验站由 enterAudit 换结算反馈并转场 */
      AutoAdvance.schedule("return-audit-step", "return-audit", {
        delay: auditDelay(),
        before: () => settleAudit(),
      });
    } else {
      /* 第一条：即时反馈一拍后自动回核验站 */
      AutoAdvance.schedule("return-audit-step", "return-audit", { delay: auditDelay() });
    }
  };

  AUDIT_ROUTES.forEach((route) => {
    const meta = AUDIT_ROUTE_META[route];
    Object.keys(meta.choices).forEach((choiceKey) => {
      const btn = $(meta.choices[choiceKey].btn);
      if (btn) btn.addEventListener("click", () => judgeAudit(route, choiceKey));
    });
  });

  /* 痕迹页单行：完成轮数与最佳归路，保持八张统计卡不变 */
  const paintAuditMemory = () => {
    const memory = $("#audit-memory");
    if (!memory) return;
    const st = getAudit();
    if (!st.visited) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `归路核验：完成 ${st.totalAudits} 轮核验；最佳归路 ${st.bestRecall}。`;
    memory.hidden = false;
  };

  /* ============================================================
     v40 门外侧廊：首页纵深环境层 + 左右廊热点 + 三个画面热点场景
     状态独立存 goddead_v40_lateral_corridors，容错坏 JSON；
     pending 必须是 {scene, action, target, feedback} 完整合法映射；
     不读不写 v28–v39 与主线状态；点击即执行，无确认/继续按钮。
     ============================================================ */
  const LATERAL_KEY = "goddead_v40_lateral_corridors";
  const LATERAL_SCENES = ["lamp", "shadow", "hinge"];
  const LATERAL_SCENE_NAMES = ["unlit-lamp-gallery", "borrowed-shadow-gallery", "hinge-sorting-room"];
  const LATERAL_SCENE_NAME = { lamp: "unlit-lamp-gallery", shadow: "borrowed-shadow-gallery", hinge: "hinge-sorting-room" };
  const LATERAL_NAME_SCENE = { "unlit-lamp-gallery": "lamp", "borrowed-shadow-gallery": "shadow", "hinge-sorting-room": "hinge" };
  const LATERAL_ENTRIES = ["threshold-left", "threshold-right", "lamp", "shadow", "direct"];
  const LATERAL_MARKS = [
    "enteredLeftCorridor", "enteredRightCorridor",
    "touchedUnlitLamp", "followedLampRail", "escapedLampGallery",
    "stoodInBorrowedShadow", "openedShadowDoor", "followedDoorShadow",
    "fittedInwardHinge", "fittedOutwardHinge", "removedFinalHinge",
  ];
  const LATERAL_NUM_CAP = 9999;

  const LATERAL_ACTIONS = {
    lamp: {
      lamp: { btn: "#lamp-hotspot-lamp", target: "borrowed-shadow-gallery", feedback: "灯没有亮，影子却换到了你的脚下。", mark: "touchedUnlitLamp" },
      shadow: { btn: "#lamp-hotspot-rail", target: "hinge-sorting-room", feedback: "铜轨先在墙里拐弯，随后拖着走廊一起转向。", mark: "followedLampRail" },
      passage: { btn: "#lamp-hotspot-squeeze", target: "return-passage", feedback: "两排灯把你夹成一条更窄的回来。", mark: "escapedLampGallery" },
    },
    shadow: {
      stand: { btn: "#shadow-hotspot-stand", target: "unlit-lamp-gallery", feedback: "影子替你站住，灯廊因此空出一个位置。", mark: "stoodInBorrowedShadow" },
      shadowDoor: { btn: "#shadow-hotspot-door", target: "hinge-sorting-room", feedback: "没有门的铰链先响了。墙面向两侧让开。", mark: "openedShadowDoor" },
      peephole: { btn: "#shadow-hotspot-follow", target: "peephole-chamber", feedback: "门影从窥孔背面经过。你只好从里面去看它。", mark: "followedDoorShadow" },
    },
    hinge: {
      inward: { btn: "#hinge-hotspot-inward", target: "glyph-niche", feedback: "门轴把你的选择数成了第九道刻痕。", mark: "fittedInwardHinge" },
      remove: { btn: "#hinge-hotspot-remove", target: "return-audit", feedback: "门从路线中被删除。核验站要求你证明还记得来路。", mark: "removedFinalHinge" },
      outward: { btn: "#hinge-hotspot-outward", target: "proxy-admission", feedback: "门框向门外打开。代审窗已经在等下一位访客。", mark: "fittedOutwardHinge" },
    },
  };
  /* v31 门前守卫的 v40 窄例外表：lateral action → 唯一放行的 v31 场景 */
  const LATERAL_V31_TARGET = { passage: "return-passage", peephole: "peephole-chamber", inward: "glyph-niche" };
  const LATERAL_RESPONSE_EL = { lamp: "#lamp-response", shadow: "#shadow-response", hinge: "#hinge-response" };
  const LATERAL_LINKS = { lamp: "#lamp-link", shadow: "#shadow-link", hinge: "#hinge-link" };

  const getLateral = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(LATERAL_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    /* visited 只接受 lamp / shadow / hinge 三个布尔键 */
    const visited = {};
    LATERAL_SCENES.forEach((s) => {
      visited[s] = Boolean(raw.visited && raw.visited[s] === true);
    });
    const entry = LATERAL_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    /* pending 必须是 {scene, action, target, feedback} 的完整合法映射，
       四字段与白名单表严格对应；伪造 target/feedback 等任何错配即清空。
       pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const acts = LATERAL_ACTIONS[raw.pending.scene];
      const act = acts && acts[raw.pending.action];
      if (act && raw.pending.target === act.target && raw.pending.feedback === act.feedback) {
        pending = { scene: raw.pending.scene, action: raw.pending.action, target: act.target, feedback: act.feedback };
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配 */
    const lastScene = LATERAL_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && LATERAL_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    let traversals = Number(raw.traversals);
    if (!Number.isFinite(traversals) || traversals < 0) traversals = 0;
    traversals = Math.min(LATERAL_NUM_CAP, Math.floor(traversals));
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => LATERAL_MARKS.includes(m)))].slice(0, LATERAL_MARKS.length)
      : [];
    return { visited, entry, pending, lastScene, lastAction, traversals, marks };
  };
  const saveLateral = (st) => store.set(LATERAL_KEY, JSON.stringify(st));

  const syncLateralLinks = () => {
    const st = getLateral();
    LATERAL_SCENES.forEach((s) => {
      const link = $(LATERAL_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markLateralVisited = (sceneKey) => {
    const st = getLateral();
    if (!LATERAL_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    saveLateral(st);
    syncLateralLinks();
  };

  const lateralDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintLateralScene = (sceneKey) => {
    const st = getLateral();
    const locked = AutoAdvance.has("lateral-" + sceneKey);
    Object.keys(LATERAL_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(LATERAL_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.marks.includes(LATERAL_ACTIONS[sceneKey][actionId].mark) ? "true" : "false");
    });
  };

  /* 进入侧廊场景：到访标记；若合法 pending 属于本场景（reload/离场后重返），
     重播逐字反馈并恢复转场，timer 真正触发前才清 pending */
  const enterLateral = (sceneKey) => {
    markLateralVisited(sceneKey);
    const st = getLateral();
    const responseEl = $(LATERAL_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("lateral-" + sceneKey, p.target, {
        delay: lateralDelay(),
        before: () => {
          const s = getLateral();
          if (s.pending && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            saveLateral(s);
          }
        },
      });
    }
    paintLateralScene(sceneKey);
  };

  /* 九个画面动作：第一项被接受后同场景全部热点立即 disabled（同节拍竞争只接受第一项），
     逐字反馈写入 aria-live，pending 持久化后自动进入目的地。
     守卫：只接受当前活动场景的 hotspot——隐藏 DOM 的脚本化点击在任何
     状态读取/写入、声音、反馈与 timer 之前被拦截 */
  const runLateralAction = (sceneKey, actionId) => {
    const act = LATERAL_ACTIONS[sceneKey] && LATERAL_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== LATERAL_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("lateral-" + sceneKey)) return;
    const st = getLateral();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    if (!st.marks.includes(act.mark)) st.marks.push(act.mark);
    st.traversals = Math.min(LATERAL_NUM_CAP, st.traversals + 1);
    st.pending = { scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    if (sceneKey === "lamp" || sceneKey === "shadow") st.entry = sceneKey;
    saveLateral(st);
    const responseEl = $(LATERAL_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内同场景全部热点保持 disabled（同 v38 教训） */
    AutoAdvance.schedule("lateral-" + sceneKey, act.target, {
      delay: lateralDelay(),
      before: () => {
        const s = getLateral();
        if (s.pending && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          saveLateral(s);
        }
      },
    });
    paintLateralScene(sceneKey);
  };

  LATERAL_SCENES.forEach((sceneKey) => {
    Object.keys(LATERAL_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(LATERAL_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runLateralAction(sceneKey, actionId));
    });
  });

  /* 首页左右廊热点：与日蚀/符号/回来/代审/三敲共用 threshold 首选锁；
     到访标记与 entry 在点击时立即持久化 */
  const LATERAL_THRESHOLD_SPOTS = {
    "hotspot-lateral-left": { entry: "threshold-left", scene: "lamp", target: "unlit-lamp-gallery", feedback: "左侧黑暗向后退了一步。门没有移动，走廊却从它旁边长了出来。", mark: "enteredLeftCorridor" },
    "hotspot-lateral-right": { entry: "threshold-right", scene: "shadow", target: "borrowed-shadow-gallery", feedback: "右侧墙面折进门影。你还站在门外，但影子已经先行。", mark: "enteredRightCorridor" },
  };
  Object.keys(LATERAL_THRESHOLD_SPOTS).forEach((id) => {
    const btn = $("#" + id);
    const spot = LATERAL_THRESHOLD_SPOTS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      /* 守卫：离开首页后隐藏的侧廊热点不得被脚本触发（任何副作用之前拦截） */
      if (currentScene !== "threshold") return;
      if (AutoAdvance.has("threshold")) return;
      const st = getLateral();
      st.entry = spot.entry;
      st.visited[spot.scene] = true;
      if (!st.marks.includes(spot.mark)) st.marks.push(spot.mark);
      st.traversals = Math.min(LATERAL_NUM_CAP, st.traversals + 1);
      saveLateral(st);
      syncLateralLinks();
      btn.classList.add("touched");
      setTimeout(() => btn.classList.remove("touched"), 1200);
      AudioEngine.knock();
      statusLine.textContent = spot.feedback;
      AutoAdvance.schedule("threshold", spot.target, { delay: branchDelay() });
    });
  });

  /* 痕迹页单行：穿行次数与已见场景数，保持八张统计卡不变 */
  const paintLateralMemory = () => {
    const memory = $("#lateral-memory");
    if (!memory) return;
    const st = getLateral();
    const seen = LATERAL_SCENES.filter((s) => st.visited[s]).length;
    if (seen === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `门外侧廊：穿行 ${st.traversals} 次；无灯 / 借影 / 铰链已见 ${seen}/3。`;
    memory.hidden = false;
  };

  /* ============================================================
     v41 守则背室：布告板三入口 + 三间画面热点背室
     状态独立存 goddead_v41_protocol_backrooms，容错坏 JSON；
     pending 必须是 {scene, action, target, feedback} 完整合法映射；
     不读不写 v28–v40 与主线状态；点击即执行，无确认/继续按钮。
     ============================================================ */
  const BACKROOM_KEY = "goddead_v41_protocol_backrooms";
  const BACKROOM_SCENES = ["thread", "name", "bell"];
  const BACKROOM_SCENE_NAMES = ["red-thread-registry", "blank-name-cloakroom", "clapperless-bell-desk"];
  const BACKROOM_SCENE_NAME = { thread: "red-thread-registry", name: "blank-name-cloakroom", bell: "clapperless-bell-desk" };
  const BACKROOM_NAME_SCENE = { "red-thread-registry": "thread", "blank-name-cloakroom": "name", "clapperless-bell-desk": "bell" };
  const BACKROOM_ENTRIES = ["protocol-thread", "protocol-name", "protocol-bell", "thread", "name", "bell", "direct"];
  const BACKROOM_MARKS = [
    "enteredThreadRegistry", "enteredBlankNameCloakroom", "enteredClapperlessBellDesk",
    "loosenedRedSpool", "pressedWitnessSeal", "followedThreadGap",
    "woreOwnerlessCoat", "hungBlankName", "turnedBlankClaimToken",
    "pressedClapperlessBell", "spokeIntoDeskTube", "pulledRedSignalCord",
  ];
  const BACKROOM_NUM_CAP = 9999;

  const BACKROOM_ACTIONS = {
    thread: {
      spool: { btn: "#thread-hotspot-spool", target: "blank-name-cloakroom", feedback: "线轴吐出一截没有去处的红线。寄存处替它挂上一件空外套。", mark: "loosenedRedSpool" },
      seal: { btn: "#thread-hotspot-seal", target: "return-audit", feedback: "黑蜡没有留下图案，只留下你确实按过它的重量。", mark: "pressedWitnessSeal" },
      gap: { btn: "#thread-hotspot-gap", target: "corridor", feedback: "红线从柜后穿过去，拖着八张纸一起通向经文走廊。", mark: "followedThreadGap" },
    },
    name: {
      coat: { btn: "#name-hotspot-coat", target: "proxy-admission", feedback: "外套认出了你的肩膀。代审窗把这当成另一份在场证。", mark: "woreOwnerlessCoat" },
      hook: { btn: "#name-hotspot-hook", target: "red-thread-registry", feedback: "你的名字没有被写下，只被一根红线挂到了另一面墙。", mark: "hungBlankName" },
      token: { btn: "#name-hotspot-token", target: "clapperless-bell-desk", feedback: "圆牌翻到背面。无舌铃台把空白的一面当成了叫号。", mark: "turnedBlankClaimToken" },
    },
    bell: {
      bell: { btn: "#bell-hotspot-bell", target: "midnight-callback", feedback: "铃帽下降了一次。午夜回拨台替它补上了迟到的声音。", mark: "pressedClapperlessBell" },
      tube: { btn: "#bell-hotspot-tube", target: "blank-name-cloakroom", feedback: "管内没有人回答，只有衣架互相碰了一下。", mark: "spokeIntoDeskTube" },
      cord: { btn: "#bell-hotspot-cord", target: "protocol", feedback: "红绳把接待台折回布告板背面。八条守则还在原处等你。", mark: "pulledRedSignalCord" },
    },
  };
  const BACKROOM_RESPONSE_EL = { thread: "#thread-response", name: "#name-response", bell: "#bell-response" };
  const BACKROOM_LINKS = { thread: "#thread-link", name: "#name-link", bell: "#bell-link" };

  const getBackrooms = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(BACKROOM_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    /* visited 只接受 thread / name / bell 三个布尔键 */
    const visited = {};
    BACKROOM_SCENES.forEach((s) => {
      visited[s] = Boolean(raw.visited && raw.visited[s] === true);
    });
    const entry = BACKROOM_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    /* pending 仅用于三间背室的九动作，必须是 {scene, action, target, feedback}
       完整合法映射；任何 target/feedback/scene/action 错配即清空。
       pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const acts = BACKROOM_ACTIONS[raw.pending.scene];
      const act = acts && acts[raw.pending.action];
      if (act && raw.pending.target === act.target && raw.pending.feedback === act.feedback) {
        pending = { scene: raw.pending.scene, action: raw.pending.action, target: act.target, feedback: act.feedback };
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配 */
    const lastScene = BACKROOM_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && BACKROOM_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    let traversals = Number(raw.traversals);
    if (!Number.isFinite(traversals) || traversals < 0) traversals = 0;
    traversals = Math.min(BACKROOM_NUM_CAP, Math.floor(traversals));
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => BACKROOM_MARKS.includes(m)))].slice(0, BACKROOM_MARKS.length)
      : [];
    return { visited, entry, pending, lastScene, lastAction, traversals, marks };
  };
  const saveBackrooms = (st) => store.set(BACKROOM_KEY, JSON.stringify(st));

  const syncBackroomLinks = () => {
    const st = getBackrooms();
    BACKROOM_SCENES.forEach((s) => {
      const link = $(BACKROOM_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markBackroomVisited = (sceneKey) => {
    const st = getBackrooms();
    if (!BACKROOM_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    saveBackrooms(st);
    syncBackroomLinks();
  };

  const backroomDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintBackroomScene = (sceneKey) => {
    const st = getBackrooms();
    const locked = AutoAdvance.has("backroom-" + sceneKey);
    Object.keys(BACKROOM_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(BACKROOM_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.marks.includes(BACKROOM_ACTIONS[sceneKey][actionId].mark) ? "true" : "false");
    });
  };

  /* 进入背室场景：到访标记；若合法 pending 属于本场景（reload/离场后重返），
     重播逐字反馈并恢复转场，timer 真正触发前才清 pending */
  const enterBackroom = (sceneKey) => {
    markBackroomVisited(sceneKey);
    const st = getBackrooms();
    const responseEl = $(BACKROOM_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("backroom-" + sceneKey, p.target, {
        delay: backroomDelay(),
        before: () => {
          const s = getBackrooms();
          if (s.pending && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            saveBackrooms(s);
          }
        },
      });
    }
    paintBackroomScene(sceneKey);
  };

  /* 九个画面动作：在任何状态访问与副作用前校验当前场景（隐藏/off-route
     脚本化点击零副作用）；第一项被接受后同场景全部热点立即 disabled
     （同节拍竞争只接受第一项），逐字反馈写入 aria-live，pending 持久化后自动转场 */
  const runBackroomAction = (sceneKey, actionId) => {
    const act = BACKROOM_ACTIONS[sceneKey] && BACKROOM_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== BACKROOM_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("backroom-" + sceneKey)) return;
    const st = getBackrooms();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    if (!st.marks.includes(act.mark)) st.marks.push(act.mark);
    st.traversals = Math.min(BACKROOM_NUM_CAP, st.traversals + 1);
    st.pending = { scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    st.entry = sceneKey;
    saveBackrooms(st);
    const responseEl = $(BACKROOM_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内同场景全部热点保持 disabled */
    AutoAdvance.schedule("backroom-" + sceneKey, act.target, {
      delay: backroomDelay(),
      before: () => {
        const s = getBackrooms();
        if (s.pending && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          saveBackrooms(s);
        }
      },
    });
    paintBackroomScene(sceneKey);
  };

  BACKROOM_SCENES.forEach((sceneKey) => {
    Object.keys(BACKROOM_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(BACKROOM_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runBackroomAction(sceneKey, actionId));
    });
  });

  /* 守则布告板三入口：与八条守则共用 protocol 首选锁（第一条被接受的规则或
     热点决定本拍归宿）；在任何状态读取/写入、声音、反馈与 timer 之前校验
     currentScene === "protocol"；反馈写入独立的 #protocol-backroom-response，
     不复用或覆盖八条守则原反馈；玖异常不并入 v41 状态 */
  const BACKROOM_PROTOCOL_SPOTS = {
    "protocol-hotspot-thread": { entry: "protocol-thread", scene: "thread", target: "red-thread-registry", feedback: "红线从八条守则背后抽紧。布告板让出一条只容卷宗通过的缝。", mark: "enteredThreadRegistry" },
    "protocol-hotspot-nameplate": { entry: "protocol-name", scene: "name", target: "blank-name-cloakroom", feedback: "空白名牌记住了你的按痕，却仍拒绝写出名字。", mark: "enteredBlankNameCloakroom" },
    "protocol-hotspot-bell": { entry: "protocol-bell", scene: "bell", target: "clapperless-bell-desk", feedback: "铃钮陷进墙里。没有铃声，接待台却已经叫到你。", mark: "enteredClapperlessBellDesk" },
  };
  Object.keys(BACKROOM_PROTOCOL_SPOTS).forEach((id) => {
    const btn = $("#" + id);
    const spot = BACKROOM_PROTOCOL_SPOTS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (currentScene !== "protocol") return;
      if (AutoAdvance.has("protocol")) return;
      const st = getBackrooms();
      st.entry = spot.entry;
      st.visited[spot.scene] = true;
      if (!st.marks.includes(spot.mark)) st.marks.push(spot.mark);
      st.traversals = Math.min(BACKROOM_NUM_CAP, st.traversals + 1);
      saveBackrooms(st);
      syncBackroomLinks();
      btn.classList.add("touched");
      setTimeout(() => btn.classList.remove("touched"), 1200);
      AudioEngine.knock();
      const responseEl = $("#protocol-backroom-response");
      if (responseEl) responseEl.textContent = spot.feedback;
      AutoAdvance.schedule("protocol", spot.target, {
        delay: branchDelay(),
        before: () => { protocolConsumed = true; },
      });
    });
  });

  /* 痕迹页单行：穿行次数与已见场景数，保持八张统计卡不变 */
  const paintBackroomMemory = () => {
    const memory = $("#backroom-memory");
    if (!memory) return;
    const st = getBackrooms();
    const seen = BACKROOM_SCENES.filter((s) => st.visited[s]).length;
    if (seen === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `守则背室：穿行 ${st.traversals} 次；红线 / 空名 / 无舌铃已见 ${seen}/3。`;
    memory.hidden = false;
  };

  /* ============================================================
     v42 守则漂移：v41 两间背室解锁第四入口 + 四拍巡查判断
     状态独立存 goddead_v42_protocol_drift，容错坏 JSON；
     只读 v41 visited 用于解锁，不改写 v28–v41 与主线任何键；
     pending 与固定规则表逐字段一致；点击即执行，无确认/继续按钮。
     ============================================================ */
  const DRIFT_KEY = "goddead_v42_protocol_drift";
  const DRIFT_SEQ = ["thread", "normal", "bell", "name", "thread", "bell", "normal", "name"];
  const DRIFT_ROUNDS = ["normal", "thread", "name", "bell"];
  const DRIFT_ANSWERS = ["forward", "thread", "name", "bell", "exit"];
  const DRIFT_NUM_CAP = 9999;
  const DRIFT_MARKS = [
    "unlockedProtocolDrift", "enteredProtocolDrift",
    "reportedThreadDrift", "reportedNameDrift", "reportedBellDrift", "passedCleanBoard",
    "misreportedThread", "misreportedName", "misreportedBell", "missedRealDrift",
    "completedCleanCycle", "completedThreadCycle", "completedNameCycle", "completedBellCycle",
  ];
  const DRIFT_ROUND_IMG = {
    normal: "assets/visitor-protocol-board.webp",
    thread: "assets/protocol-drift-thread.webp",
    name: "assets/protocol-drift-nameplate.webp",
    bell: "assets/protocol-drift-bell.webp",
  };
  const DRIFT_CORRECT_FEEDBACK = {
    normal: "旧蜡印没有移动。你放行了一个仍然服从原样的夜晚。",
    thread: "你指出第九个绳结。它松开时，墙后传来一张纸被撤回的声音。",
    name: "空名牌退回墙里。那枚没有号码的取物牌也跟着消失了。",
    bell: "你在它响以前认出了铃口。黑色液体沿原路缩回黄铜里面。",
  };
  const DRIFT_COMPLETE = {
    normal: { target: "protocol", feedback: "三次巡查没有留下误差。守则允许你从正面回去。", mark: "completedCleanCycle" },
    thread: { target: "red-thread-registry", feedback: "三次巡查缠成同一根线。登记室要求保存这份连对记录。", mark: "completedThreadCycle" },
    name: { target: "blank-name-cloakroom", feedback: "三次巡查仍没有写出名字。寄存处替你保留了空白。", mark: "completedNameCycle" },
    bell: { target: "clapperless-bell-desk", feedback: "三次巡查都先于铃声。接待台把沉默记作合格。", mark: "completedBellCycle" },
  };
  const DRIFT_ROOM = { thread: "red-thread-registry", name: "blank-name-cloakroom", bell: "clapperless-bell-desk" };
  const DRIFT_MISREPORT = {
    thread: { feedback: "你报告了红线，但红线没有移动。误报把你送进登记室重新认线。", mark: "misreportedThread" },
    name: { feedback: "你报告了空名牌，但它仍然闭合。寄存处要求你核对自己的名字。", mark: "misreportedName" },
    bell: { feedback: "你报告了铃钮，但它还没有张口。接待台仍把误报当成一次叫号。", mark: "misreportedBell" },
  };
  const DRIFT_MISSED = {
    thread: "你放行了第九个绳结。红线从布告板背面把你拖进登记室。",
    name: "你放行了半开的空名牌。取物牌把你领进寄存处。",
    bell: "你放行了渗液的铃口。没有声音的叫号仍然轮到了你。",
  };
  const DRIFT_WRONG_SPOT = {
    "thread>name": "你报告了空名牌，但漂移的是红线。寄存处收下了这次错报，第九个绳结仍留在原处。",
    "thread>bell": "你报告了铃钮，但漂移的是红线。接待台收下了这次错报，第九个绳结仍留在原处。",
    "name>thread": "你报告了红线，但漂移的是空名牌。登记室收下了这次错报，半开的名牌仍留在原处。",
    "name>bell": "你报告了铃钮，但漂移的是空名牌。接待台收下了这次错报，半开的名牌仍留在原处。",
    "bell>thread": "你报告了红线，但漂移的是铃钮。登记室收下了这次错报，渗液的铃口仍留在原处。",
    "bell>name": "你报告了空名牌，但漂移的是铃钮。寄存处收下了这次错报，渗液的铃口仍留在原处。",
  };
  const DRIFT_REPORT_MARK = { thread: "reportedThreadDrift", name: "reportedNameDrift", bell: "reportedBellDrift" };

  /* 固定规则表：给定拍面/作答/接受后 streak，推导唯一合法的
     correct/target/feedback/nextCycle/nextCursor（handler 与 pending 校验共用） */
  const driftResolve = (round, answer, cycle, cursor, streak) => {
    const correct = answer === "forward" ? round === "normal" : answer === round;
    if (correct) {
      if (streak >= 3) {
        const c = DRIFT_COMPLETE[round];
        return { round, answer, correct: true, target: c.target, feedback: c.feedback, nextCycle: cycle + 1, nextCursor: 0 };
      }
      return { round, answer, correct: true, target: "protocol-drift", feedback: DRIFT_CORRECT_FEEDBACK[round], nextCycle: cycle, nextCursor: cursor + 1 };
    }
    let target;
    let feedback;
    if (round === "normal") {
      target = DRIFT_ROOM[answer];
      feedback = DRIFT_MISREPORT[answer].feedback;
    } else if (answer === "forward") {
      target = DRIFT_ROOM[round];
      feedback = DRIFT_MISSED[round];
    } else {
      target = DRIFT_ROOM[answer];
      feedback = DRIFT_WRONG_SPOT[`${round}>${answer}`];
    }
    return { round, answer, correct: false, target, feedback, nextCycle: cycle + 1, nextCursor: 0 };
  };

  const getDrift = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(DRIFT_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const num = (v) => {
      let n = Number(v);
      if (!Number.isFinite(n) || n < 0) n = 0;
      return Math.min(DRIFT_NUM_CAP, Math.floor(n));
    };
    const visited = raw.visited === true;
    const cycle = num(raw.cycle);
    /* cursor 只接受 0–7，非法归 0；round 永远按 cycle + 固定序列重算 */
    let cursor = num(raw.cursor);
    if (cursor > 7) cursor = 0;
    const round = DRIFT_SEQ[(cycle * 3 + cursor) % DRIFT_SEQ.length];
    /* streak / bestStreak 只接受 0–3；bestStreak 不得小于 streak */
    let streak = num(raw.streak);
    if (streak > 3) streak = 3;
    let bestStreak = num(raw.bestStreak);
    if (bestStreak > 3) bestStreak = 3;
    if (bestStreak < streak) bestStreak = streak;
    const correct = num(raw.correct);
    const misreports = num(raw.misreports);
    const inspections = num(raw.inspections);
    /* lastRound / lastAnswer 只接受合法组合；不合法一起清空 */
    let lastRound = DRIFT_ROUNDS.includes(raw.lastRound) ? raw.lastRound : "";
    let lastAnswer = DRIFT_ANSWERS.includes(raw.lastAnswer) ? raw.lastAnswer : "";
    if (!lastRound || !lastAnswer) {
      lastRound = "";
      lastAnswer = "";
    }
    /* pending 必须是 {round, answer, correct, target, feedback, nextCycle, nextCursor}
       完整映射并与固定规则表逐字段一致；任一字段错配即清空。
       pending 只用于恢复已接受但尚未完成的反馈/换图/转场，不得重复累计 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const p = raw.pending;
      if (p.round === round && DRIFT_ANSWERS.includes(p.answer) && p.answer !== "exit") {
        const expected = driftResolve(round, p.answer, cycle, cursor, streak);
        if (p.correct === expected.correct && p.target === expected.target && p.feedback === expected.feedback
          && p.nextCycle === expected.nextCycle && p.nextCursor === expected.nextCursor) {
          pending = { ...expected };
        }
      }
    }
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => DRIFT_MARKS.includes(m)))].slice(0, DRIFT_MARKS.length)
      : [];
    return { visited, cycle, cursor, round, streak, bestStreak, correct, misreports, inspections, lastRound, lastAnswer, pending, marks };
  };
  const saveDrift = (st) => store.set(DRIFT_KEY, JSON.stringify(st));

  /* 解锁：只读 v41 visited，任意两间背室为 true 即显露；坏存档按全 false */
  const driftUnlocked = () => BACKROOM_SCENES.filter((s) => getBackrooms().visited[s]).length >= 2;

  const syncDriftEntry = () => {
    const btn = $("#protocol-hotspot-drift");
    if (!btn) return;
    if (driftUnlocked()) {
      if (btn.hasAttribute("hidden")) {
        btn.removeAttribute("hidden");
        const st = getDrift();
        if (!st.marks.includes("unlockedProtocolDrift")) {
          st.marks.push("unlockedProtocolDrift");
          saveDrift(st);
        }
      }
    } else {
      btn.setAttribute("hidden", "");
    }
  };

  const syncDriftLink = () => {
    const link = $("#drift-link");
    if (!link) return;
    if (getDrift().visited) link.removeAttribute("hidden");
    else link.setAttribute("hidden", "");
  };

  const driftDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  /* 换图：先隐去旧图，新图解码完成再现身（可感知换图节拍，不闪旧图不留白） */
  const showDriftImage = (round) => {
    const img = $("#drift-img");
    const asset = DRIFT_ROUND_IMG[round];
    if (!img || !asset) return;
    const showImg = () => img.classList.remove("is-loading");
    if (img.getAttribute("src") !== asset) {
      img.classList.add("is-loading");
      img.addEventListener("load", showImg, { once: true });
      img.setAttribute("src", asset);
      if (img.complete && img.naturalWidth > 0) showImg();
    } else {
      showImg();
    }
  };

  const paintDrift = () => {
    const st = getDrift();
    showDriftImage(st.round);
    const statusEl = $("#drift-status");
    if (statusEl) statusEl.textContent = `连对 ${st.streak} / 3 · 最佳 ${st.bestStreak} / 3 · 正确 ${st.correct} · 误报 ${st.misreports}`;
    const locked = AutoAdvance.has("protocol-drift") || AutoAdvance.has("protocol-drift-step");
    ["#drift-hotspot-thread", "#drift-hotspot-nameplate", "#drift-hotspot-bell", "#drift-hotspot-forward"].forEach((sel) => {
      const btn = $(sel);
      if (btn) btn.disabled = locked;
    });
  };

  /* timer 真正触发前清 pending 并应用下一拍坐标；只恢复动作，不重复累计。
     完成拍落地时连对归零（下一轮从头连对）；误判在作答时已归零 */
  const fireDriftPending = () => {
    const st = getDrift();
    if (!st.pending) return;
    if (st.pending.correct && st.pending.target !== "protocol-drift") st.streak = 0;
    st.cycle = st.pending.nextCycle;
    st.cursor = st.pending.nextCursor;
    st.pending = null;
    saveDrift(st);
  };

  const advanceDriftBeat = (target) => {
    fireDriftPending();
    if (target === "protocol-drift") {
      paintDrift();
      /* 下一拍焦点回到第一判断热点 */
      const first = $("#drift-hotspot-thread");
      if (first) focusReliably(first);
    }
  };

  /* 进入巡查台：到访标记（直 hash 始终允许，不自动作答）；
     合法 pending 属于本场景（reload/离场后重返）时重播原反馈并完成原动作 */
  const enterDrift = () => {
    const st0 = getDrift();
    if (!st0.visited) {
      st0.visited = true;
      saveDrift(st0);
      syncDriftLink();
    }
    const st = getDrift();
    const responseEl = $("#drift-response");
    if (responseEl) responseEl.textContent = "";
    if (st.pending) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("protocol-drift-step", p.target, {
        delay: driftDelay(),
        before: () => advanceDriftBeat(p.target),
      });
    }
    paintDrift();
  };

  /* 四个判断：在任何 v42 状态读写、反馈、声音或 timer 前校验当前场景；
     同拍只接受第一项，接受后四个判断热点立即 disabled */
  const answerDrift = (answer) => {
    if (!["forward", "thread", "name", "bell"].includes(answer)) return;
    if (currentScene !== "protocol-drift") return;
    if (AutoAdvance.has("protocol-drift") || AutoAdvance.has("protocol-drift-step")) return;
    const st = getDrift();
    const round = st.round;
    const correct = answer === "forward" ? round === "normal" : answer === round;
    st.lastRound = round;
    st.lastAnswer = answer;
    st.inspections = Math.min(DRIFT_NUM_CAP, st.inspections + 1);
    if (correct) {
      st.correct = Math.min(DRIFT_NUM_CAP, st.correct + 1);
      st.streak = Math.min(3, st.streak + 1);
      st.bestStreak = Math.max(st.bestStreak, st.streak);
      const mark = answer === "forward" ? "passedCleanBoard" : DRIFT_REPORT_MARK[answer];
      if (!st.marks.includes(mark)) st.marks.push(mark);
      if (st.streak >= 3) {
        const cm = DRIFT_COMPLETE[round].mark;
        if (!st.marks.includes(cm)) st.marks.push(cm);
      }
    } else {
      st.misreports = Math.min(DRIFT_NUM_CAP, st.misreports + 1);
      st.streak = 0;
      if (answer !== "forward") {
        const mm = DRIFT_MISREPORT[answer].mark;
        if (!st.marks.includes(mm)) st.marks.push(mm);
      }
      if (round !== "normal" && !st.marks.includes("missedRealDrift")) st.marks.push("missedRealDrift");
    }
    const resolution = driftResolve(round, answer, st.cycle, st.cursor, st.streak);
    st.pending = { ...resolution };
    saveDrift(st);
    const responseEl = $("#drift-response");
    if (responseEl) responseEl.textContent = resolution.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内四个判断热点保持 disabled */
    AutoAdvance.schedule("protocol-drift-step", resolution.target, {
      delay: driftDelay(),
      before: () => advanceDriftBeat(resolution.target),
    });
    paintDrift();
  };

  [
    ["#drift-hotspot-thread", "thread"],
    ["#drift-hotspot-nameplate", "name"],
    ["#drift-hotspot-bell", "bell"],
    ["#drift-hotspot-forward", "forward"],
  ].forEach(([sel, answer]) => {
    const btn = $(sel);
    if (btn) btn.addEventListener("click", () => answerDrift(answer));
  });

  /* 守则板第四入口：与八条守则及 v41 三入口共用 protocol 首选锁；
     在任何状态读写、声音、反馈或 timer 前校验 currentScene === "protocol" */
  const driftSpotBtn = $("#protocol-hotspot-drift");
  if (driftSpotBtn) driftSpotBtn.addEventListener("click", () => {
    if (currentScene !== "protocol") return;
    if (AutoAdvance.has("protocol")) return;
    if (!driftUnlocked()) return;
    const st = getDrift();
    st.visited = true;
    if (!st.marks.includes("enteredProtocolDrift")) st.marks.push("enteredProtocolDrift");
    saveDrift(st);
    syncDriftLink();
    driftSpotBtn.classList.add("touched");
    setTimeout(() => driftSpotBtn.classList.remove("touched"), 1200);
    AudioEngine.knock();
    const responseEl = $("#protocol-backroom-response");
    if (responseEl) responseEl.textContent = "旧蜡印比上一次更软。布告板要求你证明，自己还记得它原来的样子。";
    AutoAdvance.schedule("protocol", "protocol-drift", {
      delay: branchDelay(),
      before: () => { protocolConsumed = true; },
    });
  });

  /* 痕迹页单行：巡查/正确/最佳连对/误报，保持八张统计卡不变 */
  const paintDriftMemory = () => {
    const memory = $("#drift-memory");
    if (!memory) return;
    const st = getDrift();
    if (!st.visited) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `守则漂移：巡查 ${st.inspections} 次；正确 ${st.correct} 次；最佳连对 ${st.bestStreak}/3；误报 ${st.misreports} 次。`;
    memory.hidden = false;
  };

  /* ============================================================
     v43 门内回敲网：第一敲后门板三回敲 + 三个画面热点场景
     状态独立存 goddead_v43_counter_knock，容错坏 JSON；
     pending 必须是 {scene, action, target, feedback} 完整合法映射；
     不读不写 v28–v42 与主线状态；点击即执行，无确认/继续按钮。
     ============================================================ */
  const KNOCK_KEY = "goddead_v43_counter_knock";
  const KNOCK_SCENES = ["gallery", "vestibule", "dispatch"];
  const KNOCK_SCENE_NAMES = ["counter-knock-gallery", "unanswered-vestibule", "undersill-dispatch"];
  const KNOCK_SCENE_NAME = { gallery: "counter-knock-gallery", vestibule: "unanswered-vestibule", dispatch: "undersill-dispatch" };
  const KNOCK_NAME_SCENE = { "counter-knock-gallery": "gallery", "unanswered-vestibule": "vestibule", "undersill-dispatch": "dispatch" };
  const KNOCK_ENTRIES = ["threshold-left", "threshold-seam", "threshold-right", "gallery", "vestibule", "dispatch", "direct"];
  const KNOCK_MARKS = [
    "struckInwardKnocker", "heldStillKnocker", "followedEarlyShadow",
    "registeredFirstKnock", "heardSecondKnock", "erasedThirdKnock",
    "acceptedBlackSeal", "returnedBlankSlip", "climbedHingeRail",
  ];
  const KNOCK_NUM_CAP = 9999;

  const KNOCK_ACTIONS = {
    gallery: {
      inward: { btn: "#counter-knock-action-inward", target: "peephole-chamber", feedback: "门环向墙里落下。倒置窥孔从另一面替你睁开。", mark: "struckInwardKnocker" },
      still: { btn: "#counter-knock-action-still", target: "unanswered-vestibule", feedback: "门环没有动。未应门前厅却替它登记了第二声。", mark: "heldStillKnocker" },
      shadow: { btn: "#counter-knock-action-shadow", target: "undersill-dispatch", feedback: "影子钻进门槛。投递轨把你的脚步当成一封未封口的信。", mark: "followedEarlyShadow" },
    },
    vestibule: {
      first: { btn: "#unanswered-action-first", target: "protocol", feedback: "第一声获得编号。访客守则承认你已经来过一次。", mark: "registeredFirstKnock" },
      second: { btn: "#unanswered-action-second", target: "counter-knock-gallery", feedback: "第二声找到了原来的门环。回敲廊重新向你打开。", mark: "heardSecondKnock" },
      third: { btn: "#unanswered-action-third", target: "return-passage", feedback: "第三声被撤销。回返夹道替你保存了一条没有开门的路线。", mark: "erasedThirdKnock" },
    },
    dispatch: {
      seal: { btn: "#undersill-action-seal", target: "proxy-admission", feedback: "封件没有名字，代审窗仍把它当成一位夜访者。", mark: "acceptedBlackSeal" },
      blank: { btn: "#undersill-action-blank", target: "glyph-niche", feedback: "纸条从门缝出去时，多带走了一个编号。失号龛替它留出空位。", mark: "returnedBlankSlip" },
      hinge: { btn: "#undersill-action-hinge", target: "hinge-sorting-room", feedback: "投递轨向上翻成门轴。铰链分拣室开始决定你应该向哪边打开。", mark: "climbedHingeRail" },
    },
  };
  /* v31 门前守卫的 v43 窄例外表：knock action → 唯一放行的 v31 场景 */
  const KNOCK_V31_TARGET = { inward: "peephole-chamber", third: "return-passage", blank: "glyph-niche" };
  const KNOCK_RESPONSE_EL = { gallery: "#gallery-response", vestibule: "#vestibule-response", dispatch: "#dispatch-response" };
  const KNOCK_LINKS = { gallery: "#knock-gallery-link", vestibule: "#unanswered-link", dispatch: "#undersill-link" };

  const getKnockNet = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(KNOCK_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    /* visited 只接受 gallery / vestibule / dispatch 三个布尔键 */
    const visited = {};
    KNOCK_SCENES.forEach((s) => {
      visited[s] = Boolean(raw.visited && raw.visited[s] === true);
    });
    const entry = KNOCK_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    /* pending 必须是 {scene, action, target, feedback} 完整合法映射，
       四字段与动作表逐字段一致；任一字段缺失或错配即清空。
       pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const acts = KNOCK_ACTIONS[raw.pending.scene];
      const act = acts && acts[raw.pending.action];
      if (act && raw.pending.target === act.target && raw.pending.feedback === act.feedback) {
        pending = { scene: raw.pending.scene, action: raw.pending.action, target: act.target, feedback: act.feedback };
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配 */
    const lastScene = KNOCK_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && KNOCK_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    let traversals = Number(raw.traversals);
    if (!Number.isFinite(traversals) || traversals < 0) traversals = 0;
    traversals = Math.min(KNOCK_NUM_CAP, Math.floor(traversals));
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => KNOCK_MARKS.includes(m)))].slice(0, KNOCK_MARKS.length)
      : [];
    return { visited, entry, pending, lastScene, lastAction, traversals, marks };
  };
  const saveKnockNet = (st) => store.set(KNOCK_KEY, JSON.stringify(st));

  const syncKnockLinks = () => {
    const st = getKnockNet();
    KNOCK_SCENES.forEach((s) => {
      const link = $(KNOCK_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markKnockVisited = (sceneKey) => {
    const st = getKnockNet();
    if (!KNOCK_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    saveKnockNet(st);
    syncKnockLinks();
  };

  const knockNetDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintKnockScene = (sceneKey) => {
    const st = getKnockNet();
    const locked = AutoAdvance.has("knocknet-" + sceneKey);
    Object.keys(KNOCK_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(KNOCK_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.marks.includes(KNOCK_ACTIONS[sceneKey][actionId].mark) ? "true" : "false");
    });
  };

  /* 进入回敲场景：到访标记；若合法 pending 属于本场景（reload/离场后重返），
     重播逐字反馈并恢复转场，timer 真正触发前才清 pending */
  const enterKnockNet = (sceneKey) => {
    markKnockVisited(sceneKey);
    const st = getKnockNet();
    const responseEl = $(KNOCK_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("knocknet-" + sceneKey, p.target, {
        delay: knockNetDelay(),
        before: () => {
          const s = getKnockNet();
          if (s.pending && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            saveKnockNet(s);
          }
        },
      });
    }
    paintKnockScene(sceneKey);
  };

  /* 九个画面动作：在任何状态访问与副作用前校验 live scene（隐藏/off-route
     脚本化点击零副作用）；第一项被接受后同场景全部热点立即 disabled
     （同节拍竞争只接受第一项），逐字反馈写入 aria-live，pending 持久化后自动转场 */
  const runKnockAction = (sceneKey, actionId) => {
    const act = KNOCK_ACTIONS[sceneKey] && KNOCK_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== KNOCK_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("knocknet-" + sceneKey)) return;
    const st = getKnockNet();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    if (!st.marks.includes(act.mark)) st.marks.push(act.mark);
    st.traversals = Math.min(KNOCK_NUM_CAP, st.traversals + 1);
    st.pending = { scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    st.entry = sceneKey;
    saveKnockNet(st);
    const responseEl = $(KNOCK_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内同场景全部热点保持 disabled */
    AutoAdvance.schedule("knocknet-" + sceneKey, act.target, {
      delay: knockNetDelay(),
      before: () => {
        const s = getKnockNet();
        if (s.pending && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          saveKnockNet(s);
        }
      },
    });
    paintKnockScene(sceneKey);
  };

  KNOCK_SCENES.forEach((sceneKey) => {
    Object.keys(KNOCK_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(KNOCK_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runKnockAction(sceneKey, actionId));
    });
  });

  /* 门内回敲窗口：第一/第二敲后三回敲显露（第二敲更急促），
     第三敲/第四敲/敲门衰减/离开首页或首选锁已排定时隐藏 */
  const COUNTER_KNOCK_IDS = ["hotspot-counter-knock-left", "hotspot-counter-knock-seam", "hotspot-counter-knock-right"];
  const syncCounterKnockWindow = () => {
    const show = currentScene === "threshold" && (knocks === 1 || knocks === 2) && !thresholdConsumed && !AutoAdvance.has("threshold");
    COUNTER_KNOCK_IDS.forEach((id) => {
      const btn = $("#" + id);
      if (!btn) return;
      if (show) btn.removeAttribute("hidden");
      else btn.setAttribute("hidden", "");
      btn.classList.toggle("counter-urgent", show && knocks === 2);
    });
  };

  /* 三处回敲：与三敲、v31 三热点、v38 代审、v40 左右廊共用 threshold 首选锁；
     在读取状态、写反馈、播放声音或排 timer 前校验 live scene、窗口可见与敲门数 */
  const KNOCK_THRESHOLD_SPOTS = {
    "hotspot-counter-knock-left": { entry: "threshold-left", scene: "gallery", target: "counter-knock-gallery", feedback: "左扇门板从里面先敲了一次。那声回敲把门后的一整条廊道震亮。" },
    "hotspot-counter-knock-seam": { entry: "threshold-seam", scene: "vestibule", target: "unanswered-vestibule", feedback: "第二声没有来自门后。它被门缝收走，登记成一次从未发生的来访。" },
    "hotspot-counter-knock-right": { entry: "threshold-right", scene: "dispatch", target: "undersill-dispatch", feedback: "右扇没有振动。回敲沿把手向下滑，落进门槛下面的投递轨。" },
  };
  Object.keys(KNOCK_THRESHOLD_SPOTS).forEach((id) => {
    const btn = $("#" + id);
    const spot = KNOCK_THRESHOLD_SPOTS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (currentScene !== "threshold") return;
      if (btn.hasAttribute("hidden")) return;
      if (knocks !== 1 && knocks !== 2) return;
      if (AutoAdvance.has("threshold")) return;
      const st = getKnockNet();
      st.entry = spot.entry;
      st.visited[spot.scene] = true;
      st.traversals = Math.min(KNOCK_NUM_CAP, st.traversals + 1);
      saveKnockNet(st);
      syncKnockLinks();
      btn.classList.add("touched");
      setTimeout(() => btn.classList.remove("touched"), 1200);
      /* 任一回敲被接受后立即隐藏全部三处并失去焦点 */
      COUNTER_KNOCK_IDS.forEach((other) => {
        const b = $("#" + other);
        if (b) b.setAttribute("hidden", "");
      });
      AudioEngine.knock();
      statusLine.textContent = spot.feedback;
      AutoAdvance.schedule("threshold", spot.target, { delay: branchDelay() });
    });
  });

  /* 痕迹页单行：改道次数与已见场景数，保持八张统计卡不变 */
  const paintKnockNetMemory = () => {
    const memory = $("#knocknet-memory");
    if (!memory) return;
    const st = getKnockNet();
    const seen = KNOCK_SCENES.filter((s) => st.visited[s]).length;
    if (seen === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `门内回敲：改道 ${st.traversals} 次；回敲 / 未应 / 门槛下已见 ${seen}/3。`;
    memory.hidden = false;
  };

  /* ============================================================
     v44 页后空层：残页 f1/f5/f8 首读改线 + 三个画面热点场景
     状态独立存 goddead_v44_paperback_spaces，容错坏 JSON；
     pending 必须是 {scene, action, target, feedback} 完整合法映射；
     不读不写 v28–v43 与主线状态；点击即执行，无确认/继续按钮。
     ============================================================ */
  const PAPERBACK_KEY = "goddead_v44_paperback_spaces";
  const PAPERBACK_SCENES = ["shadow", "foundry", "retention"];
  const PAPERBACK_SCENE_NAMES = ["lagging-shadow-cloister", "ash-door-foundry", "retention-vault"];
  const PAPERBACK_SCENE_NAME = { shadow: "lagging-shadow-cloister", foundry: "ash-door-foundry", retention: "retention-vault" };
  const PAPERBACK_NAME_SCENE = { "lagging-shadow-cloister": "shadow", "ash-door-foundry": "foundry", "retention-vault": "retention" };
  const PAPERBACK_ENTRIES = ["fragment-f1", "fragment-f5", "fragment-f8", "shadow", "foundry", "retention", "direct"];
  const PAPERBACK_MARKS = [
    "pulledShadowNail", "enteredOwnerlessOutline", "waitedForLateShadow",
    "workedColdBellows", "tookCinderKey", "crossedUnfinishedDoor",
    "woreBlankRetentionTag", "touchedMissingRelicImprint", "leftFragmentOnPlinth",
  ];
  const PAPERBACK_NUM_CAP = 9999;

  const PAPERBACK_ACTIONS = {
    shadow: {
      pin: { btn: "#paperback-shadow-action-pin", target: "borrowed-shadow-gallery", feedback: "钉子一松，墙上的影子立刻借走了你的站姿。", mark: "pulledShadowNail" },
      outline: { btn: "#paperback-shadow-action-outline", target: "ash-door-foundry", feedback: "轮廓比门更早关上。灰门铸室在纸背后亮起。", mark: "enteredOwnerlessOutline" },
      catch: { btn: "#paperback-shadow-action-catch", target: "return-passage", feedback: "影子从身后赶到，却从你的前面走进回返夹道。", mark: "waitedForLateShadow" },
    },
    foundry: {
      bellows: { btn: "#paperback-foundry-action-bellows", target: "protocol", feedback: "风箱吐出一口冷灰。灰尘在墙上排成第一条访客守则。", mark: "workedColdBellows" },
      key: { btn: "#paperback-foundry-action-key", target: "retention-vault", feedback: "钥匙没有齿，却准确打开了留置空库里最空的一格。", mark: "tookCinderKey" },
      door: { btn: "#paperback-foundry-action-door", target: "unlit-lamp-gallery", feedback: "你从缺少一侧门框的地方穿过去。无灯灯廊替它补上了黑暗。", mark: "crossedUnfinishedDoor" },
    },
    retention: {
      tag: { btn: "#paperback-retention-action-tag", target: "counter-knock-gallery", feedback: "标签贴住你以后，门内先替你敲了一声。", mark: "woreBlankRetentionTag" },
      imprint: { btn: "#paperback-retention-action-imprint", target: "lagging-shadow-cloister", feedback: "灰尘记住了手指，却把影子送回另一条回廊。", mark: "touchedMissingRelicImprint" },
      page: { btn: "#paperback-retention-action-page", target: "corridor", feedback: "纸留在原地，纸上的字却先一步回到了走廊。", mark: "leftFragmentOnPlinth" },
    },
  };
  const PAPERBACK_RESPONSE_EL = { shadow: "#paperback-shadow-response", foundry: "#paperback-foundry-response", retention: "#paperback-retention-response" };
  const PAPERBACK_LINKS = { shadow: "#paperback-shadow-link", foundry: "#paperback-foundry-link", retention: "#paperback-retention-link" };

  const getPaperback = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(PAPERBACK_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    /* visited 只接受 shadow / foundry / retention 三个布尔键 */
    const visited = {};
    PAPERBACK_SCENES.forEach((s) => {
      visited[s] = Boolean(raw.visited && raw.visited[s] === true);
    });
    const entry = PAPERBACK_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    /* pending 必须是 {scene, action, target, feedback} 完整合法映射，
       四字段与动作表逐项完全对应；缺字段、伪造 target/feedback、
       scene/action 错配全部归一为 null。
       pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const acts = PAPERBACK_ACTIONS[raw.pending.scene];
      const act = acts && acts[raw.pending.action];
      if (act && raw.pending.target === act.target && raw.pending.feedback === act.feedback) {
        pending = { scene: raw.pending.scene, action: raw.pending.action, target: act.target, feedback: act.feedback };
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配 */
    const lastScene = PAPERBACK_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && PAPERBACK_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    let traversals = Number(raw.traversals);
    if (!Number.isFinite(traversals) || traversals < 0) traversals = 0;
    traversals = Math.min(PAPERBACK_NUM_CAP, Math.floor(traversals));
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => PAPERBACK_MARKS.includes(m)))].slice(0, PAPERBACK_MARKS.length)
      : [];
    return { visited, entry, pending, lastScene, lastAction, traversals, marks };
  };
  const savePaperback = (st) => store.set(PAPERBACK_KEY, JSON.stringify(st));

  const syncPaperbackLinks = () => {
    const st = getPaperback();
    PAPERBACK_SCENES.forEach((s) => {
      const link = $(PAPERBACK_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markPaperbackVisited = (sceneKey) => {
    const st = getPaperback();
    if (!PAPERBACK_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    savePaperback(st);
    syncPaperbackLinks();
  };

  const paperbackDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintPaperbackScene = (sceneKey) => {
    const st = getPaperback();
    const locked = AutoAdvance.has("paperback-" + sceneKey);
    Object.keys(PAPERBACK_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(PAPERBACK_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.marks.includes(PAPERBACK_ACTIONS[sceneKey][actionId].mark) ? "true" : "false");
    });
  };

  /* 进入页后场景：到访标记；若合法 pending 属于本场景（reload/离场后重返），
     重播逐字反馈并恢复转场，timer 真正触发前才清 pending */
  const enterPaperback = (sceneKey) => {
    markPaperbackVisited(sceneKey);
    const st = getPaperback();
    const responseEl = $(PAPERBACK_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("paperback-" + sceneKey, p.target, {
        delay: paperbackDelay(),
        before: () => {
          const s = getPaperback();
          if (s.pending && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            savePaperback(s);
          }
        },
      });
    }
    paintPaperbackScene(sceneKey);
  };

  /* 九个画面动作：在任何状态读取、反馈、音效、timer 之前校验 live scene；
     第一项被接受后同场景三个热点立即 disabled（同拍竞争只记一次），
     逐字反馈写入各场景 aria-live，pending 持久化后自动转场 */
  const runPaperbackAction = (sceneKey, actionId) => {
    const act = PAPERBACK_ACTIONS[sceneKey] && PAPERBACK_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== PAPERBACK_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("paperback-" + sceneKey)) return;
    const st = getPaperback();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    if (!st.marks.includes(act.mark)) st.marks.push(act.mark);
    st.traversals = Math.min(PAPERBACK_NUM_CAP, st.traversals + 1);
    st.pending = { scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    st.entry = sceneKey;
    savePaperback(st);
    const responseEl = $(PAPERBACK_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内同场景全部热点保持 disabled */
    AutoAdvance.schedule("paperback-" + sceneKey, act.target, {
      delay: paperbackDelay(),
      before: () => {
        const s = getPaperback();
        if (s.pending && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          savePaperback(s);
        }
      },
    });
    paintPaperbackScene(sceneKey);
  };

  PAPERBACK_SCENES.forEach((sceneKey) => {
    Object.keys(PAPERBACK_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(PAPERBACK_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runPaperbackAction(sceneKey, actionId));
    });
  });

  /* 痕迹页单行：改道次数与已见场景数，保持八张统计卡不变 */
  const paintPaperbackMemory = () => {
    const memory = $("#paperback-memory");
    if (!memory) return;
    const st = getPaperback();
    const seen = PAPERBACK_SCENES.filter((s) => st.visited[s]).length;
    if (seen === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `页后空层：改道 ${st.traversals} 次；滞影 / 灰门 / 留置已见 ${seen}/3。`;
    memory.hidden = false;
  };

  /* ============================================================
     v45 未到交班：值夜室钟轴/台灯/空椅三入口 + 三个画面热点场景
     状态独立存 goddead_v45_absent_relief，容错坏 JSON；
     pending 必须是 {scene, action, target, feedback} 完整合法映射；
     不读不写 v28–v44、goddead_watch、goddead_line4 与主线状态；
     点击即执行，无确认/继续按钮。
     ============================================================ */
  const RELIEF_KEY = "goddead_v45_absent_relief";
  const RELIEF_SCENES = ["minute", "wick", "locker"];
  const RELIEF_SCENE_NAMES = ["minute-before-archive", "cold-wick-service-bay", "absent-relief-locker"];
  const RELIEF_SCENE_NAME = { minute: "minute-before-archive", wick: "cold-wick-service-bay", locker: "absent-relief-locker" };
  const RELIEF_NAME_SCENE = { "minute-before-archive": "minute", "cold-wick-service-bay": "wick", "absent-relief-locker": "locker" };
  const RELIEF_ENTRIES = ["watch-clock", "watch-lamp", "watch-chair", "minute", "wick", "locker", "direct"];
  const RELIEF_MARKS = [
    "rewoundMinuteHand", "stampedBlankShiftCard", "descendedClockGearSlot",
    "turnedColdWick", "pulledTelephoneCable", "resetChairFuse",
    "woreNamelessWatchCoat", "satInReliefChair", "signedAbsentReliefRoster",
  ];
  const RELIEF_NUM_CAP = 9999;

  const RELIEF_ACTIONS = {
    minute: {
      hand: { btn: "#relief-minute-action-hand", target: "lagging-shadow-cloister", feedback: "分针退了一格。滞影回廊里，所有影子同时迟到。", mark: "rewoundMinuteHand" },
      card: { btn: "#relief-minute-action-card", target: "night-shift-registry", feedback: "印章落下时，日期往后跳了一夜。夜班登记所从档案井上方开窗。", mark: "stampedBlankShiftCard" },
      shaft: { btn: "#relief-minute-action-shaft", target: "cold-wick-service-bay", feedback: "齿槽没有通向钟背，而是把你送进灭灯的供电层。", mark: "descendedClockGearSlot" },
    },
    wick: {
      wick: { btn: "#relief-wick-action-wick", target: "unlit-lamp-gallery", feedback: "灯芯亮成一小块更深的黑。无灯灯廊认出了这种光。", mark: "turnedColdWick" },
      cable: { btn: "#relief-wick-action-cable", target: "counter-knock-gallery", feedback: "线头没有电，只有三下从门内回来的震动。", mark: "pulledTelephoneCable" },
      fuse: { btn: "#relief-wick-action-fuse", target: "absent-relief-locker", feedback: "保险片合上，缺班者的更衣柜在墙后通了电。", mark: "resetChairFuse" },
    },
    locker: {
      coat: { btn: "#relief-locker-action-coat", target: "proxy-admission", feedback: "外套替你填了名字。门外代审窗只看见一个正在替班的人。", mark: "woreNamelessWatchCoat" },
      chair: { btn: "#relief-locker-action-chair", target: "borrowed-shadow-gallery", feedback: "椅子先承认了你的影子，借影陈列廊随后承认了你。", mark: "satInReliefChair" },
      roster: { btn: "#relief-locker-action-roster", target: "watch", feedback: "最后一栏出现了你的笔迹。第三值夜室终于等到下一班——仍然是你。", mark: "signedAbsentReliefRoster" },
    },
  };
  const RELIEF_RESPONSE_EL = { minute: "#relief-minute-response", wick: "#relief-wick-response", locker: "#relief-locker-response" };
  const RELIEF_LINKS = { minute: "#relief-minute-link", wick: "#relief-wick-link", locker: "#relief-locker-link" };

  const getRelief = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(RELIEF_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    /* visited 只接受 minute / wick / locker 三个布尔键 */
    const visited = {};
    RELIEF_SCENES.forEach((s) => {
      visited[s] = Boolean(raw.visited && raw.visited[s] === true);
    });
    const entry = RELIEF_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    /* pending 必须是 {scene, action, target, feedback} 完整合法映射，
       四字段与动作表逐项完全对应；缺字段、伪造 target/feedback、
       scene/action 错配全部归一为 null。
       pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const acts = RELIEF_ACTIONS[raw.pending.scene];
      const act = acts && acts[raw.pending.action];
      if (act && raw.pending.target === act.target && raw.pending.feedback === act.feedback) {
        pending = { scene: raw.pending.scene, action: raw.pending.action, target: act.target, feedback: act.feedback };
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配 */
    const lastScene = RELIEF_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && RELIEF_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    let traversals = Number(raw.traversals);
    if (!Number.isFinite(traversals) || traversals < 0) traversals = 0;
    traversals = Math.min(RELIEF_NUM_CAP, Math.floor(traversals));
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => RELIEF_MARKS.includes(m)))].slice(0, RELIEF_MARKS.length)
      : [];
    return { visited, entry, pending, lastScene, lastAction, traversals, marks };
  };
  const saveRelief = (st) => store.set(RELIEF_KEY, JSON.stringify(st));

  const syncReliefLinks = () => {
    const st = getRelief();
    RELIEF_SCENES.forEach((s) => {
      const link = $(RELIEF_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markReliefVisited = (sceneKey) => {
    const st = getRelief();
    if (!RELIEF_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    saveRelief(st);
    syncReliefLinks();
  };

  const reliefDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintReliefScene = (sceneKey) => {
    const st = getRelief();
    const locked = AutoAdvance.has("relief-" + sceneKey);
    Object.keys(RELIEF_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(RELIEF_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.marks.includes(RELIEF_ACTIONS[sceneKey][actionId].mark) ? "true" : "false");
    });
  };

  /* 进入交班场景：到访标记；若合法 pending 属于本场景（reload/离场后重返），
     重播逐字反馈并恢复转场，timer 真正触发前才清 pending */
  const enterRelief = (sceneKey) => {
    markReliefVisited(sceneKey);
    const st = getRelief();
    const responseEl = $(RELIEF_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("relief-" + sceneKey, p.target, {
        delay: reliefDelay(),
        before: () => {
          const s = getRelief();
          if (s.pending && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            saveRelief(s);
          }
        },
      });
    }
    paintReliefScene(sceneKey);
  };

  /* 九个画面动作：在任何状态读取、反馈、音效、timer 之前校验 live scene；
     第一项被接受后同场景三个热点立即 disabled（同拍竞争只记一次），
     逐字反馈写入各场景 aria-live，pending 持久化后自动转场 */
  const runReliefAction = (sceneKey, actionId) => {
    const act = RELIEF_ACTIONS[sceneKey] && RELIEF_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== RELIEF_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("relief-" + sceneKey)) return;
    const st = getRelief();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    if (!st.marks.includes(act.mark)) st.marks.push(act.mark);
    st.traversals = Math.min(RELIEF_NUM_CAP, st.traversals + 1);
    st.pending = { scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    st.entry = sceneKey;
    saveRelief(st);
    const responseEl = $(RELIEF_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内同场景全部热点保持 disabled */
    AutoAdvance.schedule("relief-" + sceneKey, act.target, {
      delay: reliefDelay(),
      before: () => {
        const s = getRelief();
        if (s.pending && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          saveRelief(s);
        }
      },
    });
    paintReliefScene(sceneKey);
  };

  RELIEF_SCENES.forEach((sceneKey) => {
    Object.keys(RELIEF_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(RELIEF_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runReliefAction(sceneKey, actionId));
    });
  });

  /* 值夜室三入口：与现有 watch AutoAdvance 共用第一归宿锁——
     在任何副作用前校验 live scene；第四线路转场已排定（AutoAdvance.has("watch")）时
     入口不写 v45、不反馈、不抢目的地；入口先被接受时先置 watchReliefArmed 再
     clear("watch")、持久化 v45 并排定支线；不写 goddead_watch / goddead_line4，
     不替玩家覆盖 05:02、不替玩家签退 */
  const RELIEF_WATCH_SPOTS = {
    "relief-entry-clock": { entry: "watch-clock", scene: "minute", target: "minute-before-archive", feedback: "钟轴向前让出一格，露出被压在十七分下面的档案井。" },
    "relief-entry-lamp": { entry: "watch-lamp", scene: "wick", target: "cold-wick-service-bay", feedback: "灯没有亮。桌面下方却亮出一条只给冷灯芯使用的检修槽。" },
    "relief-entry-chair": { entry: "watch-chair", scene: "locker", target: "absent-relief-locker", feedback: "椅子向后退了一班。墙里的缺班更衣柜替它打开。" },
  };
  Object.keys(RELIEF_WATCH_SPOTS).forEach((id) => {
    const btn = $("#" + id);
    const spot = RELIEF_WATCH_SPOTS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (currentScene !== "watch") return;
      if (AutoAdvance.has("watch")) return;
      watchReliefArmed = true;
      AutoAdvance.clear("watch");
      const st = getRelief();
      st.entry = spot.entry;
      st.visited[spot.scene] = true;
      st.traversals = Math.min(RELIEF_NUM_CAP, st.traversals + 1);
      saveRelief(st);
      syncReliefLinks();
      btn.classList.add("touched");
      setTimeout(() => btn.classList.remove("touched"), 1200);
      AudioEngine.knock();
      toast(spot.feedback);
      AutoAdvance.schedule("watch", spot.target, { delay: branchDelay() });
    });
  });

  /* 痕迹页单行：改道次数与已见场景数，保持八张统计卡不变 */
  const paintReliefMemory = () => {
    const memory = $("#relief-memory");
    if (!memory) return;
    const st = getRelief();
    const seen = RELIEF_SCENES.filter((s) => st.visited[s]).length;
    if (seen === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `未到交班：改道 ${st.traversals} 次；分前 / 冷芯 / 缺班已见 ${seen}/3。`;
    memory.hidden = false;
  };

  /* ============================================================
     v46 旁线未静：交换台听筒/散线插头/回铃灯三入口 + 三个画面热点场景
     状态独立存 goddead_v46_sidetones，容错坏 JSON；
     pending 必须是 {scene, action, target, feedback} 完整合法映射；
     不读不写 v28–v45、goddead_watch、goddead_line4 与主线状态；
     点击即执行，无确认/继续按钮。
     ============================================================ */
  const SIDETONE_KEY = "goddead_v46_sidetones";
  const SIDETONE_SCENES = ["booth", "jack", "morgue"];
  const SIDETONE_SCENE_NAMES = ["unseated-listening-booth", "unnumbered-jack-field", "return-ring-morgue"];
  const SIDETONE_SCENE_NAME = { booth: "unseated-listening-booth", jack: "unnumbered-jack-field", morgue: "return-ring-morgue" };
  const SIDETONE_NAME_SCENE = { "unseated-listening-booth": "booth", "unnumbered-jack-field": "jack", "return-ring-morgue": "morgue" };
  const SIDETONE_ENTRIES = ["switch-receiver", "switch-plug", "switch-return-lamp", "booth", "jack", "morgue", "direct"];
  const SIDETONE_MARKS = [
    "heardRosterWithoutCaller", "returnedSpeechAsKnocks", "satAtMissingOperatorSeat",
    "routedWanderingPlug", "connectedNumberlessSocket", "issuedBlankLineTag",
    "removedReturnedLamp", "readCallReturnSlip", "rangWaxFilledBell",
  ];
  const SIDETONE_NUM_CAP = 9999;

  const SIDETONE_ACTIONS = {
    booth: {
      earpiece: { btn: "#sidetone-booth-action-earpiece", target: "midnight-callback", feedback: "耳筒里没有来电，只有午夜回拨台在一遍遍念同一张值班表。", mark: "heardRosterWithoutCaller" },
      mouthpiece: { btn: "#sidetone-booth-action-mouthpiece", target: "counter-knock-gallery", feedback: "你没有说话。话筒却把三下敲门送回门内。", mark: "returnedSpeechAsKnocks" },
      chair: { btn: "#sidetone-booth-action-chair", target: "unnumbered-jack-field", feedback: "椅脚压下一枚暗扣，监听间的墙翻成无号插孔场。", mark: "satAtMissingOperatorSeat" },
    },
    jack: {
      plug: { btn: "#sidetone-jack-action-plug", target: "red-thread-registry", feedback: "插头穿过所有空孔，最后从红线登记所的线结里伸出来。", mark: "routedWanderingPlug" },
      socket: { btn: "#sidetone-jack-action-socket", target: "return-ring-morgue", feedback: "无号插孔接通了一条已经挂断的回铃，墙后开始逐格发亮。", mark: "connectedNumberlessSocket" },
      tag: { btn: "#sidetone-jack-action-tag", target: "night-shift-registry", feedback: "空白线签盖上夜班时刻，夜班登记所把它当成通行证。", mark: "issuedBlankLineTag" },
    },
    morgue: {
      lamp: { btn: "#sidetone-morgue-action-lamp", target: "unlit-lamp-gallery", feedback: "回铃灯离开托盘后变得更黑。无灯灯廊把这种黑当成照明。", mark: "removedReturnedLamp" },
      slip: { btn: "#sidetone-morgue-action-slip", target: "unanswered-vestibule", feedback: "退回单没有对端，只有三次无人应门的时间。", mark: "readCallReturnSlip" },
      bell: { btn: "#sidetone-morgue-action-bell", target: "unseated-listening-booth", feedback: "黑蜡没有发声。失席监听间里的空椅替它转过来。", mark: "rangWaxFilledBell" },
    },
  };
  const SIDETONE_RESPONSE_EL = { booth: "#sidetone-booth-response", jack: "#sidetone-jack-response", morgue: "#sidetone-morgue-response" };
  const SIDETONE_LINKS = { booth: "#sidetone-booth-link", jack: "#sidetone-jack-link", morgue: "#sidetone-morgue-link" };

  const getSidetone = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(SIDETONE_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    /* visited 只接受 booth / jack / morgue 三个布尔键 */
    const visited = {};
    SIDETONE_SCENES.forEach((s) => {
      visited[s] = Boolean(raw.visited && raw.visited[s] === true);
    });
    const entry = SIDETONE_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    /* pending 必须是 {scene, action, target, feedback} 完整合法映射，
       四字段与动作表逐项完全对应；缺字段、伪造 target/feedback、
       scene/action 错配全部归一为 null。
       pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const acts = SIDETONE_ACTIONS[raw.pending.scene];
      const act = acts && acts[raw.pending.action];
      if (act && raw.pending.target === act.target && raw.pending.feedback === act.feedback) {
        pending = { scene: raw.pending.scene, action: raw.pending.action, target: act.target, feedback: act.feedback };
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配 */
    const lastScene = SIDETONE_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && SIDETONE_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    let traversals = Number(raw.traversals);
    if (!Number.isFinite(traversals) || traversals < 0) traversals = 0;
    traversals = Math.min(SIDETONE_NUM_CAP, Math.floor(traversals));
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => SIDETONE_MARKS.includes(m)))].slice(0, SIDETONE_MARKS.length)
      : [];
    return { visited, entry, pending, lastScene, lastAction, traversals, marks };
  };
  const saveSidetone = (st) => store.set(SIDETONE_KEY, JSON.stringify(st));

  const syncSidetoneLinks = () => {
    const st = getSidetone();
    SIDETONE_SCENES.forEach((s) => {
      const link = $(SIDETONE_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markSidetoneVisited = (sceneKey) => {
    const st = getSidetone();
    if (!SIDETONE_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    saveSidetone(st);
    syncSidetoneLinks();
  };

  const sidetoneDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintSidetoneScene = (sceneKey) => {
    const st = getSidetone();
    const locked = AutoAdvance.has("sidetone-" + sceneKey);
    Object.keys(SIDETONE_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(SIDETONE_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.marks.includes(SIDETONE_ACTIONS[sceneKey][actionId].mark) ? "true" : "false");
    });
  };

  /* 进入旁线场景：到访标记；若合法 pending 属于本场景（reload/离场后重返），
     重播逐字反馈并恢复转场，timer 真正触发前才清 pending */
  const enterSidetone = (sceneKey) => {
    markSidetoneVisited(sceneKey);
    const st = getSidetone();
    const responseEl = $(SIDETONE_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("sidetone-" + sceneKey, p.target, {
        delay: sidetoneDelay(),
        before: () => {
          const s = getSidetone();
          if (s.pending && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            saveSidetone(s);
          }
        },
      });
    }
    paintSidetoneScene(sceneKey);
  };

  /* 九个画面动作：在任何状态读取、反馈、音效、timer 之前校验 live scene；
     第一项被接受后同场景三个热点立即 disabled（同拍竞争只记一次），
     逐字反馈写入各场景 aria-live，pending 持久化后自动转场 */
  const runSidetoneAction = (sceneKey, actionId) => {
    const act = SIDETONE_ACTIONS[sceneKey] && SIDETONE_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== SIDETONE_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("sidetone-" + sceneKey)) return;
    const st = getSidetone();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    if (!st.marks.includes(act.mark)) st.marks.push(act.mark);
    st.traversals = Math.min(SIDETONE_NUM_CAP, st.traversals + 1);
    st.pending = { scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    st.entry = sceneKey;
    saveSidetone(st);
    const responseEl = $(SIDETONE_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内同场景全部热点保持 disabled */
    AutoAdvance.schedule("sidetone-" + sceneKey, act.target, {
      delay: sidetoneDelay(),
      before: () => {
        const s = getSidetone();
        if (s.pending && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          saveSidetone(s);
        }
      },
    });
    paintSidetoneScene(sceneKey);
  };

  SIDETONE_SCENES.forEach((sceneKey) => {
    Object.keys(SIDETONE_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(SIDETONE_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runSidetoneAction(sceneKey, actionId));
    });
  });

  /* 交换台三入口：与第四线路 AutoAdvance 共用第一归宿锁——
     在任何副作用前校验 live scene、switchSidetoneArmed 与 AutoAdvance.has("switchboard")；
     第四线路转场已排定时入口零副作用；入口先被接受时先置 switchSidetoneArmed 再
     clear("switchboard")、持久化 v46、反馈并排定支线；不写 goddead_line4，
     不替玩家听回线、不接通第四线路 */
  const SIDETONE_SWITCH_SPOTS = {
    "sidetone-entry-receiver": { entry: "switch-receiver", scene: "booth", target: "unseated-listening-booth", feedback: "听筒离开叉簧，里面没有人声，只有一张空椅子在等你先开口。" },
    "sidetone-entry-plug": { entry: "switch-plug", scene: "jack", target: "unnumbered-jack-field", feedback: "散线插头自己找到一个没有编号的孔。交换台后面多出一整面插孔。" },
    "sidetone-entry-return-lamp": { entry: "switch-return-lamp", scene: "morgue", target: "return-ring-morgue", feedback: "红灯熄灭，别处却亮起一排已经挂断的回铃。" },
  };
  Object.keys(SIDETONE_SWITCH_SPOTS).forEach((id) => {
    const btn = $("#" + id);
    const spot = SIDETONE_SWITCH_SPOTS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (currentScene !== "switchboard") return;
      if (switchSidetoneArmed) return;
      if (AutoAdvance.has("switchboard")) return;
      switchSidetoneArmed = true;
      AutoAdvance.clear("switchboard");
      const st = getSidetone();
      st.entry = spot.entry;
      st.visited[spot.scene] = true;
      st.traversals = Math.min(SIDETONE_NUM_CAP, st.traversals + 1);
      saveSidetone(st);
      syncSidetoneLinks();
      btn.classList.add("touched");
      setTimeout(() => btn.classList.remove("touched"), 1200);
      AudioEngine.knock();
      const responseEl = $("#sidetone-entry-response");
      if (responseEl) responseEl.textContent = spot.feedback;
      AutoAdvance.schedule("switchboard", spot.target, { delay: branchDelay() });
    });
  });

  /* 痕迹页单行：改道次数与已见场景数，保持八张统计卡不变 */
  const paintSidetoneMemory = () => {
    const memory = $("#sidetone-memory");
    if (!memory) return;
    const st = getSidetone();
    const seen = SIDETONE_SCENES.filter((s) => st.visited[s]).length;
    if (seen === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `旁线未静：改道 ${st.traversals} 次；失席 / 无号孔 / 回铃已见 ${seen}/3。`;
    memory.hidden = false;
  };

  /* ============================================================
     v47 退件未止：投递所气送管/格柜/空白回执三入口 + 三个画面热点场景
     状态独立存 goddead_v47_returned_rooms，容错坏 JSON；
     pending 必须是 {scene, action, target, feedback} 完整合法映射；
     不读不写 v28–v46、goddead_deadletter 与主线状态；
     点击即执行，无确认/继续按钮。
     ============================================================ */
  const RETURN_ROOM_KEY = "goddead_v47_returned_rooms";
  const RETURN_ROOM_SCENES = ["intake", "cabinet", "press"];
  const RETURN_ROOM_SCENE_NAMES = ["unclaimed-pneumatic-intake", "returned-address-cabinet", "blank-receipt-press"];
  const RETURN_ROOM_SCENE_NAME = { intake: "unclaimed-pneumatic-intake", cabinet: "returned-address-cabinet", press: "blank-receipt-press" };
  const RETURN_ROOM_NAME_SCENE = { "unclaimed-pneumatic-intake": "intake", "returned-address-cabinet": "cabinet", "blank-receipt-press": "press" };
  const RETURN_ROOM_ENTRIES = ["dead-tubes", "dead-cabinet", "dead-receipt", "intake", "cabinet", "press", "direct"];
  const RETURN_ROOM_MARKS = [
    "openedUnclaimedCarrier", "heardUnsentCallback", "ventedReturnedPressure",
    "unfoldedAddresslessEnvelope", "indexedMissingAddresses", "openedEndlessAddressDrawer",
    "weighedBlankReceipt", "inkedMinuteBeforeReturn", "pressedReceiptBackToIntake",
  ];
  const RETURN_ROOM_NUM_CAP = 9999;

  const RETURN_ROOM_ACTIONS = {
    intake: {
      carrier: { btn: "#return-intake-action-carrier", target: "returned-address-cabinet", feedback: "圆筒里没有信，只有一枚会替收件人旋转的分格轮。", mark: "openedUnclaimedCarrier" },
      horn: { btn: "#return-intake-action-horn", target: "midnight-callback", feedback: "管口没有风，却把午夜回拨台尚未拨出的铃声吹到耳边。", mark: "heardUnsentCallback" },
      cord: { btn: "#return-intake-action-cord", target: "return-ring-morgue", feedback: "红线一拉，压力表归零。楼上的回铃被当作退件送进陈放室。", mark: "ventedReturnedPressure" },
    },
    cabinet: {
      envelope: { btn: "#return-cabinet-action-envelope", target: "blank-receipt-press", feedback: "信封没有地址，也没有封口；展开以后正好是一张回执。", mark: "unfoldedAddresslessEnvelope" },
      wheel: { btn: "#return-cabinet-action-wheel", target: "red-thread-registry", feedback: "分格轮只转半格，所有空地址同时缠上一根红线。", mark: "indexedMissingAddresses" },
      drawer: { btn: "#return-cabinet-action-drawer", target: "retention-vault", feedback: "抽屉没有尽头。最深处那枚地址牌已经被留置多年。", mark: "openedEndlessAddressDrawer" },
    },
    press: {
      sheet: { btn: "#return-press-action-sheet", target: "unclaimed-valuation", feedback: "空白纸被压出重量，没有文字。估值室因此把它列为无人认领。", mark: "weighedBlankReceipt" },
      ink: { btn: "#return-press-action-ink", target: "minute-before-archive", feedback: "墨垫里只剩 03:16 尚未干透；分前档案井认出这枚时间。", mark: "inkedMinuteBeforeReturn" },
      lever: { btn: "#return-press-action-lever", target: "unclaimed-pneumatic-intake", feedback: "压杆落下，回执没有留下印痕，只被卷进无主气送井。", mark: "pressedReceiptBackToIntake" },
    },
  };
  const RETURN_ROOM_RESPONSE_EL = { intake: "#return-intake-response", cabinet: "#return-cabinet-response", press: "#return-press-response" };
  const RETURN_ROOM_LINKS = { intake: "#return-intake-link", cabinet: "#return-cabinet-link", press: "#return-press-link" };

  const getReturnRoom = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(RETURN_ROOM_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    /* visited 只接受 intake / cabinet / press 三个布尔键 */
    const visited = {};
    RETURN_ROOM_SCENES.forEach((s) => {
      visited[s] = Boolean(raw.visited && raw.visited[s] === true);
    });
    const entry = RETURN_ROOM_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    /* pending 必须是 {scene, action, target, feedback} 完整合法映射，
       四字段与动作表逐项完全对应；缺字段、伪造 target/feedback、
       scene/action 错配全部归一为 null。
       pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const acts = RETURN_ROOM_ACTIONS[raw.pending.scene];
      const act = acts && acts[raw.pending.action];
      if (act && raw.pending.target === act.target && raw.pending.feedback === act.feedback) {
        pending = { scene: raw.pending.scene, action: raw.pending.action, target: act.target, feedback: act.feedback };
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配 */
    const lastScene = RETURN_ROOM_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && RETURN_ROOM_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    let reroutes = Number(raw.reroutes);
    if (!Number.isFinite(reroutes) || reroutes < 0) reroutes = 0;
    reroutes = Math.min(RETURN_ROOM_NUM_CAP, Math.floor(reroutes));
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => RETURN_ROOM_MARKS.includes(m)))].slice(0, RETURN_ROOM_MARKS.length)
      : [];
    return { visited, entry, pending, lastScene, lastAction, reroutes, marks };
  };
  const saveReturnRoom = (st) => store.set(RETURN_ROOM_KEY, JSON.stringify(st));

  const syncReturnRoomLinks = () => {
    const st = getReturnRoom();
    RETURN_ROOM_SCENES.forEach((s) => {
      const link = $(RETURN_ROOM_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markReturnRoomVisited = (sceneKey) => {
    const st = getReturnRoom();
    if (!RETURN_ROOM_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    saveReturnRoom(st);
    syncReturnRoomLinks();
  };

  const returnRoomDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintReturnRoomScene = (sceneKey) => {
    const st = getReturnRoom();
    const locked = AutoAdvance.has("return-room-" + sceneKey);
    Object.keys(RETURN_ROOM_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(RETURN_ROOM_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.marks.includes(RETURN_ROOM_ACTIONS[sceneKey][actionId].mark) ? "true" : "false");
    });
  };

  /* 进入退件后室场景：到访标记；若合法 pending 属于本场景（reload/离场后重返），
     重播逐字反馈并恢复转场，timer 真正触发前才清 pending */
  const enterReturnRoom = (sceneKey) => {
    markReturnRoomVisited(sceneKey);
    const st = getReturnRoom();
    const responseEl = $(RETURN_ROOM_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("return-room-" + sceneKey, p.target, {
        delay: returnRoomDelay(),
        before: () => {
          const s = getReturnRoom();
          if (s.pending && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            saveReturnRoom(s);
          }
        },
      });
    }
    paintReturnRoomScene(sceneKey);
  };

  /* 九个画面动作：在任何状态读取、反馈、音效、timer 之前校验 live scene；
     第一项被接受后同场景三个热点立即 disabled（同拍竞争只记一次），
     逐字反馈写入各场景 aria-live，pending 持久化后自动转场 */
  const runReturnRoomAction = (sceneKey, actionId) => {
    const act = RETURN_ROOM_ACTIONS[sceneKey] && RETURN_ROOM_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== RETURN_ROOM_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("return-room-" + sceneKey)) return;
    const st = getReturnRoom();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    if (!st.marks.includes(act.mark)) st.marks.push(act.mark);
    st.reroutes = Math.min(RETURN_ROOM_NUM_CAP, st.reroutes + 1);
    st.pending = { scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    st.entry = sceneKey;
    saveReturnRoom(st);
    const responseEl = $(RETURN_ROOM_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内同场景全部热点保持 disabled */
    AutoAdvance.schedule("return-room-" + sceneKey, act.target, {
      delay: returnRoomDelay(),
      before: () => {
        const s = getReturnRoom();
        if (s.pending && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          saveReturnRoom(s);
        }
      },
    });
    paintReturnRoomScene(sceneKey);
  };

  RETURN_ROOM_SCENES.forEach((sceneKey) => {
    Object.keys(RETURN_ROOM_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(RETURN_ROOM_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runReturnRoomAction(sceneKey, actionId));
    });
  });

  /* 投递所三入口：与空白回执主线 AutoAdvance 共用第一归宿锁——
     在任何副作用前校验 live scene、deadletterReturnRoomArmed 与 AutoAdvance.has("deadletter")；
     主线回执已排定 #cancellation 时入口零副作用；入口先被接受时先置
     deadletterReturnRoomArmed 再 clear("deadletter")、持久化 v47、反馈并排定支线；
     不写 goddead_deadletter，不替玩家归档退件、不替玩家签收空白回执 */
  const RETURN_ROOM_SPOTS = {
    "return-room-entry-tubes": { entry: "dead-tubes", scene: "intake", target: "unclaimed-pneumatic-intake", feedback: "三只气送管同时吸气。最中间那只把你的呼吸盖上了“退回”。" },
    "return-room-entry-cabinet": { entry: "dead-cabinet", scene: "cabinet", target: "returned-address-cabinet", feedback: "格柜里每一封信都写着地址，只有地址本身已不在那里。" },
    "return-room-entry-receipt": { entry: "dead-receipt", scene: "press", target: "blank-receipt-press", feedback: "空白回执离开桌面，纸下露出一台本不该放在楼下的压印机。" },
  };
  Object.keys(RETURN_ROOM_SPOTS).forEach((id) => {
    const btn = $("#" + id);
    const spot = RETURN_ROOM_SPOTS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (currentScene !== "deadletter") return;
      if (deadletterReturnRoomArmed) return;
      if (AutoAdvance.has("deadletter")) return;
      deadletterReturnRoomArmed = true;
      AutoAdvance.clear("deadletter");
      const st = getReturnRoom();
      st.entry = spot.entry;
      st.visited[spot.scene] = true;
      st.reroutes = Math.min(RETURN_ROOM_NUM_CAP, st.reroutes + 1);
      saveReturnRoom(st);
      syncReturnRoomLinks();
      btn.classList.add("touched");
      setTimeout(() => btn.classList.remove("touched"), 1200);
      AudioEngine.knock();
      const responseEl = $("#return-room-entry-response");
      if (responseEl) responseEl.textContent = spot.feedback;
      AutoAdvance.schedule("deadletter", spot.target, { delay: branchDelay() });
    });
  });

  /* 痕迹页单行：改址次数与已见场景数，保持八张统计卡不变 */
  const paintReturnRoomMemory = () => {
    const memory = $("#return-room-memory");
    if (!memory) return;
    const st = getReturnRoom();
    const seen = RETURN_ROOM_SCENES.filter((s) => st.visited[s]).length;
    if (seen === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `退件未止：改址 ${st.reroutes} 次；气送井 / 退址柜 / 压印台已见 ${seen}/3。`;
    memory.hidden = false;
  };

  /* ============================================================
     v48 注销留副：注销科空白屏/确认灯/档案屉三入口 + 三个画面热点场景
     状态独立存 goddead_v48_cancellation_copies，容错坏 JSON；
     pending 必须是 {scene, action, target, feedback} 完整合法映射；
     不读不写 v28–v47、goddead_cancellation 与主线状态；
     点击即执行，无确认/继续按钮。
     ============================================================ */
  const COPY_KEY = "goddead_v48_cancellation_copies";
  const COPY_SCENES = ["screen", "lamp", "carbon"];
  const COPY_SCENE_NAMES = ["blank-screen-underarchive", "false-confirmation-desk", "witness-carbon-archive"];
  const COPY_SCENE_NAME = { screen: "blank-screen-underarchive", lamp: "false-confirmation-desk", carbon: "witness-carbon-archive" };
  const COPY_NAME_SCENE = { "blank-screen-underarchive": "screen", "false-confirmation-desk": "lamp", "witness-carbon-archive": "carbon" };
  const COPY_ENTRIES = ["cancel-screen", "cancel-lamp", "cancel-trays", "screen", "lamp", "carbon", "direct"];
  const COPY_MARKS = [
    "litFalseApprovalPoint", "foldedReturnedAddressCell", "heardScreenStaticBelow",
    "confirmedUnmadeCancellation", "stampedCounterKnockPermit", "droppedApprovalIntoIntake",
    "revealedBlankCarbonCopy", "threadedWitnessCopies", "filedAbsentWitnessCard",
  ];
  const COPY_NUM_CAP = 9999;

  const COPY_ACTIONS = {
    screen: {
      screen: { btn: "#copy-screen-action-screen", target: "false-confirmation-desk", feedback: "空白屏亮得更白，中央浮出一枚不该获准的红点。", mark: "litFalseApprovalPoint" },
      paper: { btn: "#copy-screen-action-paper", target: "returned-address-cabinet", feedback: "纸带没有打印内容，却在卷曲处折出一个已经退回的地址格。", mark: "foldedReturnedAddressCell" },
      aperture: { btn: "#copy-screen-action-aperture", target: "unseated-listening-booth", feedback: "孔后没有眼睛，只有一只没坐人的听筒在记录屏幕的静电。", mark: "heardScreenStaticBelow" },
    },
    lamp: {
      lamp: { btn: "#copy-lamp-action-lamp", target: "witness-carbon-archive", feedback: "红灯确认了一次从未发生的注销；复写库立刻多出一张见证副本。", mark: "confirmedUnmadeCancellation" },
      seal: { btn: "#copy-lamp-action-seal", target: "counter-knock-gallery", feedback: "注销印压下去，桌面从下方回敲了一次。回敲廊把它收作入场凭据。", mark: "stampedCounterKnockPermit" },
      chute: { btn: "#copy-lamp-action-chute", target: "unclaimed-pneumatic-intake", feedback: "退纸槽没有底。落下的空白批件被气流托进无主气送井。", mark: "droppedApprovalIntoIntake" },
    },
    carbon: {
      sheet: { btn: "#copy-carbon-action-sheet", target: "blank-screen-underarchive", feedback: "复写纸揭开时仍是一片空白；屏底库却替它亮起。", mark: "revealedBlankCarbonCopy" },
      drawer: { btn: "#copy-carbon-action-drawer", target: "red-thread-registry", feedback: "抽屉只拉出半寸，所有副本的孔眼已经被同一根红线穿过。", mark: "threadedWitnessCopies" },
      card: { btn: "#copy-carbon-action-card", target: "absent-relief-locker", feedback: "见证卡上没有姓名，只有一格未到班的空位。缺班柜替它留门。", mark: "filedAbsentWitnessCard" },
    },
  };
  const COPY_RESPONSE_EL = { screen: "#copy-screen-response", lamp: "#copy-lamp-response", carbon: "#copy-carbon-response" };
  const COPY_LINKS = { screen: "#copy-screen-link", lamp: "#copy-lamp-link", carbon: "#copy-carbon-link" };

  const getCopy = () => {
    let raw = {};
    try {
      raw = JSON.parse(store.get(COPY_KEY, "{}")) || {};
    } catch { raw = {}; }
    if (typeof raw !== "object" || Array.isArray(raw)) raw = {};
    /* visited 只接受 screen / lamp / carbon 三个布尔键 */
    const visited = {};
    COPY_SCENES.forEach((s) => {
      visited[s] = Boolean(raw.visited && raw.visited[s] === true);
    });
    const entry = COPY_ENTRIES.includes(raw.entry) ? raw.entry : "direct";
    /* pending 必须是 {scene, action, target, feedback} 完整合法映射，
       四字段与动作表逐项完全对应；缺字段、伪造 target/feedback、
       scene/action 错配全部归一为 null。
       pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据 */
    let pending = null;
    if (raw.pending && typeof raw.pending === "object" && !Array.isArray(raw.pending)) {
      const acts = COPY_ACTIONS[raw.pending.scene];
      const act = acts && acts[raw.pending.action];
      if (act && raw.pending.target === act.target && raw.pending.feedback === act.feedback) {
        pending = { scene: raw.pending.scene, action: raw.pending.action, target: act.target, feedback: act.feedback };
      }
    }
    /* lastScene / lastAction 只接受白名单且必须互相匹配 */
    const lastScene = COPY_SCENES.includes(raw.lastScene) ? raw.lastScene : "";
    const lastAction = lastScene && COPY_ACTIONS[lastScene][raw.lastAction] ? raw.lastAction : "";
    let copies = Number(raw.copies);
    if (!Number.isFinite(copies) || copies < 0) copies = 0;
    copies = Math.min(COPY_NUM_CAP, Math.floor(copies));
    const marks = Array.isArray(raw.marks)
      ? [...new Set(raw.marks.filter((m) => COPY_MARKS.includes(m)))].slice(0, COPY_MARKS.length)
      : [];
    return { visited, entry, pending, lastScene, lastAction, copies, marks };
  };
  const saveCopy = (st) => store.set(COPY_KEY, JSON.stringify(st));

  const syncCopyLinks = () => {
    const st = getCopy();
    COPY_SCENES.forEach((s) => {
      const link = $(COPY_LINKS[s]);
      if (!link) return;
      if (st.visited[s]) link.removeAttribute("hidden");
      else link.setAttribute("hidden", "");
    });
  };

  /* 到访标记在点击/进入时立即持久化：即便转场被回退取消，目录入口也已出现 */
  const markCopyVisited = (sceneKey) => {
    const st = getCopy();
    if (!COPY_SCENES.includes(sceneKey) || st.visited[sceneKey]) return;
    st.visited[sceneKey] = true;
    saveCopy(st);
    syncCopyLinks();
  };

  const copyDelay = () => reduced ? 300 : 900 + Math.floor(Math.random() * 300);

  const paintCopyScene = (sceneKey) => {
    const st = getCopy();
    const locked = AutoAdvance.has("copy-" + sceneKey);
    Object.keys(COPY_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(COPY_ACTIONS[sceneKey][actionId].btn);
      if (!btn) return;
      btn.disabled = locked;
      btn.setAttribute("aria-pressed", st.marks.includes(COPY_ACTIONS[sceneKey][actionId].mark) ? "true" : "false");
    });
  };

  /* 进入留副场景：到访标记；若合法 pending 属于本场景（reload/离场后重返），
     重播逐字反馈并恢复转场，timer 真正触发前才清 pending */
  const enterCopy = (sceneKey) => {
    markCopyVisited(sceneKey);
    const st = getCopy();
    const responseEl = $(COPY_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = "";
    if (st.pending && st.pending.scene === sceneKey) {
      const p = st.pending;
      if (responseEl) responseEl.textContent = p.feedback;
      AutoAdvance.schedule("copy-" + sceneKey, p.target, {
        delay: copyDelay(),
        before: () => {
          const s = getCopy();
          if (s.pending && s.pending.scene === sceneKey && s.pending.action === p.action) {
            s.pending = null;
            saveCopy(s);
          }
        },
      });
    }
    paintCopyScene(sceneKey);
  };

  /* 九个画面动作：在任何状态读取、反馈、音效、timer 之前校验 live scene；
     第一项被接受后同场景三个热点立即 disabled（同拍竞争只记一次），
     逐字反馈写入各场景 aria-live，pending 持久化后自动转场 */
  const runCopyAction = (sceneKey, actionId) => {
    const act = COPY_ACTIONS[sceneKey] && COPY_ACTIONS[sceneKey][actionId];
    if (!act) return;
    if (currentScene !== COPY_SCENE_NAME[sceneKey]) return;
    if (AutoAdvance.has("copy-" + sceneKey)) return;
    const st = getCopy();
    st.lastScene = sceneKey;
    st.lastAction = actionId;
    if (!st.marks.includes(act.mark)) st.marks.push(act.mark);
    st.copies = Math.min(COPY_NUM_CAP, st.copies + 1);
    st.pending = { scene: sceneKey, action: actionId, target: act.target, feedback: act.feedback };
    st.entry = sceneKey;
    saveCopy(st);
    const responseEl = $(COPY_RESPONSE_EL[sceneKey]);
    if (responseEl) responseEl.textContent = act.feedback;
    AudioEngine.knock(0.16);
    /* 先排定再重绘：节拍内同场景全部热点保持 disabled */
    AutoAdvance.schedule("copy-" + sceneKey, act.target, {
      delay: copyDelay(),
      before: () => {
        const s = getCopy();
        if (s.pending && s.pending.scene === sceneKey && s.pending.action === actionId) {
          s.pending = null;
          saveCopy(s);
        }
      },
    });
    paintCopyScene(sceneKey);
  };

  COPY_SCENES.forEach((sceneKey) => {
    Object.keys(COPY_ACTIONS[sceneKey]).forEach((actionId) => {
      const btn = $(COPY_ACTIONS[sceneKey][actionId].btn);
      if (btn) btn.addEventListener("click", () => runCopyAction(sceneKey, actionId));
    });
  });

  /* 注销科三入口：与拒绝注销主线 AutoAdvance 共用第一归宿锁——
     在任何副作用前校验 live scene、cancellationCopyArmed 与 AutoAdvance.has("cancellation")；
     拒绝已排定 #acting 时入口零副作用；入口先被接受时先置 cancellationCopyArmed
     再 clear("cancellation") 与 clearCnTimers()、持久化 v48、反馈并排定支线；
     不写 goddead_cancellation，不替玩家检索、不替玩家拒绝注销 */
  const COPY_SPOTS = {
    "cancellation-copy-entry-screen": { entry: "cancel-screen", scene: "screen", target: "blank-screen-underarchive", feedback: "空白屏没有显示查询结果。玻璃背面却有一整间档案室亮了起来。" },
    "cancellation-copy-entry-lamp": { entry: "cancel-lamp", scene: "lamp", target: "false-confirmation-desk", feedback: "红灯没有熄灭。它把“未注销”误当成了新的批准。" },
    "cancellation-copy-entry-trays": { entry: "cancel-trays", scene: "carbon", target: "witness-carbon-archive", feedback: "侧屉里没有原件，只有每位见证者拒绝以后留下的复写副本。" },
  };
  Object.keys(COPY_SPOTS).forEach((id) => {
    const btn = $("#" + id);
    const spot = COPY_SPOTS[id];
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (currentScene !== "cancellation") return;
      if (cancellationCopyArmed) return;
      if (AutoAdvance.has("cancellation")) return;
      cancellationCopyArmed = true;
      AutoAdvance.clear("cancellation");
      clearCnTimers();
      const st = getCopy();
      st.entry = spot.entry;
      st.visited[spot.scene] = true;
      st.copies = Math.min(COPY_NUM_CAP, st.copies + 1);
      saveCopy(st);
      syncCopyLinks();
      btn.classList.add("touched");
      setTimeout(() => btn.classList.remove("touched"), 1200);
      AudioEngine.knock();
      const responseEl = $("#cancellation-copy-entry-response");
      if (responseEl) responseEl.textContent = spot.feedback;
      AutoAdvance.schedule("cancellation", spot.target, { delay: branchDelay() });
    });
  });

  /* 痕迹页单行：复写次数与已见场景数，保持八张统计卡不变 */
  const paintCopyMemory = () => {
    const memory = $("#cancellation-copy-memory");
    if (!memory) return;
    const st = getCopy();
    const seen = COPY_SCENES.filter((s) => st.visited[s]).length;
    if (seen === 0) {
      memory.hidden = true;
      return;
    }
    memory.textContent = `注销留副：复写 ${st.copies} 次；屏底库 / 误准灯 / 复写库已见 ${seen}/3。`;
    memory.hidden = false;
  };

  /* ============================================================
     走廊：残页 + 封印的门
     ============================================================ */
  const fragResponses = [
    "这页纸记住了你的指纹。",
    "读过的字，会跟着你。",
    "你捡起来得太快了。它喜欢这样。",
    "走廊安静了一拍。",
    "这一页原本是钉在墙上的。钉子还在。",
    "别念出声。",
  ];

  const tryScheduleCorridor = () => {
    if (corridorConsumed || fragments < 3) return;
    AutoAdvance.schedule("corridor", "watch", {
      before: () => { corridorConsumed = true; },
      onSchedule: () => toast("走廊尽头出现了一扇窄门。"),
    });
  };

  /* f2「回声」/ f3「血管」/ f4「忏悔」第一次主动点击时优先走支线 */
  const FRAG_BRANCH = { f2: "echo", f3: "vein", f4: "confession" };

  /* v44 页后空层：f1（影子晚一拍）/ f5（灰摆成门形）/ f8（被留下）第一次主动阅读时进入页后空层。
     与 v29 相同的 corridor scope；恰好第三页时支线优先，绝不同时进 #watch */
  const PAPERBACK_FRAG = {
    f1: { entry: "fragment-f1", scene: "shadow", target: "lagging-shadow-cloister", intro: "影子没有跟上你。它先一步走进了回廊深处。" },
    f5: { entry: "fragment-f5", scene: "foundry", target: "ash-door-foundry", intro: "灰自己排成了门。铸室在纸背后等你。" },
    f8: { entry: "fragment-f8", scene: "retention", target: "retention-vault", intro: "「被留下」需要一间库房。空展台已经亮起。" },
  };

  $$(".frag").forEach((frag) => {
    frag.addEventListener("click", () => {
      /* v44 支线首选锁：任一残页支线（v29/v44）被接受后，本拍其余残页输入全部忽略——
         一次计数、一次调度，第一条已接受的 corridor 转场锁定归宿；
         回场景时由 sceneInit 复位，主线计数与值夜室排程不受影响 */
      if (corridorDetourArmed) return;
      const alreadyRead = frag.classList.contains("read");
      if (!alreadyRead) {
        frag.classList.add("read");
        fragments++;
        store.set("goddead_fragment_count", String(fragments));
        saveState();
        syncWatchDoor();
        if (statsCounted) paintStats();
        AudioEngine.knock(0.16);
        toast(fragments === 8
          ? "八页都读过了。走廊现在认得你了。"
          : fragResponses[Math.floor(Math.random() * fragResponses.length)]);
      } else {
        toast("读过的字，会跟着你。");
      }
      const branch = FRAG_BRANCH[Object.keys(FRAG_BRANCH).find((k) => frag.classList.contains(k))];
      if (branch && !alreadyRead) {
        /* 分支路由优先：取消 corridor 的主线 AutoAdvance，短反馈后进入支线。
           visited 在点击时立即持久化：即便转场被回退取消，
           走廊入口也已出现，支线永远不会永久丢失 */
        corridorDetourArmed = true;
        AutoAdvance.clear("corridor");
        const st = getBranches();
        st.visited[branch] = true;
        saveBranches(st);
        syncBranchEntries();
        AutoAdvance.schedule("corridor", branch, {
          delay: branchDelay(),
          onSchedule: () => toast(BRANCH_META[branch].intro),
        });
        return;
      }
      const pb = PAPERBACK_FRAG[Object.keys(PAPERBACK_FRAG).find((k) => frag.classList.contains(k))];
      if (pb && !alreadyRead) {
        /* v44 页后空层入口：先完成原残页计数（上面已执行），再取消主线排程、
           持久化 v44 到访并进入对应页后场景；恰好第三页时本分支优先 */
        corridorDetourArmed = true;
        AutoAdvance.clear("corridor");
        const st = getPaperback();
        st.entry = pb.entry;
        st.visited[pb.scene] = true;
        st.traversals = Math.min(PAPERBACK_NUM_CAP, st.traversals + 1);
        savePaperback(st);
        syncPaperbackLinks();
        AutoAdvance.schedule("corridor", pb.target, {
          delay: branchDelay(),
          onSchedule: () => toast(pb.intro),
        });
        return;
      }
      tryScheduleCorridor();
    });
  });

  /* 彩蛋：敲封印的门，里面有东西应一声 */
  gateReliquary.addEventListener("click", (e) => {
    if (reliquaryUnlocked()) return;
    e.preventDefault();
    AudioEngine.knock();
    toast("里面有东西应了一声。仅此一声。");
  });

  /* ============================================================
     第三值夜室：仍在运转的制度，已经没有人
     ============================================================ */
  const narrowDoor = $("#narrow-door");
  const doorTrace = $("#door-trace");
  const watchLink = $("#watch-link");
  const clockSecond = $("#clock-second");
  const chairShadow = $("#chair-shadow");
  const signoutBtn = $("#signout-btn");
  const signoutResponse = $("#signout-response");
  const watchMemory = $("#watch-memory");

  const getWatch = () => {
    try { return JSON.parse(store.get("goddead_watch", "{}")) || {}; } catch { return {}; }
  };
  const saveWatch = (w) => store.set("goddead_watch", JSON.stringify(w));

  /* ---------- 第四线路：状态统一存 goddead_line4，容错旧/坏 JSON ---------- */
  const L4_KEY = "goddead_line4";
  const L4_EMPTY = () => ({ unlocked: false, phoneCovered: false, heard: [false, false, false], connected: false, connectedAt: 0 });
  const getLine4 = () => {
    try {
      const raw = JSON.parse(store.get(L4_KEY, "{}"));
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return L4_EMPTY();
      const base = L4_EMPTY();
      return {
        unlocked: raw.unlocked === true,
        phoneCovered: raw.phoneCovered === true,
        heard: base.heard.map((_, i) => Array.isArray(raw.heard) && raw.heard[i] === true),
        connected: raw.connected === true,
        connectedAt: Number(raw.connectedAt) || 0,
      };
    } catch { return L4_EMPTY(); }
  };
  const saveLine4 = (st) => store.set(L4_KEY, JSON.stringify(st));
  const line4Unlocked = () => getLine4().unlocked;

  const answerBox = $("#answer-box");
  const answerNote = $("#answer-note");
  const switchLink = $("#switch-link");

  /* 解锁后：接听按钮与目录入口原子恢复（hidden 同步移除）。
     与路由同一组依赖：值夜室（三张残页）是第四线路的前置，
     陈旧 line4=true 但残页不足时入口同样不得出现。 */
  const syncLine4 = () => {
    if (watchUnlocked() && line4Unlocked()) {
      answerBox.removeAttribute("hidden");
      switchLink.removeAttribute("hidden");
      if (!answerNote.textContent) {
        answerNote.textContent = "桌下那部不存在的电话，开始第二次响。";
      }
    } else {
      answerBox.setAttribute("hidden", "");
      switchLink.setAttribute("hidden", "");
    }
  };

  /* 解锁条件：覆盖 05:02 记录（值-叁-0469） + 至少尝试签退一次，顺序任意，立即生效 */
  const maybeUnlockLine4 = () => {
    const st = getLine4();
    if (st.unlocked) return;
    const attempts = Number(getWatch().attempts) || 0;
    if (!st.phoneCovered || attempts < 1) return;
    st.unlocked = true;
    saveLine4(st);
    syncLine4();
    AudioEngine.phoneRing(0.8);
  };

  const tryScheduleWatch = () => {
    if (watchConsumed || watchReliefArmed || !watchUnlocked() || !line4Unlocked()) return;
    const st = getLine4();
    const attempts = Number(getWatch().attempts) || 0;
    if (!st.phoneCovered || attempts < 1) return;
    AutoAdvance.schedule("watch", "switchboard", {
      before: () => { watchConsumed = true; },
      onSchedule: () => toast("桌下那部不存在的电话，开始第二次响。"),
    });
  };

  /* 窄门：捡够三张残页之后，它才"一直在那里"。
     未解锁时保持 hidden——不进键盘焦点、不进入无障碍树、不可导航。 */
  const watchUnlocked = () => fragments >= 3;

  const syncWatchDoor = () => {
    if (watchUnlocked()) {
      if (narrowDoor.hasAttribute("hidden")) {
        narrowDoor.removeAttribute("hidden");
        doorTrace.classList.remove("trace-on");
        requestAnimationFrame(() => narrowDoor.classList.add("appeared"));
      }
      watchLink.removeAttribute("hidden");
    } else {
      narrowDoor.setAttribute("hidden", "");
      narrowDoor.classList.remove("appeared");
      watchLink.setAttribute("hidden", "");
    }
  };

  /* 不满足条件时，墙上偶尔只有门框的痕迹，不做任何提示 */
  let traceTimer = null;
  const startTrace = () => {
    stopTrace();
    if (fragments >= 3 || reduced) return;
    const tick = () => {
      traceTimer = setTimeout(() => {
        if (currentScene !== "corridor") return;
        doorTrace.classList.add("trace-on");
        setTimeout(() => doorTrace.classList.remove("trace-on"), 2600 + Math.random() * 2200);
        tick();
      }, 6000 + Math.random() * 9000);
    };
    tick();
  };
  const stopTrace = () => {
    clearTimeout(traceTimer);
    traceTimer = null;
    if (doorTrace) doorTrace.classList.remove("trace-on");
  };

  /* 钟：永远 03:17，秒针偶尔倒退 */
  let clockTimer = null;
  let reverseTimer = null;
  let secondAngle = 0;
  let reversing = 0;

  const startClock = () => {
    stopClock();
    if (reduced) return;
    clockTimer = setInterval(() => {
      if (reversing > 0) {
        secondAngle -= 6;
        reversing--;
        AudioEngine.tick();
      } else {
        secondAngle += 6;
      }
      clockSecond.style.transform = `rotate(${secondAngle}deg)`;
    }, 1000);
    const scheduleReverse = () => {
      reverseTimer = setTimeout(() => {
        if (currentScene !== "watch") return;
        reversing = 2 + Math.floor(Math.random() * 4);
        scheduleReverse();
      }, 13000 + Math.random() * 14000);
    };
    scheduleReverse();
  };
  const stopClock = () => {
    clearInterval(clockTimer);
    clearTimeout(reverseTimer);
    clockTimer = null;
    reversing = 0;
  };

  /* 椅子的影子，慢慢朝你转。不跳脸。 */
  let shadowTimer = null;
  let shadowAngle = -16;
  const startShadowCreep = () => {
    stopShadowCreep();
    if (reduced) return;
    shadowAngle = -16;
    chairShadow.style.transform = `rotate(${shadowAngle}deg)`;
    const creep = () => {
      shadowTimer = setTimeout(() => {
        if (currentScene !== "watch") return;
        shadowAngle = Math.min(14, shadowAngle + 3 + Math.random() * 2);
        chairShadow.style.transform = `rotate(${shadowAngle}deg)`;
        creep();
      }, 9000 + Math.random() * 5000);
    };
    creep();
  };
  const stopShadowCreep = () => {
    clearTimeout(shadowTimer);
    shadowTimer = null;
  };

  /* 极远处的电话铃：每次进房间只安排一次 */
  let ringTimer = null;
  const schedulePhoneRing = () => {
    clearTimeout(ringTimer);
    ringTimer = setTimeout(() => {
      if (currentScene === "watch") AudioEngine.phoneRing();
    }, 22000 + Math.random() * 16000);
  };

  const enterWatch = () => {
    AudioEngine.ensure();
    AudioEngine.hum(true);
    startClock();
    startShadowCreep();
    schedulePhoneRing();
  };

  const leaveWatch = () => {
    AudioEngine.hum(false);
    stopClock();
    stopShadowCreep();
    clearTimeout(ringTimer);
  };

  /* 交班簿：pointerenter 只做被动揭字（不进状态、不 schedule）；
     click / Enter / Space 才是主动激活，05:02 被主动激活时才写状态并调度。 */
  const dynamicAlt = () => {
    const arrivalPart = arrivals > 0 ? `第 ${arrivals} 次抵达` : "抵达记录：未登记";
    return `06:00 交班。本班新增访客：你。${arrivalPart} · 带走残页 ${fragments} 张。已按新访客登记在值-叁。`;
  };

  const coverLogVisual = (entry, btn, orig, alt) => {
    if (entry.classList.contains("covered")) return;
    const text = entry.id === "log-dynamic" ? dynamicAlt() : entry.dataset.alt;
    alt.textContent = text;
    alt.removeAttribute("hidden");
    orig.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", `${entry.querySelector(".log-no").textContent}。${text}`);
    entry.classList.add("covered");
    AudioEngine.tick();
  };

  const coverLogActive = (entry, btn, orig, alt) => {
    const wasCovered = entry.classList.contains("covered");
    coverLogVisual(entry, btn, orig, alt);
    if (entry.id === "log-phone") {
      const st = getLine4();
      if (!st.phoneCovered) { st.phoneCovered = true; saveLine4(st); }
      maybeUnlockLine4();
    }
    if (entry.id === "log-phone") tryScheduleWatch();
  };

  $$(".log-entry").forEach((entry) => {
    const btn = entry.querySelector(".log-cover");
    const orig = entry.querySelector(".orig");
    const alt = entry.querySelector(".alt");
    if (finePointer) entry.addEventListener("pointerenter", () => coverLogVisual(entry, btn, orig, alt));
    btn.addEventListener("click", () => coverLogActive(entry, btn, orig, alt));
  });

  /* 签退：不会成功 */
  const setStatNum = (el, value, isText = false) => {
    el.textContent = value;
    el.classList.toggle("is-text", isText);
  };

  const paintWatch = () => {
    const attempts = Number(getWatch().attempts) || 0;
    setStatNum(numEls.watch, attempts > 0 ? `未签退 · ${attempts}` : "—", attempts > 0);
    watchMemory.textContent = attempts > 0
      ? `你试图从第三值夜室签退。记录在案：未批准。`
      : "";
  };

  const applyWatchState = () => {
    if (Number(getWatch().attempts) > 0) {
      signoutBtn.classList.add("refused");
      signoutBtn.disabled = true;
      signoutResponse.textContent = "你没有签到，无法签退。";
      signoutResponse.classList.add("visible");
    }
  };

  signoutBtn.addEventListener("click", () => {
    const w = getWatch();
    w.attempts = 1;
    w.lastRefusal = Date.now();
    saveWatch(w);
    applyWatchState();
    paintWatch();
    maybeUnlockLine4();
    tryScheduleWatch();
    if (statsCounted) paintStats();
    AudioEngine.bell(52);
  });

  /* ============================================================
     余响交换台：决定声音被送往哪里
     ============================================================ */
  const patch4Btn = $("#patch-4-btn");
  const patch4Orig = $("#patch-4-orig");
  const patch4Reason = $("#patch-4-reason");
  const line4Record = $("#line4-record");
  const l4Lines = $$("#line4-record .l4-line");
  const lineMemory = $("#line-memory");

  /* 三条回线的应答：前两条固定基调，后两条按玩家状态动态写成 */
  const patchTexts = {
    1: () => awake
      ? "门外响过三次。第四次不是从门外来的——它来自听筒里面。你明明已经进来了。"
      : "门外响过三次。第四次不是从门外来的——它来自听筒里面。你还没进去，它已经替你答应了。",
    2: () => gstate.prayersOffered > 0
      ? `线路里有 ${gstate.prayersOffered} 份灰。没有一份属于火。`
      : "线路是空的。但它记得一句你还没说出口的句子，并一直为它留着位置。",
    3: () => {
      const attempts = Number(getWatch().attempts) || 0;
      return `本班签到人数：零。残页离架 ${fragments} 张，抵达登记 ${arrivals} 次。签退申请${attempts > 0 ? `已收到 ${attempts} 次，全部驳回` : "尚未收到。它会收到的"}。`;
    },
  };

  /* 前三条都听过：第四条原子启用，并获得名字 */
  const syncPatch4 = () => {
    if (!patch4Btn.disabled) return;
    if (!getLine4().heard.every(Boolean)) return;
    patch4Btn.disabled = false;
    patch4Orig.textContent = "肆 · 第四线路";
    patch4Btn.setAttribute("aria-label", "肆 · 第四线路。接通它。");
    patch4Btn.removeAttribute("aria-describedby");
    patch4Reason.setAttribute("hidden", "");
  };

  const coverPatch = (n, silent = false) => {
    /* v46：旁线入口已武装的反馈拍内，四条 patch 按钮不得再写旧状态 */
    if (switchSidetoneArmed) return;
    const entry = $(`#patch-${n}`);
    const btn = entry.querySelector(".patch-btn");
    const orig = entry.querySelector(".orig");
    const alt = entry.querySelector(".alt");
    const text = patchTexts[n]();
    alt.textContent = text;
    alt.removeAttribute("hidden");
    orig.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", `${entry.querySelector(".log-no").textContent}。${text}`);
    entry.classList.add("covered");
    if (!silent) AudioEngine.plug();
    const st = getLine4();
    if (!st.heard[n - 1]) {
      st.heard[n - 1] = true;
      saveLine4(st);
    }
    syncPatch4();
  };

  [1, 2, 3].forEach((n) => {
    $(`#patch-${n} .patch-btn`).addEventListener("click", () => coverPatch(n));
  });

  /* 第四线路接通记录：普通模式逐行显现，reduced-motion 立即完整 */
  let l4Timers = [];
  const clearL4Timers = () => {
    l4Timers.forEach(clearTimeout);
    l4Timers = [];
  };
  const revealL4 = () => {
    clearL4Timers();
    l4Lines.forEach((l) => {
      l.setAttribute("hidden", "");
      l.classList.remove("on");
    });
    if (reduced) {
      l4Lines.forEach((l) => {
        l.removeAttribute("hidden");
        l.classList.add("on");
      });
      return;
    }
    l4Lines.forEach((l, i) => {
      l4Timers.push(setTimeout(() => {
        l.removeAttribute("hidden");
        requestAnimationFrame(() => l.classList.add("on"));
        AudioEngine.tick();
      }, 150 + i * 120));
    });
  };

  patch4Btn.addEventListener("click", () => {
    if (patch4Btn.disabled) return;
    /* v46：旁线入口已武装时，第四线路不得迟到改写目的地 */
    if (switchSidetoneArmed) return;
    AudioEngine.plug();
    const st = getLine4();
    if (!st.connected) {
      st.connected = true;
      st.connectedAt = Date.now();
      saveLine4(st);
    }
    patch4Btn.setAttribute("aria-pressed", "true");
    line4Record.setAttribute("aria-live", "polite");
    revealL4();
    paintLine4();
    syncDeadletter();
    AutoAdvance.schedule("switchboard", "deadletter", {
      onSchedule: () => toast("第四线路接通。退回的东西，有了去处。"),
    });
  });

  /* 重载恢复：已听回线保持覆盖态，第四线接通终态完整重现（不重复播报、不累加） */
  const syncPatchLog = () => {
    const st = getLine4();
    st.heard.forEach((h, i) => {
      if (h) coverPatch(i + 1, true);
    });
    syncPatch4();
    if (st.connected) {
      patch4Btn.setAttribute("aria-pressed", "true");
      l4Lines.forEach((l) => {
        l.removeAttribute("hidden");
        l.classList.add("on");
      });
    }
  };

  /* 痕迹：线路状态与记忆 */
  const paintLine4 = () => {
    const st = getLine4();
    setStatNum(numEls.line, st.connected ? "04" : "—");
    lineMemory.textContent = st.connected
      ? "你接通了没有端点的第四线路。后来每一次铃响，都算作你在值班。"
      : "";
  };

  /* 交换台氛围：线路底噪常开，远处断续铃声；离开即停，不泄漏 */
  let switchRingTimer = null;
  const enterSwitch = () => {
    /* v46：回交换台复位旁线第一归宿锁旗标，并清掉上一拍的入口反馈 */
    switchSidetoneArmed = false;
    const sidetoneEntryResponse = $("#sidetone-entry-response");
    if (sidetoneEntryResponse) sidetoneEntryResponse.textContent = "";
    AudioEngine.ensure();
    AudioEngine.lineNoise(true);
    const ring = () => {
      switchRingTimer = setTimeout(() => {
        if (currentScene !== "switchboard") return;
        AudioEngine.phoneRing(0.45);
        ring();
      }, 20000 + Math.random() * 14000);
    };
    ring();
  };
  const leaveSwitch = () => {
    AudioEngine.lineNoise(false);
    clearTimeout(switchRingTimer);
    switchRingTimer = null;
    clearL4Timers();
  };

  /* ============================================================
     无主投递所：第四线路不是电话，它是退回地址
     ============================================================ */
  /* ---------- 状态统一存 goddead_deadletter，容错旧/坏 JSON ---------- */
  const DL_KEY = "goddead_deadletter";
  const DL_EMPTY = () => ({ returned: [false, false, false], accepted: false, acceptedAt: 0 });
  const getDL = () => {
    try {
      const raw = JSON.parse(store.get(DL_KEY, "{}"));
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return DL_EMPTY();
      const base = DL_EMPTY();
      return {
        returned: base.returned.map((_, i) => Array.isArray(raw.returned) && raw.returned[i] === true),
        accepted: raw.accepted === true,
        acceptedAt: Number(raw.acceptedAt) || 0,
      };
    } catch { return DL_EMPTY(); }
  };
  const saveDL = (st) => store.set(DL_KEY, JSON.stringify(st));

  const deliverBox = $("#deliver-box");
  const deliverNote = $("#deliver-note");
  const deadletterLink = $("#deadletter-link");
  const receiptBtn = $("#receipt-btn");
  const receiptOrig = $("#receipt-orig");
  const receiptReason = $("#receipt-reason");
  const dlRecord = $("#dl-record");
  const dlLines = $$("#dl-record .dl-line");
  const deliverMemory = $("#deliver-memory");

  const syncDeadletter = () => {
    if (watchUnlocked() && line4Unlocked() && getLine4().connected) {
      deliverBox.removeAttribute("hidden");
      deadletterLink.removeAttribute("hidden");
      if (!deliverNote.textContent) {
        deliverNote.textContent = "退回的东西，有了去处。";
      }
    } else {
      deliverBox.setAttribute("hidden", "");
      deadletterLink.setAttribute("hidden", "");
    }
  };

  /* 三封退件的归档记录：退回原因按玩家状态动态写成 */
  const returnTexts = {
    1: () => "第四次敲击来自门内。退回原因：收件地址不存在。",
    2: () => (gstate.prayersOffered > 0
      ? `灰烬不是邮资。共 ${gstate.prayersOffered} 份，全部留在原地。`
      : "尚未投递。系统已提前分配封套。"),
    3: () => {
      const attempts = Number(getWatch().attempts) || 0;
      return `残页 ${fragments} 张，转作附件。抵达登记 ${arrivals} 次。签退申请${attempts > 0 ? ` ${attempts} 次，全部视为续班` : "零次，已预登记为续班"}。`;
    },
  };

  /* 三封都退回：空白回执原子启用，并获得名字 */
  const syncReceipt = () => {
    if (!receiptBtn.disabled) return;
    const done = getDL().returned.filter(Boolean).length;
    if (done < 3) {
      receiptReason.textContent = `还有 ${3 - done} 封退件未归档。`;
      return;
    }
    receiptBtn.disabled = false;
    receiptOrig.textContent = "签收空白件";
    receiptBtn.setAttribute("aria-label", "签收空白件。收件人那一栏是空的。");
    receiptBtn.removeAttribute("aria-describedby");
    receiptReason.setAttribute("hidden", "");
  };

  const coverReturn = (n, silent = false) => {
    /* v47：退件后室入口已武装的反馈拍内，三退件按钮不得再写旧状态 */
    if (deadletterReturnRoomArmed) return;
    const entry = $(`#return-${n}`);
    const btn = entry.querySelector(".return-btn");
    const orig = entry.querySelector(".orig");
    const alt = entry.querySelector(".alt");
    const text = returnTexts[n]();
    alt.textContent = text;
    alt.removeAttribute("hidden");
    orig.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", `${entry.querySelector(".log-no").textContent}。${text}`);
    entry.classList.add("covered");
    if (!silent) AudioEngine.tube();
    const st = getDL();
    if (!st.returned[n - 1]) {
      st.returned[n - 1] = true;
      saveDL(st);
    }
    syncReceipt();
  };

  [1, 2, 3].forEach((n) => {
    $(`#return-${n} .return-btn`).addEventListener("click", () => coverReturn(n));
  });

  /* 签收终局记录：普通模式逐行显现，reduced-motion 立即完整 */
  let dlTimers = [];
  const clearDlTimers = () => {
    dlTimers.forEach(clearTimeout);
    dlTimers = [];
  };
  const revealDL = () => {
    clearDlTimers();
    dlLines.forEach((l) => {
      l.setAttribute("hidden", "");
      l.classList.remove("on");
    });
    if (reduced) {
      dlLines.forEach((l) => {
        l.removeAttribute("hidden");
        l.classList.add("on");
      });
      return;
    }
    dlLines.forEach((l, i) => {
      dlTimers.push(setTimeout(() => {
        l.removeAttribute("hidden");
        requestAnimationFrame(() => l.classList.add("on"));
        AudioEngine.tick();
      }, 150 + i * 120));
    });
  };

  receiptBtn.addEventListener("click", () => {
    if (receiptBtn.disabled) return;
    /* v47：退件后室入口已武装时，空白回执不得迟到签收或改写目的地 */
    if (deadletterReturnRoomArmed) return;
    AudioEngine.stamp();
    const st = getDL();
    if (!st.accepted) {
      st.accepted = true;
      st.acceptedAt = Date.now();
      saveDL(st);
    }
    receiptBtn.setAttribute("aria-pressed", "true");
    dlRecord.setAttribute("aria-live", "polite");
    revealDL();
    paintDeliver();
    syncCancel();
    AutoAdvance.schedule("deadletter", "cancellation", {
      onSchedule: () => toast("空白回执生成了一个不该存在的案号。"),
    });
  });

  /* 重载恢复：已退件保持归档态，签收终态完整重现（不重复播报、不累加） */
  const syncReturnLog = () => {
    const st = getDL();
    st.returned.forEach((r, i) => {
      if (r) coverReturn(i + 1, true);
    });
    syncReceipt();
    if (st.accepted) {
      receiptBtn.setAttribute("aria-pressed", "true");
      dlLines.forEach((l) => {
        l.removeAttribute("hidden");
        l.classList.add("on");
      });
    }
  };

  /* 痕迹：投递状态与记忆（未签收时不剧透） */
  const paintDeliver = () => {
    const st = getDL();
    setStatNum(numEls.deliver, st.accepted ? "03" : "—");
    deliverMemory.textContent = st.accepted
      ? "你替一间没有收件人的邮局签收了自己。"
      : "";
  };

  /* 投递所氛围：气送管偶尔在墙里走一趟；离开即停，不泄漏 */
  let dlTubeTimer = null;
  const enterDeadletter = () => {
    /* v47：回投递所复位退件后室第一归宿锁旗标，并清掉上一拍的入口反馈 */
    deadletterReturnRoomArmed = false;
    const returnRoomEntryResponse = $("#return-room-entry-response");
    if (returnRoomEntryResponse) returnRoomEntryResponse.textContent = "";
    AudioEngine.ensure();
    const pass = () => {
      dlTubeTimer = setTimeout(() => {
        if (currentScene !== "deadletter") return;
        AudioEngine.tube(0.5);
        pass();
      }, 24000 + Math.random() * 16000);
    };
    pass();
  };
  const leaveDeadletter = () => {
    clearTimeout(dlTubeTimer);
    dlTubeTimer = null;
    clearDlTimers();
  };

  /* ============================================================
     神名注销科：GODDEAD 不是判词，是无法送达的神名的档案状态
     ============================================================ */
  /* ---------- 状态统一存 goddead_cancellation，容错旧/坏 JSON ---------- */
  const CN_KEY = "goddead_cancellation";
  const CN_EMPTY = () => ({ queries: 0, solved: false, solvedAt: 0, refused: false, refusedAt: 0 });
  const getCancel = () => {
    try {
      const raw = JSON.parse(store.get(CN_KEY, "{}"));
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return CN_EMPTY();
      return {
        queries: Math.max(0, Math.floor(Number(raw.queries))) || 0,
        solved: raw.solved === true,
        solvedAt: Number(raw.solvedAt) || 0,
        refused: raw.refused === true,
        refusedAt: Number(raw.refusedAt) || 0,
      };
    } catch { return CN_EMPTY(); }
  };
  const saveCancel = (st) => store.set(CN_KEY, JSON.stringify(st));

  const cancelBox = $("#cancel-box");
  const cancelNote = $("#cancel-note");
  const cancelLink = $("#cancel-link");
  const cancelForm = $("#cancel-form");
  const cancelInput = $("#cancel-input");
  const cancelResponse = $("#cancel-response");
  const cancelRecord = $("#cancel-record");
  const cancelLines = $$("#cancel-record .cancel-line");
  const refuseBox = $("#refuse-box");
  const refuseBtn = $("#refuse-btn");
  const refuseRecord = $("#refuse-record");
  const refuseLines = $$("#refuse-record .refuse-line");
  const cancelMemory = $("#cancel-memory");

  const tryScheduleCancellation = () => {
    if (cancellationConsumed) return;
    const st = getCancel();
    if (!st.solved || !st.refused) return;
    AutoAdvance.schedule("cancellation", "acting", {
      before: () => { cancellationConsumed = true; },
      onSchedule: () => toast("你的拒绝被改写成了一份任命。"),
    });
  };

  const syncCancel = () => {
    if (watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted) {
      cancelBox.removeAttribute("hidden");
      cancelLink.removeAttribute("hidden");
      if (!cancelNote.textContent) {
        cancelNote.textContent = "空白回执生成了一个不该存在的案号。";
      }
    } else {
      cancelBox.setAttribute("hidden", "");
      cancelLink.setAttribute("hidden", "");
    }
  };

  /* 检索答复：三次错误各给一句，第三句之后停在那里 */
  const cancelHints = ["这里不按名字检索。", "查状态，不查神。", "域名已经替你填过一次答案。"];
  const hintFor = (queries) => cancelHints[Math.min(Math.max(queries, 1), 3) - 1];

  /* 档案与驳回记录：普通模式逐行显现，reduced-motion 立即完整 */
  let cnTimers = [];
  const clearCnTimers = () => {
    cnTimers.forEach(clearTimeout);
    cnTimers = [];
  };

  const revealCancelRecord = () => {
    clearCnTimers();
    cancelLines.forEach((l) => {
      l.setAttribute("hidden", "");
      l.classList.remove("on");
    });
    if (reduced) {
      cancelLines.forEach((l) => {
        l.removeAttribute("hidden");
        l.classList.add("on");
      });
      refuseBox.removeAttribute("hidden");
      return;
    }
    cancelLines.forEach((l, i) => {
      cnTimers.push(setTimeout(() => {
        l.removeAttribute("hidden");
        requestAnimationFrame(() => l.classList.add("on"));
        AudioEngine.tick();
      }, 150 + i * 120));
    });
    cnTimers.push(setTimeout(() => {
      refuseBox.removeAttribute("hidden");
    }, 150 + cancelLines.length * 120));
  };

  const revealRefusal = () => {
    refuseLines.forEach((l) => {
      l.setAttribute("hidden", "");
      l.classList.remove("on");
    });
    if (reduced) {
      refuseLines.forEach((l) => {
        l.removeAttribute("hidden");
        l.classList.add("on");
      });
      return;
    }
    refuseLines.forEach((l, i) => {
      cnTimers.push(setTimeout(() => {
        l.removeAttribute("hidden");
        requestAnimationFrame(() => l.classList.add("on"));
        AudioEngine.tick();
      }, 150 + i * 120));
    });
  };

  /* 检索：只认 trim + 大小写归一后的 GODDEAD——档案状态，不是名字 */
  cancelForm.addEventListener("submit", (e) => {
    e.preventDefault();
    /* v48：留副入口已武装的反馈拍内，检索表单不得迟到写旧状态 */
    if (cancellationCopyArmed) return;
    if (getCancel().solved) {
      tryScheduleCancellation();
      return;
    }
    const value = cancelInput.value.trim().toUpperCase();
    cancelInput.value = "";
    if (value === "GODDEAD") {
      const st = getCancel();
      if (!st.solved) {
        st.solved = true;
        st.solvedAt = Date.now();
        saveCancel(st);
      }
      cancelResponse.textContent = "";
      AudioEngine.type();
      cancelRecord.setAttribute("aria-live", "polite");
      revealCancelRecord();
      return;
    }
    const st = getCancel();
    st.queries += 1;
    saveCancel(st);
    cancelResponse.textContent = hintFor(st.queries);
    cancelInput.classList.add("shake");
    setTimeout(() => cancelInput.classList.remove("shake"), 500);
    AudioEngine.type();
  });

  /* 拒绝注销：拒绝本身成为仍在场的证明 */
  refuseBtn.addEventListener("click", () => {
    /* v48：留副入口已武装时，拒绝按钮不得迟到写 refused 或改写目的地 */
    if (cancellationCopyArmed) return;
    const st = getCancel();
    if (!st.solved || st.refused) return;
    st.refused = true;
    st.refusedAt = Date.now();
    saveCancel(st);
    AudioEngine.stamp();
    refuseBox.setAttribute("hidden", "");
    refuseRecord.setAttribute("aria-live", "polite");
    revealRefusal();
    paintCancel();
    syncActingEntry();
    paintActing();
    tryScheduleCancellation();
  });

  /* 重载恢复：错误计数对应提示、命中档案、拒绝终态完整重现
     （不重复播报、不改写时间与计数） */
  const syncCancelScene = () => {
    const st = getCancel();
    if (st.queries > 0 && !st.solved) {
      cancelResponse.textContent = hintFor(st.queries);
    }
    if (st.solved) {
      cancelLines.forEach((l) => {
        l.removeAttribute("hidden");
        l.classList.add("on");
      });
      if (st.refused) {
        refuseLines.forEach((l) => {
          l.removeAttribute("hidden");
          l.classList.add("on");
        });
      } else {
        refuseBox.removeAttribute("hidden");
      }
    }
  };

  /* 痕迹：注销状态与记忆（未拒绝不剧透） */
  const paintCancel = () => {
    const st = getCancel();
    setStatNum(numEls.cancel, st.refused ? "驳回" : "—", st.refused);
    cancelMemory.textContent = st.refused
      ? "系统试图注销你。你把拒绝留在了档案里。"
      : "";
  };

  /* 注销科氛围：检索/驳回的机械声随交互即发；每次进入按持久状态完整恢复，
     但不重复 aria-live、不改写时间/计数；离场清记录 timers，不泄漏 */
  const enterCancel = () => {
    /* v48：回注销科复位留副第一归宿锁旗标，并清掉上一拍的入口反馈 */
    cancellationCopyArmed = false;
    const copyEntryResponse = $("#cancellation-copy-entry-response");
    if (copyEntryResponse) copyEntryResponse.textContent = "";
    AudioEngine.ensure();
    /* 同页重进时先关闭 aria-live，再恢复 DOM，避免已存在记录被重新播报 */
    cancelRecord.setAttribute("aria-live", "off");
    refuseRecord.setAttribute("aria-live", "off");
    syncCancelScene();
  };
  const leaveCancel = () => {
    clearCnTimers();
  };

  /* ============================================================
     代神席：值守电闸与临时任命
     ============================================================ */
  /* ---------- 状态统一存 goddead_acting，容错旧/坏 JSON ---------- */
  const AC_KEY = "goddead_acting";
  const AC_EMPTY = () => ({ value: 0, appointed: false, appointedAt: 0 });
  const getActing = () => {
    try {
      const raw = JSON.parse(store.get(AC_KEY, "{}"));
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return AC_EMPTY();
      const v = Math.max(0, Math.min(100, Number(raw.value) || 0));
      return { value: v, appointed: raw.appointed === true, appointedAt: Number(raw.appointedAt) || 0 };
    } catch { return AC_EMPTY(); }
  };
  const saveActing = (st) => store.set(AC_KEY, JSON.stringify(st));

  const actingBox = $("#acting-box");
  const actingNote = $("#acting-note");
  const actingLink = $("#acting-link");
  const actingSwitch = $("#acting-switch");
  const actingRange = $("#acting-range");
  const actingOutput = $("#acting-output");
  const actingFeedback = $("#acting-feedback");
  const actingRecord = $("#acting-record");
  const actingLines = $$("#acting-record .acting-line");
  const actingFinal = $("#acting-final");
  const actingOfferingNote = $("#acting-offering-note");
  const actingMemory = $("#acting-memory");

  /* 任命后 acting-switch 本身成为可聚焦/可点击的恢复入口，
     未任命时保持为普通容器，避免与可用 range 形成嵌套交互冲突。 */
  const setActingSwitchInteractive = (interactive) => {
    if (interactive) {
      actingSwitch.classList.add("appointed");
      actingSwitch.setAttribute("tabindex", "0");
      actingSwitch.setAttribute("role", "button");
      actingSwitch.setAttribute("aria-label", "任命已生效。点击或按 Enter、Space 继续。");
    } else {
      actingSwitch.classList.remove("appointed");
      actingSwitch.removeAttribute("tabindex");
      actingSwitch.removeAttribute("role");
      actingSwitch.removeAttribute("aria-label");
    }
  };

  const tryScheduleActing = () => {
    if (actingConsumed) return;
    const st = getActing();
    if (!st.appointed) return;
    AutoAdvance.schedule("acting", "offering", {
      before: () => { actingConsumed = true; },
      onSchedule: () => toast("任命生效。祷告仍在继续。"),
    });
  };

  const syncActingEntry = () => {
    if (watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted && getCancel().refused) {
      actingBox.removeAttribute("hidden");
      actingLink.removeAttribute("hidden");
      if (!actingNote.textContent) {
        actingNote.textContent = "你的拒绝被改写成了一份任命。";
      }
    } else {
      actingBox.setAttribute("hidden", "");
      actingLink.setAttribute("hidden", "");
    }
  };

  const actingFeedbackFor = (v) => {
    if (v <= 33) return "检测到犹豫。";
    if (v <= 66) return "在场不能只登记一半。";
    if (v <= 99) return "拒绝注销的人，没有离席选项。";
    return "";
  };

  const actingValueText = (v) => {
    if (v === 0) return "离席";
    if (v === 100) return "在岗，已锁定";
    if (v <= 33) return `犹豫，${v}%`;
    if (v <= 66) return `半在场，${v}%`;
    return `拒绝离席，${v}%`;
  };

  const setRangeBackground = (v) => {
    actingRange.style.setProperty("--pct", v + "%");
  };

  /* 任命档案：五行逐行显现，reduced-motion 立即完整 */
  let actingTimers = [];
  const clearActingTimers = () => {
    actingTimers.forEach(clearTimeout);
    actingTimers = [];
  };
  const revealActingRecord = () => {
    clearActingTimers();
    actingLines.forEach((l) => {
      l.setAttribute("hidden", "");
      l.classList.remove("on");
    });
    actingFinal.classList.remove("on");
    if (reduced) {
      actingLines.forEach((l) => l.removeAttribute("hidden"));
      actingLines.forEach((l) => l.classList.add("on"));
      actingFinal.removeAttribute("hidden");
      actingFinal.classList.add("on");
      return;
    }
    actingLines.forEach((l, i) => {
      actingTimers.push(setTimeout(() => {
        l.removeAttribute("hidden");
        requestAnimationFrame(() => l.classList.add("on"));
        AudioEngine.tick();
      }, 150 + i * 120));
    });
    actingTimers.push(setTimeout(() => {
      actingFinal.removeAttribute("hidden");
      requestAnimationFrame(() => actingFinal.classList.add("on"));
      AudioEngine.bell(52);
    }, 150 + actingLines.length * 120 + 250));
  };

  /* ---------- HUD & Ruling UI 同步与控制 ---------- */
  const govHud = $("#governance-hud");
  const hudBarE = $("#hud-bar-e");
  const hudBarA = $("#hud-bar-a");
  const hudBarR = $("#hud-bar-r");
  const hudValE = $("#hud-val-e");
  const hudValA = $("#hud-val-a");
  const hudValR = $("#hud-val-r");

  const updateHudDisplay = () => {
    const gov = parseAndValidateGovernance();
    if (gov.hudUnlocked && (currentScene === "acting" || currentScene === "offering" || currentScene === "reliquary" || currentScene === "remembrance")) {
      if (govHud) govHud.removeAttribute("hidden");
    } else {
      if (govHud) govHud.setAttribute("hidden", "");
    }
    if (hudBarE) hudBarE.style.width = gov.resources.E + "%";
    if (hudBarA) hudBarA.style.width = gov.resources.A + "%";
    if (hudBarR) hudBarR.style.width = gov.resources.R + "%";
    if (hudValE) hudValE.textContent = gov.resources.E;
    if (hudValA) hudValA.textContent = gov.resources.A;
    if (hudValR) hudValR.textContent = gov.resources.R;
  };

  /* Ruling 1 (#acting) */
  const rulingActingBox = $("#ruling-acting-box");
  const rulingActingHeading = $("#ruling-acting-heading");
  const rulingActingBtnA = $("#ruling-acting-btn-a");
  const rulingActingBtnB = $("#ruling-acting-btn-b");
  const rulingActingConsequence = $("#ruling-acting-consequence");
  const continueActingBtn = $("#continue-acting-btn");

  const syncRulingActingUI = () => {
    if (!rulingActingBox) return;
    const gov = parseAndValidateGovernance();
    const st = getActing();
    if (!st.appointed || !gov.hudUnlocked) {
      rulingActingBox.setAttribute("hidden", "");
      return;
    }
    rulingActingBox.removeAttribute("hidden");
    const choice = gov.rulings.acting;

    if (rulingActingBtnA) rulingActingBtnA.setAttribute("aria-pressed", choice === "A" ? "true" : "false");
    if (rulingActingBtnB) rulingActingBtnB.setAttribute("aria-pressed", choice === "B" ? "true" : "false");

    if (choice) {
      if (rulingActingConsequence) rulingActingConsequence.textContent = RULING_CONSEQUENCES.acting[choice];
      if (continueActingBtn) continueActingBtn.removeAttribute("hidden");
    } else {
      if (rulingActingConsequence) rulingActingConsequence.textContent = "";
      if (continueActingBtn) continueActingBtn.setAttribute("hidden", "");
    }
  };

  const applyRulingActingChoice = (choice) => {
    let gov = parseAndValidateGovernance();
    gov.hudUnlocked = true;
    gov.rulings.acting = choice;
    saveGovernance(gov);
    updateHudDisplay();
    syncRulingActingUI();

    if (continueActingBtn) {
      continueActingBtn.focus();
    }
    scheduleActingAutoAdvance();
  };

  const scheduleActingAutoAdvance = () => {
    if (actingConsumed) return;
    AutoAdvance.schedule("acting", "offering", {
      before: () => { actingConsumed = true; },
      onSchedule: () => toast("代行判词已生效。即将前往焚献炉。"),
    });
  };

  if (rulingActingBtnA) rulingActingBtnA.addEventListener("click", () => applyRulingActingChoice("A"));
  if (rulingActingBtnB) rulingActingBtnB.addEventListener("click", () => applyRulingActingChoice("B"));
  if (continueActingBtn) continueActingBtn.addEventListener("click", scheduleActingAutoAdvance);

  /* Ruling 2 (#offering) */
  const rulingOfferingBox = $("#ruling-offering-box");
  const rulingOfferingHeading = $("#ruling-offering-heading");
  const rulingOfferingBtnA = $("#ruling-offering-btn-a");
  const rulingOfferingBtnB = $("#ruling-offering-btn-b");
  const rulingOfferingConsequence = $("#ruling-offering-consequence");
  const continueOfferingBtn = $("#continue-offering-btn");

  const syncRulingOfferingUI = () => {
    if (!rulingOfferingBox) return;
    const gov = parseAndValidateGovernance();
    if (!getActing().appointed || !gov.hudUnlocked) {
      rulingOfferingBox.setAttribute("hidden", "");
      return;
    }
    // 只有提交过祷词（或不是首 Cycle）后才显示 Ruling 2
    if (gstate.prayersOffered <= 0 && !gov.rulings.offering) {
      rulingOfferingBox.setAttribute("hidden", "");
      return;
    }
    rulingOfferingBox.removeAttribute("hidden");
    const choice = gov.rulings.offering;

    if (rulingOfferingBtnA) rulingOfferingBtnA.setAttribute("aria-pressed", choice === "A" ? "true" : "false");
    if (rulingOfferingBtnB) rulingOfferingBtnB.setAttribute("aria-pressed", choice === "B" ? "true" : "false");

    if (choice) {
      if (rulingOfferingConsequence) rulingOfferingConsequence.textContent = RULING_CONSEQUENCES.offering[choice];
      if (continueOfferingBtn) continueOfferingBtn.removeAttribute("hidden");
    } else {
      if (rulingOfferingConsequence) rulingOfferingConsequence.textContent = "";
      if (continueOfferingBtn) continueOfferingBtn.setAttribute("hidden", "");
    }
  };

  const applyRulingOfferingChoice = (choice) => {
    let gov = parseAndValidateGovernance();
    gov.rulings.offering = choice;
    saveGovernance(gov);
    updateHudDisplay();
    syncRulingOfferingUI();

    if (continueOfferingBtn) {
      continueOfferingBtn.focus();
    }
    scheduleOfferingAutoAdvance();
  };

  const scheduleOfferingAutoAdvance = () => {
    if (offeringConsumed) return;
    AutoAdvance.schedule("offering", "reliquary", {
      before: () => { offeringConsumed = true; },
      onSchedule: () => toast("焚献判词已生效。即将前往神圣遗物科。"),
    });
  };

  if (rulingOfferingBtnA) rulingOfferingBtnA.addEventListener("click", () => applyRulingOfferingChoice("A"));
  if (rulingOfferingBtnB) rulingOfferingBtnB.addEventListener("click", () => applyRulingOfferingChoice("B"));
  if (continueOfferingBtn) continueOfferingBtn.addEventListener("click", scheduleOfferingAutoAdvance);

  /* Ruling 3 (#reliquary) */
  const rulingReliquaryBox = $("#ruling-reliquary-box");
  const rulingReliquaryHeading = $("#ruling-reliquary-heading");
  const rulingReliquaryBtnA = $("#ruling-reliquary-btn-a");
  const rulingReliquaryBtnB = $("#ruling-reliquary-btn-b");
  const rulingReliquaryConsequence = $("#ruling-reliquary-consequence");
  const continueReliquaryBtn = $("#continue-reliquary-btn");

  const syncRulingReliquaryUI = () => {
    if (!rulingReliquaryBox) return;
    const gov = parseAndValidateGovernance();
    const st = getRelic();
    if (!st.sealed || !gov.hudUnlocked) {
      rulingReliquaryBox.setAttribute("hidden", "");
      return;
    }
    rulingReliquaryBox.removeAttribute("hidden");
    const choice = gov.rulings.reliquary;

    if (rulingReliquaryBtnA) rulingReliquaryBtnA.setAttribute("aria-pressed", choice === "A" ? "true" : "false");
    if (rulingReliquaryBtnB) rulingReliquaryBtnB.setAttribute("aria-pressed", choice === "B" ? "true" : "false");

    if (choice) {
      if (rulingReliquaryConsequence) rulingReliquaryConsequence.textContent = RULING_CONSEQUENCES.reliquary[choice];
      if (continueReliquaryBtn) continueReliquaryBtn.removeAttribute("hidden");
    } else {
      if (rulingReliquaryConsequence) rulingReliquaryConsequence.textContent = "";
      if (continueReliquaryBtn) continueReliquaryBtn.setAttribute("hidden", "");
    }
  };

  const applyRulingReliquaryChoice = (choice) => {
    let gov = parseAndValidateGovernance();
    gov.rulings.reliquary = choice;
    saveGovernance(gov);
    /* 二次解析并回写：把本轮推导出的结局（若有）正式持久化进图鉴 */
    saveGovernance(parseAndValidateGovernance());
    updateHudDisplay();
    syncRulingReliquaryUI();

    if (continueReliquaryBtn) {
      continueReliquaryBtn.focus();
    }
    // 做出 Ruling 3 选择后才触发 6 行封印记录动画并 AutoAdvance 到 remembrance
    revealRelicRecordAndAdvance();
  };

  const revealRelicRecordAndAdvance = () => {
    const record = $("#relic-record");
    const lines = record ? Array.from(record.querySelectorAll(".relic-line")) : [];
    if (record) record.setAttribute("aria-live", "polite");

    clearRelicTimers();
    if (reduced) {
      lines.forEach((l) => { l.hidden = false; l.classList.add("in"); });
      paintRelic();
      scheduleReliquaryAutoAdvance();
    } else {
      lines.forEach((l, i) => {
        const tid = setTimeout(() => {
          l.hidden = false;
          l.classList.add("in");
          AudioEngine.tick();
          if (i === lines.length - 1) {
            paintRelic();
            scheduleReliquaryAutoAdvance();
          }
        }, 150 + i * 150);
        relicTimers.push(tid);
      });
    }
  };

  const scheduleReliquaryAutoAdvance = () => {
    if (reliquaryConsumed) return;
    AutoAdvance.schedule("reliquary", "remembrance", {
      before: () => { reliquaryConsumed = true; },
      onSchedule: () => toast("代行裁决完成。即刻归入终局记录。"),
    });
  };

  if (rulingReliquaryBtnA) rulingReliquaryBtnA.addEventListener("click", () => applyRulingReliquaryChoice("A"));
  if (rulingReliquaryBtnB) rulingReliquaryBtnB.addEventListener("click", () => applyRulingReliquaryChoice("B"));
  if (continueReliquaryBtn) continueReliquaryBtn.addEventListener("click", scheduleReliquaryAutoAdvance);

  /* ---------- 治理终局：老玩家入口 / 结局卡 / 崩解 modal / 新一轮 ---------- */
  const ENDING_META = {
    ascension: { name: "登神长阶 · ASCENSION", narrative: "灵质压过了灰烬与共鸣。你沿着代行的阶梯一直向上，直到「代理」二字自行脱落——观所迎来了一位并不情愿的新神。" },
    madness: { name: "万魂共鸣 · MADNESS", narrative: "共鸣淹没了灵质与灰烬。所有无人应答的祷告在同一秒开口，你在亿万声音里再也找不到属于自己的那一句。" },
    oblivion: { name: "灰烬归寂 · OBLIVION", narrative: "灰烬厚过了灵质。一切都还在，只是再也没有人记得为什么。观所安静地合上，像一封无人签收的信。" },
    nightwatch: { name: "永恒值夜 · NIGHTWATCH", narrative: "三元没有一边胜出。你把代行做成了一生的值夜——不登神，不疯狂，不归寂，只是继续看着。" },
  };

  const beginGovernanceBox = $("#begin-governance-box");
  const beginGovernanceBtn = $("#begin-governance-btn");
  const endingCardBox = $("#ending-card-box");
  const endingTitle = $("#ending-title");
  const endingNarrative = $("#ending-narrative");
  const endingResE = $("#ending-res-e");
  const endingResA = $("#ending-res-a");
  const endingResR = $("#ending-res-r");
  const collectionList = $("#collection-list");
  const nextCycleBtn = $("#next-cycle-btn");
  const collapseModal = $("#collapse-modal");
  const retryGovernanceBtn = $("#retry-governance-btn");

  /* 只重置本轮三项裁决（派生资源与结果随 rulings 重算而归零）；
     图鉴与旧主线进度（值夜/线路/投递/注销/任命/祷告/遗物/抵达）一概不动；
     cycleCount 仅在主动开启新一轮时精确加一，解析永不自增。 */
  const resetGovernanceCycle = () => {
    const gov = parseAndValidateGovernance();
    const next = {
      version: 28,
      cycleCount: gov.cycleCount + 1,
      rulings: { acting: null, offering: null, reliquary: null },
      unlockedEndings: gov.unlockedEndings,
      hudUnlocked: true,
    };
    saveGovernance(next);
    return next;
  };

  /* 崩解 modal 键盘陷阱：打开时挂监听、关闭/离场时移除；
     当前仅重试一个可聚焦项时，Tab 与 Shift+Tab 两个方向都留在重试上 */
  const onCollapseKeydown = (e) => {
    if (e.key !== "Tab" || !collapseModal || collapseModal.hasAttribute("hidden")) return;
    const focusables = Array.from(collapseModal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"))
      .filter((el) => !el.disabled && el.getClientRects().length > 0);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || !collapseModal.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !collapseModal.contains(document.activeElement))) {
      e.preventDefault();
      first.focus();
    }
  };

  const closeCollapseModal = () => {
    if (collapseModal) collapseModal.setAttribute("hidden", "");
    document.removeEventListener("keydown", onCollapseKeydown, true);
  };

  const openCollapseModal = () => {
    if (!collapseModal) return;
    collapseModal.removeAttribute("hidden");
    document.addEventListener("keydown", onCollapseKeydown, true);
    /* 初始焦点由 goScene 的转场完成步骤统一落到重试按钮，不再使用嵌套定时器 */
  };

  /* 痕迹页治理终局面板：begin 入口 / 结局卡 / 崩解 modal 三态互斥 */
  const syncGovernanceRemembrance = () => {
    const gov = parseAndValidateGovernance();
    const mainLineDone = getRelic().sealed;

    /* 老玩家入口：旧主线已完成（遗物已封印）但从未开启治理 */
    if (beginGovernanceBox) {
      if (mainLineDone && !gov.hudUnlocked) beginGovernanceBox.removeAttribute("hidden");
      else beginGovernanceBox.setAttribute("hidden", "");
    }

    /* 结局卡：仅四个正常结局；collapse 走 modal */
    if (endingCardBox) {
      if (gov.resultStatus && VALID_ENDINGS.includes(gov.resultStatus)) {
        const meta = ENDING_META[gov.resultStatus];
        if (endingTitle) endingTitle.textContent = meta.name;
        if (endingNarrative) endingNarrative.textContent = meta.narrative;
        if (endingResE) endingResE.textContent = gov.resources.E;
        if (endingResA) endingResA.textContent = gov.resources.A;
        if (endingResR) endingResR.textContent = gov.resources.R;
        if (collectionList) {
          collectionList.innerHTML = "";
          VALID_ENDINGS.forEach((id) => {
            const li = document.createElement("li");
            li.className = "collection-item" + (gov.unlockedEndings.includes(id) ? " unlocked" : "");
            li.textContent = ENDING_META[id].name;
            collectionList.appendChild(li);
          });
        }
        endingCardBox.removeAttribute("hidden");
      } else {
        endingCardBox.setAttribute("hidden", "");
      }
    }

    if (gov.resultStatus === "collapse" && currentScene === "remembrance") openCollapseModal();
    else closeCollapseModal();
  };

  /* 老玩家入口：只开启治理并前往代神席，不清空任何旧主线进度 */
  if (beginGovernanceBtn) beginGovernanceBtn.addEventListener("click", () => {
    const gov = parseAndValidateGovernance();
    gov.hudUnlocked = true;
    saveGovernance(gov);
    updateHudDisplay();
    pendingSceneFocus = rulingActingHeading;
    toast("代神治理协议已开启。请回到代神席颁布首项判词。");
    goScene("acting");
  });

  if (nextCycleBtn) nextCycleBtn.addEventListener("click", () => {
    resetGovernanceCycle();
    updateHudDisplay();
    pendingSceneFocus = rulingActingHeading;
    toast("新一轮代行治理已开始。判词已清空，图鉴与旧档案保留。");
    goScene("acting");
  });

  if (retryGovernanceBtn) retryGovernanceBtn.addEventListener("click", () => {
    resetGovernanceCycle();
    closeCollapseModal();
    updateHudDisplay();
    pendingSceneFocus = rulingActingHeading;
    toast("崩解已登记。新一轮代行治理开始。");
    goScene("acting");
  });

  const appoint = () => {
    const st = getActing();
    if (st.appointed) return;
    st.appointed = true;
    st.appointedAt = Date.now();
    saveActing(st);
    actingRange.disabled = true;
    actingRange.setAttribute("aria-valuetext", actingValueText(100));
    setActingSwitchInteractive(true);
    actingRecord.setAttribute("aria-live", "polite");
    revealActingRecord();
    paintActing();
    AudioEngine.relayLock();

    let gov = parseAndValidateGovernance();
    gov.hudUnlocked = true;
    saveGovernance(gov);
    updateHudDisplay();
    syncRulingActingUI();

    setTimeout(() => {
      if (rulingActingHeading) {
        rulingActingHeading.setAttribute("tabindex", "-1");
        rulingActingHeading.focus();
      }
    }, reduced ? 50 : 300);
  };

  const updateActing = (v, fromInput = true) => {
    const st = getActing();
    v = Math.max(0, Math.min(100, Math.round(v)));
    /* 已任命则电闸锁在 100，不接受回退 */
    if (st.appointed) {
      actingRange.value = 100;
      setRangeBackground(100);
      return;
    }
    actingRange.value = v;
    setRangeBackground(v);
    actingOutput.textContent = `在场：${v}%`;
    actingRange.setAttribute("aria-valuetext", actingValueText(v));
    actingFeedback.textContent = actingFeedbackFor(v);
    if (fromInput) {
      st.value = v;
      saveActing(st);
      AudioEngine.switchFriction();
      if (v > 0 && v < 100) AudioEngine.switchContact();
      if (v === 100) appoint();
    }
  };

  actingRange.addEventListener("input", () => updateActing(Number(actingRange.value)));
  actingRange.addEventListener("change", () => {
    const v = Number(actingRange.value);
    if (!getActing().appointed && v === 100) appoint();
  });

  /* 任命后电闸被锁定，若转场 timer 被回退取消，再次主动点击/键盘激活开关区可恢复 */
  actingSwitch.addEventListener("click", tryScheduleActing);
  actingSwitch.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tryScheduleActing();
    }
  });

  /* 重载恢复：value 夹在 0–100，任命终态完整重现（不重复播报、不改写 appointedAt） */
  const syncActingScene = () => {
    const st = getActing();
    actingRange.value = st.value;
    setRangeBackground(st.value);
    actingOutput.textContent = `在场：${st.value}%`;
    actingRange.setAttribute("aria-valuetext", actingValueText(st.value));
    actingFeedback.textContent = actingFeedbackFor(st.value);
    if (st.appointed) {
      actingRange.disabled = true;
      actingRange.value = 100;
      setRangeBackground(100);
      actingOutput.textContent = "在场：100%";
      actingRange.setAttribute("aria-valuetext", actingValueText(100));
      actingFeedback.textContent = "";
      actingLines.forEach((l) => {
        l.removeAttribute("hidden");
        l.classList.add("on");
      });
      actingFinal.removeAttribute("hidden");
      actingFinal.classList.add("on");
      syncRulingActingUI();
    }
    setActingSwitchInteractive(st.appointed);
  };

  /* 痕迹：代神席记忆（未任命不剧透） */
  const paintActing = () => {
    const st = getActing();
    if (st.appointed) {
      actingOfferingNote.removeAttribute("hidden");
      actingMemory.textContent = "你没有成为神。你只是接了祂没有交完的班。";
    } else {
      actingOfferingNote.setAttribute("hidden", "");
      actingMemory.textContent = "";
    }
  };

  /* 同页重进：先关 aria-live，再恢复 DOM，避免已存在记录被重新播报 */
  const enterActing = () => {
    AudioEngine.ensure();
    actingRecord.setAttribute("aria-live", "off");
    syncActingScene();
  };
  const leaveActing = () => {
    clearActingTimers();
  };

  /* ============================================================
     焚献祷告
     ============================================================ */
  const prayerPool = [
    "祷词已焚毁。灰烬比声音活得久。",
    "没有人听。这正是祈祷成立的原因。",
    "你的句子会在灰里继续燃烧。",
    "火灭了之后，这句话还在。",
    "它把你的祷词折好，放进了空神龛。",
    "灰落在祭坛上，像一场很小的雪。",
  ];

  let sessionPrayers = 0;

  const burnPrayer = (text) => {
    const rect = prayerInput.getBoundingClientRect();
    const layerRect = burnLayer.getBoundingClientRect();
    const chars = Array.from(text);
    chars.forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "burn-char";
      s.textContent = ch === " " ? "·" : ch;
      s.style.left = rect.left - layerRect.left + (rect.width * (i + 0.5)) / chars.length + "px";
      s.style.top = rect.top - layerRect.top + "px";
      s.style.setProperty("--dx", (Math.random() * 90 - 45).toFixed(0) + "px");
      s.style.setProperty("--dy", (-(130 + Math.random() * 150)).toFixed(0) + "px");
      s.style.setProperty("--rot", (Math.random() * 70 - 35).toFixed(0) + "deg");
      s.style.setProperty("--dur", (1.4 + Math.random() * 0.9).toFixed(2) + "s");
      s.style.animationDelay = (i * 0.035).toFixed(2) + "s";
      burnLayer.appendChild(s);
      setTimeout(() => s.remove(), 2800 + i * 35);
    });
    if (!reduced) spawnBurst(rect.left + rect.width / 2, rect.top, 16, true);
  };

  const offerPrayer = () => {
    const value = prayerInput.value.trim();
    if (!value) {
      prayerInput.classList.add("shake");
      setTimeout(() => prayerInput.classList.remove("shake"), 500);
      return;
    }

    if (offeringFigure) { offeringFigure.classList.add("ignited"); offeringFigure.setAttribute("aria-label", "一座仍在燃烧的焚献炉"); }
    burnPrayer(value);
    AudioEngine.bell(72);
    prayerInput.value = "";

    sessionPrayers++;
    gstate.prayersOffered++;
    saveState();
    paintStats();

    let text;
    if (value.includes("神")) {
      text = "你提到了祂。灰堆轻轻动了一下。";
    } else if (sessionPrayers === 3) {
      text = "够了。灰已经认得你的笔迹。";
    } else if (gstate.prayersOffered % 7 === 0) {
      text = `第七次焚献。已登记为第 ${gstate.prayersOffered} 次无人应答。`;
    } else {
      text = prayerPool[Math.floor(Math.random() * prayerPool.length)];
    }

    prayerResponse.classList.remove("visible");
    void prayerResponse.offsetWidth;
    prayerResponse.textContent = text;
    prayerResponse.classList.add("visible");

    syncRulingOfferingUI();
    setTimeout(() => {
      if (rulingOfferingHeading) {
        rulingOfferingHeading.setAttribute("tabindex", "-1");
        rulingOfferingHeading.focus();
      }
    }, reduced ? 50 : 300);
  };

  prayerOffer.addEventListener("click", offerPrayer);
  prayerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") offerPrayer();
  });

  /* ============================================================
     痕迹：统计 + 遗物室
     ============================================================ */
  const numEls = {
    arrivals: $("#num-arrivals"),
    fragments: $("#num-fragments"),
    prayers: $("#num-prayers"),
    watch: $("#num-watch"),
    line: $("#num-line"),
    deliver: $("#num-deliver"),
    cancel: $("#num-cancel"),
    corruption: $("#num-corruption"),
  };

  function paintStats() {
    setStatNum(numEls.arrivals, arrivals);
    setStatNum(numEls.fragments, fragments);
    setStatNum(numEls.prayers, gstate.prayersOffered);
    setStatNum(numEls.corruption, corruptionOf().toFixed(1) + "%");
  }

  const countUp = (el, target, suffix = "", decimals = 0) => {
    if (reduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ============================================================
     第四幕又半 · 神圣遗物科
     ============================================================ */
  let relicTimers = [];
  const clearRelicTimers = () => {
    relicTimers.forEach(clearTimeout);
    relicTimers = [];
  };

  const syncReliquaryEntry = () => {
    renderReliquary();
  };

  const enterReliquary = () => {
    reliquaryConsumed = false;
    paintRelic();
    syncRulingReliquaryUI();
  };

  const leaveReliquary = () => {
    AutoAdvance.clear("reliquary");
    clearRelicTimers();
    const record = $("#relic-record");
    if (record) record.setAttribute("aria-live", "off");
  };

  const paintRelic = () => {
    const data = getRelic();
    const items = [$("#relic-1"), $("#relic-2"), $("#relic-3")];
    const sealBtn = $("#seal-btn");
    const sealReason = $("#seal-reason");
    const record = $("#relic-record");

    const notes = [
      "已压印：门外四记敲击与八张从走廊脱落的碎片。",
      "已压印：05:02 值夜接线与第三局空白回执。",
      "已压印：代神席 100% 在场闸刀与焚献炉灰烬。"
    ];

    let count = 0;
    items.forEach((item, i) => {
      if (!item) return;
      const btn = item.querySelector(".relic-btn");
      const alt = item.querySelector(".alt");
      const pressed = data.items[i];
      if (pressed) {
        count++;
        btn.setAttribute("aria-pressed", "true");
        if (alt) {
          alt.textContent = notes[i];
          alt.hidden = false;
          alt.removeAttribute("aria-hidden");
        }
      } else {
        btn.setAttribute("aria-pressed", "false");
        if (alt) {
          alt.hidden = true;
          alt.setAttribute("aria-hidden", "true");
        }
      }
    });

    if (data.sealed) {
      if (sealBtn) {
        sealBtn.disabled = true;
        const orig = $("#seal-orig");
        if (orig) orig.textContent = "肆 · 终极封印已生效";
      }
      if (sealReason) sealReason.textContent = "神圣遗物科档案已永久封印。";
      if (record) {
        record.setAttribute("aria-live", "off");
        const lines = record.querySelectorAll(".relic-line");
        lines.forEach((l) => { l.hidden = false; l.classList.add("in"); });
      }
    } else {
      const remaining = 3 - count;
      if (count === 3) {
        if (sealBtn) {
          sealBtn.disabled = false;
          const orig = $("#seal-orig");
          if (orig) orig.textContent = "肆 · 压下终极封印";
        }
        if (sealReason) sealReason.textContent = "三件遗物已全部审查压印。可以执行终极封印。";
      } else {
        if (sealBtn) sealBtn.disabled = true;
        if (sealReason) sealReason.textContent = `还有 ${remaining} 件遗物未审查封印。`;
      }
      if (record) {
        const lines = record.querySelectorAll(".relic-line");
        lines.forEach((l) => { l.hidden = true; l.classList.remove("in"); });
      }
    }
  };

  [1, 2, 3].forEach((idx) => {
    const container = $(`#relic-${idx}`);
    if (!container) return;
    const btn = container.querySelector(".relic-btn");
    if (!btn) return;
    const handlePress = () => {
      AudioEngine.clamp();
      const data = getRelic();
      data.items[idx - 1] = true;
      saveRelic(data);
      paintRelic();
    };
    btn.addEventListener("click", handlePress);
  });

  const sealBtn = $("#seal-btn");
  if (sealBtn) {
    sealBtn.addEventListener("click", () => {
      if (sealBtn.disabled) return;
      const data = getRelic();
      if (!data.items.every(Boolean)) return;
      if (data.sealed) {
        paintRelic();
        return;
      }
      AudioEngine.stamp();
      data.sealed = true;
      data.sealedAt = Date.now();
      saveRelic(data);
      paintRelic();

      syncRulingReliquaryUI();
      setTimeout(() => {
        if (rulingReliquaryHeading) {
          rulingReliquaryHeading.setAttribute("tabindex", "-1");
          rulingReliquaryHeading.focus();
        }
      }, reduced ? 50 : 300);
    });
  }

  const renderReliquary = () => {
    const unlocked = reliquaryUnlocked();
    if (reliquaryLink) {
      reliquaryLink.hidden = !unlocked;
      reliquaryLink.classList.toggle("locked", !unlocked);
      reliquaryLink.setAttribute("aria-hidden", String(!unlocked));
      if (unlocked) {
        reliquaryLink.removeAttribute("hidden");
      } else {
        reliquaryLink.setAttribute("hidden", "");
      }
    }

    /* 走廊里的第四道门 */
    if (gateReliquary) {
      gateReliquary.classList.toggle("unsealed", unlocked);
      gateReliquary.querySelector(".gate-name").textContent = unlocked ? "神圣遗物科" : "？？？";
      gateReliquary.querySelector(".gate-whisper").textContent = unlocked
        ? "所有留在观所里的东西，在此压印归档。"
        : "遗物室仍在沉睡。";
      const stat = $("#stat-reliquary");
      if (stat) {
        stat.textContent = unlocked
          ? "已解封 · 随时进入"
          : "封印 · 需在代神席在岗并完成焚献";
      }
    }

    if (reliquarySlot) {
      if (unlocked) {
        const data = getRelic();
        const sealText = data.sealed ? " · 已封印" : "";
        reliquarySlot.innerHTML =
          `<a class="rl-link" href="#reliquary" data-go="reliquary" data-hover><b>02‡</b><span class="rl-name">神圣遗物科${sealText}</span><span class="rl-hint">审查被留下的遗物与灰烬 ⟶</span></a>`;
      } else {
        reliquarySlot.innerHTML =
          `<div class="rl-lock"><b>02‡ / 神圣遗物科</b><span>遗物室仍在沉睡 · 需在代神席在岗并完成焚献</span></div>`;
      }
    }
  };

  const paintRelicMemory = () => {
    const data = getRelic();
    const memory = $("#relic-memory");
    if (memory) {
      if (data.sealed) {
        memory.textContent = "神没有留下遗物。你把整座观所封印在了记忆里。";
        memory.hidden = false;
      } else {
        memory.hidden = true;
      }
    }
  };

  /* 十字：记录抵达 */
  crossMark.addEventListener("click", () => {
    arrivals++;
    store.set("goddead_arrivals", String(arrivals));
    arrivalCount.textContent = `已记录 ${arrivals} 次抵达`;
    saveState();
    if (statsCounted) paintStats();
    AudioEngine.bell(84);
    toast(arrivals % 7 === 0 ? "第七次抵达。遗物室记住了你。" : `抵达记录：${arrivals}`);
    renderReliquary();
  });

  arrivalCount.textContent = `已记录 ${arrivals} 次抵达`;

  /* ============================================================
     目录抽屉
     ============================================================ */
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuTrigger.setAttribute("aria-expanded", String(open));
    if (open) menuClose.focus();
    else menuTrigger.focus();
  };

  menuTrigger.addEventListener("click", () => setMenu(true));
  menuClose.addEventListener("click", () => setMenu(false));
  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });

  /* ============================================================
     键盘仪式
     ============================================================ */
  let codeBuffer = "";
  const konami = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let konamiIdx = 0;

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (key.length === 1) {
      codeBuffer = (codeBuffer + key).slice(-7);
      if (codeBuffer === "goddead") {
        awake = true;
        store.set("goddead_awake", "true");
        syncAwake();
        doorPulse();
        AudioEngine.bell(48);
        if (!reduced) spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 26);
        toast("你念出了它的名字。现在，它也会念出你的。");
      }
    }

    if (key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) {
        konamiIdx = 0;
        body.classList.add("miracle");
        if (!reduced) emberStorm();
        AudioEngine.bell(60);
        toast("古老的按键仪式完成。神迹短暂地回来了。");
        setTimeout(() => body.classList.remove("miracle"), 2500);
      }
    } else {
      konamiIdx = key === konami[0] ? 1 : 0;
    }
  });

  /* ============================================================
     沉默彩蛋
     ============================================================ */
  let idleTimer = null;
  const goIdle = () => {
    if (body.classList.contains("idle")) return;
    body.classList.add("idle");
    toast("你的沉默，也被记录了。");
  };
  const resetIdle = () => {
    body.classList.remove("idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(goIdle, 45000);
  };
  ["mousemove", "keydown", "scroll", "touchstart", "pointerdown"].forEach((evt) =>
    window.addEventListener(evt, resetIdle, { passive: true })
  );
  resetIdle();

  /* ============================================================
     触碰余烬（任意点击）
     ============================================================ */
  if (!reduced) {
    document.addEventListener("pointerdown", (e) => {
      spawnBurst(e.clientX, e.clientY, 10);
    });
  }

  /* ============================================================
     痕迹页重置（选择遗忘）
     ============================================================ */
  const forgetTriggerBtn = $("#forget-trigger-btn");
  const forgetPanel = $("#forget-panel");
  const forgetCancelBtn = $("#forget-cancel-btn");
  const forgetActionBtn = $("#forget-action-btn");

  if (forgetTriggerBtn && forgetPanel) {
    forgetTriggerBtn.addEventListener("click", () => {
      forgetPanel.hidden = false;
      forgetTriggerBtn.hidden = true;
    });
  }

  if (forgetCancelBtn && forgetPanel && forgetTriggerBtn) {
    forgetCancelBtn.addEventListener("click", () => {
      forgetPanel.hidden = true;
      forgetTriggerBtn.hidden = false;
    });
  }

  if (forgetActionBtn) {
    forgetActionBtn.addEventListener("click", () => {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith("goddead") || k.toLowerCase().includes("goddead"))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {}

      awake = false;
      arrivals = 0;
      fragments = 0;
      gstate = { prayersOffered: 0, corruption: 0 };
      statsCounted = false;
      /* v43：遗忘同时重置敲门计数与回敲窗口显露态 */
      knocks = 0;
      syncCounterKnockWindow();

      paintStats();
      syncAwake();
      syncWatchDoor();
      applyWatchState();
      syncLine4();
      syncPatchLog();
      syncDeadletter();
      syncReturnLog();
      syncCancel();
      syncCancelScene();
      syncActingEntry();
      syncActingScene();
      renderReliquary();
      syncReliquaryEntry();
      syncBranchEntries();
      syncForecourtLinks();
      syncAnnexLinks();
      syncReviewLinks();
      syncValuationLinks();
      syncFloorLinks();
      syncCallbackLink();
      syncProxyLink();
      syncAuditLink();
      syncLateralLinks();
      syncBackroomLinks();
      syncDriftEntry();
      syncDriftLink();
      syncKnockLinks();
      syncPaperbackLinks();
      syncReliefLinks();
      syncSidetoneLinks();
      syncReturnRoomLinks();
      syncCopyLinks();
      paintWatch();
      paintLine4();
      paintDeliver();
      paintCancel();
      paintActing();
      paintRelicMemory();
      paintBranchMemory();
      paintForecourtMemory();
      paintAnnexMemory();
      paintAnomalyMemory();
      paintValuationMemory();
      paintFloorMemory();
      paintRegistryMemory();
      paintCallbackMemory();
      paintProxyMemory();
      paintAuditMemory();
      paintLateralMemory();
      paintBackroomMemory();
      paintDriftMemory();
      paintKnockNetMemory();
      paintPaperbackMemory();
      paintReliefMemory();
      paintSidetoneMemory();
      paintReturnRoomMemory();
      paintCopyMemory();

      if (forgetPanel) forgetPanel.hidden = true;
      if (forgetTriggerBtn) forgetTriggerBtn.hidden = false;
      toast("已遗忘所有痕迹。重置回门外。");
      goScene("threshold");
    });
  }

  /* ---------- 初始化 ---------- */
  paintStats();
  saveState();
  renderReliquary();
  syncReliquaryEntry();
  syncAwake();
  syncWatchDoor();
  applyWatchState();
  paintWatch();
  syncLine4();
  syncPatchLog();
  paintLine4();
  syncDeadletter();
  syncReturnLog();
  paintDeliver();
  syncCancel();
  syncCancelScene();
  paintCancel();
  syncActingEntry();
  syncActingScene();
  paintActing();
  paintRelicMemory();
  syncBranchEntries();
  paintBranchMemory();
  syncForecourtLinks();
  paintForecourtMemory();
  syncAnnexLinks();
  paintAnnexMemory();
  syncReviewLinks();
  paintAnomalyMemory();
  syncValuationLinks();
  paintValuationMemory();
  syncFloorLinks();
  paintFloorMemory();
  paintRegistryMemory();
  syncCallbackLink();
  paintCallbackMemory();
  syncProxyLink();
  paintProxyMemory();
  syncAuditLink();
  paintAuditMemory();
  syncLateralLinks();
  paintLateralMemory();
  syncBackroomLinks();
  paintBackroomMemory();
  syncDriftEntry();
  syncDriftLink();
  paintDriftMemory();
  syncKnockLinks();
  paintKnockNetMemory();
  syncPaperbackLinks();
  paintPaperbackMemory();
  syncReliefLinks();
  paintReliefMemory();
  syncSidetoneLinks();
  paintSidetoneMemory();
  syncReturnRoomLinks();
  paintReturnRoomMemory();
  syncCopyLinks();
  paintCopyMemory();
  revealScene(scenes.threshold);
  syncDoorOpenState();
  route();
});

console.log("%c GOD / DEAD ", "background:#8d2b27;color:#050505;font-family:serif;font-size:18px;letter-spacing:.3em");
console.log("%c 输入 goddead，唤醒门。", "color:#777169;font-family:monospace");
console.log("%c 输入 ↑↑↓↓←→←→BA，召回神迹。", "color:#777169;font-family:monospace");
console.log("%c 凝视经文三秒，它会出卖一句话。", "color:#777169;font-family:monospace");
console.log("%c 守则的条数，偶尔会数错。数错的时候点它。", "color:#777169;font-family:monospace");
