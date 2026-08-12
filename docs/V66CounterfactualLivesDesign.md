# v66 反事实纺生设计案 / THE LIFE THAT NEVER HAPPENED

日期：2026-08-09
状态：已实现并通过静态测试与 Codex 内置浏览器独立验收
前置：v65「因果疤痕」12 条处理与 3 条无因结局全部真实收集

## 一句话概念

四道因果疤痕与无因收容室的三个结局全部齐全后，疤痕不再等待治疗，而开始把「本可发生却从未活过」的人生纺出来。玩家依次选择一处起点、一种疤痕处理方式与一种生涯归属，组合成 4 × 3 × 3 = 36 条未活之生；覆盖四起点、三处理、三归属后，再开启三种元结局。

## 目标与边界

- v66 不重复 v65 的 12+3 单层收集结构，改为三段式组合生成器，提供 36 条稳定、可重复探索的组合分支。
- 新增四个场景：反事实纺锤室、疤痕织机、未活育婴室、无因生涯陈列间；场景总数 93 → 97。
- 新增 36 条未活之生图鉴 + 3 条元结局图鉴，共 39 条。
- 每次完整纺生必须经过 origin → method → inheritance 三步；不能跳步、伪造 draft 或从地址栏绕过守卫。
- 完成一次纺生后，对应旧起点场景出现一枚「未活回声」，显示该组合的完整叙事并可返回纺锤室继续下一轮。
- v66 只读 v65 的规范 `treatments` 与 `roomOutcomes`，只写自己的状态键，不改 v65、v64 或任何更早状态。
- 旧场景主玩法、v64 未来邮签、v65 因果疤痕舞台继续保留；v66 回声使用独立容器，不抢旧按钮、旧反馈区或旧 AutoAdvance 锁。

## 解锁证据

唯一可信前置函数 `counterfactualLivesUnlocked()`：

1. 调用现有 `getCausalScar()` 获得已规范化的 v65 状态。
2. `treatments` 必须逐项覆盖固定顺序的 12 个 `destination:method`：
   - destination：`threshold / protocol / watch / offering`
   - method：`stitch / drain / graft`
3. `roomOutcomes` 必须逐项覆盖 `become-cause / refuse-cause / ending-adopts`。
4. 不信任 `treatmentRuns`、`roomRuns`、`lastOutcome`、raw localStorage、visited 或单独布尔值。
5. 当前 v65 证据若被旧版本规范器判失效，v66 的入口、目录、记忆、图鉴、回声与路由资格全部回弹；v66 不反向修补 v65。

## 场景一：反事实纺锤室

路由：`#counterfactual-spindle`
目录：`03η / 反事实纺锤`
素材：`assets/v66-counterfactual-spindle.webp`

入口：Remembrance 新按钮 `counterfactual-entry-btn`，文案 `把十五道伤口纺成一生 ⟶`。仅在 `counterfactualLivesUnlocked()` 为真时显示。

画面：黑石与旧黄铜构成的地下纺线室，中央是一枚竖直反事实纺锤；四股来自不同方向的线分别穿过门槛裂缝、守则纸卷、值夜灯罩、焚献灰匣，形成四个清晰且彼此不重叠的可点区域。

四个 origin 热点：

| origin | 按钮 id | 中文 | English | 下一幕 |
| --- | --- | --- | --- | --- |
| `threshold` | `counterfactual-origin-threshold` | 从尚未敲门处出生 | BORN BEFORE THE KNOCK | `scar-loom` |
| `protocol` | `counterfactual-origin-protocol` | 从守则写下你处出生 | BORN WHERE THE RULE WROTE YOU | `scar-loom` |
| `watch` | `counterfactual-origin-watch` | 从值夜记住你处出生 | BORN WHERE NIGHT KEPT YOUR NAME | `scar-loom` |
| `offering` | `counterfactual-origin-offering` | 从焚献为你留灰处出生 | BORN WHERE ASH MADE ROOM | `scar-loom` |

选择 origin 后写合法 pending；到达疤痕织机前原子提交 `draft={origin,method:""}`。重访入口开始新一轮时必须清掉旧的 draft 与已完成回声，但不删除已收集 lives。

## 场景二：疤痕织机

路由：`#scar-loom`
目录：`03θ / 疤痕织机`
素材：`assets/v66-scar-loom.webp`

画面：一架横向黑铁织机，左侧是暗红缝针与回缝线，中央是盛接黑色后果的引流槽，右侧是把空白见证面具压入布面的移植臂；三件机制清晰分离。

三个 method 热点：

| method | 按钮 id | 中文 | English | 下一幕 |
| --- | --- | --- | --- | --- |
| `stitch` | `counterfactual-method-stitch` | 用缝合留下骨架 | STITCH A SKELETON FOR THE LIFE | `unlived-nursery` |
| `drain` | `counterfactual-method-drain` | 放尽它未有的后果 | DRAIN THE CONSEQUENCE IT NEVER HAD | `unlived-nursery` |
| `graft` | `counterfactual-method-graft` | 移植一个目击者 | GRAFT A WITNESS INTO IT | `unlived-nursery` |

直达必须要求 `draft.origin` 合法且 `draft.method===""`；选择 method 后到达下一幕前提交规范 `draft={origin,method}`。

## 场景三：未活育婴室

路由：`#unlived-nursery`
目录：`03ι / 未活育婴`
素材：`assets/v66-unlived-nursery.webp`

画面：同一间黑石育婴室里有三个独立承载物：左侧由红线牵引、会自行转动的无脸木偶；中央连接黑色引流管、只盛着影子的空摇篮；右侧被厚重终局裹布抱住的儿童高椅。三者分别代表成因、后果与被结局收养。

三个 inheritance 热点：

| inheritance | 按钮 id | 中文 | English |
| --- | --- | --- | --- |
| `cause` | `counterfactual-life-cause` | 让此生成为原因 | LET THE LIFE BECOME A CAUSE |
| `consequence` | `counterfactual-life-consequence` | 让此生只作后果 | LET THE LIFE REMAIN A CONSEQUENCE |
| `ending` | `counterfactual-life-ending` | 让结局把它养大 | LET AN ENDING RAISE THE LIFE |

选择 inheritance 后生成唯一 life id：`origin:method:inheritance`。合法 id 总数严格为 36，排序固定为 `ORIGINS × METHODS × INHERITANCES`。

### 36 条叙事的冻结生成规则

生产代码以三个冻结表组合标题与反馈，不允许从 DOM 文本或 raw state 拼凑：

Origin 片段：

| id | 图鉴前缀 | 叙事片段 |
| --- | --- | --- |
| `threshold` | `门前未生` / `UNBORN AT THE THRESHOLD` | 它在第一下敲门之前已经拥有童年； |
| `protocol` | `守则所写` / `WRITTEN BY THE RULE` | 它从一条没有主语的守则里学会呼吸； |
| `watch` | `夜班留名` / `NAMED BY THE NIGHT SHIFT` | 它被值夜簿记住，早于任何人为它取名； |
| `offering` | `灰中留位` / `A PLACE KEPT IN ASH` | 焚献后的灰先为它空出一生的位置； |

Method 片段：

| id | 图鉴中缀 | 叙事片段 |
| --- | --- | --- |
| `stitch` | `缝骨` / `STITCH-BONED` | 疤痕把不存在的年月逐针缝成骨架； |
| `drain` | `尽果` / `CONSEQUENCE-DRAINED` | 它一出生就被放尽了本该追上来的后果； |
| `graft` | `植证` / `WITNESS-GRAFTED` | 一个从未见过它的人被移植成终身目击者； |

Inheritance 片段：

| id | 图鉴后缀 | 叙事片段 |
| --- | --- | --- |
| `cause` | `成因生` / `CAUSE-BORN` | 最后，它长成了使你来到这里的原因。 |
| `consequence` | `后果生` / `CONSEQUENCE-BORN` | 最后，它只作为你尚未做过之事的后果活着。 |
| `ending` | `终局养` / `ENDING-RAISED` | 最后，一个结局把它抚养到比开端更老。 |

图鉴标题格式固定为：`{Origin 图鉴前缀} · {Method 图鉴中缀} · {Inheritance 图鉴后缀}`。反馈为三个叙事片段逐字无空格连接。由固定表可得到 36 个唯一标题、唯一 id 与唯一反馈。

结算目标是所选 origin 对应的旧场景。到达前原子：加入 lives（首次才增加发现数）、`lifeRuns+1`、写 lastOutcome、写精确 activeEcho、清 draft 与 pending。旧场景显示完整反馈和返回按钮。

## 四处旧场景的未活回声

四个独立按钮，不复用 v64 邮签或 v65 疤痕按钮：

| origin | 容器 id | 返回按钮 id | 文案 |
| --- | --- | --- | --- |
| `threshold` | `counterfactual-echo-threshold` | `counterfactual-echo-return-threshold` | 把未活过的自己送回纺锤 ⟶ |
| `protocol` | `counterfactual-echo-protocol` | `counterfactual-echo-return-protocol` | 把守则漏写的一生送回纺锤 ⟶ |
| `watch` | `counterfactual-echo-watch` | `counterfactual-echo-return-watch` | 把夜班多记的一生送回纺锤 ⟶ |
| `offering` | `counterfactual-echo-offering` | `counterfactual-echo-return-offering` | 把灰中多出的一生送回纺锤 ⟶ |

`activeEcho` 必须精确反算到已经收集的 life，origin 与 id 首段一致，feedback 与三表组合逐字一致。返回只清 activeEcho/draft 并进入纺锤，不删除 lives。

## 场景四：无因生涯陈列间

路由：`#life-without-cause`
目录：`03κ / 无因生涯`
素材：`assets/v66-life-without-cause.webp`

解锁 `counterfactualCoverageComplete()`：已收集 lives 同时覆盖四个 origin、三个 method、三个 inheritance。按最优选择至少四轮可开；不要求收满 36 条。

入口：Remembrance 按钮 `counterfactual-meta-entry-btn`，文案 `让所有未活之生互认亲属 ⟶`。

画面：深黑档案陈列间中央悬着由许多细线叠成的人形外衣；左侧是一口装满空白婴儿名牌的浅墓；右侧是一枚仍在自行转动、线头穿入无尽黑廊的纺锤。三处清晰分离。

三个元结局：

| action | 按钮 id | outcome | 标题 | 反馈 | target |
| --- | --- | --- | --- | --- | --- |
| `wear-lives` | `counterfactual-meta-wear-lives` | `many-lives-wear-you` | 群生着身 · THE MANY LIVES WEAR YOU | 三十六种未活之生把你当作唯一合身的身体。 | `threshold` |
| `bury-lives` | `counterfactual-meta-bury-lives` | `unlived-bury-themselves` | 未生自葬 · THE UNLIVED BURY THEMSELVES | 空白名牌一枚枚躺下，替从未出生者完成自己的葬礼。 | `remembrance` |
| `leave-spindle` | `counterfactual-meta-leave-spindle` | `spindle-outlives-endings` | 纺锤不眠 · THE SPINDLE OUTLIVES ENDINGS | 你离开后，纺锤继续替所有已经结束的故事制造童年。 | `unending-gallery` |

三个动作可在重访时重复；`metaOutcomes` 只记首次发现，`metaRuns` 每次合法到达结算都 +1。

## v66 独立状态

唯一 key：`goddead_v66_counterfactual_lives`
版本：66
canonical 顶层恰好十键：

```json
{
  "version": 66,
  "visited": {
    "spindle": false,
    "loom": false,
    "nursery": false,
    "room": false
  },
  "draft": {
    "origin": "",
    "method": ""
  },
  "lives": [],
  "metaOutcomes": [],
  "lifeRuns": 0,
  "metaRuns": 0,
  "lastOutcome": "",
  "activeEcho": null,
  "pending": null
}
```

规范化规则：

- raw 非对象、数组、坏 JSON、错 version：整体回默认值。
- 保存时显式重建十键；顶层额外键、nested 额外键永不回写。
- `visited` 恰四个布尔；`draft` 恰 `origin/method` 两键。method 非空时 origin 必须合法；origin 为空时 method 必须为空。
- `lives` 只保留 36 个白名单 id，按 `ORIGINS × METHODS × INHERITANCES` 固定顺序去重。
- `metaOutcomes` 只保留三个元结局 outcome，按表顺序去重。
- `lifeRuns/metaRuns` 使用 finite + floor + clamp 0..9999。
- `lastOutcome` 必须存在于规范 lives 或 metaOutcomes，否则归空。
- `activeEcho` 仅允许 `null` 或精确 `{origin,life,feedback}` 三键；life 必须已收集、origin 必须等于 life 首段、feedback 必须由冻结三表逐字重算。
- 当前 v65 完整证据不成立时，v66 派生 UI 与访问资格全部关闭；读取 v66 时不得借自己的 lives 反向证明解锁。

## Strict pending

所有 pending 要求 `Object.keys(...).sort()` 与种类的精确键集相等，额外键即伪造：

1. `entry`：`{kind,target,feedback}`，target=`counterfactual-spindle`，要求 v65 完整证据。
2. `origin`：`{kind,source,origin,target,feedback}`，source=`counterfactual-spindle`，target=`scar-loom`，origin/feedback 逐字表驱动，要求 draft 为空。
3. `method`：`{kind,source,origin,method,target,feedback}`，source=`scar-loom`，target=`unlived-nursery`，origin 必须等于当前 draft.origin、method/feedback 逐字表驱动。
4. `life`：`{kind,source,origin,method,inheritance,outcome,target,feedback}`，source=`unlived-nursery`，target 必须等于 origin，draft 必须逐字匹配，outcome 与 feedback 必须由三表重算。
5. `echo-return`：`{kind,from,target,life,feedback}`，from 为四 origin，target=`counterfactual-spindle`，life/feedback 必须等于当前有效 activeEcho。
6. `meta-entry`：`{kind,target,feedback}`，target=`life-without-cause`，要求实时 coverage complete。
7. `meta`：`{kind,source,action,outcome,target,feedback}`，source=`life-without-cause`，其余逐字重算，要求实时 coverage complete 与 room 已访问。

来源页 reload：恢复反馈，锁定该组全部按钮，仅已选按钮 `aria-pressed=true`，只重挂一次 AutoAdvance。
目标页 reload：先原子 arrival settle 再清 pending，不重复 runs/图鉴。
既非 source 也非 target：清伪造 pending，不结算、不转场。
同拍双击/多个按钮竞争：第一项落锁后其余零副作用。

## 路由守卫

- `counterfactual-spindle`：v65 完整证据 + 合法 entry/echo-return pending，或已真实 visited.spindle。
- `scar-loom`：合法 origin pending target，或 visited.loom + 合法 draft.origin。
- `unlived-nursery`：合法 method pending target，或 visited.nursery + 合法完整 draft。
- `life-without-cause`：合法 meta-entry pending target，或 coverage complete + visited.room。
- 守卫置于通用分支路由之后、scene 切换之前，回退统一为 `remembrance`；不得放宽 v63/v64/v65 守卫。

## 交互与可访问性

v66 恰好 19 个新增 click listener：

- Remembrance 普通入口 1
- origin 4
- method 3
- inheritance 3
- 四处 echo-return 4
- Remembrance meta 入口 1
- meta ending 3

每个 listener：

- 第一行拒绝非 `e.isTrusted` 的 click。
- currentScene、合法前置、合法 pending、AutoAdvance、按钮可见且未 disabled/hidden 先于副作用。
- 原生 button 支持 Enter/Space；不额外伪造 keydown click。
- 热点桌面与 390px 窄屏宽高均 ≥44px，图内无重叠、无横向溢出。
- feedback 使用独立 `aria-live="polite"`；pending 时整组 disabled，只有所选项 aria-pressed=true。
- reduced-motion 延续现有短节拍，不变成同步跳转。

## Remembrance / 图鉴 / 遗忘

- 入口与 meta 入口按各自条件独立显示；普通入口可在完整 v65 后反复进入。
- 记忆行：`未活之生：已纺成 N/36；起点 门外 T / 守则 P / 值夜 W / 焚献 O；处理 缝合 S / 引流 D / 移植 G；归属 成因 C / 后果 Q / 终局 E；元结局 M/3。`
- 图鉴置于 v65 之后：36 个 life cell + 3 个 meta cell；未解锁显示 `？？？`。
- 目录仅在对应 visited 为真后恢复四项。
- “遗忘全部”移除 v66 key，并隐藏入口、目录、记忆、图鉴、回声；清 draft、activeEcho、反馈、disabled、aria-pressed 与 v66 AutoAdvance，不写 v65。

## 视觉资产冻结位

四张 source PNG 与运行时 WebP 均由内置 ImageGen 生成；最终需记录尺寸、字节、sha256，并在测试中同时锁 source 与 WebP：

| Source PNG | Runtime WebP | 用途 |
| --- | --- | --- |
| `design-references/source-v66-counterfactual-spindle.png`（1536×1024 / 2277767 B / `696b7ac49bd2d78f1385db64e16750a7d8b3467e65c9ebf22122f4123cce466f`） | `assets/v66-counterfactual-spindle.webp`（1536×1024 / 155312 B / `e3bc077f1a08b4e72cd68fdabef17a398c8a723d50954abb848d6e6c3558f567`） | 四起点纺锤室 |
| `design-references/source-v66-scar-loom.png`（1536×1024 / 1896865 B / `8953f659b2f0b5da4dd13f32de7a736cc389c2ec24e1d220f5fc80bacfc74f95`） | `assets/v66-scar-loom.webp`（1536×1024 / 126188 B / `cc2214832b150273bbbe1e76885d08d32ce597c12d75db9c1ad210f9148dcaa5`） | 三处理织机 |
| `design-references/source-v66-unlived-nursery.png`（1536×1024 / 1802787 B / `c7bbdc0d8ddb172a075f79e4ab079e5efc815b4d84179e6bfc178f8af258e0ee`） | `assets/v66-unlived-nursery.webp`（1536×1024 / 97276 B / `9206089ed62bc306874d11081129cb9ad56c914cd54477f22c2deb173f0923b6`） | 三归属育婴室 |
| `design-references/source-v66-life-without-cause.png`（1536×1024 / 1908365 B / `750672d1556c5311337fa0c2c5bf4699d9c16d6934377653ace4a4ffd19e099a`） | `assets/v66-life-without-cause.webp`（1536×1024 / 103830 B / `d62385c470d8bd0ce82c5636ef0a42856ad8bb7bfce4b49c281c27ca79358efd`） | 三元结局陈列间 |

四张 source PNG 均为内置 ImageGen 原生 1536×1024；运行时 WebP 使用 Pillow quality=85、method=6 无裁切转码。

## 测试门槛

1. `node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`、`git diff --check` 全绿。
2. 四 source + 四 WebP 的尺寸、字节、sha256 冻结；WebP 1536×1024、Pillow q85 method=6、无裁切。
3. 场景数恰 97；缓存 `styles.css?v=66`、`script.js?v=66`。
4. 36 个 life id/title/feedback 全唯一、可枚举且排序固定；3 个 meta outcome 全唯一。
5. v66 raw localStorage 顶层恰十键；坏类型、额外键、错 version、坏 draft、未知 life、伪造 echo/pending 全部规范化。
6. 七类 strict pending 的 source/target/else reload 矩阵、一次性 settle、runs 重访累计、图鉴首次去重全部覆盖。
7. direct route 守卫不能跳过 origin/method/inheritance；旧 v63/v64/v65 存储契约与 guard 字节级/结构级回归不变。
8. 19 组 isTrusted、可见/disabled、currentScene、AutoAdvance、同拍互斥与合成 click 零副作用覆盖。
9. 四旧场景 v64 邮签、v65 疤痕舞台、v66 activeEcho 可同时正确显隐；互不复用 response/id/锁。
10. Remembrance 39 格图鉴、记忆统计、四目录、双入口与 forget-all 全覆盖。

## 浏览器验收清单

- 桌面 1280×720 与移动 390×844：四幕 active、四张图片 complete 1536×1024、热点均在图内/零重叠/≥44px、scrollWidth 等于视口。
- locked：无完整 v65 证据直达四幕全部回 `#remembrance`，所有 v66 UI 隐藏。
- ready：完整 v65 种子显示普通入口；覆盖种子同时显示 meta 入口、记忆统计、39 格图鉴与目录。
- 坏档：draft/lives/metaOutcomes/activeEcho/pending 的错类型与额外键不报错、不放宽入口。
- pending replay：entry、origin、method、life source/target、echo-return、meta-entry、meta source/target 逐项实测反馈/锁/pressed/一次性计数。
- 真实点击受 `e.isTrusted` 限制时，自动化零副作用要明确记录；无法由工具产生的 clean 真人点击/双击/Enter/Space 不冒充通过。
- 全程 console warning/error=0。
