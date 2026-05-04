import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, Pencil, X, ChevronRight, Lock } from "lucide-react";
import SectionCard from "./Sectioncard";
import { inp, Lbl, Spinner } from "./Helpers";
import { NIGERIAN_STATES } from "./Nigeriastates";

/* Always read-only field */
const ReadField = ({ label, value, icon: Icon, locked = false }) => (
  <div>
    {label && (
      <div className="flex items-center gap-1 mb-1">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        {locked && (
          <span className="flex items-center gap-0.5 text-[10px] text-gray-300 font-medium">
            <Lock size={9} /> locked
          </span>
        )}
      </div>
    )}
    <div className="relative">
      {Icon && (
        <Icon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
        />
      )}
      <div
        className={`w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 select-none ${Icon ? "pl-8" : ""}`}
      >
        {value || <span className="italic text-gray-300">—</span>}
      </div>
    </div>
  </div>
);

export default function ProfileTab({ profile, setProfile, saving, onSave }) {
  const [editing, setEditing]   = useState(false);
  const [snapshot, setSnapshot] = useState(null); // stores values before editing begins

  const handleEdit = () => {
    // Save a snapshot of current values so Cancel can restore them
    setSnapshot({ ...profile });
    setEditing(true);
  };

  const handleCancel = () => {
    // Restore the snapshot (undo any unsaved changes)
    if (snapshot) setProfile(snapshot);
    setSnapshot(null);
    setEditing(false);
  };

  const handleSave = async () => {
    await onSave("Profile");
    setSnapshot(null);
    setEditing(false);
  };

  return (
    <>
      <SectionCard
        title="Personal Information"
        subtitle="Your name, contact details, and address"
        icon={User}
      >
        {/* Action bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-gray-400">
            {editing
              ? "Make your changes below, then save."
              : "Click Edit to update your address and bio."}
          </p>
          {!editing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/25"
            >
              <Pencil size={12} /> Edit
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <X size={12} /> Cancel
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Row 1: Full Name (always locked) + Email (always locked) */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <ReadField
              label="Full Name"
              value={[profile.firstName, profile.lastName].filter(Boolean).join(" ")}
              icon={User}
              locked
            />
            <ReadField
              label="Email Address"
              value={profile.email}
              icon={Mail}
              locked
            />
          </div>

          {/* Row 2: Phone (always locked) + State (editable in edit mode) */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <ReadField
              label="Phone Number"
              value={profile.phone}
              icon={Phone}
              locked
            />
            <div>
              <Lbl>State</Lbl>
              {editing ? (
                <select
                  value={profile.state}
                  onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                  className={inp(`appearance-none ${!profile.state ? "text-gray-400" : "text-gray-900"}`)}
                >
                  <option value="" disabled>Select your state</option>
                  {NIGERIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <ReadField value={profile.state || "Not set"} />
              )}
            </div>
          </div>

          {/* Row 3: Street Address (editable in edit mode) */}
          <div>
            <Lbl>Street Address</Lbl>
            {editing ? (
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                  className={inp("pl-8")}
                  placeholder="123 Broad Street"
                  autoComplete="street-address"
                />
              </div>
            ) : (
              <ReadField value={profile.address || "Not set"} icon={MapPin} />
            )}
          </div>

          {/* Bio (editable in edit mode) */}
          <div>
            <Lbl>Bio / Property Preference</Lbl>
            {editing ? (
              <textarea
                rows={3}
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                placeholder="Tell agents what you're looking for…"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all resize-none"
              />
            ) : (
              <div className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 min-h-[72px]">
                {profile.bio || <span className="italic text-gray-300">No bio added yet</span>}
              </div>
            )}
          </div>

          {/* Save button — only shown in edit mode */}
          {editing && (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 w-full xs:w-auto justify-center"
              >
                {saving ? <><Spinner /> Saving…</> : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Account type */}
      <SectionCard title="Account Type" subtitle="Your current account role on Nestfind" icon={User}>
        <div className="flex items-center justify-between py-1 gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 capitalize">
              {profile.userType || "User"} Account
            </div>
            <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Browse listings, book inspections, and track your transactions
            </div>
          </div>
          <span className="shrink-0 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full">
            Active
          </span>
        </div>
        {profile.userType !== "agent" && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3">
              Want to list properties? Upgrade to an Agent account.
            </p>
            <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              Upgrade to Agent <ChevronRight size={13} />
            </button>
          </div>
        )}
      </SectionCard>
    </>
  );
}