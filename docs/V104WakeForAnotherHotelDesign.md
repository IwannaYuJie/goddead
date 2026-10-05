# v104 替别人醒来的旅馆设计

2026-10-02。本章接续已在本地验收的 v103。接入前基线为 232 个唯一场景、缓存 `v=103`；当前 Gemini 前端已接入 235 场景/cache104，正式15组新测试、旧50组/site18436及单标签页5夜 CU 已通过，fresh原21项存档已逐字还原。HEAD 仍为 v100 `952d75c`，全部 v101–v103 未提交改动与无关文档保持原样。以下是冻结玩法和接入合同，实际验收及范围见 design-qa-evidence/v104-computer-use-20261002.md。Codex 负责设计、内置生图和单标签页 Computer Use；exact `gemini-3.7-flash-high` 是生产前端、生产测试及 README / GameplayFlow / ProgressLog / Tasks 的唯一作者。所有工作仍留在本地，未提交或发布，无尽扩充请求未宣告完成。

## 故事和新玩法

照片已经寄到，住客却睡在另一人的清晨里。旅馆只剩三间房：1 号是你的空床，2 号住着从未见面的旅人，3 号留给没有登记名字的人。前台没有叫醒服务，只有一张便条：“清晨不能增加，只能向隔壁借一刻。”

本章是三座联动梦钟的小谜题，不是排列车票、双重曝光或四个结局按钮。玩家亲手把一刻从一间房借给另一间房：借出房间的钟退一格，收到房间的钟进一格，六刻循环。只有停在 0 的房间会听见晨铃。预览和最终寄出显示实际钟面、借刻关系与醒来的房间，结局只由当前三钟的位置派生。

## 三个场景和三个入口

新增三个场景，232→235，静态资源缓存升为 `v=104`。

| hash | 名称 | 内容 |
| --- | --- | --- |
| `wake-for-another-hotel` | 替别人醒来的旅馆 | 前台故事、新住一夜 / 继续调钟、四结果、未返回唤醒回执的精确找回链接 |
| `borrowed-dawn-clockroom` | 借晨梦钟房 | 三座实时钟面、六个定向借刻原生按钮、拨回入住时刻、示例、预听晨铃与收起钥匙 |
| `shared-morning-veranda` | 共用清晨的回廊 | 冻结的三钟预览、谁醒来与关系解释、撤回调钟或敲响晨铃寄出 |

原生入口为 `#ah-entry-threshold`（threshold 门外“门后有一间还没醒的房”）、`#ah-entry-remembrance`（remembrance 痕迹室、实际 `#ah-codex` 内）、`#ah-entry-studio`（shadowless-photo-studio 照相馆“四张照片之后的住客钥匙”）。保留并接通现有 `#ph-hook` 文案，不清空 PH 钩子；新章的图鉴柜独立，位于 PH 柜之后。目录三项与“找到入口”使用真实按钮、真实父柜，不复制隐藏控件。

永久解锁为 `shadowlessPhotographyUnlocked()` 且 `PH_ENDING_IDS` 四项全收集。实时可用性额外要求 `shadowlessPhotographyAvailable()` 且 PH 的 pending 与 activePrint 均为空。自己的 getter 只依赖永久解锁，不依赖临时可用；旧章在途或未返照片时保留本章 raw，不当作丢档。最终第四张照片寄到时钩子可见，但照片须先实际带回照相馆才能入住，这个状态必须在入口提示里讲清楚。新章不清理任何旧章事务。

## 联动梦钟规则

三个房间固定索引为 0、1、2，界面显示 1、2、3 号；1 号始终是你的房间。每座梦钟是整数 0–5，0 是听得见晨铃的晨门，1–5 是梦中五刻。初始三钟为 `[3,2,1]`。钟面必须有真实的六个刻度、指针、当前数字和房间身份文字；颜色不能成为唯一信息。

借刻动作必须指定不同的 from/to 房间。操作同时更新 `clocks[from]=(clocks[from]+5)%6`、`clocks[to]=(clocks[to]+1)%6`，第三钟不变。六个原生按钮分别对应 1→2、1→3、2→1、2→3、3→1、3→2；每次点击只能做这一个操作，不暴露直接赋值、预填结果或拖动必需交互。六个动作全都可逆，0→5 和 5→0 都是合法环绕，须显示两个受影响钟的前后读数。钟面和连线实时改变，原画不烘焙数字、指针、醒来状态或按钮。

所有合法三钟满足 `(c0+c1+c2)%6===0`。全 6³ 中有 36 个规范状态，从 `[3,2,1]` 用六种借刻动作全部可达；36×6=216 个一步状态转移必须保持该不变量。原型独立枚举得到四类分布为无晨门20 / 仅自己晨门5 / 仅别人晨门10 / 三间全晨门1。由于不变量，两间停 0 而第三间非 0 是非法状态，不能单独发明一类结果。最短三步可达到 `[0,0,0]`；实现测试须独立 BFS 验证可达性，而不是只认示例。

“拨回入住时刻”只把草稿重设为 `[3,2,1]`，不改 runs/endings/latest。示例按钮只轮换显示四类合法例子与解释（`[3,2,1]`、`[0,1,5]`、`[1,0,5]`、`[0,0,0]`），不代填、不落草稿。编辑、预听、撤回与收起钥匙都不算完成一夜。所有合法三钟都可预览，包括无 0 的情况；不能把“无人醒来”错误禁掉。继续保留草稿，新住一夜到达梦钟房时重设初始钟。

## 四种醒来与旧场景签收

| 条件 | ending id | 结局 | 固定目标签收 |
| --- | --- | --- | --- |
| 无房间停 0（20种） | `dawn-waited-outside-the-doors` | 天亮留在门外 | `unending-gallery` |
| 仅自己的 1 号房停 0（5种） | `you-woke-in-a-borrowed-morning` | 你醒在别人的清晨里 | `threshold` |
| 仅 2 或 3 号一间房停 0（10种） | `someone-woke-on-your-behalf` | 有人替你醒来 | `remembrance` |
| 三间房都停 0（1种） | `three-rooms-shared-one-dawn` | 三间房共用一次天亮 | `unending-gallery` |

对应故事：无晨门时，窗外已亮，铃却被三扇门留在外面；自己醒时，空床收到了属于别人的早晨；别人醒时，你仍未睁眼，隔壁已替你答应今天；全醒时，三间房终于共用同一次天亮。只有另一间醒的结果须明确是谁（2 或 3 号）以及真实三钟，不把两个实际配置压成同一份假图。预览、签收、图鉴均显示相同有序三钟、真实指针、晨門房间与文字。

四结果就算完整章节，不要求刷满 36 种。重复结果 runs 累加、endings 去重，只刷新该结果的 latestClocksByEnding，其它三项保持不变。集齐四结果后显露 v105 文案钩子“只出售昨日的早餐铺”：住客终于醒来，早餐却还停在昨天。本轮只写钩子，不实装 v105。

## 规范存档和到达事务

独立键 `goddead_v104_wake_for_another_hotel`，模块 namespace AH，version104。九个顶层字段固定为 version、visited{hotel,clockroom,veranda}、draft{clocks:[3,2,1]}、endings、latestClocksByEnding、runs、lastOutcome、activeWake、pending。clock 数组必须恰三项，各项严格整数 0–5，sum%6=0；拒绝字符串数字、布尔、null、NaN、错长度和错误守恒。坏 draft 回初始 `[3,2,1]`，绝不修成罕见全醒答案。

endings 只四个固定 id 去重；runs 为 0–9999 严格整数；visited 严格布尔；lastOutcome 只能为已收集项。latest 初始是空对象 `{}`，键白名单仅四个固定 id，各存在值是规范三钟且分类匹配、对应结局已收集；缺失/非法项直接省略，不补空数组或假答案，图鉴安全显示“该结果暂无可读钟面”。activeWake 仅 `{outcome,clocks}`，outcome 已收集且 clocks 与该结果 latest 逐位相等；额外字段剥离。图形、醒来房间、结局、目标与文案都从三钟派生。坏 JSON 只读容错并保留原串，合法保存沿用 store.set / memo 失效。

七种 pending 的规范键集：entry 为 kind/source/target/feedback；start 再加 fresh（严格布尔）；preview 再加 clocks；revise 仍四基本字段；wake 再加 outcome/clocks；wake-return 再加 outcome/clocks；abandon 仍四基本字段。source 一律使用 source，不另用 from。entry 是三个旧入口→hotel；start 是 hotel→clockroom；preview 是 clockroom→veranda；revise 是 veranda→clockroom；wake 是 veranda→结局固定旧目标；wake-return 是该精确旧目标→hotel；abandon 是 clockroom→hotel。按 kind、domain、当前草稿/activeWake 和固定反馈重建 pending，精确白名单比较，拒绝多余键、错目标、错反馈、错三钟和伪结局。

source 冷刷新重播反馈与同一事务；target 只结算一次；不相关场景取消 pending 而不落账。仅 wake 实际抵达旧目标才 runs+1、去重 endings、更新该结果最新三钟、写 activeWake、将草稿重设初始。点击旧目标原生“带着晨铃回旅馆”，抵达 hotel 才清 activeWake。未返时 hotel 新住/继续禁用并给精确 target 找回链接，三个入口仍可回已到访的 hotel 找回。目标刷新不得重复记账，两个 gallery 结果签收面板必须按当前 activeWake 显示实际结果。

新 hotel 仅接受规范 entry / wake-return / abandon 目标或实际 visited.hotel，允许其合法 source 冷重播；clockroom 仅接受规范 start / revise 目标或 visited.clockroom；veranda 仅接受规范 preview 目标或 visited.veranda 且当前规范三钟可读。守卫优先看事务：有 pending 时仅该事务实际合法新场景 source / target 可用，泛 visited 不能抢过事务；有 activeWake 时仅已到访 hotel 保留找回，clockroom / veranda 闭锁。无事务才走普通 visited；初始三钟本身是合法草稿，不能以是否偏离 `[3,2,1]` 判断继续或预览资格。locked 深链回 remembrance 且不写新键。精确旧目标桥只授权本章规范 wake.pending / activeWake / 已收集 lastOutcome，保留旧 governance、v45、其它章节守卫与初始化；不能扩大为全站绕过。

所有原生操作在访问状态、反馈、定时器或写入前先检查 trusted、真实 live scene、可用条件与第一锁；pending / activeWake 时编辑闭锁。编辑本身不发自动路由，转场反馈使用现有 reduced-motion 节奏。forget 必须清本章键、memo 和仅本章合法 source 定时器，非法 pending 不能清任意旧计时器。正常串行、上游全部已完成且无其它历史在途/未返回执时，v82–v103 的 22 项 raw 全程逐字节不变；不扩大为全站多章并发保证。

## 真实页面接线与兼容

新增完整模块放 PH 最后一行原生监听之后、guide 多行注释之前。保留 v101/v102/v103 生产测试切片的原始范围，只为确有新增调用的全 resolve / sceneInit harness 补精确新章桩，不删除旧断言。旧 gov bridge 链保持现有相邻契约，新桥放旧链前；三个新 canVisit 检查入实际 resolveScene。真实 sceneInit 在 PH resolve/replay 后调用 AH resolve/replay，真实 bootstrap 在 PH sync 后只调用 AH sync，再由原先 reveal/route 到达，禁止先假定 threshold 结算。

真实目录 sync、remembrance codex、guide helper、progressEntryButton 前缀、global forget、AutoAdvance 都须接通。PH guide 已完成分支才能转交 AH guide；PH pending/activePrint 找回优先保持不变。AH guide 同样优先 pending/activeWake，再处理未入住/草稿/缺结果/完成；“找到入口”定位 #ah-entry-remembrance 并展开其实际 #ah-codex，完成钩子不顶掉仍未返晨铃提示。

## 美术和独立验收

三张内置生图：空床旅馆前台、蓝夜铜质梦钟房、三扇帘门的清晨回廊。1536×1024、3:2，源 PNG 保留在 design-references，运行 WebP q88、单张 <300KB 放 assets；不复用上一章照片或候车亭。原画无读数、按钮、文字、人物、指针或可误认的固定结局。实际三钟、连线、醒来状态以代码原生可读面板呈现，重要说明、六按钮和状态放正常文档流，不挤到图片里面。若采用叠层，只能以实际看图后的安全区为准；本设计不强制覆盖图片。

390×844 按钮≥44px，三座钟与房间身份、借刻方向可辨，标题低于72px导航，横向溢出为0。桌面短视口同样正常滚动。根代理仅复用原 Chrome 标签80231134，不开新窗口、不用 Playwright；重新备份全部原 raw、URL、当前默认 viewport。合规 QA seed 仅规范完成的 v82–v103 22key，不写 v104 答案，从默认钟原生操作四结果、一次不同配置重复、六借刻和环绕、样例不代填、reset、预览/撤回/收起继续、source/target 冷刷新、未返找回、三入口、实际图鉴与钩子。完成后逐键恢复 fresh 原档，移除本轮实际白名单 QA 键，三条 locked 深链实测回 remembrance 无新键，恢复 URL 并清手机 override。

Gemini 测试真实 AH 模块、实际 HTML 注册和真实 resolve / helper：独立36状态20/5/10/1 oracle、BFS全可达与216转移/互逆、全部无0仍能预览、非法三钟与归一化、7 pending accepted基线和逐键污染、source/target/无关页冷恢复、重复签收、三个旧目标精确桥、上游临时闭锁与坏 JSON raw 保留、忘记/图鉴/guide 路由、native 唯一监听。模拟 trusted/DOM/timer、真实 getter 链、整页源码接线与真正 CU 各自标明，不能混称整页 bootstrap。测试发现的生产或测试缺陷都交回同 exact 模型修正。

根设计、图片提示词与 QA 证据由 Codex 更新；实现文档由 exact Gemini 在实际门禁和 CU 证据齐备后同步。本稿冻结玩法，但本地实装、图片和验收状态须随真实完成进度更新。
