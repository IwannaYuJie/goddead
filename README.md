# Goddead

Static landing page for [goddead.com](https://goddead.com).

## Current Experience

The homepage is **The Living Shrine**, a hash-routed, scene-by-scene exploration game. Visitors knock three times at the sealed threshold — now a photographed bureau door — and are pulled through a chain of rooms where each completed action advances the ritual automatically.

The flow is linear and auto-advancing: three knocks open the door and lead into the **Visitor Protocol**; the first active activation of any rule sends the visitor down the **Scripture Corridor**; reading three crooked fragments reveals the **Third Night-Watch Room**; covering the 05:02 log entry and attempting sign-out unlock the **Echo Switchboard**; listening to the first three callback lines and connecting the fourth opens the **Dead Letter Office**; archiving three returns and signing the blank receipt spawn the **Divine Name Cancellation Office**; searching `GODDEAD` and refusing cancellation rewrite the refusal as an appointment at the **Acting Deity Desk**; pushing the presence switch to 100% returns the visitor to the **Offering** furnace; and offering the first prayer leaves the visitor in **Remembrance**, where the page records what it remembers. A hidden **Ninth Rule** remains accessible through the protocol anomaly and does not auto-cycle.

A unified, scene-scoped auto-advance scheduler handles every transition: it gives ~0.9–1.4 s of perceptible feedback in normal mode, shortens but remains understandable under reduced-motion, clears its timer on scene exit or repeated triggers, and never jumps on its own when persistent state is restored or a scene is opened directly by hash. Session-scoped consumed markers are only flipped inside each timer's `before` callback, so a transition cancelled by back-navigation can be re-armed by repeating the core action; persistent-state restoration or direct hash entry never arms a transition. Each switch scrolls to the top of the new scene and moves focus to its title. Only the directory drawer and explicit back-navigation remain; cross-scene shortcut buttons and bottom forward buttons on the linear path have been removed.

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
