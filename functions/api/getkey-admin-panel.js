export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hwid = url.searchParams.get("hwid");

  if (!hwid) {
    return json({ error: "missing hwid" }, 400);
  }

  const existingRaw = await env.KEYS.get(`hwid-admin-panel:${hwid}`);

  if (existingRaw) {
    const existing = JSON.parse(existingRaw);

    if (new Date() < new Date(existing.expires)) {
      return json({ key: existing.key, expires: existing.expires });
    }

    await env.KEYS.delete(existing.key);
    await env.KEYS.delete(`hwid-admin-panel:${hwid}`);
  }

  const stepsRaw = await env.KEYS.get(`steps:${hwid}`);

  if (!stepsRaw) {
    return json({ error: "steps not completed" }, 403);
  }

  const steps = JSON.parse(stepsRaw);

  if (!steps.step1 || !steps.step2) {
    return json({ error: "both steps required" }, 403);
  }

  if (steps.step2 <= steps.step1) {
    return json({ error: "invalid step order" }, 403);
  }

  const now = Date.now();

  if (now - steps.step1 > 3600000 || now - steps.step2 > 3600000) {
    await env.KEYS.delete(`steps:${hwid}`);
    return json({ error: "steps expired, please redo" }, 403);
  }

  const issuanceId = await createIssuanceId(`admin_panel:${hwid}:${steps.step1}:${steps.step2}`);

  let genkeyRes;

  try {
    genkeyRes = await fetch("https://xploits.xyz/genkey3", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.ADMIN_SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({ script: "admin_panel", days: 1, issuanceId }),
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
    console.error("Admin Panel generation failed", { status: genkeyRes.status, error: genkeyData.error || "unknown" });
    return json({ error: "key generation failed" }, 502);
  }

  const keyData = {
    key: genkeyData.key,
    expires: genkeyData.expires,
    hwid,
    script: "admin_panel",
    provider: steps.provider || "unknown",
    createdAt: new Date().toISOString(),
  };

  await env.KEYS.put(`hwid-admin-panel:${hwid}`, JSON.stringify(keyData), { expirationTtl: 86400 });
  await env.KEYS.delete(`steps:${hwid}`);

  return json({ key: genkeyData.key, expires: genkeyData.expires });
}

async function createIssuanceId(value) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
