# v71 死亡外交部 / MINISTRY OF MORTAL DIPLOMACY

日期：2026-08-10
状态：已实现，Codex 独立浏览器验收通过（6881 assertions）
前置：v70 已覆盖三选区、四议案、三种公民权归属，并真实收集三条宪政危机结局

## 一句话概念

姓名共和国、影子反对国与肉身政权各自派出一位并不完整的使节，前往三座不可能存在的国家：出生以前的国、记忆以后的共和国、肉身内部的领土。玩家为使团选择四种条约条款，生成 3 × 3 × 4 = 36 份死亡条约；当三使团、三外国与四条款全部出现，外交部会进入一场从未宣战的战争。

## 设计边界

- v71 只读 v70 的规范状态，只写独立 key `goddead_v71_death_diplomacy`，绝不修改 v70 或更早状态。
- 解锁必须同时证明 v70 decrees 覆盖三 caucus、四 motion、三 citizen，且三条 crisisOutcomes 全部真实存在；只伪造危机结局或只覆盖法令均不能进入。
- 新增四个场景，场景总数 113 → 117：
  - `#death-foreign-ministry`：死亡外交部，选择三支不完整使团。
  - `#nonexistent-border-chancery`：不存在国境署，选择三座不可能国家。
  - `#treaty-autopsy-table`：条约解剖台，选择四种外交条款。
  - `#undeclared-war-room`：未宣战室，选择三种外交崩塌结局。
- 新增 3 × 3 × 4 = 36 份死亡条约，以及 3 条未宣战结局，共 39 格 v71 图鉴。
- 合法重访相同组合会增加 diplomaticRuns 与对应 embassyTallies；图鉴 treaties 仍只记录首次发现。
- 条约按 counterpart 落到三个不同时代的旧场景：出生以前的国落到 v66 反事实纺锤，记忆以后的共和国落到 Remembrance，肉身内部的领土落到 v70 宪法分籍台；每处留下独立外交信使，可返回外交部继续谈判。
- 三使团、三外国与四条款全部覆盖后即可开启未宣战室，不要求集齐 36 份条约。
- 所有新增交互使用原生 button、click/Enter/Space、首击落锁、短反馈后自动转场；不增加二次确认页。
- v71 不实现 v72 UI，只留下可验证的三条 warOutcomes 作为未来证据。

## 解锁证据

`deathDiplomacyUnlocked()` 必须从规范 `getDeadParliament()` 同时证明：

1. `decrees` 至少覆盖：
   - caucuses：`ratified-born / removed-visitor / blank-citizen`
   - motions：`right-to-name / right-to-shadow / right-to-body / right-to-die-once`
   - citizens：`name / shadow / body`
2. `crisisOutcomes` 精确包含：
   - `the-name-became-the-only-citizen`
   - `the-shadow-founded-the-opposition-republic`
   - `the-body-abolished-dead-suffrage`

不得使用 v71 自己的 treaties、warOutcomes、visited 或 pending 反向证明解锁。

Remembrance 普通入口文案：

`替三个不完整的国家递交国书 ⟶`

入口反馈逐字冻结：

`姓名、影子与肉身终于各自建国。它们没有共同边境，只好把死亡改造成外交渠道。`

## 第一幕：死亡外交部

场景：`#death-foreign-ministry`
标题：`04γ / 死亡外交部 · MINISTRY OF MORTAL DIPLOMACY`
图：`assets/v71-death-foreign-ministry.webp`

一座由墓碑档案柜、骨瓷护照压机与旧黄铜电报管组成的外交大厅。左侧是只剩称呼的白色姓名面具，中间是穿使节长袍却没有身体的影子，右侧是佩戴空白勋章的无头肉身。三支使团左 / 中 / 右清楚分离。

| delegation | 按钮标题 | feedback | tally |
| --- | --- | --- | --- |
| `name-legation` | `派出无身姓名使团 · SEND THE BODILESS NAME LEGATION` | `姓名把自己的发音折进国书。使节没有嘴，却要求所有外国先学会正确称呼它。` | `embassyTallies.name` |
| `shadow-mission` | `派出流亡影子使团 · SEND THE EXILED SHADOW MISSION` | `影子从脚下脱离，披上没有国徽的使节袍。它携带一片永远不承认光源的领土。` | `embassyTallies.shadow` |
| `body-consulate` | `派出无名肉身领事团 · SEND THE NAMELESS BODY CONSULATE` | `肉身在胸口别上空白勋章。每一道伤口都被列为可以签署条约的领事。` | `embassyTallies.body` |

点击后写入 `draft.delegation`，创建严格 delegation pending，进入不存在国境署。重访时 draft 必须先归零再开始新一轮。

## 第二幕：不存在国境署

场景：`#nonexistent-border-chancery`
标题：`04δ / 不存在国境 · BORDERS OF NONEXISTENT STATES`
图：`assets/v71-nonexistent-border-chancery.webp`

三道不可能的边境彼此隔离：左侧护照门通向出生以前的空摇篮国；中间的黑色档案雾通向所有人忘记之后仍继续执政的共和国；右侧的肋骨海关通向肉身内部、器官之间的微小领土。

| counterpart | 按钮标题 | feedback | treaty 落点 |
| --- | --- | --- | --- |
| `before-birth-country` | `访问出生以前的国 · VISIT THE COUNTRY BEFORE BIRTH` | `边检员把护照日期翻到出生以前。那里的人口全是尚未决定要不要发生的人。` | `counterfactual-spindle` |
| `after-memory-republic` | `访问记忆以后的共和国 · VISIT THE REPUBLIC AFTER MEMORY` | `档案雾擦掉使节来处。共和国只承认已经无人记得的国家，因为它们最不容易再次灭亡。` | `remembrance` |
| `inside-body-state` | `访问肉身内部的国 · VISIT THE STATE INSIDE THE BODY` | `肋骨海关在胸腔内盖章。每个器官都自称边境，血液则拒绝申报自己的国籍。` | `constitutional-severance-desk` |

点击后补全 `draft.counterpart`，创建严格 counterpart pending，进入条约解剖台。

## 第三幕：条约解剖台

场景：`#treaty-autopsy-table`
标题：`04ε / 条约解剖 · AUTOPSY OF A TREATY`
图：`assets/v71-treaty-autopsy-table.webp`

一张黑色解剖桌把一份活着的条约摊开成四个互不遮挡的器官：左上是互相照不到对方的承认镜，左下是包着空摇篮的庇护护照，右上是被封蜡铁链锁住的复活心脏，右下是等待引渡的微型棺匣。四项条款必须在桌面端与移动端拥有独立热点。

| clause | 按钮标题 | feedback 尾句 |
| --- | --- | --- |
| `mutual-recognition` | `签署互相承认 · SIGN MUTUAL RECOGNITION` | `两国互相承认对方存在，条件是双方都不必证明自己真的存在过。` |
| `asylum-for-unlived` | `庇护未活之人 · GRANT ASYLUM TO THE UNLIVED` | `条约把尚未出生者列为政治难民，并允许他们逃离本来会发生的人生。` |
| `resurrection-embargo` | `禁运复活 · EMBARGO RESURRECTION` | `封蜡锁住所有复活许可。死者仍可越境，但不得携带自己的下一次呼吸。` |
| `extradite-the-ending` | `引渡结局 · EXTRADITE THE ENDING` | `微型棺匣收押那段结局，把它引渡给一场从未开始、因此无法结束的审判。` |

### 36 份条约的冻结构造

条约 id：`${delegation}:${counterpart}:${clause}`，固定顺序为 `DELEGATIONS × COUNTERPARTS × CLAUSES`。

条约标题逐字拼接：`{delegationTitle} / {counterpartTitle} / {clauseTitle}`。

| 轴 | id | title fragment | feedback fragment |
| --- | --- | --- | --- |
| delegation | `name-legation` | `无身姓名使团` | `姓名使节用一串无人发出的音节递交国书。` |
| delegation | `shadow-mission` | `流亡影子使团` | `流亡影子把反对票折成自己的外交护照。` |
| delegation | `body-consulate` | `无名肉身领事团` | `无名肉身让每一道伤口分别签署同一份国书。` |
| counterpart | `before-birth-country` | `出生以前的国` | `出生以前的国以尚未发生为国界，拒绝承认任何生日。` |
| counterpart | `after-memory-republic` | `记忆以后的共和国` | `记忆以后的共和国要求先忘记来使，才肯确认会面真实发生。` |
| counterpart | `inside-body-state` | `肉身内部的国` | `肉身内部的国把肋骨设为海关，让血液代替所有签证。` |
| clause | `mutual-recognition` | `互相承认` | `双方承认彼此存在，同时豁免对方提供存在证据。` |
| clause | `asylum-for-unlived` | `庇护未活之人` | `未活之人获得庇护，可以逃离那段原本属于自己的生命。` |
| clause | `resurrection-embargo` | `禁运复活` | `复活被列为违禁品，任何下一次呼吸都必须留在边境。` |
| clause | `extradite-the-ending` | `引渡结局` | `结局被装进棺匣，引渡给一场永远没有开庭日期的审判。` |

条约 feedback 为 delegation + counterpart + clause 三个 feedback fragment 按表顺序以单个空格连接；禁止运行时随机、同义改写或按 tally 改句。

点击 clause 后创建 treaty pending 并转到该 counterpart 对应的旧场景。只在 target arrival 时原子执行：`diplomaticRuns +1`、对应 `embassyTallies +1`、treaties 首次发现入图鉴、lastOutcome 更新、activeCourier 建立、draft 清空、pending 清空；来源页刷新不能提前结算，目标页刷新不能重复结算。

### 三处外交信使返回

| counterpart | 旧场景 | 按钮 | activeCourier feedback |
| --- | --- | --- | --- |
| `before-birth-country` | `counterfactual-spindle` | `跟胎前国信使返回外交部 · RETURN WITH THE PRE-BIRTH COURIER` | `胎前国信使从空摇篮里取回回执：条约已经生效，但签署日期早于双方建国。` |
| `after-memory-republic` | `remembrance` | `跟遗忘后信使返回外交部 · RETURN WITH THE POST-MEMORY COURIER` | `遗忘后信使把国书夹进痕迹墙。你已经不记得谈判，它却带回完整的外交豁免。` |
| `inside-body-state` | `constitutional-severance-desk` | `跟体内国信使返回外交部 · RETURN WITH THE INNER-STATE COURIER` | `体内国信使沿血管抵达分籍台。条约盖着一枚仍在跳动的边境章。` |

activeCourier 只存在于本轮条约的准确 target；返回后清 activeCourier 并进入死亡外交部。不得覆盖旧场景原有反馈、pending、党鞭或图鉴。

## 覆盖完成与未宣战入口

`diplomaticCoverageComplete()` 只从规范 treaties 计算，必须同时覆盖：

- 3 delegations：`name-legation / shadow-mission / body-consulate`
- 3 counterparts：`before-birth-country / after-memory-republic / inside-body-state`
- 4 clauses：`mutual-recognition / asylum-for-unlived / resurrection-embargo / extradite-the-ending`

Remembrance 危机入口文案：

`召回所有从未被承认的使节 ⟶`

入口反馈逐字冻结：

`三支使团、三座外国与四种条款已经互相承认。地图因此找不到任何不属于别国的空白。`

## 第四幕：未宣战室

场景：`#undeclared-war-room`
标题：`04ζ / 未宣战室 · THE WAR THAT WAS NEVER DECLARED`
图：`assets/v71-undeclared-war-room.webp`

一间没有武器、只有一张骨瓷世界地图的战情室。左席姓名面具把所有国名写在自己内侧；中席流亡影子把边境涂成无光地带；右席无头肉身用血管在地图上画出封锁线。现场显示三类 embassyTallies 与派生的外交多数。

| action | 按钮标题 | outcome | target | feedback |
| --- | --- | --- | --- | --- |
| `internalize-all-borders` | `把所有边境移进肉身 · MOVE EVERY BORDER INSIDE THE BODY` | `all-borders-moved-inside-the-body` | `threshold` | `肉身卷起世界地图，把每一条边境塞进肋骨之间。从此每次跨国都表现为一处新的伤口。` |
| `recognize-only-exile` | `只承认流亡者 · RECOGNIZE ONLY THE EXILE` | `only-the-exile-was-recognized` | `remembrance` | `外交部撤销所有本土国家，只承认离开自己领土的人。影子因此成为唯一拥有祖国的流亡者。` |
| `criminalize-resurrection` | `把复活列为跨境罪 · CRIMINALIZE RESURRECTION` | `resurrection-became-contraband` | `unending-gallery` | `最后一份照会宣布复活属于跨境走私。每个结局都开始搜查自己，试图找出那口尚未申报的呼吸。` |

三按钮可在重访时重复；warOutcomes 只记录首次发现，warRuns 每次合法 target arrival settle 都 +1。全部收集仅形成 v72 未来证据，不显示未实现入口。

## 状态契约

唯一 key：`goddead_v71_death_diplomacy`
版本：71

```js
{
  version: 71,
  visited: { ministry: false, border: false, autopsy: false, war: false },
  draft: { delegation: '', counterpart: '' },
  treaties: [],
  warOutcomes: [],
  diplomaticRuns: 0,
  warRuns: 0,
  embassyTallies: { name: 0, shadow: 0, body: 0 },
  lastOutcome: '',
  activeCourier: null,
  pending: null
}
```

顶层 canonical 恰好十一键；额外键丢弃。nested object 精确投影。所有计数先 floor，再裁 0..9999；NaN、Infinity、负数与错误类型归零。

- treaties：只接受 36 个规范 id，按 `DELEGATIONS × COUNTERPARTS × CLAUSES` 顺序去重。
- warOutcomes：只接受三条规范 outcome，按上表 action 顺序去重。
- draft：counterpart 非空时 delegation 必须合法；delegation 为空时 counterpart 强制清空。
- embassyTallies：不从 treaties 反推；重复条约也保留真实使团票数。
- lastOutcome：只允许已收集 treaty 或 warOutcome，否则清空。
- activeCourier：只允许 `{counterpart,treaty,feedback}` 三键；treaty 必须已收集，counterpart 等于 treaty 第二段，feedback 按 counterpart 表逐字重算。
- v70 解锁证据失效时，`getDeathDiplomacy()` 返回默认十一键并隐藏所有 v71 派生 UI；不得反向修补 v70。

外交多数：embassyTallies 唯一最高时显示 `姓名使团获承认 / 影子使团获承认 / 肉身使团获承认`；并列最高或全零显示 `无人获得承认`。派生文案不落盘。

## 严格 pending 与重播矩阵

pending 仅允许七类，键集必须完全相等，值必须由冻结表反算：

1. `entry`：`{kind,target,feedback}`；target=`death-foreign-ministry`。
2. `delegation`：`{kind,source,delegation,target,feedback}`；source=`death-foreign-ministry`，target=`nonexistent-border-chancery`。
3. `counterpart`：`{kind,source,delegation,counterpart,target,feedback}`；source=`nonexistent-border-chancery`，target=`treaty-autopsy-table`。
4. `treaty`：`{kind,source,delegation,counterpart,clause,treaty,target,feedback}`；source=`treaty-autopsy-table`，target 由 counterpart 反算。
5. `courier-return`：`{kind,from,target,treaty,feedback}`；from 为三个旧场景之一且匹配 activeCourier.counterpart，target=`death-foreign-ministry`。
6. `war-entry`：`{kind,target,feedback}`；target=`undeclared-war-room`，要求实时 coverage complete。
7. `war`：`{kind,source,action,outcome,target,feedback}`；source=`undeclared-war-room`，其余逐字重算，要求实时 coverage 与 war 已访问。

来源页 reload：恢复反馈、锁定同组全部按钮，仅已选按钮 `aria-pressed=true`，只重挂一次 AutoAdvance。
目标页 reload：先原子 settle 再清 pending；不得重复累计。
既非 source 也非 target：清 pending，不结算、不转场。
同拍双击或多按钮竞争：第一项落锁，其余零副作用。

## 路由守卫与旧场景桥

- `death-foreign-ministry`：v70 完整证据 + 合法 entry/courier-return pending target，或已真实 visited.ministry。
- `nonexistent-border-chancery`：合法 delegation pending target，或 visited.border + 合法 draft.delegation。
- `treaty-autopsy-table`：合法 counterpart pending target，或 visited.autopsy + 合法完整 draft。
- `undeclared-war-room`：实时 coverage + 合法 war-entry pending target，或 coverage + visited.war。
- v70 证据不足时，四幕 direct hash 统一收紧到 remembrance，并隐藏全部 v71 派生 UI，清 v71 pending。
- v71 treaty 目标 `counterfactual-spindle / remembrance / constitutional-severance-desk` 与对应 activeCourier 刷新/直达时，旧守卫必须显式认可合法规范化后的 v71 treaty pending 与 activeCourier；不得放宽其他 v66/v70 场景。

## 18 组可信交互

共 18 组 listener：Remembrance 普通入口 ×1、delegation ×3、counterpart ×3、clause ×4、courier-return ×3、Remembrance war 入口 ×1、war ×3。

每组 listener 第一行拒绝非 `e.isTrusted` 的 click；同时校验 currentScene、pending、AutoAdvance、按钮可见且未 disabled。反馈先出现，同组按钮立即全锁，选中按钮 `aria-pressed=true`，再创建 pending 与转场。原生 button 负责 Enter/Space。

## Remembrance、图鉴与目录

记忆行逐字格式：

`死亡外交部：已签署 N/36 份条约，共派遣 R 次；使团 姓名 L / 影子 S / 肉身 B；外国 胎前 P / 遗忘后 M / 体内 I；条款 承认 A / 庇护 Y / 禁运 E / 引渡 X；外交多数 D；未宣战结局 O/3。`

- v71 图鉴位于 v70 图鉴之后，固定 39 格。
- 解锁一成立，即使 v71 自身零进度，也显示 0/36 记忆、39 格全锁图鉴、父层与普通入口。
- 普通入口仅在 v71 解锁时显示；war 入口仅在 diplomaticCoverageComplete 时显示。
- 目录仅在对应 visited 且 v71 仍解锁时显示：
  - `04γ / 死亡外交部`
  - `04δ / 不存在国境`
  - `04ε / 条约解剖`
  - `04ζ / 未宣战室`
- “遗忘全部”移除 v71 key，隐藏入口、目录、记忆、图鉴、三处信使；清 draft、activeCourier、反馈、disabled、aria-pressed 与 v71 AutoAdvance，不写 v70。

## 视觉资产要求

必须保留四张 1536×1024 source PNG 与四张运行时 WebP：

| 源图 | 运行时 | 用途 |
| --- | --- | --- |
| `design-references/source-v71-death-foreign-ministry.png`（1536×1024 / 2445118 B / `1d17408fd41dd601073bf0b4466421c2868ddf080ca47f69ca3ca4fdcbe98d10`） | `assets/v71-death-foreign-ministry.webp`（1536×1024 / 211410 B / `6dd46e8d5155abbcbd5d7b1b8cbc695af9a213b3f787cf54d60609b8af99d57c`） | 三支不完整使团 |
| `design-references/source-v71-nonexistent-border-chancery.png`（1536×1024 / 2331679 B / `510b35085a2c1b52521898f895979f7d7cfd9f10609efeedb5266ef071381d0a`） | `assets/v71-nonexistent-border-chancery.webp`（1536×1024 / 144824 B / `cfed45f969cea1f24a87c6ba0ec779861a58064713ff9e6e05d1ca3d2b4624ba`） | 三座不可能国家 |
| `design-references/source-v71-treaty-autopsy-table.png`（1536×1024 / 2630624 B / `5ef23992603d9818e7fc1c1709e78195e67a677eba636875c5d7c1e09a22b7f2`） | `assets/v71-treaty-autopsy-table.webp`（1536×1024 / 222570 B / `0846bc8553a7cc60aea25262c78b6d02b9286a8a0b9513715a5cfaf45d4ee8df`） | 四种条约器官 |
| `design-references/source-v71-undeclared-war-room.png`（1536×1024 / 2825544 B / `0a4074f6c38ac1286146d7ec49529c72f095420c56c1db9ccf298dff6fca46cd`） | `assets/v71-undeclared-war-room.webp`（1536×1024 / 280614 B / `19ba0864796d49c57b7853d39b35398618392b48da3bb7883a20323f559b248f`） | 三方未宣战结局 |

- 延续 Goddead 深黑、骨瓷、旧黄铜、暗红线、低饱和写实恐怖质感，但加入外交照会、护照压机、国境门、骨瓷地图等新语汇。
- 不得出现可读文字、字母、数字、水印、现代 UI、现实国旗、现实国徽、地图轮廓、政治人物或商标。
- 关键物件必须空间分离，移动缩放后仍可做 ≥44px 热点。
- 运行时统一 Pillow quality=85、method=6、无裁切；tests 冻结 source/WebP 的像素尺寸、字节预算与 sha256。

## 测试契约

以 v70 当前 6502 条断言为基线，新增测试后报告实际总数。至少覆盖：

1. 四 source PNG 与四 WebP 的存在、尺寸、字节预算、sha256。
2. 场景 113 → 117；四 route/title/preload/cache `v=71`/目录标签冻结。
3. 36 treaty id、标题、feedback 唯一固定顺序；3 war outcome 冻结。
4. v71 唯一 key、canonical 十一键、nested 精确键、clamp、坏类型、额外键清洗。
5. 解锁只能由规范 v70 coverage + 三 crisisOutcomes 证明，缺任一项关闭；getter 回默认。
6. 重复条约不重复图鉴，但 diplomaticRuns 与 embassyTallies 正确累加；source/target reload 幂等。
7. 七类 strict pending 的键集、逐字反算、source/target/else、一次性消费。
8. activeCourier 三键反算，三旧场景容器互不覆盖既有 UI；三个旧守卫桥只放宽对应合法状态。
9. 18 组 isTrusted、可见/disabled/currentScene/AutoAdvance、同拍互斥、合成 click 零副作用。
10. Remembrance 39 格、统计、多数、双入口、四目录、零进度入口、forget-all。
11. v70 及更早 key 字节级不变，既有 6502 条断言继续通过。
12. 桌面与窄屏热点定位类、≥44px、零重叠与无横向 overflow。

## 浏览器 QA 契约

Kimi 实装并通过静态测试后，由 Codex 使用本地生产文件独立验收：

1. locked / ready-zero / 四 direct hash / 39 格与双入口显隐。
2. 四幕桌面 1280×720 + 移动 390×844：图片 complete 1536×1024、热点在图内、零重叠、≥44px、overflow 0、人工看图。
3. 程序化 click/Enter 被 isTrusted 拒绝；Chrome 真实鼠标入口成功且只写 visited.ministry。
4. representative treaty 首次结算、刷新幂等、重复签署只加 runs/tally。
5. 三个 counterpart 旧场景信使、刷新稳定、courier-return 清理。
6. coverage、多数/并列、war 入口、代表性 war settle + reload。
7. 七类 pending source/target/else、坏 JSON/坏类型、旧状态字节不变。
8. 新鲜生产页巡检 remembrance + 四幕，console warning/error=0；清理 helper、服务与测试存档。

## v72 活口（不实装）

当三条 warOutcomes 全部真实收集后，未来开启「遗言中央银行」：死亡外交部把三十六份条约抵押成货币，姓名发行只有签名没有持有人的纸币，影子发行只在无人注视时流通的黑币，肉身则用尚未说出口的遗言偿付国债。v71 只留下规范 warOutcomes，不放置死入口。
