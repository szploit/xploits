export async function onRequest(context) {
    const url = new URL(context.request.url)
    const key = url.searchParams.get("key")

    if (!key) return new Response("invalid")

    const raw = await context.env.KEYS.get(`key:${key}`)
    if (!raw) return new Response("invalid")

    const data = JSON.parse(raw)
    if (new Date() > new Date(data.expires)) {
        await context.env.KEYS.delete(`key:${key}`)
        await context.env.KEYS.delete(`hwid:${data.hwid}`)
        return new Response("expired")
    }

    return new Response("valid")
}
