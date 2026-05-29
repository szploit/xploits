export async function onRequest(con) {
    const url = new URL(con.request.url)
    const auth = url.searchParams.get("auth")
    const key = url.searchParams.get("key")

    if (auth !== con.env.ADMIN_SECRET) return new Response("forbidden", { status: 403 })
    if (!key) return new Response("missing key", { status: 400 })

    await con.env.KEYS.delete(key)
    return new Response("deleted")
}
