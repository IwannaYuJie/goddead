# Goddead v33 设计：异常复核科 / THE OFFICE OF ANOMALY REVIEW

## 目的

v31 与 v32 已经把门外、守则和门内副楼扩成可绕行的前段网络。v33 不继续堆单次经过的房间，而是在这张网络里加入一条可重复、会变化、会记分的互动支线：

- 三间 v32 副楼都能把眼前的异常送进复核科。
- 玩家连续处理三份视觉档案，判断「存在异常」或「维持原案」。
- 每次判断立即反馈并自动换到下一份档案，不出现第二个继续按钮。
- 正确数、连续复核和误报会把玩家送往不同的新区域。
- 重进复核科时档案顺序与异常组合轮换，避免第一次走完后完全失去内容。
- 这仍是进入主线前的可选支线，不新增结局，也不修改 v28 治理终局。
- 代码、测试与 QA 全部由 Kimi K3 High 完成；监理只交付世界观、源素材与验收。

## 参考机制与原创转译

只借机制，不复制任何现成场景、怪物、文案、界面或关卡：

- [The Exit 8 on Steam](https://store.steampowered.com/app/2653790/8/?l=english)：反复观察相似空间，依据有没有异常决定前进或折返。v33 转译为官僚档案的「异常 / 原案」复核。
- [Home Safety Hotline on Steam](https://store.steampowered.com/app/2357910/Home_Safety_Hotline/)：阅读档案并为来电内容做分类，判断错误会产生后果。v33 转译为复核值、误报和两种结果房。
- [WORLD OF HORROR on Steam](https://store.steampowered.com/app/913740/WORLD_OF_HORROR/)：多周目中事件组合变化。v33 只借轮换思想，用固定白名单与确定性顺序保证可测试、可恢复。

## 前段接线

三间 v32 副楼各新增一个清楚可见的第四动作。不得做成无标签、无法发现的透明热点：

```text
闭目档案室
└─ 把一只没有睁开的眼送去复核 ─→ 异常复核科（entry=eyelid）

无号前厅
└─ 提交一扇没有编号的门 ───────→ 异常复核科（entry=vestibule）

逆向阶井
└─ 申报一段同时向上的下行梯 ───→ 异常复核科（entry=stairwell）
```

原有九个 v32 动作、反馈、目的地与 mark 全部保留。新增动作只附加入口，不替换旧动作。

## 新区域一：异常复核科

- Hash：`#anomaly-review`
- 中文名：异常复核科
- 英文：THE OFFICE OF ANOMALY REVIEW
- 引文：「复核不是寻找错误。复核是决定哪一份现实继续生效。」

### 素材

六张源 PNG 由监理提供，Kimi 只负责同尺寸 WebP 转码：

- `design-references/source-anomaly-review-baseline.png`
- `design-references/source-anomaly-review-aperture.png`
- `design-references/source-anomaly-review-rail.png`
- `design-references/source-anomaly-review-shadow.png`
- `design-references/source-anomaly-evidence-vault.png`
- `design-references/source-anomaly-false-positive-shaft.png`

正式文件：

- `assets/anomaly-review-baseline.webp`
- `assets/anomaly-review-aperture.webp`
- `assets/anomaly-review-rail.webp`
- `assets/anomaly-review-shadow.webp`
- `assets/anomaly-evidence-vault.webp`
- `assets/anomaly-false-positive-shaft.webp`

四张复核科图片必须保持同一机位、同一房间、同一照明和同一构图，变化只发生在档案内容：

1. `baseline`：所有档案孔关闭、抽屉齐平、测量轨道正常，是唯一「维持原案」的档案。
2. `aperture`：远墙一个关闭的档案孔出现在不可能的位置，且少了一只对应抽屉。
3. `rail`：一段黄铜测量轨道在墙面绕回自己的起点，形成没有接口的闭环。
4. `shadow`：中央复核灯的影子逆着光源，桌下比桌上多出一枚封印。

异常应能通过认真观察发现，但不能靠闪烁、抖屏或计时逼迫。移动端裁切也必须保留关键变化。

### 三轮复核

每轮只出现两个原生按钮：

1. 「登记为异常」
2. 「维持原案」

点击或键盘激活后：

- 立即锁定本轮第一项选择。
- 立即显示本轮反馈并更新账面数值。
- normal motion 约 0.7–1.0 秒后自动换下一份档案。
- reduced-motion 约 0.3 秒后换档，仍保留反馈。
- 第三轮完成后自动进入结果房，不要求再点继续。

正确反馈：

- 异常判定正确：「档案边缘渗出一条新编号。复核值 +1。」
- 原案判定正确：「房间保持原样。你第一次因为没看见而被记录。」

错误反馈：

- 把原案误报为异常：「复核科收走你的确信。误报 +1。」
- 漏掉异常：「变化没有消失，只是被登记成了你。」

### 数值

用一块在世界观内的复核签显示，不做突兀的游戏 HUD：

- `复核值`：本轮正确判断数，0–3。
- `连续复核`：当前连续正确数，答错归零。
- `误报`：本轮错误数，0–3。
- `最佳连续`：跨轮保存，只在复核签与痕迹页显示。

### 档案轮换

每轮固定处理三份档案，其中恰好包含一份 `baseline` 与两份不同异常。顺序由「入口来源 + 已完成轮数」从白名单矩阵中确定，禁止使用不可复现的裸随机：

```text
eyelid + cycle 0      → baseline / aperture / rail
vestibule + cycle 0   → shadow / baseline / aperture
stairwell + cycle 0   → rail / shadow / baseline
neutral/direct hash   → aperture / baseline / shadow
```

后续 cycle 对矩阵循环移位。要求：

- 四种档案在多次复核中都会出现。
- 同一个入口连续两次进入，不得得到完全相同的顺序。
- 刷新后恢复当前轮次、当前档案、已记分结果，不重复记分。
- 离场清除计时器，不会被旧的自动换档拉回。

### 结果分流

第三轮判断完成后自动分流：

- `复核值 = 3`：进入 `#evidence-vault`。
- `复核值 = 2`：按本轮入口回到对应副楼，但解锁一次「已复核」反馈；不是失败，也不进入结果房。
- `复核值 ≤ 1`：进入 `#false-positive-shaft`。

两分路径让普通玩家仍能继续前段探索；满分与低分各有独立新区域，形成真正不同的互动流程。

## 新区域二：异常保全库

- Hash：`#evidence-vault`
- 中文名：异常保全库
- 英文：THE EVIDENCE PRESERVATION VAULT
- 引文：「被证明存在的异常，不再属于现实；它属于证物。」
- 视觉：黑石保全库里悬着三只骨瓷证物匣，每只都封着一道仍在变化的空间切片；黄铜封条从天花板垂下，地面没有灰尘。

三个动作：

1. 「封存最清楚的一处异常」
   - mark：`sealedClearestAnomaly`
   - 反馈：「证物匣闭合时，闭目档案室少了一只眼。」
   - 自动去 `#eyelid-archive`。
2. 「把原案退回无号前厅」
   - mark：`returnedBaselineToVestibule`
   - 反馈：「没有编号的门拒绝签收，于是把自己打开。」
   - 自动去 `#unnumbered-vestibule`。
3. 「沿保全编号的断口离开」
   - mark：`leftThroughBrokenSeal`
   - 反馈：「编号在中途断裂，断口后面是经文走廊。」
   - 自动去 `#corridor`。

## 新区域三：误报回收井

- Hash：`#false-positive-shaft`
- 中文名：误报回收井
- 英文：THE FALSE-POSITIVE SHAFT
- 引文：「错误报告不会销毁。它们会被送回报告者体内。」
- 视觉：一口纵深极黑的行政回收井，数百张作废工单沿螺旋轨道缓慢下坠；井壁嵌着黄铜退件槽，最底部反射出站在井口的人，但场景里没有人。

三个动作：

1. 「捡回一张被判错的工单」
   - mark：`retrievedRejectedCase`
   - 反馈：「工单背面已经换了一套异常。复核重新开始。」
   - 开启新 cycle 并自动回 `#anomaly-review`。
2. 「把误报写进守则附录」
   - mark：`appendedFalseReport`
   - 反馈：「守则新增一条：凡看错者，视为看见。」
   - 自动去 `#protocol`。
3. 「承认自己是多出来的一项」
   - mark：`admittedExtraItem`
   - 反馈：「回收井退回你的名字，把人送到门外。」
   - 自动去 `#threshold`。

## 状态与隔离

独立键：`goddead_v33_anomaly_review`

建议状态形状：

```js
{
  visited: {
    review: false,
    evidenceVault: false,
    falsePositiveShaft: false
  },
  entry: "neutral",
  cycle: 0,
  order: ["aperture", "baseline", "shadow"],
  round: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  mistakes: 0,
  completedRuns: 0,
  vaultEntries: 0,
  shaftEntries: 0,
  decisions: [],
  outcome: "",
  marks: []
}
```

要求：

- `entry` 只接受 `neutral / eyelid / vestibule / stairwell`。
- `order` 必须是白名单中的三项合法组合，恰含一个 baseline 与两个不同异常；错型时按 entry/cycle 重建。
- `round` 裁剪 0–3；`correct / streak / bestStreak / mistakes / cycle / completedRuns / vaultEntries / shaftEntries` 均为有限非负整数并有安全上限。
- `decisions` 只接受三项以内的合法 `{caseId, choice, correct}` 记录，去重并与 round 一致。
- `marks` 只接受本文件列出的九个入口/结果房动作标记，去重限长。
- 坏 JSON、数组错型、非法 order、非法 outcome、`NaN`、`Infinity`、负数与超大数字安全回退。
- 不读写 v28–v32 与主线状态；回归前后做字节级快照。

### 新一轮与结果房守卫

- 从任一 v32 副楼入口或误报井「捡回工单」进入时调用单一 `startReview(entry)`：递增 cycle，清空本轮 round/分数/decisions/outcome，再从白名单生成 order。
- 目录再次进入已完成的复核科时，以 neutral 开一轮新档案；正在进行的轮次则原位恢复。
- 第三轮只允许结算一次：递增 completedRuns，并按结果至多递增一次 vaultEntries 或 shaftEntries。
- `#evidence-vault` 只在本轮 outcome 为 vault 或曾到访保全库后允许直达；否则规范化回 `#anomaly-review`。
- `#false-positive-shaft` 只在本轮 outcome 为 shaft 或曾到访误报井后允许直达；否则规范化回 `#anomaly-review`。
- 两分回副楼时 outcome 记为 returned，按 entry 返回；neutral 则回 `#eyelid-archive`，不开放结果房。

## 首选锁定与生命周期

- 三处新增入口、每轮判断与两个结果房都使用当前 `AutoAdvance` 语义。
- 每轮第一项判断一旦接受，鼠标、Enter、Space、快速连点及另一个按钮全部忽略。
- 轮内换档与跨场景转场使用不同 scope，离场时全部清除。
- 刷新只恢复状态，不续跑已经丢失的 timer；重新进入时根据 `round` 显示正确档案。
- 完成第三轮后，结果只落一次；刷新、后退再进不得重复增加 cycle 或数值。
- 直接 hash 进入复核科采用 neutral 顺序，只展示第一份档案，不自动判断。

## 目录与痕迹

首次访问后恢复目录：

- `01η / 异常复核`
- `01θ / 异常保全`
- `01ι / 误报回收`

未访问保持 `hidden` 且不可聚焦。痕迹页只新增一行，不新增统计卡：

`异常复核：完成 N 轮，最佳连续 M，保全 X 次，误报回收 Y 次。`

现有八张统计卡保持不变。

## 视觉与可访问性

- 源 PNG 统一 1536×1024；Kimi 转同尺寸 WebP，建议 quality 85，源 PNG 保留。
- 复核科四张图必须用相同机位；切换时只做短交叉淡化，不位移、不放大，避免玩家把动画误判为异常。
- 桌面 1440×800：标题、复核签、档案图和两个判断按钮首屏可操作。
- 移动 390×844：关键异常仍处在安全裁切区，至少第一个判断按钮首屏可见。
- 两个判断按钮都是原生 button；Tab 顺序和视觉顺序一致，Enter/Space 均可触发。
- `aria-live` 只播当前判断反馈，不连续重播累计值；档案图 alt 只描述空间，不直接泄露正确答案。
- hover/focus 不换档、不记分；focus-visible、静音、标题聚焦、滚动归顶和 veil 生命周期沿用现有契约。
- reduced-motion 禁用图片交叉动画，但不跳过反馈。

## Kimi 实现边界

Kimi K3 High 负责：

- 六张源 PNG 转正式 WebP。
- `index.html`、`styles.css`、`script.js` 的全部生产实现。
- `tests/site.test.mjs`、聚焦 smoke/visual 脚本、证据截图。
- README、`docs/ProgressLog.md` 与 `design-qa.md` 同步。

Kimi 不做：

- 不 commit、不 push。
- 不改 `docs/KimiUsageLog.md`。
- 不重构 v28–v32 或主线。
- 不用占位图、内联 SVG、CSS 绘图或文字方框代替六张正式素材。
- 不把判断改成倒计时反应游戏。
- 不新增结局。

## 验收清单

1. 三间 v32 副楼各新增一个可见入口，原九动作逐字、目的地和 mark 不变。
2. 四份档案图同机位，baseline 与三种异常的差异符合设计，移动裁切仍可判断。
3. 每轮恰三份档案，恰含一份 baseline 与两份不同异常；四种档案可在多轮出现。
4. 两按钮判断、反馈、自动换档、第三轮自动分流，全程没有第二个继续按钮。
5. 正确数、连续值、误报、最佳连续计算准确；答错重置 streak。
6. 3 分进保全库、2 分回入口副楼、0–1 分进误报井。
7. 保全库与误报井各三动作、目的地、反馈和首选锁定准确，无死路。
8. 同入口连续两轮顺序不同；刷新恢复当前轮，已接受判断不重复记分。
9. 快速点击、两按钮竞争、Enter/Space 重复事件只接受第一项。
10. 离场、后退、目录跳转、刷新均无幽灵换档或幽灵转场。
11. 直接 hash 进入复核科只展示 neutral 第一案，不自动选择；结果房守卫与目录恢复准确。
12. v28–v32 与主线状态快照字节级不变。
13. 坏 JSON、错型 order、非法 decisions、非法 outcome 与溢出数值安全回退。
14. 痕迹页只新增一行，统计卡仍为八张。
15. 桌面、短桌面和移动端无横向溢出、无遮挡、首个核心操作可见。
16. 键盘、focus-visible、aria-live、reduced-motion、标题聚焦、滚动归顶、静音和控制台通过。
17. 六张 WebP 存在、尺寸和引用正确，六张源 PNG 保留。
18. `node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全绿。
