# v77 自我真伪鉴定所 / AUTHENTICITY OFFICE OF THE SELF

版本：v77 设计冻结稿
状态：设计与素材冻结，待 v76 独立验收后交 Kimi 实装
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

现实承认虚假宣传后，每一种“可能的自己”都拿着同一张换货单出现。原装人格声称第一道伤口就是防伪印；替换记忆拿出另一个童年；仿制灵魂则指出，所谓原装不过是最早成功骗过检验的赝品。

玩家依次选择：

1. 一种要求被承认为原装的自我；
2. 一份自我来源凭证；
3. 一种会改变真伪定义的鉴定方法；

形成 `3 × 3 × 4 = 36` 份自我鉴定证书。每次鉴定后，一名亡后鉴定员停留在对应旧场景；三轴全部覆盖后，等同自我终审庭开放，产生三条新的真实性结局。

## 解锁合同

v77 只读 v76，不写 v76 或更早状态。

`selfAuthenticityOfficeUnlocked()` 必须同时满足：

- `realityRefundCounterUnlocked()` 为真；
- v76 refundCases 覆盖三种 subject、三种 proof、四种 remedy；
- v76 `classOutcomes` 精确包含：
  - `all-existence-was-refunded-to-the-void`
  - `every-body-was-refunded-to-childhood`
  - `reality-admitted-it-never-matched-description`

任一前置缺失时，v77 getter 返回全新默认态，四个 v77 direct hash 全部归一到 `#remembrance`；入口、记忆、39 格图鉴、目录和三处亡后鉴定员全部隐藏。

## 新场景

1. `#self-authenticity-office`：自我真伪鉴定所，选择三种候选自我。
2. `#self-provenance-vault`：自我来源凭证库，选择三份来源证据。
3. `#soul-counterfeit-examination`：灵魂赝品检验室，选择四项鉴定方法。
4. `#final-authenticity-tribunal`：等同自我终审庭，执行三项最终裁定。

场景总数：`137 → 141`。

## 第一幕：自我真伪鉴定所

标题：`04ω / 自我真伪鉴定所 · AUTHENTICITY OFFICE OF THE SELF`
图：`assets/v77-authenticity-office-of-self.webp`

三座鉴定席横向展开。左侧骨白人壳胸前嵌着第一道伤口，身后陈列许多更旧的面具；中央玻璃匣中的童年房间被记忆胶片重复播放；右侧暗红蜡灵魂与黄铜肋骨共同坐在一排无编号复制品前。三块热点清楚、不重叠、桌面与移动端均 `≥44px`。

### 三种候选自我

| claimant | 按钮 | feedback | tally |
|---|---|---|---|
| `original-personality` | `鉴定原装人格 · AUTHENTICATE THE ORIGINAL PERSONALITY` | `它把第一道伤口按在鉴定盘上。伤口比记忆更老，却无法证明受伤之前坐在身体里的是谁。` | `original` |
| `replacement-memory` | `鉴定替换记忆 · AUTHENTICATE THE REPLACEMENT MEMORY` | `另一段童年从胶片匣里走出来。它记得你没有经历过的一切，也记得自己一直被你忘记。` | `memory` |
| `counterfeit-soul` | `鉴定仿制灵魂 · AUTHENTICATE THE COUNTERFEIT SOUL` | `暗红蜡灵魂在黄铜肋骨里呼吸。它没有编号，却能逐字背出原装灵魂从未承认过的恐惧。` | `soul` |

选中 claimant 后创建 pending，锁住三按钮，显示逐字反馈后进入 `#self-provenance-vault`；只在 target arrival 时写入 `draft.claimant` 与 `visited.vault`。

## 第二幕：自我来源凭证库

标题：`05α / 自我来源凭证库 · PROVENANCE VAULT OF THE SELF`
图：`assets/v77-self-provenance-vault.webp`

凭证库陈列三份来源：玻璃罩中的第一道伤口，连着黄铜时间针；童年镜面映出与镜前不同的成年人；仍带余温的死后面模，接着一颗不会停的机械心。三块热点清楚、不重叠、`≥44px`。

### 三份自我来源凭证

| provenance | 按钮 | feedback | target |
|---|---|---|---|
| `first-wound-seal` | `提交第一伤口封印 · SUBMIT THE FIRST-WOUND SEAL` | `封印把伤口追溯到所有记忆之前。它证明身体曾被某个自我打开，却没有留下开封者的姓名。` | `scar-loom` |
| `childhood-mirror-testimony` | `提交童年镜证 · SUBMIT THE CHILDHOOD MIRROR TESTIMONY` | `镜中的孩子抬头看见另一个成年人。两边都坚持对方才是后来被替换进去的版本。` | `borrowed-childhood` |
| `warm-death-mask-cast` | `提交余温死面模 · SUBMIT THE WARM DEATH-MASK CAST` | `死后面模仍在发热。它完整复制最后一张脸，却无法说明温度属于死者、模具，还是正在佩戴它的你。` | `lifetime-pawn-vault` |

选中 provenance 后进入 `#soul-counterfeit-examination`；只在 target arrival 时写入 `draft.provenance` 与 `visited.examination`。

## 第三幕：灵魂赝品检验室

标题：`05β / 灵魂赝品检验室 · SOUL COUNTERFEIT EXAMINATION`
图：`assets/v77-soul-counterfeit-examination.webp`

四座检验台分据四角：左上黄铜压机把人格印进骨片；左下记忆溶剂池显出多层互斥童年；右上幽灵天平称量蜡灵魂与影子的差值；右下炉室用肋骨与空面具培育一个足以骗过本人的仿制自我。四块热点清楚、不重叠、`≥44px`。

### 四项真伪鉴定方法

| method | 按钮 | fragment |
|---|---|---|
| `certify-earliest-version` | `认证最早版本 · CERTIFY THE EARLIEST VERSION` | `档案员把最早出现的自我盖成原装。更早的空白立刻提出异议，因为它曾在所有人格之前占用这具身体。` |
| `compare-memories-to-scars` | `用伤口核对记忆 · COMPARE MEMORIES AGAINST SCARS` | `每段记忆被逐一贴上对应伤口。没有伤的记忆被判伪，有伤却无人记得的年月反而取得合法身份。` |
| `let-the-copy-identify-original` | `让复制品指认原装 · LET THE COPY IDENTIFY THE ORIGINAL` | `仿制灵魂毫不犹豫地指向你。它说只有原装才会如此害怕自己其实复制得不够好。` |
| `declare-authenticity-transferable` | `宣布真实性可转让 · DECLARE AUTHENTICITY TRANSFERABLE` | `原装资格从一具自我过户到另一具。每次转让都完全合法，直到所有版本都同时持有唯一真品证。` |

证书 id 固定为 `claimant:provenance:method`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自带自由文本。

点击 method 后创建 certificate pending，必须含固定 `source=soul-counterfeit-examination`，并转到 provenance 对应旧场景。只在 target arrival 时原子执行：

- `examRuns +1`；
- 对应 `claimantTallies +1`；
- certificate 首次发现才进入图鉴；
- `lastOutcome` 更新；
- `activeAuthenticator` 建立；
- draft 清空；
- pending 清空。

重复同一证书不重复图鉴，但仍增加真实鉴定次数与候选票数。来源页刷新不能提前结算，目标页刷新不能重复结算。

## 三处旧场景亡后鉴定员

| provenance | 旧场景 | 返回按钮 | activeAuthenticator feedback |
|---|---|---|---|
| `first-wound-seal` | `scar-loom` | `跟伤印鉴定员返回所内 · RETURN WITH THE FIRST-WOUND AUTHENTICATOR` | `伤印鉴定员在疤痕织机上找到第一根线。它连接所有版本，却没有一端肯承认自己是起点。` |
| `childhood-mirror-testimony` | `borrowed-childhood` | `跟镜证鉴定员返回所内 · RETURN WITH THE CHILDHOOD-MIRROR AUTHENTICATOR` | `镜证鉴定员在借来童年室同时见到两个你。一个从未长大，另一个从未真正小时候。` |
| `warm-death-mask-cast` | `lifetime-pawn-vault` | `跟死面鉴定员返回所内 · RETURN WITH THE WARM-MASK AUTHENTICATOR` | `死面鉴定员在寿命典当库测量余温。每多活一年，面模就比你的脸更像原装。` |

activeAuthenticator 只在准确 target 出现。返回后清 activeAuthenticator，进入自我真伪鉴定所。旧场景原有反馈、pending、图鉴、通知与入口不得被覆盖。

## 覆盖与等同自我终审

`selfAuthenticityCoverageComplete()` 必须从规范 certificates 实时重算：

- 三种 claimant 全覆盖；
- 三种 provenance 全覆盖；
- 四种 method 全覆盖；
- 至少四份证书。

覆盖可由四份代表证书完成，三份永远不能覆盖四项 method。

覆盖完成后，痕迹室显示：

`裁定哪一个自己有权继续说“我” · DECIDE WHICH SELF MAY KEEP SAYING I`

进入 `#final-authenticity-tribunal`。

标题：`05γ / 等同自我终审庭 · FINAL TRIBUNAL OF IDENTICAL SELVES`
图：`assets/v77-final-authenticity-tribunal.webp`

### 三项真实性裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `recognize-one-original` | `只承认一个原装 · RECOGNIZE A SINGLE ORIGINAL` | `one-self-became-the-only-original` | `blank-name-cloakroom` | `黄铜拱架挑出唯一面具。其余版本当场失去姓名，获选者却想不起自己为何比它们更真。` |
| `merge-every-possible-self` | `合并所有可能的自己 · MERGE EVERY POSSIBLE SELF` | `all-possible-selves-merged-into-one` | `remembrance` | `圆镜把每一种可能压进同一张脸。新自我拥有全部记忆，也同时确信每一段都发生在别人身上。` |
| `make-every-copy-an-original` | `让每个复制品成为原装 · MAKE EVERY COPY AN ORIGINAL` | `every-copy-became-an-original` | `unending-gallery` | `红蜡压机把唯一真品印分给所有面具。赝品从此消失，因为世界再也没有足够假的东西可作比较。` |

每次合法 target arrival：`tribunalRuns +1`；outcome 首次进入 `tribunalOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 tribunalRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v77_self_authenticity`
version：`77`

规范十一键，固定投影顺序：

```js
{
  version: 77,
  visited: { office: false, vault: false, examination: false, tribunal: false },
  draft: { claimant: '', provenance: '' },
  certificates: [],
  tribunalOutcomes: [],
  examRuns: 0,
  tribunalRuns: 0,
  claimantTallies: { original: 0, memory: 0, soul: 0 },
  lastOutcome: '',
  activeAuthenticator: null,
  pending: null
}
```

规范化要求：

- visited 精确投影四布尔；
- draft 精确投影两键，provenance 非空时 claimant 必须合法；
- certificates 按 `CLAIMANTS × PROVENANCES × METHODS` 固定表顺序去重；
- tribunalOutcomes 按三 action 固定顺序去重；
- examRuns / tribunalRuns 与三 claimantTallies 均 floor、clamp `0..9999`；
- lastOutcome 只能指向规范 certificates 或 tribunalOutcomes；
- activeAuthenticator 只允许 `{provenance,certificate,feedback}` 三键；certificate 必须已收集，provenance 等于 certificate 第二段，feedback 必须由 provenance 表逐字反算；
- 顶层多余键不得落盘；坏 JSON、坏 version、数组、null 或未解锁时 getter 返回默认态；
- v77 不写 v76 及任何旧 key。

## 七类 strict pending

所有 pending 必须 exact-key、逐字反算，额外键、缺键、错 source / target / feedback 均归 null。

1. `entry`：`{kind,target,feedback}`，target=`self-authenticity-office`。
2. `claimant`：`{kind,source,claimant,target,feedback}`，source=`self-authenticity-office`，target=`self-provenance-vault`。
3. `provenance`：`{kind,source,claimant,provenance,target,feedback}`，source=`self-provenance-vault`，target=`soul-counterfeit-examination`。
4. `certificate`：`{kind,source,claimant,provenance,method,certificate,target,feedback}`，source=`soul-counterfeit-examination`，target 由 provenance 反算。
5. `authenticator-return`：`{kind,from,target,certificate,feedback}`，from 为三个旧场景之一并匹配 activeAuthenticator.provenance，target=`self-authenticity-office`。
6. `tribunal-entry`：`{kind,target,feedback}`，coverage 完整，target=`final-authenticity-tribunal`。
7. `tribunal`：`{kind,source,action,outcome,target,feedback}`，source=`final-authenticity-tribunal`，逐表反算。

重播矩阵：target 立即 arrive 并一次性结算；source 恢复反馈、锁按钮且只排一次转场；else 清 pending；target reload 不重复增加；source reload 不提前计数。

## 路由守卫、UI 与交互防线

- office：合法 entry / authenticator-return target，或 visited.office；
- vault：合法 claimant target，或 visited.vault + 合法 draft.claimant；
- examination：合法 provenance target，或 visited.examination + 合法完整 draft；
- tribunal：coverage + 合法 tribunal-entry target，或 visited.tribunal；
- 三个旧 target 只增加合法 certificate / tribunal pending 或 activeAuthenticator 的窄桥，不收窄旧准入，不放宽任何其他守卫。

痕迹室记忆行：

`自我鉴定所：已认证 N/36 份证书，共检验 R 次；候选 原格 O / 替忆 M / 仿魂 S；来源 首伤 W / 童镜 C / 死面 D；方法 最早 E / 伤忆 R / 复制指认 I / 真伪转让 T；自我多数 Q；终审结局 X/3。`

图鉴新增 39 格，目录新增四项 `04ω / 05α / 05β / 05γ`。遗忘全部必须移除 v77 key，并清理 v77 AutoAdvance、draft、activeAuthenticator、pending、反馈、disabled、aria-pressed、入口、记忆、图鉴、目录与三处鉴定员；不写 v76。

必须恰好 18 个 v77 click listener，首条语句均为 `if (!e.isTrusted) return;`：普通入口 1、tribunal 入口 1、claimant 3、provenance 3、method 4、authenticator-return 3、tribunal 3。choose 函数复查 scene、button / figure、draft / pending。合成 click 零副作用，真实鼠标 / 键盘可玩。

## 素材合同

所有源 PNG 与 WebP 为 `1536×1024`，无文字、logo、UI、水印。WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP | 用途 |
|---|---|---|
| `design-references/source-v77-authenticity-office-of-self.png`（2440259 B / `8ff4ee726ed821dd3d17f0c9a1238b79b974748ec803a848ed71f863e753bd3c`） | `assets/v77-authenticity-office-of-self.webp`（210352 B / `900e54e45087aa6411e5f8b7f16d34c1a9e54978b7f55f95a4992d3aec64c2c4`） | 三种候选自我 |
| `design-references/source-v77-self-provenance-vault.png`（2501992 B / `9bd33aca1362c3101258a904c3cf69b013bdce293acc6e6f9bd3df292e118bb8`） | `assets/v77-self-provenance-vault.webp`（213842 B / `0d08373b83c8fbf505b374158f8e7a07e7f6a205f4a4cfc5289d7c31862ceefe`） | 三份来源凭证 |
| `design-references/source-v77-soul-counterfeit-examination.png`（2569234 B / `e0ef74ae18031ba9956d1700782833c87fb88076e65aafba974d89e0c3ec9557`） | `assets/v77-soul-counterfeit-examination.webp`（230094 B / `1ef256e317c6443ae170a75aa04af05c94e21f2d4330641fab104bc1fb4933d6`） | 四项鉴定方法 |
| `design-references/source-v77-final-authenticity-tribunal.png`（2669415 B / `fe5a7fcae730c9c6a8a23fe7a1a59046b6ad446e472fe73a24d3a6707c008567`） | `assets/v77-final-authenticity-tribunal.webp`（253726 B / `f40f3a1c80f2a32e21a2bb625f7db4ef8dbf8c5ee37577bb6c6aa9ea71997228`） | 三项真实性裁定 |

## 静态与浏览器门槛

- cache `v=77`，141 场景，四幕标题 / 路由 / preload / 目录；
- 8 素材尺寸、sha、bytes 冻结；
- 解锁只读 v76，锁态四 hash 回 remembrance；
- 十一键规范化、36+3 穷举、七 pending、三 activeAuthenticator、四份 coverage、18 isTrusted、forget-all 与 v76 回归；
- Codex 浏览器需验桌面 1280×720、手机 390×844、真实三段点击、三个旧场景回程、四份 coverage、三终审、重载幂等、坏存档、console 0。

## v78 活口

所有复制品取得原装资格后，世界出现了太多同时合法的“我”。下一站开放：

`第一人称配给署 / FIRST-PERSON PRONOUN RATIONING BUREAU`

它将决定谁每天可以说几次“我”，并追问：当第一人称成为稀缺资源，沉默是否比人格更真实。
