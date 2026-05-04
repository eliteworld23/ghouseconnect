// ✅ NAVLOGO.JSX — Logo only. No DropdownMenu here.

export default function NavLogo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "28px 24px 24px",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          background: "#0b1a2e",
          borderRadius: 10,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline
            points="9 22 9 12 15 12 15 22"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "#0b1a2e",
        }}
      >
        Nest<span style={{ color: "#1a56db" }}>find</span>
      </span>
    </div>
  );
}