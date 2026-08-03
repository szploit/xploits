export async function onRequest(context) {
    const { request } = context

    let key
    try {
        const body = await request.json()
        key = body?.key
    } catch {
        return json({ error: "missing key" }, 400)
    }

    if (!key) return json({ error: "missing key" }, 400)

    try {
        const growagardenRes = await fetch(`https://xploits.xyz/checkkey3?key=${encodeURIComponent(key)}&script=growagarden`)
        if ((await growagardenRes.text()).trim() === "valid") {
            return json({ valid: true, script: "https://xploits.xyz/api/gagspawner" })
        }

        const fruitRes = await fetch(`https://xploits.xyz/checkkey3?key=${encodeURIComponent(key)}&script=fruit`)
        if ((await fruitRes.text()).trim() === "valid") {
            return json({ valid: true, script: "https://xploits.xyz/api/gagspawn" })
        }

        const adminRes = await fetch(`https://xploits.xyz/checkkey3?key=${encodeURIComponent(key)}&script=admin_panel`)
        if ((await adminRes.text()).trim() === "valid") {
            return json({ valid: true, script: "https://xploits.xyz/api/admin" })
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
