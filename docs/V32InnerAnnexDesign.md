# Goddead v32 设计：门内副楼 / THE INNER ANNEX

## 目的

v31 已经把首页门外和访客守则从一条假选择改成了三条真实旁路；v32 不再继续向结局堆内容，而是把这三条最前段旁路各向内延伸一间，让玩家在进入主线前就能绕出第二层路径。

- 只深化 `#peephole-chamber`、`#glyph-niche`、`#return-passage`，不改 v28 治理终局和 v29/v30 深层分支。
- 每个 v31 房间只拿出一个原本直接回主线的动作，改为进入一间新的副楼房间；其余动作与去向保持不变。
- 三间新房互相形成三角回路，同时各保留一个回门外、进守则或进走廊的出口。
- 所有动作仍是「点击或键盘激活 → 立即反馈 → 自动转场」，没有第二个继续按钮。
- 代码、测试和 QA 脚本全部由 Kimi K3 High 实现；监理只提供世界观、素材与验收。

## 新前段结构

```text
倒置窥孔 #peephole-chamber
└─ 闭上这只眼 ───────────→ 闭目档案室 #eyelid-archive

失号龛 #glyph-niche
└─ 取下空白号牌 ─────────→ 无号前厅 #unnumbered-vestibule

回返夹道 #return-passage
└─ 倒着走到尽头 ─────────→ 逆向阶井 #reverse-stairwell

闭目档案室
├─ 摸索被封存的视线 ─────→ 无号前厅
├─ 听盒中眨眼 ───────────→ 访客守则
└─ 把自己的眼影归档 ─────→ 门外

无号前厅
├─ 把空白牌挂到第十扇门 ─→ 逆向阶井
├─ 在无号台账上留下指印 ─→ 闭目档案室
└─ 选择没有编号的出口 ───→ 走廊

逆向阶井
├─ 向上走向下层 ─────────→ 闭目档案室
├─ 跨过第零级台阶 ───────→ 无号前厅
└─ 回头但不转身 ─────────→ 访客守则
```

这三间房是可选的早期副楼，不是主线门禁。玩家随时可以经现有出口离开，也可以在副楼内循环探索。

## 对 v31 的三处定向改线

只改以下三个目的地，保留原动作文字、反馈、v31 mark、`aria-pressed` 恢复和一次性调度语义：

1. `#peephole-chamber` 的「闭上这只眼」
   - 原去向：`#threshold`
   - 新去向：`#eyelid-archive`
2. `#glyph-niche` 的「取下空白号牌」
   - 原去向：`#corridor`
   - 新去向：`#unnumbered-vestibule`
3. `#return-passage` 的「倒着走到尽头」
   - 原去向：`#corridor`
   - 新去向：`#reverse-stairwell`

同一批次不得顺手改写 v31 其余六个动作，也不得改守则 1–8 与「玖」异常的分流。

## 新区域一：闭目档案室

- Hash：`#eyelid-archive`
- 中文名：闭目档案室
- 英文：THE ARCHIVE OF CLOSED EYES
- 源图：`design-references/source-inner-annex-eyelid-archive.png`
- 正式图：`assets/inner-annex-eyelid-archive.webp`
- 视觉：封存“视线”的黑色档案室。墙面全是黄铜眼睑形百叶与抽屉，中央是一只黑漆归档柜；所有眼睑都闭着，没有裸露眼球和血肉。
- 引文：「凡被看见之物，均须证明自己值得被记住。」

三个动作：

1. 「摸索被封存的视线」
   - mark：`searchedSealedSight`
   - 反馈：「抽屉里没有照片，只有一扇尚未编号的门。」
   - 自动去 `#unnumbered-vestibule`。
2. 「听盒中眨眼」
   - mark：`heardBoxBlink`
   - 反馈：「盒子每合一次，守则就少承认你一秒。」
   - 自动去 `#protocol`。
3. 「把自己的眼影归档」
   - mark：`filedOwnShadow`
   - 反馈：「档案柜收下影子，把人退回门外。」
   - 自动去 `#threshold`。

## 新区域二：无号前厅

- Hash：`#unnumbered-vestibule`
- 中文名：无号前厅
- 英文：THE UNNUMBERED VESTIBULE
- 源图：`design-references/source-inner-annex-unnumbered-vestibule.png`
- 正式图：`assets/inner-annex-unnumbered-vestibule.webp`
- 视觉：圆形行政前厅围着多扇相同的封门，每扇门上都是空白骨瓷号牌；正中最深处有一扇没有把手的黑门。
- 引文：「没有号码的门，不受门的顺序约束。」

三个动作：

1. 「把空白牌挂到第十扇门」
   - mark：`hungBlankOnTenth`
   - 反馈：「前厅只有九扇门。第十扇在你脚下打开。」
   - 自动去 `#reverse-stairwell`。
2. 「在无号台账上留下指印」
   - mark：`leftPrintInBlankLedger`
   - 反馈：「台账拒绝姓名，只收录你曾经看过什么。」
   - 自动去 `#eyelid-archive`。
3. 「选择没有编号的出口」
   - mark：`choseUnnumberedExit`
   - 反馈：「所有门同时退后，只有走廊没有移动。」
   - 自动去 `#corridor`。

## 新区域三：逆向阶井

- Hash：`#reverse-stairwell`
- 中文名：逆向阶井
- 英文：THE REVERSE STAIRWELL
- 源图：`design-references/source-inner-annex-reverse-stairwell.png`
- 正式图：`assets/inner-annex-reverse-stairwell.webp`
- 视觉：黑石与旧黄铜构成的狭窄阶井，上下两段楼梯折回同一层；脚印同时向上和向下，中央平台有一道极淡暗红接缝。
- 引文：「向上的人正在下楼。向下的人还没出发。」

三个动作：

1. 「向上走向下层」
   - mark：`climbedTowardLowerFloor`
   - 反馈：「你登上七级台阶，抵达一排闭着的眼睑。」
   - 自动去 `#eyelid-archive`。
2. 「跨过第零级台阶」
   - mark：`crossedZerothStep`
   - 反馈：「第零级没有高度，却把门的编号全部抹掉。」
   - 自动去 `#unnumbered-vestibule`。
3. 「回头但不转身」
   - mark：`lookedBackWithoutTurning`
   - 反馈：「守则从背后念出你的正面。」
   - 自动去 `#protocol`。

## 状态与隔离

独立键：`goddead_v32_inner_annex`

建议状态形状：

```js
{
  visited: {
    eyelidArchive: false,
    unnumberedVestibule: false,
    reverseStairwell: false
  },
  marks: [],
  lastChoice: "",
  transitions: 0
}
```

要求：

- `marks` 只接受本文件列出的九个合法 ID，去重并限制最大长度。
- `lastChoice` 只接受合法 ID 或空字符串。
- `transitions` 只接受有限非负整数并裁剪到安全上限。
- 坏 JSON、数组/对象错型、非法标记、`NaN`、`Infinity` 和超大数字都安全回退。
- 首次真正进入新房时立即记录 visited；直接 hash 进入也算访问，但不会自动触发任何动作。
- 动作第一次被接受时立即保存 mark、lastChoice 与 transitions；后续快速点击不得二次记数。
- 不读取、不覆盖 v28/v29/v30/v31 与主线状态。回归前后要做状态快照对比。

## 首选锁定与自动转场

- 三个新场景和三处 v31 改线都复用现有 `AutoAdvance`。
- 每个动作处理器最前面检查该场景是否已有 pending transition；第一条已接受的选择一旦排定，后续鼠标、Enter、Space 和其他动作全部忽略。
- normal motion 反馈约 0.8–1.1 秒；reduced-motion 约 0.3 秒，仍先显示反馈再转场。
- 离开场景时清除旧 timer；后退、hashchange 或目录跳转后不得被幽灵转场拉走。
- 重载持久状态只恢复 visited、mark 与 `aria-pressed`，不得自动续跑上次未完成的 timer。

## 目录与痕迹

- 三个新区域首次访问后，在目录恢复入口：
  - `01δ / 闭目档案`
  - `01ε / 无号前厅`
  - `01ζ / 逆向阶井`
- 未访问时入口必须带 `hidden`，不可聚焦、不可接收真实鼠标点击。
- 不在走廊再加三枚永久按钮，避免把走廊继续做成入口面板。
- Remembrance 只增加一行副楼记忆，按已访问项显示：
  - `门内副楼：闭目档案 / 无号前厅 / 逆向阶井；你在没有楼层的地方改道 N 次。`
- 仍保留现有八张统计卡，不新增卡片。

## 视觉与可访问性

- 三张源 PNG 均为 1536×1024；Kimi 转成同尺寸 WebP，建议 quality 85，保留源 PNG。
- 新场景复用 v31 `.scene-branch` 的标题、说明、位图羽化、三动作布局和焦点语言，只新增必要的语义类。
- 不把任何动作做成图上隐形热点；本轮三个场景的核心选择都用清楚可见的原生 `button`。
- 桌面 1440×800：标题、引文、位图和首个动作都在首屏；三个动作尽量同屏。
- 移动 390×844：标题、引文、位图和至少首个动作在首屏；动作单列且无横向溢出。
- 图片 `alt` 描述空间，不泄露动作结果。
- Tab 顺序与视觉顺序一致；Enter、Space 均可操作；focus-visible 使用现有血/骨色，不出现浏览器默认蓝圈。
- hover/focus 只做反馈，不换场；reduced-motion 去掉位移与闪烁，但不跳过文案。
- 标题聚焦、滚动归顶、静音状态、veil 生命周期沿用现有契约。

## Kimi 实现边界

Kimi K3 High 负责：

- 正式 WebP 转换。
- `index.html`、`styles.css`、`script.js` 的全部生产实现。
- `tests/site.test.mjs`、`/tmp/goddead-qa/` 下的聚焦 smoke/visual 脚本。
- README、`docs/ProgressLog.md` 与 `design-qa.md` 的同步。
- 证据截图。

Kimi 不做：

- 不 commit、不 push。
- 不改 `docs/KimiUsageLog.md`。
- 不顺手重构 v28–v31 或旧主线。
- 不用占位图、内联 SVG、CSS 绘图替代本轮三张正式素材。

## 验收清单

1. 三处 v31 改线准确，原动作文字、反馈、mark、恢复语义保持；其余六个 v31 动作目的地不变。
2. 三个新房各三动作，共九个真实目的地全部正确，均反馈后自动转场且没有继续按钮。
3. 三间新房形成闭合三角，同时能回门外、进守则或进走廊，不产生死路。
4. 三个场景都做双向首选竞争回归：动作 A 后立刻动作 B，最终只去 A；反向同理。
5. 快速连点和 Enter/Space 重复事件只记一次、只排定一次。
6. pending 期间后退、目录跳转、刷新不会累计第二次，也不会触发旧 timer。
7. 直接 hash 可进入三间新房；进入只记录 visited，不自动选动作。
8. 状态 reload 恢复；坏 JSON、非法 marks 和溢出数字安全回退。
9. v28/v29/v30/v31 与主线状态快照前后完全一致。
10. 目录 visited 入口恢复，未访问入口 hidden；Remembrance 只有一行副楼记忆，统计卡仍为八张。
11. 桌面 1440×1024、短桌面 1440×800、移动 390×844 无溢出、无遮挡、主体裁切合理、首个动作可见。
12. 三张正式 WebP 存在、尺寸正确、引用正确，页面无内联 SVG/占位图替代。
13. 键盘、focus-visible、reduced-motion、标题聚焦、滚动归顶、静音与控制台均通过。
14. `node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全绿。

建议 QA 文件：

- `/tmp/goddead-qa/v32-inner-annex-smoke.mjs`
- `/tmp/goddead-qa/v32-inner-annex-visual.mjs`

证据截图至少包含：

- 三个新房桌面各一张。
- 三个新房移动端各一张。
- 三条 v31 父房改线各一张可验证状态。
- 目录 visited 恢复一张。
- Remembrance 副楼记录一张。
