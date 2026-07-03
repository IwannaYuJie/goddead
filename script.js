document.addEventListener("DOMContentLoaded", () => {
  // 1. 初始化更新时间以兼容原有测试
  renderLaunchTime();
  
  // 2. 初始化以太谶言文本重组
  initTextScramble();
  
  // 3. 初始化音画共振联动系统
  initAudioVisualSystem();
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

  updated.textContent = `VORTEX ENGAGED ${formatter.format(new Date())}`;
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
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
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
    
    // 随机选择一条新的，不与当前重复
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
   3. Audio-Visual Reactive Core
   ========================================== */
function initAudioVisualSystem() {
  const canvas = document.getElementById("void-canvas");
  const beaconBtn = document.getElementById("beacon-btn");
  if (!canvas || !beaconBtn) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Audio Variables
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
  let systemEnergy = 0; // 0.0 - 1.0 用于向 Canvas 传输声能强度

  // 粒子系统配置
  const particles = [];
  const maxParticles = width < 720 ? 60 : 160;

  class QuantumParticle {
    constructor() {
      this.reset();
      // 首次加载布满屏幕
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      // 在极坐标系内生成
      this.angle = Math.random() * Math.PI * 2;
      this.radiusBase = Math.random() * Math.min(width, height) * 0.42 + 10;
      this.radius = this.radiusBase;
      this.speed = (Math.random() * 0.0015 + 0.0004) * (Math.random() > 0.5 ? 1 : -1);
      this.size = Math.random() * 1.5 + 0.5;
      
      // 金色到淡白色的随机透明度
      this.opacityBase = Math.random() * 0.4 + 0.15;
      this.colorType = Math.random() > 0.45 ? 'gold' : 'white';
      
      this.x = width / 2 + Math.cos(this.angle) * this.radius;
      this.y = height / 2 + Math.sin(this.angle) * this.radius;
      
      // 惯性阻尼
      this.damping = 0.05;
    }

    update() {
      // 基础角速度旋转
      this.angle += this.speed * (1 + systemEnergy * 1.5); // 声能越大旋转越快
      
      // 声能映射：声能变大时，粒子轨道收缩或发生重力波起伏
      const targetRadius = this.radiusBase * (1 - systemEnergy * 0.28);
      this.radius += (targetRadius - this.radius) * this.damping;

      const targetX = width / 2 + Math.cos(this.angle) * this.radius;
      const targetY = height / 2 + Math.sin(this.angle) * this.radius;

      // 声能带来的物理微颤/极性波动
      const shakeX = (Math.random() - 0.5) * systemEnergy * 15;
      const shakeY = (Math.random() - 0.5) * systemEnergy * 15;

      this.x += (targetX - this.x) * this.damping + shakeX;
      this.y += (targetY - this.y) * this.damping + shakeY;

      // 越界重置
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      // 亮度随声能爆发而放大
      const alpha = Math.min(1, this.opacityBase * (1 + systemEnergy * 1.8));
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (1 + systemEnergy * 0.8), 0, Math.PI * 2);
      ctx.fillStyle = this.colorType === 'gold' 
        ? `rgba(184, 151, 94, ${alpha})`
        : `rgba(236, 236, 236, ${alpha * 0.7})`;
      ctx.fill();
    }
  }

  // 填充粒子
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new QuantumParticle());
  }

  /* ------------------------------------------
     Canvas 动画渲染环
     ------------------------------------------ */
  let animationId = null;

  function renderLoop() {
    // 渐变覆盖产生优雅的流动残影
    ctx.fillStyle = "rgba(3, 3, 3, 0.08)";
    ctx.fillRect(0, 0, width, height);

    // 实时读取音频振幅，调制系统能量
    if (isPlaying && analyser) {
      analyser.getByteFrequencyData(dataArray);
      // 提取低频部分的值 (前10个频段) 映射为声能
      let lowFreqSum = 0;
      for (let i = 0; i < 10; i++) {
        lowFreqSum += dataArray[i];
      }
      const avgAmp = lowFreqSum / 10;
      // 平滑插值计算声能系数
      const targetEnergy = avgAmp / 255.0;
      systemEnergy += (targetEnergy - systemEnergy) * 0.15;
    } else {
      systemEnergy += (0 - systemEnergy) * 0.08; // 缓缓归零
    }

    // 绘制以太信标至背景 Canvas 形成视觉发光晕开
    if (systemEnergy > 0.01) {
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 5,
        width / 2, height / 2, 100 + systemEnergy * 150
      );
      gradient.addColorStop(0, `rgba(184, 151, 94, ${systemEnergy * 0.15})`);
      gradient.addColorStop(1, "rgba(3, 3, 3, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 100 + systemEnergy * 150, 0, Math.PI * 2);
      ctx.fill();
    }

    // 粒子刷新
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(renderLoop);
  }

  /* ------------------------------------------
     Web Audio 音频合成器逻辑
     ------------------------------------------ */
  function createAudioEngine() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // 主音量增益
    mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

    // 频率分析器
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64; // 较小的 fftSize 能获取更精确的时域响应
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // 低通滤波器（形成空灵的暗沉音质）
    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(125, audioCtx.currentTime);
    filter.Q.setValueAtTime(4, audioCtx.currentTime);

    // 振荡器 1 - 深度重低音 A1 (55Hz)，使用三角波
    osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // 振荡器 2 - 空灵共鸣音 E2 (82.4Hz)，正弦波
    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

    // LFO（低频调制截止频率，产生风声流动潮汐感）
    lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.06, audioCtx.currentTime); // 约16秒循环一次

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(35, audioCtx.currentTime); // 调制幅度 ±35Hz

    // 路由网络连接
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  // 空间双耳敲击微粒音 (Binaural Granular Click)
  function triggerGranularClick() {
    if (!audioCtx || audioCtx.state === "suspended") return;

    // 随机频率 750Hz - 1500Hz
    const freq = 750 + Math.random() * 750;
    // 随机声相 (左声道到右声道)
    const panVal = (Math.random() - 0.5) * 2; // -1.0 到 1.0

    const clickOsc = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();
    const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    clickOsc.type = "sine";
    clickOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    clickGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    // 极速淡入并指数淡出（0.04秒生命周期，制造精细沙砾声）
    clickGain.gain.exponentialRampToValueAtTime(0.008, audioCtx.currentTime + 0.005);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

    if (panner) {
      panner.pan.setValueAtTime(panVal, audioCtx.currentTime);
      clickOsc.connect(panner);
      panner.connect(clickGain);
    } else {
      clickOsc.connect(clickGain);
    }
    
    clickGain.connect(audioCtx.destination);

    clickOsc.start();
    clickOsc.stop(audioCtx.currentTime + 0.05);
  }

  function startAudio() {
    if (!audioCtx) {
      createAudioEngine();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    osc1.start(0);
    osc2.start(0);
    lfo.start(0);

    // 2秒平滑淡入
    const now = audioCtx.currentTime;
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.08, now + 2.0);

    // 随机启动颗粒敲击定时器
    clickInterval = setInterval(() => {
      // 80% 概率触发，产生无序的晶莹感
      if (Math.random() > 0.2) {
        triggerGranularClick();
      }
    }, 450);

    beaconBtn.classList.add("active");
    isPlaying = true;
  }

  function stopAudio() {
    if (!audioCtx) return;

    if (clickInterval) {
      clearInterval(clickInterval);
      clickInterval = null;
    }

    // 1.5秒平滑淡出
    const now = audioCtx.currentTime;
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    setTimeout(() => {
      if (!isPlaying) {
        osc1.stop();
        osc2.stop();
        lfo.stop();

        osc1.disconnect();
        osc2.disconnect();
        lfo.disconnect();
        filter.disconnect();
        mainGain.disconnect();
        analyser.disconnect();

        osc1 = null;
        osc2 = null;
        lfo = null;
        filter = null;
        mainGain = null;
        analyser = null;
        audioCtx.close();
        audioCtx = null;
      }
    }, 1600);

    beaconBtn.classList.remove("active");
    isPlaying = false;
  }

  beaconBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  });

  /* ------------------------------------------
     窗口缩放与无障碍控制
     ------------------------------------------ */
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles.forEach((p) => p.reset());
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!prefersReduced.matches) {
    renderLoop();
  }

  prefersReduced.addEventListener("change", (e) => {
    if (e.matches) {
      if (animationId) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
    } else {
      renderLoop();
    }
  });
}
