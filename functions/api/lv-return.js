export async function onRequest(context) {
    const cookie = context.request.headers.get("cookie") || ""
    const attemptId = url.searchParams.get("attempt") || getCookieValue(context.request.headers.get("cookie") || "", "xp_attempt")
    if (!attemptId) {
        return new Response("missing attempt cookie", { status: 400 })
    }

    const ref = context.request.headers.get("referer") || ""
    const allowedRef = [
        "linkvertise",
        "link-target",
        "loot-link",
        "lootlabs",
    ]
    const trustedReferrer = !ref || allowedRef.some((entry) => ref.toLowerCase().includes(entry))
    if (!trustedReferrer) {
        return new Response("invalid referrer", { status: 403 })
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
    redirectUrl.search = `returned=1&step=${encodeURIComponent(attempt.step)}&provider=${encodeURIComponent(attempt.provider)}`

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
