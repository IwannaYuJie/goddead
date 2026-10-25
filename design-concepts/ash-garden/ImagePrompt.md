# 余温温室原画提示词

状态：2026-10-18 通过内置 imagegen 生成并保存首张原画；2026-10-25 已以 WebP 接入 v128 实际温室页面并完成本地视觉检查，公开发布另记。原图不是 v127 生产资源。非 CLI 或第三方图像 API。原焚献炉图片仅由 Codex 查看以理解材质，没有把玩家输入或存档送入图像生成。

## 完整提示词

```text
Use case: stylized-concept
Asset type: landscape environment illustration for the dark, quiet narrative browser game Goddead; concept art for a future playable return to an old prayer incinerator, not a UI screenshot.
Primary request: The Garden of Remaining Warmth. The furnace has gone cold, but a tiny plant has sprouted from the ash of a burnt wish. Create an intimate abandoned greenhouse adjoining an old prayer-burning room, unsettling yet tender.
Scene/backdrop: soot-black stone walls and oxidized brass pipes; a battered dark bronze incinerator with a narrow letter slot and lower grate stands in the back right, completely unlit. A tall dirty-glass window on the left admits a narrow overcast dawn light. An old empty wooden chair is visible near the right wall, with one empty clay pot at its foot. A small ash drawer is half open beneath the furnace.
Subject: in the foreground, a broad low stone propagation bench with a shallow rectangular ash tray, mostly undisturbed smooth pale ash. At the far edge of the tray is one very small ivory-green seedling, two delicate leaves with papery veins. Thin copper heating tubes disappear beneath the bench. The plant is vulnerable and ordinary in scale, not a magical tree.
Style/medium: richly textured cinematic environmental painting with restrained photorealistic materials, subtle painterly grain, weathered metal, soot, old wood, cold ash; cohesive dark gothic bureaucracy, not fantasy castle spectacle.
Composition/framing: single landscape frame, about 3:2. Eye level slightly above the bench. Clearly separate the window ledge, ash drawer, and empty chair as readable story objects. Foreground ash tray occupies the central lower half with quiet uncluttered space. Keep all main objects in frame, with breathing room. No panels or montage.
Lighting/mood: subdued but legible, black charcoal shadows with soft pewter daylight; a hint of dusty sage in the tiny leaves and muted old brass. The window is not blown out, dark objects retain detail. A still moment after the end of the world, with one fragile reason to return.
Text: none.
Constraints: no people, no bodies, no gore, no flames, no runes, no letters, no numbers, no labels, no logos, no watermark, no interface, no buttons, no puzzle grid baked into the image. The future interactive nine-cell puzzle will be drawn separately by code. No neon glow, no lush jungle, no oversaturated green, no candy colors. Opaque background.
```

## 验证与保存

- 项目文件：[ash-garden-room-v1.png](ash-garden-room-v1.png)，1536 × 1024，RGB 无 alpha，3,040,652 bytes。
- SHA-256：`5a59c967512885133918bc5e5df890934bd71841274a376f159b2b97ffb3c062`。
- 原始输出：`/Users/penghaoxiang/.codex/generated_images/01a02e82-0dd2-7271-a92d-4646bc326508/exec-55d9796b-5602-417d-ac21-ed034c2e88f4.png`；已复制入项目，原件保留。
- 视觉检查：灰床、黑铜炉、半开灰屉、窗台、空椅和小芽均可辨认；炉无明火，无文字、按钮或棋盘烘焙。铜管与细小绿色使新场景保持原游戏的暗色材质，又留出清晨的层次。
- 画面灰床有明显透视，交互九格应作为独立原生控件面板，不直接在透视图里按等分坐标放按钮。窗外远景仅作气氛，不推导新的可达场景。
- 2026-10-18 当日只通过美术概念检查；后续真实玩法验收独立记录在 [v128-browser-qa.md](../../design-qa-evidence/v128-browser-qa.md)，不以原画生成代替玩法证明。

## 网页候选副本

2026-10-18 用 Pillow 12.2.0 进行格式转换：原尺寸、无裁切、无重绘，WebP quality 85 / method 6。PNG 原件保持不变。这是生成后文件压缩，不是另一次图像生成。

- 文件：[ash-garden-room-v1.webp](ash-garden-room-v1.webp)，1536 × 1024，317,952 bytes，比 PNG 小约 89.5%。
- SHA-256：`bb440351f87015113855a9e6ed2fe5a09fac51a415039ecd0ed877e9b20cb4c8`。
- 已实际打开转换图：窗、冷炉、灰屉、椅子与小芽仍清楚可辨，暗部材质与原构图保留。仍只是候选美术资源，未放入生产 assets 或页面。
