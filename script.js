document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const ritualPoint = document.getElementById("ritual-point");
  const statusLine = document.getElementById("status-line");
  const message = document.getElementById("arrival-message");
  const menu = document.getElementById("ritual-menu");
  const menuTrigger = document.getElementById("menu-trigger");
  const menuClose = document.getElementById("menu-close");
  const crossMark = document.getElementById("cross-mark");
  const reliquaryLink = document.getElementById("reliquary-link");

  let awake = localStorage.getItem("goddead_awake") === "true";
  let arrivals = Number(localStorage.getItem("goddead_arrivals") || 0);

  const showMessage = (text) => {
    message.textContent = text;
    message.classList.remove("show");
    void message.offsetWidth;
    message.classList.add("show");
  };

  const syncAwakeState = () => {
    body.classList.toggle("awake", awake);
    statusLine.textContent = awake ? "信号活跃 · 祭坛正在呼吸" : "信号沉睡 · 等待触碰";
    ritualPoint.setAttribute("aria-label", awake ? "红点已经苏醒，再次触碰使它沉睡" : "触碰红点，唤醒祭坛");
  };

  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuTrigger.setAttribute("aria-expanded", String(open));
    if (open) menuClose.focus();
    else menuTrigger.focus();
  };

  ritualPoint.addEventListener("click", () => {
    awake = !awake;
    localStorage.setItem("goddead_awake", String(awake));
    syncAwakeState();
    showMessage(awake ? "祭坛记住了你的脉搏。" : "信号沉入黑暗。");
  });

  crossMark.addEventListener("click", () => {
    arrivals += 1;
    localStorage.setItem("goddead_arrivals", String(arrivals));
    showMessage(arrivals % 7 === 0 ? "第七次抵达。遗物室记住了你。" : `抵达记录：${arrivals}`);
    if (arrivals >= 7) reliquaryLink.classList.add("unlocked");
  });

  menuTrigger.addEventListener("click", () => setMenu(true));
  menuClose.addEventListener("click", () => setMenu(false));

  menu.addEventListener("click", (event) => {
    if (event.target.tagName === "A") setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });

  let code = "";
  document.addEventListener("keydown", (event) => {
    if (event.key.length !== 1) return;
    code = (code + event.key.toLowerCase()).slice(-7);
    if (code === "goddead") {
      awake = true;
      localStorage.setItem("goddead_awake", "true");
      syncAwakeState();
      showMessage("你念出了它的名字。现在，它也会念出你的。 ");
    }
  });

  document.querySelectorAll(".gate-link").forEach((link) => {
    link.addEventListener("pointerenter", () => {
      const names = { echo: "回声正在靠近", vein: "血管正在寻找方向", confession: "忏悔正在等待重量" };
      statusLine.textContent = names[link.dataset.gate];
    });
    link.addEventListener("pointerleave", syncAwakeState);
  });

  if (arrivals >= 7) reliquaryLink.classList.add("unlocked");
  syncAwakeState();
});

console.log("%c GOD / DEAD ", "background:#8d2b27;color:#050505;font-family:serif;font-size:18px;letter-spacing:.3em");
console.log("%c 输入 goddead，唤醒红点。", "color:#777169;font-family:monospace");
