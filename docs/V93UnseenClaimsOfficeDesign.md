# v93 未被看见之物认领处 · 设计与实现

日期：2026-09-24。设计、前端与测试：Claude；场景原画：本机 Codex（内置 image generation）。状态：已实装。

## 1. 从 v92 接过来

v92 把“看见”变成了抚养义务，人们开始为闭眼投保。结果所有没人看见的事都堆了起来，没人愿意签收。

> 认领处不开灯。门口的办事员递给你一盏提灯：看见什么，就认领什么。

## 2. 新交互：提灯搜寻

- 认领处大厅几乎全黑。指针 / 手指就是一盏灯（`pointermove` / `pointerdown`），方向键在画面获得焦点时移动灯；按 Tab 逐个聚焦藏着的东西，灯会移到它身上。
- 视觉光圈与“照到”判定共用同一个像素半径：图宽 14%，粗指针（触屏）19%。灯只改显示，不写存档。
- 五件东西只有被灯照到或获得焦点时才显形；已认领的以半透明加 ✓ 常驻，方便看剩下几件。

## 3. 五件没人看见的事 → 主线房间

| thing | 标题 | 回执所在 | 认领员 |
| --- | --- | --- | --- |
| `the-chair-still-warm` | 还温着的椅子 | `watch` | 值夜认领员 |
| `the-footprints-on-the-ceiling` | 天花板上的脚印 | `corridor` | 走廊认领员 |
| `the-letter-no-one-opened` | 没人拆的信 | `deadletter` | 投递认领员 |
| `the-socket-that-lit-once` | 亮过一次的插孔 | `switchboard` | 交换台认领员 |
| `the-knock-before-the-first` | 第一下之前的敲门 | `threshold` | 门槛认领员 |

这一章把回执放回游戏最早的主线房间，让开场那几间屋子重新被照亮一次。

## 4. 补证台：三种认领方式

- `witness-it-yourself` 替它作证（放大镜）：当场登记，回认领处。
- `leave-it-unseen` 继续不看（黑绒布）：当场登记，回认领处。
- `assign-an-old-witness` 交给旧场景作证（铜铃）：去该物所属的主线房间，出现认领回执，点认领员回认领处。

只有第三种需要跑一趟，减少前几章“每份记录都要往返旧场景”的重复劳动。任意方式认领后，所属主线房间都会多一段随最近方式变化的记忆。“放回黑暗”清空补证台。

收集键 `thing:method`，5×3 = 15。

## 5. 终审

条件：五件事都有下落、三种方式都用过。最短五次，其中只有一次要跑旧场景。

| action | 裁定 | 抵达 |
| --- | --- | --- |
| `let-unseen-things-keep-happening` | 让未被看见的事继续发生 | `threshold` |
| `make-the-lamp-the-only-witness` | 让这盏灯成为唯一的目击者 | `remembrance` |
| `close-every-eye-to-set-things-free` | 让所有眼睛闭上，事物自由 | `unending-gallery` |

## 6. 数据与边界

- 独立键 `goddead_v93_unseen_claims`，version 93，十二字段：version、visited、draft{thing}、found、claims、courtOutcomes、claimRuns、courtRuns、latestMethodByThing、lastOutcome、activeClerk{claim}、pending。
- pending 七类（entry / thing / claim / abandon / clerk-return / court-entry / verdict），按 kind 与当前状态重建期望对象，逐字段一致才接受；只有“交给旧场景作证”的认领能有 activeClerk。
- 解锁：v92 听证条件满足且三项豁免裁定全收集，经 `store.memo` 缓存；v92 有在途记录时入口禁用。
- 元素 id / 样式类前缀 `us-`；所有控件只接受真实点击；存档内容只以 textContent 渲染。
- 旧场景面板统一 `grid-column: 1 / -1`，在交换台、值夜室这类 grid 布局里横跨整行（同时修正了 v91 / v92 的面板）。

## 7. 美术

三张 1536×1024 由本机 Codex CLI 生成：几乎全黑的认领大厅（五件物分散在各自区域）、补证台（放大镜 / 黑绒布 / 铜铃）、无人目击终审庭（半开的门 / 提灯 / 眼罩，陪审席坐满未点亮的灯）。源图在 `design-references/source-v93-*.png`，WebP 在 `assets/v93-*.webp`，提示词与哈希见 `docs/V93ImagePrompts.md`。

## 8. 验收记录

- 测试：新增 v93 块（提灯只改显示且被夹在画面内、锁定深链、最短五次开庭、只有铜铃要跑旧场景、主线房间回执与记忆、放回黑暗、pending 生命周期、v92 在途禁用入口、坏档与伪造字段、遗忘重置）。
- 浏览器：内置浏览器真实指针移动提灯、点击认领五件事（一次铜铃去交换台）、开庭与三项裁定；方向键移动灯、Tab 聚焦把灯移到物件；未解锁深链回痕迹室；375px 无横向溢出；控制台无错误。
