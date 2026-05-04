import { useState } from 'react'
import SectionCard from './Sectioncard'

export default function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false)

  return (
    <div id="delete-account">
      <SectionCard title="Delete Account">
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
        </p>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            Delete My Account
          </button>
        ) : (
          <div className="flex flex-col gap-3 max-w-sm">
            <p className="text-sm font-medium text-gray-700">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
              >
                Yes, Delete My Account
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}