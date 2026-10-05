# v106 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-05。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 method 6 转出（今日印刷所为 quality 78 以守住 300KB，其余 quality 84）。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 106: "Typesetting Room of Today" — after yesterday breakfast, today must finally be printed, but the front-page printing plates of today were dropped and cracked into pieces, and the dead slide them back together. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light with pale morning light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 今日印刷所

Scene: the print shop. An old letterpress printing room at early morning: a heavy iron hand press on the right, cases of type, hanging blank paper sheets drying on lines. On a long composing table in front, three square wooden relief printing blocks LEFT / CENTER / RIGHT with clear space between them, each visibly cracked into a 3 by 3 grid of square pieces with one piece missing: LEFT block carved with a closed door, CENTER block carved with a round clock face without hands, RIGHT block carved with a furnace with flames. Ink rollers and a brass tray of pieces.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v106-press-of-today.png` | 3118960 | `e98f6b64426fd28b64731f7d35ff195df0e5ed52fa7af9f5b35d378051743807` |
| `assets/v106-press-of-today.webp` | 266002 | `73bbbe08ca0a18806ce5f8c99020d6ef39b64f60a0aa349280cd88a6455655c0` |

## 拼版原图

Original 1536x1024 flat reference sheet for the browser game GODDEAD: three separate SQUARE woodcut relief prints placed side by side in ONE row on a plain pure black background. Each square is exactly 448 by 448 pixels, the three squares are vertically centered, with exactly 64 pixels of black gap at the far left, between the squares, and at the far right (layout: 64 | 448 | 64 | 448 | 64 | 448 | 64). Each print is a bold high-contrast black-and-warm-cream woodcut illustration filling its whole square edge to edge, with large clear shapes so it stays recognizable when cut into a 3 by 3 grid: LEFT a tall arched closed wooden door with iron studs and a ring knocker, centered; CENTER a large round clock face with twelve tick marks and no hands, centered; RIGHT an iron furnace with an open door and rising flames, centered. Subtle dark red accents allowed. No frames, no cracks, no people, no faces, no text, letters, numbers, logos or watermark.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v106-type-plates.png` | 1345142 | `ecb77659b68aa8b9b6b1fa12b94f0dac1a93aac083638904ab3757c1ee6667d9` |
| `assets/v106-type-plates.webp` | 147048 | `0b22fe7fca406a5aa7c89cb26fe5dff1d4a7ffa0ef27d0340c0a94f0a42c88c1` |

## 早报听证会

Scene: the Hearing of the Morning Edition — a tall round hall whose walls are lined with hanging freshly printed blank newspaper sheets, an empty high-backed chair under a high window of pale morning light. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a folded blank newspaper, CENTER an ink roller with a little dark red ink, RIGHT a single loose metal type block lying on its side. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v106-hearing-of-the-morning-edition.png` | 2583538 | `f03477bc1d6a9df2e9987f71c296f9e433400ea1496d914e1b854ba3bd2812c0` |
| `assets/v106-hearing-of-the-morning-edition.webp` | 215152 | `40a07d2d1dbf272569af90cdc3151df432d6575a0539b817cdd355ba50895f6d` |

拼版原图实测方版位置：左 (50, 270, 450)、中 (545, 270, 446)、右 (1037, 270, 449)，写在 `script.js` 的 `TS_SHEET`。
