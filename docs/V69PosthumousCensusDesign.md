# v69 死后人口普查 / THE DEAD COUNT WHETHER YOU WERE BORN

日期：2026-08-10
状态：已实现，6227 条静态断言通过；Codex 独立浏览器证据验收完成（clean 正向真人点击仍待）
前置：v68 已覆盖三类世代、三类抵押、三类偿付，并真实收集三条止赎结局

## 一句话概念

所有年岁同时止赎后，逝代、同代与后世被召进一场不承认活人证词的死后人口普查：它们从出生证明、他人记忆与空白户籍中挑选一项证据，再投票把来访者计作已经出生、从未出生，或把这次出生记到别人名下；当三类选民、三类证据与三种裁定全部出现，人口册会把自己送进「人口注销庭」。

## 设计边界

- v69 只读 v68 的规范状态，只写独立 key `goddead_v69_posthumous_census`，绝不修改 v68 或更早状态。
- 解锁必须同时证明 v68 loans 覆盖三世代、三抵押、三偿付，并真实拥有三条 foreclosureOutcomes；只伪造结局或只覆盖 loans 均不能进入。
- 新增四个场景，场景总数 105 → 109：
  - `#posthumous-census-hall`：死后普查厅，选择投票者。
  - `#contradictory-evidence-archive`：矛盾证据库，选择存在证据。
  - `#birth-ballot-booth`：出生投票间，决定如何统计这次出生。
  - `#population-nullification-court`：人口注销庭，选择三条人口结局。
- 新增 3 × 3 × 3 = 27 份人口记录，以及 3 条人口注销结局，共 30 格 v69 图鉴。
- 合法重访相同组合会增加 ballotRuns 与对应 tallies；图鉴 records 仍只记录首次发现。
- 每次人口记录结算后，会在对应的 v68 场景留下独立普查传票：逝代落在寿命典当库、同代落在世代信贷所、后世落在死期清算厅；传票可返回普查厅继续下一轮。
- 三类投票者、三类证据与三种裁定全部覆盖后即可开启人口注销庭，不要求集齐 27 份记录。
- 所有新增交互使用原生 button、click/Enter/Space、首击落锁、短反馈后自动转场；不增加二次确认页或伪继续按钮。
- v69 不实现 v70 UI，只留下可验证的三条 nullificationOutcomes 作为未来证据。

## 解锁证据

`posthumousCensusUnlocked()` 必须从规范 `getGenerationLoans()` 同时证明：

1. `loans` 至少覆盖：
   - eras：`past / present / future`
   - collaterals：`years / death-date / funeral`
   - terms：`childhood-interest / birth-payment / descendant-rollover`
2. `foreclosureOutcomes` 精确包含：
   - `the-present-was-repossessed`
   - `death-declared-bankruptcy`
   - `the-funeral-inherited-the-family`

不得使用 v69 自己的 records、nullificationOutcomes、visited 或 pending 反向证明解锁。

Remembrance 普通入口文案：

`让死者重新统计你的出生 ⟶`

入口反馈逐字冻结：

`三份止赎判决同时翻到人口册背面：活人已经失去证明自己出生过的资格。`

## 第一幕：死后普查厅

场景：`#posthumous-census-hall`
标题：`03τ / 死后普查 · POSTHUMOUS CENSUS`
图：`assets/v69-posthumous-census-hall.webp`

近乎对称的黑暗普查大厅分成三个互不重叠的唱名席：左侧是骨灰瓮、墓牌与举起的骨手组成的逝代席；中间是带着微弱体温雾气的黑镜与并排手印组成的同代席；右侧是空摇篮、未出生轮廓与先投下的暗红选票组成的后世席。三个原生热点分别压在唱名席内部。

| electorate id | 按钮标题 | 选择反馈 | 传票落点 | 故事片段 |
| --- | --- | --- | --- | --- |
| `departed` | `逝代点名 · THE DEPARTED ANSWER ROLL` | `墓牌依次翻面。已经死去的人全部答到，唯独没有人承认见过你的出生。` | `lifetime-pawn-vault` | `逝代从坟内举手；它们声称死亡比出生更适合担任身份证明。` |
| `living` | `同代旁证 · THE LIVING VOTE SIDEWAYS` | `黑镜里的同代人先按下手印，再互相询问究竟是谁记得你第一次呼吸。` | `generational-credit-office` | `同代把彼此的记忆拼成一名证人；每个人都只记得你已经存在。` |
| `unborn` | `后世预投 · THE UNBORN CAST FIRST` | `空摇篮吐出一叠已经盖章的选票。尚未出生的人决定先统计你，再决定要不要出生。` | `mortality-clearing-house` | `后世从未来提前投票；它们把你当成一项可能取消的祖先。` |

选中后整组三按钮立即 disabled，仅选中项 `aria-pressed=true`，写入 `draft.electorate` 与 strict `electorate` pending，自动转入矛盾证据库。

## 第二幕：矛盾证据库

场景：`#contradictory-evidence-archive`
标题：`03υ / 矛盾证据 · CONTRADICTORY EVIDENCE`
图：`assets/v69-contradictory-evidence-archive.webp`

一座没有档案员的地下证据库，左 / 中 / 右三座展柜分别保存无字出生证明与脐带封蜡、装满别人童年倒影的记忆镜，以及一本每页都空白却不断自动翻动的厚重户籍。三件证物清楚分离，移动端缩放后仍能独立触达。

| evidence id | 按钮标题 | 选择反馈 | 故事片段 |
| --- | --- | --- | --- |
| `birth-certificate` | `呈交出生证明 · SUBMIT THE BIRTH CERTIFICATE` | `无字证明渗出一圈暗红脐带印。日期、姓名与父母栏仍然空着，只有纸张坚持你来过。` | `出生证明没有一个可读字符，却带着比身体更早干涸的脐带封蜡。` |
| `other-memories` | `呈交他人记忆 · SUBMIT OTHER PEOPLE'S MEMORIES` | `记忆镜轮流映出别人抱过婴儿的手；每双手都熟悉你，却没有一双属于同一个童年。` | `他人的记忆共同证明有个孩子存在，但所有人都把那孩子记成了别人。` |
| `blank-register` | `呈交空白户籍 · SUBMIT THE BLANK REGISTER` | `空白户籍自动翻到最后一页。纸面没有名字，页码却把你的缺席登记得十分完整。` | `空白户籍以没有记录为证；它声称只有真正出生过的人才有资格被漏掉。` |

选中后整组三按钮立即 disabled，仅选中项 `aria-pressed=true`，写入 `draft.evidence` 与 strict `evidence` pending，自动转入出生投票间。

## 第三幕：出生投票间

场景：`#birth-ballot-booth`
标题：`03φ / 出生投票 · BIRTH BALLOT`
图：`assets/v69-birth-ballot-booth.webp`

三个投票装置沿左 / 中 / 右排开：左侧是围住微弱心跳光点的出生印玺，中间是把婴儿影子擦成空椅的黑色计数器，右侧是将一枚脐带封蜡分接到两张空白人形上的代名机关。三项均为图内原生热点。

| verdict id | 按钮标题 | 选择反馈 | tally | 故事片段 |
| --- | --- | --- | --- | --- |
| `count-born` | `计作已出生 · COUNT AS BORN` | `印玺落下时，先出现心跳，后出现身体。人口册勉强承认你曾从零变成一。` | `tallies.born += 1` | `这一票把你计作已经出生；从此每次死亡都要补交一份出生回执。` |
| `count-never-born` | `计作从未出生 · COUNT AS NEVER BORN` | `黑色计数器从一退到零，空椅却仍留下你的体温。` | `tallies.neverBorn += 1` | `这一票把你计作从未出生；所有认识你的人因此成为错误证词。` |
| `assign-elsewhere` | `把出生记给别人 · ASSIGN THE BIRTH ELSEWHERE` | `代名机关剪断封蜡，把你的第一次呼吸接到另一张没有脸的人形上。` | `tallies.assigned += 1` | `这一票把你的出生记到别人名下；你继续活着，对方却开始拥有你的童年。` |

人口记录规范 id：

`{electorate}:{evidence}:{verdict}`

固定顺序：`ELECTORATES × EVIDENCES × VERDICTS`，即 departed 三证据各三裁定，然后 living，再 unborn；共 27 个唯一 id。

图鉴标题公式：

`{electorate 中文短名} · {evidence 中文短名} · {verdict 中文短名}`

完整 narrative / feedback 公式逐字冻结为：

`ELECTORATE[electorate].story + EVIDENCE[evidence].story + VERDICT[verdict].story`

三个片段之间各保留一个普通空格，不添加随机文案。settle 时：

1. `ballotRuns += 1`，clamp 0..9999。
2. 首次出现才把 id 加入 records；重复记录仍累计 ballotRuns 与对应 tallies。
3. 按 verdict 仅给对应 tally +1，再 clamp 0..9999；source reload 不提前计票，target reload 不重复计票。
4. `lastOutcome = id`。
5. 写入精确 activeSummons `{electorate,record,feedback}`，feedback 必须等于上述完整 narrative。
6. 清 draft，消费 pending。
7. 按 electorate 转入 lifetime-pawn-vault / generational-credit-office / mortality-clearing-house，并显露对应独立普查传票。

## 普查传票

三个 v68 落点分别新增独立容器，不复用 v68 原反馈、催收通知或图鉴：

| electorate | scene | 容器语义 |
| --- | --- | --- |
| `departed` | `lifetime-pawn-vault` | 七枚骨环旁出现逝代唱名传票，按钮返回死后普查厅 |
| `living` | `generational-credit-office` | 同代镜窗贴出旁证传票，按钮返回死后普查厅 |
| `unborn` | `mortality-clearing-house` | 产椅与族谱链之间垂下后世预投传票，按钮返回死后普查厅 |

传票正文逐字显示 activeSummons.feedback。返回按钮文案：

`带着争议出生返回普查厅 ⟶`

返回反馈逐字冻结：

`传票上的人口数字忽然少了一位，逼你带着争议出生返回普查厅。`

三组 summons-return 按钮互相独立；只有 activeSummons.electorate 对应场景的容器可见。合法返回后清 activeSummons，来源页 reload 恢复反馈、disabled 与 pressed，并只重挂一次转场。

## 覆盖、票数与注销入口

`censusCoverageComplete(state)` 要求已收集 records 同时覆盖：

- electorates：`departed / living / unborn`
- evidences：`birth-certificate / other-memories / blank-register`
- verdicts：`count-born / count-never-born / assign-elsewhere`

可用三份对角记录完成，不要求集齐 27 份。

Remembrance 记忆中的票数结论由 tallies 动态派生，不落盘：

- 唯一最高 `born`：`已出生占多数`
- 唯一最高 `neverBorn`：`未出生占多数`
- 唯一最高 `assigned`：`借名出生占多数`
- 最高票并列或三者全零：`无多数`

票数只影响记忆与注销庭内的多数提示，不隐藏三条结局；coverage 完整时三类 tally 至少各为 1。

Remembrance 注销入口文案：

`让三册人口互相注销 ⟶`

入口反馈逐字冻结：

`三类选民、三类证据与三种出生裁定已经覆盖人口册。所有名字开始争夺同一个空白。`

## 第四幕：人口注销庭

场景：`#population-nullification-court`
标题：`03χ / 人口注销 · POPULATION NULLIFICATION`
图：`assets/v69-population-nullification-court.webp`

一座像户籍机关又像选举法庭的巨大黑厅，左侧以暗红脐带印与微弱心跳追认出生，中间由空椅、被擦去的人形和倒置计数器代表人口归零，右侧是一册空白户籍坐上公民席并戴起骨瓷冠冕。三项左 / 中 / 右分离为原生热点；庭内同步显示当前三类票数与派生多数结论。

| action | 按钮标题 | outcome | target | feedback |
| --- | --- | --- | --- | --- |
| `ratify-birth` | `追认这次出生 · RATIFY THIS BIRTH` | `birth-ratified-after-death` | `threshold` | `死者在出生证明背面补盖最后一枚印。你的出生终于合法，只是批准日期晚于你的死亡。` |
| `remove-visitor` | `把来访者移出人口 · REMOVE THE VISITOR FROM THE POPULATION` | `visitor-removed-from-population` | `remembrance` | `计数器把你从一减到零。房间仍记得来访者，人口却再也查不到是谁来过。` |
| `enfranchise-blank` | `让空白户籍成为公民 · ENFRANCHISE THE BLANK REGISTER` | `blank-register-became-citizen` | `unending-gallery` | `空白户籍坐上公民席，替所有没有出生记录的人投票。你的名字被留在它从未写字的第一页。` |

三按钮可在重访时重复；nullificationOutcomes 只记录首次发现，nullificationRuns 每次合法 target arrival settle 都 +1。全部收集仅形成 v70 未来证据，不显示未实现入口。

## 状态契约

唯一 key：`goddead_v69_posthumous_census`
版本：69

默认状态：

```js
{
  version: 69,
  visited: { hall: false, archive: false, booth: false, nullification: false },
  draft: { electorate: '', evidence: '' },
  records: [],
  nullificationOutcomes: [],
  ballotRuns: 0,
  nullificationRuns: 0,
  tallies: { born: 0, neverBorn: 0, assigned: 0 },
  lastOutcome: '',
  activeSummons: null,
  pending: null
}
```

canonical 顶层精确十一键：

`version / visited / draft / records / nullificationOutcomes / ballotRuns / nullificationRuns / tallies / lastOutcome / activeSummons / pending`

- 显式投影回写精确十一键；顶层额外键、nested 额外键永不回写。
- visited 恰 `hall/archive/booth/nullification` 四布尔。
- draft 恰 `electorate/evidence` 两键；evidence 非空时 electorate 必须合法，electorate 为空时 evidence 必须为空。
- records 只保留 27 个白名单 id，按 `ELECTORATES × EVIDENCES × VERDICTS` 固定顺序去重。
- nullificationOutcomes 只保留三个 outcome，按 `ratify-birth / remove-visitor / enfranchise-blank` 对应顺序去重。
- ballotRuns / nullificationRuns 与 tallies 三值均 finite + floor + clamp 0..9999。
- tallies 精确 `{born,neverBorn,assigned}` 三键，不从 records 反推，因为重复人口记录也必须留下真实票数。
- lastOutcome 必须存在于规范 records 或 nullificationOutcomes，否则归空。
- activeSummons 仅允许 null 或精确 `{electorate,record,feedback}` 三键；record 必须已收集、electorate 等于 record 第一段、feedback 必须由三表逐字重算。
- v68 完整证据不成立时，v69 UI 与访问资格全部关闭；读取 v69 时不得借自己的 records 反向证明解锁。

## Strict pending

所有 pending 要求 `Object.keys(...).sort()` 与对应种类精确键集相等，额外键即伪造：

1. `entry`：`{kind,target,feedback}`；target=`posthumous-census-hall`，feedback 等于入口冻结句，要求实时 v68 完整证据。
2. `electorate`：`{kind,source,electorate,target,feedback}`；source=`posthumous-census-hall`，target=`contradictory-evidence-archive`，electorate / feedback 逐字表驱动，要求 draft 为空。
3. `evidence`：`{kind,source,electorate,evidence,target,feedback}`；source=`contradictory-evidence-archive`，target=`birth-ballot-booth`，electorate 必须等于 draft.electorate，evidence / feedback 逐字表驱动。
4. `ballot`：`{kind,source,electorate,evidence,verdict,outcome,target,feedback}`；source=`birth-ballot-booth`，target 必须等于 electorate 的旧场景映射，draft 必须逐字匹配，outcome / feedback 必须由三表重算。
5. `summons-return`：`{kind,from,target,record,feedback}`；from 为 lifetime-pawn-vault / generational-credit-office / mortality-clearing-house 之一且必须匹配 activeSummons.electorate，target=`posthumous-census-hall`，record 等于 activeSummons.record，feedback 等于返回冻结句。
6. `nullification-entry`：`{kind,target,feedback}`；target=`population-nullification-court`，要求实时 censusCoverageComplete。
7. `nullification`：`{kind,source,action,outcome,target,feedback}`；source=`population-nullification-court`，其余逐字重算，要求实时 coverage complete 与 nullification 已访问。

来源页 reload：恢复反馈、锁定该组全部按钮，仅已选按钮 aria-pressed=true，只重挂一次 AutoAdvance。
目标页 reload：先原子 arrival settle 再清 pending；ballot 的 runs / tallies / 图鉴与 nullification 的 runs / 图鉴均不得重复。
既非 source 也非 target：清伪造 pending，不结算、不转场。
同拍双击或多按钮竞争：第一项落锁后其余零副作用。

## 路由守卫

- posthumous-census-hall：v68 完整证据 + 合法 entry / summons-return pending target，或已真实 visited.hall。
- contradictory-evidence-archive：合法 electorate pending target，或 visited.archive + 合法 draft.electorate。
- birth-ballot-booth：合法 evidence pending target，或 visited.booth + 合法完整 draft。
- population-nullification-court：实时 coverage complete + 合法 nullification-entry pending target，或 coverage complete + visited.nullification。
- v68 证据不足时，四幕 direct hash 统一收紧到 remembrance，并隐藏全部 v69 派生 UI；不得回退更早主线场景，也不得保留 v69 pending。
- v69 ballot 结算目标（lifetime-pawn-vault / generational-credit-office / mortality-clearing-house）及对应 activeSummons 刷新/直达时，三个 v68 旧场景守卫显式认可合法规范化后的 v69 pending 与 activeSummons，不因 v68 draft 已清空而弹回 remembrance；age-foreclosure-court 仍只按 v68 自身规则守卫。

## 17 组可信交互

共 17 组 listener：

1. Remembrance 普通入口 ×1
2. electorate ×3
3. evidence ×3
4. verdict ×3
5. summons-return ×3
6. Remembrance 注销入口 ×1
7. nullification ×3

每组 listener 第一行拒绝非 `e.isTrusted` 的 click；必须同时校验 currentScene、合法 pending、AutoAdvance、按钮可见且未 disabled。反馈先出现、同组按钮立即全锁、选中按钮 aria-pressed=true，再创建 pending 与转场；reduced-motion 使用约 300ms 节拍。原生 button 的 Enter / Space 语义不另造 keydown listener。

## Remembrance 与目录

记忆行逐字格式：

`死后人口普查：已登记 N/27 份记录，共投票 R 轮；选民 逝代 D / 同代 L / 后世 U；证据 出生证 C / 他忆 M / 空户籍 B；裁定 已出生 Y / 未出生 N / 借名 A；票数 已出生 P / 未出生 Q / 借名 S；多数 V；人口注销 O/3。`

- v69 图鉴位于 v68 图鉴之后；固定 30 格：27 record + 3 nullification outcome。
- 解锁一成立，即使 v69 自身零进度，也要显示 0/27 记忆、30 格全锁图鉴、图鉴父层与普通入口。
- 普通入口仅在 v69 解锁时显示；注销入口仅在 censusCoverageComplete 时显示。
- 目录仅在对应 visited 为 true 且 v69 仍解锁时显示：
  - `03τ / 死后普查`
  - `03υ / 矛盾证据`
  - `03φ / 出生投票`
  - `03χ / 人口注销`
- “遗忘全部”移除 v69 key，并隐藏入口、目录、记忆、图鉴、普查传票；清 draft、activeSummons、反馈、disabled、aria-pressed 与 v69 AutoAdvance，不写 v68。

## 视觉资产冻结要求

最终必须保留四张原始 PNG 与四张运行时 WebP：

| 源图 | 运行时 | 用途 |
| --- | --- | --- |
| `design-references/source-v69-posthumous-census-hall.png`（1536×1024 / 2763877 B / `e9ca7ac6d487411cd833e44bb484d05cee71dd9b41b34bc9197276239ff90a11`） | `assets/v69-posthumous-census-hall.webp`（1536×1024 / 282154 B / `64f43455e580b904e9b64971264fab69879dd1501a9633c2c6b49b4fb310c975`） | 三类选民唱名席 |
| `design-references/source-v69-contradictory-evidence-archive.png`（1536×1024 / 2358950 B / `fedf01fd2387012b2e48fa21baf45ece05477d49e786543c4684d451344315d5`） | `assets/v69-contradictory-evidence-archive.webp`（1536×1024 / 197288 B / `eb19d4614995fd3ad51b3eb9a4dcb8e5e499b0e85ed9a86d555c5f42232337a5`） | 三类存在证据 |
| `design-references/source-v69-birth-ballot-booth.png`（1536×1024 / 2374547 B / `c1398a84d3b65f2daa62cf9b916512ab27f453a03d42020fb7f3a6c3370b1996`） | `assets/v69-birth-ballot-booth.webp`（1536×1024 / 196562 B / `66ad663741337486942b89d62c2e29bbf683e5dc24fa6d740e25ea8b0dd3b816`） | 三种出生裁定装置 |
| `design-references/source-v69-population-nullification-court.png`（1536×1024 / 2523596 B / `b1ec53a4c15b297ad8adcaf7702301e43222e34bc56b0134b4f5a1167758b0b2`） | `assets/v69-population-nullification-court.webp`（1536×1024 / 233442 B / `4d53bc82252683b6c92e6a4175c12c37a860ce40e89f469f25af05a1e66519e7`） | 三条人口注销结局 |

- 目标尺寸 1536×1024；若生成源图尺寸不同，只允许等比轻微归一或 LANCZOS 归一，禁止改变构图热点语义。
- 运行时统一 Pillow quality=85、method=6，无裁切。
- tests 冻结源图 + WebP 的像素尺寸、字节预算与 sha256。
- 四图均不得出现可读文字、字母、数字、水印、现代 UI、货币符号、政党标志或商标。
- 延续 Goddead 深黑、骨瓷、旧黄铜、暗红线、低饱和写实恐怖质感；三项关键物件必须左 / 中 / 右清楚分离，在移动缩放后仍可做 ≥44px 热点。

## 测试契约

以 v68 当前 5986 条断言为基线，新增测试后必须报告实际运行断言数，不能只写 all passed。至少覆盖：

1. 四源图与四 WebP 存在、尺寸、字节预算、sha256。
2. 场景 105 → 109；四 route / title / preload / cache `v=69` / directory label 冻结。
3. 3×3×3=27 record id、标题、feedback 唯一且固定顺序；3 条 nullification outcome 冻结。
4. v69 唯一 key、canonical 十一键、nested 精确键、clamp、坏类型与额外键清洗。
5. v69 解锁只能由规范 v68 coverage + 三 foreclosureOutcomes 证明，v68 缺任一项即关闭。
6. 重复人口记录不重复图鉴，但 ballotRuns 与对应 tallies 准确累加；source reload 不计票，target reload 不重计。
7. 七类 strict pending 精确键集、逐字重算、source/target/else replay、一次性消费。
8. activeSummons 三键反算，三个 v68 落点传票容器互不覆盖既有 UI。
9. 17 组 isTrusted、可见/disabled/currentScene/AutoAdvance、同拍互斥、合成 click 零副作用。
10. Remembrance 30 格图鉴、统计、多数派生、双入口、四目录、零进度入口可见可点、forget-all 清 v69。
11. 旧 v68 key 字节级不变，v63–v68 契约与既有测试继续通过。
12. 窄屏热点定位类与 ≥44px 触达；无横向溢出。

## 浏览器 QA 契约

实装后使用本地生产文件而非 mock，至少逐项记录：

- 四幕桌面 1280×720 与移动 390×844：图片 complete / naturalWidth / naturalHeight、热点在图内、零重叠、移动端 ≥44px、横向 overflow 0，并人工看图。
- locked：v68 前置不足时 v69 UI、图鉴、双入口、传票全隐藏，四幕 direct hash 回退 remembrance。
- ready-zero：完整 v68 种子 + v69 零进度时，0/27 记忆、30 格全锁、普通入口可见且 enabled、注销入口隐藏。
- representative ballot：首次 departed:birth-certificate:count-born 后 records 1/27、ballotRuns 1、tallies.born 1；目标页与 reload 不重复；重复相同 ballot 后 records 仍 1/27、ballotRuns 2、born 2。
- tallies：neverBorn / assigned 各自只增对应票；多数在唯一最高与并列时显示正确。
- summons-return：返回普查厅后对应传票消失。
- representative nullification：至少一条人口注销结局 target settle + reload 幂等；其余两条由完整静态契约覆盖时必须如实注明。
- 七类 pending 的 source/target/else、坏 JSON 与坏类型状态；来源页只调度一次可由 Node 隔离回归覆盖。
- 程序化 click 应被 17 组 isTrusted 防线拒绝且状态零变化；若无法产生真人 trusted click，必须明确写为 pending，不得把存档重播冒充 clean click。
- console warning/error=0。

## v70 活口（不实装）

当三条 nullificationOutcomes 全部真实收集后，未来开启「亡者议会」：被追认出生的人、被移出人口的人与成为公民的空白户籍组成三个幽灵选区，开始起草一部只约束活人身体的死者宪法；姓名、影子与肉身将成为三类可以分开登记的公民权。v69 只留下可验证的 nullificationOutcomes，不放置任何死入口。
