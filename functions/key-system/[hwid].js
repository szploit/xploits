export async function onRequest(context) {
    const hwid = context.params.hwid

    const response = await context.env.ASSETS.fetch(
        new Request(new URL("/key-system.html", context.request.url))
    )

    let html = await response.text()

    html = html.replace(
        "let hwid = window.location.pathname.split",
        `let hwid = "${hwid}"\n  const _skip = window.location.pathname.split`
    )

    return new Response(html, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
    })
}
