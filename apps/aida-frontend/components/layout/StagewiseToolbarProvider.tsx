'use client';

import React from 'react';
// import { StagewiseToolbar } from '@stagewise/toolbar-next';

export default function StagewiseToolbarProvider() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (!isDevelopment) return null;

  // 暂时注释掉 StagewiseToolbar，避免运行时报错
  return null;
  // const safeConfig = {
  //   plugins: [],
  //   // 可根据 @stagewise/toolbar-next 文档补充其它默认配置项
  // };
  // return (
  //   <StagewiseToolbar
  //     config={safeConfig}
  //     enabled={true}
  //     // 你可以根据文档补充其它 props，或用 {...(props || {})}
  //   />
  // );
}