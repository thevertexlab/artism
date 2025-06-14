'use client';

import { Server, Database, Palette, Users } from 'lucide-react';
import Link from 'next/link';

export default function DatabasePage() {
  const databaseLinks = [
    {
      title: 'Artists Database',
      description: 'Browse all artists in the database',
      icon: Database,
      url: 'http://localhost:8000/api/docs#/artists',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Artworks Database',
      description: 'Browse all artworks in the database',
      icon: Palette,
      url: 'http://localhost:8000/api/docs#/artworks',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'AI Artists Database',
      description: 'Browse all AI artists in the database',
      icon: Users,
      url: 'http://localhost:8000/api/docs#/ai_artists',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'API Documentation',
      description: 'Full API documentation',
      icon: Server,
      url: 'http://localhost:8000/api/docs',
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Database Access</h1>
          <p className="text-gray-600 dark:text-[#8899A6]">Access the backend database through these API endpoints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {databaseLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6 hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${link.color}`}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{link.title}</h3>
                  <p className="text-gray-600 dark:text-[#8899A6]">{link.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How to use the API</h3>
          <div className="space-y-4 text-gray-600 dark:text-[#8899A6]">
            <p>
              1. Click on any of the links above to access the specific database section.
            </p>
            <p>
              2. Use the Swagger UI to test API endpoints directly in your browser.
            </p>
            <p>
              3. For programmatic access, use the base URL: <code className="bg-gray-100 dark:bg-[#0D0D0D] px-2 py-1 rounded">http://localhost:8000/api/v1</code>
            </p>
            <p>
              4. Authentication may be required for certain endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 