# v47 退件未止 / THE RETURNS OUTLIVED THEIR ADDRESSES

## 0. 分工与边界

- Codex：世界观、交互合同、素材生成与独立验收。
- Kimi K3 High：唯一生产代码实现者，负责 HTML / CSS / JS / tests / README / design-qa / ProgressLog。
- 本轮不执行 `git add / commit / push / stash`，不触碰 `docs/KimiUsageLog.md`，保持既有 staged 边界。
- v46 正式验收前不得开始 v47 生产实现；本文件与三张源 PNG 可先准备。

## 1. 目标

无主投递所现在仍是固定流程：归档三封退件，再签收空白回执。v47 保留这条主线，把 `assets/dead-letter-office.webp` 中本来就存在的三件实物变成旁路入口：

1. 后墙中央三只黄铜气送管；
2. 右上塞满退件的格柜；
3. 桌面中央空白回执。

三入口只保留一拍逐字反馈并自动转场，没有确认页、下一步或底部继续按钮。原三封退件、空白回执、逐行终局记录与神名注销科入口全部保留。

## 2. 总体世界观

第四线路把无人应答的东西送回无主投递所；投递所仍有三类退件无法放进登记台：

- 没有寄件人，因此气送筒拒绝停下的东西；
- 地址曾经存在、如今只剩分格位置的东西；
- 寄件人与收件人都消失以后，仍要求签收的空白回执。

三处合称“退件后室”。它们不是新的退件，也不改变空白回执是否已签收；只是退件被登记以后仍在继续改址。

## 3. 无主投递所三入口

保持 `assets/dead-letter-office.webp` 原文件、尺寸与字节不变，在真实器物上叠三枚 native `<button>` 热点，独立 class `.return-room-entry-hotspot`：

| 热点 | ID | 短标签 | aria-label | 逐字反馈 | 目的地 |
|---|---|---|---|---|---|
| 后墙三只气送管 | `return-room-entry-tubes` | 探气管 | 探入投递所后墙三只黄铜气送管 | `三只气送管同时吸气。最中间那只把你的呼吸盖上了“退回”。` | `#unclaimed-pneumatic-intake` |
| 右上退件格柜 | `return-room-entry-cabinet` | 翻格柜 | 翻查投递所右上装满退址信件的格柜 | `格柜里每一封信都写着地址，只有地址本身已不在那里。` | `#returned-address-cabinet` |
| 桌面空白回执 | `return-room-entry-receipt` | 取空执 | 取走投递所桌面中央的空白回执 | `空白回执离开桌面，纸下露出一台本不该放在楼下的压印机。` | `#blank-receipt-press` |

入口反馈写入图下独立 `#return-room-entry-response`，并带 `aria-live="polite"`；不要复用退件登记台 alt 文案或 toast。

### 与空白回执主线的第一归宿锁

- 新增内存旗标 `deadletterReturnRoomArmed`，每次 `enterDeadletter()` 复位。
- v47 入口先检查 `currentScene === "deadletter"`，再检查 `AutoAdvance.has("deadletter")` 与 `deadletterReturnRoomArmed`；任何检查失败时，对所有状态、反馈、声音、class 与 timer 都必须零副作用。
- v47 入口被接受时先置 `deadletterReturnRoomArmed = true`，再 `AutoAdvance.clear("deadletter")`，然后才可写 v47 状态、反馈并排定目标。
- 空白回执主线已排定 `#cancellation` 时，三入口必须完全 inert。
- v47 入口先接受时，三枚退件按钮与空白回执按钮在反馈拍内都不得迟到写 `goddead_deadletter`、显现登记文案、解锁回执、签收或改写目的地。
- 退件壹/贰/叁不是目的地竞争：在尚未排定空白回执且 v47 未武装时保持原语义。
- v47 入口绝不写 `goddead_deadletter`、不替玩家归档退件、不替玩家签收空白回执；主线仍只能归档三件后点击回执推进。

## 4. 三个新场景与九个动作

统一要求：

- 每场景一张 1536×1024 WebP，沿用黑石 / 老黄铜 / 旧纸 / 少量暗红信号光；
- 图内三枚 native `<button>`，统一 `.return-room-hotspot`，触控目标至少 44×44；
- 每个按钮覆盖真实器物，不做卡片列表、示意图、SVG 或 CSS 假素材；
- 首个动作锁住本场景三个热点，反馈一拍后自动转场；
- `Enter` / `Space` 通过 native button 自然工作；
- 场景底部只有回到无主投递所的非主推进出口。

### 4.1 无主气送井 / THE UNCLAIMED PNEUMATIC INTAKE

素材：`assets/unclaimed-pneumatic-intake.webp`

| 热点 | ID | 短标签 | aria-label | 逐字反馈 | 目的地 | mark |
|---|---|---|---|---|---|---|
| 左下气送筒 | `return-intake-action-carrier` | 开气筒 | 打开左下石台上无人认领的气送筒 | `圆筒里没有信，只有一枚会替收件人旋转的分格轮。` | `#returned-address-cabinet` | `openedUnclaimedCarrier` |
| 中央管口 | `return-intake-action-horn` | 听管口 | 把耳朵贴近中央正对深井的气送管口 | `管口没有风，却把午夜回拨台尚未拨出的铃声吹到耳边。` | `#midnight-callback` | `heardUnsentCallback` |
| 右墙红绳 | `return-intake-action-cord` | 拉红绳 | 拉下右墙压力表旁的红色泄压绳 | `红线一拉，压力表归零。楼上的回铃被当作退件送进陈放室。` | `#return-ring-morgue` | `ventedReturnedPressure` |

### 4.2 退址格柜 / THE RETURNED-ADDRESS CABINET

素材：`assets/returned-address-cabinet.webp`

| 热点 | ID | 短标签 | aria-label | 逐字反馈 | 目的地 | mark |
|---|---|---|---|---|---|---|
| 左侧空白信封 | `return-cabinet-action-envelope` | 拆空封 | 抽出左侧低格里完全空白的封口信 | `信封没有地址，也没有封口；展开以后正好是一张回执。` | `#blank-receipt-press` | `unfoldedAddresslessEnvelope` |
| 中央分格轮 | `return-cabinet-action-wheel` | 转分格 | 推动中央地面的黄铜分格轮 | `分格轮只转半格，所有空地址同时缠上一根红线。` | `#red-thread-registry` | `indexedMissingAddresses` |
| 右侧长抽屉 | `return-cabinet-action-drawer` | 探长屉 | 拉开右侧没有尽头的退址抽屉 | `抽屉没有尽头。最深处那枚地址牌已经被留置多年。` | `#retention-vault` | `openedEndlessAddressDrawer` |

### 4.3 空白回执压印台 / THE BLANK RECEIPT PRESS

素材：`assets/blank-receipt-press.webp`

| 热点 | ID | 短标签 | aria-label | 逐字反馈 | 目的地 | mark |
|---|---|---|---|---|---|---|
| 中央空白纸 | `return-press-action-sheet` | 压空执 | 把压印台中央的空白回执推入滚轴 | `空白纸被压出重量，没有文字。估值室因此把它列为无人认领。` | `#unclaimed-valuation` | `weighedBlankReceipt` |
| 左侧旧墨垫 | `return-press-action-ink` | 蘸旧墨 | 按下左侧只剩暗红余光的墨垫 | `墨垫里只剩 03:16 尚未干透；分前档案井认出这枚时间。` | `#minute-before-archive` | `inkedMinuteBeforeReturn` |
| 右侧黄铜压杆 | `return-press-action-lever` | 落压杆 | 扳下右侧黄铜压印长杆 | `压杆落下，回执没有留下印痕，只被卷进无主气送井。` | `#unclaimed-pneumatic-intake` | `pressedReceiptBackToIntake` |

三场景形成 `气送井 → 退址柜 → 压印台 → 气送井` 的可走闭环，同时分流到午夜回拨台、回铃陈放室、红线登记所、留置库、无人认领估值室和前一分钟档案井。

## 5. 独立状态合同

只使用：

`goddead_v47_returned_rooms`

规范形状：

```js
{
  visited: { intake: false, cabinet: false, press: false },
  entry: "direct",
  pending: null,
  lastScene: "",
  lastAction: "",
  reroutes: 0,
  marks: []
}
```

- `visited` 仅三个严格布尔键。
- `entry` 白名单：`dead-tubes / dead-cabinet / dead-receipt / intake / cabinet / press / direct`。
- `pending` 必须严格是 `{scene, action, target, feedback}` 四字段，且逐字段等于动作表；任何缺失、错配、伪造 target / feedback 都归一为 `null`。
- `lastScene` 仅 `intake / cabinet / press`；`lastAction` 必须属于对应 scene。
- `reroutes` 非负整数并裁到 9999。
- `marks` 仅九项白名单、去重、最多九项。
- 坏 JSON、数组、错型对象安全回 neutral。
- v47 处理器不直接读写 v28–v46、`goddead_deadletter` 或其他主线键。进入既有目标场景后，目标场景自己的既有落地语义不属于 v47 入口写入。

## 6. pending / reload / 离场

- 入口在点击时立即写 visited 与 reroutes，排定前写全合法状态。
- 新场景在进入时写 visited。
- 动作先写 lastScene / lastAction / mark / reroutes / pending，再反馈并排定。
- timer 真正触发前才清 pending。
- reload 在反馈拍内：逐字重播反馈、恢复同一目标，不得重复 reroutes 或 marks。
- 离开反馈拍：取消 timer，pending 保留；回到同一 v47 场景才重播并续走，其他场景不 ghost jump。
- reduced-motion 仍须保留可读反馈拍，只缩短 delay。
- 直接 hash 进入只记 visited，不自动执行动作。

## 7. 目录、痕迹与遗忘

- 首次到访后原子恢复：
  - `02ο / 气送井` → `#unclaimed-pneumatic-intake`
  - `02π / 退址柜` → `#returned-address-cabinet`
  - `02ρ / 压印台` → `#blank-receipt-press`
- 未到访时严格 `hidden`、不可聚焦。
- Remembrance 只加一行：

`退件未止：改址 N 次；气送井 / 退址柜 / 压印台已见 X/3。`

- 保持统计卡严格 8 张。
- “遗忘一切”清除 v47 key、隐藏三目录入口与记忆行；不新增单独清除按钮。

## 8. 素材与视觉约束

- 保持既有 `assets/dead-letter-office.webp` 哈希、尺寸与文件字节不变。
- 源 PNG：
  - `design-references/source-unclaimed-pneumatic-intake.png`
  - `design-references/source-returned-address-cabinet.png`
  - `design-references/source-blank-receipt-press.png`
- 生产 WebP：
  - `assets/unclaimed-pneumatic-intake.webp`
  - `assets/returned-address-cabinet.webp`
  - `assets/blank-receipt-press.webp`
- 三张 WebP 必须保持 1536×1024；目标单张 `<450 KB`，可更小但不得明显糊掉纸张、黄铜边缘或暗红信号。
- 禁止新图中出现可读文字、数字、标志、人物、手、UI、水印。

## 9. QA 完成门槛

Kimi 必须写并实际运行独立 smoke / visual 临时脚本，至少覆盖：

1. 三投递所入口逐字反馈、visited/entry/reroutes、自动到达；
2. 三入口对 `goddead_deadletter` 字节级零写；
3. 三封退件原文与归档语义、回执唯一签收、原 `#cancellation` 路径与 toast 不变；
4. 主线回执已排定 → v47 三入口零副作用；
5. v47 入口先接受 → 三枚退件按钮与回执按钮零迟到写入、目的地不被覆盖；
6. 三场景、九动作、九目标、闭环、键盘 Enter/Space；
7. live-scene / hidden DOM / off-route 双向零副作用；
8. 同拍竞争只接受第一项，三个场景热点即时 disabled；
9. pending 合法/伪造、reload、离场、reduced-motion；
10. 坏 JSON、错型、9999 裁剪、lastScene/lastAction 修复；
11. v28–v46 与主线种子快照隔离；
12. 目录 02ο/02π/02ρ、痕迹单行、严格 8 卡、遗忘；
13. visual 至少含：投递所 clean、三入口反馈、三场景桌面/移动/短桌面、三动作反馈、目录、痕迹；
14. `node --check script.js`、`node tests/site.test.mjs`、`git diff --check`；
15. 回归 v46 smoke+visual、v45 smoke+visual、v44 smoke+visual、旧 deadletter/cancellation/receipt 近邻。

连续两次 v47 Smoke 与连续两次 v47 Visual 全绿后才可进入最终报告；逐张目验不能只报截图数量，必须把源图与同状态网页截图放进同一对照图后再判断。
