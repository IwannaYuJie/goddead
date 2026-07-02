const updated = document.querySelector("[data-updated]");

function renderLaunchTime() {
  if (!updated) return;

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  updated.textContent = `Page prepared ${formatter.format(new Date())}`;
}

document.addEventListener("DOMContentLoaded", renderLaunchTime);
