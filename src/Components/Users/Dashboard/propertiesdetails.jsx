import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, BedDouble, Bath, Maximize2, Calendar,
  Home, CheckCircle, Share2, Heart, ChevronRight, Menu,
} from "lucide-react";
import Sidebar from "./Navbar";
import VideoPlayer from "./Videoplayer";
import InspectionModal from "./Inspectionmodal";
import { BLUE, NAVY, WHITE, formatPrice } from "./Constant";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/properties/details/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        const p = data.property || data.data || data;
        const mapped = {
          _id:          p._id || p.id,
          title:        p.title,
          location:     [p.area, p.city, p.state].filter(Boolean).join(", "),
          address:      [p.street, p.area, p.city, p.state, p.country].filter(Boolean).join(", "),
          price:        p.price,
          type:         p.purpose === "sale" ? "sale" : "rent",
          propertyType: p.type,
          bedrooms:     p.bedrooms ?? 0,
          bathrooms:    p.bathrooms ?? 0,
          toilets:      p.toilets ?? 0,
          sqft:         p.propertySize ?? 0,
          yearBuilt:    p.yearBuilt ?? "—",
          parking:      p.parking ?? 0,
          description:  p.description || "",
          features:     Array.isArray(p.features) ? p.features : [],
          image:        (() => {
            const raw = p.images?.[0] || p.image || p.thumbnail;
            if (!raw) return "https://placehold.co/1400x900/e5e7eb/6b7280?text=Property";
            if (typeof raw === "string") return raw;
            return raw?.url || raw?.src || raw?.path || "https://placehold.co/1400x900/e5e7eb/6b7280?text=Property";
          })(),
          videoUrl:     (() => {
            const v = p.videoUrl || p.video || (Array.isArray(p.videos) ? p.videos[0] : undefined);
            if (!v) return null;
            if (typeof v === "string") return v;
            return v?.url || v?.src || null;
          })(),
          agentFee:     p.agentFee || p.agent?.fee || p.inspectionFee || p.agent_fee || null,
          agent: {
            name:   p.agent?.name   || p.agentName   || "Agent",
            avatar: p.agent?.avatar || p.agentAvatar || "",
            phone:  p.agent?.phone  || p.agentPhone  || "",
            fee:    p.agent?.fee    || p.agentFee     || p.inspectionFee || null,
          },
        };
        setProperty(mapped);
      } catch (err) {
        console.error(err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: "3px solid #e5e7eb", borderTopColor: BLUE, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 14px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Loading property details…</p>
      </div>
    </div>
  );

  if (!property) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
        <h2 style={{ color: NAVY, fontFamily: "Poppins, sans-serif", marginBottom: 8 }}>Property Not Found</h2>
        <button onClick={() => navigate(-1)} style={{ padding: "10px 24px", background: BLUE, color: WHITE, border: "none", borderRadius: 9, fontWeight: 600, cursor: "pointer" }}>Go Back</button>
      </div>
    </div>
  );

  const specs = [
    { icon: BedDouble, label: "Bedrooms",    value: property.bedrooms },
    { icon: Bath,      label: "Bathrooms",   value: property.bathrooms },
    { icon: Maximize2, label: "Area (sqft)", value: property.sqft.toLocaleString() },
    { icon: Home,      label: "Type",        value: property.propertyType },
    { icon: Calendar,  label: "Year Built",  value: property.yearBuilt },
    { icon: Home,      label: "Parking",     value: property.parking },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif", display: "flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .nestfind-sidebar { transform: translateX(-100%); }
        .nestfind-sidebar.open { transform: translateX(0); }
        @media (min-width: 768px) { .nestfind-sidebar { transform: translateX(0) !important; } }
        .pd-main { margin-left: 0 !important; width: 100% !important; }
        @media (min-width: 768px) { .pd-main { margin-left: 256px !important; width: calc(100% - 256px) !important; } }
        .pd-topbar { display: flex !important; }
        @media (min-width: 768px) { .pd-topbar { display: none !important; } }
        .pd-breadcrumb { padding: 12px 16px !important; }
        @media (min-width: 1024px) { .pd-breadcrumb { padding: 14px 36px !important; } }
        .pd-content { padding: 20px 16px 60px !important; }
        @media (min-width: 640px) { .pd-content { padding: 28px 24px 60px !important; } }
        @media (min-width: 1024px) { .pd-content { padding: 32px 36px 60px !important; } }
        .pd-title-row { flex-direction: column !important; }
        @media (min-width: 600px) { .pd-title-row { flex-direction: row !important; } }
        .pd-grid { grid-template-columns: 1fr !important; }
        @media (min-width: 1024px) { .pd-grid { grid-template-columns: 1fr 300px !important; } }
        .pd-video { height: 240px !important; }
        @media (min-width: 480px) { .pd-video { height: 320px !important; } }
        @media (min-width: 768px) { .pd-video { height: 400px !important; } }
        @media (min-width: 1024px) { .pd-video { height: 460px !important; } }
        .pd-specs { grid-template-columns: repeat(2,1fr) !important; }
        @media (min-width: 480px) { .pd-specs { grid-template-columns: repeat(3,1fr) !important; } }
        .pd-features { grid-template-columns: 1fr !important; }
        @media (min-width: 480px) { .pd-features { grid-template-columns: repeat(2,1fr) !important; } }
        .pd-sidebar-col { position: static !important; }
        @media (min-width: 1024px) { .pd-sidebar-col { position: sticky !important; top: 24px !important; } }
        .pd-map { height: 220px !important; }
        @media (min-width: 640px) { .pd-map { height: 280px !important; } }
        .pd-hero-title { font-size: 1.35rem !important; }
        @media (min-width: 480px) { .pd-hero-title { font-size: 1.6rem !important; } }
        @media (min-width: 768px) { .pd-hero-title { font-size: 1.75rem !important; } }
        .pd-price { font-size: 1.4rem !important; }
        @media (min-width: 480px) { .pd-price { font-size: 1.7rem !important; } }
        @media (min-width: 768px) { .pd-price { font-size: 1.9rem !important; } }
      `}</style>

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="pd-main" style={{ flex: 1, minHeight: "100vh", boxSizing: "border-box" }}>

        {/* Mobile top bar */}
        <div className="pd-topbar" style={{ alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: WHITE, boxShadow: "0 1px 8px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 30 }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: NAVY }}>
            Nest<span style={{ color: BLUE }}>find</span>
          </span>
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Menu size={22} color={NAVY} />
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="pd-breadcrumb" style={{ background: WHITE, borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
            <ArrowLeft size={14} /> Back to Listings
          </button>
          <ChevronRight size={13} color="#d1d5db" />
          <span style={{ fontSize: 13, color: "#6b7280" }}>Properties</span>
          <ChevronRight size={13} color="#d1d5db" />
          <span style={{ fontSize: 13, color: NAVY, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{property.title}</span>
        </div>

        <div className="pd-content">

          {/* Title row */}
          <div className="pd-title-row" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ background: property.type === "rent" ? BLUE : NAVY, color: WHITE, fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {property.type === "rent" ? "For Rent" : "For Sale"}
                </span>
                <span style={{ background: "#f0f4ff", color: BLUE, fontSize: 11, fontWeight: 600, padding: "4px 14px", borderRadius: 100 }}>{property.propertyType}</span>
                <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 11, fontWeight: 600, padding: "4px 14px", borderRadius: 100 }}>✓ Verified</span>
              </div>
              <h1 className="pd-hero-title" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, color: NAVY, margin: "0 0 8px", lineHeight: 1.2 }}>{property.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} color="#9ca3af" />
                <span style={{ fontSize: 13.5, color: "#6b7280" }}>{property.address}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div className="pd-price" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, color: BLUE }}>{formatPrice(property.price)}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{property.type === "rent" ? "per year" : "asking price"}</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
                <button onClick={() => setSaved(s => !s)} style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #e5e7eb", background: saved ? "#fef2f2" : WHITE, display: "grid", placeItems: "center", cursor: "pointer", transition: "all .2s" }}>
                  <Heart size={16} color={saved ? "#ef4444" : "#9ca3af"} fill={saved ? "#ef4444" : "none"} />
                </button>
                <button onClick={() => navigator.share?.({ title: property.title, url: window.location.href })} style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #e5e7eb", background: WHITE, display: "grid", placeItems: "center", cursor: "pointer" }}>
                  <Share2 size={16} color="#9ca3af" />
                </button>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="pd-grid" style={{ display: "grid", gap: 24, alignItems: "start" }}>

            {/* LEFT */}
            <div>
              <div className="pd-video" style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.13)", marginBottom: 22 }}>
                <VideoPlayer videoUrl={property.videoUrl} fallbackImage={property.image} title={property.title} />
              </div>

              <div className="pd-specs" style={{ background: WHITE, borderRadius: 16, padding: "20px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20, display: "grid", gap: 18 }}>
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0f4ff", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon size={18} color={BLUE} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: 0, fontFamily: "Poppins, sans-serif" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: WHITE, borderRadius: 16, padding: "20px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: NAVY, marginBottom: 12 }}>Description</h2>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.85, margin: 0 }}>{property.description}</p>
              </div>

              <div style={{ background: WHITE, borderRadius: 16, padding: "20px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: NAVY, marginBottom: 14 }}>Property Features</h2>
                <div className="pd-features" style={{ display: "grid", gap: 10 }}>
                  {property.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f0fdf4", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <CheckCircle size={13} color="#16a34a" />
                      </div>
                      <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: WHITE, borderRadius: 16, padding: "20px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: NAVY, marginBottom: 10 }}>Address</h2>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
                  <MapPin size={16} color={BLUE} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7 }}>{property.address}</span>
                </div>
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                  <iframe title="Property Location" width="100%" className="pd-map"
                    style={{ border: 0, display: "block" }} loading="lazy" allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed`}
                  />
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 13, color: BLUE, fontWeight: 600, textDecoration: "none" }}>
                  <MapPin size={13} color={BLUE} /> View on Google Maps
                </a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="pd-sidebar-col">
              <div style={{ background: WHITE, borderRadius: 18, boxShadow: "0 8px 36px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                <div style={{ background: NAVY, padding: "20px 22px", display: "flex", alignItems: "center", gap: 13 }}>
                  <img src={property.agent.avatar} alt={property.agent.name}
                    style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.25)", flexShrink: 0 }}
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent.name)}&background=1a56db&color=fff&size=48`; }}
                  />
                  <div>
                    <p style={{ color: "#93c5fd", fontSize: 10.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 3px" }}>Listed by</p>
                    <p style={{ color: WHITE, fontWeight: 700, fontSize: 14.5, margin: "0 0 1px", fontFamily: "Poppins, sans-serif" }}>{property.agent.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0 }}>Verified Agent</p>
                  </div>
                </div>
                <div style={{ padding: "22px 20px" }}>
                  <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 16, lineHeight: 1.6 }}>
                    Interested in this property? Book an inspection and our agent will reach out to confirm.
                  </p>
                  <button onClick={() => setShowModal(true)}
                    style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${BLUE} 0%, #1444b8 100%)`, color: WHITE, border: "none", borderRadius: 12, fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15.5, cursor: "pointer", letterSpacing: "0.3px", boxShadow: "0 8px 24px rgba(26,86,219,0.38)", transition: "all .22s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,86,219,0.48)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,86,219,0.38)"; }}
                  >
                    📅 Book Inspection
                  </button>
                  <div style={{ marginTop: 16, padding: "12px 16px", background: "#f8fafc", borderRadius: 10, textAlign: "center", border: "1px solid #f3f4f6" }}>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Inspection Fee</p>
                    {property.agentFee || property.agent?.fee ? (
                      <>
                        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "1.3rem", color: BLUE, margin: 0 }}>{formatPrice(property.agentFee || property.agent?.fee)}</p>
                        <p style={{ fontSize: 11.5, color: "#9ca3af", margin: "2px 0 0" }}>agent fee</p>
                      </>
                    ) : (
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", margin: 0, fontStyle: "italic" }}>Contact agent</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {showModal && <InspectionModal property={property} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default PropertyDetail;