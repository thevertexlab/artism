import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import artStylesData from '../../data/artStyles.json';

interface Artwork {
  id: string;
  imageUrl: string;
}

const HomeGallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artStylesWithImages, setArtStylesWithImages] = useState(artStylesData);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [baseOffset, setBaseOffset] = useState(0);

  // 尝试加载带图片的艺术风格数据
  useEffect(() => {
    const loadArtStylesWithImages = async () => {
      try {
        const response = await fetch('/data/artStylesWithImages.json');
        if (response.ok) {
          const data = await response.json();
          setArtStylesWithImages(data);
        } else {
          console.warn('无法加载artStylesWithImages.json，使用默认数据');
          setArtStylesWithImages(artStylesData);
        }
      } catch (error) {
        console.warn('加载artStylesWithImages.json出错，使用默认数据', error);
        setArtStylesWithImages(artStylesData);
      }
    };
    
    loadArtStylesWithImages();
  }, []);

  // 生成艺术品数据
  useEffect(() => {
    const generateArtworks = () => {
      const allArtworks: Artwork[] = [];
      
      artStylesWithImages.forEach((artStyle: any) => {
        // 为每个艺术风格创建多个艺术品
        artStyle.artists.forEach((artist: string, index: number) => {
          // 确定图片URL - 使用固定的索引规则
          const imageIndex = 10001 + (index % 30);
          const imageUrl = `/TestData/${imageIndex}.jpg`;
          
          allArtworks.push({
            id: `${artStyle.id}-${index}`,
            imageUrl: imageUrl
          });
        });
      });
      
      setArtworks(allArtworks);
    };
    
    generateArtworks();
  }, [artStylesWithImages]);

  // 处理图片加载错误
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const index = parseInt(target.dataset.index || '0');
    target.src = `/TestData/1004${index % 10}.jpg`;
    target.onerror = null;
  };

  // 鼠标拖动处理
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      setDragOffset(deltaX);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setBaseOffset(prev => prev + dragOffset);
      setDragOffset(0);
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setBaseOffset(prev => prev + dragOffset);
      setDragOffset(0);
    }
    setIsDragging(false);
  };

  // 触摸拖动处理（移动端支持）
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const deltaX = e.touches[0].clientX - dragStartX;
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setBaseOffset(prev => prev + dragOffset);
      setDragOffset(0);
    }
    setIsDragging(false);
  };

  return (
    <div 
      className="w-full overflow-hidden bg-black/20 cursor-grab active:cursor-grabbing select-none" 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 移动流容器 */}
      <div className="relative">
        {/* 第一层移动流 - 更快速度 */}
        <motion.div
          className="flex gap-6 py-8"
          animate={{
            x: [baseOffset, baseOffset - 200]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          style={{
            x: isDragging ? baseOffset + dragOffset : undefined
          }}
        >
          {artworks.map((artwork, index) => (
            <div
              key={`stream1-${artwork.id}`}
              className="flex-shrink-0 w-56 h-40 rounded-lg overflow-hidden border border-white/10 hover:border-blue-400/50 transition-colors"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
                data-index={index}
                onError={handleImageError}
              />
            </div>
          ))}
          {/* 重复图片以创建无缝循环 */}
          {artworks.slice(0, 15).map((artwork, index) => (
            <div
              key={`stream1-repeat-${artwork.id}`}
              className="flex-shrink-0 w-56 h-40 rounded-lg overflow-hidden border border-white/10 hover:border-blue-400/50 transition-colors"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
                data-index={index}
                onError={handleImageError}
              />
            </div>
          ))}
        </motion.div>

        {/* 第二层移动流 - 更快速度 */}
        <motion.div
          className="flex gap-6 py-8"
          animate={{
            x: [baseOffset * 1.2, (baseOffset * 1.2) - 300]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          style={{
            x: isDragging ? (baseOffset * 1.2) + (dragOffset * 1.2) : undefined
          }}
        >
          {artworks.slice(5).map((artwork, index) => (
            <div
              key={`stream2-${artwork.id}`}
              className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden border border-white/10 hover:border-purple-400/50 transition-colors"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
                data-index={index + 5}
                onError={handleImageError}
              />
            </div>
          ))}
          {/* 重复图片以创建无缝循环 */}
          {artworks.slice(5, 20).map((artwork, index) => (
            <div
              key={`stream2-repeat-${artwork.id}`}
              className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden border border-white/10 hover:border-purple-400/50 transition-colors"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
                data-index={index + 5}
                onError={handleImageError}
              />
            </div>
          ))}
        </motion.div>

        {/* 第三层移动流 - 更快速度 */}
        <motion.div
          className="flex gap-6 py-8"
          animate={{
            x: [baseOffset * 1.4, (baseOffset * 1.4) - 400]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          style={{
            x: isDragging ? (baseOffset * 1.4) + (dragOffset * 1.4) : undefined
          }}
        >
          {artworks.slice(10).map((artwork, index) => (
            <div
              key={`stream3-${artwork.id}`}
              className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden border border-white/10 hover:border-green-400/50 transition-colors"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
                data-index={index + 10}
                onError={handleImageError}
              />
            </div>
          ))}
          {/* 重复图片以创建无缝循环 */}
          {artworks.slice(10, 25).map((artwork, index) => (
            <div
              key={`stream3-repeat-${artwork.id}`}
              className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden border border-white/10 hover:border-green-400/50 transition-colors"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
                data-index={index + 10}
                onError={handleImageError}
              />
            </div>
          ))}
        </motion.div>

        {/* 第四层移动流 - 最快速度 */}
        <motion.div
          className="flex gap-6 py-8"
          animate={{
            x: [baseOffset * 1.6, (baseOffset * 1.6) - 500]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          style={{
            x: isDragging ? (baseOffset * 1.6) + (dragOffset * 1.6) : undefined
          }}
        >
          {artworks.slice(15).map((artwork, index) => (
            <div
              key={`stream4-${artwork.id}`}
              className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-colors"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
                data-index={index + 15}
                onError={handleImageError}
              />
            </div>
          ))}
          {/* 重复图片以创建无缝循环 */}
          {artworks.slice(15, 30).map((artwork, index) => (
            <div
              key={`stream4-repeat-${artwork.id}`}
              className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-colors"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
                data-index={index + 15}
                onError={handleImageError}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomeGallery; 