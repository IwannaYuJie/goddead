# v107 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-05。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 107: "Ink Mixing Room" — the front page of today is finally set, but the press has no ink, and the dead must mix inks to match the colors of the old rooms. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light with pale morning light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 调墨房

Scene: the ink room. A narrow pigment workshop with shelves of jars and mortars. On a long stone table in front, three separate wide-mouthed glass ink jars LEFT / CENTER / RIGHT with clear space between them, each with a small plain vellum color card leaning against it: LEFT jar filled with warm amber lamp-light colored ink, CENTER jar with dull old-gold ink, RIGHT jar with verdigris copper-green ink. A brass mortar and pestle, brushes and spilled pigment powders (cinnabar red, rattan yellow, indigo blue) at the far edges.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v107-ink-mixing-room.png` | 2865789 | `53a3f57d08046087180b5b99adab0479da96b4280674bd73845130df6023c198` |
| `assets/v107-ink-mixing-room.webp` | 298780 | `133670579b2cb4df5a2257c06ef6043d4ea25a074589c01ece6dc33a714da612` |

## 调色碟

Scene: the mixing dish viewed from slightly above the table: a large shallow round white porcelain mixing dish on the LEFT half of the image, completely EMPTY and clean (no ink inside), evenly lit so an interface color can be painted into its center. On the RIGHT side three small separate open pigment pots in a row with small brass spoons: cinnabar red, rattan yellow, indigo blue. Keep the bottom quarter calm and dark.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v107-mixing-dish.png` | 2532595 | `e0afeed435ae16b9fe085a842cef5d4a2ffac6c173f401c2ab69f9d276097504` |
| `assets/v107-mixing-dish.webp` | 181318 | `506479b11e992d6c64e2394a43644e75c435d27ff77f1b501e0f554ea686fbf4` |

## 首色听证会

Scene: the Hearing of the First Color — a tall round hall hung with long blank cloth banners that are still uncolored, an empty high-backed chair under a high window of pale morning light. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a black ink stick on a stone ink slab, CENTER a single blank square color card, RIGHT a soft brush with its tip soaked in mixed colors. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v107-hearing-of-the-first-color.png` | 2654296 | `3df80acecad147754a9df5237d9eaa35e2c4e5017f0f3d154901341924fa1a7c` |
| `assets/v107-hearing-of-the-first-color.webp` | 221934 | `6011f65bf434bd83491a6eff38eb6d2884dbecd041a9ad4a86bcde81a9fea257` |

调色碟为透视椭圆，碟心约 (430, 545)；`styles.css` 的 `.mx-mixed` 按此对齐。
