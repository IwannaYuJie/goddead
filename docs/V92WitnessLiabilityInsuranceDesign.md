# v92 目击责任保险局 · 设计

日期：2026-09-24。设计、前端与测试：Claude；场景原画：本机 Codex（内置 image generation）。

## 1. 从 v91 接过来

v91 的第三项裁定是“把监护权交给见证者”：你只是看了一眼，它们便都叫你母亲。于是世界多了一门生意——为“看见”投保。

> 看见即抚养。本局承保一切你本可以不看的事。

这一章不再让玩家挑三件抽象物件，而是翻出玩家自己在游戏里真的看过的三件事，问一个问题：你当时看见了多少？

## 2. 场景

| 场景 | 路由 | 作用 |
| --- | --- | --- |
| 目击责任保险局 | `witness-liability-insurance-bureau` | 陈列三件目击证物，下方是玩家本人的目击档案 |
| 眼睑精算室 | `eyelid-actuarial-room` | 五档眼睑滑杆 + 三种保单，按章投保 |
| 闭眼豁免听证庭 | `blind-exemption-hearing` | 三项终局裁定，可重复进入 |

入口在痕迹室 v91 图鉴下方，要求 v91 开庭条件满足且三项监护裁定全收集；v91 有在途记录时入口禁用。

## 3. 三件目击事件（读取玩家自己的存档）

| event id | 标题 | 档案行（动态） | 理赔落点 | 理赔员 |
| --- | --- | --- | --- | --- |
| `the-door-you-knocked-open` | 你敲开的门 | 你来过 N 次。第三下之后，门就归你抚养了。 | `threshold` | 门槛理赔员 |
| `the-prayer-you-let-burn` | 你让它烧掉的祷词 | 你交出过 N 条祷词，每一条烧起来的时候你都在场。 | `offering` | 焚献理赔员 |
| `the-witness-you-let-be-born-first` | 你让它先出生的见证者 | 在「v91 家庭名」那一家，你让见证者先出生。 | `late-cause-maternity-ward` | 摇篮理赔员 |

N 与家庭名来自 `goddead_arrivals`、`goddead_state.prayersOffered` 与 v91 出生证；只读，缺省时用通用句。

## 4. 眼睑精算：新交互

- 一根原生 `<input type="range">`，0–4 五档：闭眼 0% / 眯眼 25% / 半睁 50% / 注视 75% / 凝视 100%。键盘、触控都可操作；只接受真实输入事件。
- 旁边一只 CSS 画的眼睛，眼睑高度随档位变化；下方一行精算批注随档位实时改写（aria-live）。
- 三张保单卡就是提交按钮：
  - `retroactive-blindness` 事后闭眼险：你将被追认为当时没有在看。
  - `shared-guardianship` 共同监护险：所有在场的目光按比例分摊抚养，包括墙上的画和门缝里的风。
  - `reverse-liability` 反向转嫁险：由事件抚养你——它记得你，替你长大。
- 换档只改草稿，不计进度；换事件把档位重置为“半睁”，同一事件保留。
- “放弃这份投保”清空草稿回保险局。

唯一收集键 `event:policy`，3×3 = 9；档位不进收集键，只进最近理赔与两个极值标记。

## 5. 理赔回执与旧场景

投保后按事件去旧场景，抵达才落账：门外 / 焚献室 / 倒生原因助产院出现“理赔回执”，写明事件、档位、保单与一句结果，点理赔员返回保险局。三处旧场景各多一段记忆，随该事件最近一次理赔（保单 + 档位）变化。回执未领回前不能开新保单。

## 6. 听证

门槛：三件事都投过保、三种保单都用过、至少一次“闭眼”与一次“凝视”。最短三次，例如：门 × 事后闭眼险 × 闭眼、祷词 × 共同监护险 × 凝视、见证者 × 反向转嫁险 × 任意档。痕迹室逐条显示：事件 x/3、保单 x/3、闭眼 x/1、凝视 x/1。

| action | 裁定 | 抵达 |
| --- | --- | --- |
| `insure-every-eye-at-birth` | 每只眼睛出生即强制投保 | `threshold` |
| `register-witnessing-as-parenthood` | 把目击登记为亲职 | `remembrance` |
| `let-events-insure-against-being-seen` | 让事件为不被看见投保 | `unending-gallery` |

## 7. 数据

独立键 `goddead_v92_witness_liability`，version 92，十二字段：version、visited、draft{event, level}、claims、hearingOutcomes、claimRuns、hearingRuns、levelMarks{closed, open}、latestClaimByEvent、lastOutcome、activeAdjuster{claim}、pending。pending 七类（entry / event / claim / abandon / adjuster-return / hearing-entry / verdict），按 kind 与当前状态重建期望对象，逐字段一致才接受。只读 v91 与主线计数；所有新控件只接受真实点击 / 输入；存档内容只以 textContent 渲染。

## 8. 美术

三张 1536×1024，由本机 Codex 生成，源 PNG 放 `design-references/source-v92-*.png`，运行时 WebP 放 `assets/v92-*.webp`。色调延续煤黑、旧铜、暗红封绳、暖金，比全黑章节略亮。提示词见 `docs/V92ImagePrompts.md`。

## 9. 后续钩子

“未被看见之物认领处”：所有没人看见的事开始登记寻找目击者。本轮只留这一句。

## 10. 实现记录（2026-09-24）

- 场景 196 → 199，缓存 `v=92`；三张场景图由本机 Codex CLI 生成，Pillow 转 WebP（239 / 182 / 228 KB），随场景按需加载。
- v92 的元素 id 与样式类统一用 `wl-` 前缀，避开 v84 已有的 `witness-*`；场景路由名保持 `witness-liability-insurance-bureau` 等。
- 滑杆为原生 range，input 事件同样经 isTrusted 检查；眼睛用 CSS 自定义属性 `--witness-open` 驱动上下眼睑。
- 测试：新增 v92 块（目击档案读档、锁定深链、最短三份听证、滑杆只改草稿、换事件重置、放弃、重复理赔、pending 生命周期、v91 在途禁用入口、坏档与伪造字段、遗忘重置）；全套结果见 ProgressLog。
- 浏览器：内置浏览器真实点击 + 键盘（Home / End）操作滑杆完成三份保单、三处回执与记忆段、听证与三项裁定；未解锁深链回痕迹室；375px 无溢出、控件不小于 44px；控制台无错误。
