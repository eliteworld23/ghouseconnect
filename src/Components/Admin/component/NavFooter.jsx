import { Settings, LogOut } from "lucide-react";
import { USER_INFO } from "./NavConfig";

export default function NavFooter({ onLogout, onSelect }) {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("user") || localStorage.getItem("nestfind_user") || "{}"); }
    catch { return {}; }
  })();
  const name     = stored.fullName || stored.firstName || USER_INFO.name;
  const role     = stored.role     || USER_INFO.role;
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || USER_INFO.initials;

  return (
    <div style={{ padding: "12px 12px 24px", borderTop: "1px solid #f3f4f6" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: 12,
          transition: "background 0.18s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Avatar */}
        <div
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #1a56db, #0b1a2e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
            {initials}
          </span>
        </div>

        {/* Name & role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, color: "#0b1a2e",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            margin: 0, lineHeight: 1,
          }}>
            {name}
          </p>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 3, marginBottom: 0 }}>
            {role}
          </p>
        </div>

        {/* Settings icon */}
        <button
          onClick={() => onSelect?.("settings")}
          title="Settings"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            padding: 8, borderRadius: 8, display: "grid", placeItems: "center",
            color: "#9ca3af", transition: "all 0.18s", flexShrink: 0,
            minWidth: 36, minHeight: 36,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#eff6ff";
            e.currentTarget.style.color = "#1a56db";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          <Settings size={15} strokeWidth={1.8} />
        </button>

        {/* Logout button — larger tap target */}
        <button
          onClick={onLogout}
          title="Sign out"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            padding: 8, borderRadius: 8, display: "grid", placeItems: "center",
            color: "#9ca3af", transition: "all 0.18s", flexShrink: 0,
            minWidth: 36, minHeight: 36, // bigger tap target for mobile
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fef2f2";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          <LogOut size={16} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}