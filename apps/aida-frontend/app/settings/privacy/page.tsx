'use client';

import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const PrivacySettingsPage = () => {
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [activitySharing, setActivitySharing] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/settings" className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-[#8899A6]" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">隐私设置</h1>
      </div>
      
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow overflow-hidden p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-4">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">隐私控制</h2>
            <p className="text-gray-500 dark:text-[#8899A6]">管理您的隐私和数据选项</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-200 dark:border-[#333]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">个人资料可见性</h3>
            <p className="text-sm text-gray-500 dark:text-[#8899A6] mb-4">控制谁可以查看您的个人资料</p>
            
            {/* 个人资料可见性选项 */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="visibility-public" 
                  name="profile-visibility" 
                  value="public"
                  checked={profileVisibility === 'public'}
                  onChange={() => setProfileVisibility('public')}
                  className="h-4 w-4 text-blue-500" 
                />
                <label htmlFor="visibility-public" className="ml-2 text-gray-700 dark:text-[#ADBAC7]">公开 - 所有人可见</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="visibility-followers" 
                  name="profile-visibility" 
                  value="followers"
                  checked={profileVisibility === 'followers'}
                  onChange={() => setProfileVisibility('followers')}
                  className="h-4 w-4 text-blue-500" 
                />
                <label htmlFor="visibility-followers" className="ml-2 text-gray-700 dark:text-[#ADBAC7]">关注者 - 仅关注您的用户可见</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="visibility-private" 
                  name="profile-visibility" 
                  value="private"
                  checked={profileVisibility === 'private'}
                  onChange={() => setProfileVisibility('private')}
                  className="h-4 w-4 text-blue-500" 
                />
                <label htmlFor="visibility-private" className="ml-2 text-gray-700 dark:text-[#ADBAC7]">私密 - 仅自己可见</label>
              </div>
            </div>
          </div>
          
          <div className="pb-4 border-b border-gray-200 dark:border-[#333]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">活动分享</h3>
            <p className="text-sm text-gray-500 dark:text-[#8899A6] mb-4">控制您的活动如何与其他用户分享</p>
            
            {/* 活动分享开关 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-[#ADBAC7]">分享我的活动与关注者</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ease-in-out ${
                  activitySharing ? 'bg-blue-500 dark:bg-[#0066FF]' : 'bg-gray-200 dark:bg-[#333]'
                }`}
                onClick={() => setActivitySharing(!activitySharing)}
              >
                <span className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                  activitySharing ? 'translate-x-6' : 'translate-x-1'
                }`}></span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">数据收集</h3>
            <p className="text-sm text-gray-500 dark:text-[#8899A6] mb-4">控制我们如何使用您的数据</p>
            
            {/* 数据收集开关 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 dark:text-[#ADBAC7]">允许收集数据以改进服务</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ease-in-out ${
                  dataCollection ? 'bg-blue-500 dark:bg-[#0066FF]' : 'bg-gray-200 dark:bg-[#333]'
                }`}
                onClick={() => setDataCollection(!dataCollection)}
              >
                <span className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                  dataCollection ? 'translate-x-6' : 'translate-x-1'
                }`}></span>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                下载我的数据
              </button>
              <p className="text-xs text-gray-500 dark:text-[#8899A6] mt-2">
                下载包含您在AIDA上的所有数据的副本
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsPage; 