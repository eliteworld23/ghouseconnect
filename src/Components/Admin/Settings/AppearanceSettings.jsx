import { useState } from "react";
import SettingsCard from "./SettingsCard";
import { useSettings } from "./Settingscontext";

const ACCENT_COLORS = [
  { name: "Blue",   value: "#1a56db" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Teal",   value: "#0d9488" },
  { name: "Green",  value: "#16a34a" },
  { name: "Orange", value: "#ea580c" },
];

const FONT_SIZES = ["Small", "Default", "Large"];

export default function AppearanceSettings() {
  const { settings, updateSettings } = useSettings();
  const [saved, setSaved] = useState(false);

  // Local draft state — only committed on Save
  const [draft, setDraft] = useState({
    theme:    settings.theme,
    accent:   settings.accent,
    fontSize: settings.fontSize,
    compact:  settings.compact,
  });

  const handleSave = () => {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Theme */}
      <SettingsCard title="Theme">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { val: "light", label: "Light", preview: "bg-white border-gray-200",      icon: "☀️", sub: "Default" },
            { val: "dark",  label: "Dark",  preview: "bg-[#0b1a2e] border-[#1e3a5f]", icon: "🌙", sub: "Easy on the eyes" },
          ].map(({ val, label, preview, icon, sub }) => (
            <button
              key={val}
              onClick={() => setDraft(d => ({ ...d, theme: val }))}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left
                ${draft.theme === val
                  ? "border-[#1a56db] bg-[#eff6ff]"
                  : "border-gray-200 bg-white hover:border-gray-300"
                }`}
            >
              <div className={`w-8 h-8 rounded-lg border ${preview} flex items-center justify-center text-base shrink-0`}>{icon}</div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${draft.theme === val ? "text-[#1a56db]" : "text-gray-700"}`}>{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
              {draft.theme === val && <span className="ml-auto text-[#1a56db] shrink-0">✓</span>}
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* Accent Color */}
      <SettingsCard title="Accent Color">
        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_COLORS.map(({ name, value }) => (
            <button
              key={value}
              onClick={() => setDraft(d => ({ ...d, accent: value }))}
              title={name}
              className={`w-9 h-9 rounded-full transition-transform ${draft.accent === value ? "scale-110 ring-2 ring-offset-2" : "hover:scale-105"}`}
              style={{ background: value, ringColor: value }}
            >
              {draft.accent === value && (
                <span className="flex items-center justify-center text-white text-sm font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Selected: <span className="font-medium text-gray-600">{ACCENT_COLORS.find(c => c.value === draft.accent)?.name}</span>
        </p>
      </SettingsCard>

      {/* Font Size */}
      <SettingsCard title="Font Size">
        <div className="flex gap-2 sm:gap-3">
          {FONT_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setDraft(d => ({ ...d, fontSize: size }))}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all
                ${draft.fontSize === size
                  ? "bg-[#1a56db] border-[#1a56db] text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* Layout */}
      <SettingsCard title="Layout">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-700">Compact Mode</p>
            <p className="text-xs text-gray-400 mt-0.5">Reduce spacing and padding across the dashboard.</p>
          </div>
          <button
            onClick={() => setDraft(d => ({ ...d, compact: !d.compact }))}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${draft.compact ? "bg-[#1a56db]" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${draft.compact ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </SettingsCard>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-xl hover:bg-[#1444b8] transition-colors"
        >
          Save Appearance
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Appearance saved</span>}
      </div>
    </div>
  );
}