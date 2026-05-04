/**
 * useSessionTimeout.js
 *
 * Clears auth tokens and redirects to the landing page after
 * TIMEOUT_MS of user inactivity (default: 10 minutes).
 *
 * Usage:
 *   import useSessionTimeout from './useSessionTimeout';
 *   // Inside any component that requires authentication:
 *   useSessionTimeout();
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

/** Keys written during login – wipe all of them on timeout */
const SESSION_KEYS = ['token', 'user', 'nestfind_user', 'GHOUSECONNECT_user'];

const clearSession = () => {
  SESSION_KEYS.forEach((k) => localStorage.removeItem(k));
};

/**
 * @param {object}  [options]
 * @param {number}  [options.timeoutMs=600000]  Inactivity threshold in ms.
 * @param {string}  [options.redirectTo='/']    Where to send the user on timeout.
 * @param {boolean} [options.requireAuth=true]  Skip timer if user is not logged in.
 */
const useSessionTimeout = ({
  timeoutMs = TIMEOUT_MS,
  redirectTo = '/',
  requireAuth = true,
} = {}) => {
  const navigate  = useNavigate();
  const timerRef  = useRef(null);

  const isLoggedIn = () => {
    try {
      const token = localStorage.getItem('token');
      return !!(token && token !== 'undefined' && token !== 'null');
    } catch {
      return false;
    }
  };

  const logout = useCallback(() => {
    clearSession();
    navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo]);

  const resetTimer = useCallback(() => {
    // If this hook only applies to authenticated users, bail out when
    // there is no active session (avoids a redirect loop on public pages).
    if (requireAuth && !isLoggedIn()) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, timeoutMs);
  }, [logout, timeoutMs, requireAuth]);

  useEffect(() => {
    // Don't attach listeners if the user isn't logged in and the hook is
    // configured to be auth-only.
    if (requireAuth && !isLoggedIn()) return;

    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'wheel',
      'visibilitychange',
    ];

    // Start the initial countdown.
    resetTimer();

    const handleActivity = () => resetTimer();

    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [resetTimer, requireAuth]);
};

export default useSessionTimeout;