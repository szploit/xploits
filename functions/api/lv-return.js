export async function onRequest(context) {
    const url = new URL(context.request.url)
    const cookie = context.request.headers.get("cookie") || ""
    const attemptId = url.searchParams.get("attempt") || getCookieValue(cookie, "xp_attempt")
    const hash = url.searchParams.get("hash")

    const verifyUrl = `https://publisher.linkvertise.com/api/v1/anti_bypassing?token=${encodeURIComponent(context.env.LINKVERTISE_AUTH_TOKEN)}&hash=${encodeURIComponent(hash || "")}`
    const verifyRes = await fetch(verifyUrl, {
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "*/*"
        }
    })
    const verifyText = (await verifyRes.text()).trim()

    return new Response(JSON.stringify({
        receivedHash: hash,
        attemptIdFromCookie: getCookieValue(cookie, "xp_attempt"),
        cookieHeader: cookie,
        tokenLength: context.env.LINKVERTISE_AUTH_TOKEN ? context.env.LINKVERTISE_AUTH_TOKEN.length : 0,
        tokenFirst10: context.env.LINKVERTISE_AUTH_TOKEN ? context.env.LINKVERTISE_AUTH_TOKEN.slice(0, 10) : null,
        verifyHttpStatus: verifyRes.status,
        verifyResponseText: verifyText.slice(0, 500)
    }, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
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
