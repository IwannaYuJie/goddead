# v42 守则漂移 / THE PROTOCOL DRIFT

## 目标

v41 已把访客守则布告板背后的红线、空名牌与无舌铃扩成三间可互相穿行的真实房间。v42 不再追加一条固定长链，而是让同一块守则板在玩家回访时发生可重复、可记忆、可误判的细微漂移：

- 玩家先在 v41 三间背室中见过任意两间，守则板顶部旧蜡印才显露第四个入口「巡查」。
- 巡查时反复面对同一块布告板；本拍可能完全正常，也可能只有红线、空名牌或无舌铃其中一处变异。
- 玩家直接点击画面里认为异常的器物；若没有异常，则点击顶部旧蜡印继续。
- 正确判断立即进入下一拍；误判立即被守则板送进与误判位置对应的 v41 房间。
- 连续判断三次正确完成一轮，并根据第三拍类型回到守则或落入对应背室。
- 巡查次数、正确数、误报数、当前连对与最佳连对持续累计，给已有分支增加可反复玩的数值层。

灵感只取机制，不复制界面或叙事：

- [The Exit 8](https://store.steampowered.com/app/2653790/8/)：熟悉固定空间基准；有异常就回退、无异常才前进。
- [I'm on Observation Duty](https://store.steampowered.com/app/1046820/)：依靠记忆辨认物件变化并报告异常位置。
- [Stories Untold](https://store.steampowered.com/app/558420/Stories_Untold/)：让老旧器物与场景本身承担交互，而不是把玩法放进脱离世界观的菜单。

## 保留项

以下既有内容不得被 v42 改写：

- `assets/visitor-protocol-board.webp` 继续作为完全正常的基准图；不替换、不重编码、不改尺寸。
- `#protocol` 八条守则、八条既有分流、原反馈、捌 / 玖异常与 `#ninth` 路径。
- v41 红线 / 空名 / 无舌铃三个入口、三间背室、九个动作、反馈、状态与目录。
- v28–v41 主线和各版状态语义、八张统计卡、现有目录与痕迹。
- 所有交互仍是点击 / Enter / Space 后立即反馈并自动推进；没有确认、下一步、继续或滚到底按钮。

## 解锁与入口

### 解锁

只读 `goddead_v41_protocol_backrooms.visited`：

- `thread / name / bell` 中任意两项为 `true` 时，显示 `#protocol-hotspot-drift`。
- v42 不得改写 v41 key；坏 JSON、数组错型或缺键按全 false 处理。
- 干净存档与只访问一间背室时，入口保持 `hidden`、不可聚焦。
- 访问第二间背室后，下一次进入 `#protocol` 立即显露，不要求刷新。
- 直接 hash `#protocol-drift` 始终允许进入，便于恢复、分享与 QA；只是不提前暴露入口。

### 守则板第四入口

在现有 `.protocol-figure` 内新增：

- id：`#protocol-hotspot-drift`
- 覆盖位置：布告板最上方中央原本就存在的暗红旧蜡印。
- 短标签：`巡查`
- aria-label：`按下访客守则上沿的旧蜡印，检查布告板是否发生漂移`
- 反馈元素：继续使用 v41 的 `#protocol-backroom-response`，但不得覆盖八条守则反馈。
- 反馈：`旧蜡印比上一次更软。布告板要求你证明，自己还记得它原来的样子。`
- 自动去：`#protocol-drift`

交互契约：

- 与八条守则及 v41 三入口共用现有 `AutoAdvance` 的 `protocol` 首选锁；第一项被接受后，本拍其他规则 / 热点均不得写状态或抢转场。
- 处理器在读取 v41 / v42 状态、播放声音、写反馈或排 timer 前，先校验 `currentScene === "protocol"`。
- `玖` 继续保持既有最高优先级和既有直接路径，不并入 v42 状态。
- 触达至少 44×44；桌面和移动都覆盖真实旧蜡印。

## 新场景：守则漂移巡查台

- hash：`#protocol-drift`
- data-scene：`protocol-drift`
- 标题：`守则漂移`
- kicker：`THE PROTOCOL DRIFT · 守 则 漂 移`
- 说明：`你不需要记住每一条守则。你只需要记住，自己上一次看见它们时，哪里还没有开始呼吸。`
- 正常图：复用 `assets/visitor-protocol-board.webp`
- 红线变异：`assets/protocol-drift-thread.webp`
- 空名变异：`assets/protocol-drift-nameplate.webp`
- 无舌铃变异：`assets/protocol-drift-bell.webp`
- 状态行：`连对 X / 3 · 最佳 Y / 3 · 正确 C · 误报 M`
- 状态行是轻量单行读数，不做卡片、仪表盘或结果页。

场景只保留一张大图与五个原生画面内按钮：

1. `#drift-hotspot-thread`
   - 覆盖左侧红线与蜡结。
   - 短标签：`红线漂移`
   - aria-label：`报告守则板左侧红线发生漂移`

2. `#drift-hotspot-nameplate`
   - 覆盖底部中央空白长牌。
   - 短标签：`空名漂移`
   - aria-label：`报告守则板底部空白名牌发生漂移`

3. `#drift-hotspot-bell`
   - 覆盖右下黄铜圆钮。
   - 短标签：`铃钮漂移`
   - aria-label：`报告守则板右下无舌铃钮发生漂移`

4. `#drift-hotspot-forward`
   - 覆盖顶部中央旧蜡印。
   - 短标签：`未见漂移`
   - aria-label：`确认本次守则板没有发生漂移并继续巡查`

5. `#drift-exit`
   - 低权重出口：`退回守则`
   - 自动去：`#protocol`
   - 只用于退出巡查，不算正确或误报，不改变 streak。

前三个报告热点、正常确认热点都必须 ≥44×44，Tab 顺序为红线 → 空名 → 铃钮 → 未见漂移 → 退回守则。

## 四种巡查拍

### normal / 正常

- 图：`assets/visitor-protocol-board.webp`
- 正确动作：`#drift-hotspot-forward`
- 正确反馈：`旧蜡印没有移动。你放行了一个仍然服从原样的夜晚。`

### thread / 红线

- 图：`assets/protocol-drift-thread.webp`
- 变异：左侧一根暗红线没有再连接守则横条，而是在原位自缠成一个多余的第九结；其他结构不变。
- 正确动作：`#drift-hotspot-thread`
- 正确反馈：`你指出第九个绳结。它松开时，墙后传来一张纸被撤回的声音。`

### name / 空名

- 图：`assets/protocol-drift-nameplate.webp`
- 变异：底部空白长牌像一只极浅抽屉般向外滑开，缝内悬着一枚无字黄铜取物牌；其他结构不变。
- 正确动作：`#drift-hotspot-nameplate`
- 正确反馈：`空名牌退回墙里。那枚没有号码的取物牌也跟着消失了。`

### bell / 无舌铃

- 图：`assets/protocol-drift-bell.webp`
- 变异：右下黄铜圆钮变成一个很小的无舌铃口，底边渗出一线黑色液体；其他结构不变。
- 正确动作：`#drift-hotspot-bell`
- 正确反馈：`你在它响以前认出了铃口。黑色液体沿原路缩回黄铜里面。`

## 拍序与分流

使用固定、可测试但每轮错开的序列：

```js
["thread", "normal", "bell", "name", "thread", "bell", "normal", "name"]
```

- 一轮从 `(cycle * 3) % 8` 开始。
- 每次正确后 cursor +1，显示下一拍；不换 hash，但必须经过一次可感知的遮罩 / 换图节拍。
- 同一拍只接受第一项合法动作；第一项接受后四个判断热点立即 disabled。
- 每次错误后 cycle +1、cursor=0、streak=0，写误报并自动离开：
  - 错报红线 → `#red-thread-registry`
  - 错报空名 → `#blank-name-cloakroom`
  - 错报铃钮 → `#clapperless-bell-desk`
  - 异常拍却选择「未见漂移」→ 送入真实异常对应的 v41 房间
- 连续三次正确时本轮完成，cycle +1、cursor=0、streak=0：
  - 第三拍为 normal → `#protocol`
  - 第三拍为 thread → `#red-thread-registry`
  - 第三拍为 name → `#blank-name-cloakroom`
  - 第三拍为 bell → `#clapperless-bell-desk`
- 完成反馈在离场前单独可感知一拍：
  - normal：`三次巡查没有留下误差。守则允许你从正面回去。`
  - thread：`三次巡查缠成同一根线。登记室要求保存这份连对记录。`
  - name：`三次巡查仍没有写出名字。寄存处替你保留了空白。`
  - bell：`三次巡查都先于铃声。接待台把沉默记作合格。`

## 误判反馈

误判必须说明玩家选择与真实拍面，而不是只显示「错误」：

- normal 错报 thread：`你报告了红线，但红线没有移动。误报把你送进登记室重新认线。`
- normal 错报 name：`你报告了空名牌，但它仍然闭合。寄存处要求你核对自己的名字。`
- normal 错报 bell：`你报告了铃钮，但它还没有张口。接待台仍把误报当成一次叫号。`
- thread 选择 forward：`你放行了第九个绳结。红线从布告板背面把你拖进登记室。`
- name 选择 forward：`你放行了半开的空名牌。取物牌把你领进寄存处。`
- bell 选择 forward：`你放行了渗液的铃口。没有声音的叫号仍然轮到了你。`
- 任一异常拍错报另一位置：按「错报位置」落入对应房间，反馈同时点明真实异常仍留在原处。

## 状态契约

独立 key：

`goddead_v42_protocol_drift`

建议字段：

```json
{
  "visited": false,
  "cycle": 0,
  "cursor": 0,
  "round": "thread",
  "streak": 0,
  "bestStreak": 0,
  "correct": 0,
  "misreports": 0,
  "inspections": 0,
  "lastRound": "",
  "lastAnswer": "",
  "pending": null,
  "marks": []
}
```

白名单：

- round / lastRound：`normal / thread / name / bell`
- lastAnswer：`forward / thread / name / bell / exit / ""`
- marks：
  - `unlockedProtocolDrift`
  - `enteredProtocolDrift`
  - `reportedThreadDrift`
  - `reportedNameDrift`
  - `reportedBellDrift`
  - `passedCleanBoard`
  - `misreportedThread`
  - `misreportedName`
  - `misreportedBell`
  - `missedRealDrift`
  - `completedCleanCycle`
  - `completedThreadCycle`
  - `completedNameCycle`
  - `completedBellCycle`

修复规则：

- cycle / correct / misreports / inspections：有限、非负、向下取整、封顶 9999。
- cursor：有限、非负、向下取整，只接受 0–7，并按 cycle + 固定序列重算 round。
- streak / bestStreak：只接受 0–3；bestStreak 不得小于 streak。
- lastRound / lastAnswer 只接受合法组合；不合法一起清空。
- pending 必须是完整映射 `{ round, answer, correct, target, feedback, nextCycle, nextCursor }`，并与固定规则表逐字段一致；任一字段错配即清空。
- pending 只用于恢复已接受但尚未完成的反馈 / 换图 / 转场；不得重复累计 inspections、correct、misreports 或 marks。
- handler 在任何 v42 状态读写、反馈、声音或 timer 前校验 `currentScene === "protocol-drift"`。
- 进入其他场景时取消 timer 但保留合法 pending；重返 `#protocol-drift` 时重播原反馈并完成原动作，不发生幽灵跳转。
- v42 可以只读 v41 visited 用于入口解锁；不得写 v28–v41 或主线 key。

## 素材美术方向

三张变异源图都必须以 `assets/visitor-protocol-board.webp` 为严格参考做局部编辑：

- 输出 1536×1024、RGB、横向 3:2。
- 保留原图镜头、透视、裁切、布告板尺寸、八条空白横条、左侧红线、底部长牌、右侧黄铜结构、墙面、管线、光线、材质与色温。
- 不新增可读文字、数字、logo、水印、人物、脸或手。
- 只允许指定异常区域改变；三个未指定热点必须与基准图尽量像素级接近。
- 变异在 1440×1024 桌面与 390×844 中央裁切都能辨认，但不能夸张成第一眼的怪物或大面积破坏。
- 深黑但保留器物轮廓；不能把异常藏进纯黑。

源图与正式图：

1. `design-references/source-protocol-drift-thread.png`
   - → `assets/protocol-drift-thread.webp`
   - 只改左侧红线：一根线原地缠成多余的第九结，结上有微弱湿红蜡光。

2. `design-references/source-protocol-drift-nameplate.png`
   - → `assets/protocol-drift-nameplate.webp`
   - 只改底部长牌：向外滑开约 3–5 cm，黑缝里悬一枚无字黄铜圆牌。

3. `design-references/source-protocol-drift-bell.png`
   - → `assets/protocol-drift-bell.webp`
   - 只改右下黄铜钮：变成小型无舌铃口，底边渗出一线黑色液体。

## 布局与无障碍

- 1440×1024：标题、说明、状态行、整块巡查图与四个判断热点首屏可见。
- 1440×800：状态行与整块巡查图首屏，四热点 ≥44px；不得把判断按钮挤到折叠以下。
- 390×844：标题、状态行、巡查图与四个判断热点首屏可见；中央裁切保持三处异常区域和顶部蜡印同时在画面内；零横向溢出。
- 热点可见标签保持短而低对比，不遮住异常；focus-visible 清晰。
- `aria-live="polite"` 的独立反馈元素放在巡查图内下缘或紧邻图下方，当前视口可感知。
- `prefers-reduced-motion` 缩短遮罩 / 自动推进节拍，但仍保留「判断反馈 → 下一拍 / 转场」顺序。

## 目录与痕迹

Directory 新增一条：

- `02β / 守则漂移` → `#protocol-drift`
- 未访问 hidden；首次进入后恢复；遗忘全部后重新隐藏。

Remembrance 新增一行：

`守则漂移：巡查 N 次；正确 C 次；最佳连对 B/3；误报 M 次。`

- 不新增第九张统计卡。
- 遗忘全部时清除 v42 key、目录入口与痕迹行，同时保留既有 v41 清理语义。

## Kimi 实现边界

- Kimi 负责全部 `index.html` / `styles.css` / `script.js` / 测试 / 截图 / README / ProgressLog / design-qa 实现。
- 监理只提供本设计文档、三张源 PNG、独立 QA 与放行意见。
- 不改 `docs/KimiUsageLog.md`。
- 不执行 `git add` / `commit` / `stash` / `push`，不触碰现有 v32 暂存区。

## QA 验收

1. v41 当前实现与 `assets/visitor-protocol-board.webp` 基准图零回归。
2. 三张源 PNG 均为 1536×1024 RGB；三张 WebP 存在、可解码、引用正确。
3. 源图与网页截图同屏对照：除指定异常外，镜头、板体、横条、墙面、管线和光线保持一致。
4. v41 visited 0/1/2/3 情况下，入口 hidden / hidden / visible / visible；入口即时刷新，不改 v41 key。
5. 第四入口覆盖真实旧蜡印，aria / 短标签 / 反馈逐字，触达 ≥44px。
6. 第四入口与八条守则、v41 三入口 first-lock 双向成立；`玖` 语义不变。
7. `#protocol-drift` 直 hash 可玩；不会自动作答。
8. normal / thread / name / bell 四拍分别显示正确图，四个热点覆盖真实区域。
9. 四种正确判断逐字反馈，正确 / inspections / streak / bestStreak 只增一次。
10. 连对未满 3 时自动显示下一拍，同 hash 下图片真实更新，焦点回到第一判断热点。
11. 第三次正确四类完成反馈与四目的地逐条真实 UI 验证。
12. normal 三种错报与三种异常漏报，逐字反馈、误报计数、streak 清零、目标房间逐条验证。
13. 异常拍错报另一异常位置，反馈同时说明真实异常未被处理，按错报位置分流。
14. 同拍点击 / Enter / Space / 程序化连发只接受第一项；disabled 与首选锁即时。
15. protocol 触发隐藏 drift 热点、drift 触发隐藏 v41 / protocol 热点、其他场景触发隐藏 drift 判断，全部在任何副作用前被 currentScene guard 拒绝。
16. 坏 JSON、数组错型、数字负数 / 浮点 / Infinity / 1e18、非法 round / answer / marks、cursor 错配安全归一。
17. pending target / feedback / correct / nextCycle / nextCursor 任一错配清空；合法 pending reload 与离场重返只恢复动作、不重复计数。
18. v28–v40、主线 key 字节级不变；v41 只读且字节级不变。
19. Directory `02β`、Remembrance 单行、严格 8 卡、遗忘清理。
20. 1440×1024、1440×800、390×844：零横向溢出、四判断热点首屏、异常可辨、触达 ≥44px。
21. 保存至少 14 张证据：基准 / 三变异桌面、基准 / 三变异移动、入口解锁、正确反馈、误判反馈、三连完成、目录、痕迹。
22. v42 smoke 连续两次全绿，v42 visual 全绿；回归 v41、v40、v39、v38、v37；控制台零异常，所有临时浏览器与服务器进程正常退出。
