# v73 梦境海关总署 / CUSTOMS OF BORROWED DREAMS

版本：v73 设计冻结稿
状态：已实现，Codex 独立浏览器验收通过（7880 assertions）
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

遗言中央银行把最后一句话变成货币后，死者终于能支付跨境费用，却立刻开始购买并不属于自己的梦。梦境海关因此成立：神死前没醒来的梦、未出生者提前做过的梦、未来证人倒寄回来的梦，都必须先证明自己有资格被谁梦见。

玩家依次选择：

1. 一份不可能的梦境护照；
2. 一件违禁梦物；
3. 一项噩梦关税；

形成 `3 × 3 × 4 = 36` 份梦境申报。每次放行后，一名梦检员停留在对应旧场景；三轴全部覆盖后，痕迹室开放清醒驱逐场，产生三条新结局。

## 解锁合同

v73 只读 v72，不写 v72 或更早状态。

`borrowedDreamCustomsUnlocked()` 必须同时满足：

- `lastWordBankUnlocked()` 为真；
- v72 instruments 覆盖三种 currency、三种 reserve、四种 policy；
- v72 `defaultOutcomes` 精确包含：
  - `every-last-word-was-nationalized`
  - `silence-set-the-interest-rate`
  - `death-became-too-big-to-fail`

任一前置缺失时，v73 getter 返回全新默认态，四个 v73 direct hash 全部归一到 `#remembrance`；入口、记忆、39 格图鉴、目录和三处梦检员全部隐藏。

## 新场景

1. `#borrowed-dream-customs`：梦境海关总署，选择三份梦境护照。
2. `#contraband-sleep-terminal`：违禁睡眠申报厅，选择三件违禁梦物。
3. `#nightmare-tariff-bureau`：噩梦关税局，选择四项梦境关税。
4. `#waking-deportation-yard`：清醒驱逐场，执行三项最终判决。

场景总数：`121 → 125`。

## 第一幕：梦境海关总署

标题：`04θ / 梦境海关总署 · CUSTOMS OF BORROWED DREAMS`
图：`assets/v73-borrowed-dream-customs.webp`

黑石大厅里竖着三道旧黄铜检查门。左侧睡眠面具压着一份出生前护照；中央暗玻璃箱关着会独自做梦的影子；右侧无头人台抱着一只从未来封回来的枕头。三块原生热点必须清楚、不重叠、桌面与移动端均 `≥44px`。

### 三份梦境护照

| passport | 按钮 | feedback | tally |
|---|---|---|---|
| `dead-god-dream-passport` | `申报神死前旧梦 · DECLARE THE GOD'S LAST UNWAKENED DREAM` | `护照签发于神死前一秒。照片里没有神，只有一场拒绝随祂醒来的梦。` | `god` |
| `unborn-child-sleep-visa` | `申报未生者睡签 · DECLARE THE UNBORN SLEEP VISA` | `空摇篮递来一张已经用旧的睡签。持有人尚未出生，却在梦里衰老过很多次。` | `unborn` |
| `future-witness-night-pass` | `申报未来证人夜证 · DECLARE THE FUTURE WITNESS NIGHT PASS` | `未来证人把夜证倒寄回来。海关尚未发生的印章已经盖住整张脸。` | `witness` |

选中 passport 后创建 pending，锁住三按钮，显示逐字反馈后进入 `#contraband-sleep-terminal`；只在 target arrival 时写入 `draft.passport` 与 `visited.terminal`。

## 第二幕：违禁睡眠申报厅

标题：`04ι / 违禁睡眠申报厅 · CONTRABAND SLEEP TERMINAL`
图：`assets/v73-contraband-sleep-terminal.webp`

三件梦物分别被关进暗玻璃与骨夹展柜：没有人看见过的脸、醒来以后仍继续发生的记忆、没有做梦者却先结束的结局。三块热点清楚、不重叠、`≥44px`。

### 三件违禁梦物

| contraband | 按钮 | feedback | target |
|---|---|---|---|
| `face-never-seen-awake` | `申报醒时未见之脸 · DECLARE THE FACE NEVER SEEN AWAKE` | `瓷脸只在闭眼时拥有五官。每次睁眼复核，海关照片都会重新变成空白。` | `eyelid-archive` |
| `memory-that-kept-dreaming` | `申报醒后续梦记忆 · DECLARE THE MEMORY THAT KEPT DREAMING` | `一间旧卧室被折进证物箱。你已经醒来，里面的童年却仍在替你睡觉。` | `remembrance` |
| `ending-without-a-dreamer` | `申报无梦者结局 · DECLARE THE ENDING WITHOUT A DREAMER` | `空帷幕先完成了一场梦的终局。没有任何人做过它，它却坚持有人必须醒来。` | `unending-gallery` |

选中 contraband 后进入 `#nightmare-tariff-bureau`；只在 target arrival 时写入 `draft.contraband` 与 `visited.bureau`。

## 第三幕：噩梦关税局

标题：`04κ / 噩梦关税局 · NIGHTMARE TARIFF BUREAU`
图：`assets/v73-nightmare-tariff-bureau.webp`

四座关税台横向展开：装满闭眼的清醒年沙漏、只剩枕头的梦者没收笼、送回死亡的棺形出口、庇护噩梦的骨帐。四块热点清楚、不重叠、`≥44px`。

### 四项噩梦关税

| tariff | 按钮 | fragment |
|---|---|---|
| `tax-years-awake` | `以清醒年岁征税 · TAX THE YEARS AWAKE` | `海关按你醒着的年份收税。每少睡一夜，梦就多拥有你一年。` |
| `confiscate-the-dreamer` | `没收做梦者 · CONFISCATE THE DREAMER` | `关员放行梦，却把做梦的人扣在枕头里。醒来的身体从此成为无人认领的行李。` |
| `reexport-to-death` | `把梦退运给死亡 · RE-EXPORT THE DREAM TO DEATH` | `梦被装进棺形包裹退回死亡。死亡拒收，因为它声称自己从来没有睡过。` |
| `grant-nightmare-asylum` | `给予噩梦庇护 · GRANT THE NIGHTMARE ASYLUM` | `噩梦取得庇护，不必再回到恐惧它的人脑内。做梦者反而失去进入自己黑夜的签证。` |

申报 id 固定为 `passport:contraband:tariff`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自带自由文本。

点击 tariff 后创建 declaration pending，必须含固定 `source=nightmare-tariff-bureau`，并转到 contraband 对应旧场景。只在 target arrival 时原子执行：

- `customsRuns +1`；
- 对应 `declarantTallies +1`；
- declaration 首次发现才进入图鉴；
- `lastOutcome` 更新；
- `activeInspector` 建立；
- draft 清空；
- pending 清空。

重复同一申报不重复图鉴，但仍增加真实申报次数与护照票数。来源页刷新不能提前结算，目标页刷新不能重复结算。

## 三处旧场景梦检员

| contraband | 旧场景 | 返回按钮 | activeInspector feedback |
|---|---|---|---|
| `face-never-seen-awake` | `eyelid-archive` | `跟闭目梦检员返回海关 · RETURN WITH THE CLOSED-EYE INSPECTOR` | `闭目梦检员在眼睑档案里核对那张脸。它每次睁眼都会忘记证物长什么样。` |
| `memory-that-kept-dreaming` | `remembrance` | `跟续梦梦检员返回海关 · RETURN WITH THE DREAMING-MEMORY INSPECTOR` | `续梦梦检员把卧室钉进痕迹墙。房间仍在睡，墙上的你却已经醒了很多年。` |
| `ending-without-a-dreamer` | `unending-gallery` | `跟终局梦检员返回海关 · RETURN WITH THE DREAMLESS-ENDING INSPECTOR` | `终局梦检员从无尽画廊带回空帷幕。所有结局都承认见过它，没有一个承认做过那场梦。` |

activeInspector 只在准确 target 出现。返回后清 activeInspector，进入梦境海关总署。旧场景原有反馈、pending、图鉴、通知与入口不得被覆盖。

当 activeInspector 位于 `remembrance` 时，v73 普通入口与驱逐入口必须显示但 disabled；梦检员返回按钮可用。返回后两入口按 draft / pending / coverage 重新恢复，不能出现看似可点但 handler 静默拒绝的假按钮。

## 覆盖与清醒驱逐

`dreamCustomsCoverageComplete()` 必须从规范 declarations 实时重算：

- 三种 passport 全覆盖；
- 三种 contraband 全覆盖；
- 四种 tariff 全覆盖；
- 至少四份申报。

覆盖可由四份代表申报完成，三份永远不能覆盖四项 tariff。

覆盖完成后，痕迹室显示：

`把所有清醒者驱逐出梦境 · DEPORT EVERY WAKING SOUL FROM THE DREAM`

进入 `#waking-deportation-yard`。

标题：`04λ / 清醒驱逐场 · WAKING DEPORTATION YARD`
图：`assets/v73-waking-deportation-yard.webp`

### 三项驱逐判决

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `naturalize-every-nightmare` | `让所有噩梦成为公民 · NATURALIZE EVERY NIGHTMARE` | `nightmares-became-the-only-citizens` | `remembrance` | `海关撤销美梦的国籍。噩梦成为唯一合法居民，因为只有它们从不假装醒来会更好。` |
| `deport-the-dreamer` | `把做梦者驱逐出梦 · DEPORT THE DREAMER FROM THE DREAM` | `the-dreamer-was-deported-from-the-dream` | `eyelid-archive` | `窄床沿黄铜轨道越过边境。梦留在原地继续生活，做梦的人被遣返到一具从未睡过的身体。` |
| `criminalize-waking` | `把清醒列为违禁品 · CRIMINALIZE WAKING` | `waking-became-contraband` | `threshold` | `第一束清醒的光被关进海关笼。门外的人仍能睁眼，却必须走私每一个早晨。` |

每次合法 target arrival：`deportationRuns +1`；outcome 首次进入 `deportationOutcomes`；`lastOutcome` 更新；pending 清空。重复判决仍增加 deportationRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v73_dream_customs`
version：`73`

规范十一键，固定投影顺序：

```js
{
  version: 73,
  visited: { customs: false, terminal: false, bureau: false, yard: false },
  draft: { passport: '', contraband: '' },
  declarations: [],
  deportationOutcomes: [],
  customsRuns: 0,
  deportationRuns: 0,
  declarantTallies: { god: 0, unborn: 0, witness: 0 },
  lastOutcome: '',
  activeInspector: null,
  pending: null
}
```

规范化要求：

- visited 精确投影四布尔；
- draft 精确投影两键，contraband 非空时 passport 必须合法；
- declarations 按 `PASSPORTS × CONTRABAND × TARIFFS` 固定表顺序去重；
- deportationOutcomes 按三 action 固定顺序去重；
- customsRuns / deportationRuns 与三 declarantTallies 均 floor、clamp `0..9999`；
- lastOutcome 只能指向规范 declarations 或 deportationOutcomes；
- activeInspector 只允许 `{contraband,declaration,feedback}` 三键；declaration 必须已收集，contraband 等于 declaration 第二段，feedback 必须由 contraband 表逐字反算；
- 顶层多余键不得落盘；坏 JSON、坏 version、数组、null 或未解锁时 getter 返回默认态；
- v73 不写 v72 及任何旧 key。

## 七类 strict pending

所有 pending 必须 exact-key、逐字反算，额外键、缺键、错 source / target / feedback 均归 null。

1. `entry`：`{kind,target,feedback}`，target=`borrowed-dream-customs`。
2. `passport`：`{kind,source,passport,target,feedback}`，source=`borrowed-dream-customs`，target=`contraband-sleep-terminal`。
3. `contraband`：`{kind,source,passport,contraband,target,feedback}`，source=`contraband-sleep-terminal`，target=`nightmare-tariff-bureau`。
4. `declaration`：`{kind,source,passport,contraband,tariff,declaration,target,feedback}`，source=`nightmare-tariff-bureau`，target 由 contraband 反算。
5. `inspector-return`：`{kind,from,target,declaration,feedback}`，from 为三个旧场景之一并匹配 activeInspector.contraband，target=`borrowed-dream-customs`。
6. `deportation-entry`：`{kind,target,feedback}`，coverage 完整，target=`waking-deportation-yard`。
7. `deportation`：`{kind,source,action,outcome,target,feedback}`，source=`waking-deportation-yard`，逐表反算。

重播矩阵：

- target：立即 arrive，一次性结算并清 pending；
- source：恢复逐字反馈、锁定按钮与 aria-pressed，只排一次转场；
- else：清 pending，不结算、不转场；
- target reload 不重复增加 runs / tallies；
- source reload 不提前计数。

## 路由守卫与旧场景窄桥

- customs：合法 entry / inspector-return target，或 visited.customs；
- terminal：合法 passport target，或 visited.terminal + 合法 draft.passport；
- bureau：合法 contraband target，或 visited.bureau + 合法完整 draft；
- yard：coverage + 合法 deportation-entry target，或 visited.yard；
- 四个旧 target 先服从各自既有准入语义；v73 只为合法规范化后的 declaration / deportation pending target 或匹配 activeInspector 增加必要的窄桥例外。
- `eyelid-archive` 沿用 v32 的直接准入，v73 不得反向把它锁住；`remembrance`、`unending-gallery` 与 `threshold` 也不得收窄旧版本原有合法入口。
- 新窄桥不得顺带放宽 governance、v63、v72 或其他旧守卫；v73 pending / activeInspector 一旦失效，新增例外必须同步消失。

## UI / 图鉴 / 目录

痕迹室记忆行：

`梦境海关：已放行 N/36 份申报，共查验 R 次；护照 神梦 G / 未生 U / 未来 W；违禁物 空脸 F / 续忆 M / 无梦终局 E；关税 清醒年 Y / 没收人 C / 退死亡 D / 庇噩梦 A；梦籍多数 Q；驱逐结局 O/3。`

图鉴新增 39 格：36 declarations + 3 deportationOutcomes。未发现显示 `？？？`；发现后显示冻结标题与逐字 feedback。

目录新增四项：

- `04θ / 梦境海关总署`
- `04ι / 违禁睡眠申报厅`
- `04κ / 噩梦关税局`
- `04λ / 清醒驱逐场`

“遗忘全部”必须移除 v73 key，清 v73 AutoAdvance、draft、activeInspector、pending、反馈、disabled、aria-pressed，隐藏入口、记忆、39 格图鉴、目录与三处梦检员；不写 v72。

## 交互防线

必须恰好 18 个 v73 click listener，首条语句均为 `if (!e.isTrusted) return;`：

- 普通入口 1；
- deportation 入口 1；
- passport 3；
- contraband 3；
- tariff 4；
- inspector-return 3；
- deportation 3。

choose 函数还要复查当前 scene、button visible / enabled、figure visible、draft / pending 条件。合成 click 必须零副作用，真实鼠标 / 键盘点击必须可玩。

## 素材合同

所有源 PNG 与运行时 WebP 均为 `1536×1024`，无文字、无 logo、无 UI、无水印，保持 Goddead 黑石 / 旧黄铜 / 灰白骨质 / 暗红封蜡视觉语言。WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP | 用途 |
|---|---|---|
| `design-references/source-v73-borrowed-dream-customs.png`（1536×1024 / 2539563 B / `738414b950fb492253019ab0f35201d4c511892ae04dea8c8c9d00ff16224bbd`） | `assets/v73-borrowed-dream-customs.webp`（1536×1024 / 200942 B / `81fbee15aaa63eadc44c7ec6f06ed6e7178030621fe365a3d823aeca5488fa84`） | 三份梦境护照 |
| `design-references/source-v73-contraband-sleep-terminal.png`（1536×1024 / 2732780 B / `fbf1da2086bac771f6ffc433b5da418b43ab123222d70efafc9b044a18220403`） | `assets/v73-contraband-sleep-terminal.webp`（1536×1024 / 220610 B / `dfef4c98188c3333f274643d24e44efd22031b712b777122b0883c6a2d074ded`） | 三件违禁梦物 |
| `design-references/source-v73-nightmare-tariff-bureau.png`（1536×1024 / 2671210 B / `a1e14c225b7776046bc91f41bef595e0454c2c6813d277a68c69e9f122b3ff38`） | `assets/v73-nightmare-tariff-bureau.webp`（1536×1024 / 248168 B / `fe4c555f1ae73b8f49dc134f2a9a6310d4232d1b34096aec45827ef010283775`） | 四项噩梦关税 |
| `design-references/source-v73-waking-deportation-yard.png`（1536×1024 / 2933922 B / `c0bc02b95980bed5e46e1d0c936cf98ad134ea47db5ff3fe5031a997c94b81ab`） | `assets/v73-waking-deportation-yard.webp`（1536×1024 / 274492 B / `3450ba5d4693d5c993ad689a69fb4c573e846cf181d4cba1d5e2499bde047bec`） | 三项清醒驱逐 |

## 静态测试门槛

- cache `v=73`；
- 125 场景、唯一 id / data-scene、四场景标题 / 路由 / preload / 目录；
- 4 source + 4 WebP 尺寸、sha256、bytes 与预算冻结；
- 解锁只读 v72，锁定四 direct hash 回 remembrance；
- 十一键 canonical state、坏 JSON / version / type、去重 / clamp / lastOutcome；
- 36 declarations 与 3 deportationOutcomes 穷举；
- 七类 pending exact keys + 逐字反算 + source / target / else；
- source reload / target arrival / target reload / repeat run；
- 三处 activeInspector 直达、刷新、返回、清理与旧反馈共存；
- coverage 四份通过、三份失败；
- 路由窄桥不放宽旧守卫，也不收窄 v32 `eyelid-archive` 等旧场景原有合法准入；
- 18 个 isTrusted listener 与合成点击零副作用；
- 忘记全部与 v72 回归。

## Codex 独立浏览器验收

1. v72 锁定态下四个 v73 hash 全回 remembrance；
2. 桌面 `1280×720` 与移动 `390×844` 四场景图片完整、热点 `≥44px`、无横溢；
3. passport → contraband → tariff 逐步锁定与反馈逐字一致；
4. 代表申报目标结算、图鉴、计数、刷新幂等；
5. 三处梦检员直达 / 刷新 / 返回；
6. remembrance activeInspector 时两入口 visible + disabled，返回可用；
7. coverage 三份失败、四份成功；
8. 三项驱逐代表结局与重复幂等；
9. 七类 pending source / target / else；
10. 坏存档回默认态；
11. 合成 click 无副作用、Chrome 真实 click 生效；
12. 全新页 console warn / error 为零。

## v74 活口

清醒被列为违禁品后，梦境海关查获大量“从未被发明、却已经在梦里使用过”的器物。下一站开放：

`墓碑专利局 / PATENT OFFICE OF THE UNBURIED`

它将审理未出生发明人、死后先例、被未来抄袭的原型，以及“谁有权拥有一件从未存在过的东西”。
