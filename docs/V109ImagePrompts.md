# v109 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-06。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 109: "The Exact Tea House" — after the dark rooms were lit and the dead finished reading the paper, each of them wants one cup of tea, but exactly so much and not one sip more. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light with soft steam, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 分茶铺

Scene: the tea house. A small old tea house with dark wooden shelves of tea jars and a warm lamp. On a long counter in front, three separate small lacquered trays LEFT / CENTER / RIGHT with clear space between them, each holding one EMPTY teacup and a folded blank paper order slip: LEFT a tiny thimble-sized cup, CENTER a medium cup, RIGHT a large wide tea bowl.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v109-exact-tea-house.png` | 2448616 | `850c6d20023746c9078e153e61e585a06f850ba50ebadb3a529c89918452bfe6` |
| `assets/v109-exact-tea-house.webp` | 214914 | `1d2f3832039c7d2eb61bd4121be4110aacb0e2a1912bcee9aef6ae2bd7ecb565` |

## 分茶台

Scene: the pouring table, seen from slightly above. A long dark wooden table filling the image. At the far LEFT a large black iron kettle with soft steam. At the far RIGHT edge a small copper drain basin. The whole CENTER of the table (from 25 percent to 85 percent of the width) is an EMPTY, clean, evenly lit wooden surface with nothing on it, so interface vessels can be drawn there. Keep the bottom fifth calm and dark.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v109-pouring-table.png` | 2472796 | `788fc4171b07a85772982d6f01154a86ccd0cf0f5b7f54375dea51aaf7871cf5` |
| `assets/v109-pouring-table.webp` | 197310 | `5a3557034cf7148cd8fdb805d4431cca2f85fa22b9d3d97ecc1366f9e852395a` |

## 末杯听证会

Scene: the Hearing of the Last Cup — a tall round hall with dark banners, a single high window, an empty high-backed chair. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a full teapot with steam, CENTER a single small cup of tea set apart on a saucer, RIGHT a cup of cold tea with a dry leaf floating on it and no steam. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v109-hearing-of-the-last-cup.png` | 2333188 | `5fc741d7eb0e26274bc31e235d159b30bbf542705917cd31f5ec0341cdd53592` |
| `assets/v109-hearing-of-the-last-cup.webp` | 167934 | `60e4f2d3c9123a26ad432b812c7117c85e655d2e9b0fcae732d56ec3be5282d8` |

分茶台桌面中间约 25%–85% 宽是空的，`styles.css` 的 `.et-rack` 把三只量器画在 left 25% / right 15% / top 20% / bottom 25% 之间，量器高度按容量（满 11 口）缩放。
