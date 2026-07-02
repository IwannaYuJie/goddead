import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function fileText(path) {
  return readFile(new URL(path, root), "utf8");
}

await access(new URL("index.html", root));
await access(new URL("styles.css", root));
await access(new URL("script.js", root));
await access(new URL("assets/hero.png", root));
await access(new URL("docs/ProgressLog.md", root));

const html = await fileText("index.html");
assert.match(html, /<title>Goddead<\/title>/);
assert.match(html, /goddead\.com/);
assert.match(html, /styles\.css/);
assert.match(html, /script\.js/);
assert.match(html, /assets\/hero\.png/);

const css = await fileText("styles.css");
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media \(max-width: 720px\)/);

const js = await fileText("script.js");
assert.match(js, /DOMContentLoaded/);

const log = await fileText("docs/ProgressLog.md");
assert.match(log, /2026-07-02/);
assert.match(log, /Cloudflare Pages/);
