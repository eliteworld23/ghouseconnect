import { Eye, EyeOff } from "lucide-react";

export const inp = (extra = "") =>
  `w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white
   focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all ${extra}`;

export const Lbl = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1">{children}</label>
);

export const EyeBtn = ({ show, toggle }) => (
  <button
    type="button"
    onClick={toggle}
    tabIndex={-1}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
  >
    {show ? <EyeOff size={15} /> : <Eye size={15} />}
  </button>
);

export const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);