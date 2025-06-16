import { useState, useEffect } from 'react';
import TimelineView from '../components/TimelineView';
import Timeline from '../components/Timeline/Timeline';
import { TimelineEvent } from '../components/Timeline/types';
import { useTimelineStore } from '../timelineStore';

interface TimelineItem {
  id: string;
  title: string;
  year: number;
  description: string;
  imageUrl: string;
  artists: string[];
  styleMovement: string;
  influences: string[];
  influencedBy: string[];
}

const TimelinePage = () => {
  const { nodes, loading, error, fetchNodes } = useTimelineStore();
  const [viewMode, setViewMode] = useState<'classic' | 'interactive'>('interactive');
  
  // 从后端获取数据
  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);
  
  // 将nodes数据转换为TimelineItem格式
  const timelineItems: TimelineItem[] = nodes.map(node => ({
    id: node.id,
    title: node.title,
    year: node.year,
    description: node.description,
    imageUrl: node.imageUrl || '',
    artists: node.artists || [],
    styleMovement: node.styleMovement,
    influences: node.influences || [],
    influencedBy: node.influencedBy || []
  }));
  
  // 将nodes数据转换为TimelineEvent格式
  const timelineEvents: TimelineEvent[] = nodes.map(node => ({
    id: node.id,
    date: new Date(node.year, 0, 1), // 将年份转换为日期对象
    title: node.title,
    description: node.description,
    category: node.styleMovement
  }));

  return (
    <div className="page-container">
      {/* 标题栏 */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">时间线视图</h1>
        
        <div className="flex space-x-2">
          <div className="mr-4">
            <button 
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 text-sm rounded-l-md ${viewMode === 'interactive' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'}`}
            >
              交互式
            </button>
            <button 
              onClick={() => setViewMode('classic')}
              className={`px-3 py-1.5 text-sm rounded-r-md ${viewMode === 'classic' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'}`}
            >
              经典
            </button>
          </div>
          
          <select className="px-3 py-1.5 border-2 border-gray-400 rounded text-sm hidden sm:block">
            <option>全部时期</option>
            <option>文艺复兴</option>
            <option>现代艺术</option>
            <option>当代艺术</option>
          </select>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">加载数据中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>加载数据时出错: {error}</p>
          </div>
        ) : viewMode === 'classic' ? (
          <TimelineView items={timelineItems} />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            {timelineEvents.length > 0 ? (
              <Timeline 
                events={timelineEvents} 
                height={400} 
                className="mt-2"
              />
            ) : (
              <p className="text-center text-gray-600">没有找到时间线数据</p>
            )}
            <div className="mt-8 text-center text-gray-600">
              <p>使用鼠标左右拖动时间线查看不同时间点的项目进展</p>
              <p className="text-sm mt-2">悬停在事件上可以查看详细信息</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage; 