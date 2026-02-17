"use client"

export function IndianFlag() {
  return (
    <div className="relative inline-flex gap-0 h-12 w-20 rounded-md overflow-hidden shadow-lg flag-wave">
      <div className="flex-1 bg-orange-500"></div>
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-4 border-blue-600 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
      </div>
      <div className="flex-1 bg-green-600"></div>
    </div>
  )
}
