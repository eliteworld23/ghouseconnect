import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Menu, RefreshCw } from "lucide-react";
import Sidebar from "./Navbar";

const BLUE  = "#1a56db";
const NAVY  = "#0b1a2e";
const WHITE = "#ffffff";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d)) return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    const [y,m,dd] = dateStr.split("-").map(Number);
    return `${MONTHS[m-1]} ${dd}, ${y}`;
  } catch { return dateStr; }
}

const formatPrice = (price) => "₦" + new Intl.NumberFormat("en-NG").format(price || 0);

const _raw     = import.meta.env?.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";
const API_BASE = _raw.replace(/\/api\/?$/, "").replace(/\/$/, "");

const resolveImageUrl = (url) => {
  if (!url || url === "null" || url === "undefined") return "https://placehold.co/400x300/e5e7eb/6b7280?text=Property";
  const str = typeof url === "string" ? url : url?.url || url?.src || url?.path || null;
  if (!str || str === "null") return "https://placehold.co/400x300/e5e7eb/6b7280?text=Property";
  if (str.startsWith("http://") || str.startsWith("https://")) return str;
  return `${API_BASE}${str.startsWith("/") ? "" : "/"}${str}`;
};

// Map a raw API booking to a consistent shape
const mapBooking = (b) => {
  const s = (b.status || "pending").toLowerCase();

  // Drive status from the actual boolean fields the API returns
  let status = "Pending Confirmation";
  if (b.userConfirmed === true || s === "completed")
    status = "Confirmed";           // both confirmed — escrow released
  else if (b.agentConfirmed === true)
    status = "Agent Confirmed";     // agent confirmed, waiting for user
  else if (s.includes("cancel"))
    status = "Cancelled";
  else if (s.includes("disput"))
    status = "Disputed";

  return {
    id:             b._id || b.id,
    agentConfirmed: b.agentConfirmed === true,
    userConfirmed:  b.userConfirmed  === true,
    propertyId:     b.propertyId?._id || b.propertyId?.id || b.property?._id || b.propertyId || "",
    propertyTitle:  b.propertyId?.title  || b.property?.title  || b.propertyTitle || b.title || "Property",
    propertyImage:  resolveImageUrl(
      b.propertyId?.images?.[0] || b.propertyId?.image ||
      b.property?.images?.[0]  || b.property?.image   ||
      b.propertyImage || b.image || ""
    ),
    propertyAddress:[
      b.propertyId?.street || b.property?.street,
      b.propertyId?.area   || b.property?.area,
      b.propertyId?.city   || b.property?.city,
      b.propertyId?.state  || b.property?.state,
    ].filter(Boolean).join(", ") || b.propertyAddress || "",
    agentName:  b.agentId?.fullName || b.agentId?.name || b.agent?.name || b.agentName || "Agent",
    price:      b.inspectionFee || b.inspection_fee || b.bookingFee || b.fee || b.amount || 0,
    priceType:  (b.propertyId?.purpose || b.property?.purpose) === "sale" ? "sale" : "rent",
    date:       b.bookedDate || b.inspectionDate || b.date || "",
    time:       b.startTime  || b.time || "",
    bookedAt:   b.createdAt  || b.bookedAt || new Date().toISOString(),
    status,
  };
};

const STATUS_STYLES = {
  "Pending Confirmation": { bg:"#fefce8", color:"#854d0e", border:"#fde68a" },
  "Agent Confirmed":      { bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe" },
  "Confirmed":            { bg:"#f0fdf4", color:"#166534", border:"#bbf7d0" },
  "Cancelled":            { bg:"#fef2f2", color:"#991b1b", border:"#fecaca" },
  "Disputed":             { bg:"#fff1f2", color:"#9f1239", border:"#fecdd3" },
};

/* ── Payment Success Modal ── */
const PaymentSuccessModal = ({ booking, onClose }) => (
  <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(7,20,34,0.65)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <div style={{ background:WHITE,borderRadius:22,maxWidth:520,width:"100%",boxShadow:"0 32px 80px rgba(0,0,0,0.4)",overflow:"hidden",animation:"fadeUp .35s cubic-bezier(.16,1,.3,1) both" }}>
      <div style={{ background:NAVY,padding:"20px 28px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <p style={{ color:"#93c5fd",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4 }}>Booking Confirmed</p>
          <h3 style={{ color:WHITE,fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:"1.05rem",margin:0 }}>🎉 Inspection Booked!</h3>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,width:34,height:34,display:"grid",placeItems:"center",cursor:"pointer",color:WHITE,fontSize:18 }}>✕</button>
      </div>
      <div style={{ padding:"24px 28px" }}>
        <div style={{ textAlign:"center",marginBottom:20 }}>
          <div style={{ width:72,height:72,borderRadius:"50%",background:"#f0fdf4",display:"grid",placeItems:"center",margin:"0 auto 16px" }}>
            <CheckCircle size={36} color="#16a34a"/>
          </div>
          <h4 style={{ fontFamily:"Poppins,sans-serif",color:NAVY,fontSize:"1.1rem",margin:"0 0 8px" }}>Inspection Booked!</h4>
          {booking && (
            <p style={{ color:"#6b7280",fontSize:13.5,lineHeight:1.7,margin:0 }}>
              Your inspection for <strong style={{ color:NAVY }}>{booking.propertyTitle}</strong> has been confirmed for<br/>
              <strong style={{ color:BLUE }}>{formatDateLabel(booking.date)}</strong> at <strong style={{ color:BLUE }}>{booking.time}</strong>.
            </p>
          )}
        </div>
        <div style={{ background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:12,padding:"14px 16px",marginBottom:18,display:"flex",alignItems:"flex-start",gap:12 }}>
          <span style={{ fontSize:20,flexShrink:0,marginTop:1 }}>✉️</span>
          <div>
            <p style={{ fontWeight:700,fontSize:13.5,color:"#0c4a6e",margin:"0 0 3px" }}>Confirmation Email Sent</p>
            <p style={{ fontSize:13,color:"#0369a1",margin:0 }}>Check your inbox (and spam folder).</p>
          </div>
        </div>
        {booking && (
          <div style={{ background:"#f8fafc",borderRadius:12,padding:"14px 16px",marginBottom:20 }}>
            {[["Property",booking.propertyTitle],["Date",formatDateLabel(booking.date)],["Time",booking.time],["Agent",booking.agentName],["Status","⏳ Pending Agent Confirmation"]].map(([label,value]) => (
              <div key={label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #f3f4f6" }}>
                <span style={{ fontSize:12.5,color:"#6b7280",fontWeight:600 }}>{label}</span>
                <span style={{ fontSize:13,color:NAVY,fontWeight:600,textAlign:"right",maxWidth:"58%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{value}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onClose} style={{ flex:1,padding:"12px",background:WHITE,color:NAVY,border:"1.5px solid #e5e7eb",borderRadius:10,fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"Poppins,sans-serif" }}>Close</button>
          <button onClick={onClose} style={{ flex:1,padding:"12px",background:BLUE,color:WHITE,border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"Poppins,sans-serif" }}>View My Bookings</button>
        </div>
      </div>
    </div>
  </div>
);

const MyBookings = () => {
  const [bookings,      setBookings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [paymentSuccess,setPaymentSuccess]= useState(false);
  const [successBooking,setSuccessBooking]= useState(null);

  const fetchPropertyImage = async (propertyId, token) => {
    try {
      const res  = await fetch(`${API_BASE}/api/v1/properties/details/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const p    = data.property || data.data || data;
      const raw  = p?.images?.[0] || p?.image || "";
      const url  = typeof raw === "string" ? raw : raw?.url || raw?.src || raw?.path || "";
      if (!url) return null;
      return url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
    } catch { return null; }
  };

  const isValidImage = (url) => {
    if (!url || typeof url !== "string") return false;
    if (url === "null" || url === "undefined" || !url.startsWith("http")) return false;
    const l = url.toLowerCase();
    return l.includes(".jpg") || l.includes(".jpeg") || l.includes(".png") ||
           l.includes(".webp") || l.includes(".gif")  || l.includes(".svg") ||
           l.includes("unsplash") || l.includes("cloudinary") ||
           l.includes("/images/") || l.includes("/uploads/") || l.includes("/media/");
  };

  const fetchBookings = useCallback(async (silent = false) => {
    if (!silent) { setLoading(true); setError(null); }
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/api/v1/booking/user-bookings`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const raw = Array.isArray(json.data) ? json.data
                : Array.isArray(json.bookings) ? json.bookings
                : Array.isArray(json) ? json : [];

      const mapped = raw.map(mapBooking);
      const repaired = await Promise.all(mapped.map(async (b) => {
        if (isValidImage(b.propertyImage)) return b;
        const freshImage = b.propertyId
          ? await fetchPropertyImage(b.propertyId, token)
          : null;
        return { ...b, propertyImage: freshImage || "https://placehold.co/400x300/e5e7eb/6b7280?text=Property" };
      }));

      // localStorage fallback: if user already confirmed, keep Confirmed on refresh
      const confirmedIds = JSON.parse(localStorage.getItem("nestfind_confirmed_ids") || "[]");
      const final = repaired.map(b =>
        (b.userConfirmed === true || confirmedIds.includes(b.id)) ? { ...b, status: "Confirmed", userConfirmed: true } : b
      );
      setBookings(final);
    } catch (e) {
      if (!silent) setError(e.message || "Could not load bookings");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params  = new URLSearchParams(window.location.search);
    const trxref  = params.get("trxref") || params.get("reference");
    if (trxref) {
      const pending = JSON.parse(localStorage.getItem("nestfind_pending_booking") || "null");
      if (pending) { setSuccessBooking(pending); localStorage.removeItem("nestfind_pending_booking"); }
      setPaymentSuccess(true);
      window.history.replaceState({}, "", window.location.pathname);
      // Use normal fetch (not silent) so loading spinner resolves correctly
      fetchBookings(false).catch(() => {});
      return;
    }
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status:"Cancelled" } : b));
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/api/v1/booking/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    } catch { /* keep optimistic update */ }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking? This cannot be undone.")) return;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, deleting: true } : b));
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/api/v1/booking/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, deleting: false } : b));
      alert("Could not delete booking. Please try again.");
    }
  };

  const confirmInspection = async (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, confirming: true } : b));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/v1/escrow/confirm-user/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok && json.success !== true) throw new Error("Failed");

      // Read real flags from API response
      const { agentConfirmed, userConfirmed, bookingStatus } = json.data || {};
      const resolvedStatus =
        bookingStatus === "completed" || userConfirmed === true ? "Confirmed" : "Agent Confirmed";

      // Persist to localStorage so refresh remembers
      const ids = JSON.parse(localStorage.getItem("nestfind_confirmed_ids") || "[]");
      if (!ids.includes(id)) { ids.push(id); localStorage.setItem("nestfind_confirmed_ids", JSON.stringify(ids)); }

      setBookings(prev => prev.map(b =>
        b.id === id
          ? { ...b, status: resolvedStatus, agentConfirmed: agentConfirmed ?? b.agentConfirmed, userConfirmed: true, confirming: false }
          : b
      ));
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, confirming: false } : b));
      alert("Could not confirm inspection. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        html,body,#root { margin:0;padding:0;width:100%;min-height:100vh;background:linear-gradient(145deg,#eef2fb 0%,#f3f6fd 40%,#edf9f0 100%); }
        *,*::before,*::after { box-sizing:border-box; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to { transform:rotate(360deg) } }
        .booking-card { transition:transform .2s ease,box-shadow .2s ease!important;animation:fadeInUp .35s ease both; }
        .booking-card:hover { transform:translateY(-3px)!important;box-shadow:0 14px 40px rgba(26,86,219,.13)!important; }
        .stat-card { transition:transform .2s ease,box-shadow .2s ease; }
        .stat-card:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.1)!important; }
        .action-btn { transition:all .15s ease; }
        .action-btn:hover { filter:brightness(.94);transform:scale(1.04); }
        .nestfind-sidebar { transform:translateX(-100%); }
        .nestfind-sidebar.open { transform:translateX(0); }
        @media (min-width:768px) { .nestfind-sidebar { transform:translateX(0)!important; } }
        .booking-main { margin-left:0!important; }
        @media (min-width:768px) { .booking-main { margin-left:256px!important; } }
        .booking-padding { padding:24px 16px 80px!important; }
        @media (min-width:640px) { .booking-padding { padding:32px 28px 80px!important; } }
        @media (min-width:1024px) { .booking-padding { padding:44px 52px 80px!important; } }
        .stats-grid { grid-template-columns:1fr!important; }
        @media (min-width:480px) { .stats-grid { grid-template-columns:repeat(2,1fr)!important; } }
        @media (min-width:900px) { .stats-grid { grid-template-columns:repeat(4,1fr)!important; } }
        .booking-card-inner { flex-direction:column!important; }
        @media (min-width:600px) { .booking-card-inner { flex-direction:row!important; } }
        .booking-img { width:100%!important;height:180px!important; }
        @media (min-width:600px) { .booking-img { width:150px!important;height:auto!important; } }
        .booking-footer { flex-direction:column!important;align-items:flex-start!important;gap:12px!important; }
        @media (min-width:480px) { .booking-footer { flex-direction:row!important;align-items:center!important; } }
        .mobile-topbar { display:flex; }
        @media (min-width:768px) { .mobile-topbar { display:none!important; } }
        .page-header { flex-direction:column!important;align-items:flex-start!important; }
        @media (min-width:640px) { .page-header { flex-direction:row!important;align-items:flex-end!important; } }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet"/>

      {paymentSuccess && <PaymentSuccessModal booking={successBooking} onClose={() => setPaymentSuccess(false)} />}

      <div style={{ display:"flex",minHeight:"100vh",width:"100%",fontFamily:"Inter,sans-serif",background:"linear-gradient(145deg,#eef2fb 0%,#f3f6fd 40%,#edf9f0 100%)" }}>
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>

        <main className="booking-main" style={{ flex:1,minHeight:"100vh",width:"100%",boxSizing:"border-box" }}>

          {/* Mobile top bar */}
          <div className="mobile-topbar" style={{ alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:WHITE,boxShadow:"0 1px 8px rgba(0,0,0,0.08)",position:"sticky",top:0,zIndex:30 }}>
            <span style={{ fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:17,color:NAVY }}>Nest<span style={{ color:BLUE }}>find</span></span>
            <button onClick={()=>setMobileOpen(true)} style={{ background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center" }}>
              <Menu size={24} color={NAVY}/>
            </button>
          </div>

          <div className="booking-padding">
            {/* Page Header */}
            <div className="page-header" style={{ marginBottom:28,display:"flex",justifyContent:"space-between",gap:14 }}>
              <div>
                <p style={{ fontSize:11,fontWeight:700,color:BLUE,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6 }}>Dashboard › My Bookings</p>
                <h1 style={{ fontFamily:"Poppins,sans-serif",fontWeight:800,fontSize:"1.7rem",color:NAVY,lineHeight:1.2,margin:"0 0 6px" }}>My Bookings</h1>
                <p style={{ color:"#6b7280",fontSize:13.5,margin:0 }}>Track and manage all your property inspection appointments.</p>
              </div>
              <div style={{ display:"flex",gap:10,alignSelf:"flex-start",flexWrap:"wrap" }}>
                <button onClick={fetchBookings} style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",background:WHITE,color:"#6b7280",border:"1.5px solid #e5e7eb",borderRadius:10,fontWeight:600,fontSize:13,cursor:"pointer" }}>
                  <RefreshCw size={13}/> Refresh
                </button>
                <button onClick={()=>window.location.href="/dashboard"} style={{ padding:"10px 20px",background:`linear-gradient(135deg,${BLUE},#1444b8)`,color:WHITE,border:"none",borderRadius:11,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"Poppins,sans-serif",boxShadow:"0 6px 20px rgba(26,86,219,0.32)",whiteSpace:"nowrap" }}>
                  + Book Inspection
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 0",gap:12,color:"#9ca3af" }}>
                <div style={{ width:36,height:36,border:"3px solid #e5e7eb",borderTopColor:BLUE,borderRadius:"50%",animation:"spin .7s linear infinite" }}/>
                <p style={{ fontSize:13.5,fontWeight:500 }}>Loading bookings…</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div style={{ background:WHITE,borderRadius:22,padding:"60px 24px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize:48,marginBottom:12 }}>⚠️</div>
                <p style={{ color:"#ef4444",fontWeight:600,fontSize:14,marginBottom:18 }}>{error}</p>
                <button onClick={fetchBookings} style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"11px 24px",background:`linear-gradient(135deg,${BLUE},#1444b8)`,color:WHITE,border:"none",borderRadius:11,fontWeight:700,fontSize:13.5,cursor:"pointer",fontFamily:"Poppins,sans-serif" }}>
                  <RefreshCw size={14}/> Try Again
                </button>
              </div>
            )}

            {/* Stats */}
            {!loading && !error && (
              <div className="stats-grid" style={{ display:"grid",gap:16,marginBottom:30 }}>
                {[
                  { label:"Total Bookings",  value:bookings.length,                                              icon:"📋", color:BLUE,      bg:"linear-gradient(135deg,#eff6ff,#dbeafe)" },
                  { label:"Pending",         value:bookings.filter(b=>b.status==="Pending Confirmation").length, icon:"⏳", color:"#d97706", bg:"linear-gradient(135deg,#fffbeb,#fef3c7)" },
                  { label:"Agent Confirmed", value:bookings.filter(b=>b.status==="Agent Confirmed").length,      icon:"🔔", color:"#1d4ed8", bg:"linear-gradient(135deg,#eff6ff,#bfdbfe)" },
                  { label:"Completed",       value:bookings.filter(b=>b.status==="Confirmed").length,            icon:"✅", color:"#16a34a", bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)" },
                ].map(({ label,value,icon,color,bg }) => (
                  <div key={label} className="stat-card" style={{ background:WHITE,borderRadius:18,padding:"20px 24px",boxShadow:"0 4px 18px rgba(0,0,0,0.07)",border:"1px solid rgba(255,255,255,0.85)",display:"flex",alignItems:"center",gap:16,position:"relative",overflow:"hidden" }}>
                    <div style={{ position:"absolute",right:-20,top:-20,width:90,height:90,borderRadius:"50%",background:bg,opacity:0.65 }}/>
                    <div style={{ width:50,height:50,borderRadius:14,background:bg,display:"grid",placeItems:"center",fontSize:24,flexShrink:0,zIndex:1,boxShadow:"0 3px 10px rgba(0,0,0,0.09)" }}>{icon}</div>
                    <div style={{ zIndex:1 }}>
                      <p style={{ fontSize:30,fontWeight:800,color,margin:0,fontFamily:"Poppins,sans-serif",lineHeight:1 }}>{value}</p>
                      <p style={{ fontSize:12.5,color:"#6b7280",margin:"4px 0 0",fontWeight:600 }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bookings list */}
            {!loading && !error && (
              bookings.length === 0 ? (
                <div style={{ background:WHITE,borderRadius:22,padding:"60px 24px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid rgba(255,255,255,0.9)" }}>
                  <div style={{ fontSize:56,marginBottom:14 }}>📭</div>
                  <h3 style={{ fontFamily:"Poppins,sans-serif",color:NAVY,fontSize:"1.15rem",marginBottom:8 }}>No Bookings Yet</h3>
                  <p style={{ color:"#6b7280",fontSize:13.5,maxWidth:360,margin:"0 auto 24px" }}>You haven't booked any property inspections yet. Start exploring listings and book your first inspection!</p>
                  <button onClick={()=>window.location.href="/dashboard"} style={{ padding:"12px 28px",background:`linear-gradient(135deg,${BLUE},#1444b8)`,color:WHITE,border:"none",borderRadius:12,fontWeight:700,fontSize:13.5,cursor:"pointer",fontFamily:"Poppins,sans-serif",boxShadow:"0 6px 20px rgba(26,86,219,0.32)" }}>
                    Browse Properties
                  </button>
                </div>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <span style={{ fontSize:13,fontWeight:700,color:NAVY,whiteSpace:"nowrap" }}>All Appointments</span>
                    <div style={{ flex:1,height:1,background:"#e5e7eb" }}/>
                    <span style={{ fontSize:12,color:"#9ca3af",whiteSpace:"nowrap" }}>{bookings.length} booking{bookings.length!==1?"s":""}</span>
                  </div>

                  {bookings.map((booking, idx) => {
                    const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES["Pending Confirmation"];
                    return (
                      <div key={booking.id} className="booking-card" style={{ background:WHITE,borderRadius:18,overflow:"hidden",boxShadow:"0 4px 18px rgba(0,0,0,0.08)",border:"1px solid rgba(255,255,255,0.85)",animationDelay:`${idx*0.07}s` }}>
                        <div className="booking-card-inner" style={{ display:"flex" }}>
                          {/* Image */}
                          <div className="booking-img" style={{ flexShrink:0,position:"relative",overflow:"hidden" }}>
                            <img src={booking.propertyImage} alt={booking.propertyTitle} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} onError={e=>{ e.currentTarget.src="https://placehold.co/400x300/e5e7eb/6b7280?text=Property"; }}/>
                            <div style={{ position:"absolute",bottom:10,left:10,background:booking.priceType==="rent"?BLUE:NAVY,color:WHITE,fontSize:10,fontWeight:700,padding:"3px 11px",borderRadius:100,letterSpacing:"0.5px",textTransform:"uppercase" }}>
                              {booking.priceType==="rent"?"For Rent":"For Sale"}
                            </div>
                          </div>

                          {/* Content */}
                          <div style={{ flex:1,padding:"18px 20px",display:"flex",flexDirection:"column",justifyContent:"space-between",minWidth:0 }}>
                            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:12,flexWrap:"wrap" }}>
                              <div style={{ minWidth:0 }}>
                                <h3 style={{ fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:"1rem",color:NAVY,margin:"0 0 5px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{booking.propertyTitle}</h3>
                                {booking.propertyAddress && (
                                  <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                                    <MapPin size={12} color="#9ca3af"/>
                                    <span style={{ fontSize:12,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{booking.propertyAddress}</span>
                                  </div>
                                )}
                              </div>
                              <span style={{ fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,background:statusStyle.bg,color:statusStyle.color,border:`1px solid ${statusStyle.border}`,whiteSpace:"nowrap",flexShrink:0 }}>
                                {booking.status}
                              </span>
                            </div>

                            <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
                              {booking.date && (
                                <div style={{ display:"flex",alignItems:"center",gap:6,background:"#f8fafc",border:"1px solid #f3f4f6",padding:"5px 11px",borderRadius:9,fontSize:12,fontWeight:600,color:NAVY }}>
                                  <Calendar size={13} color={BLUE}/> {formatDateLabel(booking.date)}
                                </div>
                              )}
                              {booking.time && (
                                <div style={{ display:"flex",alignItems:"center",gap:6,background:"#f8fafc",border:"1px solid #f3f4f6",padding:"5px 11px",borderRadius:9,fontSize:12,fontWeight:600,color:NAVY }}>
                                  <Clock size={13} color={BLUE}/> {booking.time}
                                </div>
                              )}
                              <div style={{ display:"flex",alignItems:"center",gap:6,background:"#f8fafc",border:"1px solid #f3f4f6",padding:"5px 11px",borderRadius:9,fontSize:12,fontWeight:600,color:NAVY }}>
                                <span style={{ fontSize:13 }}>👤</span> Agent: {booking.agentName}
                              </div>
                              <div style={{ display:"flex",alignItems:"center",gap:5,background:"#eff6ff",border:"1px solid #bfdbfe",padding:"5px 11px",borderRadius:9 }}>
                                <span style={{ fontSize:13,fontWeight:800,color:BLUE,fontFamily:"Poppins,sans-serif" }}>{formatPrice(booking.price)}</span>
                                <span style={{ fontSize:10.5,color:"#60a5fa" }}>inspection fee</span>
                              </div>
                            </div>

                            <div className="booking-footer" style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                              <span style={{ fontSize:11.5,color:"#9ca3af" }}>
                                Booked on {new Date(booking.bookedAt).toLocaleDateString("en-GB",{ day:"numeric",month:"short",year:"numeric" })}
                              </span>
                              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>

                                {/* Status badges */}
                                {booking.status==="Pending Confirmation" && (
                                  <span style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:"#fefce8",color:"#854d0e",border:"1px solid #fde68a",borderRadius:9,fontSize:12,fontWeight:700 }}>
                                    ⏳ Awaiting Agent
                                  </span>
                                )}
                                {booking.status==="Agent Confirmed" && (
                                  <span style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",borderRadius:9,fontSize:12,fontWeight:700 }}>
                                    🔔 Agent Accepted
                                  </span>
                                )}
                                {booking.status==="Confirmed" && (
                                  <span style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",borderRadius:9,fontSize:12,fontWeight:700 }}>
                                    <CheckCircle size={13}/> Inspection Done
                                  </span>
                                )}

                                {/* Confirm button — only when agentConfirmed=true and userConfirmed=false */}
                                {booking.agentConfirmed && !booking.userConfirmed && (
                                  <button
                                    className="action-btn"
                                    onClick={()=>confirmInspection(booking.id)}
                                    disabled={booking.confirming}
                                    style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:booking.confirming?"#9ca3af":"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:booking.confirming?"not-allowed":"pointer",boxShadow:booking.confirming?"none":"0 4px 12px rgba(22,163,74,0.35)",transition:"all .2s" }}>
                                    {booking.confirming
                                      ? <><span style={{width:11,height:11,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/> Confirming…</>
                                      : <><CheckCircle size={13}/> Confirm Inspection</>
                                    }
                                  </button>
                                )}

                                {/* Delete button — only on pending/disputed/cancelled */}
                                {(booking.status==="Pending Confirmation" || booking.status==="Disputed" || booking.status==="Cancelled") && (
                                  <button
                                    className="action-btn"
                                    onClick={()=>deleteBooking(booking.id)}
                                    disabled={booking.deleting}
                                    style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:booking.deleting?"#9ca3af":"#fef2f2",color:booking.deleting?"#fff":"#ef4444",border:"1px solid #fecaca",borderRadius:9,fontSize:12,fontWeight:700,cursor:booking.deleting?"not-allowed":"pointer",transition:"all .2s" }}>
                                    {booking.deleting
                                      ? <><span style={{width:11,height:11,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/> Deleting…</>
                                      : <><XCircle size={13}/> Delete</>
                                    }
                                  </button>
                                )}

                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action banner — only when agentConfirmed=true and userConfirmed=false */}
                        {booking.agentConfirmed && !booking.userConfirmed && (
                          <div style={{ background:"linear-gradient(135deg,#eff6ff,#dbeafe)",borderTop:"1px solid #bfdbfe",padding:"10px 20px",display:"flex",alignItems:"center",gap:10 }}>
                            <span style={{ fontSize:18 }}>🔔</span>
                            <p style={{ fontSize:12.5,color:"#1d4ed8",fontWeight:700,margin:0 }}>
                              Action Required — The agent has confirmed your inspection. Click <strong>"Confirm Inspection"</strong> after your inspection takes place to release the agent's fee.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default MyBookings;