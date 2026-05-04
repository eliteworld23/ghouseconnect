export default function SectionCard({ title, children }) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        {title && (
          <h2 className="text-base font-semibold text-gray-800 mb-5">{title}</h2>
        )}
        {children}
      </div>
    )
  }