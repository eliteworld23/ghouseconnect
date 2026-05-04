import { useState } from "react";
import { ChevronDown } from "lucide-react";
import DropdownMenu from "./Dropdownmenue";

export default function NavItem({ item, activeId, onSelect }) {
  const [open, setOpen] = useState(false);

  const hasChildren = !!item.children?.length;
  const isActive =
    activeId === item.id ||
    (hasChildren && item.children.some((c) => c.id === activeId));

  const handleClick = () => {
    hasChildren ? setOpen((prev) => !prev) : onSelect(item.id);
  };

  const Icon = item.icon;

  return (
    <li>
      <button
        onClick={handleClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          // Taller padding for easier mobile tapping
          padding: "13px 14px",
          borderRadius: 12,
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          border: isActive && !hasChildren ? "1px solid #bfdbfe" : "1px solid transparent",
          background: isActive && !hasChildren ? "#eff6ff" : "transparent",
          transition: "all 0.18s",
          position: "relative",
          // Ensure minimum touch target height
          minHeight: 48,
        }}
        onMouseEnter={(e) => {
          if (!(isActive && !hasChildren)) e.currentTarget.style.background = "#f9fafb";
        }}
        onMouseLeave={(e) => {
          if (!(isActive && !hasChildren)) e.currentTarget.style.background = isActive && !hasChildren ? "#eff6ff" : "transparent";
        }}
      >
        {/* Left active bar */}
        {isActive && !hasChildren && (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: 28,
              borderRadius: "0 3px 3px 0",
              background: "#1a56db",
            }}
          />
        )}

        {/* Icon */}
        <Icon
          size={18}
          color={isActive && !hasChildren ? "#1a56db" : "#6b7280"}
          strokeWidth={isActive && !hasChildren ? 2.2 : 1.8}
          style={{ flexShrink: 0 }}
        />

        <span
          style={{
            flex: 1,
            fontSize: 13.5,
            fontWeight: isActive && !hasChildren ? 700 : 500,
            color: isActive && !hasChildren ? "#1a56db" : "#374151",
          }}
        >
          {item.label}
        </span>

        {/* Badge */}
        {item.badge && (
          <span style={{
            background: "#1a56db", color: "#fff",
            fontSize: 10, fontWeight: 700,
            padding: "2px 7px", borderRadius: 999,
            flexShrink: 0,
          }}>
            {item.badge}
          </span>
        )}

        {/* Chevron for dropdown */}
        {hasChildren && (
          <ChevronDown
            size={14}
            color="#9ca3af"
            style={{
              flexShrink: 0,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        )}
      </button>

      {/* Dropdown children */}
      {hasChildren && (
        <DropdownMenu
          items={item.children}
          open={open}
          activeId={activeId}
          onSelect={onSelect}
        />
      )}
    </li>
  );
}