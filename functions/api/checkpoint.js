

export async function onRequest(context) {
    const url = new URL(context.request.url)
    const hwid = url.searchParams.get("hwid")
    const step = url.searchParams.get("step")  
    const started = parseInt(url.searchParams.get("started"))
    const provider = url.searchParams.get("provider") || "unknown"

    if (!hwid || !step || !started || isNaN(started)) {
        return new Response("missing params", { status: 400 })
    }

    const now = Date.now()
    const elapsed = now - started

    const MIN_WAIT_MS = 30000
    if (elapsed < MIN_WAIT_MS) {
        return new Response("too_fast")
    }

    const MAX_WAIT_MS = 600000
    if (elapsed > MAX_WAIT_MS) {
        return new Response("expired_attempt")
    }

    if (started > now) {
        return new Response("invalid_timestamp")
    }

    const stepsKey = `steps:${hwid}`
    const existing = await context.env.KEYS.get(stepsKey)
    const stepsData = existing ? JSON.parse(existing) : {}

    if (step === "2" && !stepsData.step1) {
        return new Response("step1_required")
    }

    if (step === "1" && stepsData.step2) {
        return new Response("already_completed")
    }

    stepsData[`step${step}`] = now
    stepsData.provider = provider

    await context.env.KEYS.put(stepsKey, JSON.stringify(stepsData), {
        expirationTtl: 3600
    })

    return new Response("ok")
}
