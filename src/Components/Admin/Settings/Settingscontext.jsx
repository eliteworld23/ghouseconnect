import { createContext, useContext, useState, useEffect, useCallback } from "react";

const defaultSettings = {
  // Profile
  profile: {
    firstName: "Admin",
    lastName: "User",
    email: "admin@nestfind.com",
    phone: "+234 800 000 0000",
    role: "superadmin",
    bio: "Platform administrator for Nestfind.",
  },
  // Security
  twoFA: false,
  // Notifications
  notifChannel: { email: true, sms: false, push: true },
  notifPrefs: {
    new_user: true, new_booking: true, new_property: true, new_agent: true,
    transaction: true, withdrawal: true, refund: true,
    system_alert: true, weekly_report: true,
  },
  // Appearance
  theme: "light",
  accent: "#1a56db",
  fontSize: "Default",
  compact: false,
};

const STORAGE_KEY = "nestfind_admin_settings";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadFromStorage);

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
  }, [settings]);

  const updateSettings = useCallback((patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}