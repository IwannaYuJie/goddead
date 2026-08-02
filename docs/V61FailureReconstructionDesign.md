# v61 故障重演 / THE FAILURE RECONSTRUCTION

## 目标

不往 v60 尾部堆楼层，而是深化最早、目前最薄的 v30 三间深层分支——
失真转接室（echo-transfer）/ 逆流泵房（vein-pump）/ 无名罪籍库（confession-ledger）：

- 三间房基础态图内化：原 9 个动作的 id、文案、反馈、目标、v29/v30 状态副作用、
  lastChoice、首选锁与守卫逐字逐字节保持；三张底部 `.branch-choices` 卡片容器删除，
  按钮移入各自原基础图（基础 WebP 不换、不删）。
- 每间基础图新增一个「故障重演入口」热点（压在原图真实物件上），被接受后切换到
  对应 v61 重演 WebP：隐藏旧三动作与入口，显示三条证据热点与一个图内「退回重演台」
  热点；不新增图外选择卡。
- 三房证据选择汇入新场景 `failure-reconstruction-desk`（故障重演台）：
  三块证词板 + 压下重演总栓；分值（印证/失真/归责）只由本轮三个 selection 派生，
  永不持久化；27 组合枚举七类分流。

## 研究依据（2026-08-02 访问，只看机制，未复制任何 UI/资产/文本）

- 调查游戏的自由观察（The Case of the Golden Idol 一类）：线索自由取舍、
  组合成判断——v61 的三房证据可任意顺序取、反复替换，结论由组合派生。
- 异常目录的误判后果（The Operator 一类）：每条证据把事故归向不同档案口径——
  印证/失真/归责三分值决定事故被送去哪里。
- 现场重构与模拟仪器：重演不是新房间堆叠，而是同一房间内换一张「重演态」图，
  旧物件让位给仪器化的证物。

全部画面热点、文案、分流语义为 Goddead 原创，沿用黑金血红视觉与
「点击即执行 → 短反馈 → 自动转场」规则；没有确认页、继续按钮、底部必点按钮。

## 素材（冻结）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v61-failure-echo-transfer.png` | `d097c21e7a9fb1a6f8d2b8d9083d6ab03d748566594c050387e0d796487c651a` |
| `design-references/source-v61-failure-vein-pump.png` | `c79f86cba9873801164dd25aca287249684268bd246425a9c29a0ec1e039a24d` |
| `design-references/source-v61-failure-confession-ledger.png` | `2d160593b58031fe16f955586c14e5ad066e338247b619a3e2727bc4c46b9dfb` |
| `design-references/source-v61-failure-reconstruction-desk.png` | `8ff1e0071df9de684ecd60fc52633fba25a7539e1be2ebdaa69a5d0b6c05a392` |

WebP（1536×1024 无裁切 Pillow q85 转码，100–300KB，sha256 冻结于 tests/site.test.mjs）：

| WebP | 字节 | sha256 |
| --- | --- | --- |
| `assets/v61-failure-echo-transfer.webp` | 232388 | `7b60d379a292dbe034c3cc28f7554c6a2c154c811d5a5abe303b3581170c8cd9` |
| `assets/v61-failure-vein-pump.webp` | 244150 | `b8f73734da984d523a6045436b2e8a571e5e12338b0dc90db6a637158d726743` |
| `assets/v61-failure-confession-ledger.webp` | 193964 | `4be583eeb01557242486829cb55b60f4db445e09c6aa716d096aba2e9a7607c6` |
| `assets/v61-failure-reconstruction-desk.webp` | 270458 | `b3efea2bcc260786d9ba788a2fdb7795f4c325324a3a05a672cf105a5078438c` |

旧基础 WebP（echo-transfer-chamber / reverse-flow-pump-room /
nameless-ledger-vault）保持引用不变——基础态仍用旧图，重演态换 v61 新图。

## 状态契约

独立 key（全仓库唯一）：`goddead_v61_failure_reconstruction`，`version: 61`。

```json
{
  "version": 61,
  "cycle": 1,
  "visited": { "echo": false, "pump": false, "ledger": false, "desk": false },
  "selections": { "echo": "", "pump": "", "ledger": "" },
  "completedRuns": 0,
  "outcomeCounts": { "evidence-vault": 0, "protocol-drift": 0, "liability-ledger": 0,
    "false-confirmation-desk": 0, "witness-carbon-archive": 0,
    "blank-name-cloakroom": 0, "chain-of-custody-office": 0 },
  "lastOutcome": "",
  "replayRoom": "",
  "pending": null
}
```

- 只持久化白名单 canonical 九键（`saveFailure` 显式投影）；印证/失真/归责分值、
  说明句、是否齐备、可否结算全部由三房 selection 派生，永不落盘。
- 归一：坏 JSON/数组/错型/version≠61 → 默认；数值有限、非负、向下取整、
  封顶 9999；selections 逐房白名单；replayRoom 限 echo/pump/ledger；lastOutcome
  限七落点；outcomeCounts 七键各自封顶。
- cycle 是 v61 自己的轮次：结算到达时 +1；不与 v35 cycle 对齐。
- replayRoom 记录当前处于重演态的房间：入口点击/证词板点击时写入，
  到达 desk 时（clue/return pending 的 before）原子清除——刷新/离开后重返
  能正确恢复基础图或重演图。
- pending 按四类操作精确键集（额外键即伪造），target/feedback/action/scene/cycle
  逐字重算，证据与当前 selections/replayRoom 严格对应：
  - board（desk→房）：恰好六键 `{kind,scene,action,target,feedback,cycle}`，
    action 限三房、target 恒对应旧房场景、feedback 逐字、证据 = replayRoom 同房；
  - clue（房→desk）：恰好七键 `{kind,scene,room,action,target,feedback,cycle}`，
    证据 = selections[room] 恰为该 clue；
  - return（房→desk）：恰好六键 `{kind,scene,room,target,feedback,cycle}`，
    证据 = replayRoom 同房；
  - settle（desk→旧目标）：恰好五键 `{kind,scene,target,feedback,cycle}`，
    target/feedback 由当前派生分值经 `failureSettleRoute` 逐字重算，
    证据 = 三房 selection 齐备。结算到达后 selections 清空，pending 自然失效，
    绝不二次结算。
- 重播一次：reload/离开重返时逐字重播反馈并精确重挂定时器，重新锁定相关全部
  热点并恢复被选项 aria-pressed（同 v60 修复后的口径）。
- v61 只读写自己的 key；真正到达受守卫目标时只调用现有最窄 helper
  （liability-ledger → `grantLedgerVisit`、evidence-vault → `markReviewVisited`），
  不改写 v29/v30/v54/v57/v60 或主线结果，不放宽 resolveScene 任何旧守卫。

## 三房重演态证据（逐字冻结）

证据点击：live scene + 合法 action + 无同 scope AutoAdvance + 无 pending 后才有
副作用；先锁全部重演热点，selection 原子替换，持久化严格 pending，显示反馈，
一拍自动回重演台；到达 before 原子记 desk visit / 清 replayRoom / 清 pending。
同一房最多一个选择；重选同一证据只重播并回台，分值派生自然不变。

### echo-transfer（声筒 / 拨叉 / 铃牌 / 后方返回孔）

| 动作 | 分值 | 句段 | 反馈 |
| --- | --- | --- | --- |
| sealed-voice（触碰封存声筒） | 印证 +2 | 声音被封在蜡筒里 | 声筒回放了你尚未说出的尾音。它把这句证词归到曾经发生。 |
| cut-relay（检查断路拨叉） | 失真 +2 | 转接器自己剪断了来路 | 拨叉两端同时带电。线路不是被切断，而是在两边各自继续。 |
| late-bell（翻看迟到铃牌） | 归责 +2 | 迟到的铃替来电签了收 | 空白铃牌先落下蜡印，来电才在档案里出现。 |

### vein-pump（倒行表 / 沉积槽 / 三封签梯 / 后方返回门）

| 动作 | 分值 | 句段 | 反馈 |
| --- | --- | --- | --- |
| reverse-needle（读取倒行压力表） | 失真 +2 | 倒走的表针替事故加压 | 表针每退一格，管道就多出一段从未发生的压力。 |
| tagged-reservoir（查验责任沉积槽） | 归责 +2 | 黑沉积槽认领了回流 | 沉积物在空白名牌下凝固。没人签字，它却知道该向谁追责。 |
| triple-seal-ladder（核对三封签梯级） | 印证 +1、失真 +1、归责 +1 | 三枚封签让无号梯级同时作证 | 三枚封签互不相认，却在同一级梯上留下同一枚鞋印。 |

### confession-ledger（复写章 / 擦名刀与空账 / 红拒收屉 / 后方返回门）

| 动作 | 分值 | 句段 | 反馈 |
| --- | --- | --- | --- |
| witness-carbon（压下见证复写章） | 印证 +2 | 复写章证明见证人仍在场 | 第二张空纸先显出压痕。见证人还没出现，副本已经替他作证。 |
| erasure-blade（提起擦名刀） | 失真 +2 | 擦名刀把同一页改成两份 | 刀锋没有刮掉名字，只把同一处空白分成了两种说法。 |
| refusal-drawer（拉开责任拒收屉） | 归责 +2 | 拒收抽屉保存了责任人的位置 | 抽屉里没有姓名，只有一块始终为某个人留空的凹槽。 |

## 故障重演台 `failure-reconstruction-desk`

- 图内四热点：左转接室证词板 / 中泵房证词板 / 右罪籍库证词板 / 前景重演总栓。
- 三块证词板始终可点：空槽标签「选择转接室证据 / 选择泵房证据 / 选择罪籍库证据」，
  已有 selection 时标签变「重选：{证据短名}」且 aria-pressed=true；点击板立刻短反馈
  并自动去对应旧房的重演态（replayRoom 先行持久化），旧 selection 保留到该房点新
  证据为止——中途退回不误删。
- 总栓只在三房都有合法 selection 且无 pending 时显示/可用；不完整时 hidden 且
  合成点击零副作用。
- 说明行逐字：`{echoPhrase}；{pumpPhrase}；{ledgerPhrase}。`（空槽用气氛化占位：
  「转接室的证词槽还空着」等）；签条：印证 X / 失真 Y / 归责 Z / 已取证 N/3。

## 27 组合与七分流（已枚举核算）

Echo 纯印证2/纯失真2/纯归责2；Pump 纯失真2/纯归责2/三项各1；Ledger 同 Echo。
3×3×3=27 组合逐一枚举（静态断言冻结计数）：印证严格高 **3**、失真严格高 **7**、
归责严格高 **7**、印证=失真高 **2**、印证=归责高 **2**、失真=归责高 **2**、
三项全等 **4**——七类全部可达，合计恰 27。

总栓点击用当前派生值直接路由，不额外加分：

| 条件 | 目标 | 反馈 |
| --- | --- | --- |
| 印证严格高 | evidence-vault | 三段重演彼此印证。证词被送往异常保全库，等它继续证明自己。 |
| 失真严格高 | protocol-drift | 重演中的失真压过其余两项。守则被迫承认，故障发生在叙述之前。 |
| 归责严格高 | liability-ledger | 责任留下了最重的刻痕。事故被送回责任账房，重新称一次名字。 |
| 印证=失真且高于归责 | false-confirmation-desk | 印证与失真彼此作证。故障被送去假确认台，那里只记录一致的错误。 |
| 印证=归责且高于失真 | witness-carbon-archive | 印证与归责互相盖章。见证副本被送进复写库，等待原件承认。 |
| 失真=归责且高于印证 | blank-name-cloakroom | 失真与归责共同指向一个被擦掉的名字。事故寄存在空名衣柜。 |
| 三项全等 | chain-of-custody-office | 三项拉平。证物链办公室要求接手这次没有主因的事故。 |

到达目标 before 才原子 settle：completedRuns +1、对应 outcomeCounts +1、
lastOutcome 更新、cycle +1、三 selection 清空、replayRoom 清空、pending 清空；
liability-ledger 补 `grantLedgerVisit`、evidence-vault 补 `markReviewVisited`；
chain-of-custody-office 按 v60 现有开放契约，无需凭证。

## 守卫 / 目录 / 记忆 / 遗忘

- desk direct hash 窄守卫：合法 pendingTarget===desk、visited.desk 或活动轮次
  （任一 selection 或 replayRoom 非空）放行；否则回退到第一个合法的 v30 深房
  （深房自身守卫继续级联父支线/走廊），不放宽任何旧守卫。
- 三旧房沿用 v30 深房守卫（未到访直达回父支线），v61 不加宽。
- 目录：`02δ½ / 故障重演`（首次真正到达 desk 后原子恢复，随遗忘隐藏）。
  说明：规格原拟「02δ」，该编号已被 v43「02δ / 未应门」占用，取紧邻半阶 02δ½。
- Remembrance 单行：`故障重演：完成 N 轮；印证 A、失真 B、归责 C、拉平 D，本轮已取证 M/3。`
  （拉平 = 四种拉平落点合计），仍八张统计卡。
- 遗忘全部：v61 key 随全量清除移除；目录/记忆隐藏；三房图面/aria-label/入口/
  证据/退回热点与旧三动作、desk 四热点、说明句、disabled/aria-pressed/响应文本
  全部回弹出厂态。

## 热点坐标（1536×1024 舞台百分比 top/left/width/height，桌面/移动共用，44px 增长后互不重叠）

- 转接室基础：relay 54/27/16/19（左分线排）、seal 56/45/13/19（中央封存机）、
  bell 54/60/13/19（右弧形开关）、入口 20/58/13/20（右墙红蜡封签区）。
- 转接室重演：sealed-voice 47/24/13/21（左声筒）、cut-relay 54/43/15/19（中拨叉）、
  late-bell 52/61/17/22（右铃牌）、退回孔 14/43/13/19（后方黑洞）。
- 泵房基础：release 55/14/13/24（左泄压轮）、sediment 58/45/18/26（泵体底座）、
  ladder 12/72/13/58（右应急梯）、入口 48/86/13/22（右红灯区）。
- 泵房重演：reverse-needle 25/8/20/30（左倒行表）、tagged-reservoir 26/42/21/48
  （中央沉积槽）、triple-seal-ladder 16/74/13/45（右三封签梯）、退回门 2/46/13/23
  （后方拱门）。
- 罪籍库基础：crossout 52/16/13/19（左划名铜尺）、archive 40/63/13/19（右归档印章）、
  reject 62/73/14/25（前景红拒收屉）、入口 72/15/13/19（前景罪籍抽屉组）。
  说明：规格建议入口压「前景红色拒收抽屉区」，但该抽屉已承载旧 reject 动作，
  入口改压前景左侧罪籍抽屉组（同为真实物件，零重叠）。
- 罪籍库重演：witness-carbon 36/11/18/24（左复写章）、erasure-blade 36/36/29/23
  （中擦名刀与空账）、refusal-drawer 54/67/29/32（右红拒收屉）、退回门 7/44/13/24
  （后方黑门）。
- 重演台：board-echo 28/5/29/33、board-pump 27/35/28/34、board-ledger 27/66/29/34、
  总栓 62/38/24/33（前景手轮台）。

## QA 契约（本轮静态门）

1. 四张源 PNG sha256 冻结；四张 WebP sha256 + ≤300KB + >100KB 冻结；
   三房重演图入 JS 互换表、desk 图入 HTML；旧基础 WebP 引用不变。
2. 旧 9 动作 id/文案/反馈/目标/守卫逐字保持且按钮位于 figure 内；
   三旧 `.branch-choices` 容器删除无隐藏副本。
3. 状态：唯一 key、version 61、canonical 九键投影、归一白名单、
   四类 pending 精确键集逐字重算、派生永不落盘、不引用 v28–v60 键。
4. 九证据标签/分值/句段/反馈逐字；入口文案逐字；27 组合枚举七类计数冻结；
   分流七分支 + 反馈逐字；总栓齐备条件与 hidden 惰性。
5. 交互：currentScene/AutoAdvance/pending/isTrusted 四重边界；第一拍全锁；
   重播重锁 + aria 恢复；到达原子清场开新轮；旧守卫凭证最窄 helper。
6. 守卫/接线：desk 窄守卫与合法回退、sceneInit 四场景、目录 02δ½、记忆单行、
   八卡不变、遗忘全部 DOM 回弹。

## 本轮验收记录（2026-08-02）

- `node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`、`git diff --check` 全部通过；计数同口径实测：总计 4511 断言全绿，较 v60 的 4269 新增 242 条（v61 独立区块 236 条 + 全局集成 6 条）。
- 浏览器 QA（`/tmp/v61-qa/v61-smoke.mjs`，真实 headless Chrome + 真实鼠标/键盘 + console 捕获，种子预注入）**1047/1047 连续两轮全绿**，控制台零异常；第二轮完整日志 `/tmp/v61-qa/round2-full.log`；失败路径回收 Chrome，复跑后零残留进程。
- **CDP 抓出并已修复一处真实生产缺陷**：desk 窄守卫初版插在 v29 支线守卫之后，回退目标不再流经旧守卫，伪造直达可停在未解锁的 echo——已前移到 v30/v29 守卫之前，回退目标继续向下级联，并补守卫顺序静态断言。
- 目录编号说明：规格原拟「02δ / 故障重演」，02δ 已被 v43「未应门」占用，实装取紧邻半阶 `02δ½ / 故障重演`。罪籍库入口热点说明：规格建议压「前景红色拒收抽屉区」，该抽屉已承载旧 reject 动作，入口改压前景罪籍抽屉组（同为真实物件，零重叠）。
- 视觉证据 17 张 `design-qa-evidence/v61/`（13 张实装截图 + 4 张源图/实装并排对照，目检结论见 design-qa.md 本轮段落）。
- 保护边界：`docs/KimiUsageLog.md`、全部历史 source PNG 哈希不变；未执行任何 git 写操作；未安装依赖。
