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
assert.match(html, /styles\.css\?v=31/);
assert.match(html, /script\.js\?v=31/);
assert.match(html, /assets\/hero\.png/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(js, /DOMContentLoaded/);

/* ---------- 场景探索结构 ---------- */
const SCENES = ["threshold", "protocol", "corridor", "peephole-chamber", "glyph-niche", "return-passage", "echo", "vein", "confession", "echo-transfer", "vein-pump", "confession-ledger", "watch", "switchboard", "deadletter", "cancellation", "acting", "offering", "reliquary", "remembrance", "ninth"];
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

/* ---------- 旧独立页面：文件保持删除；echo/vein/confession 已改为原生 SPA scene ---------- */
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

/* 入口契约：接听提示与目录入口出厂 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="answer-box"[^>]*\shidden[\s>]/, "answer box must ship hidden");
assert.match(html, /id="switch-link"[^>]*\shidden[\s>]/, "menu switch link must ship hidden");
assert.match(html, /id="switch-link"[^>]*>02¾ \/ 第四线路</);
assert.match(html, /id="log-phone"/, "05:02 entry needs its own id for the unlock condition");
assert.ok(!html.includes('id="answer-btn"'), "answer button removed — switchboard auto-advances");
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

/* 入口契约：交换台内提示与目录入口出厂 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="deliver-box"[^>]*\shidden[\s>]/, "deliver box must ship hidden");
assert.ok(!html.includes('id="deliver-btn"'), "deliver button removed — switchboard auto-advances to deadletter");
assert.match(html, /id="deadletter-link"[^>]*\shidden[\s>]/, "menu deadletter link must ship hidden");
assert.match(html, /id="deadletter-link"[^>]*>02⅞ \/ 投递所</);
/* 出口：只保留明确的回退导航，没有跨幕 offering 捷径 */
assert.ok(!dlSection[0].includes('data-go="offering"'), "deadletter must not shortcut to offering");
assert.ok(dlSection[0].includes('data-go="switchboard"'), "deadletter keeps switchboard back navigation");

/* 状态字段：容错 key goddead_deadletter，自身状态不得参与入口/守卫判定 */
assert.match(js, /goddead_deadletter/);
assert.match(js, /returned: base\.returned\.map/);
assert.match(js, /accepted: raw\.accepted === true/);
assert.match(js, /acceptedAt: Number\(raw\.acceptedAt\) \|\| 0/);
assert.match(js, /const syncDeadletter = \(\) => \{\s*if \(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected\)/, "entry reveal must share the router's full dependency set");
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

/* ---------- 神名注销科 / THE DIVINE NAME CANCELLATION ---------- */
await access(new URL("assets/divine-name-cancellation.webp", root));
assert.match(html, /id="scene-cancellation"/);
assert.match(html, /data-title="Goddead — 神名注销科"/);
assert.match(html, /assets\/divine-name-cancellation\.webp/);
assert.match(html, /THE DIVINE NAME CANCELLATION · 神 名 注 销 科/);

/* 注销科场景不得出现 inline SVG（主体为位图） */
const cnSection = html.match(/<section class="scene scene-cancel"[\s\S]*?<\/section>/);
assert.ok(cnSection, "cancellation section missing");
assert.ok(!cnSection[0].includes("<svg"), "cancellation must not use inline SVG");

/* 入口契约：投递所内提示与目录入口出厂 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="cancel-box"[^>]*\shidden[\s>]/, "cancel box must ship hidden");
assert.ok(!html.includes('id="cancel-btn"'), "cancel button removed — deadletter auto-advances to cancellation");
assert.match(html, /id="cancel-link"[^>]*\shidden[\s>]/, "menu cancel link must ship hidden");
assert.match(html, /id="cancel-link"[^>]*>02⁺ \/ 注销科</);
/* 出口：只保留明确的回退导航，没有跨幕 offering 捷径 */
assert.ok(!cnSection[0].includes('data-go="offering"'), "cancellation must not shortcut to offering");
assert.ok(cnSection[0].includes('data-go="deadletter"'), "cancellation keeps deadletter back navigation");

/* 状态字段：容错 key goddead_cancellation，自身状态不得参与入口/守卫判定 */
assert.match(js, /goddead_cancellation/);
assert.match(js, /queries: Math\.max\(0, Math\.floor\(Number\(raw\.queries\)\)\) \|\| 0/);
assert.match(js, /solved: raw\.solved === true/);
assert.match(js, /solvedAt: Number\(raw\.solvedAt\) \|\| 0/);
assert.match(js, /refused: raw\.refused === true/);
assert.match(js, /refusedAt: Number\(raw\.refusedAt\) \|\| 0/);
assert.match(js, /const syncCancel = \(\) => \{\s*if \(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected && getDL\(\)\.accepted\)/, "entry reveal must share the router's full dependency set");
assert.match(js, /空白回执生成了一个不该存在的案号。/);

/* 检索表单：原生 form、label 关联、submit、提示 */
assert.match(html, /<form class="cancel-form reveal" id="cancel-form">/);
assert.match(html, /<label class="cancel-label" for="cancel-input">待注销档案<\/label>/);
assert.match(html, /<button class="cancel-submit" type="submit"[^>]*>检索<\/button>/);
assert.match(html, /输入档案状态，不是名字。/);
assert.match(js, /cancelForm\.addEventListener\("submit"/);
/* 答案归一：trim + 大小写归一后只认 GODDEAD */
assert.match(js, /cancelInput\.value\.trim\(\)\.toUpperCase\(\)/);
assert.match(js, /value === "GODDEAD"/);
/* 错误检索持久计数，三句提示递进，第三次后停住 */
assert.match(js, /st\.queries \+= 1/);
for (const hint of ["这里不按名字检索。", "查状态，不查神。", "域名已经替你填过一次答案。"]) {
  assert.ok(js.includes(hint), `cancel hint missing: ${hint}`);
}
assert.match(js, /cancelHints\[Math\.min\(Math\.max\(queries, 1\), 3\) - 1\]/, "hints must clamp at the third");

/* 检索命中：5 行档案记录，reduced-motion 立即完整，aria-live 只播当前 */
for (const line of ["档案状态：GODDEAD。", "对象：所有无法送达的神名。", "注销条件：最后一名见证者停止呼叫。", "当前见证者：你。", "注销对象已更正：见证者。"]) {
  assert.ok(html.includes(line), `cancel record missing: ${line}`);
}
assert.equal((html.match(/class="l4-line cancel-line/g) || []).length, 5, "cancel record must hold exactly 5 lines");
assert.match(js, /reduced\) \{[\s\S]{0,200}cancelLines\.forEach/, "reduced-motion must reveal all cancel record lines at once");
assert.match(js, /cancelRecord\.setAttribute\("aria-live", "polite"\)/);

/* 拒绝注销：原生按钮，驳回两行，持久 refused/refusedAt */
assert.match(html, /id="refuse-btn"[^>]*>拒绝注销<\/button>/);
for (const line of ["驳回理由：仍在见证。", "处理结果：拒绝已登记为在场证明。"]) {
  assert.ok(html.includes(line), `refuse record missing: ${line}`);
}
assert.match(js, /refuseBtn\.addEventListener\("click"/);
assert.match(js, /st\.refused = true/);
assert.match(js, /st\.refusedAt = Date\.now\(\)/);

/* 注销科声音：只走 WebAudio，服从静音，离场清理 */
assert.match(js, /AudioEngine\.type\(\)/);
assert.match(js, /clearCnTimers/);

/* 痕迹页：注销状态与记忆（未拒绝不剧透），8 卡网格 */
assert.match(html, /id="num-cancel"/);
assert.match(html, /注 销/);
assert.match(html, /id="cancel-memory"/);
assert.match(js, /系统试图注销你。你把拒绝留在了档案里。/);
assert.match(js, /st\.refused \? "驳回" : "—"/);
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance must hold exactly 8 stat cards");
assert.match(css, /\.stat-grid \{[\s\S]{0,120}repeat\(4, 1fr\)/, "8 cards should lay out 4 per row on desktop");

/* ---------- 代神席 / THE ACTING DEITY DESK ---------- */
await access(new URL("assets/acting-deity-desk.webp", root));
assert.match(html, /id="scene-acting"/);
assert.match(html, /data-title="Goddead — 代神席"/);
assert.match(html, /assets\/acting-deity-desk\.webp/);
assert.match(html, /THE ACTING DEITY DESK · 代 神 席/);

/* 代神席场景不得出现 inline SVG（主体为位图） */
const acSection = html.match(/<section class="scene scene-acting"[\s\S]*?<\/section>/);
assert.ok(acSection, "acting section missing");
assert.ok(!acSection[0].includes("<svg"), "acting must not use inline SVG");

/* 入口契约：注销科内提示与目录入口出厂 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="acting-box"[^>]*\shidden[\s>]/, "acting box must ship hidden");
assert.ok(!html.includes('id="acting-btn"'), "acting button removed — cancellation auto-advances to acting");
assert.match(html, /id="acting-link"[^>]*\shidden[\s>]/, "menu acting link must ship hidden");
assert.match(html, /id="acting-link"[^>]*>02† \/ 代神席</);
/* 出口：只保留明确的回退导航，没有跨幕 offering 捷径 */
assert.ok(!acSection[0].includes('data-go="offering"'), "acting must not shortcut to offering");
assert.ok(acSection[0].includes('data-go="cancellation"'), "acting keeps cancellation back navigation");

/* 状态字段：容错 key goddead_acting，自身状态不得参与入口/守卫判定 */
assert.match(js, /goddead_acting/);
assert.ok(js.includes('Math.max(0, Math.min(100, Number(raw.value) || 0))'), 'acting value must clamp to 0-100');
assert.match(js, /appointed: raw\.appointed === true/);
assert.match(js, /appointedAt: Number\(raw\.appointedAt\) \|\| 0/);
assert.match(js, /const syncActingEntry = \(\) => \{\s*if \(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected && getDL\(\)\.accepted && getCancel\(\)\.refused\)/, "entry reveal must share the router's full dependency set");
assert.match(js, /你的拒绝被改写成了一份任命。/);

/* 原生 range：label/min/max/step/output/两端文字/三段反馈 */
assert.match(html, /<input class="acting-range" id="acting-range" type="range" min="0" max="100" step="1" value="0"/);
assert.match(html, /<label class="range-visually-hidden" for="acting-range">代神席电闸<\/label>/);
assert.match(html, /<output class="acting-output" id="acting-output" for="acting-range"/);
assert.match(js, /aria-valuetext/);
assert.match(html, /离席/);
assert.match(html, /在岗/);
assert.match(html, /把在场推到不能再高的位置。/);
assert.match(js, /检测到犹豫。/);
assert.match(js, /在场不能只登记一半。/);
assert.match(js, /拒绝注销的人，没有离席选项。/);

/* 到 100 任命：五行 + 终句 */
for (const line of ["任命对象：最后见证者。", "授权来源：注销拒绝。", "接收范围：所有无人应答的祷告。", "神位等级：代行。", "死亡状态：预登记。"]) {
  assert.ok(html.includes(line), `acting record missing: ${line}`);
}
assert.equal((html.match(/class="acting-line"/g) || []).length, 5, "acting record must hold exactly 5 lines");
assert.match(html, /id="acting-final"[^>]*hidden>你没有成为神。你只是接了祂没有交完的班。<\/p>/);
assert.match(js, /st\.appointed = true/);
assert.match(js, /st\.appointedAt = Date\.now\(\)/);
assert.match(js, /actingRange\.disabled = true/);

/* 任命后 acting-switch 成为可聚焦/可点击的恢复入口；未任命时保持为普通容器，
   避免与可用 range 形成嵌套交互冲突 */
assert.match(html, /id="acting-switch"/);
assert.match(js, /const setActingSwitchInteractive = /);
assert.match(js, /setActingSwitchInteractive\(true\)/);
assert.match(js, /setActingSwitchInteractive\(st\.appointed\)/);
assert.match(js, /actingSwitch\.classList\.add\("appointed"\)/);
assert.match(js, /actingSwitch\.setAttribute\("tabindex", "0"\)/);
assert.match(js, /actingSwitch\.setAttribute\("role", "button"\)/);
assert.match(js, /actingSwitch\.setAttribute\("aria-label"/);
assert.match(css, /\.acting-switch\.appointed \{[\s\S]{0,120}\}/, "appointed acting-switch needs distinct styling");
assert.match(css, /\.acting-switch\.appointed \.acting-range \{[^}]*pointer-events:\s*none/, "disabled range must pass clicks to the appointed switch container");

/* 与旧场景联动：offering 描述下新增 hidden 行，remembrance 只新增记忆 */
assert.match(html, /id="acting-offering-note"[^>]*hidden/);
assert.match(html, /这些祷词现在会先经过你。/);
assert.match(html, /id="acting-memory"/);
assert.match(js, /你没有成为神。你只是接了祂没有交完的班。/);

/* 声音：只走 WebAudio，服从静音，离场清理 */
assert.match(js, /switchFriction/);
assert.match(js, /switchContact/);
assert.match(js, /relayLock/);
assert.match(js, /clearActingTimers/);

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
/* 神圣遗物科前置依赖是 7 项全备；
   reliquary 自身 sealed=true 但任一上游缺失时也必须逐级回退 */
assert.match(js, /const reliquaryUnlocked = \(\) =>/, "reliquaryUnlocked contract helper must exist");
assert.match(js, /target === "reliquary" && !reliquaryUnlocked\(\)/, "reliquary requires all 7 upstream prerequisites — stale goddead_reliquary must not pass");
assert.match(js, /target === "offering" && !\(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected && getDL\(\)\.accepted && getCancel\(\)\.refused && getActing\(\)\.appointed\)/, "offering fallback requires all 6 upstream prerequisites");
/* 守卫必须按依赖顺序：reliquary→offering→acting→cancellation→deadletter→switchboard→watch→corridor 逐级归并 */
assert.ok(
  js.indexOf('target === "reliquary"') > -1
    && js.indexOf('target === "reliquary"') < js.indexOf('target === "offering"')
    && js.indexOf('target === "offering"') < js.indexOf('target === "acting"')
    && js.indexOf('target === "acting"') < js.indexOf('target === "cancellation"')
    && js.indexOf('target === "cancellation"') < js.indexOf('target === "deadletter"')
    && js.indexOf('target === "deadletter"') < js.indexOf('target === "switchboard"')
    && js.indexOf('target === "switchboard"') < js.indexOf('target === "watch"'),
  "guards must cascade reliquary → offering → acting → cancellation → deadletter → switchboard → watch → corridor",
);

/* ---------- 神圣遗物科 / THE SACRED RELIQUARY VAULT (v27) ---------- */
await access(new URL("assets/relic-vault-desk.webp", root));
assert.match(html, /id="scene-reliquary"/);
assert.match(html, /data-title="Goddead — 神圣遗物科"/);
assert.match(html, /assets\/relic-vault-desk\.webp/);
assert.match(html, /THE SACRED RELIQUARY VAULT · 神 圣 遗 物 科/);
assert.match(html, /id="relic-1"/);
assert.match(html, /id="relic-2"/);
assert.match(html, /id="relic-3"/);
assert.match(html, /id="seal-btn"/);
assert.match(html, /id="relic-record"/);
assert.match(html, /id="relic-memory"/);

/* 自动转场集成：offering -> reliquary -> remembrance */
assert.match(js, /AutoAdvance\.schedule\("offering", "reliquary"/);
assert.match(js, /AutoAdvance\.schedule\("reliquary", "remembrance"/);
assert.match(js, /clearRelicTimers = \(\) =>/, "clearRelicTimers helper must exist");
assert.match(js, /leaveReliquary = \(\) => \{\s*AutoAdvance\.clear\("reliquary"\);\s*clearRelicTimers\(\);/, "leaveReliquary must clear relic timers on scene exit");
assert.match(js, /if \(reliquaryConsumed\) return;\s*AutoAdvance\.schedule\("reliquary", "remembrance"/, "deferred schedule must be guarded by reliquaryConsumed");

/* 8 卡 Stat Grid 约束保留（不扩充至第 9 卡） */
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance must strictly preserve 8 stat cards");

/* legacy reliquary.html 极简重定向断言 */
const reliquaryHtmlContent = await fileText("reliquary.html");
assert.match(reliquaryHtmlContent, /location\.replace\("index\.html#reliquary"\)/, "legacy reliquary.html must redirect to index.html#reliquary");
assert.ok(!reliquaryHtmlContent.includes("reliquaryUnlocked"), "legacy reliquary.html must not duplicate reliquaryUnlocked logic");

/* 痕迹页内联遗忘确认框断言 */
assert.match(html, /id="forget-confirm-box"/);
assert.match(html, /id="forget-trigger-btn"/);
assert.match(html, /id="forget-panel"[^>]*hidden/);
assert.match(html, /id="forget-cancel-btn"/);
assert.match(html, /id="forget-action-btn"/);
assert.match(js, /forgetActionBtn\.addEventListener\("click"/);
assert.match(js, /k\.toLowerCase\(\)\.includes\("goddead"\)/, "reset key filtering must support case-insensitive goddead matching");
const forgetHandlerBlock = js.match(/forgetActionBtn\.addEventListener\("click",\s*\(\)\s*=>\s*\{([\s\S]*?)\}\);/);
assert.ok(forgetHandlerBlock, "forgetActionBtn click handler must exist");
assert.doesNotMatch(forgetHandlerBlock[1], /saveState\s*\(/, "forgetActionBtn handler must NOT call saveState() to ensure 0 goddead keys remain in localStorage");
assert.match(js, /forgetActionBtn[\s\S]*?renderReliquary\(\);/, "forgetActionBtn must call renderReliquary");
assert.match(js, /forgetActionBtn[\s\S]*?syncReliquaryEntry\(\);/, "forgetActionBtn must resync entry DOM state");
for (const p of ["paintWatch", "paintLine4", "paintDeliver", "paintCancel", "paintActing", "paintRelicMemory"]) {
  assert.ok(forgetHandlerBlock[1].includes(`${p}()`), `forgetActionBtn handler must call ${p}()`);
}
assert.match(js, /gateReliquary\.addEventListener\("click", \(e\) => \{\s*if \(reliquaryUnlocked\(\)\) return;/, "gateReliquary click handler must check reliquaryUnlocked");
assert.match(js, /target !== name && location\.hash === "#" \+ name/, "address bar must normalize to the resolved scene");
assert.match(js, /name = resolveScene\(name\)/, "goScene must route through resolveScene");
assert.match(js, /narrowDoor\.removeAttribute\("hidden"\)/);
assert.match(js, /narrowDoor\.setAttribute\("hidden", ""\)/, "syncWatchDoor must re-add hidden attribute when locked");
assert.match(js, /watchLink\.removeAttribute\("hidden"\)/);
assert.match(js, /watchLink\.setAttribute\("hidden", ""\)/, "syncWatchDoor must re-add watchLink hidden attribute when locked");

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

/* ---------- 现有场景视觉深化（v21） ---------- */
const VISUAL_ASSETS = [
  "threshold-bureau-door.webp",
  "visitor-protocol-board.webp",
  "scripture-corridor.webp",
  "prayer-incinerator.webp",
  "remembrance-evidence-wall.webp",
  "ninth-aperture.webp",
];
for (const asset of VISUAL_ASSETS) {
  await access(new URL(`assets/${asset}`, root));
  assert.match(html, new RegExp(`assets/${asset.replace(".", "\\.")}`), `${asset} must be referenced`);
}

await access(new URL("assets/prayer-incinerator-burning.webp", root));
assert.match(html, /assets\/prayer-incinerator-burning\.webp/);
assert.match(html, /<link rel="preload" href="assets\/prayer-incinerator-burning\.webp" as="image">/);
assert.match(html, /styles\.css\?v=31/);
assert.match(html, /script\.js\?v=31/);
const offeringFigureHtml = html.match(/<figure class="offering-figure[^"]*" role="img" aria-label="[^"]*">[\s\S]*?<\/figure>/);
assert.ok(offeringFigureHtml, "offering figure must exist");
assert.match(offeringFigureHtml[0], /aria-label="一座沉寂的焚献炉"/);
assert.match(offeringFigureHtml[0], /class="offering-img offering-idle-img"/);
assert.match(offeringFigureHtml[0], /class="offering-img offering-burning-img"[^>]*alt=""[^>]*aria-hidden="true"/);

const offeringImgRule = css.match(/\.offering-img\s*\{[^}]+\}/);
assert.ok(offeringImgRule, "offering-img rule must exist");
assert.match(offeringImgRule[0], /transition:\s*opacity\s*0\.4s\s*ease,\s*transform\s*0\.4s\s*ease/);
assert.match(offeringImgRule[0], /transform-origin:\s*center/);
const idleRule = css.match(/\.offering-idle-img\s*\{[^}]+\}/);
assert.ok(idleRule, "offering-idle-img rule must exist");
assert.match(idleRule[0], /opacity:\s*1/);
assert.ok(!/position:\s*absolute/.test(idleRule[0]), "idle must not be position absolute");
const burningRule = css.match(/\.offering-burning-img\s*\{[^}]+\}/);
assert.ok(burningRule, "offering-burning-img rule must exist");
assert.match(burningRule[0], /position:\s*absolute/);
assert.match(burningRule[0], /inset:\s*0/);
assert.match(burningRule[0], /opacity:\s*0/);
const ignitedIdle = css.match(/\.offering-figure\.ignited\s*\.offering-idle-img\s*\{[^}]+\}/);
assert.ok(ignitedIdle, "ignited idle rule must exist");
assert.match(ignitedIdle[0], /opacity:\s*0/);
const ignitedBurning = css.match(/\.offering-figure\.ignited\s*\.offering-burning-img\s*\{[^}]+\}/);
assert.ok(ignitedBurning, "ignited burning rule must exist");
assert.match(ignitedBurning[0], /opacity:\s*1/);
assert.match(ignitedBurning[0], /transform:\s*scale\(1\.015\)/);
const reducedIdx = css.indexOf("@media (prefers-reduced-motion: reduce)");
assert.ok(reducedIdx >= 0, "reduced-motion media query must exist");
const reducedSlice = css.slice(reducedIdx);
assert.match(reducedSlice, /\.offering-img\s*\{\s*transition:\s*none\s*!important\s*;\s*\}/);
assert.match(js, /const offeringFigure = \$\("\.offering-figure"\);/);
assert.match(js, /if \(name === "offering"\) \{ offeringConsumed = false; if \(offeringFigure\) \{ offeringFigure\.classList\.remove\("ignited"\); offeringFigure\.setAttribute\("aria-label", "一座沉寂的焚献炉"\); \} syncRulingOfferingUI\(\); \}/);
const offerPrayerBlock = js.match(/const offerPrayer = \(\) => \{[\s\S]*?\n\s*\};\s*\n\s*prayerOffer\.addEventListener\("click", offerPrayer\);/);
assert.ok(offerPrayerBlock, "offerPrayer function must exist");
assert.match(offerPrayerBlock[0], /if \(!value\) \{[\s\S]{0,200}return;[\s\S]{0,200}\}/);
assert.match(offerPrayerBlock[0], /if \(offeringFigure\) \{ offeringFigure\.classList\.add\("ignited"\); offeringFigure\.setAttribute\("aria-label", "一座仍在燃烧的焚献炉"\); \}/);
assert.ok(offerPrayerBlock[0].indexOf("if (!value)") < offerPrayerBlock[0].indexOf('classList.add("ignited")'), "empty guard must precede ignition");
assert.ok(offerPrayerBlock[0].indexOf('classList.add("ignited")') < offerPrayerBlock[0].indexOf("burnPrayer(value)"), "ignition must precede burnPrayer");

/* 门改为正式位图 + 原生 button/img；旧 inline SVG 门几何清零 */
assert.match(html, /id="door-btn"[^>]*type="button"/);
assert.match(html, /id="door-img"[^>]*src="assets\/threshold-bureau-door\.webp"/);
assert.match(html, /width="1536" height="1024"/);
assert.ok(!/<svg class="door-svg"/.test(html), "threshold inline SVG door must be gone");
assert.ok(!/class="door-svg"/.test(css), "old door SVG CSS must be removed");
/* 开门图应提前预加载，避免第三敲闪白 */
assert.match(html, /<link rel="preload" href="assets\/threshold-bureau-door-open\.webp" as="image">/);
/* 开门图仅作视觉层，不应被屏幕阅读器重复朗读 */
assert.match(html, /id="door-open-img"[^>]*aria-hidden="true"/);
assert.match(js, /const doorBtn = \$\("#door-btn"\)/);
assert.match(js, /doorBtn\.addEventListener\("click", knock\)/);
assert.match(js, /doorBtn\.addEventListener\("keydown",\s*\(e\)\s*=>\s*\{\s*if\s*\(e\.key\s*===\s*" "\)\s*\{\s*e\.preventDefault\(\);\s*knock\(\);\s*\}\s*\}\)/, "doorBtn needs a Space-only keydown fallback");
assert.ok(!/doorBtn\.addEventListener\("keydown"[\s\S]{0,200}e\.key\s*===\s*["']Enter["']/.test(js), "doorBtn keydown fallback must not handle Enter (Enter stays native)");

/* favicon：用现有 hero.png，避免 404 */
assert.match(html, /<link rel="icon"[^>]*href="assets\/hero\.png"/);

/* 第九条 aria-label 全中文 */
assert.match(html, /aria-label="一道不该存在的裂口，底部有一扇错误的窄门"/);

/* 六处场景图均用真实 <img>，不新增 inline SVG/CSS 占位 */
for (const cls of ["protocol-figure", "corridor-figure", "offering-figure", "remembrance-figure", "ninth-figure"]) {
  assert.match(html, new RegExp(`class="${cls}[^"]*"`), `${cls} must exist`);
}
const thresholdSection = html.match(/<section class="scene active" id="scene-threshold"[\s\S]*?<\/section>/);
assert.ok(thresholdSection, "threshold section exists");
assert.ok(!thresholdSection[0].includes("<svg"), "threshold must not use inline SVG for the door");

/* ---------- 自动转场改版（v23） ---------- */
/* 统一调度器：场景作用域、可取消、初始化时不误跳 */
assert.match(js, /const AutoAdvance = /);
assert.match(js, /schedule = \(scene, target, options = \{\}\)/);
assert.match(js, /if \(!initialRouteDone\) return;/);
assert.match(js, /AutoAdvance\.clearAll\(\)/);
assert.match(js, /AutoAdvance\.schedule\("threshold", "protocol"/);
assert.match(js, /AutoAdvance\.schedule\("protocol", "corridor"/);
assert.match(js, /AutoAdvance\.schedule\("corridor", "watch"/);
assert.match(js, /AutoAdvance\.schedule\("watch", "switchboard"/);
assert.match(js, /AutoAdvance\.schedule\("switchboard", "deadletter"/);
assert.match(js, /AutoAdvance\.schedule\("deadletter", "cancellation"/);
assert.match(js, /AutoAdvance\.schedule\("cancellation", "acting"/);
assert.match(js, /AutoAdvance\.schedule\("acting", "offering"/);
assert.match(js, /AutoAdvance\.schedule\("offering", "reliquary"/);
assert.match(js, /AutoAdvance\.schedule\("reliquary", "remembrance"/);

/* 场景切换回到顶部并可靠聚焦标题（visibility 过渡期内 focus 会被拒，需验收重试） */
assert.match(js, /next\.scrollTop = 0;/);
assert.match(js, /const focusReliably = \(el\) => \{/);
assert.match(js, /el\.setAttribute\("tabindex", "-1"\)/);
assert.match(js, /el\.focus\(\{ preventScroll: true \}\)/);
assert.match(js, /if \(document\.activeElement === el\) return;\s*if \(\++tries < 12\) setTimeout\(attempt, 120\);/, "focus must verify landing and retry with a bound");
assert.match(js, /if \(host && !host\.classList\.contains\("active"\)\) return;/, "focus retry must abandon when the host scene is no longer active");
assert.match(js, /if \(title\) focusReliably\(title\);/);

/* protocol 只能主动激活：li 有 tabindex/role/button，监听 click 与 Enter/Space */
assert.match(html, /<li data-rule="1"[^>]*tabindex="0"[^>]*role="button"/);
assert.match(js, /li\.addEventListener\("keydown", \(e\) => \{\s*if \(e\.key === "Enter" \|\| e\.key === " "\)/);

/* 线性路径早期场景（threshold~acting）上不再存在向 offering 的跨幕捷径 */
const earlyHtml = html.slice(0, html.indexOf('id="scene-reliquary"'));
assert.ok(!earlyHtml.includes('data-go="offering"'), "no early cross-scene shortcuts to offering remain");

/* 底部前进按钮与二次确认按钮已删除 */
assert.ok(!html.includes('id="door-choice"'), "threshold door choice removed — auto-advance on third knock");
assert.ok(!html.includes('id="enter-door"'), "enter-door button removed");
assert.ok(!html.includes('id="decline-door"'), "decline-door button removed");

/* 逐行叙事动画压缩到约 1 秒 */
assert.match(js, /150 \+ i \* 120/);
assert.match(js, /150 \+ cancelLines\.length \* 120/);
assert.match(js, /150 \+ actingLines\.length \* 120 \+ 250/);

/* reduced-motion 与普通模式均覆盖 */
assert.match(js, /reduced\s*\?\s*350\s*:\s*900\s*\+\s*Math\.floor\(Math\.random\(\)\s*\*\s*420\)/);

/* 会话内消耗标记：只在 timer 触发前（before 回调）置 true，sceneInit 重置 */
for (const marker of ["thresholdConsumed", "protocolConsumed", "corridorConsumed", "watchConsumed", "cancellationConsumed", "actingConsumed", "offeringConsumed"]) {
  assert.ok(js.includes(marker), `${marker} session marker must exist`);
}
assert.match(js, /if \(name === "threshold"\) \{ thresholdConsumed = false;/);
assert.match(js, /if \(name === "protocol"\) \{ protocolConsumed = false;/);
assert.match(js, /if \(name === "corridor"\) \{ corridorConsumed = false;/);
assert.match(js, /if \(name === "watch"\) \{ watchConsumed = false;/);
assert.match(js, /if \(name === "cancellation"\) \{ cancellationConsumed = false;/);
assert.match(js, /if \(name === "acting"\) \{ actingConsumed = false;/);
assert.match(js, /if \(name === "offering"\) \{ offeringConsumed = false;/);
assert.match(js, /before: \(\) => \{ knocks = 0; thresholdConsumed = true; \}/);
assert.match(js, /before: \(\) => \{ protocolConsumed = true; \}/);
assert.match(js, /before: \(\) => \{ corridorConsumed = true; \}/);
assert.match(js, /before: \(\) => \{ watchConsumed = true; \}/);
assert.match(js, /before: \(\) => \{ cancellationConsumed = true; \}/);
assert.match(js, /before: \(\) => \{ actingConsumed = true; \}/);
assert.match(js, /before: \(\) => \{ offeringConsumed = true; \}/);
/* 第三敲后门进入 opened 视觉状态；完成后 threshold 重进可主动重武装 */
assert.match(js, /doorScene\.classList\.add\("ajar", "opened"\)/);
assert.match(js, /const syncDoorOpenState = /);
assert.match(js, /门已打开，点击或按 Enter、Space 继续/);
assert.match(js, /if \(doorScene\.classList\.contains\("opened"\)\)\s*\{/);
assert.match(js, /if \(knocks === 3\) \{\s*doorScene\.classList\.add\("ajar", "opened"\);\s*seamWhisper\.textContent = "……进来";\s*AudioEngine\.bell\(\);\s*doorBtn\.setAttribute\("aria-label", "门已打开，点击或按 Enter、Space 继续"\);/);
assert.match(js, /tryScheduleThreshold\(\);/);
/* watch：pointerenter 只做被动揭字，不得更新状态或 schedule；主动 click/Enter/Space 才 schedule */
assert.match(js, /entry\.addEventListener\("pointerenter", \(\) => coverLogVisual/);
assert.match(js, /btn\.addEventListener\("click", \(\) => coverLogActive/);
assert.ok(!/pointerenter[\s\S]{0,120}maybeUnlockLine4/.test(js), "watch pointerenter must not call maybeUnlockLine4");
assert.ok(!/pointerenter[\s\S]{0,120}tryScheduleWatch/.test(js), "watch pointerenter must not schedule");
assert.match(js, /const tryScheduleWatch = \(\) => \{/);
assert.match(js, /tryScheduleWatch\(\);/);

/* cancellation/acting 提供回退后恢复调度的主动入口 */
assert.match(js, /const tryScheduleCancellation = \(\) => \{/);
assert.match(js, /const tryScheduleActing = \(\) => \{/);
assert.match(js, /actingSwitch\.addEventListener\("click", tryScheduleActing\);/);
assert.match(js, /actingSwitch\.addEventListener\("keydown",/);

/* ---------- 短桌面首屏可操作性 + 焦点/统计优化 ---------- */
/* 短桌面断点：≤800px 高度时核心控件首屏可见 */
assert.match(css, /@media\s*\(\s*min-width:\s*721px\s*\)\s*and\s*\(\s*max-height:\s*800px\s*\)/, "short-desktop breakpoint required");
assert.match(css, /padding-top:\s*clamp\(92px,\s*10vh,\s*130px\)/, "short-desktop scenes keep topbar clearance");
assert.match(css, /\.protocol-body\s*\{[\s\S]{0,220}display:\s*grid/, "protocol uses short-desktop grid");
assert.match(css, /\.watch-room\s*\{[\s\S]{0,220}grid-template-columns/, "watch uses short-desktop grid");
assert.match(css, /\.switch-body[\s\S]{0,200}display:\s*grid/, "switchboard uses short-desktop grid");
assert.match(css, /\.dl-body[\s\S]{0,200}display:\s*grid/, "deadletter uses short-desktop grid");
assert.match(css, /\.cancel-body[\s\S]{0,200}display:\s*grid/, "cancellation uses short-desktop grid");
assert.match(css, /\.acting-body[\s\S]{0,200}display:\s*grid/, "acting uses short-desktop grid");
assert.match(css, /\.protocol-figure\s*\{[\s\S]{0,160}max-height:\s*240px/, "protocol figure capped for short desktop");
assert.match(css, /\.switch-figure[\s\S]{0,200}max-height:\s*230px/, "switchboard figure capped for short desktop");
assert.match(css, /\.dl-figure[\s\S]{0,200}max-height:\s*230px/, "deadletter figure capped for short desktop");
assert.match(css, /\.cancel-figure[\s\S]{0,200}max-height:\s*230px/, "cancellation figure capped for short desktop");
assert.match(css, /\.acting-figure[\s\S]{0,200}max-height:\s*230px/, "acting figure capped for short desktop");
assert.match(css, /\.watch-desk\s*\{[\s\S]{0,160}max-height:\s*140px/, "watch desk capped for short desktop");
assert.match(css, /\.signout-box\s*\{[\s\S]{0,120}grid-column:\s*auto/, "signout box participates in short-desktop grid");

/* 统计值文本溢出：长文本缩小且不换行 */
assert.match(css, /\.stat-num\.is-text\s*\{/, "stat-num has text-value modifier");
assert.match(css, /\.stat-num\.is-text\s*\{[\s\S]{0,160}white-space:\s*nowrap/, "text stat values stay on one line");
assert.match(js, /const setStatNum = /);
assert.match(js, /setStatNum\(numEls\.watch, attempts > 0 \? `未签退 · \$\{attempts\}` : "—", attempts > 0\)/);
assert.match(js, /setStatNum\(numEls\.cancel, st\.refused \? "驳回" : "—", st\.refused\)/);

/* 标题焦点样式：非整框式主题反馈，无默认蓝框 */
assert.match(css, /\.sec-title:focus-visible/, "sec-title has themed focus-visible style");
assert.match(css, /\.sec-title:focus-visible[\s\S]{0,200}outline:\s*none/, "title focus-visible removes default outline");
assert.match(css, /\.sec-title:focus-visible[\s\S]{0,200}box-shadow:\s*0\s+2px\s+0\s+0\s+rgba\(192,\s*74,\s*66/, "title focus uses a bottom blood-line instead of a rectangle");

/* ---------- v28 神圣平衡与代理神明协议（Governance 终局闭环） ---------- */
/* 全部终局 ID 在 script.js 中真实接线（不再只是 HTML/CSS 半成品） */
for (const id of ["begin-governance-box", "begin-governance-btn", "ending-card-box", "ending-title", "ending-narrative", "ending-res-e", "ending-res-a", "ending-res-r", "collection-list", "next-cycle-btn", "collapse-modal", "retry-governance-btn"]) {
  assert.ok(js.includes(`$("#${id}")`), `script.js must wire #${id}`);
}
assert.match(html, /id="begin-governance-box"[^>]*hidden/);
assert.match(html, /id="begin-governance-btn"/);
assert.match(html, /id="ending-card-box"[^>]*hidden/);
assert.match(html, /id="collapse-modal"[^>]*hidden role="dialog" aria-modal="true" aria-labelledby="collapse-title"/);
assert.match(html, /id="retry-governance-btn"/);

/* 结局元数据与推导规则 */
assert.match(js, /const ENDING_META = \{/);
for (const e of ["ascension", "madness", "oblivion", "nightwatch"]) {
  assert.ok(js.includes(`${e}: { name:`), `ENDING_META must describe ${e}`);
}
assert.match(js, /res\.E <= 0 \|\| res\.A <= 0 \|\| res\.R >= 100/, "collapse condition must exist");
assert.match(js, /res\.E >= 70 && res\.E > res\.A && res\.E > res\.R/, "ascension rule must exist");
assert.match(js, /res\.R >= 50 && res\.R >= res\.E && res\.R >= res\.A/, "madness rule must exist");
assert.match(js, /res\.A >= 60 && res\.A > res\.E/, "oblivion rule must exist");
assert.match(js, /const VALID_ENDINGS = \["ascension", "madness", "oblivion", "nightwatch"\]/);
assert.match(js, /if \(resultStatus && VALID_ENDINGS\.includes\(resultStatus\) && !unlockedEndings\.includes\(resultStatus\)\)/, "reached endings must persist into the collection");

/* 五组合实际计算验证：deltas 从源码提取后按真实阈值推导，不写死组合 */
const deltasMatch = js.match(/const RULING_DELTAS = (\{[\s\S]*?\n  \});/);
assert.ok(deltasMatch, "RULING_DELTAS literal must exist");
const RULING_DELTAS = eval(`(${deltasMatch[1]})`);
const deriveGovResult = (combo) => {
  const res = { E: 50, A: 50, R: 20 };
  const clamp = (v) => Math.max(0, Math.min(100, v));
  combo.split("").forEach((c, i) => {
    const d = RULING_DELTAS[["acting", "offering", "reliquary"][i]][c];
    res.E = clamp(res.E + d.E); res.A = clamp(res.A + d.A); res.R = clamp(res.R + d.R);
  });
  if (res.E <= 0 || res.A <= 0 || res.R >= 100) return "collapse";
  if (res.E >= 70 && res.E > res.A && res.E > res.R) return "ascension";
  if (res.R >= 50 && res.R >= res.E && res.R >= res.A) return "madness";
  if (res.A >= 60 && res.A > res.E) return "oblivion";
  return "nightwatch";
};
assert.equal(deriveGovResult("ABA"), "ascension", "ABA must reach ascension");
assert.equal(deriveGovResult("AAB"), "madness", "AAB must reach madness");
assert.equal(deriveGovResult("AAA"), "oblivion", "AAA must reach oblivion");
assert.equal(deriveGovResult("BBA"), "nightwatch", "BBA must reach nightwatch");
assert.equal(deriveGovResult("BAB"), "collapse", "BAB must collapse");

/* 状态保存与容错：损坏 localStorage 安全修复；parse 永不自增 cycleCount */
const govParseBlock = js.match(/const parseAndValidateGovernance = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(govParseBlock, "parseAndValidateGovernance must exist");
assert.match(govParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt governance storage must be safely repaired");
assert.match(govParseBlock[0], /typeof raw\.cycleCount === "number" && raw\.cycleCount >= 1 \? Math\.floor\(raw\.cycleCount\) : 1/, "cycleCount validated with floor and default 1");
assert.doesNotMatch(govParseBlock[0], /cycleCount\s*(\+\+|\+\s*1)/, "parse must never increment cycleCount");

/* cycle 重置：只清本轮 rulings，保留图鉴与旧主线进度 */
const govResetBlock = js.match(/const resetGovernanceCycle = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(govResetBlock, "resetGovernanceCycle must exist");
assert.match(govResetBlock[0], /cycleCount: gov\.cycleCount \+ 1/, "cycleCount increments exactly once per manual new cycle");
assert.match(govResetBlock[0], /rulings: \{ acting: null, offering: null, reliquary: null \}/, "reset clears only this cycle's rulings");
assert.match(govResetBlock[0], /unlockedEndings: gov\.unlockedEndings/, "reset preserves the ending collection");
assert.match(govResetBlock[0], /hudUnlocked: true/, "reset keeps governance unlocked");
assert.doesNotMatch(govResetBlock[0], /removeItem|goddead_watch|goddead_line4|goddead_deadletter|goddead_cancellation|goddead_acting|goddead_reliquary|goddead_arrivals/, "cycle reset must not touch main-line progress");

/* 老玩家入口：仅开启治理并去 acting，不清空旧进度、不伪造裁决 */
assert.match(js, /const mainLineDone = getRelic\(\)\.sealed;/);
assert.match(js, /mainLineDone && !gov\.hudUnlocked/, "begin box only shows for finished main line without governance");
const beginGovBlock = js.match(/beginGovernanceBtn\) beginGovernanceBtn\.addEventListener\("click", \(\) => \{[\s\S]*?\}\);/);
assert.ok(beginGovBlock, "begin-governance click handler must exist");
assert.match(beginGovBlock[0], /gov\.hudUnlocked = true;/);
assert.match(beginGovBlock[0], /pendingSceneFocus = rulingActingHeading;/);
assert.match(beginGovBlock[0], /goScene\("acting"\)/);
assert.doesNotMatch(beginGovBlock[0], /removeItem|rulings\.\w+\s*=/, "begin must not clear progress or fabricate rulings");
const nextCycleBlock = js.match(/nextCycleBtn\) nextCycleBtn\.addEventListener\("click", \(\) => \{[\s\S]*?\}\);/);
assert.ok(nextCycleBlock, "next-cycle click handler must exist");
assert.match(nextCycleBlock[0], /resetGovernanceCycle\(\);/);
assert.match(nextCycleBlock[0], /pendingSceneFocus = rulingActingHeading;/, "next cycle prefers focusing the visible ruling heading");
assert.match(nextCycleBlock[0], /goScene\("acting"\)/);

/* 崩解 modal：仅 remembrance 打开、初始聚焦 retry、离场/重试彻底关闭 */
assert.match(js, /gov\.resultStatus === "collapse" && currentScene === "remembrance"\) openCollapseModal\(\);\s*else closeCollapseModal\(\);/, "collapse modal only opens inside remembrance");
assert.match(js, /if \(collapseModal && !collapseModal\.hasAttribute\("hidden"\) && retryGovernanceBtn\) focusEl = retryGovernanceBtn;/, "goScene completion focuses retry while collapse modal is open");
assert.match(js, /leaveReliquary\(\);\s*closeCollapseModal\(\);/, "leaving any scene closes the collapse modal");

/* 焦点生命周期：转场完成与焦点/veil 收尾声同一拍，不再依赖嵌套定时器；看门狗兜底 */
assert.match(js, /let completed = false;\s*const complete = \(\) => \{\s*if \(completed\) return;\s*completed = true;/, "goScene must have an idempotent completion path");
assert.match(js, /setTimeout\(complete, reduced \? 60 : 480\);/, "main transition timer drives the same completion");
assert.match(js, /setTimeout\(complete, reduced \? 600 : 2000\);/, "watchdog timer must backstop the same completion");
const completeBlock = js.match(/const complete = \(\) => \{[\s\S]*?\n    \};/);
assert.ok(completeBlock, "complete() must exist");
assert.match(completeBlock[0], /veil\.classList\.remove\("on"\);\s*veilBusy = false;/, "veil release and veilBusy reset happen inside completion");
assert.doesNotMatch(completeBlock[0], /setTimeout\(/, "completion must not chain nested timers for focus or veil");
assert.match(js, /if \(!focusEl && pendingSceneFocus && pendingSceneFocus\.getClientRects\(\)\.length > 0\) focusEl = pendingSceneFocus;/, "handler-specified focus target wins when visible");

/* 焦点陷阱：打开挂监听、关闭/离场移除；Tab 与 Shift+Tab 均留在 modal 内 */
assert.match(js, /const onCollapseKeydown = \(e\) => \{/);
assert.match(js, /document\.addEventListener\("keydown", onCollapseKeydown, true\)/, "focus trap listener attaches on open");
assert.match(js, /document\.removeEventListener\("keydown", onCollapseKeydown, true\)/, "focus trap listener detaches on close");
assert.match(js, /e\.shiftKey && \(document\.activeElement === first \|\| !collapseModal\.contains\(document\.activeElement\)\)/, "Shift+Tab wraps to the last focusable");
assert.match(js, /!e\.shiftKey && \(document\.activeElement === last \|\| !collapseModal\.contains\(document\.activeElement\)\)/, "Tab wraps to the first focusable");
const retryBlock = js.match(/retryGovernanceBtn\) retryGovernanceBtn\.addEventListener\("click", \(\) => \{[\s\S]*?\}\);/);
assert.ok(retryBlock, "retry click handler must exist");
assert.match(retryBlock[0], /resetGovernanceCycle\(\);/);
assert.match(retryBlock[0], /closeCollapseModal\(\);/);
assert.match(retryBlock[0], /pendingSceneFocus = rulingActingHeading;/, "retry prefers focusing the visible ruling heading");
assert.match(retryBlock[0], /goScene\("acting"\)/);

/* 结局卡渲染与图鉴标记 */
assert.match(js, /endingTitle\) endingTitle\.textContent = meta\.name;/);
assert.match(js, /endingNarrative\) endingNarrative\.textContent = meta\.narrative;/);
assert.match(js, /gov\.unlockedEndings\.includes\(id\) \? " unlocked" : ""/, "collection marks unlocked endings");

/* 主动作完成即自动推进：continue 按钮只是非必需 fallback，不是必经步骤 */
const applyRulingActingBlock = js.match(/const applyRulingActingChoice = \(choice\) => \{[\s\S]*?\n  \};/);
assert.match(applyRulingActingBlock[0], /scheduleActingAutoAdvance\(\);/, "ruling 1 auto-advances without requiring a continue click");
const applyRulingOfferingBlock = js.match(/const applyRulingOfferingChoice = \(choice\) => \{[\s\S]*?\n  \};/);
assert.match(applyRulingOfferingBlock[0], /scheduleOfferingAutoAdvance\(\);/, "ruling 2 auto-advances without requiring a continue click");
const applyRulingReliquaryBlock = js.match(/const applyRulingReliquaryChoice = \(choice\) => \{[\s\S]*?\n  \};/);
assert.match(applyRulingReliquaryBlock[0], /revealRelicRecordAndAdvance\(\);/, "ruling 3 reveals the record and auto-advances");
assert.match(applyRulingReliquaryBlock[0], /saveGovernance\(parseAndValidateGovernance\(\)\)/, "final ruling must persist the derived ending into the collection");
assert.match(js, /continueActingBtn\.addEventListener\("click", scheduleActingAutoAdvance\)/);
assert.match(js, /continueOfferingBtn\.addEventListener\("click", scheduleOfferingAutoAdvance\)/);
assert.match(js, /continueReliquaryBtn\.addEventListener\("click", scheduleReliquaryAutoAdvance\)/);

/* 场景进入时同步 HUD / ruling / 终局面板 */
assert.match(js, /if \(name === "remembrance"\) \{[\s\S]{0,400}syncGovernanceRemembrance\(\);/, "remembrance entry syncs governance panels");
assert.match(js, /if \(name === "offering"\) \{[\s\S]{0,300}syncRulingOfferingUI\(\);/, "offering entry syncs ruling 2");
assert.match(js, /const enterReliquary = \(\) => \{[\s\S]{0,160}syncRulingReliquaryUI\(\);/, "reliquary entry syncs ruling 3");

/* ---------- v29 旁路支线：回声 / 血管 / 忏悔（原生 SPA scene） ---------- */
/* 素材存在且被引用 */
for (const asset of ["echo-archive.webp", "vein-maintenance-well.webp", "confession-weighing-room.webp"]) {
  await access(new URL(`assets/${asset}`, root));
  assert.match(html, new RegExp(`assets/${asset.replace(".", "\\.")}`), `${asset} must be referenced`);
}
/* 三场景结构：语义 button 热点、aria-live 反馈、回走廊出口、无必点继续按钮 */
const branchSceneIds = { echo: "回声档案室", vein: "血管维修井", confession: "忏悔称量室" };
for (const [b, title] of Object.entries(branchSceneIds)) {
  assert.match(html, new RegExp(`id="scene-${b}" data-scene="${b}"`), `${b} scene must exist`);
  assert.match(html, new RegExp(`data-title="Goddead — ${title}"`));
  const section = html.match(new RegExp(`<section class="scene scene-branch" id="scene-${b}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `${b} section must exist`);
  assert.equal((section[0].match(/<button class="branch-btn"/g) || []).length, 3, `${b} must hold exactly 3 focusable hotspot buttons`);
  assert.match(section[0], /aria-pressed="false"/, `${b} hotspot buttons carry toggle semantics`);
  assert.match(section[0], /aria-live="polite"/, `${b} needs an aria-live feedback line`);
  assert.match(section[0], /data-go="corridor"/, `${b} keeps an explicit back-to-corridor exit`);
  assert.ok(!/继续|continue/i.test(section[0]), `${b} must not add a required continue button`);
  assert.ok(!section[0].includes("<svg"), `${b} must not use inline SVG`);
}
for (const id of ["echo-choice-knock", "echo-choice-steps", "echo-choice-bell", "vein-choice-down", "vein-choice-up", "vein-choice-isolate", "confession-choice-door", "confession-choice-seven", "confession-choice-refuse", "echo-response", "vein-response", "confession-response", "branch-entry-echo", "branch-entry-vein", "branch-entry-confession", "branch-memory"]) {
  assert.match(html, new RegExp(`id="${id}"`), `#${id} missing`);
}
/* 走廊与目录的访问后入口出厂 hidden */
assert.match(html, /id="branch-entry-echo" type="button" hidden data-go="echo"/);
assert.match(html, /id="branch-entry-vein" type="button" hidden data-go="vein"/);
assert.match(html, /id="branch-entry-confession" type="button" hidden data-go="confession"/);
assert.match(html, /<a href="#echo" id="echo-link" hidden/);
assert.match(html, /<a href="#vein" id="vein-link" hidden/);
assert.match(html, /<a href="#confession" id="confession-link" hidden/);
/* 状态契约：容错解析、visited/lastChoice 字段、坏 JSON 回退 */
assert.match(js, /const BRANCH_KEY = "goddead_v29_branches";/);
assert.match(js, /const BRANCH_SCENES = \["echo", "vein", "confession"\];/);
const branchParseBlock = js.match(/const getBranches = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(branchParseBlock, "getBranches must exist");
assert.match(branchParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt branch storage must be safely repaired");
assert.match(branchParseBlock[0], /visited\[b\] = Boolean\(raw\.visited && raw\.visited\[b\] === true\)/);
assert.match(branchParseBlock[0], /lastChoice\[b\] = typeof \(raw\.lastChoice && raw\.lastChoice\[b\]\) === "string"/);
/* f2/f3/f4 首击分支优先，取消主线 corridor 调度；visited 点击时立即持久化（转场被取消也不丢支线） */
assert.match(js, /const FRAG_BRANCH = \{ f2: "echo", f3: "vein", f4: "confession" \};/);
assert.match(js, /AutoAdvance\.clear\("corridor"\);\s*const st = getBranches\(\);\s*st\.visited\[branch\] = true;\s*saveBranches\(st\);\s*syncBranchEntries\(\);\s*AutoAdvance\.schedule\("corridor", branch, \{/, "branch visit must persist at click time and cancel the main-line corridor schedule");
/* AutoAdvance 看门狗：主定时器丢失时同一条 fire 兜底，已触发/取消自动空转 */
assert.match(js, /const fire = \(\) => \{\s*if \(!timers\.has\(scene\)\) return;\s*timers\.delete\(scene\);/, "AutoAdvance schedule must use an idempotent fire path");
assert.match(js, /setTimeout\(fire, ms\);\s*timers\.set\(scene, \{ id, target \}\);[\s\S]{0,120}setTimeout\(fire, ms \+ 2000\);/, "AutoAdvance must schedule a watchdog fire");
/* 分支延迟约 0.7–1.0s / reduced 0.3s */
assert.match(js, /const branchDelay = \(\) => reduced \? 300 : 700 \+ Math\.floor\(Math\.random\(\) \* 300\);/);
/* 九个选择目的地（v30：bell/isolate/refuse 改接入深层区域） */
assert.match(js, /knock: \{ btn: "#echo-choice-knock", target: "threshold"/);
assert.match(js, /steps: \{ btn: "#echo-choice-steps", target: "corridor"/);
assert.match(js, /bell: \{ btn: "#echo-choice-bell", target: "echo-transfer"/);
assert.match(js, /down: \{ btn: "#vein-choice-down", target: "corridor"/);
assert.match(js, /up: \{ btn: "#vein-choice-up", target: "protocol"/);
assert.match(js, /isolate: \{ btn: "#vein-choice-isolate", target: "vein-pump"/);
assert.match(js, /door: \{ btn: "#confession-choice-door", target: "protocol"/);
assert.match(js, /seven: \{ btn: "#confession-choice-seven", target: "corridor"/);
assert.match(js, /refuse: \{ btn: "#confession-choice-refuse", target: "confession-ledger"/);
/* 失败回流契约保留在 v29 调度器内 */
assert.match(js, /const target = ok \? choice\.target : "corridor";/, "failed conditional choices must flow back to corridor");
/* v29 选择命中深层区域时到访标记点击即持久化 */
assert.match(js, /if \(DEEP_SCENES\.includes\(target\)\) markDeepVisited\(target\);\s*AutoAdvance\.schedule\(sceneKey, target, \{ delay: branchDelay\(\) \}\);/, "branch choice into a deep scene must persist the visit at click time");
/* 路由守卫：未访问支线直达落回走廊 */
assert.match(js, /if \(BRANCH_SCENES\.includes\(target\) && !branchState\.visited\[target\]\) target = "corridor";/);
/* 场景进入同步与旁路记忆 */
assert.match(js, /if \(BRANCH_SCENES\.includes\(name\)\) enterBranch\(name\);/);
assert.match(js, /if \(name === "corridor"\) \{ corridorConsumed = false; syncWatchDoor\(\); syncBranchEntries\(\); syncDeepEntries\(\); startTrace\(\); \}/);
assert.match(js, /const paintBranchMemory = \(\) => \{/);
assert.match(js, /paintBranchMemory\(\);/);
assert.match(js, /你走过 \$\{visitedNames\.length\} 条旁路/);
/* 痕迹页仍是 8 卡，不新增第九卡 */
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance must strictly preserve 8 stat cards");

/* ---------- v30 深层支线：失真转接室 / 逆流泵房 / 无名罪籍库 ---------- */
/* 素材存在且被引用 */
for (const asset of ["echo-transfer-chamber.webp", "reverse-flow-pump-room.webp", "nameless-ledger-vault.webp"]) {
  await access(new URL(`assets/${asset}`, root));
  assert.match(html, new RegExp(`assets/${asset.replace(".", "\\.")}`), `${asset} must be referenced`);
}
/* 三深层场景结构：语义 button 热点、aria-live 反馈、回父支线出口、无必点继续按钮 */
const deepSceneIds = { "echo-transfer": "失真转接室", "vein-pump": "逆流泵房", "confession-ledger": "无名罪籍库" };
const deepParentExits = { "echo-transfer": "echo", "vein-pump": "vein", "confession-ledger": "confession" };
for (const [d, title] of Object.entries(deepSceneIds)) {
  assert.match(html, new RegExp(`id="scene-${d}" data-scene="${d}"`), `${d} scene must exist`);
  assert.match(html, new RegExp(`data-title="Goddead — ${title}"`));
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-deep" id="scene-${d}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `${d} section must exist`);
  assert.equal((section[0].match(/<button class="branch-btn"/g) || []).length, 3, `${d} must hold exactly 3 focusable hotspot buttons`);
  assert.match(section[0], /aria-pressed="false"/, `${d} hotspot buttons carry toggle semantics`);
  assert.match(section[0], /aria-live="polite"/, `${d} needs an aria-live feedback line`);
  assert.match(section[0], new RegExp(`data-go="${deepParentExits[d]}"`), `${d} keeps an explicit back-to-parent exit`);
  assert.ok(!/继续|continue/i.test(section[0]), `${d} must not add a required continue button`);
  assert.ok(!section[0].includes("<svg"), `${d} must not use inline SVG`);
}
for (const id of ["echo-transfer-choice-relay", "echo-transfer-choice-seal", "echo-transfer-choice-bell", "vein-pump-choice-release", "vein-pump-choice-sediment", "vein-pump-choice-ladder", "ledger-choice-crossout", "ledger-choice-archive", "ledger-choice-reject", "echo-transfer-response", "vein-pump-response", "confession-ledger-response", "branch-entry-echo-transfer", "branch-entry-vein-pump", "branch-entry-confession-ledger", "deep-memory"]) {
  assert.match(html, new RegExp(`id="${id}"`), `#${id} missing`);
}
/* 走廊与目录的深层入口出厂 hidden */
assert.match(html, /id="branch-entry-echo-transfer" type="button" hidden data-go="echo-transfer"/);
assert.match(html, /id="branch-entry-vein-pump" type="button" hidden data-go="vein-pump"/);
assert.match(html, /id="branch-entry-confession-ledger" type="button" hidden data-go="confession-ledger"/);
assert.match(html, /<a href="#echo-transfer" id="echo-transfer-link" hidden/);
assert.match(html, /<a href="#vein-pump" id="vein-pump-link" hidden/);
assert.match(html, /<a href="#confession-ledger" id="confession-ledger-link" hidden/);
/* 深层状态契约：独立 key、容错解析、deepVisited/lastDeepChoice 字段 */
assert.match(js, /const DEPTH_KEY = "goddead_v30_branch_depth";/);
assert.match(js, /const DEEP_SCENES = \["echo-transfer", "vein-pump", "confession-ledger"\];/);
assert.match(js, /const DEEP_PARENT = \{ "echo-transfer": "echo", "vein-pump": "vein", "confession-ledger": "confession" \};/);
const depthParseBlock = js.match(/const getDepth = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(depthParseBlock, "getDepth must exist");
assert.match(depthParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt depth storage must be safely repaired");
assert.match(depthParseBlock[0], /deepVisited\[d\] = Boolean\(raw\.deepVisited && raw\.deepVisited\[d\] === true\)/);
assert.match(depthParseBlock[0], /lastDeepChoice\[d\] = typeof \(raw\.lastDeepChoice && raw\.lastDeepChoice\[d\]\) === "string"/);
/* 三角网络九个动作的目的地 */
assert.match(js, /relay: \{ btn: "#echo-transfer-choice-relay", target: "vein-pump"/);
assert.match(js, /seal: \{ btn: "#echo-transfer-choice-seal", target: "protocol"/);
assert.match(js, /release: \{ btn: "#vein-pump-choice-release", target: "echo-transfer"/);
assert.match(js, /sediment: \{ btn: "#vein-pump-choice-sediment", target: "confession-ledger"/);
assert.match(js, /crossout: \{ btn: "#ledger-choice-crossout", target: "echo-transfer"/);
assert.match(js, /archive: \{ btn: "#ledger-choice-archive", target: "vein-pump"/);
/* 条件动作：03:17 再响与应急梯需 watchUnlocked，差异化失败出口 */
assert.match(js, /btn: "#echo-transfer-choice-bell", target: "watch"[\s\S]*?failTarget: "corridor",\s*guard: \(\) => watchUnlocked\(\)/, "deep bell requires watchUnlocked and falls back to corridor");
assert.match(js, /btn: "#vein-pump-choice-ladder", target: "watch"[\s\S]*?failTarget: "protocol",\s*guard: \(\) => watchUnlocked\(\)/, "emergency ladder requires watchUnlocked and falls back to protocol");
/* 拒收整份记录：三深层全到访才给特别出口，按解锁状态去 watch/corridor，否则回 protocol */
assert.match(js, /btn: "#ledger-choice-reject", target: \(\) => \(watchUnlocked\(\) \? "watch" : "corridor"\)[\s\S]*?failTarget: "protocol",\s*guard: \(\) => DEEP_SCENES\.every\(\(d\) => getDepth\(\)\.deepVisited\[d\]\)/, "ledger reject requires all three deep visits");
/* chooseDeep 调度：guard 判定、函数目标、失败出口与点击即持久化 */
assert.match(js, /const target = ok\s*\?\s*\(typeof choice\.target === "function" \? choice\.target\(\) : choice\.target\)\s*:\s*\(choice\.failTarget \|\| "corridor"\);/, "chooseDeep must resolve dynamic targets and fail targets");
assert.match(js, /const chooseDeep = \(sceneKey, choiceKey\) => \{/);
assert.match(js, /if \(DEEP_SCENES\.includes\(name\)\) enterDeep\(name\);/);
/* 深层守卫：未到访直达回退父支线，不凭 direct hash 解锁；且必须先于 v29 守卫执行 */
assert.match(js, /if \(DEEP_SCENES\.includes\(target\) && !depthState\.deepVisited\[target\]\) target = DEEP_PARENT\[target\];/);
assert.ok(
  js.indexOf("DEEP_SCENES.includes(target) && !depthState.deepVisited[target]") < js.indexOf("BRANCH_SCENES.includes(target) && !branchState.visited[target]"),
  "deep guard must run before the v29 branch guard so unvisited parents still fall back to corridor"
);
/* 深层记忆一行 */
assert.match(js, /const paintDeepMemory = \(\) => \{/);
assert.match(js, /paintDeepMemory\(\);/);
assert.match(js, /你下到了更深的地方/);

/* ---------- v31 门前三岔：倒置窥孔 / 失号龛 / 回返夹道 ---------- */
for (const asset of ["assets/forecourt-peephole.webp", "assets/forecourt-glyph-niche.webp", "assets/forecourt-return-passage.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
/* 三张源 PNG 保留 */
for (const src of ["design-references/source-forecourt-peephole.png", "design-references/source-forecourt-glyph-niche.png", "design-references/source-forecourt-return-passage.png"]) {
  await access(new URL(src, root));
}

/* 门外三个原生 button 热点：与门按钮同处一个相对定位容器，带可访问名称 */
assert.match(html, /id="hotspot-peephole" type="button" aria-label="观察门上的黑色日蚀"/);
assert.match(html, /id="hotspot-glyph" type="button" aria-label="触碰左墙上不该数的符号"/);
assert.match(html, /id="hotspot-return" type="button" aria-label="沿着右侧写着回来的痕迹走"/);
const doorSceneBlock = html.match(/<div class="door-scene reveal" id="door-scene">[\s\S]*?<\/div>\s*<p class="status-line/);
assert.ok(doorSceneBlock, "door-scene block must exist");
for (const hs of ["hotspot-peephole", "hotspot-glyph", "hotspot-return"]) {
  assert.ok(doorSceneBlock[0].includes(`id="${hs}"`), `${hs} must live inside door-scene`);
}
assert.ok(html.indexOf('id="door-btn"') < html.indexOf('id="hotspot-peephole"'), "door button keeps its original knock path untouched");
assert.match(css, /\.door-hotspot:focus-visible/);
assert.match(css, /\.door-hotspot \{/);

/* 三个前段场景：沿用 scene-branch 语言，各三动作，零 inline SVG，出口回门外 */
const forecourtSceneIds = { "peephole-chamber": "倒置窥孔", "glyph-niche": "失号龛", "return-passage": "回返夹道" };
for (const [f, title] of Object.entries(forecourtSceneIds)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-forecourt" id="scene-${f}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${f}`);
  assert.ok(section[0].includes(title), `${f} shows its title`);
  assert.equal((section[0].match(/<button class="branch-btn"/g) || []).length, 3, `${f} must hold exactly 3 focusable action buttons`);
  assert.ok(!section[0].includes("<svg"), `${f} must not use inline SVG`);
  assert.match(section[0], /data-go="threshold"/, `${f} keeps an explicit back-to-threshold exit`);
  assert.match(section[0], /aria-pressed="false"/, `${f} actions carry aria-pressed semantics`);
}
for (const id of ["peephole-choice-witness", "peephole-choice-listen", "peephole-choice-close", "glyph-choice-count", "glyph-choice-erase", "glyph-choice-blank", "return-choice-follow", "return-choice-knock", "return-choice-backward", "peephole-response", "glyph-response", "return-response", "forecourt-memory"]) {
  assert.ok(html.includes(`id="${id}"`), `missing element #${id}`);
}
assert.match(html, /<a href="#peephole-chamber" id="peephole-link" hidden/);
assert.match(html, /<a href="#glyph-niche" id="glyph-link" hidden/);
assert.match(html, /<a href="#return-passage" id="return-link" hidden/);

/* v31 状态契约：独立 key、容错解析、visited/marks 白名单/lastChoice/transitions 裁剪 */
assert.match(js, /const FORECOURT_KEY = "goddead_v31_forecourt_weave";/);
assert.match(js, /const FORECOURT_SCENES = \["peephole-chamber", "glyph-niche", "return-passage"\];/);
const forecourtParseBlock = js.match(/const getForecourt = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(forecourtParseBlock, "getForecourt must exist");
assert.match(forecourtParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt forecourt storage must be safely repaired");
assert.match(forecourtParseBlock[0], /visited\[k\] = Boolean\(raw\.visited && raw\.visited\[k\] === true\)/);
assert.match(forecourtParseBlock[0], /raw\.marks\.filter\(\(m\) => FORECOURT_MARKS\.includes\(m\)\)/, "illegal marks must be dropped");
assert.match(forecourtParseBlock[0], /Math\.min\(FORECOURT_TRANSITIONS_CAP, Math\.floor\(transitions\)\)/, "transitions must be clamped");
assert.ok(!forecourtParseBlock[0].includes("goddead_v28") && !forecourtParseBlock[0].includes("goddead_v29") && !forecourtParseBlock[0].includes("goddead_v30"), "forecourt state must not touch v28/v29/v30");

/* 九个动作的合法标记与目的地 */
assert.match(js, /witnessed: \{ btn: "#peephole-choice-witness", target: "protocol"/);
assert.match(js, /heardInside: \{ btn: "#peephole-choice-listen", target: "return-passage"/);
assert.match(js, /refusedSight: \{ btn: "#peephole-choice-close", target: "threshold"/);
assert.match(js, /countedNine: \{ btn: "#glyph-choice-count", target: "peephole-chamber"/);
assert.match(js, /erasedSeven: \{ btn: "#glyph-choice-erase", target: "protocol"/);
assert.match(js, /tookBlank: \{ btn: "#glyph-choice-blank", target: "corridor"/);
assert.match(js, /followedInward: \{ btn: "#return-choice-follow", target: "glyph-niche"/);
assert.match(js, /knockedInside: \{ btn: "#return-choice-knock", target: "protocol"/);
assert.match(js, /walkedBackward: \{ btn: "#return-choice-backward", target: "corridor"/);
/* 三条热点去向 */
assert.match(js, /"hotspot-peephole": \{ target: "peephole-chamber"/);
assert.match(js, /"hotspot-glyph": \{ target: "glyph-niche"/);
assert.match(js, /"hotspot-return": \{ target: "return-passage"/);

/* 守则真实分流：2→回返夹道，3/7→失号龛，4→倒置窥孔；「玖」异常保持原 #ninth 优先 */
assert.match(js, /const RULE_DETOUR = \{ 2: "return-passage", 3: "glyph-niche", 4: "peephole-chamber", 7: "glyph-niche" \};/);
assert.match(js, /if \(AutoAdvance\.has\("protocol"\)\) return;/, "first accepted protocol transition must lock the destination and ignore later rule input");
assert.match(js, /AutoAdvance\.clear\("protocol"\);\s*AutoAdvance\.schedule\("protocol", detour, \{/, "detour replaces the main-line protocol schedule");
assert.match(js, /toast\("你数出了第九条。它一直在等你数出来。"\);\s*goScene\("ninth"\);/, "ninth anomaly path must stay intact");
const rulesCountBlock = js.match(/rulesCount\.addEventListener\("click"[\s\S]*?\}\);/);
assert.ok(rulesCountBlock && !rulesCountBlock[0].includes("detour"), "ninth anomaly must not be rewritten by v31 detour");

/* 幂等与生命周期：连点/重复键盘只记一次只调度一次；点击时持久化 */
assert.match(js, /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "forecourt action must be idempotent while a transition is pending");
assert.match(js, /if \(AutoAdvance\.has\("threshold"\)\) return;/, "door hotspot must be idempotent and never preempt the knock path");
assert.match(js, /const knock = \(\) => \{[\s\S]{0,260}?if \(AutoAdvance\.has\("threshold"\)\) return;/, "threshold first-lock: once any forecourt transition is scheduled, door input is ignored too");
assert.match(js, /if \(!st\.marks\.includes\(mark\)\) st\.marks\.push\(mark\);/, "marks dedupe");
assert.match(js, /if \(FORECOURT_SCENES\.includes\(name\)\) enterForecourt\(name\);/);
assert.match(js, /const enterForecourt = \(sceneKey\) => \{/);
assert.match(js, /markForecourtVisited\(sceneKey\);/, "direct hash arrival counts as a visit");
/* 三个新场景不设守卫：resolveScene 不得拦截 */
const resolveBlock = js.match(/const resolveScene = \(name\) => \{[\s\S]*?\n  \};/);
assert.ok(resolveBlock && !resolveBlock[0].includes("FORECOURT"), "forecourt scenes keep clean direct access, no guard");
/* 痕迹页单行 + 八卡不变 */
assert.match(js, /门前旁路：\$\{names\.join\(" \/ "\)\}；你在门外改道 \$\{st\.transitions\} 次。/);
assert.match(js, /paintForecourtMemory\(\);/);
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* ---------- 文档同步 ---------- */
const readme = await fileText("README.md");
assert.match(readme, /值夜室|night-watch/i);
assert.match(readme, /v28|代行治理|代理神明/, "README must document the v28 governance protocol");
assert.match(readme, /v29|旁路|回声档案室/, "README must document the v29 branch scenes");
assert.match(readme, /v30|深层|失真转接室/, "README must document the v30 deep branch network");
assert.match(readme, /v31|门前|倒置窥孔/, "README must document the v31 forecourt weave");

const qa = await fileText("design-qa.md");
assert.match(qa, /第三值夜室/);
assert.match(qa, /Living Shrine|场景探索/);
assert.match(qa, /视觉深化|visual enrichment|正式图片/i);
assert.match(qa, /v28|代行治理|神圣平衡/, "design-qa.md must document the v28 governance QA");
assert.match(qa, /v29|旁路支线|回声档案室/, "design-qa.md must document the v29 branch QA");
assert.match(qa, /v30|深层支线|失真转接室/, "design-qa.md must document the v30 deep branch QA");
assert.match(qa, /v31|门前三岔|倒置窥孔/, "design-qa.md must document the v31 forecourt QA");

const log = await fileText("docs/ProgressLog.md");
assert.match(log, /2026-07-02/);
assert.match(log, /Cloudflare Pages/);
assert.match(log, /v28|神圣平衡|代理神明/, "ProgressLog must document v28");
assert.match(log, /v29|旁路支线|回声档案室/, "ProgressLog must document v29");
assert.match(log, /v30|深层支线|失真转接室/, "ProgressLog must document v30");
assert.match(log, /v31|门前三岔|倒置窥孔/, "ProgressLog must document v31");

/* ---------- 边界说明 ----------
   本套件为 Node 静态断言，不启动 DOM、不执行真实交互。
   敲门、场景切换、交班簿覆盖、签退、钟针倒退等运行时行为，
   以代码存在性断言 + design-qa.md 内的无头 Chromium 截图人工验收为准。 */
console.log("site.test.mjs: all assertions passed");
