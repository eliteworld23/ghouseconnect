// WithdrawPage.jsx  — Drop-in replacement for your "withdraw" page in PageContent.jsx
//
// Tabs:
//  1. Agent Requests     GET /withdrawal                (agent's own)
//  2. Admin View         GET /withdrawal/admin          (all agents, with approve/decline/mark-paid)
//  3. Commission Payout  POST /withdrawal/admin/commission

import { useState } from "react";
import WithdrawalStats       from "./WithdrawalStats";
import WithdrawalFilters     from "./WithdrawalFilters";
import WithdrawalTable       from "./WithdrawalTable";
import WithdrawalActionModal from "./WithdrawalActionModal";
import CommissionWithdrawalForm from "./CommissionWithdrawalForm";
import {
  useAgentWithdrawals,
  useAdminWithdrawals,
  approveWithdrawal,
  declineWithdrawal,
  markWithdrawalPaid,
} from "./UseWithdrawal";

/* ── Tab definitions ─────────────────────────── */
const TABS = [
  {
    id:     "agent-requests",
    label:  "Agent Requests",
    method: "GET",
    desc:   "All withdrawal requests made by agents",
  },
  {
    id:     "admin-view",
    label:  "Admin View",
    method: "GET",
    desc:   "Review and act on agent withdrawal requests",
  },
  {
    id:     "commission",
    label:  "Commission Payout",
    method: "POST",
    desc:   "Withdraw admin commission funds",
  },
];

const METHOD_BADGE = {
  GET:   { bg: "#dcfce7", text: "#15803d" },
  PATCH: { bg: "#fef9c3", text: "#a16207" },
  POST:  { bg: "#dbeafe", text: "#1d4ed8" },
};

/* ── Tab bar ─────────────────────────────────── */
function TabBar({ activeTab, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: "none" }}>
      {TABS.map((tab) => {
        const badge    = METHOD_BADGE[tab.method];
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={[
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border whitespace-nowrap",
              "text-[13px] font-medium transition-all duration-200 flex-shrink-0",
              isActive
                ? "bg-[#1a56db] text-white border-[#1a56db] shadow-md shadow-blue-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Agent Requests tab ──────────────────────── */
function AgentRequestsTab() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const { data, loading, error, meta, refetch } = useAgentWithdrawals(filters);

  return (
    <>
      <WithdrawalFilters
        filters={filters}
        onChange={setFilters}
        total={meta.total}
        loading={loading}
      />
      <WithdrawalTable
        data={data}
        loading={loading}
        error={error}
        meta={meta}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        showActions={false}
      />
    </>
  );
}

/* ── Admin View tab (with approve/decline/mark-paid) ── */
function AdminViewTab() {
  const [filters, setFilters]       = useState({ page: 1, limit: 10 });
  const { data, loading, error, meta, refetch } = useAdminWithdrawals(filters);

  // Modal state
  const [modal, setModal]           = useState(null); // { id, action }
  const [actionLoading, setActing]  = useState({});

  const handleAction = (id, action) => setModal({ id, action });

  const handleConfirm = async () => {
    if (!modal) return;
    const { id, action } = modal;
    setActing((prev) => ({ ...prev, [id]: true }));
    setModal(null);
    try {
      if (action === "approve")   await approveWithdrawal(id);
      if (action === "decline")   await declineWithdrawal(id);
      if (action === "mark-paid") await markWithdrawalPaid(id);
      await refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setActing((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      <WithdrawalFilters
        filters={filters}
        onChange={setFilters}
        total={meta.total}
        loading={loading}
      />
      <WithdrawalTable
        data={data}
        loading={loading}
        error={error}
        meta={meta}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        showActions
        onAction={handleAction}
        actionLoading={actionLoading}
      />
      <WithdrawalActionModal
        action={modal?.action}
        onConfirm={handleConfirm}
        onCancel={() => setModal(null)}
      />
    </>
  );
}

/* ── Main page ───────────────────────────────── */
export default function WithdrawPage() {
  const [activeTab, setActiveTab] = useState("agent-requests");
  const activeTabMeta = TABS.find((t) => t.id === activeTab);

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
                Withdrawals
              </h1>
              <p className="text-sm text-gray-400 font-medium">
                {activeTabMeta?.desc ?? "Manage withdrawal requests and payouts."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <WithdrawalStats />

        {/* ── Tab bar ── */}
        <TabBar activeTab={activeTab} onSelect={setActiveTab} />

        {/* ── Tab content ── */}
        {activeTab === "agent-requests" && <AgentRequestsTab />}
        {activeTab === "admin-view"     && <AdminViewTab />}
        {activeTab === "commission"     && <CommissionWithdrawalForm />}
      </div>
    </>
  );
}