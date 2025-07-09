'use client';

import { MantineProvider } from '@mantine/core';
import { ReactNode, useState, useEffect, createContext, useContext } from 'react';

// 创建主题上下文
type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

// 创建通知上下文
type ToastType = 'success' | 'error' | 'info';
type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  hideToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
});

// 自定义主题提供者组件
export function CustomThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 在客户端挂载时检查本地存储的主题设置
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setThemeState(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      // 默认使用暗色主题
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // 设置主题并更新本地存储
  const setTheme = (newTheme: 'light' | 'dark') => {
    // 开始过渡动画
    setIsTransitioning(true);
    
    // 更新状态
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 应用类名
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

// 导出主题钩子
export function useTheme() {
  return useContext(ThemeContext);
}

// 自定义通知提供者组件
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 显示通知
  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // 3秒后自动移除通知 - 添加清理机制
    const timeoutId = setTimeout(() => {
      hideToast(id);
    }, 3000);

    // 存储timeout ID以便清理
    return () => clearTimeout(timeoutId);
  };
  
  // 隐藏通知
  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  
  // 成功通知快捷方法
  const success = (message: string) => showToast(message, 'success');
  
  // 错误通知快捷方法
  const error = (message: string) => showToast(message, 'error');
  
  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      {isMounted && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] ${
                toast.type === 'success'
                  ? 'bg-green-600 text-white'
                  : toast.type === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 dark:bg-[#1A1A1A] text-white'
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => hideToast(toast.id)}
                className="ml-2 text-white/80 hover:text-white"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// 导出通知钩子
export function useToast() {
  const context = useContext(ToastContext);
  
  return {
    toast: {
      success: (message: string) => context.showToast(message, 'success'),
      error: (message: string) => context.showToast(message, 'error'),
      info: (message: string) => context.showToast(message, 'info'),
    }
  };
}

// 内部 Mantine 提供者组件，在主题上下文内使用
function MantineWrapper({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme(); // 现在可以安全地使用 useTheme 钩子
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <MantineProvider
      theme={{
        colorScheme: theme === 'dark' ? 'dark' : 'light',
        primaryColor: 'blue',
      }}
      withNormalizeCSS
      withGlobalStyles
    >
      {isMounted ? children : 
        // 提供一个简单的服务端骨架，避免复杂的嵌套结构
        <div className="bg-gray-50 dark:bg-[#0D0D0D] text-gray-900 dark:text-white min-h-screen antialiased">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      }
    </MantineProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CustomThemeProvider>
      <ToastProvider>
        <MantineWrapper>
          {children}
        </MantineWrapper>
      </ToastProvider>
    </CustomThemeProvider>
  );
} 