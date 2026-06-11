import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, AlertCircle, KeyRound, Mail, ShieldCheck } from 'lucide-react';

/* ── Color tokens (mirrors Auth.jsx) ───────────────────────────────────────── */
const BLUE    = "#1a56db";
const NAVY    = "#0b1a2e";
const LIGHTBG = "#f0f5ff";
const GREY    = "#6b7280";
const BORDER  = "#e5e7eb";
const WHITE   = "#ffffff";

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
  width:"100%", padding:"10px 12px", border:`1.5px solid ${BORDER}`,
  borderRadius:9, fontSize:14, color:NAVY, outline:"none",
  transition:"border-color .2s, box-shadow .2s",
  background:WHITE, boxSizing:"border-box", fontFamily:"'Inter',sans-serif",
};

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE SHELL  (identical to Auth.jsx)
══════════════════════════════════════════════════════════════════════════════ */
const Shell = ({ children }) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; font-family: 'Inter', sans-serif; }
      @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes spin    { to { transform: rotate(360deg); } }
      @keyframes shimmer { 0%,100% { opacity:.55; } 50% { opacity:.8; } }
      input::placeholder { color: #9ca3af; }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: rgba(229,231,235,0.6); border-radius: 4px; }
      ::-webkit-scrollbar-thumb { background: #1a56db; border-radius: 4px; border: 1px solid rgba(255,255,255,0.3); }
      .auth-page { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; position: relative; overflow: hidden; font-family: 'Inter', sans-serif; }
      .auth-bg { position: fixed; inset: 0; background-image: url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=85'); background-size: cover; background-position: center; background-attachment: fixed; z-index: 0; }
      .auth-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(11,26,46,0.72) 0%, rgba(26,86,219,0.38) 50%, rgba(7,20,34,0.80) 100%); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
      .orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 1; animation: shimmer 6s ease-in-out infinite; }
      .orb-1 { width:420px; height:420px; top:-100px; right:-80px;  background: radial-gradient(circle, rgba(26,86,219,0.28) 0%, transparent 70%); }
      .orb-2 { width:320px; height:320px; bottom:-80px; left:-60px; background: radial-gradient(circle, rgba(96,165,250,0.22) 0%, transparent 70%); animation-delay: 3s; }
      .orb-3 { width:200px; height:200px; top:40%; left:5%; background: radial-gradient(circle, rgba(26,86,219,0.15) 0%, transparent 70%); animation-delay: 1.5s; }
      html { overflow-y: scroll; scrollbar-width: thin; scrollbar-color: #1a56db rgba(229,231,235,0.6); }
      body { overflow-x: hidden; }
      .auth-card { position: relative; z-index: 10; width: 100%; max-width: 480px; background: rgba(255,255,255,0.97); border-radius: 20px; box-shadow: 0 40px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15); overflow: hidden; animation: fadeUp .55s cubic-bezier(.16,1,.3,1) both; }
      .auth-card-topbar { height: 5px; background: linear-gradient(90deg, #1a56db 0%, #60a5fa 40%, #3b82f6 70%, #1a56db 100%); }
      .auth-card-body { padding: 28px 36px 24px; }
      .back-btn { position: fixed; top: 20px; left: 20px; z-index: 20; display: flex; align-items: center; gap: 7px; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22); backdrop-filter: blur(8px); border-radius: 10px; padding: 8px 16px; font-size: 13px; font-weight: 500; text-decoration: none; transition: background .2s; }
      .back-btn:hover { background: rgba(255,255,255,0.2); }
      .logo-row { display: flex; align-items: center; gap: 8px; justify-content: center; margin-bottom: 4px; }
      .logo-icon { width: 40px; height: 40px; background: ${BLUE}; border-radius: 10px; display: grid; place-items: center; box-shadow: 0 4px 14px rgba(26,86,219,0.35); }
      .logo-text { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 22px; color: ${NAVY}; }
      .logo-text span { color: ${BLUE}; }
      .logo-tag { text-align: center; font-size: 11px; color: #9ca3af; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 20px; font-weight: 500; }
      .step-icon { width: 72px; height: 72px; border-radius: 50%; background: ${LIGHTBG}; display: grid; place-items: center; margin: 0 auto 16px; box-shadow: 0 4px 16px rgba(26,86,219,0.12); }
      .field-wrap { margin-bottom: 16px; position: relative; }
      label.field-label { display: block; font-size: 13.5px; font-weight: 600; color: #1f2937; margin-bottom: 6px; letter-spacing: 0.2px; }
      .pass-wrap { position: relative; }
      .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: ${GREY}; display: flex; align-items: center; padding: 0; }
      .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px; padding: 10px 14px; color: #dc2626; font-size: 13.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
      .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 9px; padding: 10px 14px; color: #15803d; font-size: 13.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
      .hint-err { font-size: 12px; margin-top: 4px; color: #dc2626; }
      .hint-ok  { font-size: 12px; margin-top: 4px; color: #16a34a; }
      .submit-btn { width: 100%; padding: 11px 0; background: ${BLUE}; color: white; border: none; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .2s, transform .15s, box-shadow .2s; box-shadow: 0 6px 22px rgba(26,86,219,0.35); letter-spacing: 0.3px; font-family: 'Inter', sans-serif; }
      .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(26,86,219,0.42); }
      .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; transform: none; }
      .switch-row { text-align: center; margin-top: 14px; font-size: 13px; color: ${GREY}; }
      .switch-link { color: ${BLUE}; font-weight: 600; background: none; border: none; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; }
      .otp-input { width: 100%; padding: 14px; text-align: center; border: 1.5px solid ${BORDER}; border-radius: 9px; font-size: 26px; letter-spacing: 14px; font-weight: 700; color: ${NAVY}; outline: none; box-sizing: border-box; margin-bottom: 16px; font-family: 'Inter', sans-serif; transition: border-color .2s, box-shadow .2s; }
      .spinner { width:17px; height:17px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; display: inline-block; animation: spin .7s linear infinite; }
      .spin-row { display:flex; align-items:center; justify-content:center; gap:9px; }
      .progress-bar { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 22px; }
      .progress-step { width: 28px; height: 4px; border-radius: 2px; transition: background .3s; }
      .progress-step.done    { background: ${BLUE}; }
      .progress-step.current { background: ${BLUE}; opacity: 0.5; }
      .progress-step.pending { background: ${BORDER}; }
      @media (max-width: 600px) { .auth-card-body { padding: 20px 18px 18px; } .auth-card { border-radius: 14px; } }
    `}</style>
    <div className="auth-page">
      <div className="auth-bg"/>
      <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>
      <Link to="/auth" className="back-btn">
        <ArrowLeft size={14}/> Back to Sign In
      </Link>
      <div className="auth-card">
        <div className="auth-card-topbar"/>
        <div className="auth-card-body">
          {/* Logo */}
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
   FORGOT PASSWORD COMPONENT
   step 1 → enter email
   step 2 → enter OTP
   step 3 → enter new password
══════════════════════════════════════════════════════════════════════════════ */
const ForgotPassword = () => {
  const [step, setStep]               = useState(1); // 1 | 2 | 3
  const [email, setEmail]             = useState('');
  const [otp, setOtp]                 = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetToken, setResetToken]   = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [resending, setResending]     = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  const navigate  = useNavigate();
  const BASE      = import.meta.env.VITE_API_BASE_URL || 'https://gtimeconnect.onrender.com';

  const pwMatch = confirmPw === '' || newPassword === confirmPw;
  const pwStrong = newPassword.length >= 6;

  /* ── Step progress bar ───────────────────────────────────────────────────── */
  const ProgressBar = () => (
    <div className="progress-bar">
      {[1,2,3].map(n => (
        <div
          key={n}
          className={`progress-step ${n < step ? 'done' : n === step ? 'current' : 'pending'}`}
        />
      ))}
    </div>
  );

  /* ── Step 1: Request OTP ─────────────────────────────────────────────────── */
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      await axios.post(`${BASE}/api/v1/auth/forgot-password`, { email, role: 'user' });
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to send reset code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Resend OTP ──────────────────────────────────────────────────────────── */
  const handleResend = async () => {
    setResending(true); setError(''); setSuccess('');
    try {
      await axios.post(`${BASE}/api/v1/auth/forgot-password`, { email, role: 'user' });
      setSuccess('A new code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  /* ── Step 2: Verify OTP ──────────────────────────────────────────────────── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      const res = await axios.post(`${BASE}/api/v1/auth/verify-password-reset-otp`, { email, otp, role: 'user' });
      setResetToken(res.data?.data?.resetToken || '');
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid or expired code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Step 3: Reset password ──────────────────────────────────────────────── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPw) { setError('Passwords do not match.'); return; }
    if (!pwStrong) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setIsLoading(true);
    try {
      await axios.post(`${BASE}/api/v1/auth/reset-password`, {
        email,
        otp,
        role: 'user',
        newPassword,
        confirmNewPassword: confirmPw,
        resetToken,
      });
      setSuccess('Password reset successfully! Redirecting to sign in…');
      setTimeout(() => navigate('/auth', { replace: true }), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ════════════════════════ STEP 1 ════════════════════════ */
  if (step === 1) return (
    <Shell>
      <ProgressBar/>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <div className="step-icon">
          <Mail size={30} color={BLUE}/>
        </div>
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:"1.35rem", color:NAVY, marginBottom:6 }}>
          Forgot Password?
        </h2>
        <p style={{ fontSize:13.5, color:GREY, lineHeight:1.5 }}>
          No worries! Enter your registered email and we'll send you a reset code.
        </p>
      </div>

      {error   && <div className="error-box"><AlertCircle size={15}/>{error}</div>}

      <form onSubmit={handleRequestOtp}>
        <div className="field-wrap">
          <label className="field-label">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            style={inputBase}
            onFocus={onFocus} onBlur={onBlur}
            required disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading || !email.trim()}>
          {isLoading
            ? <span className="spin-row"><span className="spinner"/>Sending code…</span>
            : 'Send Reset Code'}
        </button>
      </form>

      <p className="switch-row">
        Remember your password?{' '}
        <Link to="/auth" className="switch-link" style={{ color:BLUE, textDecoration:'none', fontWeight:600 }}>
          Sign In
        </Link>
      </p>
    </Shell>
  );

  /* ════════════════════════ STEP 2 ════════════════════════ */
  if (step === 2) return (
    <Shell>
      <ProgressBar/>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <div className="step-icon">
          <ShieldCheck size={30} color={BLUE}/>
        </div>
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:"1.35rem", color:NAVY, marginBottom:6 }}>
          Enter Reset Code
        </h2>
        <p style={{ fontSize:13.5, color:GREY, lineHeight:1.5 }}>
          We sent a 6-digit code to<br/>
          <strong style={{ color:NAVY }}>{email}</strong>
        </p>
      </div>

      {error   && <div className="error-box"><AlertCircle size={15}/>{error}</div>}
      {success && <div className="success-box">✓ {success}</div>}

      <form onSubmit={handleVerifyOtp}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="••••••"
          value={otp}
          onChange={e => { setOtp(e.target.value.replace(/\D/g,'').slice(0,6)); setError(''); }}
          className="otp-input"
          onFocus={onFocus} onBlur={onBlur}
          required
        />

        <button type="submit" className="submit-btn" disabled={isLoading || otp.length < 6}>
          {isLoading
            ? <span className="spin-row"><span className="spinner"/>Verifying…</span>
            : 'Verify Code'}
        </button>
      </form>

      <p className="switch-row" style={{ marginTop:14 }}>
        Didn't receive a code?{' '}
        <button onClick={handleResend} disabled={resending} className="switch-link">
          {resending ? 'Sending…' : 'Resend Code'}
        </button>
      </p>
      <p className="switch-row" style={{ marginTop:8 }}>
        <button onClick={() => { setStep(1); setOtp(''); setError(''); setSuccess(''); }}
          className="switch-link" style={{ color:GREY }}>
          ← Change email
        </button>
      </p>
    </Shell>
  );

  /* ════════════════════════ STEP 3 ════════════════════════ */
  return (
    <Shell>
      <ProgressBar/>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <div className="step-icon">
          <KeyRound size={30} color={BLUE}/>
        </div>
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:"1.35rem", color:NAVY, marginBottom:6 }}>
          Set New Password
        </h2>
        <p style={{ fontSize:13.5, color:GREY, lineHeight:1.5 }}>
          Choose a strong password for your account.
        </p>
      </div>

      {error   && <div className="error-box"><AlertCircle size={15}/>{error}</div>}
      {success && <div className="success-box">✓ {success}</div>}

      <form onSubmit={handleResetPassword}>
        <div className="field-wrap">
          <label className="field-label">New Password</label>
          <div className="pass-wrap">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={e => { setNewPassword(e.target.value); setError(''); }}
              style={{ ...inputBase, paddingRight:42 }}
              onFocus={onFocus} onBlur={onBlur}
              required disabled={isLoading} minLength={6}
              autoComplete="new-password"
            />
            <button type="button" className="eye-btn"
              onClick={() => setShowNew(p => !p)} tabIndex={-1}>
              {showNew ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {newPassword && (
            <p className={pwStrong ? 'hint-ok' : 'hint-err'}>
              {pwStrong ? '✓ Password length is good' : '✗ At least 6 characters required'}
            </p>
          )}
        </div>

        <div className="field-wrap">
          <label className="field-label">Confirm New Password</label>
          <div className="pass-wrap">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter new password"
              value={confirmPw}
              onChange={e => { setConfirmPw(e.target.value); setError(''); }}
              style={{
                ...inputBase, paddingRight:42,
                borderColor: confirmPw && !pwMatch ? '#dc2626' : BORDER,
              }}
              onFocus={e => {
                e.target.style.borderColor = confirmPw && !pwMatch ? '#dc2626' : BLUE;
                e.target.style.boxShadow   = confirmPw && !pwMatch
                  ? "0 0 0 3px rgba(220,38,38,0.12)" : "0 0 0 3px rgba(26,86,219,0.13)";
              }}
              onBlur={e => {
                e.target.style.borderColor = confirmPw && !pwMatch ? '#dc2626' : BORDER;
                e.target.style.boxShadow   = "none";
              }}
              required disabled={isLoading} minLength={6}
              autoComplete="new-password"
            />
            <button type="button" className="eye-btn"
              onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
              {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {confirmPw && (
            <p className={pwMatch ? 'hint-ok' : 'hint-err'}>
              {pwMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading || !pwStrong || !pwMatch || !confirmPw}
        >
          {isLoading
            ? <span className="spin-row"><span className="spinner"/>Resetting…</span>
            : 'Reset Password'}
        </button>
      </form>
    </Shell>
  );
};

export default ForgotPassword;