# Progress Log

## 2026-07-24 (v30 深层支线互联：失真转接室 / 逆流泵房 / 无名罪籍库)
- 三个二级区域作为原生 SPA 场景落盘：`#echo-transfer`（失真转接室）、`#vein-pump`（逆流泵房）、`#confession-ledger`（无名罪籍库），各配正式位图（监理源图 Pillow q85 转码，132/203/185 KB），沿用 v29 branch 场景结构，零内联 SVG。
- 入口改接（v29 三房间保留）：回声室「03:17 的铃」→ 转接室、维修井「隔离闸」→ 泵房、称量室「拒绝忏悔」→ 罪籍库；原「直达值夜室」的条件捷径下移到深层动作内，支线不再一次点击就原路返回。
- 三角网络九动作：转接室（接血管维护网→泵房 / 封存声音→守则 / 再拨 03:17→值夜，未解锁回走廊）；泵房（释放回声压力→转接室 / 导入沉积物→罪籍库 / 应急梯→值夜，未解锁落守则）；罪籍库（划掉名字→转接室 / 归档见证者→泵房 / 拒收整份记录→守则，三深层全到访则给额外反馈并按解锁状态落走廊或值夜）。全部「主动作 → 短反馈 → 自动转场」，无第二个必点按钮。
- 状态与守卫：独立容错 `goddead_v30_branch_depth`（deepVisited/lastDeepChoice，坏 JSON 回退），不读不写 v28/v29/旧主线；到访点击即持久化，走廊再入按钮与目录入口首次到访后恢复、未到访 hidden 不可聚焦；`resolveScene` 深层守卫直达回退父支线（父支线未访问由 v29 守卫继续拦回走廊）；选择以 `aria-pressed` 恢复。
- 痕迹页：新增单行深层记忆 `#deep-memory`，严格保持 8 卡。
- 真实缺陷修复（冒烟独立复现）：`resolveScene` 深层守卫原排在 v29 守卫之后，干净存档直达深层会停在父支线而非拦回走廊；已调整为先深层后支线，并加守卫顺序静态断言。
- 视觉 QA（`/tmp/goddead-qa/v30-visual.mjs`，预置 visited/deepVisited 直达、settle 后截图）37/37：六张证据 `design-qa-evidence/v30-01~06`（三场景 × 桌面 1440×800 / 移动 390×844），逐张断言正确场景、素材解码、零横向溢出、标题/图片/三按钮可见、桌面三按钮首屏、移动端第一动作首屏可发现，均经逐张目验，控制台零异常。
- 移动端排版微调（独立目验发现的唯一毛刺）：`max-width:720px` 下 `.scene-branch .sec-kicker` 字号 0.58→0.52rem、字距 0.4em→0.22em 并加 `text-wrap: balance`，三座深层房间的双语小标题不再出现单字孤行；仅排版，未动正文/图片/按钮/转场/状态；重拍 v30-04~06 并逐张目验通过。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v30 段并同步更新 v29 改接断言；缓存升至 v30；README / design-qa 同步。CDP 功能冒烟（`/tmp/goddead-qa/v30-smoke.mjs`）20/20：守卫回退、完整三角链路、点击即持久化、入口/目录恢复、reject 全到访特别出口、坏 JSON、v28/v29/主线零污染。

## 2026-07-24 (v29 前段多分支：回声档案室 / 血管维修井 / 忏悔称量室)
- 三个可选支线房间作为原生 SPA 场景落盘：`#echo`（回声档案室）、`#vein`（血管维修井）、`#confession`（忏悔称量室），各配正式位图 `assets/echo-archive.webp` / `vein-maintenance-well.webp` / `confession-weighing-room.webp`（1536×1024，mask 羽化融入 #050505，`loading="lazy"`），场景零内联 SVG。
- 走廊残页分流：f2「回声」/ f3「血管」/ f4「忏悔」首次主动点击 → 取消主线 corridor AutoAdvance，0.7–1.0s（reduced-motion 0.3s）反馈后自动进入对应支线；`visited` 在点击时立即持久化，即便转场被回退取消，走廊再入按钮已出现，支线永不永久丢失。
- 九选择与条件捷径：每室三个可聚焦热点——回声室「门外的敲声→门外 / 自己的脚步→走廊 / 03:17 的铃→值夜室（需 watchUnlocked）」；维修井「顺流阀→走廊 / 逆流阀→守则 / 隔离闸→值夜室（需三支线均访问且 watchUnlocked）」；称量室「承认敲过门→守则 / 承认读过第七条→走廊 / 拒绝忏悔→回声档案室（支线串联）」。条件不满足时给出失败文案并回流走廊；全部为「主动作 → 短反馈 → 自动转场」，无任何第二个必点按钮。
- 状态与守卫：`goddead_v29_branches`（`visited` / `lastChoice`）容错解析、坏 JSON 安全回退，只读不写 v28 治理与旧主线状态；访问后走廊出现再入按钮、目录抽屉出现入口，跨 reload 存活；`resolveScene` 守卫把未访问支线的直达一律拦回走廊并归一地址；选择以 `aria-pressed` 恢复。
- 痕迹页：新增单行旁路记忆「你走过 N 条旁路……」，严格保持 8 卡 Grid。
- 静态契约：`tests/site.test.mjs` 新增 v29 段——三素材存在与引用、三场景各恰 3 个 branch-btn、全部 ID 接线、入口出厂 hidden、容错字段、九选择目标、隔离闸联合条件、失败回流、守卫归并、旁路记忆与 8 卡保持、缓存 v29。
- CDP 无头 QA（`/tmp/goddead-qa/branch-rooms.mjs`，真实点击/键盘/重载，桌面 1440×800 与移动 390×844）：独立执行 **54/54 通过**（exit 0）——覆盖残页分流、九选择全目标、条件捷径成败两路、交叉回流、键盘 Enter 激活、visited/lastChoice 持久化、直达守卫、坏 JSON、移动端首屏热点与零横向溢出、reduced-motion 快速转场、主线状态零污染、全程控制台零错误；证据 `design-qa-evidence/br-01~09`，提交前监理逐张复核，br-03/br-04 已为完整可见场景，移动端 br-07~09 完整。

## 2026-07-24 (v28 返工：转场焦点生命周期与崩解 modal 焦点陷阱)
- 独立复现确认：collapse 键盘 Enter 重试后焦点悬空（`document.activeElement` 停在 `<body>`），且存在更严重的同族故障——`goScene` 的场景切换、标题聚焦、veil 收尾依赖「480ms → 180ms/80ms」嵌套定时器，内层定时器在部分环境下会丢失，可能造成 veilBusy 永久卡死（路由器整体失灵）、veil 常亮与焦点永不落位。
- 修复一（转场收口幂等化）：`goScene` 引入幂等 `complete()`——场景切换、`sceneInit`、hash 同步、scrollTop 归零、焦点恢复、`veil` 释放与 `veilBusy=false` 全部在同一拍完成，不再链式依赖嵌套定时器；主定时器（480ms / reduced 60ms）与看门狗定时器（2000ms / reduced 600ms）驱动同一条 `complete()`，任一触发即完成，路由器永不卡死。
- 修复二（可靠聚焦 `focusReliably`）：`.scene` 从 `visibility:hidden` 过渡（0.5s）期间 `focus()` 会被静默拒绝，故聚焦改为「同步首试 + 最多 12 次 ×120ms 验收重试」，`document.activeElement` 落位即停；目标所属场景不再是 `.active` 时立即放弃，绝不跨场景抢焦点。崩解 modal 打开时 goScene 完成步骤优先聚焦重试按钮；begin / next-cycle / retry 处理器经 `pendingSceneFocus` 指定可见的 `#ruling-acting-heading` 为优先落点（不可见时回退场景标题）。
- 修复三（`aria-modal="true"` 真实焦点陷阱）：`onCollapseKeydown` 在 `openCollapseModal` 时挂载、`closeCollapseModal`（含 `goScene` 离场统一调用）时移除；modal 内仅重试一个可聚焦项时，Tab 与 Shift+Tab 两个方向都被 `preventDefault` 并留在重试按钮上。
- 静态契约新增：`complete()` 幂等结构、主/看门狗定时器驱动同一 complete、complete 内无嵌套定时器、`focusReliably` 验收重试与场景 active 守卫、`pendingSceneFocus` 可见性判断、陷阱监听挂载/移除、Shift+Tab/Tab 回卷分支、三个处理器的 `pendingSceneFocus = rulingActingHeading`。
- CDP QA 扩充至 102 项并**连续 3 次独立运行全部 102/102 通过**（exit 0）：新增 collapse modal Tab / Shift+Tab 双方向陷阱断言、Enter 重试后焦点确定落到 `#ruling-acting-heading`、重试后 Tab 自然前进（陷阱已移除）、collapse 直达与重载两次焦点均落 retry、reduced-motion 下 collapse 打开即聚焦 retry 与 Enter 重试落裁决标题；threshold-door-open 回归 31/31。新增证据 `gov-17-reduced-motion-retry-acting-1440x800.png` 并目验。

## 2026-07-24 (v28 神圣平衡与代理神明协议 · 治理终局闭环)
- 完成 v28 半成品的全量接线：index.html/styles.css 已有的治理 HUD（灵质 E / 灰烬 A / 共鸣 R）、acting/offering/reliquary 三处「代行裁决」控件组、老玩家入口 `#begin-governance-box`、结局卡 `#ending-card-box` 与崩解 modal `#collapse-modal`，此前在 script.js 中零引用，现已全部接入真实状态机。
- 三次裁决遵守「主动作完成 → 短反馈 → 自动推进」：`applyRulingActingChoice` / `applyRulingOfferingChoice` / `applyRulingReliquaryChoice` 直接调度 `AutoAdvance`（acting→offering→reliquary→remembrance），三个 `continue-*-btn` 仅作非必需 fallback，复用同一调度函数，不是必经步骤。
- 结局推导与持久化：`parseAndValidateGovernance()` 从 50/50/20 基值按 `RULING_DELTAS` 实际计算派生资源并判定结局——ABA=ascension（E100/A25/R40）、AAB=madness（E35/A40/R65）、AAA=oblivion（E65/A70/R10）、BBA=nightwatch（E65/A50/R20）、BAB=collapse（E 归零），全部由真实计算验证（含全部 8 种组合穷举），非写死映射。修复了最终裁决时结局未写入持久图鉴的缺陷（先存 rulings 再二次解析回写 `unlockedEndings`）。
- 状态契约：`goddead_v28_governance` 容错解析（坏 JSON 安全回退默认值）；`cycleCount` 仅在主动开启新一轮/重试时精确加一，解析永不自增；重复刷新或直达 `#remembrance` 不产生治理 key、不重复污染图鉴。
- 老玩家入口：旧主线已完成（遗物已封印）但从未开启治理时，remembrance 显示「开启代神治理协议」；点击只置 `hudUnlocked` 并前往 acting，值夜/线路/投递/注销/任命/祷告/遗物/抵达记录全部保留（CDP 快照比对零差异）。
- `resetGovernanceCycle()`：正常结局「开启新一轮」与 collapse「重试」共用，只重置本轮三项 rulings（派生资源与结果随 rulings 重算归零），保留图鉴与全部旧主线进度。
- 崩解 modal：仅在 remembrance 内打开，初始焦点落在重试按钮（让开场标题聚焦先完成），键盘 Enter 可重试；离场经 `goScene` 统一 `closeCollapseModal()`，重试后 modal 彻底关闭且焦点恢复进 acting 场景。结局卡/HUD/begin 三态互斥，`sceneInit` 进入 remembrance 时经 `syncGovernanceRemembrance()` 同步。
- 静态契约：`tests/site.test.mjs` 新增 v28 段——12 个终局 ID 接线、HTML 出厂 hidden/role、ENDING_META 四结局、阈值规则存在性、从源码提取 RULING_DELTAS 实际计算五组合（ABA/AAB/AAA/BBA/BAB）、坏 JSON 容错、parse 不自增 cycleCount、reset 只清 rulings 且不动旧主线、begin 不清进度不伪造裁决、modal 打开/聚焦/关闭、continue 为 fallback、场景进入同步、缓存 v28；同步更新 v27 reliquary 守卫断言为 `reliquaryConsumed` 形式与 sceneInit offering 分支新形式。
- CDP 真实运行 QA（`/tmp/goddead-qa/governance-cycle.mjs`）89/89：老玩家完整点击走通 cycle 1（ABA→ascension）、隔离 localStorage 验证 AAB/AAA/BBA/BAB 四组合（含派生资源数值与图鉴持久化）、刷新恢复不重复、next cycle（cycleCount 精确 2、图鉴保留、旧进度快照零差异）、第二轮 BBB→madness 图鉴累积、collapse 键盘 Enter 重试、390×844 移动端结局卡/崩解 modal、reduced-motion 快速转场、直达/重复刷新零污染、坏 JSON 安全修复、全程控制台零错误。16 张证据截图存于 `design-qa-evidence/gov-*.png` 并逐张目验。

## 2026-07-23 (The Sacred Reliquary Vault native SPA integration - v27)
- Promoted **The Sacred Reliquary Vault** (`#reliquary`) to a native, first-class scene within `index.html`'s SPA exploration framework, closing the narrative arc after the visitor's appointment at the Acting Deity Desk (`#acting`) and prayer incinerator ignition (`#offering`).
- Integrated production bitmap `assets/relic-vault-desk.webp` (1536×1024, 144 KB WebP, feather-masked into `#050505`) with art-directed framing around its central brass press and left ash tray.
- Added Relic Press Desk (`#relic-log`) holding 3 interactive relic item buttons (`#relic-1`, `#relic-2`, `#relic-3`) that play WebAudio metallic clamp sounds (`AudioEngine.clamp()`) and reveal solemn notes upon active click / Enter / Space activation.
- Added Final Seal Stamp (`#seal-btn`) that enables when all 3 relics are pressed, plays heavy stamp sound, persists `sealed: true` & `sealedAt` timestamp in `goddead_reliquary`, reveals 6 record lines in rhythm (~150ms per line; immediate under `prefers-reduced-motion`), and triggers `AutoAdvance` into `#remembrance`.
- Preserved the linear flow invariant: `#seal-btn` is the only forward action; `AutoAdvance` owns `reliquary` → `remembrance`; `#reliquary` features only explicit back navigation (`data-go="offering"`).
- Defined single authoritative contract `reliquaryUnlocked()` checking 7 upstream prerequisites (`watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted && getCancel().refused && getActing().appointed && (gstate.prayersOffered > 0)`). `resolveScene` cascades locked visits down the dependency chain and normalizes URL hash via `history.replaceState`.
- Preserved the 8-card Remembrance stat grid (4×2 desktop / 2×4 mobile). Rendered reliquary status via `#reliquary-slot` banner and dedicated `#relic-memory` paragraph (`「神没有留下遗物。你把整座观所封印在了记忆里。」`).
- Migrated legacy `reliquary.html` to a minimal client-side redirect (`location.replace("index.html#reliquary")`), delegating guard logic to `index.html`'s authoritative router without duplicating state.
- Migrated reset action to an in-page themed confirmation in `#remembrance` (`#forget-confirm-box`), clearing all `goddead` local storage keys and returning cleanly to `#threshold` without native `confirm()`.
- Added short-desktop viewport support (`@media (min-width: 721px) and (max-height: 800px)`), capping figure height at 230px with two-column layout and topbar clearance (`padding-top: clamp(92px, 10vh, 130px)`).
- Hardened entry reveal contracts (`syncWatchDoor`, `syncLine4`, `syncDeadletter`, `syncCancel`, `syncActingEntry`, `renderReliquary`) to enforce bidirectional DOM `hidden` attribute synchronization. Locked or reset states explicitly re-apply `setAttribute("hidden", "")` and reset visual state classes so locked gates stay truly invisible and non-focusable.
- Fixed `ReferenceError` in `#forget-action-btn` click handler by correcting paint function calls to `paintWatch()`, `paintLine4()`, `paintDeliver()`, `paintCancel()`, `paintActing()`, and `paintRelicMemory()`.
- Enhanced reset key filtering with case-insensitive `k.toLowerCase().includes("goddead")` and removed `saveState()` call inside the reset handler, guaranteeing strictly 0 `goddead` keys remain in `localStorage` post-reset.
- Verified 12/12 full headless CDP QA suite across all scenes with 45 validation logs, 0 Errors/Exceptions, and 0 runtime ReferenceErrors.
- Bumped asset cache key to `v27`; updated `tests/site.test.mjs` with assertions covering `reliquaryUnlocked()`, asset existence, 12 scenes, AutoAdvance transitions 8 & 9, 8-card preservation, legacy redirect, in-page reset, keyboard accessibility, reduced-motion immediacy, bidirectional `hidden` sync, and 0 `saveState` in reset handler.

## 2026-07-23 (Offering incinerator ignition burning transition - v26)
- Added `assets/prayer-incinerator-burning.webp` (1536×1024) as an incinerator burning visual layer for the `#offering` scene.
- Preloaded `assets/prayer-incinerator-burning.webp` in `index.html` and stacked `.offering-idle-img` and `.offering-burning-img` within `<figure class="offering-figure">`.
- Implemented smooth CSS opacity and scale transitions for `.offering-figure.ignited` (`opacity: 1`, `transform: scale(1.015)` with `0.4s ease` transition) while ensuring `transition: none !important` under `prefers-reduced-motion`.
- Updated `script.js` to dynamically add the `ignited` class to `.offering-figure` upon submitting a non-empty prayer input, and clear the `ignited` state upon re-entering the `offering` scene.
- Maintained established global `AutoAdvance` scheduler timing (~900–1319 ms; reduced-motion 350 ms) across all scenes including offering.
- Bumped asset cache key to `v26`; updated `tests/site.test.mjs` with assertions covering asset existence, HTML structure, preload tags, CSS rules, script.js ignition logic, and AutoAdvance timing guards.

## 2026-07-21 (Threshold third-knock open-door transition)
- Replaced the threshold's third-knock "ajar glow" with a real open-door visual transition: added `assets/threshold-bureau-door-open.webp` (1536×1024, ~193 KB, Pillow quality=85 from the supervisor-generated source PNG) while keeping the existing closed-door asset untouched.
- Preloaded the open-door image and stacked it inside the native `#door-btn` as an absolutely overlaid visual-layer image (`#door-open-img`, `aria-hidden="true"`, `alt=""`); both images share the same `.door-img` sizing, object-fit, object-position, mask, and responsive breakpoints so the switch never rescales or jumps.
- On the third active knock, `#door-scene` immediately gains `ajar` + `opened`; the open image fades in with a subtle `opacity`/`scale(1.03)` push and remains visible through the scene transition. The `before` callback only resets session counters (`knocks` and `thresholdConsumed`), so no closed-door flash occurs before entering `#protocol`. No enter button, second confirmation, or scroll requirement was reintroduced.
- Under `prefers-reduced-motion`, long transitions collapse but the open-door image still appears and the short, understandable auto-advance remains.
- Added `thresholdConsumed` session marker, `syncDoorOpenState` recovery, and a completed-state `aria-label` ("门已打开，点击或按 Enter、Space 继续") so a cancelled timer can be re-armed by clicking or activating the door area; direct `#threshold` loads and persistent-state restoration never auto-jump.
- Preserved the door pulse and whisper cycling. The required third knock now owns the forward transition, so later-knock easter eggs no longer interrupt the path into the site.
- Bumped asset cache to `v25`; extended `tests/site.test.mjs` with assertions for the new open-door asset, preload, stacked-image accessibility, `opened` CSS state, `thresholdConsumed`, `syncDoorOpenState`, and the completed-state aria-label.

## 2026-07-21 (Linear auto-advance flow)
- Redesigned the linear path to auto-advance after each core action instead of requiring the visitor to scroll down and click a second continue button. The nine transitions are: threshold third knock → protocol; first active rule activation → corridor; third fragment read → watch; 05:02 covered + sign-out attempt + fourth line unlocked → switchboard; first three lines heard + fourth line connected → deadletter; three returns archived + blank receipt signed → cancellation; `GODDEAD` searched + cancellation refused → acting; presence switch at 100% → offering; first non-empty prayer offered → remembrance. Remembrance and the hidden ninth scene remain endpoints.
- Added a unified `AutoAdvance` scheduler in `script.js`: scene-scoped timers, cancellable on exit/repeat triggers, gated by `initialRouteDone` so restoring persistent state or loading a scene directly by hash never auto-jumps. Normal-mode delay is ~0.9–1.4 s; reduced-motion shortens to ~0.35 s while keeping the sequence understandable.
- Each scene switch now resets `scrollTop` to 0 and moves focus to the new scene title (`tabindex="-1"`) for keyboard and screen-reader order.
- Removed the threshold door-choice buttons, all linear-path bottom forward buttons, and the `answer`/`deliver`/`cancel`/`acting` secondary confirmation buttons. Only the directory drawer and explicit back navigation remain; there are no cross-scene shortcuts to `#offering`.
- Added keyboard activation for protocol rules (`tabindex="0"`, `role="button"`, Enter/Space handlers) and kept the rule activation strictly click/keyboard — no hover or focus auto-jump.
- Compressed the per-scene record reveals (switchboard, deadletter, cancellation, acting) from several seconds down to about one second total (`150 + i * 120 ms`) so auto-advance feedback never outruns the visitor.
- Added session-scoped consumed markers (`protocolConsumed`, `corridorConsumed`, `watchConsumed`, `cancellationConsumed`, `actingConsumed`, `offeringConsumed`) that are only flipped inside each timer's `before` callback; `sceneInit` resets them on every scene entry. This means a transition cancelled by back-navigation or scene exit can be re-armed by repeating the core action, while restoring persistent state or loading a scene directly by hash never auto-jumps because the markers stay `false` and no user action triggers `schedule`.
- Hardened watch interaction: `pointerenter` on the handover log only performs the passive visual reveal (`coverLogVisual`) and never writes `phoneCovered` or schedules; only click / Enter / Space on the 05:02 entry (`coverLogActive`) updates state and can arm the transition. Clicking the already-covered 05:02 entry after a cancelled timer re-arms the schedule.
- Hardened acting recovery: after the range is locked at 100%, the `#acting-switch` container is dynamically promoted to a focusable button (`tabindex="0"`, `role="button"`, `aria-label`) so a cancelled transition can be re-armed by click or Tab + Enter/Space. The container stays non-focusable before appointment, leaving the native range as the only interactive control.
- Preserved all state guards, hidden-scene unlock contracts, easter eggs, visuals, assets, WebAudio engine, localStorage compatibility, and the `reduced-motion` immediate-complete behavior.
- Bumped asset cache to `v23`; extended `tests/site.test.mjs` with assertions for the `AutoAdvance` module, all nine transitions, timer cancellation, scroll/focus management, reduced-motion delay, ~1 s reveal timings, keyboard rule activation, removal of forward/shortcut buttons, absence of `data-go="offering"` shortcuts, session consumed markers, watch hover-vs-active split, and recovery after a cancelled timer.

## 2026-07-21 (Short-desktop first-screen operability)
- Added a short-desktop responsive pass for viewports ≥721px wide and ≤800px tall. The affected scenes switch to compact two-column/compact-grid layouts so the first actionable control appears without scrolling:
  - `#protocol`: first rule is fully visible.
  - `#watch`: the 05:02 handover entry and the sign-out button are both visible.
  - `#switchboard`: the first callback line is visible.
  - `#deadletter`: the first return item is visible.
  - `#cancellation`: the search input and submit button are visible.
  - `#acting`: the native range is visible.
- Corridor and offering were already first-screen operable and remain unchanged; the 390×844 mobile layout keeps its existing vertical narrative.
- Implemented via `@media (min-width: 721px) and (max-height: 800px)` in `styles.css`: reduced scene padding and `sec-head` margins, capped figure heights (protocol 240px, switch/deadletter/cancel/acting 230px, watch desk 140px), two-column grids for protocol/switch/deadletter/cancel/acting, and a tighter watch-room grid with the sign-out box placed alongside the desk.
- Fixed stat-card text overflow: long values like `未签退 · N` and `驳回` no longer break out of their cards. Added a `.stat-num.is-text` modifier that shrinks the font and keeps the text on one line; numeric stat values keep their original visual weight. Updated `paintWatch`, `paintCancel`, `paintLine4`, `paintDeliver`, and `paintStats` in `script.js` to use a shared `setStatNum` helper that toggles the modifier.
- Replaced the browser-default bright-blue focus rectangle on auto-focused scene titles with a non-rectangular, themed `focus-visible` treatment: `outline: none` plus a bottom blood-line (`box-shadow: 0 2px 0 0 rgba(192, 74, 66, 0.7)`) and a soft text glow, applied to `.sec-title`, `.ninth-rule`, and `.dead-title`.
- Fixed topbar overlap in the short-desktop breakpoint: raised `padding-top` to `clamp(92px, 10vh, 130px)` for protocol/watch/switch/deadletter/cancellation/acting, giving the fixed topbar and its date text safe clearance while keeping the first core control on screen.
- Bumped asset cache to `v24` in `index.html`, tests, and documentation.
- Preserved the acting-switch keyboard fix: the `#acting-switch` container only becomes focusable after appointment; unappointed it stays a plain wrapper so the native range remains the sole interactive control.
- Extended `tests/site.test.mjs` with assertions for the short-desktop breakpoint, grid usage, figure caps, `signout-box` grid participation, `.stat-num.is-text`, `setStatNum`, the themed title focus-visible style, and cache `v24`.
- Ran headless Chromium regression at 1440×800 and 390×844: desktop first controls for all six scenes are fully visible with no topbar overlap; mobile watch still requires scroll, consistent with the vertical narrative. Screenshots saved to `/tmp/goddead-qa/screenshots/`.

## 2026-07-21 (Existing scenes visual enrichment)
- Deepened the visual finish of the six public/early scenes to match the production bitmaps already in use for the hidden bureau rooms. Converted six source PNGs (1536×1024) to WebP with Pillow and added them to `assets/` without deleting any existing assets: `threshold-bureau-door.webp`, `visitor-protocol-board.webp`, `scripture-corridor.webp`, `prayer-incinerator.webp`, `remembrance-evidence-wall.webp`, `ninth-aperture.webp`.
- Replaced the hand-drawn inline SVG door on the threshold with a native `<button>` wrapping the new `threshold-bureau-door.webp` `<img>`; kept the three-knock ritual, Enter/Space keyboard handling, ajar glow, shake feedback, status copy and the door choice. Removed the inline SVG door geometry and its CSS, preserving only the seam-whisper and non-asset glow/shake effects.
- Added the protocol board between the header and the eight rules; the real rule list remains the only readable text. Added the corridor photograph as a masked base behind the eight `.frag` buttons, keeping all fragment positions, focus and click behavior. Added the incinerator image to the offering scene as a right/bottom layered asset while keeping the prayer input, button and response on top. Added the evidence wall as the stat-grid backdrop, preserving the 4×2 desktop / 2×4 mobile 8-card layout and all existing memory lines. Added the ninth aperture as the background of the hidden ninth scene, with the text floating above the dark upper area and the false door visible but not interactive.
- All new images use explicit `width="1536" height="1024"`, `pointer-events:none` where decorative, `alt=""` for non-semantic decoration, and radial/elliptical masks to feather into `#050505`. The threshold door is preloaded; other new images load lazily.
- Post-delivery, the `threshold-bureau-door.webp` asset was regenerated from a new Codex source PNG, re-encoded with Pillow at `quality=85` to 210 KB (≤220 KB target), and given art-direction CSS for desktop (640×585–680), short desktop/720px (520×460–580), and 390px mobile (340×480–560) viewports; the `seam-whisper` position was realigned to the new crop. Cache bumped to `v22`; static tests extended with asset existence/references, threshold door button/img contract, old SVG geometry removal, and cache-version assertions.

## 2026-07-20 (Acting Deity Desk)
- Added the hidden **代神席** scene (`#acting`): after refusing divine-name cancellation, the system rewrites the refusal as a temporary appointment. A `02† / 代神席` directory entry and a semantic entrance box inside the cancellation scene (both ship `hidden`, unfocusable, out of the accessibility tree) atomically reveal once the refusal is persisted.
- Unlock contract: `#acting` requires the full dependency quintuple `watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted && getCancel().refused`; the centralized `resolveScene` cascades acting → cancellation → deadletter → switchboard → watch → corridor with `history.replaceState` normalization, and the scene's own `goddead_acting` state never participates in entry/guard decisions (a stale `appointed=true` cannot open the door). State is fault-tolerantly parsed as `{value:0,appointed:false,appointedAt:0}` and clamps `value` to 0–100.
- The scene pairs a production bitmap (`assets/acting-deity-desk.webp`, 1536×1024, 99KB, Pillow-encoded from the source PNG, feather-masked into #050505, zero inline SVG) with a single native `input type="range"` interaction: label `代神席电闸`, `min="0" max="100" step="1"`, endpoints `离席` / `在岗`, hint `把在场推到不能再高的位置。`, synchronized `output` reading `在场：N%`, and `aria-valuetext` expressing the current state. Mouse, touch, arrow keys, Home/End all work.
- Three feedback bands follow the slider value without error counting or deadlocks: 0–33 `检测到犹豫。`, 34–66 `在场不能只登记一半。`, 67–99 `拒绝注销的人，没有离席选项。`. At 100 the switch locks, `appointed`/`appointedAt` persist, and five appointment lines reveal in rhythm (`任命对象：最后见证者。`, `授权来源：注销拒绝。`, `接收范围：所有无人应答的祷告。`, `神位等级：代行。`, `死亡状态：预登记。`) followed by the final sentence `你没有成为神。你只是接了祂没有交完的班。`.
- Reload restores the slider value, the locked state at 100, the five lines and final sentence without re-announcing or rewriting `appointedAt`; no agree/refuse buttons are added because appointment does not require consent.
- WebAudio-only additions (throttled mechanical switch friction, contact clicks, and a low relay lock sound at 100) ride the existing engine and global mute; timers are cleared on scene exit. Reduced-motion preserves all narrative text and reveals the appointment record immediately and completely.
- Cross-scene linkage: once appointed, the offering scene gains the hidden line `这些祷词现在会先经过你。` and remembrance gains one additional memory line `你没有成为神。你只是接了祂没有交完的班。` without adding a ninth stat card; the existing 8-card grid remains unchanged.
- Cache bumped to `v20`; tests extended with the acting contract; old cancellation 39/39, deadletter 35/35, and line4 27/27 suites re-run.

## 2026-07-20 (Divine Name Cancellation Office)
- Added the hidden **神名注销科** scene (`#cancellation`): signing the blank receipt in the Dead Letter Office spawns a file number that should not exist, revealing a `02⁺ / 注销科` directory entry and a semantic button inside the dead-letter office (both ship `hidden`, unfocusable, out of the accessibility tree).
- Unlock contract: `#cancellation` requires the full dependency quadruple `watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted`; the centralized `resolveScene` cascades cancellation → deadletter → switchboard → watch → corridor with `history.replaceState` normalization, and the scene's own `goddead_cancellation` state never participates in entry/guard decisions (a stale `solved=true` or `refused=true` cannot open the door). Entry visibility (`syncCancel`) shares the exact same dependency set. State is fault-tolerantly parsed as `{queries:0,solved:false,solvedAt:0,refused:false,refusedAt:0}`.
- The scene pairs a production bitmap (`assets/divine-name-cancellation.webp`, 1536×1024, 92KB, Pillow-encoded from the source PNG, feather-masked into the black, zero inline SVG) with a single search puzzle: a native form with label `待注销档案`, text input, submit `检索`, and the hint `输入档案状态，不是名字。`. Only `GODDEAD` (trimmed and case-normalized) is accepted; wrong queries persist a `queries` counter and escalate through three hints (`这里不按名字检索。`, `查状态，不查神。`, `域名已经替你填过一次答案。`), clamping at the third.
- Solving reveals five record lines in rhythm (immediate and complete under reduced-motion, aria-live announces only the current state), persists `solved`/`solvedAt`, restores fully on reload without re-announcing, and replays without re-counting. A native `拒绝注销` button then appears; clicking it persists `refused`/`refusedAt`, plays a dull stamp, and reveals two refusal lines (`驳回理由：仍在见证。`, `处理结果：拒绝已登记为在场证明。`).
- The remembrance scene gains an eighth `注 销` stat card (`—` / `驳回`) and a cancel-memory line that stays silent until refused: `系统试图注销你。你把拒绝留在了档案里。` The stat grid now lays out eight cards as four per row on desktop and two per row on mobile.
- WebAudio-only additions (light mechanical card-reader ticks for queries, a dull stamp for refusal) ride the existing engine and global mute; timers are cleared on scene exit. Cache bumped to `v19`; tests extended with the cancellation contract.
- CDP-driven headless Chromium regression passed 39/39 (clean/watch-only/unconnected/unsigned guard ladder, real accepted → atomic entry reveal, three wrong queries with clamped hints, Enter submits the normalized answer, five-line rhythm reveal, refusal persistence, reload without re-announce or re-count, same-SPA solve-then-leave-and-reenter full restoration with `enterCancel` shutting aria-live before DOM restore, remembrance stat/memory, bad-JSON fault tolerance, stale refused=true upstream-missing cascades, desktop/mobile overflow and bitmap framing, console hygiene, mute, reduced-motion immediacy) plus the old deadletter 35/35 and line4 27/27 suites re-run; evidence in `design-qa-evidence/`.

## 2026-07-02
- Initialized static site structure for goddead.com.
- Configured Cloudflare Pages deployment pipeline.
- Added base tests to check deployment files.

## 2026-07-03
- Reimagined the landing page as a digital liturgy around the word "goddead".
- Rewrote `index.html` with a ritual overlay, monumental letter-by-letter title, and triptych relic gallery.
- Rewrote `styles.css` with enhanced typography, void vignette, hover-driven gold glows, and refined responsive breakpoints.
- Rewrote `script.js` with an improved dust-particle void, mouse-reactive title parallax, richer audio drone engine, and scroll reveal animations.
- Preserved Cloudflare Pages deployment compatibility and existing test expectations.

## 2026-07-03 (second revision)
- Fully redesigned the page without reusing previous text or image content.
- Adopted the "Absence Cult" concept: an altar built from silence after the divine.
- Replaced image gallery with pure CSS-generated sacred geometries (absence ring, echo fissure, silence pyramid).
- Rewrote all copy as original prose/poetry around absence, echo, and silence.
- Kept `assets/hero.png` reference only for deployment test compatibility.

## 2026-07-03 (third revision)
- Expanded the Absence Cult page with three new content modules.
- Added The Lectionary: five tabbed readings for the unfaithful with gold active states.
- Added Chronicle of Vanishings: a vertical timeline of fictional years after the divine exit.
- Added Apocryphal Index: three animated counters measuring silence, unanswered prayers, and detected gods.
- Implemented scroll-triggered reveals and counter animations in `script.js`.
- Added responsive layouts and reduced-motion support for all new sections.

## 2026-07-03 (fourth revision)
- Translated all page copy to Chinese to match the requested tone.
- Shifted visual mood toward the uncanny: blood-red accents, mold green, bruise purple, heavier vignettes.
- Added glitch keyframes, title shiver, dripping blood line, warning flicker, and random text glitches via JS.
- Replaced English text scrambler with a Chinese character reveal effect (blur fade + per-character appearance).
- Darkened audio drone (E1 ~41.2 Hz) and made particle motion more erratic and unsettling.

## 2026-07-03 (fifth revision)
- Expanded the world-building into a lore-exploration page with four new modules.
- Added Forbidden Index: three expandable archive entries with redacted passages revealed on hover.
- Added Absence Map: four unsettling regions forming a cartography of the post-divine world.
- Added Witness Testimonies: three fragmented first-person accounts.
- Added False Names: six hover-revealed epithets people gave to the dead gods.
- Implemented accordion interactions, hover-redaction reveals, and scroll-triggered animations.

## 2026-07-03 (sixth revision)
- Added three sub-pages with interactive experiences instead of pure text:
  - `echo.html` — Echo Room where user input is repeated and corrupted over time.
  - `vein.html` — Vein Network: a living, mouse-driven growth of blood vessels.
  - `confession.html` — Confession Booth: user secrets receive cryptic responses and leave scratches.
- Added hidden portal links in the main page footer.
- Added "corruption" layer on the main page: growing stains, mouse-trail rot, random screen flicker, and page shivers.
- Added Easter eggs: Konami code burst, seven clicks on the title, and console messages.
- Reduced pure database feel in favor of polluted, haunted-web atmosphere.

## 2026-07-03 (seventh revision)
- Radically redesigned the homepage as a step-by-step ritual rather than a lore database.
- Removed all long-form text modules (doctrines, lectionary, chronicle, apocrypha, forbidden index, map, testimonies, false names) from `index.html`.
- Replaced them with four ritual stages:
  1. A pulsing red point with the whisper "祂正在死去。"
  2. A typewritten invocation: "神已死。祭坛还在饥饿。"
  3. The `GODDEAD` title emerging from darkness.
  4. Three gates leading to the sub-pages: 回声 / 血管 / 忏悔.
- Rewrote `styles.css` and `script.js` to support stage transitions, auto-advance, and persistent corruption effects.

## 2026-07-03 (eighth revision)
- Restored the previous lore text but exposed it interactively instead of stacking it on the homepage.
- Added a "Descent" button after the three gates; clicking it opens the "Abyss" corridor below.
- The Abyss reveals previous world-building modules as the user scrolls:
  - Three Doctrines of Absence
  - Forbidden Index (expandable entries with redacted hover reveals)
  - Absence Map
  - Witness Testimonies
  - False Names
- Kept the four-stage ritual flow intact while integrating the earlier text-based lore as optional, interactive depth.

## 2026-07-03 (ninth revision — major expansion)
- Massively expanded worldbuilding across the Abyss:
  - Six Doctrines of Absence (added Hunger Spiral, Mirror Void, Ashes Scripture).
  - Expanded Forbidden Index from 3 to 6 entries (A-156, A-204, A-287).
  - Expanded Absence Map from 4 to 8 regions (Slow Post Office, Jaw Library, Infant Lighthouse, Thirteenth Hour).
  - Added Fractured Chronicle with 6+ timeline entries, including a hidden year triggered by prayers.
  - Added Catalogue of False Saints with six non-human saints.
  - Added Unfinished Prayers module with an interactive prayer-completing input.
  - Added Undelivered Letters module with three sealed/torn/blood-stained letters.
  - Added Relic Gallery with four post-divine artifacts.
  - Added Silence Measurements with animated counters.
  - Added Bottom Well final section with depth button and escalating whispers.
- Enriched frontend interactions on the homepage:
  - Persistent corruption state saved to localStorage with a visible HUD.
  - Madness Mode toggle that intensifies visual/audio atmosphere.
  - Title click counter with escalating whispers and secret modal on the 7th/7-multiple clicks.
  - Altar sigil click counter; 7 clicks reveal a hidden fourth gate to the Reliquary.
  - Additional keyboard codes: "breath" and "goddead" trigger layered effects.
  - Right-click and text-selection easter eggs.
  - Idle whisper system, dwell-time tracking, and visibility-change whispers.
  - Secret modal system for lore drops.
  - Console API: openTheEye(), seeCorruption(), cleanse(), descend(), speakName().
  - Corruption canvas now occasionally emits floating runes in madness mode.
- Enhanced CSS with new sacred geometries, chronicle timeline, saint/prayer/letter/relic/measure modules, secret modal, corruption HUD, whisper feed, and madness-driven jitter/shiver animations.
- Enriched sub-pages:
  - `echo.html` now tracks echo count/depth, persists count, supports deeper corruption levels, and emits pulse rings.
  - `vein.html` now tracks node/pulse counts, supports multiple vein types (blood/bone/gold/mold), and shows contextual whispers.
  - `confession.html` now persists confessions to a memory wall, counts confessions, and the watching eye follows the cursor.
- Added `reliquary.html` — a hidden fourth sub-page that aggregates saved corruption, echoes, confessions, prayers, and memory fragments, with an option to forget them.

## 2026-07-10 (Split Testament redesign)
- Captured the live `goddead.com` homepage in desktop and mobile states before redesigning it.
- Explored three visual directions and implemented the selected third direction, **Split Testament**.
- Rebuilt `index.html` around a split editorial composition: a giant cropped `GOD / DEAD` wordmark on the left and three ritual gates on the right.
- Added project-local generated raster artwork for the archival scripture field and the Echo / Vein / Confession etched motifs.
- Rewrote `styles.css` with responsive desktop/mobile layouts, aged-bone and dried-blood tokens, title reveal motion, gate hover/focus states, menu drawer styling, and reduced-motion handling.
- Rewrote the homepage controller in `script.js` with a persistent ritual-point state, directory drawer, arrival counter, keyboard invocation, status copy, and preserved links to all four sub-experiences.
- Preserved Cloudflare Pages compatibility and the legacy `assets/hero.png` deployment-test contract.
- Verified at 1440 × 1024 and 390 × 844 with no horizontal overflow or browser-console errors.
- Tested the ritual-point toggle, directory open/close flow, Escape behavior, and navigation to the Echo page.
- Completed three visual QA passes; the final report in `design-qa.md` records `final result: passed`.

## 2026-07-13 (Click-to-explore rooms)
- Replaced long-scroll archive with full-viewport room exploration: click doors and fragments to advance.
- Added denser lore rooms (rift, void, law, years, scraps, map, voices, names, remains, you, under).
- Nested reveals: tiles, laws, year rack, scraps/redactions, map pins, voices, aliases, remains dossiers.
- Easter eggs: GOD→DEAD sequence, type `goddead`, red point ×7, arrivals ×7, map center `?`, all aliases, triple-click domain, secret undercroft.
- Top chrome shows exploration depth; directory locks unvisited deep rooms until paths open.

## 2026-07-13 (Absence Archive redesign)
- Rebuilt the site as a content-rich, artistic single-page archive around a full Goddead world bible.
- Replaced sparse gate/minigame homepage with nine chapters: prologue, doctrines, chronicle, forbidden index, cartography, witnesses, epithets, remains, and reliquary.
- Added a clearly labeled top-right **目录** drawer with section navigation, backdrop, Escape-to-close, and active-section highlighting.
- Kept light interactions only: awaken signal, expandable archive entries, redacted-text peeks, interactive map regions, epithet reveals, local arrival counter, and visitor mark archiving (localStorage).
- Retired Echo / Vein / Confession as primary experiences; old URLs redirect into the corresponding archive sections.
- Preserved Cloudflare Pages compatibility, `assets/hero.png` test contract, reduced-motion support, and mobile breakpoints.

## 2026-07-17 (The Living Shrine redesign)
- Rebuilt the homepage from a fixed split-screen into a scrolling five-movement ritual: altar, scripture bands, three gates, prayer offering, and traces.
- Reused the monument artwork (`monument_1/2/3.png`) as hover-revealed gate art; kept `testament-left.png` as the parallax altar backdrop and `assets/hero.png` as the grain layer to preserve the deployment-test contract.
- `styles.css`: new Living Shrine system — glitch/scatter wordmark states, typewriter caret, marquee bands, gate hover reveals, prayer burn layer, stat grid, sealed/unsealed Reliquary slot, custom cursor, awake/idle/midnight/miracle body states, full responsive breakpoints and reduced-motion handling.
- `script.js`: ash-and-ember canvas field with mouse disturbance and click bursts; master rAF loop driving particles, cursor lerp, wordmark parallax, and scroll-velocity scripture marquees; typewriter verse cycle; prayer burning that persists `goddead_state.prayersOffered`/`corruption` for `reliquary.html`; animated trace counters; arrival-based Reliquary unsealing.
- Easter eggs: `goddead` invocation, Konami ember-storm miracle, seven wordmark clicks (scatter), seven arrivals (Reliquary), midnight visitor verse, 45s idle silence whisper, three-second scripture gaze revealing a hidden sentence, and console hints.
- Hardened the band-duplication loop with an iteration guard; verified visually at 1440 and 390 widths plus awake, gate-hover, menu-open, and Reliquary-unlocked states via headless Chromium screenshots.

## 2026-07-19 (Door ritual revision)
- Replaced the `GOD / DEAD` wordmark and typewriter verse altar with a centered `神已死` title and a sealed, symbol-covered SVG door.
- Added mouse and keyboard knocking: the third knock parts the door around a glowing seam, the fourth triggers a warning, and the seventh receives a delayed knock in reply.
- Added rotating blood-red whispers around the doorway, with a stable reduced-motion fallback.
- Inserted an eight-item visitor protocol between the doorway and scripture bands, including altered and contradictory rules.
- Updated the door, whisper, protocol, responsive, and reduced-motion styling and bumped the homepage asset cache key to `v12`.
- Refreshed the README experience description and ignored macOS `.DS_Store` metadata.
- Verified JavaScript syntax, the static-site test suite, whitespace integrity, and the intended source files' sensitive-token scan before commit.
- Tightened the doorway hero spacing and capped the door artwork against viewport height so the complete entrance remains visible on shorter screens.

## 2026-07-19 (Exploration game restructure)
- Rebuilt the homepage from a scrolling page into a hash-routed, scene-by-scene exploration game (`#threshold` → `#protocol` → `#corridor` → `#offering` → `#remembrance`, plus a hidden `#ninth`).
- Kept the doorway hero untouched as the game entrance: three knocks part the door and offer an explicit 进去 / 不进 choice; clicking the door itself while ajar still triggers the fourth-knock warning.
- Promoted the visitor protocol to a full scene with interactions: per-rule click responses, an escalating rule-seven annotation, and a rule-count anomaly that occasionally flashes 玖 — clicking it opens the hidden ninth-rule scene.
- Moved the scripture bands and three gates into a corridor scene and added a sealed fourth gate that answers with a single knock until seven arrivals unseal the Reliquary.
- Added a WebAudio atmosphere engine (detuned low drone with breathing filter, synthesized knocks, door bells, scene-transition whoosh) gated behind the first user gesture with a persistent top-bar mute toggle.
- Added scene transitions via a black veil, per-scene reveal staggering, per-scene document titles, and scene-internal scrolling; removed the old footer/scroll-cue chrome and folded arrivals, colophon whisper, and domain mark into the remembrance scene.
- Verified all six scenes at 1440 and 390 widths (threshold, protocol with anomaly, corridor, offering, remembrance, ninth, and the ajar choice state) with headless Chromium screenshots; test suite passes and asset cache bumped to `v13`.
- Updated the README to describe the scene-based navigation, hidden ninth rule, and opt-in audio experience.

## 2026-07-19 (Fragments & crookedness revision)
- Removed the Echo / Vein / Confession interactive pages and their gates; the corridor now holds eight crooked lore fragments （残页） that can be picked up, plus the sealed Reliquary gate. Reading fragments feeds a new persistent 碎片 counter and the corruption formula.
- Pushed the whole site toward the uncanny: titles slowly sway off-axis, the 神已死 characters sit skewed, protocol rules tilt and offset per row (and straighten under the cursor), fragments lie scattered at odd angles, and the stat grid dropped to four cards （抵达 / 碎片 / 祷词 / 侵蚀度）.
- Added text self-corruption: every 9–23s a random character in a visible plain-text passage briefly swaps for a blood-red wrong character before reverting.
- Added distant knocking tied to protocol rule two: every 40–90s the page trembles with a faint knock (sometimes two), with no explanation offered.
- Removed the three sub-pages from the drawer menu; reliquary.html kept as-is (its archived echo/confession counters simply rest at zero).
- Verified corridor / protocol / remembrance scenes at 1440 and 390 widths via headless Chromium; test suite passes.
- Updated the README for the fragment-based corridor and confirmed the active site no longer links to the removed room pages.

## 2026-07-20 (Third Night-Watch Room)
- Added the hidden **第三值夜室** scene (`#watch`): collecting at least three corridor fragments silently reveals a narrow door in the corridor wall and a `02½ / 值夜室` entry in the directory; below three fragments both ship `hidden` (unfocusable, out of the accessibility tree), and the hash router hard-blocks every path into the room — direct `#watch` loads, `hashchange` tampering, and synthetic `data-go="watch"` clicks all redirect to the corridor and normalize the address bar via `history.replaceState`.
- Room contents: a desk clock frozen at 03:17 whose second hand occasionally runs backward (with a soft tick), a handover log whose five semantic-button entries overwrite themselves with blood-red rewrites (Enter/Space operable, `aria-pressed` toggle semantics, covered originals leave the a11y tree so screen readers only announce the current text), a dynamic entry registering the visitor by arrival count and fragment count (`抵达记录：未登记` when arrivals is 0 — never `第 0 次抵达`), an empty chair whose shadow slowly turns toward the visitor, and a sign-out button that permanently refuses and persists `goddead_watch` into the remembrance scene.
- WebAudio-only additions inside the room (fluorescent 120 Hz hum, one faraway telephone ring, reverse-tick clicks), all routed through the existing engine and global mute; reduced-motion skips the clock, shadow creep, and door-trace cycles while keeping all narrative text.
- Regression-verified for real via CDP-driven headless Chromium (18/18): lock/unlock guard, atomic restore at 3 fragments, keyboard log covering, arrivals=0 copy, sign-out refusal persistence, and zero door/fragment rectangle overlap at 1440×1024 and 390×844; evidence in `design-qa-evidence/`, report in `design-qa.md`.
- Removed the temporary QA copies `__qa.html` / `__qa.js`; test suite passes.

## 2026-07-20 (Watch room bitmap deepening)
- Replaced the placeholder-like inline SVG geometry in the Third Night-Watch Room with production bitmap assets after an independent P2 visual finding: `assets/watch-clock-face.webp` (aged 03:17 dial), `assets/watch-second-hand.png` (chroma-keyed transparent second hand, registered on the same 900×900 canvas as the dial, hub aligned to the dial's geometric center), and `assets/watch-room-desk.webp` (empty desk and chair scene, brightness 0.94 with a feathered mask so the black surround melts into the page).
- The second hand keeps rotating around its true pivot via the existing JS (backward runs, soft ticks, reduced-motion skip all unchanged); the chair shadow became a blurred ellipse overlay on the bitmap chair, still creeping toward the visitor; `role="img"` / `aria-label` exposure preserved on both clock and desk.
- Raised watch-room readability without lifting the darkness: log backdrop 0.5→0.68, entry weight 300→400, brighter log numbers and clock caption.
- Bumped the asset cache key to `v15`; extended `tests/site.test.mjs` with asset-existence, reference, and inline-SVG-removal assertions.
- CDP-driven headless Chromium regression passed 16/16 (lock/unlock guard, Enter/Space log covering, arrivals=0 copy, sign-out persistence, second-hand rotation, reduced-motion, zero door/fragment overlap and no horizontal overflow at desktop and 390 widths); evidence `watch-room-desktop-v2.png` / `watch-room-mobile-v2.png`.
- 本轮 Kimi 额度与上下文用量记录见 `docs/KimiUsageLog.md`。

## 2026-07-20 (Fourth line / Echo Switchboard)
- Added the hidden **余响交换台** scene (`#switchboard`): the night-watch room only *hears*; the switchboard decides where those sounds go. The 05:02 call was never a mis-ring — it came back up a fourth line with no endpoint.
- Unlock contract: covering the 05:02 handover entry (值-叁-0469) **and** attempting to sign out at least once, in any order, deterministically unlocks a semantic 接 听 button plus an aria-live announcement (「桌下那部不存在的电话，开始第二次响。」) and the `02¾ / 第四线路` directory entry. While locked, both entries ship `hidden` (unfocusable, out of the a11y tree) and the router hard-blocks direct `#switchboard`, hashchange, and synthetic `data-go` navigation back to `#watch` with `history.replaceState` normalization. All state lives in `goddead_line4` with fault-tolerant parsing.
- The scene pairs a production bitmap (`assets/line-four-switchboard.webp`, feather-masked into the black, zero inline SVG) with a crooked paper-style 接线簿: three callback lines (door knocks × awake, offering ashes × prayersOffered 0/N branches, empty-shift report × fragments/arrivals/refused sign-outs) as native buttons with click and Enter/Space support, aria-pressed semantics and persisted heard state; a truly-disabled fourth line with a readable reason that atomically enables as 「肆 · 第四线路」 once the first three are heard.
- Connecting the fourth line reveals a five-line record in rhythm (immediate and complete under reduced-motion, aria-live announces only the current line), persists the connected end state, restores fully on reload without re-announcing, and replays without accumulating. The remembrance scene gains a 线 路 stat (— / 04) and the line-memory sentence.
- WebAudio-only additions (plug contact clicks, quiet band-passed line noise, intermittent faraway rings at reduced volume) ride the existing engine and global mute; leaving the scene tears down noise and timers. Cache bumped to `v16`; tests extended with the switchboard contract; existing watch/offering/reliquary unlock meanings untouched.
- CDP-driven headless Chromium regression passed 31/31 (locked guards, both unlock orders, reload persistence, keyboard line covering, disabled→enabled→connect→reload→replay, dynamic 0/N branches, remembrance, mute, reduced-motion, desktop/mobile overflow and subject framing); evidence in `design-qa-evidence/`.
- P1 fix (independent review): the sequential `if` guards let `switchboard → watch` rewriting skip the watch guard, so a clean-storage visit to `#switchboard` with 0 fragments landed inside the locked night-watch room. Guards are now centralized in `resolveScene`, cascading in dependency order (switchboard → watch → corridor) with address-bar normalization and a static order assertion; clean-storage CDP matrix proves all four guard outcomes plus that hidden scenes take no real mouse input. Full regression re-run: 37/37.
- P1 follow-up (stale line4 escalation): the centralized guard still keyed the switchboard branch on `line4Unlocked()` alone, so a stale `goddead_line4.unlocked=true` with 0 fragments could enter `#switchboard` directly. Each scene now declares its full prerequisites — switchboard requires both `watchUnlocked()` (three fragments) and `line4Unlocked()` — instead of relying on branch order, and `syncLine4` shares the same dependency set so the answer box and directory entry stay `hidden` while fragment progress is insufficient. Static contract asserts the joint condition; CDP regression 27/27 covers the stale matrix (direct loads, hashchange tampering, synthetic `data-go`, hidden-entry inertness), the three lock states (watch locked / switchboard locked / both unlocked) with reload persistence, and a tamper-down case that zeroes fragments after full unlock and must fall to `#corridor`. Cache bumped to `v17`; evidence `design-qa-evidence/switchboard-stale-guard.png`.
- 最终验收：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；CDP 真实交互回归 27/27；浏览器桌面/移动/门禁/控制台由监理独立验收通过。本轮 Kimi 额度与上下文用量记录见 `docs/KimiUsageLog.md`。

## 2026-07-20 (Dead Letter Office)
- Added the hidden **无主投递所** scene (`#deadletter`): the fourth line was never a telephone line — it is the return address that delivers unanswered prayers, door knocks, and refused sign-outs to a dead-letter bureau. Connecting the fourth line atomically reveals a semantic 送 往 投 递 所 button inside the switchboard plus the `02⅞ / 投递所` directory entry (both ship `hidden`, unfocusable, out of the a11y tree).
- Guard contract: `#deadletter` requires the full dependency triple `watchUnlocked() && line4Unlocked() && getLine4().connected`; the centralized `resolveScene` cascades deadletter → switchboard → watch → corridor with `history.replaceState` normalization, and the scene's own `goddead_deadletter` state never participates in entry/guard decisions (a stale `accepted=true` cannot open the door). Entry visibility (`syncDeadletter`) shares the exact same dependency set. State is fault-tolerantly parsed as `{returned:[false,false,false],accepted:false,acceptedAt:0}`.
- The scene pairs a production bitmap (`assets/dead-letter-office.webp`, 1536×1024, 90KB, feather-masked into the black, blank receipt centered, zero inline SVG) with a 退件登记台 in the same paper-archive language as the handover log and patch book: three undeliverable items as native buttons (click + Enter/Space, aria-pressed, covered originals leave the a11y tree, persisted) with dynamic return reasons (fourth knock from inside / prayersOffered 0/N branches / fragments·arrivals·sign-out-attempts as续班). The central blank receipt is a fourth, truly-disabled button with a readable countdown reason; it atomically enables as 签收空白件 once all three are filed.
- Signing reveals a six-line final record in rhythm (immediate and complete under reduced-motion, aria-live announces only the current state), persists `accepted`/`acceptedAt`, restores fully on reload without re-announcing, and replays （重读记录） without re-counting. The remembrance scene gains a 投 递 stat (— / 03) and a memory line that stays silent until signed: 「你替一间没有收件人的邮局签收了自己。」
- WebAudio-only additions (pneumatic-tube suction, dull stamp hit, print ticks) ride the existing engine and global mute; intermittent tube passes and record timers are torn down on scene exit. Cache bumped to `v18`; tests extended with the deadletter contract; existing watch/line4/offering/reliquary unlock meanings untouched (full guard regression re-run).
- CDP-driven headless Chromium regression passed 35/35 (clean/watch-only/unconnected guard ladder, real connect → atomic entry reveal, real mouse + Enter filing with countdown reason, disabled→enabled receipt, real keyboard signing, six-line rhythm reveal, reload persistence without re-announce or re-count, stale accepted=true upstream-missing cascades, desktop/mobile overflow and bitmap framing, console hygiene, mute, reduced-motion immediacy) plus the 27/27 line4/watch suite re-run; evidence in `design-qa-evidence/`.
