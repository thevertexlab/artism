import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { scaleTime } from '@visx/scale';
import gsap from 'gsap';
import { TimelineEvent, TimelineProps } from './types';
import TimelineItem from './TimelineItem';
import { Search, ChevronLeft, ChevronRight, ArrowRight, X, GripHorizontal, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { useTimelineStore } from '../../store/timelineStore';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ArtMovementDetail from '../ArtMovementDetail';
import { useToast } from "../ui/use-toast";
import { IArtStyle } from '../../types/art';
import { artMovementService } from '../../services/artMovementService';

// 开发模式下启用性能分析
const isDev = import.meta.env.DEV;
const logPerformance = (label: string, startTime: number) => {
  if (isDev) {
    console.log(`[Performance] ${label}: ${performance.now() - startTime}ms`);
  }
};

// 添加隐藏滚动条的CSS样式
const hideScrollbarStyle = {
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  'scrollbarWidth': 'none',
  '-ms-overflow-style': 'none',
};

// 添加CSS样式到文档头部，控制悬停效果
const addHoverStyles = () => {
  // 检查是否已经存在该样式
  if (!document.getElementById('timeline-hover-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'timeline-hover-styles';
    styleElement.textContent = `
      .hover-trigger:hover + .hover-target {
        display: block !important;
      }
      .hover-target:hover {
        display: block !important;
      }
    `;
    document.head.appendChild(styleElement);
  }
};

// 创建一个会话存储键
const TIMELINE_POSITION_KEY = 'timeline_position';
const TIMELINE_SCROLL_POSITION_KEY = 'timeline_scroll_position';

const Timeline: React.FC = () => {
  const { nodes: timelineNodes, fetchNodes, fetchContemporaryNodes } = useTimelineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const timelineRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const timelineListRef = useRef<HTMLDivElement>(null);
  const [dataSource, setDataSource] = useState<'regular' | 'contemporary'>('regular');
  const { toast } = useToast();
  
  // 当前选中的艺术主义节点
  const [selectedNode, setSelectedNode] = useState<IArtStyle | null>(null);
  
  // 改为直接使用时间轴位置状态
  const [timelinePosition, setTimelinePosition] = useState(0); // 0 表示中间位置，正负表示向左右偏移
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // 节点引用，用于滚动到特定节点
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 拖动相关状态
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  
  // 缩略图拖动状态
  const [isThumbnailDragging, setIsThumbnailDragging] = useState(false);
  const [thumbnailStartX, setThumbnailStartX] = useState(0);
  const [thumbnailScrollLeft, setThumbnailScrollLeft] = useState(0);

  // 图片缓存映射，减少重复请求
  const imgCache = useRef<Map<string, string>>(new Map());

  // 使用记忆化优化筛选和排序后的节点列表
  const sortedNodes = React.useMemo(() => {
    // 筛选节点
    const filteredNodes = timelineNodes.filter(node => 
      searchTerm === '' || 
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.artists?.some(artist => artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
      node.styleMovement?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 排序节点
    return [...filteredNodes].sort((a, b) => a.year - b.year);
  }, [timelineNodes, searchTerm]);

  // 计算时间轴的最小和最大年份
  const { minYear, maxYear, timeRange } = React.useMemo(() => {
    const min = sortedNodes.length > 0 ? sortedNodes[0].year : 1800;
    const max = sortedNodes.length > 0 ? sortedNodes[sortedNodes.length - 1].year : 2023;
    return { 
      minYear: min, 
      maxYear: max, 
      timeRange: max - min 
    };
  }, [sortedNodes]);
  
  // 切换数据源
  const toggleDataSource = () => {
    const newSource = dataSource === 'regular' ? 'contemporary' : 'regular';
    setDataSource(newSource);
    
    if (newSource === 'regular') {
      fetchNodes();
      toast({
        title: "数据源已切换",
        description: "显示普通艺术运动数据",
      });
    } else {
      fetchContemporaryNodes();
      toast({
        title: "数据源已切换",
        description: "显示当代艺术运动数据",
      });
    }
  };
  
  // 加载时间线节点
  useEffect(() => {
    if (dataSource === 'regular') {
      fetchNodes();
    } else {
      fetchContemporaryNodes();
    }
    
    // 添加悬停样式
    addHoverStyles();
    
    // 预加载常用的图片资源
    const preloadImages = () => {
      const imagesToPreload = Array.from({ length: 10 }).map((_, i) => `/TestData/1004${i}.jpg`);
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };
    preloadImages();
    
    // 组件卸载时清理样式
    return () => {
      const styleElement = document.getElementById('timeline-hover-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [fetchNodes, fetchContemporaryNodes, dataSource]);

  // 添加在顶部的数据源切换按钮
  const renderDataSourceToggle = () => {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleDataSource}
          variant="outline"
          className="bg-white/90 hover:bg-white/100 text-sm"
        >
          {dataSource === 'regular' ? '切换到当代艺术运动' : '切换到普通艺术运动'}
        </Button>
      </div>
    );
  };

  // Sort events by date
  const sortedEvents = [...sortedNodes].sort((a, b) => a.year - b.year);
  
  // Calculate timeline dimensions
  const timelineWidth = Math.max(1000, sortedEvents.length * 200); // Ensure minimum spacing
  const minDate = sortedEvents[0]?.date || new Date();
  const maxDate = sortedEvents[sortedEvents.length - 1]?.date || new Date();
  
  // Create scale for positioning events
  const timeScale = scaleTime({
    domain: [minDate, maxDate],
    range: [100, timelineWidth - 100], // Add padding on both sides
  });
  
  // Calculate constraints for dragging
  const constraintsLeft = timelineWidth - timelineWidth;
  const constraintsRight = 0;
  
  // Transform x motion value for parallax effect
  const backgroundX = useTransform(timelinePosition, [constraintsLeft, constraintsRight], [30, -30]);
  
  useEffect(() => {
    if (timelineRef.current) {
      // Initialize with GSAP animation
      gsap.fromTo(
        timelineRef.current.querySelectorAll('.timeline-item'),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1,
          ease: 'power3.out'
        }
      );
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      {/* 添加数据源切换按钮 */}
      {renderDataSourceToggle()}
      
      <div 
        ref={timelineRef} 
        className="relative overflow-hidden"
        style={{ width: '100%', height: 200 }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{ 
            width: timelineWidth,
            timelinePosition,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          drag="x"
          dragConstraints={{ 
            left: constraintsLeft < 0 ? constraintsLeft : 0, 
            right: 0 
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        >
          {/* Timeline base line */}
          <svg width={timelineWidth} height={200}>
            <Group>
              <Line
                from={{ x: 0, y: 100 }}
                to={{ x: timelineWidth, y: 100 }}
                stroke="#CBD5E1"
                strokeWidth={4}
                className="timeline-line"
              />
            </Group>
          </svg>
          
          {/* Timeline events */}
          {sortedEvents.map((event) => (
            <TimelineItem
              key={event.id}
              event={event}
              position={timeScale(event.date)}
              centerY={100}
            />
          ))}
        </motion.div>
        
        {/* Decorative background elements with parallax effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-[-1]"
          style={{ x: backgroundX }}
        >
          <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-blue-100 opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-purple-100 opacity-20" />
        </motion.div>
      </div>
    </div>
  );
};

export default Timeline; 