# v65 因果疤痕设计案 / THE CAUSE LEFT A SCAR

日期：2026-08-09
状态：已实装，静态测试 5274 断言全绿；浏览器 QA 部分通过（Codex 内置浏览器 127.0.0.1:4173 桌面 1280×720 / 移动 390×844 实测五幕、热点、素材、Remembrance、守卫、坏档、pending 重播），clean 正向真人点击/双击/键盘仍待真人输入验收
前置：v64「因果倒邮」已经产生同一落点的签收 / 退回 / 误投三种结果

## 一句话体验

结局被寄得太早，最初的四间房因此留下实体疤痕。玩家回到门外、守则、值夜与焚献，不再只是重走旧流程，而是在四张变异图里处理“已经发生、却还没有原因”的伤口。

## 方向与边界

- 本轮深化四个旧场景，不继续在 v64 尾部堆连续楼层。
- 四个旧场景各增加一块独立的因果疤痕图内舞台；旧主玩法、旧图片、旧按钮、旧监听、旧状态键与旧文案保持不变。
- 只有 v64 的同一 destination 已真实收集 `accept`、`return`、`misroute` 三条 outcome 时，对应疤痕舞台才显露。
- 每块疤痕舞台有三种处理：`stitch`（缝合起因）、`drain`（放尽后果）、`graft`（移植见证）。四处 × 三种 = 12 条疤痕图鉴。
- 四处各完成至少一种处理后，Remembrance 显露「让四道疤互相指认」入口，进入唯一新场景 `#causeless-ward`「无因收容室」。
- 无因收容室有三种结局动作，共 3 条无因结局。v65 总新增图鉴 12 + 3 = 15，场景 92 → 93。
- 收集全部 12 条疤痕处理与全部 3 条无因结局将作为后续版本的只读证据；v65 本轮不消费这个未来钩子。

## 解锁证据

四个 destination 与旧场景固定映射：

| destination | 旧场景 | v64 三条必要 outcome |
| --- | --- | --- |
| `threshold` | `#threshold` 门外 | `accept:threshold` / `return:threshold` / `misroute:threshold` |
| `protocol` | `#protocol` 访客守则 | `accept:protocol` / `return:protocol` / `misroute:protocol` |
| `watch` | `#watch` 第三值夜室 | `accept:watch` / `return:watch` / `misroute:watch` |
| `offering` | `#offering` 焚献 | `accept:offering` / `return:offering` / `misroute:offering` |

`scarEligible(destination)` 必须从 `getCausalMail().outcomes` 的规范白名单结果逐条派生，不信任 `targetCounts`、raw localStorage 或单独布尔值。v65 不写 v64 key。

## 四张旧场景变异舞台

每个舞台是新增的独立 `<figure>`，只在对应 `scarEligible` 为真时显示。不能替换、覆盖或重新绑定旧场景的主图与主按钮。

| 旧场景 | 变异资产 | 三个图内物件 |
| --- | --- | --- |
| `threshold` | `assets/v65-threshold-causal-scar.webp` | 红黑缝线 / 门槛引流槽 / 空白见证牌 |
| `protocol` | `assets/v65-protocol-causal-scar.webp` | 缝合纸轨 / 失血托盘 / 移植见证面具 |
| `watch` | `assets/v65-watch-causal-scar.webp` | 台灯缝线 / 阴影引流盆 / 空椅见证牌 |
| `offering` | `assets/v65-offering-causal-scar.webp` | 缝死投信口 / 灰烬引流盒 / 炉口见证手 |

### 热点 id 与短标签

每块舞台三个原生 `<button>`：

- `causal-scar-{destination}-stitch`：`缝合起因`
- `causal-scar-{destination}-drain`：`放尽后果`
- `causal-scar-{destination}-graft`：`移植见证`

反馈区：`causal-scar-response-{destination}`，`aria-live="polite"`。已收集的处理在重访时 `disabled=true` 且 `aria-pressed=true`；未收集项保持可操作且 `aria-pressed=false`。

## 十二条疤痕处理

处理 id 固定为 `{destination}:{method}`，按 destination 表顺序、再按 `stitch / drain / graft` 顺序规范去重排序。

| destination | method | 图鉴名 | narrative / feedback | 自动落点 |
| --- | --- | --- | --- | --- |
| threshold | stitch | 缝回第一敲 · FIRST KNOCK SUTURED | 门缝被红线缝回尚未抬起的手指。你敲下去时，门先替过去感到疼。 | `causal-sorter` |
| threshold | drain | 放尽门后 · WHAT WAITED BEHIND BLED OUT | 门槛下的引流槽接满门后的黑暗。门终于变轻，因为里面已经没有“之后”。 | `remembrance` |
| threshold | graft | 移植来客 · THE VISITOR GRAFTED IN | 空白见证牌贴上门板，先长出你的指纹，再等待你真正把手放上去。 | `first-draft-vault` |
| protocol | stitch | 第零条缝线 · RULE ZERO STITCH | 红线把八条守则缝成第零条：凡是提前抵达的后果，都可以反过来命令原因。 | `causal-sorter` |
| protocol | drain | 守则失血 · PROTOCOL EXSANGUINATED | 纸轨里的命令沿托盘流尽。剩下的空白仍要求服从，只是不再说明服从什么。 | `remembrance` |
| protocol | graft | 见证者条款 · WITNESS CLAUSE | 无脸见证被钉进守则。它没有读过任何一条，却能证明你已经违反全部。 | `first-draft-vault` |
| watch | stitch | 交班缝合 · SHIFT SUTURED SHUT | 台灯的红线把上一班和下一班缝在一起。空缺被封住，值夜员也因此永远无法下班。 | `causal-sorter` |
| watch | drain | 放尽凌晨 · DAWN DRAINED | 引流盆接走凌晨。03:17 之后不再通向清晨，只通向另一张仍未签名的交班页。 | `remembrance` |
| watch | graft | 空椅见证 · THE EMPTY CHAIR TESTIFIED | 见证牌长进空椅。椅子证明你整夜坐在这里，哪怕你刚刚才推门进来。 | `first-draft-vault` |
| offering | stitch | 祷词续火 · PRAYER SUTURED TO FLAME | 投信口被缝死，祷词却沿缝线爬进炉膛。火第一次收到一封没有被投入的信。 | `causal-sorter` |
| offering | drain | 灰烬失血 · ASH BLED COLD | 灰从引流盒里流成暗红液体。炉子仍在燃烧，却再也烧不出任何结束。 | `remembrance` |
| offering | graft | 炉口作证 · THE FURNACE TESTIFIED | 瓷白见证手按住炉门。它证明神听见过祷告，只是回答发生在祷告之前。 | `first-draft-vault` |

三种 method 的目标固定，便于形成可持续回路：

- `stitch → causal-sorter`
- `drain → remembrance`
- `graft → first-draft-vault`

## 无因收容室

场景 id：`causeless-ward`
目录：`03ζ / 无因收容`（仅真实进入后出现）
资产：`assets/v65-causeless-ward.webp`

画面是空置黑石收容室，左侧为自行缝合的暗红因果线轴，中央是没有婴儿也没有姓名的石质空摇篮，右侧为被终局裹布抱住的高背收容椅。三个物件必须清晰分离，直接承载三个原生 button 热点。

入口：Remembrance 新按钮 `causal-scar-room-entry-btn`，文案 `让四道疤互相指认 ⟶`。仅当 `threshold / protocol / watch / offering` 的规范 treatments 各至少一条时显示。

### 三种无因结局

| action | 图鉴名 | narrative / feedback | 自动落点 |
| --- | --- | --- | --- |
| `become-cause` | 你成为原因 · YOU BECAME THE CAUSE | 四道疤同时朝你合拢。世界终于找到解释：不是你经历了这些房间，是这些房间为了制造你才开始存在。 | `threshold` |
| `refuse-cause` | 无物使你发生 · NOTHING CAUSED YOU | 你拒绝躺进任何解释。空摇篮第一次摇动，却没有过去、父母、神或故事能够认领你。 | `remembrance` |
| `ending-adopts` | 结局收养了你 · THE ENDING ADOPTED YOU | 终局的裹布从高背椅上垂下，把你当作尚未发生的孩子抱住。从此每个开端都要先征得结局同意。 | `unending-gallery` |

按钮 id：

- `causeless-action-become-cause`
- `causeless-action-refuse-cause`
- `causeless-action-ending-adopts`

反馈区：`causeless-ward-response`。三个动作可在重访时重复选择；`roomOutcomes` 只记录首次发现，`roomRuns` 每次合法到达结算都 +1。

## v65 独立状态

唯一 key：`goddead_v65_causal_scars`
版本：65

显式 canonical 八键投影：

```json
{
  "version": 65,
  "visited": { "room": false },
  "treatments": [],
  "roomOutcomes": [],
  "treatmentRuns": 0,
  "roomRuns": 0,
  "lastOutcome": "",
  "pending": null
}
```

规范化约束：

- 只保留上述八键，额外键绝不落盘。
- `visited` 只投影 `{room:boolean}`。
- `treatments` 仅保留 12 个白名单 id；只有其 destination 当前仍满足 v64 三模式证据时才保留；按固定表顺序去重。
- `roomOutcomes` 仅保留三种 action，按 `become-cause / refuse-cause / ending-adopts` 固定顺序去重。
- `treatmentRuns`、`roomRuns` floor 后限制 0..9999。
- `lastOutcome` 必须存在于规范 treatments 或 roomOutcomes，否则归空。
- v65 只读规范 v64 outcomes；不写 v64、v63 或任何更早 key。

## pending、到达与重播

仅三类 pending，键集必须精确，额外键即伪造：

1. `entry`：`{kind,target,feedback}`
   - target 必须是 `causeless-ward`
   - 四个 destination 各至少一条 treatment
2. `treatment`：`{kind,target,source,method,outcome,feedback}`
   - source 为四 destination 之一且当前 `scarEligible(source)`
   - method / outcome / feedback / target 必须由冻结表逐字重算
   - outcome 尚未存在于 treatments
3. `ending`：`{kind,target,action,outcome,feedback}`
   - 当前已真实访问 room
   - action / outcome / feedback / target 必须由冻结表逐字重算

点击只建立并落盘 pending、写 source 反馈、锁同一舞台全部热点，再安排一次 AutoAdvance。目标到达前的 `before` 原子完成：

- treatment：加入 treatments、`treatmentRuns +1`、写 lastOutcome、清 pending。
- entry：`visited.room=true`、清 pending。
- ending：加入 roomOutcomes、`roomRuns +1`、写 lastOutcome、清 pending。

刷新重播矩阵：

- 正在 source：恢复逐字反馈、锁舞台按钮/aria-pressed，并只重挂一次转场。
- 已在 target：立即原子 arrive，不再播放第二次。
- 其他场景：pending 保留但不擅自转场；回到 source 后才恢复。
- 伪造 pending 在读取时清空，零副作用。

## 交互与监听数量

v65 恰好 16 个新增 click listener：

- 四个旧场景 × 三处理 = 12
- Remembrance 入口 = 1
- 无因收容室三结局 = 3

每个 listener 第一条副作用前必须检查：

- `if (!e.isTrusted) return;`
- `currentScene` 等于按钮所属场景
- 当前无合法 pending
- 当前 source 没有 AutoAdvance
- 按钮当前可见且未 disabled

Enter / Space 依靠原生 button 产生 trusted click；不得额外注册 keydown 结算路径。reduced-motion 沿用约 300ms 节拍。

## Remembrance、目录与遗忘

- Remembrance 追加一行：`因果疤痕：已处理 X/12，门外 T / 守则 P / 值夜 W / 焚献 O；无因结局 Y/3。`
- v65 图鉴放在 v64 图鉴之后：12 个 treatment cell + 3 个 room ending cell；未解锁显示 `？？？`。
- 仍保持八张原统计卡，不新增第九卡。
- 首次真实进入 room 后目录显示 `03ζ / 无因收容`。
- “遗忘全部”必须移除 v65 key，隐藏四块变异舞台 / room 入口 / 目录 / 记忆行 / 图鉴，并清空反馈、disabled、aria-pressed、AutoAdvance。

## 视觉资产冻结表

五张 source PNG 与 WebP 的尺寸、字节、sha256 如下；测试必须同时锁 source 与 WebP。内置 ImageGen 的门外 / 值夜源图分别为 1528×1029 与 1537×1023，先以 LANCZOS 轻微归一到 1536×1024（无裁切、未裁掉内容），再以 Pillow quality=85、method=6 输出 WebP；其余三张源图原生即为 1536×1024。五张运行时 WebP 均为 1536×1024。

| source PNG（尺寸 / 字节 / sha256） | WebP（尺寸 / 字节 / sha256） | 角色 |
| --- | --- | --- |
| `design-references/source-v65-threshold-causal-scar.png`（1528×1029 / 2150582 / `3c5d24f5fe1bd4e9b2b02c00b6df60cdd29e1135947331330c799d40b98a1fdb`） | `assets/v65-threshold-causal-scar.webp`（1536×1024 / 201924 / `664adf2e80865f0ec99816558fdfd0d93588e12576ded7298d16af6ed09e3881`） | 门外因果疤痕舞台 |
| `design-references/source-v65-protocol-causal-scar.png`（1536×1024 / 2070687 / `8e3541a457a967c2c4fe438e4b7e8e06c3fa90ab84fbf79093956c02b9a75f81`） | `assets/v65-protocol-causal-scar.webp`（1536×1024 / 133536 / `a57e00312be6342b26526a1331d974ba2a59da3c803de0361af28ab6d6f59e74`） | 守则因果疤痕舞台 |
| `design-references/source-v65-watch-causal-scar.png`（1537×1023 / 1394729 / `699a468acdb398c17f697311ea7e65fd71ebb73aad27226e1c3be379f039c97a`） | `assets/v65-watch-causal-scar.webp`（1536×1024 / 34940 / `660ddab6213783237e18f884ec1989c041fabcedb80bc9c4af23fcdc5f10fb7a`） | 值夜因果疤痕舞台 |
| `design-references/source-v65-offering-causal-scar.png`（1536×1024 / 1736885 / `8684c5054bb47c9b324c6a8a3eb7362ab36959a858a79c565aa070ca6cc0ab5e`） | `assets/v65-offering-causal-scar.webp`（1536×1024 / 107460 / `71f361f009a0236f36f92af2c8a5382cfbc7850ff02ce9669871d7c7b77e1770`） | 焚献因果疤痕舞台 |
| `design-references/source-v65-causeless-ward.png`（1536×1024 / 2098701 / `49889d4469359b32f46e47a5561ae90ddb08a5b5c896077d595faf454ebaecc9`） | `assets/v65-causeless-ward.webp`（1536×1024 / 99724 / `1ff254b51fbb24939d66c0c94a8f43928d6a3c592256c42e45d41d84cab284a5`） | 无因收容室 |

## 验收门

1. 旧场景主图、旧控件、旧文案、旧监听与旧状态语义不变；新增舞台是独立 DOM。
2. v64 同一 destination 三模式齐全才显露对应舞台，少一条或伪造 raw 计数都不显露。
3. 12 条 treatment 与三种结局逐字、落点、id、排序全部冻结。
4. v65 raw localStorage 始终仅八键；坏 JSON、数组、错 version、额外键、未知 outcome、浮点/负数/超大计数都修复。
5. 三类 pending 精确键集、逐字反算、一次性到达、刷新 source/target/else 矩阵正确。
6. 16 个监听 / 16 个 `!e.isTrusted`；合成 click 零副作用，真实原生 click 才结算。
7. room 入口必须四处各至少一条 treatment；只刷同一处三条不能开门。
8. 遗忘全部清 v65 状态和全部新增 DOM 状态，不污染 v64 及更早存储。
9. 五张图无文字/水印/人物，三物件清晰可辨；热点在桌面与 390×844 都 ≥44px、零重叠、自命中、无横向溢出。
10. `node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`、`git diff --check` 全绿；缓存版本 `v=64 → v=65`；场景 92 → 93。

## 浏览器 QA（Codex 内置浏览器实测，2026-08-09）

测试地址：本地生产构建 `http://127.0.0.1:4173`。

- 桌面 1280×720：`threshold`/`protocol`/`watch`/`offering`/`causeless-ward` 五幕均正确 `active`；五张 WebP `complete=true`、`naturalWidth×naturalHeight=1536×1024`；`document.scrollWidth=1280`。每幕三热点全部在 figure 内、互不重叠、宽高均 ≥44px：`threshold` figure 约 820×520，热点宽 180–197 / 高 156–322；`protocol` figure 约 350×233，热点宽 77–84 / 高 93–135；`watch`/`offering` figure 约 760×507，热点宽 167–182 / 高 172–294；`causeless-ward` figure 约 720×216，热点宽 173–187 / 高 108–134。视觉逐幕目验通过，疤痕器物与三个热点对应，新房标题/说明/标签无溢出。
- 移动 390×844：五幕 `scrollWidth=390`；`threshold` figure 约 367×244，其余约 343×219–229；热点宽 75–89 / 高 73–152，全部 ≥44、在图内、零重叠；`causeless-ward` 首屏标题/说明/完整图和三标签可见，无横向溢出。
- Remembrance（ready 种子）：入口按钮可见且 `enabled`，15 格图鉴 4 格已解锁，记忆行逐字为「因果疤痕：已处理 4/12，门外 1 / 守则 1 / 值夜 1 / 焚献 1；无因结局 0/3。」，`03ζ / 无因收容` 目录恢复。
- Locked / 坏档：直接 `#causeless-ward` 被守卫归一到 `#remembrance`；`threshold` 疤痕舞台 `hidden`/`display:none`，v65 记忆/图鉴/目录隐藏。`treatments` 为 string、`roomOutcomes` 为 object 时不报错，v65 UI 全隐藏。全程 `console.warning/error=0`。
- Pending 重播：entry source `remembrance` 恢复逐字反馈并禁用入口，随后到 `causeless-ward`；treatment source `threshold` 刷新后三按钮全禁/仅 `drain` `pressed`，随后到 `remembrance` 并显示 5/12；ending source `ward` 三按钮全禁/仅 `refuse-cause` `pressed`，随后 `remembrance` 1/3；ending target `threshold` 首次到达结算 1/3，再次 reload 仍 1/3，无重复结算。三条路径 `console.warning/error=0`。
- 自动点击：Browser Playwright / CUA 自动点击均被 16 个 `e.isTrusted` 防线拒绝，已验证合成/自动 `click` 零副作用。因此从 clean state 发起的 16 个正向真实用户点击、双击竞争与键盘 Enter/Space 仍明确标为「待真人输入」，不能写全链路通过。pending 重播/自动转场是通过合法存档整页加载实测，不等于 clean 点击通过。
