'use client';

import { Search } from 'lucide-react';
import DynamicTitle from './DynamicTitle';
import { useSidebar } from './SidebarContext';
import { useEffect, useState } from 'react';

const TopBar = () => {
  const { isExpanded } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  
  // 客户端挂载检测
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 获取过渡动画类，仅在客户端应用
  const transitionClass = isMounted ? 'transition-all duration-300 ease-in-out' : '';

  return (
    <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-gray-50 dark:bg-[#0D0D0D] border-b border-gray-100 dark:border-[#1A1A1A] flex items-center">
      {/* Title Section - 根据侧边栏状态调整左侧边距 */}
      <div className={`
        flex items-center overflow-hidden
        ${transitionClass}
        ${isExpanded ? 'lg:ml-[calc(240px+1rem)]' : 'lg:ml-[calc(80px+1rem)]'} 
        ml-8 w-auto md:w-1/4 lg:w-1/5
      `}>
        <DynamicTitle />
      </div>

      {/* 搜索框容器 - 简单的中央布局 */}
      <div className="flex-1 flex justify-center">
        {/* 保持与页面内容相同的宽度限制 */}
        <div className="w-full max-w-4xl px-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-[#8899A6] w-4 h-4" />
            <input
              type="text"
              placeholder="Search artists, artworks..."
              className="bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-full py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#8899A6] focus:outline-none focus:border-blue-500 dark:focus:border-[#0066FF] w-full"
            />
          </div>
        </div>
      </div>

      {/* 右侧空白区域 - 提供对称性 */}
      <div className="w-auto md:w-1/4 lg:w-1/5 pr-6"></div>
    </div>
  );
};

export default TopBar; 