# v86 存在放弃登记局 / REGISTRY FOR RENOUNCING EXISTENCE

版本：v86 本地实装与验收稿
状态：本地已实装并通过独立浏览器 QA 验收（Gemini 生产代码/测试/文档，Codex 设计/素材/独立 QA 验收）
职责：Codex 设计 / 素材 / 独立验收；Gemini 生产前端 / 测试 / 文档同步

## 核心命题

无主真相遗产庭废除真相所有权后，事实不再需要主人，却仍需要有人承担后果。它们开始把每一位路过者登记成临时继承人：看见伤口的人继承伤口，听见供词的人继承罪名，甚至拒绝阅读档案的人也继承了那一页空白。

存在放弃登记局允许来访者申请退出这套继承关系。这里不受理死亡，因为死者依旧存在于人口、记忆和债务里；申请人必须证明自己从一开始就是一次错误登记。玩家依次选择一名想摆脱存在的申请人、一份错误存在凭证与一条存在放弃条款，形成 `3 × 3 × 4 = 36` 份本体注销令。每份注销令把一名除籍登记员派往对应旧场景；三轴覆盖后，民事不存在终审庭开放，产生三条新结局。

## 解锁合同

v86 只读 v85，不写 v85 或更早状态。`existenceRenunciationUnlocked()` 必须同时满足：

- `orphanedFactClaimUnlocked()` 为真；
- v85 inheritances 覆盖三 fact、三 proof、四 obligation；
- v85 `estateOutcomes` 精确包含：
  - `every-fact-inherited-the-person-who-noticed-it`
  - `truth-was-freed-from-every-owner`
  - `the-claimant-inherited-every-unclaimed-consequence`

前置缺失时 getter 返回默认态；四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录与三处登记员全部隐藏。

## 新场景

1. `#existence-renunciation-registry`：存在放弃登记局，选择三名申请人。
2. `#proof-of-nonexistence-archive`：不存在凭证档案库，选择三份错误存在凭证。
3. `#ontological-disinheritance-chamber`：本体除继承室，选择四条放弃条款。
4. `#civil-nonexistence-final-tribunal`：民事不存在终审庭，执行三项最终裁定。

场景总数：`173 → 177`。

## 第一幕：存在放弃登记局

标题：`06μ / 存在放弃登记局 · REGISTRY FOR RENOUNCING EXISTENCE`
图：`assets/v86-existence-renunciation-registry.webp`

黑石大厅分成三座错误身份窗口：左侧观察者被自己看见的事实用暗红线缝在证物上；中央认领者被无人签收的后果与黄铜继承卷压住；右侧无档者站在空窗口后，所有档案都否认他存在，账单却仍准确寄到脚边。三座原生热点互不重叠，桌面与移动端均 `≥44px`。

| renunciant | 按钮 | feedback | tally |
|---|---|---|---|
| `observer-inherited-by-every-fact` | `注销被所有事实继承的观察者 · DEREGISTER THE OBSERVER INHERITED BY EVERY FACT` | `观察者只看了一眼，目击便把他列为财产。现在每件被注意到的事都拥有他的一小部分，连闭眼也会新增一名债权人。` | `observer` |
| `claimant-buried-under-unclaimed-consequences` | `注销被无主后果掩埋的认领者 · DEREGISTER THE CLAIMANT BURIED UNDER UNCLAIMED CONSEQUENCES` | `所有无人签收的后果同时过户，认领者因此继承每一道伤口、每份遗漏和每个尚未发生的惩罚。登记局建议先证明继承人不存在。` | `claimant` |
| `person-rejected-by-every-archive` | `注销被所有档案拒收的人 · DEREGISTER THE PERSON REJECTED BY EVERY ARCHIVE` | `人口簿、伤害档案和死亡记录都拒绝承认这张脸，唯有催缴单始终能找到它。档案说：欠债并不能证明一个人存在，只能证明错误很执着。` | `unfiled` |

选中 renunciant 后创建 pending，锁定三按钮，逐字反馈后进入 `#proof-of-nonexistence-archive`；只在 target arrival 写 `draft.renunciant` 与 `visited.archive`。

## 第二幕：不存在凭证档案库

标题：`06ν / 不存在凭证档案库 · ARCHIVE OF PROOF FOR NONEXISTENCE`
图：`assets/v86-proof-of-nonexistence-archive.webp`

三座玻璃档案柜保存互相冲突的凭证：左侧空摇篮中躺着一张替无人签发的出生证；中央提前被抹除者的影子仍维持站姿；右侧从未交付的肉身被当作退货包裹封存，退款收据却早于身体本身。

| evidence | 按钮 | feedback | target |
|---|---|---|---|
| `birth-certificate-for-an-empty-crib` | `提交空摇篮出生证 · SUBMIT THE BIRTH CERTIFICATE FOR AN EMPTY CRIB` | `出生证完整记录第一次呼吸，摇篮却从未承受过重量。档案员认定：文书出生了，婴儿只是它后来伪造的附件。` | `birth-ballot-booth` |
| `shadow-of-a-person-erased-in-advance` | `提交提前抹除者的影子 · SUBMIT THE SHADOW OF A PERSON ERASED IN ADVANCE` | `人尚未出现，影子已经收到除名通知。它因此先于主人被抹去，又因为没有主人可以失去而一直留在墙上。` | `blank-name-cloakroom` |
| `refund-receipt-for-an-undelivered-body` | `提交未交付肉身退款单 · SUBMIT THE REFUND RECEIPT FOR AN UNDELIVERED BODY` | `收据证明身体已经退货，仓库却找不到任何交付记录。你可能从未拥有肉身，也可能只是肉身用来申请退款的虚构顾客。` | `reality-refund-counter` |

选中 evidence 后进入 `#ontological-disinheritance-chamber`；只在 target arrival 写 `draft.evidence` 与 `visited.chamber`。

## 第三幕：本体除继承室

标题：`06ξ / 本体除继承室 · ONTOLOGICAL DISINHERITANCE CHAMBER`
图：`assets/v86-ontological-disinheritance-chamber.webp`

空人形周围分列四座注销机关：左上以暗红印章把存在改成文书错误；右上从无脸面具中抽出第一人称代词；左下把肉身过户给它原本占据的空缺；右下将不存在登记为一笔继承债。四个原生热点互不遮挡。

| clause | 按钮 | fragment |
|---|---|---|
| `declare-existence-a-clerical-error` | `宣布存在属于登记错误 · DECLARE EXISTENCE A CLERICAL ERROR` | `登记员把出生、记忆与伤口划进同一处错别字。你的生命没有被删除，只是被解释成一名疲惫文书在空栏里多写的一笔。` |
| `return-the-first-person-pronoun-unused` | `退回未使用的第一人称 · RETURN THE FIRST PERSON UNUSED` | `“我”从喉咙里取出，仍保持说话的温度。失去代词后，你可以继续发声，却再也没有一句话能够证明说话者就是你。` |
| `transfer-the-body-to-its-original-absence` | `把肉身过户给原始缺席 · TRANSFER THE BODY TO ITS ORIGINAL ABSENCE` | `骨头、名字和影子逐项归还给出生前的空位。空位收下全部财产，并反过来要求你证明曾经有权占用它。` |
| `accept-nonexistence-as-an-inherited-debt` | `把不存在继承为债务 · ACCEPT NONEXISTENCE AS AN INHERITED DEBT` | `你没有获得自由，只获得一笔比出生更早的欠款。从此每活一刻都算逾期，而死亡只是债务承认你曾经是可追索对象。` |

注销令 id 固定为 `renunciant:evidence:clause`；标题与 feedback 只由冻结表逐字拼接，不接受存档自由文本。点击 clause 后创建 renunciation pending，固定 `source=ontological-disinheritance-chamber`，转到 evidence 对应旧场景。只在 target arrival 原子执行：

- `renunciationRuns +1`；
- 对应 `renunciantTallies +1`；
- renunciation 首次进入图鉴；
- `lastOutcome` 更新；
- `activeRegistrar` 建立；
- draft / pending 清空。

## 三处旧场景除籍登记员

| evidence | 旧场景 | 返回按钮 | activeRegistrar feedback |
|---|---|---|---|
| `birth-certificate-for-an-empty-crib` | `birth-ballot-booth` | `跟空摇篮登记员返回放弃局 · RETURN WITH THE EMPTY-CRIB REGISTRAR` | `登记员在出生投票亭反复清点空摇篮。每一张选票都承认婴儿出生，唯独摇篮坚持那天只来过一份文件。` |
| `shadow-of-a-person-erased-in-advance` | `blank-name-cloakroom` | `跟预先抹除登记员返回放弃局 · RETURN WITH THE ADVANCE-ERASURE REGISTRAR` | `登记员在空名寄存处找到一格仍在投影的黑暗。名字从未寄存，影子却已经领取过三次除名证明。` |
| `refund-receipt-for-an-undelivered-body` | `reality-refund-counter` | `跟未交付肉身登记员返回放弃局 · RETURN WITH THE UNDELIVERED-BODY REGISTRAR` | `登记员在现实退款处核对肉身。柜台承认收过退款申请，却拒绝说明究竟是什么东西曾经被交付给你。` |

activeRegistrar 只在准确 target 出现。返回后清 activeRegistrar 并进入存在放弃登记局；旧反馈、pending、图鉴、通知和入口不得被覆盖。

## 覆盖与民事不存在终审庭

`existenceRenunciationCoverageComplete()` 从规范 renunciations 实时重算：三 renunciant、三 evidence、四 clause 全覆盖且至少四份。三份失败，四份代表注销成功。

覆盖后痕迹室显示：`申请让整个世界退出存在 · PETITION THE WHOLE WORLD TO WITHDRAW FROM EXISTENCE`

标题：`06ο / 民事不存在终审庭 · FINAL TRIBUNAL OF CIVIL NONEXISTENCE`
图：`assets/v86-civil-nonexistence-final-tribunal.webp`

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `strike-every-visitor-from-reality` | `把所有来访者从现实除名 · STRIKE EVERY VISITOR FROM REALITY` | `every-visitor-was-struck-from-reality` | `threshold` | `终审庭把每一次抵达改写成从未发生。门外仍排列无数脚印，但每一双鞋都可以证明自己的主人没有来过。` |
| `register-nonexistence-as-a-citizen` | `把不存在登记为公民 · REGISTER NONEXISTENCE AS A CITIZEN` | `nonexistence-became-a-citizen` | `remembrance` | `不存在取得姓名、住址与投票权。它的第一项公民义务，是替所有被注销者记住他们并不存在。` |
| `make-the-world-disinherit-itself` | `让世界放弃继承自己 · MAKE THE WORLD DISINHERIT ITSELF` | `the-world-disinherited-itself` | `unending-gallery` | `世界签下自己的除继承书，把历史、后果与未来全部留给空位。画廊仍然无终，却再也没有谁能证明它属于现实。` |

合法 target arrival：`tribunalRuns +1`；outcome 首次进入 `tribunalOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定增加 tribunalRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v86_existence_renunciation`，version：`86`

```js
{
  version: 86,
  visited: { registry: false, archive: false, chamber: false, tribunal: false },
  draft: { renunciant: '', evidence: '' },
  renunciations: [],
  tribunalOutcomes: [],
  renunciationRuns: 0,
  tribunalRuns: 0,
  renunciantTallies: { observer: 0, claimant: 0, unfiled: 0 },
  lastOutcome: '',
  activeRegistrar: null,
  pending: null
}
```

规范十一键；visited / draft 精确投影；renunciations 按 `RENUNCIANTS × EVIDENCES × CLAUSES` 固定顺序去重；tribunalOutcomes 按 action 固定顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指规范结果；activeRegistrar 精确 `{evidence,renunciation,feedback}` 并逐表反算；坏 JSON/version/type/未解锁回默认；v86 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `renunciant`：`{kind,source,renunciant,target,feedback}`。
3. `evidence`：`{kind,source,renunciant,evidence,target,feedback}`。
4. `renunciation`：`{kind,source,renunciant,evidence,clause,renunciation,target,feedback}`。
5. `registrar-return`：`{kind,from,target,renunciation,feedback}`。
6. `tribunal-entry`：`{kind,target,feedback}`。
7. `tribunal-action`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复且只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫；三个旧 target 只增加 v86 合法窄桥，不收窄旧准入、不放宽其他守卫。

记忆行：`存在放弃局：已注销 N/36 份错误存在，共办理 R 次；申请人 观者 O / 认领 C / 无档 U；凭证 空摇篮 B / 预抹影 S / 未交体 R；条款 文误 E / 退我 P / 还空 A / 欠无 N；存在多数 Q；终审裁定 T/3。`

图鉴 39 格，目录四项 `06μ / 06ν / 06ξ / 06ο`。forget-all 清 v86 key、AutoAdvance、draft、activeRegistrar、pending、反馈、按钮态、入口、记忆、图鉴、目录与三处登记员；不写 v85。

恰好 18 个 v86 click listener：普通入口 1、tribunal 入口 1、renunciant 3、evidence 3、clause 4、registrar-return 3、tribunal action 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending；测试逐项证明 registrar 动态 ID 与真实 DOM 联动；合成点击零副作用，真实鼠标与键盘可玩。

## 素材合同

四张源 PNG 与四张运行 WebP 均为 `1536×1024`，无可读文字/logo/UI/水印；WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| 幕 | 路径 | 字节数 | SHA-256 |
|---|---|---:|---|
| 登记局源图 | `assets/source-v86-existence-renunciation-registry.png` | 2423982 | `06732a8027ff4a6c24eb4bb3c370e35cb4aae75f0097b0675c70b986e2123677` |
| 登记局运行图 | `assets/v86-existence-renunciation-registry.webp` | 191482 | `fce0caed579f24cd62059b0583c33325cd67f1c0b01cfdca05104cc3ede0e72d` |
| 凭证库源图 | `assets/source-v86-proof-of-nonexistence-archive.png` | 2629134 | `243d30de78eee7c70d6af28d52f2833e19860dbd87ef7f9a6edfbe0983a80df4` |
| 凭证库运行图 | `assets/v86-proof-of-nonexistence-archive.webp` | 202612 | `44f60b851538b8110cb3aafccb8aaf4e923e978500b3165523d68e0c30f2bdce` |
| 除继承室源图 | `assets/source-v86-ontological-disinheritance-chamber.png` | 3039185 | `180b100ce1873a00ec174d59ec1ccf92f169da58ba6d69ba846615530fd9bc29` |
| 除继承室运行图 | `assets/v86-ontological-disinheritance-chamber.webp` | 311884 | `7814317a9e345efce37786a08567749cc481fbc3cb476055a003b8e209f43e29` |
| 终审庭源图 | `assets/source-v86-civil-nonexistence-final-tribunal.png` | 2649063 | `346f6b9999aadfd890d167ef885bae420f15a314ff7a176ca33f89516485f6c8` |
| 终审庭运行图 | `assets/v86-civil-nonexistence-final-tribunal.webp` | 255878 | `648513b4730a875aadd2eac1697dc3b9a55c527e233ec50ffdc256cff1b92c62` |

视觉复核：登记局三名申请人窗口明确；凭证库三件矛盾凭证分区清楚；除继承室四座注销机关围绕中央空人形；终审庭三项裁定区域互不遮挡。四幕都保留足够暗部与留白供 HTML 原生热点及文字层使用。

## 静态与浏览器门槛

- cache `v=86`，177 场景，四幕标题 / 路由 / preload / 目录；
- 解锁只读 v85；十一键、36+3、七 pending、三 activeRegistrar、四份 coverage、18 isTrusted、forget-all、v85 回归；
- 主初始化链包含 v86 全套 sync / paint / replay；registrar 动态 ID 与 index.html 真实 ID 全量联动测试；
- Codex 浏览器验桌面/手机、真实三段点击、三个旧场景回程、coverage/终庭/刷新/坏档/console。

## 实装与独立验收状态（2026-08-30）

- **场景拓扑与静态资产**：新增 4 个场景路由（`#existence-renunciation-registry`、`#proof-of-nonexistence-archive`、`#ontological-disinheritance-chamber`、`#civil-nonexistence-final-tribunal`），总场景数由 173 增至 177；配齐 4 组 1536×1024 源 PNG 与运行 WebP 资产，Cache 查询标记全面升至 `v=86`。
- **状态与事件契约**：状态键 `goddead_v86_existence_renunciation`（版本 86）具备 11 个规范持久化字段，定义 7 类 strict pending 校验与恰好 18 处受信任 `isTrusted` 点击监听；只读单向校验 v85 解锁状态，全局重置与常规交互绝不写回旧版本键。
- **受信任交互流程与终审庭结算**：实机 4 条真实流程完整覆盖 3/3 申请人、3/3 凭证、4/4 条款与 3/3 旧场景落点（`birth-ballot-booth`、`blank-name-cloakroom`、`reality-refund-counter`），三位除籍登记员流转与回跳顺畅；终审庭三项裁决真实导航落点与预期逐字一致：
  - `strike-every-visitor-from-reality` → `every-visitor-was-struck-from-reality` → `#threshold`
  - `register-nonexistence-as-a-citizen` → `nonexistence-became-a-citizen` → `#remembrance`
  - `make-the-world-disinherit-itself` → `the-world-disinherited-itself` → `#unending-gallery`
- **静态门禁核验**：四项核心门禁全部通过：
  - `node --check script.js`
  - `node --check tests/site.test.mjs`
  - `git diff --check`
  - `node tests/site.test.mjs` 输出 `site.test.mjs: 14713 assertions passed`
- **独立浏览器 QA 验收**：在单 Chrome 窗口、单标签页（仅同窗停靠 DevTools）下完成 Computer Use 验收：未解锁直接请求 v86 场景平稳降级至 `#threshold`；桌面与移动端（390×844）关键节点 `scrollWidth` 与 `bodyScrollWidth` 均为 390，无横向溢出；`unending-gallery` 刷新维持幂等；写入破损 `{bad` 存档无崩溃且保持 raw 直至恢复；验收完成后精确恢复原 22 个 localStorage 键（保留原始 v83 听证数 1，无 QA 残留键）。
- **证据归档清单**：
  - `design-qa-evidence/v86-browser-qa.json`
  - `design-qa-evidence/v86-existence-renunciation-registry-desktop.png`
  - `design-qa-evidence/v86-empty-crib-registrar-desktop.png`
  - `design-qa-evidence/v86-civil-nonexistence-final-tribunal-desktop.png`
  - `design-qa-evidence/v86-existence-renunciation-registry-mobile.png`
  - `design-qa-evidence/v86-civil-nonexistence-final-tribunal-mobile.png`
- **交付边界**：本地实装与独立验收已闭环完成，不包含 git commit/push、部署上线或公开发布。

## v87 活口

不存在取得公民身份后，第一份公共预算终于出现：政府必须为所有“没有发生”的事情支付维护费。被注销者开始收到缺席税单，空位出售自己从未占用过的面积，死亡则要求补缴一生没有活过的年限。下一站开放：

`不存在债务催收局 / COLLECTION AGENCY FOR NONEXISTENCE DEBT`

它会问：如果不存在也能欠债，继续存在究竟是在还款，还是在不断产生新的本金？
