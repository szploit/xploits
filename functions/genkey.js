export async function onRequest(context) {
    const url = new URL(context.request.url)
    const auth = url.searchParams.get("auth")

    if (auth !== context.env.ADMIN_SECRET) return new Response("forbidden", { status: 403 })

    const days = parseInt(url.searchParams.get("days")) || 1
    const newKey = "XPLOIT-" + crypto.randomUUID().split("-")[0].toUpperCase()

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + days)

    await context.env.KEYS.put(newKey, expiry.toISOString())

    return new Response(JSON.stringify({
        key: newKey,
        expires: expiry.toISOString()
    }), { headers: { "Content-Type": "application/json" } })
}
