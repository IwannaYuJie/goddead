# v49 门前实感：旧场景原生物件热点

状态：设计冻结，等待 v48 验收后交给 Kimi 实现。

## 目标

v49 不再增加房间，也不扩写新的存档树。它回头优化 v31 的三个门前旧场景，把画面下方的卡片按钮改成画面内真实物件热点：

- `#peephole-chamber` 倒置窥孔；
- `#glyph-niche` 失号龛；
- `#return-passage` 回返夹道。

玩家看见什么就点什么，点击后继续沿用现有短反馈与自动转场。禁止新增“继续”“进入”“确认”按钮，禁止要求滚动到图片下方才能完成动作。

英文副题：`THE FORECOURT BECAME TOUCHABLE`

## 设计原则

1. 只改表现层和 HTML 归属，不改任何既有玩法结果。
2. 所有既有按钮 `id`、反馈文案、状态写入、目标场景、声音、AutoAdvance 与首选锁逐字逐项保留。
3. 原生 `button` 直接放进相对定位的画面容器；不可用 div 模拟点击，不可用 SVG 或 CSS 绘制器物。
4. 热点必须覆盖图中真实可见物件，不能覆盖一大片空黑区域。
5. 默认态可发现但克制：细金框、暗红短标签；hover、focus-visible、触屏点按时增强。
6. 桌面、短桌面和移动端都在首屏看到画面及全部可用热点，不再保留下方 `.branch-choices` 卡片墙。
7. 每个热点最小可点击尺寸 44×44 CSS px；标签不能遮住相邻物件。
8. 图片继续使用真实位图素材；不写入可读文字、人物、脸、手或现代 UI。

## 新素材

设计源图：

- `design-references/source-v49-forecourt-peephole.png`
- `design-references/source-v49-forecourt-glyph-niche.png`
- `design-references/source-v49-forecourt-return-passage.png`

正式 WebP：

- `assets/forecourt-peephole-tactile.webp`
- `assets/forecourt-glyph-niche-tactile.webp`
- `assets/forecourt-return-passage-tactile.webp`

三张图固定 1536×1024。构图与 v31 保持同一黑金、暗红、档案机关恐怖语言，主体必须适合 3:2 容器及移动端中心裁切。

回返夹道的新图必须在既有门环、远门、双向脚印之外，补出两个互不重叠的真实物件：

- 右上墙面：老式黑色墙挂电话，听筒可辨认；
- 右下墙缝：黄铜出证槽，露出一张无字值班证。

## 场景一：倒置窥孔

保留既有三个按钮和既有 DOM 顺序；把按钮移入图内：

| 既有按钮 | 图内物件 | 既有结果 |
|---|---|---|
| `#peephole-choice-witness` | 中央黑镜 | `witnessed` → `#protocol` |
| `#peephole-choice-listen` | 左侧黄铜听音管 | `heardInside` → `#return-passage` |
| `#peephole-choice-close` | 右侧机械眼睑 | `refusedSight` → `#eyelid-archive` |

热点标签：

- 黑镜：`直视黑镜`
- 听音管：`听黄铜管`
- 机械眼睑：`闭上这只眼`

辅助说明保留原 `.bb-hint` 文本，可在默认态视觉隐藏、hover/focus 时显示；屏幕阅读器始终可读。

## 场景二：失号龛

| 既有按钮 | 图内物件 | 既有结果 |
|---|---|---|
| `#glyph-choice-count` | 左侧墙面成组计数刻痕 | `countedNine` → `#peephole-chamber` |
| `#glyph-choice-erase` | 九枚号盘里已被刮白的第七盘 | `erasedSeven` → `#protocol` |
| `#glyph-choice-blank` | 底部白瓷空白号牌 | `tookBlank` → `#unnumbered-vestibule` |

热点标签：

- 刻痕：`数第九道刻痕`
- 刮白号盘：`擦掉第七号`
- 白瓷盘：`取下空白号牌`

九枚号盘仍应一眼能和底部白瓷盘区分。刮白号盘的材质差异要足够明显，热点不得误盖相邻正常号盘。

## 场景三：回返夹道

该场景目前有五个来自 v31、v36、v37 的既有动作。五个按钮全部移入图内，任何一个都不能继续留在图下：

| 既有按钮 | 图内物件 | 既有结果 |
|---|---|---|
| `#return-choice-follow` | 中下部向内延伸的一列脚印 | `followedInward` → `#glyph-niche` |
| `#return-choice-knock` | 左墙巨大门环 | `knockedInside` → `#protocol` |
| `#return-choice-backward` | 远处正中央的门 | `walkedBackward` → `#reverse-stairwell` |
| `#return-choice-registry` | 右下黄铜出证槽与无字值班证 | `caughtTomorrowPermit` → `#night-shift-registry` |
| `#return-choice-callback` | 右上老式墙挂电话 | `answeredLateWallCall` → `#midnight-callback` |

热点标签：

- 脚印：`跟随向内的脚印`
- 门环：`从里面敲门`
- 远门：`倒着走到尽头`
- 值班证：`接住值班证`
- 电话：`接起迟到电话`

脚印热点沿透视线放置，但不覆盖整张地面；远门热点只围住门体。电话和出证槽在移动端中心裁切后仍必须完整可见且各自至少 44×44。

## HTML/CSS 约束

- 三个 `<figure>` 变为相对定位的原生热点舞台。
- 继续使用原按钮 `id`，原 `aria-pressed`、`data-hover` 与子节点文本。
- 可新增统一类，例如 `.forecourt-tactile-stage`、`.forecourt-native-hotspot` 与场景定位类。
- 不新增平行按钮，不复制相同 `id`，不保留隐藏的旧卡片副本。
- `.branch-response` 仍紧跟画面之后，反馈出现时不能推动热点离开视口。
- 图片使用 `object-fit: cover` 时，热点坐标必须与实际裁切同步；优先让舞台保持稳定 3:2 比例，避免桌面和移动端两套坐标漂移。
- 桌面标签可常显短标题；移动端标签可缩短，但可访问名称必须是完整动作。
- reduced-motion 只缩短转场时间，不移除 focus/pressed/反馈状态。

## 逻辑边界

v49 不新增 localStorage key，不迁移现有存档，不改：

- `goddead_v31_forecourt_weave`
- v32、v36、v37 以及后续所有状态结构；
- `FORECOURT_META`
- `FLOOR_ENTRY_META`
- `callbackEntryBtn`
- 三场景进入守卫、近邻回流、目录与痕迹；
- 当前精确反馈文案与目标 hash。

如果实现只需保留按钮 `id` 即可沿用原监听器，优先不改 `script.js` 业务逻辑。若为视觉状态必须加代码，只能加表现同步，不得产生新路线或新写盘。

## QA 合同

### 静态合同

至少验证：

- 三张 source PNG 与三张正式 WebP 存在且均为 1536×1024；
- 三个场景共 11 个既有按钮各出现一次，并位于对应 figure 内；
- 三处旧 `.branch-choices` 容器已删除，且没有隐藏副本；
- `script.js` 中 11 个按钮的既有目标、标记和反馈不变；
- 没有 v49 localStorage key；
- README、`design-qa.md`、`docs/ProgressLog.md` 与本设计同步。

### 行为回归

干净配置和已有配置各跑一轮，覆盖：

- 三场景直接 hash 可达；
- 11 个热点逐个鼠标点击后立即反馈并自动到精确旧目标；
- 键盘 Tab 可到达全部热点，Enter/Space 与点击等价；
- 同场景首个动作已排队时其余热点幂等，不抢占目标；
- 返回后 `aria-pressed` 与既有状态一致；
- v31 门外三入口、v32 三条改道、v36 值班证、v37 电话回拨不退化；
- 目录、痕迹、忘却、刷新、离页、坏 JSON、reduced-motion 与 console zero 不退化。

### 视觉证据

至少保存：

- 三场景桌面 1440×1024 默认态；
- 三场景桌面 hover/focus 态；
- 三场景移动端 390×844；
- 回返夹道五热点同屏；
- 三场景任一反馈态；
- 短桌面 1440×800。

每个 source 与运行截图必须做同尺寸并排比较，确认：

- 热点精确压在对应器物上；
- 图片无拉伸、主体无误裁；
- 标签不重叠、不溢出；
- 移动端没有横向滚动；
- 反馈出现后仍不需要滚动才能理解下一步；
- 11 个动作都不再依赖图下卡片。

## 提交边界

先只实现并验收，不执行 `git add`、commit、push 或 stash。保留现有 v32 暂存区原样，且不得改写 `docs/KimiUsageLog.md`。
