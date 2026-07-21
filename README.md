# Goddead

Static landing page for [goddead.com](https://goddead.com).

## Current Experience

The homepage is **The Living Shrine**, structured as a hash-routed exploration game instead of one long scroll. Visitors knock three times at the sealed threshold — now a photographed bureau door — and choose whether to enter, read an interactive protocol whose seventh rule mutates toward a hidden ninth scene, and collect eight crooked lore fragments in a scripture corridor beside the sealed Reliquary. Collecting at least three fragments silently reveals a narrow door that was not there before: the **Third Night-Watch Room**, where a defunct bureau's shift system still runs without any watchers — a desk clock frozen at 03:17 whose second hand occasionally runs backward, a handover log whose entries overwrite themselves (one of them registers *you* by arrival and fragment count), an empty chair whose shadow slowly turns toward the visitor, and a sign-out button that permanently refuses you. Revealing what really happened at 05:02 and then trying to sign out wakes a phone that was never installed: the **Echo Switchboard** on the fourth line, where three callback lines replay the door knocks, the offering fire, and the empty shift — until the unassigned fourth line connects and reports it was never disconnected. Connecting it reveals the line was never a telephone line: it is the return address of the **Dead Letter Office**, a dead-letter bureau where the knocks, the burnt prayers, and the refused sign-out arrive as undeliverable mail — and the blank receipt at the center of the desk is finally signed by the only recipient it ever had: you. Signing the blank receipt spawns a file number that should not exist: the **Divine Name Cancellation Office**, where the state `GODDEAD` is the archive status of a name that cannot be delivered. The office can only be searched by status, not by name; the answer is the domain itself. Once the record opens, it names the last witness as the object of cancellation — and refusing to be erased becomes proof that you are still present. That refusal is rewritten into a temporary appointment: the **Acting Deity Desk**, where a single native switch must be pushed from *absent* to *present* and locked at 100%, appointing you not as a god but as the one who finishes a shift that no one else is present to take. Beyond it: a prayer-burning offering and the traces the site remembers, including your unapproved sign-out, the line that now counts every ring as your shift, the refusal you left in the file, and the prayers that now pass through you first. Titles, rules, and fragments sit deliberately off-axis; visible text occasionally corrupts itself, and unexplained distant knocks disturb the page. Scene transitions use a black veil, staggered reveals, scene-specific titles, and an opt-in WebAudio atmosphere (low drone, knocks, bells, a fluorescent hum and one faraway telephone ring inside the watch room) with a persistent mute control. Ash-and-ember particles, the `goddead` invocation, Konami miracle, arrival-based Reliquary unlock, idle whisper, and scripture-gaze secret remain woven into the experience.

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
