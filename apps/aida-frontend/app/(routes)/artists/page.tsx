'use client';

import { useState, useEffect } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '@/src/config/api';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('页面初始化中...');

  // 加载艺术家数据
  const loadArtists = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('开始API调用...');
    
    try {
      setDebugInfo('正在调用API...');
      console.log('开始加载艺术家数据...');
      
      // 使用新的 API 配置
      const apiUrl = buildApiUrl(API_ENDPOINTS.ARTISTS);
      const response = await fetch(apiUrl);
      
      setDebugInfo(`API响应状态: ${response.status}`);
      console.log('API响应:', response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allArtists = await response.json();
      
      setDebugInfo(`API调用成功！收到 ${allArtists.length} 个艺术家数据`);
      console.log('艺术家数据:', allArtists);
      
      setArtists(allArtists);
      setError(null);
    } catch (err) {
      console.error('加载艺术家失败:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`加载艺术家失败: ${errorMessage}`);
      setDebugInfo(`API调用失败: ${errorMessage}`);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    console.log('艺术家页面组件挂载，开始加载数据...');
    loadArtists();
  }, []);

  return (
    <div className="p-8 bg-[#0D0D0D] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-[#0066FF]">艺术家数据库</h1>
      <p className="text-[#8899A6] mb-8">探索我们全面的艺术家收藏</p>

      {/* Debug Information */}
      <div className="mb-6 p-4 bg-[#1A1A1A] rounded-lg border border-[#333]">
        <h3 className="text-lg font-semibold mb-2 text-[#0066FF]">调试信息</h3>
        <p className="text-[#8899A6]">{debugInfo}</p>
        <p className="text-xs text-[#666] mt-2">
          加载状态: {loading ? '加载中' : '已完成'} | 
          艺术家数量: {artists.length} | 
          错误状态: {error ? '有错误' : '正常'}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-red-400">错误</h3>
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-[#0066FF] text-xl">加载中...</div>
        </div>
      )}

      {/* Artists Display */}
      {!loading && artists.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-white">艺术家列表 ({artists.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist, index) => (
              <div key={artist.id || artist._id || index} className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333] hover:border-[#0066FF] transition-colors">
                <h3 className="text-xl font-semibold text-white mb-2">{artist.name}</h3>
                <p className="text-[#8899A6] mb-2">
                  <span className="text-[#0066FF]">国籍:</span> {artist.nationality || '未知'}
                </p>
                <p className="text-[#8899A6] mb-2">
                  <span className="text-[#0066FF]">出生年份:</span> {artist.birth_year || '未知'}
                </p>
                <p className="text-[#8899A6] mb-2">
                  <span className="text-[#0066FF]">艺术流派:</span> {artist.art_movement || '未知'}
                </p>
                {artist.description && (
                  <p className="text-[#8899A6] text-sm mt-3 leading-relaxed">
                    {artist.description.length > 150 
                      ? `${artist.description.substring(0, 150)}...` 
                      : artist.description
                    }
                  </p>
                )}
                {artist.famous_works && artist.famous_works.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[#0066FF] text-sm font-medium">代表作品:</p>
                    <p className="text-[#8899A6] text-sm">
                      {artist.famous_works.slice(0, 2).join(', ')}
                      {artist.famous_works.length > 2 && '...'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && artists.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-[#8899A6] text-xl">没有找到艺术家数据</p>
          <p className="text-[#666] text-sm mt-2">请检查后端服务是否正常运行</p>
        </div>
      )}

      {/* Manual Refresh Button */}
      <div className="mt-8">
        <button 
          onClick={loadArtists}
          disabled={loading}
          className="bg-[#0066FF] text-white px-6 py-3 rounded-lg hover:bg-[#0052CC] disabled:opacity-50 transition-colors"
        >
          {loading ? '加载中...' : '重新加载'}
        </button>
      </div>
    </div>
  );
} 