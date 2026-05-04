import { useState } from 'react'
import SectionCard from './Sectioncard'
import FormField from './Formfield'
import AvatarUpload from './Avatarupload'

// Read real user data from localStorage — same pattern as Settings.jsx
const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
}

export default function InformationSection() {
  const [isEditing, setIsEditing] = useState(false)

  const stored = getStoredUser()

  // Saved state — seeded from localStorage, falls back gracefully
  const [saved, setSaved] = useState({
    username:    stored.username   || stored.name?.split(' ')[0] || '',
    email:       stored.email      || '',
    firstName:   stored.firstName  || stored.name?.split(' ')[0] || '',
    lastName:    stored.lastName   || stored.name?.split(' ')[1] || '',
    publicName:  stored.publicName || stored.name?.split(' ')[0] || '',
    title:       stored.title      || '',
    license:     stored.license    || '',
    mobile:      stored.phone      || stored.mobile || '',
    whatsapp:    stored.whatsapp   || '',
    taxNumber:   stored.taxNumber  || '',
    phone:       stored.phone      || '',
    faxNumber:   stored.faxNumber  || '',
    language:    stored.language   || '',
    companyName: stored.companyName|| '',
    address:     stored.address    || '',
    serviceAreas:stored.serviceAreas || '',
    specialties: stored.specialties  || '',
    about:       stored.bio        || stored.about || '',
  })

  // Draft state used while editing
  const [form, setForm] = useState({ ...saved })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarDraft, setAvatarDraft] = useState(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleAvatarChange = (file) => {
    const url = URL.createObjectURL(file)
    setAvatarDraft(url)
  }

  const handleSave = () => {
    setSaved({ ...form })
    if (avatarDraft) setAvatarPreview(avatarDraft)
    setAvatarDraft(null)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setForm({ ...saved })
    setAvatarDraft(null)
    setIsEditing(false)
  }

  // Display field — only renders if value is non-empty
  const DisplayField = ({ label, value, fullWidth = false }) => {
    if (!value) return null
    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'col-span-1 sm:col-span-2' : ''}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="w-full px-3 py-2 text-sm rounded-md border bg-gray-50 border-gray-200 text-gray-800">
          {value}
        </div>
      </div>
    )
  }

  const publicNameOptions = [saved.firstName, saved.lastName, `${saved.firstName} ${saved.lastName}`].filter(Boolean)

  return (
    <div id="information">
      <SectionCard>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Personal Information</h2>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Edit Profile
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
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Avatar */}
          <div className="flex justify-center sm:justify-start">
            <AvatarUpload
              preview={isEditing ? (avatarDraft || avatarPreview) : avatarPreview}
              onFileChange={isEditing ? handleAvatarChange : undefined}
              disabled={!isEditing}
            />
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isEditing ? (
              <>
                {/* Always-visible locked fields in edit mode (no lock label) */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <div className="w-full px-3 py-2 text-sm rounded-md border bg-gray-50 border-gray-200 text-gray-500">
                    {form.firstName}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <div className="w-full px-3 py-2 text-sm rounded-md border bg-gray-50 border-gray-200 text-gray-500">
                    {form.lastName}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="w-full px-3 py-2 text-sm rounded-md border bg-gray-50 border-gray-200 text-gray-500">
                    {form.email}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Mobile</label>
                  <div className="w-full px-3 py-2 text-sm rounded-md border bg-gray-50 border-gray-200 text-gray-500">
                    {form.mobile}
                  </div>
                </div>

                <FormField label="Username" placeholder="Username" value={form.username} onChange={set('username')} />

                {/* Public Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Select Your Public Name</label>
                  <select
                    value={form.publicName}
                    onChange={set('publicName')}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  >
                    {publicNameOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <FormField label="Title / Position" placeholder="Enter your title or position" value={form.title} onChange={set('title')} />
                <FormField label="License" placeholder="Enter your license" value={form.license} onChange={set('license')} />
                <FormField label="Whatsapp" placeholder="Enter your number with country code" value={form.whatsapp} onChange={set('whatsapp')} />
                <FormField label="Tax Number" placeholder="Enter your tax number" value={form.taxNumber} onChange={set('taxNumber')} />
                <FormField label="Phone" placeholder="Enter your phone number" value={form.phone} onChange={set('phone')} />
                <FormField label="Fax Number" placeholder="Enter your fax number" value={form.faxNumber} onChange={set('faxNumber')} />
                <FormField label="Language" placeholder="English, Spanish, French" value={form.language} onChange={set('language')} />
                <FormField label="Company Name" placeholder="Enter your company name" value={form.companyName} onChange={set('companyName')} />
                <FormField label="Address" placeholder="Enter your address" value={form.address} onChange={set('address')} />

                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Service Areas</label>
                  <input
                    type="text"
                    placeholder="Enter your service areas"
                    value={form.serviceAreas}
                    onChange={set('serviceAreas')}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Specialties</label>
                  <input
                    type="text"
                    placeholder="Enter your specialties"
                    value={form.specialties}
                    onChange={set('specialties')}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">About me</label>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                      <select className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-600 mr-2">
                        <option>Paragraph</option>
                        <option>Heading 1</option>
                        <option>Heading 2</option>
                      </select>
                      {['B', 'I', '≡', '⁼', '❝', '⟵', '⟶'].map((t, i) => (
                        <button key={i} type="button" className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded transition">
                          {t}
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={5}
                      value={form.about}
                      onChange={set('about')}
                      placeholder="Write something about yourself..."
                      className="w-full px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Display mode: only show fields that have values */}
                <DisplayField label="First Name" value={saved.firstName} />
                <DisplayField label="Last Name" value={saved.lastName} />
                <DisplayField label="Email" value={saved.email} />
                <DisplayField label="Mobile" value={saved.mobile} />
                <DisplayField label="Username" value={saved.username} />
                <DisplayField label="Public Name" value={saved.publicName} />
                <DisplayField label="Title / Position" value={saved.title} />
                <DisplayField label="License" value={saved.license} />
                <DisplayField label="Whatsapp" value={saved.whatsapp} />
                <DisplayField label="Tax Number" value={saved.taxNumber} />
                <DisplayField label="Phone" value={saved.phone} />
                <DisplayField label="Fax Number" value={saved.faxNumber} />
                <DisplayField label="Language" value={saved.language} />
                <DisplayField label="Company Name" value={saved.companyName} />
                <DisplayField label="Address" value={saved.address} />
                <DisplayField label="Service Areas" value={saved.serviceAreas} fullWidth />
                <DisplayField label="Specialties" value={saved.specialties} fullWidth />
                {saved.about && (
                  <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">About me</label>
                    <div className="w-full px-3 py-3 text-sm rounded-md border bg-gray-50 border-gray-200 text-gray-800 min-h-[80px]">
                      {saved.about}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom save/cancel in edit mode */}
        {isEditing && (
          <div className="mt-6 flex items-center gap-3 pt-4 border-t border-gray-100">
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
        )}
      </SectionCard>
    </div>
  )
}