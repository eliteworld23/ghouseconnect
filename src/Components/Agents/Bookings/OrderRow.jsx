import { useState } from 'react'
import { Clock, CheckCircle, AlertCircle, XCircle, Phone, Mail, Calendar, MapPin } from 'lucide-react'

const STATUS_CONFIG = {
  pending:   { icon: Clock,        bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Pending'   },
  confirmed: { icon: CheckCircle,  bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  label: 'Confirmed' },
  disputed:  { icon: AlertCircle,  bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    label: 'Disputed'  },
  cancelled: { icon: XCircle,      bg: 'bg-gray-50',   text: 'text-gray-500',   border: 'border-gray-200',   label: 'Cancelled' },
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return dateStr }
}

export default function OrderRow({ order, last, onUpdateStatus }) {
  const [agentConfirmed, setAgentConfirmed] = useState(order.agentConfirmed === true)
  const [status, setStatus] = useState(order.status || 'pending')
  const [updating, setUpdating] = useState(false)

  const handleConfirm = async () => {
    setUpdating(true)
    // Optimistic — hide button immediately
    setAgentConfirmed(true)
    setStatus('confirmed')
    await onUpdateStatus(order._id, 'agent_confirmed')
    setUpdating(false)
  }

  const handleDispute = async () => {
    setUpdating(true)
    setStatus('disputed')
    await onUpdateStatus(order._id, 'disputed')
    setUpdating(false)
  }

  const cfg  = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon

  const txId   = (order._id || '').toString().slice(-6).toUpperCase()
  const image  = order.propertyImage || ''
  const title  = order.propertyTitle || 'Property'
  const amount = Number(order.amount) || 0
  const client = order.clientName  || 'Client'
  const phone  = order.clientPhone || ''
  const email  = order.clientEmail || ''
  const date   = formatDate(order.date || order.bookedAt)
  const time   = order.time || ''
  const address = order.propertyAddress || ''

  return (
    <div className={`grid grid-cols-[2fr_1.2fr_1fr_1.4fr_1fr_1.2fr] items-center px-6 py-4 ${!last ? 'border-b border-gray-100' : ''} hover:bg-gray-50/60 transition-colors`}>

      {/* Property info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-12 h-12 flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-gray-100"
            onError={e => { e.target.src = 'https://placehold.co/48x48/e5e7eb/9ca3af?text=?' }}
          />
          {order.priceType === 'rent' && (
            <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1 py-0.5 rounded-full bg-blue-100 text-blue-700 leading-none">RENT</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
          <p className="text-xs font-bold text-blue-600 mt-0.5">₦{amount.toLocaleString()}</p>
          {address && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={10} className="flex-shrink-0" /> {address}
            </p>
          )}
        </div>
      </div>

      {/* Transaction ID */}
      <span className="text-sm font-mono text-gray-500">#{txId}</span>

      {/* Date & time */}
      <div>
        <p className="text-sm text-gray-700 flex items-center gap-1">
          <Calendar size={12} className="text-gray-400" /> {date}
        </p>
        {time && <p className="text-xs text-gray-400 mt-0.5">{time}</p>}
      </div>

      {/* Client */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{client}</p>
        {phone && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Phone size={11} /> {phone}
          </p>
        )}
        {email && !phone && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
            <Mail size={11} /> {email}
          </p>
        )}
      </div>

      {/* Status badge */}
      <div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          <Icon size={12} />
          {cfg.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5">
        {!agentConfirmed && (
          <>
            <button
              onClick={handleConfirm}
              disabled={updating}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: '#1a56db' }}
            >
              <CheckCircle size={12} /> Confirm
            </button>
            <button
              onClick={handleDispute}
              disabled={updating}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
            >
              <AlertCircle size={12} /> Dispute
            </button>
          </>
        )}
        {agentConfirmed && status !== 'disputed' && status !== 'cancelled' && (
          <span className="text-xs text-green-600 font-semibold px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-center">
            ✓ Confirmed
          </span>
        )}
        {status === 'disputed' && (
          <span className="text-xs text-red-600 font-semibold px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-center">
            ⚠ Disputed
          </span>
        )}
        {status === 'cancelled' && (
          <span className="text-xs text-gray-500 font-semibold px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-center">
            Cancelled
          </span>
        )}
      </div>

    </div>
  )
}