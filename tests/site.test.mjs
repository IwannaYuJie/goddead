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
assert.match(html, /styles\.css\?v=22/);
assert.match(html, /script\.js\?v=22/);
assert.match(html, /assets\/hero\.png/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(js, /DOMContentLoaded/);

/* ---------- 场景探索结构 ---------- */
const SCENES = ["threshold", "protocol", "corridor", "watch", "switchboard", "deadletter", "cancellation", "acting", "offering", "remembrance", "ninth"];
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

/* 入口契约：投递所内入口与目录入口出厂 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="cancel-box"[^>]*\shidden[\s>]/, "cancel box must ship hidden");
assert.match(html, /id="cancel-btn"[^>]*data-go="cancellation"/);
assert.match(html, /送 往 注 销 科/);
assert.match(html, /id="cancel-link"[^>]*\shidden[\s>]/, "menu cancel link must ship hidden");
assert.match(html, /id="cancel-link"[^>]*>02⁺ \/ 注销科</);
/* 出口闭合：主出口 offering，次出口 deadletter */
assert.ok(cnSection[0].includes('data-go="offering"'), "cancellation needs offering exit");
assert.ok(cnSection[0].includes('data-go="deadletter"'), "cancellation needs deadletter exit");

/* 状态字段：容错 key goddead_cancellation，自身状态不得参与入口/守卫判定 */
assert.match(js, /goddead_cancellation/);
assert.match(js, /queries: Math\.max\(0, Math\.floor\(Number\(raw\.queries\)\)\) \|\| 0/);
assert.match(js, /solved: raw\.solved === true/);
assert.match(js, /solvedAt: Number\(raw\.solvedAt\) \|\| 0/);
assert.match(js, /refused: raw\.refused === true/);
assert.match(js, /refusedAt: Number\(raw\.refusedAt\) \|\| 0/);
assert.match(js, /const syncCancel = \(\) => \{\s*if \(!\(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected && getDL\(\)\.accepted\)\) return;/, "entry reveal must share the router's full dependency set");
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

/* 入口契约：注销科内入口与目录入口出厂 hidden（不可聚焦、不在无障碍树） */
assert.match(html, /id="acting-box"[^>]*\shidden[\s>]/, "acting box must ship hidden");
assert.match(html, /id="acting-btn"[^>]*data-go="acting"/);
assert.match(html, /前 往 代 神 席/);
assert.match(html, /id="acting-link"[^>]*\shidden[\s>]/, "menu acting link must ship hidden");
assert.match(html, /id="acting-link"[^>]*>02† \/ 代神席</);
/* 出口闭合：主出口 offering，次出口 cancellation */
assert.ok(acSection[0].includes('data-go="offering"'), "acting needs offering exit");
assert.ok(acSection[0].includes('data-go="cancellation"'), "acting needs cancellation exit");

/* 状态字段：容错 key goddead_acting，自身状态不得参与入口/守卫判定 */
assert.match(js, /goddead_acting/);
assert.ok(js.includes('Math.max(0, Math.min(100, Number(raw.value) || 0))'), 'acting value must clamp to 0-100');
assert.match(js, /appointed: raw\.appointed === true/);
assert.match(js, /appointedAt: Number\(raw\.appointedAt\) \|\| 0/);
assert.match(js, /const syncActingEntry = \(\) => \{\s*if \(!\(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected && getDL\(\)\.accepted && getCancel\(\)\.refused\)\) return;/, "entry reveal must share the router's full dependency set");
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
/* 注销科前置依赖是「三张残页 + 第四线路解锁 + 第四线路接通 + 空白回执签收」四元；
   cancellation 自身 solved/refused=true 但任一上游缺失时也必须逐级回退 */
assert.match(js, /target === "cancellation" && !\(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected && getDL\(\)\.accepted\)\)/, "cancellation requires watch progress AND line4 unlock AND line4 connected AND receipt accepted — stale goddead_cancellation must not pass");
/* 代神席前置依赖是「三张残页 + 第四线路解锁 + 第四线路接通 + 空白回执签收 + 注销拒绝」五元；
   acting 自身 appointed=true 但任一上游缺失时也必须逐级回退 */
assert.match(js, /target === "acting" && !\(watchUnlocked\(\) && line4Unlocked\(\) && getLine4\(\)\.connected && getDL\(\)\.accepted && getCancel\(\)\.refused\)\)/, "acting requires watch progress AND line4 unlock AND line4 connected AND receipt accepted AND cancel refused — stale goddead_acting must not pass");
/* 入口可见性与路由共用同一组依赖：syncLine4 在残页不足时不得恢复接听/目录入口 */
assert.match(js, /const syncLine4 = \(\) => \{\s*if \(!watchUnlocked\(\) \|\| !line4Unlocked\(\)\) return;/, "syncLine4 must share the same dependency set as the router");
/* 守卫必须按依赖顺序：acting→cancellation→deadletter→switchboard→watch→corridor 逐级归并，不可被改写绕过 */
assert.ok(
  js.indexOf('target === "acting"') > -1
    && js.indexOf('target === "acting"') < js.indexOf('target === "cancellation"')
    && js.indexOf('target === "cancellation"') < js.indexOf('target === "deadletter"')
    && js.indexOf('target === "deadletter"') < js.indexOf('target === "switchboard"')
    && js.indexOf('target === "switchboard"') < js.indexOf('target === "watch"'),
  "guards must cascade acting → cancellation → deadletter → switchboard → watch → corridor",
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

/* 门改为正式位图 + 原生 button/img；旧 inline SVG 门几何清零 */
assert.match(html, /id="door-btn"[^>]*type="button"/);
assert.match(html, /id="door-img"[^>]*src="assets\/threshold-bureau-door\.webp"/);
assert.match(html, /width="1536" height="1024"/);
assert.ok(!/<svg class="door-svg"/.test(html), "threshold inline SVG door must be gone");
assert.ok(!/class="door-svg"/.test(css), "old door SVG CSS must be removed");
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

/* ---------- 文档同步 ---------- */
const readme = await fileText("README.md");
assert.match(readme, /值夜室|night-watch/i);

const qa = await fileText("design-qa.md");
assert.match(qa, /第三值夜室/);
assert.match(qa, /Living Shrine|场景探索/);
assert.match(qa, /视觉深化|visual enrichment|正式图片/i);

const log = await fileText("docs/ProgressLog.md");
assert.match(log, /2026-07-02/);
assert.match(log, /Cloudflare Pages/);

/* ---------- 边界说明 ----------
   本套件为 Node 静态断言，不启动 DOM、不执行真实交互。
   敲门、场景切换、交班簿覆盖、签退、钟针倒退等运行时行为，
   以代码存在性断言 + design-qa.md 内的无头 Chromium 截图人工验收为准。 */
console.log("site.test.mjs: all assertions passed");
