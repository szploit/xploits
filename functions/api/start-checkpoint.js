export async function onRequest(context) {
    const url = new URL(context.request.url)
    const hwid = url.searchParams.get("hwid")
    const step = url.searchParams.get("step")
    const provider = url.searchParams.get("provider") || "unknown"

    if (!hwid || !step || !provider) {
        return json({ error: "missing params" }, 400)
    }

    if (step !== "1" && step !== "2") {
        return json({ error: "invalid step" }, 400)
    }

    const attemptId = crypto.randomUUID().replace(/-/g, "")
    const now = Date.now()
    const payload = {
        hwid,
        step,
        provider,
        status: "pending",
        startedAt: now,
        completedAt: null,
    }

    await context.env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(payload), {
        expirationTtl: 900
    })

    const cookie = `xp_attempt=${attemptId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=900`
    return new Response(JSON.stringify({ attemptId }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Set-Cookie": cookie,
        },
    })
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}
