# v79 未言人格继承院 / COURT OF UNSPOKEN PERSONHOOD

版本：v79 设计冻结稿
状态：设计与素材冻结，待 v78 独立验收后交 Kimi 实装
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

沉默取得唯一合法发声权后，所有没能说出口的话都成了没有身体的合法遗民。它们排在继承院门外，要求继承说话者留下的姓名、年月和被回应的权利：一句从未出口的“我爱你”声称自己活过一段婚姻，一份未宣读遗嘱要求继承死者，一声咽回去的求救则起诉所有没来得及听见它的人。

玩家依次选择：

1. 一种申请人格的未言之物；
2. 一份证明它曾经接近出口的沉默证物；
3. 一项荒谬的人格继承方式；

形成 `3 × 3 × 4 = 36` 份未言人格继承判令。每次判令后，一名沉默执行官停留在对应旧场景；三轴全部覆盖后，未出口遗产终审庭开放，产生三条新的继承结局。

## 解锁合同

v79 只读 v78，不写 v78 或更早状态。

`unspokenPersonhoodCourtUnlocked()` 必须同时满足：

- `firstPersonRationingUnlocked()` 为真；
- v78 rations 覆盖三种 speaker、三种 entitlement、四种 scheme；
- v78 `courtOutcomes` 精确包含：
  - `one-voice-belonged-to-everyone-in-turn`
  - `every-self-spoke-as-i-at-once`
  - `silence-became-the-only-legal-speaker`

任一前置缺失时，v79 getter 返回默认态，四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录和三处执行官全部隐藏。

## 新场景

1. `#unspoken-personhood-court`：未言人格继承院，选择三种人格申请者。
2. `#silent-intent-archive`：沉默意图证物库，选择三份沉默证物。
3. `#personhood-inheritance-examination`：人格继承检验室，选择四项继承方式。
4. `#unuttered-estate-tribunal`：未出口遗产终审庭，执行三项最终裁定。

场景总数：`145 → 149`。

## 第一幕：未言人格继承院

标题：`05θ / 未言人格继承院 · COURT OF UNSPOKEN PERSONHOOD`
图：`assets/v79-unspoken-personhood-court.webp`

三座申请席横向展开。左侧一封从未拆开的暗红情书在骨白胸腔前自行呼吸；中央未宣读遗嘱被黄铜手臂压在空棺上；右侧玻璃罐封存一团像人脸一样撞击瓶壁的求救气息。三块热点不重叠，桌面与移动端均 `≥44px`。

### 三种未言人格申请者

| claimant | 按钮 | feedback | tally |
|---|---|---|---|
| `unsaid-love-confession` | `替未说出的爱申请人格 · CLAIM PERSONHOOD FOR UNSAID LOVE` | `暗红情书从未离开胸腔，却记得一段没有发生的共同生活。它要求继承两个人本该一起变老的年月。` | `love` |
| `unread-final-testament` | `替未宣读遗嘱申请人格 · CLAIM PERSONHOOD FOR THE UNREAD TESTAMENT` | `封蜡遗嘱拒绝被称作死者的财物。它说自己保存了最后意志，因此死者才是它尚未办理过户的遗产。` | `testament` |
| `swallowed-cry-for-help` | `替咽回的求救申请人格 · CLAIM PERSONHOOD FOR THE SWALLOWED CRY` | `求救声在玻璃罐里继续撞击。它一次也没被听见，却能逐个叫出所有本来可能回头的人。` | `cry` |

选中 claimant 后创建 pending，显示逐字反馈并进入 `#silent-intent-archive`；只在 target arrival 写入 `draft.claimant` 与 `visited.archive`。

## 第二幕：沉默意图证物库

标题：`05ι / 沉默意图证物库 · ARCHIVE OF SILENT INTENT`
图：`assets/v79-silent-intent-archive.webp`

证物库陈列三份接近发声的痕迹：闭合双唇在暗红蜡上留下的压力印；一段没有署名、却让黄铜听筒自行震动的见证回声；从空电话里倒流回来的最后一口气。三块热点不重叠、`≥44px`。

### 三份沉默证物

| evidence | 按钮 | feedback | target |
|---|---|---|---|
| `closed-lip-pressure-seal` | `提交闭唇压力封印 · SUBMIT THE CLOSED-LIP PRESSURE SEAL` | `蜡封保存了嘴唇决定张开的那一瞬。话没有出去，压力却完整留下一个人差点诚实的形状。` | `confession` |
| `unsigned-witness-echo` | `提交无署名见证回声 · SUBMIT THE UNSIGNED WITNESS ECHO` | `黄铜听筒复述一段无人说过的证词。它知道遗嘱写给谁，却拒绝证明自己从哪一张嘴里来。` | `testament-clearing-vault` |
| `breath-returned-from-empty-receiver` | `提交空听筒归还之息 · SUBMIT THE BREATH RETURNED BY AN EMPTY RECEIVER` | `空听筒吐回一口被咽下多年的气。它带着求救的节奏，另一端却从未真正响过。` | `unseated-listening-booth` |

选中 evidence 后进入 `#personhood-inheritance-examination`；只在 target arrival 写入 `draft.evidence` 与 `visited.examination`。

## 第三幕：人格继承检验室

标题：`05κ / 人格继承检验室 · PERSONHOOD INHERITANCE EXAMINATION`
图：`assets/v79-personhood-inheritance-examination.webp`

四座遗产机械围住中央空身：左上姓名压印机把字母压进空面具；左下岁月纺锤把未活过的日历卷进骨线；右上黄铜听诊器把回应义务钉给所有旁听席；右下负形棺椁把拒绝肉身登记成一种长期存在。四块热点不重叠、`≥44px`。

### 四项人格继承方式

| mode | 按钮 | fragment |
|---|---|---|
| `inherit-the-speakers-name` | `继承说话者姓名 · INHERIT THE SPEAKER'S NAME` | `书记官把姓名从活人的嘴上剥下，盖到未言之物上。本人仍能被叫到，却必须由那句话代为答应。` |
| `inherit-the-unlived-years` | `继承没有活过的年月 · INHERIT THE UNLIVED YEARS` | `未发生的日历开始翻页。每一年都属于一句差点说出的话，而身体只继承它们共同留下的衰老。` |
| `inherit-the-right-to-be-answered` | `继承被回应的权利 · INHERIT THE RIGHT TO BE ANSWERED` | `所有没听见的人突然负有答复义务。他们必须回答一声从未抵达的求救，并证明迟到不等于拒绝。` |
| `refuse-a-body-and-live-as-absence` | `拒绝肉身，以缺席生活 · REFUSE A BODY AND LIVE AS ABSENCE` | `判令允许未言之物不占用身体。它以房间里少掉的一句话生活，并在每次沉默时继续长大。` |

判令 id 固定为 `claimant:evidence:mode`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自由文本。

点击 mode 后创建 grant pending，固定 `source=personhood-inheritance-examination`，并转到 evidence 对应旧场景。只在 target arrival 原子执行：

- `grantRuns +1`；
- 对应 `claimantTallies +1`；
- grant 首次进入图鉴；
- `lastOutcome` 更新；
- `activeExecutor` 建立；
- draft / pending 清空。

重复判令不重复图鉴，但仍增加真实执行次数与申请者票数；source 刷新不提前结算，target 刷新不重复结算。

## 三处旧场景沉默执行官

| evidence | 旧场景 | 返回按钮 | activeExecutor feedback |
|---|---|---|---|
| `closed-lip-pressure-seal` | `confession` | `跟闭唇执行官返回继承院 · RETURN WITH THE CLOSED-LIP EXECUTOR` | `闭唇执行官在忏悔室量出一句话的负形。它没有内容，却准确占据了最该诚实的那一刻。` |
| `unsigned-witness-echo` | `testament-clearing-vault` | `跟无署名执行官返回继承院 · RETURN WITH THE UNSIGNED EXECUTOR` | `无署名执行官在遗嘱清算库找到一段多余回声。每份遗产都否认拥有它，所有继承人却认得它的语气。` |
| `breath-returned-from-empty-receiver` | `unseated-listening-booth` | `跟空听筒执行官返回继承院 · RETURN WITH THE EMPTY-RECEIVER EXECUTOR` | `空听筒执行官坐在无人接听的隔间。听筒不断归还气息，仿佛另一端仍有人练习如何开口求救。` |

activeExecutor 只在准确 target 出现。返回后清 activeExecutor，进入未言人格继承院；旧反馈、pending、图鉴、通知与入口不得被覆盖。activeExecutor 位于 remembrance 的情形不存在，因此不增加 remembrance 双入口特例。

## 覆盖与未出口遗产终审

`unspokenPersonhoodCoverageComplete()` 从规范 grants 实时重算：三 claimant、三 evidence、四 mode 全覆盖且至少四份。三份失败，四份代表判令成功。

覆盖后痕迹室显示：

`审理所有没能出口的人生 · TRY EVERY LIFE THAT NEVER LEFT THE MOUTH`

进入 `#unuttered-estate-tribunal`。

标题：`05λ / 未出口遗产终审庭 · FINAL TRIBUNAL OF UNUTTERED ESTATES`
图：`assets/v79-unuttered-estate-tribunal.webp`

### 三项人格遗产裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `grant-the-unsaid-a-whole-life` | `把完整一生判给未言之句 · GRANT A WHOLE LIFE TO THE UNSAID` | `an-unsaid-sentence-inherited-a-whole-life` | `remembrance` | `未拆情书继承了姓名、童年和死期。原来的身体仍在墙前呼吸，却只剩一份被句子放弃的空白遗产。` |
| `divide-personhood-among-all-listeners` | `把人格分给所有未听见者 · DIVIDE PERSONHOOD AMONG ALL WHO DID NOT HEAR` | `personhood-was-divided-among-the-unhearing` | `unseated-listening-booth` | `求救声被分成许多微小人格，落进每张空座。此后每个没听见的人，都在体内替它继续等一次回答。` |
| `make-the-speaker-estate-of-last-silence` | `让说话者成为最后沉默的遗产 · MAKE THE SPEAKER THE ESTATE OF LAST SILENCE` | `the-speaker-became-the-estate-of-last-silence` | `unending-gallery` | `封蜡遗嘱倒过来宣读活人。名字、身体与记忆逐项过户，最后只剩沉默作为唯一仍然在世的继承人。` |

每次合法 target arrival：`tribunalRuns +1`；outcome 首次进入 `tribunalOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 tribunalRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v79_unspoken_personhood`
version：`79`

```js
{
  version: 79,
  visited: { court: false, archive: false, examination: false, tribunal: false },
  draft: { claimant: '', evidence: '' },
  grants: [],
  tribunalOutcomes: [],
  grantRuns: 0,
  tribunalRuns: 0,
  claimantTallies: { love: 0, testament: 0, cry: 0 },
  lastOutcome: '',
  activeExecutor: null,
  pending: null
}
```

规范十一键：visited / draft 精确投影；grants 固定 `CLAIMANTS × EVIDENCE × MODES` 顺序去重；tribunalOutcomes 固定 action 顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指向规范结果；activeExecutor 精确 `{evidence,grant,feedback}` 且从表反算；坏 JSON/version/type/未解锁回默认；v79 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `claimant`：`{kind,source,claimant,target,feedback}`。
3. `evidence`：`{kind,source,claimant,evidence,target,feedback}`。
4. `grant`：`{kind,source,claimant,evidence,mode,grant,target,feedback}`。
5. `executor-return`：`{kind,from,target,grant,feedback}`。
6. `tribunal-entry`：`{kind,target,feedback}`。
7. `tribunal`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复并只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫；三个旧 target 只增加 v79 合法窄桥，不收窄旧准入、不放宽其他守卫。

记忆行：

`未言人格继承院：已裁定 N/36 份判令，共执行 R 次；申请者 未爱 L / 遗嘱 T / 求救 C；证物 闭唇 P / 回声 E / 归息 B；继承 姓名 N / 年月 Y / 回应 A / 缺席 V；人格多数 Q；终审结局 X/3。`

图鉴 39 格，目录四项 `05θ / 05ι / 05κ / 05λ`。forget-all 清 v79 key、AutoAdvance、draft、activeExecutor、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个执行官；不写 v78。

恰好 18 个 v79 click listener：普通入口 1、tribunal 入口 1、claimant 3、evidence 3、mode 4、executor-return 3、tribunal 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending；合成点击零副作用，真实输入可玩。

## 素材合同

全部 `1536×1024`，无文字/logo/UI/水印；WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP |
|---|---|
| `design-references/source-v79-unspoken-personhood-court.png`（2711261 B / `02cffd4890f548b23c59c5eb8625a53d0ebd48874158964518a0270dfd99fbb2`） | `assets/v79-unspoken-personhood-court.webp`（242470 B / `963b1e746ced6e0ba68866b3fe4c1c78b4396d17babbfa282ce6928b2637b13c`） |
| `design-references/source-v79-silent-intent-archive.png`（2725077 B / `cc42f19f52fe3293385e5fbe1d2cf727bedfb56278f9aee68bcde032d1b67f9f`） | `assets/v79-silent-intent-archive.webp`（219234 B / `0e189ab94bf0427032560bf06c400eb39ea6e856414809a887813f3606c1d1ae`） |
| `design-references/source-v79-personhood-inheritance-examination.png`（2891864 B / `6575765ea367225751121f9411cf30587b636cfc13a2a939c0dd40babda64b16`） | `assets/v79-personhood-inheritance-examination.webp`（256036 B / `0daaf8dc307f5d1b43006def7fbb8029b0e3d616b80b4f70d356b208578202d7`） |
| `design-references/source-v79-unuttered-estate-tribunal.png`（2743225 B / `6c15f4371ff3e85443c467ba1086d6c73d552c00318a37c1472ffbf46b4e0f05`） | `assets/v79-unuttered-estate-tribunal.webp`（272104 B / `d2e3ec4582d0ea4be8f2335fa2da85eb16b80f84b39b9e4d953953945fbec78c`） |

## 静态与浏览器门槛

- cache `v=79`，149 场景，四幕标题 / 路由 / preload / 目录；
- 解锁只读 v78；十一键、36+3、七 pending、三 activeExecutor、四份 coverage、18 isTrusted、forget-all、v78 回归；
- 整页主初始化链必须包含 v79 全套 sync / paint / replay，禁止只测隔离模块；
- Codex 浏览器验桌面/手机、真实三段点击、三个旧场景回程、coverage/终审/刷新/坏档/console。

## v80 活口

未言之句继承完整人生后，所有被放弃、删去或来不及完成的念头开始宣称自己是被谋杀的可能人格。下一站开放：

`未遂思想收容所 / ASYLUM FOR UNFINISHED THOUGHTS`

它将收容一个没想完的名字、一场被理智中止的逃亡和一种从未允许自己拥有的幸福，并判断：念头没有完成，究竟算夭折，还是仍在暗处继续思考我们。
