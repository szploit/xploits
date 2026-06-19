

export async function onRequest(context) {
    const url = new URL(context.request.url)
    const hwid = url.searchParams.get("hwid")
    const step = url.searchParams.get("step")
    const attemptId = url.searchParams.get("attempt")
    const provider = url.searchParams.get("provider") || "unknown"

    if (!hwid || !step || !attemptId) {
        return new Response("missing params", { status: 400 })
    }

    const attemptRaw = await context.env.KEYS.get(`attempt:${attemptId}`)
    if (!attemptRaw) {
        return new Response("invalid_attempt")
    }
    const attempt = JSON.parse(attemptRaw)

    const MIN_WAIT_MS_BY_PROVIDER = {
        linkvertise: 5000,
        lootlabs: 15000,
    }
    const MIN_WAIT_MS = MIN_WAIT_MS_BY_PROVIDER[attempt.provider] || 30000
    const startedAt = Number(attempt.startedAt || 0)
    const completedAt = Number(attempt.completedAt || 0)
    const elapsed = completedAt - startedAt

    if (attempt.hwid !== hwid || attempt.step !== step) {
        return new Response("attempt_mismatch")
    }

    if (attempt.provider !== provider) {
        return new Response("provider_mismatch")
    }

    if (attempt.status !== "completed") {
        return new Response("not_completed")
    }

    if (elapsed < MIN_WAIT_MS) {
        return new Response("too_fast")
    }

    const MAX_WAIT_MS = 600000
    if (elapsed > MAX_WAIT_MS) {
        return new Response("expired_attempt")
    }

    if (startedAt <= 0 || completedAt <= 0 || completedAt < startedAt) {
        return new Response("invalid_timestamp")
    }

    const now = Date.now()

    const stepsKey = `steps:${hwid}`
    const existing = await context.env.KEYS.get(stepsKey)
    const stepsData = existing ? JSON.parse(existing) : {}

    if (step === "2" && !stepsData.step1) {
        return new Response("step1_required")
    }

    if (step === "1" && stepsData.step1 && stepsData.step2) {
        return new Response("already_completed")
    }    

    stepsData[`step${step}`] = now
    stepsData.provider = provider

    await context.env.KEYS.put(stepsKey, JSON.stringify(stepsData), {
        expirationTtl: 3600
    })
    await context.env.KEYS.delete(`attempt:${attemptId}`)

    return new Response("ok")
}
