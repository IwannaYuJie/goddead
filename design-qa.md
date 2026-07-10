# Design QA — Split Testament Homepage

## Evidence

- Source visual truth: `design-references/selected-option-3.png`
- Desktop implementation: `design-qa-evidence/implementation-desktop-final.png`
- Mobile implementation: `design-qa-evidence/implementation-mobile-final.png`
- Full-view comparison: `design-qa-evidence/comparison-desktop-final.png`
- Focused gate comparison: `design-qa-evidence/comparison-gates-focused-final.png`
- Desktop viewport: 1440 × 1024
- Mobile viewport: 390 × 844
- State: homepage loaded, title reveal complete; menu, ritual point, and primary gate navigation tested separately

## Findings

- No remaining P0, P1, or P2 mismatch.
- Fonts and typography: Cormorant Garamond and Noto Serif SC reproduce the high-contrast editorial serif hierarchy. The final pass reduced the oversized wordmark and enlarged the Chinese gate names to match the reference proportions. The web-font strokes are cleaner than the mockup's printed lettering; this is acceptable residual P3 drift.
- Spacing and layout rhythm: the 62.6/37.4 split, vertical seam, cropped two-line wordmark, stacked gate rhythm, and bottom ritual control align with the selected composition. Mobile intentionally stacks the wordmark and gate panels without horizontal overflow.
- Colors and visual tokens: coal black, aged bone, and dried-blood red match the source. The first implementation was too bright; the final bone palette and grain opacity were reduced to restore the source's archival density.
- Image quality and asset fidelity: the final page uses two project-local generated raster assets for the scripture/diagram field and the three etched gate motifs. Assets are sharp, correctly cropped, and not hotlinked. No source illustration was replaced by CSS or placeholder art.
- Copy and content: `GOD / DEAD`, `祂已经死去。你仍然抵达。`, `回声`, `血管`, `忏悔`, and `触碰红点` preserve the selected concept's core language. Supporting hover copy is consistent with the existing site.
- Accessibility and interaction: visible focus states, semantic navigation, live ritual status, reduced-motion handling, escape-to-close menu behavior, and readable labels are present.

## Comparison History

### Pass 1 — blocked

- P2: the bone-white title was too bright and approximately 10–15% too large, while the gate names were too small.
- Fix: darkened the bone tokens, reduced the desktop wordmark from 27.8vw to 25.5vw, reduced the global grain overlay, and increased the desktop gate type scale.
- Post-fix evidence: `design-qa-evidence/comparison-desktop-final.png`.

### Pass 2 — blocked

- P2: focused comparison still showed the gate labels reading smaller than the source.
- Fix: increased the desktop gate-name scale to 6.8vw with a 6.4rem cap.
- Post-fix evidence: `design-qa-evidence/comparison-gates-focused-final.png`.

### Pass 3 — passed

- No actionable P0/P1/P2 differences remain.
- Desktop and mobile have no horizontal overflow.
- Console errors and warnings: none.
- Primary interactions tested: ritual point state toggle, menu open/close, Escape-safe menu behavior, and navigation to `echo.html`.

## Follow-up Polish

- P3: a future custom distressed webfont or variable text mask could mimic the mockup's printed erosion more literally, but the current freely available fonts preserve readability and hierarchy.

final result: passed
