'use client';

import { Layout, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const DisplaySettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/settings" className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-[#8899A6]" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">显示设置</h1>
      </div>
      
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow overflow-hidden p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-4">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">界面定制</h2>
            <p className="text-gray-500 dark:text-[#8899A6]">自定义您的显示偏好</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-200 dark:border-[#333]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">布局设置</h3>
            <p className="text-sm text-gray-500 dark:text-[#8899A6] mb-4">选择您喜欢的布局方式</p>
            
            {/* 布局选项 - 示例 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-[#333] rounded-lg p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <div className="h-24 bg-gray-100 dark:bg-[#252525] rounded mb-2 flex items-center justify-center">
                  <div className="w-1/4 h-full bg-gray-200 dark:bg-[#333]"></div>
                  <div className="w-3/4 h-full p-2">
                    <div className="w-full h-1/3 mb-2 bg-gray-200 dark:bg-[#333]"></div>
                    <div className="w-full h-1/2 bg-gray-200 dark:bg-[#333]"></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">标准布局</span>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-[#333] rounded-lg p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <div className="h-24 bg-gray-100 dark:bg-[#252525] rounded mb-2 flex flex-col">
                  <div className="h-1/3 w-full bg-gray-200 dark:bg-[#333]"></div>
                  <div className="h-2/3 w-full p-2 flex">
                    <div className="w-1/4 h-full bg-gray-200 dark:bg-[#333] mr-2"></div>
                    <div className="w-3/4 h-full bg-gray-200 dark:bg-[#333]"></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">紧凑布局</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pb-4 border-b border-gray-200 dark:border-[#333]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">卡片显示</h3>
            <p className="text-sm text-gray-500 dark:text-[#8899A6] mb-4">调整卡片显示方式</p>
            
            {/* 卡片样式选择 - 示例 */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="radio" id="card-large" name="card-size" className="h-4 w-4 text-blue-500" />
                <label htmlFor="card-large" className="ml-2 text-gray-700 dark:text-[#ADBAC7]">大尺寸卡片</label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="card-medium" name="card-size" className="h-4 w-4 text-blue-500" defaultChecked />
                <label htmlFor="card-medium" className="ml-2 text-gray-700 dark:text-[#ADBAC7]">中等尺寸卡片</label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="card-small" name="card-size" className="h-4 w-4 text-blue-500" />
                <label htmlFor="card-small" className="ml-2 text-gray-700 dark:text-[#ADBAC7]">小尺寸卡片</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">动画效果</h3>
            <p className="text-sm text-gray-500 dark:text-[#8899A6] mb-4">控制界面动画</p>
            
            {/* 动画开关 - 示例 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-[#ADBAC7]">启用界面动画</span>
              <div className="w-12 h-6 rounded-full bg-blue-500 dark:bg-[#0066FF] flex items-center">
                <span className="w-5 h-5 rounded-full bg-white transform translate-x-6"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettingsPage; 