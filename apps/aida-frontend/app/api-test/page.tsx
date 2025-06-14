'use client';

import { useState } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '@/src/config/api';

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('点击按钮测试API');
  const [loading, setLoading] = useState(false);

  const testDirectApi = async () => {
    setLoading(true);
    setResult('测试中...');
    
    try {
      console.log('开始测试直接API调用...');
      const apiUrl = buildApiUrl(API_ENDPOINTS.ARTISTS);
      const response = await fetch(apiUrl);
      console.log('API响应:', response);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API数据:', data);
      
      setResult(`✅ 成功！获取到 ${data.length} 个艺术家\n第一个艺术家: ${data[0]?.name || '无'}`);
    } catch (error) {
      console.error('API测试失败:', error);
      setResult(`❌ 失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const testProxyApi = async () => {
    setLoading(true);
    setResult('测试代理API中...');
    
    try {
      console.log('开始测试代理API调用...');
      const response = await fetch('/api/artists/');
      console.log('代理API响应:', response);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('代理API数据:', data);
      
      setResult(`✅ 代理成功！获取到 ${data.length} 个艺术家\n第一个艺术家: ${data[0]?.name || '无'}`);
    } catch (error) {
      console.error('代理API测试失败:', error);
      setResult(`❌ 代理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#0D0D0D] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#0066FF]">API 连接测试</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={testDirectApi}
          disabled={loading}
          className="bg-[#0066FF] text-white px-6 py-3 rounded-lg hover:bg-[#0052CC] disabled:opacity-50 transition-colors mr-4"
        >
          {loading ? '测试中...' : '测试直接API'}
        </button>
        
        <button 
          onClick={testProxyApi}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '测试中...' : '测试代理API'}
        </button>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333]">
        <h3 className="text-lg font-semibold mb-4 text-[#0066FF]">测试结果</h3>
        <pre className="text-[#8899A6] whitespace-pre-wrap">{result}</pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">API 测试说明</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>直接API</strong>: 使用配置的 API URL</li>
          <li>• <strong>代理API</strong>: 通过 Next.js API 路由代理</li>
          <li>• 在生产环境中，两种方式都会使用静态数据</li>
        </ul>
      </div>
    </div>
  );
} 