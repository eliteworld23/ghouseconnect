import { Lock, Smartphone, Globe, Trash2, LogOut, RefreshCw } from "lucide-react";
import SectionCard from "./Sectioncard";
import Toggle from "./Toggle";
import { inp, Lbl, EyeBtn, Spinner } from "./Helpers";

export default function SecurityTab({
  passwords, setPasswords,
  showPw, setShowPw,
  saving, onSave,
  onShowToast, onConfirm,
}) {
  const passMatch = !passwords.confirm || passwords.newPw === passwords.confirm;

  return (
    <>
      {/* Change password */}
      <SectionCard
        title="Change Password"
        subtitle="Use a strong password of at least 6 characters"
        icon={Lock}
      >
        <div className="space-y-4">
          <div>
            <Lbl>Current Password</Lbl>
            <div className="relative">
              <input
                type={showPw.current ? "text" : "password"}
                value={passwords.current}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                className={inp("pr-10")}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
              <EyeBtn show={showPw.current} toggle={() => setShowPw(p => ({ ...p, current: !p.current }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Lbl>New Password</Lbl>
              <div className="relative">
                <input
                  type={showPw.newPw ? "text" : "password"}
                  value={passwords.newPw}
                  onChange={e => setPasswords(p => ({ ...p, newPw: e.target.value }))}
                  className={inp("pr-10")}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <EyeBtn show={showPw.newPw} toggle={() => setShowPw(p => ({ ...p, newPw: !p.newPw }))} />
              </div>
            </div>
            <div>
              <Lbl>Confirm New Password</Lbl>
              <div className="relative">
                <input
                  type={showPw.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className={inp(`pr-10 ${passwords.confirm && !passMatch ? "border-red-400 focus:border-red-400" : ""}`)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                />
                <EyeBtn show={showPw.confirm} toggle={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))} />
              </div>
              {passwords.confirm && (
                <p className={`text-xs mt-1 ${passMatch ? "text-green-600" : "text-red-500"}`}>
                  {passMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => onSave("Password")}
              disabled={saving || !passwords.current || !passwords.newPw || !passMatch}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 w-full xs:w-auto justify-center"
            >
              {saving ? <><Spinner /> Updating…</> : <><RefreshCw size={14} /> Update Password</>}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* 2FA */}
      <SectionCard
        title="Two-Factor Authentication"
        subtitle="Add an extra layer of security to your account"
        icon={Smartphone}
      >
        <div className="space-y-0">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">SMS Authentication</div>
              <div className="text-xs text-gray-400 mt-0.5">Receive a code via SMS each time you sign in</div>
            </div>
            <Toggle enabled={false} onChange={() => onShowToast("2FA setup coming soon!")} />
          </div>
          <div className="flex items-center justify-between gap-4 py-3 border-t border-gray-100">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">Authenticator App</div>
              <div className="text-xs text-gray-400 mt-0.5">Use Google Authenticator or similar app</div>
            </div>
            <Toggle enabled={false} onChange={() => onShowToast("Authenticator setup coming soon!")} />
          </div>
        </div>
      </SectionCard>

      {/* Sessions */}
      <SectionCard
        title="Active Sessions"
        subtitle="Devices currently signed into your account"
        icon={Globe}
      >
        {[
          { device: "Chrome on Windows", location: "Port Harcourt, Rivers", time: "Now · Current session", active: true },
          { device: "Safari on iPhone",  location: "Lagos, Lagos",           time: "2 days ago",            active: false },
        ].map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-3 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.active ? "bg-green-400" : "bg-gray-300"}`} />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{s.device}</div>
                <div className="text-xs text-gray-400 truncate">{s.location} · {s.time}</div>
              </div>
            </div>
            {s.active
              ? <span className="shrink-0 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">Active</span>
              : <button onClick={() => onShowToast("Session revoked.")} className="shrink-0 text-xs text-red-500 font-semibold hover:text-red-600 transition-colors py-1">Revoke</button>
            }
          </div>
        ))}
      </SectionCard>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 sm:p-5">
        <h3 className="font-bold text-red-700 text-sm mb-1">Danger Zone</h3>
        <p className="text-red-500 text-xs mb-4 leading-relaxed">These actions are irreversible. Please proceed with caution.</p>
        <div className="flex flex-col xs:flex-row flex-wrap gap-3">
          <button
            onClick={() => onConfirm({
              title:        "Delete Account",
              description:  "This will permanently delete your Nestfind account and all associated data. This action cannot be undone.",
              confirmLabel: "Delete Account",
              danger:       true,
              onConfirm:    () => onShowToast("Account scheduled for deletion.", "error"),
            })}
            className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
          >
            <Trash2 size={13} /> Delete Account
          </button>
          <button
            onClick={() => onConfirm({
              title:        "Sign Out All Devices",
              description:  "This will sign you out from all devices. You'll need to sign in again.",
              confirmLabel: "Sign Out All",
              danger:       false,
              onConfirm:    () => onShowToast("Signed out from all devices."),
            })}
            className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
          >
            <LogOut size={13} /> Sign Out All Devices
          </button>
        </div>
      </div>
    </>
  );
}