# v64 因果倒邮 / THE ENDING ARRIVED EARLY

## 目标

v64 从 v63 的「无终局」向前折返：玩家把已经发生的结局寄回故事最早的四个节点，让后果先于原因抵达。

- v63 的 12 个 coda、第 13 项 `unending`、两场景、目录与 `goddead_v63_ending_return` 内容保持不变；v64 只读合法 v63 派生结果。
- `unendingUnlocked === true` 后，Remembrance 的「无终局」图鉴出现可选入口「把无终局寄回最初」。
- 新增三场景：`causal-sorter`、`first-draft-vault`、`before-first-knock`，场景总数 89 → 92。
- 玩家先选择倒邮方式（签收 / 退回 / 误投），再选择故事早期落点（门外 / 守则 / 值夜 / 焚献），形成 3×4=12 个「提前后果」。
- 每种早期落点至少投递过一次后，初稿库开启「第零版」入口；第零版再提供三种零号结局。v64 共 15 项新图鉴，不设置真正终止页。
- 每次投递会在对应旧场景显露一枚可选的未来邮签；点击邮签可返回倒邮台继续组合，不改写旧场景已有按钮、文案、状态或守卫。

## 体验原则

- 选择即执行 → 一拍逐字反馈 → 自动转场；没有确认页、底部 continue 或必点下一步。
- 新场景的关键操作全部位于图片内，使用原生 `<button>`；旧场景只追加一个窄小但 ≥44px 的可选未来邮签，不覆盖旧按钮。
- 3 个方式、4 个落点、3 个零号动作都可重复组合；图鉴只首次解锁，运行计数每次合法到达均增加。
- click / Enter / Space、第一归宿锁、严格 pending、reload 重播、reduced-motion 与 forget-all 沿用项目现行契约。

## 场景与素材

三张源 PNG 与运行 WebP 均需 1536×1024、无裁切；最终文件信息由生图后回填并在测试中冻结。

| 场景 | 源图 | 源字节 | 源 sha256 | 运行图 | WebP 字节 | WebP sha256 |
| --- | --- | ---: | --- | --- | ---: | --- |
| 因果倒邮台 | `design-references/source-v64-causal-sorter.png` | 2,494,379 | `ad744696d74d071d7d920941f430af38500cdd6f9a6a35a4fbb8bc4315fad575` | `assets/v64-causal-sorter.webp` | 186,520 | `d735a3d7d828667c6440ea7f4599cd3fb98bd14f91f1ca392ec1117f320607dc` |
| 第一稿保管库 | `design-references/source-v64-first-draft-vault.png` | 2,405,228 | `3c582bf7c571a5f83320eff68459d8f810fc9dca10a29732048cfad85fcb4d7b` | `assets/v64-first-draft-vault.webp` | 184,454 | `291628a254fbb2de3dcc96cf51d797f208eee8743a665f9a8678cfbf3f5b12e9` |
| 第一敲之前 | `design-references/source-v64-before-first-knock.png` | 2,452,730 | `822210f72007bc4f0911c890690bac2663ee72d4ad5a57187e009cd09020e184` | `assets/v64-before-first-knock.webp` | 189,108 | `b8d7a0659174a7d22d476af29e542a6e755a80cfc89351d262d0aa64571896f7` |

### 生图提示摘要

- 因果倒邮台：黑石哥特邮务室，画面内恰好三台互不重叠的巨大装置——左侧黄铜未来邮戳机、中央倒转因果线轴、右侧三向误投棱镜；深黑 / 陈旧黄铜 / 暗红灯，正视宽景，无人物、无文字、无 UI。
- 第一稿保管库：高耸黑石档案库，画面内恰好四只分离的大型抽屉地标——门形抽屉、八页守则抽屉、03:17 钟面抽屉、焚献炉抽屉；后墙中央另有一张未点亮的零号空白卡槽；无人物、无文字、无 UI。
- 第一敲之前：尚未腐坏却已不安的黑金门厅，画面内恰好三件分离的可操作遗物——左侧从未拉响的黄铜铃绳、中央空白死亡登记书与压印台、右侧空椅上的无名访客牌；门仍闭合，神性微光正在熄灭；无人物、无文字、无 UI。

## 入口与准入

### Remembrance 入口

- 新按钮：`causal-mail-entry-btn`，文本 `把无终局寄回最初 ⟶`，放在 v63 `erc-unending` 内，不替换 v63 原图或三回路。
- 只在当前场景为 `remembrance` 且 `getEndingReturn().unendingUnlocked === true` 时显示并启用。
- 接受反馈：`无终局被卷成一封没有寄件日期的黑信。邮戳先落在了故事第一页。`
- 合法 entry pending 一拍后进入 `causal-sorter`；v63 不清空、不改写。

### 窄守卫

- `causal-sorter`：合法 entry / echo-return pending，或历史真实 visit 且 v63 `unendingUnlocked` 仍成立。
- `first-draft-vault`：合法 mode pending，或 `mode` 是当前 v63 已拥有的 action 类型且倒邮台真实到访。
- `before-first-knock`：合法 zero-entry pending，或历史真实 visit 且四个 destination 证据齐全。
- 任一守卫失败先回 `causal-sorter`；倒邮台也不合法则回 `remembrance`。不新增任何旧场景准入例外。

## 因果倒邮台 `causal-sorter`

- 标题：`因果倒邮台`
- 英标：`THE ENDING ARRIVED EARLY`
- 氛围句：`这里不寄信。这里只把后果寄到原因之前。`
- 图：`assets/v64-causal-sorter.webp`

方式只在 v63 至少拥有一个对应 action coda 时显示可用；例如仅有 `*:accept` 时只开放签收邮戳，鼓励继续收集 v63 的不同处理方式，但不阻塞已获得方式。

| mode | 按钮 id | 图中实体 | 短签 | 反馈 |
| --- | --- | --- | --- | --- |
| accept | `causal-mode-accept` | 左侧未来邮戳机 | 盖上未来邮戳 | `邮戳承认后果已经签收。现在只差一个更早的收件地址。` |
| return | `causal-mode-return` | 中央倒转线轴 | 抽回起因线 | `线轴从结局里抽出一根起因。它仍连着某个尚未发生的房间。` |
| misroute | `causal-mode-misroute` | 右侧误投棱镜 | 拨错第一地址 | `棱镜把第一页折成三个方向，第四个方向从背面亮起。` |

接受后写严格 mode pending，一拍进入 `first-draft-vault`；到达时保留可信 `mode` 并清 pending。

## 第一稿保管库 `first-draft-vault`

- 标题：`第一稿保管库`
- 英标：`THE FIRST DRAFT WAS NEVER FIRST`
- 氛围句：`每个房间都有一份比自己更早的草稿。这里保存被结局改过的版本。`
- 图：`assets/v64-first-draft-vault.webp`

### 四个旧场景落点

| destination | 按钮 id | 图中实体 | 短签 | 目标场景 |
| --- | --- | --- | --- | --- |
| threshold | `draft-target-threshold` | 门形抽屉 | 寄到第一敲 | `threshold` |
| protocol | `draft-target-protocol` | 八页守则抽屉 | 寄到其一之前 | `protocol` |
| watch | `draft-target-watch` | 03:17 钟面抽屉 | 寄到交班之前 | `watch` |
| offering | `draft-target-offering` | 焚献炉抽屉 | 寄到祷词之前 | `offering` |

第一拍锁死四落点和零号卡槽；到达目标旧场景的 before 中原子追加 outcome、`dispatchRuns + 1`、对应 `targetCounts + 1`、更新 `lastOutcome` / `activeEcho` 并清 mode / pending。旧场景原状态一字节不写。

### 12 个提前后果（逐字冻结）

| mode | threshold | protocol | watch | offering |
| --- | --- | --- | --- | --- |
| accept | **先到的回执 · RECEIPT BEFORE KNOCK**：你还没有敲门，门缝先吐出一张证明你已经进去过的回执。 | **守则先签收 · RULES RECEIVED FIRST**：八条守则在你阅读之前就记下了服从。违反记录因此早于你的名字。 | **提前交班 · SHIFT RECEIVED EARLY**：接班人先签了你的名字。等你到岗时，值夜已经算作一生。 | **祷告已焚 · PRAYER ALREADY BURNED**：炉里提前躺着一把灰，耐心等待那句尚未写出的祷告。 |
| return | **退回第一敲 · FIRST KNOCK RETURNED**：第一声敲门被退回手指。此后每根指骨都藏着一扇门。 | **退回其零 · RULE ZERO RETURNED**：不存在的第零条被退回，守则只好从其二开始假装完整。 | **退回 05:02 · 05:02 RETURNED**：05:02 被退回前一夜。清晨从此欠你一声电话铃。 | **退回祷词 · PRAYER RETURNED UNWRITTEN**：祷词还没有出口，舌根已经尝到它被焚后的灰。 |
| misroute | **错投门内 · KNOCK MISROUTED INSIDE**：敲门声被投到门内。门向外打开，像是里面的你终于肯放你进来。 | **错投守则 · PROTOCOL MISADDRESSED**：另一个访客替你遵守了规则，惩罚却准确寄到了你的影子。 | **错投交班 · SHIFT MISROUTED**：你的值夜被寄给一个没有夜晚的白昼。那里的影子开始替你疲倦。 | **错投神前 · PRAYER MISROUTED BEFORE GOD**：祷告抵达神还活着的那天。祂的回答绕了一圈，变成自己的讣告。 |

outcome id 固定 `${mode}:${destination}`。旧场景显示逐字 narrative，并出现对应未来邮签：

| 旧场景 | 邮签 id | 文本 |
| --- | --- | --- |
| threshold | `causal-echo-threshold` | `沿门缝的未来邮戳回去 ⟶` |
| protocol | `causal-echo-protocol` | `把第零条退回倒邮台 ⟶` |
| watch | `causal-echo-watch` | `把提前的班交回去 ⟶` |
| offering | `causal-echo-offering` | `沿未写祷词的灰回去 ⟶` |

邮签只在 `activeEcho.target` 命中当前场景时显示；真实点击写 echo-return pending，一拍回 `causal-sorter`，到达时清 `activeEcho`。离开旧场景不强制清理，reload / 回访可继续看到邮签。

零号结局 `file-death` 的目标是 `remembrance`。此处不新增第 17 组监听：复用 `causal-mail-entry-btn` 及其同一个 listener。`activeEcho.target === "remembrance"` 时，按钮文案临时切为 `把预先死亡退回倒邮台 ⟶`，单击按 echo-return 处理；清掉 activeEcho 后恢复入口原文。五个目标场景都必须在邮签旁逐字显示当前 `activeEcho.feedback`，不能只显示通用返程按钮。

## 第零版入口

四种 destination 各至少有一个合法 outcome 后派生 `zeroEligible === true`：

- 第一稿保管库后墙零号卡槽按钮 `draft-target-zero` 显示可用，短签 `抽出第零版`。
- 反馈：`四份第一稿互相否认谁先写成。中央空槽因此吐出一张编号为零的门票。`
- 合法 zero-entry pending 一拍进入 `before-first-knock`；首次到达只记真实 visit 并清 pending，不自动选择零号结局。

## 第一敲之前 `before-first-knock`

- 标题：`第一敲之前`
- 英标：`BEFORE THE FIRST KNOCK`
- 氛围句：`神还没有死。门也还不知道自己会活得更久。`
- 图：`assets/v64-before-first-knock.webp`

| action | 按钮 id | 图中实体 | 短签 | outcome / 反馈 | 目标 |
| --- | --- | --- | --- | --- | --- |
| answer | `zero-action-answer` | 左侧未响铃绳 | 让神提前回答 | **未死回声 · THE GOD ANSWERED TOO EARLY**：铃声赶在死亡之前抵达。神回答了，但声音已经学会用遗言说话。 | threshold |
| file-death | `zero-action-file-death` | 中央空白死亡登记书 | 预先归档死亡 | **预先死亡 · DEATH FILED IN ADVANCE**：死亡先被盖章，神只好继续活着，等待档案追上事实。 | remembrance |
| take-seat | `zero-action-take-seat` | 右侧空椅访客牌 | 先于来访入座 | **先于来访 · VISITOR BEFORE ARRIVAL**：访客牌先认出了你。等你真正来到门外，座位已经替你等了很多年。 | protocol |

到达目标 before 中首次追加 zero outcome，并令 `zeroRuns + 1`、更新 `lastOutcome`；重复选择仍记运行次数但不重复图鉴。目标旧场景使用同一 `activeEcho` / 邮签返回机制。

## v64 状态契约

独立 key：`goddead_v64_causal_mail`，`version: 64`。

```json
{
  "version": 64,
  "visited": { "sorter": false, "vault": false, "before": false },
  "mode": "",
  "outcomes": [],
  "zeroOutcomes": [],
  "dispatchRuns": 0,
  "zeroRuns": 0,
  "targetCounts": { "threshold": 0, "protocol": 0, "watch": 0, "offering": 0 },
  "lastOutcome": "",
  "activeEcho": null,
  "pending": null
}
```

- 只持久化上述 11 个 canonical 字段；`pendingTarget`、`availableModes`、`zeroEligible`、总解锁数与显示文案全部派生。
- 坏 JSON、数组、错 version → 默认；计数非负整数、封顶 9999。
- `mode` 只接受 accept / return / misroute 或空串，且必须由当前合法 v63 coda 重新证明可用。
- outcomes 只接受 12 个 `${mode}:${destination}`；zeroOutcomes 只接受 answer / file-death / take-seat；均去重并按固定表排序。
- `activeEcho` 精确 `{target, mode, outcome, feedback}` 四键，目标 / outcome / feedback 必须能从已解锁记录逐字重算；零号 outcome 的 mode 固定 `zero`。
- pending 只允许 entry / mode / dispatch / zero-entry / zero / echo-return 六类精确键集，额外键即伪造；目标、反馈、方式、落点和 outcome 全部逐字重算。
- 所有结果只在目标到达 before 原子结算；reload 只恢复反馈、锁定与一次转场，不双计。

## pending 精确键集

| kind | 精确键 | 关键证据 |
| --- | --- | --- |
| entry | feedback, kind, target | v63 unendingUnlocked；target=causal-sorter |
| mode | feedback, kind, mode, target | mode 当前可用；target=first-draft-vault |
| dispatch | destination, feedback, kind, mode, outcome, target | mode 同源；outcome / target / feedback 逐字 |
| zero-entry | feedback, kind, target | 四 destination 证据齐全；target=before-first-knock |
| zero | action, feedback, kind, outcome, target | zeroEligible + before visit；路由与反馈逐字 |
| echo-return | feedback, from, kind, target | activeEcho.target=from；from 允许 threshold / protocol / watch / offering / remembrance；target=causal-sorter |

## 目录 / 痕迹 / 图鉴 / 遗忘

- 目录：`03γ / 因果倒邮`、`03δ / 第一稿库`、`03ε / 第一敲前`，仅真实到访后显示。
- Remembrance 新增单行：`因果倒邮：投递 D 次，零号改写 Z 次；门外 T / 守则 P / 值夜 W / 焚献 O；已发现 N/15。`
- v64 独立图鉴：3×4 提前后果 + 3 个零号结局；至少一项解锁后显示，未知项只显示 `？？？`。
- v63 图鉴与 13 项不改；v64 图鉴位于其后。
- forget-all 移除 v64 key，并让入口、目录、记忆、图鉴、新三场景、四旧场景邮签与 aria/pressed/disabled/hidden 状态全部回弹。

## 热点坐标建议

以 1536×1024 舞台百分比 `top / left / width / height`：

- 因果倒邮台：accept 28 / 3 / 29 / 60；return 24 / 36 / 28 / 64；misroute 27 / 69 / 28 / 61。
- 第一稿库：threshold 34 / 2 / 22 / 52；protocol 33 / 26 / 22 / 53；watch 34 / 51 / 22 / 52；offering 33 / 76 / 22 / 53；zero 4 / 39 / 22 / 27。
- 第一敲之前：answer 31 / 3 / 28 / 57；file-death 27 / 36 / 29 / 61；take-seat 31 / 69 / 28 / 57。
- 同图热点不得重叠；移动端 44px 增长后仍需零重叠、自命中且无横向溢出。

## QA 契约

1. 3 源 PNG + 3 WebP 哈希、1536×1024、WebP 100–350KB、缓存 `v=63 → v=64`。
2. v63 的 12+1、两场景、三个回路、存储内容与守卫不改；v64 只读合法 v63 派生结果，绝不写旧 key。
3. 12 提前后果 + 3 零号结果逐字冻结；id 白名单、固定排序、重复不增图鉴。
4. v64 11 字段显式 canonical 投影；六类严格 pending；activeEcho 四键防伪；到达原子；reload 不双计。
5. 入口（同时复用为 remembrance echo-return）+ 3 mode + 4 destination + zero-entry + 3 zero + 4 旧场景 echo-return 共 16 组监听，只接受 `isTrusted` click；合成 `.click()` 零副作用。
6. 三新场景完整接入 SCENES / hash / sceneInit / 守卫 / 目录 / Remembrance / forget-all；89 → 92。
7. 四旧场景只追加 v64 邮签与反馈，不改旧按钮 id、文案、状态 key、守卫或现有转场。
8. 图内按钮全部 ≥44px、focus 可见、键盘可用、reduced-motion 约 300ms、桌面与 390×844 零重叠/自命中/无横向溢出。
9. `node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`、`git diff --check` 全绿；真实浏览器至少覆盖 entry→mode→dispatch→旧场景邮签→sorter、四目标开第零版、三零号路由、reload、竞态、坏档、forget-all 与 console。

## 验收结果

- 2026-08-09 静态四门结果：
  - `node --check script.js`：通过
  - `node --check tests/site.test.mjs`：通过
  - `node tests/site.test.mjs`：5070 断言全绿
  - `git diff --check`：通过
- 真实浏览器 QA（部分通过）：
  - 生产页 `http://127.0.0.1:4173` 直接访问 `#causal-sorter` / `#first-draft-vault` / `#before-first-knock`，三者均被守卫改写到 `#remembrance`。
  - 隔离种子页 `http://127.0.0.1:4174`：桌面 1280×720 下三幕无热点重叠、无横向溢出，三张 WebP 均 complete 且 `naturalWidth×naturalHeight=1536×1024`；手机版 390×844 下 `scrollWidth=390`、无热点重叠，热点尺寸分别：倒邮台宽 96–100 / 高 132–140，保管库宽 76 / 高 59–116，第一敲前宽 96–100 / 高 125–134，全部宽高 ≥44。
  - 种子状态下 `#remembrance` 显示入口「把无终局寄回最初 ⟶」与 4/15；`accept:threshold` activeEcho 在 `#threshold` 精确显示「你还没有敲门，门缝先吐出一张证明你已经进去过的回执。」且未来邮戳按钮可见；`file-death` activeEcho 在 `#remembrance` 精确显示「死亡先被盖章，神只好继续活着，等待档案追上事实。」，入口变为「把预先死亡退回倒邮台 ⟶」，记忆显示 5/15。
  - 浏览器控制台 warning / error 日志为 0。
  - 由于 16 个 v64 点击监听严格要求 `e.isTrusted`，Playwright 与 Codex Computer Use 自动点击均被拒绝；受保护的正向真人点击、延迟跳转与刷新恢复仍待真人手动验收，不能视为全链路通过。
