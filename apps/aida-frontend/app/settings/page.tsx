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

  // Theme toggle handler function
  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`Theme changed to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  // Toggle notification status
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(`Notifications ${notificationsEnabled ? 'disabled' : 'enabled'}`);
  };

  const settingsItems = [
    {
      icon: User,
      label: 'Account Settings',
      description: 'Manage personal profile, registration and login',
      href: '/settings/account'
    },
    {
      icon: Layout,
      label: 'Display Settings',
      description: 'Customize interface display effects',
      href: '/settings/display'
    },
    {
      icon: Bell,
      label: 'Notification Settings',
      description: `Current status: ${notificationsEnabled ? 'Enabled' : 'Disabled'}`,
      action: toggleNotifications,
      isToggle: true,
      toggleState: notificationsEnabled
    },
    {
      icon: Shield,
      label: 'Privacy Settings',
      description: 'Manage your privacy options',
      href: '/settings/privacy'
    },
    {
      icon: Languages,
      label: 'Language Settings',
      description: 'Change display language',
      href: '/settings/language'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow overflow-hidden mb-6">
        {/* Day/Night mode toggle switch */}
        <div className="p-4 border-b border-gray-200 dark:border-[#333]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-4">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme Settings</h3>
                <p className="text-sm text-gray-500 dark:text-[#8899A6]">
                  Current theme: {theme === 'dark' ? 'Dark' : 'Light'}
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