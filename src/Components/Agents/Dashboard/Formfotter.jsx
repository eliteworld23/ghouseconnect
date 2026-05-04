// src/components/FormFooter.jsx

export default function FormFooter({ onBack, onNext, isLoading }) {
  return (
    <div className="flex items-center justify-between mt-6">
      <button
        type="button"
        onClick={onBack}
        disabled={isLoading}
        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
      >
        ‹ Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 rounded-lg text-sm font-semibold text-white hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
            Submitting…
          </>
        ) : "Submit Listing ›"}
      </button>
    </div>
  );
}