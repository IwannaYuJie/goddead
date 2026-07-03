document.addEventListener("DOMContentLoaded", () => {
  renderLaunchTime();
  initTextScramble();
  initAudioVisualAndGallery();
});

/* ==========================================================
   1. Compatibility: Launch Time
   ========================================================== */
function renderLaunchTime() {
  const updated = document.querySelector("[data-updated]");
  if (!updated) return;

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  updated.textContent = `VORTEX ACTIVE ${formatter.format(new Date())}`;
}

/* ==========================================================
   2. Interactive Text Scrambler
   ========================================================== */
const PHILOSOPHICAL_POEMS = [
  "THE SHADOWS WE CAST ARE THE ONLY LIGHTS LEFT.",
  "GOD IS DEAD. THE VOID SPEAKS IN BINARY.",
  "WE ARE ROPES TIED OVER AN INFINITE ABYSS.",
  "IN THE HEART OF WINTER, AN INVINCIBLE SUMMER AWAITS.",
  "MEANING IS NOT FOUND. IT IS CODED.",
  "ECHOES DRIFT IN THE ETHER, SEEKING FOR FORM.",
  "THE UNIVERSE DANCES ON THE EDGE OF COLLAPSE.",
  "CONSCIOUSNESS IS A REBELLION AGAINST EXTINCTION.",
  "WHEN THE GODS FALL, THE STARS LEARN TO WRITE."
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
      const start = Math.floor(Math.random() * 28);
      const end = start + Math.floor(Math.random() * 28);
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
      nextIndex = Math.floor(Math.random() * PHILOSOPHICAL_POEMS.length);
    } while (nextIndex === currentIndex);
    currentIndex = nextIndex;

    await scrambler.setText(PHILOSOPHICAL_POEMS[currentIndex]);
    animating = false;
  }

  box.addEventListener("click", triggerNext);
  box.addEventListener("mouseenter", triggerNext);
}

/* ==========================================================
   3. Audio-Visual Reactive Core
   ========================================================== */
function initAudioVisualAndGallery() {
  const overlay = document.getElementById("init-overlay");
  const initBtn = document.getElementById("init-btn");
  const canvas = document.getElementById("void-canvas");
  const audioStatusText = document.getElementById("audio-status-text");

  if (!canvas || !initBtn || !overlay) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Audio nodes
  let audioCtx = null;
  let mainGain = null;
  let analyser = null;
  let dataArray = null;
  let osc1 = null;
  let osc2 = null;
  let osc3 = null;
  let lfo = null;
  let filter = null;
  let clickInterval = null;
  let isPlaying = false;
  let systemEnergy = 0;

  // Mouse state
  const mouse = { x: width / 2, y: height / 2, active: false };

  // Particle system
  const particles = [];
  const maxParticles = width < 720 ? 55 : 150;

  class DustParticle {
    constructor() {
      this.reset(true);
    }

    reset(randomStart = false) {
      this.angle = Math.random() * Math.PI * 2;
      this.radiusBase = Math.random() * Math.min(width, height) * 0.48 + 30;
      this.radius = this.radiusBase;
      this.speed = (Math.random() * 0.001 + 0.0002) * (Math.random() > 0.5 ? 1 : -1);
      this.size = Math.random() * 1.4 + 0.3;
      this.opacityBase = Math.random() * 0.35 + 0.12;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.colorType = Math.random() > 0.62 ? "gold" : "white";
      this.damping = 0.05;

      if (randomStart) {
        this.x = width / 2 + Math.cos(this.angle) * this.radius;
        this.y = height / 2 + Math.sin(this.angle) * this.radius;
      } else {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }
    }

    update() {
      const energyFactor = 1 + systemEnergy * 2.5;
      this.angle += this.speed * energyFactor;

      const targetRadius = this.radiusBase * (1 + systemEnergy * 0.4);
      this.radius += (targetRadius - this.radius) * this.damping;

      const centerX = width / 2;
      const centerY = height / 2;

      const targetX = centerX + Math.cos(this.angle) * this.radius;
      const targetY = centerY + Math.sin(this.angle) * this.radius;

      // Mouse influence: gentle pull toward cursor
      let mousePullX = 0;
      let mousePullY = 0;
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        const force = (Math.min(width, height) * 0.15) / dist;
        mousePullX = dx * force * 0.002;
        mousePullY = dy * force * 0.002;
      }

      // Energy shake
      const shake = (Math.random() - 0.5) * systemEnergy * 8;

      this.x += (targetX - this.x) * this.damping + mousePullX + shake;
      this.y += (targetY - this.y) * this.damping + mousePullY + shake;

      this.twinklePhase += this.twinkleSpeed * energyFactor;

      if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
        this.reset();
      }
    }

    draw() {
      const twinkle = 0.7 + 0.3 * Math.sin(this.twinklePhase);
      const alpha = Math.min(1, this.opacityBase * twinkle * (1 + systemEnergy * 2));
      const size = this.size * (1 + systemEnergy * 0.5);

      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);

      if (this.colorType === "gold") {
        ctx.fillStyle = `rgba(201, 162, 39, ${alpha})`;
        ctx.shadowBlur = systemEnergy * 8;
        ctx.shadowColor = "rgba(201, 162, 39, 0.6)";
      } else {
        ctx.fillStyle = `rgba(214, 214, 214, ${alpha * 0.55})`;
        ctx.shadowBlur = systemEnergy * 4;
        ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new DustParticle());
  }

  /* ----------------------------------------------------------
     Canvas render loop
     ---------------------------------------------------------- */
  let animationId = null;

  function drawVoidRing() {
    const ringRadius = Math.min(width, height) * 0.28 * (1 + systemEnergy * 0.2);
    const ringAlpha = 0.04 + systemEnergy * 0.12;

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(201, 162, 39, ${ringAlpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, ringRadius * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(201, 162, 39, ${ringAlpha * 0.5})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function drawSpectrum() {
    if (!isPlaying || !analyser) return;

    analyser.getByteFrequencyData(dataArray);

    const sliceWidth = width / 64;
    ctx.beginPath();
    ctx.lineWidth = 1.5;

    const gradient = ctx.createLinearGradient(0, height, width, height);
    gradient.addColorStop(0, "rgba(92, 74, 46, 0.15)");
    gradient.addColorStop(0.5, `rgba(201, 162, 39, ${0.2 + systemEnergy * 0.5})`);
    gradient.addColorStop(1, "rgba(92, 74, 46, 0.15)");
    ctx.strokeStyle = gradient;

    for (let i = 0; i <= 64; i++) {
      const index = Math.floor((i / 64) * (dataArray.length / 2));
      const value = dataArray[index] / 255;
      const bell = Math.sin((i / 64) * Math.PI);
      const amplitude = value * 140 * (1 + systemEnergy * 0.6) * bell;
      const x = i * sliceWidth;
      const y = height - amplitude;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = (i - 1) * sliceWidth;
        const prevIndex = Math.floor(((i - 1) / 64) * (dataArray.length / 2));
        const prevValue = dataArray[prevIndex] / 255;
        const prevBell = Math.sin(((i - 1) / 64) * Math.PI);
        const prevY = height - prevValue * 140 * (1 + systemEnergy * 0.6) * prevBell;
        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
      }
    }

    ctx.lineTo(width, height);
    ctx.stroke();

    // Fill below the spectrum
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = `rgba(201, 162, 39, ${0.02 + systemEnergy * 0.04})`;
    ctx.fill();
  }

  function renderVisuals() {
    // Heavy trail for ethereal motion
    ctx.fillStyle = "rgba(2, 2, 2, 0.1)";
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

    drawVoidRing();

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    drawSpectrum();

    animationId = requestAnimationFrame(renderVisuals);
  }

  /* ----------------------------------------------------------
     Web Audio engine
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
    filter.frequency.setValueAtTime(120, audioCtx.currentTime);
    filter.Q.setValueAtTime(3.2, audioCtx.currentTime);

    // Deep drone A1
    osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // Harmonic E2
    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

    // Ethereal upper partial A2
    osc3 = audioCtx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(110, audioCtx.currentTime);
    const osc3Gain = audioCtx.createGain();
    osc3Gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);

    // LFO tidal modulation
    lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.04, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(35, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function triggerBinauralClick() {
    if (!audioCtx || audioCtx.state === "suspended") return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    osc.type = "sine";
    osc.frequency.setValueAtTime(700 + Math.random() * 900, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);

    if (panner) {
      panner.pan.setValueAtTime((Math.random() - 0.5) * 2, audioCtx.currentTime);
      osc.connect(panner);
      panner.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.07);
  }

  function startAudioSystem() {
    createAudioEngine();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    osc1.start(0);
    osc2.start(0);
    osc3.start(0);
    lfo.start(0);

    const now = audioCtx.currentTime;
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.07, now + 2.5);

    clickInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerBinauralClick();
      }
    }, 520);

    isPlaying = true;
    if (audioStatusText) {
      audioStatusText.textContent = "VOID ECHOES: ACTIVE";
    }
  }

  initBtn.addEventListener("click", () => {
    startAudioSystem();
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 1600);
  });

  /* ----------------------------------------------------------
     Scroll reveal + parallax
     ---------------------------------------------------------- */
  const relicCards = document.querySelectorAll(".relic-card");
  const relicImages = document.querySelectorAll(".relic-image");
  const closingPsalm = document.querySelector(".closing-psalm");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function handleScroll() {
    const windowHeight = window.innerHeight;

    relicCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < windowHeight * 0.8) {
        card.classList.add("visible");
      }
    });

    if (closingPsalm) {
      const rect = closingPsalm.getBoundingClientRect();
      if (rect.top < windowHeight * 0.82) {
        closingPsalm.classList.add("visible");
      }
    }

    if (!prefersReduced.matches) {
      relicImages.forEach((img) => {
        const wrap = img.parentElement;
        const rect = wrap.getBoundingClientRect();
        const visibleCenter = rect.top + rect.height / 2;
        const windowCenter = windowHeight / 2;
        const offsetRatio = (visibleCenter - windowCenter) / (windowHeight / 2);
        const drift = -10 + offsetRatio * 6;
        img.style.transform = `translate3d(0, ${drift}%, 0) scale(1.04)`;
      });
    }
  }

  /* ----------------------------------------------------------
     Mouse parallax for title letters
     ---------------------------------------------------------- */
  const letters = document.querySelectorAll(".monument-letter");

  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    if (prefersReduced.matches) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const offsetX = (e.clientX - centerX) / centerX;
    const offsetY = (e.clientY - centerY) / centerY;

    letters.forEach((letter, index) => {
      const depth = (index - 3) * 0.4;
      const moveX = offsetX * depth * -6;
      const moveY = offsetY * depth * -4;
      letter.style.setProperty("--px", `${moveX}px`);
      letter.style.setProperty("--py", `${moveY}px`);
    });
  }

  function resetMouse() {
    mouse.active = false;
    letters.forEach((letter) => {
      letter.style.setProperty("--px", "0px");
      letter.style.setProperty("--py", "0px");
    });
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles.forEach((p) => p.reset());
    handleScroll();
  });
  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  window.addEventListener("mouseleave", resetMouse);

  if (!prefersReduced.matches) {
    renderVisuals();
  }

  prefersReduced.addEventListener("change", (e) => {
    if (e.matches) {
      if (animationId) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
      resetMouse();
    } else {
      renderVisuals();
    }
  });

  setTimeout(handleScroll, 100);
}
