# v112 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-06。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 112: "The Paper-Cut Shop" — the old rooms are clean and in order again, and the dead want a red paper-cut for each window and door, cut exactly to an old pattern. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, deep red paper, warm amber lamp light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 剪纸铺

Scene: the paper-cut shop. A small shop with stacks of red paper, brass scissors and finished red paper-cuts pinned on strings along the wall. On a long counter in front, three separate square red paper-cuts lying flat LEFT / CENTER / RIGHT with clear space between them: LEFT a paper-cut shaped like a small arched door, CENTER a paper-cut shaped like a round lantern, RIGHT a paper-cut shaped like a sealed envelope.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v112-paper-cut-shop.png` | 2581655 | `5996d676d64d0211d11678c7108cd65bc7e8b86b13cf647ee72770c070440007` |
| `assets/v112-paper-cut-shop.webp` | 229146 | `d890495647a730086027be0174fd351beb4a60477b88f1cc43d1b1239aa9e4a4` |

## 剪纸台

Scene: viewed from DIRECTLY ABOVE (top-down, orthographic): a dark wooden cutting table. In the exact center lies one single perfectly square sheet of plain uncut deep red paper, flat and evenly lit, occupying about 60 percent of the image height, with no pattern, no folds and nothing on it. A pair of brass scissors lies at the far right edge and a few red paper scraps at the far left edge; the wood immediately above and to the left of the sheet is plain and empty.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v112-cutting-table.png` | 2562581 | `fa04ace430cb1d26f8455613a04428d848e6c655b06f4645bc6e8dbfb709b793` |
| `assets/v112-cutting-table.webp` | 199114 | `8399702350f7b533e2ca038cb0730a4cd55b2772f4831554a868b36cbce93cb6` |

## 窗花听证会

Scene: the Hearing of the Paper Flower — a tall round hall with dark banners, a single high window, an empty high-backed chair. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a small wooden window frame with a red paper-cut pasted on its pane, CENTER a single blank sheet of white paper with a pair of scissors beside it, RIGHT a red paper-cut lifting off the table in a draft of wind with a few small red scraps flying. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v112-hearing-of-the-paper-flower.png` | 2171101 | `6a08a8d0e9c1ca1f1c690921a7bb8b4c0717dfbf480809d812a66fc72989db0e` |
| `assets/v112-hearing-of-the-paper-flower.webp` | 150436 | `006103d1f588dd1a2c00050b54138a475b15b0c3177560824eeaaa88a141b7b1` |

剪纸台的红纸用 numpy 实测：x = 477 → 1058、y = 223 → 792；`styles.css` 的 `.pc-board` 按此定位（Codex 当时还在微调红纸的上下居中，取了已满足构图的那一版并停掉了任务）。窄屏把图裁成正方形、宽放大到 191.6%，红纸落在 left 20% / top 20% / 72.5% × 71%，七乘七的格子约 35px。
