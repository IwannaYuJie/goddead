# Goddead v36 设计：夜班登记所 / THE NIGHT-SHIFT REGISTRY

## 目标

v36 不再往更深处追加一条单线，而是修正 v35 已经暴露出的数值假分支，并把一条新横向通路接回最前段。

- v35 当前六个合法值班动作无论怎样组合，`signal - debt` 都至少为 4；因此正常游玩只能进入 high 档，review / debt 只能靠测试种子触发。
- 新增一个可重复进入的 `#night-shift-registry`，同时连接 v31 `#return-passage` 与 v35 `#unnumbered-floor`。
- 玩家每个无号层 cycle 最多领取一张值班证；值班证直接改变本轮 signal / debt，让三档结算都能通过正常点击抵达。
- 保留「点击选择 → 立即反馈 → 自动回到无号层」；不增加确认页、继续按钮或新结局。
- 现有 v31 / v35 动作文字、反馈、目的地、mark 与首选锁全部保留，只新增明确的新动作。

## 参考机制与原创转译

参考只取交互机制，不复制题材、角色、美术或文案。

1. `Security Booth: Director's Cut`
   - 官方 Steam 说明强调夜班岗位、对照登记册与决定是否放行。
   - 转译为：无人值守的夜班登记窗、三张会改变楼层承认方式的值班证。
2. `Papers, Please`
   - 官方 Steam 说明强调依靠有限文件作出准入判断。
   - 转译为：玩家不判断人类身份，而是选择自己愿意让哪一种行政错误生效。
3. `No, I'm not a Human`
   - 官方 Steam 说明强调敲门者、访客征兆与允许谁进入的焦虑。
   - 转译为：值班证并非奖励，而是在三种都不可信的通行资格里主动认领一种。

本轮的 Goddead 原创恐怖点：

- 登记所没有职员，柜台仍会递出证件。
- 三张证件都能让玩家继续值班，但它们分别把「信号」或「门债」写进玩家名下。
- 玩家在领证时已经决定了本轮更可能被抬回、交复核，还是被门债遣返。

## 新场景与素材

### 新场景

- Hash：`#night-shift-registry`
- 中文：夜班登记所
- 英文：THE NIGHT-SHIFT REGISTRY
- 场景说明：`登记窗里没有职员。三只证件托盘仍按顺序把明天的值班证推到今天。`

### 素材

监理生成并保留四张 1536×1024 RGB PNG：

1. `design-references/source-night-shift-registry.png`
   - 正式：`assets/night-shift-registry.webp`
   - 黑石与骨瓷围成的地下登记窗；柜台无人；三只旧黄铜托盘并排；后墙挂着倒走的值班钟。
2. `design-references/source-permit-mute-bell.png`
   - 正式：`assets/permit-mute-bell.webp`
   - 黑石柜台同机位近景；骨瓷值班证嵌一枚没有铃舌的微型黄铜铃。
3. `design-references/source-permit-blank-name.png`
   - 正式：`assets/permit-blank-name.webp`
   - 同机位；骨瓷号牌姓名栏完全空白，暗红封蜡却压着两个重复姓名框。
4. `design-references/source-permit-reverse-badge.png`
   - 正式：`assets/permit-reverse-badge.webp`
   - 同机位；工牌正面朝下，背面有签名线，四枚门形压痕从纸背凸起。

素材要求：

- 黑石、骨瓷、旧黄铜、暗红封蜡，与 v31/v35 同一世界。
- 三张证件图保持同桌面、同机位、同灯位，只改变核心物件。
- 不画可读文字、数字、UI、按钮、边框或现代屏幕。
- 核心证件居中，移动端中心裁切仍能一眼区分。

## 两个入口

### v31 回返夹道

保留现有三个动作逐字不动，新增第四动作：

- 按钮 ID：`return-choice-registry`
- 标题：`接住墙缝吐出的值班证`
- 提示：`日期写着明天，背面通往无号层`
- mark：`caughtTomorrowPermit`
- entry：`passage`
- 反馈：`墙缝吐出一张盖着明日日期的值班证，背面写着无号层。`
- 自动去：`#night-shift-registry`

与回返夹道原三个动作共用 `return-passage` 首选锁。原三动作的文字、反馈、mark、目的地必须逐字保持。

### v35 无号层

保留三扇房门与缺层电梯的语义不动，新增登记窗动作：

- 按钮 ID：`floor-door-registry`
- 标题：`敲开夜班登记窗`
- 提示：`窗后没有人，托盘仍在移动`
- mark：`openedNightShiftRegistry`
- entry：`floor`
- 反馈：`地面少了一块砖，登记窗从下面升了起来。`
- 自动去：`#night-shift-registry`

它与三扇房门共用大厅首选锁；缺层电梯仍只在任意两房完成后启用。

### 无号层布局

新增登记窗后，大厅共有五个核心控件：

1. 无铃病房
2. 渗水档案池
3. 逆照洗衣房
4. 夜班登记窗
5. 缺层电梯

移动 390×844 必须在首屏完整看到五个控件。建议将四个横向去向做紧凑 2×2，电梯独占一行；每个控件触达高度仍 ≥44px。不能删除真实大厅母图。

## 夜班登记所

### 登记签

显示四项：

- 本轮凭证：未领 / 无铃证 / 失名牌 / 反面工牌
- 附加信号：0 / 2
- 附加门债：0 / 2 / 4
- 最佳路线：沿用 v35 `bestRoute`

### 三张值班证

三张证件始终同屏出现；没有领取时都可选。每个 cycle 只能成功领取一张，领取后三张都 disabled，但保持可见。

#### 1. 无铃证 / `muteBell`

- 图片：`assets/permit-mute-bell.webp`
- 按钮 ID：`permit-choice-mute-bell`
- 标题：`借出无铃证`
- 征兆：`证上的铃没有铃舌，却在你眨眼时摆动。`
- 本轮效果：signal `+2`，debt `+0`
- mark：`borrowedMuteBellPermit`
- 反馈：`空铃在证背摇了一下，没有出声。楼层信号多认了你两次。`
- 反馈后自动回：`#unnumbered-floor`

#### 2. 失名牌 / `blankName`

- 图片：`assets/permit-blank-name.webp`
- 按钮 ID：`permit-choice-blank-name`
- 标题：`领走失名牌`
- 征兆：`姓名栏保持空白，封蜡却重复盖了两次。`
- 本轮效果：signal `+0`，debt `+2`
- mark：`claimedBlankNamePermit`
- 反馈：`号牌没有名字，门债却把你的姓名写了两遍。`
- 反馈后自动回：`#unnumbered-floor`

#### 3. 反面工牌 / `reverseBadge`

- 图片：`assets/permit-reverse-badge.webp`
- 按钮 ID：`permit-choice-reverse-badge`
- 标题：`签收反面工牌`
- 征兆：`正面压在柜台下，背面替你留下签名。`
- 本轮效果：signal `+0`，debt `+4`
- mark：`signedReverseBadge`
- 反馈：`你在背面签字。正面的四道门同时记住了这笔债。`
- 反馈后自动回：`#unnumbered-floor`

### 领取规则

- 第一次合法选择立即写入状态并增加 signal / debt；同一 cycle 不得再次领取或重复加值。
- 三按钮竞争点击、快速连点、Enter / Space 重复事件只认第一张。
- 领取反馈至少显示一个正常反馈节拍；reduced-motion 约 0.3 秒。
- 领取后自动回无号层，绝不出现确认页或继续按钮。
- 已领证后重访登记所：三张卡保持可见、对应证件 `aria-pressed=true`、全部 disabled；可用底部返回无号层。
- 如果从已 settled 状态进入登记所，先开启 v35 新 cycle，再允许领证。
- 直接 hash 进入登记所只记 visited，不自动领取；干净存档允许玩家主动领证并进入一个正常无号层 cycle。

## 三档正常可达

v35 六个既有值班动作、分值与门债全部不改。登记证只在本轮基础上加一次修正：

| 凭证 | 两房既有净值 | 凭证修正 | 合法 routeScore | 结果 |
|---|---:|---:|---:|---|
| 不领证 | 4 | 0 | 4 | high |
| 无铃证 | 4 | +2 signal | 6 | high |
| 失名牌 | 4 | +2 debt | 2 | review |
| 反面工牌 | 4 | +4 debt | 0 | debt |

验收必须用真实 UI 完成下列三条路径，不能只改 localStorage 种子：

1. 无铃证 → 任意两房值班 → high → 定额电梯。
2. 失名牌 → 任意两房值班 → review → 异常复核科，并强制 neutral 新轮。
3. 反面工牌 → 任意两房值班 → debt → 回返夹道。

原本不领证的 high 路线也必须保持。

## 状态

继续扩展 `goddead_v35_unnumbered_floor`，不创建第二份会与 cycle 漂移的平行状态。

新增字段：

- `visited.nightShiftRegistry: boolean`
- `permit: "none" | "muteBell" | "blankName" | "reverseBadge"`
- `permitSignal: 0 | 2`
- `permitDebt: 0 | 2 | 4`
- `permitCycle: non-negative integer`
- `permitRuns: non-negative integer`
- `muteBellRuns: non-negative integer`
- `blankNameRuns: non-negative integer`
- `reverseBadgeRuns: non-negative integer`

要求：

- 旧 v35 存档无迁移弹窗，新增字段安全默认。
- `permit` 与修正值必须互相一致；非法组合恢复为 none / 0 / 0。
- `permitCycle` 必须与当前 cycle 一致；过期证件不得污染新 cycle。
- 新 cycle 开始时清空 permit / permitSignal / permitDebt，累计领证次数保留。
- signal 理论上限从 10 调整为 12；debt 理论上限从 4 调整为 8。
- 坏 JSON、数组错型、非法 permit、NaN、Infinity、负数、超大数与过期组合全部安全归一。
- 不读取、不覆盖 v28–v34 与旧主线状态。
- 刷新保留当前证件与加值，不重复应用。
- 离场清除登记反馈 timer，不幽灵回大厅。
- 「遗忘」同步清除。

## 目录、痕迹与缓存

- 首次访问登记所后恢复：
  - `01π / 夜班登记`
- 未访问时目录项 `hidden` 且不可聚焦。
- Remembrance 只新增一行，不增加第九张统计卡：
  - `夜班登记：领证 N 次，无铃 B，失名 M，反面 R。`
- 保持统计卡严格为 8 张。
- 缓存版本推进到 v36，包含新 WebP 与既有 v35 资源。

## 视觉与交互合同

- 登记所沿用 `.scene-branch` 与 v34 卡片交互语言，不新造另一套页面系统。
- 桌面 1440×1024：标题、登记签、主场景图、三张证件卡与返回动作完整可见。
- 短桌面 1440×800：三张证件至少完整看到卡图、标题与可点区域。
- 移动 390×844：三证件紧凑三列或等价布局，三张卡全部首屏可点，触达高度 ≥44px，零横向溢出。
- 三张证件必须使用真实位图；不得用文字块、emoji、CSS 图、SVG 或占位符代替。
- 首页与 v31/v35 既有图像不替换。
- 焦点、Tab、Enter、Space、`aria-pressed`、disabled、`aria-live` 与 reduced-motion 沿用现有契约。

## 测试与证据

### 静态契约

更新 `tests/site.test.mjs` 覆盖：

- 四 WebP 存在并引用、四源 PNG 保留。
- 新场景结构、登记签、三卡、三按钮、三反馈与分值逐字。
- 回返夹道原三动作逐字不变且总按钮数 +1。
- 无号层原三门与电梯语义不变，新增登记窗。
- permit 白名单、一致性归一、新 cycle 清空、理论上限 12/8。
- 三档真实分数表与落点。
- 目录 01π、痕迹单行、8 卡、缓存 v36、文档同步。

### 真实浏览器 smoke

新建 `/tmp/goddead-qa/v36-night-shift-registry-smoke.mjs`，至少覆盖：

1. 两入口、反馈、entry、mark、首选锁；原动作不变。
2. 直接 hash 不自动领证。
3. 三张证逐张分值、反馈、pressed、禁重复与自动回大厅。
4. 三张证通过真实 UI + 两房值班分别跑出 high 6 / review 2 / debt 0。
5. 不领证路线仍 high 4。
6. review 强制 neutral、high 守卫、debt 一次性反馈均正确。
7. 重访禁重复、刷新不重复、离场清 timer。
8. 快速连点、Enter、Space、reduced-motion。
9. 旧 v35 存档兼容与新增字段容错。
10. v28–v34 与主线字节级隔离。
11. 目录、痕迹、遗忘、8 卡。
12. 全程控制台零异常。

### 视觉

新建 `/tmp/goddead-qa/v36-night-shift-registry-visual.mjs`，证据写入 `design-qa-evidence/v36-*.png`：

1. 登记所桌面 1440×1024，三卡全部解码可见。
2. 登记所移动 390×844，三卡首屏可点、触达 ≥44px、零溢出。
3. 无号层桌面与移动，五个核心控件全部可见。
4. 回返夹道与无号层两入口反馈态。
5. 三张证件领取反馈态。
6. high 6 / review 2 / debt 0 三档真实结算反馈态。
7. 目录 01π 与痕迹单行 + 8 卡。

逐张目验，尤其把三张证件源图与页面截图放在同一比较输入中，确认物件身份、中心裁切与卡片加载。

## Kimi 实现边界

Kimi 负责所有生产 HTML / CSS / JavaScript、WebP 转码、静态断言、浏览器脚本、截图与完成文档更新。

本轮边界：

- 不执行 `git add / commit / push / stash / reset`。
- 不碰 `docs/KimiUsageLog.md`。
- 不修改四张监理源 PNG。
- 不碰既有 stash。
- 不开始 v37。
- 不顺手重构无关模块或修改既有文案。
- 如果出现真实额度错误，立即停止并原样报告。
