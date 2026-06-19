export async function onRequest(context) {
    const url = new URL(context.request.url)
    const cookie = context.request.headers.get("cookie") || ""
    const attemptId = url.searchParams.get("attempt") || getCookieValue(cookie, "xp_attempt")
    const hash = url.searchParams.get("hash")

    if (!attemptId) {
        return new Response("missing attempt", { status: 400 })
    }
    if (!hash) {
        return new Response("missing hash", { status: 400 })
    }

    const verifyUrl = `https://publisher.linkvertise.com/api/v1/anti_bypassing?token=${encodeURIComponent(context.env.LINKVERTISE_AUTH_TOKEN)}&hash=${encodeURIComponent(hash)}`
    const verifyRes = await fetch(verifyUrl, {
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "*/*"
        }
    })

    let verifyData
    try {
        verifyData = await verifyRes.json()
    } catch {
        return new Response("hash verification error", { status: 502 })
    }

    if (verifyData.status !== true) {
        return new Response("hash verification failed", { status: 403 })
    }

    const attemptRaw = await context.env.KEYS.get(`attempt:${attemptId}`)
    if (!attemptRaw) {
        return new Response("invalid attempt", { status: 400 })
    }

    const attempt = JSON.parse(attemptRaw)
    if (attempt.status !== "pending") {
        return new Response("attempt not pending", { status: 400 })
    }

    attempt.status = "completed"
    attempt.completedAt = Date.now()
    await context.env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(attempt), {
        expirationTtl: 900
    })

    const redirectUrl = new URL(context.request.url)
    redirectUrl.pathname = `/key-system/${encodeURIComponent(attempt.hwid)}`
    redirectUrl.search = `?returned=1&step=${encodeURIComponent(attempt.step)}&provider=${encodeURIComponent(attempt.provider)}`
    return Response.redirect(redirectUrl.toString(), 302)
}

function getCookieValue(cookieHeader, name) {
    const cookies = cookieHeader.split(";")
    for (const raw of cookies) {
        const part = raw.trim()
        if (part.startsWith(name + "=")) {
            return decodeURIComponent(part.slice(name.length + 1))
        }
    }
    return null
}
