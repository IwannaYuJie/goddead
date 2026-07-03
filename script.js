document.addEventListener("DOMContentLoaded", () => {
  // 1. 初始化更新时间 (保留原有测试兼容逻辑)
  renderLaunchTime();
  
  // 2. 初始化 Canvas 粒子物理系统
  initVoidParticles();
  
  // 3. 初始化 3D 卡片倾斜交互
  init3DMonuments();
  
  // 4. 初始化哲学启示录 (名言生成器)
  initOracle();
  
  // 5. 初始化 Web Audio 原生环境音效
  initAmbientAudio();
});

/* ==========================================
   1. Launch Time Renderer (Compatibility)
   ========================================== */
function renderLaunchTime() {
  const updated = document.querySelector("[data-updated]");
  if (!updated) return;

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  updated.textContent = `Page prepared ${formatter.format(new Date())}`;
}

/* ==========================================
   2. Canvas Void Particles (Gravitational Hole)
   ========================================== */
function initVoidParticles() {
  const canvas = document.getElementById("void-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let animationId = null;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const maxParticles = width < 720 ? 45 : 120;
  
  // 记录鼠标状态
  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    active: false,
    radius: 200
  };

  class Particle {
    constructor() {
      this.reset();
      // 初始阶段随机散开
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      // 重置到环绕中心旋转的状态
      this.angle = Math.random() * Math.PI * 2;
      this.radius = Math.random() * Math.min(width, height) * 0.4 + 20;
      this.speed = (Math.random() * 0.001 + 0.0003) * (Math.random() > 0.5 ? 1 : -1);
      this.size = Math.random() * 1.8 + 0.6;
      this.opacity = Math.random() * 0.5 + 0.25;
      
      // 金色到淡白色的混合色调
      const isGold = Math.random() > 0.3;
      this.color = isGold 
        ? `rgba(212, 175, 55, ${this.opacity})` 
        : `rgba(229, 229, 229, ${this.opacity * 0.8})`;
      
      this.x = width / 2 + Math.cos(this.angle) * this.radius;
      this.y = height / 2 + Math.sin(this.angle) * this.radius;
      
      // 漂移阻尼
      this.damping = 0.04;
    }

    update() {
      // 基础旋转轨迹
      this.angle += this.speed;
      
      // 目标轨道位置
      const targetX = width / 2 + Math.cos(this.angle) * this.radius;
      const targetY = height / 2 + Math.sin(this.angle) * this.radius;

      // 鼠标引力/斥力效应
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          // 靠近鼠标时，粒子略微受重力吸引坍缩
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (mouse.x - this.x) * force * 0.03;
          this.y += (mouse.y - this.y) * force * 0.03;
        }
      }

      // 平滑拉回轨道
      this.x += (targetX - this.x) * this.damping;
      this.y += (targetY - this.y) * this.damping;

      // 越界重置
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // 填充粒子池
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // 环形渲染循环
  function animate() {
    ctx.fillStyle = "rgba(5, 5, 5, 0.08)"; // 拖尾残影
    ctx.fillRect(0, 0, width, height);

    // 平滑插值鼠标移动
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // 事件监听
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles.forEach((p) => p.reset());
  });

  document.addEventListener("mousemove", (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  document.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  // 支持触屏互动
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  document.addEventListener("touchend", () => {
    mouse.active = false;
  });

  // 判断是否启用了“减弱动画”
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!prefersReduced.matches) {
    animate();
  }

  prefersReduced.addEventListener("change", (e) => {
    if (e.matches) {
      if (animationId) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
    } else {
      animate();
    }
  });
}

/* ==========================================
   3. 3D Monument Cards Tilt Interaction
   ========================================== */
function init3DMonuments() {
  const cards = document.querySelectorAll(".monument-card");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  
  if (prefersReduced.matches) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // 鼠标在卡片内的 X 坐标
      const y = e.clientY - rect.top;  // 鼠标在卡片内的 Y 坐标
      
      const width = rect.width;
      const height = rect.height;
      
      // 映射到旋转角度 (-8 到 +8 度)
      const rotateX = ((y / height) - 0.5) * -16;
      const rotateY = ((x / width) - 0.5) * 16;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

/* ==========================================
   4. Interactive Oracle (Quotes Generator)
   ========================================== */
const QUOTES_DATABASE = [
  {
    en: "God is dead. God remains dead. And we have killed him.",
    zh: "上帝死了。上帝已经死了。是我们杀死了他。",
    author: "Friedrich Nietzsche (尼采)"
  },
  {
    en: "He who has a why to live for can bear almost any how.",
    zh: "知道为什么而活的人，便能生存于任何状态之中。",
    author: "Friedrich Nietzsche (尼采)"
  },
  {
    en: "Man is a rope, tied between beast and overman — a rope over an abyss.",
    zh: "人是一根绳索，连接在野兽与超人之间——横跨深渊的绳索。",
    author: "Friedrich Nietzsche (尼采)"
  },
  {
    en: "To live is to suffer, to survive is to find some meaning in the suffering.",
    zh: "活着便是受苦，而生存下去，则是在痛苦中找寻意义。",
    author: "Friedrich Nietzsche (尼采)"
  },
  {
    en: "In the midst of winter, I found there was, within me, an invincible summer.",
    zh: "在隆冬的严寒中，我发现自己内心深处有一个不可战胜的夏天。",
    author: "Albert Camus (加缪)"
  },
  {
    en: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
    zh: "对付这个不自由的世界，唯一的方法是让自己变得如此绝对自由，以至于你的存在本身就是一种反叛。",
    author: "Albert Camus (加缪)"
  },
  {
    en: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.",
    zh: "人是被判了自由之刑的；因为一旦被扔进这个世界，他就要对他所做的一切负责。",
    author: "Jean-Paul Sartre (萨特)"
  },
  {
    en: "We are our choices.",
    zh: "我们的选择决定了我们是谁。",
    author: "Jean-Paul Sartre (萨特)"
  },
  {
    en: "The literal meaning of life is whatever you're doing that prevents you from killing yourself.",
    zh: "生命的字面意义，不过是任何能阻止你选择走向自我毁灭的事物。",
    author: "Albert Camus (加缪)"
  }
];

function initOracle() {
  const quoteEnEl = document.getElementById("oracle-quote-en");
  const quoteZhEl = document.getElementById("oracle-quote-zh");
  const authorEl = document.getElementById("oracle-author");
  const seekBtn = document.getElementById("seek-btn");

  if (!quoteEnEl || !quoteZhEl || !authorEl || !seekBtn) return;

  let isTyping = false;

  function typeText(element, text, speed = 25, callback = null) {
    element.textContent = "";
    let i = 0;
    
    function step() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(step, speed);
      } else if (callback) {
        callback();
      }
    }
    step();
  }

  function nextOracle() {
    if (isTyping) return;
    isTyping = true;
    seekBtn.disabled = true;
    seekBtn.textContent = "[ SEEKING... ]";

    // 随机抽取，且不与当前重复
    let nextIndex;
    const currentEn = quoteEnEl.textContent;
    do {
      nextIndex = Math.floor(Math.random() * QUOTES_DATABASE.length);
    } while (QUOTES_DATABASE[nextIndex].en === currentEn && QUOTES_DATABASE.length > 1);

    const targetQuote = QUOTES_DATABASE[nextIndex];

    // 打字机播放英文，接着播放中文
    typeText(quoteEnEl, targetQuote.en, 18, () => {
      typeText(quoteZhEl, targetQuote.zh, 30, () => {
        authorEl.textContent = `— ${targetQuote.author} —`;
        authorEl.style.opacity = "0";
        setTimeout(() => {
          authorEl.style.transition = "opacity 0.8s ease";
          authorEl.style.opacity = "0.7";
          isTyping = false;
          seekBtn.disabled = false;
          seekBtn.textContent = "[ SEEK THE VOID ]";
        }, 100);
      });
    });
  }

  seekBtn.addEventListener("click", nextOracle);
}

/* ==========================================
   5. Web Audio Native Ambient Pad (Ambient Drone)
   ========================================== */
function initAmbientAudio() {
  const toggleBtn = document.getElementById("audio-toggle");
  if (!toggleBtn) return;

  let audioCtx = null;
  let mainGain = null;
  let osc1 = null;
  let osc2 = null;
  let lfo = null;
  let filter = null;
  let isPlaying = false;

  function createSynth() {
    // 实例化 AudioContext
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // 主增益节点，控制整体音量
    mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.0001, audioCtx.currentTime); // 极低初始音量用于淡入

    // 低通滤波器，用于过滤高频噪声，让声音呈现暗沉温暖感
    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, audioCtx.currentTime); // 截止频率 140Hz
    filter.Q.setValueAtTime(3, audioCtx.currentTime); // 谐振

    // 振荡器 1 - 模拟重低音 A1 和弦音 (55Hz)，使用三角波
    osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // 振荡器 2 - 模拟纯五度和弦音 E2 (82.4Hz)，使用正弦波产生纯净空灵共振
    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

    // LFO（低频调制器）- 产生缓慢的“风声/虚空潮汐”波动效果
    lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // 0.08Hz, 约 12 秒一个周期

    // LFO 增益 - 调制截止频率的波动幅度
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(45, audioCtx.currentTime); // 频率波动范围约 ±45Hz

    // 连接路由：
    // LFO -> LFO-Gain -> Filter-Frequency (调制定频)
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // 两个振荡器输出到低通滤波器
    osc1.connect(filter);
    osc2.connect(filter);

    // 滤波器输出到主增益
    filter.connect(mainGain);

    // 主增益输出到扬声器
    mainGain.connect(audioCtx.destination);
  }

  function startAmbient() {
    if (!audioCtx) {
      createSynth();
    }
    
    // 激活 AudioContext（应对浏览器交互限制）
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // 启动所有振荡器
    osc1.start(0);
    osc2.start(0);
    lfo.start(0);

    // 极平滑地淡入声音（2秒）
    const now = audioCtx.currentTime;
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.06, now + 2.0); // 最终柔和音量设为 0.06

    toggleBtn.classList.add("active");
    toggleBtn.querySelector(".status-text").textContent = "VOID SOUND: ON";
    isPlaying = true;
  }

  function stopAmbient() {
    if (!audioCtx) return;

    // 平滑淡出（1.5秒）
    const now = audioCtx.currentTime;
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    // 延时关闭振荡器以防杂音
    setTimeout(() => {
      if (!isPlaying) {
        osc1.stop();
        osc2.stop();
        lfo.stop();
        
        // 彻底释放资源，下次播放重新创建
        osc1.disconnect();
        osc2.disconnect();
        lfo.disconnect();
        filter.disconnect();
        mainGain.disconnect();
        
        osc1 = null;
        osc2 = null;
        lfo = null;
        filter = null;
        mainGain = null;
        audioCtx.close();
        audioCtx = null;
      }
    }, 1600);

    toggleBtn.classList.remove("active");
    toggleBtn.querySelector(".status-text").textContent = "VOID SOUND: OFF";
    isPlaying = false;
  }

  toggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopAmbient();
    } else {
      startAmbient();
    }
  });
}
