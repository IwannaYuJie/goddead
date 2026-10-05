# v102 没有天气的候车亭 · 设计冻结

2026-10-02。基线：本地 v101 / 226 个唯一场景 / cache101；HEAD 仍为 v100 `952d75c`，v101 未提交或发布。继续保存该轮全部改动与三个原有无关文档。Codex 负责设计、内置生图与单页 Computer Use；`gemini-3.7-flash-high` 是生产前端、生产测试与实现文档的唯一作者。本设计已落地为229场景/cache102；真实单页三类送达、重复冬起班、编辑与冷恢复通过，原21项存档已还原。完整自动测试收尾结果以本轮QA记录为准。

## 故事与真正的操作

昼夜终于穿过织机，季节却仍等在门外。候车亭的玻璃不结露，雨落到屋檐前会停住。时刻表没有时间，只有四个空着的到站位置。你可以给春雨、盛夏、落叶、霜雪重新排班。

> 天气没有迟到。它们只是各自拿着一张写着“下一班”的车票。

新玩法不是继续三物件×三处理，也不是另开裁定法庭。玩家亲手把四个季节排入四个到站位置，24 种有效排列直接派生三类结局。任意季节可以先到；没有唯一正确答案，没有倒计时或必须拖动的动作。实际排列和先到季节会进入预览、签收与图鉴，不能只做三个结局快捷按钮。

## 场景与入口

新增 3 场景，226→229，静态资源版本升为102：

| hash | 中文 | 功能 |
| --- | --- | --- |
| `weatherless-bus-shelter` | 没有天气的候车亭 | 故事、已有草稿继续 / 新排一班、三种收集结果、未返回回执的精确找回链接 |
| `season-dispatch-board` | 四季排班牌 | 四季车票选择、4 个原生到站按钮、即时次序预览与判定、样例说明 |
| `four-season-platform` | 四季站台 | 同一排列预览、对应先到天气的短故事、发车或撤回改班 |

入口在痕迹室 v101 图鉴之后；另在 `threshold` 原来的织造入口旁加独立“雨还没落下来”入口。推荐 `#ws-entry-remembrance` / `#ws-entry-threshold`，两者各自有即时反馈。整合现有痕迹室折叠柜与“找到入口”功能。保留 v101 钩子文字，把它连到实际新入口，不继续标成未实装。

解锁只读归一化 v101：`dawnWeavingUnlocked()` 且 `DW_ENDING_IDS` 三项都已收集。临时可用还需 `dawnWeavingAvailable()`（含 v100 在途检查）以及 v101 的 pending、activeCourier 均空；旧回执必须先返回，但任何旧状态都不能被新章清掉。入口/路由/编辑/预览/重播/签收均使用同一实时可用条件。

## 排班牌

季节域固定顺序 `spring`, `summer`, `autumn`, `winter`，显示为“春雨 / 盛夏 / 落叶 / 霜雪”。合法草稿是长度4的数组，各项为 null 或以上字符串；非空项不重复。初始 `[null,null,null,null]`。

四个季节选择按钮仅改变内存中的当前车票，不落存档、不算进度；另有“取下车票”模式。当前选中必须有文字、aria-pressed 与形状区别，不能只靠色彩。默认春雨。到站槽按从左到右 1–4 排列（先到 / 第二站 / 第三站 / 最后），按钮 aria-label 含序号、当前天气和操作意义。

点车票再点槽位：

- 该车票不在牌上：替换目标格，原票取回，其他格不变。
- 该票已在另一格：交换两格；目标为空则移动到空位，原位置变空。
- 已在当前格：保持不变，不增加次数、不重复宣布变更。
- “取下”模式：将该格置空。

四个季节必须各出现一次才可“去站台看看”。不完整只提示还缺哪些天气，不偷补空格、不判结局。编辑与预览都不记发车次数。每次合法变化持久化草稿，点击后焦点留在原槽；鼠标、触屏、真实 Tab+Enter/Space 都使用同一 native button 路径。无需要拖拽的唯一操作。pending/activePassenger 时编辑和新班次闭锁。

样例按钮只显示三种标有“样例”的独立小排列和判定说明，循环展示，不自动代填、不写草稿、不增加收集。样例为春夏秋冬 / 春冬秋夏 / 春秋夏冬。

## 24 种班次的判定与故事

把季节域映射为0–3，只对完整、唯一的4票排列判定。三个连续差值都为 `+1 mod4` 是顺季循环；都为 `-1 mod4` 是倒季循环；其余是分季班。环形旋转允许任意起点，因此24排列分布为4 / 4 / 16，不能硬编码仅两个样例，也不能按第一个季节猜结果。

| 类别 | ending id | 结局 | 精确旧落点 | 故事 |
| --- | --- | --- | --- | --- |
| 顺季循环 | `the-weather-finally-boarded` | 天气终于上车 | `threshold` 门外 | 门外开始有了下一场天气。你站在屋檐下，第一次知道等雨停是什么意思。 |
| 倒季循环 | `the-seasons-returned-to-yesterday` | 季节退回昨天 | `minute-before-archive` 前一分钟档案井 | 井底出现了尚未发生的积雪。每翻一页，季节便后退一步，直到昨天也开始发芽。 |
| 分季班 | `each-season-found-its-own-stop` | 各过各的季节 | `unending-gallery` 无终局陈列廊 | 四季坐进不同的画框，没有谁再催下一季。相邻的框仍能听见彼此的天气。 |

预览/签收显示具体4票顺序。依据第一票追加一句天气开场，使三类结局各有四种实际余味，不另造12个必须全收集的成就：春雨“先到站的春雨在檐下停住。”；盛夏“盛夏递来一张发热的车票。”；落叶“第一片落叶替你占好了座位。”；霜雪“霜雪把没有脚印的路先铺了一遍。”

一班天气足够初次游玩；三种结果集齐即完整章节，不要求刷完24排列。保留每个结果最新送达的真实排列，可换首季、换分季排列重复发车。三结果后在痕迹室留下 v103 钩子“收不到影子的照相馆”：天气都会赴约，只有影子没来。

## 到站与回程

板→站台只是试行预览，不记 runs/endings。站台可“撤回改班”，草稿完整保留。确认“让这一班发车”重新核验当前scene、完整草稿、派生ending与实时权限，冻结精确目标与排列。到旧目标才 runs+1、去重 endings、更新该 ending 的 latestOrderByEnding、设 activePassenger 并清 pending；已送草稿归空。途中刷新只续播，目标刷新不能重复记账。

三旧目标独立“天气到站”签收面板：排列、先到天气开场、结果故事和“带着车票回候车亭”。面板横跨旧grid，使用 aside/div 而非嵌套 scene section，保留原有按钮/布局/行为。旧页另可有已完成的最新班次回声，不给未取得结果显示假记录。

activePassenger 尚未返回，候车亭提供正确 `#target` 找回链接，新排班/继续按钮禁用。回来抵达亭才清 activePassenger。收起未完整草稿（board→hall）不加 runs、保留排列；新排一班显式清草稿，已有结果保留。

### 前一分钟档案井的旧机制共存

该 hash 无需扩旧guard。`sceneInit` 的 `if (RELIEF_SCENE_NAMES.includes(name)) enterRelief(RELIEF_NAME_SCENE[name]);` 会执行 v45 markReliefVisited，并可能重排 scope `relief-minute` 的旧pending timer，抢走签收且写 v45。Gemini 必须加精确只读上下文：只有 name 是 `minute-before-archive` 且本章合法 depart.pending.target 或合法 activePassenger 的固定目标同为该井时，跳过这一条 enterRelief 调用。此处位于新章抵达结算前，合法 pending 必须也能被识别。

不得永久根据 lastOutcome 跳过 enterRelief，不得跳过其他场景初始化，不清 v45 pending，不删或重写旧井的三热点/执行员。普通、非本章签收情境访问仍执行原 v45 行为。正常串行 v102送达/回程的上游JSON需逐字节不变；一般旧场景自然游览原有写入不在这个承诺里。

该字节比较的验收前提是已完成上游、没有另一个旧章正在播放的pending，本轮规范上游fixture符合此条件。独立审查识别到v63画廊exit/secret与v85继承pending等旧sceneInit会自然重播、取消或结算；本轮保持这些既有语义，不把本章扩大成全站多章并发事务系统，也不宣称任意组合冷档都原样。v45区别在于正常天气签收本身就会调用首次到访记账（已有visited时不重复写）/旧scope重播，因此仍需要上述精确窄跳过。新章自己仅写独立键；v100/v101在途与v101未返车票是统一临时闭锁条件。

画廊等旧guard只扩窄回桥：合法本章 pending 的精确target / activePassenger 精确target / 已收集 lastOutcome 的固定target。不可放宽所有目标或整条旧剧情。所有桥仍检查归一化与实际权限。

## 存档与抵达规则

独立键 `goddead_v102_weatherless_shelter`，version102。建议9字段：version、visited{hall,board,platform}、draft{order}、endings、latestOrderByEnding、runs、lastOutcome、activePassenger、pending。内存选票与样例不持久化。

草稿含非法类型/未知票/重复票/错误长度则整组安全归空。计数0–9999；visited严格布尔；endings仅固定3id去重；lastOutcome必须已收集；latest只3固定key，值必须完整排列、分类吻合且该ending已收集，否则空值。activePassenger必须已收集、合法匹配分类且与该ending最新排列一致。损坏JSON容错，未知字段剥离，store.set失效memo缓存。正文使用textContent或节点，不拼存档HTML。

7类 pending：entry（threshold/remembrance→hall）、start（hall→board）、preview（board→platform）、revise（platform→board）、depart（platform→精确旧target）、passenger-return（旧target→hall）、abandon（board→hall）。按 kind 从真实草稿/activePassenger/domain表重建全部规范对象，与保存值严格一致才接受，反馈由固定文案重建。source抵达只还原反馈并续播，target只结算一次，不相关scene取消pending不落账。新路由需要合法到站pending或实际visited并具备合法对应草稿；不可硬编码threshold先清旧pending。

融入真实 sceneInit、replay、resolveScene、sync directory、remembrance codex、forget/AutoAdvance取消。采用 scene 独立first-lock，原生按钮拒绝非trusted/offscene/在途点击。使用与 v101 一致的 reduced-motion 与首击即时反馈，长过场可按现有空白处跳过。

## 美术与实际验收

3张1536×1024独立内置生图：石质无天气候车亭；四票黄铜排班牌，图中央留干净深色板面承载HTML；四季封闭车厢站台。煤黑旧石、黄铜、雨灰、春绿、夏金、叶锈、冬银，细节可见，天气变化比上一章黑金更明显。提示词与源图/运行图SHA记录在 V102ImagePrompts。每张WebP尽量<300KB，懒加载，不整章预加载。

四票按左右次序一直可读；390×844按钮≥44px、选票和取下功能同样可用，状态和说明放图片区下方正常流避免v101遮挡复发。季节同时有文字/图标/颜色；预览与故事可读、无横向溢出、可见焦点与无障碍标签。

Gemini须保留所有旧测试，v101模块切片结束边界从“下一步”改为唯一 exact v102 start，防止误吞新模块；新v102切片在guide前结束且有非空/唯一断言。测试实际 get/resolve/HTML listener/sceneInit调用，不仅测脱离生产的副本。24完整排列独立枚举对照4/4/16；所有4位空/唯一票组合共209个合法部分排列及非法输入；移动/交换/取下；7pending source/target/无关页冷恢复；抵达一次与重复结局；坏JSON/未知字段/伪造目标/上游在途；窄v45跳过与非本章访问不受影响；全局遗忘和实际进度入口映射。

Computer Use仅复用原Chrome游戏页，不开新窗口、不用Playwright：备份全部用户原存档，仅seed规范v82–v101已完成上游，本章从空档亲手完成顺季/倒季/分季三条发车→实际旧目标→回亭；重复另一个起点、交换票、取票、不完整预览禁用、撤回/放弃、source或target刷新、未返回找回、两入口、锁定深链。默认桌面与同页390×844，实际图片加载/console检查；完成后逐key恢复原存档、URL与viewport，撤QA键，保留一个预览页。

更新 README、GameplayFlow、ProgressLog、Tasks 和设计/图片/QA记录；精确区分函数测试与真实整页点击。保持本地，不自动commit/push/deploy。

## 本轮落地与验收

生产本章模块41,407字节，与Gemini最新返回逐字节一致，SHA256 `762988f4e9d8585498576aa0bbcc7cb76c7d984ccc1e6f1f74792ab917c9be87`。独立实际生产函数验收519断言/14组通过（含7种pending、21个新VM冷快照）；另独立209合法部分排列、4180次选票转换、24排列4/4/16均通过。真实生产sceneInit及真实v45初始化的7组独立窄跳过检查通过；其后Gemini把实际完整sceneInit+v45与本章normalize/resolve/replay的8情境共存检查纳入生产专用套件。其他旧章初始化仍为桩，不混称完整bootstrap。

真实Chrome同页从空v102档亲手排春夏秋冬、春冬秋夏、春秋夏冬，分别在门外、前一分钟档案井、无终局陈列廊签收返回；再排冬春夏秋，发车4次而独特结局仍3个，最新顺季记录正确变为冬起。实际移动、交换、取下、样例不代填、不完整禁用、收起后继续、改班/发车/收起途中刷新、未签收找回与两个入口通过。20项规范quiet上游JSON全程逐字节不变。原档锁定的三个新深链均回痕迹室且不产生本章存档。

CU发现新页标题被固定顶栏覆盖，Gemini仅把本章三页上留白改成5.75rem（92px）；实际桌面标题约121px、手机标题约121px，均低于顶栏72.09px的底边。排班牌按钮重新对齐画中石板；390×844四槽各46.84×44px、零横向溢出，三张图均complete且naturalWidth1536，warn/error读取为空。最终主套件18422断言、v101原12组与v102新增22组全通过，语法与diff检查通过；v102函数套件明确upstream/DOM/timer桩，独立真实上游链与实际CU分开记。截图、存档恢复与测试范围详见 `design-qa-evidence/v102-computer-use-20261002.md`。长期goal仍active，v103“收不到影子的照相馆”只是一条已显示的后续钩子，尚未实装。
