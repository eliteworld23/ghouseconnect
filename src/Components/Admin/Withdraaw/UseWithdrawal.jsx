import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://gtimeconnect.onrender.com/api/v1";
const getToken = () => localStorage.getItem("token") || "";
const AUTH_HEADERS = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/* ─────────────────────────────────────────────
   1. GET  /withdrawal  — agent's own requests
   ───────────────────────────────────────────── */
export function useAgentWithdrawals(filters = {}) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [meta, setMeta]       = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.page)   params.set("page",   filters.page);
    params.set("limit", filters.limit || 10);
    const qs = params.toString();
    return `${API_BASE}/withdrawal${qs ? `?${qs}` : ""}`;
  }, [filters]);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(buildUrl(), { headers: AUTH_HEADERS() });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const json = await res.json();
      const rows = json.data?.withdrawals ?? json.data ?? json.withdrawals ?? json ?? [];
      const m    = json.data?.meta ?? json.meta ?? {};
      setData(Array.isArray(rows) ? rows : []);
      setMeta({
        total:      m.total      ?? rows.length,
        page:       m.page       ?? filters.page ?? 1,
        limit:      m.limit      ?? filters.limit ?? 10,
        totalPages: m.totalPages ?? Math.ceil((m.total ?? rows.length) / (m.limit ?? 10)),
      });
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, [buildUrl]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, meta, refetch: fetchData };
}

/* ─────────────────────────────────────────────
   2. GET  /withdrawal/admin  — admin view of all agent requests
   ───────────────────────────────────────────── */
export function useAdminWithdrawals(filters = {}) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [meta, setMeta]       = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.page)   params.set("page",   filters.page);
    params.set("limit", filters.limit || 10);
    const qs = params.toString();
    return `${API_BASE}/withdrawal/${qs ? `?${qs}` : ""}`;
  }, [filters]);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(buildUrl(), { headers: AUTH_HEADERS() });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const json = await res.json();
      const rows = json.data?.withdrawals ?? json.data ?? json.withdrawals ?? json ?? [];
      const m    = json.data?.meta ?? json.meta ?? {};
      setData(Array.isArray(rows) ? rows : []);
      setMeta({
        total:      m.total      ?? rows.length,
        page:       m.page       ?? filters.page ?? 1,
        limit:      m.limit      ?? filters.limit ?? 10,
        totalPages: m.totalPages ?? Math.ceil((m.total ?? rows.length) / (m.limit ?? 10)),
      });
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, [buildUrl]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, meta, refetch: fetchData };
}

/* ─────────────────────────────────────────────
   3. PATCH /withdrawal/:id/approve
   ───────────────────────────────────────────── */
export async function approveWithdrawal(id) {
  const res = await fetch(`${API_BASE}/withdrawal/${id}/approve`, {
    method: "PATCH",
    headers: AUTH_HEADERS(),
    body: JSON.stringify({ payoutMode: "manual" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ─────────────────────────────────────────────
   4. PATCH /withdrawal/:id/mark-paid
   ───────────────────────────────────────────── */
export async function markWithdrawalPaid(id) {
  const res = await fetch(`${API_BASE}/withdrawal/${id}/mark-paid`, {
    method: "PATCH",
    headers: AUTH_HEADERS(),
    body: JSON.stringify({ payoutMode: "manual" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ─────────────────────────────────────────────
   5. PATCH /withdrawal/:id/decline
   ───────────────────────────────────────────── */
export async function declineWithdrawal(id) {
  const res = await fetch(`${API_BASE}/withdrawal/${id}/reject`, {
    method: "PATCH",
    headers: AUTH_HEADERS(),
    body: JSON.stringify({ payoutMode: "manual" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ─────────────────────────────────────────────
   6. POST /withdrawal/admin/commission
      System admin withdrawal of commission funds
   ───────────────────────────────────────────── */
export async function withdrawCommission(payload) {
  const res = await fetch(`${API_BASE}/withdrawal/system`, {
    method: "POST",
    headers: AUTH_HEADERS(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

/* ─────────────────────────────────────────────
   Withdrawal stats (for stat cards)
   ───────────────────────────────────────────── */
export function useWithdrawalStats() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [allRes, pendingRes, approvedRes, paidRes] = await Promise.all([
          fetch(`${API_BASE}/withdrawal/`,                    { headers: AUTH_HEADERS() }),
          fetch(`${API_BASE}/withdrawal/?status=pending`,    { headers: AUTH_HEADERS() }),
          fetch(`${API_BASE}/withdrawal/?status=approved`,   { headers: AUTH_HEADERS() }),
          fetch(`${API_BASE}/withdrawal/?status=paid`,       { headers: AUTH_HEADERS() }),
        ]);

        const toJson = async (r) => { try { return await r.json(); } catch { return {}; } };
        const [all, pending, approved, paid] = await Promise.all([
          toJson(allRes), toJson(pendingRes), toJson(approvedRes), toJson(paidRes),
        ]);

        const count  = (j) => j?.data?.meta?.total ?? j?.data?.total ?? j?.total ?? j?.data?.withdrawals?.length ?? 0;
        const amount = (j) =>
          j?.data?.totalAmount ?? j?.totalAmount ??
          (j?.data?.withdrawals ?? []).reduce((s, w) => s + (w.amount ?? 0), 0);

        setStats({
          total:        count(all),
          totalAmount:  amount(all),
          pending:      count(pending),
          approved:     count(approved),
          paid:         count(paid),
        });
      } catch (e) { setError(e.message); }
      finally     { setLoading(false); }
    })();
  }, []);

  return { stats, loading, error };
}