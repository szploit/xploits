export async function onRequest(context) {
    const url = new URL(context.request.url)
    const hwid = url.searchParams.get("hwid")
    const step = url.searchParams.get("step")
    const provider = url.searchParams.get("provider") || "lootlabs"

    if (!hwid || !step) {
        return new Response("missing params", { status: 400 })
    }

    const attemptId = await context.env.KEYS.get(`current_attempt:${hwid}:${step}`)
    if (!attemptId) {
        return new Response("no active attempt", { status: 400 })
    }

    const attemptRaw = await context.env.KEYS.get(`attempt:${attemptId}`)
    if (!attemptRaw) {
        return new Response("invalid attempt", { status: 400 })
    }

    const attempt = JSON.parse(attemptRaw)
    if (attempt.status !== "pending") {
        return new Response("attempt not pending", { status: 400 })
    }

    attempt.status = "completed"
    attempt.completedAt = Date.now()
    await context.env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(attempt), {
        expirationTtl: 900
    })

    const redirectUrl = new URL(context.request.url)
    redirectUrl.pathname = `/key-system/${encodeURIComponent(hwid)}`
    redirectUrl.search = `?returned=1&step=${encodeURIComponent(step)}&provider=${encodeURIComponent(provider)}`
    return Response.redirect(redirectUrl.toString(), 302)
}
