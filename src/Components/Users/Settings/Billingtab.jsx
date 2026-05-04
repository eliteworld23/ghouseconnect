import { CreditCard, Check, RefreshCw } from "lucide-react";
import SectionCard from "./Sectioncard";

const PLAN_FEATURES = [
  { label: "Browse & search listings",        included: true  },
  { label: "Book up to 3 inspections/month",  included: true  },
  { label: "Property comparison tool",        included: true  },
  { label: "Unlimited bookings",              included: false },
  { label: "Priority agent support",          included: false },
  { label: "Advanced analytics dashboard",    included: false },
];

export default function BillingTab() {
  return (
    <>
      <SectionCard title="Current Plan" subtitle="Your active Nestfind subscription" icon={CreditCard}>
        {/* Plan hero card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-5 text-white mb-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Active Plan</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">Free</span>
          </div>
          <div className="font-black text-xl sm:text-2xl mb-1">Basic User</div>
          <div className="text-blue-200 text-sm leading-relaxed">Browse listings, book inspections, compare properties</div>
        </div>

        {/* Features */}
        <div className="space-y-2.5 sm:space-y-3">
          {PLAN_FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
                ${f.included ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-300"}`}>
                <Check size={11} />
              </div>
              <span className={f.included ? "text-gray-700" : "text-gray-400"}>{f.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25">
            Upgrade to Premium
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Payment Methods" subtitle="Manage your saved payment details" icon={CreditCard}>
        <div className="text-center py-8 sm:py-10 text-gray-400">
          <CreditCard size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No payment methods saved</p>
          <p className="text-xs mt-1">Add a card to upgrade your plan or pay for services</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/25">
            Add Payment Method
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Transaction History" subtitle="Your recent payments on Nestfind" icon={RefreshCw}>
        <div className="text-center py-8 sm:py-10 text-gray-400">
          <RefreshCw size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No transactions yet</p>
          <p className="text-xs mt-1">Your payment history will appear here</p>
        </div>
      </SectionCard>
    </>
  );
}