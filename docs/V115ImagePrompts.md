# v115 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-06。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 115: "The Linen Room" — the doors are locked for the night and the dead are going to bed; the old quilts and blankets of three rooms must be folded and packed into linen chests, filling each chest exactly. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 被柜房

Scene: the linen room. A quiet room with tall shelves of folded linen and a warm lamp. On a long table in front, three separate small bundles of folded old fabric tied with string LEFT / CENTER / RIGHT with clear space between them: LEFT a bundle of worn grey wool blankets, CENTER a bundle of dark red felt blankets with a little brass plug charm tied to the string, RIGHT a bundle of heavy dark velvet curtains with gold fringe.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v115-linen-room.png` | 2670297 | `182bc41e66795d4154f167c2cb95ceb7a5ab3ca16b9a7f0408a0e7d136378334` |
| `assets/v115-linen-room.webp` | 252260 | `08c254f82ecd3218189148c10b2aaa75abc710c56bab84380c00182b66c3539a` |

## 叠被处

Scene: viewed from DIRECTLY ABOVE (top-down, orthographic): a wide plain floor of dark smooth wooden boards in a linen room, evenly lit by warm lamp light from above. The whole center of the image (from 15 percent to 85 percent of the width and from 10 percent to 90 percent of the height) is EMPTY plain floor with nothing on it, so interface chest compartments and folded quilts can be drawn there. A few loose threads and a brass thimble lie only at the very edges.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v115-folding-floor.png` | 2480781 | `19169e7cc918655f01a7ecd8ebee13de54885f600639fea534d5ec569dc0b341` |
| `assets/v115-folding-floor.webp` | 190944 | `ce03b3d3e1aa7aa29208b1771c3a35d534e586888e905f5b64d4fe8828f11bb6` |

## 收被听证会

Scene: the Hearing of the Last Quilt — a tall round hall with dark banners, a single high window, an empty high-backed chair. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a closed wooden linen chest neatly packed with a folded edge showing, CENTER one single folded quilt set apart on a small stool, RIGHT a quilt hung over a line airing in a draft. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v115-hearing-of-the-last-quilt.png` | 2642208 | `138374ac09e53cc58f2dfb05e5d0088bc589ad628c6490ddae1d8279c9975a2e` |
| `assets/v115-hearing-of-the-last-quilt.webp` | 231488 | `180f2fa1112e34bb2f3a5110a2d908263b1143cf8ae8b2275da1cdc9e1b3bb08` |

叠被处只是一片空木地板，柜子由界面画在正中（四行高，宽 4 / 5 / 6 列随柜子形状变化）。
