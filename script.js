document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menu = document.getElementById("site-menu");
  const menuTrigger = document.getElementById("menu-trigger");
  const menuClose = document.getElementById("menu-close");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const statusLine = document.getElementById("status-line");
  const signalState = document.getElementById("signal-state");
  const awakenBtn = document.getElementById("awaken-btn");
  const arrivalBtn = document.getElementById("arrival-btn");
  const arrivalCountEl = document.getElementById("arrival-count");
  const markSubmit = document.getElementById("mark-submit");
  const visitorMark = document.getElementById("visitor-mark");
  const markList = document.getElementById("mark-list");
  const reliquaryResponse = document.getElementById("reliquary-response");
  const toast = document.getElementById("toast");
  const mapPanel = document.getElementById("map-panel");

  let awake = localStorage.getItem("goddead_awake") === "true";
  let arrivals = Number(localStorage.getItem("goddead_arrivals") || 0);
  let marks = [];
  try {
    marks = JSON.parse(localStorage.getItem("goddead_marks") || "[]");
    if (!Array.isArray(marks)) marks = [];
  } catch {
    marks = [];
  }

  const regionData = {
    altar: {
      code: "ZONE · ALTAR",
      title: "旧祭坛带",
      body: "所有曾用于向上的建筑，地基都比图纸更深。夜间台阶会多出一级，通往一扇不存在的门。当地人在门槛放盐，不是为了驱邪，是为了记住边界。",
      facts: [
        "现象：垂直方向的轻微眩晕",
        "禁忌：不要在午夜清点台阶数量",
        "残留：干涸的金色痕迹，无光谱对应",
      ],
    },
    echo: {
      code: "ZONE · ECHO",
      title: "回声谷",
      body: "峡谷壁面光滑如耳道。任何超过三个音节的句子都会延迟返回，并在返回时替换其中一个词。牧羊人改用哨音交流；哨音有时也会带话回来。",
      facts: [
        "现象：语义漂移与延迟复述",
        "禁忌：不要喊自己的全名",
        "残留：岩壁上的唇印状侵蚀",
      ],
    },
    vein: {
      code: "ZONE · VEIN",
      title: "血脉河网",
      body: "地下与地表同时生长的红色细流。它们不服从重力，偶尔沿墙上行。化学分析失败：样本在离开现场后变成普通铁锈水。",
      facts: [
        "现象：路径随观察者移动",
        "禁忌：不要用伤口去对齐细流",
        "残留：地图上无法固定的折线",
      ],
    },
    null: {
      code: "ZONE · NULL",
      title: "无名荒原",
      body: "没有地标的开阔地。指南针在此画圆。旅人报告：走得越久，越想不起出发的理由，却记得一种被注视过的错觉。",
      facts: [
        "现象：目的感稀释",
        "禁忌：不要在此命名新事物",
        "残留：均匀分布的浅坑，像被挖走的跪痕",
      ],
    },
  };

  const archiveReplies = [
    "已归档。重量被记下，赦免仍缺席。",
    "墙听见了。墙不会转告任何人。",
    "这句话比你以为的更轻，也更黏。",
    "空缺收下了它。你还背着剩下的部分。",
    "记录完成。请不要回头寻找同一句话。",
  ];

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
  };

  const syncAwake = () => {
    body.classList.toggle("awake", awake);
    if (statusLine) {
      statusLine.textContent = awake
        ? "信号活跃 · 档案正在呼吸"
        : "信号沉睡 · 档案处于静默";
    }
    if (signalState) signalState.textContent = awake ? "活跃" : "沉睡";
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
    if (open) menuClose.focus();
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

  const syncArrivals = () => {
    if (arrivalCountEl) arrivalCountEl.textContent = String(arrivals);
  };

  menuTrigger.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });
  menuClose.addEventListener("click", () => setMenu(false));
  if (menuBackdrop) menuBackdrop.addEventListener("click", () => setMenu(false));

  menu.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) {
      setMenu(false);
    }
  });

  if (awakenBtn) {
    awakenBtn.addEventListener("click", () => {
      awake = !awake;
      localStorage.setItem("goddead_awake", String(awake));
      syncAwake();
      showToast(awake ? "祭坛记住了你的脉搏。" : "信号沉入黑暗。");
    });
  }

  if (arrivalBtn) {
    arrivalBtn.addEventListener("click", () => {
      arrivals += 1;
      localStorage.setItem("goddead_arrivals", String(arrivals));
      syncArrivals();
      showToast(
        arrivals % 7 === 0
          ? "第七次抵达。遗物室把你写进页边。"
          : `抵达记录：${arrivals}`
      );
    });
  }

  if (markSubmit && visitorMark) {
    markSubmit.addEventListener("click", () => {
      const text = visitorMark.value.trim();
      if (!text) {
        showToast("空的重量无法归档。");
        return;
      }
      const entry = {
        text,
        time: new Date().toLocaleString("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      marks.unshift(entry);
      marks = marks.slice(0, 12);
      localStorage.setItem("goddead_marks", JSON.stringify(marks));
      visitorMark.value = "";
      renderMarks();
      if (reliquaryResponse) {
        reliquaryResponse.textContent =
          archiveReplies[Math.floor(Math.random() * archiveReplies.length)];
        reliquaryResponse.classList.add("show");
      }
      arrivals += 1;
      localStorage.setItem("goddead_arrivals", String(arrivals));
      syncArrivals();
    });
  }

  // Accordion
  document.querySelectorAll(".acc-item").forEach((item) => {
    const trigger = item.querySelector(".acc-trigger");
    const panel = item.querySelector(".acc-panel");
    if (!trigger || !panel) return;
    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".acc-trigger").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        btn.closest(".acc-item")?.classList.remove("open");
      });
      document.querySelectorAll(".acc-panel").forEach((p) => {
        p.hidden = true;
      });
      if (!open) {
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        item.classList.add("open");
      }
    });
  });

  // Redaction hover/focus reveal via CSS; ensure keyboard access
  document.querySelectorAll(".redact").forEach((el) => {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "窥视涂黑内容");
  });

  // Map
  document.querySelectorAll(".map-node").forEach((node) => {
    node.addEventListener("click", () => {
      document.querySelectorAll(".map-node").forEach((n) => {
        n.classList.remove("is-active");
        n.setAttribute("aria-selected", "false");
      });
      node.classList.add("is-active");
      node.setAttribute("aria-selected", "true");
      const data = regionData[node.dataset.region];
      if (!data || !mapPanel) return;
      mapPanel.innerHTML = `
        <p class="map-region-code">${data.code}</p>
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <ul>${data.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
      `;
    });
  });

  // Name cards toggle for touch
  document.querySelectorAll(".name-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("revealed");
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Active menu section
  const sections = ["top", "prologue", "doctrine", "chronicle", "archive", "map", "witness", "names", "remains", "reliquary"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const menuLinks = menu.querySelectorAll("[data-menu-link]");
  const setActiveLink = (id) => {
    menuLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === `#${id}`);
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const sectionIo = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveLink(visible.target.id);
      },
      { threshold: [0.25, 0.5], rootMargin: "-20% 0px -45% 0px" }
    );
    sections.forEach((sec) => sectionIo.observe(sec));
  }

  // Konami-lite: type goddead
  let code = "";
  document.addEventListener("keydown", (event) => {
    if (event.key.length !== 1) return;
    code = (code + event.key.toLowerCase()).slice(-7);
    if (code === "goddead") {
      awake = true;
      localStorage.setItem("goddead_awake", "true");
      syncAwake();
      showToast("你念出了它的名字。现在，它也会念出你的。");
    }
  });

  syncAwake();
  syncArrivals();
  renderMarks();
});

console.log(
  "%c GOD / DEAD ",
  "background:#8d2b27;color:#050505;font-family:serif;font-size:18px;letter-spacing:.3em"
);
console.log("%c 打开目录，阅读空缺档案。", "color:#777169;font-family:monospace");
