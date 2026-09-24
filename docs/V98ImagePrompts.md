# v98 场景原画提示词

生成方式：本机 Codex CLI（`codex exec`，内置 image generation），2026-09-24。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 98: "Vigil of Nine Candles" — the dead keep vigil for a dead god on square iron candle stands of nine candles each, lighting and snuffing them in patterns. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red wax and thread, warm amber light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 守夜厅

Scene: the vigil hall. A long dark chapel-like hall; along a stone ledge stand three square black iron candle stands LEFT / CENTER / RIGHT with clear space between them, each holding nine white candles in a neat 3 by 3 grid. LEFT stand: only the three candles on one diagonal are lit. CENTER stand: only the four corner candles are lit. RIGHT stand: only the single middle candle is lit. All other candles are unlit with thin smoke.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v98-vigil-candle-hall.png` | 2101335 | `5392b83fed8ee879fddb98428da1adc440ea9b569a56b6ba3bddde19e0140a96` |
| `assets/v98-vigil-candle-hall.webp` | 142400 | `5a66cf851549be9fff3e5d647a5cba5790adb80a5672e9666b60fbf13ec92266` |

## 守夜台

Scene: the candle board — viewed straight on from the front and slightly above, one large square black iron tray at the exact CENTER of the image holding nine thick white candles in a perfectly regular 3 by 3 grid with equal spacing, ALL NINE UNLIT (no flames at all, clean wicks), the grid spanning about 60 percent of the image height. Plain dark stone background, soft warm ambient light, calm and uncluttered so glowing flames can be drawn over the wicks by the interface.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v98-candle-board.png` | 2313949 | `25d5f3e621629e4ae370f8ceeedd3919dca57363ca0613d7618c2dc1a25ea844` |
| `assets/v98-candle-board.webp` | 136162 | `faecc3a89322585a26fa7c27822aa2afa8168720cf84dbdfefae961c0b4ac5aa` |

## 未点之灯听证会

Scene: the Hearing of the Unlit — a tall round hall lit only by hundreds of tiny candles in wall niches, an empty high-backed chair beneath a great dark iron chandelier with all its candles unlit. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a single lit candle in a brass holder, CENTER a brass candle snuffer lying on its side, RIGHT an old iron lantern with its small door open. Solemn and final, warm dim light.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v98-hearing-of-the-unlit.png` | 2070542 | `68caab06e9728a2cda044dd458ee1cfa84d5d5441af4096c4c2b226beabf480f` |
| `assets/v98-hearing-of-the-unlit.webp` | 127504 | `873bca4108d406f6a7c409133b4c2c05c184a321c24deeaa2f2ff9f1476023de` |

守夜厅成图中左架只点亮了对角两端（0、8），游戏数据已改为与图一致。守夜台九根烛芯在原图中的位置见 `styles.css` 的 `#vc-candle-0…8`。
