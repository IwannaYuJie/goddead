# Goddead v45 设计：未到交班 / THE RELIEF SHIFT THAT NEVER ARRIVED

## 目标

v45 继续拆开前段固定流程，落点是第三值夜室。

- 让值夜室里已经非常醒目的三件实物——03:17 钟轴、熄灭台灯、空椅——成为三个真实支线入口。
- 保留交班簿、05:02 记录、签退、第四线路解锁和自动进入交换台的全部现有语义。
- 三个新空间彼此连通，并接回 v36、v38、v40、v43、v44 的前段网络。
- 点击物件后立即显示逐字反馈并自动转场；没有确认、下一步、继续、结算按钮。
- 不加新结局，不改变走廊三页门槛、第四线路、后续主线或 v28–v44 状态语义。

## 为什么从值夜室进入

值夜室现在有一块停在 03:17 的钟、一盏熄灭的台灯、一把没有人的椅子，但三者都只负责气氛。真正能推进的仍是“翻开 05:02 → 尝试签退 → 自动去交换台”这一条固定组合。

v45 把三个原本只可看的叙事物件变成入口：

1. 玩家仍直接点击画面里的东西，不增加底部选择栏。
2. 三入口在第四线路解锁前就能发现，第一次进入值夜室不再只有一种解法。
3. 入口不会替玩家完成 05:02 覆盖或签退，也不会污染 `goddead_watch` / `goddead_line4`。
4. 回到值夜室后，既有第四线路仍可继续；支线是绕路，不是跳关。

## 值夜室三入口

### 保留不变

- `assets/watch-clock-face.webp`、`assets/watch-second-hand.png`、`assets/watch-room-desk.webp` 不替换、不重编码。
- 秒针 03:17 / 偶发倒退、椅影缓慢转向、远处电话铃、日光灯低鸣全部保留。
- 五条交班记录原文、揭字、pointerenter 被动展示、click / Enter / Space 主动语义全部保留。
- 只有主动覆盖 05:02 才写 `phoneCovered`。
- 签退仍只写现有 `goddead_watch`，且仍然失败。
- 05:02 + 至少一次签退仍是第四线路唯一解锁条件。
- `tryScheduleWatch()`、`watchConsumed`、`#switchboard` 目的地与反馈逐字不变。

### 新增三个原生画面热点

| 入口 ID | 所在图 | aria / 短标签 | 逐字入口反馈 | 自动目的地 |
|---|---|---|---|---|
| `relief-entry-clock` | `#watch-clock` 的中央钟轴 | `拧动永远停在三点十七分的钟轴` / `拧钟轴` | `钟轴向前让出一格，露出被压在十七分下面的档案井。` | `#minute-before-archive` |
| `relief-entry-lamp` | `#watch-desk` 的熄灭台灯 | `按下空值班桌上熄灭的台灯` / `按灭灯` | `灯没有亮。桌面下方却亮出一条只给冷灯芯使用的检修槽。` | `#cold-wick-service-bay` |
| `relief-entry-chair` | `#watch-desk` 的空椅 | `坐进没有值夜员的空椅` / `入空椅` | `椅子向后退了一班。墙里的缺班更衣柜替它打开。` | `#absent-relief-locker` |

实现约束：

- 三个热点使用原生 `<button>`，覆盖图中真实钟轴、灯帽与椅面，不改变原图。
- `#watch-desk` 从纯 `role=img` 容器升级为定位容器时，原 aria 叙事必须保留；热点进入可访问树，装饰层仍不可聚焦。
- 三热点与现有 `watch` AutoAdvance 共用第一归宿锁：
  - 入口在任何副作用前校验 `currentScene === "watch"`。
  - 若现有第四线路转场已经排定（`AutoAdvance.has("watch")`），入口不写 v45、不反馈、不抢目的地。
  - v45 入口先被接受时，先设置 `watchReliefArmed`，再 `AutoAdvance.clear("watch")`、持久化 v45、排定对应支线。
  - 同一反馈拍再点其余入口、05:02 或签退，既有动作可以保留自身原状态语义，但不得改写已经接受的 v45 目的地。
  - 回到 `watch` 时由 scene init 复位 `watchReliefArmed`；若第四线路条件已满足，既有主线仍可重新武装。
- 三入口本身不写 `goddead_watch`、`goddead_line4`，不替玩家覆盖 05:02，不替玩家签退。

## 三个新空间

所有新空间使用真实生成位图作为主体。画面热点覆盖图中实际存在的器物，不做卡片清单，不做底部三按钮，不做 SVG / CSS 假物件。

### 1. 前一分钟档案井 / THE MINUTE-BEFORE ARCHIVE

- 场景：`#minute-before-archive`
- 图：`assets/minute-before-archive.webp`
- 说明：
  - `03:17 没有停住。它把抵达之前的一分钟，一层层压进钟背后的档案井。`
- 画面：
  - 黑石档案井嵌在巨大无数字钟盘背后，黄铜齿圈像回廊一样向下。
  - 左侧是一根停在前一格的粗大分针。
  - 近景石台放着空白交班卡与无字圆形时印。
  - 中央钟轴后方裂开一条可下行的齿槽。
- 三个画面热点：

| ID | aria / 短标签 | 逐字反馈 | 目的地 |
|---|---|---|---|
| `relief-minute-action-hand` | `把慢一拍的分针拨回前一格` / `拨分针` | `分针退了一格。滞影回廊里，所有影子同时迟到。` | `#lagging-shadow-cloister` |
| `relief-minute-action-card` | `给空白交班卡盖上圆形时印` / `盖时印` | `印章落下时，日期往后跳了一夜。夜班登记所从档案井上方开窗。` | `#night-shift-registry` |
| `relief-minute-action-shaft` | `沿钟轴背后的齿槽向下` / `下齿槽` | `齿槽没有通向钟背，而是把你送进灭灯的供电层。` | `#cold-wick-service-bay` |

`#lagging-shadow-cloister` 允许干净到访；本轮只导航，不写 v44 状态。
`#night-shift-registry` 若现有路由有访问守卫，只为 `lastScene=minute && lastAction=card` 添加唯一窄例外；其余干净直达语义不变。

### 2. 冷灯芯检修槽 / THE COLD-WICK SERVICE BAY

- 场景：`#cold-wick-service-bay`
- 图：`assets/cold-wick-service-bay.webp`
- 说明：
  - `值夜室的灯从未断电。这里维修的，只是那些决定继续熄灭的灯芯。`
- 画面：
  - 狭长黑石检修槽，墙内布满旧黄铜供电管。
  - 左侧检修台固定一盏没有火焰、却结着冷霜的灯芯。
  - 中段垂着一截从供电管里拔出的黑色编织电话线。
  - 右侧是一排黄铜保险片，其中一片带椅形刻痕。
- 三个画面热点：

| ID | aria / 短标签 | 逐字反馈 | 目的地 |
|---|---|---|---|
| `relief-wick-action-wick` | `拧亮结霜的冷灯芯` / `拧冷芯` | `灯芯亮成一小块更深的黑。无灯灯廊认出了这种光。` | `#unlit-lamp-gallery` |
| `relief-wick-action-cable` | `把黑色电话线从供电管里拔出` / `拔电话线` | `线头没有电，只有三下从门内回来的震动。` | `#counter-knock-gallery` |
| `relief-wick-action-fuse` | `推回带椅形刻痕的黄铜保险片` / `推保险片` | `保险片合上，缺班者的更衣柜在墙后通了电。` | `#absent-relief-locker` |

### 3. 缺班更衣柜 / THE ABSENT RELIEF LOCKER

- 场景：`#absent-relief-locker`
- 图：`assets/absent-relief-locker.webp`
- 说明：
  - `每一班都有人来接。没人出现时，衣服、椅子和签名会依次替他完成交班。`
- 画面：
  - 黑石更衣室只有一组敞开的旧金属柜。
  - 左侧柜内挂着没有姓名牌、没有主人的深色值夜外套。
  - 中央放着一把折起的旧木椅，椅面朝向空柜。
  - 近景石台摊着没有姓名、没有下一班的空白交接簿。
- 三个画面热点：

| ID | aria / 短标签 | 逐字反馈 | 目的地 |
|---|---|---|---|
| `relief-locker-action-coat` | `穿上没有姓名牌的值夜外套` / `穿空外套` | `外套替你填了名字。门外代审窗只看见一个正在替班的人。` | `#proxy-admission` |
| `relief-locker-action-chair` | `坐进柜前折起的空椅` / `坐空椅` | `椅子先承认了你的影子，借影陈列廊随后承认了你。` | `#borrowed-shadow-gallery` |
| `relief-locker-action-roster` | `在没有下一班的交接簿上签名` / `签缺班簿` | `最后一栏出现了你的笔迹。第三值夜室终于等到下一班——仍然是你。` | `#watch` |

`#watch` 仍受原三残页门槛守卫；本轮从值夜室进入后自然已满足，不新增跳关例外。

## 路网

```text
watch.clock ─→ minute-before-archive
                 ├─ hand  ─→ lagging-shadow-cloister
                 ├─ card  ─→ night-shift-registry
                 └─ shaft ─→ cold-wick-service-bay

watch.lamp ──→ cold-wick-service-bay
                 ├─ wick  ─→ unlit-lamp-gallery
                 ├─ cable ─→ counter-knock-gallery
                 └─ fuse  ─→ absent-relief-locker

watch.chair ─→ absent-relief-locker
                 ├─ coat   ─→ proxy-admission
                 ├─ chair  ─→ borrowed-shadow-gallery
                 └─ roster ─→ watch
```

这三个空间形成一条可循环的“未到交班”路径，并给出六个不同的前段回流口。任何动作都不是新结局。

## 状态

独立 key：

```text
goddead_v45_absent_relief
```

归一结构：

```js
{
  visited: { minute: false, wick: false, locker: false },
  entry: "direct",
  pending: null,
  lastScene: "",
  lastAction: "",
  traversals: 0,
  marks: []
}
```

### 白名单

- `visited`：只接受 `minute / wick / locker` 三个布尔键。
- `entry`：
  - `watch-clock`
  - `watch-lamp`
  - `watch-chair`
  - `minute`
  - `wick`
  - `locker`
  - `direct`
- `lastScene`：`minute / wick / locker`
- `lastAction`：
  - minute：`hand / card / shaft`
  - wick：`wick / cable / fuse`
  - locker：`coat / chair / roster`
- `marks`：
  - `rewoundMinuteHand`
  - `stampedBlankShiftCard`
  - `descendedClockGearSlot`
  - `turnedColdWick`
  - `pulledTelephoneCable`
  - `resetChairFuse`
  - `woreNamelessWatchCoat`
  - `satInReliefChair`
  - `signedAbsentReliefRoster`
- `traversals`：有限非负整数，向下取整，最大 `9999`。

### pending

只接受完整四字段：

```js
{ scene, action, target, feedback }
```

四字段必须与动作表逐项完全对应。缺字段、伪造 target、伪造 feedback、scene/action 错配全部归一为 `null`。

### 隔离边界

- v45 场景模块不读写 v28–v44、`goddead_watch`、`goddead_line4` 或治理主线状态。
- 三个值夜室入口只写 v45；不替玩家完成 05:02 覆盖、签退或第四线路解锁。
- 新场景内九动作不得修改旧 key。
- 导航到旧场景后，只允许目标场景自己的既有 enter 逻辑运行。

## 交互契约

- 全部按钮使用原生 `<button>`，Click / Enter / Space。
- 值夜室入口与九个场景热点在任何状态读取、反馈、音效、timer 之前，先校验 live scene。
- 每个新场景使用独立 `AutoAdvance` scope：
  - `relief-minute`
  - `relief-wick`
  - `relief-locker`
- 第一项接受后，同场景三个热点立即 disabled；同拍竞争只记一次。
- 反馈写入各场景自己的 `aria-live` 文本。
- pending 在真正转场前清除；reload 或离场取消后，重返原场景逐字重播反馈并重新武装转场，不重复增加 `traversals` 或 marks。
- reduced-motion 只缩短反馈拍，文案与目的地不变。
- 新场景允许干净 direct hash；进入即记到访，但不自动做选择。
- 通用低权重出口只允许回 `#watch`，不算动作、不写 marks、不增加 traversals。

## 目录与痕迹

首次访问后恢复：

- `02ι / 分前` → `#minute-before-archive`
- `02κ / 冷芯` → `#cold-wick-service-bay`
- `02λ / 缺班` → `#absent-relief-locker`

未访问时三个链接必须 `hidden`、不可聚焦、不在无障碍树。

Remembrance 只增加一行：

```text
未到交班：改道 N 次；分前 / 冷芯 / 缺班已见 X/3。
```

统计卡仍严格 8 张。

“遗忘”必须清除 v45 key、隐藏三个目录入口、隐藏记忆行；不改变既有遗忘语义。

## 素材规范

源 PNG：

- `design-references/source-minute-before-archive.png`
- `design-references/source-cold-wick-service-bay.png`
- `design-references/source-absent-relief-locker.png`

生产 WebP：

- `assets/minute-before-archive.webp`
- `assets/cold-wick-service-bay.webp`
- `assets/absent-relief-locker.webp`

统一要求：

- 1536×1024，3:2 横图。
- 写实黑石建筑、旧黄铜、稀薄暗红点光，延续当前 Goddead 视觉。
- 无现代电子设备、无人物、无脸、无可读文字、无 logo、无水印、无 UI。
- 桌面与手机使用同一张图；主要物件集中在中部安全区，左右边缘允许裁切。
- 三个互动目标彼此分离，能覆盖至少 44×44px 的真实画面区域。
- 画面本身负责叙事，HTML 不新增卡片式图文选择。

## Kimi 实现边界

Kimi 负责：

- PNG → WebP。
- `index.html`：值夜室三入口、三场景、九热点、目录与痕迹行。
- `styles.css`：入口与场景布局、真实器物热点、桌面 / 短桌面 / 390×844。
- `script.js`：值夜室第一归宿锁、v45 独立状态、pending、目录、痕迹、遗忘。
- `tests/site.test.mjs` 静态契约。
- v45 Smoke / visual、证据截图、README / `design-qa.md` / `docs/ProgressLog.md`。

Kimi 不做：

- 不替换或重编码三个值夜室既有素材。
- 不改交班簿原文、05:02 主动语义、签退、第四线路解锁与目的地。
- 不加确认 / 下一步 / 继续按钮。
- 不用 SVG、CSS 假画、卡片清单代替图像热点。
- 不改 v28–v44 语义。
- 不执行 `git add / commit / push / stash`。
- 不触碰 `docs/KimiUsageLog.md`。
- 不改变既有 staged 边界。

## QA 契约

### 静态

- 三张值夜室旧素材的哈希 / 尺寸保持不变。
- 三张源 PNG 与三张 WebP 存在、尺寸正确、HTML 引用正确。
- 值夜室三入口、三新场景、说明、九按钮、aria、短标签、出口、目录、痕迹齐全。
- `.relief-entry-hotspot` 与 `.relief-hotspot` 为独立 class；三场景无卡片列表、无 SVG。
- `SCENES` 清单加入三场景。
- 交班簿五条原文、05:02、签退、line4 代码契约保持。
- v45 状态、pending、白名单、live-scene 守卫、watch 第一归宿锁、遗忘与文档有静态断言。

### Smoke 至少覆盖

1. clean v45 + 已满足三残页的值夜室，钟轴 / 台灯 / 空椅三入口各自逐字反馈、visited、真实目的地。
2. 三入口不改变 `goddead_watch`、`goddead_line4` 或 v28–v44 key。
3. 05:02 + 签退仍唯一解锁 line4；原自动进入 `#switchboard` 的路径与逐字反馈不变。
4. 既有 `watch` 转场先排定时，v45 入口零副作用；v45 入口先接受时，原动作不能改写目的地。
5. 同拍三入口竞争只接受第一项；Click / Enter / Space。
6. 离场取消 v45 入口后，回值夜室可重新选择；`watchReliefArmed` 正确复位。
7. 三新场景图片解码，九热点落在真实图内、非卡片、≥44px。
8. 九动作逐字反馈、九真实目的地、首选锁与同拍竞争。
9. clean direct hash 三新场景可进入且只记到访。
10. 若 `night-shift-registry` 需要守卫，只允许 `minute/card` 窄例外；错配仍拦。
11. off-route / hidden DOM 程序化 click 对状态、反馈、音效、timer 零副作用。
12. pending 合法 / 伪造、reload、离场后重返、reduced-motion。
13. 坏 JSON、数组错型、非法 visited/entry/marks、超大 traversals。
14. v28–v44、watch、line4 与主线隔离。
15. 目录三个入口、Remembrance 单行、8 卡、遗忘清除。
16. 全程 console error / exception 为 0。

### Visual

至少覆盖：

- 值夜室 clean 与钟轴 / 台灯 / 空椅三入口反馈态。
- 值夜室三入口在桌面 1440×1024、移动 390×844、短桌面 1440×800 可见可点，且不遮交班簿 / 签退。
- 三场景桌面 1440×1024。
- 三场景移动 390×844。
- 三场景短桌面 1440×800。
- 每场景至少一个动作反馈态。
- 目录 02ι/02κ/02λ。
- Remembrance 单行 + 8 卡。
- 无横向溢出；首屏可见图与三热点；热点 ≥44px；反馈不压图、不被裁切。

### 回归

- v44 Smoke + visual。
- v43 Smoke + visual。
- v42 Smoke。
- v41 Smoke。
- v40 Smoke + visual。
- 值夜室 / line4 既有近邻回归。
- `node --check script.js`
- `node tests/site.test.mjs`
- `git diff --check`
