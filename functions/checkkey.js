export async function onRequest(context) {
    const uRl = new URL(context.request.url)
    const key = uRl.searchParams.get("key")

    if (!key) return new Response("invalid")

    const expiry = await context.env.KEYS.get(key)
    if (!expiry) return new Response("invalid")

    if (new Date() > new Date(expiry)) {
        await context.env.KEYS.delete(key)
        return new Response("expired")
    }

    return new Response("valid")
}
