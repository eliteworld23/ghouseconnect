import { CheckCircle, AlertCircle, Clock } from 'lucide-react'
import OrderRow from './OrderRow'

export default function OrdersTable({ orders, onUpdateStatus }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.2fr_1fr_1.4fr_1fr_1.2fr] px-6 py-3 border-b border-gray-100 bg-gray-50">
        {['PRODUCT INFO', 'TRANSACTION ID', 'DATE', 'CLIENT', 'STATUS', 'ACTIONS'].map(col => (
          <span key={col} className="text-xs font-semibold text-gray-400 tracking-wider">{col}</span>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">No orders found.</div>
      ) : (
        orders.map((order, i) => (
          <OrderRow key={order._id || order.id} order={order} last={i === orders.length - 1} onUpdateStatus={onUpdateStatus} />
        ))
      )}
    </div>
  )
}