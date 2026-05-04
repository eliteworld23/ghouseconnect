export default function DropdownMenu({ items = [], open, activeId, onSelect }) {
  return (
    <div
      style={{
        maxHeight: open ? "300px" : "0px",
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.3s ease, opacity 0.25s ease",
      }}
    >
      <ul className="mt-1 ml-4 pl-3 border-l border-gray-100 space-y-0.5 list-none p-0">
        {items.map((child) => {
          const active = activeId === child.id;
          const Icon = child.icon;

          return (
            <li key={child.id}>
              <button
                onClick={() => onSelect(child.id)}
                className={[
                  "w-full flex items-center gap-2.5 px-3 rounded-xl",
                  "text-[13px] font-medium transition-all duration-150 group",
                  active
                    ? "bg-blue-50 text-[#1a56db] border border-blue-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                ].join(" ")}
                style={{
                  // Minimum 44px touch target height
                  minHeight: 44,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                {/* Dot */}
                <span
                  className={[
                    "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors",
                    active ? "bg-[#1a56db]" : "bg-gray-300 group-hover:bg-gray-400",
                  ].join(" ")}
                />

                {/* Icon */}
                <Icon
                  size={14}
                  className={[
                    "flex-shrink-0",
                    active ? "text-[#1a56db]" : "text-gray-400 group-hover:text-gray-500",
                  ].join(" ")}
                />

                <span className="flex-1 text-left">{child.label}</span>

                {/* Badge */}
                {child.badge && (
                  <span className="bg-[#1a56db] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {child.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}