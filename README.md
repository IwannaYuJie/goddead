# Goddead

Static landing page for [goddead.com](https://goddead.com).

## Current Experience

The homepage is **The Living Shrine**, structured as a hash-routed exploration game instead of one long scroll. Visitors knock three times at the sealed threshold and choose whether to enter, read an interactive protocol whose seventh rule mutates toward a hidden ninth scene, and collect eight crooked lore fragments in a scripture corridor beside the sealed Reliquary. Collecting at least three fragments silently reveals a narrow door that was not there before: the **Third Night-Watch Room**, where a defunct bureau's shift system still runs without any watchers — a desk clock frozen at 03:17 whose second hand occasionally runs backward, a handover log whose entries overwrite themselves (one of them registers *you* by arrival and fragment count), an empty chair whose shadow slowly turns toward the visitor, and a sign-out button that permanently refuses you. Revealing what really happened at 05:02 and then trying to sign out wakes a phone that was never installed: the **Echo Switchboard** on the fourth line, where three callback lines replay the door knocks, the offering fire, and the empty shift — until the unassigned fourth line connects and reports it was never disconnected. Beyond it: a prayer-burning offering and the traces the site remembers, including your unapproved sign-out and the line that now counts every ring as your shift. Titles, rules, and fragments sit deliberately off-axis; visible text occasionally corrupts itself, and unexplained distant knocks disturb the page. Scene transitions use a black veil, staggered reveals, scene-specific titles, and an opt-in WebAudio atmosphere (low drone, knocks, bells, a fluorescent hum and one faraway telephone ring inside the watch room) with a persistent mute control. Ash-and-ember particles, the `goddead` invocation, Konami miracle, arrival-based Reliquary unlock, idle whisper, and scripture-gaze secret remain woven into the experience.

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
node tests/site.test.mjs
```

Visual QA evidence and the final comparison report live in `design-qa-evidence/` and `design-qa.md`.
