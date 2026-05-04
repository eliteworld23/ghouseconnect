import Sidebar from '../Dashboard/Navbar'
import InformationSection from './Informationsection'
import SocialMediaSection from './Socialmediasection'
import AccountRoleSection from './Accountrolesection'
import ChangePasswordSection from './Changepasswordsection'
import DeleteAccountSection from './Deleteaccountsection'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar — manages its own mobile drawer state internally */}
      <Sidebar activePage="My Profile" onNavigate={() => {}} />

      {/* Main content
          - Mobile: no left margin, pt-14 clears the fixed 56px topbar
          - Desktop (md+): ml-[260px] clears the fixed sidebar
      */}
      <div className="md:ml-[260px] pt-14 md:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">

          {/* Page Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
            >
              View Public Profile
            </button>
          </div>

          {/* Sections */}
          <div className="space-y-2">
            <InformationSection />
            <SocialMediaSection />
            <AccountRoleSection />
            <ChangePasswordSection />
            <DeleteAccountSection />
          </div>

        </div>
      </div>
    </div>
  )
}