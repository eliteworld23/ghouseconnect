import { Check, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed z-[200] flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl shadow-xl text-sm font-semibold
        /* mobile: full-width banner at top; sm+: floating top-right */
        left-3 right-3 top-4 sm:left-auto sm:right-6 sm:top-6 sm:w-auto sm:max-w-sm
        ${type === "success" ? "bg-blue-600 text-white" : "bg-red-500 text-white"}`}
    >
      <span className="shrink-0">
        {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      </span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100 ml-1">
        <X size={14} />
      </button>
    </div>
  );
}