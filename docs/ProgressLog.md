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
