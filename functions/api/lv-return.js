export async function onRequest(context) {
    const url = new URL(context.request.url)
    const attemptId = url.searchParams.get("attempt")
    const ref = context.request.headers.get("referer") || ""

    if (!attemptId) {
        return new Response("missing attempt", { status: 400 })
    }

    const attemptRaw = await context.env.KEYS.get(`attempt:${attemptId}`)

    // TEMP DEBUG - shows exactly what's happening
    return new Response(JSON.stringify({
        receivedAttemptId: attemptId,
        foundInKV: !!attemptRaw,
        attemptData: attemptRaw ? JSON.parse(attemptRaw) : null,
        referer: ref,
    }, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
}
