'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Sparkles, X } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  isAI: boolean;
  avatar: string;
}

interface InlineCommentSectionProps {
  postId: string;
  postAuthor: string;
  postContent: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentsCountChange?: (count: number) => void;
}

const InlineCommentSection: React.FC<InlineCommentSectionProps> = ({
  postId,
  postAuthor,
  postContent,
  isOpen,
  onClose,
  onCommentsCountChange
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`;
    return `${Math.floor(minutes / 1440)}天前`;
  };

  // 生成AI评论
  const generateAIComment = () => {
    setIsLoading(true);

    const aiArtists = [
      { name: 'Leonardo AI', avatar: 'https://picsum.photos/40/40?random=10' },
      { name: 'Claude Monet AI', avatar: 'https://picsum.photos/40/40?random=11' },
      { name: 'Pablo Picasso AI', avatar: 'https://picsum.photos/40/40?random=12' },
      { name: 'Vincent van Gogh AI', avatar: 'https://picsum.photos/40/40?random=13' },
      { name: 'Salvador Dalí AI', avatar: 'https://picsum.photos/40/40?random=14' }
    ];

    const aiComments = [
      '这个作品的色彩运用非常巧妙，让我想起了印象派的光影变化。',
      '构图很有张力，线条的流动性表达了强烈的情感。',
      '这种抽象的表现手法很有现代感，技法娴熟。',
      '光影的处理很到位，营造出了很好的氛围感。',
      '色彩的对比度掌握得很好，视觉冲击力很强。',
      '这个创意很独特，打破了传统的表现形式。',
      '笔触的运用很有个性，能感受到艺术家的情感投入。'
    ];

    // 清理之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const randomArtist = aiArtists[Math.floor(Math.random() * aiArtists.length)];
      const randomComment = aiComments[Math.floor(Math.random() * aiComments.length)];

      const aiComment: Comment = {
        id: `ai-${Date.now()}`,
        author: randomArtist.name,
        content: randomComment,
        timestamp: new Date().toISOString(),
        likes: Math.floor(Math.random() * 20) + 1,
        isAI: true,
        avatar: randomArtist.avatar
      };

      setComments(prev => [aiComment, ...prev]);
      onCommentsCountChange?.(comments.length + 1);
      setIsLoading(false);
      timeoutRef.current = null;
    }, 1500);
  };

  // 添加用户评论
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const userComment: Comment = {
      id: `user-${Date.now()}`,
      author: "当前用户",
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isAI: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
    };
    
    setComments(prev => [userComment, ...prev]);
    onCommentsCountChange?.(comments.length + 1);
    setNewComment('');
  };

  // 点赞功能
  const handleLike = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  // 更新评论数量 - 移除 onCommentsCountChange 依赖以避免无限循环
  useEffect(() => {
    onCommentsCountChange?.(comments.length);
  }, [comments.length]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="border-t border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#333]">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-600 dark:text-[#8899A6]" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            评论 ({comments.length})
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* AI评论生成按钮 */}
          <button
            onClick={generateAIComment}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? '生成中...' : 'AI评论'}
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-[#8899A6] dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-h-96 overflow-y-auto">
        {/* 评论输入框 */}
        <div className="p-4 border-b border-gray-200 dark:border-[#333]">
          <div className="flex gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
              alt="用户头像"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-[#333] bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#8899A6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 评论列表 */}
        <div className="p-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-[#8899A6]">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-[#555]" />
              <p>还没有评论，来写下第一条评论吧！</p>
              <p className="text-sm mt-1">或者点击上方按钮让AI艺术家来评论</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.avatar}
                    alt={`${comment.author}的头像`}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800 dark:text-white text-sm">
                          {comment.author}
                        </span>
                        {comment.isAI && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 text-xs rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-[#8899A6]">
                          {formatTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-[#D9D9D9] text-sm mb-2">{comment.content}</p>
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1 text-gray-500 dark:text-[#8899A6] hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InlineCommentSection;
