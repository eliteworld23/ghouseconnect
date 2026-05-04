import { useState, useEffect, useCallback } from "react";
import BalanceCard from "./BalanceCard";
import TransactionList from "./TransactionList";
import WithdrawModal from "./WithdrawModal";
import { fmt } from "./data";

const _raw    = import.meta.env?.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";
const API_BASE = _raw.replace(/\/api\/?$/, "").replace(/\/$/, "");

function useWallet() {
  const [wallet,       setWallet]       = useState({ availableBalance: 0, escrowBalance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

      // Fetch wallet balance and transactions in parallel
      const [walletRes, txRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/wallet`, { headers }),
        fetch(`${API_BASE}/api/v1/payment/transactions`, { headers }),
      ]);

      if (!walletRes.ok) throw new Error(`Wallet fetch failed (${walletRes.status})`);

      const walletJson = await walletRes.json();
      const d = walletJson.data || {};
      setWallet({
        availableBalance: d.availableBalance ?? d.balance ?? 0,
        escrowBalance:    d.escrowBalance    ?? d.escrow  ?? 0,
      });

      // Transactions — gracefully handle failure without breaking the page
      if (txRes.ok) {
        const txJson = await txRes.json();
        // Support both shapes: { data: [...] } or { data: { transactions: [...] } }
        const raw = Array.isArray(txJson.data)
          ? txJson.data
          : txJson.data?.transactions || txJson.data?.history || [];

        // Types that represent money coming IN to the agent
        const creditTypes = ["escrow_release"];
        const typeLabel = (type) => {
          switch (type) {
            case "bookingfee":     return "Booking Fee";
            case "escrow_hold":    return "Escrow Hold";
            case "escrow_release": return "Escrow Release";
            case "commission":     return "Commission";
            case "withdrawal":     return "Withdrawal";
            default:               return type || "Transaction";
          }
        };

        setTransactions(
          raw.map((t, i) => ({
            id:        t._id || t.id || i,
            type:      creditTypes.includes(t.type) ? "credit" : "debit",
            label:     t.description || t.label || t.narration || typeLabel(t.type),
            amount:    Math.abs(t.amount || 0),
            reference: t.reference || t.transactionNumber || null,
            date:      t.createdAt
              ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                })
              : t.date || "",
            status: t.status || "pending",
          }))
        );
      } else {
        setTransactions([]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);
  return { wallet, transactions, loading, error, refetch: fetchWallet };
}

export default function WalletPage() {
  const { wallet, transactions, loading, error, refetch } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [showModal,   setShowModal]   = useState(false);

  const totalEarned    = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = transactions.filter(t => t.type === "debit" ).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-8 min-h-screen bg-gray-50 font-sans">

      {/* Page title */}
      <div className="mb-7 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1a2e] m-0">Wallet</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your earnings and withdrawals</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <div className="w-9 h-9 border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading wallet…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
          <button onClick={refetch} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {wallet.escrowBalance > 0 && (
            <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5">
              <span className="text-xl">🔒</span>
              <div>
                <p className="text-sm font-bold text-amber-800">Funds in Escrow</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  <strong>{fmt(wallet.escrowBalance)}</strong> is held in escrow pending inspection confirmation.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-6 items-start flex-wrap lg:flex-nowrap">
            {/* Left — balance card */}
            <div className="w-full lg:w-[420px] flex-shrink-0">
              <BalanceCard
                balance={wallet.availableBalance}
                showBalance={showBalance}
                onToggleBalance={() => setShowBalance(p => !p)}
                onWithdraw={() => setShowModal(true)}
                totalEarned={totalEarned}
                totalWithdrawn={totalWithdrawn}
              />

              {/* Escrow mini-card */}
              <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 grid place-items-center text-xl">🔒</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Escrow Balance</p>
                    <p className="text-lg font-extrabold text-[#0b1a2e]" style={{ fontFamily: "Poppins,sans-serif" }}>
                      {showBalance ? fmt(wallet.escrowBalance) : "₦ ••••••"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">HELD</span>
              </div>
            </div>

            {/* Right — transaction history */}
            <div className="flex-1 min-w-0 w-full">
              {transactions.length > 0 ? (
                <TransactionList transactions={transactions} />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm font-semibold text-gray-500">No transactions yet</p>
                  <p className="text-xs text-gray-400 mt-1">Your transaction history will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showModal && (
        <WithdrawModal
          balance={wallet.availableBalance}
          onClose={() => { setShowModal(false); refetch(); }}
        />
      )}
    </div>
  );
}