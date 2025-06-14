'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-orange-600">Oops!</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Something went wrong</h2>
          <p className="text-gray-600">
            We encountered an error while loading this page.
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => reset()}
            className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            Try again
          </button>
          
          <a 
            href="/"
            className="block px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors duration-200"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  )
} 