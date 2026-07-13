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
  const placeRead = document.getElementById("place-read");
  const cursorStain = document.getElementById("cursor-stain");

  let awake = localStorage.getItem("goddead_awake") === "true";
  let arrivals = Number(localStorage.getItem("goddead_arrivals") || 0);
  let marks = [];
  try {
    marks = JSON.parse(localStorage.getItem("goddead_marks") || "[]");
    if (!Array.isArray(marks)) marks = [];
  } catch {
    marks = [];
  }

  const places = {
    altar: "台阶会多一级。<br>通往一扇不存在的门。",
    echo: "话会延迟回来。<br>回来时少一个字，或多一颗牙。",
    vein: "红线不服从重力。<br>有时沿墙上行。",
    null: "指南针在此画圆。<br>走得越久，越想不起为何出发。",
  };

  const replies = [
    "放下了。墙知道。",
    "重量已寄存。赦免缺货。",
    "它比你想的更轻。也更黏。",
    "空缺收下了。你还背着别的。",
    "不要回头找同一句。",
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
    if (statusLine) statusLine.textContent = awake ? "它在听" : "……";
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
    marks.slice(0, 6).forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<time>${item.time}</time><span>${item.text}</span>`;
      markList.appendChild(li);
    });
  };

  const syncArrivals = () => {
    if (arrivalCountEl) arrivalCountEl.textContent = String(arrivals);
  };

  menuTrigger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menuClose.addEventListener("click", () => setMenu(false));
  if (menuBackdrop) menuBackdrop.addEventListener("click", () => setMenu(false));
  menu.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });

  if (awakenBtn) {
    awakenBtn.addEventListener("click", () => {
      awake = !awake;
      localStorage.setItem("goddead_awake", String(awake));
      syncAwake();
      showToast(awake ? "脉搏被记住了。" : "又暗下去。");
    });
  }

  if (arrivalBtn) {
    arrivalBtn.addEventListener("click", () => {
      arrivals += 1;
      localStorage.setItem("goddead_arrivals", String(arrivals));
      syncArrivals();
      showToast(arrivals % 7 === 0 ? "第七次。页边写了你。" : `抵达 ${arrivals}`);
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
      marks = marks.slice(0, 10);
      localStorage.setItem("goddead_marks", JSON.stringify(marks));
      visitorMark.value = "";
      renderMarks();
      if (reliquaryResponse) {
        reliquaryResponse.textContent = replies[Math.floor(Math.random() * replies.length)];
        reliquaryResponse.classList.add("show");
      }
      arrivals += 1;
      localStorage.setItem("goddead_arrivals", String(arrivals));
      syncArrivals();
    });
  }

  // scraps flip
  document.querySelectorAll("[data-scrap]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.classList.contains("is-open");
      document.querySelectorAll("[data-scrap]").forEach((b) => b.classList.remove("is-open"));
      if (!open) btn.classList.add("is-open");
    });
  });

  // places
  document.querySelectorAll("[data-place]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-place]").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      const key = btn.dataset.place;
      if (placeRead && places[key]) {
        placeRead.innerHTML = `<p class="place-hint">${places[key]}</p>`;
      }
    });
  });

  // aliases
  document.querySelectorAll(".alias").forEach((btn) => {
    btn.addEventListener("click", () => btn.classList.toggle("show"));
  });

  // redaction focus
  document.querySelectorAll(".redact").forEach((el) => {
    el.setAttribute("tabindex", "0");
  });

  // scroll reveal + whisper stagger
  const revealEls = document.querySelectorAll("[data-reveal], .shard, .year, .voice, .thing, .alias");
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
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // active menu
  const ids = ["top", "void", "breath", "years", "scraps", "places", "voices", "calling", "things", "you"];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const menuLinks = menu.querySelectorAll("[data-menu-link]");
  if ("IntersectionObserver" in window && sections.length) {
    const sectionIo = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        menuLinks.forEach((link) => {
          const href = link.getAttribute("href") || "";
          link.classList.toggle("is-active", href === `#${visible.target.id}`);
        });
      },
      { threshold: [0.2, 0.45], rootMargin: "-18% 0px -50% 0px" }
    );
    sections.forEach((sec) => sectionIo.observe(sec));
  }

  // subtle cursor stain
  if (cursorStain && window.matchMedia("(pointer:fine)").matches) {
    let mx = 0;
    let my = 0;
    let ticking = false;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!ticking) {
        requestAnimationFrame(() => {
          cursorStain.style.transform = `translate(${mx - 40}px, ${my - 40}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // type goddead
  let code = "";
  document.addEventListener("keydown", (event) => {
    if (event.key.length !== 1) return;
    code = (code + event.key.toLowerCase()).slice(-7);
    if (code === "goddead") {
      awake = true;
      localStorage.setItem("goddead_awake", "true");
      syncAwake();
      showToast("名字被念出来了。");
    }
  });

  syncAwake();
  syncArrivals();
  renderMarks();
});

console.log("%c GOD / DEAD ", "background:#8d2b27;color:#050505;font-family:serif;font-size:18px;letter-spacing:.3em");
console.log("%c 目录在右上角。页码是假的。", "color:#777169;font-family:monospace");
