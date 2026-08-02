# Design QA — Living Shrine · 场景探索版（含值夜室 · 第四线路 · 无主投递所 · 神名注销科 · 代神席 · 自动转场 · 现有场景视觉深化 · 焚献点火 · 神圣遗物科 · v28 代行治理 · v29 旁路支线 · v30 深层支线 · v31 门前三岔 · v32 门内副楼 · v33 异常复核 · v34 无主估值 · v35 无号层 · v36 夜班登记 · v37 午夜回拨 · v38 门外代审 · v39 归路核验 · v40 门外侧廊 · v41 守则背室 · v42 守则漂移 · v43 门内回敲 · v44 页后空层 · v45 未到交班 · v46 旁线未静 · v47 退件未止 · v48 注销留副 · v49 门前实感 · v50 副楼实感 · v51 副楼三债 · v52 三债结算 · v53 归路信念 · v54 迫近回访 · v55 失常交班 · v56 症状交接 · v57 判词后果 · v58 异议总署 · v59 交叉听证 · v60 证物链 · v61 故障重演 · v62 反听总台）

适用范围：当前 goddead.com 首页（哈希路由场景探索游戏）。本文替代旧版 QA 报告；旧版证据文件保留在 `design-qa-evidence/` 中仅作历史存档，不再代表现状。

## 本轮新增：v62 反听总台 / THE SIGNAL LISTENS BACK（v46 三旁线房反听态 + 反听总台 + 提前接地）

- 目标：不往交换台主线堆楼层，深化 v46 三间旁线房——三房 visited 全真且合法 marks ≥ 3 后，三个旧房基础态各出现第四个图内入口（铜喇叭阵列/墙面自绕线路/后墙信号灯排），汇入全新的反听总台；三线路板把旧房切成 v62 反听图，九条 response 每房每轮一条，27 组合枚举九类完整结算 + 三种提前接地。
- 素材：四张冻结原图（sha256 静态断言锁定，见 `docs/V62ListeningBackDesign.md`）Pillow q85 1536×1024 无裁切转码四张 WebP（140–217 KB）；三反听图入 JS 互换表、总台图入 HTML；三张 v46 旧基础 WebP 引用不变，同尺寸切图不改布局高度。
- 旧边界：九个 v46 动作 id/文案/反馈/目标/mark/状态语义与 `goddead_v46_sidetones` 内容逐字节保持（CDP 字节级比对）；v62 只读 `getSidetone()` 判解锁，入口与旧三动作共享 `sidetone-{room}` 第一归宿锁。
- 反听态：线路板写 replayRoom + board pending，一拍回旧房换反听图、隐藏/禁用旧三动作与入口、揭示三 response 与图内「松线返回」（不写 history）；response 写 history + response pending、全房热点即锁、一拍回总台，到达 before 原子清 replayRoom/pending。
- 总台：三板展示本轮短语或空槽文案（aria-pressed 同步、已选 disabled），四项读数（接收/回授/静默/暴露）+ 已接听 N/3 全派生永不落盘；接地刀 0–1 hidden+disabled、2/3「提前接地」（缺房逐字反馈吐回旧房基础态，cutRuns+1/lastOutcome=early-*/cycle+1，不增 completedRuns/outcomeCounts）、3/3「让总台接听」（纯函数九分支路由，27 组合枚举冻结 1/4/1/6/2/3/5/2/3，低暴露不写不可达 receive 分支）；结算到达 before 才原子结算开新轮，ledger 目标只走 grantLedgerVisit，证物链沿用 v60 开放契约；无底部继续卡、无确认按钮。
- 状态：`goddead_v62_listening_back`（唯一 key，version 62）；canonical 十键投影；history 精确 {cycle,room,action} 三键、同 cycle 每房第一条、去伪去重裁 ≤16；pending 六类精确键集（entry/board/return 六键、response 七键、settle/cutoff 五键，额外键即伪造）逐字重算 + 严格证据 + cycle，pendingTarget 只由合法 pending 派生，只消费一次；重播按原作用域重挂、重锁热点并恢复 aria-pressed。
- 守卫/目录/记忆/遗忘：console 直达窄守卫（合法 pendingTarget/真实到访/活动轮次），回退第一个合法 v46 房（booth→jack→morgue→switchboard）并继续级联，位于 v29 守卫之前；目录 `02μ½ / 反听总台`（02 系列 24 希腊字母全占用、02δ½ 归 v61，取紧邻半阶）仅真实到访后出现；Remembrance 单行「反听总台：完成 X 轮，提前接地 Y 次；本轮接收 R / 回授 F / 静默 S / 暴露 E，已接听 N/3。」仍八卡；遗忘全部 DOM 回弹。
- 静态：4804 断言全绿（较 v61 的 4511 新增 293 条同口径实测：v62 独立区块 + 全局集成；既有 isTrusted 总数 15→34、缓存 v=54→v=55 同步）。
- CDP 行为冒烟（`/tmp/v62-qa/v62-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**431/431 全绿**，控制台零异常：三旧房基础/三反听态/总台 × 1440×1024 / 1440×800 / 390×844 / 360×800 几何（图内/零重叠/自命中/≥44px/无横向溢出，v46 旧热点对为冻结出厂坐标不重复计数）、未解锁入口 hidden+disabled、19 组热点合成点击零副作用、入口→总台→板→反听→response 全流程逐字反馈、键盘 Enter 选板、2/3 提前接地吐回缺房并恢复基础态、3/3 全静默组合结算进空名衣柜并开新轮读数归零、松线返回不写 history、response 拍内 reload 逐字重播不双结算、同拍三击只记第一项、直接 hash 窄守卫四态（booth/jack/morgue/干净存储）与活动轮次准入、错 version 与伪造 settle/计数归一、v46 key 全流程字节级零写。
- 视觉证据 16 张 `design-qa-evidence/v62/`：v62-01~03 三旧房基础态（解锁入口可见）桌面、v62-04~06 三反听态桌面、v62-07 总台空轮（接地刀 hidden）、v62-08 总台 2/3 提前接地显露、v62-09 总台 3/3 让总台接听（短桌面）、v62-10/14 总台移动 390×844 与 360×800、v62-11~13 三反听态移动、v62-15 入口反馈拍、v62-16 response 反馈拍——逐张目检：四张新图与源图同构图同比例无拉伸无黑边；三线路板压中总台左/中/右三块面板、接地刀压中前景刀闸；反听态热点分别压中听筒/话筒/操作椅/喇叭阵列、暗红孔/游线插头/空白线签/自绕线路、回铃灯/退单托盘/黑蜡铃碗/信号灯排；基础入口压中喇叭阵列/自绕线路/信号灯排且不遮旧三动作；短签标签不遮主体物件，移动无裁切无互盖。

## 本轮新增：v61 故障重演 / THE FAILURE RECONSTRUCTION（v30 三深房图内化 + 三房重演证据 + 故障重演台）

- 目标：不往 v60 尾部堆楼层，深化最早最薄的 v30 三间深层分支——失真转接室/逆流泵房/无名罪籍库基础态图内化（旧 9 动作逐字节保持），各自新增图内重演入口换 v61 重演图，九条图内证据汇入全新的故障重演台，27 组合枚举七类分流。
- 素材：四张冻结原图（sha256 静态断言锁定，见 `docs/V61FailureReconstructionDesign.md`）Pillow q85 1536×1024 无裁切转码四张 WebP（194–270 KB）；三重演图入 JS 互换表、重演台图入 HTML；三张旧基础 WebP 引用不变。
- 图内化：三旧房 9 个旧动作 id/文案/反馈/目标/v29/v30 副作用/lastChoice/首选锁/守卫逐字保持，按钮移入原基础图实物上；三张 `.branch-choices` 卡片容器整体删除无隐藏副本；入口热点压原图真实物件（红蜡封签区/红灯区/罪籍抽屉组）。
- 重演态：入口只换图与揭示热点、不写 selection；九证据逐字标签/分值/句段/反馈，selection 原子替换（同条重选派生不变），一拍自动回台，到达原子记 desk visit/清 replayRoom/清 pending；图内退回热点不改 selection。
- 重演台：三证词板始终可点（空槽标签/重选标签/aria-pressed 逐字），总栓仅三房齐备且无 pending 时显露；说明句三句段逐字 + 签条派生四项；总栓不加分直接路由七分支（全等按 v60 开放契约去证物链办公室）；到达 before 才原子结算开新轮并补最窄旧守卫凭证（grantLedgerVisit/markReviewVisited）。
- 状态：`goddead_v61_failure_reconstruction`（唯一 key，version 61）；canonical 九键投影；派生永不落盘；pending 四类精确键集（board 六键/clue 七键/return 六键/settle 五键，额外键即伪造）逐字重算 + 严格证据（replayRoom/selections/齐备）+ cycle，只消费一次；重播重锁热点并恢复 aria-pressed。
- 生产修复（本轮 CDP 抓出）：desk 窄守卫初版插在 v29 支线守卫之后，回退目标（v30 深房/echo）不再流经旧守卫，伪造直达可停在未解锁的 echo——已前移到 v30/v29 守卫之前，回退目标继续向下级联，并补守卫顺序静态断言。
- 守卫/目录/记忆/遗忘：desk 直达窄守卫（合法 pendingTarget/desk visit/活动轮次），回退级联不放宽旧守卫；目录 `02δ½ / 故障重演`（规格原拟 02δ，与 v43「02δ / 未应门」冲突，取紧邻半阶）；Remembrance 单行「故障重演：完成 N 轮；印证 A、失真 B、归责 C、拉平 D，本轮已取证 M/3。」仍八卡；遗忘全部 DOM 回弹（三房图面/入口/证据/退回/旧动作/desk 四热点/说明句/disabled/aria/响应）。
- 静态：4511 断言全绿（较 v60 的 4269 新增 242 条同口径实测：v61 独立区块 236 条 + 全局集成 6 条）。
- CDP 行为冒烟（`/tmp/v61-qa/v61-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**1047/1047 连续两轮全绿**（第二轮完整日志 `/tmp/v61-qa/round2-full.log`），控制台零异常，失败路径回收 Chrome、复跑零残留：七状态（三基础+三重演+desk）× 1440×1024/1440×800/390×844 几何（3:2 图幅/图内/零重叠/自命中/≥44px/短标签不溢出/首屏/签条）、旧 9 动作目标/反馈/v30 副作用逐字节且 v61 键从不创建、三入口换图与揭示、九证据逐字+派生分值+aria+全锁+一拍回台+pending 一次性、自由顺序/退回不删/替换立即重算、七分支代表组合全路由+原子结算+旧守卫凭证、四类 pending reload 重播一次（重锁+aria 恢复）+ 实时竞态不二次、伪造七态+坏 JSON 四态+错版本+9999 封顶、canonical 九键、desk 直达守卫三态、双击/合成惰性/Tab/Enter 键盘全流、目录/记忆/遗忘 DOM 回弹、v29/v30 字节级零污染。
- 视觉证据 17 张 `design-qa-evidence/v61/`：v61-01~03 三旧房基础态桌面、v61-04~06 三重演态桌面、v61-07 desk 部分取证（总栓 hidden）、v61-08 desk 齐备总栓显露、v61-10~12 三重演态移动、v61-13 desk 移动、v61-14 desk 短桌面，及四张源图/实装并排对照 `v61-compare-{echo-recon,pump-recon,ledger-recon,desk}.png`（离线 Pillow 合成 3072×1024）逐张目检——实装与源图同构图同比例无拉伸无黑边：转接室声筒/拨叉/铃牌/返回孔、泵房倒行表/沉积槽/封签梯/返回门、罪籍库复写章/擦名刀/拒收屉/返回门、重演台三证词板/总栓全部压中实物；热点为既有 forecourt-native 半透明面板风格，移动短标签无裁切无互盖。

## 本轮新增：v60 证物链 / THE CHAIN OF CUSTODY（两结果房图内化 + 截留汇流 + 证物链办公室）

- 目标：把最后两个「图在上、四卡在下」的旧结果房（v33 异常保全库/误报回收井，含 v34 估值入口）升级为画面内交互；累计证物动作跨两房达到 3 个不同动作时，第一个使条件成立的点击把目的地截留进全新的证物链办公室。
- 素材：三张冻结原图（sha256 静态断言锁定，见 `docs/V60ChainOfCustodyDesign.md`）Pillow q85 1536×1024 无裁切转码三张 WebP（266–273 KB）；保全库/回收井图替换引用，旧 WebP 保留零引用；全部正式 bitmap + 图内原生热点，无卡片/inline SVG/底部继续按钮。
- 图内化：8 个旧按钮 id、文案、aria-pressed、v33 marks/restart、v34 startValuation/marks 全部原样保留并移入图内实物；底部 `.branch-choices` 卡片容器整体删除，无隐藏副本。
- 截留：窄钩子在旧副作用之后、AutoAdvance 武装之前；原反馈逐字 + 追加「证物链扣住了原去向。办公室的门在这时打开。」；每轮每动作只计首次、重复动作旧目的地逐字保持、每轮最多截留一次；源 pending 四键逐字重算、只消费一次，离开后重返逐字重播。
- 办公室：开放场景（直 hash 可用三常规机关）；封钳/滚筒/钥环先入账 +2 再按点击后分值纯函数分流（七分支逐字冻结，全等含动作补齐退责任账房并补旧守卫凭证）；空白见证位只在点击前完全拉平且为正时显露，不计分直达无号层；离开办公室 officeRuns/transfers 各 +1、开新轮、累计分值保留。
- 生产修复（本轮 CDP 抓出）：办公室分流函数 `post[bank] += 2` 未封顶——分值 9999 时反馈算出 10001，与落盘分值（ capped 9999）不一致；修复为 `Math.min(CUSTODY_NUM_CAP, … + 2)`，静态冻结断言同步更新。
- 守卫与遗忘：办公室不设 resolveScene 守卫（同 protocol-drift 开放设计）；liability-ledger 落点补 `grantLedgerVisit`；遗忘全部后 v60 key 移除、目录/记忆隐藏、12 热点 disabled/aria 回弹、void 回隐；目录 `01ωε / 证物链`；Remembrance 单行「证物链：交接 T 次，办公室结算 R 次；保全 C，改写 V，认领 K，本轮已登记 N/8。」仍八张统计卡。
- 状态恢复修复（独立验收抓出）：`replayCustodyPending` 原先只恢复反馈与定时器——sceneInit 的 enter* 先解锁按钮清 aria，合法 pending 在场时按钮视觉可用但点击被 pending/AutoAdvance 拦截；修复为源/办公室重播均重新 `custodyLockButtons`，办公室另恢复被选机关 `aria-pressed="true"`，消费/到达仍各只一次。
- 静态：4269 断言全绿（较 v59 的 4112 新增 157 条同口径实测：v60 独立区块 154 条 + 全局集成 3 条）。
- CDP 行为冒烟（`/tmp/v60-qa/v60-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**526/526 连续两轮全绿**（第二轮完整日志 `/tmp/v60-qa/round2-full.log`），控制台零异常，失败路径回收 Chrome、复跑后零残留进程：三场景 × 1440×1024/1440×800/390×844 几何（3:2 图幅/图内/零重叠/自命中/≥44px/短标签不溢出/1440×800 首屏/签条项数）、8 源动作未解锁时旧目标/旧反馈/旧 marks 逐字保持且 v60 只计首次、重复动作不刷分、单房三动作不解锁、跨两房第三动作准确截留（pending 逐字 + 一拍转场 + 目录原子恢复）、2/2/2 稀有路径空白见证位直达无号层不计分、办公室七分支分流逐字 + 直 hash 0/0/0 可用且 void 必隐、源/办公室 pending reload 各重播一次（重播期间全热点 disabled、办公室被选机关 aria-pressed 恢复）+ 实时竞态不二次结算、伪造七态（错反馈/额外键/错 target/未登记/解锁不成立/伪造 void/办公室错 target）全拒收、坏 JSON 四态归一、9999 封顶、canonical 八键、双击/键盘竞争一次、inactive 场景合成点击惰性、Tab/Enter/Space 全流、记忆单行/目录/遗忘 DOM 回弹、v33/v34 字节级边界。
- 视觉证据 12 张 `design-qa-evidence/v60/`：v60-01~03 三场景桌面、v60-04 空白见证位显露态、v60-05~07 三场景移动端、v60-08 办公室 1440×800、v60-09 截留节拍；三张对照图（`v60-compare-{vault,shaft,office}.png`）由冻结源 PNG 与同状态 1440×1024 实装截图的 figure 裁切等比例并排（离线 Pillow 合成，3072×1024）逐张目检——实装图与源图同构图同比例无拉伸无黑边；保全库封存压左悬吊骨瓷匣、退回压中后退件抽屉、断口压右侧锁链缺口、估值压前景黄铜托盘；回收井捡回压左退件抽屉与纸卷、附录压中左滚轴、承认压前景脚位铁板、申报压右资产托盘与印章；办公室封钳/滚筒/钥环分压左侧封钳/中央滚筒/右认领环、空白见证位压前景地面铭牌；热点全部为既有 forecourt-native 半透明面板风格，移动端短标签无裁切无互盖。

## 本轮新增：v59 交叉听证 / THE CROSS-EXAMINATION（三房深查 + 结案延迟拦截 + 交叉听证台）

- 目标：已结清的 v58 复核室可以「深查」——同场景换 v59 深查图、原三动作隐藏、两个深查热点显露；深查 ≥2 间后结案印被延迟拦截，原裁定扣到交叉听证台接受二次质询，四动作路由后入账 +2，无字席只在三房全深查且完全拉平时显露。
- 素材：四张冻结原图（sha256 静态断言锁定，见 `docs/V59CrossExaminationDesign.md`）Pillow q85 1536×1024 无裁切转码四张 WebP（188–287 KB）；听证台图入 HTML、三深查图入 JS 互换表；全部正式 bitmap + 图内原生热点，无卡片/inline SVG/底部继续按钮。
- 深查：结清后复访才显露图内「听证封签」（结清前/已深查 hidden，合成点击零副作用）；可信封签只换图与揭示热点、不写任何存储；六深查动作逐字反馈与精确分值（合流/胁迫/残响），首次一拍自动回总署，复访示出既往结果不二次计分不转场。
- 拦截：窄钩子在 v58 close history 追加之后、v58 pending 武装之前——原 target/feedback/history 逐字节照旧，v58 pending 保持 null，v59 记 intercept + deferredTarget + intercept pending，逐字拦截反馈一拍后自动到听证台；深查 <2 间 v58 行为不变，已交付后不再拦截。
- 状态：`goddead_v59_cross_examination`（唯一 key）；canonical 六键投影（version 59/cycle/visits/history≤16/pending/deferredTarget）；分值/已深查房间/可否拦截/可否无字席全部由当前 cycle 可信 history 与合法 v58 状态重算，派生不落盘；deferredTarget 严格重算（末条 close + 重算同目标 + 未交付 + 深查 ≥2 + v58 pending null）；pending 三种各按自身精确键集（action 7 / intercept 6 / resolve 7）逐字重算 + history 末项证据，只消费一次，伪造/错版本/坏 JSON 一律归一。
- 生产修复（本轮 CDP 抓出）：resolve pending 的合法重播要求 deferredTarget 成立，而原重算条件 `!resolved` 把「resolve 已入账但 pending 未消费」的交付在途态误判为已交付——修复为候选形状放宽 + 严格七键校验不过时统一收回（`resolved && !pending` 丢弃），交付仍只发生一次；静态冻结断言同步更新。
- 守卫：听证台直达窄守卫（合法 pendingTarget 或 desk visit，否则回退合法总署、总署不合法归一无号层）；深查复用 v58 四场景守卫；封签/深查/听证台三组监听只接受 isTrusted 真实 click（全仓库共 10 组）；v31–v58 状态零读写污染（v59 只读，v58 仅经拦截点合法追加 close history）。
- 目录与记忆：目录 `01ωδ / 交叉听证`；Remembrance 单行「交叉听证：合流 X，胁迫 Y，残响 Z，本轮深查 N/3。」仍八张统计卡；遗忘全部后三房图面/aria/封签/深查热点/v58 热点/响应文本/听证台说明/无字席/目录/记忆全部回弹。
- 静态：4112 断言全绿（较 v58 的 3922 新增 190 条同口径实测：v59 独立区块 181 条 + 全局集成/回归 9 条）。
- CDP 行为冒烟（`/tmp/v59-qa/v59-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**625/625 连续两轮全绿**（第二轮完整日志 `/tmp/v59-qa/round2-full.log`），控制台零异常：三深查房 + 听证台 × 1440×1024/1440×800/390×844 几何（3:2 图幅/图内/零重叠/自命中/≥44px/短标签不溢出/1440×800 首屏/签条项数）+ 深查图 src 与 aria-label 逐字互换 + 既往结果复访示出、封签结清前 hidden 且合成零副作用、可信封签换图揭示两深查热点且 v58/v59 存储字节不变不转场、6 深查动作逐字 + 精确分值 + aria-pressed + 首次自动回总署 + 复访不二次计分不转场、0/1 深查结案 v58 逐字节照旧（0 间时 v59 键从不创建）、2 深查严格拦截全链（v58 close 追加 + pending null、intercept/deferredTarget/intercept-pending 三件套、逐字反馈、desk 说明与签条逐字、merge 走 deferredTarget 复效、路由后 +2 入账、到达清 pending+deferredTarget、交付后不再拦截）、无字席 (3,3,3) 显露点击直达无号层不计分 + 非拉平 hidden 惰性、desk 直达守卫两态回退、action/intercept/resolve 三种 pending reload 逐字重播一次不二次计分 + 实时点击后 reload 竞态重播一次、伪造九态（action 错反馈/intercept 额外键/intercept 错 deferredTarget/resolve 错 target/伪造无字席/错 cycle/错 deferredTarget/错版本/坏 JSON 四态）全拒收归一、raw 恰好六 canonical 键 + history 裁 16 + deferredTarget 缺省 null、v57/v54/v37 全流程字节不变（v58 diff 恰好一条 close）、目录/记忆单行/八卡/遗忘全部 DOM 回弹全流程、Tab/Enter/Space 键盘深查流、active 场景合成 HTMLElement.click() 字节级零副作用。
- 视觉证据 15 张 `design-qa-evidence/v59-01~11` + `v59-compare-{identity,evidence,destination,desk}`：前三张三深查房深查态桌面、v59-04 听证台武装态桌面、v59-05~07 三房移动端、v59-08 听证台 1440×800、v59-09 听证台移动端、v59-10 无字席显露态、v59-11 拦截节拍；四张对照图由四张冻结源 PNG 与同状态 1440×1024 实装截图的 figure 裁切等比例并排（离线 Pillow 合成，3072×1024）逐张目检——深查图/听证台图与源图同构图同比例无拉伸无黑边；身份回放来电压左放音鼓与听筒、针写姓名压中央玻璃听证椅；证据对齐秒针压中央三表齿轮仪、揭起血蜡压右玻璃罩血蜡；去向追索缆线压左仪表与绕行缆线、俯听井底压右听音喇叭且避开左拱门回总署；听证台归并/标记/封存分压左链条传送带/中央听证椅/右留声喇叭，无字席出厂 hidden 不遮挡、拉平态显露于前景地面铭牌且与三热点零重叠；实装热点为既有 forecourt-native 半透明面板风格，与 v49–v58 一致，移动端短标签无裁切无互盖。

## 本轮新增：v58 异议总署 / THE APPEAL REGISTRY（总署 hub + 三复核室 9 动作 + 结案纯函数路由）

- 目标：v57 的共证/修复/转嫁/自担与责任值真正改变后续复核——总署说明、三房反馈与结案落点全部由 v57 派生 profile 决定；三路复核自由选择，两间解锁结案但不强制第三间。
- 素材：四张冻结原图（sha256 静态断言锁定，见 `docs/V58AppealRegistryDesign.md`）Pillow q85 1536×1024 无裁切转码四张 WebP（187–247 KB）；全部正式 bitmap + 图内原生热点，无卡片/inline SVG/底部继续按钮。
- 入口：责任账房复访时图内「异议封签」仅在资格派生为真（≥3 不同后果房结算 + ≥1 账房动作结算）时显露；点击只记 v58 entry 节拍、v57 字节不变，一拍后到总署；目录直达走同一窄守卫，安全渲染不伪造资格。
- 状态：`goddead_v58_appeal`（唯一 key）；canonical 投影（version 58/cycle/visits/history≤16/pending）；三类分值、已结算房间、可否结案、profile、最终 target 全部由当前 cycle 可信 history 与合法 v57 状态重算，派生不落盘；version 不符整体丢弃；pending 三类（五键/六键）逐字重算 + history 末项 + cycle + 派生资格四重防伪，只消费一次。
- 玩法：hub 三路纯导航节拍；9 动作逐字反馈与精确分值（异议/先例/污染），首次一拍自动回总署，复访不二次计分不自动转场，画面内回总署热点；锁链账本 <2 房压暗拒绝、≥2 房解锁不强制；结案纯函数路由（2/2/2 特殊仅三房全完成→无号层，严格最高按 liability 符号/最近后果房分流，三种并列与兜底逐字冻结），反馈说清占上风类别与送达理由。
- 历史回响：dominantResponsibility 平局固定顺序 selfBurden>transfer>repair>concordance（文档化）；总署说明、erase-subject（dominant 五段）、preserve-conflict（lastRoom 五段）、assign-vacancy（liability 符号两段带责任值）逐字变化。
- 守卫：四场景窄守卫（合法 pendingTarget 或历史 visit，否则回无号层），before 原子记 visit 再清 pending；入口/导航/结案/动作/回总署 5 组监听只接受 isTrusted 真实 click（全仓库连 v57 共 7 组）；v31–v57 状态零读写污染。
- 目录：01ω½ / 异议总署、01ωα / 身份勘误、01ωβ / 证据对照、01ωγ / 去向复核；Remembrance 单行，仍八张统计卡；遗忘全部回弹封签/目录/记忆/守卫。
- 静态：3922 断言全绿（v58 块新增 167 条同口径实测）。
- CDP 行为冒烟（`/tmp/v58-qa/v58-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**650/650 连续两轮全绿**，控制台零异常：四场景 × 1440×1024/1440×800/390×844 几何（图内/零重叠/自命中/≥44px/短标签不溢出/1440×800 首屏）+ 封签与既有三热点两视口零重叠、入口资格三态（2 房无封签/3 房无账房动作无封签/齐备可见）+ 合成与隐藏点击零副作用 + 直达守卫回弹、entry 节拍 v57 字节不变 + 一拍转场 + profile 说明逐字、9 动作逐字反馈 + 精确派生分值 + aria-pressed + 首次自动回总署、1 房拒绝文案不转场不写 history、2 房解锁不强制可续第三间、复访不二次计分不自动转场 + 回总署热点、2 房并列去账房而 2/2/2 仅三房全完成去无号层、结案路由九分支（liability 正负 × lastRoom 四态 × 三种并列）逐字反馈 + 落点 + pending 消费、entry/action/close 三种 pending reload 逐字重播一次不二次计分 + 实时点击后 reload 竞态重播一次、伪造六态（错反馈/额外键/错 cycle/无证据/错 action/跨字段 target）+ 错版本 + 无资格 entry pending 全丢弃、坏存档五态归一不崩 + raw 恰好五 canonical 键 + history 裁 16、v57/v54/v37 全流程字节不变、目录×4/记忆单行/八卡/遗忘 DOM 全流程（key/目录/记忆/封签/守卫回弹）、四种 v57 profile 说明与三房动态文案逐字且两两不同、Tab/Enter/Space 全流程、active 场景合成 HTMLElement.click() 字节级零副作用后真实 page.click 正常结算。
- 视觉证据 9 张 `design-qa-evidence/v58-01~09`（总署 hub、三房、账房封签、可开印态、2/2/2 结案节拍、移动端总署与身份勘误）；截图等待标题/说明/分数条/热点标签/bitmap 稳定后拍摄，热点全部压中物件、移动端短标签无裁切无互盖、标题与异议签无溢出。

## 本轮新增：v57 判词后果层 / THE VERDICT NEEDS A BODY（四后果场景 12 动作 + 责任账房）

- 目标：v56 四类判定结果长出责任分支而非不同文案回旧房间；v56 深查/预算/报告/编组计分语义全部保留，只在原目的地前插后果场景。
- 素材：四张 v56 候选图改名升格（字节不变，sha256 静态断言锁定）+ 新责任账房图，Pillow q85 1536×1024 转码五张 WebP；全部正式 bitmap + 图内原生热点。
- 改道：交班 falseReport→无辜留置、missed→漏报移交；编组 press 按派生判定分流（trusted→共证剧场、blind→错绑交班，否则证物库兜底）、burn→无辜留置、selfseal→错绑交班；判定纯派生不落盘，v56 分值逐项不回归。
- 状态：`goddead_v57_consequence_ledger`（唯一 key）；canonical 投影（cycle/scores/visits/settled/actions/deferredTarget/pending/history≤16）；liability 与 pendingTarget 派生重算；pending 恰好六键 + 结算证据 + history 末项 + 账房阈值证明 + 改道证明四重防伪——账房点击前责任值由结算时记入 history 末项的 `pre` 证明并与落盘分值交叉核对（post−pre 落固定增量区间，短差须受影响分值触顶 9999 解释），不做固定增量反推（饱和时会误杀合法 pending）；cycle 对齐 v35 只重置 settled。
- 玩法：12 后果动作逐字反馈与精确分值（共证/修复/转嫁/自担）与目的地，每场景每 cycle 防刷、导航常开、签明示已结清；第三不同后果场景首次结算暂存 deferredTarget 改道责任账房（每存档一次）；账房三动作按点击前 liability 分流并逐字报责任值。
- 守卫：五场景窄守卫（合法 pendingTarget 或历史 visit，否则回无号层），before 先原子记 visit 再清 pending；15 动作监听只接受 isTrusted 真实 click——合成 HTMLElement.click() 在 active 场景同样零副作用（off-scene/hidden/rapid 由 live-scene + first-lock 守卫），鼠标/触控/Tab+Enter/Space 与 page.click 不受影响；v33/v55 守卫文本未改。监理修正：漏报移交井用全仓库唯一 `omission-response`/`omission-link`；全页 duplicate-id 扫描抓出并修复 v43 遗留重复 id `vestibule-response`（反馈一直写入隐藏的 v32 元素）。
- 目录：01σ½ / 共证剧场、01υ½ / 无辜留置、01φ½ / 漏报移交、01χ½ / 错绑交班、01ψ½ / 责任账房；Remembrance 单行，仍八张统计卡。
- CDP 行为冒烟（`/tmp/v57-qa/v57-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**494/494 连续两轮全绿**：五场景 × 1440×1024/1440×800/390×844 几何（图内/零重叠/自命中/≥44px/责任签不溢出/1440×800 首屏）、v56 六条插入路径+兜底、12 后果动作逐字+分值+目的地+防刷+新 cycle、第三场景改道+deferredTarget、账房阈值两侧+deferred 返回清空、账房三动作 9999 饱和后合法 pending 接受+reload 逐字重播一次+分值封顶不二次计分、三类跨字段伪造账房 pending（stale pre/短差无触顶解释/缺 pre）丢弃、窄守卫四态、reload 重播一次+伪造 pending 三态丢弃、坏存档六种归一+raw canonical+history 16、v54/v37 零污染+v56 不回归、目录/记忆/八卡/遗忘 DOM、active 共证剧场合成 HTMLElement.click() 字节级零副作用（存储/反馈/场景/aria-pressed 不变）后真实 page.click 正常结算、Tab/Enter/Space、console 零异常。
- 视觉证据 9 张 `design-qa-evidence/v57-01~09`（五场景桌面、账房 1440×800、移动两幅、改道落点）；五张冻结源 PNG 与同状态同视口渲染同轮并排目验——热点全部压中物件、移动端短标签无裁切无互盖、标题与责任签无溢出。

## 本轮新增：v56 症状交接 / THE EVIDENCE AUDITS THE WITNESS（核验封条深查 + 症状交班台 + 证据编组室）

- 目标：只深化 v55 三房巡检态——封条深查揭示真值、可信度决定下轮预算、第三报告有意改道交班台、编组室三动作影响后续轮次。
- 素材：八张冻结源 PNG（1536×1024，sha256 见 `docs/V56EvidenceAuditDesign.md` 并由静态断言逐字节校验）Pillow q85 无裁切转码；六张深查图预载；三值班房主图去 `loading="lazy"` 杜绝换图解码空白。
- 状态：`goddead_v56_evidence_audit`（唯一 key）；白名单 canonical 落盘（history≤16）；credibility 与 pendingTarget 派生重算；assignment 不持久化，真值从 v55 读取；cycle 对齐 v35；pending 三种严格形状 + 结算证据 + history 末项 + cycle 防伪。
- 玩法：预算 1/2/3 枚（credibility 阈值 -2/4）创建即冻结；深查 −1 枚原地切真值图、报告热点仍可立即选择；报告按深查与否记 proofs/blindCorrect/contradictions；第三报告且深查 >= 2 暂存 deferredTarget 改道交班台（每轮一次）；交班四结果、编组三动作每 cycle 防刷。
- 守卫：两新场景窄守卫（合法 pendingTarget 或历史 visit，否则回无号层），before 先记 visit 再清 pending；v33 守卫文本未改。
- 目录：01π½ / 症状交班、01ρ½ / 证据编组；Remembrance 单行，仍八张统计卡。
- CDP 行为冒烟（`/tmp/v56-qa/v56-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**491/491 连续两轮全绿**：三视口几何（图内/零重叠/自命中/≥44px/14 项签不溢出/1440×800 首屏）、预算三档与冻结、六张深查图与真值、消耗幂等、四种报告计分 + v55 回归、第三报告触发与两种不触发、交班四结果、编组三动作防刷、窄守卫四态、reload 重播一次、坏存档六种归一 + raw canonical + history 16、v37/v54 零污染、键盘、console 零异常。一轮 lazy 解码竞态黑图缺陷已修复并回归；复审修复的「遗忘全部」漏调 `paintEvidenceAuditMemory()` 残留也已补接线并以 DOM 级遗忘流程实测覆盖。
- 视觉证据 12 张 `design-qa-evidence/v56-01~14`（巡检核验态、六张深查图、两新场景、移动两幅、编组落点）；八张冻结源 PNG 与同状态同视口渲染同轮并排目验——热点全部压中物件、移动端短标签无裁切无互盖、标题与 14 项签无溢出。

## 本轮新增：v55 失常交班 / THE FLOOR REPORTS BACK（v35 三房图内化 + 巡检循环 + 三个异常后室）

- 目标：不新增走廊，把 v35 三值班房升级为「值班 → 巡检 → 异常后室」循环；12 个既有按钮（3 v35 动作 + 1 v37 回拨 × 三房）全部图内化且语义不变。
- 素材：六张冻结源 PNG（1536×1024，sha256 见 `docs/V55FloorAnomalyDesign.md` 并由静态断言逐字节校验）Pillow q85 无裁切转码；平静/异常构图对齐共用热点坐标，异常图预载。
- 状态：`goddead_v55_floor_anomaly`（唯一 key）；白名单 canonical 落盘（history≤16）；contamination/pendingTarget 派生重算；cycle 对齐 v35 自动重置轮内字段；assignment 六模式（≥1 异常 ≥1 正常）确定性轮换 `idx=(cycle+follow+2·contain+3·submit)%6`，reload 稳定、创建不漂移、无 Math.random；pending 严格五键 + 结算证据 + history 末项 + cycle 四重防伪。
- 巡检：值班完成后重进才进巡检态；两报告热点四种结果（发现异常 verified+2/signal+1→后室、正确正常 verified+1/signal+1→大厅、误报 debt+1→大厅、漏报 debt+2→后室），v35 cap 安全扩到 15/14；三房签八项读数。
- 后室：九动作逐字反馈与既有目标，倾向 follow/contain/submit 计数影响下一轮分配；每房每 cycle 只结算首次（防环路刷分），签上明示已结算，新 cycle 重开；direct hash 窄守卫（合法 pendingTarget 或历史到访，否则回无号层）。
- 目录：01ν½ / 床下回铃、01ξ½ / 反签排水、01ο½ / 负照更衣；Remembrance 单行，仍八张统计卡。
- CDP 行为冒烟（`/tmp/v55-qa/v55-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**925/925 连续两轮全绿**：六场景 × 1440×1024/1440×800/390×844 几何（图内/零重叠/自命中/≥44px/八项签不溢出/1440×800 首屏）、12 旧动作原语义+同拍幂等、分配公式/约束/reload 稳定/不漂移/倾向影响、四种报告结果逐字+落点+计分+v37/v54 零污染、九动作+防刷+新 cycle、窄守卫四态、reload 重播一次、坏存档七种归一+raw canonical+history 16、合成/off-scene 零副作用、Tab/Enter/Space、console 零异常。一轮真实守卫竞争缺陷（before 先清 pending 致 guard 读不到）已修复并回归。
- 视觉证据 14 张 `design-qa-evidence/v55-01~14`（三房值班/巡检异常、三后室、1440×800 巡检、移动三幅、报告反馈中间态）；六张冻结源 PNG 与同状态同视口渲染同轮并排目验——热点全部压中物件、移动端短标签无裁切无互盖、标题与八项签无溢出。

## 本轮新增：v54 迫近回访 / THE ROOMS MOVE WHEN UNSEEN（v29 三房图内化 + 共同迫近账 + 第四热点九分流）

- 目标：不新增走廊，把早期 #echo/#vein/#confession 三房变成图内可触摸、共同记账、会异动的循环；v29 全部旧 id/文字/反馈/目标/lastChoice 语义与 v30 深层路线完全保留。
- 素材：三张冻结源 PNG（1536×1024，sha256 见 `docs/V54ReturnPressureDesign.md`）Pillow q85 原尺寸转码 `assets/v54-{echo,vein,confession}-approach.webp`；平静态继续用 v29 原图，预载切换无闪烁。
- 画面：九项旧选择移入图内原生热点（听井/手轮·拉杆/秤盘），旧卡容器删除；三房各一块紧凑四项统计签（回声累计/脉压/名重/迫近 x/6）；短桌面 figure 收窄、移动端短标签，三视口不溢出。
- 状态：`goddead_v54_return_pressure`（唯一 key）；scores/choices/breaches/pending/history 五个 canonical 字段落盘（history≤16）；total/approach 派生只重算；`chooseBranch` 共享守卫（live-scene + first-lock）后挂 v54 计分，九旧选择语义不变；pending 严格四键白名单 +「确实刚消费过」跨字段证据（breachTotal>=1 且该房 breaches>=1、六点曾完整、history 末项同 room/choice breach），全白名单但从未消费的伪 pending 同样归一。
- 阈值与分流：approach>=3 三房同步切异动图；>=6 且合法 lastChoice 出第四热点（断线听筒/过压表/迫近抽屉），按该房 lastChoice 逐字反馈后去九个既有目标（均无守卫，路由契约未动）；消费后 approach 下降、房间回平静，可累计第二轮。
- 目录：01δ½ / 迫近回访；Remembrance 单行，仍八张统计卡。
- CDP 行为冒烟（`/tmp/v54-qa/v54-smoke.mjs`，真实 Google Chrome headless + 真实鼠标/键盘，种子预注入）**744/744 连续两轮全绿**：三房 × 1440×1024/1440×800/390×844 × 平静/迫近几何（图内/零重叠/自命中/≥44px/统计签不溢出/1440×800 首屏）、九旧选择原反馈原目标+同拍幂等、合成/离场/连点零副作用、阈值 3 同步异动、阈值 6 双条件显隐、九分流逐字+落点+消费归零+第二轮、reload 重播一次、坏 JSON/数组/负数/浮点/超大/未知键归一、伪造 pending 四态丢弃（错反馈/breaches 超支/全白名单但从未消费/含额外键）+ 合法 pending 刷新精确重播、17 事件后 raw 五键+history 16、v29/v30 字节级零污染、v29 守卫不回归、Tab/Enter/Space、console 零异常。
- 视觉证据 12 张 `design-qa-evidence/v54-01~12`（三房平静/迫近桌面、1440×800 两幅、移动三幅、第四热点反馈中间态）；三张冻结源 PNG 与同状态同视口渲染同轮并排目验——热点全部压中物件、移动端短标签无裁切无互盖、标题/统计无溢出。

## 本轮新增：v53 归路信念污染 / THE ROOMS BELIEVE YOU（v39 三路线三态变异 + 阈值机关七分支 + 矛盾翻转牌）

- 目标：深化 v39 归路核验站而非追加走廊——跨轮选择沉淀「守则信任/感官诱信/自相矛盾」，路线按信任变异并长出通向既有分支的机关；v39 两路线/自动结算/五 outcome/first-lock/pending/reload/守卫语义完全不变，v53 只观察已被 v39 接受的选择。
- 素材：六张监理冻结源 PNG（1536×1024，sha256 见 `docs/V53RouteBeliefDesign.md`，禁止重生成）Pillow q85 原尺寸转码 `assets/v53-{echo,vein,confession}-{official,sensory}-belief.webp`；中性态继续用 v39 原图，变异图预载，切换无闪错。
- 画面：四场景 figure 升级 3:2 tactile 舞台；三路线卡+六判断卡删除，改图内原生 button 热点（id/逐字文案/v39 节拍不变）；枢纽统计签 4+3 项（守则信任/感官诱信/自相矛盾），1440×1024、1440×800、390×844 不溢出；1440×800 枢纽 figure 保持可见可点；无底部继续按钮。
- 状态：`goddead_v53_route_belief`（唯一 key）；routes 三路 official/sensory/lastChoice、contradiction、七分支 visits/actions、严格 pending、history≤16；派生总分/变异态/pendingTarget 永远重算，伪造总分与伪造 pending 归一；`saveBelief` 只持久化 canonical 五部分（routes/contradiction/branches/pending/history.slice(-16)），派生字段永不落盘；只挂在 v39 judgeAudit 接受点后计分，不读写 v39 与 v28–v52。
- 变异阈值：单路 `>=2 且严格占优` 才变异（平局回中性）；第三热点只在变异态出现于中央机关，点击不算 v39 判断、不污染 order/decisions/settle，逐字反馈一拍后去既有分支：echo 守则→回敲廊、echo 感官→回声档案室、vein 守则→无铃病房、vein 感官→血管维修井、confession 守则→空名寄存、confession 感官→忏悔称量室；首访 visits=1 不重复计数，actions 累计；contradiction>=2 枢纽黄铜台上出现翻转核验牌→`#protocol-drift`（v42 直 hash 本就允许，守卫未动），v39 进度不变。
- 守卫：仅 v29 三场景加窄例外（本轮合法 pending 或历史已访问放行），其余未访问直达仍落走廊；其余四个目标本就无守卫，原有正常入口全部保持。
- 目录：01τ½ / 归路信念一条汇总，任何信念活动原子恢复；Remembrance 新增单行信念汇总，仍八张统计卡。
- CDP 行为冒烟（`/tmp/v53-qa/v53-smoke.mjs`，真实 Google Chrome headless + 内嵌静态服务器 + 真实鼠标/键盘事件，种子经 `addScriptToEvaluateOnNewDocument` 预注入）**916/916 连续两轮全绿**：三视口 × 三路线 × 三态几何（图内/零重叠/自命中/≥44px/七项统计不溢出/1440×800 首屏可点）、三分值计分规则与同拍幂等、平局中性、严格占优、三态变异图与 aria-label 即时切换、阈值六路逐字反馈+精确落点+首访/动作计数+v39 字节级零污染+复点幂等、contradiction 翻转牌进出 protocol-drift 且 v39 不变、v29 守卫干净/合法 pending/历史访问/伪造 pending 四态、合成 click 与 off-scene click 零副作用、reload 节拍重播一次、目录与记忆恢复、v39 五 outcome 回归、Tab/Enter/Space 键盘全程、控制台零异常。存盘收口实测：20 事件（18 阈值 + 2 判断）后 raw JSON 仍只有五个 canonical 键、无派生键、history 精确 16 条，reload 派生统计不回归。QA 自身一轮时序缺陷（场景 visibility 过渡窗口内点击穿透）已定位并加固（waitReady 自命中轮询 + 反馈轮询 + capture 探针），修复后连续全绿。
- 视觉证据 18 张 `design-qa-evidence/v53-01~18`：枢纽中性/翻转牌（1440×1024/1440×800/390×844）、三路线中性+official+sensory 桌面九幅、移动端四幅、阈值逐字反馈中间态、翻转落点 protocol-drift；六张冻结源 PNG 与同状态同视口渲染同轮并排目验——热点全部压在对应物件上、移动端物件无裁切、标题与统计无溢出。

## 本轮新增：v52 副楼三债结算 / ANNEX DEBT SETTLEMENT（容量合签 + 结算所三印 + 三间结果房）

- 目标：v51 三种债值成为可重复使用的结算容量——每类本轮容量 = `floor(v51 debt / 3)`（0..3，只读 v51），总容量 >= 3 解锁；结算所每轮投 3 枚债印，严格多数分流到三间结果房，1/1/1 稀有 balanced 落现有 `#protocol-drift`；不接单向长走廊，把三副楼与既有分支网连成可重玩分流器。
- 素材：四张监理冻结源 PNG（1536×1024，哈希不变，禁止重生成）Pillow q85 无裁切转码 `assets/annex-debt-clearinghouse.webp`（281 KB）、`unreturned-witness-gallery.webp`（253 KB）、`registry-before-zero.webp`（295 KB）、`descending-appeals-stair.webp`（210 KB）；全部 figure 复用 v49 固定 3:2 舞台与原生物件热点样式，无图下卡片墙。
- 入口：三副楼刻痕牌内各嵌一枚原生按钮「合签三债」（`eyelid/vestibule/stairwell-settle-entry`，牌体 pointer-events:none、入口 auto）；总容量 < 3 时 `hidden`、不可聚焦、合成 click 三重校验零副作用；不挤压/不覆盖/不隐藏现有 16 个热点，与场景首选锁共用；点击逐字反馈「三债同签。结算所开门，点清你带来的刻痕。」后自动进 `#annex-clearinghouse`，无继续按钮。
- 结算所：三机关即原生 hotspot——左眼形印（41/9/23/26）、中央空白瓷盘（43/42.5/15.5/25）、右逆阶模型（43/71/23/37）；每轮正好 3 枚，同类不超实时容量（达到即 disabled + 正确 aria-pressed），每次合法投入只记一次并立即更新图内 `.settle-tray` 三行九孔凹槽的可访问文本（逐字「见证凹槽 已投 N 枚，本轮容量 M 枚」）+ 短反馈；第三枚保留反馈一拍自动结算，无确认/下一步。
- 落点：witness 多数 → `#unreturned-witness-gallery`；unnumbered 多数 → `#registry-before-zero`；reverse 多数 → `#descending-appeals-stair`；1/1/1 → `#protocol-drift`（v42 直 hash 本就始终允许，v52 不加宽入口、不读写 v42 状态）。
- 结果房九动作（真实物件原生 button，≥44px，click/Enter/Space/Tab，第一输入锁，逐字反馈，~0.9–1.2s 自动转场，reduced-motion ~0.3s，无确认/继续）：听声筒→失席监听间、闭眼章→见证复写库、镜面席→闭目档案室、零前牌→失号龛（v31 守卫唯一窄例外 lastScene=registry + lastAction=plate）、压底册→空白回执压印台、无号门→无号层、反阶镜→逆向阶井、倒法槌→归路核验站、无声钟→无铃病房。
- 状态：独立容错 `goddead_v52_annex_settlement`（cycle / allocations / settled / outcome / pending / 四房 visited / 四路 history / 九动作计数 / lastScene+lastAction）；坏 JSON/数组归一、数值 clamp、白名单；allocations 按「长度<=3、白名单、每类不超实时容量、合法连续前缀」归一；settled/outcome 永远由 allocations 派生重算；pending 两种形态逐字段校验，只恢复反馈与转场不重复累计；全仓库仅此一个 v52 存储键，不读写 v28–v51 与主线。
- 守卫：总容量 < 3 直 hash `#annex-clearinghouse` 回退 `eyelid-archive`；三间结果房只有本轮对应合法结果或历史 visit 准入，否则回结算所（再不够回档案室）；伪造 state 进不了结果房。
- 目录：02φ / 三债结算、02χ / 无归见证、02ψ / 零前登记、02ω / 倒诉阶，首次到访原子恢复；Remembrance 新增一行 v52 汇总，仍八张统计卡，不加结局。
- CDP 行为冒烟（`/tmp/v52-qa/v52-smoke.mjs`，真实 Google Chrome headless + 内嵌静态服务器 + 真实鼠标/键盘事件，种子经 `addScriptToEvaluateOnNewDocument` 预注入，reload 用例先移种子脚本再 about:blank 重进）**307/307 连续两轮全绿**：四场景 × 1440×1024/1440×800/390×844 几何（3:2 舞台、热点图内/两两零重叠/elementFromPoint 自命中/≥44px/无横向溢出/figure 完整落在首屏）、门槛不足（3/3/0 与 2/2/2：入口 hidden、合成 click 零副作用、直 hash 结算所回档案室、结果房直 hash 按容量链式回退）、入口合签（刻痕牌内不压旧热点、逐字反馈、同拍幂等、v51 字节级不变、目录原子恢复、进行中 cycle 跨房续投）、四路结算（9/0/0 见证、0/6/3 失号、0/3/6 逆行、3/3/3 balanced 落 protocol-drift 且 v42 不被自动作答）、凹槽三行九孔逐字 aria 与点亮、耗尽 disabled+pressed、九动作逐字反馈与精确目标（含 glyph-niche 窄例外与干净直 hash 仍回门外）、Enter/Space/Tab、第三枚同拍竞争只记一次、已结算合签只 +1 cycle、中途/结算拍 reload、坏 JSON/数组/伪造 allocations、控制台零异常。
- 视觉证据 11 张 `design-qa-evidence/v52-01~11`（桌面四房、移动四房、两枚投入中间态、balanced 反馈态、eyelid 刻痕牌合签入口 hover 态），逐张目验热点压器物、短标签无溢出无互盖。

## 本轮新增：v51 副楼三债 / THE ANNEX KEPT THREE DEBTS（13 旧动作记账 + 三个阈值异常分支，返工轮）

- 目标：不加房间——v32/v50 副楼的 13 个既有动作按 见证 5 / 失号 4 / 逆行 4 各记 +1（上限 9），任一达 3 原子解锁对应房间的一次条件异常；既有反馈、mark、首选锁与 AutoAdvance 全部保留。
- 状态：独立容错 `goddead_v51_annex_debts`（坏 JSON / 数组归一、值域裁剪、unlocked 严格布尔），不读写 v32/v33/v35 与主线；全仓库仅此一个 v51 存储键。
- 刻痕牌（返工修正）：三房间图内右上黄铜压印牌，三行各为 0–9 个独立 `<b class="dp-tick">` 刻痕元素组成的进度组件——禁止 `"│".repeat(n)` 等文本符号/emoji；容器 `role="img"` 的 aria-label 逐字报数（「见证 3 道刻痕，上限 9 道」），三牌同步重绘；移动端刻痕收窄（2px）不溢出牌面。
- 阈值异常（返工修正）：达到阈值只原子切换图像 + 异常热点作为**新增分支**出现；`DEBT_ANOMALY` 不再持有 baseBtn，`syncAnnexDebts` 不再隐藏任何旧热点——13 个旧热点在解锁前后始终可见、可聚焦、可点击，旧反馈、旧目标、首选锁不变。三对同物热点按外框/内层分区，严格不重叠、不吞点击：档案室 翻找=抽屉柜外框左列旋钮（top 49.5% left 39% w 4.5% h 20%） vs 让它们看清=三只睁开的抽屉面（50.5/45.5/13.5/18.5）；前厅 无号出口=中央门洞外框门楣（35.5/43.5/11/9.5） vs 第十门=新门框内部（45.5/47/4.5/16）；阶井 回望=黑镜外框左缘（4/18.5/5/34） vs 倒置阶井=镜中重复阶井（6/25/5.5/31）。坐标按 1536×1024 变体图裁切实测后，再按 CDP 实测 figure 尺寸（桌面 720×480、移动 343×229）留出 44px 最小盒增长余量——首轮 CDP 实测曾抓出三对桌面各 141–710px² 重叠（44px min-width/height 把窄盒撑大所致），上述为修正后终值。
- 移动端错开：44px 最小触控会把热点盒放大到约 12.8% 宽 / 19.2% 高，三对热点在 ≤720px 改锚点——闭眼抽屉对左右分带（search left 37.5% / witness left 51%）、前厅门对左右分带（tenth 38.5% / exit 52%，y 40–60 与空白号牌带 20–39.5 保持原有上下错开）、黑镜对上下分带（lookback y 4–23 / double y 24.5–43.5），放大后仍互不重叠。
- 不变量：三个异常热点出厂 `hidden`、阈值 2 时直接 hash / 合成点击一律无效（live 状态校验 + 共用场景首选锁，伪造 unlocked=true 但债值 2 同样无效）；逐字反馈后自动转场到既有相邻场景，无继续按钮；刷新恢复只重绘不重复播报；三种解锁可同时存在；reduced-motion 禁用牌面抖动与异常呼吸。
- CDP 行为冒烟（`/tmp/v51-qa/v51-smoke.mjs`，真实 Google Chrome headless + 内嵌静态服务器 + 真实鼠标/键盘事件，种子经 `addScriptToEvaluateOnNewDocument` 在应用启动前注入）**536/536 连续两次全绿**（exit 0，每轮约 200s）：A 三房间 × 1440×1024/1440×800/390×844 解锁态几何（16 热点矩形全对不重叠、不出 figure、elementFromPoint 各自命中、≥44px、刻痕牌在图内、文档无横向溢出、变体图与 figure 描述原子切换、三行各 9 刻痕元素点亮数与 aria-label 准确、恢复不重复播报）；B 16 动作真实 click 逐字反馈 + 精确目标 + 债值 +1（异常不写债）；C 16 动作 Enter 与 Space 各一轮等价 + 三房间 Tab 全可达；D 首选锁三房间双向竞争 + 同拍幂等（反馈不被改写、竞争对手 aria-pressed 保持 false、只记一次债、目标不被抢占）；E 阈值 2 三房 + 伪造 unlocked 的 hidden/程序化 click/直 hash 全部 inert；F 三房间真实重载原子恢复；G 坏 JSON / 数组归一（牌面归零、异常保持 hidden）；H 1440×800 反馈态转场前截图；Z 全程控制台零异常。
- 视觉证据（`design-qa-evidence/`，逐张目验——异变图正确、热点压器物、刻痕牌三行点亮数正确、移动短标签不溢出、反馈态文案可见）：`v51-01-eyelid-unlocked-1440x1024.png`、`v51-02-vestibule-unlocked-1440x1024.png`、`v51-03-stairwell-unlocked-1440x1024.png`（桌面解锁基线）、`v51-04-eyelid-unlocked-390x844.png`、`v51-05-vestibule-unlocked-390x844.png`、`v51-06-stairwell-unlocked-390x844.png`（移动解锁基线）、`v51-07-eyelid-witness-feedback-1440x800.png`（1440×800 反馈态）。
- 本轮修正（真实生产缺陷，CDP 抓出后修复并两轮复验）：三对热点的桌面坐标按 720px 宽 figure 重排（search left 39.5%→39%、witness left 44.5%→45.5%、exit height 8%→9.5%、tenth top 44%→45.5%、double left 24%→25%），消除 44px 最小盒撑大造成的重叠。测试工具说明（仅 `/tmp/v51-qa/`，不动生产）：同 URL `Page.navigate` 会被 Chrome 去重成无操作导致种子不生效，改经 `about:blank` 中转 + 启动前脚本注入。
- 本轮边界：不重做素材（三张 v51 变体图与冻结源 PNG 原样沿用），未触碰 `/tmp/goddead-qa/` 的 v50 临时 QA。
- 静态契约：`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件 v51 段同步返工后形态（无 baseBtn/无隐藏旧热点逻辑、刻痕元素组件断言、六条外框/内层桌面坐标与六条移动端错开规则逐字、禁 `"│".repeat`、文档同步）。

## 本轮新增：v50 副楼实感 / THE ANNEX BECAME TOUCHABLE（v32 三副楼卡片改图内原生物件热点）

- 目标：不加房间、不改路线、不扩存档树——把 `#eyelid-archive`（4）、`#unnumbered-vestibule`（5）、`#reverse-stairwell`（4）现有共 13 个按钮全部移入各自图片，成为压在真实物件上的原生 button 热点；三个图下 `.branch-choices` 卡片容器整体删除，不留隐藏副本；禁止新增继续/确认按钮。
- 素材（监理冻结源图原样使用，哈希不变）：`design-references/source-v50-annex-{eyelid,vestibule,stairwell}-tactile.png`（1536×1024）转码 `assets/annex-eyelid-tactile.webp`（225 KB）、`annex-vestibule-tactile.webp`（232 KB）、`annex-stairwell-tactile.webp`（195 KB）；v32 原三幅位图与源 PNG 全部保留、不再引用，便于独立回退。复用 v49 `.forecourt-tactile-stage` / `.forecourt-native-hotspot` 舞台与热点样式（稳定 3:2，三视口共用一套百分比坐标），styles.css 仅新增 13 条定位 class。
- 落位（源图分区放大测定 + CDP 实测 + 标注截图逐张目验）：档案室——摸索压中央柜微开抽屉（露出无号黑色档片）、听盒压左桌黄铜听音盒与短听筒、归影压前景被狭长归档缝切断的人形地影、复核压右桌红蜡封口黑色证物袋，中央柜整体不被遮住；前厅——第十门压中央黑门前悬挂的独立空白骨瓷牌（与门洞热点上下分离、互不吞并）、指印压左前景摊开无号台账与指印泥、无号出口压最深处无把手黑门门洞、送审与地下层分压右前景墙柱黑色复核投递槽与暗红微光地下层按钮（上下错开）；阶井——向上压右上上行梯段与上行脚印、第零级压中央平台横贯的暗红发亮接缝、回望压左上墙面窄长黑镜、申报压右下扶手柱黄铜异常申报盒。13 热点均 ≥44px，桌面/短桌面/移动三视口 elementFromPoint 命中、两两零重叠、不溢出 figure。
- 零逻辑改动（CDP 逐条实测）：13 按钮保留原 id、`aria-pressed`、`data-hover` 与完整 bb-title/bb-hint 文本；`script.js` 业务逻辑零改动——监听器按 id 绑定自然沿用，`ANNEX_META` 九动作、`REVIEW_ENTRY_META` 三复核入口、`FLOOR_ENTRY_META` 前厅第五入口、首选锁、rival 语义、目录与痕迹逐字不变；不新增 localStorage key；13 动作逐字反馈与精确旧目标全部实测（含 v33 复核科、v35 无号层入口目的地）。
- 移动端短标签：每热点新增 `aria-hidden` 的 `.bb-short`（摸索/听盒/归影/复核、第十门/指印/无号出口/送审/地下层、向上/第零级/回望/申报）；≤720px 完整标题转视觉隐藏但保留在 DOM 与无障碍树，短标签横排最多两行（Range 行数实测）、严格不溢出按钮、互不覆盖；移动 focus 不展开 hint（clipPath 保持 inset(50%) 实测）；bb-hint 展开仅限 ≥721px 桌面 hover/focus。
- CDP 行为冒烟（`/tmp/goddead-qa/smoke.mjs`，headless Chrome + 真实鼠标/键盘事件）**133/133 连续两轮全绿**（exit 0）：13 动作 scene 就绪/命中测试/逐字反馈/aria-pressed/首选锁 rival 幂等/连点只记一次/精确旧目标自动转场逐项；Enter/Space 键盘等价（3 例）；Tab 序可达热点；刷新恢复 aria-pressed；直达 hash 只记 visited 不自动行动（含全部 aria-pressed 为 false）；坏 JSON 与数组 JSON 容错、v33/v35 键损坏不影响 v32；reduced-motion 900ms 内完成转场；控制台零异常。**首击合同**：每个案例恰好一次 trusted Click/Enter/Space 且必须一次生效，无重试、无重发输入；就绪判定含 elementFromPoint 命中（保证前场景淡出结束），键盘前对按钮焦点做有界确认（路由切场会把焦点移到场景标题）。
- 视觉证据（`design-qa-evidence/v50-01~18`，CDP `/tmp/goddead-qa/visual.mjs` **218/218 连续两轮全绿**，18 张全部逐张目验——热点精确压器物、短标签无溢出无互盖、桌面 hint 正确展开、移动 focus 不展开 hint）：桌面基线 01~03、桌面 hover/focus 04~06、短视口 1440×800 07~09、移动基线 10~12、桌面标注 13~15、移动标注 16~18；源图/渲染同帧对照 `v50-compare-{eyelid,vestibule,stairwell}.png` 由监理生成并逐张验收通过。QA 中两处定位修正（生产 CSS，坐标类）：eyelid-file 移动端 44px 最小高度曾溢出图底（top 86%→80%、height 13%→16%），vestibule review/floor 移动端 44px 最小宽度曾溢出图右缘约 1.1px（left 87.5%→86.5%）；visual round 2 首跑两项瞬时失败（44px 亚像素浮点 43.99997、hover 单点采样抖动），测试工具加 0.05px 容差与有界轮询后重跑 218/218 全绿。
- 相邻回归（`/tmp/goddead-qa/regression.mjs` **44/44 连续两轮全绿**）：v49 三场景 tactile 结构（11 按钮入 figure、短标签 aria-hidden、卡片容器删除）、每场景真实点击一个动作逐字反馈与精确目的地、Enter 等价、刷新恢复（v40 门前守卫下先种子 v31 visited）；v33 直达 hash 中性首案不自动判定、经搬入的 eyelid-choice-review 入科、三判逐拍推进（第一/二/三份档案）并结算路由到结果房、状态持久；v35 直达枢纽电梯封死不自动行动、经搬入的 vestibule-choice-floor 入层、点击与 Enter 各进一间值班房、visited 持久。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件 v32 段同步新形态（旧三幅位图保留不再引用、按钮计数兼容附加类），新增 v50 段（13 按钮各一次且位于 figure 内、三处 branch-choices 容器删除无隐藏副本、13 个短标签 aria-hidden、13 个定位 class、舞台 3:2 与 ≥44px 沿用、无 v50 localStorage key、ANNEX_META/REVIEW_ENTRY_META/FLOOR_ENTRY_META 锚点逐字、文档同步）。
- 测试工具说明（仅 `/tmp/goddead-qa/`，不动生产）：首击失效最终定性为就绪判定时序——场景 reveal 位移动画（含 stagger 延迟期）进行中，按钮坐标在测量与输入派发之间漂移，点击落到旧坐标（有头取证 input log 实测 click 落在 `branch-img`）；waitReady 加入动画门控（子树无运行/待定的有限动画 + 矩形双采样稳定 + elementFromPoint 命中）后，smoke 连续四轮 133/133 全绿——无按压热身、每案例恰好一次 trusted 输入。有头 Chrome 真实用户式首击取证（全新 profile、无热身、单次点击）：input log 实测 click 精确命中 `#eyelid-choice-search`，逐字反馈 / aria-pressed / transitions=1 / 自动转场全部正确（PASS）。早期工具缺陷：goto 同文档导航死等（有界超时 + listener 清理）、场景可见性误判（改 `.scene.active`）、Enter 缺 `text:"\r"`、visited 键名误写（实际 `unnumberedVestibule`）、v49 回归未过 v40 守卫（种子 v31 visited）、键盘焦点被生产 `focusReliably` 抢（先等标题焦点落定再确认按钮焦点）。遗留工具缺陷（如实记录、不修复）：watchdog 在 `process.exit` 前仅杀本轮 Chrome，极端挂死路径覆盖不全；compare 合成脚本在特定时序下挂起未产出——三张 `v50-compare-{eyelid,vestibule,stairwell}.png` 最终由监理生成并逐张验收通过。

## 本轮新增：v49 门前实感 / THE FORECOURT BECAME TOUCHABLE（v31 三场景卡片改图内原生物件热点）

- 目标：不加房间、不扩存档树——把 `#peephole-chamber`、`#glyph-niche`、`#return-passage` 现有共 11 个按钮全部移入各自图片，成为压在真实器物上的原生 button 热点；三个图下 `.branch-choices` 卡片容器整体删除，不留隐藏副本；禁止新增继续/确认按钮。
- 素材（监理冻结源图原样使用）：三张 1536×1024 源 PNG 转码 `assets/forecourt-peephole-tactile.webp`（195 KB）、`forecourt-glyph-niche-tactile.webp`（224 KB）、`forecourt-return-passage-tactile.webp`（212 KB）；回返夹道新图在门环、远门、双向脚印之外补出右上老式墙挂电话与右下黄铜出证槽，五物件互不重叠。舞台 `.forecourt-tactile-stage` 固定 3:2 比例，桌面/短桌面/移动共用一套百分比坐标，无两套坐标漂移。
- 落位（CDP 实测 + 同屏对照目验）：窥孔——直视黑镜压中央黑镜、听黄铜管压左侧听音管、闭上这只眼压右侧机械眼睑；失号龛——数第九道刻痕压左墙成组刻痕、擦掉第七号压刮白第七盘（与相邻正常号盘无重叠）、取下空白号牌压底部白瓷盘；回返夹道——跟随向内的脚印沿透视线压脚印列、从里面敲门压左墙门环、倒着走到尽头只围远门门体、接住值班证压右下出证槽、接起迟到电话压右上墙挂电话。11 个热点均 ≥44px，三视口首屏可见可点（elementFromPoint 命中），标签不遮相邻物件。
- 零逻辑改动（CDP 逐条实测）：11 个按钮保留原 id、`aria-pressed`、`data-hover` 与子节点文本（bb-title/bb-hint，hint 默认视觉隐藏、hover/focus 显示、始终在无障碍树）；`script.js` 业务逻辑零改动——监听器按 id 绑定自然沿用，`FORECOURT_META`、`FLOOR_ENTRY_META`、`callbackEntryBtn`、三场景进入守卫、近邻回流、目录与痕迹逐字不变；不新增 localStorage key；11 个动作逐字反馈与精确旧目标全部实测（含 v32 三条改线闭目档案/无号前厅/逆向阶井、v36 值班证入夜班登记所、v37 电话入午夜回拨台，v31/v35/v37 各键互不代写）。
- 交互（CDP 逐条实测）：Click/Enter/Space 等价；Tab 可达全部热点；同场景首个动作排队时其余热点幂等不抢目标（同拍竞争只记一次、目的地不被抢占，两组实测）；返回后 `aria-pressed` 与 lastChoice/marks 恢复一致；门外三入口（日蚀/符号/回返）落点不退化；目录 01α/01β/01γ、痕迹单行「门前旁路：窥孔 / 失号龛 / 回返夹道；你在门外改道 N 次。」、8 卡、遗忘清除、刷新恢复、坏 JSON/数组容错、reduced-motion 缩短节拍保留文案，全部实测。
- 移动端短标签（视觉监理复核后修正）：390px 下完整动作标题曾逐字竖排溢出并互相覆盖；现每个热点新增 `aria-hidden` 的 `.bb-short` 短视觉标签（黑镜/听音管/眼睑、刻痕/第七号/空白牌、脚印/门环/远门/值班证/电话），≤720px 时完整标题转视觉隐藏但保留在 DOM 与无障碍树，短标签横排最多两行、严格不溢出按钮、互不覆盖；`bb-hint` 展开态仅限 ≥721px 桌面。既有 id/路线/监听器未动。
- CDP 行为冒烟（`/tmp/goddead-qa/v49-forecourt-tactile-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**55/55 连续两次全绿**（exit 0）：A 三场景直 hash/图解码/热点入图/无卡片/≥44px/零溢出（6 项）；B 11 动作逐字反馈与精确旧目标（22 项）；C 键盘等价与可达（5 项）；D 首选锁同拍幂等（3 项）；E aria-pressed 恢复（2 项）；F 门外三入口/v32 改线/v36/v37 键隔离（8 项）；G 目录/痕迹/遗忘/坏存档/刷新/reduced-motion（8 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v49-forecourt-tactile-visual.mjs` **32/32 连续两次全绿**，16 张证据 + 3 张源图同尺寸并排对照图 `/tmp/goddead-qa/v49-compare-*.png`，逐张目验——热点精确压器物、图片无拉伸误裁、移动短标签横排不溢出、移动无横向滚动、反馈出现后无需滚动）：桌面默认 01~03、hover/focus 04~06、移动 07~09、短桌面 10~12、反馈态 13~15、回返夹道五热点同屏 16。
- 回归（同环境重跑，全绿）：v48 smoke 82/82 + visual 37/37；cancellation/acting/search/refusal 近邻 15/15；watch/line4 近邻 16/16（链式跑中 watchnn 曾因 profile 竞争瞬时失败一次，独立重跑两轮 16/16 全绿）。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件 v31 段同步新形态（tactile 资产引用、旧 v31 位图不再引用、按钮计数兼容附加类），新增 v49 段（11 按钮各一次且位于 figure 内、三处 branch-choices 容器删除无隐藏副本、舞台 3:2 与 ≥44px、11 个定位 class、无 v49 localStorage key、FORECOURT_META/FLOOR_ENTRY_META/callbackEntryBtn 锚点逐字、文档同步）。

## 本轮新增：v48 注销留副 / THE CANCELLATION KEPT ITS COPIES（注销科三实物入口 + 三个画面热点场景）

- 目标：把神名注销科位图里只能观看的三件实物——终端中央空白检索屏、右侧红色确认灯、桌面右侧档案屉——变成三个真实支线入口；原检索输入、三档错误提示、五行档案、拒绝注销、两行驳回记录与代神席入口全部保留；三个新空间（空白屏底库 / 误准红灯台 / 见证复写库）形成可走闭环并分流到 v41/v43/v45/v46/v47 前段网络；没有确认页、下一步或底部继续按钮，没有新结局。
- 注销科三入口（CDP 逐条实测）：原生 `<button>` 热点覆盖图中真实空白屏 / 确认灯 / 档案屉（`cancellation-copy-entry-screen/lamp/trays`，独立 class `.cancellation-copy-entry-hotspot`，aria 与短标签逐字），`assets/divine-name-cancellation.webp` 哈希/尺寸/字节不变；逐字入口反馈写入图下独立 `#cancellation-copy-entry-response`（aria-live，不复用检索提示、档案记录、驳回记录或 toast）后自动转场 `#blank-screen-underarchive` / `#false-confirmation-desk` / `#witness-carbon-archive`；Click / Enter / Space 全通；三入口在 1440×1024 / 390×844 / 1440×800 均可见可点（elementFromPoint 命中、≥44px）且与检索表单零遮挡；三入口不写 `goddead_cancellation`（字节级一致实测），不替玩家检索、不替玩家拒绝注销；三档错误提示逐字、GODDEAD 唯一命中、五行档案、拒绝注销、两行驳回与 `#acting` 原路径 toast 逐字不变（实测）。
- 第一归宿锁双向（CDP 逐条实测）：拒绝已排定 `#acting`（`AutoAdvance.has("cancellation")`）时三入口完全 inert——不写 v48、不反馈、不抢目的地，acting 转场不被抢占；v48 入口先被接受时先置 `cancellationCopyArmed` 再 `AutoAdvance.clear("cancellation")` 与 `clearCnTimers()`，反馈拍内检索表单与拒绝按钮 early return（对 `goddead_cancellation` 零迟到写入、不加 queries、不命中、不显记录、不写 refused，实测字节级一致），目的地不被改写、无迟到 acting 跳场；错误或正确检索本身不排定目的地——检索后入口仍可进入（实测），返回注销科由 `enterCancel()` 复位旗标、清空入口反馈并按原持久状态恢复提示/档案/拒绝按钮（实测）；同拍三入口竞争只接受第一项。
- 九动作与闭环（CDP 逐条实测）：三场景各三个画面内热点（触白屏/抽纸带/窥暗孔、复按红灯/压注销印/探退纸槽、揭复写纸/拉见证屉/取见证卡），逐字反馈写入各场景自己的 aria-live，独立 AutoAdvance scope（`copy-screen/lamp/carbon`），第一项接受后同场景三热点立即 disabled；闭环 屏底库 → 误准灯台 → 复写库 → 屏底库 实测可走；六个外部落点逐一实测：退址格柜、失席监听间、回敲廊、无主气送井、红线登记所、缺班更衣柜。
- 状态（CDP 逐条实测）：独立容错 `goddead_v48_cancellation_copies`——visited 三布尔键、entry 七值白名单、pending 四字段与动作表逐项完全对应（伪造 target / 伪造 feedback 实测丢弃不重播不转场）、lastScene/lastAction 白名单（错配归一）、copies 裁 9999（1e18 实测）、marks 9 项白名单（bogus 实测丢弃）；坏 JSON / 数组错型归一；不读写 v28–v47、`goddead_cancellation` 与主线（种子快照字节级一致，全程留副漫游实测）；timer 触发前清 pending；reload 反馈拍重播逐字反馈并恢复转场不重复计数；离场保留合法 pending、重返重播续走；reduced-motion 缩短节拍保留文案；off-route / 隐藏场景程序化 click 对状态、反馈、timer 零副作用（两个方向实测）；遗忘清除 v48 键、三目录入口与记忆行。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `02σ / 屏底库`、`02τ / 误准灯`、`02υ / 复写库`（未访问 hidden、不可聚焦、不在无障碍树）；Remembrance 只加单行 `#cancellation-copy-memory`（「注销留副：复写 N 次；屏底库 / 误准灯 / 复写库已见 X/3。」），严格保持 8 卡。
- CDP 功能冒烟（`/tmp/goddead-qa/v48-cancellation-copies-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**82/82 连续两次全绿**（exit 0）：A 三入口逐字反馈/visited/目的地/cancellation 不变/键盘（10 项）；B 三档提示/唯一命中/档案/拒绝/acting 原路径（7 项）；C 第一归宿锁双向/离场重选/检索后旁路与返回恢复（10 项）；D 九动作逐字/真实目的地/闭环（19 项）；E 场景结构/直 hash/live scene 前置守卫（6 项）；F 同拍竞争与键盘（4 项）；G pending 伪造/合法/reload/离场/reduced-motion（10 项）；H 容错（4 项）；I v28–v47+watch+line4+deadletter+cancellation+主线字节级隔离（2 项）；J 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v48-cancellation-copies-visual.mjs` **37/37 连续两次全绿**，20 张证据 + 4 张源图对照图均经逐张目验——目验方式：源 PNG 与同状态网页截图合成同屏对照图后判断，热点全部落在真实器物上）：
  - `v48-01-cancellation-clean-1440x1024.png`：注销科 clean（三入口落在空白屏/确认灯/档案屉真器物上）。
  - `v48-02~04-cancellation-entry-*-feedback-1440x800.png`：三入口反馈态（逐字 + touched 态，未跳场定格）。
  - `v48-05~07-*-1440x1024.png`：三场景桌面（图 + 三画面热点首屏；对照图 `/tmp/goddead-qa/v48-compare-screen/lamp/carbon.png`）。
  - `v48-08~10-*-mobile-390x844.png`：三场景移动（图 + 三热点 ≥44px、零溢出）。
  - `v48-11~13-*-short-1440x800.png`：三场景短桌面。
  - `v48-14~16-*-feedback-1440x800.png`：三场景各一条动作反馈态（逐字 + 节拍锁）。
  - `v48-17-cancellation-entries-mobile-390x844.png` / `v48-18-cancellation-entries-short-1440x800.png`：注销科三入口移动 / 短桌面可见可点、不遮检索表单。
  - `v48-19-directory-copies-1440x800.png`：目录 02σ/02τ/02υ。
  - `v48-20-remembrance-copies-1440x800.png`：痕迹单行 + 8 卡。
- 回归（同环境重跑，全绿）：v47 smoke 79/79 + visual 34/34；v46 smoke 79/79 + visual 31/31；v45 smoke 78/78 + visual 31/31；cancellation/acting/search/refusal 近邻（`/tmp/goddead-qa/cancellation-acting-near-neighbor.mjs`，五元守卫/三档提示/唯一命中/档案/拒绝/acting 原路径/电闸任命/重载恢复/常规浏览零污染）15/15。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v48 段（三源 PNG 与三 WebP 存在/尺寸/引用、注销科原图不动、三入口/aria/短标签/独立 class、三档提示与 acting 路径、第一归宿锁守卫顺序与表单/拒绝迟到写入守卫、三场景说明/九热点/出口/无卡片无 SVG、目录 02σ/02τ/02υ、痕迹单行、8 卡、状态容错与 pending 四字段、九动作逐字、live scene 守卫、缓存 v48、文档同步）；SCENES 清单加三场景。

## 本轮新增：v47 退件未止 / THE RETURNS OUTLIVED THEIR ADDRESSES（投递所三实物入口 + 三个画面热点场景）

- 目标：把无主投递所位图里只能观看的三件实物——后墙三只黄铜气送管、右上退件格柜、桌面中央空白回执——变成三个真实支线入口；三封退件原文、归档语义、空白回执唯一签收、逐行终局记录与神名注销科入口全部保留；三个新空间（无主气送井 / 退址格柜 / 空白回执压印台）形成可走闭环并分流到 v34/v36/v37/v41/v44/v45/v46 前段网络；没有确认页、下一步或底部继续按钮，没有新结局。
- 投递所三入口（CDP 逐条实测）：原生 `<button>` 热点覆盖图中真实气送管 / 格柜 / 空白回执（`return-room-entry-tubes/cabinet/receipt`，独立 class `.return-room-entry-hotspot`，aria 与短标签逐字），`assets/dead-letter-office.webp` 哈希/尺寸/字节不变；逐字入口反馈写入图下独立 `#return-room-entry-response`（aria-live，不复用登记台 alt 文案或 toast）后自动转场 `#unclaimed-pneumatic-intake` / `#returned-address-cabinet` / `#blank-receipt-press`；Click / Enter / Space 全通；三入口在 1440×1024 / 390×844 / 1440×800 均可见可点（elementFromPoint 命中、≥44px）且与退件登记台零遮挡；三入口不写 `goddead_deadletter`（字节级一致实测），不替玩家归档退件、不替玩家签收空白回执；归档三件 → 回执原子启用 → 签收 → `#cancellation` 的原路径与 toast 逐字不变（实测）。
- 第一归宿锁双向（CDP 逐条实测）：主线回执已排定 `#cancellation`（`AutoAdvance.has("deadletter")`）时三入口完全 inert——不写 v47、不反馈、不抢目的地，cancellation 转场不被抢占；v47 入口先被接受时先置 `deadletterReturnRoomArmed` 再 `AutoAdvance.clear("deadletter")`，反馈拍内三枚退件按钮与空白回执按钮对 `goddead_deadletter` 零迟到写入（`coverReturn` 与 receipt 处理器均在任何写入/声音/toast/timer 前检查旗标，实测字节级一致），不解锁回执、不签收、不改写目的地、无迟到 cancellation 跳场；离场取消后回投递所由 `enterDeadletter()` 复位旗标并清入口反馈，主线可重新武装（实测）、入口可重选（实测）；同拍三入口竞争只接受第一项。
- 九动作与闭环（CDP 逐条实测）：三场景各三个画面内热点（开气筒/听管口/拉红绳、拆空封/转分格/探长屉、压空执/蘸旧墨/落压杆），逐字反馈写入各场景自己的 aria-live，独立 AutoAdvance scope（`return-room-intake/cabinet/press`），第一项接受后同场景三热点立即 disabled；闭环 气送井 → 退址柜 → 压印台 → 气送井 实测可走；六个外部落点逐一实测：午夜回拨台、回铃陈放室、红线登记所、留置库、无主估值室、前一分钟档案井。
- 状态（CDP 逐条实测）：独立容错 `goddead_v47_returned_rooms`——visited 三布尔键、entry 七值白名单、pending 四字段与动作表逐项完全对应（伪造 target / 伪造 feedback 实测丢弃不重播不转场）、lastScene/lastAction 白名单（错配归一）、reroutes 裁 9999（1e18 实测）、marks 9 项白名单（bogus 实测丢弃）；坏 JSON / 数组错型归一；不读写 v28–v46、`goddead_deadletter` 与主线（种子快照字节级一致，全程退件后室漫游实测）；timer 触发前清 pending；reload 反馈拍重播逐字反馈并恢复转场不重复计数；离场保留合法 pending、重返重播续走；reduced-motion 缩短节拍保留文案；off-route / 隐藏场景程序化 click 对状态、反馈、timer 零副作用（两个方向实测）；遗忘清除 v47 键、三目录入口与记忆行。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `02ο / 气送井`、`02π / 退址柜`、`02ρ / 压印台`（未访问 hidden、不可聚焦、不在无障碍树）；Remembrance 只加单行 `#return-room-memory`（「退件未止：改址 N 次；气送井 / 退址柜 / 压印台已见 X/3。」），严格保持 8 卡。
- CDP 功能冒烟（`/tmp/goddead-qa/v47-returned-rooms-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**79/79 连续两次全绿**（exit 0）：A 三入口逐字反馈/visited/目的地/deadletter 不变/键盘（10 项）；B 三退件原文/回执唯一签收/cancellation 原路径（6 项）；C 第一归宿锁双向与离场重选（8 项）；D 九动作逐字/真实目的地/闭环（19 项）；E 场景结构/直 hash/live scene 前置守卫（6 项）；F 同拍竞争与键盘（4 项）；G pending 伪造/合法/reload/离场/reduced-motion（10 项）；H 容错（4 项）；I v28–v46+watch+line4+deadletter+主线字节级隔离（2 项）；J 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v47-returned-rooms-visual.mjs` **34/34 连续两次全绿**，20 张证据 + 4 张源图对照图均经逐张目验——目验方式：源 PNG 与同状态网页截图合成同屏对照图后判断，热点全部落在真实器物上）：
  - `v47-01-deadletter-clean-1440x1024.png`：投递所 clean（三入口落在气送管/格柜/空白回执真器物上，登记台原文）。
  - `v47-02~04-deadletter-entry-*-feedback-1440x800.png`：三入口反馈态（逐字 + touched 态，未跳场定格）。
  - `v47-05~07-*-1440x1024.png`：三场景桌面（图 + 三画面热点首屏；对照图 `/tmp/goddead-qa/v47-compare-intake/cabinet/press.png`）。
  - `v47-08~10-*-mobile-390x844.png`：三场景移动（图 + 三热点 ≥44px、零溢出）。
  - `v47-11~13-*-short-1440x800.png`：三场景短桌面。
  - `v47-14~16-*-feedback-1440x800.png`：三场景各一条动作反馈态（逐字 + 节拍锁）。
  - `v47-17-deadletter-entries-mobile-390x844.png` / `v47-18-deadletter-entries-short-1440x800.png`：投递所三入口移动 / 短桌面可见可点、不遮登记台。
  - `v47-19-directory-return-room-1440x800.png`：目录 02ο/02π/02ρ。
  - `v47-20-remembrance-return-room-1440x800.png`：痕迹单行 + 8 卡。
- 回归（同环境重跑，全绿）：v46 smoke 79/79 + visual 31/31；v45 smoke 78/78 + visual 31/31；v44 smoke 78/78 + visual 26/26；deadletter/cancellation/receipt 近邻（`/tmp/goddead-qa/deadletter-cancellation-near-neighbor.mjs`，三元守卫/三退件原文/倒计时理由/回执启用/签收终态/重载恢复/注销科提示与拒绝/常规浏览零污染）14/14。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v47 段（三源 PNG 与三 WebP 存在/尺寸/引用、投递所原图不动、三入口/aria/短标签/独立 class、三退件原文与 cancellation 路径、第一归宿锁守卫顺序与退件/回执迟到写入守卫、三场景说明/九热点/出口/无卡片无 SVG、目录 02ο/02π/02ρ、痕迹单行、8 卡、状态容错与 pending 四字段、九动作逐字、live scene 守卫、缓存 v47、文档同步）；SCENES 清单加三场景。

## 本轮新增：v46 旁线未静 / THE SIDE TONES NEVER WENT QUIET（交换台三实物入口 + 三个画面热点场景）

- 目标：把交换台位图里只能观看的三件实物——左下黑色听筒、前景散线插头、右下红色回铃灯——变成三个真实支线入口；四回线原文、前三回线覆盖、第四线唯一接通、接通记录逐行显现与无主投递所主线全部保留；三个新空间（失席监听间 / 无号插孔场 / 回铃陈放室）彼此连通并接回 v36/v37/v41/v43/v40 前段网络；没有确认页、下一步或底部继续按钮，没有新结局，旁线不是第五/六/七线路。
- 交换台三入口（CDP 逐条实测）：原生 `<button>` 热点覆盖图中真实听筒 / 插头 / 回铃灯（`sidetone-entry-receiver/plug/return-lamp`，独立 class `.sidetone-entry-hotspot`，aria 与短标签逐字），`assets/line-four-switchboard.webp` 哈希/尺寸/字节不变；逐字入口反馈写入图下独立 `#sidetone-entry-response`（aria-live，不复用接线簿 alt 文案）后自动转场 `#unseated-listening-booth` / `#unnumbered-jack-field` / `#return-ring-morgue`；Click / Enter / Space 全通；三入口在 1440×1024 / 390×844 / 1440×800 均可见可点（elementFromPoint 命中、≥44px）且与接线簿零遮挡；三入口不写 `goddead_line4`（字节级一致实测），不替玩家听回线、不接通第四线路；前三回线听过 → 第四线原子启用 → 接通 → `#deadletter` 的原路径与 toast 逐字不变（实测）。
- 第一归宿锁双向（CDP 逐条实测）：第四线已排定 `#deadletter`（`AutoAdvance.has("switchboard")`）时三入口完全 inert——不写 v46、不反馈、不抢目的地，deadletter 转场不被抢占；v46 入口先被接受时先置 `switchSidetoneArmed` 再 `AutoAdvance.clear("switchboard")`，反馈拍内四条 `.patch-btn` 对 `goddead_line4` 零迟到写入（`coverPatch` 与 patch-4 处理器均在任何写入/声音/toast/timer 前检查旗标，实测字节级一致），已接受的目的地不被改写、无迟到 deadletter 跳场；离场取消后回交换台由 `enterSwitch()` 复位 `switchSidetoneArmed` 并清入口反馈，主线可重新武装（实测）、入口可重选（实测）；同拍三入口竞争只接受第一项。
- 九动作与路网（CDP 逐条实测）：三场景各三个画面内热点（贴耳筒/对空话筒/坐失席、插游线/接空孔/挂空签、取回灯/读退单/敲蜡铃），逐字反馈写入各场景自己的 aria-live，独立 AutoAdvance scope（`sidetone-booth/jack/morgue`），第一项接受后同场景三热点立即 disabled；九真实目的地逐一实测：午夜回拨台、回敲廊、无号插孔场、红线登记所、回铃陈放室、夜班登记所、无灯灯廊、未应门前厅、回环失席监听间。
- 状态（CDP 逐条实测）：独立容错 `goddead_v46_sidetones`——visited 三布尔键、entry 七值白名单、pending 四字段与动作表逐项完全对应（伪造 target / 伪造 feedback 实测丢弃不重播不转场）、lastScene/lastAction 白名单（错配归一）、traversals 裁 9999（1e18 实测）、marks 9 项白名单（bogus 实测丢弃）；坏 JSON / 数组错型归一；不读写 v28–v45、`goddead_watch`、`goddead_line4` 与主线（种子快照字节级一致，全程旁线漫游实测）；timer 触发前清 pending；reload 反馈拍重播逐字反馈并恢复转场不重复计数；离场保留合法 pending、重返重播续走；reduced-motion 缩短节拍保留文案；off-route / 隐藏场景程序化 click 对状态、反馈、timer 零副作用（两个方向实测）；遗忘清除 v46 键、三目录入口与记忆行。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `02μ / 失席`、`02ν / 无号孔`、`02ξ / 回铃`（未访问 hidden、不可聚焦、不在无障碍树）；Remembrance 只加单行 `#sidetone-memory`（「旁线未静：改道 N 次；失席 / 无号孔 / 回铃已见 X/3。」），严格保持 8 卡。
- CDP 功能冒烟（`/tmp/goddead-qa/v46-sidetones-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**79/79 连续两次全绿**（exit 0）：A 三入口逐字反馈/visited/目的地/line4 不变/键盘（10 项）；B 四回线原文/第四线唯一接通/deadletter 原路径（6 项）；C 第一归宿锁双向与离场重选（8 项）；D 九动作逐字与真实目的地（19 项）；E 场景结构/直 hash/live scene 前置守卫（6 项）；F 同拍竞争与键盘（4 项）；G pending 伪造/合法/reload/离场/reduced-motion（10 项）；H 容错（4 项）；I v28–v45+watch+line4+主线字节级隔离（2 项）；J 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v46-sidetones-visual.mjs` **31/31 连续两次全绿**，均经逐张目验）：
  - `v46-01-switchboard-clean-1440x1024.png`：交换台 clean（三入口落在听筒/插头/回铃灯真器物上，接线簿原文）。
  - `v46-02~04-switch-entry-*-feedback-1440x800.png`：三入口反馈态（逐字 + touched 态，未跳场定格）。
  - `v46-05~07-*-1440x1024.png`：三场景桌面（图 + 三画面热点首屏）。
  - `v46-08~10-*-mobile-390x844.png`：三场景移动（图 + 三热点 ≥44px、零溢出）。
  - `v46-11~13-*-short-1440x800.png`：三场景短桌面。
  - `v46-14~16-*-feedback-1440x800.png`：三场景各一条动作反馈态（逐字 + 节拍锁）。
  - `v46-17-switch-entries-mobile-390x844.png` / `v46-18-switch-entries-short-1440x800.png`：交换台三入口移动 / 短桌面可见可点、不遮接线簿。
  - `v46-19-directory-sidetone-1440x800.png`：目录 02μ/02ν/02ξ。
  - `v46-20-remembrance-sidetone-1440x800.png`：痕迹单行 + 8 卡。
- 回归（同环境重跑，全绿）：v45 smoke 78/78 + visual 31/31；v44 smoke 78/78 + visual 26/26；v43 smoke 82/82 + visual 30/30；v42 smoke 94/94；v41 smoke 75/75；v40 smoke 77/77 + visual 25/25；watch/line4 近邻（`/tmp/goddead-qa/watch-line4-near-neighbor.mjs`）16/16。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v46 段（三源 PNG 与三 WebP 存在/尺寸/引用、交换台原图不动、三入口/aria/短标签/独立 class、四回线原文与 deadletter 路径、第一归宿锁守卫顺序与 patch 迟到写入守卫、三场景说明/九热点/出口/无卡片无 SVG、目录 02μ/02ν/02ξ、痕迹单行、8 卡、状态容错与 pending 四字段、九动作逐字、live scene 守卫、缓存 v46、文档同步）；SCENES 清单加三场景。

## 本轮新增：v45 未到交班 / THE RELIEF SHIFT THAT NEVER ARRIVED（值夜室三实物入口 + 三个画面热点场景）

- 目标：把值夜室里原本只负责气氛的三件实物——03:17 钟轴、熄灭台灯、空椅——变成三个真实支线入口；交班簿五条原文、05:02 主动覆盖、签退、第四线路唯一解锁与自动进入交换台的全部现有语义不变；三个新空间（前一分钟档案井 / 冷灯芯检修槽 / 缺班更衣柜）彼此连通并接回 v36/v38/v40/v43/v44 前段网络；没有确认、下一步、继续、结算按钮，没有新结局。
- 值夜室三入口（CDP 逐条实测）：原生 `<button>` 热点覆盖图中真实钟轴 / 灯帽 / 椅面（`relief-entry-clock/lamp/chair`，aria 与短标签逐字），原三素材 `watch-clock-face.webp` / `watch-second-hand.png` / `watch-room-desk.webp` 不替换不重编码；逐字入口反馈（toast）后自动转场 `#minute-before-archive` / `#cold-wick-service-bay` / `#absent-relief-locker`；Click / Enter / Space 全通；三入口在 1440×1024 / 390×844 / 1440×800 均可见可点（elementFromPoint 命中、≥44px）且与交班簿、签退按钮零遮挡；三入口不写 `goddead_watch` / `goddead_line4`（字节级一致实测），不替玩家覆盖 05:02、不替玩家签退；05:02 + 至少一次签退仍是第四线路唯一解锁条件，交换台原路径与 toast 逐字不变。
- 第一归宿锁双向（CDP 逐条实测）：第四线路转场已排定（`AutoAdvance.has("watch")`）时入口零副作用——不写 v45、不反馈、不抢目的地，交换台转场不被抢占；v45 入口先被接受时先置 `watchReliefArmed` 再 `AutoAdvance.clear("watch")`，05:02 覆盖与签退保留自身状态语义但绝不能改写已接受的支线目的地，节拍后无迟到的交换台跳场；离场取消后回值夜室 `watchReliefArmed` 由 scene init 复位，主线可重新武装到交换台；同拍三入口竞争只接受第一项。
- 九动作与路网（CDP 逐条实测）：三场景各三个画面内热点（拨分针/盖时印/下齿槽、拧冷芯/拔电话线/推保险片、穿空外套/坐空椅/签缺班簿），逐字反馈写入各场景自己的 aria-live，独立 AutoAdvance scope（`relief-minute/wick/locker`），第一项接受后同场景三热点立即 disabled；九真实目的地逐一实测：滞影回廊、夜班登记所、冷灯芯检修槽、无灯灯廊、回敲廊、缺班更衣柜、代审窗、借影陈列廊、签缺班簿回环 `#watch`（仍受原三残页门槛守卫）；`night-shift-registry` 现行无直达守卫，干净直达与 v45 落点语义均保持，未新增例外。
- 状态（CDP 逐条实测）：独立容错 `goddead_v45_absent_relief`——visited 三布尔键、entry 七值白名单、pending 四字段与动作表逐项完全对应（伪造 target / 伪造 feedback 实测丢弃不重播不转场）、lastScene/lastAction 白名单（错配归一）、traversals 裁 9999（1e18 实测）、marks 9 项白名单（bogus 实测丢弃）；坏 JSON / 数组错型归一；不读写 v28–v44、`goddead_watch`、`goddead_line4` 与主线（种子快照字节级一致，全程支线漫游实测）；timer 触发前清 pending；reload 反馈拍重播逐字反馈并恢复转场不重复计数；离场保留合法 pending、重返重播续走；reduced-motion 缩短节拍保留文案；off-route / 隐藏场景程序化 click 对状态、反馈、timer 零副作用（两个方向实测）；遗忘清除 v45 键、三目录入口与记忆行。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `02ι / 分前`、`02κ / 冷芯`、`02λ / 缺班`（未访问 hidden、不可聚焦、不在无障碍树）；Remembrance 只加单行 `#relief-memory`（「未到交班：改道 N 次；分前 / 冷芯 / 缺班已见 X/3。」），严格保持 8 卡。
- CDP 功能冒烟（`/tmp/goddead-qa/v45-absent-relief-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**78/78 连续两次全绿**（exit 0）：A 三入口逐字反馈/visited/目的地/旧键不变/键盘（10 项）；B 交班簿原文/签退/05:02/line4 唯一解锁/交换台原路径（5 项）；C 第一归宿锁双向与离场重选（7 项）；D 九动作逐字与真实目的地（19 项）；E 场景结构/直 hash/守卫/live scene 前置守卫（10 项）；F 同拍竞争与键盘（4 项）；G pending 伪造/合法/reload/离场/reduced-motion（10 项）；H 容错（4 项）；I v28–v44+watch+line4+主线字节级隔离（1 项）；J 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v45-absent-relief-visual.mjs` **31/31 连续两次全绿**，均经逐张目验）：
  - `v45-01-watch-clean-1440x1024.png`：值夜室 clean 首屏（钟轴入口可见，交班簿五条原文）。
  - `v45-02~04-watch-entry-*-feedback-1440x800.png`：钟轴 / 台灯 / 空椅三入口反馈态（逐字 toast + touched 态，未跳场定格）。
  - `v45-05~07-*-1440x1024.png`：三场景桌面（图 + 三画面热点首屏）。
  - `v45-08~10-*-mobile-390x844.png`：三场景移动（图 + 三热点 ≥44px、零溢出）。
  - `v45-11~13-*-short-1440x800.png`：三场景短桌面。
  - `v45-14~16-*-feedback-1440x800.png`：三场景各一条动作反馈态（逐字 + 节拍锁）。
  - `v45-17-watch-entries-mobile-390x844.png` / `v45-18-watch-entries-short-1440x800.png`：值夜室三入口移动 / 短桌面可见可点、不遮交班簿与签退。
  - `v45-19-directory-relief-1440x800.png`：目录 02ι/02κ/02λ。
  - `v45-20-remembrance-relief-1440x800.png`：痕迹单行 + 8 卡。
- 回归（同环境重跑，全绿）：v44 smoke 78/78 + visual 26/26；v43 smoke 82/82 + visual 30/30；v42 smoke 94/94；v41 smoke 75/75；v40 smoke 77/77 + visual 25/25；watch/line4 近邻（`/tmp/goddead-qa/watch-line4-near-neighbor.mjs`，三残页门槛/hash 归一/交班簿原文/签退持久化/两种顺序解锁/交换台三回拨+第四线路启用/常规浏览零污染）16/16。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v45 段（三源 PNG 与三 WebP 存在/尺寸/引用、值夜室旧三素材哈希尺寸不变、三入口/三场景/说明/九按钮/aria/短标签/出口/目录/痕迹齐全、`.relief-entry-hotspot` 与 `.relief-hotspot` 独立 class、无卡片清单无 SVG、SCENES 清单、交班簿五条原文/05:02/签退/line4 契约、v45 状态/pending/白名单/live scene 守卫/watch 第一归宿锁/遗忘/文档同步）。

## 本轮新增：v44 页后空层 / THE SPACES BEHIND THE PAGES（残页 f1/f5/f8 首读改线 + 三个画面热点场景）

- 目标：利用走廊里玩家本来就会点击的残页，把 f1/f5/f8 三张目前只累计数量的选择改成真实支线入口；只改第一次主动阅读后的目的地，残页原文、计数、已读样式、存档与主线三页门槛全部保留；三个新空间彼此连通并接回 v31/v40/v43 与原走廊网络；没有确认、下一步、继续、结算按钮，没有新结局。
- 走廊入口改线（CDP 逐条实测）：八张残页原文/计数/已读样式与 `assets/scripture-corridor.webp` 不变；f1 首读 → `#lagging-shadow-cloister`、f5 首读 → `#ash-door-foundry`、f8 首读 → `#retention-vault`（entry=fragment-f1/f5/f8，先完成原计数再转场，intro toast 三句为连接性新文案）；恰好第三页时 v44 分支优先绝不同时进 `#watch`；`corridorDetourArmed` 支线首选锁——本拍任一支线被接受后其余残页输入全部忽略（一次计数一次调度，v44→v29 与 v29→v44 双向实测），回走廊复位，离场取消后未读入口可重新选择；已读再点不重复计数、不重复转场、保留回读语义；f2/f3/f4 v29 路由与 f6/f7 主线实测不变。
- 三个新场景（CDP 逐条实测）：滞影回廊/灰门铸室/留置空库（说明逐字），各三个覆盖真实器物的画面热点（拔钉→`#borrowed-shadow-gallery`、入轮廓→`#ash-door-foundry`、等影→`#return-passage`、冷风箱→`#protocol`、灰钥匙→`#retention-vault`、灰门→`#unlit-lamp-gallery`、挂空签→`#counter-knock-gallery`、摸灰印→`#lagging-shadow-cloister`、留残页→`#corridor`），独立 `.paperback-hotspot` class，≥44px，零卡片清单、零 SVG；九动作逐字反馈全部真实 UI 实测；第一项锁+同节拍竞争只记一次；低权重出口只回 `#corridor`。
- 守卫（CDP 逐条实测）：v31 干净直达仍落回门外；**catch→return-passage 唯一窄例外**（lastScene=shadow && lastAction=catch 才放行，pin 与错配全部仍被拦）；九动作处理器在任何状态读取/反馈/音效/timer 前校验 live scene（threshold 与页后场景程序化 click、跨两隐藏场景同拍全部零副作用）；三新场景允许干净 direct hash（只记到访不自动动作）。
- 状态（CDP 逐条实测）：独立容错 `goddead_v44_paperback_spaces`——visited 三布尔键、entry 七值白名单、pending 四字段严格对应（伪造 target/feedback 清空不重播）、lastScene/lastAction 互相匹配、traversals 裁 9999、marks 9 项白名单；坏 JSON/数组错型归一；不读写 v28–v43 与主线（字节级一致，走廊入口只允许原残页计数变化：fragment_count +1 与 goddead_state 主线存档）；timer 触发前清 pending；reload 反馈拍重播逐字反馈并恢复转场不重复计数；离场保留合法 pending、重返重播续走；reduced-motion 缩短节拍保留文案；遗忘清除 v44 键、三目录入口与记忆行。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `02ζ / 滞影`、`02η / 灰门`、`02θ / 留置`；Remembrance 单行 `#paperback-memory`（「页后空层：改道 N 次；滞影 / 灰门 / 留置已见 X/3。」），严格 8 卡。
- CDP 功能冒烟（`/tmp/goddead-qa/v44-paperback-spaces-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**78/78 连续两次全绿**（exit 0）：A 入口改线（19 项）；B 九动作（19 项）；C 场景结构/直 hash/守卫（15 项）；D 竞争与键盘（3 项）；E pending/reload/离场/reduced-motion（10 项）；F 容错（4 项）；G 隔离（2 项）；H 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v44-paperback-spaces-visual.mjs` **26/26 通过**，均经逐张目验）：
  - `v44-01-corridor-clean-1440x1024.png`：走廊 clean（八残页+原图不变）。
  - `v44-02~04-corridor-f*-entry-1440x800.png`：f1/f5/f8 三入口反馈态（首读 .read + 支线 toast）。
  - `v44-05~07-*-1440x1024.png`：三场景桌面（图+三画面热点首屏）。
  - `v44-08~10-*-mobile-390x844.png`：三场景移动（图+三热点 ≥44px、零溢出）。
  - `v44-11~13-*-short-1440x800.png`：三场景短桌面。
  - `v44-14~16-*-feedback-1440x800.png`：三场景各一条动作反馈态（逐字+节拍锁）。
  - `v44-17-directory-paperback-1440x800.png`：目录 02ζ/02η/02θ。
  - `v44-18-remembrance-paperback-1440x800.png`：痕迹单行 + 8 卡。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v44 段（资产/走廊图不变/f1/f5/f8 原文不变/v29 路由不变/入口表与 detour 锁/三场景结构/状态容错/九动作逐字/live scene 守卫/catch 唯一窄例外/目录痕迹/文档同步）；既有 corridor sceneInit 断言同步新形态、SCENES 清单加三场景。

## 本轮新增：v43 门内回敲网 / THE COUNTER-KNOCK NETWORK（敲门窗口三回敲 + 三个画面热点场景）

- 目标：回到打开网页后的第一分钟——第一次正常敲门后，门板内部显露左响/缝响/右响三处短暂原生热点；玩家可继续敲到第三次走原 protocol，也可立即改道到回敲廊、未应门前厅、门槛下投递处；三个新区域彼此互通并接回 v31/v38/v40 既有前段网络；没有确认页、下一步、继续按钮或新结局。
- 敲门窗口（CDP 逐条实测）：三处回敲出厂 hidden 不占焦点；第一敲后显露（克制暗红脉冲一次），第二敲仍在并转急促，第三敲立即隐藏且开门图与 protocol 主流程不退化；敲门衰减与第四下同样隐藏；回首页按 session knocks 恢复、刷新按 session 语义关闭；**缝响只覆盖门缝下段**（初版覆盖门中心导致第二/第三敲被误劫持，视觉复现后修，现门中心命中实测仍是 door-img）；与三敲、v31 三热点、v38 代审、v40 左右廊共用 threshold 首选锁（双向实测）；处理器在读取状态、写反馈、声音、timer 前依次校验 currentScene、hidden、knocks 1/2、AutoAdvance；Enter/Space 可激活（实测）。
- 三个新场景（CDP 逐条实测）：回敲廊/未应门前厅/门槛下投递处（说明逐字），各三个覆盖真实器物的画面热点（敲响中央向内的门环→`#peephole-chamber`、按住被黑蜡封死的门环→`#unanswered-vestibule`、追上先于金属落下的影子→`#undersill-dispatch`、登记左鼓第一声→`#protocol`、听完第二声→`#counter-knock-gallery`、抹掉右鼓第三声→`#return-passage`、收下黑蜡封件→`#proxy-admission`、推回空白纸条→`#glyph-niche`、爬进铰链竖井→`#hinge-sorting-room`），独立 `.knocknet-hotspot` class，≥44px，零卡片清单、零 SVG；九动作逐字反馈全部真实 UI 实测；第一项锁+同节拍竞争只记一次。
- 守卫（CDP 逐条实测）：v31 三场景干净直达仍落回门外；只为本轮 v43 `lastAction` 对应落点加窄例外（inward 放行窥孔但 glyph 仍被拦、lastScene/lastAction 错配全部不放行）；hinge-sorting-room 沿用 v40 现行可进入语义；三新场景允许干净 direct hash；live scene 前置守卫下 threshold/回敲场景/跨两隐藏场景的程序化 click 全部零副作用。
- 状态（CDP 逐条实测）：独立容错 `goddead_v43_counter_knock`——visited 三布尔键、entry 七值白名单、pending 四字段严格对应（伪造 target/feedback 清空不重播）、lastScene/lastAction 互相匹配、traversals 裁 9999、marks 9 项白名单；坏 JSON/数组错型归一；不读写 v28–v42 与主线（字节级一致）；timer 触发前清 pending；reload 反馈拍重播逐字反馈并恢复转场不重复计数；离场保留合法 pending、重返重播续走；reduced-motion 缩短节拍保留文案；遗忘清除 v43 键、三目录入口、记忆行并重置敲门计数与回敲显露态。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `02γ / 回敲廊`、`02δ / 未应门`、`02ε / 门槛下`；Remembrance 单行 `#knocknet-memory`（「门内回敲：改道 N 次；回敲 / 未应 / 门槛下已见 X/3。」），严格 8 卡。
- CDP 功能冒烟（`/tmp/goddead-qa/v43-counter-knock-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**82/82 连续两次全绿**（exit 0）：A 窗口生命周期（10 项）；B 三回敲反馈/目的地/首选锁/键盘（13 项）；C 九动作（19 项）；D 三场景画面热点（3 项）；E 守卫（10 项）；F 竞争与键盘（4 项）；G pending/reload/离场（9 项）；H 容错（4 项）；I reduced-motion（1 项）；J 隔离（1 项）；K 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v43-counter-knock-visual.mjs` **30/30 通过**，均经逐张目验）：
  - `v43-01-threshold-clean-1440x1024.png` / `v43-02-threshold-knock1-1440x1024.png` / `v43-03-threshold-knock2-urgent-1440x1024.png` / `v43-04-threshold-knock3-open-1440x1024.png`：首页 clean/第一敲/第二敲急促/第三敲开门（回敲落在真实门扇/门缝下段，门中心不被覆盖，开门不退化）。
  - `v43-05-threshold-knock1-mobile-390x844.png` / `v43-06-threshold-knock3-mobile-390x844.png`：移动第一敲/第三敲（≥44px、零溢出）。
  - `v43-07~09-*-1440x1024.png`：三场景桌面（图+三画面热点首屏）。
  - `v43-10~12-*-mobile-390x844.png`：三场景移动（图+三热点 ≥44px）。
  - `v43-13-counter-knock-gallery-short-1440x800.png`：场景短桌面。
  - `v43-14~16-counter-*-feedback-1440x800.png`：三处首页回敲反馈态（逐字+窗口同拍隐藏）。
  - `v43-17~19-*-feedback-1440x800.png`：三场景各一条动作反馈态（逐字+节拍锁）。
  - `v43-20-directory-knocknet-1440x800.png`：目录 02γ/02δ/02ε。
  - `v43-21-remembrance-knocknet-1440x800.png`：痕迹单行 + 8 卡。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v43 段（资产/三回敲出厂态与位置契约/窗口生命周期/守卫顺序/三场景结构/状态容错/九动作逐字/v31 窄例外/目录痕迹/文档同步）；SCENES 清单加三场景。

## 本轮新增：v42 守则漂移 / THE PROTOCOL DRIFT（v41 两间背室解锁第四入口 + 四拍巡查判断）

- 目标：不再追加固定长链——v41 三间背室任见两间后，同一块守则板顶部旧蜡印显露第四入口「巡查」；玩家反复面对同一块布告板，本拍可能完全正常，也可能只有红线、空名牌或无舌铃一处变异；直接点击画面里认为异常的器物，没有异常就点旧蜡印继续；连续三次正确完成一轮，误判被送进与误判位置对应的 v41 房间。没有确认、下一步、继续按钮。
- 解锁与入口（CDP 逐条实测）：只读 v41 visited（0/1/2/3 间分别 hidden/hidden/visible/visible，进 protocol 即时重估，v41 键字节级不变）；`#protocol-hotspot-drift` 覆盖真实旧蜡印（aria「按下访客守则上沿的旧蜡印，检查布告板是否发生漂移」、短标签「巡查」、反馈「旧蜡印比上一次更软。布告板要求你证明，自己还记得它原来的样子。」逐字，≥44px）；与八条守则及 v41 三入口共用 protocol 首选锁（双向实测）；玖语义不变（实测）；处理器在任何副作用前校验 `currentScene === "protocol"`。
- 巡查台与四拍（CDP 逐条实测）：`#protocol-drift` 单行状态读数「连对 X / 3 · 最佳 Y / 3 · 正确 C · 误报 M」；基准拍直接复用原板 WebP，三变异拍（第九绳结/半开空名牌悬取物牌/渗液无舌铃口）同屏对照除指定异常外镜头、板体、横条、墙面、管线、光线一致（逐张目验，移动中央裁切三异常区与蜡印同画面）；四判断热点覆盖真实区域（≥44px，Tab 红线→空名→铃钮→未见漂移→退回守则）；固定错位序列按 `(cycle*3+cursor)%8` 推导；四种正确判断逐字反馈且只计一次，未满 3 同 hash 真实换图、焦点回第一判断热点；第三次正确四类完成反馈与四目的地逐条真实 UI 验证；normal 三误报、三异常漏报、异常错报另一位置（反馈点名真实异常仍留原处）逐字并真实落入对应 v41 房间；同拍竞争只接受第一项。
- 状态（CDP 逐条实测）：独立容错 `goddead_v42_protocol_drift`——数字裁 9999、cursor 0–7、streak/bestStreak 0–3 且 best 不小于 streak、lastRound/lastAnswer 组合非法清空、pending 与固定规则表逐字段一致（伪造 feedback/target/nextCursor/round 错配全部清空）；坏 JSON/数组错型归一；完成拍落地连对归零（smoke 复现后修）；timer 触发前清 pending；reload 正确拍/完成拍内重播逐字反馈并恢复动作不重复计数；离场保留合法 pending、重返重播续走；reduced-motion 缩短节拍保留顺序；判断 handler 在任何副作用前校验 `currentScene === "protocol-drift"`（三向隐藏热点零副作用）；v28–v41 与主线字节级不变、v41 只读。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `02β / 守则漂移`；Remembrance 单行 `#drift-memory`（「守则漂移：巡查 N 次；正确 C 次；最佳连对 B/3；误报 M 次。」），严格 8 卡；遗忘清除 v42 键、目录入口与记忆行，保留既有 v41 清理语义。
- 布局（逐张目验）：1440×1024 标题/说明/状态行/整块巡查图/四热点首屏；1440×800 状态行与整图首屏、四热点 ≥44px；390×844 标题/状态行/图/四热点首屏、中央裁切三异常区与蜡印同画面、零横向溢出；反馈锚在巡查图内下缘任何视口可感知。
- CDP 功能冒烟（`/tmp/goddead-qa/v42-protocol-drift-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**94/94 连续两次全绿**（exit 0）：A 解锁/入口/首选锁/玖/键盘/直 hash（16 项）；B 四拍正确判断+换图节拍+四类三连完成（22 项）；C 误判九组合（18 项）；D 同拍竞争与键盘（4 项）；E currentScene 守卫（6 项）；F 容错（13 项）；G reload/离场（8 项）；H reduced-motion（1 项）；I 隔离（1 项）；J 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v42-protocol-drift-visual.mjs` **25/25 通过**，均经逐张目验）：
  - `v42-01~04-drift-*-1440x1024.png`：基准+三变异桌面（正确拍图、四热点首屏）。
  - `v42-05~08-drift-*-mobile-390x844.png`：基准+三变异移动（中央裁切异常可辨、四热点 ≥44px）。
  - `v42-09-drift-short-1440x800.png`：短桌面。
  - `v42-10-protocol-drift-unlocked-1440x800.png`：入口解锁（巡查覆盖旧蜡印）。
  - `v42-11-drift-correct-feedback-1440x800.png` / `v42-12-drift-misreport-feedback-1440x800.png` / `v42-13-drift-completion-feedback-1440x800.png`：正确/误判/三连完成反馈态（逐字、状态行进位、节拍锁）。
  - `v42-14-directory-drift-1440x800.png`：目录 02β。
  - `v42-15-remembrance-drift-1440x800.png`：痕迹单行 + 8 卡。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v42 段（资产/基准复用/入口/巡查台结构/固定序列/反馈逐字/状态容错与 pending 逐字段/streak 完成归零/守卫位置/目录痕迹/文档同步）；SCENES 清单加 protocol-drift、remembrance 治理同步窗口放宽至 600 字符。

## 本轮新增：v41 守则背室 / THE ROOMS BEHIND THE PROTOCOL（布告板三入口 + 三间画面热点背室）

- 目标：把第二幕 `#protocol` 的访客守则布告板本身变成可探索的空间机关——保留八条守则、原文、分流、玖异常与布告板素材，在原图真实红线结/空白铭牌/黄铜铃钮上叠加三个原生热点，通往三间互相连通并回接走廊/归路核验/门外代审/午夜回拨/守则页的真实房间；没有确认、下一步或继续按钮。
- 布告板与三入口（CDP 逐条实测）：`assets/visitor-protocol-board.webp` 未替换未改图；红线（aria「顺着访客守则左侧交叉的红线进入登记室」，反馈「红线从八条守则背后抽紧。布告板让出一条只容卷宗通过的缝。」→ `#red-thread-registry`）、空名（aria「按下守则布告板下方没有姓名的长牌」，反馈「空白名牌记住了你的按痕，却仍拒绝写出名字。」→ `#blank-name-cloakroom`）、无舌铃（aria「按下守则布告板右下方不会发声的黄铜铃钮」，反馈「铃钮陷进墙里。没有铃声，接待台却已经叫到你。」→ `#clapperless-bell-desk`）；与八条守则共用 `protocol` 首选锁（双向实测）；反馈写入独立的 `#protocol-backroom-response`（锚在布告板图内底部，任何视口首屏可感知），不复用守则 toast；玖异常与 `#ninth` 原语义不变（实测非窗口点击原文反馈，v41 不介入）；click/Enter/Space、≥44px、干净存档可发现。
- 三间背室（CDP 逐条实测）：红线登记室/空名寄存处/无舌铃接待台（kicker/说明逐字），各三个覆盖真实器物的画面热点（松线轴→`#blank-name-cloakroom`、见证印→`#return-audit`、线后门→`#corridor`、无主外套→`#proxy-admission`、挂起名字→`#red-thread-registry`、无号取物牌→`#clapperless-bell-desk`、按无舌铃→`#midnight-callback`、柜下传声管→`#blank-name-cloakroom`、拉红绳→`#protocol`），独立 `.backroom-hotspot` class 与 v40 解耦，≥44px，Tab 左→右，零卡片清单、零 SVG；九动作逐字反馈全部真实 UI 实测；第一项锁+同节拍竞争只记一次（实测）。
- 守卫（CDP 逐条实测）：布告板入口在任何副作用前校验 `currentScene === "protocol"`；九动作在任何状态访问前校验 `currentScene === BACKROOM_SCENE_NAME[sceneKey]`；protocol 触发隐藏 child 热点、child 场景触发隐藏布告板热点、跨两隐藏 child scene 同拍触发全部零副作用（v41 键字节级不变、无反馈、beat 窗口后无幽灵跳转）；active 场景合法热点仍只接受第一项。
- 状态（CDP 逐条实测）：独立容错 `goddead_v41_protocol_backrooms`——visited 三布尔键、entry 七值白名单、pending 四字段严格对应（伪造 target/feedback 清空不重播）、lastScene/lastAction 互相匹配、traversals 裁 9999、marks 12 项白名单；坏 JSON/数组错型归一；不读写 v28–v40 与主线（字节级一致）；timer 触发前清 pending；reload 反馈拍重播逐字反馈并恢复转场；离场清 timer 保留合法 pending、重返原场景重播续走、不重复计数；reduced-motion 缩短延迟保留节拍；直 hash 三背室只记 visited 不自动动作。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `01ψ / 红线登记`、`01ω / 空名寄存`、`02α / 无舌铃台`；Remembrance 单行 `#backroom-memory`（「守则背室：穿行 N 次；红线 / 空名 / 无舌铃已见 X/3。」），严格 8 卡；遗忘清除 v41 键、三目录入口与记忆行。
- 布局（逐张目验）：protocol 1440×1024 标题+布告板+三热点+前两条守则首屏（高桌面压缩布告板与页眉间距）；1440×800 两栏短桌面右栏 350px、三热点 ≥44px 不压其一；390×844 标题+布告板首屏、三热点上下错开 ≥44px 零溢出；三背室桌面/移动/短桌面图与三热点全部首屏。
- CDP 功能冒烟（`/tmp/goddead-qa/v41-protocol-backrooms-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**75/75 连续两次全绿**（exit 0）：A 布告板未替换+三入口逐字反馈/首选锁双向/玖不变/键盘（16 项）；B 九动作逐字反馈与真实目的地（19 项）；C 三场景画面热点（3 项）；D currentScene 守卫（8 项）；E 容错（10 项）；F 同节拍竞争（2 项）；G reload/离场/直 hash（8 项）；H reduced-motion（1 项）；I 隔离（1 项）；J 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v41-protocol-backrooms-visual.mjs` **23/23 通过**，均经逐张目验）：
  - `v41-01-protocol-board-1440x1024.png` / `v41-02-protocol-board-1440x800.png` / `v41-03-protocol-board-mobile-390x844.png`：守则布告板三视口（原图未替换、三入口贴合真实器物、≥44px、前两条守则首屏）。
  - `v41-04~06-*-1440x1024.png`：三背室桌面（图+三画面热点首屏）。
  - `v41-07~09-*-mobile-390x844.png`：三背室移动（图+三热点 ≥44px）。
  - `v41-10-red-thread-registry-short-1440x800.png`：背室短桌面。
  - `v41-11-protocol-thread-entry-1440x800.png`：红线入口反馈态（逐字，布告板图内首屏可感知）。
  - `v41-12-thread-seal-feedback-1440x800.png`：见证印动作反馈态（逐字+节拍锁）。
  - `v41-13-directory-backrooms-1440x800.png`：目录 01ψ/01ω/02α。
  - `v41-14-remembrance-backrooms-1440x800.png`：痕迹单行 + 8 卡。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v41 段（资产/布告板未替换/三入口/独立反馈元素锚点/三背室结构/状态容错/双守卫位置/九动作逐字/首选锁/目录痕迹/文档同步）；SCENES 清单加三场景。

## 本轮新增：v40 门外侧廊 / THE LATERAL CORRIDORS（首页纵深环境层 + 左右廊热点 + 三个画面热点场景）

- 目标：继续优化最前面的首页——门两侧的黑色留白做成通向门后纵深的左右侧廊；中央门放大约 12%（保留三敲主流程、开门状态与 v31/v38 四热点）；新增左廊/右廊两个空间热点与三间互相连通的真实场景，形成空间网并真实落回 v31/v38/v39 前段区域；没有确认页、下一步、继续按钮、新结局或主线硬门槛。
- 首页视觉（逐张目验）：纵深环境层 `assets/threshold-lateral-hall.webp`（211 KB，Pillow q85，1536×1024；源 PNG 保留）垫在现有 closed/open 门图之下，1440×800 中央门实测 593px（v39 为 520px，+14%）、左右侧廊与旧铜导轨入画、六热点不打架、门中心命中仍是敲门；390×844 门仍是主目标、六热点上下错开触达 ≥44px、零横向溢出；开门状态实测不退化（v40-04）。
- 两个新热点（CDP 逐条实测）：`hotspot-lateral-left`（aria「沿门左侧不发光的灯廊前行」，反馈「左侧黑暗向后退了一步。门没有移动，走廊却从它旁边长了出来。」→ `#unlit-lamp-gallery`，entry=threshold-left，mark enteredLeftCorridor）与 `hotspot-lateral-right`（aria「跟随门右侧先行的影子」，反馈「右侧墙面折进门影。你还站在门外，但影子已经先行。」→ `#borrowed-shadow-gallery`，entry=threshold-right，mark enteredRightCorridor）；与日蚀/符号/回来/代审/三敲共用首选锁（双向实测），Enter/Space 可激活（实测）。
- 三个新场景（CDP 逐条实测）：`#unlit-lamp-gallery`（这里的灯只负责留下影子。照明是另一个部门的事。）、`#borrowed-shadow-gallery`（所有影子都登记过主人。少数主人还没有被制造出来。）、`#hinge-sorting-room`（门板在别处。这里先决定每扇门应该向哪一边承认自己。）；各三个覆盖真实画面器物的原生 button 热点（未亮的灯/地面铜轨/挤出灯排、人的影子/门形的影子/先走的门影、向内铰链/空轴位/向外铰链，≥44px，Tab 从左到右，零底部卡片清单、零内联 SVG）；九动作逐字反馈：触碰未亮的灯→`#borrowed-shadow-gallery`、沿铜轨→`#hinge-sorting-room`、挤出灯排→`#return-passage`、站进人影→`#unlit-lamp-gallery`、推开门形影子→`#hinge-sorting-room`、跟随门影→`#peephole-chamber`、向内铰链→`#glyph-niche`、向外铰链→`#proxy-admission`、空轴位→`#return-audit`，全部真实 UI 实测；第一项被接受后同场景全部热点 disabled（paint 在 schedule 之后，F2 复现后修），同节拍竞争只记一次。
- v31 门前守卫（本轮启用，CDP 逐条实测）：未访问的 `#return-passage`/`#peephole-chamber`/`#glyph-niche` 直达落回门外；真实路径只读放行——v31 热点/守则分流/前段内部动作点击时持久化 visited（RULE_DETOUR 与 chooseForecourt 配套补标），v34/v35/v37/v38/v39 落点读各自 outcome/marks；v40 只放行本轮 lastAction 唯一对应目标（lastAction=peephole 放行窥孔、glyph 仍被拦）。v39 smoke 90/90、v38 smoke 62/62、v37 smoke 64/64 回归不破坏；v36 smoke×2、v37 smoke×1、v36/v37 visual×3 的干净存档直达捷径夹具改为先种 v31 已访问（断言未放宽）。
- 状态（CDP 逐条实测）：独立容错 `goddead_v40_lateral_corridors`——visited 三布尔键、entry 五值白名单、pending 四字段与白名单表严格对应（伪造 target/feedback 清空不重播）、lastScene/lastAction 互相匹配、traversals 裁 9999、marks 11 项白名单；坏 JSON/数组错型归一；不读写 v28–v39 与主线（字节级一致）；pending 只恢复已接受未完成转场、不作计数依据；timer 触发前清 pending；reload 反馈拍重播逐字反馈并恢复转场；离场清 timer 保留合法 pending、重返原场景重播续走；reduced-motion 缩短延迟保留节拍。
- 目录与痕迹（CDP 逐条实测）：首次进入恢复 `01υ / 无灯灯廊`、`01φ / 借影陈列`、`01χ / 铰链分拣`；Remembrance 单行 `#lateral-memory`（「门外侧廊：穿行 N 次；无灯 / 借影 / 铰链已见 X/3。」），严格 8 卡；遗忘清除 v40 键、三目录入口与记忆行。
- CDP 功能冒烟（`/tmp/goddead-qa/v40-lateral-corridors-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**77/77 连续两次全绿（监理发现守卫缺口后由 Kimi 修复并连续两次复跑）**（exit 0）：A 六热点+首选锁双向+键盘（12 项）；B 九动作逐字反馈与真实目的地（19 项）；C 三场景画面热点（3 项）；D v31 窄守卫（5 项）；E 容错（10 项）；F 同节拍竞争与 off-route 守卫（13 项：跨热点连发只记首个+节拍锁、threshold 触发隐藏 child 热点、protocol 同拍触发两个隐藏 child scene 热点与隐藏左右廊热点、child scene 触发隐藏左右廊热点——v40 键字节级不变、无反馈、完整 beat 窗口后无幽灵跳转、active 场景合法热点仍只接受第一项）；G reload/离场（6 项）；H reduced-motion（1 项）；I 隔离（1 项）；J 目录/痕迹/遗忘（7 项）；Z 控制台零异常（1 项）。
- 监理发现后由 Kimi 修复并复跑（独立验收发现后修）：off-route 脚本化点击缺口——child action 与首页左右廊热点原先无 currentScene 守卫，隐藏 DOM 按钮可被脚本越场景写状态并排 timer（不同 sceneKey 不同 timer key 可同拍双写）；现为 child action 在任何副作用前校验 `currentScene === LATERAL_SCENE_NAME[sceneKey]`、左右廊热点校验 `currentScene === "threshold"`（静态断言锁定守卫位于状态读写与 schedule 之前）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v40-lateral-corridors-visual.mjs` **25/25 通过**，均经逐张目验）：
  - `v40-01-threshold-lateral-1440x800.png` / `v40-02-threshold-lateral-1440x1024.png` / `v40-03-threshold-lateral-mobile-390x844.png`：首页门放大+侧廊入画+六热点（≥48/44px）。
  - `v40-04-threshold-door-open-1440x800.png`：开门状态不退化。
  - `v40-05~07-*-1440x1024.png`：三场景桌面（图+三画面热点首屏）。
  - `v40-08~10-*-mobile-390x844.png`：三场景移动（图+三热点 ≥44px）。
  - `v40-11-borrowed-shadow-gallery-short-1440x800.png`：场景短桌面。
  - `v40-12-lamp-rail-feedback-1440x800.png`：铜轨动作反馈态（逐字+节拍锁）。
  - `v40-13-left-corridor-feedback-1440x800.png`：左廊入口反馈态。
  - `v40-14-directory-lateral-1440x800.png`：目录 01υ/01φ/01χ。
  - `v40-15-remembrance-lateral-1440x800.png`：痕迹单行 + 8 卡。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v40 段（资产/场景结构/状态容错/九动作逐字/首选锁/pending 四字段/v31 守卫窄例外/文档同步）；既有「forecourt 无守卫」断言改为断言守卫新契约、SCENES 清单加三场景。

## 本轮新增：v39 归路核验站 / THE ROUTE-OF-RETURN AUDIT（守则其五 + 三岔枢纽任选两条 + 每条两判断）

- 目标：把内容继续压在游玩前段——守则其五从只显示一句反馈升级为真实分流入口；玩家在可自由选择顺序的三岔枢纽里任选两条路线核验，一次判断后自动返回枢纽，第二条判断完自动结算、自动分流；没有下一步/确认/继续按钮，没有新结局。
- 场景与素材：`#return-audit`（归路核验站）+ `#echo-turn`（回声岔廊）+ `#vein-turnstile`（血管检票闸）+ `#confession-locker`（忏悔寄存所）原生 SPA 场景，沿用 `.scene-branch` 视觉语言，零内联 SVG、零占位图。四张监理源 PNG（`design-references/source-*.png`，保留）经 Pillow quality=85 转码 1536×1024：`assets/return-audit-hall.webp`（207 KB）/ `return-audit-echo.webp`（210 KB）/ `return-audit-vein.webp`（182 KB）/ `return-audit-confession.webp`（211 KB）。枢纽三岔口与三路线各自轮廓一眼可分，移动中心裁切保留核心器物（逐张目验）；图内无可读文字、数字、UI。
- 守则其五（CDP 逐条实测）：原文「回声、血管与忏悔都可以进入。进去之前，确认你还记得回来的路。」与反馈「回来的路，你还记得吗？」逐字不变，仅目的地变更（entry=protocol，mark answeredProtocolFive）；首选锁实测其五接受后其二不得抢占；其一主线走廊实测不回归；直接 hash `#return-audit` 只记 visited（entry=direct），2.5s 内不自动选路线。
- 枢纽与三路线（CDP 逐条实测）：三路线卡（进入回声岔廊 / 通过血管检票闸 / 打开忏悔寄存柜，hint 逐字）任意顺序选两条（实测先选第二卡）；选路立即反馈并自动进入对应区域；已完成路线 disabled + aria-pressed；每条路线两个判断逐字即时反馈（跟随最先出现的回声✓/跟随最响的回声✗、趁苍白停搏穿过✓/跟着红色脉冲前进✗、领取空白寄存牌✓/领取写着自己的那枚✗）；第一次被接受即锁定该区域两按钮，同节拍无间隔连发与跨按钮竞争只记一次（实测）；第一条判断后自动回 hub、不替玩家选第二条（实测），焦点落到第一个未完成路线卡（实测）；第二条先保留路线即时反馈一拍、回 hub 换结算反馈一拍、再自动转场。
- 五档真实 UI 结算（全程点击，非种子）：2 归路证/0 迷步 → verified → `#protocol`；0/2 → lost → `#return-passage`；1/1 错在 echo → echoed → `#echo`、错在 vein → pulsed → `#vein`、错在 confession → confessed → `#confession`（设计文档 `#echo-archive`/`#vein-maintenance-well`/`#confession-weighing-room` 即 v29 既有三支线场景；v29 支线守卫仅加本轮 v39 outcome 窄例外，其余未访问直达仍落回走廊）；逐字反馈实测。
- 状态（CDP 逐条实测）：独立容错 `goddead_v39_return_audit`——order 白名单去重 ≤2，decisions 只接受按 order 形成的连续合法前缀（off-route/跳位决策全部丢弃，实测），recall/misstep/wrongRoute/settled/outcome 全部由合法 decisions 重算（伪造 outcome「lost」实测重算为 verified 并落 protocol），settleDone 只标记结算副作用、arrivalPending 只标记结算转场（伪造 settleDone 实测归一），pendingRoute 只能是未完成白名单 route，数值裁 9999（1e18/-3 实测 9999/0），marks 白名单；坏 JSON/数组错型安全归一；不读写 v28–v38 与主线（种子快照字节级一致）；刷新恢复 pendingRoute/已完成列表/结算节拍（结算节拍内刷新仍重播结算反馈、完成转场且只结算一次；判断即时反馈拍内刷新路线场景重播逐字反馈并续走回程/结算，副作用严格一次）；judgeAudit 只接受当前场景对应且 pendingRoute 合法的 route（程序化 off-route/隐藏按钮不得推进）；离场清节拍 timer 无幽灵回跳；遗忘同步清除；目录恢复 `01τ / 归路核验`，Remembrance 单行 `#audit-memory`（「归路核验：完成 N 轮核验；最佳归路 X。」），严格 8 卡。
- 布局与无障碍：枢纽桌面 1440×1024 首屏（核验签/母图/三路线卡），短桌面 1440×800 母图让位三卡首屏，移动 390×844 母图压低保留身份、三卡首屏可点（触达 ≥44px、零横向溢出）；三路线场景桌面/移动/短桌面两判断全部首屏可点；Enter/Space 与点击一致（实测）；reduced-motion 缩短延迟但保留即时反馈→结算反馈两段节拍（实测）。
- CDP 功能冒烟（`/tmp/goddead-qa/v39-return-audit-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**90/90 连续三次全绿（监理复跑修复后）**（exit 0）：A 其五原文/反馈逐字+首选锁+其一回归（7 项）；B 直 hash 不自动选路（3 项）；C 任意顺序+第一判断自动回 hub+焦点落位（9 项）；D 五档真实 UI 结算+两段节拍（14 项）；E 新 cycle 与累计（4 项）；F 刷新恢复（13 项：pendingRoute/1/2/结算节拍 + 第一/第二条判断拍内 reload 重播即时反馈并续走 回程/结算/目的地、副作用严格一次）；G 离场清 timer（4 项）；H 同节拍竞争与程序化守卫（7 项：跨按钮连发只记首个+节拍锁、off-route/隐藏按钮不得推进、直 hash 子场景归一后可判）；I 容错（10 项）；J reduced-motion（2 项）；K 键盘（5 项：稳定后按键、重试不重复判定）；L v28–v38+主线字节级隔离（1 项）；M 目录/痕迹/遗忘（6 项）；Z 控制台零异常（1 项）。
- 监理复跑修复（独立验收 72/76 后修，仍全部真实通过）：① 生产 reload 窗口——判断写入后回程/结算 timer 只在内存，即时反馈拍内刷新路线场景会卡住；enterAuditRoute 对已判断 route 重播逐字即时反馈并重新排定回程/结算（settleDone 保证副作用一次）；② 生产守卫——judgeAudit 只接受当前场景对应且 pendingRoute 合法的 route，程序化 off-route/隐藏按钮不得推进；③-⑤ 夹具稳定性——C8 等待真实焦点稳定、H2 跨按钮连发坐标一次取定、K2/K3 场景/veil/按钮稳定后按键（重试不重复判定）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v39-return-audit-visual.mjs` **28/28 通过**，均经逐张目验；settle 条件 = scene active + veil 释放 + .reveal 全部 in + 可见素材解码完成 + 截图前绘制帧）：
  - `v39-01-return-audit-1440x1024.png` / `v39-02-return-audit-mobile-390x844.png` / `v39-03-return-audit-short-1440x800.png`：枢纽桌面（核验签+母图+三卡首屏）/移动（母图保留身份、三卡首屏 ≥44px）/短桌面（母图让位、三卡首屏）。
  - `v39-04-echo-turn-1440x1024.png` / `v39-05-vein-turnstile-1440x1024.png` / `v39-06-confession-locker-1440x1024.png`：三路线场景桌面（图+两判断首屏）。
  - `v39-07-echo-turn-mobile-390x844.png` / `v39-08-vein-turnstile-mobile-390x844.png` / `v39-09-confession-locker-mobile-390x844.png`：三路线场景移动（图+两判断首屏 ≥44px）。
  - `v39-10-echo-turn-short-1440x800.png`：路线场景短桌面。
  - `v39-11-settle-verified-1440x800.png` / `v39-12-settle-lost-1440x800.png` / `v39-13-settle-echoed-1440x800.png` / `v39-14-settle-pulsed-1440x800.png` / `v39-15-settle-confessed-1440x800.png`：五档结算反馈态（枢纽抢帧，卡 disabled、反馈逐字）。
  - `v39-16-rule-five-entry-1440x800.png`：守则其五入口反馈态。
  - `v39-17-directory-audit-1440x800.png`：目录 01τ 恢复可见。
  - `v39-18-remembrance-audit-1440x800.png`：痕迹页归路单行 + 8 卡网格。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v39 段——四张 WebP 存在与引用、四张源 PNG 保留、四场景结构与逐字文案与无继续按钮、目录 01τ、痕迹单行、8 卡、其五原文/反馈、状态容错与 decisions 连续前缀重算、五档反馈/目的地、v29 守卫窄例外、select/judge/settle/enterAudit 守卫、缓存 v39、文档同步；既有 RULE_DETOUR 断言与 v29 守卫断言同步新形态、SCENES 清单加四场景。

## 本轮新增：v38 门外代审窗 / THE PROXY ADMISSION WINDOW（门板第四热点 + 守则其八 + 三问两判）

- 目标：把内容拉回首页与访客守则——门板第四热点与守则其八双入口进入门外代审窗，替门后机构审查三名夜访者；自由问讯后直接判断，第三人自动结算分流；没有确认页、底部继续按钮、新结局或主线硬门槛。
- 场景与素材：`#proxy-admission`（门外代审窗）原生 SPA 场景，沿用 `.scene-branch` 视觉语言，零内联 SVG、零占位图、零 CSS 人物。五张监理源 PNG（`design-references/source-*.png`，保留）经 Pillow quality=85 转码 1536×1024：`assets/proxy-admission-window.webp`（149 KB）/ `proxy-visitor-nurse.webp`（146 KB）/ `proxy-visitor-postman.webp`（147 KB）/ `proxy-visitor-umbrella.webp`（146 KB）/ `proxy-visitor-widow.webp`（145 KB）。四访客图同问讯窗景别、主体居中偏上，证据怪异但需结合问讯文字判断（护士影子同步 / 邮差影子先递信 / 信使门环投影同步 / 妇人空臂影子抱婴），移动中心裁切保留脸、手与关键异常（逐张目验）；图内无可读文字、数字、UI。
- 两入口（CDP 逐条实测）：门板第四热点「代审」（门板下方偏中，干净存档立即可发现、可 Tab/Enter/Space，反馈「门缝从里面拉开。值班员把你的影子登记成了代理人。」→ `#proxy-admission`，entry=threshold；与门外三热点及三次敲门共用首选锁——热点接受后敲门忽略、三敲接受后热点忽略，门中心命中链实测不被遮挡）；守则其八加入 `RULE_DETOUR`——原文、删除线/强调样式与反馈「确认无效。」逐字不变，仅目的地变更（entry=protocol，其一主线与其六回拨实测不回归，「玖」异常不动）。
- 三问两判（CDP 逐条实测）：每轮当前一名访客（大图/称谓/首句陈述）；三项问讯只展开逐字证词并记录 questioned（pressed 保留、重复询问只重播短声音不重复累计、已问计数不加分）；两个判断第一次被接受即锁定当前访客全部问讯与判断按钮（连点与竞争只记一次）；逐字反馈约 0.9–1.2s（reduced-motion 0.3s，实测）后自动换下一人；第三人先给判断反馈一个节拍、再换结算反馈并转场，全程无下一位/确认/继续按钮。
- 四档真实 UI 结算（全程点击，非种子）：全对 6/0 → verified → `#protocol`；误拒在场者 4/1 → paranoid → `#peephole-chamber`；误放回声 4/1 → contaminated → `#return-passage`；0–2/2–3 → unnamed → `#glyph-niche`；逐字反馈、计分与错误类型（admittedEcho/rejectedPresent）实测。
- roster 与状态：四轮确定性矩阵按（入口行 + cycle）循环移位（threshold/protocol/direct 行 0/1/2，实测三轮换、刷新不换人）；独立容错 `goddead_v38_proxy_admission`——**decisions 只接受当前 roster 内按顺序形成的连续已判断前缀**（off-roster 与跳位决策全部丢弃、不得推进 index/计分，questioned 同步丢弃 off-roster 数据，实测），proof/doorDebt/admittedEcho/rejectedPresent/outcome 全部由合法 decisions 重算（伪造 99/99 实测重算为合法值），**settled 完全由三条有效 decisions 推导**（raw.settled 不被信任；三判 + settled=false 实测自动修复并随下一次保存持久化），settle 副作用以独立 `settleDone` 标记只执行一次；roster 三项白名单去重错型重建，数值有限非负裁 9999；坏 JSON、数组错型、非法 roster/decisions/outcome、NaN/Infinity/负数/超大数字全部安全归一（实测）；不读写 v28–v37 与主线（含 v37 pending 批次种子快照字节级一致，实测）；刷新恢复当前访客/问讯展开/已判不重复（实测）、离场清节拍 timer 不幽灵换人（实测）、遗忘同步清除（实测）。
- 实现期真实修复（smoke 复现后修）：① 入口登记时 roster 先按默认 direct 生成再写 entry——改为新 cycle 未开始时 roster 按当前 entry 重建；② 判定后 index 立即 +1 使下一位访客提前上屏且节拍守卫失效——改为先排定步进 timer 再重绘，节拍内仍显示刚被判访客并锁死其按钮；③ 第三人判定分支误用判定前的 index——改为按判定后 decisions 数结算；④ 第三人判定反馈被结算反馈同帧覆盖——改为两节拍（判断反馈一拍、结算反馈一拍后转场，监理复核要求保留可感知节拍，smoke 新增 E11b/E13a–c 断言验证两段反馈先后出现且无新增按钮）；⑤ 监理复审发现 decisions 白名单过宽（off-roster/跳位决策可推进计分）——改为仅接受当前 roster 连续前缀；⑥ 同复审发现 settled 依赖 raw.settled（三判 + settled=false 会全锁不结算）——改为 settled/outcome 完全由有效 decisions 推导，settle 副作用改由独立 settleDone 标记防重；⑦ 监理独立复跑 61/62，唯一失败 E2「节拍内快速对立点击只记一次」——定位为夹具竞态而非生产锁缺陷（夹具固定 sleep 累计约 790ms 逼近 proxyDelay 最短 900ms，末次派发可能落在合法换人之后；生产节拍锁复核无误），E2 重写为先断言节拍内按钮全部 disabled、再以 CDP Input.dispatchMouseEvent 同坐标无间隔连发 4 组点击，断言只记一次且换人后正常可判；生产代码未改，修复后 62/62 连续三次稳定。
- 布局与无障碍：桌面 1440×1024 首屏（代审簿/母场景图/当前访客/三问两判），短桌面 1440×800 母场景图让位全控件首屏，移动 390×844 紧凑布局当前访客+三问+两判全部首屏可点（触达 ≥44px、零横向溢出）；门板热点触达 ≥48px；Tab 顺序三问→准许→留在门外；Enter/Space 与点击一致（实测）；hover/focus 只反馈不判断；图片显式尺寸、异步解码、移动中心裁切、换图先隐旧图不闪白；静音、标题聚焦、滚动归顶、veil 与 AutoAdvance 生命周期沿用现有契约。
- CDP 功能冒烟（`/tmp/goddead-qa/v38-proxy-admission-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**62/62 连续三次全绿（监理复跑修复后复测稳定）**（exit 0）：A 四热点可发现+首选锁+三敲不回归（8 项）；B 其八入口与守则回归（4 项）；C 直 hash 不自动问讯判断（2 项）；D 三问证词/pressed/去重/不加分（5 项）；E 四档真实 UI 结算+第三人反馈节拍+节拍内无间隔连发对立点击只记一次（E2，节拍锁 disabled 前置证明）（15 项）；F 新 cycle 与四轮 roster（3 项）；G 刷新恢复（2 项）；H 离场清 timer（3 项）；I 容错与 decisions 重算持久修复+off-roster/跳位决策丢弃+三判 settled=false 自动修复（8 项）；J reduced-motion（2 项）；K v28–v37+主线字节级隔离（2 项）；L 目录/痕迹/遗忘（6 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v38-proxy-admission-visual.mjs` **26/26 通过**，均经逐张目验；settle 条件 = scene active + veil 释放 + .reveal 全部 in + 可见素材解码完成 + 截图前绘制帧）：
  - `v38-01-threshold-four-hotspots-1440x800.png` / `v38-02-threshold-four-hotspots-mobile-390x844.png`：首页四热点桌面与移动（≥48px、门中心命中不被遮挡）。
  - `v38-03-proxy-admission-1440x1024.png` / `v38-04-proxy-admission-mobile-390x844.png` / `v38-15-short-desktop-proxy-1440x800.png`：代审窗桌面/移动/短桌面全控件首屏。
  - `v38-05~08-visitor-*-1440x1024.png`：四名访客桌面状态（大图/称谓/首句陈述逐字）。
  - `v38-09-questions-expanded-1440x1024.png`：三问证词全部展开逐字。
  - `v38-10-settle-verified-1440x800.png` / `v38-11-settle-paranoid-1440x800.png` / `v38-12-settle-contaminated-1440x800.png` / `v38-13-settle-unnamed-1440x800.png`：四档结算反馈态（第三人真实点击后抢帧）。
  - `v38-14-rule-eight-entry-1440x800.png`：守则其八入口反馈态。
  - `v38-16-directory-proxy-1440x800.png`：目录 01σ 恢复可见。
  - `v38-17-remembrance-proxy-1440x800.png`：痕迹页代审单行 + 8 卡网格。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v38 段——五张 WebP 存在与引用、五张源 PNG 保留、代审窗结构与代审簿 ID、三问两判逐字与无继续按钮、访客图 eager、第四热点与样式、其八原文/反馈、状态容错与 decisions 重算、roster 矩阵白名单性质与确定性移位、四访客档案逐字、问讯守卫与不加分、判定首选锁与一人一判、第三人结算一次与四档反馈/目的地、enterProxy 新 cycle、目录 01σ、痕迹单行、8 卡、缓存 v38、文档同步；既有 RULE_DETOUR 断言同步新映射、remembrance 治理同步窗口随记忆行增长放宽至 500 字符。

## 本轮新增：v37 午夜回拨台 / THE MIDNIGHT CALLBACK DESK（其六分流 + 三线现场回拨）

- 目标：把守则其六从固定去走廊改成真实可玩的早期分支，并让回返夹道与 v35 三间值班房形成可往返的横向网；玩家接两条夜间来电、亲自去现场、从现场回拨；全程「点击即执行 → 看见反馈 → 自动转场」，没有确认页、底部继续按钮或新结局。
- 场景与素材：`#midnight-callback`（午夜回拨台）原生 SPA 场景，沿用 `.scene-branch` 与 v34/v36 卡片语言，零内联 SVG、零占位图。四张监理源 PNG（`design-references/source-*.png`，保留）经 Pillow quality=85 转码 1536×1024：`assets/midnight-callback-desk.webp`（152 KB）/ `callback-bellless-ward.webp`（152 KB）/ `callback-seeping-records.webp`（185 KB）/ `callback-reverse-laundry.webp`（194 KB）。三线路近景同灯位、核心听筒居中，移动中心裁切一眼可分（逐张目验）；图内无可读文字、数字、UI。
- 两入口（CDP 逐条实测）：守则其六加入 `RULE_DETOUR`——原文与反馈逐字不变，仅目的地改 `#midnight-callback`（entry=protocol，mark answeredProtocolSix；其一仍进走廊主线实测，「玖」异常路径不变）；回返夹道新增第五动作「接起墙里晚了八分钟的电话」（反馈逐字，entry=passage，与夹道原四动作共用首选锁，竞争动作忽略实测）。
- 三线路与现场回拨（CDP 逐条实测）：接通只写 pending 与 pending mark、不加分值；同一时刻仅一条 pending，另两卡 disabled；到达目标房间后新增第四「现场回拨」动作与既有三动作同屏并共用首选锁（病房 +3/0 → 回台、档案池 +2/+1 → 回台、洗衣房 +1/+2 → 回台）；选既有房间动作离开 pending 保留（实测穿行输液管后回拨仍可用、原反馈/目的地/分值/mark 不变）；回拨成功才入 completedLines、加分值、清 pending 并自动回台；已完成线卡与房间回拨钮 disabled + pressed，不可重复加值（实测）。**v35 结算字段零污染**：接线/回拨全程 v35 signal/debt/completed/settled/outcome/marks 与累计值字节级不变（含活动批次种子快照实测）。
- 三档自动分流（真实 UI 全程点击，无结算按钮/确认页/继续按钮）：病房+档案池（核实 5/线债 1）routeScore 4 → clear → `#anomaly-review`；病房+洗衣房（4/2）→ 2 → uncertain → `#peephole-chamber`；档案池+洗衣房（3/3）→ 0 → contaminated → `#return-passage`；每轮只结算一次（completedRuns/bestRoute 精确更新，三档计数只增一个）；结算后重进回拨台开新 cycle（pending/completed/分值/outcome 清空、累计保留，实测）；污线落回夹道后再点回拨入口必须先开新轮、不重复消费旧 outcome（实测）。
- 状态与隔离：独立容错 `goddead_v37_midnight_callback`（visited 严格布尔、entry 三值白名单、completedLines 白名单去重 ≤2、pending 与 completed 冲突归 none、分值必须由 completedLines 唯一重算——伪造 99/99 实测重算为合法值、**outcome 必须由 completedLines 唯一推导**（ward+records→clear / ward+laundry→uncertain / records+laundry→contaminated），空白或错配存档 outcome 不被信任、settled 不足两条归未结算、marks 八标记白名单、数值有限非负裁 9999/bestRoute 裁 4）；坏 JSON、数组错型、非法 line/outcome、NaN/Infinity/负数/超大数字全部安全归一（实测）；不读写 v28–v36 与主线（字节级一致，实测）；刷新保留 pending/completed 不重复应用（实测）、离场清反馈 timer（实测）、遗忘同步清除（实测）。
- 边界补强（监理预读发现，smoke 前修复）：pending 线路卡重进回拨台后可重新点击——`connectLine` 仅当前 pending 卡可重新接回对应现场（反馈+转场，不重写 mark、不加分值、不影响计数，另外两卡继续 disabled），实测重进后点击已接通线路正常回到病房且分值/计数/mark 全部不变。
- 布局与无障碍：回拨台桌面 1440×1024 首屏（标题/回拨签/母图/三线卡/出口）；移动 390×844 三线紧凑三列全部首屏可点（触达 ≥44px、母场景图让位但线路图身份保留）；回返夹道五动作移动 2×2+独占行首屏可达；三房四动作移动 2×2 紧凑首屏可达；短桌面 1440×800 回拨签与三线卡首屏；Enter/Space 可接线与回拨（CDP 真实键盘实测）；aria-live 只播当前反馈；reduced-motion 缩短转场且反馈完整（实测 <1.5s）。
- CDP 功能冒烟（`/tmp/goddead-qa/v37-midnight-callback-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**64/64 连续两次全绿**（exit 0）：A 其六入口与主线回归（4 项）；B 夹道第五入口+首选锁（4 项）；C 直 hash 不自动接线（3 项）；D 三档组合真实 UI 全流程（16 项）；E 新 cycle 与不重复消费（3 项）；F pending 保留、首选锁与 pending 卡重接现场（8 项）；G 防重复（4 项）；H 刷新/离场（4 项）；I reduced-motion（2 项）；J 容错（7 项）；K v35 结算字段+v28–v34+主线字节级隔离（2 项）；L 目录/痕迹/遗忘（6 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v37-midnight-callback-visual.mjs` **23/23 通过**，均经逐张目验；settle 条件 = scene active + veil 释放 + .reveal 全部 in + 可见素材解码完成 + 截图前绘制帧）：
  - `v37-01-midnight-callback-1440x1024.png` / `v37-02-midnight-callback-mobile-390x844.png`：回拨台桌面与移动，回拨签 + 三线卡全部首屏，线路图身份可辨。
  - `v37-03~05-line-*-pending-1440x800.png`：三条线路 pending 反馈态（卡 pressed + 反馈原文）。
  - `v37-06~08-report-*-1440x800.png`：三个房间现场回拨反馈态（第四动作 pressed + 反馈原文）。
  - `v37-09-settle-clear-1440x800.png` / `v37-10-settle-uncertain-1440x800.png` / `v37-11-settle-contaminated-1440x800.png`：三档结算反馈态（回拨签终值 + 反馈原文；自动转场前抢帧，两张问题帧已重拍复核）。
  - `v37-12-passage-five-actions-1440x800.png` / `v37-13-passage-five-actions-mobile-390x844.png`：回返夹道五动作桌面与移动（2×2+独占行，触达 ≥44px）。
  - `v37-14-rule-six-entry-1440x800.png`：守则其六入口反馈态（原文 touched + 反馈 toast 逐字）。
  - `v37-15-directory-callback-1440x800.png`：目录 01ρ 恢复可见。
  - `v37-16-remembrance-callback-1440x800.png`：痕迹页回拨单行 + 8 卡网格。
  - `v37-17-short-desktop-callback-1440x800.png`：短桌面回拨签与三线卡首屏。
  - `v37-18-ward-mobile-four-actions-390x844.png`：病房移动四动作 2×2 首屏（回拨动作 armed）。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v37 段——四张 WebP 存在与引用、四张源 PNG 保留、回拨台结构与回拨签 ID、三线卡标题/征兆/eager、其六原文/反馈与 RULE_DETOUR 新映射及玖路径不动、夹道第五动作与反馈原文、状态容错（白名单/分值重算/冲突归一/settled 门槛/上限）、connect 首选锁与不加分值、report 首选锁与一次性、三档结算与反馈逐字、enterCallback 新轮与自动结算、房间回拨按钮状态契约、目录 01ρ、痕迹单行、8 卡、缓存 v37、文档同步；v31 段夹道按钮数断言更新为 5、v35 段三房按钮数更新为 4（不掩盖旧行为：v31 原四动作与 v35 原三动作逐字断言全部保持）。

## 本轮新增：v36 夜班登记所 / THE NIGHT-SHIFT REGISTRY（每 cycle 一张值班证 + 三档全部正常可达）

- 目标：修正 v35 暴露的数值假分支（正常游玩只能落 high 档），并把一条新横向通路接回最前段；不加确认页、继续按钮或新结局。
- 场景与素材：`#night-shift-registry`（夜班登记所）原生 SPA 场景，沿用 `.scene-branch` 与 v34 卡片语言，零内联 SVG、零占位图。四张监理源 PNG（`design-references/source-*.png`，保留）经 Pillow quality=85 转码 1536×1024：`assets/night-shift-registry.webp`（178 KB）/ `permit-mute-bell.webp`（206 KB）/ `permit-blank-name.webp`（182 KB）/ `permit-reverse-badge.webp`（222 KB）。三证件同柜台、同机位、同灯位，只换核心物件（无舌黄铜铃 / 空白姓名栏双暗红封蜡 / 反面四门压痕工牌），移动中心裁切均可区分（逐张目验）；图内无可读文字、数字、UI。
- 两入口（CDP 逐条实测）：回返夹道新增第四动作「接住墙缝吐出的值班证」（反馈「墙缝吐出一张盖着明日日期的值班证，背面写着无号层。」→ `#night-shift-registry`，entry=passage，与夹道原三动作共用首选锁）；无号层大厅新增第四去向「敲开夜班登记窗」（反馈「地面少了一块砖，登记窗从下面升了起来。」→ 同前，entry=floor，与三门共用大厅首选锁）。既有动作文字、反馈、mark、目的地、首选锁全部逐字保持（静态锁定 + CDP 抽查 followedInward 与大厅门）。
- 三证件与领取规则（CDP 逐条实测）：无铃证 +2 信号、失名牌 +2 门债、反面工牌 +4 门债；一 cycle 只领一张——第一次合法选择立即写入并加值，三卡竞争点击、快速连点、Enter/Space 重复事件只认第一张（实测）；反馈节拍（reduced-motion 0.3s，实测快速回大厅）后自动回无号层，无确认页/继续按钮；同 cycle 不可再领（实测点击无效），重访三卡 disabled 保留可见、已领卡 aria-pressed=true；从已 settled 状态进入登记所先开 v35 新 cycle 再允许领证（实测 cycle+1、本轮清空、累计保留）。
- **三档正常可达（真实 UI 全程点击，非种子）**：无铃证→换床单+切滚筒 → routeScore 6 → high 进定额电梯（一次性抬回反馈）；失名牌→晾页+切滚筒 → routeScore 2 → review 交复核科并强制 neutral 新轮（v33 状态实测归零重开 + 一次性反馈）；反面工牌→听柜+晾页 → routeScore 0 → debt 坠回回返夹道（一次性门债反馈）；不领证仍 high 4（实测）。**v35「正常只可 high」的数值假分支至此解决。**
- 状态扩展（沿用 `goddead_v35_unnumbered_floor`，不建平行状态）：新增 visited.nightShiftRegistry / permit / permitSignal / permitDebt / permitCycle / permitRuns / muteBellRuns / blankNameRuns / reverseBadgeRuns；旧 v35 存档无迁移安全默认并可正常领证（实测）；permit 与修正值一致性校验、permitCycle 与当前 cycle 不一致即归一 none/0/0（非法组合与过期证件实测）；新 cycle 清空证件、累计领证次数保留；signal/debt 理论上限 12/8（实测裁剪）；坏 JSON、数组错型、非法 permit、NaN/Infinity/负数/超大数全部安全回退；不读写 v28–v34 与主线（种子快照字节级一致，实测）；刷新保留证件不重复应用（实测）、离场清领取 timer（实测）、遗忘同步清除（实测）。
- 布局契约：大厅四去向 2×2 + 缺层电梯独占行——桌面 1440×1024 与移动 390×844 首屏完整看到三房、登记窗、中央电梯五个核心控件（移动紧凑压缩沿用 v35 方案，母图保留、触达 ≥44px、零横向溢出，CDP 逐项断言）；登记所移动三证件紧凑三列全部首屏可点（触达 ≥44px，三卡 eager 解码实测）。
- 目录与痕迹：登记所首次访问后目录恢复 `01π / 夜班登记`，未访问 `hidden` 不可聚焦；Remembrance 只加单行「夜班登记：领证 N 次，无铃 B，失名 M，反面 R。」（干净时隐藏，实测），严格保持 8 卡。
- CDP 功能冒烟（`/tmp/goddead-qa/v36-night-shift-registry-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**57/57 连续两次全绿**（exit 0）：A 两入口+首选锁+原动作不动（9 项）；B 直 hash 不自动领取（3 项）；C 真实 UI 三档路径+不领证 high+重访禁重复（17 项）；D settled 进入先开新轮+新轮再领（2 项）；E 旧存档兼容+容错五组（6 项）；F 刷新/离场（5 项）；G reduced-motion（2 项）；H v28–v34+主线字节级隔离（2 项）；I 目录/痕迹/遗忘（6 项）；J v31/v35 回归抽查（4 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v36-night-shift-registry-visual.mjs` **22/22 通过**，均经逐张目验；settle 条件 = scene active + veil 释放 + .reveal 全部 in + 可见素材解码完成 + 截图前两个绘制帧）：
  - `v36-01-night-shift-registry-1440x1024.png`：登记所桌面，标题/引文/登记签/母场景图/三证件卡全部首屏，无横向溢出。
  - `v36-02-night-shift-registry-mobile-390x844.png`：登记所移动，三证件紧凑三列全部首屏可点，证件物件身份清晰可辨。
  - `v36-03-floor-five-controls-1440x1024.png` / `v36-04-floor-five-controls-mobile-390x844.png`：大厅桌面与移动五核心控件全部首屏（2×2 去向 + 电梯独占行，母图保留）。
  - `v36-05-passage-entry-feedback-1440x800.png` / `v36-06-floor-registry-window-feedback-1440x800.png`：两入口反馈态。
  - `v36-07-claim-mute-bell-1440x800.png` / `v36-08-claim-blank-name-1440x800.png` / `v36-09-claim-reverse-badge-1440x800.png`：三领证反馈态（登记签更新 + pressed + 反馈原文）。
  - `v36-10-settle-high-1440x800.png` / `v36-11-settle-review-1440x800.png` / `v36-12-settle-debt-1440x800.png`：三档真实结算反馈态。
  - `v36-13-short-desktop-registry-1440x800.png`：短桌面三证件首屏无滚动。
  - `v36-14-directory-registry-1440x800.png`：目录 01π 恢复可见。
  - `v36-15-remembrance-registry-1440x800.png`：痕迹页登记单行 + 8 卡网格。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v36 段——四张 WebP 存在与引用、四张源 PNG 保留、登记所结构与登记签 ID、三卡三按钮三征兆逐字与 eager 加载、两入口与 v31 原文保持、permit 白名单/一致性/过期归一、上限 12/8、claimPermit 首选锁与单证语义、enterRegistry settled 先开新轮、paintRegistry 禁重复与 pressed、目录 01π、痕迹单行、8 卡、缓存 v36、文档同步；v31 段夹道按钮数断言更新为 4（不掩盖旧行为：原三动作逐字断言保持）。回归：v35 smoke 79/79、v35 visual 29/29、v34 smoke 89/89、v34 visual 28/28、v33 smoke 87/87、v33 visual 40/40。

## 本轮新增：v35 无号层 / THE UNNUMBERED FLOOR（横向枢纽 + 三间值班房 + 缺层电梯）

- 目标：不再纵向加长单线，在前段网络加入一座可自由选路、可交叉穿行、可中途离开的横向枢纽；不新增确认页、继续按钮或结局。
- 场景与素材：`#unnumbered-floor`（无号层大厅）、`#bellless-ward`（无铃病房）、`#seeping-records`（渗水档案池）、`#reverse-laundry`（逆照洗衣房）四个原生 SPA 场景，沿用 `.scene-branch` 视觉语言，零内联 SVG、零占位图、零 CSS 绘图。四张监理源 PNG（`design-references/source-*.png`，保留）经 Pillow quality=85 转码 1536×1024：`assets/unnumbered-floor.webp`（201 KB）/ `bellless-ward.webp`（181 KB）/ `seeping-records.webp`（213 KB）/ `reverse-laundry.webp`（223 KB）；大厅三门（病房/档案/洗衣）一眼可分、三房核心物件空间分离、移动端中心裁切全部可辨（逐张目验）；黑石/骨瓷/旧黄铜/暗红封蜡体系一致，图内无文字、标牌、UI、人脸。
- 两入口（CDP 逐条实测）：无号前厅新增第五动作「按下电梯里不存在的地下层」（反馈「按钮没有下沉。整座前厅却往上抬了一层。」→ `#unnumbered-floor`，entry=vestibule）；定额电梯新增第四动作「让指针停在没有刻度的层」（反馈「指针越过零，停在一块没有被刻出来的黄铜上。」→ 同前，entry=quota）。既有动作文字、反馈、mark、目的地、首选锁行为全部原样（静态锁定 + CDP 抽查），入口与所在场景共用首选锁（竞争动作忽略，实测）。
- 枢纽与三档结算（CDP 全链路实测）：大厅楼层签（已值班 n/3、楼层信号、门债、最佳路线）；三门始终可选、已完成房间可重访；任意完成两房解锁缺层电梯（出厂 disabled「缺层电梯仍封死」，解锁后「召回没有楼层的电梯」）；`routeScore = max(0, 信号 − 门债)` 三档——≥4 回定额电梯、2–3 交复核科（强制 neutral 新轮，实测 v33 状态归零重开）、≤1 坠回回返夹道；每轮只结算一次（completedRuns/bestRoute 精确更新，三档计数只增一个）；落点一次性结果反馈展示即消费 outcome，不重复（实测）；回大厅开新轮（cycle+1、本轮 completed/signal/debt 清空、累计保留，实测）。
- 六值班三穿行（CDP 逐条实测分值/门债/反馈/目的地）：病房（听无铃床头柜 +2/0→洗衣房 / 换床单 +3/+1→大厅 / 输液管穿行→档案池）、档案池（晾无名页 +2/0→大厅 / 喝渗字 +4/+2→病房 / 档案下沉→前厅）、洗衣房（切滚筒 +2/0→档案池 / 穿工服 +3/+1→大厅 / 刷镜面机舱→失号龛）；同轮同房只结算一次（完成后值班按钮 disabled 保留可见、穿行继续可用），重访禁重复加分（实测），settled 后值班全锁。
- 状态与隔离：独立 `goddead_v35_unnumbered_floor`（visited 四键严格布尔、entry 三值白名单、completed 白名单去重 ≤3、signal/debt 裁本轮理论上限 10/4、cycle 与累计裁 9999、marks 11 标记白名单、outcome 四值白名单、过期组合归一：无 settled 不保留 outcome、settled 不足两房视为过期）；坏 JSON、数组错型、非法 room、非法 outcome、NaN/Infinity/负数/超大数字全部安全回退（CDP 实测）；不读不写 v28–v34 与主线（种子快照字节级一致，实测）；刷新恢复本轮进度不续跑不重复（实测）；离场清 timer（值班窗内离场无幽灵转场，实测）；遗忘重置同步清除（实测）。
- 守卫窄例外：v34 定额电梯守卫仅追加 `floorState.outcome === "high"`（v34 未访问时高信号落点直达电梯，实测）；v33 复核科在 v35 outcome=review 抵达时强制 neutral 新轮（实测）；其它直达守卫零放宽。
- 设计数值观察（**v36 已解决**）：v35 六个既有值班动作任意两房组合的 routeScore 恒为 4，正常游玩只能落 high 档；v36 夜班登记所的三张值班证在本轮基础上各加一次修正（无铃证 +2 信号 / 失名牌 +2 门债 / 反面工牌 +4 门债），使 high 6 / review 2 / debt 0 与不领证 high 4 全部经真实 UI 正常抵达（v36 节实测记录）。
- 目录与痕迹：四房首次访问后目录恢复 `01μ / 无号层`、`01ν / 无铃病房`、`01ξ / 渗水档案`、`01ο / 逆照洗衣`，未访问 `hidden` 不可聚焦；Remembrance 只加单行「无号层值班：完成 R 轮，最佳路线 B，抬回 H 次，门债遣返 D 次。」（干净时隐藏，实测），严格保持 8 卡。
- 无障碍与动效：全部动作为原生 button，Tab/Enter/Space 可用（CDP 真实键盘实测 Enter 值班、Space 结算），移动触达 ≥44px；aria-live 只播当前反馈；reduced-motion 缩短转场且反馈完整（实测 <1.5s）；移动端大厅专项压缩后，三扇门与已启用电梯按钮在 390×844 首屏全部完整可见可点（两房完成态 CDP 逐项断言）；标题聚焦、滚动归顶、静音、veil 生命周期沿用现有契约。
- CDP 功能冒烟（`/tmp/goddead-qa/v35-unnumbered-floor-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**79/79 连续三次全绿**（exit 0）：A 两入口+首选锁+原动作不动（11 项）；B 直接 hash 只记 visited（4 项）；C 自由顺序+六值班+三穿行+两房解锁+high 结算+窄例外+开新轮+重访禁重复（27 项）；D review/debt 两档种子路径（9 项）；E 门/值班首选锁与连点（2 项）；F 刷新恢复（2 项）；G 离场清 timer（3 项）；H 键盘+reduced-motion（3 项）；I 容错（4 项）；J v28–v34+主线字节级隔离（2 项）；K 目录/痕迹/遗忘（6 项）；L v32/v34 回归抽查（4 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v35-unnumbered-floor-visual.mjs` **29/29 通过**，均经逐张目验；settle 条件 = scene active + veil 释放 + .reveal 全部 in + 可见素材解码完成 + 截图前两个绘制帧）：
  - `v35-01-unnumbered-floor-1440x1024.png` / `v35-02-bellless-ward-1440x1024.png` / `v35-03-seeping-records-1440x1024.png` / `v35-04-reverse-laundry-1440x1024.png`：四房桌面，标题/引文/楼层签/母图/三动作全部首屏，无横向溢出。
  - `v35-05-unnumbered-floor-mobile-390x844.png`：移动大厅「两房已完成、电梯已启用」证据——楼层签 2/3，三扇门与「召回没有楼层的电梯」全部完整首屏、触达 ≥44px（移动端专项压缩：顶距/导语/母图高/卡片间隙，母图身份保留，桌面不变；独立视觉对照发现电梯按钮原被首屏底部裁掉，仅此一项修正）。
  - `v35-06-bellless-ward-mobile-390x844.png` / `v35-07-seeping-records-mobile-390x844.png` / `v35-08-reverse-laundry-mobile-390x844.png`：三值班房移动 390×844（@2x），核心物件中心裁切全部可辨（病房床柜管、档案页池井、洗衣筒服镜），首个动作首屏可见、触达 ≥44px。
  - `v35-09-short-desktop-floor-1440x800.png`：短桌面三门与电梯按钮首屏无滚动。
  - `v35-10-vestibule-entry-feedback-1440x800.png` / `v35-11-quota-entry-feedback-1440x800.png`：两入口反馈态（按钮 pressed + 反馈原文）。
  - `v35-12-settle-high-1440x800.png` / `v35-13-settle-review-1440x800.png` / `v35-14-settle-debt-1440x800.png`：三档结算反馈态（楼层签终值 + 结算后电梯重新封死 + 反馈原文）。
  - `v35-15-directory-visited-1440x800.png`：目录 01μ/01ν/01ξ/01ο 恢复可见。
  - `v35-16-remembrance-floor-1440x800.png`：痕迹页无号层单行 + 8 卡网格。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v35 段——四张 WebP 存在与引用、四张源 PNG 保留、四场景结构与楼层签 ID、电梯出厂 sealed、六值班三穿行逐字、首选锁/同轮一次/重访 disabled、两房解锁与三档结算、新轮语义、两入口与首选锁、review 档强制 neutral、high 放行窄例外、容错形式（含 settled/outcome 过期归一）、目录与痕迹单行、8 卡、缓存 v35、文档同步；v32 段前厅按钮数断言更新为 5、v34 段电梯按钮数更新为 4。回归：v33 smoke 87/87（A2 按钮数断言适配前厅第五入口）、v33 visual 40/40、v34 smoke 89/89、v34 visual 28/28。

## 本轮新增：v34 无主估值室 / THE UNCLAIMED VALUATION ROOM（可重复估值支线 + 定额电梯）

- 目标：把 v33 两个结果房接到一条可重复、能主动止损、有组合效果的估值支线；不做另一套二选一辨认题；满额进定额电梯成为新的前段交通节点；不新增结局，不改 v28 治理终局，不把 v33 分数混入 v34。
- 场景与素材：`#unclaimed-valuation`（无主估值室）、`#quota-elevator`（定额电梯）两个原生 SPA 场景，沿用 `.scene-branch` 视觉语言，零内联 SVG、零占位图、零 CSS 绘图。八张监理源 PNG（`design-references/source-*.png`，保留）经 Pillow quality=85 转码 1536×1024：母场景 `assets/unclaimed-valuation-room.webp`（222 KB）、六件证物 `assets/valuation-thirteenth-clock.webp`（199 KB）/ `valuation-tooth-key.webp`（195 KB）/ `valuation-hollow-idol.webp`（215 KB）/ `valuation-black-wax-lung.webp`（212 KB）/ `valuation-unopened-eye.webp`（205 KB）/ `valuation-receipt-bone.webp`（196 KB）、电梯 `assets/quota-elevator.webp`（241 KB）。六件证物同柜台、同镜头高度、同灯位、同骨瓷匣框，只替换中央证物（钟盘 / 齿形钥环 / 坐姿空腔神像 / 黑蜡双肺 / 闭合眼睑 / 退件章骨），桌面 1440×1024 与移动 390×844 卡内裁切均可区分（逐张目验）；图内无可读文字、货币符号或赌场元素。
- 两个第四入口（CDP 逐条实测）：保全库「把未封存的证物送去估值」→ 估值室（entry=vault，初值 0/5/6）；误报井「把一件退件申报成资产」→ 估值室（entry=shaft，初值 1/4/7，退件自带 1 点溢价但封印更脆）。原六个动作逐字、mark、反馈、目的地零改动（静态锁定 + CDP 抽查），第四入口与结果房动作共用各自场景首选锁（入口反馈窗内点旧动作被忽略，实测）。
- 批次轮换：白名单矩阵 A=clock/key/idol、B=lung/eye/bone、C=clock/lung/idol、D=key/eye/bone，按（入口行+cycle）循环移位，禁止裸随机（静态断言矩阵块无 Math.random 并从源码提取验证三项唯一与六件覆盖）；CDP 实测同入口连续两批不同；刷新恢复当前三件、已估值顺序、每项实收、剩余封印与全部一次性效果——ledger 只存已计算结果，重载不重算（实测逐字节一致）。
- 六件证物（CDP 逐条实测）：十三时钟 +2/-1、下一件损耗 -1 最低 0 只作用一次（蜡肺损耗 2→1 实测）；齿门钥 +3/-2、第 N 件被估 +(N-1)（第一件无加成、第二件 +1 实测）；空神像 +4/-3、第三件 +2（合计 +7 实测）；黑蜡肺 +2/-2、未估值项之后各 +1；未睁之眼 +1/-1、只揭示剩余卡（剩余卡显示「预计 +G · 封印 -D」，已估值卡记录不改写，实测）；无主回执骨 +2/0、仅 shaft 入口 +2（双分支反馈逐字）。未估值只显示名称与征兆，估值后卡片保留可见、锁定并显示实收 `+G · 封印 -D`，不消失。
- 交互与结算（CDP 全链路实测）：点击即执行，无确认页、无底部继续按钮；最先被接受的点击锁定该证物，批次锁窗口内连点/竞争动作只记一次（实测）；批次锁 0.7–1.0s（reduced 0.3s）原地解除不切页；至少估值一件后「盖章结算」随时可用（出厂 disabled，第一件后启用；批次锁不阻止盖章，见下方修复）；满额自动进 `#quota-elevator`、未满自动回 `#return-passage` 并展示一次性「估值室退回了这批东西。欠额被写在夹道背面。」（消费 outcome 不重复，实测）、封印归零立即破封自动坠回 `#false-positive-shaft` 并展示一次性「破损证物比工单先落到底部。回收井把裂口登记在你名下。」（实测）；三件全估且封印>0 自动按定额结算，不再要求盖章；每批只允许完成一次，刷新/返回/双击不重复累计（实测）。
- 定额电梯：三动作（把满额证物送进无号货梯→无号前厅 / 沿断开的楼层刻度横移→回返夹道 / 让电梯穿过走廊天花板→走廊）首选锁 + 短反馈 + 自动转场，无继续按钮；守卫仅本轮 outcome=quota 或曾真实到访放行，干净存档直达规范化回 `#unclaimed-valuation` 并同步地址栏（实测）；无新结局。
- 状态与隔离：独立 `goddead_v34_unclaimed_valuation`（visited 两键严格布尔、entry 三值白名单、batch 白名单三项不重复错型按 entry/cycle 重建、opened 限批内唯一 ≤3、ledger 与 opened 一一对应只存 valueGain/damageTaken/effect 已计算值、outcome 四值白名单、marks 11 标记白名单、数值有限非负裁 9999、active/outcome/opened 过期组合归一）；坏 JSON、数组错型、非法 batch、非法 ledger、非法 outcome、NaN/Infinity/负数/超大数字、active+三件过期组合全部安全回退（CDP 九组实测）；不读不写 v28–v33 与主线（种子快照字节级一致，实测）；遗忘重置后 v34 键、目录与记忆行同步清除（实测）。
- v34 阻断性集成修复（冒烟独立复现，最小修复）：① v33 误报井直达守卫与 v34 破封坠井强制落点冲突——vault 入口用户从未到访误报井时，破封转场被守卫拦回复核科；修复为守卫放行追加 `valuationState.outcome === "breach"`（仅本轮破封，不放宽其它直达），v33/v34 静态断言同步。② 盖章守卫原与批次锁同 scope，批次锁窗口内无法盖章，违背设计「估值过一件后随时可以盖章结算」；改为盖章只受跨场景转场锁约束，批次锁仍约束剩余证物。
- 监理复核返工（两处真实缺陷，仅修这两项，玩法/计分/状态结构/其他场景零改动）：
  - ① 证物卡图偶发空白（v34-02 回执骨、v34-03 未睁之眼与回执骨留白）：三张动态卡图原为 `loading="lazy"`，换批/恢复/揭示后加载来不及触发。修复：三张卡图全部 `loading="eager"`；`paintValuationRelics` 换批时先加 `is-loading` 隐去旧图、新图解码完成再现身（缓存命中同步放行）——不留白、不闪旧图、不错位。功能冒烟新增 3 组、视觉 QA 新增 6 组「三卡图 complete + naturalWidth>0 + 可见 + 非 is-loading」断言，覆盖入口/眼睛揭示/状态恢复与各批次。
  - ② 390×844 首屏不达标（原仅首件证物可见）：移动端改紧凑三列证物卡（图高 76px、名称与两行征兆保留、图片身份不删、触达高度 ≥44px），估值签与盖章压缩字距——三件证物与盖章结算全部首屏可见可点、零横向溢出（CDP 逐项断言）；视觉脚本 settle 改按可见素材过滤，截图前等两个绘制帧保证新图真实上屏。重拍 v34-01/02/03/05/07 并与源图同屏目验，六证物全部清晰可辨。
- 目录与痕迹：两房首次访问后目录恢复 `01κ / 无主估值`、`01λ / 定额电梯`，未访问 `hidden` 不可聚焦；走廊不加永久按钮；Remembrance 只加单行「无主估值：完成 N 批，满额 Q 批，破损 B 批，最佳结算 V。」（干净时隐藏，实测），严格保持 8 卡。
- 无障碍与动效：入口/证物/盖章/电梯动作均为原生 button，Tab 顺序与视觉一致，Enter/Space 可激活（CDP 真实键盘实测 Enter 估值、Space 盖章）；已估值证物 disabled 保留可见并显示实收；aria-live 只播本次估值或结算反馈；估值签世界观内化（本批估值/封印完整/本批定额/最佳结算，破损批次小字）；reduced-motion 缩短批次锁且反馈完整（实测）；标题聚焦、滚动归顶、静音、veil 生命周期沿用现有契约。
- CDP 功能冒烟（`/tmp/goddead-qa/v34-unclaimed-valuation-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**89/89 全绿**（exit 0，含入口/揭示/恢复三组三卡图解码可见断言）：A 两入口初值/批次/首选锁/原 v33 动作不动（11 项）；B 直达 neutral 首批不自动估值（4 项）；C 时钟盾/蜡肺加成/空神像第三件/破封路径与一次性反馈（13 项）；D 盖章满额进电梯+电梯三动作+守卫（12 项）；E 欠额回夹道一次性反馈（5 项）；F 齿门钥序位/未睁之眼/回执骨 shaft 加成/三件自动结算（7 项）；G 刷新不重算不重复累计+键盘 Enter+破封直达（6 项）；H 批次锁与结算窗离场清 timer（6 项）；I 容错九组（9 项）；J v28–v33+主线字节级隔离（2 项）；K 目录/痕迹/遗忘（6 项）；L reduced-motion（2 项）；M v33 回归抽查（2 项）；Z 控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v34-unclaimed-valuation-visual.mjs` **28/28 通过**，均经逐张目验；settle 条件 = scene active + veil 释放 + .reveal 全部 in + 可见素材解码完成 + 截图前两个绘制帧）：
  - `v34-01-valuation-vault-batch-1440x1024.png` / `v34-02-valuation-shaft-batch-1440x1024.png`：估值室两入口批次桌面 1440×1024——标题/引文/估值签/母场景图/三证物卡全部首屏，六件证物卡内可区分，shaft 签显示 1/4/7 溢价初值，无横向溢出。
  - `v34-03-valuation-eye-revealed-1440x1024.png`：未睁之眼揭示态——剩余卡显示「预计 +4 · 封印 -0」，已估值卡保留实收记录并锁定。
  - `v34-04-quota-elevator-1440x1024.png`：定额电梯桌面，三动作首屏。
  - `v34-05-valuation-mobile-390x844.png` / `v34-06-quota-elevator-mobile-390x844.png`：移动端 390×844（@2x）——估值签可换行不溢出，紧凑三列下三件证物与盖章结算全部首屏可见可点（触达 ≥44px），证物卡位图清晰可辨。
  - `v34-07-short-desktop-valuation-1440x800.png`：短桌面——估值签、三证物卡与盖章按钮全部首屏无滚动（母场景图按 ≤800px 契约让位）。
  - `v34-08-directory-visited-1440x800.png`：目录 01κ/01λ 恢复可见。
  - `v34-09-remembrance-valuation-1440x800.png`：痕迹页估值单行 + 8 卡网格。
  - `v34-10-vault-entry-feedback-1440x800.png` / `v34-11-shaft-entry-feedback-1440x800.png`：两入口第四动作反馈态（按钮 pressed + 反馈原文）。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v34 段——八张 WebP 存在与引用、八张源 PNG 保留、两场景结构与零内联 SVG、估值签五个 ID、盖章出厂 disabled、三证物卡与电梯三动作逐字、目录链接出厂 hidden、独立容错状态与 v28–v33 零引用、批次矩阵白名单性质与确定性移位（源码实际提取）、入口初值、startValuation 语义、六证物 meta 逐字、valuateRelic 首选锁/六效果/ledger 实收/破封与三件自动结算、settleValuation 三分流与每批一次、盖章前置条件、两入口首选锁、电梯动作与守卫、破封放行例外、两条一次性回流反馈逐字、痕迹单行与 8 卡、三卡图 eager 加载与换批防闪旧图（is-loading 契约）、移动端紧凑三列与 ≥44px 触达、缓存 v34、文档同步；v33 段结果房按钮数断言更新为 4、shaft 守卫断言同步破封放行形式。

## 本轮新增：v33 异常复核科 / THE OFFICE OF ANOMALY REVIEW（可重复支线 + 异常保全库 / 误报回收井）

- 目标：不再堆单次经过的房间，把 v32 三间副楼接入一条可重复、会轮换、会记分的复核支线；满分与低分各进一间结果房，两分回前段继续探索；不新增结局，不动 v28 治理终局。
- 场景与素材：`#anomaly-review`（异常复核科）、`#evidence-vault`（异常保全库）、`#false-positive-shaft`（误报回收井）三个原生 SPA 场景，沿用 `.scene-branch` 全套视觉语言，零内联 SVG、零占位图、零 CSS 绘图。六张监理源 PNG（`design-references/source-anomaly-*.png`，保留）经 Pillow quality=85 转码 1536×1024：四张同机位复核档案图 `assets/anomaly-review-baseline.webp`（231 KB）/ `anomaly-review-aperture.webp`（218 KB）/ `anomaly-review-rail.webp`（217 KB）/ `anomaly-review-shadow.webp`（222 KB）+ 结果房 `assets/anomaly-evidence-vault.webp`（268 KB）/ `assets/anomaly-false-positive-shaft.webp`（316 KB）。四张档案图同机位、同房间、同照明，变化只在档案内容：baseline 三孔齐平抽屉齐全；aperture 左侧档案孔上移到不可能位置且少一只对应抽屉；rail 右墙黄铜测量轨道绕回自身成闭环；shadow 复核灯影子逆着光源、桌前地面多出一枚封印——逐张目验可判别，移动 390 中心裁切下三类异常仍全部可见。档案图双层叠放只做 opacity 交叉淡化（不位移不放大，reduced-motion 禁用交叉动画）。
- 三处副楼第四入口（CDP 逐条实测）：闭目档案室「把一只没有睁开的眼送去复核」→ 复核科（entry=eyelid）；无号前厅「提交一扇没有编号的门」→ 复核科（entry=vestibule）；逆向阶井「申报一段同时向上的下行梯」→ 复核科（entry=stairwell）。原九动作逐字、mark、反馈、目的地零改动（静态逐字锁定 + CDP 抽查「摸索被封存的视线→无号前厅」原样），第四入口与副楼动作共用同一 AutoAdvance scope 首选锁（入口反馈窗内点副楼旧动作被忽略，实测）。
- 三轮复核（CDP 全链路实测）：每轮恰三份档案、恰一份 baseline 与两份不同异常；仅「登记为异常 / 维持原案」两个原生 button；第一项判断立即锁定——双按钮竞争、连点 5 次、Enter/Space 重复事件均只记一次（实测）；立即反馈并更新世界观内复核签（复核值/连续复核/误报/最佳连续，aria-live 只播当前反馈）；normal 0.7–1.0s 自动换档、reduced-motion 0.3s（实测 <1.2s 完成且反馈完整）；第三轮自动分流，全程无第二个继续按钮。四句反馈逐字锁定：异常中「档案边缘渗出一条新编号。复核值 +1。」/ 原案中「房间保持原样。你第一次因为没看见而被记录。」/ 误报「复核科收走你的确信。误报 +1。」/ 漏异常「变化没有消失，只是被登记成了你。」。
- 确定性轮换：白名单矩阵四行（eyelid→baseline/aperture/rail、vestibule→shadow/baseline/aperture、stairwell→rail/shadow/baseline、neutral→aperture/baseline/shadow）按（入口行+cycle）循环移位，禁止裸随机（静态断言矩阵块无 Math.random 并从源码提取实际矩阵验证白名单性质）；CDP 实测同入口连续两轮顺序不同、误报井工单重启后顺序与直达轮不同、四种档案跨轮出现。
- 结果分流（CDP 三条路径实测）：3 分→`#evidence-vault`；2 分→按入口回副楼并解锁一次性「已复核」反馈（「复核科已登记这一处异常。房间维持原判。」，展示一次即消耗，重进不重复；neutral 回闭目档案室）；0–1 分→`#false-positive-shaft`。保全库三动作：封存最清楚的一处异常→闭目档案室 / 把原案退回无号前厅→无号前厅 / 沿保全编号的断口离开→走廊；误报井三动作：捡回一张被判错的工单→开新 cycle 回复核科 / 把误报写进守则附录→守则 / 承认自己是多出来的一项→门外；全部首选锁定 + 短反馈 + 自动转场，无死路，无新结局。
- 状态与隔离：独立 `goddead_v33_anomaly_review`（visited 三键严格布尔、entry 四值白名单、order 白名单三项恰一 baseline 校验错型重建、round 裁 0–3、decisions 三项内合法 {caseId,choice,correct} 去重并与 round 一致、outcome 白名单、marks 九标记白名单去重限长、数值有限非负裁 9999）；坏 JSON、数组错型、非法 order、非法 decisions、非法 outcome、NaN/Infinity/负数/超大数字全部安全回退（CDP 八组实测）；第三轮只允许结算一次（completedRuns 精确加一、vault/shaft 计数至多各加一；刷新、后退再进不重复，实测）；不读不写 v28–v32 与主线（种子快照字节级一致，实测）。
- 生命周期：轮内换档（`anomaly-review-round`）与跨场景转场（`anomaly-review`）分 scope，离场经 `clearAll` 全清——换档窗与结算窗内离场均无幽灵换档/转场（实测）；刷新只恢复当前轮次/当前档案/已记分结果，不续跑丢失的 timer、不重复记分（含反馈窗内刷新，实测）；直接 hash 进入复核科开确定性 neutral 首轮、只展示第一份档案、实测 2.5s 无任何自动判断；结果房直达仅本轮 outcome 对应或曾到访放行，否则规范化回 `#anomaly-review` 并同步地址栏（实测）。
- 真实缺陷修复（smoke 独立复现，阻断 v33 回流路径）：`AutoAdvance` 看门狗原按 `timers.has(scope)` 判活——timer 触发后 2 秒内同 scope 排定新 timer 时，旧看门狗会劫持新 timer 按旧目的地转场（实测序列：误报井工单→复核科→2 秒内回误报井点「写进守则附录」，附录 timer 被工单看门狗劫持回复核科）。修复为代际令牌：主 timer 与看门狗共享同一条 record，`timers.get(scene) !== record` 即空转；单 timer 路径语义不变，v24–v32 全部既有调度同步受益。生产代码修复后 smoke 87/87，未弱化任何断言。
- 目录与痕迹：三房首次访问后目录恢复 `01η / 异常复核`、`01θ / 异常保全`、`01ι / 误报回收`，未访问 `hidden` 不可聚焦；走廊不加永久按钮；Remembrance 只加单行「异常复核：完成 N 轮，最佳连续 M，保全 X 次，误报回收 Y 次。」（干净时隐藏，实测），严格保持 8 卡。
- 无障碍与动效：入口/判断/结果房动作均为清楚可见的原生 `button`，Tab 顺序与视觉一致，Enter/Space 可激活（CDP 真实键盘事件逐条断言）；判断按钮 aria-pressed 只在反馈窗内标记本轮选择，换档/重进复位；复核签不直播、aria-live 只播当前判断反馈；档案图 alt 只描述空间不泄露答案；hover/focus 不换档不记分；reduced-motion 缩短换档且反馈不跳过；标题聚焦、滚动归顶、静音、veil 生命周期沿用现有契约。
- CDP 功能冒烟（`/tmp/goddead-qa/v33-anomaly-review-smoke.mjs`，chrome-headless-shell + 真实鼠标/键盘事件）**87/87 通过**（exit 0）：A 三入口+确定性轮换+入口首选锁（11 项）；B 直达 neutral 不自动判断+满分轮进保全库+Enter/Space 激活+双按钮竞争与连点幂等+保全库三动作与守卫再入（24 项）；C 两分回副楼+一次性已复核反馈（6 项）；D 零分进误报井+工单重启轮换+误报井三动作（12 项）；E 刷新恢复当前轮/不重复记分/反馈窗刷新不二次累计（4 项）；F 换档窗与结算窗离场清 timer+重进开新 neutral 轮（5 项）；G 结果房守卫四矩阵（4 项）；H 容错八组（9 项）；I v28–v32+主线快照字节级一致（2 项）；J 痕迹单行与 8 卡（4 项）；K reduced-motion（2 项）；L v32 原动作回归抽查（3 项）；Z 全程控制台零异常（1 项）。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v33-anomaly-review-visual.mjs` **40/40 通过**，均经逐张目验；settle 条件 = scene active + veil 释放 + .reveal 全部 in + 素材 naturalWidth>0 解码完成）：
  - `v33-01-anomaly-review-baseline-1440x1024.png` / `v33-02-anomaly-review-aperture-1440x1024.png` / `v33-03-anomaly-review-rail-1440x1024.png` / `v33-04-anomaly-review-shadow-1440x1024.png`：复核科四份档案桌面 1440×1024，逐张断言 front 图为预期档案并目验——aperture 左孔上移、rail 右墙轨道闭环、shadow 灯影逆光+地面封印均可判别；标题/引文/复核签/档案图/两判断按钮全部首屏，无横向溢出。**shadow 案桌面构图修正（监理复核发现）**：原 `object-position: center 62%` 把源图顶部约 0–228px 完全裁掉，逆向灯影（y≈0–130）不入画；已改为逐层 `data-case` 标记 + 仅 shadow 案桌面 `object-position: center top`（移动端维持原裁切），重拍后与 `design-references/source-anomaly-review-shadow.png` 顶部同屏对照确认灯影真实进入网页画面，两判断按钮仍首屏（CDP 断言 front 层 `data-case="shadow"` 且计算样式 `50% 0%`，非 shadow 层保持 `50% 62%`）。
  - `v33-05-evidence-vault-1440x1024.png` / `v33-06-false-positive-shaft-1440x1024.png`：两结果房桌面，三动作全部首屏。
  - `v33-07-anomaly-review-mobile-390x844.png`（aperture 左孔上移可见）/ `v33-08-anomaly-review-rail-mobile-390x844.png`（右侧轨道闭环可见）/ `v33-09-anomaly-review-shadow-mobile-390x844.png`（顶部灯影与地面封印可见）：移动 390×844（@2x）中心裁切下三类关键异常仍全部可见，标题→引文→复核签→档案图→两判断按钮单列，首个判断按钮首屏可见。
  - `v33-10-evidence-vault-mobile-390x844.png` / `v33-11-false-positive-shaft-mobile-390x844.png`：两结果房移动端，首个动作首屏可见。
  - `v33-12-short-desktop-review-1440x800.png`：短桌面 1440×800 两判断按钮首屏无滚动。
  - `v33-13-directory-visited-1440x800.png`：目录展开后 01η/01θ/01ι 三条入口恢复可见。
  - `v33-14-remembrance-anomaly-1440x800.png`：痕迹页异常复核单行与 8 卡网格。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v33 段——六张 WebP 存在与引用、六张源 PNG 保留、三场景结构（复核科恰 2 判断按钮+复核签 ID+aria-live 唯一、结果房各恰 3 动作、零内联 SVG、回退出口）、全部 ID 接线、目录链接出厂 hidden、独立容错状态与 v28–v32 零引用、矩阵白名单性质与确定性移位（源码实际提取）、startReview/decideReview/enterReview/结果房动作与四句反馈原文锁定、首选锁定双 scope 守卫、结果房守卫、痕迹单行与 8 卡、复核签/交叉淡化/reduced-motion CSS 契约、shadow 案专属裁切（JS 逐层 data-case 标记 + CSS 仅桌面 `[data-case="shadow"]` 顶对齐 + 其余三案零专属裁切 + 初始层 data-case="baseline"）、缓存 v33、文档同步；v32 段副楼按钮数断言同步更新为 4（含第四入口）。

## 本轮新增：v32 门内副楼 / THE INNER ANNEX（闭目档案室 / 无号前厅 / 逆向阶井）

- 目标：不再向结局堆内容，把 v31 三条最前段旁路各向内延伸一间，让玩家进入主线前就能绕出第二层路径；只深化 v31 三个父房，不动 v28 治理终局与 v29/v30 深层分支。
- 场景与素材：`#eyelid-archive`（闭目档案室）、`#unnumbered-vestibule`（无号前厅）、`#reverse-stairwell`（逆向阶井）三个原生 SPA 场景；正式位图 `assets/inner-annex-eyelid-archive.webp`（222 KB）、`assets/inner-annex-unnumbered-vestibule.webp`（267 KB）、`assets/inner-annex-reverse-stairwell.webp`（214 KB），监理源 PNG（`design-references/source-inner-annex-*.png`，保留）经 Pillow quality=85 转码 1536×1024，沿用 `.scene-branch` 全套视觉语言，零内联 SVG、零占位图、零 CSS 绘图。
- 三处 v31 定向改线（仅目的地变更，动作文字/反馈原文/v31 mark/aria-pressed 恢复/一次性调度全部保留，静态断言逐字锁定反馈文案）：窥孔「闭上这只眼」threshold→`#eyelid-archive`；失号龛「取下空白号牌」corridor→`#unnumbered-vestibule`；夹道「倒着走到尽头」corridor→`#reverse-stairwell`。其余六个 v31 动作、守则 1–8 分流、「玖」异常零改动（CDP 抽查 witnessed→protocol、followedInward→glyph-niche 不变）。
- 九动作目的地（CDP 逐条实测）：摸索被封存的视线→无号前厅；听盒中眨眼→访客守则；把自己的眼影归档→门外；空白牌挂上第十扇门→逆向阶井；无号台账留指印→闭目档案室；选择没有编号的出口→走廊；向上走向下层→闭目档案室；跨过第零级台阶→无号前厅；回头但不转身→访客守则。三角互循环 + 各自回门外/进守则/进走廊，无死路，无第二个继续按钮。
- 首选锁定：三新房与三处改线复用 `AutoAdvance`，动作处理器最前检查 pending，第一条已接受的选择排定后忽略后续一切输入；三房各做双向竞争 CDP 回归（A 后立刻 B 只去 A、反向同理，共 6 组），排队期全程每动作只记一次；离场（exit-link）清 timer 无幽灵转场；反馈窗内刷新不二次累计、不续跑；重载只恢复 visited/marks/aria-pressed。
- 状态与隔离：独立 `goddead_v32_inner_annex`（visited 三键严格布尔、marks 九标记白名单去重限长、lastChoice 合法 ID 或空串、transitions 有限非负裁剪 9999）；坏 JSON、数组错型、非法标记、超大数字全部安全回退（CDP 实测）；首次真正进入（含直接 hash）立即记 visited，直接 hash 不自动触发任何动作（实测等待 2.5s 无 marks、无 transitions、场景不变）；不读不写 v28/v29/v30/v31 与主线（种子快照字节级一致）。
- 目录与痕迹：三房首次访问后目录恢复 `01δ / 闭目档案`、`01ε / 无号前厅`、`01ζ / 逆向阶井`（打开菜单实测可见），未访问 `hidden` 不可聚焦；走廊不新增永久按钮；Remembrance 只加单行「门内副楼：闭目档案 / 无号前厅 / 逆向阶井；你在没有楼层的地方改道 N 次。」（按已访问项显示），严格保持 8 卡。
- 无障碍与动效：三动作均为清楚可见的原生 `button`（无图上隐形热点），Tab 顺序与视觉一致，Enter/Space 可操作，focus-visible 沿用血/骨色；图片 alt 描述空间不泄露结果；hover/focus 只反馈不换场；reduced-motion 缩短反馈（实测 <2.5s）且文案不跳过；标题聚焦、滚动归顶、静音、veil 生命周期沿用现有契约。
- CDP 功能冒烟（`/tmp/goddead-qa/v32-inner-annex-smoke.mjs`，真实浏览器 + 真实鼠标/键盘事件）60/60 通过：A 三处改线 + 反馈原文 + v31 mark 保留 + 两个未改线动作抽查；B 九目的地 + 三角闭环 + 无继续按钮 + marks/transitions 精确计数 + 目录恢复；C 三房双向首选竞争 6 组 + 排队期单次计数；D 连点 5 次 + Enter/Space 幂等 + aria-pressed 恢复；E 离场取消 timer + 刷新不续跑不二次累计；F 直接 hash 只记 visited 不自动动作 + 目录 hidden/恢复；G 坏 JSON/数组错型/非法 visited/非法 marks/溢出 transitions 容错；H v28–v31 + 主线快照字节级一致；I 痕迹单行与 8 卡 + 干净时隐藏；KB 纯键盘独立激活（干净页面、零先行鼠标与 pending，显式 focus 原生 button 后 dispatch keyDown/keyUp：Enter 激活闭目档案室与逆向阶井各一动作、Space 激活无号前厅一动作，反馈文案/mark/transitions/aria-pressed/最终去向逐条断言；独立聚焦回归 `/tmp/goddead-qa/v32-annex-keyboard.mjs` 16/16——监理在 in-app 浏览器用 locator.press 未观察到转场，经 CDP 决定性验证确为该工具输入限制，生产代码无需修正）；J reduced-motion；全程控制台零异常。v31 旧套件适配改线后同环境重跑 67/67。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v32-inner-annex-visual.mjs` 48/48 通过，均经逐张目验；settle 条件同 v31）：
  - `v32-01-eyelid-archive-1440x1024.png` / `v32-02-unnumbered-vestibule-1440x1024.png` / `v32-03-reverse-stairwell-1440x1024.png`：三新房桌面 1440×1024，标题/引文/位图/三动作全部首屏，无横向溢出。
  - `v32-04-eyelid-archive-mobile-390x844.png` / `v32-05-unnumbered-vestibule-mobile-390x844.png` / `v32-06-reverse-stairwell-mobile-390x844.png`：三新房移动 390×844（@2x），标题→引文→位图→三动作单列，首个动作首屏可见。
  - `v32-07-rewire-peephole-close-1440x800.png` / `v32-08-rewire-glyph-blank-1440x800.png` / `v32-09-rewire-return-backward-1440x800.png`：三条父房改线反馈态——父房仍在、反馈原文可见、按钮 pressed，证明改线动作真实触发。
  - `v32-10-directory-visited-1440x800.png`：目录展开后 01δ/01ε/01ζ 三条副楼入口恢复可见。
  - `v32-11-remembrance-annex-1440x800.png`：痕迹页副楼单行与 8 卡网格。
  - `v32-12-short-desktop-eyelid-1440x800.png`：短桌面 1440×800 首个动作无需滚动（三新房均逐张断言，闭目档案室留证）。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v32 段——三素材存在与引用、源 PNG 保留、三场景结构（各恰 3 个 branch-btn、aria-pressed、回门外出口、零内联 SVG）、全部 ID 接线、目录链接出厂 hidden、独立容错状态（含数组错型）与 v28–v31 零引用、九动作目的地、三处改线反馈原文锁定、首选锁定守卫、直接 hash 只记 visited、无守卫、痕迹单行与 8 卡、缓存 v32、文档同步；v31 段三处目的地断言同步更新为副楼场景。

## 本轮新增：v31 门前三岔 / THE FORECOURT WEAVE（倒置窥孔 / 失号龛 / 回返夹道）

- 目标：把最前段从「敲门 → 任意守则 → 走廊」的固定流程改成玩家第一次打开网页就能发现的真实多分支；分支发生在门外与守则段，不挂在 v29/v30 深层房间之后；门的三次敲击主路径保持原样。
- 场景与素材：`#peephole-chamber`（倒置窥孔）、`#glyph-niche`（失号龛）、`#return-passage`（回返夹道）三个原生 SPA 场景；正式位图 `assets/forecourt-peephole.webp`（139 KB）、`assets/forecourt-glyph-niche.webp`（229 KB）、`assets/forecourt-return-passage.webp`（166 KB），均由监理提供源 PNG（`design-references/source-forecourt-*.png`，保留）经 Pillow quality=85 转码 1536×1024，沿用 `.scene-branch` / `.branch-figure` / `.branch-choices` 视觉语言，场景零内联 SVG、零 CSS 假素材。
- 门外三热点：门图相对定位容器内三个原生 `button`——日蚀窥孔（aria-label「观察门上的黑色日蚀」）、左墙符号（「触碰左墙上不该数的符号」）、右侧回返痕（「沿着右侧写着回来的痕迹走」）；默认极淡轮廓 + 短标签，hover/focus-visible 增强，触屏 ≥48px；命中链断言证明门按钮中心仍命中门按钮（不遮三次敲击主目标）；点击即持久化 visited，0.7–1.0s（reduced-motion 0.3s）反馈后自动进入，无第二个继续按钮。
- 九动作目的地（CDP 逐条实测）：直视黑镜→守则；听黄铜管→回返夹道；闭上这只眼→门外；数第九道刻痕→倒置窥孔；擦掉第七号→守则；取下空白号牌→走廊；跟随向内的脚印→失号龛；从里面敲门→守则；倒着走到尽头→走廊。三区域互相串联、回门外、进守则、直达走廊均闭合。
- 守则真实分流：其二→回返夹道、其三/其七→失号龛、其四→倒置窥孔（取消原主线 AutoAdvance，短反馈后分流）；其一/五/六/八仍自动去走廊；首选锁定——任一规则排定转场后忽略本场景其他规则输入（CDP 实测：其二→反馈窗内点其一仍进回返夹道，其一→反馈窗内点其二仍进走廊，离场返回后可再次激活）；同一锁定应用于门外——任一门前转场（三敲或热点）排定后忽略门/热点输入（CDP 实测：日蚀热点→反馈窗内三敲仍进倒置窥孔且门未开、awake 未写；三敲→反馈窗内点热点仍进守则且不写 visited；离场返回后门外可再次激活）；「玖」异常（rulesCount 点击）优先进 `#ninth`，不受锁影响，v31 未改写该处理器（静态断言 + 玖窗口 CDP 实测）。
- 状态与容错：独立 `goddead_v31_forecourt_weave`（`visited` 三键严格布尔、`marks` 九标记白名单去重、`lastChoice` 合法性校验、`transitions` 非负整数裁剪至 9999）；坏 JSON、错误类型、非法标记、溢出数字全部安全回退（CDP 实测）；点击时立即持久化；`AutoAdvance.has` 守卫下连点与 Enter/Space 重复事件只记一次、只调度一次；反馈期间刷新不重复累计、不会被幽灵转场拉走；离场（exit-link / hashchange）经 `goScene` 的 `clearAll` 取消未触发 timer（新区域与守则分流各一条实测）；不读不写 v28/v29/v30 与旧主线（种子快照字节级一致）；三场景不设守卫，干净存档热点可进、直接 hash 可达（直达即到访）。
- 目录与痕迹：三区域首次到访后目录入口 `01α / 窥孔`、`01β / 失号龛`、`01γ / 回返夹道` 原子恢复，未访问 `hidden` 且不可聚焦；走廊不新增永久按钮；痕迹页只加单行 `#forecourt-memory`（「门前旁路：窥孔 / 失号龛 / 回返夹道（按已访问项显示）；你在门外改道 N 次。」），严格保持 8 卡。
- 无障碍与动效：热点与动作均支持 Tab/Enter/Space，焦点环沿用血红/骨色；图片 alt 描述空间不泄露答案；hover/focus 只反馈不换场；reduced-motion 缩短反馈（实测 <2.5s 完成转场）且文案不跳过；静音、标题聚焦、滚动归顶、场景 veil 生命周期沿用现有契约。
- 测试夹具修复（冒烟独立复现的两处竞态，生产代码零改动）：① `.scene.active` 静态存在于 HTML，旧就绪条件在 DOMContentLoaded 回调完成前放行，首次点击丢失——改为等待 `#era-line` 填数（回调同步执行的可观察中段）作为「全部监听已挂接」的确证；② 旧场景 veil 淡出期间其位图仍在最上层，真实鼠标事件落在旧场景上——点击助手改为等待 `elementsFromPoint` 命中链上只剩 `pointer-events:none` 覆盖物再击。种子标记用 sessionStorage（同 tab reload 保留、跨 Target 隔离），避免 localStorage 标记跨用例污染。
- CDP 功能冒烟（`/tmp/goddead-qa/v31-forecourt-smoke.mjs`，真实浏览器 + 真实鼠标/键盘事件）66/66 通过：A 干净存档热点可发现/可键盘进入/不遮门 + 敲门主路径；B 三热点去向 + 九动作目的地 + 守则 2/3/4/7 分流 + 1/5/6/8 主线 + 反馈文案先于转场 + 无继续按钮 + transitions 精确计数；C 玖窗口入 ninth；D 连点 5 次 + Enter/Space 重复只记一次只转场一次 + aria-pressed 恢复 + 热点三连点幂等；E 反馈期间刷新不重复累计/无幽灵转场 + 两类离场取消旧 timer；F 坏 JSON/非法 marks/非法 visited/溢出 transitions 容错；G v28/v29/v30 + 主线快照字节级一致；H 痕迹单行与 8 卡 + 干净时隐藏；J 守则首选锁定（其二→其一锁定夹道、其一→其二锁定走廊、离场后恢复可激活）；K 门外首选锁定（热点→三敲锁定窥孔且门未开、三敲→热点锁定守则且不写 visited、离场后恢复可激活，另有独立聚焦回归 `v31-threshold-lock.mjs` 5/5）；I reduced-motion 缩短转场且文案完整；全程控制台零异常。
- 视觉证据（`design-qa-evidence/`，CDP `/tmp/goddead-qa/v31-forecourt-visual.mjs` 62/62 通过，均经逐张目验；settle 条件 = scene active + veil 释放 + visibility/opacity + .reveal 全部 in + 素材解码）：
  - `v31-01-threshold-hotspots-1440x800.png` / `v31-02-threshold-hotspots-mobile-390x844.png`：门外三热点桌面与移动端，均落在首屏、≥48px、无横向溢出、门按钮完整可见。
  - `v31-03-peephole-chamber-1440x800.png` / `v31-04-glyph-niche-1440x800.png` / `v31-05-return-passage-1440x800.png`：三区域桌面 1440×800，标题/说明/位图/三动作全部首屏，lastChoice 的 aria-pressed 高亮恢复可见。
  - `v31-06-peephole-chamber-mobile-390x844.png` / `v31-07-glyph-niche-mobile-390x844.png` / `v31-08-return-passage-mobile-390x844.png`：三区域移动 390×844（@2x），标题→说明→位图→三动作单列，首个动作首屏可见，无横向溢出。
  - `v31-09-short-desktop-glyph-niche-1440x640.png`：短桌面 1440×640 首个动作无需滚动（三区域均逐张断言，失号龛留证）。
  - `v31-10-protocol-detour-1440x800.png`：守则八条完整可见的分流前可见态。
  - `v31-11-remembrance-forecourt-1440x800.png`：痕迹页单行「门前旁路：窥孔 / 失号龛 / 回返夹道；你在门外改道 3 次。」与 8 卡网格。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v31 段——三素材存在与引用、源 PNG 保留、三热点原生 button 与 aria-label、热点在 door-scene 容器内且门按钮在前、三场景结构（各恰 3 个 branch-btn、aria-pressed、回门外出口、零内联 SVG）、全部 ID 接线、目录链接出厂 hidden、独立容错状态与 v28/v29/v30 零引用、九动作目的地、RULE_DETOUR 分流与门外/守则首选锁定及玖优先、幂等守卫、直达无守卫、痕迹单行与 8 卡、缓存 v31、文档同步。

## 本轮新增：v30 深层支线互联（失真转接室 / 逆流泵房 / 无名罪籍库）

- 目标：把 v29 三个支线房间的三个「条件捷径/串联」选择下沉为三个可持续互动的二级区域，构成可循环的三角网络，同时各自保留通往 protocol / corridor / watch 的差异化出口；支线依旧永远可选，不做主线硬门。
- 场景与素材：`#echo-transfer`（失真转接室）、`#vein-pump`（逆流泵房）、`#confession-ledger`（无名罪籍库）三个原生 SPA 场景；正式位图 `assets/echo-transfer-chamber.webp`（132 KB）、`assets/reverse-flow-pump-room.webp`（203 KB）、`assets/nameless-ledger-vault.webp`（185 KB），均由监理提供源图（`design-references/source-*.png`）经 Pillow quality=85 转码，1536×1024，沿用 `.branch-figure`/`.branch-img` 槽位与羽化风格，场景零内联 SVG。
- 入口改接（v29 三房间保留，三个选择的去向变更）：
  - 回声档案室「03:17 的铃」→ 失真转接室（原直达值夜室的条件捷径下移到转接室内）；
  - 血管维修井「隔离闸」→ 逆流泵房（原「三支线均访问且值夜解锁才放行」的直达值夜室下移到泵房应急梯）；
  - 忏悔称量室「拒绝忏悔」→ 无名罪籍库（原直接跳回声档案室的串联改为经罪籍库中转）。
- 三角网络九个动作（全部「主动作 → 短反馈 → 自动转场」，无第二个必点按钮，不要求滚动）：
  - 失真转接室：接到血管维护网→逆流泵房；封存自己的声音→访客守则；再次拨响 03:17→值夜室（需 `watchUnlocked()`，否则短反馈后回走廊）。
  - 逆流泵房：释放回声压力→失真转接室；导入黑色沉积物→无名罪籍库；爬应急梯→值夜室（需 `watchUnlocked()`，否则落回访客守则）。
  - 无名罪籍库：划掉自己的名字→失真转接室；归档为仍在场的见证者→逆流泵房；拒收整份记录→正常回访客守则；若三座二级区域全到过，给出额外反馈（「三处档案同时咳嗽了一声」）并按解锁状态落走廊或值夜室。
- 状态与守卫：独立 `goddead_v30_branch_depth`（`deepVisited` / `lastDeepChoice`）容错解析、坏 JSON 安全回退，不读不写 v28/v29/旧主线；深层到访在点击时立即持久化（同 v29 契约），走廊再入按钮（`#branch-entry-echo-transfer` 等）与目录入口（`#echo-transfer-link` 等）首次到访后恢复、跨 reload 存活，未到访时 `hidden` 且不可聚焦；`resolveScene` 深层守卫把未到访的深层直达回退到父支线（父支线未访问再由 v29 守卫拦回走廊），直达不解锁；重进时选择以 `aria-pressed` 恢复。
- 痕迹页：新增单行深层记忆（`#deep-memory`：「你下到了更深的地方……档案不承认见过你。」），严格保持 8 卡 Grid。
- 无障碍与动效契约：三个深层场景与 v29 同构——语义 button、`aria-live="polite"` 反馈、场景标题聚焦、reduced-motion 0.3s 反馈与动画坍缩、短桌面/移动端首屏首个动作无滚动可见。
- 视觉证据（`design-qa-evidence/`，CDP 无头 `/tmp/goddead-qa/v30-visual.mjs` 37/37 通过，均经逐张目验；预置 v29 三父支线 visited + v30 三深层 deepVisited 后直达，待 scene active、veil 释放、visibility=visible、.reveal 全部 settle、素材解码完成后截图）：
  - `v30-01-echo-transfer-1440x800.png` / `v30-02-vein-pump-1440x800.png` / `v30-03-confession-ledger-1440x800.png`：桌面 1440×800 整室构图，标题、位图、三个核心动作全部落在首屏，无横向溢出，回父支线出口可见。
  - `v30-04-echo-transfer-mobile-390x844.png` / `v30-05-vein-pump-mobile-390x844.png` / `v30-06-confession-ledger-mobile-390x844.png`：移动端 390×844（@2x）标题→描述→位图→三动作依次完整呈现，第一核心动作首屏可见，无横向溢出，文字可读。
  - 逐张断言覆盖：正确场景 active、素材 `naturalWidth>0`、无横向溢出、标题/图片/三按钮真实可见、桌面三按钮全在首屏、移动端第一动作首屏可发现；全程控制台零异常。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v30 段——三素材存在与引用、三场景结构（各恰 3 个 branch-btn、aria-live、回父支线出口、无继续按钮、零内联 SVG）、全部 ID 接线、入口出厂 hidden、独立容错状态、九动作目的地、bell/ladder 条件出口与差异化 fallback、reject 全到访联合条件与动态目标、chooseDeep 调度、深层守卫归并、深层记忆、8 卡保持、缓存 v30、文档同步；v29 断言同步更新为改接后的目的地（bell→echo-transfer、isolate→vein-pump、refuse→confession-ledger）。

## 本轮新增：v29 前段多分支（回声档案室 / 血管维修井 / 忏悔称量室）

- 目标：在走廊残页上挂出三个永远可选、绝不做主线硬门的支线房间，让前段从「一条走廊」变成可分流、可回流、可串联的多分支结构。
- 场景与素材：`#echo` / `#vein` / `#confession` 三个原生 SPA 场景，正式位图 `assets/echo-archive.webp`、`assets/vein-maintenance-well.webp`、`assets/confession-weighing-room.webp`（1536×1024，mask 羽化融入 `#050505`，`loading="lazy" decoding="async"`，显式宽高），场景零内联 SVG；短桌面（≤800px 高）两栏/限高适配，首屏首个热点无滚动可见。
- 进入方式：走廊残页 f2「回声」/ f3「血管」/ f4「忏悔」首次主动点击 → 取消主线 corridor AutoAdvance，0.7–1.0s（reduced-motion 0.3s）反馈后自动进入；`visited` 点击即持久化，转场被回退取消也不丢支线。
- 九选择与条件捷径（全部「主动作 → 短反馈 → 自动转场」，无第二个必点按钮）：
  - 回声档案室：门外的敲声→门外；自己的脚步→走廊；03:17 的铃→失真转接室（v30 起改接深层，原条件捷径下移）。
  - 血管维修井：顺流阀→走廊；逆流阀→守则；隔离闸→逆流泵房（v30 起改接深层，原条件捷径下移）。
  - 忏悔称量室：承认敲过门→守则；承认读过第七条→走廊；拒绝忏悔→无名罪籍库（v30 起改接深层，原直接串联回声室改为经罪籍库中转）。
- 状态、入口与守卫：`goddead_v29_branches`（`visited`/`lastChoice`）容错解析、坏 JSON 安全回退，只读不写 v28 治理与旧主线 10 个 key；访问后走廊出现再入按钮（`#branch-entry-*`）与目录入口（`#echo-link` 等），跨 reload 存活；`resolveScene` 把未访问支线直达拦回走廊并归一地址；重进时选择以 `aria-pressed` 恢复。
- 痕迹页：单行旁路记忆（`#branch-memory`），严格保持 8 卡 Grid，不新增第九卡。
- 证据文件（`design-qa-evidence/`）：`br-01-corridor-initial-1440x800.png`（分流前走廊）、`br-02-echo-archive-1440x800.png`（回声档案室桌面整室）、`br-05-corridor-branch-entries-1440x800.png`（访问后走廊再入按钮）、`br-06-remembrance-branch-memory-1440x800.png`（旁路记忆 + 8 卡）、`br-07/08/09-*-mobile-390x844.png`（移动端三支线首屏热点完整构图，经逐张目验）。`br-03-vein-well-1440x800.png` 与 `br-04-confession-room-1440x800.png` 两张桌面截图为转场近黑帧，场景功能已由同轮 CDP 断言验证，截图待重拍。
- CDP 无头全自动 QA（`/tmp/goddead-qa/branch-rooms.mjs`，真实点击/键盘/重载）：独立执行 **54/54 通过**（exit 0）——残页分流、九选择全目标、条件捷径成败两路、交叉回流、键盘 Enter 激活、visited/lastChoice 持久化与重进恢复、干净存档直达守卫、坏 JSON 容错、移动端 390×844 首屏热点与零横向溢出、reduced-motion 快速转场、主线状态零污染、全程控制台零错误零异常。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v29 段（素材存在与引用、三场景各恰 3 个 branch-btn、全部 ID 接线、入口出厂 hidden、容错解析、九选择目标、隔离闸联合条件、失败回流、守卫归并、旁路记忆、8 卡保持、缓存 v29、文档同步）。

## 本轮新增：v28 神圣平衡与代理神明协议（治理终局闭环）

- 目标：把 v28 半成品（治理 HUD、三处代行裁决、老玩家入口、结局卡、崩解 modal 仅有 HTML/CSS）接线为完整可玩的治理终局，并真实验证四条结局 + 崩解路径。
- 接线与状态机：`script.js` 新增 `ENDING_META`（四结局文案）、`resetGovernanceCycle()`、`openCollapseModal()` / `closeCollapseModal()`、`syncGovernanceRemembrance()`（begin 入口 / 结局卡 / 崩解 modal 三态互斥），并接通 `#begin-governance-btn`、`#next-cycle-btn`、`#retry-governance-btn` 全部 12 个终局 ID。`sceneInit` 进入 remembrance/offering/reliquary 时同步终局面板与 ruling 控件，`goScene` 离场统一关闭崩解 modal，`updateHudDisplay()` 随场景进入刷新 HUD 显隐与数值。
- 三次裁决自动推进：每个 `applyRuling*Choice` 在写入裁决后立即调度 `AutoAdvance`（acting→offering→reliquary→remembrance），`continue-*-btn` 仅作非必需 fallback 复用同一调度——CDP 全程未点击任何 continue 按钮即走通完整 cycle。
- 结局真实计算验证（非写死）：从 50/50/20 基值按 `RULING_DELTAS` 推导，ABA→ascension（E100/A25/R40）、AAB→madness（E35/A40/R65）、AAA→oblivion（E65/A70/R10）、BBA→nightwatch（E65/A50/R20）、BAB→collapse（E 归零）；全部 8 种组合穷举无未分类。修复了最终裁决时结局只活在内存、不写入持久图鉴的缺陷（先存 rulings，再二次解析回写 `unlockedEndings`）。
- 状态契约：`cycleCount` 仅在主动开新一轮/重试时精确加一，解析永不自增；直达或重复刷新 `#remembrance` 不创建治理 key、不重复污染图鉴；坏 JSON 安全回退并正常提供 begin 入口。老玩家入口只置 `hudUnlocked` 并去 acting，旧主线 10 个 localStorage key 快照比对零差异；`resetGovernanceCycle()` 只清本轮 rulings，图鉴与旧主线全保留。
- 崩解 modal：`role="dialog" aria-modal="true"`，仅 remembrance 内打开，初始焦点落重试按钮（延后于场景标题聚焦），键盘 Enter 重试 → 关闭 modal → 回 acting 且焦点恢复进场景；collapse 不进入图鉴。
- 证据文件（`design-qa-evidence/`，均经逐张目验）：
  - `gov-01-old-player-begin-1440x800.png`：老玩家痕迹页显示「开启代神治理协议」，HUD/结局卡/modal 均隐藏。
  - `gov-02-ruling1-acting-1440x800.png`：begin 后进入代神席，HUD 50/50/20，裁决·其一两选项就位。
  - `gov-03-ruling2-offering-1440x800.png`：裁决一（甲）后自动推进焚献，HUD 70/35/35，裁决·其二就位。
  - `gov-04-ruling3-reliquary-1440x800.png`：裁决二（乙）后自动推进遗物科，HUD 90/15/55，裁决·其三两选项就位。
  - `gov-05-ending-ascension-aba-1440x800.png`：ABA 全程点击走通 → 登神长阶结局卡，E100/A25/R40，图鉴 4 项中 ascension 高亮。
  - `gov-06-reload-restore-ascension-1440x800.png`：刷新后结局卡与图鉴完整恢复，不重复、不污染。
  - `gov-07-next-cycle-acting-1440x800.png`：开启新一轮 → rulings 清空、HUD 归 50/50/20、cycleCount=2、图鉴保留。
  - `gov-08-second-ending-madness-collection-1440x800.png`：第二轮 BBB → 万魂共鸣，图鉴累积 2 项高亮。
  - `gov-09-collapse-bab-modal-1440x800.png` / `gov-12-collapse-mobile-390x844.png`：BAB → 神圣崩解 modal（桌面/移动），重试按钮初始聚焦。
  - `gov-10-retry-returns-acting-1440x800.png`：键盘 Enter 重试 → modal 关闭、回代神席、判词重置、cycleCount=2。
  - `gov-11-ending-mobile-390x844.png`：移动端结局卡完整构图，无横向溢出。
  - `gov-13-reduced-motion-ending-1440x800.png`：reduced-motion 下最终裁决立即完整并快速转场。
  - `gov-14-ending-madness-aab-1440x800.png` / `gov-15-ending-oblivion-aaa-1440x800.png` / `gov-16-ending-nightwatch-bba-1440x800.png`：隔离 localStorage 三组合结局卡（各含派生资源与单结局图鉴）。
- CDP 无头全自动 QA（`/tmp/goddead-qa/governance-cycle.mjs`，chrome-headless 真实点击/键盘/重载）：**连续 3 次独立运行 102/102 通过**（exit 0），覆盖完整 cycle 点击走通、五组合隔离验证、刷新恢复、next cycle、collapse retry、桌面 1440×800 / 移动 390×844、reduced-motion、直达零污染、坏 JSON 修复、全程控制台零错误零异常。
- 返工修复（独立复核发现 collapse Enter 重试后焦点悬空，复现确认后修复，未弱化任何断言）：
  - `goScene` 转场收口幂等化：场景切换、焦点恢复、veil 释放与 `veilBusy` 复位收进单条幂等 `complete()`，主定时器（480ms / reduced 60ms）与看门狗（2000ms / reduced 600ms）驱动同一条路径——原「480→180/80ms」嵌套定时器链一旦内层丢失会造成 veilBusy 永久卡死、veil 常亮、焦点悬空，现已结构性消除。
  - 可靠聚焦 `focusReliably`：`.scene` 的 `visibility` 0.5s 过渡期内 `focus()` 会被静默拒绝，改为同步首试 + 最多 12×120ms 验收重试（落位即停、场景失活即弃，不跨场景抢焦点）；modal 打开时完成步骤优先聚焦 retry，begin/next-cycle/retry 经 `pendingSceneFocus` 优先落可见的 `#ruling-acting-heading`。
  - 崩解 modal 真实焦点陷阱：`onCollapseKeydown` 随打开挂载、随关闭/离场移除；仅重试一个可聚焦项时 Tab 与 Shift+Tab 均留在重试上。
  - QA 新增 13 项断言：Tab/Shift+Tab 双方向陷阱、Enter 重试后落 `#ruling-acting-heading`、重试后 Tab 自然前进、collapse 直达+重载焦点稳定、reduced-motion collapse 聚焦与重试全链路；证据新增 `gov-17-reduced-motion-retry-acting-1440x800.png`。
- 静态契约：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；测试套件新增 v28 段（12 个终局 ID 接线、五组合源码提取实际计算、cycle 重置边界、begin 不清进度、modal 焦点/开关、continue 非必经、缓存 v28）。
- 回归说明：本轮回合修复了 v27 静态断言与 v28 结构的两处不兼容（reliquary 守卫断言改为 `reliquaryConsumed` 形式、sceneInit offering 分支新形式），未改动任何 v27 及更早的生产行为；threshold 开门套件（`threshold-door-open.mjs`）31/31 于本轮前置验证通过。

## 本轮新增：神圣遗物科 Native SPA 场景集成与印章压印仪式（v27）

- 目标：将神圣遗物科（`#reliquary`）提升为原生 SPA 场景，连接代神席（`#acting`）与焚献炉（`#offering`）之后的见证终局；玩家作为代行神对遗物与祷词灰烬进行审查压印与终极封印。
- 素材与构图：`assets/relic-vault-desk.webp`（1536×1024，144 KB WebP，Mask 羽化融入 `#050505`），围绕中央黄铜压印机与左侧灰烬托盘进行视觉裁切与摆放。
- 解锁契约与降级守卫：定义单一函数 `reliquaryUnlocked()`，校验 7 项前置依赖（3残页 + 05:02覆盖+签退尝试 + 第四线路接通 + 空白回执签收 + 注销拒绝 + 代神席100%在岗 + 焚献炉至少1次祷词）。`resolveScene` 集中拦截，若依赖不足或本地有陈旧 `sealed = true` 状态，逐级回退至上游最近有效场景，并自动同步规范化地址栏。
- 场景入口与 DOM 双向 hidden 同步：`syncWatchDoor`、`syncLine4`、`syncDeadletter`、`syncCancel`、`syncActingEntry` 与 `renderReliquary` 均实现双向 DOM 属性同步。当依赖不满足（如执行遗忘重置后）时，主动为 `narrowDoor`/`watchLink`、`answerBox`/`switchLink`、`deliverBox`/`deadletterLink`、`cancelBox`/`cancelLink`、`actingBox`/`actingLink` 及 `reliquaryLink` 重新施加 `hidden` 属性（`setAttribute("hidden", "")`），设置 `aria-hidden="true"`，并清理关联 class。
- 遗物审查台与终极封印：
  - 3 组原生按钮 (`#relic-1`, `#relic-2`, `#relic-3`)，激活后播放 WebAudio 压印卡扣声 (`AudioEngine.clamp()`)，更新 `aria-pressed="true"` 并揭示审查笔记。
  - 三件遗物全部审查后，终极封印按钮 (`#seal-btn`) 动态启用；点击后播放沉重印章声，持久化 `sealed: true` 与 `sealedAt`，按 150ms 节奏逐行显现 6 行封印记录（`prefers-reduced-motion` 立即完整显现），并调度 `AutoAdvance` 自动推进至 `#remembrance`。
- 痕迹页与 8 卡 Grid 约束：严格保留 8 卡 Stat Grid（桌面 4×2 / 移动 2×4）。通过 `#reliquary-slot` 渲染封印状态 Banner，并新增专属 `relic-memory` 记忆文案（`「神没有留下遗物。你把整座观所封印在了记忆里。」`）。
- 离线/旧版重定向与无 confirm 重置：
  - `reliquary.html` 转换为极简重定向脚本（`location.replace("index.html#reliquary")`），将守卫判定委托给主 SPA。
  - 痕迹页底部添加无原生 `confirm()` 的主题化内联遗忘确认框（`#forget-confirm-box`），确认后不区分大小写地清空所有 `goddead` 相关 key（`k.toLowerCase().includes("goddead")`），移除 `saveState()` 调用以确保 `localStorage` 内 `goddead` key 数量为 0，并依次调用 `paintWatch()`、`paintLine4()`、`paintDeliver()`、`paintCancel()`、`paintActing()`、`paintRelicMemory()` 平滑重置回 `#threshold`。
- 视口适配与短桌面支持：`@media (min-width: 721px) and (max-height: 800px)` 视口下将 `#reliquary` 设为两栏网格，位图限制 230px 高度，顶栏留出 `clamp(92px, 10vh, 130px)` 安全净空，首个核心遗物按钮首屏无滚动可见。
- 证据文件与全场景 QA（证据存放在 `design-qa-evidence/`）：
  - `01-locked-reliquary-fallback-desktop-1440x937.png`：未满足 7 项前置依赖时直接访问 `#reliquary` 的降级守卫与规范化 URL 回退。
  - `02-unlocked-reliquary-desktop-1440x937.png`：7 项依赖满足后，原生 `#reliquary` 桌面主场景与遗物审查台正确呈现。
  - `03-reliquary-short-desktop-1440x800.png`：短桌面（1440×800）视口下顶栏留空、图表缩放与首屏无滚动可操作性。
  - `04-reliquary-mobile-390x844.png`：移动端（390×844）单栏流式布局与触摸/无障碍适配。
  - `05-relics-pressed-ready-to-seal-1440x937.png`：三件遗物全部审查压印完毕，终极封印按钮 `#seal-btn` 动态解锁。
  - `06-remembrance-post-seal-1440x937.png`：终极封印印章生效后，AutoAdvance 自动转场至 `#remembrance` 痕迹页，8 卡 Grid 严格保持。
  - `07-remembrance-reset-confirm-panel-1440x937.png`：痕迹页底部无原生 `confirm()` 的内联主题化遗忘面板。
  - `08-post-reset-threshold-1440x937.png`：重置遗忘后平滑重置回 `#threshold`，`localStorage` 内 `goddead` key 数量为 0，DOM `hidden` 属性双向恢复。
  - `09-legacy-reliquary-html-redirect-1440x937.png`：访问离线/旧版 `reliquary.html` 时极简客户端跳转至 `index.html#reliquary`。
  - `10-reduced-motion-auto-advance-1440x937.png`：`prefers-reduced-motion` 下 6 行记录瞬间全显与 350ms 快转场。
  - `11-reliquary-timer-cancelled-offering-1440x937.png`：离开遗物科场景时定时器 (`AutoAdvance.clear("reliquary")`) 成功 cancel 验证。
  - `12-low-arrivals-authoritative-gate-1440x937.png`：`arrivals = 1` 但 7 项权威前置全部满足时，门仍按 `reliquaryUnlocked()` 契约允许进入。
- CDP 无头全自动 QA 与静态测试：无头全自动 CDP QA 覆盖 12/12 场景全覆测，Errors/Exceptions 严格为 0，运行时 ReferenceError 严格为 0；缓存升级至 `v27`；`node --check script.js`、`node tests/site.test.mjs` 与 `git diff --check` 全部干净通过。

## 本轮新增：焚献炉点火燃烧动态与转场（v26）

- 目标：在 `#offering` 场景中提交非空祷词时，为焚献炉提供真实的点火与烈焰燃烧视觉反馈，与自动转场调度深度联动。
- 素材：`assets/prayer-incinerator-burning.webp`（1536×1024），与静止炉体 `assets/prayer-incinerator.webp` 同构定位与裁切。
- 预加载与结构：在 `index.html` 的 `<head>` 中添加 `<link rel="preload" href="assets/prayer-incinerator-burning.webp" as="image">`；在 `<figure class="offering-figure">` 内部层叠双图（`.offering-idle-img` 与 absolute 叠放的 `.offering-burning-img`），初始 `aria-label` 设为「一座沉寂的焚献炉」。
- 视觉过渡：提交祷词时给 `.offering-figure` 添加 `.ignited` 类并将 `aria-label` 更新为「一座仍在燃烧的焚献炉」，静止炉体淡出（`opacity: 0`），燃烧炉体淡入并产生微量热浪扩张（`opacity: 1`, `transform: scale(1.015)`），过渡时间 `0.4s ease`；`prefers-reduced-motion` 下禁用 CSS 过渡（`transition: none !important`）；重新进入 `offering` 场景时清除 `.ignited` 类并恢复静止 `aria-label`。
- 自动转场与调度：`AutoAdvance` 调度器保持全局统一转场延迟（普通模式 900–1319 ms，减弱动画 350 ms），点火动画先于 `burnPrayer` 执行。
- 校验与契约：资源缓存升至 `v26`；静态测试 `tests/site.test.mjs` 全量包含对新增素材引用、预加载标签、HTML 双图结构、无障碍 label 状态切换、CSS ignited 动画规则、script.js 点火逻辑与 AutoAdvance 延迟边界的断言。

## 本轮新增：线性自动转场（Auto-Advance Flow，v24）

- 目标：把原先「主动作 → 底部前进按钮 → 二次确认按钮」的流程，改为「主动作完成 → 短反馈 → 自动进入下一场景」，不再要求用户滚动并点击继续。
- 实现：在 `script.js` 中新增统一 `AutoAdvance` 调度器，每个场景持有一个 scope timer，离场/重复触发时调用 `AutoAdvance.clear(scene)`/`clearAll()`；所有调度只在真实用户操作后发生，受 `initialRouteDone` 保护，因此持久状态恢复或直接打开 hash 时绝不会自己跳走。
- 九段自动转场：
  1. threshold 第三次敲门 → protocol
  2. protocol 首次主动激活任意守则 → corridor（仅 click/Enter/Space；hover/focus 不跳转）
  3. corridor 读到第三张残页 → watch
  4. watch 覆盖 05:02 记录 + 尝试签退 + 第四线路解锁 → switchboard
  5. switchboard 听完前三回线并接通第四线 → deadletter
  6. deadletter 归档三封退件并签收空白回执 → cancellation
  7. cancellation 检索 `GODDEAD` 并点击拒绝注销 → acting
  8. acting 电闸达到 100% → offering
  9. offering 首次提交非空祷词 → remembrance
- 终点：remembrance 与 ninth 不自动循环。
- 会话内消耗标记：`protocolConsumed` / `corridorConsumed` / `watchConsumed` / `cancellationConsumed` / `actingConsumed` / `offeringConsumed` 只在 timer 真正触发前的 `before` 回调里置 `true`；如果 timer 被回退导航取消，玩家回到该场景并再次执行相关主动作即可重新 schedule。直接 hash/刷新恢复持久状态时这些标记为 `false`，但没有任何用户操作触发 schedule，因此不会误跳。
- 反馈时长：普通模式约 0.9–1.4 s；reduced-motion 约 0.35 s，仍保留文字提示顺序。
- 切换行为：每次 `goScene` 将目标场景 `scrollTop` 归零，并把焦点移到新场景的 `.sec-title`/`.ninth-rule`/`.dead-title`（动态 `tabindex="-1"`），保证键盘与读屏顺序。
- 导航精简：删除了门外 进去/不进 选择按钮、所有线性路径上的底部前进按钮、以及 `answer`/`deliver`/`cancel`/`acting` 这类跨幕二次确认按钮；只保留目录抽屉与明确的回退导航，且没有向 `#offering` 的跨幕捷径。
- watch 主动交互原则：交班簿的 `pointerenter` 仅做被动揭字（`coverLogVisual`），不更新 `phoneCovered`、不 schedule；只有 `click` / `Enter` / `Space` 主动激活 05:02 时才写状态并触发 `tryScheduleWatch`。已 covered 的 05:02 再次主动点击仍可恢复 schedule。
- corridor 恢复：fragments ≥ 3 时，主动触碰任意残页（含已读）可恢复 schedule。
- cancellation 恢复：已 refused 后，再次主动提交检索表单可恢复 schedule。
- acting 恢复：已 appointed 后，`#acting-switch` 容器动态提升为可聚焦按钮（`tabindex="0"`、`role="button"`、aria-label），鼠标点击与 Tab+Enter/Space 均可恢复 schedule；未任命时该容器不附加可交互 role，避免与可用 range 嵌套冲突。
- switchboard 第四线与 deadletter 回执保留重复点击可重新 schedule。
- 提示：每个自动转场触发时通过 `toast`/就地 `answer-note`/`deliver-note`/`cancel-note`/`acting-note` 等告诉用户当前主动作与即将发生的状态变化。
- 保留：所有状态守卫、隐藏场景解锁条件、彩蛋、视觉素材、WebAudio 音效、localStorage 兼容、reduced-motion 立即完整揭示。

## 本轮新增：短桌面首屏可操作性 + 统计卡/焦点视觉优化

- 适用范围：宽度 ≥721px 且高度 ≤800px 的短桌面视口（验收尺寸 1440×800、1366×768）。
- 目标：消除「首屏只有大图、核心交互仍在折叠下方」的误解，让各场景进入后无需滚动即可操作第一个核心控件。
- 实现：`styles.css` 新增 `@media (min-width: 721px) and (max-height: 800px)`：
  - 相关场景 body 上内边距设为 `clamp(92px, 10vh, 130px)`，在固定顶栏与日期文字下方留出安全净空，避免 kicker/标题/焦点框重叠；同时仍保证首屏可见首个核心控件；
  - 限制位图 figure 高度（protocol 240px、switchboard/deadletter/cancellation/acting 230px、watch desk 140px），保持 object-fit 裁切而非缩成小图；
  - protocol/switchboard/deadletter/cancellation/acting 使用两栏网格：控件在左、位图在右；
  - watch 使用更紧凑的 `watch-room` 网格，签退按钮与桌椅并排，05:02 记录与签退均进首屏；
  - 不破坏 corridor/offering 的首屏可用性；不重新加入任何底部前进/二次确认按钮；不使用 fixed/sticky 覆盖内容。
- 统计卡文本溢出修复：`stat-num` 的长文本值（`未签退 · N`、`驳回`）添加 `.is-text` modifier，字号缩小并 `white-space: nowrap`，确保不越出卡片边界、不挤压相邻内容；数字型统计值保持原有视觉层级。`script.js` 通过 `setStatNum(el, value, isText)` 统一设置并切换 modifier。
- 标题焦点视觉优化：自动转场后聚焦标题时，浏览器默认亮蓝矩形改为非整框式主题反馈：`outline: none`，底部一条血线（`box-shadow: 0 2px 0 0 rgba(192, 74, 66, 0.7)`）加轻微文字光晕，既清楚可见又不包成输入框式矩形；作用于 `.sec-title`、`.ninth-rule`、`.dead-title`。
- acting-switch 键盘修复保留：未 appointed 时容器无 `tabindex`/`role`，不进入 Tab 顺序；appointed 后容器提升为 `role="button"`，鼠标点击与 Tab+Enter/Space 均可恢复 schedule。
- 资源缓存版本升至 `v24`（`styles.css?v=24`、`script.js?v=24`）。
- 回归结果（无头 Chromium）：
  - 1440×800 / 1470×718：protocol 守则其一、watch 05:02 与签退、switchboard 回线壹、deadletter 退件壹、cancellation 检索输入、acting range 全部完全可见，且 kicker/标题与顶栏无重叠；
  - 390×844：corridor/offering 仍首屏可操作，watch 因垂直叙事仍需滚动，其余场景核心控件可见，顶栏无重叠。

## 本轮新增：门外第三次敲门真实开门过渡（v25）

- 目标：把 threshold 的第三次敲门从「门缝微光 + 自动转场」升级为「闭门图 → 真实开门位图 → 自动转场」的连贯视觉动作，不再重新加入进入按钮、二次确认或要求滚动。
- 新增素材：`assets/threshold-bureau-door-open.webp`（1536×1024，~193 KB，Pillow quality=85 由监理提供的 source PNG 转码）；旧闭门资产 `assets/threshold-bureau-door.webp` 保留，不被覆盖。
- 预加载：`<link rel="preload" href="assets/threshold-bureau-door-open.webp" as="image">` 保证第三敲前已缓存，避免闪白。
- 布局：同一 `<button id="door-btn">` 内叠放两张 `<img>`（闭门 `#door-img` / 开门 `#door-open-img`），开门图 `position:absolute; inset:0`、默认 `opacity:0`、`aria-hidden="true"`，仅作视觉层、不参与屏幕阅读器朗读。两张图共用 `.door-img` 的 `width`、`height`、`object-fit`、`object-position`、mask 与所有响应式槽位（桌面 / 短桌面 / 720px / 390px），切换时只有 opacity 与极轻微的 scale(1.03) 纵深推进，不做 CSS 假走廊或炫光遮图。
- 状态机：
  - 第 1/2 次敲击维持闭门震动反馈；
  - 第 3 次敲击立即给 `#door-scene` 添加 `ajar` + `opened` 类，开门图淡入，状态文案改为「门已经开了。你侧身挤了进去。」，随即调度 AutoAdvance；
  - 开门视觉保持到场景切换，`before` 回调仅重置 `knocks` 与 `thresholdConsumed`，不会闪回闭门；
  - `prefers-reduced-motion` 下过渡时长坍缩，但仍切换到开门图并保留较短且可理解的自动推进；
  - 持久 `goddead_awake=true`（已完成仪式）或 timer 被取消后回到 `#threshold`，由 `syncDoorOpenState` 恢复开门视觉，并将门按钮 `aria-label` 改为「门已打开，点击或按 Enter、Space 继续」，鼠标或 Enter/Space 可主动重新调度；
  - 直接 `#threshold` 加载或持久状态恢复不会自行跳转。
- 缓存版本升至 `v25`。

## 本轮新增：现有场景视觉深化（Visual Enrichment）

- 目标：让门外、访客守则、走廊、焚献、痕迹、第九条六个公共/早期场景的视觉完成度追上已位图化的值夜室、交换台、投递所、注销科、代神席。
- 新增正式图片（均由 Codex 生成，Kimi 仅做 Pillow 转码与接入）：
  - `assets/threshold-bureau-door.webp`（门外主界面）
  - `assets/visitor-protocol-board.webp`（访客守则）
  - `assets/scripture-corridor.webp`（走廊）
  - `assets/prayer-incinerator.webp`（焚献）
  - `assets/remembrance-evidence-wall.webp`（痕迹）
  - `assets/ninth-aperture.webp`（第九条）
- 门外：原 inline SVG 线框门替换为原生 `<button id="door-btn">` 包裹 `<img id="door-img" src="assets/threshold-bureau-door.webp">`；保留三次敲门、Enter/Space、门缝微光、状态文案与 进去/不进 选择；旧门体 SVG 几何与对应 CSS 已移除。
- 守则：图片位于标题与真实八条规则之间，约 440–620px 可见高度，不压字。
- 走廊：图片作为 `.frag-field` 的底层空间，八张 `.frag` 仍在上层可点击、可聚焦。
- 焚献：炉体图在桌面位于右下，标题/输入/按钮/回应在上层；移动端标题 → 图片 → 输入依次可见，CTA 不被挤出首屏。
- 痕迹：证物墙作为 8 卡统计区背景，桌面 4×2、移动 2×4 不变，卡片对比清晰，未新增第九张卡。
- 第九条：裂口图作为场景背景，文字居于暗部上层，底部错误窄门可见但不可点击。
- 性能：首屏门图 preload，其余新图 `loading="lazy" decoding="async"`；所有 `<img>` 显式写 1536×1024。
- 缓存版本升至 `v22`；静态契约与全部隐藏场景守卫/状态保持不变。

## 本轮 QA（现有场景视觉深化）

- `node tests/site.test.mjs`：全量静态断言通过（含 v22 缓存、六张 WebP 素材存在与引用、门体 button/img 契约、旧门 SVG 几何清零、第九条 aria-label 全中文、favicon hero.png 声明、Space-only keydown fallback 静态契约）。
- 桌面/移动真实截图证据 12 张（`visual-*-desktop-v1.png` / `visual-*-mobile-v1.png`）均无横向溢出，控制台无 error/warning。
- 门外门图最终交付：Codex 生成 1536×1024 PNG，Pillow 转 WebP `quality=85`，体积 210 KB（≤220 KB），替换 `assets/threshold-bureau-door.webp`；因素材变化缓存由 `v21` 升至 `v22`。
- 门图 art direction：桌面默认 `.door-scene` 宽 `min(84vw, 640px)`、`.door-img` 高 `clamp(560px, 62vh, 680px)`、`object-position: center 38%`；短桌面（`max-width: 1440px` 且 `max-height: 860px`，覆盖 1440×800）高 `clamp(460px, 56vh, 540px)`、宽 `min(78vw, 520px)`；移动 ≤720px 高 `clamp(460px, 56vh, 580px)`、宽 `min(86vw, 420px)`；移动 ≤390px 高 `clamp(480px, 54vh, 560px)`、宽 `min(92vw, 340px)`。
- `seam-whisper` 随新裁切调整：桌面默认 `top: 60%`，短桌面 `top: 58%`，落点对应门缝/把手区域。
- 门的键盘最终策略：Enter 沿用原生 `<button>` click，Space 因 CDP 环境未触发原生激活，故补 Space-only `keydown` fallback（`e.key === " "` 时 `preventDefault()` + `knock()`），经 Codex 在真实 in-app browser 连续三次 Space 敲击验证 `#door-scene` 获得 `ajar` 类。
- 最终全量 CDP 回归（`/tmp/goddead-qa/cdp-visual-enrichment.mjs`）因传输层超时（`Input.dispatchKeyEvent: no CDP response within 20s` / `Page.navigate: no CDP response within 20s`）未能形成单次全绿，因此不记录 38/38。
- 旧隐藏场景套件在视觉素材接入后串跑全过：acting 40/40、cancellation 39/39、deadletter 35/35、line4 27/27。

## 视口与方法

- 桌面：1440 × 937（值夜室/交换台整室使用 1440 × 1700 加高视口以容纳整室）
- 移动端：390 × 844（走廊/值夜室使用 390 × 1500–1600 加高视口验证完整构图）
- 工具：无头 Chromium（chrome-headless-shell）经 CDP 驱动真实运行：预置 localStorage 状态后整页重载，执行真实点击、真实键盘事件（Enter/Space 激活语义按钮）与矩形相交检测；锁定/解锁两态均以此方式回归，非静态副本
- 静态断言：`node tests/site.test.mjs`

## 本轮证据（第三值夜室）

| 场景 / 状态 | 证据 |
| --- | --- |
| 门外（桌面 / 移动） | `design-qa-evidence/scene-threshold-desktop.png` · `scene-threshold-mobile.png` |
| 访客守则（桌面 / 移动） | `design-qa-evidence/scene-protocol-desktop.png` · `scene-protocol-mobile.png` |
| 走廊 · 未解锁（无门、无硬锁提示） | `design-qa-evidence/scene-corridor-desktop.png` |
| 走廊 · 墙上仅门框痕迹 | `design-qa-evidence/corridor-door-trace.png` |
| 走廊 · 窄门已出现（桌面 / 移动） | `design-qa-evidence/corridor-narrow-door.png` · `corridor-narrow-door-mobile.png` |
| 值夜室 · 默认（桌面 / 移动） | `design-qa-evidence/scene-watch-desktop.png` · `scene-watch-mobile.png` |
| 值夜室 · 交班簿全覆盖 + 动态登记 + 签退被拒（桌面 / 移动） | `design-qa-evidence/watch-covered-signout.png` · `watch-covered-signout-mobile.png` |
| 焚献 | `design-qa-evidence/scene-offering-desktop.png` |
| 痕迹 · 值夜记忆已登记 | `design-qa-evidence/scene-remembrance-watch.png` |
| 隐藏幕 · 第九条 | `design-qa-evidence/scene-ninth-desktop.png` |
| 复核 · 锁定态：直达 #watch 被拦回走廊，墙上无门 | `design-qa-evidence/watch-locked-guard-desktop.png` |
| 复核 · 解锁态走廊：窄门与 8 张残页零相交（桌面 / 移动） | `design-qa-evidence/corridor-unlocked-desktop-1440.png` · `corridor-unlocked-mobile-390.png`（残页区另见 `corridor-frags-mobile-390.png`） |
| 复核 · 值夜室键盘覆盖 + arrivals=0 动态登记 | `design-qa-evidence/watch-room-keyboard-covered-desktop.png` |
| 位图深化 · 值夜室整室（桌面 1440×1700 / 移动 390×1600） | `design-qa-evidence/watch-room-desktop-v2.png` · `watch-room-mobile-v2.png` |
| 第四线路 · 锁定态：直达 #switchboard 被拦回 #watch | `design-qa-evidence/switchboard-locked-guard.png` |
| 第四线路 · 守卫矩阵：0 残页直达 #switchboard 落 corridor | `design-qa-evidence/switchboard-guard-corridor.png` |
| 第四线路 · stale 守卫：line4=true + 0 残页直达 #switchboard 落 corridor（墙上无门） | `design-qa-evidence/switchboard-stale-guard.png` |
| 无主投递所 · 锁定守卫：清空状态直达 #deadletter 落 corridor | `design-qa-evidence/deadletter-locked-guard.png` |
| 无主投递所 · 整室（桌面 1440×1700 / 移动 390×1600） | `design-qa-evidence/deadletter-desktop-v1.png` · `deadletter-mobile-v1.png` |
| 无主投递所 · 签收终态（三封归档 + 签收空白件 + 终局记录） | `design-qa-evidence/deadletter-accepted-desktop.png` |
| 无主投递所 · 痕迹页「投 递 = 03」与投递记忆 | `design-qa-evidence/remembrance-deliver.png` |
| 神名注销科 · 锁定守卫：已接通未签收直达 #cancellation 落 deadletter | `design-qa-evidence/cancellation-locked-guard.png` |
| 神名注销科 · 整室（桌面 1440×937 / 移动 390×844 CSS 视口，2x 截图 780×1688） | `design-qa-evidence/cancellation-desktop-v1.png` · `cancellation-mobile-v1.png` |
| 神名注销科 · 检索命中 + 拒绝注销终态 | `design-qa-evidence/cancellation-solved.png` |
| 神名注销科 · 痕迹页「注 销 = 驳回」与注销记忆 | `design-qa-evidence/remembrance-cancellation.png` |
| 第四线路 · 接通终态（桌面，5 行记录） | `design-qa-evidence/switchboard-connected-desktop.png` |
| 第四线路 · 交换台整室（桌面 1440×1700 / 移动 390×1600） | `design-qa-evidence/switchboard-desktop-v1.png` · `switchboard-mobile-v1.png` |
| 第四线路 · 痕迹页「线 路 = 04」与线路记忆 | `design-qa-evidence/remembrance-line4.png` |
| 代神席 · 锁定守卫：refused 前 cancellation 内入口 hidden | `design-qa-evidence/acting-locked-guard.png` |
| 代神席 · 整室（桌面 1440×937 / 移动 390×844 CSS 视口，2x 截图 780×1688） | `design-qa-evidence/acting-desktop-v1.png` · `acting-mobile-v1.png` |
| 代神席 · 任命终态（range 锁定 + 五行 + 终句） | `design-qa-evidence/acting-appointed.png` |
| 痕迹页 · 代神席记忆与 offering 联动 | `design-qa-evidence/remembrance-acting.png` |
| 焚献 · 静止未点火（桌面 1440×800 / 移动 390×844） | `design-qa-evidence/offering-idle-desktop-v26.png` · `offering-idle-mobile-v26.png` |
| 焚献 · 点火燃烧动态（桌面 1440×800 / 移动 390×844） | `design-qa-evidence/offering-ignited-desktop-v26.png` · `offering-ignited-mobile-v26.png` |
| 焚献 · 减弱动画即时点火（桌面 1440×800） | `design-qa-evidence/offering-reduced-motion-v26.png` |

## 检查结果

- 门外 / 守则：与上一验收轮一致，未回退；标题歪斜、守则条目倾斜错位、"玖"异变均正常。
- 走廊：未满足条件时无门、无任何锁提示，仅门框痕迹偶现（证据 `corridor-door-trace.png`）；窄门出现后与残页无遮挡（初版与 f3 残页重叠，已调整至 right 10–11% 并提升层级后复检通过）；移动端门落于碎片列末端右下，可点达。
- 值夜室构图：桌面为「钟 + 交班簿」双栏歪斜构图，桌椅与签退居下；移动端为错位单栏（钟左倾、簿右倾），非整齐竖排，正文可读性优于走廊碎片。
- 钟（位图深化后）：正式旧钟面位图（`assets/watch-clock-face.webp`），时针分针定格 03:17；秒针为去绿幕透明 PNG（`assets/watch-second-hand.png`），与钟面同画布配准、绕真实轴心旋转，血色可见；秒针倒退与钟针轻响为 JS 运行时行为，截图无法呈现，以代码审查、CDP 回归与本地试听为准。
- 桌椅（位图深化后）：正式场景位图（`assets/watch-room-desk.webp`）替代内联 SVG 线框；四周黑场经 mask 羽化融入页面，亮度压至 0.94，桌面与移动端家具完整不裁切；椅影转为叠加在位图椅子上的模糊椭圆，仍由 JS 缓慢转向访客。
- 交班簿：5 条记录编号连续（值-叁-0466 ~ 0470），印章文字故意不可辨（余响观□所）；覆盖态下原句划线变淡、血红色改写句浮现；动态条按玩家抵达次数与残页数写成「本班新增访客：你」。
- 签退：按钮按下后进入永久拒绝态（disabled + 「你没有签到，无法签退。」），`goddead_watch` 持久化；痕迹页新增「值夜」卡片与值夜记忆行（证据 `scene-remembrance-watch.png`）。
- 声音：全部经由既有 WebAudio 引擎合成（日光灯 120Hz 低鸣、一次极远电话铃、钟针倒退轻响），无外部音频文件，服从全局静音与首次手势启动。音频无法在截图中验证，属人工验收边界。
- reduced-motion：全局 0.01ms 动画坍缩覆盖新组件；秒针、椅影缓动、门框痕迹循环在 JS 层按 `reduced` 跳过，叙事信息（交班簿五条、覆盖文本、签退结果）全部保留。
- 无横向溢出；桌面与移动端顶栏、目录抽屉、静音按钮均正常。
- 神名注销科：位图终端（`assets/divine-name-cancellation.webp`）经椭圆 mask 羽化融入 #050505，桌面与移动端主体完整不裁切；检索表单为原生 form，label/input/submit 关联正确；三次错误提示递进并在第三次后停住，Enter 提交 trim + 大写归一后的 `GODDEAD` 后五段档案按节奏显现，末段「注销对象已更正：见证者」；拒绝按钮随后显现，点击后登记 `refused` 并揭示两段驳回文案；痕迹页新增第八卡「注 销」与取消记忆行。
- 代神席：正式位图 `assets/acting-deity-desk.webp`（1536×1024，99KB）经 radial mask 羽化融入 #050505；原生 `input[type="range"]` 标签为 `代神席电闸`，min/max/step 0/100/1，两端文字 `离席`/`在岗`，`output` 同步 `在场：N%`，aria-valuetext 表达当前状态；0–33/34–66/67–99 三段反馈跟随区间、不死锁；到 100 后 range 锁定，五行任命档案按节奏显现，终句「你没有成为神。你只是接了祂没有交完的班。」；reload 完整恢复锁定态与 appointedAt；未任命时不剧透，任命后 offering 新增联动句、remembrance 新增一条记忆，8 卡网格不变。

## 复核（2026-07-20，CDP 真实运行回归，18/18 通过）

- 锁定态（fragments<3）：窄门与目录入口带 `hidden` 且计算样式 `display:none`（不进无障碍树），`focus()` 无法聚焦；`#watch` 直达加载、`location.hash` 篡改、`data-go="watch"` 合成点击三条路径均被路由守卫拦回走廊，地址栏经 `history.replaceState` 同步为 `#corridor`，不留假状态。
- 解锁态（fragments=3）：整页重载后窄门与目录入口的 `hidden` 同步移除（原子恢复），窄门淡入出现，可正常进入值夜室。
- 交班簿：5 条均为语义 `<button>`；CDP 注入真实 Enter / Space 键事件均可触发覆盖，覆盖后 `aria-pressed=true`、原文 `aria-hidden` 移出朗读、按钮 `aria-label` 只含当前改写文本（屏幕阅读器只读当前文本）；`:focus-visible` 描边在截图中可见（0467 条）。
- 动态登记：arrivals=0 时写成「抵达记录：未登记 · 带走残页 N 张」，全文无「第 0 次抵达」。
- 窄门遮挡：1440×1024 与 390×844 下窄门与 8 张残页矩形逐对相交检测均为零（门位于独立墙条，不与碎片区交叠）。
- 签退：点击后永久拒绝并持久化 `goddead_watch`，痕迹侧文案正常。
- 本轮临时 QA 副本 `__qa.html` / `__qa.js` 已删除；回归脚本与浏览器 profile 均在工作目录之外，不留仓库残留。

## 复核二（2026-07-20，位图深化，CDP 回归 16/16 通过）

- 独立验收 P2（内联 SVG 桌椅像线框占位、钟面偏简单）已修复：钟面与桌椅换为正式位图，秒针换为去绿幕透明 PNG；内联 SVG 几何（`.wc-*`、`.watch-desk` rect/ellipse）及其 CSS 全部移除，测试套件新增素材存在性 / 引用 / 旧几何清零断言。
- 秒针 PNG 与钟面同 900×900 画布配准，轴心对齐表盘几何中心（`transform-origin: 49.64% 49.4%`）；CDP 间隔读取确认 `rotate(6deg) → rotate(24deg)` 持续转动，倒转/轻响/reduced-motion 逻辑未动（reduced 下无内联旋转、交班簿 5 条文本完整）。
- 去绿幕质量：81 万像素中 79.5 万全透明、3314 半透明软边，不透明像素零绿溢（g 通道优势检查）；合成预览轴毂与钟面螺栓同心。
- 桌椅位图：1440×1700 与 390×1600 加高视口下家具完整、不裁切、无横向溢出；`brightness(0.94)` + 椭圆 mask 羽化，黑边自然融入，整体黑暗感保持。
- 对比度：交班簿底色 0.5→0.68、边框 0.14→0.18、正文字重 300→400、编号/钟注透明度上调，黑暗氛围不变。
- 缓存版本升至 v15；窄门锁定/解锁守卫、键盘 Enter/Space、arrivals=0 文案、签退持久化全部回归通过（证据 `watch-room-desktop-v2.png` / `watch-room-mobile-v2.png`）。

## 复核三（2026-07-20，第四线路 / 余响交换台 + 分层守卫修复，CDP 回归 37/37 通过）

- 分层守卫（P1 修复）：独立验收发现顺序 `if` 守卫可绕过——0 残页直达 `#switchboard` 时 switchboard 分支把目标改写为 watch 发生在 watch 守卫之后，导致未捡残页也能进值夜室。已将守卫集中为 `resolveScene`，按依赖顺序归并（switchboard→watch→corridor），任一前置门槛不满足即落到最终可达场景并归一地址；守卫顺序本身有静态断言。clean-storage CDP 矩阵全过：0 残页 `#switchboard`→corridor/#corridor、0 残页 `#watch`→corridor/#corridor、watch 解锁但 line4 未解锁→watch/#watch、双解锁→switchboard/#switchboard；且 0 残页下值夜室/交换台 `visibility:hidden` 不可见，真实鼠标点击 05:02 与签退位置无任何状态写入（证据 `switchboard-guard-corridor.png`）。
- 解锁守卫：未同时满足「覆盖 05:02 记录（值-叁-0469）+ 至少一次签退尝试」时，接听按钮（`#answer-box`）与目录入口（`#switch-link`）整体 `hidden` 且 `display:none`、不可聚焦；`#switchboard` 直达、hashchange 篡改、synthetic `data-go` 均被硬拦并归一地址。两种顺序（先覆盖后签退 / 先签退后覆盖）均立即、确定性解锁，aria-live 文案「桌下那部不存在的电话，开始第二次响。」；`phoneCovered` 与解锁态均持久化于 `goddead_line4`，跨 reload 保留。
- 接线簿：四个原生 `<button>`；前三条任意顺序可经点击与真实 Enter/Space 接通，`aria-pressed`、原文出树、动态文案（回线壹结合 awake、回线贰 prayers 0/非0 双分支、回线叁 fragments/arrivals/签退驳回）与 `heard` 持久化均验证；第四条出厂真 `disabled` 且有可读原因，前三条听完后原子启用并改名「肆 · 第四线路」。
- 第四线接通：5 行记录逐行显现（reduced-motion 下立即完整），aria-live 只播当前行；重载完整恢复终态且不重复播报（aria-live off）、`connectedAt` 不改写，重听可重放不累加。
- 痕迹页：新增「线 路」卡（未接通 — / 接通 04）与线路记忆文案，stat-grid 两视口自然成立。
- 声音：插头触点、线路底噪、断续远铃全部接入既有 AudioEngine 与全局静音，无音频文件；离场清底噪与定时器。
- 素材：`assets/line-four-switchboard.webp`（1400×846，49KB）经 mask 羽化融入 #050505；交换台场景零 inline SVG；1440×1700 与 390×1600 整室构图完整、主体不裁、无横向溢出。
- 缓存版本升至 v16；既有值夜室/焚献/遗物室解锁含义未动（静态契约测试与锁定守卫回归均覆盖）。

## 复核四（2026-07-20，stale line4 越级修复，CDP 回归 27/27 通过）

- 缺陷：`resolveScene` 只在 `!line4Unlocked()` 时把 switchboard 降级为 watch——`goddead_line4.unlocked=true` 但残页进度为 0 的陈旧状态（localStorage 残留/篡改）下直达 `#switchboard` 可以越级进入交换台。
- 修复：守卫从「依赖判断顺序」改为「每个场景声明自己的全部前置依赖」——进入 switchboard 必须同时满足 `watchUnlocked()`（三张残页）与 `line4Unlocked()`；任一不满足即向依赖链上游归并（switchboard→watch→corridor）并归一地址。入口可见性与路由共用同一组依赖：`syncLine4` 在残页不足时同样不得恢复接听盒与 `02¾ / 第四线路` 目录入口。
- 静态契约：测试套件断言 switchboard 守卫的联合条件 `!(watchUnlocked() && line4Unlocked())`、`syncLine4` 的同款前置、守卫级联顺序与地址归一；缓存版本升至 v17。
- CDP 真实运行矩阵（预置 localStorage 后整页加载 + 真实鼠标/键盘 + reload）27/27：
  - A 组（stale：line4 unlocked/connected=true、签退 1 次、0 残页）：直达 `#switchboard` 与 `#watch` 均落 corridor/#corridor；目录 02¾ 入口与接听盒保持 `hidden` 且 `display:none`；hashchange 篡改与 synthetic `data-go` 点击均被拦（证据 `switchboard-stale-guard.png`）。
  - B 组（0 残页无任何线路状态）：`#watch`、`#switchboard` 直达均落 corridor；窄门/目录入口不可聚焦；reload 后仍锁。
  - C 组（3 残页、线路未解锁）：`#watch` 保留、`#switchboard` 归一为 #watch；真实鼠标点击覆盖 05:02 + 真实 Enter 签退后确定性解锁（仅覆盖未签退时仍锁），接听盒/目录入口原子恢复并播 aria-live 公告；真实点击接听进入交换台；reload 后直达 `#switchboard` 成功。
  - D 组（3 残页 + 双解锁种子）：直达与二次 reload 均保留 switchboard，接通终态完整恢复，痕迹页「线 路 = 04」；随后把残页清零制造 stale 并整页重载，`#switchboard` 跌落 corridor 且 reload 后仍落 corridor。
- 回归脚本与浏览器 profile 均在工作目录之外（/tmp），不留仓库残留。

## 复核五（2026-07-20，无主投递所 / THE DEAD LETTER OFFICE，CDP 回归 35/35 + 旧套件 27/27 通过）

- 场景与资产：新增 `#deadletter`（标题 Goddead — 无主投递所，目录 `02⅞ / 投递所`）。正式位图 `assets/dead-letter-office.webp`（1536×1024，90KB，源 PNG 保留于工作区外，Pillow 转码），mask 羽化融入黑底，桌面中央空白回执在桌面与 390 移动构图均完整可见；场景零 inline SVG（静态断言）。
- 门禁：入口（交换台内语义按钮 + 目录链接）出厂 `hidden` 且 `display:none`、不可聚焦；仅在第四线路真正 `connected` 后原子恢复并播 aria-live「退回的东西，有了去处。」。`resolveScene` 守卫要求完整三元 `watchUnlocked() && line4Unlocked() && getLine4().connected`，级联 deadletter→switchboard→watch→corridor 并归一地址；`syncDeadletter` 与路由共用同一组依赖；`goddead_deadletter` 自身状态（含 stale `accepted=true`）不参与入口与守卫判定——CDP 矩阵：清空→corridor、仅 3 残页→watch、line4 未接通→switchboard、stale accepted + 未接通→switchboard、stale accepted + 0 残页→corridor（证据 `deadletter-locked-guard.png`）。
- 退件登记台：沿用交班簿/接线簿纸档案语言。三封退件为原生 button：真实鼠标与真实 Enter 均可归档，`aria-pressed`、原文出树、动态退回原因（第四次敲击来自门内·收件地址不存在；prayersOffered 0/非0 双分支——0 时「尚未投递，系统已提前分配封套」，N>0「灰烬不是邮资。共 N 份，全部留在原地」；残页转附件、抵达登记、签退申请全部视为续班）与 `goddead_deadletter.returned` 持久化均验证。
- 空白回执：出厂真 `disabled`，可读理由按剩余封数倒数（「还有 N 封退件未归档。」）；三封归档后原子启用并改名「签收空白件」。真实键盘签收后 6 行终局记录按节奏显现（末行「最后收件人：你。」），`accepted`/`acceptedAt` 持久化；reload 完整恢复、不重复播报（aria-live off）、`acceptedAt` 不改写；重读可重放不累加。
- 痕迹页：新增「投 递」卡（未签收 — / 签收 03）与投递记忆（未签收不剧透，签收后「你替一间没有收件人的邮局签收了自己。」），7 卡网格两视口自然成立（证据 `remembrance-deliver.png`）。
- 声音：气送管、印章、打印轻响全部接入既有 AudioEngine 与全局静音（静音持久化验证）；离场清理气送管定时器与记录 timers。reduced-motion：签收后 6 行立即完整，归档态正常恢复。
- 布局：1440 与 390×844 均无横向溢出，位图完整未裁切（宽高比 1.5 断言）；全程控制台无 error/warning/未捕获异常。旧套件（值夜室+第四线路 27/27）同环境重跑通过，既有语义未回退。
- 缓存版本升至 v18；回归脚本与浏览器 profile 均在工作目录之外（/tmp），不留仓库残留。

## 复核六（2026-07-20，神名注销科 / THE DIVINE NAME CANCELLATION，CDP 回归 39/39 + 旧套件 35/35 + 27/27 通过）

- 场景与资产：新增 `#cancellation`（标题 Goddead — 神名注销科，目录 `02⁺ / 注销科`）。正式位图 `assets/divine-name-cancellation.webp`（1536×1024，92KB，源 PNG 保留于工作区外，Pillow 转码），mask 羽化融入黑底，桌面与 390 移动构图均完整可见；场景零 inline SVG（静态断言）。
- 门禁：入口（投递所内语义按钮 + 目录链接）出厂 `hidden` 且 `display:none`、不可聚焦；仅在空白回执真正 `accepted` 后原子恢复并播 aria-live「空白回执生成了一个不该存在的案号。」。`resolveScene` 守卫要求完整四元 `watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted`，级联 cancellation→deadletter→switchboard→watch→corridor 并归一地址；`syncCancel` 与路由共用同一组依赖；`goddead_cancellation` 自身状态（含 stale `solved=true` / `refused=true`）不参与入口与守卫判定——CDP 矩阵：清空→corridor、仅 3 残页→watch、line4 未接通→switchboard、已接通未签收→deadletter 且入口仍 hidden、stale refused + 未接通→switchboard、stale refused + 0 残页→corridor（证据 `cancellation-locked-guard.png`）。
- 检索谜题：原生 form/label/input/submit；错误查询持久计数并递进提示，第三次后停住；鼠标点击 submit 与 Enter 键均可提交；trim + 大写归一后只认 `GODDEAD`；命中后 5 行档案按节奏显现（reduced-motion 立即完整），aria-live 只播当前状态，`solved`/`solvedAt` 持久化。
- 拒绝注销：5 行档案显现后原生 `拒绝注销` 按钮出现；点击后 `refused`/`refusedAt` 持久化， dull stamp 音效，两段驳回文案按节奏显现（reduced-motion 立即完整）。普通动画模式下，若 solve 后 150ms 内在同一 SPA 文档内点击 deadletter 出口离场（`leaveCancel` 清 timers），再点击 #cancel-btn 重进，`enterCancel` 先关闭两个 record 的 aria-live 再调用 `syncCancelScene`，按持久状态完整恢复 5 行档案与拒绝按钮，不重复 aria-live、不改写 solvedAt/refusedAt/queries，且仍可真实拒绝；reload 同样完整恢复、不重复播报（aria-live off）、solvedAt/refusedAt 不改写。
- 痕迹页：新增第八卡「注 销」（未拒绝 — / 拒绝后 驳回）与注销记忆（未拒绝不剧透，拒绝后「系统试图注销你。你把拒绝留在了档案里。」），8 卡网格在桌面 4×2 / 移动 2×4 自然排布（证据 `remembrance-cancellation.png`）。
- 声音：检索走卡轻响与拒绝印章接入既有 AudioEngine 与全局静音（静音持久化验证）；离场清理记录 timers。reduced-motion：检索/拒绝后文本立即完整，叙事信息保留。
- 布局：1440 与 390×844 均无横向溢出，位图完整未裁切（宽高比 1.5 断言）；全程控制台无 error/warning/未捕获异常。坏 JSON 容错验证通过。旧套件（无主投递所 35/35 + 第四线路 27/27）同环境重跑通过，既有语义未回退。
- 缓存版本升至 v19；回归脚本与浏览器 profile 均在工作目录之外（/tmp），不留仓库残留。



## 复核七（2026-07-20，代神席 / THE ACTING DEITY DESK，CDP 回归通过 + 旧套件 39/39 + 35/35 + 27/27 通过）

- 场景与资产：新增 `#acting`（标题 Goddead — 代神席，目录 `02† / 代神席`）。正式位图 `assets/acting-deity-desk.webp`（1536×1024，99KB，源 PNG 保留于工作区外，Pillow 转码），radial mask 羽化融入 #050505，桌面与 390 移动构图均完整可见；场景零 inline SVG（静态断言）。
- 门禁：入口（注销科内语义按钮 + 目录链接）出厂 `hidden` 且 `display:none`、不可聚焦；仅在注销科真正 `refused` 后原子恢复并播 aria-live「你的拒绝被改写成了一份任命。」。`resolveScene` 守卫要求完整五元 `watchUnlocked() && line4Unlocked() && getLine4().connected && getDL().accepted && getCancel().refused`，级联 acting→cancellation→deadletter→switchboard→watch→corridor 并归一地址；`syncActingEntry` 与路由共用同一组依赖；`goddead_acting` 自身状态（含 stale `appointed=true`）不参与入口与守卫判定——CDP 矩阵覆盖清空→corridor、仅 3 残页→watch、line4 未接通→switchboard、已接通未签收→deadletter、已签收未拒绝→cancellation 且入口仍 hidden、stale appointed + 上游缺失逐级回退（证据 `acting-locked-guard.png`）。
- 值守电闸：原生 `input[type="range"]`，label `代神席电闸`，min/max/step 0/100/1，两端文字 `离席`/`在岗`，hint `把在场推到不能再高的位置。`；`output` 同步 `在场：N%`，aria-valuetext 表达当前状态；鼠标、触控、方向键、Home/End 均可驱动。0–33/34–66/67–99 三段反馈跟随区间，不靠错误次数，不死锁。
- 任命：到 100 后 range 锁定，`appointed`/`appointedAt` 持久化，relay lock 音效；五行任命档案按节奏显现（reduced-motion 立即完整），随后终句「你没有成为神。你只是接了祂没有交完的班。」；reload 完整恢复锁定态、五行、终句，不重复 aria-live、不改写 `appointedAt`；未任命时 `value` 也持久恢复并夹在 0–100，坏 JSON 容错通过。
- 同页重进：任命动画中离场（`leaveActing` 清 timers）再重进，`enterActing` 先关 `aria-live` 再 `syncActingScene`，按持久状态恢复，不重复播报、不锁死；真实 data-go 点击用于同页重进，不用整页 `p.load` 冒充 SPA 离场。
- 痕迹页与旧场景联动：任命后 offering 新增联动句「这些祷词现在会先经过你。」（出厂 hidden），remembrance 新增一条记忆「你没有成为神。你只是接了祂没有交完的班。」，不增加第九张统计卡，8 卡网格不变（证据 `remembrance-acting.png`）。
- 声音：机械闸刀摩擦、触点敲击、继电器锁定全部接入既有 AudioEngine 与全局静音（静音持久化验证）；离场清理 timers。reduced-motion：任命后五行与终句立即完整，叙事保留。
- 布局：1440 与 390×844 均无横向溢出，位图完整未裁切（宽高比 1.5 断言）；原生 range 焦点清晰，移动端触控高度足够；全程控制台无 error/warning/未捕获异常。旧套件（神名注销科 39/39 + 无主投递所 35/35 + 第四线路 27/27）同环境重跑通过，既有语义未回退。
- 缓存版本升至 v20；回归脚本与浏览器 profile 均在工作目录之外（/tmp），不留仓库残留。

## 测试

- `node tests/site.test.mjs`：通过（v24）。覆盖场景存在性（11 个 data-scene，含 deadletter、cancellation、acting）、data-go 出口闭合、已删页面（echo / vein / confession）文件缺失且零引用、值夜室入口/状态字段（`goddead_watch`、`fragments >= 3`、签退拒绝文案）、值夜室位图素材契约（文件存在、页面引用、内联 SVG 几何清零、秒针配准轴心）、第四线路契约（接听提示出厂 hidden、路由硬拦、`goddead_line4` 字段、接线簿四按钮与第四条 disabled 理由、5 行接通记录、reduced-motion 立即完整、痕迹页线路卡）、无主投递所契约（素材存在与引用、零内联 SVG、入口提示出厂 hidden、完整三元守卫与级联顺序、`goddead_deadletter` 容错字段、三封退件按钮与回执 disabled→enabled 改名、6 行终局记录、reduced-motion、痕迹页投递卡）、神名注销科契约（素材存在与引用、零内联 SVG、入口提示出厂 hidden、完整四元守卫与级联顺序、`goddead_cancellation` 容错字段、原生 form/label/submit、三句递进提示、答案归一、5 行档案记录、拒绝按钮与 2 行驳回、reduced-motion、痕迹页注销卡与 8 卡网格）、代神席契约（素材存在与引用、零内联 SVG、入口提示出厂 hidden、完整五元守卫与级联顺序、`goddead_acting` 容错字段、原生 range/label/min/max/step/output/aria-valuetext/两端文字/三段反馈、100 任命/五行+终句/锁定、reload 不改 appointedAt、offering 联动、remembrance 联动、8 卡不变、reduced-motion、离场清 timers）、窄门/目录入口 `hidden` 契约与全局 `[hidden]` 保护、哈希路由关键节点、WebAudio-only 与静音字段、缓存 v24、文档同步（README / design-qa / ProgressLog），以及本轮新增的自动转场覆盖：`AutoAdvance` 统一调度器、九段 transition 调度、timer 取消、`initialRouteDone` 不误跳、scrollTop/焦点管理、reduced-motion 延迟、约 1 秒逐行揭示、protocol 规则 keyboard 激活、线性路径无前进/确认按钮、无 `data-go="offering"` 跨幕捷径，**另补边界：会话内消耗标记存在且在 `before` 回调置 true / `sceneInit` 重置、watch `pointerenter` 只做被动揭字不 schedule、主动 click/Enter/Space 才 schedule、cancellation/acting 回退后可恢复调度**；再补短桌面首屏可操作性、统计值防溢出、标题非整框式主题 `focus-visible`。
- CDP 真实运行回归：18/18（首轮）+ 16/16（位图深化轮）+ 37/37（第四线路轮，含分层守卫矩阵）+ 27/27（stale line4 越级修复轮）+ 35/35（无主投递所轮，另同环境重跑 27/27 旧套件）+ 39/39（神名注销科轮，另同环境重跑 35/35 + 27/27 旧套件）+ 代神席轮（旧套件 39/39 + 35/35 + 27/27 同环境重跑）通过（见上各节「复核」明细）。
- 边界：测试套件为 Node 静态断言，不启动 DOM；真实交互以本文件截图证据 + 本地人工验收为准。

## 历史

- 2026-07-19 门厅敲门仪式：通过（见 ProgressLog）。
- 2026-07-19 场景探索化 + 走廊残页与歪斜体系：通过（见 ProgressLog）。
- 2026-07-20 第三值夜室：本报告，桌面 1440 与移动 390 全场景复核。
- 2026-07-20 复核：CDP 真实运行回归 18/18（锁定/解锁守卫、交班簿键盘、arrivals=0 文案、窄门零遮挡）。
- 2026-07-20 位图深化：钟面/桌椅/秒针换正式素材，回归 16/16（见「复核二」）。
- 2026-07-20 第四线路 / 余响交换台 + 分层守卫修复：回归 37/37（见「复核三」）。
- 2026-07-20 stale line4 越级修复：守卫改为依赖声明制，回归 27/27（见「复核四」）。
- 2026-07-20 无主投递所：回归 35/35 + 旧套件 27/27（见「复核五」）。
- 2026-07-20 神名注销科：回归 39/39 + 旧套件 35/35 + 27/27（见「复核六」）。
- 2026-07-20 代神席：回归通过 + 旧套件 39/39 + 35/35 + 27/27（见「复核七」）。
- 2026-07-21 线性自动转场改版：统一 `AutoAdvance` 调度器、九段自动转场、约 1 秒揭示、焦点/滚动管理、导航精简、protocol 键盘激活、`node --check` / `node tests/site.test.mjs` / `git diff --check` 全通过，本地桌面与窄屏完整流程人工走通。

final result: passed
