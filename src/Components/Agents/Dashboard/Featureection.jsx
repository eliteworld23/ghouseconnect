// src/components/FeaturesSection.jsx

const ALL_FEATURES = [
  "Boys Quater", "Big Compound", "Swimming Pool", "24 Hours Electricity", "Drainage System",
  "Ocean View", "POP Ceiling", "All Room Ensuit", "Church Nearby", "Mosques Nearby",
  "Elevator", "24 Hours Security", "Supermarket Nearby", "Parking Space", "Street light",
  "Restaurant Nearby", "CCTV Cameras", "Children play ground", "Front Desk Service", "Gym",
  "Water Treatment", "Borehole", "Free WiFi", "Overhead Tank",
];

export default function FeaturesSection({ data, onChange }) {
  const toggle = (feature) => {
    const current = data.features || [];
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    onChange("features", updated);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4 sm:mb-5 pb-3 border-b border-gray-100">
        Features
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-3.5 mb-5">
        {ALL_FEATURES.map((feature) => (
          <label key={feature} className="flex items-center gap-2 cursor-pointer select-none touch-manipulation">
            <input
              type="checkbox"
              checked={(data.features || []).includes(feature)}
              onChange={() => toggle(feature)}
              className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer flex-shrink-0"
            />
            <span className="text-xs text-gray-700 leading-tight">{feature}</span>
          </label>
        ))}
      </div>

      {/* Others */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mt-2">
        <span className="text-sm text-gray-500 flex-shrink-0">Others</span>
        <input
          type="text"
          placeholder="Type other features..."
          value={data.otherFeatures || ""}
          onChange={(e) => onChange("otherFeatures", e.target.value)}
          className="w-full sm:flex-1 sm:max-w-xs border-0 border-b border-gray-300 pb-1 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition bg-transparent"
        />
      </div>
    </div>
  );
}