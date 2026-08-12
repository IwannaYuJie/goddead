# v63 终局退件所 / THE ENDING RETURNS UNOPENED

## 目标

v63 不再向地下继续堆楼层，而是把 v28 已经存在的四个治理结局本身变成可互动的“退件”。

- v28 的四结局判定、三次裁决、资源数值、HUD、崩解失败、图鉴与 `goddead_v28_governance` 内容保持不变；v63 只读当前合法 `resultStatus`，并在反向阶梯路由时只读 v62 的派生守卫。
- 任一正常治理结局（ascension / madness / oblivion / nightwatch）出现时，结局卡新增一个明确但不抢主操作的入口“把这个结局退回去”。接受后自动进入新场景 `ending-return-office`。
- 退件所把当前结局装进一枚黑色文书筒。玩家在图内直接选择“签收终局 / 退回终局 / 误投终局”，形成四结局 × 三处置 = 12 个后终局。每个后终局有独立名称、叙事与图鉴记录。
- 四种基础结局都至少产生过一个后终局后，退件所后墙四盏登记灯亮齐，隐藏门成为第四个图内热点。它不覆盖三种正常处置，也不要求收集全部 12 项。
- 隐藏门通往 `unending-gallery`，在那里登记第 13 个后终局“无终局 · UNENDING”。场景提供三条图内回路：回到门槛、夹回痕迹、沿倒阶回到反听总台（未满足 v62 旧守卫时回退交换台）。没有真正的停止页。

## 设计原则

- 重点是诡怪氛围与选择后果，不强迫玩家解数学题。
- 点击即执行 → 一拍逐字反馈 → 自动转场；没有确认页、底部继续卡或滚动后必点按钮。
- 两张新图都把可点实体做大、分开，热点使用原生 `<button>`，支持 click / Enter / Space、清晰 focus、reduced-motion 与防连点第一归宿锁。
- v63 独立存档；旧结局、旧图鉴与 v62 反听循环只读，不跨版本写入。

## 素材

源 PNG 与运行 WebP 均为 1536×1024，无裁切：

| 场景 | 文件 | 字节 | sha256 |
| --- | --- | ---: | --- |
| 终局退件所源图 | `design-references/source-v63-ending-return-office.png` | 2271134 | `512a062e4c8736c7e2b55e390c44df03833c5e832adb8c72883274fd7e14beb7` |
| 终局退件所运行图 | `assets/v63-ending-return-office.webp` | 157300 | `7f9382eaf7f0fce572225abe6aee0714d8d68e586e273df36cc2940282850449` |
| 无终局陈列廊源图 | `design-references/source-v63-unending-gallery.png` | 2202741 | `d732053af7908c87901916ab32ac50177010d3cbde7bf7e69b776e1a3fd36002` |
| 无终局陈列廊运行图 | `assets/v63-unending-gallery.webp` | 152424 | `a3b79d820dacaf2d990057fd82e29725575e773874515bc62c15d4af377b180c` |

### 生图提示摘要

- `source-v63-ending-return-office.png`：黑石哥特档案厅，前景黑大理石柜台；左侧黄铜压印机、中央退件井与黑色文书筒、右侧三辐误投轮，后墙一扇四灯封门。无人物、无文字、无 UI。
- `source-v63-unending-gallery.png`：循环拱廊；左侧打开的黑门、中央四灯档案柜、右侧先升后降的倒阶。无人物、无文字、无 UI。

最终实现需在测试中冻结上述 sha256，并限制 WebP 为 100–350KB。

## 入口与守卫

### Remembrance 入口

- 新按钮 id：`ending-return-entry-btn`，文本：`把这个结局退回去 ⟶`。
- 只在 `currentScene === "remembrance"` 且 v28 当前 `resultStatus` 属于四个合法正常结局时显示并启用。
- 点击接受时把“当前结局快照”写入 v63 `pending`，逐字反馈：
  `结局卡背面渗出一行退件码。痕迹墙把它卷进一枚黑色文书筒。`
- 一拍后进入 `ending-return-office`。v28 不清空、不改写；v63 pending 是唯一入场凭证。

### `ending-return-office` 窄守卫

放行条件只有三类：

1. 合法 entry pending 的 `pendingTarget === "ending-return-office"`；
2. v63 当前 `activeEnding` 是四个合法结局之一，且与当前 v28 合法 `resultStatus` 同源；
3. 历史真实到访 `visited.office === true` 且 v28 当前仍有合法正常结局。

否则回 `remembrance`。直接 hash 不能伪造结局快照。

### `unending-gallery` 窄守卫

放行条件只有：合法 secret pending、历史真实到访，或第 13 项已经解锁。否则回 `ending-return-office`；若退件所也不合法，则继续回 `remembrance`。

## 终局退件所 `ending-return-office`

- 标题：`终局退件所`
- 英标：`THE ENDING RETURNS UNOPENED`
- 氛围句：`你以为结局是最后一页。这里把最后一页当作地址不详。`
- 图：`assets/v63-ending-return-office.webp`
- 进入时显示当前文书筒短签：`待退：{基础结局中文名}`；只从可信 `activeEnding` 派生，不落盘重复文案。

### 三个正常处置热点

| 动作 | 按钮 id | 图中实体 | 短签 | 接受反馈 |
| --- | --- | --- | --- | --- |
| accept | `ending-return-accept` | 左侧压印机 | 签收终局 | 压印机承认这是一份结局。红蜡却盖在“收件人”本该存在的位置。 |
| return | `ending-return-return` | 中央退件井 | 退回终局 | 文书筒落下很久，又从同一个井口升起。封蜡上的手印换成了你的。 |
| misroute | `ending-return-misroute` | 右侧误投轮 | 误投终局 | 三辐轮只转了两格。你的结局被投进一条没有第三格的线路。 |

第一拍锁死本场景全部四热点；一拍后到达 `remembrance` 的 before 中原子完成：

- 追加一个可信 coda id；
- `processedRuns + 1`；
- 对应 actionCounts +1；
- `lastCoda` 更新；
- 清 activeEnding / pending；
- v28 保持原样，仍展示原基础结局卡和新后终局卡。

### 12 个后终局（逐字冻结）

| 基础结局 | 签收终局 | 退回终局 | 误投终局 |
| --- | --- | --- | --- |
| ascension | **借位登神 · BORROWED ASCENSION**：观所签收了你的登神，却把神位留在退件柜里。此后每次祷告都先向那只空柜鞠躬。 | **降回第一阶 · RETURNED ASCENSION**：长阶把你送回第一阶。阶顶仍站着一个已经登神的你，假装没有看见。 | **错误神址 · MISADDRESSED GOD**：你的神性被投给一扇从未敲过的门。门后那位陌生人从此替你显灵。 |
| madness | **合声签收 · RECEIVED CHORUS**：万魂被登记成一个收件人。它们终于安静，只剩你的声音继续用复数说话。 | **退回耳内 · RETURNED CHORUS**：所有声音都被退回你的耳内。你听见寂静正在排队，等下一次开口。 | **错投静默 · MISROUTED SILENCE**：疯狂被误投给沉默。沉默学会尖叫，而你得到一张证明自己很安静的回执。 |
| oblivion | **遗忘入库 · RECEIVED OBLIVION**：观所正式接收了遗忘。档案从此完好无缺，只是每一页都忘了该被谁翻开。 | **退回昨日 · RETURNED OBLIVION**：归寂被退回昨天。今天因此多出一具仍在继续生活的空白。 | **错投记忆 · MISADDRESSED MEMORY**：你的遗忘寄到了别人的童年。那个人开始梦见这座从未到过的观所。 |
| nightwatch | **值夜签收 · RECEIVED WATCH**：永恒值夜被批准为正式班次。交班人写着你的名字，接班人也写着你的名字。 | **退回凌晨 · RETURNED WATCH**：这一夜被退回 05:02。秒针重新走动，却只经过你已经站过的位置。 | **错投黎明 · MISROUTED DAWN**：黎明被误投到另一条走廊。这里继续值夜，那条走廊则每天醒来两次。 |

coda id 固定为 `${baseEnding}:${action}`，例如 `ascension:accept`。图鉴按基础结局四行、三处置三列显示；未解锁格只显示 `？？？`。

### 秘密入口

四类基础结局各至少有一个合法 coda 后 `secretEligible === true`（派生，不落盘）：

- 四盏后墙登记灯亮起；按钮 `ending-return-secret` 从 hidden+disabled 变为可用。
- 短签：`打开未终门`
- 接受反馈：`四盏登记灯同时承认彼此已经熄灭。后墙裂开一条比结局更窄的门缝。`
- 一拍后进入 `unending-gallery`；首次到达的 before 中原子记录真实 visit、解锁第 13 项、`secretRuns + 1` 并清 pending，重复到访不重复计数。

## 无终局陈列廊 `unending-gallery`

- 标题：`无终局陈列廊`
- 英标：`THE END WAS FILED ELSEWHERE`
- 氛围句：`这里陈列的不是结局，而是每个结局之后仍然没有停止的那一步。`
- 图：`assets/v63-unending-gallery.webp`
- 首次真实到达时原子解锁 `unending`，并令 `secretRuns + 1`；重复到访不重复加同一轮。
- 第 13 后终局：**无终局 · UNENDING**：`四份结局互相证明对方已经结束。观所据此宣布：你可以继续。`

### 三个回路热点

| 按钮 id | 图中实体 | 短签 | 目标 | 反馈 |
| --- | --- | --- | --- | --- |
| `unending-beginning-door` | 左侧打开的黑门 | 回第一敲 | threshold | 门把手记得你的掌纹，门却坚持这是你第一次来。 |
| `unending-file-trace` | 中央四灯档案柜 | 夹回痕迹 | remembrance | 空框夹住“无终局”。痕迹墙因此多出一块永远写不满的空白。 |
| `unending-reverse-stair` | 右侧倒阶 | 沿倒阶听回去 | listening-back-console；旧 v62 守卫不满足则 switchboard | 台阶先向上，再把同一步送回更早的线路。远处有一台总机替你接听。 |

三个回路都使用图内原生按钮、第一归宿锁和短反馈自动转场。离开后场景仍可从目录重进。

## v63 状态契约

独立 key：`goddead_v63_ending_return`，`version: 63`。

```json
{
  "version": 63,
  "visited": { "office": false, "gallery": false },
  "activeEnding": "",
  "codas": [],
  "processedRuns": 0,
  "secretRuns": 0,
  "actionCounts": { "accept": 0, "return": 0, "misroute": 0 },
  "lastCoda": "",
  "unendingUnlocked": false,
  "pending": null
}
```

- 只持久化上述十个 canonical 字段；`pendingTarget`、`secretEligible`、每类基础结局是否触达、显示名称与叙事全部派生。
- 坏 JSON、数组、错型、version≠63 → 默认。
- `activeEnding` 只接受四个基础结局或空串；codas 只接受 12 个白名单 id，去重并按固定表排序；计数有限、非负、向下取整、封顶 9999。
- `lastCoda` 只接受 12 个 coda 或 `unending`；`unendingUnlocked` 只有在落盘值为 true 且四类 coda 证据仍齐全时保留。
- pending 只允许 entry / process / secret / exit 四类严格精确键集；target、feedback、baseEnding、action 与 coda 必须从当前可信状态逐字重算，额外键即伪造。
- pending 节拍重播只恢复反馈和一次转场，计数与 coda 只在目标到达 before 中原子写入，刷新、离场、重进都不能双计。

## 目录 / 痕迹 / 遗忘

- 首次真实到访退件所后恢复目录 `03α / 终局退件`。
- 首次真实到访陈列廊后恢复目录 `03β / 无终局廊`。
- Remembrance 新增一行：`终局退件：已处理 X 份；签收 A / 退回 R / 误投 M；后终局已发现 N/13。`
- 原 v28 四结局图鉴不改；下面新增独立 4×3 后终局图鉴与第 13 项，只有至少一项解锁时出现。
- forget-all 移除 v63 key，并让入口、目录、记忆、后终局图鉴、四盏灯、秘密门、两场景 aria 与 pressed/disabled/hidden 状态全部回弹出厂态。

## 热点坐标建议

以 1536×1024 舞台百分比 `top / left / width / height`：

- 退件所：签收 45 / 4 / 27 / 43；退回 48 / 36 / 28 / 37；误投 46 / 70 / 27 / 40；秘密门 7 / 39 / 23 / 40。
- 无终局廊：黑门 30 / 4 / 25 / 54；档案柜 17 / 36 / 28 / 56；倒阶 43 / 68 / 29 / 43。
- 44px 触控增长后仍不得互相重叠；移动端不另画坐标。

## QA 契约

1. 2 张源 PNG 与 2 张 WebP 哈希冻结；1536×1024；WebP 100–350KB；缓存版本递增。
2. v28 四结局判定、资源、裁决、HUD、结局图鉴、崩解与 key 内容不改；v63 只读公开结果。
3. 12 coda 白名单和逐字叙事完整；4×3 恰 12，另有且仅有一个 `unending`。
4. v63 canonical 十字段、严格 pending、坏档归一、派生不落盘、到达原子、重播不双计。
5. 入口/三处置/秘密门/三回路共八组监听均只接受可信 click；第一拍全锁；键盘与 reduced-motion 正常。
6. 两新场景均在 `SCENES`、hash 路由、sceneInit、目录、Remembrance、forget-all 中完整接线；87→89 场景。
7. 无底部 continue / confirm 控件；全部关键操作位于图片内；旧守卫不放宽。
8. `node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全绿；静态契约覆盖正常处置、四类解锁、秘密入口、三回路、刷新重播、坏存档、合成点击、移动端与 reduced-motion。Codex 内置浏览器已完成桌面入口、守卫、资源加载与控制台冒烟；受 `isTrusted` 保护的正向转场、reload 与窄屏实机仍待真人输入验收。
