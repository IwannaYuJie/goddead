# v95 场景原画提示词

生成方式：本机 Codex CLI（`codex exec`，内置 image generation），2026-09-24。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。修钟台一图由 Codex 自行迭代了五版（把表盘挪到正中），取第五版；它随后断线重连，任务被手动停止，成品取自 `~/.codex/generated_images`。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 95: "Repair Shop of Stopped Clocks" — when god died every clock stopped at a different hour, and a clockmaker now repairs them one hand at a time. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red wax and thread, warm amber lamp light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore. Clock dials must use only plain tick marks, never numerals.

## 停摆钟修理铺

Scene: the repair shop. A narrow dim clockmaker shop; on the back wall three large stopped clocks hang LEFT / CENTER / RIGHT with clear space between them: LEFT a plain round institutional wall clock with a pale dial (a night-watch office clock), CENTER a clock set into the top of a dark wooden notice board carved with eight blank horizontal ruled lines, RIGHT a small brass mantel clock blackened with incense ash with a few burnt incense stubs beside it. Every clock is missing its hands. A cluttered workbench along the bottom with a loupe, tiny gears and tweezers.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v95-stopped-clock-repair-shop.png` | 2604413 | `bf7dddebcfe57f38163fec8172c35b0fff07cc8feba2ac041d39aaddb95a1731` |
| `assets/v95-stopped-clock-repair-shop.webp` | 221378 | `19aaf638ec542e3bd6e3c723db5463191cb85f5aa478eb51843cfb99a957d6fc` |

## 修钟台

Scene: the Clock Bench — viewed from directly above-front, one very large antique clock dial lies at the exact CENTER of the image, perfectly circular and facing the viewer squarely (not in perspective), about 70 percent of the image height in diameter, pale aged enamel with twelve plain tick marks and NO hands at all, a small brass pivot at the exact center. Around it on dark green baize: loose clock hands, gears, a winding key, a loupe, a candle. Keep the dial plain and evenly lit so an interactive hand can be drawn over it.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v95-clock-bench.png` | 2761760 | `143bcae84d018bc5f280a8fa296aa678ed0a23dcd8ff878ba02f44afd9649636` |
| `assets/v95-clock-bench.webp` | 236404 | `fa5727d55d3c6eaecc3652ea117718695b9768d5cff4dfa3cba4ab83b0b71823` |

## 第十三点听证会

Scene: the Hearing of the Thirteenth Hour — a tall round hearing chamber whose back wall is one enormous clock face with thirteen tick marks instead of twelve, an empty high-backed chair beneath it. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a stopped pocket watch lying open, CENTER an hourglass with its sand paused mid-fall, RIGHT a small brass bell on a stand. Slightly brighter dawn light from high windows, solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v95-hearing-of-the-thirteenth-hour.png` | 2410582 | `85eff59ad8d7f157997493425c796eedba81e67f65bdfed72b9b0030136c866d` |
| `assets/v95-hearing-of-the-thirteenth-hour.webp` | 182146 | `e1f49934480196f57b1ef07b91356c66c637530d5e8eb96d3b4b1742c823e692` |

修钟台表盘在原图中的位置：中心约 (767, 494)，半径约 348 px；`styles.css` 里 `.sc-bench-figure .sc-dial` 按此对齐。
