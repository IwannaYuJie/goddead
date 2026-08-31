# v82 宽恕填埋场 / FORGIVENESS LANDFILL

版本：v82 审定冻结稿
状态：v82 生产实现与独立静态 / 真实浏览器 QA 验收已全部完成；已纳入 v90 汇总发布批次
职责：Codex 设计 / 生图复核 / 应用输出 / 诊断 / 独立验收；Gemini 3.7 Flash High 生产前端 / 测试 / 缺陷修复 / 实现文档

## 核心命题

原谅被零废弃人生炉判为不可回收后，所有不再产生后悔的伤害都被运往世界边缘：没被接受的道歉仍保持请求姿势，已经免除的债失去了继续追人的用途，不再索取的伤口则因为无法发电而被归入惰性废料。填埋场必须决定，这些放下的东西究竟应当消失，还是有权留下证据证明自己曾经很重。

玩家依次选择：

1. 一种等待填埋的宽恕废料；
2. 一份证明伤害确实被放下的惰性凭证；
3. 一种会改变遗忘含义的处置方式；

形成 `3 × 3 × 4 = 36` 份宽恕处置单。每次处置后，一名填埋记录员停留在对应旧场景；三轴全部覆盖后，无害化终审井开放，产生三条新的宽恕结局。

## 审定方向

沿用已经冻结的四幕、三轴处置、三处旧场景记录员与三项井裁，不增加污染值、填埋容量、宽恕币等第二套经营系统。v82 的核心新鲜感是：玩家不是决定“原不原谅”，而是决定原谅之后还应不应该保存伤害证据；每次短选择都必须在旧场景留下可以返回、可以追责的实体后果。

四张 1536×1024 源图与运行图已经逐张复核：第一幕三坑、第二幕三柜、第三幕四象限、第四幕三终局结构均可直接承载原生按钮热区，因此不重复生图、不改动冻结素材。

## 解锁合同

v82 只读 v81，不写 v81 或更早状态。

`forgivenessLandfillUnlocked()` 必须同时满足：

- `regretReclamationPlantUnlocked()` 为真；
- v81 batches 覆盖三种 material、三种 residue、四种 use；
- v81 `furnaceOutcomes` 精确包含：
  - `regret-became-a-renewable-resource`
  - `every-life-was-made-from-someone-elses-regret`
  - `forgiveness-was-classified-as-unrecyclable-waste`

任一前置缺失时，v82 getter 返回默认态，四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录和三处填埋记录员全部隐藏。

## 新场景

1. `#forgiveness-landfill`：宽恕填埋场，选择三种宽恕废料。
2. `#inert-harm-certificate-vault`：惰性伤害凭证库，选择三份放下证据。
3. `#mercy-burial-trench`：慈悲处置沟，选择四项填埋方式。
4. `#harmlessness-final-well`：无害化终审井，执行三项最终裁定。

场景总数：`157 → 161`。

## 第一幕：宽恕填埋场

标题：`05υ / 宽恕填埋场 · FORGIVENESS LANDFILL`
图：`assets/v82-forgiveness-landfill.webp`

三座废料坑横向展开。左侧一双黄铜请求之手托着从未被拆开的道歉匣；中央归零债链从骨白账本上松脱，却仍保持追赶姿势；右侧一枚已经闭合的暗红伤口被封在玻璃土层中，周围没有任何索赔标记。三块热点不重叠，桌面与移动端均 `≥44px`。

### 三种宽恕废料

| waste | 按钮 | feedback | tally |
|---|---|---|---|
| `apology-never-accepted` | `填埋未被接受的道歉 · BURY THE APOLOGY NEVER ACCEPTED` | `请求之手保持弯曲，匣内的道歉却已失去收件人。它不再期待原谅，只要求有人承认自己曾经来迟。` | `apology` |
| `debt-already-forgiven` | `填埋已经免除的债 · BURY THE DEBT ALREADY FORGIVEN` | `债链从账本上松开，仍本能地寻找下一具脚踝。余额已经归零，追赶却还没有学会怎样停下。` | `debt` |
| `wound-that-stopped-demanding` | `填埋不再索取的伤口 · BURY THE WOUND THAT STOPPED DEMANDING` | `伤口完整闭合，没有留下收据。它不再要求补偿，因此系统开始怀疑这里是否真的发生过伤害。` | `wound` |

选中 waste 后创建 pending，显示逐字反馈并进入 `#inert-harm-certificate-vault`；只在 target arrival 写入 `draft.waste` 与 `visited.vault`。

## 第二幕：惰性伤害凭证库

标题：`05φ / 惰性伤害凭证库 · VAULT OF INERT HARM CERTIFICATES`
图：`assets/v82-inert-harm-certificate-vault.webp`

凭证库陈列三份失去索赔能力的证据：未开封的骨白赦免回执；指针永久停在零位的黄铜债秤；一块没有目击者、只留缝合纹的透明疤痕片。三块热点不重叠、`≥44px`。

### 三份惰性凭证

| certificate | 按钮 | feedback | target |
|---|---|---|---|
| `unopened-absolution-receipt` | `提交未开封赦免回执 · SUBMIT THE UNOPENED ABSOLUTION RECEIPT` | `回执从未被拆开，却已经盖上处理完毕的凹印。谁都没有接受道歉，档案却坚持宽恕已成功投递。` | `offering` |
| `zero-balance-debt-scale` | `提交归零债秤 · SUBMIT THE ZERO-BALANCE DEBT SCALE` | `债秤两端空无一物，指针仍被某种旧重量压在零上。免除没有留下欠款，只留下停止追讨所需的力。` | `liability-ledger` |
| `scar-closed-without-witness` | `提交无目击闭合疤痕 · SUBMIT THE UNWITNESSED CLOSED SCAR` | `透明疤痕片只保存愈合的纹路。没有人见过伤口张开，于是闭合本身成了唯一可疑的证词。` | `causeless-ward` |

选中 certificate 后进入 `#mercy-burial-trench`；只在 target arrival 写入 `draft.certificate` 与 `visited.trench`。

## 第三幕：慈悲处置沟

标题：`05χ / 慈悲处置沟 · MERCY BURIAL TRENCH`
图：`assets/v82-mercy-burial-trench.webp`

四座处置设施围住中央骨白土坑：左上把宽恕压到未来城镇地基下；左下黄铜菌丝从伤害里抽走因果；右上温室让旧伤长出一枚从未受伤的空白面具；右下挖掘吊臂不断掘回刚刚埋下的伤害供档案复核。四块热点不重叠、`≥44px`。

### 四项填埋方式

| disposal | 按钮 | fragment |
|---|---|---|
| `bury-it-beneath-a-future-life` | `埋在未来人生地基下 · BURY IT BENEATH A FUTURE LIFE` | `推土机把道歉、免债与疤痕压进新生活的地基。楼上的人从未受伤，却总在夜里听见地下有人练习原谅。` |
| `let-the-soil-forget-the-cause` | `让土壤忘掉原因 · LET THE SOIL FORGET THE CAUSE` | `黄铜菌丝吃掉伤害的来由，只留下已经停止疼痛的结果。因果被净化，责任也失去可以返回的地址。` |
| `grow-innocence-from-old-harm` | `用旧伤培育无罪 · GROW INNOCENCE FROM OLD HARM` | `温室从闭合伤口里长出一张空白脸。它完全无罪，因为构成它的每一份痛都已答应不再指认任何人。` |
| `exhume-it-for-permanent-record` | `挖回伤害永久存档 · EXHUME IT FOR PERMANENT RECORD` | `吊臂把刚埋下的宽恕重新挖出。档案要求伤害永远可查，即使受伤的人已经不想再被它定义。` |

处置单 id 固定为 `waste:certificate:disposal`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自由文本。

点击 disposal 后创建 disposal pending，固定 `source=mercy-burial-trench`，并转到 certificate 对应旧场景。只在 target arrival 原子执行：

- `disposalRuns +1`；
- 对应 `wasteTallies +1`；
- disposal 首次进入图鉴；
- `lastOutcome` 更新；
- `activeRecorder` 建立；
- draft / pending 清空。

重复处置单不重复图鉴，但仍增加真实填埋次数与废料票数；source 刷新不提前结算，target 刷新不重复结算。

## 三处旧场景填埋记录员

| certificate | 旧场景 | 返回按钮 | activeRecorder feedback |
|---|---|---|---|
| `unopened-absolution-receipt` | `offering` | `跟赦免记录员返回填埋场 · RETURN WITH THE ABSOLUTION RECORDER` | `赦免记录员在焚献处找到未开回执。火焰拒绝烧掉它，因为没人接受的宽恕不属于任何人的祭品。` |
| `zero-balance-debt-scale` | `liability-ledger` | `跟归零记录员返回填埋场 · RETURN WITH THE ZERO-BALANCE RECORDER` | `归零记录员在责任账簿里找到一行空债。数字已经消失，纸页仍因某个不再追讨的人而微微下沉。` |
| `scar-closed-without-witness` | `causeless-ward` | `跟闭疤记录员返回填埋场 · RETURN WITH THE CLOSED-SCAR RECORDER` | `闭疤记录员在无因病房寻找开口。病床只记得愈合，伤害因此被诊断为一种没有发生过的康复。` |

activeRecorder 只在准确 target 出现。返回后清 activeRecorder，进入宽恕填埋场；旧反馈、pending、图鉴、通知与入口不得被覆盖。

## 覆盖与无害化终审

`forgivenessLandfillCoverageComplete()` 从规范 disposals 实时重算：三 waste、三 certificate、四 disposal 全覆盖且至少四份。三份失败，四份代表处置单成功。

覆盖后痕迹室显示：

`裁定伤害是否可以不留证据地结束 · DECIDE WHETHER HARM MAY END WITHOUT EVIDENCE`

进入 `#harmlessness-final-well`。

标题：`05ψ / 无害化终审井 · FINAL WELL OF HARMLESSNESS`
图：`assets/v82-harmlessness-final-well.webp`

### 三项无害化裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `seal-every-forgiven-harm-forever` | `永久封存所有已宽恕伤害 · SEAL EVERY FORGIVEN HARM FOREVER` | `every-forgiven-harm-was-sealed-forever` | `remembrance` | `终审井合上骨白井盖。痕迹墙仍知道这里少了什么，却再也不能用那份缺席要求任何人继续受伤。` |
| `erase-the-need-for-forgiveness` | `抹除原谅曾被需要的事实 · ERASE THAT FORGIVENESS WAS EVER NEEDED` | `the-need-for-forgiveness-was-erased` | `threshold` | `土层吞掉伤害、道歉与免除。门外世界变得无罪，只是每个人都在经过门槛时本能地向看不见的人低头。` |
| `make-harm-survive-its-own-forgiveness` | `让伤害活过它得到的原谅 · MAKE HARM OUTLIVE ITS FORGIVENESS` | `harm-outlived-its-own-forgiveness` | `unending-gallery` | `闭合疤痕从土中重新长出，却不再疼痛。它只负责证明原谅没有倒写过去，而是让过去失去继续掌权的资格。` |

每次合法 target arrival：`wellRuns +1`；outcome 首次进入 `wellOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 wellRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v82_forgiveness_landfill`
version：`82`

```js
{
  version: 82,
  visited: { landfill: false, vault: false, trench: false, well: false },
  draft: { waste: '', certificate: '' },
  disposals: [],
  wellOutcomes: [],
  disposalRuns: 0,
  wellRuns: 0,
  wasteTallies: { apology: 0, debt: 0, wound: 0 },
  lastOutcome: '',
  activeRecorder: null,
  pending: null
}
```

规范十一键：visited / draft 精确投影；disposals 固定 `WASTES × CERTIFICATES × DISPOSALS` 顺序去重；wellOutcomes 固定 action 顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指向规范结果；activeRecorder 精确 `{certificate,disposal,feedback}` 且从表反算；坏 JSON/version/type/未解锁回默认；v82 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `waste`：`{kind,source,waste,target,feedback}`。
3. `certificate`：`{kind,source,waste,certificate,target,feedback}`。
4. `disposal`：`{kind,source,waste,certificate,disposal,record,target,feedback}`，其中 record 为三轴 id。
5. `recorder-return`：`{kind,from,target,record,feedback}`。
6. `well-entry`：`{kind,target,feedback}`。
7. `well`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复并只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫。v82 的旧落点一共六处：三处记录员目的地 `offering / liability-ledger / causeless-ward`，三处井裁目的地 `remembrance / threshold / unending-gallery`。六处都必须由同一个 `forgivenessLandfillBridgeAllows(scene)` 提供精确窄授权，并与现有 v81 及更早 bridge 以“或”关系组合，禁止替换、收窄旧准入或放宽其他场景。

- disposal 抵达前：仅合法 `pending.kind === 'disposal' && pending.target === scene` 放行；
- disposal 抵达后：仅 certificate 与规范 disposal 对应、且 disposal 已收集的 `activeRecorder` 放行；
- well 抵达前：仅合法 `pending.kind === 'well' && pending.target === scene` 放行；
- well 抵达后：仅“最新且已收集的规范 well outcome”授权其表中准确 target，避免首次 `sceneInit` 清 pending 后第二次 hashchange 被旧守卫弹走；
- sibling target、旧 outcome、伪造 outcome、只改 `lastOutcome`、只改 URL 均不得放行。

桥接至少覆盖主线 `offering / remembrance / threshold`、责任账簿 `liability-ledger`、无因病房 `causeless-ward` 与 v63 `unending-gallery` 的现有守卫入口。`offering / remembrance / unending-gallery` 同时可能被 v81 合法事务占用，v82 bridge 只能追加自己的精确授权，不能让 v81 的合法重播失效。

记忆行：

`宽恕填埋场：已处置 N/36 份废料，共填埋 R 次；废料 道歉 A / 免债 D / 闭伤 W；凭证 赦回 R / 零秤 Z / 闭疤 S；处置 地基 B / 忘因 F / 无罪 I / 挖档 E；废料多数 Q；井裁结局 X/3。`

图鉴 39 格，目录四项 `05υ / 05φ / 05χ / 05ψ`。forget-all 清 v82 key、AutoAdvance、draft、activeRecorder、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个记录员；不写 v81。

恰好 18 个 v82 click listener：普通入口 1、well 入口 1、waste 3、certificate 3、disposal 4、recorder-return 3、well 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending，且测试必须把 handler 复核的每一个动态 ID 与真实 DOM 逐项对齐；合成点击零副作用，真实输入可玩。

## 素材合同

全部 `1536×1024`，无文字/logo/UI/水印；WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | PNG bytes / sha256 | runtime WebP | WebP bytes / sha256 |
|---|---|---|---|
| `design-references/source-v82-forgiveness-landfill.png` | `2766019` / `e28c1a3ffff9668597e55f415ee3c6e3148f3d2bccbd6212e41a9ca96d102d99` | `assets/v82-forgiveness-landfill.webp` | `230602` / `102ecfa75c03b9b7cb212b2a0db393846e0b448ed8a8fada7716faf1330dc3ad` |
| `design-references/source-v82-inert-harm-certificate-vault.png` | `2538530` / `eacc34edbac8cdde1a334e986732c8ac2d1ed216db6b3698aa42ea641638d3c8` | `assets/v82-inert-harm-certificate-vault.webp` | `176130` / `165521f4e35fea7339d69aa41f93c905873197bbc0d23cd45c20f27bb3fe0f81` |
| `design-references/source-v82-mercy-burial-trench.png` | `3395821` / `6c038d1e5e9bc4e2609801ec28be7cbb84064f8120d45ccd5aaa4d007d9cd750` | `assets/v82-mercy-burial-trench.webp` | `408332` / `253c326a5f4052f82ecbe6b0aba9fda77ae9cd2df40c98fb7ffe4004d8c06533` |
| `design-references/source-v82-harmlessness-final-well.png` | `3420241` / `327309717c6de8a759b88bcd3ffc24d92467bb6709426ada11d959dc5466a145` | `assets/v82-harmlessness-final-well.webp` | `410040` / `0195bebccfcd4ba41ae247db4bbe8c3dc0aeb691318af6088c812e693a87b24a` |

## 静态与浏览器门槛

- [x] 语法与测试门槛：`node --check script.js`、`node --check tests/site.test.mjs` 与 `git diff --check` 无错误通过；自动化测试套件输出 `site.test.mjs: 13642 assertions passed`。
- [x] 场景与视觉资产门槛：场景数扩充至 161 处（新增 4 处场景），4 张源 PNG 对应转换 4 张运行时 WebP（自然分辨率 1536x1024），静态查询参数设为 `v=82`。
- [x] 状态持久化与状态机安全门槛：独立持久化键 `goddead_v82_forgiveness_landfill` 包含 11 个规范字段、7 种挂起类型与 3 族回写，单向读取 v81 且全局遗忘不写 v81；支持损坏数据自愈与锁定态直达规约。
- [x] 真实浏览器 QA 门槛：单 Chrome 窗口/单标签页 DevTools 联动 Computer Use 验收通过；桌面 (915x774) 与移动端 (390x844) 无水平溢出且热区达标；修复图鉴、入口及记录器 3 项浏览器缺陷；18 处 `isTrusted` 监听正常，应用 0 异常（仅 1 处非致命预加载警告），5 份 QA 证据全部归档。

## v83 活口

伤害终于被允许活过原谅，却失去了疼痛与索赔能力。档案员因此开始向世界各处挖掘这些“无害的旧伤”，试图恢复它们最初的犯罪现场。下一站开放：

`伤害考古局 / BUREAU OF HARM ARCHAEOLOGY`

它会从闭合疤痕、空白账簿与无罪土层中重建一场没有嫌疑人的伤害，并追问：如果真相只能靠重新打开伤口证明，调查是否已经成为第二次犯罪。
