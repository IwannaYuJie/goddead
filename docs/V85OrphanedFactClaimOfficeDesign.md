# v85 孤事实认领处 / CLAIM OFFICE FOR ORPHANED FACTS

版本：v85 本地实装与独立验收完成稿
状态：2026-08-30 实装与独立验收完成；已纳入 v90 汇总发布批次
职责：Codex 设计 / 资产复核接入 / 机械应用 / 诊断 / Computer Use QA 证据；Gemini 生产前端 / 测试 / 修复 / 实现文档

## 核心命题

真相以永久化名进入保护计划后，证词终于安全，却再也找不到主人。事实仍然准确：伤口确实出现过，名字确实被擦掉，某个未来也确实被毁掉；只是没有任何人愿意为准确性承担亲属关系。

孤事实认领处不核实真假，只办理继承。玩家依次选择一项没有主人的事实、一份继承凭证和一条事实义务，形成 `3 × 3 × 4 = 36` 份事实继承契。每份契约把一名遗产执行员派往对应旧场景；三轴覆盖后，无主真相遗产庭开放，产生三条新结局。

## 解锁合同

v85 只读 v84，不写 v84 或更早状态。`orphanedFactClaimUnlocked()` 必须同时满足：

- `innocentWitnessProtectionUnlocked()` 为真；
- v84 placements 覆盖三 witness、三 procedure、四 term；
- v84 `courtOutcomes` 精确包含：
  - `eyewitnesses-were-abolished-for-their-safety`
  - `truth-entered-protection-under-an-eternal-alias`
  - `every-protected-witness-remembered-at-once`

前置缺失时 getter 返回默认态；四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录与三处执行员全部隐藏。

## 新场景

1. `#orphaned-fact-claim-office`：孤事实认领处，选择三项无主事实。
2. `#fact-inheritance-vault`：事实继承凭证库，选择三份继承凭证。
3. `#causal-estate-execution-desk`：因果遗产执行台，选择四条事实义务。
4. `#ownerless-truth-estate-court`：无主真相遗产庭，执行三项最终裁定。

场景总数：`169 → 173`。

## 第一幕：孤事实认领处

标题：`06θ / 孤事实认领处 · CLAIM OFFICE FOR ORPHANED FACTS`
图：`assets/v85-orphaned-fact-claim-office.webp`

| fact | 按钮 | feedback | tally |
|---|---|---|---|
| `fact-whose-witness-entered-protection` | `认领证人已被保护的事实 · CLAIM THE FACT WHOSE WITNESS ENTERED PROTECTION` | `事实把目击者的化名填进申请栏。名字完全合法，却没有任何过去可以证明它曾站在现场。` | `witnessless` |
| `fact-whose-cause-died-childless` | `认领原因已经绝嗣的事实 · CLAIM THE FACT WHOSE CAUSE DIED CHILDLESS` | `原因死去时没有留下后代，后果只好把自己列为遗腹子。认领处要求你证明一件事可以继承制造自己的东西。` | `causeless` |
| `fact-rejected-by-every-archive` | `认领被所有档案拒收的事实 · CLAIM THE FACT REJECTED BY EVERY ARCHIVE` | `十三枚退件章互相否认曾见过它。事实因此越来越准确：只有真正发生过的东西，才会被世界如此认真地拒绝。` | `unfiled` |

选中 fact 后创建 pending，锁定三按钮，逐字反馈后进入 `#fact-inheritance-vault`；只在 target arrival 写 `draft.fact` 与 `visited.vault`。

## 第二幕：事实继承凭证库

标题：`06ι / 事实继承凭证库 · FACT INHERITANCE VAULT`
图：`assets/v85-fact-inheritance-vault.webp`

| proof | 按钮 | feedback | target |
|---|---|---|---|
| `unclaimed-fingerprint-of-the-wound` | `提交伤口的无主指纹 · SUBMIT THE WOUND'S UNCLAIMED FINGERPRINT` | `指纹从伤口内侧按出来，纹路属于每一位受害者，也不完全属于任何一位。保险匣承认它真实，拒绝承认它有主人。` | `contradictory-evidence-archive` |
| `shadow-of-an-unsigned-confession` | `提交未签供词的影子 · SUBMIT THE SHADOW OF AN UNSIGNED CONFESSION` | `供词没有姓名，纸下的影子却保持着签字姿势。只要有人把灯移近，它就会假装那只手属于来访者。` | `blank-name-cloakroom` |
| `receipt-for-a-future-consequence` | `提交未来后果收据 · SUBMIT THE RECEIPT FOR A FUTURE CONSEQUENCE` | `收据证明某个后果已经付清，购买日期却在所有行动之后。未来要求你先继承账单，再决定要不要做出原因。` | `minute-before-archive` |

选中 proof 后进入 `#causal-estate-execution-desk`；只在 target arrival 写 `draft.proof` 与 `visited.execution`。

## 第三幕：因果遗产执行台

标题：`06κ / 因果遗产执行台 · CAUSAL ESTATE EXECUTION DESK`
图：`assets/v85-causal-estate-execution-desk.webp`

| obligation | 按钮 | fragment |
|---|---|---|
| `inherit-every-victim` | `继承事实的所有受害者 · INHERIT EVERY VICTIM OF THE FACT` | `遗产执行员把每一道伤口写成亲属。你没有经历他们的疼痛，却从此必须在每次自我介绍时带上所有缺席者。` |
| `inherit-every-omitted-cause` | `继承所有被省略的原因 · INHERIT EVERY OMITTED CAUSE` | `那些没有进入报告的动作、沉默和偶然依次过户给你。事实终于拥有完整过去，而你失去只对自己行为负责的权利。` |
| `adopt-contradiction-as-a-surname` | `把矛盾收作姓氏 · ADOPT CONTRADICTION AS A SURNAME` | `两份互相否认的证词共同替你命名。从此每当你说真话，另一种同样合法的真话都会以你的姓氏签收。` |
| `leave-fact-ownerless-and-become-its-alibi` | `让事实无主并成为它的不在场证明 · LEAVE THE FACT OWNERLESS AND BECOME ITS ALIBI` | `你拒绝认领，却同意证明事实在发生时不属于任何人。它获得自由，你则被永久登记在每一个它声称没有到过的地方。` |

继承契 id 固定为 `fact:proof:obligation`；标题与 feedback 只由冻结表逐字拼接，不接受存档自由文本。点击 obligation 后创建 inheritance pending，固定 `source=causal-estate-execution-desk`，转到 proof 对应旧场景。只在 target arrival 原子执行：

- `inheritanceRuns +1`；
- 对应 `factTallies +1`；
- inheritance 首次进入图鉴；
- `lastOutcome` 更新；
- `activeExecutor` 建立；
- draft / pending 清空。

重复继承契不重复图鉴，但增加真实继承次数与事实票数。source 刷新不提前结算，target 刷新不重复结算。

## 三处旧场景遗产执行员

| proof | 旧场景 | 返回按钮 | activeExecutor feedback |
|---|---|---|---|
| `unclaimed-fingerprint-of-the-wound` | `contradictory-evidence-archive` | `跟伤印执行员返回认领处 · RETURN WITH THE WOUND-PRINT EXECUTOR` | `执行员把伤口指纹夹进矛盾证据档案。每条纹路都指向不同受害者，档案因此宣布事实拥有一个由缺席者共同组成的手。` |
| `shadow-of-an-unsigned-confession` | `blank-name-cloakroom` | `跟影供执行员返回认领处 · RETURN WITH THE SHADOW-CONFESSION EXECUTOR` | `未签供词的影子在空名寄存处试穿每个姓名。所有柜子都说不合身，影子却开始长出你的站姿。` |
| `receipt-for-a-future-consequence` | `minute-before-archive` | `跟未来账单执行员返回认领处 · RETURN WITH THE FUTURE-RECEIPT EXECUTOR` | `未来收据被钉进归档前一分钟。账单已经结清，执行员却找不到任何发生过的付款，只好把你的现在列为担保。` |

activeExecutor 只在准确 target 出现。返回后清 activeExecutor 并进入孤事实认领处；旧反馈、pending、图鉴、通知和入口不得被覆盖。

## 覆盖与无主真相遗产庭

`orphanedFactCoverageComplete()` 从规范 inheritances 实时重算：三 fact、三 proof、四 obligation 全覆盖且至少四份。三份失败，四份代表继承成功。

覆盖后痕迹室显示：`替无主真相指定最后继承人 · APPOINT THE LAST HEIR OF OWNERLESS TRUTH`

标题：`06λ / 无主真相遗产庭 · ESTATE COURT OF OWNERLESS TRUTH`
图：`assets/v85-ownerless-truth-estate-court.webp`

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `let-every-fact-inherit-its-observer` | `让事实继承观察者 · LET EVERY FACT INHERIT ITS OBSERVER` | `every-fact-inherited-the-person-who-noticed-it` | `threshold` | `遗产庭把目击改写成继承关系。任何人只要注意到一件事，便立刻成为那件事的财产；世界因此拥有了所有看见它的人。` |
| `abolish-ownership-of-truth` | `废除真相所有权 · ABOLISH OWNERSHIP OF TRUTH` | `truth-was-freed-from-every-owner` | `remembrance` | `最后一张认领书被烧成空白。事实无需姓名、证人或原因便可存在；代价是再也没有谁能要求它对伤害负责。` |
| `make-the-claimant-inherit-the-whole-world` | `让认领者继承整个世界 · MAKE THE CLAIMANT INHERIT THE WHOLE WORLD` | `the-claimant-inherited-every-unclaimed-consequence` | `unending-gallery` | `所有无人签收的后果同时过户。你获得世界的每一处遗产，也获得它遗漏、否认和尚未造成的全部债务。` |

合法 target arrival：`estateRuns +1`；outcome 首次进入 `estateOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定增加 estateRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v85_orphaned_fact_claims`，version：`85`

```js
{
  version: 85,
  visited: { office: false, vault: false, execution: false, court: false },
  draft: { fact: '', proof: '' },
  inheritances: [],
  estateOutcomes: [],
  inheritanceRuns: 0,
  estateRuns: 0,
  factTallies: { witnessless: 0, causeless: 0, unfiled: 0 },
  lastOutcome: '',
  activeExecutor: null,
  pending: null
}
```

规范十一键；visited / draft 精确投影；inheritances 按 `FACTS × PROOFS × OBLIGATIONS` 固定顺序去重；estateOutcomes 按 action 固定顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指规范结果；activeExecutor 精确 `{proof,inheritance,feedback}` 并逐表反算；坏 JSON/version/type/未解锁回默认；v85 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `fact`：`{kind,source,fact,target,feedback}`。
3. `proof`：`{kind,source,fact,proof,target,feedback}`。
4. `inheritance`：`{kind,source,fact,proof,obligation,inheritance,target,feedback}`。
5. `executor-return`：`{kind,from,target,inheritance,feedback}`。
6. `court-entry`：`{kind,target,feedback}`。
7. `court-action`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复且只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫；三个旧 target 只增加 v85 合法窄桥，不收窄旧准入、不放宽其他守卫。

记忆行：`孤事实认领处：已继承 N/36 项无主事实，共执行 R 次；事实 无证 W / 无因 C / 无档 U；凭证 伤印 F / 影供 S / 未来账单 T；义务 众伤 V / 漏因 O / 矛姓 X / 不在场 A；事实多数 Q；遗产裁定 E/3。`

图鉴 39 格，目录四项 `06θ / 06ι / 06κ / 06λ`。forget-all 清 v85 key、AutoAdvance、draft、activeExecutor、pending、反馈、按钮态、入口、记忆、图鉴、目录与三处执行员；不写 v84。

恰好 18 个 v85 click listener：普通入口 1、court 入口 1、fact 3、proof 3、obligation 4、executor-return 3、court action 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending；测试逐项证明 executor 动态 ID 与真实 DOM 联动；合成点击零副作用，真实鼠标与键盘可玩。

## 素材合同

全部 `1536×1024`，无文字/logo/UI/水印；WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP | source SHA-256 | runtime SHA-256 |
|---|---|---|---|
| `assets/source-v85-orphaned-fact-claim-office.png` | `assets/v85-orphaned-fact-claim-office.webp` | `b7291dcb435c6b8595c47d210caf5dc0c15a201bc5e54753e3d0748afd0d7496` | `fec3de50f4330eeda4ab0b5fa664b763133632ee5bab2aff43c964dc53d4b9bd` |
| `assets/source-v85-fact-inheritance-vault.png` | `assets/v85-fact-inheritance-vault.webp` | `a2fd2c0ed4b7239f1729f12dd11b7ff4394049aff4515cfcb09c5225b8815142` | `5e7ea4822a3f5271d04bfb71998057a4e70fabadeccd658b6c1b4f4840209ce9` |
| `assets/source-v85-causal-estate-execution-desk.png` | `assets/v85-causal-estate-execution-desk.webp` | `cf121d55772a06c935345934a26900c8912df09e6147e6331cdd752d473e2ef3` | `bdb5491aa00ca7b64f79b0c8f456dfeb6a7e2ba4c8f9b255bde5c301f3caf01b` |
| `assets/source-v85-ownerless-truth-estate-court.png` | `assets/v85-ownerless-truth-estate-court.webp` | `3bd8e0e19945c813cb901e83e0d4aec4750cd799ff7ba29f7c709f925ed953b4` | `28600e9faf240536e26ad3f5f3f166a59bf019bd27d0851d4d5f95e003083847` |

视觉复核：四张图均为 `1536×1024`；未发现可读文字、logo、界面、边框或水印。第一幕三张无主申请、第二幕三份凭证、第三幕四项义务与第四幕三座裁定均保持清晰分区；运行图按冻结参数由源图原尺寸转换。

## 静态与浏览器门槛

- cache `v=85`，173 场景，四幕标题 / 路由 / preload / 目录；
- 解锁只读 v84；十一键、36+3、七 pending、三 activeExecutor、四份 coverage、18 isTrusted、forget-all、v84 回归；
- 主初始化链包含 v85 全套 sync / paint / replay；executor 动态 ID 与 index.html 真实 ID 全量联动测试；
- Codex 浏览器验桌面/手机、真实三段点击、三个旧场景回程、coverage/终庭/刷新/坏档/console。

## v86 活口

真相被废除所有权后，无主事实开始把经过的人登记成临时继承人。有人为了摆脱一项后果，把自己的存在申报为“错误认领”；另一些人则出售无辜证明，换取从事实家谱中被除名。下一站开放：

`存在放弃登记局 / REGISTRY FOR RENOUNCING EXISTENCE`

它会问：如果拒绝继承世界的唯一方式，是证明自己从未存在过，那么“不存在”究竟是一种自由，还是一笔更古老的债？


## 实装与独立验收状态（2026-08-30）

- **路由与资产**：场景总数 169→173；实装 `orphaned-fact-claim-office`、`fact-inheritance-vault`、`causal-estate-execution-desk`、`ownerless-truth-estate-court`；配备 1536×1024 源 PNG 与 WebP，缓存标记 `v=85`。
- **状态契约**：持久化键 `goddead_v85_orphaned_fact_claims` 规范包含 11 个字段、7 处 strict pending 守卫、18 项 `isTrusted` 事件，覆盖 36 继承契与 3 终庭裁定；只读依赖 v84 解锁状态，不篡改旧键。
- **分工协同**：Gemini 负责生产前端逻辑、测试套件、bug 修复与文档同步；Codex 负责系统设计、资产生成接入、机械应用、缺陷诊断与 Computer Use QA 实机验收。
- **流程覆盖与真实导航**：自动化测试完整覆盖 36+3 组合；人工实机执行 4 条受信任继承流程，覆盖 3 facts / 3 proofs / 4 obligations / 3 old targets（`contradictory-evidence-archive`、`blank-name-cloakroom`、`minute-before-archive`），伤印、影供、未来账单三执行员均可受信任返回，三终庭真实抵达 `threshold`、`remembrance` 与 `unending-gallery`。
- **缺陷诊断与修复**：Codex 诊断出第三裁定被旧路由 guard 误拦截问题，Gemini 实施 `!orphanedFactBridgeAllows('unending-gallery')` 修复并添加永久回归断言。
- **门禁与环境**：通过 `node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check` 与 `node tests/site.test.mjs`（`site.test.mjs: 14593 assertions passed`）；单窗单标签运行，Desktop 1312×768 与 Mobile 390×844 无水平滚动条；通过刷新幂等性测试与坏 JSON 回退测试，恢复原 22 个 localStorage 键。
- **独立验收证据归档**：
  - `design-qa-evidence/v85-browser-qa.json`
  - `design-qa-evidence/v85-orphaned-fact-claim-office-desktop.png`
  - `design-qa-evidence/v85-wound-print-executor-desktop.png`
  - `design-qa-evidence/v85-ownerless-truth-estate-court-desktop.png`
  - `design-qa-evidence/v85-orphaned-fact-claim-office-mobile.png`
  - `design-qa-evidence/v85-ownerless-truth-estate-court-mobile.png`
- **后续排期与交付边界**：v86 存在放弃登记局为下一个实现目标，其设计与四组资产已冻结但尚未实装；当前交付严格处于本地完成状态，无 commit、push、deploy 或 public release。
