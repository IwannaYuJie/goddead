/* ============================================================
   GODDEAD — 神已死，门犹在
   灰烬粒子 / 自定义光标 / 门与敲门 / 低语轮替 / 经文带 / 焚献祷告 / 彩蛋群
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
  let echoes = Number(store.get("goddead_echo_count", "0")) || 0;
  let confessions = Number(store.get("goddead_confession_count", "0")) || 0;

  let gstate = {};
  try { gstate = JSON.parse(store.get("goddead_state", "{}")) || {}; } catch { gstate = {}; }
  gstate.prayersOffered = Number(gstate.prayersOffered) || 0;

  const corruptionOf = () =>
    Math.min(100, echoes * 1.5 + confessions * 2 + gstate.prayersOffered * 3 + arrivals * 0.5);

  const saveState = () => {
    gstate.corruption = corruptionOf();
    store.set("goddead_state", JSON.stringify(gstate));
  };

  /* ---------- 元素 ---------- */
  const statusLine = $("#status-line");
  const message = $("#arrival-message");
  const menu = $("#ritual-menu");
  const menuTrigger = $("#menu-trigger");
  const menuClose = $("#menu-close");
  const crossMark = $("#cross-mark");
  const arrivalCount = $("#arrival-count");
  const reliquaryLink = $("#reliquary-link");
  const reliquarySlot = $("#reliquary-slot");
  const doorScene = $("#door-scene");
  const doorSvg = $("#door-svg");
  const seamWhisper = $("#seam-whisper");
  const heroArt = $("#hero-art");
  const bandsEl = $("#bands");
  const prayerInput = $("#prayer-input");
  const prayerOffer = $("#prayer-offer");
  const prayerResponse = $("#prayer-response");
  const burnLayer = $("#burn-layer");

  const toast = (text) => {
    message.textContent = text;
    message.classList.remove("show");
    void message.offsetWidth;
    message.classList.add("show");
  };

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
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    scrollBoost = Math.min(3.4, scrollBoost + Math.abs(window.scrollY - lastScrollY) * 0.02);
    lastScrollY = window.scrollY;
  }, { passive: true });

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
      heroArt.style.transform = `translate3d(${par.x * 18}px, ${par.y * 12 + window.scrollY * 0.1}px, 0)`;
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
     门：纪年 / 敲门 / 低语 / 苏醒
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

  /* 门的不规律颤动（原 glitch） */
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
    doorSvg.classList.remove("shaken");
    void doorSvg.getBoundingClientRect();
    doorSvg.classList.add("shaken");
  };

  const closeDoor = () => {
    doorScene.classList.remove("ajar");
    seamWhisper.textContent = "";
  };

  const knock = () => {
    knocks++;
    totalKnocks++;
    shakeDoor();
    clearTimeout(decayTimer);

    if (knocks >= 4) {
      knocks = 0;
      clearTimeout(ajarTimer);
      closeDoor();
      statusLine.textContent = "门后重归安静。它记下了你的节奏。";
      toast("不要敲第四下。");
      return;
    }

    statusLine.textContent = knockReplies[knocks - 1];

    if (knocks === 3) {
      doorScene.classList.add("ajar");
      seamWhisper.textContent = "……进来";
      if (!awake) {
        awake = true;
        store.set("goddead_awake", "true");
        body.classList.add("awake");
      }
      toast("规则其二：门后没有人。请假装没有听见。");
      clearTimeout(ajarTimer);
      ajarTimer = setTimeout(() => {
        closeDoor();
        knocks = 0;
        syncAwake();
      }, 7000);
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
        toast("它敲了回来。");
      }, 1600);
    }
  };

  doorSvg.addEventListener("click", knock);
  doorSvg.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
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
     三道门
     ============================================================ */
  const gateNames = {
    echo: "回声正在靠近",
    vein: "血管正在寻找方向",
    confession: "忏悔正在等待重量",
  };

  const paintGateStats = () => {
    $("#stat-echo").textContent = `回声 · ${echoes}`;
    $("#stat-vein").textContent = "网络 · 活着";
    $("#stat-confession").textContent = `忏悔 · ${confessions}`;
  };
  paintGateStats();

  $$(".gate").forEach((gate) => {
    gate.addEventListener("pointerenter", () => {
      statusLine.textContent = gateNames[gate.dataset.gate] || "";
    });
    gate.addEventListener("pointerleave", syncAwake);
  });

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

    burnPrayer(value);
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
    echoes: $("#num-echoes"),
    confessions: $("#num-confessions"),
    prayers: $("#num-prayers"),
    corruption: $("#num-corruption"),
  };

  function paintStats() {
    numEls.arrivals.textContent = arrivals;
    numEls.echoes.textContent = echoes;
    numEls.confessions.textContent = confessions;
    numEls.prayers.textContent = gstate.prayersOffered;
    numEls.corruption.textContent = corruptionOf().toFixed(1) + "%";
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

  let statsCounted = false;
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || statsCounted) return;
      statsCounted = true;
      countUp(numEls.arrivals, arrivals);
      countUp(numEls.echoes, echoes);
      countUp(numEls.confessions, confessions);
      countUp(numEls.prayers, gstate.prayersOffered);
      countUp(numEls.corruption, corruptionOf(), "%", 1);
      statObserver.disconnect();
    });
  }, { threshold: 0.3 });
  statObserver.observe($(".stat-grid"));

  const renderReliquary = () => {
    const unlocked = arrivals >= 7;
    reliquaryLink.classList.toggle("locked", !unlocked);
    if (unlocked) {
      reliquarySlot.innerHTML =
        `<a class="rl-link" href="reliquary.html" data-hover><b>00</b><span class="rl-name">遗物室</span><span class="rl-hint">被收集的缺席 ⟶</span></a>`;
    } else {
      reliquarySlot.innerHTML =
        `<div class="rl-lock"><b>00 / ？？？</b><span>遗物室仍在沉睡 · 还差 ${7 - arrivals} 次抵达</span></div>`;
    }
  };

  /* 页脚十字：记录抵达 */
  crossMark.addEventListener("click", () => {
    arrivals++;
    store.set("goddead_arrivals", String(arrivals));
    arrivalCount.textContent = `已记录 ${arrivals} 次抵达`;
    saveState();
    if (statsCounted) paintStats();
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
     入场揭示
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- 初始化 ---------- */
  paintStats();
  saveState();
  renderReliquary();
  syncAwake();
});

console.log("%c GOD / DEAD ", "background:#8d2b27;color:#050505;font-family:serif;font-size:18px;letter-spacing:.3em");
console.log("%c 输入 goddead，唤醒门。", "color:#777169;font-family:monospace");
console.log("%c 输入 ↑↑↓↓←→←→BA，召回神迹。", "color:#777169;font-family:monospace");
console.log("%c 凝视经文三秒，它会出卖一句话。", "color:#777169;font-family:monospace");
