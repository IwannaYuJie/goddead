# v55 失常交班 / THE FLOOR REPORTS BACK

## 目标

不新增走廊，把 v35 三间值班房升级成图内可触摸的「值班 → 巡检 → 异常后室」循环：

- 12 个既有按钮（每房 3 个 v35 动作 + 1 个 v37 回拨）全部移入各自 3:2 图片，旧卡容器删除。
- 值班完成后再次进入才进入巡检态：正常/异常判断，四种结果真实可选错。
- 三个真正的异常后室，九个图内动作，倾向计数影响下一轮分配。

机制灵感只吸收机制：8号出口的正常/异常判断、Observation Duty 的记忆巡检、
WORLD OF HORROR 的风险分值、Slay the Princess 的旧选择改变下一轮。

## 素材（冻结，源 PNG 不覆盖、不重生、不裁切）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v55-ward-anomaly.png` | `1a201c5658f61b18b9d8f00225187dbbc7939578ae47b7f260d68a044871ef9a` |
| `design-references/source-v55-records-anomaly.png` | `608bab090e9b42feaef83b9edac3fa7b1ec0e9779fa0e8a5ec2127a8138ceff8` |
| `design-references/source-v55-laundry-anomaly.png` | `98115b31e27358f8410e3161075da2b5bcd5f3bbd1d21d5c6922e458c31773cf` |
| `design-references/source-v55-underbed-call-station.png` | `658abf28c2d4d597f760576ef79619540d6e8d7ab626f0b1fe80427b76634099` |
| `design-references/source-v55-countersign-drain.png` | `c06535284faa894c0a964aa97e7d5fed2ebbde7c2a04d1dc27a493b51fa4bd22` |
| `design-references/source-v55-negative-laundry-locker.png` | `6956c9d1e719def1c3895b4bb02fa54cc78b3cbd28a84b7305efc4aa6afa9184` |

转码（Pillow，WebP quality=85，1536×1024 原尺寸无裁切）：

- `assets/v55-ward-anomaly.webp`（169 KB）
- `assets/v55-records-anomaly.webp`（199 KB）
- `assets/v55-laundry-anomaly.webp`（204 KB）
- `assets/v55-underbed-call-station.webp`（152 KB）
- `assets/v55-countersign-drain.webp`（263 KB）
- `assets/v55-negative-laundry-locker.webp`（187 KB）

平静态继续用 `bellless-ward.webp` / `seeping-records.webp` / `reverse-laundry.webp`；
平静图与异常图构图对齐，热点共用一套坐标，三张异常图预载。

## 状态契约

独立 key（全仓库唯一）：`goddead_v55_floor_anomaly`

```json
{
  "cycle": 1,
  "assignment": { "ward": "anomaly", "records": "normal", "laundry": "normal" },
  "inspected": { "ward": 0, "records": 0, "laundry": 0 },
  "backrooms": { "underbed": 0, "countersign": 0, "negative": 0 },
  "visits":    { "underbed": 0, "countersign": 0, "negative": 0 },
  "verified": 0, "falseReports": 0, "missed": 0, "streak": 0,
  "tendencies": { "follow": 0, "contain": 0, "submit": 0 },
  "pending": null,
  "history": []
}
```

- 只持久化上述白名单 canonical 字段（`saveAnomaly` 显式投影，`history.slice(-16)`）；
  `contamination = falseReports + 2×missed` 与 `pendingTarget` 派生只重算，永不落盘。
- `cycle` 对齐 v35：`getFloor().cycle` 变化即重置 assignment/inspected/backrooms/pending
  （轮内字段），verified/falseReports/missed/streak/tendencies/visits/history 累计保留。
- `assignment` 必须逐字段等于六个合法模式之一（每种至少 1 间异常、至少 1 间正常），
  否则清空待重建；非法/跨轮 assignment 不被信任。
- 归一：坏 JSON/数组/错型 → 默认；数值有限、非负、向下取整、封顶 9999；
  未知键白名单重建丢弃；history 仅保留 `{type:"report",room,report}` /
  `{type:"action",scene,action}` 白名单形状。
- pending 严格白名单 +「确实刚结算」跨字段证据（v54 同款防伪）：
  - 恰好五键 `{kind,room,report,target,feedback}` 或 `{kind,scene,action,target,feedback}`，额外键即伪造；
  - target/逐字反馈由四种结果映射或九动作映射重算；
  - report pending 要求 `inspected[room]===1`、action pending 要求 `backrooms[scene]===1`；
  - canonical history（先解析）最后一项必须与 pending 同形；
  - cycle 必须与当前 v35 cycle 一致。

## 分配（reload 稳定、倾向影响、创建不漂移）

- 每个 v35 cycle 首次有房间进入巡检态时创建一次：
  `idx = (cycle + follow + 2×contain + 3×submit) % 6`，取 `ANOMALY_PATTERNS[idx]` 并持久化。
- 确定性轮换，禁止 `Math.random(`；创建后本轮计分变化不回改分配；
  倾向计数（后室九动作）改变后续轮次的落点。

## 巡检循环

- 值班态：本房本轮 `completed` 未含该房 → 旧流程、平静图、12 旧热点全部原语义。
- 巡检态：本房本轮值班已完成且未巡检结算 → 旧四热点 hidden，出现两个图内报告热点：
  「上报异常物」（压在候选异常物上：床单呼叫钮 / 逆流黑水 / 右机白工服）与
  「报告本室正常」（压在稳定物件上：拱门框 / 无名页 / 墙铜牌）。
- 四种结果（逐字反馈后自动转场，live scene + 共享 first-lock + 本轮未结算）：

| 结果 | 条件 | 计分 | 落点 |
| --- | --- | --- | --- |
| 发现异常 | 异常图上上报异常 | verified +2、streak +1、v35 signal +1 | 该房异常后室 |
| 正确正常 | 正常图上报告正常 | verified +1、streak +1、v35 signal +1 | `#unnumbered-floor` |
| 误报 | 正常图上上报异常 | falseReports +1、streak = 0、v35 debt +1 | `#unnumbered-floor` |
| 漏报 | 异常图上报告正常 | missed +1、streak = 0、v35 debt +2 | 该房异常后室 |

- v35 cap 按真实新理论上限安全扩展：`FLOOR_SIGNAL_CAP 12→15`（+3 次核验）、
  `FLOOR_DEBT_CAP 8→14`（+6 误报/漏报债）；旧存档与 routeScore 三档结局含义不变。
- 三房签各显示：核验 / 误报 / 漏报 / 连对 / 污染（派生）。

## 三个异常后室（每房每 cycle 只结算首次动作，防环路刷分）

| 场景 | 动作（热点物件） | 目标 | 倾向 | 逐字反馈 |
| --- | --- | --- | --- | --- |
| underbed-call-station | 撕开左侧黑蜡 | `#midnight-callback` | follow +1 | 蜡撕开时里面先响了一声。午夜的回拨台正在等这条线。 |
| | 把中央呼叫钮按回床垫 | `#bellless-ward` | contain +1 | 呼叫钮被按回床垫。上面的呼吸停顿了一拍，病房恢复原样。 |
| | 右侧输液管接进喇叭 | `#countersign-drain` | submit +1 | 输液管把床下的声音送进喇叭。排水渠开始反着签名。 |
| countersign-drain | 左侧指纹替空页反签 | `#return-audit` | follow +1 | 指纹替你签了空页。核验站要求重新核对回来的路。 |
| | 逆转中央闸轮 | `#seeping-records` | contain +1 | 闸轮倒转，墨水沿抽屉链爬回档案池。 |
| | 沿右侧抽屉链下井 | `#negative-laundry-locker` | submit +1 | 你沿抽屉链下到排水井。井底是一层负照的更衣室。 |
| negative-laundry-locker | 穿上左侧反面白工服 | `#lagging-shadow-cloister` | submit +2 | 白工服的反面没有缝线。你的影子被留在回廊里滞后了一步。 |
| | 中央空号牌压进红蜡 | `#protocol-drift` | follow +1 | 空号牌压进红蜡。守则的第七条在旁边轻轻翻身。 |
| | 站进右侧柜里空人形 | `#underbed-call-station` | contain +2 | 空人形在你身后合上柜门。床下的回铃台又响了一次。 |

- 导航永远可用；倾向分值每房每 cycle 只在首次动作结算，签上明示「本轮 已结算/未结算」。
- 九目标在当前路由契约下均无守卫问题（既有场景既有入口保留）。

## 路由守卫

三个新场景 direct hash 窄守卫（`resolveScene` 新增一条，不放宽任何旧守卫）：
`pendingTarget === target || visits[key] > 0` 放行，否则归一回 `#unnumbered-floor`。
visit 的记录方式与守卫竞争修复一致：合法 pending 的转场在 `goScene` 之前由 `before`
回调原子完成「先记 visit、再清 pending」（守卫放行时读取的是同一拍落盘的状态），
场景进入端 `enterAnomalyBackroom` 只做幂等确认；没有合法 pending 或历史 visit 的
direct hash 仍被挡回 `#unnumbered-floor`。

## 目录与记忆

- Archive Directory：`01ν½ / 床下回铃`、`01ξ½ / 反签排水`、`01ο½ / 负照更衣`（首次合法到访原子恢复）。
- Remembrance 单行：`失常交班：核验 X，误报 Y，漏报 Z，污染 C。`，仍八张统计卡。
- 遗忘全部：v55 key 随全量清除移除，三房回平静图与值班态、目录隐藏、签归零。

## QA 契约

1. 12 旧按钮原 id/原文/原反馈/原目标/v35 计分/v37 回拨语义不变，一次点击自动转场。
2. 巡检四种结果逐字反馈与精确落点、计分精确（含 v35 signal/debt 与 cap 15/14）。
3. 分配 reload 稳定、每轮 ≥1 异常 ≥1 正常、确定性轮换、创建不漂移、倾向影响下一轮。
4. 后室九动作逐字反馈与目标、每 cycle 防刷分、新 cycle 重开、已结算明示。
5. 坏 JSON/数组/负数/浮点/超大/未知键/伪造 pending（错映射、无结算证据、history 不符、额外键、跨轮）归一。
6. raw JSON 只有 canonical 字段、history ≤ 16；off-scene/合成/连点/转场中/刷新零重复。
7. v35/v37/v54 旧状态除设计内 signal/debt 增减外字节级零污染；v29/v35 守卫不回归。
8. 键盘 Tab/Enter/Space、44px、非重叠、自命中、移动端短标签、reduced-motion；console 零异常。
9. 1440×1024、1440×800、390×844 三值班房值班/巡检（正常+异常）/三后室截图，源图并排目验。

## 验收记录（2026-07-30 实测）

- 静态四检：`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`（2292 断言全绿，v55 相对基线 2231 新增 61）、`git diff --check` 全部通过。
- CDP 实机：`/tmp/v55-qa/v55-smoke.mjs`（真实 headless Google Chrome + 内嵌静态服务器 + 真实鼠标/键盘，种子预注入）**925/925 连续两轮全绿**，控制台零异常。覆盖：三值班房 + 三后室 × 1440×1024 / 1440×800 / 390×844 几何（3:2 舞台、图内/零重叠/自命中/≥44px/八项签不溢出/无横向溢出/1440×800 首热点首屏）、12 旧动作原反馈原目标原计分 + 同拍幂等、分配公式/≥1 异常 ≥1 正常/reload 稳定/计分不漂移/倾向影响下一轮、四种报告结果逐字 + 精确落点 + 计分 + v37/v54 字节级零污染、后室九动作逐字 + 目标 + 防刷 + 已结算明示 + 新 cycle 重开、窄守卫四态（干净回大厅/历史到访放行/全白名单无证据 pending 拒绝）、reload 节拍重播一次、坏存档七种归一、raw canonical 键 + history 精确 16、合成/off-scene 零副作用、Tab/Enter/Space、console 零异常。
- 真实产品缺陷修复：后室转场 before 先清 pending 导致窄守卫在 goScene 时读不到合法 pending（v53 同款竞争），改为 before 先记合法到访再清 pending，两轮回归全绿。
- 视觉证据 14 张 `design-qa-evidence/v55-01~14`：01–03 三房值班态、04–06 三房巡检异常态、07–09 三后室、10 巡检 1440×800、11–13 移动端、14 报告反馈中间态；六张冻结源 PNG 与同状态同视口渲染同轮并排目验一致——热点全部压中物件、移动端短标签无裁切无互盖、标题与八项签无溢出。
- 保护边界：`docs/KimiUsageLog.md`、`assets/divine-name-cancellation.webp`、全部 source-v53/v54/v55 PNG 哈希不变；未执行 git add/commit/push/stash；未安装依赖；QA 后 Chrome 进程与临时 profile 已清理。
