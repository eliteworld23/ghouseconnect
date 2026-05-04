export default function Toggle({ enabled, onChange }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-1
          ${enabled ? "bg-blue-600" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200
            ${enabled ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    );
  }