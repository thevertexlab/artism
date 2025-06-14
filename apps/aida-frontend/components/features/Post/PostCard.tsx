'use client';

import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, MapPin } from 'lucide-react';
import Image from 'next/image';

interface PostCardProps {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  location?: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked?: boolean;
  isReposted?: boolean;
}

const PostCard = ({
  user,
  content,
  image,
  timestamp,
  location,
  likes,
  comments,
  reposts,
  isLiked = false,
  isReposted = false,
}: PostCardProps) => {
  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg p-6 hover:border-[#333] transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Image
            src={user.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{user.name}</h3>
              <span className="text-[#8899A6]">@{user.username}</span>
              <span className="text-[#8899A6]">·</span>
              <span className="text-[#8899A6]">{timestamp}</span>
            </div>
            {location && (
              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="w-3 h-3 text-[#8899A6]" />
                <span className="text-xs text-[#8899A6]">{location}</span>
              </div>
            )}
          </div>
        </div>
        <button className="p-1 text-[#8899A6] hover:text-white hover:bg-[#1A1A1A] rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{content}</p>
      </div>

      {/* Image */}
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]">
        <button className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
          isLiked 
            ? 'text-red-500 hover:bg-red-500/10' 
            : 'text-[#8899A6] hover:text-red-500 hover:bg-red-500/10'
        }`}>
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">{likes}</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-2 rounded-full text-[#8899A6] hover:text-[#1D9BF0] hover:bg-[#1D9BF0]/10 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{comments}</span>
        </button>

        <button className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
          isReposted 
            ? 'text-green-500 hover:bg-green-500/10' 
            : 'text-[#8899A6] hover:text-green-500 hover:bg-green-500/10'
        }`}>
          <Repeat2 className="w-5 h-5" />
          <span className="text-sm">{reposts}</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-2 rounded-full text-[#8899A6] hover:text-[#1D9BF0] hover:bg-[#1D9BF0]/10 transition-colors">
          <Share className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PostCard; 