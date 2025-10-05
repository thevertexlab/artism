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
  ChevronLeft,
  User,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSidebar } from './SidebarContext';
import { useTheme } from './Providers';
import Logo from './Logo';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isExpanded, toggleSidebar } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string; email: string; avatar?: string} | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Check local storage for login status
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Simple navigation function
  const handleNavigation = (path: string) => {
    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation method
      window.location.href = path;
    }
  };

  // Login function
  const handleLogin = () => {
    // Mock login - should call real authentication API in actual project
    const userData = {
      name: 'Demo User',
      email: 'demo@artism.ai',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  // Signup function
  const handleSignup = () => {
    // Mock signup - should call real registration API in actual project
    const userData = {
      name: 'New User',
      email: 'newuser@artism.ai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    };
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
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
          <Logo className="w-8 h-8" />
          {isExpanded && (
            <span className="text-2xl font-bold text-blue-500">
              AIDA
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

        {/* User Authentication Section */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#333]">
          {isLoggedIn ? (
            // Logged in state
            <>
              {/* User information */}
              <div className={`flex items-center space-x-3 px-3 py-2 mb-2 ${!isExpanded && 'justify-center'}`}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#8899A6] truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                )}
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10
                  ${!isExpanded && 'justify-center'}
                `}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="font-medium">Logout</span>
                )}
              </button>
            </>
          ) : (
            // Not logged in state
            <>
              {/* Login button */}
              <button
                onClick={handleLogin}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-2
                  text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10
                  ${!isExpanded && 'justify-center'}
                `}
              >
                <LogIn className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="font-medium">Login</span>
                )}
              </button>

              {/* Sign up button */}
              <button
                onClick={handleSignup}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10
                  ${!isExpanded && 'justify-center'}
                `}
              >
                <UserPlus className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="font-medium">Sign Up</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;