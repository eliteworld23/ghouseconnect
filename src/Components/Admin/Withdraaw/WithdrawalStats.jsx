import { useWithdrawalStats } from "./UseWithdrawal";

const fmtMoney = (val) => {
  if (val == null) return "—";
  return `₦${Number(val).toLocaleString("en-NG")}`;
};
const fmtNum = (val) => (val == null ? "—" : new Intl.NumberFormat("en-NG").format(val));

const CARDS_CONFIG = (stats) => [
  {
    label: "Total Requests",
    value: fmtNum(stats?.total),
    icon:  "📋",
    color: "#1a56db",
    sub:   "All withdrawal requests",
  },
  {
    label: "Total Volume",
    value: fmtMoney(stats?.totalAmount),
    icon:  "💰",
    color: "#059669",
    sub:   "Cumulative amount",
  },
  {
    label: "Pending",
    value: fmtNum(stats?.pending),
    icon:  "⏳",
    color: "#d97706",
    sub:   "Awaiting review",
  },
  {
    label: "Paid Out",
    value: fmtNum(stats?.paid),
    icon:  "✅",
    color: "#7c3aed",
    sub:   "Successfully disbursed",
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gray-100" />
        <div className="w-20 h-3 rounded bg-gray-100" />
      </div>
      <div className="w-24 h-8 rounded-lg bg-gray-100 mb-2" />
      <div className="w-32 h-3 rounded bg-gray-100" />
    </div>
  );
}

export default function WithdrawalStats() {
  const { stats, loading } = useWithdrawalStats();

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {CARDS_CONFIG(stats).map((card, i) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                     hover:-translate-y-1 hover:shadow-md transition-all duration-200
                     relative overflow-hidden"
          style={{ animation: `fadeUp 0.4s ease both`, animationDelay: `${i * 80}ms` }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}88)` }}
          />

          {/* Bg circle */}
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: card.color + "0a" }}
          />

          <div className="flex items-center justify-between mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border"
              style={{ background: card.color + "15", borderColor: card.color + "25" }}
            >
              {card.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {card.label}
            </span>
          </div>

          <p
            className="text-3xl font-extrabold leading-none mb-1 tracking-tight"
            style={{ color: "#0b1a2e", fontFamily: "Poppins, sans-serif" }}
          >
            {card.value}
          </p>
          <p className="text-xs text-gray-400 font-medium">{card.sub}</p>
        </div>
      ))}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}