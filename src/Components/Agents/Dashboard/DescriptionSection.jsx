// src/components/DescriptionSection.jsx
import { useRef } from "react";

const BTNS = [
  { title: "Bold",         icon: <b className="text-xs">B</b>,   cmd: "bold" },
  { title: "Italic",       icon: <i className="text-xs">I</i>,   cmd: "italic" },
  { title: "Bullet List",  icon: "≡",  cmd: "insertUnorderedList" },
  { title: "Ordered List", icon: "1.", cmd: "insertOrderedList" },
  { title: "Quote",        icon: "\u201C", cmd: null },
  { title: "Align Left",   icon: "⬱", cmd: "justifyLeft" },
  { title: "Align Center", icon: "☰", cmd: "justifyCenter" },
  { title: "Align Right",  icon: "⬰", cmd: "justifyRight" },
  { title: "Link",         icon: "⛓", cmd: null },
  { title: "Table",        icon: "⊞", cmd: null },
];

export default function DescriptionSection({ data, onChange }) {
  const editorRef = useRef(null);
  const exec = (cmd) => { if (cmd) { document.execCommand(cmd, false, null); editorRef.current?.focus(); } };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-5">
      <h2 className="text-[15px] font-bold text-[#0b1a2e] mb-4 sm:mb-5 pb-3 border-b border-gray-100">
        Description
      </h2>

      <div className="mb-4 sm:mb-5">
        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
          Property Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter your property title"
          value={data.propertyTitle}
          onChange={(e) => onChange("propertyTitle", e.target.value)}
          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[13.5px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition">
        {/* Toolbar */}
        <div className="px-2 sm:px-3 py-2 bg-gray-50 border-b border-gray-200">
          {/* Top row: paragraph select + Visual/Text toggle */}
          <div className="flex items-center justify-between mb-1.5 sm:mb-0 sm:inline-flex sm:w-full sm:justify-start sm:gap-1">
            <select className="h-7 px-2 border border-gray-200 rounded-md text-xs bg-white text-gray-700 outline-none cursor-pointer">
              <option>Paragraph</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
            </select>

            {/* Visual/Text toggle — shown inline on mobile, pushed right on sm+ */}
            <div className="flex gap-1 sm:ml-auto">
              <button type="button" className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 text-white">
                Visual
              </button>
              <button type="button" className="px-2.5 py-1 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100 transition">
                Text
              </button>
            </div>
          </div>

          {/* Formatting buttons row */}
          <div className="flex items-center gap-0.5 flex-wrap sm:inline-flex sm:gap-1 sm:mt-0 mt-1">
            <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1" />
            {BTNS.map((btn) => (
              <button
                key={btn.title}
                type="button"
                title={btn.title}
                onMouseDown={(e) => { e.preventDefault(); exec(btn.cmd); }}
                className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-md text-gray-500 text-xs hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition touch-manipulation"
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Write your property description here..."
          onInput={(e) => onChange("description", e.currentTarget.innerHTML)}
          className="min-h-[140px] sm:min-h-[160px] p-3 sm:p-4 text-[13.5px] text-gray-900 outline-none leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
        />
      </div>
    </div>
  );
}