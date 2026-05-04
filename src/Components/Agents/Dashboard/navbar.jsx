// src/components/Sidebar.jsx
import { useState } from "react";

const BLUE    = "#1a56db";
const NAVY    = "#0b1a2e";
const LIGHTBG = "#f0f5ff";
const GREY    = "#6b7280";
const BORDER  = "#e5e7eb";
const WHITE   = "#ffffff";

export const NAV_W = 260;

/* ── Icons ── */
const IconDashboard = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconBookings = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const IconWallet = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="22" height="14" rx="2"/><path d="M1 10h22"/>
    <circle cx="17" cy="15" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const IconProfile = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
  </svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── NavLink ── */
const NavLink = ({ icon, label, active, onClick, danger }) => {
  const [hovered, setHovered] = useState(false);
  const baseColor = danger ? "#dc2626" : active ? BLUE : hovered ? NAVY : GREY;
  const bgColor   = danger
    ? (hovered ? "rgba(220,38,38,0.08)" : "transparent")
    : active ? "rgba(26,86,219,0.10)" : hovered ? LIGHTBG : "transparent";
  const iconBg    = danger ? "rgba(220,38,38,0.07)" : active ? "rgba(26,86,219,0.14)" : "#f3f7ff";

  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 11,
        padding: "10px 12px", borderRadius: 9,
        color: baseColor, fontSize: 13.5,
        fontWeight: active ? 600 : 500,
        background: bgColor,
        border: "none", cursor: "pointer", width: "100%",
        textAlign: "left", fontFamily: "'Inter', sans-serif",
        transform: hovered ? "translateX(2px)" : "translateX(0)",
        transition: "background 0.18s, color 0.18s, transform 0.15s",
        position: "relative",
      }}
    >
      {!danger && (
        <span style={{
          position: "absolute", left: -14,
          top: "50%", transform: "translateY(-50%)",
          width: 3, height: "60%",
          background: BLUE, borderRadius: "0 3px 3px 0",
          opacity: active ? 1 : 0,
          transition: "opacity 0.2s",
        }}/>
      )}
      <span style={{
        width: 32, height: 32, borderRadius: 8,
        display: "grid", placeItems: "center",
        background: iconBg, flexShrink: 0,
        color: baseColor,
        transition: "background 0.18s, color 0.18s",
      }}>
        {icon}
      </span>
      {label}
    </button>
  );
};

/* ── Sidebar ── */
export default function Sidebar({ activePage, onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigate = (id) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  const mainLinks = [
    { id: "Dashboard",        icon: <IconDashboard /> },
    { id: "Bookings",         icon: <IconBookings />  },
    { id: "Create a Listing", icon: <IconPlus />      },
    { id: "Wallet",           icon: <IconWallet />    },
  ];

  /* ── Shared nav content ── */
  const navContent = (
    <nav style={{
      width: NAV_W, height: "100%",
      background: WHITE,
      display: "flex", flexDirection: "column",
      padding: "24px 14px",
      gap: 2,
      boxShadow: "4px 0 32px rgba(26,86,219,0.12)",
      position: "relative",
      overflowY: "auto",
    }}>
      {/* Top gradient stripe */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(90deg,#1a56db 0%,#60a5fa 40%,#3b82f6 70%,#1a56db 100%)",
      }}/>

      {/* Logo + close button (close only shows on mobile drawer) */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "6px 8px 24px",
        borderBottom: `1.5px solid ${BORDER}`,
        marginBottom: 10,
      }}>
        <div style={{
          width: 38, height: 38, background: BLUE, borderRadius: 10,
          display: "grid", placeItems: "center", flexShrink: 0,
          boxShadow: "0 4px 14px rgba(26,86,219,0.30)",
        }}>
          <IconHome />
        </div>
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800, fontSize: 19,
          color: NAVY, letterSpacing: "-0.3px", flex: 1,
        }}>
          Nest<span style={{ color: BLUE }}>find</span>
        </span>
        {/* Close button — only visible inside mobile drawer */}
        <button
          onClick={() => setDrawerOpen(false)}
          className="nf-drawer-close"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: GREY, padding: 4, display: "grid", placeItems: "center",
            borderRadius: 6,
          }}
          aria-label="Close menu"
        >
          <IconClose />
        </button>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        <span style={{
          fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#9ca3af",
          padding: "10px 12px 4px",
        }}>Menu</span>

        {mainLinks.map(({ id, icon }) => (
          <NavLink key={id} icon={icon} label={id}
            active={activePage === id}
            onClick={() => handleNavigate(id)}
          />
        ))}

        <div style={{ height: 1.5, background: BORDER, margin: "10px 0" }}/>

        <span style={{
          fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#9ca3af",
          padding: "10px 12px 4px",
        }}>Account</span>

        <NavLink icon={<IconProfile />} label="My Profile"
          active={activePage === "My Profile"}
          onClick={() => handleNavigate("My Profile")}
        />
        <NavLink icon={<IconLogout />} label="Logout" danger
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("nestfind_user");
            window.location.href = "/";
          }}
        />
      </div>

      {/* User card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: 12, borderTop: `1.5px solid ${BORDER}`, marginTop: 8,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg,#1a56db,#60a5fa)",
          display: "grid", placeItems: "center",
          fontFamily: "'Poppins', sans-serif", fontWeight: 700,
          fontSize: 13, color: WHITE, flexShrink: 0,
          boxShadow: "0 2px 8px rgba(26,86,219,0.25)",
        }}>JD</div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: NAVY,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>Jane Doe</div>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <style>{`
        @keyframes nf-fadeIn { from { opacity: 0 } to { opacity: 1 } }

        /* Desktop: fixed sidebar visible, topbar + drawer hidden */
        .nf-desktop-sidebar { display: block; }
        .nf-mobile-topbar   { display: none !important; }
        .nf-drawer-close    { display: none !important; }

        /* Mobile: hide desktop sidebar, show topbar */
        @media (max-width: 767px) {
          .nf-desktop-sidebar { display: none !important; }
          .nf-mobile-topbar   { display: flex !important; }
          .nf-drawer-close    { display: grid !important; }
        }

        /* Utility: pages that sit beside this sidebar */
        .nf-page-root { margin-left: 0; }
        @media (min-width: 768px) { .nf-page-root { margin-left: 260px; } }

        /* Prevent horizontal overflow on mobile */
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }
      `}</style>

      {/* ── Desktop fixed sidebar ── */}
      <div className="nf-desktop-sidebar" style={{
        position: "fixed", top: 0, left: 0,
        width: NAV_W, height: "100vh", zIndex: 100,
      }}>
        {navContent}
      </div>

      {/* ── Mobile top bar ── */}
      <header className="nf-mobile-topbar" style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 56,
        background: WHITE, borderBottom: `1.5px solid ${BORDER}`,
        alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", zIndex: 200,
        boxShadow: "0 2px 12px rgba(26,86,219,0.07)",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg,#1a56db 0%,#60a5fa 40%,#3b82f6 70%,#1a56db 100%)",
        }}/>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: BLUE, borderRadius: 8,
            display: "grid", placeItems: "center",
            boxShadow: "0 3px 10px rgba(26,86,219,0.30)",
          }}>
            <IconHome />
          </div>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800, fontSize: 17, color: NAVY, letterSpacing: "-0.3px",
          }}>
            Nest<span style={{ color: BLUE }}>find</span>
          </span>
        </div>
        <button onClick={() => setDrawerOpen(true)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: NAVY, padding: 6, display: "grid", placeItems: "center", borderRadius: 8,
        }} aria-label="Open menu">
          <IconMenu />
        </button>
      </header>

      {/* ── Mobile drawer backdrop ── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(11,26,46,0.45)",
          backdropFilter: "blur(2px)",
          animation: "nf-fadeIn 0.2s ease",
        }}/>
      )}

      {/* ── Mobile drawer ── */}
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: NAV_W, height: "100dvh",
        zIndex: 400,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {navContent}
      </div>
    </>
  );
}