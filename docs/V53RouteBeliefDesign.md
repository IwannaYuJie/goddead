# v53 归路信念污染 / THE ROOMS BELIEVE YOU

## 目标

深化已存在的 v39 归路核验站与三条路线，不再追加线性长走廊：

- 玩家跨多轮反复选择后，房间依据其「相信守则」还是「相信感官」发生可见变异。
- 变异达到阈值后，每张变异图的中央机关上出现第三热点，通向七条既有分支。
- v39 的两路线 / 自动结算 / 五档 outcome / first-lock / pending / reload / 守卫语义完全不变；
  v53 只观察已被 v39 接受的选择并附加自己的状态，绝不改写 v39 派生结算。

## 世界观

核验站原本只看「你在同一个岔口会不会做出相同的判断」。
走得多了，房间开始反过来相信你：相信守则的人，房间把守则画得越来越亮；
相信感官的人，房间把感官喂养得越来越大。两次回答互相矛盾的人，连守则自己都开始漂移。

## 素材（冻结，源 PNG 不覆盖、不重生、不裁切）

源 PNG（1536×1024，设计监理生成并冻结）：

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v53-echo-official-belief.png` | `6bbef54b463b8d158a55a2739be144bd81a49d7b0e7129ec2638226ddb137400` |
| `design-references/source-v53-echo-sensory-belief.png` | `d0f7bc8949a2373072d1460745faab05f247af81e82f525f95fd827f6e3765dc` |
| `design-references/source-v53-vein-official-belief.png` | `599d0a194112dc50f8ba9a1373f650b5713472d707ba6524859ab4adc779e31f` |
| `design-references/source-v53-vein-sensory-belief.png` | `494498d2f09fd0dd0f5f3e27d07ea950213ca5691a05e4336204e9e7cc4fba52` |
| `design-references/source-v53-confession-official-belief.png` | `343406e114fe67f3bcde763a916004aec265c52223b9de5b744354684a832e36` |
| `design-references/source-v53-confession-sensory-belief.png` | `0108b6d87759a01ebf804499c867141d31d26db9211ec8c03dbd192d8f15077c` |

转码（Pillow，WebP quality=85，原尺寸无裁切）：

- `assets/v53-echo-official-belief.webp` (`21b2d67c…`)
- `assets/v53-echo-sensory-belief.webp` (`2841182a…`)
- `assets/v53-vein-official-belief.webp` (`514e2e31…`)
- `assets/v53-vein-sensory-belief.webp` (`85992df7…`)
- `assets/v53-confession-official-belief.webp` (`05d148e8…`)
- `assets/v53-confession-sensory-belief.webp` (`75e41dde…`)

中性态继续用 v39 原图 `return-audit-{hall,echo,vein,confession}.webp`。

## 状态契约

独立 key（全仓库唯一）：`goddead_v53_route_belief`

```json
{
  "routes": {
    "echo":       { "official": 0, "sensory": 0, "lastChoice": "" },
    "vein":       { "official": 0, "sensory": 0, "lastChoice": "" },
    "confession": { "official": 0, "sensory": 0, "lastChoice": "" }
  },
  "contradiction": 0,
  "branches": {
    "counterKnockGallery":  { "visits": 0, "actions": 0 },
    "echoArchive":          { "visits": 0, "actions": 0 },
    "belllessWard":         { "visits": 0, "actions": 0 },
    "veinWell":             { "visits": 0, "actions": 0 },
    "blankNameCloakroom":   { "visits": 0, "actions": 0 },
    "confessionWeighing":   { "visits": 0, "actions": 0 },
    "protocolDrift":        { "visits": 0, "actions": 0 }
  },
  "pending": null,
  "history": []
}
```

派生值不信任存档：

- `globalOfficial = Σ routes[r].official`、`globalSensory = Σ routes[r].sensory`（总分永远从三路重算，伪造总分归一）。
- 每路变异态 `variantOf(route)`：`official>=2 && official>sensory` → `official`；
  `sensory>=2 && sensory>official` → `sensory`；否则（含平局）`neutral`。
- `pendingTarget`：经逐字段校验的 pending 的 target，否则 `""`。

归一规则：

- 坏 JSON / 数组错型 / 缺字段 → 安全默认。
- 数值有限、非负、向下取整、封顶 9999。
- route 白名单 `echo / vein / confession`；choice 白名单为该路两判断之一；`lastChoice` 非法清空。
- branch 白名单七个 key；visits/actions 同样封顶。
- `pending` 仅两种严格形状，逐字段校验（kind/route/side/target/feedback 全部白名单 + 逐字反馈重算），任一不符 → `null`（伪造 pending 归一）。
- `history` 有界：仅保留白名单形状条目，最多 16 条（`slice(-16)`）。
- `saveBelief` 只持久化 canonical 五部分（routes / contradiction / branches / pending / history.slice(-16)）；globalOfficial、globalSensory、variants、pendingTarget 四个派生字段永不落盘，每次读取重算。
- 与 v28–v52 及主线状态字节级隔离：v53 只读 v39 的「已接受判断」事件（挂在 `judgeAudit` 接受点之后），从不读写 v39 key。

## 计分规则（仅挂在 v39 接受点）

每当 v39 `judgeAudit` 真正接受一次判断（通过 first-lock、live-scene、pendingRoute 校验之后）：

- `first / pale / blank` → 该路 `official +1`；`loud / pulse / named` → 该路 `sensory +1`（各自封顶 9999）。
- 同一路 `lastChoice` 非空且与本次不同 → `contradiction +1`（第一次不算，相同重复不算）；随后 `lastChoice = choice`。
- 全局总分不另存，由三路求和派生，天然同步。
- 重复点击、锁定后 click、合成 click、reload 恢复均被 v39 既有守卫挡在钩子之前 → 零重复计分。
- `history` 追加 `{type:"choice",route,choice}`；阈值/翻转动作追加 `{type:"threshold"|"drift",...}`。

## 画面改造

### 1. `#return-audit` 枢纽

- 保留现有 4 个 v39 统计（已核 / 归路证 / 迷步 / 最佳归路），新增紧凑三统计：
  `守则信任 #belief-stat-official`、`感官诱信 #belief-stat-sensory`、`自相矛盾 #belief-stat-contradiction`；桌面与 390×844 均不溢出。
- 三张下方路线卡删除（`#audit-routes` 容器整体移除，无隐藏副本），改为黄铜大厅图内三个原生 button 热点，
  沿用原 id / 标题 / hint / `aria-pressed` / disabled 语义：
  - 左侧喇叭廊 → `#audit-route-echo`（进入回声岔廊）
  - 中间脉管闸 → `#audit-route-vein`（通过血管检票闸）
  - 右侧柜廊 → `#audit-route-confession`（打开忏悔寄存柜）
- contradiction >= 2 时，中央黄铜路线台上出现 `#audit-belief-flip`（翻转核验牌，原生 button，`hidden` 起步）：
  逐字反馈一拍后去 `#protocol-drift`；只记 v53 历史动作，不触碰 v39 进度，回来后核验继续。
- 无重复底部继续按钮。

### 2. 三个 route scene

图下两张判断卡删除，改为图内两个原生 button 热点，沿用原 id / 逐字标题 / 反馈 / `judgeAudit` 调用，
中性 / official / sensory 三态均可用：

- echo：`#echo-turn-choice-first` = 最近左门；`#echo-turn-choice-loud` = 最远 / 右侧大喇叭
- vein：`#vein-turnstile-choice-pale` = 中央苍白停搏空隙；`#vein-turnstile-choice-pulse` = 右侧红色脉管
- confession：`#confession-locker-choice-blank` = 前景左空白牌；`#confession-locker-choice-named` = 前景右有名牌

热点反馈后保持 v39 原本节拍与自动流程（节拍、自动回 hub、结算两段反馈全部不变）。

### 3. 变异图选择

进入路线场景（及计分后重绘）时按 `variantOf(route)` 即时切换单张 `<img>` 的 `src` 与 figure `aria-label`
（v51 同款单 img 交换，无闪错中间态，六张变异图 `new Image()` 预载）：

- official → `assets/v53-{route}-official-belief.webp`
- sensory → `assets/v53-{route}-sensory-belief.webp`
- neutral（含平局）→ v39 原图

figure 同时挂 `belief-variant-official` / `belief-variant-sensory` 修饰类（中性无类），
热点坐标按变异态用 CSS 覆盖（同一 DOM 元素，a11y 不变）。

### 4. 阈值第三热点

仅在对应路线变异态非中性时出现（`hidden` 起步，出现即原生 button 可聚焦），压在每张变异图新增的中央机关上：

| id | 路线 | 态 | 机关 | 目标 |
| --- | --- | --- | --- | --- |
| `#echo-turn-belief-threshold` | echo | official | 廊心台座铜盘 | `#counter-knock-gallery` |
| 同上 | echo | sensory | 台座斜置喇叭 | `#echo`（回声档案室） |
| `#vein-turnstile-belief-threshold` | vein | official | 中央苍白表盘 | `#bellless-ward` |
| 同上 | vein | sensory | 中央红色表盘 | `#vein`（血管维修井） |
| `#confession-locker-belief-threshold` | confession | official | 中央空白铜牌 | `#blank-name-cloakroom` |
| 同上 | confession | sensory | 中央忏悔秤 | `#confession`（忏悔称量室） |

每条阈值热点有自己的逐字标题 / hint / 反馈（见下「文案」）。
点击：校验 live scene + 实时重算的变异态非中性 + 与 v39 共享 first-lock
（`AutoAdvance.has("return-audit") || AutoAdvance.has("return-audit-step")` 时拒绝）；
接受后只写 v53（branch actions+1、history、严格 pending），不算作 v39 路线判断、
不污染 order/decision/settle；逐字反馈一拍后 AutoAdvance 去既有分支。
`before` 回调里清 pending、首访 visits+1（重复进入不重复首访计数）、保存。
reload 处于节拍中：重放逐字反馈并精确重挂一次转场，不重复计 actions。

### 5. 翻转核验牌（contradiction 路）

`#audit-belief-flip`：live scene = `return-audit`、实时重算 contradiction>=2、first-lock 共享；
接受后 actions+1（`protocolDrift`）、history、严格 pending，逐字反馈一拍后去 `#protocol-drift`。
`#protocol-drift` 直 hash 本就始终允许（v42 设计），守卫一行不加；只记 v53 历史。

### 6. 守卫窄例外（只加在最需要处）

六个阈值目标现状：

- `#counter-knock-gallery` / `#bellless-ward` / `#blank-name-cloakroom` / `#protocol-drift`：
  直 hash 本就开放，守卫不动。
- `#echo` / `#vein` / `#confession`（v29 守卫）：加一条窄例外——
  `beliefGuard.pendingTarget === target || beliefGuard.branches[key].visits > 0` 时放行；
  其余未访问直达仍落回走廊。v39 的 outcome 窄例外原样保留，原有正常入口全部不变。

### 7. 原生交互规范

- 所有新增可点物都是图内原生 `<button>`（`.forecourt-native-hotspot` 体系），无 div 伪按钮。
- 热点 ≥44px（min-width/min-height），`focus-visible` 金边 + 红下影，`aria-label` / 可读标题，
  `data-hover`，`.bb-short` 移动端短标签（aria-hidden，全标题留在 a11y tree）。
- `hidden` 时 `display:none` 不可聚焦；disabled 同步 `aria-pressed`。
- 鼠标、Enter、Space 可用；reduced-motion 缩短节拍但保留完整反馈。
- 交互碰到物件直接推进，页面底部不再有第二次点击。

## 热点坐标（1536×1024 舞台，百分比 left/top/width/height）

枢纽 `#return-audit`（`return-audit-hall.webp`，全态共用）：

| 热点 | left | top | width | height |
| --- | --- | --- | --- | --- |
| echo（左喇叭廊） | 15 | 18 | 24 | 50 |
| vein（中脉管闸） | 42 | 12 | 20 | 55 |
| confession（右柜廊） | 64 | 14 | 24 | 50 |
| flip（中央路线台，hidden 起步） | 45 | 68 | 12 | 18 |

回声岔廊 `#echo-turn`：

| 热点 | 态 | left | top | width | height |
| --- | --- | --- | --- | --- | --- |
| first（最近左门） | 全态 | 17 | 12 | 14 | 58 |
| loud | neutral | 52 | 34 | 12 | 16 |
| loud | official | 52 | 22 | 12 | 18 |
| loud | sensory（右墙巨喇叭） | 79 | 8 | 19 | 52 |
| threshold（台座机关） | official | 50 | 54 | 16 | 26 |
| threshold | sensory | 49 | 52 | 18 | 28 |

血管检票闸 `#vein-turnstile`：

| 热点 | 态 | left | top | width | height |
| --- | --- | --- | --- | --- | --- |
| pale | neutral | 45 | 36 | 11 | 26 |
| pale | official | 45 | 13 | 11 | 15 |
| pale | sensory | 46 | 16 | 10 | 14 |
| pulse（右侧红脉管） | neutral | 69 | 24 | 12 | 38 |
| pulse | official | 68 | 28 | 12 | 36 |
| pulse | sensory | 69 | 34 | 12 | 38 |
| threshold（中央表盘） | official | 44 | 33 | 13 | 26 |
| threshold | sensory | 44 | 35 | 14 | 24 |

忏悔寄存所 `#confession-locker`（全态共用判断坐标）：

| 热点 | 态 | left | top | width | height |
| --- | --- | --- | --- | --- | --- |
| blank（前景左空白牌） | 全态 | 37 | 74 | 11 | 12 |
| named（前景右有名牌） | 全态 | 53 | 74 | 10 | 12 |
| threshold（中央铜牌） | official | 42 | 30 | 16 | 18 |
| threshold（中央忏悔秤） | sensory | 42 | 27 | 16 | 22 |

移动端（≤720px）44px 增长后按 v49/v50 惯例用媒体查询错位覆盖，QA 在 390×844 实测零重叠、零裁切。

## 文案（新增，逐字冻结）

阈值热点：

- echo/official：标题 `转动廊心铜盘` hint `守则说，回声应该排队`
  反馈 `铜盘转了一格。所有回声同时安静下来，像在等点名。`
- echo/sensory：标题 `凑近台座的喇叭` hint `它一直在学你的呼吸`
  反馈 `喇叭里没有声音。只有你自己的吸气声，早了半拍。`
- vein/official：标题 `校准苍白表盘` hint `停搏的读数应该归零`
  反馈 `指针归零。闸机第一次承认自己也会累。`
- vein/sensory：标题 `贴上红色表盘` hint `听它跳得多急`
  反馈 `表盘里不是血。是很多只贴上来听过的耳朵。`
- confession/official：标题 `核对空白铜牌` hint `无名的牌子才是登记过的`
  反馈 `铜牌背面有一枚验收章：此名未使用。`
- confession/sensory：标题 `坐上忏悔秤` hint `它记得每一个名字的重量`
  反馈 `秤盘下沉。你的忏悔被称了两遍，两遍不一样重。`

翻转核验牌：标题 `翻转核验牌` hint `你的两次回答互相矛盾`
反馈 `铜牌翻面。守则自己也开始漂移。`

变异 figure aria-label：

- echo official：`回声岔廊守则变异：最近的门透出金边，廊心升起一座嵌铜盘的黑石台`
- echo sensory：`回声岔廊感官变异：右墙贴上巨型喇叭，红色声纹沿墙扩散`
- vein official：`检票闸守则变异：闸后缝隙更加苍白，中央表盘停在零`
- vein sensory：`检票闸感官变异：中央表盘涨成暗红，右侧脉管红得发亮`
- confession official：`寄存所守则变异：中央台上立起空白铜牌，两枚寄存牌并排静放`
- confession sensory：`寄存所感官变异：中央升起一台忏悔秤，右侧寄存牌烧出红色裂纹`

枢纽三统计：`守则信任` / `感官诱信` / `自相矛盾`。

## 目录与记忆

- Archive Directory 追加一条汇总：`01τ½ / 归路信念` → `#return-audit`
  （沿用 02α½ 式「 deepening 」编号，不破序号；有任何计分或分支访问即恢复显示）。
- Remembrance 新增一行信念记忆：`归路信念：守则信任 X，感官诱信 Y，自相矛盾 Z。`
  仍保持八张统计卡。
- 遗忘全部：v53 key 随全量清除移除，目录入口与记忆行复位。

## QA 契约

1. v39 静态契约全部不回归（原文、反馈、五 outcome、守卫、计分幂等）。
2. 六张 WebP 存在且被引用；六张冻结源 PNG 存在且哈希不变。
3. `goddead_v53_route_belief` 全仓库唯一；坏 JSON / 错型 / 负数 / 超大 / 伪造总分 / 伪造 pending 归一。
4. 计分只在 v39 接受点触发：official/sensory/contradiction 三分值规则、平局中性、严格占优。
5. 三态变异图即时切换、alt/aria-label 同步、平局回中性。
6. 阈值第三热点 hidden/tabIndex/focus 语义；live-scene 与 first-lock 校验；不计 v39。
7. 七条分支目标逐一实测；v29 三场景窄例外只放行合法 pending 或历史已访问。
8. contradiction>=2 翻转牌出现，去 protocol-drift 后 v39 进度不变。
9. 目录 `01τ½`、记忆单行、仍 8 卡、遗忘清除。
10. CDP 真实鼠标/键盘：1440×1024、1440×800、390×844 × 三路线 × 三态共 9 主画面，
    阈值 6 路、contradiction 路、重复/反转计分、reload、合成 click 零副作用、direct-hash 守卫、
    v39 五 outcome、console 零异常；截图存 `design-qa-evidence/v53-*`。
11. 每张冻结源 PNG 与同状态同 viewport 浏览器渲染并排目验：热点压物、移动端不裁物、标题/统计不溢出。

## 验收记录（2026-07-30 实测）

- 静态四检：`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`（2182 断言全绿，v53 相对基线 2119 新增 63）、`git diff --check` 全部通过。
- CDP 实机：`/tmp/v53-qa/v53-smoke.mjs`（真实 headless Google Chrome + 内嵌静态服务器 + 真实鼠标/键盘，种子 `addScriptToEvaluateOnNewDocument` 预注入）**916/916 连续两轮全绿**，控制台零异常。覆盖：三视口（1440×1024 / 1440×800 / 390×844）× 三路线 × 三态几何（图内/零重叠/自命中/≥44px/七项统计不溢出/1440×800 首屏可点）、三分值计分与同拍幂等、平局中性、严格占优、三态变异图与 aria-label、阈值六路（逐字反馈/精确落点/首访与动作计数/v39 字节级零污染/复点幂等/之后 v39 判断照常）、contradiction 翻转牌（落 protocol-drift、v39 零污染、返回继续核验）、v29 守卫四态（干净落走廊/合法 pending 放行/历史 visits 放行/伪造 pending 落走廊）、合成 click 与 off-scene click 零副作用、reload 节拍重播一次不重复计分、目录与记忆恢复、v39 五 outcome 回归、Tab/Enter/Space、console 零异常。存盘收口实测（E3）：同一存档 18 次阈值 + 2 次判断共 20 事件后，raw JSON 只有 routes/contradiction/branches/pending/history 五个 canonical 键、无派生键、history 精确 16 条，计分/首访/变异/reload 派生统计不回归。
- QA 缺陷记录：全量 D 段复点曾在场景 `visibility:hidden` 过渡窗口内被穿透吞掉（最小复现证明产品行为正确），QA `waitReady` 加固为 elementFromPoint 自命中轮询、反馈断言改轮询并加 capture 探针，修复后连续两轮全绿。
- 视觉证据 18 张 `design-qa-evidence/v53-01~18`：01 枢纽中性、02–04 三路线中性、05–10 三路线 official/sensory、11 枢纽翻转牌 1440×800、12 echo official 1440×800、13–16 移动端枢纽与三路线变异、17 阈值逐字反馈中间态、18 翻转落点 protocol-drift；六张冻结源 PNG 与同状态同视口渲染同轮并排目验一致（热点压物、移动端无裁切、标题/统计无溢出）。
- 保护边界：`docs/KimiUsageLog.md`、`assets/divine-name-cancellation.webp`、六张源 PNG 哈希不变；未执行 git add/commit/push/stash；未安装依赖。
