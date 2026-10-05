# v113 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-06。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 113: "The Room of Cleared Offerings" — the old altars still carry offering plates for a god who is dead; they must be cleared away onto shelves, never setting a larger plate on a smaller one. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber candle light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 撤供房

Scene: the clearing room. A quiet stone pantry with empty shelves and dust sheets. On a long table in front, three separate small untidy stacks of old porcelain and brass offering plates LEFT / CENTER / RIGHT with clear space between them: LEFT a stack beside a tiny red velvet seat cushion, CENTER a stack with a little grey ash on the top plate, RIGHT a stack beside a closed ledger with a black ribbon.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v113-clearing-room.png` | 2731792 | `5c77ce4102d1c5b3955f80bb4b5d215dc17359521a621f660e61b6d84c6b147f` |
| `assets/v113-clearing-room.webp` | 230490 | `98ed7bbe86e6ccabb6524aae0881ab5fb3b615c16b6d5d1d22b2c9fda5b849e2` |

## 供架

Scene: front view of a long dark stone altar table against a plain dark wall, seen straight on at eye level. On the table stand three identical EMPTY round brass plate stands (a flat round base with one short vertical brass spindle), evenly spaced at exactly one quarter, one half and three quarters of the image width, all standing on the same table line at about 72 percent of the image height. Nothing else on the table, no plates. Calm even candle light so interface plates can be drawn over the stands.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v113-offering-stands.png` | 2282901 | `5ea08c80e265a3a7359263b81d5407ed3c42fc16201ebbadc1640b6f9bd822f7` |
| `assets/v113-offering-stands.webp` | 105998 | `5ac0841ad83d9194b91626b97fe507835989e6f7cd175f97e864238adaa530cd` |

## 撤供听证会

Scene: the Hearing of the Last Offering — a tall round hall with dark banners, a single high window, an empty high-backed chair. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a neat tall stack of clean empty plates, CENTER one single plate with a small fresh offering of fruit set apart, RIGHT a plate with old offerings gone cold and grey with dust. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v113-hearing-of-the-last-offering.png` | 2413547 | `88c447cf21c0d36b01d1d312d584f36629018006a42629a3bd840f60f27e7cce` |
| `assets/v113-hearing-of-the-last-offering.webp` | 184528 | `dfa53b2606b5ed38732abb8e6643c5b16bd9ef2943fbd3939360c45d8850aafc` |

供架的三根铜柱用 numpy 实测：x = 393 / 765 / 1139，底盘 y ≈ 717；`styles.css` 的 `.co-post` / `.co-plate` 按此定位（Codex 当时还在把两侧架子往四分之一处挪，取了已满足构图的草稿并停掉了任务）。
