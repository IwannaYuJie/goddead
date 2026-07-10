# Goddead

Static landing page for [goddead.com](https://goddead.com).

## Current Experience

The homepage uses the **Split Testament** direction: a fractured `GOD / DEAD` wordmark, an archival scripture field, and three interactive gates leading to the existing Echo, Vein, and Confession experiences. The red ritual point, directory drawer, arrival counter, keyboard invocation, and hidden Reliquary route preserve the site's exploratory character across desktop and mobile.

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
