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
assert.match(html, /styles\.css\?v=18/);
assert.match(html, /script\.js\?v=18/);
assert.match(html, /assets\/hero\.png/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(js, /DOMContentLoaded/);

/* ---------- 场景探索结构 ---------- */
const SCENES = ["threshold", "protocol", "corridor", "watch", "switchboard", "deadletter", "offering", "remembrance", "ninth"];
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

/* ---------- 第四线路 / 余响交换台 ---------- */
await access(new URL("assets/line-four-switchboard.webp", root));
assert.match(html, /id="scene-switchboard"/);
assert.match(html, /assets\/line-four-switchboard\.webp/);
assert.match(html, /THE FOURTH LINE · 第 四 线 路/);
assert.match(html, /值夜室只负责听见。这里负责决定，那些声音要去哪里。/);

/* 交换台场景不得出现 inline SVG（主体为位图） */
const switchSection = html.match(/<section class="scene scene-switch"[\s\S]*?<\/section>/);
assert.ok(switchSection, "switchboard section missing");
assert.ok(!switchSection[0].includes("<svg"), "switchboard must not use inline SVG");

/* 入口契约：接听按钮与目录入口出厂 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="answer-box"[^>]*\shidden[\s>]/, "answer box must ship hidden");
assert.match(html, /id="switch-link"[^>]*\shidden[\s>]/, "menu switch link must ship hidden");
assert.match(html, /id="switch-link"[^>]*>02¾ \/ 第四线路</);
assert.match(html, /id="log-phone"/, "05:02 entry needs its own id for the unlock condition");
assert.match(js, /goddead_line4/);
assert.match(js, /phoneCovered/);
assert.match(js, /桌下那部不存在的电话，开始第二次响。/);
assert.match(js, /getWatch\(\)\.attempts/, "unlock requires a sign-out attempt");

/* 接线簿：四个语义按钮，第四条出厂 disabled 且有可读原因 */
const patchButtons = switchSection[0].match(/<button class="patch-btn"/g) || [];
assert.equal(patchButtons.length, 4, "patch log must hold exactly 4 line buttons");
assert.match(html, /id="patch-4-btn"[^>]*\sdisabled\s/, "line four must ship truly disabled");
assert.match(html, /aria-describedby="patch-4-reason"/);
assert.match(html, /肆 · 未分配/);
assert.match(js, /肆 · 第四线路/);
assert.match(js, /aria-pressed", "true"\)/);

/* 回线动态文案与第四线记录 */
assert.match(js, /门外响过三次/);
assert.match(js, /份灰。没有一份属于火/);
assert.match(js, /本班签到人数：零/);
for (const line of ["05:02 接通。", "对端：第三值夜室。", "接听人：你。", "记录时间：03:17。", "线路状态：从未断开。"]) {
  assert.ok(html.includes(line), `line4 record missing: ${line}`);
}
assert.match(js, /reduced\) \{[\s\S]{0,200}l4Lines\.forEach/, "reduced-motion must reveal all record lines at once");
assert.match(js, /aria-live", "polite"\)/);

/* 交换台声音：只走 WebAudio，服从静音，离场清理 */
assert.match(js, /lineNoise\(true\)/);
assert.match(js, /lineNoise\(false\)/);
assert.match(js, /clearL4Timers/);
assert.match(js, /AudioEngine\.plug/);

/* 痕迹页：线路状态与记忆 */
assert.match(html, /id="num-line"/);
assert.match(html, /线 路/);
assert.match(html, /id="line-memory"/);
assert.match(js, /你接通了没有端点的第四线路。后来每一次铃响，都算作你在值班。/);
assert.match(js, /st\.connected \? "04" : "—"/);

/* ---------- 无主投递所 / THE DEAD LETTER OFFICE ---------- */
await access(new URL("assets/dead-letter-office.webp", root));
assert.match(html, /id="scene-deadletter"/);
assert.match(html, /data-title="Goddead — 无主投递所"/);
assert.match(html, /assets\/dead-letter-office\.webp/);
assert.match(html, /THE DEAD LETTER OFFICE · 无 主 投 递 所/);
assert.match(html, /第四线路不负责接通。它只负责把无人应答的东西送回来。/);

/* 投递所场景不得出现 inline SVG（主体为位图） */
const dlSection = html.match(/<section class="scene scene-deadletter"[\s\S]*?<\/section>/);
assert.ok(dlSection, "deadletter section missing");
assert.ok(!dlSection[0].includes("<svg"), "deadletter must not use inline SVG");

/* 入口契约：交换台内入口与目录入口出厂 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="deliver-box"[^>]*\shidden[\s>]/, "deliver box must ship hidden");
assert.match(html, /id="deliver-btn"[^>]*data-go="deadletter"/);
assert.match(html, /id="deadletter-link"[^>]*\shidden[\s>]/, "menu deadletter link must ship hidden");
assert.match(html, /id="deadletter-link"[^>]*>02⅞ \/ 投递所</);
/* 出口闭合：主出口 offering，次出口 switchboard */
assert.ok(dlSection[0].includes('data-go="offering"'), "deadletter needs offering exit");
assert.ok(dlSection[0].includes('data-go="switchboard"'), "deadletter needs switchboard exit");

/* 状态字段：容错 key goddead_deadletter，自身状态不得参与入口/守卫判定 */
assert.match(js, /goddead_deadletter/);
assert.match(js, /returned: base\.returned\.map/);
assert.match(js, /accepted: raw\.accepted === true/);
assert.match(js, /acceptedAt: Number\(raw\.acceptedAt\) \|\| 0/);
assert.match(js, /const syncDeadletter = \(\) => \{\s*if \(!\(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected\)\) return;/, "entry reveal must share the router's full dependency set");
assert.match(js, /退回的东西，有了去处。/);

/* 三封退件：语义按钮 + 动态退回原因 */
const returnButtons = html.match(/<button class="patch-btn return-btn"/g) || [];
assert.equal(returnButtons.length, 3, "return desk must hold exactly 3 return buttons");
assert.match(js, /第四次敲击来自门内。退回原因：收件地址不存在。/);
assert.match(js, /尚未投递。系统已提前分配封套。/);
assert.match(js, /灰烬不是邮资。共 \$\{gstate\.prayersOffered\} 份，全部留在原地。/);
assert.match(js, /转作附件/);
assert.match(js, /全部视为续班/);

/* 空白回执：出厂真 disabled、可读理由、三封归档后原子启用改名 */
assert.match(html, /id="receipt-btn"[^>]*\sdisabled\s/, "blank receipt must ship truly disabled");
assert.match(html, /aria-describedby="receipt-reason"/);
assert.match(html, /肆 · 空白回执/);
assert.match(js, /签收空白件/);
assert.match(js, /还有 \$\{3 - done\} 封退件未归档。/);

/* 签收终局记录：6 行，reduced-motion 立即完整，aria-live 只播当前状态 */
for (const line of ["归档时间：03:17。", "未投递：三。", "无人签收：零。", "第四线路不是线路。它是退回地址。", "本局从未收到神。只收到所有写给祂的退件。", "最后收件人：你。"]) {
  assert.ok(html.includes(line), `deadletter record missing: ${line}`);
}
assert.equal((html.match(/class="l4-line dl-line/g) || []).length, 6, "deadletter record must hold exactly 6 lines");
assert.match(js, /reduced\) \{[\s\S]{0,200}dlLines\.forEach/, "reduced-motion must reveal all deadletter record lines at once");
assert.match(js, /dlRecord\.setAttribute\("aria-live", "polite"\)/);

/* 投递所声音：只走 WebAudio，服从静音，离场清理 */
assert.match(js, /AudioEngine\.tube/);
assert.match(js, /AudioEngine\.stamp/);
assert.match(js, /clearDlTimers/);
assert.match(js, /clearTimeout\(dlTubeTimer\)/);

/* 痕迹页：投递状态与记忆（未签收不剧透） */
assert.match(html, /id="num-deliver"/);
assert.match(html, /投 递/);
assert.match(html, /id="deliver-memory"/);
assert.match(js, /你替一间没有收件人的邮局签收了自己。/);
assert.match(js, /st\.accepted \? "03" : "—"/);

/* 硬门槛契约：未解锁时窄门与菜单入口必须 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="narrow-door"[^>]*\shidden[\s>]/, "narrow door must ship with the hidden attribute");
assert.match(html, /id="watch-link"[^>]*\shidden[\s>]/, "menu watch link must ship with the hidden attribute");
assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/i, "global [hidden] guard required against class display overrides");
assert.match(js, /watchUnlocked = \(\) => fragments >= 3/);
assert.match(js, /const resolveScene = \(name\) => \{/, "guards must be centralized in resolveScene");
assert.match(js, /target === "watch" && !watchUnlocked\(\)/, "router must hard-block locked #watch navigation");
/* 交换台前置依赖是「三张残页 + 第四线路解锁」两者，而不是仅 line4 标志：
   陈旧状态（goddead_line4.unlocked=true 但 fragments=0）必须级联落到 corridor */
assert.match(js, /target === "switchboard" && !\(watchUnlocked\(\) && line4Unlocked\(\)\)/, "switchboard requires BOTH watch progress (3 fragments) and line4 unlock — stale line4=true + fragments=0 must not pass");
/* 投递所前置依赖是「三张残页 + 第四线路解锁 + 第四线路接通」三者；
   deadletter 自身 accepted=true 但任一上游缺失时也必须逐级回退 */
assert.match(js, /target === "deadletter" && !\(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected\)\)/, "deadletter requires watch progress AND line4 unlock AND line4 connected — stale goddead_deadletter must not pass");
/* 入口可见性与路由共用同一组依赖：syncLine4 在残页不足时不得恢复接听/目录入口 */
assert.match(js, /const syncLine4 = \(\) => \{\s*if \(!watchUnlocked\(\) \|\| !line4Unlocked\(\)\) return;/, "syncLine4 must share the same dependency set as the router");
/* 守卫必须按依赖顺序：deadletter→switchboard→watch→corridor 逐级归并，不可被改写绕过 */
assert.ok(
  js.indexOf('target === "deadletter"') > -1
    && js.indexOf('target === "deadletter"') < js.indexOf('target === "switchboard"')
    && js.indexOf('target === "switchboard"') < js.indexOf('target === "watch"'),
  "guards must cascade deadletter → switchboard → watch → corridor",
);
assert.match(js, /target !== name && location\.hash === "#" \+ name/, "address bar must normalize to the resolved scene");
assert.match(js, /name = resolveScene\(name\)/, "goScene must route through resolveScene");
assert.match(js, /narrowDoor\.removeAttribute\("hidden"\)/);
assert.match(js, /watchLink\.removeAttribute\("hidden"\)/);

/* 交班簿语义控件：5 个可聚焦按钮，Enter/Space 原生触发 */
const logEntries = html.match(/class="log-entry[ "]/g) || [];
assert.equal(logEntries.length, 5, "handover log must hold exactly 5 entries");
const logButtons = html.match(/<button class="log-cover"/g) || [];
assert.equal(logButtons.length, 5, "each log entry needs a focusable button");
assert.equal((html.match(/<button class="log-cover" type="button" aria-pressed="false"/g) || []).length, 5, "log buttons need toggle semantics");
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
