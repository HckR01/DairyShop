"use client"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M6.343 6.343a9 9 0 000 12.728M9.172 9.172a5 5 0 000 7.072M12 12h.01"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">You're Offline</h1>
        <p className="mt-2 text-gray-500 max-w-sm">
          No internet connection. Please check your network and try again. 
          Your cart and account data are saved locally.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
      >
        Try Again
      </button>
      <p className="text-sm text-gray-400">DairyFresh — Farm Fresh Dairy Delivered</p>
    </div>
  )
}
