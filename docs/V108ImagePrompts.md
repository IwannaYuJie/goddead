# v108 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-05。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 108: "Office of Borrowed Daylight" — the newspaper of today is printed in color, but the old rooms are too dark to read it, so an office lends them daylight by bouncing it off small mirrors. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light with pale shafts of daylight, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 借光司

Scene: the office. A dim high-ceilinged office with a single tall window letting in a beam of pale morning light full of dust. On a long table, three separate small architectural models of dark rooms LEFT / CENTER / RIGHT with clear space between them, each a closed dark box with one tiny glowing window and many tiny brass mirrors standing on its open roof: LEFT a model of a mail sorting room with pigeonholes, CENTER a model of an office with a long counter, RIGHT a model of a hall with a notice board. Brass mirrors, lenses and dividers scattered at the far edges.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v108-office-of-borrowed-daylight.png` | 2470380 | `6c75b2fdd90f8f625973525ff8dde9174f6394bbd3c8bcea860325a31541128d` |
| `assets/v108-office-of-borrowed-daylight.webp` | 194292 | `f8bb06864d6e2cc6118e9694f35f79703238cc0cb4b0956114ec287e5d96a93d` |

## 镜面地

Scene: viewed from DIRECTLY ABOVE (top-down, orthographic): a square floor of dark polished slate tiles, a perfect 5 by 5 grid of square tiles with thin brass seams, occupying the exact center of the image and about 84 percent of the image height, completely empty (no objects on it). Around the square: darker stone, with faint pale light leaking in at the edges. Calm and even so interface mirrors and a light beam can be drawn over it.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v108-mirror-floor.png` | 2952363 | `186858362ad395a1837b34577d0f83d9b41613ed6c84a3b74e1250336c77b2d0` |
| `assets/v108-mirror-floor.webp` | 222302 | `4d4be9107cf89093de7f51d8bc5ff3823bd1e438a0072cc97322c87dde3f8997` |

## 借光听证会

Scene: the Hearing of Borrowed Light — a tall round hall with many narrow high windows, only one of them letting in a beam of light that falls on an empty high-backed chair. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a small round brass hand mirror standing on a stand, CENTER an unlit glass oil lamp, RIGHT a closed wooden window shutter lying flat. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v108-hearing-of-borrowed-light.png` | 2427121 | `caad53ac8475fb8e5e3f85e61e8e77332311047e2cb4964083c83b2c3f5022c9` |
| `assets/v108-hearing-of-borrowed-light.webp` | 185010 | `97190349aae073850a7e5c042fe872acaff24d0199011298739e3799ae792f77` |

镜面地的铜线方格用 numpy 实测：竖线 x = 335 → 1200、横线 y = 78 → 943（每格约 173px）；`styles.css` 的 `.lb-board` 按此定位，窄屏裁成 4:3 后重算为 left 17.82% / width 64.32%。
