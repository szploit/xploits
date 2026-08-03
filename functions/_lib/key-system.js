export const SCRIPT_RULES = Object.freeze({ normal: { steps: 2, generatorScript: null, hwidKey: "hwid", keyAlias: "key" }, gag2: { steps: 2, generatorScript: "growagarden", hwidKey: "hwid-gag2", keyAlias: "key-gag2" }, gag2fruit: { steps: 1, generatorScript: "fruit", hwidKey: "hwid-gag2fruit", keyAlias: "key-gag2fruit" }, admin_panel: { steps: 2, generatorScript: "admin_panel", hwidKey: "hwid-admin-panel", keyAlias: "key-admin-panel" } });
export const PROVIDERS = new Set(["linkvertise", "lootlabs"]);
export const ATTEMPT_TTL = 900;
export const STEP_TTL = 3600;

export function validHwid(value) { return typeof value === "string" && /^[A-Za-z0-9_-]{10,128}$/.test(value); }
export function validAttemptId(value) { return typeof value === "string" && /^[a-f0-9]{32}$/.test(value); }
export function json(data, status = 200, extraHeaders = {}) { return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders } }); }
export function text(data, status = 200, extraHeaders = {}) { return new Response(data, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders } }); }
export function getCookie(cookieHeader, name) { for (const raw of cookieHeader.split(";")) { const part = raw.trim(); if (part.startsWith(`${name}=`)) { try { return decodeURIComponent(part.slice(name.length + 1)); } catch { return null; } } } return null; }
export async function readJsonKv(env, key) { const raw = await env.KEYS.get(key); if (!raw) return null; try { return JSON.parse(raw); } catch { await env.KEYS.delete(key); return null; } }
export async function sha256(value) { const bytes = new TextEncoder().encode(value); const digest = await crypto.subtle.digest("SHA-256", bytes); return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join(""); }
export function stepsKey(script, hwid) { return `steps:${script}:${hwid}`; }
export function currentAttemptKey(script, hwid, step) { return `current_attempt:${script}:${hwid}:${step}`; }

export async function rateLimit(env, request, bucket, maximum, ttl) { const ip = request.headers.get("CF-Connecting-IP") || "unknown"; const key = `rate:${bucket}:${ip}`; const raw = await env.KEYS.get(key); const count = Number.parseInt(raw || "0", 10); if (Number.isFinite(count) && count >= maximum) return false; await env.KEYS.put(key, String((Number.isFinite(count) ? count : 0) + 1), { expirationTtl: ttl }); return true; }

export async function issueScriptKey(context, config) {
  const { request, env } = context;
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405, { Allow: "POST" });
  if (typeof env.ADMIN_SECRET !== "string" || env.ADMIN_SECRET.length < 32) return json({ error: "server secret is not configured securely" }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid JSON" }, 400); }
  const hwid = body?.hwid;
  if (!validHwid(hwid)) return json({ error: "invalid hwid" }, 400);
  const rule = SCRIPT_RULES[config.flowScript];
  const existingKey = `${rule.hwidKey}:${hwid}`;
  const existing = await readJsonKv(env, existingKey);
  if (existing && Date.parse(existing.expires) > Date.now()) return json({ key: existing.key, expires: existing.expires });
  if (existing?.key) { await env.KEYS.delete(existing.key); await env.KEYS.delete(`${rule.keyAlias}:${existing.key}`); await env.KEYS.delete(existingKey); }
  const stateKey = stepsKey(config.flowScript, hwid);
  const steps = await readJsonKv(env, stateKey);
  if (!steps || steps.script !== config.flowScript || steps.provider !== body?.provider) return json({ error: "steps not completed for this selection" }, 403);
  if (!steps.step1 || (rule.steps === 2 && !steps.step2)) return json({ error: "all required steps must be completed" }, 403);
  if (rule.steps === 2 && steps.step2 <= steps.step1) return json({ error: "invalid step order" }, 403);
  const now = Date.now();
  if (now - steps.step1 > STEP_TTL * 1000 || (steps.step2 && now - steps.step2 > STEP_TTL * 1000)) { await env.KEYS.delete(stateKey); return json({ error: "steps expired, please redo" }, 403); }
  const issuanceId = (await sha256(`${config.flowScript}:${hwid}:${steps.step1}:${steps.step2 || 0}`)).slice(0, 32);
  let generated;
  if (rule.generatorScript) {
    const generatorUrl = new URL("/genkey3", request.url);
    let response;
    try { response = await fetch(generatorUrl, { method: "POST", headers: { "Authorization": `Bearer ${env.ADMIN_SECRET}`, "Content-Type": "application/json" }, body: JSON.stringify({ script: rule.generatorScript, days: 1, issuanceId }) }); } catch { return json({ error: "generator unavailable" }, 502); }
    try { generated = await response.json(); } catch { return json({ error: "invalid generator response" }, 502); }
    if (!response.ok || !generated?.key) return json({ error: generated?.error || "key generation failed" }, 502);
  } else {
    const key = `XPLOIT-${(await sha256(`normal:${issuanceId}:${env.ADMIN_SECRET}`)).slice(0, 8).toUpperCase()}`;
    const expires = new Date(now + 86400000).toISOString();
    generated = { key, expires };
    await env.KEYS.put(key, JSON.stringify({ expires, hwid, system: "v1", issuanceId, createdAt: new Date(now).toISOString() }), { expirationTtl: 86400 });
  }
  const ttl = Math.max(60, Math.ceil((Date.parse(generated.expires) - now) / 1000));
  const keyData = { key: generated.key, expires: generated.expires, hwid, script: config.flowScript, provider: steps.provider, createdAt: new Date(now).toISOString() };
  await env.KEYS.put(existingKey, JSON.stringify(keyData), { expirationTtl: ttl });
  await env.KEYS.put(`${rule.keyAlias}:${generated.key}`, JSON.stringify(keyData), { expirationTtl: ttl });
  await env.KEYS.put(`key-owner:${generated.key}`, JSON.stringify({ flowScript: config.flowScript, hwid, hwidKey: rule.hwidKey, keyAlias: rule.keyAlias }), { expirationTtl: ttl });
  await env.KEYS.delete(stateKey);
  return json({ key: generated.key, expires: generated.expires });
}
