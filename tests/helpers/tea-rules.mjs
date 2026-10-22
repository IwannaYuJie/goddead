import { readFileSync } from "node:fs";

export const teaRulesSource = readFileSync(new URL("../../tea-rules.js", import.meta.url), "utf8");
// Execute the real browser dependency without touching Node globals.
export const teaRules = new Function("globalThis", `${teaRulesSource}\nreturn globalThis.GoddeadTeaRules;`)({});
