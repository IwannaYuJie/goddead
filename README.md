# Goddead

Static landing page for [goddead.com](https://goddead.com).

## Current Experience

The homepage is **The Living Shrine**, now structured as a hash-routed exploration game instead of one long scroll. Visitors knock three times at the sealed threshold and choose whether to enter, read an interactive protocol whose seventh rule mutates toward a hidden ninth scene, cross a scripture corridor containing the Echo / Vein / Confession gates and a sealed Reliquary, burn a prayer, then inspect the traces the site remembers. Scene transitions use a black veil, staggered reveals, scene-specific titles, and an opt-in WebAudio atmosphere with a persistent mute control. Ash-and-ember particles, the `goddead` invocation, Konami miracle, arrival-based Reliquary unlock, idle whisper, and scripture-gaze secret remain woven into the experience.

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
