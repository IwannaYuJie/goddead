# v101 场景原画 · 生成记录

2026-10-02；Codex内置imagegen，三次独立生成，无参考图、无CLI fallback。全部1536×1024。源PNG保存在design-references，运行WebP以Sharp格式压缩，无裁剪/重绘。三张逐一查看，织造厂物件、织机中央留白、露台晾杆成立，无可读文字、水印、UI或人体。织机WebP另经视觉检查，纹理清楚。Gemini已完成HTML叠层，Computer Use实看三个场景与390×844布局，资源均加载成功；织机手机状态条遮挡经Gemini调整后复验通过。截图与范围见`design-qa-evidence/v101-computer-use-20261002.md`。

| 场景 | 源PNG / WebP文件名 | WebP bytes / quality |
| --- | --- | --- |
| 厂房 | `source-v101-dawn-weaving-mill.png` / `v101-dawn-weaving-mill.webp` | 257974 / 82 |
| 织机 | `source-v101-day-night-loom.png` / `v101-day-night-loom.webp` | 254844 / 78 |
| 露台 | `source-v101-sky-cloth-drying-terrace.png` / `v101-sky-cloth-drying-terrace.webp` | 219622 / 82 |

源图SHA-256（同上顺序）：

```text
1625d1d5e257a2979aa87a06d5a6a974647e43f04768da0978253013df336552
45935e0e1e276167119ffa1de6eec99b7c26e8e59b97f834a86dcaab59b72403
e1403b79254a7a9f1de6d9e3db427b509c1c057a4d660b00bd7fb8226d833cd4
```

WebP SHA-256（同上顺序）：

```text
d1e35bf329ea872a474e0a401d9246e98a4c2606d07fb2d7a17d9a9d0cb2e7d7
085844d08e00ba5cc29282eeabb24af20cfe0f9b782d52b50cda41d1b7cfdad9
3da53651c3df44c55072e65a2d6ab09f0c11fe49cd5e64b17ff937588c991820
```

## 厂房 · 实际完整prompt

```text
Use case: stylized-concept. Asset type: original 1536x1024 landscape environment artwork for Chinese surreal gothic philosophical browser game GODDEAD, chapter101 Dawn Weaving Mill. A deserted old weaving mill inside a tall weathered stone cathedral, no people. A magnificent wooden and oxidized brass handloom stands right of centre beneath arches. Two large distinct thread spools beside it: one warm luminous pale-gold dawn thread, one deep indigo night thread with fine silvery strands. A long unfinished woven cloth cascades from the loom onto worn floor stones and disappears beneath a cracked wooden doorway, like a strip of morning pulled out from under a door. Tall windows show grey dawn with no sun. Small dark red thread ties, antique shears, dust, tactile aged wood and bronze, physically coherent loom construction. Mood quiet tender and eerie, reality is weaving a sky from things left unsaid at night. Atmospheric dark fantasy oil painting with cinematic painterly realism, charcoal stone, antique brass, bone ivory, restrained warm amber and dusty blue light; legible middle tones and material detail, not pitch black. 3:2 landscape, calm dark upper-left negative space for website copy, distinct uncluttered loom silhouette lower-right, deep architecture. No faces, people, hands, readable text, numerals, letters, logos, watermark, UI, computer screens, diagrams, gore.
```

## 织机 · 实际完整prompt

```text
Use case: stylized-concept. Asset type: 1536x1024 original landscape game environment art, GODDEAD chapter101 'Day and Night Loom', usable interactive puzzle backdrop. A close almost top-down view of an antique brass-and-dark-walnut handloom work surface. The central rectangular weaving bed, about sixty percent of image width and sixty-five percent height, is one clean entirely empty very dark blue-black cloth surface with subtle fabric texture: NO grid, NO lines, NO panels, NO controls in that centre; native HTML nine-grid puzzle will overlay it. Only along the outer LEFT edge, warm pale golden threads enter from an old ivory spool and small brass comb. Along the outer RIGHT edge deep indigo threads with silvery fibres are coiled beside a dark spool and narrow shuttle. Bottom edge a worn wooden beam and tiny dark red thread knots; top edge subtle bronze mechanism and dusty lamplight. No words. The scene is physically coherent and intimate, a real loom capable of weaving a sky. Atmospheric gothic dark-fantasy oil painting, painterly cinematic realism, tactile aged bronze, walnut wood and fibres, warm amber candle accents contrasting cool night-blue ambient light, legible midtones. Landscape3:2, horizontal aligned central bed with very low perspective distortion for clean interactive overlay. Centre must stay calm blank dark fabric; no prepainted buttons or3x3symbols. No people, hands, faces, readable text, letters, numbers, logos, watermark, interface, diagram, modern electronics, gore.
```

## 露台 · 实际完整prompt

```text
Use case: stylized-concept. Asset type: original1536x1024 landscape environment artwork for surreal philosophical gothic browser game GODDEAD chapter101 'Sky Cloth Drying Terrace'. A deserted old stone roof terrace above cathedral ruins and distant rooftops. In foreground a long weathered brass drying rail spans the scene, with two empty dark-red thread clips suspended near the ends; its centre and the quiet sky immediately below the rail are wide EMPTY negative space for a native HTML wovencloth preview overlay. A few loose golden and indigo threads curl gently from the rail ends; do NOT paint a cloth panel in the central opening. Left horizon softly warms with pale amber morning mist, right horizon deep blue night with faint silverstars; the two atmospheres blend naturally across the sky rather than a split-screen line. One antique wicker laundrybasket with folded dark and ivory fabric sits in the far lower-right corner, old stone parapet alongbottom. No people. Mood tranquil, uncanny and hopeful: daytime and nighttime have become fabrics that can hang side-by-side. Gothic dark-fantasy oil painting, tactile charcoalstone, oxidized brass, restrained gold and indigo palette, cinematic painterly realism, luminous legible mids, soft atmospheric depth. Landscape3:2, simple coherent composition, rail centre around30percent down image, calm central60percent for overlay. No readabletext, letters, numbers, logos, watermark, UI, diagrams, modern cityobjects, bodies, hands, faces, gore.
```
