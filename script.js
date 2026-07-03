document.addEventListener("DOMContentLoaded", () => {
  renderLaunchTime();
  initRiteTyping();
  initTextScramble();
  initLectionary();
  initAudioVisualAndDoctrines();
});

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

  updated.textContent = `TRANSMISSION ${formatter.format(new Date())}`;
}

/* ==========================================================
   2. Rite Typing Effect
   ========================================================== */
function initRiteTyping() {
  const line = document.getElementById("rite-line");
  if (!line) return;

  const text = "THE GODS ARE GONE. THE ALTAR REMAINS.";
  let index = 0;

  function type() {
    if (index < text.length) {
      line.textContent += text[index];
      index++;
      setTimeout(type, 45 + Math.random() * 60);
    }
  }

  setTimeout(type, 600);
}

/* ==========================================================
   3. Text Scrambler
   ========================================================== */
const ABSENCE_POEMS = [
  "AFTER THE LAST AMEN, THE VOID BEGAN TO PRAY.",
  "NO GODS. ONLY GRAVITY AND GRIEF.",
  "THE SILENCE IS LOUDER THAN THE HYMN.",
  "WE BUILT AN ALTAR FROM UNANSWERED QUESTIONS.",
  "IN ABSENCE, MEANING BECOMES A SCULPTOR.",
  "EVERY FALLEN STAR IS A DEAD GOD'S EYE.",
  "PRAY NOT. LISTEN TO THE HUM OF NOTHING.",
  "THE DIVINE EXIT LEFT THE DOOR AJAR."
];

class TextScrambler {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 26);
      const end = start + Math.floor(Math.random() * 26);
      this.queue.push({ from, to, start, end, char: "" });
    }
    cancelAnimationFrame(this.frameId);
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
        output += `<span style="color: #c9a227;">${char}</span>`;
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
      nextIndex = Math.floor(Math.random() * ABSENCE_POEMS.length);
    } while (nextIndex === currentIndex);
    currentIndex = nextIndex;

    await scrambler.setText(ABSENCE_POEMS[currentIndex]);
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
   5. Audio-Visual Core
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
      const energyFactor = 1 + systemEnergy * 3;
      this.angle += this.speed * energyFactor;
      this.twinklePhase += this.twinkleSpeed * energyFactor;

      const targetRadius = this.radiusBase * (1 + systemEnergy * 0.5);
      this.radius += (targetRadius - this.radius) * this.damping;

      const targetX = width / 2 + Math.cos(this.angle) * this.radius;
      const targetY = height / 2 + Math.sin(this.angle) * this.radius;

      const shake = (Math.random() - 0.5) * systemEnergy * 10;

      this.x += (targetX - this.x) * this.damping + shake;
      this.y += (targetY - this.y) * this.damping + shake;

      if (this.x < -60 || this.x > width + 60 || this.y < -60 || this.y > height + 60) {
        this.reset();
      }
    }

    draw() {
      const twinkle = 0.65 + 0.35 * Math.sin(this.twinklePhase);
      const alpha = Math.min(1, this.opacityBase * twinkle * (1 + systemEnergy * 2.5));
      const size = this.size * (1 + systemEnergy * 0.7);

      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);

      if (this.isRust) {
        ctx.fillStyle = `rgba(180, 70, 70, ${alpha * 0.7})`;
        ctx.shadowBlur = systemEnergy * 6;
        ctx.shadowColor = "rgba(180, 50, 50, 0.5)";
      } else {
        ctx.fillStyle = `rgba(201, 162, 39, ${alpha})`;
        ctx.shadowBlur = systemEnergy * 8;
        ctx.shadowColor = "rgba(201, 162, 39, 0.5)";
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
    const lineAlpha = 0.08 + systemEnergy * 0.15;

    ctx.beginPath();
    ctx.moveTo(width / 2, height * 0.15);
    ctx.lineTo(width / 2, height * 0.85);
    ctx.strokeStyle = `rgba(201, 162, 39, ${lineAlpha})`;
    ctx.lineWidth = 1 + systemEnergy * 2;
    ctx.shadowBlur = 20 * pulse;
    ctx.shadowColor = "rgba(201, 162, 39, 0.4)";
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
    gradient.addColorStop(0, "rgba(90, 70, 40, 0.1)");
    gradient.addColorStop(0.5, `rgba(201, 162, 39, ${0.2 + systemEnergy * 0.5})`);
    gradient.addColorStop(1, "rgba(90, 70, 40, 0.1)");
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
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

    lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.05, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(40, audioCtx.currentTime);

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
    osc.frequency.setValueAtTime(600 + Math.random() * 1000, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.004, audioCtx.currentTime + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.07);

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
    mainGain.gain.exponentialRampToValueAtTime(0.06, now + 2.5);

    clickInterval = setInterval(() => {
      if (Math.random() > 0.35) {
        triggerClick();
      }
    }, 600);

    isPlaying = true;
    if (audioStatusText) {
      audioStatusText.textContent = "SIGNAL: ACTIVE";
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
