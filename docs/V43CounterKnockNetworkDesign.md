# Goddead v43 设计：门内回敲网 / THE COUNTER-KNOCK NETWORK

## 目标

v43 回到玩家打开网页后的第一分钟，不继续往 v42 后面接长链。

- 保留首页现在已经可见的门、日蚀、符号、回来、代审、左廊、右廊，不再塞一个常驻入口。
- 第一次正常敲门后，门板内部出现三处短暂回敲：左扇、门缝、右扇。
- 玩家可以继续敲第二、第三次走原主线，也可以直接点任一回敲，立刻进入三个新区域之一。
- 三个新区域彼此互通，并接回 v31、v38、v40 的既有前段网络。
- 所有动作都是「点击 / Enter / Space → 立即反馈 → 自动转场」；没有确认页、下一步、继续按钮、滚到底按钮或新结局。
- 新内容只扩充选择，不改变主线完成条件、v31–v42 的状态语义或既有落点。

## 设计理由

当前首页已有很多可发现的常驻热点，再加一个永久标签会挤占门的主体。回敲只在玩家主动敲过一次门后出现：

1. 它把原本固定的「敲三次」变成一个会响应玩家的短窗口。
2. 玩家已经表达了进入意图，支线提示此时出现不会像首页常驻菜单。
3. 不熟悉支线的玩家仍可自然完成第二、第三次敲门；熟悉玩家能在第一分钟改道。
4. 三个回敲都覆盖门上真实器件，不做悬浮卡片或底部按钮列。

## 首页回敲窗口

### 触发

- `#threshold` 正常门按钮第一次被接受后，`knocks === 1` 时显示三处回敲热点。
- 第二次正常敲门后热点仍显示，反馈文案变得更急促，但目的地不变。
- 第三次正常敲门一旦被接受，三处回敲立即隐藏并失去焦点，继续使用既有开门图和自动进入 `#protocol` 的流程。
- 任一 v43 回敲被接受后，立即写 visited、进入 threshold 既有首选锁、隐藏全部三处回敲，并在短反馈拍后自动转场。
- 干净存档进入首页时三处回敲出厂 `hidden`，不会增加初始视觉噪音。
- 从其他场景回到首页时，沿用现有 session knocks 语义；若当前会话仍是 1 或 2 次敲门且没有 transition / `thresholdConsumed`，应恢复回敲窗口。

### 三处画面内热点

三处热点放在现有门图内部，不替换、重编码或裁切现有 closed/open door 素材。

1. 左扇回敲
   - ID：`hotspot-counter-knock-left`
   - 短标签：`左响`
   - aria-label：`回应门左扇内部先一步响起的回敲`
   - 覆盖：左门扇的竖向黄铜把手与其上方门板。
   - 反馈：`左扇门板从里面先敲了一次。那声回敲把门后的一整条廊道震亮。`
   - 自动去：`#counter-knock-gallery`
   - entry：`threshold-left`

2. 门缝回敲
   - ID：`hotspot-counter-knock-seam`
   - 短标签：`缝响`
   - aria-label：`贴近门缝，追踪没有被应答的第二声回敲`
   - 覆盖：两扇门中央暗红竖缝，避开 v38 代审热点。
   - 反馈：`第二声没有来自门后。它被门缝收走，登记成一次从未发生的来访。`
   - 自动去：`#unanswered-vestibule`
   - entry：`threshold-seam`

3. 右扇回敲
   - ID：`hotspot-counter-knock-right`
   - 短标签：`右响`
   - aria-label：`回应门右扇下沉到门槛下面的回敲`
   - 覆盖：右门扇竖向黄铜把手与其下方门板。
   - 反馈：`右扇没有振动。回敲沿把手向下滑，落进门槛下面的投递轨。`
   - 自动去：`#undersill-dispatch`
   - entry：`threshold-right`

### 视觉与竞争规则

- 回敲热点默认只有极淡黄铜轮廓和短标签；第一次敲门后用一次克制的暗红脉冲显露，不闪烁。
- 三处均使用原生 button，桌面和移动触达至少 44×44。
- Tab 顺序：左响 → 缝响 → 右响；若第三次敲门开始开门，焦点安全回到门按钮或待进入场景标题。
- 三处回敲与现有三敲、v31 三热点、v38 代审、v40 左右廊共享同一个 threshold 首选锁。第一项被接受后，本拍其余输入不得写任何状态或排 timer。
- v43 handler 在读取状态、写反馈、播放声音或排 timer 前，必须先确认 `currentScene === "threshold"`、回敲当前可见且 `knocks` 为 1 或 2。
- 不得让回敲热点盖住门按钮的主要敲击区域；门板空白区域仍可继续完成第二、第三次敲门。
- reduced-motion 缩短显露与反馈拍，但不跳过文案。

## 新场景与素材

共同要求：

- 三张监理源图均为 1536×1024 RGB PNG，已放在 `design-references/`。
- Kimi 转为 q85 WebP，建议单张不超过 220 KB；保留源 PNG。
- 沿用 v40 / v41 的黑石、旧黄铜、暗红灯和画面内热点语言。
- 主体必须适配桌面 1440×1024、短桌面 1440×800 和移动 390×844 中心裁切。
- 不在图片或页面中添加伪造文字、SVG 图示、卡片选择器或现代设备。

### 1. 回敲廊 / THE COUNTER-KNOCK GALLERY

- Hash：`#counter-knock-gallery`
- 源图：`design-references/source-counter-knock-gallery.png`
- 正式图：`assets/counter-knock-gallery.webp`
- 画面：黑石长廊两侧挂满方向错误的黄铜门环；中央独立门环的影子比实体更早击中墙面。
- 说明：`这里保存每一声从门内发出的敲门。门外的人通常误以为那是回声。`

三个画面内热点：

1. `敲响中央向内的门环`
   - ID：`counter-knock-action-inward`
   - 反馈：`门环向墙里落下。倒置窥孔从另一面替你睁开。`
   - 自动去：`#peephole-chamber`
   - mark：`struckInwardKnocker`

2. `按住被黑蜡封死的门环`
   - ID：`counter-knock-action-still`
   - 反馈：`门环没有动。未应门前厅却替它登记了第二声。`
   - 自动去：`#unanswered-vestibule`
   - mark：`heldStillKnocker`

3. `追上先于金属落下的影子`
   - ID：`counter-knock-action-shadow`
   - 反馈：`影子钻进门槛。投递轨把你的脚步当成一封未封口的信。`
   - 自动去：`#undersill-dispatch`
   - mark：`followedEarlyShadow`

### 2. 未应门前厅 / THE UNANSWERED VESTIBULE

- Hash：`#unanswered-vestibule`
- 源图：`design-references/source-unanswered-vestibule.png`
- 正式图：`assets/unanswered-vestibule.webp`
- 画面：三面封死的门形石板前立着三只黄铜撞击鼓；左鼓留有新凹痕，中鼓无人触碰仍在震动，右鼓的第三次撞痕被刮走。
- 说明：`没有被回应的敲门不会消失。它们只是改在这里排队。`

三个画面内热点：

1. `登记左鼓上的第一道凹痕`
   - ID：`unanswered-action-first`
   - 反馈：`第一声获得编号。访客守则承认你已经来过一次。`
   - 自动去：`#protocol`
   - mark：`registeredFirstKnock`

2. `听完仍在震动的第二声`
   - ID：`unanswered-action-second`
   - 反馈：`第二声找到了原来的门环。回敲廊重新向你打开。`
   - 自动去：`#counter-knock-gallery`
   - mark：`heardSecondKnock`

3. `抹掉右鼓残留的第三声`
   - ID：`unanswered-action-third`
   - 反馈：`第三声被撤销。回返夹道替你保存了一条没有开门的路线。`
   - 自动去：`#return-passage`
   - mark：`erasedThirdKnock`

### 3. 门槛下投递处 / THE UNDER-SILL DISPATCH

- Hash：`#undersill-dispatch`
- 源图：`design-references/source-undersill-dispatch.png`
- 正式图：`assets/undersill-dispatch.webp`
- 画面：门槛下方的黑石投递室，顶部只有一线门缝冷光；左轨送来黑蜡封件，中轨把空白纸条送回光里，右轨向上折进铰链形竖井。
- 说明：`门缝太窄，不能让人通过。这里因此只接收被门拒绝的部分。`

三个画面内热点：

1. `收下左轨的黑蜡封件`
   - ID：`undersill-action-seal`
   - 反馈：`封件没有名字，代审窗仍把它当成一位夜访者。`
   - 自动去：`#proxy-admission`
   - mark：`acceptedBlackSeal`

2. `把空白纸条推回门外`
   - ID：`undersill-action-blank`
   - 反馈：`纸条从门缝出去时，多带走了一个编号。失号龛替它留出空位。`
   - 自动去：`#glyph-niche`
   - mark：`returnedBlankSlip`

3. `沿右轨爬进铰链竖井`
   - ID：`undersill-action-hinge`
   - 反馈：`投递轨向上翻成门轴。铰链分拣室开始决定你应该向哪边打开。`
   - 自动去：`#hinge-sorting-room`
   - mark：`climbedHingeRail`

## 路由与守卫

- 三个 v43 新场景不设解锁门槛，允许干净存档 direct hash；直达只记录真实到访，不伪造 threshold 回敲。
- `#peephole-chamber`、`#return-passage`、`#glyph-niche` 继续使用 v31 守卫；只为当前 v43 `lastAction` 对应落点增加窄例外，不能放宽其他未访问直达。
- `#hinge-sorting-room` 继续使用 v40 守卫；只允许 `climbedHingeRail` 对应的窄例外。
- `#proxy-admission` 与 `#protocol` 沿用现有可进入语义，不启动或改写它们未要求的 cycle 数据。
- 离开任一新场景时清 timer；若合法 pending 尚未完成，重返原场景应逐字重播反馈并只完成一次转场。
- 任一隐藏 DOM 按钮被程序化 click 时不得写状态、反馈或 timer。

## 状态契约

独立 key：

`goddead_v43_counter_knock`

建议字段：

```json
{
  "visited": {
    "gallery": false,
    "vestibule": false,
    "dispatch": false
  },
  "entry": "direct",
  "lastScene": "",
  "lastAction": "",
  "traversals": 0,
  "marks": [],
  "pending": null
}
```

白名单：

- entry：`threshold-left / threshold-seam / threshold-right / gallery / vestibule / dispatch / direct`
- scene：`gallery / vestibule / dispatch`
- action：
  - gallery：`inward / still / shadow`
  - vestibule：`first / second / third`
  - dispatch：`seal / blank / hinge`
- marks：本设计列出的 9 个 mark
- pending：`{ scene, action, target, feedback }`，四字段必须与动作表逐字段匹配。

修复规则：

- visited 只接受三个已知布尔键。
- entry / lastScene / lastAction 只接受白名单，scene 与 action 必须匹配。
- traversals 必须为有限、非负、向下取整的整数并封顶 9999。
- marks 白名单过滤、去重。
- pending 任一字段缺失、target / feedback 与合法表错配、scene / action 不匹配即清空。
- 坏 JSON、数组错型、伪造 target、伪造 feedback、Infinity、负数安全归一。
- handler 先验证 live scene 与元素可见性，再读取或写入任何 v43 状态。
- v43 不读取或写入 v28–v42 与旧主线 key；兼容性测试按字节快照比较。

## 目录、痕迹与遗忘

首次真实进入后恢复：

- `02γ / 回敲廊` → `#counter-knock-gallery`
- `02δ / 未应门` → `#unanswered-vestibule`
- `02ε / 门槛下` → `#undersill-dispatch`

Remembrance 只增加一行，不增加统计卡：

`门内回敲：改道 N 次；回敲 / 未应 / 门槛下已见 X/3。`

遗忘全部痕迹时：

- 删除 `goddead_v43_counter_knock`
- 隐藏三个目录入口与记忆行
- 清除 v43 timer 与回敲热点显露态
- 保持既有八张统计卡

## Kimi 实现边界

Kimi 负责：

- 三张 PNG 转 WebP。
- 全部 HTML / CSS / JavaScript、静态测试、浏览器 Smoke、视觉 QA 与项目文档。
- 只修改实现 v43 必需的文件；不执行 git add / commit / push / stash。

Codex 负责：

- 本设计、三张源素材和独立验收。
- 不替 Kimi 编写生产代码。

必须保留：

- v32 当前 staged 边界原样，不重排 staged / unstaged。
- `docs/KimiUsageLog.md` 不修改。
- `stash@{0}` 不动。
- 既有 v31–v42 反馈、路由、素材与状态语义。

## QA 契约

Kimi 新建 v43 Smoke / visual，至少覆盖：

1. 干净首页三处回敲出厂 hidden；第一次敲门后同时可见、可 Tab、可 Enter/Space，第二次仍在，第三次立即隐藏且原开门流程不退化。
2. 回敲窗口刷新恢复、回首页恢复、第三敲或其他 threshold 入口赢得首选锁时不误写 v43。
3. 三处回敲逐字反馈与三个正确目的地；与门、v31、v38、v40 同节拍竞争只接受第一项。
4. 三个新场景、三张源 PNG、三张 WebP 存在、引用、解码。
5. 九个画面内热点逐字反馈、真实自动目的地、无底部卡片选择、无继续按钮。
6. 三个新场景之间形成回路，并真实落入 protocol、peephole、return passage、glyph niche、proxy admission、hinge sorting。
7. v31 / v40 只放行当前 v43 action 的窄例外；未访问 direct hash 仍按原守卫回退。
8. live scene 前置守卫；隐藏按钮 synthetic click 零副作用。
9. 同节拍鼠标 / Enter / Space 竞争只执行第一项；所有 action 只计一次。
10. pending 四字段严格修复；反馈拍刷新重播且不重计；离场无幽灵回跳。
11. 坏 JSON、错型 visited / marks、伪造 target / feedback、非法数值归一。
12. v28–v42 与主线状态字节级隔离。
13. 目录 02γ / 02δ / 02ε、Remembrance 单行、仍 8 卡、遗忘清除。
14. 1440×1024、1440×800、390×844 首页回敲窗口与三场景首屏；热点落在真实器物；触达 ≥44px；零横向溢出。
15. 三张图与当前页面做同视口对照目验：构图、裁切、标题、说明、热点、反馈、暗部可辨性合格，控制台零异常。
16. `node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全绿，缓存版本升至 v43，README / ProgressLog / design-qa 同步。
17. v42 Smoke + visual、v41 Smoke、v40 Smoke + visual、v39 Smoke 近邻回归。

浏览器脚本放 `/tmp/goddead-qa/`：

- `v43-counter-knock-smoke.mjs`
- `v43-counter-knock-visual.mjs`

正式证据放 `design-qa-evidence/v43-*`，至少包含：

- 首页 clean / 第一敲 / 第二敲 / 第三敲开门：桌面与移动关键态。
- 三个新场景桌面 1440×1024、移动 390×844、短桌面 1440×800。
- 三处首页回敲反馈。
- 三个新场景至少各一条 action 反馈。
- 目录与 Remembrance。
