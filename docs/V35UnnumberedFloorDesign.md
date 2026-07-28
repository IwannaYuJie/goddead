# v35 无号层设计 / THE UNNUMBERED FLOOR

## 目标

v35 不再继续沿 `v34 → 新房 → 新房` 纵向加长单线，而是在前段网络中加入一座可自由选路、可交叉穿行、可中途离开的横向枢纽。

- 从 `#unnumbered-vestibule` 与 `#quota-elevator` 都可进入 `#unnumbered-floor`。
- 枢纽直接通往三间不同的新房；玩家自己选先后顺序。
- 三间房之间也有交叉通路，不强迫每次回枢纽。
- 完成任意两间房的“值班动作”后，枢纽中央缺层电梯解锁；结算会按本轮“楼层信号 - 门债”把玩家送往三个不同的既有区域。
- 任何房间都保留直接离开路线，不把支线做成硬门。
- 所有动作点击即执行，先显示 0.7–1.0 秒短反馈再自动转场；不新增确认页、继续按钮或结局。

## 恐怖互动参考

只吸收机制，不复刻画面、名称、房间或文案：

- 《8号出口》：观察熟悉环境中的偏差，并用“继续 / 回返”方向选择表达判断。
  官方来源：https://store.steampowered.com/app/2653790/The_Exit_8/
- 《Darkwood》：自由探索多个区域、积累资源与信息，并让选择改变后续路线。
  官方来源：https://store.steampowered.com/app/274520/Darkwood/
- 《The Mortuary Assistant》：把日常值班流程做成恐怖交互，让常规工作动作逐步暴露异常。
  官方来源：https://store.steampowered.com/app/1295920/The_Mortuary_Assistant/

Goddead 的转译是：玩家不是“找不同答题”，而是在神死后的设施里代班；三间房都有看似正常的维护动作，但每次值班都会增加楼层信号或门债，并改写下一条通路。

## 场景与素材

所有监理源图必须保留为 1536×1024 RGB PNG；Kimi 只负责核验并用 Pillow `quality=85` 转成同尺寸 WebP，不得修改源 PNG。

| 场景 | 源 PNG | 正式 WebP | 构图要求 |
|---|---|---|---|
| 无号层大厅 | `design-references/source-unnumbered-floor.png` | `assets/unnumbered-floor.webp` | 正面广角、黑石大厅；左侧无铃病房门、中间渗水档案门、右侧逆照洗衣门；三扇入口一眼可分；后墙中央另有封死的缺层电梯 |
| 无铃病房 | `design-references/source-bellless-ward.png` | `assets/bellless-ward.webp` | 同一病房内明确出现：会呼吸的空床、无铃床头柜、穿墙输液管；三处点击对象空间分离 |
| 渗水档案池 | `design-references/source-seeping-records.png` | `assets/seeping-records.webp` | 下沉档案室；干燥无名页、渗字水池、继续下沉的档案井三处可分 |
| 逆照洗衣房 | `design-references/source-reverse-laundry.png` | `assets/reverse-laundry.webp` | 工业洗衣房；比人先停下的滚筒、没有倒影的工服、像门一样的镜面机舱三处可分 |

共同视觉：

- 与现有黑石 / 骨瓷 / 旧黄铜 / 暗红封蜡体系一致。
- 电影感写实环境，不要文字、标牌、UI、logo、人脸、手、漂浮图标或拼贴。
- 灯光必须让交互物件可辨，不能黑成轮廓；移动端中心裁切仍至少保留该房的核心物件。
- 画面槽位按现有 3:2 `branch-figure` 设计，不拉伸、不做 CSS 假素材。

## 入口

### 无号前厅

现有四个动作保持逐字、反馈、mark 与目的地不变；新增第五个动作：

- 按下电梯里不存在的地下层
- 反馈：`按钮没有下沉。整座前厅却往上抬了一层。`
- `entry = "vestibule"`
- 目的地：`#unnumbered-floor`

### 定额电梯

现有三个动作保持逐字、反馈、mark 与目的地不变；新增第四个动作：

- 让指针停在没有刻度的层
- 反馈：`指针越过零，停在一块没有被刻出来的黄铜上。`
- `entry = "quota"`
- 目的地：`#unnumbered-floor`

两处都继续使用所在场景既有的首选锁；第一条已接受动作排定后，竞争点击 / Enter / Space 必须忽略。

## 枢纽：无号层大厅

标题：

- 英文眉题：`THE UNNUMBERED FLOOR · 无号层`
- 主标题：`无号层`
- 引句：`这里的房间都有用途。只有楼层没有。`

大厅显示一张紧凑的楼层签：

- 已值班：`completed.size / 3`
- 楼层信号：`signal`
- 门债：`debt`
- 最佳路线：`bestRoute`

三扇门始终可选，已完成房间仍可重访，但同一轮同一房的值班收益只能结算一次：

1. 无铃病房 → `#bellless-ward`
2. 渗水档案池 → `#seeping-records`
3. 逆照洗衣房 → `#reverse-laundry`

中央动作：

- 未完成两房前：真正 `disabled`，文字 `缺层电梯仍封死`
- 完成任意两房后：文字 `召回没有楼层的电梯`
- 点击后只结算一次，先显示结果反馈再自动转场。

结算值：`routeScore = max(0, signal - debt)`。

- `routeScore >= 4` → `#quota-elevator`
  反馈：`缺层电梯认出了你的信号，把你抬回仍有定额的高度。`
- `routeScore` 为 `2–3` → `#anomaly-review`，以 neutral 新轮进入
  反馈：`这条路线没有编号，只能先交给复核科承认。`
- `routeScore <= 1` → `#return-passage`
  反馈：`门债比楼层更重。电梯把你吐回写着“回来”的夹道。`

结算更新：

- `completedRuns += 1`
- `bestRoute = max(bestRoute, routeScore)`
- `highRuns / reviewRuns / debtRuns` 按三档只增一个
- `outcome = "high" | "review" | "debt"`，供落点一次性反馈使用
- 结算后开新轮：`cycle += 1`，本轮 `completed/signal/debt` 清空；累计统计保留

## 三间值班房

每间房都显示楼层签的三个核心数字（已值班 / 信号 / 门债），并有三条直接动作。前两条是该房值班动作，同一轮只接受第一次并将房间记入 `completed`；第三条是无收益的穿行 / 离开动作。

### 无铃病房

1. `听无铃床头柜里有没有呼叫`
   - `signal +2`
   - `debt +0`
   - 完成 `ward`
   - 反馈：`没有铃声。床头柜里却有人先说了“收到”。`
   - 目的地：`#reverse-laundry`
2. `替会呼吸的空床换一次床单`
   - `signal +3`
   - `debt +1`
   - 完成 `ward`
   - 反馈：`床单被下面不存在的胸口顶起，又慢慢落下。`
   - 目的地：`#unnumbered-floor`
3. `顺着输液管爬进墙里`
   - 不结算房间，不改 signal/debt
   - 反馈：`输液管把你当作一滴过大的药，送进潮湿的墙后。`
   - 目的地：`#seeping-records`

### 渗水档案池

1. `晾干唯一没有名字的一页`
   - `signal +2`
   - `debt +0`
   - 完成 `records`
   - 反馈：`纸干了。你的名字却从背面慢慢渗出来。`
   - 目的地：`#unnumbered-floor`
2. `把渗出的字喝回去`
   - `signal +4`
   - `debt +2`
   - 完成 `records`
   - 反馈：`墨水记住了你的喉咙，档案池暂时忘了你的名字。`
   - 目的地：`#bellless-ward`
3. `让最下面一层档案继续下沉`
   - 不结算房间，不改 signal/debt
   - 反馈：`档案井下降一格，上方的无号前厅跟着空出一层。`
   - 目的地：`#unnumbered-vestibule`

### 逆照洗衣房

1. `切断比你先停下的滚筒`
   - `signal +2`
   - `debt +0`
   - 完成 `laundry`
   - 反馈：`滚筒停了。里面那件衣服还在继续转身。`
   - 目的地：`#seeping-records`
2. `穿上没有倒影的工服`
   - `signal +3`
   - `debt +1`
   - 完成 `laundry`
   - 反馈：`镜面里少了一个人，工服里却多了一次呼吸。`
   - 目的地：`#unnumbered-floor`
3. `用旧号牌刷开镜面机舱`
   - 不结算房间，不改 signal/debt
   - 反馈：`镜面认得这个号码，把你送回失号龛继续遗失。`
   - 目的地：`#glyph-niche`

房间完成后的重访：

- 两条值班动作都必须 disabled，展示本轮已完成反馈，不可重复加分。
- 第三条穿行 / 离开动作继续可用。
- 切换到新轮后重新可值班。

## 分支图

```text
无号前厅 ─┐
          ├─> 无号层大厅 ─┬─> 无铃病房 ─┬─> 逆照洗衣房
定额电梯 ─┘               │              ├─> 大厅
                           │              └─> 渗水档案池
                           ├─> 渗水档案池 ─┬─> 大厅
                           │                ├─> 无铃病房
                           │                └─> 无号前厅
                           └─> 逆照洗衣房 ─┬─> 渗水档案池
                                            ├─> 大厅
                                            └─> 失号龛

任意完成两房 → 大厅缺层电梯：
  高信号 → 定额电梯
  中间值 → 异常复核科
  低值 / 高门债 → 回返夹道
```

## 状态

独立键：`goddead_v35_unnumbered_floor`

建议结构：

```js
{
  visited: {
    floor: false,
    ward: false,
    records: false,
    laundry: false
  },
  entry: "neutral", // neutral | vestibule | quota
  cycle: 1,
  completed: [], // ward | records | laundry，唯一，最多 3
  signal: 0,
  debt: 0,
  outcome: "", // "" | high | review | debt
  completedRuns: 0,
  highRuns: 0,
  reviewRuns: 0,
  debtRuns: 0,
  bestRoute: 0,
  marks: []
}
```

容错与隔离：

- visited 必须严格布尔。
- entry / completed / outcome / marks 必须白名单、去重、限长。
- cycle 与累计值有限、非负、裁至 9999。
- signal / debt 有限、非负，并裁到本轮理论安全上限。
- `completed.length < 2` 时不允许保留 outcome；已结算 outcome 不得再次累计。
- 坏 JSON、数组错型、非法 room、NaN、Infinity、负数、超大数安全回退。
- 不读写 v28–v34 或主线状态；若需要放行 `#quota-elevator` / `#anomaly-review`，只增加当前 v35 outcome 的窄例外，不放宽其他直达守卫。

## 目录、痕迹与重置

首次进入后恢复目录：

- `01μ / 无号层`
- `01ν / 无铃病房`
- `01ξ / 渗水档案`
- `01ο / 逆照洗衣`

未访问项保持 hidden 且不可聚焦。

Remembrance 只加一行，不增加第九张统计卡：

`无号层值班：完成 R 轮，最佳路线 B，抬回 H 次，门债遣返 D 次。`

遗忘全部时必须清除 v35 键、目录项与这行痕迹；仍严格保持 8 张 stat card。

## 交互与视觉合同

- 1440×800 与 390×844 首屏必须看到该场景的核心可点动作；移动端允许压缩母场景图，但不得删除新房实景身份。
- 原生 `button`；鼠标、触摸、Tab、Enter、Space 可用；触摸目标至少约 44px。
- 每个场景第一条已接受动作锁定，竞争点击 / 键盘输入只结算一次。
- 离场清除本场景 timer；刷新恢复已完成房间与统计，不续跑转场、不重复结算。
- 直接 hash 进入大厅或三房只记录 visited，不自动点击、不自动值班。
- 无横向溢出，控制台零异常。

## Kimi 实现边界

- Kimi 负责全部生产 HTML / CSS / JS、WebP 转码、测试、截图和项目文档更新。
- 不执行 `git add / commit / push / stash / reset`。
- 不碰 `docs/KimiUsageLog.md`、四张源 PNG、既有 stash。
- 不开始 v36，不顺手改无关问题。
- 静态契约至少覆盖：入口增量但原动作不变、四场景结构与资产、三房图与按钮、精确效果/反馈/路线、任意两房解锁、三档结算、同轮防重复、容错隔离、目录、痕迹单行、8 卡、缓存版本。
- 功能冒烟至少覆盖：两入口、三房自由顺序、三房交叉通路、六个值班动作、三条无收益穿行、同轮防重复、任意两房解锁、三档结算、守卫窄例外、一次性结果反馈、刷新/离场、直接 hash、键盘、reduced-motion、容错、隔离、遗忘、控制台。
- 视觉 QA 至少覆盖：大厅与三房桌面 1440×1024、四房移动 390×844、短桌面 1440×800、两入口反馈、三档大厅结算、目录、痕迹；逐张目验并报告真实计数。
