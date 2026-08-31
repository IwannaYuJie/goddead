# v82 宽恕填埋场 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改写 v81 及更早状态的前提下，新增四幕可反复游玩的“宽恕填埋场”，形成 36 份宽恕处置单、3 项无害化井裁、3 处旧场景记录员回流，并留下通往 v83《伤害考古局》的叙事活口。

**Architecture:** 沿用 Goddead 单页 `index.html + styles.css + script.js` 大文件结构，把 v82 模块追加在 v81 之后。所有持久状态先投影为严格十一键，再由七类 pending 在准确 target arrival 原子结算；`forgivenessLandfillBridgeAllows(scene)` 只为六个表内旧目的地放行合法 pending、已收集记录员或最新规范井裁，不改变旧版本准入。

**Tech Stack:** 原生 HTML/CSS/JavaScript、localStorage、现有 AutoAdvance、Node.js `assert` 静态/沙箱/整页回归、Chrome 单窗口 Computer Use 验收。

**实施边界:** `gemini-3.7-flash-high` 是生产前端、测试、缺陷修复与实现文档的唯一作者；Codex 负责冻结设计、应用模型输出、诊断、静态门禁、Computer Use 浏览器验收与证据。不得使用子代理，不得 commit、push、deploy 或发布；不得修改 v83+ 设计、v84/v85/v86 素材与文档；不得覆盖 v79-v81 QA 证据。

---

## 文件职责

- Modify: `index.html` — v82 preload、四个 scene、Remembrance 双入口/记忆/39 格图鉴、三个旧场景记录员、四个目录链接、缓存版本。
- Modify: `styles.css` — 四幕 figure、13 个原生按钮热区、3 个记录员面板、39 格图鉴、移动端布局与 reduced-motion。
- Modify: `script.js` — v82 冻结表、严格状态、只读 v81 解锁、七 pending、到达结算、六目的地窄桥、UI 同步、18 个可信监听、初始化与 forget-all。
- Modify: `tests/site.test.mjs` — 素材冻结、DOM、状态、pending、路由、可信输入、初始化、遗忘、文档与 v1-v81 回归。
- Modify after implementation: `README.md`, `design-qa.md`, `docs/ImplementationPlan.md`, `docs/ProgressLog.md`, `docs/Tasks.md` — 只记录已由测试证明的实现；浏览器结果在 Codex 取证后再写。
- Read only: `docs/V82ForgivenessLandfillDesign.md` — 冻结命题、文案、映射、字段、哈希与 v83 活口。
- Read only: `design-references/source-v82-*.png`, `assets/v82-*.webp` — 已冻结素材，不重画、不重编码。

### Task 1: 先写 v82 结构、素材和可访问性红灯

**Files:**
- Modify: `tests/site.test.mjs`
- Test: `index.html`, `styles.css`, `script.js`, `assets/v82-*.webp`, `docs/V82ForgivenessLandfillDesign.md`

- [ ] **Step 1: 写场景总数与缓存版本失败断言**

```js
const V82_SCENES = [
  'forgiveness-landfill',
  'inert-harm-certificate-vault',
  'mercy-burial-trench',
  'harmlessness-final-well',
];
assert.equal(SCENES.length, 161, 'v82 raises the scene total to 161');
for (const scene of V82_SCENES) {
  assert.ok(html.includes(`data-scene="${scene}"`), `v82 scene ${scene} exists`);
}
assert.match(html, /styles\.css\?v=82/);
assert.match(html, /script\.js\?v=82/);
```

- [ ] **Step 2: 写四组素材冻结断言**

逐组断言源 PNG、运行 WebP 的 bytes、SHA-256 与 `1536×1024`：

```txt
source-v82-forgiveness-landfill.png           2766019 e28c1a3ffff9668597e55f415ee3c6e3148f3d2bccbd6212e41a9ca96d102d99
v82-forgiveness-landfill.webp                  230602 102ecfa75c03b9b7cb212b2a0db393846e0b448ed8a8fada7716faf1330dc3ad
source-v82-inert-harm-certificate-vault.png   2538530 eacc34edbac8cdde1a334e986732c8ac2d1ed216db6b3698aa42ea641638d3c8
v82-inert-harm-certificate-vault.webp          176130 165521f4e35fea7339d69aa41f93c905873197bbc0d23cd45c20f27bb3fe0f81
source-v82-mercy-burial-trench.png            3395821 6c038d1e5e9bc4e2609801ec28be7cbb84064f8120d45ccd5aaa4d007d9cd750
v82-mercy-burial-trench.webp                   408332 253c326a5f4052f82ecbe6b0aba9fda77ae9cd2df40c98fb7ffe4004d8c06533
source-v82-harmlessness-final-well.png        3420241 327309717c6de8a759b88bcd3ffc24d92467bb6709426ada11d959dc5466a145
v82-harmlessness-final-well.webp               410040 0195bebccfcd4ba41ae247db4bbe8c3dc0aeb691318af6088c812e693a87b24a
```

- [ ] **Step 3: 写 DOM 与无障碍失败断言**

四个交互 figure 不得带 `role="img"` 或 figure `aria-label`；嵌套 `<img>` 必须有冻结中文非空 alt；button 数量依次为 `3 / 3 / 4 / 3`，每个按钮保留非空 `aria-label`。另断言 3 个 recorder return、2 个 Remembrance 入口、39 格图鉴容器与 4 个目录链接存在。

- [ ] **Step 4: 确认红灯只指向 v82 尚未接入**

Run: `node tests/site.test.mjs`

Expected: FAIL，首个失败指向缺少 v82 scene/cache/DOM；v1-v81 既有断言继续通过，不允许语法错误。

### Task 2: 接入四幕 HTML 与响应式视觉层

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/site.test.mjs`

- [ ] **Step 1: 预载四张运行图并升级缓存**

```html
<link rel="preload" href="assets/v82-forgiveness-landfill.webp" as="image">
<link rel="preload" href="assets/v82-inert-harm-certificate-vault.webp" as="image">
<link rel="preload" href="assets/v82-mercy-burial-trench.webp" as="image">
<link rel="preload" href="assets/v82-harmlessness-final-well.webp" as="image">
```

把 `styles.css` 和 `script.js` 查询参数统一改为 `v=82`。

- [ ] **Step 2: 按冻结文案添加四个 scene**

每幕结构固定为 `section > header + figure + response`。DOM id 前缀冻结为：

```txt
forgiveness-waste-{waste}
forgiveness-certificate-{certificate}
forgiveness-disposal-{disposal}
forgiveness-well-{action}
```

figure 保持原生语义；场景说明放在嵌套 image 的 `alt`，不能把交互 figure 重新设为 `role="img"`。

- [ ] **Step 3: 在 Remembrance、旧场景与目录加入容器**

```txt
#forgiveness-landfill-entry-btn
#harmlessness-final-well-entry-btn
#forgiveness-landfill-memory
#forgiveness-landfill-codex
#forgiveness-landfill-codex-grid
#forgiveness-recorder-offering
#forgiveness-recorder-liability-ledger
#forgiveness-recorder-causeless-ward
#forgiveness-recorder-return-offering
#forgiveness-recorder-return-liability-ledger
#forgiveness-recorder-return-causeless-ward
#forgiveness-landfill-link
#inert-harm-certificate-vault-link
#mercy-burial-trench-link
#harmlessness-final-well-link
```

记录员容器都包含独立 response 与 return button，默认 hidden；不能复用或覆盖 v81 回收员容器。

- [ ] **Step 4: 添加热区、图鉴与移动样式**

第一、二、四幕为三个互不重叠的横向热区；第三幕为四象限。所有按钮视觉与命中区两边均至少 44px。39 格图鉴桌面四列、窄屏单列；figure `width:min(92vw,760px)`、`height:auto`，移动端 `documentWidth === innerWidth`。

- [ ] **Step 5: 验结构绿灯**

Run: `node tests/site.test.mjs`

Expected: v82 DOM/素材/样式/无障碍结构断言 PASS；状态模块断言仍 FAIL。

### Task 3: 写失败状态矩阵并实现严格十一键

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

- [ ] **Step 1: 建立 v82 沙箱与默认态红灯**

以完整模块边界提取 v82，不只复制单函数。测试默认态、坏 JSON、错误 version、数组/null、未解锁存档、额外字段清理、顺序去重、计数 clamp、坏 activeRecorder、坏 pending。

- [ ] **Step 2: 添加冻结常量与默认态**

```js
const FORGIVENESS_LANDFILL_KEY = 'goddead_v82_forgiveness_landfill';
const FORGIVENESS_LANDFILL_VERSION = 82;
const FORGIVENESS_WASTES = [
  'apology-never-accepted',
  'debt-already-forgiven',
  'wound-that-stopped-demanding',
];
const FORGIVENESS_CERTIFICATES = [
  'unopened-absolution-receipt',
  'zero-balance-debt-scale',
  'scar-closed-without-witness',
];
const FORGIVENESS_DISPOSALS = [
  'bury-it-beneath-a-future-life',
  'let-the-soil-forget-the-cause',
  'grow-innocence-from-old-harm',
  'exhume-it-for-permanent-record',
];
const FORGIVENESS_WELL_ACTIONS = [
  'seal-every-forgiven-harm-forever',
  'erase-the-need-for-forgiveness',
  'make-harm-survive-its-own-forgiveness',
];
const defaultForgivenessLandfill = () => ({
  version: 82,
  visited: { landfill: false, vault: false, trench: false, well: false },
  draft: { waste: '', certificate: '' },
  disposals: [],
  wellOutcomes: [],
  disposalRuns: 0,
  wellRuns: 0,
  wasteTallies: { apology: 0, debt: 0, wound: 0 },
  lastOutcome: '',
  activeRecorder: null,
  pending: null,
});
```

- [ ] **Step 3: 实现只读 v81 解锁**

`forgivenessLandfillUnlocked()` 必须先确认 `regretReclamationPlantUnlocked()`，再只读 `getRegretReclamation()` 的规范 `batches` 与 `furnaceOutcomes`。要求 batches 至少 4 且覆盖 3 material / 3 residue / 4 use；furnaceOutcomes 精确包含三项：

```js
[
  'regret-became-a-renewable-resource',
  'every-life-was-made-from-someone-elses-regret',
  'forgiveness-was-classified-as-unrecyclable-waste',
]
```

运行时 `_v82unlocked` 可以传给 normalizer，但不得写入 localStorage；v82 不写 v81 key。

- [ ] **Step 4: 实现规范化、存取和 coverage**

存储 JSON 恰好十一键：

```js
[
  'version','visited','draft','disposals','wellOutcomes',
  'disposalRuns','wellRuns','wasteTallies','lastOutcome',
  'activeRecorder','pending'
]
```

处置单 id 固定 `${waste}:${certificate}:${disposal}`，按 `WASTES × CERTIFICATES × DISPOSALS` 顺序去重；wellOutcomes 按 action 顺序；整数 floor + clamp `0..9999`。coverage 只从规范 disposals 实时重算三轴且至少四份，不相信 runs/tallies/lastOutcome。

- [ ] **Step 5: 运行状态矩阵**

Run: `node tests/site.test.mjs`

Expected: 解锁、十一键、坏档、排序、coverage、activeRecorder 规范化 PASS；pending 到达仍 FAIL。

### Task 4: 写七类 pending 红灯并实现原子到达

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

- [ ] **Step 1: 冻结 exact-key pending 形状**

```txt
entry           feedback,kind,target
waste           feedback,kind,source,target,waste
certificate     certificate,feedback,kind,source,target,waste
disposal        certificate,disposal,feedback,kind,record,source,target,waste
recorder-return feedback,from,kind,record,target
well-entry      feedback,kind,target
well            action,feedback,kind,outcome,source,target
```

每类至少测试：合法对象、多字段、少字段、错 source/target、错 feedback、与 draft/coverage 不匹配。非法对象一律变 null。

- [ ] **Step 2: 写 disposal 到达前后与刷新幂等红灯**

点击 disposal 后只写 pending，不改 disposals/runs/tallies。certificate 表对应 old target 到达时一次性：`disposalRuns +1`、tally +1、首次收集 record、更新 lastOutcome、建立 activeRecorder、清 draft/pending。target 二次初始化不得重复；source 冷启动只恢复反馈并只排一次。

- [ ] **Step 3: 写 well 到达前后与重复裁定红灯**

准确 target 到达时 `wellRuns +1`、首次收集 outcome、更新 lastOutcome、清 pending。重复裁定继续增加 wellRuns，不重复图鉴；sibling target 必须清非法 pending 且不结算。

- [ ] **Step 4: 实现统一 arrival 与 logical source**

```js
const getForgivenessPendingLogicalSource = (p) => {
  if (!p) return null;
  if (p.kind === 'entry' || p.kind === 'well-entry') return 'remembrance';
  if (p.kind === 'recorder-return') return p.from || null;
  return p.source || null;
};

const resolveForgivenessPendingOnArrival = (sceneName) => {
  const st = getForgivenessLandfill();
  const p = st.pending;
  if (!p) return;
  if (p.target === sceneName) forgivenessBeforeArrive(p);
  else if (getForgivenessPendingLogicalSource(p) !== sceneName) {
    st.pending = null;
    saveForgivenessLandfill(st);
  }
};
```

选择函数只创建 pending、反馈并安排 AutoAdvance；所有持久副作用都在准确 arrival 中执行。

- [ ] **Step 5: 运行 pending/幂等矩阵**

Run: `node tests/site.test.mjs`

Expected: 七类 exact-key、防伪、source/target cold replay、disposal/well 原子结算、刷新幂等全部 PASS。

### Task 5: 写六目的地攻防矩阵并实现窄桥

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

- [ ] **Step 1: 冻结记录员和井裁映射**

```js
const FORGIVENESS_RECORDER_TARGETS = {
  'unopened-absolution-receipt': 'offering',
  'zero-balance-debt-scale': 'liability-ledger',
  'scar-closed-without-witness': 'causeless-ward',
};
const FORGIVENESS_WELL_TARGETS = {
  'every-forgiven-harm-was-sealed-forever': 'remembrance',
  'the-need-for-forgiveness-was-erased': 'threshold',
  'harm-outlived-its-own-forgiveness': 'unending-gallery',
};
```

每条测试到达前 pending、到达后 activeRecorder/最新 outcome、二次 hashchange、sibling、旧 outcome、伪造 outcome、只改 lastOutcome、只改 URL。

- [ ] **Step 2: 实现单一窄桥**

```js
const forgivenessLandfillBridgeAllows = (scene) => {
  if (!forgivenessLandfillUnlocked()) return false;
  const st = getForgivenessLandfill();
  const p = st.pending;
  if (p?.kind === 'disposal' && p.target === scene) return true;
  if (p?.kind === 'well' && p.target === scene) return true;
  const r = st.activeRecorder;
  if (r && st.disposals.includes(r.disposal)
    && FORGIVENESS_CERTIFICATE_TABLE[r.certificate]?.target === scene) return true;
  const last = FORGIVENESS_WELL_OUTCOME_BY_ID[st.lastOutcome];
  return Boolean(last && st.wellOutcomes.includes(st.lastOutcome) && last.target === scene);
};
```

normalizer 必须先保证 activeRecorder 与 last outcome 来自冻结表；bridge 不解析 URL，不接受自由文本。

- [ ] **Step 3: 组合现有守卫，不替换旧 bridge**

在 `offering` 主线守卫、`LEDGER_SCENES` 的 `liability-ledger`、`causeless-ward`、Governance 的 `remembrance` 两处分支、v63 `unending-gallery` 守卫旁追加 `forgivenessLandfillBridgeAllows(...)`。`threshold` 本身是公开主线门槛，不新增全局封锁；仍测试 bridge 只对最新规范井裁返回 true。`offering / remembrance / unending-gallery` 必须继续接受 v81 合法事务。

- [ ] **Step 4: 执行 route 攻防回归**

Run: `node tests/site.test.mjs`

Expected: 六目的地 bridge 真值矩阵全绿；三处受保护记录员落点与两个受保护井裁落点准确放行；threshold 保持既有公开行为；v1-v81 route 回归无变化。

### Task 6: 完成 UI、18 个可信监听、初始化与 forget-all

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

- [ ] **Step 1: 实现固定 UI 同步入口**

```txt
syncForgivenessLandfill
syncInertHarmCertificateVault
syncMercyBurialTrench
syncHarmlessnessFinalWell
syncForgivenessRecorders
paintForgivenessLandfillMemory
paintForgivenessLandfillCodex
syncForgivenessLandfillRemembrance
syncForgivenessLandfillLinks
replayForgivenessPending
```

记忆行、39 格图鉴与多数值全从规范 disposals 表重算；并列文案顺序固定。activeRecorder 只在 certificate 对应旧 scene 显示，返回后清空且不覆盖旧 scene 既有反馈。

- [ ] **Step 2: 接入 sceneInit、DOMContentLoaded 与 route guard**

`sceneInit(name)` 先 `resolveForgivenessPendingOnArrival(name)`，再同步四幕、记录员、记忆、图鉴、入口、目录，最后 replay。DOMContentLoaded 在既有 v81 初始化之后加入 v82，不提前触发 route，不引入递归 unlock 链。

- [ ] **Step 3: 添加恰好 18 个可信 click listener**

```txt
entry 1 + well entry 1 + waste 3 + certificate 3 + disposal 4 + recorder return 3 + well 3 = 18
```

每个 callback 第一条可执行语句必须是：

```js
if (!e.isTrusted) return;
```

每个 choose 再校验 currentScene、对应 figure/button 可见可用、draft、pending、coverage；合成 `HTMLElement.click()` 不得写状态或安排 AutoAdvance。

- [ ] **Step 4: 扩展 forget-all**

删除 `goddead_v82_forgiveness_landfill`，清四幕 AutoAdvance、draft/pending/activeRecorder、response、aria-pressed，隐藏 v82 入口、记忆、图鉴、目录与三名记录员；不写 v81 key，不清 v81 UI。

- [ ] **Step 5: 运行整页集成门槛**

Run: `node tests/site.test.mjs`

Expected: sceneInit/DOMContentLoaded 顺序、18 个 isTrusted、handler→DOM、四幕按钮、forget-all、合成 click 零副作用与 v1-v81 回归全部 PASS。

### Task 7: 同步 Gemini 实现文档并执行静态门禁

**Files:**
- Modify: `README.md`
- Modify: `design-qa.md`
- Modify: `docs/ImplementationPlan.md`
- Modify: `docs/ProgressLog.md`
- Modify: `docs/Tasks.md`
- Test: all modified production/test/document files

- [ ] **Step 1: 记录已实际完成的静态范围**

写明 `157 → 161`、36+3、唯一 key 与十一键、七 pending、六目的地窄桥、18 个可信监听、四张冻结 WebP、v83《伤害考古局》活口。浏览器证据尚未产生时只能写 `BROWSER QA PENDING`，不得预写通过或虚构截图。

- [ ] **Step 2: 执行四项静态门禁**

```bash
node --check script.js
node --check tests/site.test.mjs
git diff --check
node tests/site.test.mjs
```

Expected: 四条 exit 0；最后一行 `site.test.mjs: N assertions passed`，且 `N > 12967`。

- [ ] **Step 3: 检查模型改动边界**

Run: `git status --short`

Expected: 只有允许的 v82 前端、测试与实现文档变化；v82 冻结设计只保留 Codex 审定改动；v83+、v86、v79-v81 evidence 原样；没有 `.codex-v82-*`、模型响应、QA seed 或临时 helper 遗留。

### Task 8: Codex 单窗口 Computer Use 验收与证据归档

**Files:**
- Create: `design-qa-evidence/v82-browser-qa.json`
- Create: `design-qa-evidence/v82-forgiveness-landfill-desktop.png`
- Create: `design-qa-evidence/v82-forgiveness-landfill-mobile.png`
- Modify after evidence: `design-qa.md`, `docs/ProgressLog.md`, `docs/Tasks.md`, `docs/ImplementationPlan.md`, `README.md`, `docs/V82ForgivenessLandfillDesign.md`

- [ ] **Step 1: 在现有单 Chrome 标签页走三条真实记录员链**

从 Remembrance 进入 landfill → certificate vault → burial trench → `offering / liability-ledger / causeless-ward` → 对应记录员返回。逐条确认 pending 清空、activeRecorder 精确、旧反馈未覆盖、刷新不重复结算。

- [ ] **Step 2: 用第四批次补齐 coverage 并真点三项井裁**

第四批次必须补齐未覆盖的 disposal，使 3 waste / 3 certificate / 4 disposal 达成；确认 well 入口只在覆盖后出现。真实点击三动作并验证 `remembrance / threshold / unending-gallery`、wellOutcomes 3/3、二次 hashchange 不被旧守卫弹走。

- [ ] **Step 3: 同一窗口完成桌面与 390×844 移动视觉验收**

记录 `innerWidth/innerHeight/documentWidth`、13 个热点矩形、四图 complete/naturalWidth/naturalHeight、横向溢出。所有按钮两边至少 44px；图鉴移动端可读；不新增窗口或标签页。

- [ ] **Step 4: 验 cold replay、坏档、合成点击与 console**

覆盖 source pending、target pending、重复 target reload、坏 JSON、错误 version、extra keys、forged recorder/outcome、sibling target 与 synthetic click 零副作用。应用 console 必须无 error；浏览器/扩展噪声单独标注。

- [ ] **Step 5: 保存证据并由 Gemini 回填实现文档**

QA JSON 包含静态断言数、视口、documentWidth、热点、图像自然尺寸、4 批次状态、3 次记录员返回、3 项井裁、cold replay、坏档、AX tree 与 console。Codex 写证据；最终实现文档状态与无障碍修复文案仍交 `gemini-3.7-flash-high` 撰写，Codex 只应用并复验。
