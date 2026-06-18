export async function onRequest(context) {
    const url = new URL(context.request.url)
    const key = url.searchParams.get("key")
    if (!key) return json({ error: "missing key" }, 400)

    try {
        const checkUrl = `https://xploits.xyz/checkkey3?key=${encodeURIComponent(key)}&script=growagarden`
        const res = await fetch(checkUrl)
        const text = await res.text()

        if (text.trim() !== "valid") {
            return json({ error: "invalid key" }, 403)
        }

        return json({ valid: true, script: "https://xploits.xyz/api/gagspawner" })
    } catch {
        return json({ error: "verification failed" }, 500)
    }
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}
