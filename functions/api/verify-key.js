export async function onRequest(context) {
    const url = new URL(context.request.url)
    const key = url.searchParams.get("key")
    if (!key) return json({ error: "missing key" }, 400)
    try {
        const growagardenUrl = `https://xploits.xyz/checkkey3?key=${encodeURIComponent(key)}&script=growagarden`
        const growagardenRes = await fetch(growagardenUrl)
        const growagardenText = await growagardenRes.text()
        if (growagardenText.trim() === "valid") {
            return json({ valid: true, script: "https://xploits.xyz/api/gagspawner" })
        }
        const fruitUrl = `https://xploits.xyz/checkkey3?key=${encodeURIComponent(key)}&script=fruit`
        const fruitRes = await fetch(fruitUrl)
        const fruitText = await fruitRes.text()
        if (fruitText.trim() === "valid") {
            return json({ valid: true, script: "https://xploits.xyz/api/gagspawn" })
        }
        return json({ error: "invalid key" }, 403)
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
