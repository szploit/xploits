export async function onRequest(context) {
    const url = new URL(context.request.url)
    const cookie = context.request.headers.get("cookie") || ""
    const attemptId = url.searchParams.get("attempt") || getCookieValue(cookie, "xp_attempt")
    const hash = url.searchParams.get("hash")

    const verifyUrl = `https://publisher.linkvertise.com/api/v1/anti_bypassing?token=${encodeURIComponent(context.env.LINKVERTISE_AUTH_TOKEN)}&hash=${encodeURIComponent(hash || "")}`
    const verifyRes = await fetch(verifyUrl, { method: "POST" })
    const verifyText = (await verifyRes.text()).trim()

    return new Response(JSON.stringify({
        receivedHash: hash,
        attemptId,
        tokenPresent: !!context.env.LINKVERTISE_AUTH_TOKEN,
        tokenLength: context.env.LINKVERTISE_AUTH_TOKEN ? context.env.LINKVERTISE_AUTH_TOKEN.length : 0,
        verifyHttpStatus: verifyRes.status,
        verifyResponseText: verifyText,
        fullSearch: url.search
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
