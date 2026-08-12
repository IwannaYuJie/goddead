# v72 遗言中央银行 / CENTRAL BANK OF LAST WORDS

版本：v72 设计冻结稿
状态：已实现，Codex 独立浏览器验收通过（7357 assertions）
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

死亡外交部签完三十六份条约后，三座共和国终于互相承认，却发现没有任何货币能支付跨境死亡。姓名于是发行只有签名、没有持有人的钞票；影子铸造只在无人注视时流通的黑币；肉身把尚未说出口的遗言拆成国债。

玩家依次选择：

1. 一种遗言货币；
2. 一种不可能储备；
3. 一项死亡货币政策；

形成 `3 × 3 × 4 = 36` 份遗言金融工具。每次清算后，一名汇兑员停留在对应旧场景；三轴全部覆盖后，痕迹室开放主权违约庭，产生三条新的宏观结局。

## 解锁合同

v72 只读 v71，不写 v71 或更早状态。

`lastWordBankUnlocked()` 必须同时满足：

- `deathDiplomacyUnlocked()` 为真；
- v71 treaties 覆盖三种 delegation、三种 counterpart、四种 clause；
- v71 `warOutcomes` 精确包含：
  - `all-borders-moved-inside-the-body`
  - `only-the-exile-was-recognized`
  - `resurrection-became-contraband`

任一前置缺失时，v72 getter 返回全新默认态，四个 v72 direct hash 全部归一到 `#remembrance`，入口、记忆、39 格图鉴、目录、三处汇兑员全部隐藏。

## 新场景

1. `#last-word-central-bank`：遗言中央银行，选择三种发行货币。
2. `#unsaid-currency-mint`：未言货币铸造局，选择三种不可能储备。
3. `#testament-clearing-vault`：遗嘱清算金库，选择四项死亡货币政策。
4. `#sovereign-default-chamber`：主权违约庭，三项最终违约。

场景总数：`117 → 121`。

## 第一幕：遗言中央银行

标题：`04δ / 遗言中央银行 · CENTRAL BANK OF LAST WORDS`
图：`assets/v72-last-word-central-bank.webp`

画面是一座黑石与旧黄铜银行大厅。三座发行柜台围住一只没有指针的汇率钟：左侧钞票只有层层签名却没有持有人，中间黑币只在帷幕阴影中显形，右侧遗言债券从缝合的喉管里连续吐出。必须保留三块清楚、不重叠、≥44px 的原生热点。

### 三种货币

| currency | 按钮 | feedback | tally |
|---|---|---|---|
| `ownerless-signature-note` | `发行无主签名钞 · ISSUE THE OWNERLESS SIGNATURE NOTE` | `姓名把签名印满钞面，却不肯留下持有人。每张纸币都能证明有人承诺过，不能证明那个人存在。` | `name` |
| `unseen-shadow-coin` | `铸造无人注视黑币 · MINT THE UNSEEN SHADOW COIN` | `影子把自己切成圆片。黑币只有在目光移开时才显出面额，因此每次清点都会少一枚。` | `shadow` |
| `unspoken-testament-bond` | `发行未言遗嘱债 · ISSUE THE UNSPOKEN TESTAMENT BOND` | `肉身抵押喉咙里尚未说出的遗言。债券到期日写在最后一次呼吸之后。` | `body` |

选中 currency 后创建 pending，锁住三按钮，短反馈后进入 `#unsaid-currency-mint`；只在 target arrival 时写入 draft.currency 与 visited.mint。

## 第二幕：未言货币铸造局

标题：`04ε / 未言货币铸造局 · MINT OF UNSPOKEN CURRENCY`
图：`assets/v72-unsaid-currency-mint.webp`

三条铸币线不是制造钱，而是往钱背后塞入储备：左侧玻璃肺封存最后一口气，中间家族保险库堆着继承来的沉默，右侧棺形压印机把结局压成金属准备金。三块热点清楚、不重叠、≥44px。

### 三种储备

| reserve | 按钮 | feedback | target |
|---|---|---|---|
| `last-breath-reserve` | `存入最后一口气 · DEPOSIT THE LAST BREATH` | `玻璃肺把最后一口气分成一百份。每一份都足以让货币活着，却没有一份能让持有人复活。` | `threshold` |
| `inherited-silence-reserve` | `存入继承来的沉默 · DEPOSIT INHERITED SILENCE` | `沉默从遗嘱里过户。它没有声音，却能对所有尚未说出口的话收取保管费。` | `remembrance` |
| `collateralized-ending-reserve` | `抵押一段结局 · COLLATERALIZE AN ENDING` | `结局被压进棺形金属锭。只要故事还欠着利息，它就不能真正结束。` | `unending-gallery` |

选中 reserve 后进入 `#testament-clearing-vault`；只在 target arrival 时写入 draft.reserve 与 visited.vault。

## 第三幕：遗嘱清算金库

标题：`04ζ / 遗嘱清算金库 · TESTAMENT CLEARING VAULT`
图：`assets/v72-testament-clearing-vault.webp`

中央清算台像一口剖开的保险箱，四件政策工具呈十字排列：出生前印钞版、告别贬值秤、复活冻结闸、他人口腔形赎回柜。四块热点清楚、不重叠、≥44px。

### 四项政策

| policy | 按钮 | fragment |
|---|---|---|
| `issue-before-speaking` | `先于说出口发行 · ISSUE BEFORE IT IS SPOKEN` | `遗言在发声以前就进入流通，讲话者反而成了自己的伪钞。` |
| `devalue-the-farewell` | `让告别贬值 · DEVALUE THE FAREWELL` | `每一次重复告别都会贬值，直到离开比留下更便宜。` |
| `freeze-resurrection-liquidity` | `冻结复活流动性 · FREEZE RESURRECTION LIQUIDITY` | `所有下一次呼吸被冻结，死者仍有资产，却再也无法把它兑换成生命。` |
| `redeem-in-another-mouth` | `在他人口中赎回 · REDEEM IN ANOTHER MOUTH` | `遗言只能在别人的口中兑付，原说话者因此永远听不见自己的余额。` |

金融工具 id 固定为 `currency:reserve:policy`。标题为三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自带自由文本。

点击 policy 后创建 instrument pending，必须含固定 `source=testament-clearing-vault`，并转到 reserve 对应旧场景。只在 target arrival 时原子执行：

- `monetaryRuns +1`；
- 对应 `issuerTallies +1`；
- instrument 首次发现才进入 instruments 图鉴；
- lastOutcome 更新；
- activeRemittance 建立；
- draft 清空；
- pending 清空。

重复同一工具不会重复图鉴，但仍增加真实发行次数与发行方票数。来源页刷新不能提前结算，目标页刷新不能重复结算。

## 三处旧场景汇兑员

| reserve | 旧场景 | 返回按钮 | activeRemittance feedback |
|---|---|---|---|
| `last-breath-reserve` | `threshold` | `跟末息汇兑员返回央行 · RETURN WITH THE LAST-BREATH TELLER` | `末息汇兑员在门槛外核对储备。那口气仍然有效，只是已经不属于任何肺。` |
| `inherited-silence-reserve` | `remembrance` | `跟沉默汇兑员返回央行 · RETURN WITH THE SILENCE TELLER` | `沉默汇兑员把余额写进痕迹墙。数字没有发出声音，却让所有遗言同时欠息。` |
| `collateralized-ending-reserve` | `unending-gallery` | `跟结局汇兑员返回央行 · RETURN WITH THE ENDING TELLER` | `结局汇兑员从无尽画廊带回抵押凭证。每幅终局都盖着尚未到期的印章。` |

activeRemittance 只在准确 target 出现。返回后清 activeRemittance，进入遗言中央银行。旧场景原有反馈、pending、图鉴、通知与入口不得被覆盖。

当 activeRemittance 位于 `remembrance` 时，v72 普通入口与违约入口必须显示但 disabled；汇兑员返回按钮可用。返回后入口按 draft / pending / coverage 重新恢复，不能出现“看似可点但 handler 静默拒绝”的假按钮。

## 覆盖与主权违约

`monetaryCoverageComplete()` 必须从规范 instruments 实时重算：

- 三种 currency 全覆盖；
- 三种 reserve 全覆盖；
- 四种 policy 全覆盖；
- 至少四份金融工具。

覆盖可由四份代表工具完成，三份永远不能覆盖四项 policy。

覆盖完成后，痕迹室显示：

`让所有遗言同时违约 · DEFAULT EVERY LAST WORD AT ONCE`

进入 `#sovereign-default-chamber`。

标题：`04η / 主权违约庭 · SOVEREIGN DEFAULT CHAMBER`
图：`assets/v72-sovereign-default-chamber.webp`

### 三项违约

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `nationalize-every-last-word` | `国有化所有遗言 · NATIONALIZE EVERY LAST WORD` | `every-last-word-was-nationalized` | `remembrance` | `中央银行宣布所有遗言属于国家。私人死亡仍被允许，但最后一句话必须先交公。` |
| `let-silence-set-interest` | `让沉默决定利率 · LET SILENCE SET THE INTEREST RATE` | `silence-set-the-interest-rate` | `unending-gallery` | `利率由无人开口的时长决定。沉默越久，死者欠未来的声音就越多。` |
| `declare-death-too-big-to-fail` | `宣布死亡大到不能倒闭 · DECLARE DEATH TOO BIG TO FAIL` | `death-became-too-big-to-fail` | `threshold` | `央行用所有未说出口的遗言救助死亡。门重新营业，而倒闭的只有生者。` |

每次合法 target arrival：defaultRuns +1；outcome 首次进入 defaultOutcomes；lastOutcome 更新；pending 清空。重复违约仍增加 defaultRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v72_last_word_bank`
version：`72`

规范十一键，固定投影顺序：

```js
{
  version: 72,
  visited: { bank: false, mint: false, vault: false, default: false },
  draft: { currency: '', reserve: '' },
  instruments: [],
  defaultOutcomes: [],
  monetaryRuns: 0,
  defaultRuns: 0,
  issuerTallies: { name: 0, shadow: 0, body: 0 },
  lastOutcome: '',
  activeRemittance: null,
  pending: null
}
```

规范化要求：

- visited 精确投影四布尔；
- draft 精确投影两键，reserve 非空时 currency 必须合法；
- instruments 按 `CURRENCIES × RESERVES × POLICIES` 固定表顺序去重；
- defaultOutcomes 按三 action 固定顺序去重；
- monetaryRuns / defaultRuns 与三 issuerTallies 均 floor、clamp `0..9999`；
- lastOutcome 只能指向规范 instruments 或 defaultOutcomes；
- activeRemittance 只允许 `{reserve,instrument,feedback}` 三键；instrument 必须已收集，reserve 等于 instrument 第二段，feedback 必须由 reserve 表逐字反算；
- 顶层多余键不得落盘；坏 JSON、坏 version、数组、null 或未解锁时 getter 返回默认态；
- v72 不写 v71 及任何旧 key。

## 七类 strict pending

所有 pending 必须 exact-key、逐字反算，额外键、缺键、错 source / target / feedback 均归 null。

1. `entry`：`{kind,target,feedback}`，target=`last-word-central-bank`。
2. `currency`：`{kind,source,currency,target,feedback}`，source=`last-word-central-bank`，target=`unsaid-currency-mint`。
3. `reserve`：`{kind,source,currency,reserve,target,feedback}`，source=`unsaid-currency-mint`，target=`testament-clearing-vault`。
4. `instrument`：`{kind,source,currency,reserve,policy,instrument,target,feedback}`，source=`testament-clearing-vault`，target 由 reserve 反算。
5. `remittance-return`：`{kind,from,target,instrument,feedback}`，from 为三个旧场景之一并匹配 activeRemittance.reserve，target=`last-word-central-bank`。
6. `default-entry`：`{kind,target,feedback}`，coverage 完整，target=`sovereign-default-chamber`。
7. `default`：`{kind,source,action,outcome,target,feedback}`，source=`sovereign-default-chamber`，逐表反算。

重播矩阵：

- target：立即 arrive，一次性结算并清 pending；
- source：恢复逐字反馈、锁定按钮与 aria-pressed，只排一次转场；
- else：清 pending，不结算、不转场；
- target reload 不重复增加 runs / tallies；
- source reload 不提前计数。

## 路由守卫与旧场景窄桥

- bank：合法 entry / remittance-return target，或 visited.bank；
- mint：合法 currency target，或 visited.mint + 合法 draft.currency；
- vault：合法 reserve target，或 visited.vault + 合法完整 draft；
- default：coverage + 合法 default-entry target，或 visited.default；
- `threshold / remembrance / unending-gallery` 只为合法规范化后的 v72 instrument pending target 或匹配 activeRemittance 开窄桥；不得放宽原有 v63/v66/v71 守卫。

## UI / 图鉴 / 目录

痕迹室记忆行：

`遗言央行：已清算 N/36 份工具，共发行 R 次；货币 签名 A / 黑币 S / 遗嘱 B；储备 末息 L / 沉默 I / 结局 E；政策 先发 P / 贬值 D / 冻结 F / 他口赎回 M；货币主权 Q；违约结局 O/3。`

图鉴新增 39 格：36 instruments + 3 defaultOutcomes。未发现显示 `？？？`；发现后显示冻结标题与逐字 feedback。

目录新增四项：

- `04δ / 遗言中央银行`
- `04ε / 未言铸币局`
- `04ζ / 遗嘱清算金库`
- `04η / 主权违约庭`

“遗忘全部”必须移除 v72 key，清 v72 AutoAdvance、draft、activeRemittance、pending、反馈、disabled、aria-pressed，隐藏入口、记忆、39 格图鉴、目录与三处汇兑员；不写 v71。

## 交互防线

必须恰好 18 个 v72 click listener，首条语句均为 `if (!e.isTrusted) return;`：

- 普通入口 1；
- default 入口 1；
- currency 3；
- reserve 3；
- policy 4；
- remittance-return 3；
- default action 3。

程序化 `.click()` / `dispatchEvent` 必须零副作用；真实 Chrome 鼠标点击至少覆盖普通入口一次。

## 素材合同

所有源 PNG 与运行时 WebP 均为 `1536×1024`，无文字、无 logo、无 UI、无水印，保持 Goddead 黑石 / 旧黄铜 / 灰白骨质 / 暗红封蜡视觉语言。WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| 源图 | 运行时图 | 用途 |
|---|---|---|
| `design-references/source-v72-last-word-central-bank.png`（1536×1024 / 2500967 B / `0ef188547422265139ffe6a9c6af9e40defe154f6b5686e417385309559e180d`） | `assets/v72-last-word-central-bank.webp`（1536×1024 / 194176 B / `fa8b3159a4bdcb2786262a6d9d6c287bf2a7429cd2cd47049b368fa3cfd1b53e`） | 三种货币发行柜台 |
| `design-references/source-v72-unsaid-currency-mint.png`（1536×1024 / 2829468 B / `6462374014a32c57d467cebd04a0fac24e5ab60ff66561ca5bd05e4b70c23c0e`） | `assets/v72-unsaid-currency-mint.webp`（1536×1024 / 264376 B / `6cb1cac01918039bf793d70c6eddb81294155e9b271cf519f51848a2fc02344a`） | 三种不可能储备 |
| `design-references/source-v72-testament-clearing-vault.png`（1536×1024 / 2566818 B / `705c589a78d3c9144e5cf04e29560753ecce8699e2e161dd19e45656fac2982a`） | `assets/v72-testament-clearing-vault.webp`（1536×1024 / 211204 B / `0e2170498e705ed09138bb0e7df5cb9051e7a0fe74887599b7cc0293c8c36b3c`） | 四项死亡货币政策 |
| `design-references/source-v72-sovereign-default-chamber.png`（1536×1024 / 2698837 B / `b24fea0c20876a8947b0b3ad4f6c98fd3a0fbd4e62e5bd95fa0bedd1cd9c5bce`） | `assets/v72-sovereign-default-chamber.webp`（1536×1024 / 250194 B / `ff5a167118ae10bb6443aee302e0fd1c9da9f1056d850c66bcdb2aec1fe4801e`） | 三项主权违约 |

## 静态测试门槛

- cache `v=72`；
- 121 场景、唯一 id / data-scene、四场景标题 / 路由 / preload / 目录；
- 4 source + 4 WebP 尺寸、sha256、bytes 与预算冻结；
- 36+3 id / 标题 / feedback 固定顺序；
- canonical 十一键、清洗、clamp、坏 JSON / type / version；
- v71 前置与三 warOutcomes 缺一不可，锁定 getter 归默认；
- 至少四份覆盖、三份不开放；
- 七类 pending exact keys + 逐字反算 + source / target / else；
- 重复 instrument / default、activeRemittance 三键反算与三处旧守卫桥；
- Remembrance 零进度 39 格 / 双入口 / 记忆 / 目录；activeRemittance 在 Remembrance 时入口 disabled、返回后恢复；
- forget-all 只清 v72；
- 18 个 isTrusted listener 与合成点击零副作用；
- 窄屏热点 ≥44px、不重叠、无横向 overflow。

## Codex 独立浏览器验收

Kimi 静态全绿后，以本地生产文件验收：

1. locked 四 direct hash 全回 remembrance，v72 UI 全隐藏；
2. ready-zero：普通入口可用、39 格全锁、default 入口隐藏；
3. 四场景在 1280×720 与 390×844 正确 active，图片 complete 1536×1024，热点框内 / 不重叠 / ≥44px，overflow=0；
4. 代表工具首次 / reload / 重复：图鉴 `1/36 → 1/36`，monetaryRuns `1 → 2`，对应 tally `1 → 2`；
5. 三处汇兑员 target / reload / return；
6. 四份代表工具完成 3 currency / 3 reserve / 4 policy 覆盖，三份不开放，四份开放；
7. 三票平局显示“无人取得货币主权”；
8. 代表 default 首次 / reload / 重复幂等；
9. 七类 pending source / target / else；
10. 坏 JSON / 坏 type 回默认；
11. 合成 click 零副作用，真实 Chrome 鼠标点击普通入口成功；
12. 新生产 tab console warning / error 为 0；
13. 浏览器存储恢复，临时 helper / tab / server 全部清理。

## v73 活口

当三条 defaultOutcomes 全部真实收集后，未来开启「梦境海关总署 / CUSTOMS OF BORROWED DREAMS」：央行拿无法兑付的遗言去购买未出生者的梦，海关则要求每个梦申报自己从哪一个不存在的人脑中入境。v72 只留下规范 defaultOutcomes，不放置死入口。
