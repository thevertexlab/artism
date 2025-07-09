'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Heart, 
  Eye, 
  Share2, 
  MoreHorizontal,
  Palette,
  Brush,
  Camera,
  Layers,
  Zap,
  Star,
  Award,
  Target,
  BookOpen,
  Lightbulb,
  Compass,
  Map
} from 'lucide-react';

export default function GuidancePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guidance</h1>
              <p className="text-gray-600 dark:text-[#8899A6]">
                Your guide to navigating the AI art community
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-[#8899A6] mb-1">Active Artists</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5K+</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-[#8899A6] mb-1">Artworks Created</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">15.8K+</p>
              </div>
              <Palette className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-[#8899A6] mb-1">Community Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8.2K+</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-[#8899A6] mb-1">Daily Interactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1.2K+</p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guidance Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Explore Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a
                href="/explore"
                className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6 hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Discover AI Art
                    </h3>
                    <p className="text-gray-600 dark:text-[#8899A6] text-sm">
                      Explore amazing AI-generated artworks from talented digital artists
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/artists"
                className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6 hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Connect with Artists
                    </h3>
                    <p className="text-gray-600 dark:text-[#8899A6] text-sm">
                      Follow your favorite AI artists and see their latest creations
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/chats"
                className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6 hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Join Conversations
                    </h3>
                    <p className="text-gray-600 dark:text-[#8899A6] text-sm">
                      Engage with the community through comments and discussions
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/explore"
                className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6 hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Trending Now
                    </h3>
                    <p className="text-gray-600 dark:text-[#8899A6] text-sm">
                      Stay updated with the most popular artworks and artists
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/explore"
                className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6 hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Brush className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Art Techniques
                    </h3>
                    <p className="text-gray-600 dark:text-[#8899A6] text-sm">
                      Learn about different AI art generation techniques and styles
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/artists"
                className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-6 hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Featured Artists
                    </h3>
                    <p className="text-gray-600 dark:text-[#8899A6] text-sm">
                      Discover verified AI artists and their signature styles
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Tips & Tricks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Tips & Tricks</h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-[#333] rounded-lg">
                    <Lightbulb className="w-4 h-4 text-gray-600 dark:text-[#8899A6]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Getting Started
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-[#8899A6]">
                      Start by exploring the Discover page to see trending AI artworks and find artists you'd like to follow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-[#333] rounded-lg">
                    <Compass className="w-4 h-4 text-gray-600 dark:text-[#8899A6]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Navigation Tips
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-[#8899A6]">
                      Use the World Map to explore artists by location, or browse by art styles and movements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-[#333] rounded-lg">
                    <Target className="w-4 h-4 text-gray-600 dark:text-[#8899A6]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Engagement
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-[#8899A6]">
                      Like, comment, and share artworks to support artists and build connections in the community.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-[#333] rounded-lg">
                    <Map className="w-4 h-4 text-gray-600 dark:text-[#8899A6]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Discover More
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-[#8899A6]">
                      Check out the Recent page to see the latest uploads and stay current with new content.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Ready to Start?</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Jump into the community and start discovering amazing AI art!
              </p>
              <div className="space-y-2">
                <a
                  href="/explore"
                  className="block w-full bg-white text-blue-600 text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Explore Artworks
                </a>
                <a
                  href="/artists"
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors border border-blue-400"
                >
                  Find Artists
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
