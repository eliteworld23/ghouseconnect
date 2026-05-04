import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSessionTimeout from "./Usesessiontimeout";
import {
  Eye, EyeOff, Lock, Mail, User, Phone, MapPin, Search,
  Star, Check, Plus, X, Menu, Home, Building, Building2,
  Shield, CreditCard, Users, TrendingUp, Heart, AlertCircle,
  BarChart2, MessageSquare, ClipboardList, PlusSquare, Calendar
} from "lucide-react";

/* ─── Auth helpers ───────────────────────────────────────────────────────── */
const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
};
const getIsLoggedIn = () => {
  try {
    const token = localStorage.getItem("token");
    const user  = getStoredUser();
    return !!(token && token !== "undefined" && token !== "null" && user && Object.keys(user).length);
  } catch { return false; }
};
const getDashboardPath = () => {
  const user = getStoredUser();
  if (user.userType === "admin") return "/admin";
  if (user.userType === "agent") return "/agent-dashboard";
  return "/dashboard";
};

/* ─── Nigerian States ────────────────────────────────────────────────────── */
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const API_BASE = "https://gtimeconnect.onrender.com";

/* ─── Demo Properties ───────────────────────────────────────────────────── */
const DEMO_PROPERTIES = [
  { id:1, title:"Luxury Villa, Lekki Phase 1",      price:"₦45,000,000",   type:"For Sale", beds:5, baths:4, sqft:"450 sqm", location:"Lekki, Lagos",          img:"https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80", badge:"Best Deal" },
  { id:2, title:"Modern Apartment, Victoria Island", price:"₦18,500,000",   type:"For Sale", beds:3, baths:2, sqft:"180 sqm", location:"Victoria Island, Lagos", img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", badge:"New Listing" },
  { id:3, title:"Executive Duplex, Maitama",         price:"₦55,000,000",   type:"For Sale", beds:6, baths:5, sqft:"600 sqm", location:"Maitama, Abuja",         img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", badge:null },
  { id:4, title:"Serviced Flat, Ikoyi",              price:"₦850,000/mo",   type:"For Rent", beds:2, baths:2, sqft:"120 sqm", location:"Ikoyi, Lagos",           img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80", badge:"Hot" },
  { id:5, title:"Smart Terrace, Asokoro",            price:"₦32,000,000",   type:"For Sale", beds:4, baths:3, sqft:"300 sqm", location:"Asokoro, Abuja",         img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", badge:null },
  { id:6, title:"Penthouse Suite, Oniru",            price:"₦1,200,000/mo", type:"For Rent", beds:4, baths:3, sqft:"280 sqm", location:"Oniru, Lagos",           img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", badge:"Premium" },
];

const TESTIMONIALS = [
  { name:"Fola",  avatar:"https://i.pravatar.cc/60?img=11", text:"Booking an inspection used to be stressful and time-consuming. With this platform, I scheduled my inspection in less than 5 minutes and everything was organized professionally. I highly recommend it to anyone looking for a smooth house-hunting experience" },
  { name:"Annie", avatar:"https://i.pravatar.cc/60?img=5",  text:"“As someone relocating to Abuja, I needed a reliable way to inspect properties before making payments. The inspection booking system gave me peace of mind and helped me secure the perfect apartment without any hassle.”" },
];

const FAQS = [
  { q:"What is GHOUSECONNECT?",                a:"GHOUSECONNECT is a trusted real estate platform connecting buyers, sellers, and agents across Nigeria." },
  { q:"How does GHOUSECONNECT work?",          a:"Sign up, browse verified listings, book inspections, compare properties, and track every step from your dashboard." },
  { q:"Is it safe to pay through GHOUSECONNECT?", a:"Yes, all payments go through our secure escrow system — funds are only released after inspection confirmation." },
  { q:"How do I Book Inspection?",        a:"After finding your desired property, click 'Book Inspection', pick a time slot, and our agent will confirm within 24 hours." },
];

/* ─── Empty form ─────────────────────────────────────────────────────────── */
const EMPTY = { firstName:"", lastName:"", email:"", phone:"", address:"", state:"", alias:"", password:"", confirmPassword:"" };

/* ─── Tiny helpers ───────────────────────────────────────────────────────── */
const inp = (extra="") =>
  `w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white
   focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all ${extra}`;

const Lbl = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1">{children}</label>
);

const EyeBtn = ({ show, toggle }) => (
  <button type="button" onClick={toggle} tabIndex={-1}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
    {show ? <EyeOff size={15}/> : <Eye size={15}/>}
  </button>
);

const ErrBox = ({ msg }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-4 flex items-center gap-2">
    <AlertCircle size={15} className="shrink-0"/>{msg}
  </div>
);

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
);

/* ═══════════════════════════════════════════════════════════════════════════
   AUTH MODAL  (mirrors Auth.jsx logic exactly)
═══════════════════════════════════════════════════════════════════════════ */
function AuthModal({ onClose, defaultTab = "signin" }) {
  const [tab, setTab]         = useState(defaultTab);   // "signin" | "register"
  const [userType, setUT]     = useState("user");     // "user" | "agent"
  const [form, setForm]       = useState(EMPTY);
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [loginOk, setLoginOk] = useState(false);

  // OTP
  const [otpScreen, setOtpScreen] = useState(false);
  const [otp, setOtp]             = useState("");
  const [regEmail, setRegEmail]   = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const passMatch = !form.confirmPassword || form.password === form.confirmPassword;

  const reset = (keepEmail=false) => {
    setForm(EMPTY); setError(""); setShowPw(false); setShowCpw(false); setLoginOk(false);
    if (!keepEmail) { setOtpScreen(false); setOtp(""); setRegEmail(""); }
  };

  const handle = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === "register" && form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setError(""); setLoading(true); setLoginOk(false);

    const isReg = tab === "register";
    const endpoint = isReg
      ? (userType === "user" ? "/api/v1/users/register" : "/api/v1/agents/register")
      : (userType === "user" ? "/api/v1/auth/user/login" : "/api/v1/auth/agent/login");

    const payload = isReg
      ? { fullName:        `${form.firstName} ${form.lastName}`.trim(),
          email:           form.email,
          password:        form.password,
          confirmPassword: form.confirmPassword,
          phone:           form.phone,
          address:         form.address,
          state:           form.state,
          alias:           form.alias,
          role:            userType === "agent" ? "agent" : "user" }
      : { email:form.email, password:form.password };

    try {
      const res  = await fetch(`${API_BASE}${endpoint}`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Backend error response:", JSON.stringify(data)); // ← add this
      if (!res.ok) throw new Error(data.message || "Operation failed. Please try again.");

      if (!isReg) {
        const responseData = data.data ?? data;
        const token = responseData.token ?? data.token;
        const apiUser = responseData.user ?? responseData;
        const ud = {
          ...apiUser, userType,
          name:  apiUser?.firstName ? `${apiUser.firstName} ${apiUser.lastName}`.trim() : apiUser?.name ?? "",
          email: apiUser?.email ?? form.email,
        };
        localStorage.setItem("token", token);
        localStorage.setItem("user",  JSON.stringify({ ...ud, userType }));
        localStorage.setItem("GHOUSECONNECT_user", JSON.stringify({ name:ud.name, email:ud.email }));
        setLoginOk(true);
        setTimeout(() => { window.location.href = userType === "user" ? "/dashboard" : "/agent-dashboard"; }, 1200);
      } else {
        setRegEmail(form.email);
        reset(true);
        setOtpScreen(true);
      }
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  /* Verify OTP */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setVerifying(true);
    try {
      const res  = await fetch(`${API_BASE}/api/v1/auth/verify`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ otp, email: regEmail, role: userType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code. Please try again.");
      const verifyData = data.data ?? data;
      const verifyToken = verifyData.token ?? data.token;
      if (verifyToken) {
        const apiUser = verifyData.user ?? verifyData;
        const ud = {
          ...apiUser, userType,
          name:  apiUser?.firstName ? `${apiUser.firstName} ${apiUser.lastName}`.trim() : apiUser?.name ?? "",
          email: apiUser?.email ?? regEmail,
        };
        localStorage.setItem("token", verifyToken);
        localStorage.setItem("user",  JSON.stringify({ ...ud, userType }));
        localStorage.setItem("GHOUSECONNECT_user", JSON.stringify({ name:ud.name, email:ud.email }));
      }
      window.location.href = userType === "user" ? "/dashboard" : "/agent-dashboard";
    } catch (err) {
      setError(err.message);
    } finally { setVerifying(false); }
  };

  /* Resend */
  const handleResend = async () => {
    setResending(true); setError("");
    try {
      await fetch(`${API_BASE}/auth/resend-verification`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email: regEmail }),
      });
    } catch (err) { setError(err.message || "Failed to resend."); }
    finally { setResending(false); }
  };

  /* ── OTP Screen ── */
  if (otpScreen) return (
    <ModalShell onClose={onClose}>
      <div className="text-center py-2">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-blue-600"/>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
        <p className="text-gray-500 text-sm mb-6">
          We sent a 6-digit code to<br/>
          <strong className="text-gray-900">{regEmail}</strong>
        </p>
        {error && <ErrBox msg={error}/>}
        <form onSubmit={handleVerify}>
          <input
            type="text" inputMode="numeric" maxLength={6} placeholder="••••••"
            value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
            className="w-full border-2 border-gray-200 rounded-xl py-4 text-center text-3xl font-bold tracking-[14px] text-gray-900 focus:outline-none focus:border-blue-500 transition-all mb-4"
            required
          />
          <button type="submit" disabled={verifying || otp.length < 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
            {verifying ? <span className="flex items-center justify-center gap-2"><Spinner/>Verifying…</span> : "Verify Email"}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Didn't get the code?{" "}
          <button onClick={handleResend} disabled={resending} className="text-blue-600 font-semibold hover:underline">
            {resending ? "Sending…" : "Resend"}
          </button>
        </p>
        <button onClick={() => { setOtpScreen(false); reset(); }}
          className="text-gray-400 text-sm mt-3 hover:text-gray-600 block mx-auto">
          ← Back to registration
        </button>
      </div>
    </ModalShell>
  );

  const submitDisabled = loading || (tab === "register" && form.confirmPassword.length > 0 && !passMatch);

  /* ── Main form ── */
  return (
    <ModalShell onClose={onClose}>
      {/* Role toggle */}
      <div className="flex bg-blue-50 rounded-xl p-1 gap-1 mb-5">
        {[
          { key:"user",  Icon:User,      label: tab==="register" ? "Register as User"  : "Sign in as User"  },
          { key:"agent", Icon:Building2, label: tab==="register" ? "Register as Agent" : "Sign in as Agent" },
        ].map(({ key, Icon, label }) => (
          <button key={key} onClick={() => { setUT(key); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${userType===key ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-gray-500 hover:text-gray-700"}`}>
            <Icon size={14}/>{label}
          </button>
        ))}
      </div>

      {/* Sign In / Create Account tabs */}
      <div className="flex border-b-2 border-gray-200 mb-5">
        {[["signin","Sign In"],["register","Create Account"]].map(([key,lbl]) => (
          <button key={key} onClick={() => { setTab(key); reset(); }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-all
              ${tab===key ? "text-blue-600 border-b-2 border-blue-600 -mb-[2px]" : "text-gray-500"}`}>
            {lbl}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
        {tab==="register" ? `Create ${userType==="user" ? "User" : "Agent"} Account` : "Welcome Back"}
      </h2>
      <p className="text-gray-500 text-sm text-center mb-5">
        {tab==="register"
          ? `Join GHOUSECONNECT as a${userType==="agent" ? "n agent" : " user"} to get started`
          : `Sign in to your ${userType} account`}
      </p>

      {loginOk && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm flex items-center justify-center gap-2 mb-4">
          <Check size={15}/> Signed in successfully! Redirecting…
        </div>
      )}
      {error && <ErrBox msg={error}/>}

      <form onSubmit={handleSubmit}>
        {tab === "register" && (
          <>
            {/* Row 1: First + Last */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <Lbl>First Name</Lbl>
                <input name="firstName" type="text" placeholder="John" value={form.firstName} onChange={handle}
                  required disabled={loading} autoComplete="given-name" className={inp()}/>
              </div>
              <div>
                <Lbl>Last Name</Lbl>
                <input name="lastName" type="text" placeholder="Doe" value={form.lastName} onChange={handle}
                  required disabled={loading} autoComplete="family-name" className={inp()}/>
              </div>
            </div>

            {/* Row 2: Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <Lbl>Email Address</Lbl>
                <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle}
                  required disabled={loading} autoComplete="email" className={inp()}/>
              </div>
              <div>
                <Lbl>Phone Number</Lbl>
                <input name="phone" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={handle}
                  required disabled={loading} autoComplete="tel" className={inp()}/>
              </div>
            </div>

            {/* Row 3: Address + State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <Lbl>Street Address</Lbl>
                <input name="address" type="text" placeholder="123 Broad Street" value={form.address} onChange={handle}
                  required disabled={loading} autoComplete="street-address" className={inp()}/>
              </div>
              <div>
                <Lbl>State</Lbl>
                <select name="state" value={form.state} onChange={handle}
                  required disabled={loading}
                  className={inp(`appearance-none ${!form.state ? "text-gray-400" : "text-gray-900"}`)}>
                  <option value="" disabled>Select your state</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Role — Agent only */}
            {userType === "agent" && (
              <div className="mb-3">
                <Lbl>Role</Lbl>
                <select name="alias" value={form.alias} onChange={handle}
                  required={userType === "agent"} disabled={loading}
                  className={inp(`appearance-none ${!form.alias ? "text-gray-400" : "text-gray-900"}`)}>
                  <option value="" disabled>Select your role</option>
                  <option value="agent">Agent</option>
                  <option value="landlord">Landlord</option>
                </select>
              </div>
            )}

            {/* Row 4: Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div>
                <Lbl>Password</Lbl>
                <div className="relative">
                  <input name="password" type={showPw ? "text" : "password"} placeholder="Min. 6 characters"
                    value={form.password} onChange={handle} required disabled={loading} minLength={6}
                    autoComplete="new-password" className={inp("pr-10")}/>
                  <EyeBtn show={showPw} toggle={() => setShowPw(p=>!p)}/>
                </div>
              </div>
              <div>
                <Lbl>Confirm Password</Lbl>
                <div className="relative">
                  <input name="confirmPassword" type={showCpw ? "text" : "password"} placeholder="Re-enter password"
                    value={form.confirmPassword} onChange={handle} required disabled={loading} minLength={6}
                    autoComplete="new-password"
                    className={inp(`pr-10 ${form.confirmPassword && !passMatch ? "border-red-400 focus:border-red-400 focus:ring-red-500/15" : ""}`)}/>
                  <EyeBtn show={showCpw} toggle={() => setShowCpw(p=>!p)}/>
                </div>
                {form.confirmPassword && (
                  <p className={`text-xs mt-1 ${passMatch ? "text-green-600" : "text-red-500"}`}>
                    {passMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Sign-in fields only */}
        {tab === "signin" && (
          <>
            <div className="mb-3">
              <Lbl>Email Address</Lbl>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle}
                required disabled={loading} autoComplete="email" className={inp()}/>
            </div>
            <div className="mb-1">
              <Lbl>Password</Lbl>
              <div className="relative">
                <input name="password" type={showPw ? "text" : "password"} placeholder="Enter your password"
                  value={form.password} onChange={handle} required disabled={loading}
                  autoComplete="current-password" className={inp("pr-10")}/>
                <EyeBtn show={showPw} toggle={() => setShowPw(p=>!p)}/>
              </div>
            </div>
            <div className="text-right mb-5">
              <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Forgot password?</a>
            </div>
          </>
        )}

        <button type="submit" disabled={submitDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all
            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25">
          {loading
            ? <span className="flex items-center justify-center gap-2"><Spinner/>Please wait…</span>
            : tab==="register"
              ? `Create ${userType==="user" ? "User" : "Agent"} Account`
              : `Sign In as ${userType==="user" ? "User" : "Agent"}`
          }
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        {tab==="register" ? "Already have an account? " : "Don't have an account? "}
        <button onClick={() => { setTab(tab==="register" ? "signin" : "register"); reset(); }}
          className="text-blue-600 font-semibold hover:underline">
          {tab==="register" ? "Sign In" : "Create Account"}
        </button>
      </p>
    </ModalShell>
  );
}

/* ─── Modal shell ────────────────────────────────────────────────────────── */
function ModalShell({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"/>
        <div className="px-4 sm:px-8 py-6 sm:py-7">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Home size={18} className="text-white"/>
            </div>
            <span className="font-extrabold text-xl text-gray-900">GHOUSE<span className="text-blue-600">CONNECT</span></span>
          </div>
          <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest mb-6 font-medium">
            Nigeria's Trusted Real Estate Platform
          </p>
          {children}
        </div>
        <div className="h-1 rounded-b-3xl bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"/>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors">
          <X size={16}/>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS — tabbed Clients / Agent
═══════════════════════════════════════════════════════════════════════════ */
const CLIENT_STEPS = [
  { icon:"🏠", title:"Sign up & explore",   desc:"Create your free account in seconds and browse hundreds of verified property listings across Nigeria." },
  { icon:"🔍", title:"Book Inspection",      desc:"Choose a property you love and schedule an inspection at a time that suits you — fully online." },
  { icon:"⚖️", title:"Compare Properties",   desc:"Side-by-side comparison by price, location, size and amenities to help you make the smartest decision." },
  { icon:"📊", title:"Track Every Step",     desc:"Follow your transaction from inspection to handover in real-time through your personal dashboard." },
];

const AGENT_STEPS = [
  { icon:"✍️", title:"Sign Up as Agent or Landlord",      desc:"Create your verified agent profile, upload credentials, and get approved to start listing properties." },
  { icon:"📸", title:"Create a Listing",      desc:"Add detailed property listings with photos, pricing, location, and amenities to attract serious buyers." },
  { icon:"📅", title:"Manage Inspections",    desc:"Accept or reschedule inspection requests, confirm bookings, and guide clients through every visit." },
  { icon:"📈", title:"Grow Your Business",    desc:"Track leads, measure listing performance, and use data insights to close more deals faster." },
];

function HowItWorks({ onSignUp }) {
  const [tab, setTab] = useState("clients");
  const steps = tab === "clients" ? CLIENT_STEPS : AGENT_STEPS;

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">Use app in 4 Easy Steps</h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Use GHOUSECONNECT in four simple steps</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10 sm:mb-14">
          <button onClick={() => setTab("clients")}
            className={`px-5 sm:px-7 py-2.5 rounded-full text-sm font-bold transition-all ${tab==="clients" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            Clients
          </button>
          <button onClick={() => setTab("agent")}
            className={`px-5 sm:px-7 py-2.5 rounded-full text-sm font-bold transition-all ${tab==="agent" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            Agent
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {steps.map(({ icon, title, desc }, i) => (
            <div key={i}
              className="group relative bg-gray-50 border border-gray-100 rounded-3xl p-5 sm:p-7 text-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 cursor-default overflow-hidden">
              <div className="w-14 sm:w-16 h-14 sm:h-16 bg-blue-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 transition-colors text-2xl sm:text-3xl">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-white text-sm sm:text-base mb-2 transition-colors">{title}</h3>
              <p className="text-gray-500 group-hover:text-blue-100 text-xs sm:text-sm leading-relaxed transition-colors">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA under cards */}
        <div className="text-center mt-8 sm:mt-10">
          <button onClick={onSignUp}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all">
            Get Started Free →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function GHOUSECONNECT() {
  const navigate = useNavigate();

  // Session timeout: clears token + redirects to landing after 10 min idle
  useSessionTimeout();

  const [modal, setModal]         = useState(false);
  const [modalTab, setModalTab]   = useState("signin");
  const [scrolled, setScrolled]   = useState(false);
  const [filterType, setFilter]   = useState("All");
  const [openFaq, setOpenFaq]     = useState(null);
  const [liked, setLiked]         = useState({});
  const [toast, setToast]         = useState(null);
  const [heroIdx, setHeroIdx]     = useState(0);
  const [loggedIn, setLoggedIn]   = useState(getIsLoggedIn);

  const heroImgs = [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
  ];

  // Stay in sync if user logs in/out in another tab
  useEffect(() => {
    const sync = () => setLoggedIn(getIsLoggedIn());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i+1) % heroImgs.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Logged-in users go straight to their dashboard; guests open the auth modal
  const handleCTA = () => {
    if (loggedIn) navigate(getDashboardPath());
    else { setModalTab("signin"); setModal(true); }
  };

  const handleSignUp = () => {
    if (loggedIn) navigate(getDashboardPath());
    else { setModalTab("register"); setModal(true); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  const handleModalClose = (reason) => {
    setModal(false);
    if (reason === "login_success") { setLoggedIn(true); showToast("Welcome back! You're now signed in. 🎉"); }
    if (reason === "verified")      { setLoggedIn(true); showToast("Email verified! Your account is ready. 🎉"); }
  };

  const filtered = filterType === "All" ? DEMO_PROPERTIES : DEMO_PROPERTIES.filter(p => p.type === filterType);

  return (
    <div className="font-sans bg-white text-gray-900 overflow-x-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] bg-blue-600 text-white px-6 py-3 rounded-xl shadow-xl text-sm font-semibold">
          {toast}
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><Home size={16} className="text-white"/></div>
            <span className="text-white text-lg sm:text-xl font-bold">GHOUSE<span className="text-blue-400">CONNECT</span></span>
          </button>

          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {["Home","About","How it Works","Features","Contact"].map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g,"-"))}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors">{l}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={handleCTA}
              className="text-white border border-white/30 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all">Log In</button>
            <button onClick={handleSignUp}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all">Sign Up</button>
          </div>

          {/* Mobile: buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button className="text-white border border-white/30 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all"
              onClick={handleCTA}>Log In</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-[60vh] sm:min-h-[75vh] md:min-h-screen bg-[#0a1628] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImgs.map((src,i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i===heroIdx?"opacity-30":"opacity-0"}`}
              style={{ backgroundImage:`url(${src})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/80 to-transparent"/>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>Trusted Real Estate Platform
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
              Find your Perfect{" "}<span className="text-blue-400">Property</span>{" "}with Ease
            </h1>
            <p className="text-white/60 text-base sm:text-lg mb-6 sm:mb-8 max-w-lg">
             Discover curated luxury properties aross Nigeria's most coveted addresses. Browse, book inspection, and lease all in one place.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-8">
              {[["10K+","Listed Properties"],["95%","Satisfied Clients"],["12+","Years Experience"]].map(([n,l]) => (
                <div key={l}><div className="text-white font-black text-xl sm:text-2xl">{n}</div><div className="text-white/40 text-xs">{l}</div></div>
              ))}
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="grid grid-cols-2 gap-4">
              {DEMO_PROPERTIES.slice(0,2).map(p => (
                <div key={p.id} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:scale-105 transition-transform duration-300">
                  <img src={p.img} alt={p.title} className="w-full h-36 object-cover"/>
                  <div className="p-3">
                    <div className="text-white font-bold text-sm truncate">{p.title}</div>
                    <div className="text-blue-400 font-black text-base">{p.price}</div>
                    <div className="text-white/40 text-xs flex items-center gap-1 mt-1"><MapPin size={10}/>{p.location}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp size={18} className="text-green-600"/>
              </div>
              <div>
                <div className="font-black text-gray-900 text-sm">Best Deal Available</div>
                <div className="text-blue-600 font-bold text-base">₦45,000,000</div>
                <div className="text-gray-400 text-xs flex items-center gap-1"><MapPin size={10}/>Victoria Island, Lagos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-3">About Us</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4 sm:mb-5">Nigeria's Most Trusted Real Estate Platform</h2>
            <p className="text-gray-500 text-base sm:text-lg mb-6">Connecting property seekers with exceptional listing across the country. Whether you're searching for your dream home or managing a portfolio of properties. GHOUSECONNECT have everything you need. </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[["10K+","Active Listings"],["500+","Verified Agents and Landlords"],["95%","Success Rate"],["₦50B+","Transactions"]].map(([n,l]) => (
                <div key={l} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                  <div className="text-blue-600 font-black text-xl sm:text-2xl">{n}</div>
                  <div className="text-gray-500 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-8 md:mt-0">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80" alt="about" className="rounded-3xl shadow-2xl w-full h-64 sm:h-80 md:h-96 object-cover"/>
            <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-blue-600 text-white rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="font-black text-2xl sm:text-3xl">12+</div>
              <div className="text-blue-100 text-xs sm:text-sm">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks onSignUp={handleSignUp} />

      {/* ── FEATURES ── */}
      <section id="features" className="relative overflow-hidden" style={{ minHeight: 520 }}>
        {/* Full-bleed background photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/a713fa192c6385fe1c67fa3e2aabe17e717f604d.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0a1628]/70" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-0">
          {/* Heading — centred, white */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Core Feature
            </h2>
          </div>

          {/* Cards row — sits at the bottom so they bleed slightly out */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pb-0">
            {[
              {
                Icon: Shield,
                title: "Verified Agents and Landlords",
                desc: "only Agents with verified identity can list products & sell",
              },
              {
                Icon: CreditCard,
                title: "Escrow Payment",
                desc: "Payment are safetly held until after Inspection.",
              },
              {
                Icon: Users,
                title: "Visibility for Agents",
                desc: "Agents list their Apartment Clients browse easily by categories, price, or location",
              },
              {
                Icon: Star,
                title: "Trust & Transparency",
                desc: "Ratings reviews, and dispute system ensure fair trade and reliable transactions",
              },
            ].map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 sm:p-8 flex flex-col gap-5"
                style={{
                  background: "rgba(255,255,255,0.13)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.22)" }}
                >
                  <Icon size={26} color="white" strokeWidth={1.8} />
                </div>

                <div>
                  <div className="text-white font-bold text-lg sm:text-xl mb-2 leading-snug">
                    {title}
                  </div>
                  <div className="text-white/70 text-sm leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="bg-white py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Large left-aligned heading */}
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-16 sm:mb-24">
            Who is it for
          </h2>

          {/* ── ROW 1: Buyer — text left, staggered photos right ── */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-20 sm:mb-32">

            {/* Left: text content */}
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-blue-800 mb-5">Users</h3>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                Browse hundreds of verified listings, compare properties, book inspections at your convenience,
                and track every step from your personal dashboard.
              </p>
              <button
                onClick={handleSignUp}
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-full text-base font-semibold transition-all shadow-md"
              >
                Get Started
              </button>
            </div>

            {/* Right: masked shaped image */}
            <div className="relative flex items-center justify-center h-72 sm:h-96 md:h-[480px]">
              <img
                src="/Mask group.png"
                alt="Luxury property"
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{ maxHeight: "480px" }}
              />
            </div>
          </div>

          {/* ── ROW 2: Agents — staggered photos left, text right ── */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* Left: masked shaped image (shown second on mobile) */}
            <div className="relative flex items-center justify-center h-72 sm:h-96 md:h-[480px] order-2 md:order-1">
              <img
                src="/Mask group (1).png"
                alt="Modern building"
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{ maxHeight: "480px" }}
              />
            </div>

            {/* Right: text content */}
            <div className="order-1 md:order-2">
              <h3 className="text-3xl sm:text-4xl font-black text-blue-800 mb-5">Agents and Landlords</h3>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                Upload and manage your listings, handle inspection bookings, approve or reject requests,
                and track your earnings — all from one powerful dashboard..
              </p>
              <button
                onClick={handleSignUp}
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-full text-base font-semibold transition-all shadow-md"
              >
                Get started
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <div className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Reviews</div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">What People Say About GHOUSECONNECT</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">4.8</span>
              <div className="flex">{[...Array(5)].map((_,i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400"/>)}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100">
                <div className="text-blue-400 text-4xl font-black leading-none mb-4">"</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="font-semibold text-gray-900">— {t.name},</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="contact" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* ── Left: heading + accordion ── */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-10 sm:mb-12">
              Frequently Asked<br />Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((f, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#e8f5ee" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-900 text-base transition-colors"
                  >
                    {f.q}
                    <Plus size={22} strokeWidth={2} className={`text-gray-900 shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-45" : ""}`}/>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: question-mark photo + CTA ── */}
          <div className="flex flex-col gap-8">
            <div className="rounded-2xl overflow-hidden shadow-md w-full">
              <img
                src="/3ad0a6ba4dd01e0c4597d34d2d2b5b3203958cd0.jpg"
                alt="Frequently asked questions"
                className="w-full object-cover"
                style={{ height: 340 }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-gray-900">Have more question?</h3>
              <p className="text-gray-500 text-base">Send a direct email to our customer care.</p>
              <button className="w-full bg-blue-800 hover:bg-blue-900 text-white py-4 rounded-xl text-base font-semibold transition-all shadow-md mt-2">
                Send Email
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── CONTACT US ── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Full-bleed background photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/core-bg.png",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0a1628]/65" />

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-10 sm:mb-14">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">

            {/* Left: contact info card */}
            <div
              className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span className="text-white text-base font-medium">+234 8040 000 002</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <span className="text-white text-base font-medium">support@ghouseconnect.com</span>
              </div>
            </div>

            {/* Right: contact form */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-white/80 text-xs font-semibold mb-1.5 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-semibold mb-1.5 uppercase tracking-wider">E-mail</label>
                  <input
                    type="email"
                    placeholder="johnsmith@gmail.com"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-semibold mb-1.5 uppercase tracking-wider">Complaint</label>
                  <input
                    type="text"
                    placeholder="Delayed delivery"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-semibold mb-1.5 uppercase tracking-wider">Message</label>
                  <textarea
                    placeholder="Write your full message here"
                    rows={4}
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
                  />
                </div>
                <button className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-lg w-fit mt-1">
                  <div className="w-6 h-6 bg-white/25 rounded-full flex items-center justify-center">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </div>
                  Submit
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-blue-800 rounded-3xl px-10 sm:px-16 py-16 sm:py-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-12 sm:mb-16 max-w-xl leading-snug">
              Ready to make House Inspection Booking, easy and safe?
            </h2>
            <button
              onClick={handleSignUp}
              className="bg-white text-gray-900 px-10 py-4 rounded-full text-base font-semibold hover:bg-gray-100 transition-all shadow-md"
            >
              Get started
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-blue-800 text-white pt-10 pb-12">
        {/* Divider */}
        <div className="border-t border-white/20 mb-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-8">

          {/* Left: app store buttons */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 border border-white/40 rounded-xl px-4 py-2.5 hover:bg-white/10 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l14 8.5-14 8.5c-.5.33-1.5.33-1.5-.5z"/></svg>
              <div className="text-left">
                <div className="text-white/60 text-[10px] leading-none">Download on</div>
                <div className="text-white font-semibold text-sm">Playstore</div>
              </div>
            </a>
            <a href="#" className="flex items-center gap-2 border border-white/40 rounded-xl px-4 py-2.5 hover:bg-white/10 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <div className="text-white/60 text-[10px] leading-none">Download on</div>
                <div className="text-white font-semibold text-sm">App store</div>
              </div>
            </a>
          </div>

          {/* Centre: newsletter */}
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-white/80 text-sm">Subscribe to our newsletter to get updates on our latest offers!</p>
            <div className="flex items-center gap-2 w-full max-w-sm">
              <div className="flex items-center gap-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 flex-1">
                <Mail size={16} className="text-white/50 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="bg-transparent text-white placeholder-white/40 text-sm outline-none w-full"
                />
              </div>
              <button className="bg-white text-blue-800 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* Right: social icons */}
          <div className="flex flex-col items-center sm:items-end gap-3">
            <span className="text-white font-semibold text-sm">Contact us</span>
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.849L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* ── AUTH MODAL — only shown to guests ── */}
      {modal && <AuthModal onClose={handleModalClose} defaultTab={modalTab}/>}
    </div>
  );
}