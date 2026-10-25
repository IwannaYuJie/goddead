# 春信前端接入合同

2026-10-25，Codex 依据 v128 实际源码整理；未实施或未实测内容不作为已完成证明。玩法、文案、图数据与十个纯 API 以 [Design.md](Design.md) 为准。

## UI 交付

Gemini 返回完整 `spring-letter.css` 及完整 `.v129-gemini/ui-fragments.json`。JSON 恰七个字符串字段 `scene,deadletterEntry,remembrance,echoTomorrow,echoStranger,echoUnsent,directory`。根代理仅原样插入，不能补写生产片段。原画实际尺寸 1536×1024。

- scene：`section#scene-unaddressed-spring-letter.scene.scene-branch.sl-scene`，`data-scene="unaddressed-spring-letter"`，标题 Goddead — 没有地址的春信，aria-label 没有地址的春信。子容器 `.scene-body.sl-body`；h2 `sl-title.sec-title`，tabindex=-1。`sl-room-image` 使用 data-src=`assets/v129-unaddressed-spring-letter.webp`，width=1536 / height=1024、lazy / async、描述性 alt，无 src 空串。开场 `sl-intro`。
- `sl-waiting` 初始 hidden、role=status；`sl-empty` 默认可见，`sl-last-letter` 默认「还没有寄出春信」。来信按钮 `sl-take-window` / `sl-take-drawer` / `sl-take-chair`，每项配 `sl-source-window-note` / drawer / chair，完整来信标题取 Design。原生 type=button，每个选择至少44px。不能整页套 role=img。
- `sl-workbench` 初始 hidden，内含 h3 `sl-letter-name`、blockquote `sl-letter-text`，`sl-instructions`：从起笔沿相连墨线逐点走到信口，每条线恰走一次，墨点可重复经过。
- `sl-board` 是 role=group、aria-label=一笔信路、aria-describedby=sl-instructions 的四列三行相对容器，固定 aspect-ratio=4/3，max-width=480px。SVG `sl-map` viewBox="0 0 400 300"、preserveAspectRatio=none、aria-hidden=true、pointer-events=none，唯一空 g `sl-edges`。线路坐标固定为各格中心 (50+100×col,50+100×row)。十二原生按钮 `sl-node-0`…`sl-node-11`，data-sl-node=0…11，各含 data-sl-number（静态1…12）与 data-sl-mark span（初始空）；按钮中心与 SVG 墨点严格对齐，尺寸至少48px。SVG 由运行时按图数据创建 line，class `sl-line`、已走 `.is-used`；不要画假图、装饰连接或随机线。
- 三种按钮状态 `.is-current` / `.is-available` / `.is-hint`，起点 `.is-start`、终点 `.is-end`；当前点用环与「笔」标识，起点「起」、终点「终」，优先笔。去重等信息不靠 aria-pressed 伪装成 toggle。
- `sl-route-progress`、`sl-route-history`、`sl-route-available` 三段文字，状态 `sl-feedback` role=status aria-live=polite aria-atomic=true。避免给整个棋盘 aria-live。
- 操作 `sl-hint`（借一阵风指路）、`sl-undo`（退回上一个墨点）、`sl-reset`（从起笔重新描）、`sl-seal`（把信封好）、`sl-unseal`（拆开继续描，初始 hidden）。`sl-recipients` 初始 hidden，三个按钮 `sl-send-tomorrow` / `sl-send-stranger` / `sl-send-unsent`，文案与意义按 Design。不能自动选择去向。
- `sl-collection-summary` 与 `sl-collection-note`，明确一封即可完成，其他来信 / 寄法可选。出口普通 href="#deadletter" / "#remaining-warmth-garden" / "#remembrance"。
- deadletterEntry：`sl-post-panel` 初始 hidden，h3「格柜里有一封春信」，`sl-post-note`、`sl-enter` 按钮「去侧桌摊开这封信」、`sl-post-response` role=status。放在旧投递所离开导航之前，原 figure 与旧退件登记台之外。
- remembrance：`sl-entry-panel` 初始 hidden，标题「没有地址的春信」，`sl-entry-note`，`sl-entry`「回到无主投递所」、`sl-resume`「继续手中的春信」（初始 hidden）、`sl-entry-response` status。再加 `div#sl-codex.codex-section`、普通h3、`sl-codex-summary`，九个 p `sl-codex-{letter}-{recipient}`，letter顺序window/drawer/chair，recipient顺序tomorrow/stranger/unsent。每项初始文案「尚未留下这份回响」。不新增 details/summary，复用旧图鉴折叠器。
- echoTomorrow / echoStranger / echoUnsent：分别在 threshold / deadletter / remembrance。面板 ID `sl-echo-{recipient}` 初始 hidden，h3 ID `sl-echo-{recipient}-title`、tabindex=-1、Design三结局标题；三个 p ID `sl-echo-{recipient}-{letter}` 初始 hidden，含九份固定文案；普通返回 href="#unaddressed-spring-letter"。所有已收集回响可见，不用上一封覆盖历史。实际送达的本次结果聚焦所属结局标题一次。
- directory：`a#unaddressed-spring-letter-link.dir-item` href="#unaddressed-spring-letter" data-hover hidden，文案「32ε / 没有地址的春信」。

CSS 仅 sl 前缀和三个明确新场景/目录选择器，不改共享 `.scene`、`.sec-title` 等。继承现有字体；颜色显式提供纸面 / 墨字 / disabled / focus 对比。所有 `[hidden]` 真隐藏，375px 无横溢；全按钮44px以上，墨点48px以上。四个标题 scroll-margin-top 使用 `clamp(112px,16vh,140px)`。有 reduced-motion 规则。桌面两栏、窄屏一栏，原画始终在台面上方。

## 运行时工厂

独立 `GoddeadSpringLetter.create(config)`，已存在同名命名空间时不覆盖；冻结命名空间及八方法实例：`getState,unlocked,canVisit,onScene,sync,focusArrival,forget,progressStep`。

config 恰需 `document,rules,readRaw,writeRaw,removeOwn,currentScene,unlocked,upstreamBusy,availableLetters,buttonAvailable,hasAdvance,schedule,clearAdvance,navigate,setArrivalFocus,transitionBusy,reduced`。与 v128 相同调度形态：schedule(source,target,delay,onFire) 映射 AutoAdvance `{delay,before:onFire}`；onFire 只释放本章计时器归属，目标由宿主实际 goScene 实现。源 replay 不能抢其他来源的 AutoAdvance。

readRaw/writeRaw/removeOwn 只绑定 `goddead_v129_spring_letter`：readRaw() 返回原始 JSON 字符串或 null，writeRaw(raw) 只接受 JSON 字符串，运行时自己 parse/stringify 并捕获读取异常。availableLetters 返回规范温室 outcomes 新副本。unlocked 只代表完整永久前置；upstreamBusy 独立控制暂停，不当做永久门禁。transitionBusy() 返回宿主 veilBusy 布尔值；reduced 本身是布尔值，不是函数。hasAdvance(scene) / clearAdvance(scene) 都要求实际来源字符串；setArrivalFocus(el) 要求 DOM 元素，不是 ID。

buttonAvailable(id) 会读取按钮当下 disabled / hidden / 隐藏祖先，因此只在真实事件发生时作最后一道校验，不能把它用作 sync 设置 disabled 的输入（否则一次禁用会自锁）。sync 按业务状态和场景重新计算 disabled，也不能用过渡 veilBusy 锁住按钮：真实抵达的 sync 发生在 veilBusy=true 期间，遮罩结束后宿主不额外 sync。真实事件仍须检查 transitionBusy。

生命周期职责与 v128 一致：sync 只绘制和临时锁；onScene(name) 仅实际场景抵达使用，按目标记账、第三场景取消、同步、合法来源回放；focusArrival(name) 通过 setArrivalFocus 一次排标题，不直接 focus；forget 清本章键、只取消自己拥有的调度、解除自己的旧按钮锁并清临时提示。

getState 返回规范新副本，不持久化修正。状态字段 shape、九结果、count关系按 Design；visited=false 时结果/count/draft 必须为空，但合法 enter pending 可存在。顶层和 nested record 都拒绝多字段 / accessor / symbol / 不合法原型，数组也拒绝洞、扩展字段与特殊原型。JSON解析失败返回默认，读状态不自动写默认。

业务写入先以 trusted event 检查 currentScene、config.buttonAvailable、完整资格、非忙、非 veil、无 pending、无来源 AutoAdvance。取信还检查空台、visited 与 availableLetters 白名单；提示只读；封好只改变 sealed；投递选择创建合法 pending 并排源→目标。进入新房写 visited 后保持空台。草稿存在时继续显示原 letter，availableLetters 变化不重选。所有非法动作保持 raw 完全不变。

remembrance 的 sl-entry 只 navigate('deadletter')；sl-resume 只前往当前 pending.source 或 visited 且有 draft 的新房，不自动完成事务。pending 可用 resume 回源，但入口/继续仍查完整资格、忙态、过渡与来源调度；继续不因本章合法 pending 本身被误禁用。

旧按钮首锁覆盖 `#scene-deadletter button` 中 ID 不以 `sl-` 开头且没有 data-go 属性的业务按钮，且仅新 enter pending、来源实际 deadletter 时有效。保存原 inert/aria-disabled/data-sl-locked，自己设置 inert/aria-disabled=true/data-sl-locked。释放只恢复自己记录的标记，不触碰 native disabled。capture click / keydown 闸门采用相同筛选；普通 a 出口与原 `button[data-go]` 导航按钮均可改道。实际旧「回到交换台」为 data-go 按钮，不能把它当作写存档动作锁住。冷载 sync 可恢复锁但不得提前取消 pending 或结算。

progressStep 返回宿主既有 `{title,items,target,done}` 形态。targets 仅 `sl` / `sl-resume`：未取信或已完成且无活动用 sl，pending / 活动用 sl-resume；忙态提示先完成温室，target 用既有 rw-resume；完成一封 done=true，写明其他可选，不能要求九份全部收集。

## 宿主接线边界

稍后以完整 JSON 字符串片段交给根代理原样插入，避免重写七万行 script.js 或全站 HTML。只改：新增两个阻塞脚本与一 CSS、统一缓存版本 v129；新 HTML 七片段；sceneInit 中 warmthGarden.onScene(name) 后接本章；新房resolve守卫；focusArrival；forget；适配工厂；outstanding只读行；清晨指引完成温室后分流；两个新指引 target 映射；冷启动 sync。

不会增加任何旧场景路由桥。threshold / remembrance 原来可去，deadletter 在完整本章资格下已满足原主线门禁。原 warm/ink/light/tea/directory 文件保持。原索引入口和主流程正文保持字节相同，新增段以明确注释包住。
