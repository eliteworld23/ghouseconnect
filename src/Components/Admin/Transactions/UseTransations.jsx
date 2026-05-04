import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://gtimeconnect.onrender.com/api/v1/admin";
const getToken = () => localStorage.getItem("token") || "";
const AUTH_HEADERS = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export function useTransactions(filters = {}) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [meta, setMeta]       = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.status)   params.set("status",   filters.status);
    if (filters.type)     params.set("type",     filters.type);
    if (filters.userType) params.set("userType", filters.userType);
    if (filters.page)     params.set("page",     filters.page);
    params.set("limit", filters.limit || 10);
    const qs = params.toString();
    return `${API_BASE}/transactions${qs ? `?${qs}` : ""}`;
  }, [filters]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(buildUrl(), { headers: AUTH_HEADERS() });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const json = await res.json();
      const rows = json.data?.transactions ?? json.data ?? json.transactions ?? json ?? [];
      const m    = json.data?.meta ?? json.meta ?? {};
      setData(Array.isArray(rows) ? rows : []);
      setMeta({
        total:      m.total      ?? rows.length ?? 0,
        page:       m.page       ?? filters.page ?? 1,
        limit:      m.limit      ?? filters.limit ?? 10,
        totalPages: m.totalPages ?? Math.ceil((m.total ?? rows.length ?? 0) / (m.limit ?? 10)),
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, meta, refetch: fetchData };
}

export function useTransactionStats() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [allRes, successRes, withdrawRes, agentRes] = await Promise.all([
          fetch(`${API_BASE}/transactions`,                  { headers: AUTH_HEADERS() }),
          fetch(`${API_BASE}/transactions?status=success`,  { headers: AUTH_HEADERS() }),
          fetch(`${API_BASE}/transactions?type=withdrawal`, { headers: AUTH_HEADERS() }),
          fetch(`${API_BASE}/transactions?userType=Agent`,  { headers: AUTH_HEADERS() }),
        ]);

        const toJson = async (r) => { try { return await r.json(); } catch { return {}; } };
        const [all, success, withdraw, agent] = await Promise.all([
          toJson(allRes), toJson(successRes), toJson(withdrawRes), toJson(agentRes),
        ]);

        const count  = (j) => j?.data?.total ?? j?.total ?? j?.data?.meta?.total ?? j?.data?.transactions?.length ?? 0;
        const amount = (j) => j?.data?.totalAmount ?? j?.totalAmount ?? (j?.data?.transactions ?? []).reduce((s, t) => s + (t.amount ?? 0), 0);

        setStats({
          total:       count(all),
          totalAmount: amount(all),
          successful:  count(success),
          withdrawals: count(withdraw),
          agentTx:     count(agent),
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stats, loading, error };
}