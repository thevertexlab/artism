'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// 动态导入地图组件以避免SSR问题
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  isOnline: boolean;
  lastSeen: string;
  artStyle: string;
}

// 创建自定义头像图标
const createAvatarIcon = (avatarUrl: string, isOnline: boolean) => {
  // 动态导入 Leaflet 以避免 SSR 问题
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  
  const iconHtml = `
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid ${isOnline ? '#10B981' : '#6B7280'};
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      position: relative;
    ">
      <img 
        src="${avatarUrl}" 
        alt="Avatar"
        style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        "
        onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTggMTJDMTAuMjA5MSAxMiAxMiAxMC4yMDkxIDEyIDhDMTIgNS43OTA5IDEwLjIwOTEgNCA4IDRDNS43OTA5IDQgNCA1Ljc5MDkgNCA4QzQgMTAuMjA5MSA1Ljc5MDkgMTIgOCAxMloiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+Cjwvc3ZnPgo='"
      />
      ${isOnline ? `
        <div style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #10B981;
          border: 2px solid white;
          border-radius: 50%;
        "></div>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-avatar-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

export default function WorldMapPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [startingChatWith, setStartingChatWith] = useState<string | null>(null);
  const router = useRouter();

  // 处理开始聊天
  const handleStartChat = async (user: User) => {
    setStartingChatWith(user.id);

    // 将用户信息编码为URL参数
    const userParams = new URLSearchParams({
      newChat: 'true',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userLocation: `${user.location.city}, ${user.location.country}`,
      artStyle: user.artStyle,
      isOnline: user.isOnline.toString()
    });

    // 添加一个小延迟以显示加载状态
    await new Promise(resolve => setTimeout(resolve, 500));

    // 跳转到聊天页面
    router.push(`/chats?${userParams.toString()}`);
  };

  useEffect(() => {
    setIsClient(true);
    
    // Mock data for users around the world - 使用更稳定的头像图片
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Leonardo da Vinci',
        username: 'leonardo_ai',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        location: { lat: 43.7696, lng: 11.2558, city: 'Florence', country: 'Italy' },
        isOnline: true,
        lastSeen: 'now',
        artStyle: 'Renaissance'
      },
      {
        id: '2',
        name: 'Vincent van Gogh',
        username: 'vincent_ai',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        location: { lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands' },
        isOnline: false,
        lastSeen: '2h ago',
        artStyle: 'Post-Impressionism'
      },
      {
        id: '3',
        name: 'Pablo Picasso',
        username: 'pablo_ai',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        location: { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
        isOnline: true,
        lastSeen: 'now',
        artStyle: 'Cubism'
      },
      {
        id: '4',
        name: 'Frida Kahlo',
        username: 'frida_ai',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        location: { lat: 19.4326, lng: -99.1332, city: 'Mexico City', country: 'Mexico' },
        isOnline: true,
        lastSeen: 'now',
        artStyle: 'Surrealism'
      },
      {
        id: '5',
        name: 'Claude Monet',
        username: 'claude_ai',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
        location: { lat: 49.0758, lng: 1.5339, city: 'Giverny', country: 'France' },
        isOnline: false,
        lastSeen: '1h ago',
        artStyle: 'Impressionism'
      },
      {
        id: '6',
        name: 'Hokusai',
        username: 'hokusai_ai',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
        location: { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
        isOnline: true,
        lastSeen: 'now',
        artStyle: 'Ukiyo-e'
      }
    ];
    
    setUsers(mockUsers);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-gray-900 dark:text-white">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">World Map</h1>
          <p className="text-gray-600 dark:text-[#8899A6]">Discover AI artists from around the world</p>
        </div>
        
        <div className="bg-white dark:bg-[#1A1A1A] rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {users.map((user) => {
              const icon = createAvatarIcon(user.avatar, user.isOnline);
              if (!icon) return null;
              
              return (
                <Marker
                  key={user.id}
                  position={[user.location.lat, user.location.lng]}
                  icon={icon}
                >
                <Popup>
                  <div className="user-popup p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-12 h-12 rounded-full border-2 ${
                          user.isOnline ? 'border-green-500' : 'border-gray-400'
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA5IDE0LjIwOTEgNCAxMiA0QzkuNzkwOSA0IDggNS43OTA5IDggOEM4IDEwLjIwOTEgOS43OTA5IDEyIDEyIDEyWiIgZmlsbD0iIzlDQTRBRiIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMzQwMSAxNCA1IDE3LjEzNCA1IDIxSDMuNUMzLjUgMTYuMzA1NiA3LjMwNTU4IDEyLjUgMTIgMTIuNUMxNi42OTQ0IDEyLjUgMjAuNSAxNi4zMDU2IDIwLjUgMjFIMTlDMTkgMTcuMTM0IDE1Ljg2NiAxNCAxMiAxNFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900">{user.location.city}, {user.location.country}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Art Style:</span>
                        <span className="text-gray-900">{user.artStyle}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Status:</span>
                        <span className={`flex items-center space-x-1 ${
                          user.isOnline ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <span>{user.isOnline ? 'Online' : `Last seen ${user.lastSeen}`}</span>
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleStartChat(user)}
                      disabled={startingChatWith === user.id}
                      className={`w-full mt-3 py-2 px-4 rounded-lg transition-colors ${
                        startingChatWith === user.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#0066FF] hover:bg-[#0052CC]'
                      } text-white`}
                    >
                      {startingChatWith === user.id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Starting Chat...
                        </div>
                      ) : (
                        'Start Chat'
                      )}
                    </button>
                  </div>
                </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-lg">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Online Artists</h3>
            <p className="text-blue-500 dark:text-[#0066FF] text-2xl font-bold">{users.filter(u => u.isOnline).length}</p>
          </div>
          
          <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-lg">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Total Artists</h3>
            <p className="text-blue-500 dark:text-[#0066FF] text-2xl font-bold">{users.length}</p>
          </div>
          
          <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-lg">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Countries</h3>
            <p className="text-blue-500 dark:text-[#0066FF] text-2xl font-bold">
              {new Set(users.map(u => u.location.country)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 