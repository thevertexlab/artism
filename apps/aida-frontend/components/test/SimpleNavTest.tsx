'use client';

import { useRouter } from 'next/navigation';

const SimpleNavTest = () => {
  const router = useRouter();

  const testRoutes = [
    { path: '/', label: 'Home' },
    { path: '/chats', label: 'Chats' },
    { path: '/database', label: 'Database' },
    { path: '/world-map', label: 'World Map' },
    { path: '/explore', label: 'Explore' },
    { path: '/recent', label: 'Recent' },
    { path: '/guidance', label: 'Guidance' },
  ];

  const handleNavClick = (path: string, label: string) => {
    console.log(`Testing navigation to: ${path} (${label})`);
    try {
      router.push(path);
      console.log(`Navigation successful: ${path}`);
    } catch (error) {
      console.error(`Navigation failed: ${path}`, error);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Navigation Test
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {testRoutes.map((route) => (
          <button
            key={route.path}
            onClick={() => handleNavClick(route.path, route.label)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            {route.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SimpleNavTest;
