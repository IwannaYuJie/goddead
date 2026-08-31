# v87 不存在债务催收局 / COLLECTION AGENCY FOR NONEXISTENCE DEBT 实施计划（已完成）

## 1. 架构目标与路由扩展
- 新增 4 个叙事场景，场景总数由 177 扩充至 181，脚本缓存升级至 `v=87`：
  1. `nonexistence-debt-collection-agency`（不存在债务催收局本部）
  2. `absence-arrears-ledger-vault`（缺席欠款账簿库）
  3. `ontological-repossession-chamber`（本体清收执行室）
  4. `unpayable-existence-bankruptcy-court`（不可偿付存在破产法庭）
- 数据存储与隔离：
  - 本模块键：`goddead_v87_nonexistence_debt_collection`
  - 核心字段：`version`, `visited`, `draft`, `collections`, `bankruptcyOutcomes`, `collectionRuns`, `bankruptcyRuns`, `debtorTallies`, `lastOutcome`, `activeCollector`, `pending`
  - 挂起状态 `pending` 取值：`entry`, `debtor`, `instrument`, `collection`, `collector-return`, `bankruptcy-entry`, `bankruptcy-action`
  - 上游只读依赖：`goddead_v86_existence_renunciation`

## 2. 交互状态机与事件体系
- 构建 18 组严格校验 `isTrusted` 的事件监听器，拒绝合成事件。
- 业务空间包含 36 种催收记录组合与 3 种破产裁决结果（共计 39 个状态定义单元）。
- 门禁逻辑修复：修复 debtor、instrument、remedy、collector-return、bankruptcy-action 共 5 组按钮由于已结算/挂起状态反转造成的禁用缺陷，补齐回归断言。

## 3. 验收门禁
- `node --check script.js`
- `node --check tests/site.test.mjs`
- `git diff --check`
- `node tests/site.test.mjs`（`site.test.mjs: 14846 assertions passed`）
- 本地浏览器 QA 验证通过并归档 5 项证据资产。

## 2026-08-29 - v84 无罪证人保护院（Witness Protection for the Innocent）实装与独立验收方案

### 1. 目标与设计规范落实

- **新增场景（165 -> 169）**：`innocent-witness-protection`（无罪证人保护院）、`identity-causality-laundry`（身份因果洗衣房）、`memory-relocation-safehouse`（记忆迁移安全屋）、`anonymous-truth-lifetime-court`（匿名真相终身安置庭）。
- **视觉与静态资源**：引入 4 组 1536x1024 冻结源 PNG 及运行时 WebP 资产，严格对齐 SHA-256 哈希校验。
- **状态与交互模型**：
  - 存储键：`goddead_v84_innocent_witness_protection`，包含 `version`, `visited`, `draft`, `placements`, `courtOutcomes`, `placementRuns`, `courtRuns`, `witnessTallies`, `lastOutcome`, `activeHandler`, `pending` 共 11 个标准持久化字段。
  - 业务流转：3 证人 × 3 程序 × 4 条保护条款（36 组合矩阵）、3 位身份掩护员关联跳转（`blank-name-cloakroom` / `borrowed-shadow-gallery` / `unreturned-witness-gallery`）、终身安置庭 3 项裁决归宿。
  - 路由与隔离：依赖 `goddead_v83_harm_archaeology` 完成全部 3 种听证结果解锁；未达成门槛时访问守卫安全重定向；全局重置与局部状态不越权写入上游。

### 2. 验证与交付标准

- 自动化门槛：`node --check` 语法检查通过，`tests/site.test.mjs` 全量 14,473 项断言全部通过。
- 浏览器实机验收：使用 Computer Use 在单一 Chrome 窗口单一标签页内验证门禁阻断、真实受信任点击交互、4 组维度覆盖安置、3 类掩护员与 3 项裁决流转、幂等刷新与容灾恢复、双端无横向溢出及触控热区达标。
- 交付边界：仅在本地完成实装与文档同步，不执行 git commit、git push、部署上线或公开发布（no commit / no push / no deploy / no public release）。

---

## v80 未遂思想收容所 (Asylum for Unfinished Thoughts) 实施计划与验收报告

- **负责角色**: Gemini 3.7 Flash High (生产前端/测试/文档/缺陷修复) / Codex (设计/生图/应用输出/独立静态与真实浏览器 QA/证据)
- **实装与验收范围**:
  - **4 幕全新场景**: `#unfinished-thought-asylum` (未遂思想收容所), `#interruption-trace-archive` (中断物证溯源档案室), `#counterfactual-treatment-lab` (反事实疗法四分法研习室), `#last-conclusion-hearing` (最后结论听证庭)。
  - **36 条完整收容链条 (3×3×4)**: 3 种未遂思想类型 × 3 种中断痕迹 × 4 类反事实疗法。
  - **3 大听证裁决与动态覆盖**: 达成门槛后授权进入听证庭，3 条结论分别授权进入并动态覆盖对应旧场景（如 `#unending-gallery` 与 `#counterfactual-spindle`）。
  - **规范持久状态 (十一键)**: `version`, `visited`, `draft`, `admissions`, `hearingOutcomes`, `admissionRuns`, `hearingRuns`, `thoughtTallies`, `lastOutcome`, `activePhysician`, `pending`。运行时 `_v79unlocked` 与持久十一键完全分离。
  - **核心缺陷收敛**:
    1. 窄桥放行：`unlived-nursery` 纳入合法前置窄桥，修复死锁。
    2. Pending 闭环：7 类 pending 由真实 route/sceneInit 的 source/target 抵达重播与结算，移除 threshold 启动清理与 before-arrival 残留。
    3. Trace 选择器加固：trace 只从空值选择，normalizer / handler / UI 三层严格收紧。
    4. 遗忘与清理：`forget-all` 真实重置持久状态、AutoAdvance 及 UI 展现。
    5. 听证两阶段授权：基于“最新且已收集的规范 outcome”派生授权精确 target，拒绝 sibling 与伪造跳转。
- **门禁验证**:
  - 静态门禁：`node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check` 全部通过。
  - 自动化测试：`node tests/site.test.mjs` 汇报 `site.test.mjs: 12213 assertions passed`。
  - 真实浏览器 QA：单 Chrome 窗口/标签页内验证 v80 锁定返回 remembrance、admission 真实点击链路、cold pending 结算与续播、4 张 1536×1024 素材 natural 渲染、移动端 500×778 无横向溢出及 asylum 3 热点几何、2 条真实听证点击与跳转覆盖闭环。
- **证据留存**:
  - `design-qa-evidence/v80-browser-qa.json`
  - `design-qa-evidence/v80-unfinished-thought-asylum-desktop.jpeg`
  - `design-qa-evidence/v80-last-conclusion-hearing-desktop.jpeg`
  - `design-qa-evidence/v80-unfinished-thought-asylum-mobile.jpeg`
  - `design-qa-evidence/v80-last-conclusion-hearing-mobile.jpeg`
- **发布状态**: 本轮只做本地验收，未 commit、push 或 deploy。

# Implementation Plan — Goddead

## v82 — 宽恕填埋场 / FORGIVENESS LANDFILL
- [x] **场景与视觉资产扩展**：新增 4 处场景（157 -> 161，`forgiveness-landfill`、`inert-harm-certificate-vault`、`mercy-burial-trench`、`harmlessness-final-well`），配套 4 张源 PNG 与 4 张运行时 WebP（1536x1024），静态查询参数设为 `v=82`。
- [x] **矩阵与结局建模**：构建 3 废料 × 3 凭证 × 4 处置 = 36 种填埋记录，配置 3 种井裁结局与 39 格图鉴单元。
- [x] **存储与状态机规范**：使用独立持久化键 `goddead_v82_forgiveness_landfill`，定义 11 个规范字段、7 种挂起类型与 3 族回写；解锁单向读取 v81，全局遗忘不写入 v81；绑定 18 处 `isTrusted` 点击监听。
- [x] **自动化测试与静态门槛**：完成代码语法与差异检查，自动化测试达到 `site.test.mjs: 13642 assertions passed`。
- [x] **真实浏览器 QA 与缺陷加固**：通过单窗口单标签页 DevTools 联动 Computer Use 验收；修复图鉴容器、入口外壳及记录器反馈按钮 3 处尺寸显示缺陷；验证桌面/移动端视口与无异常运行；归档 5 项证据文件。

## v81 — 后悔回收厂 / REGRET RECLAMATION PLANT

- **Scope & Progression**: Scene count grows from 153 to 157 across 4 new scenes: `regret-reclamation-plant`, `abandonment-residue-weighhouse`, `second-life-smelting-line`, and `zero-waste-life-furnace`. Combinator mechanics deliver 3 materials × 3 residues × 4 uses = 36 batches, plus 3 furnace outcomes, expanding the codex by 39 entries.
- **Target Integrations**: Reclaimer targets cross-link to `descending-appeals-stair`, `borrowed-childhood`, and `identity-correction`; zero-waste furnace targets route into `remembrance`, `unending-gallery`, and `offering`.
- **State & Persistence**: Single local storage key `goddead_v81_regret_reclamation` containing exact eleven fields (`version`, `visited`, `draft`, `batches`, `furnaceOutcomes`, `batchRuns`, `furnaceRuns`, `materialTallies`, `lastOutcome`, `activeReclaimer`, `pending`) with seven strict pending states.
- **Input & Security**: Exactly 18 `isTrusted` event listeners enforce strict interaction security, zero synthetic side effects, and guarded transitions.
- **Asset Pipeline**: 4 source PNGs and 4 runtime WebP images (1536×1024) frozen with exact hashes and dimensions.
- **Division of Labor**: Gemini authored frontend implementation, test suites, documentation, and fixes; Codex owns design, artwork generation, patch application, diagnostics, and QA.
- **v82 Hook**: Prepared narrative and programmatic bridge to `宽恕填埋场 / FORGIVENESS LANDFILL`.

### Verification Status

- [x] Update frontend implementation (`index.html`, `styles.css`, `script.js`) for v81 scenes, reclaimer, and zero-waste life furnace.
- [x] **自动化测试**：运行 `node tests/site.test.mjs`，输出 `site.test.mjs: 12967 assertions passed`，全部 12967 项断言通过，覆盖全站及后悔回收厂 36 批次与 3 种人生熔炉走向行为矩阵。
- [x] Update documentation and specifications (`docs/ImplementationPlan.md`).
- [x] Execute Node.js syntax and diff validation across all modified files.
- [x] Verify pending state forgery resistance, cold replay stability, and narrow bridge second-hash routing.
- [x] Validate bad state recovery, forget-all reset routines, and initialization order guarantees.
- [x] Verify strict `isTrusted` listener guards and synthetic event side-effect prevention.
- [x] **单标签页真实交互与流程**：在单 Chrome 窗口/标签页（DevTools 停靠）实测 4 个批次，原料（3 种）、残留（3 种）、用途（4 种）全覆盖，人生熔炉动作跳转至 `remembrance`、`unending-gallery`、`offering` 且 3 次回收员返回正常。
- [x] **视口与图像分辨率**：桌面端（915×784，宽度 915px）与移动端（390×844，宽度 390px）均无水平溢出，4 张 v81 WebP 资产自然分辨率为 1536×1024。
- [x] **无障碍修复与控制台**：移除 4 处交互 `<figure>` 的 `role="img"`，将描述收敛至嵌套 `<img>` 的 alt 属性，恢复 3-3-4-3 按钮于 AX 树的暴露与非空 aria-label；控制台无应用级错误与警告（仅 Built-in AI 环境 info 噪点）。
- [x] **本地凭证完备**：生成 `design-qa-evidence/v81-browser-qa.json`、`design-qa-evidence/v81-regret-reclamation-plant-desktop.png` 与 `design-qa-evidence/v81-regret-reclamation-plant-mobile.png`。
- [x] 本地验收与状态冻结：当前改动保持本地未提交（未执行 git commit/push/发布），归档凭证并准备衔接 v82。

## 历史版本：v79 未言人格继承院 / COURT OF UNSPOKEN PERSONHOOD

### 目标
在 v78 第一人称配给署完成三个终审结局且 rations 覆盖三主体/三凭证/四方案后，开放 v79。v79 新增 4 场景、36 份未言人格继承判令、3 个终审遗产结局、3 处旧场景沉默执行官回流、39 格新图鉴，场景总数 145 → 149。

### 已实现
- [x] 按冻结设计实现 5 个目标场景（4 新场景 + 1 痕迹室入口）
- [x] 3×3×4 = 36 组合继承判令与 3 个终审遗产结局
- [x] 3 个旧场景（confession / testament-clearing-vault / unseated-listening-booth）执行官回流
- [x] 覆盖率门槛（3 claimant / 3 evidence / 4 mode，至少 4 份判令）
- [x] 7 类 strict pending（entry / claimant / evidence / grant / executor-return / tribunal-entry / tribunal）
- [x] 单键坏存档回退（坏 JSON / 错 version / 数组 / null / 未解锁均返回默认态）
- [x] 生产交互全部使用 `e.isTrusted` 与 `AutoAdvance`
- [x] 恰好 18 个 v79 `addEventListener`，首句均为 `if (!e.isTrusted) return;`
- [x] handler 引用真实 DOM id，测试已补齐 handler→DOM 校验
- [x] 接入 v79 已冻结 WebP 素材（4 张 1536×1024，sha256/bytes 冻结）
- [x] README / design-qa / ProgressLog / V79 设计文档已同步
- [x] 延续 v70–v79 解锁链线性化模式

### 独立验收状态
- [x] Codex 独立执行静态门禁（node --check ×2、git diff --check、site.test.mjs）
- [x] Codex 独立浏览器验收：桌面 1280×720
- [x] 手机 390×844 浏览器验收
- [x] 真实三段点击（claimant → evidence → mode）与闭唇执行官返回继承院
- [x] 另外两处旧落点（testament-clearing-vault / unseated-listening-booth）专属反馈与 enabled 返回控件
- [x] 四份 coverage 解锁终审
- [x] 三终审静态全覆盖；中央终审真实浏览器点击
- [x] 重载幂等
- [x] 锁定 hash 与 malformed JSON 降级
- [x] 页面 console 无 error

**验收执行详述**：Gemini 3.7 Flash High 编写生产前端、测试和两项修复；Codex 负责设计素材、应用输出、诊断与独立 QA。四项静态门禁全绿，最终 `11535 assertions passed`。真实浏览器完成 4 条三段点击流，合计覆盖 3 claimant / 3 evidence / 4 mode；三个旧落点执行官与 enabled 返回通过，返回后 draft / activeExecutor / pending 清空；4/36 解锁终审，中央动作 `divide-personhood-among-all-listeners` 结算 `personhood-was-divided-among-the-unhearing`，持久化状态保持 4 grants / 1 tribunal outcome 并在重载后严格相等，UI 显示 5 格图鉴。`_v78unlocked` 只在运行时返回、v78 持久化保持十一键；旧 v29 守卫曾把合法 `confession` 改写到 `#corridor`；现以 `!unspokenPersonhoodBridgeAllows(target)` 窄放行，并保留 v29/v53/v79 路由回归。桌面 1280×720、移动 390×844、四图 1536×1024、热区 ≥44px / 图内 / 无重叠、横溢 ≤1px、锁定/malformed 与 console/page/resource 0 全通过。证据：`design-qa-evidence/v79-browser-qa.json`、`design-qa-evidence/v79-executor-confession-desktop.png`、`design-qa-evidence/v79-unspoken-personhood-court-desktop.png`、`design-qa-evidence/v79-tribunal-coverage-desktop.png`、`design-qa-evidence/v79-unspoken-personhood-court-mobile.png`。仅本地验收，未 commit、push 或 deploy。

### 版本边界
- v79 只读 v78（`getFirstPersonRationing`、`firstPersonRationingCoverageComplete`），不写 v78 及任何更早 key。
- v79 不实现 v80 及之后内容。
- Gemini 3.7 Flash High 实现生产前端代码；Codex 独立验收。

## 历史版本：v78 第一人称配给署 / FIRST-PERSON PRONOUN RATIONING BUREAU

### 目标
在 v77 自我真伪鉴定所完成三个终审结局且 certificates 覆盖三候选/三来源/四方法后，开放 v78。v78 新增 4 场景、36 份第一人称配给令、3 个无主发声结局、3 处旧场景发声员回流、39 格新图鉴，场景总数 141 → 145。

### 已实现
- [x] 按冻结设计实现 5 个目标场景（4 新场景 + 1 痕迹室入口）
- [x] 3×3×4 = 36 组合配给令与 3 个终审发声结局
- [x] 3 个旧场景（threshold / blank-name-cloakroom / remembrance）发声员回流
- [x] 覆盖率门槛（3 speaker / 3 entitlement / 4 scheme，至少 4 份配给令）
- [x] 7 类 strict pending（entry / speaker / entitlement / ration / allocator-return / court-entry / court）
- [x] 单键坏存档回退（坏 JSON / 错 version / 数组 / null / 未解锁均返回默认态）
- [x] 生产交互全部使用 `e.isTrusted` 与 `AutoAdvance`
- [x] 恰好 18 个 v78 `addEventListener`，首句均为 `if (!e.isTrusted) return;`
- [x] handler 引用真实 DOM id，测试已补齐 handler→DOM 校验
- [x] 接入 v78 已冻结 WebP 素材（4 张 1536×1024，sha256/bytes 冻结）
- [x] README / design-qa / ProgressLog / V78 设计文档已同步
- [x] 静态门禁 Codex 独立执行通过（node --check ×2、git diff --check、10954 assertions passed，含 v70–v78 解锁链线性化回归）

### 独立验收状态
- [x] Chrome 深链种子真实点击预检：v76 / v77 Remembrance 记忆、图鉴、普通入口按前置状态显露，真实按钮 enabled
- [x] Codex 独立浏览器验收：桌面 1280×720
- [ ] 手机 390×844 手动浏览器验收（视口覆写未生效；窄屏几何静态断言已通过）
- [x] 真实三段点击（speaker → entitlement → scheme）与首息发声员返回配给署
- [x] 另外两处旧落点（blank-name-cloakroom / remembrance）专属反馈与 enabled 返回控件
- [x] 四份 coverage 解锁终审
- [x] 三终审静态全覆盖；中央「废除第一人称配给」由真实浏览器点击验证，另两项不作手动声明
- [x] 重载幂等
- [x] 锁定 hash 与 malformed JSON 降级
- [x] 页面 console 无 error

### 版本边界
- v78 只读 v77（`selfAuthenticityOfficeUnlocked`、`getSelfAuthenticity`、`selfAuthenticityCoverageComplete`），不写 v77 及任何更早 key。
- v78 不实现 v79 及之后内容。
- Gemini 3.7 Flash High 实现生产前端代码；Codex 独立验收后按用户要求统一提交推送。

## 历史版本摘要

| 版本 | 场景数 | 关键交付 | 状态 |
|------|--------|----------|------|
| v76 | 137 | 现实退款处 / 36 退货单 / 3 退款结局 | 已实现，入口预检通过，完整浏览器矩阵待执行 |
| v77 | 141 | 自我真伪鉴定所 / 36 证书 / 3 终审 | 已实装，测试通过 |
| v78 | 145 | 第一人称配给署 / 36 配给令 / 3 终审 | 静态 10954 passed；桌面真实输入与中央终审通过，移动手动验收未声明 |
| v79 | 149 | 未言人格继承院 / 36 继承判令 / 3 终审 | Codex 独立静态门禁（11535 测试）与桌面/手机独立浏览器 QA 验收通过 |
| v80 | 153 | 未遂思想收容所 / 36 admissions / 3 hearing | Codex 独立静态门禁（12213 测试）与单窗桌面/手机浏览器 QA 验收通过 |
| v81 | 157 | 后悔回收厂 / 36 批次 / 3 熔炉产物 | Codex 独立静态门禁（12967 测试）与单窗桌面/手机浏览器 QA 验收通过 |
| v82 | 161 | 宽恕填埋场 / 36 处置 / 3 井裁 | Codex 独立静态门禁（13642 测试）与单窗桌面/手机浏览器 QA 验收通过 |
| v83 | 165 | 伤害考古局 / 36 报告 / 3 听证 | Codex 独立静态门禁（14319 测试）与单窗桌面/手机浏览器 QA 验收通过 |
| v84 | 169 | 无罪证人保护院 / 36 安置令 / 3 裁定 | 本地实装已完成，自动化测试与单窗桌面/手机 QA 通过 |
| v85 | 173 | 孤事实认领处 / 36 继承契 / 3 裁定 | 本地实装已完成，14593 断言与单窗桌面/手机 QA 通过 |
| v86 | 177 | 存在放弃登记局 / 36 本体注销令 / 3 裁定 | 本地实装已完成，14713 断言与单窗桌面/手机 QA 通过 |

## v88 未发生事件拍卖行 / AUCTION HOUSE FOR EVENTS THAT NEVER HAPPENED

- [x] 场景总数 181→185；新增 `auction-house-for-events-that-never-happened`、`catalogue-of-unoccupied-reality`、`counterfactual-bidding-floor`、`retroactive-occurrence-title-court`；缓存标记升至 `v=88`。
- [x] 接入 4 张源 PNG 与 4 张运行时 WebP，全部 1536×1024；冻结明细见 `docs/V88UnhappenedEventAuctionHouseDesign.md`。
- [x] 实现 3 bidders × 3 lots × 4 methods = 36 purchases 与 3 项 title outcomes；coverage 最少 4 份且覆盖 3/3 bidders、3/3 lots、4/4 methods。
- [x] 在 `forgiveness-landfill`、`undeclared-war-room`、`unlived-nursery` 接入三位 auctioneer 的窄桥与受信任返回。
- [x] 状态键 `goddead_v88_unhappened_event_auction` 严格保持 11 个顶层字段、7 类 pending 与 18 个 `isTrusted` 点击监听；v88 只读 v87，forget-all 不写旧键。
- [x] Remembrance 接入记忆行、39 格图鉴、普通入口与追溯发生产权庭入口。
- [x] `node --check script.js`、`node --check tests/site.test.mjs`、`git diff --check` 与 `node tests/site.test.mjs` 全绿；最终 `site.test.mjs: 14992 assertions passed`。
- [x] Computer Use 在一个 Chrome 窗口、一个标签页中完成 4 条真实成交、三 auctioneer 回桥、三产权终局、刷新幂等、malformed JSON 回退与干净控制台检查。
- [x] 桌面 915×774 与手机 390×844 均无横向溢出，热点大于 44×44；证据见 `design-qa-evidence/v88-browser-qa.json`。
- [x] QA 后恢复用户原 22 个 localStorage 项和 `#remembrance`，清除 QA 临时键并关闭 DevTools 与设备模拟。
- [x] 仅本地验收，未 commit、push、deploy 或 public release。

| 版本 | 场景数 | 自动化门禁 | 状态 |
| --- | ---: | --- | --- |
| v87 | 181 | 14846 assertions | 本地实现与独立 QA 已完成 |
| v88 | 185 | 14992 assertions | 本地实现与独立 QA 已完成 |
| v89 | 189 | 15657 assertions | 本地实现与独立 QA 已完成 |
| v90 | 193 | 16343 assertions | 生产实现与静态门禁完成；初始化、锁定深链和控制台复核通过 |

### 版本边界

- Gemini 3.7 Flash High 负责生产前端、测试、修复与实现文档；Codex 负责设计、资产与独立验收。
- v90 为当前实现基线；下一版本只保留 v91 `倒生原因助产院` 的叙事活口。

### v89 既成事实拆迁局实施记录 (2026-08-30)
- 场景与状态：
  - 新增场景 `accomplished-fact-eviction-authority`、`condemned-history-survey-office`、`retroactive-demolition-yard`、`final-occupancy-appeal-court`。
  - 持久化键 `goddead_v89_accomplished_fact_eviction` 严格锁定 11 个规范字段。
  - 内容矩阵交付 36 道腾退令组合、3 项上诉判决与 39 格典籍档案。
- 集成点交付：
  - `birth-ballot-booth`、`crime-scene-without-offender`、`undeclared-war-room` 注入拆迁勘测员/法警逻辑。
  - 目录、纪念碑、缓存版本（`?v=89`）完成同步升级。
  - 生产插图资源引入：`assets/v89-accomplished-fact-eviction-authority.webp`、`assets/v89-condemned-history-survey-office.webp`、`assets/v89-retroactive-demolition-yard.webp`、`assets/v89-final-occupancy-appeal-court.webp`。
- 测试与验收结果：
  - 测试套件全部通过：`node tests/site.test.mjs` 达成 15657 项断言。
  - 完成可见 Chrome 真实浏览器单窗口交互与移动端测试。

### v90 无因后果难民署实施记录 (2026-08-31)

- [x] 新增 4 个场景，场景总数 189→193，缓存标记升级至 `v=90`。
- [x] 接入 4 张 1536×1024 源 PNG 与 4 张运行时 WebP。
- [x] 实现 3 refugees × 3 sponsors × 4 protocols = 36 asylum cases、3 verdict outcomes 与 39 格图鉴。
- [x] 在 `threshold`、`remembrance`、`unending-gallery` 接入三位 v90 领事的窄桥与受信任返回。
- [x] 状态键 `goddead_v90_causeless_consequence_refugee` 保持 11 个规范字段、7 类 strict pending、18 个 `isTrusted` 点击监听；只读 v89。
- [x] 修复 `DOMContentLoaded` 尾部缺失的 v90 入口、记忆、图鉴、领事、pending 同步顺序，并增加静态回归断言。
- [x] 两项 `node --check`、`git diff --check` 与全量测试通过，最终 `site.test.mjs: 16343 assertions passed`。
- [x] 本地浏览器确认页面初始化、锁定深链回退 `#remembrance`、刷新稳定与 console 无 error/warn。
- [x] 补充 `docs/GameplayFlow.md`，覆盖基础主线、v29-v62 支线网、v63-v90 解锁链和 v90 详细闭环。
