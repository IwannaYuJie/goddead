# v91 倒生原因助产院 · 设计冻结草案

日期：2026-09-22。设计与原画：Codex；前端实现、测试与实现文档：`gemini-3.7-flash-high`。

状态：设计与三张场景原画已完成，尚未接入游戏。先完成 v90 的冷启动/解锁链性能修复与真实点击验收，再交付 v91 实现；不能把本文件当作已上线说明。

## 1. 从后果那里出生

v90 承认“后果可以成为原因的祖先”之后，现实收到了第一批迟到的出生证明。

> 摇篮已经空了七十年。今天，里面终于传出一扇门打开的声音。

这里没有婴儿，没有医疗创伤场面。摇篮里是门、尚未划开的金线、没有燃烧过的火柴。衰老的后果坐在走廊外，等着自己的原因出生。

本章核心不是再选三套材料、盖四种章，而是让玩家自己排出“原因 / 后果 / 见证者”的出生顺序。顺序直接改变故事句子、档案类型和旧场景的回声。

## 2. 范围和路线

新增三个场景，暂定总场景数 196；实现前以真实基线计数核对。

| 场景 | 路由 | 作用 |
| --- | --- | --- |
| 倒生原因助产院 | `late-cause-maternity-ward` | 选择一个已经等待自己原因很久的家庭 |
| 出生先后登记室 | `reverse-birth-order-registry` | 操作三张顺序卡，实时预览并登记 |
| 第一因监护法庭 | `first-cause-custody-court` | 三种可重复进入的终局裁定 |

入口从 remembrance 的 v90 总结后出现。v90 原有完成条件保持只读：调用 `getCauselessConsequenceRefugeeClaims()` 取得归一化状态，然后要求 `causelessConsequenceRefugeeCoverageComplete(st)` 与 `CAUSELESS_CONSEQUENCE_VERDICT_OUTCOME_IDS` 全部三项均已收集。前者只证明 ≥4 合法案例覆盖全部三类 refugee、三类 sponsor、四种 protocol，不证明三裁定完成。不可只看 runs、visited 或伪造计数。

getter 已校验上游；不要再先调用一次 `causelessConsequenceRefugeeUnlocked()`，以免重建指数级重复遍历。v90 的 pending、activeConsul、draft 不改变永久收集证明；其中 pending 非空时禁用新章入口和拒绝新章跳转，提示“先完成正在抵达的回执”。activeConsul 或草稿单独存在时允许进入，v91 不清空、不写回它们。

登记后走回已有三个老场景，由新增独立“接生回执”面板确认发生，再回助产院。旧门、旧记忆、旧画廊仍可正常游玩。不能修改旧章原始文案和原始进度来伪装新分支。

## 3. 三份家庭档案

| family id | 后果（年长者） | 原因（迟到者） | 见证者 | 登记抵达 |
| --- | --- | --- | --- | --- |
| `door-born-from-its-own-shadow` | 门外已经等了一生的影子 | 刚学会打开的门 | 还没有进来的你 | `threshold` |
| `wound-born-from-a-healed-scar` | 已经痊愈七十年的金色缝线 | 尚未发生的裂口（抽象光线，无血肉） | 忘记疼痛的记忆 | `remembrance` |
| `fire-born-from-cold-ashes` | 已经冷却的灰烬 | 从未点燃的火柴 | 挂在空画框里的烟 | `unending-gallery` |

助产院卡片先说一个可感知的矛盾，不先堆设定名词。示例：“影子把门抱了起来。门还不知道什么叫里面。”

## 4. 新操作：先后顺序盘

三张卡片固定身份 `cause`、`effect`、`witness`；顺序为三者严格排列，不可重复、缺项、混入任意值。只允许六种排列。

每张卡显示“第一个 / 第二个 / 最后一个”，以及明确的“提前一位 / 延后一位”按钮，边界按钮 disabled。桌面横向，窄屏纵向。键盘与触控都能完成，不依赖拖拽；拖拽不属于首轮实现范围。

每次移动只改本章 draft.order，更新一段 aria-live=polite 的自然句子和一枚关系标签。选择不同家庭时重置到 `cause,effect,witness`，选择同一家庭或点击“继续登记”保留原顺序。离开登记室后回来保留未提交 draft；助产院必须提供明确的“继续登记”入口。“放弃这份登记”清空草稿，明确回助产院。pending 或 activeMidwife 存在时先完成抵达/返回回执，不允许直接换家庭。预览、换序和放弃都不能增加完成进度。

| 顺序 | 标签 | 通用预览骨架 |
| --- | --- | --- |
| cause → effect → witness | 通常家谱 | 原因先到，后果随后，见证者最后学会为它们作证。 |
| cause → witness → effect | 预知证词 | 原因出生，见证者先说出了尚未到来的后果。 |
| effect → cause → witness | 倒生家谱 | 后果等到了自己的原因，见证者把年长者登记成孩子。 |
| effect → witness → cause | 被等待的原因 | 后果与见证者一起，把迟到的原因养大。 |
| witness → cause → effect | 先验见证 | 见证者先占好了位置。后来发生的一切，像是在配合他的证词。 |
| witness → effect → cause | 证词接生 | 见证者先说“已经发生”。后果到场，原因最后被叫出名字。 |

实际实现必须为三家庭各给六条有具体物件的短预览（18条），不能只替换抽象标签。登记按钮文案：“按这个顺序签发出生证”。其下明确提示将返回哪个旧场景；不是猜谜，也没有错误答案。

唯一完成键：`family:token-token-token`，合法笛卡尔空间 3×6=18。重复办理可以有回声，但唯一收集数不增加。

## 5. 接生回执与旧页面变化

抵达旧目标才落账，不在点击那一刻提前计数。回执显示家庭、三步顺序和两句结果，并保留一个可信点击返回助产院的按钮。pending source 刷新继续等待，target 刷新只结算一次；到其他页安全取消。

三旧页面新增且仅新增本章独立的记忆小段。每个 family 最近一次已完成 order 决定其文案；不同 order 必须可见地不同。未解锁、未完成时隐藏，不能把测试 seed 当真实玩家可见捷径。

threshold 的新增段是前部新支线：“门把自己的出生证明递给了门外的人。”这让本章反过来改变游戏最开始的情境，但不阻挡开门主线。

## 6. 法庭不是刷满18次

门槛：三个家庭均至少完成一份出生证，且总体包含至少一份 cause 在 effect 前、一份 effect 在 cause 前、以及一份 witness 排第一的出生证。三次办理即可同时覆盖全部条件；18份是自愿收集，不强迫重复劳动。

最短可验证路径示例：门 `cause-effect-witness`、金线 `effect-cause-witness`、灰烬 `witness-effect-cause`。这三份足以满足门槛。

记忆页用三个可解释的缺项提示展示门槛：家庭 0/3、两种亲子方向 0/2、见证者先出生 0/1。不可只显示一条模糊的“未满足条件”。

三个终局分别永久记录，但互不封锁；终局后可以再次回法庭：

| action / outcome id | 中文裁定 | 抵达 | 后续余味 |
| --- | --- | --- | --- |
| `let-effects-raise-their-causes` / `every-effect-adopted-its-younger-cause` | 让年长的后果抚养原因 | threshold | 门已经会开了，却仍要影子牵着它。 |
| `abolish-the-firstborn` / `nothing-had-to-be-first-to-be-real` | 废除“必须有第一个” | remembrance | 家谱没了根，树却终于开始长。 |
| `give-custody-to-the-witness` / `the-witness-became-the-parent-of-events` | 把监护权交给见证者 | unending-gallery | 你只是看了一眼，他们便都叫你母亲。 |

后续钩子：“目击责任保险局”——看见即承担抚养一件事的责任，人们开始为闭眼投保。本轮仅留一句钩子，不无限堆空场景。

## 7. 数据和安全边界

新命名空间 `goddead_v91_late_cause_maternity`，version 91。建议十二字段：version、visited、draft、birthRecords、custodyOutcomes、registrationRuns、custodyRuns、familyTallies、latestBirthByFamily、lastOutcome、activeMidwife、pending。

`latestBirthByFamily` 是三个固定 family id 到已收集合法 record id 的有界映射；值必须属于对应 family，非法值置空。只在目标抵达结算时更新。重复办理不新增 birthRecords，但要更新该家庭 latest，才能跨刷新保留三个旧场景各自最后一次的不同顺序。

具体存储、pending discriminator 与函数名由 Gemini 完整设计实现；必须满足：严格白名单归一化，数组去重有界，计数 clamp，损坏JSON安全，未知字段剥离，缺失对象补默认值，派生门槛每次重新核算，旧章只读，任意 URL 不能绕过 gate。任何持久化小段用 textContent，不把存档内容拼进 HTML。

初始化必须先读实际 route；全局 bootstrap 只能同步 UI，不能对硬编码 threshold 提前 resolve/replay pending。该规则来自 v90 2026-09-22 实际缺陷。功能验收要运行真实 bootstrap 边界，不能只测试孤立 getter。

减少动画时省去位移动画、缩短已有延迟；pending 控件临时锁定；快速双击与重复 hash 不能增加结算次数。确保所有新操作使用可信点击入口，保留项目既有防脚本点击契约。

## 8. 美术与排版

整体保留煤黑、旧铜、暗红封绳、暖金微光。新画面比旧图略明亮，突出“照顾”和“迟到”，而非再造一个全黑法院。实际文本区保持足够明度，不能靠一层厚黑蒙版吞掉细节。

三张均为内置 imagegen 新生成 1536×1024，源图保留 PNG，WebP 使用 quality84 做格式压缩；未接入前端。完整提示词和哈希见 `docs/V91ImagePrompts.md`。

| 场景 | 源图 / WebP（assets/） | WebP 字节 |
| --- | --- | --- |
| 助产院 | `source-v91-late-cause-maternity-ward.png` / `v91-late-cause-maternity-ward.webp` | 243398 |
| 登记室 | `source-v91-reverse-birth-order-registry.png` / `v91-reverse-birth-order-registry.webp` | 188154 |
| 监护法庭 | `source-v91-first-cause-custody-court.png` / `v91-first-cause-custody-court.webp` | 278266 |

已逐张视觉检查：助产院三摇篮、门、金线、灰烬火柴清楚；登记室三块独立铜框、火柴/灰烬/镜子与金线可辨；法庭无根悬树、空监护席与三份空证件成立。每张独立生成，无可读文字、UI、水印或医疗创伤。法庭比前两张明亮，作为终局的晨光差异保留。

图上的文字全部由 HTML 渲染。桌面图像与内容留呼吸空间；390×844 顺序卡可见完整标签、按钮不少于44px、无横向溢出。

## 9. 第一张原画实际提示词

内置 imagegen，use case `stylized-concept`。核心原文：

> Original 1536x1024 landscape environment art for GODDEAD, chapter 91. Maternity Ward for Causes Born After Their Consequences. A deserted stone bureaucratic maternity hall, no people and no babies: three antique brass archival bassinets on a shallow reflecting black floor beneath cathedral arches. First cradle: a miniature wooden doorway growing backward from its ancient shadow. Second: a thin luminous gold seam above folded ivory cloth, a scar waiting for its cause, not flesh. Third: unburnt matchsticks emerging from cold ash. Warm golden filaments travel from old architecture into newborn objects. Blank paper birth tags tied with dark red thread. Broken clock with blank face. Atmospheric dark-fantasy oil painting, antique brass, charcoal stone, old vellum, pale amber and dusty blue shadows. Landscape 3:2, clear lower-middle silhouettes, receding central corridor, quiet upper-left space. Tender and uncanny. No medical equipment, gore, skin, human anatomy, characters, typography, logos, watermark, UI or diagram.

## 10. 实现与验收次序

1. v90 lifecycle 修复和验收收口；保留证据与原始存档。
2. Gemini 阅读本设计和真实工程接口，返回完整模块、完整场景/样式片段与精确集成操作；Codex 只机械整合。
3. 测试六种排列、18份合法记录、三个最短门槛案例、重复办理、损坏存档、锁定深链接、所有 pending 的真实冷启动和重复 hash。
4. Computer Use 在同一个游戏标签页实点三家庭、顺序交换、三旧场景回执、三个终局；桌面和390×844视觉检查。测试仅 seed 已备份的上游存档，本章进度由真实点击取得。
5. 原存档、hash、viewport 逐项恢复；实现文档更新真实测试数字和未完成边界，不把自动测试当完整实玩。

本章尚未实现。保持本状态直到 Gemini 代码通过实际检查。
