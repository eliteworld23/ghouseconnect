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
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50   text-amber-700   border-amber-200",
    failed:  "bg-red-50     text-red-600     border-red-200",
  };
  const cls = map[status?.toLowerCase()] ?? "bg-gray-50 text-gray-500 border-gray-200";
  const dot = {
    success: "bg-emerald-500",
    pending: "bg-amber-500",
    failed:  "bg-red-500",
  }[status?.toLowerCase()] ?? "bg-gray-400";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status ?? "unknown"}
    </span>
  );
}

function TypeBadge({ type }) {
  const map = {
    transaction: "bg-blue-50 text-blue-700",
    deposit:     "bg-violet-50 text-violet-700",
    transfer:    "bg-orange-50 text-orange-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${map[type?.toLowerCase()] ?? "bg-gray-50 text-gray-500"}`}>
      {type ?? "—"}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-3.5 rounded-full bg-gray-100" style={{ width: `${60 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function TransactionTable({ data, loading, error, meta, onPageChange }) {
  const { page, totalPages, total, limit } = meta;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  const COLS = ["Ref / ID", "User", "Type", "Amount", "Status", "User Type", "Date"];

  return (
    <>
      <style>{`
        .tx-table-wrap {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f3f4f6;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .tx-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .tx-scroll table { min-width: 680px; }

        /* Pagination */
        .tx-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding: 12px 16px;
          border-top: 1px solid #f3f4f6;
          background: rgba(249,250,251,0.5);
        }
        @media (min-width: 640px) { .tx-pagination { padding: 12px 20px; } }

        /* Hide page number buttons on very small screens — show only prev/next */
        .tx-page-nums { display: none; }
        @media (min-width: 420px) { .tx-page-nums { display: flex; gap: 4px; } }
      `}</style>

      <div className="tx-table-wrap">
        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "#fef2f2", borderBottom: "1px solid #fecaca", fontSize: 13, color: "#dc2626" }}>
            ⚠️ {error}
          </div>
        )}

        <div className="tx-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {COLS.map((col) => (
                  <th key={col} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? [...Array(limit > 10 ? 10 : limit)].map((_, i) => <SkeletonRow key={i} />)
                : data.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "56px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 36 }}>📭</span>
                          <p style={{ fontWeight: 600, color: "#6b7280", margin: 0 }}>No transactions found</p>
                          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : data.map((tx, i) => (
                    <tr key={tx._id ?? tx.id ?? i} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Ref */}
                      <td className="px-4 py-4">
                        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7280", background: "#f9fafb", padding: "3px 8px", borderRadius: 8, display: "inline-block" }}>
                          {(tx.reference ?? tx.ref ?? tx._id ?? "—").toString().slice(0, 14)}…
                        </span>
                      </td>

                      {/* User */}
                      <td className="px-4 py-4">
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {(
                              tx.user?.fullName ?? tx.user?.firstName ?? tx.user?.name ??
                              tx.requester?.fullName ?? tx.requester?.firstName ?? tx.userName ?? tx.email ?? "U"
                            )[0]?.toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontWeight: 600, color: "#1f2937", margin: 0, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>
                              {tx.user?.fullName ??
                               ((`${tx.user?.firstName ?? ""} ${tx.user?.lastName ?? ""}`).trim() || null) ??
                               tx.user?.name ??
                               tx.requester?.fullName ??
                               ((`${tx.requester?.firstName ?? ""} ${tx.requester?.lastName ?? ""}`).trim() || null) ??
                               tx.requester?.name ?? tx.userName ?? "—"}
                            </p>
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>
                              {tx.user?.email ?? tx.requester?.email ?? tx.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4"><TypeBadge type={tx.type} /></td>

                      {/* Amount */}
                      <td className="px-4 py-4" style={{ fontWeight: 700, color: "#1f2937", fontVariantNumeric: "tabular-nums" }}>
                        {fmtMoney(tx.amount)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4"><StatusBadge status={tx.status} /></td>

                      {/* User Type */}
                      <td className="px-4 py-4">
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", background: "#f3f4f6", padding: "3px 10px", borderRadius: 999, textTransform: "capitalize" }}>
                          {tx.userType ?? tx.user?.role ?? "—"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4" style={{ color: "#6b7280", fontSize: 12, whiteSpace: "nowrap" }}>
                        {fmtDate(tx.createdAt ?? tx.date)}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="tx-pagination">
            <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, margin: 0 }}>
              <span style={{ fontWeight: 700, color: "#374151" }}>{from}–{to}</span> of{" "}
              <span style={{ fontWeight: 700, color: "#374151" }}>{new Intl.NumberFormat("en-NG").format(total)}</span>
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: page <= 1 ? "not-allowed" : "pointer", opacity: page <= 1 ? 0.4 : 1, fontSize: 14, fontWeight: 700, color: "#374151" }}
              >‹</button>

              <div className="tx-page-nums">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1
                    : page <= 3 ? i + 1
                    : page >= totalPages - 2 ? totalPages - 4 + i
                    : page - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      style={{
                        width: 32, height: 32, borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        border: `1px solid ${p === page ? "#1a56db" : "#e5e7eb"}`,
                        background: p === page ? "#1a56db" : "#fff",
                        color: p === page ? "#fff" : "#374151",
                      }}
                    >{p}</button>
                  );
                })}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: page >= totalPages ? "not-allowed" : "pointer", opacity: page >= totalPages ? 0.4 : 1, fontSize: 14, fontWeight: 700, color: "#374151" }}
              >›</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}