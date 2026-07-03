document.addEventListener("DOMContentLoaded", () => {
  renderLaunchTime();
  initRiteTyping();
  initTextScramble();
  initLectionary();
  initForbiddenIndex();
  initRandomGlitch();
  initCorruptionAndEasterEggs();
  initAudioVisualAndDoctrines();
});

console.log("%c 你听见了。 ", "background: #6b1a1a; color: #c7c7c7; font-family: monospace; letter-spacing: 0.2em;");
console.log("%c 有些入口不在页面上。试试敲击墙壁。 ", "color: #555; font-family: monospace; font-size: 10px;");

/* ==========================================================
   1. Launch Time
   ========================================================== */
function renderLaunchTime() {
  const updated = document.querySelector("[data-updated]");
  if (!updated) return;

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  updated.textContent = `传输时间 ${formatter.format(new Date())}`;
}

/* ==========================================================
   2. Rite Typing Effect
   ========================================================== */
function initRiteTyping() {
  const line = document.getElementById("rite-line");
  if (!line) return;

  const text = "神已经离开。祭坛还在饥饿。";
  let index = 0;

  function type() {
    if (index < text.length) {
      line.textContent += text[index];
      index++;
      setTimeout(type, 60 + Math.random() * 90);
    }
  }

  setTimeout(type, 600);
}

/* ==========================================================
   3. Text Reveal (Chinese)
   ========================================================== */
const ABSENCE_POEMS = [
  "最后的阿门之后，虚空开始祈祷。",
  "没有神。只有引力与悲伤。",
  "寂静比赞美诗更响亮。",
  "我们用未获回答的问题搭建祭坛。",
  "在缺席中，意义成了一位雕塑家。",
  "每一颗坠落的星，都是一位死去的神的眼睛。",
  "不要祈祷。去听虚无的嗡鸣。",
  "神圣的退场，让门保持半开。"
];

class TextRevealer {
  constructor(el) {
    this.el = el;
  }

  setText(newText) {
    return new Promise((resolve) => {
      this.el.style.filter = "blur(6px)";
      this.el.style.opacity = "0.4";

      setTimeout(() => {
        this.el.innerHTML = "";
        this.el.style.filter = "blur(0)";
        this.el.style.opacity = "1";

        let i = 0;
        const chars = Array.from(newText);

        const reveal = () => {
          if (i < chars.length) {
            const span = document.createElement("span");
            span.textContent = chars[i];
            span.style.opacity = "0";
            span.style.transition = "opacity 0.15s ease";
            if (Math.random() > 0.85) {
              span.style.color = "#6b1a1a";
            }
            this.el.appendChild(span);
            requestAnimationFrame(() => {
              span.style.opacity = "1";
            });
            i++;
            setTimeout(reveal, 35 + Math.random() * 55);
          } else {
            resolve();
          }
        };

        reveal();
      }, 300);
    });
  }
}

function initTextScramble() {
  const box = document.getElementById("scramble-box");
  if (!box) return;

  const revealer = new TextRevealer(box);
  let currentIndex = 0;
  let animating = false;

  async function triggerNext() {
    if (animating) return;
    animating = true;

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * ABSENCE_POEMS.length);
    } while (nextIndex === currentIndex);
    currentIndex = nextIndex;

    await revealer.setText(ABSENCE_POEMS[currentIndex]);
    animating = false;
  }

  box.addEventListener("click", triggerNext);
  box.addEventListener("mouseenter", triggerNext);
}

/* ==========================================================
   4. Lectionary Tabs
   ========================================================== */
function initLectionary() {
  const tabs = document.querySelectorAll(".lectionary-tab");
  const texts = document.querySelectorAll(".lectionary-text");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const index = tab.dataset.index;

      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      texts.forEach((text) => text.classList.remove("active"));

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const target = document.querySelector(`.lectionary-text[data-index="${index}"]`);
      if (target) target.classList.add("active");
    });
  });
}

/* ==========================================================
   5. Forbidden Index
   ========================================================== */
function initForbiddenIndex() {
  const triggers = document.querySelectorAll(".index-trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
    });

    trigger.addEventListener("mouseenter", () => {
      const content = trigger.nextElementSibling;
      if (!content) return;
      const redacted = content.querySelectorAll(".index-redacted");
      redacted.forEach((el) => el.classList.add("revealed"));
    });

    trigger.addEventListener("mouseleave", () => {
      const content = trigger.nextElementSibling;
      if (!content) return;
      const redacted = content.querySelectorAll(".index-redacted");
      redacted.forEach((el) => el.classList.remove("revealed"));
    });
  });
}

/* ==========================================================
   6. Random Glitch
   ========================================================== */
function initRandomGlitch() {
  const targets = document.querySelectorAll(
    ".doctrine-text h2, .doctrine-text p, .chronicle-node p, .litany-line, .section-subtitle"
  );
  if (targets.length === 0) return;

  function glitch() {
    const el = targets[Math.floor(Math.random() * targets.length)];
    const originalTransform = el.style.transform;
    const originalColor = el.style.color;
    const dx = (Math.random() - 0.5) * 4;
    const dy = (Math.random() - 0.5) * 2;

    el.style.transform = `translate(${dx}px, ${dy}px) skewX(${(Math.random() - 0.5) * 2}deg)`;
    el.style.color = Math.random() > 0.5 ? "#6b1a1a" : "";

    setTimeout(() => {
      el.style.transform = originalTransform;
      el.style.color = originalColor;
    }, 60 + Math.random() * 80);

    setTimeout(glitch, 800 + Math.random() * 2500);
  }

  setTimeout(glitch, 3000);
}

/* ==========================================================
   7. Corruption & Easter Eggs
   ========================================================== */
function initCorruptionAndEasterEggs() {
  const canvas = document.getElementById("corruption-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const stains = [];
  const mouseTrail = [];

  function addStain(x, y, size, color) {
    stains.push({
      x,
      y,
      r: size,
      maxR: size * (2 + Math.random() * 2),
      grow: 0.05 + Math.random() * 0.15,
      alpha: 0.03 + Math.random() * 0.05,
      color,
    });
    if (stains.length > 40) stains.shift();
  }

  for (let i = 0; i < 6; i++) {
    addStain(
      Math.random() * width,
      Math.random() * height,
      20 + Math.random() * 60,
      Math.random() > 0.5 ? "74, 15, 15" : "26, 37, 26"
    );
  }

  function renderCorruption() {
    ctx.clearRect(0, 0, width, height);

    stains.forEach((s) => {
      if (s.r < s.maxR) s.r += s.grow;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      g.addColorStop(0, `rgba(${s.color}, ${s.alpha})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = mouseTrail.length - 1; i >= 0; i--) {
      const p = mouseTrail[i];
      p.life -= 0.02;
      if (p.life <= 0) {
        mouseTrail.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(107, 26, 26, ${0.15 * p.life})`;
      ctx.fill();
    }

    requestAnimationFrame(renderCorruption);
  }
  renderCorruption();

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener("mousemove", (e) => {
    if (Math.random() > 0.75) {
      mouseTrail.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        size: 2 + Math.random() * 6,
        life: 1,
      });
    }
    if (Math.random() > 0.985) {
      addStain(e.clientX, e.clientY, 10 + Math.random() * 25, "74, 15, 15");
    }
  });

  // Random screen flicker
  const flicker = document.querySelector(".screen-flicker");
  function triggerFlicker() {
    if (flicker) {
      flicker.classList.remove("active");
      void flicker.offsetWidth;
      flicker.classList.add("active");
    }
    setTimeout(triggerFlicker, 4000 + Math.random() * 9000);
  }
  setTimeout(triggerFlicker, 5000);

  // Page shiver
  function triggerShiver() {
    document.body.style.transform = `translate(${(Math.random() - 0.5) * 3}px, ${(Math.random() - 0.5) * 2}px)`;
    setTimeout(() => {
      document.body.style.transform = "";
    }, 80);
    setTimeout(triggerShiver, 6000 + Math.random() * 10000);
  }
  setTimeout(triggerShiver, 7000);

  // Konami code easter egg
  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiIndex = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === konami[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konami.length) {
        konamiIndex = 0;
        triggerCorruptionBurst();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function triggerCorruptionBurst() {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        addStain(
          Math.random() * width,
          Math.random() * height,
          40 + Math.random() * 100,
          Math.random() > 0.4 ? "107, 26, 26" : "30, 50, 30"
        );
      }, i * 80);
    }
    if (flicker) {
      flicker.style.background = "rgba(107, 26, 26, 0.2)";
      flicker.classList.add("active");
      setTimeout(() => {
        flicker.style.background = "";
      }, 500);
    }

    // Reveal hidden portals hint
    const portals = document.querySelector(".hidden-portals");
    if (portals) {
      portals.style.opacity = "1";
      setTimeout(() => {
        portals.style.opacity = "";
      }, 4000);
    }
  }

  // Title click easter egg
  const title = document.getElementById("site-title");
  let titleClicks = 0;
  if (title) {
    title.addEventListener("click", () => {
      titleClicks++;
      if (titleClicks === 7) {
        title.style.filter = "blur(2px)";
        title.style.transform = "scale(1.02)";
        setTimeout(() => {
          title.style.filter = "";
          title.style.transform = "";
        }, 2000);
        triggerCorruptionBurst();
        titleClicks = 0;
      }
    });
  }
}

/* ==========================================================
   8. Audio-Visual Core
   ========================================================== */
function initAudioVisualAndDoctrines() {
  const overlay = document.getElementById("init-overlay");
  const initBtn = document.getElementById("init-btn");
  const canvas = document.getElementById("void-canvas");
  const audioStatusText = document.getElementById("audio-status-text");

  if (!canvas || !initBtn || !overlay) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let audioCtx = null;
  let mainGain = null;
  let analyser = null;
  let dataArray = null;
  let osc1 = null;
  let osc2 = null;
  let lfo = null;
  let filter = null;
  let clickInterval = null;
  let isPlaying = false;
  let systemEnergy = 0;

  const particles = [];
  const maxParticles = width < 720 ? 45 : 120;

  class VoidDust {
    constructor() {
      this.reset(true);
    }

    reset(randomStart = false) {
      this.angle = Math.random() * Math.PI * 2;
      this.radiusBase = Math.random() * Math.min(width, height) * 0.5 + 40;
      this.radius = this.radiusBase;
      this.speed = (Math.random() * 0.0008 + 0.0002) * (Math.random() > 0.5 ? 1 : -1);
      this.size = Math.random() * 1.2 + 0.2;
      this.opacityBase = Math.random() * 0.3 + 0.08;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.isRust = Math.random() > 0.85;
      this.damping = 0.04;

      if (randomStart) {
        this.x = width / 2 + Math.cos(this.angle) * this.radius;
        this.y = height / 2 + Math.sin(this.angle) * this.radius;
      } else {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }
    }

    update() {
      const energyFactor = 1 + systemEnergy * 4;
      this.angle += this.speed * energyFactor;
      this.twinklePhase += this.twinkleSpeed * energyFactor;

      const targetRadius = this.radiusBase * (1 + systemEnergy * 0.6);
      this.radius += (targetRadius - this.radius) * this.damping;

      const wobble = Math.sin(this.angle * 3 + this.twinklePhase) * (10 + systemEnergy * 20);
      const targetX = width / 2 + Math.cos(this.angle) * (this.radius + wobble);
      const targetY = height / 2 + Math.sin(this.angle) * (this.radius + wobble);

      const shake = (Math.random() - 0.5) * systemEnergy * 14;

      this.x += (targetX - this.x) * this.damping + shake;
      this.y += (targetY - this.y) * this.damping + shake;

      if (this.x < -80 || this.x > width + 80 || this.y < -80 || this.y > height + 80) {
        this.reset();
      }
    }

    draw() {
      const twinkle = 0.5 + 0.5 * Math.sin(this.twinklePhase);
      const alpha = Math.min(1, this.opacityBase * twinkle * (1 + systemEnergy * 3));
      const size = this.size * (1 + systemEnergy * 0.9);

      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);

      if (this.isRust) {
        ctx.fillStyle = `rgba(120, 30, 30, ${alpha * 0.8})`;
        ctx.shadowBlur = systemEnergy * 10;
        ctx.shadowColor = "rgba(120, 20, 20, 0.6)";
      } else {
        ctx.fillStyle = `rgba(140, 120, 70, ${alpha * 0.8})`;
        ctx.shadowBlur = systemEnergy * 8;
        ctx.shadowColor = "rgba(140, 120, 70, 0.4)";
      }

      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new VoidDust());
  }

  /* ----------------------------------------------------------
     Canvas loop
     ---------------------------------------------------------- */
  let animationId = null;

  function drawGatePulse() {
    const pulse = 0.3 + systemEnergy * 0.5;
    const lineAlpha = 0.1 + systemEnergy * 0.2;

    ctx.beginPath();
    ctx.moveTo(width / 2, height * 0.15);
    ctx.lineTo(width / 2, height * 0.85);
    ctx.strokeStyle = `rgba(107, 26, 26, ${lineAlpha})`;
    ctx.lineWidth = 1 + systemEnergy * 2;
    ctx.shadowBlur = 20 * pulse;
    ctx.shadowColor = "rgba(107, 26, 26, 0.5)";
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawSpectrum() {
    if (!isPlaying || !analyser) return;

    analyser.getByteFrequencyData(dataArray);

    const sliceWidth = width / 48;
    ctx.beginPath();
    ctx.lineWidth = 1.5;

    const gradient = ctx.createLinearGradient(0, height, width, height);
    gradient.addColorStop(0, "rgba(60, 30, 30, 0.15)");
    gradient.addColorStop(0.5, `rgba(107, 26, 26, ${0.25 + systemEnergy * 0.55})`);
    gradient.addColorStop(1, "rgba(60, 30, 30, 0.15)");
    ctx.strokeStyle = gradient;

    for (let i = 0; i <= 48; i++) {
      const index = Math.floor((i / 48) * (dataArray.length / 2));
      const value = dataArray[index] / 255;
      const bell = Math.sin((i / 48) * Math.PI);
      const amplitude = value * 100 * (1 + systemEnergy * 0.8) * bell;
      const x = i * sliceWidth;
      const y = height - amplitude;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = (i - 1) * sliceWidth;
        const prevIndex = Math.floor(((i - 1) / 48) * (dataArray.length / 2));
        const prevValue = dataArray[prevIndex] / 255;
        const prevBell = Math.sin(((i - 1) / 48) * Math.PI);
        const prevY = height - prevValue * 100 * (1 + systemEnergy * 0.8) * prevBell;
        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
      }
    }

    ctx.lineTo(width, height);
    ctx.stroke();
  }

  function renderVisuals() {
    ctx.fillStyle = "rgba(3, 3, 3, 0.12)";
    ctx.fillRect(0, 0, width, height);

    if (isPlaying && analyser) {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < 16; i++) {
        sum += dataArray[i];
      }
      const targetEnergy = sum / 16 / 255;
      systemEnergy += (targetEnergy - systemEnergy) * 0.12;
    } else {
      systemEnergy += (0 - systemEnergy) * 0.06;
    }

    drawGatePulse();

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    drawSpectrum();

    animationId = requestAnimationFrame(renderVisuals);
  }

  /* ----------------------------------------------------------
     Audio engine
     ---------------------------------------------------------- */
  function createAudioEngine() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, audioCtx.currentTime);
    filter.Q.setValueAtTime(3.5, audioCtx.currentTime);

    osc1 = audioCtx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(41.2, audioCtx.currentTime);

    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(61.7, audioCtx.currentTime);

    lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.04, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(50, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function triggerClick() {
    if (!audioCtx || audioCtx.state === "suspended") return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    osc.type = "sine";
    osc.frequency.setValueAtTime(200 + Math.random() * 600, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.003, audioCtx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

    if (panner) {
      panner.pan.setValueAtTime((Math.random() - 0.5) * 2, audioCtx.currentTime);
      osc.connect(panner);
      panner.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }

  function startAudioSystem() {
    createAudioEngine();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    osc1.start(0);
    osc2.start(0);
    lfo.start(0);

    const now = audioCtx.currentTime;
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.05, now + 3);

    clickInterval = setInterval(() => {
      if (Math.random() > 0.35) {
        triggerClick();
      }
    }, 600);

    isPlaying = true;
    if (audioStatusText) {
      audioStatusText.textContent = "信 号：活 跃";
    }
  }

  initBtn.addEventListener("click", () => {
    startAudioSystem();
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 1400);
  });

  /* ----------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------- */
  const doctrines = document.querySelectorAll(".doctrine");
  const finalLitany = document.querySelector(".final-litany");
  const lectionaryBody = document.querySelector(".lectionary-body");
  const chronicleNodes = document.querySelectorAll(".chronicle-node");
  const apocryphaCards = document.querySelectorAll(".apocrypha-card");
  const indexList = document.querySelector(".index-list");
  const mapGrid = document.querySelector(".map-grid");
  const mapRegions = document.querySelectorAll(".map-region");
  const testimonyList = document.querySelector(".testimony-list");
  const testimonies = document.querySelectorAll(".testimony");
  const nameGrid = document.querySelector(".name-grid");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let countersAnimated = false;

  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const startValue = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (target - startValue) * eased);
      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function handleScroll() {
    const windowHeight = window.innerHeight;

    doctrines.forEach((doc) => {
      const rect = doc.getBoundingClientRect();
      if (rect.top < windowHeight * 0.82) {
        doc.classList.add("visible");
      }
    });

    if (lectionaryBody) {
      const rect = lectionaryBody.getBoundingClientRect();
      if (rect.top < windowHeight * 0.82) {
        lectionaryBody.classList.add("visible");
      }
    }

    chronicleNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top < windowHeight * 0.85) {
        node.classList.add("visible");
      }
    });

    apocryphaCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < windowHeight * 0.82) {
        card.classList.add("visible");
      }
    });

    if (finalLitany) {
      const rect = finalLitany.getBoundingClientRect();
      if (rect.top < windowHeight * 0.85) {
        finalLitany.classList.add("visible");
      }
    }

    if (indexList) {
      const rect = indexList.getBoundingClientRect();
      if (rect.top < windowHeight * 0.82) {
        indexList.classList.add("visible");
      }
    }

    if (mapGrid) {
      const rect = mapGrid.getBoundingClientRect();
      if (rect.top < windowHeight * 0.82) {
        mapGrid.classList.add("visible");
      }
    }

    mapRegions.forEach((region) => {
      const rect = region.getBoundingClientRect();
      if (rect.top < windowHeight * 0.85) {
        region.classList.add("visible");
      }
    });

    if (testimonyList) {
      const rect = testimonyList.getBoundingClientRect();
      if (rect.top < windowHeight * 0.82) {
        testimonyList.classList.add("visible");
      }
    }

    testimonies.forEach((t) => {
      const rect = t.getBoundingClientRect();
      if (rect.top < windowHeight * 0.88) {
        t.classList.add("visible");
      }
    });

    if (nameGrid) {
      const rect = nameGrid.getBoundingClientRect();
      if (rect.top < windowHeight * 0.82) {
        nameGrid.classList.add("visible");
      }
    }

    // Animate counters once when Apocrypha becomes visible
    if (!countersAnimated && apocryphaCards.length > 0) {
      const firstCardRect = apocryphaCards[0].getBoundingClientRect();
      if (firstCardRect.top < windowHeight * 0.82) {
        countersAnimated = true;
        document.querySelectorAll(".apocrypha-number").forEach((num) => {
          const target = parseInt(num.dataset.target, 10);
          animateCounter(num, target, 2200);
        });
      }
    }
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles.forEach((p) => p.reset());
    handleScroll();
  });

  if (!prefersReduced.matches) {
    renderVisuals();
  }

  prefersReduced.addEventListener("change", (e) => {
    if (e.matches) {
      if (animationId) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
    } else {
      renderVisuals();
    }
  });

  setTimeout(handleScroll, 100);
}
