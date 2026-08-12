# v76 现实退款处 / REALITY REFUND COUNTER

版本：v76 设计冻结稿
状态：已实现并通过静态验收（9665 assertions），待 Codex 独立真实浏览器验收
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

末日保修局因现实擅自维修而作废保修后，所有仍然存在的东西开始索回购买自己的代价。有人用童年买到一具会衰老的肉身，有人用遗忘支付姓名，有人从死亡手里租来几年时间；如今他们发现商品与描述不符，却没有谁记得“不存在”是否接受退货。

玩家依次选择：

1. 一项被错误售出的存在；
2. 一份证明自己曾付款的存在凭证；
3. 一种会让现实承担损失的退款方案；

形成 `3 × 3 × 4 = 36` 份现实退货单。每次检验后，一名亡后退款员停留在对应旧场景；三轴全部覆盖后，不符描述集体诉讼庭开放，产生三条新的退款结局。

## 解锁合同

v76 只读 v75，不写 v75 或更早状态。

`realityRefundCounterUnlocked()` 必须同时满足：

- `apocalypseWarrantyOfficeUnlocked()` 为真；
- v75 warrantyClaims 覆盖三种 defect、三种 proof、四种 remedy；
- v75 `recallOutcomes` 精确包含：
  - `the-world-was-recalled-from-circulation`
  - `the-apocalypse-was-repaired-with-a-spare-dawn`
  - `existence-voided-its-own-warranty`

任一前置缺失时，v76 getter 返回全新默认态，四个 v76 direct hash 全部归一到 `#remembrance`；入口、记忆、39 格图鉴、目录和三处亡后退款员全部隐藏。

## 新场景

1. `#reality-refund-counter`：现实退款处，选择三项被错误售出的存在。
2. `#proof-of-existence-incinerator`：存在凭证焚化库，选择三份付款凭证。
3. `#reality-return-inspection`：现实退货检验台，选择四项退款方案。
4. `#class-action-court`：不符描述集体诉讼庭，执行三项最终裁定。

场景总数：`133 → 137`。

## 第一幕：现实退款处

标题：`04υ / 现实退款处 · REALITY REFUND COUNTER`
图：`assets/v76-reality-refund-counter.webp`

黑石大厅分出三座退货柜台。左侧，一具成人肉身躺在黄铜退货带上，脚边空摇篮和旧玩具证明童年已经付清；中央，无脸退款员接过被遗忘洗白的姓名牌；右侧，裂纹沙漏装着从死亡手里租来的年岁。三块原生热点必须清楚、不重叠、桌面与移动端均 `≥44px`。

### 三项被错误售出的存在

| subject | 按钮 | feedback | tally |
|---|---|---|---|
| `body-bought-with-childhood` | `退回用童年购买的肉身 · RETURN THE BODY BOUGHT WITH CHILDHOOD` | `退货带称出一具成年肉身。价签写着整段童年已经抵扣，磨损却从出生当天便开始计算。` | `body` |
| `name-paid-with-forgetting` | `退回以遗忘支付的姓名 · RETURN THE NAME PAID WITH FORGETTING` | `空名牌从影子上剥落。你为得到这个姓名忘掉了付款过程，因此商家声称交易从未发生。` | `name` |
| `years-leased-from-death` | `退回从死亡租来的年岁 · RETURN THE YEARS LEASED FROM DEATH` | `裂纹沙漏倒出几段尚未活完的年份。死亡承认出租过时间，却坚持租客从签约那刻起已经逾期。` | `time` |

选中 subject 后创建 pending，锁住三按钮，显示逐字反馈后进入 `#proof-of-existence-incinerator`；只在 target arrival 时写入 `draft.subject` 与 `visited.incinerator`。

## 第二幕：存在凭证焚化库

标题：`04φ / 存在凭证焚化库 · PROOF-OF-EXISTENCE INCINERATOR`
图：`assets/v76-proof-of-existence-incinerator.webp`

三座证据炉分别陈列：由乳牙和旧玩具压成的童年价签、正从黄铜姓名牌上蒸发的遗忘收据、从灰烬时钟里爬出的死亡退款理由。它们都处在燃烧边缘，但尚未销毁。三块热点清楚、不重叠、`≥44px`。

### 三份存在付款凭证

| proof | 按钮 | feedback | target |
|---|---|---|---|
| `childhood-price-tag` | `提交童年价签 · SUBMIT THE CHILDHOOD PRICE TAG` | `乳牙、旧玩具和第一场噩梦被压成价签。它能证明童年付过款，却无法证明收到的是哪一具身体。` | `borrowed-childhood` |
| `erased-name-receipt` | `提交抹名收据 · SUBMIT THE ERASED-NAME RECEIPT` | `收据上的姓名已经被付款行为擦除。空白仍保留你的笔压，像一个拒绝承认自己被叫过的影子。` | `blank-name-cloakroom` |
| `death-issued-refund-reason` | `提交死亡退款理由 · SUBMIT DEATH'S REFUND REASON` | `死亡盖章证明年岁不符合描述：每一年都承诺通向未来，实际却只把租客送回签约柜台。` | `lifetime-pawn-vault` |

选中 proof 后进入 `#reality-return-inspection`；只在 target arrival 时写入 `draft.proof` 与 `visited.inspection`。

## 第三幕：现实退货检验台

标题：`04χ / 现实退货检验台 · REALITY RETURN INSPECTION`
图：`assets/v76-reality-return-inspection.webp`

四座检验台围住中央退货通道：左上骨镜核对现实与承诺的倒影；左下黄铜剪把肉身从童年价签上拆开；右上逆流泵从遗忘卷轴里抽回姓名；右下裂纹沙漏压机把已活年岁压成暗红退款币。四块热点清楚、不重叠、`≥44px`。

### 四项现实退款方案

| remedy | 按钮 | fragment |
|---|---|---|
| `refund-to-nonexistence` | `原路退回不存在 · REFUND TO NONEXISTENCE` | `退款员沿存在的付款路径逆向操作。你逐件失去身体、姓名与时间，却发现不存在没有账户可收款。` |
| `restore-original-absence` | `恢复出厂缺席 · RESTORE THE ORIGINAL ABSENCE` | `检验台把你修复成购买以前的空位。世界终于与广告完全一致，只是再没有顾客能够确认。` |
| `exchange-for-possible-self` | `换货为一个可能的自己 · EXCHANGE FOR A POSSIBLE SELF` | `仓库递来另一种可能的你。那个人拥有完整童年、姓名和余生，却拒绝承认自己是替换件。` |
| `charge-reality-restocking-fee` | `向现实收取重新上架费 · CHARGE REALITY THE RESTOCKING FEE` | `现实被迫支付把你重新塞回世界的费用。每一枚退款币都从附近事物的存在感里扣除。` |

退货单 id 固定为 `subject:proof:remedy`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自带自由文本。

点击 remedy 后创建 refund-case pending，必须含固定 `source=reality-return-inspection`，并转到 proof 对应旧场景。只在 target arrival 时原子执行：

- `refundRuns +1`；
- 对应 `claimantTallies +1`；
- refundCase 首次发现才进入图鉴；
- `lastOutcome` 更新；
- `activeCashier` 建立；
- draft 清空；
- pending 清空。

重复同一退货单不重复图鉴，但仍增加真实退款次数与主体票数。来源页刷新不能提前结算，目标页刷新不能重复结算。

## 三处旧场景亡后退款员

| proof | 旧场景 | 返回按钮 | activeCashier feedback |
|---|---|---|---|
| `childhood-price-tag` | `borrowed-childhood` | `跟童年退款员返回柜台 · RETURN WITH THE CHILDHOOD CASHIER` | `童年退款员在借来童年室核对价签。每一件玩具都承认收过款，却没有一件愿意退回长大的你。` |
| `erased-name-receipt` | `blank-name-cloakroom` | `跟抹名退款员返回柜台 · RETURN WITH THE ERASED-NAME CASHIER` | `抹名退款员从空名寄存处取回收据。柜里的每个名字都像你，唯独你的那格坚持从未出租。` |
| `death-issued-refund-reason` | `lifetime-pawn-vault` | `跟死期退款员返回柜台 · RETURN WITH THE DEATH-ISSUED CASHIER` | `死期退款员在寿命典当库逐年点货。死亡收回所有未来，仍欠你一段从未交付的现在。` |

activeCashier 只在准确 target 出现。返回后清 activeCashier，进入现实退款处。旧场景原有反馈、pending、图鉴、通知与入口不得被覆盖。

## 覆盖与集体诉讼

`realityRefundCoverageComplete()` 必须从规范 refundCases 实时重算：

- 三种 subject 全覆盖；
- 三种 proof 全覆盖；
- 四种 remedy 全覆盖；
- 至少四份退货单。

覆盖可由四份代表退货单完成，三份永远不能覆盖四项 remedy。

覆盖完成后，痕迹室显示：

`起诉现实从未符合描述 · SUE REALITY FOR NEVER MATCHING ITS DESCRIPTION`

进入 `#class-action-court`。

标题：`04ψ / 不符描述集体诉讼庭 · CLASS-ACTION COURT OF THE NEVER-AS-DESCRIBED`
图：`assets/v76-class-action-court.webp`

### 三项集体退款裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `return-existence-for-full-refund` | `退回全部存在并全额退款 · RETURN EXISTENCE FOR A FULL REFUND` | `all-existence-was-refunded-to-the-void` | `threshold` | `黄铜退货门吞下整座世界，只留下柜台前的黑色空位。退款已经全额到账，但账户与持有人一同被退回。` |
| `refund-every-body-to-childhood` | `把所有肉身退回童年 · REFUND EVERY BODY TO CHILDHOOD` | `every-body-was-refunded-to-childhood` | `borrowed-childhood` | `陪审席上的空壳逐一缩回摇篮。成年人失去伤口和年龄，童年却收到许多从未订购过的尸体。` |
| `convict-reality-of-false-advertising` | `判现实虚假宣传 · CONVICT REALITY OF FALSE ADVERTISING` | `reality-admitted-it-never-matched-description` | `remembrance` | `现实承认自己从未像承诺那样真实。痕迹墙获得赔偿，从此每段记忆都可以标注“实物可能与存在不同”。` |

每次合法 target arrival：`classRuns +1`；outcome 首次进入 `classOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 classRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v76_reality_refund`
version：`76`

规范十一键，固定投影顺序：

```js
{
  version: 76,
  visited: { counter: false, incinerator: false, inspection: false, court: false },
  draft: { subject: '', proof: '' },
  refundCases: [],
  classOutcomes: [],
  refundRuns: 0,
  classRuns: 0,
  claimantTallies: { body: 0, name: 0, time: 0 },
  lastOutcome: '',
  activeCashier: null,
  pending: null
}
```

规范化要求：

- visited 精确投影四布尔；
- draft 精确投影两键，proof 非空时 subject 必须合法；
- refundCases 按 `SUBJECTS × PROOFS × REMEDIES` 固定表顺序去重；
- classOutcomes 按三 action 固定顺序去重；
- refundRuns / classRuns 与三 claimantTallies 均 floor、clamp `0..9999`；
- lastOutcome 只能指向规范 refundCases 或 classOutcomes；
- activeCashier 只允许 `{proof,refundCase,feedback}` 三键；refundCase 必须已收集，proof 等于 refundCase 第二段，feedback 必须由 proof 表逐字反算；
- 顶层多余键不得落盘；坏 JSON、坏 version、数组、null 或未解锁时 getter 返回默认态；
- v76 不写 v75 及任何旧 key。

## 七类 strict pending

所有 pending 必须 exact-key、逐字反算，额外键、缺键、错 source / target / feedback 均归 null。

1. `entry`：`{kind,target,feedback}`，target=`reality-refund-counter`。
2. `subject`：`{kind,source,subject,target,feedback}`，source=`reality-refund-counter`，target=`proof-of-existence-incinerator`。
3. `proof`：`{kind,source,subject,proof,target,feedback}`，source=`proof-of-existence-incinerator`，target=`reality-return-inspection`。
4. `refund-case`：`{kind,source,subject,proof,remedy,refundCase,target,feedback}`，source=`reality-return-inspection`，target 由 proof 反算。
5. `cashier-return`：`{kind,from,target,refundCase,feedback}`，from 为三个旧场景之一并匹配 activeCashier.proof，target=`reality-refund-counter`。
6. `class-entry`：`{kind,target,feedback}`，coverage 完整，target=`class-action-court`。
7. `class-action`：`{kind,source,action,outcome,target,feedback}`，source=`class-action-court`，逐表反算。

重播矩阵：

- target：立即 arrive，一次性结算并清 pending；
- source：恢复逐字反馈、锁定按钮与 aria-pressed，只排一次转场；
- else：清 pending，不结算、不转场；
- target reload 不重复增加 runs / tallies；
- source reload 不提前计数。

## 路由守卫与旧场景窄桥

- counter：合法 entry / cashier-return target，或 visited.counter；
- incinerator：合法 subject target，或 visited.incinerator + 合法 draft.subject；
- inspection：合法 proof target，或 visited.inspection + 合法完整 draft；
- court：coverage + 合法 class-entry target，或 visited.court；
- 三个旧 target 先服从各自既有准入语义；v76 只为合法规范化后的 refund-case / class-action pending target 或匹配 activeCashier 增加必要的窄桥例外。
- `borrowed-childhood`、`blank-name-cloakroom`、`lifetime-pawn-vault`、`threshold` 与 `remembrance` 不得收窄旧版本原有合法入口。
- 新窄桥不得顺带放宽任何旧守卫；v76 pending / activeCashier 一旦失效，新增例外必须同步消失。

## UI / 图鉴 / 目录

痕迹室记忆行：

`现实退款处：已受理 N/36 份退货，共退款 R 次；主体 肉身 B / 姓名 N / 年岁 T；凭证 童价 C / 抹名 E / 死由 D；方案 退不存在 V / 复缺席 A / 换可能 P / 收上架 F；退款多数 Q；集诉结局 O/3。`

图鉴新增 39 格：36 refundCases + 3 classOutcomes。未发现显示 `？？？`；发现后显示冻结标题与逐字 feedback。

目录新增四项：

- `04υ / 现实退款处`
- `04φ / 存在凭证焚化库`
- `04χ / 现实退货检验台`
- `04ψ / 不符描述集体诉讼庭`

“遗忘全部”必须移除 v76 key，清 v76 AutoAdvance、draft、activeCashier、pending、反馈、disabled、aria-pressed，隐藏入口、记忆、39 格图鉴、目录与三处亡后退款员；不写 v75。

## 交互防线

必须恰好 18 个 v76 click listener，首条语句均为 `if (!e.isTrusted) return;`：

- 普通入口 1；
- class 入口 1；
- subject 3；
- proof 3；
- remedy 4；
- cashier-return 3；
- class action 3。

choose 函数还要复查当前 scene、button visible / enabled、figure visible、draft / pending 条件。合成 click 必须零副作用，真实鼠标 / 键盘点击必须可玩。

## 素材合同

所有源 PNG 与运行时 WebP 均为 `1536×1024`，无文字、无 logo、无 UI、无水印，保持 Goddead 黑石 / 旧黄铜 / 灰白骨质 / 暗红封蜡视觉语言。WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP | 用途 |
|---|---|---|
| `design-references/source-v76-reality-refund-counter.png`（1536×1024 / 2527199 B / `d05025a6fc47eec793e7a9d81b540dc30b7d79f936c8fad9e4ccf245f2f3ef7b`） | `assets/v76-reality-refund-counter.webp`（1536×1024 / 221538 B / `aaac00d54db93c375fe229bb0dd21ba8e68adaca991d4c05bf44934452214afc`） | 三项被错误售出的存在 |
| `design-references/source-v76-proof-of-existence-incinerator.png`（1536×1024 / 2474720 B / `0fd77f5bc6117c91dc715b240f08e1e611adb5d632a49183dcfc3595c6d79471`） | `assets/v76-proof-of-existence-incinerator.webp`（1536×1024 / 231288 B / `793496de8d7ed1976b2168b07923d6556b6a0392acb196799c05b5b9351e4938`） | 三份存在付款凭证 |
| `design-references/source-v76-reality-return-inspection.png`（1536×1024 / 2681364 B / `7ad994825921ae47b20ad29e5b11678c7915dab14eb2d42a6396c6895412d24c`） | `assets/v76-reality-return-inspection.webp`（1536×1024 / 246982 B / `cfafd2121ff47a8ce76492fd5e22a6ea85ab580bf623e12ed8ad6f3140d81b64`） | 四项现实退款方案 |
| `design-references/source-v76-class-action-court.png`（1536×1024 / 2780701 B / `849b557d80752ec020379510e51cc216e4846f8cd55e5ffce30098212ca1e810`） | `assets/v76-class-action-court.webp`（1536×1024 / 277948 B / `218bfe04018c0be21dc54431b88f72e8c3fb1b0ec3aecc5629d33668cc6005dc`） | 三项集体退款裁定 |

## 静态测试门槛

- cache `v=76`；
- 137 场景、唯一 id / data-scene、四场景标题 / 路由 / preload / 目录；
- 4 source + 4 WebP 尺寸、sha256、bytes 与预算冻结；
- 解锁只读 v75，锁定四 direct hash 回 remembrance；
- 十一键 canonical state、坏 JSON / version / type、去重 / clamp / lastOutcome；
- 36 refundCases 与 3 classOutcomes 穷举；
- 七类 pending exact keys + 逐字反算 + source / target / else；
- source reload / target arrival / target reload / repeat run；
- 三处 activeCashier 直达、刷新、返回、清理与旧反馈共存；
- coverage 四份通过、三份失败；
- 路由窄桥不放宽旧守卫，也不收窄旧场景原有合法准入；
- 18 个 isTrusted listener 与合成点击零副作用；
- 忘记全部与 v75 回归。

## Codex 独立浏览器验收

1. v75 锁定态下四个 v76 hash 全回 remembrance；
2. 桌面 `1280×720` 与移动 `390×844` 四场景图片完整、热点 `≥44px`、无横溢；
3. subject → proof → remedy 逐步锁定与反馈逐字一致；
4. 代表退货目标结算、图鉴、计数、刷新幂等；
5. 三处亡后退款员直达 / 刷新 / 返回；
6. coverage 三份失败、四份成功；
7. 三项集体诉讼代表结局与重复幂等；
8. 七类 pending source / target / else；
9. 坏存档回默认态；
10. 合成 click 无副作用、Chrome 真实 click 生效；
11. 全新页 console warn / error 为零。

## v77 活口

现实承认虚假宣传后，所有“可能的自己”都拿着同一张换货单出现，要求证明谁才是原装。下一站开放：

`自我真伪鉴定所 / AUTHENTICITY OFFICE OF THE SELF`

它将鉴定原装人格、替换记忆与仿制灵魂，并追问：如果每一种可能都是真的，赝品究竟是谁。
