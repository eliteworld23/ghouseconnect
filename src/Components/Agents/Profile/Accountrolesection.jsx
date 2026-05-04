import { useState } from 'react'
import SectionCard from './Sectioncard'

const roles = ['Seller', 'Buyer', 'Agent', 'Admin']

export default function AccountRoleSection() {
  const [role, setRole] = useState('Seller')

  return (
    <div id="account-role">
      <SectionCard title="Account Role">
        {/* Stack on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <label className="text-sm font-medium text-gray-700 sm:w-32">Account Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </SectionCard>
    </div>
  )
}