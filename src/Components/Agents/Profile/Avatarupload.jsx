import { useRef } from 'react'

export default function AvatarUpload({ preview, onFileChange, disabled = false }) {
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file && onFileChange) onFileChange(file)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-36 h-36 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-14 h-14 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}
      </div>

      {!disabled && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition w-36 text-center"
          >
            Update Picture
          </button>
          <p className="text-xs text-gray-400">Minimum size 300 x 300 px</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </>
      )}
    </div>
  )
}