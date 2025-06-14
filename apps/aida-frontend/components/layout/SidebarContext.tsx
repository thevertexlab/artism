'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

// 创建默认值，确保服务端和客户端初始状态一致
const defaultContextValue: SidebarContextType = {
  isExpanded: true,
  toggleSidebar: () => {},
};

const SidebarContext = createContext<SidebarContextType>(defaultContextValue);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  // 使用确定的初始状态，与服务端保持一致
  const [isExpanded, setIsExpanded] = useState(defaultContextValue.isExpanded);
  const [isMounted, setIsMounted] = useState(false);

  // 仅在客户端使用
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  return context;
}; 