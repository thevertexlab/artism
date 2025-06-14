export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Welcome to AIDA
          </h1>
          <p className="text-xl text-gray-600 dark:text-[#8899A6] max-w-3xl mx-auto">
            Explore artists from throughout history and interact with AI-powered virtual artists.
            Discover masterpieces, learn about artistic movements, and engage with AI recreations
            of history's greatest artists.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-gray-200 dark:border-[#333] p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Get Started
          </h2>
          <p className="text-gray-600 dark:text-[#8899A6] mb-8">
            The Artificial Intelligence Artist Database is a comprehensive platform for art exploration.
            Choose from the options below to begin your journey through art history.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/artists"
              className="inline-block px-8 py-4 bg-blue-600 dark:bg-[#0066FF] text-white text-lg font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-[#0052CC] transition-colors shadow-sm"
            >
              Browse Artists
            </a>
            <a
              href="/test"
              className="inline-block px-8 py-4 border-2 border-blue-600 dark:border-[#0066FF] text-blue-600 dark:text-[#0066FF] text-lg font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              Test API
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-gray-200 dark:border-[#333] p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-[#0066FF]/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Artist Database
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#8899A6] mb-6">
              Explore our comprehensive database of artists from throughout history.
            </p>
            <a
              href="/artists"
              className="inline-block px-4 py-2 border border-gray-300 dark:border-[#333] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333] transition-colors text-sm font-medium text-gray-900 dark:text-white"
            >
              Browse Artists →
            </a>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-gray-200 dark:border-[#333] p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              AI Artists Chat
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#8899A6] mb-6">
              Chat with AI recreations of famous artists and learn from them.
            </p>
            <a
              href="/chats"
              className="inline-block px-4 py-2 border border-gray-300 dark:border-[#333] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333] transition-colors text-sm font-medium text-gray-900 dark:text-white"
            >
              Start Chat →
            </a>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-gray-200 dark:border-[#333] p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              API Testing
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#8899A6] mb-6">
              Test the backend API endpoints with GET and POST requests.
            </p>
            <a
              href="/test"
              className="inline-block px-4 py-2 border border-gray-300 dark:border-[#333] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333] transition-colors text-sm font-medium text-gray-900 dark:text-white"
            >
              Test API →
            </a>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-gray-200 dark:border-[#333] p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Data Tables
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#8899A6] mb-6">
              View artist data in table format, displaying MongoDB collections.
            </p>
            <a
              href="/table"
              className="inline-block px-4 py-2 border border-gray-300 dark:border-[#333] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333] transition-colors text-sm font-medium text-gray-900 dark:text-white"
            >
              View Tables →
            </a>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-[#8899A6] mb-4">
            Ready to explore the world of art?
          </p>
          <a
            href="/artists"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#0066FF] dark:to-purple-500 text-white text-lg font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-[#0052CC] dark:hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </div>
  );
}