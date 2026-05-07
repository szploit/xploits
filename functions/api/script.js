export async function onRequest(context) {
    const userAgent = context.request.headers.get("user-agent") || ""

    if (!userAgent.includes("Roblox")) {
        return new Response("Not found", { status: 404 })
    }

    const script = await context.env.SCRIPTS.get("main")
    return new Response(script, { headers: { "Content-Type": "text/plain" } })
}
