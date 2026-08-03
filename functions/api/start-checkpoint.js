import { ATTEMPT_TTL, PROVIDERS, SCRIPT_RULES, currentAttemptKey, json, rateLimit, readJsonKv, stepsKey, validHwid } from "../_lib/key-system.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!(await rateLimit(env, request, "checkpoint-start", 20, 60))) return json({ error: "rate limited" }, 429, { "Retry-After": "60" });
  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid JSON" }, 400); }
  const { hwid, provider, script } = body || {};
  const step = String(body?.step || "");
  const rule = SCRIPT_RULES[script];
  if (!validHwid(hwid)) return json({ error: "invalid hwid" }, 400);
  if (!rule) return json({ error: "invalid script" }, 400);
  if (!PROVIDERS.has(provider)) return json({ error: "invalid provider" }, 400);
  if (step !== "1" && step !== "2") return json({ error: "invalid step" }, 400);
  if (Number(step) > rule.steps) return json({ error: "step not used by this script" }, 400);
  const stateKey = stepsKey(script, hwid);
  if (step === "1") await env.KEYS.delete(stateKey);
  if (step === "2") {
    const steps = await readJsonKv(env, stateKey);
    if (!steps?.step1 || steps.script !== script || steps.provider !== provider) return json({ error: "step 1 required" }, 409);
  }
  const currentKey = currentAttemptKey(script, hwid, step);
  const oldAttemptId = await env.KEYS.get(currentKey);
  if (oldAttemptId) await env.KEYS.delete(`attempt:${oldAttemptId}`);
  const attemptId = crypto.randomUUID().replaceAll("-", "");
  const payload = { attemptId, hwid, step, provider, script, status: "pending", startedAt: Date.now(), completedAt: null };
  await env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(payload), { expirationTtl: ATTEMPT_TTL });
  await env.KEYS.put(currentKey, attemptId, { expirationTtl: ATTEMPT_TTL });
  return json({ attemptId }, 200, { "Set-Cookie": `xp_attempt=${attemptId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ATTEMPT_TTL}` });
}

export async function onRequest() { return json({ error: "method not allowed" }, 405, { Allow: "POST" }); }
