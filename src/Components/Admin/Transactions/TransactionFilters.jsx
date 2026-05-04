export default function WithdrawFilters({ filters, onChange, total, loading }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const activeCount = [
    filters.status, filters.type, filters.userType,
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({ page: 1, limit: filters.limit ?? 10 });

  return (
    <>
      <style>{`
        .txf-wrap {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f3f4f6;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          padding: 14px 16px;
          margin-bottom: 20px;
        }
        .txf-inner {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }
        /* Each filter field */
        .txf-field {
          display: flex;
          align-items: center;
          gap: 6px;
          /* On very small screens, stretch full width */
          flex: 1 1 140px;
        }
        .txf-field select {
          flex: 1;
          font-size: 13px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 8px 10px;
          background: #f9fafb;
          color: #374151;
          font-weight: 500;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          min-width: 0;
        }
        .txf-field select:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .txf-label {
          font-size: 10px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        /* Spacer pushes clear/count to the right on wide screens */
        .txf-spacer { flex: 1 1 auto; min-width: 8px; }
        .txf-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="txf-wrap">
        <div className="txf-inner">

          {/* Status */}
          <div className="txf-field">
            <label className="txf-label">Status</label>
            <select
              value={filters.status ?? ""}
              onChange={(e) => handleChange("status", e.target.value || undefined)}
            >
              <option value="">All statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Type */}
          <div className="txf-field">
            <label className="txf-label">Type</label>
            <select
              value={filters.type ?? ""}
              onChange={(e) => handleChange("type", e.target.value || undefined)}
            >
              <option value="">All types</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="deposit">Deposit</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          {/* User Type */}
          <div className="txf-field">
            <label className="txf-label">User</label>
            <select
              value={filters.userType ?? ""}
              onChange={(e) => handleChange("userType", e.target.value || undefined)}
            >
              <option value="">All users</option>
              <option value="Agent">Agent</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Rows per page */}
          <div className="txf-field">
            <label className="txf-label">Rows</label>
            <select
              value={filters.limit ?? 10}
              onChange={(e) => handleChange("limit", Number(e.target.value))}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="txf-spacer" />

          {/* Actions */}
          <div className="txf-actions">
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 700, color: "#ef4444",
                  background: "#fef2f2", border: "1px solid #fecaca",
                  padding: "7px 12px", borderRadius: 10, cursor: "pointer",
                  transition: "background 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                ✕ Clear
                <span style={{ background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeCount}
                </span>
              </button>
            )}
            {!loading && (
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, background: "#f9fafb", border: "1px solid #f3f4f6", padding: "7px 12px", borderRadius: 10, whiteSpace: "nowrap" }}>
                {new Intl.NumberFormat("en-NG").format(total)} record{total !== 1 ? "s" : ""}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}