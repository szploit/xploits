import { currentAttemptKey, readJsonKv, sha256, text, validAttemptId } from "../_lib/key-system.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const attemptId = url.searchParams.get("click_id");
  const uniqueId = url.searchParams.get("unique_id");
  const completedIp = url.searchParams.get("ip");

  console.log("LootLabs postback received", { secretPresent: Boolean(secret), secretMatches: secret === env.LOOTLABS_POSTBACK_SECRET, clickIdPresent: Boolean(attemptId), clickIdLength: attemptId?.length || 0, uniqueIdPresent: Boolean(uniqueId), ipPresent: Boolean(completedIp) });

  if (!secret || secret !== env.LOOTLABS_POSTBACK_SECRET) {
    return text("forbidden", 403);
  }

  if (!validAttemptId(attemptId)) {
    return text("invalid click ID", 400);
  }

  if (!uniqueId || uniqueId.length > 200) {
    return text("invalid unique ID", 400);
  }

  const attempt = await readJsonKv(env, `attempt:${attemptId}`);
  if (!attempt) {
    return text("invalid or expired attempt", 404);
  }

  if (attempt.provider !== "lootlabs") {
    return text("provider mismatch", 403);
  }

  if (attempt.status === "completed") {
    return text("ok");
  }

  if (attempt.status !== "pending") {
    return text("invalid attempt status", 409);
  }

  const startedAt = Number(attempt.startedAt);
  const now = Date.now();

  if (!Number.isSafeInteger(startedAt) || startedAt <= 0 || now < startedAt) {
    return text("invalid attempt time", 400);
  }

  if (now - startedAt > 900000) {
    return text("attempt expired", 403);
  }

  const currentAttemptId = await env.KEYS.get(currentAttemptKey(attempt.script, attempt.hwid, attempt.step));

  if (currentAttemptId !== attemptId) {
    return text("attempt is no longer current", 409);
  }

  const uniqueIdDigest = await sha256(uniqueId);
  const usedUniqueIdKey = `used-lootlabs-id:${uniqueIdDigest}`;
  const usedUniqueId = await env.KEYS.get(usedUniqueIdKey);

  if (usedUniqueId) {
    return text("duplicate conversion", 409);
  }

  attempt.status = "completed";
  attempt.completedAt = now;
  attempt.lootlabsUniqueIdDigest = uniqueIdDigest;
  attempt.completedIp = completedIp || null;

  await env.KEYS.put(usedUniqueIdKey, attemptId, { expirationTtl: 86400 });
  await env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(attempt), { expirationTtl: 900 });

  return text("ok");
}

export async function onRequest(context) {
  return text("method not allowed", 405, { "Allow": "GET" });
}
