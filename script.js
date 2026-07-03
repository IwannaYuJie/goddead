document.addEventListener("DOMContentLoaded", () => {
  // 1. 初始化更新时间以兼容原有测试
  renderLaunchTime();
  
  // 2. 初始化以太谶言文本重组
  initTextScramble();
  
  // 3. 初始化音画联动核心与画廊视差
  initAudioVisualAndGallery();
});

/* ==========================================
   1. Compatibility: Launch Time
   ========================================== */
function renderLaunchTime() {
  const updated = document.querySelector("[data-updated]");
  if (!updated) return;

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  updated.textContent = `VORTEX ACTIVE ${formatter.format(new Date())}`;
}

/* ==========================================
   2. Interactive Text Scrambler
   ========================================== */
const PHILOSOPHICAL_POEMS = [
  "THE SHADOWS WE CAST ARE THE ONLY LIGHTS LEFT.",
  "GOD IS DEAD. THE VOID SPEAKS IN BINARY.",
  "WE ARE ROPES TIED OVER AN INFINITE ABYSS.",
  "IN THE HEART OF WINTER, AN INVINCIBLE SUMMER AWAITS.",
  "MEANING IS NOT FOUND. IT IS CODED.",
  "ECHOES DRIFT IN THE ETHER, SEEKING FOR FORM.",
  "THE UNIVERSE DANCES ON THE EDGE OF COLLAPSE.",
  "CONSCIOUSNESS IS A REBELLION AGAINST EXTINCTION."
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
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30);
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
        output += `<span style="color: #b8975e;">${char}</span>`;
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

/* ==========================================
   3. Audio-Visual Reactive & Gallery Parallax
   ========================================== */
function initAudioVisualAndGallery() {
  const overlay = document.getElementById("init-overlay");
  const initBtn = document.getElementById("init-btn");
  const canvas = document.getElementById("void-canvas");
  const audioStatusText = document.getElementById("audio-status-text");

  if (!canvas || !initBtn || !overlay) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Audio Context Nodes
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

  // 粒子系统配置
  const particles = [];
  const maxParticles = width < 720 ? 50 : 130;

  class EmbersParticle {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      // 从底部或者随机坐标向上升腾的暗金余烬粒子
      this.angle = Math.random() * Math.PI * 2;
      this.radiusBase = Math.random() * Math.min(width, height) * 0.45 + 5;
      this.radius = this.radiusBase;
      this.speed = (Math.random() * 0.0012 + 0.0003) * (Math.random() > 0.5 ? 1 : -1);
      this.size = Math.random() * 1.6 + 0.4;
      
      this.opacityBase = Math.random() * 0.35 + 0.15;
      this.colorType = Math.random() > 0.5 ? 'gold' : 'white';
      
      this.x = width / 2 + Math.cos(this.angle) * this.radius;
      this.y = height / 2 + Math.sin(this.angle) * this.radius;
      this.damping = 0.06;
    }

    update() {
      // 随着音乐振幅（systemEnergy），加速旋转与膨胀
      this.angle += this.speed * (1 + systemEnergy * 2);
      
      // 声能越强，引力范围向外扩张
      const targetRadius = this.radiusBase * (1 + systemEnergy * 0.35);
      this.radius += (targetRadius - this.radius) * this.damping;

      const targetX = width / 2 + Math.cos(this.angle) * this.radius;
      const targetY = height / 2 + Math.sin(this.angle) * this.radius;

      // 声能强时粒子抖动（闪烁感）
      const shake = (Math.random() - 0.5) * systemEnergy * 10;

      this.x += (targetX - this.x) * this.damping + shake;
      this.y += (targetY - this.y) * this.damping + shake;

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      const alpha = Math.min(1, this.opacityBase * (1 + systemEnergy * 2.2));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (1 + systemEnergy * 0.6), 0, Math.PI * 2);
      ctx.fillStyle = this.colorType === 'gold' 
        ? `rgba(184, 151, 94, ${alpha})`
        : `rgba(236, 236, 236, ${alpha * 0.65})`;
      ctx.fill();
    }
  }

  // 粒子池填充
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new EmbersParticle());
  }

  /* ------------------------------------------
     Canvas 频域声波脉动与粒子群绘制
     ------------------------------------------ */
  let animationId = null;

  function renderVisuals() {
    ctx.fillStyle = "rgba(3, 3, 3, 0.08)";
    ctx.fillRect(0, 0, width, height);

    if (isPlaying && analyser) {
      analyser.getByteFrequencyData(dataArray);
      
      // 1. 计算声能平均值
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += dataArray[i];
      }
      const targetEnergy = sum / 12 / 255.0;
      systemEnergy += (targetEnergy - systemEnergy) * 0.16;

      // 2. 在底部绘制频域波形图
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      
      // 渐变金色线
      const gradientLine = ctx.createLinearGradient(0, height, width, height);
      gradientLine.addColorStop(0, "rgba(92, 74, 46, 0.2)");
      gradientLine.addColorStop(0.5, `rgba(184, 151, 94, ${0.15 + systemEnergy * 0.45})`);
      gradientLine.addColorStop(1, "rgba(92, 74, 46, 0.2)");
      ctx.strokeStyle = gradientLine;

      // 贝塞尔声波曲线绘制
      const sliceWidth = width / 32;
      ctx.moveTo(0, height);

      for (let i = 0; i <= 32; i++) {
        // 获取振幅数据做 Y 轴扰动，加上平滑过渡
        const index = Math.floor((i / 32) * (dataArray.length / 2));
        const amplitude = (dataArray[index] / 255.0) * 120 * (1 + systemEnergy * 0.5);
        const x = i * sliceWidth;
        // 中间高两边低
        const bellCurve = Math.sin((i / 32) * Math.PI);
        const y = height - amplitude * bellCurve;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = (i - 1) * sliceWidth;
          const prevIndex = Math.floor(((i - 1) / 32) * (dataArray.length / 2));
          const prevAmp = (dataArray[prevIndex] / 255.0) * 120 * (1 + systemEnergy * 0.5);
          const prevBell = Math.sin(((i - 1) / 32) * Math.PI);
          const prevY = height - prevAmp * prevBell;
          
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
        }
      }
      ctx.lineTo(width, height);
      ctx.stroke();

    } else {
      systemEnergy += (0 - systemEnergy) * 0.08;
    }

    // 绘制并渲染宇宙星尘余烬
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(renderVisuals);
  }

  /* ------------------------------------------
     Web Audio 音频引擎合成
     ------------------------------------------ */
  function createAudioEngine() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // 主音量
    mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

    // 频域分析
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128; 
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // 滤波器
    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(130, audioCtx.currentTime);
    filter.Q.setValueAtTime(3.5, audioCtx.currentTime);

    // 低音 Drone - A1 A音符 (55Hz)
    osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // 空灵共鸣音 - E2 五度共振 (82.4Hz)
    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

    // LFO 潮汐调制
    lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.05, audioCtx.currentTime); // 20秒周期

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(30, audioCtx.currentTime);

    // 连接
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  // 空间双耳敲击微粒
  function triggerBinauralClick() {
    if (!audioCtx || audioCtx.state === "suspended") return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    osc.type = "sine";
    osc.frequency.setValueAtTime(800 + Math.random() * 600, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.006, audioCtx.currentTime + 0.005);
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

  function startAudioSystem() {
    createAudioEngine();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    osc1.start(0);
    osc2.start(0);
    lfo.start(0);

    // 淡入
    const now = audioCtx.currentTime;
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.08, now + 2.0);

    // 随机微粒晶莹声
    clickInterval = setInterval(() => {
      if (Math.random() > 0.25) {
        triggerBinauralClick();
      }
    }, 500);

    isPlaying = true;
    if (audioStatusText) {
      audioStatusText.textContent = "VOID ECHOES: ACTIVE";
    }
  }

  // 绑定仪式按钮点击事件 (手势解锁)
  initBtn.addEventListener("click", () => {
    startAudioSystem();
    
    // 首屏淡出并在完成过渡后隐藏
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 1500);
  });

  /* ------------------------------------------
     画廊视差滚动与进入淡显 (Scroll Engine)
     ------------------------------------------ */
  const galleryItems = document.querySelectorAll(".gallery-item");
  const galleryImgs = document.querySelectorAll(".gallery-img");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function handleScroll() {
    const pageTop = window.scrollY;
    const windowHeight = window.innerHeight;

    // 1. 滚动淡显监视
    galleryItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      // 进入视野 80% 触发渐显
      if (rect.top < windowHeight * 0.82) {
        item.classList.add("visible");
      }
    });

    // 2. 图片视差效果
    if (!prefersReduced.matches) {
      galleryImgs.forEach((img) => {
        const wrap = img.parentElement;
        const rect = wrap.getBoundingClientRect();
        
        // 计算 wrap 相对于视口的高度比例 (-1.0 到 1.0 之间)
        const visibleCenter = rect.top + rect.height / 2;
        const windowCenter = windowHeight / 2;
        const offsetRatio = (visibleCenter - windowCenter) / (windowHeight / 2);

        // 映射到 top 偏移 (在 -15% 到 -5% 之间漂移，配合初始 top: -10%)
        const drift = -10 + offsetRatio * 5;
        img.style.transform = `translate3d(0, ${drift}%, 0)`;
      });
    }
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles.forEach((p) => p.reset());
    handleScroll();
  });

  // 开启 Canvas 渲染环
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

  // 初始触发一次计算
  setTimeout(handleScroll, 100);
}
