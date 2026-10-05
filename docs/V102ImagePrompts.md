# v102 候车亭原画 · 提示词与资产台账

2026-10-02。Codex 内置 `image_gen`，每个场景独立生成；新图不覆盖 v101。原图已存 `design-references/source-v102-*.png`，运行图为 `assets/v102-*.webp`。三张实际尺寸均1536×1024，原图和压缩图均目视复核，运行图均<300KB。真实同一Chrome页三图均complete/naturalWidth1536，390×844排班牌视觉与交互已通过。

## 1. 没有天气的候车亭

运行路径：`assets/v102-weatherless-bus-shelter.webp`。源图路径：`design-references/source-v102-weatherless-bus-shelter.png`。

```text
Use case: stylized-concept
Asset type: polished environmental illustration for a literary surreal browser game, GODDEAD chapter 102. Landscape 1536x1024, 3:2.
Primary request: an abandoned stone-and-brass bus shelter where weather has stopped just before arriving. A small roofed waiting pavilion beside an ancient empty road, an empty dark wooden bench and a narrow brass timetable cabinet, translucent suspended raindrops stopping outside the eaves. A few spring-green buds, rust-colored autumn leaves, and tiny silver frost crystals gather quietly at different edges of the shelter, unable to enter. No human figures.
Scene/backdrop: a melancholic old city dissolves into pearl-gray mist; pale dry paving beneath the roof while the distant street is wet. It is neither a normal sunny day nor a normal night. One soft amber lamp keeps the empty bench warm.
Style/medium: painterly cinematic dark-fantasy environmental concept art with tactile old stone, patinated brass, damp wood, nuanced light and detailed atmosphere. Restrained, elegant, haunted but inviting; a believable physical place rather than an abstract collage. Rain gray, moss spring green, faded summer gold, autumn rust, winter silver against charcoal stone.
Composition/framing: wide eye-level establishing shot, full shelter visible and easy to recognize, slightly off-center old timetable cabinet, clear depth down the road; retain details in shadows for a small mobile display. This is background art, not a screenshot or UI mockup.
Constraints: no text, no letters, no digits, no signs with writing, no UI, no buttons, no logos, no watermarks, no people, no gore. No giant clocks or ornate fantasy statues. Fine suspended droplets are subtle, not sparkly magic particles.
```

## 2. 四季排班牌

运行路径：`assets/v102-season-dispatch-board.webp`。源图路径：`design-references/source-v102-season-dispatch-board.png`。

```text
Use case: stylized-concept
Asset type: interactive scene backing illustration for literary surreal browser game GODDEAD chapter 102. Landscape 1536x1024, 3:2.
Primary request: a physical antique brass-and-dark-wood season departure board inside an abandoned stone bus shelter. Near-frontal close view, large single blank charcoal slate recessed in a broad patinated brass frame. The blank slate occupies the central 75 percent width and middle half of image, unobstructed and evenly dark, for separately rendered native HTML timetable slots. Do not paint slots, ticket rectangles, letters, numerals or interface onto the slate.
Scene/backdrop: damp stone alcove, narrow road mist visible at the edges. Around the outer frame only, four subtle seasonal objects: a glass vial with a budding branch and a droplet, a warm amber sunlit ribbon, a curled copper-brown leaf, a small clear glass with silver frost. Tiny brass ticket clips along the outer frame. Everything looks tactile, not floating.
Style/medium: painterly cinematic surreal old-world realism; detailed brass patina, slate scratches, old wood; quiet rain-gray light and restrained seasonal green/gold/rust/silver. The frame is luminous enough to recognize on a mobile screen, center remains clean.
Composition/framing: wide near-frontal symmetrical composition, no extreme perspective, complete board visible. A broad clear uninterrupted dark central backing surface. Lower and upper margins contain small material details but no foreground clutter. This is background art, not a UI mockup.
Constraints: no text, no letters, no digits, no printed timetable, no drawn buttons, no drawn card grids, no interface, no logos, no watermarks, no humans, no gore, no giant clocks. Do not divide the central slate into fake panels.
```

## 3. 四季站台

运行路径：`assets/v102-four-season-platform.webp`。源图路径：`design-references/source-v102-four-season-platform.png`。

```text
Use case: stylized-concept
Asset type: polished environmental illustration for literary surreal browser game GODDEAD chapter 102. Landscape 1536x1024, 3:2.
Primary request: an empty ancient stone platform beside a stopped strange glass-and-brass tram whose four connected passenger compartments hold different seasons. Behind rain-flecked clear windows one compartment has delicate wet spring branches, another holds soft summer-gold air and pale light, another a few drifting copper autumn leaves, and another silver frost and light snow. No people. These are restrained real weather conditions inside a believable old tram, not four neon biomes or a fantasy zoo.
Scene/backdrop: a quiet abandoned tram stop in an old foggy city, wet platform stones, worn brass rails, no readable station signs. The connected carriage extends into pearl-gray mist. A small empty bench or old lamp appears at an edge; the tram and glass weather are the focus.
Style/medium: cinematic painterly dark-fantasy environment, tactile stone/brass/glass, atmospheric realism, restrained spring green, pale summer gold, autumn copper and winter silver. Preserve a sense of melancholy and gently impossible physics without crushing everything to black.
Composition/framing: wide three-quarter side view from the platform, all four windows readable as part of one carriage, generous calm foreground. The picture accompanies a separately rendered order preview and story below; do not draw interface or ticket cards in the image.
Constraints: no text, no letters, no digits, no logos, no watermarks, no UI, no buttons, no humans, no gore, no modern transit branding. Natural nuanced weather, no glowing cartoon icons or hard four-way split of the entire image.
```

## 资产与验收

| 场景 | WebP质量 | 字节数 | 尺寸 |
| --- | --- | --- | --- |
| 候车亭 | 74 | 267178 | 1536×1024 |
| 排班牌 | 82 | 227296 | 1536×1024 |
| 四季站台 | 78 | 283720 | 1536×1024 |

只用Sharp做格式压缩，不改画面、不缩尺寸；候车亭82/78质量超过300KB，取74，站台82超过300KB取78。原图保留。视觉：雨滴止在檐外、空长椅与道路可辨；排班牌中央留白，不含假文字按钮；车厢同属一辆车、四季玻璃与旧城环境清楚，无文字/人物/水印。

SHA256（源PNG / 运行WebP）：

- 候车亭：`d44595cca58d07862734c495175eeb6296b1d37f8f4efb4c05881e6065f89d9b` / `ee955d850160b0ef3a0e6b507e015bb0d7bdaa2ca6930e5a0de941d7a21b800c`。
- 排班牌：`9754ddba864b2b2a2b8350b1ba78fb94971875022cc1c115f9b8829c09394c3d` / `5d5fdbb47e9eb1fa6a6fa4b0441a234d2d08f9de2b7b8c84895abede035c841d`。
- 站台：`882a106f7ec02493d66cc55ef05ee1c678a1e7bd31790f60f03e1bf6dceddacc` / `469033324c6b7bf04b4c7277463e66a4ad5f60be51d668356e3d1f9099168520`。

实际前端已在同一个Chrome页核查：三图完整加载；排班槽居于画中中央石板内部，手机四槽各46.84×44px、无横向溢出，说明及操作位于正常流中。新页顶栏遮挡由Gemini修正并复测。最终截图：`design-qa-evidence/v102-03-board-mobile-final.png`、`v102-04-shelter-desktop-final.png`、`v102-05-board-desktop-final.png`；后两张是独立视角，桌面排班截图为真实向下滚动后的操作区，不把滚出视口的标题称为被遮挡。
