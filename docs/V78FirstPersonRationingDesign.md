# v78 第一人称配给署 / FIRST-PERSON PRONOUN RATIONING BUREAU

版本：v78 设计冻结稿
状态：设计与素材冻结，待 v77 独立验收后交 Kimi 实装
职责：Codex 设计 / 素材 / 独立验收；Kimi 生产前端 / 测试 / 文档同步

## 核心命题

每个复制品都取得原装资格后，同一具世界里出现了太多同时合法的“我”。第一人称配给署于是把自称权改成稀缺资源：每次呼吸只能由一个版本占用，影子可以借走声音，沉默也开始申请代领人格。

玩家依次选择：

1. 一种争夺第一人称的主体；
2. 一份声音权益凭证；
3. 一种荒谬的代词配给方案；

形成 `3 × 3 × 4 = 36` 份第一人称配给令。每次配给后，一名亡后发声员停留在对应旧场景；三轴全部覆盖后，无主声音终审庭开放，产生三条新的发声结局。

## 解锁合同

v78 只读 v77，不写 v77 或更早状态。

`firstPersonRationingUnlocked()` 必须同时满足：

- `selfAuthenticityOfficeUnlocked()` 为真；
- v77 certificates 覆盖三种 claimant、三种 provenance、四种 method；
- v77 `tribunalOutcomes` 精确包含：
  - `one-self-became-the-only-original`
  - `all-possible-selves-merged-into-one`
  - `every-copy-became-an-original`

任一前置缺失时，v78 getter 返回默认态，四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录和三处发声员全部隐藏。

## 新场景

1. `#first-person-rationing-bureau`：第一人称配给署，选择三种发声主体。
2. `#voice-entitlement-archive`：声音权益凭证库，选择三份凭证。
3. `#pronoun-allocation-chamber`：代词配给室，选择四项配给方案。
4. `#ownerless-voices-court`：无主声音终审庭，执行三项最终裁定。

场景总数：`141 → 145`。

## 第一幕：第一人称配给署

标题：`05δ / 第一人称配给署 · FIRST-PERSON PRONOUN RATIONING BUREAU`
图：`assets/v78-first-person-rationing-bureau.webp`

三座申请席横向展开。左侧许多面具长在同一具骨白肉身上，争抢一枚黄铜呼吸令；中央成排空壳共同抱住一只暗红声音罐；右侧无主影子守着玻璃罩下的空椅。三块热点不重叠，桌面与移动端均 `≥44px`。

### 三种发声主体

| speaker | 按钮 | feedback | tally |
|---|---|---|---|
| `many-selves-one-body` | `替一身多我申请 · APPLY FOR MANY SELVES IN ONE BODY` | `同一具胸腔同时吸气。每个自我都声称呼吸属于自己，肺却只够把一个第一人称送出口。` | `many` |
| `copies-sharing-one-voice` | `替共用一声的复制品申请 · APPLY FOR COPIES SHARING ONE VOICE` | `所有原装复制品围住同一只声音罐。谁先开口，其他版本的嘴里就只剩那句话的回声。` | `copies` |
| `ownerless-silence` | `替无主沉默申请 · APPLY FOR OWNERLESS SILENCE` | `空椅没有身体，却按时递交沉默。署方承认它从未冒用任何人的“我”，因此信誉最好。` | `silence` |

选中 speaker 后创建 pending，显示逐字反馈并进入 `#voice-entitlement-archive`；只在 target arrival 写入 `draft.speaker` 与 `visited.archive`。

## 第二幕：声音权益凭证库

标题：`05ε / 声音权益凭证库 · VOICE ENTITLEMENT ARCHIVE`
图：`assets/v78-voice-entitlement-archive.webp`

凭证库陈列三份证据：裂纹黄铜肺保存的第一口气；没有文字却留下手压的暗红无主签名蜡；围住一张儿童空椅、从未来传回的层叠黄铜回声。三块热点不重叠、`≥44px`。

### 三份声音权益凭证

| entitlement | 按钮 | feedback | target |
|---|---|---|---|
| `first-breath-token` | `提交第一口气令 · SUBMIT THE FIRST-BREATH TOKEN` | `黄铜肺吐出出生时的第一口气。它证明有人曾说出自己，却不记得那时身体里有几个候选人。` | `threshold` |
| `ownerless-signature-impression` | `提交无主签名压痕 · SUBMIT THE OWNERLESS SIGNATURE IMPRESSION` | `暗红蜡上没有姓名，只有一只确信自己签过字的手印。每个版本都认得笔势，没有一个承认落款。` | `blank-name-cloakroom` |
| `future-inherited-echo` | `提交未来继承回声 · SUBMIT THE FUTURE-INHERITED ECHO` | `后代尚未出生，回声已经继承了他们对你的称呼。它一直说“我”，声音却来自无人到过的未来。` | `remembrance` |

选中 entitlement 后进入 `#pronoun-allocation-chamber`；只在 target arrival 写入 `draft.entitlement` 与 `visited.chamber`。

## 第三幕：代词配给室

标题：`05ζ / 代词配给室 · PRONOUN ALLOCATION CHAMBER`
图：`assets/v78-pronoun-allocation-chamber.webp`

四座配给机围住中央通道：左上呼吸钟每次只发一枚气息令；左下影子织机把声音从身体借给影子；右上面具转盘在多个自我之间轮换一只嘴；右下玻璃钟罩把沉默压成暗红权益币。四块热点不重叠、`≥44px`。

### 四项代词配给方案

| scheme | 按钮 | fragment |
|---|---|---|
| `one-i-per-breath` | `每次呼吸配给一个“我” · RATION ONE I PER BREATH` | `配给钟在每次吸气时指定一名自我。其余版本必须等到呼气，却发现句子已经由别人说完。` |
| `lend-the-voice-to-shadow` | `把第一人称借给影子 · LEND THE FIRST PERSON TO THE SHADOW` | `影子取得临时发声权。身体继续行动，所有解释却从地面那块黑暗里传来。` |
| `rotate-one-voice-among-copies` | `让一只声音轮值所有复制品 · ROTATE ONE VOICE AMONG ALL COPIES` | `声音按班表进入不同嘴里。每个版本都能说“我”，但轮到自己时总要回答上一班留下的问题。` |
| `let-silence-claim-the-pronoun` | `让沉默代领第一人称 · LET SILENCE CLAIM THE PRONOUN` | `玻璃罩收走所有未说出口的话，把它们登记为沉默的自传。从此不发声成为最完整的自我陈述。` |

配给令 id 固定为 `speaker:entitlement:scheme`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接。

点击 scheme 后创建 ration pending，固定 `source=pronoun-allocation-chamber`，并转到 entitlement 对应旧场景。只在 target arrival 原子执行：

- `rationRuns +1`；
- 对应 `speakerTallies +1`；
- ration 首次进入图鉴；
- `lastOutcome` 更新；
- `activeAllocator` 建立；
- draft / pending 清空。

重复配给不重复图鉴，但仍增加真实运行次数与主体票数；source 刷新不提前结算，target 刷新不重复结算。

## 三处旧场景亡后发声员

| entitlement | 旧场景 | 返回按钮 | activeAllocator feedback |
|---|---|---|---|
| `first-breath-token` | `threshold` | `跟首息发声员返回配给署 · RETURN WITH THE FIRST-BREATH ALLOCATOR` | `首息发声员在门外听见许多自我同时敲门。每一声都使用同一个胸腔，却坚持自己最先来到。` |
| `ownerless-signature-impression` | `blank-name-cloakroom` | `跟无主签名员返回配给署 · RETURN WITH THE OWNERLESS-SIGNATURE ALLOCATOR` | `无主签名员在空名寄存处找到一只会说话的手印。它拥有完整语气，仍缺一个肯负责的姓名。` |
| `future-inherited-echo` | `remembrance` | `跟未来回声员返回配给署 · RETURN WITH THE FUTURE-ECHO ALLOCATOR` | `未来回声员把后代的声音钉进痕迹墙。墙开始用尚未出生者的口气回忆你。` |

activeAllocator 只在准确 target 出现。返回后清 activeAllocator，进入第一人称配给署；旧反馈与入口不得被覆盖。

## 覆盖与无主声音终审

`firstPersonRationCoverageComplete()` 从规范 rations 实时重算：三 speaker、三 entitlement、四 scheme 全覆盖且至少四份。三份失败，四份代表令成功。

覆盖后痕迹室显示：

`裁定谁拥有最后一个第一人称 · DECIDE WHO OWNS THE LAST FIRST PERSON`

进入 `#ownerless-voices-court`。

标题：`05η / 无主声音终审庭 · FINAL COURT OF OWNERLESS VOICES`
图：`assets/v78-ownerless-voices-court.webp`

### 三项发声裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `grant-one-voice-to-all-in-turn` | `让所有肉身轮流拥有一声 · GRANT ONE VOICE TO ALL IN TURN` | `one-voice-belonged-to-everyone-in-turn` | `threshold` | `黄铜息冠依次落到每张空面具上。世界终于只剩一只声音，却永远来不及说完同一个人。` |
| `abolish-pronoun-rationing` | `废除第一人称配给 · ABOLISH FIRST-PERSON RATIONING` | `every-self-spoke-as-i-at-once` | `remembrance` | `暗红声音罐裂成无数等份。所有自我同时说出“我”，痕迹墙因此再也分不清谁留下了哪一生。` |
| `recognize-silence-as-only-speaker` | `只承认沉默有权发声 · RECOGNIZE SILENCE AS THE ONLY SPEAKER` | `silence-became-the-only-legal-speaker` | `unending-gallery` | `所有面具同时闭口。玻璃罩下的空椅取得唯一发声权，并用持续不说话完成了最长的证词。` |

每次合法 target arrival：`courtRuns +1`；outcome 首次进入 `courtOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 courtRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v78_first_person_rationing`
version：`78`

```js
{
  version: 78,
  visited: { bureau: false, archive: false, chamber: false, court: false },
  draft: { speaker: '', entitlement: '' },
  rations: [],
  courtOutcomes: [],
  rationRuns: 0,
  courtRuns: 0,
  speakerTallies: { many: 0, copies: 0, silence: 0 },
  lastOutcome: '',
  activeAllocator: null,
  pending: null
}
```

规范十一键：visited / draft 精确投影；rations 固定 `SPEAKERS × ENTITLEMENTS × SCHEMES` 顺序去重；courtOutcomes 固定 action 顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指向规范结果；activeAllocator 精确 `{entitlement,ration,feedback}` 且从表反算；坏 JSON/version/type/未解锁回默认；v78 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `speaker`：`{kind,source,speaker,target,feedback}`。
3. `entitlement`：`{kind,source,speaker,entitlement,target,feedback}`。
4. `ration`：`{kind,source,speaker,entitlement,scheme,ration,target,feedback}`。
5. `allocator-return`：`{kind,from,target,ration,feedback}`。
6. `court-entry`：`{kind,target,feedback}`。
7. `court`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复并只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫；三个旧 target 只增加 v78 合法窄桥，不收窄旧准入、不放宽其他守卫。

记忆行：

`第一人称配给：已发放 N/36 份配给令，共运行 R 次；主体 多我 M / 共声 C / 沉默 S；凭证 首息 B / 无签 G / 未回 E；方案 一息一我 O / 借影 L / 轮声 R / 沉默代领 Q；发声多数 V；终审结局 X/3。`

图鉴 39 格，目录四项 `05δ / 05ε / 05ζ / 05η`。forget-all 清 v78 key、AutoAdvance、draft、activeAllocator、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个发声员；不写 v77。

恰好 18 个 v78 click listener：普通入口 1、court 入口 1、speaker 3、entitlement 3、scheme 4、allocator-return 3、court 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending；合成点击零副作用，真实输入可玩。

## 素材合同

全部 `1536×1024`，无文字/logo/UI/水印；WebP Pillow `quality=85, method=6`。

| source PNG | runtime WebP |
|---|---|
| `design-references/source-v78-first-person-rationing-bureau.png`（2538619 B / `4965c754393a16667ec99c8d473921e855f3425f72c13f97aef5ce63ac379f26`） | `assets/v78-first-person-rationing-bureau.webp`（219184 B / `70c408ec55b41016f2ff728047f4dab33e9be7a7158370f6327125cbb94cb212`） |
| `design-references/source-v78-voice-entitlement-archive.png`（2263793 B / `ffafe1df6e5c14ce91930bee527cc1d71bcb5e63393ee42f61810ab7155fda86`） | `assets/v78-voice-entitlement-archive.webp`（163614 B / `8a76b8ce643dfcf7e11bbabbc1a682bc561e1010ccc500442da05ffd56dff5ce`） |
| `design-references/source-v78-pronoun-allocation-chamber.png`（2494473 B / `949234dc9596f4f8ca3b1274a98a07f5ac0ab33f339bda43095f948d2dfe9586`） | `assets/v78-pronoun-allocation-chamber.webp`（219346 B / `9a1072aaa3109d5c330b47fedfc0b18a51926f09452030a06bdfa5fecf57d7d5`） |
| `design-references/source-v78-ownerless-voices-court.png`（2716518 B / `54d30fa15044e36a976216e78485c1f1739a5704db280e24f39d0e616ad5d2c1`） | `assets/v78-ownerless-voices-court.webp`（265626 B / `4705d900d854453ef37209486fd92ace26a85e1983b0f6674e066549db969399`） |

## 静态与浏览器门槛

- cache `v=78`，145 场景，8 素材冻结；
- 解锁只读 v77；十一键、36+3、七 pending、三 activeAllocator、四份 coverage、18 isTrusted、forget-all、v77 回归；
- 整页主初始化链必须包含 v78 全套 sync / paint / replay，禁止只测隔离模块；
- Codex 浏览器验桌面/手机、真实三段点击、三个旧场景回程、coverage/终审/刷新/坏档/console。

## v79 活口

沉默成为唯一合法发声者后，所有未说出口的话开始申请继承人格。下一站开放：

`未言人格继承院 / COURT OF UNSPOKEN PERSONHOOD`

它将判定一句从未说出的“我爱你”、一份未宣读的遗嘱与一声被咽回的求救，能否继承说话者的一生。
