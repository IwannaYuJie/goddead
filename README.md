# Goddead

Static landing page for [goddead.com](https://goddead.com).

## Current Experience

The homepage is **The Living Shrine**: a scrolling ritual in five movements — the altar (a struck-through `GOD` over `DEAD` wordmark with glitch bursts, parallax, and a typewriter verse cycle), a pair of scroll-driven scripture bands, the three gates (Echo / Vein / Confession) with monument artwork revealed on hover, a prayer-burning offering that feeds the Reliquary's state, and a traces section that counts what the site remembers about you. Ash-and-ember particles react to the cursor, a custom cursor replaces the native one on fine pointers, and the page is dense with easter eggs: the `goddead` invocation, the Konami miracle, seven arrivals to unseal the Reliquary, seven clicks on the wordmark, a midnight-visitor verse, an idle-silence whisper, and a hidden sentence in the scripture bands for those who stare long enough.

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
