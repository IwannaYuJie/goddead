# Goddead v37 设计：午夜回拨台 / THE MIDNIGHT CALLBACK DESK

## 目标

v37 继续扩充前段的横向选择，不追加更深的单线终点。

- 把守则「其六」从固定去走廊改成一个真实可玩的早期分支。
- 在 v31 回返夹道增加第二入口，让前段与既有 v35 三间值班房形成可往返的横向网。
- 新增 `#midnight-callback`：玩家从三条夜间来电里选两条，亲自去现场，再从现场回拨。
- 两条现场报告形成不同的「核实 / 线债」分值组合，并自动落入三个既有区域。
- 全程继续遵守「点击即执行 → 看见反馈 → 自动转场」；没有确认页、底部继续按钮或新结局。
- 原有守则文字、v31 回返夹道四个动作、v35 三房各三个动作与其状态结算全部保留。

## 参考机制与原创转译

参考只取交互机制，不复制题材、美术、角色、文本或具体谜题。

1. `Home Safety Hotline`
   - 官方 Steam 页面说明玩家需要查阅危险目录、判断来电者家中出现的东西，并为错误判断负责。
   - https://store.steampowered.com/app/2357910/Home_Safety_Hotline/
   - 转译：玩家不是坐在总机上猜答案，而是接线后被直接送去现场；回拨报告才真正形成分值。
2. `The Exit 8`
   - 官方 Steam 页面强调观察重复空间、发现异常时回头、没有异常时继续。
   - https://store.steampowered.com/app/2653790/The_Exit_8/
   - 转译：每条线路都描述一个似乎已经见过的异常；玩家选择哪两条去核实，本身就是路线判断。
3. `Stories Untold`
   - 官方 Steam 页面说明其将文字冒险、点选交互、无线电处理与异常实验放在同一叙事结构里。
   - https://store.steampowered.com/app/558420/Stories_Untold/
   - 转译：回拨台、现场房间与反馈文字构成同一个跨场景操作，不把选择缩成孤立菜单。

本轮的 Goddead 原创恐怖点：

- 电话总是在现场先响，再由总机晚八分钟接通。
- 来电者不是求救者，而是三个房间在报告自己里面的人。
- 玩家每核实一次，回拨台就多承认一次现场，也多欠一段没有说完的线路。
- 第三条线永远不接；结算后它会用玩家的声音向下一位访客回拨。

## 新场景与素材

### 场景

- Hash：`#midnight-callback`
- 中文：午夜回拨台
- 英文：THE MIDNIGHT CALLBACK DESK
- 场景说明：`三只听筒都晚了八分钟。总机把现场先送到你面前，再等你回来承认听见了什么。`

### 素材

监理生成并保留四张 1536×1024 RGB PNG：

1. `design-references/source-midnight-callback-desk.png`
   - 正式：`assets/midnight-callback-desk.webp`
   - 黑石与旧黄铜围成的地下回拨台；无人；三只骨瓷听筒并排；三盏暗红线路灯；墙钟比背后的影子慢八分钟。
2. `design-references/source-callback-bellless-ward.png`
   - 正式：`assets/callback-bellless-ward.webp`
   - 无铃病房床头柜近景；骨瓷听筒搁在没有铃舌的黄铜铃旁；床单下有一处刚停止的呼吸凹痕。
3. `design-references/source-callback-seeping-records.png`
   - 正式：`assets/callback-seeping-records.webp`
   - 骨瓷听筒半浸在档案池墨水里；湿纸页从听筒孔渗出姓名栏形状，但没有可读文字。
4. `design-references/source-callback-reverse-laundry.png`
   - 正式：`assets/callback-reverse-laundry.webp`
   - 听筒垂在逆照洗衣机门内；滚筒里挂着没有倒影的工服；黄铜线从镜面背后接入。

素材要求：

- 与 v31–v36 同一黑石 / 骨瓷 / 旧黄铜 / 暗红封蜡世界。
- 三张线路图使用相近近景、灯位与构图密度，核心听筒居中。
- 图内无可读文字、数字、UI、按钮、边框、现代塑料电话或现代屏幕。
- 移动中心裁切必须保留「听筒 + 各房间唯一物件」，三图一眼可区分。
- 源 PNG 必须保留，正式页面只引用 WebP。

## 两个入口

### 1. 守则其六

守则第六条原文逐字保持：

`子夜到访的客人，请勿在页面停留超过一个小时。`

原反馈逐字保持：

`现在几点？你确定吗？`

行为变化：

- 将规则 6 加入既有 `RULE_DETOUR`。
- 点击后与其他守则共用 `protocol` 首选锁。
- 反馈显示一个正常节拍后自动去 `#midnight-callback`。
- entry：`protocol`
- mark：`answeredProtocolSix`
- 其余七条的目的地、反馈与首选锁保持不变。
- 「玖」异常仍走原 `#ninth` 逻辑，不被 v37 覆盖。

### 2. v31 回返夹道

保留现有五个动作中的前四个逐字不动（v31 原三动作 + v36 夜班登记证），新增第五动作：

- 按钮 ID：`return-choice-callback`
- 标题：`接起墙里晚了八分钟的电话`
- 提示：`听筒正在读守则其六`
- mark：`answeredLateWallCall`
- entry：`passage`
- 反馈：`墙里的电话比铃声晚响了八分钟。听筒正在读守则其六。`
- 自动去：`#midnight-callback`

与回返夹道原四动作共用 `return-passage` 首选锁。移动 390×844 需要五个动作首屏可达，建议四个紧凑 2×2，第五个独占一行；触达高度仍 ≥44px。

## 午夜回拨台

### 回拨签

显示四项：

- 已核实：`0/2`、`1/2`、`2/2`
- 核实：0–5
- 线债：0–3
- 最佳线路：沿用本状态 `bestRoute`

### 三条线路

三张线路卡始终同屏。每轮只完成其中两条；完成两条后第三条保持可见但 disabled，随后自动结算。

#### 1. 无铃病房线 / `ward`

- 图片：`assets/callback-bellless-ward.webp`
- 按钮 ID：`callback-line-ward`
- 标题：`接通无铃病房`
- 征兆：`听筒没有响。床头柜已经替你说了“收到”。`
- 选择反馈：`总机把没有铃声的那一段线路塞进你耳后。`
- pending mark：`connectedWardLine`
- 自动去：`#bellless-ward`

现场回拨：

- 按钮 ID：`ward-choice-callback`
- 标题：`报告：房里没有铃声`
- 提示：`对面已经替你写下“有”`
- 完成 mark：`reportedWardLine`
- 分值：核实 `+3`，线债 `+0`
- 反馈：`你说“没有铃声”。总机记录了三次完全相同的铃响。`
- 自动回：`#midnight-callback`

#### 2. 渗水档案池线 / `records`

- 图片：`assets/callback-seeping-records.webp`
- 按钮 ID：`callback-line-records`
- 标题：`接通渗水档案池`
- 征兆：`来电者没有名字，档案页却在听筒里翻动。`
- 选择反馈：`墨水沿电话线爬上来，把这一段接成了潮湿的黑色。`
- pending mark：`connectedRecordsLine`
- 自动去：`#seeping-records`

现场回拨：

- 按钮 ID：`records-choice-callback`
- 标题：`报告：名字正在渗出`
- 提示：`档案池先念出了你的号码`
- 完成 mark：`reportedRecordsLine`
- 分值：核实 `+2`，线债 `+1`
- 反馈：`你念出空白姓名栏。总机用你的号码补上了那一格。`
- 自动回：`#midnight-callback`

#### 3. 逆照洗衣房线 / `laundry`

- 图片：`assets/callback-reverse-laundry.webp`
- 按钮 ID：`callback-line-laundry`
- 标题：`接通逆照洗衣房`
- 征兆：`滚筒没有转，听筒里的工服却一直摩擦镜面。`
- 选择反馈：`黄铜线穿过镜面，把你的声音挂进那件工服。`
- pending mark：`connectedLaundryLine`
- 自动去：`#reverse-laundry`

现场回拨：

- 按钮 ID：`laundry-choice-callback`
- 标题：`报告：工服没有倒影`
- 提示：`接线员的声音从滚筒里传来`
- 完成 mark：`reportedLaundryLine`
- 分值：核实 `+1`，线债 `+2`
- 反馈：`你报告“没有倒影”。滚筒替你留下了两份相反的录音。`
- 自动回：`#midnight-callback`

### 线路规则

- 点击线路卡只写入 `pendingLine` 与 pending mark，不增加分值。
- 同一时刻只能有一条 pending line；有 pending 时另外两条线路 disabled。
- 到达目标房间后，新增回拨动作与既有三个动作同屏；既有动作逐字、分值、mark、目的地与首选锁不变。
- 回拨动作与该房间既有三个动作共用首选锁；首个被接受的动作决定去向。
- 选择既有房间动作离开时，pending 保留；以后回到该房间仍可回拨，不能重复加值。
- 回拨成功才把线路加入 `completedLines`、增加核实 / 线债、清空 pending，并自动回回拨台。
- 已完成线路卡保持可见、`aria-pressed=true`、disabled。
- 竞争点击、快速连点、Enter / Space 重复事件只认第一次。
- 直接 hash 进入只记 visited，开启或恢复一个正常 cycle，不自动接线。
- 刷新保留 pending / completed / 分值，不重复应用。
- 离场清除反馈 timer，不幽灵转场。

## 两线组合与三档自动分流

完成第二次现场回拨、回到 `#midnight-callback` 后，显示一个正常反馈节拍并自动结算；没有结算按钮、确认页或继续按钮。

| 两条线路 | 核实 | 线债 | routeScore | 结果与自动去向 |
| --- | ---: | ---: | ---: | --- |
| 无铃病房 + 渗水档案池 | 5 | 1 | 4 | clear → `#anomaly-review` |
| 无铃病房 + 逆照洗衣房 | 4 | 2 | 2 | uncertain → `#peephole-chamber` |
| 渗水档案池 + 逆照洗衣房 | 3 | 3 | 0 | contaminated → `#return-passage` |

计算：

`routeScore = max(0, verification - lineDebt)`

反馈逐字：

- clear：`两条现场报告互相承认。复核科愿意把这次来电当成证据。`
- uncertain：`两条线路只对上了一半。倒置窥孔要求亲眼再看一次。`
- contaminated：`线债吃掉了全部核实。回返夹道接起第三条线，用你的声音说“回来”。`

三档都必须用真实 UI 正常抵达，不能只用 localStorage 种子。

## 新 cycle 与重访

- 完成结算后状态 `settled=true`，累计统计保留。
- 从目录、守则其六或回返夹道再次进入已 settled 的回拨台时：
  - cycle +1
  - pending / completed / verification / lineDebt / outcome 清空
  - 三条线路重新可选
- 如果结算目标刚好回到回返夹道，再点回拨入口必须先开新轮，不能重复消费旧 outcome。
- 正在 pending 或只完成一条时重访，必须恢复原轮，不得偷偷开新 cycle。

## 状态

独立键：

`goddead_v37_midnight_callback`

字段：

- `visited.callback: boolean`
- `entry: "neutral" | "protocol" | "passage"`
- `cycle: non-negative integer`
- `pendingLine: "none" | "ward" | "records" | "laundry"`
- `completedLines: unique subset of ["ward", "records", "laundry"], max 2`
- `verification: 0–5`
- `lineDebt: 0–3`
- `settled: boolean`
- `outcome: "" | "clear" | "uncertain" | "contaminated"`
- `completedRuns: non-negative integer`
- `clearRuns: non-negative integer`
- `uncertainRuns: non-negative integer`
- `contaminatedRuns: non-negative integer`
- `bestRoute: 0–4`
- `marks: whitelisted unique array`

要求：

- 坏 JSON、数组错型、非法 entry / line / outcome、重复 completed、NaN、Infinity、负数与超大数全部安全归一。
- `verification` / `lineDebt` 必须能由 `completedLines` 唯一重算；不一致时以合法 completedLines 重建，不能信任存档里的伪造分值。
- pending 不能同时出现在 completedLines；冲突时 pending 归一为 none。
- completedLines 达两条才允许 settled；不足两条的 settled / outcome 归一为未结算。
- 不读取、不覆盖 v28–v34 与主线状态。
- 进入 v35 房间允许既有 v35 visited 自然更新；v37 接线 / 回拨不得改变 v35 signal、debt、completed、settled、outcome、marks 或累计结算值。
- 「遗忘」同步清除 v37 键。

## 目录、痕迹与缓存

- 首次访问回拨台后恢复：
  - `01ρ / 午夜回拨`
- 未访问时目录项 hidden 且不可聚焦。
- Remembrance 只新增一行，不增加第九张统计卡：
  - `午夜回拨：完成 N 轮，清线 C，疑线 U，污线 D，最佳线路 B。`
- Service Worker 缓存名推进到 v37，并预缓存四张正式 WebP。

## 布局与无障碍

桌面 1440×1024：

- 标题、回拨签、母场景图、三条线路卡、底部返回入口都在首屏。
- 三张线路卡同排，图片身份清楚，无横向溢出。

移动 390×844：

- 标题、回拨签、三条线路卡全部首屏可操作。
- 允许隐藏母场景图，但不能隐藏三张线路图。
- 三卡可用紧凑三列；按钮触达 ≥44px，文字不得互相覆盖。
- 三个 v35 房间新增第四动作后，用 2×2 紧凑布局，四个动作首屏可达。

键盘：

- 线路卡、房间回拨动作支持原生 Enter / Space。
- disabled 与 `aria-pressed` 必须准确反映 pending / completed。
- 反馈 `aria-live=polite`。

reduced-motion：

- 反馈仍完整显示。
- 自动转场约 0.3 秒完成。

## 静态与真实浏览器验收

Kimi 必须补静态断言与真实浏览器脚本，至少覆盖：

1. 四张源 PNG 保留、四张 WebP 存在并被引用。
2. 守则其六原文 / 反馈不变，只改变目的地；其余七条与「玖」逻辑不变。
3. 回返夹道原四动作逐字保持，第五动作新入口、首选锁与移动首屏。
4. 直接 hash 不自动接线。
5. 三条线路选择 → 对应房间 → 新回拨动作 → 回台的真实鼠标路径。
6. 三种两线组合全部经真实 UI 落入 clear / uncertain / contaminated。
7. pending 离场 / 刷新 / 重访恢复，完成线路不重复加值。
8. 房间既有动作可抢首选锁，pending 保留；其原反馈、分值、mark 与目的地不变。
9. Enter / Space、快速连点、竞争点击与 reduced-motion。
10. 坏 JSON、错型、伪造分值、冲突 pending、非法 settled / outcome 与数值上限。
11. v37 行为不污染 v35 值班结算字段，也不污染 v28–v34 与主线。
12. 目录 `01ρ`、痕迹单行、遗忘与 8 卡保持。
13. 控制台零 error / exception。
14. 回归至少覆盖 v36 smoke / visual、v35 smoke / visual、v34 smoke / visual。

视觉证据至少包含：

- 回拨台桌面 1440×1024。
- 回拨台移动 390×844。
- 三条线路各自 pending 反馈态。
- 三个房间各自回拨反馈态。
- 三档结算反馈态。
- 回返夹道五动作桌面 / 移动。
- 守则其六入口反馈态。
- 目录与痕迹。
- 短桌面 1440×800。

每张截图先满足 scene active、veil 释放、reveal 完成、可见素材 decoded，再截图；源图与对应页面截图必须放进同一比较输入做联合目验。

## 完成文档

实现完成后由 Kimi 更新：

- `README.md`
- `docs/ProgressLog.md`
- `design-qa.md`

不得修改 `docs/KimiUsageLog.md`，该文件仍由监理在提交时记录。

Kimi 完成时按以下顺序汇报：

1. 实现文件与四张正式 WebP。
2. smoke / visual 数量与结果。
3. v36 / v35 / v34 回归数量与结果。
4. 截图文件清单。
5. 文档更新。
6. 是否出现真实额度错误；`429 engine overloaded` 单独如实报告，不等同额度耗尽。
