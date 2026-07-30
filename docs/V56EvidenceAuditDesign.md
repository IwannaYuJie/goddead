# v56 症状交接 / THE EVIDENCE AUDITS THE WITNESS

## 目标

只深化 v55 三房巡检态，不另开线性长廊：

- 巡检态每房增加一枚图内核验热点（封条深查），深查图即时揭示真值。
- 累计可信度决定下一轮封条预算（1/2/3 枚）。
- 第三间报告结算且深查 >= 2 时，v55 原始落点被有意暂存（deferredTarget），改道症状交班台。
- 交班台四种结果、证据编组室三动作，分值影响后续轮次。

## 素材（冻结，源 PNG 不覆盖、不重生、不裁切）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v56-ward-deep-anomaly.png` | `0b6fbcfc3e0b2ac8dd587e1c72799f14deb3007a7bb6fe1935b3ad4f31bfbc8e` |
| `design-references/source-v56-ward-deep-normal.png` | `455e6ab2cb571484faabd4d745fd7cd082f2bd27aab08468795c50fb46d5fcc9` |
| `design-references/source-v56-records-deep-anomaly.png` | `6bf6ae95db1e3c73eaf986339ea3496531684ea4c2b68a26839dd9180224ddf8` |
| `design-references/source-v56-records-deep-normal.png` | `08aace9a94e2b03796b6e4d5e08da33b7798dafb3c43f622c6bc8285b6803f4a` |
| `design-references/source-v56-laundry-deep-anomaly.png` | `e0d2946f9526629f1d5c0ee37ee08e70eb451749cc3e9ac9cc75fd59d574223e` |
| `design-references/source-v56-laundry-deep-normal.png` | `99bb7d76d44d3d176f6a4daece408cdb76d8a7dd0b77e9e6980e8537e4e2100c` |
| `design-references/source-v56-symptom-handover-hub.png` | `a9fa5ec7dacf68a0531b3e16752ad2111269dc1920300f23a3b397edd46c951a` |
| `design-references/source-v56-evidence-switchboard.png` | `9d729d09da442756ee508ec379ba99ee5aad08fa5b830bb68f5c8e841db11a56` |

转码（Pillow，WebP quality=85，1536×1024 原尺寸无裁切）：

- `assets/v56-ward-deep-{anomaly,normal}.webp`（162/161 KB）
- `assets/v56-records-deep-{anomaly,normal}.webp`（205/205 KB）
- `assets/v56-laundry-deep-{anomaly,normal}.webp`（193/197 KB）
- `assets/v56-symptom-handover-hub.webp`（218 KB）
- `assets/v56-evidence-switchboard.webp`（299 KB）

六张深查图预载；真值永远从 v55 规范状态（`getAnomaly().assignment`）读取。

## 状态契约

独立 key（全仓库唯一）：`goddead_v56_evidence_audit`

```json
{
  "cycle": 1, "budget": 2, "remaining": 2,
  "checks":  { "ward": 0, "records": 0, "laundry": 0 },
  "reports": { "ward": 0, "records": 0, "laundry": 0 },
  "correct": { "ward": 0, "records": 0, "laundry": 0 },
  "deepCount": 0, "handover": "", "deferredTarget": "",
  "resolved": { "hub": 0, "switchboard": 0 },
  "visits":   { "hub": 0, "switchboard": 0 },
  "proofs": 0, "blindCorrect": 0, "contradictions": 0, "exposure": 0,
  "chains": 0, "suppressed": 0, "selfSeals": 0,
  "trustedHandovers": 0, "blindHandovers": 0, "failedHandovers": 0,
  "pending": null, "history": []
}
```

- 只持久化上述白名单 canonical 字段（`saveEvidence` 显式投影，`history.slice(-16)`）；
  `credibility = proofs + 2×blindCorrect + chains − contradictions − suppressed` 与
  `pendingTarget` 派生只重算，永不落盘；assignment 不持久化，真值从 v55 读取。
- `cycle` 对齐 v35：`getFloor().cycle` 变化即重置 budget/remaining/checks/reports/correct/
  deepCount/handover/deferredTarget/resolved/pending（轮内字段），累计计数与 visits 保留。
- 归一：坏 JSON/数组/错型 → 默认；数值有限、非负、向下取整、封顶 9999；
  budget 仅接受 1/2/3（否则 0=未创建）、remaining ≤ budget、轮内映射 0/1、
  deferredTarget 只接受 v55 四种结果落点白名单。
- pending 严格白名单 + 结算证据 + canonical history 末项 + cycle 一致（v54/v55 同款防伪）：
  - `defer`：五键 `{kind,room,outcome,target,feedback}`，target 恒为 `symptom-handover-hub`，
    feedback 由 v55 四种结果映射重算，须 `deferredTarget !== "" && reports[room]===1`
    且 history 末项为同 room/outcome 的 report；
  - `handover`：四键 `{kind,room,target,feedback}`，target/feedback 由真值+正确+深查重算，
    须 `resolved.hub===1 && handover===room` 且 history 末项同 room；
  - `action`：四键 `{kind,action,target,feedback}`，target 由映射（selfseal 按 handover 房）
    重算，须 `resolved.switchboard===1` 且 history 末项同 action。

## 封条预算

- 每个 v35/v55 cycle 首次进入巡检态时创建一次：
  `credibility >= 4 → 3 枚；<= -2 → 1 枚；否则 2 枚`。创建即冻结，reload 稳定，严禁随机。
- 低可信度（1 枚预算）下 deepCount 最多 1，天然不触发交班台；预算 3 但只用 0/1 枚同样不触发
  （触发条件 = 第三间报告结算 && deepCount >= 2 && deferredTarget 为空，每轮一次）。

## 深查（核验热点）

- 巡检态且封条余量 > 0 且本房未深查时显示，压在真实物件上：
  ward 床头回铃机、records 左侧无名页（透字框）、laundry 右机检修牌。
- 接受（live scene + 共享 first-lock + 巡检态 + 余量 + 未查）：remaining −1、deepCount +1、
  checks[room]=1、exposure +1、history 追加；原地切到与真值相同的 deep 图并显示逐字证据反馈，
  不转场、不挂 pending；报告热点始终可立即选择。

| 房 | 真值 | 逐字反馈 |
| --- | --- | --- |
| ward | anomaly | 黑线没有通向墙。它从床单下面接回那枚呼叫钮。 |
| ward | normal | 黑线止在瓷封里。床上没有第二个接点。 |
| records | anomaly | 背光里，墨迹从纸纤维向上爬，和池心的逆流同拍。 |
| records | normal | 背光穿透整页。纸纤维里没有藏第二份姓名。 |
| laundry | anomaly | 黑线穿过机壳，接在倒影里的白工服上。第二道影子朝错方向落下。 |
| laundry | normal | 两根铜线都封死在瓷帽里。圆窗后的走廊仍是空的。 |

## 报告计分（挂在 v55 chooseAnomalyReport 接受点之后）

- 深查后报告正确：`proofs +1`；未深查盲判正确：`blindCorrect +1`；任何错误：`contradictions +1`。
- 每房 reports/correct/checks 本轮持久化，刷新不重放；v55 原 verified/falseReports/missed/
  streak/tendencies 与 v35 signal/debt 精确语义不变。

## 有意挂钩：deferredTarget 与症状交班台

第三间报告结算完成且本轮深查 >= 2 时，v56 把这次 v55 的原始报告落点暂存为
`deferredTarget`，逐字 v55 反馈显示后自动转场到 `#symptom-handover-hub`（v55 不挂
pending，由 v56 的严格 pending 接管节拍与防伪；每轮只触发一次）。
交班台三热点（左听筒 / 中央黑墨无名页 / 右镜与白工服）只接受首次：

| 条件 | 计分 | 逐字反馈 | 落点 |
| --- | --- | --- | --- |
| 正确且深查过 | trustedHandovers +1 | 封条和报告同时咬住同一结论。证据编组室把门打开了。 | `#evidence-switchboard` |
| 正确但未深查 | blindHandovers +1 | 没有封条的报告仍然猜中了门后那一间。证据编组室接受这次盲判。 | `#evidence-switchboard` |
| 错误且真值 normal（误报） | failedHandovers +1 | 你交上去的症状在台面上恢复正常。误报井先签收了你。 | `#false-positive-shaft` |
| 错误且真值 anomaly（漏报） | failedHandovers +1 | 你交上去的正常结论在台面上开始呼吸。对应后室把原件取走了。 | 该房 v55 异常后室 |

## 证据编组室三动作（导航常开，分值每 cycle 只结算首次）

| 动作 | 计分 | 逐字反馈 | 落点 |
| --- | --- | --- | --- |
| 把两份证据压成一条因果 | chains +1 | 压机合拢。两份证据从此只允许一种死法。 | `#evidence-vault` |
| 烧掉矛盾，保留可通过的结论 | suppressed +1 | 红蜡只烧掉不同意你的那一份。误报井收到了灰。 | `#false-positive-shaft` |
| 把最后一枚封条扣在自己身上 | selfSeals +1、exposure +2 | 封条绕过手腕和喉咙。你成了这批证据唯一还活着的附件。 | 当前 handover 房对应 v55 异常后室 |

## 路由守卫

- 两新场景 direct hash 窄守卫：`pendingTarget === target || visits[key] > 0` 放行，
  否则归一回 `#unnumbered-floor`；转场 before 先原子记 visit/旧场景 visited
  （`markReviewVisited` / `grantAnomalyBackroomVisit`）再清 pending，避开 v55 同款
  guard 竞争；不放宽任何旧守卫。
- `evidence-vault` / `false-positive-shaft` 沿用 v33 既有守卫：转场 before 调
  `markReviewVisited` 记真实到访，v33 守卫按 visited 放行，守卫文本一行未改。

## 目录与记忆

- Archive Directory：`01π½ / 症状交班`、`01ρ½ / 证据编组`（首次合法到访原子恢复）。
- Remembrance 单行：`证据审计：核验 P，盲判 B，矛盾 C，暴露 E，可信度 K。`，仍八张统计卡。
- 遗忘全部：v56 key 随全量清除移除，三房恢复 v55 巡检态、目录隐藏、签归零。

## QA 契约

1. 1/2/3 枚预算创建与冻结、确定性、无随机；六张 deep 图与真值一致、预载无闪错。
2. 深查消耗精确（−1 枚、exposure+1、原地切图、报告热点仍可选）、首选锁/连点/合成/刷新零重复。
3. 四种报告 v56 计分（proofs/blindCorrect/contradictions）+ v55/v35 语义不回归。
4. 第三报告触发与不触发（1 枚预算 / 3 枚预算只用 0–1 枚）。
5. 交班四结果、编组三动作、每 cycle 防刷、新 cycle 重开。
6. 两新场景 direct hash 窄守卫四态；pending 防伪（错映射/无证据/额外键/跨 cycle）。
7. raw canonical、history ≤ 16、credibility 不落盘；v55/v54/v37/v35 旧状态不污染。
8. 键盘 Tab/Enter/Space、44px、非重叠、自命中、三视口；console 零异常。
9. 1440×1024、1440×800、390×844 截图，源图并排目验。

## 验收记录（2026-07-30 实测）

- 静态四检：`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`（2359 断言全绿，v56 相对基线 2292 新增 67）、`git diff --check` 全部通过。
- CDP 实机：`/tmp/v56-qa/v56-smoke.mjs`（真实 headless Google Chrome + 内嵌静态服务器 + 真实鼠标/键盘，种子预注入）**491/491 连续两轮全绿**，控制台零异常。覆盖：三值班房巡检态 + 两新场景 × 1440×1024 / 1440×800 / 390×844 几何（图内/零重叠/自命中/≥44px/14 项签不溢出/1440×800 首屏）、1/2/3 枚预算创建与冻结（credibility 阈值、reload 稳定、计分不回改）、六张深查图与真值一致、消耗幂等（连点/合成/空封条拒绝）、四种报告 v56 计分（proofs/blindCorrect/contradictions）+ v55 verified 语义回归、第三报告触发与两种不触发（1 枚预算、3 枚只用 1 枚）、交班四结果逐字 + 精确落点 + 仅首次接受、编组三动作 + 每 cycle 防刷 + 已结算明示、窄守卫四态、reload 节拍重播一次 + 深查图与签恢复、坏存档六种归一、raw canonical 键 + history 精确 16 + credibility/assignment 不落盘、v37/v54 字节级零污染、Tab/Enter/Space、console 零异常。
- 真实产品缺陷修复：深查换图后 `loading="lazy"` 解码竞态可拍出全黑 figure（laundry deep 实测复现）——三值班房主图去 lazy + QA 等待解码完成，两轮回归全绿。监理复审再修复一处真实遗忘残留：「遗忘全部」漏调 `paintEvidenceAuditMemory()`，v56 key 已删但 `#evidence-audit-memory` 旧数字仍可见——补接线并加 DOM 级遗忘流程实测（预置活跃 v56、痕迹页行可见、真实点击遗忘入口与确认、断言 key 缺失/记忆行 hidden/目录隐藏/三房核验热点隐藏/图片回平静/签归零）。
- 视觉证据 12 张 `design-qa-evidence/v56-01~14`：01 巡检核验态、02/07 ward deep 两图、03/08 records deep 两图、04/09 laundry deep 两图、05 交班台、06 编组室、11/12 移动端两幅、14 编组落点；八张冻结源 PNG 与同状态同视口渲染同轮并排目验一致——热点全部压中物件、移动端短标签无裁切无互盖、标题与 14 项签无溢出。
- 保护边界：`docs/KimiUsageLog.md`、`assets/divine-name-cancellation.webp`、全部 source-v53/v54/v55/v56 PNG 哈希不变；未执行 git add/commit/push/stash；未安装依赖；QA 后 Chrome 进程与临时 profile 已清理。
