# v60 证物链 / THE CHAIN OF CUSTODY

## 目标

把仍采用「图片在上、四张按钮卡在下」的两个旧结果房（v33 异常保全库 / 误报回收井，
含 v34 的估值入口第四按钮）升级为真正的画面内交互，并在累计证物动作后汇入一个
全新的「证物链办公室」。本轮不向末尾接线，而是把前段旧分支加深、交叉回流：

- 8 个旧按钮 id 原样保留、移入各自图片，底部 `.branch-choices` 卡片容器整体删除
  （无隐藏副本）；未触发 v60 截留时，旧动作副作用、旧反馈、旧目的地逐字保持。
- 累计证物动作达到解锁条件时，本轮第一个使条件成立的合法点击在完成旧副作用后
  把原定目的地截留为 `chain-of-custody-office`。
- 办公室三个常规机关按点击后分值纯函数分流；一个稀有机关只在三项完全拉平时显露。

## 研究依据（2026-08-02 访问，只看机制，未复制任何资产或文本）

- The Operator（https://store.steampowered.com/app/1771980/The_Operator/）：
  借鉴「证据工具逐层深入、文件与线索逐步展开」的调查节奏——v60 的深查不是
  新场景堆叠，而是同一房间内证物动作的累计改变后续走向。
- The Case of the Golden Idol（https://store.steampowered.com/app/1677770/The_Case_of_the_Golden_Idol/）：
  借鉴「自由观察场景、把线索组合成判断」——证物链办公室把分散在两房的动作
  组合成一次裁判，分流由累计分值纯函数决定。

美术与文案全部原创；两张结果房位图与办公室位图为本轮新绘制的冻结源图。

## 素材（冻结）

| 源文件 | sha256 |
| --- | --- |
| `design-references/source-v60-evidence-custody-vault.png` | `a08de54d0d73f39a911e41debac97aee0a916a1ff971bc232f238e0d5c154c41` |
| `design-references/source-v60-false-positive-custody-shaft.png` | `44b17233f34c85978e3df12a8185df3ed42ea150bd7d96f0c766edbe1fe75368` |
| `design-references/source-v60-chain-of-custody-office.png` | `1cad3a7733756daf4b018d2d6e8a7f96926ef136bed0e1f53c1fecc36ef8e7d1` |

WebP（1536×1024 无裁切 Pillow q85 转码，均在 300KB 预算内，sha256 冻结于 tests/site.test.mjs）：

| WebP | 字节 | sha256 |
| --- | --- | --- |
| `assets/v60-evidence-custody-vault.webp` | 269584 | `ab020b572944ce59631c5584406a023c8ff442a0c443070467f77ee57ba662f7` |
| `assets/v60-false-positive-custody-shaft.webp` | 272844 | `92bc68ed0efecdc11036aad3a74e2f96577ba6162e75bc1de4d226452dcddecf` |
| `assets/v60-chain-of-custody-office.webp` | 266064 | `309f563ecc98c75b64dcef44b95d0736fe483a06492cbd718e1b8d8e44ef446b` |

旧 `assets/anomaly-evidence-vault.webp` / `assets/anomaly-false-positive-shaft.webp`
作为历史文件保留，不再被页面引用；旧源 PNG 不覆盖、不删除。

## 状态契约

独立 key（全仓库唯一）：`goddead_v60_chain_of_custody`

```json
{
  "visited": { "vault": false, "shaft": false, "office": false },
  "scores": { "custody": 0, "revision": 0, "claim": 0 },
  "cycleActions": [],
  "lastSource": "",
  "lastAction": "",
  "officeRuns": 0,
  "transfers": 0,
  "pending": null
}
```

- 只持久化上述白名单 canonical 八键（`saveCustody` 显式投影，`cycleActions` 先裁 ≤8）。
  三项分数中文名：保全 custody / 改写 revision / 认领 claim。
- 归一：坏 JSON/数组/错型 → 默认；visited 三布尔严格 true；数值有限、非负、
  向下取整、封顶 9999；cycleActions 白名单去重裁 8；lastSource 限 vault/shaft，
  lastAction 限八动作白名单，非法即空串。
- 「轮」是 v60 自己的回合：cycleActions 记录本轮已登记的唯一源动作；真正离开
  办公室时清空开新轮，累计 scores/officeRuns/transfers 保留。
- pending 恰好四键（`{scene, action, target, feedback}`，额外键即伪造），
  target/feedback 逐字重算，只消费一次；重播期间该场景全部热点重新 disabled
  （视觉与 pending 锁一致），办公室 pending 另恢复被选机关的 aria-pressed：
  - 源 pending：scene 限两结果房、action 限该房动作、target 恒办公室、
    feedback 恒 `旧句 + 截留后缀` 逐字重算，且 action 仍登记在本轮、解锁条件仍成立；
  - 办公室 pending：scene 恒办公室、action 限四机关；点击后分值已含本动作 +2，
    校验时回减 2 得点击前分值，由 `custodyOfficeRoute` 逐字重算 target/feedback；
    void 另需当前分值拉平条件成立。
- v60 只读写自己的键；旧动作照常写 v33/v34 键；v60 不伪造、不改写任何
  v28–v59 结果（grantLedgerVisit 只补旧守卫凭证，与 v57/v59 同款）。

## 八源动作计分映射（逐字冻结于 tests/site.test.mjs）

| 动作 | 分值 |
| --- | --- |
| vault.sealedClearestAnomaly | custody +2 |
| vault.returnedBaselineToVestibule | claim +2 |
| vault.leftThroughBrokenSeal | revision +2 |
| vault.sentEvidenceToValuation | custody +1, claim +1 |
| shaft.retrievedRejectedCase | custody +1, claim +1 |
| shaft.appendedFalseReport | revision +2 |
| shaft.admittedExtraItem | claim +2 |
| shaft.declaredRejectAsAsset | revision +1, claim +1 |

每轮同一源动作只计一次；重复动作继续走旧目的地、不能刷分、不计入本轮解锁。

## 截留规则（窄钩子）

`chooseReviewResult` / `chooseValuationEntry` 内、旧副作用（v33 marks/restart、
v34 startValuation/marks）完成之后、AutoAdvance 武装之前调用 `custodySourceBeat`：

- 解锁条件：本轮 cycleActions ≥3 个不同动作，且 vault/shaft 两边各至少一个。
- 本轮第一个使条件成立的合法点击（`!wasUnlocked && custodyUnlocked(after)`）：
  原反馈后逐字追加 `证物链扣住了原去向。办公室的门在这时打开。`，目的地改道
  `chain-of-custody-office`，持久化源 pending，一拍后自动转场；到达时原子记
  office visit 再清 pending。
- 未满足、重复动作或已处于 pending 时：旧目的地逐字保持（计分照常只记首次）。
- 截留每轮最多一次：条件只会「新成立」一次，之后的合法动作照旧走旧目的地。

## 证物链办公室 `chain-of-custody-office`

开放场景（同 protocol-drift 设计）：直 hash 可用三个常规机关；目录链接
`01ωε / 证物链` 在首次到访前 hidden 不可聚焦，首次到访后原子恢复；0/0/0 时
稀有机关必须隐藏。

图内四机关：`#chain-action-reseal` 压回保全封钳（custody +2）、
`#chain-action-amend` 转动改写滚筒（revision +2）、`#chain-action-claim`
扣上认领钥环（claim +2）、`#chain-action-void` 抽走空白见证位（出厂 hidden；
仅点击前 custody===revision===claim 且 >0 时可见/可聚焦；不加分，直达无号层）。

常规动作按点击后分值纯函数分流（先入账 +2 再路由，反馈含三项计数与理由）：

| 条件（点击后分值） | 目标 |
| --- | --- |
| custody 严格最高 | retention-vault |
| revision 严格最高 | protocol-drift |
| claim 严格最高 | returned-address-cabinet |
| custody===revision 且高于 claim | false-confirmation-desk |
| custody===claim 且高于 revision | witness-carbon-archive |
| revision===claim 且高于 custody | blank-name-cloakroom |
| 三项全等（含常规动作补齐的拉平） | liability-ledger |

- 第一项合法点击立即锁住全部机关（disabled），持久化办公室 pending，一拍自动
  转场；reload 逐字重播并重挂一次，不二次计分。
- 真正离开办公室时（到达目标 before）：清 pending、officeRuns +1、transfers +1、
  清空 cycleActions/lastSource/lastAction 开新轮，累计 scores 保留；目标为
  liability-ledger 时补 `grantLedgerVisit` 旧守卫凭证。
- 稀有路径已核算：新一轮依次 sealedClearestAnomaly（保全 2）→
  appendedFalseReport（改写 2）→ admittedExtraItem（认领 2），第三拍跨两房
  截留进办公室，分值 2/2/2，空白见证位显露；点击直达 unnumbered-floor。

## 兼容与守卫

- 两旧场景 8 个 id、aria-pressed、v33 marks/restart、v34 startValuation/marks
  全部保留；只在截留那一拍改变最终 target。
- 源场景与办公室动作均先校验 currentScene、合法 action、无 pending、无同 scope
  AutoAdvance，再有副作用；第一拍接受后该场景全部热点同步 disabled，
  双击/键盘竞争只接受一次。
- 办公室不设 resolveScene 守卫（开放场景）；目标场景沿用各自旧守卫，
  liability-ledger 经 `grantLedgerVisit` 补凭证，其余目标（retention-vault /
  protocol-drift / returned-address-cabinet / false-confirmation-desk /
  witness-carbon-archive / blank-name-cloakroom / unnumbered-floor）本就开放。
- reduced-motion 沿用项目约 300ms 节拍，普通节拍沿用 branchDelay。
- 遗忘全部：v60 key 随全量清除移除；目录链接与记忆行隐藏；12 个热点
  disabled/aria-pressed 回弹、空白见证位回隐、响应清空。
- Remembrance 新增单行：
  `证物链：交接 T 次，办公室结算 R 次；保全 C，改写 V，认领 K，本轮已登记 N/8。`
  仍八张统计卡。

## 热点坐标（1536×1024 舞台百分比，桌面/移动共用，44px 增长后互不重叠）

- 保全库：封存匣 8/10/17/60（左悬吊骨瓷匣）、退件抽屉 42/41/18/20（中后方）、
  断封缺口 6/72/22/62（右锁链门缺口）、估值托盘 67/37/26/26（前景黄铜托盘）。
- 回收井：退件抽屉 44/2/21/44（左）、附录滚轴 36/24/19/37（中左）、
  脚位铁板 61/44/27/34（前景）、资产托盘 51/73/26/35（右）。
- 办公室：封钳 14/6/22/48（左）、滚筒 37/37/24/22（中央）、钥环 41/69/20/22（右）、
  空白见证槽 73/33/28/24（前景地面）。

（格式：top/left/width/height；三组内两两零重叠，移动端最小高度 20%×239px≈48px。）

## QA 契约（本轮静态门）

1. 三张源 PNG sha256 冻结；三张 WebP sha256 + ≤300KB + >100KB 冻结；
   保全库/回收井图入 HTML 替换引用，旧 WebP 保留但零引用；办公室图入 HTML。
2. 8 个旧 id 各出现一次且位于 figure 内；两旧场景 `.branch-choices` 容器删除；
   办公室四机关在 figure 内、void 出厂 hidden、签条四项、aria-live 响应区。
3. 状态：唯一 key、canonical 八键投影、cycleActions ≤8、pending 恰好四键、
   target/feedback 逐字重算、void 伪造拒收、派生不落盘、不引用 v28–v59 键。
4. 八源动作分值映射逐字；解锁条件与「首次成立才截留」逐字；重复动作不刷分。
5. 办公室分流真值表七分支 + void 逐字；点击后分值路由；拉平条件冻结。
6. 交互：currentScene 校验、AutoAdvance 首选锁、pending 锁、第一拍全 disabled、
   pending 重播重新锁定并恢复被选 aria-pressed、到达清 pending/开新轮/
   officeRuns+transfers 各 +1/补旧守卫凭证。
7. 接线：sceneInit 三场景、目录 `01ωε / 证物链`、记忆单行逐字、八卡不变、
   遗忘全部 DOM 回弹、办公室保持开放场景（resolveScene 不为它改写落点）。

## 本轮验收记录（2026-08-02）

- `node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs`（4269 断言全绿，较 v59 的 4112 新增 157 条同口径实测：v60 独立区块 154 条 + 全局集成 3 条）、`git diff --check` 全部通过。
- 浏览器 QA（`/tmp/v60-qa/v60-smoke.mjs`，真实 headless Chrome + 真实鼠标/键盘 + console 捕获，种子预注入）**526/526 连续两轮全绿**，控制台零异常；第二轮完整日志 `/tmp/v60-qa/round2-full.log`；失败路径回收 Chrome，复跑后零残留进程。覆盖：三场景三视口几何/截图、8 源动作旧行为逐字保持、单房不解锁、跨房截留全链、2/2/2 稀有路径、办公室七分支分流、双 pending reload 与竞态（重播期间全热点 disabled、办公室被选机关 aria-pressed 恢复、仍只消费/到达一次）、伪造/坏 JSON/9999 封顶、双击与键盘竞争、直 hash/目录/记忆/遗忘、v33/v34 字节级边界。
- **CDP 抓出并已修复两处真实生产缺陷**：① 办公室分流 `post[bank] += 2` 未封顶，分值 9999 时反馈算出 10001 与落盘分值不一致，修复为 `Math.min(CUSTODY_NUM_CAP, … + 2)`；② 独立验收发现 pending 重播只恢复反馈与定时器——sceneInit 的 enter* 先解锁按钮清 aria，`replayCustodyPending` 不重新锁定，导致合法 pending 在场时按钮视觉可用但点击被拦；修复为源/办公室重播均重新 `custodyLockButtons`，办公室另恢复被选机关 `aria-pressed="true"`。两处静态冻结断言同步更新。
- 视觉证据 12 张 `design-qa-evidence/v60/`（9 张实装截图 + 3 张源图/实装并排对照，目检结论见 design-qa.md 本轮段落）。
- 保护边界：`docs/KimiUsageLog.md`、全部历史 source PNG 哈希不变；未执行任何 git 写操作；未安装依赖。
