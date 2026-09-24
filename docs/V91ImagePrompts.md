# v91 原画生成记录

2026-09-22；Codex 内置 imagegen，三次独立新图生成，无输入参考图、无 CLI/API fallback。用于本项目，已复制到 assets，尚未接入网页。全部 1536×1024；WebP 仅以 Sharp quality84 进行格式压缩，无裁剪或重绘。

## 1. 倒生原因助产院

- PNG：`assets/source-v91-late-cause-maternity-ward.png`
- PNG SHA-256：`90210f307f2d2d804bd8f8ea86a28ea993cb74ccbc1df5b5ef3cba3a010d1acd`
- WebP：`assets/v91-late-cause-maternity-ward.webp`，243398 bytes
- WebP SHA-256：`99e5b2aef175bd1ba31f27c0fc24eb9bc7997a2085fec4228c0be35b5b2df07b`

实际提交的完整 prompt：

```text
Use case: stylized-concept. Asset type: original 1536x1024 landscape environment art for an existing Chinese surreal philosophical gothic interactive browser game called GODDEAD, chapter 91. Primary request: 'Maternity Ward for Causes Born After Their Consequences'. A deserted stone bureaucratic maternity hall, NO people and NO babies: three antique brass archival bassinets stand on a shallow reflecting black floor beneath huge cathedral arches. Inside the first cradle a miniature wooden doorway is growing backward from its ancient shadow; inside the second a thin luminous gold seam floats over folded ivory cloth, suggesting a scar waiting for its cause, not flesh; the third holds unburnt matchsticks emerging from a pile of cold ash. Thin warm golden filaments travel from the old monumental architecture into these small newborn objects. Tiny blank paper birth tags tied with dark red thread, no readable writing. A tall broken clock behind them has a circular blank face without numerals. Style: exquisite atmospheric dark-fantasy oil painting with tactile cinematic realism, antique brass, charcoal stone, old vellum, restrained bronze and pale amber light, subtle dusty blue ambient shadows. Composition: landscape 3:2, clear distinctive silhouettes clustered across lower middle, deep receding central corridor, generous quiet dark negative space near upper left for webpage text overlays, painterly detail but calm coherent focal hierarchy. The cradles must feel both tender and uncanny, like reality carefully raising the reason for something that already happened. No hospital medical equipment, no gore, no skin, no human anatomy, no characters, no typography, no logos, no watermark, no UI or diagram.
```

## 2. 出生先后登记室

- PNG：`assets/source-v91-reverse-birth-order-registry.png`
- PNG SHA-256：`d0be847b0ea2305bbb64888350166049f532748076d62bed90fadbdd83c69fd1`
- WebP：`assets/v91-reverse-birth-order-registry.webp`，188154 bytes
- WebP SHA-256：`d796fb8dd47c34a1f58dae558ef29b5ab2a899580a41e72bdeffc4662d5747a8`

实际提交的完整 prompt：

```text
Use case: stylized-concept. Asset type: 1536x1024 landscape original environment illustration for GODDEAD, a surreal philosophical gothic browser game, chapter 'Birth-Order Registry'. An intimate deserted antique record office inside a massive soot-dark stone cathedral. A long worn walnut registry desk in foreground holds exactly three freestanding upright bronze document frames in three parallel grooves, almost like carefully movable old library card holders; first encloses an unlit wooden match, second a little mound of pale cold ash, third an empty small round witness mirror. The three objects are connected by a single elegant thin golden thread that loops impossibly backward above the table, casting different-age shadows. No text on the frames. Behind the desk hang long blank vellum family charts with lines that curve upward and downward but have no words. One green-black brass desk lamp softly lights blank papers and a vermilion seal, with a high moonlit narrow window. Style: painterly cinematic antique oil painting, exquisite tactile dark wood, oxidized bronze, bone-white vellum, muted amber and dusty blue light, quiet existential tenderness, physically coherent perspective. Composition: 3:2 landscape, clear three-object relationship in lower middle, generous calm dark upper-left space for website text overlay, not cluttered. A believable place where someone can rearrange what happened first. NO readable letters, numerals, typography, UI, logos, watermark, humans, babies, gore, medical instruments, futuristic screens, neon.
```

## 3. 第一因监护法庭

- PNG：`assets/source-v91-first-cause-custody-court.png`
- PNG SHA-256：`90513461cfb8d6d611eee2a6edc5d0a387e9bce5cec8754d50c4ddbdcf764e5f`
- WebP：`assets/v91-first-cause-custody-court.webp`，278266 bytes
- WebP SHA-256：`5ce5fe02e4141942b697f6c4f07bd8c69966099f90f518a05ce1f515a8b3d179`

实际提交的完整 prompt：

```text
Use case: stylized-concept. Asset type: original 1536x1024 landscape scene artwork for GODDEAD surreal gothic philosophical browser game, 'First Cause Custody Court'. A vast deserted old stone courtroom shaped like the inside of a family tree, no people. At the centre a delicate living tree of dark bronze and warm translucent golden leaves levitates above an empty shallow cradle-shaped bowl: its lowest trunk ends cleanly in midair with NO roots, while high branches bend back down to gently support that trunk, a quietly impossible self-parenting structure. Three mismatched empty antique guardian chairs surround it at a respectful distance. Behind them a monumental semicircular wall of blank parchment family charts and uncarved name plaques, tall cathedral openings show a pale predawn sky. Lower foreground a warm-lit empty judge's desk with three small blank birth certificates, no gavel emphasis. Cinematic painterly dark-fantasy oil artwork, weathered charcoal stone, oxidized bronze, ivory vellum, restrained amber-gold light, subtle cool blue ambience. Emotional tone: tender, unsettling, contemplative, a court deciding whether anything has to be first in order to be real. Wide 3:2 composition, tree strong clear silhouette right-of-centre, gentle negative space upper-left, readable major forms, no clutter. Distinct scene from a nursery or office. No humans, babies, skeletons, blood, bodies, medical instruments, readable text, letters, numerals, logos, watermark, UI, modern screens, neon.
```

## 视觉复核

已查看三次生成结果：各自核心物件清晰，场景不同，气质一致，无文字/水印、无血肉或医疗图像。WebP 尺寸与源图一致。未做前端叠字、裁切、移动端或实际加载验收；这些属于 v91 实现后的门禁。
