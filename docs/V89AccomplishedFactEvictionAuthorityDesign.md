# v89 既成事实拆迁局 / EVICTION AUTHORITY FOR ACCOMPLISHED FACTS

版本：v89 冻结设计稿

状态：故事、交互、路由、状态与视觉合同已冻结；四张源图与运行图已生成、压缩并复核；生产前端、测试与实现文档已完成，独立浏览器 QA 通过
职责：Codex 设计 / 生图 / 资产复核 / 独立验收；`gemini-3.7-flash-high` 生产前端 / 自动化测试 / 实现文档 / 缺陷修复

## 核心命题

v88 把现实卖给了未发生事件。新的业主随即清点房产，发现已经发生的历史全是没有租约的旧住户：出生证占着一具身体，伤疤占着愈合后的皮肤，战争废墟占着本应重新开始的土地。

既成事实拆迁局因此成立。它不否认真相，只要求真相在限期内搬离现实。

玩家将替三项已经发生、且仍在占用后果的事实选择被拆迁的历史产权与追溯拆除方式。每次拆迁都会留下一个没有原因、却继续存在的后果。最终，最后居住权上诉庭必须决定：过去究竟拥有永久居住权，还是现在才是盖在历史上的违章建筑。

## 解锁合同

v89 只读 v88，不写 v88 或更早状态。`accomplishedFactEvictionUnlocked()` 必须同时满足：

1. `unhappenedEventAuctionUnlocked()` 为真；
2. v88 `purchases` 至少 4 份，并覆盖三 bidder、三 lot、四 bid method；
3. v88 `titleOutcomes` 精确包含：
   - `every-unhappened-event-became-history`
   - `reality-belonged-to-what-never-occurred`
   - `history-could-no-longer-prove-it-happened`

任何缺失、伪造、坏类型、错误版本、非规范组合或仅有 v89 自身陈旧状态，都不能解锁 v89。

## 场景拓扑

新增四幕：

1. `accomplished-fact-eviction-authority` — 既成事实拆迁局
2. `condemned-history-survey-office` — 危历史勘测所
3. `retroactive-demolition-yard` — 追溯拆除场
4. `final-occupancy-appeal-court` — 最后居住权上诉庭

场景总数：`185 → 189`。静态资源缓存查询标记：`v=89`。

目录编号：

- `07α / 既成拆迁`
- `07β / 历史勘危`
- `07γ / 追溯拆除`
- `07δ / 居住上诉`

## 第一幕：既成事实拆迁局

画面分成三个竖向候迁席。每个席位是一项已经发生、仍拒绝搬走的事实：

### 1. `birth-that-issued-a-body`

- 中文短名：已生出生
- 英文：BIRTH THAT ISSUED A BODY
- tally：`birth`
- 叙事：它只发生过一次，却把一具身体、一个生日和此后全部年龄都登记在自己名下。现在身体已经活得比出生更久，出生仍拒绝交还门牌。

### 2. `scar-that-outlived-the-wound`

- 中文短名：长住伤疤
- 英文：SCAR THAT OUTLIVED THE WOUND
- tally：`scar`
- 叙事：伤口早已关闭，疼痛也学会沉默，只有伤疤继续占据皮肤。它声称自己不是遗迹，而是伤害至今仍在发生的长期租约。

### 3. `war-that-kept-its-ruins`

- 中文短名：留墟战争
- 英文：WAR THAT KEPT ITS RUINS
- tally：`war`
- 叙事：停火令把战争写成过去式，废墟却还在替它缴纳存在。战争要求保留每一堵断墙，好证明和平从未取得完整产权。

选择候迁事实后进入 `condemned-history-survey-office`。

## 第二幕：危历史勘测所

三处历史产权被判定为“结构性既成事实”，各自通往一处旧场景，由一名 v89 拆迁执达员在那里等待：

### 1. `right-to-have-already-begun`

- 中文短名：已经开始权
- 英文：RIGHT TO HAVE ALREADY BEGUN
- target：`birth-ballot-booth`
- bailiff：`birth-eviction-surveyor`
- 执达员中文：出生腾退勘测员
- 叙事：一份证明生命不是临时入住的起始产权。出生投票亭保存着第一次呼吸的门牌；一旦拆除，身体仍会继续衰老，却无法证明自己从哪一天开始。

### 2. `address-inside-a-healed-wound`

- 中文短名：愈伤内地址
- 英文：ADDRESS INSIDE A HEALED WOUND
- target：`crime-scene-without-offender`
- bailiff：`scar-demolition-bailiff`
- 执达员中文：伤疤拆除执达员
- 叙事：伤疤在愈合组织里登记了永久地址。无加害者案发现场持有它的地契；地址被拔除后，伤害会失去地点，却不会失去后果。

### 3. `ownership-of-a-ruin-left-by-war`

- 中文短名：战争遗墟权
- 英文：OWNERSHIP OF A RUIN LEFT BY WAR
- target：`undeclared-war-room`
- bailiff：`ruin-relocation-marshal`
- 执达员中文：遗墟迁移法警
- 叙事：战争以废墟为持续占有的证据。未宣战室保管着一片从未正式交战却已经损坏的城区；拆掉战争的产权后，断墙会成为没有事件认领的天气。

选择历史产权后进入 `retroactive-demolition-yard`。

## 第三幕：追溯拆除场

四种追溯拆除机关围绕中央空置爆破台排成 `2 × 2`：

### 1. `demolish-the-cause-and-leave-the-consequence`

- 中文短名：拆因留果
- 英文：DEMOLISH THE CAUSE AND LEAVE THE CONSEQUENCE
- 叙事：从历史地基里整根拔走原因，保留一切已经长出的后果。身体继续出生，伤疤继续存在，废墟继续风化，只是再也没有任何事情配得上它们。

### 2. `relocate-all-witnesses-outside-time`

- 中文短名：证人迁时外
- 英文：RELOCATE ALL WITNESSES OUTSIDE TIME
- 叙事：把所有见证者迁到时间之外。证词仍然准确，证人仍然真诚，但他们只能在事情尚未发生以前或早已结束以后作证。

### 3. `condemn-memory-as-structurally-unsafe`

- 中文短名：记忆判危
- 英文：CONDEMN MEMORY AS STRUCTURALLY UNSAFE
- 叙事：宣布记忆不具备承载现实的结构强度。每次回想都会触发一场小型坍塌，直到过去只剩无法进入、却仍在收取痛感的围挡。

### 4. `compensate-reality-with-an-alternate-past`

- 中文短名：另史补偿
- 英文：COMPENSATE REALITY WITH AN ALTERNATE PAST
- 叙事：向现实支付一段替代过去作为拆迁补偿。新历史手续完备、证据齐全，唯一的问题是所有人都清楚记得自己从未经历过它。

## 36 份既成事实拆迁令

`3 tenants × 3 properties × 4 demolition methods = 36 eviction orders`。

规范 ID：

`<tenant>:<property>:<method>`

每份拆迁令的文案由三段严格拼合：

1. 候迁事实说明它为何仍占用现实；
2. 历史产权说明被拆除的具体居住资格；
3. 拆除方式说明现实承担的后果。

完成一份拆迁令后：

1. 写入 `evictions`，固定笛卡尔顺序去重；
2. `evictionRuns += 1`；
3. 对应 `tenantTallies` 加一；
4. 设置 `activeBailiff = { property, eviction, feedback }`；
5. 前往 property 的旧 target；
6. 旧 target 只在合法 `eviction` / `bailiff-return` pending 下开放 v89 窄桥；
7. 受信任点击执达员后返回 `accomplished-fact-eviction-authority`，清空 draft / activeBailiff / pending。

coverage 完成条件：至少 4 份拆迁令且覆盖 3 tenants、3 properties、4 methods。

## 第四幕：最后居住权上诉庭

Remembrance 在 coverage 完成后显示上诉庭入口。三项裁定：

### 1. `grant-permanent-residency-to-every-accomplished-fact`

- outcome：`the-past-became-an-undeletable-address`
- target：`threshold`
- 中文：授予既成事实永久居住权
- 叙事：上诉庭给每一件已经发生的事签发不可拆迁门牌。门槛从此不是通道，而是过去的总地址；每次跨越，都必须承认脚下住着此前全部人生。

### 2. `evict-history-and-let-consequences-squat`

- outcome：`only-the-consequences-remained-home`
- target：`remembrance`
- 中文：清退历史并默许后果占屋
- 叙事：过去被依法搬空，伤疤、年龄与废墟成为无因占屋者。痕迹室仍记得所有后果，却再也找不到一件可以被原谅、悼念或追责的事情。

### 3. `demolish-the-present-for-illegal-construction-on-the-past`

- outcome：`the-present-was-condemned-for-occupying-history`
- target：`unending-gallery`
- 中文：以侵占历史为由拆除现在
- 叙事：庭审发现现在始终盖在过去的地基上，真正的违章建筑原来是此刻。爆破声响起时，无尽画廊保留了每个已经失去“现在”的观众。

## 状态合同

存储键：`goddead_v89_accomplished_fact_eviction`

严格十一键：

```js
{
  version: 89,
  visited: { authority: false, survey: false, yard: false, court: false },
  draft: { tenant: '', property: '' },
  evictions: [],
  appealOutcomes: [],
  evictionRuns: 0,
  appealRuns: 0,
  tenantTallies: { birth: 0, scar: 0, war: 0 },
  lastOutcome: '',
  activeBailiff: null,
  pending: null
}
```

规范化要求：

- `visited` / `draft` 精确投影；
- `evictions` 按 `TENANTS × PROPERTIES × DEMOLITION_METHODS` 固定顺序去重；
- `appealOutcomes` 按三 action 固定顺序；
- runs / tallies `floor + clamp 0..9999`；
- `lastOutcome` 只接受 36 个规范 eviction 或三个规范 outcome；
- `activeBailiff` 精确 `{property,eviction,feedback}` 并逐表反算；
- 坏 JSON / version / type / 未解锁均回默认；
- v89 永不写 v88 或更早 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`
2. `tenant`：`{kind,source,tenant,target,feedback}`
3. `property`：`{kind,source,tenant,property,target,feedback}`
4. `eviction`：`{kind,source,tenant,property,method,eviction,target,feedback}`
5. `bailiff-return`：`{kind,from,target,eviction,feedback}`
6. `appeal-entry`：`{kind,target,feedback}`
7. `appeal-action`：`{kind,source,action,outcome,target,feedback}`

全部 exact-key、逐字反算；target 一次结算，source 恢复反馈并只排一次，else 清理；刷新幂等。非法 sibling target、过期 activeBailiff、伪造 eviction、缺失 source 或额外字段全部清理。

## UI / 交互防线

恰好 18 个 v89 click listener：

- 普通入口 1
- appeal 入口 1
- tenant 3
- property 3
- demolition method 4
- bailiff-return 3
- appeal action 3

每个 listener 第一条业务语句必须是 `if (!e.isTrusted) return;`。choose 函数复核 currentScene、figure、button、draft、pending、activeBailiff 与 coverage。

记忆行：

`既成拆迁：已签 N/36 份腾退令，共拆除 R 次；候迁事实 出生 B / 伤疤 S / 战争 W；产权 开始 A / 愈伤 H / 遗墟 U；方式 拆因 C / 迁证 T / 判危 M / 另史 P；主迁事实 D；居住上诉 O/3。`

图鉴：39 格（36 evictions + 3 appeal outcomes）。

forget-all 必须清 v89 key、AutoAdvance、draft、activeBailiff、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个旧场景执达员；不得写 v88。

## 旧场景窄桥

### `birth-ballot-booth`

- 容器：`accomplished-fact-bailiff-birth-ballot-booth`
- 返回按钮：`accomplished-fact-bailiff-return-birth-ballot-booth`
- 仅接受 property `right-to-have-already-begun`
- 执达反馈：出生腾退勘测员量完第一口呼吸的门框。它说门可以拆，年龄会继续往里长，只是再没人知道这具身体从哪一天开始欠租。

### `crime-scene-without-offender`

- 容器：`accomplished-fact-bailiff-crime-scene-without-offender`
- 返回按钮：`accomplished-fact-bailiff-return-crime-scene-without-offender`
- 仅接受 property `address-inside-a-healed-wound`
- 执达反馈：伤疤拆除执达员从皮肤里拔出一枚没有街名的门牌。案发现场失去地址后，所有证物仍指向这里，却无法说明“这里”在哪里。

### `undeclared-war-room`

- 容器：`accomplished-fact-bailiff-undeclared-war-room`
- 返回按钮：`accomplished-fact-bailiff-return-undeclared-war-room`
- 仅接受 property `ownership-of-a-ruin-left-by-war`
- 执达反馈：遗墟迁移法警给每堵断墙装上轮子。战争拒绝搬走，废墟却已经排队离境；和平第一次发现自己没有可以接收它们的国境。

旧场景原有控件、语义、路由和旧版本状态不得改变。v89 bridge 只能作为合法 pending 的附加放行，不能替代旧 guard。

## 素材与构图合同

全部目标分辨率 `1536×1024`，源 PNG + Pillow `quality=85, method=6` WebP；无可读文字、logo、UI、水印、装饰边框。画面延续 Goddead 的黑曜石黑、骨白、暗红、烟熏金、腐蚀黄铜与旧金属质感，采用超现实暗黑叙事概念画；HTML 原生热点要求画面分区清晰。

### 1. `assets/source-v89-accomplished-fact-eviction-authority.png`

- 三个竖向候迁席。
- 左：黄铜脐带门框与从空白出生证中投出的成年人体影，表现“已生出生”。
- 中：横跨石质皮肤墙面的愈合伤疤，被当作一栋长期占用的窄屋，表现“长住伤疤”。
- 右：停火后的断墙、空盔与仍然亮着暗火的废墟住户，表现“留墟战争”。
- 三分区，中央不放文字、标牌或真实人物面孔。

### 2. `assets/source-v89-condemned-history-survey-office.png`

- 三处大型危历史产权。
- 左：装有第一口呼吸的黄铜摇篮门牌与空白生日档案，表现“已经开始权”。
- 中：一间嵌在愈合伤口内部的微缩房屋，门口伸出无名门牌，表现“愈伤内地址”。
- 右：被透明产权罩占据的战后街区断面，表现“战争遗墟权”。
- 三分区，不出现可读数字、字母或施工告示。

### 3. `assets/source-v89-retroactive-demolition-yard.png`

- 四种拆除机关 `2 × 2`，中央留出空置爆破台与十字负空间。
- 左上：从时间地基拔出原因根系、却让后果枝条悬空的黑铁拔桩机。
- 右上：把无脸证人送进表盘外隧道的黄铜迁移闸。
- 左下：扫描记忆裂缝、在回忆内部撑起危墙支柱的骨白勘危架。
- 右下：用一段发光替代历史补偿现实的暗红置换输送机。
- 每个象限具有独立剪影，不能像操作面板或现代工业 UI。

### 4. `assets/source-v89-final-occupancy-appeal-court.png`

- 三座裁定区。
- 左：所有既成事实取得永久门牌，门槛被压成层层历史地基。
- 中：历史房屋被搬空，只剩伤疤、年龄与废墟作为无因占屋者围住冷灶。
- 右：现在这座建筑因侵占过去而被从地基向上拆除，观众化作无终局画廊里的空框。
- 三分区，法庭庄严但没有法官面孔、文字、logo 或现代法庭标识。

运行图：

- `assets/v89-accomplished-fact-eviction-authority.webp`
- `assets/v89-condemned-history-survey-office.webp`
- `assets/v89-retroactive-demolition-yard.webp`
- `assets/v89-final-occupancy-appeal-court.webp`

冻结资产均为 `1536×1024`；源图由内置 ImageGen 生成，运行图以 Pillow `quality=85, method=6` 压缩，并已逐张复核构图分区、HTML 热区留白、文字污染与 WebP 观感：

| 资产 | 字节 | SHA-256 |
| --- | ---: | --- |
| `assets/source-v89-accomplished-fact-eviction-authority.png` | 2588120 | `ef0eb750f3e6883ab22836b3dd827854a99d38115f5ea2bbf83da8a5977709cb` |
| `assets/v89-accomplished-fact-eviction-authority.webp` | 223166 | `f13a2d439a97c4618bb969f07eb139f0118910e1fa4e96c407bbd15150317432` |
| `assets/source-v89-condemned-history-survey-office.png` | 2963404 | `8774f08fb89965491e90d67dba569e0f1aa613c6615b544ebf75ea6b5de0864f` |
| `assets/v89-condemned-history-survey-office.webp` | 292764 | `fdec4d8b13b9c36b0eade0ea60c49abbfd4714137211b496efda9c9f122f14d2` |
| `assets/source-v89-retroactive-demolition-yard.png` | 2633463 | `623428a597634d5c07a7a85fad905a36083bda302325aa80121805462238c216` |
| `assets/v89-retroactive-demolition-yard.webp` | 273044 | `2fa1cd0e9ab12bd48233920c753a210517d665f7800383a51222567a38b81e28` |
| `assets/source-v89-final-occupancy-appeal-court.png` | 3138928 | `bb8dfb3073e79b613bee6f0b25e37cddad9715e5f6d4d74a32e2dc561843721a` |
| `assets/v89-final-occupancy-appeal-court.webp` | 343904 | `9818c5533556e1dd4568ab214bc7cafdd2360982781a8ed9c3c192edeb38d83b` |

## 静态与浏览器门槛

- 189 scenes、cache `v=89`、4 route/title/preload/directory 全覆盖；
- 资产源图/运行图尺寸、哈希、字节冻结；
- 11 键、36+3、七 pending、三 activeBailiff、四份 coverage、18 `isTrusted`；
- v88 解锁正反例、v88 key 只读、forget-all、旧版本治理回归；
- 三处旧 target 窄桥、执达员动态 ID 与 `index.html` 实际 DOM 全量联动；
- 未解锁 direct load / hashchange / synthetic data-go 统一回退 `remembrance`，地址归一；
- 单 Chrome 窗口单标签 Desktop / `390×844` Mobile；
- 真实四条拆迁流程覆盖 3 tenants / 3 properties / 4 methods / 3 old targets；
- 三项上诉裁定真实点击抵达 `threshold` / `remembrance` / `unending-gallery`；
- pending 冷恢复、刷新幂等、坏档容错、console/resource 0 error；
- QA 后精确恢复用户原始 localStorage、hash、窗口、标签页与设备模拟状态；
- 浏览器不残留 QA 种子、临时 CSS、DevTools 或额外标签页。

## v90 活口

历史被搬空以后，后果仍留在原地：没有出生原因的年龄、没有伤害来源的伤疤、没有战争可以哀悼的废墟。它们既不是事实，也不是可能性，只能作为无因难民申请在现实暂住。

下一站：

`无因后果难民署 / REFUGEE AUTHORITY FOR CONSEQUENCES WITHOUT CAUSES`

它会问：一个后果若找不到自己的原因，究竟该被救济、遣返，还是收养为新的真相？

### 验收与落地附录 (2026-08-30)
- 场景总数确认：新增 4 处场景，全站总计达 189 处场景。
  - `accomplished-fact-eviction-authority`（既成事实拆迁局）
  - `condemned-history-survey-office`（危历史勘测所）
  - `retroactive-demolition-yard`（追溯拆除场）
  - `final-occupancy-appeal-court`（最后居住权上诉庭）
- 状态结构落地：`goddead_v89_accomplished_fact_eviction` 确立 11 个标准字段，与既有系统无缝解耦并支持独立重置。
- 证据链落地：
  - 静态测试：`node tests/site.test.mjs` 达成 15657 项断言，全部通过。
  - 真实 UI 链路：验证了从既成事实拆迁局到 `birth-ballot-booth` 勘测员再返回的完整结算过程。
  - 上诉判决路由：严格对应 `授予既成事实永久居住权`（`threshold`）、`清退历史并默许后果占屋`（`remembrance`）、`以侵占历史为由拆除现在`（`unending-gallery`）。
  - 视觉与存储验证：通过 390×687 移动端实机检测，基线 22 项 localStorage 数据已完全比对复原。
- 本地状态：本版本全部工作均在本地独立完成，无线上发布操作。
