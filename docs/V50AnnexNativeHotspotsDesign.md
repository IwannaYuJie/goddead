# v50 副楼实感 / THE ANNEX BECAME TOUCHABLE

## 目标

v50 不增加房间、不增加状态、不改路线，只把 v32 三间副楼里仍悬在图片下方的卡片按钮，变成贴合画面物件的原生热点：

- `#eyelid-archive`：4 个现有动作。
- `#unnumbered-vestibule`：5 个现有动作。
- `#reverse-stairwell`：4 个现有动作。
- 合计 13 个现有按钮，全部保留原 `id`、完整文本、监听、反馈、mark、首选锁与自动转场。

这一轮只解决“看见物件就能点”的体验。不得借机扩写世界、增加解锁、改写文案或重构业务逻辑。

## 交互原则

1. 三个旧 `.branch-choices` 卡片区从图片下方消失，原按钮移动到对应 `<figure>` 内。
2. 热点必须落在真实、可辨认的画面物件上，不能漂在空墙、阴影或无意义区域。
3. 桌面端显示完整动作标题；hover、focus 时可显示原 hint。
4. 390×844 时使用 1–2 行短视觉标签，完整 `.bb-title` 与可访问名称仍留在 DOM/无障碍树。
5. 移动端 focus 不展开长 hint，不得让文字溢出热点或互相覆盖。
6. 热点最小触控尺寸 44×44；键盘 Tab、Enter、Space 与 `aria-pressed` 恢复继续有效。
7. 点击后仍是“即时反馈 → 原 AutoAdvance 自动转场”，没有第二个继续按钮。
8. 同一房间的首次选择锁、连点保护及 rival action 竞争语义保持原样。

## 新源图与正式图

源图由监理生成，构图是对 v32 既有画面的非破坏性深化：

- `design-references/source-v50-annex-eyelid-tactile.png`
- `design-references/source-v50-annex-vestibule-tactile.png`
- `design-references/source-v50-annex-stairwell-tactile.png`

Kimi 转为 1536×1024 WebP：

- `assets/annex-eyelid-tactile.webp`
- `assets/annex-vestibule-tactile.webp`
- `assets/annex-stairwell-tactile.webp`

不得覆盖 v32 原源图与原 WebP；v50 使用新文件名切换引用，便于独立回退。

## 场景一：闭目档案室

画面保持黑漆归档柜、黄铜闭合眼睑抽屉与正面仪式构图，并让四个动作拥有不同物件：

| 原按钮 | 画面物件 | 移动短标签 |
|---|---|---|
| `#eyelid-choice-search` | 中央柜一只微开的抽屉，露出无号黑色视线档片 | 摸索 |
| `#eyelid-choice-listen` | 左侧桌面独立黄铜听音盒与短听筒 | 听盒 |
| `#eyelid-choice-file` | 前景地面被狭长归档缝切断的人形影子 | 归影 |
| `#eyelid-choice-review` | 右侧桌面封口黑色证物袋与红蜡复核签 | 复核 |

热点不可遮住中央柜整体；四个物件要在桌面与前景形成清晰分区。

## 场景二：无号前厅

保留环形九门、中央无把手黑门与空白骨瓷牌，并增加台账、复核槽和不存在的楼层按钮：

| 原按钮 | 画面物件 | 移动短标签 |
|---|---|---|
| `#vestibule-choice-tenth` | 中央黑门前悬着的独立空白骨瓷号牌 | 第十门 |
| `#vestibule-choice-print` | 左前景矮台上的摊开无号台账与指印泥 | 指印 |
| `#vestibule-choice-exit` | 最深处无把手黑门的门洞 | 无号出口 |
| `#vestibule-choice-review` | 右前景墙柱上的黑色复核投递槽 | 送审 |
| `#vestibule-choice-floor` | 右侧黄铜面板上唯一未刻字、轻微发暗红光的地下层按钮 | 地下层 |

五个热点必须围绕画面分布，中央门热点不得吞掉号牌热点；右侧送审槽与地下层按钮要上下错开。

## 场景三：逆向阶井

保留上下折返楼梯、对向脚印、黄铜扶手与暗红第零级接缝，并补足回望与申报物件：

| 原按钮 | 画面物件 | 移动短标签 |
|---|---|---|
| `#stairwell-choice-climb` | 右上向上的楼梯与上行脚印 | 向上 |
| `#stairwell-choice-zeroth` | 中央平台横贯楼梯、暗红发亮但没有高度的第零级接缝 | 第零级 |
| `#stairwell-choice-lookback` | 左上墙面一块只映出背后的窄长黑镜 | 回望 |
| `#stairwell-choice-review` | 右下扶手柱上的黄铜异常申报盒与复核章 | 申报 |

楼梯热点沿真实梯段放置；第零级、黑镜、申报盒分别占据中心、左上、右下，移动端不能重叠。

## 代码边界

- 允许改：`index.html`、`styles.css`、`tests/site.test.mjs`、README 与 QA/进度文档。
- `script.js` 业务逻辑原则上零改动；若现有 DOM 查询因移动按钮失效，应先证明原因再做最小修复。
- 不改 13 个按钮的 `id`、完整 `.bb-title`、`.bb-hint`、反馈、mark、目标、AutoAdvance scope。
- 不改 v32/v33/v35 的状态键，不改 v49 三间门前场景。
- 不执行 `git add`、`git commit`、`git push`、`git stash`；保留当前 v32 staging 边界。
- 不写 `docs/KimiUsageLog.md`，不覆盖 `assets/divine-name-cancellation.webp`。

## QA 门槛

### 静态

- 3 张新图均为 1536×1024 WebP，HTML 尺寸属性一致。
- 三个旧 `.branch-choices` 容器消失；13 个原按钮均位于各自 figure 内。
- 13 个短标签存在且 `aria-hidden="true"`；完整标题和 hint 原文仍在 DOM。
- 移动端短标签与 desktop-only hint 规则有明确测试合同。
- `node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全绿。

### 行为

- 3 个直达 hash、13 个动作、13 个原目标、13 条原反馈全部逐项验证。
- 每房首选锁、rival action、连点、Enter/Space/Tab、`aria-pressed` 恢复逐项验证。
- 直接 hash、刷新、坏 JSON、数组 JSON、reduced-motion 与三个状态键隔离继续验证。
- v49 门前实感及 v33/v35 相邻入口回归至少各跑两轮。

### 视觉

- 桌面 1440×1024：三张基线、至少三张 hover/focus、三张短视口。
- 移动 390×844：三张基线；短标签最多两行、无溢出、无互盖。
- 每个热点必须和本表指定物件实际对齐，不能只检查矩形和触控尺寸。
- 监理逐张目验后才可标记完成；Kimi 自报“视觉通过”不等于放行。

## 交付

完成后同步：

- `README.md`
- `design-qa.md`
- `docs/ProgressLog.md`

记录实际测试次数、截图数量、目验发现与修复；若发生瞬时或竞争失败，也要如实写入。通过 QA 后停在未提交状态，等待监理继续安排。
