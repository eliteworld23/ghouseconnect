// src/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

// ── Icons ──────────────────────────────────────────────────────────────────
const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconBookings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconProfile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const IconSupport = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconLocation = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconDots = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
  </svg>
);
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconBed = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 9V5a2 2 0 012-2h16a2 2 0 012 2v4"/>
    <path d="M2 22V17a2 2 0 012-2h16a2 2 0 012 2v5"/>
    <path d="M6 15v-3a2 2 0 012-2h8a2 2 0 012 2v3"/>
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (val) => {
  if (!val) return "—";
  const n = Number(val);
  if (isNaN(n)) return val;
  return `₦${n.toLocaleString()}`;
};

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const TYPE_BADGE = {
  apartment:  { bg: "#1a56db", color: "#fff" },
  house:      { bg: "#0891b2", color: "#fff" },
  land:       { bg: "#059669", color: "#fff" },
  office:     { bg: "#7c3aed", color: "#fff" },
  commercial: { bg: "#dc2626", color: "#fff" },
};

const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const AVATAR_COLORS = ["#1a56db","#0891b2","#7c3aed","#059669","#ea580c","#db2777"];
const getAvatarColor = (name = "") => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const NAV_W = 220;

// ── Delete Modal ───────────────────────────────────────────────────────────
const DeleteModal = ({ listing, onCancel, onConfirm, isDeleting }) => (
  <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(11,26,46,0.55)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:380,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
      <div style={{width:52,height:52,borderRadius:"50%",background:"#fee2e2",display:"grid",placeItems:"center",margin:"0 auto 16px"}}>
        <IconTrash />
      </div>
      <h3 style={{textAlign:"center",fontSize:17,fontWeight:700,color:"#0b1a2e",margin:"0 0 8px",fontFamily:"'Poppins',sans-serif"}}>Delete Listing?</h3>
      <p style={{textAlign:"center",fontSize:13.5,color:"#6b7280",margin:"0 0 24px",lineHeight:1.5}}>
        Are you sure you want to delete <strong style={{color:"#0b1a2e"}}>{listing?.title}</strong>? This cannot be undone.
      </p>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onCancel} disabled={isDeleting} style={{flex:1,height:42,borderRadius:9,border:"1px solid #e5e7eb",background:"#fff",fontSize:14,fontWeight:600,color:"#6b7280",cursor:"pointer"}}>Cancel</button>
        <button onClick={onConfirm} disabled={isDeleting} style={{flex:1,height:42,borderRadius:9,border:"none",background:"#dc2626",fontSize:14,fontWeight:600,color:"#fff",cursor:"pointer",opacity:isDeleting?0.6:1}}>
          {isDeleting ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Property Card ──────────────────────────────────────────────────────────
const PropertyCard = ({ listing, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const typeRaw = (listing.propertyType || listing.type || "apartment").toLowerCase();
  const typeLabel = typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1);
  const badge = TYPE_BADGE[typeRaw] || { bg: "#1a56db", color: "#fff" };

  const agentName = listing.agentName || listing.agent?.name || listing.agent?.fullName || "Agent";
  const agentInitials = getInitials(agentName);
  const avatarBg = getAvatarColor(agentName);

  const location = [listing.street || listing.address, listing.city, listing.state].filter(Boolean).join(", ") || "—";
  const price = listing.price ? fmt(listing.price) : "—";
  const inspFee = listing.inspectionFee || listing.agencyFee;

  const imageUrl =
    (Array.isArray(listing.images) && (listing.images[0]?.url || listing.images[0])) ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80";

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div
      style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 14px rgba(0,0,0,0.07)",transition:"box-shadow 0.2s,transform 0.2s",display:"flex",flexDirection:"column"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 10px 32px rgba(26,86,219,0.15)";e.currentTarget.style.transform="translateY(-3px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 14px rgba(0,0,0,0.07)";e.currentTarget.style.transform="translateY(0)";}}
    >
      {/* Image */}
      <div style={{position:"relative",width:"100%",paddingBottom:"65%",overflow:"hidden",flexShrink:0}}>
        <img src={imageUrl} alt={listing.title}
          style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}
          onError={e=>{e.target.src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80";}}
        />
        {/* Type badge */}
        <div style={{position:"absolute",top:12,left:12}}>
          <span style={{background:badge.bg,color:badge.color,fontSize:10,fontWeight:700,letterSpacing:"0.07em",padding:"4px 10px",borderRadius:6,textTransform:"uppercase"}}>
            {typeLabel}
          </span>
        </div>
        {/* Three-dot menu */}
        <div ref={menuRef} style={{position:"absolute",top:10,right:10}}>
          <button onClick={()=>setMenuOpen(o=>!o)} style={{background:"rgba(255,255,255,0.92)",border:"none",borderRadius:8,width:30,height:30,display:"grid",placeItems:"center",cursor:"pointer",color:"#6b7280"}}>
            <IconDots />
          </button>
          {menuOpen && (
            <div style={{position:"absolute",top:36,right:0,background:"#fff",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,0.14)",border:"1px solid #e5e7eb",minWidth:130,zIndex:50,overflow:"hidden"}}>
              <button onClick={()=>{setMenuOpen(false);onEdit(listing);}} style={{width:"100%",padding:"10px 14px",display:"flex",alignItems:"center",gap:8,border:"none",background:"none",fontSize:13,color:"#374151",cursor:"pointer",fontWeight:500}}
                onMouseEnter={e=>e.currentTarget.style.background="#f3f7ff"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}
              ><IconEdit />Edit Listing</button>
              <div style={{height:1,background:"#f3f4f6"}}/>
              <button onClick={()=>{setMenuOpen(false);onDelete(listing);}} style={{width:"100%",padding:"10px 14px",display:"flex",alignItems:"center",gap:8,border:"none",background:"none",fontSize:13,color:"#dc2626",cursor:"pointer",fontWeight:500}}
                onMouseEnter={e=>e.currentTarget.style.background="#fff1f1"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}
              ><IconTrash />Delete</button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{padding:"14px 16px 16px",flex:1,display:"flex",flexDirection:"column",gap:6}}>
        <div style={{fontSize:15,fontWeight:700,color:"#0b1a2e",lineHeight:1.3}}>
          {listing.title || "Untitled Property"}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#9ca3af"}}>
          <IconLocation />{location}
        </div>

        {/* Agent + price */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6,gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:avatarBg,display:"grid",placeItems:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>
              {agentInitials}
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:11,fontWeight:700,color:"#0b1a2e",textTransform:"uppercase",letterSpacing:"0.04em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{agentName}</div>
              {inspFee && <div style={{fontSize:11,color:"#9ca3af"}}>Inspection: {fmt(inspFee)}</div>}
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:16,fontWeight:700,color:"#1a56db",fontFamily:"'Poppins',sans-serif"}}>{price}</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>listing price</div>
          </div>
        </div>

        {/* Beds / views */}
        {(listing.bedrooms > 0 || listing.views > 0) && (
          <div style={{display:"flex",gap:12,fontSize:12,color:"#6b7280",marginTop:2}}>
            {listing.bedrooms > 0 && <span style={{display:"flex",alignItems:"center",gap:3}}><IconBed />{listing.bedrooms} beds</span>}
            {listing.views > 0 && <span style={{display:"flex",alignItems:"center",gap:3}}><IconEye />{listing.views} views</span>}
          </div>
        )}

        {/* View Property button */}
        <button
          onClick={()=>onEdit(listing)}
          style={{marginTop:8,width:"100%",height:44,borderRadius:10,border:"none",background:"#0b1a2e",color:"#fff",fontSize:13.5,fontWeight:600,cursor:"pointer",transition:"background 0.18s",fontFamily:"'Poppins',sans-serif"}}
          onMouseEnter={e=>e.currentTarget.style.background="#1a56db"}
          onMouseLeave={e=>e.currentTarget.style.background="#0b1a2e"}
        >
          View Property
        </button>
      </div>
    </div>
  );
};

// ── Sidebar Link ──────────────────────────────────────────────────────────
const SideLink = ({ icon, label, active, onClick, danger }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        display:"flex",alignItems:"center",gap:12,width:"100%",
        padding:"11px 14px",borderRadius:10,border:"none",cursor:"pointer",
        textAlign:"left",fontSize:14,fontWeight:active?600:500,
        color: danger?(hov?"#dc2626":"#ef4444"):active?"#1a56db":hov?"#0b1a2e":"#6b7280",
        background: danger?(hov?"rgba(220,38,38,0.06)":"transparent"):active?"rgba(26,86,219,0.09)":hov?"#f5f8ff":"transparent",
        transition:"all 0.15s",position:"relative",
      }}
    >
      {active && !danger && (
        <span style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:3,background:"#1a56db",borderRadius:"0 3px 3px 0"}}/>
      )}
      {icon}{label}
    </button>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = ({ activePage, onNavigate, drawerOpen, setDrawerOpen }) => {
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const agentObj = storedUser?.agent || storedUser;
  const fullName = agentObj?.fullName || agentObj?.name || storedUser?.fullName || storedUser?.name || "Agent";
  const initials = getInitials(fullName);

  const links = [
    { id:"Dashboard",   icon:<IconHome />,     label:"Dashboard" },
    { id:"Bookings",    icon:<IconBookings />,  label:"My Bookings" },
    { id:"My Profile",  icon:<IconProfile />,   label:"Profile" },
    { id:"Settings",    icon:<IconSettings />,  label:"Settings" },
    { id:"Support",     icon:<IconSupport />,   label:"Support" },
  ];

  const content = (
    <nav style={{width:NAV_W,height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"20px 12px",boxShadow:"2px 0 20px rgba(26,86,219,0.08)",overflowY:"auto",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#1a56db,#60a5fa)"}}/>

      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 6px 20px",borderBottom:"1px solid #f0f0f0",marginBottom:8}}>
        <div style={{width:36,height:36,background:"#0b1a2e",borderRadius:10,display:"grid",placeItems:"center",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="white" strokeWidth="1.9"/></svg>
        </div>
        <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:18,color:"#0b1a2e",letterSpacing:"-0.3px"}}>
          Nest<span style={{color:"#1a56db"}}>find</span>
        </span>
        <button onClick={()=>setDrawerOpen(false)} className="nf2-close-btn" style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"#9ca3af",padding:4,display:"grid",placeItems:"center",borderRadius:6}}>
          <IconClose />
        </button>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:2,flex:1}}>
        {links.map(({id,icon,label})=>(
          <SideLink key={id} icon={icon} label={label} active={activePage===id}
            onClick={()=>{onNavigate&&onNavigate(id);setDrawerOpen(false);}}
          />
        ))}
      </div>

      <div style={{borderTop:"1px solid #f0f0f0",paddingTop:12,marginTop:8}}>
        <SideLink icon={<IconLogout />} label="Log out" danger
          onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");window.location.href="/";}}
        />
      </div>

      {/* User card */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 8px 4px",marginTop:4}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#1a56db,#60a5fa)",display:"grid",placeItems:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>
          {initials}
        </div>
        <div style={{minWidth:0}}>
          <div style={{fontSize:12,fontWeight:700,color:"#0b1a2e",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textTransform:"uppercase",letterSpacing:"0.04em"}}>{fullName}</div>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <style>{`
        .nf2-close-btn { display: none !important; }
        .nf2-desktop-sb { display: block; }
        .nf2-mobile-tb { display: none !important; }
        @media (max-width: 767px) {
          .nf2-desktop-sb { display: none !important; }
          .nf2-mobile-tb { display: flex !important; }
          .nf2-close-btn { display: grid !important; }
        }
        @keyframes nf2fi { from{opacity:0} to{opacity:1} }
      `}</style>

      <div className="nf2-desktop-sb" style={{position:"fixed",top:0,left:0,width:NAV_W,height:"100vh",zIndex:100}}>
        {content}
      </div>

      <header className="nf2-mobile-tb" style={{position:"fixed",top:0,left:0,right:0,height:54,background:"#fff",borderBottom:"1px solid #e5e7eb",alignItems:"center",justifyContent:"space-between",padding:"0 16px",zIndex:200,boxShadow:"0 2px 10px rgba(26,86,219,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:"#0b1a2e",borderRadius:8,display:"grid",placeItems:"center"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </div>
          <span style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:16,color:"#0b1a2e"}}>Nest<span style={{color:"#1a56db"}}>find</span></span>
        </div>
        <button onClick={()=>setDrawerOpen(true)} style={{background:"none",border:"none",cursor:"pointer",color:"#0b1a2e",padding:6,borderRadius:8}}><IconMenu /></button>
      </header>

      {drawerOpen && (
        <div onClick={()=>setDrawerOpen(false)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(11,26,46,0.4)",backdropFilter:"blur(2px)",animation:"nf2fi 0.2s ease"}}/>
      )}
      <div style={{position:"fixed",top:0,left:0,width:NAV_W,height:"100dvh",zIndex:400,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s cubic-bezier(0.4,0,0.2,1)"}}>
        {content}
      </div>
    </>
  );
};

// ── Hero Banner ────────────────────────────────────────────────────────────
const HeroBanner = ({ searchVal, onSearchChange, statusFilter, setStatusFilter }) => (
  <div style={{position:"relative",borderRadius:16,overflow:"hidden",marginBottom:28,minHeight:200,background:"linear-gradient(135deg,#0b1a2e 0%,#1a56db 60%,#3b82f6 100%)"}}>
    <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80" alt=""
      style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.22}}
    />
    <div style={{position:"relative",zIndex:1,padding:"28px 24px"}}>
      <h2 style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:22,color:"#fff",margin:"0 0 4px",lineHeight:1.2}}>Find Your Properties</h2>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:0,marginBottom:18}}>Manage and explore all your listed properties</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:1,minWidth:180,maxWidth:340}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}><IconSearch /></span>
          <input type="text" placeholder="Search properties..." value={searchVal} onChange={e=>onSearchChange(e.target.value)}
            style={{width:"100%",height:42,paddingLeft:40,paddingRight:14,border:"none",borderRadius:10,fontSize:13.5,color:"#374151",outline:"none",background:"rgba(255,255,255,0.95)",boxSizing:"border-box"}}
          />
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["All Status","For Rent","For Sale"].map(f=>(
            <button key={f} onClick={()=>setStatusFilter(f)} style={{padding:"9px 16px",borderRadius:20,fontSize:12.5,fontWeight:600,border:statusFilter===f?"none":"1.5px solid rgba(255,255,255,0.5)",background:statusFilter===f?"#fff":"transparent",color:statusFilter===f?"#1a56db":"#fff",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s"}}>
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdashBoard({ onNavigate }) {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true); setFetchError("");
      const token = localStorage.getItem("token");
      if (!token) { setFetchError("Not logged in."); setLoading(false); return; }
      try {
        const { data } = await axios.get(`${API_BASE}/api/v1/properties/agent/properties`, { headers: authHeaders() });
        setListings(data?.properties || data?.data || data?.listings || (Array.isArray(data) ? data : []));
      } catch (err) {
        setFetchError(err.response?.data?.message || "Failed to load listings.");
      } finally { setLoading(false); }
    })();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true); setDeleteError("");
    try {
      await axios.delete(`${API_BASE}/api/v1/properties/delete/${deleteTarget._id||deleteTarget.id}`, { headers: authHeaders() });
      setListings(prev => prev.filter(l => (l._id||l.id) !== (deleteTarget._id||deleteTarget.id)));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete.");
    } finally { setIsDeleting(false); }
  };

  const handleEdit = (listing) => navigate(`/edit/${listing._id||listing.id}`, { state: { listing } });

  const filtered = listings.filter(l => {
    const title = (l.title || "").toLowerCase();
    const loc = [l.city, l.state].filter(Boolean).join(", ").toLowerCase();
    const matchSearch = title.includes(search.toLowerCase()) || loc.includes(search.toLowerCase());
    const purpose = (l.purpose || l.listingType || "").toLowerCase();
    const matchStatus =
      statusFilter === "All Status" ||
      (statusFilter === "For Rent" && (purpose.includes("rent") || purpose.includes("short"))) ||
      (statusFilter === "For Sale" && purpose.includes("sale"));
    const matchType = typeFilter === "All Types" || (l.propertyType || l.type || "").toLowerCase() === typeFilter.toLowerCase();
    return matchSearch && matchStatus && matchType;
  });

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body, html { overflow-x: hidden; margin: 0; padding: 0; }

        /* AgentLayout in App.jsx already applies margin-left:260px via agent-main-content.
           dash2-page must NOT add any extra margin — just fill 100% of the space given. */
        .dash2-page { min-height: 100vh; background: #f4f6fb; width: 100%; }

        .dash2-inner { padding: 68px 16px 40px; }
        @media (min-width: 480px) { .dash2-inner { padding: 68px 20px 40px; } }
        @media (min-width: 640px) { .dash2-inner { padding: 68px 24px 40px; } }
        @media (min-width: 768px) { .dash2-inner { padding: 28px 24px 40px; } }
        @media (min-width: 1024px) { .dash2-inner { padding: 32px 32px 40px; } }

        .dash2-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 540px) { .dash2-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px) { .dash2-grid { grid-template-columns: repeat(3, 1fr); } }
        @keyframes shimmer2 { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      {deleteTarget && (
        <DeleteModal listing={deleteTarget}
          onCancel={()=>{setDeleteTarget(null);setDeleteError("");}}
          onConfirm={handleDeleteConfirm} isDeleting={isDeleting}
        />
      )}

      <div className="dash2-page">
        <div className="dash2-inner">

          <HeroBanner searchVal={search} onSearchChange={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

          {/* Count + type filter row */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
            <p style={{fontSize:14,color:"#6b7280",margin:0}}>
              Showing <strong style={{color:"#0b1a2e"}}>{loading?"…":filtered.length}</strong> {filtered.length===1?"property":"properties"}
            </p>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
              style={{height:38,padding:"0 14px",borderRadius:9,border:"1px solid #e5e7eb",fontSize:13,color:"#374151",background:"#fff",cursor:"pointer",outline:"none"}}
            >
              {["All Types","Apartment","House","Land","Office","Commercial"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>

          {fetchError && (
            <div style={{marginBottom:18,padding:"12px 16px",background:"#fee2e2",borderRadius:10,fontSize:13,color:"#dc2626"}}>
              ⚠ {fetchError} — <button onClick={()=>window.location.reload()} style={{background:"none",border:"none",color:"#dc2626",fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>Retry</button>
            </div>
          )}
          {deleteError && (
            <div style={{marginBottom:18,padding:"12px 16px",background:"#fee2e2",borderRadius:10,fontSize:13,color:"#dc2626"}}>⚠ {deleteError}</div>
          )}

          {loading && (
            <div className="dash2-grid">
              {[1,2,3,4].map(i=>(
                <div key={i} style={{borderRadius:16,overflow:"hidden",background:"#fff",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                  <div style={{height:180,background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",backgroundSize:"200% 100%",animation:"shimmer2 1.4s infinite"}}/>
                  <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{height:14,background:"#f3f4f6",borderRadius:6,width:"70%"}}/>
                    <div style={{height:12,background:"#f3f4f6",borderRadius:6,width:"50%"}}/>
                    <div style={{height:38,background:"#f3f4f6",borderRadius:8,marginTop:6}}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="dash2-grid">
              {filtered.map(l=>(
                <PropertyCard key={l._id||l.id} listing={l} onEdit={handleEdit} onDelete={setDeleteTarget}/>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && !fetchError && (
            <div style={{textAlign:"center",padding:"70px 0",color:"#9ca3af"}}>
              <div style={{fontSize:48,marginBottom:14}}>🏠</div>
              <div style={{fontSize:16,fontWeight:600,color:"#6b7280"}}>No properties found</div>
              <div style={{fontSize:13,marginTop:4}}>{listings.length===0?"You haven't listed any properties yet.":"Try adjusting your filters."}</div>
              {listings.length===0 && (
                <button onClick={()=>navigate("/create-listing")} style={{marginTop:20,padding:"11px 24px",background:"#1a56db",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                  + Create your first listing
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}