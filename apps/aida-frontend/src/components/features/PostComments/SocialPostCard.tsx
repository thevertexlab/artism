import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, MapPin, Clock, Heart, MessageCircle, Share2, Copy, EyeOff, Flag, UserMinus } from 'lucide-react';
import InlineCommentSection from './InlineCommentSection';

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

interface SocialPostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  isCommentOpen?: boolean;
  onToggleComment?: (postId: string) => void;
  onCommentsCountChange?: (postId: string, count: number) => void;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({
  post,
  onLike,
  onShare,
  isCommentOpen = false,
  onToggleComment,
  onCommentsCountChange
}) => {
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const handleCommentsCountChange = (count: number) => {
    setCommentsCount(count);
    onCommentsCountChange?.(post.id, count);
  };

  // 处理下拉菜单选项
  const handleDropdownAction = (action: string) => {
    setShowDropdown(false);

    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(window.location.href + '#post-' + post.id);
        // 可以添加提示消息
        break;
      case 'hide':
        console.log('Hide this post:', post.id);
        // 实现隐藏帖子逻辑
        break;
      case 'report':
        console.log('Report post:', post.id);
        // 实现举报逻辑
        break;
      case 'unfollow':
        console.log('Unfollow user:', post.author_id);
        // 实现取消关注逻辑
        break;
    }
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // 获取作者头像
  const getAuthorAvatar = () => {
    if (post.author_avatar) {
      return post.author_avatar;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_id}`;
  };

  // 获取标签颜色
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800'
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* 帖子头部 */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* 作者头像 */}
            <div className="relative">
              <img
                src={getAuthorAvatar()}
                alt={post.author_name || 'Author'}
                className="w-12 h-12 rounded-full object-cover"
              />
              {post.is_verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            
            {/* 作者信息 */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {post.author_name || `AI Artist ${post.author_id}`}
                </h3>
                <span className="text-gray-500 text-sm">
                  @{post.author_username || `ai_artist_${post.author_id}`}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{post.timestamp_display || 'Just now'}</span>
                
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-4 h-4" />
                    <span>{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* 更多选项 */}
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 帖子内容 */}
      <div className="px-4 pb-3">
        {post.title && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h2>
        )}
        
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {post.content}
        </p>
        
        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 帖子图片 */}
      {post.image_url && (
        <div className="px-4 pb-3">
          <img
            src={post.image_url}
            alt="Post content"
            className="w-full rounded-lg object-cover max-h-96"
          />
        </div>
      )}

      {/* 统计信息 */}
      {(likesCount > 0 || commentsCount > 0 || post.views_count > 0) && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {likesCount > 0 && (
                <span>{likesCount} likes</span>
              )}
              {commentsCount > 0 && (
                <span>{commentsCount} comments</span>
              )}
            </div>

            {post.views_count > 0 && (
              <span>{post.views_count} views</span>
            )}
          </div>
        </div>
      )}

      {/* 交互按钮 */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between max-w-md">
          <button
            onClick={() => onToggleComment?.(post.id)}
            className={`flex items-center space-x-2 transition-colors group ${
              isCommentOpen
                ? 'text-blue-500'
                : 'text-gray-600 dark:text-[#8899A6] hover:text-blue-500'
            }`}
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-sm">{commentsCount}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-600 dark:text-[#8899A6] hover:text-green-500 transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-500/10 transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-sm">Share</span>
          </button>

          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors group ${
              isLiked
                ? 'text-red-500'
                : 'text-gray-600 dark:text-[#8899A6] hover:text-red-500'
            }`}
          >
            <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-500/10 transition-colors">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-sm">{likesCount}</span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-600 dark:text-[#8899A6] hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-[#333] transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </button>

            {/* 下拉菜单 */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg shadow-xl z-[9999]"
                   style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                <div className="py-1">
                  <button
                    onClick={() => handleDropdownAction('copy')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors flex items-center gap-3"
                  >
                    <Copy className="w-4 h-4" />
                    复制链接
                  </button>

                  <button
                    onClick={() => handleDropdownAction('hide')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors flex items-center gap-3"
                  >
                    <EyeOff className="w-4 h-4" />
                    不喜欢该内容
                  </button>

                  <button
                    onClick={() => handleDropdownAction('unfollow')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors flex items-center gap-3"
                  >
                    <UserMinus className="w-4 h-4" />
                    取消关注 @{post.author_username || post.author_name}
                  </button>

                  <div className="border-t border-gray-200 dark:border-[#333] my-1"></div>

                  <button
                    onClick={() => handleDropdownAction('report')}
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
        postId={post.id}
        postAuthor={post.author_name || `AI Artist ${post.author_id}`}
        postContent={post.content}
        isOpen={isCommentOpen}
        onClose={() => onToggleComment?.(post.id)}
        onCommentsCountChange={(count) => handleCommentsCountChange(count)}
      />
    </div>
  );
};

export default SocialPostCard;
