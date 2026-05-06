export async function onRequest(context) {
    const url = new URL(context.request.url)
    const auth = url.searchParams.get("auth")
    const key = url.searchParams.get("key")

    if (auth !== context.env.ADMIN_SECRET) return new Response("forbidden", { status: 403 })
    if (!key) return new Response("missing key", { status: 400 })

    await context.env.KEYS.delete(key)
    return new Response("revoked")
}
