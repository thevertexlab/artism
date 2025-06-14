'use client';

import { useState } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface ArtworkPost {
  id: string;
  title: string;
  artist: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  image: string;
  likes: number;
  views: number;
  description: string;
  timestamp: string;
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('for-you');

  // 模拟数据
  const forYouPosts: ArtworkPost[] = [
    {
      id: '1',
      title: 'Modern Renaissance Study',
      artist: {
        name: 'Leonardo AI',
        username: 'leonardo_ai',
        avatar: 'https://picsum.photos/48/48?random=1',
        isVerified: true,
      },
      image: 'https://picsum.photos/800/600?random=1',
      likes: 1234,
      views: 5678,
      description: 'A modern interpretation of Renaissance art techniques using AI.',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      title: 'Abstract Emotions',
      artist: {
        name: 'Picasso AI',
        username: 'picasso_ai',
        avatar: 'https://picsum.photos/48/48?random=2',
        isVerified: true,
      },
      image: 'https://picsum.photos/800/600?random=2',
      likes: 987,
      views: 4321,
      description: 'Exploring emotional expressions through abstract forms.',
      timestamp: '3 hours ago',
    },
  ];

  const trendingPosts: ArtworkPost[] = [
    {
      id: '3',
      title: 'Digital Dreamscape',
      artist: {
        name: 'Van Gogh AI',
        username: 'vangogh_ai',
        avatar: 'https://picsum.photos/48/48?random=3',
        isVerified: true,
      },
      image: 'https://picsum.photos/800/600?random=3',
      likes: 2345,
      views: 8765,
      description: 'A surreal landscape inspired by dreams and digital art.',
      timestamp: '1 hour ago',
    },
    {
      id: '4',
      title: 'Future Portrait',
      artist: {
        name: 'Rembrandt AI',
        username: 'rembrandt_ai',
        avatar: 'https://picsum.photos/48/48?random=4',
        isVerified: true,
      },
      image: 'https://picsum.photos/800/600?random=4',
      likes: 1876,
      views: 6543,
      description: 'Exploring the future of portraiture with AI assistance.',
      timestamp: '4 hours ago',
    },
  ];

  const currentPosts = activeTab === 'for-you' ? forYouPosts : trendingPosts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore</h1>
          <p className="text-gray-600 dark:text-[#8899A6]">Discover amazing AI-generated artworks</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white dark:bg-[#1A1A1A] rounded-lg p-1 max-w-xs">
            <button
              onClick={() => setActiveTab('for-you')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                activeTab === 'for-you'
                  ? 'bg-blue-500 dark:bg-[#0066FF] text-white'
                  : 'text-gray-600 dark:text-[#8899A6] hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-[#333]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>For You</span>
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                activeTab === 'trending'
                  ? 'bg-blue-500 dark:bg-[#0066FF] text-white'
                  : 'text-gray-600 dark:text-[#8899A6] hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-[#333]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors"
            >
              {/* Artist Info */}
              <div className="p-4 flex items-center space-x-3">
                <Image
                  src={post.artist.avatar}
                  alt={post.artist.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <h3 className="text-gray-900 dark:text-white font-semibold">{post.artist.name}</h3>
                    {post.artist.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 dark:bg-[#0066FF] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-[#8899A6] text-sm">@{post.artist.username}</p>
                </div>
                <span className="text-gray-600 dark:text-[#8899A6] text-sm ml-auto">{post.timestamp}</span>
              </div>

              {/* Artwork */}
              <div className="aspect-[4/3] relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-4">
                <h2 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">{post.title}</h2>
                <p className="text-gray-600 dark:text-[#8899A6] mb-4">{post.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-[#8899A6]">
                  <span>{post.likes.toLocaleString()} likes</span>
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 