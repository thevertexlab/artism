import React from 'react';
import ConnectionTest from '../components/ConnectionTest';

const ConnectionTestPage: React.FC = () => {
  return (
    <div className="page-container">
      {/* 标题栏 */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">系统连接测试</h1>
        
        <div className="flex space-x-2">
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-sm">
            开发模式
          </span>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="p-4">
        <ConnectionTest />
      </div>
    </div>
  );
};

export default ConnectionTestPage;
