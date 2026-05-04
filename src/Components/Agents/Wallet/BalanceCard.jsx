import { WalletIcon, ArrowUpIcon, EyeIcon } from "./Icons";
import { fmt } from "./data";

export default function BalanceCard({ balance, showBalance, onToggleBalance, onWithdraw, totalEarned, totalWithdrawn }) {
  return (
    <div className="relative rounded-2xl p-8 overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(135deg, #0b1a2e 0%, #1a3a6b 50%, #1a56db 100%)" }}>

      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/[0.04]" />
      <div className="absolute -bottom-16 right-20 w-40 h-40 rounded-full bg-white/[0.04]" />
      <div className="absolute top-5 right-40 w-20 h-20 rounded-full bg-white/[0.06]" />

      <div className="relative z-10">
        {/* Label row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center text-blue-300">
              <WalletIcon />
            </div>
            <span className="text-xs text-white/65 font-medium tracking-widest uppercase">
              Available Balance
            </span>
          </div>
          <button
            onClick={onToggleBalance}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs cursor-pointer border-0 hover:bg-white/20 transition-colors"
          >
            <EyeIcon open={showBalance} />
            {showBalance ? "Hide" : "Show"}
          </button>
        </div>

        {/* Amount */}
        <div className="text-5xl font-extrabold text-white tracking-tight mb-6 leading-none font-poppins">
          {showBalance ? fmt(balance) : "₦ ••••••"}
        </div>

        {/* Stats row */}
        <div className="flex gap-8 mb-7">
          <div>
            <div className="text-[11px] text-white/50 mb-1 uppercase tracking-widest">Total Earned</div>
            <div className="text-base font-bold text-green-400">+{fmt(totalEarned)}</div>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <div className="text-[11px] text-white/50 mb-1 uppercase tracking-widest">Total Withdrawn</div>
            <div className="text-base font-bold text-red-400">-{fmt(totalWithdrawn)}</div>
          </div>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={onWithdraw}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-[#0b1a2e] text-sm font-bold border-0 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-150"
        >
          <ArrowUpIcon /> Withdraw Funds
        </button>
      </div>
    </div>
  );
}