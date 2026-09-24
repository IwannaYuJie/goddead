# v97 场景原画提示词

生成方式：本机 Codex CLI（`codex exec`，内置 image generation），2026-09-24。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 97: "Bureau of Lost Weight" — when god died everything became a little lighter, and an old weights-and-measures bureau gives the lost weight back with brass weights. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red wax and thread, warm amber lamp light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 失重局

Scene: the bureau. A dim old weights-and-measures office with wooden cabinets of drawers. On a long dark shelf, three glass display domes LEFT / CENTER / RIGHT with clear space between them, each object floating slightly above its small velvet cushion as if weightless: LEFT a spiral seashell (a lost echo), CENTER a small glass heart-shaped vial with a faint red glow inside (a lost pulse), RIGHT a folded letter sealed with dark red wax (a lost confession). Faint dust hangs in the air.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v97-bureau-of-lost-weight.png` | 2339608 | `6179624dc2106173f617c1315db47be1e41e414b75b7086b951b2dc0ecb002b2` |
| `assets/v97-bureau-of-lost-weight.webp` | 168896 | `89970393b993f535c54dd5d3883d60657798f70593aace15931c0ba36f5bdcf5` |

## 天平室

Scene: the Balance Room — a tall ornate antique brass balance PILLAR standing at the exact horizontal center, reaching to about 30 percent from the top of the image, but its beam and both pans have been REMOVED (only the empty pillar with a small pivot at its top remains; the removed beam lies on the table at the far left edge). The area to the left and right of the pillar top must be plain dark empty wall so an interface beam and pans can be drawn there. Dark wooden table across the bottom third, a single hanging lamp.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v97-balance-room.png` | 2025449 | `3cab9b2fd1c281d24a597fb0ac7e51a100c514c09d8b31bb76bedb4f0fad3003` |
| `assets/v97-balance-room.webp` | 111430 | `954f3db947835928b25a1ee706c0c4986195590f70659c010379d992f17e7667` |

## 足斤法庭

Scene: the Court of the Full Weight — a tall round hall with a gigantic brass balance hanging from the dome, perfectly level, an empty high-backed judge's chair beneath it. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a single white feather, CENTER a small stack of brass cylindrical weights, RIGHT an empty brass scale pan. Slightly brighter dawn light from high windows, solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v97-court-of-full-weight.png` | 2125827 | `288eddfb26304daef4794a7d7911d3d981f489ad655e50bfeaf3ebbf4763bb97` |
| `assets/v97-court-of-full-weight.webp` | 143186 | `1e1c98bf3674112704a81245bfd3a372b640239d7b84a17bf427915520c1cf68` |

天平立柱轴心在原图约 (767, 340)；`styles.css` 里 `.lw-beam` 以 left 20% / top 33.2% / width 60% 对齐。
