import { useState } from 'react'
import SectionCard from './Sectioncard'
import FormField from './Formfield'

const SOCIAL_FIELDS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'twitter', label: 'Twitter' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'googlePlus', label: 'Google Plus' },
  { key: 'youtube', label: 'Youtube' },
  { key: 'pinterest', label: 'Pinterest' },
  { key: 'vimeo', label: 'Vimeo' },
  { key: 'skype', label: 'Skype' },
  { key: 'website', label: 'Website' },
]

export default function SocialMediaSection() {
  const [isEditing, setIsEditing] = useState(false)

  const [saved, setSaved] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    googlePlus: '',
    youtube: '',
    pinterest: '',
    vimeo: '',
    skype: '',
    website: '',
  })

  const [form, setForm] = useState({ ...saved })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = () => {
    setSaved({ ...form })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setForm({ ...saved })
    setIsEditing(false)
  }

  // Only render display fields that have a saved value
  const filledFields = SOCIAL_FIELDS.filter(({ key }) => saved[key])

  return (
    <div id="social-media">
      <SectionCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Social Media</h2>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Edit
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
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 text-sm font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOCIAL_FIELDS.map(({ key, label }) => (
                <FormField
                  key={key}
                  label={label}
                  placeholder={`Enter your ${label} URL`}
                  value={form[key]}
                  onChange={set(key)}
                />
              ))}
            </div>
            <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition"
              >
                Save Changes
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
        ) : filledFields.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filledFields.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <div className="w-full px-3 py-2 text-sm rounded-md border bg-gray-50 border-gray-200 text-gray-800 truncate">
                  <a href={saved[key]} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                    {saved[key]}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No social media links added yet. Click Edit to add them.</p>
        )}
      </SectionCard>
    </div>
  )
}