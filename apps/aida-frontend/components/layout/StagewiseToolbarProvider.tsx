'use client';

import React from 'react';
import { StagewiseToolbar } from '@stagewise/toolbar-next';

export default function StagewiseToolbarProvider() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) return null;
  
  return (
    <StagewiseToolbar
      config={{
        plugins: [], // 可以在这里添加自定义插件
      }}
    />
  );
} 