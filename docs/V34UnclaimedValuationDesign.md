# Goddead v34 设计：无主估值室 / THE UNCLAIMED VALUATION ROOM

## 目的

v33 已经让前段网络拥有可重复的「观察与判断」玩法。v34 不再做另一套二选一辨认题，而是扩充 v33 两个结果房，把它们接到一条可重复、能主动止损、会形成组合效果的估值支线：

- 异常保全库与误报回收井都能把手里的东西送进无主估值室。
- 每批出现三件证物，玩家自行决定估值顺序；点中证物即直接执行，不再经过确认或继续按钮。
- 每件证物同时增加「本批估值」并消耗「封印完整」，部分证物会改变下一件、剩余证物或结算值。
- 估值过一件后随时可以「盖章结算」；继续估值可能凑够定额，也可能让封印破损。
- 达到定额进入一座新的定额电梯；未满定额回到前段夹道；封印破损则直接坠回误报回收井。
- 成功电梯不是终局，而是新的前段交通节点，能把玩家送回三条不同路线。
- 这轮只扩充前段支线，不新增结局，不改 v28 治理终局，也不把 v33 的判断分数混进 v34。
- 生产代码、测试和 QA 仍全部由 Kimi K3 High 完成；监理只交付机制、世界观、源素材和验收结论。

## 参考机制与原创转译

只借机制，不复制任何现成场景、角色、文案、物品、数值或界面：

- [Lethal Company on Steam](https://store.steampowered.com/app/1966720/Lethal_Company/)：收集有价值的东西以满足定额，并用更高风险换取更高收益。v34 转译为官僚机构的证物估值与封印完整度。
- [Buckshot Roulette on Steam](https://store.steampowered.com/app/2835570/Buckshot_Roulette/)：用「Double or Nothing」式选择制造继续冒险或及时离开的压力。v34 允许估值一件后随时盖章结算。
- [CloverPit on Steam](https://store.steampowered.com/app/3314790/CloverPit/)：每轮偿还不断要求的债务，并利用物品效果形成组合。v34 只借「定额 + 可组合物品 + 可重复轮次」，不用老虎机、赌博表现或任何原作道具。
- [The Mortuary Assistant on Steam](https://store.steampowered.com/app/1295920/The_Mortuary_Assistant/)：日常程序与异常威胁叠在一起，多轮内容不会完全相同。v34 用确定性轮换批次代替裸随机，保证可恢复、可测试。

## 前段接线

v33 两个结果房各新增一个清楚可见的第四动作。原有六个动作、文案、mark、反馈和目的地全部保留：

```text
异常保全库
└─ 把未封存的证物送去估值 ─→ 无主估值室（entry=vault）

误报回收井
└─ 把一件退件申报成资产 ───→ 无主估值室（entry=shaft）
```

新增动作与原动作共用各自场景的首选锁。任何鼠标、Enter、Space 或快速连点都只能让最先被接受的动作生效。

## 新区域一：无主估值室

- Hash：`#unclaimed-valuation`
- 中文名：无主估值室
- 英文：THE UNCLAIMED VALUATION ROOM
- 引文：「无人认领的东西仍有价值。价值只说明它还欠这里什么。」
- 视觉：黑石与暗黄铜构成的地下估值柜台，中央是一台没有货币符号的机械定额计，桌面并排放着三只骨瓷证物匣；墙后格柜全部上锁，但每只锁孔里都亮着一只闭合的眼。

### 估值签

所有数值必须出现在世界观内的估值签上，不做独立游戏 HUD：

- `本批估值`：当前批次已经确认的总值。
- `封印完整`：当前批次剩余完整度，降到 0 立即破损。
- `本批定额`：达到后可以进入定额电梯。
- `最佳结算`：跨轮保存的最高结算值。
- `破损批次`：跨轮保存，只在估值签的小字与痕迹页出现。

### 两种入口条件

```text
entry=vault
初始估值 0 / 封印完整 5 / 定额 6

entry=shaft
初始估值 1 / 封印完整 4 / 定额 7
```

误报井的退件在账面上自带 1 点「退件溢价」，但封印更脆。两种入口都存在至少一条可达到定额且不会必然破损的路线。

直接 hash 进入采用 `entry=neutral`：

```text
初始估值 0 / 封印完整 5 / 定额 6
```

只展示本批三件证物，不自动估值、不自动结算。

## 六件证物

每批只出现三件，全部使用原生 button。未估值时只显示名称与不精确的征兆，不泄露准确数值；点中后立即翻成已估值状态、显示真实变化并锁定该证物。

### 1. 十三时钟 / `thirteenthClock`

- 基础估值：`+2`
- 封印损耗：`-1`
- 征兆：「钟面多出一格，秒针少走一次。」
- 效果：下一件证物的封印损耗减少 1，最低为 0；只作用一次。
- 反馈：「钟替下一件证物少活了一秒。」

### 2. 齿门钥 / `toothKey`

- 基础估值：`+3`
- 封印损耗：`-2`
- 征兆：「钥匙的齿形与这里每个人的牙都相同。」
- 效果：它是本批第几件被估值，就额外增加多少之前已经估值的件数；第一件无加成、第二件 `+1`、第三件 `+2`。
- 反馈：「钥匙记住了前面已经打开过几只匣子。」

### 3. 空神像 / `hollowIdol`

- 基础估值：`+4`
- 封印损耗：`-3`
- 征兆：「像内没有神，只有一个比外壳更大的空腔。」
- 效果：若作为本批第三件被估值，额外 `+2`。
- 反馈：「最后一只匣子打开后，空腔把前两件也算进了自己。」

### 4. 黑蜡肺 / `blackWaxLung`

- 基础估值：`+2`
- 封印损耗：`-2`
- 征兆：「它只在别人停止呼吸时起伏。」
- 效果：本批尚未估值的每件证物，之后各获得 `+1` 估值。
- 反馈：「肺替还没打开的匣子各吸进一点价值。」

### 5. 未睁之眼 / `unopenedEye`

- 基础估值：`+1`
- 封印损耗：`-1`
- 征兆：「眼皮内侧写着柜台正在隐瞒的数字。」
- 效果：本批剩余证物的准确基础估值、当前加成与预计封印损耗全部显示；不改变已经估值的证物。
- 反馈：「闭着的眼把剩余数字看得一清二楚。」

### 6. 无主回执骨 / `receiptBone`

- 基础估值：`+2`
- 封印损耗：`0`
- 征兆：「骨头两端都盖着退件章，中间没有身体。」
- 效果：若本批从误报回收井进入，额外 `+2`；其他入口无额外加成。
- 反馈：
  - shaft：「退件章被估值室当成了两次所有权转移。」
  - 其他入口：「没有收件人的骨头，被按普通附件计价。」

## 批次轮换

批次必须确定性生成，禁止裸随机。四行白名单如下：

```text
A = thirteenthClock / toothKey / hollowIdol
B = blackWaxLung / unopenedEye / receiptBone
C = thirteenthClock / blackWaxLung / hollowIdol
D = toothKey / unopenedEye / receiptBone
```

入口起始行：

```text
vault   → A
shaft   → B
neutral → C
```

后续按 `entryRow + cycle` 循环移位。要求：

- 每批恰好三件不同证物。
- 同一入口连续两批不得完全相同。
- 六件证物在多轮中都能出现。
- 刷新恢复当前三件、已估值顺序、每项实际收益、剩余封印和所有一次性效果。
- 状态里保存最终计算结果，而不是刷新时重新触发效果。

## 交互与结算

### 估值一件

点击一件未估值证物后：

- 最先被接受的点击立即锁定该证物，其他快速连点忽略。
- 先结算当前加成，再扣除经「十三时钟」修正后的封印损耗。
- 立即更新估值签与该证物的真实记录。
- normal motion 约 0.7–1.0 秒后解除批次锁，剩余证物可继续操作。
- reduced-motion 约 0.3 秒后解除，仍保留完整反馈。
- 这一步不切换页面，也不要求点击继续。

### 盖章结算

至少估值一件后，「盖章结算」按钮立即可用并保持在估值签旁。它不是继续按钮，而是主动止损：

- `本批估值 >= 本批定额`：自动进入 `#quota-elevator`。
- `本批估值 < 本批定额`：自动进入 `#return-passage`，展示一次「未满定额」反馈。

### 自动结算

- 封印完整降到 `0`：不再接受任何操作，立即记为破损批次并自动进入 `#false-positive-shaft`。
- 三件证物全部估值且封印仍大于 `0`：自动按是否达到定额结算，不再要求点击「盖章结算」。
- 每批只允许完成一次；刷新、返回和双击不能重复累计 `completedRuns / quotaMetRuns / underRuns / breachRuns`。

## 新区域二：定额电梯

- Hash：`#quota-elevator`
- 中文名：定额电梯
- 英文：THE QUOTA ELEVATOR
- 引文：「电梯只运送达到定额的东西。人必须被写在货物清单里。」
- 视觉：一座纵深极高的黑石货梯，轿厢里叠着被黄铜封条固定的骨瓷证物箱；楼层盘没有数字，只有一根指向墙内的红针；打开的三扇栅门分别通向不同方向。

三个动作全部点击后直接反馈并自动转场：

1. 「把满额证物送进无号货梯」
   - mark：`sentQuotaToVestibule`
   - 反馈：「货梯停在没有编号的一层，门比轿厢先打开。」
   - 自动去 `#unnumbered-vestibule`。
2. 「沿断开的楼层刻度横移」
   - mark：`crossedBrokenFloorScale`
   - 反馈：「红针指向墙内，回返夹道从刻度后面经过。」
   - 自动去 `#return-passage`。
3. 「让电梯穿过走廊天花板」
   - mark：`droppedQuotaIntoCorridor`
   - 反馈：「证物箱先落进经文，轿厢随后才找到楼层。」
   - 自动去 `#corridor`。

定额电梯只在当前 outcome 为 `quota` 或曾真实到访后允许直达；否则规范化回 `#unclaimed-valuation`。

## 回流反馈

### 未满定额回到回返夹道

只显示一次：

`估值室退回了这批东西。欠额被写在夹道背面。`

显示后消费 `outcome=under`，不重复出现，不替换 v31 原有动作与反馈。

### 封印破损回到误报回收井

进入误报井时显示一次：

`破损证物比工单先落到底部。回收井把裂口登记在你名下。`

显示后消费 `outcome=breach`，不替换 v33 原有四个动作。

## 状态与隔离

独立键：`goddead_v34_unclaimed_valuation`

建议状态形状：

```js
{
  visited: {
    valuation: false,
    quotaElevator: false
  },
  entry: "neutral",
  cycle: 0,
  batch: ["thirteenthClock", "blackWaxLung", "hollowIdol"],
  opened: [],
  ledger: [],
  value: 0,
  integrity: 5,
  quota: 6,
  nextDamageShield: 0,
  remainingValueBonus: 0,
  revealExact: false,
  active: false,
  outcome: "",
  bestSettlement: 0,
  completedRuns: 0,
  quotaMetRuns: 0,
  underRuns: 0,
  breachRuns: 0,
  marks: []
}
```

要求：

- `entry` 只接受 `neutral / vault / shaft`。
- `batch` 必须是白名单矩阵中的合法三项，不重复；错型按 entry/cycle 重建。
- `opened` 只接受 batch 内的唯一项，最多三件。
- `ledger` 只接受与 opened 顺序一一对应的已计算记录；每条保存实际 valueGain、damageTaken、effect，不在重载时重算。
- `value / integrity / quota / nextDamageShield / remainingValueBonus / bestSettlement / cycle / completedRuns / quotaMetRuns / underRuns / breachRuns` 都是有限非负整数并有安全上限。
- `outcome` 只接受空字符串、`quota / under / breach`。
- `marks` 只接受两个入口、三条电梯动作与六件证物标记，去重限长。
- 坏 JSON、数组错型、非法 batch、非法 ledger、`NaN`、`Infinity`、负数与超大数字安全回退。
- v34 代码不直接读写 v28–v33 或主线键；进入旧场景后由旧场景自己的生命周期正常记录到访，不算越界写入。

## 生命周期与首选锁

- 两个入口调用同一个 `startValuation(entry)`：生成新批次、递增 cycle、设置入口初值并清空本批 ledger/outcome。
- 正在进行的批次从目录或刷新进入时原位恢复。
- 已完成批次重新进入估值室时，以 neutral 开新批次。
- 每件证物只结算一次；估值锁、盖章锁和跨场景 AutoAdvance 使用清楚分开的 scope。
- 离开估值室清除所有反馈、解锁和转场 timer；旧 timer 不能把新批次拉回。
- 点击某件证物、盖章或电梯动作后，第一项被接受即锁定竞争动作。
- 直接 hash 只开启 neutral 批次，不自动估值、不自动结算。

## 目录与痕迹

首次真实访问后恢复目录：

- `01κ / 无主估值`
- `01λ / 定额电梯`

未访问保持 `hidden` 且不可聚焦。痕迹页只新增一行，不新增统计卡：

`无主估值：完成 N 批，满额 Q 批，破损 B 批，最佳结算 V。`

现有八张统计卡保持不变。

## 素材

监理交付八张 1536×1024 RGB 源 PNG，Kimi 只负责同尺寸 WebP 转码：

```text
design-references/source-unclaimed-valuation-room.png
design-references/source-valuation-thirteenth-clock.png
design-references/source-valuation-tooth-key.png
design-references/source-valuation-hollow-idol.png
design-references/source-valuation-black-wax-lung.png
design-references/source-valuation-unopened-eye.png
design-references/source-valuation-receipt-bone.png
design-references/source-quota-elevator.png
```

正式文件：

```text
assets/unclaimed-valuation-room.webp
assets/valuation-thirteenth-clock.webp
assets/valuation-tooth-key.webp
assets/valuation-hollow-idol.webp
assets/valuation-black-wax-lung.webp
assets/valuation-unopened-eye.webp
assets/valuation-receipt-bone.webp
assets/quota-elevator.webp
```

视觉要求：

- 八张图沿用 Goddead 当前黑石、暗黄铜、骨瓷、灰烬与极少暗红封印的统一语言。
- 六件证物图使用同一估值柜台、同一镜头高度、同一灯位和同一骨瓷匣框，只替换中央证物，方便玩家形成一眼可比较的图鉴。
- 图片内不出现可读文字、数字、现代货币符号、老虎机、水果图标或赌场元素。
- 每件证物的主体处在中心安全区；桌面 16:9 与移动窄裁切都能识别。
- 定额电梯保持纵深，但轿厢与三扇栅门不能小到失去可读性。

## 视觉与可访问性

- 桌面 1440×800：标题、估值签、至少第一件证物与盖章按钮位置首屏可达；三件证物的主选择不能藏在页面最底部。
- 移动 390×844：第一件证物按钮首屏可见；估值签可换行但不横向溢出；其他证物自然向下排列。
- 证物卡使用真实位图，不用 CSS/emoji/字符画替代。
- 已估值证物保留可见但不可重复触发，明确显示实际 gain/damage；不能直接消失导致玩家失去顺序信息。
- `未睁之眼` 只改变剩余卡片的文字信息，不靠闪屏或抖动表达。
- 封印破损、盖章和电梯动作都立即反馈并自动转场，不出现第二个继续按钮。
- 原生 button、合理 Tab 顺序、Enter/Space、focus-visible、静音、标题聚焦、滚动归顶、veil 生命周期与 reduced-motion 沿用现有契约。
- `aria-live` 只播本次估值或结算反馈，不连续重播累计账面。

## 测试与证据要求

Kimi 至少覆盖：

- 四行批次矩阵的三项唯一性、六件覆盖与连续轮换。
- vault / shaft / neutral 三入口初值。
- 六件证物的基础值、损耗与效果顺序。
- 十三时钟只减下一件一次、黑蜡肺只加尚未估值项、未睁之眼只揭示剩余项。
- 每件首选锁、盖章与证物竞争、快速连点、Enter/Space。
- 满额、欠额、破损、三件自动结算与主动盖章五条路径。
- 刷新恢复不重算 ledger、不重复累计批次数。
- 定额电梯守卫、三动作、未满/破损一次性回流反馈。
- 坏 JSON 与全部错型；v28–v33/主线字节级隔离。
- 忘记全部痕迹后 v34 键、目录和记忆同步清除。
- reduced-motion、离场清 timer、控制台零异常。

视觉证据至少：

```text
v34-01  估值室 vault 批次桌面 1440×1024
v34-02  估值室 shaft 批次桌面 1440×1024
v34-03  未睁之眼揭示剩余数字桌面
v34-04  定额电梯桌面
v34-05  估值室移动 390×844
v34-06  定额电梯移动 390×844
v34-07  短桌面 1440×800 首个证物 + 盖章位置
v34-08  目录 01κ / 01λ 恢复
v34-09  痕迹单行 + 8 卡
```

每张网页截图都要与对应监理源图或上一版同场景截图放在同一比较输入中目验，不以「截图文件存在」代替视觉 QA。

## Kimi 实现边界

Kimi K3 High 负责：

- 八张源 PNG 转正式 WebP。
- `index.html`、`styles.css`、`script.js` 的全部生产实现。
- `tests/site.test.mjs`、聚焦 smoke/visual 脚本、证据截图。
- README、`docs/ProgressLog.md` 与 `design-qa.md` 同步。

Kimi 不做：

- 不 commit、不 push。
- 不改 `docs/KimiUsageLog.md`。
- 不重构 v28–v33 或主线。
- 不自行新增终局、随机数、赌场视觉或第二个继续按钮。
