import { useState } from "react";

import Toast from "./Toast";
import ConfirmModal from "./Confirmmodal";
import SettingsSidebar from "./Settingsidebar";
import ProfileTab from "./Profiletab";
import SecurityTab from "./Securitytab";
import NotificationsTab from "./Notificationtab";
import PrivacyTab from "./Privacytab";
import BillingTab from "./Billingtab";

// Pull real user data from localStorage if available
const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
};

export default function Setting() {
  const stored = getStoredUser();

  const [activeTab, setActiveTab]       = useState("profile");
  const [toast, setToast]               = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);

  /* ── Profile state — seed from localStorage ── */
  const [profile, setProfile] = useState({
    firstName: stored.firstName || stored.name?.split(" ")[0] || "User",
    lastName:  stored.lastName  || stored.name?.split(" ")[1] || "",
    email:     stored.email     || "",
    phone:     stored.phone     || "",
    address:   stored.address   || "",
    state:     stored.state     || "",
    bio:       stored.bio       || "",
    userType:  stored.userType  || "user",
  });

  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw]       = useState({ current: false, newPw: false, confirm: false });

  const [notifications, setNotifications] = useState({
    emailBookings:   true,
    emailMessages:   true,
    emailPromotions: false,
    smsBookings:     true,
    smsMessages:     false,
    pushAll:         true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showPhone:      false,
    showEmail:      true,
    dataSharing:    false,
  });

  /* ── Helpers ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (section) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    showToast(`${section} updated successfully!`);
  };

  const openConfirm = (opts) => {
    setConfirmModal({
      ...opts,
      onConfirm: () => { setConfirmModal(null); opts.onConfirm(); },
    });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setDrawerOpen(false);
  };

  const user = {
    name:   [profile.firstName, profile.lastName].filter(Boolean).join(" "),
    email:  profile.email,
    avatar: stored.avatar || `https://i.pravatar.cc/80?img=21`,
  };

  return (
    /*
     * This component sits INSIDE the app layout (UserLayout or SettingsLayout in App.jsx).
     * The parent already handles the sidebar nav and the ml-[260px] offset.
     * Settings only manages its own inner content area.
     */
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirm modal */}
      {confirmModal && (
        <ConfirmModal {...confirmModal} onClose={() => setConfirmModal(null)} />
      )}

      {/* Settings-internal drawer backdrop (mobile only) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[35] bg-black/40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── PAGE CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-24 md:pb-10">

        {/* Page header + mobile tab-panel trigger */}
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div>
            <div className="text-blue-500 font-semibold text-xs uppercase tracking-wider mb-1">Account</div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Settings</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your profile, security, and preferences</p>
          </div>
          {/* Mobile: open the settings sub-panel drawer */}
          <button
            className="md:hidden mt-1 flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-2 rounded-xl shadow-sm"
            onClick={() => setDrawerOpen(true)}
          >
            <span>Menu</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div className="flex gap-5 lg:gap-6 items-start">

          {/* ── SETTINGS SUB-PANEL — drawer on mobile, static column on md+ ── */}
          <aside
            className={`
              fixed top-0 left-0 h-full z-[36] w-[260px] overflow-y-auto pt-4 bg-transparent
              transform transition-transform duration-300 ease-in-out
              md:static md:h-auto md:w-56 md:shrink-0 md:transform-none md:transition-none md:pt-0
              ${drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <SettingsSidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              user={user}
              onSignOut={() => {
                setDrawerOpen(false);
                openConfirm({
                  title:        "Sign Out",
                  description:  "You'll be signed out of your Nestfind account. You can sign back in any time.",
                  confirmLabel: "Sign Out",
                  onConfirm: () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("nestfind_user");
                    window.location.href = "/";
                  },
                });
              }}
            />
          </aside>

          {/* ── TAB CONTENT ── */}
          <main className="flex-1 min-w-0 w-full space-y-4 sm:space-y-5">
            {activeTab === "profile" && (
              <ProfileTab profile={profile} setProfile={setProfile} saving={saving} onSave={handleSave} />
            )}
            {activeTab === "security" && (
              <SecurityTab
                passwords={passwords} setPasswords={setPasswords}
                showPw={showPw} setShowPw={setShowPw}
                saving={saving} onSave={handleSave}
                onShowToast={showToast} onConfirm={openConfirm}
              />
            )}
            {activeTab === "notifications" && (
              <NotificationsTab
                notifications={notifications} setNotifications={setNotifications}
                saving={saving} onSave={handleSave}
              />
            )}
            {activeTab === "privacy" && (
              <PrivacyTab privacy={privacy} setPrivacy={setPrivacy} saving={saving} onSave={handleSave} />
            )}
            {activeTab === "billing" && <BillingTab />}
          </main>
        </div>
      </div>

      {/* ── MOBILE BOTTOM SETTINGS TAB BAR ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
        <div className="flex items-center justify-around px-1 pt-1 pb-2">
          {[
            { key: "profile",       label: "Profile",  emoji: "👤" },
            { key: "security",      label: "Security", emoji: "🔒" },
            { key: "notifications", label: "Alerts",   emoji: "🔔" },
            { key: "privacy",       label: "Privacy",  emoji: "🛡️" },
            { key: "billing",       label: "Billing",  emoji: "💳" },
          ].map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all
                ${activeTab === key ? "text-blue-600" : "text-gray-400"}`}
            >
              <span className="text-xl leading-none">{emoji}</span>
              <span className={`text-[10px] font-semibold ${activeTab === key ? "text-blue-600" : "text-gray-400"}`}>
                {label}
              </span>
              {activeTab === key && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}