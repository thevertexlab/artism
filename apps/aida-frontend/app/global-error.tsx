'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
          <div className="text-center space-y-6 max-w-md mx-auto px-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-red-600">500</h1>
              <h2 className="text-2xl font-semibold text-gray-800">Something went wrong!</h2>
              <p className="text-gray-600">
                An unexpected error occurred. Please try again.
              </p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => reset()}
                className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Try again
              </button>
              
              <a 
                href="/"
                className="block px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                Go back home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 