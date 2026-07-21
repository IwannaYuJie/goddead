# Design QA — Living Shrine · 场景探索版（含值夜室 · 第四线路 · 无主投递所 · 神名注销科 · 代神席 · 自动转场 · 现有场景视觉深化）

适用范围：当前 goddead.com 首页（哈希路由场景探索游戏）。本文替代旧 Split Testament 版 QA 报告；旧版证据文件保留在 `design-qa-evidence/` 中仅作历史存档，不再代表现状。

## 本轮新增：线性自动转场（Auto-Advance Flow，v24）

- 目标：把原先「主动作 → 底部前进按钮 → 二次确认按钮」的流程，改为「主动作完成 → 短反馈 → 自动进入下一场景」，不再要求用户滚动并点击继续。
- 实现：在 `script.js` 中新增统一 `AutoAdvance` 调度器，每个场景持有一个 scope timer，离场/重复触发时调用 `AutoAdvance.clear(scene)`/`clearAll()`；所有调度只在真实用户操作后发生，受 `initialRouteDone` 保护，因此持久状态恢复或直接打开 hash 时绝不会自己跳走。
- 九段自动转场：
  1. threshold 第三次敲门 → protocol
  2. protocol 首次主动激活任意守则 → corridor（仅 click/Enter/Space；hover/focus 不跳转）
  3. corridor 读到第三张残页 → watch
  4. watch 覆盖 05:02 记录 + 尝试签退 + 第四线路解锁 → switchboard
  5. switchboard 听完前三回线并接通第四线 → deadletter
  6. deadletter 归档三封退件并签收空白回执 → cancellation
  7. cancellation 检索 `GODDEAD` 并点击拒绝注销 → acting
  8. acting 电闸达到 100% → offering
  9. offering 首次提交非空祷词 → remembrance
- 终点：remembrance 与 ninth 不自动循环。
- 会话内消耗标记：`protocolConsumed` / `corridorConsumed` / `watchConsumed` / `cancellationConsumed` / `actingConsumed` / `offeringConsumed` 只在 timer 真正触发前的 `before` 回调里置 `true`；如果 timer 被回退导航取消，玩家回到该场景并再次执行相关主动作即可重新 schedule。直接 hash/刷新恢复持久状态时这些标记为 `false`，但没有任何用户操作触发 schedule，因此不会误跳。
- 反馈时长：普通模式约 0.9–1.4 s；reduced-motion 约 0.35 s，仍保留文字提示顺序。
- 切换行为：每次 `goScene` 将目标场景 `scrollTop` 归零，并把焦点移到新场景的 `.sec-title`/`.ninth-rule`/`.dead-title`（动态 `tabindex="-1"`），保证键盘与读屏顺序。
- 导航精简：删除了门外 进去/不进 选择按钮、所有线性路径上的底部前进按钮、以及 `answer`/`deliver`/`cancel`/`acting` 这类跨幕二次确认按钮；只保留目录抽屉与明确的回退导航，且没有向 `#offering` 的跨幕捷径。
- watch 主动交互原则：交班簿的 `pointerenter` 仅做被动揭字（`coverLogVisual`），不更新 `phoneCovered`、不 schedule；只有 `click` / `Enter` / `Space` 主动激活 05:02 时才写状态并触发 `tryScheduleWatch`。已 covered 的 05:02 再次主动点击仍可恢复 schedule。
- corridor 恢复：fragments ≥ 3 时，主动触碰任意残页（含已读）可恢复 schedule。
- cancellation 恢复：已 refused 后，再次主动提交检索表单可恢复 schedule。
- acting 恢复：已 appointed 后，`#acting-switch` 容器动态提升为可聚焦按钮（`tabindex="0"`、`role="button"`、aria-label），鼠标点击与 Tab+Enter/Space 均可恢复 schedule；未任命时该容器不附加可交互 role，避免与可用 range 嵌套冲突。
- switchboard 第四线与 deadletter 回执保留重复点击可重新 schedule。
- 提示：每个自动转场触发时通过 `toast`/就地 `answer-note`/`deliver-note`/`cancel-note`/`acting-note` 等告诉用户当前主动作与即将发生的状态变化。
- 保留：所有状态守卫、隐藏场景解锁条件、彩蛋、视觉素材、WebAudio 音效、localStorage 兼容、reduced-motion 立即完整揭示。

## 本轮新增：短桌面首屏可操作性 + 统计卡/焦点视觉优化

- 适用范围：宽度 ≥721px 且高度 ≤800px 的短桌面视口（验收尺寸 1440×800、1366×768）。
- 目标：消除「首屏只有大图、核心交互仍在折叠下方」的误解，让各场景进入后无需滚动即可操作第一个核心控件。
- 实现：`styles.css` 新增 `@media (min-width: 721px) and (max-height: 800px)`：
  - 相关场景 body 上内边距设为 `clamp(92px, 10vh, 130px)`，在固定顶栏与日期文字下方留出安全净空，避免 kicker/标题/焦点框重叠；同时仍保证首屏可见首个核心控件；
  - 限制位图 figure 高度（protocol 240px、switchboard/deadletter/cancellation/acting 230px、watch desk 140px），保持 object-fit 裁切而非缩成小图；
  - protocol/switchboard/deadletter/cancellation/acting 使用两栏网格：控件在左、位图在右；
  - watch 使用更紧凑的 `watch-room` 网格，签退按钮与桌椅并排，05:02 记录与签退均进首屏；
  - 不破坏 corridor/offering 的首屏可用性；不重新加入任何底部前进/二次确认按钮；不使用 fixed/sticky 覆盖内容。
- 统计卡文本溢出修复：`stat-num` 的长文本值（`未签退 · N`、`驳回`）添加 `.is-text` modifier，字号缩小并 `white-space: nowrap`，确保不越出卡片边界、不挤压相邻内容；数字型统计值保持原有视觉层级。`script.js` 通过 `setStatNum(el, value, isText)` 统一设置并切换 modifier。
- 标题焦点视觉优化：自动转场后聚焦标题时，浏览器默认亮蓝矩形改为非整框式主题反馈：`outline: none`，底部一条血线（`box-shadow: 0 2px 0 0 rgba(192, 74, 66, 0.7)`）加轻微文字光晕，既清楚可见又不包成输入框式矩形；作用于 `.sec-title`、`.ninth-rule`、`.dead-title`。
- acting-switch 键盘修复保留：未 appointed 时容器无 `tabindex`/`role`，不进入 Tab 顺序；appointed 后容器提升为 `role="button"`，鼠标点击与 Tab+Enter/Space 均可恢复 schedule。
- 资源缓存版本升至 `v24`（`styles.css?v=24`、`script.js?v=24`）。
- 回归结果（无头 Chromium）：
  - 1440×800 / 1470×718：protocol 守则其一、watch 05:02 与签退、switchboard 回线壹、deadletter 退件壹、cancellation 检索输入、acting range 全部完全可见，且 kicker/标题与顶栏无重叠；
  - 390×844：corridor/offering 仍首屏可操作，watch 因垂直叙事仍需滚动，其余场景核心控件可见，顶栏无重叠。

## 本轮新增：现有场景视觉深化（Visual Enrichment）

- 目标：让门外、访客守则、走廊、焚献、痕迹、第九条六个公共/早期场景的视觉完成度追上已位图化的值夜室、交换台、投递所、注销科、代神席。
- 新增正式图片（均由 Codex 生成，Kimi 仅做 Pillow 转码与接入）：
  - `assets/threshold-bureau-door.webp`（门外主界面）
  - `assets/visitor-protocol-board.webp`（访客守则）
  - `assets/scripture-corridor.webp`（走廊）
  - `assets/prayer-incinerator.webp`（焚献）
  - `assets/remembrance-evidence-wall.webp`（痕迹）
  - `assets/ninth-aperture.webp`（第九条）
- 门外：原 inline SVG 线框门替换为原生 `<button id="door-btn">` 包裹 `<img id="door-img" src="assets/threshold-bureau-door.webp">`；保留三次敲门、Enter/Space、门缝微光、状态文案与 进去/不进 选择；旧门体 SVG 几何与对应 CSS 已移除。
- 守则：图片位于标题与真实八条规则之间，约 440–620px 可见高度，不压字。
- 走廊：图片作为 `.frag-field` 的底层空间，八张 `.frag` 仍在上层可点击、可聚焦。
- 焚献：炉体图在桌面位于右下，标题/输入/按钮/回应在上层；移动端标题 → 图片 → 输入依次可见，CTA 不被挤出首屏。
- 痕迹：证物墙作为 8 卡统计区背景，桌面 4×2、移动 2×4 不变，卡片对比清晰，未新增第九张卡。
- 第九条：裂口图作为场景背景，文字居于暗部上层，底部错误窄门可见但不可点击。
- 性能：首屏门图 preload，其余新图 `loading="lazy" decoding="async"`；所有 `<img>` 显式写 1536×1024。
- 缓存版本升至 `v22`；静态契约与全部隐藏场景守卫/状态保持不变。

## 本轮 QA（现有场景视觉深化）

- `node tests/site.test.mjs`：全量静态断言通过（含 v22 缓存、六张 WebP 素材存在与引用、门体 button/img 契约、旧门 SVG 几何清零、第九条 aria-label 全中文、favicon hero.png 声明、Space-only keydown fallback 静态契约）。
- 桌面/移动真实截图证据 12 张（`visual-*-desktop-v1.png` / `visual-*-mobile-v1.png`）均无横向溢出，控制台无 error/warning。
- 门外门图最终交付：Codex 生成 1536×1024 PNG，Pillow 转 WebP `quality=85`，体积 210 KB（≤220 KB），替换 `assets/threshold-bureau-door.webp`；因素材变化缓存由 `v21` 升至 `v22`。
- 门图 art direction：桌面默认 `.door-scene` 宽 `min(84vw, 640px)`、`.door-img` 高 `clamp(560px, 62vh, 680px)`、`object-position: center 38%`；短桌面（`max-width: 1440px` 且 `max-height: 860px`，覆盖 1440×800）高 `clamp(460px, 56vh, 540px)`、宽 `min(78vw, 520px)`；移动 ≤720px 高 `clamp(460px, 56vh, 580px)`、宽 `min(86vw, 420px)`；移动 ≤390px 高 `clamp(480px, 54vh, 560px)`、宽 `min(92vw, 340px)`。
- `seam-whisper` 随新裁切调整：桌面默认 `top: 60%`，短桌面 `top: 58%`，落点对应门缝/把手区域。
- 门的键盘最终策略：Enter 沿用原生 `<button>` click，Space 因 CDP 环境未触发原生激活，故补 Space-only `keydown` fallback（`e.key === " "` 时 `preventDefault()` + `knock()`），经 Codex 在真实 in-app browser 连续三次 Space 敲击验证 `#door-scene` 获得 `ajar` 类。
- 最终全量 CDP 回归（`/tmp/goddead-qa/cdp-visual-enrichment.mjs`）因传输层超时（`Input.dispatchKeyEvent: no CDP response within 20s` / `Page.navigate: no CDP response within 20s`）未能形成单次全绿，因此不记录 38/38。
- 旧隐藏场景套件在视觉素材接入后串跑全过：acting 40/40、cancellation 39/39、deadletter 35/35、line4 27/27。

## 视口与方法

- 桌面：1440 × 937（值夜室/交换台整室使用 1440 × 1700 加高视口以容纳整室）
- 移动端：390 × 844（走廊/值夜室使用 390 × 1500–1600 加高视口验证完整构图）
- 工具：无头 Chromium（chrome-headless-shell）经 CDP 驱动真实运行：预置 localStorage 状态后整页重载，执行真实点击、真实键盘事件（Enter/Space 激活语义按钮）与矩形相交检测；锁定/解锁两态均以此方式回归，非静态副本
- 静态断言：`node tests/site.test.mjs`

## 本轮证据（第三值夜室）

| 场景 / 状态 | 证据 |
| --- | --- |
| 门外（桌面 / 移动） | `design-qa-evidence/scene-threshold-desktop.png` · `scene-threshold-mobile.png` |
| 访客守则（桌面 / 移动） | `design-qa-evidence/scene-protocol-desktop.png` · `scene-protocol-mobile.png` |
| 走廊 · 未解锁（无门、无硬锁提示） | `design-qa-evidence/scene-corridor-desktop.png` |
| 走廊 · 墙上仅门框痕迹 | `design-qa-evidence/corridor-door-trace.png` |
| 走廊 · 窄门已出现（桌面 / 移动） | `design-qa-evidence/corridor-narrow-door.png` · `corridor-narrow-door-mobile.png` |
| 值夜室 · 默认（桌面 / 移动） | `design-qa-evidence/scene-watch-desktop.png` · `scene-watch-mobile.png` |
| 值夜室 · 交班簿全覆盖 + 动态登记 + 签退被拒（桌面 / 移动） | `design-qa-evidence/watch-covered-signout.png` · `watch-covered-signout-mobile.png` |
| 焚献 | `design-qa-evidence/scene-offering-desktop.png` |
| 痕迹 · 值夜记忆已登记 | `design-qa-evidence/scene-remembrance-watch.png` |
| 隐藏幕 · 第九条 | `design-qa-evidence/scene-ninth-desktop.png` |
| 复核 · 锁定态：直达 #watch 被拦回走廊，墙上无门 | `design-qa-evidence/watch-locked-guard-desktop.png` |
| 复核 · 解锁态走廊：窄门与 8 张残页零相交（桌面 / 移动） | `design-qa-evidence/corridor-unlocked-desktop-1440.png` · `corridor-unlocked-mobile-390.png`（残页区另见 `corridor-frags-mobile-390.png`） |
| 复核 · 值夜室键盘覆盖 + arrivals=0 动态登记 | `design-qa-evidence/watch-room-keyboard-covered-desktop.png` |
| 位图深化 · 值夜室整室（桌面 1440×1700 / 移动 390×1600） | `design-qa-evidence/watch-room-desktop-v2.png` · `watch-room-mobile-v2.png` |
| 第四线路 · 锁定态：直达 #switchboard 被拦回 #watch | `design-qa-evidence/switchboard-locked-guard.png` |
| 第四线路 · 守卫矩阵：0 残页直达 #switchboard 落 corridor | `design-qa-evidence/switchboard-guard-corridor.png` |
| 第四线路 · stale 守卫：line4=true + 0 残页直达 #switchboard 落 corridor（墙上无门） | `design-qa-evidence/switchboard-stale-guard.png` |
| 无主投递所 · 锁定守卫：清空状态直达 #deadletter 落 corridor | `design-qa-evidence/deadletter-locked-guard.png` |
| 无主投递所 · 整室（桌面 1440×1700 / 移动 390×1600） | `design-qa-evidence/deadletter-desktop-v1.png` · `deadletter-mobile-v1.png` |
| 无主投递所 · 签收终态（三封归档 + 签收空白件 + 终局记录） | `design-qa-evidence/deadletter-accepted-desktop.png` |
| 无主投递所 · 痕迹页「投 递 = 03」与投递记忆 | `design-qa-evidence/remembrance-deliver.png` |
| 神名注销科 · 锁定守卫：已接通未签收直达 #cancellation 落 deadletter | `design-qa-evidence/cancellation-locked-guard.png` |
| 神名注销科 · 整室（桌面 1440×937 / 移动 390×844 CSS 视口，2x 截图 780×1688） | `design-qa-evidence/cancellation-desktop-v1.png` · `cancellation-mobile-v1.png` |
| 神名注销科 · 检索命中 + 拒绝注销终态 | `design-qa-evidence/cancellation-solved.png` |
| 神名注销科 · 痕迹页「注 销 = 驳回」与注销记忆 | `design-qa-evidence/remembrance-cancellation.png` |
| 第四线路 · 接通终态（桌面，5 行记录） | `design-qa-evidence/switchboard-connected-desktop.png` |
| 第四线路 · 交换台整室（桌面 1440×1700 / 移动 390×1600） | `design-qa-evidence/switchboard-desktop-v1.png` · `switchboard-mobile-v1.png` |
| 第四线路 · 痕迹页「线 路 = 04」与线路记忆 | `design-qa-evidence/remembrance-line4.png` |
| 代神席 · 锁定守卫：refused 前 cancellation 内入口 hidden | `design-qa-evidence/acting-locked-guard.png` |
| 代神席 · 整室（桌面 1440×937 / 移动 390×844 CSS 视口，2x 截图 780×1688） | `design-qa-evidence/acting-desktop-v1.png` · `acting-mobile-v1.png` |
| 代神席 · 任命终态（range 锁定 + 五行 + 终句） | `design-qa-evidence/acting-appointed.png` |
| 痕迹页 · 代神席记忆与 offering 联动 | `design-qa-evidence/remembrance-acting.png` |

## 检查结果

- 门外 / 守则：与上一验收轮一致，未回退；标题歪斜、守则条目倾斜错位、"玖"异变均正常。
- 走廊：未满足条件时无门、无任何锁提示，仅门框痕迹偶现（证据 `corridor-door-trace.png`）；窄门出现后与残页无遮挡（初版与 f3 残页重叠，已调整至 right 10–11% 并提升层级后复检通过）；移动端门落于碎片列末端右下，可点达。
- 值夜室构图：桌面为「钟 + 交班簿」双栏歪斜构图，桌椅与签退居下；移动端为错位单栏（钟左倾、簿右倾），非整齐竖排，正文可读性优于走廊碎片。
- 钟（位图深化后）：正式旧钟面位图（`assets/watch-clock-face.webp`），时针分针定格 03:17；秒针为去绿幕透明 PNG（`assets/watch-second-hand.png`），与钟面同画布配准、绕真实轴心旋转，血色可见；秒针倒退与钟针轻响为 JS 运行时行为，截图无法呈现，以代码审查、CDP 回归与本地试听为准。
- 桌椅（位图深化后）：正式场景位图（`assets/watch-room-desk.webp`）替代内联 SVG 线框；四周黑场经 mask 羽化融入页面，亮度压至 0.94，桌面与移动端家具完整不裁切；椅影转为叠加在位图椅子上的模糊椭圆，仍由 JS 缓慢转向访客。
- 交班簿：5 条记录编号连续（值-叁-0466 ~ 0470），印章文字故意不可辨（余响观□所）；覆盖态下原句划线变淡、血红色改写句浮现；动态条按玩家抵达次数与残页数写成「本班新增访客：你」。
- 签退：按钮按下后进入永久拒绝态（disabled + 「你没有签到，无法签退。」），`goddead_watch` 持久化；痕迹页新增「值夜」卡片与值夜记忆行（证据 `scene-remembrance-watch.png`）。
- 声音：全部经由既有 WebAudio 引擎合成（日光灯 120Hz 低鸣、一次极远电话铃、钟针倒退轻响），无外部音频文件，服从全局静音与首次手势启动。音频无法在截图中验证，属人工验收边界。
- reduced-motion：全局 0.01ms 动画坍缩覆盖新组件；秒针、椅影缓动、门框痕迹循环在 JS 层按 `reduced` 跳过，叙事信息（交班簿五条、覆盖文本、签退结果）全部保留。
- 无横向溢出；桌面与移动端顶栏、目录抽屉、静音按钮均正常。
- 神名注销科：位图终端（`assets/divine-name-cancellation.webp`）经椭圆 mask 羽化融入 #050505，桌面与移动端主体完整不裁切；检索表单为原生 form，label/input/submit 关联正确；三次错误提示递进并在第三次后停住，Enter 提交 trim + 大写归一后的 `GODDEAD` 后五段档案按节奏显现，末段「注销对象已更正：见证者」；拒绝按钮随后显现，点击后登记 `refused` 并揭示两段驳回文案；痕迹页新增第八卡「注 销」与取消记忆行。
- 代神席：正式位图 `assets/acting-deity-desk.webp`（1536×1024，99KB）经 radial mask 羽化融入 #050505；原生 `input[type="range"]` 标签为 `代神席电闸`，min/max/step 0/100/1，两端文字 `离席`/`在岗`，`output` 同步 `在场：N%`，aria-valuetext 表达当前状态；0–33/34–66/67–99 三段反馈跟随区间、不死锁；到 100 后 range 锁定，五行任命档案按节奏显现，终句「你没有成为神。你只是接了祂没有交完的班。」；reload 完整恢复锁定态与 appointedAt；未任命时不剧透，任命后 offering 新增联动句、remembrance 新增一条记忆，8 卡网格不变。

## 复核（2026-07-20，CDP 真实运行回归，18/18 通过）

- 锁定态（fragments<3）：窄门与目录入口带 `hidden` 且计算样式 `display:none`（不进无障碍树），`focus()` 无法聚焦；`#watch` 直达加载、`location.hash` 篡改、`data-go="watch"` 合成点击三条路径均被路由守卫拦回走廊，地址栏经 `history.replaceState` 同步为 `#corridor`，不留假状态。
- 解锁态（fragments=3）：整页重载后窄门与目录入口的 `hidden` 同步移除（原子恢复），窄门淡入出现，可正常进入值夜室。
- 交班簿：5 条均为语义 `<button>`；CDP 注入真实 Enter / Space 键事件均可触发覆盖，覆盖后 `aria-pressed=true`、原文 `aria-hidden` 移出朗读、按钮 `aria-label` 只含当前改写文本（屏幕阅读器只读当前文本）；`:focus-visible` 描边在截图中可见（0467 条）。
- 动态登记：arrivals=0 时写成「抵达记录：未登记 · 带走残页 N 张」，全文无「第 0 次抵达」。
- 窄门遮挡：1440×1024 与 390×844 下窄门与 8 张残页矩形逐对相交检测均为零（门位于独立墙条，不与碎片区交叠）。
- 签退：点击后永久拒绝并持久化 `goddead_watch`，痕迹侧文案正常。
- 本轮临时 QA 副本 `__qa.html` / `__qa.js` 已删除；回归脚本与浏览器 profile 均在工作目录之外，不留仓库残留。

## 复核二（2026-07-20，位图深化，CDP 回归 16/16 通过）

- 独立验收 P2（内联 SVG 桌椅像线框占位、钟面偏简单）已修复：钟面与桌椅换为正式位图，秒针换为去绿幕透明 PNG；内联 SVG 几何（`.wc-*`、`.watch-desk` rect/ellipse）及其 CSS 全部移除，测试套件新增素材存在性 / 引用 / 旧几何清零断言。
- 秒针 PNG 与钟面同 900×900 画布配准，轴心对齐表盘几何中心（`transform-origin: 49.64% 49.4%`）；CDP 间隔读取确认 `rotate(6deg) → rotate(24deg)` 持续转动，倒转/轻响/reduced-motion 逻辑未动（reduced 下无内联旋转、交班簿 5 条文本完整）。
- 去绿幕质量：81 万像素中 79.5 万全透明、3314 半透明软边，不透明像素零绿溢（g 通道优势检查）；合成预览轴毂与钟面螺栓同心。
- 桌椅位图：1440×1700 与 390×1600 加高视口下家具完整、不裁切、无横向溢出；`brightness(0.94)` + 椭圆 mask 羽化，黑边自然融入，整体黑暗感保持。
- 对比度：交班簿底色 0.5→0.68、边框 0.14→0.18、正文字重 300→400、编号/钟注透明度上调，黑暗氛围不变。
- 缓存版本升至 v15；窄门锁定/解锁守卫、键盘 Enter/Space、arrivals=0 文案、签退持久化全部回归通过（证据 `watch-room-desktop-v2.png` / `watch-room-mobile-v2.png`）。

## 复核三（2026-07-20，第四线路 / 余响交换台 + 分层守卫修复，CDP 回归 37/37 通过）

- 分层守卫（P1 修复）：独立验收发现顺序 `if` 守卫可绕过——0 残页直达 `#switchboard` 时 switchboard 分支把目标改写为 watch 发生在 watch 守卫之后，导致未捡残页也能进值夜室。已将守卫集中为 `resolveScene`，按依赖顺序归并（switchboard→watch→corridor），任一前置门槛不满足即落到最终可达场景并归一地址；守卫顺序本身有静态断言。clean-storage CDP 矩阵全过：0 残页 `#switchboard`→corridor/#corridor、0 残页 `#watch`→corridor/#corridor、watch 解锁但 line4 未解锁→watch/#watch、双解锁→switchboard/#switchboard；且 0 残页下值夜室/交换台 `visibility:hidden` 不可见，真实鼠标点击 05:02 与签退位置无任何状态写入（证据 `switchboard-guard-corridor.png`）。
- 解锁守卫：未同时满足「覆盖 05:02 记录（值-叁-0469）+ 至少一次签退尝试」时，接听按钮（`#answer-box`）与目录入口（`#switch-link`）整体 `hidden` 且 `display:none`、不可聚焦；`#switchboard` 直达、hashchange 篡改、synthetic `data-go` 均被硬拦并归一地址。两种顺序（先覆盖后签退 / 先签退后覆盖）均立即、确定性解锁，aria-live 文案「桌下那部不存在的电话，开始第二次响。」；`phoneCovered` 与解锁态均持久化于 `goddead_line4`，跨 reload 保留。
- 接线簿：四个原生 `<button>`；前三条任意顺序可经点击与真实 Enter/Space 接通，`aria-pressed`、原文出树、动态文案（回线壹结合 awake、回线贰 prayers 0/非0 双分支、回线叁 fragments/arrivals/签退驳回）与 `heard` 持久化均验证；第四条出厂真 `disabled` 且有可读原因，前三条听完后原子启用并改名「肆 · 第四线路」。
- 第四线接通：5 行记录逐行显现（reduced-motion 下立即完整），aria-live 只播当前行；重载完整恢复终态且不重复播报（aria-live off）、`connectedAt` 不改写，重听可重放不累加。
- 痕迹页：新增「线 路」卡（未接通 — / 接通 04）与线路记忆文案，stat-grid 两视口自然成立。
- 声音：插头触点、线路底噪、断续远铃全部接入既有 AudioEngine 与全局静音，无音频文件；离场清底噪与定时器。
- 素材：`assets/line-four-switchboard.webp`（1400×846，49KB）经 mask 羽化融入 #050505；交换台场景零 inline SVG；1440×1700 与 390×1600 整室构图完整、主体不裁、无横向溢出。
- 缓存版本升至 v16；既有值夜室/焚献/遗物室解锁含义未动（静态契约测试与锁定守卫回归均覆盖）。

## 复核四（2026-07-20，stale line4 越级修复，CDP 回归 27/27 通过）

- 缺陷：`resolveScene` 只在 `!line4Unlocked()` 时把 switchboard 降级为 watch——`goddead_line4.unlocked=true` 但残页进度为 0 的陈旧状态（localStorage 残留/篡改）下直达 `#switchboard` 可以越级进入交换台。
- 修复：守卫从「依赖判断顺序」改为「每个场景声明自己的全部前置依赖」——进入 switchboard 必须同时满足 `watchUnlocked()`（三张残页）与 `line4Unlocked()`；任一不满足即向依赖链上游归并（switchboard→watch→corridor）并归一地址。入口可见性与路由共用同一组依赖：`syncLine4` 在残页不足时同样不得恢复接听盒与 `02¾ / 第四线路` 目录入口。
- 静态契约：测试套件断言 switchboard 守卫的联合条件 `!(watchUnlocked() && line4Unlocked())`、`syncLine4` 的同款前置、守卫级联顺序与地址归一；缓存版本升至 v17。
- CDP 真实运行矩阵（预置 localStorage 后整页加载 + 真实鼠标/键盘 + reload）27/27：
  - A 组（stale：line4 unlocked/connected=true、签退 1 次、0 残页）：直达 `#switchboard` 与 `#watch` 均落 corridor/#corridor；目录 02¾ 入口与接听盒保持 `hidden` 且 `display:none`；hashchange 篡改与 synthetic `data-go` 点击均被拦（证据 `switchboard-stale-guard.png`）。
  - B 组（0 残页无任何线路状态）：`#watch`、`#switchboard` 直达均落 corridor；窄门/目录入口不可聚焦；reload 后仍锁。
  - C 组（3 残页、线路未解锁）：`#watch` 保留、`#switchboard` 归一为 #watch；真实鼠标点击覆盖 05:02 + 真实 Enter 签退后确定性解锁（仅覆盖未签退时仍锁），接听盒/目录入口原子恢复并播 aria-live 公告；真实点击接听进入交换台；reload 后直达 `#switchboard` 成功。
  - D 组（3 残页 + 双解锁种子）：直达与二次 reload 均保留 switchboard，接通终态完整恢复，痕迹页「线 路 = 04」；随后把残页清零制造 stale 并整页重载，`#switchboard` 跌落 corridor 且 reload 后仍落 corridor。
- 回归脚本与浏览器 profile 均在工作目录之外（/tmp），不留仓库残留。

## 复核五（2026-07-20，无主投递所 / THE DEAD LETTER OFFICE，CDP 回归 35/35 + 旧套件 27/27 通过）

- 场景与资产：新增 `#deadletter`（标题 Goddead — 无主投递所，目录 `02⅞ / 投递所`）。正式位图 `assets/dead-letter-office.webp`（1536×1024，90KB，源 PNG 保留于工作区外，Pillow 转码），mask 羽化融入黑底，桌面中央空白回执在桌面与 390 移动构图均完整可见；场景零 inline SVG（静态断言）。
- 门禁：入口（交换台内语义按钮 + 目录链接）出厂 `hidden` 且 `display:none`、不可聚焦；仅在第四线路真正 `connected` 后原子恢复并播 aria-live「退回的东西，有了去处。」。`resolveScene` 守卫要求完整三元 `watchUnlocked() && line4Unlocked() && getLine4().connected`，级联 deadletter→switchboard→watch→corridor 并归一地址；`syncDeadletter` 与路由共用同一组依赖；`goddead_deadletter` 自身状态（含 stale `accepted=true`）不参与入口与守卫判定——CDP 矩阵：清空→corridor、仅 3 残页→watch、line4 未接通→switchboard、stale accepted + 未接通→switchboard、stale accepted + 0 残页→corridor（证据 `deadletter-locked-guard.png`）。
- 退件登记台：沿用交班簿/接线簿纸档案语言。三封退件为原生 button：真实鼠标与真实 Enter 均可归档，`aria-pressed`、原文出树、动态退回原因（第四次敲击来自门内·收件地址不存在；prayersOffered 0/非0 双分支——0 时「尚未投递，系统已提前分配封套」，N>0「灰烬不是邮资。共 N 份，全部留在原地」；残页转附件、抵达登记、签退申请全部视为续班）与 `goddead_deadletter.returned` 持久化均验证。
- 空白回执：出厂真 `disabled`，可读理由按剩余封数倒数（「还有 N 封退件未归档。」）；三封归档后原子启用并改名「签收空白件」。真实键盘签收后 6 行终局记录按节奏显现（末行「最后收件人：你。」），`accepted`/`acceptedAt` 持久化；reload 完整恢复、不重复播报（aria-live off）、`acceptedAt` 不改写；重读可重放不累加。
- 痕迹页：新增「投 递」卡（未签收 — / 签收 03）与投递记忆（未签收不剧透，签收后「你替一间没有收件人的邮局签收了自己。」），7 卡网格两视口自然成立（证据 `remembrance-deliver.png`）。
- 声音：气送管、印章、打印轻响全部接入既有 AudioEngine 与全局静音（静音持久化验证）；离场清理气送管定时器与记录 timers。reduced-motion：签收后 6 行立即完整，归档态正常恢复。
- 布局：1440 与 390×844 均无横向溢出，位图完整未裁切（宽高比 1.5 断言）；全程控制台无 error/warning/未捕获异常。旧套件（值夜室+第四线路 27/27）同环境重跑通过，既有语义未回退。
- 缓存版本升至 v18；回归脚本与浏览器 profile 均在工作目录之外（/tmp），不留仓库残留。

## 复核六（2026-07-20，神名注销科 / THE DIVINE NAME CANCELLATION，CDP 回归 39/39 + 旧套件 35/35 + 27/27 通过）

- 场景与资产：新增 `#cancellation`（标题 Goddead — 神名注销科，目录 `02⁺ / 注销科`）。正式位图 `assets/divine-name-cancellation.webp`（1536×1024，92KB，源 PNG 保留于工作区外，Pillow 转码），mask 羽化融入黑底，桌面与 390 移动构图均完整可见；场景零 inline SVG（静态断言）。
- 门禁：入口（投递所内语义按钮 + 目录链接）出厂 `hidden` 且 `display:none`、不可聚焦；仅在空白回执真正 `accepted` 后原子恢复并播 aria-live「空白回执生成了一个不该存在的案号。」。`resolveScene` 守卫要求完整四元 `watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted`，级联 cancellation→deadletter→switchboard→watch→corridor 并归一地址；`syncCancel` 与路由共用同一组依赖；`goddead_cancellation` 自身状态（含 stale `solved=true` / `refused=true`）不参与入口与守卫判定——CDP 矩阵：清空→corridor、仅 3 残页→watch、line4 未接通→switchboard、已接通未签收→deadletter 且入口仍 hidden、stale refused + 未接通→switchboard、stale refused + 0 残页→corridor（证据 `cancellation-locked-guard.png`）。
- 检索谜题：原生 form/label/input/submit；错误查询持久计数并递进提示，第三次后停住；鼠标点击 submit 与 Enter 键均可提交；trim + 大写归一后只认 `GODDEAD`；命中后 5 行档案按节奏显现（reduced-motion 立即完整），aria-live 只播当前状态，`solved`/`solvedAt` 持久化。
- 拒绝注销：5 行档案显现后原生 `拒绝注销` 按钮出现；点击后 `refused`/`refusedAt` 持久化， dull stamp 音效，两段驳回文案按节奏显现（reduced-motion 立即完整）。普通动画模式下，若 solve 后 150ms 内在同一 SPA 文档内点击 deadletter 出口离场（`leaveCancel` 清 timers），再点击 #cancel-btn 重进，`enterCancel` 先关闭两个 record 的 aria-live 再调用 `syncCancelScene`，按持久状态完整恢复 5 行档案与拒绝按钮，不重复 aria-live、不改写 solvedAt/refusedAt/queries，且仍可真实拒绝；reload 同样完整恢复、不重复播报（aria-live off）、solvedAt/refusedAt 不改写。
- 痕迹页：新增第八卡「注 销」（未拒绝 — / 拒绝后 驳回）与注销记忆（未拒绝不剧透，拒绝后「系统试图注销你。你把拒绝留在了档案里。」），8 卡网格在桌面 4×2 / 移动 2×4 自然排布（证据 `remembrance-cancellation.png`）。
- 声音：检索走卡轻响与拒绝印章接入既有 AudioEngine 与全局静音（静音持久化验证）；离场清理记录 timers。reduced-motion：检索/拒绝后文本立即完整，叙事信息保留。
- 布局：1440 与 390×844 均无横向溢出，位图完整未裁切（宽高比 1.5 断言）；全程控制台无 error/warning/未捕获异常。坏 JSON 容错验证通过。旧套件（无主投递所 35/35 + 第四线路 27/27）同环境重跑通过，既有语义未回退。
- 缓存版本升至 v19；回归脚本与浏览器 profile 均在工作目录之外（/tmp），不留仓库残留。



## 复核七（2026-07-20，代神席 / THE ACTING DEITY DESK，CDP 回归通过 + 旧套件 39/39 + 35/35 + 27/27 通过）

- 场景与资产：新增 `#acting`（标题 Goddead — 代神席，目录 `02† / 代神席`）。正式位图 `assets/acting-deity-desk.webp`（1536×1024，99KB，源 PNG 保留于工作区外，Pillow 转码），radial mask 羽化融入 #050505，桌面与 390 移动构图均完整可见；场景零 inline SVG（静态断言）。
- 门禁：入口（注销科内语义按钮 + 目录链接）出厂 `hidden` 且 `display:none`、不可聚焦；仅在注销科真正 `refused` 后原子恢复并播 aria-live「你的拒绝被改写成了一份任命。」。`resolveScene` 守卫要求完整五元 `watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted && getCancel().refused`，级联 acting→cancellation→deadletter→switchboard→watch→corridor 并归一地址；`syncActingEntry` 与路由共用同一组依赖；`goddead_acting` 自身状态（含 stale `appointed=true`）不参与入口与守卫判定——CDP 矩阵覆盖清空→corridor、仅 3 残页→watch、line4 未接通→switchboard、已接通未签收→deadletter、已签收未拒绝→cancellation 且入口仍 hidden、stale appointed + 上游缺失逐级回退（证据 `acting-locked-guard.png`）。
- 值守电闸：原生 `input[type="range"]`，label `代神席电闸`，min/max/step 0/100/1，两端文字 `离席`/`在岗`，hint `把在场推到不能再高的位置。`；`output` 同步 `在场：N%`，aria-valuetext 表达当前状态；鼠标、触控、方向键、Home/End 均可驱动。0–33/34–66/67–99 三段反馈跟随区间，不靠错误次数，不死锁。
- 任命：到 100 后 range 锁定，`appointed`/`appointedAt` 持久化，relay lock 音效；五行任命档案按节奏显现（reduced-motion 立即完整），随后终句「你没有成为神。你只是接了祂没有交完的班。」；reload 完整恢复锁定态、五行、终句，不重复 aria-live、不改写 `appointedAt`；未任命时 `value` 也持久恢复并夹在 0–100，坏 JSON 容错通过。
- 同页重进：任命动画中离场（`leaveActing` 清 timers）再重进，`enterActing` 先关 `aria-live` 再 `syncActingScene`，按持久状态恢复，不重复播报、不锁死；真实 data-go 点击用于同页重进，不用整页 `p.load` 冒充 SPA 离场。
- 痕迹页与旧场景联动：任命后 offering 新增联动句「这些祷词现在会先经过你。」（出厂 hidden），remembrance 新增一条记忆「你没有成为神。你只是接了祂没有交完的班。」，不增加第九张统计卡，8 卡网格不变（证据 `remembrance-acting.png`）。
- 声音：机械闸刀摩擦、触点敲击、继电器锁定全部接入既有 AudioEngine 与全局静音（静音持久化验证）；离场清理 timers。reduced-motion：任命后五行与终句立即完整，叙事保留。
- 布局：1440 与 390×844 均无横向溢出，位图完整未裁切（宽高比 1.5 断言）；原生 range 焦点清晰，移动端触控高度足够；全程控制台无 error/warning/未捕获异常。旧套件（神名注销科 39/39 + 无主投递所 35/35 + 第四线路 27/27）同环境重跑通过，既有语义未回退。
- 缓存版本升至 v20；回归脚本与浏览器 profile 均在工作目录之外（/tmp），不留仓库残留。

## 测试

- `node tests/site.test.mjs`：通过（v24）。覆盖场景存在性（11 个 data-scene，含 deadletter、cancellation、acting）、data-go 出口闭合、已删页面（echo / vein / confession）文件缺失且零引用、值夜室入口/状态字段（`goddead_watch`、`fragments >= 3`、签退拒绝文案）、值夜室位图素材契约（文件存在、页面引用、内联 SVG 几何清零、秒针配准轴心）、第四线路契约（接听提示出厂 hidden、路由硬拦、`goddead_line4` 字段、接线簿四按钮与第四条 disabled 理由、5 行接通记录、reduced-motion 立即完整、痕迹页线路卡）、无主投递所契约（素材存在与引用、零内联 SVG、入口提示出厂 hidden、完整三元守卫与级联顺序、`goddead_deadletter` 容错字段、三封退件按钮与回执 disabled→enabled 改名、6 行终局记录、reduced-motion、痕迹页投递卡）、神名注销科契约（素材存在与引用、零内联 SVG、入口提示出厂 hidden、完整四元守卫与级联顺序、`goddead_cancellation` 容错字段、原生 form/label/submit、三句递进提示、答案归一、5 行档案记录、拒绝按钮与 2 行驳回、reduced-motion、痕迹页注销卡与 8 卡网格）、代神席契约（素材存在与引用、零内联 SVG、入口提示出厂 hidden、完整五元守卫与级联顺序、`goddead_acting` 容错字段、原生 range/label/min/max/step/output/aria-valuetext/两端文字/三段反馈、100 任命/五行+终句/锁定、reload 不改 appointedAt、offering 联动、remembrance 联动、8 卡不变、reduced-motion、离场清 timers）、窄门/目录入口 `hidden` 契约与全局 `[hidden]` 保护、哈希路由关键节点、WebAudio-only 与静音字段、缓存 v24、文档同步（README / design-qa / ProgressLog），以及本轮新增的自动转场覆盖：`AutoAdvance` 统一调度器、九段 transition 调度、timer 取消、`initialRouteDone` 不误跳、scrollTop/焦点管理、reduced-motion 延迟、约 1 秒逐行揭示、protocol 规则 keyboard 激活、线性路径无前进/确认按钮、无 `data-go="offering"` 跨幕捷径，**另补边界：会话内消耗标记存在且在 `before` 回调置 true / `sceneInit` 重置、watch `pointerenter` 只做被动揭字不 schedule、主动 click/Enter/Space 才 schedule、cancellation/acting 回退后可恢复调度**；再补短桌面首屏可操作性、统计值防溢出、标题非整框式主题 `focus-visible`。
- CDP 真实运行回归：18/18（首轮）+ 16/16（位图深化轮）+ 37/37（第四线路轮，含分层守卫矩阵）+ 27/27（stale line4 越级修复轮）+ 35/35（无主投递所轮，另同环境重跑 27/27 旧套件）+ 39/39（神名注销科轮，另同环境重跑 35/35 + 27/27 旧套件）+ 代神席轮（旧套件 39/39 + 35/35 + 27/27 同环境重跑）通过（见上各节「复核」明细）。
- 边界：测试套件为 Node 静态断言，不启动 DOM；真实交互以本文件截图证据 + 本地人工验收为准。

## 历史

- 2026-07-19 门厅敲门仪式：通过（见 ProgressLog）。
- 2026-07-19 场景探索化 + 走廊残页与歪斜体系：通过（见 ProgressLog）。
- 2026-07-20 第三值夜室：本报告，桌面 1440 与移动 390 全场景复核。
- 2026-07-20 复核：CDP 真实运行回归 18/18（锁定/解锁守卫、交班簿键盘、arrivals=0 文案、窄门零遮挡）。
- 2026-07-20 位图深化：钟面/桌椅/秒针换正式素材，回归 16/16（见「复核二」）。
- 2026-07-20 第四线路 / 余响交换台 + 分层守卫修复：回归 37/37（见「复核三」）。
- 2026-07-20 stale line4 越级修复：守卫改为依赖声明制，回归 27/27（见「复核四」）。
- 2026-07-20 无主投递所：回归 35/35 + 旧套件 27/27（见「复核五」）。
- 2026-07-20 神名注销科：回归 39/39 + 旧套件 35/35 + 27/27（见「复核六」）。
- 2026-07-20 代神席：回归通过 + 旧套件 39/39 + 35/35 + 27/27（见「复核七」）。
- 2026-07-21 线性自动转场改版：统一 `AutoAdvance` 调度器、九段自动转场、约 1 秒揭示、焦点/滚动管理、导航精简、protocol 键盘激活、`node --check` / `node tests/site.test.mjs` / `git diff --check` 全通过，本地桌面与窄屏完整流程人工走通。

final result: passed
