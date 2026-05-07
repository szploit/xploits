export async function onRequest(context) {
    const url = new URL(context.request.url)
    const key = url.searchParams.get("key")

    if (!key) return new Response("invalid")

    const expiry = await context.env.KEYS.get(key)
    if (!expiry) return new Response("invalid")

    return new Response(expiry)
}
