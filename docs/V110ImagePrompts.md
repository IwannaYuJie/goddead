# v110 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-06。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 110: "The Sweeping Office" — the tea is drunk and the rooms are closing for the night; an office of sweepers must sweep the dust and ash of three old rooms, every tile exactly once, without stepping on what is already swept. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light, drifting dust motes, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 扫尘司

Scene: the sweeping office. A narrow storeroom with many old brooms and dustpans hanging on the stone wall and a lamp. On a long table in front, three separate small brass dustpans LEFT / CENTER / RIGHT with clear space between them, each holding a different small heap: LEFT a little heap of gold dust next to a tiny worn red velvet cushion, CENTER a heap of grey ash with a few embers, RIGHT a heap of black soot next to a small unlit lantern.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v110-sweeping-office.png` | 2749387 | `696015d05bc9c4a4f8e90a27ff093063d1c4faaab98d66fe9b87b8effa22414f` |
| `assets/v110-sweeping-office.webp` | 263266 | `1abf6ba4d2fc2f5b4313ae70b74bf8f312059778d61dd9181dc11b72e69218f6` |

## 落灰地

Scene: viewed from DIRECTLY ABOVE (top-down, orthographic): a square floor of pale worn stone tiles evenly covered with a thin layer of grey dust, a perfect 5 by 5 grid of square tiles with thin dark seams, occupying the exact center of the image and about 84 percent of the image height, completely empty (no objects, no footprints). Around the square: darker stone with faint warm lamp light at the edges. Calm and even so interface marks can be drawn over it.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v110-dust-floor.png` | 3080565 | `d8a4ae111dba84f4d1dbe1d9dfc4006ec00bbff87e15fbd6114a3b08ab234c07` |
| `assets/v110-dust-floor.webp` | 284054 | `ab819f35f08555c481b0bab0bdd16e3a88124f8e106ab1c43962f85ccd1fcd25` |

## 扫净听证会

Scene: the Hearing of the Swept Floor — a tall round hall with dark banners, a single high window, an empty high-backed chair with dust on its seat. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT an old broom lying on the table, CENTER a small square tray of fine grey dust with one single bare footprint pressed into it, RIGHT an hourglass whose sand is grey dust slowly settling. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v110-hearing-of-the-swept-floor.png` | 2195637 | `8ba639d993d29aaa2e91a6e2de3793e8777fa7f1b79dd65fe93d6e50cfd4a91a` |
| `assets/v110-hearing-of-the-swept-floor.webp` | 165522 | `ccd760acd74f556d945e8ae99a27ed3185a86c262a578d1d66808889b3c181d6` |

落灰地的砖缝用 numpy 实测：竖缝 x = 322 → 1212、横缝 y = 80 → 955（每格约 176px）；`styles.css` 的 `.sw-board` 按此定位，窄屏裁成 4:3 后重算为 left 16.82% / width 66.22%。
