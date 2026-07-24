# Goddead

Static landing page for [goddead.com](https://goddead.com).

## Current Experience

The homepage is **The Living Shrine**, a hash-routed, scene-by-scene exploration game. Visitors knock three times at the sealed threshold — now a photographed bureau door — and on the third knock the door visually opens into a deep black-gold corridor before the visitor is pulled through into the next room; each completed action thereafter advances the ritual automatically.

The flow is linear and auto-advancing: three knocks open the door and lead into the **Visitor Protocol**; the first active activation of any rule sends the visitor down the **Scripture Corridor**; reading three crooked fragments reveals the **Third Night-Watch Room**; covering the 05:02 log entry and attempting sign-out unlock the **Echo Switchboard**; listening to the first three callback lines and connecting the fourth opens the **Dead Letter Office**; archiving three returns and signing the blank receipt spawn the **Divine Name Cancellation Office**; searching `GODDEAD` and refusing cancellation rewrite the refusal as an appointment at the **Acting Deity Desk**; pushing the presence switch to 100% opens the **Offering** furnace; offering a non-empty prayer ignites the incinerator and auto-advances into **The Sacred Reliquary Vault**; auditing three remnants and stamping the final seal advances the visitor into **Remembrance**, where the page records what it remembers. A hidden **Ninth Rule** remains accessible through the protocol anomaly and does not auto-cycle.

Three optional branch rooms (v29) hang off the corridor's fragments. The first active click on the 回声 fragment opens the **Echo Archive**, the 血管 fragment the **Vein Maintenance Well**, and the 忏悔 fragment the **Confession Weighing Room** — each after a ~0.7–1.0 s feedback beat (~0.3 s under reduced-motion), with the main-line auto-advance cancelled in the branch's favour and no second continue button anywhere. Every room holds three focusable hotspots: the archive's receivers return to the threshold or the corridor, and the 03:17 bell transfers deeper into the **Distortion Transfer Chamber**; the well's valves run downstream to the corridor, upstream to the protocol, or open the **Reverse-Flow Pump Room** behind the isolation valve; the weighing room's pans confess into the protocol or the corridor, while refusing confession is filed into the **Nameless Ledger Vault**. Branches are always optional, never a hard gate on the main line; visited rooms gain re-entry buttons in the corridor and directory entries that survive reloads, all recorded in a fault-tolerant `goddead_v29_branches` state that never touches main-line progress. Remembrance gains a single branch-memory line — still eight stat cards.

The three deep rooms (v30) form a loop under the branches, each entered from its parent room and each holding three more focusable actions with auto-advance. The transfer chamber relays distorted voices into the vein network, seals your own voice into a wax cylinder (back to the protocol), or rings 03:17 again — through to the night-watch room only once the watch is unlocked, otherwise back to the corridor. The pump room vents echo pressure back to the transfer chamber, drains black sediment into the ledger pipes, or climbs the emergency ladder to the watch (falling back to the protocol when the watch is still locked). The ledger vault crosses out your own name (into the transfer chamber), files you as a still-present witness (into the pump room), or rejects the entire record — normally back to the protocol, but once all three deep rooms are visited the rejection lands in the corridor or the watch by unlock state. Deep visits persist at click time in a fault-tolerant `goddead_v30_branch_depth` state that never touches v29, v28, or main-line progress; visited deep rooms gain corridor re-entry buttons and directory entries, direct-hash access to an unvisited deep room falls back to its parent branch, and Remembrance adds one deep-branch memory line — still eight stat cards.

A unified, scene-scoped auto-advance scheduler handles every transition: it gives ~0.9–1.4 s of perceptible feedback in normal mode, shortens but remains understandable under reduced-motion, clears its timer on scene exit or repeated triggers, and never jumps on its own when persistent state is restored or a scene is opened directly by hash. Session-scoped consumed markers are only flipped inside each timer's `before` callback, so a transition cancelled by back-navigation can be re-armed by repeating the core action; persistent-state restoration or direct hash entry never arms a transition. Each switch scrolls to the top of the new scene and moves focus to its title. Only the directory drawer and explicit back-navigation remain; cross-scene shortcut buttons and bottom forward buttons on the linear path have been removed.

After the main line is complete, Remembrance offers the **Governance Protocol** (v28, 神圣平衡与代理神明协议) to returning visitors. Three acting-deity rulings — at the Acting Deity Desk, the Offering furnace, and the Sacred Reliquary Vault — shift three derived resources (灵质 E / 灰烬 A / 共鸣 R) tracked on a governance HUD. Each ruling auto-advances after a short feedback beat; the continue buttons are optional fallbacks, never a required second step. The final balance resolves into one of four collectible endings (Ascension / Madness / Oblivion / Nightwatch) or a Divine Collapse. Endings persist into a collection; starting a new cycle or retrying a collapse resets only the current cycle's rulings and increments `cycleCount` exactly once, preserving the collection and all main-line progress (watch, line four, dead-letter, cancellation, appointment, prayers, relics, arrivals).

For short desktop viewports (≤800px height), the later scenes switch to a compact two-column layout so the first actionable control is visible without scrolling, while taller/wider screens keep the cinematic vertical staging. Stat-card text values stay inside their cells, and scene-title focus rings use the site's blood/bone palette instead of the browser default blue.

## Deploy

This repository is intended to deploy through Cloudflare Pages.

- Build command: none
- Output directory: `/`
- Custom domain: `goddead.com`
- Pages URL: [goddead.pages.dev](https://goddead.pages.dev/)
- WWW URL: [www.goddead.com](https://www.goddead.com/)
- DNS provider: Cloudflare
- Nameservers: `sam.ns.cloudflare.com`, `suzanne.ns.cloudflare.com`
- Current domain status: [goddead.com](https://goddead.com/) and [www.goddead.com](https://www.goddead.com/) are live on Cloudflare Pages.

## Local Check

```bash
node --check script.js
node tests/site.test.mjs
git diff --check
```

Visual QA evidence and the final comparison report live in `design-qa-evidence/` and `design-qa.md`.
