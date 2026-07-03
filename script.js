document.addEventListener("DOMContentLoaded", () => {
  renderLaunchTime();
  initGate();
  initScrollReveal();
  initParallax();
});

/* ============================================================
   1. Compatibility: Launch Time
   ============================================================ */
function renderLaunchTime() {
  const updated = document.querySelector("[data-updated]");
  if (!updated) return;
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  updated.textContent = `VORTEX ACTIVE ${formatter.format(new Date())}`;
}

/* ============================================================
   2. Gate — 仪式入口淡出
   ============================================================ */
function initGate() {
  const gate = document.getElementById("gate");
  const btn = document.getElementById("gate-btn");
  if (!gate || !btn) return;

  btn.addEventListener("click", () => {
    gate.classList.add("fade-out");
    setTimeout(() => {
      gate.style.display = "none";
    }, 1600);
  }, { once: true });
}

/* ============================================================
   3. Scroll Reveal — 面板进入视野缓显
   ============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll(".panel, .coda");
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.3 }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ============================================================
   4. Parallax — 图片随滚动微位移
   ============================================================ */
function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const panels = document.querySelectorAll(".panel");
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const vh = window.innerHeight;
          panels.forEach((panel) => {
            const img = panel.querySelector(".panel-img");
            if (!img) return;
            const rect = panel.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > vh) return;
            const center = rect.top + rect.height / 2;
            const offset = (center - vh / 2) / vh;
            img.style.transform = `translateY(calc(-8% + ${offset * -12}%))`;
          });
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}
