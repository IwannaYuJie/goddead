# v101 黎明织造厂 · 设计冻结

2026-10-02。基线：v100 / 223 场景 / commit `952d75c`。Codex 负责设计、原画与 Computer Use 实玩；`gemini-3.7-flash-high` 负责前端、测试、实现文档。已本地实现，226 场景 / cache101；三结局、重复织造、两处入口、回程恢复及手机布局完成本轮实玩验收。没有 commit、push 或部署。

## 故事

第一百夜之后，门缝里出现了一条没有太阳的晨光。你把它抽出来，发现那是一根线。织造厂仍在上班，织工却早已离开。九只线轴里，有白天、夜晚，还有可以让什么都不发生的空白。

> 这里不生产太阳。这里把夜里没说完的事，织成能穿出去的天。

新章不继续加三样物件、三种处理和一座裁定法庭。玩家在九格织机里直接铺设光与夜，织出的连通关系就是结局。没有唯一正确答案，三种结局都能重复抵达。首次只需织一块布；集齐三结局后留下 v102 钩子：“没有天气的候车亭”——昼夜都能穿过去，季节却迟迟不上车。

## 场景与入口

新增三个 hash 场景，总数223→226：

| 路由 | 中文 | 内容 |
| --- | --- | --- |
| `dawn-weaving-mill` | 黎明织造厂 | 两句故事、玩法说明、继续已有草稿 / 开始织造、三种已收集结局 |
| `day-night-loom` | 昼夜织机 | 3×3九格操作板、实时连通指示、织法提示与试晒 |
| `sky-cloth-drying-terrace` | 天际晾布台 | 大幅织物预览、派生结局的短故事、确认送出或拆回重织 |

主入口在痕迹室v100图鉴后，和现有折叠柜/下一步机制一起工作；另在 `threshold` 增加独立“门缝里的晨光”入口。这是后期进度反向打开游戏第一屏的可选支线，不代替敲门和主线行为。

完整解锁条件：读取归一化 `getHundredthWake()`，要求 `wkCourtEligible(st)` + `WK_VERDICT_OUTCOME_IDS` 三项全收集。getter已经校验上游，避免额外重复调用其Unlocked。v100 pending非空时新章入口/路由临时关闭并提示完成在途供香；v100 activeMourner存在但无pending时不清掉旧回执，可进入。本章不能写v100或更早存档。

## 直接操作九格织机

每格为原生button，顺序循环：空白 → 晨光 → 夜线 → 空白。初始全空。三个状态分别使用明确文字/图案与颜色，而非只凭明暗辨认；每格aria-label包含行、列、当前线材，点击后focus留在同格。

只接受受信任点击；键盘Tab定位后空格/回车按原生按钮点击。附原生模式按钮：“循环 / 只铺晨光 / 只铺夜线 / 擦除”，让鼠标、键盘、触屏都能少按几次。模式只是内存UI偏好，不影响判定或收集。每次修改保存合法draft，以便刷新保留实际图案；pending或activeCourier时锁定编辑。

九格编号按行优先0–8。合法编码：九字符，每格 `.`（空）/ `l`（光）/ `n`（夜）。四向相邻，上下左右；不允许对角连接或左右跨行。左列0/3/6任意格是入口，右列2/5/8任意格是出口。两种材料各自独立BFS：从对应左列出发能抵达对应右列，即“这条线穿过了织物”。

显示九格当前材料、已连通的格子、独立光/夜连通提示。光用暖金线与太阳记号，夜用靛青银线与月牙/文字；未与左边相连的格子仍可编辑。左右侧“进线 / 出线”文本固定，可见边界不含计时或需要精确拖动的动作。

没形成任一通路时，“试晒这块布”禁用，提示“让一条晨光或夜线，从左边接到右边。”不能把无效布偷偷当夜结局。

| 通路 | 派生结果id | 名称 | 送回 | 具体余味 |
| --- | --- | --- | --- | --- |
| 只有光 | `the-hundred-and-first-day-began` | 第一百零一天 | `threshold` | 门外的人第一次有了影子。门仍然开着，影子却留在了外面。 |
| 只有夜 | `the-night-learned-to-live-without-dawn` | 不用天亮的夜 | `remembrance` | 日历不再催夜离开。每个没说完的名字，都有时间慢慢说完。 |
| 光与夜都通 | `day-and-night-lived-apart` | 昼夜从此分居 | `unending-gallery` | 白天在画框里醒来，夜晚住到画框背后。它们隔着一张布，互相听得到。 |

最短示范：第一行铺 `lll`，其余空→光；第一行 `nnn`→夜；第一行`lll`、第三行`nnn`→分居。提供“看一块样布”可切换三个明确标注的样例，只展示小图与一句说明，不代填、不计进度。实际玩家仍亲手铺线。

允许所有合法图案；有多条同材路径也只产生对应一种结局。混用材料但没有双通路时，按真实通路分类。单格/方向的边界检查要测试，不以“格子数够了”近似连通。

## 晾布与落账

试晒后将当前pattern与派生outcome冻结为规范pending，到晾布台后才设visited.terrace；不增加weaveRuns或endings。晾布台以HTML/CSS展示同一九格pattern，不重新算另一套视觉规则。标题和短预览明确告知将送往哪个旧场景。确认按钮“把这块天送出去”；回改按钮“拆回织机重织”，回改不计数、不丢草稿。

确认送出必须重新核验draft、分类、权限和当前scene。只允许分类决定的target，不给任意目标自由跳转。到旧目标后才weaveRuns+1、去重记录endings、更新该outcome对应的latestWeaveByEnding、设置activeCourier{outcome,pattern}，清pending。重复送同种结局可以改图案与回声，唯一结局数不增。

三个旧目标都有本章独立“晨间签收”面板：标题、同一pattern小图、两句结果、返回织造厂按钮。该面板不挤进原grid的单列，需横跨旧场景布局。最新织物独立记在三个outcome映射中，旧页即使回执消失仍有简短可见回声；没收集时隐藏。正常主线继续可用。

activeCourier未返回时，厅里提供“回到晨间签收处”链接，不让玩家卡死在被锁住的开始按钮。回执返回落在hall时清activeCourier，保留已收集结局与最新图案。3结局全收集后只留钩子，不强制铺满19683图案。

## 持久化与抵达规则

独立键 `goddead_v101_dawn_weaving`，version101。建议九字段：version、visited{hall,loom,terrace}、draft{pattern}、endings、latestWeaveByEnding、weaveRuns、lastOutcome、activeCourier、pending。模式与提示样例不持久化。

归一化严格：pattern必须是九个白名单字符；非法pattern重置全空。endings仅三固定id去重；latest映射仅三个固定key，值必须合法且分类吻合并已收集，非法置空。计数0–9999，visited严格布尔，未知字段剥离，损坏JSON安全，lastOutcome必须已收集。activeCourier必须对应真实已收集且latest匹配的pattern，不能凭任意JSON伪造出口。

pending建议：entry（source仅threshold/remembrance），start（hall→loom），sample（loom→terrace），unweave（terrace→loom），delivery（terrace→分类旧target），courier-return（对应旧target→hall），abandon（loom→hall）。按kind从draft与domain表重建完整对象，一致才接受；规范feedback由表重算。抵达source只还原反馈并续播；target只结算一次；不相关scene取消pending，不记录结局。连续hash或刷新不能重复计数；真实bootstrap走实际route，禁止硬编码threshold清理。

所有新路由都有访问guard：hall需要entry抵达或访问记录；loom需要合法start/返回抵达或visited.loom且可编辑draft；terrace需要sample抵达或visited.terrace且draft仍可分类。v100在途时临时退痕迹室。新增窄桥只接受合法pending target / activeCourier target / 最近已收集lastOutcome的精确target，不放宽其他旧guard。

重开“新的一块布”明确清本章草稿全空（已收集记录不清），厅里“继续这块布”保留现有pattern。放弃不记结局。遵守现有全站遗忘和AutoAdvance取消流程，store.memo缓存因store.set正常失效。正文用textContent，禁止把存档值拼HTML。

## 美术与版面

三张1536×1024原画、独立生成。煤黑旧石、黄铜织机、暗红线结、暖金晨光、靛青银夜线。环境明度保留细节，不全压黑。图像采用现有data-src按场景加载，不整章preload。运行WebP每张尽量<300KB，源图存design-references，提示词/哈希落文档。

1. 厂房：高大石拱下无人的旧织造厂，两只光线/夜线轴，未织完的布从门缝垂落，远窗是没有太阳的清晨。
2. 织机：近似俯视黄铜木织机，中央整块空白深色3:2织面给HTML九格，金/靛线从左右边缘进入，图区中间不画假按钮或格线。
3. 晾布台：屋顶石露台，一根长黄铜晾杆，留中间空旷天空给HTML织物展示；左侧暖晨、右侧靛夜，非突兀一刀二分，柔和交汇。

桌面内容图景清楚；390×844按钮至少44px，九格在单屏内清晰，预览和结果文字可读，焦点边框与颜色有对比，无横向溢出。reduced-motion省去长织线动画，功能与默认模式一致。

## 验收

- 全穷举3^9=19683合法图案，纯分类与独立BFS对照，正确统计三类/无通路；专门检查对角、跨行、分裂路径、双通路、空图、非法字符。
- 三条真实最短铺线→试晒→送出→旧页签收→返回；三结局和独立latest映射；重复同结局新图案只加runs；sample/unweave/abandon不加runs。
- source/target/无关页冷加载、重复hash、损坏JSON、全字段伪造、v100在途锁定、锁定深链、全局遗忘。接口测试按真实生产函数与HTML id，不能伪造已访问指示冒充整页启动。
- Computer Use复用一个Chrome游戏标签页，不启动额外窗口、不用Playwright。备份原存档，仅seed已完成上游；本章进度由真实操作取得。桌面+390×844检查，控制台、图片加载与性能，结束还原存档/hash/viewport。
- 更新README、ProgressLog、Tasks、GameplayFlow、设计文档和QA证据，明确测试范围。保持本地，不自动commit/push/deploy。

## 本轮验收结果

原套件18415断言、新套件12组均通过。19683图案与独立坐标DFS对照：无通路14793、光2351、夜2351、双通188。另有501项归一化/pending隔离审查；这些函数测试不等同完整浏览器启动。

Computer Use只用一个Chrome游戏标签页：亲手完成`...lll...`、`...nnn...`、`lll...nnn`三条送出/旧页签收/回厂流程，再用`lll......`重复光结局。最终runs4、唯一结局3；最新光图案更新，夜/双通映射不变，19项上游种子逐字节无改动。样布只预览；未连通时禁用试晒；真实回车铺线、草稿冷刷新、拆回途中冷刷新、收起→继续、目录回厂→精确签收恢复均通过。

390×844实看发现状态字遮底排，Gemini改成图片下方正常文流后复验：按钮64.16px见方，底排bottom579.36、状态从606.37起，无遮挡、横向溢出0。晾布预览/结局/按钮可读，三个原画运行资源均加载成功，warn/error日志为空。

原21项存档与URL逐项还原相等，viewport恢复1470×779，测试键/临时调试设置清理完毕。还原后织机冷深链、厂房及晾布台暖深链都回痕迹室，无新章键和可见入口。全局遗忘与其他pending冷矩阵在源码函数测试覆盖，本次没有额外声称逐一整页实玩。详见`design-qa-evidence/v101-computer-use-20261002.md`。
