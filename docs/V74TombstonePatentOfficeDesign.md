# v74 墓碑专利局 / PATENT OFFICE OF THE UNBURIED

版本：v74 设计冻结稿
状态：已实现，Codex 独立浏览器验收通过（8441 assertions）。P1 修复：sceneInit 主同步链原先只同步到 v73，已补齐 v74 全套 sync/paint/replay 调用
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

梦境海关把清醒列为违禁品后，查获了大量从未被制造、却早已在梦里使用过的器物。墓碑专利局随即开门：未出生的人要求取得发明权，死者声称自己的遗言就是原型，未来的抄袭者则倒过来起诉现在。

玩家依次选择：

1. 一名不可能的申请人；
2. 一件不存在的先前技术；
3. 一项违背因果的权利要求；

形成 `3 × 3 × 4 = 36` 件不可能专利。每次核准后，一名墓碑审查员停留在对应旧场景；三轴全部覆盖后，终审庭开放，产生三条新的永久许可结局。

## 解锁合同

v74 只读 v73，不写 v73 或更早状态。

`tombstonePatentOfficeUnlocked()` 必须同时满足：

- `borrowedDreamCustomsUnlocked()` 为真；
- v73 declarations 覆盖三种 passport、三种 contraband、四种 tariff；
- v73 `deportationOutcomes` 精确包含：
  - `nightmares-became-the-only-citizens`
  - `the-dreamer-was-deported-from-the-dream`
  - `waking-became-contraband`

任一前置缺失时，v74 getter 返回全新默认态，四个 v74 direct hash 全部归一到 `#remembrance`；入口、记忆、39 格图鉴、目录和三处墓碑审查员全部隐藏。

## 新场景

1. `#tombstone-patent-office`：墓碑专利局，选择三名不可能申请人。
2. `#prior-art-ossuary`：先前技术骨库，选择三件不存在的先例。
3. `#impossible-claim-examination`：不可实现权项审查室，选择四项因果权利要求。
4. `#perpetual-license-tribunal`：永久许可终审庭，执行三项最终裁定。

场景总数：`125 → 129`。

## 第一幕：墓碑专利局

标题：`04μ / 墓碑专利局 · PATENT OFFICE OF THE UNBURIED`
图：`assets/v74-tombstone-patent-office.webp`

黑石大厅前方分出三座申请岛。左侧空骨摇篮替未生发明人托着自动绘图器；中央无头死者把专利状压在胸口；右侧未来抄袭者只留下影子与一台尚未完成的机器。三块原生热点必须清楚、不重叠、桌面与移动端均 `≥44px`。

### 三名不可能申请人

| applicant | 按钮 | feedback | tally |
|---|---|---|---|
| `unborn-inventor` | `替未生发明人申请 · FILE FOR THE UNBORN INVENTOR` | `空摇篮交出一套磨损多年的图纸。发明人尚未出生，却已因专利过期而失去童年。` | `unborn` |
| `posthumous-inventor` | `替死后署名人申请 · FILE FOR THE POSTHUMOUS INVENTOR` | `无头死者把遗言按进签名栏。局方承认笔迹真实，只质疑他是否曾经活到产生这个念头。` | `dead` |
| `future-plagiarist` | `替未来抄袭者申请 · FILE FOR THE FUTURE PLAGIARIST` | `未来抄袭者先寄来侵权通知，再补交申请书。日期显示他将在你发明之后，比你更早拥有它。` | `future` |

选中 applicant 后创建 pending，锁住三按钮，显示逐字反馈后进入 `#prior-art-ossuary`；只在 target arrival 时写入 `draft.applicant` 与 `visited.ossuary`。

## 第二幕：先前技术骨库

标题：`04ν / 先前技术骨库 · PRIOR ART OSSUARY`
图：`assets/v74-prior-art-ossuary.webp`

骨库里陈列三件先例：尚未刻字却能投出机器结构的墓碑、只在梦里磨损的原型、后人记忆中倒长出来的骨制装置。三块热点清楚、不重叠、`≥44px`。

### 三件不存在的先前技术

| priorArt | 按钮 | feedback | target |
|---|---|---|---|
| `uncarved-epitaph-blueprint` | `提交未刻墓志图纸 · SUBMIT THE UNCARVED EPITAPH BLUEPRINT` | `空白墓碑把尚未写下的墓志投成机械剖面。每一根齿轮都以发明人的死期作为尺寸。` | `threshold` |
| `dream-worn-prototype` | `提交梦中磨损原型 · SUBMIT THE DREAM-WORN PROTOTYPE` | `玻璃罩里的原型从未被造出，边角却已被几千场梦磨亮。醒着的检验员摸不到它的损耗。` | `eyelid-archive` |
| `descendant-memory-machine` | `提交后人记忆机器 · SUBMIT THE DESCENDANT MEMORY MACHINE` | `骨匣抽出一台来自后人记忆的机器。后人尚未出生，却清楚记得你当年没有发明它。` | `remembrance` |

选中 priorArt 后进入 `#impossible-claim-examination`；只在 target arrival 时写入 `draft.priorArt` 与 `visited.examination`。

## 第三幕：不可实现权项审查室

标题：`04ξ / 不可实现权项审查室 · IMPOSSIBLE CLAIM EXAMINATION`
图：`assets/v74-impossible-claim-examination.webp`

四座审查台围住空白中央地面：玻璃钟罩测量一件未造之物的缺席；骷髅书记员把死亡证明卷进许可机；倒望远镜向未来递出逆行诉状；发明人的双手被自己仍在生长的图纸束缚。四块热点清楚、不重叠、`≥44px`。

### 四项因果权利要求

| claim | 按钮 | fragment |
|---|---|---|
| `own-the-unmade` | `主张拥有未造之物 · CLAIM OWNERSHIP OF THE UNMADE` | `申请人要求垄断一件从未存在的东西。审查员找不到实物，只好把全世界的空位列为侵权证据。` |
| `license-death-as-user` | `许可死亡成为使用者 · LICENSE DEATH AS A USER` | `死亡取得永久使用许可。此后每一具尸体都被视为正在运行该发明，而活人只能申请试用。` |
| `sue-the-future-for-copying` | `起诉未来倒向抄袭 · SUE THE FUTURE FOR COPYING BACKWARD` | `诉状沿时间反向送达。未来尚未复制任何东西，却已被判赔偿现在从它那里偷来的原型。` |
| `forbid-inventor-to-invent` | `禁止发明人完成发明 · FORBID THE INVENTOR TO INVENT` | `专利保护范围包括发明本身。为避免自我侵权，发明人被永久禁止把图纸上的最后一根线画完。` |

专利 id 固定为 `applicant:priorArt:claim`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自带自由文本。

点击 claim 后创建 patent pending，必须含固定 `source=impossible-claim-examination`，并转到 priorArt 对应旧场景。只在 target arrival 时原子执行：

- `filingRuns +1`；
- 对应 `applicantTallies +1`；
- patent 首次发现才进入图鉴；
- `lastOutcome` 更新；
- `activeExaminer` 建立；
- draft 清空；
- pending 清空。

重复同一专利不重复图鉴，但仍增加真实审查次数与申请人票数。来源页刷新不能提前结算，目标页刷新不能重复结算。

## 三处旧场景墓碑审查员

| priorArt | 旧场景 | 返回按钮 | activeExaminer feedback |
|---|---|---|---|
| `uncarved-epitaph-blueprint` | `threshold` | `跟空碑审查员返回专利局 · RETURN WITH THE BLANK-STONE EXAMINER` | `空碑审查员在门槛上测量不存在的齿轮。门每开一次，墓志就少一个尚未写下的字。` |
| `dream-worn-prototype` | `eyelid-archive` | `跟梦型审查员返回专利局 · RETURN WITH THE DREAM-PROTOTYPE EXAMINER` | `梦型审查员在眼睑档案里核对磨损。每次睁眼，原型都会恢复成从未制造过的崭新。` |
| `descendant-memory-machine` | `remembrance` | `跟后忆审查员返回专利局 · RETURN WITH THE DESCENDANT-MEMORY EXAMINER` | `后忆审查员把骨制机器钉进痕迹墙。后人记得它运转过，墙却记得你亲手放弃了它。` |

activeExaminer 只在准确 target 出现。返回后清 activeExaminer，进入墓碑专利局。旧场景原有反馈、pending、图鉴、通知与入口不得被覆盖。

当 activeExaminer 位于 `remembrance` 时，v74 普通入口与终审入口必须显示但 disabled；审查员返回按钮可用。返回后两入口按 draft / pending / coverage 重新恢复，不能出现看似可点但 handler 静默拒绝的假按钮。

## 覆盖与永久许可终审

`patentCoverageComplete()` 必须从规范 patents 实时重算：

- 三种 applicant 全覆盖；
- 三种 priorArt 全覆盖；
- 四种 claim 全覆盖；
- 至少四件专利。

覆盖可由四件代表专利完成，三件永远不能覆盖四项 claim。

覆盖完成后，痕迹室显示：

`把存在本身送进永久许可终审 · PUT EXISTENCE ON PERPETUAL LICENSE TRIAL`

进入 `#perpetual-license-tribunal`。

标题：`04ο / 永久许可终审庭 · PERPETUAL LICENSE TRIBUNAL`
图：`assets/v74-perpetual-license-tribunal.webp`

### 三项永久许可裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `grant-self-ownership` | `让发明拥有自己 · GRANT THE INVENTION OWNERSHIP OF ITSELF` | `the-invention-owned-itself` | `unending-gallery` | `机器在空袖口前签下自己的名字。自此发明人只是它曾经用来产生自己的临时工具。` |
| `invalidate-all-prior-existence` | `把既往存在全部无效 · INVALIDATE ALL PRIOR EXISTENCE` | `existence-was-invalidated-as-prior-art` | `threshold` | `黑碑把化石、工具与旧原型逐件抹成尘。世界仍然存在，却再也不能证明自己比这份专利更早。` |
| `license-the-unburied-to-haunt-prototypes` | `许可未葬者附身原型 · LICENSE THE UNBURIED TO HAUNT EVERY PROTOTYPE` | `the-unburied-haunted-every-prototype` | `remembrance` | `石棺发出一条没有期限的幽灵许可。每台未完成机器从此都住进一名等不到坟墓的使用者。` |

每次合法 target arrival：`rulingRuns +1`；outcome 首次进入 `rulingOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 rulingRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v74_tombstone_patent_office`
version：`74`

规范十一键，固定投影顺序：

```js
{
  version: 74,
  visited: { office: false, ossuary: false, examination: false, tribunal: false },
  draft: { applicant: '', priorArt: '' },
  patents: [],
  rulingOutcomes: [],
  filingRuns: 0,
  rulingRuns: 0,
  applicantTallies: { unborn: 0, dead: 0, future: 0 },
  lastOutcome: '',
  activeExaminer: null,
  pending: null
}
```

规范化要求：

- visited 精确投影四布尔；
- draft 精确投影两键，priorArt 非空时 applicant 必须合法；
- patents 按 `APPLICANTS × PRIOR_ART × CLAIMS` 固定表顺序去重；
- rulingOutcomes 按三 action 固定顺序去重；
- filingRuns / rulingRuns 与三 applicantTallies 均 floor、clamp `0..9999`；
- lastOutcome 只能指向规范 patents 或 rulingOutcomes；
- activeExaminer 只允许 `{priorArt,patent,feedback}` 三键；patent 必须已收集，priorArt 等于 patent 第二段，feedback 必须由 priorArt 表逐字反算；
- 顶层多余键不得落盘；坏 JSON、坏 version、数组、null 或未解锁时 getter 返回默认态；
- v74 不写 v73 及任何旧 key。

## 七类 strict pending

所有 pending 必须 exact-key、逐字反算，额外键、缺键、错 source / target / feedback 均归 null。

1. `entry`：`{kind,target,feedback}`，target=`tombstone-patent-office`。
2. `applicant`：`{kind,source,applicant,target,feedback}`，source=`tombstone-patent-office`，target=`prior-art-ossuary`。
3. `prior-art`：`{kind,source,applicant,priorArt,target,feedback}`，source=`prior-art-ossuary`，target=`impossible-claim-examination`。
4. `patent`：`{kind,source,applicant,priorArt,claim,patent,target,feedback}`，source=`impossible-claim-examination`，target 由 priorArt 反算。
5. `examiner-return`：`{kind,from,target,patent,feedback}`，from 为三个旧场景之一并匹配 activeExaminer.priorArt，target=`tombstone-patent-office`。
6. `tribunal-entry`：`{kind,target,feedback}`，coverage 完整，target=`perpetual-license-tribunal`。
7. `ruling`：`{kind,source,action,outcome,target,feedback}`，source=`perpetual-license-tribunal`，逐表反算。

重播矩阵：

- target：立即 arrive，一次性结算并清 pending；
- source：恢复逐字反馈、锁定按钮与 aria-pressed，只排一次转场；
- else：清 pending，不结算、不转场；
- target reload 不重复增加 runs / tallies；
- source reload 不提前计数。

## 路由守卫与旧场景窄桥

- office：合法 entry / examiner-return target，或 visited.office；
- ossuary：合法 applicant target，或 visited.ossuary + 合法 draft.applicant；
- examination：合法 prior-art target，或 visited.examination + 合法完整 draft；
- tribunal：coverage + 合法 tribunal-entry target，或 visited.tribunal；
- 三个旧 target 先服从各自既有准入语义；v74 只为合法规范化后的 patent / ruling pending target 或匹配 activeExaminer 增加必要的窄桥例外。
- `eyelid-archive` 沿用 v32 的直接准入，v74 不得反向把它锁住；`threshold`、`remembrance` 与 `unending-gallery` 也不得收窄旧版本原有合法入口。
- 新窄桥不得顺带放宽 governance、v63、v72、v73 或其他旧守卫；v74 pending / activeExaminer 一旦失效，新增例外必须同步消失。

## UI / 图鉴 / 目录

痕迹室记忆行：

`墓碑专利局：已核准 N/36 件专利，共审查 R 次；申请人 未生 U / 死后 D / 未来抄袭 F；先例 空碑 E / 梦型 P / 后忆 M；权项 未造 O / 死亡许可 L / 未来诉讼 S / 禁止发明 B；发明权多数 Q；终审裁定 O/3。`

图鉴新增 39 格：36 patents + 3 rulingOutcomes。未发现显示 `？？？`；发现后显示冻结标题与逐字 feedback。

目录新增四项：

- `04μ / 墓碑专利局`
- `04ν / 先前技术骨库`
- `04ξ / 不可实现权项审查室`
- `04ο / 永久许可终审庭`

“遗忘全部”必须移除 v74 key，清 v74 AutoAdvance、draft、activeExaminer、pending、反馈、disabled、aria-pressed，隐藏入口、记忆、39 格图鉴、目录与三处墓碑审查员；不写 v73。

## 交互防线

必须恰好 18 个 v74 click listener，首条语句均为 `if (!e.isTrusted) return;`：

- 普通入口 1；
- tribunal 入口 1；
- applicant 3；
- priorArt 3；
- claim 4；
- examiner-return 3；
- ruling 3。

choose 函数还要复查当前 scene、button visible / enabled、figure visible、draft / pending 条件。合成 click 必须零副作用，真实鼠标 / 键盘点击必须可玩。

## 素材合同

所有源 PNG 与运行时 WebP 均为 `1536×1024`，无文字、无 logo、无 UI、无水印，保持 Goddead 黑石 / 旧黄铜 / 灰白骨质 / 暗红封蜡视觉语言。WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP | 用途 |
|---|---|---|
| `design-references/source-v74-tombstone-patent-office.png`（1536×1024 / 2403060 B / `378aa8e3e1b699e8fdc17078a0de6b3f219e625a757732ff3df9eb9c30ea8e29`） | `assets/v74-tombstone-patent-office.webp`（1536×1024 / 181182 B / `56523b0432c4bba095a914099ec1c89b5b0443b34ec76d35b00faf12e4da21e4`） | 三名不可能申请人 |
| `design-references/source-v74-prior-art-ossuary.png`（1536×1024 / 2624760 B / `3f708c4af5ffc204b1459e1790c506e77d9fc6dec611d0e1855f8f6de98ab5cc`） | `assets/v74-prior-art-ossuary.webp`（1536×1024 / 235722 B / `287dcfeb525fd0bf8fb2727da7ba8b9b95451b0a2bb6ed8918f52c1372b22798`） | 三件不存在的先前技术 |
| `design-references/source-v74-impossible-claim-examination.png`（1536×1024 / 3056961 B / `1fc064f5cc180dfac8d36bf2d6c0a57f344cbcbfac0bb8f7acb4e5ccc7605c09`） | `assets/v74-impossible-claim-examination.webp`（1536×1024 / 317510 B / `cdfe287be8bbb75f3daacac2421681c9eadabf798df723d80146e46df2ff6c9f`） | 四项因果权利要求 |
| `design-references/source-v74-perpetual-license-tribunal.png`（1536×1024 / 2971772 B / `a40852cbf1a75e0eded899ecbb58ae9023afd2a42727df902192125315e58c1c`） | `assets/v74-perpetual-license-tribunal.webp`（1536×1024 / 293074 B / `d9661f971e0c49a2ba1e7d2591d1342f44367ec30a11a142505a5467eeec6c26`） | 三项永久许可裁定 |

## 静态测试门槛

- cache `v=74`；
- 129 场景、唯一 id / data-scene、四场景标题 / 路由 / preload / 目录；
- 4 source + 4 WebP 尺寸、sha256、bytes 与预算冻结；
- 解锁只读 v73，锁定四 direct hash 回 remembrance；
- 十一键 canonical state、坏 JSON / version / type、去重 / clamp / lastOutcome；
- 36 patents 与 3 rulingOutcomes 穷举；
- 七类 pending exact keys + 逐字反算 + source / target / else；
- source reload / target arrival / target reload / repeat run；
- 三处 activeExaminer 直达、刷新、返回、清理与旧反馈共存；
- coverage 四件通过、三件失败；
- 路由窄桥不放宽旧守卫，也不收窄 v32 `eyelid-archive` 等旧场景原有合法准入；
- 18 个 isTrusted listener 与合成点击零副作用；
- 忘记全部与 v73 回归。

## Codex 独立浏览器验收

1. v73 锁定态下四个 v74 hash 全回 remembrance；
2. 桌面 `1280×720` 与移动 `390×844` 四场景图片完整、热点 `≥44px`、无横溢；
3. applicant → priorArt → claim 逐步锁定与反馈逐字一致；
4. 代表专利目标结算、图鉴、计数、刷新幂等；
5. 三处墓碑审查员直达 / 刷新 / 返回；
6. remembrance activeExaminer 时两入口 visible + disabled，返回可用；
7. coverage 三件失败、四件成功；
8. 三项终审代表结局与重复幂等；
9. 七类 pending source / target / else；
10. 坏存档回默认态；
11. 合成 click 无副作用、Chrome 真实 click 生效；
12. 全新页 console warn / error 为零。

## v75 活口

永久许可生效后，所有尚未完成的机器都开始声称自己在世界末日之后仍属保修期。下一站开放：

`末日保修局 / APOCALYPSE WARRANTY OFFICE`

它将审理从未出厂的故障、发生在世界结束后的报修、由幽灵提交的购买凭证，以及“当现实已经停产，谁还负责修好它”。
