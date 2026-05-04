import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useSessionTimeout from './Usesessiontimeout';
import { Eye, EyeOff, ArrowLeft, User, Building2, AlertCircle } from 'lucide-react';

/* ── Color tokens ──────────────────────────────────────────────────────────── */
const BLUE    = "#1a56db";
const NAVY    = "#0b1a2e";
const LIGHTBG = "#f0f5ff";
const GREY    = "#6b7280";
const BORDER  = "#e5e7eb";
const WHITE   = "#ffffff";

/* ── 36 Nigerian States + FCT ──────────────────────────────────────────────── */
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

/* ── Focus / blur helpers ──────────────────────────────────────────────────── */
const onFocus = (e) => {
  e.target.style.borderColor = BLUE;
  e.target.style.boxShadow   = "0 0 0 3px rgba(26,86,219,0.13)";
};
const onBlur = (e) => {
  e.target.style.borderColor = BORDER;
  e.target.style.boxShadow   = "none";
};

/* ── Shared input style ────────────────────────────────────────────────────── */
const inputBase = {
  width:"100%", padding:"8px 12px", border:`1.5px solid ${BORDER}`,
  borderRadius:9, fontSize:14, color:NAVY, outline:"none",
  transition:"border-color .2s, box-shadow .2s",
  background:WHITE, boxSizing:"border-box", fontFamily:"'Inter',sans-serif",
};

const selectBase = {
  ...inputBase,
  appearance:"none",
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat:"no-repeat", backgroundPosition:"right 13px center",
  cursor:"pointer",
};

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE SHELL
══════════════════════════════════════════════════════════════════════════════ */
const Shell = ({ children }) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; font-family: 'Inter', sans-serif; }
      @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes spin    { to   { transform: rotate(360deg); } }
      @keyframes shimmer { 0%,100% { opacity:.55; } 50% { opacity:.8; } }
      input::placeholder, textarea::placeholder { color: #9ca3af; }
      select option { color: #0b1a2e; }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: rgba(229,231,235,0.6); border-radius: 4px; }
      ::-webkit-scrollbar-thumb { background: #1a56db; border-radius: 4px; border: 1px solid rgba(255,255,255,0.3); }
      ::-webkit-scrollbar-thumb:hover { background: #1444b8; }
      .auth-page { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; position: relative; overflow: hidden; font-family: 'Inter', sans-serif; }
      .auth-bg { position: fixed; inset: 0; background-image: url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=85'); background-size: cover; background-position: center; background-attachment: fixed; z-index: 0; }
      .auth-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(11,26,46,0.72) 0%, rgba(26,86,219,0.38) 50%, rgba(7,20,34,0.80) 100%); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
      .orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 1; animation: shimmer 6s ease-in-out infinite; }
      .orb-1 { width:420px; height:420px; top:-100px; right:-80px;  background: radial-gradient(circle, rgba(26,86,219,0.28) 0%, transparent 70%); }
      .orb-2 { width:320px; height:320px; bottom:-80px; left:-60px; background: radial-gradient(circle, rgba(96,165,250,0.22) 0%, transparent 70%); animation-delay: 3s; }
      .orb-3 { width:200px; height:200px; top:40%;  left:5%;        background: radial-gradient(circle, rgba(26,86,219,0.15) 0%, transparent 70%); animation-delay: 1.5s; }
      html { overflow-y: scroll; scrollbar-width: thin; scrollbar-color: #1a56db rgba(229,231,235,0.6); }
      body { overflow-x: hidden; }
      .auth-card { position: relative; z-index: 10; width: 100%; max-width: 760px; background: rgba(255,255,255,0.97); border-radius: 20px; box-shadow: 0 40px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15); overflow: hidden; animation: fadeUp .55s cubic-bezier(.16,1,.3,1) both; }
      .auth-card-topbar { height: 5px; background: linear-gradient(90deg, #1a56db 0%, #60a5fa 40%, #3b82f6 70%, #1a56db 100%); background-size: 200% 100%; }
      .auth-card-body { padding: 18px 36px 14px; }
      .back-btn { position: fixed; top: 20px; left: 20px; z-index: 20; display: flex; align-items: center; gap: 7px; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22); backdrop-filter: blur(8px); border-radius: 10px; padding: 8px 16px; font-size: 13px; font-weight: 500; text-decoration: none; transition: background .2s; }
      .back-btn:hover { background: rgba(255,255,255,0.2); }
      .logo-row { display: flex; align-items: center; gap: 8px; justify-content: center; margin-bottom: 4px; }
      .logo-icon { width: 40px; height: 40px; background: ${BLUE}; border-radius: 10px; display: grid; place-items: center; box-shadow: 0 4px 14px rgba(26,86,219,0.35); }
      .logo-text { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 22px; color: ${NAVY}; }
      .logo-text span { color: ${BLUE}; }
      .logo-tag { text-align: center; font-size: 11px; color: #9ca3af; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 10px; font-weight: 500; }
      .role-wrap { display: flex; background: ${LIGHTBG}; border-radius: 13px; padding: 4px; gap: 4px; margin-bottom: 10px; }
      .role-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 10px 12px; border-radius: 10px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; transition: all .22s; font-family: 'Inter', sans-serif; }
      .role-btn.active { background: ${BLUE}; color: white; font-weight: 700; box-shadow: 0 4px 16px rgba(26,86,219,0.3); }
      .role-btn.inactive { background: transparent; color: ${GREY}; }
      .tab-row { display: flex; border-bottom: 2px solid ${BORDER}; margin-bottom: 10px; }
      .tab-btn { flex: 1; padding: 10px 0; text-align: center; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; transition: color .2s; margin-bottom: -2px; font-family: 'Inter', sans-serif; }
      .tab-btn.active  { color: ${BLUE};  border-bottom: 2px solid ${BLUE}; }
      .tab-btn.inactive{ color: ${GREY}; border-bottom: 2px solid transparent; }
      .col2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .field-wrap { margin-bottom: 8px; position: relative; }
      label.field-label { display: block; font-size: 13.5px; font-weight: 600; color: #1f2937; margin-bottom: 6px; letter-spacing: 0.2px; }
      .pass-wrap { position: relative; }
      .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: ${GREY}; display: flex; align-items: center; padding: 0; }
      .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px; padding: 10px 14px; color: #dc2626; font-size: 13.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
      .hint-ok  { font-size: 12px; margin-top: 4px; color: #16a34a; }
      .hint-err { font-size: 12px; margin-top: 4px; color: #dc2626; }
      .submit-btn { width: 100%; padding: 10px 0; background: ${BLUE}; color: white; border: none; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 6px; transition: background .2s, transform .15s, box-shadow .2s; box-shadow: 0 6px 22px rgba(26,86,219,0.35); letter-spacing: 0.3px; font-family: 'Inter', sans-serif; }
      .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(26,86,219,0.42); }
      .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; transform: none; }
      .switch-row  { text-align: center; margin-top: 8px; font-size: 13px; color: ${GREY}; }
      .switch-link { color: ${BLUE}; font-weight: 600; background: none; border: none; cursor: pointer; font-size: 14px; font-family: 'Inter', sans-serif; }
      .otp-wrap { text-align: center; padding: 10px 0; }
      .otp-icon { width: 72px; height: 72px; border-radius: 50%; background: ${LIGHTBG}; display: grid; place-items: center; margin: 0 auto 18px; box-shadow: 0 4px 16px rgba(26,86,219,0.12); }
      .otp-input { width: 100%; padding: 14px; text-align: center; border: 1.5px solid ${BORDER}; border-radius: 9px; font-size: 26px; letter-spacing: 14px; font-weight: 700; color: ${NAVY}; outline: none; box-sizing: border-box; margin-bottom: 16px; font-family: 'Inter', sans-serif; transition: border-color .2s, box-shadow .2s; }
      .forgot-link { text-align: right; margin-top: -8px; margin-bottom: 14px; }
      .forgot-link a { font-size: 13px; color: ${BLUE}; font-weight: 500; text-decoration: none; }
      .forgot-link a:hover { text-decoration: underline; }
      .spinner { width:17px; height:17px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; display: inline-block; animation: spin .7s linear infinite; }
      .spin-row { display:flex; align-items:center; justify-content:center; gap:9px; }
      @media (max-width: 600px) { .auth-card-body { padding: 14px 16px 10px; } .col2 { grid-template-columns: 1fr; } .auth-card { border-radius: 14px; } }
    `}</style>
    <div className="auth-page">
      <div className="auth-bg"/>
      <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>
      <Link to="/" className="back-btn">
        <ArrowLeft size={14}/> Back to Home
      </Link>
      <div className="auth-card">
        <div className="auth-card-topbar"/>
        <div className="auth-card-body">
          <div className="logo-row">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <span className="logo-text">GHOUSE<span>CONNECT</span></span>
          </div>
          <p className="logo-tag">Nigeria's trusted real estate platform</p>
          {children}
        </div>
        <div style={{ height:5, background:`linear-gradient(90deg,${BLUE} 0%,#60a5fa 50%,${BLUE} 100%)` }}/>
      </div>
    </div>
  </>
);

/* ══════════════════════════════════════════════════════════════════════════════
   AUTH COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
const Auth = () => {
  const [isRegister, setIsRegister]       = useState(true);
  const [userType, setUserType]           = useState('user');
  const [formData, setFormData]           = useState({
    firstName:'', lastName:'', email:'', password:'', confirmPassword:'',
    phone:'', address:'', state:'', alias:'',
  });
  const [error, setError]                 = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [loginSuccess, setLoginSuccess]   = useState(false);

  /* OTP */
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerCode]    = useState('');
  const [registeredEmail, setRegEmail]    = useState('');
  const [isVerifyingCode, setIsVerifying] = useState(false);
  const [resendingCode, setResending]     = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Session timeout: if user is already logged in, track inactivity
  useSessionTimeout({ requireAuth: true });

  useEffect(() => {
    if (location.pathname.includes('/agent')) setUserType('agent');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loginSuccess && !isRegister) {
      const route = userType === 'user' ? '/dashboard' : '/agent-dashboard';
      const t = setTimeout(() => navigate(route, { replace:true }), 500);
      return () => clearTimeout(t);
    }
  }, [loginSuccess, isRegister, userType, navigate]);

  const resetForm = (keepEmail = false) => {
    setFormData({ firstName:'',lastName:'',email:'',password:'',confirmPassword:'',phone:'',address:'',state:'',alias:'' });
    setError(''); setShowPassword(false); setShowConfirm(false);
    setLoginSuccess(false);
    if (!keepEmail) {
      setShowCodeInput(false); setVerCode(''); setRegEmail('');
    }
  };

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const passMatch = formData.confirmPassword === '' || formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    setError(''); setIsLoading(true); setLoginSuccess(false);
    const base = import.meta.env.VITE_API_BASE_URL || 'https://gtimeconnect.onrender.com';
    const endpoint = isRegister
      ? (userType === 'user' ? '/api/v1/users/register' : '/api/v1/agents/register')
      : (userType === 'user' ? '/api/v1/auth/user/login' : '/api/v1/auth/agent/login');

    const rawPhone = formData.phone.replace(/\s/g, '');
    const phone = rawPhone.startsWith('+234')
      ? '0' + rawPhone.slice(4)
      : rawPhone.startsWith('234') && rawPhone.length >= 13
        ? '0' + rawPhone.slice(3)
        : rawPhone;

    const payload = isRegister
      ? { fullName:`${formData.firstName} ${formData.lastName}`.trim(),
          email:formData.email, password:formData.password,
          confirmPassword:formData.confirmPassword,
          phone, address:formData.address, state:formData.state,
          alias: formData.alias,
          role: userType === 'agent' ? 'agent' : 'user' }
      : { email:formData.email, password:formData.password };

    try {
      const res = await axios.post(`${base}${endpoint}`, payload);

      if (!isRegister) {
        const responseData = res.data.data ?? res.data;

        // ── KEY FIX: For agent login the API returns { token, agent: {...} }
        // For user login it returns { token, user: {...} }
        // We check for agent first, then user, then fallback to the whole object
        const apiUser = responseData.agent ?? responseData.user ?? responseData;
        const token = responseData.token ?? res.data.token;

        const userData = {
          ...apiUser,
          // Explicitly preserve the nested 'agent' object if it exists.
          // CreateListingPage reads parsedUser.agent._id to get the agent's ID.
          agent: responseData.agent ?? apiUser?.agent ?? undefined,
          userType,
          name: apiUser?.firstName
            ? `${apiUser.firstName} ${apiUser.lastName}`.trim()
            : apiUser?.name ?? '',
          email: apiUser?.email ?? formData.email,
        };

        console.log('Login response data:', JSON.stringify(responseData, null, 2));
        console.log('Saving userData to localStorage:', JSON.stringify(userData, null, 2));

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ ...userData, userType }));
        localStorage.setItem('ghouseconnect_user', JSON.stringify({
          name:  userData.name || apiUser?.fullName || '',
          fullName: userData.name || apiUser?.fullName || '',
          email: userData.email,
        }));
        setLoginSuccess(true);
        const route = userType === 'user' ? '/dashboard' : '/agent-dashboard';
        setTimeout(() => navigate(route, { replace: true }), 500);
      } else {
        setRegEmail(formData.email);
        resetForm(true);
        setShowCodeInput(true);
      }
    } catch (err) {
      const apiMsg = err.response?.data?.message
        || err.response?.data?.error
        || (typeof err.response?.data === 'string' ? err.response.data : null)
        || `Error ${err.response?.status}: Operation failed. Please try again.`;
      console.error('Auth error:', err.response?.data);
      setError(apiMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(''); setIsVerifying(true);
    const base = import.meta.env.VITE_API_BASE_URL || 'https://gtimeconnect.onrender.com';
    try {
      const res = await axios.post(`${base}/api/v1/auth/verify`, {
        otp: verificationCode,
        email: registeredEmail,
      });
      const verifyData = res.data.data ?? res.data;
      const verifyToken = verifyData.token ?? res.data.token;
      if (verifyToken) {
        const apiUser = verifyData.agent ?? verifyData.user ?? verifyData;
        const userData = {
          ...apiUser,
          agent: verifyData.agent ?? apiUser?.agent ?? undefined,
          userType,
          name: apiUser?.firstName
            ? `${apiUser.firstName} ${apiUser.lastName}`.trim()
            : apiUser?.name ?? '',
          email: apiUser?.email ?? registeredEmail,
        };
        localStorage.setItem('token', verifyToken);
        localStorage.setItem('user', JSON.stringify({ ...userData, userType }));
        localStorage.setItem('ghouseconnect_user', JSON.stringify({
          name:  userData.name || apiUser?.fullName || '',
          fullName: userData.name || apiUser?.fullName || '',
          email: userData.email,
        }));
      }
      const route = userType === 'user' ? '/dashboard' : '/agent-dashboard';
      setTimeout(() => navigate(route, { replace:true }), 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true); setError('');
    const base = import.meta.env.VITE_API_BASE_URL || 'https://gtimeconnect.onrender.com';
    try { await axios.post(`${base}/api/v1/auth/resend-verification`, { email: registeredEmail }); }
    catch (err) { setError(err.response?.data?.message || 'Failed to resend.'); }
    finally { setResending(false); }
  };

  /* ── OTP screen ─────────────────────────────────────────────────────────── */
  if (showCodeInput) {
    return (
      <Shell>
        <div className="otp-wrap">
          <div className="otp-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:"1.4rem", color:NAVY, marginBottom:8 }}>
            Check Your Email
          </h2>
          <p style={{ fontSize:14, color:GREY, marginBottom:20 }}>
            We sent a 6-digit code to<br/>
            <strong style={{ color:NAVY }}>{registeredEmail}</strong>
          </p>
          {error && <div className="error-box"><AlertCircle size={15}/>{error}</div>}
          <form onSubmit={handleVerifyCode}>
            <input
              type="text" inputMode="numeric" maxLength={6} placeholder="••••••"
              value={verificationCode}
              onChange={e => setVerCode(e.target.value.replace(/\D/g,'').slice(0,6))}
              className="otp-input"
              onFocus={onFocus} onBlur={onBlur}
              required
            />
            <button type="submit" className="submit-btn"
              disabled={isVerifyingCode || verificationCode.length < 6}>
              {isVerifyingCode ? <span className="spin-row"><span className="spinner"/>Verifying…</span> : 'Verify Email'}
            </button>
          </form>
          <p className="switch-row" style={{ marginTop:18 }}>
            Didn't get the code?{' '}
            <button onClick={handleResend} disabled={resendingCode} className="switch-link">
              {resendingCode ? 'Sending…' : 'Resend'}
            </button>
          </p>
          <p className="switch-row" style={{ marginTop:10 }}>
            <button onClick={()=>{ setShowCodeInput(false); resetForm(); }}
              className="switch-link" style={{ color:GREY }}>← Back to registration</button>
          </p>
        </div>
      </Shell>
    );
  }

  /* ── Main screen ────────────────────────────────────────────────────────── */
  const submitDisabled = isLoading
    || (isRegister && formData.confirmPassword.length > 0 && !passMatch);

  return (
    <Shell>
      {/* Role toggle */}
      <div className="role-wrap">
        {[
          { key:'user',  label: isRegister ? 'Register as User'  : 'Sign in as User',  Icon:User },
          { key:'agent', label: isRegister ? 'Register as Agent' : 'Sign in as Agent', Icon:Building2 },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`role-btn ${userType === key ? 'active' : 'inactive'}`}
            onClick={() => { setUserType(key); setError(''); }}
          >
            <Icon size={15}/>{label}
          </button>
        ))}
      </div>

      <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:"1.25rem", color:NAVY, textAlign:"center", marginBottom:2 }}>
        {isRegister ? `Create ${userType === 'user' ? 'User' : 'Agent'} Account` : 'Welcome Back'}
      </h1>
      <p style={{ fontSize:13, color:GREY, textAlign:"center", marginBottom:8 }}>
        {isRegister
          ? `Join GHOUSECONNECT as a${userType === 'agent' ? 'n agent' : ' user'} to get started`
          : `Sign in to your ${userType} account`}
      </p>

      <div className="tab-row">
        <button className={`tab-btn ${!isRegister ? 'active' : 'inactive'}`}
          onClick={() => { setIsRegister(false); resetForm(); }}>Sign In</button>
        <button className={`tab-btn ${isRegister ? 'active' : 'inactive'}`}
          onClick={() => { setIsRegister(true); resetForm(); }}>Create Account</button>
      </div>

      {loginSuccess && (
        <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:9, padding:"10px 14px", color:"#15803d", fontSize:13.5, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
          ✓ Signed in successfully! Redirecting…
        </div>
      )}

      {error && <div className="error-box"><AlertCircle size={15}/>{error}</div>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <div className="col2">
              <div className="field-wrap">
                <label className="field-label">First Name</label>
                <input name="firstName" type="text" placeholder="John"
                  value={formData.firstName} onChange={handleChange}
                  style={inputBase} onFocus={onFocus} onBlur={onBlur}
                  required disabled={isLoading} autoComplete="given-name"/>
              </div>
              <div className="field-wrap">
                <label className="field-label">Last Name</label>
                <input name="lastName" type="text" placeholder="Doe"
                  value={formData.lastName} onChange={handleChange}
                  style={inputBase} onFocus={onFocus} onBlur={onBlur}
                  required disabled={isLoading} autoComplete="family-name"/>
              </div>
            </div>
            <div className="col2">
              <div className="field-wrap">
                <label className="field-label">Email Address</label>
                <input name="email" type="email" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange}
                  style={inputBase} onFocus={onFocus} onBlur={onBlur}
                  required disabled={isLoading} autoComplete="email"/>
              </div>
              <div className="field-wrap">
                <label className="field-label">Phone Number</label>
                <input name="phone" type="tel" placeholder="+234 800 000 0000"
                  value={formData.phone} onChange={handleChange}
                  style={inputBase} onFocus={onFocus} onBlur={onBlur}
                  required disabled={isLoading} autoComplete="tel"/>
              </div>
            </div>
            <div className="col2">
              <div className="field-wrap">
                <label className="field-label">Street Address</label>
                <input name="address" type="text" placeholder="123 Broad Street"
                  value={formData.address} onChange={handleChange}
                  style={inputBase} onFocus={onFocus} onBlur={onBlur}
                  required disabled={isLoading} autoComplete="street-address"/>
              </div>
              <div className="field-wrap">
                <label className="field-label">State</label>
                <select name="state" value={formData.state} onChange={handleChange}
                  style={{ ...selectBase, color: formData.state ? NAVY : GREY }}
                  onFocus={onFocus} onBlur={onBlur}
                  required disabled={isLoading}>
                  <option value="" disabled>Select your state</option>
                  {NIGERIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>
            {userType === 'agent' && (
  <div className="field-wrap">
    <label className="field-label">Role</label>
    <select name="alias" value={formData.alias} onChange={handleChange}
      style={{ ...selectBase, color: formData.alias ? NAVY : GREY }}
      onFocus={onFocus} onBlur={onBlur}
      required={userType === 'agent'}
      disabled={isLoading}>
      <option value="" disabled>Select your role</option>
      <option value="agent">Agent</option>
      <option value="landlord">Landlord</option>
    </select>
  </div>
)}
            <div className="col2">
              <div className="field-wrap">
                <label className="field-label">Password</label>
                <div className="pass-wrap">
                  <input name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={formData.password} onChange={handleChange}
                    style={{ ...inputBase, paddingRight:42 }}
                    onFocus={onFocus} onBlur={onBlur}
                    required disabled={isLoading} minLength={6}
                    autoComplete="new-password"/>
                  <button type="button" className="eye-btn"
                    onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <div className="field-wrap">
                <label className="field-label">Confirm Password</label>
                <div className="pass-wrap">
                  <input name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword} onChange={handleChange}
                    style={{
                      ...inputBase, paddingRight:42,
                      borderColor: formData.confirmPassword && !passMatch ? '#dc2626' : BORDER,
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = formData.confirmPassword && !passMatch ? '#dc2626' : BLUE;
                      e.target.style.boxShadow   = formData.confirmPassword && !passMatch
                        ? "0 0 0 3px rgba(220,38,38,0.12)" : "0 0 0 3px rgba(26,86,219,0.13)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = formData.confirmPassword && !passMatch ? '#dc2626' : BORDER;
                      e.target.style.boxShadow   = "none";
                    }}
                    required disabled={isLoading} minLength={6}
                    autoComplete="new-password"/>
                  <button type="button" className="eye-btn"
                    onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                    {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className={passMatch ? 'hint-ok' : 'hint-err'}>
                    {passMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {!isRegister && (
          <>
            <div className="field-wrap">
              <label className="field-label">Email Address</label>
              <input name="email" type="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange}
                style={inputBase} onFocus={onFocus} onBlur={onBlur}
                required disabled={isLoading} autoComplete="email"/>
            </div>
            <div className="field-wrap">
              <label className="field-label">Password</label>
              <div className="pass-wrap">
                <input name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password} onChange={handleChange}
                  style={{ ...inputBase, paddingRight:42 }}
                  onFocus={onFocus} onBlur={onBlur}
                  required disabled={isLoading} autoComplete="current-password"/>
                <button type="button" className="eye-btn"
                  onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div className="forgot-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </>
        )}

        <button type="submit" className="submit-btn" disabled={submitDisabled}>
          {isLoading
            ? <span className="spin-row"><span className="spinner"/>Please wait…</span>
            : isRegister
              ? `Create ${userType === 'user' ? 'User' : 'Agent'} Account`
              : `Sign In as ${userType === 'user' ? 'User' : 'Agent'}`
          }
        </button>
      </form>

      <p className="switch-row">
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <button onClick={() => { setIsRegister(p => !p); resetForm(); }} className="switch-link">
          {isRegister ? 'Sign In' : 'Create Account'}
        </button>
      </p>
    </Shell>
  );
};

export default Auth;