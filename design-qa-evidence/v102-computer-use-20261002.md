# v102 候车亭验收记录

2026-10-02。在已完成且未发布的本地v101基础上增加四季排班玩法。Codex负责设计、三张内置生成原画和独立验收；exact `gemini-3.7-flash-high` 负责全部生产前端、测试与实现文档。真实Computer Use通过并完成原档恢复；最终主套件18422断言、v101原12组及v102新增22组全通过。以下明确区分函数桩与整页验收。

## 已取得证据

设计约定在 `docs/V102WeatherlessShelterDesign.md`；三张实际1536×1024的PNG原图和运行WebP已保存本地，WebP分别267178、227296、283720字节，均目视复核。提示词、压缩质量与六个SHA256在 `docs/V102ImagePrompts.md`。真实前端三图complete/naturalWidth1536，控制台warn/error读取为空。

独立只读分析了209个合法部分排列、4180次选票/槽转换与24个完整排列，分类4/4/16；这是生产函数级分析，不是整页Computer Use。审查发现入口没有临时Available禁用、厅内列表容器被覆盖、CSS旧class越界和排班按钮位置偏离图中石板，均已回交Gemini并修正，不由Codex手改前端。

上游QA fixture在ignored `.v102-gemini/upstream-v82-v101-seed.json`：20个上游key，19个旧seed逐字节保留，v101三结局、runs3、空草稿、pending/activeCourier均空；不含v102存档。`node .v102-gemini/build-upstream-seed.mjs --verify-existing` 证明真实生产getter规范roundtrip，逐个删除任一上游key或v101结局会关闭设计前置。其v81在函数验证中为既有完成桩；浏览器使用用户原有v81基础加20项seed，确实显示入口。v102自身从不存在的键开始，全部进度均由真实原生点击产生，没有注入本章结局或visited。

## 浏览器范围与准备

只复用Chrome浏览器1的游戏标签80231134，URL `http://127.0.0.1:4173/`，没有开新窗口或使用Playwright。原存档21项先逐项完整备份，再写20项规范上游seed；默认1470×779，390×844仅在同页临时覆盖。CDP只用于开发读回、QA seed/恢复和强制冷刷新，游戏选择、排票、发车、签收、目录及图鉴展开都由native Computer Use点击/真实回车执行。

## 真实页面验收

从门外native `ws-entry-threshold`进入候车亭；首击立即有反馈、在途禁用；新排一班到空牌。样例只显示春夏秋冬，四槽仍null、runs0。春票鼠标放第一槽，夏票第二槽用真实Return，其余手动补完；完整判为顺季。预览仍runs0/endings空。撤回改班后即时捕获规范revise pending，途中硬刷新自动回排班牌，四票原样保留、未记班次。

| 真实次序 | 实际签收目标 | 到站计数 | 结果 |
| --- | --- | --- | --- |
| 春雨→盛夏→落叶→霜雪 | `threshold` 门外 | runs1 | 天气终于上车；目标冷刷新仍runs1，然后签收回亭 |
| 春雨→霜雪→落叶→盛夏 | `minute-before-archive` 前一分钟档案井 | runs2 | 季节退回昨天；正常签收回亭 |
| 春雨→落叶→盛夏→霜雪 | `unending-gallery` 无终局陈列廊 | runs3 | 各过各的季节；未签收先通过目录回亭，准确显示#unending-gallery找回、新班次禁用；沿找回链接回廊签收，次数不增加 |
| 霜雪→春雨→盛夏→落叶 | `threshold` 门外 | runs4 | 顺季结果仍去重为3结局；最新顺季排列更新为冬起，另两条最新排列保留，冬起故事实际可见 |

重复班次前另测原生编辑：`[冬,春,null,null]`→移动春票到空第三槽成为`[冬,null,春,null]`→点第一槽交换成`[春,null,冬,null]`→取下冬票成`[春,null,null,null]`；全程runs3、不完整预览禁用。收起途中冷刷新回亭，半班仍在；真实“继续排这一班”回牌后手排冬春夏秋。发车首击捕获depart source=platform/target=threshold/order冬起/runs3，途中冷刷新后到门外才runs4，最后回亭activePassenger/pending清空、draft四null。

20项quiet上游rawJSON在每条落点和最终四班后全都逐字节不变。痕迹室四季柜真实展开：显示三个最新排列、各自故事、3/3、发车4次及v103“收不到影子的照相馆”钩子；native `ws-entry-remembrance`首击即时反馈并实际回亭。此fixture没有满足旧全局进度卡的全部基础门槛，所以“找到入口”定位映射由生产函数检查，不声称该卡完整UI点击已做。

## 视觉缺陷与复验

初版新页body padding1.5rem导致sceneScroll0时kicker y24落于固定topbar底72.09px之上。Gemini唯一CSS修正为新三页padding `5.75rem 1rem 1.5rem`，旧页样式不动。最终桌面标题约121.04px、手机标题约120.76px；手机390×844四槽46.84×44px、石板内对齐、无横向溢出，状态与说明在正常流，不压住槽位。

- `v102-01-shelter-desktop.png`：初版标题遮挡证据，不作为最终通过图。
- `v102-02-board-mobile-before-header-fix.png`：初版牌面位置证据，页面已滚动127.5px，不把滚出视口的标题算成另一缺陷。
- `v102-03-board-mobile-final.png`：最终手机逆季排班，scroll0，标题留白和石板四槽可见。
- `v102-04-shelter-desktop-final.png`：最终桌面候车亭，标题/文案/原画可见。
- `v102-05-board-desktop-final.png`：冬起顺季的真实桌面操作区，native向下滚动后四槽、选票、样例和动作按钮可见。

## 原档恢复与门禁

恢复前验证browser backup仍与内存原21项备份完全一致，额外key均在明确QA白名单。撤掉23项新增数据（20上游seed、本章key、QA backup和图鉴展开偏好），逐项写回原21项。恢复后的原档冷打开排班牌、暖打开站台/候车亭均回痕迹室；两入口隐藏，本章key仍null。最后地址恢复`http://127.0.0.1:4173/`，viewport reset回1470×779，21项原值再次全部raw exact、本章与备份键均不存在，仅保留原游戏一个预览页。撤除的都是可由fixture重建的测试数据，原存档未删除。

## 旧机制边界

v45 `enterRelief` 会调用到访记账（首次访问井会写入，已访问则不重复记）并可能重播 `relief-minute` timer；新章仅在合法倒季天气签收上下文略过该调用。普通旧井游览仍执行原逻辑。v63/v85等历史pending保持既有sceneInit取消/结算语义，未扩成全站并发事务系统。上游JSON字节不变的比较针对已完成、无另一个旧章转场的正常串行本章旅程，不声称任意组合冷档都原样。20项raw比较是v82–v101；另四班后的完整localStorage清单没有新增 `goddead_v45_absent_relief`，两类证据分开记录。

## 函数/接线验证与发布边界

当前生产module41,407bytes，与最新Geministaged逐字节一致，SHA256 `762988f4e9d8585498576aa0bbcc7cb76c7d984ccc1e6f1f74792ab917c9be87`。229唯一场景/cache102；21实际trusted-click绑定全部对应真实ID，sceneInit resolve/replay、forget和bootstrap接线检查通过。

独立生产边界：`node .v102-gemini/independent-v102-boundaries.mjs --production`，519断言/14组通过，包含真实v82–v101 getter链、7pending source/target/unrelated与21新VM冷快照、伪造字段拒绝、暂时Available门禁、三结果/重复次数/quiet上游不变；DOM/音频/timer为明示桩，isTrusted模拟仅用于函数测试。额外真实sceneInit+真实v45 get/mark/enter+WShelper 7组通过，其他旧初始化noop，状态getter/available为场景桩；它验证窄调用位置，规范状态另由519项证明，不是fullbootstrap。

最终由root独立并行复跑：`node --check script.js`、两份专用测试语法、`git diff --check`均通过；`node tests/site.test.mjs`输出18422 assertions passed；`node tests/v101.test.mjs`原12/12通过；`node tests/v102.test.mjs`新增22/22通过，最终测试SHA256 `2816c19bb9819e0b19606a416f585589bbcf500f04c697588e6d63e586ac4216`。旧回归保留，调整cache/累计场景数/旧模块结束边界与新增sync链，v100选择器维护回归继续保留。

v102专用套件执行真实生产本章模块与resolveScene，upstream getter/Available、DOM、音频和timer为明示桩，isTrusted模拟只属函数测试。包括24全排列4/4/16、625候选草稿（209合法部分排列）、编辑、真实注册的21个HTML原生button绑定/唯一ID、两入口与三结局串行送达、7类pending的10种listener捕获快照×source/target/无关页30个fresh harness冷恢复、暂时上游锁、每kind先接受canonical正样本再单字段篡改、实际get损坏JSON容错并保留原raw、唯一模块/header/guide/key边界；实际progressEntryButton从唯一script源提取编译，balanced div确认ws入口位于真实ws-codex且dw映射保留。非绑定DOM查询仍使用可生成节点的测试桩，不把它称真实DOM或fullbootstrap；519项独立真实上游链与本轮CU另行补证。

最后追加的第22组由Gemini独立编写，实际执行完整生产sceneInit与真实v45 get/mark/enter，联动本章真实normalize/resolve/replay；无关旧章函数显式noop，界面与timer仍桩。8情境验证倒季depart先略过旧初始化再到站落账、active刷新、return source重播、回亭清active后仅lastOutcome的普通井访问、错误目标、不满足Available、其他wick场景和普通minute；后五类保持旧逻辑，合法签收则旧raw不改、不新调度旧relief timer。其范围是具体初始化共存检查，不是全站全章bootstrap，也不承诺跨任意历史在途组合保留已经运行的全局计时器。

未commit、push或deploy，HEAD仍952d75c；v101及三个原无关文件保留。长期扩充goal保持active，v103仅故事钩子。
