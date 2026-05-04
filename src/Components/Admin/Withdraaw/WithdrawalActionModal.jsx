// WithdrawalActionModal.jsx
// Renders a confirmation modal before any PATCH action on a withdrawal row.
// Usage: <WithdrawalActionModal action="approve" onConfirm={fn} onCancel={fn} />

const CONFIG = {
    approve: {
      title:    "Approve Withdrawal",
      desc:     "Are you sure you want to approve this withdrawal request? The agent will be notified.",
      btn:      "Yes, Approve",
      btnCls:   "bg-emerald-600 hover:bg-emerald-700 text-white",
      iconBg:   "bg-emerald-50",
      icon:     "✅",
    },
    decline: {
      title:    "Decline Withdrawal",
      desc:     "This action cannot be undone. The agent's request will be marked as declined.",
      btn:      "Yes, Decline",
      btnCls:   "bg-red-600 hover:bg-red-700 text-white",
      iconBg:   "bg-red-50",
      icon:     "❌",
    },
    "mark-paid": {
      title:    "Mark as Paid",
      desc:     "Confirm that the payout has been successfully disbursed to the agent.",
      btn:      "Mark Paid",
      btnCls:   "bg-[#1a56db] hover:bg-blue-700 text-white",
      iconBg:   "bg-blue-50",
      icon:     "💳",
    },
  };
  
  export default function WithdrawalActionModal({ action, loading = false, onConfirm, onCancel }) {
    if (!action) return null;
    const cfg = CONFIG[action];
    if (!cfg) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl ${cfg.iconBg} flex items-center justify-center text-3xl mb-4 mx-auto`}>
            {cfg.icon}
          </div>
  
          <h3 className="text-[15px] font-bold text-gray-900 text-center mb-1">
            {cfg.title}
          </h3>
          <p className="text-[13px] text-gray-500 text-center mb-6 leading-relaxed">
            {cfg.desc}
          </p>
  
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200
                         text-[13px] font-medium text-gray-600 hover:bg-gray-50
                         transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold
                          transition-colors disabled:opacity-60 ${cfg.btnCls}`}
            >
              {loading ? "Processing…" : cfg.btn}
            </button>
          </div>
        </div>
      </div>
    );
  }