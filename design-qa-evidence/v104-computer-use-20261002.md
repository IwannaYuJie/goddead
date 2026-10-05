# v104 替别人醒来的旅馆验证记录

2026-10-02。v104 前端已本地接入 235 场景/cache104，正式新15组/旧50组/site18436与单标签页5夜 Computer Use 已通过；fresh原21项raw已逐字还原，25项本轮QA数据已清理，三个locked深链与最终原URL/默认viewport已核实。四份工程文档已由同 exact Gemini 同步，根逐段终核完成。v103 验收见同目录 v103-computer-use-20261002.md。HEAD 仍为 952d75c，未commit/push/deploy。下文早期阶段记录是实施历史，以本段及末尾终态为当前状态；VM、源契约和真正CU的范围分开标明。

## 已执行的准备

根代理重读本地进度、README 和 v103 设计，完整读取本轮 CPA / imagegen / 本地设计文档写作相关技能。live CPA models 核实 exact gemini-3.7-flash-high 可用，不替换模型。生产前端、生产测试、工程实现文档继续由该模型唯一编写；根负责设计、生图、机械应用检查及真实 CU。

已冻结 docs/V104WakeForAnotherHotelDesign.md：三钟0–5，初始[3,2,1]，六个定向借刻操作，sum%6=0；36种合法状态与四类20/5/10/1。根和独立 agent 各自枚举交叉验证，216一步及216逆操作守恒，全部36状态可达，全0最短3步。独立 BFS 距离层为1/6/12/15/2；全0路线为2→1、2→1、3→1，实际三钟依次[3,2,1]→[4,1,1]→[5,0,1]→[0,0,0]。这是设计数学证明，不是新生产函数或浏览器操作。

三张内置生成原画已看图并入库，源PNG/运行WebP1536×1024，q88不裁改，运行217372/291930/290470字节，路径/提示词/六个哈希完整记入 docs/V104ImagePrompts.md。原画无指针、数字或结局指示；真实钟面必须在未来前端代码面板显示。尚未验证这些图片在新页面真实加载。

ignored .v104-gemini/upstream-v82-v103-seed.json 是本轮合法22key上游fixture，SHA82b5d60f66da8dfe5597d5d90a2a7cecd14a8118dff2dc2a7f7c898f7b1005d2。旧21key原串不变，只追加实际PH默认/域/示例/分类所得规范四结果 quiet 档；没有AH或未来key。根实际跑 node .v104-gemini/build-upstream-seed.mjs --verify-existing：22真实getter字节一致、22删键/4缺PH结局关闭设计前置、两种规范PH busy保留永久前置但暂时不可用、writes0。implementedAHGateVerified=false；不能称此时已验证不存在的AH生产gate。

## 接入前生产边界（准备阶段历史）

素材入库后的原四SHA复核仍为 script d0926870a51152b1d631f851c2a4713343967a75b8f62fc74a8ab54a5dc22e84、styles c227e65aa2d933d5a7b065def7b2aeef6d5cb644c3a93a9e1305cda14e6b1151、index 19b484f2e4d01ca7fc11e76862859cba15a30fcb19b0eb6a8e6969e4d351d9bf、tests/v103 0acac720cef8a1e0434845724fae7782bb5972a8da8d5fe9fd87caed76e7f575；git diff --check通过。当前无v104生产验证结论，Gemini分阶段完整模块/唯一锚manifest/HTML/CSS/测试实施中。

## 正式 CU 验收计划（执行前记录）

只复用现有Chrome标签80231134，不新开窗或标签、不用Playwright。正式QA前重新采集原raw全量、URL及默认viewport，旧v103备份不可复用；22key fixture只补前置，AH从默认空档开始，实际点击六借刻和四结果。保存当前原生AX索引再操作，鼠标/键盘与同页手机视口查看各自标明。

待验证：四结果实际寄出签收回旅馆；两个不同别人醒/重复结果仅更新自己latest；无0可预览；0→5/5→0借刻；reset/示例不落账；预览撤回/收起继续/原钟继续；source/target冷刷新和幂等；activeWake精准找回；三入口/实际图鉴/guide与v105文案；三图片真实naturalWidth；390×844控件≥44px/标题避导航/无溢出；22上游raw正常串行不变；实际控制台warn/error；最终新备份逐key还原、清本轮新增QA白名单、locked三深链回remembrance、清phoneoverride、原URL恢复。

拟用实际原生操作的5次路线（每次新住从[3,2,1]开始，尚未执行）：初始不借刻即无人醒[3,2,1]；1→2三次得自己醒[0,5,1]；3→2一次得3号替醒[3,3,0]；2→1两次再3→1得三间全醒[0,0,0]；最后2→3两次得2号替醒[3,0,3]，验证同一结果换实际醒房时latest仅该项刷新。自己醒配置再1→2并2→1做环绕与逆操作，三组方向正反依次点击可覆盖全部6按钮并返回初始。上述只是数学复核过的验收路径，不能算已实际按下或已经通过CU。

生产模块桩、模拟trusted、独立真实getter链、整页sceneInit/bootstrap源契约、真正CU实玩须分开报告。没有进行的项目继续记为待验证。所有内容留在本地，未commit/push/deploy，无尽扩充请求未宣告完成。

## Gemini 分阶段实现记录

首完整模块请求为 exact gemini-3.7-flash-high，exec91948已终态，response resp_16i_aoTsFt-x0-kPh_aOmQU。仅保存 ignored .v104-gemini/v104-module.js，1149行/42785字节/SHAfd135be1fe98c2ec20c6a538e26cd3e364922640ac3951859d899835522b0d0b，node --check通过；尚未接受或接入生产。根完整读查首模块，36态派生、latest空map和事务优先基本对应设计；冷恢复后“初始时刻或已reset”误说明、缺实际动态借刻方向图，以及未返回执时措辞交回同 exact 模型修正，未由根手改代码。

UI/CSS完整bundle请求实际handle8083，response目标.v104-gemini/v104-ui-response.json；main/guide唯一锚manifest实际handle10957，response目标.v104-gemini/v104-main-ops-response.json。等待都跟原handle，不凭观察超时重派；生产是否变化以实际hash和unique锚验证为准。两名独立agent对真实首模块做数学/规范/真实22getter链VM复核，结果尚待各自终态；这些都不是CU四路线已玩通的证据。

根只读CU复用了Chrome1 / tab80231134：真实AX显示原URL http://127.0.0.1:4173/、active门外、door-btn与原门厅hotspot。未reload、未点游戏按钮、未注入fixture、未改用户localStorage、未开任何新窗或标签。当前v104仅staging阶段，不以这一旧门外画面充当新章验收。

首UI与main请求均已终态（resp_lam_asuyGsO3vr0P75WD8Ak / resp_-am_avW_Oa7mrfcPpensqAQ），未直接接受：main最后转发锚缩进不匹配；UI ops缺op字段且一项把场景塞进图鉴，回同模型修正，生产原基线未变。fresh bounded core更正handle28425（.v104-gemini/v104-module-correction-response.json）修冷恢复提示/动态借刻图/已签收未返文案；main更正handle94502（.v104-gemini/v104-main-ops-fix-response.json）只修唯一真实锚，其余10操作保持。不重复调用已终态请求，不把拒绝稿写进生产。

## 当前接入与实际试玩进度

最终完整模块 resp_haq_avyWOa7mrfcPgZSE-QE 为44564字节/SHA9be25bb0e3d9d722c6796ebd82dd745ec458c875e32c2f0104329bd204bc8055，UI修正resp_P6u_aqrENbP22roPq7ndAQ、main修正resp_paq_atiCF67mrfcPpensqAQ。11+11唯一锚机械应用后实际 script.js SHA191320ec98cb35247b0d79c130170118dc1f47021107db5e013d3e5a8db64642，styles.css SHA507dd0f0e66cb9480a1e0d0dd8065648c8ef785cf45ddb71baa4fcad218f4631，index.html SHA742259aee1b43471b96b611e09bbf785aee3c857b473ed3e8dfcb9e0907d2a59。根 node --check / git diff --check 通过。235唯一场景、3116唯一ID、20真实AH按钮。独立production-slice6146、真实22getter链+实际静态HTML登记6892/12组、页面/真实guide/完整resolveScene3476均已通过；这些运行DOM/计时器/trusted仍模拟，整页sceneInit/bootstrap仅源码接线检查，不冒称CU。

根仅沿用 Chrome1/tab80231134，本轮未新开标签或窗口、未用Playwright。正式QA重新采集 original104：原URL http://127.0.0.1:4173/、默认1470×723、21项原raw、原active threshold、AH absent、原QAbackup absent。本轮__v104_qa_backup_20261002__保存这份fresh备份；22key seed逐项追加，首入口前AH仍不存在，localStorage实测44项。已真实按钮threshold→hotel→continue→clockroom，初始[3,2,1]/runs0。桌面旅馆截图v104-01-hotel-desktop.png。

同标签切390×844：实际doc/body宽390，无横溢出；梦钟房10控件实际高44。三卡宽95.06/95.07，84px钟面超可用内容区约2.1px，但仍在95px卡的边界内、clientWidth93==scrollWidth93，没有实际越卡或裁切；不把源码风险当实测失败。实际标题在导航下。真实点击全部六方向与三个逆，读数依次[2,3,1]→[3,2,1]→[2,2,2]→[3,2,1]→[3,1,2]→[3,2,1]；每次实际AX看新读数，动态借刻图说明from退/to进/第三保持。四次示例显示四配置且AH raw全程逐字相同。手机借刻面板截图v104-02-clockroom-mobile.png。

初始无0实际可预览，到回廊仍runs0、latest空map、草稿[3,2,1]。首次预览之后读取pending已为null，冷刷新的是预览目标端，不计为source冷恢复；重载后回廊显示正确。随后原生撤回操作在source真实捕获规范revise pending，立即hardreload；其恢复到达结果继续实测中。其它路线、回执、最终原档恢复和正式suite仍待后续补齐。

后续revise source刷新实际恢复clockroom/runs0；重新preview source捕获clocks[3,2,1]的规范pending立即刷新，恢复veranda/runs0。wake source原生捕获无人醒pending且runs0，立即coldreload后gallery签收runs1/endings1/latest[3,2,1]/activeWake相同；gallery目标再次coldreload仍runs1。URL导航到已访hotel显示新住禁用、实际#ah-active-wake-link精确指gallery，真实点击找回原签收处。wake-return source捕获规范pending后coldreload，抵达hotel才清activeWake且runs1。start fresh=true source捕获后coldreload恢复clockroom初始。

真实1→2三次读数[2,3,1]→[1,4,1]→[0,5,1]，再1→2得[5,0,1]、2→1回[0,5,1]，覆盖0→5/5→0。abandon source捕获后coldreloadhotel保留[0,5,1]/runs1；continue source捕获fresh=false后coldreloadclockroom也保留[0,5,1]，冷恢复提示是“当前已保存读数保留”。原生reset回[3,2,1]，runs/endings/latest逐字结构一致；再三次1→2得自己醒[0,5,1]，预览与门外实际签收显示1号晨门而2/3梦中，runs2/endings2/activeWake[0,5,1]，原生返回旅馆进行中。

三个实际到访场景的运行图分别读currentSrc，均complete=true且naturalWidth1536/naturalHeight1024（lazy图只在各自到访时检查，不称同一时刻全图加载）。手机回廊标题实测top120.875>72导航，docWidth390、wake/revise实际高44；浏览器当前warn/error为空。最终手机和原档恢复尚未执行。

第三夜实际3→2一次得到[3,3,0]，回廊、remembrance签收明确3号房停晨门，runs3/endings3后原生返回hotel。第四夜实际2→1、2→1、3→1：[4,1,1]→[5,0,1]→[0,0,0]，三间全醒；gallery实际签收title从无人醒切为三间共用，runs4/endings4/latest四项完整。签收返回hotel后再新住，2→3两次得[3,0,3]，回廊明确改为2号房醒，重复寄出进行中。桌面截图v104-03-clockroom-desktop.png、v104-04-three-clocks-awake-desktop.png、v104-05-veranda-all-awake-desktop.png均为实际原生按钮后的画面。滚轮/键盘工具没有可靠移动到所需区域，最后原生点击AX钟面读数的可见文本定位完整面板，未用脚本滚动或程序点击。

四夜完成后的真实22上游raw读取与fixture JSON.stringify逐项比对为22/22相等、mismatch为空。一次先前工具输出的upstream22StillExact使用了错误占位表达式，根随即在下一CU调用明确标为无验证意义并重新读取实际raw比较，不把占位值计作证据。根实际运行维护后的旧site.test.mjs为18436 assertions通过，v101/v102/v103正式50/50通过；新v104核心12/12只是候选，独立审查的覆盖缺口与集成块仍交同Gemini修补，不称最终suite完成。

第五夜实际remembrance签收runs5/endings4，OTHER latest变[3,0,3]、其他三项与第四夜快照逐字结构相等；原生返回hotel清activeWake。实际展开AH图鉴，四结果对应四套真实三钟，[3,0,3]只2号房醒；v105钩子“【只出售昨日的早餐铺】住客终于醒来，早餐却还停在昨天。”可见。AH入口实际closest父柜为ah-codex。rem入口原生source冷刷新恢复hotel/runs5；studio入口实际pending.source为shadowless-photo-studio并到达hotel，三入口全真。fixture的旧governance未另行伪造，progress-guide实际hidden=true/displaynone，故不称CU点过“找到入口”；真实helper/父柜由独立及正式VM覆盖。

手机前台实际docWidth390、标题top120.79>72、三个button均44；手机图鉴实际单列，12个60px钟面全部在卡内，doc/body宽390、入口高59.59。v104-07-clockroom-mobile-top.png记录手机上半部（不是全钟面都在视口中的截图），v104-08-codex-mobile.png记录真实手机图鉴，未以源尺寸代替看图。viewport已reset回默认。

同 exact Gemini 微修studio“四间结局之后”为“四张照片之后的住客钥匙”，不改id/结构。index终SHA为f657365f60fa77a3ab29c087f9747e5b0e5ae68206e38e203e0f910aa273e02f，JS/CSS不变；生产接线现23项（原11main+11UI+1copy）。根实际hardreload后AX看到新文字。随后原生ph-new启动实际PH start pending，studio AH按钮实际disabled并提示“照相馆正在叠印，请先完成底片签收”，AH raw逐字保留。这个额外临时忙测试主动写了PH QA档，不属于先前正常串行22raw不变承诺；没有跑PH activePrint真人路径，它由真实getter链VM覆盖。

正式tests/v104.test.mjs逐字匹配最终Gemini稿SHA db1883eb6165f3ce03d8435394c55664dd2bfe078975e51ed28135d32287ad0b，根亲跑15/15 green。维护后site18436、前三章50/50均根已见exit0；owner最终四章合跑65/65。真实resolve/helper分别实际源码+明确旧依赖桩；sceneInit/bootstrap仍仅源接线契约。独立审查曾将isValid守恒改returntrue、12候选仍全绿，修测试后正式15稿该mutation被Group2实际非法tuple[0,0,1]和Group3version104同时抓住；一致非法preview字段与重复监听同样必杀。以上是测试质量修补，不是生产函数曾有这三处缺陷。

收尾前实际46个键，fresh原21项、实际QA新增25项，新增全部落本轮明确白名单且unexpected为空。根逐项还原21原raw，移除22seed+AH+fold偏好+本轮backup共25项，没有localStorage.clear。只有21raw全部相等且剩余数正确才移除backup；结果21项、AH absent、backup absent，原URL http://127.0.0.1:4173/ hardreload后仍21raw逐字相等。三条locked新深链和最终图继续核对中。

## 最终验收状态

原档恢复后以三个不同query进行完整导航，实际请求为 `http://127.0.0.1:4173/?v104-locked=hotel#wake-for-another-hotel`、`http://127.0.0.1:4173/?v104-locked=clockroom#borrowed-dawn-clockroom`、`http://127.0.0.1:4173/?v104-locked=veranda#shared-morning-veranda`。三次fresh AX均实际显示“你留下的痕迹 / 这个网页记得你”、active scene-remembrance、URL改#remembrance，均21键且AH absent。最终回原URL http://127.0.0.1:4173/ 再hardreload，实际scene-threshold，21/21原raw逐字相等、总数21、AH absent、backup absent、默认1470×723、warn/error[]；v104-09-original-save-restored.png为这一终态。已markDeliverable原tab80231134，整轮未新开窗或标签、未用Playwright、未留下viewport override或浏览器脚本改写。

根再次实跑最终HTML f657365f 的实际22getter链/HTML登记诊断6892全绿；最终page诊断23ops反解/重放与生产一致、6146模块+3485页面绿。正式15稿五条纯内存负向探针均必杀：守恒删除、两处一致preview禁字段、重复监听、分别删除两处gov AH回桥；两gov删桥在真实resolve行为上返回acting/offering而非remembrance，源契约也报警。这是诊断对测试强度的证明，并非向生产注入这些缺陷。正式测试的PH flags/22dummy写隔离不冒称真实22getter链，该链另由6892实际执行；sceneInit/bootstrap不冒称整页运行VM，真正冷恢复由以上原生CU补证。

根随后亲自运行 `node --test --test-concurrency=1 tests/v101.test.mjs tests/v102.test.mjs tests/v103.test.mjs tests/v104.test.mjs`，实际65个测试/pass65/fail0/skip0/todo0、exit0、3254.721916ms。这是正式测试数，不是65条断言；站点测试的18436 assertions另行计数。

四份工程文档首稿 `resp_ELe_atHuAZez2roPx8aAwQQ` 的13锚均唯一，但部分场景/结局/v105名称、测试统计单位与记账到达点写偏，因此整份拒绝应用。fresh更正请求6372只修5个有限段，保留8个正确锚与旧历史；此前首稿没有写进生产文档，前端与测试四SHA保持终态。

工程文档更正终稿 `resp_tbe_arGtIqK22roP2Mvv2Q8` 的13项唯一锚已精确应用；最后4段范围修正候选 `resp_s7m_arzUJ_DN0-kProKn8QM` 将180个刻度域内但不守恒的状态称为“越界”，先不应用。`resp_Arq_aqHqK6XCvr0PwKKayQ4` 仅更正 Tasks 该短语，保留另外字节，最终4项一起精确应用。共17项工程文档操作（13+4），作者仍是 exact `gemini-3.7-flash-high`；根亲读 README 当前段/旧历史/命令/引用、GameplayFlow 基线/链表/5.14、ProgressLog v104 末段与 Tasks 顶部，正式15组与五条独立变异探针、65 tests 与18436 assertions、48 fresh VM 与真实CU、完整resolve源码及旧桩、仅sceneInit/bootstrap源接线、素材assets路径及v105文本钩子均已分清。owner内存逆撤17项逐字节还原本轮四doc输入；根当前四doc SHA分别为 README `cfca9e4f32acedea10e8a8f3025cee850e7654ce1b8cee4e192acf4ae605e0ca`、GameplayFlow `d09c6c8adb5d5cf48228035677795218cdd8640a291b01fc458e2a38aa513dd7`、ProgressLog `88606a3e09b7148d096e42a8050fa66d8bc1a4e2c854e769e63f681b770cd455`、Tasks `212996c968927a27cd24e2ccc5ad466a5c01cf0d8c50a68deec7ac5a0c92e5e7`。生产 JS/CSS/HTML/v104测试四SHA仍是终态未变。

已完成本章本地玩法、三新原画、正式与独立测试、五夜实玩、原档恢复和四工程文档同步；根仅维护本设计/素材提示词/QA证据，并将本设计残留“四间结局”同步为已验收的“四张照片”。所有改变保持本地dirty状态，保留原v101–v103及三个无关文件，未commit/push/deploy；无尽扩充请求未宣告完成，v105当前只是文本钩子。
