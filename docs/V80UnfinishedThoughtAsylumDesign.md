# v80 未遂思想收容所 / ASYLUM FOR UNFINISHED THOUGHTS

版本：v80 已实现并通过独立验收
状态：生产前端、测试与缺陷修复已完成；Codex 本地静态门禁与真实浏览器 QA 通过
职责：Gemini 3.7 Flash High 生产前端 / 测试 / 缺陷修复 / 实现文档；Codex 设计 / 生图 / 应用输出 / 诊断 / 真实浏览器 QA / 证据

## 核心命题

未言之句取得完整人格后，所有被打断、删去或不敢想完的念头都开始申诉：它们不是废稿，而是被理智提前处决的可能人生。收容所把这些半截思想安置在透明病房里，试图判断它们究竟已经夭折，还是仍在暗处借用我们继续思考。

玩家依次选择：

1. 一种要求继续存在的未遂思想；
2. 一份证明思考曾经发生的中断痕迹；
3. 一种会改写思想完成标准的收容疗法；

形成 `3 × 3 × 4 = 36` 份思想收容令。每次收容后，一名未完医师停留在对应旧场景；三轴全部覆盖后，最后结论听证庭开放，产生三条新的思想结局。

## 解锁合同

v80 只读 v79，不写 v79 或更早状态。

`unfinishedThoughtAsylumUnlocked()` 必须同时满足：

- `unspokenPersonhoodCourtUnlocked()` 为真；
- v79 grants 覆盖三种 claimant、三种 evidence、四种 mode；
- v79 `tribunalOutcomes` 精确包含：
  - `an-unsaid-sentence-inherited-a-whole-life`
  - `personhood-was-divided-among-the-unhearing`
  - `the-speaker-became-the-estate-of-last-silence`

任一前置缺失时，v80 getter 返回默认态，四个 direct hash 全回 `#remembrance`；入口、记忆、39 格图鉴、目录和三处未完医师全部隐藏。

## 新场景

1. `#unfinished-thought-asylum`：未遂思想收容所，选择三种未遂思想。
2. `#interruption-trace-archive`：中断痕迹档案室，选择三份中断证据。
3. `#counterfactual-treatment-lab`：反事实疗法室，选择四项收容疗法。
4. `#last-conclusion-hearing`：最后结论听证庭，执行三项最终裁定。

场景总数：`149 → 153`。

## 第一幕：未遂思想收容所

标题：`05μ / 未遂思想收容所 · ASYLUM FOR UNFINISHED THOUGHTS`
图：`assets/v80-unfinished-thought-asylum.webp`

三间透明收容室横向展开。左侧半张空白姓名牌围绕一枚还在转动的问号形黄铜骨架；中央未完成逃亡路线从折断楼梯延伸到封死门前；右侧一座温暖却无人获准进入的小屋，被暗红禁令蜡封在玻璃内。三块热点不重叠，桌面与移动端均 `≥44px`。

### 三种未遂思想

| thought | 按钮 | feedback | tally |
|---|---|---|---|
| `name-never-finished-thinking` | `收容没想完的名字 · ADMIT THE NAME NEVER FINISHED` | `半个名字在病房里继续长出笔画。它还不知道自己指向谁，却已经害怕被另一个人完整地想起。` | `name` |
| `escape-aborted-by-reason` | `收容被理智中止的逃亡 · ADMIT THE ESCAPE ABORTED BY REASON` | `折断路线每天在墙上多走一步。身体从未离开，逃亡却坚持自己早已在别处活到晚年。` | `escape` |
| `happiness-never-permitted` | `收容不准拥有的幸福 · ADMIT THE HAPPINESS NEVER PERMITTED` | `玻璃里的小屋亮着灯。你一次也没有住进去，它却能说出每个房间如何记住你的脚步。` | `happiness` |

选中 thought 后创建 pending，显示逐字反馈并进入 `#interruption-trace-archive`；只在 target arrival 写入 `draft.thought` 与 `visited.archive`。

## 第二幕：中断痕迹档案室

标题：`05ν / 中断痕迹档案室 · ARCHIVE OF INTERRUPTION TRACES`
图：`assets/v80-interruption-trace-archive.webp`

档案室陈列三份中断证据：悬停在空白名牌前的半落黄铜笔尖；在门前突然冻结的最后一步脚印；被黑线划掉、仍从纸背透出暖光的未来日历。三块热点不重叠、`≥44px`。

### 三份中断痕迹

| trace | 按钮 | feedback | target |
|---|---|---|---|
| `pen-stopped-before-the-name` | `提交停在名字前的笔 · SUBMIT THE PEN STOPPED BEFORE THE NAME` | `笔尖保存着下一笔的重量。姓名没有形成，纸面却已被一个尚不存在的人压出凹痕。` | `blank-name-cloakroom` |
| `last-step-before-the-door` | `提交门前最后一步 · SUBMIT THE LAST STEP BEFORE THE DOOR` | `脚印停在门槛前，鞋底却沾着门外多年的尘。档案员无法判断身体退回去，还是未来独自越过了门。` | `reverse-stairwell` |
| `crossed-out-future-calendar` | `提交被划掉的未来日历 · SUBMIT THE CROSSED-OUT FUTURE CALENDAR` | `黑线删掉所有幸福的日期，纸背仍持续发热。那些日子没有发生，却像被谁认真怀念过。` | `unlived-nursery` |

选中 trace 后进入 `#counterfactual-treatment-lab`；只在 target arrival 写入 `draft.trace` 与 `visited.lab`。

## 第三幕：反事实疗法室

标题：`05ξ / 反事实疗法室 · COUNTERFACTUAL TREATMENT LAB`
图：`assets/v80-counterfactual-treatment-lab.webp`

四台疗法机围住中央透明脑室：左上黄铜续写臂替断句接上另一种结尾；左下骨针缝合两条互斥思路；右上暗红封存罐让半截念头保持永久未完；右下镜面交换器把念头移植给另一个可能的自己。四块热点不重叠、`≥44px`。

### 四项收容疗法

| therapy | 按钮 | fragment |
|---|---|---|
| `finish-it-with-a-foreign-conclusion` | `用陌生结论完成它 · FINISH IT WITH A FOREIGN CONCLUSION` | `续写臂替念头安上一种它从未选择的结尾。句子终于完整，却开始梦见原来那片空白。` |
| `stitch-mutually-exclusive-thoughts` | `缝合互斥思想 · STITCH MUTUALLY EXCLUSIVE THOUGHTS` | `骨针把逃走与留下缝成同一条思路。病历宣布冲突已经治愈，身体却同时出现在门的两边。` |
| `preserve-it-as-perpetually-unfinished` | `永久保留未完成 · PRESERVE IT AS PERPETUALLY UNFINISHED` | `暗红封存罐禁止结论抵达。思想因此永不死亡，也永远差最后一步才能证明自己活着。` |
| `transplant-it-into-another-possible-self` | `移植给另一个可能的自己 · TRANSPLANT IT INTO ANOTHER POSSIBLE SELF` | `镜面交换器把念头送给另一种你。那个人立刻把它想完，而你只继承完成之后莫名其妙的后悔。` |

收容令 id 固定为 `thought:trace:therapy`。标题由三轴中文标题拼接；feedback 由三轴 fragment 逐字拼接，不接受存档自由文本。

点击 therapy 后创建 admission pending，固定 `source=counterfactual-treatment-lab`，并转到 trace 对应旧场景。只在 target arrival 原子执行：

- `admissionRuns +1`；
- 对应 `thoughtTallies +1`；
- admission 首次进入图鉴；
- `lastOutcome` 更新；
- `activePhysician` 建立；
- draft / pending 清空。

重复收容令不重复图鉴，但仍增加真实治疗次数与思想票数；source 刷新不提前结算，target 刷新不重复结算。

## 三处旧场景未完医师

| trace | 旧场景 | 返回按钮 | activePhysician feedback |
|---|---|---|---|
| `pen-stopped-before-the-name` | `blank-name-cloakroom` | `跟停笔医师返回收容所 · RETURN WITH THE STOPPED-PEN PHYSICIAN` | `停笔医师在空名寄存处找到半个姓名。衣钩认得它，寄存凭据却坚持还没有足够的人可以领取。` |
| `last-step-before-the-door` | `reverse-stairwell` | `跟门前医师返回收容所 · RETURN WITH THE LAST-STEP PHYSICIAN` | `门前医师沿逆向楼梯追查最后一步。每往下一级，脚印就更接近一个从未出发的远方。` |
| `crossed-out-future-calendar` | `unlived-nursery` | `跟删日医师返回收容所 · RETURN WITH THE CROSSED-DATE PHYSICIAN` | `删日医师在未活托儿所挂起未来日历。孩子们认得每个被划掉的生日，却不认得本来会来庆祝的你。` |

activePhysician 只在准确 target 出现。返回后清 activePhysician，进入未遂思想收容所；旧反馈、pending、图鉴、通知与入口不得被覆盖。

## 覆盖与最后结论听证

`unfinishedThoughtCoverageComplete()` 从规范 admissions 实时重算：三 thought、三 trace、四 therapy 全覆盖且至少四份。三份失败，四份代表收容令成功。

覆盖后痕迹室显示：

`决定思想必须在哪里结束 · DECIDE WHERE A THOUGHT IS REQUIRED TO END`

进入 `#last-conclusion-hearing`。

标题：`05ο / 最后结论听证庭 · HEARING OF THE LAST CONCLUSION`
图：`assets/v80-last-conclusion-hearing.webp`

### 三项思想裁定

| action | 按钮 | outcome | target | feedback |
|---|---|---|---|---|
| `declare-every-unfinished-thought-alive` | `宣布所有未遂思想仍活着 · DECLARE EVERY UNFINISHED THOUGHT ALIVE` | `every-unfinished-thought-kept-living` | `remembrance` | `所有半句同时恢复心跳。痕迹墙挤满没有结论的人生，每一条都要求身体为它继续活一次。` |
| `let-the-thought-finish-its-thinker` | `让思想完成思考者 · LET THE THOUGHT FINISH ITS THINKER` | `the-thought-completed-its-thinker` | `unending-gallery` | `念头不再等待你把它想完。它替你补上最后一部分人格，并把原来的你标成一段成功完成的前言。` |
| `recycle-all-abandoned-possibilities` | `回收全部被放弃的可能 · RECYCLE ALL ABANDONED POSSIBILITIES` | `all-abandoned-possibilities-were-recycled` | `counterfactual-spindle` | `收容室把逃亡、姓名与幸福拆成可重用零件。下一种人生拿走它们，而你只收到一张写着用途不明的后悔收据。` |

每次合法 target arrival：`hearingRuns +1`；outcome 首次进入 `hearingOutcomes`；`lastOutcome` 更新；pending 清空。重复裁定仍增加 hearingRuns，不重复图鉴。

## 状态合同

唯一 key：`goddead_v80_unfinished_thought_asylum`
version：`80`

```js
{
  version: 80,
  visited: { asylum: false, archive: false, lab: false, hearing: false },
  draft: { thought: '', trace: '' },
  admissions: [],
  hearingOutcomes: [],
  admissionRuns: 0,
  hearingRuns: 0,
  thoughtTallies: { name: 0, escape: 0, happiness: 0 },
  lastOutcome: '',
  activePhysician: null,
  pending: null
}
```

规范十一键：visited / draft 精确投影；admissions 固定 `THOUGHTS × TRACES × THERAPIES` 顺序去重；hearingOutcomes 固定 action 顺序；runs / tallies floor + clamp `0..9999`；lastOutcome 只指向规范结果；activePhysician 精确 `{trace,admission,feedback}` 且从表反算；坏 JSON/version/type/未解锁回默认；v80 不写旧 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`。
2. `thought`：`{kind,source,thought,target,feedback}`。
3. `trace`：`{kind,source,thought,trace,target,feedback}`。
4. `admission`：`{kind,source,thought,trace,therapy,admission,target,feedback}`。
5. `physician-return`：`{kind,from,target,admission,feedback}`。
6. `hearing-entry`：`{kind,target,feedback}`。
7. `hearing`：`{kind,source,action,outcome,target,feedback}`。

全部 exact-key、逐字反算；target 一次结算，source 恢复并只排一次，else 清理，刷新幂等。

## UI / 路由 / 交互防线

四新场景使用 visited + 合法 pending/draft/coverage 守卫；三个旧 target 只增加 v80 合法窄桥，不收窄旧准入、不放宽其他守卫。

记忆行：

`未遂思想收容所：已收容 N/36 份思想，共治疗 R 次；思想 半名 N / 逃亡 E / 幸福 H；痕迹 停笔 P / 门步 S / 删日 C；疗法 陌结 F / 缝思 T / 永未 U / 移植 R；思想多数 Q；听证结局 X/3。`

图鉴 39 格，目录四项 `05μ / 05ν / 05ξ / 05ο`。forget-all 清 v80 key、AutoAdvance、draft、activePhysician、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个医师；不写 v79。

恰好 18 个 v80 click listener：普通入口 1、hearing 入口 1、thought 3、trace 3、therapy 4、physician-return 3、hearing 3；第一句 `if (!e.isTrusted) return;`。choose 复核 scene / figure / button / draft / pending；合成点击零副作用，真实输入可玩。

## 素材合同

全部 `1536×1024`，无文字/logo/UI/水印；WebP 使用 Pillow `quality=85, method=6`，不裁切、不拉伸。

| source PNG | runtime WebP |
|---|---|
| `design-references/source-v80-unfinished-thought-asylum.png`（2661767 B / `046ec7b50c19887bc9f05fe1c7a9380bb3580dfc2e00ac599354f1b77fd35004`） | `assets/v80-unfinished-thought-asylum.webp`（254726 B / `f1bbdad709273778b3c83e53b956456735b464555907ce8fe0eed462c151a8b3`） |
| `design-references/source-v80-interruption-trace-archive.png`（2962298 B / `13c6c6b6c1ae11fc2230f2546c41092d9dd796f1d037af191029275609f78946`） | `assets/v80-interruption-trace-archive.webp`（250326 B / `8731c14525137c4fa9fc189154653ba6ff3f77759499532d0d32d02f59c98866`） |
| `design-references/source-v80-counterfactual-treatment-lab.png`（2400656 B / `67f38d585c150104abe3b2ba2edb84369f5ef007e006ff803f5e5c54fbf94427`） | `assets/v80-counterfactual-treatment-lab.webp`（207634 B / `b567e3953265bf11d1417f53fbe99cf6060aae3e4b6840e6bc12afc5eccdbf3e`） |
| `design-references/source-v80-last-conclusion-hearing.png`（2902017 B / `ab1a6626ed4d75b7dec829dc509a2705bdf38b04a7cce1146f0fdba7064eae4e`） | `assets/v80-last-conclusion-hearing.webp`（310448 B / `bc58efe9b42e2fe4a67fc5927159967cc2ac8dc699796a3d66db13dbe705bfc4`） |

## 静态与浏览器门槛

- cache `v=80`，153 场景，四幕标题 / 路由 / preload / 目录；
- 解锁只读 v79；十一键、36+3、七 pending、三 activePhysician、四份 coverage、18 isTrusted、forget-all、v79 回归；
- 整页主初始化链必须包含 v80 全套 sync / paint / replay，禁止只测隔离模块；
- Codex 浏览器验桌面/手机、真实三段点击、三个旧场景回程、coverage/听证/刷新/坏档/console。

## 实现与独立验收

- v80 已新增四场景并把总数扩为 153；3×3×4=36 admissions、3 hearing outcomes、39 格图鉴、canonical 十一键、7 类 pending、18 个 `isTrusted` listener 与三处旧场景医师均已接线。
- 修复运行时 `_v79unlocked` 分离、`unlived-nursery` 窄桥、pending source / target 抵达结算、trace 三层空值单选、forget-all，以及 hearing target 的两阶段 hashchange 派生授权；不新增持久字段，不放宽 sibling / 伪造 outcome。
- 最终门禁为 `site.test.mjs: 12213 assertions passed`，两个 node --check 与 `git diff --check` 全绿。
- Computer Use 在同一个 Chrome 窗口 / 标签页完成代表 admission、cold pending、四幕桌面看图、两幕移动看图与两条 hearing 真点击；移动 viewport 500×778、documentWidth 500、无横溢，asylum 热点 124×215 / 147×215 / 124×215。
- 证据：`design-qa-evidence/v80-browser-qa.json`、`design-qa-evidence/v80-unfinished-thought-asylum-desktop.jpeg`、`design-qa-evidence/v80-last-conclusion-hearing-desktop.jpeg`、`design-qa-evidence/v80-unfinished-thought-asylum-mobile.jpeg`、`design-qa-evidence/v80-last-conclusion-hearing-mobile.jpeg`。
- 本轮仅本地验收，未 commit、push、deploy 或发布。

## v81 活口

所有被放弃的可能被拆成零件后，世界第一次获得可交易的“后悔原料”。下一站开放：

`后悔回收厂 / REGRET RECLAMATION PLANT`

它会把没走的路、没爱的人和没成为的自己熔成新人生，并追问：当后悔可以再利用，原谅是否只是最低效的废物处理方式。
