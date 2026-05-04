import { useState } from 'react'
import SectionCard from './Sectioncard'
import FormField from './Formfield'

export default function ChangePasswordSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setError('')
    setSuccess(false)
  }

  const handleSave = () => {
    if (!form.newPassword || !form.confirmPassword) {
      setError('Please fill in both fields.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSuccess(true)
    setForm({ newPassword: '', confirmPassword: '' })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setForm({ newPassword: '', confirmPassword: '' })
    setError('')
    setIsEditing(false)
  }

  return (
    <div id="change-password">
      <SectionCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => { setSuccess(false); setIsEditing(true) }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Change Password
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <p className="text-sm text-gray-500">
            Your password is set. Click "Change Password" to update it.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <FormField
                label="New Password"
                placeholder="Enter your new password"
                type="password"
                value={form.newPassword}
                onChange={set('newPassword')}
              />
              <FormField
                label="Confirm New Password"
                placeholder="Enter your new password again"
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
              />
            </div>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {success && (
          <p className="mt-3 text-sm text-emerald-600 font-medium">
            ✓ Password updated successfully!
          </p>
        )}
      </SectionCard>
    </div>
  )
}