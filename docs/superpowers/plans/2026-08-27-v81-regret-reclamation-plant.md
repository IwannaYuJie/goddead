# v81 后悔回收厂 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改写 v80 及更早状态的前提下，新增四幕可反复游玩的“后悔回收厂”，形成 36 批再生组合、3 项炉裁结局、3 处旧场景技师回流及可继续通往 v82 的叙事活口。

**Architecture:** 沿用 Goddead 单页 `index.html + styles.css + script.js` 的既有大文件结构，在 v80 模块之后追加一个边界清晰的 v81 模块。所有状态先经过严格规范化，再由七类 pending 在准确 target arrival 原子结算；一个窄桥函数只为六个表内旧目的地放行合法的到达前 pending 或到达后最后结果。

**Tech Stack:** 原生 HTML/CSS/JavaScript、localStorage、现有 AutoAdvance、Node.js `assert` 静态/沙箱测试、Chrome 单窗口真实交互验收。

**实施边界:** 生产前端、测试、缺陷修复和实现文档由 `gemini-3.7-flash-high` 编写；Codex 负责冻结设计、应用交付、诊断与独立浏览器验收。不得执行 Git 提交、推送或部署；不得触碰 v82+、v86 素材和 `docs/V86ExistenceRenunciationRegistryDesign.md`。

---

## 文件职责

- Modify: `index.html` — v81 资源预载、四个 scene、remembrance 入口/记忆/图鉴、三个旧场景技师容器、目录链接、缓存版本。
- Modify: `styles.css` — 四幕构图、13 块图上热点、3 个技师面板、39 格图鉴及移动端布局。
- Modify: `script.js` — v81 常量表、严格状态、解锁、pending、到达结算、窄桥、UI 同步、18 个可信点击监听、初始化与 forget-all。
- Modify: `tests/site.test.mjs` — DOM/素材/状态/路由/安全/初始化/忘记全部/文档的 v81 回归矩阵。
- Modify: `README.md`, `design-qa.md`, `docs/ImplementationPlan.md`, `docs/ProgressLog.md`, `docs/Tasks.md` — 仅记录 Gemini 已实际完成并经静态门禁证明的内容；浏览器证据由 Codex 验收后补写。
- Read only: `docs/V81RegretReclamationPlantDesign.md` — Codex 冻结规格；Gemini 不改命题、文案、映射、字段或素材哈希。
- Read only: `design-references/source-v81-*.png`, `assets/v81-*.webp` — 已冻结素材，不重编码。

### Task 1: 先建立 v81 结构与素材失败门槛

**Files:**
- Modify: `tests/site.test.mjs`
- Test: `index.html`, `styles.css`, `script.js`, `assets/v81-*.webp`, `docs/V81RegretReclamationPlantDesign.md`

- [ ] **Step 1: 在场景清单与版本断言中写入 v81 期望**

将四个 id 追加到 `SCENES`，并写出明确断言：

```js
const V81_SCENES = [
  'regret-reclamation-plant',
  'abandonment-residue-weighhouse',
  'second-life-smelting-line',
  'zero-waste-life-furnace',
];
assert.equal(SCENES.length, 157, 'v81 raises the scene total to 157');
for (const scene of V81_SCENES) {
  assert.ok(html.includes(`data-scene="${scene}"`), `v81 scene ${scene} exists`);
}
assert.match(html, /styles\.css\?v=81/);
assert.match(html, /script\.js\?v=81/);
```
- [ ] **Step 2: 写入素材尺寸、哈希与 DOM 数量断言**

使用冻结规格中的四组 SHA-256；断言四张 WebP 均为 `1536×1024`，HTML 恰有 material 3、residue 3、use 4、furnace 3 个热点，并存在 3 个 reclaimer return 按钮、39 格图鉴容器和四个目录链接。

- [ ] **Step 3: 运行测试并确认红灯来自 v81 尚未接入**

Run: `node tests/site.test.mjs`

Expected: FAIL，首个失败明确指向缺失 v81 场景、缓存版本或 v81 模块；不能是语法错误或 v80 回归。

### Task 2: 接入四幕 HTML 与响应式视觉层

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/site.test.mjs`

- [ ] **Step 1: 在 head 预载四张运行图并升级缓存版本**

```html
<link rel="preload" href="assets/v81-regret-reclamation-plant.webp" as="image">
<link rel="preload" href="assets/v81-abandonment-residue-weighhouse.webp" as="image">
<link rel="preload" href="assets/v81-second-life-smelting-line.webp" as="image">
<link rel="preload" href="assets/v81-zero-waste-life-furnace.webp" as="image">
```

`styles.css` 与 `script.js` 查询参数统一改为 `v=81`。

- [ ] **Step 2: 按冻结文案添加四个 scene**

每幕遵循现有 branch scene 结构：`section > header + figure + response`。figure 使用准确的 1536×1024 WebP；按钮 id 固定采用以下前缀，供脚本和测试一一对应：

```txt
regret-material-{material}
regret-residue-{residue}
regret-use-{use}
regret-furnace-{action}
```

- [ ] **Step 3: 在 remembrance、旧场景和目录加入 v81 容器**

准确加入：

```txt
#regret-reclamation-entry-btn
#regret-furnace-entry-btn
#regret-reclamation-memory
#regret-reclamation-codex
#regret-reclamation-codex-grid
#regret-reclaimer-descending-appeals-stair
#regret-reclaimer-borrowed-childhood
#regret-reclaimer-identity-correction
#regret-reclamation-plant-link
#abandonment-residue-weighhouse-link
#second-life-smelting-line-link
#zero-waste-life-furnace-link
```

每个技师容器都包含 response 和 return button，默认 hidden。

- [ ] **Step 4: 增加图上热点与移动端样式**

三幕三列热点、熔炼线四象限热点；所有按钮 `min-width/min-height >= 44px`。39 格图鉴桌面四列、`max-width:720px` 时单列；四张图使用 `width:min(92vw, 760px)`、`height:auto`，不能制造横向滚动。

- [ ] **Step 5: 运行结构测试**

Run: `node tests/site.test.mjs`

Expected: v81 DOM/素材/样式测试 PASS；状态模块测试仍因脚本未实现而 FAIL。

### Task 3: 写状态失败矩阵并实现严格十一键存储

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

- [ ] **Step 1: 建立 v81 沙箱提取器和失败用例**

以 v80 `makeV80Context` 为样板，提取从 `const REGRET_RECLAMATION_KEY` 到 v81 listener block 之前的模块。测试默认态、坏 JSON、错误 version、错误类型、未解锁存档、额外字段清除、数组去重排序和计数 clamp。

规范原始存储键必须精确为：

```js
[
  'version', 'visited', 'draft', 'batches', 'furnaceOutcomes',
  'batchRuns', 'furnaceRuns', 'materialTallies', 'lastOutcome',
  'activeReclaimer', 'pending'
]
```

- [ ] **Step 2: 添加常量表和默认态**

```js
const REGRET_RECLAMATION_KEY = 'goddead_v81_regret_reclamation';
const REGRET_RECLAMATION_VERSION = 81;
const REGRET_MATERIALS = ['road-never-taken', 'person-never-loved', 'self-never-became'];
const REGRET_RESIDUES = ['dust-from-the-unwalked-mile', 'warmth-from-the-unused-pillow', 'fingerprint-inside-an-unworn-face'];
const REGRET_USES = ['cast-a-new-childhood', 'forge-courage-for-the-next-self', 'build-a-strangers-spare-life', 'return-regret-without-processing'];
const REGRET_FURNACE_ACTIONS = ['declare-regret-renewable', 'manufacture-every-life-from-foreign-regret', 'classify-forgiveness-as-unrecyclable-waste'];
const defaultRegretReclamation = () => ({
  version: 81,
  visited: { plant: false, weighhouse: false, smelting: false, furnace: false },
  draft: { material: '', residue: '' },
  batches: [], furnaceOutcomes: [], batchRuns: 0, furnaceRuns: 0,
  materialTallies: { road: 0, love: 0, self: 0 },
  lastOutcome: '', activeReclaimer: null, pending: null,
});
```

表内中文按钮、fragment、feedback、target、outcome 必须逐字取自冻结设计，不从 localStorage 接受自由文本。

- [ ] **Step 3: 实现只读 v80 解锁与覆盖**

`regretReclamationPlantUnlocked()` 调用 `unfinishedThoughtAsylumUnlocked()`，再从规范 v80 admissions/hearingOutcomes 重算三 thought、三 trace、四 therapy 和三项听证结果。未解锁时 `getRegretReclamation()` 返回默认态且不把攻击者存档写回。

- [ ] **Step 4: 实现规范化、读写和 coverage**

批次 id 仅允许 `${material}:${residue}:${use}`；按三张固定表笛卡尔顺序去重。`furnaceOutcomes` 按 action 表顺序；整数全部 floor + clamp `0..9999`。`activeReclaimer` 和七类 pending 只接受 exact-key 对象，并从表内值重新计算 feedback/target/batch/outcome。

`regretReclamationCoverageComplete(st)` 必须从规范 batches 重算三类 material、三类 residue、四类 use 均覆盖且批次数至少 4；不得相信 tallies、runs 或 lastOutcome。

- [ ] **Step 5: 运行状态矩阵**

Run: `node tests/site.test.mjs`

Expected: 状态/解锁/覆盖测试 PASS；pending 到达测试仍未完成而 FAIL。

### Task 4: 写 pending 红灯并实现准确到达结算

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

- [ ] **Step 1: 为七类 pending 写 exact-key 与伪造矩阵**

逐类构造一个合法对象和至少三个非法对象：多字段、错 source/target、错 feedback 或不匹配的 draft。合法对象规范化保持精确，非法对象变为 null。

- [ ] **Step 2: 写 batch 到达前后与刷新幂等测试**

验证点击 use 后只写 pending，不增加 batches/runs/tallies；准确旧 target 到达后一次性写入 batch、`batchRuns +1`、对应 tally、lastOutcome、activeReclaimer，并清 draft/pending。第二次 arrival 不改变状态；source replay 只排一次且 AutoAdvance options 不含 `before`。

- [ ] **Step 3: 写 furnace 到达前后与重复裁定测试**

准确 target 到达才增加 `furnaceRuns`；outcome 首次收集、重复不重复图鉴但 run 继续增加。sibling target 不结算并清理非法 pending。

- [ ] **Step 4: 实现单一 arrival 结算入口**

```js
const resolveRegretReclamationPendingOnArrival = (sceneName) => {
  const st = getRegretReclamation();
  const p = st.pending;
  if (!p) return;
  if (p.target === sceneName) regretReclamationBeforeArrive(p);
  else if (p.source !== sceneName) {
    st.pending = null;
    saveRegretReclamation(st);
  }
};
```

`regretReclamationBeforeArrive` 只处理准确合法 pending；batch 和 furnace 的实际结果全部在这里写入。选择函数只创建 pending、反馈并排 AutoAdvance。

- [ ] **Step 5: 实现 source replay**

七类 pending 在 source 冷启动时恢复反馈并只排一次；在 target 冷启动时先结算再同步 UI；其他 scene 清理。不能在 bootstrap 里硬编码 `threshold` 结算或重播。

- [ ] **Step 6: 运行 pending 矩阵**

Run: `node tests/site.test.mjs`

Expected: 七类 pending、batch/furnace 原子结算、重复刷新幂等全部 PASS。

### Task 5: 写六目的地攻防测试并实现窄桥

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

- [ ] **Step 1: 写到达前、到达后和 sibling 攻防矩阵**

批次目标矩阵：

```js
const REGRET_RECLAIMER_TARGETS = {
  'dust-from-the-unwalked-mile': 'descending-appeals-stair',
  'warmth-from-the-unused-pillow': 'borrowed-childhood',
  'fingerprint-inside-an-unworn-face': 'identity-correction',
};
```

炉裁矩阵：

```js
const REGRET_FURNACE_TARGETS = {
  'regret-became-a-renewable-resource': 'remembrance',
  'every-life-was-made-from-someone-elses-regret': 'unending-gallery',
  'forgiveness-was-classified-as-unrecyclable-waste': 'offering',
};
```

每条验证合法 pending 到达前仅开放准确 target；结算后 activeReclaimer 或“最后且已收集 outcome”仅开放准确 target；sibling、旧 outcome、伪造 outcome、仅改 lastOutcome、仅改 URL 全 false。

- [ ] **Step 2: 实现单一窄桥**

```js
const regretReclamationBridgeAllows = (scene) => {
  if (!regretReclamationPlantUnlocked()) return false;
  const st = getRegretReclamation();
  const p = st.pending;
  if (p?.kind === 'batch' && p.target === scene) return true;
  if (p?.kind === 'furnace' && p.target === scene) return true;
  const r = st.activeReclaimer;
  if (r && st.batches.includes(r.batch) && REGRET_RESIDUE_TABLE[r.residue]?.target === scene) return true;
  const last = REGRET_FURNACE_OUTCOME_BY_ID[st.lastOutcome];
  return Boolean(last && st.furnaceOutcomes.includes(st.lastOutcome) && last.target === scene);
};
```

规范化必须保证 activeReclaimer 和 last outcome 都来自表内；桥本身不能解析 URL 或放宽非表内 scene。

- [ ] **Step 3: 把桥接入六处既有守卫**

在既有准入条件旁追加 `!regretReclamationBridgeAllows(target)`，覆盖：治理 `remembrance`、v63 `unending-gallery`、主线 `offering`、v52 `descending-appeals-stair`、v58 `identity-correction`、v67 `borrowed-childhood`。只追加 v81 条件，不改变既有条件顺序和旧行为。

- [ ] **Step 4: 增加两次 hashchange 回归**

模拟第一次 route 由 pending 放行，`sceneInit` 清 pending，第二次 route 仍由 activeReclaimer 或最新已收集 furnace outcome 放行。确认炉裁的另外两个旧 target 与批次 sibling 都继续被拒绝。

- [ ] **Step 5: 运行路由矩阵**

Run: `node tests/site.test.mjs`

Expected: 六个窄桥目标在准确前后态 PASS，全部 forged/sibling 案例 PASS，v1-v80 原守卫回归 PASS。

### Task 6: 完成 UI 同步、18 个可信监听与 forget-all

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

- [ ] **Step 1: 实现四幕、记忆、图鉴、技师和目录同步函数**

函数名固定，便于整页初始化测试：

```txt
syncRegretReclamationPlant
syncRegretResidueWeighhouse
syncRegretSmeltingLine
syncRegretLifeFurnace
syncRegretReclaimers
paintRegretReclamationMemory
paintRegretReclamationCodex
syncRegretReclamationRemembrance
syncRegretReclamationLinks
replayRegretReclamationPending
```

记忆行逐项从 batches 重算残留与用途票数；“原料多数”并列时显示表内固定并列文案，不能依赖对象遍历偶然顺序。39 格图鉴为 36 批 + 3 炉裁；已解锁内容只从固定表渲染。

- [ ] **Step 2: 接入 sceneInit 与 DOMContentLoaded**

`sceneInit(name)` 顺序为先 `resolveRegretReclamationPendingOnArrival(name)`，再四幕/技师/记忆/图鉴/入口/目录同步，最后 `replayRegretReclamationPending(name)`。bootstrap 只做不依赖场景的九组 sync/paint，再调用现有 `route()`。

- [ ] **Step 3: 添加恰好 18 个可信点击监听**

监听数量固定为 `1 entry + 1 furnace entry + 3 material + 3 residue + 4 use + 3 reclaimer return + 3 furnace = 18`。每个回调第一句必须是：

```js
if (!e.isTrusted) return;
```

选择函数再次校验当前 scene、对应 figure/button 可见可用、draft、pending、coverage；合成 click 不得写状态或启动 AutoAdvance。

- [ ] **Step 4: 扩展 forget-all**

删除 `goddead_v81_regret_reclamation`，清除四幕 AutoAdvance、draft/pending/activeReclaimer、所有 v81 response/aria-pressed，隐藏入口、记忆、图鉴、目录与三个技师；不能写入 v80 key。

- [ ] **Step 5: 运行整页初始化与交互安全测试**

Run: `node tests/site.test.mjs`

Expected: sceneInit 包含 11 个 v81 调用，bootstrap 在 route 前包含 9 个 v81 sync/paint，恰好 18 个 `!e.isTrusted`，forget-all 完整，整套测试 PASS。

### Task 7: 同步实现文档并执行静态门禁

**Files:**
- Modify: `README.md`
- Modify: `design-qa.md`
- Modify: `docs/ImplementationPlan.md`
- Modify: `docs/ProgressLog.md`
- Modify: `docs/Tasks.md`
- Test: all modified production files

- [ ] **Step 1: 记录实际实现范围**

文档写明 `153 → 157`、36+3 图鉴、唯一 key/十一键、七 pending、六目的地窄桥、18 个可信监听、四张 1536×1024 WebP，以及 v82《宽恕填埋场》活口。不得预写浏览器“通过”或捏造证据路径。

- [ ] **Step 2: 运行语法与差异门禁**

Run:

```bash
node --check script.js
node --check tests/site.test.mjs
git diff --check
node tests/site.test.mjs
```

Expected: 四条命令 exit 0；最终行精确为 `site.test.mjs: N assertions passed`，且 `N` 大于 v80 的 12213。

- [ ] **Step 3: 核对改动边界**

Run: `git status --short`

Expected: 只增加本计划允许的 v81 前端/测试/实现文档改动；既有 v79/v80 evidence 与所有 v86 文件保持原样，没有临时提示词、模型响应或 helper 文件遗留。

### Task 8: Codex 单窗口浏览器验收与证据归档

**Files:**
- Create: `design-qa-evidence/v81-browser-qa.json`
- Create: `design-qa-evidence/v81-regret-reclamation-plant-desktop.jpeg`
- Create: `design-qa-evidence/v81-zero-waste-life-furnace-desktop.jpeg`
- Create: `design-qa-evidence/v81-regret-reclamation-plant-mobile.jpeg`
- Create: `design-qa-evidence/v81-zero-waste-life-furnace-mobile.jpeg`
- Modify after proof: `design-qa.md`, `docs/ProgressLog.md`, `docs/Tasks.md`, `docs/ImplementationPlan.md`

- [ ] **Step 1: 使用现有 Chrome 窗口/标签页验桌面真实链**

从 remembrance 真实点击进入 plant → weighhouse → smelting → 准确旧场景 → 技师返回。至少完成三个 residue 的旧场景回程，确认反馈不互相覆盖、pending 清空、刷新不重结算。

- [ ] **Step 2: 验 coverage 与三项炉裁**

用规范本地种子补齐 36 批覆盖，只通过真实按钮触发三项炉裁。逐项确认 `remembrance / unending-gallery / offering` 两次 hashchange 后仍停留准确页面，兄弟目标和伪造状态被拒绝。

- [ ] **Step 3: 同一窗口切移动 viewport**

目标 viewport 约 `500×778`；确认 `documentWidth === innerWidth`，四幕无横向溢出，所有可点击热点包围盒两边均至少 44px，图鉴单列可读。

- [ ] **Step 4: 验冷启动、坏档与 console**

分别种入 source pending 和 target pending 后刷新，验证一次续播/一次结算；种入坏 JSON、错误 version、extra keys、forged outcome，确认回默认或被规范化；console 无 error。

- [ ] **Step 5: 保存证据并回填真实结果**

QA JSON 至少包含测试断言数、桌面/移动 viewport、documentWidth、热点矩形、四图 natural size、代表链 hash/state、三炉裁落点、cold source/target、坏档与 console 结果。只有证据落盘后，才把实现文档状态改为“Codex 本地独立验收通过”。
