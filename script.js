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
      const id = setTimeout(() => {
        timers.delete(scene);
        if (options.before) options.before();
        goScene(target);
      }, ms);
      timers.set(scene, { id, target });
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
  let watchConsumed = false;
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
    if (name === "protocol") { protocolConsumed = false; startAnomaly(); }
    if (name === "corridor") { corridorConsumed = false; syncWatchDoor(); startTrace(); }
    if (name === "watch") { watchConsumed = false; enterWatch(); }
    if (name === "switchboard") enterSwitch();
    if (name === "deadletter") enterDeadletter();
    if (name === "cancellation") { cancellationConsumed = false; enterCancel(); }
    if (name === "acting") { actingConsumed = false; enterActing(); }
    if (name === "offering") { offeringConsumed = false; if (offeringFigure) { offeringFigure.classList.remove("ignited"); offeringFigure.setAttribute("aria-label", "一座沉寂的焚献炉"); } }
    if (name === "reliquary") { reliquaryConsumed = false; enterReliquary(); }
    if (name === "ninth") AudioEngine.bell(58);
    if (name === "remembrance") {
      paintWatch();
      paintLine4();
      paintDeliver();
      paintCancel();
      paintActing();
      paintRelicMemory();
      if (!statsCounted) {
        statsCounted = true;
        countUp(numEls.arrivals, arrivals);
        countUp(numEls.fragments, fragments);
        countUp(numEls.prayers, gstate.prayersOffered);
        countUp(numEls.corruption, corruptionOf(), "%", 1);
      }
    }
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
    /* 地址栏同步到最终落点，避免停在未解锁场景的假状态 */
    if (target !== name && location.hash === "#" + name) {
      history.replaceState(null, "", "#" + target);
    }
    return target;
  };

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
    veil.classList.add("on");
    AudioEngine.whoosh();
    setTimeout(() => {
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
      setTimeout(() => {
        const title = next.querySelector(".sec-title, .ninth-rule, .dead-title");
        if (title) {
          title.setAttribute("tabindex", "-1");
          title.focus({ preventScroll: true });
        }
      }, reduced ? 50 : 180);
      setTimeout(() => {
        veil.classList.remove("on");
        veilBusy = false;
      }, 80);
    }, reduced ? 60 : 480);
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
  };

  const tryScheduleThreshold = () => {
    if (thresholdConsumed) return;
    AutoAdvance.schedule("threshold", "protocol", {
      before: () => { knocks = 0; thresholdConsumed = true; },
      onSchedule: () => toast("门在你身后合上了。"),
    });
  };

  const knock = () => {
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
        }
      }, 2600);
    }

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

  $$(".rules-list li").forEach((li) => {
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "button");
    const activate = () => {
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
      tryScheduleProtocol();
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

  $$(".frag").forEach((frag) => {
    frag.addEventListener("click", () => {
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
    if (watchConsumed || !watchUnlocked() || !line4Unlocked()) return;
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
    tryScheduleActing();
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

    if (!offeringConsumed) {
      AutoAdvance.schedule("offering", "reliquary", {
        before: () => { offeringConsumed = true; },
        onSchedule: () => toast("祷词已焚。神圣遗物科已接收。"),
      });
    }
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

      const record = $("#relic-record");
      const lines = record ? Array.from(record.querySelectorAll(".relic-line")) : [];
      if (record) record.setAttribute("aria-live", "polite");

      clearRelicTimers();
      if (reduced) {
        lines.forEach((l) => { l.hidden = false; l.classList.add("in"); });
        paintRelic();
        if (currentScene === "reliquary" && !reliquaryConsumed) {
          AutoAdvance.schedule("reliquary", "remembrance", {
            before: () => { reliquaryConsumed = true; },
            onSchedule: () => toast("遗物已封印。正在前往痕迹。"),
          });
        }
      } else {
        lines.forEach((l, i) => {
          const tid = setTimeout(() => {
            l.hidden = false;
            l.classList.add("in");
            AudioEngine.tick();
            if (i === lines.length - 1) {
              paintRelic();
              if (currentScene === "reliquary" && !reliquaryConsumed) {
                AutoAdvance.schedule("reliquary", "remembrance", {
                  before: () => { reliquaryConsumed = true; },
                  onSchedule: () => toast("遗物已封印。正在前往痕迹。"),
                });
              }
            }
          }, 150 + i * 150);
          relicTimers.push(tid);
        });
      }
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
      paintWatch();
      paintLine4();
      paintDeliver();
      paintCancel();
      paintActing();
      paintRelicMemory();

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
  revealScene(scenes.threshold);
  syncDoorOpenState();
  route();
});

console.log("%c GOD / DEAD ", "background:#8d2b27;color:#050505;font-family:serif;font-size:18px;letter-spacing:.3em");
console.log("%c 输入 goddead，唤醒门。", "color:#777169;font-family:monospace");
console.log("%c 输入 ↑↑↓↓←→←→BA，召回神迹。", "color:#777169;font-family:monospace");
console.log("%c 凝视经文三秒，它会出卖一句话。", "color:#777169;font-family:monospace");
console.log("%c 守则的条数，偶尔会数错。数错的时候点它。", "color:#777169;font-family:monospace");
