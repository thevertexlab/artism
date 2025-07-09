'use client';

import { useState } from 'react';
import {
  Layout,
  Bell,
  Shield,
  Languages,
  Sun,
  Moon,
  ChevronRight,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/layout/Providers';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // 切换主题处理函数
  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`主题已更改为${theme === 'dark' ? '浅色' : '深色'}模式`);
  };

  // 切换通知状态
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(`通知已${notificationsEnabled ? '关闭' : '开启'}`);
  };

  const settingsItems = [
    {
      icon: User,
      label: '账户设置',
      description: '管理个人资料、注册和登录',
      href: '/settings/account'
    },
    {
      icon: Layout,
      label: '显示设置',
      description: '自定义界面显示效果',
      href: '/settings/display'
    },
    {
      icon: Bell,
      label: '通知设置',
      description: `当前状态: ${notificationsEnabled ? '开启' : '关闭'}`,
      action: toggleNotifications,
      isToggle: true,
      toggleState: notificationsEnabled
    },
    {
      icon: Shield,
      label: '隐私设置',
      description: '管理您的隐私选项',
      href: '/settings/privacy'
    },
    {
      icon: Languages,
      label: '语言设置',
      description: '更改显示语言',
      href: '/settings/language'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">设置</h1>
      
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow overflow-hidden mb-6">
        {/* 日间/夜间模式切换开关 */}
        <div className="p-4 border-b border-gray-200 dark:border-[#333]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-4">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">主题设置</h3>
                <p className="text-sm text-gray-500 dark:text-[#8899A6]">
                  当前主题: {theme === 'dark' ? '深色' : '浅色'}
                </p>
              </div>
            </div>
            <div 
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ease-in-out ${
                theme === 'dark' ? 'bg-blue-500 dark:bg-[#0066FF]' : 'bg-gray-200 dark:bg-[#333]'
              }`}
              onClick={handleToggleTheme}
            >
              <span className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-[#333]">
          {settingsItems.map((item, index) => (
            <div key={index} className="p-4">
              {item.href ? (
                <Link 
                  href={item.href}
                  className="flex items-center justify-between w-full group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-4">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-[#8899A6]">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-[#8899A6] group-hover:text-gray-500 dark:group-hover:text-white transition-colors" />
                </Link>
              ) : (
                <button 
                  onClick={item.action}
                  className="flex items-center justify-between w-full group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-4">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-[#8899A6]">{item.description}</p>
                    </div>
                  </div>
                  {item.isToggle && (
                    <div className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ease-in-out ${
                      item.toggleState ? 'bg-blue-500 dark:bg-[#0066FF]' : 'bg-gray-200 dark:bg-[#333]'
                    }`}>
                      <span className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        item.toggleState ? 'translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </div>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 