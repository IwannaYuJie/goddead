# v103 收不到影子的照相馆设计

2026-10-02。本章接续本地 v102，现已完成 v103：232 个唯一场景、资源缓存 `v=103`，HEAD 仍为 v100 `952d75c`；v101/v102 全部已有改动和三份无关文档保留。设计冻结，四结局、三个入口、重复结果、冷恢复及手机/桌面叠印已实玩验收，手机标签安全区缺陷由同模型修正。Codex 负责设计、内置生图和 Computer Use 验收，`gemini-3.7-flash-high` 是生产前端、生产测试和实现文档的唯一作者。所有工作留在本地，未提交或发布；实际测试范围、原档恢复及最终截图见 `design-qa-evidence/v103-computer-use-20261002.md`。长期扩充goal保持active。

## 故事和操作

四季已经赴约，影子却没有下车。候车亭旁的照相馆还收底片：镜头里没有人，地上的影子却会随着灯光移动。摄影师的便条写着：“请站在你缺席的位置，再拍一次。”

玩家拍两次曝光，亲手调整五个站位和左右灯位，再把两张底片叠印。结局直接由两次曝光的站位、影子是否重合派生，不是四个结局快捷按钮，也不是重复上一章的排班格子。两张底片在镜头、暗房、签收处和图鉴里必须有真实可辨的几何差异。

## 场景和入口

新增 3 个场景，229→232，资源缓存升为 `v=103`。

| hash | 场景 | 作用 |
| --- | --- | --- |
| `shadowless-photo-studio` | 收不到影子的照相馆 | 故事、新拍一卷、继续底片、四个结果、尚未返回照片的精确找回链接 |
| `double-exposure-camera` | 双重曝光取景台 | 站位与灯位、实时取景、两个独立底片槽、快门、单张擦除和互换顺序 |
| `unreceived-shadow-darkroom` | 未收影暗房 | 两张底片真实叠印预览、结果解释、撤回重拍或寄出照片 |

入口各有原生按钮和即时反馈：`#ph-entry-threshold`（门外的“镜头还在等人”）、`#ph-entry-remembrance`（痕迹室四季图鉴之后）、`#ph-entry-shelter`（候车亭内三种天气集齐后的照相馆门）。三入口都只使用本章事务，不改旧章按钮。保留并接通 v102 的“收不到影子的照相馆”钩子，统一痕迹室折叠柜、目录和“找到入口”。

解锁只读归一化的 v102：`weatherlessShelterUnlocked()` 且 `WS_ENDING_IDS` 三项全收集。实时可用性再要求 `weatherlessShelterAvailable()`、v102 的 `pending` 与 `activePassenger` 均为空。自己的 getter 只依赖解锁，不依赖临时可用，旧章正在发车时不得把本章存档清空或伪装为丢档。三个入口、所有新路由、编辑、预览、重播与结算使用同一实时条件。新章不替旧章清在途或回执。

## 两次曝光的几何规则

站位是整数 `position∈{1,2,3,4,5}`；灯位 `light∈{left,right}`。左灯把影子推到站位右一格，右灯把影子推到站位左一格：`shadowPosition=position+(light==='left'?1:-1)`。因此完整取景横轴为 0–6，站位只占中间五格，影子不会掉出画框。

取景台显示七条可读标尺、站位的空人形细轮廓和偏移后的实心影子；灯位、站位和影子坐标都有文字，颜色不是唯一信号。原画提供房间，HTML/CSS/SVG 叠层提供确定性几何，不需要真实摄像头、上传照片、拖动或访问媒体权限。

控制包括五个站位原生按钮、左右灯原生按钮、两个底片槽按钮、快门、擦掉所选底片、互换两张顺序，以及“去暗房叠印”和“收起这一卷”。所有必要动作均可点击或 Tab 加 Enter/Space，按钮有状态和可见焦点。内存所选槽默认第一个空槽，否则第一张；不写独立存档字段。两槽都是独立序号，不能用 filter 删除第一张后把第二张偷偷挪位。

快门把当前 `position/light` 原样冻结到所选槽；拍完后若另一槽为空，选择转到另一槽，否则留在当前槽。改变站位或灯不修改已拍底片，重拍才替换所选底片。擦除只置该槽为 null；互换交换两个槽，包括一个为空的情形。两张都有合法曝光才允许进暗房；示例只解释几何关系，绝不自动填写底片。

初始取景为站位3、左灯，两张底片均空。每次真实设置变化、拍摄、擦除或交换只保存草稿，不增加 runs/endings。全100个有序曝光对必须由同一几何函数判定，不能只认四个演示样例。

## 四种照片和结局

对两张合法曝光分别计算站位 b1/b2 与影位 s1/s2。四种互斥且完备的关系如下；枚举10×10个有序对，数量为10/10/6/74。

| 关系 | ending id | 结局 | 精确签收目标 | 故事 |
| --- | --- | --- | --- | --- |
| b1=b2 且 s1=s2 | `absence-shared-a-portrait` | 缺席者也有了合影 | `threshold` 门外 | 两次快门都没拍到你，照片却留下了一个可以回来站着的位置。门外第一次有人把空位称作合影。 |
| b1=b2 且 s1≠s2 | `one-visitor-kept-two-shadows` | 一个人带走两道影子 | `remembrance` 痕迹室 | 你仍然缺席，两道影子却同时认出了你。痕迹墙留下一张不必证明本人在场的照片。 |
| b1≠b2 且 s1=s2 | `the-shadow-attended-in-your-place` | 影子替你出席 | `unending-gallery` 无终局陈列廊 | 两个空位把同一道影子夹在中间。画框收到的不是你，是一次被影子认真履行的赴约。 |
| b1≠b2 且 s1≠s2 | `nobody-was-kept-in-the-frame` | 谁也没有被框住 | `unending-gallery` 无终局陈列廊 | 空位和影子各走各的，画框终于承认它留不住每一个路过的人。你带着不属于照片的部分离开。 |

叠印的空人形和影子分别保留第一/第二次编号、虚实或线型区别；相同坐标应真的重叠，不把两个相同站位强行分开展示。显示两次站位/灯位/影位和关系解释，附第一张灯光余味：左灯“左侧的灯替缺席者留了一点暖。”，右灯“右侧的灯照见了一个还没离开的空位。”。照片寄出后的签收和图鉴显示同一真实有序对。

四结果即完整章节，不要求刷完100对。重复同结果允许换实际曝光对，runs累加但 endings 去重，仅该结果最新底片刷新。集齐四结果在痕迹室显露 v104 文案钩子“替别人醒来的旅馆”：照片送到了，住客却睡在另一人的清晨里；本轮不实装下一章。

## 存档和到达事务

独立键 `goddead_v103_shadowless_photography`，version103。九个顶层字段：version、visited{studio,camera,darkroom}、draft{position,light,plates:[null,null]}、endings、latestPairByEnding、runs、lastOutcome、activePrint、pending。曝光只存 position/light，影位、分类、文案和图形完全派生。

严格归一化：位置不是1–5整数或灯位非法时相应设置安全默认；plates必须恰为两项，各项为null或合法两字段曝光，存在非法曝光/长度/类型则整对归空。不接受NaN、字符串数字、重复存储派生字段。endings只四个固定id去重；runs为0–9999整数；visited严格布尔；lastOutcome必须已收集；latest仅固定四键，且必须完整、分类匹配、对应结果已收集。activePrint只能为已收集结果和该结果最新合法有序对，额外字段剥离。未知字段不泄漏到存档HTML。坏JSON只读容错，不主动覆盖原串；保存走store.set失效memo。

七种 pending：entry（三个旧入口→studio）、start（studio→camera，fresh严格布尔）、preview（camera→darkroom）、revise（darkroom→camera）、print（darkroom→该结果固定旧目标）、print-return（精确旧目标→studio）、abandon（camera→studio）。pending按kind从domain、当前草稿/activePrint和固定反馈重新构造并精确比对，包括source、target、outcome和曝光对；拒绝多余字段、错目标、伪文案与错底片。start的新拍在抵达camera时清草稿，继续不清；其余预览/撤回/收起均保留当前runs，不强制归零。

source冷刷新恢复反馈和原事务，target只结算一次，不相关场景取消pending而不记结果。仅print真实到旧目标才runs+1、去重endings、更新该结果latest、写activePrint、清已送草稿；目标刷新不重复记账。签收面板“带着照片回照相馆”抵达studio才清activePrint。尚未返回时studio禁新拍/继续并提供精确target找回链接；可从目录找回，不能陷入必须再刷一次的死路。

新studio只接受规范entry/print-return/abandon的抵达目标，或实际visited.studio；合法studio source在冷刷新时可重播自身pending，不允许用不相关pending假标到访。已有未返activePrint时仍允许回到已经到访的studio使用精确找回链接。新camera只接受规范start/revise目标或实际visited.camera；新darkroom需要规范preview目标或visited.darkroom且两张完整底片。locked深链回remembrance且不写新章键；旧目标守卫只添加本章精确合法pending/activePrint/已收集lastOutcome桥，不放宽其它章节。三个签收目标合并四结果，多结果同落点仍显示实际activePrint，旧按钮与所有旧初始化保留。正常串行上游已完成、无其它历史pending/未返回执时，v82–v102的21键逐字节保持不变；不把此声明扩大为全站多章并发事务。与真实sceneInit、revealScene、resolveScene、bootstrap、sync目录、痕迹室codex、guide、forget和AutoAdvance接通，禁止bootstrap先假定threshold清事务。

pending键集显式固定：entry为kind/source/target/feedback；start再加fresh；preview再加plates；revise仍四基本字段；print再加outcome/plates；print-return再加outcome/plates并统一使用source而非from；abandon仍四基本字段。所有保存曝光对都必须与当前草稿或activePrint逐位置一致。合法重复曝光不可去重，合法空槽不可filter挪位；含null的两槽合法形状共121种（100完整、20单张、1空）。

所有原生实现使用真实trusted/offscene/first-lock，pending或activePrint时编辑闭锁。即时反馈和reduced-motion与现有系统一致。旧测试保留：v102模块切片终点改为唯一exact v103 start，新v103切片在guide前结束；若旧测试引用新增桥，补精确stub而不删旧断言。

## 美术和验收

三张1536×1024内置生图已生成并保留源PNG、运行WebP（q88，分别247434/208296/168738字节），真实加载与桌面/390×844叠层已验收：空椅照相馆、双重曝光取景台、红灯暗房。黑色木相机、乳白纱幕、冷灰空位与暗红显影灯，不复用四季班车美术。实际取景幕布安全叠层矩形x24–76%、y16–67%；暗房白板安全矩形x29–71%、y26–65%，坐标依据生成图复核而非沿用prompt估计。影位0–6映射到内部10–90%区域防边缘出框，标签按实际安全区尺寸修正，未移动真实物理中心。每张按需懒加载，原图本身不烘焙控件文字；最终几何截图与验收范围见本章QA记录。

390×844的控制≥44px，标题低于72px固定导航，读数、底片和说明位于图片区下方正常流；叠层不可遮掉原画主体，单图一眼能看出真实缺席与影位。桌面和同页手机验收必须实际看图、点原生控件和键盘；仅复用现有Chrome标签80231134，不开新窗、不用Playwright。原存档先全量备份，只seed规范quiet v82–v102已完成上游，从空v103档实拍四种关系和不同曝光对的重复结果；检查擦一张、换序、设置不改已拍、预览撤回、收起继续、source/target冷刷新、未返回找回、三入口、图鉴真实曝光和v104钩子、深链锁定；结束逐key恢复存档、URL与viewport，撤QA键。

Gemini测试实际生产模块与真实HTML绑定，独立枚举100对10/10/6/74、10单曝光/合法部分对和非法形状；七pending规范接受基线后逐字段污染拒绝，真实resolve/sceneInit/bootstrap源接线与source/target/无关页冷恢复、重复结算、旧目标窄桥、上游临时闭锁/坏JSON原串保存、globalforget、guide真实目标与nativebutton唯一ID。函数/DOM/timer桩测试、独立真实getter链和ComputerUse实玩分开记录，不混称全页引导。

根设计与图片提示词/QA由Codex维护；README、GameplayFlow、ProgressLog、Tasks由exact Gemini在证据齐备后更新，准确标明本地尚未发布状态。
