export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hwid = url.searchParams.get("hwid");

  if (!hwid) {
    return json({ error: "missing hwid" }, 400);
  }

  const existingRaw = await env.KEYS.get(`hwid-gag2fruit:${hwid}`);

  if (existingRaw) {
    const existing = JSON.parse(existingRaw);

    if (new Date() < new Date(existing.expires)) {
      return json({ key: existing.key, expires: existing.expires });
    }

    await env.KEYS.delete(existing.key);
    await env.KEYS.delete(`key-gag2fruit:${existing.key}`);
    await env.KEYS.delete(`hwid-gag2fruit:${hwid}`);
  }

  const stepsRaw = await env.KEYS.get(`steps:${hwid}`);

  if (!stepsRaw) {
    return json({ error: "steps not completed" }, 403);
  }

  const steps = JSON.parse(stepsRaw);

  if (!steps.step1) {
    return json({ error: "step required" }, 403);
  }

  const now = Date.now();

  if (now - steps.step1 > 3600000) {
    await env.KEYS.delete(`steps:${hwid}`);
    return json({ error: "step expired, please redo" }, 403);
  }

  const issuanceId = crypto.randomUUID().replaceAll("-", "");
  let genkeyRes;

  try {
    genkeyRes = await fetch("https://xploits.xyz/genkey3", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.ADMIN_SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({ script: "fruit", days: 1, issuanceId }),
    });
  } catch {
    return json({ error: "generator request failed" }, 502);
  }

  let genkeyData;

  try {
    genkeyData = await genkeyRes.json();
  } catch {
    return json({ error: "generator returned invalid response" }, 502);
  }

  if (!genkeyRes.ok || !genkeyData.key) {
    console.error("Fruit generation failed", { status: genkeyRes.status, error: genkeyData.error || "unknown" });
    return json({ error: "key generation failed" }, 502);
  }

  const keyData = {
    key: genkeyData.key,
    expires: genkeyData.expires,
    hwid,
    script: "gag2fruit",
    provider: steps.provider || "unknown",
    createdAt: new Date().toISOString(),
  };

  await env.KEYS.put(`hwid-gag2fruit:${hwid}`, JSON.stringify(keyData), { expirationTtl: 86400 });
  await env.KEYS.put(`key-gag2fruit:${genkeyData.key}`, JSON.stringify(keyData), { expirationTtl: 86400 });
  await env.KEYS.delete(`steps:${hwid}`);

  return json({ key: genkeyData.key, expires: genkeyData.expires });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
