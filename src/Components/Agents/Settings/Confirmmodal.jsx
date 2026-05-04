import { Shield, Trash2, X } from "lucide-react";

export default function ConfirmModal({
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
  danger = false,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Sheet on mobile, centered card on sm+ */}
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl relative overflow-hidden">
        <div
          className={`h-1.5 ${danger
            ? "bg-red-500"
            : "bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"}`}
        />

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-6 sm:px-8 py-5 sm:py-7">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4
              ${danger ? "bg-red-50" : "bg-blue-50"}`}
          >
            {danger
              ? <Trash2 size={22} className="text-red-500" />
              : <Shield size={22} className="text-blue-600" />}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-2">{title}</h2>
          <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">{description}</p>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 sm:py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 sm:py-2.5 rounded-xl text-white text-sm font-semibold transition-all
                ${danger ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>

        <div
          className={`h-1 ${danger
            ? "bg-red-500"
            : "bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"}`}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}