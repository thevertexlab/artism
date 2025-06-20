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
  
  // Fetch data from backend
  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);
  
  // Convert nodes data to TimelineItem format
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
  
  // Convert nodes data to TimelineEvent format
  const timelineEvents: TimelineEvent[] = nodes.map(node => ({
    id: node.id,
    date: new Date(node.year, 0, 1), // Convert year to date object
    title: node.title,
    description: node.description,
    category: node.styleMovement
  }));

  return (
    <div className="page-container">
      {/* Title bar */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Timeline View</h1>
        
        <div className="flex space-x-2">
          <div className="mr-4">
            <button 
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 text-sm rounded-l-md ${viewMode === 'interactive' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'}`}
            >
              Interactive
            </button>
            <button 
              onClick={() => setViewMode('classic')}
              className={`px-3 py-1.5 text-sm rounded-r-md ${viewMode === 'classic' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'}`}
            >
              Classic
            </button>
          </div>
          
          <select className="px-3 py-1.5 border-2 border-gray-400 rounded text-sm hidden sm:block">
            <option>All Periods</option>
            <option>Renaissance</option>
            <option>Modern Art</option>
            <option>Contemporary Art</option>
          </select>
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading data: {error}</p>
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
              <p className="text-center text-gray-600">No timeline data found</p>
            )}
            <div className="mt-8 text-center text-gray-600">
              <p>Use your mouse to drag the timeline left and right to view project progress at different times</p>
              <p className="text-sm mt-2">Hover over events to see detailed information</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage; 