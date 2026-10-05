## 2026-10-02 - v104 替别人醒来的旅馆实装任务清单

- [x] **v104 状态机与前端组件实装**：新增 `wake-for-another-hotel`、`borrowed-dawn-clockroom`、`shared-morning-veranda` 3 个场景（全站 235 场景，缓存 `v=104`），实现三钟 0..5 刻度借时流转（模 6 守恒、36 种合法钟态、4 类结局 20/5/10/1 派生）与三旧目标真实签收，状态独立存储于 `goddead_v104_wake_for_another_hotel`；入库 3 张 1536×1024（<300KB）素材并通过正常文档流代码面板展示钟面与借刻关系。
- [x] **测试套件与否定探针验证**：官方 `tests/v104.test.mjs` 包含 15 个测试组，与 v101~v104 四章节串行 65 个测试（12+22+16+15 全部通过）及主命令 `tests/site.test.mjs` 18,436 项断言严格区分；另经独立 6,146 模块断言、3,485 页面断言与 6,892 真实 22getter + 静态 HTML 注册断言验证，覆盖全部 216 种三元组分类（36 合法按 20/5/10/1 派生 + 180 非法守恒状态拒绝）、36 状态 BFS 遍历与 48 组独立全新 VM 挂起冷启动用例（非 48 次 CU 实机重载），5 种纯内存否定探针变异由独立诊断单独拦截确认。
- [x] **Computer Use 真实 5 晚实机验收与基准恢复**：在既有 Chrome 标签页 80231134 完成 5 晚原生游玩与真实签收返回，验证 4 种结局解锁与最新钟面更新；验证移动端 390×844 触控尺寸与无溢出合规；验收后精确清理 25 项 QA 键恢复 21 项基准 raw（未调 `localStorage.clear`），3 条 locked 深链重定向回 `remembrance` 且控制台 0 报错。
- [x] **文档闭环与 v105 钩子展示**：完成 README、GameplayFlow、ProgressLog 与 Tasks 同步，集齐四结局后显露 v105「只出售昨日的早餐铺」文案钩子（“住客终于醒来，早餐却还停在昨天。”，仅文案未实装）；详见 `docs/V104WakeForAnotherHotelDesign.md`、`docs/V104ImagePrompts.md` 与 `design-qa-evidence/v104-computer-use-20261002.md`。




## 2026-10-06 - v110 扫尘司实装任务清单

- [x] 设计文档 `docs/V110LastSweepDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 250 → 253，缓存 `v=110`）
- [x] 一笔扫完：纯函数相邻 / 延伸 / 完成判定、25 个砖按钮、SVG 路线、退回一步、重扫、收簸箕
- [x] 三间屋 × 三扇门、代神席 / 焚献炉 / 值夜室扫净签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」从 v109 接到 v110
- [x] 测试：`site.test.mjs: 19240 assertions passed`（每种组合 2–10 种扫法、模块认可测试深搜路线）；v101–v104 独立测试 65 项通过
- [x] 浏览器：完整存档下真实点击扫遍、签收返回、窄屏与听证会

## 2026-10-06 - v109 分茶铺实装任务清单

- [x] 设计文档 `docs/V109ExactTeaDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊 / v29 分支桥接（场景 247 → 250，缓存 `v=109`）
- [x] 量杯倒茶：纯函数互倒、BFS 最少步数、三只量器按钮、端起 / 灌满 / 倒空 / 重来 / 奉茶
- [x] 三位客人 × 三套茶具、回声档案室 / 血管维修井 / 忏悔称量室奉茶签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」从 v108 接到 v109
- [x] 测试：`site.test.mjs: 19075 assertions passed`（每种组合 3–7 步、按规划真实操作量准）；v101–v104 独立测试 65 项通过
- [x] 浏览器：完整存档下真实点击量茶、奉茶签收、窄屏与听证会

## 2026-10-05 - v108 借光司实装任务清单

- [x] 设计文档 `docs/V108BorrowedDaylightDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 244 → 247，缓存 `v=108`）
- [x] 镜面折光：纯函数光路、25 个镜面按钮、SVG 光路、入射光斑与窗、复原、开窗
- [x] 三间屋 × 三种光、无主投递所 / 神名注销科 / 访客守则借光签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」从 v107 接到 v108
- [x] 测试：`site.test.mjs: 18937 assertions passed`（穷举每种组合的镜面朝向验证可解性）；v101–v104 独立测试 65 项通过
- [x] 浏览器：完整存档下真实点击翻镜、开窗签收、窄屏与听证会

## 2026-10-05 - v107 调墨房实装任务清单

- [x] 设计文档 `docs/V107InkMixingDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 241 → 244，缓存 `v=107`）
- [x] 滑条调色：三根原生滑条、调色公式、碟中颜色、色卡与色差条、洗碟、倒墨
- [x] 三种样色 × 三档精度、走廊 / 神圣遗物科 / 余响交换台色样签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」从 v106 接到 v107
- [x] 测试：`site.test.mjs: 18784 assertions passed`（穷举 343 种配比验证可解性）；v101–v104 独立测试 65 项通过
- [x] 浏览器：完整存档下键盘与鼠标真实调墨并送到余响交换台

## 2026-10-05 - v106 今日排字房实装任务清单

- [x] 设计文档 `docs/V106TypesettingTodayDesign.md`；本机 Codex 生成三张场景图与一张拼版原图并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 238 → 241，缓存 `v=106`）
- [x] 滑块拼版：推块规则、确定性打乱、裁图碎块与原版参照、摆回原样、锁版
- [x] 三块版 × 三种摔法、门外 / 值夜室 / 焚献炉头版签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」从 v105 接到 v106
- [x] 测试：`site.test.mjs: 18670 assertions passed`（九种组合广度优先可解）；v101–v104 独立测试 65 项通过
- [x] 浏览器：完整存档下真实点击推齐并送到门外；窄屏布局修正

## 2026-10-05 - v105 只出售昨日的早餐铺实装任务清单

- [x] 发布本地已完成的 v101–v104（门禁全绿后一次提交推送）
- [x] 设计文档 `docs/V105YesterdayBreakfastDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 235 → 238，缓存 `v=105`），解锁接 v104 四种醒来
- [x] 听单复述：念单高亮与读屏播报、按上法端菜、上错撤回、出餐
- [x] 三张小票 × 三种上法、走廊 / 神名注销科 / 代神席早餐签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」从 v104 接到 v105
- [x] 测试：`site.test.mjs: 18544 assertions passed`；v101–v104 独立测试 65 项通过
- [x] 浏览器：完整存档下真实点击听单、上错、上齐并送到走廊

## 2026-10-02 - v103 收不到影子的照相馆实装任务清单

- [x] 完成收不到影子的照相馆、双重曝光取景台与未收影暗房 3 个场景的原生渲染与三入口接入，哈希场景扩充至 232 个并更新静态资源标记 v=103。
- [x] 实现 5 站位左右打光底片生成、有序插槽操作与人影几何重合派生 4 结局（10/10/6/74）到 3 个旧场景的打印寄出与闭环回程状态机。
- [x] 生成并配置 3 张 1536x1024 WebP 场景图像（<300KB），完成响应式布局与移动端样式适配。
- [x] 实装 tests/v103.test.mjs 16 项生产契约测试，主测试集 18429 项断言及 v101/v102/v103 共 50 项测试全部绿灯。
- [x] 现有 Chrome 标签页单步走查通过，验证冷热恢复、数据清理还原与清除手机视口 override，确认本地实装完成未发布并预留 v104 钩子（见 docs/V103ShadowlessPhotographyDesign.md、docs/V103ImagePrompts.md 与 design-qa-evidence/v103-computer-use-20261002.md）。

## 2026-10-02 - v102 没有天气的候车亭实装任务清单

- [x] 完成 `weatherless-bus-shelter`、`season-dispatch-board` 与 `four-season-platform` 3 个新场景的原生渲染与车票入口串接，哈希场景扩充至 229 个并更新 `v=102`。
- [x] 实现四季排班牌 4 插槽状态机（取放/移动/对调/替换/取下模式）、示例展示与 24 种全排列到 3 种去向的分流逻辑，确保预览、修改与放弃保留当前运行计数。
- [x] 生成并配置 3 张 1536×1024 WebP 场景图像与 CSS 响应式布局，修复移动端 72px 顶栏遮挡并保证无横向溢出。
- [x] 补充 `tests/v102.test.mjs` 22 项生产模块连接测试并保持主测试集 18422 项断言及 v101 测试全部绿灯。
- [x] 在现有 Chrome 标签页完成单步 Computer Use 走查，验证冷热刷新、发车去向、状态清除与数据还原，并预留 v103 文案钩子。

## 2026-10-02 - v101 黎明织造厂实装任务清单

- [x] 研发分工明确（Codex 设计/生图/ComputerUse，gemini-3.7-flash-high 前端逻辑/测试/文档；纯本地预览，未 commit/push/deploy）
- [x] 设计规范与原画提示词落盘（场景 223 → 226，静态缓存 `v=101`，Codex 生图 3 张原画转 WebP <300KB 懒加载）
- [x] 3 个新场景路由与状态机：`dawn-weaving-mill`、`day-night-loom`、`sky-cloth-drying-terrace`
- [x] 九格织机 9 个原生按钮（Tab 聚焦、Enter / Space 操作）、4 种模式、四向 BFS 连通判定与三种派生结局映射
- [x] 痕迹室图鉴挂载 `#dw-hook` 显露 v102 预留钩子
- [x] 状态键 `goddead_v101_dawn_weaving`（严格归一化、只读 v100、在途闭锁、latest 独立映射）
- [x] 试晒预览、旧场景晨间签收面板、回执清 courier、草稿保留与 runs 规则
- [x] 门禁与 Node 测试：`node --check`、`git diff --check`、`site.test.mjs`（18415 assertions passed）、`v101.test.mjs`（12 组通过，生产模块/resolveScene 配合桩及模拟 `e.isTrusted` 验证 19683 全穷举与 10 种冷快照覆盖 7 种 pending 状态转换）
- [x] 独立只读模块审计（501 assertions / 15 组函数级通过，非全流程 bootstrap）
- [x] 移动端 390×844 样式修复（状态栏改普通流，消除重叠与溢出，晾布台 192.66px 正方形预览完全容纳）
- [x] v100 边界维护修复（cawk 选择器及 pending 映射修复，ignoreCache 刷新后 abandon 即时反馈与名录验证，未跑全 9 仪式与 3 裁定）
- [x] Computer Use 完整三结局实机贯通（`lll...nnn` 双通结局故事送出、签收后尚未返回等待回执时织造厂找回链接跳转画廊签收并回执返回、`endings.length=3` 且三结局最新图案记录正确）
- [x] 重复结局累加与放弃继续草稿保留实机验证（送出不同光图案完成签收使 runs 累加至 4、`l........` 放弃草稿保留且不增 runs 后继续填格织造成功；全项实测见 `design-qa-evidence/v101-computer-use-20261002.md`）
- [x] 原始 21 项存储键全量恢复及 URL/视口调试状态还原（精确删除 22 项 QA 键，原 21 项 sortedJSON 完全一致，视口 1470×779 还原且缓存覆盖关闭、Debugger 停用，3 处深层未解锁入口均拦截至 `#remembrance`）













## 2026-09-25 - v100 百夜灵堂实装任务清单

- [x] 设计文档 `docs/V100WakeOfTheHundredthNightDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 220 → 223，缓存 `v=100`）
- [x] 翻牌配对：确定性发牌、翻开 / 扣回 / 描金、全部扣回、换更次重发、上香
- [x] 三副供牌 × 三更、焚献炉 / 余响交换台 / 无主投递所供香签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」扩展
- [x] 测试：`site.test.mjs: 18389 assertions passed`
- [x] 浏览器：真实点击翻牌配齐并送到余响交换台

## 2026-09-25 - v99 引路司实装任务清单

- [x] 设计文档 `docs/V99BureauOfRoadsDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 217 → 220，缓存 `v=99`）
- [x] 旋转路砖：砖型与转向、连通计算、亮起路径、出口状态、复位、落定
- [x] 三张路图 × 三个去处、门外 / 访客守则 / 值夜室路条签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」扩展
- [x] 测试：`site.test.mjs: 18251 assertions passed`（含 9 种组合穷举可解）
- [x] 浏览器：真实点击接通并送到值夜室

## 2026-09-25 - v98.1 痕迹室档案柜任务清单

- [x] 图鉴折叠：标题按钮、默认折叠、进度引导目标所在图鉴保持展开
- [x] 手动展开记在本机（过滤伪造值），展开 / 收起全部工具条，遗忘全部时清除
- [x] “找到入口”先展开目标图鉴
- [x] 测试：`site.test.mjs: 18133 assertions passed`
- [x] 浏览器：痕迹室 81,413 px → 8,038 px，真实点击展开

## 2026-09-24 - v98 守夜烛台实装任务清单

- [x] 设计文档 `docs/V98VigilOfNineCandlesDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 214 → 217，缓存 `v=98`）
- [x] 熄灯谜题：九支蜡烛按钮、翻转规则、目标小图、问守夜人、复位、封灯
- [x] 三架烛台 × 三种守法、神圣遗物科 / 神名注销科 / 代神席守夜签签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」扩展
- [x] 测试：`site.test.mjs: 18111 assertions passed`（含 9 种组合全部可解）
- [x] 浏览器：真实点击解谜并送到神名注销科

## 2026-09-24 - v97 失重局实装任务清单

- [x] 设计文档 `docs/V97BureauOfLostWeightDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊 / v29 支线桥接（场景 211 → 214，缓存 `v=97`）
- [x] 天平交互：砝码多选按钮、秤杆倾斜与秤盘下垂、落秤判定
- [x] 三样东西 × 三种称法、回声档案室 / 血管维修井 / 忏悔称量室称单签收与记忆段
- [x] 法庭条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」扩展
- [x] 测试：`site.test.mjs: 17979 assertions passed`
- [x] 浏览器：真实点击称平并送到忏悔称量室

## 2026-09-24 - v96 屏息当铺实装任务清单

- [x] 设计文档 `docs/V96HeldBreathPawnshopDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 208 → 211，缓存 `v=96`）
- [x] 风箱按住交互：指针捕获、空格 / 回车长按、压力表区间、松早 / 松晚提示、中途松脱
- [x] 三口气 × 三种赎法、走廊 / 余响交换台 / 无主投递所赎票签收与记忆段
- [x] 法庭条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」扩展
- [x] 测试：`site.test.mjs: 17869 assertions passed`
- [x] 浏览器：真实点按 / 空格接线、一次真实按住送回走廊、手机宽度

## 2026-09-24 - v95 停摆钟修理铺实装任务清单

- [x] 设计文档 `docs/V95StoppedClockRepairShopDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、治理 / 画廊桥接（场景 205 → 208，缓存 `v=95`）
- [x] 表盘交互：拖动吸附、方向键 / Home / 回车、刻痕、按图对齐的表针
- [x] 三只钟 × 三种修法、值夜室 / 访客守则 / 焚献炉修理单签收与记忆段
- [x] 听证条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」扩展
- [x] 测试：`site.test.mjs: 17762 assertions passed`
- [x] 浏览器：三只钟真实拖动 / 键盘 / 单击、拨错被拒、两项裁定、手机宽度

## 2026-09-24 - v94 回敲邮局实装任务清单

- [x] 设计文档 `docs/V94ReturnedKnocksDesign.md`；本机 Codex 生成三张原画并记录
- [x] 3 个场景、路由守卫、痕迹室 / 画廊放行（场景 202 → 205，缓存 `v=94`）
- [x] 节奏回敲交互：门环按钮、比例判定、示范、超时重来、画面内进度点
- [x] 三封信 × 三种方式、门外 / 代神席 / 痕迹室回信签收与记忆段
- [x] 仲裁条件与痕迹室缺项提示、三项可重复裁定、图鉴 9 + 3、「下一步」扩展
- [x] 测试：`site.test.mjs: 17652 assertions passed`
- [x] 浏览器：两封信真实点击节奏（含敲错被拒）、锁定深链、控制台
- [ ] 第三封信与仲裁庭的真实点击复验（面板转入后台时中断，已由自动测试覆盖）

## 2026-09-24 - v93 未被看见之物认领处实装任务清单

- [x] 设计文档 `docs/V93UnseenClaimsOfficeDesign.md`
- [x] 本机 Codex 生成三张场景原画，转 WebP 并记录提示词与哈希
- [x] 3 个场景、路由守卫、痕迹室 / 画廊放行（场景 199 → 202，缓存 `v=93`）
- [x] 提灯搜寻交互（指针 / 触屏 / 方向键 / Tab），视觉与判定同一半径
- [x] 五件物 × 三种认领方式，只有铜铃要跑主线房间；五个主线房间的回执与记忆段
- [x] 开庭条件与痕迹室缺项提示、三项可重复裁定、图鉴 15 + 3、「下一步」扩展
- [x] 旧场景面板在 grid 布局里横跨整行（顺带修正 v91 / v92）
- [x] 测试：`site.test.mjs: 17567 assertions passed`；浏览器真实指针 / 键盘全流程、锁定深链、375px

## 2026-09-24 - v92 目击责任保险局实装任务清单

- [x] 设计文档 `docs/V92WitnessLiabilityInsuranceDesign.md`
- [x] 本机 Codex 生成三张场景原画，转 WebP 并记录提示词与哈希
- [x] 3 个场景、路由守卫、痕迹室 / 画廊放行（场景 196 → 199，缓存 `v=92`）
- [x] 状态键 `goddead_v92_witness_liability`：12 字段、7 类 pending、只读 v91
- [x] 目击档案读档、五档眼睑滑杆、三种保单、三处理赔回执与记忆段、放弃 / 继续投保
- [x] 听证四条件与痕迹室缺项提示、三项可重复豁免裁定、图鉴 9 + 3、「下一步」扩展
- [x] 测试：`site.test.mjs: 17482 assertions passed`
- [x] 浏览器真实点击 + 键盘全流程、锁定深链、375px 布局、控制台
- [ ] 后续钩子「未被看见之物认领处」（仅设计文档一句）

## 2026-09-24 - v91 倒生原因助产院实装任务清单

- [x] 3 个场景、路由守卫与旧场景窄桥（场景 193 → 196，缓存 `v=91`）
- [x] 状态键 `goddead_v91_late_cause_maternity`：12 字段、7 类 pending 严格归一化、只读 v90
- [x] 助产院三家庭、登记室顺序卡与 18 条预览、三处接生回执与记忆段、放弃 / 继续登记
- [x] 开庭三条件与痕迹室缺项提示、三项可重复监护裁定、图鉴 18 + 3
- [x] 遗忘重置、启动只同步 UI、痕迹室「下一步」扩展
- [x] 测试：`site.test.mjs: 17378 assertions passed`
- [x] 浏览器真实点击全流程、锁定深链、375px 布局、控制台
- [ ] 后续钩子「目击责任保险局」（仅设计文档一句，未规划）

## 2026-08-30 - v87 不存在债务催收局实装与独立验收任务清单

- [x] **v87 场景与路由构建**
  - [x] 新增 `nonexistence-debt-collection-agency`、`absence-arrears-ledger-vault`、`ontological-repossession-chamber`、`unpayable-existence-bankruptcy-court` 4 个场景（总场景数 177 -> 181，缓存 `v=87`）。
  - [x] 只读引入 `goddead_v86_existence_renunciation`，建立 `goddead_v87_nonexistence_debt_collection` 持久化结构（包含 11 个核心字段与 7 种 `pending` 状态定义）。
  - [x] 部署 18 组 `isTrusted` 受信监听器，构建涵盖 36 项催收组合与 3 项破产裁决的 39 个状态单元。
- [x] **缺陷诊断与逻辑修正**
  - [x] 修复 debtor、instrument、remedy、collector-return、bankruptcy-action 5 处状态门禁反转缺陷。
  - [x] 编写对应的单元与集成回归测试断言。
- [x] **代码与测试门禁验证**
  - [x] 运行 `node --check script.js`（通过）
  - [x] 运行 `node --check tests/site.test.mjs`（通过）
  - [x] 运行 `git diff --check`（通过）
  - [x] 运行 `node tests/site.test.mjs`（输出 `site.test.mjs: 14846 assertions passed`）
- [x] **端到端浏览器 QA 与证据归档**
  - [x] 单窗口单标签页验证路由守卫降级、4 组受信流（覆盖全部债务人、法器、处置方案及回溯目标）与 3 类破产跳转。
  - [x] 验证刷新幂等性与 `{bad` 格式容错，确认移动端（390×844）无溢出。
  - [x] 恢复 22 个 localStorage 键，确认 `goddead_v83_harm_archaeology.hearingOutcomes.length === 1`，归档 5 项 QA 证据文件，重置至 `#remembrance`。
  - [x] 保持本地修改，不执行 commit、push、deploy 或线上发布。

## 2026-08-30 - v86 存在放弃登记局实装与独立验收任务清单

- [x] 四个新增场景路由接入：`existence-renunciation-registry`、`proof-of-nonexistence-archive`、`ontological-disinheritance-chamber`、`civil-nonexistence-final-tribunal`，场景总数从 173 扩充至 177，静态资源缓存查询标记升级为 `v=86`。
- [x] 状态模型与存储隔离：新增 `goddead_v86_existence_renunciation` 状态键，包含 11 个规范字段、36 份本体注销令与 3 项裁定定义、7 项 strict pending 判定及 18 处 isTrusted 真实交互校验，对 v85 数据仅只读读取，绝不写回旧状态键。
- [x] 分工协同：Codex 完成设计方案、生图与资产复核接入、机械应用、Computer Use QA 验证及证据归档；Gemini 完成前端生产代码、自动化测试与六份实现文档编写。
- [x] 四项门禁全绿：通过 `node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check`，且 `node tests/site.test.mjs` 输出 `site.test.mjs: 14713 assertions passed`。
- [x] 交互链路验证：人工通过 4 条受信任流程合计覆盖 3/3 renunciants / 3/3 evidences / 4/4 clauses / 3/3 old targets；旧落点正确导向 `birth-ballot-booth`、`blank-name-cloakroom`、`reality-refund-counter`；空摇篮登记员、预先抹除登记员、未交付肉身登记员三位登记员正常返回；三项终审庭裁定真实落入 `threshold`、`remembrance`、`unending-gallery`。
- [x] 路由锁定与降级：未解锁直达 `#existence-renunciation-registry` 安全降级回退至 `#threshold`，未渲染 v86 场景。
- [x] 浏览器环境与响应式验收：单一 Chrome 窗口与标签页（停靠 DevTools）下通过 Desktop 与 Mobile（390×844，`scrollWidth`/`bodyScrollWidth` 为 390，无横向溢出）验收，刷新保持幂等，malformed 数据安全容灾，测试后原样恢复原 22 个 localStorage 键（v83 原听证数 1，无 QA 残留键）。
- [x] 证据文件归档：生成 `design-qa-evidence/v86-browser-qa.json` 与 5 张 v86 desktop/mobile PNG 验收截图证据。
- [x] 文档同步：同步更新 README、design-qa、ImplementationPlan、ProgressLog、Tasks、V86 design 六份文档。
- [x] 本地研发约束遵守：全流程保持本地执行，不执行 commit / push / deploy / public release。

---

## 2026-08-30 - v85 孤事实认领处实装与独立验收任务清单

- [x] 四个新增场景路由接入：`orphaned-fact-claim-office`、`fact-inheritance-vault`、`causal-estate-execution-desk`、`ownerless-truth-estate-court`，场景总数从 169 扩充至 173，静态资源缓存查询标记升级为 `v=85`。
- [x] 状态模型与存储隔离：新增 `goddead_v85_orphaned_fact_claims` 状态键，包含 11 个状态字段、36 份继承契据与 3 项裁定定义、7 项 strict pending 判定及 18 处 isTrusted 真实交互校验，对 v84 数据仅只读读取，绝不写回旧状态键。
- [x] 分工协同：Codex 完成设计方案、生图与资产复核接入、机械应用、缺陷诊断、Computer Use QA 验证及证据归档；Gemini 完成前端生产代码、自动化测试、窄桥放行逻辑修复与六份实现文档编写。
- [x] 四项门禁全绿：通过 `node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check`，且 `node tests/site.test.mjs` 输出 `site.test.mjs: 14593 assertions passed`。
- [x] 交互链路验证：人工通过 4 条受信任流程合计覆盖 3 facts / 3 proofs / 4 obligations / 3 old targets；旧落点正确导向 `contradictory-evidence-archive`、`blank-name-cloakroom`、`minute-before-archive`；伤印、影供、未来账单三位执行员正常返回；三项终庭裁定真实落入 `threshold`、`remembrance`、`unending-gallery`。
- [x] 窄桥拦截修复：Codex 诊断出第三项裁定被旧 guard 改写后，Gemini 编写 `!orphanedFactBridgeAllows('unending-gallery')` 窄桥放行修复与永久断言。
- [x] 浏览器环境与响应式验收：单一 Chrome 窗口与标签页下通过 Desktop（1312×768）与 Mobile（390×844，无横向溢出）验收，刷新保持幂等，malformed 数据安全回退，测试后原样恢复原 22 个 localStorage 键。
- [x] 证据文件归档：生成 `design-qa-evidence/v85-browser-qa.json` 与 5 张 v85 desktop/mobile PNG 验收截图证据。
- [x] 文档同步：同步更新 README、design-qa、ImplementationPlan、ProgressLog、Tasks、V85 design 六份文档。
- [x] 本地研发约束遵守：全流程保持本地执行，不执行 commit / push / deploy / public release。

---

## 2026-08-29 - v84 无罪证人保护院实装与验证任务清单

- [x] **前端场景与状态机实装**
  - [x] 新增 4 个场景定义与路由注册（场景数扩展至 169，更新 Cache `v=84`）。
  - [x] 实现 11 个持久化字段的存储契约及单向读取 v83 判定。
  - [x] 实现证人选择、洗消程序、4 条保护条款安置流转及 36 组合矩阵统计。
  - [x] 实现 3 名身份掩护员旧场景跳转/回跳与终身安置庭 3 种裁决闭环。
- [x] **自动化测试与静态检查**
  - [x] 扩展 `tests/site.test.mjs` 测试矩阵并执行语法检查。
  - [x] 运行全量测试套件并通过全部 14,473 项断言。
- [x] **浏览器实机 QA（单一 Chrome 窗口单一标签页）**
  - [x] 验证未解锁路由守卫重定向至 `#threshold` 与 v83 全听证达成后解锁入口。
  - [x] 真实受信任点击执行 4 次覆盖全轴安置、3 位掩护员流程及 3 种安置庭裁决。
  - [x] 验证刷新幂等性与损坏数据容灾恢复，确认 0 控制台报错。
  - [x] 采集 Desktop (1312x768) 与 Mobile (390x844) 视觉物证，核验热区标准。
  - [x] 完整恢复用户原有 22 个 localStorage 键值与测试前用户进度。
- [x] **文档同步与交付**
  - [x] 同步 ImplementationPlan、Tasks、ProgressLog、design-qa、README 及设计稿验收记录。
  - [x] 维持本地交付边界（no commit / no push / no deploy / no public release）。

---

## 2026-08-29: v83 伤害考古局实装与验收归档

- [x] 完成 v83 4 个新场景结构与样式设计（165 场景总量，WebP 引用附带 `v=83` 缓存标）
- [x] 实现 3 遗址 × 3 器具 × 4 案发阐释伤害考古报告生成机制与二次伤害听证庭终局逻辑
- [x] 接入 `goddead_v83_harm_archaeology` 本地存储（11 字段、7 pending 状态、18 `isTrusted` 监听器）
- [x] 补齐自动化单元与集成测试（`tests/site.test.mjs: 14319 assertions passed`）
- [x] 执行桌面端 (1470x774) 与移动端 (390x844) 真实单窗口浏览器 QA，落盘凭证数据与截图
- [x] 验证状态持久化与非法路由防护，测试后恢复环境，完成本地交付准备

## v82 · 宽恕填埋场 / FORGIVENESS LANDFILL
- [x] 新增 4 处场景（157 -> 161：`forgiveness-landfill`、`inert-harm-certificate-vault`、`mercy-burial-trench`、`harmlessness-final-well`）及 1536x1024 视觉资产，版本查询标识升至 `v=82`
- [x] 建立 3 废料 × 3 凭证 × 4 处置（36 记录）与 3 井裁结局（39 图鉴单元）逻辑
- [x] 接入持久化存储键 `goddead_v82_forgiveness_landfill`（11 个规范字段、7 种挂起类型、3 族回写、18 处 `isTrusted` 监听，单向读 v81 且遗忘不回写）
- [x] 修复图鉴清空范围、入口外壳坍塌、记录器反馈显隐 3 项缺陷并补充永久回归测试
- [x] 通过静态语法检查与单元测试（`site.test.mjs: 13642 assertions passed`）
- [x] 通过 Computer Use 真实浏览器验收（4 轮交互、3 族回跳、动作 `seal-every-forgiven-harm-forever`、状态自愈、双端视口适配），控制台 0 异常（仅含 1 处 hero.png 预加载非致命警告），留存 5 项证据
- [x] 本地实现与独立验收已全部闭环，当前无 commit / push / deploy / 外部发布，下一阶段为 v83 伤害考古局 / BUREAU OF HARM ARCHAEOLOGY

## v81 · 后悔回收厂 / REGRET RECLAMATION PLANT

- [x] **架构与世界观扩展**: 场景总数 153→157，新增 `regret-reclamation-plant`、`abandonment-residue-weighhouse`、`second-life-smelting-line`、`zero-waste-life-furnace`。
- [x] **配方与终局设计**: 实装 36 种残渣熔炼配方（3×3×4）与 3 种回转窑产物，构筑 39 项全景 Codex；配置 3 处申诉/挪用/矫正回收目标及 3 处追忆/回廊/献祭回转窑目标。
- [x] **数据模型与状态持久化**:
  - [x] 仅使用规范 Storage Key `goddead_v81_regret_reclamation`。
  - [x] 规范化 11 个核心字段（`version`, `visited`, `draft`, `batches`, `furnaceOutcomes`, `batchRuns`, `furnaceRuns`, `materialTallies`, `lastOutcome`, `activeReclaimer`, `pending`）。
  - [x] 强化 7 类 `pending` 事务防伪模式与 18 处严格 `isTrusted` 事件监听防护。
- [x] **美术资产与资源管线**: 生成并接入 4 组 1536×1024 源 PNG 及优化 WebP 素材，哈希/尺寸全冻结。
- [x] **核心代码与样式实现**:
  - [x] 更新 `index.html` 结构、无障碍语义标签与视口配置。
  - [x] 更新 `styles.css` 布局、动态状态反馈、响应式适配。
  - [x] 更新 `script.js` 交互状态机、路由窄桥防抖、持久化与异常回退。
- [x] **自动化测试与静态门禁**:
  - [x] Node.js 语法检查通过。
  - [x] 补充并执行 `site.test.mjs`（覆盖组合穷举、防伪模式、窄桥冷热 Replay、合成事件零副作用防护等）。
  - [x] 自动化测试断言：运行 `node tests/site.test.mjs`，通过全部 12967 项断言（`site.test.mjs: 12967 assertions passed`），覆盖 36 个批次重塑组合与 3 种人生熔炉走向行为矩阵。
- [x] 后悔回收厂全流程 QA 与视口/无障碍验收
  - [x] 单 Chrome 窗口/标签页（DevTools 停靠）实测 4 批次，原料（3 种）、残留（3 种）、用途（4 种）及 3 次回收员返回全覆盖，人生熔炉导向 `remembrance`、`unending-gallery`、`offering`。
  - [x] 桌面端 915×784（宽度 915px 无溢出）、移动端 390×844（宽度 390px 无溢出），4 张 v81 WebP 资产自然分辨率 1536×1024。
  - [x] 修复 `<figure>` 的 `role="img"` 压平子按钮缺陷，确保 3-3-4-3 按钮与 alt 无障碍可访问，控制台无应用错误/警告，生成 3 项凭证文件。
- [x] 本地验收与状态冻结：当前改动保持本地未提交（未执行 git commit/push/发布），归档凭证并准备衔接 v82。

> **独立验收结论（v81）**：后悔回收厂（REGRET RECLAMATION PLANT）功能、视觉、交互与无障碍修复均已在本地 Chrome 环境（单标签页+DevTools 停靠）完成验证。`node tests/site.test.mjs` 输出 `site.test.mjs: 12967 assertions passed`（覆盖 36 批次重塑与 3 种人生熔炉走向行为矩阵）；实测覆盖原料（3 种）、残留（3 种）、用途（4 种）、3 次回收员返回及跳转至 `remembrance`、`unending-gallery`、`offering` 场景；双视口（915×784 / 390×844）无溢出，WebP 资产自然分辨率 1536×1024，交互 `<figure>` 扁平化无障碍缺陷已修复，控制台无应用错误与警告（仅 Built-in AI 环境 info 噪点）；3 项 QA 凭证已归档于 `design-qa-evidence/v81-browser-qa.json`、`design-qa-evidence/v81-regret-reclamation-plant-desktop.png` 与 `design-qa-evidence/v81-regret-reclamation-plant-mobile.png`。本地验收一致通过，保持未提交状态，可直接进入 v82 开发。

## v80 未遂思想收容所 (Asylum for Unfinished Thoughts) 任务清单

- [x] v80 页面结构注入 (4 场景 + 3 旧场景医师容器 + 痕迹图鉴)
- [x] v80 CSS 样式扩展与 1536x1024 热区布局 (移动端 min 44px 适配)
- [x] v80 JS 状态机、严格 11 字段存储、7 类 pending 处理、18 处 isTrusted 监听
- [x] v80 自动化与隔离测试套件 (包含 Hash/Byte 冻结、36+3 穷举、覆盖率验证)
- [x] 文档与版本同步更新 (v80, 153 scenes)
- [x] Codex 独立静态与真实浏览器 QA 验证

> **独立验收结论 (v80)**:
> 1. **静态门禁**: `node --check script.js`、`node --check tests/site.test.mjs` 与 `git diff --check` 全绿；`node tests/site.test.mjs` 输出 `site.test.mjs: 12213 assertions passed`。
> 2. **真实浏览器 QA**: 均在同一个 Chrome 窗口/标签页内执行。锁定 v80 hash 后平滑返回 remembrance；完成一条代表 admission 真实点击链（remembrance → unfinished-thought-asylum → interruption-trace-archive → counterfactual-treatment-lab → unlived-nursery → 删日医师返回 asylum）；cold target/source pending 各完成一次结算与续播；四张 v80 图 complete/natural 均为 1536×1024；桌面四幕人工看图；移动 viewport 500×778、documentWidth 500、无横向溢出、三个 asylum 热点分别为 124×215 / 147×215 / 124×215；真实点击两条听证结局（the-thought-completed-its-thinker → #unending-gallery，all-abandoned-possibilities-were-recycled → #counterfactual-spindle），pending 均回到 null；第三条结局由自动化矩阵覆盖。
> 3. **证据留存**: 已保存 `design-qa-evidence/v80-browser-qa.json` 及 4 张桌面与移动端截图证据。本轮只做本地验收，未 commit、push 或 deploy。

# Tasks — Goddead

## v79 未言人格继承院 / COURT OF UNSPOKEN PERSONHOOD

### Gemini 3.7 Flash High 负责（生产前端 / 测试 / 文档）
- [x] 依据 `docs/V79UnspokenPersonhoodCourtDesign.md` 编写生产前端与测试
- [x] 验证 `script.js` v79 状态模块（key `goddead_v79_unspoken_personhood`、十一键投影、七类 pending）
- [x] 接入 18 组 `isTrusted` 点击监听与 handler→DOM 绑定
- [x] 接入 `sceneInit` / `goScene` 守卫 / `DOMContentLoaded` / `forget-all` 集成
- [x] 添加 4 个新场景 HTML、preload、目录链接、Remembrance 记忆/图鉴/入口
- [x] 在 confession / testament-clearing-vault / unseated-listening-booth 添加执行官回流容器
- [x] 添加 v79 CSS（figure、hotspot、executor、codex、响应式）
- [x] 更新 `tests/site.test.mjs`：149 场景、素材冻结、handler→DOM 校验、运行时回归、v70–v79 线性化扩展
- [x] 更新缓存版本 `v=78 → v=79`
- [x] 更新 `README.md`、`design-qa.md`、`docs/ProgressLog.md`
- [x] 更新 `docs/ImplementationPlan.md` 与 `docs/Tasks.md`
- [x] 更新 `docs/V79UnspokenPersonhoodCourtDesign.md` 实现状态

### Codex 负责（设计 / 素材 / 独立验收）
- [x] 运行静态门禁（node --check ×2、git diff --check、site.test.mjs）
- [x] 桌面 1280×720 浏览器验收
- [x] 手机 390×844 浏览器验收
- [x] 真实三段点击（claimant → evidence → mode）与闭唇执行官回程
- [x] 无署名回声 / 空听筒归息旧落点的专属反馈与 enabled 返回控件
- [x] 四份 coverage 解锁终审
- [x] 三终审静态全覆盖；中央结局真实点击通过
- [x] 重载幂等验证
- [x] 锁定 hash 与 malformed JSON 降级验证
- [x] 页面 console 无 error 验证
- **独立验收结论**：Gemini 3.7 Flash High 编写生产前端、测试与两项修复；Codex 负责设计素材、应用输出、诊断与独立 QA。`node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check` 与 `node tests/site.test.mjs` 全绿，最终 `11535 assertions passed`。浏览器真实完成 4 条三段点击流，合计覆盖 3 claimant / 3 evidence / 4 mode；三处执行官 `confession` / `testament-clearing-vault` / `unseated-listening-booth` 均有专属反馈和 enabled 返回，返回后 draft / activeExecutor / pending 清空。4/36 解锁终审，真实点击 `divide-personhood-among-all-listeners` 得到 `personhood-was-divided-among-the-unhearing`，状态为 4 grants、1/3 tribunal outcomes，UI 解锁 5 格图鉴，重载后持久化状态严格相等。锁定 hash、malformed JSON、1280×720、390×844、四图 1536×1024、热区 ≥44px / 图内 / 不重叠、横溢 ≤1px 与 console/page/resource 诊断 0 均通过。修复为运行时 `_v78unlocked` 与持久化十一键分离，以及 v29 守卫增加窄条件 `!unspokenPersonhoodBridgeAllows(target)`，避免合法 `confession` 被改写到 `#corridor`。证据：`design-qa-evidence/v79-browser-qa.json`、`design-qa-evidence/v79-executor-confession-desktop.png`、`design-qa-evidence/v79-unspoken-personhood-court-desktop.png`、`design-qa-evidence/v79-tribunal-coverage-desktop.png`、`design-qa-evidence/v79-unspoken-personhood-court-mobile.png`。仅本地验收，未 commit、push、deploy 或发布。

## v78 第一人称配给署 / FIRST-PERSON PRONOUN RATIONING BUREAU

### Gemini 3.7 Flash High 负责（生产前端 / 测试 / 文档）
- [x] 依据 `docs/V78FirstPersonRationingDesign.md` 编写生产前端与测试
- [x] 验证 `script.js` v78 状态模块（key `goddead_v78_first_person_rationing`、十一键投影、七类 pending）
- [x] 接入 18 组 `isTrusted` 点击监听与 handler→DOM 绑定
- [x] 接入 `sceneInit` / `goScene` 守卫 / `DOMContentLoaded` / `forget-all` 集成
- [x] 添加 4 个新场景 HTML、preload、目录链接、Remembrance 记忆/图鉴/入口
- [x] 在 threshold / blank-name-cloakroom / remembrance 添加发声员回流容器
- [x] 添加 v78 CSS（figure、hotspot、allocator、codex、响应式）
- [x] 更新 `tests/site.test.mjs`：145 场景、素材冻结、handler→DOM 校验、运行时回归
- [x] 更新缓存版本 `v=77 → v=78`
- [x] 更新 `README.md`、`design-qa.md`、`docs/ProgressLog.md`
- [x] 创建并更新 `docs/ImplementationPlan.md` 与 `docs/Tasks.md`
- [x] 更新 `docs/V78FirstPersonRationingDesign.md` 实现状态
- [x] 静态门禁 Codex 独立执行通过（node --check ×2、git diff --check、10954 assertions passed，含 v70–v78 解锁链线性化回归）

### Kimi 负责（前端 / 测试 / 文档）
- [x] 阅读 `docs/V77SelfAuthenticityOfficeDesign.md` 与 v76 实现模式
- [x] 实现 `script.js` v77 状态模块（key `goddead_v77_self_authenticity`、十一键投影、七类 pending）
- [x] 实现 18 组 `isTrusted` 点击监听与 handler→DOM 绑定
- [x] 接入 `sceneInit` / `goScene` 守卫 / `DOMContentLoaded` / `forget-all` 集成
- [x] 添加 4 个新场景 HTML、preload、目录链接、Remembrance 记忆/图鉴/入口
- [x] 在 scar-loom / borrowed-childhood / lifetime-pawn-vault 添加鉴定员回流容器
- [x] 添加 v77 CSS（figure、hotspot、authenticator、codex、响应式）
- [x] 更新 `tests/site.test.mjs`：141 场景、素材冻结、handler→DOM 校验、运行时回归
- [x] 更新缓存版本 `v=76 → v=77`
- [x] 更新 `README.md`、`design-qa.md`、`docs/ProgressLog.md`
- [x] 创建 `docs/ImplementationPlan.md` 与 `docs/Tasks.md`
- [x] 更新 `docs/V77SelfAuthenticityOfficeDesign.md` 实现状态
- [x] 跑静态门禁并修到全绿

### Codex 负责（设计 / 素材 / 独立验收）
- [x] Chrome 深链种子真实点击预检：v76 / v77 Remembrance 入口、记忆与图鉴按前置状态显露
- [x] 桌面 1280×720 浏览器验收
- [ ] 手机 390×844 浏览器验收（视口覆写未生效；窄屏几何静态断言已通过）
- [x] 真实三段点击（speaker → entitlement → scheme）与首息发声员回程
- [x] 无主签名 / 未来回声旧落点的专属反馈与 enabled 返回控件
- [x] 四份 coverage 解锁终审
- [x] 三终审静态全覆盖；中央结局真实点击通过，另两项不作手动浏览器声明
- [x] 重载幂等验证
- [x] 锁定 hash 与 malformed JSON 降级验证
- [x] 页面 console 无 error 验证

### 向后扩充
- [x] v84 无罪证人保护院 / WITNESS PROTECTION FOR THE INNOCENT（169 scenes，已完成本地实现与独立浏览器 QA，详见 `docs/V84WitnessProtectionForInnocentDesign.md`）
- [x] v85 孤事实认领处 / CLAIM OFFICE FOR ORPHANED FACTS（173 scenes，已完成本地实现与独立浏览器 QA，详见 `docs/V85OrphanedFactClaimOfficeDesign.md`）
- [x] v86 存在放弃登记局 / REGISTRY FOR RENOUNCING EXISTENCE（177 scenes，已完成本地实装与独立浏览器 QA 验收，详见 `docs/V86ExistenceRenunciationRegistryDesign.md`）
- [x] v87 不存在债务催收局 / COLLECTION AGENCY FOR NONEXISTENCE DEBT（181 scenes，已完成本地实装与独立浏览器 QA 验收，详见 `docs/V87NonexistenceDebtCollectionAgencyDesign.md`）

## v88 完成清单 — 未发生事件拍卖行

- [x] 场景总数 181→185；新增 `auction-house-for-events-that-never-happened`、`catalogue-of-unoccupied-reality`、`counterfactual-bidding-floor`、`retroactive-occurrence-title-court`；缓存标记 `v=88`。
- [x] 生成并接入 4 张源 PNG 与 4 张运行时 WebP，全部 1536×1024。
- [x] 实现 36 purchases + 3 title outcomes；coverage 覆盖 3/3 bidders、3/3 lots、4/4 methods。
- [x] 接入状态键 `goddead_v88_unhappened_event_auction`，严格 11 个顶层字段、7 类 pending、18 个 `isTrusted` 点击监听；只读 v87，forget-all 不写旧键。
- [x] 在 `forgiveness-landfill`、`undeclared-war-room`、`unlived-nursery` 接入三位 auctioneer 回桥。
- [x] Remembrance 接入记忆行、39 格图鉴、普通入口与产权庭入口。
- [x] 两项 `node --check`、`git diff --check` 与 `node tests/site.test.mjs` 全绿，最终 `site.test.mjs: 14992 assertions passed`。
- [x] Computer Use 单窗单标签完成 4 flows、3 returns、3 endings、reload、malformed JSON、console 与用户状态恢复验收；桌面 915×774 和手机 390×844 无横向溢出。
- [x] 归档 `design-qa-evidence/v88-browser-qa.json`，恢复用户原 22 个 localStorage 项和 `#remembrance`，清除临时键并关闭 DevTools 与设备模拟。
- [x] 本地闭环，未 commit、push、deploy 或 public release。

### 向后扩充

- [x] v88 未发生事件拍卖行 / AUCTION HOUSE FOR EVENTS THAT NEVER HAPPENED（185 scenes，本地实现与独立 QA 已完成）
- [x] v89 既成事实拆迁局 / EVICTION AUTHORITY FOR ACCOMPLISHED FACTS（189 scenes，本地实现与独立 QA 已完成）
- [x] v90 无因后果难民署 / REFUGEE AUTHORITY FOR CONSEQUENCES WITHOUT CAUSES（193 scenes，生产实现与静态门禁完成）

### 当前版本边界

1. 当前已实现基线为 v90（193 scenes）。
2. Gemini 3.7 Flash High 负责编写生产前端、测试、修复与实现文档；Codex 负责设计、资产、机械集成、诊断与独立 QA。
3. v89 与 v90 均已接入生产源码；v91 仅保留叙事活口，尚未设计或实现。
4. 当前任务负责整理、验证、提交与推送这批本地成果；部署仍由 Cloudflare Pages 后续状态决定。

### v89 既成事实拆迁局任务清单 (2026-08-30)
- [x] 设计 v89 既成事实拆迁局矩阵与 4 处新场景
- [x] 生成 4 张 WebP 配套插画资源
- [x] 实现 `goddead_v89_accomplished_fact_eviction` 状态与 36 道腾退令逻辑
- [x] 接入 `birth-ballot-booth`、`crime-scene-without-offender`、`undeclared-war-room` 历史勘测员/法警
- [x] 实现 3 处上诉判决与纪念碑典籍归档
- [x] 配置 18 处受信任点击事件与 `event.isTrusted` 守卫
- [x] 静态语法检查与单元测试通过（15657 assertions passed）
- [x] 单 Chrome 窗口可见浏览器真机验收与移动端适配验证
- [x] 验证 localStorage 22 项基线数据安全还原
- [x] 纳入当前整理与提交范围

### v90 无因后果难民署任务清单 (2026-08-31)

- [x] 冻结 v90 故事、交互、路由、状态与视觉合同
- [x] 生成并接入 4 张源 PNG 与 4 张运行时 WebP
- [x] 实现 4 个新场景、36 份庇护案、3 项终审裁定与 39 格图鉴
- [x] 接入 `threshold`、`remembrance`、`unending-gallery` 三处领事窄桥
- [x] 配置 11 字段状态、7 类 strict pending 与 18 个受信任点击监听
- [x] 修复全页初始化同步顺序并加入回归断言
- [x] 全量静态门禁通过（`site.test.mjs: 16343 assertions passed`）
- [x] 浏览器确认初始化、未解锁深链回退、刷新与控制台
- [x] 完成 `docs/GameplayFlow.md` 当前游玩流程图
- [ ] v91 倒生原因助产院：仅保留叙事活口，尚未进入设计
