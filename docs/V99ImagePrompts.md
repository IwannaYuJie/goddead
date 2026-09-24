# v99 场景原画提示词

生成方式：本机 Codex CLI（`codex exec`，内置 image generation），2026-09-25。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出；末路听证会一张笔触较碎，quality 84 时 393KB，改用 quality 76（265KB）以守住 300KB 上限。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 99: "Bureau of Roads for the Dead" — the dead cannot find their way out of the old rooms, so an office lays stone road tiles to lead them up, out, or down. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red wax and thread, warm amber lamp light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 引路司

Scene: the bureau. A dim surveyor office. On a long dark table, three large old folded road maps on vellum laid out LEFT / CENTER / RIGHT with clear space between them, each unfolded to show a small square grid of nine hand-drawn stone tiles with faint wandering pathways, each weighted by a brass object: LEFT a small iron door knocker, CENTER a brass rule-board pin, RIGHT a tiny brass pocket watch. Oil lamp, compasses, dividers, rolled maps in pigeonholes behind.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v99-bureau-of-roads.png` | 2821071 | `8a960590154c5ebd15c5961332051a4aa840cd50a659355427783815487096c6` |
| `assets/v99-bureau-of-roads.webp` | 267862 | `cbacbd4744f0ee0140b378fba7d55df20b3453a0f2cd2116f33ccb9db82a3523` |

## 铺路台

Scene: the Road Table viewed from DIRECTLY ABOVE (top-down, orthographic, no perspective): a flat dark slate surface. In the exact center an empty perfectly square recessed tray of dark stone, about 80 percent of the image height tall, completely plain and uniform inside (no tiles, no pattern) so interface tiles can be drawn into it. On the LEFT edge of the tray at mid-height a small glowing arched doorway opening; on the RIGHT side three dark small openings: one at the top-right corner pointing up, one at the right middle pointing right, one at the bottom-right corner pointing down. The rest of the surface around is dark slate with a few scattered brass surveying tools near the outer edges only.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v99-road-table.png` | 2190800 | `8760b6b840d9ecd2c059a031b1545f65591a832f97b2747a0425e85d244e3ca8` |
| `assets/v99-road-table.webp` | 107870 | `9eea262abdbb2c0d32033361cdee528c8db6a61a55c479a872c7701dd4a7d249` |

## 末路听证会

Scene: the Hearing of the Last Road — a tall round hall where many stone roads converge from arched tunnels into the center, an empty high-backed chair on a raised dais. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT an old iron door key, CENTER a single milestone-shaped small stone block, RIGHT a worn leather boot. Solemn and final, warm dim light.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v99-hearing-of-the-last-road.png` | 3271806 | `7e72d4357a04c92d31e67fe6634e910c4187ab065fa0b3bf7a4374542f9f6090` |
| `assets/v99-hearing-of-the-last-road.webp` | 265082 | `d199e44e71ed1087ed1f65f355517afa29604c88532465cb4f9e80ceefbdd3b7` |

铺路台方形凹槽内沿约 x 405–1135、y 125–855；`styles.css` 里 `.rd-table-figure .rd-board` 按此对齐。
