import { Mail, Smartphone, Bell, Save } from "lucide-react";
import SectionCard from "./Sectioncard";
import Toggle from "./Toggle";
import { Spinner } from "./Helpers";

export default function NotificationsTab({ notifications, setNotifications, saving, onSave }) {
  const Row = ({ keyName, label, desc }) => (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</div>
      </div>
      <Toggle
        enabled={notifications[keyName]}
        onChange={v => setNotifications(p => ({ ...p, [keyName]: v }))}
      />
    </div>
  );

  return (
    <>
      <SectionCard
        title="Email Notifications"
        subtitle="Control what emails Nestfind sends to you"
        icon={Mail}
      >
        <div className="divide-y divide-gray-100">
          <Row keyName="emailBookings"   label="Inspection bookings" desc="Confirmations, reminders, and updates about your booked inspections" />
          <Row keyName="emailMessages"   label="Agent messages"       desc="New messages from agents and responses to your enquiries" />
          <Row keyName="emailPromotions" label="Promotions & offers"  desc="Property deals, platform news, and special discounts" />
        </div>
      </SectionCard>

      <SectionCard
        title="SMS Notifications"
        subtitle="Text messages sent to your registered phone number"
        icon={Smartphone}
      >
        <div className="divide-y divide-gray-100">
          <Row keyName="smsBookings" label="Booking confirmations" desc="SMS alerts for inspection confirmations and reminders" />
          <Row keyName="smsMessages" label="Urgent messages"        desc="Critical updates and time-sensitive alerts via SMS" />
        </div>
      </SectionCard>

      <SectionCard
        title="Push Notifications"
        subtitle="In-app alerts on your browser or mobile"
        icon={Bell}
      >
        <Row keyName="pushAll" label="All push notifications" desc="Enable or disable all in-app push notifications at once" />
      </SectionCard>

      <div className="flex justify-end">
        <button
          onClick={() => onSave("Notification preferences")}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 w-full xs:w-auto justify-center"
        >
          {saving ? <><Spinner /> Saving…</> : <><Save size={14} /> Save Preferences</>}
        </button>
      </div>
    </>
  );
}