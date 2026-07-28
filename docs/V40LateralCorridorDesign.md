# Goddead v40 设计：门外侧廊 / THE LATERAL CORRIDORS

## 目标

v40 继续优化最前面的首页，不把内容接到 v39 后面。

- 把首页门两侧原本主要作为黑色留白的区域，真正做成通向门后纵深的左右侧廊。
- 首页中央门视觉放大约 10%–15%，仍保留三次敲门主流程、门开状态与 v31/v38 四个既有热点。
- 新增左廊 / 右廊两个空间热点。点击后立即反馈并进入对应新区域，不要求先敲门。
- 新增三间互相连通的真实场景：无灯灯廊、借影陈列廊、铰链分拣室。
- 新区域不是答题或计分轮次，而是一张可反复探索的空间网络：每个场景有三个画面内热点，点击就自动去下一处。
- 三个新场景分别连回 v31、v38、v39 的既有前段区域，让首页支线形成网，而不是新增一条固定长链。
- 没有确认页、下一步、继续按钮、新结局或主线硬门槛。

## 首页视觉深化

### 纵深底图

监理生成一张 1536×1024 RGB PNG：

- 源图：`design-references/source-threshold-lateral-hall.png`
- 正式：`assets/threshold-lateral-hall.webp`

画面要求：

- 黑石门厅正面视角，中央留出比现有门稍大的深色门龛，供现有 closed/open 门图居中叠放。
- 左右各有一条明显向后延伸的窄侧廊；地面旧铜导轨分别拐入左右黑暗。
- 左廊只有一盏不发光却留下影子的黄铜灯；右廊墙面有一片先于门转弯的门形影子。
- 中央仍是视觉主角，侧廊只负责让周边黑色有真实纵深和可探索方向。
- 无人物、无可读文字、数字、UI、按钮、边框、水印或 logo。

页面处理：

- 底图作为首页门场景的环境层，不替换现有 `threshold-bureau-door.webp` / `threshold-bureau-door-open.webp`。
- 1440×800 时中央门比 v39 当前首页截图放大约 10%–15%，门和两个侧廊都在首屏。
- 390×844 时门仍是主目标；左右热点可以上下错开，但触达至少 44×44，不横向溢出。
- 现有日蚀、符号、回来、代审四热点的位置与可发现性不得退化。

### 两个新热点

#### 左廊

- ID：`hotspot-lateral-left`
- 可访问名称：`沿门左侧不发光的灯廊前行`
- 短标签：`左廊`
- 反馈：`左侧黑暗向后退了一步。门没有移动，走廊却从它旁边长了出来。`
- 自动去：`#unlit-lamp-gallery`
- entry：`threshold-left`
- mark：`enteredLeftCorridor`

#### 右廊

- ID：`hotspot-lateral-right`
- 可访问名称：`跟随门右侧先行的影子`
- 短标签：`右廊`
- 反馈：`右侧墙面折进门影。你还站在门外，但影子已经先行。`
- 自动去：`#borrowed-shadow-gallery`
- entry：`threshold-right`
- mark：`enteredRightCorridor`

两者与现有首页交互共用同一个首选锁：

- 左廊 / 右廊 / 日蚀 / 符号 / 回来 / 代审 / 第三次敲门，第一项被接受后锁定本次转场。
- 转场反馈保留一个可感知节拍。
- 鼠标、Enter、Space 均可激活。
- 离场取消 timer，不得幽灵回跳。

## 新场景与素材

共同视觉语言：

- 黑石、旧黄铜、黑蜡、极少量暗红警示灯。
- 1536×1024，主体位于中心，适配桌面与移动中心裁切。
- 同一机构、同一材质、同一灯位逻辑，但三场景轮廓必须一眼可分。
- 恐怖来自空间和影子的逻辑错误，不出现怪物正脸、血腥肢体或现代设备。
- 图内无可读文字、数字、UI、按钮、边框、水印或 logo。

### 1. 无灯灯廊 / THE UNLIT LAMP GALLERY

- Hash：`#unlit-lamp-gallery`
- 源图：`design-references/source-unlit-lamp-gallery.png`
- 正式：`assets/unlit-lamp-gallery.webp`
- 画面：一条向深处收窄的黑石灯廊，两侧黄铜灯笼全部熄灭；最近的一盏没有火光，却在对面墙上投出清晰的人形影子。地面两条旧铜导轨在远处拐进墙里。
- 场景说明：`这里的灯只负责留下影子。照明是另一个部门的事。`

画面内三个热点：

1. `触碰那盏未亮的灯`
   - 反馈：`灯没有亮，影子却换到了你的脚下。`
   - 自动去：`#borrowed-shadow-gallery`
   - mark：`touchedUnlitLamp`
2. `沿着地面铜轨前行`
   - 反馈：`铜轨先在墙里拐弯，随后拖着走廊一起转向。`
   - 自动去：`#hinge-sorting-room`
   - mark：`followedLampRail`
3. `从两排灯笼之间挤出去`
   - 反馈：`两排灯把你夹成一条更窄的回来。`
   - 自动去：`#return-passage`
   - mark：`escapedLampGallery`

### 2. 借影陈列廊 / THE BORROWED SHADOW GALLERY

- Hash：`#borrowed-shadow-gallery`
- 源图：`design-references/source-borrowed-shadow-gallery.png`
- 正式：`assets/borrowed-shadow-gallery.webp`
- 画面：黑石长廊墙上挂着空黄铜框，框内没有展品，地面却站着数个没有主人的影子；中央是一道人形影子，尽头是一扇没有实体门的门形阴影。
- 场景说明：`所有影子都登记过主人。少数主人还没有被制造出来。`

画面内三个热点：

1. `站进人的影子`
   - 反馈：`影子替你站住，灯廊因此空出一个位置。`
   - 自动去：`#unlit-lamp-gallery`
   - mark：`stoodInBorrowedShadow`
2. `推开门形的影子`
   - 反馈：`没有门的铰链先响了。墙面向两侧让开。`
   - 自动去：`#hinge-sorting-room`
   - mark：`openedShadowDoor`
3. `跟随先走的门影`
   - 反馈：`门影从窥孔背面经过。你只好从里面去看它。`
   - 自动去：`#peephole-chamber`
   - mark：`followedDoorShadow`

### 3. 铰链分拣室 / THE HINGE SORTING ROOM

- Hash：`#hinge-sorting-room`
- 源图：`design-references/source-hinge-sorting-room.png`
- 正式：`assets/hinge-sorting-room.webp`
- 画面：圆形黑石分拣室，墙上环列大量不同方向的旧黄铜铰链；中央三座没有门板的门框分别只装向内铰链、向外铰链和完全空着的轴位。一盏暗红灯悬在没有铰链的门框上方。
- 场景说明：`门板在别处。这里先决定每扇门应该向哪一边承认自己。`

画面内三个热点：

1. `装上向内开的铰链`
   - 反馈：`门轴把你的选择数成了第九道刻痕。`
   - 自动去：`#glyph-niche`
   - mark：`fittedInwardHinge`
2. `装上向外开的铰链`
   - 反馈：`门框向门外打开。代审窗已经在等下一位访客。`
   - 自动去：`#proxy-admission`
   - mark：`fittedOutwardHinge`
3. `让门不再有铰链`
   - 反馈：`门从路线中被删除。核验站要求你证明还记得来路。`
   - 自动去：`#return-audit`
   - mark：`removedFinalHinge`

## 交互规则

- 三个新场景的热点必须覆盖画面中真实可辨的器物或空间，不做底部按钮清单。
- 热点使用原生 button，具有短可见标签、完整 aria-label、focus-visible 与至少 44×44 触达。
- 热点在键盘 Tab 顺序中按画面从左到右、从近到远排列。
- 第一项被接受后，同场景全部热点立即 disabled，反馈写入 aria-live，并自动进入目的地。
- 同一节拍竞争输入只接受第一项。
- 目的地是新场景时继续探索；目的地是既有前段区域时沿用其原状态与守卫。
- `#return-passage` / `#peephole-chamber` / `#glyph-niche` 是 v31 前段场景，v40 真实落点应允许本轮对应 outcome 窄例外，不得放宽其余未访问直达。
- `#proxy-admission` 与 `#return-audit` 本身允许直接进入，不改 v38/v39 的 cycle 或结算语义。
- 每个新场景保留一个低权重 `回到门外` 出口，仅作退出探索，不承担推进。

## 状态契约

独立 key：

`goddead_v40_lateral_corridors`

建议字段：

```json
{
  "visited": {
    "lamp": false,
    "shadow": false,
    "hinge": false
  },
  "entry": "direct",
  "pending": null,
  "lastScene": "",
  "lastAction": "",
  "traversals": 0,
  "marks": []
}
```

白名单：

- entry：`threshold-left / threshold-right / lamp / shadow / direct`
- scene：`lamp / shadow / hinge`
- action：
  - `lamp / shadow / passage`
  - `stand / shadowDoor / peephole`
  - `inward / outward / remove`
- marks：本设计列出的 11 个 mark

修复规则：

- visited 只接受 lamp / shadow / hinge 三个布尔键。
- pending 必须是 `{ scene, action, target, feedback }` 的完整合法映射，四字段必须与白名单表严格对应；错配即清空。
- lastScene / lastAction 只接受白名单且必须互相匹配。
- traversals 有限、非负、向下取整并封顶 9999。
- marks 白名单过滤、去重。
- 坏 JSON、数组错型、伪造 target、伪造 feedback 安全归一。
- pending 只用于恢复已接受但尚未完成的自动转场，不作为已访问或计数依据。
- timer 真正触发前清 pending；离场清 timer 但保留合法 pending，重返原场景时重播逐字反馈并恢复转场。
- v28–v39 与主线状态字节级隔离。

## 目录、痕迹与遗忘

首次真实进入后恢复：

- `01υ / 无灯灯廊`
- `01φ / 借影陈列`
- `01χ / 铰链分拣`

Remembrance 只加一行，不增加统计卡：

`门外侧廊：穿行 N 次；无灯 / 借影 / 铰链已见 X/3。`

遗忘全部痕迹时：

- 删除 `goddead_v40_lateral_corridors`
- 隐藏三个目录入口与痕迹单行
- 清除待执行 timer
- 仍保持 8 张统计卡

## QA 契约

Kimi 实现后新增 v40 smoke / visual，至少覆盖：

1. 首页中央门放大、纵深底图与左右侧廊首屏可见；现有 closed/open 门状态不退化。
2. 首页六热点 + 三敲共用首选锁，鼠标 / Enter / Space，干净存档即可发现。
3. 左右入口逐字反馈与自动目的地。
4. 三个新场景真实存在，三张素材引用 / 解码，三个画面内热点可见且不做底部卡片清单。
5. 九条动作的逐字反馈、第一项锁与真实自动目的地。
6. 新场景之间可往返；落到 v31/v38/v39 五个既有区域均走真实 UI。
7. v31 三个落点只放行当前 v40 action 对应的窄例外，其余未访问直达仍守卫。
8. pending 白名单、target/feedback 错配、坏 JSON、数组错型、伪造 traversals 修复。
9. 同节拍竞争只执行第一项。
10. reload 在反馈拍内重播反馈并恢复转场；离场无幽灵回跳；重返原场景恢复合法 pending。
11. reduced-motion 缩短延迟但保留反馈节拍。
12. v28–v39 与主线字节级隔离。
13. 目录 01υ/01φ/01χ、痕迹单行、仍 8 卡、遗忘清除。
14. 1440×1024、1440×800、390×844 首页与三场景首屏、触达 ≥44px、零横向溢出。
15. 四张源 PNG 与四张 WebP 存在、引用、解码，控制台零异常。
16. v39 smoke + visual、v38 smoke、v37 smoke 近邻回归。

实现边界继续保持：Kimi 写全部 HTML/CSS/JS/测试/文档；Codex 只提供设计、素材和独立验收。
