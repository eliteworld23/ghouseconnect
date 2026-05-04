import { useState } from "react";
import { LogOut, AlertCircle } from "lucide-react";

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

export default function LogoutModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("nestfind_user");
      await new Promise((r) => setTimeout(r, 600));
      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .nf-logout-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 22, 40, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: nf-fade-in 0.18s ease both;
        }

        /* Mobile: bottom sheet */
        .nf-logout-card {
          background: #fff;
          width: 100%;
          max-width: 100%;
          border-radius: 24px 24px 0 0;
          overflow: hidden;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
          animation: nf-slide-up 0.28s cubic-bezier(0.34,1.3,0.64,1) both;
        }

        /* Drag handle — visible on mobile only */
        .nf-logout-handle {
          display: flex;
          justify-content: center;
          padding: 12px 0 4px;
        }
        .nf-logout-handle span {
          width: 40px;
          height: 4px;
          border-radius: 99px;
          background: #e5e7eb;
        }

        /* Desktop: centered dialog */
        @media (min-width: 480px) {
          .nf-logout-backdrop {
            align-items: center;
            padding: 16px;
          }
          .nf-logout-card {
            max-width: 400px;
            border-radius: 20px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.22);
            animation: nf-pop-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
          }
          .nf-logout-handle { display: none; }
        }

        /* Body padding */
        .nf-logout-body {
          padding: 8px 20px 36px;
        }
        @media (min-width: 480px) {
          .nf-logout-body { padding: 24px 28px 28px; }
        }

        /* Icon */
        .nf-logout-icon-wrap {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: rgba(239,68,68,0.10);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        @media (min-width: 480px) {
          .nf-logout-icon-wrap { width: 68px; height: 68px; margin-bottom: 20px; }
        }

        /* Title */
        .nf-logout-title {
          text-align: center;
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          color: #0b1a2e;
          margin: 0 0 8px;
          font-size: 18px;
        }
        @media (min-width: 480px) { .nf-logout-title { font-size: 20px; } }

        /* Description */
        .nf-logout-desc {
          text-align: center;
          color: #6b7280;
          font-size: 13px;
          line-height: 1.65;
          margin: 0 0 20px;
        }
        @media (min-width: 480px) {
          .nf-logout-desc { font-size: 14px; margin-bottom: 24px; }
        }

        /* Buttons */
        .nf-logout-actions { display: flex; flex-direction: column; gap: 10px; }

        .nf-btn-confirm {
          width: 100%; padding: 14px; border-radius: 14px; border: none;
          font-weight: 700; font-size: 14px; color: #fff; cursor: pointer;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 4px 14px rgba(239,68,68,0.30);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: filter 0.15s, opacity 0.15s;
        }
        .nf-btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
        .nf-btn-confirm:not(:disabled):hover { filter: brightness(1.08); }

        .nf-btn-cancel {
          width: 100%; padding: 14px; border-radius: 14px;
          border: 1.5px solid #e5e7eb; font-weight: 600; font-size: 14px;
          color: #374151; background: #f9fafb; cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .nf-btn-cancel:not(:disabled):hover { background: #f3f4f6; border-color: #d1d5db; }
        .nf-btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

        .nf-logout-note {
          text-align: center; font-size: 11.5px;
          color: #9ca3af; margin-top: 14px;
        }

        /* Animations */
        @keyframes nf-fade-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes nf-slide-up {
          from { transform: translateY(100%); } to { transform: translateY(0); }
        }
        @keyframes nf-pop-in {
          from { opacity: 0; transform: scale(0.90) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>

      <div
        className="nf-logout-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
      >
        <div className="nf-logout-card">

          {/* Gradient accent bar */}
          <div style={{
            height: 4, width: "100%",
            background: "linear-gradient(90deg,#1a56db 0%,#60a5fa 40%,#3b82f6 70%,#1a56db 100%)",
          }} />

          {/* Drag handle (mobile only) */}
          <div className="nf-logout-handle"><span /></div>

          <div className="nf-logout-body">

            {/* Icon */}
            <div className="nf-logout-icon-wrap">
              <LogOut size={26} color="#ef4444" strokeWidth={1.8} />
            </div>

            {/* Heading */}
            <h2 className="nf-logout-title">Sign Out</h2>
            <p className="nf-logout-desc">
              Are you sure you want to sign out of your{" "}
              <strong style={{ color: "#0b1a2e" }}>Nestfind</strong> account?
              You'll need to sign in again to access your dashboard.
            </p>

            {/* Error */}
            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 12, padding: "10px 14px", color: "#dc2626",
                fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="nf-logout-actions">
              <button className="nf-btn-confirm" onClick={handleLogout} disabled={loading}>
                {loading
                  ? <><Spinner /> Signing out…</>
                  : <><LogOut size={15} strokeWidth={2.2} /> Yes, Sign Me Out</>
                }
              </button>
              <button className="nf-btn-cancel" onClick={onClose} disabled={loading}>
                Cancel
              </button>
            </div>

            <p className="nf-logout-note">
              Your data is safe — signing out won't delete anything.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}