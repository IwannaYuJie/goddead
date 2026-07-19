import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function fileText(path) {
  return readFile(new URL(path, root), "utf8");
}

async function missing(path) {
  try {
    await access(new URL(path, root));
    return false;
  } catch {
    return true;
  }
}

/* ---------- 部署契约（保留） ---------- */
await access(new URL("index.html", root));
await access(new URL("styles.css", root));
await access(new URL("script.js", root));
await access(new URL("assets/hero.png", root));
await access(new URL("docs/ProgressLog.md", root));

const html = await fileText("index.html");
const css = await fileText("styles.css");
const js = await fileText("script.js");

assert.match(html, /<title>Goddead<\/title>/);
assert.match(html, /goddead\.com/);
assert.match(html, /styles\.css\?v=15/);
assert.match(html, /script\.js\?v=15/);
assert.match(html, /assets\/hero\.png/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(js, /DOMContentLoaded/);

/* ---------- 场景探索结构 ---------- */
const SCENES = ["threshold", "protocol", "corridor", "watch", "offering", "remembrance", "ninth"];
for (const s of SCENES) {
  assert.match(html, new RegExp(`data-scene="${s}"`), `scene missing: ${s}`);
}

/* 哈希路由关键节点 */
assert.match(js, /window\.addEventListener\("hashchange", route\)/);
assert.match(js, /location\.hash/);
assert.match(js, /dataset\.scene/);

/* 所有 data-go 出口都必须指向存在的场景 */
const goTargets = [...html.matchAll(/data-go="([^"]+)"/g)].map((m) => m[1]);
assert.ok(goTargets.length >= 8, "expected scene exit buttons");
for (const t of goTargets) {
  assert.ok(SCENES.includes(t), `data-go target has no scene: ${t}`);
}

/* ---------- 已删除页面：文件不存在，且不再被链接 ---------- */
for (const page of ["echo.html", "vein.html", "confession.html"]) {
  assert.ok(await missing(page), `${page} should be deleted`);
  assert.ok(!html.includes(page), `${page} still linked from index.html`);
  assert.ok(!js.includes(page), `${page} still referenced from script.js`);
}

/* ---------- 第三值夜室：入口、状态字段与房间要素 ---------- */
assert.match(html, /id="scene-watch"/);
assert.match(html, /id="narrow-door"/);
assert.match(html, /id="door-trace"/);
assert.match(html, /id="watch-link"/);
assert.match(html, /id="signout-btn"/);
assert.match(html, /id="watch-memory"/);
assert.match(html, /id="clock-second"/);
assert.match(html, /id="chair-shadow"/);
assert.match(css, /\.narrow-door\.appeared/);
assert.match(css, /\.door-trace\.trace-on/);

/* 值夜室正式位图素材：文件存在、页面引用、内联 SVG 几何已移除 */
await access(new URL("assets/watch-clock-face.webp", root));
await access(new URL("assets/watch-second-hand.png", root));
await access(new URL("assets/watch-room-desk.webp", root));
assert.match(html, /assets\/watch-clock-face\.webp/);
assert.match(html, /assets\/watch-second-hand\.png/);
assert.match(html, /assets\/watch-room-desk\.webp/);
assert.ok(!/class="wc-(hour|minute|ticks|hub|face)"/.test(html), "inline clock SVG geometry must be gone");
assert.ok(!/<svg class="watch-desk"/.test(html), "inline desk SVG must be gone");
assert.ok(!/\.wc-hour|\.wc-minute|\.wc-ticks|\.wc-hub|\.desk-lamp/.test(css), "old SVG geometry CSS must be removed");
assert.match(css, /\.wc-second-img/);
assert.match(css, /transform-origin:\s*49\.6/, "second hand must rotate around the registered pivot");
assert.match(html, /watch-clock" role="img"/, "clock keeps role=img exposure");
assert.match(html, /watch-desk" role="img"/, "desk keeps role=img exposure");

/* 硬门槛契约：未解锁时窄门与菜单入口必须 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="narrow-door"[^>]*\shidden[\s>]/, "narrow door must ship with the hidden attribute");
assert.match(html, /id="watch-link"[^>]*\shidden[\s>]/, "menu watch link must ship with the hidden attribute");
assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/i, "global [hidden] guard required against class display overrides");
assert.match(js, /watchUnlocked = \(\) => fragments >= 3/);
assert.match(js, /name === "watch" && !watchUnlocked\(\)/, "router must hard-block locked #watch navigation");
assert.match(js, /narrowDoor\.removeAttribute\("hidden"\)/);
assert.match(js, /watchLink\.removeAttribute\("hidden"\)/);

/* 交班簿语义控件：5 个可聚焦按钮，Enter/Space 原生触发 */
const logEntries = html.match(/class="log-entry[ "]/g) || [];
assert.equal(logEntries.length, 5, "handover log must hold exactly 5 entries");
const logButtons = html.match(/<button class="log-cover"/g) || [];
assert.equal(logButtons.length, 5, "each log entry needs a focusable button");
assert.equal((html.match(/aria-pressed="false"/g) || []).length, 5, "log buttons need toggle semantics");
assert.match(js, /setAttribute\("aria-pressed", "true"\)/);
assert.match(js, /setAttribute\("aria-label"/);
assert.match(js, /orig\.setAttribute\("aria-hidden", "true"\)/, "covered original must leave the a11y tree");
assert.match(html, /class="alt" hidden aria-hidden="true"/, "alt text starts hidden and out of the a11y tree");

/* 动态登记：arrivals 为 0 时不得出现「第 0 次抵达」 */
assert.match(js, /arrivals > 0/);
assert.match(js, /抵达记录：未登记/);
assert.match(js, /本班新增访客：你/);

/* 值夜状态字段、解锁条件与签退拒绝 */
assert.match(js, /goddead_watch/);
assert.match(js, /你没有签到，无法签退/);

/* 值夜室声音只走 WebAudio 体系，服从全局静音 */
assert.match(js, /hum\(true\)/);
assert.match(js, /phoneRing/);
assert.match(js, /goddead_muted/);
assert.ok(!/\.mp3|\.wav|\.ogg/.test(html + js), "no external audio files");

/* ---------- 文档同步 ---------- */
const readme = await fileText("README.md");
assert.match(readme, /值夜室|night-watch/i);

const qa = await fileText("design-qa.md");
assert.match(qa, /第三值夜室/);
assert.match(qa, /Living Shrine|场景探索/);

const log = await fileText("docs/ProgressLog.md");
assert.match(log, /2026-07-02/);
assert.match(log, /Cloudflare Pages/);

/* ---------- 边界说明 ----------
   本套件为 Node 静态断言，不启动 DOM、不执行真实交互。
   敲门、场景切换、交班簿覆盖、签退、钟针倒退等运行时行为，
   以代码存在性断言 + design-qa.md 内的无头 Chromium 截图人工验收为准。 */
console.log("site.test.mjs: all assertions passed");
