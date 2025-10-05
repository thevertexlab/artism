import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ArrowRight, X, GripHorizontal, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { useTimelineStore } from '../store/timelineStore';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ArtMovementDetail from './ArtMovementDetail';
import { useToast } from "./ui/use-toast";
import { IArtStyle } from '../types/art';
import { artMovementService } from '../services/artMovementService';

// Enable performance analysis in development mode
const isDev = import.meta.env.DEV;
const logPerformance = (label: string, startTime: number) => {
  if (isDev) {
    console.log(`[Performance] ${label}: ${performance.now() - startTime}ms`);
  }
};

// Add CSS styles to hide scrollbars
const hideScrollbarStyle = {
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  'scrollbarWidth': 'none',
  '-ms-overflow-style': 'none',
};

// Add CSS styles to document head for hover effects
const addHoverStyles = () => {
  // Check if the style already exists
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

// Create session storage keys
const TIMELINE_POSITION_KEY = 'timeline_position';
const TIMELINE_SCROLL_POSITION_KEY = 'timeline_scroll_position';

const Timeline: React.FC = () => {
  const { nodes: timelineNodes, fetchNodes, loading, error } = useTimelineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const timelineRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const timelineListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Currently selected art movement node
  const [selectedNode, setSelectedNode] = useState<IArtStyle | null>(null);

  // Use timeline position state directly
  const [timelinePosition, setTimelinePosition] = useState(0); // 0 means center position, positive/negative means left/right offset
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Node references for scrolling to specific nodes
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Drag-related states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startPosition, setStartPosition] = useState(0);

  // Thumbnail drag states
  const [isThumbnailDragging, setIsThumbnailDragging] = useState(false);
  const [thumbnailStartX, setThumbnailStartX] = useState(0);
  const [thumbnailScrollLeft, setThumbnailScrollLeft] = useState(0);

  // Art movement name row drag states
  // const [isNameRowDragging, setIsNameRowDragging] = useState(false);
  // const [nameRowStartX, setNameRowStartX] = useState(0);
  // const [nameRowStartPosition, setNameRowStartPosition] = useState(0);
  // const nameRowRef = useRef<HTMLDivElement>(null);

  // Image cache mapping to reduce duplicate requests
  const imgCache = useRef<Map<string, string>>(new Map());

  // 使用记忆化优化筛选和排序后的节点列表
  const sortedNodes = React.useMemo(() => {
    // 确保timelineNodes存在且是数组
    if (!Array.isArray(timelineNodes) || timelineNodes.length === 0) {
      return [];
    }

    // 筛选节点
    const filteredNodes = timelineNodes.filter(node => {
      if (!node) return false;
      
      return searchTerm === '' || 
        (node.title && node.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (node.description && node.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (Array.isArray(node.artists) && node.artists.some(artist => 
          artist && typeof artist === 'string' && artist.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        (node.styleMovement && node.styleMovement.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    // Sort nodes
    return [...filteredNodes].sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [timelineNodes, searchTerm]);

  // Calculate minimum and maximum years for timeline
  const { minYear, maxYear, timeRange } = React.useMemo(() => {
    if (!sortedNodes.length) {
      return { minYear: 1800, maxYear: 2023, timeRange: 223 };
    }

    const min = sortedNodes.length > 0 ? (sortedNodes[0].year || 1800) : 1800;
    const max = sortedNodes.length > 0 ? (sortedNodes[sortedNodes.length - 1].year || 2023) : 2023;
    return {
      minYear: min,
      maxYear: max,
      timeRange: max - min || 1 // Avoid division by zero
    };
  }, [sortedNodes]);
  
  // 处理"现在"按钮点击
  const handleNowClick = () => {
    // 找到当前年份最接近的节点
    const currentYear = new Date().getFullYear();
    let closestNode = sortedNodes[0];
    let minDiff = Math.abs(currentYear - closestNode.year);
    
    sortedNodes.forEach(node => {
      const diff = Math.abs(currentYear - node.year);
      if (diff < minDiff) {
        minDiff = diff;
        closestNode = node;
      }
    });
    
    // If node is found, scroll to it
    if (closestNode && nodeRefs.current[closestNode.id]) {
      nodeRefs.current[closestNode.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Highlight display
      setHighlightedNodeId(closestNode.id);

      // Remove highlight after slight delay
      setTimeout(() => {
        setHighlightedNodeId(null);
      }, 2000);
    }
  };
  
  // Load timeline nodes
  useEffect(() => {
    fetchNodes();

    // Add hover styles
    addHoverStyles();

    // Preload common image resources
    const preloadImages = () => {
      const imagesToPreload = Array.from({ length: 10 }).map((_, i) => `/TestData/1004${i}.jpg`);
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };
    preloadImages();

    // Clean up styles when component unmounts
    return () => {
      const styleElement = document.getElementById('timeline-hover-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [fetchNodes]);

  // 加载时恢复时间轴位置和滚动位置
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(TIMELINE_POSITION_KEY);
    const savedScrollPosition = sessionStorage.getItem(TIMELINE_SCROLL_POSITION_KEY);
    const lastViewedArtMovement = sessionStorage.getItem('last_viewed_art_movement');
    
    // 如果有上次查看的艺术主义，从详情页返回时直接定位
    if (lastViewedArtMovement && location.pathname === '/timeline') {
      const artMovement = timelineNodes.find(node => node.id === lastViewedArtMovement);
      if (artMovement && timelineContainerRef.current) {
        // 计算需要的偏移量使该艺术主义的年份居中
        const yearPosition = ((artMovement.year - minYear) / timeRange) * 100;
        const centerOffset = 50 - yearPosition;
        
        // 直接设置位置，不需要动画效果
        setTimelinePosition(centerOffset);
        
        // 直接滚动到该艺术主义，不使用平滑滚动
        if (nodeRefs.current[lastViewedArtMovement]) {
          nodeRefs.current[lastViewedArtMovement]?.scrollIntoView({
            block: 'center'
          });
          
          // 高亮显示
          setHighlightedNodeId(lastViewedArtMovement);
          
          // 略微延时后取消高亮
          setTimeout(() => {
            setHighlightedNodeId(null);
          }, 2000);
          
          // 清除上次查看记录，避免下次进入页面重复定位
          sessionStorage.removeItem('last_viewed_art_movement');
        }
      }
    } else {
      // 没有特定艺术主义需要定位时，恢复上次保存的位置
      if (savedPosition) {
        setTimelinePosition(parseFloat(savedPosition));
      }
      
      if (savedScrollPosition && timelineListRef.current) {
        // 直接设置滚动位置，不使用动画
        timelineListRef.current.scrollTop = parseFloat(savedScrollPosition);
      }
    }
  }, [location.pathname, minYear, timeRange, timelineNodes]);

  // 保存时间轴位置和滚动位置
  const savePositions = () => {
    sessionStorage.setItem(TIMELINE_POSITION_KEY, timelinePosition.toString());
    if (timelineListRef.current) {
      sessionStorage.setItem(TIMELINE_SCROLL_POSITION_KEY, timelineListRef.current.scrollTop.toString());
    }
  };

  // 从URL参数获取艺术主义名称并设置搜索条件或滚动到该节点
  useEffect(() => {
    const styleParam = searchParams.get('style');
    const yearParam = searchParams.get('year');
    
    if (styleParam) {
      // 设置搜索条件为URL参数中的艺术主义名称
      setSearchTerm(styleParam);
      
      // 等待节点加载和渲染后，滚动到该节点
      setTimeout(() => {
        const targetNode = timelineNodes.find(node => 
          node.title.toLowerCase() === styleParam.toLowerCase() || 
          node.styleMovement?.toLowerCase() === styleParam.toLowerCase()
        );
        
        if (targetNode) {
          // 设置高亮节点ID
          setHighlightedNodeId(targetNode.id);
          
          // 计算需要的偏移量使该艺术主义的年份居中显示
          const yearPosition = ((targetNode.year - minYear) / timeRange) * 100;
          const centerOffset = 50 - yearPosition;
          setTimelinePosition(centerOffset);
          
          if (nodeRefs.current[targetNode.id]) {
            nodeRefs.current[targetNode.id]?.scrollIntoView({ 
              block: 'center'
            });
            
            // 3秒后取消高亮
            setTimeout(() => {
              setHighlightedNodeId(null);
            }, 3000);
          }
        }
      }, 100); // 减少等待时间
    } else if (yearParam) {
      // 如果有年份参数，查找最接近该年份的节点
      const year = parseInt(yearParam, 10);
      if (!isNaN(year)) {
        setTimeout(() => {
          // 按照年份排序的节点
          const sortedByYear = [...timelineNodes].sort((a, b) => 
            Math.abs(a.year - year) - Math.abs(b.year - year)
          );
          
          if (sortedByYear.length > 0) {
            const closestNode = sortedByYear[0];
            setHighlightedNodeId(closestNode.id);
            
            // 计算需要的偏移量使该艺术主义的年份居中显示
            const yearPosition = ((closestNode.year - minYear) / timeRange) * 100;
            const centerOffset = 50 - yearPosition;
            setTimelinePosition(centerOffset);
            
            if (nodeRefs.current[closestNode.id]) {
              nodeRefs.current[closestNode.id]?.scrollIntoView({ 
                block: 'center'
              });
              
              // 3秒后取消高亮
              setTimeout(() => {
                setHighlightedNodeId(null);
              }, 3000);
            }
          }
        }, 100);
      }
    }
  }, [searchParams, timelineNodes]);

  // 计算每个节点在时间轴上的位置百分比（考虑时间轴位置）
  const getPositionPercentage = useCallback((year: number) => {
    if (isDev) {
      const startTime = performance.now();
      // 基础位置百分比
      const basePercentage = ((year - minYear) / timeRange) * 100;
      // 应用时间轴位置偏移
      const result = basePercentage + timelinePosition;
      
      // 仅在大量调用时记录性能数据（避免日志过多）
      if (Math.random() < 0.01) { 
        logPerformance("getPositionPercentage", startTime);
      }
      
      return result;
    } else {
      // 基础位置百分比
      const basePercentage = ((year - minYear) / timeRange) * 100;
      // 应用时间轴位置偏移
      return basePercentage + timelinePosition;
    }
  }, [minYear, timeRange, timelinePosition]);
  
  // 生成时间轴上的年份标记
  const generateYearMarks = () => {
    if (timeRange === 0) return [];
    
    // 创建更均匀分布的年份标记点
    const numMarks = 20; // 标记点数量
    const marks = [];
    
    for (let i = 0; i <= numMarks; i++) {
      const year = Math.round(minYear + (timeRange * i) / numMarks);
      marks.push(year);
    }
    
    return marks;
  };
  
  // 时间轴年份标记点
  const yearMarks = generateYearMarks();
  
  // 滚动时间轴
  const scrollTimeline = (direction: 'left' | 'right') => {
    // 计算滚动量，每次滚动50%的宽度
    const scrollAmount = 50;
    
    if (direction === 'left') {
      // 向左滚动，增加位置值（内容向右移）
      setTimelinePosition(prev => prev + scrollAmount);
    } else {
      // 向右滚动，减少位置值（内容向左移）
      setTimelinePosition(prev => prev - scrollAmount);
    }
  };
  
  // 点击年份，跳转到对应时间的艺术主义
  const handleYearClick = (year: number) => {
    // 查找最接近该年份的节点
    const sortedByYear = [...sortedNodes].sort((a, b) => 
      Math.abs(a.year - year) - Math.abs(b.year - year)
    );
    
    if (sortedByYear.length > 0) {
      const closestNode = sortedByYear[0];
      
      // 直接高亮相关节点
      setHighlightedNodeId(closestNode.id);
      
      // 调整时间轴位置，让对应的年份居中显示
      const yearPosition = ((year - minYear) / timeRange) * 100;
      const centerOffset = 50 - yearPosition;
      setTimelinePosition(centerOffset);
      
      if (nodeRefs.current[closestNode.id]) {
        // 直接滚动到目标位置，不使用平滑效果
        nodeRefs.current[closestNode.id]?.scrollIntoView({ 
          block: 'center'
        });
        
        // 3秒后取消高亮
        setTimeout(() => {
          setHighlightedNodeId(null);
        }, 3000);
      }
    }
  };

  // 处理鼠标拖动
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartPosition(timelinePosition);
    
    // 防止文本选择
    document.body.style.userSelect = 'none';
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
    setIsDragging(false);
      document.body.style.userSelect = '';
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    
    // 计算鼠标移动距离
    const dx = e.clientX - startX;
    
    // 计算移动幅度，相对于时间轴宽度的百分比
    const containerWidth = timelineContainerRef.current?.clientWidth || 1000;
    const movePercent = (dx / containerWidth) * 100;
    
    // 更新时间轴位置，拖动系数可以调整拖动的灵敏度
    const dragFactor = 4; // 增加拖动灵敏度因子
    setTimelinePosition(startPosition + movePercent * dragFactor);
  };
  
  // 处理缩略图区域的鼠标拖动
  const handleThumbnailMouseDown = (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
    if (!thumbnailsRef.current[nodeId]) return;
    setIsThumbnailDragging(true);
    setThumbnailStartX(e.pageX - thumbnailsRef.current[nodeId]!.offsetLeft);
    setThumbnailScrollLeft(thumbnailsRef.current[nodeId]!.scrollLeft);
    // 防止事件冒泡，避免触发节点点击事件
    e.stopPropagation();
    // 防止文本选择
    document.body.style.userSelect = 'none';
  };
  
  const handleThumbnailMouseUp = () => {
    setIsThumbnailDragging(false);
    document.body.style.userSelect = '';
  };
  
  const handleThumbnailMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isThumbnailDragging) {
      setIsThumbnailDragging(false);
      document.body.style.userSelect = '';
    }
  };
  
  const handleThumbnailMouseMove = (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
    if (!isThumbnailDragging || !thumbnailsRef.current[nodeId]) return;
    e.preventDefault();
    const x = e.pageX - thumbnailsRef.current[nodeId]!.offsetLeft;
    const walk = (x - thumbnailStartX) * 3; // 增加滚动速度因子
    thumbnailsRef.current[nodeId]!.scrollLeft = thumbnailScrollLeft - walk;
    // 防止事件冒泡
    e.stopPropagation();
  };

  // 处理艺术主义时间线点击
  const handleArtMovementLineClick = async (node: IArtStyle, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 拖动过程中不触发点击
    if (isDragging || isThumbnailDragging) {
      return;
    }
    
    try {
      // 如果是取消选中，直接关闭详情
      if (node.id === selectedNode?.id) {
        setSelectedNode(null);
        return;
      }

      // 获取艺术主义详情
      const artMovementDetail = await artMovementService.getArtMovementDetail(node.id);
      
      // 设置当前选中节点
      setSelectedNode(artMovementDetail);
      
      // 保存当前位置
      savePositions();
      
      // 调整时间轴位置
      const yearPosition = ((node.year - minYear) / timeRange) * 100;
      const centerOffset = 50 - yearPosition;
      setTimelinePosition(centerOffset);
      
      // 添加高亮效果
      setHighlightedNodeId(node.id);
      
      // 3秒后取消高亮
      setTimeout(() => {
        setHighlightedNodeId(null);
      }, 3000);
      
      // 滚动到合适位置
      setTimeout(() => {
        if (nodeRefs.current[node.id]) {
          nodeRefs.current[node.id]?.scrollIntoView({
            block: 'center',
            behavior: 'smooth'
          });
        }
      }, 300);
    } catch (error) {
      console.error('Failed to fetch art movement details:', error);
      toast("Failed to fetch art movement details", "error", 3000);
    }
  };
  
  // 单独处理时间点标记的点击
  const handleTimePointClick = (node: IArtStyle, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 拖动过程中不触发点击
    if (isDragging || isThumbnailDragging) {
      return;
    }
    
    // 设置当前选中节点
    const isSelecting = node.id !== selectedNode?.id;
    setSelectedNode(isSelecting ? node : null);
    
    // 保存当前位置
    savePositions();
    
    // 如果是选中了节点，调整时间轴位置使得节点的年份点位于时间轴上并滚动到合适位置
    if (isSelecting) {
      // 计算需要的偏移量使该艺术主义的年份点位于时间轴可见位置
      const yearPosition = ((node.year - minYear) / timeRange) * 100;
      const centerOffset = 50 - yearPosition;
      setTimelinePosition(centerOffset);
      
      // 等待详情渲染和时间轴位置调整完成后滚动到理想位置
      setTimeout(() => {
        // 获取所需的DOM元素
        const timePointElement = document.getElementById(`year-${node.year}`);
        const timelineContainer = timelineRef.current;
        const nodeElement = nodeRefs.current[node.id];
        
        if (timePointElement && timelineContainer && nodeElement) {
          // 获取时间轴线元素
          const timelineTrack = document.querySelector('.absolute.top-1\\/2.left-0.right-0.h-0\\.5.bg-white\\/5');
          if (!timelineTrack) return;
          
          // 获取所有元素的位置和尺寸信息
          const timelineRect = timelineContainer.getBoundingClientRect();
          const timePointRect = timePointElement.getBoundingClientRect();
          const nodeRect = nodeElement.getBoundingClientRect();
          const trackRect = timelineTrack.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // 计算将详情内容居中所需的滚动位置
          // 我们需要考虑:
          // 1. 详情内容的中心应该在视口中心
          // 2. 时间点应该与时间轴线对齐
          // 3. 艺术主义名称不应高于时间轴
          
          // 计算详情内容中心位置（考虑实际展开高度）
          const nodeCenter = nodeRect.top + nodeRect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          
          // 计算需要的滚动位置使详情内容居中
          let requiredScrollForCenter = window.scrollY + (nodeCenter - viewportCenter);
          
          // 计算时间点与时间轴对齐所需的最小滚动位置
          const timelineAlignmentPosition = window.scrollY + (trackRect.top - timePointRect.height/2 - timePointRect.top);
          
          // 计算名称顶部到时间轴底部的距离
          const nameElement = nodeElement.querySelector('.text-lg.font-semibold');
          if (nameElement) {
            const nameRect = nameElement.getBoundingClientRect();
            const minDistanceToTimeline = 20; // 最小间距20px
            const nameToTimelineDistance = nameRect.top - timelineRect.bottom;
            
            // 如果居中会导致名称太靠近时间轴，调整滚动位置
            if (nameToTimelineDistance - (nodeCenter - viewportCenter) < minDistanceToTimeline) {
              const safeScrollPosition = window.scrollY + (nameRect.top - timelineRect.bottom - minDistanceToTimeline);
              requiredScrollForCenter = Math.max(requiredScrollForCenter, safeScrollPosition);
            }
          }
          
          // 使用平滑滚动到计算出的最终位置
          window.scrollTo({
            top: Math.max(requiredScrollForCenter, 0), // 确保不会滚动到负值位置
            behavior: 'smooth'
          });
        }
      }, 300); // 使用足够的延迟确保详情完全展开
    }
  };
  
  // 关闭艺术主义详情
  const handleCloseDetail = () => {
    setSelectedNode(null);
    setHighlightedNodeId(null);
  };

  // 跳转到艺术主义详情页（保留原来的功能）
  const navigateToArtMovement = (artMovementId: string) => {
    // 保存当前位置信息，并记录当前查看的艺术主义ID
    savePositions();
    sessionStorage.setItem('last_viewed_art_movement', artMovementId);
    // 跳转到详情页
    navigate(`/art-movement/${artMovementId}`);
  };

  // 处理图片加载错误，使用备用图片
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    const target = e.target as HTMLImageElement;
    const fallbackSrc = `/TestData/1004${index % 10}.jpg`;
    
    // 如果缓存中已有此图片的替代路径，直接使用
    const originalSrc = target.getAttribute('data-original-src') || '';
    if (originalSrc && imgCache.current.has(originalSrc)) {
      target.src = imgCache.current.get(originalSrc) || fallbackSrc;
    } else {
      // 否则设置为默认备用图片
      target.src = fallbackSrc;
      
      // 记录原图路径到备用图片路径的映射
      if (originalSrc) {
        imgCache.current.set(originalSrc, fallbackSrc);
      }
    }
    
    // 避免无限循环加载
    target.onerror = null;
  };

  // 获取缩略图路径，优先使用节点自带图片，否则使用备用图片
  const getThumbnailUrl = (node: IArtStyle, imgIndex: number) => {
    // 检查是否已经有缓存的路径
    const nodeImgKey = `${node.id}-${imgIndex}`;
    if (imgCache.current.has(nodeImgKey)) {
      return imgCache.current.get(nodeImgKey) as string;
    }
    
    // 没有缓存，尝试使用节点的图片
    if (node.images && node.images.length > 0 && node.images[imgIndex]) {
      // 处理图片URL
      let imgUrl = node.images[imgIndex];
      
      // 如果是对象，提取URL属性
      if (typeof imgUrl === 'object' && imgUrl !== null && 'url' in imgUrl) {
        imgUrl = (imgUrl as any).url;
      }
      
      // 处理相对路径
      if (typeof imgUrl === 'string' && !imgUrl.startsWith('http') && !imgUrl.startsWith('/')) {
        imgUrl = `/assets/${imgUrl}`;
      }
      
      imgCache.current.set(nodeImgKey, imgUrl as string);
      return imgUrl as string;
    }
    
    // 使用备用图片
    const fallbackSrc = `/TestData/1004${imgIndex % 10}.jpg`;
    imgCache.current.set(nodeImgKey, fallbackSrc);
    return fallbackSrc;
  };

  const [previewImage, setPreviewImage] = useState<{src: string, title: string, artist: string, year: number} | null>(null);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Display error messages */}
      {error && (
        <div className="bg-red-500/20 text-red-700 p-4 rounded-md mb-4 mx-auto max-w-md mt-4">
          <p className="font-semibold">Error loading data:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Display loading state */}
      {loading && (
        <div className="flex items-center justify-center h-40 mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-blue-500">Loading art movement data...</p>
        </div>
      )}
      
      {/* Title and search bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-14"
      >
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center">
            Art Movement Timeline
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search art movements..."
                  className="pl-10 pr-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {selectedNode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseDetail}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm"
              >
                <X className="h-3.5 w-3.5" />
                Close Details
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Top timeline - fixed at page top, close to navigation bar */}
      <div className="sticky top-16 bg-background z-10 border-b border-white/5 shadow-md -mt-8">
        <div className="relative px-8" ref={timelineRef}>
          {/* 时间轴线 */}
          <div className="h-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 w-full rounded-full mt-3"></div>
          
          {/* 滑动按钮 */}
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-black/40 text-white hover:bg-black/60 z-10 h-8 w-8 p-1 border border-white/10"
            onClick={() => scrollTimeline('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-black/40 text-white hover:bg-black/60 z-10 h-8 w-8 p-1 border border-white/10"
            onClick={() => scrollTimeline('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Year mark container with fixed height */}
          <div className="relative h-10 mb-2" ref={timelineContainerRef}>
            {/* Year marks with horizontal scrolling and mouse dragging support */}
            <div 
              className="absolute left-0 right-0 mt-2 hide-scrollbar cursor-grab active:cursor-grabbing" 
              style={{ 
                overflow: 'hidden', 
                height: '30px',
                userSelect: 'none'
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {/* Year mark background track */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 transform -translate-y-1/2"></div>

              {/* Year marks - using absolute positioning and timeline position */}
              {yearMarks.map((year, index) => (
                <button
                  key={index}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 hover:scale-110 transition-all cursor-pointer px-2 py-1 rounded-full absolute bg-transparent"
                  style={{ 
                    left: `${getPositionPercentage(year)}%`,
                    transform: 'translateX(-50%)',
                    top: '0',
                    marginTop: '2px'
                  }}
                  onClick={() => handleYearClick(year)}
                >
                  <div className="absolute bottom-full mb-1 w-1 h-1 bg-blue-400 rounded-full left-1/2 transform -translate-x-1/2"></div>
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected art movement details or art movement list */}
      <AnimatePresence mode="wait">
        {sortedNodes.length > 0 ? (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 mt-4 overflow-auto"
            ref={timelineListRef}
          >
            {sortedNodes.map((node, index) => (
            <motion.div 
              key={node.id}
              ref={el => nodeRefs.current[node.id] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`flex flex-col items-start gap-2 border-b border-white/10 pb-3 
                  ${highlightedNodeId === node.id ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-2 -mx-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''}`}
              >
                {/* Art movement timeline position marker */}
                <div className="w-full relative h-12 overflow-hidden">
                  {/* Fixed label on the left side */}
                  <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-r-lg border-r border-t border-b border-white/10 flex items-center gap-3 shadow-lg cursor-pointer hover:bg-black/80 transition-colors group"
                    onClick={(e) => handleTimePointClick(node, e)}
                  >
                    <span className="font-medium text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                      {node.title}
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </span>
                    <span className="text-sm text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full group-hover:bg-blue-500/30 transition-colors">{node.year}</span>
                  </div>
                  
                  {/* Content container for horizontal timeline scrolling, with left margin for fixed label space */}
                  <div className="w-full h-full relative pl-[200px]">
                    {/* Blue line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500/20 transform -translate-y-1/2"></div>

                    {/* Time point marker - clickable to show details */}
                    <div 
                      id={`year-${node.year}`}
                      className="absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full z-10 cursor-pointer hover:bg-blue-400 hover:scale-125 transition-all"
                      style={{ 
                        left: `${getPositionPercentage(node.year)}%`,
                        transform: 'translate(-50%, -50%)',
                        marginTop: '0' // Ensure alignment with timeline
                      }}
                      onClick={(e) => handleTimePointClick(node, e)}
                    ></div>
                  
                    {/* Thumbnail container after time point */}
                    <div 
                      className="absolute top-0 h-full overflow-x-auto cursor-grab active:cursor-grabbing hide-scrollbar bg-transparent group hover:bg-blue-500/5 transition-colors rounded-md"
                      style={{ 
                        left: `${getPositionPercentage(node.year)}%`,
                        right: '0',
                        paddingLeft: '10px',
                        width: '100vw' // Use viewport width to ensure container is wide enough
                      }}
                      ref={el => thumbnailsRef.current[node.id] = el}
                      onMouseDown={(e) => handleThumbnailMouseDown(e, node.id)}
                      onMouseUp={handleThumbnailMouseUp}
                      onMouseLeave={(e) => handleThumbnailMouseLeave(e)}
                      onMouseMove={(e) => handleThumbnailMouseMove(e, node.id)}
                    >
                      <div className="flex items-center h-full gap-2 pr-4 pl-2" style={{ width: 'max-content', paddingRight: '200px' }}>
                        <GripHorizontal className="h-4 w-4 text-white/30 group-hover:text-white/60 flex-shrink-0 transition-colors" />
                        {/* Thumbnails - limited to 5 for better performance */}
                        {Array.from({ length: Math.min(5, node.images?.length || 5) }).map((_, imgIndex) => (
                          <div 
                            key={imgIndex} 
                            className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0 border border-white/10 hover:border-blue-400 transition-colors bg-black/20 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              
                              // Restore thumbnail click preview functionality
                              const image = getThumbnailUrl(node, imgIndex);
                              const artistIndex = imgIndex % node.artists.length;
                              setPreviewImage({
                                src: image,
                                title: node.title,
                                artist: node.artists[artistIndex] || 'Unknown Artist',
                                year: node.year + (imgIndex % 10)
                              });
                            }}
                          >
                            <img
                              src={getThumbnailUrl(node, imgIndex)}
                              alt={`${node.title} artwork ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              data-original-src={node.images?.[imgIndex] || ''}
                              onError={(e) => handleImageError(e, imgIndex)}
                            />
                          </div>
                        ))}
                  </div>
                </div>
                  </div>
                </div>
                
                {/* Art movement name and information */}
                <div className="w-full pl-4 relative">
                  <div 
                    className="flex items-center gap-3 relative group px-3 py-2 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer"
                    onClick={(e) => handleTimePointClick(node, e)}
                  >
                    {/* Remove empty placeholder elements */}
                  </div>
                  
                  {/* Art movement details expansion area */}
                  {selectedNode && selectedNode.id === node.id && (
                    <motion.div 
                      key={`detail-${node.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 mb-4 w-full"
                    >
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 shadow-lg">
                        <ArtMovementDetail artStyle={selectedNode} onClose={handleCloseDetail} />
                      </div>
                    </motion.div>
                  )}
              </div>
            </motion.div>
            ))}
            {/* Bottom extra whitespace */}
            <div className="h-40"></div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-5 bg-[rgba(15,15,20,0.7)] backdrop-blur-sm border border-white/10 rounded-lg shadow-glow-sm mb-4">
              <Search className="h-10 w-10 text-gray-400 mb-2" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No timeline nodes found</h3>
            <p className="text-gray-500">Please try different search criteria</p>
          </div>
        )}
      </AnimatePresence>
      
      {/* Large image preview modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-4xl max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={previewImage.src} 
                alt={`${previewImage.title} artwork detail`}
                className="max-h-[80vh] max-w-full object-contain rounded-md" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 backdrop-blur-sm">
                <h3 className="text-white font-medium">
                  {previewImage.title}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {previewImage.artist} (c. {previewImage.year})
                </p>
                <button 
                  className="absolute top-2 right-2 text-white/70 hover:text-white"
                  onClick={() => setPreviewImage(null)}
                >
                  <X className="w-6 h-6" />
                </button>
      </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline; 