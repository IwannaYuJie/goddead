# v67 无血家谱设计案 / THE FAMILY THAT NEVER SHARED BLOOD

日期：2026-08-09
状态：已实现并通过静态测试与 Codex 内置浏览器独立验收
前置：v66 已覆盖四起点、三处理、三归属，并真实收集三条元结局

## 一句话概念

三种 v66 元结局全部发生后，那些从未活过的人生不再满足于独自存在。它们开始从纺锤、织机、摇篮与无因生涯中挑选一处祖根，再选择祖先 / 同生 / 后代三种亲属关系，以及留存 / 交换 / 退回三种童年继承方式，组合成 4 × 3 × 3 = 36 页无血家谱；覆盖四祖根、三关系、三继承后，再开启三种家族结局。

## 目标与边界

- v67 延续 v66 的组合探索，但叙事对象由“一个未活之生”升级为“未活人生之间的亲属关系”。
- 新增四个场景：反事实宗谱厅、无血档案库、借来童年室、末代家族庭；场景总数 97 → 101。
- 新增 36 页家谱图鉴 + 3 条家族结局图鉴，共 39 条。
- 每次完整登记必须经过 root → bond → memory 三步；不能跳步、伪造 draft 或从地址栏绕过守卫。
- 完成一页家谱后，对应 v66 场景出现独立“无血亲属回声”，显示完整叙事并可返回宗谱厅开始下一轮。
- v67 只读 v66 的规范 lives / metaOutcomes，只写自己的状态键；不改 v66、v65 或任何更早状态。
- v66 四幕原玩法、反馈、热点与 AutoAdvance 全部保留；v67 回声使用独立容器和独立锁。
- 三条家族结局不是总终点：全部收集后仅形成 v68 的未来证据，不添加空按钮、假入口或未实现路由。

## 解锁证据

唯一可信前置函数 `bloodlessGenealogyUnlocked()`：

1. 调用现有 v66 规范读取函数获得 canonical 状态，不直接信任 raw localStorage。
2. v66 `lives` 必须同时覆盖四个 origin、三个 method、三个 inheritance；沿用 v66 的 coverage 真值，不借计数证明。
3. v66 `metaOutcomes` 必须逐项覆盖三条规范 outcome：
   - `many-lives-wear-you`
   - `unlived-bury-themselves`
   - `spindle-outlives-endings`
4. 不信任 `lifeRuns`、`metaRuns`、`lastOutcome`、visited 或单独布尔值。
5. 当前 v66 证据若被 v66 规范器判失效，v67 的入口、目录、记忆、图鉴、回声与路由资格全部回弹；v67 不反向修补 v66。

## 场景一：反事实宗谱厅

路由：`#counterfactual-genealogy`
目录：`03λ / 反事实宗谱`
素材：`assets/v67-counterfactual-genealogy.webp`

入口：Remembrance 新按钮 `bloodless-genealogy-entry-btn`，文案 `让三种元结局生出家谱 ⟶`。仅在 `bloodlessGenealogyUnlocked()` 为真时显示。

画面：深黑石厅中央悬着一棵没有树干的黄铜家谱，只剩四条彼此分开的根。左起四根分别接入一枚仍在转动的纺锤、一段缝合疤痕的织机布、一个悬空摇篮名牌、一件无因生涯的人形外衣。四件物体必须在同一镜头中清楚分离，适合作为四个不重叠热点；图内无文字、字母、数字或水印。

四个 root 热点：

| root | 按钮 id | 中文 | English | 下一幕 | 回声目标 |
| --- | --- | --- | --- | --- | --- |
| `spindle` | `bloodless-root-spindle` | 让纺锤成为祖根 | ROOT THE FAMILY IN THE SPINDLE | `bloodless-archive` | `counterfactual-spindle` |
| `loom` | `bloodless-root-loom` | 让疤痕织机成为祖根 | ROOT THE FAMILY IN THE SCAR LOOM | `bloodless-archive` | `scar-loom` |
| `nursery` | `bloodless-root-nursery` | 让空摇篮成为祖根 | ROOT THE FAMILY IN THE EMPTY CRADLE | `bloodless-archive` | `unlived-nursery` |
| `room` | `bloodless-root-room` | 让无因生涯成为祖根 | ROOT THE FAMILY WITHOUT A CAUSE | `bloodless-archive` | `life-without-cause` |

选择 root 后写合法 pending；到达无血档案库前原子提交 `draft={root,bond:""}`。从 Remembrance 重开一轮时清旧 draft 与 activeKin，但不删除已收集 records。

## 场景二：无血档案库

路由：`#bloodless-archive`
目录：`03μ / 无血档案`
素材：`assets/v67-bloodless-archive.webp`

画面：横向黑石档案库摆着三份彼此分离的亲属证明。左侧是一尊面朝后世、年龄倒置的祖先胸像；中央是两把由同一根红线绑住、却没有镜面倒影的同生椅；右侧是一只从未来寄回、装着空白婴儿腕带的后代档案匣。三件物体清晰分离，图内无文字、字母、数字或水印。

三个 bond 热点：

| bond | 按钮 id | 中文 | English | 下一幕 |
| --- | --- | --- | --- | --- |
| `ancestor` | `bloodless-bond-ancestor` | 认作一位晚生的祖先 | CLAIM A LATE-BORN ANCESTOR | `borrowed-childhood` |
| `twin` | `bloodless-bond-twin` | 认作一位未曾同生的手足 | CLAIM A TWIN WHO NEVER SHARED BIRTH | `borrowed-childhood` |
| `descendant` | `bloodless-bond-descendant` | 认作一位先到的后代 | CLAIM A DESCENDANT WHO ARRIVED FIRST | `borrowed-childhood` |

直达必须要求 `draft.root` 合法且 `draft.bond===""`；选择 bond 后，到达下一幕前提交规范 `draft={root,bond}`。

## 场景三：借来童年室

路由：`#borrowed-childhood`
目录：`03ν / 借来童年`
素材：`assets/v67-borrowed-childhood.webp`

画面：同一间暗室里摆着三座独立童年保存装置。左侧玻璃柜保存一双从未沾过泥的旧童鞋；中央交换秤两端各放一枚不同年代的乳牙；右侧退件槽正把一只没有主人影子的玩具木马送回黑暗。三处清晰分离，图内无文字、字母、数字或水印。

三个 memory 热点：

| memory | 按钮 id | 中文 | English |
| --- | --- | --- | --- |
| `keep` | `bloodless-memory-keep` | 留下这段伪造的童年 | KEEP THE FORGED CHILDHOOD |
| `exchange` | `bloodless-memory-exchange` | 与亲属交换童年 | EXCHANGE CHILDHOODS WITH THE KIN |
| `return` | `bloodless-memory-return` | 把童年退回出生以前 | RETURN CHILDHOOD BEFORE BIRTH |

选择 memory 后生成唯一 record id：`root:bond:memory`。合法 id 总数严格为 36，排序固定为 `ROOTS × BONDS × MEMORIES`。

### 36 页家谱的冻结生成规则

生产代码以三个冻结表组合标题与反馈，不允许从 DOM 文本或 raw state 拼凑。

Root 片段：

| id | 图鉴前缀 | 叙事片段 |
| --- | --- | --- |
| `spindle` | `纺锤为根` / `ROOTED IN THE SPINDLE` | 它把纺锤的第一圈转动认作祖辈留下的心跳； |
| `loom` | `疤痕为根` / `ROOTED IN THE SCAR LOOM` | 它从织机上最旧的伤口里找到一张没有血迹的出生证； |
| `nursery` | `摇篮为根` / `ROOTED IN THE EMPTY CRADLE` | 空摇篮先把它记进家谱，随后才承认自己从未生过它； |
| `room` | `无因为根` / `ROOTED WITHOUT A CAUSE` | 无因生涯陈列间给它一位不存在的亲属，并让那位亲属先活了很多年； |

Bond 片段：

| id | 图鉴中缀 | 叙事片段 |
| --- | --- | --- |
| `ancestor` | `晚祖` / `ANCESTOR-CLAIMED` | 它向一个比自己更晚出生的人行祖礼； |
| `twin` | `异生` / `TWIN-BOUND` | 它与另一个未活之生共享同一段从未发生的童年； |
| `descendant` | `先裔` / `DESCENDANT-KEPT` | 它把未来尚未出现的空缺抱成自己的后代； |

Memory 片段：

| id | 图鉴后缀 | 叙事片段 |
| --- | --- | --- |
| `keep` | `留年` / `CHILDHOOD-KEPT` | 最后，它保留这段伪造的童年，并开始怀念其中每一天。 |
| `exchange` | `换年` / `CHILDHOOD-EXCHANGED` | 最后，它把童年交给亲属，换回一段记得自己的衰老。 |
| `return` | `退年` / `CHILDHOOD-RETURNED` | 最后，它把童年退回出生以前，家谱却仍拒绝删去那一页。 |

图鉴标题格式固定为：`{Root 图鉴前缀} · {Bond 图鉴中缀} · {Memory 图鉴后缀}`。反馈为三个叙事片段逐字无空格连接。由固定表得到 36 个唯一标题、唯一 id 与唯一反馈。

结算目标由 root 固定映射到四个 v66 场景。到达前原子：加入 records（首次才增加发现数）、`recordRuns+1`、写 lastOutcome、写精确 activeKin、清 draft 与 pending。目标场景显示完整反馈和返回宗谱厅按钮。

## 四个 v66 场景的无血亲属回声

四个独立容器，不复用 v66 原响应区、未活回声或三个元结局按钮：

| root | 场景 | 容器 id | 返回按钮 id | 文案 |
| --- | --- | --- | --- | --- |
| `spindle` | `counterfactual-spindle` | `bloodless-kin-spindle` | `bloodless-kin-return-spindle` | 把纺锤认下的亲属送回宗谱厅 ⟶ |
| `loom` | `scar-loom` | `bloodless-kin-loom` | `bloodless-kin-return-loom` | 把伤口认下的亲属送回宗谱厅 ⟶ |
| `nursery` | `unlived-nursery` | `bloodless-kin-nursery` | `bloodless-kin-return-nursery` | 把摇篮认下的亲属送回宗谱厅 ⟶ |
| `room` | `life-without-cause` | `bloodless-kin-room` | `bloodless-kin-return-room` | 把无因生涯认下的亲属送回宗谱厅 ⟶ |

`activeKin` 必须精确反算到已收集 record：root 与 id 首段一致，feedback 与三表组合逐字一致。返回只清 activeKin/draft 并进入宗谱厅，不删除 records。

## 场景四：末代家族庭

路由：`#last-family-court`
目录：`03ξ / 末代家族`
素材：`assets/v67-last-family-court.webp`

解锁 `bloodlessCoverageComplete()`：已收集 records 同时覆盖四个 root、三个 bond、三个 memory。按最优选择至少四轮可开，不要求收满 36 页。

入口：Remembrance 按钮 `bloodless-family-entry-btn`，文案 `让三十六页家谱互认血缘 ⟶`。

画面：一座没有法官的家族庭。左侧是向后延伸、每张座椅都披着空外衣的后代席；中央是一把由所有家谱根线汇成、等待共同祖先坐下的高背椅；右侧是一棵被从时间轴上整齐割断、根与枝同时悬空的黑色族树。三处清晰分离，图内无文字、字母、数字或水印。

三个家族结局：

| action | 按钮 id | outcome | 标题 | 反馈 | target |
| --- | --- | --- | --- | --- | --- |
| `become-ancestor` | `bloodless-family-become-ancestor` | `you-became-common-ancestor` | 众生认祖 · ALL LIVES DESCEND FROM YOU | 家谱把所有空白世代折向你的名字。从此每个未出生者都先叫你祖先。 | `threshold` |
| `inherit-you` | `bloodless-family-inherit-you` | `descendants-inherited-you` | 后代继承你 · THE DESCENDANTS INHERITED YOU | 后代没有继承你的血，只继承你没有活完的部分。 | `remembrance` |
| `orphan-eras` | `bloodless-family-orphan-eras` | `every-era-became-an-orphan` | 万世成孤 · EVERY ERA BECAME AN ORPHAN | 你把家谱从时间上撕下，每个世纪都同时失去自己的父母与孩子。 | `unending-gallery` |

三个动作可在重访时重复；`familyOutcomes` 只记首次发现，`familyRuns` 每次合法到达结算都 +1。全部收集仅作为 v68 未来证据，不露出未实现 UI。

## v67 独立状态

唯一 key：`goddead_v67_bloodless_genealogy`
版本：67
canonical 顶层恰好十键：

```json
{
  "version": 67,
  "visited": {
    "genealogy": false,
    "archive": false,
    "childhood": false,
    "court": false
  },
  "draft": {
    "root": "",
    "bond": ""
  },
  "records": [],
  "familyOutcomes": [],
  "recordRuns": 0,
  "familyRuns": 0,
  "lastOutcome": "",
  "activeKin": null,
  "pending": null
}
```

规范化规则：

- raw 非对象、数组、坏 JSON、错 version：整体回默认值。
- 保存时显式重建十键；顶层额外键、nested 额外键永不回写。
- `visited` 恰四个布尔；`draft` 恰 `root/bond` 两键。bond 非空时 root 必须合法；root 为空时 bond 必须为空。
- `records` 只保留 36 个白名单 id，按 `ROOTS × BONDS × MEMORIES` 固定顺序去重。
- `familyOutcomes` 只保留三个家族结局 outcome，按上表顺序去重。
- `recordRuns/familyRuns` 使用 finite + floor + clamp 0..9999。
- `lastOutcome` 必须存在于规范 records 或 familyOutcomes，否则归空。
- `activeKin` 仅允许 `null` 或精确 `{root,record,feedback}` 三键；record 必须已收集、root 等于 record 首段、feedback 由冻结三表逐字重算。
- 当前 v66 完整证据不成立时，v67 派生 UI 与访问资格全部关闭；读取 v67 时不得借自己的 records 反向证明解锁。

## Strict pending

所有 pending 要求 `Object.keys(...).sort()` 与种类的精确键集相等，额外键即伪造：

1. `entry`：`{kind,target,feedback}`，target=`counterfactual-genealogy`，要求 v66 完整证据。
2. `root`：`{kind,source,root,target,feedback}`，source=`counterfactual-genealogy`，target=`bloodless-archive`，root/feedback 逐字表驱动，要求 draft 为空。
3. `bond`：`{kind,source,root,bond,target,feedback}`，source=`bloodless-archive`，target=`borrowed-childhood`，root 必须等于当前 draft.root、bond/feedback 逐字表驱动。
4. `record`：`{kind,source,root,bond,memory,outcome,target,feedback}`，source=`borrowed-childhood`，target 必须等于 root 的 v66 场景映射，draft 必须逐字匹配，outcome 与 feedback 必须由三表重算。
5. `kin-return`：`{kind,from,target,record,feedback}`，from 为四个 v66 场景之一，target=`counterfactual-genealogy`，record/feedback 必须等于当前有效 activeKin。
6. `family-entry`：`{kind,target,feedback}`，target=`last-family-court`，要求实时 coverage complete。
7. `family`：`{kind,source,action,outcome,target,feedback}`，source=`last-family-court`，其余逐字重算，要求实时 coverage complete 与 court 已访问。

来源页 reload：恢复反馈，锁定该组全部按钮，仅已选按钮 `aria-pressed=true`，只重挂一次 AutoAdvance。
目标页 reload：先原子 arrival settle 再清 pending，不重复 runs/图鉴。
既非 source 也非 target：清伪造 pending，不结算、不转场。
同拍双击/多个按钮竞争：第一项落锁后其余零副作用。

## 路由守卫

- `counterfactual-genealogy`：v66 完整证据 + 合法 entry/kin-return pending，或已真实 visited.genealogy。
- `bloodless-archive`：合法 root pending target，或 visited.archive + 合法 draft.root。
- `borrowed-childhood`：合法 bond pending target，或 visited.childhood + 合法完整 draft。
- `last-family-court`：实时 coverage complete + 合法 family-entry pending，或 visited.court。
- v66 证据不足时，四幕 direct hash 统一收紧到 `remembrance`，不得回退到更早主线房间，也不得保留 v67 pending。

## 19 组可信交互

共 19 组监听：

1. Remembrance 普通入口 ×1
2. root ×4
3. bond ×3
4. memory ×3
5. kin-return ×4
6. Remembrance 家族结局入口 ×1
7. 家族结局 ×3

每组 listener 第一行拒绝非 `e.isTrusted` 的 click；必须同时校验 currentScene、合法 pending、AutoAdvance、按钮可见且未 disabled。反馈先出现、同组按钮立即全锁、选中按钮 `aria-pressed=true`，再创建 pending 与转场；reduced-motion 使用约 300ms 节拍。原生 button 的 Enter / Space 语义不另造 keydown listener。

## Remembrance 与目录

- 记忆行：`无血家谱：已登记 N/36；祖根 纺锤 S / 织机 L / 摇篮 N / 无因 R；亲属 祖先 A / 同生 T / 后代 D；童年 留存 K / 交换 X / 退回 B；家族结局 F/3。`
- v67 图鉴位于 v66 图鉴之后；固定 39 格：36 record + 3 family outcome。
- 普通入口仅在 v67 解锁时显示；家族结局入口仅在 coverage complete 时显示。
- 目录仅在对应 `visited` 为 true 且 v67 仍解锁时显示：
  - `03λ / 反事实宗谱`
  - `03μ / 无血档案`
  - `03ν / 借来童年`
  - `03ξ / 末代家族`
- “遗忘全部”移除 v67 key，并隐藏入口、目录、记忆、图鉴、回声；清 draft、activeKin、反馈、disabled、aria-pressed 与 v67 AutoAdvance，不写 v66。

## 视觉资产冻结要求

最终必须保留四张原始 PNG 与四张运行时 WebP：

| 源图 | 运行时 | 用途 |
| --- | --- | --- |
| `design-references/source-v67-counterfactual-genealogy.png`（1536×1024 / 2222820 B / `8c7de6419ca85418808910293f93b5ac74c648ac3cff57af426ca64596d7d8b5`） | `assets/v67-counterfactual-genealogy.webp`（1536×1024 / 155384 B / `96002c7b3d7a14bc31c4a2ebc140cd8f7214a72c1450c68ff971ebd26783b6b7`） | 四祖根宗谱厅 |
| `design-references/source-v67-bloodless-archive.png`（1536×1024 / 2339598 B / `ddadaab613dd26151e201c9fa5facd52e2159fba3e82b5591c945b3ed3a38b54`） | `assets/v67-bloodless-archive.webp`（1536×1024 / 171456 B / `646514c1588781589062f34a972c90a96d55361f4e0656eed23fe315f8216ee1`） | 三亲属关系档案库 |
| `design-references/source-v67-borrowed-childhood.png`（1536×1024 / 2049225 B / `300cf9dc528c43e18ccdaa3e8a82121061a43534f61985ffd35fcb01e94a33a8`） | `assets/v67-borrowed-childhood.webp`（1536×1024 / 135522 B / `83481bf78e3538297b9ac601cfea670394b6ea7869b890132c0d91002e2caae2`） | 三童年继承装置 |
| `design-references/source-v67-last-family-court.png`（1536×1024 / 2100152 B / `5c00ee3c0fa3c73eb3de5095e8124b6488246f15e93df597f8dec1f79475a627`） | `assets/v67-last-family-court.webp`（1536×1024 / 143158 B / `9945b7363bf16e0a1575f407f4410da551afd7cb4a4cd376a831d5ce5a439fc8`） | 三家族结局庭 |

- 目标尺寸 1536×1024；若生成源图尺寸不同，只允许等比轻微归一或 LANCZOS 归一，禁止改变构图热点语义。
- 运行时统一 Pillow quality=85、method=6，无裁切。
- tests 冻结源图 + WebP 的像素尺寸、字节预算与 sha256。
- 四图均不得出现可读文字、字母、数字、水印、现代 UI 或商标。
- 延续 Goddead 深黑、骨瓷、旧黄铜、暗红线、低饱和写实恐怖质感；关键物件在 1536×1024 与移动中心裁切下仍可辨。

## 测试契约

以 v66 5484 条断言为基线，新增测试后必须报告实际运行断言数，不能只写“all passed”。至少覆盖：

1. 四源图与四 WebP 存在、尺寸、字节预算、sha256。
2. 场景 97 → 101；四 route / title / preload / cache `v=67` / directory label 冻结。
3. 4×3×3=36 record id、标题、反馈唯一且固定顺序；3 条 family outcome 冻结。
4. v67 唯一 key、canonical 十键、nested 精确键、clamp、坏类型与额外键清洗。
5. v67 解锁只能由规范 v66 coverage + 三 metaOutcomes 证明，v66 缺任一项即关闭。
6. 七类 strict pending 精确键集、逐字重算、source/target/else replay、一次性消费、刷新不重计。
7. activeKin 三键反算，四 v66 场景回声互不覆盖 v66 原 UI。
8. 19 组 isTrusted、可见/disabled/currentScene/AutoAdvance、同拍互斥、合成 click 零副作用。
9. Remembrance 39 格图鉴、统计、双入口、四目录、forget-all 清 v67。
10. 旧 v66 key 字节级不变，v63–v66 契约与既有测试继续通过。
11. 窄屏热点定位类与 ≥44px 触达；无横向溢出。

## 浏览器 QA 契约

实装后用本地生产文件而非 mock 验收：

- 桌面 1280×720 与移动 390×844：四幕 active、四张图片 complete 1536×1024、热点均在图内/零重叠/≥44px、scrollWidth 等于视口。
- locked：缺 v66 coverage 或缺任一 metaOutcome 时，四幕 deep link 全回 `#remembrance`，v67 UI 全隐藏。
- ready：完整 v66 种子显示普通入口；覆盖 records 种子同时显示家族入口、记忆统计、39 格图鉴与四目录。
- 坏档：draft/records/familyOutcomes/activeKin/pending 的错类型与额外键不报错、不放宽入口。
- 七类 pending：来源页反馈与锁、目标页结算、else 清理；record/family 直接抵达刷新不重复计数。
- Playwright 程序化 click 若被 `e.isTrusted` 限制，必须明确记录零副作用；不得冒充 clean 真人点击通过。
- 全程 console warning/error=0。

## v68 活口（不实装）

当三条 familyOutcomes 全部真实收集后，未来可以开启“世代借贷”：亲属不再交换童年，而开始互相借走寿命、死亡年份与尚未发生的葬礼。v67 仅留下可验证的 familyOutcomes 证据，不放置任何死入口。
