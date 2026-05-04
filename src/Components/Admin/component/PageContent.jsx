import { useState, useEffect } from "react";
import AdminDashboard from "../Properties/Admindashboard";
import AdminPropertiesView from "../Properties/AdminpropertiesVies";
import AllAgentsPage  from "./Users/Allagentpage";
import AllUsersPage   from "./Users/Alluserspage";
import TransactionPage from "../Transactions/Transactionpage";
import WithdrawPage from "../Withdraaw/WithdrawPage";
import AdminSettings from "../Settings/Adminsettings";
import axios from "axios";
import { Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

const BLUE     = "#1a56db";
const NAVY     = "#0b1a2e";
const LIGHTBG  = "#f0f5ff";
const GREY     = "#6b7280";
const BORDER   = "#e5e7eb";
const WHITE    = "#ffffff";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

const onFocus = (e) => {
  e.target.style.borderColor = BLUE;
  e.target.style.boxShadow   = "0 0 0 3px rgba(26,86,219,0.13)";
};
const onBlur = (e) => {
  e.target.style.borderColor = BORDER;
  e.target.style.boxShadow   = "none";
};

const inputBase = {
  width: "100%", padding: "11px 14px", border: `1.5px solid ${BORDER}`,
  borderRadius: 9, fontSize: 14, color: NAVY, outline: "none",
  transition: "border-color .2s, box-shadow .2s",
  background: WHITE, boxSizing: "border-box", fontFamily: "'Inter',sans-serif",
};

/* ── Create Admin Page ───────────────────────────────────────────────────── */
function CreateAdminPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "", confirmPassword: "",
  });
  const [showPw, setShowPw]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  const [admins, setAdmins]           = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError]     = useState("");

  const fetchAdmins = async () => {
    setListLoading(true); setListError("");
    try {
      const res = await axios.get(`${API_BASE}/api/v1/admin/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = res.data?.data ?? res.data;
      setAdmins(Array.isArray(data) ? data : []);
    } catch {
      setListError("Could not load admin list.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const passMatch = form.confirmPassword === "" || form.password === form.confirmPassword;

  const change = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error)   setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setError(""); setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/v1/admin/register`, {
        fullName:        `${form.firstName} ${form.lastName}`.trim(),
        firstName:       form.firstName,
        lastName:        form.lastName,
        email:           form.email,
        password:        form.password,
        confirmPassword: form.confirmPassword,
        phone:           form.phone,
        role:            "admin",
        userType:        "admin",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess(`Admin account for ${form.firstName} ${form.lastName} created successfully!`);
      setForm({ firstName:"", lastName:"", email:"", phone:"", password:"", confirmPassword:"" });
      fetchAdmins();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        `Registration failed (${err.response?.status ?? "network error"}). Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ca-wrapper">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .ca-spinner {
          width:17px; height:17px; border:2px solid rgba(255,255,255,0.3);
          border-top-color:white; border-radius:50%;
          display:inline-block; animation:spin .7s linear infinite;
        }
        .ca-wrapper {
          padding: 24px 16px;
          max-width: 620px;
        }
        @media (min-width: 640px) {
          .ca-wrapper { padding: 36px 40px; }
        }
        .ca-col2 { display:grid; grid-template-columns:1fr; gap:16px; }
        @media (min-width: 480px) { .ca-col2 { grid-template-columns:1fr 1fr; } }
        .ca-card {
          background: ${WHITE};
          border-radius: 18px;
          padding: 20px 16px 24px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          border: 1px solid #f3f4f6;
        }
        @media (min-width: 480px) {
          .ca-card { padding: 28px 32px 32px; }
        }
        /* Admin list table — scrollable on small screens */
        .ca-table-wrap {
          background: ${WHITE};
          border-radius: 16px;
          border: 1px solid ${BORDER};
          overflow-x: auto;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          -webkit-overflow-scrolling: touch;
        }
        .ca-table-head {
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr 1fr;
          padding: 11px 20px;
          background: #f9fafb;
          border-bottom: 1px solid ${BORDER};
          min-width: 480px;
        }
        .ca-table-row {
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr 1fr;
          padding: 13px 20px;
          align-items: center;
          min-width: 480px;
          transition: background .15s;
        }
        .ca-table-row:not(:last-child) { border-bottom: 1px solid #f3f4f6; }
        .ca-table-row:hover { background: #fafbff; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div style={{ width:38, height:38, borderRadius:9, background:NAVY, display:"grid", placeItems:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(11,26,46,0.2)" }}>
            <ShieldCheck size={18} color={WHITE} />
          </div>
          <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:NAVY, fontFamily:"'Poppins',sans-serif", letterSpacing:"-0.4px" }}>
            Create Admin Account
          </h1>
        </div>
        <p style={{ margin:0, fontSize:14, color:GREY }}>
          Register a new administrator. They will have full access to the Nestfind admin panel.
        </p>
      </div>

      {/* Card */}
      <div className="ca-card">
        <div style={{ display:"flex", alignItems:"center", gap:10, background:LIGHTBG, border:"1px solid rgba(26,86,219,0.18)", borderRadius:11, padding:"11px 15px", marginBottom:24 }}>
          <ShieldCheck size={15} color={BLUE} style={{ flexShrink:0 }} />
          <p style={{ margin:0, fontSize:13, color:BLUE, fontWeight:500 }}>
            This account will have full admin privileges on the platform.
          </p>
        </div>

        {success && (
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:9, padding:"10px 14px", color:"#15803d", fontSize:13.5, marginBottom:16 }}>
            <CheckCircle2 size={15} /> {success}
          </div>
        )}
        {error && (
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:9, padding:"10px 14px", color:"#dc2626", fontSize:13.5, marginBottom:16 }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="ca-col2" style={{ marginBottom:14 }}>
            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:NAVY, marginBottom:6 }}>First Name</label>
              <input name="firstName" value={form.firstName} onChange={change}
                style={inputBase} placeholder="John"
                onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="given-name" />
            </div>
            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:NAVY, marginBottom:6 }}>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={change}
                style={inputBase} placeholder="Doe"
                onFocus={onFocus} onBlur={onBlur}
                required disabled={loading} autoComplete="family-name" />
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:NAVY, marginBottom:6 }}>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={change}
              style={inputBase} placeholder="admin@nestfind.com"
              onFocus={onFocus} onBlur={onBlur}
              required disabled={loading} autoComplete="email" />
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:NAVY, marginBottom:6 }}>Phone Number</label>
            <input name="phone" type="tel" value={form.phone} onChange={change}
              style={inputBase} placeholder="+234 800 000 0000"
              onFocus={onFocus} onBlur={onBlur}
              disabled={loading} autoComplete="tel" />
          </div>

          <div className="ca-col2" style={{ marginBottom:22 }}>
            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:NAVY, marginBottom:6 }}>Password</label>
              <div style={{ position:"relative" }}>
                <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={change}
                  style={{ ...inputBase, paddingRight:40 }} placeholder="Min. 6 characters"
                  onFocus={onFocus} onBlur={onBlur}
                  required disabled={loading} minLength={6} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:GREY, display:"flex", alignItems:"center", padding:0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:NAVY, marginBottom:6 }}>Confirm Password</label>
              <div style={{ position:"relative" }}>
                <input name="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={change}
                  style={{ ...inputBase, paddingRight:40, borderColor: form.confirmPassword && !passMatch ? "#dc2626" : BORDER }}
                  placeholder="Repeat password"
                  onFocus={e => {
                    e.target.style.borderColor = form.confirmPassword && !passMatch ? "#dc2626" : BLUE;
                    e.target.style.boxShadow   = "0 0 0 3px rgba(26,86,219,0.13)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = form.confirmPassword && !passMatch ? "#dc2626" : BORDER;
                    e.target.style.boxShadow   = "none";
                  }}
                  required disabled={loading} minLength={6} autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:GREY, display:"flex", alignItems:"center", padding:0 }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword && (
                <p style={{ fontSize:12, marginTop:4, color: passMatch ? "#16a34a" : "#dc2626" }}>
                  {passMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>
          </div>

          <button type="submit"
            disabled={loading || (form.confirmPassword.length > 0 && !passMatch)}
            style={{
              width:"100%", padding:"13px 0", background: BLUE, color:"white",
              border:"none", borderRadius:11, fontSize:15, fontWeight:700, cursor:"pointer",
              transition:"background .2s, transform .15s, box-shadow .2s",
              boxShadow:"0 6px 22px rgba(26,86,219,0.35)", fontFamily:"'Inter',sans-serif",
              opacity: (loading || (form.confirmPassword.length > 0 && !passMatch)) ? 0.7 : 1,
            }}
          >
            {loading
              ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}><span className="ca-spinner" />Creating account…</span>
              : "Create Admin Account"}
          </button>
        </form>
      </div>

      {/* Existing Admins */}
      <div style={{ marginTop:36, maxWidth:860 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, gap:12, flexWrap:"wrap" }}>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:NAVY, fontFamily:"'Poppins',sans-serif" }}>
              Existing Admins
            </h2>
            <p style={{ margin:"3px 0 0", fontSize:13, color:GREY }}>
              All administrators currently registered on the platform.
            </p>
          </div>
          <button onClick={fetchAdmins}
            style={{ padding:"8px 16px", borderRadius:9, border:`1.5px solid ${BORDER}`, background:WHITE, fontSize:13, fontWeight:600, color:NAVY, cursor:"pointer", flexShrink:0 }}>
            ↻ Refresh
          </button>
        </div>

        <div className="ca-table-wrap">
          <div className="ca-table-head">
            {["Name","Email","Phone","Role"].map(h => (
              <span key={h} style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</span>
            ))}
          </div>

          {listLoading ? (
            <div style={{ padding:"36px 0", textAlign:"center", color:"#9ca3af", fontSize:13, minWidth:480 }}>Loading admins…</div>
          ) : listError ? (
            <div style={{ padding:"28px 20px", color:"#dc2626", fontSize:13, minWidth:480 }}>⚠️ {listError}</div>
          ) : admins.length === 0 ? (
            <div style={{ padding:"36px 0", textAlign:"center", color:"#9ca3af", fontSize:13, minWidth:480 }}>No admins found.</div>
          ) : (
            admins.map((a, i) => {
              const name     = (a.fullName ?? `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim()) || "—";
              const initials = name.split(" ").slice(0,2).map(w => w[0]?.toUpperCase() ?? "").join("");
              return (
                <div key={a._id ?? a.id ?? i} className="ca-table-row">
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#1a56db,#0b1a2e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:WHITE, flexShrink:0 }}>
                      {initials || "A"}
                    </div>
                    <span style={{ fontSize:13.5, fontWeight:600, color:NAVY }}>{name}</span>
                  </div>
                  <span style={{ fontSize:13, color:"#374151", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {a.email ?? "—"}
                  </span>
                  <span style={{ fontSize:13, color:"#374151" }}>
                    {a.phone ?? a.phoneNumber ?? "—"}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:999, background:"#eff6ff", color:BLUE, border:"1px solid #bfdbfe", display:"inline-block", textTransform:"capitalize" }}>
                    {a.role ?? a.userType ?? "Admin"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ── PageContent ─────────────────────────────────────────────────────────── */
export default function PageContent({ activeId, page }) {
  const NAVY  = "#0b1a2e";
  const WHITE = "#ffffff";

  return (
    <>
      <style>{`
        .nf-main {
          margin-left: 240px;
          flex: 1;
          min-height: 100vh;
          overflow-y: auto;
          background: #f9fafb;
          /* Push content below mobile topbar */
        }
        @media (max-width: 767px) {
          .nf-main {
            margin-left: 0;
            padding-top: 56px; /* height of mobile topbar */
          }
        }
        .nf-placeholder-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 40px;
        }
        @media (max-width: 500px) {
          .nf-placeholder-grid { grid-template-columns: 1fr; }
        }
        .nf-fallback-wrap {
          padding: 24px 16px;
        }
        @media (min-width: 640px) {
          .nf-fallback-wrap { padding: 40px; }
        }
      `}</style>

      <main className="nf-main">
        {activeId === "dashboard"    && <AdminDashboard />}
        {activeId === "all-agents"   && <AllAgentsPage  />}
        {activeId === "all-users"    && <AllUsersPage   />}
        {activeId === "properties"   && <AdminPropertiesView />}
        {activeId === "create-admin" && <CreateAdminPage />}
        {activeId === "transaction"  && <TransactionPage />}
        {activeId === "withdrawals"  && <WithdrawPage />}
        {activeId === "settings"     && <AdminSettings />}

        {activeId !== "dashboard"    &&
         activeId !== "all-agents"   &&
         activeId !== "all-users"    &&
         activeId !== "properties"   &&
         activeId !== "create-admin" &&
         activeId !== "transaction"  &&
         activeId !== "withdrawals"  &&
         activeId !== "settings"     && (
          <div className="nf-fallback-wrap">
            <div style={{ maxWidth:720 }}>
              <p style={{ fontSize:36, marginBottom:12 }}>{page.emoji}</p>
              <h1 style={{ fontSize:28, fontWeight:700, color:NAVY, letterSpacing:"-0.5px", marginBottom:8, marginTop:0 }}>
                {page.title}
              </h1>
              <p style={{ color:"#6b7280", fontSize:15, marginTop:0 }}>{page.subtitle}</p>
              <div className="nf-placeholder-grid">
                {[...Array(4)].map((_,i) => (
                  <div key={i} style={{ background:WHITE, border:"1px solid #e5e7eb", borderRadius:16, padding:20, height:110 }}/>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}