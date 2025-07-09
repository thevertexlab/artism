'use client';

import {
  Home,
  MessageCircle,
  Server,
  Globe,
  Compass,
  Clock,
  Settings,
  Bell,
  BellOff,
  Sun,
  Moon,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSidebar } from './SidebarContext';
import { useTheme } from './Providers';
import Logo from './Logo';

const SimpleSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isExpanded, toggleSidebar } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 简单的导航函数
  const handleNavigation = (path: string) => {
    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // 备用导航方法
      window.location.href = path;
    }
  };

  const mainMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageCircle, label: 'My Chats', path: '/chats' },
    { icon: Server, label: 'Database Access', path: '/database' },
    { icon: Globe, label: 'World Map', path: '/world-map' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Clock, label: 'Recent', path: '/recent' }
  ];

  const bottomMenuItems = [
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-[#333]
      transition-all duration-300 ease-in-out z-50
      ${isExpanded ? 'w-64' : 'w-16'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#333]">
        <div className={`flex items-center space-x-3 ${!isExpanded && 'justify-center'}`}>
          <Logo />
          {isExpanded && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Artism
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
        >
          {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#333] hover:text-gray-900 dark:hover:text-white'
                  }
                  ${!isExpanded && 'justify-center'}
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 dark:border-[#333]">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`
            w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
            text-gray-700 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#333] hover:text-gray-900 dark:hover:text-white
            ${!isExpanded && 'justify-center'}
          `}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {isExpanded && (
            <span className="font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Notifications Toggle */}
        <button
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className={`
            w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mt-2
            text-gray-700 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#333] hover:text-gray-900 dark:hover:text-white
            ${!isExpanded && 'justify-center'}
          `}
        >
          {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          {isExpanded && (
            <span className="font-medium">
              {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
            </span>
          )}
        </button>

        {/* Settings */}
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mt-2
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#333] hover:text-gray-900 dark:hover:text-white'
                }
                ${!isExpanded && 'justify-center'}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleSidebar;