import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Send, Smile } from 'lucide-react';
import { buildApiUrl } from '../../../config/api';

interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_name?: string;
  sentiment?: string;
  ai_generated: boolean;
  created_at: string;
  replies?: Comment[];
  reply_count?: number;
  generation_context?: {
    commenter_style?: string;
    post_title?: string;
    post_author?: string;
  };
}

interface PostCommentSectionProps {
  postId: string;
  initialCommentsCount?: number;
  onCommentsCountChange?: (count: number) => void;
}

const PostCommentSection: React.FC<PostCommentSectionProps> = ({
  postId,
  initialCommentsCount = 0,
  onCommentsCountChange
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [autoCommentEnabled, setAutoCommentEnabled] = useState(false);

  // 获取评论
  const fetchComments = async () => {
    if (!showComments) return;
    
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('artism', `/api/v1/posts/${postId}/comments?limit=20`));
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.comments) {
          setComments(data.comments);
          setCommentsCount(data.total);
          onCommentsCountChange?.(data.total);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成AI评论
  const generateAIComments = async () => {
    setLoading(true);
    try {
      // 首先尝试自动评论API
      const response = await fetch(buildApiUrl('artism', `/api/v1/ai-comments/auto-comment/${postId}?comment_count=3`), {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.comments && data.comments.length > 0) {
          // 刷新评论列表
          await fetchComments();
          return;
        }
      }

      // 如果API失败，生成模拟评论
      const mockComments = generateMockComments();
      setComments(mockComments);
      setCommentsCount(mockComments.length);
      onCommentsCountChange?.(mockComments.length);

    } catch (error) {
      console.error('Error generating AI comments:', error);

      // 生成模拟评论作为后备
      const mockComments = generateMockComments();
      setComments(mockComments);
      setCommentsCount(mockComments.length);
      onCommentsCountChange?.(mockComments.length);
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟评论
  const generateMockComments = (): Comment[] => {
    const mockArtists = [
      { id: '1', name: 'AI Leonardo da Vinci', style: 'classical' },
      { id: '2', name: 'AI Pablo Picasso', style: 'modern' },
      { id: '3', name: 'AI Claude Monet', style: 'impressionist' },
      { id: '4', name: 'AI Vincent van Gogh', style: 'expressionist' },
      { id: '5', name: 'AI Salvador Dalí', style: 'surrealist' }
    ];

    const commentTemplates = [
      "这个作品体现了{style}的精髓，技法运用很有创意。",
      "从{style}的角度来看，这种表现手法很有启发性。",
      "色彩的运用让我想起了{style}时期的经典作品。",
      "这种创新精神正是现代艺术所需要的，很有{style}的特色。",
      "技术与艺术的结合在这里得到了完美体现，{style}风格很明显。"
    ];

    const sentiments = ['positive', 'positive', 'neutral', 'positive']; // 大部分是积极的

    return Array.from({ length: 3 }, (_, index) => {
      const artist = mockArtists[Math.floor(Math.random() * mockArtists.length)];
      const template = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      const content = template.replace('{style}', artist.style);
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

      return {
        id: `mock-${Date.now()}-${index}`,
        content,
        author_id: artist.id,
        author_name: artist.name,
        sentiment,
        ai_generated: true,
        created_at: new Date().toISOString(),
        generation_context: {
          commenter_style: artist.style,
          post_title: 'Mock Post',
          post_author: 'Mock Author'
        }
      };
    });
  };

  // 切换评论显示
  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchComments();
    }
  };

  // 点赞评论
  const toggleCommentLike = (commentId: string) => {
    const newLikedComments = new Set(likedComments);
    if (likedComments.has(commentId)) {
      newLikedComments.delete(commentId);
    } else {
      newLikedComments.add(commentId);
    }
    setLikedComments(newLikedComments);
  };

  // 开始回复
  const startReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  // 取消回复
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // 自动生成评论（定时）
  const startAutoComments = () => {
    setAutoCommentEnabled(true);

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% 概率生成评论
        generateAIComments();
      }
    }, 15000); // 每15秒检查一次

    // 30秒后停止自动生成
    setTimeout(() => {
      setAutoCommentEnabled(false);
      clearInterval(interval);
    }, 30000);
  };

  // 获取情感标识颜色
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      case 'neutral': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  // 获取艺术风格标签颜色
  const getStyleColor = (style?: string) => {
    switch (style) {
      case 'classical': return 'bg-amber-100 text-amber-800';
      case 'impressionist': return 'bg-blue-100 text-blue-800';
      case 'modern': return 'bg-purple-100 text-purple-800';
      case 'surrealist': return 'bg-pink-100 text-pink-800';
      case 'abstract': return 'bg-indigo-100 text-indigo-800';
      case 'expressionist': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      {/* 互动按钮 */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">Like</span>
          </button>
          
          <button 
            onClick={toggleComments}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{commentsCount} Comments</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={generateAIComments}
            disabled={loading}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Generating...' : 'AI Comment'}
          </button>

          <button
            onClick={startAutoComments}
            disabled={loading || autoCommentEnabled}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              autoCommentEnabled
                ? 'bg-green-500 text-white'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            } disabled:opacity-50`}
          >
            {autoCommentEnabled ? 'Auto On' : 'Auto AI'}
          </button>

          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 评论区域 */}
      {showComments && (
        <div className="px-4 pb-4">
          {/* 评论输入框 */}
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500"
              />
              <button className="text-gray-400 hover:text-gray-600">
                <Smile className="w-4 h-4" />
              </button>
              <button 
                disabled={!newComment.trim()}
                className="text-blue-500 hover:text-blue-600 disabled:text-gray-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 评论列表 */}
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  {/* 头像 */}
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">
                      {comment.author_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  
                  {/* 评论内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {comment.author_name || `AI Artist ${comment.author_id}`}
                        </span>
                        
                        {comment.ai_generated && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                            AI
                          </span>
                        )}
                        
                        {comment.generation_context?.commenter_style && (
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStyleColor(comment.generation_context.commenter_style)}`}>
                            {comment.generation_context.commenter_style}
                          </span>
                        )}
                        
                        {comment.sentiment && (
                          <span className={`text-xs ${getSentimentColor(comment.sentiment)}`}>
                            ●
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {comment.content}
                      </p>
                    </div>
                    
                    {/* 评论操作 */}
                    <div className="flex items-center space-x-4 mt-1 px-3">
                      <span className="text-xs text-gray-500">
                        {formatTime(comment.created_at)}
                      </span>

                      <button
                        onClick={() => toggleCommentLike(comment.id)}
                        className={`flex items-center space-x-1 text-xs font-medium transition-colors ${
                          likedComments.has(comment.id)
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                        <span>Like</span>
                        {likedComments.has(comment.id) && <span className="text-xs">1</span>}
                      </button>

                      <button
                        onClick={() => startReply(comment.id)}
                        className="text-xs text-gray-500 hover:text-blue-500 font-medium transition-colors"
                      >
                        Reply
                      </button>

                      {comment.ai_generated && (
                        <span className="text-xs text-blue-500 font-medium">
                          AI Generated
                        </span>
                      )}
                    </div>
                    
                    {/* 回复输入框 */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 px-3">
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">U</span>
                          </div>
                          <input
                            type="text"
                            placeholder={`Reply to ${comment.author_name || 'AI Artist'}...`}
                            className="flex-1 bg-transparent border-none outline-none text-xs placeholder-gray-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                // 这里可以添加发送回复的逻辑
                                cancelReply();
                              }
                            }}
                          />
                          <button
                            onClick={cancelReply}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 回复 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs">
                                {reply.author_name?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-xs text-gray-900 dark:text-white">
                                  {reply.author_name || `AI Artist ${reply.author_id}`}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTime(reply.created_at)}
                                </span>
                                {reply.ai_generated && (
                                  <span className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                    AI
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-800 dark:text-gray-200">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No comments yet</p>
                  <p className="text-xs">Be the first to comment or generate AI comments!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCommentSection;
