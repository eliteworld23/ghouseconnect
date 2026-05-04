// src/components/DetailsSection.jsx
import { useState } from "react";
import SpinnerInput from "./Spinnerinput";

const SIZE_POSTFIX = ["Sqft", "Sqm", "Acres", "Hectares"];

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-10 px-3 pr-8 border border-gray-300 rounded-lg text-sm bg-white appearance-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
    </div>
  </div>
);

export default function DetailsSection({ data, onChange }) {
  const [activeTab, setActiveTab] = useState("property");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4 sm:mb-5 pb-3 border-b border-gray-100">
        Details
      </h2>

      {/* Tab Pills */}
      <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg mb-4 sm:mb-5">
        {["property", "lands"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition capitalize touch-manipulation ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Property Tab */}
      {activeTab === "property" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <SpinnerInput label="Bedrooms"  name="bedrooms"  value={data.bedrooms}  onChange={onChange} placeholder="Enter number of bedrooms" />
            <SpinnerInput label="Bathrooms" name="bathrooms" value={data.bathrooms} onChange={onChange} placeholder="Enter number of bathrooms" />
            <SpinnerInput label="Toilets"   name="toilets"   value={data.toilets}   onChange={onChange} placeholder="Enter number of toilets" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <SpinnerInput label="Property size" name="propertySize" value={data.propertySize} onChange={onChange} placeholder="Enter property size" />
            <SelectField  label="Size Postfix" name="propertySizePostfix" value={data.propertySizePostfix} onChange={onChange} options={SIZE_POSTFIX} />
            <div className="col-span-2 sm:col-span-1">
              <SpinnerInput label="Parking" name="parking" value={data.parking} onChange={onChange} placeholder="Enter number of space" />
            </div>
          </div>
        </>
      )}

      {/* Lands Tab */}
      {activeTab === "lands" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <SpinnerInput label="No of Plots" name="noOfPlots" value={data.noOfPlots} onChange={onChange} placeholder="Enter number of plots" />
          <SpinnerInput label="Land size"   name="landSize"  value={data.landSize}  onChange={onChange} placeholder="Enter land size" />
          <div className="col-span-2 sm:col-span-1">
            <SelectField label="Size Postfix" name="landSizePostfix" value={data.landSizePostfix} onChange={onChange} options={SIZE_POSTFIX} />
          </div>
        </div>
      )}
    </div>
  );
}