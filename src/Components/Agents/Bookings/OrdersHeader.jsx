import { Search, ChevronDown } from 'lucide-react'

const PERIODS = ['Today', 'This week', 'This month', 'This year', 'All time']
const SORTS   = ['Newest', 'Oldest', 'Amount: High to Low', 'Amount: Low to High']

function Dropdown({ value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}

export default function OrdersHeader({ search, setSearch, period, setPeriod, sortBy, setSortBy }) {
  return (
    <div className="mb-8">
      {/* Title row */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage all your client orders in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: '#1a56db' }}
          >
            MA
          </div>
          <span className="text-sm font-semibold text-gray-800">Matthew</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3 mt-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search product, client, or transaction ID..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Dropdown value={period} options={PERIODS} onChange={setPeriod} />
        <Dropdown value={sortBy} options={SORTS}   onChange={setSortBy} />
      </div>
    </div>
  )
}