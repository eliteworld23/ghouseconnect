import { useState, useEffect } from "react";
import NavLogo    from "./Navlogo";
import NavItem    from "./NavItems";
import NavFooter  from "./NavFooter";
import LogoutModal from "./Logout";
import { NAV_ITEMS } from "./NavConfig";
import { Menu, X } from "lucide-react";

export default function Sidebar({ activeId, onSelect }) {
  const [showLogout, setShowLogout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Close drawer when a nav item is selected on mobile
  const handleSelect = (id) => {
    onSelect(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: 56,
          background: "#ffffff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          alignItems: "center",
          padding: "0 16px",
          zIndex: 60,
          gap: 12,
        }}
        className="nf-mobile-topbar"
      >
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 6, borderRadius: 8, display: "grid", placeItems: "center",
            color: "#374151",
          }}
        >
          <Menu size={22} />
        </button>

        {/* Inline logo on mobile topbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: "#0b1a2e", borderRadius: 7, display: "grid", placeItems: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#0b1a2e" }}>
            Nest<span style={{ color: "#1a56db" }}>find</span>
          </span>
        </div>
      </div>

      {/* ── Overlay (mobile) ───────────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(11,26,46,0.45)",
            backdropFilter: "blur(3px)", zIndex: 70,
            animation: "nf-fade-in 0.18s ease both",
          }}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside
        className="nf-sidebar"
        style={{
          position: "fixed",
          top: 0, left: 0,
          height: "100vh",
          width: 240,
          background: "#ffffff",
          boxShadow: "4px 0 20px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          zIndex: 80,
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="nf-close-btn"
          style={{
            display: "none",
            position: "absolute", top: 12, right: 12,
            background: "#f3f4f6", border: "none", cursor: "pointer",
            width: 32, height: 32, borderRadius: 8,
            placeItems: "center", color: "#374151",
            zIndex: 10,
          }}
        >
          <X size={16} />
        </button>

        <NavLogo />

        <nav style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          <p
            style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#9ca3af",
              padding: "0 10px", marginBottom: 10, marginTop: 0,
            }}
          >
            Main Menu
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                activeId={activeId}
                onSelect={handleSelect}
              />
            ))}
          </ul>
        </nav>

        <NavFooter onLogout={() => { setMobileOpen(false); setShowLogout(true); }} onSelect={handleSelect} />
      </aside>

      {/* ── Responsive styles ──────────────────────────────────────── */}
      <style>{`
        @keyframes nf-fade-in { from { opacity: 0; } to { opacity: 1; } }

        /* Desktop: sidebar always visible */
        @media (min-width: 768px) {
          .nf-sidebar { transform: translateX(0) !important; }
          .nf-mobile-topbar { display: none !important; }
          .nf-close-btn { display: none !important; }
        }

        /* Mobile: sidebar hidden by default, slides in */
        @media (max-width: 767px) {
          .nf-mobile-topbar { display: flex !important; }
          .nf-sidebar {
            transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"};
          }
          .nf-close-btn { display: grid !important; }
        }
      `}</style>

      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}
    </>
  );
}