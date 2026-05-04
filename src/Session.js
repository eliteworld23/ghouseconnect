/**
 * session.js  —  Nestfind session management
 *
 * Rules:
 *  • Tab closed / new tab opened  →  force re-login
 *    (sessionStorage is wiped automatically by the browser on tab close)
 *  • 1 hour of inactivity          →  force re-login
 *  • Active use resets the timer on every user interaction
 */

const SESSION_FLAG   = 'nf_tab_active'   // sessionStorage — dies with the tab
const LAST_ACTIVE    = 'nf_last_active'  // localStorage   — survives refresh
const TIMEOUT_MS     = 60 * 60 * 1000   // 1 hour

/** Called immediately after a successful login API response */
export function markLogin() {
  sessionStorage.setItem(SESSION_FLAG, '1')
  localStorage.setItem(LAST_ACTIVE, String(Date.now()))
}

/** Called on every user interaction to reset the inactivity clock */
export function refreshActivity() {
  if (sessionStorage.getItem(SESSION_FLAG)) {
    localStorage.setItem(LAST_ACTIVE, String(Date.now()))
  }
}

/** Returns true only if the tab session is live AND within the timeout window */
export function isSessionValid() {
  if (!sessionStorage.getItem(SESSION_FLAG)) return false
  const last = parseInt(localStorage.getItem(LAST_ACTIVE) || '0', 10)
  if (!last) return false
  return Date.now() - last < TIMEOUT_MS
}

/** Wipe all auth data */
export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('nestfind_user')
  localStorage.removeItem(LAST_ACTIVE)
  sessionStorage.removeItem(SESSION_FLAG)
}