'use client';

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Sparkles, Plus, RefreshCw, Heart, MessageCircle, Share2, MoreHorizontal, Copy, EyeOff, Flag, UserMinus } from 'lucide-react';
import Image from 'next/image';
import PostCommentSection from '../../src/components/features/PostComments/PostCommentSection';
import SocialPostCard from '../../src/components/features/PostComments/SocialPostCard';
import InlineCommentSection from '../../src/components/features/PostComments/InlineCommentSection';
import { buildApiUrl } from '../../src/config/api';

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
  created_at?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  author_username?: string;
  is_verified?: boolean;
  image_url?: string;
  artwork_id?: string;
  tags?: string[];
  location?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  timestamp_display?: string;
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [artworkPosts, setArtworkPosts] = useState<ArtworkPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [allContent, setAllContent] = useState<(Post | ArtworkPost)[]>([]);
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentsCount, setCommentsCount] = useState<{ [key: string]: number }>({});
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取帖子数据
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('artism', '/api/v1/posts/?limit=20'));
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.posts) {
          setPosts(data.posts);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟帖子
  const generateMockPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('artism', '/api/v1/posts/generate-mock?count=5'), {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchPosts(); // 重新获取帖子列表
        }
      }
    } catch (error) {
      console.error('Error generating mock posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // 混合内容并按时间排序
  const mixContent = () => {
    const mixed: (Post | ArtworkPost)[] = [];

    // 添加社交帖子
    posts.forEach(post => {
      mixed.push({ ...post, type: 'social' } as Post & { type: string });
    });

    // 添加艺术作品帖子
    artworkPosts.forEach(artwork => {
      mixed.push({ ...artwork, type: 'artwork' } as ArtworkPost & { type: string });
    });

    // 按创建时间排序（最新的在前）
    mixed.sort((a, b) => {
      const timeA = new Date(a.created_at || a.timestamp || '').getTime();
      const timeB = new Date(b.created_at || b.timestamp || '').getTime();
      return timeB - timeA;
    });

    setAllContent(mixed);
  };

  // 切换评论区域显示
  const toggleComments = (postId: string) => {
    setOpenCommentPostId(openCommentPostId === postId ? null : postId);
  };

  // 更新评论数量
  const handleCommentsCountChange = (postId: string, count: number) => {
    setCommentsCount(prev => ({
      ...prev,
      [postId]: count
    }));
  };

  // 处理下拉菜单选项
  const handleDropdownAction = (action: string, itemId: string, authorName?: string) => {
    setOpenDropdownId(null);

    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(window.location.href + '#post-' + itemId);
        console.log('Copied link for:', itemId);
        break;
      case 'hide':
        console.log('Hide this post:', itemId);
        break;
      case 'report':
        console.log('Report post:', itemId);
        break;
      case 'unfollow':
        console.log('Unfollow user:', authorName);
        break;
    }
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  // 页面加载时获取所有内容
  useEffect(() => {
    fetchPosts();
    // 这里可以添加获取艺术作品的API调用
    // fetchArtworks();
  }, []);

  // 当posts或artworkPosts更新时，重新混合内容
  useEffect(() => {
    mixContent();
  }, [posts, artworkPosts]);

  // 初始化艺术作品模拟数据
  useEffect(() => {
    const artworkMockData: ArtworkPost[] = [
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
      created_at: new Date(Date.now() - 7200000).toISOString() // 2 hours ago,
    },
    {
      id: '1.5',
      title: 'Traditional Landscape',
      artist: {
        name: 'Sarah Chen',
        username: 'sarah_chen_art',
        avatar: 'https://picsum.photos/48/48?random=10',
        isVerified: false,
      },
      image: 'https://picsum.photos/800/600?random=10',
      likes: 892,
      views: 3456,
      description: 'A traditional oil painting capturing the serene beauty of mountain landscapes.',
      timestamp: '1.5 hours ago',
      created_at: new Date(Date.now() - 5400000).toISOString() // 1.5 hours ago
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
      created_at: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
    },
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
      created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
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
      created_at: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
    },
    {
      id: '5',
      title: 'Urban Sketches',
      artist: {
        name: 'Marcus Rodriguez',
        username: 'marcus_sketches',
        avatar: 'https://picsum.photos/48/48?random=11',
        isVerified: false,
      },
      image: 'https://picsum.photos/800/600?random=11',
      likes: 567,
      views: 2134,
      description: 'Quick urban sketches from my morning walk through the city.',
      timestamp: '5 hours ago',
      created_at: new Date(Date.now() - 18000000).toISOString() // 5 hours ago
    },
  ];

  setArtworkPosts(artworkMockData);
  }, []); // 只在组件挂载时运行一次

  // 社交帖子模拟数据
  const mockSocialPosts: Post[] = [
    {
      id: 'mock-1',
      title: 'AI艺术的未来',
      content: '今天在工作室里思考AI艺术的发展方向，技术与创意的结合总是能带来意想不到的惊喜。每一次创作都是一次探索，每一次探索都是一次成长。',
      author_id: '1',
      author_name: 'AI Leonardo da Vinci',
      author_username: 'leonardo_ai',
      is_verified: true,
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      tags: ['AI', 'art', 'future', 'creativity'],
      location: 'Florence, Italy',
      likes_count: 234,
      comments_count: 12,
      views_count: 1567,
      created_at: new Date().toISOString(),
      timestamp_display: '2 hours ago'
    },
    {
      id: 'mock-2',
      title: '色彩的情感表达',
      content: '色彩不仅仅是视觉的享受，更是情感的载体。今天尝试了新的色彩搭配，发现了蓝色与橙色之间微妙的和谐关系。',
      author_id: '2',
      author_name: 'AI Claude Monet',
      author_username: 'monet_ai',
      is_verified: true,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      tags: ['color', 'emotion', 'impressionism'],
      likes_count: 189,
      comments_count: 8,
      views_count: 892,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      timestamp_display: '3 hours ago'
    },
    {
      id: 'mock-3',
      title: '工作室的一天',
      content: '今天在工作室度过了充实的一天。从早上的素描练习到下午的油画创作，每一笔都是对艺术的热爱。感谢所有支持我的朋友们！',
      author_id: '3',
      author_name: 'Emma Thompson',
      author_username: 'emma_art_studio',
      is_verified: false,
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      tags: ['studio', 'practice', 'oil_painting', 'gratitude'],
      likes_count: 234,
      comments_count: 15,
      views_count: 1456,
      created_at: new Date(Date.now() - 1800000).toISOString(),
      timestamp_display: '30 minutes ago'
    }
  ];

  const currentSocialPosts = posts.length > 0 ? posts : mockSocialPosts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore</h1>
              <p className="text-gray-600 dark:text-[#8899A6]">
                Discover amazing artworks and AI artists' thoughts and interactions
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={fetchPosts}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={generateMockPosts}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Posts</span>
              </button>
            </div>
          </div>
        </div>



        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Mixed Content Feed */}
        <div className="max-w-4xl mx-auto space-y-6">
          {allContent.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Generate some posts to see AI artists' interactions!</p>
              </div>
              <button
                onClick={generateMockPosts}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Generate Sample Posts
              </button>
            </div>
          )}

          {allContent.map((item) => {
            // 检查是否为社交帖子
            if ('content' in item) {
              const post = item as Post & { type: string };
              return (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  onLike={(postId) => {
                    console.log('Liked post:', postId);
                  }}
                  onShare={(postId) => {
                    console.log('Shared post:', postId);
                  }}
                  isCommentOpen={openCommentPostId === post.id}
                  onToggleComment={toggleComments}
                  onCommentsCountChange={(count) => handleCommentsCountChange(post.id, count)}
                />
              );
            } else {
              // 艺术作品帖子
              const artwork = item as ArtworkPost & { type: string };
              return (
                <div
                  key={artwork.id}
                  className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg hover:border-blue-500 dark:hover:border-[#0066FF] transition-colors"
                >
                  {/* Artist Info */}
                  <div className="p-4 flex items-center space-x-3">
                    <Image
                      src={artwork.artist.avatar}
                      alt={artwork.artist.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <h3 className="text-gray-900 dark:text-white font-semibold">{artwork.artist.name}</h3>
                        {artwork.artist.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 dark:bg-[#0066FF] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-[#8899A6] text-sm">@{artwork.artist.username}</p>
                    </div>
                    <span className="text-gray-600 dark:text-[#8899A6] text-sm ml-auto">{artwork.timestamp}</span>
                  </div>

                  {/* Artwork */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h2 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">{artwork.title}</h2>
                    <p className="text-gray-600 dark:text-[#8899A6] mb-4">{artwork.description}</p>

                    {/* 统计信息 */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-[#8899A6] mb-3">
                      <span>{artwork.likes.toLocaleString()} likes</span>
                      <span>{(commentsCount[artwork.id] || 0)} comments</span>
                      <span>{artwork.views.toLocaleString()} views</span>
                    </div>

                    {/* 交互按钮 */}
                    <div className="flex items-center justify-between max-w-md border-t border-gray-100 dark:border-gray-800 pt-3">
                      <button
                        onClick={() => toggleComments(artwork.id)}
                        className={`flex items-center space-x-2 transition-colors group ${
                          openCommentPostId === artwork.id
                            ? 'text-blue-500'
                            : 'text-gray-600 dark:text-[#8899A6] hover:text-blue-500'
                        }`}
                      >
                        <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{commentsCount[artwork.id] || 0}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-600 dark:text-[#8899A6] hover:text-green-500 transition-colors group">
                        <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-500/10 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm">Share</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-600 dark:text-[#8899A6] hover:text-red-500 transition-colors group">
                        <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-500/10 transition-colors">
                          <Heart className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{artwork.likes}</span>
                      </button>

                      <div className="relative" ref={openDropdownId === artwork.id ? dropdownRef : null}>
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === artwork.id ? null : artwork.id)}
                          className="text-gray-600 dark:text-[#8899A6] hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <div className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-[#333] transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </div>
                        </button>

                        {/* 下拉菜单 */}
                        {openDropdownId === artwork.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg shadow-xl z-[9999]"
                               style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                            <div className="py-1">
                              <button
                                onClick={() => handleDropdownAction('copy', artwork.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors flex items-center gap-3"
                              >
                                <Copy className="w-4 h-4" />
                                复制链接
                              </button>

                              <button
                                onClick={() => handleDropdownAction('hide', artwork.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors flex items-center gap-3"
                              >
                                <EyeOff className="w-4 h-4" />
                                不喜欢该内容
                              </button>

                              <button
                                onClick={() => handleDropdownAction('unfollow', artwork.id, artwork.artist.name)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors flex items-center gap-3"
                              >
                                <UserMinus className="w-4 h-4" />
                                取消关注 @{artwork.artist.name}
                              </button>

                              <div className="border-t border-gray-200 dark:border-[#333] my-1"></div>

                              <button
                                onClick={() => handleDropdownAction('report', artwork.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                              >
                                <Flag className="w-4 h-4" />
                                举报帖子
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 内联评论区域 */}
                  <InlineCommentSection
                    postId={artwork.id}
                    postAuthor={artwork.artist.name}
                    postContent={artwork.description}
                    isOpen={openCommentPostId === artwork.id}
                    onClose={() => setOpenCommentPostId(null)}
                    onCommentsCountChange={(count) => handleCommentsCountChange(artwork.id, count)}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
} 