# v54 迫近回访 / THE ROOMS MOVE WHEN UNSEEN

## 目标

不新增走廊，把早期 `#echo`、`#vein`、`#confession` 三间房真正变成图内可触摸、会共同记账和异动的循环：

- 九项 v29 旧选择全部移入画面，压在真实物件上；旧卡片容器整体删除。
- 三房共同记一本「迫近」账；迫近 >= 3 三房同步切到异动图；迫近 >= 6 长出第四热点。
- v29 全部旧 id、按钮文字、反馈、目标、lastChoice 语义与 v30 深层路线完全保留。

## 世界观

回声档案室、维修井、称量室从来不是三间房，是同一间的三个姿势。
你去得越多，它越确定你会回来——于是它在你不看的时候移动：
听井的铜圈发红，过压表越过最后一道刻度，横梁渗出红蜡。
移动六次，它就给你留一件只有你能取走的东西。

## 素材（冻结，源 PNG 不覆盖、不重生、不裁切）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v54-echo-approach.png` | `f58be816f9e18799de1e993f50a7ed9326a19f4b578704174dac8e8875e00db0` |
| `design-references/source-v54-vein-approach.png` | `84c733fbc222dda2f055114966e9375a2548eee5c48b3b69b9bf2663882021dd` |
| `design-references/source-v54-confession-approach.png` | `f7c94e882c19c51750de5735d5e3376da414bda628103c31bfeb0cba034efd27` |

转码（Pillow，WebP quality=85，1536×1024 原尺寸无裁切）：

- `assets/v54-echo-approach.webp`（148 KB）
- `assets/v54-vein-approach.webp`（140 KB）
- `assets/v54-confession-approach.webp`（140 KB）

平静态继续用 v29 原图 `echo-archive.webp` / `vein-maintenance-well.webp` / `confession-weighing-room.webp`。

## 状态契约

独立 key（全仓库唯一）：`goddead_v54_return_pressure`

```json
{
  "scores":   { "echo": 0, "vein": 0, "confession": 0 },
  "choices":  { "echo": { "knock": 0, "steps": 0, "bell": 0 },
                "vein": { "down": 0, "up": 0, "isolate": 0 },
                "confession": { "door": 0, "seven": 0, "refuse": 0 } },
  "breaches": { "echo": 0, "vein": 0, "confession": 0 },
  "pending": null,
  "history": []
}
```

- 只持久化 canonical 五部分（scores / choices / breaches / pending / history），
  `savePressure` 显式投影且 `history.slice(-16)`；派生字段永不落盘。
- 派生（每次读取重算）：`total = Σ scores`；`breachTotal = Σ breaches`；
  `approach = max(0, total − 6 × breachTotal)`。
- 归一：坏 JSON / 数组 / 错型 → 默认；数值有限、非负、向下取整、封顶 9999；
  scores/choices/breaches 白名单重建，未知键丢弃；
  history 仅保留 `{type:"choice"|"breach", room, choice}` 白名单形状，≤16 条。
- pending 严格白名单：恰好 `{room, choice, target, feedback}` 四键（额外键即伪造），
  room ∈ 三房、choice ∈ 该房三选、target 与逐字反馈由九分流映射重算；
  另须同时具备「确实刚消费过」的跨字段证据——`breachTotal >= 1` 且该房 `breaches >= 1`
  （从未消费过的干净伪存档直接拒绝）、`total >= 6 × breachTotal`
  （六点曾完整存在：接受时 breach 先 +1，存盘后 approach 已下降，校验不得再要求
  approach >= 6）、且 canonical history（先解析、≤16 条）最后一项正是同 room/choice
  的 breach。任一不符即归一为 null。
- 与 v29/v30 及一切旧 key 字节级隔离；v54 只挂在 v29 `chooseBranch` 接受点之后。

## 计分与共享守卫

`chooseBranch` 新增共享守卫（九个旧选择的反馈/目标/lastChoice 语义不变）：

1. `if (currentScene !== sceneKey) return;` —— 离场/合成调用拒绝；
2. `if (AutoAdvance.has(sceneKey)) return;` —— 转场锁定期连点拒绝，第一次接受生效；
3. v29 原行为（写 lastChoice、保存、反馈、调度）之后，才调 `recordPressureChoice`：
   该房 scores +1、该选择 choices +1（各封顶 9999）、history 追加。

重复点击、锁定后 click、合成 click、reload 恢复都被挡在钩子之前，零重复累计。

## 画面

- 三房 figure 升级 v49 3:2 `.forecourt-tactile-stage`；九项旧选择改为图内原生 button 热点，
  id / 逐字标题 / hint / aria-pressed / 反馈 / 目标全部不变；`.branch-choices` 旧卡容器删除，无隐藏副本。
- 热点落位（1536×1024 舞台百分比）：
  - echo：knock 左听井 11/58/15/14、steps 中听井 38/60/16/14、bell 右听井 68/62/16/14；
  - vein：down 左手轮 17/58/17/22、up 中拉杆 45/64/13/20、isolate 右拉杆 67/60/16/20；
  - confession：door 左信封盘 12/58/18/16、seven 中灰烬盘 41/62/18/15、refuse 右空盘 69/60/19/15。
- 迫近 >= 3：三房单 img 原子切换到对应 v54 异动图 + figure aria-label 更新（预载无闪烁）。
- 第四热点（出厂 `hidden`，不可聚焦；迫近 >= 6 且该房有合法 v29 lastChoice 才显示可用）：
  - echo「拿起断线听筒」55/19/12/18（中央架上的蜡封听筒）；
  - vein「读取过压表」43/2/15/22（顶部过压表）；
  - confession「拉开迫近抽屉」29/11/15/16（左上悬吊抽屉）。
- 三房各加一块紧凑 `.review-slip.pressure-slip` 四项读数：回声累计 / 脉压 / 名重 / 迫近 x/6。
- 所有热点 ≥44px、focus-visible、data-hover、移动端 .bb-short 短标签；一次点击反馈后自动转场，无底部二次按钮。

## 第四热点九分流（按该房合法 v29 lastChoice）

| 房间 | lastChoice | 目标 | 逐字反馈 |
| --- | --- | --- | --- |
| echo | knock | `#counter-knock-gallery` | 蜡封在听筒里裂开。门外那三记敲声被倒送进回敲廊。 |
| echo | steps | `#lagging-shadow-cloister` | 听筒没有线，脚步却从滞后的影子里接通。 |
| echo | bell | `#minute-before-archive` | 03:17 从听筒里提前了一分钟。档案井已经在等。 |
| vein | down | `#seeping-records` | 红柱顺流坠下，把井水压进渗水档案池。 |
| vein | up | `#reverse-laundry` | 指针倒着越过零。逆照洗衣房开始回流。 |
| vein | isolate | `#bellless-ward` | 玻璃里只剩一段无声脉搏。无铃病房替它开门。 |
| confession | door | `#blank-receipt-press` | 抽屉退回一张空白收据，敲门被压成未填项目。 |
| confession | seven | `#protocol-drift` | 第七条从抽屉背面翻出，守则的字开始漂移。 |
| confession | refuse | `#blank-name-cloakroom` | 黑色名带没有写字，却替你寄存了拒绝。 |

九个目标在当前路由契约下均无守卫（v35/v41/v42/v43/v44/v45/v47 场景直 hash 本就开放），
v54 不改任何守卫。

接受第四热点：live scene + 与 v29 共享 first-lock + **点击前** approach >= 6 + 该房合法 lastChoice；
随后该房 breach +1（等价消耗 6 点）、history、严格 pending，逐字反馈一拍后自动去映射目标；
`before` 回调只清 pending。刷新重播反馈并精确重挂一次，不二次消费、不二次转场；
允许继续累计形成多轮循环。

## 目录与记忆

- Archive Directory：`01δ½ / 迫近回访`（紧随 01δ，任何计分或异动即恢复显示）。
- Remembrance 单行：`迫近回访：回声累计 X，脉压 Y，名重 Z；房间在你不看的时候移动过 N 次。`
  仍保持八张统计卡。
- 遗忘全部：v54 key 随全量清除移除，目录/记忆/三房图全部复位。

## QA 契约

1. 九个旧选择原 id/原文/原反馈/原目标，一次点击直接自动转场，无底部选择卡。
2. v54 计分精确：scores/choices 各 +1；共享守卫挡掉合成/离场/连点/锁定调用。
3. 阈值 3：三房同步切异动图 + aria-label；阈值 6：第四热点显示/隐藏语义正确（含合法 lastChoice 条件）。
4. 九分流逐字反馈与精确落点；消费后 approach 下降；再次累计第二轮可用。
5. 坏 JSON / 数组 / 负数 / 浮点 / 超大数 / 未知键 / 伪造 pending 归一；
   raw JSON 只有 canonical 五键、history ≤ 16。
6. off-scene / 合成 / 快速连点 / 转场中 / 刷新：不重复累计、不二次转场。
7. v29/v30 状态在第四热点前后字节级零污染；旧选择除 v29 预期写入外无回归。
8. 键盘 Tab/Enter/Space、44px、非重叠、自命中、移动端短标签；console 零异常。
9. 1440×1024、1440×800、390×844 三房平静态/迫近态截图，源图与同视口渲染并排目验。

## 验收记录（2026-07-30 实测）

- 静态四检：`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`（2231 断言全绿，v54 相对基线 2182 新增 49）、`git diff --check` 全部通过。
- CDP 实机：`/tmp/v54-qa/v54-smoke.mjs`（真实 headless Google Chrome + 内嵌静态服务器 + 真实鼠标/键盘，种子 `addScriptToEvaluateOnNewDocument` 预注入）**744/744 连续两轮全绿**，控制台零异常。覆盖：三房 × 1440×1024 / 1440×800 / 390×844 × 平静/迫近几何（3:2 舞台、图内/两两零重叠/自命中/≥44px/四项统计签不溢出/无横向溢出/1440×800 首热点首屏）、九旧选择原反馈原目标 + 同拍幂等精确计分、共享守卫（off-scene 合成点击零副作用、hidden 第四热点程序化点击无效）、阈值 3 三房同步异动图、阈值 6 与合法 lastChoice 双条件显隐、九分流逐字反馈 + 精确落点 + 消费后 approach 归零 + 平静图恢复 + 第二轮再积 6 点二次消费、reload 节拍重播一次不二次消费、坏 JSON/数组/负数/浮点/超大/未知键归一（以统计签与显隐验证行为）、伪造 pending 四态全部丢弃无幻影转场（错反馈、breaches 超支、全白名单但从未消费 breaches=0/history=[]、证据齐全但含额外键）、合法 pending 刷新精确重播一次、同一存档 17 事件后 raw 只有五个 canonical 键 + history 精确 16 条、v29/v30 第四热点前后字节级零污染、v29 干净直达守卫不回归、Tab/Enter/Space 键盘全程、console 零异常。
- QA 自身两处修正（与产品无关）：容错读取 helper 需容忍坏 JSON 种子；归一断言应以统计签/显隐验证行为而非 raw 存储（归一发生在应用读取时，不改写 raw）。
- 视觉证据 12 张 `design-qa-evidence/v54-01~12`：01–03 三房平静态桌面、04–06 三房迫近态桌面（第四热点可见）、07–08 1440×800 平静/迫近、09–11 移动端、12 第四热点逐字反馈中间态（统计签已落 0/6）；三张冻结源 PNG 与同状态同视口渲染同轮并排目验一致——九旧热点全部压中听井/手轮/拉杆/秤盘，第四热点压中断线听筒/过压表/迫近抽屉，移动端短标签无裁切无互盖。
- 保护边界：`docs/KimiUsageLog.md`、`assets/divine-name-cancellation.webp`、全部 source-v53/v54 PNG 哈希不变；未执行 git add/commit/push/stash；未安装依赖；QA 后 Chrome 进程与临时 profile 已清理。
