export async function onRequest(context) {
    const url = new URL(context.request.url)
    const hwid = url.searchParams.get("hwid")
    if (!hwid) return json({ error: "missing hwid" }, 400)
    const existingRaw = await context.env.KEYS.get(`hwid-gag2fruit:${hwid}`)
    if (existingRaw) {
        const existing = JSON.parse(existingRaw)
        if (new Date() < new Date(existing.expires)) {
            return json({ key: existing.key, expires: existing.expires })
        }
        await context.env.KEYS.delete(`key-gag2fruit:${existing.key}`)
        await context.env.KEYS.delete(`hwid-gag2fruit:${hwid}`)
    }
    const stepsRaw = await context.env.KEYS.get(`steps:${hwid}`)
    if (!stepsRaw) return json({ error: "steps not completed" }, 403)
    const steps = JSON.parse(stepsRaw)
    if (!steps.step1) return json({ error: "step required" }, 403)
    const now = Date.now()
    if (now - steps.step1 > 3600000) {
        await context.env.KEYS.delete(`steps:${hwid}`)
        return json({ error: "step expired, please redo" }, 403)
    }
const issuanceId = crypto.randomUUID().replaceAll("-", "");

const genkeyRes = await fetch("https://xploits.xyz/genkey3", {
  method: "POST",
  headers: { "Authorization": `Bearer ${context.env.ADMIN_SECRET}`, "Content-Type": "application/json" },
  body: JSON.stringify({ script: "fruit", days: 1, issuanceId }),
});

const genkeyData = await genkeyRes.json();

    if (!genkeyRes.ok || !genkeyData.key) {
  console.error("GAG2 generation failed", { status: genkeyRes.status, error: genkeyData.error || "unknown" });
  return json({ error: "key generation failed" }, 500);
}
const genkeyData = await genkeyRes.json();
    if (!genkeyData.key) return json({ error: "key generation failed" }, 500)
    const keyData = {
        key: genkeyData.key,
        expires: genkeyData.expires,
        hwid,
        script: "gag2fruit",
        provider: steps.provider || "unknown",
        createdAt: new Date().toISOString()
    }
    await context.env.KEYS.put(`hwid-gag2fruit:${hwid}`, JSON.stringify(keyData), { expirationTtl: 86400 })
    await context.env.KEYS.put(`key-gag2fruit:${genkeyData.key}`, JSON.stringify(keyData), { expirationTtl: 86400 })
    await context.env.KEYS.delete(`steps:${hwid}`)
    return json({ key: genkeyData.key, expires: genkeyData.expires })
}
function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}
