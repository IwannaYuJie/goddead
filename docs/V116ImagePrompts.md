# v116 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-06。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 116: "The Dream Mender" — the dead have gone to sleep, but their dreams have come apart at the seams; a mender sews each dream back by joining matching knots with threads that never cross. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber candle light with a faint pale dream glow, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 缝梦铺

Scene: the dream mender's shop. A small night workshop with spools of colored thread on the walls and a candle. On a long table in front, three separate small round wooden embroidery hoops LEFT / CENTER / RIGHT with clear space between them, each holding a torn piece of pale cloth with a few loose colored knots: LEFT the cloth shows a faint doorway, CENTER a faint lantern, RIGHT a faint closed ledger.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v116-dream-menders.png` | 2707946 | `534ff625136d4764eda091daba8d06d826d10c6b91559f7921d04f879aa3cad1` |
| `assets/v116-dream-menders.webp` | 264010 | `256945b1fb3eddb33546b6b8e8d0167133e6a85160dda4b4c81fda2eb92e2709` |

## 绷梦架

Scene: viewed from DIRECTLY ABOVE (top-down, orthographic): one large square wooden embroidery frame lying on a dark table, holding a plain stretched pale linen cloth with nothing on it, the frame centered in the image and about 84 percent of the image height, the cloth evenly lit. A few spools of thread and a needle lie only at the far left and far right edges of the table.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v116-dream-frame.png` | 3118588 | `cd8db3b325ed17687edf95df9e6298e424f49633325602c9b67be4e6fdd8dffd` |
| `assets/v116-dream-frame.webp` | 296100 | `fbe92f485500b02c0d2794f885cef65e5cff1fd00cc20c3dc9b2a36ca7bb2777` |

## 末梦听证会

Scene: the Hearing of the Last Dream — a tall round hall with dark banners, a single high window, an empty high-backed chair. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a finished embroidery hoop with neatly sewn colored threads, CENTER a single spool of pale thread with a needle stuck in it set apart, RIGHT a loose tangle of colored threads drifting off the table edge. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v116-hearing-of-the-last-dream.png` | 2369467 | `ed48a0d36e16180d8c9665859d37001cc35f41681b612d6c4fe9206fb438fe68` |
| `assets/v116-hearing-of-the-last-dream.webp` | 198776 | `f35069412e80591e99b81c51bcf9bae8bdb68a26de95a1431b11ca1acd7a5bf6` |

绷梦架的亚麻布用 numpy 实测亮区（x 385→1151、y 125→833）并按布边放宽到 x 372→1170、y 110→855；`styles.css` 的 `.dm-board` 按此定位，窄屏裁成 4:3 后重算为 left 20.54% / width 59.38%。
