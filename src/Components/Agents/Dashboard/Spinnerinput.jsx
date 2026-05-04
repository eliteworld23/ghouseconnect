// src/components/SpinnerInput.jsx

export default function SpinnerInput({ label, name, value, onChange, placeholder }) {
  const step = (dir) => {
    const next = Math.max(0, (parseInt(value) || 0) + dir);
    onChange(name, String(next));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={0}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full h-10 px-3 pr-8 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => step(1)}
            className="w-3 h-3 flex items-center justify-center text-gray-400 hover:text-blue-600 text-[8px] leading-none"
          >▲</button>
          <button
            type="button"
            onClick={() => step(-1)}
            className="w-3 h-3 flex items-center justify-center text-gray-400 hover:text-blue-600 text-[8px] leading-none"
          >▼</button>
        </div>
      </div>
    </div>
  );
}