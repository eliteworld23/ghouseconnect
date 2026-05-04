import { useState, useEffect } from "react";
import {
  Search, X, Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, Linkedin,
  Globe, UserRound, Eye, ChevronLeft, ChevronRight,
  Trash2, AlertTriangle, Loader2, Pencil, Check,
} from "lucide-react";
import { SHARED_PAGE_STYLES } from "./SharedPagesStyles";

const API_BASE = "https://gtimeconnect.onrender.com/api/v1/admin";
const getToken = () => localStorage.getItem("token") || "";
const HEADERS = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const AVATAR_COLORS = [
  "linear-gradient(135deg,#1a56db,#0b1a2e)",
  "linear-gradient(135deg,#7c3aed,#4f46e5)",
  "linear-gradient(135deg,#059669,#0d9488)",
  "linear-gradient(135deg,#dc2626,#db2777)",
  "linear-gradient(135deg,#d97706,#f59e0b)",
  "linear-gradient(135deg,#0891b2,#0284c7)",
  "linear-gradient(135deg,#be185d,#9d174d)",
  "linear-gradient(135deg,#92400e,#b45309)",
];

function initials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function colorFor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function normaliseUser(u) {
  const name = u.fullName ?? u.name ?? "Unknown";
  return {
    id:          u._id ?? u.id,
    name,
    phone:       u.phoneNumber ?? u.phone ?? "—",
    email:       u.email ?? "—",
    location:    u.location ?? u.address ?? "Nigeria",
    status:      u.status ?? (u.isVerified ? "Active" : "Pending"),
    joined:      u.createdAt
      ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—",
    bookings:    u.bookings ?? u.bookingCount ?? 0,
    avatar:      initials(name),
    avatarColor: colorFor(u._id ?? u.id ?? name),
    bio:         u.bio ?? u.description ?? "",
    social: {
      facebook:  u.facebook  ?? "",
      twitter:   u.twitter   ?? "",
      instagram: u.instagram ?? "",
      linkedin:  u.linkedin  ?? "",
      website:   u.website   ?? "",
    },
  };
}

const STATUS_STYLES = {
  Active:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Inactive: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Pending:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {status}
    </span>
  );
}

/* ── Delete Modal ─────────────────────────────────────────────────────────────── */
function DeleteModal({ user, onConfirm, onCancel, deleting }) {
  if (!user) return null;
  return (
    <div onClick={onCancel} className="nf-delete-backdrop">
      <div onClick={(e) => e.stopPropagation()} className="nf-delete-card">
        <div style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", padding: "28px 28px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.25)" }}>
            <AlertTriangle size={26} color="#fff" />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Delete User</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12.5, marginTop: 4 }}>This action cannot be undone</div>
          </div>
        </div>
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: user.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{user.avatar}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0b1a2e" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{user.phone} · {user.location}</div>
            </div>
          </div>
          <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.7, margin: "0 0 22px" }}>
            Are you sure you want to permanently delete <strong style={{ color: "#0b1a2e" }}>{user.name}</strong>'s account? All their bookings, data, and activity will be removed.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onCancel} disabled={deleting} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.6 : 1 }}>Cancel</button>
            <button onClick={onConfirm} disabled={deleting} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: deleting ? 0.7 : 1 }}>
              {deleting ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={14} />}
              {deleting ? "Deleting…" : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── User Detail / Edit Modal ─────────────────────────────────────────────────── */
function UserModal({ userId, onClose, onDelete, onUpdated }) {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({});
  const [fetchErr, setFetchErr] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setFetchErr(null);
      try {
        const res = await fetch(`${API_BASE}/users/${userId}`, { headers: HEADERS() });
        if (!res.ok) throw new Error(`Failed to load user (${res.status})`);
        const json = await res.json();
        const u = normaliseUser(json?.data ?? json);
        setUser(u);
        setForm({ phone: u.phone, email: u.email, location: u.location, status: u.status });
      } catch (e) { setFetchErr(e.message); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {};
      if (form.phone    !== user.phone)    body.phone    = form.phone;
      if (form.email    !== user.email)    body.email    = form.email;
      if (form.location !== user.location) body.location = form.location;
      if (form.status   !== user.status)   body.status   = form.status;
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PATCH", headers: HEADERS(), body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      const json = await res.json();
      const updated = normaliseUser(json?.data ?? json);
      setUser(updated);
      setForm({ phone: updated.phone, email: updated.email, location: updated.location, status: updated.status });
      setEditing(false);
      onUpdated?.(updated);
    } catch (e) { alert(`Could not save: ${e.message}`); }
    finally { setSaving(false); }
  };

  const socialLinks = [
    { icon: Facebook,  key: "facebook",  color: "#1877f2" },
    { icon: Twitter,   key: "twitter",   color: "#1da1f2" },
    { icon: Instagram, key: "instagram", color: "#e1306c" },
    { icon: Linkedin,  key: "linkedin",  color: "#0077b5" },
    { icon: Globe,     key: "website",   color: "#1a56db" },
  ];

  return (
    <div onClick={onClose} className="nf-modal-backdrop">
      <div onClick={(e) => e.stopPropagation()} className="nf-modal-card">

        {/* Header */}
        <div className="nf-modal-header" style={{ background: "linear-gradient(135deg,#0b1a2e 0%,#1a56db 100%)" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
            <X size={16} />
          </button>
          {loading && <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, paddingTop: 8 }}>Loading user details…</div>}
          {fetchErr && <div style={{ color: "#fca5a5", fontSize: 14, paddingTop: 8 }}>{fetchErr}</div>}
          {user && !loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: user.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", border: "3px solid rgba(255,255,255,0.3)", flexShrink: 0 }}>{user.avatar}</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{user.name}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <UserRound size={12} /> Registered User · {user.bookings} bookings
                </div>
                <div style={{ marginTop: 10 }}><StatusBadge status={user.status} /></div>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="nf-modal-body">
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <Loader2 size={28} color="#1a56db" style={{ animation: "spin 1s linear infinite" }} />
            </div>
          )}

          {user && !loading && (
            <>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Bookings", value: user.bookings, emoji: "📋" },
                  { label: "Joined",   value: user.joined.split(" ").slice(0, 2).join(" "), emoji: "📅" },
                  { label: "Status",   value: user.status,   emoji: "✅" },
                ].map(({ label, value, emoji }) => (
                  <div key={label} style={{ background: "#f9fafb", borderRadius: 14, padding: "12px 8px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{emoji}</div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#0b1a2e" }}>{value}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Contact — editable */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>Contact Details</div>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#1a56db", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                      <Pencil size={11} /> Edit
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setEditing(false)} style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Cancel</button>
                      <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#fff", background: "#1a56db", border: "none", borderRadius: 8, padding: "6px 14px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                        {saving ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={11} />}
                        {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { icon: Phone,  key: "phone",    color: "#16a34a", bg: "#f0fdf4" },
                    { icon: Mail,   key: "email",    color: "#1a56db", bg: "#eff6ff" },
                    { icon: MapPin, key: "location", color: "#dc2626", bg: "#fef2f2" },
                  ].map(({ icon: Icon, key, color, bg }) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "#fff", border: "1px solid #e5e7eb" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={14} color={color} />
                      </div>
                      {editing ? (
                        <input value={form[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          style={{ flex: 1, fontSize: 13.5, color: "#374151", border: "none", outline: "none", background: "transparent", fontWeight: 500 }} />
                      ) : (
                        <span style={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>{form[key]}</span>
                      )}
                    </div>
                  ))}

                  {editing && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "#fff", border: "1px solid #e5e7eb" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 14 }}>🔖</span>
                      </div>
                      <select value={form.status ?? ""} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                        style={{ flex: 1, fontSize: 13.5, color: "#374151", border: "none", outline: "none", background: "transparent", fontWeight: 500 }}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>About</div>
                  <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.75, margin: 0, background: "#f9fafb", borderRadius: 12, padding: "12px 14px", border: "1px solid #e5e7eb" }}>{user.bio}</p>
                </div>
              )}

              {/* Social */}
              {socialLinks.some(({ key }) => user.social[key]) && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Social Media</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {socialLinks.map(({ icon: Icon, key, color }) =>
                      user.social[key] ? (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#fff", border: "1px solid #e5e7eb" }}>
                          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={14} color={color} />
                          </div>
                          <span style={{ fontSize: 12, color: "#374151", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.social[key]}</span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="nf-modal-footer">
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Close</button>
          {user && (
            <button onClick={onDelete} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Trash2 size={13} /> Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 5;

export default function AllUsersPage() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [toDelete, setToDelete]     = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [page, setPage]             = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`${API_BASE}/users`, { headers: HEADERS() });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();
        setUsers((json?.data?.users ?? json?.users ?? []).map(normaliseUser));
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (user) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, { method: "DELETE", headers: HEADERS() });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setToDelete(null); setSelectedId(null);
    } catch (e) { alert(`Could not delete: ${e.message}`); }
    finally { setDeleting(false); }
  };

  const openDelete    = (user) => { setSelectedId(null); setTimeout(() => setToDelete(user), 150); };
  const handleUpdated = (updated) => setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

  const filtered   = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.location.toLowerCase().includes(q)) &&
           (filter === "All" || u.status === filter);
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 14 }}>
      <style>{SHARED_PAGE_STYLES}</style>
      <Loader2 size={32} color="#1a56db" style={{ animation: "spin 1s linear infinite" }} />
      <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>Loading users…</span>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 12, padding: 40 }}>
      <style>{SHARED_PAGE_STYLES}</style>
      <div style={{ fontSize: 36 }}>⚠️</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0b1a2e" }}>Failed to load users</div>
      <div style={{ fontSize: 13, color: "#9ca3af" }}>{error}</div>
      <button onClick={() => window.location.reload()} style={{ marginTop: 8, padding: "10px 22px", borderRadius: 10, border: "none", background: "#1a56db", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Retry</button>
    </div>
  );

  return (
    <div className="nf-page-wrap">
      <style>{SHARED_PAGE_STYLES}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#1a56db,#0b1a2e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <UserRound size={18} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0b1a2e", margin: 0, letterSpacing: "-0.5px" }}>All Users</h1>
        </div>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0, marginLeft: 48 }}>View and manage every user on the platform.</p>
      </div>

      {/* Stats */}
      <div className="nf-stats-grid">
        {[
          { label: "Total Users", value: users.length,                                    color: "#1a56db", bg: "#eff6ff", emoji: "👤" },
          { label: "Active",      value: users.filter(u => u.status === "Active").length,  color: "#16a34a", bg: "#f0fdf4", emoji: "✅" },
          { label: "Pending",     value: users.filter(u => u.status === "Pending").length, color: "#d97706", bg: "#fffbeb", emoji: "⏳" },
        ].map(({ label, value, color, bg, emoji }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{emoji}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginTop: 3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="nf-toolbar">
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, phone, location…"
            style={{ width: "100%", paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: "2px solid #e5e7eb", borderRadius: 12, fontSize: 13, color: "#374151", outline: "none", background: "#fff", boxSizing: "border-box" }}
            onFocus={(e) => (e.target.style.borderColor = "#1a56db")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
        </div>
        <div className="nf-filter-group">
          {["All", "Active", "Inactive", "Pending"].map((f) => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }} style={{ padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "2px solid", borderColor: filter === f ? "#1a56db" : "#e5e7eb", background: filter === f ? "#1a56db" : "#fff", color: filter === f ? "#fff" : "#6b7280", transition: "all 0.15s" }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="nf-table-outer">
        <div className="nf-table-scroll">
          <div className="nf-table-head">
            {["User", "Phone Number", "Status", "Actions"].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
            ))}
          </div>

          {paginated.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", minWidth: 520 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>No users found</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Try adjusting your search or filter.</div>
            </div>
          ) : (
            paginated.map((user, i) => (
              <div key={user.id} className="nf-table-row"
                style={{ borderBottom: i < paginated.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: user.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>{user.avatar}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0b1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}><MapPin size={10} style={{ display: "inline", marginRight: 2 }} />{user.location}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Phone size={13} color="#9ca3af" />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{user.phone}</span>
                </div>
                <div><StatusBadge status={user.status} /></div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setSelectedId(user.id)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 11px", borderRadius: 10, background: "#eff6ff", border: "1.5px solid #bfdbfe", color: "#1a56db", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", minHeight: 36 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#1a56db"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#1a56db"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#1a56db"; e.currentTarget.style.borderColor = "#bfdbfe"; }}>
                    <Eye size={12} /><span className="nf-action-btn-text"> View</span>
                  </button>
                  <button onClick={() => setToDelete(user)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 11px", borderRadius: 10, background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", minHeight: 36 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#dc2626"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fecaca"; }}>
                    <Trash2 size={12} /><span className="nf-action-btn-text"> Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="nf-pagination">
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}><ChevronLeft size={14} color="#374151" /></button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid", fontSize: 12, fontWeight: 700, cursor: "pointer", borderColor: page === i + 1 ? "#1a56db" : "#e5e7eb", background: page === i + 1 ? "#1a56db" : "#fff", color: page === i + 1 ? "#fff" : "#374151" }}>{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}><ChevronRight size={14} color="#374151" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedId && (
        <UserModal
          userId={selectedId}
          onClose={() => setSelectedId(null)}
          onDelete={() => { const u = users.find((u) => u.id === selectedId); openDelete(u); }}
          onUpdated={handleUpdated}
        />
      )}
      {toDelete && (
        <DeleteModal
          user={toDelete}
          deleting={deleting}
          onConfirm={() => handleDelete(toDelete)}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}