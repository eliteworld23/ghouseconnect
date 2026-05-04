import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './index.css'
import LandingPage        from './Components/Dashboard'
import UserDashboard      from './Components/Users/Dashboard/Dashboard'
import PropertyDetail     from './Components/Users/Dashboard/propertiesdetails'
import MyBookings         from './Components/Users/Dashboard/Booking'
import ProfilePage        from './Components/Users/Profile/profile'
import AgentProfilePage   from './Components/Agents/Profile/profile'
import WalletPage         from './Components/Agents/Wallet/Wallet'
import AdashBoard         from './Components/Agents/Dashboard/Dashboard'
import CreateListingPage  from './Components/Agents/Dashboard/Createlistingpage'
import EditListingPage    from './Components/Agents/Dashboard/Editlistingpage'
import Sidebar            from './Components/Agents/navbar'
import UserSidebar        from './Components/Users/Dashboard/Navbar'
import AgentOrdersPage    from './Components/Agents/Bookings/AgentOrders'
import Settings           from './Components/Users/Settings/Setting'

// ── Admin imports ─────────────────────────────────────────────────────────────
import AdminSidebar       from './Components/Admin/component/Navbar'
import AdminPageContent   from './Components/Admin/component/PageContent'
import { PAGES }          from './Components/Admin/component/NavConfig'
import AdminAuth          from './Adminauth'

const NAV_W = 260

// ── Route map shared by all agent layouts ─────────────────────────────────────
const AGENT_ROUTE_MAP = {
  'Dashboard':        '/agent-dashboard',
  'Bookings':         '/agent-bookings',
  'Create a Listing': '/create-listing',
  'Wallet':           '/wallet',
  'My Profile':       '/agent-profile',
  'Settings':         '/settings',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
}

/** Decode a JWT and return its payload, or null if malformed. */
const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch { return null }
}

/** Clear expired session data from localStorage. */
const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token')
    const user  = getUser()

    if (!token || token === 'undefined' || token === 'null') return false
    if (!user || !Object.keys(user).length) return false

    // Check JWT expiry if the token carries an exp claim
    const payload = decodeJwt(token)
    if (payload?.exp) {
      const nowSec = Math.floor(Date.now() / 1000)
      if (nowSec >= payload.exp) {
        clearSession()   // wipe stale data so the next check is clean
        return false
      }
    }

    return true
  } catch { return false }
}

const isAdmin = () => {
  try { return getUser().userType === 'admin' } catch { return false }
}

const getRedirectPath = () => {
  try {
    const user = getUser()
    if (!isAuthenticated()) return '/'
    if (user.userType === 'admin') return '/admin'
    if (user.userType === 'agent') return '/agent-dashboard'
    return '/dashboard'
  } catch { return '/' }
}

// ── Protected Route ───────────────────────────────────────────────────────────
function ProtectedRoute({ children, agentOnly = false, adminOnly = false }) {
  if (!isAuthenticated()) {
    if (adminOnly) return <Navigate to="/admin-login" replace />
    return <Navigate to="/" replace />
  }
  if (agentOnly && getUser().userType !== 'agent') return <Navigate to="/dashboard" replace />
  if (adminOnly && !isAdmin())                      return <Navigate to="/admin-login" replace />
  return children
}

// ── Admin Layout ──────────────────────────────────────────────────────────────
function AdminLayout() {
  const [activeId, setActiveId] = useState('dashboard')

  const page = PAGES[activeId] ?? { title: 'Page', subtitle: '', emoji: '📄' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar activeId={activeId} onSelect={setActiveId} />
      <AdminPageContent activeId={activeId} page={page} />
    </div>
  )
}

// ── Agent Layout ──────────────────────────────────────────────────────────────
function AgentLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const activePage = Object.entries(AGENT_ROUTE_MAP).find(
    ([, path]) => path === location.pathname
  )?.[0] ?? 'Dashboard'

  const handleNavigate = (page) => {
    const path = AGENT_ROUTE_MAP[page]
    if (path) navigate(path)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="agent-main-content" style={{ flex: 1, minHeight: '100vh', background: '#f3f7ff', minWidth: 0, overflow: 'hidden' }}>
        {children}
      </main>
      <style>{`
        .agent-main-content { margin-left: 0; width: 100%; }
        @media (min-width: 768px) { .agent-main-content { margin-left: ${NAV_W}px; width: calc(100% - ${NAV_W}px); } }
      `}</style>
    </div>
  )
}

// ── Settings Layout ───────────────────────────────────────────────────────────
function SettingsLayout() {
  const navigate    = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user   = getUser()
  const isAgent = user?.userType === 'agent'

  if (isAgent) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          activePage="Settings"
          onNavigate={(page) => {
            const path = AGENT_ROUTE_MAP[page]
            if (path) navigate(path)
          }}
        />
        <main className="settings-main-content" style={{ minHeight: '100vh', background: '#f3f7ff', flex: 1 }}>
          <Settings />
        </main>
        <style>{`
          .settings-main-content { margin-left: 0; }
          @media (min-width: 768px) { .settings-main-content { margin-left: ${NAV_W}px; } }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <UserSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="settings-main-content" style={{ minHeight: '100vh', background: '#f3f7ff', flex: 1 }}>
        <Settings />
      </main>
      <style>{`
        .settings-main-content { margin-left: 0; }
        @media (min-width: 768px) { .settings-main-content { margin-left: 256px; } }
      `}</style>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    // Sync token changes across browser tabs
    const sync = () => setToken(localStorage.getItem('token'))
    window.addEventListener('storage', sync)

    // Poll every 30 s — if the token has expired mid-session, clear it and
    // force a re-render so ProtectedRoute redirects to the landing page
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        clearSession()
        setToken(null)
      }
    }, 30_000)

    return () => {
      window.removeEventListener('storage', sync)
      clearInterval(interval)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Landing page — always shown regardless of auth state ── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Admin login ── */}
        <Route
          path="/admin-login"
          element={isAdmin() ? <Navigate to="/admin" replace /> : <AdminAuth />}
        />

        {/* ── Admin dashboard (protected — admin only) ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* ── User routes ── */}
        <Route path="/dashboard"      element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/userdashboard"  element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/bookings"       element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<PropertyDetail />} />

        {/* ── Settings (agents + users) ── */}
        <Route
          path="/settings"
          element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}
        />

        {/* ── Agent routes ── */}
        <Route
          path="/agent-dashboard"
          element={<ProtectedRoute agentOnly><AgentLayout><AdashBoard /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/agent-bookings"
          element={<ProtectedRoute agentOnly><AgentLayout><AgentOrdersPage /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/wallet"
          element={<ProtectedRoute agentOnly><AgentLayout><WalletPage /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/create-listing"
          element={<ProtectedRoute agentOnly><AgentLayout><CreateListingPage /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/edit/:id"
          element={<ProtectedRoute agentOnly><AgentLayout><EditListingPage /></AgentLayout></ProtectedRoute>}
        />
        <Route
          path="/agent-profile"
          element={<ProtectedRoute agentOnly><AgentLayout><AgentProfilePage /></AgentLayout></ProtectedRoute>}
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App