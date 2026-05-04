import { useState } from "react";
import SettingsCard from "./SettingsCard";
import { useSettings } from "./Settingscontext";

const NOTIF_GROUPS = [
  {
    group: "Platform Activity",
    items: [
      { id: "new_user",      label: "New user registration",  desc: "Get notified when a new user signs up." },
      { id: "new_booking",   label: "New booking created",    desc: "Alert when a property inspection is booked." },
      { id: "new_property",  label: "New property listed",    desc: "Alert when an agent lists a new property." },
      { id: "new_agent",     label: "New agent registration", desc: "Get notified when an agent joins." },
    ],
  },
  {
    group: "Transactions",
    items: [
      { id: "transaction",   label: "Transaction completed",  desc: "Notify on every completed payment." },
      { id: "withdrawal",    label: "Withdrawal request",     desc: "Alert on new withdrawal requests." },
      { id: "refund",        label: "Refund issued",          desc: "Notify when a refund is processed." },
    ],
  },
  {
    group: "System",
    items: [
      { id: "system_alert",  label: "System alerts",          desc: "Critical system and security alerts." },
      { id: "weekly_report", label: "Weekly summary report",  desc: "Receive a weekly digest every Monday." },
    ],
  },
];

export default function NotificationSettings() {
  const { settings, updateSettings } = useSettings();
  const [saved, setSaved] = useState(false);

  // Local draft
  const [channel, setChannel] = useState({ ...settings.notifChannel });
  const [prefs,   setPrefs]   = useState({ ...settings.notifPrefs });

  const toggle        = (id) => setPrefs(p => ({ ...p, [id]: !p[id] }));
  const toggleChannel = (ch) => setChannel(p => ({ ...p, [ch]: !p[ch] }));

  const handleSave = () => {
    updateSettings({ notifChannel: channel, notifPrefs: prefs });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Channels */}
      <SettingsCard title="Notification Channels">
        <div className="flex flex-col gap-4">
          {[
            { key: "email", label: "Email Notifications",  desc: "Receive alerts via admin@nestfind.com" },
            { key: "sms",   label: "SMS Notifications",    desc: "Receive alerts on your registered phone" },
            { key: "push",  label: "In-App Notifications", desc: "Show alerts within the admin dashboard" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <Toggle on={channel[key]} onToggle={() => toggleChannel(key)} />
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Per-event toggles */}
      {NOTIF_GROUPS.map(({ group, items }) => (
        <SettingsCard key={group} title={group}>
          <div className="flex flex-col gap-4">
            {items.map(({ id, label, desc }) => (
              <div key={id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <Toggle on={prefs[id]} onToggle={() => toggle(id)} />
              </div>
            ))}
          </div>
        </SettingsCard>
      ))}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-xl hover:bg-[#1444b8] transition-colors"
        >
          Save Preferences
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Preferences saved</span>}
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${on ? "bg-[#1a56db]" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}