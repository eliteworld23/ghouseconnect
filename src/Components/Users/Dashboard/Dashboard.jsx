import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, BookOpen, User, Settings,
  LogOut, Menu, MapPin, Search, ChevronLeft, ChevronRight,
  ChevronDown, X,
} from "lucide-react";
import LogoutModal from "../LogoutModal";

const formatPrice = (price) =>
  "₦" + new Intl.NumberFormat("en-NG").format(price);

const CITIES = ["All Cities", "Victoria Island", "Lekki", "Ikoyi", "Yaba", "Ajah", "Surulere", "Magodo", "Eko Atlantic"];
const PROP_TYPES = ["All Types", "house", "apartment", "condo", "townhouse"];

/* ─── SIDEBAR ────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/bookings", icon: BookOpen, label: "My Bookings" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },

];

function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [showLogout, setShowLogout] = useState(false);

  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("ghouseconnect_user") || localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const userName = storedUser?.fullName || storedUser?.name || "User";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}
      <nav style={{
        position: "fixed", left: 0, top: 0, height: "100vh", width: 220,
        background: "#fff", boxShadow: "4px 0 20px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column",
        zIndex: 50, transition: "transform 0.3s ease-in-out",
      }} className={`ghouseconnect-sidebar${mobileOpen ? " open" : ""}`}>

        <div style={{ padding: "20px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#0b1a2e", borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 17, color: "#0b1a2e" }}>
              GHOUSE<span style={{ color: "#1a56db" }}>CONNECT</span>
            </span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="sidebar-close-btn"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none", flexShrink: 0 }}>
            <X size={20} color="#6b7280" />
          </button>
        </div>

        <div style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 12, textDecoration: "none",
                  background: active ? "#eff6ff" : "transparent",
                  border: active ? "1px solid #bfdbfe" : "1px solid transparent",
                  transition: "all 0.18s", position: "relative",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#eff6ff"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                {active && <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 26, borderRadius: "0 3px 3px 0", background: "#1a56db" }} />}
                <Icon size={19} color={active ? "#1a56db" : "#6b7280"} strokeWidth={active ? 2.2 : 1.8} />
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#1a56db" : "#374151" }}>{label}</span>
              </Link>
            );
          })}

          {/* Logout — sits right after Settings in the same list */}
          <button
            onClick={() => setShowLogout(true)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: "1px solid transparent", background: "transparent", cursor: "pointer", width: "100%", transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fecaca"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <LogOut size={19} color="#ef4444" strokeWidth={1.8} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#ef4444" }}>Log out</span>
          </button>
        </div>

        {/* User name — pinned at very bottom */}
        <div style={{ padding: "0 10px 20px" }}>
          <div style={{ height: 1, background: "#f3f4f6", margin: "0 6px 10px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 12px" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #1a56db, #0b1a2e)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{initials}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0b1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>User</div>
            </div>
          </div>
        </div>
      </nav>

      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}

      <style>{`
        .ghouseconnect-sidebar { transform: translateX(-100%); }
        .ghouseconnect-sidebar.open { transform: translateX(0); }
        @media (min-width: 768px) { .ghouseconnect-sidebar { transform: translateX(0) !important; } }
        @media (max-width: 767px) { .sidebar-close-btn { display: flex !important; } }
      `}</style>
    </>
  );
}

/* ─── PROPERTY CARD ──────────────────────────────────────────────────────────── */
function PropertyCard({ property }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={`/properties/${property._id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff", borderRadius: 16, overflow: "hidden",
          boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.13)" : "0 2px 14px rgba(0,0,0,0.07)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.25s ease", display: "flex", flexDirection: "column", cursor: "pointer",
        }}
      >
        <div style={{ position: "relative", width: "100%", paddingBottom: "58%", overflow: "hidden", background: "#e5e7eb", flexShrink: 0 }}>
          <img
            src={property.image} alt={property.title}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.45s ease" }}
            onError={e => { e.target.src = "https://placehold.co/600x400/e5e7eb/6b7280?text=Property"; }}
          />
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span style={{ background: "#1a56db", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {property.propertyType}
            </span>
          </div>
        </div>
        <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#0b1a2e", margin: 0, fontFamily: "Poppins, sans-serif", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {property.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={12} color="#9ca3af" />
            <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{property.location}</span>
          </div>
          <div style={{ height: 1, background: "#f3f4f6" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0, flex: 1 }}>
              <img
                src={property.agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent.name)}&size=28&background=1a56db&color=fff`}
                alt={property.agent.name}
                style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb", flexShrink: 0 }}
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent.name)}&size=28&background=1a56db&color=fff`; }}
              />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{property.agent.name}</span>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: "#1a56db", fontFamily: "Poppins, sans-serif" }}>{formatPrice(property.price)}</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>listing price</div>
              {property.inspectionFee > 0 && (
                <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>Insp: {formatPrice(property.inspectionFee)}</div>
              )}
            </div>
          </div>
          <button
            style={{ width: "100%", padding: "9px", border: "none", borderRadius: 9, background: "#0b1a2e", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "background 0.2s", fontFamily: "Poppins, sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1a56db"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#0b1a2e"; }}
          >
            View Property
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────── */
export default function UserDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true); setFetchError("");
      try {
        const base = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";
        const res = await fetch(`${base}/api/v1/properties/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        const inner = data.data ?? data;
        const list = Array.isArray(inner) ? inner : (inner.properties || inner.data || []);
        if (!Array.isArray(list)) throw new Error("Unexpected API response shape");
        const mapped = list.map(p => ({
          _id: p._id || p.id,
          title: p.title,
          location: [p.street, p.city, p.state].filter(Boolean).join(", "),
          city: p.city, state: p.state,
          propertyType: p.propertyType,
          price: p.price,
          inspectionFee: p.inspectionFee,
          bedrooms: p.bedrooms ?? 0, bathrooms: p.bathrooms ?? 0, sqft: p.squareFeet ?? 0,
          image: p.images?.[0]?.url || "https://placehold.co/600x400/e5e7eb/6b7280?text=Property",
          agent: { name: p.agent?.fullName || p.agent?.name || "Agent", avatar: p.agent?.avatar || null },
        }));
        setProperties(mapped);
      } catch (err) {
        console.error(err);
        setFetchError("Could not load properties. Please try again later.");
      } finally { setLoading(false); }
    };
    fetchProperties();
  }, []);

  const filtered = properties.filter(p => {
    const matchCity = cityFilter === "All Cities" || p.city === cityFilter;
    const matchState = cityFilter === "All Cities" || p.state === cityFilter;
    const matchPType = typeFilter === "All Types" || p.propertyType === typeFilter.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.agent.name.toLowerCase().includes(search.toLowerCase());
    return (matchCity || matchState) && matchPType && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif", display: "flex", overflow: "hidden", width: "100%", maxWidth: "100vw", boxSizing: "border-box" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100%; }

        /* Sidebar */
        .ghouseconnect-sidebar { transform: translateX(-100%); }
        .ghouseconnect-sidebar.open { transform: translateX(0); }
        @media (min-width: 768px) { .ghouseconnect-sidebar { transform: translateX(0) !important; } }

        /* Main content offset */
        .dash-main { margin-left: 0 !important; }
        @media (min-width: 768px) { .dash-main { margin-left: 220px !important; } }

        /* Mobile top bar */
        .dash-topbar { display: flex; }
        @media (min-width: 768px) { .dash-topbar { display: none !important; } }

        /* Hero height — use min-height so content is never clipped */
        .dash-hero { min-height: 420px !important; height: auto !important; padding: 32px 0 28px !important; }
        @media (min-width: 480px) { .dash-hero { min-height: 380px !important; padding: 36px 0 32px !important; } }
        @media (min-width: 600px) { .dash-hero { min-height: 320px !important; padding: 40px 0 36px !important; } }
        @media (min-width: 768px) { .dash-hero { min-height: 360px !important; padding: 48px 0 44px !important; } }

        /* Hero title */
        .dash-hero-title { font-size: 1.2rem !important; }
        @media (min-width: 380px) { .dash-hero-title { font-size: 1.4rem !important; } }
        @media (min-width: 480px) { .dash-hero-title { font-size: 1.75rem !important; } }
        @media (min-width: 768px) { .dash-hero-title { font-size: 2.1rem !important; } }

        /* Search bar: stacks vertically on mobile */
        .dash-search-bar { flex-direction: column !important; border-radius: 14px !important; width: 100% !important; max-width: 100% !important; }
        @media (min-width: 640px) { .dash-search-bar { flex-direction: row !important; max-width: 580px !important; } }

        .dash-search-field { border-right: none !important; border-bottom: 1px solid #e5e7eb !important; min-width: 0 !important; }
        @media (min-width: 640px) { .dash-search-field { border-right: 1px solid #e5e7eb !important; border-bottom: none !important; } }

        .dash-search-btn { border-radius: 0 0 14px 14px !important; width: 100% !important; }
        @media (min-width: 640px) { .dash-search-btn { border-radius: 0 14px 14px 0 !important; width: auto !important; } }

        /* Selects on mobile: full width with comfortable tap targets */
        .dash-select-wrap { min-height: 48px !important; }
        @media (min-width: 600px) { .dash-select-wrap { min-height: unset !important; } }

        /* Filter pills */
        .dash-pills { flex-wrap: wrap !important; gap: 8px !important; }
        .dash-pill { padding: 7px 16px !important; font-size: 12px !important; }
        @media (min-width: 480px) { .dash-pill { padding: 8px 20px !important; font-size: 13px !important; } }

        /* Content padding */
        .dash-content { padding: 18px 12px 60px !important; }
        @media (min-width: 480px) { .dash-content { padding: 22px 18px 60px !important; } }
        @media (min-width: 640px) { .dash-content { padding: 28px 24px 60px !important; } }
        @media (min-width: 1024px) { .dash-content { padding: 32px 36px 60px !important; } }

        /* Property grid — 1 col on mobile, 2 col from 560px, 3 from 960px, 4 from 1500px */
        .prop-grid { grid-template-columns: 1fr !important; }
        @media (min-width: 560px) { .prop-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (min-width: 960px) { .prop-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1500px) { .prop-grid { grid-template-columns: repeat(4, 1fr) !important; } }

        /* Pagination */
        .dash-pagination { flex-wrap: wrap !important; gap: 5px !important; }
        .dash-page-btn { min-width: 36px !important; height: 36px !important; font-size: 12px !important; }
        @media (min-width: 480px) { .dash-page-btn { min-width: 38px !important; height: 38px !important; font-size: 13px !important; } }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="dash-main" style={{ flex: 1, minHeight: "100vh", minWidth: 0, maxWidth: "100%", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>

        {/* Mobile top bar */}
        <div className="dash-topbar" style={{ alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 30 }}>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 17, color: "#0b1a2e" }}>
            GHOUSE<span style={{ color: "#1a56db" }}>CONNECT</span>
          </span>
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <Menu size={24} color="#0b1a2e" />
          </button>
        </div>

        {/* ── HERO ── */}
        <div className="dash-hero" style={{
          position: "relative", backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80)",
          backgroundSize: "cover", backgroundPosition: "center", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(7,20,40,0.55) 0%, rgba(7,20,40,0.68) 100%)" }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 16px", width: "100%", maxWidth: 680 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#93c5fd", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>
              WELCOME TO GHOUSECONNECT
            </p>
            <h1 className="dash-hero-title" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
              Find Your Next Home
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 16 }}>
              Browse available properties across Lagos and book an inspection in minutes.
            </p>

            {/* Search bar */}
            <div className="dash-search-bar" style={{ display: "flex", alignItems: "stretch", background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", maxWidth: 580, margin: "0 auto 14px" }}>
              {/* Search input */}
              <div className="dash-search-field" style={{ position: "relative", flex: 2, display: "flex", alignItems: "center" }}>
                <Search size={14} color="#9ca3af" style={{ position: "absolute", left: 13, pointerEvents: "none", flexShrink: 0 }} />
                <input
                  value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by title, location…"
                  style={{ width: "100%", padding: "14px 12px 14px 34px", border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#374151", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
              {/* City */}
              <div className="dash-search-field dash-select-wrap" style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
                <MapPin size={13} color="#9ca3af" style={{ position: "absolute", left: 11, pointerEvents: "none" }} />
                <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setCurrentPage(1); }}
                  style={{ width: "100%", padding: "14px 24px 14px 28px", border: "none", outline: "none", background: "transparent", fontSize: 12.5, color: "#374151", fontFamily: "inherit", appearance: "none", cursor: "pointer" }}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={12} color="#9ca3af" style={{ position: "absolute", right: 8, pointerEvents: "none" }} />
              </div>
              {/* Type */}
              <div className="dash-search-field dash-select-wrap" style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 10, fontSize: 13, pointerEvents: "none" }}>🏠</span>
                <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  style={{ width: "100%", padding: "14px 24px 14px 28px", border: "none", outline: "none", background: "transparent", fontSize: 12.5, color: "#374151", fontFamily: "inherit", appearance: "none", cursor: "pointer" }}>
                  {PROP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={12} color="#9ca3af" style={{ position: "absolute", right: 8, pointerEvents: "none" }} />
              </div>
              {/* Button */}
              <button className="dash-search-btn"
                style={{ padding: "14px 22px", background: "#1a56db", color: "#fff", border: "none", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", transition: "background 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1444b8"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1a56db"; }}
              >
                Search
              </button>
            </div>

            {/* Status filter pills */}
            <div className="dash-pills" style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              {[{ val: "all", label: "All Status" }, { val: "rent", label: "For Rent" }, { val: "sale", label: "For Sale" }].map(({ val, label }) => (
                <button key={val} className="dash-pill" onClick={() => { setFilter(val); setCurrentPage(1); }}
                  style={{
                    padding: "7px 18px", borderRadius: 100, border: "1.5px solid",
                    borderColor: filter === val ? "#fff" : "rgba(255,255,255,0.45)",
                    background: filter === val ? "#fff" : "transparent",
                    color: filter === val ? "#0b1a2e" : "#fff",
                    fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", fontFamily: "inherit",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* ── END HERO ── */}

        <div className="dash-content">
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 18, fontWeight: 500 }}>
            Showing <strong style={{ color: "#0b1a2e" }}>{filtered.length}</strong> {filtered.length === 1 ? "property" : "properties"}
          </p>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#1a56db", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, color: "#6b7280" }}>Loading properties…</p>
            </div>
          ) : fetchError ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>{fetchError}</p>
            </div>
          ) : paginated.length > 0 ? (
            <div className="prop-grid" style={{ display: "grid", gap: 16, marginBottom: 32 }}>
              {paginated.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>No properties found</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Try adjusting your search or filter.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="dash-pagination" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12.5, fontWeight: 600, cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1, color: "#374151", fontFamily: "inherit" }}>
                <ChevronLeft size={14} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className="dash-page-btn" onClick={() => setCurrentPage(i + 1)}
                  style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid", borderColor: currentPage === i + 1 ? "#1a56db" : "#e5e7eb", background: currentPage === i + 1 ? "#1a56db" : "#fff", color: currentPage === i + 1 ? "#fff" : "#374151", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12.5, fontWeight: 600, cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1, color: "#374151", fontFamily: "inherit" }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}