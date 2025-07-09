'use client';

import { ReactNode } from 'react';
import { useSidebar } from './SidebarContext';

interface MainContentProps {
  children: ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const { isExpanded } = useSidebar();

  return (
    <div 
      className={`
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'ml-64' : 'ml-16'}
      `}
    >
      {children}
    </div>
  );
};

export default MainContent;
