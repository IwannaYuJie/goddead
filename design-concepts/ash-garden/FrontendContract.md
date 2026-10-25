# 余温温室：v128 开发边界

2026-10-23，Codex 设计；10 月 25 日验收附记：本合同已用于 v128 的真实页面接入，纯规则、运行时、宿主接线及桌面 / 375px 原生试玩通过，详见 [独立验收](../../design-qa-evidence/v128-browser-qa.md)。Gemini 3.8 Flash High 是新增前端及工程说明的唯一实现作者。当前本地已完成，公开发布另记；以下保留冻结的开发约定。

## 本版切片

只新增 `remaining-warmth-garden` 一间房，预期 281 个场景。焚献室、痕迹室及三个余韵落点只加独立小面板，不重画旧房、不删旧入口。存档键冻结为 `goddead_v128_remaining_warmth`，version 128；不写旧章节键。三案、三个去向、固定虚构文案以 Design.md 为准。

新增独立 `warmth-rules.js`、`warmth-garden.js` 和 `warmth-garden.css`，主脚本只接少量生命周期与门禁。原 `directory.js` / ink / light / tea 不改。原画候选 WebP 将原样复制为 `assets/v128-remaining-warmth-garden.webp`，PNG 原件和提示词保留。所有本地样式及脚本最终缓存统一 v128。

## 静态 UI 合同

布局：原画在上方建立房间，下面为平视的九格台面；宽屏可将故事旁注与九格并列，375px 单列。灰黑石材、暗铜边、灰绿嫩芽，冷格用空心标记及「冷」、暖格用实心标记及「暖」，编号始终可读。不在透视原画上覆盖九格。按钮最小 44×44px；正文合理行长；所有 rw 控件有明确 focus-visible；reduced-motion 下无装饰位移。`[hidden]` 始终真正隐藏。

所有新增 ID 唯一，以下约定不得随意改名：

- 新 section：ID `scene-remaining-warmth-garden`，data-scene 必须为 `remaining-warmth-garden`（没有 scene- 前缀），class `scene scene-branch rw-scene`，data-title `Goddead — 余温温室`，aria-label 余温温室。内容容器同时含 `.scene-body` 与 `.rw-body`。
- 标题 `rw-title`（h2、class 同时含 sec-title / rw-title、tabindex -1）；原画 `rw-room-image`（data-src 生产 WebP 路径，width 1536 / height 1024，lazy / async，描述性 alt）。开场 `rw-intro`；等待 `rw-waiting`（初始 hidden，status）。
- 空台 `rw-empty`：只读上一盆 `rw-last-plant`、按钮 `rw-new-pot-btn`（「照看一盆新芽」）。进入温室不自动开始谜题；有活动盆时隐藏此块，已有上一盆可只看不重开。
- 操作区 `rw-workbench`（初始 hidden）：案例 `rw-case`、虚构愿望 `rw-wish`、规则说明 `rw-instructions`，`rw-grid` 使用 role group 而非不完整 ARIA grid，aria-describedby 指向说明。九个原生 type=button，ID `rw-cell-0` 至 `rw-cell-8`，data-rw-cell 值 0 至 8，每格内部有 data-rw-number / data-rw-state / data-rw-mark 三个 span。编号 1–9，运行时更新 aria-label 为行列 / 冷热 / 影响格编号。格子使用 aria-pressed 表达暖态，class `is-warm` / `is-preview` / `is-hint` 用于视觉。
- `rw-progress` 显示暖格数与近期操作；`rw-preview` 只读预览、aria-live=off；`rw-feedback` role=status、aria-live=polite、aria-atomic=true，避免聚焦每格都播报大量区域。
- 操作按钮 `rw-hint-btn`（听一片叶子的提示）、`rw-undo-btn`（退回上一步）、`rw-reset-btn`（让余温回到最初）、`rw-hold-btn`（把这盆小芽提起来）、`rw-lower-btn`（放回灰床，初始 hidden）。提示只指明下一格，不自动操作或改变存档。提盆 / 放回本身不结算。
- `rw-placement`（初始 hidden）含 `rw-place-window`（放在面向门外的窗台）、`rw-place-drawer`（放回原来的灰烬抽屉）、`rw-place-chair`（放在空椅脚边）。不使用画面热点作为唯一提示。
- 小记 `rw-collected-window` / `rw-collected-drawer` / `rw-collected-chair`，初始「尚未留下」，已知则显示固定余韵；`rw-collection-note` 明说一盆即完成，其余可选。
- 新房出口普通 `href="#offering"` / `href="#remembrance"`，保留浏览器与原路由入口，不用内联脚本。
- 焚献室小面板 `rw-offering-panel`（初始 hidden）：标题「灰里有一片叶子」、`rw-offering-status`、原生按钮 `rw-enter-btn`（打开温室的侧门）、`rw-offering-response` role=status。放旧离开焚献 nav 前，炉 role=img 外。
- 痕迹室小面板 `rw-entry-panel`（初始 hidden）：标题、`rw-entry-note`、按钮 `rw-entry-btn`（回到旧焚献室）、`rw-resume-entry-btn`（继续照看温室的小芽，初始 hidden）。`rw-entry-response` role=status；`div#rw-codex.codex-section` 内有普通 h3 标题、`rw-codex-summary` 及 `rw-codex-window` / `rw-codex-drawer` / `rw-codex-chair`，不自带 details / summary / 折叠按钮，复用旧图鉴折叠器。放旧 v121 面板之后，不影响原八张统计卡。
- 三个落点的小面板：`rw-echo-window` / `rw-echo-drawer` / `rw-echo-chair`（初始 hidden，各自位于 threshold / offering / unending-gallery）。标题 ID 为相同名称加 `-title`，tabindex -1；分别显示 Design.md 的余韵和余韵正文，普通返回温室链接。只有对应结果已收集且完整资格仍成立才显示，抵达聚焦只发生一次。
- 静态目录项 `remaining-warmth-garden-link`，href="#remaining-warmth-garden"，初始 hidden，文字「32δ / 余温温室」，放清晨验名桌相邻。真实访问后才显示。

UI 作者先交完整独立片段文件（scene / offering / remembrance / 三落点 / directory）与完整 CSS，不动巨大的旧 index.html；根代理将完整片段原样插入经核对的唯一锚点，不手写补齐生产标记。

## 独立章节状态

顶层恰七字段：`version`、`visited`、`outcomes`、`plantCount`、`lastPlant`、`draft`、`pending`。默认 version128 / false / [] / 0 / null / null / null。普通读取不因临时忙碌或资格暂失而清档，也不自动写入空档。

- visited 是布尔值，只在合法 enter 抵达温室时设置 true；不能仅因深链就授予到访。
- outcomes 为去重白名单 window / drawer / chair；规范顺序固定 window,drawer,chair。plantCount 是 0–9999 整数，完成时加一并封顶，不能小于 outcomes 长度。
- lastPlant 为 null 或恰 `{placement,capturedRuling}` 的只读记录，placement 必须在 outcomes 中、capturedRuling 为 A/B/null；count=0 时 outcomes 空且 lastPlant=null，count>0 时 outcomes 非空且 lastPlant 合法。无可再次提交的历史草稿。
- draft 仅接受纯规则 normalizeDraft 的恰四字段格式。坏 draft 丢弃，任何依赖它的 place pending 同时丢弃；不能读取 board/solved 等信任缓存。
- enter pending 恰 `{kind:'enter',source:'offering',target:'remaining-warmth-garden'}`。既可首次进入，也可恢复或只看上一盆；不在入口偷偷创建新盆。
- place pending 恰 `{kind:'place',source:'remaining-warmth-garden',target,placement,capturedRuling}`。target 严格由 placement 推导；必须 visited、draft 非 null、holding=true、boardOf=511，且 capturedRuling 严格等于 draft。本章不存任意路由或可执行反馈文案。
- 坏顶层基础字段或互相矛盾的结果记录回到本章默认；坏 pending 只取消 pending、保留合法 draft 和历史。未知顶层字段拒绝；规范函数不执行 getter 或强制转换。只处理本章 JSON 数据，不试图声称反作弊。

成功放置抵达一次写入 outcomes / count / lastPlant，清空 draft 与 pending；来源刷新重播、目标刷新不重复写。第三场景只清 pending，保留本盆。到温室后无盆时仅显示空台，新盆操作才读取规范旧裁决；正在照看时重新开始保留本案。

## 运行时边界

独立冻结 namespace `GoddeadWarmthGarden.create(config)`，不覆写任何既有 global。纯规则由 config 传入 `GoddeadWarmthRules.create()` 的结果。config 提供实际旧工程的 currentScene、完整资格、上游忙碌、规范焚献裁决、AutoAdvance、goScene、存取、可用按钮、聚焦安排及旧控件复算等适配，不把私密祷词传给模块。

公开实例提供只读 getter / canVisit / bridgeAllows、sync、onScene（抵达-取消-同步-重播）、focusArrival、forget、progressStep 以及事件绑定所需初始化。具体签名以源码接入审查后冻结的 adapter 合同为准。UI mutation 通过原生 trusted 事件，所有业务动作再查当前场景 / 完整资格 / 忙态 / pending / AutoAdvance 首锁 / 控件可用；合成 click 不写入。

接入审查后冻结 config 为 `document, rules, readRaw, writeRaw, removeOwn, currentScene, unlocked, upstreamBusy, captureRuling, buttonAvailable, hasAdvance, schedule, clearAdvance, navigate, setArrivalFocus, transitionBusy, reduced`。readRaw / writeRaw / removeOwn 已绑定本章单键；schedule 参数为 source,target,delay,onFire，适配为原 AutoAdvance options.delay / before，onFire 仅用于释放本章计时归属。navigate 调原 goScene；setArrivalFocus 只安排原 pendingSceneFocus，不直接 focus。公开实例恰九方法 `getState, unlocked, canVisit, bridgeAllows, onScene, sync, focusArrival, forget, progressStep`。工厂一次绑定事件，sync 不创建记录、不结算、不导航。

当旧链忙碌时禁用操作和新排程，原 draft / pending 保留；忙态不是清档理由。若实际到达第三场景，原有离路取消规则仍成立。临时忙态下不结算放置；待旧事务完成后再恢复。合法 pending 只能由本章真实动作生成，目标 route guard 先验证才放行。

焚献首锁、旧正文不改、隐私、画廊窄桥、生命周期和旧回归边界继续以 IntegrationNotes.md 为准。聚焦标题通过原 `pendingSceneFocus` 路径，不在目录打开时抢焦点。忘记只移除本章键并清本章拥有的计时器，不能取消其他章节占用的来源计时。

旧控件局部锁采用本章自有 inert / aria-disabled / data-rw-locked 标记及 capture 事件闸门，不写旧控件原生 disabled。仅对原设计列出的五个控件生效；进入锁时保存标记原值，退出只释放本章添加的标记，保留此前已有 inert/aria。原生 disabled 从始至终不碰，旧控件本来或期间由其他来源禁用也不能被新章误开。新增 CSS 仅针对 `[data-rw-locked]` 标示临时停用。这是源码审查后的收窄方案，不要求改旧 handler。

## 验收到发布

纯规则全套通过；独立状态机 / 严格 pending / 只写本章键 / 64 步恢复 / 原字节审查；旧全站与测试回归；单 QA 标签原生三案三落点、刷新 / 双击 / 等待 / 首锁 / 离路 / 焦点；桌面和 375px 可读且可操作。新标题与持盆只读回访也实走。随后才由 Gemini 更新工程文档、提交推送，核对远端 SHA / Pages / 公开资产和浏览器冷载。未实测项不得写成通过。
