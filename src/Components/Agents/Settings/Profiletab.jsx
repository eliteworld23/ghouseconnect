import { User, Mail, Phone, MapPin, ChevronRight, Save } from "lucide-react";
import SectionCard from "./Sectioncard";
import { inp, Lbl, Spinner } from "./Helpers";
import { NIGERIAN_STATES } from "./Nigeriastates";

export default function ProfileTab({ profile, setProfile, saving, onSave }) {
  return (
    <>
      <SectionCard
        title="Personal Information"
        subtitle="Update your name, contact details, and address"
        icon={User}
      >
        <div className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Lbl>First Name</Lbl>
              <input
                type="text"
                value={profile.firstName}
                onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                className={inp()}
                placeholder="First name"
                autoComplete="given-name"
              />
            </div>
            <div>
              <Lbl>Last Name</Lbl>
              <input
                type="text"
                value={profile.lastName}
                onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                className={inp()}
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Contact row */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Lbl>Email Address</Lbl>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  className={inp("pl-8")}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <Lbl>Phone Number</Lbl>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  className={inp("pl-8")}
                  placeholder="+234 800 000 0000"
                  autoComplete="tel"
                />
              </div>
            </div>
          </div>

          {/* Address row */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Lbl>Street Address</Lbl>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                  className={inp("pl-8")}
                  placeholder="123 Broad Street"
                  autoComplete="street-address"
                />
              </div>
            </div>
            <div>
              <Lbl>State</Lbl>
              <select
                value={profile.state}
                onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                className={inp(`appearance-none ${!profile.state ? "text-gray-400" : "text-gray-900"}`)}
              >
                <option value="" disabled>Select your state</option>
                {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Lbl>Bio / Property Preference</Lbl>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              placeholder="Tell agents what you're looking for…"
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all resize-none"
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onSave("Profile")}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 w-full xs:w-auto justify-center"
            >
              {saving ? <><Spinner /> Saving…</> : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Account type */}
      <SectionCard title="Account Type" subtitle="Your current account role on Nestfind" icon={User}>
        <div className="flex items-center justify-between py-1 gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900">User Account</div>
            <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Browse listings, book inspections, and track your transactions
            </div>
          </div>
          <span className="shrink-0 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full">Active</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-3">Want to list properties? Upgrade to an Agent account.</p>
          <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
            Upgrade to Agent <ChevronRight size={13} />
          </button>
        </div>
      </SectionCard>
    </>
  );
}