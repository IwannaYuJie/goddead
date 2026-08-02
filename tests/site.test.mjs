import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

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
assert.match(html, /styles\.css\?v=54/);
assert.match(html, /script\.js\?v=54/);
assert.match(html, /assets\/hero\.png/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(js, /DOMContentLoaded/);

/* ---------- 场景探索结构 ---------- */
const SCENES = ["threshold", "protocol", "corridor", "peephole-chamber", "glyph-niche", "return-passage", "eyelid-archive", "unnumbered-vestibule", "reverse-stairwell", "annex-clearinghouse", "unreturned-witness-gallery", "registry-before-zero", "descending-appeals-stair", "anomaly-review", "evidence-vault", "false-positive-shaft", "unclaimed-valuation", "quota-elevator", "unnumbered-floor", "bellless-ward", "seeping-records", "reverse-laundry", "night-shift-registry", "midnight-callback", "proxy-admission", "return-audit", "echo-turn", "vein-turnstile", "confession-locker", "unlit-lamp-gallery", "borrowed-shadow-gallery", "hinge-sorting-room", "red-thread-registry", "blank-name-cloakroom", "clapperless-bell-desk", "protocol-drift", "counter-knock-gallery", "unanswered-vestibule", "undersill-dispatch", "lagging-shadow-cloister", "ash-door-foundry", "retention-vault", "minute-before-archive", "cold-wick-service-bay", "absent-relief-locker", "unseated-listening-booth", "unnumbered-jack-field", "return-ring-morgue", "unclaimed-pneumatic-intake", "returned-address-cabinet", "blank-receipt-press", "blank-screen-underarchive", "false-confirmation-desk", "witness-carbon-archive", "echo", "vein", "confession", "echo-transfer", "vein-pump", "confession-ledger", "watch", "switchboard", "deadletter", "cancellation", "acting", "offering", "reliquary", "remembrance", "ninth", "concordance-theatre", "innocent-quarantine", "omission-transfer-shaft", "misbound-handover", "liability-ledger", "appeal-registry", "identity-correction", "evidence-contradiction", "destination-review-shaft", "cross-examination-desk", "chain-of-custody-office"];
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
assert.match(html, /styles\.css\?v=54/);
assert.match(html, /script\.js\?v=54/);
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
assert.match(js, /if \(name === "remembrance"\) \{[\s\S]{0,960}syncGovernanceRemembrance\(\);/, "remembrance entry syncs governance panels");
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
  assert.equal((section[0].match(/<button class="branch-btn[ "]/g) || []).length, 4, `${b} must hold exactly 4 focusable hotspot buttons (3 v29 choices + 1 v54 breach)`);
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
/* AutoAdvance 看门狗：代际令牌——主定时器丢失时同一条 fire 兜底；
   已触发/取消自动空转，且旧看门狗绝不劫持同 scope 的新 timer */
assert.match(js, /const record = \{ id: 0, target \};\s*const fire = \(\) => \{\s*if \(timers\.get\(scene\) !== record\) return;\s*timers\.delete\(scene\);/, "AutoAdvance schedule must use a generation-scoped idempotent fire path");
assert.match(js, /timers\.set\(scene, record\);[\s\S]{0,120}setTimeout\(fire, ms \+ 2000\);/, "AutoAdvance must schedule a watchdog fire on the same record");
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
/* 路由守卫：未访问支线直达落回走廊；v39 中间档 outcome 与 v53 信念 pending/已访问是仅有的窄例外 */
assert.match(js, /if \(BRANCH_SCENES\.includes\(target\) && !branchState\.visited\[target\] && AUDIT_BRANCH_OUTCOME\[target\] !== auditGuardState\.outcome\s*\n\s*&& beliefGuard\.pendingTarget !== target && !\(BELIEF_SCENE_BRANCH\[target\] && beliefGuard\.branches\[BELIEF_SCENE_BRANCH\[target\]\]\.visits > 0\)\) target = "corridor";/, "v29 guard keeps the v39 outcome exception and adds only the narrow v53 belief exception");
/* 场景进入同步与旁路记忆 */
assert.match(js, /if \(BRANCH_SCENES\.includes\(name\)\) \{ enterBranch\(name\); syncPressureRoom\(name\); replayPressurePending\(name\); paintPressure\(\); \}/);
assert.match(js, /if \(name === "corridor"\) \{ corridorConsumed = false; corridorDetourArmed = false; syncWatchDoor\(\); syncBranchEntries\(\); syncDeepEntries\(\); startTrace\(\); \}/);
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
/* v49 门前实感：三场景正式图换为 tactile 位图（原 v31 位图文件保留但不再引用） */
for (const asset of ["assets/forecourt-peephole-tactile.webp", "assets/forecourt-glyph-niche-tactile.webp", "assets/forecourt-return-passage-tactile.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
/* 三张冻结源 PNG 保留 */
for (const src of ["design-references/source-v49-forecourt-peephole.png", "design-references/source-v49-forecourt-glyph-niche.png", "design-references/source-v49-forecourt-return-passage.png"]) {
  await access(new URL(src, root));
}

/* 门外三个原生 button 热点：与门按钮同处一个相对定位容器，带可访问名称 */
assert.match(html, /id="hotspot-peephole" type="button" aria-label="观察门上的黑色日蚀"/);
assert.match(html, /id="hotspot-glyph" type="button" aria-label="触碰左墙上不该数的符号"/);
assert.match(html, /id="hotspot-return" type="button" aria-label="沿着右侧写着回来的痕迹走"/);
assert.match(html, /id="hotspot-proxy-admission" type="button" aria-label="拉开门板下方的代审问讯窗"/);
const doorSceneBlock = html.match(/<div class="door-scene reveal" id="door-scene">[\s\S]*?<\/div>\s*<p class="status-line/);
assert.ok(doorSceneBlock, "door-scene block must exist");
for (const hs of ["hotspot-peephole", "hotspot-glyph", "hotspot-return"]) {
  assert.ok(doorSceneBlock[0].includes(`id="${hs}"`), `${hs} must live inside door-scene`);
}
assert.ok(html.indexOf('id="door-btn"') < html.indexOf('id="hotspot-peephole"'), "door button keeps its original knock path untouched");
assert.match(css, /\.door-hotspot:focus-visible/);
assert.match(css, /\.door-hotspot \{/);

/* 三个前段场景：沿用 scene-branch 语言，各三动作（回返夹道另有 v36/v37 第四、第五入口），零 inline SVG，出口回门外 */
const forecourtSceneIds = { "peephole-chamber": ["倒置窥孔", 3], "glyph-niche": ["失号龛", 3], "return-passage": ["回返夹道", 5] };
for (const [f, [title, btnCount]] of Object.entries(forecourtSceneIds)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-forecourt" id="scene-${f}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${f}`);
  assert.ok(section[0].includes(title), `${f} shows its title`);
  assert.equal((section[0].match(/<button class="branch-btn[ "]/g) || []).length, btnCount, `${f} must hold exactly ${btnCount} focusable action buttons`);
  assert.ok(!section[0].includes("<svg"), `${f} must not use inline SVG`);
  assert.match(section[0], /data-go="threshold"/, `${f} keeps an explicit back-to-threshold exit`);
  assert.match(section[0], /aria-pressed="false"/, `${f} actions carry aria-pressed semantics`);
}
for (const id of ["peephole-choice-witness", "peephole-choice-listen", "peephole-choice-close", "glyph-choice-count", "glyph-choice-erase", "glyph-choice-blank", "return-choice-follow", "return-choice-knock", "return-choice-backward", "return-choice-registry", "return-choice-callback", "peephole-response", "glyph-response", "return-response", "forecourt-memory"]) {
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
assert.match(js, /refusedSight: \{ btn: "#peephole-choice-close", target: "eyelid-archive"/);
assert.match(js, /countedNine: \{ btn: "#glyph-choice-count", target: "peephole-chamber"/);
assert.match(js, /erasedSeven: \{ btn: "#glyph-choice-erase", target: "protocol"/);
assert.match(js, /tookBlank: \{ btn: "#glyph-choice-blank", target: "unnumbered-vestibule"/);
assert.match(js, /followedInward: \{ btn: "#return-choice-follow", target: "glyph-niche"/);
assert.match(js, /knockedInside: \{ btn: "#return-choice-knock", target: "protocol"/);
assert.match(js, /walkedBackward: \{ btn: "#return-choice-backward", target: "reverse-stairwell"/);
/* 三条热点去向 */
assert.match(js, /"hotspot-peephole": \{ target: "peephole-chamber"/);
assert.match(js, /"hotspot-glyph": \{ target: "glyph-niche"/);
assert.match(js, /"hotspot-return": \{ target: "return-passage"/);

/* 守则真实分流：2→回返夹道，3/7→失号龛，4→倒置窥孔；「玖」异常保持原 #ninth 优先 */
assert.match(js, /const RULE_DETOUR = \{ 2: "return-passage", 3: "glyph-niche", 4: "peephole-chamber", 5: "return-audit", 6: "midnight-callback", 7: "glyph-niche", 8: "proxy-admission" \};/);
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
/* v40 起启用 v31 门前守卫：未访问直达落回门外，真实路径只读放行 */
const resolveBlock = js.match(/const resolveScene = \(name\) => \{[\s\S]*?\n  \};/);
assert.ok(resolveBlock && resolveBlock[0].includes("FORECOURT_SCENES.includes(target)"), "forecourt scenes gain the v40 guard");
assert.ok(resolveBlock[0].includes('if (!forecourtAllowed) target = "threshold";'), "unvisited direct access falls back to the threshold");
/* 痕迹页单行 + 八卡不变 */
assert.match(js, /门前旁路：\$\{names\.join\(" \/ "\)\}；你在门外改道 \$\{st\.transitions\} 次。/);
assert.match(js, /paintForecourtMemory\(\);/);
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* ---------- v32 门内副楼：闭目档案室 / 无号前厅 / 逆向阶井 ---------- */
/* v50 副楼实感：三场景正式图换为 tactile 位图（原 v32 位图文件保留但不再引用） */
for (const asset of ["assets/inner-annex-eyelid-archive.webp", "assets/inner-annex-unnumbered-vestibule.webp", "assets/inner-annex-reverse-stairwell.webp"]) {
  await access(new URL(asset, root));
}
for (const src of ["design-references/source-inner-annex-eyelid-archive.png", "design-references/source-inner-annex-unnumbered-vestibule.png", "design-references/source-inner-annex-reverse-stairwell.png"]) {
  await access(new URL(src, root));
}

/* 三个副楼场景：沿用 scene-branch 语言，各四动作（闭目档案室/逆向阶井 3 原 + v33 入口；
   无号前厅另有 v35 第五入口）+ v51 各一个 hidden 阈值异常热点（闭眼 5 / 前厅 6 / 阶井 5），
   零 inline SVG，出口回门外 */
const annexSceneIds = { "eyelid-archive": ["闭目档案室", 5], "unnumbered-vestibule": ["无号前厅", 6], "reverse-stairwell": ["逆向阶井", 5] };
for (const [a, [title, btnCount]] of Object.entries(annexSceneIds)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-annex" id="scene-${a}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${a}`);
  assert.ok(section[0].includes(title), `${a} shows its title`);
  assert.equal((section[0].match(/<button class="branch-btn[ "]/g) || []).length, btnCount, `${a} must hold exactly ${btnCount} focusable action buttons`);
  assert.ok(!section[0].includes("<svg"), `${a} must not use inline SVG`);
  assert.match(section[0], /data-go="threshold"/, `${a} keeps an explicit back-to-threshold exit`);
  assert.match(section[0], /aria-pressed="false"/, `${a} actions carry aria-pressed semantics`);
}
for (const id of ["eyelid-choice-search", "eyelid-choice-listen", "eyelid-choice-file", "eyelid-choice-review", "vestibule-choice-tenth", "vestibule-choice-print", "vestibule-choice-exit", "vestibule-choice-review", "vestibule-choice-floor", "stairwell-choice-climb", "stairwell-choice-zeroth", "stairwell-choice-lookback", "stairwell-choice-review", "eyelid-response", "vestibule-response", "stairwell-response", "annex-memory"]) {
  assert.ok(html.includes(`id="${id}"`), `missing element #${id}`);
}
assert.match(html, /<a href="#eyelid-archive" id="eyelid-link" hidden/);
assert.match(html, /<a href="#unnumbered-vestibule" id="vestibule-link" hidden/);
assert.match(html, /<a href="#reverse-stairwell" id="stairwell-link" hidden/);

/* v32 状态契约：独立 key、容错解析（含数组错型）、visited/marks 白名单限长/lastChoice/transitions 裁剪 */
assert.match(js, /const ANNEX_KEY = "goddead_v32_inner_annex";/);
assert.match(js, /const ANNEX_SCENES = \["eyelid-archive", "unnumbered-vestibule", "reverse-stairwell"\];/);
const annexParseBlock = js.match(/const getAnnex = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(annexParseBlock, "getAnnex must exist");
assert.match(annexParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt annex storage must be safely repaired");
assert.match(annexParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(annexParseBlock[0], /visited\[k\] = Boolean\(raw\.visited && raw\.visited\[k\] === true\)/);
assert.match(annexParseBlock[0], /raw\.marks\.filter\(\(m\) => ANNEX_MARKS\.includes\(m\)\)/, "illegal annex marks must be dropped");
assert.match(annexParseBlock[0], /Math\.min\(ANNEX_TRANSITIONS_CAP, Math\.floor\(transitions\)\)/, "annex transitions must be clamped");
assert.ok(!/goddead_v(28|29|30|31)/.test(annexParseBlock[0]), "annex state must not touch v28-v31");

/* 九个副楼动作的合法标记与目的地 */
assert.match(js, /searchedSealedSight: \{ btn: "#eyelid-choice-search", target: "unnumbered-vestibule"/);
assert.match(js, /heardBoxBlink: \{ btn: "#eyelid-choice-listen", target: "protocol"/);
assert.match(js, /filedOwnShadow: \{ btn: "#eyelid-choice-file", target: "threshold"/);
assert.match(js, /hungBlankOnTenth: \{ btn: "#vestibule-choice-tenth", target: "reverse-stairwell"/);
assert.match(js, /leftPrintInBlankLedger: \{ btn: "#vestibule-choice-print", target: "eyelid-archive"/);
assert.match(js, /choseUnnumberedExit: \{ btn: "#vestibule-choice-exit", target: "corridor"/);
assert.match(js, /climbedTowardLowerFloor: \{ btn: "#stairwell-choice-climb", target: "eyelid-archive"/);
assert.match(js, /crossedZerothStep: \{ btn: "#stairwell-choice-zeroth", target: "unnumbered-vestibule"/);
assert.match(js, /lookedBackWithoutTurning: \{ btn: "#stairwell-choice-lookback", target: "protocol"/);

/* 三处 v31 改线：仅目的地变更，反馈文案与 mark 保持 */
assert.match(js, /refusedSight: \{ btn: "#peephole-choice-close", target: "eyelid-archive", response: "黑镜替你继续看着。" \}/);
assert.match(js, /tookBlank: \{ btn: "#glyph-choice-blank", target: "unnumbered-vestibule", response: "没有编号的门，为你让出了一条路。" \}/);
assert.match(js, /walkedBackward: \{ btn: "#return-choice-backward", target: "reverse-stairwell", response: "你没有转身，却看见走廊迎面而来。" \}/);

/* 首选锁定、直接 hash 只记 visited、无守卫、痕迹单行、8 卡 */
const chooseAnnexBlock = js.match(/const chooseAnnex = \(sceneKey, mark\) => \{[\s\S]*?\n  \};/);
assert.ok(chooseAnnexBlock, "chooseAnnex must exist");
assert.match(chooseAnnexBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "annex action must be first-locked while a transition is pending");
assert.match(js, /if \(ANNEX_SCENES\.includes\(name\)\) enterAnnex\(name\);/);
assert.match(js, /const enterAnnex = \(sceneKey\) => \{\s*markAnnexVisited\(sceneKey\);/, "direct hash marks visited but never auto-acts");
const resolveBlockV32 = js.match(/const resolveScene = \(name\) => \{[\s\S]*?\n  \};/);
assert.ok(resolveBlockV32 && !resolveBlockV32[0].includes("ANNEX"), "annex scenes keep clean direct access, no guard");
assert.match(js, /门内副楼：\$\{names\.join\(" \/ "\)\}；你在没有楼层的地方改道 \$\{st\.transitions\} 次。/);
assert.match(js, /paintAnnexMemory\(\);/);
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* ---------- v33 异常复核科：可重复支线 + 异常保全库 / 误报回收井 ---------- */
/* 六张正式 WebP 存在且被引用，六张监理源 PNG 保留 */
const REVIEW_CASE_ASSET_LIST = ["baseline", "aperture", "rail", "shadow"];
for (const c of REVIEW_CASE_ASSET_LIST) {
  const asset = `assets/anomaly-review-${c}.webp`;
  await access(new URL(asset, root));
  assert.ok(js.includes(asset), `${asset} must be referenced by the case-asset map`);
}
/* v60 起两结果房改用 v60 新图；旧 WebP 作为历史文件保留在仓库但不再被引用 */
for (const asset of ["assets/anomaly-evidence-vault.webp", "assets/anomaly-false-positive-shaft.webp"]) {
  await access(new URL(asset, root));
  assert.ok(!html.includes(asset), `${asset} is superseded by the v60 bitmap and no longer referenced`);
}
for (const src of ["source-anomaly-review-baseline", "source-anomaly-review-aperture", "source-anomaly-review-rail", "source-anomaly-review-shadow", "source-anomaly-evidence-vault", "source-anomaly-false-positive-shaft"]) {
  await access(new URL(`design-references/${src}.png`, root));
}
assert.match(html, /assets\/anomaly-review-baseline\.webp/, "review scene references the baseline case image");
assert.match(html, /assets\/v60-evidence-custody-vault\.webp/, "evidence vault references its v60 asset");
assert.match(html, /assets\/v60-false-positive-custody-shaft\.webp/, "false-positive shaft references its v60 asset");

/* 三个新场景：沿用 scene-branch 语言，零 inline SVG */
const reviewSceneIds = { "anomaly-review": "异常复核科", "evidence-vault": "异常保全库", "false-positive-shaft": "误报回收井" };
for (const [a, title] of Object.entries(reviewSceneIds)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-[a-z-]+" id="scene-${a}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${a}`);
  assert.ok(section[0].includes(title), `${a} shows its title`);
  assert.ok(!section[0].includes("<svg"), `${a} must not use inline SVG`);
  assert.match(section[0], /aria-pressed="false"/, `${a} actions carry aria-pressed semantics`);
}
const reviewSection = html.match(/<section class="scene scene-branch scene-anomaly-review"[\s\S]*?<\/section>/);
assert.equal((reviewSection[0].match(/<button class="branch-btn"/g) || []).length, 2, "anomaly-review holds exactly the two judgement buttons");
assert.ok(reviewSection[0].includes("登记为异常") && reviewSection[0].includes("维持原案"), "both judgement buttons are visible native buttons");
for (const id of ["review-stat-correct", "review-stat-streak", "review-stat-mistakes", "review-stat-best", "review-case-label", "review-case-img-a", "review-case-img-b"]) {
  assert.ok(reviewSection[0].includes(`id="${id}"`), `anomaly-review missing #${id}`);
}
assert.match(reviewSection[0], /id="review-response" aria-live="polite"/, "review feedback is the only aria-live region");
assert.match(reviewSection[0], /data-go="eyelid-archive"/, "anomaly-review keeps an explicit back exit");
assert.ok(reviewSection[0].includes("复核不是寻找错误。复核是决定哪一份现实继续生效。"), "review epigraph verbatim");
const vaultSection = html.match(/<section class="scene scene-branch scene-evidence-vault"[\s\S]*?<\/section>/);
assert.equal((vaultSection[0].match(/<button class="branch-btn forecourt-native-hotspot/g) || []).length, 4, "evidence-vault holds exactly 4 in-picture action buttons (3 original + v34 valuation entry)");
assert.ok(vaultSection[0].includes("封存最清楚的一处异常") && vaultSection[0].includes("把原案退回无号前厅") && vaultSection[0].includes("沿保全编号的断口离开"), "vault actions verbatim");
assert.match(vaultSection[0], /id="vault-response" aria-live="polite"/);
assert.match(vaultSection[0], /data-go="anomaly-review"/, "evidence-vault keeps an explicit back exit");
assert.ok(!vaultSection[0].includes("branch-choices"), "evidence-vault must drop the old card list container");
const shaftSection = html.match(/<section class="scene scene-branch scene-false-positive-shaft"[\s\S]*?<\/section>/);
assert.equal((shaftSection[0].match(/<button class="branch-btn forecourt-native-hotspot/g) || []).length, 4, "false-positive-shaft holds exactly 4 in-picture action buttons (3 original + v34 valuation entry)");
assert.ok(shaftSection[0].includes("捡回一张被判错的工单") && shaftSection[0].includes("把误报写进守则附录") && shaftSection[0].includes("承认自己是多出来的一项"), "shaft actions verbatim");
assert.match(shaftSection[0], /id="shaft-response" aria-live="polite"/);
assert.match(shaftSection[0], /data-go="anomaly-review"/, "false-positive-shaft keeps an explicit back exit");
assert.ok(!shaftSection[0].includes("branch-choices"), "false-positive-shaft must drop the old card list container");
assert.match(html, /<a href="#anomaly-review" id="review-link" hidden/);
assert.match(html, /<a href="#evidence-vault" id="vault-link" hidden/);
assert.match(html, /<a href="#false-positive-shaft" id="shaft-link" hidden/);
assert.ok(html.includes('id="anomaly-memory"'), "remembrance gains the single anomaly memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v33 状态契约：独立 key、容错解析（坏 JSON / 数组错型 / 白名单 / 裁剪）、与 v28–v32 零引用 */
assert.match(js, /const REVIEW_KEY = "goddead_v33_anomaly_review";/);
const reviewParseBlock = js.match(/const getReview = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(reviewParseBlock, "getReview must exist");
assert.match(reviewParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt review storage must be safely repaired");
assert.match(reviewParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(reviewParseBlock[0], /visited\[k\] = Boolean\(raw\.visited && raw\.visited\[k\] === true\)/);
assert.match(reviewParseBlock[0], /REVIEW_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "neutral"/, "illegal entry falls back to neutral");
assert.match(reviewParseBlock[0], /isValidReviewOrder\(raw\.order\) \? raw\.order\.slice\(\) : reviewOrderFor\(entry, cycle\)/, "illegal order is rebuilt from entry/cycle");
assert.match(reviewParseBlock[0], /raw\.marks\.filter\(\(m\) => REVIEW_MARKS\.includes\(m\)\)/, "illegal review marks must be dropped");
assert.match(reviewParseBlock[0], /REVIEW_OUTCOMES\.includes\(raw\.outcome\) \? raw\.outcome : ""/, "illegal outcome falls back");
assert.match(reviewParseBlock[0], /\.slice\(0, round\)/, "decisions stay consistent with round");
assert.match(reviewParseBlock[0], /!Number\.isFinite\(n\) \|\| n < 0/, "NaN/Infinity/negative numbers fall back");
assert.match(reviewParseBlock[0], /Math\.min\(REVIEW_NUM_CAP, Math\.floor\(n\)\)/, "numbers are clamped");
assert.ok(!/goddead_v(28|29|30|31|32)/.test(reviewParseBlock[0]), "review state must not touch v28-v32");

/* 确定性轮换矩阵：从源码提取实际矩阵并验证白名单性质 */
const matrixBlock = js.match(/const REVIEW_ORDER_MATRIX = \[([\s\S]*?)\];/);
assert.ok(matrixBlock, "REVIEW_ORDER_MATRIX must exist");
const matrixRows = [...matrixBlock[1].matchAll(/\["(\w+)", "(\w+)", "(\w+)"\]/g)].map((m) => [m[1], m[2], m[3]]);
assert.equal(matrixRows.length, 4, "matrix holds one row per entry");
for (const row of matrixRows) {
  assert.equal(new Set(row).size, 3, "each matrix row holds three distinct cases");
  assert.equal(row.filter((c) => c === "baseline").length, 1, "each matrix row holds exactly one baseline");
  assert.ok(row.every((c) => ["baseline", "aperture", "rail", "shadow"].includes(c)), "matrix cases stay in the whitelist");
}
assert.ok(["baseline", "aperture", "rail", "shadow"].every((c) => matrixRows.some((row) => row.includes(c))), "all four cases appear across the matrix");
assert.match(js, /REVIEW_ORDER_MATRIX\[\(REVIEW_ENTRY_ROW\[entry\] \+ cycle\) % REVIEW_ORDER_MATRIX\.length\]/, "later cycles rotate deterministically through the matrix");
assert.match(js, /const REVIEW_ENTRY_ROW = \{ eyelid: 0, vestibule: 1, stairwell: 2, neutral: 3 \};/);
for (let row = 0; row < 4; row++) {
  assert.notDeepEqual(matrixRows[row], matrixRows[(row + 1) % 4], "same entry consecutive cycles never repeat the exact order");
}
assert.ok(!/Math\.random/.test(matrixBlock[0]), "rotation must not use bare randomness");

/* 新一轮：order 按当前 cycle 生成后递增，本轮字段清零 */
const startReviewBlock = js.match(/const startReview = \(entry\) => \{[\s\S]*?\n  \};/);
assert.ok(startReviewBlock, "startReview must exist");
assert.match(startReviewBlock[0], /st\.order = reviewOrderFor\(st\.entry, st\.cycle\);/);
assert.match(startReviewBlock[0], /st\.cycle = Math\.min\(REVIEW_NUM_CAP, st\.cycle \+ 1\);/);
assert.match(startReviewBlock[0], /st\.round = 0;/);
assert.match(startReviewBlock[0], /st\.decisions = \[\];/);
assert.match(startReviewBlock[0], /st\.outcome = "";/);

/* 判断与首选锁定：双 scope 守卫、本轮首项锁定、第三轮只结算一次、反馈原文 */
const decideBlock = js.match(/const decideReview = \(choice\) => \{[\s\S]*?\n  \};/);
assert.ok(decideBlock, "decideReview must exist");
assert.match(decideBlock[0], /if \(AutoAdvance\.has\("anomaly-review"\) \|\| AutoAdvance\.has\("anomaly-review-round"\)\) return;/, "judgement is first-locked across both scopes");
assert.match(decideBlock[0], /if \(st\.outcome !== "" \|\| st\.round >= 3\) return;/, "settled runs never re-settle");
assert.ok(decideBlock[0].includes("档案边缘渗出一条新编号。复核值 +1。"), "anomaly-correct feedback verbatim");
assert.ok(decideBlock[0].includes("房间保持原样。你第一次因为没看见而被记录。"), "baseline-correct feedback verbatim");
assert.ok(decideBlock[0].includes("复核科收走你的确信。误报 +1。"), "false-positive feedback verbatim");
assert.ok(decideBlock[0].includes("变化没有消失，只是被登记成了你。"), "missed-anomaly feedback verbatim");
assert.match(decideBlock[0], /if \(st\.streak > st\.bestStreak\) st\.bestStreak = st\.streak;/, "best streak persists across runs");
assert.match(decideBlock[0], /st\.streak = 0;/, "a wrong answer resets the streak");
assert.match(decideBlock[0], /st\.completedRuns = Math\.min\(REVIEW_NUM_CAP, st\.completedRuns \+ 1\);/, "third round settles exactly once");
assert.match(decideBlock[0], /st\.correct >= 3[\s\S]*?st\.outcome = "vault"/, "3 correct enters the evidence vault");
assert.match(decideBlock[0], /st\.correct === 2[\s\S]*?st\.outcome = "returned"/, "2 correct returns to the entry annex");
assert.match(decideBlock[0], /st\.vaultEntries = Math\.min\(REVIEW_NUM_CAP, st\.vaultEntries \+ 1\);/);
assert.match(decideBlock[0], /st\.shaftEntries = Math\.min\(REVIEW_NUM_CAP, st\.shaftEntries \+ 1\);/);
assert.match(decideBlock[0], /AutoAdvance\.schedule\("anomaly-review-round", "anomaly-review"/, "in-run case swap uses its own scope");
assert.match(js, /const REVIEW_ENTRY_TARGET = \{ eyelid: "eyelid-archive", vestibule: "unnumbered-vestibule", stairwell: "reverse-stairwell", neutral: "eyelid-archive" \};/, "2-point return targets the entry annex, neutral falls back to the eyelid archive");

/* 三处副楼第四入口：共用副楼首选锁，只附加不替换 */
assert.match(js, /"eyelid-archive": \{ btn: "#eyelid-choice-review", entry: "eyelid", mark: "sentEyeForReview"/);
assert.match(js, /"unnumbered-vestibule": \{ btn: "#vestibule-choice-review", entry: "vestibule", mark: "submittedUnnumberedDoor"/);
assert.match(js, /"reverse-stairwell": \{ btn: "#stairwell-choice-review", entry: "stairwell", mark: "reportedUpwardDescent"/);
const chooseReviewEntryBlock = js.match(/const chooseReviewEntry = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.ok(chooseReviewEntryBlock, "chooseReviewEntry must exist");
assert.match(chooseReviewEntryBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "review entry shares the annex first-lock");
assert.match(chooseReviewEntryBlock[0], /startReview\(meta\.entry\);/);
assert.match(chooseReviewEntryBlock[0], /AutoAdvance\.schedule\(sceneKey, "anomaly-review", \{ delay: branchDelay\(\) \}\);/);

/* 结果房动作：目的地、反馈原文、首选锁定、工单重启 */
assert.match(js, /sealedClearestAnomaly: \{ btn: "#vault-choice-seal", target: "eyelid-archive", response: "证物匣闭合时，闭目档案室少了一只眼。" \}/);
assert.match(js, /returnedBaselineToVestibule: \{ btn: "#vault-choice-return", target: "unnumbered-vestibule", response: "没有编号的门拒绝签收，于是把自己打开。" \}/);
assert.match(js, /leftThroughBrokenSeal: \{ btn: "#vault-choice-leave", target: "corridor", response: "编号在中途断裂，断口后面是经文走廊。" \}/);
assert.match(js, /retrievedRejectedCase: \{ btn: "#shaft-choice-retrieve", target: "anomaly-review", response: "工单背面已经换了一套异常。复核重新开始。", restart: true \}/);
assert.match(js, /appendedFalseReport: \{ btn: "#shaft-choice-append", target: "protocol", response: "守则新增一条：凡看错者，视为看见。" \}/);
assert.match(js, /admittedExtraItem: \{ btn: "#shaft-choice-admit", target: "threshold", response: "回收井退回你的名字，把人送到门外。" \}/);
const chooseReviewResultBlock = js.match(/const chooseReviewResult = \(sceneKey, mark\) => \{[\s\S]*?\n  \};/);
assert.ok(chooseReviewResultBlock, "chooseReviewResult must exist");
assert.match(chooseReviewResultBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "result-room actions are first-locked");
assert.match(chooseReviewResultBlock[0], /if \(choice\.restart\) startReview\(st\.entry\);/, "the rejected case restarts a new cycle");

/* 直达与守卫：复核科 neutral 直达不自动判断，结果房守卫规范化回复核科 */
const enterReviewBlock = js.match(/const enterReview = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(enterReviewBlock, "enterReview must exist");
assert.match(enterReviewBlock[0], /markReviewVisited\("anomaly-review"\);/, "direct hash marks visited");
assert.match(enterReviewBlock[0], /if \(st\.outcome !== "" \|\| st\.round >= 3\) startReview\("neutral"\);/, "completed runs restart as a neutral cycle");
assert.match(enterReviewBlock[0], /else if \(st\.cycle === 0 && st\.round === 0\) startReview\("neutral"\);/, "first direct entry starts a deterministic neutral cycle");
assert.ok(!/AutoAdvance\.schedule/.test(enterReviewBlock[0]), "direct entry never auto-decides or auto-advances");
assert.match(js, /if \(target === "evidence-vault" && !\(reviewState\.outcome === "vault" \|\| reviewState\.visited\.evidenceVault\)\) target = "anomaly-review";/, "vault direct access is guarded");
assert.match(js, /if \(target === "false-positive-shaft" && !\(reviewState\.outcome === "shaft" \|\| reviewState\.visited\.falsePositiveShaft \|\| valuationState\.outcome === "breach"\)\) target = "anomaly-review";/, "shaft direct access is guarded");
assert.match(js, /if \(name === "anomaly-review"\) enterReview\(\);/);
assert.match(js, /if \(REVIEW_RESULT_SCENES\.includes\(name\)\) \{ enterReviewResult\(name\); replayCustodyPending\(name\); \}/);
assert.match(js, /paintReviewedReturn\(sceneKey, responseEl\);/, "2-point return unlocks the one-time reviewed feedback");
assert.match(js, /异常复核：完成 \$\{st\.completedRuns\} 轮，最佳连续 \$\{st\.bestStreak\}，保全 \$\{st\.vaultEntries\} 次，误报回收 \$\{st\.shaftEntries\} 次。/, "anomaly memory line verbatim");
assert.match(js, /paintAnomalyMemory\(\);/);
assert.match(js, /syncReviewLinks\(\);/);

/* 视觉契约：双按钮两列、档案交叉淡化只切 opacity、reduced-motion 禁用交叉动画 */
assert.match(css, /\.review-decisions \{\s*grid-template-columns: repeat\(2, 1fr\);/);
assert.match(css, /\.review-case-img \{[\s\S]*?opacity: 0;[\s\S]*?transition: opacity 0\.4s ease;/, "case images cross-fade by opacity only");
assert.ok(!/\.review-case-img[^{]*\{[^}]*transform/.test(css), "case cross-fade must not move or scale the image");
assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.review-case-img \{\s*transition: none;\s*\}\s*\}/, "reduced-motion disables the cross-fade");
assert.match(css, /\.review-slip \{/, "review slip styled in-world");
/* shadow 案专属裁切：逐层 data-case 标记 + 仅桌面顶对齐构图，移动端维持原裁切 */
assert.match(js, /back\.setAttribute\("data-case", caseId\);/, "showReviewCase must tag the incoming layer with its case id");
assert.match(html, /class="review-case-img is-front" id="review-case-img-a" src="assets\/anomaly-review-baseline\.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" data-case="baseline"/, "initial case layers carry data-case markers");
assert.match(css, /@media \(min-width: 721px\) \{\s*\.review-case-img\[data-case="shadow"\] \{\s*object-position: center top;\s*\}\s*\}/, "shadow case alone gets a top-aligned desktop crop");
assert.ok(!/\.review-case-img\[data-case="(baseline|aperture|rail)"\]/.test(css), "no other case gets a bespoke crop");

/* ---------- v34 无主估值室：可重复估值支线 + 定额电梯 ---------- */
/* 八张正式 WebP 存在且被引用，八张监理源 PNG 保留 */
for (const asset of ["assets/unclaimed-valuation-room.webp", "assets/quota-elevator.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const asset of ["assets/valuation-thirteenth-clock.webp", "assets/valuation-tooth-key.webp", "assets/valuation-hollow-idol.webp", "assets/valuation-black-wax-lung.webp", "assets/valuation-unopened-eye.webp", "assets/valuation-receipt-bone.webp"]) {
  await access(new URL(asset, root));
  assert.ok(js.includes(asset), `${asset} must be referenced by the relic meta`);
}
for (const src of ["source-unclaimed-valuation-room", "source-valuation-thirteenth-clock", "source-valuation-tooth-key", "source-valuation-hollow-idol", "source-valuation-black-wax-lung", "source-valuation-unopened-eye", "source-valuation-receipt-bone", "source-quota-elevator"]) {
  await access(new URL(`design-references/${src}.png`, root));
}

/* 两个新场景：沿用 scene-branch 语言，零 inline SVG */
const valSceneIds = { "unclaimed-valuation": "无主估值室", "quota-elevator": "定额电梯" };
for (const [a, title] of Object.entries(valSceneIds)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-[a-z-]+" id="scene-${a}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${a}`);
  assert.ok(section[0].includes(title), `${a} shows its title`);
  assert.ok(!section[0].includes("<svg"), `${a} must not use inline SVG`);
}
const valuationSection = html.match(/<section class="scene scene-branch scene-unclaimed-valuation"[\s\S]*?<\/section>/);
assert.equal((valuationSection[0].match(/<button class="relic-card"/g) || []).length, 3, "valuation room holds exactly 3 relic cards");
assert.ok(valuationSection[0].includes("无主估值室") && valuationSection[0].includes("无人认领的东西仍有价值。价值只说明它还欠这里什么。"), "valuation epigraph verbatim");
for (const id of ["val-stat-value", "val-stat-integrity", "val-stat-quota", "val-stat-best", "val-stat-breach", "val-settle", "val-relic-0", "val-relic-1", "val-relic-2", "val-relic-img-0", "val-relic-img-1", "val-relic-img-2", "val-relic-name-0", "val-relic-omen-0", "val-relic-result-0"]) {
  assert.ok(valuationSection[0].includes(`id="${id}"`), `valuation room missing #${id}`);
}
assert.match(valuationSection[0], /id="val-settle" type="button" disabled/, "settle button ships disabled until the first relic is valued");
assert.match(valuationSection[0], /id="valuation-response" aria-live="polite"/, "valuation feedback is the only aria-live region");
/* 卡图加载可靠性：三张当前批次卡图 eager 加载（不依赖可能来不及触发的 lazy load） */
assert.equal((valuationSection[0].match(/<img class="relic-img" id="val-relic-img-\d" src="assets\/valuation-[a-z-]+\.webp" alt="" width="1536" height="1024" loading="eager"/g) || []).length, 3, "all three batch card images load eagerly");
assert.match(js, /img\.classList\.add\("is-loading"\);[\s\S]*?img\.addEventListener\("load", showImg, \{ once: true \}\);[\s\S]*?if \(img\.complete && img\.naturalWidth > 0\) showImg\(\);/, "batch swap hides the stale image until the new one decodes");
assert.match(css, /\.relic-img\.is-loading \{\s*opacity: 0;\s*\}/, "stale relic images never flash during a batch swap");
/* 移动 390×844：紧凑三列，三件证物与盖章同屏，图片身份保留 */
assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.scene-unclaimed-valuation \.valuation-relics \{\s*grid-template-columns: repeat\(3, 1fr\);/, "mobile keeps three compact relic columns");
assert.match(css, /\.scene-unclaimed-valuation \.relic-figure \{\s*height: 76px;\s*\}/, "mobile relic images stay visible but compact");
assert.match(css, /\.val-settle-btn \{\s*min-height: 44px;/, "settle touch target stays at least 44px");
const elevatorSection = html.match(/<section class="scene scene-branch scene-quota-elevator"[\s\S]*?<\/section>/);
assert.equal((elevatorSection[0].match(/<button class="branch-btn"/g) || []).length, 4, "quota elevator holds exactly 4 action buttons (3 original + v35 floor entry)");
assert.ok(elevatorSection[0].includes("把满额证物送进无号货梯") && elevatorSection[0].includes("沿断开的楼层刻度横移") && elevatorSection[0].includes("让电梯穿过走廊天花板"), "elevator actions verbatim");
assert.match(elevatorSection[0], /id="elevator-response" aria-live="polite"/);
assert.match(elevatorSection[0], /data-go="unclaimed-valuation"/, "elevator keeps an explicit back exit");
assert.ok(html.includes("把未封存的证物送去估值") && html.includes("把一件退件申报成资产"), "both v34 entry actions are visible");
assert.match(html, /<a href="#unclaimed-valuation" id="valuation-link" hidden/);
assert.match(html, /<a href="#quota-elevator" id="elevator-link" hidden/);
assert.ok(html.includes('id="valuation-memory"'), "remembrance gains the single valuation memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v34 状态契约：独立 key、容错解析、与 v28–v33 零引用 */
assert.match(js, /const VAL_KEY = "goddead_v34_unclaimed_valuation";/);
const valParseBlock = js.match(/const getValuation = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(valParseBlock, "getValuation must exist");
assert.match(valParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt valuation storage must be safely repaired");
assert.match(valParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(valParseBlock[0], /VAL_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "neutral"/, "illegal entry falls back to neutral");
assert.match(valParseBlock[0], /isValidValBatch\(raw\.batch\) \? raw\.batch\.slice\(\) : valBatchFor\(entry, cycle\)/, "illegal batch is rebuilt from entry/cycle");
assert.match(valParseBlock[0], /new Set\(raw\.opened\.filter\(\(r\) => batch\.includes\(r\)\)\)/, "opened stays unique within the batch");
assert.match(valParseBlock[0], /\.filter\(\(l, i\) => l\.relic === opened\[i\]\)/, "ledger must pair one-to-one with opened order");
assert.match(valParseBlock[0], /VAL_OUTCOMES\.includes\(raw\.outcome\) \? raw\.outcome : ""/, "illegal outcome falls back");
assert.match(valParseBlock[0], /raw\.marks\.filter\(\(m\) => VAL_MARKS\.includes\(m\)\)/, "illegal valuation marks must be dropped");
assert.match(valParseBlock[0], /!Number\.isFinite\(n\) \|\| n < 0/, "NaN/Infinity/negative numbers fall back");
assert.match(valParseBlock[0], /Math\.min\(VAL_NUM_CAP, Math\.floor\(n\)\)/, "numbers are clamped");
assert.ok(!/goddead_v(28|29|30|31|32|33)/.test(valParseBlock[0]), "valuation state must not touch v28-v33");

/* 批次矩阵：从源码提取实际矩阵验证白名单性质与确定性移位 */
const valMatrixBlock = js.match(/const VAL_BATCH_MATRIX = \[([\s\S]*?)\];/);
assert.ok(valMatrixBlock, "VAL_BATCH_MATRIX must exist");
const valMatrixRows = [...valMatrixBlock[1].matchAll(/\["(\w+)", "(\w+)", "(\w+)"\]/g)].map((m) => [m[1], m[2], m[3]]);
assert.equal(valMatrixRows.length, 4, "batch matrix holds four rows");
for (const row of valMatrixRows) {
  assert.equal(new Set(row).size, 3, "each batch row holds three distinct relics");
  assert.ok(row.every((r) => ["thirteenthClock", "toothKey", "hollowIdol", "blackWaxLung", "unopenedEye", "receiptBone"].includes(r)), "batch relics stay in the whitelist");
}
assert.ok(["thirteenthClock", "toothKey", "hollowIdol", "blackWaxLung", "unopenedEye", "receiptBone"].every((r) => valMatrixRows.some((row) => row.includes(r))), "all six relics appear across the matrix");
assert.match(js, /VAL_BATCH_MATRIX\[\(VAL_ENTRY_ROW\[entry\] \+ cycle\) % VAL_BATCH_MATRIX\.length\]/, "later cycles rotate deterministically through the batch matrix");
assert.match(js, /const VAL_ENTRY_ROW = \{ vault: 0, shaft: 1, neutral: 2 \};/);
for (let row = 0; row < 4; row++) {
  assert.notDeepEqual(valMatrixRows[row], valMatrixRows[(row + 1) % 4], "same entry consecutive batches never repeat exactly");
}
assert.ok(!/Math\.random/.test(valMatrixBlock[0]), "batch rotation must not use bare randomness");

/* 入口初值与 startValuation */
assert.match(js, /vault: \{ value: 0, integrity: 5, quota: 6 \},\s*shaft: \{ value: 1, integrity: 4, quota: 7 \},\s*neutral: \{ value: 0, integrity: 5, quota: 6 \},/, "entry initial values per design");
const startValBlock = js.match(/const startValuation = \(entry\) => \{[\s\S]*?\n  \};/);
assert.ok(startValBlock, "startValuation must exist");
assert.match(startValBlock[0], /st\.batch = valBatchFor\(st\.entry, st\.cycle\);/);
assert.match(startValBlock[0], /st\.cycle = Math\.min\(VAL_NUM_CAP, st\.cycle \+ 1\);/);
assert.match(startValBlock[0], /st\.ledger = \[\];/);
assert.match(startValBlock[0], /st\.outcome = "";/);
assert.match(startValBlock[0], /st\.active = true;/);

/* 六件证物：基础值、损耗、征兆与反馈原文 */
assert.match(js, /thirteenthClock: \{ name: "十三时钟", asset: "assets\/valuation-thirteenth-clock\.webp", base: 2, damage: 1, omen: "钟面多出一格，秒针少走一次。", feedback: "钟替下一件证物少活了一秒。" \}/);
assert.match(js, /toothKey: \{ name: "齿门钥", asset: "assets\/valuation-tooth-key\.webp", base: 3, damage: 2, omen: "钥匙的齿形与这里每个人的牙都相同。", feedback: "钥匙记住了前面已经打开过几只匣子。" \}/);
assert.match(js, /hollowIdol: \{ name: "空神像", asset: "assets\/valuation-hollow-idol\.webp", base: 4, damage: 3, omen: "像内没有神，只有一个比外壳更大的空腔。", feedback: "最后一只匣子打开后，空腔把前两件也算进了自己。" \}/);
assert.match(js, /blackWaxLung: \{ name: "黑蜡肺", asset: "assets\/valuation-black-wax-lung\.webp", base: 2, damage: 2, omen: "它只在别人停止呼吸时起伏。", feedback: "肺替还没打开的匣子各吸进一点价值。" \}/);
assert.match(js, /unopenedEye: \{ name: "未睁之眼", asset: "assets\/valuation-unopened-eye\.webp", base: 1, damage: 1, omen: "眼皮内侧写着柜台正在隐瞒的数字。", feedback: "闭着的眼把剩余数字看得一清二楚。" \}/);
assert.match(js, /receiptBone: \{ name: "无主回执骨", asset: "assets\/valuation-receipt-bone\.webp", base: 2, damage: 0, omen: "骨头两端都盖着退件章，中间没有身体。", feedback: "没有收件人的骨头，被按普通附件计价。", feedbackShaft: "退件章被估值室当成了两次所有权转移。" \}/);

/* 估值逻辑：首选锁、效果顺序、ledger 实收、自动结算 */
const valuateBlock = js.match(/const valuateRelic = \(idx\) => \{[\s\S]*?\n  \};/);
assert.ok(valuateBlock, "valuateRelic must exist");
assert.match(valuateBlock[0], /if \(AutoAdvance\.has\("unclaimed-valuation"\) \|\| AutoAdvance\.has\("valuation-batch"\)\) return;/, "valuation is first-locked across both scopes");
assert.match(valuateBlock[0], /if \(!st\.active \|\| st\.outcome !== "" \|\| st\.integrity <= 0\) return;/, "settled or breached batches never re-settle");
assert.match(valuateBlock[0], /relic === "toothKey" && st\.opened\.length > 0\) \{ gain \+= st\.opened\.length; effect = "orderBonus"; \}/, "tooth key gains one per already-valued relic");
assert.match(valuateBlock[0], /relic === "hollowIdol" && st\.opened\.length === 2\) \{ gain \+= 2; effect = "thirdBonus"; \}/, "hollow idol gains +2 only as the third valued");
assert.match(valuateBlock[0], /relic === "receiptBone" && st\.entry === "shaft"\) \{ gain \+= 2; effect = "shaftBonus"; \}/, "receipt bone gains +2 only from the shaft entry");
assert.match(valuateBlock[0], /const damage = Math\.max\(0, meta\.damage - st\.nextDamageShield\);[\s\S]*?st\.nextDamageShield = 0;/, "thirteenth clock shield reduces the next damage once, floored at 0");
assert.match(valuateBlock[0], /relic === "thirteenthClock"\) \{ st\.nextDamageShield = 1; effect = "shieldNext"; \}/, "thirteenth clock shields only the next relic");
assert.match(valuateBlock[0], /relic === "blackWaxLung"\) \{ st\.remainingValueBonus \+= 1; effect = "boostRemaining"; \}/, "black wax lung boosts only not-yet-valued relics");
assert.match(valuateBlock[0], /relic === "unopenedEye"\) \{ st\.revealExact = true; effect = "reveal"; \}/, "unopened eye reveals only the remaining cards");
assert.match(valuateBlock[0], /st\.ledger\.push\(\{ relic, valueGain: gain, damageTaken: damage, effect \}\);/, "ledger stores the computed result, never recomputed");
assert.match(valuateBlock[0], /st\.integrity <= 0[\s\S]*?settleValuation\(st, "breach"\)/, "integrity zero settles breach immediately");
assert.match(valuateBlock[0], /st\.opened\.length >= 3[\s\S]*?settleValuation\(st, st\.value >= st\.quota \? "quota" : "under"\)/, "third relic auto-settles without a stamp click");
assert.match(valuateBlock[0], /AutoAdvance\.schedule\("valuation-batch", "unclaimed-valuation", \{ delay: branchDelay\(\), before: \(\) => \{\} \}\);/, "batch lock releases in place after the feedback beat");

/* 结算分流与每批一次 */
const settleValBlock = js.match(/const settleValuation = \(st, kind\) => \{[\s\S]*?\n  \};/);
assert.ok(settleValBlock, "settleValuation must exist");
assert.match(settleValBlock[0], /st\.completedRuns = Math\.min\(VAL_NUM_CAP, st\.completedRuns \+ 1\);/, "each batch completes exactly once");
assert.match(settleValBlock[0], /kind === "quota"[\s\S]*?st\.quotaMetRuns[\s\S]*?target = "quota-elevator";/, "quota met enters the quota elevator");
assert.match(settleValBlock[0], /kind === "under"[\s\S]*?st\.underRuns[\s\S]*?target = "return-passage";/, "under quota returns to the return passage");
assert.match(settleValBlock[0], /st\.breachRuns[\s\S]*?target = "false-positive-shaft";/, "breach drops back into the false-positive shaft");
assert.match(settleValBlock[0], /st\.bestSettlement = Math\.max\(st\.bestSettlement, st\.value\);/, "best settlement persists across runs");
assert.match(js, /if \(!st\.active \|\| st\.outcome !== "" \|\| st\.opened\.length === 0\) return;\s*settleValuation\(st, st\.value >= st\.quota \? "quota" : "under"\);/, "stamp settle requires at least one valued relic");

/* 两个第四入口 + 电梯动作 + 守卫 + 一次性回流反馈 */
assert.match(js, /"evidence-vault": \{ btn: "#vault-choice-valuation", entry: "vault", mark: "sentEvidenceToValuation"/);
assert.match(js, /"false-positive-shaft": \{ btn: "#shaft-choice-valuation", entry: "shaft", mark: "declaredRejectAsAsset"/);
const chooseValEntryBlock = js.match(/const chooseValuationEntry = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(chooseValEntryBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "valuation entry shares the result-room first-lock");
assert.match(chooseValEntryBlock[0], /startValuation\(meta\.entry\);/);
assert.match(js, /sentQuotaToVestibule: \{ btn: "#elevator-choice-vestibule", target: "unnumbered-vestibule", response: "货梯停在没有编号的一层，门比轿厢先打开。" \}/);
assert.match(js, /crossedBrokenFloorScale: \{ btn: "#elevator-choice-scale", target: "return-passage", response: "红针指向墙内，回返夹道从刻度后面经过。" \}/);
assert.match(js, /droppedQuotaIntoCorridor: \{ btn: "#elevator-choice-corridor", target: "corridor", response: "证物箱先落进经文，轿厢随后才找到楼层。" \}/);
assert.match(js, /if \(AutoAdvance\.has\("quota-elevator"\)\) return;/, "elevator actions are first-locked");
assert.match(js, /if \(target === "false-positive-shaft" && !\(reviewState\.outcome === "shaft" \|\| reviewState\.visited\.falsePositiveShaft \|\| valuationState\.outcome === "breach"\)\) target = "anomaly-review";/, "shaft direct access is guarded, with the v34 breach drop admitted");
assert.match(js, /if \(target === "quota-elevator" && !\(valuationState\.outcome === "quota" \|\| valuationState\.visited\.quotaElevator \|\| floorState\.outcome === "high"\)\) target = "unclaimed-valuation";/, "elevator direct access is guarded, with the v35 high-signal ride admitted");
assert.match(js, /估值室退回了这批东西。欠额被写在夹道背面。/, "under-quota one-time return feedback verbatim");
assert.match(js, /破损证物比工单先落到底部。回收井把裂口登记在你名下。/, "breach one-time return feedback verbatim");
assert.match(js, /if \(name === "unclaimed-valuation"\) enterValuation\(\);/);
assert.match(js, /if \(name === "quota-elevator"\) enterElevator\(\);/);
assert.match(js, /无主估值：完成 \$\{st\.completedRuns\} 批，满额 \$\{st\.quotaMetRuns\} 批，破损 \$\{st\.breachRuns\} 批，最佳结算 \$\{st\.bestSettlement\}。/, "valuation memory line verbatim");
assert.match(js, /paintValuationMemory\(\);/);
assert.match(js, /syncValuationLinks\(\);/);

/* ---------- v35 无号层：横向枢纽 + 三间值班房 + 缺层电梯 ---------- */
/* 四张正式 WebP 存在且被引用，四张监理源 PNG 保留 */
for (const asset of ["assets/unnumbered-floor.webp", "assets/bellless-ward.webp", "assets/seeping-records.webp", "assets/reverse-laundry.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-unnumbered-floor", "source-bellless-ward", "source-seeping-records", "source-reverse-laundry"]) {
  await access(new URL(`design-references/${src}.png`, root));
}

/* 四个新场景：沿用 scene-branch 语言，零 inline SVG，各三动作 */
const floorSceneIds = { "unnumbered-floor": "无号层", "bellless-ward": "无铃病房", "seeping-records": "渗水档案池", "reverse-laundry": "逆照洗衣房" };
for (const [a, title] of Object.entries(floorSceneIds)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-[a-z-]+" id="scene-${a}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${a}`);
  assert.ok(section[0].includes(title), `${a} shows its title`);
  assert.ok(!section[0].includes("<svg"), `${a} must not use inline SVG`);
  assert.match(section[0], /aria-live="polite"/, `${a} keeps a polite feedback region`);
}
const floorSection = html.match(/<section class="scene scene-branch scene-unnumbered-floor"[\s\S]*?<\/section>/);
assert.ok(floorSection[0].includes("这里的房间都有用途。只有楼层没有。"), "floor epigraph verbatim");
for (const id of ["floor-stat-completed", "floor-stat-signal", "floor-stat-debt", "floor-stat-best", "floor-door-ward", "floor-door-records", "floor-door-laundry", "floor-elevator-btn", "floor-elevator-label"]) {
  assert.ok(floorSection[0].includes(`id="${id}"`), `floor hub missing #${id}`);
}
assert.match(floorSection[0], /id="floor-elevator-btn" type="button" disabled/, "floor elevator ships sealed");
assert.ok(floorSection[0].includes("缺层电梯仍封死"), "sealed elevator label verbatim");
for (const [scene, ids] of [["bellless-ward", ["ward-stat-completed", "ward-choice-listen", "ward-choice-sheet", "ward-choice-tube", "ward-choice-callback"]], ["seeping-records", ["records-stat-completed", "records-choice-dry", "records-choice-drink", "records-choice-sink", "records-choice-callback"]], ["reverse-laundry", ["laundry-stat-completed", "laundry-choice-drum", "laundry-choice-uniform", "laundry-choice-mirror", "laundry-choice-callback"]]]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-${scene}"[\\s\\S]*?<\\/section>`));
  assert.equal((section[0].match(/<button class="branch-btn[ "]/g) || []).length, 7, `${scene} holds exactly 7 in-picture hotspot buttons (3 original + v37 callback + 2 v55 reports + 1 v56 evidence check)`);
  for (const id of ids) assert.ok(section[0].includes(`id="${id}"`), `${scene} missing #${id}`);
}
assert.ok(html.includes("按下电梯里不存在的地下层") && html.includes("让指针停在没有刻度的层"), "both v35 entry actions are visible");
for (const [href, id, label] of [["#unnumbered-floor", "floor-link", "01μ / 无号层"], ["#bellless-ward", "ward-link", "01ν / 无铃病房"], ["#seeping-records", "records-link", "01ξ / 渗水档案"], ["#reverse-laundry", "laundry-link", "01ο / 逆照洗衣"]]) {
  assert.match(html, new RegExp(`<a href="${href.replace("#", "\\#")}" id="${id}" hidden`), `directory link ${label} ships hidden`);
}
assert.ok(html.includes('id="floor-memory"'), "remembrance gains the single floor memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v35 状态契约：独立 key、容错解析、与 v28–v34 零引用 */
assert.match(js, /const FLOOR_KEY = "goddead_v35_unnumbered_floor";/);
const floorParseBlock = js.match(/const getFloor = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(floorParseBlock, "getFloor must exist");
assert.match(floorParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt floor storage must be safely repaired");
assert.match(floorParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(floorParseBlock[0], /FLOOR_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "neutral"/, "illegal entry falls back to neutral");
assert.match(floorParseBlock[0], /new Set\(raw\.completed\.filter\(\(r\) => FLOOR_ROOMS\.includes\(r\)\)\)/, "completed stays unique within the whitelist");
assert.match(floorParseBlock[0], /if \(!settled\) outcome = "";/, "outcome without a settlement is dropped");
assert.match(floorParseBlock[0], /if \(settled && completed\.length < 2\) \{ settled = false; outcome = ""; \}/, "settlement with fewer than two rooms is stale");
assert.match(floorParseBlock[0], /raw\.marks\.filter\(\(m\) => FLOOR_MARKS\.includes\(m\)\)/, "illegal floor marks must be dropped");
assert.match(floorParseBlock[0], /Math\.min\(FLOOR_SIGNAL_CAP, num\(raw\.signal\)\)/, "signal clamps to the per-cycle theoretical cap");
assert.match(floorParseBlock[0], /Math\.min\(FLOOR_DEBT_CAP, num\(raw\.debt\)\)/, "debt clamps to the per-cycle theoretical cap");
assert.ok(!/goddead_v(28|29|30|31|32|33|34)/.test(floorParseBlock[0]), "floor state must not touch v28-v34");

/* 六个值班动作与三条穿行：分值、门债、反馈、目的地逐字 */
assert.match(js, /heardMuteNightstand: \{ btn: "#ward-choice-listen", duty: true, signal: 2, debt: 0, target: "reverse-laundry", response: "没有铃声。床头柜里却有人先说了“收到”。" \}/);
assert.match(js, /changedBreathingBedding: \{ btn: "#ward-choice-sheet", duty: true, signal: 3, debt: 1, target: "unnumbered-floor", response: "床单被下面不存在的胸口顶起，又慢慢落下。" \}/);
assert.match(js, /crawledIVTubeIntoWall: \{ btn: "#ward-choice-tube", duty: false, target: "seeping-records", response: "输液管把你当作一滴过大的药，送进潮湿的墙后。" \}/);
assert.match(js, /driedNamelessPage: \{ btn: "#records-choice-dry", duty: true, signal: 2, debt: 0, target: "unnumbered-floor", response: "纸干了。你的名字却从背面慢慢渗出来。" \}/);
assert.match(js, /drankSeepedInk: \{ btn: "#records-choice-drink", duty: true, signal: 4, debt: 2, target: "bellless-ward", response: "墨水记住了你的喉咙，档案池暂时忘了你的名字。" \}/);
assert.match(js, /letRecordsSinkFurther: \{ btn: "#records-choice-sink", duty: false, target: "unnumbered-vestibule", response: "档案井下降一格，上方的无号前厅跟着空出一层。" \}/);
assert.match(js, /cutLeadingDrum: \{ btn: "#laundry-choice-drum", duty: true, signal: 2, debt: 0, target: "seeping-records", response: "滚筒停了。里面那件衣服还在继续转身。" \}/);
assert.match(js, /woreReflectionlessUniform: \{ btn: "#laundry-choice-uniform", duty: true, signal: 3, debt: 1, target: "unnumbered-floor", response: "镜面里少了一个人，工服里却多了一次呼吸。" \}/);
assert.match(js, /brushedMirrorCabinWithOldPlate: \{ btn: "#laundry-choice-mirror", duty: false, target: "glyph-niche", response: "镜面认得这个号码，把你送回失号龛继续遗失。" \}/);

/* 值班逻辑：首选锁、同轮同房一次、settled 不再值班、重访禁重复 */
const floorActionBlock = js.match(/const chooseFloorAction = \(sceneKey, mark\) => \{[\s\S]*?\n  \};/);
assert.ok(floorActionBlock, "chooseFloorAction must exist");
assert.match(floorActionBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "floor actions are first-locked");
assert.match(floorActionBlock[0], /if \(st\.settled \|\| st\.completed\.includes\(room\)\) return;/, "same room settles once per cycle and never after settlement");
const paintFloorRoomBlock = js.match(/const paintFloorRoom = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(paintFloorRoomBlock[0], /btn\.disabled = choice\.duty && \(st\.settled \|\| st\.completed\.includes\(room\)\);/, "completed rooms keep duty buttons disabled but visible");

/* 缺层电梯：两房解锁、只结算一次、三档分流与计数 */
assert.match(js, /if \(st\.settled \|\| st\.completed\.length < 2\) return;/, "elevator requires two rooms and settles once");
assert.match(js, /const routeScore = Math\.max\(0, st\.signal - st\.debt\);/, "routeScore is signal minus debt floored at 0");
assert.match(js, /routeScore >= 4[\s\S]*?st\.outcome = "high";[\s\S]*?target = "quota-elevator";/, "route >= 4 rides the quota elevator");
assert.match(js, /routeScore >= 2[\s\S]*?st\.outcome = "review";[\s\S]*?target = "anomaly-review";/, "route 2-3 hands over to the review office");
assert.match(js, /st\.outcome = "debt";[\s\S]*?target = "return-passage";/, "route <= 1 drops into the return passage");
assert.match(js, /st\.bestRoute = Math\.max\(st\.bestRoute, routeScore\);/, "best route persists across cycles");
assert.ok(js.includes("缺层电梯认出了你的信号，把你抬回仍有定额的高度。") && js.includes("这条路线没有编号，只能先交给复核科承认。") && js.includes("门债比楼层更重。电梯把你吐回写着“回来”的夹道。"), "three tier feedbacks verbatim");

/* 新轮、入口、守卫窄例外、一次性落点反馈 */
const enterFloorBlock = js.match(/const enterFloor = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(enterFloorBlock, "enterFloor must exist");
assert.match(enterFloorBlock[0], /if \(st\.settled\) \{[\s\S]*?st\.cycle = Math\.min\(FLOOR_NUM_CAP, st\.cycle \+ 1\);[\s\S]*?st\.completed = \[\];[\s\S]*?st\.settled = false;/, "settled runs restart as a fresh cycle on hub entry");
assert.match(js, /"unnumbered-vestibule": \{ btn: "#vestibule-choice-floor", entry: "vestibule", mark: "pressedMissingBasementFloor", responseEl: "#vestibule-response", response: "按钮没有下沉。整座前厅却往上抬了一层。" \}/);
assert.match(js, /"quota-elevator": \{ btn: "#elevator-choice-floor", entry: "quota", mark: "stoppedNeedleAtUnmarkedFloor", responseEl: "#elevator-response", response: "指针越过零，停在一块没有被刻出来的黄铜上。" \}/);
const chooseFloorEntryBlock = js.match(/const chooseFloorEntry = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(chooseFloorEntryBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "floor entry shares the host scene first-lock");
assert.match(js, /getFloor\(\)\.outcome === "review"[\s\S]*?startReview\("neutral"\)/, "v35 review tier forces a neutral review run");
assert.match(js, /无号层值班：完成 \$\{st\.completedRuns\} 轮，最佳路线 \$\{st\.bestRoute\}，抬回 \$\{st\.highRuns\} 次，门债遣返 \$\{st\.debtRuns\} 次。/, "floor memory line verbatim");
assert.match(js, /paintFloorMemory\(\);/);
assert.match(js, /syncFloorLinks\(\);/);
assert.match(css, /@media \(max-width: 720px\) \{[\s\S]*?\.scene-unnumbered-floor \.branch-img \{\s*height: clamp\(130px, 19vh, 170px\);\s*\}/, "mobile floor hall image stays compact so the enabled elevator fits the first viewport");
assert.match(css, /\.scene-unnumbered-floor \.branch-btn \{\s*min-height: 44px;/, "mobile floor controls keep at least 44px touch height");

/* ---------- v36 夜班登记所：每 cycle 一张值班证 + 三档全部正常可达 ---------- */
/* 四张正式 WebP 存在且被引用，四张监理源 PNG 保留 */
for (const asset of ["assets/night-shift-registry.webp", "assets/permit-mute-bell.webp", "assets/permit-blank-name.webp", "assets/permit-reverse-badge.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-night-shift-registry", "source-permit-mute-bell", "source-permit-blank-name", "source-permit-reverse-badge"]) {
  await access(new URL(`design-references/${src}.png`, root));
}

/* 新场景：登记签、三证件卡（真实位图 eager）、三按钮、回大厅出口，零 inline SVG */
const registrySection = html.match(/<section class="scene scene-branch scene-night-shift-registry"[\s\S]*?<\/section>/);
assert.ok(registrySection, "scene section missing: night-shift-registry");
assert.ok(registrySection[0].includes("夜班登记所") && registrySection[0].includes("登记窗里没有职员。三只证件托盘仍按顺序把明天的值班证推到今天。"), "registry epigraph verbatim");
assert.ok(!registrySection[0].includes("<svg"), "registry must not use inline SVG");
for (const id of ["registry-stat-permit", "registry-stat-signal", "registry-stat-debt", "registry-stat-best", "permit-choice-mute-bell", "permit-choice-blank-name", "permit-choice-reverse-badge", "registry-response"]) {
  assert.ok(registrySection[0].includes(`id="${id}"`), `registry missing #${id}`);
}
assert.equal((registrySection[0].match(/<button class="relic-card permit-card"/g) || []).length, 3, "registry holds exactly 3 permit cards");
assert.equal((registrySection[0].match(/loading="eager"/g) || []).length, 3, "all three permit card images load eagerly");
assert.ok(registrySection[0].includes("借出无铃证") && registrySection[0].includes("领走失名牌") && registrySection[0].includes("签收反面工牌"), "three permit titles verbatim");
assert.ok(registrySection[0].includes("证上的铃没有铃舌，却在你眨眼时摆动。") && registrySection[0].includes("姓名栏保持空白，封蜡却重复盖了两次。") && registrySection[0].includes("正面压在柜台下，背面替你留下签名。"), "three permit omens verbatim");
assert.match(registrySection[0], /data-go="unnumbered-floor"/, "registry keeps an explicit back exit");
assert.match(registrySection[0], /id="registry-response" aria-live="polite"/);

/* 两个入口：回返夹道第四动作与大厅登记窗，既有动作逐字保持 */
assert.ok(html.includes("接住墙缝吐出的值班证") && html.includes("敲开夜班登记窗"), "both v36 entry actions are visible");
assert.match(js, /"return-passage": \{ btn: "#return-choice-registry", entry: "passage", mark: "caughtTomorrowPermit", responseEl: "#return-response", response: "墙缝吐出一张盖着明日日期的值班证，背面写着无号层。", target: "night-shift-registry" \}/);
assert.match(js, /"floor-door-registry": \{ target: "night-shift-registry", response: "地面少了一块砖，登记窗从下面升了起来。", mark: "openedNightShiftRegistry", entry: "floor" \}/);
assert.match(js, /witnessed: \{ btn: "#peephole-choice-witness", target: "protocol", response: "镜后那只眼，比你晚眨了一次。" \}/, "v31 forecourt original actions stay verbatim");
assert.match(js, /walkedBackward: \{ btn: "#return-choice-backward", target: "reverse-stairwell", response: "你没有转身，却看见走廊迎面而来。" \}/, "v31 return-passage original actions stay verbatim");
assert.match(html, /<a href="#night-shift-registry" id="registry-link" hidden/);
assert.ok(html.includes('id="registry-memory"'), "remembrance gains the single registry memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v36 状态扩展：permit 白名单、一致性归一、新 cycle 清空、上限 12/8 */
assert.match(js, /const FLOOR_SIGNAL_CAP = 15;/, "signal cap raised to 15 for v55 inspection verifications");
assert.match(js, /const FLOOR_DEBT_CAP = 14;/, "debt cap raised to 14 for v55 false/missed reports");
assert.match(js, /const FLOOR_PERMITS = \["none", "muteBell", "blankName", "reverseBadge"\];/);
assert.match(js, /const FLOOR_PERMIT_VALUES = \{ none: \[0, 0\], muteBell: \[2, 0\], blankName: \[0, 2\], reverseBadge: \[0, 4\] \};/, "permit values per design");
const floorParseV36 = js.match(/const getFloor = \(\) => \{[\s\S]*?\n  \};/);
assert.match(floorParseV36[0], /FLOOR_PERMITS\.includes\(raw\.permit\) \? raw\.permit : "none"/, "illegal permit falls back to none");
assert.match(floorParseV36[0], /permitSignal !== permitValues\[0\] \|\| permitDebt !== permitValues\[1\] \|\| permitCycle !== cycle/, "inconsistent or stale permit resets to none");
assert.match(floorParseV36[0], /visited\[k\] = Boolean\(raw\.visited && raw\.visited\[k\] === true\)/, "nightShiftRegistry visited is a strict boolean");

/* 三证件 meta 与领取逻辑 */
assert.match(js, /muteBell: \{ btn: "#permit-choice-mute-bell", resultEl: "#permit-result-mute-bell", name: "无铃证", signal: 2, debt: 0, mark: "borrowedMuteBellPermit", counter: "muteBellRuns", response: "空铃在证背摇了一下，没有出声。楼层信号多认了你两次。" \}/);
assert.match(js, /blankName: \{ btn: "#permit-choice-blank-name", resultEl: "#permit-result-blank-name", name: "失名牌", signal: 0, debt: 2, mark: "claimedBlankNamePermit", counter: "blankNameRuns", response: "号牌没有名字，门债却把你的姓名写了两遍。" \}/);
assert.match(js, /reverseBadge: \{ btn: "#permit-choice-reverse-badge", resultEl: "#permit-result-reverse-badge", name: "反面工牌", signal: 0, debt: 4, mark: "signedReverseBadge", counter: "reverseBadgeRuns", response: "你在背面签字。正面的四道门同时记住了这笔债。" \}/);
const claimBlock = js.match(/const claimPermit = \(permitKey\) => \{[\s\S]*?\n  \};/);
assert.ok(claimBlock, "claimPermit must exist");
assert.match(claimBlock[0], /if \(AutoAdvance\.has\("night-shift-registry"\)\) return;/, "permit claim is first-locked");
assert.match(claimBlock[0], /if \(st\.settled \|\| st\.permit !== "none"\) return;/, "one permit per cycle, never after settlement");
assert.match(claimBlock[0], /st\.permitCycle = st\.cycle;/, "claim records the current cycle");
assert.match(claimBlock[0], /st\.permitRuns = Math\.min\(FLOOR_NUM_CAP, st\.permitRuns \+ 1\);/);
assert.match(claimBlock[0], /AutoAdvance\.schedule\("night-shift-registry", "unnumbered-floor", \{ delay: branchDelay\(\) \}\);/, "claim auto-returns to the floor");
const enterRegistryBlock = js.match(/const enterRegistry = \(\) => \{[\s\S]*?\n  \};/);
assert.match(enterRegistryBlock[0], /if \(st\.settled\) \{[\s\S]*?st\.permit = "none";[\s\S]*?saveFloor\(st\);/, "entering the registry from a settled state starts a fresh cycle first");
const paintRegistryBlock = js.match(/const paintRegistry = \(\) => \{[\s\S]*?\n  \};/);
assert.match(paintRegistryBlock[0], /btn\.disabled = claimed;/, "claimed permits disable all three cards but stay visible");
assert.match(paintRegistryBlock[0], /btn\.setAttribute\("aria-pressed", st\.permit === key \? "true" : "false"\);/, "claimed permit restores aria-pressed");
assert.match(js, /if \(name === "night-shift-registry"\) enterRegistry\(\);/);
assert.match(js, /夜班登记：领证 \$\{st\.permitRuns\} 次，无铃 \$\{st\.muteBellRuns\}，失名 \$\{st\.blankNameRuns\}，反面 \$\{st\.reverseBadgeRuns\}。/, "registry memory line verbatim");
assert.match(js, /paintRegistryMemory\(\);/);

/* 三档正常可达数值表：两房净值 4 + 凭证修正 */
assert.match(css, /\.floor-doors \{\s*grid-template-columns: repeat\(2, 1fr\);\s*\}/, "floor doors form a 2x2 grid with the registry window");
assert.match(css, /\.scene-night-shift-registry \.valuation-relics \{\s*grid-template-columns: repeat\(3, 1fr\);\s*gap: 0\.5rem;\s*\}/, "registry permits stay three compact columns on mobile");

/* ---------- v37 午夜回拨台：其六/夹道双入口 + 三线现场回拨 ---------- */
/* 四张正式 WebP 存在且被引用，四张监理源 PNG 保留 */
for (const asset of ["assets/midnight-callback-desk.webp", "assets/callback-bellless-ward.webp", "assets/callback-seeping-records.webp", "assets/callback-reverse-laundry.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-midnight-callback-desk", "source-callback-bellless-ward", "source-callback-seeping-records", "source-callback-reverse-laundry"]) {
  await access(new URL(`design-references/${src}.png`, root));
}

/* 新场景：回拨签、三线卡（真实位图 eager）、回台出口，零 inline SVG */
const callbackSection = html.match(/<section class="scene scene-branch scene-midnight-callback"[\s\S]*?<\/section>/);
assert.ok(callbackSection, "scene section missing: midnight-callback");
assert.ok(callbackSection[0].includes("午夜回拨台") && callbackSection[0].includes("三只听筒都晚了八分钟。总机把现场先送到你面前，再等你回来承认听见了什么。"), "callback epigraph verbatim");
assert.ok(!callbackSection[0].includes("<svg"), "callback must not use inline SVG");
for (const id of ["callback-stat-done", "callback-stat-verification", "callback-stat-debt", "callback-stat-best", "callback-line-ward", "callback-line-records", "callback-line-laundry", "callback-response"]) {
  assert.ok(callbackSection[0].includes(`id="${id}"`), `callback missing #${id}`);
}
assert.equal((callbackSection[0].match(/<button class="relic-card callback-line"/g) || []).length, 3, "callback holds exactly 3 line cards");
assert.equal((callbackSection[0].match(/loading="eager"/g) || []).length, 3, "all three line card images load eagerly");
assert.ok(callbackSection[0].includes("接通无铃病房") && callbackSection[0].includes("接通渗水档案池") && callbackSection[0].includes("接通逆照洗衣房"), "three line titles verbatim");
assert.ok(callbackSection[0].includes("听筒没有响。床头柜已经替你说了“收到”。") && callbackSection[0].includes("来电者没有名字，档案页却在听筒里翻动。") && callbackSection[0].includes("滚筒没有转，听筒里的工服却一直摩擦镜面。"), "three line omens verbatim");
assert.match(callbackSection[0], /id="callback-response" aria-live="polite"/);

/* 守则其六：原文与反馈逐字不变，只改目的地；玖异常不受影响 */
assert.match(js, /6: "现在几点？你确定吗？",/, "rule six feedback stays verbatim");
assert.match(js, /const RULE_DETOUR = \{ 2: "return-passage", 3: "glyph-niche", 4: "peephole-chamber", 5: "return-audit", 6: "midnight-callback", 7: "glyph-niche", 8: "proxy-admission" \};/, "rule six joins the detour map only by destination");
assert.match(js, /if \(n === "6"\) markCallbackEntry\("protocol"\);/, "rule six records the callback entry");
assert.match(js, /goScene\("ninth"\)/, "the ninth anomaly path is untouched");
/* 回返夹道第五入口与原四动作保持 */
assert.ok(html.includes("接起墙里晚了八分钟的电话") && html.includes("听筒正在读守则其六"), "fifth passage action visible");
assert.match(js, /墙里的电话比铃声晚响了八分钟。听筒正在读守则其六。/, "passage callback feedback verbatim");
assert.match(html, /<a href="#midnight-callback" id="callback-link" hidden/);
assert.ok(html.includes('id="callback-memory"'), "remembrance gains the single callback memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v37 状态契约：独立 key、容错解析、分值重算、与 v28–v35 零引用 */
assert.match(js, /const CALLBACK_KEY = "goddead_v37_midnight_callback";/);
const callbackParseBlock = js.match(/const getCallback = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(callbackParseBlock, "getCallback must exist");
assert.match(callbackParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt callback storage must be safely repaired");
assert.match(callbackParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(callbackParseBlock[0], /CALLBACK_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "neutral"/, "illegal entry falls back to neutral");
assert.match(callbackParseBlock[0], /new Set\(raw\.completedLines\.filter\(\(l\) => CALLBACK_LINES\.includes\(l\)\)\)/, "completedLines stays a unique whitelist subset");
assert.match(callbackParseBlock[0], /if \(completedLines\.includes\(pendingLine\)\) pendingLine = "none";/, "conflicting pending normalizes to none");
assert.match(callbackParseBlock[0], /verification \+= CALLBACK_LINE_VALUES\[l\]\[0\];/, "verification is recomputed from completedLines, never trusted");
assert.match(callbackParseBlock[0], /lineDebt \+= CALLBACK_LINE_VALUES\[l\]\[1\];/, "lineDebt is recomputed from completedLines, never trusted");
assert.match(callbackParseBlock[0], /completedLines\.includes\("ward"\) && completedLines\.includes\("records"\)\) derivedOutcome = "clear";/, "outcome derives ward+records as clear");
assert.match(callbackParseBlock[0], /completedLines\.includes\("ward"\) && completedLines\.includes\("laundry"\)\) derivedOutcome = "uncertain";/, "outcome derives ward+laundry as uncertain");
assert.match(callbackParseBlock[0], /else derivedOutcome = "contaminated";/, "outcome derives records+laundry as contaminated");
assert.ok(!/CALLBACK_OUTCOMES\.includes\(raw\.outcome\)/.test(callbackParseBlock[0]), "raw outcome is never trusted over the derivation");
assert.match(callbackParseBlock[0], /if \(completedLines\.length < 2\) \{ settled = false; outcome = ""; \}/, "settled requires two completed lines");
assert.match(callbackParseBlock[0], /raw\.marks\.filter\(\(m\) => CALLBACK_MARKS\.includes\(m\)\)/, "illegal callback marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35)/.test(callbackParseBlock[0]), "callback state must not touch v28-v35");

/* 三线 meta、回拨 meta 与逻辑 */
assert.match(js, /ward: \{ btn: "#callback-line-ward", resultEl: "#callback-result-ward", mark: "connectedWardLine", response: "总机把没有铃声的那一段线路塞进你耳后。" \}/);
assert.match(js, /records: \{ btn: "#callback-line-records", resultEl: "#callback-result-records", mark: "connectedRecordsLine", response: "墨水沿电话线爬上来，把这一段接成了潮湿的黑色。" \}/);
assert.match(js, /laundry: \{ btn: "#callback-line-laundry", resultEl: "#callback-result-laundry", mark: "connectedLaundryLine", response: "黄铜线穿过镜面，把你的声音挂进那件工服。" \}/);
assert.match(js, /"bellless-ward": \{ line: "ward", btn: "#ward-choice-callback", mark: "reportedWardLine", response: "你说“没有铃声”。总机记录了三次完全相同的铃响。" \}/);
assert.match(js, /"seeping-records": \{ line: "records", btn: "#records-choice-callback", mark: "reportedRecordsLine", response: "你念出空白姓名栏。总机用你的号码补上了那一格。" \}/);
assert.match(js, /"reverse-laundry": \{ line: "laundry", btn: "#laundry-choice-callback", mark: "reportedLaundryLine", response: "你报告“没有倒影”。滚筒替你留下了两份相反的录音。" \}/);
const connectBlock = js.match(/const connectLine = \(line\) => \{[\s\S]*?\n  \};/);
assert.match(connectBlock[0], /if \(AutoAdvance\.has\("midnight-callback"\)\) return;/, "line connect is first-locked");
assert.match(connectBlock[0], /if \(st\.settled \|\| st\.completedLines\.includes\(line\)\) return;/, "settled or completed lines never reconnect");
assert.match(connectBlock[0], /if \(st\.pendingLine !== "none" && st\.pendingLine !== line\) return;/, "rival lines stay locked while one is pending");
assert.match(connectBlock[0], /const reconnect = st\.pendingLine === line;/, "the pending card itself stays reconnectable");
assert.match(connectBlock[0], /if \(!reconnect\) \{[\s\S]*?st\.pendingLine = line;[\s\S]*?saveCallback\(st\);/, "reconnecting the pending line rewrites nothing");
assert.ok(!/st\.verification \+=|st\.lineDebt \+=/.test(connectBlock[0]), "connecting a line never adds score");
const reportBlock = js.match(/const reportLine = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(reportBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "room callback shares the room first-lock");
assert.match(reportBlock[0], /if \(st\.settled \|\| st\.pendingLine !== meta\.line \|\| st\.completedLines\.includes\(meta\.line\)\) return;/, "callback only armed for the pending line, never twice");
assert.match(reportBlock[0], /st\.completedLines\.push\(meta\.line\);[\s\S]*?st\.pendingLine = "none";/, "report completes the line and clears pending");
const settleCallbackBlock = js.match(/const settleCallback = \(\) => \{[\s\S]*?\n  \};/);
assert.match(settleCallbackBlock[0], /if \(st\.settled \|\| st\.completedLines\.length < 2\) return;/, "settle runs exactly once");
assert.ok(settleCallbackBlock[0].includes("两条现场报告互相承认。复核科愿意把这次来电当成证据。") && settleCallbackBlock[0].includes("两条线路只对上了一半。倒置窥孔要求亲眼再看一次。") && settleCallbackBlock[0].includes("线债吃掉了全部核实。回返夹道接起第三条线，用你的声音说“回来”。"), "three tier feedbacks verbatim");
assert.match(settleCallbackBlock[0], /has\("ward"\) && has\("records"\)[\s\S]*?target = "anomaly-review";/, "ward+records rides clear to anomaly-review");
assert.match(settleCallbackBlock[0], /has\("ward"\) && has\("laundry"\)[\s\S]*?target = "peephole-chamber";/, "ward+laundry rides uncertain to peephole-chamber");
assert.match(settleCallbackBlock[0], /target = "return-passage";/, "records+laundry rides contaminated to return-passage");
const enterCallbackBlock = js.match(/const enterCallback = \(\) => \{[\s\S]*?\n  \};/);
assert.match(enterCallbackBlock[0], /if \(st\.settled\) \{[\s\S]*?st\.cycle = Math\.min\(CALLBACK_NUM_CAP, st\.cycle \+ 1\);[\s\S]*?st\.completedLines = \[\];/, "settled desk restarts as a fresh cycle");
assert.match(enterCallbackBlock[0], /settleCallback\(\);/, "returning with two lines auto-settles without a settle button");
assert.match(js, /btn\.disabled = st\.settled \|\| st\.pendingLine !== meta\.line \|\| st\.completedLines\.includes\(meta\.line\);/, "room callback button state matches pending/completed");
assert.match(js, /午夜回拨：完成 \$\{st\.completedRuns\} 轮，清线 \$\{st\.clearRuns\}，疑线 \$\{st\.uncertainRuns\}，污线 \$\{st\.contaminatedRuns\}，最佳线路 \$\{st\.bestRoute\}。/, "callback memory line verbatim");
assert.match(js, /paintCallbackMemory\(\);/);
assert.match(js, /syncCallbackLink\(\);/);
assert.match(html, /id="callback-link" hidden data-hover>01ρ \/ 午夜回拨/, "directory labels the desk 01ρ");

/* ---------- v38 门外代审窗：门板第四热点 / 守则其八 + 三问两判 ---------- */
/* 五张正式 WebP 存在且被引用，五张监理源 PNG 保留 */
for (const asset of ["assets/proxy-admission-window.webp", "assets/proxy-visitor-nurse.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const asset of ["assets/proxy-visitor-postman.webp", "assets/proxy-visitor-umbrella.webp", "assets/proxy-visitor-widow.webp"]) {
  await access(new URL(asset, root));
  assert.ok(js.includes(asset), `${asset} must be referenced by the visitor meta`);
}
for (const src of ["source-proxy-admission-window", "source-proxy-visitor-nurse", "source-proxy-visitor-postman", "source-proxy-visitor-umbrella", "source-proxy-visitor-widow"]) {
  await access(new URL(`design-references/${src}.png`, root));
}

/* 新场景：代审簿、当前访客、三问两判、回门外出口，零 inline SVG */
const proxySection = html.match(/<section class="scene scene-branch scene-proxy-admission"[\s\S]*?<\/section>/);
assert.ok(proxySection, "scene section missing: proxy-admission");
assert.ok(proxySection[0].includes("门外代审窗") && proxySection[0].includes("门后的值班员不肯露面，只把三份访客档案从门缝里推给你。今夜由门外的人决定，谁还能被称为在场。"), "proxy epigraph verbatim");
assert.ok(!proxySection[0].includes("<svg"), "proxy must not use inline SVG");
for (const id of ["proxy-stat-done", "proxy-stat-proof", "proxy-stat-debt", "proxy-stat-asked", "proxy-stat-best", "proxy-visitor-img", "proxy-visitor-name", "proxy-visitor-statement", "proxy-question-name", "proxy-question-shadow", "proxy-question-knock", "proxy-judge-admit", "proxy-judge-refuse", "proxy-response"]) {
  assert.ok(proxySection[0].includes(`id="${id}"`), `proxy missing #${id}`);
}
assert.ok(proxySection[0].includes("报上登记名") && proxySection[0].includes("让影子先回答") && proxySection[0].includes("请按规定敲门"), "three question buttons verbatim");
assert.ok(proxySection[0].includes("准许入内") && proxySection[0].includes("留在门外"), "two judgement buttons verbatim");
assert.ok(!/下一位|确认|继续/.test(proxySection[0]), "no next/confirm/continue button in the proxy scene");
assert.match(proxySection[0], /id="proxy-visitor-img" src="assets\/proxy-visitor-nurse\.webp" alt="" width="1536" height="1024" loading="eager"/, "visitor image loads eagerly");
assert.match(proxySection[0], /id="proxy-response" aria-live="polite"/);
assert.match(proxySection[0], /data-go="threshold"/, "proxy keeps an explicit back-to-threshold exit");
assert.match(css, /\.hotspot-proxy \{/, "fourth door hotspot styled");
assert.match(html, /<a href="#proxy-admission" id="proxy-link" hidden/);
assert.ok(html.includes('id="proxy-memory"'), "remembrance gains the single proxy memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* 守则其八：原文与反馈逐字不变，只改目的地 */
assert.match(js, /8: "确认无效。",/, "rule eight feedback stays verbatim");
assert.match(js, /if \(n === "8"\) markProxyEntry\("protocol"\);/, "rule eight records the proxy entry");

/* v38 状态契约：独立 key、容错解析、从 decisions 重算、与 v28–v37 零引用 */
assert.match(js, /const PROXY_KEY = "goddead_v38_proxy_admission";/);
const proxyParseBlock = js.match(/const getProxy = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(proxyParseBlock, "getProxy must exist");
assert.match(proxyParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt proxy storage must be safely repaired");
assert.match(proxyParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(proxyParseBlock[0], /PROXY_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(proxyParseBlock[0], /isValidProxyRoster\(raw\.roster\) \? raw\.roster\.slice\(\) : proxyRosterFor\(entry, cycle\)/, "illegal roster rebuilt deterministically");
assert.match(proxyParseBlock[0], /for \(const v of roster\) \{[\s\S]*?if \(c === "admit" \|\| c === "refuse"\) decisions\[v\] = c;[\s\S]*?else break;/, "decisions keep only the contiguous judged prefix of the current roster");
assert.match(proxyParseBlock[0], /roster\.includes\(v\) && Array\.isArray\(raw\.questioned\[v\]\)/, "questioned drops off-roster data");
assert.match(proxyParseBlock[0], /if \(correct\) proof \+= 2;/, "proof recomputed from decisions");
assert.match(proxyParseBlock[0], /doorDebt \+= 1;/, "door debt recomputed from decisions");
assert.match(proxyParseBlock[0], /if \(decisions\[v\] === "admit"\) admittedEcho = true;/, "admitted echo recomputed from decisions");
assert.match(proxyParseBlock[0], /else rejectedPresent = true;/, "rejected present recomputed from decisions");
assert.match(proxyParseBlock[0], /const settled = index >= 3;/, "settled derives from three valid decisions, never from raw");
assert.match(proxyParseBlock[0], /const outcome = settled \? derivedOutcome : "";/, "outcome derives from decisions only");
assert.match(proxyParseBlock[0], /raw\.marks\.filter\(\(m\) => PROXY_MARKS\.includes\(m\)\)/, "illegal proxy marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37)/.test(proxyParseBlock[0]), "proxy state must not touch v28-v37");

/* 四轮 roster 矩阵：从源码提取实际矩阵验证白名单性质与确定性移位 */
const proxyMatrixBlock = js.match(/const PROXY_ROSTER_MATRIX = \[([\s\S]*?)\];/);
assert.ok(proxyMatrixBlock, "PROXY_ROSTER_MATRIX must exist");
const proxyMatrixRows = [...proxyMatrixBlock[1].matchAll(/\["(\w+)", "(\w+)", "(\w+)"\]/g)].map((m) => [m[1], m[2], m[3]]);
assert.equal(proxyMatrixRows.length, 4, "roster matrix holds four rounds");
for (const row of proxyMatrixRows) {
  assert.equal(new Set(row).size, 3, "each roster round holds three distinct visitors");
  assert.ok(row.every((v) => ["nurse", "postman", "umbrella", "widow"].includes(v)), "roster visitors stay in the whitelist");
}
assert.ok(["nurse", "postman", "umbrella", "widow"].every((v) => proxyMatrixRows.some((row) => row.includes(v))), "all four visitors appear across the matrix");
assert.match(js, /PROXY_ROSTER_MATRIX\[\(PROXY_ENTRY_ROW\[entry\] \+ cycle\) % PROXY_ROSTER_MATRIX\.length\]/, "rosters rotate deterministically by entry and cycle");
assert.ok(!/Math\.random/.test(proxyMatrixBlock[0]), "roster rotation must not use bare randomness");

/* 四名访客档案：陈述、三问证词、正误反馈逐字 */
assert.ok(js.includes("“我来接没人肯接的下一班。”") && js.includes("“我只送还没有写完的那一封。”") && js.includes("“伞是门里的人借我的。我来还。”") && js.includes("“孩子已经睡了。请别让门把祂吵醒。”"), "four visitor statements verbatim");
assert.ok(js.includes("“编号被铃声擦掉了，名字还在今天的值班簿里。”") && js.includes("“收件人是你。寄件日期比你的到访早一天。”") && js.includes("“名字没有写在纸上。门环认得握过它的手。”") && js.includes("她报出的名字，正是代审簿刚写给你的那个。"), "four register-name testimonies verbatim");
assert.ok(js.includes("她抬手时，影子也在同一刻碰到玻璃。") && js.includes("他的手没有动，影子已经把信封推进门缝。") && js.includes("信使、黑伞与三枚门环在地上同时偏向左侧。") && js.includes("她的双臂是空的；墙上影子却在轻拍一个婴儿。"), "four shadow testimonies verbatim");
assert.ok(js.includes("三声。每一声都从门外传来。") && js.includes("嘴里数到三，门上却留下四次回声。") && js.includes("他用伞柄敲三次；黄铜每次都留下新的凹痕。") && js.includes("第一声从门后传来，随后她才抬起手。"), "four knock testimonies verbatim");
assert.ok(js.includes("问讯窗承认她仍在场。你的名字从她的空编号牌上退了下来。") && js.includes("黑封蜡停在门槛外。那封信只好继续写你的名字。") && js.includes("门环认出了那只手。黑伞合上时，门外少了一场雨。") && js.includes("襁褓的影子留在墙上，妇人却从问讯窗外消失了。"), "four correct feedbacks verbatim");
assert.ok(js.includes("你把仍在场的人留在门外。窥孔开始重新核对你。") && js.includes("你放行了发生在本人之前的投递。回返夹道多出一双脚印。") && js.includes("你拒绝了还伞的人。门后的雨开始从窥孔里落下。") && js.includes("你让一个借用你名字的回声入内。失号龛替它擦掉了编号。"), "four wrong feedbacks verbatim");

/* 三问与两判逻辑 */
const askBlock = js.match(/const askProxy = \(qId\) => \{[\s\S]*?\n  \};/);
assert.match(askBlock[0], /if \(AutoAdvance\.has\("proxy-admission"\) \|\| AutoAdvance\.has\("proxy-admission-step"\)\) return;/, "questions lock during the feedback beat");
assert.match(askBlock[0], /if \(askedHere\.includes\(qId\)\) return;/, "re-asking never re-counts");
assert.ok(!/proof|doorDebt/.test(askBlock[0]), "asking never changes the score");
const judgeBlock = js.match(/const judgeProxy = \(choice\) => \{[\s\S]*?\n  \};/);
assert.match(judgeBlock[0], /if \(AutoAdvance\.has\("proxy-admission"\) \|\| AutoAdvance\.has\("proxy-admission-step"\)\) return;/, "judgement is first-locked across both scopes");
assert.match(judgeBlock[0], /if \(!meta \|\| st\.decisions\[visitorId\]\) return;/, "each visitor is judged exactly once");
assert.match(judgeBlock[0], /const correct = \(choice === "admit"\) === meta\.present;/, "correct judgement matches presence");
assert.match(judgeBlock[0], /st\.totalJudgments = Math\.min\(PROXY_NUM_CAP, st\.totalJudgments \+ 1\);/);
assert.match(judgeBlock[0], /AutoAdvance\.schedule\("proxy-admission-step", "proxy-admission"/, "next visitor auto-advances after the beat");
const settleProxyBlock = js.match(/const settleProxy = \(\) => \{[\s\S]*?\n  \};/);
assert.match(settleProxyBlock[0], /if \(st\.index < 3 \|\| st\.settleDone\) return;/, "settle side-effects run exactly once per batch");
assert.match(settleProxyBlock[0], /st\.settleDone = true;/, "settle completion is persisted explicitly");
assert.ok(js.includes("三份证词互相承认。守则同意把你登记为访客。") && js.includes("你把仍在场的人挡在门外。倒置窥孔要求先核对门卫。") && js.includes("你放行的那道回声已经从里面敲门。回返夹道负责把它送回来。") && js.includes("门债盖过了全部在场证。失号龛收走了代审簿上的名字。"), "four outcome feedbacks verbatim");
assert.match(settleProxyBlock[0], /if \(st\.proof === 6 && st\.doorDebt === 0\) return "verified";/, "6/0 settles verified");
assert.match(settleProxyBlock[0], /if \(st\.proof === 4 && st\.rejectedPresent\) return "paranoid";/, "4/1 with rejected present settles paranoid");
assert.match(settleProxyBlock[0], /if \(st\.proof === 4 && st\.admittedEcho\) return "contaminated";/, "4/1 with admitted echo settles contaminated");
assert.match(js, /verified: \{ target: "protocol", feedback: "三份证词互相承认。守则同意把你登记为访客。" \}/);
assert.match(js, /paranoid: \{ target: "peephole-chamber", feedback: "你把仍在场的人挡在门外。倒置窥孔要求先核对门卫。" \}/);
assert.match(js, /contaminated: \{ target: "return-passage", feedback: "你放行的那道回声已经从里面敲门。回返夹道负责把它送回来。" \}/);
assert.match(js, /unnamed: \{ target: "glyph-niche", feedback: "门债盖过了全部在场证。失号龛收走了代审簿上的名字。" \}/);
const enterProxyBlock = js.match(/const enterProxy = \(\) => \{[\s\S]*?\n  \};/);
assert.match(enterProxyBlock[0], /if \(st\.settled\) \{[\s\S]*?st\.cycle = Math\.min\(PROXY_NUM_CAP, st\.cycle \+ 1\);[\s\S]*?st\.roster = proxyRosterFor\(st\.entry, st\.cycle\);[\s\S]*?st\.decisions = \{\};/, "settled runs restart as the next deterministic cycle");
assert.match(js, /门缝从里面拉开。值班员把你的影子登记成了代理人。/, "threshold hotspot feedback verbatim");
assert.match(js, /门外代审：你替门判断了 \$\{st\.totalJudgments\} 次；最高留下 \$\{st\.bestProof\} 份在场证。/, "proxy memory line verbatim");
assert.match(js, /paintProxyMemory\(\);/);
assert.match(js, /syncProxyLink\(\);/);

/* ---------- v39 归路核验站：守则其五 + 三岔枢纽任选两条 + 每条两判断 ---------- */
/* 四张正式 WebP 存在且被引用，四张监理源 PNG 保留 */
for (const asset of ["assets/return-audit-hall.webp", "assets/return-audit-echo.webp", "assets/return-audit-vein.webp", "assets/return-audit-confession.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-return-audit-hall", "source-return-audit-echo", "source-return-audit-vein", "source-return-audit-confession"]) {
  await access(new URL(`design-references/${src}.png`, root));
}

/* 枢纽场景：核验签、母图、三路线热点逐字、回守则出口，零 inline SVG、无继续按钮 */
const auditSection = html.match(/<section class="scene scene-branch scene-return-audit"[\s\S]*?<\/section>/);
assert.ok(auditSection, "scene section missing: return-audit");
assert.ok(auditSection[0].includes("归路核验站"), "audit hub title");
assert.ok(!auditSection[0].includes("<svg"), "audit hub must not use inline SVG");
for (const id of ["audit-stat-done", "audit-stat-recall", "audit-stat-misstep", "audit-stat-best", "audit-route-echo", "audit-route-vein", "audit-route-confession", "audit-response"]) {
  assert.ok(auditSection[0].includes(`id="${id}"`), `audit hub missing #${id}`);
}
assert.ok(auditSection[0].includes("进入回声岔廊") && auditSection[0].includes("通过血管检票闸") && auditSection[0].includes("打开忏悔寄存柜"), "three route hotspots verbatim");
assert.ok(auditSection[0].includes("最响的那声，总是最晚到达") && auditSection[0].includes("红灯亮时，闸机正在吞咽") && auditSection[0].includes("写着你名字的格子并不属于你"), "three route hotspot hints verbatim");
assert.ok(!/下一步|确认|继续/.test(auditSection[0]), "no next/confirm/continue button in the audit hub");
assert.match(auditSection[0], /src="assets\/return-audit-hall\.webp" alt="" width="1536" height="1024"/);
assert.match(auditSection[0], /id="audit-response" aria-live="polite"/);
assert.match(auditSection[0], /data-go="protocol"/, "audit hub keeps an explicit back-to-protocol exit");

/* 三条路线场景：提示、两判断逐字、回核验站出口 */
const echoTurnSection = html.match(/<section class="scene scene-branch scene-audit-route scene-echo-turn"[\s\S]*?<\/section>/);
assert.ok(echoTurnSection, "scene section missing: echo-turn");
assert.ok(echoTurnSection[0].includes("回声岔廊") && echoTurnSection[0].includes("三次呼唤都用了你的声音。最响的那次最后才发生。"), "echo turn hint verbatim");
assert.ok(echoTurnSection[0].includes("跟随最先出现的回声") && echoTurnSection[0].includes("跟随最响的回声"), "echo turn two judgements verbatim");
assert.ok(echoTurnSection[0].includes('id="echo-turn-choice-first"') && echoTurnSection[0].includes('id="echo-turn-choice-loud"') && echoTurnSection[0].includes('id="echo-turn-response"'), "echo turn ids");
assert.match(echoTurnSection[0], /src="assets\/return-audit-echo\.webp"/);
assert.match(echoTurnSection[0], /data-go="return-audit"/);
assert.ok(!/下一步|确认|继续/.test(echoTurnSection[0]), "no next/confirm/continue button in echo turn");
const veinTurnSection = html.match(/<section class="scene scene-branch scene-audit-route scene-vein-turnstile"[\s\S]*?<\/section>/);
assert.ok(veinTurnSection, "scene section missing: vein-turnstile");
assert.ok(veinTurnSection[0].includes("血管检票闸") && veinTurnSection[0].includes("每次红灯亮起，闸机都在把什么送回更深处。"), "vein turnstile hint verbatim");
assert.ok(veinTurnSection[0].includes("趁苍白停搏穿过") && veinTurnSection[0].includes("跟着红色脉冲前进"), "vein turnstile two judgements verbatim");
assert.ok(veinTurnSection[0].includes('id="vein-turnstile-choice-pale"') && veinTurnSection[0].includes('id="vein-turnstile-choice-pulse"') && veinTurnSection[0].includes('id="vein-turnstile-response"'), "vein turnstile ids");
assert.match(veinTurnSection[0], /src="assets\/return-audit-vein\.webp"/);
assert.match(veinTurnSection[0], /data-go="return-audit"/);
const confessionLockerSection = html.match(/<section class="scene scene-branch scene-audit-route scene-confession-locker"[\s\S]*?<\/section>/);
assert.ok(confessionLockerSection, "scene section missing: confession-locker");
assert.ok(confessionLockerSection[0].includes("忏悔寄存所") && confessionLockerSection[0].includes("这里收走忏悔，也收走说出忏悔的人。"), "confession locker hint verbatim");
assert.ok(confessionLockerSection[0].includes("领取空白寄存牌") && confessionLockerSection[0].includes("领取写着自己的那枚"), "confession locker two judgements verbatim");
assert.ok(confessionLockerSection[0].includes('id="confession-locker-choice-blank"') && confessionLockerSection[0].includes('id="confession-locker-choice-named"') && confessionLockerSection[0].includes('id="confession-locker-response"'), "confession locker ids");
assert.match(confessionLockerSection[0], /src="assets\/return-audit-confession\.webp"/);
assert.match(confessionLockerSection[0], /data-go="return-audit"/);

/* 目录 01τ、痕迹单行、8 卡 */
assert.match(html, /<a href="#return-audit" id="audit-link" hidden data-hover>01τ \/ 归路核验<\/a>/);
assert.ok(html.includes('id="audit-memory"'), "remembrance gains the single audit memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");
assert.match(css, /\.scene-return-audit \.branch-figure \{/, "audit hub figure styled");
assert.match(css, /\.scene-audit-route \.branch-figure \{/, "audit route figures styled");

/* 守则其五：原文与反馈逐字不变，只改目的地 */
assert.ok(html.includes("回声、血管与忏悔都可以进入。进去之前，确认你还记得回来的路。"), "rule five text stays verbatim");
assert.match(js, /5: "回来的路，你还记得吗？",/, "rule five feedback stays verbatim");
assert.match(js, /if \(n === "5"\) markAuditEntry\("protocol"\);/, "rule five records the audit entry");

/* v39 状态契约：独立 key、容错解析、order/decisions 连续前缀、派生重算、与 v28–v38 零引用 */
assert.match(js, /const AUDIT_KEY = "goddead_v39_return_audit";/);
const auditParseBlock = js.match(/const getAudit = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(auditParseBlock, "getAudit must exist");
assert.match(auditParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt audit storage must be safely repaired");
assert.match(auditParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(auditParseBlock[0], /AUDIT_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(auditParseBlock[0], /\[\.\.\.new Set\(raw\.order\.filter\(\(r\) => AUDIT_ROUTES\.includes\(r\)\)\)\]\.slice\(0, 2\)/, "order is whitelisted, deduped and capped at two");
assert.match(auditParseBlock[0], /for \(const r of order\) \{[\s\S]*?if \(typeof c === "string" && AUDIT_ROUTE_META\[r\]\.choices\[c\]\) decisions\[r\] = c;[\s\S]*?else break;/, "decisions keep only the contiguous legal prefix along order");
assert.match(auditParseBlock[0], /order = order\.slice\(0, Object\.keys\(decisions\)\.length\);/, "order trims to the legal decisions prefix");
assert.match(auditParseBlock[0], /if \(AUDIT_ROUTE_META\[r\]\.choices\[decisions\[r\]\]\.correct\) recall \+= 1;/, "recall recomputed from decisions");
assert.match(auditParseBlock[0], /misstep \+= 1;/, "misstep recomputed from decisions");
assert.match(auditParseBlock[0], /const settled = completedCount >= 2;/, "settled derives from two valid decisions, never from raw");
assert.match(auditParseBlock[0], /if \(recall === 2 && misstep === 0\) outcome = "verified";/, "2/0 derives verified");
assert.match(auditParseBlock[0], /else if \(recall === 0 && misstep === 2\) outcome = "lost";/, "0/2 derives lost");
assert.match(auditParseBlock[0], /else outcome = AUDIT_BRANCH_OUTCOME\[wrongRoute\] \|\| "";/, "1/1 derives the wrong-route outcome");
assert.match(auditParseBlock[0], /const settleDone = settled && raw\.settleDone === true;/, "settleDone is only a side-effect marker");
assert.match(auditParseBlock[0], /const pendingRoute = !settled && AUDIT_ROUTES\.includes\(raw\.pendingRoute\) && !order\.includes\(raw\.pendingRoute\)/, "illegal pendingRoute is cleared");
assert.match(auditParseBlock[0], /raw\.marks\.filter\(\(m\) => AUDIT_MARKS\.includes\(m\)\)/, "illegal audit marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38)/.test(auditParseBlock[0]), "audit state must not touch v28-v38");

/* 五档派生目的地与反馈逐字（中间档落既有 v29 场景） */
assert.match(js, /verified: \{ target: "protocol", feedback: "两段路线互相承认。守则允许你继续记得回来。" \}/);
assert.match(js, /lost: \{ target: "return-passage", feedback: "两段路线都指向你身后。回返夹道已经替你转过身。" \}/);
assert.match(js, /echoed: \{ target: "echo", feedback: "错误的回声先一步抵达档案室。它正在等原件签收。" \}/);
assert.match(js, /pulsed: \{ target: "vein", feedback: "闸机把迷路登记成一次维护请求。血管井已为你开盖。" \}/);
assert.match(js, /confessed: \{ target: "confession", feedback: "寄存柜拒绝退还你的名字。忏悔称量室负责核对重量。" \}/);
assert.match(js, /AUDIT_BRANCH_OUTCOME\[target\] !== auditGuardState\.outcome\s*\n\s*&& beliefGuard\.pendingTarget !== target/, "v29 guard keeps the narrow v39 outcome exception before the v53 addition");

/* 选择、判断与结算逻辑 */
const selectAuditBlock = js.match(/const selectAuditRoute = \(route\) => \{[\s\S]*?\n  \};/);
assert.match(selectAuditBlock[0], /if \(AutoAdvance\.has\("return-audit"\) \|\| AutoAdvance\.has\("return-audit-step"\)\) return;/, "route selection locks during beats");
assert.match(selectAuditBlock[0], /if \(st\.settled \|\| st\.order\.includes\(route\) \|\| st\.order\.length >= 2\) return;/, "completed routes and full runs reject selection");
assert.match(selectAuditBlock[0], /st\.pendingRoute = route;/, "selection records the pending route");
const judgeAuditBlock = js.match(/const judgeAudit = \(route, choiceKey\) => \{[\s\S]*?\n  \};/);
assert.match(judgeAuditBlock[0], /if \(AutoAdvance\.has\("return-audit"\) \|\| AutoAdvance\.has\("return-audit-step"\)\) return;/, "judgement is first-locked across both scopes");
assert.match(judgeAuditBlock[0], /if \(st\.settled \|\| st\.decisions\[route\] \|\| st\.order\.length >= 2\) return;/, "each route is judged exactly once per cycle");
assert.match(judgeAuditBlock[0], /if \(currentScene !== meta\.scene \|\| st\.pendingRoute !== route\) return;/, "hidden or off-route buttons can never advance order/decisions");
assert.match(judgeAuditBlock[0], /AutoAdvance\.schedule\("return-audit-step", "return-audit", \{\s*delay: auditDelay\(\),\s*before: \(\) => settleAudit\(\),/, "second judgement settles before returning to the hub");
const settleAuditBlock = js.match(/const settleAudit = \(\) => \{[\s\S]*?\n  \};/);
assert.match(settleAuditBlock[0], /if \(!st\.settled \|\| st\.settleDone\) return;/, "settle side-effects run exactly once per cycle");
assert.match(settleAuditBlock[0], /st\.settleDone = true;/, "settle completion is persisted explicitly");
assert.match(settleAuditBlock[0], /st\.totalAudits = Math\.min\(AUDIT_NUM_CAP, st\.totalAudits \+ 1\);/);
const enterAuditBlock = js.match(/const enterAudit = \(\) => \{[\s\S]*?\n  \};/);
assert.match(enterAuditBlock[0], /if \(st\.settled && st\.arrivalPending\) \{/, "pending settle beat resumes before any new cycle");
assert.match(enterAuditBlock[0], /st\.cycle = Math\.min\(AUDIT_NUM_CAP, st\.cycle \+ 1\);[\s\S]*?st\.order = \[\];[\s\S]*?st\.decisions = \{\};/, "finished runs restart as the next cycle");
assert.match(enterAuditBlock[0], /pendingSceneFocus = btn;/, "returning to the hub focuses the first unfinished route card");
const enterAuditRouteBlock = js.match(/const enterAuditRoute = \(sceneName\) => \{[\s\S]*?\n  \};/);
assert.ok(enterAuditRouteBlock, "enterAuditRoute must exist");
assert.match(enterAuditRouteBlock[0], /const decided = st\.decisions\[route\];/, "route entry detects an already-judged route after a reload");
assert.match(enterAuditRouteBlock[0], /if \(decided && !st\.arrivalPending\) \{/, "reload inside a judgement beat replays the feedback and re-arms the return");
assert.match(enterAuditRouteBlock[0], /if \(responseEl && choice\) responseEl\.textContent = choice\.feedback;/, "the replayed feedback is the route's verbatim one");
assert.match(enterAuditRouteBlock[0], /before: \(\) => settleAudit\(\),/, "a reloaded second judgement re-arms the settle beat");
assert.ok(js.includes("你走进最轻的那声。其余回声晚了一步，没能穿上你的影子。") && js.includes("最响的回声替你回答。岔廊把它登记成了先到的人。"), "echo feedbacks verbatim");
assert.ok(js.includes("停搏给你让出半步。闸机没有来得及记住你的体温。") && js.includes("红色脉冲把你夹进管壁。下一次心跳带走了你的方向。"), "vein feedbacks verbatim");
assert.ok(js.includes("空白牌没有认出你。所有柜门同时假装从未打开。") && js.includes("你的名字从牌上消失，随即从每只柜子里被念了一遍。"), "confession feedbacks verbatim");
assert.match(js, /归路核验：完成 \$\{st\.totalAudits\} 轮核验；最佳归路 \$\{st\.bestRecall\}。/, "audit memory line verbatim");
assert.match(js, /paintAuditMemory\(\);/);
assert.match(js, /syncAuditLink\(\);/);

/* ---------- v40 门外侧廊：首页纵深环境层 + 左右廊热点 + 三个画面热点场景 ---------- */
/* 四张正式 WebP 存在且被引用，四张监理源 PNG 保留 */
for (const asset of ["assets/threshold-lateral-hall.webp", "assets/unlit-lamp-gallery.webp", "assets/borrowed-shadow-gallery.webp", "assets/hinge-sorting-room.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-threshold-lateral-hall", "source-unlit-lamp-gallery", "source-borrowed-shadow-gallery", "source-hinge-sorting-room"]) {
  await access(new URL(`design-references/${src}.png`, root));
}

/* 首页：环境层垫在门图之下、两扇侧廊热点、既有门与四热点不变 */
assert.match(html, /<img class="lateral-hall-img" src="assets\/threshold-lateral-hall\.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" aria-hidden="true">/, "lateral hall environment layer present");
assert.ok(html.indexOf('class="lateral-hall-img"') < html.indexOf('id="door-btn"'), "hall layer sits under the existing door button");
assert.match(html, /id="hotspot-lateral-left" type="button" aria-label="沿门左侧不发光的灯廊前行"/);
assert.match(html, /id="hotspot-lateral-right" type="button" aria-label="跟随门右侧先行的影子"/);
assert.match(html, /id="door-img" src="assets\/threshold-bureau-door\.webp"/, "closed door image untouched");
assert.match(html, /id="door-open-img" src="assets\/threshold-bureau-door-open\.webp"/, "open door image untouched");
assert.match(css, /\.door-scene \{\s*position: relative;\s*width: min\(94vw, 960px\);\s*\}/, "door stage widened for the hall");
assert.match(css, /\.door-btn \{\s*position: relative;\s*z-index: 1;\s*display: block;\s*width: 76%;\s*margin: 0 auto;/, "central door enlarged above the hall layer");
assert.match(css, /\.lateral-hall-img \{/, "hall layer styled");
assert.match(css, /\.hotspot-lateral-left \{/, "left corridor hotspot positioned");
assert.match(css, /\.hotspot-lateral-right \{/, "right corridor hotspot positioned");

/* 三个新场景：说明逐字、三个画面内热点（figure 内、非底部卡片清单）、回门外出口，零 inline SVG */
const lampSection = html.match(/<section class="scene scene-branch scene-lateral scene-unlit-lamp-gallery"[\s\S]*?<\/section>/);
assert.ok(lampSection, "scene section missing: unlit-lamp-gallery");
assert.ok(lampSection[0].includes("无灯灯廊") && lampSection[0].includes("这里的灯只负责留下影子。照明是另一个部门的事。"), "lamp gallery epigraph verbatim");
assert.ok(!lampSection[0].includes("<svg"), "lamp gallery must not use inline SVG");
assert.ok(!lampSection[0].includes("branch-choices") && !lampSection[0].includes("branch-btn"), "lamp gallery must not degrade to a bottom card list");
assert.match(lampSection[0], /src="assets\/unlit-lamp-gallery\.webp" alt="" width="1536" height="1024"/);
for (const [id, label] of [["lamp-hotspot-lamp", "触碰那盏未亮的灯"], ["lamp-hotspot-rail", "沿着地面铜轨前行"], ["lamp-hotspot-squeeze", "从两排灯笼之间挤出去"]]) {
  assert.ok(lampSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `lamp gallery missing hotspot ${id}`);
}
assert.ok(lampSection[0].indexOf('id="lamp-hotspot-lamp"') > lampSection[0].indexOf("unlit-lamp-gallery.webp"), "lamp hotspots live inside the figure over real objects");
assert.match(lampSection[0], /id="lamp-response" aria-live="polite"/);
assert.match(lampSection[0], /data-go="threshold"/, "lamp gallery keeps a low-weight back-to-threshold exit");
const shadowSection = html.match(/<section class="scene scene-branch scene-lateral scene-borrowed-shadow-gallery"[\s\S]*?<\/section>/);
assert.ok(shadowSection, "scene section missing: borrowed-shadow-gallery");
assert.ok(shadowSection[0].includes("借影陈列廊") && shadowSection[0].includes("所有影子都登记过主人。少数主人还没有被制造出来。"), "shadow gallery epigraph verbatim");
assert.ok(!shadowSection[0].includes("<svg") && !shadowSection[0].includes("branch-btn"), "shadow gallery: no SVG, no card list");
assert.match(shadowSection[0], /src="assets\/borrowed-shadow-gallery\.webp" alt="" width="1536" height="1024"/);
for (const [id, label] of [["shadow-hotspot-stand", "站进人的影子"], ["shadow-hotspot-door", "推开门形的影子"], ["shadow-hotspot-follow", "跟随先走的门影"]]) {
  assert.ok(shadowSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `shadow gallery missing hotspot ${id}`);
}
assert.match(shadowSection[0], /id="shadow-response" aria-live="polite"/);
assert.match(shadowSection[0], /data-go="threshold"/);
const hingeSection = html.match(/<section class="scene scene-branch scene-lateral scene-hinge-sorting-room"[\s\S]*?<\/section>/);
assert.ok(hingeSection, "scene section missing: hinge-sorting-room");
assert.ok(hingeSection[0].includes("铰链分拣室") && hingeSection[0].includes("门板在别处。这里先决定每扇门应该向哪一边承认自己。"), "hinge room epigraph verbatim");
assert.ok(!hingeSection[0].includes("<svg") && !hingeSection[0].includes("branch-btn"), "hinge room: no SVG, no card list");
assert.match(hingeSection[0], /src="assets\/hinge-sorting-room\.webp" alt="" width="1536" height="1024"/);
for (const [id, label] of [["hinge-hotspot-inward", "装上向内开的铰链"], ["hinge-hotspot-remove", "让门不再有铰链"], ["hinge-hotspot-outward", "装上向外开的铰链"]]) {
  assert.ok(hingeSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `hinge room missing hotspot ${id}`);
}
assert.ok(hingeSection[0].indexOf('id="hinge-hotspot-inward"') < hingeSection[0].indexOf('id="hinge-hotspot-remove"') && hingeSection[0].indexOf('id="hinge-hotspot-remove"') < hingeSection[0].indexOf('id="hinge-hotspot-outward"'), "hinge tab order runs left to right");
assert.match(hingeSection[0], /id="hinge-response" aria-live="polite"/);
assert.match(hingeSection[0], /data-go="threshold"/);
assert.match(css, /\.scene-hotspot \{/);
assert.match(css, /\.lamp-hotspot-lamp \{/);
assert.match(css, /\.shadow-hotspot-stand \{/);
assert.match(css, /\.hinge-hotspot-inward \{/);

/* 目录 01υ/01φ/01χ、痕迹单行、8 卡 */
assert.match(html, /<a href="#unlit-lamp-gallery" id="lamp-link" hidden data-hover>01υ \/ 无灯灯廊<\/a>/);
assert.match(html, /<a href="#borrowed-shadow-gallery" id="shadow-link" hidden data-hover>01φ \/ 借影陈列<\/a>/);
assert.match(html, /<a href="#hinge-sorting-room" id="hinge-link" hidden data-hover>01χ \/ 铰链分拣<\/a>/);
assert.ok(html.includes('id="lateral-memory"'), "remembrance gains the single lateral memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v40 状态契约：独立 key、pending 四字段严格匹配、lastScene/lastAction 互相匹配、与 v28–v39 零引用 */
assert.match(js, /const LATERAL_KEY = "goddead_v40_lateral_corridors";/);
const lateralParseBlock = js.match(/const getLateral = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(lateralParseBlock, "getLateral must exist");
assert.match(lateralParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt lateral storage must be safely repaired");
assert.match(lateralParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(lateralParseBlock[0], /LATERAL_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(lateralParseBlock[0], /const acts = LATERAL_ACTIONS\[raw\.pending\.scene\];/, "pending scene must be whitelisted");
assert.match(lateralParseBlock[0], /if \(act && raw\.pending\.target === act\.target && raw\.pending\.feedback === act\.feedback\) \{/, "pending target and feedback must strictly match the whitelist table");
assert.match(lateralParseBlock[0], /const lastScene = LATERAL_SCENES\.includes\(raw\.lastScene\) \? raw\.lastScene : "";/, "lastScene whitelisted");
assert.match(lateralParseBlock[0], /const lastAction = lastScene && LATERAL_ACTIONS\[lastScene\]\[raw\.lastAction\] \? raw\.lastAction : "";/, "lastAction must match lastScene");
assert.match(lateralParseBlock[0], /Math\.min\(LATERAL_NUM_CAP, Math\.floor\(traversals\)\)/, "traversals floored and capped");
assert.match(lateralParseBlock[0], /raw\.marks\.filter\(\(m\) => LATERAL_MARKS\.includes\(m\)\)/, "illegal lateral marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39)/.test(lateralParseBlock[0]), "lateral state must not touch v28-v39");

/* 九动作：反馈/target/mark 逐字与首选锁、pending 持久化、触发前清 pending、重返重播 */
assert.match(js, /lamp: \{ btn: "#lamp-hotspot-lamp", target: "borrowed-shadow-gallery", feedback: "灯没有亮，影子却换到了你的脚下。", mark: "touchedUnlitLamp" \}/);
assert.match(js, /shadow: \{ btn: "#lamp-hotspot-rail", target: "hinge-sorting-room", feedback: "铜轨先在墙里拐弯，随后拖着走廊一起转向。", mark: "followedLampRail" \}/);
assert.match(js, /passage: \{ btn: "#lamp-hotspot-squeeze", target: "return-passage", feedback: "两排灯把你夹成一条更窄的回来。", mark: "escapedLampGallery" \}/);
assert.match(js, /stand: \{ btn: "#shadow-hotspot-stand", target: "unlit-lamp-gallery", feedback: "影子替你站住，灯廊因此空出一个位置。", mark: "stoodInBorrowedShadow" \}/);
assert.match(js, /shadowDoor: \{ btn: "#shadow-hotspot-door", target: "hinge-sorting-room", feedback: "没有门的铰链先响了。墙面向两侧让开。", mark: "openedShadowDoor" \}/);
assert.match(js, /peephole: \{ btn: "#shadow-hotspot-follow", target: "peephole-chamber", feedback: "门影从窥孔背面经过。你只好从里面去看它。", mark: "followedDoorShadow" \}/);
assert.match(js, /inward: \{ btn: "#hinge-hotspot-inward", target: "glyph-niche", feedback: "门轴把你的选择数成了第九道刻痕。", mark: "fittedInwardHinge" \}/);
assert.match(js, /remove: \{ btn: "#hinge-hotspot-remove", target: "return-audit", feedback: "门从路线中被删除。核验站要求你证明还记得来路。", mark: "removedFinalHinge" \}/);
assert.match(js, /outward: \{ btn: "#hinge-hotspot-outward", target: "proxy-admission", feedback: "门框向门外打开。代审窗已经在等下一位访客。", mark: "fittedOutwardHinge" \}/);
const runLateralBlock = js.match(/const runLateralAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runLateralBlock[0], /if \(currentScene !== LATERAL_SCENE_NAME\[sceneKey\]\) return;\s*if \(AutoAdvance\.has\("lateral-" \+ sceneKey\)\) return;\s*const st = getLateral\(\);/, "off-scene child hotspots are rejected before any state access, feedback or timer");
assert.match(runLateralBlock[0], /if \(AutoAdvance\.has\("lateral-" \+ sceneKey\)\) return;/, "first accepted action locks the scene beat");
assert.match(runLateralBlock[0], /st\.pending = \{ scene: sceneKey, action: actionId, target: act\.target, feedback: act\.feedback \};/, "accepted action persists the full pending mapping");
assert.match(runLateralBlock[0], /s\.pending = null;\s*saveLateral\(s\);/, "pending cleared right before the timer fires");
const enterLateralBlock = js.match(/const enterLateral = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(enterLateralBlock[0], /if \(st\.pending && st\.pending\.scene === sceneKey\) \{/, "returning to the pending scene replays and re-arms");
assert.match(enterLateralBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /"hotspot-lateral-left": \{ entry: "threshold-left", scene: "lamp", target: "unlit-lamp-gallery", feedback: "左侧黑暗向后退了一步。门没有移动，走廊却从它旁边长了出来。", mark: "enteredLeftCorridor" \}/);
assert.match(js, /"hotspot-lateral-right": \{ entry: "threshold-right", scene: "shadow", target: "borrowed-shadow-gallery", feedback: "右侧墙面折进门影。你还站在门外，但影子已经先行。", mark: "enteredRightCorridor" \}/);
assert.match(js, /门外侧廊：穿行 \$\{st\.traversals\} 次；无灯 \/ 借影 \/ 铰链已见 \$\{seen\}\/3。/, "lateral memory line verbatim");
assert.match(js, /paintLateralMemory\(\);/);
assert.match(js, /syncLateralLinks\(\);/);
const lateralSpotBlock = js.match(/const spot = LATERAL_THRESHOLD_SPOTS\[id\];[\s\S]*?addEventListener\("click", \(\) => \{[\s\S]*?\n    \}\);/);
assert.ok(lateralSpotBlock, "lateral threshold hotspot handler must exist");
assert.match(lateralSpotBlock[0], /if \(currentScene !== "threshold"\) return;\s*if \(AutoAdvance\.has\("threshold"\)\) return;\s*const st = getLateral\(\);/, "off-threshold lateral hotspots are rejected before any state access, feedback or timer");

/* v31 门前守卫：未访问直达落回门外；v40 只放行 lastAction 唯一对应目标；既有路径只读放行 */
assert.match(js, /if \(FORECOURT_SCENES\.includes\(target\) && !forecourtGuard\.visited\[FORECOURT_VISIT_KEY\[target\]\]\) \{/, "forecourt guard checks visited first");
assert.match(js, /LATERAL_V31_TARGET\[lateralGuard\.lastAction\] === target/, "v40 narrow exception maps exactly one action to one target");
assert.match(js, /if \(!forecourtAllowed\) target = "threshold";/, "unvisited direct access still falls back to the threshold");
assert.match(js, /if \(FORECOURT_SCENES\.includes\(detour\)\) markForecourtVisited\(detour\);/, "rule detours mark the v31 visit at click time");
assert.match(js, /if \(FORECOURT_SCENES\.includes\(choice\.target\)\) markForecourtVisited\(choice\.target\);/, "forecourt-internal actions mark the v31 target at click time");

/* ---------- v41 守则背室：布告板三入口 + 三间画面热点背室 ---------- */
/* 三张正式 WebP 存在且被引用，三张监理源 PNG 保留，原守则板未替换 */
for (const asset of ["assets/protocol-red-thread-registry.webp", "assets/protocol-blank-name-cloakroom.webp", "assets/protocol-clapperless-bell-desk.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-protocol-red-thread-registry", "source-protocol-blank-name-cloakroom", "source-protocol-clapperless-bell-desk"]) {
  await access(new URL(`design-references/${src}.png`, root));
}
assert.match(html, /<img class="protocol-img" src="assets\/visitor-protocol-board\.webp"/, "the original protocol board WebP is untouched");

/* 布告板三入口：figure 内、aria 逐字、短标签、独立反馈元素 */
const protocolFigure = html.match(/<figure class="protocol-figure reveal"[\s\S]*?<\/figure>/);
assert.ok(protocolFigure, "protocol figure missing");
for (const [id, label, short] of [
  ["protocol-hotspot-thread", "顺着访客守则左侧交叉的红线进入登记室", "红线"],
  ["protocol-hotspot-nameplate", "按下守则布告板下方没有姓名的长牌", "空名"],
  ["protocol-hotspot-bell", "按下守则布告板右下方不会发声的黄铜铃钮", "无舌铃"],
]) {
  assert.ok(protocolFigure[0].includes(`id="${id}" type="button" aria-label="${label}"`), `protocol board missing hotspot ${id}`);
  assert.ok(protocolFigure[0].includes(`>${short}</span>`), `protocol hotspot ${id} missing short label`);
}
assert.match(html, /<p class="backroom-response" id="protocol-backroom-response" aria-live="polite"><\/p>/, "independent backroom response line present");
assert.ok(html.indexOf('id="protocol-backroom-response"') < html.indexOf("</figure>") && html.indexOf('id="protocol-backroom-response"') > html.indexOf('id="protocol-hotspot-bell"'), "backroom response line lives inside the board figure (first-viewport perceivable)");
assert.match(css, /\.protocol-figure \{\s*position: relative;/, "protocol figure is a positioning container");
assert.match(css, /\.protocol-hotspot-thread \{/);
assert.match(css, /\.protocol-hotspot-nameplate \{/);
assert.match(css, /\.protocol-hotspot-bell \{/);
assert.match(css, /\.backroom-hotspot \{/);

/* 三间背室：说明逐字、三个画面内热点（figure 内、非卡片清单）、回守则出口，零 inline SVG */
const threadSection = html.match(/<section class="scene scene-branch scene-backroom scene-red-thread-registry"[\s\S]*?<\/section>/);
assert.ok(threadSection, "scene section missing: red-thread-registry");
assert.ok(threadSection[0].includes("红线登记室") && threadSection[0].includes("每次有人读完守则，墙上就多一根线。这里不登记姓名，只登记谁与哪一句话互相作证。"), "thread registry epigraph verbatim");
assert.ok(!threadSection[0].includes("<svg") && !threadSection[0].includes("branch-btn"), "thread registry: no SVG, no card list");
assert.match(threadSection[0], /src="assets\/protocol-red-thread-registry\.webp" alt="" width="1536" height="1024"/);
for (const [id, short] of [["thread-hotspot-spool", "松线轴"], ["thread-hotspot-seal", "见证印"], ["thread-hotspot-gap", "线后门"]]) {
  assert.ok(threadSection[0].includes(`id="${id}" type="button"`) && threadSection[0].includes(`>${short}</span>`), `thread registry missing hotspot ${id}`);
}
assert.ok(threadSection[0].indexOf('id="thread-hotspot-spool"') < threadSection[0].indexOf('id="thread-hotspot-seal"') && threadSection[0].indexOf('id="thread-hotspot-seal"') < threadSection[0].indexOf('id="thread-hotspot-gap"'), "thread tab order runs left to right");
assert.match(threadSection[0], /id="thread-response" aria-live="polite"/);
assert.match(threadSection[0], /data-go="protocol"/, "thread registry keeps a back-to-protocol exit");
const nameSection = html.match(/<section class="scene scene-branch scene-backroom scene-blank-name-cloakroom"[\s\S]*?<\/section>/);
assert.ok(nameSection, "scene section missing: blank-name-cloakroom");
assert.ok(nameSection[0].includes("空名寄存处") && nameSection[0].includes("访客进入守则前先把名字寄存在这里。离开的人可以取回外套，却很少有人找到原来的名牌。"), "cloakroom epigraph verbatim");
assert.ok(!nameSection[0].includes("<svg") && !nameSection[0].includes("branch-btn"), "cloakroom: no SVG, no card list");
assert.match(nameSection[0], /src="assets\/protocol-blank-name-cloakroom\.webp" alt="" width="1536" height="1024"/);
for (const [id, short] of [["name-hotspot-coat", "无主外套"], ["name-hotspot-hook", "挂起名字"], ["name-hotspot-token", "无号取物牌"]]) {
  assert.ok(nameSection[0].includes(`id="${id}" type="button"`) && nameSection[0].includes(`>${short}</span>`), `cloakroom missing hotspot ${id}`);
}
assert.match(nameSection[0], /id="name-response" aria-live="polite"/);
assert.match(nameSection[0], /data-go="protocol"/);
const bellSection = html.match(/<section class="scene scene-branch scene-backroom scene-clapperless-bell-desk"[\s\S]*?<\/section>/);
assert.ok(bellSection, "scene section missing: clapperless-bell-desk");
assert.ok(bellSection[0].includes("无舌铃接待台") && bellSection[0].includes("这里的铃全都失去了钟舌。值班员仍会对每一次按压作出记录，仿佛声音只是访客的误解。"), "bell desk epigraph verbatim");
assert.ok(!bellSection[0].includes("<svg") && !bellSection[0].includes("branch-btn"), "bell desk: no SVG, no card list");
assert.match(bellSection[0], /src="assets\/protocol-clapperless-bell-desk\.webp" alt="" width="1536" height="1024"/);
for (const [id, short] of [["bell-hotspot-bell", "按无舌铃"], ["bell-hotspot-tube", "柜下传声管"], ["bell-hotspot-cord", "拉红绳"]]) {
  assert.ok(bellSection[0].includes(`id="${id}" type="button"`) && bellSection[0].includes(`>${short}</span>`), `bell desk missing hotspot ${id}`);
}
assert.match(bellSection[0], /id="bell-response" aria-live="polite"/);
assert.match(bellSection[0], /data-go="protocol"/);

/* 目录 01ψ/01ω/02α、痕迹单行、8 卡 */
assert.match(html, /<a href="#red-thread-registry" id="thread-link" hidden data-hover>01ψ \/ 红线登记<\/a>/);
assert.match(html, /<a href="#blank-name-cloakroom" id="name-link" hidden data-hover>01ω \/ 空名寄存<\/a>/);
assert.match(html, /<a href="#clapperless-bell-desk" id="bell-link" hidden data-hover>02α \/ 无舌铃台<\/a>/);
assert.ok(html.includes('id="backroom-memory"'), "remembrance gains the single backroom memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v41 状态契约：独立 key、pending 四字段严格匹配、lastScene/lastAction 互相匹配、与 v28–v40 零引用 */
assert.match(js, /const BACKROOM_KEY = "goddead_v41_protocol_backrooms";/);
const backroomParseBlock = js.match(/const getBackrooms = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(backroomParseBlock, "getBackrooms must exist");
assert.match(backroomParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt backroom storage must be safely repaired");
assert.match(backroomParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(backroomParseBlock[0], /BACKROOM_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(backroomParseBlock[0], /const acts = BACKROOM_ACTIONS\[raw\.pending\.scene\];/, "pending scene must be whitelisted");
assert.match(backroomParseBlock[0], /if \(act && raw\.pending\.target === act\.target && raw\.pending\.feedback === act\.feedback\) \{/, "pending target and feedback must strictly match the whitelist table");
assert.match(backroomParseBlock[0], /const lastScene = BACKROOM_SCENES\.includes\(raw\.lastScene\) \? raw\.lastScene : "";/, "lastScene whitelisted");
assert.match(backroomParseBlock[0], /const lastAction = lastScene && BACKROOM_ACTIONS\[lastScene\]\[raw\.lastAction\] \? raw\.lastAction : "";/, "lastAction must match lastScene");
assert.match(backroomParseBlock[0], /Math\.min\(BACKROOM_NUM_CAP, Math\.floor\(traversals\)\)/, "traversals floored and capped");
assert.match(backroomParseBlock[0], /raw\.marks\.filter\(\(m\) => BACKROOM_MARKS\.includes\(m\)\)/, "illegal backroom marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40)/.test(backroomParseBlock[0]), "backroom state must not touch v28-v40");

/* 三入口：首选锁、currentScene 守卫、点击即持久化、独立反馈元素 */
const backroomSpotBlock = js.match(/const spot = BACKROOM_PROTOCOL_SPOTS\[id\];[\s\S]*?addEventListener\("click", \(\) => \{[\s\S]*?\n    \}\);/);
assert.ok(backroomSpotBlock, "backroom protocol hotspot handler must exist");
assert.match(backroomSpotBlock[0], /if \(currentScene !== "protocol"\) return;\s*if \(AutoAdvance\.has\("protocol"\)\) return;\s*const st = getBackrooms\(\);/, "off-protocol backroom hotspots are rejected before any state access, feedback or timer");
assert.match(backroomSpotBlock[0], /st\.traversals = Math\.min\(BACKROOM_NUM_CAP, st\.traversals \+ 1\);/, "entry counts a traversal at click time");
assert.match(backroomSpotBlock[0], /\$\("#protocol-backroom-response"\)/, "entry feedback goes to the independent response line");
assert.match(backroomSpotBlock[0], /AutoAdvance\.schedule\("protocol", spot\.target, \{/, "entries share the protocol first-lock scope");
assert.match(js, /"protocol-hotspot-thread": \{ entry: "protocol-thread", scene: "thread", target: "red-thread-registry", feedback: "红线从八条守则背后抽紧。布告板让出一条只容卷宗通过的缝。", mark: "enteredThreadRegistry" \}/);
assert.match(js, /"protocol-hotspot-nameplate": \{ entry: "protocol-name", scene: "name", target: "blank-name-cloakroom", feedback: "空白名牌记住了你的按痕，却仍拒绝写出名字。", mark: "enteredBlankNameCloakroom" \}/);
assert.match(js, /"protocol-hotspot-bell": \{ entry: "protocol-bell", scene: "bell", target: "clapperless-bell-desk", feedback: "铃钮陷进墙里。没有铃声，接待台却已经叫到你。", mark: "enteredClapperlessBellDesk" \}/);

/* 九动作：反馈/target/mark 逐字与 currentScene 守卫、首选锁、pending 持久化、触发前清 pending、重返重播 */
assert.match(js, /spool: \{ btn: "#thread-hotspot-spool", target: "blank-name-cloakroom", feedback: "线轴吐出一截没有去处的红线。寄存处替它挂上一件空外套。", mark: "loosenedRedSpool" \}/);
assert.match(js, /seal: \{ btn: "#thread-hotspot-seal", target: "return-audit", feedback: "黑蜡没有留下图案，只留下你确实按过它的重量。", mark: "pressedWitnessSeal" \}/);
assert.match(js, /gap: \{ btn: "#thread-hotspot-gap", target: "corridor", feedback: "红线从柜后穿过去，拖着八张纸一起通向经文走廊。", mark: "followedThreadGap" \}/);
assert.match(js, /coat: \{ btn: "#name-hotspot-coat", target: "proxy-admission", feedback: "外套认出了你的肩膀。代审窗把这当成另一份在场证。", mark: "woreOwnerlessCoat" \}/);
assert.match(js, /hook: \{ btn: "#name-hotspot-hook", target: "red-thread-registry", feedback: "你的名字没有被写下，只被一根红线挂到了另一面墙。", mark: "hungBlankName" \}/);
assert.match(js, /token: \{ btn: "#name-hotspot-token", target: "clapperless-bell-desk", feedback: "圆牌翻到背面。无舌铃台把空白的一面当成了叫号。", mark: "turnedBlankClaimToken" \}/);
assert.match(js, /bell: \{ btn: "#bell-hotspot-bell", target: "midnight-callback", feedback: "铃帽下降了一次。午夜回拨台替它补上了迟到的声音。", mark: "pressedClapperlessBell" \}/);
assert.match(js, /tube: \{ btn: "#bell-hotspot-tube", target: "blank-name-cloakroom", feedback: "管内没有人回答，只有衣架互相碰了一下。", mark: "spokeIntoDeskTube" \}/);
assert.match(js, /cord: \{ btn: "#bell-hotspot-cord", target: "protocol", feedback: "红绳把接待台折回布告板背面。八条守则还在原处等你。", mark: "pulledRedSignalCord" \}/);
const runBackroomBlock = js.match(/const runBackroomAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runBackroomBlock[0], /if \(currentScene !== BACKROOM_SCENE_NAME\[sceneKey\]\) return;\s*if \(AutoAdvance\.has\("backroom-" \+ sceneKey\)\) return;\s*const st = getBackrooms\(\);/, "off-scene backroom hotspots are rejected before any state access, feedback or timer");
assert.match(runBackroomBlock[0], /st\.pending = \{ scene: sceneKey, action: actionId, target: act\.target, feedback: act\.feedback \};/, "accepted action persists the full pending mapping");
assert.match(runBackroomBlock[0], /s\.pending = null;\s*saveBackrooms\(s\);/, "pending cleared right before the timer fires");
const enterBackroomBlock = js.match(/const enterBackroom = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(enterBackroomBlock[0], /if \(st\.pending && st\.pending\.scene === sceneKey\) \{/, "returning to the pending scene replays and re-arms");
assert.match(enterBackroomBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /守则背室：穿行 \$\{st\.traversals\} 次；红线 \/ 空名 \/ 无舌铃已见 \$\{seen\}\/3。/, "backroom memory line verbatim");
assert.match(js, /paintBackroomMemory\(\);/);
assert.match(js, /syncBackroomLinks\(\);/);

/* ---------- v42 守则漂移：v41 两间背室解锁第四入口 + 四拍巡查判断 ---------- */
/* 三张变异 WebP 存在且被引用，三张监理源 PNG 保留，基准图继续直接复用不重编码 */
for (const asset of ["assets/protocol-drift-thread.webp", "assets/protocol-drift-nameplate.webp", "assets/protocol-drift-bell.webp"]) {
  await access(new URL(asset, root));
  assert.ok(js.includes(asset), `${asset} must be referenced by the drift round table`);
}
for (const src of ["source-protocol-drift-thread", "source-protocol-drift-nameplate", "source-protocol-drift-bell"]) {
  await access(new URL(`design-references/${src}.png`, root));
}
assert.match(js, /normal: "assets\/visitor-protocol-board\.webp",/, "the normal round reuses the original board WebP directly");

/* 第四入口：覆盖旧蜡印、默认 hidden、aria/短标签逐字 */
assert.match(html, /id="protocol-hotspot-drift" type="button" aria-label="按下访客守则上沿的旧蜡印，检查布告板是否发生漂移" hidden/, "drift entry hidden until unlocked");
assert.ok(html.includes(">巡查</span>"), "drift entry short label");
assert.match(css, /\.protocol-hotspot-drift \{/);
assert.match(css, /\.protocol-hotspot-drift\[hidden\] \{ display: none; \}/, "locked drift entry leaves the focus order");

/* 巡查台场景：说明逐字、单行状态、基准图 eager、四判断热点 + 低权重退出、反馈图内锚点，零 SVG、零卡片清单 */
const driftSection = html.match(/<section class="scene scene-branch scene-drift" id="scene-protocol-drift"[\s\S]*?<\/section>/);
assert.ok(driftSection, "scene section missing: protocol-drift");
assert.ok(driftSection[0].includes("守则漂移") && driftSection[0].includes("你不需要记住每一条守则。你只需要记住，自己上一次看见它们时，哪里还没有开始呼吸。"), "drift epigraph verbatim");
assert.ok(!driftSection[0].includes("<svg") && !driftSection[0].includes("branch-btn"), "drift: no SVG, no card list");
assert.match(driftSection[0], /连对 0 \/ 3 · 最佳 0 \/ 3 · 正确 0 · 误报 0/, "single-line drift status readout");
assert.match(driftSection[0], /id="drift-img" src="assets\/visitor-protocol-board\.webp" alt="" width="1536" height="1024" loading="eager"/, "drift image starts from the untouched baseline, eager");
for (const [id, label, short] of [
  ["drift-hotspot-thread", "报告守则板左侧红线发生漂移", "红线漂移"],
  ["drift-hotspot-nameplate", "报告守则板底部空白名牌发生漂移", "空名漂移"],
  ["drift-hotspot-bell", "报告守则板右下无舌铃钮发生漂移", "铃钮漂移"],
  ["drift-hotspot-forward", "确认本次守则板没有发生漂移并继续巡查", "未见漂移"],
]) {
  assert.ok(driftSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `drift missing hotspot ${id}`);
  assert.ok(driftSection[0].includes(`>${short}</span>`), `drift hotspot ${id} missing short label`);
}
assert.ok(driftSection[0].indexOf('id="drift-hotspot-thread"') < driftSection[0].indexOf('id="drift-hotspot-nameplate"') && driftSection[0].indexOf('id="drift-hotspot-nameplate"') < driftSection[0].indexOf('id="drift-hotspot-bell"') && driftSection[0].indexOf('id="drift-hotspot-bell"') < driftSection[0].indexOf('id="drift-hotspot-forward"') && driftSection[0].indexOf('id="drift-hotspot-forward"') < driftSection[0].indexOf('id="drift-exit"'), "drift tab order: thread, name, bell, forward, exit");
assert.match(driftSection[0], /id="drift-response" aria-live="polite"/);
assert.match(driftSection[0], /id="drift-exit" data-go="protocol"/, "low-weight exit back to protocol");
assert.match(css, /\.drift-hotspot-forward \{/);

/* 目录 02β、痕迹单行、8 卡 */
assert.match(html, /<a href="#protocol-drift" id="drift-link" hidden data-hover>02β \/ 守则漂移<\/a>/);
assert.ok(html.includes('id="drift-memory"'), "remembrance gains the single drift memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* 解锁与入口：只读 v41、首选锁、currentScene 守卫、逐字反馈 */
assert.match(js, /const driftUnlocked = \(\) => BACKROOM_SCENES\.filter\(\(s\) => getBackrooms\(\)\.visited\[s\]\)\.length >= 2;/, "unlock reads two of three v41 rooms, read-only");
assert.match(js, /if \(name === "protocol"\) \{ protocolConsumed = false; startAnomaly\(\); syncDriftEntry\(\); \}/, "unlock re-evaluates on every protocol entry");
const driftSpotBlock = js.match(/driftSpotBtn\.addEventListener\("click", \(\) => \{[\s\S]*?\n  \}\);/);
assert.ok(driftSpotBlock, "drift entry handler must exist");
assert.match(driftSpotBlock[0], /if \(currentScene !== "protocol"\) return;\s*if \(AutoAdvance\.has\("protocol"\)\) return;/, "off-protocol drift entry is rejected before any side effect");
assert.match(driftSpotBlock[0], /旧蜡印比上一次更软。布告板要求你证明，自己还记得它原来的样子。/, "drift entry feedback verbatim");
assert.match(driftSpotBlock[0], /AutoAdvance\.schedule\("protocol", "protocol-drift", \{/, "drift entry shares the protocol first-lock scope");

/* 固定序列与规则表 */
assert.match(js, /const DRIFT_SEQ = \["thread", "normal", "bell", "name", "thread", "bell", "normal", "name"\];/, "fixed staggered round sequence");
assert.match(js, /const round = DRIFT_SEQ\[\(cycle \* 3 \+ cursor\) % DRIFT_SEQ\.length\];/, "round recomputed from cycle and cursor, never trusted");
for (const fb of ["旧蜡印没有移动。你放行了一个仍然服从原样的夜晚。", "你指出第九个绳结。它松开时，墙后传来一张纸被撤回的声音。", "空名牌退回墙里。那枚没有号码的取物牌也跟着消失了。", "你在它响以前认出了铃口。黑色液体沿原路缩回黄铜里面。"]) {
  assert.ok(js.includes(fb), `correct feedback verbatim: ${fb.slice(0, 12)}`);
}
for (const fb of ["三次巡查没有留下误差。守则允许你从正面回去。", "三次巡查缠成同一根线。登记室要求保存这份连对记录。", "三次巡查仍没有写出名字。寄存处替你保留了空白。", "三次巡查都先于铃声。接待台把沉默记作合格。"]) {
  assert.ok(js.includes(fb), `completion feedback verbatim: ${fb.slice(0, 12)}`);
}
for (const fb of ["你报告了红线，但红线没有移动。误报把你送进登记室重新认线。", "你报告了空名牌，但它仍然闭合。寄存处要求你核对自己的名字。", "你报告了铃钮，但它还没有张口。接待台仍把误报当成一次叫号。", "你放行了第九个绳结。红线从布告板背面把你拖进登记室。", "你放行了半开的空名牌。取物牌把你领进寄存处。", "你放行了渗液的铃口。没有声音的叫号仍然轮到了你。"]) {
  assert.ok(js.includes(fb), `misreport feedback verbatim: ${fb.slice(0, 12)}`);
}
assert.ok(js.includes("但漂移的是红线") && js.includes("但漂移的是空名牌") && js.includes("但漂移的是铃钮"), "wrong-spot feedback names the real anomaly left behind");

/* v42 状态契约：独立 key、数字/cursor/streak 归一、lastRound/lastAnswer 组合、pending 逐字段、与 v28–v41 零引用 */
assert.match(js, /const DRIFT_KEY = "goddead_v42_protocol_drift";/);
const driftParseBlock = js.match(/const getDrift = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(driftParseBlock, "getDrift must exist");
assert.match(driftParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt drift storage must be safely repaired");
assert.match(driftParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(driftParseBlock[0], /if \(cursor > 7\) cursor = 0;/, "illegal cursor normalized");
assert.match(driftParseBlock[0], /if \(streak > 3\) streak = 3;/, "streak capped at 3");
assert.match(driftParseBlock[0], /if \(bestStreak < streak\) bestStreak = streak;/, "bestStreak never below streak");
assert.match(driftParseBlock[0], /if \(!lastRound \|\| !lastAnswer\) \{/, "illegal last combination cleared together");
assert.match(driftParseBlock[0], /if \(p\.round === round && DRIFT_ANSWERS\.includes\(p\.answer\) && p\.answer !== "exit"\) \{/, "pending round must match the derived round");
assert.match(driftParseBlock[0], /const expected = driftResolve\(round, p\.answer, cycle, cursor, streak\);/, "pending validated against the fixed rule table");
assert.match(driftParseBlock[0], /p\.correct === expected\.correct && p\.target === expected\.target && p\.feedback === expected\.feedback/, "pending correct/target/feedback must strictly match");
assert.match(driftParseBlock[0], /p\.nextCycle === expected\.nextCycle && p\.nextCursor === expected\.nextCursor/, "pending nextCycle/nextCursor must strictly match");
assert.match(driftParseBlock[0], /raw\.marks\.filter\(\(m\) => DRIFT_MARKS\.includes\(m\)\)/, "illegal drift marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41)/.test(driftParseBlock[0]), "drift state must not touch v28-v41");

/* 判断 handler：currentScene 守卫、同拍首选锁、计分、pending 持久化、节拍锁 */
const answerDriftBlock = js.match(/const answerDrift = \(answer\) => \{[\s\S]*?\n  \};/);
assert.match(answerDriftBlock[0], /if \(currentScene !== "protocol-drift"\) return;\s*if \(AutoAdvance\.has\("protocol-drift"\) \|\| AutoAdvance\.has\("protocol-drift-step"\)\) return;\s*const st = getDrift\(\);/, "off-scene drift answers are rejected before any state access, feedback or timer");
assert.match(answerDriftBlock[0], /st\.inspections = Math\.min\(DRIFT_NUM_CAP, st\.inspections \+ 1\);/, "each accepted answer counts one inspection");
assert.match(answerDriftBlock[0], /st\.streak = Math\.min\(3, st\.streak \+ 1\);/, "streak increments capped at 3");
assert.match(answerDriftBlock[0], /st\.pending = \{ \.\.\.resolution \};/, "accepted answer persists the full pending mapping");
const fireDriftBlock = js.match(/const fireDriftPending = \(\) => \{[\s\S]*?\n  \};/);
assert.match(fireDriftBlock[0], /if \(st\.pending\.correct && st\.pending\.target !== "protocol-drift"\) st\.streak = 0;/, "completed cycles reset the streak on landing");
assert.match(fireDriftBlock[0], /st\.cycle = st\.pending\.nextCycle;/, "next cycle applied only when the timer fires");
assert.match(fireDriftBlock[0], /st\.pending = null;\s*saveDrift\(st\);/, "pending cleared right before the transition");
const enterDriftBlock = js.match(/const enterDrift = \(\) => \{[\s\S]*?\n  \};/);
assert.match(enterDriftBlock[0], /if \(st\.pending\) \{/, "returning to the drift scene replays a legal pending");
assert.match(enterDriftBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /守则漂移：巡查 \$\{st\.inspections\} 次；正确 \$\{st\.correct\} 次；最佳连对 \$\{st\.bestStreak\}\/3；误报 \$\{st\.misreports\} 次。/, "drift memory line verbatim");
assert.match(js, /paintDriftMemory\(\);/);
assert.match(js, /syncDriftLink\(\);/);

/* ---------- v43 门内回敲网：敲门窗口三回敲 + 三个画面热点场景 ---------- */
/* 三张正式 WebP 存在且被引用，三张监理源 PNG 保留 */
for (const asset of ["assets/counter-knock-gallery.webp", "assets/unanswered-vestibule.webp", "assets/undersill-dispatch.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-counter-knock-gallery", "source-unanswered-vestibule", "source-undersill-dispatch"]) {
  await access(new URL(`design-references/${src}.png`, root));
}

/* 门内三回敲：出厂 hidden、aria/短标签逐字、Tab 顺序 左→缝→右 */
for (const [id, label, short] of [
  ["hotspot-counter-knock-left", "回应门左扇内部先一步响起的回敲", "左响"],
  ["hotspot-counter-knock-seam", "贴近门缝，追踪没有被应答的第二声回敲", "缝响"],
  ["hotspot-counter-knock-right", "回应门右扇下沉到门槛下面的回敲", "右响"],
]) {
  assert.match(html, new RegExp(`id="${id}" type="button" aria-label="${label}" hidden`), `counter-knock ${id} must ship hidden`);
  assert.ok(html.includes(`>${short}</span>`), `counter-knock ${id} missing short label`);
}
assert.ok(html.indexOf('id="hotspot-counter-knock-left"') < html.indexOf('id="hotspot-counter-knock-seam"') && html.indexOf('id="hotspot-counter-knock-seam"') < html.indexOf('id="hotspot-counter-knock-right"'), "counter-knock tab order: left, seam, right");
assert.match(css, /\.hotspot-counter-left\[hidden\],\s*\.hotspot-counter-seam\[hidden\],\s*\.hotspot-counter-right\[hidden\] \{ display: none; \}/, "hidden counter-knocks leave the focus order");
assert.match(css, /@keyframes counter-knock-reveal/, "restrained dark-red pulse reveal");
assert.match(css, /\.hotspot-counter-seam \{ top: 64%; left: 48%; width: 4%; height: 18%; \}/, "seam counter-knock covers the lower seam, never the door center");
assert.match(css, /\.counter-urgent:not\(\[hidden\]\) \{/, "second knock makes the window more urgent");

/* 敲门窗口生命周期：1/2 显露、3/0 隐藏、衰减隐藏、回首 页恢复 */
const counterWindowBlock = js.match(/const syncCounterKnockWindow = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(counterWindowBlock, "syncCounterKnockWindow must exist");
assert.match(counterWindowBlock[0], /const show = currentScene === "threshold" && \(knocks === 1 \|\| knocks === 2\) && !thresholdConsumed && !AutoAdvance\.has\("threshold"\);/, "window shows only on live threshold at knocks 1 or 2 without a pending transition");
assert.match(counterWindowBlock[0], /btn\.classList\.toggle\("counter-urgent", show && knocks === 2\);/, "second knock switches to the urgent presentation");
assert.match(js, /syncCounterKnockWindow\(\);\s*return;\s*\}/, "fourth knock hides the window");
assert.match(js, /knocks = 0;\s*syncAwake\(\);\s*syncCounterKnockWindow\(\);/, "knock decay hides the window");
assert.match(js, /syncCounterKnockWindow\(\);\s*\/\* v43|\/\* v43：每次敲门后同步回敲窗口（1\/2 显露、3\/0 隐藏） \*\/\s*syncCounterKnockWindow\(\);/, "every accepted knock re-syncs the window");
assert.match(js, /\/\* v43：回到首页时按当前会话敲门数恢复或隐藏回敲窗口 \*\/\s*syncCounterKnockWindow\(\);/, "returning to the threshold restores the window");

/* 三回敲处理器：live scene + 可见 + 敲门数 + 首选锁全前置 */
const knockSpotBlock = js.match(/const spot = KNOCK_THRESHOLD_SPOTS\[id\];[\s\S]*?addEventListener\("click", \(\) => \{[\s\S]*?\n    \}\);/);
assert.ok(knockSpotBlock, "counter-knock threshold handler must exist");
assert.match(knockSpotBlock[0], /if \(currentScene !== "threshold"\) return;\s*if \(btn\.hasAttribute\("hidden"\)\) return;\s*if \(knocks !== 1 && knocks !== 2\) return;\s*if \(AutoAdvance\.has\("threshold"\)\) return;\s*const st = getKnockNet\(\);/, "counter-knock rejected before any state access, feedback or timer");
assert.match(knockSpotBlock[0], /AutoAdvance\.schedule\("threshold", spot\.target, \{ delay: branchDelay\(\) \}\);/, "counter-knocks share the threshold first-lock scope");
for (const [id, entry, target, fb] of [
  ["hotspot-counter-knock-left", "threshold-left", "counter-knock-gallery", "左扇门板从里面先敲了一次。那声回敲把门后的一整条廊道震亮。"],
  ["hotspot-counter-knock-seam", "threshold-seam", "unanswered-vestibule", "第二声没有来自门后。它被门缝收走，登记成一次从未发生的来访。"],
  ["hotspot-counter-knock-right", "threshold-right", "undersill-dispatch", "右扇没有振动。回敲沿把手向下滑，落进门槛下面的投递轨。"],
]) {
  assert.match(js, new RegExp(`"${id}": \\{ entry: "${entry}", scene: "\\w+", target: "${target}", feedback: "${fb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" \\}`), `counter-knock ${id} verbatim`);
}

/* 三个新场景：说明逐字、三个画面内热点（figure 内、非卡片清单）、回门外出口，零 inline SVG */
const gallerySection = html.match(/<section class="scene scene-branch scene-knocknet scene-counter-knock-gallery"[\s\S]*?<\/section>/);
assert.ok(gallerySection, "scene section missing: counter-knock-gallery");
assert.ok(gallerySection[0].includes("回敲廊") && gallerySection[0].includes("这里保存每一声从门内发出的敲门。门外的人通常误以为那是回声。"), "gallery epigraph verbatim");
assert.ok(!gallerySection[0].includes("<svg") && !gallerySection[0].includes("branch-btn"), "gallery: no SVG, no card list");
assert.match(gallerySection[0], /src="assets\/counter-knock-gallery\.webp" alt="" width="1536" height="1024"/);
for (const [id, label] of [["counter-knock-action-inward", "敲响中央向内的门环"], ["counter-knock-action-still", "按住被黑蜡封死的门环"], ["counter-knock-action-shadow", "追上先于金属落下的影子"]]) {
  assert.ok(gallerySection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `gallery missing hotspot ${id}`);
}
assert.match(gallerySection[0], /id="gallery-response" aria-live="polite"/);
assert.match(gallerySection[0], /data-go="threshold"/);
const vestibuleSection = html.match(/<section class="scene scene-branch scene-knocknet scene-unanswered-vestibule"[\s\S]*?<\/section>/);
assert.ok(vestibuleSection, "scene section missing: unanswered-vestibule");
assert.ok(vestibuleSection[0].includes("未应门前厅") && vestibuleSection[0].includes("没有被回应的敲门不会消失。它们只是改在这里排队。"), "vestibule epigraph verbatim");
assert.ok(!vestibuleSection[0].includes("<svg") && !vestibuleSection[0].includes("branch-btn"), "vestibule: no SVG, no card list");
assert.match(vestibuleSection[0], /src="assets\/unanswered-vestibule\.webp" alt="" width="1536" height="1024"/);
for (const [id, label] of [["unanswered-action-first", "登记左鼓上的第一道凹痕"], ["unanswered-action-second", "听完仍在震动的第二声"], ["unanswered-action-third", "抹掉右鼓残留的第三声"]]) {
  assert.ok(vestibuleSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `vestibule missing hotspot ${id}`);
}
assert.match(vestibuleSection[0], /id="unanswered-vestibule-response" aria-live="polite"/);
assert.match(vestibuleSection[0], /data-go="threshold"/);
const dispatchSection = html.match(/<section class="scene scene-branch scene-knocknet scene-undersill-dispatch"[\s\S]*?<\/section>/);
assert.ok(dispatchSection, "scene section missing: undersill-dispatch");
assert.ok(dispatchSection[0].includes("门槛下投递处") && dispatchSection[0].includes("门缝太窄，不能让人通过。这里因此只接收被门拒绝的部分。"), "dispatch epigraph verbatim");
assert.ok(!dispatchSection[0].includes("<svg") && !dispatchSection[0].includes("branch-btn"), "dispatch: no SVG, no card list");
assert.match(dispatchSection[0], /src="assets\/undersill-dispatch\.webp" alt="" width="1536" height="1024"/);
for (const [id, label] of [["undersill-action-seal", "收下左轨的黑蜡封件"], ["undersill-action-blank", "把空白纸条推回门外"], ["undersill-action-hinge", "沿右轨爬进铰链竖井"]]) {
  assert.ok(dispatchSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `dispatch missing hotspot ${id}`);
}
assert.match(dispatchSection[0], /id="dispatch-response" aria-live="polite"/);
assert.match(dispatchSection[0], /data-go="threshold"/);
assert.match(css, /\.knocknet-hotspot \{/);

/* 目录 02γ/02δ/02ε、痕迹单行、8 卡 */
assert.match(html, /<a href="#counter-knock-gallery" id="knock-gallery-link" hidden data-hover>02γ \/ 回敲廊<\/a>/);
assert.match(html, /<a href="#unanswered-vestibule" id="unanswered-link" hidden data-hover>02δ \/ 未应门<\/a>/);
assert.match(html, /<a href="#undersill-dispatch" id="undersill-link" hidden data-hover>02ε \/ 门槛下<\/a>/);
assert.ok(html.includes('id="knocknet-memory"'), "remembrance gains the single counter-knock memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v43 状态契约：独立 key、pending 四字段严格匹配、lastScene/lastAction 互相匹配、与 v28–v42 零引用 */
assert.match(js, /const KNOCK_KEY = "goddead_v43_counter_knock";/);
const knockParseBlock = js.match(/const getKnockNet = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(knockParseBlock, "getKnockNet must exist");
assert.match(knockParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt counter-knock storage must be safely repaired");
assert.match(knockParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(knockParseBlock[0], /KNOCK_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(knockParseBlock[0], /const acts = KNOCK_ACTIONS\[raw\.pending\.scene\];/, "pending scene must be whitelisted");
assert.match(knockParseBlock[0], /if \(act && raw\.pending\.target === act\.target && raw\.pending\.feedback === act\.feedback\) \{/, "pending target and feedback must strictly match the action table");
assert.match(knockParseBlock[0], /const lastScene = KNOCK_SCENES\.includes\(raw\.lastScene\) \? raw\.lastScene : "";/, "lastScene whitelisted");
assert.match(knockParseBlock[0], /const lastAction = lastScene && KNOCK_ACTIONS\[lastScene\]\[raw\.lastAction\] \? raw\.lastAction : "";/, "lastAction must match lastScene");
assert.match(knockParseBlock[0], /Math\.min\(KNOCK_NUM_CAP, Math\.floor\(traversals\)\)/, "traversals floored and capped");
assert.match(knockParseBlock[0], /raw\.marks\.filter\(\(m\) => KNOCK_MARKS\.includes\(m\)\)/, "illegal counter-knock marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42)/.test(knockParseBlock[0]), "counter-knock state must not touch v28-v42");

/* 九动作：反馈/target/mark 逐字与 live scene 守卫、首选锁、pending 持久化、触发前清 pending、重返重播 */
assert.match(js, /inward: \{ btn: "#counter-knock-action-inward", target: "peephole-chamber", feedback: "门环向墙里落下。倒置窥孔从另一面替你睁开。", mark: "struckInwardKnocker" \}/);
assert.match(js, /still: \{ btn: "#counter-knock-action-still", target: "unanswered-vestibule", feedback: "门环没有动。未应门前厅却替它登记了第二声。", mark: "heldStillKnocker" \}/);
assert.match(js, /shadow: \{ btn: "#counter-knock-action-shadow", target: "undersill-dispatch", feedback: "影子钻进门槛。投递轨把你的脚步当成一封未封口的信。", mark: "followedEarlyShadow" \}/);
assert.match(js, /first: \{ btn: "#unanswered-action-first", target: "protocol", feedback: "第一声获得编号。访客守则承认你已经来过一次。", mark: "registeredFirstKnock" \}/);
assert.match(js, /second: \{ btn: "#unanswered-action-second", target: "counter-knock-gallery", feedback: "第二声找到了原来的门环。回敲廊重新向你打开。", mark: "heardSecondKnock" \}/);
assert.match(js, /third: \{ btn: "#unanswered-action-third", target: "return-passage", feedback: "第三声被撤销。回返夹道替你保存了一条没有开门的路线。", mark: "erasedThirdKnock" \}/);
assert.match(js, /seal: \{ btn: "#undersill-action-seal", target: "proxy-admission", feedback: "封件没有名字，代审窗仍把它当成一位夜访者。", mark: "acceptedBlackSeal" \}/);
assert.match(js, /blank: \{ btn: "#undersill-action-blank", target: "glyph-niche", feedback: "纸条从门缝出去时，多带走了一个编号。失号龛替它留出空位。", mark: "returnedBlankSlip" \}/);
assert.match(js, /hinge: \{ btn: "#undersill-action-hinge", target: "hinge-sorting-room", feedback: "投递轨向上翻成门轴。铰链分拣室开始决定你应该向哪边打开。", mark: "climbedHingeRail" \}/);
const runKnockBlock = js.match(/const runKnockAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runKnockBlock[0], /if \(currentScene !== KNOCK_SCENE_NAME\[sceneKey\]\) return;\s*if \(AutoAdvance\.has\("knocknet-" \+ sceneKey\)\) return;\s*const st = getKnockNet\(\);/, "off-scene counter-knock actions are rejected before any state access, feedback or timer");
assert.match(runKnockBlock[0], /st\.pending = \{ scene: sceneKey, action: actionId, target: act\.target, feedback: act\.feedback \};/, "accepted action persists the full pending mapping");
assert.match(runKnockBlock[0], /s\.pending = null;\s*saveKnockNet\(s\);/, "pending cleared right before the timer fires");
const enterKnockBlock = js.match(/const enterKnockNet = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(enterKnockBlock[0], /if \(st\.pending && st\.pending\.scene === sceneKey\) \{/, "returning to the pending scene replays and re-arms");
assert.match(enterKnockBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /KNOCK_V31_TARGET\[knockGuard\.lastAction\] === target/, "v31 guard gains the narrow v43 lastAction exception only");
assert.match(js, /门内回敲：改道 \$\{st\.traversals\} 次；回敲 \/ 未应 \/ 门槛下已见 \$\{seen\}\/3。/, "counter-knock memory line verbatim");
assert.match(js, /paintKnockNetMemory\(\);/);
assert.match(js, /syncKnockLinks\(\);/);

/* ---------- v44 页后空层：残页 f1/f5/f8 首读改线 + 三个画面热点场景 ---------- */
/* 三张正式 WebP 存在且被引用，三张监理源 PNG 保留，原走廊图不替换 */
for (const asset of ["assets/lagging-shadow-cloister.webp", "assets/ash-door-foundry.webp", "assets/retention-vault.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-lagging-shadow-cloister", "source-ash-door-foundry", "source-retention-vault"]) {
  await access(new URL(`design-references/${src}.png`, root));
}
assert.match(html, /<img class="corridor-img" src="assets\/scripture-corridor\.webp"/, "corridor image untouched");

/* 走廊入口改线：f1/f5/f8 原文与计数不变、v29 路由不变、v44 三入口、detour 首选锁 */
assert.ok(html.includes("神死的那天，没有打雷。只是所有人的影子，都晚了一拍才跟上。"), "f1 text untouched");
assert.ok(html.includes("第七天，有人看见神坛上的灰，自己摆成了门的形状。"), "f5 text untouched");
assert.ok(html.includes("遗物室里没有遗物。只有「被留下」这个动作本身。"), "f8 text untouched");
assert.match(js, /const FRAG_BRANCH = \{ f2: "echo", f3: "vein", f4: "confession" \};/, "v29 frag routing untouched");
assert.match(js, /f1: \{ entry: "fragment-f1", scene: "shadow", target: "lagging-shadow-cloister", intro: "影子没有跟上你。它先一步走进了回廊深处。" \}/);
assert.match(js, /f5: \{ entry: "fragment-f5", scene: "foundry", target: "ash-door-foundry", intro: "灰自己排成了门。铸室在纸背后等你。" \}/);
assert.match(js, /f8: \{ entry: "fragment-f8", scene: "retention", target: "retention-vault", intro: "「被留下」需要一间库房。空展台已经亮起。" \}/);
assert.match(js, /if \(corridorDetourArmed\) return;\s*const alreadyRead = frag\.classList\.contains\("read"\);/, "detour first-lock runs before any counting in the same beat");
assert.match(js, /corridorDetourArmed = true;\s*AutoAdvance\.clear\("corridor"\);\s*const st = getPaperback\(\);/, "v44 entry arms the detour lock and clears the main-line schedule");
assert.match(js, /st\.traversals = Math\.min\(PAPERBACK_NUM_CAP, st\.traversals \+ 1\);/, "v44 entry counts one traversal at click time");
assert.match(js, /AutoAdvance\.schedule\("corridor", pb\.target, \{/, "v44 entries share the corridor scope");
assert.match(js, /corridorDetourArmed = false; syncWatchDoor\(\);/, "detour lock resets on corridor entry");

/* 三个新场景：说明逐字、三个画面内热点（figure 内、非卡片清单）、回走廊出口，零 inline SVG */
const cloisterSection = html.match(/<section class="scene scene-branch scene-paperback scene-lagging-shadow-cloister"[\s\S]*?<\/section>/);
assert.ok(cloisterSection, "scene section missing: lagging-shadow-cloister");
assert.ok(cloisterSection[0].includes("滞影回廊") && cloisterSection[0].includes("人的影子比人晚一拍。人已经走完这条回廊，它们还在墙上学习如何跟随。"), "cloister epigraph verbatim");
assert.ok(!cloisterSection[0].includes("<svg") && !cloisterSection[0].includes("branch-btn"), "cloister: no SVG, no card list");
assert.match(cloisterSection[0], /src="assets\/lagging-shadow-cloister\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["paperback-shadow-action-pin", "拔出钉住影子的黄铜钉", "拔钉"], ["paperback-shadow-action-outline", "踏进没有主人的门形轮廓", "入轮廓"], ["paperback-shadow-action-catch", "停下，等迟到的影子追上", "等影"]]) {
  assert.ok(cloisterSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `cloister missing hotspot ${id}`);
  assert.ok(cloisterSection[0].includes(`>${short}</span>`), `cloister hotspot ${id} missing short label`);
}
assert.match(cloisterSection[0], /id="paperback-shadow-response" aria-live="polite"/);
assert.match(cloisterSection[0], /data-go="corridor"/);
const foundrySection = html.match(/<section class="scene scene-branch scene-paperback scene-ash-door-foundry"[\s\S]*?<\/section>/);
assert.ok(foundrySection, "scene section missing: ash-door-foundry");
assert.ok(foundrySection[0].includes("灰门铸室") && foundrySection[0].includes("灰不是门的材料。这里反复铸造的，是门曾经存在过的形状。"), "foundry epigraph verbatim");
assert.ok(!foundrySection[0].includes("<svg") && !foundrySection[0].includes("branch-btn"), "foundry: no SVG, no card list");
assert.match(foundrySection[0], /src="assets\/ash-door-foundry\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["paperback-foundry-action-bellows", "压下没有火的冷风箱", "冷风箱"], ["paperback-foundry-action-key", "拿起网台上的灰烬钥匙", "灰钥匙"], ["paperback-foundry-action-door", "穿过尚未铸完的灰门", "灰门"]]) {
  assert.ok(foundrySection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `foundry missing hotspot ${id}`);
  assert.ok(foundrySection[0].includes(`>${short}</span>`), `foundry hotspot ${id} missing short label`);
}
assert.match(foundrySection[0], /id="paperback-foundry-response" aria-live="polite"/);
assert.match(foundrySection[0], /data-go="corridor"/);
const retentionSection = html.match(/<section class="scene scene-branch scene-paperback scene-retention-vault"[\s\S]*?<\/section>/);
assert.ok(retentionSection, "scene section missing: retention-vault");
assert.ok(retentionSection[0].includes("留置空库") && retentionSection[0].includes("这里没有遗物。空展台、悬空标签和灰尘印记，只负责保存“被留下”这个动作。"), "retention epigraph verbatim");
assert.ok(!retentionSection[0].includes("<svg") && !retentionSection[0].includes("branch-btn"), "retention: no SVG, no card list");
assert.match(retentionSection[0], /src="assets\/retention-vault\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["paperback-retention-action-tag", "把悬空的空标签挂到自己身上", "挂空签"], ["paperback-retention-action-imprint", "触摸展台上缺失遗物的灰尘印", "摸灰印"], ["paperback-retention-action-page", "把走廊残页留在空展台上", "留残页"]]) {
  assert.ok(retentionSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `retention missing hotspot ${id}`);
  assert.ok(retentionSection[0].includes(`>${short}</span>`), `retention hotspot ${id} missing short label`);
}
assert.match(retentionSection[0], /id="paperback-retention-response" aria-live="polite"/);
assert.match(retentionSection[0], /data-go="corridor"/);
assert.match(css, /\.paperback-hotspot \{/);

/* 目录 02ζ/02η/02θ、痕迹单行、8 卡 */
assert.match(html, /<a href="#lagging-shadow-cloister" id="paperback-shadow-link" hidden data-hover>02ζ \/ 滞影<\/a>/);
assert.match(html, /<a href="#ash-door-foundry" id="paperback-foundry-link" hidden data-hover>02η \/ 灰门<\/a>/);
assert.match(html, /<a href="#retention-vault" id="paperback-retention-link" hidden data-hover>02θ \/ 留置<\/a>/);
assert.ok(html.includes('id="paperback-memory"'), "remembrance gains the single paperback memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v44 状态契约：独立 key、pending 四字段严格匹配、lastScene/lastAction 互相匹配、与 v28–v43 零引用 */
assert.match(js, /const PAPERBACK_KEY = "goddead_v44_paperback_spaces";/);
const paperbackParseBlock = js.match(/const getPaperback = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(paperbackParseBlock, "getPaperback must exist");
assert.match(paperbackParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt paperback storage must be safely repaired");
assert.match(paperbackParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(paperbackParseBlock[0], /PAPERBACK_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(paperbackParseBlock[0], /const acts = PAPERBACK_ACTIONS\[raw\.pending\.scene\];/, "pending scene must be whitelisted");
assert.match(paperbackParseBlock[0], /if \(act && raw\.pending\.target === act\.target && raw\.pending\.feedback === act\.feedback\) \{/, "pending target and feedback must strictly match the action table");
assert.match(paperbackParseBlock[0], /const lastScene = PAPERBACK_SCENES\.includes\(raw\.lastScene\) \? raw\.lastScene : "";/, "lastScene whitelisted");
assert.match(paperbackParseBlock[0], /const lastAction = lastScene && PAPERBACK_ACTIONS\[lastScene\]\[raw\.lastAction\] \? raw\.lastAction : "";/, "lastAction must match lastScene");
assert.match(paperbackParseBlock[0], /Math\.min\(PAPERBACK_NUM_CAP, Math\.floor\(traversals\)\)/, "traversals floored and capped");
assert.match(paperbackParseBlock[0], /raw\.marks\.filter\(\(m\) => PAPERBACK_MARKS\.includes\(m\)\)/, "illegal paperback marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43)/.test(paperbackParseBlock[0]), "paperback state must not touch v28-v43");

/* 九动作：反馈/target/mark 逐字与 live scene 守卫、首选锁、pending 持久化、触发前清 pending、重返重播 */
assert.match(js, /pin: \{ btn: "#paperback-shadow-action-pin", target: "borrowed-shadow-gallery", feedback: "钉子一松，墙上的影子立刻借走了你的站姿。", mark: "pulledShadowNail" \}/);
assert.match(js, /outline: \{ btn: "#paperback-shadow-action-outline", target: "ash-door-foundry", feedback: "轮廓比门更早关上。灰门铸室在纸背后亮起。", mark: "enteredOwnerlessOutline" \}/);
assert.match(js, /catch: \{ btn: "#paperback-shadow-action-catch", target: "return-passage", feedback: "影子从身后赶到，却从你的前面走进回返夹道。", mark: "waitedForLateShadow" \}/);
assert.match(js, /bellows: \{ btn: "#paperback-foundry-action-bellows", target: "protocol", feedback: "风箱吐出一口冷灰。灰尘在墙上排成第一条访客守则。", mark: "workedColdBellows" \}/);
assert.match(js, /key: \{ btn: "#paperback-foundry-action-key", target: "retention-vault", feedback: "钥匙没有齿，却准确打开了留置空库里最空的一格。", mark: "tookCinderKey" \}/);
assert.match(js, /door: \{ btn: "#paperback-foundry-action-door", target: "unlit-lamp-gallery", feedback: "你从缺少一侧门框的地方穿过去。无灯灯廊替它补上了黑暗。", mark: "crossedUnfinishedDoor" \}/);
assert.match(js, /tag: \{ btn: "#paperback-retention-action-tag", target: "counter-knock-gallery", feedback: "标签贴住你以后，门内先替你敲了一声。", mark: "woreBlankRetentionTag" \}/);
assert.match(js, /imprint: \{ btn: "#paperback-retention-action-imprint", target: "lagging-shadow-cloister", feedback: "灰尘记住了手指，却把影子送回另一条回廊。", mark: "touchedMissingRelicImprint" \}/);
assert.match(js, /page: \{ btn: "#paperback-retention-action-page", target: "corridor", feedback: "纸留在原地，纸上的字却先一步回到了走廊。", mark: "leftFragmentOnPlinth" \}/);
const runPaperbackBlock = js.match(/const runPaperbackAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runPaperbackBlock[0], /if \(currentScene !== PAPERBACK_SCENE_NAME\[sceneKey\]\) return;\s*if \(AutoAdvance\.has\("paperback-" \+ sceneKey\)\) return;\s*const st = getPaperback\(\);/, "off-scene paperback actions are rejected before any state access, feedback or timer");
assert.match(runPaperbackBlock[0], /st\.pending = \{ scene: sceneKey, action: actionId, target: act\.target, feedback: act\.feedback \};/, "accepted action persists the full pending mapping");
assert.match(runPaperbackBlock[0], /s\.pending = null;\s*savePaperback\(s\);/, "pending cleared right before the timer fires");
const enterPaperbackBlock = js.match(/const enterPaperback = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(enterPaperbackBlock[0], /if \(st\.pending && st\.pending\.scene === sceneKey\) \{/, "returning to the pending scene replays and re-arms");
assert.match(enterPaperbackBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /\/\* v44 唯一窄例外：lastScene=shadow && lastAction=catch 放行回返夹道 \*\/\s*\|\| \(target === "return-passage" && paperbackGuard\.lastScene === "shadow" && paperbackGuard\.lastAction === "catch"\)/, "v31 guard gains only the catch-to-return-passage exception");
assert.match(js, /页后空层：改道 \$\{st\.traversals\} 次；滞影 \/ 灰门 \/ 留置已见 \$\{seen\}\/3。/, "paperback memory line verbatim");
assert.match(js, /paintPaperbackMemory\(\);/);
assert.match(js, /syncPaperbackLinks\(\);/);

/* ---------- v45 未到交班：值夜室三入口 + 三个画面热点场景 ---------- */
/* 三张正式 WebP 存在且被引用，三张监理源 PNG 保留，旧值夜室素材不替换 */
for (const asset of ["assets/minute-before-archive.webp", "assets/cold-wick-service-bay.webp", "assets/absent-relief-locker.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-minute-before-archive", "source-cold-wick-service-bay", "source-absent-relief-locker"]) {
  await access(new URL(`design-references/${src}.png`, root));
}
assert.match(html, /<img class="wc-face-img" src="assets\/watch-clock-face\.webp"/, "watch clock face untouched");
assert.match(html, /<img class="wc-second-img" id="clock-second" src="assets\/watch-second-hand\.png"/, "watch second hand untouched");
assert.match(html, /<img class="watch-desk-img" src="assets\/watch-room-desk\.webp"/, "watch desk image untouched");

/* 值夜室三入口：覆盖真实钟轴/台灯/椅面，aria/短标签逐字，原 aria 叙事保留 */
assert.match(html, /<div class="watch-desk" role="img" aria-label="一张空值班桌，一盏熄着的台灯，和一把没有人的椅子">/, "watch desk keeps its original aria narration");
for (const [id, label, short] of [
  ["relief-entry-clock", "拧动永远停在三点十七分的钟轴", "拧钟轴"],
  ["relief-entry-lamp", "按下空值班桌上熄灭的台灯", "按灭灯"],
  ["relief-entry-chair", "坐进没有值夜员的空椅", "入空椅"],
]) {
  assert.match(html, new RegExp(`id="${id}" type="button" aria-label="${label}"`), `watch missing relief entry ${id}`);
  assert.ok(html.includes(`>${short}</span>`), `relief entry ${id} missing short label`);
}
assert.match(css, /\.relief-entry-hotspot \{/);
assert.match(css, /\.relief-entry-clock \{/);
assert.match(css, /\.relief-entry-lamp \{/);
assert.match(css, /\.relief-entry-chair \{/);

/* 交班簿五条原文、05:02 主动语义、签退、line4 唯一解锁、原 watch→switchboard 不变 */
for (const orig of ["23:55 接班。余响指数平稳。无事记录。", "01:40 走廊有脚步。出门查看，无人。记录在案。", "03:17 钟停。已报修。", "05:02 电话铃响一次。未接听。按规定记录为误响。", "06:00 交班。本班新增访客：无。"]) {
  assert.ok(html.includes(orig), `log entry verbatim: ${orig.slice(0, 10)}`);
}
assert.match(js, /if \(!st\.phoneCovered \|\| attempts < 1\) return;/, "line4 keeps its only unlock condition");
assert.match(js, /AutoAdvance\.schedule\("watch", "switchboard", \{/, "watch to switchboard path untouched");
assert.match(js, /if \(watchConsumed \|\| watchReliefArmed \|\| !watchUnlocked\(\) \|\| !line4Unlocked\(\)\) return;/, "accepted relief entry locks the watch destination for the beat");
assert.match(js, /watchReliefArmed = false; enterWatch\(\);/, "relief armed resets on watch entry");

/* 第一归宿锁：入口处理器守卫顺序 */
const reliefSpotBlock = js.match(/const spot = RELIEF_WATCH_SPOTS\[id\];[\s\S]*?addEventListener\("click", \(\) => \{[\s\S]*?\n    \}\);/);
assert.ok(reliefSpotBlock, "relief watch entry handler must exist");
assert.match(reliefSpotBlock[0], /if \(currentScene !== "watch"\) return;\s*if \(AutoAdvance\.has\("watch"\)\) return;\s*watchReliefArmed = true;\s*AutoAdvance\.clear\("watch"\);\s*const st = getRelief\(\);/, "relief entry: live scene, watch lock, armed flag, then clear before any v45 state write");
assert.match(reliefSpotBlock[0], /AutoAdvance\.schedule\("watch", spot\.target, \{ delay: branchDelay\(\) \}\);/, "relief entries share the watch scope");
for (const [id, entry, target, fb] of [
  ["relief-entry-clock", "watch-clock", "minute-before-archive", "钟轴向前让出一格，露出被压在十七分下面的档案井。"],
  ["relief-entry-lamp", "watch-lamp", "cold-wick-service-bay", "灯没有亮。桌面下方却亮出一条只给冷灯芯使用的检修槽。"],
  ["relief-entry-chair", "watch-chair", "absent-relief-locker", "椅子向后退了一班。墙里的缺班更衣柜替它打开。"],
]) {
  assert.match(js, new RegExp(`"${id}": \\{ entry: "${entry}", scene: "\\w+", target: "${target}", feedback: "${fb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" \\}`), `relief entry ${id} verbatim`);
}

/* 三个新场景：说明逐字、三个画面内热点（figure 内、非卡片清单）、回值夜室出口，零 inline SVG */
const minuteSection = html.match(/<section class="scene scene-branch scene-relief scene-minute-before-archive"[\s\S]*?<\/section>/);
assert.ok(minuteSection, "scene section missing: minute-before-archive");
assert.ok(minuteSection[0].includes("前一分钟档案井") && minuteSection[0].includes("03:17 没有停住。它把抵达之前的一分钟，一层层压进钟背后的档案井。"), "minute epigraph verbatim");
assert.ok(!minuteSection[0].includes("<svg") && !minuteSection[0].includes("branch-btn"), "minute: no SVG, no card list");
assert.match(minuteSection[0], /src="assets\/minute-before-archive\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["relief-minute-action-hand", "把慢一拍的分针拨回前一格", "拨分针"], ["relief-minute-action-card", "给空白交班卡盖上圆形时印", "盖时印"], ["relief-minute-action-shaft", "沿钟轴背后的齿槽向下", "下齿槽"]]) {
  assert.ok(minuteSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `minute missing hotspot ${id}`);
  assert.ok(minuteSection[0].includes(`>${short}</span>`), `minute hotspot ${id} missing short label`);
}
assert.match(minuteSection[0], /id="relief-minute-response" aria-live="polite"/);
assert.match(minuteSection[0], /data-go="watch"/);
const wickSection = html.match(/<section class="scene scene-branch scene-relief scene-cold-wick-service-bay"[\s\S]*?<\/section>/);
assert.ok(wickSection, "scene section missing: cold-wick-service-bay");
assert.ok(wickSection[0].includes("冷灯芯检修槽") && wickSection[0].includes("值夜室的灯从未断电。这里维修的，只是那些决定继续熄灭的灯芯。"), "wick epigraph verbatim");
assert.ok(!wickSection[0].includes("<svg") && !wickSection[0].includes("branch-btn"), "wick: no SVG, no card list");
assert.match(wickSection[0], /src="assets\/cold-wick-service-bay\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["relief-wick-action-wick", "拧亮结霜的冷灯芯", "拧冷芯"], ["relief-wick-action-cable", "把黑色电话线从供电管里拔出", "拔电话线"], ["relief-wick-action-fuse", "推回带椅形刻痕的黄铜保险片", "推保险片"]]) {
  assert.ok(wickSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `wick missing hotspot ${id}`);
  assert.ok(wickSection[0].includes(`>${short}</span>`), `wick hotspot ${id} missing short label`);
}
assert.match(wickSection[0], /id="relief-wick-response" aria-live="polite"/);
assert.match(wickSection[0], /data-go="watch"/);
const lockerSection = html.match(/<section class="scene scene-branch scene-relief scene-absent-relief-locker"[\s\S]*?<\/section>/);
assert.ok(lockerSection, "scene section missing: absent-relief-locker");
assert.ok(lockerSection[0].includes("缺班更衣柜") && lockerSection[0].includes("每一班都有人来接。没人出现时，衣服、椅子和签名会依次替他完成交班。"), "locker epigraph verbatim");
assert.ok(!lockerSection[0].includes("<svg") && !lockerSection[0].includes("branch-btn"), "locker: no SVG, no card list");
assert.match(lockerSection[0], /src="assets\/absent-relief-locker\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["relief-locker-action-coat", "穿上没有姓名牌的值夜外套", "穿空外套"], ["relief-locker-action-chair", "坐进柜前折起的空椅", "坐空椅"], ["relief-locker-action-roster", "在没有下一班的交接簿上签名", "签缺班簿"]]) {
  assert.ok(lockerSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `locker missing hotspot ${id}`);
  assert.ok(lockerSection[0].includes(`>${short}</span>`), `locker hotspot ${id} missing short label`);
}
assert.match(lockerSection[0], /id="relief-locker-response" aria-live="polite"/);
assert.match(lockerSection[0], /data-go="watch"/);
assert.match(css, /\.relief-hotspot \{/);

/* 目录 02ι/02κ/02λ、痕迹单行、8 卡 */
assert.match(html, /<a href="#minute-before-archive" id="relief-minute-link" hidden data-hover>02ι \/ 分前<\/a>/);
assert.match(html, /<a href="#cold-wick-service-bay" id="relief-wick-link" hidden data-hover>02κ \/ 冷芯<\/a>/);
assert.match(html, /<a href="#absent-relief-locker" id="relief-locker-link" hidden data-hover>02λ \/ 缺班<\/a>/);
assert.ok(html.includes('id="relief-memory"'), "remembrance gains the single relief memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v45 状态契约：独立 key、pending 四字段严格匹配、lastScene/lastAction 互相匹配、与 v28–v44 零引用 */
assert.match(js, /const RELIEF_KEY = "goddead_v45_absent_relief";/);
const reliefParseBlock = js.match(/const getRelief = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(reliefParseBlock, "getRelief must exist");
assert.match(reliefParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt relief storage must be safely repaired");
assert.match(reliefParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(reliefParseBlock[0], /RELIEF_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(reliefParseBlock[0], /const acts = RELIEF_ACTIONS\[raw\.pending\.scene\];/, "pending scene must be whitelisted");
assert.match(reliefParseBlock[0], /if \(act && raw\.pending\.target === act\.target && raw\.pending\.feedback === act\.feedback\) \{/, "pending target and feedback must strictly match the action table");
assert.match(reliefParseBlock[0], /const lastScene = RELIEF_SCENES\.includes\(raw\.lastScene\) \? raw\.lastScene : "";/, "lastScene whitelisted");
assert.match(reliefParseBlock[0], /const lastAction = lastScene && RELIEF_ACTIONS\[lastScene\]\[raw\.lastAction\] \? raw\.lastAction : "";/, "lastAction must match lastScene");
assert.match(reliefParseBlock[0], /Math\.min\(RELIEF_NUM_CAP, Math\.floor\(traversals\)\)/, "traversals floored and capped");
assert.match(reliefParseBlock[0], /raw\.marks\.filter\(\(m\) => RELIEF_MARKS\.includes\(m\)\)/, "illegal relief marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44)/.test(reliefParseBlock[0]), "relief state must not touch v28-v44");

/* 九动作：反馈/target/mark 逐字与 live scene 守卫、首选锁、pending 持久化、触发前清 pending、重返重播 */
assert.match(js, /hand: \{ btn: "#relief-minute-action-hand", target: "lagging-shadow-cloister", feedback: "分针退了一格。滞影回廊里，所有影子同时迟到。", mark: "rewoundMinuteHand" \}/);
assert.match(js, /card: \{ btn: "#relief-minute-action-card", target: "night-shift-registry", feedback: "印章落下时，日期往后跳了一夜。夜班登记所从档案井上方开窗。", mark: "stampedBlankShiftCard" \}/);
assert.match(js, /shaft: \{ btn: "#relief-minute-action-shaft", target: "cold-wick-service-bay", feedback: "齿槽没有通向钟背，而是把你送进灭灯的供电层。", mark: "descendedClockGearSlot" \}/);
assert.match(js, /wick: \{ btn: "#relief-wick-action-wick", target: "unlit-lamp-gallery", feedback: "灯芯亮成一小块更深的黑。无灯灯廊认出了这种光。", mark: "turnedColdWick" \}/);
assert.match(js, /cable: \{ btn: "#relief-wick-action-cable", target: "counter-knock-gallery", feedback: "线头没有电，只有三下从门内回来的震动。", mark: "pulledTelephoneCable" \}/);
assert.match(js, /fuse: \{ btn: "#relief-wick-action-fuse", target: "absent-relief-locker", feedback: "保险片合上，缺班者的更衣柜在墙后通了电。", mark: "resetChairFuse" \}/);
assert.match(js, /coat: \{ btn: "#relief-locker-action-coat", target: "proxy-admission", feedback: "外套替你填了名字。门外代审窗只看见一个正在替班的人。", mark: "woreNamelessWatchCoat" \}/);
assert.match(js, /chair: \{ btn: "#relief-locker-action-chair", target: "borrowed-shadow-gallery", feedback: "椅子先承认了你的影子，借影陈列廊随后承认了你。", mark: "satInReliefChair" \}/);
assert.match(js, /roster: \{ btn: "#relief-locker-action-roster", target: "watch", feedback: "最后一栏出现了你的笔迹。第三值夜室终于等到下一班——仍然是你。", mark: "signedAbsentReliefRoster" \}/);
const runReliefBlock = js.match(/const runReliefAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runReliefBlock[0], /if \(currentScene !== RELIEF_SCENE_NAME\[sceneKey\]\) return;\s*if \(AutoAdvance\.has\("relief-" \+ sceneKey\)\) return;\s*const st = getRelief\(\);/, "off-scene relief actions are rejected before any state access, feedback or timer");
assert.match(runReliefBlock[0], /st\.pending = \{ scene: sceneKey, action: actionId, target: act\.target, feedback: act\.feedback \};/, "accepted action persists the full pending mapping");
assert.match(runReliefBlock[0], /s\.pending = null;\s*saveRelief\(s\);/, "pending cleared right before the timer fires");
const enterReliefBlock = js.match(/const enterRelief = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(enterReliefBlock[0], /if \(st\.pending && st\.pending\.scene === sceneKey\) \{/, "returning to the pending scene replays and re-arms");
assert.match(enterReliefBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /未到交班：改道 \$\{st\.traversals\} 次；分前 \/ 冷芯 \/ 缺班已见 \$\{seen\}\/3。/, "relief memory line verbatim");
assert.match(js, /paintReliefMemory\(\);/);
assert.match(js, /syncReliefLinks\(\);/);

/* ---------- v46 旁线未静：交换台三入口 + 三个画面热点场景 ---------- */
/* 三张正式 WebP 存在且被引用，三张监理源 PNG 保留，交换台原图不替换 */
for (const asset of ["assets/unseated-listening-booth.webp", "assets/unnumbered-jack-field.webp", "assets/return-ring-morgue.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-unseated-listening-booth", "source-unnumbered-jack-field", "source-return-ring-morgue"]) {
  await access(new URL(`design-references/${src}.png`, root));
}
assert.match(html, /<img class="switch-img" src="assets\/line-four-switchboard\.webp" alt="" width="1400" height="846">/, "switchboard bitmap untouched");

/* 交换台三入口：覆盖真实听筒/散线插头/回铃灯，aria/短标签逐字，独立 class */
for (const [id, label, short] of [
  ["sidetone-entry-receiver", "摘起交换台左下无人接听的黑色听筒", "摘听筒"],
  ["sidetone-entry-plug", "拾起交换台前景没有线路编号的散线插头", "拾散头"],
  ["sidetone-entry-return-lamp", "按下交换台右下仍亮着的红色回铃灯", "按回灯"],
]) {
  assert.match(html, new RegExp(`id="${id}" type="button" aria-label="${label}"`), `switchboard missing sidetone entry ${id}`);
  assert.ok(html.includes(`>${short}</span>`), `sidetone entry ${id} missing short label`);
}
assert.match(html, /class="sidetone-entry-hotspot sidetone-entry-receiver"/);
assert.match(css, /\.sidetone-entry-hotspot \{/);
assert.match(css, /\.sidetone-entry-receiver \{/);
assert.match(css, /\.sidetone-entry-plug \{/);
assert.match(css, /\.sidetone-entry-return-lamp \{/);
assert.match(html, /id="sidetone-entry-response" aria-live="polite"/, "entry feedback has its own aria-live region");

/* 四回线原文、第四线唯一接通与原 deadletter 路径不变 */
for (const orig of ["壹 · 门外回线", "贰 · 焚献回线", "叁 · 值夜内线", "肆 · 未分配"]) {
  assert.ok(html.includes(orig), `patch line verbatim: ${orig}`);
}
assert.match(js, /AutoAdvance\.schedule\("switchboard", "deadletter", \{/, "switchboard to deadletter path untouched");

/* 第一归宿锁双向：入口守卫顺序 + 四条 patch 按钮的迟到写入守卫 */
const sidetoneSpotBlock = js.match(/const spot = SIDETONE_SWITCH_SPOTS\[id\];[\s\S]*?addEventListener\("click", \(\) => \{[\s\S]*?\n    \}\);/);
assert.ok(sidetoneSpotBlock, "sidetone switch entry handler must exist");
assert.match(sidetoneSpotBlock[0], /if \(currentScene !== "switchboard"\) return;\s*if \(switchSidetoneArmed\) return;\s*if \(AutoAdvance\.has\("switchboard"\)\) return;\s*switchSidetoneArmed = true;\s*AutoAdvance\.clear\("switchboard"\);\s*const st = getSidetone\(\);/, "sidetone entry: live scene, armed flag, switchboard lock, then clear before any v46 state write");
assert.match(sidetoneSpotBlock[0], /AutoAdvance\.schedule\("switchboard", spot\.target, \{ delay: branchDelay\(\) \}\);/, "sidetone entries share the switchboard scope");
for (const [id, entry, target, fb] of [
  ["sidetone-entry-receiver", "switch-receiver", "unseated-listening-booth", "听筒离开叉簧，里面没有人声，只有一张空椅子在等你先开口。"],
  ["sidetone-entry-plug", "switch-plug", "unnumbered-jack-field", "散线插头自己找到一个没有编号的孔。交换台后面多出一整面插孔。"],
  ["sidetone-entry-return-lamp", "switch-return-lamp", "return-ring-morgue", "红灯熄灭，别处却亮起一排已经挂断的回铃。"],
]) {
  assert.match(js, new RegExp(`"${id}": \\{ entry: "${entry}", scene: "\\w+", target: "${target}", feedback: "${fb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" \\}`), `sidetone entry ${id} verbatim`);
}
assert.match(js, /switchSidetoneArmed = false;/, "sidetone armed resets on switchboard entry");
const coverPatchBlock = js.match(/const coverPatch = \(n, silent = false\) => \{[\s\S]*?\n  \};/);
assert.match(coverPatchBlock[0], /if \(switchSidetoneArmed\) return;/, "patch 1-3 must not write line4 once a sidetone entry is armed");
const patch4Block = js.match(/patch4Btn\.addEventListener\("click", \(\) => \{[\s\S]*?\n  \}\);/);
assert.match(patch4Block[0], /if \(switchSidetoneArmed\) return;/, "patch 4 must not connect late once a sidetone entry is armed");

/* 三个新场景：说明逐字、三个画面内热点（figure 内、非卡片清单）、回交换台出口，零 inline SVG */
const boothSection = html.match(/<section class="scene scene-branch scene-sidetone scene-unseated-listening-booth"[\s\S]*?<\/section>/);
assert.ok(boothSection, "scene section missing: unseated-listening-booth");
assert.ok(boothSection[0].includes("失席监听间") && boothSection[0].includes("没有人坐过这张椅子。它一直保持摘机状态，替你听完那些没被计入线路的声音。"), "booth epigraph verbatim");
assert.ok(!boothSection[0].includes("<svg") && !boothSection[0].includes("branch-btn"), "booth: no SVG, no card list");
assert.match(boothSection[0], /src="assets\/unseated-listening-booth\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["sidetone-booth-action-earpiece", "把左侧悬着的黑色耳筒贴到耳边", "贴耳筒"], ["sidetone-booth-action-mouthpiece", "对着没有人的圆形话筒开口", "对空话筒"], ["sidetone-booth-action-chair", "坐进一直保持摘机状态的操作椅", "坐失席"]]) {
  assert.ok(boothSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `booth missing hotspot ${id}`);
  assert.ok(boothSection[0].includes(`>${short}</span>`), `booth hotspot ${id} missing short label`);
}
assert.match(boothSection[0], /id="sidetone-booth-response" aria-live="polite"/);
assert.match(boothSection[0], /data-go="switchboard"/);
const jackSection = html.match(/<section class="scene scene-branch scene-sidetone scene-unnumbered-jack-field"[\s\S]*?<\/section>/);
assert.ok(jackSection, "scene section missing: unnumbered-jack-field");
assert.ok(jackSection[0].includes("无号插孔场") && jackSection[0].includes("没有编号的孔，可以接到任意地点。交换台拒绝承认这面墙存在。"), "jack epigraph verbatim");
assert.ok(!jackSection[0].includes("<svg") && !jackSection[0].includes("branch-btn"), "jack: no SVG, no card list");
assert.match(jackSection[0], /src="assets\/unnumbered-jack-field\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["sidetone-jack-action-plug", "把脱落的游线插头插回任意一个无号孔", "插游线"], ["sidetone-jack-action-socket", "接通中央透出暗红的空孔", "接空孔"], ["sidetone-jack-action-tag", "把完全空白的瓷质线签挂上插孔墙", "挂空签"]]) {
  assert.ok(jackSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `jack missing hotspot ${id}`);
  assert.ok(jackSection[0].includes(`>${short}</span>`), `jack hotspot ${id} missing short label`);
}
assert.match(jackSection[0], /id="sidetone-jack-response" aria-live="polite"/);
assert.match(jackSection[0], /data-go="switchboard"/);
const morgueSection = html.match(/<section class="scene scene-branch scene-sidetone scene-return-ring-morgue"[\s\S]*?<\/section>/);
assert.ok(morgueSection, "scene section missing: return-ring-morgue");
assert.ok(morgueSection[0].includes("回铃陈放室") && morgueSection[0].includes("对端早已挂断。这些回铃没有被接通，也没有被丢弃，只是被保存。"), "morgue epigraph verbatim");
assert.ok(!morgueSection[0].includes("<svg") && !morgueSection[0].includes("branch-btn"), "morgue: no SVG, no card list");
assert.match(morgueSection[0], /src="assets\/return-ring-morgue\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["sidetone-morgue-action-lamp", "取下仍发暗红光的回铃灯", "取回灯"], ["sidetone-morgue-action-slip", "读托盘上卷曲的退回通话单", "读退单"], ["sidetone-morgue-action-bell", "敲响内部结着黑蜡的黄铜铃碗", "敲蜡铃"]]) {
  assert.ok(morgueSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `morgue missing hotspot ${id}`);
  assert.ok(morgueSection[0].includes(`>${short}</span>`), `morgue hotspot ${id} missing short label`);
}
assert.match(morgueSection[0], /id="sidetone-morgue-response" aria-live="polite"/);
assert.match(morgueSection[0], /data-go="switchboard"/);
assert.match(css, /\.sidetone-hotspot \{/);

/* 目录 02μ/02ν/02ξ、痕迹单行、8 卡 */
assert.match(html, /<a href="#unseated-listening-booth" id="sidetone-booth-link" hidden data-hover>02μ \/ 失席<\/a>/);
assert.match(html, /<a href="#unnumbered-jack-field" id="sidetone-jack-link" hidden data-hover>02ν \/ 无号孔<\/a>/);
assert.match(html, /<a href="#return-ring-morgue" id="sidetone-morgue-link" hidden data-hover>02ξ \/ 回铃<\/a>/);
assert.ok(html.includes('id="sidetone-memory"'), "remembrance gains the single sidetone memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v46 状态契约：独立 key、pending 四字段严格匹配、lastScene/lastAction 互相匹配、与 v28–v45 零引用 */
assert.match(js, /const SIDETONE_KEY = "goddead_v46_sidetones";/);
const sidetoneParseBlock = js.match(/const getSidetone = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(sidetoneParseBlock, "getSidetone must exist");
assert.match(sidetoneParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt sidetone storage must be safely repaired");
assert.match(sidetoneParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(sidetoneParseBlock[0], /SIDETONE_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(sidetoneParseBlock[0], /const acts = SIDETONE_ACTIONS\[raw\.pending\.scene\];/, "pending scene must be whitelisted");
assert.match(sidetoneParseBlock[0], /if \(act && raw\.pending\.target === act\.target && raw\.pending\.feedback === act\.feedback\) \{/, "pending target and feedback must strictly match the action table");
assert.match(sidetoneParseBlock[0], /const lastScene = SIDETONE_SCENES\.includes\(raw\.lastScene\) \? raw\.lastScene : "";/, "lastScene whitelisted");
assert.match(sidetoneParseBlock[0], /const lastAction = lastScene && SIDETONE_ACTIONS\[lastScene\]\[raw\.lastAction\] \? raw\.lastAction : "";/, "lastAction must match lastScene");
assert.match(sidetoneParseBlock[0], /Math\.min\(SIDETONE_NUM_CAP, Math\.floor\(traversals\)\)/, "traversals floored and capped");
assert.match(sidetoneParseBlock[0], /raw\.marks\.filter\(\(m\) => SIDETONE_MARKS\.includes\(m\)\)/, "illegal sidetone marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45)/.test(sidetoneParseBlock[0]), "sidetone state must not touch v28-v45");

/* 九动作：反馈/target/mark 逐字与 live scene 守卫、首选锁、pending 持久化、触发前清 pending、重返重播 */
assert.match(js, /earpiece: \{ btn: "#sidetone-booth-action-earpiece", target: "midnight-callback", feedback: "耳筒里没有来电，只有午夜回拨台在一遍遍念同一张值班表。", mark: "heardRosterWithoutCaller" \}/);
assert.match(js, /mouthpiece: \{ btn: "#sidetone-booth-action-mouthpiece", target: "counter-knock-gallery", feedback: "你没有说话。话筒却把三下敲门送回门内。", mark: "returnedSpeechAsKnocks" \}/);
assert.match(js, /chair: \{ btn: "#sidetone-booth-action-chair", target: "unnumbered-jack-field", feedback: "椅脚压下一枚暗扣，监听间的墙翻成无号插孔场。", mark: "satAtMissingOperatorSeat" \}/);
assert.match(js, /plug: \{ btn: "#sidetone-jack-action-plug", target: "red-thread-registry", feedback: "插头穿过所有空孔，最后从红线登记所的线结里伸出来。", mark: "routedWanderingPlug" \}/);
assert.match(js, /socket: \{ btn: "#sidetone-jack-action-socket", target: "return-ring-morgue", feedback: "无号插孔接通了一条已经挂断的回铃，墙后开始逐格发亮。", mark: "connectedNumberlessSocket" \}/);
assert.match(js, /tag: \{ btn: "#sidetone-jack-action-tag", target: "night-shift-registry", feedback: "空白线签盖上夜班时刻，夜班登记所把它当成通行证。", mark: "issuedBlankLineTag" \}/);
assert.match(js, /lamp: \{ btn: "#sidetone-morgue-action-lamp", target: "unlit-lamp-gallery", feedback: "回铃灯离开托盘后变得更黑。无灯灯廊把这种黑当成照明。", mark: "removedReturnedLamp" \}/);
assert.match(js, /slip: \{ btn: "#sidetone-morgue-action-slip", target: "unanswered-vestibule", feedback: "退回单没有对端，只有三次无人应门的时间。", mark: "readCallReturnSlip" \}/);
assert.match(js, /bell: \{ btn: "#sidetone-morgue-action-bell", target: "unseated-listening-booth", feedback: "黑蜡没有发声。失席监听间里的空椅替它转过来。", mark: "rangWaxFilledBell" \}/);
const runSidetoneBlock = js.match(/const runSidetoneAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runSidetoneBlock[0], /if \(currentScene !== SIDETONE_SCENE_NAME\[sceneKey\]\) return;\s*if \(AutoAdvance\.has\("sidetone-" \+ sceneKey\)\) return;\s*const st = getSidetone\(\);/, "off-scene sidetone actions are rejected before any state access, feedback or timer");
assert.match(runSidetoneBlock[0], /st\.pending = \{ scene: sceneKey, action: actionId, target: act\.target, feedback: act\.feedback \};/, "accepted action persists the full pending mapping");
assert.match(runSidetoneBlock[0], /s\.pending = null;\s*saveSidetone\(s\);/, "pending cleared right before the timer fires");
const enterSidetoneBlock = js.match(/const enterSidetone = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(enterSidetoneBlock[0], /if \(st\.pending && st\.pending\.scene === sceneKey\) \{/, "returning to the pending scene replays and re-arms");
assert.match(enterSidetoneBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /旁线未静：改道 \$\{st\.traversals\} 次；失席 \/ 无号孔 \/ 回铃已见 \$\{seen\}\/3。/, "sidetone memory line verbatim");
assert.match(js, /paintSidetoneMemory\(\);/);
assert.match(js, /syncSidetoneLinks\(\);/);

/* ---------- v47 退件未止：投递所三入口 + 三个画面热点场景 ---------- */
/* 三张正式 WebP 存在且被引用，三张监理源 PNG 保留，投递所原图不替换 */
for (const asset of ["assets/unclaimed-pneumatic-intake.webp", "assets/returned-address-cabinet.webp", "assets/blank-receipt-press.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-unclaimed-pneumatic-intake", "source-returned-address-cabinet", "source-blank-receipt-press"]) {
  await access(new URL(`design-references/${src}.png`, root));
}
assert.match(html, /<img class="dl-img" src="assets\/dead-letter-office\.webp" alt="" width="1536" height="1024">/, "deadletter bitmap untouched");

/* 投递所三入口：覆盖真实气送管/格柜/空白回执，aria/短标签逐字，独立 class */
for (const [id, label, short] of [
  ["return-room-entry-tubes", "探入投递所后墙三只黄铜气送管", "探气管"],
  ["return-room-entry-cabinet", "翻查投递所右上装满退址信件的格柜", "翻格柜"],
  ["return-room-entry-receipt", "取走投递所桌面中央的空白回执", "取空执"],
]) {
  assert.match(html, new RegExp(`id="${id}" type="button" aria-label="${label}"`), `deadletter missing return-room entry ${id}`);
  assert.ok(html.includes(`>${short}</span>`), `return-room entry ${id} missing short label`);
}
assert.match(html, /class="return-room-entry-hotspot return-room-entry-tubes"/);
assert.match(css, /\.return-room-entry-hotspot \{/);
assert.match(css, /\.return-room-entry-tubes \{/);
assert.match(css, /\.return-room-entry-cabinet \{/);
assert.match(css, /\.return-room-entry-receipt \{/);
assert.match(html, /id="return-room-entry-response" aria-live="polite"/, "entry feedback has its own aria-live region");

/* 三退件原文、回执唯一签收与原 cancellation 路径不变 */
for (const orig of ["壹 · 门外敲击。共四记。", "贰 · 焚献祷词。未拆。", "叁 · 值-叁-0469。附签退申请。", "肆 · 空白回执"]) {
  assert.ok(html.includes(orig), `return entry verbatim: ${orig.slice(0, 10)}`);
}
assert.match(js, /AutoAdvance\.schedule\("deadletter", "cancellation", \{/, "deadletter to cancellation path untouched");

/* 第一归宿锁双向：入口守卫顺序 + 三退件按钮与回执的迟到写入守卫 */
const returnSpotBlock = js.match(/const spot = RETURN_ROOM_SPOTS\[id\];[\s\S]*?addEventListener\("click", \(\) => \{[\s\S]*?\n    \}\);/);
assert.ok(returnSpotBlock, "return-room deadletter entry handler must exist");
assert.match(returnSpotBlock[0], /if \(currentScene !== "deadletter"\) return;\s*if \(deadletterReturnRoomArmed\) return;\s*if \(AutoAdvance\.has\("deadletter"\)\) return;\s*deadletterReturnRoomArmed = true;\s*AutoAdvance\.clear\("deadletter"\);\s*const st = getReturnRoom\(\);/, "return-room entry: live scene, armed flag, deadletter lock, then clear before any v47 state write");
assert.match(returnSpotBlock[0], /AutoAdvance\.schedule\("deadletter", spot\.target, \{ delay: branchDelay\(\) \}\);/, "return-room entries share the deadletter scope");
for (const [id, entry, target, fb] of [
  ["return-room-entry-tubes", "dead-tubes", "unclaimed-pneumatic-intake", "三只气送管同时吸气。最中间那只把你的呼吸盖上了“退回”。"],
  ["return-room-entry-cabinet", "dead-cabinet", "returned-address-cabinet", "格柜里每一封信都写着地址，只有地址本身已不在那里。"],
  ["return-room-entry-receipt", "dead-receipt", "blank-receipt-press", "空白回执离开桌面，纸下露出一台本不该放在楼下的压印机。"],
]) {
  assert.match(js, new RegExp(`"${id}": \\{ entry: "${entry}", scene: "\\w+", target: "${target}", feedback: "${fb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" \\}`), `return-room entry ${id} verbatim`);
}
assert.match(js, /deadletterReturnRoomArmed = false;/, "return-room armed resets on deadletter entry");
const coverReturnBlock = js.match(/const coverReturn = \(n, silent = false\) => \{[\s\S]*?\n  \};/);
assert.match(coverReturnBlock[0], /if \(deadletterReturnRoomArmed\) return;/, "return 1-3 must not write deadletter once a return-room entry is armed");
const receiptBlock = js.match(/receiptBtn\.addEventListener\("click", \(\) => \{[\s\S]*?\n  \}\);/);
assert.match(receiptBlock[0], /if \(deadletterReturnRoomArmed\) return;/, "receipt must not sign late once a return-room entry is armed");

/* 三个新场景：说明逐字、三个画面内热点（figure 内、非卡片清单）、回投递所出口，零 inline SVG */
const intakeSection = html.match(/<section class="scene scene-branch scene-return-room scene-unclaimed-pneumatic-intake"[\s\S]*?<\/section>/);
assert.ok(intakeSection, "scene section missing: unclaimed-pneumatic-intake");
assert.ok(intakeSection[0].includes("无主气送井") && intakeSection[0].includes("没有寄件人的东西，气送筒拒绝为它停下。"), "intake epigraph verbatim");
assert.ok(!intakeSection[0].includes("<svg") && !intakeSection[0].includes("branch-btn"), "intake: no SVG, no card list");
assert.match(intakeSection[0], /src="assets\/unclaimed-pneumatic-intake\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["return-intake-action-carrier", "打开左下石台上无人认领的气送筒", "开气筒"], ["return-intake-action-horn", "把耳朵贴近中央正对深井的气送管口", "听管口"], ["return-intake-action-cord", "拉下右墙压力表旁的红色泄压绳", "拉红绳"]]) {
  assert.ok(intakeSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `intake missing hotspot ${id}`);
  assert.ok(intakeSection[0].includes(`>${short}</span>`), `intake hotspot ${id} missing short label`);
}
assert.match(intakeSection[0], /id="return-intake-response" aria-live="polite"/);
assert.match(intakeSection[0], /data-go="deadletter"/);
const cabinetSection = html.match(/<section class="scene scene-branch scene-return-room scene-returned-address-cabinet"[\s\S]*?<\/section>/);
assert.ok(cabinetSection, "scene section missing: returned-address-cabinet");
assert.ok(cabinetSection[0].includes("退址格柜") && cabinetSection[0].includes("地址曾经存在。如今每一格只剩位置。"), "cabinet epigraph verbatim");
assert.ok(!cabinetSection[0].includes("<svg") && !cabinetSection[0].includes("branch-btn"), "cabinet: no SVG, no card list");
assert.match(cabinetSection[0], /src="assets\/returned-address-cabinet\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["return-cabinet-action-envelope", "抽出左侧低格里完全空白的封口信", "拆空封"], ["return-cabinet-action-wheel", "推动中央地面的黄铜分格轮", "转分格"], ["return-cabinet-action-drawer", "拉开右侧没有尽头的退址抽屉", "探长屉"]]) {
  assert.ok(cabinetSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `cabinet missing hotspot ${id}`);
  assert.ok(cabinetSection[0].includes(`>${short}</span>`), `cabinet hotspot ${id} missing short label`);
}
assert.match(cabinetSection[0], /id="return-cabinet-response" aria-live="polite"/);
assert.match(cabinetSection[0], /data-go="deadletter"/);
const pressSection = html.match(/<section class="scene scene-branch scene-return-room scene-blank-receipt-press"[\s\S]*?<\/section>/);
assert.ok(pressSection, "scene section missing: blank-receipt-press");
assert.ok(pressSection[0].includes("空白回执压印台") && pressSection[0].includes("寄件人与收件人都消失以后，回执仍要求被签收。"), "press epigraph verbatim");
assert.ok(!pressSection[0].includes("<svg") && !pressSection[0].includes("branch-btn"), "press: no SVG, no card list");
assert.match(pressSection[0], /src="assets\/blank-receipt-press\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["return-press-action-sheet", "把压印台中央的空白回执推入滚轴", "压空执"], ["return-press-action-ink", "按下左侧只剩暗红余光的墨垫", "蘸旧墨"], ["return-press-action-lever", "扳下右侧黄铜压印长杆", "落压杆"]]) {
  assert.ok(pressSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `press missing hotspot ${id}`);
  assert.ok(pressSection[0].includes(`>${short}</span>`), `press hotspot ${id} missing short label`);
}
assert.match(pressSection[0], /id="return-press-response" aria-live="polite"/);
assert.match(pressSection[0], /data-go="deadletter"/);
assert.match(css, /\.return-room-hotspot \{/);

/* 目录 02ο/02π/02ρ、痕迹单行、8 卡 */
assert.match(html, /<a href="#unclaimed-pneumatic-intake" id="return-intake-link" hidden data-hover>02ο \/ 气送井<\/a>/);
assert.match(html, /<a href="#returned-address-cabinet" id="return-cabinet-link" hidden data-hover>02π \/ 退址柜<\/a>/);
assert.match(html, /<a href="#blank-receipt-press" id="return-press-link" hidden data-hover>02ρ \/ 压印台<\/a>/);
assert.ok(html.includes('id="return-room-memory"'), "remembrance gains the single return-room memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v47 状态契约：独立 key、pending 四字段严格匹配、lastScene/lastAction 互相匹配、与 v28–v46 零引用 */
assert.match(js, /const RETURN_ROOM_KEY = "goddead_v47_returned_rooms";/);
const returnRoomParseBlock = js.match(/const getReturnRoom = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(returnRoomParseBlock, "getReturnRoom must exist");
assert.match(returnRoomParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt return-room storage must be safely repaired");
assert.match(returnRoomParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(returnRoomParseBlock[0], /RETURN_ROOM_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(returnRoomParseBlock[0], /const acts = RETURN_ROOM_ACTIONS\[raw\.pending\.scene\];/, "pending scene must be whitelisted");
assert.match(returnRoomParseBlock[0], /if \(act && raw\.pending\.target === act\.target && raw\.pending\.feedback === act\.feedback\) \{/, "pending target and feedback must strictly match the action table");
assert.match(returnRoomParseBlock[0], /const lastScene = RETURN_ROOM_SCENES\.includes\(raw\.lastScene\) \? raw\.lastScene : "";/, "lastScene whitelisted");
assert.match(returnRoomParseBlock[0], /const lastAction = lastScene && RETURN_ROOM_ACTIONS\[lastScene\]\[raw\.lastAction\] \? raw\.lastAction : "";/, "lastAction must match lastScene");
assert.match(returnRoomParseBlock[0], /Math\.min\(RETURN_ROOM_NUM_CAP, Math\.floor\(reroutes\)\)/, "reroutes floored and capped");
assert.match(returnRoomParseBlock[0], /raw\.marks\.filter\(\(m\) => RETURN_ROOM_MARKS\.includes\(m\)\)/, "illegal return-room marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46)/.test(returnRoomParseBlock[0]), "return-room state must not touch v28-v46");

/* 九动作：反馈/target/mark 逐字与 live scene 守卫、首选锁、pending 持久化、触发前清 pending、重返重播 */
assert.match(js, /carrier: \{ btn: "#return-intake-action-carrier", target: "returned-address-cabinet", feedback: "圆筒里没有信，只有一枚会替收件人旋转的分格轮。", mark: "openedUnclaimedCarrier" \}/);
assert.match(js, /horn: \{ btn: "#return-intake-action-horn", target: "midnight-callback", feedback: "管口没有风，却把午夜回拨台尚未拨出的铃声吹到耳边。", mark: "heardUnsentCallback" \}/);
assert.match(js, /cord: \{ btn: "#return-intake-action-cord", target: "return-ring-morgue", feedback: "红线一拉，压力表归零。楼上的回铃被当作退件送进陈放室。", mark: "ventedReturnedPressure" \}/);
assert.match(js, /envelope: \{ btn: "#return-cabinet-action-envelope", target: "blank-receipt-press", feedback: "信封没有地址，也没有封口；展开以后正好是一张回执。", mark: "unfoldedAddresslessEnvelope" \}/);
assert.match(js, /wheel: \{ btn: "#return-cabinet-action-wheel", target: "red-thread-registry", feedback: "分格轮只转半格，所有空地址同时缠上一根红线。", mark: "indexedMissingAddresses" \}/);
assert.match(js, /drawer: \{ btn: "#return-cabinet-action-drawer", target: "retention-vault", feedback: "抽屉没有尽头。最深处那枚地址牌已经被留置多年。", mark: "openedEndlessAddressDrawer" \}/);
assert.match(js, /sheet: \{ btn: "#return-press-action-sheet", target: "unclaimed-valuation", feedback: "空白纸被压出重量，没有文字。估值室因此把它列为无人认领。", mark: "weighedBlankReceipt" \}/);
assert.match(js, /ink: \{ btn: "#return-press-action-ink", target: "minute-before-archive", feedback: "墨垫里只剩 03:16 尚未干透；分前档案井认出这枚时间。", mark: "inkedMinuteBeforeReturn" \}/);
assert.match(js, /lever: \{ btn: "#return-press-action-lever", target: "unclaimed-pneumatic-intake", feedback: "压杆落下，回执没有留下印痕，只被卷进无主气送井。", mark: "pressedReceiptBackToIntake" \}/);
const runReturnRoomBlock = js.match(/const runReturnRoomAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runReturnRoomBlock[0], /if \(currentScene !== RETURN_ROOM_SCENE_NAME\[sceneKey\]\) return;\s*if \(AutoAdvance\.has\("return-room-" \+ sceneKey\)\) return;\s*const st = getReturnRoom\(\);/, "off-scene return-room actions are rejected before any state access, feedback or timer");
assert.match(runReturnRoomBlock[0], /st\.pending = \{ scene: sceneKey, action: actionId, target: act\.target, feedback: act\.feedback \};/, "accepted action persists the full pending mapping");
assert.match(runReturnRoomBlock[0], /s\.pending = null;\s*saveReturnRoom\(s\);/, "pending cleared right before the timer fires");
const enterReturnRoomBlock = js.match(/const enterReturnRoom = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(enterReturnRoomBlock[0], /if \(st\.pending && st\.pending\.scene === sceneKey\) \{/, "returning to the pending scene replays and re-arms");
assert.match(enterReturnRoomBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /退件未止：改址 \$\{st\.reroutes\} 次；气送井 \/ 退址柜 \/ 压印台已见 \$\{seen\}\/3。/, "return-room memory line verbatim");
assert.match(js, /paintReturnRoomMemory\(\);/);
assert.match(js, /syncReturnRoomLinks\(\);/);

/* ---------- v48 注销留副：注销科三入口 + 三个画面热点场景 ---------- */
/* 三张正式 WebP 存在且被引用，三张监理源 PNG 保留，注销科原图不替换 */
for (const asset of ["assets/blank-screen-underarchive.webp", "assets/false-confirmation-desk.webp", "assets/witness-carbon-archive.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["source-blank-screen-underarchive", "source-false-confirmation-desk", "source-witness-carbon-archive"]) {
  await access(new URL(`design-references/${src}.png`, root));
}
assert.match(html, /<img class="cancel-img" src="assets\/divine-name-cancellation\.webp" alt="" width="1536" height="1024">/, "cancellation bitmap untouched");

/* 注销科三入口：覆盖真实空白屏/确认灯/档案屉，aria/短标签逐字，独立 class */
for (const [id, label, short] of [
  ["cancellation-copy-entry-screen", "触摸注销科终端中央始终空白的检索屏", "探空屏"],
  ["cancellation-copy-entry-lamp", "按下注销科终端右侧仍亮着的红色确认灯", "按红灯"],
  ["cancellation-copy-entry-trays", "抽开注销科终端右侧摞起的档案屉", "抽侧屉"],
]) {
  assert.match(html, new RegExp(`id="${id}" type="button" aria-label="${label}"`), `cancellation missing copy entry ${id}`);
  assert.ok(html.includes(`>${short}</span>`), `copy entry ${id} missing short label`);
}
assert.match(html, /class="cancellation-copy-entry-hotspot cancellation-copy-entry-screen"/);
assert.match(css, /\.cancellation-copy-entry-hotspot \{/);
assert.match(css, /\.cancellation-copy-entry-screen \{/);
assert.match(css, /\.cancellation-copy-entry-lamp \{/);
assert.match(css, /\.cancellation-copy-entry-trays \{/);
assert.match(html, /id="cancellation-copy-entry-response" aria-live="polite"/, "entry feedback has its own aria-live region");

/* 三档错误提示、GODDEAD 唯一命中、拒绝注销与原 acting 路径不变 */
for (const hint of ["这里不按名字检索。", "查状态，不查神。", "域名已经替你填过一次答案。"]) {
  assert.ok(js.includes(hint), `cancel hint verbatim: ${hint}`);
}
assert.match(js, /if \(value === "GODDEAD"\) \{/, "GODDEAD keeps its only hit condition");
assert.match(js, /AutoAdvance\.schedule\("cancellation", "acting", \{/, "cancellation to acting path untouched");

/* 第一归宿锁双向：入口守卫顺序 + 表单与拒绝按钮的迟到写入守卫 */
const copySpotBlock = js.match(/const spot = COPY_SPOTS\[id\];[\s\S]*?addEventListener\("click", \(\) => \{[\s\S]*?\n    \}\);/);
assert.ok(copySpotBlock, "copy cancellation entry handler must exist");
assert.match(copySpotBlock[0], /if \(currentScene !== "cancellation"\) return;\s*if \(cancellationCopyArmed\) return;\s*if \(AutoAdvance\.has\("cancellation"\)\) return;\s*cancellationCopyArmed = true;\s*AutoAdvance\.clear\("cancellation"\);\s*clearCnTimers\(\);\s*const st = getCopy\(\);/, "copy entry: live scene, armed flag, cancellation lock, then clear before any v48 state write");
assert.match(copySpotBlock[0], /AutoAdvance\.schedule\("cancellation", spot\.target, \{ delay: branchDelay\(\) \}\);/, "copy entries share the cancellation scope");
for (const [id, entry, target, fb] of [
  ["cancellation-copy-entry-screen", "cancel-screen", "blank-screen-underarchive", "空白屏没有显示查询结果。玻璃背面却有一整间档案室亮了起来。"],
  ["cancellation-copy-entry-lamp", "cancel-lamp", "false-confirmation-desk", "红灯没有熄灭。它把“未注销”误当成了新的批准。"],
  ["cancellation-copy-entry-trays", "cancel-trays", "witness-carbon-archive", "侧屉里没有原件，只有每位见证者拒绝以后留下的复写副本。"],
]) {
  assert.match(js, new RegExp(`"${id}": \\{ entry: "${entry}", scene: "\\w+", target: "${target}", feedback: "${fb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" \\}`), `copy entry ${id} verbatim`);
}
assert.match(js, /cancellationCopyArmed = false;/, "copy armed resets on cancellation entry");
const cancelFormBlock = js.match(/cancelForm\.addEventListener\("submit", \(e\) => \{[\s\S]*?\n  \}\);/);
assert.match(cancelFormBlock[0], /if \(cancellationCopyArmed\) return;/, "search form must not write cancellation once a copy entry is armed");
const refuseBlock = js.match(/refuseBtn\.addEventListener\("click", \(\) => \{[\s\S]*?\n  \}\);/);
assert.match(refuseBlock[0], /if \(cancellationCopyArmed\) return;/, "refuse button must not sign late once a copy entry is armed");

/* 三个新场景：说明逐字、三个画面内热点（figure 内、非卡片清单）、回注销科出口，零 inline SVG */
const copyScreenSection = html.match(/<section class="scene scene-branch scene-cancellation-copy scene-blank-screen-underarchive"[\s\S]*?<\/section>/);
assert.ok(copyScreenSection, "scene section missing: blank-screen-underarchive");
assert.ok(copyScreenSection[0].includes("空白屏底库") && copyScreenSection[0].includes("空白屏的背面，留着一次没有显示出来的检索。"), "screen epigraph verbatim");
assert.ok(!copyScreenSection[0].includes("<svg") && !copyScreenSection[0].includes("branch-btn"), "screen: no SVG, no card list");
assert.match(copyScreenSection[0], /src="assets\/blank-screen-underarchive\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["copy-screen-action-screen", "触摸屏底库中央发出骨白光的巨大空白屏", "触白屏"], ["copy-screen-action-paper", "抽出屏底库左下走纸机里卷曲的空白纸带", "抽纸带"], ["copy-screen-action-aperture", "窥看屏底库右墙黄铜边框里的圆形暗孔", "窥暗孔"]]) {
  assert.ok(copyScreenSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `screen missing hotspot ${id}`);
  assert.ok(copyScreenSection[0].includes(`>${short}</span>`), `screen hotspot ${id} missing short label`);
}
assert.match(copyScreenSection[0], /id="copy-screen-response" aria-live="polite"/);
assert.match(copyScreenSection[0], /data-go="cancellation"/);
const copyLampSection = html.match(/<section class="scene scene-branch scene-cancellation-copy scene-false-confirmation-desk"[\s\S]*?<\/section>/);
assert.ok(copyLampSection, "scene section missing: false-confirmation-desk");
assert.ok(copyLampSection[0].includes("误准红灯台") && copyLampSection[0].includes("这盏灯把「未注销」误记成一次新的批准，而且拒绝改正。"), "lamp epigraph verbatim");
assert.ok(!copyLampSection[0].includes("<svg") && !copyLampSection[0].includes("branch-btn"), "lamp: no SVG, no card list");
assert.match(copyLampSection[0], /src="assets\/false-confirmation-desk\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["copy-lamp-action-lamp", "再次按下误准台中央烟熏玻璃后的红色确认灯", "复按红灯"], ["copy-lamp-action-seal", "压下误准台左侧沉重的圆形注销印", "压注销印"], ["copy-lamp-action-chute", "把手伸向误准台右侧直落黑暗的退纸槽", "探退纸槽"]]) {
  assert.ok(copyLampSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `lamp missing hotspot ${id}`);
  assert.ok(copyLampSection[0].includes(`>${short}</span>`), `lamp hotspot ${id} missing short label`);
}
assert.match(copyLampSection[0], /id="copy-lamp-response" aria-live="polite"/);
assert.match(copyLampSection[0], /data-go="cancellation"/);
const copyCarbonSection = html.match(/<section class="scene scene-branch scene-cancellation-copy scene-witness-carbon-archive"[\s\S]*?<\/section>/);
assert.ok(copyCarbonSection, "scene section missing: witness-carbon-archive");
assert.ok(copyCarbonSection[0].includes("见证复写库") && copyCarbonSection[0].includes("每位见证者拒绝以后，这里都会多出一张没有姓名的复写纸。"), "carbon epigraph verbatim");
assert.ok(!copyCarbonSection[0].includes("<svg") && !copyCarbonSection[0].includes("branch-btn"), "carbon: no SVG, no card list");
assert.match(copyCarbonSection[0], /src="assets\/witness-carbon-archive\.webp" alt="" width="1536" height="1024"/);
for (const [id, label, short] of [["copy-carbon-action-sheet", "揭开见证复写库中央抽屉里的空白复写纸", "揭复写纸"], ["copy-carbon-action-drawer", "拉动见证复写库中央伸向你的黑铁抽屉", "拉见证屉"], ["copy-carbon-action-card", "取下抽屉右上机械夹中的空白黄铜见证卡", "取见证卡"]]) {
  assert.ok(copyCarbonSection[0].includes(`id="${id}" type="button" aria-label="${label}"`), `carbon missing hotspot ${id}`);
  assert.ok(copyCarbonSection[0].includes(`>${short}</span>`), `carbon hotspot ${id} missing short label`);
}
assert.match(copyCarbonSection[0], /id="copy-carbon-response" aria-live="polite"/);
assert.match(copyCarbonSection[0], /data-go="cancellation"/);
assert.match(css, /\.cancellation-copy-hotspot \{/);

/* 目录 02σ/02τ/02υ、痕迹单行、8 卡 */
assert.match(html, /<a href="#blank-screen-underarchive" id="copy-screen-link" hidden data-hover>02σ \/ 屏底库<\/a>/);
assert.match(html, /<a href="#false-confirmation-desk" id="copy-lamp-link" hidden data-hover>02τ \/ 误准灯<\/a>/);
assert.match(html, /<a href="#witness-carbon-archive" id="copy-carbon-link" hidden data-hover>02υ \/ 复写库<\/a>/);
assert.ok(html.includes('id="cancellation-copy-memory"'), "remembrance gains the single cancellation-copy memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* v48 状态契约：独立 key、pending 四字段严格匹配、lastScene/lastAction 互相匹配、与 v28–v47 零引用 */
assert.match(js, /const COPY_KEY = "goddead_v48_cancellation_copies";/);
const copyParseBlock = js.match(/const getCopy = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(copyParseBlock, "getCopy must exist");
assert.match(copyParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt copy storage must be safely repaired");
assert.match(copyParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(copyParseBlock[0], /COPY_ENTRIES\.includes\(raw\.entry\) \? raw\.entry : "direct"/, "illegal entry falls back to direct");
assert.match(copyParseBlock[0], /const acts = COPY_ACTIONS\[raw\.pending\.scene\];/, "pending scene must be whitelisted");
assert.match(copyParseBlock[0], /if \(act && raw\.pending\.target === act\.target && raw\.pending\.feedback === act\.feedback\) \{/, "pending target and feedback must strictly match the action table");
assert.match(copyParseBlock[0], /const lastScene = COPY_SCENES\.includes\(raw\.lastScene\) \? raw\.lastScene : "";/, "lastScene whitelisted");
assert.match(copyParseBlock[0], /const lastAction = lastScene && COPY_ACTIONS\[lastScene\]\[raw\.lastAction\] \? raw\.lastAction : "";/, "lastAction must match lastScene");
assert.match(copyParseBlock[0], /Math\.min\(COPY_NUM_CAP, Math\.floor\(copies\)\)/, "copies floored and capped");
assert.match(copyParseBlock[0], /raw\.marks\.filter\(\(m\) => COPY_MARKS\.includes\(m\)\)/, "illegal copy marks must be dropped");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47)/.test(copyParseBlock[0]), "copy state must not touch v28-v47");

/* 九动作：反馈/target/mark 逐字与 live scene 守卫、首选锁、pending 持久化、触发前清 pending、重返重播 */
assert.match(js, /screen: \{ btn: "#copy-screen-action-screen", target: "false-confirmation-desk", feedback: "空白屏亮得更白，中央浮出一枚不该获准的红点。", mark: "litFalseApprovalPoint" \}/);
assert.match(js, /paper: \{ btn: "#copy-screen-action-paper", target: "returned-address-cabinet", feedback: "纸带没有打印内容，却在卷曲处折出一个已经退回的地址格。", mark: "foldedReturnedAddressCell" \}/);
assert.match(js, /aperture: \{ btn: "#copy-screen-action-aperture", target: "unseated-listening-booth", feedback: "孔后没有眼睛，只有一只没坐人的听筒在记录屏幕的静电。", mark: "heardScreenStaticBelow" \}/);
assert.match(js, /lamp: \{ btn: "#copy-lamp-action-lamp", target: "witness-carbon-archive", feedback: "红灯确认了一次从未发生的注销；复写库立刻多出一张见证副本。", mark: "confirmedUnmadeCancellation" \}/);
assert.match(js, /seal: \{ btn: "#copy-lamp-action-seal", target: "counter-knock-gallery", feedback: "注销印压下去，桌面从下方回敲了一次。回敲廊把它收作入场凭据。", mark: "stampedCounterKnockPermit" \}/);
assert.match(js, /chute: \{ btn: "#copy-lamp-action-chute", target: "unclaimed-pneumatic-intake", feedback: "退纸槽没有底。落下的空白批件被气流托进无主气送井。", mark: "droppedApprovalIntoIntake" \}/);
assert.match(js, /sheet: \{ btn: "#copy-carbon-action-sheet", target: "blank-screen-underarchive", feedback: "复写纸揭开时仍是一片空白；屏底库却替它亮起。", mark: "revealedBlankCarbonCopy" \}/);
assert.match(js, /drawer: \{ btn: "#copy-carbon-action-drawer", target: "red-thread-registry", feedback: "抽屉只拉出半寸，所有副本的孔眼已经被同一根红线穿过。", mark: "threadedWitnessCopies" \}/);
assert.match(js, /card: \{ btn: "#copy-carbon-action-card", target: "absent-relief-locker", feedback: "见证卡上没有姓名，只有一格未到班的空位。缺班柜替它留门。", mark: "filedAbsentWitnessCard" \}/);
const runCopyBlock = js.match(/const runCopyAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runCopyBlock[0], /if \(currentScene !== COPY_SCENE_NAME\[sceneKey\]\) return;\s*if \(AutoAdvance\.has\("copy-" \+ sceneKey\)\) return;\s*const st = getCopy\(\);/, "off-scene copy actions are rejected before any state access, feedback or timer");
assert.match(runCopyBlock[0], /st\.pending = \{ scene: sceneKey, action: actionId, target: act\.target, feedback: act\.feedback \};/, "accepted action persists the full pending mapping");
assert.match(runCopyBlock[0], /s\.pending = null;\s*saveCopy\(s\);/, "pending cleared right before the timer fires");
const enterCopyBlock = js.match(/const enterCopy = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(enterCopyBlock[0], /if \(st\.pending && st\.pending\.scene === sceneKey\) \{/, "returning to the pending scene replays and re-arms");
assert.match(enterCopyBlock[0], /if \(responseEl\) responseEl\.textContent = p\.feedback;/, "the replayed feedback is the verbatim one");
assert.match(js, /注销留副：复写 \$\{st\.copies\} 次；屏底库 \/ 误准灯 \/ 复写库已见 \$\{seen\}\/3。/, "copy memory line verbatim");
assert.match(js, /paintCopyMemory\(\);/);
assert.match(js, /syncCopyLinks\(\);/);

/* ---------- v49 门前实感：v31 三场景卡片改图内原生热点 ---------- */
/* 11 个既有按钮各出现一次且位于对应 figure 内；三处旧 .branch-choices 容器已删除、无隐藏副本 */
const tactileScenes = {
  "peephole-chamber": ["peephole-choice-witness", "peephole-choice-listen", "peephole-choice-close"],
  "glyph-niche": ["glyph-choice-count", "glyph-choice-erase", "glyph-choice-blank"],
  "return-passage": ["return-choice-follow", "return-choice-knock", "return-choice-backward", "return-choice-registry", "return-choice-callback"],
};
for (const [sc, ids] of Object.entries(tactileScenes)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-forecourt" id="scene-${sc}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${sc}`);
  const figure = section[0].match(/<figure class="branch-figure forecourt-tactile-stage[\s\S]*?<\/figure>/);
  assert.ok(figure, `${sc} must keep a relative tactile stage figure`);
  assert.ok(!section[0].includes("branch-choices"), `${sc} must drop the old card list container`);
  assert.match(figure[0], /width="1536" height="1024"/, `${sc} tactile image keeps 1536x1024`);
  for (const id of ids) {
    assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `${id} must appear exactly once`);
    assert.ok(figure[0].includes(`id="${id}"`), `${id} must live inside the ${sc} figure`);
    assert.ok(figure[0].includes("forecourt-native-hotspot"), `${id} keeps the unified native hotspot class`);
    assert.ok(figure[0].includes("bb-title") && figure[0].includes("bb-hint"), `${id} keeps its original child texts`);
    assert.ok(figure[0].includes('class="bb-short" aria-hidden="true"'), `${id} carries an aria-hidden short visual label`);
  }
}
for (const short of ["黑镜", "听音管", "眼睑", "刻痕", "第七号", "空白牌", "脚印", "门环", "远门", "值班证", "电话"]) {
  assert.ok(html.includes(`<span class="bb-short" aria-hidden="true">${short}</span>`), `missing short label ${short}`);
}
assert.match(css, /\.forecourt-native-hotspot \.bb-title \{[\s\S]*?clip: rect\(0 0 0 0\);/, "mobile keeps the full title in the accessibility tree while visually hidden");
assert.match(css, /@media \(min-width: 721px\) \{[\s\S]*?\.forecourt-native-hotspot:hover \.bb-hint,/, "bb-hint expands on desktop only");
for (const legacy of ["peephole-choices", "glyph-choices", "return-choices"]) {
  assert.ok(!html.includes(`id="${legacy}"`), `legacy card container #${legacy} must be gone, not hidden`);
}
for (const cls of ["peephole-spot-witness", "peephole-spot-listen", "peephole-spot-close", "glyph-spot-count", "glyph-spot-erase", "glyph-spot-blank", "return-spot-follow", "return-spot-knock", "return-spot-backward", "return-spot-registry", "return-spot-callback"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}
assert.match(css, /\.forecourt-tactile-stage \{\s*position: relative;\s*aspect-ratio: 3 \/ 2;/, "tactile stage keeps a stable 3:2 ratio");
assert.match(css, /\.forecourt-native-hotspot \{[\s\S]*?min-width: 44px;\s*min-height: 44px;/, "native hotspots keep >=44px touch targets");
assert.ok(!js.includes("goddead_v49"), "v49 must not introduce any localStorage key");
/* 既有逻辑锚点不变：FORECOURT_META / FLOOR_ENTRY_META / callbackEntryBtn 逐字 */
assert.match(js, /"return-passage": \{ btn: "#return-choice-registry", entry: "passage", mark: "caughtTomorrowPermit", responseEl: "#return-response", response: "墙缝吐出一张盖着明日日期的值班证，背面写着无号层。", target: "night-shift-registry" \}/);
assert.match(js, /const callbackEntryBtn = \$\("#return-choice-callback"\);/);
assert.match(js, /answeredLateWallCall/);

/* ---------- v50 副楼实感：v32 三副楼卡片改图内原生热点 ---------- */
/* 三张新 tactile 位图存在且被引用；三张冻结源 PNG 保留 */
for (const asset of ["assets/annex-eyelid-tactile.webp", "assets/annex-vestibule-tactile.webp", "assets/annex-stairwell-tactile.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["design-references/source-v50-annex-eyelid-tactile.png", "design-references/source-v50-annex-vestibule-tactile.png", "design-references/source-v50-annex-stairwell-tactile.png"]) {
  await access(new URL(src, root));
}
/* 13 个既有按钮各出现一次且位于对应 figure 内；三处旧 .branch-choices 容器已删除、无隐藏副本 */
const annexTactileScenes = {
  "eyelid-archive": ["eyelid-choice-search", "eyelid-choice-listen", "eyelid-choice-file", "eyelid-choice-review"],
  "unnumbered-vestibule": ["vestibule-choice-tenth", "vestibule-choice-print", "vestibule-choice-exit", "vestibule-choice-review", "vestibule-choice-floor"],
  "reverse-stairwell": ["stairwell-choice-climb", "stairwell-choice-zeroth", "stairwell-choice-lookback", "stairwell-choice-review"],
};
for (const [sc, ids] of Object.entries(annexTactileScenes)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-annex" id="scene-${sc}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${sc}`);
  const figure = section[0].match(/<figure class="branch-figure forecourt-tactile-stage[\s\S]*?<\/figure>/);
  assert.ok(figure, `${sc} must keep a relative tactile stage figure`);
  assert.ok(!section[0].includes("branch-choices"), `${sc} must drop the old card list container`);
  assert.match(figure[0], /width="1536" height="1024"/, `${sc} tactile image keeps 1536x1024`);
  for (const id of ids) {
    assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `${id} must appear exactly once`);
    assert.ok(figure[0].includes(`id="${id}"`), `${id} must live inside the ${sc} figure`);
    assert.ok(figure[0].includes("forecourt-native-hotspot"), `${id} keeps the unified native hotspot class`);
    assert.ok(figure[0].includes("bb-title") && figure[0].includes("bb-hint"), `${id} keeps its original child texts`);
    assert.ok(figure[0].includes('class="bb-short" aria-hidden="true"'), `${id} carries an aria-hidden short visual label`);
  }
}
for (const short of ["摸索", "听盒", "归影", "复核", "第十门", "指印", "无号出口", "送审", "地下层", "向上", "第零级", "回望", "申报"]) {
  assert.ok(html.includes(`<span class="bb-short" aria-hidden="true">${short}</span>`), `missing short label ${short}`);
}
for (const legacy of ["eyelid-choices", "vestibule-choices", "stairwell-choices"]) {
  assert.ok(!html.includes(`id="${legacy}"`), `legacy card container #${legacy} must be gone, not hidden`);
}
for (const cls of ["eyelid-spot-search", "eyelid-spot-listen", "eyelid-spot-file", "eyelid-spot-review", "vestibule-spot-tenth", "vestibule-spot-print", "vestibule-spot-exit", "vestibule-spot-review", "vestibule-spot-floor", "stairwell-spot-climb", "stairwell-spot-zeroth", "stairwell-spot-lookback", "stairwell-spot-review"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}
assert.ok(!js.includes("goddead_v50"), "v50 must not introduce any localStorage key");
/* v32 业务锚点不变：九动作目的地、三复核入口、v35 地下层入口逐字 */
assert.match(js, /searchedSealedSight: \{ btn: "#eyelid-choice-search", target: "unnumbered-vestibule", response: "抽屉里没有照片，只有一扇尚未编号的门。" \}/);
assert.match(js, /"eyelid-archive": \{ btn: "#eyelid-choice-review", entry: "eyelid", mark: "sentEyeForReview", response: "没有睁开的眼被装进黑色证物袋，送去复核。" \}/);
assert.match(js, /"unnumbered-vestibule": \{ btn: "#vestibule-choice-floor", entry: "vestibule", mark: "pressedMissingBasementFloor", responseEl: "#vestibule-response", response: "按钮没有下沉。整座前厅却往上抬了一层。" \}/);

/* ---------- v51 副楼三债：见证/失号/逆行三条倾向值与三个阈值异常 ---------- */
/* 三张 v51 变体正式图存在且被引用（JS 阈值切换），三张冻结源 PNG 保留 */
for (const asset of ["assets/annex-eyelid-witness.webp", "assets/annex-vestibule-tenth.webp", "assets/annex-stairwell-double.webp"]) {
  await access(new URL(asset, root));
  assert.ok(js.includes(asset), `${asset} must be referenced by the v51 anomaly swap`);
}
for (const src of ["design-references/source-v51-annex-eyelid-witness.png", "design-references/source-v51-annex-vestibule-tenth.png", "design-references/source-v51-annex-stairwell-double.png"]) {
  await access(new URL(src, root));
}
/* 独立容错状态：新 key、上限 9、阈值 3、坏 JSON/数组归一、unlocked 布尔解析 */
assert.match(js, /const DEBTS_KEY = "goddead_v51_annex_debts";/);
assert.match(js, /const DEBTS_CAP = 9;/);
assert.match(js, /const DEBTS_THRESHOLD = 3;/);
const debtsParseBlock = js.match(/const getDebts = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(debtsParseBlock, "getDebts must exist");
assert.match(debtsParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt debts storage must be safely repaired");
assert.match(debtsParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type debts storage must fall back");
assert.match(debtsParseBlock[0], /Math\.min\(DEBTS_CAP, Math\.floor\(n\)\)/, "debts must be clamped to the cap");
assert.match(debtsParseBlock[0], /unlocked\[s\] = Boolean\(raw\.unlocked && raw\.unlocked\[s\] === true\)/, "unlocked flags must parse as strict booleans");
assert.ok(!/goddead_v(28|29|30|31|32|33|35)/.test(debtsParseBlock[0]), "v51 state must not touch earlier keys");
/* 13 个既有动作的债值映射逐字（见证 5 / 失号 4 / 逆行 4） */
const debtMapBlock = js.match(/const DEBT_BY_BTN = \{[\s\S]*?\};/);
assert.ok(debtMapBlock, "DEBT_BY_BTN must exist");
const expectedDebtMap = {
  "#eyelid-choice-listen": "witness", "#eyelid-choice-review": "witness", "#vestibule-choice-print": "witness", "#stairwell-choice-lookback": "witness", "#stairwell-choice-review": "witness",
  "#eyelid-choice-search": "unnumbered", "#eyelid-choice-file": "unnumbered", "#vestibule-choice-tenth": "unnumbered", "#vestibule-choice-exit": "unnumbered",
  "#vestibule-choice-review": "reverse", "#vestibule-choice-floor": "reverse", "#stairwell-choice-climb": "reverse", "#stairwell-choice-zeroth": "reverse",
};
for (const [btn, kind] of Object.entries(expectedDebtMap)) {
  assert.ok(debtMapBlock[0].includes(`"${btn}": "${kind}"`), `debt mapping ${btn} -> ${kind}`);
}
assert.equal((debtMapBlock[0].match(/": "witness"/g) || []).length, 5, "witness debt takes exactly 5 actions");
assert.equal((debtMapBlock[0].match(/": "unnumbered"/g) || []).length, 4, "unnumbered debt takes exactly 4 actions");
assert.equal((debtMapBlock[0].match(/": "reverse"/g) || []).length, 4, "reverse debt takes exactly 4 actions");
/* 记账只在首选锁接受后发生、上限短路、三处挂钩逐字 */
assert.match(js, /if \(st\.debts\[kind\] >= DEBTS_CAP\) return;/);
const chooseAnnexBlockV51 = js.match(/const chooseAnnex = \(sceneKey, mark\) => \{[\s\S]*?\n  \};/);
assert.match(chooseAnnexBlockV51[0], /addAnnexDebt\(choice\.btn\);/, "annex actions feed the debts after the first-lock accepts");
assert.match(js, /saveReview\(st\);\s*paintReviewEntry\(sceneKey\);\s*addAnnexDebt\(meta\.btn\);/, "review entries feed the debts");
assert.match(js, /saveFloor\(st\);\s*paintFloorEntry\(sceneKey\);\s*addAnnexDebt\(meta\.btn\);/, "floor entry feeds the debts");
assert.match(js, /const enterAnnex = \(sceneKey\) => \{[\s\S]*?syncAnnexDebts\(sceneKey\);/, "entering an annex room restores debt UI atomically");
/* 三个阈值异常：变体图、异常热点（新增分支）、逐字反馈、目的地、播报 */
for (const frag of [
  '"#eyelid-debt-witness"', '"#vestibule-debt-tenth"', '"#stairwell-debt-double"',
  '"#eyelid-choice-search"', '"#vestibule-choice-exit"', '"#stairwell-choice-lookback"',
  "三只眼睛没有看你。它们在核对你身后站着几个你。",
  "你没有推门。门从你的编号里向内打开。",
  "镜中的脚先落地，你的脚才想起该抬起来。",
  'target: "unnumbered-vestibule"', 'target: "reverse-stairwell"', 'target: "eyelid-archive"',
]) assert.ok(js.includes(frag), `missing v51 fragment: ${frag}`);
/* 越权保护：直接 hash / 合成点击在 2 时一律无效；首选锁共用 */
const chooseDebtBlock = js.match(/const chooseDebtAnomaly = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.ok(chooseDebtBlock, "chooseDebtAnomaly must exist");
assert.match(chooseDebtBlock[0], /if \(!\(st\.unlocked\[sceneKey\] === true && st\.debts\[meta\.debt\] >= DEBTS_THRESHOLD\)\) return;/, "anomaly trigger must validate the live threshold state");
assert.match(chooseDebtBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "anomaly trigger shares the scene first-lock");
/* 阈值原子切换：图像/异常热点/figure 描述同拍；未解锁 hidden；
   13 个旧热点全部保留——不存在 baseBtn 元数据，syncAnnexDebts 不再隐藏任何旧热点 */
const syncDebtBlock = js.match(/const syncAnnexDebts = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.ok(syncDebtBlock, "syncAnnexDebts must exist");
assert.match(syncDebtBlock[0], /if \(on\) anomaly\.removeAttribute\("hidden"\);\s*else \{ anomaly\.setAttribute\("hidden", ""\); anomaly\.setAttribute\("aria-pressed", "false"\); \}/);
assert.ok(!/baseBtn|base\.setAttribute|base\.removeAttribute/.test(syncDebtBlock[0]), "unlocked state must not hide any original hotspot");
const debtAnomalyBlock = js.match(/const DEBT_ANOMALY = \{[\s\S]*?\n  \};/);
assert.ok(debtAnomalyBlock, "DEBT_ANOMALY must exist");
assert.ok(!debtAnomalyBlock[0].includes("baseBtn"), "DEBT_ANOMALY must not reference a replaced base hotspot");
/* 刻痕牌：0–9 个独立刻痕元素的正规进度组件，禁止文本符号/emoji */
assert.ok(!js.includes('"│".repeat'), "debt ticks must not be rendered as repeated text glyphs");
const paintPlateBlock = js.match(/const paintDebtPlate = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(paintPlateBlock, "paintDebtPlate must exist");
assert.match(paintPlateBlock[0], /for \(let i = 0; i < DEBTS_CAP; i \+= 1\)/, "each row builds exactly DEBTS_CAP independent tick elements");
assert.match(paintPlateBlock[0], /tick\.className = "dp-tick";/, "ticks are independent elements");
assert.match(paintPlateBlock[0], /classList\.toggle\("dp-tick-on", i < n\)/, "the first n ticks light up");
assert.match(paintPlateBlock[0], /`\$\{DEBT_CN\[k\]\} \$\{n\} 道刻痕，上限 \$\{DEBTS_CAP\} 道`/, "row aria-label states the exact count and cap");
/* DOM：三个异常热点 hidden 出厂、短标签 aria-hidden、三牌三行 + aria-live */
for (const [id, short] of [["eyelid-debt-witness", "让它们看清"], ["vestibule-debt-tenth", "进入未编号的第十门"], ["stairwell-debt-double", "走进倒置的阶井"]]) {
  assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `${id} must appear exactly once`);
  assert.match(html, new RegExp(`id="${id}" type="button" aria-pressed="false" data-hover hidden`), `${id} ships hidden until its threshold`);
  assert.ok(html.includes(`<span class="bb-short" aria-hidden="true">${short}</span>`), `missing anomaly short label ${short}`);
}
for (const [sc, id] of [["eyelid-archive", "eyelid-debt-witness"], ["unnumbered-vestibule", "vestibule-debt-tenth"], ["reverse-stairwell", "stairwell-debt-double"]]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-annex" id="scene-${sc}"[\\s\\S]*?<\\/section>`));
  const figure = section[0].match(/<figure class="branch-figure forecourt-tactile-stage[\s\S]*?<\/figure>/);
  assert.ok(figure[0].includes(`id="${id}"`), `${id} must live inside the ${sc} figure`);
  assert.ok(figure[0].includes("debt-plate"), `${sc} must carry its debt tally plate inside the figure`);
  assert.ok(figure[0].includes('class="dp-live"') && figure[0].includes('aria-live="polite"'), `${sc} plate carries an aria-live debt announcer`);
  assert.equal((figure[0].match(/data-debt-ticks=/g) || []).length, 3, `${sc} plate shows all three debt rows`);
}
/* CSS：hidden 覆盖、刻痕牌、三个异常定位、reduced-motion 禁用抖动与呼吸 */
assert.match(css, /\.forecourt-native-hotspot\[hidden\] \{\s*display: none;\s*\}/, "hidden must beat the hotspot flex display");
assert.match(css, /\.debt-plate \{/);
for (const cls of ["eyelid-debt-spot-witness", "vestibule-debt-spot-tenth", "stairwell-debt-spot-double"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}
/* 刻痕进度组件样式：独立刻痕元素 + 点亮态 */
assert.match(css, /\.dp-tick \{/, "css missing the independent tick element");
assert.match(css, /\.dp-tick\.dp-tick-on \{/, "css missing the lit tick state");
/* 外框/内层分区逐字坐标（桌面）：三对同物热点严格不重叠 */
assert.match(css, /\.eyelid-spot-search \{ top: 49\.5%; left: 39%; width: 4\.5%; height: 20%; \}/, "search keeps the drawer-cabinet outer frame band");
assert.match(css, /\.eyelid-debt-spot-witness \{ top: 50\.5%; left: 45\.5%; width: 13\.5%; height: 18\.5%; \}/, "witness anomaly covers the inner eye drawers");
assert.match(css, /\.vestibule-spot-exit \{ top: 35\.5%; left: 43\.5%; width: 11%; height: 9\.5%; \}/, "exit keeps the door outer lintel band");
assert.match(css, /\.vestibule-debt-spot-tenth \{ top: 45\.5%; left: 47%; width: 4\.5%; height: 16%; \}/, "tenth anomaly covers the inner tenth frame");
assert.match(css, /\.stairwell-spot-lookback \{ top: 4%; left: 18\.5%; width: 5%; height: 34%; \}/, "lookback keeps the mirror outer frame band");
assert.match(css, /\.stairwell-debt-spot-double \{ top: 6%; left: 25%; width: 5\.5%; height: 31%; \}/, "double anomaly covers the inner reflected stairwell");
/* 移动端 44px 放大后三对热点改锚点错开 */
for (const rule of [
  /\.eyelid-spot-search \{ left: 37\.5%; \}/,
  /\.eyelid-debt-spot-witness \{ left: 51%; \}/,
  /\.vestibule-spot-exit \{ top: 40%; left: 52%; width: 12\.5%; height: 20%; \}/,
  /\.vestibule-debt-spot-tenth \{ top: 40%; left: 38\.5%; width: 12\.5%; height: 20%; \}/,
  /\.stairwell-spot-lookback \{ height: 19%; \}/,
  /\.stairwell-debt-spot-double \{ top: 24\.5%; left: 18\.5%; width: 10\.5%; height: 19%; \}/,
]) assert.match(css, rule, `css missing mobile stagger rule ${rule}`);
assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.debt-plate\.dp-stir,\s*\.debt-anomaly \{ animation: none; \}\s*\}/, "reduced-motion disables plate stir and anomaly breathing");
/* v51 不引入其它 localStorage key */
assert.ok(!(js.includes("goddead_v51_annex_debts") === false), "v51 key present");
assert.equal((js.match(/goddead_v51/g) || []).length, 1, "v51 introduces exactly one storage key");

/* ---------- v52 副楼三债结算：容量合签 + 结算所三印 + 三间结果房 ---------- */
/* 四张 v52 正式图存在且被引用，四张冻结源 PNG 保留 */
for (const asset of ["assets/annex-debt-clearinghouse.webp", "assets/unreturned-witness-gallery.webp", "assets/registry-before-zero.webp", "assets/descending-appeals-stair.webp"]) {
  await access(new URL(asset, root));
  assert.match(html, new RegExp(asset.replace(/[/.-]/g, "\\$&")), `${asset} must be referenced`);
}
for (const src of ["design-references/source-v52-annex-debt-clearinghouse.png", "design-references/source-v52-unreturned-witness-gallery.png", "design-references/source-v52-registry-before-zero.png", "design-references/source-v52-descending-appeals-stair.png"]) {
  await access(new URL(src, root));
}
/* 独立容错状态：新 key、坏 JSON/数组归一、数值 clamp、白名单、派生字段重算 */
assert.match(js, /const SETTLE_KEY = "goddead_v52_annex_settlement";/);
assert.equal((js.match(/goddead_v52/g) || []).length, 1, "v52 introduces exactly one storage key");
const settleParseBlock = js.match(/const getSettlement = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(settleParseBlock, "getSettlement must exist");
assert.match(settleParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt settlement storage must be safely repaired");
assert.match(settleParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type settlement storage must fall back");
assert.match(settleParseBlock[0], /Math\.min\(SETTLE_NUM_CAP, Math\.floor\(n\)\)/, "counters must be clamped");
/* allocations 归一：长度<=3、白名单、每类不超实时容量、合法连续前缀（首非法项截断） */
assert.match(settleParseBlock[0], /if \(allocations\.length >= 3\) break;/, "allocations cap at three");
assert.match(settleParseBlock[0], /if \(!SETTLE_KINDS\.includes\(a\)\) break;/, "allocations are whitelisted");
assert.match(settleParseBlock[0], /if \(allocations\.filter\(\(x\) => x === a\)\.length >= cap\[a\]\) break;/, "per-kind live capacity enforced");
/* settled 派生重算：长度恰 3 且 outcome 与实时多数一致，否则降级 */
assert.match(settleParseBlock[0], /let settled = raw\.settled === true && allocations\.length === 3 && outcome !== "" && settleOutcomeOf\(allocations\) === outcome;/, "settled is re-derived, never trusted");
assert.match(settleParseBlock[0], /if \(allocations\.length >= 3\) allocations = allocations\.slice\(0, 2\);/, "illegal unsettled length-3 repaired");
/* pending 两种严格形态逐字段校验 */
assert.match(settleParseBlock[0], /p\.type === "settle" && settled && p\.outcome === outcome && p\.target === SETTLE_OUTCOME_TARGET\[outcome\]/, "settle pending must match the fixed outcome table");
assert.match(settleParseBlock[0], /act && p\.target === act\.target && p\.feedback === act\.feedback/, "action pending must match the action table field-by-field");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51)/.test(settleParseBlock[0]), "v52 state must not touch earlier keys");
/* 容量只读 v51：floor(debt / 3)，每类 0..3，总容量 >= 3 解锁；v52 全模块不写 v42 */
const capBlock = js.match(/const settleCapacity = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(capBlock, "settleCapacity must exist");
assert.match(capBlock[0], /cap\[k\] = Math\.floor\(debts\[k\] \/ 3\);/, "capacity is floor(v51 debt / 3), read-only");
const settleModule = js.match(/v52 副楼三债结算[\s\S]*?\/\* =+\s*\n     v33 异常复核科/);
assert.ok(settleModule, "v52 module must sit between v51 and v33");
assert.ok(!/DRIFT_KEY|saveDrift|getDrift|goddead_v42/.test(settleModule[0]), "v52 must not read or write v42 drift state");
assert.ok(!/saveDebts|DEBTS_KEY/.test(settleModule[0].replace(/const SETTLE_KEY[\s\S]*?;/, "")), "v52 must never write the v51 debts key");
/* 四路结算落点逐字（含 balanced → 现有 #protocol-drift） */
for (const frag of [
  'witness: "unreturned-witness-gallery"',
  'unnumbered: "registry-before-zero"',
  'reverse: "descending-appeals-stair"',
  'balanced: "protocol-drift"',
  '"蜡筒没有录下声音，只把你听见它的那一刻倒放了一遍。"',
  '"印章闭着眼落下，复写纸却多出一位未曾到场的见证人。"',
  '"椅背没有映出脸。档案柜却为你的后脑开了三只眼。"',
  '"牌面比零更早，所以所有数字都从它身后绕行。"',
  '"压印机落下时没有留下字，只把空白压得更深了一层。"',
  '"门没有编号。你跨过去以后，身后的楼层先被注销。"',
  '"镜里的你先走完了楼梯，才回头等你的第一步。"',
  '"法槌从桌底向上落下，把你的归路判成了一次上诉。"',
  '"钟体摇了三次。病房里每张床却同时回答了第四声。"',
  '"三债同签。结算所开门，点清你带来的刻痕。"',
]) assert.ok(js.includes(frag), `missing v52 fragment: ${frag}`);
/* 九个结果动作的精确目标逐字 */
for (const frag of [
  'horn: { btn: "#settle-gallery-action-horn", target: "unseated-listening-booth"',
  'seal: { btn: "#settle-gallery-action-seal", target: "witness-carbon-archive"',
  'chair: { btn: "#settle-gallery-action-chair", target: "eyelid-archive"',
  'plate: { btn: "#settle-registry-action-plate", target: "glyph-niche"',
  'press: { btn: "#settle-registry-action-press", target: "blank-receipt-press"',
  'door: { btn: "#settle-registry-action-door", target: "unnumbered-floor"',
  'mirror: { btn: "#settle-appeals-action-mirror", target: "reverse-stairwell"',
  'gavel: { btn: "#settle-appeals-action-gavel", target: "return-audit"',
  'bell: { btn: "#settle-appeals-action-bell", target: "bellless-ward"',
]) assert.ok(js.includes(frag), `missing v52 action mapping: ${frag}`);
/* 守卫：结算所容量守卫回退档案室；结果房合法结果/历史 visit 准入，否则回结算所；
   v31 glyph-niche 窄例外只放行 registry+plate 这一次合法落点 */
const resolveBlockV52 = js.match(/const resolveScene = \(name\) => \{[\s\S]*?\n  \};/);
assert.match(resolveBlockV52[0], /if \(target === "annex-clearinghouse" && !settleUnlocked\(\)\) target = "eyelid-archive";/, "clearinghouse requires total capacity >= 3");
assert.match(resolveBlockV52[0], /settleGuard\.settled && settleGuard\.outcome === SETTLE_RESULT_OUTCOME\[rk\]\) \|\| settleGuard\.visited\[rk\]\)\) target = "annex-clearinghouse";/, "result rooms admit only the matching legal outcome or a past visit");
assert.match(resolveBlockV52[0], /target === "glyph-niche" && settleGuard\.lastScene === "registry" && settleGuard\.lastAction === "plate"/, "the glyph-niche exception is narrowed to the v52 plate landing");
/* 投入处理器：live scene + 首选锁 + settled/长度/实时容量三重拒绝，同拍不得重复计数 */
const depositBlock = js.match(/const depositSettlement = \(kind\) => \{[\s\S]*?\n  \};/);
assert.match(depositBlock[0], /if \(currentScene !== "annex-clearinghouse"\) return;/, "deposit validates the live scene first");
assert.match(depositBlock[0], /if \(AutoAdvance\.has\("annex-clearinghouse"\)\) return;/, "deposit shares the scene first-lock");
assert.match(depositBlock[0], /if \(st\.settled\) return;/);
assert.match(depositBlock[0], /if \(st\.allocations\.length >= 3\) return;/);
assert.match(depositBlock[0], /if \(used >= cap\[kind\]\) return;/, "over-capacity deposits are rejected");
assert.match(depositBlock[0], /st\.history\[outcome\] = Math\.min\(SETTLE_NUM_CAP, st\.history\[outcome\] \+ 1\);/, "history counts once at settle time");
/* 入口：live scene + 实时总容量 + 首选锁；已结算再点开启新 cycle 且保留历史 */
const entryBlock = js.match(/const chooseSettleEntry = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(entryBlock[0], /if \(currentScene !== sceneKey\) return;/);
assert.match(entryBlock[0], /if \(!settleUnlocked\(\)\) return;/, "synthetic clicks below the threshold are inert");
assert.match(entryBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "entry shares the annex scene first-lock");
assert.match(entryBlock[0], /st\.cycle = Math\.min\(SETTLE_NUM_CAP, st\.cycle \+ 1\);\s*st\.allocations = \[\];\s*st\.settled = false;\s*st\.outcome = "";/, "a settled cycle restarts fresh, history kept");
/* 九个结果动作处理器：live scene 校验先于一切副作用 */
const runBlockV52 = js.match(/const runSettleAction = \(sceneKey, actionId\) => \{[\s\S]*?\n  \};/);
assert.match(runBlockV52[0], /if \(currentScene !== SETTLE_SCENE_NAME\[sceneKey\]\) return;/, "result actions validate the live scene first");
assert.match(runBlockV52[0], /if \(AutoAdvance\.has\("settle-" \+ sceneKey\)\) return;/, "result actions share the scene first-lock");
/* DOM：四场景、图内热点、无卡片墙、无继续按钮、3:2 位图 */
const settleSceneIds = {
  "annex-clearinghouse": ["settle-deposit-witness", "settle-deposit-unnumbered", "settle-deposit-reverse"],
  "unreturned-witness-gallery": ["settle-gallery-action-horn", "settle-gallery-action-seal", "settle-gallery-action-chair"],
  "registry-before-zero": ["settle-registry-action-plate", "settle-registry-action-press", "settle-registry-action-door"],
  "descending-appeals-stair": ["settle-appeals-action-mirror", "settle-appeals-action-gavel", "settle-appeals-action-bell"],
};
for (const [sc, ids] of Object.entries(settleSceneIds)) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-settlement" id="scene-${sc}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${sc}`);
  const figure = section[0].match(/<figure class="branch-figure forecourt-tactile-stage[\s\S]*?<\/figure>/);
  assert.ok(figure, `${sc} must use the stable 3:2 tactile stage`);
  assert.ok(!section[0].includes("branch-choices"), `${sc} must not have a below-figure card wall`);
  assert.ok(!section[0].includes("继续"), `${sc} must not have a continue button`);
  assert.match(figure[0], /width="1536" height="1024"/, `${sc} keeps the 1536x1024 bitmap`);
  for (const id of ids) {
    assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `${id} must appear exactly once`);
    assert.ok(figure[0].includes(`id="${id}"`), `${id} must live inside the ${sc} figure`);
    assert.ok(figure[0].includes("forecourt-native-hotspot"), `${id} keeps the unified native hotspot class`);
  }
}
for (const short of ["投见证", "投失号", "投逆行", "听声筒", "闭眼章", "镜面席", "零前牌", "压底册", "无号门", "反阶镜", "倒法槌", "无声钟"]) {
  assert.ok(html.includes(`<span class="bb-short" aria-hidden="true">${short}</span>`), `missing short label ${short}`);
}
/* 结算所三行实体凹槽：图内 aside、每行 3 个独立槽元素、aria 计数逐字 */
const houseSection = html.match(/<section class="scene scene-branch scene-settlement" id="scene-annex-clearinghouse"[\s\S]*?<\/section>/);
const houseFigure = houseSection[0].match(/<figure[\s\S]*?<\/figure>/);
assert.ok(houseFigure[0].includes('class="settle-tray"'), "clearinghouse must carry the physical slot tray inside the figure");
assert.equal((houseFigure[0].match(/data-settle-slots=/g) || []).length, 3, "tray shows all three slot rows");
assert.equal((houseFigure[0].match(/class="st-slot"/g) || []).length, 9, "tray builds exactly 3x3 independent slot elements");
/* 三个「合签三债」入口：hidden 出厂、各出现一次、嵌在对应刻痕牌内 */
for (const [sc, id] of [["eyelid-archive", "eyelid-settle-entry"], ["unnumbered-vestibule", "vestibule-settle-entry"], ["reverse-stairwell", "stairwell-settle-entry"]]) {
  assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `${id} must appear exactly once`);
  assert.match(html, new RegExp(`id="${id}" type="button" aria-pressed="false" data-hover hidden`), `${id} ships hidden below the threshold`);
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-annex" id="scene-${sc}"[\\s\\S]*?<\\/section>`));
  const plate = section[0].match(/<aside class="debt-plate"[\s\S]*?<\/aside>/);
  assert.ok(plate && plate[0].includes(`id="${id}"`), `${id} must live inside the ${sc} debt plate`);
  assert.ok(plate[0].includes("合签三债"), `${id} carries the verbatim entry label`);
}
/* 目录四项与 Remembrance 单行（仍八张统计卡） */
for (const [id, label] of [["settle-house-link", "02φ / 三债结算"], ["settle-gallery-link", "02χ / 无归见证"], ["settle-registry-link", "02ψ / 零前登记"], ["settle-appeals-link", "02ω / 倒诉阶"]]) {
  assert.ok(html.includes(`id="${id}" hidden data-hover>${label}</a>`), `directory entry missing: ${label}`);
}
assert.ok(html.includes('id="settlement-memory"'), "remembrance must carry the v52 memory line");
assert.match(js, /paintSettlementMemory\(\);/, "remembrance paints the v52 memory line");
/* CSS：入口、凹槽、12 条定位 class */
assert.match(css, /\.debt-settle-entry \{/);
assert.match(css, /\.debt-settle-entry\[hidden\] \{\s*display: none;\s*\}/, "entry hidden must beat layout");
assert.match(css, /\.settle-tray \{/);
assert.match(css, /\.st-slot\.st-slot-on \{/, "css missing the lit slot state");
for (const cls of ["settle-spot-witness", "settle-spot-unnumbered", "settle-spot-reverse", "gallery-spot-horn", "gallery-spot-seal", "gallery-spot-chair", "registry-spot-plate", "registry-spot-press", "registry-spot-door", "appeals-spot-mirror", "appeals-spot-gavel", "appeals-spot-bell"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}

/* ---------- v53 归路信念：跨轮计分三态变异 + 阈值机关 + 翻转核验牌 ---------- */
/* 六张 v53 变异正式图存在且被引用（JS 变异切换），六张冻结源 PNG 保留 */
for (const asset of ["assets/v53-echo-official-belief.webp", "assets/v53-echo-sensory-belief.webp", "assets/v53-vein-official-belief.webp", "assets/v53-vein-sensory-belief.webp", "assets/v53-confession-official-belief.webp", "assets/v53-confession-sensory-belief.webp"]) {
  await access(new URL(asset, root));
  assert.ok(js.includes(asset), `${asset} must be referenced by the v53 variant swap`);
}
for (const src of ["design-references/source-v53-echo-official-belief.png", "design-references/source-v53-echo-sensory-belief.png", "design-references/source-v53-vein-official-belief.png", "design-references/source-v53-vein-sensory-belief.png", "design-references/source-v53-confession-official-belief.png", "design-references/source-v53-confession-sensory-belief.png"]) {
  await access(new URL(src, root));
}
/* 独立容错状态：新 key 全仓库唯一、坏 JSON/数组归一、数值 clamp、白名单、派生重算 */
assert.match(js, /const BELIEF_KEY = "goddead_v53_route_belief";/);
assert.equal((js.match(/goddead_v53/g) || []).length, 1, "v53 introduces exactly one storage key");
const beliefParseBlock = js.match(/const getBelief = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(beliefParseBlock, "getBelief must exist");
assert.match(beliefParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt belief storage must be safely repaired");
assert.match(beliefParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type belief storage must fall back");
assert.match(beliefParseBlock[0], /Math\.min\(BELIEF_NUM_CAP, Math\.floor\(n\)\)/, "belief counters must be clamped 0..9999");
assert.match(beliefParseBlock[0], /BELIEF_ROUTE_META\[r\]\.choiceSide\[rr\.lastChoice\] \? rr\.lastChoice : ""/, "illegal lastChoice is cleared");
assert.match(beliefParseBlock[0], /p\.kind === "threshold" && BELIEF_ROUTES\.includes\(p\.route\) && BELIEF_SIDES\.includes\(p\.side\)/, "threshold pending is whitelisted field-by-field");
assert.match(beliefParseBlock[0], /p\.target === target && p\.feedback === meta\.feedback/, "threshold pending target and verbatim feedback are recomputed");
assert.match(beliefParseBlock[0], /p\.kind === "drift" && p\.target === BELIEF_FLIP\.target && p\.feedback === BELIEF_FLIP\.feedback/, "drift pending keeps only the strict shape");
assert.match(beliefParseBlock[0], /history = history\.slice\(-BELIEF_HISTORY_CAP\);/, "history is bounded to the last 16 valid entries");
assert.match(beliefParseBlock[0], /globalOfficial \+= routes\[r\]\.official;/, "global official is re-derived from the three routes");
assert.match(beliefParseBlock[0], /globalSensory \+= routes\[r\]\.sensory;/, "global sensory is re-derived from the three routes");
assert.match(beliefParseBlock[0], /variants\[r\] = beliefVariantOf\(routes\[r\]\);/, "per-route variant is re-derived, never trusted");
assert.match(beliefParseBlock[0], /pendingTarget: pending \? pending\.target : ""/, "pendingTarget derives only from a validated pending");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52)/.test(beliefParseBlock[0]), "v53 state must not touch earlier keys");
/* 存盘收口：saveBelief 只持久化 canonical 五部分，派生字段永不落盘，history 裁到 ≤16 再存 */
const beliefSaveBlock = js.match(/const saveBelief = \(st\) => store\.set\(BELIEF_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(beliefSaveBlock, "saveBelief must persist an explicit canonical projection");
assert.match(beliefSaveBlock[0], /routes: st\.routes,/, "saveBelief persists routes");
assert.match(beliefSaveBlock[0], /contradiction: st\.contradiction,/, "saveBelief persists contradiction");
assert.match(beliefSaveBlock[0], /branches: st\.branches,/, "saveBelief persists branches");
assert.match(beliefSaveBlock[0], /pending: st\.pending,/, "saveBelief persists pending");
assert.match(beliefSaveBlock[0], /history: st\.history\.slice\(-BELIEF_HISTORY_CAP\),/, "saveBelief clamps history to <= 16 before persisting");
assert.ok(!/globalOfficial|globalSensory|variants|pendingTarget/.test(beliefSaveBlock[0]), "saveBelief must never persist derived fields");
/* 变异态：>= 2 且严格占优才变异，平局回中性 */
const beliefVariantBlock = js.match(/const beliefVariantOf = \(routeSt\) => \{[\s\S]*?\n  \};/);
assert.ok(beliefVariantBlock, "beliefVariantOf must exist");
assert.match(beliefVariantBlock[0], /if \(routeSt\.official >= 2 && routeSt\.official > routeSt\.sensory\) return "official";/, "official variant needs >= 2 and strict dominance");
assert.match(beliefVariantBlock[0], /if \(routeSt\.sensory >= 2 && routeSt\.sensory > routeSt\.official\) return "sensory";/, "sensory variant needs >= 2 and strict dominance");
assert.match(beliefVariantBlock[0], /return "neutral";/, "ties fall back to neutral");
/* 计分只挂在 v39 judgeAudit 接受点之后（order/decisions 写入并保存之后） */
const judgeAuditBlockV53 = js.match(/const judgeAudit = \(route, choiceKey\) => \{[\s\S]*?\n  \};/);
assert.match(judgeAuditBlockV53[0], /saveAudit\(st\);[\s\S]*?recordBeliefChoice\(route, choiceKey\);/, "belief scoring hooks in only after the v39 acceptance point");
const recordBeliefBlock = js.match(/const recordBeliefChoice = \(route, choiceKey\) => \{[\s\S]*?\n  \};/);
assert.match(recordBeliefBlock[0], /r\[side\] = Math\.min\(BELIEF_NUM_CAP, r\[side\] \+ 1\);/, "side counter increments once per accepted judgement");
assert.match(recordBeliefBlock[0], /if \(r\.lastChoice && r\.lastChoice !== choiceKey\) st\.contradiction = Math\.min\(BELIEF_NUM_CAP, st\.contradiction \+ 1\);/, "contradiction counts only a changed non-empty last choice");
assert.match(recordBeliefBlock[0], /r\.lastChoice = choiceKey;/, "last choice updates after the contradiction check");
assert.ok(!/getAudit|saveAudit|AUDIT_KEY/.test(recordBeliefBlock[0]), "belief scoring must not touch v39 state");
/* 阈值落点表与七条分支映射逐字 */
for (const frag of [
  'echo: { official: "counter-knock-gallery", sensory: "echo" }',
  'vein: { official: "bellless-ward", sensory: "vein" }',
  'confession: { official: "blank-name-cloakroom", sensory: "confession" }',
  'counterKnockGallery: "counter-knock-gallery"',
  'echoArchive: "echo"',
  'belllessWard: "bellless-ward"',
  'veinWell: "vein"',
  'blankNameCloakroom: "blank-name-cloakroom"',
  'confessionWeighing: "confession"',
  'protocolDrift: "protocol-drift"',
]) assert.ok(js.includes(frag), `missing v53 mapping: ${frag}`);
/* 阈值处理器：live scene + 实时重算非中性 + 共享 v39 first-lock；不算 v39 判断 */
const beliefThresholdBlock = js.match(/const chooseBeliefThreshold = \(route\) => \{[\s\S]*?\n  \};/);
assert.match(beliefThresholdBlock[0], /if \(currentScene !== meta\.scene\) return;/, "threshold validates the live scene first");
assert.match(beliefThresholdBlock[0], /if \(side === "neutral"\) return;/, "threshold rejects a neutral variant");
assert.match(beliefThresholdBlock[0], /if \(AutoAdvance\.has\("return-audit"\) \|\| AutoAdvance\.has\("return-audit-step"\)\) return;/, "threshold shares the v39 first-lock");
assert.match(beliefThresholdBlock[0], /st\.pending = \{ kind: "threshold", route, side, target, feedback: meta\[side\]\.feedback \};/, "threshold persists the strict pending shape");
assert.ok(!/getAudit|saveAudit|AUDIT_KEY/.test(beliefThresholdBlock[0]), "threshold must not touch v39 progress");
/* 翻转核验牌：live scene + 实时重算 contradiction >= 2 + 共享 first-lock */
const beliefFlipBlock = js.match(/const chooseBeliefFlip = \(\) => \{[\s\S]*?\n  \};/);
assert.match(beliefFlipBlock[0], /if \(currentScene !== "return-audit"\) return;/, "flip validates the live hub scene first");
assert.match(beliefFlipBlock[0], /if \(st\.contradiction < 2\) return;/, "flip recomputes the contradiction threshold");
assert.match(beliefFlipBlock[0], /if \(AutoAdvance\.has\("return-audit"\) \|\| AutoAdvance\.has\("return-audit-step"\)\) return;/, "flip shares the v39 first-lock");
assert.match(beliefFlipBlock[0], /st\.pending = \{ kind: "drift", target: BELIEF_FLIP\.target, feedback: BELIEF_FLIP\.feedback \};/, "flip persists the strict drift pending");
assert.ok(!/getAudit|saveAudit|AUDIT_KEY/.test(beliefFlipBlock[0]), "flip must not touch v39 progress");
/* reload 重播：合法 pending 精确重挂一次转场，不重复计 actions */
assert.match(js, /replayBeliefPending\(name\)/, "scene init replays a persisted belief pending");
/* v29 守卫：v53 窄例外只放行合法 pending 目标或历史已访问分支 */
const resolveBlockV53 = js.match(/const resolveScene = \(name\) => \{[\s\S]*?\n  \};/);
assert.match(resolveBlockV53[0], /beliefGuard\.pendingTarget !== target && !\(BELIEF_SCENE_BRANCH\[target\] && beliefGuard\.branches\[BELIEF_SCENE_BRANCH\[target\]\]\.visits > 0\)\) target = "corridor";/, "v29 guard gains the narrow v53 belief exception only");
assert.match(resolveBlockV53[0], /AUDIT_BRANCH_OUTCOME\[target\] !== auditGuardState\.outcome/, "the v39 outcome exception stays intact");
/* 逐字文案：六条阈值反馈、翻转反馈、六条变异 figure aria-label、统计名 */
for (const frag of [
  "铜盘转了一格。所有回声同时安静下来，像在等点名。",
  "喇叭里没有声音。只有你自己的吸气声，早了半拍。",
  "指针归零。闸机第一次承认自己也会累。",
  "表盘里不是血。是很多只贴上来听过的耳朵。",
  "铜牌背面有一枚验收章：此名未使用。",
  "秤盘下沉。你的忏悔被称了两遍，两遍不一样重。",
  "铜牌翻面。守则自己也开始漂移。",
  "回声岔廊守则变异：最近的门透出金边，廊心升起一座嵌铜盘的黑石台",
  "回声岔廊感官变异：右墙贴上巨型喇叭，红色声纹沿墙扩散",
  "检票闸守则变异：闸后缝隙更加苍白，中央表盘停在零",
  "检票闸感官变异：中央表盘涨成暗红，右侧脉管红得发亮",
  "寄存所守则变异：中央台上立起空白铜牌，两枚寄存牌并排静放",
  "寄存所感官变异：中央升起一台忏悔秤，右侧寄存牌烧出红色裂纹",
  "转动廊心铜盘",
  "凑近台座的喇叭",
  "校准苍白表盘",
  "贴上红色表盘",
  "核对空白铜牌",
  "坐上忏悔秤",
  "翻转核验牌",
]) assert.ok(js.includes(frag) || html.includes(frag), `missing v53 verbatim copy: ${frag}`);
/* DOM：枢纽三紧凑统计、四热点（翻转 hidden 起步）、卡容器删除、阈值热点 hidden 起步 */
const auditSectionV53 = html.match(/<section class="scene scene-branch scene-return-audit"[\s\S]*?<\/section>/);
for (const id of ["belief-stat-official", "belief-stat-sensory", "belief-stat-contradiction", "audit-route-echo", "audit-route-vein", "audit-route-confession", "audit-belief-flip"]) {
  assert.ok(auditSectionV53[0].includes(`id="${id}"`), `audit hub missing #${id}`);
}
assert.ok(auditSectionV53[0].includes("forecourt-tactile-stage"), "audit hub figure becomes the 3:2 tactile stage");
assert.match(auditSectionV53[0], /id="audit-belief-flip" type="button" aria-pressed="false" data-hover hidden/, "flip hotspot ships hidden");
assert.ok(!html.includes('id="audit-routes"'), "the v39 route card container must be deleted entirely");
assert.ok(!html.includes("audit-judgements"), "the v39 judgement card containers must be deleted entirely");
for (const id of ["echo-turn-belief-threshold", "vein-turnstile-belief-threshold", "confession-locker-belief-threshold"]) {
  assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `${id} must appear exactly once`);
  assert.match(html, new RegExp(`id="${id}" type="button" aria-pressed="false" data-hover hidden`), `${id} ships hidden`);
}
/* 目录 01τ½、记忆单行（逐字格式）、仍八张统计卡、同步函数挂接 */
assert.match(html, /<a href="#return-audit" id="belief-link" hidden data-hover>01τ½ \/ 归路信念<\/a>/);
assert.ok(html.includes('id="belief-memory"'), "remembrance gains the belief memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");
assert.match(js, /归路信念：守则信任 \$\{st\.globalOfficial\}，感官诱信 \$\{st\.globalSensory\}，自相矛盾 \$\{st\.contradiction\}。/, "belief memory line verbatim");
assert.match(js, /paintBeliefMemory\(\);/, "remembrance paints the v53 memory line");
assert.match(js, /syncBeliefLink\(\);/, "directory link syncs");
/* CSS：位置类与双变异态覆盖 */
for (const cls of ["audit-spot-echo", "audit-spot-vein", "audit-spot-confession", "audit-spot-flip", "echo-spot-first", "echo-spot-loud", "echo-spot-threshold", "vein-spot-pale", "vein-spot-pulse", "vein-spot-threshold", "confession-spot-blank", "confession-spot-named", "confession-spot-threshold"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}
assert.match(css, /\.belief-variant-official \./, "css missing official variant overrides");
assert.match(css, /\.belief-variant-sensory \./, "css missing sensory variant overrides");

/* ---------- v56 症状交接：核验封条 + 症状交班台 + 证据编组室 ---------- */
/* 八张冻结源 PNG 存在且 sha256 冻结 */
const V56_SOURCE_HASHES = {
  "design-references/source-v56-ward-deep-anomaly.png": "0b6fbcfc3e0b2ac8dd587e1c72799f14deb3007a7bb6fe1935b3ad4f31bfbc8e",
  "design-references/source-v56-ward-deep-normal.png": "455e6ab2cb571484faabd4d745fd7cd082f2bd27aab08468795c50fb46d5fcc9",
  "design-references/source-v56-records-deep-anomaly.png": "6bf6ae95db1e3c73eaf986339ea3496531684ea4c2b68a26839dd9180224ddf8",
  "design-references/source-v56-records-deep-normal.png": "08aace9a94e2b03796b6e4d5e08da33b7798dafb3c43f622c6bc8285b6803f4a",
  "design-references/source-v56-laundry-deep-anomaly.png": "e0d2946f9526629f1d5c0ee37ee08e70eb451749cc3e9ac9cc75fd59d574223e",
  "design-references/source-v56-laundry-deep-normal.png": "99bb7d76d44d3d176f6a4daece408cdb76d8a7dd0b77e9e6980e8537e4e2100c",
  "design-references/source-v56-symptom-handover-hub.png": "a9fa5ec7dacf68a0531b3e16752ad2111269dc1920300f23a3b397edd46c951a",
  "design-references/source-v56-evidence-switchboard.png": "9d729d09da442756ee508ec379ba99ee5aad08fa5b830bb68f5c8e841db11a56",
};
for (const [src, hash] of Object.entries(V56_SOURCE_HASHES)) {
  const buf = await readFile(new URL(src, root));
  assert.equal(createHash("sha256").update(buf).digest("hex"), hash, `${src} must keep its frozen sha256`);
}
for (const asset of ["assets/v56-ward-deep-anomaly.webp", "assets/v56-ward-deep-normal.webp", "assets/v56-records-deep-anomaly.webp", "assets/v56-records-deep-normal.webp", "assets/v56-laundry-deep-anomaly.webp", "assets/v56-laundry-deep-normal.webp", "assets/v56-symptom-handover-hub.webp", "assets/v56-evidence-switchboard.webp"]) {
  const buf = await readFile(new URL(asset, root));
  assert.ok(buf.length > 100000, `${asset} must exist as a full-size transcode`);
  assert.ok(js.includes(asset) || html.includes(asset), `${asset} must be referenced`);
}
assert.match(js, /const EVIDENCE_KEY = "goddead_v56_evidence_audit";/);
assert.equal((js.match(/goddead_v56/g) || []).length, 1, "v56 introduces exactly one storage key");
const evidenceParseBlock = js.match(/const getEvidence = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(evidenceParseBlock, "getEvidence must exist");
assert.match(evidenceParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt evidence storage must be safely repaired");
assert.match(evidenceParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type evidence storage must fall back");
assert.match(evidenceParseBlock[0], /Math\.min\(EVIDENCE_NUM_CAP, Math\.floor\(n\)\)/, "evidence counters must be clamped 0..9999");
assert.match(evidenceParseBlock[0], /const sameCycle = num\(raw\.cycle\) === floorCycle;/, "cycle-scoped fields reset when the v35 cycle moves on");
assert.match(evidenceParseBlock[0], /\[1, 2, 3\]\.includes\(raw\.budget\) \? raw\.budget : 0/, "budget accepts only the legal 1/2/3 values");
assert.match(evidenceParseBlock[0], /remaining = Math\.min\(remaining, budget\);/, "remaining never exceeds the frozen budget");
assert.match(evidenceParseBlock[0], /history = history\.slice\(-EVIDENCE_HISTORY_CAP\);/, "history is bounded to the last 16 valid entries");
assert.ok(evidenceParseBlock[0].indexOf("history = history.slice(-EVIDENCE_HISTORY_CAP);") < evidenceParseBlock[0].indexOf("let pending = null;"), "canonical history is parsed before pending validation");
assert.match(evidenceParseBlock[0], /Object\.keys\(p\)\.sort\(\)\.join\(","\) === "feedback,kind,outcome,room,target"/, "defer pending accepts exactly five whitelisted keys");
assert.match(evidenceParseBlock[0], /deferredTarget !== "" && reports\[p\.room\] === 1/, "defer pending needs the deferred landing and the report settlement");
assert.match(evidenceParseBlock[0], /resolved\.hub === 1 && handover === p\.room/, "handover pending needs this cycle's hub settlement");
assert.match(evidenceParseBlock[0], /resolved\.switchboard === 1/, "action pending needs this cycle's switchboard settlement");
assert.match(evidenceParseBlock[0], /const credibility = counters\.proofs \+ 2 \* counters\.blindCorrect \+ counters\.chains - counters\.contradictions - counters\.suppressed;/, "credibility is re-derived, never trusted");
assert.ok(!/assignment/.test(evidenceParseBlock[0].replace(/truthState\.assignment|getAnomaly\(\)\.assignment|&& truthState\.assignment/g, "")), "v56 never persists the assignment, truth comes from v55");
const evidenceSaveBlock = js.match(/const saveEvidence = \(st\) => store\.set\(EVIDENCE_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(evidenceSaveBlock, "saveEvidence must persist an explicit canonical projection");
for (const f of ["cycle", "budget", "remaining", "checks", "reports", "correct", "deepCount", "handover", "deferredTarget", "resolved", "visits", "proofs", "blindCorrect", "contradictions", "exposure", "chains", "suppressed", "selfSeals", "trustedHandovers", "blindHandovers", "failedHandovers", "pending"]) {
  assert.match(evidenceSaveBlock[0], new RegExp(`${f}: st\\.${f},`), `saveEvidence persists ${f}`);
}
assert.match(evidenceSaveBlock[0], /history: st\.history\.slice\(-EVIDENCE_HISTORY_CAP\),/, "saveEvidence clamps history to <= 16 before persisting");
assert.ok(!/credibility|pendingTarget|assignment/.test(evidenceSaveBlock[0]), "saveEvidence must never persist derived fields or assignment");
/* 预算：确定性公式，无 Math.random */
const evidenceModuleBlock = js.match(/v56 症状交接：三房巡检核验封条[\s\S]*?v40 门外侧廊/);
assert.ok(evidenceModuleBlock, "v56 module must exist");
assert.ok(!evidenceModuleBlock[0].includes("Math.random("), "v56 budget must never re-roll Math.random");
assert.match(js, /const EVIDENCE_BUDGET_BY_CREDIBILITY = \(cred\) => \(cred >= 4 \? 3 : cred <= -2 \? 1 : 2\);/, "budget tiers 3/2/1 by credibility");
assert.match(js, /st\.budget = EVIDENCE_BUDGET_BY_CREDIBILITY\(st\.credibility\);\s*st\.remaining = st\.budget;/, "budget is created once per cycle from derived credibility");
/* 深查：守卫与消耗契约，原地切图不转场 */
const checkBlock = js.match(/const chooseEvidenceCheck = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(checkBlock[0], /if \(currentScene !== sceneKey\) return;/, "check rejects off-scene calls");
assert.match(checkBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "check shares the room first-lock");
assert.match(checkBlock[0], /if \(!anomalyInspecting\(room\)\) return;/, "check requires live inspection mode");
assert.match(checkBlock[0], /if \(st\.budget === 0 \|\| st\.remaining === 0 \|\| st\.checks\[room\] === 1\) return;/, "check needs seal remaining and an unchecked room");
assert.match(checkBlock[0], /st\.remaining = Math\.max\(0, st\.remaining - 1\);/, "check consumes exactly one seal");
assert.match(checkBlock[0], /st\.exposure = Math\.min\(EVIDENCE_NUM_CAP, st\.exposure \+ 1\);/, "check adds one exposure");
assert.ok(!checkBlock[0].includes("AutoAdvance.schedule"), "check swaps the image in place without any transition");
/* 报告计分与第三报告有意挂钩 */
const evidenceReportBlock = js.match(/const recordEvidenceReport = \(room, outcome, v55Target, v55Feedback\) => \{[\s\S]*?\n  \};/);
assert.match(evidenceReportBlock[0], /if \(st\.checks\[room\] === 1\) st\.proofs = Math\.min\(EVIDENCE_NUM_CAP, st\.proofs \+ 1\);\s*else st\.blindCorrect = Math\.min\(EVIDENCE_NUM_CAP, st\.blindCorrect \+ 1\);/, "checked-correct proofs +1, blind-correct blindCorrect +1");
assert.match(evidenceReportBlock[0], /st\.contradictions = Math\.min\(EVIDENCE_NUM_CAP, st\.contradictions \+ 1\);/, "any wrong report contradictions +1");
assert.match(evidenceReportBlock[0], /if \(reportCount === 3 && st\.deepCount >= 2 && st\.deferredTarget === ""\) \{/, "defer needs the third report, >= 2 deep checks and no prior deferral");
assert.match(evidenceReportBlock[0], /st\.deferredTarget = v55Target;/, "the original v55 landing is stored as deferredTarget");
assert.match(js, /const evidenceDefer = recordEvidenceReport\(room, outcome, meta\.target, meta\.feedback\);/, "v55 report settlement hooks into v56 once");
assert.match(js, /if \(s\.visits\.hub === 0\) s\.visits\.hub = 1;/, "defer transition records the hub visit before clearing pending");
/* 交班四结果与编组三动作（逐字） */
for (const frag of [
  'trusted: { target: "evidence-switchboard", feedback: "封条和报告同时咬住同一结论。证据编组室把门打开了。"',
  'blind: { target: "evidence-switchboard", feedback: "没有封条的报告仍然猜中了门后那一间。证据编组室接受这次盲判。"',
  'falseReport: { target: "innocent-quarantine", feedback: "你交上去的症状在台面上恢复正常。误报井先签收了你。"',
  'missed: { target: "omission-transfer-shaft", feedback: "你交上去的正常结论在台面上开始呼吸。对应后室把原件取走了。"',
  'press: { btn: "#switch-action-press", target: "evidence-vault", feedback: "压机合拢。两份证据从此只允许一种死法。"',
  'burn: { btn: "#switch-action-burn", target: "false-positive-shaft", feedback: "红蜡只烧掉不同意你的那一份。误报井收到了灰。"',
  'selfseal: { btn: "#switch-action-selfseal", feedback: "封条绕过手腕和喉咙。你成了这批证据唯一还活着的附件。"',
]) assert.ok(js.includes(frag), `missing v56 verbatim: ${frag.slice(0, 26)}`);
const handoverBlock = js.match(/const chooseEvidenceHandover = \(room\) => \{[\s\S]*?\n  \};/);
assert.match(handoverBlock[0], /if \(currentScene !== "symptom-handover-hub"\) return;/, "handover rejects off-scene calls");
assert.match(handoverBlock[0], /if \(st\.resolved\.hub === 1 \|\| st\.reports\[room\] !== 1\) return;/, "handover accepts only the first choice for a reported room");
assert.match(handoverBlock[0], /const truth = truthState\.assignment && truthState\.assignment\[room\];/, "handover truth comes from the v55 assignment");
const switchBlock = js.match(/const chooseEvidenceSwitchAction = \(actionKey\) => \{[\s\S]*?\n  \};/);
assert.match(switchBlock[0], /if \(currentScene !== "evidence-switchboard"\) return;/, "switchboard action rejects off-scene calls");
assert.match(switchBlock[0], /if \(st\.resolved\.switchboard === 0\) \{/, "switchboard score settles only once per cycle");
assert.match(switchBlock[0], /st\.exposure = Math\.min\(EVIDENCE_NUM_CAP, st\.exposure \+ 2\);/, "selfseal adds two exposure");
/* 深查逐字反馈（三房 × 正常/异常） */
for (const frag of ["黑线没有通向墙。它从床单下面接回那枚呼叫钮。", "黑线止在瓷封里。床上没有第二个接点。", "背光里，墨迹从纸纤维向上爬，和池心的逆流同拍。", "背光穿透整页。纸纤维里没有藏第二份姓名。", "黑线穿过机壳，接在倒影里的白工服上。第二道影子朝错方向落下。", "两根铜线都封死在瓷帽里。圆窗后的走廊仍是空的。"]) {
  assert.ok(js.includes(frag), `missing v56 deep-check feedback: ${frag.slice(0, 16)}`);
}
/* 窄守卫与接线 */
assert.match(js, /if \(EVIDENCE_SCENES\.includes\(target\) && evidenceGuard\.pendingTarget !== target && !evidenceGuard\.visits\[EVIDENCE_SCENE_KEY\[target\]\]\) target = "unnumbered-floor";/, "v56 guard admits only legal pending or past visits");
assert.match(js, /if \(EVIDENCE_SCENES\.includes\(name\)\) \{ enterEvidenceScene\(name\); replayEvidencePending\(name\); \}/, "evidence scene entry replays a legal pending");
/* DOM：三房核验热点 hidden、两新场景九热点、目录、记忆、8 卡 */
for (const id of ["ward-evidence-check", "records-evidence-check", "laundry-evidence-check"]) {
  assert.match(html, new RegExp(`id="${id}" type="button" aria-pressed="false" data-hover hidden`), `${id} ships hidden`);
}
for (const [scene, ids] of [["symptom-handover-hub", ["handover-choice-ward", "handover-choice-records", "handover-choice-laundry"]], ["evidence-switchboard", ["switch-action-press", "switch-action-burn", "switch-action-selfseal"]]]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-${scene}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${scene}`);
  assert.ok(section[0].includes("forecourt-tactile-stage"), `${scene} uses the 3:2 tactile stage`);
  assert.ok(!section[0].includes("branch-choices") && !section[0].includes("<svg"), `${scene} must not degrade to cards or inline SVG`);
  const figure = section[0].match(/<figure[\s\S]*?<\/figure>/);
  for (const id of ids) assert.ok(figure[0].includes(`id="${id}"`), `${scene} figure must hold #${id}`);
}
assert.match(html, /<a href="#symptom-handover-hub" id="handover-link" hidden data-hover>01π½ \/ 症状交班<\/a>/);
assert.match(html, /<a href="#evidence-switchboard" id="switchboard-link" hidden data-hover>01ρ½ \/ 证据编组<\/a>/);
assert.ok(html.includes('id="evidence-audit-memory"'), "remembrance gains the evidence audit memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");
assert.match(js, /证据审计：核验 \$\{st\.proofs\}，盲判 \$\{st\.blindCorrect\}，矛盾 \$\{st\.contradictions\}，暴露 \$\{st\.exposure\}，可信度 \$\{st\.credibility\}。/, "evidence audit memory line verbatim");
/* 遗忘全部：v56 key 清除后记忆行、目录与三房核验态一并复位 */
const forgetBlockV56 = js.match(/const keysToRemove = \[\];[\s\S]*?goScene\("threshold"\);/);
assert.ok(forgetBlockV56, "forget-all handler must exist");
assert.match(forgetBlockV56[0], /syncEvidenceLinks\(\);/, "forget-all resets the v56 directory links");
assert.match(forgetBlockV56[0], /paintEvidenceAuditMemory\(\);/, "forget-all hides the v56 memory line");
assert.match(forgetBlockV56[0], /ANOMALY_ROOMS\.forEach\(\(r\) => syncEvidenceRoom\(ANOMALY_ROOM_SCENE\[r\]\)\);/, "forget-all restores the three duty rooms' evidence state");
for (const cls of ["ward-spot-check", "records-spot-check", "laundry-spot-check", "handover-spot-ward", "handover-spot-records", "handover-spot-laundry", "switch-spot-press", "switch-spot-burn", "switch-spot-selfseal"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}

/* ---------- v57 判词后果层：四后果场景 12 动作 + 责任账房 3 动作 ---------- */
/* 五张冻结源 PNG 存在且 sha256 冻结 */
const V57_SOURCE_HASHES = {
  "design-references/source-v57-concordance-theatre.png": "76c8b89927d5e61b79bd833f861b9c66e2677844c418630c2fd02989907bea15",
  "design-references/source-v57-innocent-quarantine.png": "791a5775efd51e910d403e4d837337e825d2db084589ed00750dd20cb9ab771d",
  "design-references/source-v57-misbound-handover.png": "31fdabaa6efccc92a3d0b353aca8bb66937a27223417d1aada2f00d8bec864de",
  "design-references/source-v57-omission-transfer-shaft.png": "2e69f475d69770aa3d32229849e31a44651a88b29b9a95ff897fe0cbae0fc111",
  "design-references/source-v57-liability-ledger.png": "b33b48c16e585adf2e8126c4013a0b3afdaa546f83c0a218580f7f762d5baa81",
};
for (const [src, hash] of Object.entries(V57_SOURCE_HASHES)) {
  const buf = await readFile(new URL(src, root));
  assert.equal(createHash("sha256").update(buf).digest("hex"), hash, `${src} must keep its frozen sha256`);
}
for (const asset of ["assets/v57-concordance-theatre.webp", "assets/v57-innocent-quarantine.webp", "assets/v57-misbound-handover.webp", "assets/v57-omission-transfer-shaft.webp", "assets/v57-liability-ledger.webp"]) {
  const buf = await readFile(new URL(asset, root));
  assert.ok(buf.length > 100000, `${asset} must exist as a full-size transcode`);
  assert.ok(html.includes(asset), `${asset} must be referenced by its scene`);
}
assert.match(js, /const LEDGER_KEY = "goddead_v57_consequence_ledger";/);
assert.equal((js.match(/goddead_v57/g) || []).length, 1, "v57 introduces exactly one storage key");
const ledgerParseBlock = js.match(/const getLedger = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(ledgerParseBlock, "getLedger must exist");
assert.match(ledgerParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt ledger storage must be safely repaired");
assert.match(ledgerParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type ledger storage must fall back");
assert.match(ledgerParseBlock[0], /Math\.min\(LEDGER_NUM_CAP, Math\.floor\(n\)\)/, "ledger counters must be clamped 0..9999");
assert.match(ledgerParseBlock[0], /settled\[k\] = sameCycle \? flag\(raw\.settled && raw\.settled\[k\]\) : 0;/, "only settled resets when the v35 cycle moves on");
assert.match(ledgerParseBlock[0], /LEDGER_DEFERRED_POOL\.includes\(raw\.deferredTarget\) \? raw\.deferredTarget : ""/, "deferredTarget is whitelisted");
assert.match(ledgerParseBlock[0], /history = history\.slice\(-LEDGER_HISTORY_CAP\);/, "history is bounded to the last 16 valid entries");
assert.ok(ledgerParseBlock[0].indexOf("history = history.slice(-LEDGER_HISTORY_CAP);") < ledgerParseBlock[0].indexOf("let pending = null;"), "canonical history is parsed before pending validation");
assert.match(ledgerParseBlock[0], /Object\.keys\(p\)\.sort\(\)\.join\(","\) === "action,cycle,feedback,kind,scene,target"/, "ledger pending accepts exactly six whitelisted keys incl. cycle");
assert.match(ledgerParseBlock[0], /settled\[p\.scene\] === 1 && actions\[p\.action\] >= 1 && num\(p\.cycle\) === cycle/, "pending needs settlement evidence and a matching cycle");
assert.match(ledgerParseBlock[0], /h\.scene === "ledger" && Number\.isInteger\(h\.pre\) && h\.pre >= LEDGER_LIABILITY_MIN && h\.pre <= LEDGER_LIABILITY_MAX/, "history pre is whitelisted to the liability range");
assert.match(ledgerParseBlock[0], /gap === delta \|\| scores\[LEDGER_DELTA_SCORE\[p\.action\]\] === LEDGER_NUM_CAP/, "a saturated settlement proves itself via the capped score");
assert.match(ledgerParseBlock[0], /const target = ledgerActionTarget\(st, p\.action, last\.pre\);/, "ledger targets recompute from the history-proven pre-click liability");
assert.ok(!/LEDGER_PRE_ADJUST/.test(js), "fixed-delta back-computation is gone (breaks under the 9999 cap)");
assert.match(ledgerParseBlock[0], /deferredTarget !== "" && deferredTarget === normalTarget/, "the third-scene deferral proves itself via the stored deferred landing");
assert.match(ledgerParseBlock[0], /const liability = scores\.concordance \+ scores\.repair \+ scores\.selfBurden - 2 \* scores\.transfer;/, "liability is re-derived, never trusted");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56)/.test(ledgerParseBlock[0]), "v57 state must not touch earlier keys");
const ledgerSaveBlock = js.match(/const saveLedger = \(st\) => store\.set\(LEDGER_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(ledgerSaveBlock, "saveLedger must persist an explicit canonical projection");
for (const f of ["cycle", "scores", "visits", "settled", "actions", "deferredTarget", "pending"]) {
  assert.match(ledgerSaveBlock[0], new RegExp(`${f}: st\\.${f},`), `saveLedger persists ${f}`);
}
assert.match(ledgerSaveBlock[0], /history: st\.history\.slice\(-LEDGER_HISTORY_CAP\),/, "saveLedger clamps history to <= 16 before persisting");
assert.ok(!/liability|pendingTarget/.test(ledgerSaveBlock[0]), "saveLedger must never persist derived fields");
/* v56 改道：press 分流完全派生，不新增持久化字段 */
const evidenceSaveBlockV57 = js.match(/const saveEvidence = \(st\) => store\.set\(EVIDENCE_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(!/handoverKind/.test(evidenceSaveBlockV57[0]), "v56 must not persist any handoverKind field");
assert.match(js, /const evidenceHandoverKind = \(st\) => \{[\s\S]*?return st\.checks\[st\.handover\] === 1 \? "trusted" : "blind";\s*\};/, "press routing derives the handover kind from canonical evidence state");
/* 15 动作：12 后果动作逐字 + 账房阈值 */
for (const frag of [
  '"bind-testimony": { btn: "#theatre-action-bind-testimony", scores: { concordance: 2 }, target: "evidence-vault", feedback: "两份证词被压成同一枚指纹。证物库只承认它们一起存在。"',
  '"preserve-dissent": { btn: "#theatre-action-preserve-dissent", scores: { concordance: 1, selfBurden: 1 }, target: "protocol-drift", feedback: "你把分歧留在卷宗里，也把解释它的责任留给自己。"',
  '"substitute-witness": { btn: "#theatre-action-substitute-witness", scores: { selfBurden: 2 }, target: "misbound-handover", feedback: "镜面把你的轮廓钉在证词空位上。错绑交班开始呼叫你的名字。"',
  '"release-innocent": { btn: "#quarantine-action-release-innocent", scores: { repair: 2 }, target: "unnumbered-floor", feedback: "红蜡断开以后，舱里没有病人。只有一份被你延迟承认的正常。"',
  '"extend-quarantine": { btn: "#quarantine-action-extend-quarantine", scores: { transfer: 2 }, target: "false-positive-shaft", feedback: "你把怀疑续签给一个空舱。误报井替你保管了它。"',
  '"stand-in": { btn: "#quarantine-action-stand-in", scores: { repair: 1, selfBurden: 1 }, target: "misbound-handover", feedback: "空工服接受了你的号牌。它没有获释，只是换成你被留置。"',
  '"descend-after": { btn: "#shaft-action-descend-after", scores: { repair: 2 }, dynamic: "handoverBackroom", feedback: "你跟着漏掉的症状下井。它在原房间的背面等你补签。"',
  '"transfer-omission": { btn: "#shaft-action-transfer-omission", scores: { transfer: 2 }, target: "blank-receipt-press", feedback: "移交单没有收件人。空白回执仍替你签收了这次漏报。"',
  '"seal-omission": { btn: "#shaft-action-seal-omission", scores: { concordance: 1, transfer: 1 }, target: "evidence-vault", feedback: "你封住了井口，也封住了谁本应看见它。证物库收下一只仍在下坠的箱子。"',
  '"admit-misbind": { btn: "#misbound-action-admit-misbind", scores: { selfBurden: 2 }, dynamic: "handoverBackroom", feedback: "你承认正确的结论绑错了证人。后室把责任和你一起叫回去。"',
  '"reassign-empty": { btn: "#misbound-action-reassign-empty", scores: { transfer: 2 }, target: "blank-name-cloakroom", feedback: "空名接过了手铐。它从来没有出现过，所以最适合承担证明。"',
  '"break-cuffs": { btn: "#misbound-action-break-cuffs", scores: { repair: 1, selfBurden: 1 }, target: "protocol-drift", feedback: "链断了，绑定却没有消失。守则开始重写“证人”的定义。"',
]) assert.ok(js.includes(frag), `missing v57 consequence action: ${frag.slice(0, 30)}`);
assert.match(js, /const LEDGER_LIABILITY_DELTA = \{ "return-verdict": 1, "sign-self": 2, "assign-vacancy": -4 \};/, "ledger liability deltas frozen");
assert.match(js, /const LEDGER_DELTA_SCORE = \{ "return-verdict": "concordance", "sign-self": "selfBurden", "assign-vacancy": "transfer" \};/, "ledger delta-affected scores frozen");
assert.match(js, /st\.history\.push\(\{ type: "action", scene: "ledger", action: actionKey, pre: st\.liability \}\);/, "ledger settlement records the pre-click liability in canonical history");
for (const frag of ["原判被退回你留下的那条路。账房替你销了一页。", "你把判决签回自己身上。证物库承认这副肩膀。", "你把判决签回自己身上。还不够重的那部分，由后室认领。", "空席接住了这份判决。误报井承认它早就该来。", "空席接住了这份判决。空名寄存处为它留了位置。"]) {
  assert.ok(js.includes(frag), `missing v57 ledger feedback: ${frag.slice(0, 16)}`);
}
/* 第三不同后果场景首次改道责任账房 */
assert.match(js, /if \(distinct >= 3 && st\.visits\.ledger === 0 && st\.deferredTarget === ""\) \{\s*st\.deferredTarget = target;\s*target = "liability-ledger";/, "third distinct consequence scene defers to the liability ledger once");
/* 守卫、接线与遗忘 */
assert.match(js, /if \(LEDGER_SCENES\.includes\(target\) && ledgerGuard\.pendingTarget !== target && !ledgerGuard\.visits\[LEDGER_SCENE_KEY\[target\]\]\) target = "unnumbered-floor";/, "v57 guard admits only legal pending or past visits");
assert.match(js, /if \(LEDGER_SCENES\.includes\(name\)\) \{ enterLedgerScene\(name\); replayLedgerPending\(name\); \}/, "ledger scene entry replays a legal pending");
assert.match(forgetBlockV56[0], /syncLedgerLinks\(\);/, "forget-all resets the v57 directory links");
assert.match(forgetBlockV56[0], /paintLedgerMemory\(\);/, "forget-all hides the v57 memory line");
/* synthetic 守卫：15 动作监听只接受 isTrusted 真实 click，合成 HTMLElement.click() 零副作用 */
assert.match(js, /if \(btn\) btn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseConsequenceAction\(sceneKey, actionKey\); \}\);/, "consequence listeners reject synthetic clicks");
assert.match(js, /if \(btn\) btn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseLedgerAction\(actionKey\); \}\);/, "ledger listeners reject synthetic clicks");
assert.equal((js.match(/ev\.isTrusted/g) || []).length, 10, "exactly the v57 (2) + v58 (5) + v59 (3) listener groups carry the isTrusted guard");
assert.equal((js.match(/addEventListener\("click", \(ev\)/g) || []).length, 10, "no other click listener signature was touched");
/* DOM：五场景各三热点入图、无卡片无 SVG、目录×5、记忆单行、8 卡 */
for (const [scene, ids] of [["concordance-theatre", ["theatre-action-bind-testimony", "theatre-action-preserve-dissent", "theatre-action-substitute-witness"]], ["innocent-quarantine", ["quarantine-action-release-innocent", "quarantine-action-extend-quarantine", "quarantine-action-stand-in"]], ["omission-transfer-shaft", ["shaft-action-descend-after", "shaft-action-transfer-omission", "shaft-action-seal-omission"]], ["misbound-handover", ["misbound-action-admit-misbind", "misbound-action-reassign-empty", "misbound-action-break-cuffs"]], ["liability-ledger", ["ledger-action-return-verdict", "ledger-action-sign-self", "ledger-action-assign-vacancy"]]]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-${scene}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${scene}`);
  assert.ok(section[0].includes("forecourt-tactile-stage"), `${scene} uses the 3:2 tactile stage`);
  assert.ok(!section[0].includes("branch-choices") && !section[0].includes("<svg"), `${scene} must not degrade to cards or inline SVG`);
  const figure = section[0].match(/<figure[\s\S]*?<\/figure>/);
  for (const id of ids) assert.ok(figure[0].includes(`id="${id}"`), `${scene} figure must hold #${id}`);
  assert.ok(section[0].includes("ledger-slip"), `${scene} carries the liability slip`);
}
assert.match(html, /<a href="#concordance-theatre" id="theatre-link" hidden data-hover>01σ½ \/ 共证剧场<\/a>/);
assert.match(html, /<a href="#innocent-quarantine" id="quarantine-link" hidden data-hover>01υ½ \/ 无辜留置<\/a>/);
assert.match(html, /<a href="#omission-transfer-shaft" id="omission-link" hidden data-hover>01φ½ \/ 漏报移交<\/a>/);
assert.match(html, /<a href="#misbound-handover" id="misbound-link" hidden data-hover>01χ½ \/ 错绑交班<\/a>/);
assert.match(html, /<a href="#liability-ledger" id="ledger-link" hidden data-hover>01ψ½ \/ 责任账房<\/a>/);
assert.ok(html.includes('id="consequence-ledger-memory"'), "remembrance gains the consequence ledger memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");
assert.match(js, /责任账：共证 \$\{st\.scores\.concordance\}，修复 \$\{st\.scores\.repair\}，转嫁 \$\{st\.scores\.transfer\}，自担 \$\{st\.scores\.selfBurden\}，责任值 \$\{st\.liability\}。/, "ledger memory line verbatim");
for (const cls of ["theatre-spot-bind", "theatre-spot-dissent", "theatre-spot-substitute", "quarantine-spot-release", "quarantine-spot-extend", "quarantine-spot-standin", "shaft-spot-descend", "shaft-spot-transfer", "shaft-spot-seal", "misbound-spot-admit", "misbound-spot-reassign", "misbound-spot-break", "ledger-spot-return", "ledger-spot-sign", "ledger-spot-vacancy"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}
/* 全仓库唯一 id：漏报移交井不得复用 v33 的 shaft-response / shaft-link */
assert.ok(html.includes('id="omission-response"'), "omission scene uses its own unique response id");
assert.ok(html.includes('id="omission-link"'), "omission scene uses its own unique directory link id");
{
  const allIds = html.match(/ id="[^"]+"/g) || [];
  const uniq = new Set(allIds);
  assert.equal(uniq.size, allIds.length, `every id in index.html must be unique (${allIds.length - uniq.size} duplicates)`);
}

/* ---------- v58 异议总署：总署 hub + 三复核室 9 动作 + 结案纯函数路由 ---------- */
/* 四张冻结源 PNG 存在且 sha256 冻结 */
const V58_SOURCE_HASHES = {
  "design-references/source-v58-appeal-registry.png": "a53708d2fc1211ff3be7665fbfd377b1ada445cafa9b67f0bc856672b17d6095",
  "design-references/source-v58-identity-correction.png": "b1a679a75be7cde21c7079c8eda511fa0e14658aece1285bbbe5a9858ef20308",
  "design-references/source-v58-evidence-contradiction.png": "036288e5264c777d4dc9c4abc8ed3955d630848d330405ebdbe10c4e8d7c3ff0",
  "design-references/source-v58-destination-review-shaft.png": "6aff29cc5c935b7c0ee738e97620dafd87ad069d486c301cc8fa2d8b90333500",
};
for (const [src, hash] of Object.entries(V58_SOURCE_HASHES)) {
  const buf = await readFile(new URL(src, root));
  assert.equal(createHash("sha256").update(buf).digest("hex"), hash, `${src} must keep its frozen sha256`);
}
for (const asset of ["assets/v58-appeal-registry.webp", "assets/v58-identity-correction.webp", "assets/v58-evidence-contradiction.webp", "assets/v58-destination-review-shaft.webp"]) {
  const buf = await readFile(new URL(asset, root));
  assert.ok(buf.length > 100000, `${asset} must exist as a full-size transcode`);
  assert.ok(buf.length <= 310000, `${asset} must stay within the ~300KB budget`);
  assert.ok(html.includes(asset), `${asset} must be referenced by its scene`);
}
assert.match(js, /const APPEAL_KEY = "goddead_v58_appeal";/);
assert.equal((js.match(/goddead_v58/g) || []).length, 1, "v58 introduces exactly one storage key");
const appealParseBlock = js.match(/const getAppeal = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(appealParseBlock, "getAppeal must exist");
assert.match(appealParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt appeal storage must be safely repaired");
assert.match(appealParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type appeal storage must fall back");
assert.match(appealParseBlock[0], /if \(raw\.version !== APPEAL_VERSION\) raw = \{\};/, "wrong-version appeal storage is dropped wholesale");
assert.match(appealParseBlock[0], /Math\.min\(APPEAL_NUM_CAP, Math\.floor\(n\)\)/, "appeal counters must be clamped 0..9999");
assert.match(appealParseBlock[0], /const cycle = getFloor\(\)\.cycle;/, "appeal cycle aligns with the v35 floor cycle");
assert.match(appealParseBlock[0], /history = history\.slice\(-APPEAL_HISTORY_CAP\);/, "appeal history is bounded to the last 16 valid entries");
assert.ok(appealParseBlock[0].indexOf("history = history.slice(-APPEAL_HISTORY_CAP);") < appealParseBlock[0].indexOf("let pending = null;"), "canonical history is parsed before pending validation");
assert.match(appealParseBlock[0], /h\.type === "entry" \|\| h\.type === "close"/, "history whitelist carries entry/close shapes");
assert.match(appealParseBlock[0], /h\.type === "action" && APPEAL_ROOM_KEYS\.includes\(h\.room\) && APPEAL_ACTION_META\[h\.room\]\.actions\[h\.action\]/, "history action entries are whitelisted per room");
assert.match(appealParseBlock[0], /if \(h\.type === "action" && h\.cycle === cycle && !settled\[h\.room\]\) \{/, "scores and settled rooms derive from current-cycle history, first action per room only");
assert.match(appealParseBlock[0], /keys === "cycle,feedback,kind,scene,target"/, "entry/close pending accept exactly five whitelisted keys");
assert.match(appealParseBlock[0], /keys === "action,cycle,feedback,kind,scene,target"/, "action pending accepts exactly six whitelisted keys");
assert.match(appealParseBlock[0], /profile\.eligible/, "entry pending requires live v57-derived eligibility");
assert.match(appealParseBlock[0], /settledCount >= 2/, "close pending requires two rooms settled this cycle");
assert.match(appealParseBlock[0], /const target = appealCloseTarget\(scores, settledCount, profile\.liability, profile\.lastRoom\);/, "close target recomputes from derived scores and v57 profile");
assert.match(appealParseBlock[0], /const feedback = appealActionFeedback\(APPEAL_SCENE_KEY\[p\.scene\], p\.action, profile\);/, "action feedback recomputes verbatim from the v57 profile");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56)/.test(appealParseBlock[0]), "v58 state must not touch earlier keys");
const appealSaveBlock = js.match(/const saveAppeal = \(st\) => store\.set\(APPEAL_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(appealSaveBlock, "saveAppeal must persist an explicit canonical projection");
assert.match(appealSaveBlock[0], /version: APPEAL_VERSION,/, "saveAppeal persists the frozen version");
for (const f of ["cycle", "visits", "pending"]) {
  assert.match(appealSaveBlock[0], new RegExp(`${f}: st\\.${f},`), `saveAppeal persists ${f}`);
}
assert.match(appealSaveBlock[0], /history: st\.history\.slice\(-APPEAL_HISTORY_CAP\),/, "saveAppeal clamps history to <= 16 before persisting");
assert.ok(!/scores|settled|pendingTarget|eligible|dominant|liability/.test(appealSaveBlock[0]), "saveAppeal must never persist derived fields");
/* 入口资格：v57 canonical 派生，≥3 不同后果房结算 + ≥1 账房动作结算 */
const appealProfileBlock = js.match(/const appealProfile = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(appealProfileBlock, "appealProfile must derive from the legal v57 state");
assert.match(appealProfileBlock[0], /const eligible = distinct >= 3 && ledgerActions >= 1;/, "eligibility needs three consequence rooms and one ledger action");
assert.match(js, /const APPEAL_DOMINANT_ORDER = \["selfBurden", "transfer", "repair", "concordance"\];/, "dominant-responsibility tie order is frozen");
/* 9 动作：逐字 btn 与精确分值 */
for (const frag of [
  '"accept-subject": { btn: "#identity-action-accept-subject", scores: { precedent: 2 } }',
  '"substitute-subject": { btn: "#identity-action-substitute-subject", scores: { objection: 1, contamination: 1 } }',
  '"erase-subject": { btn: "#identity-action-erase-subject", scores: { objection: 2, contamination: 1 } }',
  '"merge-records": { btn: "#contradiction-action-merge-records", scores: { precedent: 2 } }',
  '"preserve-conflict": { btn: "#contradiction-action-preserve-conflict", scores: { objection: 2 } }',
  '"destroy-copy": { btn: "#contradiction-action-destroy-copy", scores: { contamination: 2, precedent: 1 } }',
  '"return-origin": { btn: "#destination-action-return-origin", scores: { objection: 2 } }',
  '"assign-vacancy": { btn: "#destination-action-assign-vacancy", scores: { precedent: 2, contamination: 1 } }',
  '"drop-below-map": { btn: "#destination-action-drop-below-map", scores: { contamination: 2 } }',
]) assert.ok(js.includes(frag), `missing v58 appeal action: ${frag.slice(0, 40)}`);
/* 逐字反馈：静态 + profile 动态变体 + hub/入口/锁印 */
for (const frag of [
  "名牌嵌进证人椅。先例不需要脸，只需要一个被承认坐过的位置。",
  "裂镜把你的轮廓试进空制服。制服合身的那一刻，证词开始认错人。",
  "你拨通电话，让共证过的声音亲口否认那张肖像。空画框收下一段被撤回的同台。",
  "你拨通电话，逐条报出你修过的记录，把肖像从墙上请了下来。空画框记得这双手。",
  "你拨通电话，把肖像的存在说成别人的误会。空画框替你挂断了电话。",
  "你拨通电话，用自己的名字换下肖像的编号。空画框从此归你保管。",
  "电话接通又挂断。空肖像没有等来去电，只剩一圈拨号音。",
  "错位玻璃被压到同一刻度。两页对照片合成一份先例，裂缝归进注释。",
  "污卷宗送进焚盘。灰被称重归档：先例多了一页，污染多了一撮。",
  "白卷宗保持空白。共证剧场同台过的两份证词，在这里被允许继续不一致。",
  "白卷宗保持空白。无辜留置舱教过你：写满不一定等于写对。",
  "白卷宗保持空白。漏报移交井里那只下坠的箱子提醒你，缺页也是一种记录。",
  "白卷宗保持空白。错绑交班台拆开过的结，不该在这里重新绑死。",
  "白卷宗保持空白。没有后果房为它作保，空白本身就是证词。",
  "回程轮轨倒转半圈。封箱被退回出发的一侧，异议随箱原路返回。",
  "断轨尽头的落井杆被压下。封箱坠到地图以下，污染沉入没有编号的深度。",
  "非负，空位承认这次指派有效。",
  "为负，空位先收下箱子，再向你追认指派。",
  "身份装置的电话先响了。勘误室接听你的责任簿。",
  "双份卷宗同时摊开。对照库只问哪一页先说谎。",
  "三路分发台的指针各偏一格。复核井等你选一条轨。",
  "封签断开。异议总署收下你的责任簿，三本索引同时翻开。",
  "锁链还压着账本：任意两间复核室结清后，印才会松。",
  "复核记录已归档。你沿原路退回总署柜台。",
]) assert.ok(js.includes(frag), `missing v58 feedback: ${frag.slice(0, 18)}`);
/* 结案路由纯函数：全部分支冻结，2/2/2 特殊平衡仅限三房全完成 */
const appealCloseTargetBlock = js.match(/const appealCloseTarget = \(scores, settledCount, liability, lastRoom\) => \{[\s\S]*?\n  \};/);
assert.ok(appealCloseTargetBlock, "appealCloseTarget must be a pure routing function");
assert.match(appealCloseTargetBlock[0], /if \(settledCount === 3 && o === p && p === c && o > 0\) return "unnumbered-floor";/, "2/2/2 special balance requires all three rooms settled");
assert.match(appealCloseTargetBlock[0], /if \(p > o && p > c\) return liability >= 0 \? "concordance-theatre" : "misbound-handover";/, "strict precedent high routes by liability sign");
assert.match(appealCloseTargetBlock[0], /if \(o > p && o > c\) return \(lastRoom === "quarantine" \|\| lastRoom === "shaft"\) \? "protocol-drift" : "evidence-vault";/, "strict objection high routes by the last consequence room");
assert.match(appealCloseTargetBlock[0], /if \(c > o && c > p\) return liability < 0 \? "false-positive-shaft" : "omission-transfer-shaft";/, "strict contamination high routes by liability sign");
assert.match(appealCloseTargetBlock[0], /if \(o === p && o > c\) return "liability-ledger";/, "objection=precedent tie returns to the liability ledger");
assert.match(appealCloseTargetBlock[0], /if \(o === c && o > p\) return "blank-name-cloakroom";/, "objection=contamination tie routes to the cloakroom");
assert.match(appealCloseTargetBlock[0], /if \(p === c && p > o\) return "misbound-handover";/, "precedent=contamination tie routes to misbound handover");
assert.match(appealCloseTargetBlock[0], /return "liability-ledger";\s*\};/, "exhausted/empty states fall back to the liability ledger");
/* 结案反馈逐字：占上风类别 + 送达理由 */
for (const frag of [
  "三类异议完全拉平（各 ${o} 点），没有一类占上风。总署拒绝归类，结案送去无号层——唯一不编号的楼层。",
  "点压过其余），责任值 ${L} 非负。先例需要同台复核，结案送去共证剧场。",
  "点），但责任值 ${L} 为负。先例绑错了承担者，结案退回错绑交班台。",
  "点拉平、压过异议。占上风者拒绝单独署名，结案退回错绑交班台。",
  "留下程序疑点。结案移交守则漂移，由守则重写自己。",
  "点），没有程序疑点随案。结案按原证据链退回异常保全。",
  "点），责任值 ${L} 为负。污染被怀疑本是误报，结案坠入误报回收井。",
  "点），责任值 ${L} 非负。污染按漏报流程移交，结案沉入漏报移交井。",
  "点拉平、压过先例。两类都不愿署名，结案寄存到空名寄存处。",
  "点拉平、压过污染。没有单一占上风者，结案退回责任账房重秤。",
  "三类异议无法裁定占上风者。结案退回责任账房，由账本重新过秤。",
]) assert.ok(js.includes(frag), `missing v58 close feedback: ${frag.slice(0, 16)}`);
/* 守卫、接线与遗忘 */
assert.match(js, /if \(APPEAL_SCENES\.includes\(target\) && appealGuard\.pendingTarget !== target && !appealGuard\.visits\[APPEAL_SCENE_KEY\[target\]\]\) target = "unnumbered-floor";/, "v58 guard admits only legal pending or past visits");
assert.match(js, /if \(APPEAL_SCENES\.includes\(name\)\) \{ enterAppealScene\(name\); replayAppealPending\(name\); \}/, "appeal scene entry replays a legal pending");
assert.match(js, /if \(name === "liability-ledger"\) \{ syncAppealSeal\(\); replayAppealPending\(name\); \}/, "the liability ledger syncs the appeal seal on revisit");
assert.match(forgetBlockV56[0], /syncAppealLinks\(\);/, "forget-all resets the v58 directory links");
assert.match(forgetBlockV56[0], /paintAppealMemory\(\);/, "forget-all hides the v58 memory line");
assert.match(forgetBlockV56[0], /syncAppealSeal\(\);/, "forget-all hides the appeal seal");
/* synthetic 守卫：v58 五组监听只接受 isTrusted 真实 click */
assert.match(js, /if \(sealBtn\) sealBtn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseAppealEntry\(\); \}\);/, "seal listener rejects synthetic clicks");
assert.match(js, /if \(closeBtn\) closeBtn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseAppealHub\("close"\); \}\);/, "close listener rejects synthetic clicks");
assert.match(js, /if \(btn\) btn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseAppealAction\(roomKey, actionKey\); \}\);/, "room action listeners reject synthetic clicks");
assert.match(js, /if \(retBtn\) retBtn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseAppealReturn\(roomKey\); \}\);/, "return listeners reject synthetic clicks");
/* DOM：四场景热点入图、无卡片无 SVG、封签入责任账房图、目录×4、记忆单行、8 卡 */
for (const [scene, ids] of [["appeal-registry", ["appeal-enter-identity", "appeal-enter-evidence", "appeal-close", "appeal-enter-destination"]], ["identity-correction", ["identity-action-erase-subject", "identity-action-accept-subject", "identity-action-substitute-subject", "identity-return-registry"]], ["evidence-contradiction", ["contradiction-action-preserve-conflict", "contradiction-action-merge-records", "contradiction-action-destroy-copy", "contradiction-return-registry"]], ["destination-review-shaft", ["destination-action-return-origin", "destination-action-assign-vacancy", "destination-action-drop-below-map", "destination-return-registry"]]]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-${scene}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${scene}`);
  assert.ok(section[0].includes("forecourt-tactile-stage"), `${scene} uses the 3:2 tactile stage`);
  assert.ok(!section[0].includes("branch-choices") && !section[0].includes("<svg"), `${scene} must not degrade to cards or inline SVG`);
  const figure = section[0].match(/<figure[\s\S]*?<\/figure>/);
  for (const id of ids) assert.ok(figure[0].includes(`id="${id}"`), `${scene} figure must hold #${id}`);
  assert.ok(section[0].includes("ledger-slip"), `${scene} carries the appeal slip`);
}
{
  const ledgerSection = html.match(/<section class="scene scene-branch scene-liability-ledger"[\s\S]*?<\/section>/);
  const ledgerFigure = ledgerSection[0].match(/<figure[\s\S]*?<\/figure>/);
  assert.match(ledgerFigure[0], /id="ledger-appeal-seal" type="button" aria-pressed="false" data-hover hidden/, "the appeal seal ships hidden inside the ledger figure");
}
assert.ok(html.includes('id="appeal-desc"'), "the hub description is dynamically painted");
assert.match(html, /<a href="#appeal-registry" id="appeal-link" hidden data-hover>01ω½ \/ 异议总署<\/a>/);
assert.match(html, /<a href="#identity-correction" id="correction-link" hidden data-hover>01ωα \/ 身份勘误<\/a>/);
assert.match(html, /<a href="#evidence-contradiction" id="contradiction-link" hidden data-hover>01ωβ \/ 证据对照<\/a>/);
assert.match(html, /<a href="#destination-review-shaft" id="destination-link" hidden data-hover>01ωγ \/ 去向复核<\/a>/);
assert.ok(html.includes('id="appeal-memory"'), "remembrance gains the appeal memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");
assert.match(js, /异议署：异议 \$\{st\.scores\.objection\}，先例 \$\{st\.scores\.precedent\}，污染 \$\{st\.scores\.contamination\}，本轮已复核 \$\{st\.settledCount\}\/3。/, "appeal memory line verbatim");
for (const cls of ["ledger-spot-appeal-seal", "appeal-spot-identity", "appeal-spot-evidence", "appeal-spot-close", "appeal-spot-destination", "identity-spot-erase", "identity-spot-accept", "identity-spot-substitute", "identity-spot-return", "contradiction-spot-preserve", "contradiction-spot-merge", "contradiction-spot-destroy", "contradiction-spot-return", "destination-spot-archway", "destination-spot-return", "destination-spot-assign", "destination-spot-drop"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}

/* ---------- v59 交叉听证：三房深查 + 结案延迟拦截 + 交叉听证台 ---------- */
/* 四张冻结源 PNG 存在且 sha256 冻结 */
const V59_SOURCE_HASHES = {
  "design-references/source-v59-cross-examination-desk.png": "c38f1fa18f306d0c57dd1c14df3e68fb5c1925544dc8818c58658d5b29c09b68",
  "design-references/source-v59-destination-cross-exam.png": "3f3d2724d3116f9c46347006133030e1017e9379fbdb112c2781cdd2e32beffc",
  "design-references/source-v59-evidence-cross-exam.png": "ab36da7dab4a6a76ea53b21bdcc3c17b3f9049dd7afe68573d8542cbd159c9a4",
  "design-references/source-v59-identity-cross-exam.png": "100444bb143e35305b68c82967ef2dc4119ceb01678ecd062cf319ddab4e4287",
};
for (const [src, hash] of Object.entries(V59_SOURCE_HASHES)) {
  const buf = await readFile(new URL(src, root));
  assert.equal(createHash("sha256").update(buf).digest("hex"), hash, `${src} must keep its frozen sha256`);
}
/* 四张 WebP：存在、完整转码、≤300KB；听证台图入 HTML，三深查图入 JS 互换表 */
const V59_WEBP_HASHES = {
  "assets/v59-cross-examination-desk.webp": "393169cfb065c0916eeddfafbc5c8422cfa0e7a42ae45852027a35138192cd2d",
  "assets/v59-destination-cross-exam.webp": "ef6b24054cf71a5e8914b208bb66db41e213d59552982c872e7d6713acfed12d",
  "assets/v59-evidence-cross-exam.webp": "f921252c256496bc62a1d2438f89dda86fa9d132fc9b5d4137fe453ad5cb7b7e",
  "assets/v59-identity-cross-exam.webp": "037fd2fe1af078846028386e0c2b16e653024904ca28dee4765c4889b9046d33",
};
for (const [asset, hash] of Object.entries(V59_WEBP_HASHES)) {
  const buf = await readFile(new URL(asset, root));
  assert.equal(createHash("sha256").update(buf).digest("hex"), hash, `${asset} must keep its frozen sha256`);
  assert.ok(buf.length > 100000, `${asset} must exist as a full-size transcode`);
  assert.ok(buf.length <= 300000, `${asset} must stay within the 300KB budget`);
}
assert.ok(html.includes("assets/v59-cross-examination-desk.webp"), "desk webp is referenced by its scene");
assert.ok(html.includes('width="1536" height="1024"'), "desk webp keeps the uncropped 1536×1024 stage");
for (const asset of ["assets/v59-identity-cross-exam.webp", "assets/v59-evidence-cross-exam.webp", "assets/v59-destination-cross-exam.webp"]) {
  assert.ok(js.includes(asset), `${asset} must be referenced by the v59 image swap`);
}
assert.match(js, /const CROSS_KEY = "goddead_v59_cross_examination";/);
assert.equal((js.match(/goddead_v59/g) || []).length, 1, "v59 introduces exactly one storage key");
/* getCross：容错归一 + 白名单 history + 派生永不落盘 */
const crossParseBlock = js.match(/const getCross = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(crossParseBlock, "getCross must exist");
assert.match(crossParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt cross storage must be safely repaired");
assert.match(crossParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type cross storage must fall back");
assert.match(crossParseBlock[0], /if \(raw\.version !== CROSS_VERSION\) raw = \{\};/, "wrong-version cross storage is dropped wholesale");
assert.match(crossParseBlock[0], /Math\.min\(CROSS_NUM_CAP, Math\.floor\(n\)\)/, "cross counters must be clamped 0..9999");
assert.match(crossParseBlock[0], /const cycle = getFloor\(\)\.cycle;/, "cross cycle aligns with the v35 floor cycle");
assert.match(crossParseBlock[0], /history = history\.slice\(-CROSS_HISTORY_CAP\);/, "cross history is bounded to the last 16 valid entries");
assert.ok(crossParseBlock[0].indexOf("history = history.slice(-CROSS_HISTORY_CAP);") < crossParseBlock[0].indexOf("let pending = null;"), "canonical history is parsed before pending validation");
assert.match(crossParseBlock[0], /h\.type === "action" && CROSS_DEEP_META\[h\.room\] && CROSS_DEEP_META\[h\.room\]\.actions\[h\.action\]/, "history action entries are whitelisted per room and action");
assert.match(crossParseBlock[0], /h\.type === "intercept" && CROSS_CLOSE_TARGETS\.includes\(h\.target\)/, "history intercept entries are whitelisted per target");
assert.match(crossParseBlock[0], /h\.type === "resolve" && CROSS_DESK_META\[h\.action\] && CROSS_CLOSE_TARGETS\.includes\(h\.target\)/, "history resolve entries are whitelisted per action and target");
assert.match(crossParseBlock[0], /if \(h\.type === "action" && !deep\[h\.room\]\) \{/, "scores and deep rooms derive from current-cycle history, first action per room only");
assert.match(crossParseBlock[0], /if \(bank\) scores\[bank\] = Math\.min\(CROSS_NUM_CAP, scores\[bank\] \+ 2\);/, "resolve entries bank +2 into derived scores (blank seat scores nothing)");
/* deferredTarget 严格重算：末条 canonical close + 当前 v58 重算同目标 + 未交付 */
assert.match(crossParseBlock[0], /appeal\.history\[appeal\.history\.length - 1\]\.type === "close"/, "deferredTarget requires the last canonical v58 close");
assert.match(crossParseBlock[0], /const recomputed = appealCloseTarget\(appeal\.scores, appeal\.settledCount, profile\.liability, profile\.lastRoom\);/, "deferredTarget recomputes the v58 close target from live state");
assert.match(crossParseBlock[0], /sameCycle && intercepted && \(!resolved \|\| pendingIsResolveCandidate\) && deepCount >= 2 && closeLast && !appeal\.pending/, "deferredTarget requires intercept evidence, no completed delivery (a resolve pending still in flight is not delivered), two deep rooms, and no live v58 pending");
assert.match(crossParseBlock[0], /raw\.pending\.kind === "resolve"/, "the in-flight window opens only for a resolve-shaped pending candidate");
assert.match(crossParseBlock[0], /if \(resolved && !pending\) deferredTarget = "";/, "delivered or forged-candidate states always drop the deferred target");
assert.match(crossParseBlock[0], /CROSS_CLOSE_TARGETS\.includes\(raw\.deferredTarget\) && raw\.deferredTarget === recomputed/, "a stored deferredTarget that mismatches the recompute is dropped");
/* pending 三种形状：action/resolve 严格七键、intercept 严格六键、逐字重算、末项证据 */
assert.match(crossParseBlock[0], /p\.kind === "action" && keys === "action,cycle,feedback,kind,room,scene,target"/, "action pending accepts exactly seven whitelisted keys");
assert.match(crossParseBlock[0], /p\.kind === "intercept" && keys === "cycle,deferredTarget,feedback,kind,scene,target"/, "intercept pending accepts exactly six whitelisted keys");
assert.match(crossParseBlock[0], /p\.kind === "resolve" && keys === "action,cycle,deferredTarget,feedback,kind,scene,target"/, "resolve pending accepts exactly seven whitelisted keys");
assert.match(crossParseBlock[0], /p\.feedback === CROSS_DEEP_META\[p\.room\]\.actions\[p\.action\]\.feedback/, "action pending feedback recomputes verbatim from the whitelist");
assert.match(crossParseBlock[0], /p\.feedback === CROSS_INTERCEPT_FEEDBACK/, "intercept pending feedback is the frozen intercept line");
assert.match(crossParseBlock[0], /if \(bank\) pre\[bank\] = Math\.max\(0, pre\[bank\] - 2\);/, "resolve pending re-derives pre-click scores by subtracting the banked +2");
assert.match(crossParseBlock[0], /const blankOk = p\.action !== "blank-seat" \|\| crossBlankSeatArmed\(pre, deepCount\);/, "a forged blank-seat pending without the tie is rejected");
assert.match(crossParseBlock[0], /last && last\.type === "intercept" && last\.cycle === cycle/, "intercept pending needs the canonical history's last entry to be the same intercept");
assert.match(crossParseBlock[0], /last && last\.type === "resolve" && last\.action === p\.action && last\.cycle === cycle/, "resolve pending needs the canonical history's last entry to be the same resolve");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57)/.test(crossParseBlock[0]), "v59 state must not touch earlier keys");
/* saveCross：canonical 六键投影，派生字段永不落盘 */
const crossSaveBlock = js.match(/const saveCross = \(st\) => store\.set\(CROSS_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(crossSaveBlock, "saveCross must persist an explicit canonical projection");
assert.match(crossSaveBlock[0], /version: CROSS_VERSION,/, "saveCross persists the frozen version");
for (const f of ["cycle", "visits", "pending"]) {
  assert.match(crossSaveBlock[0], new RegExp(`${f}: st\\.${f},`), `saveCross persists ${f}`);
}
assert.match(crossSaveBlock[0], /history: st\.history\.slice\(-CROSS_HISTORY_CAP\),/, "saveCross clamps history to <= 16 before persisting");
assert.match(crossSaveBlock[0], /deferredTarget: st\.deferredTarget \|\| null,/, "saveCross persists the deferred target or null");
assert.ok(!/scores|deepCount|intercepted|resolved|pendingTarget/.test(crossSaveBlock[0]), "saveCross must never persist derived fields");
/* 六深查动作：逐字 btn 与精确分值 */
for (const frag of [
  '"replay-voice": { btn: "#identity-action-replay-voice", scores: { convergence: 2 }',
  '"force-name": { btn: "#identity-action-force-name", scores: { coercion: 2, residue: 1 }',
  '"align-timestamps": { btn: "#contradiction-action-align-timestamps", scores: { convergence: 2 }',
  '"lift-blood-wax": { btn: "#contradiction-action-lift-blood-wax", scores: { residue: 2 }',
  '"trace-cable": { btn: "#destination-action-trace-cable", scores: { convergence: 1, coercion: 1, residue: 2 }',
  '"listen-below": { btn: "#destination-action-listen-below", scores: { residue: 2, coercion: 1 }',
]) assert.ok(js.includes(frag), `missing v59 deep action: ${frag.slice(0, 40)}`);
/* 逐字反馈：六深查 + 三封签 + 拦截 + 听证台八段 */
for (const frag of [
  "来电里的喘息与登记台的漏拍重合。两份证词开始共享同一条呼吸。",
  "针尖替空白写下姓名；椅背先收紧，余音才承认那个人存在。",
  "三枚停住的秒针在同一刻复动。矛盾没有消失，只被迫共用一个时间。",
  "罩下的血蜡仍在回温。被删去的证据以指纹的形状留了下来。",
  "缆线绕过门牌，直接勒住收件人的座位。目的地与命令来自同一只手。",
  "井底没有回声，只有下一位收件人被提前念出的呼吸。",
  "听证封签断开。电话那头的喘息被准许再做一次证。",
  "听证封签断开。对照库准许重新称一次血蜡的温度。",
  "听证封签断开。复核井准许再听一次井底的呼吸。",
  "结案印没有落下。三张听证封签把原裁定扣在桌下，要求交叉询问。",
  "证词被编成一股绳，原裁定因此获得第二次生效。",
  "三份证词被强行并排；它们同意的，恰好是从未发生的部分。",
  "勒痕被标在规程上。命令终于暴露了它自己的手腕。",
  "勒痕没有指向命令，只把错误的名字又绑紧了一层。",
  "余响被封进无名档案。被擦掉的那个人在空衣架后继续呼吸。",
  "余响被归档为证物；它不再说话，却开始替所有缺口作证。",
  "第四块铭牌没有刻字。你坐下后，楼层编号从目录里退了一格。",
]) assert.ok(js.includes(frag), `missing v59 feedback: ${frag.slice(0, 18)}`);
/* 听证台路由纯函数：点击前分值决定，全分支冻结 */
const crossDeskResolveBlock = js.match(/const crossDeskResolve = \(action, pre, deferredTarget\) => \{[\s\S]*?\n  \};/);
assert.ok(crossDeskResolveBlock, "crossDeskResolve must be a pure routing function");
assert.match(crossDeskResolveBlock[0], /if \(action === "blank-seat"\) return \{ target: "unnumbered-floor", feedback: "第四块铭牌没有刻字。你坐下后，楼层编号从目录里退了一格。" \};/, "blank seat always routes to the unnumbered floor without scoring");
assert.match(crossDeskResolveBlock[0], /if \(cv >= co && cv >= re\) return \{ target: deferredTarget, feedback: "证词被编成一股绳，原裁定因此获得第二次生效。" \};/, "merge pass delivers the exact deferred target");
assert.match(crossDeskResolveBlock[0], /return \{ target: "concordance-theatre", feedback: "三份证词被强行并排；它们同意的，恰好是从未发生的部分。" \};/, "merge fail routes to the concordance theatre");
assert.match(crossDeskResolveBlock[0], /if \(co >= re\) return \{ target: "protocol-drift", feedback: "勒痕被标在规程上。命令终于暴露了它自己的手腕。" \};/, "mark pass routes to protocol drift");
assert.match(crossDeskResolveBlock[0], /return \{ target: "misbound-handover", feedback: "勒痕没有指向命令，只把错误的名字又绑紧了一层。" \};/, "mark fail routes to the misbound handover");
assert.match(crossDeskResolveBlock[0], /if \(re >= cv\) return \{ target: "blank-name-cloakroom", feedback: "余响被封进无名档案。被擦掉的那个人在空衣架后继续呼吸。" \};/, "archive pass routes to the cloakroom");
assert.match(crossDeskResolveBlock[0], /return \{ target: "evidence-vault", feedback: "余响被归档为证物；它不再说话，却开始替所有缺口作证。" \};/, "archive fail routes to the evidence vault");
/* 无字席条件冻结：三房全深查 + 点击前完全拉平且为正 */
assert.match(js, /const crossBlankSeatArmed = \(pre, deepCount\) => deepCount === 3\s*&& pre\.convergence === pre\.coercion && pre\.coercion === pre\.residue && pre\.convergence > 0;/, "blank seat requires three deep rooms and a positive pre-click tie");
/* 拉平可达性核算：2×2×2=8 种三房深查组合里，只有 force-name + align-timestamps
   + trace-cable = (3,3,3) 完全拉平，其余七组均不拉平 */
{
  const V = {
    "replay-voice": [2, 0, 0], "force-name": [0, 2, 1],
    "align-timestamps": [2, 0, 0], "lift-blood-wax": [0, 0, 2],
    "trace-cable": [1, 1, 2], "listen-below": [0, 1, 2],
  };
  const ties = [];
  for (const i of ["replay-voice", "force-name"]) {
    for (const e of ["align-timestamps", "lift-blood-wax"]) {
      for (const d of ["trace-cable", "listen-below"]) {
        const s = [0, 1, 2].map((k) => V[i][k] + V[e][k] + V[d][k]);
        if (s[0] === s[1] && s[1] === s[2] && s[0] > 0) ties.push(`${i}+${e}+${d} (${s.join(",")})`);
      }
    }
  }
  assert.deepEqual(ties, ["force-name+align-timestamps+trace-cable (3,3,3)"], "exactly one legitimate all-three-room tie arms the blank seat");
}
/* 延迟拦截窄钩子：v58 原 target/feedback/history 照旧，只抑制 pending 转场 */
const appealHubBlock = js.match(/const chooseAppealHub = \(hubKey\) => \{[\s\S]*?\n  \};/);
assert.ok(appealHubBlock, "chooseAppealHub must exist");
const hookIdx = appealHubBlock[0].indexOf("crossSt.deepCount >= 2 && !crossSt.resolved");
assert.ok(hookIdx > appealHubBlock[0].indexOf('st.history.push({ type: "close", cycle: st.cycle });'), "the v59 hook sits after the original target/feedback calculation and the close history append");
assert.ok(hookIdx < appealHubBlock[0].indexOf('st.pending = { kind: "close"'), "the v59 hook intercepts before the v58 pending transition is armed");
assert.match(appealHubBlock[0], /crossSt\.history\.push\(\{ type: "intercept", target, cycle: crossSt\.cycle \}\);/, "the hook records the intercept with the exact original target");
assert.match(appealHubBlock[0], /crossSt\.deferredTarget = target;/, "the hook stores the original target as the strict deferredTarget");
assert.match(appealHubBlock[0], /crossSt\.pending = \{ kind: "intercept", scene: "appeal-registry", target: "cross-examination-desk", deferredTarget: target, feedback: CROSS_INTERCEPT_FEEDBACK, cycle: crossSt\.cycle \};/, "the hook arms the v59 intercept pending verbatim");
assert.match(appealHubBlock[0], /AutoAdvance\.schedule\("appeal-registry", "cross-examination-desk", \{/, "the intercept transitions to the cross-examination desk");
assert.equal((appealHubBlock[0].match(/appealCloseTarget\(st\.scores, st\.settledCount, profile\.liability, profile\.lastRoom\)/g) || []).length, 1, "v58 close routing is computed once, never duplicated");
/* 深查/封签/听证台行为守卫 */
const crossSealBlock = js.match(/const chooseCrossSeal = \(roomKey\) => \{[\s\S]*?\n  \};/);
assert.match(crossSealBlock[0], /if \(currentScene !== sceneName\) return;/, "seal rejects off-scene calls");
assert.match(crossSealBlock[0], /if \(AutoAdvance\.has\(sceneName\)\) return;/, "seal first-locks the beat");
assert.match(crossSealBlock[0], /if \(!getAppeal\(\)\.settled\[roomKey\]\) return;/, "seal is inert before the room settles");
assert.match(crossSealBlock[0], /if \(getCross\(\)\.deep\[roomKey\]\) return;/, "seal is inert after the room went deep");
assert.match(crossSealBlock[0], /crossArmed\[roomKey\] = true;/, "trusted seal activation arms the session deep state (image swap + two hotspots)");
assert.ok(!/history\.push|saveCross/.test(crossSealBlock[0]), "seal activation never writes canonical state");
const crossActionBlock = js.match(/const chooseCrossAction = \(roomKey, actionKey\) => \{[\s\S]*?\n  \};/);
assert.match(crossActionBlock[0], /if \(!getAppeal\(\)\.settled\[roomKey\]\) return;/, "deep actions require the v58 settle first");
assert.match(crossActionBlock[0], /const firstDeep = !doneAction;/, "only the first deep action scores");
assert.match(crossActionBlock[0], /st\.pending = \{ kind: "action", scene: sceneName, room: roomKey, action: actionKey, target: "appeal-registry", feedback: meta\.feedback, cycle: st\.cycle \};/, "deep action pending auto-returns to the appeal registry");
assert.match(crossActionBlock[0], /const feedback = firstDeep \? meta\.feedback : CROSS_DEEP_META\[roomKey\]\.actions\[doneAction\]\.feedback;/, "revisits replay the prior result verbatim");
const crossDeskBlock = js.match(/const chooseCrossDesk = \(actionKey\) => \{[\s\S]*?\n  \};/);
assert.match(crossDeskBlock[0], /if \(st\.resolved\) return;/, "the desk never resolves twice in a cycle");
assert.match(crossDeskBlock[0], /if \(!st\.deferredTarget\) return;/, "the desk is inert without a deferred disposition");
assert.match(crossDeskBlock[0], /if \(actionKey === "blank-seat" && !crossBlankSeatArmed\(pre, st\.deepCount\)\) return;/, "blank seat stays inert without the tie");
assert.match(crossDeskBlock[0], /st\.history\.push\(\{ type: "resolve", action: actionKey, target: r\.target, cycle: st\.cycle \}\);/, "the desk appends the resolve history once");
assert.match(crossDeskBlock[0], /before: \(\) => crossResolveArrive\(r\.target\),/, "final arrival clears pending and deferredTarget");
const crossResolveArriveBlock = js.match(/const crossResolveArrive = \(target\) => \{[\s\S]*?\n  \};/);
assert.match(crossResolveArriveBlock[0], /if \(s\.deferredTarget\) s\.deferredTarget = "";/, "final arrival clears the deferred target");
assert.match(crossResolveArriveBlock[0], /if \(target === "evidence-vault"\) markReviewVisited\("evidence-vault"\);/, "final arrival grants the evidence vault credential");
assert.match(crossResolveArriveBlock[0], /if \(LEDGER_SCENE_KEY\[target\]\) grantLedgerVisit\(target\);/, "final arrival grants v57-scene credentials");
/* 守卫、接线与遗忘 */
assert.match(js, /if \(target === "cross-examination-desk" && crossGuard\.pendingTarget !== target && !crossGuard\.visits\.desk\) \{/, "the desk guard admits only legal pending or a genuine desk visit");
assert.match(js, /target = appealGuard\.pendingTarget === "appeal-registry" \|\| appealGuard\.visits\.registry > 0 \? "appeal-registry" : "unnumbered-floor";/, "the desk guard falls back to a legal appeal registry, else the unnumbered floor");
assert.match(js, /if \(APPEAL_SCENE_KEY\[name\] && APPEAL_SCENE_KEY\[name\] !== "registry"\) \{ syncCrossRoom\(APPEAL_SCENE_KEY\[name\]\); replayCrossPending\(name\); \}/, "room entry syncs the deep state and replays a legal v59 pending");
assert.match(js, /if \(name === "appeal-registry"\) replayCrossPending\(name\);/, "the registry replays a legal intercept pending");
assert.match(js, /if \(name === "cross-examination-desk"\) \{ enterCrossDesk\(\); replayCrossPending\(name\); \}/, "desk entry replays a legal resolve pending");
assert.match(forgetBlockV56[0], /syncCrossLink\(\);/, "forget-all resets the v59 directory link");
assert.match(forgetBlockV56[0], /paintCrossMemory\(\);/, "forget-all hides the v59 memory line");
assert.match(forgetBlockV56[0], /resetCrossArmed\(\);\s*APPEAL_ROOM_KEYS\.forEach\(syncCrossRoom\);/, "forget-all disarms and restores every room image/hotspot/seal state");
const syncCrossRoomBlock = js.match(/const syncCrossRoom = \(roomKey\) => \{[\s\S]*?\n  \};/);
assert.match(syncCrossRoomBlock[0], /const isDeep = Boolean\(deepAction\) \|\| crossArmed\[roomKey\];/, "the deep visual state derives from canonical history or a trusted session arming");
assert.match(syncCrossRoomBlock[0], /if \(img\) img\.src = isDeep \? meta\.img : meta\.baseImg;/, "the room image swaps to the deep webp and back");
assert.match(syncCrossRoomBlock[0], /if \(appeal\.settled\[roomKey\] && !isDeep\) seal\.removeAttribute\("hidden"\);/, "the hearing seal only shows on a settled, not-yet-deep room");
assert.match(syncCrossRoomBlock[0], /if \(isDeep\) btn\.setAttribute\("hidden", ""\);\s*else btn\.removeAttribute\("hidden"\);/, "the original v58 hotspots hide in the deep state and restore after forget");
assert.match(syncCrossRoomBlock[0], /if \(responseEl\) responseEl\.textContent = deepAction \? meta\.actions\[deepAction\]\.feedback : "";/, "the deep revisit shows the prior result without rescoring");
/* synthetic 守卫：v59 三组监听只接受 isTrusted 真实 click */
assert.match(js, /if \(sealBtn\) sealBtn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseCrossSeal\(roomKey\); \}\);/, "seal listeners reject synthetic clicks");
assert.match(js, /if \(btn\) btn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseCrossAction\(roomKey, actionKey\); \}\);/, "deep action listeners reject synthetic clicks");
assert.match(js, /if \(btn\) btn\.addEventListener\("click", \(ev\) => \{ if \(!ev\.isTrusted\) return; chooseCrossDesk\(actionKey\); \}\);/, "desk listeners reject synthetic clicks");
/* DOM：听证台场景入图、三房封签与深查热点出厂 hidden、目录×1、记忆单行、8 卡 */
{
  const section = html.match(/<section class="scene scene-branch scene-cross-examination-desk"[\s\S]*?<\/section>/);
  assert.ok(section, "scene section missing: cross-examination-desk");
  assert.ok(section[0].includes("forecourt-tactile-stage"), "the desk uses the 3:2 tactile stage");
  assert.ok(!section[0].includes("branch-choices") && !section[0].includes("<svg"), "the desk must not degrade to cards or inline SVG");
  assert.ok(section[0].includes("ledger-slip"), "the desk carries the hearing slip");
  const figure = section[0].match(/<figure[\s\S]*?<\/figure>/);
  for (const id of ["cross-action-merge-testimonies", "cross-action-mark-coercion", "cross-action-archive-residue", "cross-action-blank-seat"]) {
    assert.ok(figure[0].includes(`id="${id}"`), `desk figure must hold #${id}`);
  }
  assert.match(figure[0], /id="cross-action-blank-seat" type="button" aria-pressed="false" data-hover hidden/, "the blank seat ships hidden");
  assert.ok(!section[0].includes("scene-exits"), "the desk has no bottom continue");
  for (const attr of ["data-cross-convergence", "data-cross-coercion", "data-cross-residue", "data-cross-deep-count"]) {
    assert.ok(section[0].includes(attr), `desk slip must carry ${attr}`);
  }
}
for (const [scene, seal, deepIds] of [
  ["identity-correction", "identity-hearing-seal", ["identity-action-replay-voice", "identity-action-force-name"]],
  ["evidence-contradiction", "contradiction-hearing-seal", ["contradiction-action-align-timestamps", "contradiction-action-lift-blood-wax"]],
  ["destination-review-shaft", "destination-hearing-seal", ["destination-action-trace-cable", "destination-action-listen-below"]],
]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-${scene}"[\\s\\S]*?<\\/section>`));
  const figure = section[0].match(/<figure[\s\S]*?<\/figure>/);
  assert.match(figure[0], new RegExp(`id="${seal}" type="button" aria-pressed="false" data-hover hidden`), `${scene} hearing seal ships hidden inside the figure`);
  for (const id of deepIds) {
    assert.match(figure[0], new RegExp(`id="${id}" type="button" aria-pressed="false" data-hover hidden`), `${scene} deep hotspot #${id} ships hidden`);
  }
}
assert.match(html, /<a href="#cross-examination-desk" id="cross-exam-link" hidden data-hover>01ωδ \/ 交叉听证<\/a>/);
assert.ok(html.includes('id="cross-exam-memory"'), "remembrance gains the cross-examination memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");
assert.match(js, /交叉听证：合流 \$\{st\.scores\.convergence\}，胁迫 \$\{st\.scores\.coercion\}，残响 \$\{st\.scores\.residue\}，本轮深查 \$\{st\.deepCount\}\/3。/, "cross memory line verbatim");
assert.match(js, /原裁定本要送往「\$\{CROSS_TARGET_LABEL\[st\.deferredTarget\]\}」/, "the desk shows the original disposition atmospherically");
for (const cls of ["identity-spot-hearing-seal", "contradiction-spot-hearing-seal", "destination-spot-hearing-seal", "identity-spot-replay-voice", "identity-spot-force-name", "contradiction-spot-align", "contradiction-spot-lift", "destination-spot-trace", "destination-spot-listen", "cross-spot-merge", "cross-spot-mark", "cross-spot-archive", "cross-spot-blank-seat"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}
/* v59 设计文档存在且冻结四张源图哈希 */
const v59doc = await fileText("docs/V59CrossExaminationDesign.md");
for (const hash of Object.values(V59_SOURCE_HASHES)) {
  assert.ok(v59doc.includes(hash), "V59 design doc must freeze the source sha256 values");
}
assert.match(v59doc, /goddead_v59_cross_examination/, "V59 design doc must freeze the storage key");

/* ---------- v60 证物链：v33/v34 两结果房图内化 + 证物链办公室 ---------- */
const V60_SOURCE_HASHES = {
  "design-references/source-v60-evidence-custody-vault.png": "a08de54d0d73f39a911e41debac97aee0a916a1ff971bc232f238e0d5c154c41",
  "design-references/source-v60-false-positive-custody-shaft.png": "44b17233f34c85978e3df12a8185df3ed42ea150bd7d96f0c766edbe1fe75368",
  "design-references/source-v60-chain-of-custody-office.png": "1cad3a7733756daf4b018d2d6e8a7f96926ef136bed0e1f53c1fecc36ef8e7d1",
};
for (const [src, sha] of Object.entries(V60_SOURCE_HASHES)) {
  const buf = await readFile(new URL(src, root));
  assert.equal(createHash("sha256").update(buf).digest("hex"), sha, `${src} sha256 drifted`);
}
const V60_WEBP = {
  "assets/v60-evidence-custody-vault.webp": "ab020b572944ce59631c5584406a023c8ff442a0c443070467f77ee57ba662f7",
  "assets/v60-false-positive-custody-shaft.webp": "92bc68ed0efecdc11036aad3a74e2f96577ba6162e75bc1de4d226452dcddecf",
  "assets/v60-chain-of-custody-office.webp": "309f563ecc98c75b64dcef44b95d0736fe483a06492cbd718e1b8d8e44ef446b",
};
for (const [asset, sha] of Object.entries(V60_WEBP)) {
  const buf = await readFile(new URL(asset, root));
  assert.equal(createHash("sha256").update(buf).digest("hex"), sha, `${asset} sha256 drifted`);
  assert.ok(buf.length <= 300 * 1024 && buf.length > 100 * 1024, `${asset} must stay within the bitmap budget (${buf.length} bytes)`);
}
assert.match(html, /assets\/v60-chain-of-custody-office\.webp/, "custody office references its asset");

/* 八个旧 id 原样保留、移入各自 figure；底部卡片容器已删除、无隐藏副本 */
for (const [sc, ids] of [["evidence-vault", ["vault-choice-seal", "vault-choice-return", "vault-choice-leave", "vault-choice-valuation"]], ["false-positive-shaft", ["shaft-choice-retrieve", "shaft-choice-append", "shaft-choice-admit", "shaft-choice-valuation"]]]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-${sc}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${sc}`);
  const fig = section[0].match(/<figure class="branch-figure forecourt-tactile-stage[\s\S]*?<\/figure>/);
  assert.ok(fig, `${sc} figure must use the tactile stage`);
  for (const id of ids) {
    assert.equal((section[0].match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `${sc} #${id} appears exactly once`);
    assert.ok(fig[0].includes(`id="${id}"`), `${sc} #${id} lives inside the figure`);
  }
  assert.ok(!section[0].includes("branch-choices"), `${sc} must drop the old card list container`);
  assert.ok(!section[0].includes("<svg"), `${sc} must not use inline SVG`);
  assert.ok(!section[0].includes('loading="lazy"'), `${sc} stage image must not lazy-load`);
}

/* 证物链办公室：图内四机关，空白见证位出厂 hidden */
const chainSection = html.match(/<section class="scene scene-branch scene-chain-of-custody-office"[\s\S]*?<\/section>/);
assert.ok(chainSection, "chain-of-custody-office scene section missing");
assert.ok(chainSection[0].includes("证物链办公室"), "office shows its title");
const chainFig = chainSection[0].match(/<figure class="branch-figure forecourt-tactile-stage[\s\S]*?<\/figure>/);
assert.ok(chainFig, "office figure must use the tactile stage");
for (const id of ["chain-action-reseal", "chain-action-amend", "chain-action-claim", "chain-action-void"]) {
  assert.equal((chainSection[0].match(new RegExp(`id="${id}"`, "g")) || []).length, 1, `office #${id} appears exactly once`);
  assert.ok(chainFig[0].includes(`id="${id}"`), `office #${id} lives inside the figure`);
}
assert.match(chainSection[0], /id="chain-action-void"[^>]*hidden/, "void seat ships hidden");
assert.ok(!chainSection[0].includes("branch-choices") && !chainSection[0].includes("<svg"), "the office must not degrade to cards or inline SVG");
assert.match(chainSection[0], /id="chain-response" aria-live="polite"/, "office feedback is an aria-live region");
for (const sel of ["data-chain-custody", "data-chain-revision", "data-chain-claim", "data-chain-count"]) {
  assert.ok(chainSection[0].includes(sel), `office slip missing ${sel}`);
}
assert.match(html, /<a href="#chain-of-custody-office" id="custody-chain-link" hidden/, "directory gains the hidden custody link");
assert.ok(html.includes('01ωε / 证物链'), "directory label verbatim");
assert.ok(html.includes('id="custody-chain-memory"'), "remembrance gains the custody memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");

/* 状态契约：唯一 key、canonical 八键、白名单归一 */
assert.match(js, /const CUSTODY_KEY = "goddead_v60_chain_of_custody";/);
assert.equal((js.match(/goddead_v60_chain_of_custody/g) || []).length, 2, "v60 key literal appears only in its own block (comment + const), never re-referenced by string");
const custodyParseBlock = js.match(/const getCustody = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(custodyParseBlock, "getCustody must exist");
assert.match(custodyParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt custody storage must be safely repaired");
assert.match(custodyParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type storage must fall back");
assert.match(custodyParseBlock[0], /visited\[k\] = Boolean\(raw\.visited && raw\.visited\[k\] === true\)/, "visited stays three booleans");
assert.match(custodyParseBlock[0], /Math\.min\(CUSTODY_NUM_CAP, Math\.floor\(n\)\)/, "numbers are clamped to 0..9999");
assert.match(custodyParseBlock[0], /\[\.\.\.new Set\(raw\.cycleActions\.filter\(\(a\) => CUSTODY_ACTION_IDS\.includes\(a\)\)\)\]\.slice\(0, 8\)/, "cycleActions are whitelisted, deduped, capped at 8");
assert.match(custodyParseBlock[0], /\["vault", "shaft"\]\.includes\(raw\.lastSource\) \? raw\.lastSource : ""/, "lastSource whitelist");
assert.match(custodyParseBlock[0], /CUSTODY_ACTION_IDS\.includes\(raw\.lastAction\) \? raw\.lastAction : ""/, "lastAction whitelist");
assert.match(custodyParseBlock[0], /Object\.keys\(p\)\.sort\(\)\.join\(","\) === "action,feedback,scene,target"/, "pending accepts exactly four whitelisted keys");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59)/.test(custodyParseBlock[0]), "v60 state must not touch earlier keys");
const custodySaveBlock = js.match(/const saveCustody = \(st\) => store\.set\(CUSTODY_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(custodySaveBlock, "saveCustody must persist an explicit canonical projection");
for (const f of ["visited", "scores", "lastSource", "lastAction", "officeRuns", "transfers", "pending"]) {
  assert.match(custodySaveBlock[0], new RegExp(`${f}: st\\.${f},`), `saveCustody persists ${f}`);
}
assert.match(custodySaveBlock[0], /cycleActions: st\.cycleActions\.slice\(0, 8\),/, "saveCustody clamps cycleActions to <= 8");
assert.equal((custodySaveBlock[0].match(/^\s+\w+:/gm) || []).length, 8, "saveCustody persists exactly the eight canonical keys");

/* 八源动作固定分值映射逐字冻结 */
for (const frag of [
  'sealedClearestAnomaly: { source: "vault", scores: { custody: 2 } }',
  'returnedBaselineToVestibule: { source: "vault", scores: { claim: 2 } }',
  'leftThroughBrokenSeal: { source: "vault", scores: { revision: 2 } }',
  'sentEvidenceToValuation: { source: "vault", scores: { custody: 1, claim: 1 } }',
  'retrievedRejectedCase: { source: "shaft", scores: { custody: 1, claim: 1 } }',
  'appendedFalseReport: { source: "shaft", scores: { revision: 2 } }',
  'admittedExtraItem: { source: "shaft", scores: { claim: 2 } }',
  'declaredRejectAsAsset: { source: "shaft", scores: { revision: 1, claim: 1 } }',
]) assert.ok(js.includes(frag), `missing v60 source action: ${frag.slice(0, 40)}`);
/* 解锁条件：≥3 个不同动作且两房各至少一个；只在本轮首次成立的那一拍截留 */
assert.match(js, /const custodyUnlocked = \(actions\) => actions\.length >= 3\s*&& actions\.some\(\(a\) => CUSTODY_SOURCE_ACTIONS\[a\]\.source === "vault"\)\s*&& actions\.some\(\(a\) => CUSTODY_SOURCE_ACTIONS\[a\]\.source === "shaft"\);/, "unlock needs 3 distinct actions across both rooms");
assert.match(js, /intercepted = !st\.pending && !wasUnlocked && custodyUnlocked\(st\.cycleActions\);/, "only the first click that newly satisfies the condition intercepts");
assert.match(js, /if \(!st\.cycleActions\.includes\(actionId\)\) \{/, "repeat source actions never re-score");
assert.ok(js.includes("证物链扣住了原去向。办公室的门在这时打开。"), "intercept suffix verbatim");
assert.match(js, /p\.feedback === custodyBaseResponse\(p\.action\) \+ CUSTODY_INTERCEPT_SUFFIX/, "source pending feedback recomputes verbatim");
assert.match(js, /cycleActions\.includes\(p\.action\) && custodyUnlocked\(cycleActions\)/, "source pending needs the action still registered and the unlock standing");

/* 办公室分流真值表逐字冻结：点击后分值路由（先入账 +2），全等退责任账房 */
assert.match(js, /post\[CUSTODY_OFFICE_ACTIONS\[actionId\]\.bank\] = Math\.min\(CUSTODY_NUM_CAP, post\[CUSTODY_OFFICE_ACTIONS\[actionId\]\.bank\] \+ 2\);/, "office routes on post-click scores, capped at 9999 so feedback never exceeds the stored score");
const custodyRouteBlock = js.match(/const custodyOfficeRoute = \(actionId, pre\) => \{[\s\S]*?\n  \};/);
assert.ok(custodyRouteBlock, "custodyOfficeRoute must be a pure routing function");
assert.match(custodyRouteBlock[0], /if \(actionId === "void"\) return \{ target: "unnumbered-floor", feedback: "见证位空了。你抽走的那一格从未存在，楼层编号又退了一格。" \};/, "void always routes to the unnumbered floor without scoring");
assert.match(custodyRouteBlock[0], /if \(c === r && r === k\) return \{ target: "liability-ledger"/, "full tie (including action-completed ties) returns to the liability ledger");
assert.match(custodyRouteBlock[0], /if \(c > r && c > k\) return \{ target: "retention-vault"/, "strict custody high routes to the retention vault");
assert.match(custodyRouteBlock[0], /if \(r > c && r > k\) return \{ target: "protocol-drift"/, "strict revision high routes to protocol drift");
assert.match(custodyRouteBlock[0], /if \(k > c && k > r\) return \{ target: "returned-address-cabinet"/, "strict claim high routes to the returned-address cabinet");
assert.match(custodyRouteBlock[0], /if \(c === r\) return \{ target: "false-confirmation-desk"/, "custody-revision tie routes to the false-confirmation desk");
assert.match(custodyRouteBlock[0], /if \(c === k\) return \{ target: "witness-carbon-archive"/, "custody-claim tie routes to the witness-carbon archive");
assert.match(custodyRouteBlock[0], /return \{ target: "blank-name-cloakroom"/, "revision-claim tie routes to the blank-name cloakroom");
assert.match(js, /const custodyVoidArmed = \(scores\) => scores\.custody === scores\.revision && scores\.revision === scores\.claim && scores\.custody > 0;/, "void seat requires a positive pre-click tie");

/* 逐字反馈：截留后缀 + 办公室七分支 + void */
for (const frag of [
  "三项完全拉平。链条拒绝指出责任方，整链退回责任账房过秤。",
  "保全占上风。链条只进不出，证物送去留置空库。",
  "改写占上风。被改写过的环节需要守则重写自己，证物送去守则漂移。",
  "认领占上风。每一环都有了签收人，证物送去退址格柜。",
  "保全与改写拉平、压过认领。封得好与改得对互相确认，证物送去假确认台。",
  "保全与认领拉平、压过改写。每一环都有人见证，副本送去见证复写库。",
  "改写与认领拉平、压过保全。改掉的名字无人认领，证物寄存到空名寄存处。",
]) assert.ok(js.includes(frag), `missing v60 office feedback: ${frag.slice(0, 18)}`);

/* 交互硬要求：live scene 校验、首选锁、第一拍后全热点 disabled、到达清零开新轮 */
const chooseReviewBlock = js.match(/const chooseReviewResult = \(sceneKey, mark\) => \{[\s\S]*?\n  \};/);
assert.match(chooseReviewBlock[0], /if \(currentScene !== sceneKey\) return;/, "v33 result actions validate the live scene");
assert.match(chooseReviewBlock[0], /custodyLockButtons\(sceneKey\);/, "accepted source beat disables every hotspot in the scene");
assert.match(chooseReviewBlock[0], /const custody = custodySourceBeat\(sceneKey, mark, choice\.target\);/, "v60 interception hooks after the old side effects");
assert.match(chooseReviewBlock[0], /choice\.response \+ custody\.suffix/, "old feedback stays verbatim, suffix only appended");
const chooseValEntryBlock60 = js.match(/const chooseValuationEntry = \(sceneKey\) => \{[\s\S]*?\n  \};/);
assert.match(chooseValEntryBlock60[0], /if \(currentScene !== sceneKey\) return;/, "v34 entry actions validate the live scene");
assert.match(chooseValEntryBlock60[0], /custodyLockButtons\(sceneKey\);/, "accepted v34 entry disables every hotspot in the scene");
assert.match(chooseValEntryBlock60[0], /custodySourceBeat\(sceneKey, meta\.mark, "unclaimed-valuation"\)/, "v60 interception hooks the valuation entry");
const chooseOfficeBlock = js.match(/const chooseCustodyOffice = \(actionId\) => \{[\s\S]*?\n  \};/);
assert.match(chooseOfficeBlock[0], /if \(currentScene !== CUSTODY_OFFICE\) return;/, "office actions validate the live scene");
assert.match(chooseOfficeBlock[0], /if \(AutoAdvance\.has\(CUSTODY_OFFICE\)\) return;/, "office actions respect the first-lock");
assert.match(chooseOfficeBlock[0], /if \(st\.pending\) return;/, "office never acts twice under a live pending");
assert.match(chooseOfficeBlock[0], /custodyLockButtons\(CUSTODY_OFFICE\);/, "first accepted office action disables every mechanism");
const officeArriveBlock = js.match(/const custodyOfficeArrive = \(target\) => \{[\s\S]*?\n  \};/);
assert.match(officeArriveBlock[0], /s\.officeRuns = Math\.min\(CUSTODY_NUM_CAP, s\.officeRuns \+ 1\);/, "officeRuns increments once per settlement");
assert.match(officeArriveBlock[0], /s\.transfers = Math\.min\(CUSTODY_NUM_CAP, s\.transfers \+ 1\);/, "transfers increments once per settlement");
assert.match(officeArriveBlock[0], /s\.cycleActions = \[\];/, "leaving the office opens a fresh round");
assert.match(officeArriveBlock[0], /if \(LEDGER_SCENE_KEY\[target\]\) grantLedgerVisit\(target\);/, "ledger targets regain their old guard credentials");
assert.match(js, /if \(name === "chain-of-custody-office"\) \{ enterCustodyOffice\(\); replayCustodyPending\(name\); \}/, "office scene init wiring");
assert.match(js, /if \(REVIEW_RESULT_SCENES\.includes\(name\)\) \{ enterReviewResult\(name\); replayCustodyPending\(name\); \}/, "source scenes replay the custody pending");
const custodyReplayBlock = js.match(/const replayCustodyPending = \(sceneName\) => \{[\s\S]*?\n  \};/);
assert.ok(custodyReplayBlock, "replayCustodyPending must exist");
assert.equal((custodyReplayBlock[0].match(/custodyLockButtons\(/g) || []).length, 2, "pending replay re-locks every hotspot in both branches");
assert.match(custodyReplayBlock[0], /custodyLockButtons\(CUSTODY_OFFICE\);/, "office pending replay locks all four mechanisms");
assert.match(custodyReplayBlock[0], /custodyLockButtons\(sceneName\);/, "source pending replay locks all four hotspots");
assert.match(custodyReplayBlock[0], /CUSTODY_OFFICE_ACTIONS\[p\.action\]\.btn\);\s*\n\s*if \(btn\) btn\.setAttribute\("aria-pressed", "true"\);/, "office pending replay restores the chosen mechanism's aria-pressed");
/* 办公室按设计是开放场景（同 protocol-drift）：resolveScene 不得为它改写落点，
   直 hash 可用三个常规机关，0/0/0 时稀有机关由 paintCustody 保持 hidden */
const resolveSceneBlock60 = js.match(/const resolveScene = \(name\) => \{[\s\S]*?\n  \};/);
assert.ok(!resolveSceneBlock60[0].includes("chain-of-custody-office"), "the office stays an open scene by design");
/* 遗忘全部：v60 DOM 回弹接线 */
assert.match(js, /syncCustodyLink\(\);\s*\n\s*paintCustody\(\);\s*\n\s*CUSTODY_SOURCE_SCENES\.forEach\(custodyUnlockButtons\);\s*\n\s*custodyUnlockButtons\(CUSTODY_OFFICE\);/, "forget-all rebounds every v60 DOM surface");

/* 热点定位类与短桌面规则 */
for (const cls of ["vault-spot-seal", "vault-spot-return", "vault-spot-leave", "vault-spot-valuation", "shaft-spot-retrieve", "shaft-spot-append", "shaft-spot-admit", "shaft-spot-valuation", "chain-spot-reseal", "chain-spot-amend", "chain-spot-claim", "chain-spot-void"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}
assert.match(css, /#scene-chain-of-custody-office \.branch-figure \{ width: min\(460px, 100%\); \}/, "short-desktop office figure rule");
assert.match(css, /#scene-evidence-vault \.branch-figure,/, "short-desktop vault figure rule");
assert.match(css, /#scene-false-positive-shaft \.branch-figure,/, "short-desktop shaft figure rule");

/* v60 设计文档存在且冻结三张源图哈希 */
const v60doc = await fileText("docs/V60ChainOfCustodyDesign.md");
for (const hash of Object.values(V60_SOURCE_HASHES)) {
  assert.ok(v60doc.includes(hash), "V60 design doc must freeze the source sha256 values");
}

/* ---------- v54 迫近回访：v29 三房共同记账 + 异动第四热点九分流 ---------- */
/* 三张 v54 异动正式图存在且被引用，三张冻结源 PNG 保留 */
for (const asset of ["assets/v54-echo-approach.webp", "assets/v54-vein-approach.webp", "assets/v54-confession-approach.webp"]) {
  await access(new URL(asset, root));
  assert.ok(js.includes(asset), `${asset} must be referenced by the v54 approach swap`);
}
for (const src of ["design-references/source-v54-echo-approach.png", "design-references/source-v54-vein-approach.png", "design-references/source-v54-confession-approach.png"]) {
  await access(new URL(src, root));
}
assert.match(js, /const PRESSURE_KEY = "goddead_v54_return_pressure";/);
assert.equal((js.match(/goddead_v54/g) || []).length, 1, "v54 introduces exactly one storage key");
const pressureParseBlock = js.match(/const getPressure = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(pressureParseBlock, "getPressure must exist");
assert.match(pressureParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt pressure storage must be safely repaired");
assert.match(pressureParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type pressure storage must fall back");
assert.match(pressureParseBlock[0], /Math\.min\(PRESSURE_NUM_CAP, Math\.floor\(n\)\)/, "pressure counters must be clamped 0..9999");
assert.match(pressureParseBlock[0], /history = history\.slice\(-PRESSURE_HISTORY_CAP\);/, "history is bounded to the last 16 valid entries");
assert.ok(pressureParseBlock[0].indexOf("history = history.slice(-PRESSURE_HISTORY_CAP);") < pressureParseBlock[0].indexOf("let pending = null;"), "canonical history is parsed before pending validation");
assert.match(pressureParseBlock[0], /Object\.keys\(p\)\.sort\(\)\.join\(","\) === "choice,feedback,room,target"/, "pending accepts exactly four whitelisted keys, extra keys are forged");
assert.match(pressureParseBlock[0], /breachTotal >= 1 && breaches\[p\.room\] >= 1 && total >= 6 \* breachTotal/, "pending needs a real consumption: breachTotal >= 1, the room breached, and the six-point backing relation");
assert.match(pressureParseBlock[0], /last\.type === "breach" && last\.room === p\.room && last\.choice === p\.choice/, "pending needs the canonical history's last entry to be the same room/choice breach");
assert.match(pressureParseBlock[0], /p\.target === meta\.target && p\.feedback === meta\.feedback/, "pending target and verbatim feedback are recomputed from the whitelist");
assert.match(pressureParseBlock[0], /const approach = Math\.max\(0, total - 6 \* breachTotal\);/, "approach is re-derived, never trusted");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53)/.test(pressureParseBlock[0]), "v54 state must not touch earlier keys");
/* 存盘收口：savePressure 只持久化 canonical 五部分，派生字段永不落盘 */
const pressureSaveBlock = js.match(/const savePressure = \(st\) => store\.set\(PRESSURE_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(pressureSaveBlock, "savePressure must persist an explicit canonical projection");
assert.match(pressureSaveBlock[0], /scores: st\.scores,/, "savePressure persists scores");
assert.match(pressureSaveBlock[0], /choices: st\.choices,/, "savePressure persists choices");
assert.match(pressureSaveBlock[0], /breaches: st\.breaches,/, "savePressure persists breaches");
assert.match(pressureSaveBlock[0], /pending: st\.pending,/, "savePressure persists pending");
assert.match(pressureSaveBlock[0], /history: st\.history\.slice\(-PRESSURE_HISTORY_CAP\),/, "savePressure clamps history to <= 16 before persisting");
assert.ok(!/approach|breachTotal|st\.total/.test(pressureSaveBlock[0]), "savePressure must never persist derived fields");
/* chooseBranch 共享守卫：live scene + first-lock，九个旧选择语义不变，v54 钩子在接受之后 */
const chooseBranchBlock = js.match(/const chooseBranch = \(sceneKey, choiceKey\) => \{[\s\S]*?\n  \};/);
assert.match(chooseBranchBlock[0], /if \(currentScene !== sceneKey\) return;/, "chooseBranch rejects off-scene calls");
assert.match(chooseBranchBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "chooseBranch first-locks the beat");
assert.match(chooseBranchBlock[0], /saveBranches\(st\);[\s\S]*?recordPressureChoice\(sceneKey, choiceKey\);/, "v54 scoring hooks in only after the v29 acceptance point");
const recordPressureBlock = js.match(/const recordPressureChoice = \(room, choice\) => \{[\s\S]*?\n  \};/);
assert.match(recordPressureBlock[0], /st\.scores\[room\] = Math\.min\(PRESSURE_NUM_CAP, st\.scores\[room\] \+ 1\);/, "room score increments once per accepted choice");
assert.match(recordPressureBlock[0], /st\.choices\[room\]\[choice\] = Math\.min\(PRESSURE_NUM_CAP, st\.choices\[room\]\[choice\] \+ 1\);/, "per-choice counter increments once");
/* 第四热点九分流：逐字反馈与白名单目标 */
for (const frag of [
  'knock: { target: "counter-knock-gallery", feedback: "蜡封在听筒里裂开。门外那三记敲声被倒送进回敲廊。"',
  'steps: { target: "lagging-shadow-cloister", feedback: "听筒没有线，脚步却从滞后的影子里接通。"',
  'bell: { target: "minute-before-archive", feedback: "03:17 从听筒里提前了一分钟。档案井已经在等。"',
  'down: { target: "seeping-records", feedback: "红柱顺流坠下，把井水压进渗水档案池。"',
  'up: { target: "reverse-laundry", feedback: "指针倒着越过零。逆照洗衣房开始回流。"',
  'isolate: { target: "bellless-ward", feedback: "玻璃里只剩一段无声脉搏。无铃病房替它开门。"',
  'door: { target: "blank-receipt-press", feedback: "抽屉退回一张空白收据，敲门被压成未填项目。"',
  'seven: { target: "protocol-drift", feedback: "第七条从抽屉背面翻出，守则的字开始漂移。"',
  'refuse: { target: "blank-name-cloakroom", feedback: "黑色名带没有写字，却替你寄存了拒绝。"',
]) assert.ok(js.includes(frag), `missing v54 breach mapping: ${frag.slice(0, 24)}`);
/* 第四热点处理器守卫：live scene + first-lock + 点击前 approach>=6 + 合法 lastChoice */
const breachBlock = js.match(/const choosePressureBreach = \(room\) => \{[\s\S]*?\n  \};/);
assert.match(breachBlock[0], /if \(currentScene !== room\) return;/, "breach rejects off-scene calls");
assert.match(breachBlock[0], /if \(AutoAdvance\.has\(room\)\) return;/, "breach shares the v29 first-lock");
assert.match(breachBlock[0], /if \(st\.approach < PRESSURE_BREACH_MIN\) return;/, "breach requires approach >= 6 before the click");
assert.match(breachBlock[0], /const lastChoice = getBranches\(\)\.lastChoice\[room\];/, "breach routes by the room's legal v29 lastChoice");
assert.match(breachBlock[0], /st\.breaches\[room\] = Math\.min\(PRESSURE_NUM_CAP, st\.breaches\[room\] \+ 1\);/, "breach consumes exactly once");
/* 第四热点显隐：迫近 >= 6 且该房合法 lastChoice；变异图阈值 >= 3 */
const syncPressureBlock = js.match(/const syncPressureRoom = \(room\) => \{[\s\S]*?\n  \};/);
assert.match(syncPressureBlock[0], /const moved = st\.approach >= PRESSURE_APPROACH_IMG;/, "approach >= 3 swaps the room figure");
assert.match(syncPressureBlock[0], /const armed = st\.approach >= PRESSURE_BREACH_MIN && !!PRESSURE_BREACH\[room\]\[lastChoice\];/, "fourth hotspot needs approach >= 6 and a legal lastChoice");
/* DOM：九旧热点入图、第四热点 hidden、旧卡容器删除、统计签、目录 01δ½、记忆单行、仍八卡 */
for (const [b, ids] of Object.entries({ echo: ["echo-choice-knock", "echo-choice-steps", "echo-choice-bell", "echo-breach-receiver"], vein: ["vein-choice-down", "vein-choice-up", "vein-choice-isolate", "vein-breach-gauge"], confession: ["confession-choice-door", "confession-choice-seven", "confession-choice-refuse", "confession-breach-drawer"] })) {
  const section = html.match(new RegExp(`<section class="scene scene-branch" id="scene-${b}"[\\s\\S]*?<\\/section>`));
  assert.ok(section[0].includes("forecourt-tactile-stage"), `${b} figure becomes the 3:2 tactile stage`);
  const figure = section[0].match(/<figure[\s\S]*?<\/figure>/);
  for (const id of ids) assert.ok(figure[0].includes(`id="${id}"`), `${b} figure must hold #${id} inside the picture`);
  assert.ok(!section[0].includes("branch-choices"), `${b} must drop the old card list container`);
  assert.ok(section[0].includes("pressure-slip"), `${b} carries the compact pressure slip`);
}
for (const id of ["echo-breach-receiver", "vein-breach-gauge", "confession-breach-drawer"]) {
  assert.match(html, new RegExp(`id="${id}" type="button" aria-pressed="false" data-hover hidden`), `${id} ships hidden`);
}
assert.ok(!html.includes('id="echo-choices"') && !html.includes('id="vein-choices"') && !html.includes('id="confession-choices"'), "the three v29 card containers must be deleted entirely");
assert.match(html, /<a href="#echo" id="pressure-link" hidden data-hover>01δ½ \/ 迫近回访<\/a>/);
assert.ok(html.includes('id="pressure-memory"'), "remembrance gains the pressure memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");
assert.match(js, /迫近回访：回声累计 \$\{st\.scores\.echo\}，脉压 \$\{st\.scores\.vein\}，名重 \$\{st\.scores\.confession\}/, "pressure memory line verbatim");
assert.match(js, /if \(BRANCH_SCENES\.includes\(name\)\) \{ enterBranch\(name\); syncPressureRoom\(name\); replayPressurePending\(name\); paintPressure\(\); \}/, "scene entry syncs the pressure room and replays a legal pending");
for (const cls of ["archive-spot-knock", "archive-spot-steps", "archive-spot-bell", "archive-spot-breach", "well-spot-down", "well-spot-up", "well-spot-isolate", "well-spot-breach", "scale-spot-door", "scale-spot-seven", "scale-spot-refuse", "scale-spot-breach"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}

/* ---------- v55 失常交班：三房巡检循环 + 三个异常后室 ---------- */
/* 六张冻结源 PNG 存在且 sha256 与监理冻结值一致 */
const V55_SOURCE_HASHES = {
  "design-references/source-v55-ward-anomaly.png": "1a201c5658f61b18b9d8f00225187dbbc7939578ae47b7f260d68a044871ef9a",
  "design-references/source-v55-records-anomaly.png": "608bab090e9b42feaef83b9edac3fa7b1ec0e9779fa0e8a5ec2127a8138ceff8",
  "design-references/source-v55-laundry-anomaly.png": "98115b31e27358f8410e3161075da2b5bcd5f3bbd1d21d5c6922e458c31773cf",
  "design-references/source-v55-underbed-call-station.png": "658abf28c2d4d597f760576ef79619540d6e8d7ab626f0b1fe80427b76634099",
  "design-references/source-v55-countersign-drain.png": "c06535284faa894c0a964aa97e7d5fed2ebbde7c2a04d1dc27a493b51fa4bd22",
  "design-references/source-v55-negative-laundry-locker.png": "6956c9d1e719def1c3895b4bb02fa54cc78b3cbd28a84b7305efc4aa6afa9184",
};
for (const [src, hash] of Object.entries(V55_SOURCE_HASHES)) {
  const buf = await readFile(new URL(src, root));
  assert.equal(createHash("sha256").update(buf).digest("hex"), hash, `${src} must keep its frozen sha256`);
}
/* 六张 WebP 存在、1536×1024 且被引用 */
for (const asset of ["assets/v55-ward-anomaly.webp", "assets/v55-records-anomaly.webp", "assets/v55-laundry-anomaly.webp", "assets/v55-underbed-call-station.webp", "assets/v55-countersign-drain.webp", "assets/v55-negative-laundry-locker.webp"]) {
  const buf = await readFile(new URL(asset, root));
  assert.ok(buf.length > 100000, `${asset} must exist as a full-size transcode`);
  assert.ok(js.includes(asset) || html.includes(asset), `${asset} must be referenced`);
}
assert.match(js, /const ANOMALY_KEY = "goddead_v55_floor_anomaly";/);
assert.equal((js.match(/goddead_v55/g) || []).length, 1, "v55 introduces exactly one storage key");
const anomalyParseBlock = js.match(/const getAnomaly = \(\) => \{[\s\S]*?\n  \};/);
assert.ok(anomalyParseBlock, "getAnomaly must exist");
assert.match(anomalyParseBlock[0], /\} catch \{ raw = \{\}; \}/, "corrupt anomaly storage must be safely repaired");
assert.match(anomalyParseBlock[0], /if \(typeof raw !== "object" \|\| Array\.isArray\(raw\)\) raw = \{\};/, "array/wrong-type anomaly storage must fall back");
assert.match(anomalyParseBlock[0], /Math\.min\(ANOMALY_NUM_CAP, Math\.floor\(n\)\)/, "anomaly counters must be clamped 0..9999");
assert.match(anomalyParseBlock[0], /const sameCycle = num\(raw\.cycle\) === floorCycle;/, "cycle-scoped fields reset when the v35 cycle moves on");
assert.match(anomalyParseBlock[0], /ANOMALY_PATTERNS\.find\(\(p\) => ANOMALY_ROOMS\.every\(\(r\) => raw\.assignment\[r\] === p\[r\]\)\)/, "stored assignment must exactly equal one of the six legal patterns");
assert.match(anomalyParseBlock[0], /history = history\.slice\(-ANOMALY_HISTORY_CAP\);/, "history is bounded to the last 16 valid entries");
assert.ok(anomalyParseBlock[0].indexOf("history = history.slice(-ANOMALY_HISTORY_CAP);") < anomalyParseBlock[0].indexOf("let pending = null;"), "canonical history is parsed before pending validation");
assert.match(anomalyParseBlock[0], /Object\.keys\(p\)\.sort\(\)\.join\(","\) === "feedback,kind,report,room,target"/, "report pending accepts exactly five whitelisted keys");
assert.match(anomalyParseBlock[0], /assignment && inspected\[p\.room\] === 1/, "report pending needs this cycle's inspection settlement evidence");
assert.match(anomalyParseBlock[0], /last\.type === "report" && last\.room === p\.room && last\.report === p\.report/, "report pending needs the canonical history's last entry");
assert.match(anomalyParseBlock[0], /Object\.keys\(p\)\.sort\(\)\.join\(","\) === "action,feedback,kind,scene,target"/, "action pending accepts exactly five whitelisted keys");
assert.match(anomalyParseBlock[0], /backrooms\[p\.scene\] === 1/, "action pending needs this cycle's backroom settlement evidence");
assert.match(anomalyParseBlock[0], /const contamination = falseReports \+ 2 \* missed;/, "contamination is re-derived, never trusted");
assert.ok(!/goddead_v(28|29|30|31|32|33|34|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54)/.test(anomalyParseBlock[0]), "v55 state must not touch earlier keys");
/* 存盘收口：saveAnomaly 只持久化白名单 canonical 字段，派生字段永不落盘 */
const anomalySaveBlock = js.match(/const saveAnomaly = \(st\) => store\.set\(ANOMALY_KEY, JSON\.stringify\(\{[\s\S]*?\}\)\);/);
assert.ok(anomalySaveBlock, "saveAnomaly must persist an explicit canonical projection");
for (const f of ["cycle", "assignment", "inspected", "backrooms", "visits", "verified", "falseReports", "missed", "streak", "tendencies", "pending"]) {
  assert.match(anomalySaveBlock[0], new RegExp(`${f}: st\\.${f},`), `saveAnomaly persists ${f}`);
}
assert.match(anomalySaveBlock[0], /history: st\.history\.slice\(-ANOMALY_HISTORY_CAP\),/, "saveAnomaly clamps history to <= 16 before persisting");
assert.ok(!/contamination|pendingTarget/.test(anomalySaveBlock[0]), "saveAnomaly must never persist derived fields");
/* 分配：六种模式每种至少 1 异常 1 正常；确定性轮换，无 Math.random */
const anomalyModuleBlock = js.match(/v55 失常交班[\s\S]*?v40 门外侧廊/);
assert.ok(anomalyModuleBlock, "v55 module must exist");
assert.ok(!anomalyModuleBlock[0].includes("Math.random("), "v55 assignment must never re-roll Math.random");
assert.match(js, /const idx = \(st\.cycle \+ st\.tendencies\.follow \+ 2 \* st\.tendencies\.contain \+ 3 \* st\.tendencies\.submit\) % ANOMALY_PATTERNS\.length;/, "assignment rotates deterministically with tendencies");
/* 四种报告结果：计分逐字契约 */
const anomalyReportBlock = js.match(/const chooseAnomalyReport = \(sceneKey, report\) => \{[\s\S]*?\n  \};/);
assert.match(anomalyReportBlock[0], /if \(currentScene !== sceneKey\) return;/, "report rejects off-scene calls");
assert.match(anomalyReportBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "report shares the room first-lock");
assert.match(anomalyReportBlock[0], /if \(!anomalyInspecting\(room\)\) return;/, "report requires live inspection mode");
assert.match(anomalyReportBlock[0], /st\.verified = Math\.min\(ANOMALY_NUM_CAP, st\.verified \+ 2\); st\.streak = Math\.min\(ANOMALY_NUM_CAP, st\.streak \+ 1\); addAnomalyFloorScore\(1, 0\); \}/, "correct anomaly: +2 verified, streak, +1 signal");
assert.match(anomalyReportBlock[0], /st\.verified = Math\.min\(ANOMALY_NUM_CAP, st\.verified \+ 1\); st\.streak = Math\.min\(ANOMALY_NUM_CAP, st\.streak \+ 1\); addAnomalyFloorScore\(1, 0\); \}/, "correct normal: +1 verified, streak, +1 signal");
assert.match(anomalyReportBlock[0], /st\.falseReports = Math\.min\(ANOMALY_NUM_CAP, st\.falseReports \+ 1\); st\.streak = 0; addAnomalyFloorScore\(0, 1\); \}/, "false report: streak reset, +1 debt");
assert.match(anomalyReportBlock[0], /st\.missed = Math\.min\(ANOMALY_NUM_CAP, st\.missed \+ 1\); st\.streak = 0; addAnomalyFloorScore\(0, 2\); \}/, "missed: streak reset, +2 debt");
assert.match(anomalyReportBlock[0], /st\.inspected\[room\] = 1;/, "one inspection settlement per room per cycle");
/* 九后室动作：逐字反馈与目标 */
for (const frag of [
  'wax: { btn: "#underbed-action-wax", target: "midnight-callback", tendency: "follow", amount: 1',
  'button: { btn: "#underbed-action-button", target: "bellless-ward", tendency: "contain", amount: 1',
  'horn: { btn: "#underbed-action-horn", target: "countersign-drain", tendency: "submit", amount: 1',
  'print: { btn: "#countersign-action-print", target: "return-audit", tendency: "follow", amount: 1',
  'wheel: { btn: "#countersign-action-wheel", target: "seeping-records", tendency: "contain", amount: 1',
  'drawer: { btn: "#countersign-action-drawer", target: "negative-laundry-locker", tendency: "submit", amount: 1',
  'uniform: { btn: "#negative-action-uniform", target: "lagging-shadow-cloister", tendency: "submit", amount: 2',
  'press: { btn: "#negative-action-press", target: "protocol-drift", tendency: "follow", amount: 1',
  'figure: { btn: "#negative-action-figure", target: "underbed-call-station", tendency: "contain", amount: 2',
]) assert.ok(js.includes(frag), `missing v55 backroom action: ${frag.slice(0, 28)}`);
const anomalyActionBlock = js.match(/const chooseAnomalyAction = \(sceneKey, actionKey\) => \{[\s\S]*?\n  \};/);
assert.match(anomalyActionBlock[0], /if \(currentScene !== sceneKey\) return;/, "backroom action rejects off-scene calls");
assert.match(anomalyActionBlock[0], /if \(AutoAdvance\.has\(sceneKey\)\) return;/, "backroom action shares the scene first-lock");
assert.match(anomalyActionBlock[0], /if \(st\.backrooms\[backroom\] === 0\) \{/, "backroom score settles only once per room per cycle");
/* v35 cap 按新理论上限安全扩展 */
assert.match(js, /const FLOOR_SIGNAL_CAP = 15;/, "signal cap 15 covers three +1 inspection verifications");
assert.match(js, /const FLOOR_DEBT_CAP = 14;/, "debt cap 14 covers +1/+2 report debts");
/* 窄守卫：仅本轮合法 pendingTarget 或历史合法到访 */
assert.match(js, /if \(ANOMALY_BACKROOM_SCENES\.includes\(target\) && anomalyGuard\.pendingTarget !== target && !anomalyGuard\.visits\[ANOMALY_SCENE_BACKROOM\[target\]\]\) target = "unnumbered-floor";/, "v55 backroom guard admits only legal pending or past visits");
/* 巡检态切换与场景接线 */
assert.match(js, /if \(FLOOR_DUTY_SCENES\.includes\(name\)\) \{ enterFloorRoom\(name\); syncAnomalyRoom\(name\); syncEvidenceRoom\(name\); replayAnomalyPending\(name\); replayEvidencePending\(name\); \}/, "duty room entry syncs inspection mode and replays a legal pending");
assert.match(js, /if \(ANOMALY_BACKROOM_SCENES\.includes\(name\)\) \{ enterAnomalyBackroom\(name\); replayAnomalyPending\(name\); \}/, "backroom entry records the legal visit and replays a legal pending");
/* DOM：12 旧热点 + 6 报告热点入图、旧卡容器删除、三新场景九热点、目录、记忆、8 卡 */
for (const [scene, ids] of [["bellless-ward", ["ward-choice-listen", "ward-choice-sheet", "ward-choice-tube", "ward-choice-callback", "ward-report-anomaly", "ward-report-normal"]], ["seeping-records", ["records-choice-dry", "records-choice-drink", "records-choice-sink", "records-choice-callback", "records-report-anomaly", "records-report-normal"]], ["reverse-laundry", ["laundry-choice-drum", "laundry-choice-uniform", "laundry-choice-mirror", "laundry-choice-callback", "laundry-report-anomaly", "laundry-report-normal"]]]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-${scene}"[\\s\\S]*?<\\/section>`));
  assert.ok(section[0].includes("forecourt-tactile-stage"), `${scene} figure becomes the 3:2 tactile stage`);
  const figure = section[0].match(/<figure[\s\S]*?<\/figure>/);
  for (const id of ids) assert.ok(figure[0].includes(`id="${id}"`), `${scene} figure must hold #${id} inside the picture`);
  assert.ok(!section[0].includes("branch-choices"), `${scene} must drop the old card list container`);
}
for (const id of ["ward-report-anomaly", "ward-report-normal", "records-report-anomaly", "records-report-normal", "laundry-report-anomaly", "laundry-report-normal"]) {
  assert.match(html, new RegExp(`id="${id}" type="button" aria-pressed="false" data-hover hidden`), `${id} ships hidden`);
}
assert.ok(!html.includes('id="ward-choices"') && !html.includes('id="records-choices"') && !html.includes('id="laundry-choices"'), "the three v35 card containers must be deleted entirely");
for (const [scene, ids] of [["underbed-call-station", ["underbed-action-wax", "underbed-action-button", "underbed-action-horn"]], ["countersign-drain", ["countersign-action-print", "countersign-action-wheel", "countersign-action-drawer"]], ["negative-laundry-locker", ["negative-action-uniform", "negative-action-press", "negative-action-figure"]]]) {
  const section = html.match(new RegExp(`<section class="scene scene-branch scene-${scene}"[\\s\\S]*?<\\/section>`));
  assert.ok(section, `scene section missing: ${scene}`);
  assert.ok(section[0].includes("forecourt-tactile-stage"), `${scene} uses the 3:2 tactile stage`);
  assert.ok(!section[0].includes("branch-choices") && !section[0].includes("<svg"), `${scene} must not degrade to cards or inline SVG`);
  const figure = section[0].match(/<figure[\s\S]*?<\/figure>/);
  for (const id of ids) assert.ok(figure[0].includes(`id="${id}"`), `${scene} figure must hold #${id}`);
}
assert.match(html, /<a href="#underbed-call-station" id="underbed-link" hidden data-hover>01ν½ \/ 床下回铃<\/a>/);
assert.match(html, /<a href="#countersign-drain" id="countersign-link" hidden data-hover>01ξ½ \/ 反签排水<\/a>/);
assert.match(html, /<a href="#negative-laundry-locker" id="negative-link" hidden data-hover>01ο½ \/ 负照更衣<\/a>/);
assert.ok(html.includes('id="floor-anomaly-memory"'), "remembrance gains the floor anomaly memory line");
assert.equal((html.match(/<div class="stat-card">/g) || []).length, 8, "remembrance keeps exactly eight stat cards");
assert.match(js, /失常交班：核验 \$\{st\.verified\}，误报 \$\{st\.falseReports\}，漏报 \$\{st\.missed\}，污染 \$\{st\.contamination\}。/, "anomaly memory line verbatim");
/* CSS：27 个定位 class */
for (const cls of ["ward-spot-sheet", "ward-spot-listen", "ward-spot-callback", "ward-spot-tube", "ward-spot-report-anomaly", "ward-spot-report-normal", "records-spot-dry", "records-spot-drink", "records-spot-callback", "records-spot-sink", "records-spot-report-anomaly", "records-spot-report-normal", "laundry-spot-drum", "laundry-spot-uniform", "laundry-spot-mirror", "laundry-spot-callback", "laundry-spot-report-anomaly", "laundry-spot-report-normal", "underbed-spot-wax", "underbed-spot-button", "underbed-spot-horn", "countersign-spot-print", "countersign-spot-wheel", "countersign-spot-drawer", "negative-spot-uniform", "negative-spot-press", "negative-spot-figure"]) {
  assert.match(css, new RegExp(`\\.${cls} \\{`), `css missing position class .${cls}`);
}


/* ---------- 文档同步 ---------- */
const readme = await fileText("README.md");
assert.match(readme, /值夜室|night-watch/i);
assert.match(readme, /v28|代行治理|代理神明/, "README must document the v28 governance protocol");
assert.match(readme, /v29|旁路|回声档案室/, "README must document the v29 branch scenes");
assert.match(readme, /v30|深层|失真转接室/, "README must document the v30 deep branch network");
assert.match(readme, /v31|门前|倒置窥孔/, "README must document the v31 forecourt weave");
assert.match(readme, /v32|副楼|闭目档案/, "README must document the v32 inner annex");
assert.match(readme, /v33|异常复核|复核科/, "README must document the v33 anomaly review");
assert.match(readme, /v34|无主估值|估值室/, "README must document the v34 unclaimed valuation");
assert.match(readme, /v35|无号层/, "README must document the v35 unnumbered floor");
assert.match(readme, /v36|夜班登记/, "README must document the v36 night-shift registry");
assert.match(readme, /v37|午夜回拨/, "README must document the v37 midnight callback");
assert.match(readme, /v38|代审/, "README must document the v38 proxy admission");
assert.match(readme, /v39|归路核验/, "README must document the v39 return audit");
assert.match(readme, /v40|侧廊/, "README must document the v40 lateral corridors");
assert.match(readme, /v41|背室/, "README must document the v41 protocol backrooms");
assert.match(readme, /v42|漂移/, "README must document the v42 protocol drift");
assert.match(readme, /v43|回敲/, "README must document the v43 counter-knock network");
assert.match(readme, /v44|页后|空层/, "README must document the v44 paperback spaces");
assert.match(readme, /v45|交班/, "README must document the v45 absent relief");
assert.match(readme, /v46|旁线/, "README must document the v46 side tones");
assert.match(readme, /v47|退件/, "README must document the v47 returned rooms");
assert.match(readme, /v48|留副/, "README must document the v48 cancellation copies");
assert.match(readme, /v49|门前实感|原生物件热点/, "README must document the v49 tactile forecourt hotspots");
assert.match(readme, /v50|副楼实感|原生热点/, "README must document the v50 tactile annex hotspots");
assert.match(readme, /v51|副楼三债|见证.*失号.*逆行/, "README must document the v51 annex three debts");
assert.match(readme, /v52|三债结算|结算所/, "README must document the v52 annex debt settlement");
assert.match(readme, /v58|异议总署|Appeal Registry/i, "README must document the v58 appeal registry");

const qa = await fileText("design-qa.md");
assert.match(qa, /第三值夜室/);
assert.match(qa, /Living Shrine|场景探索/);
assert.match(qa, /视觉深化|visual enrichment|正式图片/i);
assert.match(qa, /v28|代行治理|神圣平衡/, "design-qa.md must document the v28 governance QA");
assert.match(qa, /v29|旁路支线|回声档案室/, "design-qa.md must document the v29 branch QA");
assert.match(qa, /v30|深层支线|失真转接室/, "design-qa.md must document the v30 deep branch QA");
assert.match(qa, /v31|门前三岔|倒置窥孔/, "design-qa.md must document the v31 forecourt QA");
assert.match(qa, /v32|门内副楼|闭目档案/, "design-qa.md must document the v32 inner annex QA");
assert.match(qa, /v33|异常复核/, "design-qa.md must document the v33 anomaly review QA");
assert.match(qa, /v34|无主估值/, "design-qa.md must document the v34 unclaimed valuation QA");
assert.match(qa, /v35|无号层/, "design-qa.md must document the v35 unnumbered floor QA");
assert.match(qa, /v36|夜班登记/, "design-qa.md must document the v36 night-shift registry QA");
assert.match(qa, /v37|午夜回拨/, "design-qa.md must document the v37 midnight callback QA");
assert.match(qa, /v38|代审/, "design-qa.md must document the v38 proxy admission QA");
assert.match(qa, /v39|归路核验/, "design-qa.md must document the v39 return audit QA");
assert.match(qa, /v40|侧廊/, "design-qa.md must document the v40 lateral corridors QA");
assert.match(qa, /v41|背室/, "design-qa.md must document the v41 protocol backrooms QA");
assert.match(qa, /v42|漂移/, "design-qa.md must document the v42 protocol drift QA");
assert.match(qa, /v43|回敲/, "design-qa.md must document the v43 counter-knock network QA");
assert.match(qa, /v44|页后|空层/, "design-qa.md must document the v44 paperback spaces QA");
assert.match(qa, /v45|交班/, "design-qa.md must document the v45 absent relief QA");
assert.match(qa, /v46|旁线/, "design-qa.md must document the v46 side tones QA");
assert.match(qa, /v47|退件/, "design-qa.md must document the v47 returned rooms QA");
assert.match(qa, /v48|留副/, "design-qa.md must document the v48 cancellation copies QA");
assert.match(qa, /v49|门前实感|原生物件热点/, "design-qa.md must document the v49 tactile forecourt QA");
assert.match(qa, /v50|副楼实感|原生热点/, "design-qa.md must document the v50 tactile annex QA");
assert.match(qa, /v51|副楼三债|阈值异常/, "design-qa.md must document the v51 annex debts QA");
assert.match(qa, /v52|三债结算|结算所/, "design-qa.md must document the v52 annex debt settlement QA");
assert.match(qa, /v58|异议总署/, "design-qa.md must document the v58 appeal registry QA");

const log = await fileText("docs/ProgressLog.md");
assert.match(log, /2026-07-02/);
assert.match(log, /Cloudflare Pages/);
assert.match(log, /v28|神圣平衡|代理神明/, "ProgressLog must document v28");
assert.match(log, /v29|旁路支线|回声档案室/, "ProgressLog must document v29");
assert.match(log, /v30|深层支线|失真转接室/, "ProgressLog must document v30");
assert.match(log, /v31|门前三岔|倒置窥孔/, "ProgressLog must document v31");
assert.match(log, /v32|门内副楼|闭目档案/, "ProgressLog must document v32");
assert.match(log, /v33|异常复核/, "ProgressLog must document v33");
assert.match(log, /v34|无主估值/, "ProgressLog must document v34");
assert.match(log, /v35|无号层/, "ProgressLog must document v35");
assert.match(log, /v36|夜班登记/, "ProgressLog must document v36");
assert.match(log, /v37|午夜回拨/, "ProgressLog must document v37");
assert.match(log, /v38|代审/, "ProgressLog must document v38");
assert.match(log, /v39|归路核验/, "ProgressLog must document v39");
assert.match(log, /v40|侧廊/, "ProgressLog must document v40");
assert.match(log, /v41|背室/, "ProgressLog must document v41");
assert.match(log, /v42|漂移/, "ProgressLog must document v42");
assert.match(log, /v43|回敲/, "ProgressLog must document v43");
assert.match(log, /v44|页后|空层/, "ProgressLog must document v44");
assert.match(log, /v45|交班/, "ProgressLog must document v45");
assert.match(log, /v46|旁线/, "ProgressLog must document v46");
assert.match(log, /v47|退件/, "ProgressLog must document v47");
assert.match(log, /v48|留副/, "ProgressLog must document v48");
assert.match(log, /v49|门前实感|原生物件热点/, "ProgressLog must document v49");
assert.match(log, /v50|副楼实感|原生热点/, "ProgressLog must document v50");
assert.match(log, /v51|副楼三债|阈值异常/, "ProgressLog must document v51");
assert.match(log, /v52|三债结算|结算所/, "ProgressLog must document v52");
assert.match(log, /v53|归路信念/, "ProgressLog must document v53");
assert.match(log, /v54|迫近/, "ProgressLog must document v54");
assert.match(log, /v55|失常交班/, "ProgressLog must document v55");
assert.match(log, /v56|症状交接/, "ProgressLog must document v56");
assert.match(log, /v57|判词后果|责任账/, "ProgressLog must document v57");
assert.match(log, /v58|异议总署/, "ProgressLog must document v58");

/* v58 设计文档存在且冻结四张源图哈希 */
const v58doc = await fileText("docs/V58AppealRegistryDesign.md");
for (const hash of Object.values(V58_SOURCE_HASHES)) {
  assert.ok(v58doc.includes(hash), "V58 design doc must freeze the source sha256 values");
}
assert.match(v58doc, /selfBurden（自担）> transfer（转嫁）> repair（修复）> concordance（共证）/, "V58 design doc must document the dominant tie order");

/* ---------- 边界说明 ----------
   本套件为 Node 静态断言，不启动 DOM、不执行真实交互。
   敲门、场景切换、交班簿覆盖、签退、钟针倒退等运行时行为，
   以代码存在性断言 + design-qa.md 内的无头 Chromium 截图人工验收为准。 */
console.log("site.test.mjs: all assertions passed");
