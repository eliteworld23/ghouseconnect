import { User, Lock, Bell, Shield, CreditCard, ChevronRight, LogOut, Camera, X } from "lucide-react";

export const TABS = [
  { key: "profile",       label: "Profile",       icon: User },
  { key: "security",      label: "Security",      icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "privacy",       label: "Privacy",       icon: Shield },
  { key: "billing",       label: "Billing",       icon: CreditCard },
];

export default function SettingsSidebar({ activeTab, setActiveTab, onSignOut, user }) {
  return (
    <div className="h-full md:h-auto">
      <div className="bg-white rounded-none md:rounded-2xl border-0 md:border border-gray-100 shadow-none md:shadow-sm overflow-hidden h-full md:h-auto">

        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 md:hidden">
          <span className="font-bold text-gray-900 text-sm">Settings Menu</span>
          <button
            onClick={() => setActiveTab(activeTab)} // triggers parent close via handleTabChange
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Avatar block */}
        <div className="px-5 py-5 sm:py-6 border-b border-gray-100 flex flex-col items-center text-center">
          <div className="relative mb-3">
            <img
              src={user?.avatar || "https://i.pravatar.cc/80?img=21"}
              alt="avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-100"
            />
            <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div className="font-bold text-gray-900 text-sm">{user?.name || "User"}</div>
          <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{user?.email || ""}</div>
          <span className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            <User size={10} /> User Account
          </span>
        </div>

        {/* Nav */}
        <nav className="p-2">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5
                ${activeTab === key
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {activeTab !== key && <ChevronRight size={13} className="text-gray-300" />}
            </button>
          ))}

          <div className="my-2 border-t border-gray-100" />

          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={15} className="shrink-0" />
            Sign Out
          </button>
        </nav>
      </div>
    </div>
  );
}