# v104 替别人醒来的旅馆原画提示词

2026-10-02。三张新的 1536×1024 场景原画已由内置 imagegen 生成并逐张看图确认，非 CLI 或外部私有生图接口。原画只提供旅馆空间；数字、指针、借刻连线和醒来房间由 exact Gemini 编写的实时前端生成。源 PNG 和运行 WebP 均已入项目。根在同一Chrome标签原生游玩旅馆、梦钟房和回廊，各自实测运行图 complete=true、naturalWidth1536/naturalHeight1024；同页390×844正常流面板、按钮和钟面已检查。实际5夜四结果/重复房间、刷新与回执、原档还原均已完成，范围与画面见本轮CU记录。本地验收不等于已发布。

已保存：design-references/source-v104-wake-for-another-hotel.png、source-v104-borrowed-dawn-clockroom.png、source-v104-shared-morning-veranda.png；运行 assets/v104-wake-for-another-hotel.webp、v104-borrowed-dawn-clockroom.webp、v104-shared-morning-veranda.webp。运行图只做 q88 WebP 编码，不裁切、不重绘、不着色，实际均 <300000 字节。

## 实际资产记录

| 场景 | 运行字节 | 源 PNG SHA256 | WebP SHA256 |
| --- | --- | --- | --- |
| wake-for-another-hotel | 217372 | d8d6a27214e57583420f33fa0f0ae64bfc7464d38b2c32d0d3f78e6b1cf719ac | 9d7f58e9263f762353cb8d5f0ff28a31280f6f8648deb21c4f1db613a84943d9 |
| borrowed-dawn-clockroom | 291930 | 0f21693dadb9fdc2a0d2f2fab056e4c11c75e8bb12f51183cc6869ee46906778 | 3a7e34b382d9d21bb9ed9451f8f395907e58808d82f3893dc050ba46a1076a4e |
| shared-morning-veranda | 290470 | cd32928bc99911a03524eda5a2c34dabf3baa1e8263b67c2cbf7a798af231297 | 638fe6064056dc6e1f20c99877dda9805fc4300a5bea7b22c5b9396d40514400 |

三对源图与运行图均实测 1536×1024、3:2。原始生成目录 `/Users/penghaoxiang/.codex/generated_images/01a02e82-0dd2-7271-a92d-4646bc326508/`：前台为 exec-201ea540-5cff-4c0e-b2f1-aa7fa7f5f926.png，梦钟房为 exec-53ef328b-bfc4-4624-82d0-ee6bcfc58ea1.png，回廊为 exec-52b0c340-6de5-462e-a6fb-886e4c90a5c0.png。生成原件均保留。

视觉复核：前台三副钥匙、空白登记簿和桌铃可辨；梦钟房正好三个空白铜钟壳，铜管相连，未烘焙任何指针或数字；回廊三扇帘门和三把钥匙可辨，没有特定被叫醒房间。均无人物、文字或 UI。回廊第三把椅子未清晰入画，不将其记为三椅约束通过；它不是玩法载体，三房身份和醒来状态必须由真实代码面板表达。图下正常流面板无需为原画虚拟安全区。

## 旅馆前台

```text
Use case: stylized-concept.
Asset type: one original atmospheric environment image for the Chinese browser exploration game Goddead, chapter 'The Hotel Where Someone Wakes for You'. Create a 1536×1024 landscape 3:2 image, not a collage or UI mockup.
Scene: a deserted old hotel reception at the end of a blue night. A dark walnut counter, a small tarnished brass service bell, an open guest register with entirely blank cream pages, and exactly three simple unmarked room-key hooks behind the desk. A narrow corridor recedes past three closed guest-room doors. No receptionist, no guests, no silhouettes. The room feels inhabited only by borrowed mornings.
Style: richly textured cinematic painterly realism, restrained supernatural bureaucratic horror, careful material detail, soft photographic depth, elegant and believable architecture. Palette midnight indigo, faded petrol blue, smoked walnut, warm worn brass and ivory linen. A little pale dawn light leaks under the closed corridor doors; the desk lamp is a single low amber pool. Quiet and strangely hospitable rather than abandoned rubble.
Composition: wide eye-level establishing shot with coherent perspective, counter and bell in the lower foreground, key hooks readable as physical objects, corridor above and behind them. Keep the whole image useful as a scene illustration; the game will place its actual controls below the image.
Constraints: no visible people or body parts, no gore, no creatures, no readable text, no numbers, no logos, no watermark, no typography, no arrows, no digital interface, no baked buttons or puzzle answers, no clock hands or clock numbers. Three doors and three key hooks must not become a huge repetitive wall. High detail without visual clutter.
```

## 借晨梦钟房

```text
Use case: stylized-concept.
Asset type: one original environment illustration for the Goddead browser game's 'Borrowed Dawn Clockroom'. Generate 1536×1024 landscape 3:2, a single coherent room, not a multi-panel image.
Scene: a narrow hotel maintenance alcove in deep blue night, holding exactly three tarnished brass circular clock housings on a long dark wooden workbench. Their round glass faces are completely blank smoky blue glass: no hands, no ticks, no numbers, no marks. Thin curved copper pipes connect the three housings as if time could be lent from one room to another. Beside the bench are a small unmarked brass key and loosely folded ivory linen. A high frosted window suggests dawn outside but the room is still asleep.
Style: cinematic painterly realism matching a quiet haunted hotel, tactile aged copper, walnut, dusty frosted glass and heavy pale linen. Restrained indigo/petrol blue, worn brass, ivory, a thin cool silver dawn rim. Subtle surrealism, convincing handcrafted physical construction, no industrial cyberpunk.
Composition: wide eye-level frontal three-quarter view, the three blank round clock housings are clearly distinct and occupy the middle band, generous room context above and below, uncluttered foreground. This is background art only: interactive numbered clocks, hands, links and six transfer buttons will be rendered as live HTML/SVG in a separate panel below this image.
Constraints: exactly three blank clock housings, no clock hands, no tick marks, no visible numbers, no printed instructions, no labels, no text, no humans, no silhouettes, no gore, no logo, no watermark, no game UI, no buttons, no arrows, no digital displays, no pre-solved state. The pipes may connect objects, but do not form readable graphic symbols. Rich detail and calm legibility.
```

## 清晨回廊

```text
Use case: stylized-concept.
Asset type: one original atmospheric scene illustration for the Goddead browser game, 'Veranda of the Shared Morning'. Create a 1536×1024 landscape 3:2 single image.
Scene: an unoccupied covered veranda of an old hotel just before sunrise. Exactly three closed linen-curtained guest doorways face the veranda, a small wooden chair outside each. At the far end, a pale horizon glows beyond frosted windows, while the three thresholds remain quiet and neutral. On a dark walnut ledge in the foreground rests a small brass handbell and three plain unmarked room keys. Nothing indicates which room has woken yet; this artwork must work for all four waking outcomes.
Style: cinematic painterly realism, understated supernatural bureaucratic atmosphere, delicate tactile ivory curtains, polished worn wood, aged brass, blue-gray plaster, fine morning haze. Same visual family as the blue-night hotel reception and clock maintenance alcove, but with gentle silver dawn and very restrained pale gold. Melancholy and tender, no menace or jump scare.
Composition: coherent wide eye-level architectural shot, three doorways visibly distinct without symmetry becoming a collage, a little depth along the veranda, foreground bell and keys clear. Curtain doors remain closed, no glowing highlighted selected door. Live clock state, awakened-room icons, explanations and buttons will appear in the game outside the image.
Constraints: no people, no sleeping bodies, no silhouettes, no faces, no gore, no readable writing, no numerals, no signs, no logos, no watermark, no graphic arrows, no game UI, no clocks or pre-baked ending indicators, no extra doorways or extra keys. Quiet usable scene art, not an illustration of a particular solved puzzle.
```
