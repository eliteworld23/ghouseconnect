import { useState, useEffect } from "react";

const BLUE  = "#1a56db";
const NAVY  = "#0b1a2e";
const WHITE = "#ffffff";

const API_BASE = "https://gtimeconnect.onrender.com/api/v1/admin";
const getToken = () => localStorage.getItem("token") || "";
const AUTH_HEADERS = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const fmtNum = (val) =>
  val == null ? "—" : new Intl.NumberFormat("en-NG").format(val);

const fmtMoney = (val) => {
  if (val == null) return "—";
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000)     return `₦${(val / 1_000).toFixed(1)}K`;
  return `₦${val}`;
};

// ── Sparkline ──────────────────────────────────────────────────────────────────
function Sparkline({ data = [], color = BLUE }) {
  const svgW = 300, svgH = 52;
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * svgW},${svgH - ((v - min) / range) * (svgH - 6) - 3}`)
    .join(" ");
  const lastX = svgW;
  const lastY = svgH - ((data[data.length - 1] - min) / range) * (svgH - 6) - 3;
  const areapts = `0,${svgH} ${pts} ${svgW},${svgH}`;
  const gradId = `sg-${color.replace("#", "")}`;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areapts} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="4" fill={color} opacity="0.9" />
    </svg>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, spark, color, icon, loading, trend }) {
  return (
    <div
      className="stat-card"
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 14px 40px rgba(11,26,46,0.12), 0 2px 8px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(11,26,46,0.08)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: "20px 20px 0 0" }} />
      <div style={{ position: "absolute", top: -24, right: -24, width: 100, height: 100, borderRadius: "50%", background: color + "0a", pointerEvents: "none" }} />
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: color + "15", border: `1.5px solid ${color}25` }}>
          {icon}
        </div>
        <span className="stat-label">{label}</span>
      </div>
      <p className="stat-value" style={{ color: loading ? "#e5e7eb" : NAVY, background: loading ? "#f3f4f6" : "none", borderRadius: loading ? 8 : 0 }}>
        {loading ? "" : value}
      </p>
      <p className="stat-sub">
        {!loading && trend != null && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: trend >= 0 ? "#dcfce7" : "#fee2e2", color: trend >= 0 ? "#16a34a" : "#dc2626" }}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
        {loading ? "" : sub}
      </p>
      <div className="stat-sparkline">
        <Sparkline data={spark} color={color} />
      </div>
    </div>
  );
}

// ── Main Admin Dashboard ───────────────────────────────────────────────────────
export default function AdminDashboard({ initialTab }) {
  const [time, setTime]                 = useState(new Date());
  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError]     = useState(null);
  const [activeTab, setActiveTab]       = useState(initialTab || "overview");

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      setStatsLoading(true); setStatsError(null);
      try {
        const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: AUTH_HEADERS() });
        if (!res.ok) throw new Error(`Failed to load stats (${res.status})`);
        const json = await res.json();
        setStats(json.data ?? json);
      } catch (e) { setStatsError(e.message); }
      finally { setStatsLoading(false); }
    })();
  }, []);

  const greeting =
    time.getHours() < 12 ? "Good morning"
    : time.getHours() < 17 ? "Good afternoon"
    : "Good evening";

  const newUsersMonth   = stats?.users?.newThisMonth   ?? stats?.users?.newToday   ?? null;
  const newAgentsMonth  = stats?.agents?.newThisMonth  ?? stats?.agents?.newToday  ?? null;
  const txThisMonth     = stats?.transactions?.total   ?? stats?.transactions?.count ?? null;
  const newPropsMonth   = stats?.properties?.newThisMonth ?? stats?.properties?.newToday ?? null;

  const cards = [
    { label: "All Users",         value: fmtNum(stats?.users?.total),                                          icon: "👥", color: "#1a56db", trend: 12,   sub: newUsersMonth  != null ? `+${fmtNum(newUsersMonth)} this month`  : "Registered users", spark: [30,45,38,60,55,72,80,75,90,88] },
    { label: "All Agents",        value: fmtNum(stats?.agents?.total),                                         icon: "🛡️", color: "#059669", trend: 8,    sub: newAgentsMonth != null ? `+${fmtNum(newAgentsMonth)} this month` : "Active agents",    spark: [12,18,14,22,19,25,21,28,24,30] },
    { label: "Transactions",      value: fmtMoney(stats?.transactions?.totalAmount ?? stats?.revenue?.total),   icon: "💳", color: "#7c3aed", trend: null, sub: txThisMonth    != null ? `${fmtNum(txThisMonth)} this month`    : "Total volume",     spark: [40,55,48,70,65,82,78,95,88,105] },
    { label: "Properties Listed", value: fmtNum(stats?.properties?.total),                                      icon: "🏠", color: "#d97706", trend: 5,    sub: newPropsMonth  != null ? `+${fmtNum(newPropsMonth)} this month`  : "Total listings",  spark: [80,95,110,100,130,120,145,155,140,165] },
  ];

  const TABS = [{ id: "overview", label: "Overview", icon: "📊" }];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        .stat-card-anim { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }

        /* Shell */
        .admin-shell {
          display: flex; flex-direction: column;
          height: 100%; width: 100%;
          box-sizing: border-box; background: #f5f7fb;
        }

        /* Tab bar */
        .admin-tabs {
          display: flex; align-items: center; gap: 4px;
          padding: 10px 20px 0; background: #fff;
          border-bottom: 2px solid #f0f2f7; flex-shrink: 0;
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .admin-tabs::-webkit-scrollbar { display: none; }

        .admin-tab-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 18px; border: none; background: transparent;
          border-bottom: 3px solid transparent; margin-bottom: -2px;
          font-size: 13px; font-weight: 600; color: #9ca3af; cursor: pointer;
          transition: all .18s; font-family: inherit; white-space: nowrap;
          border-radius: 8px 8px 0 0; flex-shrink: 0;
        }
        .admin-tab-btn:hover  { color: #374151; background: #f8fafc; }
        .admin-tab-btn.active { color: #1a56db; border-bottom-color: #1a56db; background: #eff6ff; font-weight: 700; }

        /* Content */
        .admin-content { flex: 1; overflow-y: auto; min-height: 0; -webkit-overflow-scrolling: touch; }

        /* Overview */
        .overview-wrap {
          display: flex; flex-direction: column;
          padding: clamp(16px,3vh,36px) clamp(16px,3vw,40px);
          max-width: 1100px; margin: 0 auto; box-sizing: border-box;
          height: 100%;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: clamp(10px,1.6vh,20px);
          flex: 1; min-height: 0;
        }
        .stats-grid > div { min-height: 0; }

        /* Stat card */
        .stat-card {
          background: ${WHITE}; border-radius: 20px;
          padding: clamp(14px,2.2vh,26px) clamp(16px,2vw,28px);
          display: flex; flex-direction: column;
          box-shadow: 0 4px 24px rgba(11,26,46,0.08);
          border: 1px solid #f0f2f7; position: relative;
          overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
          height: 100%; box-sizing: border-box;
        }
        .stat-card-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: clamp(10px,1.5vh,18px); flex-shrink: 0;
        }
        .stat-icon {
          width: clamp(36px,3.5vw,50px); height: clamp(36px,3.5vw,50px);
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; font-size: clamp(17px,1.8vw,24px);
          flex-shrink: 0;
        }
        .stat-label {
          font-size: clamp(9px,0.7vw,11px); font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; color: #adb5c2;
        }
        .stat-value {
          margin: 0 0 4px; font-size: clamp(22px,3vw,40px); font-weight: 800;
          font-family: Poppins,sans-serif; line-height: 1; letter-spacing: -1px;
          flex-shrink: 0; min-height: 1em;
        }
        .stat-sub {
          margin: 0 0 clamp(6px,1vh,14px); font-size: clamp(11px,1vw,13px);
          color: #9ca3af; font-weight: 500; flex-shrink: 0;
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
        }
        .stat-sparkline { flex: 1; min-height: 0; margin: 0 -2px -2px; }

        /* ── Responsive breakpoints ── */

        /* Tablet landscape / small desktop */
        @media (max-width: 900px) {
          .overview-wrap { padding: 20px; }
          .stats-grid { gap: 12px; }
        }

        /* Tablet portrait */
        @media (max-width: 768px) {
          .admin-shell { height: auto; overflow: visible; }
          .admin-content { overflow-y: visible; flex: none; }
          .overview-wrap { height: auto; min-height: auto; }
          .stats-grid {
            grid-template-rows: auto;
            height: auto;
          }
          .stats-grid > div { min-height: 170px; }
          .stat-card { height: auto; min-height: 170px; }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .admin-tabs { padding: 8px 12px 0; gap: 2px; }
          .admin-tab-btn { padding: 8px 12px; font-size: 12px; }
          .overview-wrap { padding: 14px 12px; }
          .stats-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            gap: 10px;
          }
          .stats-grid > div { min-height: 150px; }
          .stat-card { min-height: 150px; }
          .stat-icon { width: 38px !important; height: 38px !important; font-size: 18px !important; }
        }

        /* Very small phones */
        @media (max-width: 360px) {
          .overview-wrap { padding: 10px; }
          .stats-grid { gap: 8px; }
        }
      `}</style>

      <div className="admin-shell">
        <div className="admin-tabs">
          {TABS.map(tab => (
            <button key={tab.id} className={`admin-tab-btn${activeTab === tab.id ? " active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {activeTab === "overview" && (
            <div className="overview-wrap">
              {/* Header */}
              <div style={{ flexShrink: 0, marginBottom: "clamp(10px,2vh,24px)" }}>
                <p style={{ margin: "0 0 2px", fontSize: "clamp(11px,1vw,13px)", color: "#adb5c2", fontWeight: 500, letterSpacing: "0.05em" }}>
                  {time.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                <h1 style={{ margin: 0, fontSize: "clamp(18px,2.4vw,28px)", fontWeight: 800, color: NAVY, fontFamily: "Poppins,sans-serif", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                  {greeting}, Admin 👋
                </h1>
                <p style={{ margin: "3px 0 0", fontSize: "clamp(12px,1vw,14px)", color: "#6b7280" }}>
                  Here's what's happening on Nestfind today.
                </p>
              </div>

              {statsError && (
                <div style={{ flexShrink: 0, marginBottom: 12, padding: "9px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  ⚠️ Could not load live stats: {statsError}
                </div>
              )}

              <div className="stats-grid">
                {cards.map((c, i) => (
                  <div key={c.label} className="stat-card-anim" style={{ animationDelay: `${i * 80}ms` }}>
                    <StatCard {...c} loading={statsLoading} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}