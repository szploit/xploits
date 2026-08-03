const SCRIPT_POLICIES = Object.freeze({
  spawner: { defaultDays: 1, maxDays: 30 },
  duper: { defaultDays: 1, maxDays: 30 },
  fruit: { defaultDays: 1, maxDays: 30 },
  growagarden: { defaultDays: 1, maxDays: 30 },
});

export async function onRequestPost(context) {
  const { request, env } = context;
  const authorization = request.headers.get("Authorization");

  if (!authorization || authorization !== `Bearer ${env.ADMIN_SECRET}`) {
    return json({ error: "forbidden" }, 403);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }

  const script = body?.script;
  const issuanceId = body?.issuanceId;
  const policy = SCRIPT_POLICIES[script];

  if (!policy) {
    return json({ error: "invalid script" }, 400);
  }

  if (typeof issuanceId !== "string" || !/^[a-f0-9]{32}$/.test(issuanceId)) {
    return json({ error: "invalid issuance ID" }, 400);
  }

  const requestedDays = body?.days ?? policy.defaultDays;

  if (!Number.isSafeInteger(requestedDays)) {
    return json({ error: "days must be a whole number" }, 400);
  }

  if (requestedDays < 1 || requestedDays > policy.maxDays) {
    return json({ error: `days must be between 1 and ${policy.maxDays}` }, 400);
  }

  const issuanceKey = `issuance:${issuanceId}`;
  const existingRaw = await env.KEYS.get(issuanceKey);

  if (existingRaw) {
    const existing = JSON.parse(existingRaw);

    if (existing.script !== script || existing.days !== requestedDays) {
      return json({ error: "issuance mismatch" }, 409);
    }

    return json(existing);
  }

  const key = crypto.randomUUID().replaceAll("-", "");
  const expires = new Date(Date.now() + requestedDays * 86400 * 1000).toISOString();
  const result = { key, expires, script, days: requestedDays, issuanceId };
  const keyData = { expires, hwid: null, script, days: requestedDays, issuanceId, createdAt: new Date().toISOString(), revokedAt: null };

  await env.KEYS.put(key, JSON.stringify(keyData), { expirationTtl: requestedDays * 86400 });
  await env.KEYS.put(issuanceKey, JSON.stringify(result), { expirationTtl: requestedDays * 86400 });

  return json(result, 201);
}

export async function onRequest(context) {
  return json({ error: "method not allowed" }, 405, { Allow: "POST" });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extraHeaders } });
}
