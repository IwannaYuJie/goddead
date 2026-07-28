# v41 守则背室 / THE ROOMS BEHIND THE PROTOCOL

## 目标

v40 已把首页门外的黑色留白变成可走入的左右侧廊。v41 继续优化第二幕 `#protocol`，不再向结局后方追加链条，而是把现有访客守则布告板本身变成一件可探索的空间机关。

核心体验：

- 保留现有八条守则、原文、分流、`玖` 异常与布告板素材。
- 在现有 `assets/visitor-protocol-board.webp` 的真实器物上增加三个原生热点：红线结、空白名牌、黄铜铃钮。
- 三个热点分别通往三间真实房间：红线登记室、空名寄存处、无舌铃接待台。
- 三间房互相连成三角，同时回接走廊、归路核验、门外代审、午夜回拨与守则页。
- 所有动作点击 / Enter / Space 后立即出现反馈并自动进入下一处；没有确认、下一步或继续按钮。
- 继续使用真实位图 + 画面内热点，不做底部卡片清单，不用 SVG、CSS 假图或占位图。

## 保留项

以下既有语义必须原样保留：

- `#protocol` 的八条守则文字、删除线、批注、声音与原有八路目的地。
- 其一 → corridor；其二 → return-passage；其三 / 其七 → glyph-niche；其四 → peephole-chamber；其五 → return-audit；其六 → midnight-callback；其八 → proxy-admission。
- `#rules-count` 的 `捌 / 玖` 异常窗口与 `#ninth` 路径；`玖` 仍保持既有高优先级，不被 v41 改写或状态化。
- 现有 `assets/visitor-protocol-board.webp` 不替换、不改图；三个入口必须覆盖在它本来就有的红线、底部空白牌与右下黄铜钮上。
- v28–v40、主线、八张统计卡、所有既有目录与痕迹语义。

## 守则布告板三个入口

在 `.protocol-figure` 内加入三个原生 `button`：

1. `#protocol-hotspot-thread`
   - 覆盖布告板左侧交叉红线与蜡结。
   - 短标签：`红线`
   - aria-label：`顺着访客守则左侧交叉的红线进入登记室`
   - 反馈：`红线从八条守则背后抽紧。布告板让出一条只容卷宗通过的缝。`
   - 自动去：`#red-thread-registry`

2. `#protocol-hotspot-nameplate`
   - 覆盖布告板下方中央的空白长牌。
   - 短标签：`空名`
   - aria-label：`按下守则布告板下方没有姓名的长牌`
   - 反馈：`空白名牌记住了你的按痕，却仍拒绝写出名字。`
   - 自动去：`#blank-name-cloakroom`

3. `#protocol-hotspot-bell`
   - 覆盖布告板右下方的黄铜圆钮。
   - 短标签：`无舌铃`
   - aria-label：`按下守则布告板右下方不会发声的黄铜铃钮`
   - 反馈：`铃钮陷进墙里。没有铃声，接待台却已经叫到你。`
   - 自动去：`#clapperless-bell-desk`

交互规则：

- 三热点与八条守则共用现有 `AutoAdvance` 的 `protocol` 首选锁；第一条被接受的规则或热点决定本拍归宿。
- 热点处理器必须在任何状态读取 / 写入、声音、反馈与 timer 之前校验 `currentScene === "protocol"`。
- 玖异常继续沿用既有直接路径与优先级，不并入 v41 状态，也不改原测试语义。
- 三热点使用 click / Enter / Space；触达至少 44×44。
- 点击时立即写 entry / visited / mark / traversals；离场取消 protocol timer，不做幽灵转场。重新回来后可再次主动触发。
- 反馈写入新增 `#protocol-backroom-response`（`aria-live="polite"`），不复用或覆盖八条守则原反馈。

## 新场景一：红线登记室

- hash：`#red-thread-registry`
- scene key：`thread`
- 标题：`红线登记室`
- kicker：`THE RED-THREAD REGISTRY · 红 线 登 记 室`
- 说明：`每次有人读完守则，墙上就多一根线。这里不登记姓名，只登记谁与哪一句话互相作证。`
- 素材：`assets/protocol-red-thread-registry.webp`
- 源图：`design-references/source-protocol-red-thread-registry.png`

画面内三个热点：

1. `#thread-hotspot-spool`
   - 画面：左侧松开的暗红线轴。
   - 短标签：`松线轴`
   - 反馈：`线轴吐出一截没有去处的红线。寄存处替它挂上一件空外套。`
   - 自动去：`#blank-name-cloakroom`
   - mark：`loosenedRedSpool`

2. `#thread-hotspot-seal`
   - 画面：中央黑蜡见证压印机。
   - 短标签：`见证印`
   - 反馈：`黑蜡没有留下图案，只留下你确实按过它的重量。`
   - 自动去：`#return-audit`
   - mark：`pressedWitnessSeal`

3. `#thread-hotspot-gap`
   - 画面：右侧所有红线钻入的窄柜缝 / 门缝。
   - 短标签：`线后门`
   - 反馈：`红线从柜后穿过去，拖着八张纸一起通向经文走廊。`
   - 自动去：`#corridor`
   - mark：`followedThreadGap`

## 新场景二：空名寄存处

- hash：`#blank-name-cloakroom`
- scene key：`name`
- 标题：`空名寄存处`
- kicker：`THE CLOAKROOM OF BLANK NAMES · 空 名 寄 存 处`
- 说明：`访客进入守则前先把名字寄存在这里。离开的人可以取回外套，却很少有人找到原来的名牌。`
- 素材：`assets/protocol-blank-name-cloakroom.webp`
- 源图：`design-references/source-protocol-blank-name-cloakroom.png`

画面内三个热点：

1. `#name-hotspot-coat`
   - 画面：左侧没有主人的深色外套与不相称的影子。
   - 短标签：`无主外套`
   - 反馈：`外套认出了你的肩膀。代审窗把这当成另一份在场证。`
   - 自动去：`#proxy-admission`
   - mark：`woreOwnerlessCoat`

2. `#name-hotspot-hook`
   - 画面：中央空钩与一块无字黑名牌。
   - 短标签：`挂起名字`
   - 反馈：`你的名字没有被写下，只被一根红线挂到了另一面墙。`
   - 自动去：`#red-thread-registry`
   - mark：`hungBlankName`

3. `#name-hotspot-token`
   - 画面：右侧黄铜取物牌托盘 / 无号圆牌。
   - 短标签：`无号取物牌`
   - 反馈：`圆牌翻到背面。无舌铃台把空白的一面当成了叫号。`
   - 自动去：`#clapperless-bell-desk`
   - mark：`turnedBlankClaimToken`

## 新场景三：无舌铃接待台

- hash：`#clapperless-bell-desk`
- scene key：`bell`
- 标题：`无舌铃接待台`
- kicker：`THE CLAPPERLESS BELL DESK · 无 舌 铃 接 待 台`
- 说明：`这里的铃全都失去了钟舌。值班员仍会对每一次按压作出记录，仿佛声音只是访客的误解。`
- 素材：`assets/protocol-clapperless-bell-desk.webp`
- 源图：`design-references/source-protocol-clapperless-bell-desk.png`

画面内三个热点：

1. `#bell-hotspot-bell`
   - 画面：左侧没有钟舌、底部渗出暗色液体的服务铃。
   - 短标签：`按无舌铃`
   - 反馈：`铃帽下降了一次。午夜回拨台替它补上了迟到的声音。`
   - 自动去：`#midnight-callback`
   - mark：`pressedClapperlessBell`

2. `#bell-hotspot-tube`
   - 画面：中央从柜台下探出的黄铜传声管。
   - 短标签：`柜下传声管`
   - 反馈：`管内没有人回答，只有衣架互相碰了一下。`
   - 自动去：`#blank-name-cloakroom`
   - mark：`spokeIntoDeskTube`

3. `#bell-hotspot-cord`
   - 画面：右侧通向小门 / 守则背面的红色信号绳。
   - 短标签：`拉红绳`
   - 反馈：`红绳把接待台折回布告板背面。八条守则还在原处等你。`
   - 自动去：`#protocol`
   - mark：`pulledRedSignalCord`

## 素材美术方向

三张新源图都采用与 v38–v40 一致的 Goddead 视觉语言：

- 1536×1024，RGB，横向 3:2。
- 写实哥特工业恐怖；黑色大理石、氧化黄铜、少量暗红线 / 红灯。
- 深黑但保留器物轮廓与纵深，不能把交互对象埋进纯黑。
- 无人物正脸；允许无主外套、影子、手的痕迹，但不出现完整访客。
- 不生成可读文字、数字、标识、logo、水印。
- 每张图严格保留左 / 中 / 右三个互不重叠的明确焦点，方便原生 hotspot 覆盖。
- 画面主体在移动裁切的中间 70% 内仍可辨；桌面与移动不靠拉伸。

### 红线登记室构图

- 左：松开的暗红线轴，线头朝中央延伸。
- 中：沉重黑蜡见证压印机 / 压印台。
- 右：大量红线汇入一条窄柜缝或门缝。
- 背墙布满黄铜针与空白纸签，但无可读文字。

### 空名寄存处构图

- 左：一件深色无主外套与方向不一致的影子。
- 中：空黄铜挂钩 + 无字黑名牌。
- 右：盛放空白黄铜圆牌的取物牌托盘。
- 空间是很深的寄存柜廊，重复挂钩向后消失。

### 无舌铃接待台构图

- 左：大型黄铜服务铃，明确缺少内部钟舌，底座下有暗色液体。
- 中：从柜台下伸出的弯曲黄铜传声管。
- 右：一根暗红信号绳，连接墙上的小门 / 守则背板。
- 柜台后无人，远处仅一盏暗红值班灯。

## 布局与触达

### protocol

- `.protocol-figure` 变为可定位容器，继续引用原 WebP。
- 三热点必须贴合原图左侧红线、底部长牌、右下黄铜钮。
- 1440×1024：标题、布告板、三热点、至少前两条守则首屏可见。
- 1440×800：保持现有两栏短桌面布局，右栏可扩到约 340–360px；三热点 ≥44px，不压住左栏第一条守则。
- 390×844：标题与布告板首屏可见；三个热点上下错开，不遮住彼此，不产生横向溢出。

### 三间背室

- 复用 v40 的 `scene-lateral` 画面内热点语言，但使用独立 v41 class / ID，避免样式与状态耦合。
- 1440×1024、1440×800、390×844：三热点均覆盖真实器物、触达 ≥44px、零横向溢出。
- 每场景保留低权重 `回到守则` 出口，仅用于退出探索，不承担推进。
- 热点 Tab 顺序按左 → 中 → 右。

## 状态契约

独立 key：

`goddead_v41_protocol_backrooms`

建议字段：

```json
{
  "visited": {
    "thread": false,
    "name": false,
    "bell": false
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

- entry：`protocol-thread / protocol-name / protocol-bell / thread / name / bell / direct`
- scene：`thread / name / bell`
- action：
  - thread：`spool / seal / gap`
  - name：`coat / hook / token`
  - bell：`bell / tube / cord`
- marks：
  - `enteredThreadRegistry`
  - `enteredBlankNameCloakroom`
  - `enteredClapperlessBellDesk`
  - `loosenedRedSpool`
  - `pressedWitnessSeal`
  - `followedThreadGap`
  - `woreOwnerlessCoat`
  - `hungBlankName`
  - `turnedBlankClaimToken`
  - `pressedClapperlessBell`
  - `spokeIntoDeskTube`
  - `pulledRedSignalCord`

修复规则：

- visited 只接受 thread / name / bell 三布尔键。
- pending 仅用于三间背室的九动作，必须是 `{ scene, action, target, feedback }` 完整合法映射；任何 target / feedback / scene / action 错配即清空。
- lastScene / lastAction 必须互相匹配。
- traversals 有限、非负、向下取整、封顶 9999。
- marks 白名单过滤、去重。
- 坏 JSON、数组错型安全归一。
- timer 触发前清 pending；离场清 timer 但保留合法 pending；重返原场景重播逐字反馈并恢复转场。
- 九动作处理器在任何状态访问与副作用前校验当前场景；隐藏 / off-route 脚本化点击零副作用。
- v28–v40 与主线状态字节级隔离；到达既有目的地后，只允许目的地场景沿其既有语义处理自身状态。

## 目录、痕迹与遗忘

首次真实进入后恢复：

- `01ψ / 红线登记`
- `01ω / 空名寄存`
- `02α / 无舌铃台`

Remembrance 只加一行：

`守则背室：穿行 N 次；红线 / 空名 / 无舌铃已见 X/3。`

仍保持 8 张统计卡。遗忘全部时清除 v41 key、三目录入口、痕迹单行和所有 v41 timer。

## QA 契约

Kimi 实现后新增 v41 smoke / visual，至少覆盖：

1. 现有 protocol 布告板 WebP 未替换；三个入口覆盖原图真实器物。
2. 三入口 click / Enter / Space、≥44px、干净存档可发现。
3. 三入口与八条守则共用 `protocol` 首选锁；双向竞争只接受第一项。
4. `捌 / 玖` 异常与 `#ninth` 原语义不变。
5. 三入口逐字反馈、visited / entry / mark / traversals 点击时持久化、真实自动目的地。
6. 三个新场景真实存在，三张新 WebP 引用 / 解码；每场景三个画面内热点，不做底部卡片清单。
7. 九动作逐字反馈、同拍竞争第一项锁、九个真实目的地。
8. child action currentScene 守卫；protocol / 其他场景触发隐藏 child 热点零副作用、无幽灵跳转。
9. pending 四字段白名单、target / feedback 错配、坏 JSON、数组错型、伪造 traversals / marks 修复。
10. reload 反馈拍重播并恢复；离场无幽灵回跳；重返原场景恢复合法 pending；不重复计数。
11. direct hash 三背室只记 visited，不自动动作。
12. reduced-motion 缩短延迟但保留反馈节拍。
13. v28–v40 与主线字节级隔离。
14. 目录 01ψ / 01ω / 02α、痕迹单行、8 卡、遗忘清除。
15. 1440×1024、1440×800、390×844 的 protocol 与三背室首屏、触达、零横向溢出。
16. 三张源 PNG + 三张 WebP 存在、引用、解码；控制台零异常。
17. v40 smoke + visual、v39 smoke、v38 smoke、v37 smoke 近邻回归。

实现边界不变：Kimi 写全部生产 HTML / CSS / JS、静态测试、浏览器 smoke / visual、截图与 README / ProgressLog / design-qa；Codex 只写设计、生成源图、监督与独立验收。
