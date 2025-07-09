'use client';

import SimpleSidebar from '../../components/layout/SimpleSidebar';

export default function TestNavPage() {
  return (
    <div className="flex h-screen">
      <SimpleSidebar />
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Navigation Test Page
          </h1>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Simple Navigation Test
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This page uses a completely simplified sidebar component that bypasses all the complex state management.
              It uses direct window.location.href for navigation instead of Next.js router.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Try clicking the navigation items in the left sidebar. Check the browser console for navigation logs.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Test Instructions:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Open browser developer tools (F12)</li>
              <li>Go to the Console tab</li>
              <li>Click any navigation item in the left sidebar</li>
              <li>Check if navigation works without errors</li>
              <li>Observe console logs for navigation attempts</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
