# v57 判词后果层 / THE VERDICT NEEDS A BODY

## 目标

沿 v56 深化：四类判定结果不再只是不同文案然后回旧房间，而是长出可玩的责任分支：

- v56 深查、预算、报告计分、编组计分语义全部保留；只在原目的地前插入后果场景。
- 12 个后果动作 + 3 个责任账动作，留下四种责任分值（共证/修复/转嫁/自担）并改变后续出口。
- 第三个不同后果场景首次结算时，责任账房首次改道接管；之后可经目录重访。
- 全部主交互为图内原生 button 热点，点击/键盘一拍反馈后自动转场，无底部继续按钮。

## 素材（冻结；四张自 v56 改名升格，一张本轮新增）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v57-concordance-theatre.png` | `76c8b89927d5e61b79bd833f861b9c66e2677844c418630c2fd02989907bea15` |
| `design-references/source-v57-innocent-quarantine.png` | `791a5775efd51e910d403e4d837337e825d2db084589ed00750dd20cb9ab771d` |
| `design-references/source-v57-misbound-handover.png` | `31fdabaa6efccc92a3d0b353aca8bb66937a27223417d1aada2f00d8bec864de` |
| `design-references/source-v57-omission-transfer-shaft.png` | `2e69f475d69770aa3d32229849e31a44651a88b29b9a95ff897fe0cbae0fc111` |
| `design-references/source-v57-liability-ledger.png` | `b33b48c16e585adf2e8126c4013a0b3afdaa546f83c0a218580f7f762d5baa81` |

WebP（前四张原字节改名沿用，第五张 Pillow q85 1536×1024 无裁切转码）：

- `assets/v57-concordance-theatre.webp`（`75a0a84d…`，193 KB）
- `assets/v57-innocent-quarantine.webp`（`93423b26…`，243 KB）
- `assets/v57-misbound-handover.webp`（`57eb7f30…`，269 KB）
- `assets/v57-omission-transfer-shaft.webp`（`fc09191d…`，214 KB）
- `assets/v57-liability-ledger.webp`（234 KB）

## v56 → v57 的插入方式（v56 语义不变，只改目的地）

| v56 原流 | 原落点 | v57 新落点 |
| --- | --- | --- |
| 交班 trusted / blind | `#evidence-switchboard` | 不变 |
| 交班 falseReport | `#false-positive-shaft` | 前插 `#innocent-quarantine` |
| 交班 missed | 匹配 v55 后室 | 前插 `#omission-transfer-shaft` |
| 编组 press | `#evidence-vault` | handover 判定为 trusted → `#concordance-theatre`；blind → `#misbound-handover`；否则回 `#evidence-vault`（原落点兜底） |
| 编组 burn | `#false-positive-shaft` | 前插 `#innocent-quarantine`（suppressed+1 不变） |
| 编组 selfseal | 匹配 v55 后室 | 前插 `#misbound-handover`（selfSeals+1、exposure+2 不变） |

v56 不新增任何持久化字段：press 分流所需的 handover 判定完全由既有 canonical 状态派生、
不落盘——`handover` 房间 + `correct[room]` + `checks[room]`（trusted = 该房报告正确且深查过，
blind = 正确但未深查，其余情况回落 `#evidence-vault`）；v56 pending 校验按新目的地重算，防伪语义不变。

## 状态契约

独立 key（全仓库唯一）：`goddead_v57_consequence_ledger`

```json
{
  "cycle": 1,
  "scores": { "concordance": 0, "repair": 0, "transfer": 0, "selfBurden": 0 },
  "visits":  { "theatre": 0, "quarantine": 0, "shaft": 0, "misbound": 0, "ledger": 0 },
  "settled": { "theatre": 0, "quarantine": 0, "shaft": 0, "misbound": 0, "ledger": 0 },
  "actions": { 15 个动作 key 的累计次数 },
  "deferredTarget": "",
  "pending": null,
  "history": []
}
```

- 只持久化上述白名单 canonical 字段（`saveLedger` 显式投影，`history.slice(-16)`）；
  `liability = concordance + repair + selfBurden − 2×transfer` 与 `pendingTarget` 派生只重算，不落盘。
- `cycle` 对齐 v35：floor cycle 变化只重置 `settled` 与 `pending`，分值/visits/actions/history/deferredTarget 保留。
- 归一：坏 JSON/数组/错型 → 默认；数值有限、非负、向下取整、封顶 9999；
  15 动作白名单（键含 scene 归属）；deferredTarget 只接受受支持旧目标白名单
  （evidence-vault / false-positive-shaft / protocol-drift / unnumbered-floor /
  blank-receipt-press / blank-name-cloakroom / 三 v55 后室 / misbound-handover / ""）。
- pending 严格白名单：kind 唯一取值 `action`；
  键集精确 `{action,cycle,feedback,kind,scene,target}`（含 cycle 字段，额外键即伪造）；target/feedback 由映射或阈值逐字重算；
  结算证据（settled[scene]===1 且 actions[action]>=1）+ canonical history 末项一致 + cycle 一致。
- 账房 pending 的点击前责任值不由固定增量反推（分值触顶 9999 时反推失真），
  而由 canonical history 末项的 `pre` 字段证明（结算时记入，整数且 ∈ [−19998, 29997]），
  并与落盘分值交叉核对：`post−pre` 必须落在固定增量区间（return-verdict +1 /
  sign-self +2 / assign-vacancy −4），短于增量时受影响分值必须已触顶 9999；
  无 `pre`、越界或解释不通的短差一律视为伪造。

## 四个后果场景：12 个动作（每场景每 cycle 只结算首次，导航常开，签明示「本轮已结清」）

### 共证剧场 `concordance-theatre`

| 动作（热点物件） | 分值 | 目的地 | 逐字反馈 |
| --- | --- | --- | --- |
| bind-testimony（左电话） | concordance +2 | `#evidence-vault` | 两份证词被压成同一枚指纹。证物库只承认它们一起存在。 |
| preserve-dissent（中央黑蜡证词） | concordance +1, selfBurden +1 | `#protocol-drift` | 你把分歧留在卷宗里，也把解释它的责任留给自己。 |
| substitute-witness（右镜面与纸） | selfBurden +2 | `#misbound-handover` | 镜面把你的轮廓钉在证词空位上。错绑交班开始呼叫你的名字。 |

### 无辜留置舱 `innocent-quarantine`

| 动作（热点物件） | 分值 | 目的地 | 逐字反馈 |
| --- | --- | --- | --- |
| release-innocent（左舱红蜡） | repair +2 | `#unnumbered-floor` | 红蜡断开以后，舱里没有病人。只有一份被你延迟承认的正常。 |
| extend-quarantine（中央舱夹板与锁） | transfer +2 | `#false-positive-shaft` | 你把怀疑续签给一个空舱。误报井替你保管了它。 |
| stand-in（右舱空工服/号牌） | repair +1, selfBurden +1 | `#misbound-handover` | 空工服接受了你的号牌。它没有获释，只是换成你被留置。 |

### 漏报移交井 `omission-transfer-shaft`

| 动作（热点物件） | 分值 | 目的地 | 逐字反馈 |
| --- | --- | --- | --- |
| descend-after（左绞轮） | repair +2 | 按 v56 handover 房匹配 v55 后室 | 你跟着漏掉的症状下井。它在原房间的背面等你补签。 |
| transfer-omission（中央升降舱封箱） | transfer +2 | `#blank-receipt-press` | 移交单没有收件人。空白回执仍替你签收了这次漏报。 |
| seal-omission（右侧梯/布帘） | concordance +1, transfer +1 | `#evidence-vault` | 你封住了井口，也封住了谁本应看见它。证物库收下一只仍在下坠的箱子。 |

### 错绑交班台 `misbound-handover`

| 动作（热点物件） | 分值 | 目的地 | 逐字反馈 |
| --- | --- | --- | --- |
| admit-misbind（左电话/圆镜） | selfBurden +2 | 按 handover 房匹配 v55 后室 | 你承认正确的结论绑错了证人。后室把责任和你一起叫回去。 |
| reassign-empty（中央接线器） | transfer +2 | `#blank-name-cloakroom` | 空名接过了手铐。它从来没有出现过，所以最适合承担证明。 |
| break-cuffs（右侧开卷与手铐） | repair +1, selfBurden +1 | `#protocol-drift` | 链断了，绑定却没有消失。守则开始重写“证人”的定义。 |

handover 房匹配：ward → `underbed-call-station`；records → `countersign-drain`；
laundry → `negative-laundry-locker`；无法安全恢复 → `unnumbered-floor`。

## 第三个不同后果场景首次结算 → 责任账房首次改道

- 触发：本次结算使「有动作计数的不同后果场景」累计达到 3 个，且 `visits.ledger === 0`
  且 `deferredTarget` 为空（每存档只触发一次）。
- 该动作原目的地存入严格 `deferredTarget`，分值照常只结算一次，
  反馈一拍后改道 `#liability-ledger`；转场 before 原子记 `visits.ledger=1` 再清 pending。
- reload 只重播一次反馈并精确重挂，不二次计分、不丢 deferredTarget；
  之后账房经目录重访不再触发改道。

## 责任账房 `liability-ledger` 三动作（每 cycle 只结算首次，导航常开）

目标由点击前分值决定；反馈逐字带结算后责任值与落点理由：

| 动作（热点物件） | 分值 | 目的地 | 逐字反馈 |
| --- | --- | --- | --- |
| return-verdict（左秤盘白纸） | concordance +1 | 有合法 deferredTarget → 回它并清空；否则 liability >= 0 → `#evidence-vault`，< 0 → `#false-positive-shaft` | 责任值 L。原判被退回你留下的那条路。账房替你销了一页。 |
| sign-self（中央锁链账本） | selfBurden +2 | 点击前 liability >= 4 → `#evidence-vault`；否则 → 最近 handover 房匹配 v55 后室（无法恢复 → `#unnumbered-floor`） | 责任值 L。你把判决签回自己身上。证物库承认这副肩膀。/ 责任值 L。你把判决签回自己身上。还不够重的那部分，由后室认领。 |
| assign-vacancy（右侧人形蜡座） | transfer +2 | 点击前 liability <= -2 → `#false-positive-shaft`；否则 → `#blank-name-cloakroom` | 责任值 L。空席接住了这份判决。误报井承认它早就该来。/ 责任值 L。空席接住了这份判决。空名寄存处为它留了位置。 |

## 守卫

- 五场景 direct hash 窄守卫：`pendingTarget === target || visits[key] > 0` 放行，
  否则归一回 `#unnumbered-floor`；不放宽任何旧守卫。
- 转场 before 先原子记 visit（v57 场景自身 visits、`markReviewVisited`、
  `grantAnomalyBackroomVisit`）再清 pending，避开「先清 pending 致守卫读不到」竞争。
- `evidence-vault` / `false-positive-shaft` 沿用 v33 既有守卫（before 调
  `markReviewVisited` 记真实到访）；三 v55 后室沿用 v55 窄守卫（before 调
  `grantAnomalyBackroomVisit`）；`blank-receipt-press` / `blank-name-cloakroom` 本就无守卫。
- 15 动作监听只接受真实用户产生的 click（`ev.isTrusted`）：合成
  `HTMLElement.click()` 在 active 场景同样零副作用（off-scene/hidden/rapid 由
  live-scene + first-lock 既有守卫覆盖）；鼠标、触控、Tab+Enter、Space 均派发
  trusted click，行为不变；旧版本按钮一律不收紧。

## 目录与记忆

- Archive Directory：`01σ½ / 共证剧场`、`01υ½ / 无辜留置`、`01φ½ / 漏报移交`、
  `01χ½ / 错绑交班`、`01ψ½ / 责任账房`（首次合法到访原子恢复）。
- Remembrance 单行：`责任账：共证 C，修复 R，转嫁 T，自担 S，责任值 L。`，仍八张统计卡。
- 遗忘全部：v57 key 随全量清除移除，五目录与记忆行隐藏、五场景未结算态恢复、签归零。

## 热点坐标（1536×1024 舞台百分比，桌面/移动共用，44px 增长后互不重叠）

- concordance-theatre：bind-testimony 14/62/19/20（左电话）、preserve-dissent 42/45/15/26（中央黑蜡证词）、substitute-witness 66/48/19/30（右镜面与纸）。
- innocent-quarantine：release-innocent 10/12/22/70（左舱红蜡）、extend-quarantine 40/12/21/70（中央舱夹板与锁）、stand-in 68/12/22/70（右舱空工服）。
- omission-transfer-shaft：descend-after 6/34/18/42（左绞轮）、transfer-omission 40/50/18/28（中央封箱）、seal-omission 82/10/16/60（右梯/布帘）。
- misbound-handover：admit-misbind 10/34/20/34（左电话/圆镜）、reassign-empty 40/32/20/38（中央接线器）、break-cuffs 68/32/20/38（右侧开卷与手铐）。
- liability-ledger：return-verdict 10/32/20/26（左秤盘白纸）、sign-self 36/30/28/38（中央锁链账本）、assign-vacancy 71/30/18/36（右侧人形蜡座）。

## QA 契约

1. 五场景三视口几何（图内/零重叠/自命中/≥44px/责任签不溢出/1440×800 首屏可操作）。
2. v56 六条插入路径（trusted→press→theatre、blind→press→misbound、burn→innocent、
   selfseal→misbound、falseReport→innocent、missed→shaft），v56 原分值不回归。
3. 12 后果动作逐字反馈、精确分值、精确目的地、每 cycle 防刷、新 cycle 重开。
4. 第三不同后果场景首次触发账房、deferredTarget、只触发一次。
5. 账房三动作、liability 阈值两侧、deferredTarget 返回与清空。
6. live-scene/first-lock/rapid/synthetic/hidden 守卫。
7. pending 合法 reload 重播一次；伪造 target/feedback/action/cycle/额外键/无证据全丢弃。
8. 坏 JSON/数组/负数/浮点/超大/未知键归一；raw 只含 canonical；history 精确 16。
9. v54/v37 字节级零污染；v56 语义不回归。
10. 目录×5、Remembrance 单行、八卡、真实点击遗忘后 key/目录/记忆清空。
11. Tab/Enter/Space；console 零异常。

## 验收记录（2026-07-31 至 2026-08-01 实测）

- 静态四检：`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`（2419 断言全绿，v57 相对基线 2359 新增 60）、`git diff --check` 全部通过。
- CDP 实机：`/tmp/v57-qa/v57-smoke.mjs`（真实 headless Google Chrome + 内嵌静态服务器 + 真实鼠标/键盘，种子预注入）**494/494 连续两轮全绿**，控制台零异常。覆盖：五场景 × 1440×1024 / 1440×800 / 390×844 几何（图内/零重叠/自命中/≥44px/责任签不溢出/1440×800 首屏）、v56 六条插入路径（trusted→press→共证剧场、blind→press→错绑交班、无判定回证物库、burn→无辜留置、selfseal→错绑交班、falseReport→无辜留置、missed→漏报移交）+ v56 分值逐项不回归、12 后果动作逐字 + 精确分值 + 精确目的地 + 同拍幂等 + 每 cycle 防刷 + 已结清明示 + 新 cycle 重开、第三不同后果场景首次改道 + deferredTarget 存取 + 第四场景正常落点、账房三动作阈值两侧 + deferred 返回并清空 + 防刷、账房三动作分值触顶 9999 后合法 pending 仍接受（点击前责任值经 history 末项 pre 证明）+ 自动转场前 reload 逐字重播一次 + 目标正确 + 分值仍封顶 + 不二次计分、三类跨字段伪造账房 pending（stale pre / 短差无触顶解释 / 缺 pre）丢弃、窄守卫四态、reload 节拍重播一次 + 三类伪造 pending（错反馈/额外键/错 cycle）丢弃、坏存档六种归一 + raw 仅 canonical 键 + history 精确 16、v54/v37 字节级零污染 + v56 计数不回归、目录×5/记忆单行/八卡/遗忘 DOM 全流程（key/目录/记忆隐藏 + 守卫回弹）、active 共证剧场合成 `HTMLElement.click()` 字节级零副作用（存储/反馈/场景/aria-pressed 不变）后真实 `page.click` 正常结算转场、Tab/Enter/Space、console 零异常。
- 监理即时修正：漏报移交井不得复用 v33 的 `shaft-response`/`shaft-link`，改全仓库唯一 `omission-response`/`omission-link`，并新增全页 duplicate-id 静态扫描——扫描另抓出 v43 遗留真实重复 id `vestibule-response`（未应门前厅的反馈一直写入隐藏的 v32 元素），已改 `unanswered-vestibule-response` 并接线回归；press 分流不新增 handoverKind 持久化字段，完全由 handover/correct/checks 派生。
- 视觉证据 9 张 `design-qa-evidence/v57-01~09`：01 共证剧场、02 无辜留置、03 漏报移交、04 错绑交班、05 责任账房、06 账房 1440×800、07–08 移动端两幅、09 改道落点；五张冻结源 PNG 与同状态同视口渲染同轮并排目验一致——热点全部压中物件、移动端短标签无裁切无互盖、标题与责任签无溢出。
- 保护边界：`docs/KimiUsageLog.md`、`assets/divine-name-cancellation.webp`、全部 source-v53~v57 PNG 哈希不变；未执行 git add/commit/push/stash；未安装依赖；QA 后 Chrome 进程与临时 profile 已清理。
