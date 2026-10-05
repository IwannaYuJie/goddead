# v114 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-06。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 114: "The Locksmith of Forgotten Codes" — the old rooms must be locked for the night, but their locks still carry combinations set by a god who is dead, and nobody remembers them. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 锁匠铺

Scene: the locksmith shop. A cramped workshop with hundreds of old keys hanging on hooks and drawers of lock parts. On a long counter in front, three separate old combination locks LEFT / CENTER / RIGHT with clear space between them: LEFT a heavy iron door lock plate with three blank rotating brass wheels, CENTER a brass cabinet padlock with three blank wheels, RIGHT a small bronze mailbox lock with three blank wheels.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v114-locksmith-shop.png` | 2678863 | `f8ca260776509c3fc6a761597d0f5af40f6d543538ce387b36fd3cb05731c681` |
| `assets/v114-locksmith-shop.webp` | 272032 | `b24f05e81ac6bce16e6f643e148cc7cbd4d5841919ad5353db53e671d4811d34` |

## 试锁台

Scene: a locksmith workbench seen from slightly above. The whole center of the image (from 20 percent to 80 percent of the width and from 15 percent to 85 percent of the height) is an EMPTY dark leather work mat, evenly lit, with nothing on it, so interface lock wheels can be drawn there. Small brass tools, picks and springs lie only along the far left and far right edges.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v114-lock-bench.png` | 3135431 | `e718c8d193011ccd0bb8a21d7a7dd834aa314b4022090f8009ea79a503a2d399` |
| `assets/v114-lock-bench.webp` | 297772 | `8d3a7ad277a6b97940610d93a5877e89742ea08aada320d0b4a0e62e39a643cc` |

## 锁匠听证会

Scene: the Hearing of the Last Lock — a tall round hall with dark banners, a single high window, an empty high-backed chair. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a heavy iron ring holding many keys, CENTER a single old padlock hanging open and unlocked, RIGHT a few keys scattered loosely as if thrown away. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v114-hearing-of-the-last-lock.png` | 2476079 | `d67642d37812379ed3a77c450ddd36d1ccd891570055f77a35f58df3aced28cd` |
| `assets/v114-hearing-of-the-last-lock.webp` | 195348 | `acb595e626cef1ca1ddc11c054631f3e5df5e5b2686380df017de703d3a7c945` |

试锁台的皮垫约占 x 12%–89%、y 8%–89%；`styles.css` 的 `.lk-board` 放在 22%–78% 的中央，转轮与“试一试”都落在皮垫上。
