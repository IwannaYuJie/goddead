# Design QA — Living Shrine · 场景探索版（含第三值夜室）

适用范围：当前 goddead.com 首页（哈希路由场景探索游戏）。本文替代旧 Split Testament 版 QA 报告；旧版证据文件保留在 `design-qa-evidence/` 中仅作历史存档，不再代表现状。

## 视口与方法

- 桌面：1440 × 1024（值夜室全要素图使用 1440 × 1700 加高视口以容纳整室）
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

## 测试

- `node tests/site.test.mjs`：通过。覆盖场景存在性（7 个 data-scene）、data-go 出口闭合、已删页面（echo / vein / confession）文件缺失且零引用、值夜室入口/状态字段（`goddead_watch`、`fragments >= 3`、签退拒绝文案）、值夜室位图素材契约（文件存在、页面引用、内联 SVG 几何清零、秒针配准轴心）、窄门/目录入口 `hidden` 契约与全局 `[hidden]` 保护、哈希路由关键节点、WebAudio-only 与静音字段、文档同步（README / design-qa / ProgressLog）。
- CDP 真实运行回归：18/18（首轮）+ 16/16（位图深化轮）通过（见上两节「复核」明细）。
- 边界：测试套件为 Node 静态断言，不启动 DOM；真实交互以本文件截图证据 + 本地人工验收为准。

## 历史

- 2026-07-19 门厅敲门仪式：通过（见 ProgressLog）。
- 2026-07-19 场景探索化 + 走廊残页与歪斜体系：通过（见 ProgressLog）。
- 2026-07-20 第三值夜室：本报告，桌面 1440 与移动 390 全场景复核。
- 2026-07-20 复核：CDP 真实运行回归 18/18（锁定/解锁守卫、交班簿键盘、arrivals=0 文案、窄门零遮挡）。
- 2026-07-20 位图深化：钟面/桌椅/秒针换正式素材，回归 16/16（见「复核二」）。

final result: passed
