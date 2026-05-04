import { useTransactionStats } from "./UseTransations";

const fmtMoney = (val) => {
  if (val == null) return "—";
  return `₦${Number(val).toLocaleString("en-NG")}`;
};
const fmtNum = (val) => (val == null ? "—" : new Intl.NumberFormat("en-NG").format(val));

const CARDS_CONFIG = (stats) => [
  {
    label: "Total Transactions",
    value: fmtNum(stats?.total),
    icon:  "💳",
    color: "#1a56db",
    sub:   "All time records",
  },
  {
    label: "Total Volume",
    value: fmtMoney(stats?.totalAmount),
    icon:  "💰",
    color: "#059669",
    sub:   "Cumulative amount",
  },
  {
    label: "Successful",
    value: fmtNum(stats?.successful),
    icon:  "✅",
    color: "#7c3aed",
    sub:   "Completed payouts",
  },
  {
    label: "Agent Transactions",
    value: fmtNum(stats?.agentTx),
    icon:  "🛡️",
    color: "#d97706",
    sub:   "Agent-only activity",
  },
];

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f3f4f6" }} />
        <div style={{ width: 80, height: 10, borderRadius: 99, background: "#f3f4f6" }} />
      </div>
      <div style={{ width: 90, height: 28, borderRadius: 8, background: "#f3f4f6", marginBottom: 8 }} />
      <div style={{ width: 120, height: 10, borderRadius: 99, background: "#f3f4f6" }} />
    </div>
  );
}

export default function TransactionStats() {
  const { stats, loading } = useTransactionStats();

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tx-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (min-width: 900px) {
          .tx-stats-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      <div className="tx-stats-grid">
        {loading
          ? [0,1,2,3].map((i) => <SkeletonCard key={i} />)
          : CARDS_CONFIG(stats).map((card, i) => (
            <div
              key={card.label}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "16px 18px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                animationDelay: `${i * 80}ms`,
                animation: "fadeUp 0.4s ease both",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
            >
              {/* Top accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "16px 16px 0 0", background: `linear-gradient(90deg, ${card.color}, ${card.color}88)` }} />

              {/* Background circle decoration */}
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: card.color + "0a", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: card.color + "15", border: `1px solid ${card.color}25` }}>
                  {card.icon}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>
                  {card.label}
                </span>
              </div>

              <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, margin: "0 0 4px", color: "#0b1a2e", fontFamily: "Poppins, sans-serif", letterSpacing: "-0.5px" }}>
                {card.value}
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, margin: 0 }}>{card.sub}</p>
            </div>
          ))
        }
      </div>
    </>
  );
}