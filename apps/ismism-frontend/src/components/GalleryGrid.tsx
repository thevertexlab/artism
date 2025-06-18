import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Eye, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Artwork } from '../api/galleryApi';

interface GalleryGridProps {
  artworks: Artwork[];
  onSelect: (artwork: Artwork) => void;
}

const GalleryGrid = ({ artworks, onSelect }: GalleryGridProps) => {
  const navigate = useNavigate();
  
  // 处理图片加载错误
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x200?text=图片加载失败';
  };

  // 跳转到艺术主义详情页
  const navigateToArtMovement = (style: string, styleMovement: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    // 优先使用styleMovement，如果没有则使用风格名称转换
    const artMovementId = styleMovement || style.toLowerCase().replace(/\s+/g, '-');
    navigate(`/art-movement/${artMovementId}`);
  };

  // 跳转到艺术作品详情页
  const navigateToArtworkDetail = (artworkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/artwork/${artworkId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <AnimatePresence mode="popLayout">
        {artworks.map((artwork) => (
          <motion.div 
            key={artwork.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.3,
              type: "spring", 
              stiffness: 100
            }}
            layout
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Card 
              className="overflow-hidden h-full cursor-pointer border border-primary/20 bg-card/90 backdrop-blur-sm tech-card"
              onClick={(e) => navigateToArtworkDetail(artwork.id, e)}
            >
              <div className="h-52 overflow-hidden relative group">
                <motion.img 
                  src={artwork.imageUrl} 
                  alt={artwork.title} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-3 w-full">
                    <h4 className="text-white font-bold truncate">{artwork.title}</h4>
                    <p className="text-white/90 text-sm">{artwork.artist}</p>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-primary/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(artwork);
                      }}
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1 truncate bg-gradient-to-r from-white to-primary-foreground/80 bg-clip-text text-transparent">{artwork.title}</h3>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                  <p className="text-sm text-muted-foreground">{artwork.year}</p>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 flex justify-between items-center border-t border-primary/10 bg-muted/5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-white hover:bg-primary/20 p-0 h-8 px-2 flex items-center gap-1"
                  onClick={(e) => navigateToArtMovement(artwork.style, artwork.styleMovement, e)}
                >
                  <span className="text-xs">{artwork.style}</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default GalleryGrid; 