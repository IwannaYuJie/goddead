# Goddead v44 设计：页后空层 / THE SPACES BEHIND THE PAGES

## 目标

v44 继续深化游戏最前段，但不再给首页和守则板叠新常驻入口。

- 利用走廊里已经存在、玩家本来就会点击的残页，把三个目前只累计数量的选择改成真实支线入口。
- 只改 `f1`、`f5`、`f8` 第一次主动阅读后的目的地；残页原文、计数、已读样式、存档和主线三页门槛全部保留。
- 三个新空间彼此连通，也接回 v31、v40、v43 和原走廊网络。
- 点击物件后立即出现逐字反馈，并自动转场；没有确认、下一步、继续、结算按钮。
- 不加新结局，不改变值夜室、第四线路、治理线或 v29–v43 既有状态语义。

## 为什么从残页进入

走廊已有八张残页，但当前只有 `f2 / f3 / f4` 会打开真实区域；`f1 / f5 / f8` 仍只是同一种“读过并累计”的反馈。

v44 把三张文字本身写着“影子”“灰门”“被留下”的残页变成入口：

1. 玩家点的仍是原物件，不增加底部按钮列。
2. 分支发生在主线前三张残页阶段，能直接打散「读三页 → 值夜室」的固定节奏。
3. 原 v29 的回声 / 血管 / 忏悔支线完全不动，走廊从三岔扩成六岔。
4. 已读残页再次点击只保留现有回读语义，不重复强拉支线；回访走目录。

## 走廊入口改线

### 保留不变

- `assets/scripture-corridor.webp` 不替换、不重编码。
- 八张 `.frag` 的 DOM 顺序、原文、触达面积、已读样式不变。
- 第一次点击仍先执行现有逻辑：
  - 添加 `.read`
  - `fragments + 1`
  - 写回现有主线存档
  - `syncWatchDoor()`
  - 更新统计
  - 播放现有声音与 toast
- `f2 → echo`、`f3 → vein`、`f4 → confession` 的 v29 路由逐字、状态与优先级不变。
- `f6 / f7` 仍走现有残页 / 主线路径。
- 读到三页后值夜室主线仍可正常触发。

### 本轮三处新入口

只有“第一次主动点击、此前未读”才进入 v44：

| 原残页 | 原文主题 | v44 入口值 | 自动目的地 |
|---|---|---|---|
| `.frag.f1` | 影子晚一拍 | `fragment-f1` | `#lagging-shadow-cloister` |
| `.frag.f5` | 灰摆成门形 | `fragment-f5` | `#ash-door-foundry` |
| `.frag.f8` | 被留下这个动作 | `fragment-f8` | `#retention-vault` |

入口必须使用和 v29 相同的 `AutoAdvance` scope：`corridor`。

- 第一次点击新入口时先完成原残页计数，再 `AutoAdvance.clear("corridor")`，持久化 v44 到访，最后排定 v44 目的地。
- 如果这一页恰好让 `fragments === 3`，v44 分支优先，不能同时进 `#watch`。
- 同一反馈拍内再点其他残页，第一条已接受的 `corridor` 转场锁定归宿，只允许一次计数与一次调度。
- 已读 `f1 / f5 / f8` 再点时不再进入 v44，继续执行现有“读过的字，会跟着你”与主线恢复语义。
- 离场取消旧 timer 后，回到走廊仍可通过尚未读过的入口重新选择；已经读过的入口不强制重播，回访使用目录。

## 三个新空间

所有新空间都使用真实生成位图作为主体。画面热点必须覆盖图中实际存在的器物或空间轮廓，不做卡片清单，不做底部三按钮，不做 SVG / CSS 画出来的假物件。

### 1. 滞影回廊 / THE LAGGING-SHADOW CLOISTER

- 场景：`#lagging-shadow-cloister`
- 图：`assets/lagging-shadow-cloister.webp`
- 说明：
  - `人的影子比人晚一拍。人已经走完这条回廊，它们还在墙上学习如何跟随。`
- 画面：
  - 黑石回廊，两侧没有人，墙上却留着错位的人形影子。
  - 近景有一枚把影子钉在地面的黄铜钉。
  - 中段有一道人形与门形重叠、却没有主人的空轮廓。
  - 远端一团迟到的影子正从错误方向追上来。
- 三个画面热点：

| ID | aria / 短标签 | 逐字反馈 | 目的地 |
|---|---|---|---|
| `paperback-shadow-action-pin` | `拔出钉住影子的黄铜钉` / `拔钉` | `钉子一松，墙上的影子立刻借走了你的站姿。` | `#borrowed-shadow-gallery` |
| `paperback-shadow-action-outline` | `踏进没有主人的门形轮廓` / `入轮廓` | `轮廓比门更早关上。灰门铸室在纸背后亮起。` | `#ash-door-foundry` |
| `paperback-shadow-action-catch` | `停下，等迟到的影子追上` / `等影` | `影子从身后赶到，却从你的前面走进回返夹道。` | `#return-passage` |

`catch` 是本轮唯一通往 v31 守卫场景的窄例外，只允许 `lastScene=shadow && lastAction=catch` 放行 `#return-passage`。干净直达与错配状态仍落回门外。

### 2. 灰门铸室 / THE ASH-DOOR FOUNDRY

- 场景：`#ash-door-foundry`
- 图：`assets/ash-door-foundry.webp`
- 说明：
  - `灰不是门的材料。这里反复铸造的，是门曾经存在过的形状。`
- 画面：
  - 黑石铸室中央是一张黄铜网台，冷灰自行排成未完成的门框。
  - 左侧是一具没有火的旧风箱。
  - 网台上放着一把由结块炉灰形成的钥匙。
  - 后方未完成的灰门只有门楣和一侧门柱，门内通向无灯黑暗。
- 三个画面热点：

| ID | aria / 短标签 | 逐字反馈 | 目的地 |
|---|---|---|---|
| `paperback-foundry-action-bellows` | `压下没有火的冷风箱` / `冷风箱` | `风箱吐出一口冷灰。灰尘在墙上排成第一条访客守则。` | `#protocol` |
| `paperback-foundry-action-key` | `拿起网台上的灰烬钥匙` / `灰钥匙` | `钥匙没有齿，却准确打开了留置空库里最空的一格。` | `#retention-vault` |
| `paperback-foundry-action-door` | `穿过尚未铸完的灰门` / `灰门` | `你从缺少一侧门框的地方穿过去。无灯灯廊替它补上了黑暗。` | `#unlit-lamp-gallery` |

### 3. 留置空库 / THE RETENTION VAULT

- 场景：`#retention-vault`
- 图：`assets/retention-vault.webp`
- 说明：
  - `这里没有遗物。空展台、悬空标签和灰尘印记，只负责保存“被留下”这个动作。`
- 画面：
  - 黑石库房内排列数座空展台，没有任何可见藏品。
  - 左侧悬着一张没有编号、没有文字的黄铜边标签。
  - 中央展台有清晰的缺失物灰尘轮廓。
  - 右侧空展台上摊着一页与走廊残页同材质的旧纸。
- 三个画面热点：

| ID | aria / 短标签 | 逐字反馈 | 目的地 |
|---|---|---|---|
| `paperback-retention-action-tag` | `把悬空的空标签挂到自己身上` / `挂空签` | `标签贴住你以后，门内先替你敲了一声。` | `#counter-knock-gallery` |
| `paperback-retention-action-imprint` | `触摸展台上缺失遗物的灰尘印` / `摸灰印` | `灰尘记住了手指，却把影子送回另一条回廊。` | `#lagging-shadow-cloister` |
| `paperback-retention-action-page` | `把走廊残页留在空展台上` / `留残页` | `纸留在原地，纸上的字却先一步回到了走廊。` | `#corridor` |

`#counter-knock-gallery` 是 v43 本身允许干净到访的场景；本轮只导航，不写 v43 状态。进入后的 v43 既有到访逻辑自行运行。

## 路网

```text
corridor.f1 ─→ lagging-shadow-cloister
                 ├─ pin ─────→ borrowed-shadow-gallery
                 ├─ outline ─→ ash-door-foundry
                 └─ catch ───→ return-passage

corridor.f5 ─→ ash-door-foundry
                 ├─ bellows ─→ protocol
                 ├─ key ─────→ retention-vault
                 └─ door ────→ unlit-lamp-gallery

corridor.f8 ─→ retention-vault
                 ├─ tag ─────→ counter-knock-gallery
                 ├─ imprint ─→ lagging-shadow-cloister
                 └─ page ────→ corridor
```

这三个空间组成一条可循环的“纸背”路径，同时给出六个不同的早期回流口。任何动作都不是新结局。

## 状态

独立 key：

```text
goddead_v44_paperback_spaces
```

归一结构：

```js
{
  visited: { shadow: false, foundry: false, retention: false },
  entry: "direct",
  pending: null,
  lastScene: "",
  lastAction: "",
  traversals: 0,
  marks: []
}
```

### 白名单

- `visited`：只接受 `shadow / foundry / retention` 三个布尔键。
- `entry`：
  - `fragment-f1`
  - `fragment-f5`
  - `fragment-f8`
  - `shadow`
  - `foundry`
  - `retention`
  - `direct`
- `lastScene`：`shadow / foundry / retention`
- `lastAction`：
  - shadow：`pin / outline / catch`
  - foundry：`bellows / key / door`
  - retention：`tag / imprint / page`
- `marks`：
  - `pulledShadowNail`
  - `enteredOwnerlessOutline`
  - `waitedForLateShadow`
  - `workedColdBellows`
  - `tookCinderKey`
  - `crossedUnfinishedDoor`
  - `woreBlankRetentionTag`
  - `touchedMissingRelicImprint`
  - `leftFragmentOnPlinth`
- `traversals`：有限非负整数，向下取整，最大 `9999`。

### pending

只接受完整四字段：

```js
{ scene, action, target, feedback }
```

四字段必须与动作表逐项完全对应。缺字段、伪造 target、伪造 feedback、scene/action 错配全部归一为 `null`。

### 隔离边界

- v44 场景模块不读写 v28–v43 和治理主线状态。
- 新场景内九动作不得修改旧 key。
- 走廊入口仍由原走廊逻辑写入现有 `goddead_fragment_count` / 主线存档；这是保留原残页计数的唯一允许旧状态变化。
- 测试应把一次 v44 残页入口与原残页点击的旧状态变化对齐：只允许原本就会发生的残页计数 / 主线快照变化，不能额外污染其他旧 key。

## 交互契约

- 全部按钮使用原生 `<button>`，Click / Enter / Space。
- 场景热点在任何状态读取、反馈、音效、timer 之前，先校验 live scene。
- 每个场景使用独立 `AutoAdvance` scope：
  - `paperback-shadow`
  - `paperback-foundry`
  - `paperback-retention`
- 第一项接受后，同场景三个热点立即 disabled；同拍竞争只记一次。
- 反馈写入各场景自己的 `aria-live` 文本。
- pending 在真正转场前清除；reload 或离场取消后，重返原场景逐字重播反馈并重新武装转场，不重复增加 `traversals` 或 marks。
- reduced-motion 只缩短反馈拍，文案与目的地不变。
- 新场景允许干净 direct hash；进入即记到访，但不自动做选择。
- 通用低权重出口只允许回 `#corridor`，不算动作、不写 marks、不增加 traversals。

## 目录与痕迹

首次访问后恢复：

- `02ζ / 滞影` → `#lagging-shadow-cloister`
- `02η / 灰门` → `#ash-door-foundry`
- `02θ / 留置` → `#retention-vault`

未访问时三个链接必须 `hidden`、不可聚焦、不在无障碍树。

Remembrance 只增加一行：

```text
页后空层：改道 N 次；滞影 / 灰门 / 留置已见 X/3。
```

统计卡仍严格 8 张。

“遗忘”必须清除 v44 key、隐藏三个目录入口、隐藏记忆行；不改变既有遗忘语义。

## 素材规范

源 PNG：

- `design-references/source-lagging-shadow-cloister.png`
- `design-references/source-ash-door-foundry.png`
- `design-references/source-retention-vault.png`

生产 WebP：

- `assets/lagging-shadow-cloister.webp`
- `assets/ash-door-foundry.webp`
- `assets/retention-vault.webp`

统一要求：

- 1536×1024，3:2 横图。
- 写实黑石建筑、旧黄铜、稀薄暗红点光，延续当前 Goddead 视觉。
- 无现代物件、无人物、无脸、无可读文字、无 logo、无水印、无 UI。
- 桌面与手机都用同一张图；主要物件集中在中部安全区，左右边缘允许裁切。
- 三个互动目标必须彼此分离，能覆盖至少 44×44px 的真实画面区域。
- 画面本身负责叙事，HTML 不新增卡片式图文选择。

## Kimi 实现边界

Kimi 负责：

- PNG → WebP。
- `index.html` 三场景、九热点、目录与痕迹行。
- `styles.css` 场景布局、真实器物热点、桌面 / 短桌面 / 390×844。
- `script.js` 走廊入口改线、v44 独立状态、pending、目录、痕迹、遗忘、唯一 v31 窄例外。
- `tests/site.test.mjs` 静态契约。
- v44 Smoke / visual、证据截图、README / `design-qa.md` / `docs/ProgressLog.md`。

Kimi 不做：

- 不替换或重编码 `scripture-corridor.webp`。
- 不改 f1/f5/f8 原文、残页计数、v29 三支线或值夜室门槛。
- 不加确认 / 下一步 / 继续按钮。
- 不用 SVG、CSS 假画、卡片清单代替图像热点。
- 不改 v28–v43 语义。
- 不执行 `git add / commit / push / stash`。
- 不触碰 `docs/KimiUsageLog.md`。
- 不改变既有 staged 边界。

## QA 契约

### 静态

- 三张源 PNG 与三张 WebP 存在、尺寸正确、HTML 引用正确。
- 三场景 `data-scene`、说明、九个按钮、aria、短标签、出口、目录、痕迹齐全。
- `.paperback-hotspot` 独立 class；三场景无卡片列表、无 SVG。
- `SCENES` 清单加入三场景。
- f1/f5/f8 原文和既有残页计数代码保持。
- f2/f3/f4 v29 路由逐字保持。
- v44 状态、pending、白名单、live-scene 守卫、v31 窄例外、遗忘与文档有静态断言。

### Smoke 至少覆盖

1. clean corridor 的 f1/f5/f8 第一次点击各自：原 fragment count +1、`.read`、v44 visited、逐字入口反馈、真实目的地。
2. 入口页恰好成为第三张残页时，v44 目的地赢，绝不同时进入 `#watch`。
3. 已读 f1/f5/f8 再点不重复计数、不重复 v44 转场；主线恢复语义仍可用。
4. f2/f3/f4 原 v29 三目的地不变；f6/f7 原主线不变。
5. corridor 同拍竞争、Enter/Space、离场取消后恢复。
6. 三新场景画面解码，九热点落在真实图内、非卡片、≥44px。
7. 九动作逐字反馈、九真实目的地、首选锁与同拍竞争。
8. clean direct hash 三新场景可进入且只记到访。
9. `catch → return-passage` 唯一 v31 窄例外；干净直达与 lastScene/lastAction 错配仍被拦。
10. off-route / hidden DOM 程序化 click 对状态、反馈、音效、timer 均零副作用。
11. pending 合法 / 伪造、reload、离场后重返、reduced-motion。
12. 坏 JSON、数组错型、非法 visited/entry/marks、超大 traversals。
13. v28–v43 与旧主线隔离；走廊入口只出现原残页计数允许变化。
14. 目录三个入口、Remembrance 单行、8 卡、遗忘清除。
15. 全程 console error / exception 为 0。

### Visual

至少覆盖：

- 走廊 clean、f1/f5/f8 三入口反馈态。
- 三场景桌面 1440×1024。
- 三场景移动 390×844。
- 三场景短桌面 1440×800。
- 每场景至少一个动作反馈态。
- 目录 02ζ/02η/02θ。
- Remembrance 单行 + 8 卡。
- 无横向溢出；首屏可见图与三热点；热点 ≥44px；反馈不压图、不被裁切。

### 回归

- v43 Smoke + visual。
- v42 Smoke。
- v41 Smoke。
- v40 Smoke + visual。
- v31 或 v29 的走廊 / 残页近邻回归。
- `node --check script.js`
- `node tests/site.test.mjs`
- `git diff --check`
