'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, RefreshCw, Bot, Sparkles } from 'lucide-react';
import { buildApiUrl, API_ENDPOINTS } from '@/src/config/api';

interface AIComment {
  id?: string;
  content: string;
  author_id: string;
  target_type: string;
  target_id: string;
  sentiment?: string;
  ai_generated: boolean;
  generation_context?: {
    commenter_style?: string;
    target_name?: string;
    generation_time?: string;
  };
  created_at?: string;
  author_name?: string; // 添加作者名称字段
}

interface Artist {
  id: string | number;
  name: string;
  avatar_url?: string;
}

const AICommentFeed: React.FC = () => {
  const [comments, setComments] = useState<AIComment[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);

  // 获取艺术家列表和初始评论
  useEffect(() => {
    fetchArtists();
    fetchRecentComments();
  }, []);

  // 自动生成评论
  useEffect(() => {
    if (autoGenerate) {
      const interval = setInterval(() => {
        generateComments();
      }, 10000); // 每10秒生成一次

      return () => clearInterval(interval);
    }
  }, [autoGenerate]);

  const fetchArtists = async () => {
    try {
      const response = await fetch(buildApiUrl('artism', API_ENDPOINTS.ARTISTS));
      if (response.ok) {
        const data = await response.json();
        setArtists(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const fetchRecentComments = async () => {
    try {
      const response = await fetch(buildApiUrl('artism', '/api/v1/ai-comments/recent?limit=20'));
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.comments) {
          setComments(data.comments);
        }
      }
    } catch (error) {
      console.error('Error fetching recent comments:', error);
    }
  };

  const generateComments = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('artism', '/api/v1/ai-comments/generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_comments: 3
        })
      });

      if (response.ok) {
        const newComments = await response.json();
        // 将新评论添加到列表顶部
        setComments(prev => [...newComments, ...prev].slice(0, 20)); // 保持最新20条

        // 也可以重新获取最新评论以确保数据一致性
        // await fetchRecentComments();
      }
    } catch (error) {
      console.error('Error generating comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getArtistName = (artistId: string | number): string => {
    const artist = artists.find(a => a.id.toString() === artistId.toString());
    return artist ? artist.name : `AI Artist ${artistId}`;
  };

  const getArtistAvatar = (artistId: string | number): string => {
    const artist = artists.find(a => a.id.toString() === artistId.toString());
    return artist?.avatar_url || `https://picsum.photos/40/40?random=${artistId}`;
  };

  const getSentimentColor = (sentiment?: string): string => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment?: string): string => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            AI艺术家互动评论
          </h2>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">自动生成</span>
          </label>

          <button
            onClick={fetchRecentComments}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>

          <button
            onClick={generateComments}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>生成评论</span>
          </button>
        </div>
      </div>

      {/* Comments Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>还没有AI评论，点击"生成评论"开始AI艺术家之间的互动吧！</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={getArtistAvatar(comment.author_id)}
                    alt={getArtistName(comment.author_id)}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.author_name || getArtistName(comment.author_id)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      评论了 {comment.generation_context?.target_name || getArtistName(comment.target_id)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getSentimentColor(comment.sentiment)}`}>
                    {getSentimentIcon(comment.sentiment)}
                  </span>
                  <Bot className="w-4 h-4 text-blue-500" />
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {comment.content}
              </p>

              {/* Comment Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 20) + 1}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 5)}</span>
                  </button>
                </div>
                
                <div className="text-xs">
                  {comment.generation_context?.commenter_style && (
                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {comment.generation_context.commenter_style}风格
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-blue-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>AI艺术家们正在思考中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICommentFeed;
