# v87 不存在债务催收局 / COLLECTION AGENCY FOR NONEXISTENCE DEBT

版本：v87 本地实装与独立验收完成稿
状态：故事、交互与四幕素材均已实装并通过 Codex 独立验收
职责：Codex 设计 / 生图 / 资产复核 / 独立验收；Gemini 生产前端 / 自动化测试 / 实现文档

## 核心命题

不存在获得公民身份后，政府第一次需要为“没有发生”的事维护公共预算。被注销者收到缺席税单，空位抵押自己从未占用的面积，死亡向没有活过的年份收取复利。

这里不追讨钱。催收局追讨的是：记忆里多出来的一次存在、肉身尚未交付便产生的折旧，以及世界继续容纳空缺所支付的利息。

## 解锁合同

v87 只读 v86，不写 v86 或更早状态。`nonexistenceDebtCollectionUnlocked()` 必须同时满足：

1. `existenceRenunciationUnlocked()` 为真；
2. v86 `renunciations` 至少 4 份，并覆盖三 renunciant、三 evidence、四 clause；
3. v86 `tribunalOutcomes` 精确包含：
   - `every-visitor-was-struck-from-reality`
   - `nonexistence-became-a-citizen`
   - `the-world-disinherited-itself`

任何缺失、伪造、坏类型或错误版本都不解锁 v87。

## 场景拓扑

新增四幕：

1. `nonexistence-debt-collection-agency` — 不存在债务催收局
2. `absence-arrears-ledger-vault` — 缺席欠账簿库
3. `ontological-repossession-chamber` — 本体财产收回室
4. `unpayable-existence-bankruptcy-court` — 不可偿还存在破产庭

场景总数：`177 → 181`。静态资源缓存查询标记：`v=87`。

目录编号：

- `06π / 不存在债务`
- `06ρ / 缺席欠账`
- `06σ / 本体收回`
- `06τ / 存在破产`

## 第一幕：不存在债务催收局

画面分成三个竖向催收窗口。每个窗口只承认一种债务人：

### 1. `citizen-who-exists-only-as-nonexistence`

- 中文短名：无籍公民
- 英文：CITIZEN WHO EXISTS ONLY AS NONEXISTENCE
- tally：`citizen`
- 叙事：不存在取得公民身份后立刻收到第一张税单。税号有效，住址为空，纳税人只有在被否认时才能被准确送达。

### 2. `visitor-erased-but-still-in-arrears`

- 中文短名：除名访客
- 英文：VISITOR ERASED BUT STILL IN ARREARS
- tally：`visitor`
- 叙事：终审庭删掉了所有抵达记录，催收系统却保留脚印产生的维护费。没有人来过，但门槛坚持有人欠它磨损。

### 3. `world-that-disinherited-itself`

- 中文短名：弃继世界
- 英文：WORLD THAT DISINHERITED ITSELF
- tally：`world`
- 叙事：世界拒绝继承自己以后，山河、记忆和死亡都变成无人接管的遗产。催收局把整个现实列为失联债务人。

选择债务人后进入 `absence-arrears-ledger-vault`。

## 第二幕：缺席欠账簿库

三件债权凭证各自通往一处旧场景，由一名 v87 催收员在那里等待：

### 1. `absence-tax-bill-addressed-to-a-blank-citizen`

- 中文短名：缺席税单
- 英文：ABSENCE TAX BILL ADDRESSED TO A BLANK CITIZEN
- target：`posthumous-census-hall`
- collector：`absence-tax-bailiff`
- 催收员中文：缺席税执行吏
- 叙事：税单以空白姓名为收件人，人口普查却能逐年统计它未曾居住的天数。每一处空栏都产生滞纳金。

### 2. `mortgage-on-space-never-occupied`

- 中文短名：空位抵押
- 英文：MORTGAGE ON SPACE NEVER OCCUPIED
- target：`reality-refund-counter`
- collector：`vacancy-repossessor`
- 催收员中文：空位收回员
- 叙事：一平方米从未被任何身体占用，却连续抵押了所有可能站在这里的人。退款柜台要求先归还空缺，再讨论谁曾拥有它。

### 3. `bond-backed-by-years-never-lived`

- 中文短名：未活年债
- 英文：BOND BACKED BY YEARS NEVER LIVED
- target：`last-word-central-bank`
- collector：`unlived-years-auditor`
- 催收员中文：未活年审计员
- 叙事：债券以没有活过的年份作储备，每逾期一天便增发一段不存在的童年。遗言中央银行承认它没有本金，只有到期日。

选择凭证后进入 `ontological-repossession-chamber`。

## 第三幕：本体财产收回室

四项处置围绕中央空人形排成 `2 × 2`：

### 1. `garnish-every-memory-that-proves-existence`

- 中文短名：扣记忆
- 英文：GARNISH EVERY MEMORY THAT PROVES EXISTENCE
- 叙事：所有能证明债务人存在过的记忆被逐笔扣押。债务因此失去主体，却因为无人能够否认而变得更可靠。

### 2. `repossess-the-body-before-delivery`

- 中文短名：收未交体
- 英文：REPOSSESS THE BODY BEFORE DELIVERY
- 叙事：肉身在出生以前被收回。骨头、伤口和年龄仍继续折旧，只是再也没有住客能对账单提出异议。

### 3. `capitalize-nonexistence-into-eternal-interest`

- 中文短名：无化复利
- 英文：CAPITALIZE NONEXISTENCE INTO ETERNAL INTEREST
- 叙事：不存在被写入本金，每次没有发生都自动成为利息。欠款终于永远准确，因为偿还本身也会产生新的存在证明。

### 4. `declare-death-an-insufficient-payment`

- 中文短名：死不足偿
- 英文：DECLARE DEATH AN INSUFFICIENT PAYMENT
- 叙事：死亡被拒绝作为结清方式。催收局认定一生只能偿还活过的部分，未活年份必须由结局继续支付。

## 36 份催收令

`3 debtors × 3 instruments × 4 remedies = 36 collections`。

规范 ID：

`<debtor>:<instrument>:<remedy>`

完成一份催收令后：

1. 写入 `collections`，固定笛卡尔顺序去重；
2. `collectionRuns += 1`；
3. 对应 `debtorTallies` 加一；
4. 设置 `activeCollector = { instrument, collection, feedback }`；
5. 前往 instrument 的旧 target；
6. 旧 target 只在合法 `collection` / `collector-return` pending 下开放 v87 窄桥；
7. 受信任点击催收员后返回 `nonexistence-debt-collection-agency`，清空 draft / activeCollector / pending。

coverage 完成条件：至少 4 份催收令且覆盖 3 debtors、3 instruments、4 remedies。

## 第四幕：不可偿还存在破产庭

Remembrance 在 coverage 完成后显示终庭入口。三项裁定：

### 1. `forgive-every-debt-before-existence`

- outcome：`every-debt-was-forgiven-before-anyone-existed`
- target：`threshold`
- 中文：存在以前全部免债
- 叙事：所有欠款被追溯到出生以前并同时赦免。门外仍堆满催收信，却没有一封能证明收件人后来真的出现。

### 2. `make-nonexistence-the-sole-creditor`

- outcome：`nonexistence-became-the-only-creditor`
- target：`remembrance`
- 中文：不存在成为唯一债权人
- 叙事：不存在接管全部债权。痕迹墙上的每段记忆都开始向空白支付利息，越被记住，越欠自己没有发生。

### 3. `foreclose-on-the-worlds-right-to-exist`

- outcome：`the-world-was-foreclosed-for-nonpayment`
- target：`unending-gallery`
- 中文：查封世界的存在权
- 叙事：破产庭收走现实继续存在的权利。世界没有消失，只作为一件等待拍卖、永远无人出价的抵押物继续陈列。

## 状态合同

存储键：`goddead_v87_nonexistence_debt_collection`

严格十一键：

```js
{
  version: 87,
  visited: { agency: false, ledger: false, chamber: false, court: false },
  draft: { debtor: '', instrument: '' },
  collections: [],
  bankruptcyOutcomes: [],
  collectionRuns: 0,
  bankruptcyRuns: 0,
  debtorTallies: { citizen: 0, visitor: 0, world: 0 },
  lastOutcome: '',
  activeCollector: null,
  pending: null
}
```

规范化要求：

- visited / draft 精确投影；
- collections 按 `DEBTORS × INSTRUMENTS × REMEDIES` 固定顺序去重；
- bankruptcyOutcomes 按三 action 固定顺序；
- runs / tallies `floor + clamp 0..9999`；
- lastOutcome 只接受三个规范 outcome；
- activeCollector 精确 `{instrument,collection,feedback}` 并逐表反算；
- 坏 JSON / version / type / 未解锁均回默认；
- v87 永不写 v86 或更早 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`
2. `debtor`：`{kind,source,debtor,target,feedback}`
3. `instrument`：`{kind,source,debtor,instrument,target,feedback}`
4. `collection`：`{kind,source,debtor,instrument,remedy,collection,target,feedback}`
5. `collector-return`：`{kind,from,target,collection,feedback}`
6. `bankruptcy-entry`：`{kind,target,feedback}`
7. `bankruptcy-action`：`{kind,source,action,outcome,target,feedback}`

全部 exact-key、逐字反算；target 一次结算，source 恢复反馈并只排一次，else 清理；刷新幂等。

## UI / 交互防线

恰好 18 个 v87 click listener：

- 普通入口 1
- bankruptcy 入口 1
- debtor 3
- instrument 3
- remedy 4
- collector-return 3
- bankruptcy action 3

每个 listener 第一条业务语句必须是 `if (!e.isTrusted) return;`。choose 函数复核 currentScene、figure、button、draft、pending、activeCollector 与 coverage。

记忆行：

`不存在债务：已催收 N/36 份欠账，共执行 R 次；债务人 公民 C / 访客 V / 世界 W；凭证 缺席税 A / 空位押 M / 未活年 Y；处置 扣忆 G / 收体 B / 无复 I / 死不足 D；债务多数 Q；破产裁定 O/3。`

图鉴：39 格（36 collections + 3 bankruptcy outcomes）。

forget-all 必须清 v87 key、AutoAdvance、draft、activeCollector、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个旧场景催收员；不得写 v86。

## 素材与构图合同

全部目标分辨率 `1536×1024`，源 PNG + Pillow `quality=85, method=6` WebP；无可读文字、logo、UI、水印、边框。画面保持 Goddead 的黑曜石黑、骨白、暗红与旧金属质感，给 HTML 原生热点留清晰分区。

1. `assets/source-v87-nonexistence-debt-collection-agency.png`
   - 三个竖向催收窗口：左侧空白公民、中央被除名访客、右侧自我弃继的世界；三分区，不出现文字。
2. `assets/source-v87-absence-arrears-ledger-vault.png`
   - 三件大型凭证：缺席税单、空位抵押契、未活年债券；三分区，不出现可读数字或字母。
3. `assets/source-v87-ontological-repossession-chamber.png`
   - 四项机关 `2 × 2`：记忆扣押瓶、未交付肉身收回架、无形复利轮、拒收死亡的结清台；中央留空。
4. `assets/source-v87-unpayable-existence-bankruptcy-court.png`
   - 三座裁定区：出生前免债、空白唯一债权人、世界存在权查封；三分区。

运行图：

- `assets/v87-nonexistence-debt-collection-agency.webp`
- `assets/v87-absence-arrears-ledger-vault.webp`
- `assets/v87-ontological-repossession-chamber.webp`
- `assets/v87-unpayable-existence-bankruptcy-court.webp`

冻结资产均为 `1536×1024`：

| 资产 | 字节 | SHA-256 |
| --- | ---: | --- |
| `assets/source-v87-nonexistence-debt-collection-agency.png` | 2491153 | `391bf83ad9fc433d177cfe3312bb4a7452e6d3613037c09690ae9af302fbca06` |
| `assets/v87-nonexistence-debt-collection-agency.webp` | 206468 | `cf2b41eb6e0c0d2a30c5cbca03d3ab5bfc7fe25d0b37e7bad2b2c442546d34d2` |
| `assets/source-v87-absence-arrears-ledger-vault.png` | 2601012 | `2ab2f23275ae13891257697894c4f5fa1d9c4d60f2f8a22437df58391833e37d` |
| `assets/v87-absence-arrears-ledger-vault.webp` | 219930 | `372f7679b90d69c2a402237d5ec061d63a20d1d33f1e798c645b7de173b2e973` |
| `assets/source-v87-ontological-repossession-chamber.png` | 2425585 | `7631278f553f71d5913f6f6deb2ea2560c5f76da3253a00f50eeabda5313d517` |
| `assets/v87-ontological-repossession-chamber.webp` | 189318 | `309b9996fcabc9415e29680643eecc924c4960820c35cdaf91dd0ad36bd9d82d` |
| `assets/source-v87-unpayable-existence-bankruptcy-court.png` | 2409192 | `f058ae4c0f9db2e258ce622b2ce1722906de1921dc9292a043310599aae92a0c` |
| `assets/v87-unpayable-existence-bankruptcy-court.webp` | 202646 | `e281851b263df79cda02ae3c75fa7f0336841944e6ecf8332fd9253bc49ceef8` |

## 静态与浏览器门槛

- 181 scenes、cache `v=87`、4 route/title/preload/directory 全覆盖；
- 资产源图/运行图尺寸、哈希、字节冻结；
- 11 键、36+3、七 pending、三 activeCollector、四份 coverage、18 isTrusted；
- v86 解锁正反例、v86 key 只读、forget-all、旧版本治理回归；
- 三处旧 target 窄桥、催收员动态 ID 与 index.html 实际 DOM 全量联动；
- 单 Chrome 窗口单标签 Desktop / 390×844 Mobile；
- 真实四条催收流程覆盖 3/3/4/3，三终庭、刷新、坏档、原存档恢复。

### v87 不存在债务催收局 / COLLECTION AGENCY FOR NONEXISTENCE DEBT 闭环确认
- **场景与存储落位**：4 个新场景（`nonexistence-debt-collection-agency`、`absence-arrears-ledger-vault`、`ontological-repossession-chamber`、`unpayable-existence-bankruptcy-court`）已合入主干，全站场景总数达到 181。存储空间 `goddead_v87_nonexistence_debt_collection` 与只读依赖 `goddead_v86_existence_renunciation` 校验完毕。
- **交互与断言验收**：18 组 `isTrusted` 事件流转顺畅，修复了 5 组按钮在挂起与已结算状态下的门禁逻辑缺陷。测试套件完整通过（`site.test.mjs: 14846 assertions passed`），浏览器 QA 证据归档完整，当前阶段工作已全部闭环。
- **后续规划**：后续仅按规划承接下一版本，不执行非预期的线上部署。

## v88 活口

世界被查封后，拍卖公告第一次收到出价。出价者不是神、死者或未来，而是那些从未发生的事件本身：未说出口的道歉、没有爆发的战争、没有出生的孩子，都想买回一小块现实。

下一站：

`未发生事件拍卖行 / AUCTION HOUSE FOR EVENTS THAT NEVER HAPPENED`

它会问：如果一件从未发生的事买下了现实，它是在获得发生的权利，还是在收购我们已经活过的证据？
