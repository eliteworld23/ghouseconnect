export const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);