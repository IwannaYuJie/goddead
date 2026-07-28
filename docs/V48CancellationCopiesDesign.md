# v48 注销留副 / THE CANCELLATION KEPT ITS COPIES

## 0. 分工与边界

- Codex：世界观、交互合同、素材生成与独立验收。
- Kimi K3 High：唯一生产代码实现者，负责 HTML / CSS / JS / tests / README / design-qa / ProgressLog。
- 本轮不执行 `git add / commit / push / stash`，不触碰 `docs/KimiUsageLog.md`，保持既有 staged 边界。
- v47 正式验收前不得开始 v48 生产实现；本文件与三张源 PNG 可先准备。

## 1. 目标

神名注销科现在仍是固定流程：输入档案状态 `GODDEAD`，读取五行档案，再拒绝注销。v48 保留这条主线，把 `assets/divine-name-cancellation.webp` 中本来就存在的三件实物变成旁路入口：

1. 终端中央始终空白的检索屏；
2. 屏幕右侧仍亮着的红色确认灯；
3. 桌面右侧摞起的档案屉。

三入口只保留一拍逐字反馈并自动转场，没有确认页、下一步或底部继续按钮。原检索输入、三档错误提示、五行档案、拒绝注销、两行驳回记录与代神席入口全部保留。

## 2. 总体世界观

注销科声称自己只删除删不掉的名字，但每次注销都会留下三种不在正式档案里的副本：

- 空白屏背面留着一次没有显示出来的检索；
- 红色确认灯把“未注销”误记成一次新的批准；
- 见证者拒绝以后，桌侧档案屉会多出一张没有姓名的复写纸。

三处合称“注销留副”。它们不替玩家检索 `GODDEAD`，不替玩家拒绝注销，也不改变拒绝是否已经登记；只是注销失败后仍被机器偷偷保留的物理余件。

## 3. 神名注销科三入口

保持 `assets/divine-name-cancellation.webp` 原文件、尺寸与字节不变，在真实器物上叠三枚 native `<button>` 热点，独立 class `.cancellation-copy-entry-hotspot`：

| 热点 | ID | 短标签 | aria-label | 逐字反馈 | 目的地 |
|---|---|---|---|---|---|
| 终端中央空白屏 | `cancellation-copy-entry-screen` | 探空屏 | 触摸注销科终端中央始终空白的检索屏 | `空白屏没有显示查询结果。玻璃背面却有一整间档案室亮了起来。` | `#blank-screen-underarchive` |
| 终端右侧红灯 | `cancellation-copy-entry-lamp` | 按红灯 | 按下注销科终端右侧仍亮着的红色确认灯 | `红灯没有熄灭。它把“未注销”误当成了新的批准。` | `#false-confirmation-desk` |
| 桌面右侧档案屉 | `cancellation-copy-entry-trays` | 抽侧屉 | 抽开注销科终端右侧摞起的档案屉 | `侧屉里没有原件，只有每位见证者拒绝以后留下的复写副本。` | `#witness-carbon-archive` |

入口反馈写入图下独立 `#cancellation-copy-entry-response`，并带 `aria-live="polite"`；不要复用检索提示、档案记录、驳回记录或 toast。

### 与拒绝注销主线的第一归宿锁

- 新增内存旗标 `cancellationCopyArmed`，每次 `enterCancel()` 复位。
- v48 入口先检查 `currentScene === "cancellation"`，再检查 `AutoAdvance.has("cancellation")` 与 `cancellationCopyArmed`；任何检查失败时，对所有状态、反馈、声音、class 与 timer 都必须零副作用。
- v48 入口被接受时先置 `cancellationCopyArmed = true`，再 `AutoAdvance.clear("cancellation")` 与 `clearCnTimers()`，然后才可写 v48 状态、反馈并排定目标。
- 拒绝注销已排定 `#acting` 时，三入口必须完全 inert。
- v48 入口先接受时，检索表单与拒绝注销按钮在反馈拍内都必须 early return，不得迟到写 `goddead_cancellation`、增加 queries、命中档案、显现记录、写 refused/refusedAt 或改写目的地。
- 错误检索或正确检索本身不排定目的地：只要尚未拒绝、未排定 `#acting` 且 v48 未武装，三入口仍可正常进入；玩家回来后由 `enterCancel()` 复位旗标并按原持久状态恢复提示、档案或拒绝按钮。
- v48 入口绝不写 `goddead_cancellation`、不替玩家输入 `GODDEAD`、不替玩家拒绝注销；主线仍只能由原表单与 `#refuse-btn` 推进。

## 4. 三个新场景与九个动作

统一要求：

- 每场景一张 1536×1024 WebP，沿用黑铁 / 老黄铜 / 旧纸 / 骨白屏光 / 少量暗红信号光；
- 图内三枚 native `<button>`，统一 `.cancellation-copy-hotspot`，触控目标至少 44×44；
- 每个按钮覆盖真实器物，不做卡片列表、示意图、SVG 或 CSS 假素材；
- 首个动作锁住本场景三个热点，反馈一拍后自动转场；
- `Enter` / `Space` 通过 native button 自然工作；
- 场景底部只有回到神名注销科的非主推进出口。

### 4.1 空白屏底库 / THE ARCHIVE BENEATH THE BLANK SCREEN

素材：`assets/blank-screen-underarchive.webp`

| 热点 | ID | 短标签 | aria-label | 逐字反馈 | 目的地 | mark |
|---|---|---|---|---|---|---|
| 中央骨白巨屏 | `copy-screen-action-screen` | 触白屏 | 触摸屏底库中央发出骨白光的巨大空白屏 | `空白屏亮得更白，中央浮出一枚不该获准的红点。` | `#false-confirmation-desk` | `litFalseApprovalPoint` |
| 左下卷曲纸带 | `copy-screen-action-paper` | 抽纸带 | 抽出屏底库左下走纸机里卷曲的空白纸带 | `纸带没有打印内容，却在卷曲处折出一个已经退回的地址格。` | `#returned-address-cabinet` | `foldedReturnedAddressCell` |
| 右侧圆形暗孔 | `copy-screen-action-aperture` | 窥暗孔 | 窥看屏底库右墙黄铜边框里的圆形暗孔 | `孔后没有眼睛，只有一只没坐人的听筒在记录屏幕的静电。` | `#unseated-listening-booth` | `heardScreenStaticBelow` |

### 4.2 误准红灯台 / THE FALSE-CONFIRMATION DESK

素材：`assets/false-confirmation-desk.webp`

| 热点 | ID | 短标签 | aria-label | 逐字反馈 | 目的地 | mark |
|---|---|---|---|---|---|---|
| 中央红色确认灯 | `copy-lamp-action-lamp` | 复按红灯 | 再次按下误准台中央烟熏玻璃后的红色确认灯 | `红灯确认了一次从未发生的注销；复写库立刻多出一张见证副本。` | `#witness-carbon-archive` | `confirmedUnmadeCancellation` |
| 左侧注销印 | `copy-lamp-action-seal` | 压注销印 | 压下误准台左侧沉重的圆形注销印 | `注销印压下去，桌面从下方回敲了一次。回敲廊把它收作入场凭据。` | `#counter-knock-gallery` | `stampedCounterKnockPermit` |
| 右侧退纸槽 | `copy-lamp-action-chute` | 探退纸槽 | 把手伸向误准台右侧直落黑暗的退纸槽 | `退纸槽没有底。落下的空白批件被气流托进无主气送井。` | `#unclaimed-pneumatic-intake` | `droppedApprovalIntoIntake` |

### 4.3 见证复写库 / THE WITNESS CARBON ARCHIVE

素材：`assets/witness-carbon-archive.webp`

| 热点 | ID | 短标签 | aria-label | 逐字反馈 | 目的地 | mark |
|---|---|---|---|---|---|---|
| 屉内空白复写纸 | `copy-carbon-action-sheet` | 揭复写纸 | 揭开见证复写库中央抽屉里的空白复写纸 | `复写纸揭开时仍是一片空白；屏底库却替它亮起。` | `#blank-screen-underarchive` | `revealedBlankCarbonCopy` |
| 中央抽屉把手 | `copy-carbon-action-drawer` | 拉见证屉 | 拉动见证复写库中央伸向你的黑铁抽屉 | `抽屉只拉出半寸，所有副本的孔眼已经被同一根红线穿过。` | `#red-thread-registry` | `threadedWitnessCopies` |
| 右上黄铜见证卡 | `copy-carbon-action-card` | 取见证卡 | 取下抽屉右上机械夹中的空白黄铜见证卡 | `见证卡上没有姓名，只有一格未到班的空位。缺班柜替它留门。` | `#absent-relief-locker` | `filedAbsentWitnessCard` |

三场景形成 `屏底库 → 误准灯台 → 复写库 → 屏底库` 的可走闭环，同时分流到退址格柜、失席监听室、回敲廊、无主气送井、红线登记所和缺班柜。

## 5. 独立状态合同

只使用：

`goddead_v48_cancellation_copies`

规范形状：

```js
{
  visited: { screen: false, lamp: false, carbon: false },
  entry: "direct",
  pending: null,
  lastScene: "",
  lastAction: "",
  copies: 0,
  marks: []
}
```

- `visited` 仅三个严格布尔键。
- `entry` 白名单：`cancel-screen / cancel-lamp / cancel-trays / screen / lamp / carbon / direct`。
- `pending` 必须严格是 `{scene, action, target, feedback}` 四字段，且逐字段等于动作表；任何缺失、错配、伪造 target / feedback 都归一为 `null`。
- `lastScene` 仅 `screen / lamp / carbon`；`lastAction` 必须属于对应 scene。
- `copies` 非负整数并裁到 9999。
- `marks` 仅九项白名单、去重、最多九项。
- 坏 JSON、数组、错型对象安全回 neutral。
- v48 处理器不直接读写 v28–v47、`goddead_cancellation` 或其他主线键。进入既有目标场景后，目标场景自己的既有落地语义不属于 v48 入口写入。

## 6. pending / reload / 离场

- 入口在点击时立即写 visited 与 copies，排定前写全合法状态。
- 新场景在进入时写 visited。
- 动作先写 lastScene / lastAction / mark / copies / pending，再反馈并排定。
- timer 真正触发前才清 pending。
- reload 在反馈拍内：逐字重播反馈、恢复同一目标，不得重复 copies 或 marks。
- 离开反馈拍：取消 timer，pending 保留；回到同一 v48 场景才重播并续走，其他场景不 ghost jump。
- reduced-motion 仍须保留可读反馈拍，只缩短 delay。
- 直接 hash 进入只记 visited，不自动执行动作。

## 7. 目录、痕迹与遗忘

- 首次到访后原子恢复：
  - `02σ / 屏底库` → `#blank-screen-underarchive`
  - `02τ / 误准灯` → `#false-confirmation-desk`
  - `02υ / 复写库` → `#witness-carbon-archive`
- 未到访时严格 `hidden`、不可聚焦。
- Remembrance 只加一行：

`注销留副：复写 N 次；屏底库 / 误准灯 / 复写库已见 X/3。`

- 保持统计卡严格 8 张。
- “遗忘一切”清除 v48 key、隐藏三目录入口与记忆行；不新增单独清除按钮。

## 8. 素材与视觉约束

- 保持既有 `assets/divine-name-cancellation.webp` 哈希、尺寸与文件字节不变。
- 源 PNG：
  - `design-references/source-blank-screen-underarchive.png`
  - `design-references/source-false-confirmation-desk.png`
  - `design-references/source-witness-carbon-archive.png`
- 生产 WebP：
  - `assets/blank-screen-underarchive.webp`
  - `assets/false-confirmation-desk.webp`
  - `assets/witness-carbon-archive.webp`
- 三张 WebP 必须保持 1536×1024；目标单张 `<450 KB`，可更小但不得明显糊掉黄铜边缘、空白纸面、抽屉或暗红信号。
- 禁止新图中出现可读文字、数字、标志、人物、手、UI、水印。

## 9. QA 完成门槛

Kimi 必须写并实际运行独立 smoke / visual 临时脚本，至少覆盖：

1. 三注销科入口逐字反馈、visited/entry/copies、自动到达；
2. 三入口对 `goddead_cancellation` 字节级零写；
3. 三档错误提示、`GODDEAD` 唯一命中、五行档案、拒绝注销、两行驳回记录与原 `#acting` 路径不变；
4. 拒绝注销已排定 → v48 三入口零副作用；
5. v48 入口先接受 → 表单与拒绝按钮零迟到写入、目的地不被覆盖；
6. 错误或正确检索后仍可进入旁路，返回注销科后原持久状态与可操作主线正确恢复；
7. 三场景、九动作、九目标、闭环、键盘 Enter/Space；
8. live-scene / hidden DOM / off-route 双向零副作用；
9. 同拍竞争只接受第一项，三个场景热点即时 disabled；
10. pending 合法/伪造、reload、离场、reduced-motion；
11. 坏 JSON、错型、9999 裁剪、lastScene/lastAction 修复；
12. v28–v47 与主线种子快照隔离；
13. 目录 02σ/02τ/02υ、痕迹单行、严格 8 卡、遗忘；
14. visual 至少含：注销科 clean、三入口反馈、三场景桌面/移动/短桌面、三动作反馈、目录、痕迹；
15. `node --check script.js`、`node tests/site.test.mjs`、`git diff --check`；
16. 回归 v47 smoke+visual、v46 smoke+visual、v45 smoke+visual、旧 cancellation/acting/search/refusal 近邻。

连续两次 v48 Smoke 与连续两次 v48 Visual 全绿后才可进入最终报告；逐张目验不能只报截图数量，必须把源图与同状态网页截图放进同一对照图后再判断。
