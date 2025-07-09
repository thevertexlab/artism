'use client';

import { Search } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useEffect, useState } from 'react';

const TopBar = () => {
  const { isExpanded } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 客户端挂载检测
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 处理搜索
  const handleSearch = () => {
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      // 这里可以添加搜索逻辑，比如跳转到搜索结果页面
      // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  // 处理回车键搜索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // 获取过渡动画类，仅在客户端应用
  const transitionClass = isMounted ? 'transition-all duration-300 ease-in-out' : '';

  return (
    <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-gray-50 dark:bg-[#0D0D0D] border-b border-gray-100 dark:border-[#1A1A1A] flex items-center">
      {/* 搜索框容器 - 居中布局，考虑侧边栏宽度 */}
      <div className={`
        flex-1 flex justify-center
        ${transitionClass}
        ${isExpanded ? 'lg:ml-64' : 'lg:ml-16'}
      `}>
        {/* 保持与页面内容相同的宽度限制 */}
        <div className="w-full max-w-4xl px-4">
          <div className="relative w-full flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-[#8899A6] w-4 h-4" />
              <input
                type="text"
                placeholder="Search artists, artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-l-full py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#8899A6] focus:outline-none focus:border-blue-500 dark:focus:border-[#0066FF] w-full"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-[#0066FF] dark:hover:bg-blue-600 text-white px-4 py-2 rounded-r-full border border-blue-500 dark:border-[#0066FF] transition-colors flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 右侧空白区域 - 提供对称性 */}
      <div className="w-auto md:w-1/4 lg:w-1/5 pr-6"></div>
    </div>
  );
};

export default TopBar; 