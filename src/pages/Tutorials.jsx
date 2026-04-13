import React, { useState } from 'react'

const tutorials = [
  {
    id: 'lua-state',
    tag: 'C++',
    tagColor: '#93c5fd',
    tagBg: 'rgba(147,197,253,0.08)',
    tagBorder: 'rgba(147,197,253,0.15)',
    title: 'Getting the Lua State',
    desc: 'How to get the Lua state from Roblox\'s script context using offsets and decryption.',
    content: `To get the Lua state in a Roblox executor, you need to call GetGlobalState from the script context, then decrypt the result and create a new thread from it.

Here's a source:`,
    code: `lua_State* get_lua_state() {
    int32_t ignore = 2;
    uintptr_t ignore1 = { 0 };

    uintptr_t Gs = Roblox::GetGlobalState(
        get_script_context() + Offsets::LuaState::GlobalState,
        &ignore,
        &ignore1
    );

    lua_State* state = lua_newthread(
        (lua_State*)(Roblox::DecryptState(Gs + Offsets::LuaState::DecryptState))
    );

    return state;
}`,
    notes: [
      'Replace Offsets::LuaState::GlobalState and Offsets::LuaState::DecryptState with your current offsets.',
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
    desc: 'Current roblox memory offsets used for developing executors, updated daily by the Yub-X website owner',
    content: 'Roblox offsets are memory addresses used to find internal structures These change every Roblox update and need to be reversed after each update.',
    code: null,
    notes: [
      'Offsets change every Roblox update.',
      'Use IDA, Ghidra, or a Pattern Scanner to grab them.',
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
    local device = deviceSpoofs[deviceType]

    game:GetService("ReplicatedStorage")
        :WaitForChild("Remotes")
        :WaitForChild("Replication")
        :WaitForChild("Fighter")
        :WaitForChild("SetControls")
        :FireServer(device)
end

spoofDevice("Mobile")`,
    notes: [
      'Valid options: "Computer", "Mobile", "Console", "VR"',
      'This fires a legitimate game remote.',
      'May stop working if Rivals updates their remote structure.',
    ],
  },
  {
    id: 'roblox-math',
    tag: 'C++ / Math',
    tagColor: '#f87171',
    tagBg: 'rgba(248,113,113,0.08)',
    tagBorder: 'rgba(248,113,113,0.15)',
    title: 'Roblox Math Types',
    desc: 'C++ implementations of Roblox math types: Vector2, Vector3, UDim2, CFrame and more.',
    content: 'These are clean C++ sources of the Roblox math types you\'ll need when building an external. Includes Vector2, Vector3, UDim, UDim2, and CFrame with all standard operations.',
    code: `#pragma once
#include <cmath>
#include <algorithm>

namespace rbx {

constexpr float kEps = 1e-6f;
inline bool feq(float a, float b, float e=kEps){ return std::fabs(a-b)<=e; }

struct Vector2 {
    float x{}, y{};
    constexpr Vector2()=default;
    constexpr Vector2(float X,float Y):x(X),y(Y){}
    static constexpr Vector2 zero(){ return {}; }
    static constexpr Vector2 one(){ return {1.f,1.f}; }
    constexpr Vector2 operator+(const Vector2& v) const { return {x+v.x,y+v.y}; }
    constexpr Vector2 operator-(const Vector2& v) const { return {x-v.x,y-v.y}; }
    constexpr Vector2 operator*(float s) const { return {x*s,y*s}; }
    constexpr Vector2 operator/(float s) const { return {x/s,y/s}; }
    Vector2& operator+=(const Vector2& v){ x+=v.x; y+=v.y; return *this; }
    Vector2& operator-=(const Vector2& v){ x-=v.x; y-=v.y; return *this; }
    Vector2& operator*=(float s){ x*=s; y*=s; return *this; }
    Vector2& operator/=(float s){ x/=s; y/=s; return *this; }
    constexpr bool operator==(const Vector2& v) const { return feq(x,v.x)&&feq(y,v.y); }
    constexpr bool operator!=(const Vector2& v) const { return !(*this==v); }
    float magnitude() const { return std::sqrt(x*x+y*y); }
    float sqrMagnitude() const { return x*x+y*y; }
    Vector2 unit() const { float m=magnitude(); return m>kEps?(*this)/m:Vector2{}; }
    static float dot(const Vector2&a,const Vector2&b){ return a.x*b.x+a.y*b.y; }
    static Vector2 lerp(const Vector2&a,const Vector2&b,float t){ return a+(b-a)*t; }
};
inline Vector2 operator*(float s,const Vector2&v){ return v*s; }

struct Vector3 {
    float x{}, y{}, z{};
    constexpr Vector3()=default;
    constexpr Vector3(float X,float Y,float Z):x(X),y(Y),z(Z){}
    static constexpr Vector3 zero(){ return {}; }
    static constexpr Vector3 one(){ return {1.f,1.f,1.f}; }
    static constexpr Vector3 up(){ return {0.f,1.f,0.f}; }
    static constexpr Vector3 right(){ return {1.f,0.f,0.f}; }
    static constexpr Vector3 back(){ return {0.f,0.f,1.f}; }
    constexpr Vector3 operator+(const Vector3& v) const { return {x+v.x,y+v.y,z+v.z}; }
    constexpr Vector3 operator-(const Vector3& v) const { return {x-v.x,y-v.y,z-v.z}; }
    constexpr Vector3 operator*(float s) const { return {x*s,y*s,z*s}; }
    constexpr Vector3 operator/(float s) const { return {x/s,y/s,z/s}; }
    Vector3& operator+=(const Vector3& v){ x+=v.x; y+=v.y; z+=v.z; return *this; }
    Vector3& operator-=(const Vector3& v){ x-=v.x; y-=v.y; z-=v.z; return *this; }
    Vector3& operator*=(float s){ x*=s; y*=s; z*=s; return *this; }
    Vector3& operator/=(float s){ x/=s; y/=s; z/=s; return *this; }
    constexpr bool operator==(const Vector3& v) const { return feq(x,v.x)&&feq(y,v.y)&&feq(z,v.z); }
    constexpr bool operator!=(const Vector3& v) const { return !(*this==v); }
    float magnitude() const { return std::sqrt(x*x+y*y+z*z); }
    float sqrMagnitude() const { return x*x+y*y+z*z; }
    Vector3 unit() const { float m=magnitude(); return m>kEps?(*this)/m:Vector3{}; }
    static float dot(const Vector3&a,const Vector3&b){ return a.x*b.x+a.y*b.y+a.z*b.z; }
    static Vector3 cross(const Vector3&a,const Vector3&b){ return {a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x}; }
    static Vector3 lerp(const Vector3&a,const Vector3&b,float t){ return a+(b-a)*t; }
};
inline Vector3 operator*(float s,const Vector3&v){ return v*s; }

struct UDim {
    float Scale{0.f};
    float Offset{0.f};
    constexpr UDim()=default;
    constexpr UDim(float s,float o):Scale(s),Offset(o){}
    static constexpr UDim fromScale(float s){ return {s,0.f}; }
    static constexpr UDim fromOffset(float o){ return {0.f,o}; }
    constexpr UDim operator+(const UDim& u) const { return {Scale+u.Scale,Offset+u.Offset}; }
    constexpr UDim operator-(const UDim& u) const { return {Scale-u.Scale,Offset-u.Offset}; }
};

struct UDim2 {
    UDim X{}, Y{};
    constexpr UDim2()=default;
    constexpr UDim2(UDim x,UDim y):X(x),Y(y){}
    static constexpr UDim2 fromScale(float sx,float sy){ return {UDim{sx,0.f},UDim{sy,0.f}}; }
    static constexpr UDim2 fromOffset(float ox,float oy){ return {UDim{0.f,ox},UDim{0.f,oy}}; }
    constexpr UDim2 operator+(const UDim2& u) const { return {X+u.X,Y+u.Y}; }
    constexpr UDim2 operator-(const UDim2& u) const { return {X-u.X,Y-u.Y}; }
    static Vector2 resolve(const UDim2& u,float w,float h){ return {u.X.Scale*w+u.X.Offset,u.Y.Scale*h+u.Y.Offset}; }
    static UDim2 lerp(const UDim2&a,const UDim2&b,float t){
        return UDim2(
            UDim(a.X.Scale+(b.X.Scale-a.X.Scale)*t, a.X.Offset+(b.X.Offset-a.X.Offset)*t),
            UDim(a.Y.Scale+(b.Y.Scale-a.Y.Scale)*t, a.Y.Offset+(b.Y.Offset-a.Y.Offset)*t)
        );
    }
    UDim width() const { return X; }
    UDim height() const { return Y; }
};

struct CFrame {
    float r00{1},r01{0},r02{0};
    float r10{0},r11{1},r12{0};
    float r20{0},r21{0},r22{1};
    Vector3 p{0,0,0};
    constexpr CFrame()=default;
    constexpr CFrame(const Vector3& pos):p(pos){}
    constexpr CFrame(float R00,float R01,float R02,float R10,float R11,float R12,float R20,float R21,float R22,const Vector3& pos)
        :r00(R00),r01(R01),r02(R02),r10(R10),r11(R11),r12(R12),r20(R20),r21(R21),r22(R22),p(pos){}
    static CFrame fromEulerXYZ(float rx,float ry,float rz){
        float cx=std::cos(rx),sx=std::sin(rx),cy=std::cos(ry),sy=std::sin(ry),cz=std::cos(rz),sz=std::sin(rz);
        float R00=cz*cy, R01=cz*sy*sx - sz*cx, R02=cz*sy*cx + sz*sx;
        float R10=sz*cy, R11=sz*sy*sx + cz*cx, R12=sz*sy*cx - cz*sx;
        float R20=-sy,   R21=cy*sx,            R22=cy*cx;
        return CFrame(R00,R01,R02,R10,R11,R12,R20,R21,R22,{0,0,0});
    }
    static CFrame lookAt(const Vector3& eye,const Vector3& target,const Vector3& upHint=Vector3::up()){
        Vector3 f=(target-eye).unit();
        Vector3 r=Vector3::cross(upHint.unit(),f).unit();
        Vector3 u=Vector3::cross(f,r);
        return CFrame(r.x,r.y,r.z,u.x,u.y,u.z,f.x,f.y,f.z,eye);
    }
    CFrame operator*(const CFrame& b) const {
        CFrame o;
        o.r00=r00*b.r00 + r01*b.r10 + r02*b.r20;
        o.r01=r00*b.r01 + r01*b.r11 + r02*b.r21;
        o.r02=r00*b.r02 + r01*b.r12 + r02*b.r22;
        o.r10=r10*b.r00 + r11*b.r10 + r12*b.r20;
        o.r11=r10*b.r01 + r11*b.r11 + r12*b.r21;
        o.r12=r10*b.r02 + r11*b.r12 + r12*b.r22;
        o.r20=r20*b.r00 + r21*b.r10 + r22*b.r20;
        o.r21=r20*b.r01 + r21*b.r11 + r22*b.r21;
        o.r22=r20*b.r02 + r21*b.r12 + r22*b.r22;
        o.p.x=r00*b.p.x + r01*b.p.y + r02*b.p.z + p.x;
        o.p.y=r10*b.p.x + r11*b.p.y + r12*b.p.z + p.y;
        o.p.z=r20*b.p.x + r21*b.p.y + r22*b.p.z + p.z;
        return o;
    }
    Vector3 pointToWorld(const Vector3& v) const {
        return {r00*v.x + r01*v.y + r02*v.z + p.x,
                r10*v.x + r11*v.y + r12*v.z + p.y,
                r20*v.x + r21*v.y + r22*v.z + p.z};
    }
    Vector3 vectorToWorld(const Vector3& v) const {
        return {r00*v.x + r01*v.y + r02*v.z,
                r10*v.x + r11*v.y + r12*v.z,
                r20*v.x + r21*v.y + r22*v.z};
    }
    CFrame inverse() const {
        CFrame inv;
        inv.r00=r00; inv.r01=r10; inv.r02=r20;
        inv.r10=r01; inv.r11=r11; inv.r12=r21;
        inv.r20=r02; inv.r21=r12; inv.r22=r22;
        inv.p.x=-(inv.r00*p.x + inv.r01*p.y + inv.r02*p.z);
        inv.p.y=-(inv.r10*p.x + inv.r11*p.y + inv.r12*p.z);
        inv.p.z=-(inv.r20*p.x + inv.r21*p.y + inv.r22*p.z);
        return inv;
    }
};

}`,
    notes: [
      'Full source includes Vector2, Vector3, UDim, UDim2, and CFrame.',
      'CFrame uses a 3x3 rotation matrix + position vector.',
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
    content: 'A collection of free ImGui and paid themes you can drop into your cheat menu.',
    code: null,
    notes: [
      'All are found on the Free ImGui themes and designs discord, there are multiple that can fit your liking.',
    ],
     link: { label: 'Join', url: 'https://discord.gg/rsdu3mzw' },
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
      {}
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
