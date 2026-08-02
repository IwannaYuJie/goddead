# v59 交叉听证 / THE CROSS-EXAMINATION

## 目标

把 v58 异议总署继续向内扩展：已结清的复核室可以被「深查」，深查足够多之后，
v58 的结案印会被延迟拦截，原裁定被扣到交叉听证台接受二次质询。

- 不往 threshold/总署塞新入口；唯一入口是三间已结清复核室复访时图内的「听证封签」。
- 深查是图面互换：同一场景换 v59 深查 WebP，原 v58 三动作隐藏，恰好两个深查热点显露，
  图内回总署热点保留。
- 结案延迟拦截是窄钩子：v58 原 target/feedback/close history 完全照旧，只抑制 pending 转场；
  v58 pending 保持 null，原目标存入 v59 `deferredTarget`，结案改送交叉听证台。
- 听证台四动作全部图内原生 button 热点，点击/键盘一拍反馈后自动转场，无底部继续按钮。
- 全部派生值（合流/胁迫/残响、已深查房间、可否拦截、可否无字席）由可信 history
  与当前合法 v58 状态重算，永不落盘。

## 素材（冻结）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v59-cross-examination-desk.png` | `c38f1fa18f306d0c57dd1c14df3e68fb5c1925544dc8818c58658d5b29c09b68` |
| `design-references/source-v59-destination-cross-exam.png` | `3f3d2724d3116f9c46347006133030e1017e9379fbdb112c2781cdd2e32beffc` |
| `design-references/source-v59-evidence-cross-exam.png` | `ab36da7dab4a6a76ea53b21bdcc3c17b3f9049dd7afe68573d8542cbd159c9a4` |
| `design-references/source-v59-identity-cross-exam.png` | `100444bb143e35305b68c82967ef2dc4119ceb01678ecd062cf319ddab4e4287` |

WebP（1536×1024 无裁切转码，均在 300KB 预算内，sha256 冻结于 tests/site.test.mjs）：

| WebP | 字节 | sha256 |
| --- | --- | --- |
| `assets/v59-cross-examination-desk.webp` | 286890 | `393169cfb065c0916eeddfafbc5c8422cfa0e7a42ae45852027a35138192cd2d` |
| `assets/v59-destination-cross-exam.webp` | 188714 | `ef6b24054cf71a5e8914b208bb66db41e213d59552982c872e7d6713acfed12d` |
| `assets/v59-evidence-cross-exam.webp` | 240682 | `f921252c256496bc62a1d2438f89dda86fa9d132fc9b5d4137fe453ad5cb7b7e` |
| `assets/v59-identity-cross-exam.webp` | 213310 | `037fd2fe1af078846028386e0c2b16e653024904ca28dee4765c4889b9046d33` |

## 状态契约

独立 key（全仓库唯一）：`goddead_v59_cross_examination`

```json
{
  "version": 59,
  "cycle": 1,
  "visits": { "identity": 0, "evidence": 0, "destination": 0, "desk": 0 },
  "history": [],
  "pending": null,
  "deferredTarget": null
}
```

- 只持久化上述白名单 canonical 六键（`saveCross` 显式投影，`history.slice(-16)`，
  `deferredTarget` 缺省写 `null`）；`version !== 59` 整体丢弃。
  convergence/coercion/residue、已深查房间、是否已拦截/已交付、可否无字席
  全部由可信 history（仅当前 cycle 的条目计分，同一房间同一 cycle 只计首次）
  与当前合法 v58 状态重算，永不落盘。
- `cycle` 对齐 v35：跨 cycle 的 history 条目保留但不参与本轮派生；visits 保留。
- 归一：坏 JSON/数组/错型 → 默认；数值有限、非负、向下取整、封顶 9999。
- history 条目白名单三种形状（逐字冻结于 tests/site.test.mjs）：
  - action：`{type:"action", room, action, cycle}`，房间+动作双白名单；
  - intercept：`{type:"intercept", target, cycle}`，target 限 v58 结案真值表七落点；
  - resolve：`{type:"resolve", action, target, cycle}`，动作+目标双白名单。
- `deferredTarget` 严格重算：只在「本轮有 intercept 条目、尚未交付（无 resolve 条目，
  或末条 resolve 的 pending 仍在交付在途——严格七键校验不过即由 `resolved && !pending`
  统一收回）、本轮深查 ≥2 间、v58 canonical history 末项是本轮 close、v58 pending 为 null、
  且当前 v58 分值/profile 重算出的结案目标与存储值完全一致」时成立，其余一律丢弃——
  reload 不接受任何与现状不符的被扣裁定。
- pending 严格白名单三种，各按自身精确键集（action 恰好七键、intercept 恰好六键、
  resolve 恰好七键；额外键即伪造）：
  - action：`{kind,scene,room,action,target,feedback,cycle}`，
    scene 须为对应 v58 房间场景、target 恒 `appeal-registry`、feedback 逐字重算，
    证据 = history 末项同房同动作 + 该房本轮已深查；
  - intercept：`{kind,scene,target,deferredTarget,feedback,cycle}`，
    scene 恒 `appeal-registry`、target 恒 `cross-examination-desk`、
    feedback 恒拦截文案、deferredTarget 须等于当前重算值，
    证据 = history 末项本轮 intercept；
  - resolve：`{kind,scene,action,target,deferredTarget,feedback,cycle}`，
    scene 恒 `cross-examination-desk`；点击前分值 = 派生分值减去本动作入账的 +2，
    target/feedback 由 `crossDeskResolve` 逐字重算，blank-seat 另需拉平条件成立，
    证据 = history 末项同动作本轮 resolve。
- pending 只消费一次：转场 before 原子清除；刷新重播逐字反馈并精确重挂，不二次计分。
- v59 只读 v58/v57（及更早），从不改写；v58 只通过拦截点合法追加自己的 close history。

## 三房深查（逐字反馈与分值冻结）

结清（v58 正常动作结算）后复访该房，图内「听证封签」显露；结清前/已深查后封签
hidden，点击（含合成点击）零副作用。封签节拍只换图与揭示热点，不计分不写 history：

- 身份勘误室：`听证封签断开。电话那头的喘息被准许再做一次证。`
- 证据对照库：`听证封签断开。对照库准许重新称一次血蜡的温度。`
- 去向复核井：`听证封签断开。复核井准许再听一次井底的呼吸。`

深查态：同场景换 v59 深查 WebP（`img.src` 互换 + figure aria-label 互换）、
原 v58 三动作 hidden、两个深查热点显露、图内回总署热点保留。首次深查动作一拍计分、
逐字反馈、自动回总署；同 cycle 复访停留在深查图、示出既往结果、不二次计分、不自动转场。

### 身份勘误室 · 深查

| 动作（热点物件） | 分值 | 反馈 |
| --- | --- | --- |
| replay-voice（左放音鼓与听筒） | convergence +2 | 来电里的喘息与登记台的漏拍重合。两份证词开始共享同一条呼吸。 |
| force-name（中央玻璃听证椅） | coercion +2, residue +1 | 针尖替空白写下姓名；椅背先收紧，余音才承认那个人存在。 |

### 证据对照库 · 深查

| 动作（热点物件） | 分值 | 反馈 |
| --- | --- | --- |
| align-timestamps（中央三表齿轮仪） | convergence +2 | 三枚停住的秒针在同一刻复动。矛盾没有消失，只被迫共用一个时间。 |
| lift-blood-wax（右玻璃罩血蜡） | residue +2 | 罩下的血蜡仍在回温。被删去的证据以指纹的形状留了下来。 |

### 去向复核井 · 深查

| 动作（热点物件） | 分值 | 反馈 |
| --- | --- | --- |
| trace-cable（左仪表与绕行缆线） | convergence +1, coercion +1, residue +2 | 缆线绕过门牌，直接勒住收件人的座位。目的地与命令来自同一只手。 |
| listen-below（右听音喇叭） | residue +2, coercion +1 | 井底没有回声，只有下一位收件人被提前念出的呼吸。 |

## 结案延迟拦截（窄钩子）

`chooseAppealHub("close")` 内、原 target/feedback 计算与 close history 追加**之后**、
v58 pending 武装**之前**的唯一钩子：

- 本轮深查 < 2 间：v58 行为逐字节不变（锁印拒绝/正常结案 pending/正常转场）。
- 本轮深查 ≥ 2 间且本轮尚无 resolve：`saveAppeal` 只带 close history（pending 保持 null），
  v59 追加 `{type:"intercept", target}`、存 `deferredTarget = target`、武装 intercept pending，
  反馈逐字：`结案印没有落下。三张听证封签把原裁定扣在桌下，要求交叉询问。`，
  一拍后自动转场 `cross-examination-desk`。
- 本轮已交付（有 resolve 条目）后再点结案：钩子不再拦截，落回 v58 正常结案
  （被扣裁定已交付一次，新的结案是新裁定）。
- reload 接受 intercept 的条件见状态契约：末条 canonical v58 close + 当前 v58 状态
  重算同一目标，缺一即整体丢弃；desk 到达时 before 原子清 pending（consume once）。

## 交叉听证台 `cross-examination-desk`

图内四热点：左归并证词 / 中央标记胁迫 / 右封存残响 / 前景无字席（出厂 hidden）。
说明行氛围化示出派生分值与被扣原裁定去向
（`原裁定本要送往「…」。合流 X、胁迫 Y、残响 Z，听证台等一个动作。`）。
无被扣裁定或本轮已交付时全部动作零副作用。

**路由用点击前分值，动作入账 +2 在路由之后**（无字席不计分）：

| 动作 | 条件（点击前分值） | 目标 | 反馈 |
| --- | --- | --- | --- |
| merge-testimonies | convergence ≥ coercion 且 ≥ residue | **deferredTarget** | 证词被编成一股绳，原裁定因此获得第二次生效。 |
| merge-testimonies | 否则 | concordance-theatre | 三份证词被强行并排；它们同意的，恰好是从未发生的部分。 |
| mark-coercion | coercion ≥ residue | protocol-drift | 勒痕被标在规程上。命令终于暴露了它自己的手腕。 |
| mark-coercion | 否则 | misbound-handover | 勒痕没有指向命令，只把错误的名字又绑紧了一层。 |
| archive-residue | residue ≥ convergence | blank-name-cloakroom | 余响被封进无名档案。被擦掉的那个人在空衣架后继续呼吸。 |
| archive-residue | 否则 | evidence-vault | 余响被归档为证物；它不再说话，却开始替所有缺口作证。 |
| blank-seat | 三房全深查 且 点击前 convergence=coercion=residue>0 | unnumbered-floor | 第四块铭牌没有刻字。你坐下后，楼层编号从目录里退了一格。 |

- 每次点击：append `{type:"resolve", action, target}` → 该动作分值 +2 →
  武装 resolve pending → 一拍自动转场；到达时原子清 pending 与 deferredTarget，
  并补齐目标场景旧守卫凭证（v57 场景 `grantLedgerVisit`、evidence-vault `markReviewVisited`）。
- reload 重播：合法 resolve pending 重放逐字反馈并精确重挂一次，不二次计分。
- **无字席可达性（已核算并文档化）**：三房深查分值组合共 2×2×2=8 种，逐项枚举
  （conv, coe, res）∈ {(5,1,2),(4,1,2),(3,1,4),(2,1,4),(3,3,3),(2,3,3),(1,3,5),(0,3,5)}，
  **唯一**完全拉平的合法组合是 force-name + align-timestamps + trace-cable = (3,3,3)；
  其余七组与任何两房状态都不显露无字席（静态断言逐一枚举冻结于 tests/site.test.mjs，
  浏览器 QA 对可达组合实测显露/点击、对其余组合实测 hidden+惰性）。

## 守卫

- `cross-examination-desk` direct hash 窄守卫：仅本轮合法 `pendingTarget === desk`
  或 `visits.desk > 0` 放行；否则回退到合法的异议总署
  （`appealGuard.pendingTarget === "appeal-registry" || visits.registry > 0`），
  总署不合法时归一 `#unnumbered-floor`。不放宽任何旧守卫。
- 深查发生在原 v58 场景内（无新场景路由），复用 v58 四场景守卫。
- 转场 before 先原子记 v59 visit 再清 pending（同 v58 契约，避开守卫竞争）。
- 封签 + 深查动作 + 听证台共 3 组监听只接受 isTrusted 真实 click：
  合成 `HTMLElement.click()` 在 active 场景同样零副作用
  （全仓库 isTrusted 监听组数 7 → 10，已同步冻结于测试）。
- 旧 v31–v58 状态零读写污染（v59 只读）；v58 只经拦截点追加自己的 close history。

## 目录与记忆

- Archive Directory：`01ωδ / 交叉听证`（首次合法 desk 到访原子恢复，随遗忘隐藏）。
- Remembrance 单行：`交叉听证：合流 X，胁迫 Y，残响 Z，本轮深查 N/3。`，仍八张统计卡。
- 遗忘全部：v59 key 随全量清除移除；目录链接与记忆行隐藏；三房图面/aria-label/
  封签/深查热点/v58 热点/响应文本回弹出厂态；听证台说明与无字席回弹。

## 热点坐标（1536×1024 舞台百分比，桌面/移动共用，44px 增长后互不重叠）

- 听证封签：身份 4/4/14/12（左上）、对照 8/4/14/12（左上）、去向 6/80/14/12（右上）；
  均与本房既有四热点零重叠。
- 身份深查：replay-voice 44/4/26/34（左放音鼓与听筒）、force-name 16/37/27/56（中央玻璃听证椅）。
- 证据深查：align-timestamps 40/33/34/46（中央三表齿轮仪）、lift-blood-wax 55/73/22/32（右玻璃罩血蜡）。
- 去向深查：trace-cable 38/3/25/36（左仪表与缆线，避开左拱门回总署 12/1/12/24）、
  listen-below 29/71/23/44（右听音喇叭）。
- 听证台：merge 27/2/31/42（左链条传送带）、mark 28/38/24/41（中央听证椅）、
  archive 25/67/31/44（右留声喇叭）、blank-seat 74/33/34/23（前景地面无字铭牌）。

## QA 契约（本轮静态门）

1. 四张源 PNG sha256 冻结；四张 WebP sha256 + ≤300KB + >100KB 冻结；
   听证台图入 HTML、三深查图入 JS 互换表。
2. 状态：唯一 key、canonical 六键投影、history ≤16、三种 history 形状白名单、
   派生字段永不落盘、deferredTarget 严格重算（末条 close + 重算同目标 + 未交付 +
   深查 ≥2 + v58 pending null）。
3. pending 三种各按自身精确键集（action 7 / intercept 6 / resolve 7）、逐字重算、末项证据、blank-seat 伪造拒收。
4. 深查：六动作 btn/分值/反馈逐字；封签结清前/深查后惰性且不写状态；
   首次计分自动回总署、复访重播既往结果不二次计分不转场；图面/热点/封签同步回弹。
5. 拦截：钩子在 close history 之后、v58 pending 之前；原 target/feedback/history 照旧；
   v58 路由只算一次；深查 <2 间时 v58 行为不变；已交付后不再拦截。
6. 听证台：路由纯函数全分支逐字；点击前分值路由后入账 +2；无字席条件冻结；
   resolve 只一次；最终到达清 pending/deferredTarget 并补旧守卫凭证。
7. 守卫/接线：desk 窄守卫与合法回退；四场景 sceneInit 接线；遗忘全部 DOM 回弹；
   目录 `01ωδ / 交叉听证`、记忆单行逐字、八卡不变。
8. isTrusted：v59 三组监听逐字，全仓库 10 组。

## 本轮静态门验收记录（2026-08-01）

- `node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`、`git diff --check` 全部通过。
- 静态计数（同口径实测，代理计数器逐次统计）：总计 4112 断言全绿，较 v58 的 3922 新增 190 条——其中 v59 独立区块 181 条，另 9 条为全局集成/回归断言（SCENES 循环、isTrusted 总数、文档同步等共享口径）。
- 浏览器 QA（`/tmp/v59-qa/v59-smoke.mjs`，真实 headless Chrome + 真实鼠标/键盘 + console 捕获，种子预注入）**625/625 连续两轮全绿**，控制台零异常；第二轮完整日志 `/tmp/v59-qa/round2-full.log`。覆盖：三深查房 + 听证台三视口几何/截图、封签结清前惰性、可信封签换图揭示、6 深查动作逐字/分值/自动回总署/复访不二次计分、0/1 深查结案照旧、2 深查严格拦截 + 听证台交付全链、无字席拉平组合显露/点击、三种 pending reload 重播一次、live reload 竞态、伪造 pending/deferredTarget/错版本/坏 JSON 拒收归一、遗忘全部 DOM 回弹、v57/v54/v37 字节不变、desk 直达守卫、键盘流。
- **CDP 抓出并已修复一处真实生产缺陷**：resolve pending 的严格校验要求 deferredTarget 成立，而 deferredTarget 原重算条件含 `!resolved`——resolve 条目一旦入账（恰是 resolve pending 的结算证据）即视为已交付，导致设计契约承诺的「resolve pending reload 重播一次」路径实际不可达。修复：交付在途（resolve 候选 pending 未消费）不算已交付，严格七键校验不过时由 `resolved && !pending` 统一收回；交付仍只发生一次。状态契约与本节表述已同步。
- 视觉证据 15 张 `design-qa-evidence/v59-01~11` + `v59-compare-{identity,evidence,destination,desk}`（源图/实装并排目检结论见 design-qa.md 本轮段落）。
- 保护边界：`docs/KimiUsageLog.md`、全部 source-v53~v59 PNG 哈希不变；未执行任何 git 写操作；未安装依赖。
