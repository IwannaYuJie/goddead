# v88 未发生事件拍卖行 / AUCTION HOUSE FOR EVENTS THAT NEVER HAPPENED

版本：v88 冻结设计稿
状态：故事、交互、路由、状态与视觉合同已冻结；生产前端、测试与实现文档已完成，独立浏览器 QA 通过
职责：Codex 设计 / 生图 / 资产复核 / 独立验收；Gemini 3.7 Flash High 生产前端 / 自动化测试 / 实现文档 / 缺陷修复

## 核心命题

世界的存在权在 v87 被查封后，破产庭第一次公开拍卖现实。出价者不是神、死者或未来，而是三件从未发生的事件：未说出口的道歉、没有爆发的战争、没有出生的孩子。

它们不想成为“可能性”。它们想成为业主。

拍卖行出售的也不是土地，而是三种现实产权：被当作发生过而被记住的权利、让边界承认自己曾被跨越的领土、以及一段没有身体住过的童年。每一次落槌，已经活过的人都会少拥有一点过去。

## 解锁合同

v88 只读 v87，不写 v87 或更早状态。`unhappenedEventAuctionUnlocked()` 必须同时满足：

1. `nonexistenceDebtCollectionUnlocked()` 为真；
2. v87 `collections` 至少 4 份，并覆盖三 debtor、三 instrument、四 remedy；
3. v87 `bankruptcyOutcomes` 精确包含：
   - `every-debt-was-forgiven-before-anyone-existed`
   - `nonexistence-became-the-only-creditor`
   - `the-world-was-foreclosed-for-nonpayment`

任何缺失、伪造、坏类型、错误版本或错误组合都不解锁 v88。

## 场景拓扑

新增四幕：

1. `auction-house-for-events-that-never-happened` — 未发生事件拍卖行
2. `catalogue-of-unoccupied-reality` — 无主现实拍品库
3. `counterfactual-bidding-floor` — 反事实竞价厅
4. `retroactive-occurrence-title-court` — 追溯发生产权庭

场景总数：`181 → 185`。静态资源缓存查询标记：`v=88`。

目录编号：

- `06υ / 未发拍卖`
- `06φ / 现实拍品`
- `06χ / 反事实竞价`
- `06ψ / 发生产权`

## 第一幕：未发生事件拍卖行

画面分成三个竖向竞买席。每个席位只承认一件从未发生的事件：

### 1. `apology-never-spoken`

- 中文短名：未言道歉
- 英文：APOLOGY NEVER SPOKEN
- tally：`apology`
- 叙事：它在舌尖以前就被撤回，却完整保存了羞耻、原谅和迟到的体温。它想买下一个曾经伤害过人的过去，好让自己终于有对象可以抵达。

### 2. `war-that-never-erupted`

- 中文短名：未爆战争
- 英文：WAR THAT NEVER ERUPTED
- tally：`war`
- 叙事：所有军队都曾在地图边缘等待，所有讣告都预先留白。战争没有开始，因此保留了全部胜负，正以没有伤亡的代价竞拍边界。

### 3. `child-never-born`

- 中文短名：未生孩子
- 英文：CHILD NEVER BORN
- tally：`child`
- 叙事：没有名字、身体或生日，却继承了父母没有说完的未来。它只想买一小段已经有人活过的童年，证明自己并非纯粹的缺席。

选择竞买者后进入 `catalogue-of-unoccupied-reality`。

## 第二幕：无主现实拍品库

三件拍品各自通往一处旧场景，由一名 v88 拍卖员在那里等待：

### 1. `right-to-be-remembered-as-if-it-happened`

- 中文短名：如实发生权
- 英文：RIGHT TO BE REMEMBERED AS IF IT HAPPENED
- target：`forgiveness-landfill`
- auctioneer：`unspoken-apology-auctioneer`
- 拍卖员中文：未言道歉拍卖员
- 叙事：一份没有内容的记忆产权。买家可以被所有人记得，却不必真的发生；宽恕填埋场负责证明，一句没有说出口的话也能留下等待被原谅的重量。

### 2. `territory-inside-an-undeclared-border`

- 中文短名：未宣边境领
- 英文：TERRITORY INSIDE AN UNDECLARED BORDER
- target：`undeclared-war-room`
- auctioneer：`peace-without-war-broker`
- 拍卖员中文：无战和平经纪
- 叙事：边界两侧都声称这里属于一次没有爆发的战争。未宣战室保管着地图、撤军令和无人领取的胜利，唯独没有第一枪。

### 3. `childhood-no-body-ever-lived`

- 中文短名：无人童年
- 英文：CHILDHOOD NO BODY EVER LIVED
- target：`unlived-nursery`
- auctioneer：`unborn-heir-registrar`
- 拍卖员中文：未生继承登记员
- 叙事：一段完整却从未被身体占用的童年，含第一次哭泣、第一次撒谎和一场没有日期的高烧。未活育婴室将它作为带租约的空房出售。

选择拍品后进入 `counterfactual-bidding-floor`。

## 第三幕：反事实竞价厅

四种出价方式围绕中央无槌拍卖台排成 `2 × 2`：

### 1. `bid-with-memory-of-consequences`

- 中文短名：以后果记忆出价
- 英文：BID WITH THE MEMORY OF CONSEQUENCES
- 叙事：先记住事件发生后的后果，再用这段记忆证明事件值得发生。买家获得过去，旁观者承担一段没有原因的创伤。

### 2. `mortgage-the-future-that-would-have-followed`

- 中文短名：抵押本可未来
- 英文：MORTGAGE THE FUTURE THAT WOULD HAVE FOLLOWED
- 叙事：把事件发生后本来会出现的全部未来抵押出去。若竞拍失败，这些未来仍会到期，只是永远找不到属于自己的过去。

### 3. `counterfeit-a-witness-who-remembers-it`

- 中文短名：伪造记得它的证人
- 英文：COUNTERFEIT A WITNESS WHO REMEMBERS IT
- 叙事：制造一名真诚记得事件的人。证词没有说谎，证人没有作伪，唯一伪造的是世界曾经给过这段记忆一个来源。

### 4. `outbid-reality-with-the-cost-of-never-happening`

- 中文短名：以未发生代价压价
- 英文：OUTBID REALITY WITH THE COST OF NEVER HAPPENING
- 叙事：将所有没有发生所避免的痛苦、幸福与责任一次性估价。现实第一次发现，自己可能买不起一件从未存在的事。

## 36 份现实成交契

`3 bidders × 3 lots × 4 bid methods = 36 purchases`。

规范 ID：

`<bidder>:<lot>:<method>`

完成一份成交契后：

1. 写入 `purchases`，固定笛卡尔顺序去重；
2. `auctionRuns += 1`；
3. 对应 `bidderTallies` 加一；
4. 设置 `activeAuctioneer = { lot, purchase, feedback }`；
5. 前往 lot 的旧 target；
6. 旧 target 只在合法 `purchase` / `auctioneer-return` pending 下开放 v88 窄桥；
7. 受信任点击拍卖员后返回 `auction-house-for-events-that-never-happened`，清空 draft / activeAuctioneer / pending。

coverage 完成条件：至少 4 份成交契且覆盖 3 bidders、3 lots、4 methods。

## 第四幕：追溯发生产权庭

Remembrance 在 coverage 完成后显示产权庭入口。三项裁定：

### 1. `grant-every-unhappened-event-retroactive-occurrence`

- outcome：`every-unhappened-event-became-history`
- target：`threshold`
- 中文：追授全部未发事件
- 叙事：产权庭把发生日期补写到一切空白之前。门槛外站满拥有真实过去的陌生人，我们再也无法证明他们昨天并不存在。

### 2. `sell-reality-to-the-highest-absence`

- outcome：`reality-belonged-to-what-never-occurred`
- target：`remembrance`
- 中文：现实售予最高缺席
- 叙事：最高出价不是金额，而是缺席持续的年数。痕迹室从此只租用自己的墙，每段记忆都要向没有发生的房东缴纳现实。

### 3. `annul-the-distinction-between-event-and-memory`

- outcome：`history-could-no-longer-prove-it-happened`
- target：`unending-gallery`
- 中文：撤销事件与记忆之别
- 叙事：发生与被记得被登记为同一种产权。无尽画廊里的每幅图都可能是证物，也可能只是买家入住以后伪造的窗。

## 状态合同

存储键：`goddead_v88_unhappened_event_auction`

严格十一键：

```js
{
  version: 88,
  visited: { house: false, catalogue: false, floor: false, court: false },
  draft: { bidder: '', lot: '' },
  purchases: [],
  titleOutcomes: [],
  auctionRuns: 0,
  titleRuns: 0,
  bidderTallies: { apology: 0, war: 0, child: 0 },
  lastOutcome: '',
  activeAuctioneer: null,
  pending: null
}
```

规范化要求：

- visited / draft 精确投影；
- purchases 按 `BIDDERS × LOTS × BID_METHODS` 固定顺序去重；
- titleOutcomes 按三 action 固定顺序；
- runs / tallies `floor + clamp 0..9999`；
- lastOutcome 只接受三个规范 outcome；
- activeAuctioneer 精确 `{lot,purchase,feedback}` 并逐表反算；
- 坏 JSON / version / type / 未解锁均回默认；
- v88 永不写 v87 或更早 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`
2. `bidder`：`{kind,source,bidder,target,feedback}`
3. `lot`：`{kind,source,bidder,lot,target,feedback}`
4. `purchase`：`{kind,source,bidder,lot,method,purchase,target,feedback}`
5. `auctioneer-return`：`{kind,from,target,purchase,feedback}`
6. `title-entry`：`{kind,target,feedback}`
7. `title-action`：`{kind,source,action,outcome,target,feedback}`

全部 exact-key、逐字反算；target 一次结算，source 恢复反馈并只排一次，else 清理；刷新幂等。

## UI / 交互防线

恰好 18 个 v88 click listener：

- 普通入口 1
- title 入口 1
- bidder 3
- lot 3
- bid method 4
- auctioneer-return 3
- title action 3

每个 listener 第一条业务语句必须是 `if (!e.isTrusted) return;`。choose 函数复核 currentScene、figure、button、draft、pending、activeAuctioneer 与 coverage。

记忆行：

`未发拍卖：已成交 N/36 份现实，共落槌 R 次；竞买者 道歉 A / 战争 W / 孩子 C；拍品 记忆 M / 边境 B / 童年 H；出价 后果 Q / 未来 F / 证人 T / 未发代价 N；得契多数 D；产权裁定 O/3。`

图鉴：39 格（36 purchases + 3 title outcomes）。

forget-all 必须清 v88 key、AutoAdvance、draft、activeAuctioneer、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个旧场景拍卖员；不得写 v87。

## 素材与构图合同

全部目标分辨率 `1536×1024`，源 PNG + Pillow `quality=85, method=6` WebP；无可读文字、logo、UI、水印、边框。画面延续 Goddead 的黑曜石黑、骨白、暗红、烟熏金与旧金属质感，采用超现实暗黑叙事概念画，给 HTML 原生热点留出清晰分区。

1. `assets/source-v88-auction-house-for-events-that-never-happened.png`
   - 三个竖向竞买席：左侧悬在喉口前的未言道歉，中央没有士兵却摆满空盔的未爆战争，右侧空摇篮中由星尘勾勒的未生孩子；三分区，无槌、无可读文字。
2. `assets/source-v88-catalogue-of-unoccupied-reality.png`
   - 三件大型拍品：盛放无源记忆的玻璃产权匣、从未被跨越的折叠边境、无人身体住过的透明童年房间；三分区，不出现可读数字或字母。
3. `assets/source-v88-counterfactual-bidding-floor.png`
   - 四种出价机关 `2 × 2`：后果记忆瓶、本可未来抵押树、伪证人空面模、称量未发生代价的黑秤；中央留出无槌拍卖台与清晰十字负空间。
4. `assets/source-v88-retroactive-occurrence-title-court.png`
   - 三座裁定区：被追授为历史的事件群、坐上现实产权座的最高缺席、事件与记忆相互溶解的无尽画廊；三分区。

运行图：

- `assets/v88-auction-house-for-events-that-never-happened.webp`
- `assets/v88-catalogue-of-unoccupied-reality.webp`
- `assets/v88-counterfactual-bidding-floor.webp`
- `assets/v88-retroactive-occurrence-title-court.webp`

冻结资产均为 `1536×1024`；源图由内置 ImageGen 生成，运行图以 Pillow `quality=85, method=6` 压缩，并已逐张复核分区、文字污染与 WebP 观感：

| 资产 | 字节 | SHA-256 |
| --- | ---: | --- |
| `assets/source-v88-auction-house-for-events-that-never-happened.png` | 2538336 | `7545583bbd6b8984a3e8cfcb4fd300c98507b56f90b7a482b8d36ff07586806d` |
| `assets/v88-auction-house-for-events-that-never-happened.webp` | 211722 | `4d4cd515b41b4a62a4f3c4fc3909e2be853f2395354685946eac7a9ebbd0ce09` |
| `assets/source-v88-catalogue-of-unoccupied-reality.png` | 2558379 | `689a4f490f1aec1cfe497b24f7eac9afab4db38cbef0b4e9c5f96382f11ef725` |
| `assets/v88-catalogue-of-unoccupied-reality.webp` | 219354 | `3b0a7895940d540dc25aaf87d1509590c3a1d122215eb7d07b6d4ae676a3cbf3` |
| `assets/source-v88-counterfactual-bidding-floor.png` | 2846205 | `dee2ae3015706612b0d4c08d6967ca1c511a474b03bd78747f9dd4f163ae381b` |
| `assets/v88-counterfactual-bidding-floor.webp` | 298388 | `72d471e3f408ed1496343c6bc0b5f315fd3de0bc34ee8366decbd2d4715298f2` |
| `assets/source-v88-retroactive-occurrence-title-court.png` | 2874891 | `efc517b9024d6de38e6ddcf4f3800097151ca6edbf166b548682efb0097d118c` |
| `assets/v88-retroactive-occurrence-title-court.webp` | 295890 | `09ddea912a36fcd82dce9c1cb78ab2d3a884977ee91a21eab0b4f1590dbe655b` |

## 静态与浏览器门槛

- 185 scenes、cache `v=88`、4 route/title/preload/directory 全覆盖；
- 资产源图/运行图尺寸、哈希、字节冻结；
- 11 键、36+3、七 pending、三 activeAuctioneer、四份 coverage、18 isTrusted；
- v87 解锁正反例、v87 key 只读、forget-all、旧版本治理回归；
- 三处旧 target 窄桥、拍卖员动态 ID 与 index.html 实际 DOM 全量联动；
- 单 Chrome 窗口单标签 Desktop / 390×844 Mobile；
- 真实四条成交流程覆盖 3/3/4/3，三产权裁定、刷新、坏档、原存档恢复；
- 浏览器不残留 QA 种子、临时 CSS、DevTools、移动端模拟或额外标签页。

## v89 活口

未发生事件取得现实产权后，已经发生的历史突然成了非法住户。出生证、伤疤、战争遗址与所有“我亲眼看见”的证词，都收到同一份限期腾退通知。

下一站：

`既成事实拆迁局 / EVICTION AUTHORITY FOR ACCOMPLISHED FACTS`

它会问：如果过去必须搬离现实，我们交出的究竟是记忆，还是自己确实活过的资格？

## 实现与验收闭环（2026-08-30）

- Gemini 3.7 Flash High 已完成 v88 生产前端、自动化测试、缺陷修复与实现文档；Codex 完成设计、ImageGen 生图、机械集成、诊断和独立 Computer Use QA。
- 场景总数 181→185，缓存标记 `v=88`；新增 `auction-house-for-events-that-never-happened`、`catalogue-of-unoccupied-reality`、`counterfactual-bidding-floor`、`retroactive-occurrence-title-court`，并接入 4 张源 PNG 与 4 张 1536×1024 WebP。
- 生产合同包含 36 purchases + 3 title outcomes、状态键 `goddead_v88_unhappened_event_auction`、11 个顶层字段、7 类 pending、18 个 `isTrusted` 点击监听；v88 只读 v87；三个旧落点为 `forgiveness-landfill`、`undeclared-war-room`、`unlived-nursery`，三终局目标为 `threshold`、`remembrance`、`unending-gallery`。
- `node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check` 与 `node tests/site.test.mjs` 全绿，最终输出 `site.test.mjs: 14992 assertions passed`。
- Computer Use 在一个 Chrome 窗口、一个标签页中完成 4 条真实成交并覆盖 3/3 bidders、3/3 lots、4/4 methods，验证三 auctioneer 回桥、三产权终局、刷新幂等、malformed JSON 回退、桌面 915×774、手机 390×844 与干净控制台；compositor 空白截图未保存，证据见 `design-qa-evidence/v88-browser-qa.json`。
- QA 后精确恢复用户原 22 个 localStorage 项和 `#remembrance`，清除临时键并关闭 DevTools 与设备模拟；本轮未 commit、push、deploy 或 public release。下一版本方向为 `既成事实拆迁局 / EVICTION AUTHORITY FOR ACCOMPLISHED FACTS`。
