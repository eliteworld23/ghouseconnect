import { useState } from "react";
import SettingsCard from "./SettingsCard";
import { useSettings } from "./Settingscontext";

export default function ProfileSettings() {
  const { settings, updateSettings } = useSettings();
  const [form,  setForm]  = useState({ ...settings.profile });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    updateSettings({ profile: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Avatar */}
      <SettingsCard title="Profile Photo">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 rounded-full bg-[#0b1a2e] flex items-center justify-center text-white text-xl font-bold font-['Poppins',sans-serif] shrink-0">
            {form.firstName?.[0]}{form.lastName?.[0]}
          </div>
          <div>
            <button className="px-4 py-2 bg-[#1a56db] text-white text-sm font-semibold rounded-xl hover:bg-[#1444b8] transition-colors">
              Upload Photo
            </button>
            <p className="text-xs text-gray-400 mt-1.5">JPG, PNG up to 2MB</p>
          </div>
        </div>
      </SettingsCard>

      {/* Personal info */}
      <SettingsCard title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
          <Field label="Last Name"  name="lastName"  value={form.lastName}  onChange={handleChange} />
          <Field label="Email"      name="email"     value={form.email}     onChange={handleChange} type="email" />
          <Field label="Phone"      name="phone"     value={form.phone}     onChange={handleChange} />
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
          <input
            value={form.role} disabled
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
          />
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
          <textarea
            name="bio" value={form.bio} onChange={handleChange} rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a56db]/30 focus:border-[#1a56db] transition-all"
          />
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-xl hover:bg-[#1444b8] transition-colors"
          >
            Save Changes
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
              ✓ Saved successfully
            </span>
          )}
        </div>
      </SettingsCard>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <input
        name={name} type={type} value={value} onChange={onChange}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/30 focus:border-[#1a56db] transition-all"
      />
    </div>
  );
}