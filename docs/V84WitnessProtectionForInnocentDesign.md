# v84 无罪证人保护院 / WITNESS PROTECTION FOR THE INNOCENT

版本：v84 本地实装与独立验收完成稿
状态：实现闭环完成，独立验收通过；已纳入 v90 汇总发布批次
职责：Codex 设计 / 素材 / 独立验收；Gemini 3.7 Flash High 生产前端 / 测试 / 文档同步

## 核心命题

伤害考古局授予伤口拒绝作证权后，所有还愿意描述伤害的人突然比加害者更危险：他们的脸会让无罪世界想起嫌疑，他们的影子会在封存现场重演动作，他们的记忆会让已经结案的真相重新获得地址。

无罪证人保护院负责让这些证人“安全消失”。这里不藏匿肉身，而是更换身份的因果部件：脸交给没有见过现场的人，影子迁往不存在的城市，记忆则被安排进一段不会发生的童年。

玩家依次选择：

1. 一名因作证而被判定危险的无罪证人；
2. 一项把证人与证词拆开的身份迁移程序；
3. 一条决定谁必须忘记什么的保护条款；

形成 `3 × 3 × 4 = 36` 份匿名安置令。每份安置令把一名身份掩护员派往对应旧场景；三轴覆盖后，匿名真相终身安置庭开放，产生三条新结局。

## 解锁合同

v84 只读 v83，不写 v83 或更早状态。

`innocentWitnessProtectionUnlocked()` 必须同时满足：

- `harmArchaeologyUnlocked()` 为真；
- v83 reports 覆盖三种 site、三种 instrument、四种 interpretation；
- v83 `hearingOutcomes` 精确包含：
  - `the-investigation-was-convicted-of-second-harm`
  - `the-wound-was-granted-the-right-to-refuse-evidence`
  - `truth-outlived-every-victim`

前置缺失时 getter 返回默认态；四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录、三处掩护员全部隐藏。

## 新场景

1. `#innocent-witness-protection`：无罪证人保护院，选择三名危险证人。
2. `#identity-causality-laundry`：身份因果洗衣房，选择三项身份迁移程序。
3. `#memory-relocation-safehouse`：记忆迁移安全屋，选择四条保护条款。
4. `#anonymous-truth-lifetime-court`：匿名真相终身安置庭，执行三项最终裁定。

场景总数：`165 → 169`。

## 第一幕：无罪证人保护院

标题：`06δ / 无罪证人保护院 · WITNESS PROTECTION FOR THE INNOCENT`
图：`assets/v84-innocent-witness-protection.webp`

黑石接待厅陈列三座隔离席：左侧证人的嘴已被自己说出的证词缝成一道光缝；中央证人身后站着一具与加害者轮廓完全相同的影子；右侧证人的沉默被装进留声骨，正在替另一个人认罪。三座原生热点不重叠，桌面与移动端均 `≥44px`。

### 三名危险的无罪证人

| witness | 按钮 | feedback | tally |
|---|---|---|---|
| `witness-who-survived-testimony` | `保护活过证词的证人 · PROTECT THE WITNESS WHO SURVIVED TESTIMONY` | `证词已经离开嘴巴，仍沿着说话者的骨头继续回响。保护院判定：只要证人还活着，真相就拥有可以追踪的回声。` | `survivor` |
| `witness-shaped-like-offender` | `保护长得像加害者的证人 · PROTECT THE WITNESS SHAPED LIKE THE OFFENDER` | `现场只记得一个轮廓，而证人的影子恰好填满它。无罪没有改变形状，只能申请让形状先失踪。` | `double` |
| `witness-whose-silence-confessed` | `保护沉默替人认罪的证人 · PROTECT THE WITNESS WHOSE SILENCE CONFESSED` | `证人没有说话，档案却把停顿转写成一份完整口供。沉默如今知道太多，因此被列入证人和嫌疑人两份名单。` | `silence` |

选中 witness 后创建 pending，锁定三按钮，逐字反馈后进入 `#identity-causality-laundry`；只在 target arrival 写 `draft.witness` 与 `visited.laundry`。

## 第二幕：身份因果洗衣房

标题：`06ε / 身份因果洗衣房 · IDENTITY CAUSALITY LAUNDRY`
图：`assets/v84-identity-causality-laundry.webp`

三台黑石洗衣机关把身份拆成不同部件：无字面模洗掉一张被现场认出的脸；黄铜影剪把影子从动作上剥离；骨白记忆箱把目击经历搬进一段未出生的童年。

### 三项身份迁移程序

| procedure | 按钮 | feedback | target |
|---|---|---|---|
| `launder-the-recognized-face` | `洗去被现场认出的脸 · LAUNDER THE FACE RECOGNIZED BY THE SCENE` | `面模吸走所有被证物记住的角度。镜子仍能看见证人，现场却再也无法证明这张脸曾经朝向它。` | `blank-name-cloakroom` |
| `relocate-the-incriminating-shadow` | `迁走会定罪的影子 · RELOCATE THE INCRIMINATING SHADOW` | `黄铜影剪没有碰到肉身，只剪断影子与动作之间的因果。证人留在原地，影子带着全部嫌疑先行逃亡。` | `borrowed-shadow-gallery` |
| `rehouse-the-witness-memory` | `搬迁仍在作证的记忆 · REHOUSE THE WITNESS MEMORY` | `记忆箱把现场折成一间没有门的童年房。证人仍知道某件事发生过，却再也找不到自己曾站在哪里。` | `unreturned-witness-gallery` |

选中 procedure 后进入 `#memory-relocation-safehouse`；只在 target arrival 写 `draft.procedure` 与 `visited.safehouse`。

## 第三幕：记忆迁移安全屋

标题：`06ζ / 记忆迁移安全屋 · MEMORY RELOCATION SAFEHOUSE`
图：`assets/v84-memory-relocation-safehouse.webp`

四间没有地址的安全室围住一把空证人椅：左上让证人忘记所见；右上让证词使用未来才出生的名字；左下让整个世界忘记犯罪；右下让“无罪”穿上证人的身份继续生活。

### 四条保护条款

| term | 按钮 | fragment |
|---|---|---|
| `witness-forgets-what-was-seen` | `让证人忘记所见 · MAKE THE WITNESS FORGET WHAT WAS SEEN` | `保护员逐件移走现场，直到证人只剩一份无法解释的害怕。安全终于成立，因为危险和理解危险的人同时失去了彼此。` |
| `testimony-uses-a-future-name` | `让证词使用未来姓名 · LET TESTIMONY USE A FUTURE NAME` | `证词改签给一个尚未出生的人。现在没有谁会因它受罚；多年以后，一个婴儿将在第一次呼吸前继承完整的目击记录。` |
| `world-forgets-the-crime` | `让世界忘记这场犯罪 · MAKE THE WORLD FORGET THE CRIME` | `街道、伤口与档案依次忘记发生过什么。证人成为唯一保留空缺的人，因此也成为世界否认空缺时最显眼的错误。` |
| `innocence-impersonates-the-witness` | `让无罪冒充证人 · LET INNOCENCE IMPERSONATE THE WITNESS` | `一具骨白无罪证明穿上证人的脸和影子。真正的证人获得自由，代价是从此每句真话都会被认作伪装者的表演。` |

安置令 id 固定为 `witness:procedure:term`；标题与 feedback 只由冻结表逐字拼接，不接受存档自由文本。

点击 term 后创建 placement pending，固定 `source=memory-relocation-safehouse`，转到 procedure 对应旧场景。只在 target arrival 原子执行：

- `placementRuns +1`；
- 对应 `witnessTallies +1`；
- placement 首次进入图鉴；
- `lastOutcome` 更新；
- `activeHandler` 建立；
- draft / pending 清空。

重复安置令不重复图鉴，但增加真实安置次数与证人票数。source 刷新不提前结算，target 刷新不重复结算。

## 三处旧场景身份掩护员

| procedure | 旧场景 | 返回按钮 | activeHandler feedback |
|---|---|---|---|
| `launder-the-recognized-face` | `blank-name-cloakroom` | `跟面孔掩护员返回保护院 · RETURN WITH THE FACE HANDLER` | `掩护员在空名寄存处替证人的脸寻找一格没有姓名的柜子。每扇柜门都愿意藏脸，却要求那张脸先忘记自己属于谁。` |
| `relocate-the-incriminating-shadow` | `borrowed-shadow-gallery` | `跟影子掩护员返回保护院 · RETURN WITH THE SHADOW HANDLER` | `被迁走的影子混进借影画廊。所有影子轮流承认做过那个动作，嫌疑因此被稀释成一种公共姿势。` |
| `rehouse-the-witness-memory` | `unreturned-witness-gallery` | `跟记忆掩护员返回保护院 · RETURN WITH THE MEMORY HANDLER` | `目击记忆挂进未归证人画廊，等待一个从未到场的人认领。它已经安全，却开始怀疑安全是否只是永久无人相信。` |

activeHandler 只在准确 target 出现。返回后清 activeHandler 并进入无罪证人保护院；旧反馈、pending、图鉴、通知和入口不得被覆盖。

## 覆盖与匿名真相终身安置

`innocentWitnessCoverageComplete()` 从规范 placements 实时重算：三 witness、三 procedure、四 term 全覆盖且至少四份。三份失败，四份代表安置成功。

覆盖后痕迹室显示：

`为匿名真相安排终身保护 · PLACE ANONYMOUS TRUTH UNDER LIFETIME PROTECTION`

进入 `#anonymous-truth-lifetime-court`。

标题：`06η / 匿名真相终身安置庭 · ANONYMOUS TRUTH LIFETIME COURT`
图：`assets/v84-anonymous-truth-lifetime-court.webp`

### 三项最终裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `abolish-eyewitnesses-to-protect-them` | `废除目击者以保护证人 · ABOLISH EYEWITNESSES TO PROTECT THEM` | `eyewitnesses-were-abolished-for-their-safety` | `eyelid-archive` | `保护院封存所有能够把看见与看见者连接起来的眼睛。从此真相仍会发生，只以没有任何人需要承担的景象形式发生。` |
| `hide-truth-under-eternal-alias` | `让真相永远使用化名 · HIDE TRUTH UNDER AN ETERNAL ALIAS` | `truth-entered-protection-under-an-eternal-alias` | `remembrance` | `真相获得一张没有过去的脸、一段借来的影子和一个未来姓名。所有人都能认出它是真的，却再也不能证明它是哪一件事。` |
| `return-memory-to-every-protected-witness` | `把记忆还给所有受保护证人 · RETURN MEMORY TO EVERY PROTECTED WITNESS` | `every-protected-witness-remembered-at-once` | `unreturned-witness-gallery` | `安全屋同时打开。三十六份被搬迁的记忆奔回原主人，证人重新完整，也重新暴露；无罪世界第一次发现保护曾经只是另一种失踪。` |

合法 target arrival：`courtRuns +1`；outcome 首次进入 `courtOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定增加 courtRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v84_innocent_witness_protection`
version：`84`

```js
{
  version: 84,
  visited: { office: false, laundry: false, safehouse: false, court: false },
  draft: { witness: '', procedure: '' },
  placements: [],
  courtOutcomes: [],
  placementRuns: 0,
  courtRuns: 0,
  witnessTallies: { survivor: 0, double: 0, silence: 0 },
  lastOutcome: '',
  activeHandler: null,
  pending: null
}
```

规范十一键；visited / draft 精确投影；placements 按 `WITNESSES × PROCEDURES × TERMS` 固定顺序去重；courtOutcomes 按 action 固定顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指规范结果；activeHandler 精确 `{procedure,placement,feedback}` 并逐表反算；坏 JSON/version/type/未解锁回默认；v84 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `witness`：`{kind,source,witness,target,feedback}`。
3. `procedure`：`{kind,source,witness,procedure,target,feedback}`。
4. `placement`：`{kind,source,witness,procedure,term,placement,target,feedback}`。
5. `handler-return`：`{kind,from,target,placement,feedback}`。
6. `court-entry`：`{kind,target,feedback}`。
7. `court-action`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复且只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫；三个旧 target 只增加 v84 合法窄桥，不收窄旧准入、不放宽其他守卫。

记忆行：

`无罪证人保护院：已安置 N/36 名匿名身份，共迁移 R 次；证人 活证 S / 形疑 D / 默供 M；程序 洗脸 F / 迁影 H / 搬忆 W；条款 证忘 E / 未名 N / 世忘 C / 罪替 I；证人多数 Q；终身裁定 O/3。`

图鉴 39 格，目录四项 `06δ / 06ε / 06ζ / 06η`。forget-all 清 v84 key、AutoAdvance、draft、activeHandler、pending、反馈、按钮态、入口、记忆、图鉴、目录与三处掩护员；不写 v83。

恰好 18 个 v84 click listener：普通入口 1、court 入口 1、witness 3、procedure 3、term 4、handler-return 3、court action 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending；测试逐项证明 handler 动态 ID 与真实 DOM 联动；合成点击零副作用，真实鼠标与键盘可玩。

## 素材合同

全部 `1536×1024`，无文字/logo/UI/水印；WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP | source SHA-256 | runtime SHA-256 |
|---|---|---|---|
| `assets/source-v84-innocent-witness-protection.png` | `assets/v84-innocent-witness-protection.webp` | `a4ecc93a5e37af0422b5d0fa96563732396e3011ca8ffb731b9bfa0768607835` | `832800863867a9c036a60d00c5fdf9db949901af83945e7acce67af7b32d4928` |
| `assets/source-v84-identity-causality-laundry.png` | `assets/v84-identity-causality-laundry.webp` | `16ba0d7d403dfd7ba4effebd28f6be40b19ea07557198ad959e42abf842f40d3` | `0f692a6ef8df5641713252c02deed3db5b13a6e61121788a46a149ef066f88f1` |
| `assets/source-v84-memory-relocation-safehouse.png` | `assets/v84-memory-relocation-safehouse.webp` | `16d86deee7e35866639210ae5bdd13f46435290748ed167e70e0038ec9b1f40a` | `e0343a7fb2fa4ce4655fc9451d39992fb32c67a772bd4e28aa9bfd445a64300d` |
| `assets/source-v84-anonymous-truth-lifetime-court.png` | `assets/v84-anonymous-truth-lifetime-court.webp` | `8da18ce426e893c4bf4f70ead4bc8c26cb44483893ba4d58071aab521665feb1` | `5f011e2cb01cc5e7319a29b033e0b49a300d0532992d7524d1584387953cf81e` |

视觉复核：四张图均为 `1536×1024`；未发现可读文字、logo、界面、边框或水印。第一幕三席、第二幕三机关、第三幕四安全室与第四幕三裁定均可在桌面宽幅中清晰区分；运行图按冻结参数由源图原尺寸转换。

## 静态与浏览器门槛

- cache `v=84`，169 场景，四幕标题 / 路由 / preload / 目录；
- 解锁只读 v83；十一键、36+3、七 pending、三 activeHandler、四份 coverage、18 isTrusted、forget-all、v83 回归；
- 主初始化链包含 v84 全套 sync / paint / replay；handler 动态 ID 与 index.html 真实 ID 全量联动测试；
- Codex 浏览器验桌面/手机、真实三段点击、三个旧场景回程、coverage/终庭/刷新/坏档/console。

## 验收结论与实装记录（2026-08-29）

- **代码与测试实现**：由 Gemini 3.7 Flash High 完成前端场景、状态机逻辑与单元测试编写。测试套件通过全部 14,473 项断言。
- **场景拓扑扩展**：场景数由 165 扩展至 169（Cache `v=84`），4 张 1536x1024 冻结素材与 WebP 运行时资源均已就位并核验哈希一致。
- **机制与状态模型**：建立 `goddead_v84_innocent_witness_protection` 存储契约（11 个规范持久化字段），单向读取上游 `goddead_v83_harm_archaeology`；完整实装 36 组合安置矩阵、3 位身份掩护员调度及 3 项终身安置庭裁决终局。
- **独立浏览器实机 QA**：由 Codex 使用单一 Chrome 窗口与单一标签页完成实机验收，验证了无 v84 状态下既有进度的门禁拦截重定向、v83 全听证解锁入口、4 次真实受信任安置操作（覆盖 3 证人、3 程序、4 条保护条款）、3 位掩护员与 3 种裁决链路、幂等刷新、损坏数据容灾恢复及双端无溢出热区达标。测试完成后已精确恢复用户测试前数据。
- **交付状态**：本地实装与验收全链路闭环，保持 no commit / no push / no deploy / no public release。

## v85 活口

真相以永久化名进入保护计划后，所有证词都失去主人。事实仍然准确，却没有任何人愿意为它签收；而无人认领的事实会在城市里自行寻找因果，把经过的人误登记成当事人。下一站开放：

`孤事实认领处 / CLAIM OFFICE FOR ORPHANED FACTS`

它会问：如果认领一项事实就必须继承它伤害过、证明过和遗漏过的一切，真相还有权要求一个主人吗？
