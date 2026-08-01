# v58 异议总署 / THE APPEAL REGISTRY

## 目标

把 v57 的后果系统继续向内扩展：玩家过去的共证、修复、转嫁、自担与责任值真正改变后续复核内容与落点。

- 不往 threshold 塞热点；唯一入口是责任账房复访时图内的「异议封签」。
- 总署是非线性 hub：三路复核室自由选择，完成任意 2 间解锁结案，不强制、不抢走第三间。
- 历史回响真实可见：总署说明与三房各至少一条反馈按 v57 派生 profile 变化；结案落点由点击前分值与 v57 profile 纯函数决定。
- 全部主交互为图内原生 button 热点，点击/键盘一拍反馈后自动转场，无底部继续按钮。

## 素材（冻结）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v58-appeal-registry.png` | `a53708d2fc1211ff3be7665fbfd377b1ada445cafa9b67f0bc856672b17d6095` |
| `design-references/source-v58-identity-correction.png` | `b1a679a75be7cde21c7079c8eda511fa0e14658aece1285bbbe5a9858ef20308` |
| `design-references/source-v58-evidence-contradiction.png` | `036288e5264c777d4dc9c4abc8ed3955d630848d330405ebdbe10c4e8d7c3ff0` |
| `design-references/source-v58-destination-review-shaft.png` | `6aff29cc5c935b7c0ee738e97620dafd87ad069d486c301cc8fa2d8b90333500` |

WebP（Pillow q85 method=6，1536×1024 无裁切转码，均在 ~300KB 预算内）：

- `assets/v58-appeal-registry.webp`（247 KB）
- `assets/v58-identity-correction.webp`（215 KB）
- `assets/v58-evidence-contradiction.webp`（233 KB）
- `assets/v58-destination-review-shaft.webp`（187 KB）

## 入口：责任账房图内「异议封签」

- 封签 `#ledger-appeal-seal` 位于责任账房台面左下红蜡封，随页面 `hidden` 出厂；
  仅 `appealProfile().eligible` 为真时显露，资格不足时点击（含合成点击）零副作用。
- 资格同时满足（全部从 v57 canonical 状态派生，不落盘、不可伪造）：
  1. v57 `actions` 中有动作计数的不同后果房（theatre/quarantine/shaft/misbound）≥ 3；
  2. 账房三动作（return-verdict/sign-self/assign-vacancy）计数合计 ≥ 1。
  第一次到账房还没结算时不满足第 2 条，不能提前进入。
- 点击只记 v58 入口节拍（history `{type:"entry"}` + entry pending），不改 v57 任何分值；
  一拍反馈（`封签断开。异议总署收下你的责任簿，三本索引同时翻开。`）后自动转场总署。
- 目录直达（`01ω½ / 异议总署` 首次合法到访后解锁）走同一窄守卫，安全渲染但不伪造资格：
  资格不足时总署说明渲染为中性文案，分值/结案全部按空 history 派生为零。

## 状态契约

独立 key（全仓库唯一）：`goddead_v58_appeal`

```json
{
  "version": 58,
  "cycle": 1,
  "visits": { "registry": 0, "identity": 0, "evidence": 0, "destination": 0 },
  "pending": null,
  "history": []
}
```

- 只持久化上述白名单 canonical 字段（`saveAppeal` 显式投影，`history.slice(-16)`）；
  `version !== 58` 整体丢弃。objection/precedent/contamination、已结算房间、可否结案、
  v57 profile、最终 target 全部由可信 history（仅当前 cycle 的 action 条目计分，
  同一房间同一 cycle 只计首次）与当前合法 v57 状态重算，永不落盘。
- `cycle` 对齐 v35：floor cycle 变化后旧 cycle 的 history 条目保留但不参与本轮派生，
  本轮分值/已结算房间自动归零隔离；visits 保留。
- 归一：坏 JSON/数组/错型 → 默认；数值有限、非负、向下取整、封顶 9999；
  history 条目白名单三种形状（entry/close/action，action 须房间+动作双白名单）。
- pending 严格白名单：entry/close 恰好五键 `{cycle,feedback,kind,scene,target}`，
  action 恰好六键（多一个 action 键，额外键即伪造）；target/feedback 逐字重算；
  结算证据 = canonical history 末项一致 + cycle 一致 + 当前派生资格
  （entry 须 v57 资格仍在，close 须本轮仍满两间，action 须该房本轮已派生结清）。
  pending 只消费一次：转场 before 原子清除；刷新重播逐字反馈并精确重挂，不二次计分。

## v57 profile 派生（历史回响）

`appealProfile()` 从合法 v57 状态派生，全部只读：

- `dominantResponsibility`：四项责任分值取最高；**平局固定顺序（文档化，不可改序）：
  selfBurden（自担）> transfer（转嫁）> repair（修复）> concordance（共证）**；全零为 `none`。
- `liability`：v57 派生责任值（共证+修复+自担−2×转嫁）。
- `lastRoom`：v57 canonical history 中最近一条后果房 action（theatre/quarantine/shaft/misbound），无则空。
- `eligible`：见入口资格。

回响落点（逐字冻结于 tests/site.test.mjs）：

- 总署 `#appeal-desc`：资格齐备时按 dominant + liability + lastRoom 成句，否则中性文案。
- 身份勘误 `erase-subject`：五段按 dominant 变化（含 none 兜底）。
- 证据对照 `preserve-conflict`：五段按 lastRoom 变化（含无后果房兜底）。
- 去向复核 `assign-vacancy`：两段按 liability 符号变化并逐字带责任值。

## 总署 hub（非线性）

- 左侧身份电话与镜片 → `#identity-correction`；中左双份卷宗 → `#evidence-contradiction`；
  右侧三路分发台 → `#destination-review-shaft`：纯导航节拍（逐字反馈一拍后转场），不计分不写 history。
- 中右锁链账本 `#appeal-close`：本轮 < 2 间时 `aria-disabled="true"` 且视觉压暗，
  点击只出拒绝文案（`锁链还压着账本：任意两间复核室结清后，印才会松。`）不转场；
  ≥ 2 间解锁（签明示「可开印」）但不强制——可继续做第三间，结案永远等玩家主动点。
- 已结清房间可复访：动作只重播反馈、不二次计分、不自动转场；
  每房提供画面内回总署热点（身份：底部滑轨 / 对照：后墙库门 / 复核井：左拱门），纯导航节拍。

## 三房 9 动作（逐字反馈与分值冻结）

### 身份勘误室 `identity-correction`

| 动作（热点物件） | 分值 | 反馈 |
| --- | --- | --- |
| accept-subject（中央证人椅/名牌） | precedent +2 | 名牌嵌进证人椅。先例不需要脸，只需要一个被承认坐过的位置。 |
| substitute-subject（右裂镜/空制服） | objection +1, contamination +1 | 裂镜把你的轮廓试进空制服。制服合身的那一刻，证词开始认错人。 |
| erase-subject（左电话/空肖像） | objection +2, contamination +1 | 按 dominant 五段变化（见上） |

### 证据对照库 `evidence-contradiction`

| 动作（热点物件） | 分值 | 反馈 |
| --- | --- | --- |
| merge-records（中央错位玻璃对照片） | precedent +2 | 错位玻璃被压到同一刻度。两页对照片合成一份先例，裂缝归进注释。 |
| preserve-conflict（左白卷宗） | objection +2 | 按 lastRoom 五段变化（见上） |
| destroy-copy（右污卷宗/焚盘） | contamination +2, precedent +1 | 污卷宗送进焚盘。灰被称重归档：先例多了一页，污染多了一撮。 |

### 去向复核井 `destination-review-shaft`

| 动作（热点物件） | 分值 | 反馈 |
| --- | --- | --- |
| return-origin（左回程轮轨） | objection +2 | 回程轮轨倒转半圈。封箱被退回出发的一侧，异议随箱原路返回。 |
| assign-vacancy（中央悬吊封箱） | precedent +2, contamination +1 | 按 liability 符号两段变化并带责任值（见上） |
| drop-below-map（右断轨/落井杆） | contamination +2 | 断轨尽头的落井杆被压下。封箱坠到地图以下，污染沉入没有编号的深度。 |

## 结案路由真值表（纯函数，点击前分值决定）

`appealCloseTarget(scores, settledCount, liability, lastRoom)`，记 o=objection、p=precedent、c=contamination：

| 条件（按优先级） | 目标 |
| --- | --- |
| settledCount===3 且 o=p=c 且 o>0 | `unnumbered-floor`（特殊平衡，仅三房全完成） |
| p 严格最高 | liability>=0 → `concordance-theatre`；否则 `misbound-handover` |
| o 严格最高 | lastRoom∈{quarantine,shaft} → `protocol-drift`；否则 `evidence-vault` |
| c 严格最高 | liability<0 → `false-positive-shaft`；否则 `omission-transfer-shaft` |
| o=p>c | `liability-ledger` |
| o=c>p | `blank-name-cloakroom` |
| p=c>o | `misbound-handover` |
| 其他极端/空状态 | `liability-ledger`（兜底） |

结案反馈逐字说清「哪类异议占上风 + 为什么被送到该处」（含并列与兜底的成句），
一拍后自动转场；before 原子清 pending 并补齐目标场景旧守卫凭证
（v57 场景 `grantLedgerVisit`、vault/shaft `markReviewVisited`）。

## 守卫

- 四场景 direct hash 窄守卫：`pendingTarget === target || visits[key] > 0` 放行，
  否则归一回 `#unnumbered-floor`；不放宽任何旧守卫。
- 转场 before 先原子记 v58 visit 再清 pending（同 v57 契约，避开守卫竞争）。
- 入口封签 + hub 三导航 + 结案 + 9 动作 + 3 回总署，共 5 组监听只接受 isTrusted 真实 click：
  合成 `HTMLElement.click()` 在 active 场景同样零副作用；鼠标/触控/Tab+Enter/Space 不受影响。
- 旧 v31–v57 状态、门敲击、reliquary 零读写污染（v58 只读 v57，从不写）。

## 目录与记忆

- Archive Directory：`01ω½ / 异议总署`、`01ωα / 身份勘误`、`01ωβ / 证据对照`、
  `01ωγ / 去向复核`（首次合法到访原子恢复）。
- Remembrance 单行：`异议署：异议 O，先例 P，污染 C，本轮已复核 N/3。`，仍八张统计卡。
- 遗忘全部：v58 key 随全量清除移除，四目录与记忆行隐藏、封签重新 hidden、四场景未到访态恢复。

## 热点坐标（1536×1024 舞台百分比，桌面/移动共用，44px 增长后互不重叠）

- 责任账房：异议封签 63/2/13/12（台面左下红蜡封，与既有三热点不重叠）。
- appeal-registry：identity 48/6/17/32（左身份电话与镜片）、evidence 56/25/24/24（中左双份卷宗）、close 50/53/19/32（中右锁链账本）、destination 52/74/24/34（右三路分发台）。
- identity-correction：erase-subject 42/6/23/36（左电话/空肖像）、accept-subject 30/38/24/44（中央证人椅/名牌）、substitute-subject 33/69/26/46（右裂镜/空制服）、回总署 80/43/14/14（底部滑轨）。
- evidence-contradiction：preserve-conflict 56/2/30/36（左白卷宗）、merge-records 40/35/30/52（中央错位玻璃对照片）、destroy-copy 54/68/30/42（右污卷宗/焚盘）、回总署 10/45/12/22（后墙库门）。
- destination-review-shaft：回总署 12/1/12/24（左拱门）、return-origin 40/8/20/26（左回程轮轨）、assign-vacancy 40/38/24/32（中央悬吊封箱）、drop-below-map 26/78/18/34（右断轨/落井杆）。

## QA 契约

1. 四场景三视口几何（图内/零重叠/自命中/≥44px/短标签不溢出/1440×800 首屏可操作，含封签与既有三热点）。
2. 入口资格：不足时封签 hidden 且点击零副作用；齐备时可见；点击只记 entry、v57 字节不变、一拍转场。
3. 9 动作逐字反馈、精确派生分值、首次自动回总署、复访不二次计分不转场、回总署热点导航。
4. 结案：1 房拒绝文案；2 房解锁不强制（可续第三间）；2 房/3 房结案路径；2/2/2 特殊仅三房全完成。
5. 路由真值表全分支（liability 正负 × lastRoom 四态 × 三种并列 × 兜底）。
6. pending 三种（entry/action/close）合法 reload 重播一次不二次计分；
   伪造（错 feedback/额外键/错 cycle/无证据/错 action/错 version）全丢弃。
7. v57/v54/v37 字节级零污染；遗忘全部后 key/目录/记忆/封签/守卫全部回弹。
8. 四种 v57 profile（dominant 各一）动态文案逐字；liability 正负影响 assign-vacancy。
9. 目录×4、记忆单行、八卡、Tab/Enter/Space、console 零异常。

## 验收记录（2026-08-01 实测）

- 静态四检：`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`（3922 断言全绿，v58 块新增 167 条同口径实测）、`git diff --check` 全部通过。
- CDP 实机：`/tmp/v58-qa/v58-smoke.mjs`（真实 headless Google Chrome + 内嵌静态服务器 + 真实鼠标/键盘，种子预注入）**650/650 连续两轮全绿**，控制台零异常。覆盖：四场景 × 1440×1024/1440×800/390×844 几何（图内/零重叠/自命中/≥44px/短标签不溢出/1440×800 首屏）+ 封签两视口与既有三热点零重叠、入口资格三态、entry 节拍 v57 字节不变、9 动作逐字 + 精确派生分值 + 首次自动回总署、复访不二次计分 + 回总署热点、1 房拒绝 / 2 房解锁不强制 / 2/2/2 仅三房、结案路由九分支逐字 + 落点、三种 pending reload 重播一次不二次计分 + 实时 reload 竞态、伪造六态 + 错版本 + 无资格 pending 全丢弃、坏存档五态归一 + raw canonical 五键 + history 16、v57/v54/v37 字节级零污染、目录×4/记忆单行/八卡/遗忘 DOM 回弹、四种 profile 动态文案逐字两两不同、Tab/Enter/Space、active 场景合成 click 零副作用。
- 视觉证据 9 张 `design-qa-evidence/v58-01~09`：01 总署、02 身份勘误、03 证据对照、04 去向复核、05 账房封签、06 可开印态、07 2/2/2 结案节拍、08 总署移动端、09 身份勘误移动端；热点全部压中物件、移动端短标签无裁切无互盖、标题与异议签无溢出。
- 保护边界：`docs/KimiUsageLog.md`、全部 source-v53~v58 PNG 哈希不变；未执行 git add/commit/push/stash；未安装依赖；QA 后 Chrome 进程与临时 profile 已清理。
- 剩余风险：结案路由的「其他极端/空状态兜底 → liability-ledger」分支在合法游玩路径不可达（任意两房组合的分值必落入显式分支），仅有静态断言与兜底代码保护；history 16 条上限下，单 cycle 内反复结案（close 不计分但写 history）可能挤出最早的 action 条目、改变后续派生——属 canonical 有界历史的设计行为，已文档化。
