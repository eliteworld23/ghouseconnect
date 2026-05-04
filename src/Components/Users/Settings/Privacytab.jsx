import { Eye, Shield, Save } from "lucide-react";
import SectionCard from "./Sectioncard";
import Toggle from "./Toggle";
import { Spinner } from "./Helpers";

export default function PrivacyTab({ privacy, setPrivacy, saving, onSave }) {
  const Row = ({ keyName, label, desc }) => (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</div>
      </div>
      <Toggle
        enabled={privacy[keyName]}
        onChange={v => setPrivacy(p => ({ ...p, [keyName]: v }))}
      />
    </div>
  );

  return (
    <>
      <SectionCard
        title="Profile Visibility"
        subtitle="Control who can see your information"
        icon={Eye}
      >
        <div className="divide-y divide-gray-100">
          <Row keyName="profileVisible" label="Public profile"     desc="Allow agents and other users to view your profile page" />
          <Row keyName="showPhone"      label="Show phone number"  desc="Display your phone number to verified agents" />
          <Row keyName="showEmail"      label="Show email address" desc="Allow agents to see your email for direct contact" />
        </div>
      </SectionCard>

      <SectionCard
        title="Data & Analytics"
        subtitle="Manage how your data is used on Nestfind"
        icon={Shield}
      >
        <Row keyName="dataSharing" label="Usage data sharing" desc="Help us improve Nestfind by sharing anonymized usage analytics" />
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="text-xs text-blue-600 font-semibold hover:underline">
            Download my data →
          </button>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          onClick={() => onSave("Privacy settings")}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 w-full xs:w-auto justify-center"
        >
          {saving ? <><Spinner /> Saving…</> : <><Save size={14} /> Save Settings</>}
        </button>
      </div>
    </>
  );
}