import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, User, Settings, LogOut } from "lucide-react";
import LogoutModal from "../LogoutModal";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: Home,       label: "Dashboard"   },
  { to: "/bookings",   icon: BookOpen,   label: "My Bookings" },
  { to: "/profile",    icon: User,       label: "Profile"     },
  { to: "/settings",   icon: Settings,   label: "Settings"    },
];

// Works for BOTH users (mobileOpen/setMobileOpen props)
// and agents (activePage/onNavigate props) — handles both interfaces
const Sidebar = ({ mobileOpen, setMobileOpen, activePage, onNavigate }) => {
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("ghouseconnect_user") || localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const userName = storedUser?.fullName || storedUser?.name || "User";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const isOpen = mobileOpen ?? false;
  const closeSidebar = () => setMobileOpen?.(false);
  const isActive = (path, label) => {
    if (location.pathname) return location.pathname === path;
    return activePage === label;
  };
  const handleClick = (label) => { closeSidebar(); onNavigate?.(label); };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:40 }}
        />
      )}

      <nav
        style={{
          position:"fixed", left:0, top:0, height:"100vh", width:256,
          background:"#fff", boxShadow:"4px 0 20px rgba(0,0,0,0.06)",
          display:"flex", flexDirection:"column", zIndex:50,
          transition:"transform 0.3s ease-in-out",
        }}
        className={`ghouseconnect-sidebar${isOpen ? " open" : ""}`}
      >
        {/* Logo */}
        <div style={{ padding:"28px 24px 24px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, background:"#0b1a2e", borderRadius:10, display:"grid", placeItems:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <span style={{ fontFamily:"Poppins,sans-serif", fontWeight:700, fontSize:18, color:"#0b1a2e" }}>
            GHOUSE<span style={{ color:"#1a56db" }}>CONNECT</span>
          </span>
        </div>

        {/* Nav links + Logout in same list */}
        <div style={{ flex:1, padding:"0 12px", display:"flex", flexDirection:"column", gap:4 }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to, label);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => handleClick(label)}
                style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"11px 14px", borderRadius:12,
                  textDecoration:"none",
                  background: active ? "#eff6ff" : "transparent",
                  border: active ? "1px solid #bfdbfe" : "1px solid transparent",
                  transition:"all 0.18s", position:"relative",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#eff6ff"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                {active && (
                  <span style={{
                    position:"absolute", left:0, top:"50%", transform:"translateY(-50%)",
                    width:3, height:28, borderRadius:"0 3px 3px 0", background:"#1a56db",
                  }}/>
                )}
                <Icon size={20} color={active ? "#1a56db" : "#6b7280"} strokeWidth={active ? 2.2 : 1.8}/>
                <span style={{ fontSize:13.5, fontWeight:active ? 700 : 500, color:active ? "#1a56db" : "#374151" }}>
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Logout — immediately after Settings */}
          <button
            onClick={() => setShowLogout(true)}
            style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"11px 14px", borderRadius:12,
              border:"1px solid transparent", background:"transparent",
              cursor:"pointer", width:"100%", transition:"all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="#fef2f2"; e.currentTarget.style.borderColor="#fecaca"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="transparent"; }}
          >
            <LogOut size={19} color="#ef4444" strokeWidth={1.8}/>
            <span style={{ fontSize:13.5, fontWeight:500, color:"#ef4444" }}>Log out</span>
          </button>
        </div>

        {/* User name — pinned at bottom */}
        <div style={{ padding:"0 12px 24px" }}>
          <div style={{ height:1, background:"#f3f4f6", margin:"0 8px 12px" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"4px 14px" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#1a56db,#0b1a2e)", display:"grid", placeItems:"center", flexShrink:0 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>{initials}</span>
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#0b1a2e", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{userName}</div>
              <div style={{ fontSize:11, color:"#9ca3af" }}>User</div>
            </div>
          </div>
        </div>
      </nav>

      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}

      <style>{`
        .ghouseconnect-sidebar { transform: translateX(-100%); }
        .ghouseconnect-sidebar.open { transform: translateX(0); }
        @media (min-width: 768px) { .ghouseconnect-sidebar { transform: translateX(0) !important; } }
      `}</style>
    </>
  );
};

export default Sidebar;