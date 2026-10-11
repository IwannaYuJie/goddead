import { readFileSync } from "node:fs";

export const lightRulesSource = readFileSync(new URL("../../light-rules.js", import.meta.url), "utf8");
// Load the actual dependency in the caller realm, without touching Node globals.
export const lightRules = new Function("globalThis", `${lightRulesSource}\nreturn globalThis.GoddeadLightRules;`)({});
