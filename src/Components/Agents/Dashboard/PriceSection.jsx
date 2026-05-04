// src/components/PriceSection.jsx

const CURRENCIES = [
  { value: "NGN", symbol: "₦" },
  { value: "USD", symbol: "$" },
  { value: "GBP", symbol: "£" },
  { value: "EUR", symbol: "€" },
];

const DURATIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly",  label: "Yearly" },
  { value: "weekly",  label: "Weekly" },
  { value: "daily",   label: "Daily" },
];

export default function PriceSection({ data, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4 sm:mb-5 pb-3 border-b border-gray-100">
        Price
      </h2>

      {/* Row 1: Currency + Price */}
      <div className="flex gap-3 items-end mb-3">
        {/* Currency */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <label className="text-sm font-medium text-gray-700">Currency</label>
          <div className="relative w-16">
            <select
              value={data.currency}
              onChange={(e) => onChange("currency", e.target.value)}
              className="w-full h-10 pl-2 pr-6 border border-gray-300 rounded-lg text-sm bg-white appearance-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.symbol}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
          </div>
        </div>

        {/* Sale Price */}
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Sale/Rent/Short let Price</label>
          <input
            type="number"
            placeholder="Enter the price"
            value={data.price}
            onChange={(e) => onChange("price", e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
      </div>

      {/* Row 2: Agency Fee + Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Agency Fee */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Agency Fee <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            placeholder="Enter agency fee"
            value={data.agencyFee}
            onChange={(e) => onChange("agencyFee", e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Duration</label>
          <div className="relative">
            <select
              value={data.duration}
              onChange={(e) => onChange("duration", e.target.value)}
              className="w-full h-10 px-3 pr-8 border border-gray-300 rounded-lg text-sm bg-white appearance-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
            >
              {DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
          </div>
          <span className="text-xs text-gray-400">If property is for rent/short let</span>
        </div>
      </div>
    </div>
  );
}