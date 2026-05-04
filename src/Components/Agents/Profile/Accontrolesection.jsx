import { useState } from 'react'
import SectionCard from './Sectioncard'
import FormField from './Formfield'

export default function SocialMediaSection() {
  const [form, setForm] = useState({
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

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div id="social-media">
      <SectionCard title="Social Media">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Facebook" placeholder="Enter your Facebook URL" value={form.facebook} onChange={set('facebook')} />
          <FormField label="Address (Twitter)" placeholder="Enter your Twitter URL" value={form.twitter} onChange={set('twitter')} />
          <FormField label="LinkedIn" placeholder="Enter your LinkedIn URL" value={form.linkedin} onChange={set('linkedin')} />
          <FormField label="Instagram" placeholder="Enter your Instagram URL" value={form.instagram} onChange={set('instagram')} />
          <FormField label="Google Plus" placeholder="Enter your Google Plus URL" value={form.googlePlus} onChange={set('googlePlus')} />
          <FormField label="Youtube" placeholder="Enter your Youtube URL" value={form.youtube} onChange={set('youtube')} />
          <FormField label="Pinterest" placeholder="Enter your Pinterest URL" value={form.pinterest} onChange={set('pinterest')} />
          <FormField label="Vimeo" placeholder="Enter your Vimeo URL" value={form.vimeo} onChange={set('vimeo')} />
          <FormField label="Skype" placeholder="Enter your Skype URL" value={form.skype} onChange={set('skype')} />
          <FormField label="Website" placeholder="Enter your Website URL" value={form.website} onChange={set('website')} />
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition"
          >
            Update Profile
          </button>
        </div>
      </SectionCard>
    </div>
  )
}