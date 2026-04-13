import React, { useState } from 'react'

const tutorials = [
  {
    id: 'lua-state',
    tag: 'C++',
    tagColor: '#93c5fd',
    tagBg: 'rgba(147,197,253,0.08)',
    tagBorder: 'rgba(147,197,253,0.15)',
    title: 'Getting the Lua State',
    desc: 'How to retrieve the Lua state from Roblox\'s script context using offsets and decryption.',
    content: `To get the Lua state in a Roblox executor, you need to call GetGlobalState from the script context, then decrypt the result and create a new thread from it.

Here's a clean implementation:`,
    code: `lua_State* get_lua_state() {
    int32_t ignore = 2;
    uintptr_t ignore1 = { 0 };

    // Get the encrypted global state from the script context
    uintptr_t Gs = Roblox::GetGlobalState(
        get_script_context() + Offsets::LuaState::GlobalState,
        &ignore,
        &ignore1
    );

    // Decrypt the state and create a new thread
    lua_State* state = lua_newthread(
        (lua_State*)(Roblox::DecryptState(Gs + Offsets::LuaState::DecryptState))
    );

    return state;
}`,
    notes: [
      'Replace Offsets::LuaState::GlobalState and Offsets::LuaState::DecryptState with your current offsets.',
      'GetGlobalState and DecryptState are Roblox internals — you need to find and hook these yourself.',
      'The ignore variables are required parameters for GetGlobalState to work correctly.',
      'Store the returned lua_State* somewhere accessible for your execution pipeline.',
    ],
    link: null,
  },
  {
    id: 'offsets',
    tag: 'Offsets',
    tagColor: '#fbbf24',
    tagBg: 'rgba(251,191,36,0.08)',
    tagBorder: 'rgba(251,191,36,0.15)',
    title: 'Roblox Offsets',
    desc: 'Current Roblox memory offsets for executor development. Updated regularly.',
    content: 'Roblox offsets are memory addresses used to find internal structures like the Lua state, script context, and more. These change every Roblox update and need to be re-found after each patch.',
    code: null,
    notes: [
      'Offsets change every Roblox update — always verify after a new deployment.',
      'Use a pattern scanner to automate finding offsets instead of hardcoding them.',
    ],
    link: { label: 'View Offsets on Yub-X', url: 'https://yub-x.net/hyperion' },
  },
  {
    id: 'rivals-spoofer',
    tag: 'Lua Script',
    tagColor: '#4ade80',
    tagBg: 'rgba(74,222,128,0.08)',
    tagBorder: 'rgba(74,222,128,0.15)',
    title: 'Rivals Device Spoofer',
    desc: 'Spoof your device type in Rivals to change control scheme on the server side.',
    content: 'This script fires a remote to the server telling it you\'re on a different device. Useful for getting mobile/console aim assist or changing how the server treats your inputs.',
    code: `local deviceSpoofs = {
    Computer = "MouseKeyboard",
    Mobile   = "Touch",
    Console  = "Gamepad",
    VR       = "VR",
}

local function spoofDevice(deviceType)
    local targetDevice = deviceSpoofs[deviceType]
    if not targetDevice then
        warn("Invalid device type: " .. tostring(deviceType))
        return
    end

    game:GetService("ReplicatedStorage")
        :WaitForChild("Remotes")
        :WaitForChild("Replication")
        :WaitForChild("Fighter")
        :WaitForChild("SetControls")
        :FireServer(targetDevice)

    print("Spoofed device to: " .. targetDevice)
end

-- Usage: change "Mobile" to whichever device you want
spoofDevice("Mobile")`,
    notes: [
      'Valid options: "Computer", "Mobile", "Console", "VR"',
      'This fires a legitimate game remote — it\'s not patching memory.',
      'May stop working if Rivals updates their remote structure.',
    ],
    link: { label: 'Join Rivals Cheating Discord', url: 'https://discord.gg/rsdu3mzw' },
  },
  {
    id: 'roblox-math',
    tag: 'C++ / Math',
    tagColor: '#f87171',
    tagBg: 'rgba(248,113,113,0.08)',
    tagBorder: 'rgba(248,113,113,0.15)',
    title: 'Roblox Math Types',
    desc: 'C++ implementations of Roblox math types: Vector2, Vector3, UDim2, CFrame and more.',
    content: 'These are clean C++ implementations of the core Roblox math types you\'ll need when building an executor or cheat. Includes Vector2, Vector3, UDim, UDim2, and CFrame with all standard operations.',
    code: `// Vector3 example
struct Vector3 {
    float x{}, y{}, z{};

    Vector3 operator+(const Vector3& v) const { return {x+v.x, y+v.y, z+v.z}; }
    Vector3 operator-(const Vector3& v) const { return {x-v.x, y-v.y, z-v.z}; }
    Vector3 operator*(float s)          const { return {x*s,   y*s,   z*s};   }

    float magnitude() const { return std::sqrt(x*x + y*y + z*z); }
    Vector3 unit()    const { float m = magnitude(); return m > 1e-6f ? (*this)/m : Vector3{}; }

    static float  dot  (const Vector3& a, const Vector3& b) { return a.x*b.x + a.y*b.y + a.z*b.z; }
    static Vector3 cross(const Vector3& a, const Vector3& b) {
        return { a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x };
    }
    static Vector3 lerp(const Vector3& a, const Vector3& b, float t) { return a + (b-a)*t; }
};

// CFrame lookAt example
CFrame lookAt(const Vector3& eye, const Vector3& target) {
    Vector3 f = (target - eye).unit();
    Vector3 r = Vector3::cross(Vector3{0,1,0}, f).unit();
    Vector3 u = Vector3::cross(f, r);
    return CFrame(r.x,r.y,r.z, u.x,u.y,u.z, f.x,f.y,f.z, eye);
}`,
    notes: [
      'Full implementation includes Vector2, Vector3, UDim, UDim2, and CFrame.',
      'CFrame uses a 3x3 rotation matrix + position vector (standard Roblox layout).',
      'All types use float precision — use double if you need more accuracy.',
    ],
    link: null,
  },
  {
    id: 'imgui',
    tag: 'ImGui',
    tagColor: '#a78bfa',
    tagBg: 'rgba(167,139,250,0.08)',
    tagBorder: 'rgba(167,139,250,0.15)',
    title: 'Free ImGui Designs',
    desc: 'Free ImGui themes and designs for cheat menus.',
    content: 'A collection of free ImGui themes you can drop into your cheat menu. These cover dark, minimal, and gaming aesthetics. Most are header-only and just need you to call the style function before your ImGui render loop.',
    code: `// Example: Dark red theme
void ApplyRedTheme() {
    ImGuiStyle& style = ImGui::GetStyle();
    style.WindowRounding    = 6.0f;
    style.FrameRounding     = 4.0f;
    style.ScrollbarRounding = 4.0f;
    style.GrabRounding      = 3.0f;

    ImVec4* colors = style.Colors;
    colors[ImGuiCol_WindowBg]       = ImVec4(0.06f, 0.06f, 0.06f, 0.96f);
    colors[ImGuiCol_Header]         = ImVec4(0.55f, 0.08f, 0.10f, 0.80f);
    colors[ImGuiCol_HeaderHovered]  = ImVec4(0.70f, 0.10f, 0.13f, 0.90f);
    colors[ImGuiCol_HeaderActive]   = ImVec4(0.85f, 0.12f, 0.16f, 1.00f);
    colors[ImGuiCol_Button]         = ImVec4(0.55f, 0.08f, 0.10f, 0.80f);
    colors[ImGuiCol_ButtonHovered]  = ImVec4(0.70f, 0.10f, 0.13f, 0.90f);
    colors[ImGuiCol_ButtonActive]   = ImVec4(0.85f, 0.12f, 0.16f, 1.00f);
    colors[ImGuiCol_FrameBg]        = ImVec4(0.12f, 0.12f, 0.12f, 0.80f);
    colors[ImGuiCol_FrameBgHovered] = ImVec4(0.18f, 0.18f, 0.18f, 0.90f);
    colors[ImGuiCol_CheckMark]      = ImVec4(0.90f, 0.20f, 0.22f, 1.00f);
    colors[ImGuiCol_SliderGrab]     = ImVec4(0.80f, 0.15f, 0.18f, 1.00f);
    colors[ImGuiCol_TitleBgActive]  = ImVec4(0.50f, 0.07f, 0.09f, 1.00f);
}`,
    notes: [
      'Call ApplyRedTheme() once after ImGui::CreateContext() and before your render loop.',
      'Tweak the alpha values (4th float) to adjust transparency.',
      'More free themes available on GitHub — search "imgui themes" or "imgui style".',
    ],
    link: null,
  },
]

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ position: 'relative', marginTop: 12 }}>
      <button onClick={copy} style={{
        position: 'absolute', top: 10, right: 10,
        padding: '4px 10px', borderRadius: 6,
        background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)',
        border: '1px solid ' + (copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'),
        color: copied ? '#4ade80' : 'var(--muted)',
        cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
        transition: 'all 0.2s', zIndex: 1,
      }}>{copied ? '✓ Copied' : 'Copy'}</button>
      <pre style={{
        background: '#0a0a0a', border: '1px solid var(--muted2)',
        borderRadius: 8, padding: '1rem 1rem 1rem 1rem',
        overflowX: 'auto', margin: 0,
        fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
        lineHeight: 1.7, color: '#e2e8f0',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function TutorialCard({ t, i }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid ' + (open ? 'rgba(230,57,70,0.25)' : 'var(--muted2)'),
      borderRadius: 12, overflow: 'hidden',
      animation: 'fadeUp 0.4s ease both', animationDelay: i * 0.07 + 's',
      transition: 'border-color 0.2s',
    }}>
      {/* Header - always visible */}
      <div onClick={() => setOpen(o => !o)} style={{
        padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex',
        alignItems: 'center', gap: 12,
        transition: 'background 0.15s',
        background: open ? 'rgba(230,57,70,0.04)' : 'transparent',
      }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600,
              color: t.tagColor, background: t.tagBg, border: '1px solid ' + t.tagBorder,
              padding: '2px 8px', borderRadius: 4,
            }}>{t.tag}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{t.title}</h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: 0 }}>{t.desc}</p>
        </div>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: open ? 'rgba(230,57,70,0.12)' : 'var(--surface)',
          border: '1px solid ' + (open ? 'rgba(230,57,70,0.3)' : 'var(--muted2)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? 'var(--red)' : 'var(--muted)', fontSize: '0.75rem',
          flexShrink: 0, transition: 'all 0.2s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>▼</div>
      </div>

      {/* Expanded content */}
      {open && (
        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--muted2)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7, marginTop: '1rem', marginBottom: 0 }}>{t.content}</p>
          {t.code && <CodeBlock code={t.code} />}
          {t.notes && t.notes.length > 0 && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.12)', borderRadius: 8 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24', marginBottom: 8 }}>Notes</p>
              {t.notes.map((n, i) => (
                <p key={i} style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.6, margin: '4px 0' }}>
                  <span style={{ color: '#fbbf24', marginRight: 6 }}>·</span>{n}
                </p>
              ))}
            </div>
          )}
          {t.link && (
            <a href={t.link.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 14, textDecoration: 'none',
              padding: '7px 16px', borderRadius: 8,
              background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.25)',
              color: '#ff8b8b', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,57,70,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(230,57,70,0.1)' }}
            >{t.link.label} ↗</a>
          )}
        </div>
      )}
    </div>
  )
}

export default function Tutorials() {
  const [search, setSearch] = useState('')
  const filtered = tutorials.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.tag.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'var(--red)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Tutorials</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Roblox exploiting guides, scripts, and resources</p>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tutorials..." style={{ background: 'var(--bg-card)', border: '1px solid var(--muted2)', borderRadius: 8, padding: '8px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', width: 240 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((t, i) => <TutorialCard key={t.id} t={t} i={i} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>No tutorials match your search.</div>
      )}
    </div>
  )
}
