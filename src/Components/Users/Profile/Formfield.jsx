export default function FormField({ label, placeholder, value, onChange, type = 'text', className = '' }) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
        />
      </div>
    )
  }