import { useState, useEffect, useCallback } from "react";

const BLUE  = "#1a56db";
const NAVY  = "#0b1a2e";
const WHITE = "#ffffff";

const API_BASE = "https://gtimeconnect.onrender.com/api/v1/admin";
const getToken = () => localStorage.getItem("token") || "";
const AUTH_HEADERS = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const IMG_BASE = "https://gtimeconnect.onrender.com";

const resolveImg = (raw) => {
  if (!raw) return null;
  const s = typeof raw === "string" ? raw : raw?.url || raw?.src || raw?.path || null;
  if (!s || s === "null" || s === "undefined") return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${IMG_BASE}${s.startsWith("/") ? "" : "/"}${s}`;
};

const fmtPrice = (v) =>
  v == null ? "—" : "₦" + new Intl.NumberFormat("en-NG").format(v);

const mapProperty = (p) => ({
  _id:          p._id || p.id,
  title:        p.title || "Untitled",
  location:     [p.area, p.city, p.state].filter(Boolean).join(", ") || p.location || "—",
  price:        p.price,
  purpose:      (p.purpose || "rent").toLowerCase() === "sale" ? "sale" : "rent",
  propertyType: p.type || p.propertyType || "—",
  bedrooms:     p.bedrooms ?? 0,
  bathrooms:    p.bathrooms ?? 0,
  sqft:         p.propertySize ?? p.squareFeet ?? 0,
  status:       (p.status || "active").toLowerCase(),
  inspectionFee: p.inspectionFee ?? p.agent?.fee ?? null,
  createdAt:    p.createdAt || null,
  image:        resolveImg(p.images?.[0]) || resolveImg(p.image) ||
                "https://placehold.co/600x400/e5e7eb/6b7280?text=🏠",
  agent: {
    name:   p.agent?.fullName || p.agent?.name || p.agentName || "—",
    avatar: resolveImg(p.agent?.avatar) || null,
  },
  videoUrl: (() => {
    const v = p.videoUrl || p.video || (Array.isArray(p.videos) ? p.videos[0] : null);
    if (!v) return null;
    return typeof v === "string" ? v : v?.url || v?.src || null;
  })(),
});

const STATUS_BADGE = {
  active:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  pending:  { bg: "#fefce8", color: "#854d0e", border: "#fde68a" },
  inactive: { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
  sold:     { bg: "#fdf4ff", color: "#7c3aed", border: "#e9d5ff" },
};

// ── Property Detail Modal ──────────────────────────────────────────────────────
function PropertyDetailModal({ prop, onClose }) {
  if (!prop) return null;
  const statusColor = STATUS_BADGE[prop.status] || STATUS_BADGE.inactive;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(7,20,34,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: WHITE, borderRadius: 22, width: "100%", maxWidth: 580, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", animation: "modalUp .3s cubic-bezier(.22,1,.36,1) both" }}>
        {/* Image */}
        <div style={{ position: "relative", height: "clamp(160px, 30vw, 220px)", overflow: "hidden", borderRadius: "22px 22px 0 0", background: "#e5e7eb" }}>
          <img src={prop.image} alt={prop.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.currentTarget.src = "https://placehold.co/600x400/e5e7eb/6b7280?text=🏠"; }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,20,34,0.6) 0%, transparent 55%)" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: WHITE, fontSize: 18, cursor: "pointer", display: "grid", placeItems: "center" }}>✕</button>
          <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "clamp(14px,2.5vw,17px)", fontWeight: 800, color: WHITE, fontFamily: "Poppins,sans-serif", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prop.title}</p>
              <p style={{ margin: "4px 0 0", fontSize: "clamp(10px,1.5vw,12px)", color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {prop.location}</p>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: statusColor.bg, color: statusColor.color, border: `1px solid ${statusColor.border}`, textTransform: "capitalize", whiteSpace: "nowrap", flexShrink: 0 }}>{prop.status}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "clamp(16px,3vw,24px) clamp(16px,4vw,28px) clamp(20px,4vw,28px)" }}>
          {/* Price + purpose */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <p style={{ margin: 0, fontSize: "clamp(20px,4vw,24px)", fontWeight: 800, color: BLUE, fontFamily: "Poppins,sans-serif" }}>{fmtPrice(prop.price)}</p>
              {prop.inspectionFee && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Inspection fee: {fmtPrice(prop.inspectionFee)}</p>}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 100, background: prop.purpose === "rent" ? "#eff6ff" : NAVY, color: prop.purpose === "rent" ? BLUE : WHITE, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {prop.purpose === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 100, background: "#f3f4f6", color: "#374151" }}>{prop.propertyType}</span>
              {prop.videoUrl && <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 100, background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe" }}>🎬 Video Tour</span>}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[["🛏", `${prop.bedrooms} Bed${prop.bedrooms !== 1 ? "s" : ""}`, "#eff6ff", BLUE], ["🚿", `${prop.bathrooms} Bath${prop.bathrooms !== 1 ? "s" : ""}`, "#f0fdf4", "#16a34a"], prop.sqft > 0 && ["📐", `${prop.sqft.toLocaleString()} sqft`, "#fefce8", "#854d0e"]].filter(Boolean).map(([icon, label, bg, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, background: bg }}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Agent */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 12, marginBottom: 14 }}>
            {prop.agent.avatar
              ? <img src={prop.agent.avatar} alt={prop.agent.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb", flexShrink: 0 }} onError={e => { e.currentTarget.style.display = "none"; }} />
              : <div style={{ width: 40, height: 40, borderRadius: "50%", background: BLUE + "20", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 800, color: BLUE, flexShrink: 0 }}>{prop.agent.name[0]}</div>
            }
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: NAVY }}>{prop.agent.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>Listing Agent</p>
            </div>
          </div>

          {prop.createdAt && (
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
              Listed on {new Date(prop.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mobile property card (replaces table rows on small screens) ────────────────
function PropertyCard({ prop, onView, onDelete, onConfirm, onCancelConfirm, isDeleting, isConfirming }) {
  const sb = STATUS_BADGE[prop.status] || STATUS_BADGE.inactive;
  return (
    <div style={{ background: WHITE, borderRadius: 14, padding: 14, boxShadow: "0 2px 12px rgba(11,26,46,0.07)", border: "1px solid #f0f2f7", display: "flex", gap: 12 }}>
      {/* Thumbnail */}
      <div style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#e5e7eb", cursor: "pointer" }} onClick={() => onView(prop)}>
        <img src={prop.image} alt={prop.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.currentTarget.src = "https://placehold.co/100x100/e5e7eb/6b7280?text=🏠"; }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 4 }}>
          <p onClick={() => onView(prop)} style={{ margin: 0, fontWeight: 700, fontSize: 13, color: NAVY, fontFamily: "Poppins,sans-serif", cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{prop.title}</p>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100, background: sb.bg, color: sb.color, border: `1px solid ${sb.border}`, textTransform: "capitalize", whiteSpace: "nowrap", flexShrink: 0 }}>{prop.status}</span>
        </div>
        <p style={{ margin: "0 0 6px", fontSize: 11, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {prop.location}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: BLUE, fontFamily: "Poppins,sans-serif" }}>{fmtPrice(prop.price)}</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 100, background: prop.purpose === "rent" ? "#eff6ff" : NAVY, color: prop.purpose === "rent" ? BLUE : WHITE, textTransform: "uppercase" }}>
            {prop.purpose === "rent" ? "Rent" : "Sale"}
          </span>
          <span style={{ fontSize: 10, color: "#9ca3af" }}>🛏{prop.bedrooms} · 🚿{prop.bathrooms}</span>
          {prop.videoUrl && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe" }}>🎬 VIDEO</span>}
        </div>
        {/* Actions */}
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onView(prop)}
            style={{ padding: "5px 12px", background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            View
          </button>
          {isConfirming ? (
            <>
              <button onClick={() => onDelete(prop._id)} disabled={isDeleting}
                style={{ padding: "5px 10px", background: "#ef4444", color: WHITE, border: "none", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: isDeleting ? "not-allowed" : "pointer", opacity: isDeleting ? 0.6 : 1 }}>
                {isDeleting ? "…" : "Confirm"}
              </button>
              <button onClick={onCancelConfirm}
                style={{ padding: "5px 8px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => onConfirm(prop._id)}
              style={{ padding: "5px 12px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Properties View ───────────────────────────────────────────────────────
export default function AdminPropertiesView() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [purposeFilter, setPurpose] = useState("all");
  const [statusFilter, setStatus]   = useState("all");
  const [sortBy, setSortBy]         = useState("newest");
  const [page, setPage]             = useState(1);
  const [selectedProp, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId]   = useState(null);
  const PER_PAGE = 8;

  const fetchProperties = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/properties`, { headers: AUTH_HEADERS() });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const raw =
        Array.isArray(json.data?.properties) ? json.data.properties :
        Array.isArray(json.data)             ? json.data             :
        Array.isArray(json.properties)       ? json.properties       :
        Array.isArray(json)                  ? json                  : [];
      setProperties(raw.map(mapProperty));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/properties/${id}`, { method: "DELETE", headers: AUTH_HEADERS() });
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch { /* keep row on failure */ }
    finally { setDeletingId(null); setConfirmId(null); }
  };

  const filtered = properties
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch  = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.agent.name.toLowerCase().includes(q);
      const matchPurpose = purposeFilter === "all" || p.purpose === purposeFilter;
      const matchStatus  = statusFilter  === "all" || p.status  === statusFilter;
      return matchSearch && matchPurpose && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest")    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest")    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_dsc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const forRent    = properties.filter(p => p.purpose === "rent").length;
  const forSale    = properties.filter(p => p.purpose === "sale").length;
  const withVideo  = properties.filter(p => p.videoUrl).length;

  const selectStyles = { padding: "9px 10px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#374151", background: WHITE, cursor: "pointer", outline: "none", fontFamily: "inherit" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes modalUp { from { opacity:0; transform:translateY(24px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }

        .props-wrap {
          padding: clamp(16px,3vh,36px) clamp(16px,3vw,40px);
          max-width: 1280px; margin: 0 auto; box-sizing: border-box;
        }

        /* Summary chips */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 22px;
        }
        .summary-chip {
          background: ${WHITE}; border-radius: 14px; padding: 14px 16px;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 2px 12px rgba(11,26,46,0.07);
          border: 1px solid #f0f2f7; transition: transform .2s;
        }
        .summary-chip:hover { transform: translateY(-2px); }
        .summary-icon {
          width: 40px; height: 40px; border-radius: 11px;
          display: grid; placeItems: center; font-size: 18px; flex-shrink: 0;
        }

        /* Filters bar */
        .filters-bar {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap; margin-bottom: 16px;
        }
        .search-wrap { position: relative; flex: 1 1 200px; min-width: 140px; }
        .search-wrap span { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 13px; pointer-events: none; }
        .search-input {
          width: 100%; padding: 9px 12px 9px 32px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 13px; color: ${NAVY}; outline: none;
          background: ${WHITE}; box-sizing: border-box;
          transition: border-color .2s; font-family: inherit;
        }
        .search-input:focus { border-color: ${BLUE}; }

        /* Table */
        .table-wrap { background: ${WHITE}; border-radius: 18px; box-shadow: 0 4px 24px rgba(11,26,46,0.07); border: 1px solid #f0f2f7; overflow: hidden; }
        .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .props-table { width: 100%; border-collapse: collapse; }
        .props-table th {
          padding: 12px 16px; text-align: left; font-size: 10.5px;
          font-weight: 700; color: #9ca3af; letter-spacing: 0.09em;
          text-transform: uppercase; background: #f8fafc; white-space: nowrap;
        }
        .props-table td { padding: 13px 16px; }
        .props-table tr { border-bottom: 1px solid #f3f4f6; transition: background .15s; }
        .props-table tr:last-child { border-bottom: none; }
        .props-table tr:hover { background: #f8fafc; }

        /* Cards grid (mobile) */
        .cards-grid { display: none; flex-direction: column; gap: 10px; padding: 14px; }

        /* Pagination */
        .pagination { display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; margin-top: 20px; }

        /* ── Responsive ── */

        /* Medium screens: hide some table columns */
        @media (max-width: 900px) {
          .col-type, .col-details { display: none; }
          .summary-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .props-wrap { padding: 16px 12px; }
          .summary-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .filters-bar { gap: 8px; }
        }

        /* Mobile: switch table → cards */
        @media (max-width: 600px) {
          .table-wrap { display: none; }
          .cards-grid { display: flex; }
          .summary-grid { grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
          .summary-chip { padding: 10px 12px; gap: 8px; }
          .filters-bar { gap: 6px; }
          .filters-bar select { flex: 1 1 calc(50% - 3px); }
        }

        @media (max-width: 400px) {
          .summary-grid { grid-template-columns: 1fr 1fr; }
          .summary-chip { padding: 10px; }
        }
      `}</style>

      <div className="props-wrap">

        {/* ── Header ── */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "1.5px", textTransform: "uppercase" }}>Admin Panel</p>
          <h2 style={{ margin: 0, fontSize: "clamp(18px,2.2vw,26px)", fontWeight: 800, color: NAVY, fontFamily: "Poppins,sans-serif" }}>All Properties</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Every listing uploaded on Nestfind — view, search and manage.</p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{ marginBottom: 16, padding: "10px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            ⚠️ {error}
            <button onClick={fetchProperties} style={{ marginLeft: "auto", padding: "4px 12px", background: "#ef4444", color: WHITE, border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Retry</button>
          </div>
        )}

        {/* ── Summary chips ── */}
        <div className="summary-grid">
          {[
            { icon: "🏠", label: "Total Listings",  value: loading ? "—" : properties.length, color: BLUE },
            { icon: "🔑", label: "For Rent",         value: loading ? "—" : forRent,           color: "#059669" },
            { icon: "🏷️", label: "For Sale",         value: loading ? "—" : forSale,           color: "#d97706" },
            { icon: "🎬", label: "With Video Tour",  value: loading ? "—" : withVideo,         color: "#7c3aed" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="summary-chip">
              <div className="summary-icon" style={{ background: color + "15", border: `1.5px solid ${color}25` }}>{icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: "clamp(16px,2vw,20px)", fontWeight: 800, color, fontFamily: "Poppins,sans-serif", lineHeight: 1 }}>{value}</p>
                <p style={{ margin: "3px 0 0", fontSize: "clamp(9px,1vw,11px)", color: "#9ca3af", fontWeight: 600 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="filters-bar">
          <div className="search-wrap">
            <span>🔍</span>
            <input className="search-input" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search title, location, agent…" />
          </div>
          <select value={purposeFilter} onChange={e => { setPurpose(e.target.value); setPage(1); }} style={selectStyles}>
            <option value="all">All Purposes</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }} style={selectStyles}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="sold">Sold</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyles}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_dsc">Price ↓</option>
          </select>
          <button onClick={fetchProperties}
            style={{ padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: WHITE, fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", fontFamily: "inherit", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}>
            ↻ Refresh
          </button>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Desktop Table ── */}
        <div className="table-wrap">
          <div className="table-scroll">
            {loading ? (
              <div style={{ padding: "70px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#9ca3af" }}>
                <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: BLUE, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                <p style={{ margin: 0, fontSize: 13 }}>Fetching properties from server…</p>
              </div>
            ) : paginated.length === 0 ? (
              <div style={{ padding: "70px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🏚️</div>
                <p style={{ fontWeight: 700, fontSize: 15, color: NAVY, margin: "0 0 6px" }}>No properties found</p>
                <p style={{ fontSize: 13, color: "#9ca3af" }}>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <table className="props-table">
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f2f7" }}>
                    <th>Property</th>
                    <th className="col-type">Type</th>
                    <th>Purpose</th>
                    <th>Price</th>
                    <th className="col-details">Details</th>
                    <th>Agent</th>
                    <th>Status</th>
                    <th>Listed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((prop, idx) => {
                    const sb = STATUS_BADGE[prop.status] || STATUS_BADGE.inactive;
                    const isDeleting   = deletingId === prop._id;
                    const isConfirming = confirmId  === prop._id;
                    return (
                      <tr key={prop._id} style={{ animationDelay: `${idx * 30}ms` }}>
                        <td style={{ minWidth: 200 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                            <div style={{ width: 54, height: 54, borderRadius: 11, overflow: "hidden", flexShrink: 0, background: "#e5e7eb", cursor: "pointer" }} onClick={() => setSelected(prop)}>
                              <img src={prop.image} alt={prop.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                                onError={e => { e.currentTarget.src = "https://placehold.co/100x100/e5e7eb/6b7280?text=🏠"; }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p onClick={() => setSelected(prop)} style={{ margin: 0, fontWeight: 700, fontSize: 13, color: NAVY, fontFamily: "Poppins,sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160, cursor: "pointer" }}
                                onMouseEnter={e => { e.currentTarget.style.color = BLUE; }}
                                onMouseLeave={e => { e.currentTarget.style.color = NAVY; }}>
                                {prop.title}
                              </p>
                              <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>📍 {prop.location}</p>
                              {prop.videoUrl && <span style={{ display: "inline-block", marginTop: 3, fontSize: 9, fontWeight: 700, letterSpacing: "0.5px", padding: "2px 6px", borderRadius: 100, background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe" }}>🎬 VIDEO</span>}
                            </div>
                          </div>
                        </td>
                        <td className="col-type" style={{ whiteSpace: "nowrap" }}>
                          <span style={{ padding: "4px 10px", borderRadius: 8, background: "#f3f4f6", fontSize: 12, fontWeight: 600, color: "#374151" }}>{prop.propertyType}</span>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, letterSpacing: "0.5px", textTransform: "uppercase", background: prop.purpose === "rent" ? "#eff6ff" : NAVY, color: prop.purpose === "rent" ? BLUE : WHITE }}>
                            {prop.purpose === "rent" ? "For Rent" : "For Sale"}
                          </span>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: 13.5, color: BLUE, fontFamily: "Poppins,sans-serif" }}>{fmtPrice(prop.price)}</p>
                          {prop.inspectionFee ? <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "#9ca3af" }}>Insp: {fmtPrice(prop.inspectionFee)}</p> : null}
                        </td>
                        <td className="col-details" style={{ fontSize: 12, color: "#374151", whiteSpace: "nowrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span>🛏 {prop.bedrooms}</span>
                            <span style={{ color: "#d1d5db" }}>·</span>
                            <span>🚿 {prop.bathrooms}</span>
                            {prop.sqft > 0 && <><span style={{ color: "#d1d5db" }}>·</span><span>📐 {prop.sqft.toLocaleString()}</span></>}
                          </span>
                        </td>
                        <td style={{ minWidth: 120 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {prop.agent.avatar
                              ? <img src={prop.agent.avatar} alt={prop.agent.name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb", flexShrink: 0 }} onError={e => { e.currentTarget.style.display = "none"; }} />
                              : <div style={{ width: 28, height: 28, borderRadius: "50%", background: BLUE + "20", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800, color: BLUE, flexShrink: 0 }}>{(prop.agent.name || "?")[0]}</div>
                            }
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 90 }}>{prop.agent.name}</span>
                          </div>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: sb.bg, color: sb.color, border: `1px solid ${sb.border}`, textTransform: "capitalize" }}>
                            {prop.status}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                          {prop.createdAt ? new Date(prop.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <button onClick={() => setSelected(prop)}
                              style={{ padding: "5px 12px", background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: "pointer", transition: "all .15s" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#dbeafe"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; }}>
                              View
                            </button>
                            {isConfirming ? (
                              <>
                                <button onClick={() => handleDelete(prop._id)} disabled={isDeleting}
                                  style={{ padding: "5px 11px", background: "#ef4444", color: WHITE, border: "none", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: isDeleting ? "not-allowed" : "pointer", opacity: isDeleting ? 0.6 : 1 }}>
                                  {isDeleting ? "…" : "Confirm"}
                                </button>
                                <button onClick={() => setConfirmId(null)}
                                  style={{ padding: "5px 9px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button onClick={() => setConfirmId(prop._id)}
                                style={{ padding: "5px 12px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: "pointer", transition: "all .15s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; }}>
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="cards-grid">
          {loading ? (
            <div style={{ padding: "50px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#9ca3af" }}>
              <div style={{ width: 32, height: 32, border: "3px solid #e5e7eb", borderTopColor: BLUE, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
              <p style={{ margin: 0, fontSize: 13 }}>Loading properties…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: "50px 0", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🏚️</div>
              <p style={{ fontWeight: 700, fontSize: 14, color: NAVY, margin: "0 0 4px" }}>No properties found</p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            paginated.map(prop => (
              <PropertyCard
                key={prop._id}
                prop={prop}
                onView={setSelected}
                onDelete={handleDelete}
                onConfirm={setConfirmId}
                onCancelConfirm={() => setConfirmId(null)}
                isDeleting={deletingId === prop._id}
                isConfirming={confirmId === prop._id}
              />
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              style={{ padding: "7px 14px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: WHITE, fontSize: 12.5, fontWeight: 600, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, color: "#374151", fontFamily: "inherit" }}>
              ‹ Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p;
              if (totalPages <= 7)             p = i + 1;
              else if (page <= 4)              p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else                             p = page - 3 + i;
              return p;
            }).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ minWidth: 36, height: 36, borderRadius: 9, border: "1.5px solid", borderColor: page === p ? BLUE : "#e5e7eb", background: page === p ? BLUE : WHITE, color: page === p ? WHITE : "#374151", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                {p}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              style={{ padding: "7px 14px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: WHITE, fontSize: 12.5, fontWeight: 600, cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, color: "#374151", fontFamily: "inherit" }}>
              Next ›
            </button>
          </div>
        )}

        {/* ── Modal ── */}
        {selectedProp && <PropertyDetailModal prop={selectedProp} onClose={() => setSelected(null)} />}
      </div>
    </>
  );
}