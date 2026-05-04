import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, XCircle, RefreshCw, User, Phone, Mail, Search, TrendingUp } from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────────
const BLUE   = "#1a56db";
const NAVY   = "#0b1a2e";
const WHITE  = "#ffffff";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const formatDate = (d) => {
  if (!d) return "—";
  try { const dt = new Date(d); return isNaN(dt) ? d : `${MONTHS[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`; }
  catch { return d; }
};
const formatPrice = (p) => "₦" + new Intl.NumberFormat("en-NG").format(p || 0);

const _raw    = import.meta.env?.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";
const API_BASE = _raw.replace(/\/api\/?$/, "").replace(/\/$/, "");

const resolveImg = (url) => {
  if (!url || url === "null" || url === "undefined") return null;
  const s = typeof url === "string" ? url : url?.url || url?.src || url?.path || "";
  if (!s || s === "null") return null;
  return s.startsWith("http") ? s : `${API_BASE}${s.startsWith("/") ? "" : "/"}${s}`;
};

const STATUS = {
  pending:        { bg:"#fffbeb", color:"#92400e", border:"#fde68a", dot:"#f59e0b", label:"Pending"         },
  agent_confirmed:{ bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe", dot:"#3b82f6", label:"Agent Confirmed" },
  user_confirmed: { bg:"#ecfdf5", color:"#065f46", border:"#a7f3d0", dot:"#10b981", label:"Confirmed"       },
  disputed:       { bg:"#fff1f2", color:"#9f1239", border:"#fecdd3", dot:"#f43f5e", label:"Disputed"        },
  cancelled:      { bg:"#f8fafc", color:"#475569", border:"#e2e8f0", dot:"#94a3b8", label:"Cancelled"       },
};

const mapBooking = (b) => {
  const s = (b.status || "pending").toLowerCase();
  // Use the actual boolean fields from the API
  const status =
    (b.userConfirmed === true)
      ? "user_confirmed"                          // both confirmed, money released
    : (b.agentConfirmed === true || s === "agent_confirmed" || s === "agent confirmed" || s === "confirmed")
      ? "agent_confirmed"                         // agent confirmed, waiting for user
    : s.includes("cancel") ? "cancelled"
    : s.includes("disput") ? "disputed"
    : "pending";
  const img = resolveImg(b.property?.images?.[0] || b.property?.image || b.propertyId?.images?.[0] || b.propertyId?.image || b.propertyImage || b.image || "");
  return {
    _id:          b._id || b.id || String(Date.now()),
    agentConfirmed: b.agentConfirmed === true,
    userConfirmed:  b.userConfirmed  === true,
    title:   b.property?.title || b.propertyTitle || b.propertyId?.title || b.title || "Property",
    image:   img,
    address: [b.property?.street || b.propertyId?.street, b.property?.area || b.propertyId?.area, b.property?.city || b.propertyId?.city, b.property?.state || b.propertyId?.state].filter(Boolean).join(", ") || b.propertyAddress || "",
    client:  b.userId?.fullName || b.userId?.name || b.user?.fullName || b.user?.name || b.clientName || "Client",
    email:   b.userId?.email    || b.user?.email  || b.clientEmail   || "",
    phone:   b.userId?.phone    || b.user?.phone  || b.clientPhone   || "",
    date:    b.bookedDate || b.inspectionDate || b.date || "",
    time:    b.startTime  || b.time || "",
    price:   b.inspectionFee || b.inspection_fee || b.bookingFee || b.fee || b.amount || 0,
    type:    (b.property?.purpose || b.propertyId?.purpose) === "sale" ? "sale" : "rent",
    bookedAt:b.createdAt || b.bookedAt || new Date().toISOString(),
    status,
  };
};

function useAgentOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch_ = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/v1/booking/agent-bookings`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      const raw = Array.isArray(data.data) ? data.data : [];
      const mapped = raw.map(mapBooking);
      // localStorage fallback: if agentConfirmed not yet reflected by API, apply locally
      const agentConfirmedIds = JSON.parse(localStorage.getItem("nestfind_agent_confirmed_ids") || "[]");
      const withOverrides = mapped.map(b =>
        (agentConfirmedIds.includes(b._id) && !b.agentConfirmed)
          ? { ...b, agentConfirmed: true, status: b.status === "pending" ? "agent_confirmed" : b.status }
          : b
      );
      setOrders(withOverrides);
    } catch (e) { setError(e.message || "Could not load orders"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const updateStatus = async (id, newStatus) => {
    // Remove from list if deleted
    if (newStatus === "__deleted__") { setOrders(prev => prev.filter(o => o._id !== id)); return; }
    // Optimistic update — UI responds instantly
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
    try {
      const token   = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

      if (newStatus === "agent_confirmed") {
        const res = await fetch(`${API_BASE}/api/v1/escrow/confirm-agent/${id}`, {
          method: "PATCH", headers,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok && json.success !== true) throw new Error(`Confirm failed: ${res.status}`);
        // Read real flags from API response and update order
        const { agentConfirmed, userConfirmed, bookingStatus } = json.data || {};
        const resolvedStatus = bookingStatus === "completed" || userConfirmed === true ? "user_confirmed" : "agent_confirmed";
        setOrders(prev => prev.map(o =>
          o._id === id ? { ...o, status: resolvedStatus, agentConfirmed: true, userConfirmed: userConfirmed ?? o.userConfirmed } : o
        ));
        // Keep localStorage as refresh safety net
        const ids = JSON.parse(localStorage.getItem("nestfind_agent_confirmed_ids") || "[]");
        if (!ids.includes(id)) { ids.push(id); localStorage.setItem("nestfind_agent_confirmed_ids", JSON.stringify(ids)); }
      } else {
        // For disputed / cancelled — try generic booking status update
        const res = await fetch(`${API_BASE}/api/v1/booking/${id}/status`, {
          method: "PATCH", headers,
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
        console.log(`[updateStatus] ✅ ${newStatus} via /booking/:id/status`);
      }
    } catch (e) {
      console.error("updateStatus error:", e);
      // Keep optimistic update — don't revert on failure
    }
  };

  return { orders, loading, error, updateStatus, refetch: fetch_ };
}

// ── Avatar initials ────────────────────────────────────────────────────────
function Avatar({ name, size = 38 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors   = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444"];
  const bg       = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: WHITE, display: "grid", placeItems: "center", fontSize: size * 0.35, fontWeight: 800, fontFamily: "Poppins,sans-serif", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ── Booking Card ────────────────────────────────────────────────────────────
function BookingCard({ order, onUpdateStatus, index }) {
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/api/v1/booking/${order._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      await onUpdateStatus(order._id, "__deleted__");
    } catch { setDeleting(false); alert("Could not delete booking. Please try again."); }
  };
  const cfg = STATUS[order.status] || STATUS.pending;
  const img = order.image;

  const act = async (s) => { setBusy(true); await onUpdateStatus(order._id, s); setBusy(false); };

  return (
    <div className="bcard" style={{ background: WHITE, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(11,26,46,0.07)", border: "1px solid #f1f5f9", animationDelay: `${index * 0.06}s` }}>
      <div className="bcard-inner" style={{ display: "flex" }}>

        {/* ── Left: image panel ── */}
        <div className="bcard-img" style={{ flexShrink: 0, position: "relative", overflow: "hidden", background: "#f1f5f9" }}>
          {img ? (
            <img src={img} alt={order.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
          ) : null}
          {/* Fallback placeholder */}
          <div style={{ display: img ? "none" : "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 32 }}>🏠</div>
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>No image</span>
          </div>
          {/* Type badge */}
          <div style={{ position: "absolute", top: 10, left: 10, background: order.type === "rent" ? BLUE : NAVY, color: WHITE, fontSize: 9, fontWeight: 800, padding: "3px 9px", borderRadius: 100, letterSpacing: 0.8, textTransform: "uppercase" }}>
            {order.type === "rent" ? "For Rent" : "For Sale"}
          </div>
        </div>

        {/* ── Right: content ── */}
        <div style={{ flex: 1, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "1rem", color: NAVY, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {order.title}
              </h3>
              {order.address && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={11} color="#94a3b8" />
                  <span style={{ fontSize: 11.5, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.address}</span>
                </div>
              )}
            </div>
            {/* Status pill with dot */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, background: cfg.bg, border: `1px solid ${cfg.border}`, flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
            </div>
          </div>

          {/* Client row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9" }}>
            <Avatar name={order.client} size={34} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: 0 }}>{order.client}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 2, flexWrap: "wrap" }}>
                {order.phone && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                    <Phone size={10} /> {order.phone}
                  </span>
                )}
                {order.email && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                    <Mail size={10} /> {order.email}
                  </span>
                )}
              </div>
            </div>
            {/* Price on the right of client row */}
            <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: BLUE, fontFamily: "Poppins,sans-serif", margin: 0 }}>{formatPrice(order.price)}</p>
              <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>inspection fee</p>
            </div>
          </div>

          {/* Datetime chips + actions */}
          <div className="bcard-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {order.date && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", border: "1px solid #bfdbfe", padding: "5px 10px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, color: BLUE }}>
                  <Calendar size={12} /> {formatDate(order.date)}
                </div>
              )}
              {order.time && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", border: "1px solid #bfdbfe", padding: "5px 10px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, color: BLUE }}>
                  <Clock size={12} /> {order.time}
                </div>
              )}
              <span style={{ fontSize: 11, color: "#cbd5e1", alignSelf: "center" }}>
                Booked {new Date(order.bookedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              {!order.agentConfirmed && (
                <>
                  <button onClick={() => act("agent_confirmed")} disabled={busy || deleting} className="act-btn" style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", background: "linear-gradient(135deg,#10b981,#059669)", color: WHITE, border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(16,185,129,0.3)", opacity: busy ? 0.6 : 1 }}>
                    <CheckCircle size={13} /> Confirm
                  </button>
                  <button onClick={() => act("disputed")} disabled={busy || deleting} className="act-btn" style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", background: WHITE, color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
                    <AlertCircle size={13} /> Dispute
                  </button>
                </>
              )}
              {order.status === "agent_confirmed" && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                  🔔 Awaiting User
                </div>
              )}
              {order.status === "user_confirmed" && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", color: "#065f46", border: "1px solid #a7f3d0", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                  <CheckCircle size={13} /> Completed
                </div>
              )}
              {order.status === "disputed" && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                  <AlertCircle size={13} /> Disputed
                </div>
              )}
              {order.status === "cancelled" && (
                <div style={{ padding: "8px 16px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                  Cancelled
                </div>
              )}
              {/* Delete button — only on pending/disputed/cancelled */}
              {(order.status === "pending" || order.status === "disputed" || order.status === "cancelled") && (
                <button onClick={handleDelete} disabled={deleting || busy} className="act-btn"
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", background: deleting ? "#9ca3af" : "#fef2f2", color: deleting ? WHITE : "#ef4444", border: "1px solid #fecaca", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer", transition: "all .2s" }}>
                  {deleting
                    ? <><span style={{ width: 11, height: 11, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: WHITE, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} /> Deleting…</>
                    : <><XCircle size={13} /> Delete</>
                  }
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function AgentOrdersPage() {
  const { orders, loading, error, updateStatus, refetch } = useAgentOrders();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const FILTERS = ["all", "pending", "agent_confirmed", "user_confirmed", "disputed", "cancelled"];

  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.title?.toLowerCase().includes(q) || o.client?.toLowerCase().includes(q) || o._id?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "agent_confirmed" || o.status === "user_confirmed").length,
    revenue:   orders.filter(o => o.status === "agent_confirmed" || o.status === "user_confirmed").reduce((s, o) => s + o.price, 0),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin     { to   { transform: rotate(360deg) } }
        @keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.4 } }

        .ao-page { font-family:'Inter',sans-serif; min-height:100vh; background:linear-gradient(160deg,#f0f4ff 0%,#f8faff 50%,#edf9f3 100%); padding:36px 48px 80px; }
        @media(max-width:1024px){ .ao-page { padding:28px 28px 80px; } }
        @media(max-width:640px) { .ao-page { padding:20px 16px 80px; } }

        .bcard { animation: fadeUp .4s ease both; transition: transform .2s, box-shadow .2s; }
        .bcard:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(26,86,219,.1) !important; }
        .bcard-inner { flex-direction: column; }
        @media(min-width:600px){ .bcard-inner { flex-direction: row !important; } }
        .bcard-img { width:100%; height:190px; }
        @media(min-width:600px){ .bcard-img { width:168px !important; height:auto !important; } }
        .bcard-footer { flex-direction: column; align-items: flex-start !important; }
        @media(min-width:560px){ .bcard-footer { flex-direction: row !important; align-items: center !important; } }

        .stat-card { transition: transform .2s, box-shadow .2s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,.1) !important; }

        .act-btn { transition: all .15s; }
        .act-btn:hover:not(:disabled) { transform: scale(1.04); filter: brightness(.94); }

        .filter-btn { transition: all .2s; cursor: pointer; border: none; font-family: 'Inter', sans-serif; }
        .filter-btn:hover { opacity:.85; }

        .search-wrap input:focus { outline: none; border-color: ${BLUE}; box-shadow: 0 0 0 3px rgba(26,86,219,.12); }

        .stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        @media(min-width:900px){ .stats-row { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      <div className="ao-page">

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 8 }}>Dashboard › Bookings</p>
            <h1 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2rem)", color: NAVY, lineHeight: 1.15 }}>Agent Orders</h1>
            <p style={{ fontSize: 13.5, color: "#64748b", marginTop: 6 }}>Track and manage all your client bookings in one place.</p>
          </div>
          <button onClick={refetch} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", background: `linear-gradient(135deg,${BLUE},#1444b8)`, color: WHITE, border: "none", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Poppins,sans-serif", boxShadow: "0 6px 22px rgba(26,86,219,.35)", whiteSpace: "nowrap" }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* ── Stat cards ── */}
        {!loading && !error && (
          <div className="stats-row" style={{ marginBottom: 32 }}>
            {[
              { label:"Total Bookings",      value: stats.total,                          icon:"📋", color: BLUE,      grad:"linear-gradient(135deg,#eff6ff,#dbeafe)", shadow:"rgba(26,86,219,.15)"  },
              { label:"Pending",             value: stats.pending,                        icon:"⏳", color:"#d97706",  grad:"linear-gradient(135deg,#fffbeb,#fef3c7)", shadow:"rgba(217,119,6,.15)"  },
              { label:"Confirmed",           value: stats.confirmed,                      icon:"✅", color:"#059669",  grad:"linear-gradient(135deg,#ecfdf5,#d1fae5)", shadow:"rgba(5,150,105,.15)"  },
              { label:"Confirmed Revenue",   value: formatPrice(stats.revenue),           icon:"💰", color: NAVY,      grad:"linear-gradient(135deg,#f8fafc,#f1f5f9)", shadow:"rgba(11,26,46,.1)"    },
            ].map(({ label, value, icon, color, grad, shadow }) => (
              <div key={label} className="stat-card" style={{ background: WHITE, borderRadius: 20, padding: "20px 22px", boxShadow: `0 4px 20px ${shadow}`, border: "1px solid rgba(255,255,255,.8)", display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -18, top: -18, width: 88, height: 88, borderRadius: "50%", background: grad, opacity: .7 }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: grad, display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0, zIndex: 1, boxShadow: `0 4px 14px ${shadow}` }}>{icon}</div>
                <div style={{ zIndex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0, fontFamily: "Poppins,sans-serif", lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
                  <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "4px 0 0", fontWeight: 600 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Search + Filter bar ── */}
        {!loading && !error && (
          <div style={{ background: WHITE, borderRadius: 16, padding: "16px 20px", boxShadow: "0 2px 12px rgba(0,0,0,.05)", border: "1px solid #f1f5f9", marginBottom: 24, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div className="search-wrap" style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search property, client, or ID…"
                style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, fontSize: 13.5, border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#f8fafc", color: NAVY, fontFamily: "Inter,sans-serif", transition: "border .2s, box-shadow .2s" }}
              />
            </div>
            {/* Filter pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FILTERS.map(f => {
                const active = filter === f;
                const cnt    = f === "all" ? orders.length : orders.filter(o => o.status === f).length;
                const dot    = STATUS[f]?.dot || BLUE;
                return (
                  <button key={f} onClick={() => setFilter(f)} className="filter-btn"
                    style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                      background: active ? BLUE : "#f1f5f9", color: active ? WHITE : "#64748b",
                      boxShadow: active ? `0 4px 14px rgba(26,86,219,.25)` : "none",
                      display: "flex", alignItems: "center", gap: 5 }}>
                    {!active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot }} />}
                    {f === "all" ? "All" : f === "agent_confirmed" ? "Agent Confirmed" : f === "user_confirmed" ? "Confirmed" : f.charAt(0).toUpperCase() + f.slice(1)}
                    <span style={{ background: active ? "rgba(255,255,255,.25)" : "#e2e8f0", color: active ? WHITE : "#94a3b8", padding: "1px 6px", borderRadius: 100, fontSize: 10.5 }}>{cnt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 16 }}>
            <div style={{ width: 40, height: 40, border: "3.5px solid #e2e8f0", borderTopColor: BLUE, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
            <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Loading bookings…</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div style={{ background: WHITE, borderRadius: 20, padding: "60px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>⚠️</div>
            <p style={{ color: "#ef4444", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>{error}</p>
            <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 26px", background: `linear-gradient(135deg,${BLUE},#1444b8)`, color: WHITE, border: "none", borderRadius: 11, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {/* ── Booking list ── */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div style={{ background: WHITE, borderRadius: 20, padding: "64px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,.05)", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>📭</div>
                <h3 style={{ fontFamily: "Poppins,sans-serif", color: NAVY, fontSize: "1.1rem", marginBottom: 8 }}>No Bookings Found</h3>
                <p style={{ color: "#94a3b8", fontSize: 13.5 }}>{search ? "Try a different search term." : "No bookings match this filter."}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Section label */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <TrendingUp size={15} color={BLUE} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>All Appointments</span>
                  <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {filtered.map((o, i) => (
                    <BookingCard key={o._id} order={o} onUpdateStatus={updateStatus} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}