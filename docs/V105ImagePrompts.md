# v105 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-05。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 105: "Breakfast Shop of Yesterday" — after the hotel guests finally woke, the only breakfast shop left sells nothing but yesterday breakfast, and serves it only in the order it was eaten yesterday. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light mixed with pale grey dawn, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 只出售昨日的早餐铺

Scene: the shop. A narrow old breakfast shop at grey dawn, steam rising from a large covered rice-porridge pot and bamboo steamers behind a worn wooden counter. On the counter three paper order slips are pinned under three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT under a dented tin night-shift lunch box, CENTER under a brass rubber stamp, RIGHT under a small porcelain tea cup with a gold rim. The slips are grease-stained and blank.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v105-yesterday-breakfast-shop.png` | 2816714 | `fb6ca25e495cf8c1c287fb3c13d960d86903612571f0255c4cc26502632fdf7a` |
| `assets/v105-yesterday-breakfast-shop.webp` | 271108 | `99f10e46d62538842bbf46a73a468935e646e69e890ece906167b24f048336a5` |

## 出餐台

Scene: the serving counter seen from the front and slightly above: a long dark wooden counter running across the image, and on it SIX separate breakfast items in ONE straight evenly spaced horizontal row across the middle of the image, with clear empty space between each: (1) a white bowl of rice porridge, (2) a bamboo steamer with three steamed buns, (3) a glass of soy milk, (4) a plate with two fried dough sticks, (5) a small dish with a halved salted duck egg, (6) a porcelain cup of tea. Each item sits on its own small round brass plate. Keep the top quarter and the bottom quarter of the image calm and dark.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v105-breakfast-counter.png` | 2192591 | `9d5aa16969da674b127a39eb1f3e2f7b257d5dfec4fa2c2ea18abcfa735a7487` |
| `assets/v105-breakfast-counter.webp` | 127352 | `6a70328463640e6fb6be5831d19ad0ed3072b12aa8e098a0e223f5a8d2e68fdc` |

## 昨日账单听证会

Scene: the Hearing of Yesterday Bill — a tall round hall with long empty breakfast tables arranged in a ring, an empty high-backed chair at the far end beneath a tall window of grey dawn. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a covered porcelain bowl, CENTER a long paper bill spike with blank slips, RIGHT a brass shop bell. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v105-hearing-of-yesterdays-bill.png` | 2548948 | `2687cb5c93b148c34012fb2c868ac1a80ee4a813c15dccf8c314156a0ba2c83a` |
| `assets/v105-hearing-of-yesterdays-bill.webp` | 209114 | `a9f01c4b0bc57c52eb64f39bd340dc05a48bef4f4ca5199bfa0feb3186b400e9` |

出餐台六样早餐在原图中的位置见 `styles.css` 的 `.yb-dish-*`。
