/*
    Xploits - RDD
    Exploit status tracked by WEAO - weao.xyz, whatexpsare.online
*/

"use strict";

const RDD_HOST = "https://setup-aws.rbxcdn.com";

const EXTRACT_ROOTS = {
    player: {
        "RobloxApp.zip":                        "",
        "redist.zip":                           "",
        "shaders.zip":                          "shaders/",
        "ssl.zip":                              "ssl/",
        "WebView2.zip":                         "",
        "WebView2RuntimeInstaller.zip":         "WebView2RuntimeInstaller/",
        "content-avatar.zip":                   "content/avatar/",
        "content-configs.zip":                  "content/configs/",
        "content-fonts.zip":                    "content/fonts/",
        "content-sky.zip":                      "content/sky/",
        "content-sounds.zip":                   "content/sounds/",
        "content-textures2.zip":                "content/textures/",
        "content-models.zip":                   "content/models/",
        "content-platform-fonts.zip":           "PlatformContent/pc/fonts/",
        "content-platform-dictionaries.zip":    "PlatformContent/pc/shared_compression_dictionaries/",
        "content-terrain.zip":                  "PlatformContent/pc/terrain/",
        "content-textures3.zip":                "PlatformContent/pc/textures/",
        "extracontent-luapackages.zip":         "ExtraContent/LuaPackages/",
        "extracontent-translations.zip":        "ExtraContent/translations/",
        "extracontent-models.zip":              "ExtraContent/models/",
        "extracontent-textures.zip":            "ExtraContent/textures/",
        "extracontent-places.zip":              "ExtraContent/places/",
    },
    studio: {
        "RobloxStudio.zip":                     "",
        "RibbonConfig.zip":                     "RibbonConfig/",
        "redist.zip":                           "",
        "Libraries.zip":                        "",
        "LibrariesQt5.zip":                     "",
        "WebView2.zip":                         "",
        "WebView2RuntimeInstaller.zip":         "",
        "shaders.zip":                          "shaders/",
        "ssl.zip":                              "ssl/",
        "Qml.zip":                              "Qml/",
        "Plugins.zip":                          "Plugins/",
        "StudioFonts.zip":                      "StudioFonts/",
        "BuiltInPlugins.zip":                   "BuiltInPlugins/",
        "ApplicationConfig.zip":                "ApplicationConfig/",
        "BuiltInStandalonePlugins.zip":         "BuiltInStandalonePlugins/",
        "content-qt_translations.zip":          "content/qt_translations/",
        "content-sky.zip":                      "content/sky/",
        "content-fonts.zip":                    "content/fonts/",
        "content-avatar.zip":                   "content/avatar/",
        "content-models.zip":                   "content/models/",
        "content-sounds.zip":                   "content/sounds/",
        "content-configs.zip":                  "content/configs/",
        "content-api-docs.zip":                 "content/api_docs/",
        "content-textures2.zip":                "content/textures/",
        "content-studio_svg_textures.zip":      "content/studio_svg_textures/",
        "content-platform-fonts.zip":           "PlatformContent/pc/fonts/",
        "content-platform-dictionaries.zip":    "PlatformContent/pc/shared_compression_dictionaries/",
        "content-terrain.zip":                  "PlatformContent/pc/terrain/",
        "content-textures3.zip":                "PlatformContent/pc/textures/",
        "extracontent-translations.zip":        "ExtraContent/translations/",
        "extracontent-luapackages.zip":         "ExtraContent/LuaPackages/",
        "extracontent-textures.zip":            "ExtraContent/textures/",
        "extracontent-scripts.zip":             "ExtraContent/scripts/",
        "extracontent-models.zip":              "ExtraContent/models/",
        "studiocontent-models.zip":             "StudioContent/models/",
        "studiocontent-textures.zip":           "StudioContent/textures/",
    }
};

const BINARY_TYPES = {
    WindowsPlayer:   { blobDirs: { "x86-64": "" } },
    WindowsStudio64: { blobDirs: { "x86-64": "" } },
    MacPlayer:       { defaultArch: "arm64", blobDirs: { "arm64": "mac/arm64/", "x86-64": "mac/" } },
    MacStudio:       { defaultArch: "arm64", blobDirs: { "arm64": "mac/arm64/", "x86-64": "mac/" } },
};


const EXECUTOR_ICONS = {
    "Synapse Z":  "icons/synapsez.png",
    "Wave":       "icons/wave.png",
    "Potassium":  "icons/potassium.png",
    "Madium":     "https://getmadium.net/favicon.png",
    "Xeno":       "icons/download.png",
    "Seliware":   "icons/seliware.png",
    "Solara":     "icons/solara_2.png",
    "Velocity":   "icons/velocity.png",
    "Bunni.lol":  "icons/bunni.png",
    "Photon":     "icons/photon.png",
    "Matcha":     "icons/matcha.png",
    "Cosmic":     "icons/cosmic.png",
    "SirHurt":    "icons/sirhurt.png",
    "Serotonin":  "icons/serotonin.png",
    "Severe":     "icons/severe.png",
    "Lumen":      "icons/lumen.png",
};

function rddLog(msg, dim = false) {
    if (typeof window.xploitsLog === "function") {
        window.xploitsLog(msg, dim);
    } else {
        console.log(msg);
    }
}

function rddProgress(pct, msg, eta) {
    if (typeof window.xploitsProgress === "function") {
        window.xploitsProgress(pct, msg, eta);
    }
}

function getLink() {
    const form     = document.getElementById("form");
    const channel  = (document.getElementById("channel")?.value || "LIVE").trim();
    const bt       = document.getElementById("binaryType")?.value || "WindowsPlayer";
    const ver      = document.getElementById("version")?.value.trim() || "";
    const compress = document.getElementById("compressZip")?.checked || false;
    const level    = document.getElementById("compressionLevel")?.value || "1";
    const launcher = document.getElementById("includeLauncher")?.checked || false;
    const parallel = document.getElementById("parallelDownloads")?.checked || false;

    const base = window.location.href.split("?")[0];
    let url = `${base}?channel=${encodeURIComponent(channel)}&binaryType=${encodeURIComponent(bt)}`;
    if (ver)      url += `&version=${encodeURIComponent(ver)}`;
    if (compress) url += `&compressZip=true&compressionLevel=${encodeURIComponent(level)}`;
    if (launcher) url += `&includeLauncher=true`;
    if (parallel) url += `&parallelDownloads=true`;

    const exploit = document.getElementById("exploitChosenName")?.textContent || "";
    if (exploit) url += `&exploit=${encodeURIComponent(exploit)}`;

    return url;
}

function copy(btn) {
    navigator.clipboard.writeText(getLink()).then(() => {
        if (!btn) return;
        const orig = btn.innerHTML;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 12 4 10"/></svg> Copied!`;
        setTimeout(() => btn.innerHTML = orig, 1200);
    });
}

function dlLatest() {
    const channel    = (document.getElementById("channel")?.value || "LIVE").trim();
    const binaryType = document.getElementById("binaryType")?.value || "WindowsPlayer";
    beginDownload({ channel, binaryType, version: null, mode: "latest" });
}

function dlPrev() {
    const channel    = (document.getElementById("channel")?.value || "LIVE").trim();
    const binaryType = document.getElementById("binaryType")?.value || "WindowsPlayer";
    beginDownload({ channel, binaryType, version: null, mode: "prev" });
}

function dlHash() {
    const channel    = (document.getElementById("channel")?.value || "LIVE").trim();
    const binaryType = document.getElementById("binaryType")?.value || "WindowsPlayer";
    const version    = document.getElementById("version")?.value.trim() || null;
    beginDownload({ channel, binaryType, version, mode: "hash" });
}

async function beginDownload({ channel, binaryType, version, mode }) {
    const compress      = document.getElementById("compressZip")?.checked || false;
    const compressLevel = parseInt(document.getElementById("compressionLevel")?.value || "1");
    const parallel      = document.getElementById("parallelDownloads")?.checked !== false;

    if (!(binaryType in BINARY_TYPES)) {
        rddLog(`Error: unsupported binaryType "${binaryType}"`);
        return;
    }

    const btObj   = BINARY_TYPES[binaryType];
    const arch    = btObj.defaultArch || Object.keys(btObj.blobDirs)[0];
    const blobDir = btObj.blobDirs[arch];

    // Channel path
    // For LIVE Windows: https://setup-aws.rbxcdn.com/{version}-{pkg}
    // For non-LIVE:     https://setup-aws.rbxcdn.com/channel/{channel}/{version}-{pkg}
    // For Mac:          https://setup-aws.rbxcdn.com/mac/arm64/{version}-{pkg}
    let channelPath = RDD_HOST;
    if (channel !== "LIVE") {
        channelPath = `${RDD_HOST}/channel/${channel.toLowerCase()}`;
    }

    if (!version) {
        rddLog(`Fetching latest version hash for ${binaryType}…`, true);
        try {
            version = await resolveLatestVersion(channel, binaryType, mode);
        } catch (e) {
            rddLog(`Failed to resolve version: ${e.message}`);
            return;
        }
        rddLog(`Resolved version: ${version}`);
    } else {
        if (!version.startsWith("version-")) version = "version-" + version;
    }

    rddProgress(0, `Starting download for ${version}`, "");

    if (binaryType === "MacPlayer" || binaryType === "MacStudio") {
        const zipName  = binaryType === "MacPlayer" ? "RobloxPlayer.zip" : "RobloxStudioApp.zip";
        const blobUrl  = blobDir
            ? `${channelPath}/${blobDir}${version}-${zipName}`
            : `${channelPath}/${version}-${zipName}`;
        const outName  = `${channel}-${binaryType}-${version}.zip`;
        rddLog(`Downloading ${zipName}…`);
        try {
            const data = await fetchBinary(blobUrl, (loaded, total) => {
                const pct = total ? Math.round(loaded / total * 100) : 0;
                rddProgress(pct, `Downloading ${zipName} — ${fmtBytes(loaded)} / ${fmtBytes(total)}`, "");
            });
            triggerDownload(outName, data);
            rddLog(`Done! Saved as ${outName}`);
            rddProgress(100, "Download complete!", "");
        } catch (e) {
            rddLog(`Download failed: ${e.message}`);
        }
        return;
    }

    const sep = blobDir ? "/" : "";
    const versionBase = blobDir
        ? `${channelPath}/${blobDir}${version}-`
        : `${channelPath}/${version}-`;
    rddLog(`Fetching package manifest for ${version}@${channel}…`, true);

    let manifestText;
    try {
        manifestText = await fetchText(versionBase + "rbxPkgManifest.txt");
    } catch (_) {
        try {
            const fallbackBase = `${RDD_HOST}/channel/common${blobDir}${version}-`;
            manifestText = await fetchText(fallbackBase + "rbxPkgManifest.txt");
        } catch (e) {
            rddLog(`Failed to fetch manifest: ${e.message}`);
            return;
        }
    }

    const packages = parseManifest(manifestText);
    if (!packages) {
        rddLog("Error: unrecognised manifest format");
        return;
    }

    const isPlayer = packages.includes("RobloxApp.zip");
    const roots    = isPlayer ? EXTRACT_ROOTS.player : EXTRACT_ROOTS.studio;

    rddLog(`Found ${packages.length} packages to download`);
    rddProgress(2, `Downloading ${packages.length} packages…`, "");

    const zip = new JSZip();
    zip.file("AppSettings.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<Settings>\n\t<ContentFolder>content</ContentFolder>\n\t<BaseUrl>http://www.roblox.com</BaseUrl>\n</Settings>\n`);

    let totalBytes = 0;
    let loadedBytes = 0;
    let done = 0;
    const total = packages.length;

    function onChunk(loaded, pkgTotal) {
        const overall = Math.round(2 + (done / total) * 90 + (loaded / Math.max(pkgTotal, 1)) * (90 / total));
        const eta     = total - done > 0 ? `${(total - done) * 3}s left` : "";
        rddProgress(Math.min(overall, 92), `Downloading ${total} packages — package ${done + 1}/${total}`, eta);
    }

    async function downloadOne(pkgName) {
        const url  = versionBase + pkgName;
        rddLog(`Received "${pkgName}"!`);
        const data = await fetchBinary(url, onChunk);
        rddLog(`Extracting "${pkgName}"…`, true);

        const extractRoot = pkgName in roots ? roots[pkgName] : null;
        if (extractRoot === null) {
            zip.file(pkgName, data);
            rddLog(`Moved "${pkgName}" to root (no extract rule)`);
        } else {
            const inner = await JSZip.loadAsync(data);
            const fileJobs = [];
            inner.forEach((path, obj) => {
                if (path.endsWith("\\") || path.endsWith("/")) return;
                const fixed = path.replace(/\\/g, "/");
                fileJobs.push(obj.async("arraybuffer").then(d => zip.file(extractRoot + fixed, d)));
            });
            await Promise.all(fileJobs);
            rddLog(`Extracted "${pkgName}"!`);
        }
        done++;
    }

    try {
        if (parallel) {
            await Promise.all(packages.map(p => downloadOne(p)));
        } else {
            for (const p of packages) await downloadOne(p);
        }
    } catch (e) {
        rddLog(`Package download failed: ${e.message}`);
        return;
    }

    const outName = `${channel}-${binaryType}-${version}.zip`;
    rddLog(`Assembling "${outName}"…`, true);
    rddProgress(93, `Assembling final zip…`, "");

    if (compress) {
        rddLog(`Compressing at level ${compressLevel}/9 (may take a moment)…`, true);
    }

    const outputData = await zip.generateAsync({
        type: "arraybuffer",
        compression: compress ? "DEFLATE" : "STORE",
        compressionOptions: { level: compressLevel },
    }, ({ percent }) => {
        rddProgress(93 + Math.round(percent * 0.06), `Assembling final zip… ${Math.round(percent)}%`, "");
    });

    triggerDownload(outName, outputData);
    rddLog(`Done! Saved as ${outName}`);
    rddProgress(100, "Download complete!", "");
}

async function resolveLatestVersion(channel, binaryType, mode) {
    const isLatest = mode !== "prev";
    const endpoint = isLatest
        ? "https://weao.xyz/api/versions/current"
        : "https://weao.xyz/api/versions/past";

    const res = await fetch(endpoint, { headers: { "User-Agent": "WEAO-3PService" } });
    if (!res.ok) throw new Error(`WEAO versions API returned ${res.status}`);
    const data = await res.json();

    const isMac = binaryType.startsWith("Mac");
    const hash = isMac
        ? (data.Mac || data.mac || data.MacPlayer || data.macPlayer)
        : (data.Windows || data.windows || data.WindowsPlayer || data.windowsPlayer);

    if (!hash) {
        const ver = document.getElementById("version")?.value?.trim();
        if (ver) return ver.startsWith("version-") ? ver : "version-" + ver;
        throw new Error("Could not resolve version hash from WEAO API");
    }
    return hash;
}

function fetchText(url) {
    return fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
        return r.text();
    });
}

function fetchBinary(url, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onprogress = e => { if (e.lengthComputable && onProgress) onProgress(e.loaded, e.total); };
        xhr.onload = () => {
            if (xhr.status !== 200) { reject(new Error(`HTTP ${xhr.status} for ${url}`)); return; }
            resolve(xhr.response);
        };
        xhr.onerror = () => reject(new Error(`Network error fetching ${url}`));
        xhr.send();
    });
}

function parseManifest(text) {
    const lines = text.split("\n").map(l => l.trim());
    if (lines[0] !== "v0") return null;
    return lines.filter(l => l.endsWith(".zip"));
}

function triggerDownload(fileName, data) {
    const blob = new Blob([data], { type: "application/zip" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

function fmtBytes(n) {
    if (!n) return "0 B";
    if (n < 1024) return `${n} B`;
    if (n < 1048576) return `${(n/1024).toFixed(1)} KB`;
    return `${(n/1048576).toFixed(2)} MB`;
}

function getIcon(executor) {
    return EXECUTOR_ICONS[executor?.title] || null;
}

window.getLink         = getLink;
window.copyLink        = copy;
window.dlLatest        = dlLatest;
window.dlPrev          = dlPrev;
window.dlHash          = dlHash;
window.getExecutorIcon = getIcon;
window.EXECUTOR_ICONS  = EXECUTOR_ICONS;

window._rddDlLatest   = dlLatest;
window._rddDlPrev     = dlPrev;
window._rddDlHash     = dlHash;
window._rddCopyLink   = copyLink;
