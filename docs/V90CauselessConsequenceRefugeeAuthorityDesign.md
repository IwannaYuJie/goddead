# v90 无因后果难民署 / REFUGEE AUTHORITY FOR CONSEQUENCES WITHOUT CAUSES

版本：v90 冻结设计稿

状态：故事、交互、路由、状态与视觉合同已冻结；四张源图与运行图已生成、压缩并复核；生产前端、测试与文档已集成至 v90 基线
职责：Codex 设计 / 生图 / 资产复核 / 独立验收；`gemini-3.7-flash-high` 生产前端 / 自动化测试 / 实现文档 / 缺陷修复

## 核心命题

v89 把已经发生的历史从现实中拆走，却没能拆掉历史留下的后果。于是没有出生原因的年龄继续增长，没有伤害来源的伤疤继续发痛，没有战争可以哀悼的废墟继续风化。

它们既不是事实，也不是可能性。它们只是失去原籍的后果。

无因后果难民署因此成立。玩家要替三类无因后果选择一位愿意伪装成其原因的担保人，再决定它们通过因果边境的方式。每次过境都会制造一份法律成立、逻辑可疑的庇护档案；旧世界的三个结局地点将作为借因领事馆重新参与流程。

最终，终审庇护庭必须决定：后果是否有权在没有原因的现实里继续生活，还是必须被遣返到一件从未发生的事以前。

## 解锁合同

v90 只读 v89，不写 v89 或更早状态。`causelessConsequenceRefugeeUnlocked()` 必须同时满足：

1. `accomplishedFactEvictionUnlocked()` 为真；
2. v89 `evictions` 至少 4 份，并覆盖三 tenant、三 property、四 demolition method；
3. v89 `appealOutcomes` 精确包含：
   - `the-past-became-an-undeletable-address`
   - `only-the-consequences-remained-home`
   - `the-present-was-condemned-for-occupying-history`

任何缺失、伪造、坏类型、错误版本、非规范组合或仅有 v90 自身陈旧状态，都不能解锁 v90。

## 场景拓扑

新增四幕：

1. `causeless-consequence-refugee-authority` — 无因后果难民署
2. `borrowed-cause-sponsorship-office` — 借因担保所
3. `causal-border-processing-station` — 因果边境处理站
4. `final-asylum-tribunal-for-causeless-consequences` — 无因后果终审庇护庭

场景总数：`189 → 193`。静态资源缓存查询标记：`v=90`。

目录编号：

- `08α / 无因难民`
- `08β / 借因担保`
- `08γ / 因果边检`
- `08δ / 后果庇护`

## 第一幕：无因后果难民署

画面分成三个候审泊位。每个泊位是一项被自己的原因遗弃、却仍在现实里继续发生的后果。

### 1. `age-that-arrived-without-a-birth`

- 中文短名：无生年龄
- 英文：AGE THAT ARRIVED WITHOUT A BIRTH
- tally：`age`
- 叙事：身体仍在增长年龄，出生日期却已被拆除。它提着装满生日蜡烛的箱子来到难民署，每根蜡烛都能证明它老了一岁，却没有一根能证明第一岁从何开始。

### 2. `scar-with-no-wound-to-remember`

- 中文短名：无伤伤疤
- 英文：SCAR WITH NO WOUND TO REMEMBER
- tally：`scar`
- 叙事：伤口失去历史产权后，伤疤成了没有原籍的皮肤难民。它仍会在阴雨天疼痛，却无法说出究竟是哪一次伤害越过了边境。

### 3. `ruins-from-a-war-that-cannot-be-found`

- 中文短名：无战废墟
- 英文：RUINS FROM A WAR THAT CANNOT BE FOUND
- tally：`ruin`
- 叙事：断墙、空盔与烧黑的街道结队抵达，身后没有战争。它们携带全部灾难证物，却被每一本历史书认定为来源不明的建筑垃圾。

选择无因难民后进入 `borrowed-cause-sponsorship-office`。

## 第二幕：借因担保所

三位来自旧结局地点的担保人愿意暂时冒充原因。它们不是与难民一一绑定；任意难民都可以选择任意担保人，形成完整笛卡尔组合。

### 1. `doorway-that-claims-it-was-the-birth`

- 中文短名：门槛认生
- 英文：DOORWAY THAT CLAIMS IT WAS THE BIRTH
- target：`threshold`
- consul：`threshold-origin-consul`
- 领事中文：门槛原籍领事
- 叙事：门槛记得每一次进入，愿意宣称其中一次跨越就是出生。它能给年龄补一张起点证明，但从此所有开门都可能被登记为新生。

### 2. `memory-that-volunteers-to-have-been-the-wound`

- 中文短名：记忆代伤
- 英文：MEMORY THAT VOLUNTEERS TO HAVE BEEN THE WOUND
- target：`remembrance`
- consul：`memory-origin-notary`
- 领事中文：记忆原籍公证员
- 叙事：痕迹室里一段无主记忆自愿承认自己曾是伤口。它可以替伤疤提供来源，只是记忆会从此真的开始流血。

### 3. `empty-frame-that-confesses-it-was-the-war`

- 中文短名：空框认战
- 英文：EMPTY FRAME THAT CONFESSES IT WAS THE WAR
- target：`unending-gallery`
- consul：`gallery-causality-consul`
- 领事中文：画廊因果领事
- 叙事：无尽画廊的一只空框愿意认领整场战争。只要把废墟装进画面，空白就会成为战场；代价是所有观看者都将被登记为幸存者。

选择担保人后进入 `causal-border-processing-station`。

## 第三幕：因果边境处理站

四种过境程序围绕中央因果边检台排成 `2 × 2`：

### 1. `issue-a-temporary-cause-visa`

- 中文短名：临因签证
- 英文：ISSUE A TEMPORARY CAUSE VISA
- 叙事：签发一枚每天午夜失效的临时原因。后果可以合法存在二十四小时，然后必须再次证明自己为何发生；现实因此学会每天早晨重写一次昨天。

### 2. `sew-the-borrowed-cause-into-the-effect`

- 中文短名：缝因入果
- 英文：SEW THE BORROWED CAUSE INTO THE EFFECT
- 叙事：用逆向缝线把担保原因缝进后果内部。档案从此严丝合缝，但担保人会逐渐长出一段自己从未经历过的过去。

### 3. `declare-the-refugee-self-caused`

- 中文短名：自因为民
- 英文：DECLARE THE REFUGEE SELF-CAUSED
- 叙事：宣布后果本身就是自己的原因。年龄生出年龄，伤疤划开伤疤，废墟发动毁掉自己的战争；难民立即取得国籍，也立即成为自己的祖先。

### 4. `leave-the-cause-field-blank-and-stamp-reality`

- 中文短名：空因盖现
- 英文：LEAVE THE CAUSE FIELD BLANK AND STAMP REALITY
- 叙事：让原因栏永久空白，只在现实栏盖章。制度承认“不知道为何”也足以居住；从此每一件事都可以发生，世界不再享有追问的权利。

## 36 份无因后果庇护案

`3 refugees × 3 sponsors × 4 border protocols = 36 asylum cases`。

规范 ID：

`<refugee>:<sponsor>:<protocol>`

每份庇护案文案由三段严格拼合：

1. 难民说明自己如何在失去原因后继续存在；
2. 担保人说明愿意伪装成哪一种来源；
3. 过境程序说明现实为接纳它付出的逻辑代价。

完成一份庇护案后：

1. 写入 `asylumCases`，固定笛卡尔顺序去重；
2. `processingRuns += 1`；
3. 对应 `refugeeTallies` 加一；
4. 设置 `activeConsul = { sponsor, asylumCase, feedback }`；
5. 前往 sponsor 的旧 target；
6. 旧 target 只在合法 `asylum` / `consul-return` pending 下开放 v90 窄桥；
7. 受信任点击领事后返回 `causeless-consequence-refugee-authority`，清空 draft / activeConsul / pending。

coverage 完成条件：至少 4 份庇护案且覆盖 3 refugees、3 sponsors、4 protocols。

## 第四幕：无因后果终审庇护庭

Remembrance 在 coverage 完成后显示终审庭入口。三项裁定：

### 1. `grant-causal-asylum-to-every-orphaned-consequence`

- outcome：`reality-became-a-country-for-effects-without-origins`
- target：`threshold`
- 中文：授予所有无因后果因果庇护
- 叙事：终审庭宣布原因不是居住现实的前提。门槛向所有后果开放，年龄、伤疤与废墟取得永久身份；现实第一次成为一个允许居民不知道自己从何而来的国家。

### 2. `deport-every-consequence-to-before-its-missing-cause`

- outcome：`the-future-filled-with-effects-waiting-for-their-causes`
- target：`remembrance`
- 中文：遣返所有后果至原因之前
- 叙事：全部无因后果被遣返到它们缺失的原因以前。未来挤满尚未受伤的伤疤、尚未出生的年龄和等待战争的废墟；痕迹室开始记住明天将遭受的一切。

### 3. `recognize-every-effect-as-the-ancestor-of-its-cause`

- outcome：`causality-began-inheriting-itself-backward`
- target：`unending-gallery`
- 中文：认定所有后果为其原因的祖先
- 叙事：法庭让后果收养自己的原因。画廊里的谱系从结局向起点倒着生长；每个原因都继承一项早于自己存在的后果，因果开始向过去办理出生登记。

## 状态合同

存储键：`goddead_v90_causeless_consequence_refugee`

严格十一键：

```js
{
  version: 90,
  visited: { authority: false, sponsorship: false, border: false, tribunal: false },
  draft: { refugee: '', sponsor: '' },
  asylumCases: [],
  verdictOutcomes: [],
  processingRuns: 0,
  verdictRuns: 0,
  refugeeTallies: { age: 0, scar: 0, ruin: 0 },
  lastOutcome: '',
  activeConsul: null,
  pending: null
}
```

规范化要求：

- `visited` / `draft` 精确投影；
- `asylumCases` 按 `REFUGEES × SPONSORS × BORDER_PROTOCOLS` 固定顺序去重；
- `verdictOutcomes` 按三 action 固定顺序；
- runs / tallies `floor + clamp 0..9999`；
- `lastOutcome` 只接受 36 个规范 asylum case 或三个规范 outcome；
- `activeConsul` 精确 `{sponsor,asylumCase,feedback}` 并逐表反算；
- 坏 JSON / version / type / 未解锁均回默认；
- v90 永不写 v89 或更早 key。

## 七类 strict pending

1. `entry`：`{kind,target,feedback}`
2. `refugee`：`{kind,source,refugee,target,feedback}`
3. `sponsor`：`{kind,source,refugee,sponsor,target,feedback}`
4. `asylum`：`{kind,source,refugee,sponsor,protocol,asylumCase,target,feedback}`
5. `consul-return`：`{kind,from,target,asylumCase,feedback}`
6. `verdict-entry`：`{kind,target,feedback}`
7. `verdict-action`：`{kind,source,action,outcome,target,feedback}`

全部 exact-key、逐字反算；target 一次结算，source 恢复反馈并只排一次，else 清理；刷新幂等。非法 sibling target、过期 activeConsul、伪造 asylumCase、缺失 source 或额外字段全部清理。

## UI / 交互防线

恰好 18 个 v90 click listener：

- 普通入口 1
- verdict 入口 1
- refugee 3
- sponsor 3
- border protocol 4
- consul-return 3
- verdict action 3

每个 listener 第一条业务语句必须是 `if (!e.isTrusted) return;`。choose 函数复核 currentScene、figure、button、draft、pending、activeConsul 与 coverage。

记忆行：

`无因难民：已核 N/36 份庇护案，共过境 R 次；难民 年龄 A / 伤疤 S / 废墟 U；担保 门槛 T / 记忆 M / 空框 G；程序 临签 V / 缝因 W / 自因 L / 空因 B；主难民 D；终审 O/3。`

图鉴：39 格（36 asylum cases + 3 verdict outcomes）。

forget-all 必须清 v90 key、AutoAdvance、draft、activeConsul、pending、反馈、按钮态、入口、记忆、图鉴、目录与三个旧场景领事；不得写 v89。

## 三处旧结局领事馆窄桥

### `threshold`

- 容器：`causeless-consequence-consul-threshold`
- 返回按钮：`causeless-consequence-consul-return-threshold`
- 仅接受 sponsor `doorway-that-claims-it-was-the-birth`
- 领事反馈：门槛原籍领事把所有跨越记录摊在地上。它找不到真正的第一步，于是任选一道脚印盖成出生；年龄获得起点后，门槛开始替每位访客庆祝生日。

### `remembrance`

- 容器：`causeless-consequence-consul-remembrance`
- 返回按钮：`causeless-consequence-consul-return-remembrance`
- 仅接受 sponsor `memory-that-volunteers-to-have-been-the-wound`
- 领事反馈：记忆原籍公证员让无主回忆在伤疤旁按下血指印。档案终于有了伤口，回忆却第一次感到疼，并坚持这是它亲眼经历的证词。

### `unending-gallery`

- 容器：`causeless-consequence-consul-unending-gallery`
- 返回按钮：`causeless-consequence-consul-return-unending-gallery`
- 仅接受 sponsor `empty-frame-that-confesses-it-was-the-war`
- 领事反馈：画廊因果领事把废墟装进空框，宣布画框就是战争。所有观看者立刻收到幸存证明；他们望着从未发生的战场，发现自己已经开始悼念。

旧场景原有控件、语义、路由和旧版本状态不得改变。v90 bridge 只能作为合法 pending 的附加放行，不能替代旧 guard。

## 素材与构图合同

全部目标分辨率 `1536×1024`，源 PNG + Pillow `quality=85, method=6` WebP；无可读文字、logo、UI、水印、装饰边框。画面延续 Goddead 的黑曜石黑、骨白、暗红、烟熏金、腐蚀黄铜与旧金属质感，采用超现实暗黑叙事概念画；HTML 原生热点要求画面分区清晰。

### 1. `assets/source-v90-causeless-consequence-refugee-authority.png`

- 三个竖向候审泊位。
- 左：披着成人旧外套、提着生日蜡烛箱却没有婴儿形态的“无生年龄”。
- 中：嵌在无伤皮肤布上的孤立伤疤，被难民毯包裹，表现“无伤伤疤”。
- 右：装在迁徙板车上的断墙、空盔与焦土碎片，背后没有战场，表现“无战废墟”。
- 三分区，无真实人物面孔，无文字与现代难民机构标识。

### 2. `assets/source-v90-borrowed-cause-sponsorship-office.png`

- 三位非人担保人。
- 左：装着第一步脚印、主动伸出脐带形门闩的古老门槛，表现“门槛认生”。
- 中：装在骨白记忆瓶里、自愿长出血管与裂口的回忆，表现“记忆代伤”。
- 右：从空白画布内向外伸出烧焦战壕边缘的空画框，表现“空框认战”。
- 三分区，无可读契约、印章文字或人脸。

### 3. `assets/source-v90-causal-border-processing-station.png`

- 四种边境程序 `2 × 2`，中央保留空置因果边检台与十字负空间。
- 左上：绕着午夜钟旋转、即将失效的黄铜临时原因签证。
- 右上：用暗红逆向线把一枚原因种子缝进结果果实的骨针机。
- 左下：后果摇篮通过莫比乌斯脐带生出自己的循环机关。
- 右下：原因栏保持空洞、却把现实压出深印的巨大无字印章。
- 象限剪影清晰，不能像现代机场 UI 或操作面板。

### 4. `assets/source-v90-final-asylum-tribunal-for-causeless-consequences.png`

- 三座终审裁定区。
- 左：向无来源年龄、伤疤与废墟敞开的永久庇护门，地面由空白原籍纸铺成。
- 中：一列向时间之前倒行的列车，车厢载着等待原因的后果。
- 右：后果作为祖先坐在谱系树根部，原因像倒生胎儿向过去生长。
- 三分区，庄严、无人物法官、无文字、logo 或现代法庭标识。

运行图：

- `assets/v90-causeless-consequence-refugee-authority.webp`
- `assets/v90-borrowed-cause-sponsorship-office.webp`
- `assets/v90-causal-border-processing-station.webp`
- `assets/v90-final-asylum-tribunal-for-causeless-consequences.webp`

冻结资产均为 `1536×1024`；源图由内置 ImageGen 生成，运行图以 Pillow `quality=85, method=6` 压缩，并已逐张复核构图分区、HTML 热区留白、文字污染与 WebP 观感：

| 资产 | 字节 | SHA-256 |
| --- | ---: | --- |
| `assets/source-v90-causeless-consequence-refugee-authority.png` | 2766725 | `a27a0f26105a5245805c5dbf89be9610b1feb48e67c4888da9f9a078083f6b63` |
| `assets/v90-causeless-consequence-refugee-authority.webp` | 270844 | `7672a341d6248a3101ab0446d589beb4243db180e600bcf8d52ef48290c486fd` |
| `assets/source-v90-borrowed-cause-sponsorship-office.png` | 2709796 | `f7e37bfe2efdb920840d1d819d043bcfc9cbaa3f4568437ded690f77e3c7592a` |
| `assets/v90-borrowed-cause-sponsorship-office.webp` | 280282 | `e944cadb97fdbfccbcdf727fb0bee0a3a5123b4a7a197d6a7638fe30684e8153` |
| `assets/source-v90-causal-border-processing-station.png` | 3056374 | `95c8b079fa9427483ee7cb4d839da680110e1e6e82e686ad806abd5d1b7fb3e1` |
| `assets/v90-causal-border-processing-station.webp` | 342682 | `1a1137b8c3ca08f1a87382d4e5c994a097f918f220d115a1d9139245562436ba` |
| `assets/source-v90-final-asylum-tribunal-for-causeless-consequences.png` | 2917963 | `82f5f9c3609e8d9fbd29a8abdf685f54addffd9e0290ada38417b9dbb31a5fa5` |
| `assets/v90-final-asylum-tribunal-for-causeless-consequences.webp` | 311360 | `9241c57ce0fe11aacbfe4fdc93bbbc05e137be68c10dc11bd0458fe2df5cf277` |

alt 文本冻结：

1. `无因后果难民署：左侧无生年龄提箱、中央无伤伤疤披毯、右侧无战废墟迁徙车`
2. `借因担保所：左侧自称出生的旧门槛、中央自愿成为伤口的记忆容器、右侧认领战争的空画框`
3. `因果边境处理站：左上临时因签证钟、右上缝因入果针机、左下自因循环摇篮、右下空因现实印章`
4. `无因后果终审庇护庭：左侧普遍因果庇护门、中央遣返至原因之前的逆向列车、右侧后果成为原因祖先的倒生谱系`

## 静态与浏览器门槛

- 193 scenes、cache `v=90`、4 route/title/preload/directory 全覆盖；
- 资产源图/运行图尺寸、哈希、字节冻结；
- 11 键、36+3、七 pending、三 activeConsul、四份 coverage、18 `isTrusted`；
- v89 解锁正反例、v89 key 只读、forget-all、旧版本治理回归；
- 三处旧 target 窄桥、领事动态 ID 与 `index.html` 实际 DOM 全量联动；
- 未解锁 direct load / hashchange / synthetic data-go 统一回退 `remembrance`，地址归一；
- 单 Chrome 窗口单标签 Desktop / `390×844` Mobile；
- 真实四条庇护流程覆盖 3 refugees / 3 sponsors / 4 protocols / 3 old targets；
- 三项终审裁定真实点击抵达 `threshold` / `remembrance` / `unending-gallery`；
- pending 冷恢复、刷新幂等、坏档容错、console/resource 0 production error；
- QA 后精确恢复用户原始 localStorage、hash、窗口、标签页与设备模拟状态；
- 浏览器不残留 QA 种子、临时 CSS、DevTools 或额外标签页。

## 当前实现与验证记录（2026-08-31）

- 生产实现已接入 `index.html`、`styles.css`、`script.js` 与 `tests/site.test.mjs`，页面总场景数为 193，缓存标记为 `v=90`。
- v90 全页初始化缺失曾导致入口、记忆、图鉴、领事与 pending 恢复未在 `DOMContentLoaded` 尾部同步；现已在 `replayAccomplishedFactEvictionPending("threshold")` 之后、`revealScene(scenes.threshold)` 之前按顺序补齐 11 个既有同步 / 重绘 / 重播调用，并增加顺序断言。
- 当前静态门禁：`node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check`、`node tests/site.test.mjs` 全部通过；测试输出 `site.test.mjs: 16343 assertions passed`。
- 当前浏览器复核确认正常初始化；未解锁直达 `#causeless-consequence-refugee-authority` 会归一到 `#remembrance`，刷新稳定，控制台无 error/warn。
- 详细玩家路线见 `docs/GameplayFlow.md`。

## v91 活口

终审庭允许后果成为原因的祖先以后，第一批原因开始在自己的结果之后出生。它们没有童年，只有一份早于自己存在的遗产；它们要求现实补发出生顺序，并追认后果为法定父母。

下一站：

`倒生原因助产院 / MATERNITY WARD FOR CAUSES BORN AFTER THEIR CONSEQUENCES`

它会问：若原因由后果生下，究竟是谁先发生，又该由谁继承谁？
