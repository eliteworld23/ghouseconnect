// WithdrawalTable.jsx
// Reusable table for both agent-view and admin-view withdrawal lists.
// Pass showActions=true on the admin view to render approve/decline/mark-paid buttons.

const fmtMoney = (val) => {
  if (val == null) return "—";
  return `₦${Number(val).toLocaleString("en-NG")}`;
};

const fmtDate = (val) => {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-NG", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return val; }
};

function StatusBadge({ status }) {
  const map = {
    pending:  "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-blue-50 text-blue-700 border-blue-200",
    paid:     "bg-emerald-50 text-emerald-700 border-emerald-200",
    declined: "bg-red-50 text-red-600 border-red-200",
  };
  const dot = {
    pending: "bg-amber-500", approved: "bg-blue-500",
    paid: "bg-emerald-500",  declined: "bg-red-500",
  };
  const key = status?.toLowerCase() ?? "";
  const cls = map[key] ?? "bg-gray-50 text-gray-500 border-gray-200";
  const d   = dot[key]  ?? "bg-gray-400";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${d}`} />
      {status ?? "unknown"}
    </span>
  );
}

function ActionButton({ label, colorCls, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border
                  transition-all disabled:opacity-40 disabled:cursor-not-allowed ${colorCls}`}
    >
      {label}
    </button>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 rounded-full bg-gray-100" style={{ width: `${55 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function WithdrawalTable({
  data,
  loading,
  error,
  meta,
  onPageChange,
  showActions = false,
  onAction,           // onAction(id, "approve" | "decline" | "mark-paid")
  actionLoading = {}, // { [id]: true }
}) {
  const { page, totalPages, total, limit } = meta;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  const BASE_COLS = ["Ref / ID", "Agent", "Bank Details", "Amount", "Status", "Date"];
  const COLS = showActions ? [...BASE_COLS, "Actions"] : BASE_COLS;
  const colCount = COLS.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {error && (
        <div className="flex items-center gap-2 px-5 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {COLS.map((col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading
              ? Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
                  <SkeletonRow key={i} cols={colCount} />
                ))
              : data.length === 0
              ? (
                <tr>
                  <td colSpan={colCount} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📭</span>
                      <p className="font-semibold text-gray-500">No withdrawal requests found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )
              : data.map((row, i) => {
                const id = row._id ?? row.id ?? i;
                const isPending  = row.status?.toLowerCase() === "pending";
                const isApproved = row.status?.toLowerCase() === "approved";
                const isActing   = !!actionLoading[id];

                return (
                  <tr key={id} className="hover:bg-blue-50/30 transition-colors group">

                    {/* Ref */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-white">
                        {String(row.reference ?? row.ref ?? row._id ?? "—").slice(0, 14)}…
                      </span>
                    </td>

                    {/* Agent */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold
                                        flex items-center justify-center flex-shrink-0">
                          {(
                            row.requester?.fullName ??
                            row.requester?.firstName ??
                            row.requester?.name ??
                            row.agent?.name ??
                            row.user?.name ??
                            "A"
                          )[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate max-w-[130px]">
                            {row.requester?.fullName ??
                             ((`${row.requester?.firstName ?? ""} ${row.requester?.lastName ?? ""}`).trim() || null) ??
                             row.requester?.name ??
                             row.agent?.name ??
                             row.user?.name ??
                             "—"}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[130px]">
                            {row.requester?.email ??
                             row.agent?.email ??
                             row.user?.email ??
                             ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Bank Details */}
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-gray-700">
                        {row.bankName ?? row.bank?.name ?? "—"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {row.accountNumber ?? row.bank?.accountNumber ?? ""}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 font-bold text-gray-800 tabular-nums">
                      {fmtMoney(row.amount)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {fmtDate(row.createdAt ?? row.date)}
                    </td>

                    {/* Actions (admin only) */}
                    {showActions && (
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isPending && (
                            <>
                              <ActionButton
                                label="Approve"
                                colorCls="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                onClick={() => onAction(id, "approve")}
                                disabled={isActing}
                              />
                              <ActionButton
                                label="Decline"
                                colorCls="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                onClick={() => onAction(id, "decline")}
                                disabled={isActing}
                              />
                            </>
                          )}
                          {isApproved && (
                            <ActionButton
                              label="Mark Paid"
                              colorCls="bg-blue-50 text-[#1a56db] border-blue-200 hover:bg-blue-100"
                              onClick={() => onAction(id, "mark-paid")}
                              disabled={isActing}
                            />
                          )}
                          {!isPending && !isApproved && (
                            <span className="text-xs text-gray-300 italic">—</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && data.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400 font-medium">
            Showing <span className="font-bold text-gray-600">{from}–{to}</span> of{" "}
            <span className="font-bold text-gray-600">
              {new Intl.NumberFormat("en-NG").format(total)}
            </span> requests
          </p>

          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center
                         text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-bold"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = totalPages <= 5 ? i + 1
                : page <= 3 ? i + 1
                : page >= totalPages - 2 ? totalPages - 4 + i
                : page - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all border
                    ${p === page
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center
                         text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-bold"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}