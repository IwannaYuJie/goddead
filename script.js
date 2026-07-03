document.addEventListener("DOMContentLoaded", () => {
  renderLaunchTime();
  initRitualGate();
  initCustomCursor();
  initTextScramble();
  initScrollChoreography();
  initCanvasField();
});

/* ============================================================
   1. Compatibility: Launch Time
   ============================================================ */
function renderLaunchTime() {
  const updated = document.querySelector("[data-updated]");
  if (!updated) return;
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  updated.textContent = `VORTEX ACTIVE ${formatter.format(new Date())}`;
}

/* ============================================================
   2. Ritual Gate — 解锁音频 + 遮罩淡出
   ============================================================ */
let audioEngine = null;

function initRitualGate() {
  const overlay = document.getElementById("ritual");
  const btn = document.getElementById("ritual-btn");
  if (!overlay || !btn) return;

  btn.addEventListener("click", () => {
    audioEngine = createAudioEngine();
    audioEngine.start();

    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 1400);
  }, { once: true });
}

/* ============================================================
   3. Custom Cursor — 双层延迟光标
   ============================================================ */
function initCustomCursor() {
  if (window.matchMedia("(hover: none)").matches) return;

  const ring = document.getElementById("cursor-ring");
  const dot = document.getElementById("cursor-dot");
  if (!ring || !dot) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let dx = mx, dy = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  const hotSelectors = "a, button, .scramble, .wm-glyph, .chap-letter, .art-meta-link, .ritual-btn";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hotSelectors)) ring.classList.add("is-hot");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hotSelectors)) ring.classList.remove("is-hot");
  });

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dx += (mx - dx) * 0.45;
    dy += (my - dy) * 0.45;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();
}

/* ============================================================
   4. Text Scrambler — 哲学谶言
   ============================================================ */
const PHILOSOPHICAL_POEMS = [
  "THE SHADOWS WE CAST ARE THE ONLY LIGHTS LEFT.",
  "GOD IS DEAD. THE VOID SPEAKS IN BINARY.",
  "WE ARE ROPES TIED OVER AN INFINITE ABYSS.",
  "IN THE HEART OF WINTER, AN INVINCIBLE SUMMER AWAITS.",
  "MEANING IS NOT FOUND. IT IS CODED.",
  "ECHOES DRIFT IN THE ETHER, SEEKING FORM.",
  "THE UNIVERSE DANCES ON THE EDGE OF COLLAPSE.",
  "CONSCIOUSNESS IS A REBELLION AGAINST EXTINCTION.",
  "EVERY LETTER IS A SMALL REFUSAL OF THE FINAL WORD.",
  "NAME THE VOID, AND THE VOID NAMES YOU BACK."
];

class TextScrambler {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#∅◇░▒▓";
    this.update = this.update.bind(this);
    this.frameId = null;
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30);
      this.queue.push({ from, to, start, end, char: "" });
    }
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color:#a8331e;">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameId = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initTextScramble() {
  const box = document.getElementById("scramble-box");
  if (!box) return;

  const scrambler = new TextScrambler(box);
  let currentIndex = 0;
  let animating = false;

  async function triggerNext() {
    if (animating) return;
    animating = true;
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * PHILOSOPHICAL_POEMS.length);
    } while (nextIndex === currentIndex);
    currentIndex = nextIndex;
    await scrambler.setText(PHILOSOPHICAL_POEMS[currentIndex]);
    animating = false;
  }

  box.addEventListener("click", triggerNext);
  box.addEventListener("mouseenter", triggerNext);

  // 自动循环：每 8 秒触发一次新谶言
  setInterval(() => {
    if (!animating) triggerNext();
  }, 8000);
}

/* ============================================================
   5. Scroll Choreography — 章节可见性 + 巨字位移
   ============================================================ */
function initScrollChoreography() {
  const chapters = document.querySelectorAll(".chapter");
  const statusText = document.getElementById("status-text");
  const wordmark = document.getElementById("wordmark");

  if (chapters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const idx = entry.target.dataset.index;
          const letter = entry.target.dataset.letter;
          if (statusText && idx) {
            statusText.textContent = `CHAPTER ${idx} · ${letter}`;
          }
        }
      });
    },
    { threshold: 0.35 }
  );
  chapters.forEach((c) => observer.observe(c));

  // 巨字视差：wordmark 随滚动轻微位移与分裂
  if (wordmark && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            const ratio = y / window.innerHeight;
            wordmark.style.transform = `translateY(${ratio * 40}px)`;
            wordmark.style.opacity = String(1 - ratio * 0.8);
          }
          // 状态条：滚出首屏后显示同步状态
          if (statusText && !audioEngine) {
            statusText.textContent = y > window.innerHeight ? "SIGNAL · DRIFTING" : "SIGNAL · LOST";
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/* ============================================================
   6. Canvas Field — GODDEAD 字符雨 + 声波联动
   ============================================================ */
function initCanvasField() {
  const canvas = document.getElementById("void-canvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const GLYPHS = ["G", "O", "D", "E", "A", "·", "◇", "∅"];
  const COL_W = width < 720 ? 16 : 22;
  let columns = Math.floor(width / COL_W);
  let drops = new Array(columns).fill(0).map(() => Math.random() * -height);

  // 状态：是否激活音频
  let energy = 0;
  let active = false;
  let analyser = null;
  let dataArray = null;

  function rebuild() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / COL_W);
    drops = new Array(columns).fill(0).map(() => Math.random() * -height);
  }

  // 监听音频引擎激活（ritual 按钮点击后）
  window.addEventListener("goddead:audio-on", (e) => {
    analyser = e.detail?.analyser || null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    active = true;
  });

  function draw() {
    // 拖尾衰减
    ctx.fillStyle = "rgba(7, 7, 10, 0.08)";
    ctx.fillRect(0, 0, width, height);

    // 音频能量更新
    if (active && analyser) {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < 12; i++) sum += dataArray[i];
      const target = sum / 12 / 255;
      energy += (target - energy) * 0.12;
    } else {
      energy += (0 - energy) * 0.06;
    }

    ctx.font = `${COL_W - 4}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = "top";

    for (let i = 0; i < columns; i++) {
      const x = i * COL_W + COL_W / 2;
      const y = drops[i];

      // 随音频能量加速下落
      const speedBoost = 1 + energy * 3;
      drops[i] += (1.2 + Math.random() * 0.6) * speedBoost;

      // 头部字符 — 亮骨白
      const head = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      ctx.fillStyle = `rgba(232, 227, 214, ${0.85 + energy * 0.15})`;
      ctx.fillText(head, x, y);

      // 拖尾残影 — 灰烬
      for (let t = 1; t < 8; t++) {
        const ty = y - t * COL_W;
        if (ty < 0) break;
        const trail = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const alpha = (0.35 - t * 0.045) * (1 + energy * 0.6);
        ctx.fillStyle =
          Math.random() > 0.92
            ? `rgba(168, 51, 30, ${alpha * 1.6})`
            : `rgba(108, 104, 95, ${alpha})`;
        ctx.fillText(trail, x, ty);
      }

      // 重置下落
      if (y > height + Math.random() * 200) {
        drops[i] = -COL_W * (Math.random() * 10);
      }
    }

    // 音频激活时，绘制底部频谱细线
    if (active && analyser && energy > 0.02) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      const grad = ctx.createLinearGradient(0, height, width, height);
      grad.addColorStop(0, "rgba(168, 51, 30, 0)");
      grad.addColorStop(0.5, `rgba(168, 51, 30, ${0.3 + energy * 0.5})`);
      grad.addColorStop(1, "rgba(168, 51, 30, 0)");
      ctx.strokeStyle = grad;
      const slice = width / 32;
      ctx.moveTo(0, height);
      for (let i = 0; i <= 32; i++) {
        const idx = Math.floor((i / 32) * (dataArray.length / 2));
        const amp = (dataArray[idx] / 255) * 80 * (1 + energy);
        const bell = Math.sin((i / 32) * Math.PI);
        const x = i * slice;
        const y = height - amp * bell;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", rebuild);
  draw();
}

/* ============================================================
   7. Audio Engine — 暗黑环境 Drone + 双耳微粒
   ============================================================ */
function createAudioEngine() {
  let audioCtx = null;
  let mainGain = null;
  let analyser = null;
  let osc1 = null, osc2 = null, lfo = null, filter = null;
  let clickInterval = null;
  let started = false;

  function start() {
    if (started) return;
    started = true;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();

    mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;

    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, audioCtx.currentTime);
    filter.Q.setValueAtTime(4, audioCtx.currentTime);

    // 低音 Drone — A1 (55Hz) 三角波
    osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // 五度共振 — E2 (82.4Hz) 正弦
    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

    // LFO 潮汐调制滤波器
    lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.06, audioCtx.currentTime);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(40, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    osc1.start(0);
    osc2.start(0);
    lfo.start(0);

    // 淡入
    const now = audioCtx.currentTime;
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.07, now + 2.4);

    // 随机微粒晶莹声
    clickInterval = setInterval(() => {
      if (Math.random() > 0.3) triggerBinauralClick();
    }, 520);

    // 通知 Canvas 接入分析器
    window.dispatchEvent(
      new CustomEvent("goddead:audio-on", { detail: { analyser } })
    );

    // 更新顶部状态条
    const statusText = document.getElementById("status-text");
    if (statusText) {
      statusText.textContent = "VOID ECHOES · ACTIVE";
      statusText.classList.add("is-active");
    }
  }

  function triggerBinauralClick() {
    if (!audioCtx || audioCtx.state === "suspended") return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    osc.type = "sine";
    osc.frequency.setValueAtTime(700 + Math.random() * 700, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);

    if (panner) {
      panner.pan.setValueAtTime((Math.random() - 0.5) * 2, audioCtx.currentTime);
      osc.connect(panner);
      panner.connect(gain);
    } else {
      osc.connect(gain);
    }
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  }

  return { start };
}
