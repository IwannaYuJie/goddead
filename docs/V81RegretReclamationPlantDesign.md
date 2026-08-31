# v81 后悔回收厂 / REGRET RECLAMATION PLANT

版本：v81 审定冻结稿
状态：生产前端、测试、缺陷修复与实现文档已完成；Codex 静态门禁与真实浏览器 QA 通过
职责：Codex 设计 / 生图 / 应用输出 / 诊断 / 独立验收；Gemini 3.7 Flash High 生产前端 / 测试 / 缺陷修复 / 实现文档

## 核心命题

未遂思想被拆成可重用零件后，世界发现后悔并不是情绪，而是一种高密度原料：没走的路保留了完整里程，没爱的人积压着无人使用的余温，没成为的自己则提供了最昂贵的备用人格。后悔回收厂开始把它们熔成新人生，并按纯度向原主收取处置费。

玩家依次选择：

1. 一种等待回收的后悔原料；
2. 一份证明它确实被放弃过的残留凭证；
3. 一种荒谬的再生用途；

形成 `3 × 3 × 4 = 36` 批再生人生材料。每批出炉后，一名回收技师停留在对应旧场景；三轴全部覆盖后，零废弃人生裁定炉开放，产生三条新的回收结局。

## 审定方向

沿用既有四幕、三轴组合、三处旧场景技师与三项炉裁，不加入炉温、纯度、货币或库存等第二套经营数值。v81 的新鲜感来自“后悔被工业化”及其旧场景后果，而不是额外仪表盘；这样可保持 Goddead 既有的短反馈、自动转场、一次选择即留下后果的节奏。

四张冻结图继续使用，不重复生成同题素材。后续新的生图额度留给 v82《宽恕填埋场》，让视觉世界继续向前而不是重画同一工厂。

## 解锁合同

v81 只读 v80，不写 v80 或更早状态。

`regretReclamationPlantUnlocked()` 必须同时满足：

- `unfinishedThoughtAsylumUnlocked()` 为真；
- v80 admissions 覆盖三种 thought、三种 trace、四种 therapy；
- v80 `hearingOutcomes` 精确包含：
  - `every-unfinished-thought-kept-living`
  - `the-thought-completed-its-thinker`
  - `all-abandoned-possibilities-were-recycled`

任一前置缺失时，v81 getter 返回默认态，四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录和三处回收技师全部隐藏。

## 新场景

1. `#regret-reclamation-plant`：后悔回收厂，选择三种后悔原料。
2. `#abandonment-residue-weighhouse`：放弃残留称量站，选择三份残留凭证。
3. `#second-life-smelting-line`：第二人生熔炼线，选择四项再生用途。
4. `#zero-waste-life-furnace`：零废弃人生裁定炉，执行三项最终裁定。

场景总数：`153 → 157`。

## 第一幕：后悔回收厂

标题：`05π / 后悔回收厂 · REGRET RECLAMATION PLANT`
图：`assets/v81-regret-reclamation-plant.webp`

三条原料输送线横向展开。左侧折叠道路被卷成一盘从未使用的黄铜里程；中央两张相对空椅之间悬着一颗无人领取的暗红余温核心；右侧许多未佩戴的骨白面具围住一具没有完成的备用自我。三块热点不重叠，桌面与移动端均 `≥44px`。

### 三种后悔原料

| material | 按钮 | feedback | tally |
|---|---|---|---|
| `road-never-taken` | `回收没走的路 · RECLAIM THE ROAD NEVER TAKEN` | `折叠道路展开一小段，鞋底立刻记起从未走过的远方。厂方判定里程全新，只是沿途风景已经老了。` | `road` |
| `person-never-loved` | `回收没爱的人 · RECLAIM THE PERSON NEVER LOVED` | `空椅之间的余温仍保持两个人的形状。没有爱情发生，它却积压了足够一生使用的离别。` | `love` |
| `self-never-became` | `回收没成为的自己 · RECLAIM THE SELF NEVER BECAME` | `备用面具逐一抬头。它们没有活过，却能精确指出你在哪一天开始不再可能成为它们。` | `self` |

选中 material 后创建 pending，显示逐字反馈并进入 `#abandonment-residue-weighhouse`；只在 target arrival 写入 `draft.material` 与 `visited.weighhouse`。

## 第二幕：放弃残留称量站

标题：`05ρ / 放弃残留称量站 · ABANDONMENT RESIDUE WEIGHHOUSE`
图：`assets/v81-abandonment-residue-weighhouse.webp`

称量站陈列三份残留：停在门内的鞋印与门外新增的尘；从未睡过人的第二只枕头保存着一枚体温凹陷；一只未被佩戴的面具内侧留着不存在的指纹。三块热点不重叠、`≥44px`。

### 三份放弃残留凭证

| residue | 按钮 | feedback | target |
|---|---|---|---|
| `dust-from-the-unwalked-mile` | `提交未走里程的尘 · SUBMIT DUST FROM THE UNWALKED MILE` | `尘土来自一条你没有踏上的路，却牢牢记得鞋底纹。它证明放弃也能留下比抵达更完整的足迹。` | `descending-appeals-stair` |
| `warmth-from-the-unused-pillow` | `提交空枕余温 · SUBMIT WARMTH FROM THE UNUSED PILLOW` | `第二只枕头从未承受头颅，中央却留下熟睡多年的凹陷。余温拒绝说明它在等谁。` | `borrowed-childhood` |
| `fingerprint-inside-an-unworn-face` | `提交未戴之脸内侧指纹 · SUBMIT THE PRINT INSIDE AN UNWORN FACE` | `面具内侧浮出一枚与你相同的指纹。你从未戴过它，它却证明某个版本一直从里面碰触你的脸。` | `identity-correction` |

选中 residue 后进入 `#second-life-smelting-line`；只在 target arrival 写入 `draft.residue` 与 `visited.smelting`。

## 第三幕：第二人生熔炼线

标题：`05σ / 第二人生熔炼线 · SECOND-LIFE SMELTING LINE`
图：`assets/v81-second-life-smelting-line.webp`

四座熔炼机围住中央暗红后悔坩埚：左上把未走里程拉成新童年的黄铜轨道；左下把离别余温锻成勇气心核；右上把备用面具铸给陌生人的空身；右下以玻璃冷库原样退回后悔，并附上一枚更沉的收据。四块热点不重叠、`≥44px`。

### 四项再生用途

| use | 按钮 | fragment |
|---|---|---|
| `cast-a-new-childhood` | `铸成另一段童年 · CAST A NEW CHILDHOOD` | `熔炉把未走的里程压成童年轨道。新孩子沿着你的后悔长大，并把你的故乡误认成自己离开的地方。` |
| `forge-courage-for-the-next-self` | `锻成下一个自我的勇气 · FORGE COURAGE FOR THE NEXT SELF` | `无人使用的余温被锻进黄铜心核。下一个你获得离开的勇气，却不知道那力量来自谁没能开始的爱情。` |
| `build-a-strangers-spare-life` | `制造陌生人的备用人生 · BUILD A STRANGER'S SPARE LIFE` | `未戴面具被装到陌生空身上。它完整继承你没成为的自己，并从此把你的现实当作失败版本。` |
| `return-regret-without-processing` | `原样退回后悔 · RETURN REGRET WITHOUT PROCESSING` | `冷库拒绝熔化原料，只把它称重后退回。后悔保持原样，却因确认无法处理而比送来时更重。` |

批次 id 固定为 `material:residue:use`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自由文本。

点击 use 后创建 batch pending，固定 `source=second-life-smelting-line`，并转到 residue 对应旧场景。只在 target arrival 原子执行：

- `batchRuns +1`；
- 对应 `materialTallies +1`；
- batch 首次进入图鉴；
- `lastOutcome` 更新；
- `activeReclaimer` 建立；
- draft / pending 清空。

重复批次不重复图鉴，但仍增加真实熔炼次数与原料票数；source 刷新不提前结算，target 刷新不重复结算。

## 三处旧场景回收技师

| residue | 旧场景 | 返回按钮 | activeReclaimer feedback |
|---|---|---|---|
| `dust-from-the-unwalked-mile` | `descending-appeals-stair` | `跟里程技师返回回收厂 · RETURN WITH THE UNWALKED-MILE RECLAIMER` | `里程技师沿下行申诉梯扫起门外之尘。每一级都声称自己曾通往别处，只因你回头才改成楼梯。` |
| `warmth-from-the-unused-pillow` | `borrowed-childhood` | `跟余温技师返回回收厂 · RETURN WITH THE UNUSED-PILLOW RECLAIMER` | `余温技师在借来童年室铺好第二只枕头。房间记得两个人一起醒来，现实却只肯报销一份早餐。` |
| `fingerprint-inside-an-unworn-face` | `identity-correction` | `跟备用脸技师返回回收厂 · RETURN WITH THE UNWORN-FACE RECLAIMER` | `备用脸技师在身份更正处核对内侧指纹。系统承认面具属于你，却把现在这张脸标为未经领取。` |

activeReclaimer 只在准确 target 出现。返回后清 activeReclaimer，进入后悔回收厂；旧反馈、pending、图鉴、通知与入口不得被覆盖。

## 覆盖与零废弃人生裁定

`regretReclamationCoverageComplete()` 从规范 batches 实时重算：三 material、三 residue、四 use 全覆盖且至少四批。三批失败，四批代表材料成功。

覆盖后痕迹室显示：

`决定人生是否允许留下废料 · DECIDE WHETHER A LIFE MAY LEAVE WASTE`

进入 `#zero-waste-life-furnace`。

标题：`05τ / 零废弃人生裁定炉 · ZERO-WASTE LIFE FURNACE`
图：`assets/v81-zero-waste-life-furnace.webp`

### 三项回收裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `declare-regret-renewable` | `宣布后悔可再生 · DECLARE REGRET A RENEWABLE RESOURCE` | `regret-became-a-renewable-resource` | `remembrance` | `痕迹墙接入回收管线。每次想起过去都会产出新的过去，后悔终于做到一边消耗人生、一边无限补货。` |
| `manufacture-every-life-from-foreign-regret` | `用陌生后悔制造所有人生 · MANUFACTURE EVERY LIFE FROM FOREIGN REGRET` | `every-life-was-made-from-someone-elses-regret` | `unending-gallery` | `面具、道路与空枕被熔成统一原料。每个人获得一生，却在最幸福时想念另一个陌生人没能拥有的生活。` |
| `classify-forgiveness-as-unrecyclable-waste` | `把原谅列为不可回收废物 · CLASSIFY FORGIVENESS AS UNRECYCLABLE WASTE` | `forgiveness-was-classified-as-unrecyclable-waste` | `offering` | `炉门拒绝接受原谅。它没有足够的后悔热值，只能被运往世界尽头，和所有不再索取的伤口一起填埋。` |

每次合法 target arrival：`furnaceRuns +1`；outcome 首次进入 `furnaceOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 furnaceRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v81_regret_reclamation`
version：`81`

```js
{
  version: 81,
  visited: { plant: false, weighhouse: false, smelting: false, furnace: false },
  draft: { material: '', residue: '' },
  batches: [],
  furnaceOutcomes: [],
  batchRuns: 0,
  furnaceRuns: 0,
  materialTallies: { road: 0, love: 0, self: 0 },
  lastOutcome: '',
  activeReclaimer: null,
  pending: null
}
```

规范十一键：visited / draft 精确投影；batches 固定 `MATERIALS × RESIDUES × USES` 顺序去重；furnaceOutcomes 固定 action 顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指向规范结果；activeReclaimer 精确 `{residue,batch,feedback}` 且从表反算；坏 JSON/version/type/未解锁回默认；v81 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `material`：`{kind,source,material,target,feedback}`。
3. `residue`：`{kind,source,material,residue,target,feedback}`。
4. `batch`：`{kind,source,material,residue,use,batch,target,feedback}`。
5. `reclaimer-return`：`{kind,from,target,batch,feedback}`。
6. `furnace-entry`：`{kind,target,feedback}`。
7. `furnace`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复并只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫。v81 的旧落点不只包含三处技师场景，还包含三项炉裁的 `remembrance / unending-gallery / offering`；六个旧目的地都必须由同一个 `regretReclamationBridgeAllows(scene)` 提供窄授权，并插在各自旧守卫判定之前：

- batch 抵达前：仅合法 `pending.kind === 'batch' && pending.target === scene` 放行；
- batch 抵达后：仅与规范 residue 对应、且 batch 已收集的 `activeReclaimer` 放行；
- furnace 抵达前：仅合法 `pending.kind === 'furnace' && pending.target === scene` 放行；
- furnace 抵达后：仅“最新且已收集的规范 furnace outcome”授权其表中准确 target，防止首次 `sceneInit` 清 pending 后第二次 hashchange 又被旧守卫弹走；
- sibling target、旧 outcome、伪造 outcome、只改 `lastOutcome`、只改 URL 都不得放行。

桥接点至少覆盖：治理守卫中的 `remembrance`、v63 `unending-gallery`、主线 `offering`、v52 `descending-appeals-stair`、v58 `identity-correction` 与 v67 `borrowed-childhood`。只增加 v81 精确窄桥，不收窄旧准入、不放宽其它旧场景。

记忆行：

`后悔回收厂：已再生 N/36 批材料，共熔炼 R 次；原料 未路 D / 未爱 L / 未己 S；残留 路尘 M / 枕温 W / 脸印 F；用途 童年 C / 勇气 B / 备生 A / 原退 U；原料多数 Q；炉裁结局 X/3。`

图鉴 39 格，目录四项 `05π / 05ρ / 05σ / 05τ`。forget-all 清 v81 key、AutoAdvance、draft、activeReclaimer、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个技师；不写 v80。

恰好 18 个 v81 click listener：普通入口 1、furnace 入口 1、material 3、residue 3、use 4、reclaimer-return 3、furnace 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending；合成点击零副作用，真实输入可玩。

## 素材合同

全部 `1536×1024`，无文字/logo/UI/水印；WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP |
|---|---|
| `design-references/source-v81-regret-reclamation-plant.png`（2854291 B / `ee12c1a052dcad1b6dcbee7b3358ee5d2b36110d08bc7a36f60b823f91ed8a4a`） | `assets/v81-regret-reclamation-plant.webp`（289570 B / `19fb16f596223190b90b3b30e38b67a02aa2a75a30b2aa63e14e022c8da572c5`） |
| `design-references/source-v81-abandonment-residue-weighhouse.png`（2469888 B / `733b35fb6b00ea72e1a94de1bc46d1abf8f1442b515f118d9118f7767500ad48`） | `assets/v81-abandonment-residue-weighhouse.webp`（181276 B / `93579b2413e73cb69605822d890fbaa6d740e7683e479c7959121b22e63e5a35`） |
| `design-references/source-v81-second-life-smelting-line.png`（2754255 B / `e7de412c2f1829f7001ca7fd6d2a719969f889a65a0bdf0e5c59a76bf2befdac`） | `assets/v81-second-life-smelting-line.webp`（278368 B / `1bcf722c0a52d9f1d9a21f21f212ffd24dc2024de4cf6438542e2ea34b2836fd`） |
| `design-references/source-v81-zero-waste-life-furnace.png`（2855634 B / `0edc9f53062de38151c6aa36dda6f7927935d3e859741e617b9a4a61df1a5cfa`） | `assets/v81-zero-waste-life-furnace.webp`（281062 B / `9cd46d5fb20db33dca246a40722d111a9761b29bc88e7a437352204de0828e3d`） |

## 静态与浏览器门槛

- cache `v=81`，157 场景，四幕标题 / 路由 / preload / 目录；
- 解锁只读 v80；十一键、36+3、七 pending、三 activeReclaimer、四份 coverage、18 isTrusted、forget-all、v80 回归；
- 整页主初始化链必须包含 v81 全套 sync / paint / replay，禁止只测隔离模块；
- Codex 浏览器验桌面/手机、真实三段点击、三个旧场景回程、coverage/炉裁/刷新/坏档/console。

## 最终实现与独立验收状态
* 静态与自动化测试：通过 `node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check` 校验，执行 `site.test.mjs: 12967 assertions passed`；自动化回归覆盖 36 批次重塑流转与 3 种熔炉终局。
* 真实浏览器交互验收：在单 Chrome 窗口/单标签页及已停靠 DevTools 中完成手工实机验收，手工演练 4 批次并完整覆盖 3 种材料、3 种残渣与 4 种用途，验证 3 次重塑返回流，触发全部 3 种熔炉动作并精准导向 remembrance、unending-gallery 与 offering。
* 响应式布局与静态资源：桌面端 915x784 实测宽度 915 且无溢出，移动端 390x844 实测宽度 390 且无溢出；精准校验 assets/v81-regret-reclamation-plant.webp、assets/v81-abandonment-residue-weighhouse.webp、assets/v81-second-life-smelting-line.webp 与 assets/v81-zero-waste-life-furnace.webp，天然分辨率均为 1536x1024。
* 可访问性修复与无障碍树重构：排查发现 4 个交互式 figure 的 role="img" 导致 Chrome AX 树将后代按钮语义压平；Gemini 移除 figure 的 role 与 aria-label，将完整中文描述迁移至嵌套 img 的非空 alt 属性；测试严格断言 figure 语义、精准 alt 文本、3-3-4-3 按钮结构及按钮非空 aria-label。
* 诊断排查与证据留存：应用控制台零错误零警告，built-in-AI info 确认为环境底噪；排查 macOS 平台 document.hidden=true 导致的合成器全黑截图异常，通过同窗口停靠 DevTools 获取真实全尺寸截图；审查所用运行时 CSS 规范化未写入生产代码；完整留存证据文件 design-qa-evidence/v81-browser-qa.json、design-qa-evidence/v81-regret-reclamation-plant-desktop.png 与 design-qa-evidence/v81-regret-reclamation-plant-mobile.png。
* 本地状态与后续隔离：全部修改保持为未提交本地变更（uncommitted local changes），未执行任何 commit、push、部署或发布操作；v82 钩子未被触及。

## v82 活口

原谅被列为不可回收废物后，所有已经放下的伤口开始被运往世界边缘。下一站开放：

`宽恕填埋场 / FORGIVENESS LANDFILL`

它会埋葬没被接受的道歉、已经免除的债与不再索取的伤口，并追问：当伤害终于不再产生后悔，谁来证明它曾经需要被原谅。
