import { issueScriptKey } from "../_lib/key-system.js";
export async function onRequest(context) { return issueScriptKey(context, { flowScript: "gag2fruit" }); }
