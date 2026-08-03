export async function onRequest(context) {
    const url = new URL(context.request.url)
    const hwid = url.searchParams.get("hwid")
    const step = url.searchParams.get("step")
    const provider = url.searchParams.get("provider")

    const ALLOWED_PROVIDERS = new Set(["linkvertise"]);

    if (!ALLOWED_PROVIDERS.has(provider)) {
      return json({ error: "invalid or unavailable provider" }, 400);
    }
    
    if (!hwid || !step || !provider) return json({ error: "missing params" }, 400)
    if (step !== "1" && step !== "2") return json({ error: "invalid step" }, 400)

    const oldAttemptId = await context.env.KEYS.get(`current_attempt:${hwid}:${step}`)
    if (oldAttemptId) {
        await context.env.KEYS.delete(`attempt:${oldAttemptId}`)
        await context.env.KEYS.delete(`current_attempt:${hwid}:${step}`)
    }

    const attemptId = crypto.randomUUID().replace(/-/g, "")
    const now = Date.now()
    const payload = {
        hwid, step, provider,
        status: "pending",
        startedAt: now,
        completedAt: null,
    }
    await context.env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(payload), { expirationTtl: 900 })
    await context.env.KEYS.put(`current_attempt:${hwid}:${step}`, attemptId, { expirationTtl: 900 })

    const cookie = `xp_attempt=${attemptId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=900`
    return new Response(JSON.stringify({ attemptId }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Set-Cookie": cookie }
    })
}
function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status, headers: { "Content-Type": "application/json" }
    })
}
