export async function onRequest(context) {
    const url = new URL(context.request.url)
    const cookie = context.request.headers.get("cookie") || ""
    const attemptId = url.searchParams.get("attempt") || getCookieValue(cookie, "xp_attempt")
    const ref = context.request.headers.get("referer") || ""

    // TEMP DEBUG
    return new Response(JSON.stringify({
        attemptId,
        referer: ref,
        cookie,
        search: url.search
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
