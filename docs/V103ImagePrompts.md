# v103 照相馆原画和提示词

2026-10-02。本章由 Codex 内置 image_gen 生图，非外部协作模型生成、非 CLI fallback。三张独立环境图已保存源PNG和运行WebP，供 Gemini 前端叠加确定性站位、影子与两次曝光；原图没有 UI、字样或结局结果。源图及压缩图逐张看过，三个真实场景也在同一Chrome页加载，均complete且naturalWidth为1536。四类真实叠印、桌面和390×844已实玩；手机白板标签越界及跨类型挤碰交回同模型修正后通过实际bbox和原生截图核验，详情见本章QA记录。

## 收不到影子的照相馆

源图 `design-references/source-v103-shadowless-photo-studio.png`，运行图 `assets/v103-shadowless-photo-studio.webp`。

```text
Use case: stylized-concept. Asset type: 3:2 landscape environment illustration for an atmospheric Chinese browser exploration game, 1536 by 1024 composition.
An old portrait photography studio that cannot receive its visitors' shadows. The visitor is absent; an empty worn velvet chair carefully placed before an ivory muslin backdrop. An antique wooden bellows camera in the near foreground pointing at the chair. Floor beneath the chair strangely clean and shadowless although one side lamp visibly lit.
Aged dark oak interior, curtain folds, glass negative shelves, brass camera fittings, a narrow back doorway faint grey morning mist from a bus shelter. High quality cinematic painterly realism, eerie tender melancholy, tactile analog photography equipment, quiet impossible architecture. Wide establishing view from beside the camera, empty chair/backdrop central, camera lower-left, lamp to side; strong depth and believable scale. Soft ivory lamp light on cloth, charcoal wood, restrained dark red darkroom light through distant door, cool grey morning accent. Readable details, not near-black.
Exactly an empty studio: no people/human face, no letters/labels/numbers/readable writing/logos/watermark/buttons/UI/contact sheet. One coherent environment, not app screenshot. All text and geometry will be HTML.
```

## 双重曝光取景台

源图 `design-references/source-v103-double-exposure-camera.png`，运行图 `assets/v103-double-exposure-camera.webp`。

```text
Use case: stylized-concept. Asset type: 3:2 landscape environmental gameplay illustration, 1536 by 1024 composition, atmospheric browser game.
Working view of an antique double-exposure portrait studio. A large empty pale grey ivory muslin portrait screen faces viewer straight on, perfectly unoccupied, quiet light stage waiting for visitor who never appears. Two old metal studio lamps just outside its sides, a dark oak camera rail and small brass negative holders along bottom edge.
Head-on low-distortion horizontal 3:2. Clean unobstructed portrait screen fills approximately x=20 to 80 percent and y=18 to 76 percent of entire image. Front-facing rectangular plane calm nearly uniform pale grey, usable for separate web overlay showing five standing positions/seven shadow positions. Keep lamps/chair/tools/wires/camera parts OUTSIDE central screen. NO people/silhouettes/shadows/grids/marks/ticks/scales on the screen, game renders live.
Charcoal oak room, subtle fabric texture on screen, worn brass/black wooden camera edges. Cinematic painterly realism, exquisite tactile analog camera room, readable matte surfaces, eerie but tender. Soft neutral pearl-white screen light, dark charcoal framing, oxidized brass/distant small dark-red indicator. Balanced brightness behind high contrast HTML geometry.
No words/characters/numbers/labels/logos/watermark/buttons/visible UI/baked-in character outlines/baked-in shadows. No collage/contact sheet. One coherent room, NOT app mockup.
```

## 未收影暗房

源图 `design-references/source-v103-unreceived-shadow-darkroom.png`，运行图 `assets/v103-unreceived-shadow-darkroom.webp`。

```text
Use case: stylized-concept. Asset type: 3:2 landscape darkroom environment illustration, 1536 by 1024 composition, atmospheric browser exploration game.
Red-lit analog photographic darkroom for developing shadows that failed to arrive. Tall black enlarger casts soft ivory rectangle onto a blank front-facing photographic exposure board at center. Empty glass negative frames hang from thin clips near upper OUTER edges. Shallow dark developer trays/pair old tongs along lower edge. Board remains blank for game's double-exposure overlay.
Symmetrical almost head-on 3:2. Clean unobstructed pale grey ivory rectangular exposure plane approximately x=20 to80 percent and y=20 to74 percent, front facing NO perspective tilt. No characters/photos/shadows on it; hosts HTML overlays. Enlarger neck/clipped frames/trays/pipes around edges, NOT covering plane.
Aged charcoal stone/dark wood/slightly damp walls/copper pipework/tactile glass/metal/analog tools. Quiet mysterious intimacy. High quality cinematic painterly realism, melancholy surreal architecture with believable materials, not science fiction.
Dark vermilion safelight outer walls, ivory enlarger light central plane clearly readable, gentle silver glass highlights, rich shadow detail not black.
No text/letters/inscriptions/numbers/logos/watermark/buttons/UI/people/faces/printed silhouettes/contact sheets/baked-in double-exposure. One environment, live interaction separate.
```

## 保存和验收状态

三张原PNG和运行WebP均为1536×1024，WebP质量88，每张<300000字节。仅通过Sharp做格式压缩，未裁切、调色或手工修改内容；内置生成目录中的原件也保留。

| 图像 | WebP字节 | 源PNG SHA256 | 运行WebP SHA256 |
| --- | --- | --- | --- |
| 照相馆 | 247434 | `bdd7955b2869305b3ea48c3a8e687abe6dcafcc3530caeb0496ccb4c844c4608` | `c9304aa089221643e3c4d113237aaa215bc902d95936932c8c303f82cd7f1433` |
| 取景台 | 208296 | `0389160cfef8f8103601cf97f93d106b97998a7bce035b20f4a59a617fcea42c` | `a62700a51cc7c7e072a9a26939ef11d4dfd7a25080a1119ee08fec8c8ed5fa69` |
| 暗房 | 168738 | `21eaf83d6831d08d8f6a77171d362fecc95e8540186f066c58934fc2e512d9cd` | `7869783497cc258b5b94e98aa30b549e06edd57ee84022f233a8b534402c6b21` |

根据实际生成图复核，取景幕布安全叠层矩形为x24–76%、y16–67%；暗房曝光板安全矩形为x29–71%、y26–65%，不沿用prompt的预期边框硬套到真实画中。影位0–6再映射到内部10–90%横轴防止边缘切掉轮廓。Computer Use始终复用Chrome标签80231134，未新建窗口或标签；实时叠层、底片缩图、暗房叠印和图鉴由代码绘制，原画不代替结果。修正前证据保留为 `design-qa-evidence/v103-06-darkroom-mobile-before-tag-fix.png`；最终手机重合图为 `design-qa-evidence/v103-12-darkroom-mobile-overlap-final.png`，桌面为 `design-qa-evidence/v103-13-darkroom-desktop-final.png`。手机四个tag均在143.30×88.71的白板安全区内且互不相交，0/6边缘图另存11，原始与压缩图片未因CSS修正而改动。
