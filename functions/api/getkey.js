
export async function onRequest(context) {
    const url = new URL(context.request.url)
    const hwid = url.searchParams.get("hwid")

    if (!hwid) {
        return json({ error: "missing hwid" }, 400)
    }

    const existingRaw = await context.env.KEYS.get(`hwid:${hwid}`)
    if (existingRaw) {
        const existing = JSON.parse(existingRaw)
        if (new Date() < new Date(existing.expires)) {
            return json({ key: existing.key, expires: existing.expires })
        }
        await context.env.KEYS.delete(`key:${existing.key}`)
        await context.env.KEYS.delete(`hwid:${hwid}`)
    }

    const stepsRaw = await context.env.KEYS.get(`steps:${hwid}`)
    if (!stepsRaw) {
        return json({ error: "steps not completed" }, 403)
    }

    const steps = JSON.parse(stepsRaw)

    if (!steps.step1 || !steps.step2) {
        return json({ error: "both steps required" }, 403)
    }

    if (steps.step2 <= steps.step1) {
        return json({ error: "invalid step order" }, 403)
    }

    const now = Date.now()
    if (now - steps.step1 > 3600000 || now - steps.step2 > 3600000) {
        await context.env.KEYS.delete(`steps:${hwid}`)
        return json({ error: "steps expired — please redo" }, 403)
    }

    const newKey = "XPLOIT-" + crypto.randomUUID().split("-")[0].toUpperCase()
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 1)

    const keyData = {
        key: newKey,
        expires: expiry.toISOString(),
        hwid: hwid,
        provider: steps.provider || "unknown",
        createdAt: new Date().toISOString(),
    }

    await context.env.KEYS.put(`hwid:${hwid}`, JSON.stringify(keyData), { expirationTtl: 86400 })
    await context.env.KEYS.put(`key:${newKey}`, JSON.stringify(keyData), { expirationTtl: 86400 })

    await context.env.KEYS.delete(`steps:${hwid}`)

    return json({ key: newKey, expires: expiry.toISOString() })
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}
