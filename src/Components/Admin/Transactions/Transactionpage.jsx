import { useState } from "react";
import TransactionStats from "./TransactionStats";
import TransactionFilters from "./TransactionFilters";
import TransactionTable   from "./TransactionTable";
import { useTransactions } from "./UseTransations"; 

export default function TransactionPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });

  const { data, loading, error, meta } = useTransactions(filters);

  const handlePageChange = (newPage) =>
    setFilters((prev) => ({ ...prev, page: newPage }));

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');
      `}</style>

      <div
        style={{ fontFamily: "system-ui, sans-serif" }}
        className="flex flex-col h-full w-full max-w-[1100px] mx-auto
                   px-4 sm:px-6 lg:px-8 py-6 box-border overflow-y-auto"
      >
        {/* ── Page header ── */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-sm">
              💳
            </div>
            <div>
              <h1
                className="text-2xl font-extrabold leading-tight tracking-tight"
                style={{ color: "#0b1a2e", fontFamily: "Poppins, sans-serif" }}
              >
                Transactions
              </h1>
              <p className="text-sm text-gray-400 font-medium">
                Manage withdrawal requests and transactions.
              </p>
            </div>
          </div>
        </div>

        {/* ── Summary stat cards ── */}
        <TransactionStats />

        {/* ── Filter bar ── */}
        <TransactionFilters
          filters={filters}
          onChange={handleFilterChange}
          total={meta.total}
          loading={loading}
        />

        {/* ── Transactions table ── */}
        <TransactionTable
          data={data}
          loading={loading}
          error={error}
          meta={meta}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}