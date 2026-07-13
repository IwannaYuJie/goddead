document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const stage = document.getElementById("stage");
  const menu = document.getElementById("site-menu");
  const menuTrigger = document.getElementById("menu-trigger");
  const menuClose = document.getElementById("menu-close");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const statusLine = document.getElementById("status-line");
  const signalState = document.getElementById("signal-state");
  const awakenBtn = document.getElementById("awaken-btn");
  const arrivalBtn = document.getElementById("arrival-btn");
  const arrivalCountEl = document.getElementById("arrival-count");
  const roomsCountEl = document.getElementById("rooms-count");
  const eggCountEl = document.getElementById("egg-count");
  const markSubmit = document.getElementById("mark-submit");
  const visitorMark = document.getElementById("visitor-mark");
  const markList = document.getElementById("mark-list");
  const reliquaryResponse = document.getElementById("reliquary-response");
  const toast = document.getElementById("toast");
  const depthLabel = document.getElementById("depth-label");
  const depthFill = document.getElementById("depth-fill");
  const doorUnder = document.getElementById("door-under");
  const menuUnder = document.getElementById("menu-under");
  const yearCard = document.getElementById("year-card");
  const mapRead = document.getElementById("map-read");
  const lawBonus = document.getElementById("law-bonus");
  const voiceLink = document.getElementById("voice-link");
  const scrapSecret = document.getElementById("scrap-secret");

  const roomOrder = ["rift", "void", "law", "years", "scraps", "map", "voices", "names", "remains", "you", "under"];
  const roomDepth = {
    rift: 0,
    void: 1,
    law: 2,
    years: 2,
    scraps: 3,
    map: 3,
    voices: 4,
    names: 4,
    remains: 5,
    you: 5,
    under: 6,
  };

  let awake = localStorage.getItem("goddead_awake") === "true";
  let arrivals = Number(localStorage.getItem("goddead_arrivals") || 0);
  let current = "rift";
  let marks = loadJSON("goddead_marks", []);
  let visited = new Set(loadJSON("goddead_visited", ["rift"]));
  let eggs = new Set(loadJSON("goddead_eggs", []));
  let openedLaws = new Set();
  let openedYears = new Set();
  let openedVoices = new Set();
  let openedAliases = new Set();
  let openedScraps = new Set();
  let godDeadSeq = [];
  let redClicks = 0;

  const years = {
    0: {
      title: "无声日",
      body: "全球礼拜同时中断三秒。事后无人记得自己为何停下。空白录音成为最早的圣物——以及最早的违禁品。",
      facts: ["现象：集体耳压", "官方结论：幻觉", "档案结论：P.D. 纪元原点"],
    },
    7: {
      title: "名字潮汐",
      body: "「神」字在多地方言中尾音发不完，像被墙吸走。词典开始增补「缺席相关」条目，又在夜间被撕掉。",
      facts: ["现象：音节缺损", "禁忌：连续念真名七次", "残留：词典缺口"],
    },
    41: {
      title: "第一座空殿",
      body: "坍塌教堂被改建成「不向任何人祈祷的房间」。访客只许携带一件未完成的事。出来时那件事往往更重。",
      facts: ["现象：门槛多盐", "规则：禁止许愿", "残留：跪痕浅坑"],
    },
    112: {
      title: "血管之年",
      body: "地下河改道，城市出现无法打印的红线。跟随者声称听见心跳，却找不到心脏。回来的人改用「我们」。",
      facts: ["现象：路径随观察者变", "禁忌：用伤口对齐细流", "残留：复数自称"],
    },
    300: {
      title: "伪名战争",
      body: "为死去的祂发明称谓成为权力。每个伪名都想定义空缺归属。战争没有赢家，只繁殖更多回声。",
      facts: ["现象：称谓通胀", "代价：真名彻底失效", "残留：伪名录"],
    },
    inf: {
      title: "你的抵达",
      body: "档案无法记录此刻。你正在点开的这一年，是年表上唯一仍在生长的条目。",
      facts: ["现象：阅读即写入", "状态：未完成", "提示：继续点别的门"],
    },
  };

  const pins = {
    altar: {
      code: "ZONE · ALTAR",
      title: "旧祭坛带",
      body: "所有曾向上的建筑，地基都比图纸更深。夜间台阶多出一级，通往不存在的门。放盐不是驱邪，是记住边界。",
    },
    echo: {
      code: "ZONE · ECHO",
      title: "回声谷",
      body: "壁面光滑如耳道。超过三个音节的句子会延迟返回，并替换其中一个词。牧人改用哨音；哨音有时也带话回来。",
    },
    vein: {
      code: "ZONE · VEIN",
      title: "血脉河网",
      body: "红线不服从重力，偶尔沿墙上行。样本离开现场后变成普通铁锈水。地图折线无法固定。",
    },
    null: {
      code: "ZONE · NULL",
      title: "无名荒原",
      body: "指南针画圆。走得越久越想不起出发的理由，却记得被注视过的错觉。不要在此命名新事物。",
    },
    under: {
      code: "ZONE · UNDER",
      title: "?",
      body: "中央不应有坐标。有人坚持看见过一扇向下的门。目录称之为「底层」。需要钥匙：七次抵达，或裂口神迹，或域名。",
    },
  };

  const replies = [
    "放下了。墙知道。",
    "重量已寄存。赦免缺货。",
    "它比你想的更轻，也更黏。",
    "空缺收下了。你还背着别的。",
    "不要回头找同一句。",
  ];

  function loadJSON(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
  };

  const addEgg = (id, message) => {
    if (eggs.has(id)) return;
    eggs.add(id);
    saveJSON("goddead_eggs", [...eggs]);
    syncMeta();
    if (message) showToast(message);
    unlockCheck();
  };

  const secretUnlocked = () =>
    arrivals >= 7 ||
    eggs.has("goddead-type") ||
    eggs.has("god-dead-click") ||
    eggs.has("map-under") ||
    eggs.has("all-aliases") ||
    visited.has("under");

  const unlockCheck = () => {
    const open = secretUnlocked();
    if (doorUnder) doorUnder.hidden = !open;
    if (menuUnder) menuUnder.classList.toggle("is-unlocked", open);
    if (scrapSecret) scrapSecret.classList.toggle("is-found", open || eggs.has("scrap5"));
    if (open && !eggs.has("under-ready")) {
      addEgg("under-ready", "底层的门缝亮了一下。");
    }
  };

  const syncAwake = () => {
    body.classList.toggle("awake", awake);
    if (statusLine) statusLine.textContent = awake ? "它在听" : "……";
    if (signalState) signalState.textContent = awake ? "活跃" : "沉睡";
  };

  const syncMeta = () => {
    if (arrivalCountEl) arrivalCountEl.textContent = String(arrivals);
    if (roomsCountEl) roomsCountEl.textContent = String(visited.size);
    if (eggCountEl) eggCountEl.textContent = String(eggs.size);
    const maxD = Math.max(0, ...[...visited].map((r) => roomDepth[r] || 0));
    if (depthLabel) depthLabel.textContent = `深度 ${maxD}`;
    if (depthFill) depthFill.style.width = `${Math.min(100, (maxD / 6) * 100)}%`;
    const depth = Math.max(0, ...[...visited].map((r) => roomDepth[r] || 0));
    document.querySelectorAll("#menu-nav [data-go]").forEach((btn) => {
      const need = btn.dataset.need;
      const room = btn.dataset.go;
      let locked = false;
      if (need === "secret") locked = !secretUnlocked();
      else if (need != null && need !== "") {
        locked = depth < Number(need) && !visited.has(room);
      }
      btn.classList.toggle("is-locked", locked);
      btn.disabled = locked;
    });
    unlockCheck();
  };

  const renderMarks = () => {
    if (!markList) return;
    markList.innerHTML = "";
    marks.slice(0, 8).forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<time>${item.time}</time><span>${item.text}</span>`;
      markList.appendChild(li);
    });
  };

  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuTrigger.setAttribute("aria-expanded", String(open));
    menuTrigger.classList.toggle("is-open", open);
    if (menuBackdrop) {
      menuBackdrop.hidden = !open;
      menuBackdrop.classList.toggle("show", open);
    }
    body.classList.toggle("menu-open", open);
  };

  const goRoom = (id, fromMenu = false) => {
    if (!id || !document.getElementById(`room-${id}`)) return;
    if (id === "under" && !secretUnlocked()) {
      showToast("底层还锁着。");
      return;
    }

    // Menu jumps respect exploration locks; in-room doors always open paths.
    if (fromMenu) {
      const btn = document.querySelector(`#menu-nav [data-go="${id}"]`);
      if (btn?.classList.contains("is-locked") && !visited.has(id)) {
        showToast("这扇门还冷。先从房间里的门走进去。");
        return;
      }
    }

    const prev = document.querySelector(".room.is-active");
    const next = document.getElementById(`room-${id}`);
    if (!next || (next === prev && next.classList.contains("is-active"))) {
      setMenu(false);
      return;
    }

    if (prev) {
      prev.classList.remove("is-active");
      prev.hidden = true;
    }

    next.hidden = false;
    void next.offsetWidth;
    next.classList.add("is-active");
    current = id;
    visited.add(id);
    saveJSON("goddead_visited", [...visited]);
    syncMeta();
    setMenu(false);

    document.querySelectorAll("#menu-nav [data-go]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.go === id);
    });

    if (id === "under") addEgg("enter-under", "你站进了不该稳定的地方。");
  };

  // navigation
  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const fromMenu = Boolean(el.closest("#menu-nav"));
      goRoom(el.dataset.go, fromMenu);
    });
  });

  menuTrigger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menuClose.addEventListener("click", () => setMenu(false));
  if (menuBackdrop) menuBackdrop.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // generic reveal toggles
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    const id = el.dataset.reveal;
    const panel = document.getElementById(id);
    if (!panel) return;
    const toggle = () => {
      const open = !panel.hidden;
      // close siblings in same stack if any
      const stack = panel.parentElement;
      if (stack?.classList.contains("reveal-stack") || stack?.classList.contains("law-board")) {
        stack.querySelectorAll(".reveal-panel, .law-deep").forEach((p) => {
          if (p !== panel) p.hidden = true;
        });
        stack.querySelectorAll("[data-reveal]").forEach((t) => {
          if (t !== el) t.classList.remove("is-open");
        });
      }
      panel.hidden = open;
      el.classList.toggle("is-open", !open);
      if (!open) {
        if (id.startsWith("law-")) {
          openedLaws.add(id);
          if (openedLaws.size >= 3) {
            if (lawBonus) lawBonus.hidden = false;
            addEgg("all-laws", "三点断律已齐。墙多说了一句。");
          }
        }
        if (id.startsWith("void-")) addEgg("void-peek", null);
      }
    };
    el.addEventListener("click", toggle);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  // years
  document.querySelectorAll("[data-year]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-year]").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      const key = btn.dataset.year;
      const data = years[key];
      if (!data || !yearCard) return;
      openedYears.add(key);
      let extra = "";
      if (key === "inf" && openedYears.size >= 6) {
        extra = `<p class="year-egg">私货：∞ 不是永恒，是档案员写不下去时落下的笔尖。</p>`;
        addEgg("year-inf", "∞ 多出一行私货。");
      }
      yearCard.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <ul>${data.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
        ${extra}
      `;
      if (openedYears.size >= 6) addEgg("all-years", "残年读完。年表记得你。");
    });
  });

  // scraps
  document.querySelectorAll("[data-scrap]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // redact click
      if (e.target.classList.contains("redact")) {
        e.stopPropagation();
        const secret = e.target.dataset.secret;
        if (secret && !e.target.classList.contains("is-clear")) {
          e.target.textContent = secret;
          e.target.classList.add("is-clear");
          addEgg("redact", "涂黑裂开了。");
        }
        return;
      }
      const open = btn.classList.contains("is-open");
      document.querySelectorAll("[data-scrap]").forEach((b) => b.classList.remove("is-open"));
      if (!open) {
        btn.classList.add("is-open");
        openedScraps.add(btn.dataset.scrap);
        if (btn.dataset.scrap === "s5") addEgg("scrap5", "被撕掉的一页回到你手里。");
        if (openedScraps.size >= 4) addEgg("scraps", null);
      }
    });
  });

  // map pins
  document.querySelectorAll("[data-pin]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-pin]").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      const data = pins[btn.dataset.pin];
      if (!data || !mapRead) return;
      mapRead.innerHTML = `
        <p class="map-code">${data.code}</p>
        <h3>${data.title}</h3>
        <p>${data.body}</p>
      `;
      if (btn.dataset.pin === "under") addEgg("map-under", "中央的 ? 不是印刷错误。");
    });
  });

  // voices
  document.querySelectorAll("[data-voice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-open");
      if (btn.classList.contains("is-open")) {
        openedVoices.add(btn.dataset.voice);
        if (openedVoices.size >= 3) {
          if (voiceLink) voiceLink.hidden = false;
          addEgg("all-voices", "三人指向同一处伤口。");
        }
      }
    });
  });

  // aliases
  document.querySelectorAll(".alias").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("show");
      if (btn.classList.contains("show")) {
        openedAliases.add(btn.querySelector("i")?.textContent || "");
        if (openedAliases.size >= 6) {
          document.getElementById("alias-goddead")?.classList.add("is-hot");
          addEgg("all-aliases", "核心名在发热。");
        }
      }
    });
  });

  // remains
  document.querySelectorAll("[data-remain]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.classList.contains("is-open");
      document.querySelectorAll("[data-remain]").forEach((b) => b.classList.remove("is-open"));
      if (!open) {
        btn.classList.add("is-open");
        addEgg(`remain-${btn.dataset.remain}`, null);
      }
    });
  });

  // awaken / red point easter
  if (awakenBtn) {
    awakenBtn.addEventListener("click", () => {
      awake = !awake;
      localStorage.setItem("goddead_awake", String(awake));
      syncAwake();
      redClicks += 1;
      showToast(awake ? "脉搏被记住了。" : "又暗下去。");
      if (redClicks >= 7) addEgg("red7", "红点数到七。有什么在数你。");
    });
  }

  // GOD + DEAD sequence
  const godBtn = document.getElementById("click-god");
  const deadBtn = document.getElementById("click-dead");
  const trackSeq = (part) => {
    godDeadSeq.push(part);
    godDeadSeq = godDeadSeq.slice(-2);
    if (godDeadSeq[0] === "god" && godDeadSeq[1] === "dead") {
      addEgg("god-dead-click", "GOD → DEAD。裂口承认你。");
      unlockCheck();
    }
  };
  godBtn?.addEventListener("click", () => {
    godBtn.classList.add("is-lit");
    trackSeq("god");
  });
  deadBtn?.addEventListener("click", () => {
    deadBtn.classList.add("is-lit");
    trackSeq("dead");
  });

  // corner egg
  document.querySelectorAll("[data-egg='corner']").forEach((el) => {
    let n = 0;
    el.addEventListener("click", () => {
      n += 1;
      if (n >= 3) addEgg("domain-triple", "域名被敲了三下。墙回了一下。");
    });
  });

  // arrivals / marks
  if (arrivalBtn) {
    arrivalBtn.addEventListener("click", () => {
      arrivals += 1;
      localStorage.setItem("goddead_arrivals", String(arrivals));
      syncMeta();
      showToast(arrivals % 7 === 0 ? "第七次抵达。底层松动了。" : `抵达 ${arrivals}`);
      unlockCheck();
    });
  }

  if (markSubmit && visitorMark) {
    markSubmit.addEventListener("click", () => {
      const text = visitorMark.value.trim();
      if (!text) {
        showToast("空的放不下。");
        return;
      }
      marks.unshift({
        text,
        time: new Date().toLocaleString("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      marks = marks.slice(0, 12);
      saveJSON("goddead_marks", marks);
      visitorMark.value = "";
      renderMarks();
      if (reliquaryResponse) {
        reliquaryResponse.textContent = replies[Math.floor(Math.random() * replies.length)];
        reliquaryResponse.classList.add("show");
      }
      arrivals += 1;
      localStorage.setItem("goddead_arrivals", String(arrivals));
      syncMeta();
      addEgg("first-mark", null);
      unlockCheck();
    });
  }

  // keyboard goddead
  let code = "";
  document.addEventListener("keydown", (event) => {
    if (event.key.length !== 1) return;
    code = (code + event.key.toLowerCase()).slice(-7);
    if (code === "goddead") {
      awake = true;
      localStorage.setItem("goddead_awake", "true");
      syncAwake();
      addEgg("goddead-type", "你念出了它的名字。");
      unlockCheck();
    }
  });

  // keyboard room hop with arrows when not typing
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("textarea, input")) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const list = roomOrder.filter((r) => r !== "under" || secretUnlocked());
      const idx = list.indexOf(current);
      if (idx < 0) return;
      const next =
        e.key === "ArrowRight"
          ? list[Math.min(list.length - 1, idx + 1)]
          : list[Math.max(0, idx - 1)];
      // only allow if not locked
      const depth = Math.max(0, ...[...visited].map((r) => roomDepth[r] || 0));
      if (roomDepth[next] <= depth + 1 || visited.has(next) || next === "rift") {
        goRoom(next);
      }
    }
  });

  // init
  document.querySelectorAll(".room").forEach((room) => {
    if (!room.classList.contains("is-active")) room.hidden = true;
  });
  syncAwake();
  syncMeta();
  renderMarks();
  unlockCheck();

  console.log("%c GOD / DEAD ", "background:#8d2b27;color:#050505;font-family:serif;font-size:18px;letter-spacing:.3em");
  console.log("%c 点击探索。试着输入 goddead。GOD 再 DEAD。红点七次。抵达七次。", "color:#777169;font-family:monospace");
});
