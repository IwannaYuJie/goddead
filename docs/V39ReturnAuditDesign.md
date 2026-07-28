# v39 归路核验站 / THE ROUTE-OF-RETURN AUDIT

## 目标

把新内容继续压在游玩前段，而不是再向结局尾部堆场景：

- 访客守则「其五」从只显示一句反馈，升级为真实分流入口。
- 玩家在一个可自由选择顺序的三岔枢纽里，任选两条路线核验。
- 每条路线进入一个全新的区域；一次判断后自动返回枢纽。
- 第二条路线判断完自动结算、自动分流，没有“下一步 / 确认 / 继续”按钮。
- 结果既看判断正误，也看玩家走错的是哪条路；中间档会把玩家送进对应的既有区域。

守则其五原文与点击反馈必须逐字保留：

- 原文：`回声、血管与忏悔都可以进入。进去之前，确认你还记得回来的路。`
- 反馈：`回来的路，你还记得吗？`

## 世界观

门后机构不相信“我记得路”这种口头陈述。

凡声称从回声、血管或忏悔中回来的人，都要在归路核验站重走两段路。核验站不问你从哪里来，只看你在同一个岔口会不会再次做出相同的判断。第三条路故意不让你走：机构认为完整的记忆太像伪造，缺一段反而更可信。

## 场景与入口

### 入口

- 守则其五 → `#return-audit`
- `RULE_DETOUR[5] = "return-audit"`
- 点击时登记 `entry="protocol"` 与 mark `answeredProtocolFive`
- 首选锁继续沿用现有 `AutoAdvance.has("protocol")`
- 直接 hash `#return-audit` 只登记 visited，按 `entry="direct"` 开启或恢复，不自动选择路线

### 新场景

1. `#return-audit` — 归路核验站
2. `#echo-turn` — 回声岔廊
3. `#vein-turnstile` — 血管检票闸
4. `#confession-locker` — 忏悔寄存所

### 目录与痕迹

- 访问后目录恢复：`01τ / 归路核验`
- Remembrance 新增一行归路记忆，不新增统计卡，仍保持 8 张卡
- 遗忘全部时清除 v39 key、目录入口与记忆行

## 归路核验站

画面：黑石地下换乘厅，中央是一张没有文字的黄铜路线台，三道窄门分别以声波纹、脉管和封蜡器物暗示回声、血管、忏悔。线路只画两段，第三段在黑暗里被剪断。

状态条：

- 已核 `0/2`
- 归路证 `0`
- 迷步 `0`
- 最佳归路 `0`

三个可选路线卡：

1. `进入回声岔廊`
   - hint：`最响的那声，总是最晚到达`
2. `通过血管检票闸`
   - hint：`红灯亮时，闸机正在吞咽`
3. `打开忏悔寄存柜`
   - hint：`写着你名字的格子并不属于你`

规则：

- 任意顺序。
- 已完成路线 disabled + `aria-pressed=true`。
- 未完成路线仍可选择。
- 第一次完成后自动返回核验站；不自动替玩家选择第二条。
- 第二次完成后自动结算。
- 一轮只核验两条，第三条留给下一 cycle。

## 三条路线

### 1. 回声岔廊 / THE ECHO TURN

画面：同一扇黑门沿弧形回廊重复出现，黄铜听音管在每扇门间穿行。最近的门最暗，最远的门反而像贴在眼前；地面波纹由远到近依次扩散。

提示：

`三次呼唤都用了你的声音。最响的那次最后才发生。`

判断：

- `跟随最先出现的回声` — 正确，`+1 归路证`
- `跟随最响的回声` — 错误，`+1 迷步`

即时反馈：

- 正确：`你走进最轻的那声。其余回声晚了一步，没能穿上你的影子。`
- 错误：`最响的回声替你回答。岔廊把它登记成了先到的人。`

### 2. 血管检票闸 / THE VEIN TURNSTILE

画面：黑石检票厅，粗大的暗红脉管穿过黄铜闸机。三盏红灯随脉搏涨落；一次苍白的停搏在闸口留下短暂空隙。没有人体、没有血腥肢体。

提示：

`每次红灯亮起，闸机都在把什么送回更深处。`

判断：

- `趁苍白停搏穿过` — 正确，`+1 归路证`
- `跟着红色脉冲前进` — 错误，`+1 迷步`

即时反馈：

- 正确：`停搏给你让出半步。闸机没有来得及记住你的体温。`
- 错误：`红色脉冲把你夹进管壁。下一次心跳带走了你的方向。`

### 3. 忏悔寄存所 / THE CONFESSION LOCKER

画面：狭长黑石寄存室，两侧是黄铜小柜与黑蜡封条。中央台上放着一枚空白寄存牌，旁边一枚牌子像刚被擦掉名字。柜门缝里有纸页轻微起伏，不出现可读文字。

提示：

`这里收走忏悔，也收走说出忏悔的人。`

判断：

- `领取空白寄存牌` — 正确，`+1 归路证`
- `领取写着自己的那枚` — 错误，`+1 迷步`

即时反馈：

- 正确：`空白牌没有认出你。所有柜门同时假装从未打开。`
- 错误：`你的名字从牌上消失，随即从每只柜子里被念了一遍。`

## 自动结算

两条路线完成后，先保留第二条路线的即时反馈一个可感知节拍，再显示结算反馈并自动转场。

| 派生结果 | 条件 | 反馈 | 目的地 |
| --- | --- | --- | --- |
| `verified` | 2 归路证 / 0 迷步 | `两段路线互相承认。守则允许你继续记得回来。` | `#protocol` |
| `lost` | 0 归路证 / 2 迷步 | `两段路线都指向你身后。回返夹道已经替你转过身。` | `#return-passage` |
| `echoed` | 1/1，错在 echo | `错误的回声先一步抵达档案室。它正在等原件签收。` | `#echo-archive` |
| `pulsed` | 1/1，错在 vein | `闸机把迷路登记成一次维护请求。血管井已为你开盖。` | `#vein-maintenance-well` |
| `confessed` | 1/1，错在 confession | `寄存柜拒绝退还你的名字。忏悔称量室负责核对重量。` | `#confession-weighing-room` |

第二条路线完成后：

1. 路线即时反馈保持一拍。
2. 自动回到 `#return-audit`，显示结算反馈一拍。
3. 自动进入派生目的地。

不得同步覆盖即时反馈，不得新增结算按钮。

## 状态契约

独立 key：

`goddead_v39_return_audit`

建议字段：

```json
{
  "visited": false,
  "entry": "direct",
  "cycle": 0,
  "pendingRoute": "",
  "order": [],
  "decisions": {},
  "settleDone": false,
  "bestRecall": 0,
  "totalAudits": 0,
  "marks": []
}
```

派生字段不要信任存档：

- `completedCount`
- `recall`
- `misstep`
- `wrongRoute`
- `settled`
- `outcome`

修复规则：

- route 白名单仅 `echo / vein / confession`
- decision 必须是该 route 的两个合法 choice 之一
- `order` 过滤非法、去重、最多 2 项
- 只保留按 `order` 形成连续合法前缀的 decisions
- off-order / off-route decisions 全部丢弃
- `pendingRoute` 只能是未完成的白名单 route；否则清空
- recall / misstep / wrongRoute / settled / outcome 全部从合法 decisions 重算
- `settleDone` 只标记结算副作用是否执行，不参与结果派生
- 数值有限、非负、向下取整并封顶 9999
- 坏 JSON、数组错型与伪造 outcome 安全归一
- v28–v38 与主线状态字节级隔离
- 修复状态在下一次正常保存时持久化

## 交互与时序

- 路线卡与判断按钮支持鼠标、Enter、Space。
- 选择路线后立即反馈并自动进入对应区域。
- 判断一旦接受，当前区域两按钮立即 disabled。
- 同一节拍内竞争点击只记一次。
- 离场清除 route step / settle timer，不得幽灵回跳。
- 刷新恢复 pending route 或已完成列表，不重复计分。
- reduced-motion 缩短延迟但保留完整两段反馈。
- 返回核验站后焦点落到第一个未完成路线卡。

## 视觉规格

- 延续 Goddead 现有黑石、旧铜、黑蜡、单一暗红警示灯。
- 1536×1024，中心主体适配桌面与移动端中心裁切。
- 无可读文字、数字、UI、徽标、水印。
- 不用怪物正脸；恐怖来自路线、器物与空间逻辑错误。
- 归路核验站三岔口必须一眼可辨，但不能做现代地铁站。
- 子场景必须保留同一机构的材料与灯光语言，同时各自有独立轮廓。

## 素材

监理生成并保留源 PNG：

- `design-references/source-return-audit-hall.png`
- `design-references/source-return-audit-echo.png`
- `design-references/source-return-audit-vein.png`
- `design-references/source-return-audit-confession.png`

Kimi 转码为页面引用 WebP：

- `assets/return-audit-hall.webp`
- `assets/return-audit-echo.webp`
- `assets/return-audit-vein.webp`
- `assets/return-audit-confession.webp`

## QA 契约

Kimi 实现后新增 v39 smoke / visual，并至少覆盖：

1. 守则其五原文、反馈逐字不变，只改目的地。
2. 规则首选锁、键盘入口、直接 hash。
3. hub 三路线可见，任意顺序，已完成 disabled。
4. 三个区域各自两判断、逐字即时反馈。
5. 第一次判断自动回 hub，玩家自由选择第二条。
6. 第二次判断即时反馈 → 结算反馈 → 自动目的地，两段节拍。
7. verified / lost / echoed / pulsed / confessed 五种真实 UI 路径。
8. 同节拍竞争输入只记一次。
9. reload / 离场清 timer / reduced-motion。
10. order + decisions 的 off-route、跳位、伪造分值与 outcome 修复。
11. v28–v38 与主线字节级隔离。
12. 目录 `01τ`、痕迹单行、仍 8 卡、遗忘清除。
13. 1440×1024、1440×800、390×844 首屏与触达尺寸。
14. 四张源图与四张 WebP 存在、引用、解码，控制台零异常。
15. v38 / v37 近邻回归。

实现边界继续保持：Kimi 写全部 HTML/CSS/JS/测试/文档；Codex 只提供设计、素材和独立验收。
