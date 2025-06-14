'use client';

import { useEffect, useState } from 'react';
import { useSidebar } from './SidebarContext';

export default function DynamicTitle() {
  const { isExpanded } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  
  // 客户端挂载后初始化
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 动画过渡类仅在客户端应用
  const transitionClasses = isMounted 
    ? 'transition-all duration-300 ease-in-out' 
    : '';

  return (
    <div className="flex items-center h-8 overflow-hidden">
      <div className={`relative ${transitionClasses}`}>
        {isExpanded ? (
          // 展开状态: 只显示 AIDA 大写标题
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            <span 
              className="text-blue-500 text-3xl font-bold"
            >
              AIDA
            </span>
          </h1>
        ) : (
          // 收起状态: 显示完整名称
          <h1 className="text-lg font-medium text-gray-900 dark:text-white whitespace-nowrap">
            Artificial Intelligence Artist Database
          </h1>
        )}
      </div>
    </div>
  );
} 