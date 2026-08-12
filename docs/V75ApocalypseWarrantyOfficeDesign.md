# v75 末日保修局 / APOCALYPSE WARRANTY OFFICE

版本：v75 设计冻结稿
状态：已实现并通过 Codex 独立静态与真实浏览器验收（9051 assertions）
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

墓碑专利局给所有未完成机器发出永久许可后，机器立刻声称自己在世界末日之后仍属保修期。末日保修局因此继续营业：尚未出厂就磨损的装置、世界结束后仍无法停机的器物、只剩幽灵作为活动零件的身体，都要求现实承担售后责任。

玩家依次选择：

1. 一项发生在因果之外的故障；
2. 一份不可能成立的购买凭证；
3. 一种会把现实修坏的保修方案；

形成 `3 × 3 × 4 = 36` 份末日报修单。每次维修后，一名亡后理赔员停留在对应旧场景；三轴全部覆盖后，世界总召回场开放，产生三条新的售后结局。

## 解锁合同

v75 只读 v74，不写 v74 或更早状态。

`apocalypseWarrantyOfficeUnlocked()` 必须同时满足：

- `tombstonePatentOfficeUnlocked()` 为真；
- v74 patents 覆盖三种 applicant、三种 priorArt、四种 claim；
- v74 `rulingOutcomes` 精确包含：
  - `the-invention-owned-itself`
  - `existence-was-invalidated-as-prior-art`
  - `the-unburied-haunted-every-prototype`

任一前置缺失时，v75 getter 返回全新默认态，四个 v75 direct hash 全部归一到 `#remembrance`；入口、记忆、39 格图鉴、目录和三处亡后理赔员全部隐藏。

## 新场景

1. `#apocalypse-warranty-office`：末日保修局，选择三项因果外故障。
2. `#proof-of-purchase-morgue`：购买凭证停尸房，选择三份不可能凭证。
3. `#post-world-repair-bench`：世终之后维修台，选择四项现实维修方案。
4. `#universal-recall-yard`：世界总召回场，执行三项最终裁定。

场景总数：`129 → 133`。

## 第一幕：末日保修局

标题：`04π / 末日保修局 · APOCALYPSE WARRANTY OFFICE`
图：`assets/v75-apocalypse-warranty-office.webp`

世界尽头的黑石柜台前分出三座故障岛。左侧装配摇篮里的球形机器尚未出厂便已开裂；中央死太阳从破损光环里漏出冷灰与黑油；右侧未完成自动机只剩胸腔内的幽灵仍在转动齿轮。三块原生热点必须清楚、不重叠、桌面与移动端均 `≥44px`。

### 三项因果外故障

| defect | 按钮 | feedback | tally |
|---|---|---|---|
| `worn-before-manufacture` | `报修出厂前磨损 · CLAIM WEAR BEFORE MANUFACTURE` | `装配摇篮交出一台已经老化的机器。它还缺最后一颗螺丝，却能证明自己曾被使用了几百年。` | `prebirth` |
| `still-running-after-the-end` | `报修世终后不停机 · CLAIM OPERATION AFTER THE END` | `死太阳从破裂光环里漏出冷灰。世界已经结束，它仍拒绝停机，并要求补发最后一夜的电费。` | `aftermath` |
| `ghost-only-moving-part` | `报修幽灵活动零件 · CLAIM THE GHOST AS THE MOVING PART` | `自动机的金属关节全部卡死，胸腔里的幽灵却继续转动齿轮。局方只承认幽灵属于耗材。` | `ghost` |

选中 defect 后创建 pending，锁住三按钮，显示逐字反馈后进入 `#proof-of-purchase-morgue`；只在 target arrival 时写入 `draft.defect` 与 `visited.morgue`。

## 第二幕：购买凭证停尸房

标题：`04ρ / 购买凭证停尸房 · PROOF-OF-PURCHASE MORGUE`
图：`assets/v75-proof-of-purchase-morgue.webp`

停尸房陈列三份凭证：从未建成的工厂吐出的空白长收据、死太阳光环上的红蜡保修封、骨匣里后人对一次未发生维修的家族记忆。三块热点清楚、不重叠、`≥44px`。

### 三份不可能购买凭证

| proof | 按钮 | feedback | target |
|---|---|---|---|
| `receipt-from-unbuilt-factory` | `提交未建工厂收据 · SUBMIT THE UNBUILT FACTORY RECEIPT` | `黄铜线框工厂吐出一张没有商品的长收据。厂房从未建成，退货地址却指向你脚下这道门槛。` | `threshold` |
| `dead-sun-warranty-seal` | `提交死太阳保修封 · SUBMIT THE DEAD SUN WARRANTY SEAL` | `红蜡封印仍留在熄灭光环上。条款没有写期限，因为签发它的白昼不相信自己会结束。` | `remembrance` |
| `descendant-repair-memory` | `提交后人维修记忆 · SUBMIT THE DESCENDANT REPAIR MEMORY` | `尚未出生的后人围着原型回忆一次维修。他们都记得你付过钱，唯独没人记得机器曾经存在。` | `unending-gallery` |

选中 proof 后进入 `#post-world-repair-bench`；只在 target arrival 时写入 `draft.proof` 与 `visited.bench`。

## 第三幕：世终之后维修台

标题：`04σ / 世终之后维修台 · POST-WORLD REPAIR BENCH`
图：`assets/v75-post-world-repair-bench.webp`

四座维修台围住中央空地：左上把故障零件周围的现实整块替换；右上让保修带逆时针延伸到出生以前；左下将自动机的裂口宣布为原厂特性；右下把末日地平线卷进账单机。四块热点清楚、不重叠、`≥44px`。

### 四项现实维修方案

| remedy | 按钮 | fragment |
|---|---|---|
| `replace-reality-not-part` | `替换现实而非零件 · REPLACE REALITY, NOT THE PART` | `维修员保留坏齿轮，把它周围的世界整体换新。新现实运转正常，只是再也容不下提出报修的你。` |
| `extend-warranty-before-birth` | `把保修延长到出生前 · EXTEND THE WARRANTY BEFORE BIRTH` | `保修带沿摇篮时钟逆行。你出生以前的所有损坏获得免费维修，出生本身因此被列为首次故障。` |
| `declare-defect-as-feature` | `宣布故障属于原厂特性 · DECLARE THE DEFECT A FEATURE` | `裂缝被点亮并写入原厂设计。机器无需修理，反而是完好无损的世界突然显得不符合规格。` |
| `bill-the-apocalypse` | `把账单寄给末日 · BILL THE APOCALYPSE` | `账单机卷入烧毁的地平线。末日拒绝付款，因为它声称毁掉世界只是按使用说明完成关机。` |

报修单 id 固定为 `defect:proof:remedy`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自带自由文本。

点击 remedy 后创建 warranty-claim pending，必须含固定 `source=post-world-repair-bench`，并转到 proof 对应旧场景。只在 target arrival 时原子执行：

- `serviceRuns +1`；
- 对应 `claimantTallies +1`；
- warrantyClaim 首次发现才进入图鉴；
- `lastOutcome` 更新；
- `activeAdjuster` 建立；
- draft 清空；
- pending 清空。

重复同一报修单不重复图鉴，但仍增加真实维修次数与故障票数。来源页刷新不能提前结算，目标页刷新不能重复结算。

## 三处旧场景亡后理赔员

| proof | 旧场景 | 返回按钮 | activeAdjuster feedback |
|---|---|---|---|
| `receipt-from-unbuilt-factory` | `threshold` | `跟空厂理赔员返回保修局 · RETURN WITH THE UNBUILT-FACTORY ADJUSTER` | `空厂理赔员在门槛上核对退货地址。门后没有工厂，只有一张比厂房更早衰老的收据。` |
| `dead-sun-warranty-seal` | `remembrance` | `跟死日理赔员返回保修局 · RETURN WITH THE DEAD-SUN ADJUSTER` | `死日理赔员把红蜡光环钉进痕迹墙。墙仍记得白昼，太阳却只记得自己正在等待换新。` |
| `descendant-repair-memory` | `unending-gallery` | `跟后忆理赔员返回保修局 · RETURN WITH THE DESCENDANT-MEMORY ADJUSTER` | `后忆理赔员在无尽画廊找到那次维修。每幅画都记得付款，唯独机器从未出现在任何画里。` |

activeAdjuster 只在准确 target 出现。返回后清 activeAdjuster，进入末日保修局。旧场景原有反馈、pending、图鉴、通知与入口不得被覆盖。

当 activeAdjuster 位于 `remembrance` 时，v75 普通入口与召回入口必须显示但 disabled；理赔员返回按钮可用。返回后两入口按 draft / pending / coverage 重新恢复，不能出现看似可点但 handler 静默拒绝的假按钮。

## 覆盖与世界总召回

`warrantyCoverageComplete()` 必须从规范 warrantyClaims 实时重算：

- 三种 defect 全覆盖；
- 三种 proof 全覆盖；
- 四种 remedy 全覆盖；
- 至少四份报修单。

覆盖可由四份代表报修单完成，三份永远不能覆盖四项 remedy。

覆盖完成后，痕迹室显示：

`召回整批已经售出的现实 · RECALL EVERY REALITY ALREADY SOLD`

进入 `#universal-recall-yard`。

标题：`04τ / 世界总召回场 · UNIVERSAL RECALL YARD`
图：`assets/v75-universal-recall-yard.webp`

### 三项世界售后裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `recall-the-world` | `把世界从流通中召回 · RECALL THE WORLD FROM CIRCULATION` | `the-world-was-recalled-from-circulation` | `threshold` | `裂开的世界沿退货带倒退回黑暗厂门。城市仍黏在表面，人们这才发现自己只是未拆封的随箱附件。` |
| `install-a-spare-dawn` | `给末日安装备用黎明 · INSTALL A SPARE DAWN IN THE APOCALYPSE` | `the-apocalypse-was-repaired-with-a-spare-dawn` | `remembrance` | `维修员把一枚备用黎明旋进破裂地平线。世界重新亮起，却只照见所有已经来不及活过的事。` |
| `void-for-self-modification` | `因现实擅自维修而作废 · VOID THE WARRANTY FOR REALITY'S SELF-MODIFICATION` | `existence-voided-its-own-warranty` | `unending-gallery` | `现实长出机械双手自行缝合裂口。局方当场撕毁保修，因为存在未经授权改变了自己原本的损坏状态。` |

每次合法 target arrival：`recallRuns +1`；outcome 首次进入 `recallOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 recallRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v75_apocalypse_warranty`
version：`75`

规范十一键，固定投影顺序：

```js
{
  version: 75,
  visited: { office: false, morgue: false, bench: false, yard: false },
  draft: { defect: '', proof: '' },
  warrantyClaims: [],
  recallOutcomes: [],
  serviceRuns: 0,
  recallRuns: 0,
  claimantTallies: { prebirth: 0, aftermath: 0, ghost: 0 },
  lastOutcome: '',
  activeAdjuster: null,
  pending: null
}
```

规范化要求：

- visited 精确投影四布尔；
- draft 精确投影两键，proof 非空时 defect 必须合法；
- warrantyClaims 按 `DEFECTS × PROOFS × REMEDIES` 固定表顺序去重；
- recallOutcomes 按三 action 固定顺序去重；
- serviceRuns / recallRuns 与三 claimantTallies 均 floor、clamp `0..9999`；
- lastOutcome 只能指向规范 warrantyClaims 或 recallOutcomes；
- activeAdjuster 只允许 `{proof,warrantyClaim,feedback}` 三键；warrantyClaim 必须已收集，proof 等于 warrantyClaim 第二段，feedback 必须由 proof 表逐字反算；
- 顶层多余键不得落盘；坏 JSON、坏 version、数组、null 或未解锁时 getter 返回默认态；
- v75 不写 v74 及任何旧 key。

## 七类 strict pending

所有 pending 必须 exact-key、逐字反算，额外键、缺键、错 source / target / feedback 均归 null。

1. `entry`：`{kind,target,feedback}`，target=`apocalypse-warranty-office`。
2. `defect`：`{kind,source,defect,target,feedback}`，source=`apocalypse-warranty-office`，target=`proof-of-purchase-morgue`。
3. `proof`：`{kind,source,defect,proof,target,feedback}`，source=`proof-of-purchase-morgue`，target=`post-world-repair-bench`。
4. `warranty-claim`：`{kind,source,defect,proof,remedy,warrantyClaim,target,feedback}`，source=`post-world-repair-bench`，target 由 proof 反算。
5. `adjuster-return`：`{kind,from,target,warrantyClaim,feedback}`，from 为三个旧场景之一并匹配 activeAdjuster.proof，target=`apocalypse-warranty-office`。
6. `recall-entry`：`{kind,target,feedback}`，coverage 完整，target=`universal-recall-yard`。
7. `recall`：`{kind,source,action,outcome,target,feedback}`，source=`universal-recall-yard`，逐表反算。

重播矩阵：

- target：立即 arrive，一次性结算并清 pending；
- source：恢复逐字反馈、锁定按钮与 aria-pressed，只排一次转场；
- else：清 pending，不结算、不转场；
- target reload 不重复增加 runs / tallies；
- source reload 不提前计数。

## 路由守卫与旧场景窄桥

- office：合法 entry / adjuster-return target，或 visited.office；
- morgue：合法 defect target，或 visited.morgue + 合法 draft.defect；
- bench：合法 proof target，或 visited.bench + 合法完整 draft；
- yard：coverage + 合法 recall-entry target，或 visited.yard；
- 三个旧 target 先服从各自既有准入语义；v75 只为合法规范化后的 warranty-claim / recall pending target 或匹配 activeAdjuster 增加必要的窄桥例外。
- `threshold`、`remembrance` 与 `unending-gallery` 不得收窄旧版本原有合法入口。
- 新窄桥不得顺带放宽 governance、v63、v72、v73、v74 或其他旧守卫；v75 pending / activeAdjuster 一旦失效，新增例外必须同步消失。

## UI / 图鉴 / 目录

痕迹室记忆行：

`末日保修局：已维修 N/36 份报修，共受理 R 次；故障 未产磨损 P / 世终不停 A / 幽灵零件 G；凭证 空厂收据 F / 死日封 S / 后忆 M；方案 换现实 R / 逆延保 B / 故障特性 D / 寄账末日 I；故障多数 Q；召回结局 O/3。`

图鉴新增 39 格：36 warrantyClaims + 3 recallOutcomes。未发现显示 `？？？`；发现后显示冻结标题与逐字 feedback。

目录新增四项：

- `04π / 末日保修局`
- `04ρ / 购买凭证停尸房`
- `04σ / 世终之后维修台`
- `04τ / 世界总召回场`

“遗忘全部”必须移除 v75 key，清 v75 AutoAdvance、draft、activeAdjuster、pending、反馈、disabled、aria-pressed，隐藏入口、记忆、39 格图鉴、目录与三处亡后理赔员；不写 v74。

## 交互防线

必须恰好 18 个 v75 click listener，首条语句均为 `if (!e.isTrusted) return;`：

- 普通入口 1；
- recall 入口 1；
- defect 3；
- proof 3；
- remedy 4；
- adjuster-return 3；
- recall 3。

choose 函数还要复查当前 scene、button visible / enabled、figure visible、draft / pending 条件。合成 click 必须零副作用，真实鼠标 / 键盘点击必须可玩。

## 素材合同

所有源 PNG 与运行时 WebP 均为 `1536×1024`，无文字、无 logo、无 UI、无水印，保持 Goddead 黑石 / 旧黄铜 / 灰白骨质 / 暗红封蜡视觉语言。WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP | 用途 |
|---|---|---|
| `design-references/source-v75-apocalypse-warranty-office.png`（1536×1024 / 3051978 B / `72f36d40f8402dc2e15cec8aed6ffb94af73694c54f677ab15a9497e8a43e686`） | `assets/v75-apocalypse-warranty-office.webp`（1536×1024 / 323406 B / `7ef497b9c735e27b39cea69767a326582cd4ac4a75c0552b49ddba48e30faf4b`） | 三项因果外故障 |
| `design-references/source-v75-proof-of-purchase-morgue.png`（1536×1024 / 2859466 B / `774e59a32e4fac005bf69aa10fdce1b673f27b47ad7c931392f785c5c4599322`） | `assets/v75-proof-of-purchase-morgue.webp`（1536×1024 / 287260 B / `4c80d4669029c428fb8040978a7024b98ca914764262d23c2762f08808e0f534`） | 三份不可能购买凭证 |
| `design-references/source-v75-post-world-repair-bench.png`（1536×1024 / 3150974 B / `af78f06c6725d9dca1a8b496401655e0f0d3b677a5c11413c96b1fca26f906bc`） | `assets/v75-post-world-repair-bench.webp`（1536×1024 / 355684 B / `b443db4cf69a3c11ea8f85ab06e72b2a84512c7d7c66e89c31ed731957916a13`） | 四项现实维修方案 |
| `design-references/source-v75-universal-recall-yard.png`（1536×1024 / 3141509 B / `94c27f3ea2dd3c3ea6fc846aae55d7bd32b0d7b8a4902f726f909211948b5f34`） | `assets/v75-universal-recall-yard.webp`（1536×1024 / 348490 B / `a2dacb3a8f13de748eaf0c271e967b8b91af014f479a457a635fff14fbf9abac`） | 三项世界售后裁定 |

## 静态测试门槛

- cache `v=75`；
- 133 场景、唯一 id / data-scene、四场景标题 / 路由 / preload / 目录；
- 4 source + 4 WebP 尺寸、sha256、bytes 与预算冻结；
- 解锁只读 v74，锁定四 direct hash 回 remembrance；
- 十一键 canonical state、坏 JSON / version / type、去重 / clamp / lastOutcome；
- 36 warrantyClaims 与 3 recallOutcomes 穷举；
- 七类 pending exact keys + 逐字反算 + source / target / else；
- source reload / target arrival / target reload / repeat run；
- 三处 activeAdjuster 直达、刷新、返回、清理与旧反馈共存；
- coverage 四份通过、三份失败；
- 路由窄桥不放宽旧守卫，也不收窄旧场景原有合法准入；
- 18 个 isTrusted listener 与合成点击零副作用；
- 忘记全部与 v74 回归。

## Codex 独立浏览器验收

1. v74 锁定态下四个 v75 hash 全回 remembrance；
2. 桌面 `1280×720` 与移动 `390×844` 四场景图片完整、热点 `≥44px`、无横溢；
3. defect → proof → remedy 逐步锁定与反馈逐字一致；
4. 代表报修目标结算、图鉴、计数、刷新幂等；
5. 三处亡后理赔员直达 / 刷新 / 返回；
6. remembrance activeAdjuster 时两入口 visible + disabled，返回可用；
7. coverage 三份失败、四份成功；
8. 三项召回代表结局与重复幂等；
9. 七类 pending source / target / else；
10. 坏存档回默认态；
11. 合成 click 无副作用、Chrome 真实 click 生效；
12. 全新页 console warn / error 为零。

## v76 活口

现实因擅自维修而失去保修后，所有仍然存在的东西都要求退回自己曾经支付的生命、姓名与时间。下一站开放：

`现实退款处 / REALITY REFUND COUNTER`

它将处理用童年购买的肉身、以遗忘支付的姓名、由死亡开具的退款理由，以及“如果存在从未符合描述，谁能把自己退回不存在”。
