# v105 只出售昨日的早餐铺 · 设计与实现

日期：2026-10-05。设计、前端与测试：Claude；场景原画：本机 Codex CLI（内置 image generation）。状态：已实装。

## 1. 从 v104 接过来

v104 集齐四种醒来后留下了钩子：“住客终于醒来，早餐却还停在昨天。”v105 把这句话做成一章：唯一开着的早餐铺只卖昨天的早餐，而且只照昨天吃的顺序上。

> 早餐铺的门帘上挂着“昨日”的木牌。柜台上压着三张油渍小票，蒸笼里的东西都是昨天的。

## 2. 解锁与入口

- 永久解锁：`wakeForAnotherHotelUnlocked()` 且 v104 的 `AH_ENDING_IDS` 四项全收集（经 `store.memo` 缓存）。
- 临时可用：v104 有 pending 或 activeWake（晨铃还在路上、回执没带回前台）时，v105 入口禁用，提示“先把旅馆的晨铃回执带回前台”。
- 入口在痕迹室 v105 图鉴里，图鉴紧跟 v104 图鉴之后；v104 原有的 `#ah-hook` 文案保持不变。进度引导在 v104 完成后接到 v105（用 `typeof` 判断，v104 的独立测试单独抽取引导函数时会回落到原来的完成提示）。

## 3. 新交互：听单复述（序列记忆）

- 出餐台上六样早餐（粥、包子、豆浆、油条、咸蛋、茶）是按原画逐样定位的原生按钮。
- 小票被油浸透看不清，先点“听单”：店主按顺序念一遍，对应的早餐依次亮起，状态行同步念出“第 n 道：××”（`aria-live`），读屏用户同样能听到。听单不改任何进度，可以反复听。
- 然后按选好的上法一道道点菜；只要有一道不对，托盘就撤回、提示是第几道错了，从头再上。上齐且全对才能“出餐”。
- 端出的菜只放在内存里：换上法或换小票时清空，早餐在途时锁定。
- `ybTargetOrder` 与 `ybIsPrefix` 是纯函数。

## 4. 三张小票 × 三种上法

| ticket | 名称 | 昨天的顺序 | 送回 | 跑堂 |
| --- | --- | --- | --- | --- |
| `corridor-ticket` | 走廊夜班的那份 | 豆浆 油条 包子 粥 | `corridor` | 走廊跑堂 |
| `cancellation-ticket` | 注销科科员的那份 | 茶 粥 咸蛋 包子 茶 | `cancellation` | 注销科跑堂 |
| `acting-ticket` | 代神席的那份 | 粥 豆浆 包子 咸蛋 油条 茶 | `acting` | 代神席跑堂 |

| method | 上法 | 要上的菜 |
| --- | --- | --- |
| `as-yesterday` | 照昨天上 | 原样 |
| `reverse` | 倒着上 | 倒序 |
| `hold-last` | 留下最后一道 | 去掉最后一道 |

收集键 `ticket:method`，3×3 = 9。出餐后早餐送到那个房间，出现“早餐签收”（上法与实际上的顺序），点跑堂回早餐铺；该房间多一段随最近上法变化的记忆。

## 5. 听证

条件：三张小票都上过、三种上法都用过。最短三次。

| action | 裁定 | 抵达 |
| --- | --- | --- |
| `let-the-guest-pay-tomorrow` | 让客人明天再付 | `threshold` |
| `serve-yesterday-forever` | 永远只卖昨天 | `remembrance` |
| `close-the-shop-at-dawn` | 天亮就打烊 | `unending-gallery` |

## 6. 数据与边界

- 独立键 `goddead_v105_yesterday_breakfast`，version 105，十一字段：version、visited{shop, counter, court}、draft{ticket, method}、servings、courtOutcomes、servingRuns、courtRuns、latestMethodByTicket、lastOutcome、activeWaiter{serving}、pending。只读 v104，不写任何旧键。
- pending 七类（entry / ticket / serve / abandon / waiter-return / court-entry / verdict），按 kind 与当前状态重建期望对象，逐字段一致才接受。
- 前缀 `yb-`；模块内只有一个事件绑定点（真实点击助手）；存档内容只以 textContent 渲染；`yesterdayBreakfastBridgeAllows` 接入治理守卫与画廊守卫。三个新场景未解锁或无合法抵达时回痕迹室。

## 7. 美术

三张 1536×1024 由本机 Codex CLI 生成：灰白晨光里的早餐铺（三张小票压在夜班饭盒 / 铜印章 / 金边茶杯下）、一字排开六样早餐的出餐台、一圈空早餐长桌的听证厅（盖碗 / 账单签子 / 铜铃）。提示词与哈希见 `docs/V105ImagePrompts.md`。

## 8. 验收记录

- 测试：`site.test.mjs` 新增 v105 块，含三种上法的目标顺序（重复菜也能正确倒序）、前缀判断、锁定、v104 在途时禁用入口且提示、最短三次开庭（空托盘不出餐、听单不改进度、第 2 道上错撤回、上齐后不再收菜、出餐送达）、换法清盘、撤回重上、未知菜忽略、压回柜台、在途锁定、pending 生命周期、坏档与伪造字段、遗忘重置。`site.test.mjs: 18544 assertions passed`。
- v101–v104 的独立测试：场景数与缓存号升到 238 / `v=105`，并在它们抽取路由守卫、场景初始化、进度引导的沙箱里补上 v105 的桩；四个文件共 65 项全部通过。
- 浏览器（内置浏览器真实点击；存档由生成器重建：主线到 v90 + v91–v99 + 上游种子里的 v100–v103 + 四结局 v104）：痕迹室「下一步」指向 v105 且其图鉴自动展开；早餐铺三个热点对准三张小票；听单按 豆浆→油条→包子→粥 依次高亮并念出；先上豆浆、包子被判“第 2 道不该是包子”并撤回；再按顺序上齐，出餐送到走廊并显示早餐签收与记忆；控制台无报错。
