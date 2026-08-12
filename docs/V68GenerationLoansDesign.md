# v68 世代借贷 / THE GENERATIONS BORROW AGAINST DEATH

日期：2026-08-09
状态：已实现并通过静态测试；Codex 独立浏览器证据验收完成（clean 正向真人点击仍待）
前置：v67 已覆盖四祖根、三亲属、三童年，并真实收集三条家族结局

## 一句话概念

无血家族终于互认亲属后，第一件事不是团聚，而是互相借债：逝代、同代与后世都能拿七年寿命、一个死亡年份或一场尚未举行的葬礼作抵押，再决定由童年付息、出生即偿，或把债滚给后代；当三类世代、三类抵押与三类偿付全部出现，账本会把整个现在拖进「年岁止赎庭」。

## 设计边界

- v68 只读 v67 的规范状态，只写独立 key `goddead_v68_generation_loans`，绝不修改 v67 或更早状态。
- 解锁必须同时证明 v67 records 覆盖四祖根、三亲属、三童年，并真实拥有三条 familyOutcomes；只伪造 familyOutcomes 或只覆盖 records 都不能进入。
- 新增四个场景，场景总数 101 → 105：
  - `#generational-credit-office`：世代信贷所，选择出借世代。
  - `#lifetime-pawn-vault`：寿命典当库，选择抵押物。
  - `#mortality-clearing-house`：死期清算厅，选择偿付条款并生成契据。
  - `#age-foreclosure-court`：年岁止赎庭，选择三条止赎结局。
- 新增 3 × 3 × 3 = 27 份世代借据，以及 3 条止赎结局，共 30 格 v68 图鉴。
- 27 份借据不是一次性按钮：合法重访会增加 `loanRuns` 与真实账面 balances；图鉴仍只记录首次发现。
- 每份借据落地后，会在对应的 v67 家族结局落点留下独立催收通知：逝代在 threshold、同代在 remembrance、后世在 unending-gallery；通知可返回信贷所继续下一轮。
- 三类世代、三类抵押与三类偿付全部覆盖后即可开启止赎庭，不要求集齐 27 份借据。
- 所有新增交互使用原生 button、click/Enter/Space、首击落锁、短反馈后自动转场；没有二次确认页或伪继续按钮。
- v68 不实现 v69 UI，只留下可验证的三条 foreclosureOutcomes 作为未来证据。

## 解锁证据

`generationLoansUnlocked()` 必须从规范 `getBloodless()` 同时证明：

1. `records` 至少覆盖：
   - roots：`spindle / loom / nursery / room`
   - bonds：`ancestor / twin / descendant`
   - memories：`keep / exchange / return`
2. `familyOutcomes` 精确包含：
   - `you-became-common-ancestor`
   - `descendants-inherited-you`
   - `every-era-became-an-orphan`

不得使用 v68 自己的 loans、foreclosureOutcomes、visited 或 pending 反向证明解锁。

Remembrance 普通入口文案：

`让三种家族结局互相借命 ⟶`

入口反馈逐字冻结：

`三份家族结局同时翻到背面：亲属不再问谁生了谁，只问谁还能替谁偿还。`

## 第一幕：世代信贷所

场景：`#generational-credit-office`
标题：`03ο / 世代信贷 · GENERATIONAL CREDIT`
图：`assets/v68-generational-credit-office.webp`

正面、近乎对称的黑暗信贷大厅分成三个互不重叠的柜窗：左侧是骨灰与祖坟组成的逝代窗口，中间是仍有体温的镜面同代窗口，右侧是空摇篮与未出生指纹组成的后世窗口。三个原生热点分别压在柜窗内部。

| era id | 按钮标题 | 选择反馈 | 催收落点 | 故事片段 |
| --- | --- | --- | --- | --- |
| `past` | `逝代作保 · THE DEAD LEND FIRST` | `祖坟里先伸出一只签字的手。死者愿意借你东西，只因它们已经没有明天可扣。` | `threshold` | `死去的亲属把尚未腐烂的那一段时间推过窗口。` |
| `present` | `同代共债 · THE LIVING BORROW SIDEWAYS` | `镜里的同代人没有抬头，只把与你同温的手印按进契据。` | `remembrance` | `与你同时活着的亲属把自己的此刻折成两半，另一半记在你名下。` |
| `future` | `后世预支 · THE UNBORN PAY IN ADVANCE` | `空摇篮先欠下一声啼哭，尚未出生的人已经替你签了名字。` | `unending-gallery` | `还没有出生的后世从未来寄回一份已经逾期的担保。` |

选中后整组三按钮立即 disabled，仅选中项 `aria-pressed=true`，写入 `draft.era` 与 strict `era` pending，自动转入寿命典当库。

## 第二幕：寿命典当库

场景：`#lifetime-pawn-vault`
标题：`03π / 寿命典当 · LIFETIME PAWN`
图：`assets/v68-lifetime-pawn-vault.webp`

一座没有柜员的地下典当库，左 / 中 / 右三座祭台分别陈列七枚骨环、没有刻度的死期转盘、以及尚未使用的空葬台。三个物件保持清楚分离，移动端缩放后仍可独立触达。

| collateral id | 按钮标题 | 选择反馈 | 账面增量 | 故事片段 |
| --- | --- | --- | --- | --- |
| `years` | `借走七年 · BORROW SEVEN YEARS` | `柜员从七枚没有刻度的骨环里，拣出属于别人的七年。` | `balances.years += 7` | `账本替你多写七年，却把墨从某个亲属的余生里刮走。` |
| `death-date` | `借走死期 · BORROW THE DATE OF DEATH` | `黄铜转盘吐出一个没有数字的日期；从此它只知道要发生，却不知道何时。` | `balances.deathDates += 1` | `你借走一个准确的死亡年份，出借者从此只能不断临终。` |
| `funeral` | `借走葬礼 · BORROW AN UNHELD FUNERAL` | `空葬台先收下一束不存在的悼花，把尚未发生的送别折进契据。` | `balances.funerals += 1` | `一场尚未举行的葬礼提前成为抵押物，棺盖下仍没有死者。` |

账面增量只在合法 loan target arrival settle 时执行一次；来源页 reload 只恢复选择与转场，不能提前加账。

## 第三幕：死期清算厅

场景：`#mortality-clearing-house`
标题：`03ρ / 死期清算 · MORTALITY CLEARING`
图：`assets/v68-mortality-clearing-house.webp`

三个偿付装置沿左 / 中 / 右排开：被抽成利息的童年旋转木马、出生时便投下老年影子的空产椅、以及把暗红债链传向无尽后代的族谱机关。三项均为图内原生热点。

| term id | 按钮标题 | 选择反馈 | 故事片段 |
| --- | --- | --- | --- |
| `childhood-interest` | `童年付息 · INTEREST PAID IN CHILDHOOD` | `清算机先从每个借款人的童年里削下一小块，利息因此比本金更早出生。` | `利息从童年按月扣除；长大以后，借款人只记得自己曾经欠过快乐。` |
| `birth-payment` | `出生即偿 · REPAID AT BIRTH` | `产椅上的影子先老去，婴儿还没睁眼，第一期债已经到期。` | `偿付发生在出生那一刻；新生者第一次呼吸时，肺里已经有一声临终叹息。` |
| `descendant-rollover` | `债传后代 · ROLLED INTO DESCENDANTS` | `暗红链条越过尚未写下的名字，把欠款传给更晚的一代。` | `本金被滚入后代；家谱从此不是血缘证明，而是一串永不归零的账目。` |

借据规范 id：

`{era}:{collateral}:{term}`

固定顺序：`ERAS × COLLATERALS × TERMS`，即 past 三抵押各三条款，然后 present，再 future；共 27 个唯一 id。

图鉴标题公式：

`{era 中文短名} · {collateral 中文短名} · {term 中文短名}`

完整 narrative / feedback 公式逐字冻结为：

`ERA[era].story + COLLATERAL[collateral].story + TERM[term].story`

三个片段之间各保留一个普通空格，不添加随机文案。settle 时：

1. `loanRuns += 1`，clamp 0..9999。
2. 首次出现才把 id 加入 loans；重复借据仍累计 loanRuns 与对应 balances。
3. `lastOutcome = id`。
4. 写入精确 activeNotice `{era,loan,feedback}`，feedback 必须等于上述完整 narrative。
5. 清 draft，消费 pending。
6. 按 era 转入 threshold / remembrance / unending-gallery，并显露对应独立催收通知。

## 催收通知

三个旧落点分别新增独立容器，不复用 v67 家族结局反馈、v64 邮签、v63 回声或主线响应区：

| era | scene | 容器语义 |
| --- | --- | --- |
| `past` | `threshold` | 门框内出现逝代手印与契据，按钮返回世代信贷所 |
| `present` | `remembrance` | v68 图鉴之后出现同代催收单，按钮返回世代信贷所 |
| `future` | `unending-gallery` | 无终局廊挂出后世欠条，按钮返回世代信贷所 |

通知正文逐字显示 activeNotice.feedback。返回按钮文案：

`带着未还部分回到信贷所 ⟶`

返回反馈逐字冻结：

`借据上的暗红手印忽然转向，逼你把未还部分带回信贷所。`

三组 notice-return 按钮互相独立；只有 activeNotice.era 对应场景的容器可见。合法返回后清 activeNotice，来源页 reload 恢复反馈、disabled 与 pressed，并只重挂一次转场。

## 覆盖与止赎入口

`generationCoverageComplete(state)` 要求已收集 loans 同时覆盖：

- eras：`past / present / future`
- collaterals：`years / death-date / funeral`
- terms：`childhood-interest / birth-payment / descendant-rollover`

可用三份对角借据完成，不要求集齐 27 份。

Remembrance 止赎入口文案：

`让所有未还年岁同时到期 ⟶`

入口反馈逐字冻结：

`三类世代、三类抵押与三类偿付已经覆盖账本。铁闸落下，所有亲属被同时列为抵押人。`

## 第四幕：年岁止赎庭

场景：`#age-foreclosure-court`
标题：`03σ / 年岁止赎 · AGE FORECLOSURE`
图：`assets/v68-age-foreclosure-court.webp`

一座像法院又像拍卖场的巨大黑厅，左侧把「正在发生的现在」封在透明匣中，中间由空黑袍代表已经破产的死亡，右侧是一顶戴在葬礼花环上的家族冠冕。三项左 / 中 / 右分离为原生热点。

| action | 按钮标题 | outcome | target | feedback |
| --- | --- | --- | --- | --- |
| `seize-present` | `收走当下 · REPOSSESS THE PRESENT` | `the-present-was-repossessed` | `threshold` | `止赎官把正在发生的这一秒贴上封条。门外仍有人敲门，但「现在」已经不再属于来访者。` |
| `bankrupt-death` | `让死亡破产 · BANKRUPT DEATH` | `death-declared-bankruptcy` | `remembrance` | `所有死期同时申请无力清偿。死亡失去信用，只能一遍遍发生，却再也不能结清任何生命。` |
| `crown-funeral` | `让葬礼继承家族 · LET THE FUNERAL INHERIT THE FAMILY` | `the-funeral-inherited-the-family` | `unending-gallery` | `没有死者的葬礼戴上家族冠冕。此后每一代都只是它暂时还活着的亲属。` |

三按钮可在重访时重复；foreclosureOutcomes 只记录首次发现，foreclosureRuns 每次合法 target arrival settle 都 +1。全部收集仅形成 v69 未来证据，不显示未实现入口。

## 状态契约

唯一 key：`goddead_v68_generation_loans`
版本：68

默认状态：

```js
{
  version: 68,
  visited: { office: false, vault: false, clearing: false, foreclosure: false },
  draft: { era: '', collateral: '' },
  loans: [],
  foreclosureOutcomes: [],
  loanRuns: 0,
  foreclosureRuns: 0,
  balances: { years: 0, deathDates: 0, funerals: 0 },
  lastOutcome: '',
  activeNotice: null,
  pending: null
}
```

canonical 顶层精确十一键：

`version / visited / draft / loans / foreclosureOutcomes / loanRuns / foreclosureRuns / balances / lastOutcome / activeNotice / pending`

- 显式投影回写精确十一键；顶层额外键、nested 额外键永不回写。
- visited 恰 `office/vault/clearing/foreclosure` 四布尔。
- draft 恰 `era/collateral` 两键；collateral 非空时 era 必须合法，era 为空时 collateral 必须为空。
- loans 只保留 27 个白名单 id，按 `ERAS × COLLATERALS × TERMS` 固定顺序去重。
- foreclosureOutcomes 只保留三个 outcome，按 `seize-present / bankrupt-death / crown-funeral` 对应顺序去重。
- loanRuns / foreclosureRuns 与 balances 三值均 finite + floor + clamp 0..9999；years 每次合法 years 借据 +7 后再 clamp。
- balances 精确 `{years,deathDates,funerals}` 三键，不从 loans 反推，因为重复借据也必须留下真实账面。
- lastOutcome 必须存在于规范 loans 或 foreclosureOutcomes，否则归空。
- activeNotice 仅允许 null 或精确 `{era,loan,feedback}` 三键；loan 必须已收集、era 等于 loan 第一段、feedback 必须由三表逐字重算。
- v67 完整证据不成立时，v68 UI 与访问资格全部关闭；读取 v68 时不得借自己的 loans 反向证明解锁。

## Strict pending

所有 pending 要求 `Object.keys(...).sort()` 与对应种类精确键集相等，额外键即伪造：

1. `entry`：`{kind,target,feedback}`；target=`generational-credit-office`，feedback 等于入口冻结句，要求实时 v67 完整证据。
2. `era`：`{kind,source,era,target,feedback}`；source=`generational-credit-office`，target=`lifetime-pawn-vault`，era / feedback 逐字表驱动，要求 draft 为空。
3. `collateral`：`{kind,source,era,collateral,target,feedback}`；source=`lifetime-pawn-vault`，target=`mortality-clearing-house`，era 必须等于 draft.era，collateral / feedback 逐字表驱动。
4. `loan`：`{kind,source,era,collateral,term,outcome,target,feedback}`；source=`mortality-clearing-house`，target 必须等于 era 的旧场景映射，draft 必须逐字匹配，outcome / feedback 必须由三表重算。
5. `notice-return`：`{kind,from,target,loan,feedback}`；from 为 threshold / remembrance / unending-gallery 之一且必须匹配 activeNotice.era，target=`generational-credit-office`，loan 等于 activeNotice.loan，feedback 等于返回冻结句。
6. `foreclosure-entry`：`{kind,target,feedback}`；target=`age-foreclosure-court`，要求实时 generationCoverageComplete。
7. `foreclosure`：`{kind,source,action,outcome,target,feedback}`；source=`age-foreclosure-court`，其余逐字重算，要求实时 coverage complete 与 foreclosure 已访问。

来源页 reload：恢复反馈、锁定该组全部按钮，仅已选按钮 aria-pressed=true，只重挂一次 AutoAdvance。
目标页 reload：先原子 arrival settle 再清 pending；loan 的 runs / balances / 图鉴与 foreclosure 的 runs / 图鉴均不得重复。
既非 source 也非 target：清伪造 pending，不结算、不转场。
同拍双击或多按钮竞争：第一项落锁后其余零副作用。

## 路由守卫

- generational-credit-office：v67 完整证据 + 合法 entry / notice-return pending target，或已真实 visited.office。
- lifetime-pawn-vault：合法 era pending target，或 visited.vault + 合法 draft.era。
- mortality-clearing-house：合法 collateral pending target，或 visited.clearing + 合法完整 draft。
- age-foreclosure-court：实时 coverage complete + 合法 foreclosure-entry pending target，或 coverage complete + visited.foreclosure。
- v67 证据不足时，四幕 direct hash 统一收紧到 remembrance，并隐藏全部 v68 派生 UI；不得回退更早主线场景，也不得保留 v68 pending。

## 17 组可信交互

共 17 组 listener：

1. Remembrance 普通入口 ×1
2. era ×3
3. collateral ×3
4. term ×3
5. notice-return ×3
6. Remembrance 止赎入口 ×1
7. foreclosure ×3

每组 listener 第一行拒绝非 `e.isTrusted` 的 click；必须同时校验 currentScene、合法 pending、AutoAdvance、按钮可见且未 disabled。反馈先出现、同组按钮立即全锁、选中按钮 aria-pressed=true，再创建 pending 与转场；reduced-motion 使用约 300ms 节拍。原生 button 的 Enter / Space 语义不另造 keydown listener。

## Remembrance 与目录

记忆行逐字格式：

`世代借贷：已立 N/27 份契据，共运行 R 轮；出借 逝代 P / 同代 L / 后世 F；抵押 七年 Y / 死期 D / 葬礼 U；偿付 童年 C / 出生 B / 后代 H；账面 七年 A / 死期 E / 葬礼 G；止赎 O/3。`

- v68 图鉴位于 v67 图鉴之后；固定 30 格：27 loan + 3 foreclosure outcome。
- 解锁一成立，即使 v68 自身零进度，也要显示 0/27 记忆、30 格全锁图鉴、图鉴父层与普通入口；不能重演 v66/v67 的 0×0 入口问题。
- 普通入口仅在 v68 解锁时显示；止赎入口仅在 generationCoverageComplete 时显示。
- 目录仅在对应 visited 为 true 且 v68 仍解锁时显示：
  - `03ο / 世代信贷`
  - `03π / 寿命典当`
  - `03ρ / 死期清算`
  - `03σ / 年岁止赎`
- “遗忘全部”移除 v68 key，并隐藏入口、目录、记忆、图鉴、催收通知；清 draft、activeNotice、反馈、disabled、aria-pressed 与 v68 AutoAdvance，不写 v67。

## 视觉资产冻结要求

最终必须保留四张原始 PNG 与四张运行时 WebP：

| 源图 | 运行时 | 用途 |
| --- | --- | --- |
| `design-references/source-v68-generational-credit-office.png`（1536×1024 / 2529737 B / `8ba105cafdd282fffac7c8ca1fc260eb5b1c0f3cd4c8c12e9e4bb5b711deaa8c`） | `assets/v68-generational-credit-office.webp`（1536×1024 / 239274 B / `efc50ecfe7226738fc67cb913c4d7e8e3c098a07e70b87d2df74bd4085efc44e`） | 三世代信贷柜窗 |
| `design-references/source-v68-lifetime-pawn-vault.png`（1536×1024 / 2396491 B / `22c9709b71180ff001efd34e3f666f2fbdcfe405b14325bb0d2b08edb5498774`） | `assets/v68-lifetime-pawn-vault.webp`（1536×1024 / 185088 B / `77df1f55bc724c43c4835e483b41ad0d6a81ae4b111f1de44e3a8fe525774033`） | 三类抵押祭台 |
| `design-references/source-v68-mortality-clearing-house.png`（1536×1024 / 2565447 B / `bb3aab732ce4995f96a07f5a7cec3c0667e21812db5cd6c322afcf78feccde4f`） | `assets/v68-mortality-clearing-house.webp`（1536×1024 / 237126 B / `d707458bb82eb9b2535bdb87a086eda97c273c68bb39280325e149f6b95ed21b`） | 三类偿付装置 |
| `design-references/source-v68-age-foreclosure-court.png`（1536×1024 / 2750588 B / `567ff3cc18e10cbe4b657ca73d42e8a99452571b8315250e101a44449692a792`） | `assets/v68-age-foreclosure-court.webp`（1536×1024 / 264964 B / `aa0b505d9e179cf3a7dc3e01e145b0f2cc4f45f766f719246fd83770bff87572`） | 三条止赎结局 |

- 目标尺寸 1536×1024；若生成源图尺寸不同，只允许等比轻微归一或 LANCZOS 归一，禁止改变构图热点语义。
- 运行时统一 Pillow quality=85、method=6，无裁切。
- tests 冻结源图 + WebP 的像素尺寸、字节预算与 sha256。
- 四图均不得出现可读文字、字母、数字、水印、现代 UI、货币符号或商标。
- 延续 Goddead 深黑、骨瓷、旧黄铜、暗红线、低饱和写实恐怖质感；三项关键物件必须左 / 中 / 右清楚分离，在移动缩放后仍可做 ≥44px 热点。

## 测试契约

以 v67 当前 5744 条断言为基线，新增测试后必须报告实际运行断言数，不能只写 all passed。至少覆盖：

1. 四源图与四 WebP 存在、尺寸、字节预算、sha256。
2. 场景 101 → 105；四 route / title / preload / cache `v=68` / directory label 冻结。
3. 3×3×3=27 loan id、标题、feedback 唯一且固定顺序；3 条 foreclosure outcome 冻结。
4. v68 唯一 key、canonical 十一键、nested 精确键、clamp、坏类型与额外键清洗。
5. v68 解锁只能由规范 v67 coverage + 三 familyOutcomes 证明，v67 缺任一项即关闭。
6. 重复借据不重复图鉴，但 loanRuns 与 balances 按类型准确累加；source reload 不加账，target reload 不重计。
7. 七类 strict pending 精确键集、逐字重算、source/target/else replay、一次性消费。
8. activeNotice 三键反算，三个旧落点催收容器互不覆盖既有 UI。
9. 17 组 isTrusted、可见/disabled/currentScene/AutoAdvance、同拍互斥、合成 click 零副作用。
10. Remembrance 30 格图鉴、统计、双入口、四目录、零进度入口可见可点、forget-all 清 v68。
11. 旧 v67 key 字节级不变，v63–v67 契约与既有测试继续通过。
12. 窄屏热点定位类与 ≥44px 触达；无横向溢出。

## 浏览器 QA 契约

实装后用本地生产文件而非 mock 验收。本段独立浏览器证据验收完成（clean 正向真人点击仍待），结果如下：

- 四幕视觉：桌面 1280×720 与移动 390×844（真实 390×844 iframe viewport）：四幕 active、四张图片 complete 且 natural 1536×1024、热点均在图内/零重叠/≥44px、横向 overflow 0；人工看图通过。
- locked：浏览器确认 v68 UI、图鉴、普通入口与催收通知全隐藏；四幕 direct hash 回退 `#remembrance` 的守卫由代码审计与 5986 静态断言覆盖。
- ready-zero：完整 v67 种子但 v68 零进度时，浏览器确认记忆 0/27、30 格图鉴全锁、普通入口可见且 enabled、止赎入口隐藏；clean 正向真人点击仍待真人输入验收，合法 pending source/target replay 覆盖转场与恢复契约。
- ready-coverage：浏览器确认覆盖 loans 后显示止赎入口、统计与 30 格图鉴；四目录链接显隐由静态断言覆盖。
- balances：首次 past:years:childhood-interest 后 1/27、loanRuns 1、years 7；目标页与 Remembrance 刷新后仍为 1/1/7，不重复结算。重复同一合法借贷后仍 1/27，loanRuns 2、years 14。death-date / funeral 各 +1。
- notice-return：返回信贷所后 threshold 催收通知消失。
- foreclosure：浏览器代表性结算 seize-present 1/3 通过（loans 3/27、foreclosureOutcomes 1/3、foreclosureRuns 对应累加）；三条止赎结局的冻结表、规范化、监听与 pending 路径由 5986 静态断言覆盖。未来钩子仍要求真实集齐 3/3，不改设计语义。
- 坏档：draft / loans / foreclosureOutcomes / balances / activeNotice / pending 的错类型与额外键不报错、不放宽入口；坏 JSON 安全归零后入口仍可用、图鉴 0 解锁。
- 七类 pending（entry/era/collateral/loan/notice-return/foreclosure-entry/foreclosure）：浏览器确认来源页 reload 保留反馈与锁按钮，目标页 reload 均结算，else 场景清除伪 pending 并回退 remembrance，loan / foreclosure 直接抵达刷新不重复计数；来源页「只调度一次」由 Node 隔离回归测试的 scheduleCalls 计数覆盖。
- isTrusted：Playwright/Codex 程序化 click 被 17 组 `e.isTrusted` 防线拒绝，状态零变化。
- 全程 console warning/error=0。

## v69 活口（不实装）

当三条 foreclosureOutcomes 全部真实收集后，未来开启「死后人口普查」：逝代、同代与后世不再争论谁欠谁，而要共同投票决定来访者究竟有没有出生；出生证明、他人记忆与一张空白户籍将成为三类互相矛盾的存在证据。v68 只留下可验证的 foreclosureOutcomes，不放置任何死入口。
