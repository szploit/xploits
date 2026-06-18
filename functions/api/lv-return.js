export async function onRequest(context) {
    const url = new URL(context.request.url)
    const attemptId = url.searchParams.get("attempt")

    if (!attemptId) {
        return new Response("missing attempt", { status: 400 })
    }

    // Validate referrer — must come from Lootlabs
    const ref = context.request.headers.get("referer") || ""
    const allowedRef = ["lootlabs", "lootdest", "links.lootlabs.gg"]
    const trustedReferrer = !ref || allowedRef.some(r => ref.toLowerCase().includes(r))
    if (!trustedReferrer) {
        return new Response("invalid referrer", { status: 403 })
    }

    const attemptRaw = await context.env.KEYS.get(`attempt:${attemptId}`)
    if (!attemptRaw) {
        return new Response("invalid attempt", { status: 400 })
    }

    const attempt = JSON.parse(attemptRaw)

    if (attempt.status !== "pending") {
        return new Response("attempt not pending", { status: 400 })
    }

    const elapsed = Date.now() - Number(attempt.startedAt)
    if (elapsed < 15000) {
        return new Response("too fast", { status: 400 })
    }

    if (elapsed > 900000) {
        await context.env.KEYS.delete(`attempt:${attemptId}`)
        return new Response("attempt expired", { status: 400 })
    }

    attempt.status = "completed"
    attempt.completedAt = Date.now()
    await context.env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(attempt), { expirationTtl: 900 })

    const redirectUrl = new URL(context.request.url)
    redirectUrl.pathname = `/key-system/${encodeURIComponent(attempt.hwid)}`
    redirectUrl.search = `?returned=1&step=${encodeURIComponent(attempt.step)}&provider=${encodeURIComponent(attempt.provider)}`
    return Response.redirect(redirectUrl.toString(), 302)
}
