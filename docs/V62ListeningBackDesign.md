# v62 反听总台 / THE SIGNAL LISTENS BACK

## 目标

不往交换台主线堆新房间，而是深化 v46 的三间旁线房——
失席监听间（booth）/ 无号插孔场（jack）/ 回铃陈放室（morgue）：

- 原有九个 v46 动作的 id、文案、反馈、目标、mark、状态语义与
  `goddead_v46_sidetones` 内容逐字节保持；v62 只读 `getSidetone()` 判断解锁
  资格，绝不写 v46 key。旧三动作在基础态照常工作，v62 入口与它们共享同一场景
  第一归宿锁（`sidetone-` 作用域）。
- 解锁后三个旧房基础态各出现第四个图内入口，被接受后一拍逐字反馈自动进入
  新场景 `listening-back-console`（反听总台）。无底部继续卡、无确认按钮、
  无滚动后再点；所有互动都是图片内原生 `<button>`，真实 click/Enter/Space
  接受后立刻反馈、短停顿、自动转场。
- 总台三块图内线路板对应三房，点击后回对应旧房并切换为 v62 反听态图片
  （同 1536×1024，切图不改布局高度）：隐藏/禁用旧三 v46 动作与 v62 基础入口，
  显示三条 response 热点与一个图内「松线返回」热点。每房每轮只能接受一条
  response，不能同轮替换；所有分值从当前 cycle 的可信 history 派生。
- 前景接地刀：0–1 房已答 hidden+disabled；恰 2 房已答「提前接地」（按缺房
  吐回对应旧房）；3 房齐备「让总台接听」（27 组合九类完整结算）。

## 研究依据（2026-08-02 访问，只看机制，未复制任何 UI/资产/文本）

- OXENFREE 官方 press kit（https://nightschoolstudio.com/press-kit/oxenfree-press-kit/）：
  调频操纵环境并与超自然存在联系、选择影响故事——v62 的「反听」不是新房间，
  而是同一物件开始回应玩家此前的选择。
- OXENFREE 官方帮助（https://games-netflix.helpshift.com/hc/en/31-oxenfree/faq/1202-what-role-does-the-radio-play-and-how-do-i-use-it/）：
  用声画线索调频解谜/揭密——三条 response 的短签只指器物，不指结局。
- Killer Frequency 官方（https://www.team17.com/games/killer-frequency）：
  交换台、搜线索、决策与分支后果——总台三线路板 + 接地刀的决策结构。
- SIGNALIS 官方 Steam（https://store.steampowered.com/app/1262350/SIGNALIS/Signalis）：
  稀缺资源压力与复古技术谜题——每房每轮只接受一条 response，不可替换。
- Signal Lost 官方 Steam（https://store.steampowered.com/app/3920340/Signal_Lost_The_Silence_Between_Words/）：
  调频、探索越深越唤醒存在——「信号也在听」的反转。
- The Last Transmission 官方 Steam（https://store.steampowered.com/app/3684440）：
  无线电/电话/打字机与「它也在听」机制——暴露（exposure）作为第四分值。

全部画面热点、文案、分流语义为 Goddead 原创，沿用黑金血红视觉与
「点击即执行 → 短反馈 → 自动转场」规则；没有确认页、继续按钮、底部必点按钮。

## 素材（冻结）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v62-listening-back-booth.png` | `0d41de5d3ffef29d66be6c39d737e4d77c19b221c6cd18ac7e51e93859216c11` |
| `design-references/source-v62-listening-back-jack-field.png` | `fa5968b09710d0e34cadf093df98d965ead86331039db97c12ef65f1d517ebb2` |
| `design-references/source-v62-listening-back-ring-morgue.png` | `28a6b862d894f5696b88e6e2daf1318e6ef572e520b7f3db6b1e42595de14f1d` |
| `design-references/source-v62-listening-back-console.png` | `59ba101047287a6c9e0845e1906402953260a30a7242f4058b4a40db4d20b97c` |

WebP（1536×1024 无裁切 Pillow q85 转码，100–300KB，sha256 冻结于 tests/site.test.mjs）：

| WebP | 字节 | sha256 |
| --- | --- | --- |
| `assets/v62-listening-back-booth.webp` | 140368 | `8adc1ff729073fc8fd9dac794e24c90e46eec4949288d1b744de5258a7a98b7c` |
| `assets/v62-listening-back-jack-field.webp` | 196410 | `aa9e9b28a3e4c3af176f45effa4bb1694cb2011c2aa9927bf71e2510444e0fb7` |
| `assets/v62-listening-back-ring-morgue.webp` | 156818 | `94577d274759a28f763dbecb9e098f505fdfdfb3a93d4fad45fb2b5c5ff2c94a` |
| `assets/v62-listening-back-console.webp` | 216142 | `6a7b1051f5b380c293db77bdf9fe0d5d19c10e219266f050cb13cdb2be189cba` |

旧基础 WebP（unseated-listening-booth / unnumbered-jack-field /
return-ring-morgue）保持引用不变——基础态仍用旧图，反听态换 v62 新图。

## 解锁与三入口（逐字冻结）

解锁条件（只读 `getSidetone()`）：v46 的 booth/jack/morgue 三房 visited 全为
true，且合法 marks 至少 3 个。满足后三个旧房基础态各显示第四个图内入口；
不满足则 hidden 且 disabled。三入口与旧三动作共享 `sidetone-{room}` 第一
归宿锁；v46 或 v62 任一 pending 未决时入口零副作用。

| 入口 | 位置 | 短签 | 逐字反馈 |
| --- | --- | --- | --- |
| `listening-back-entry-booth` | 右侧铜喇叭阵列 | 听反线 | 最右侧铜喇叭没有发声，却慢慢转向你。墙后亮起一座不在值班图上的总台。 |
| `listening-back-entry-jack` | 墙面自绕线路/中央线路区域 | 追回授 | 游线没有插孔，却在墙上绕出一张朝内的线路图。中央总线向后退开。 |
| `listening-back-entry-morgue` | 后墙成排信号灯 | 看回灯 | 后墙红灯按你的呼吸次序逐盏亮起。陈放柜背后传来总台落锁的声音。 |

三入口都自动进入 `listening-back-console`。新增隐藏目录链接
`02μ½ / 反听总台`（02 系列 24 个希腊字母已全部占用，02δ½ 归 v61，取 v46
三入口首码 02μ 的紧邻半阶），只有真实到访 console 后出现。直接 hash 走窄
守卫：合法 pendingTarget、历史真实 console 到访或活动轮次（本轮任一
response 或 replayRoom）才准入；否则回退到第一个合法 v46 房（优先 booth，
再 jack，再 morgue，均未到访回 switchboard 并继续向下级联旧守卫），不放宽
任何旧守卫。

## 反听总台 `listening-back-console`

- 图 `assets/v62-listening-back-console.webp`：左侧失席线路板、中央无号
  线路板、右侧退回线路板、前景接地刀四个图内热点。
- 标题「反听总台」，英标「THE SIGNAL LISTENS BACK」，氛围句逐字：
  「你以为线路在等回答。它只是在决定先记住哪一段你。」
- 线路板展示本轮短语或空槽文案（接听失席线路 / 接听无号线路 /
  接听退回线路），aria-pressed 同步；已选 disabled，不能同轮替换。
- 四个派生读数「接收 / 回授 / 静默 / 暴露」+ 已接听 N/3（派生显示，
  永不落盘）；2/3 提示「两房已答。接地刀现在可以提前落下。」，3/3 提示
  「三房齐备。反听总台可以接听。」；不新增底部操作卡。

线路板反馈（board pending，逐字）：

| 板 | 反馈 |
| --- | --- |
| booth | 失席线路被抽回监听间。现在，听筒要记录你如何回答。 |
| jack | 无号线路重新展开。每个空孔都在等同一个回声。 |
| morgue | 退回线路亮起。那通已经挂断的电话要求再死一次。 |

「松线返回」不选答案，只用精确 return pending 回总台，反馈逐字：
「你松开线路。反听总台把这间房重新收回黑暗。」

## 九条 response（逐字冻结）

### booth（反听图 assets/v62-listening-back-booth.webp）

| 动作 | 按钮 | 短签 | 分值 | 短语 | 反馈 |
| --- | --- | --- | --- | --- | --- |
| hold-receiver | `listening-back-booth-hold-receiver` | 守听筒 | 接收2 暴露2 | 让无人听筒听完你的呼吸 | 耳筒没有传来声音。你停下呼吸后，它还替你多听了两秒。 |
| return-breath | `listening-back-booth-return-breath` | 回空话 | 回授2 暴露1 | 把未说出口的话送回总线 | 话筒把沉默压成一段回授。远端三只铜喇叭同时朝你偏了一寸。 |
| leave-seat | `listening-back-booth-leave-seat` | 留失席 | 静默2 暴露0 | 让失席继续空着 | 椅子没有等到操作员。总线只好把你的缺席登记成静默。 |

### jack（反听图 assets/v62-listening-back-jack-field.webp）

| 动作 | 按钮 | 短签 | 分值 | 短语 | 反馈 |
| --- | --- | --- | --- | --- | --- |
| bridge-aperture | `listening-back-jack-bridge-aperture` | 跨红孔 | 接收1 回授1 暴露2 | 跨接醒着的暗红孔 | 两端空孔同时接通。你听见的不是来电，是自己刚才触碰插头的声音。 |
| loop-plug | `listening-back-jack-loop-plug` | 回接游线 | 回授2 暴露1 | 让游线插头接回自己 | 插头绕过整面墙，最后咬住自己的尾端。回授沿每个空孔逐格亮起。 |
| ground-tag | `listening-back-jack-ground-tag` | 线签接地 | 静默2 暴露0 | 用空白线签接地 | 空白线签贴上接地触点。所有孔一起失去号码，也一起失去声音。 |

### morgue（反听图 assets/v62-listening-back-ring-morgue.webp）

| 动作 | 按钮 | 短签 | 分值 | 短语 | 反馈 |
| --- | --- | --- | --- | --- | --- |
| relight-lamp | `listening-back-morgue-relight-lamp` | 重亮回灯 | 接收2 暴露2 | 重亮被退回的信号灯 | 回铃灯重新亮起。后墙每一盏红灯都把同一次挂断递到你眼前。 |
| reverse-slip | `listening-back-morgue-reverse-slip` | 反送退单 | 回授1 静默1 暴露1 | 把退回单从背面送回 | 退回单卷向你，又从背面滑走。那通无人接听的电话开始倒着振铃。 |
| seal-bell | `listening-back-morgue-seal-bell` | 封死铃蜡 | 静默2 暴露0 | 把裂开的黑蜡重新压紧 | 蜡缝合拢前漏出一声极轻的吸气。铃碗随后连沉默也不再归还。 |

## 完整结算路由（纯函数，27 组合全部可达）

派生 receive/feedback/silence/exposure 只从当前 cycle 三条可信 history
重算，不持久化 totals/dominant/picked/eligible/pendingTarget。3×3×3=27
组合逐一枚举（静态断言冻结计数）：

| 条件 | 目标 | 组合数 | 反馈 |
| --- | --- | --- | --- |
| exposure === 0 | blank-name-cloakroom | 1 | 你没有给总线任何可辨认的声音。反听记录只剩一件没有姓名的外套。 |
| exposure >= 5 | witness-carbon-archive | 4 | 你暴露得太久。总线已经替每一次呼吸压出见证副本。 |
| exposure 1–2，回授严格最高 | counter-knock-gallery | 1 | 回授压过接收与静默。门内传来三下敲门，正照你的节奏还给你。 |
| exposure 1–2，静默严格最高 | blank-screen-underarchive | 6 | 静默压过其余两项。总线把声音擦成一块仍在监听的空白屏。 |
| exposure 1–2，其余并列 | switchboard | 2 | 低暴露的三项互相抵消。旧交换台要求你回去，从第一根线重新接听。 |
| exposure 3–4，接收严格最高 | proxy-admission | 3 | 接收压过回授与静默。代理准入处认定，你已经听见了不该由本人听见的声音。 |
| exposure 3–4，回授严格最高 | protocol-drift | 5 | 回授压过接收与静默。守则先听见自己的答复，随后开始偏移。 |
| exposure 3–4，静默严格最高 | false-confirmation-desk | 2 | 静默压过接收与回授。假确认台把没有发生的通话登记为已核实。 |
| exposure 3–4，其余并列 | chain-of-custody-office | 3 | 三项在高压线路上拉平。证物链办公室接管这段无法分清来去的声音。 |

合计恰 27。低暴露的 receive 分支不可达，不写。结算到达 before 才原子：
completedRuns+1、对应 outcomeCounts+1、lastOutcome=target、cycle+1、
清 replayRoom/pending；只对 `LEDGER_SCENE_KEY` 目标调用现有
`grantLedgerVisit(target)`；chain-of-custody-office 依赖 v60 已有开放契约，
不改 v60 key；其余目标不需要凭证，绝不直接改旧 localStorage。

## 提前接地（恰 2 房已答，逐字冻结）

| 缺房 | 目标 | 反馈 |
| --- | --- | --- |
| booth | unseated-listening-booth | 接地刀提前落下。未接听的失席线路保住了空白，反听总台把你吐回监听间。 |
| jack | unnumbered-jack-field | 接地刀提前落下。无号线路没有留下插孔，反听总台把你吐回插孔场。 |
| morgue | return-ring-morgue | 接地刀提前落下。退回线路没有再次振铃，反听总台把你吐回陈放室。 |

到达 before 才 cutRuns+1、lastOutcome=early-booth/early-jack/early-morgue、
cycle+1、清 replayRoom/pending；不增加 completedRuns/outcomeCounts，不写
v46。到达旧房必须恢复基础图、旧动作和可用状态。

## 状态契约

独立 key（全仓库唯一）：`goddead_v62_listening_back`，`version: 62`。

```json
{
  "version": 62,
  "cycle": 1,
  "visited": { "console": false, "booth": false, "jack": false, "morgue": false },
  "history": [],
  "completedRuns": 0,
  "cutRuns": 0,
  "outcomeCounts": { "blank-name-cloakroom": 0, "witness-carbon-archive": 0,
    "counter-knock-gallery": 0, "blank-screen-underarchive": 0, "switchboard": 0,
    "proxy-admission": 0, "protocol-drift": 0, "false-confirmation-desk": 0,
    "chain-of-custody-office": 0 },
  "lastOutcome": "",
  "replayRoom": "",
  "pending": null
}
```

- 只持久化白名单 canonical 十键（`saveListening` 显式投影）；scores/
  selections/picked/complete/eligible/dominant/exposure/pendingTarget 永不落盘。
- 归一：坏 JSON/数组/错型/version≠62 → 默认；计数有限、非负、向下取整、
  封顶 9999；visited 只接受 console/booth/jack/morgue 四布尔；history 只接受
  精确 `{cycle,room,action}` 三键、白名单、同 cycle 每房第一条，去伪去重、
  总长裁到 ≤16；outcomeCounts 只接受九个完整结算 target；lastOutcome 只接受
  九 target 或 early-booth/early-jack/early-morgue；replayRoom 只接受三房。
- pending 六类精确键集（额外键即伪造），scene/action/room/cycle/target/
  feedback 与当前可信 history/replayRoom/纯路由逐字重算，错 cycle 全归 null：
  - entry（旧房→总台）：恰好六键 `{kind,scene,room,target,feedback,cycle}`，
    证据 = replayRoom 空且该房本轮未答；
  - board（总台→旧房）：恰好六键 `{kind,scene,action,target,feedback,cycle}`，
    证据 = replayRoom 同房且该房本轮未答；
  - response（旧房→总台）：恰好七键 `{kind,scene,room,action,target,feedback,cycle}`，
    证据 = replayRoom 同房且本轮 history 恰有该条；
  - return（旧房→总台）：恰好六键 `{kind,scene,room,target,feedback,cycle}`，
    证据 = replayRoom 同房；
  - settle（总台→旧目标）：恰好五键 `{kind,scene,target,feedback,cycle}`，
    证据 = 三房齐备且 target/feedback 由当前派生分值逐字重算；
  - cutoff（总台→缺房）：恰好五键 `{kind,scene,target,feedback,cycle}`，
    证据 = 恰两房已答且 target/feedback 按缺房逐字重算。
- pendingTarget 只由合法 pending 派生。重播一次：reload/离开重返时逐字重播
  反馈并按原作用域精确重挂定时器，重新锁定相关全部热点并恢复被选项
  aria-pressed；被其他导航取消时 pending 可恢复，不能双结算。
- v62 只读写自己的 key；到达受守卫目标时只调用现有最窄 helper
  （`grantLedgerVisit`），不改写 v28–v61 或主线结果，不放宽 resolveScene
  任何旧守卫。

## 守卫 / 目录 / 记忆 / 遗忘

- console 窄守卫：合法 pendingTarget===console、visited.console 或活动轮次
  （本轮任一 response 或 replayRoom）放行；否则回退第一个合法 v46 房
  （booth→jack→morgue→switchboard），位于 v29 支线守卫之前，回退目标继续
  向下级联。
- 三旧房沿用 v46 既有语义（无直达守卫），v62 不加宽。
- 目录：`02μ½ / 反听总台`（首次真实到达 console 后原子恢复，随遗忘隐藏）。
- Remembrance 单行：`反听总台：完成 X 轮，提前接地 Y 次；本轮接收 R / 回授 F / 静默 S / 暴露 E，已接听 N/3。`
  未激活时 hidden，仍八张统计卡。
- 遗忘全部：v62 key 随全量清除移除；目录/记忆隐藏；三房图面/aria-label/
  入口/response/松线返回热点与旧三动作、总台四热点、读数、提示、disabled/
  aria-pressed/响应文本全部回弹出厂态。

## 热点坐标（1536×1024 舞台百分比 top/left/width/height，桌面/移动共用，44px 增长后互不重叠）

- booth 基础：入口 16/66/25/34（右侧铜喇叭阵列）。
- booth 反听：hold-receiver 16/9/14/46（左无人听筒）、return-breath
  30/36/12/20（桌面话筒）、leave-seat 50/40/20/42（空操作椅）、松线返回
  10/66/26/32（右侧铜喇叭阵列）。
- jack 基础：入口 5/42/28/38（墙面自绕线路/中央线路区域）。
- jack 反听：bridge-aperture 50/59/12/17（中央暗红孔）、loop-plug
  62/16/23/20（左前景游线插头）、ground-tag 36/76/15/50（右侧空白线签）、
  松线返回 5/44/26/28（上方自绕线路）。
- morgue 基础：入口 6/18/58/16（后墙成排信号灯）。
- morgue 反听：relight-lamp 56/9/14/20（左前景回铃灯）、reverse-slip
  56/28/29/28（中央退单托盘）、seal-bell 26/64/30/54（右侧黑蜡铃碗）、
  松线返回 5/16/62/18（后墙信号灯排）。
- 总台：board-booth 20/11/24/46、board-jack 20/39/23/46、board-morgue
  20/66/24/46、接地刀 70/37/28/26（前景）。

## 旧版本边界

- v46：九动作 ID/文案/反馈/目标/mark/状态语义与 `goddead_v46_sidetones`
  内容不变；v62 只读 `getSidetone()`（visited/marks/pending），绝不写 v46 key。
- v60：chain-of-custody-office 按现有开放契约，不改 v60 key。
- v57：`LEDGER_SCENE_KEY` 目标只用 `grantLedgerVisit`。
- 交换台第一归宿锁（switchSidetoneArmed / patch 守卫）不动；v62 入口挂在
  `sidetone-{room}` scope 上，与 v46 九动作互斥。

## QA 契约（本轮静态门）

1. 四张源 PNG sha256 冻结；四张 WebP sha256 + 100–300KB 冻结；三房反听图
   入 JS 互换表、总台图入 HTML；旧基础 WebP 引用不变；缓存版本 v=55。
2. 旧九动作 id/文案/反馈/目标/mark 逐字保持且按钮位于 figure 内；v46 key
   与守卫零改动。
3. 状态：唯一 key、version 62、canonical 十键投影、归一白名单、六类
   pending 精确键集逐字重算、派生永不落盘、不引用 v28–v61 键。
4. 九 response 短签/分值/短语/反馈逐字；三入口/三板/退回/提前接地文案
   逐字；27 组合枚举九类计数冻结（1/4/1/6/2/3/5/2/3）；路由九分支 +
   反馈逐字；低暴露无 receive 分支；接地刀 0–1 hidden、2 提前、3 结算。
5. 交互：currentScene/AutoAdvance/pending/isTrusted 四重边界；19 组监听
   合成点击零副作用；第一拍全锁；重播重锁 + aria 恢复；到达原子清场开
   新轮；ledger 目标最窄 helper。
6. 守卫/接线：console 窄守卫与合法回退、sceneInit 四场景、目录 02μ½、
   记忆单行、八卡不变、86→87 场景、遗忘全部 DOM 回弹、无底部继续控件。
