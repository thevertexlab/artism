'use client';

import { 
  Home, 
  Bell, 
  MessageCircle,  
  LogIn, 
  UserPlus,
  Globe,
  Compass,
  Clock,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Server,
  ChevronLeft,
  Menu,
  BellOff,
  Settings,
  MoreHorizontal,
  User,
  HelpCircle,
  FileText,
  Moon,
  Info,
  Share2,
  AlertCircle,
  Languages,
  Layout,
  Paintbrush,
  Shield,
  LogOut,
  BookOpen,
  Heart,
  History,
  ChevronUp,
  Sun
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSidebar } from './SidebarContext';
import { toast } from 'react-hot-toast';
import { useTheme } from './Providers';
import Logo from './Logo';

// 模拟认证状态，实际项目中应使用真实的认证服务
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string; email: string} | null>(null);
  
  // 模拟登录/登出功能
  const login = useCallback(() => {
    setIsLoggedIn(true);
    setUser({name: 'Demo User', email: 'user@example.com'});
    localStorage.setItem('user', JSON.stringify({name: 'Demo User', email: 'user@example.com'}));
    toast.success('Successfully logged in');
  }, []);
  
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Successfully logged out');
  }, []);
  
  // 客户端挂载时检查本地存储的登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);
  
  return { isLoggedIn, user, login, logout };
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isExpanded, toggleSidebar } = useSidebar();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, user, login, logout } = useAuth();
  
  // 添加菜单状态
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // 引用DOM元素以便检测外部点击
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const menuContentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 设置ref的函数
  const setMenuRef = (id: string) => (el: HTMLDivElement | null) => {
    menuRefs.current[id] = el;
  };
  
  // 设置菜单内容ref的函数
  const setMenuContentRef = (id: string) => (el: HTMLDivElement | null) => {
    menuContentRefs.current[id] = el;
  };

  // 确保客户端挂载后再渲染交互元素
  useEffect(() => {
    setIsMounted(true);
    
    // 添加全局点击事件监听器以关闭打开的菜单
    const handleOutsideClick = (event: MouseEvent) => {
      if (activeMenu && menuRefs.current[activeMenu]) {
        const menuElement = menuRefs.current[activeMenu];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setActiveMenu(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activeMenu]);

  // 主要导航项目 - Home, My Chats, Database Access
  const primaryNavItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: MessageCircle, label: 'My Chats', href: '/chats' },
    { icon: Server, label: 'Database Access', href: '/database' },
  ];

  // 次要导航项目 - World Map, Explore, Recent
  const navigationItems = [
    { icon: Globe, label: 'World Map', href: '/world-map' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: Clock, label: 'Recent', href: '/recent' },
  ];

  // 切换主题处理函数
  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`Theme changed to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  // 分享应用链接
  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AIDA - Artificial Intelligence Digital Art',
        text: 'Check out this amazing AI art platform!',
        url: window.location.origin,
      })
      .then(() => toast.success('Shared successfully'))
      .catch((error) => toast.error('Error sharing: ' + error));
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(window.location.origin)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  // 为每个实用工具按钮定义菜单项
  const utilityItems = [
    { 
      id: 'settings',
      icon: Settings, 
      label: 'Settings', 
      href: '/settings'
    },
    { 
      id: 'more',
      icon: MoreHorizontal, 
      label: 'More', 
      menuItems: [
        { 
          icon: HelpCircle, 
          label: 'Help Center', 
          action: () => {
            window.open('/help', '_blank');
            toast.success('Help center opened');
          } 
        },
        { 
          icon: FileText, 
          label: 'Terms of Service', 
          action: () => {
            window.open('/terms', '_blank');
            toast.success('Terms of service opened');
          } 
        },
        { 
          icon: Info, 
          label: 'About', 
          action: () => {
            router.push('/about');
            toast.success('About page');
          } 
        },
        { 
          icon: Share2, 
          label: 'Share AIDA', 
          action: handleShareApp 
        },
        { 
          icon: AlertCircle, 
          label: 'Report an Issue', 
          action: () => {
            window.open('mailto:support@aida-art.com?subject=Issue%20Report', '_blank');
            toast.success('Report email opened');
          } 
        },
      ] 
    },
    { 
      id: 'profile',
      icon: User, 
      label: isLoggedIn ? user?.name || 'Profile' : 'Profile', 
      menuItems: isLoggedIn ? [
        { 
          icon: User, 
          label: 'View Profile', 
          action: () => {
            router.push('/profile');
            toast.success('Profile page');
          } 
        },
        { 
          icon: BookOpen, 
          label: 'My Collections', 
          action: () => {
            router.push('/collections');
            toast.success('Collections page');
          } 
        },
        { 
          icon: Heart, 
          label: 'Favorites', 
          action: () => {
            router.push('/favorites');
            toast.success('Favorites page');
          } 
        },
        { 
          icon: History, 
          label: 'Activity', 
          action: () => {
            router.push('/activity');
            toast.success('Activity page');
          } 
        },
        { 
          icon: LogOut, 
          label: 'Log Out', 
          action: logout,
          danger: true 
        },
      ] : [
        { 
          icon: LogIn, 
          label: 'Log In', 
          action: login 
        },
        { 
          icon: UserPlus, 
          label: 'Register', 
          action: () => {
            router.push('/register');
            toast.success('Register page');
          } 
        }
      ] 
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/aida_art', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com/aida.art', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/aida.art', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/aida_art', label: 'YouTube' },
  ];

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(`Notifications ${notificationsEnabled ? 'disabled' : 'enabled'}`);
  };
  
  // 切换菜单显示状态
  const toggleMenu = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  // 在服务端渲染时，不显示移动设备上的切换按钮和背景遮罩
  // 这样可以确保客户端和服务端渲染的内容保持一致
  const showMobileControls = isMounted;

  return (
    <>
      {/* Mobile Toggle Button - 仅在客户端渲染 */}
      {showMobileControls && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-50 dark:bg-[#1A1A1A] rounded-full text-gray-600 dark:text-[#8899A6] hover:text-gray-900 dark:hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Backdrop - 仅在客户端渲染 */}
      {showMobileControls && isExpanded && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Main Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-40
        ${isExpanded ? 'w-60' : 'w-20'} 
        bg-gray-50 dark:bg-[#0D0D0D] border-r border-gray-100 dark:border-[#1A1A1A] 
        ${isMounted ? 'transition-all duration-300 ease-in-out' : ''}
        ${isMounted && !isExpanded ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Toggle Button - 仅在客户端渲染 */}
          {isMounted && (
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-full items-center justify-center text-gray-600 dark:text-[#8899A6] hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-[#333] z-10"
            >
              <ChevronLeft className={`w-4 h-4 ${isMounted ? 'transition-transform duration-300' : ''} ${isExpanded ? '' : 'rotate-180'}`} />
            </button>
          )}

          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-[#1A1A1A]">
            <Link href="/" className="w-10 h-10 flex items-center justify-center">
              <Logo className="w-10 h-10" />
            </Link>
          </div>

          {/* Content Area - Scrollable */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Primary Navigation - Home, My Chats, Database Access (上面) */}
            <div className="px-4 py-4 border-b border-gray-100 dark:border-[#1A1A1A]">
              <nav className="space-y-1">
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center h-10 px-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-500 dark:bg-[#0066FF] text-white'
                        : 'text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="w-5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                    </div>
                    {/* 服务端始终渲染标签文本，客户端根据状态决定 */}
                    {(!isMounted || isExpanded) && (
                      <span className="font-medium ml-3 truncate">{item.label}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Secondary Navigation - World Map, Explore, Recent (下面) */}
            <div className="px-4 py-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center h-10 px-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-500 dark:bg-[#0066FF] text-white'
                        : 'text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="w-5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                    </div>
                    {/* 服务端始终渲染标签文本，客户端根据状态决定 */}
                    {(!isMounted || isExpanded) && (
                      <span className="font-medium ml-3 truncate">{item.label}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom Fixed Section */}
          <div className="border-t border-gray-100 dark:border-[#1A1A1A] bg-gray-50 dark:bg-[#0D0D0D]">
            {/* Auth Buttons - 登录前显示，登录后隐藏 */}
            {!isLoggedIn && (
              <div className="px-4 py-4">
                {/* 在服务端渲染完整版，客户端根据状态决定 */}
                {(!isMounted || isExpanded) ? (
                  <div className="space-y-2">
                    <button 
                      onClick={login}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 dark:bg-[#0066FF] text-white rounded-lg hover:bg-blue-600 dark:hover:bg-[#0052CC] transition-colors"
                    >
                      <LogIn className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Login</span>
                    </button>
                    <button 
                      onClick={() => router.push('/register')}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-100 dark:border-[#1A1A1A] text-gray-600 dark:text-[#8899A6] rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <UserPlus className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Register</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <button 
                      onClick={login}
                      className="w-10 h-10 flex items-center justify-center bg-blue-500 dark:bg-[#0066FF] text-white rounded-lg hover:bg-blue-600 dark:hover:bg-[#0052CC] transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Toggle */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-[#1A1A1A]">
              <button 
                onClick={toggleNotifications}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  notificationsEnabled 
                    ? 'bg-blue-500 dark:bg-[#0066FF] text-white' 
                    : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#8899A6]'
                }`}
              >
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <BellOff className="w-5 h-5 flex-shrink-0" />
                )}
                {/* 服务端始终渲染文本，客户端根据状态决定 */}
                {(!isMounted || isExpanded) && (
                  <span className="font-medium ml-3 truncate">
                    {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
                  </span>
                )}
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-[#1A1A1A]">
              <button 
                onClick={handleToggleTheme}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Moon className="w-5 h-5 flex-shrink-0" />
                )}
                {/* 服务端始终渲染文本，客户端根据状态决定 */}
                {(!isMounted || isExpanded) && (
                  <span className="font-medium ml-3 truncate">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
              </button>
            </div>

            {/* Utility Items (从TopBar移动过来的图标) - 带上拉菜单 */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-[#1A1A1A]">
              {(!isMounted || isExpanded) ? (
                <div className="space-y-1">
                  {utilityItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="relative"
                      ref={setMenuRef(item.id)}
                    >
                      {/* 上拉菜单 - 仅对没有href的项目显示 */}
                      {activeMenu === item.id && !item.href && (
                        <div 
                          ref={setMenuContentRef(item.id)}
                          className="absolute bottom-full left-0 right-0 mb-1 py-1 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#333] rounded-lg shadow-lg z-50 overflow-auto"
                        >
                          <div className="px-4 py-2 border-b border-gray-100 dark:border-[#333] text-gray-900 dark:text-white font-medium">{item.label}</div>
                          {item.menuItems?.map((menuItem, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                menuItem.action();
                                setActiveMenu(null); // 点击后关闭菜单
                              }}
                              className={`w-full flex items-center px-4 py-2 ${
                                menuItem.danger 
                                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                  : 'text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#252525]'
                              } hover:text-gray-900 dark:hover:text-white transition-colors text-left`}
                            >
                              <menuItem.icon className="w-4 h-4 flex-shrink-0 mr-3" />
                              <span className="truncate">{menuItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {item.href ? (
                        <Link
                          href={item.href}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white transition-colors`}
                        >
                          <div className="flex items-center">
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium ml-3 truncate">{item.label}</span>
                          </div>
                        </Link>
                      ) : (
                        <button
                          onClick={() => toggleMenu(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white transition-colors ${
                            activeMenu === item.id ? 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium ml-3 truncate">{item.label}</span>
                          </div>
                          <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${
                            activeMenu === item.id ? '' : 'rotate-180'
                          }`} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  {utilityItems.map((item) => (
                    <div 
                      key={item.id}
                      className="relative"
                      ref={setMenuRef(item.id)}
                    >
                      {/* 上拉菜单 (收起状态) - 仅对没有href的项目显示 */}
                      {activeMenu === item.id && !item.href && (
                        <div 
                          ref={setMenuContentRef(item.id)}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 py-1 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#333] rounded-lg shadow-lg z-50 w-48 overflow-auto"
                        >
                          <div className="px-4 py-2 border-b border-gray-100 dark:border-[#333] text-gray-900 dark:text-white font-medium">{item.label}</div>
                          {item.menuItems?.map((menuItem, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                menuItem.action();
                                setActiveMenu(null); // 点击后关闭菜单
                              }}
                              className={`w-full flex items-center px-4 py-2 ${
                                menuItem.danger 
                                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                  : 'text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#252525]'
                              } hover:text-gray-900 dark:hover:text-white transition-colors text-left`}
                            >
                              <menuItem.icon className="w-4 h-4 flex-shrink-0 mr-3" />
                              <span className="truncate">{menuItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {item.href ? (
                        <Link
                          href={item.href}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white`}
                        >
                          <item.icon className="w-5 h-5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => toggleMenu(item.id)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                            activeMenu === item.id 
                              ? 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white' 
                              : 'text-gray-600 dark:text-[#8899A6] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className={`px-4 py-4 border-t border-gray-100 dark:border-[#1A1A1A] ${(isMounted && !isExpanded) ? 'flex justify-center' : ''}`}>
              <div className={`flex ${(!isMounted || isExpanded) ? 'justify-center space-x-4' : 'flex-col items-center space-y-4'}`}>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-[#8899A6] hover:text-blue-500 dark:hover:text-[#0066FF] transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 