# Goddead v46 旁线未静 / THE SIDE TONES NEVER WENT QUIET

## 0. 角色边界

- Codex：世界观、交互契约、三张源图、监督与独立 QA。
- Kimi K3 High：唯一生产代码实现者，负责 HTML / CSS / JS / tests / README / design-qa / ProgressLog。
- 本轮不执行 `git add / commit / push / stash`，不触碰 `docs/KimiUsageLog.md`，保持既有 staged 边界。

## 1. 目标

余响交换台现在只有“听前三条回线 → 接通第四线路”的固定流程。v46 把交换台位图里本来就存在、却只能观看的三件实物变成支线入口：

1. 左下黑色听筒；
2. 前景脱落的散线插头；
3. 面板右下仍亮着的红色回铃灯。

三入口都直接进入新场景，点击后只保留一拍逐字反馈并自动转场；没有确认页、下一步或底部继续按钮。原四条回线、第四线路接通、记录逐行显现与无主投递所主线全部保留。

## 2. 总体世界观

第四线路只负责把声音送走；交换台旁边还有三种没被计入线路的余响：

- 没有人坐过、却一直保持摘机状态的监听席；
- 没有编号、因此能接到任意地点的插孔墙；
- 对端早已挂断，回铃却被当作遗体保存的陈放室。

三处合称“旁线”。它们不是第五、第六、第七线路，也不改变第四线路是否接通；只是交换台拒绝写进接线簿的侧音。

## 3. 交换台三入口

保持 `assets/line-four-switchboard.webp` 原文件、尺寸与视觉不变，在真实器物上叠三枚 native `<button>` 热点，独立 class `.sidetone-entry-hotspot`：

| 热点 | 建议 ID | 短标签 | aria-label | 逐字反馈 | 目的地 |
|---|---|---|---|---|---|
| 左下听筒 | `sidetone-entry-receiver` | 摘听筒 | 摘起交换台左下无人接听的黑色听筒 | `听筒离开叉簧，里面没有人声，只有一张空椅子在等你先开口。` | `#unseated-listening-booth` |
| 前景散线插头 | `sidetone-entry-plug` | 拾散头 | 拾起交换台前景没有线路编号的散线插头 | `散线插头自己找到一个没有编号的孔。交换台后面多出一整面插孔。` | `#unnumbered-jack-field` |
| 右下红灯 | `sidetone-entry-return-lamp` | 按回灯 | 按下交换台右下仍亮着的红色回铃灯 | `红灯熄灭，别处却亮起一排已经挂断的回铃。` | `#return-ring-morgue` |

入口反馈写入图下独立 `#sidetone-entry-response`（`aria-live="polite"`），不要复用接线簿 alt 文案。

### 与第四线路的第一归宿锁

- 新增内存旗标 `switchSidetoneArmed`，每次 `enterSwitch()` 复位。
- v46 入口先检查 `currentScene === "switchboard"`，再检查 `AutoAdvance.has("switchboard")` 与 `switchSidetoneArmed`；任何检查失败时对所有状态、反馈、声音、class 与 timer 都必须零副作用。
- v46 入口被接受时先置 `switchSidetoneArmed = true`，再 `AutoAdvance.clear("switchboard")`，然后才可写 v46 状态、反馈并排定目标。
- 第四线路按钮在任何 `goddead_line4` 写入、记录显现、声音、toast 或 timer 之前检查 `switchSidetoneArmed`；v46 已先接受时，第四线路不得迟到改写目的地。
- 第四线路已先排定 `#deadletter` 时，三入口必须完全 inert。
- 回线壹/贰/叁不是目的地竞争：在尚未排定第四线路且 v46 未武装时保持原语义；v46 入口武装后的反馈拍内，四条 `.patch-btn` 都不得再写旧状态。
- v46 入口绝不写 `goddead_line4`、不替玩家听回线、不接通第四线路；主线仍只能通过前三条都听过后点击回线肆来推进。

## 4. 三个新场景与九个动作

统一要求：

- 每场景一张 1536×1024 WebP，沿用黑石 / 老黄铜 / 少量暗红信号光；
- 图内三枚 native `<button>`，统一 `.sidetone-hotspot`，触控目标至少 44×44；
- 每个按钮覆盖真实器物，不做卡片列表、示意图、SVG 或 CSS 假素材；
- 首个动作锁住本场景三个热点，反馈一拍后自动转场；
- `Enter` / `Space` 通过 native button 自然工作；
- 场景底部只有回到交换台的非主推进出口。

### 4.1 失席监听间 / THE UNSEATED LISTENING BOOTH

- hash：`#unseated-listening-booth`
- 图：狭窄黑石监听室；左侧悬着拆开的黑色耳筒；中央旧操作椅正对一只没有人的圆形话筒；远端墙内露出一排吸音铜管。不得出现人物。
- 图内热点：

| 动作键 | 建议 ID | 短标签 | 逐字反馈 | 目标 | mark |
|---|---|---|---|---|---|
| `earpiece` | `sidetone-booth-action-earpiece` | 贴耳筒 | `耳筒里没有来电，只有午夜回拨台在一遍遍念同一张值班表。` | `#midnight-callback` | `heardRosterWithoutCaller` |
| `mouthpiece` | `sidetone-booth-action-mouthpiece` | 对空话筒 | `你没有说话。话筒却把三下敲门送回门内。` | `#counter-knock-gallery` | `returnedSpeechAsKnocks` |
| `chair` | `sidetone-booth-action-chair` | 坐失席 | `椅脚压下一枚暗扣，监听间的墙翻成无号插孔场。` | `#unnumbered-jack-field` | `satAtMissingOperatorSeat` |

### 4.2 无号插孔场 / THE UNNUMBERED JACK FIELD

- hash：`#unnumbered-jack-field`
- 图：纵深黑石机房，一整面没有数字的旧黄铜插孔；左前景一枚脱落插头拖着编织线；中央有一个空孔透出不自然暗红；右侧垂着完全空白的瓷质线签。不得出现人物。
- 图内热点：

| 动作键 | 建议 ID | 短标签 | 逐字反馈 | 目标 | mark |
|---|---|---|---|---|---|
| `plug` | `sidetone-jack-action-plug` | 插游线 | `插头穿过所有空孔，最后从红线登记所的线结里伸出来。` | `#red-thread-registry` | `routedWanderingPlug` |
| `socket` | `sidetone-jack-action-socket` | 接空孔 | `无号插孔接通了一条已经挂断的回铃，墙后开始逐格发亮。` | `#return-ring-morgue` | `connectedNumberlessSocket` |
| `tag` | `sidetone-jack-action-tag` | 挂空签 | `空白线签盖上夜班时刻，夜班登记所把它当成通行证。` | `#night-shift-registry` | `issuedBlankLineTag` |

### 4.3 回铃陈放室 / THE RETURN-RING MORGUE

- hash：`#return-ring-morgue`
- 图：低矮黑石陈放室，黄铜抽屉与托盘保存成排熄灭信号灯；左侧一只仍发暗红光的回铃灯；中央托盘上放着一张卷曲的退回通话单；右侧黄铜铃碗内部结着黑蜡。不得出现尸体、人物或文字。
- 图内热点：

| 动作键 | 建议 ID | 短标签 | 逐字反馈 | 目标 | mark |
|---|---|---|---|---|---|
| `lamp` | `sidetone-morgue-action-lamp` | 取回灯 | `回铃灯离开托盘后变得更黑。无灯灯廊把这种黑当成照明。` | `#unlit-lamp-gallery` | `removedReturnedLamp` |
| `slip` | `sidetone-morgue-action-slip` | 读退单 | `退回单没有对端，只有三次无人应门的时间。` | `#unanswered-vestibule` | `readCallReturnSlip` |
| `bell` | `sidetone-morgue-action-bell` | 敲蜡铃 | `黑蜡没有发声。失席监听间里的空椅替它转过来。` | `#unseated-listening-booth` | `rangWaxFilledBell` |

## 5. 状态契约

- 独立 key：`goddead_v46_sidetones`
- 规范化状态：

```js
{
  visited: { booth: false, jack: false, morgue: false },
  entry: "direct",
  pending: null,
  lastScene: "",
  lastAction: "",
  traversals: 0,
  marks: []
}
```

- `entry` 白名单：`switch-receiver / switch-plug / switch-return-lamp / booth / jack / morgue / direct`
- `pending` 必须严格是 `{scene, action, target, feedback}` 四字段，且逐字段等于动作表；任何缺失、错配、伪造 target / feedback 都归一为 `null`。
- `lastScene` 仅 `booth / jack / morgue`；`lastAction` 必须属于对应 scene。
- `traversals` 非负整数并裁到 9999。
- `marks` 仅九项白名单、去重、最多九项。
- 坏 JSON、数组、错型对象安全回 neutral。
- v46 处理器不直接读写 v28–v45、`goddead_watch`、`goddead_line4` 或主线键。进入既有目标场景后，目标场景自己的既有落地语义不属于 v46 入口写入。

## 6. pending / reload / 离场

- 入口在点击时立即写 visited 与 traversals，排定前写全合法状态。
- 新场景在进入时写 visited。
- 动作先写 lastScene / lastAction / mark / traversals / pending，再反馈并排定。
- timer 真正触发前才清 pending。
- reload 在反馈拍内：逐字重播反馈、恢复同一目标、不得重复 traversals 或 marks。
- 离开反馈拍：取消 timer，pending 保留；回到同一 v46 场景才重播并续走，其他场景不 ghost jump。
- reduced-motion 仍保留反馈拍，仅缩短到约 300ms。
- 隐藏 DOM 或 off-route 程序化 click：必须在任何状态读取前由 live-scene guard 拦住，零反馈、零 timer、零状态写入。

## 7. 目录、痕迹与遗忘

- 首次到访后恢复：
  - `02μ / 失席` → `#unseated-listening-booth`
  - `02ν / 无号孔` → `#unnumbered-jack-field`
  - `02ξ / 回铃` → `#return-ring-morgue`
- 未到访时必须 `hidden`、不可聚焦、不在无障碍树。
- Remembrance 只加一行：

`旁线未静：改道 N 次；失席 / 无号孔 / 回铃已见 X/3。`

- 保持统计卡严格 8 张。
- “遗忘一切”清除 v46 key、隐藏三目录入口与记忆行；不新增单独清除按钮。

## 8. 素材与视觉约束

- 保持既有 `assets/line-four-switchboard.webp` 哈希、尺寸、文件字节不变。
- 源 PNG：
  - `design-references/source-unseated-listening-booth.png`
  - `design-references/source-unnumbered-jack-field.png`
  - `design-references/source-return-ring-morgue.png`
- 生产 WebP：
  - `assets/unseated-listening-booth.webp`
  - `assets/unnumbered-jack-field.webp`
  - `assets/return-ring-morgue.webp`
- 生产图统一 1536×1024；WebP 尽量控制在 450KB 内。
- 桌面 1440×1024、短桌面 1440×800、移动 390×844 均需图与三热点可见、无横向溢出。

## 9. QA 完成门槛

Kimi 必须写并实际运行独立 smoke / visual 临时脚本，至少覆盖：

1. 三交换台入口逐字反馈、visited/entry/traversals、自动到达；
2. 三入口对 `goddead_line4` 字节级零写；
3. 四回线原文、前三回线覆盖、第四线唯一接通与原 `#deadletter` 路径不变；
4. 第四线已排定 → v46 三入口零副作用；
5. v46 入口先接受 → 四条 patch 按钮零迟到写入、目的地不被覆盖；
6. 三场景、九动作、九目标、键盘 Enter/Space；
7. live-scene / hidden DOM / off-route 双向零副作用；
8. 同拍竞争只接受第一项，三个热点即时 disabled；
9. pending 合法/伪造、reload、离场、reduced-motion；
10. 坏 JSON、错型、9999 裁剪、lastScene/lastAction 修复；
11. v28–v45 与主线种子快照隔离；
12. 目录 02μ/02ν/02ξ、痕迹单行、严格 8 卡、遗忘；
13. visual 至少含：交换台 clean、三入口反馈、三场景桌面/移动/短桌面、三动作反馈、目录、痕迹；
14. `node --check script.js`、`node tests/site.test.mjs`、`git diff --check`；
15. 回归 v45 smoke+visual、v44 smoke+visual、v43 smoke+visual、v42/v41/v40 smoke 与 v40 visual、旧 switchboard/deadletter/line4 近邻。

连续两次 v46 Smoke 与连续两次 v46 Visual 全绿后才可进入最终报告；逐张目验不能只报截图数量。
