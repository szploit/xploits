import { SCRIPT_RULES, STEP_TTL, currentAttemptKey, json, readJsonKv, stepsKey, validAttemptId, validHwid } from "../_lib/key-system.js";

const MIN_WAIT = Object.freeze({ linkvertise: 5000, lootlabs: 15000 });

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid JSON" }, 400); }
  const { hwid, provider, script, attemptId } = body || {};
  const step = String(body?.step || "");
  const rule = SCRIPT_RULES[script];
  if (!validHwid(hwid) || !validAttemptId(attemptId) || !rule || !MIN_WAIT[provider] || (step !== "1" && step !== "2")) return json({ error: "invalid request" }, 400);
  const attempt = await readJsonKv(env, `attempt:${attemptId}`);
  if (!attempt) return json({ error: "invalid or expired attempt" }, 410);
  if (attempt.hwid !== hwid || attempt.step !== step || attempt.provider !== provider || attempt.script !== script) return json({ error: "attempt mismatch" }, 403);
  if (attempt.status === "consumed") return json({ ok: true });
  if (attempt.status !== "completed") return json({ error: "not completed" }, 409);
  const startedAt = Number(attempt.startedAt);
  const completedAt = Number(attempt.completedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isSafeInteger(startedAt) || !Number.isSafeInteger(completedAt) || startedAt <= 0 || completedAt < startedAt) return json({ error: "invalid attempt timestamps" }, 403);
  if (elapsed < MIN_WAIT[provider]) return json({ error: "completed too quickly" }, 403);
  if (elapsed > 900000 || Date.now() - completedAt > STEP_TTL * 1000) return json({ error: "attempt expired" }, 410);
  const currentKey = currentAttemptKey(script, hwid, step);
  if (await env.KEYS.get(currentKey) !== attemptId) return json({ error: "attempt is no longer current" }, 409);
  const stateKey = stepsKey(script, hwid);
  const steps = (await readJsonKv(env, stateKey)) || { script, provider };
  if (steps.script !== script || steps.provider !== provider) return json({ error: "selection mismatch" }, 409);
  if (step === "2" && !steps.step1) return json({ error: "step 1 required" }, 409);
  steps[`step${step}`] = completedAt;
  await env.KEYS.put(stateKey, JSON.stringify(steps), { expirationTtl: STEP_TTL });
  attempt.status = "consumed";
  attempt.consumedAt = Date.now();
  await env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(attempt), { expirationTtl: 300 });
  await env.KEYS.delete(currentKey);
  return json({ ok: true });
}

export async function onRequest() { return json({ error: "method not allowed" }, 405, { Allow: "POST" }); }
