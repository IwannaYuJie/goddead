# v111 场景原画提示词

生成方式：本机 Codex CLI（`codex-cli 0.160.0`，`codex exec`，内置 image generation），2026-10-06。源 PNG 1536×1024 存于 `design-references/`，运行时 WebP 由 Pillow 以 quality 84 / method 6 转出。

## 通用要求

Original 1536x1024 landscape environment art for the browser game GODDEAD, chapter 111: "The Office of Putting Back" — the floors are swept, and now the heavy furniture that was moved must be pushed back onto the pale worn marks it left on the floor over the years. Style must match earlier chapters: atmospheric dark-fantasy oil painting, charcoal black stone, antique brass, old vellum, dark red, warm amber lamp light, legible mid-tones (not pitch black). Landscape 3:2, clear separated focal objects. No people, no hands, no faces, no readable text, letters, numbers, logos, watermark, UI, frames or diagrams. No gore.

## 归位司

Scene: the office of putting back. A quiet back office with old floor plans pinned on the walls (no readable text) and a lamp. On a long table in front, three separate miniature wooden furniture models LEFT / CENTER / RIGHT with clear space between them, each standing on a small pale chalk outline: LEFT a tiny tall reliquary cabinet with brass corners, CENTER a tiny switchboard operator stool with brass plugs hanging from it, RIGHT a tiny long corridor bench.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v111-putting-back-office.png` | 2498367 | `fd2099a1cad8553d0de9c05bb45860b6c7a02a1b7c7639062d0cc21343dbe14b` |
| `assets/v111-putting-back-office.webp` | 221090 | `77887e82cc751a79ee58ada63e0ce6beec1f26017770b37ff05703cb1fa2733a` |

## 印痕地

Scene: viewed from DIRECTLY ABOVE (top-down, orthographic): a square floor of dark old wooden planks divided into a perfect 5 by 5 grid of square tiles by thin brass inlay lines, occupying the exact center of the image and about 84 percent of the image height, completely empty (no objects, no marks). Around the square: darker stone with faint warm lamp light at the edges. Calm and even so interface furniture and marks can be drawn over it.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v111-marked-floor.png` | 2856104 | `87abc35b61ae8b648aacf6855a2076d80d426e4190568040ae899226c2d7cfb8` |
| `assets/v111-marked-floor.webp` | 219490 | `1d5b81be22c41a984256213d3cd81eafc8c1dbfe41cd499ef87dfe4592c505b1` |

## 归位听证会

Scene: the Hearing of the Last Mark — a tall round hall with dark banners, a single high window, an empty high-backed chair standing slightly off its pale worn outline on the floor. In the foreground on a long dark table, three separate objects LEFT / CENTER / RIGHT with clear space between them: LEFT a small wooden cabinet standing exactly inside a chalk outline, CENTER a small chair model pushed askew outside its outline, RIGHT a faint pale worn rectangular mark on the wood with nothing standing on it. Solemn and final.

| 文件 | 字节 | sha256 |
| --- | ---: | --- |
| `design-references/source-v111-hearing-of-the-last-mark.png` | 2608068 | `d0fb4be6b4c6957b73f9c38fbbac8a5274b09c3aa31e73bb51ab311a7da20917` |
| `assets/v111-hearing-of-the-last-mark.webp` | 217720 | `fad834f39ee4c13b17624886166189fb01bacdc57370b30f7ce1a042aa2a9b0f` |

印痕地的铜线用 numpy 实测：竖线 x = 335 → 1200、横线 y = 86 → 945（每格约 173px）；`styles.css` 的 `.pb-board` 按此定位，窄屏裁成 4:3 后重算为 left 17.78% / width 64.36%。
