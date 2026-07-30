# v52 副楼三债结算 / ANNEX DEBT SETTLEMENT

## 目标

v51 的见证、失号、逆行不再只是「到 3 解锁一次异常」，而成为可重复使用的结算容量。v52 不接一条单向长走廊，而是把三间副楼、三种债值和现有分支网连成可重玩的分流器：

- 容量来自既有积累：每类本轮可投入容量 = `floor(v51 对应 debt / 3)`（0..3），只读 v51，绝不减少或改写 v51 state。
- 总容量达到 3 才解锁 v52；之后可以一轮一轮地合签、投入、结算。
- 四种结算落点把 v46/v47/v48/v31/v35/v39/v32 的既有房间重新接通，balanced 稀有路线落到 v42 巡查台。

灵感是异常观察、线索归类与不确定判断；不复制任何现成游戏文本或角色。

## 四个新场景与素材

| 场景 | hash | 正式图 | 源 PNG（保留） |
| --- | --- | --- | --- |
| 副楼债务结算所 | `#annex-clearinghouse` | `assets/annex-debt-clearinghouse.webp` | `design-references/source-v52-annex-debt-clearinghouse.png` |
| 无归见证席 | `#unreturned-witness-gallery` | `assets/unreturned-witness-gallery.webp` | `design-references/source-v52-unreturned-witness-gallery.png` |
| 零前登记库 | `#registry-before-zero` | `assets/registry-before-zero.webp` | `design-references/source-v52-registry-before-zero.png` |
| 倒诉阶 | `#descending-appeals-stair` | `assets/descending-appeals-stair.webp` | `design-references/source-v52-descending-appeals-stair.png` |

四张源 PNG（1536×1024，冻结，禁止重生成）经 Pillow q85 无裁切转码 WebP。全部 figure 复用 v49 的 `.forecourt-tactile-stage` 固定 3:2 舞台与 `.forecourt-native-hotspot` 原生热点样式，桌面、1440×800 短桌面与 390×844 移动共用一套百分比坐标，首屏可看见画面与可用交互，不做图片下方卡片墙。

## 入口与容量

- v51 三种 debt 仍是 0..9 的累计值，v52 只读取（`settleCapacity()` 读 `getDebts().debts`，全模块不出现 `DEBTS_KEY`/`saveDebts`）。
- 每类本轮容量 = `floor(debt / 3)`，所以每种 0..3；总容量 >= 3 才解锁（`settleUnlocked()` 实时重算）。
- 「合签三债」原生按钮嵌在三副楼刻痕牌内（`#eyelid-settle-entry` / `#vestibule-settle-entry` / `#stairwell-settle-entry`），牌体 `pointer-events:none`、入口自身 `pointer-events:auto`；只有总容量 >= 3 时移除 `hidden`。不挤压、不覆盖、不隐藏现有 16 个热点（13 旧动作 + 3 阈值异常），与场景 first-lock 共用（`AutoAdvance.has(sceneKey)`）。
- 点击立即给逐字反馈「三债同签。结算所开门，点清你带来的刻痕。」并自动进 `#annex-clearinghouse`，无继续按钮。
- 未达门槛：按钮 `hidden`、不可聚焦，处理器在 `currentScene` / `settleUnlocked()` / first-lock 三重校验前零副作用，合成 click 无效。
- 守卫（`resolveScene`）：
  - `#annex-clearinghouse`：总容量 < 3 → 回退 `eyelid-archive`。
  - 三间结果房：只有本轮对应合法结果（`settled && outcome` 实时派生一致）或历史 visit 才准入，否则回 `#annex-clearinghouse`（不够资格再由上一条回退 `eyelid-archive`）。

## 结算所玩法

- 图中三个清晰机关即原生 hotspot：左侧眼形印 = 投入见证（`#settle-deposit-witness`），中央空白瓷盘 = 投入失号（`#settle-deposit-unnumbered`），右侧逆阶模型 = 投入逆行（`#settle-deposit-reverse`）。
- 每轮正好投入 3 枚债印。按钮可重复点；同类本轮投入数不得超过该类实时容量，达到容量即 `disabled` + `aria-pressed` 正确反映。
- 每次合法投入只记一次（live scene + first-lock + settled/长度/实时容量三重拒绝，快速 click/Enter/Space 同拍不重复计数），立即更新图中三行实体凹槽（`.settle-tray`，三行各 3 个独立 `.st-slot` 元素，`role="img"` aria-label 逐字报「见证凹槽 已投 N 枚，本轮容量 M 枚」）并给短反馈；不弹确认框、不需要下一步。
- 第三枚投入后立即派生 outcome、累计历史、持久化 settle pending，保留反馈一拍（约 0.9–1.2s，reduced-motion 约 0.3s）自动结算：
  - witness 严格多数（≥2）→ `#unreturned-witness-gallery`
  - unnumbered 严格多数 → `#registry-before-zero`
  - reverse 严格多数 → `#descending-appeals-stair`
  - 恰好 1/1/1 → 稀有 balanced → 现有 `#protocol-drift`。
- balanced 与 v42：v42 设计上直 hash `#protocol-drift` 始终允许（不自动作答），因此 v52 balanced 与干净直 hash 走同一条既有路径，**没有加宽任何入口**，也无需 guard 例外；v52 全模块不读不写 `goddead_v42_protocol_drift`，不篡改 v42 cycle/state。
- 三枚之前刷新：`allocations` 原样恢复投入顺序与剩余容量（凹槽与按钮状态重绘）。
- 第三枚后的反馈拍刷新：合法 settle pending 重播逐字反馈并只重建一次目标转场（timer `before` 里才清 pending）。
- 离场清 timer（`AutoAdvance` 场景作用域）；伪造 `allocations` 按「长度 <= 3、白名单、每类不超实时容量、合法连续前缀」归一，非法部分截断；`settled`/`outcome` 永远由 allocations 派生重算，伪造 state 进不了结果房。
- 已结算后，从三间副楼再次点「合签三债」开启新 cycle（`cycle + 1`、allocations 清空、settled/outcome 复位），历史统计跨 cycle 保留；进行中的 cycle 原样续投。

## 结果房九个画面热点与逐字语义

无归见证席（左声筒 / 中央眼印 / 右镜面空椅）：

- 倾听未归证词（`#settle-gallery-action-horn`）→ `#unseated-listening-booth`：「蜡筒没有录下声音，只把你听见它的那一刻倒放了一遍。」
- 盖下闭眼证章（`#settle-gallery-action-seal`）→ `#witness-carbon-archive`：「印章闭着眼落下，复写纸却多出一位未曾到场的见证人。」
- 坐上镜面证席（`#settle-gallery-action-chair`）→ `#eyelid-archive`：「椅背没有映出脸。档案柜却为你的后脑开了三只眼。」

零前登记库（左空牌 / 中压印机 / 右无号门）：

- 摘下零前空牌（`#settle-registry-action-plate`）→ `#glyph-niche`：「牌面比零更早，所以所有数字都从它身后绕行。」
- 压印空白底册（`#settle-registry-action-press`）→ `#blank-receipt-press`：「压印机落下时没有留下字，只把空白压得更深了一层。」
- 进入未编号的登记门（`#settle-registry-action-door`）→ `#unnumbered-floor`：「门没有编号。你跨过去以后，身后的楼层先被注销。」

倒诉阶（左镜 / 中倒置法槌 / 右无声钟）：

- 触碰反向阶镜（`#settle-appeals-action-mirror`）→ `#reverse-stairwell`：「镜里的你先走完了楼梯，才回头等你的第一步。」
- 扳动倒置法槌（`#settle-appeals-action-gavel`）→ `#return-audit`：「法槌从桌底向上落下，把你的归路判成了一次上诉。」
- 摇响无声阶钟（`#settle-appeals-action-bell`）→ `#bellless-ward`：「钟体摇了三次。病房里每张床却同时回答了第四声。」

九个动作均为真实图中物件上的原生 button，鼠标/Tab/Enter/Space 可达，最小 44px，第一输入锁（接受后同场景三热点 disabled），逐字反馈，约 0.9–1.2 秒自动转场，reduced-motion 约 0.3 秒，无确认/继续按钮；处理器在任何状态读写、反馈、音效、timer 之前校验 live scene，合成点击隐藏 DOM 零副作用。

既有 guard 例外：九个目标里只有 `#glyph-niche` 有直 hash 守卫（v31 forecourt guard）。新增唯一窄例外 `lastScene === "registry" && lastAction === "plate"`——只允许这一次合法落点，普通直 hash 不变；其余八个目标本无守卫，直达语义保持原样。

## 状态合同（`goddead_v52_annex_settlement`）

```json
{
  "cycle": 0,
  "allocations": ["witness", "unnumbered"],
  "settled": false,
  "outcome": "",
  "pending": null,
  "visited": { "house": false, "gallery": false, "registry": false, "appeals": false },
  "history": { "witness": 0, "unnumbered": 0, "reverse": 0, "balanced": 0 },
  "actions": { "gallery-horn": 0, "…": "九个动作计数" },
  "lastScene": "",
  "lastAction": ""
}
```

- 坏 JSON / 数组 / 错误类型归一为安全默认；数值 clamp 到 9999；visited 严格布尔。
- `allocations` 归一：长度 <= 3、白名单、每类不超实时容量、合法连续前缀（首个非法项起截断）。
- `settled` 派生重算：必须长度恰 3 且 `outcome` 与 `settleOutcomeOf(allocations)` 一致，否则降级为进行中（长度 3 的非法组合截回 2）。
- `pending` 两种严格形态逐字段校验：`{type:"settle", outcome, target, feedback}` 必须匹配固定 outcome 表与逐字反馈；`{type:"action", scene, action, target, feedback}` 必须匹配动作表。任一字段错配归 null；pending 只恢复反馈与转场，不得重复累计。
- 除只读 v51 容量与 balanced 走既有 v42 直达路径外，不写 v28–v51 或主线状态；全仓库仅此一个 v52 存储键。

## 目录与痕迹

- 目录：`02φ / 三债结算`、`02χ / 无归见证`、`02ψ / 零前登记`、`02ω / 倒诉阶`，首次到访后原子恢复，未访问保持 `hidden` 不可聚焦。
- Remembrance 新增一行 v52 汇总（合签轮数 / 四路统计 / 九动作合计），保持 8 张 stat cards，不加结局。

## 实现边界

- 不改 v51 的 13 动作、阈值异常、刻痕牌语义；三个入口按钮只新增，不移位任何既有热点。
- 不改首页门、守则、主线与结局；`docs/KimiUsageLog.md`、`assets/divine-name-cancellation.webp` 与四张源 PNG 不动。
- Kimi 负责状态、DOM、样式、测试、文档与图像转码；监理只提供设计、源图与独立 QA。
- 本轮不执行 `git add`、`git commit`、`git push`、`git stash`。

## QA 门槛

- 桌面 1440×1024、短桌面 1440×800、移动 390×844：所有热点在图内、互不重叠、elementFromPoint 自命中、>= 44px、无横向溢出。
- 三种严格多数 + balanced 四路结算逐字反馈与精确落点。
- 容量矩阵 9/0/0、6/3/0、3/3/3 与门槛不足（按钮 hidden、合成 click 无效、直 hash 回退）。
- click/Enter/Space/Tab；同拍竞争与快速重复只记一次。
- 三枚前 reload 精确恢复顺序与剩余容量；结算拍 reload 重播逐字反馈且只重建一次目标。
- 坏 JSON、数组与伪造 allocations 全部归一，不能靠伪造进结果房。
- 九个结果动作逐字反馈与精确目标逐一实测；全程 console 零 exception。
- 证据截图 `design-qa-evidence/v52-*`：桌面四房、移动四房、一个结算中间态、一个 balanced 反馈态。
