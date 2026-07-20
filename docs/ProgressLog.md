# Progress Log

## 2026-07-02
- Initialized static site structure for goddead.com.
- Configured Cloudflare Pages deployment pipeline.
- Added base tests to check deployment files.

## 2026-07-03
- Reimagined the landing page as a digital liturgy around the word "goddead".
- Rewrote `index.html` with a ritual overlay, monumental letter-by-letter title, and triptych relic gallery.
- Rewrote `styles.css` with enhanced typography, void vignette, hover-driven gold glows, and refined responsive breakpoints.
- Rewrote `script.js` with an improved dust-particle void, mouse-reactive title parallax, richer audio drone engine, and scroll reveal animations.
- Preserved Cloudflare Pages deployment compatibility and existing test expectations.

## 2026-07-03 (second revision)
- Fully redesigned the page without reusing previous text or image content.
- Adopted the "Absence Cult" concept: an altar built from silence after the divine.
- Replaced image gallery with pure CSS-generated sacred geometries (absence ring, echo fissure, silence pyramid).
- Rewrote all copy as original prose/poetry around absence, echo, and silence.
- Kept `assets/hero.png` reference only for deployment test compatibility.

## 2026-07-03 (third revision)
- Expanded the Absence Cult page with three new content modules.
- Added The Lectionary: five tabbed readings for the unfaithful with gold active states.
- Added Chronicle of Vanishings: a vertical timeline of fictional years after the divine exit.
- Added Apocryphal Index: three animated counters measuring silence, unanswered prayers, and detected gods.
- Implemented scroll-triggered reveals and counter animations in `script.js`.
- Added responsive layouts and reduced-motion support for all new sections.

## 2026-07-03 (fourth revision)
- Translated all page copy to Chinese to match the requested tone.
- Shifted visual mood toward the uncanny: blood-red accents, mold green, bruise purple, heavier vignettes.
- Added glitch keyframes, title shiver, dripping blood line, warning flicker, and random text glitches via JS.
- Replaced English text scrambler with a Chinese character reveal effect (blur fade + per-character appearance).
- Darkened audio drone (E1 ~41.2 Hz) and made particle motion more erratic and unsettling.

## 2026-07-03 (fifth revision)
- Expanded the world-building into a lore-exploration page with four new modules.
- Added Forbidden Index: three expandable archive entries with redacted passages revealed on hover.
- Added Absence Map: four unsettling regions forming a cartography of the post-divine world.
- Added Witness Testimonies: three fragmented first-person accounts.
- Added False Names: six hover-revealed epithets people gave to the dead gods.
- Implemented accordion interactions, hover-redaction reveals, and scroll-triggered animations.

## 2026-07-03 (sixth revision)
- Added three sub-pages with interactive experiences instead of pure text:
  - `echo.html` — Echo Room where user input is repeated and corrupted over time.
  - `vein.html` — Vein Network: a living, mouse-driven growth of blood vessels.
  - `confession.html` — Confession Booth: user secrets receive cryptic responses and leave scratches.
- Added hidden portal links in the main page footer.
- Added "corruption" layer on the main page: growing stains, mouse-trail rot, random screen flicker, and page shivers.
- Added Easter eggs: Konami code burst, seven clicks on the title, and console messages.
- Reduced pure database feel in favor of polluted, haunted-web atmosphere.

## 2026-07-03 (seventh revision)
- Radically redesigned the homepage as a step-by-step ritual rather than a lore database.
- Removed all long-form text modules (doctrines, lectionary, chronicle, apocrypha, forbidden index, map, testimonies, false names) from `index.html`.
- Replaced them with four ritual stages:
  1. A pulsing red point with the whisper "祂正在死去。"
  2. A typewritten invocation: "神已死。祭坛还在饥饿。"
  3. The `GODDEAD` title emerging from darkness.
  4. Three gates leading to the sub-pages: 回声 / 血管 / 忏悔.
- Rewrote `styles.css` and `script.js` to support stage transitions, auto-advance, and persistent corruption effects.

## 2026-07-03 (eighth revision)
- Restored the previous lore text but exposed it interactively instead of stacking it on the homepage.
- Added a "Descent" button after the three gates; clicking it opens the "Abyss" corridor below.
- The Abyss reveals previous world-building modules as the user scrolls:
  - Three Doctrines of Absence
  - Forbidden Index (expandable entries with redacted hover reveals)
  - Absence Map
  - Witness Testimonies
  - False Names
- Kept the four-stage ritual flow intact while integrating the earlier text-based lore as optional, interactive depth.

## 2026-07-03 (ninth revision — major expansion)
- Massively expanded worldbuilding across the Abyss:
  - Six Doctrines of Absence (added Hunger Spiral, Mirror Void, Ashes Scripture).
  - Expanded Forbidden Index from 3 to 6 entries (A-156, A-204, A-287).
  - Expanded Absence Map from 4 to 8 regions (Slow Post Office, Jaw Library, Infant Lighthouse, Thirteenth Hour).
  - Added Fractured Chronicle with 6+ timeline entries, including a hidden year triggered by prayers.
  - Added Catalogue of False Saints with six non-human saints.
  - Added Unfinished Prayers module with an interactive prayer-completing input.
  - Added Undelivered Letters module with three sealed/torn/blood-stained letters.
  - Added Relic Gallery with four post-divine artifacts.
  - Added Silence Measurements with animated counters.
  - Added Bottom Well final section with depth button and escalating whispers.
- Enriched frontend interactions on the homepage:
  - Persistent corruption state saved to localStorage with a visible HUD.
  - Madness Mode toggle that intensifies visual/audio atmosphere.
  - Title click counter with escalating whispers and secret modal on the 7th/7-multiple clicks.
  - Altar sigil click counter; 7 clicks reveal a hidden fourth gate to the Reliquary.
  - Additional keyboard codes: "breath" and "goddead" trigger layered effects.
  - Right-click and text-selection easter eggs.
  - Idle whisper system, dwell-time tracking, and visibility-change whispers.
  - Secret modal system for lore drops.
  - Console API: openTheEye(), seeCorruption(), cleanse(), descend(), speakName().
  - Corruption canvas now occasionally emits floating runes in madness mode.
- Enhanced CSS with new sacred geometries, chronicle timeline, saint/prayer/letter/relic/measure modules, secret modal, corruption HUD, whisper feed, and madness-driven jitter/shiver animations.
- Enriched sub-pages:
  - `echo.html` now tracks echo count/depth, persists count, supports deeper corruption levels, and emits pulse rings.
  - `vein.html` now tracks node/pulse counts, supports multiple vein types (blood/bone/gold/mold), and shows contextual whispers.
  - `confession.html` now persists confessions to a memory wall, counts confessions, and the watching eye follows the cursor.
- Added `reliquary.html` — a hidden fourth sub-page that aggregates saved corruption, echoes, confessions, prayers, and memory fragments, with an option to forget them.

## 2026-07-10 (Split Testament redesign)
- Captured the live `goddead.com` homepage in desktop and mobile states before redesigning it.
- Explored three visual directions and implemented the selected third direction, **Split Testament**.
- Rebuilt `index.html` around a split editorial composition: a giant cropped `GOD / DEAD` wordmark on the left and three ritual gates on the right.
- Added project-local generated raster artwork for the archival scripture field and the Echo / Vein / Confession etched motifs.
- Rewrote `styles.css` with responsive desktop/mobile layouts, aged-bone and dried-blood tokens, title reveal motion, gate hover/focus states, menu drawer styling, and reduced-motion handling.
- Rewrote the homepage controller in `script.js` with a persistent ritual-point state, directory drawer, arrival counter, keyboard invocation, status copy, and preserved links to all four sub-experiences.
- Preserved Cloudflare Pages compatibility and the legacy `assets/hero.png` deployment-test contract.
- Verified at 1440 × 1024 and 390 × 844 with no horizontal overflow or browser-console errors.
- Tested the ritual-point toggle, directory open/close flow, Escape behavior, and navigation to the Echo page.
- Completed three visual QA passes; the final report in `design-qa.md` records `final result: passed`.

## 2026-07-13 (Click-to-explore rooms)
- Replaced long-scroll archive with full-viewport room exploration: click doors and fragments to advance.
- Added denser lore rooms (rift, void, law, years, scraps, map, voices, names, remains, you, under).
- Nested reveals: tiles, laws, year rack, scraps/redactions, map pins, voices, aliases, remains dossiers.
- Easter eggs: GOD→DEAD sequence, type `goddead`, red point ×7, arrivals ×7, map center `?`, all aliases, triple-click domain, secret undercroft.
- Top chrome shows exploration depth; directory locks unvisited deep rooms until paths open.

## 2026-07-13 (Absence Archive redesign)
- Rebuilt the site as a content-rich, artistic single-page archive around a full Goddead world bible.
- Replaced sparse gate/minigame homepage with nine chapters: prologue, doctrines, chronicle, forbidden index, cartography, witnesses, epithets, remains, and reliquary.
- Added a clearly labeled top-right **目录** drawer with section navigation, backdrop, Escape-to-close, and active-section highlighting.
- Kept light interactions only: awaken signal, expandable archive entries, redacted-text peeks, interactive map regions, epithet reveals, local arrival counter, and visitor mark archiving (localStorage).
- Retired Echo / Vein / Confession as primary experiences; old URLs redirect into the corresponding archive sections.
- Preserved Cloudflare Pages compatibility, `assets/hero.png` test contract, reduced-motion support, and mobile breakpoints.

## 2026-07-17 (The Living Shrine redesign)
- Rebuilt the homepage from a fixed split-screen into a scrolling five-movement ritual: altar, scripture bands, three gates, prayer offering, and traces.
- Reused the monument artwork (`monument_1/2/3.png`) as hover-revealed gate art; kept `testament-left.png` as the parallax altar backdrop and `assets/hero.png` as the grain layer to preserve the deployment-test contract.
- `styles.css`: new Living Shrine system — glitch/scatter wordmark states, typewriter caret, marquee bands, gate hover reveals, prayer burn layer, stat grid, sealed/unsealed Reliquary slot, custom cursor, awake/idle/midnight/miracle body states, full responsive breakpoints and reduced-motion handling.
- `script.js`: ash-and-ember canvas field with mouse disturbance and click bursts; master rAF loop driving particles, cursor lerp, wordmark parallax, and scroll-velocity scripture marquees; typewriter verse cycle; prayer burning that persists `goddead_state.prayersOffered`/`corruption` for `reliquary.html`; animated trace counters; arrival-based Reliquary unsealing.
- Easter eggs: `goddead` invocation, Konami ember-storm miracle, seven wordmark clicks (scatter), seven arrivals (Reliquary), midnight visitor verse, 45s idle silence whisper, three-second scripture gaze revealing a hidden sentence, and console hints.
- Hardened the band-duplication loop with an iteration guard; verified visually at 1440 and 390 widths plus awake, gate-hover, menu-open, and Reliquary-unlocked states via headless Chromium screenshots.

## 2026-07-19 (Door ritual revision)
- Replaced the `GOD / DEAD` wordmark and typewriter verse altar with a centered `神已死` title and a sealed, symbol-covered SVG door.
- Added mouse and keyboard knocking: the third knock parts the door around a glowing seam, the fourth triggers a warning, and the seventh receives a delayed knock in reply.
- Added rotating blood-red whispers around the doorway, with a stable reduced-motion fallback.
- Inserted an eight-item visitor protocol between the doorway and scripture bands, including altered and contradictory rules.
- Updated the door, whisper, protocol, responsive, and reduced-motion styling and bumped the homepage asset cache key to `v12`.
- Refreshed the README experience description and ignored macOS `.DS_Store` metadata.
- Verified JavaScript syntax, the static-site test suite, whitespace integrity, and the intended source files' sensitive-token scan before commit.
- Tightened the doorway hero spacing and capped the door artwork against viewport height so the complete entrance remains visible on shorter screens.

## 2026-07-19 (Exploration game restructure)
- Rebuilt the homepage from a scrolling page into a hash-routed, scene-by-scene exploration game (`#threshold` → `#protocol` → `#corridor` → `#offering` → `#remembrance`, plus a hidden `#ninth`).
- Kept the doorway hero untouched as the game entrance: three knocks part the door and offer an explicit 进去 / 不进 choice; clicking the door itself while ajar still triggers the fourth-knock warning.
- Promoted the visitor protocol to a full scene with interactions: per-rule click responses, an escalating rule-seven annotation, and a rule-count anomaly that occasionally flashes 玖 — clicking it opens the hidden ninth-rule scene.
- Moved the scripture bands and three gates into a corridor scene and added a sealed fourth gate that answers with a single knock until seven arrivals unseal the Reliquary.
- Added a WebAudio atmosphere engine (detuned low drone with breathing filter, synthesized knocks, door bells, scene-transition whoosh) gated behind the first user gesture with a persistent top-bar mute toggle.
- Added scene transitions via a black veil, per-scene reveal staggering, per-scene document titles, and scene-internal scrolling; removed the old footer/scroll-cue chrome and folded arrivals, colophon whisper, and domain mark into the remembrance scene.
- Verified all six scenes at 1440 and 390 widths (threshold, protocol with anomaly, corridor, offering, remembrance, ninth, and the ajar choice state) with headless Chromium screenshots; test suite passes and asset cache bumped to `v13`.
- Updated the README to describe the scene-based navigation, hidden ninth rule, and opt-in audio experience.

## 2026-07-19 (Fragments & crookedness revision)
- Removed the Echo / Vein / Confession interactive pages and their gates; the corridor now holds eight crooked lore fragments （残页） that can be picked up, plus the sealed Reliquary gate. Reading fragments feeds a new persistent 碎片 counter and the corruption formula.
- Pushed the whole site toward the uncanny: titles slowly sway off-axis, the 神已死 characters sit skewed, protocol rules tilt and offset per row (and straighten under the cursor), fragments lie scattered at odd angles, and the stat grid dropped to four cards （抵达 / 碎片 / 祷词 / 侵蚀度）.
- Added text self-corruption: every 9–23s a random character in a visible plain-text passage briefly swaps for a blood-red wrong character before reverting.
- Added distant knocking tied to protocol rule two: every 40–90s the page trembles with a faint knock (sometimes two), with no explanation offered.
- Removed the three sub-pages from the drawer menu; reliquary.html kept as-is (its archived echo/confession counters simply rest at zero).
- Verified corridor / protocol / remembrance scenes at 1440 and 390 widths via headless Chromium; test suite passes.
- Updated the README for the fragment-based corridor and confirmed the active site no longer links to the removed room pages.

## 2026-07-20 (Third Night-Watch Room)
- Added the hidden **第三值夜室** scene (`#watch`): collecting at least three corridor fragments silently reveals a narrow door in the corridor wall and a `02½ / 值夜室` entry in the directory; below three fragments both ship `hidden` (unfocusable, out of the accessibility tree), and the hash router hard-blocks every path into the room — direct `#watch` loads, `hashchange` tampering, and synthetic `data-go="watch"` clicks all redirect to the corridor and normalize the address bar via `history.replaceState`.
- Room contents: a desk clock frozen at 03:17 whose second hand occasionally runs backward (with a soft tick), a handover log whose five semantic-button entries overwrite themselves with blood-red rewrites (Enter/Space operable, `aria-pressed` toggle semantics, covered originals leave the a11y tree so screen readers only announce the current text), a dynamic entry registering the visitor by arrival count and fragment count (`抵达记录：未登记` when arrivals is 0 — never `第 0 次抵达`), an empty chair whose shadow slowly turns toward the visitor, and a sign-out button that permanently refuses and persists `goddead_watch` into the remembrance scene.
- WebAudio-only additions inside the room (fluorescent 120 Hz hum, one faraway telephone ring, reverse-tick clicks), all routed through the existing engine and global mute; reduced-motion skips the clock, shadow creep, and door-trace cycles while keeping all narrative text.
- Regression-verified for real via CDP-driven headless Chromium (18/18): lock/unlock guard, atomic restore at 3 fragments, keyboard log covering, arrivals=0 copy, sign-out refusal persistence, and zero door/fragment rectangle overlap at 1440×1024 and 390×844; evidence in `design-qa-evidence/`, report in `design-qa.md`.
- Removed the temporary QA copies `__qa.html` / `__qa.js`; test suite passes.

## 2026-07-20 (Watch room bitmap deepening)
- Replaced the placeholder-like inline SVG geometry in the Third Night-Watch Room with production bitmap assets after an independent P2 visual finding: `assets/watch-clock-face.webp` (aged 03:17 dial), `assets/watch-second-hand.png` (chroma-keyed transparent second hand, registered on the same 900×900 canvas as the dial, hub aligned to the dial's geometric center), and `assets/watch-room-desk.webp` (empty desk and chair scene, brightness 0.94 with a feathered mask so the black surround melts into the page).
- The second hand keeps rotating around its true pivot via the existing JS (backward runs, soft ticks, reduced-motion skip all unchanged); the chair shadow became a blurred ellipse overlay on the bitmap chair, still creeping toward the visitor; `role="img"` / `aria-label` exposure preserved on both clock and desk.
- Raised watch-room readability without lifting the darkness: log backdrop 0.5→0.68, entry weight 300→400, brighter log numbers and clock caption.
- Bumped the asset cache key to `v15`; extended `tests/site.test.mjs` with asset-existence, reference, and inline-SVG-removal assertions.
- CDP-driven headless Chromium regression passed 16/16 (lock/unlock guard, Enter/Space log covering, arrivals=0 copy, sign-out persistence, second-hand rotation, reduced-motion, zero door/fragment overlap and no horizontal overflow at desktop and 390 widths); evidence `watch-room-desktop-v2.png` / `watch-room-mobile-v2.png`.
- 本轮 Kimi 额度与上下文用量记录见 `docs/KimiUsageLog.md`。

## 2026-07-20 (Fourth line / Echo Switchboard)
- Added the hidden **余响交换台** scene (`#switchboard`): the night-watch room only *hears*; the switchboard decides where those sounds go. The 05:02 call was never a mis-ring — it came back up a fourth line with no endpoint.
- Unlock contract: covering the 05:02 handover entry (值-叁-0469) **and** attempting to sign out at least once, in any order, deterministically unlocks a semantic 接 听 button plus an aria-live announcement (「桌下那部不存在的电话，开始第二次响。」) and the `02¾ / 第四线路` directory entry. While locked, both entries ship `hidden` (unfocusable, out of the a11y tree) and the router hard-blocks direct `#switchboard`, hashchange, and synthetic `data-go` navigation back to `#watch` with `history.replaceState` normalization. All state lives in `goddead_line4` with fault-tolerant parsing.
- The scene pairs a production bitmap (`assets/line-four-switchboard.webp`, feather-masked into the black, zero inline SVG) with a crooked paper-style 接线簿: three callback lines (door knocks × awake, offering ashes × prayersOffered 0/N branches, empty-shift report × fragments/arrivals/refused sign-outs) as native buttons with click and Enter/Space support, aria-pressed semantics and persisted heard state; a truly-disabled fourth line with a readable reason that atomically enables as 「肆 · 第四线路」 once the first three are heard.
- Connecting the fourth line reveals a five-line record in rhythm (immediate and complete under reduced-motion, aria-live announces only the current line), persists the connected end state, restores fully on reload without re-announcing, and replays without accumulating. The remembrance scene gains a 线 路 stat (— / 04) and the line-memory sentence.
- WebAudio-only additions (plug contact clicks, quiet band-passed line noise, intermittent faraway rings at reduced volume) ride the existing engine and global mute; leaving the scene tears down noise and timers. Cache bumped to `v16`; tests extended with the switchboard contract; existing watch/offering/reliquary unlock meanings untouched.
- CDP-driven headless Chromium regression passed 31/31 (locked guards, both unlock orders, reload persistence, keyboard line covering, disabled→enabled→connect→reload→replay, dynamic 0/N branches, remembrance, mute, reduced-motion, desktop/mobile overflow and subject framing); evidence in `design-qa-evidence/`.
- P1 fix (independent review): the sequential `if` guards let `switchboard → watch` rewriting skip the watch guard, so a clean-storage visit to `#switchboard` with 0 fragments landed inside the locked night-watch room. Guards are now centralized in `resolveScene`, cascading in dependency order (switchboard → watch → corridor) with address-bar normalization and a static order assertion; clean-storage CDP matrix proves all four guard outcomes plus that hidden scenes take no real mouse input. Full regression re-run: 37/37.
- P1 follow-up (stale line4 escalation): the centralized guard still keyed the switchboard branch on `line4Unlocked()` alone, so a stale `goddead_line4.unlocked=true` with 0 fragments could enter `#switchboard` directly. Each scene now declares its full prerequisites — switchboard requires both `watchUnlocked()` (three fragments) and `line4Unlocked()` — instead of relying on branch order, and `syncLine4` shares the same dependency set so the answer box and directory entry stay `hidden` while fragment progress is insufficient. Static contract asserts the joint condition; CDP regression 27/27 covers the stale matrix (direct loads, hashchange tampering, synthetic `data-go`, hidden-entry inertness), the three lock states (watch locked / switchboard locked / both unlocked) with reload persistence, and a tamper-down case that zeroes fragments after full unlock and must fall to `#corridor`. Cache bumped to `v17`; evidence `design-qa-evidence/switchboard-stale-guard.png`.
- 最终验收：`node --check script.js`、`node tests/site.test.mjs`、`git diff --check` 全部通过；CDP 真实交互回归 27/27；浏览器桌面/移动/门禁/控制台由监理独立验收通过。本轮 Kimi 额度与上下文用量记录见 `docs/KimiUsageLog.md`。
