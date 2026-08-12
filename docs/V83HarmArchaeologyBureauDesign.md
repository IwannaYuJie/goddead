# v83 伤害考古局 / BUREAU OF HARM ARCHAEOLOGY

版本：v83 设计冻结稿
状态：设计与素材冻结，待 v82 实装并独立验收后交 Kimi 实装
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

宽恕填埋场允许伤害活过原谅，却剥走了疼痛、索赔与继续统治当事人的资格。伤害考古局因此接管这些“已经无害”的遗址：调查员从闭合疤痕里复原开口，从归零账簿里刮回债主，从无罪土层里筛出被遗忘的原因。

问题不再是伤害有没有发生，而是：如果真相只能靠重新制造疼痛才能被证明，调查本身是否已经成为第二次伤害？

玩家依次选择：

1. 一处被宽恕覆盖的遗址；
2. 一种会重新赋予证据重量的发掘工具；
3. 一项决定“真相由谁制造”的考古解释；

形成 `3 × 3 × 4 = 36` 份伤害发掘报告。每份报告会把一名现场复原员派往对应旧场景；三轴覆盖后，二次伤害听证庭开放，产生三条新结局。

## 解锁合同

v83 只读 v82，不写 v82 或更早状态。

`harmArchaeologyUnlocked()` 必须同时满足：

- `forgivenessLandfillUnlocked()` 为真；
- v82 disposals 覆盖三种 waste、三种 certificate、四种 disposal；
- v82 `wellOutcomes` 精确包含：
  - `every-forgiven-harm-was-sealed-forever`
  - `the-need-for-forgiveness-was-erased`
  - `harm-outlived-its-own-forgiveness`

前置不完整时 getter 返回默认态；四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录、三处复原员全部隐藏。

## 新场景

1. `#harm-archaeology-bureau`：伤害考古局，选择三处宽恕遗址。
2. `#forensic-mercy-excavation`：慈悲法证发掘坑，选择三种发掘工具。
3. `#crime-scene-without-offender`：无加害者犯罪现场，选择四项考古解释。
4. `#second-harm-hearing-court`：二次伤害听证庭，执行三项最终裁定。

场景总数：`161 → 165`。

## 第一幕：伤害考古局

标题：`05ω / 伤害考古局 · BUREAU OF HARM ARCHAEOLOGY`
图：`assets/v83-harm-archaeology-bureau.webp`

三座发掘台横向展开：左侧保存一枚已经闭合、拒绝再次疼痛的透明疤痕；中央骨白账簿余额为零，旧笔迹却在纸纤维下移动；右侧无罪土层长满洁白植物，根部压着一圈被剪断的因果链。热点不重叠，桌面与移动端均 `≥44px`。

### 三处宽恕遗址

| site | 按钮 | feedback | tally |
|---|---|---|---|
| `closed-scar-site` | `发掘已经闭合的疤痕 · EXCAVATE THE CLOSED SCAR` | `疤痕拒绝张开。考古员只好沿愈合纹路倒着切入，像把一句已经说完的话重新拆回尖叫。` | `scar` |
| `zeroed-ledger-site` | `发掘已经归零的账簿 · EXCAVATE THE ZEROED LEDGER` | `账页没有余额，纸纤维却仍朝某个旧债主弯曲。数字消失以后，债的姿势还留在材料里。` | `ledger` |
| `innocent-soil-site` | `发掘已经无罪的土层 · EXCAVATE THE INNOCENT SOIL` | `白色根系宣称这里从未发生过伤害。铲尖落下时，每一粒土却都本能地避开同一个名字。` | `soil` |

选中 site 后创建 pending，逐字显示反馈并进入 `#forensic-mercy-excavation`；只在 target arrival 写入 `draft.site` 与 `visited.excavation`。

## 第二幕：慈悲法证发掘坑

标题：`06α / 慈悲法证发掘坑 · FORENSIC EXCAVATION OF MERCY`
图：`assets/v83-forensic-mercy-excavation.webp`

发掘坑陈列三件互相矛盾的工具：会让旧痛短暂复燃的黄铜神经刷；从土中筛回责任方向的黑色花粉筛；把缺席目击者浇铸成骨白负形的证词模具。

### 三种发掘工具

| instrument | 按钮 | feedback | target |
|---|---|---|---|
| `pain-reconstruction-brush` | `使用疼痛复原刷 · USE THE PAIN RECONSTRUCTION BRUSH` | `细刷没有触碰肉身，却让遗址记起当时应该怎样疼。复原越精确，当事人越像一份被强迫重演的标本。` | `threshold` |
| `responsibility-pollen-sieve` | `使用责任花粉筛 · USE THE RESPONSIBILITY POLLEN SIEVE` | `黑色花粉穿过筛网，全部飘向同一个空位。责任恢复了方向，却没有恢复一个可以承担它的人。` | `liability-ledger` |
| `missing-witness-cast` | `使用缺席目击模具 · USE THE MISSING-WITNESS CAST` | `骨白石膏填满证人从未站过的位置。凝固后，缺席获得了面孔，并开始描述自己没有看见的现场。` | `causeless-ward` |

选中 instrument 后进入 `#crime-scene-without-offender`；只在 target arrival 写入 `draft.instrument` 与 `visited.scene`。

## 第三幕：无加害者犯罪现场

标题：`06β / 无加害者犯罪现场 · CRIME SCENE WITHOUT AN OFFENDER`
图：`assets/v83-crime-scene-without-offender.webp`

四座解释装置围住中央空轮廓：左上证明加害者从未存在；右上证明发掘制造了它声称发现的真相；左下把伤口解释为某人的不在场证明；右下把档案本身列为第二名加害者。

### 四项考古解释

| interpretation | 按钮 | fragment |
|---|---|---|
| `the-offender-never-existed` | `裁定加害者从未存在 · RULE THAT THE OFFENDER NEVER EXISTED` | `现场拥有伤口、时间与因果，却找不到任何人站在行为发生的位置。报告因此认定：伤害完整发生了，加害者只是世界后来为了方便追责而虚构的语法。` |
| `excavation-created-the-truth` | `裁定发掘制造了真相 · RULE THAT EXCAVATION CREATED THE TRUTH` | `每一铲都发现与铲形完全吻合的证据。调查员终于承认，遗址没有回答问题；它只是被迫长成提问者预先相信的样子。` |
| `the-wound-was-an-alibi` | `裁定伤口是不在场证明 · RULE THAT THE WOUND WAS AN ALIBI` | `伤口证明某件事发生过，也同时替所有可能的加害者证明自己不在场。疼痛成为最可靠的证物，因此也成为最完美的掩护。` |
| `the-archive-was-the-second-offender` | `裁定档案是第二加害者 · RULE THAT THE ARCHIVE WAS THE SECOND OFFENDER` | `档案把已经放下的人重新固定为受害者，把已经停止掌权的过去重新授予姓名。记录没有伪造伤害，只是拒绝允许伤害结束。` |

报告 id 固定为 `site:instrument:interpretation`，标题与 feedback 只从冻结表逐字拼接，不接收存档自由文本。

点击 interpretation 后创建 report pending，固定 `source=crime-scene-without-offender`，转到 instrument 对应旧场景。只在 target arrival 原子执行：

- `excavationRuns +1`；
- 对应 `siteTallies +1`；
- report 首次进入图鉴；
- `lastOutcome` 更新；
- `activeReconstructor` 建立；
- draft / pending 清空。

重复报告不重复图鉴，但仍增加真实发掘次数与遗址票数。source 刷新不提前结算，target 刷新不重复结算。

## 三处旧场景现场复原员

| instrument | 旧场景 | 返回按钮 | activeReconstructor feedback |
|---|---|---|---|
| `pain-reconstruction-brush` | `threshold` | `跟疼痛复原员返回考古局 · RETURN WITH THE PAIN RECONSTRUCTOR` | `复原员在门槛上刷回一声旧疼。门没有承认自己夹伤过谁，却开始为每一次关闭保留一份神经记录。` |
| `responsibility-pollen-sieve` | `liability-ledger` | `跟责任筛查员返回考古局 · RETURN WITH THE RESPONSIBILITY SIFTER` | `责任花粉在空账页上聚成箭头。箭头指向一处已被擦除的姓名栏，像追责终于抵达，却比承担者晚了一生。` |
| `missing-witness-cast` | `causeless-ward` | `跟缺席铸证员返回考古局 · RETURN WITH THE ABSENT-WITNESS CASTER` | `缺席证人的石膏像坐在无因病床旁，准确描述一场无人目击的伤害。病房接受了证词，却拒绝承认它来自任何活人。` |

activeReconstructor 只在准确 target 出现。返回后清 activeReconstructor，进入伤害考古局；旧反馈、pending、图鉴、通知与入口不被覆盖。

## 覆盖与二次伤害听证

`harmArchaeologyCoverageComplete()` 从规范 reports 实时重算：三 site、三 instrument、四 interpretation 全覆盖且至少四份。三份失败，四份代表报告成功。

覆盖后痕迹室显示：

`听证调查是否成为第二次伤害 · HEAR WHETHER INVESTIGATION BECAME THE SECOND HARM`

进入 `#second-harm-hearing-court`。

标题：`06γ / 二次伤害听证庭 · SECOND HARM HEARING COURT`
图：`assets/v83-second-harm-hearing-court.webp`

### 三项最终裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `convict-the-investigation` | `判调查构成第二次伤害 · CONVICT THE INVESTIGATION OF SECOND HARM` | `the-investigation-was-convicted-of-second-harm` | `remembrance` | `听证庭给所有铲、刷与模具戴上封条。真相仍然成立，但此后任何人想引用它，都必须先承认自己正在让某处旧伤重新工作。` |
| `grant-the-wound-right-to-refuse-evidence` | `授予伤口拒绝作证权 · GRANT THE WOUND THE RIGHT TO REFUSE EVIDENCE` | `the-wound-was-granted-the-right-to-refuse-evidence` | `threshold` | `闭合疤痕拒绝出庭，账页拒绝显字，土层拒绝交出名字。案件失去证据，却第一次没有把沉默解释成不存在。` |
| `make-truth-outlive-every-victim` | `让真相活过所有受伤者 · MAKE TRUTH OUTLIVE EVERY VICTIM` | `truth-outlived-every-victim` | `unending-gallery` | `档案升到没有人能够触碰的高度。最后一名受伤者死去后，真相仍然完整，只是再也没有谁能回答它究竟保护了谁。` |

合法 target arrival：`hearingRuns +1`；outcome 首次进入 `hearingOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定增加 hearingRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v83_harm_archaeology`
version：`83`

```js
{
  version: 83,
  visited: { bureau: false, excavation: false, scene: false, court: false },
  draft: { site: '', instrument: '' },
  reports: [],
  hearingOutcomes: [],
  excavationRuns: 0,
  hearingRuns: 0,
  siteTallies: { scar: 0, ledger: 0, soil: 0 },
  lastOutcome: '',
  activeReconstructor: null,
  pending: null
}
```

规范十一键；visited / draft 精确投影；reports 按 `SITES × INSTRUMENTS × INTERPRETATIONS` 固定顺序去重；hearingOutcomes 固定 action 顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指向规范结果；activeReconstructor 精确 `{instrument,report,feedback}` 并从表反算；坏 JSON/version/type/未解锁回默认；v83 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `site`：`{kind,source,site,target,feedback}`。
3. `instrument`：`{kind,source,site,instrument,target,feedback}`。
4. `report`：`{kind,source,site,instrument,interpretation,report,target,feedback}`。
5. `reconstructor-return`：`{kind,from,target,report,feedback}`。
6. `hearing-entry`：`{kind,target,feedback}`。
7. `hearing`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复且只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫；三个旧 target 只增加 v83 合法窄桥，不收窄旧准入、不放宽其他守卫。

记忆行：

`伤害考古局：已复原 N/36 处现场，共发掘 R 次；遗址 闭疤 S / 零账 L / 无罪土 I；工具 疼刷 P / 责筛 R / 缺证 W；解释 无犯 O / 造真 T / 伤辩 A / 档再 H；遗址多数 Q；听证结局 X/3。`

图鉴 39 格，目录四项 `05ω / 06α / 06β / 06γ`。forget-all 清 v83 key、AutoAdvance、draft、activeReconstructor、pending、反馈、按钮态、入口、记忆、图鉴、目录与三处复原员；不写 v82。

恰好 18 个 v83 click listener：普通入口 1、hearing 入口 1、site 3、instrument 3、interpretation 4、reconstructor-return 3、hearing 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending；测试逐项证明 handler 使用的每个动态 ID 都存在于真实 DOM，合成点击零副作用，真实输入可玩。

## 素材合同

全部 `1536×1024`，无文字/logo/UI/水印；WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP |
|---|---|
| `design-references/source-v83-harm-archaeology-bureau.png`（1536×1024 / 3013483 B / `a617f68548b099f6d6f384b4176def7083ae22fb4dde3e338670a1eee1ab33b2`） | `assets/v83-harm-archaeology-bureau.webp`（1536×1024 / 336204 B / `5d8ae26436ed228c8dec494de2aceecf41ac75f879f3b3019c30e36adeae8433`） |
| `design-references/source-v83-forensic-mercy-excavation.png`（1536×1024 / 2832232 B / `5ab503ef560cf7ad29f78a5a7eca3bac718aa2a1bc3b55a2df5b854020766629`） | `assets/v83-forensic-mercy-excavation.webp`（1536×1024 / 264802 B / `b2c23995d6f3fddee6647f7fbc8543de8a9f6f4da8c266454d1731fe94b6184c`） |
| `design-references/source-v83-crime-scene-without-offender.png`（1536×1024 / 2899772 B / `6c96a1f28b6a3a1011abeb86e190fb2e7aa01c0e0daccc4e338e8df4abf2fb8a`） | `assets/v83-crime-scene-without-offender.webp`（1536×1024 / 268420 B / `657c84f8836460c5cb6019256497a36842e4ad85b62becf04387731581d868b9`） |
| `design-references/source-v83-second-harm-hearing-court.png`（1536×1024 / 2732087 B / `c0a97c021b18fae2759357c3950ff17249058365841e08b7045991a999d13bf1`） | `assets/v83-second-harm-hearing-court.webp`（1536×1024 / 244890 B / `cc68a511dd68166e8d06ff9ee84583c0051850d84d20d82756644cb354b4a2de`） |

## 静态与浏览器门槛

- cache `v=83`，165 场景，四幕标题 / 路由 / preload / 目录；
- 解锁只读 v82；十一键、36+3、七 pending、三 activeReconstructor、四份 coverage、18 isTrusted、forget-all、v82 回归；
- 主初始化链包含 v83 全套 sync / paint / replay；handler 动态 ID 与 index.html 真实 ID 全量联动测试；
- Codex 浏览器验桌面/手机、真实三段点击、三个旧场景回程、coverage/听证/刷新/坏档/console。

## v84 活口

伤口获得拒绝作证权后，所有曾经证明伤害的人都被重新分类为“可能伤害无罪的证人”。他们必须改名、换影子、迁出自己的记忆，才能避免真相继续追踪他们。下一站开放：

`无罪证人保护院 / WITNESS PROTECTION FOR THE INNOCENT`

它会问：当证人为了活下去必须忘记自己看见过什么，被保护的是人，还是一个不会再受质疑的无罪世界？
