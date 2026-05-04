import { useState } from "react";
import { SettingsProvider } from "./Settingscontext";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import AppearanceSettings from "./AppearanceSettings";

const TABS = [
  { id: "profile",       label: "Profile",       icon: "👤" },
  { id: "security",      label: "Security",      icon: "🔐" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "appearance",    label: "Appearance",    icon: "🎨" },
];

function SettingsShell() {
  const [activeTab, setActiveTab] = useState("profile");
  const [menuOpen,  setMenuOpen]  = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "profile":       return <ProfileSettings />;
      case "security":      return <SecuritySettings />;
      case "notifications": return <NotificationSettings />;
      case "appearance":    return <AppearanceSettings />;
      default:              return <ProfileSettings />;
    }
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  const activeTabData = TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 sm:py-5">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0b1a2e] font-['Poppins',sans-serif]">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Manage your admin account and platform preferences
        </p>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-6 flex flex-col lg:flex-row gap-4 sm:gap-6">

        {/* Mobile dropdown */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700"
          >
            <span className="flex items-center gap-2">
              <span>{activeTabData?.icon}</span>
              {activeTabData?.label}
            </span>
            <span className={`text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}>▼</span>
          </button>
          {menuOpen && (
            <div className="mt-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-2 flex flex-col gap-1">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left
                      ${activeTab === tab.id
                        ? "bg-[#eff6ff] text-[#1a56db] border border-[#bfdbfe]"
                        : "text-gray-600 hover:bg-gray-50 border border-transparent"
                      }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a56db]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <div className="p-2 flex flex-col gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left
                    ${activeTab === tab.id
                      ? "bg-[#eff6ff] text-[#1a56db] border border-[#bfdbfe]"
                      : "text-gray-600 hover:bg-gray-50 border border-transparent"
                    }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a56db]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  return (
    <SettingsProvider>
      <SettingsShell />
    </SettingsProvider>
  );
}