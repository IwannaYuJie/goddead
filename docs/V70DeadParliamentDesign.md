# v70 亡者议会 / PARLIAMENT OF THE DEAD

日期：2026-08-10
状态：已实现并通过 Codex 独立静态 + 真实浏览器验收（2026-08-10）
前置：v69 已覆盖三类选民、三类存在证据、三类出生裁定，并真实收集三条人口注销结局

## 一句话概念

死后人口普查把出生追认者、人口移除者与空白户籍公民分成三个幽灵选区。它们在亡者议会依次提出姓名权、影子权、肉身权与一次死亡权，再决定每项权利究竟登记给姓名、影子还是肉身；当三选区、四议案与三种公民权归属全部出现，三种被拆开的“人”会在三人共和国里争夺唯一公民资格。

## 设计边界

- v70 只读 v69 的规范状态，只写独立 key `goddead_v70_dead_parliament`，绝不修改 v69 或更早状态。
- 解锁必须同时证明 v69 records 覆盖三选民、三证据、三裁定，并真实拥有三条 nullificationOutcomes；只伪造结局或只覆盖 records 均不能进入。
- 新增四个场景，场景总数 109 → 113：
  - `#dead-parliament-rotunda`：亡者议会，选择幽灵选区。
  - `#citizenship-article-chamber`：公民权议案厅，选择四项权利之一。
  - `#constitutional-severance-desk`：宪法分籍台，决定权利登记给姓名、影子或肉身。
  - `#three-person-republic-court`：三人共和国，选择三条宪政危机结局。
- 新增 3 × 4 × 3 = 36 条死者法令，以及 3 条宪政危机结局，共 39 格 v70 图鉴。
- 合法重访相同组合会增加 parliamentRuns 与对应 seatTallies；图鉴 decrees 仍只记录首次发现。
- 每条法令在对应的 v69 场景落地后留下独立议会党鞭：出生追认者落在出生投票间、人口移除者落在死后普查厅、空白户籍公民落在矛盾证据库；党鞭可返回亡者议会继续表决。
- 三选区、四议案与三种公民权归属全部覆盖后即可开启三人共和国，不要求集齐 36 条法令。
- 所有新增交互使用原生 button、click/Enter/Space、首击落锁、短反馈后自动转场；不增加二次确认页或伪继续按钮。
- v70 不实现 v71 UI，只留下可验证的三条 crisisOutcomes 作为未来证据。

## 解锁证据

`deadParliamentUnlocked()` 必须从规范 `getPosthumousCensus()` 同时证明：

1. `records` 至少覆盖：
   - electorates：`departed / living / unborn`
   - evidences：`birth-certificate / other-memories / blank-register`
   - verdicts：`count-born / count-never-born / assign-elsewhere`
2. `nullificationOutcomes` 精确包含：
   - `birth-ratified-after-death`
   - `visitor-removed-from-population`
   - `blank-register-became-citizen`

不得使用 v70 自己的 decrees、crisisOutcomes、visited 或 pending 反向证明解锁。

Remembrance 普通入口文案：

`去听死者表决活人的身体 ⟶`

入口反馈逐字冻结：

`三份互相注销的人口册在死后重新分区。议席拒绝整个人入场，只允许姓名、影子与肉身分别登记。`

## 第一幕：亡者议会

场景：`#dead-parliament-rotunda`
标题：`03ψ / 亡者议会 · PARLIAMENT OF THE DEAD`
图：`assets/v70-dead-parliament-rotunda.webp`

一座没有活人席位的圆形议会：左侧是被迟到出生证明追认的半透明议员，中间是从人口中被擦除、只剩空椅与影子的反对席，右侧是一排戴骨瓷冠冕的空白户籍。三支选区左 / 中 / 右清楚分离。

| caucus | 按钮标题 | feedback | decree 落点 |
| --- | --- | --- | --- |
| `ratified-born` | `加入迟生者选区 · JOIN THE LATE-BORN CAUCUS` | `迟到的出生证明举起手。它批准你参加一场在你死后才开始的表决。` | `birth-ballot-booth` |
| `removed-visitor` | `坐进被移除者反对席 · SIT WITH THE REMOVED OPPOSITION` | `空椅替被移出人口的人投下反对票。计数器拒绝承认刚才有人坐下。` | `posthumous-census-hall` |
| `blank-citizen` | `把票交给空白公民 · GIVE THE BALLOT TO THE BLANK CITIZEN` | `空白户籍翻到从未写过的第一页。那一页以公民身份要求发言。` | `contradictory-evidence-archive` |

点击后写入 draft.caucus，创建严格 caucus pending，进入公民权议案厅。重访时 draft 必须先归零再开始新一轮。

## 第二幕：公民权议案厅

场景：`#citizenship-article-chamber`
标题：`03ω / 公民权议案 · CITIZENSHIP ARTICLES`
图：`assets/v70-citizenship-article-chamber.webp`

四座互不遮挡的议案台围成弧线：左上是没有脸的姓名印，左下是独自举手的影灯，右上是被黄铜锁圈住的胸骨，右下是一口只准敲响一次的死亡钟。四项议案在桌面端与移动端都必须拥有独立、可辨认的热点区域。

| motion | 按钮标题 | feedback |
| --- | --- | --- |
| `right-to-name` | `提出姓名权 · MOVE THE RIGHT TO A NAME` | `议案要求每个公民拥有一个姓名，即使拥有姓名的东西从未出生。` |
| `right-to-shadow` | `提出影子权 · MOVE THE RIGHT TO CAST A SHADOW` | `影灯要求把遮住光的资格写进宪法，哪怕公民本身并不存在。` |
| `right-to-body` | `提出肉身权 · MOVE THE RIGHT TO POSSESS A BODY` | `胸骨申请成为公共财产。议会争论身体究竟属于住客、姓名，还是死亡。` |
| `right-to-die-once` | `提出一次死亡权 · MOVE THE RIGHT TO DIE ONCE` | `死亡钟只肯响一次。它要求宪法禁止任何人被同一个结局重复处决。` |

点击后补全 draft.motion，创建严格 motion pending，进入宪法分籍台。

## 第三幕：宪法分籍台

场景：`#constitutional-severance-desk`
标题：`04α / 宪法分籍 · CONSTITUTIONAL SEVERANCE`
图：`assets/v70-constitutional-severance-desk.webp`

巨大的黑色宪法被三条暗红登记线切开：左侧是一枚悬浮姓名面具，中间是一道没有主人的竖立影子，右侧是一具坐在登记椅上的无头肉身。三类公民权归属左 / 中 / 右分离。

| citizen | 按钮标题 | feedback 尾句 | tally |
| --- | --- | --- | --- |
| `name` | `把权利登记给姓名 · REGISTER THE RIGHT TO THE NAME` | `书记官剪断名字与说出它的嘴，把这项权利登记给那串无人应答的称呼。` | `seatTallies.name` |
| `shadow` | `把权利登记给影子 · REGISTER THE RIGHT TO THE SHADOW` | `影子在公民栏按下没有指纹的手印，从此不必跟随任何身体。` | `seatTallies.shadow` |
| `body` | `把权利登记给肉身 · REGISTER THE RIGHT TO THE BODY` | `肉身在没有姓名的情况下获得席位。它的伤口被认作唯一有效的签名。` | `seatTallies.body` |

### 36 条法令的冻结构造

法令 id：`${caucus}:${motion}:${citizen}`，固定顺序为 `CAUCUSES × MOTIONS × CITIZENS`。

法令标题由下表三个唯一短语逐字拼接：

`{caucusTitle} / {motionTitle} / {citizenTitle}`

| 轴 | id | title fragment | feedback fragment |
| --- | --- | --- | --- |
| caucus | `ratified-born` | `迟生者选区` | `迟生者以一张批准晚于死亡的出生证明提出表决。` |
| caucus | `removed-visitor` | `被移除者反对席` | `被移除者让一排空椅共同举手，人口仍显示零人出席。` |
| caucus | `blank-citizen` | `空白公民席` | `空白户籍以没有内容为由，宣布自己不存在利益冲突。` |
| motion | `right-to-name` | `姓名权` | `议案把“拥有姓名”从活人的特权改写成可转让权利。` |
| motion | `right-to-shadow` | `影子权` | `议案允许公民在没有身体时继续遮住光。` |
| motion | `right-to-body` | `肉身权` | `议案把肉身从住处改写成一块可以独立投票的领土。` |
| motion | `right-to-die-once` | `一次死亡权` | `议案禁止同一个公民被同一场死亡重复征用。` |
| citizen | `name` | `归姓名` | `书记官剪断名字与说出它的嘴，把这项权利登记给那串无人应答的称呼。` |
| citizen | `shadow` | `归影子` | `影子在公民栏按下没有指纹的手印，从此不必跟随任何身体。` |
| citizen | `body` | `归肉身` | `肉身在没有姓名的情况下获得席位。它的伤口被认作唯一有效的签名。` |

法令 feedback 为对应的 caucus + motion + citizen 三个 feedback fragment 按表顺序以单个空格连接；禁止运行时随机、同义改写或按票数改变句子。

点击 citizen 后创建 decree pending 并转到该 caucus 对应的 v69 旧场景。只在 target arrival 时原子执行：parliamentRuns +1、对应 seatTallies +1、decrees 首次发现入图鉴、lastOutcome 更新、activeWhip 建立、draft 清空、pending 清空；来源页刷新绝不能提前计票，目标页刷新绝不能重复计票。

### 三处党鞭返回

| caucus | v69 场景 | 按钮 | activeWhip feedback |
| --- | --- | --- | --- |
| `ratified-born` | `birth-ballot-booth` | `跟迟生者党鞭返回议会 · RETURN WITH THE LATE-BORN WHIP` | `迟生者党鞭卷起出生选票：法令已经生效，议会还欠你下一次表决。` |
| `removed-visitor` | `posthumous-census-hall` | `跟被移除者党鞭返回议会 · RETURN WITH THE REMOVED WHIP` | `空椅在普查厅门口等你。它没有选民，却带来了完整的议会传票。` |
| `blank-citizen` | `contradictory-evidence-archive` | `跟空白公民党鞭返回议会 · RETURN WITH THE BLANK-CITIZEN WHIP` | `空白户籍夹走刚通过的法令。未写字的一页示意你回议会继续。` |

activeWhip 只存在于本轮法令的准确 target；返回后清 activeWhip，并进入亡者议会。它不得覆盖 v69 原有投票反馈、summons 或其他图鉴。

## 覆盖完成与危机入口

`parliamentCoverageComplete()` 只从规范 decrees 计算，必须同时覆盖：

- 3 caucuses：`ratified-born / removed-visitor / blank-citizen`
- 4 motions：`right-to-name / right-to-shadow / right-to-body / right-to-die-once`
- 3 citizens：`name / shadow / body`

Remembrance 危机入口文案：

`让三种公民权互相否决 ⟶`

入口反馈逐字冻结：

`三支选区、四项议案与三种公民权已经写进宪法。姓名、影子与肉身各自声称自己才是完整的人。`

## 第四幕：三人共和国

场景：`#three-person-republic-court`
标题：`04β / 三人共和国 · THREE-PERSON REPUBLIC`
图：`assets/v70-three-person-republic-court.webp`

一座像议会又像断头台的三席法庭：左席是戴骨冠的姓名面具，中席是一道穿议员长袍却没有身体的影子，右席是一具没有姓名与影子的肉身。三席之间的暗红宪法被撕成三份；现场同步显示三类 seatTallies 与派生多数结论。

| action | 按钮标题 | outcome | target | feedback |
| --- | --- | --- | --- | --- |
| `crown-name` | `让姓名成为唯一公民 · LET THE NAME BE THE ONLY CITIZEN` | `the-name-became-the-only-citizen` | `threshold` | `姓名戴上骨冠，宣布嘴、影子与肉身都只是它的临时住址。门外第一次只询问称呼，不再询问来者是谁。` |
| `found-shadow-republic` | `让影子另组反对共和国 · LET THE SHADOW FOUND AN OPPOSITION REPUBLIC` | `the-shadow-founded-the-opposition-republic` | `remembrance` | `影子带走反对席和所有未投出的票，在光照不到的地方宣布独立。每个活人脚下从此藏着一个敌国。` |
| `abolish-dead-suffrage` | `让肉身废除死者选举 · LET THE BODY ABOLISH DEAD SUFFRAGE` | `the-body-abolished-dead-suffrage` | `unending-gallery` | `肉身用伤口签署最后一条修正案：只有仍会腐烂的东西可以投票。议会立刻失去全部选民，只剩身体继续履行结果。` |

三按钮可在重访时重复；crisisOutcomes 只记录首次发现，crisisRuns 每次合法 target arrival settle 都 +1。全部收集仅形成 v71 未来证据，不显示未实现入口。

## 状态契约

唯一 key：`goddead_v70_dead_parliament`
版本：70

默认状态：

```js
{
  version: 70,
  visited: { rotunda: false, chamber: false, severance: false, republic: false },
  draft: { caucus: '', motion: '' },
  decrees: [],
  crisisOutcomes: [],
  parliamentRuns: 0,
  crisisRuns: 0,
  seatTallies: { name: 0, shadow: 0, body: 0 },
  lastOutcome: '',
  activeWhip: null,
  pending: null
}
```

顶层 canonical 恰好十一键；额外键丢弃。visited、draft、seatTallies 与 activeWhip 也必须精确键集投影。所有计数先 floor，再裁 0..9999；NaN、Infinity、负数与错误类型归零。

- decrees：只接受 36 个规范 id，按 `CAUCUSES × MOTIONS × CITIZENS` 顺序去重。
- crisisOutcomes：只接受三条规范 outcome，按上表 action 顺序去重。
- draft：motion 非空时 caucus 必须合法；caucus 为空时 motion 强制清空。
- seatTallies：不从 decrees 反推；重复法令也要保留真实票数。
- lastOutcome：只允许已收集 decree 或 crisisOutcome，否则清空。
- activeWhip：只允许 `{caucus,decree,feedback}` 三键；decree 必须已收集，caucus 等于 decree 首段，feedback 必须按 caucus 表逐字重算。
- v69 解锁证据失效时，getDeadParliament 规范化为默认状态并隐藏所有 v70 派生 UI；不得反向修补 v69。

多数派生：seatTallies 唯一最高时分别显示 `姓名占多数 / 影子占多数 / 肉身占多数`；并列最高或全零显示 `议会悬空`。派生文案不落盘。

## 严格 pending 与重播矩阵

pending 仅允许七类，键集必须完全相等，值必须由冻结表反算：

1. `entry`：`{kind,target,feedback}`；target=`dead-parliament-rotunda`，feedback 为普通入口冻结句。
2. `caucus`：`{kind,source,caucus,target,feedback}`；source=`dead-parliament-rotunda`，target=`citizenship-article-chamber`。
3. `motion`：`{kind,source,caucus,motion,target,feedback}`；source=`citizenship-article-chamber`，caucus 与 draft 一致，target=`constitutional-severance-desk`。
4. `decree`：`{kind,source,caucus,motion,citizen,decree,target,feedback}`；source=`constitutional-severance-desk`，decree 与三轴严格相等，target 由 caucus 表反算。
5. `whip-return`：`{kind,from,target,decree,feedback}`；from 为三个 v69 落点之一且必须匹配 activeWhip.caucus，target=`dead-parliament-rotunda`，decree 等于 activeWhip.decree，feedback 等于返回冻结句。
6. `crisis-entry`：`{kind,target,feedback}`；target=`three-person-republic-court`，要求实时 parliamentCoverageComplete。
7. `crisis`：`{kind,source,action,outcome,target,feedback}`；source=`three-person-republic-court`，其余逐字重算，要求实时 coverage complete 与 republic 已访问。

来源页 reload：恢复反馈、锁定该组全部按钮，仅已选按钮 aria-pressed=true，只重挂一次 AutoAdvance。
目标页 reload：先原子 arrival settle 再清 pending；decree 的 runs / tallies / 图鉴与 crisis 的 runs / 图鉴均不得重复。
既非 source 也非 target：清伪造 pending，不结算、不转场。
同拍双击或多按钮竞争：第一项落锁后其余零副作用。

## 路由守卫与旧场景桥

- dead-parliament-rotunda：v69 完整证据 + 合法 entry / whip-return pending target，或已真实 visited.rotunda。
- citizenship-article-chamber：合法 caucus pending target，或 visited.chamber + 合法 draft.caucus。
- constitutional-severance-desk：合法 motion pending target，或 visited.severance + 合法完整 draft。
- three-person-republic-court：实时 coverage complete + 合法 crisis-entry pending target，或 coverage complete + visited.republic。
- v69 证据不足时，四幕 direct hash 统一收紧到 remembrance，并隐藏全部 v70 派生 UI；不得保留 v70 pending。
- v70 decree 结算目标（birth-ballot-booth / posthumous-census-hall / contradictory-evidence-archive）及对应 activeWhip 刷新/直达时，三个 v69 场景守卫必须显式认可合法规范化后的 v70 pending 与 activeWhip，不因 v69 draft 已清空而弹回 remembrance；population-nullification-court 仍只按 v69 自身规则守卫。

## 18 组可信交互

共 18 组 listener：Remembrance 普通入口 ×1、caucus ×3、motion ×4、citizen ×3、whip-return ×3、Remembrance 危机入口 ×1、crisis ×3。

每组 listener 第一行拒绝非 `e.isTrusted` 的 click；必须同时校验 currentScene、合法 pending、AutoAdvance、按钮可见且未 disabled。反馈先出现、同组按钮立即全锁、选中按钮 aria-pressed=true，再创建 pending 与转场；reduced-motion 使用约 300ms 节拍。原生 button 的 Enter / Space 语义不另造 keydown listener。

## Remembrance、图鉴与目录

记忆行逐字格式：

`亡者议会：已通过 N/36 条法令，共表决 R 轮；选区 迟生者 L / 被移除者 A / 空白公民 B；议案 姓名权 N / 影子权 S / 肉身权 F / 一次死亡权 D；公民权 姓名 X / 影子 Y / 肉身 Z；多数 M；宪政危机 O/3。`

- v70 图鉴位于 v69 图鉴之后；固定 39 格：36 decree + 3 crisis outcome。
- 解锁一成立，即使 v70 自身零进度，也要显示 0/36 记忆、39 格全锁图鉴、图鉴父层与普通入口。
- 普通入口仅在 v70 解锁时显示；危机入口仅在 parliamentCoverageComplete 时显示。
- 目录仅在对应 visited 为 true 且 v70 仍解锁时显示：
  - `03ψ / 亡者议会`
  - `03ω / 公民权议案`
  - `04α / 宪法分籍`
  - `04β / 三人共和国`
- “遗忘全部”移除 v70 key，并隐藏入口、目录、记忆、图鉴、三处党鞭；清 draft、activeWhip、反馈、disabled、aria-pressed 与 v70 AutoAdvance，不写 v69。

## 视觉资产冻结要求

最终必须保留四张原始 PNG 与四张运行时 WebP：

| 源图 | 运行时 | 用途 |
| --- | --- | --- |
| `design-references/source-v70-dead-parliament-rotunda.png`（1536×1024 / 2477997 B / `0d7a8292e27360dd665be1a6f6fea2c3a87a318bce2e51d20e274afc98d272bd`） | `assets/v70-dead-parliament-rotunda.webp`（1536×1024 / 210868 B / `5eed6a11d16bc03928f9a77671db97aebff32938f02188a9e2c98f1fc5619490`） | 三支幽灵选区 |
| `design-references/source-v70-citizenship-article-chamber.png`（1536×1024 / 2564484 B / `61aaeba211a02638893e1e6946f9263ac74c8b5153316fd48cb345b42653bce5`） | `assets/v70-citizenship-article-chamber.webp`（1536×1024 / 204774 B / `83416b556e05e66d5886aa38ff2d7b9092f31c5f630a286b86b5f82fa7e1c583`） | 四项公民权议案 |
| `design-references/source-v70-constitutional-severance-desk.png`（1536×1024 / 2169291 B / `1e17cdd91db59d232088ed1ca3cf4f5010fe33fa4c47963b7c428732580f6cf3`） | `assets/v70-constitutional-severance-desk.webp`（1536×1024 / 113956 B / `249e74f3f9ef3519051b7e7e616ac3ea1a6ccc04d11cab1141769ab2e5bc5968`） | 姓名 / 影子 / 肉身三种归属 |
| `design-references/source-v70-three-person-republic-court.png`（1536×1024 / 2585340 B / `ab4a16eb7424dceb0f44ec12dfe0858e695f92e021cff5746558329abf4e4840`） | `assets/v70-three-person-republic-court.webp`（1536×1024 / 200688 B / `4784002dfed4a0d0ac1959f17a280c3ab2ac7a68e53bf66219b639628b7a3dac`） | 三条宪政危机结局 |

- 目标尺寸 1536×1024；若生成源图尺寸不同，只允许等比轻微归一或 LANCZOS 归一，禁止改变构图热点语义。
- 运行时统一 Pillow quality=85、method=6，无裁切。
- tests 冻结源图 + WebP 的像素尺寸、字节预算与 sha256。
- 四图均不得出现可读文字、字母、数字、水印、现代 UI、货币符号、现实政党标志或商标。
- 延续 Goddead 深黑、骨瓷、旧黄铜、暗红线、低饱和写实恐怖质感；三项或四项关键物件必须空间分离，在移动缩放后仍可做 ≥44px 热点。

## 测试契约

以 v69 当前 6227 条断言为基线，新增测试后必须报告实际运行断言数，不能只写 all passed。至少覆盖：

1. 四源图与四 WebP 存在、尺寸、字节预算、sha256。
2. 场景 109 → 113；四 route / title / preload / cache `v=70` / directory label 冻结。
3. 3×4×3=36 decree id、标题、feedback 唯一且固定顺序；3 条 crisis outcome 冻结。
4. v70 唯一 key、canonical 十一键、nested 精确键、clamp、坏类型与额外键清洗。
5. v70 解锁只能由规范 v69 coverage + 三 nullificationOutcomes 证明，v69 缺任一项即关闭。
6. 重复法令不重复图鉴，但 parliamentRuns 与对应 seatTallies 准确累加；source reload 不计票，target reload 不重计。
7. 七类 strict pending 精确键集、逐字重算、source/target/else replay、一次性消费。
8. activeWhip 三键反算，三个 v69 落点党鞭容器互不覆盖既有 UI。
9. 18 组 isTrusted、可见/disabled/currentScene/AutoAdvance、同拍互斥、合成 click 零副作用。
10. Remembrance 39 格图鉴、统计、多数派生、双入口、四目录、零进度入口可见可点、forget-all 清 v70。
11. 旧 v69 key 字节级不变，v63–v69 契约与既有测试继续通过。
12. 三个 v69 旧场景在 v70 decree pending / activeWhip 下不被自身守卫误弹回 remembrance；population-nullification-court 不放宽。
13. 四议案在桌面与窄屏热点定位类、≥44px 触达、零重叠与无横向溢出。

## 浏览器 QA 契约

已由 Codex 使用本地生产文件完成真实浏览器独立验收，状态：**通过**。逐项记录如下：

1. 静态检查：`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`（6502 断言全绿）、`git diff --check` 全部干净通过。
2. locked：四个 v70 direct hash（`#dead-parliament-rotunda`、`#citizenship-article-chamber`、`#constitutional-severance-desk`、`#three-person-republic-court`）均归一 `#remembrance`；v70 记忆行、39 格图鉴、双入口、四目录链接、三处党鞭容器全部隐藏。
3. ready-zero：完整 v69 种子 + v70 零进度时，记忆行显示 `0/36`，39 格图鉴全锁，普通入口 `去听死者表决活人的身体` visible 且 enabled，危机入口 `让三种公民权互相否决` 隐藏。
4. 四幕桌面 1280×720 + 移动 390×844：四张 WebP 均 `complete` 且 `naturalWidth=1536`、`naturalHeight=1024`；所有热点落在图内、互不重叠；移动端热点均 ≥44px；页面 `scrollWidth` 等于视口，横向 overflow 为 0；人工看图通过。
5. isTrusted：应用内程序化 click / Enter 均被 18 组 `e.isTrusted` 防线拒绝，状态零变化；Chrome Computer Use 的真实鼠标点击成功从 `#remembrance` 进入 `#dead-parliament-rotunda`，标题、场景、地址栏同步；存档仅 `visited.rotunda=true`，`decrees`/`parliamentRuns`/`crisisRuns`/`seatTallies` 保持 0，`pending=null`。Chrome 原存档随后 restore-ok，临时标签已关闭。
6. representative decree `ratified-born:right-to-name:name`：首次结算后 `decrees` 1、`parliamentRuns` 1、`seatTallies.name` 1；目标页刷新不重算；重复投同一 decree 后 `decrees` 仍为 1、`parliamentRuns` 2、`seatTallies.name` 2。
7. 三支 caucus 党鞭分别在 `birth-ballot-booth` / `posthumous-census-hall` / `contradictory-evidence-archive` 正确显示且刷新稳定；`whip-return` 的 source 与 target 恢复一致，返回亡者议会后 `activeWhip` 与 `pending` 都为 `null`。
8. coverage：四条代表 decree 覆盖 3 caucus / 4 motion / 3 citizen 后，记忆行显示 `4/36`、`parliamentRuns=4`、`seatTallies.shadow=2` 为多数，危机入口开启；三人共和国并列种子（name/shadow/body 各 1）显示「议会悬空」，三危机按钮均可用。
9. representative crisis `the-shadow-founded-the-opposition-republic`：结算到 `#remembrance`，`crisisRuns=1`、`crisisOutcomes` 1、`pending=null`；刷新不重算。其余两条危机结局由静态契约完整覆盖。
10. 七类 pending（`entry`/`caucus`/`motion`/`decree`/`whip-return`/`crisis-entry`/`crisis`）逐一验证：source 场景自动续播与 target 场景直达结算状态完全一致；else 进入 `protocol` 时仅清 `pending`，不提前结算。
11. 坏 JSON / 坏类型状态均回退为默认：`0/36`、39 格全锁、普通入口可用、危机入口隐藏。
12. 新建干净生产页依次巡检 `#remembrance` + 四幕，`console.warning` / `console.error` = 0。应用内旧 QA iframe 产生的 MutationObserver 注入噪声不计入生产页；新鲜无 iframe 标签为 0。
13. QA 临时 helper 已删除，本地服务已停止；两套浏览器游戏存档均恢复。

## v71 活口（不实装）

当三条 crisisOutcomes 全部真实收集后，未来开启「死亡外交部」：姓名共和国派出没有身体的使节，影子反对国向未活过的时间线申请庇护，肉身政权则对复活实施禁运；三方将拿着由旧结局压成的护照，与三座从未存在过的国家互相承认。v70 只留下可验证的 crisisOutcomes，不放置任何死入口。
