import { readFileSync } from "node:fs";

export const inkRulesSource = readFileSync(new URL("../../ink-rules.js", import.meta.url), "utf8");
// Load the actual dependency in the caller realm, without touching Node globals.
export const inkRules = new Function("globalThis", `${inkRulesSource}\nreturn globalThis.GoddeadInkRules;`)({});
