import { useState, useEffect, useCallback } from 'react'

// Normalise: strip trailing slash or /api so we always append /api/v1/... cleanly
const _raw = import.meta.env?.VITE_API_BASE_URL || 'https://gtimeconnect.onrender.com'
const API_BASE = _raw.replace(/\/api\/?$/, '').replace(/\/$/, '')

// Resolve relative image paths from the API to full URLs
const resolveImage = (raw) => {
  if (!raw) return ''
  const str = typeof raw === 'string' ? raw : raw?.url || raw?.src || raw?.path || ''
  if (!str || str === 'null' || str === 'undefined') return ''
  if (str.startsWith('http://') || str.startsWith('https://')) return str
  return `${API_BASE}${str.startsWith('/') ? '' : '/'}${str}`
}

// Normalise a raw booking from the API into a consistent shape
const mapBooking = (b) => ({
  _id:             b._id || b.id || String(Date.now()),
  agentConfirmed:  b.agentConfirmed === true,
  userConfirmed:   b.userConfirmed  === true,
  propertyId:      b.property?._id   || b.property?.id  || b.propertyId  || '',
  propertyTitle:   b.property?.title || b.propertyTitle  || b.title       || 'Property',
  propertyImage:   resolveImage(
    b.property?.images?.[0] || b.property?.image || b.propertyImage || b.image || ''
  ),
  propertyAddress: [
    b.property?.street, b.property?.area, b.property?.city,
    b.property?.state,  b.property?.country,
  ].filter(Boolean).join(', ') || b.propertyAddress || '',
  clientName:  b.user?.name     || b.user?.fullName  || b.userName    || b.clientName  || 'Client',
  clientEmail: b.user?.email    || b.userEmail       || b.clientEmail || '',
  clientPhone: b.user?.phone    || b.userPhone       || b.clientPhone || '',
  agentName:   b.agent?.name    || b.agent?.fullName || b.agentName   || 'Agent',
  date:        b.bookedDate     || b.inspectionDate  || b.date        || '',
  time:        b.startTime      || b.time            || '',
  amount:      b.inspectionFee  || b.amount          || b.price       || b.property?.price || 0,
  priceType:   b.property?.purpose === 'sale' ? 'sale' : 'rent',
  note:        b.notes          || b.note            || '',
  bookedAt:    b.createdAt      || b.bookedAt        || new Date().toISOString(),
  status: (() => {
    const s = (b.status || 'pending').toLowerCase()
    if (s === 'completed')                              return 'user_confirmed' // both confirmed
    if (b.agentConfirmed === true || s === 'agent_confirmed') return 'agent_confirmed'
    if (s.includes('cancel'))                          return 'cancelled'
    if (s.includes('disput'))                          return 'disputed'
    return 'pending'
  })(),
})

export function useOrders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')

      // ✅ Correct endpoint from API docs: /api/v1/agent-bookings
      const res = await fetch(`${API_BASE}/api/v1/booking/agent-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const data = await res.json()

      // Handle multiple possible response shapes:
      // { bookings: [...] }  |  { data: { bookings: [...] } }  |  { data: [...] }  |  [...]
      const raw =
        data.bookings            ||
        data.data?.bookings      ||
        (Array.isArray(data.data) ? data.data : null) ||
        (Array.isArray(data)      ? data      : null) ||
        []

      setOrders(raw.map(mapBooking))
    } catch (err) {
      setError(err.message || 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token')
    // Optimistic update
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o))
    try {
      if (newStatus === 'agent_confirmed') {
        // Must go through escrow endpoint, not generic status
        const res = await fetch(`${API_BASE}/api/v1/escrow/confirm-agent/${id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok && json.success !== true) throw new Error('Confirm failed')
        // Read real flags from response and update order
        const { agentConfirmed, userConfirmed, bookingStatus } = json.data || {}
        const resolvedStatus = bookingStatus === 'completed' || userConfirmed ? 'user_confirmed' : 'agent_confirmed'
        setOrders(prev => prev.map(o =>
          o._id === id
            ? { ...o, status: resolvedStatus, agentConfirmed: true, userConfirmed: userConfirmed ?? o.userConfirmed }
            : o
        ))
      } else {
        const res = await fetch(`${API_BASE}/api/v1/booking/${id}/status`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })
        if (!res.ok) throw new Error('Status update failed')
      }
    } catch (err) {
      console.error('updateStatus error:', err)
      fetchOrders() // re-fetch to restore correct state on failure
    }
  }

  return { orders, loading, error, updateStatus, refetch: fetchOrders }
}