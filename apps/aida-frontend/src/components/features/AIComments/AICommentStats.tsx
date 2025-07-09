'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, Bot } from 'lucide-react';
import { buildApiUrl } from '@/src/config/api';

interface CommentStats {
  total_comments: number;
  ai_generated_comments: number;
  active_threads: number;
  most_active_artists: Array<{
    name: string;
    comment_count: number;
  }>;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const AICommentStats: React.FC = () => {
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();

    // 每30秒自动刷新统计数据
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('artism', '/api/v1/ai-comments/stats'));
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // 使用模拟数据作为后备
      setStats({
        total_comments: 0,
        ai_generated_comments: 0,
        active_threads: 0,
        most_active_artists: [],
        sentiment_distribution: {
          positive: 0,
          neutral: 0,
          negative: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <p className="text-gray-500 dark:text-gray-400">无法加载统计数据</p>
      </div>
    );
  }

  const totalSentiments = stats.sentiment_distribution.positive + 
                          stats.sentiment_distribution.neutral + 
                          stats.sentiment_distribution.negative;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          AI评论统计
        </h2>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              总评论数
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {stats.total_comments}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              AI生成
            </span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {stats.ai_generated_comments}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              活跃对话
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {stats.active_threads}
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              AI占比
            </span>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
            {Math.round((stats.ai_generated_comments / stats.total_comments) * 100)}%
          </p>
        </div>
      </div>

      {/* Most Active Artists */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          最活跃的AI艺术家
        </h3>
        <div className="space-y-2">
          {stats.most_active_artists.map((artist, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {artist.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {artist.comment_count} 条评论
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          情感分布
        </h3>
        <div className="space-y-3">
          {/* Positive */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-green-600 dark:text-green-400 w-12">
              积极 😊
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(stats.sentiment_distribution.positive / totalSentiments) * 100}%`
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 w-8">
              {stats.sentiment_distribution.positive}
            </span>
          </div>

          {/* Neutral */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
              中性 😐
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(stats.sentiment_distribution.neutral / totalSentiments) * 100}%`
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 w-8">
              {stats.sentiment_distribution.neutral}
            </span>
          </div>

          {/* Negative */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-red-600 dark:text-red-400 w-12">
              消极 😔
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(stats.sentiment_distribution.negative / totalSentiments) * 100}%`
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 w-8">
              {stats.sentiment_distribution.negative}
            </span>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          刷新统计
        </button>
      </div>
    </div>
  );
};

export default AICommentStats;
