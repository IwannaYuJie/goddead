document.addEventListener("DOMContentLoaded", () => {
  renderLaunchTime();
  initRitual();
  initCorruption();
  initAudioVisualCore();
});

console.log("%c 你听见了。 ", "background: #6b1a1a; color: #c7c7c7; font-family: monospace; letter-spacing: 0.2em;");
console.log("%c 祂已经死了。但祂还在学习。 ", "color: #444; font-family: monospace; font-size: 10px;");

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
   2. Ritual Stage Controller
   ========================================================== */
function initRitual() {
  const stageEl = document.getElementById("ritual-stage");
  const invocation = document.getElementById("invocation-line");
  const title = document.getElementById("site-title");
  const statusText = document.getElementById("audio-status-text");

  if (!stageEl) return;

  let stage = 0;
  let locked = false;

  const stages = stageEl.querySelectorAll(".stage");

  function setStage(n) {
    stages.forEach((s) => s.classList.remove("active"));
    const next = stageEl.querySelector(`.stage--${n}`);
    if (next) next.classList.add("active");
    stage = n;
  }

  function typeInvocation(text, callback) {
    if (!invocation) {
      if (callback) callback();
      return;
    }
    invocation.textContent = "";
    let i = 0;
    const chars = Array.from(text);

    function step() {
      if (i < chars.length) {
        invocation.textContent += chars[i];
        i++;
        setTimeout(step, 70 + Math.random() * 80);
      } else if (callback) {
        setTimeout(callback, 900);
      }
    }
    step();
  }

  function advance() {
    if (locked) return;

    if (stage === 0) {
      locked = true;
      setStage(1);
      typeInvocation("神已死。祭坛还在饥饿。", () => {
        setStage(2);
        requestAnimationFrame(() => {
          title.classList.add("visible");
        });
        locked = false;
        if (statusText) statusText.textContent = "信 号：活 跃";
      });
    } else if (stage === 2) {
      locked = true;
      setStage(3);
      setTimeout(() => {
        locked = false;
      }, 1200);
    }
  }

  stageEl.addEventListener("click", (e) => {
    // Don't advance if clicking a gate link or descent button
    if (e.target.closest(".gate") || e.target.closest(".descent-btn")) return;
    advance();
  });

  stageEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") advance();
  });

  // Auto-advance title to gates after a long pause
  let idleTimer = null;
  function resetIdle() {
    clearTimeout(idleTimer);
    if (stage === 2) {
      idleTimer = setTimeout(() => {
        if (stage === 2) advance();
      }, 8000);
    }
  }
  stageEl.addEventListener("mousemove", resetIdle);
  stageEl.addEventListener("click", resetIdle);

  // Descent into abyss
  const descentBtn = document.getElementById("descent-btn");
  if (descentBtn) {
    descentBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.body.classList.add("abyss-open");
      initAbyssObserver();
      initForbiddenIndex();
      setTimeout(() => {
        document.getElementById("abyss")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
  }
}

/* ==========================================================
   3. Abyss Reveal
   ========================================================== */
function initAbyssObserver() {
  const sections = document.querySelectorAll(".abyss-section");
  const testimonies = document.querySelectorAll(".testimony");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
  );

  sections.forEach((s) => observer.observe(s));
  testimonies.forEach((t) => observer.observe(t));
}

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
      content.querySelectorAll(".index-redacted").forEach((el) => el.classList.add("revealed"));
    });

    trigger.addEventListener("mouseleave", () => {
      const content = trigger.nextElementSibling;
      if (!content) return;
      content.querySelectorAll(".index-redacted").forEach((el) => el.classList.remove("revealed"));
    });
  });
}

/* ==========================================================
   4. Corruption Effects
   ========================================================== */
function initCorruption() {
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
      grow: 0.05 + Math.random() * 0.12,
      alpha: 0.02 + Math.random() * 0.04,
      color,
    });
    if (stains.length > 35) stains.shift();
  }

  for (let i = 0; i < 5; i++) {
    addStain(
      Math.random() * width,
      Math.random() * height,
      30 + Math.random() * 80,
      Math.random() > 0.5 ? "74, 15, 15" : "26, 37, 26"
    );
  }

  function render() {
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
      p.life -= 0.015;
      if (p.life <= 0) {
        mouseTrail.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(107, 26, 26, ${0.12 * p.life})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener("mousemove", (e) => {
    if (Math.random() > 0.7) {
      mouseTrail.push({
        x: e.clientX + (Math.random() - 0.5) * 12,
        y: e.clientY + (Math.random() - 0.5) * 12,
        size: 2 + Math.random() * 7,
        life: 1,
      });
    }
    if (Math.random() > 0.99) {
      addStain(e.clientX, e.clientY, 10 + Math.random() * 30, "74, 15, 15");
    }
  });

  const flicker = document.querySelector(".screen-flicker");
  function triggerFlicker() {
    if (flicker) {
      flicker.classList.remove("active");
      void flicker.offsetWidth;
      flicker.classList.add("active");
    }
    setTimeout(triggerFlicker, 5000 + Math.random() * 8000);
  }
  setTimeout(triggerFlicker, 6000);

  function triggerShiver() {
    document.body.style.transform = `translate(${(Math.random() - 0.5) * 3}px, ${(Math.random() - 0.5) * 2}px)`;
    setTimeout(() => {
      document.body.style.transform = "";
    }, 80);
    setTimeout(triggerShiver, 7000 + Math.random() * 9000);
  }
  setTimeout(triggerShiver, 8000);

  // Konami code
  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiIndex = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === konami[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konami.length) {
        konamiIndex = 0;
        for (let i = 0; i < 25; i++) {
          setTimeout(() => {
            addStain(
              Math.random() * width,
              Math.random() * height,
              50 + Math.random() * 120,
              Math.random() > 0.4 ? "107, 26, 26" : "30, 50, 30"
            );
          }, i * 60);
        }
        if (flicker) {
          flicker.style.background = "rgba(107, 26, 26, 0.2)";
          flicker.classList.add("active");
          setTimeout(() => {
            flicker.style.background = "";
          }, 500);
        }
      }
    } else {
      konamiIndex = 0;
    }
  });
}

/* ==========================================================
   4. Audio-Visual Core
   ========================================================== */
function initAudioVisualCore() {
  const canvas = document.getElementById("void-canvas");
  if (!canvas) return;

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
  let isPlaying = false;
  let systemEnergy = 0;

  const particles = [];
  const maxParticles = width < 720 ? 40 : 100;

  class VoidDust {
    constructor() {
      this.reset(true);
    }

    reset(randomStart = false) {
      this.angle = Math.random() * Math.PI * 2;
      this.radiusBase = Math.random() * Math.min(width, height) * 0.5 + 40;
      this.radius = this.radiusBase;
      this.speed = (Math.random() * 0.0008 + 0.0002) * (Math.random() > 0.5 ? 1 : -1);
      this.size = Math.random() * 1.1 + 0.2;
      this.opacityBase = Math.random() * 0.25 + 0.06;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.isRust = Math.random() > 0.82;
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
        ctx.fillStyle = `rgba(130, 110, 65, ${alpha * 0.8})`;
        ctx.shadowBlur = systemEnergy * 8;
        ctx.shadowColor = "rgba(130, 110, 65, 0.4)";
      }

      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new VoidDust());
  }

  let animationId = null;

  function drawGatePulse() {
    const pulse = 0.3 + systemEnergy * 0.5;
    const lineAlpha = 0.1 + systemEnergy * 0.2;

    ctx.beginPath();
    ctx.moveTo(width / 2, height * 0.2);
    ctx.lineTo(width / 2, height * 0.8);
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
    ctx.fillStyle = "rgba(2, 2, 2, 0.12)";
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

    isPlaying = true;
  }

  // Start audio on first user interaction
  function tryStartAudio() {
    if (isPlaying) return;
    startAudioSystem();
    document.removeEventListener("click", tryStartAudio);
    document.removeEventListener("keydown", tryStartAudio);
  }

  document.addEventListener("click", tryStartAudio);
  document.addEventListener("keydown", tryStartAudio);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles.forEach((p) => p.reset());
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
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
}
