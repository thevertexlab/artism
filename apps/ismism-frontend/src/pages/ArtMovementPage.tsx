import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Calendar, User, Clock, Tag, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/button';
import GalleryGrid from '../components/GalleryGrid';

// Import local database
import artStylesData from '../../data/artStyles.json';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  imageUrl: string;
  style: string;
  description: string;
}

interface ArtStyle {
  id: string;
  title: string;
  year: number;
  description: string;
  artists: string[];
  styleMovement: string;
  influences: string[];
  influencedBy: string[];
  tags: string[];
  images?: string[];
}

// Convert artStyle data to Artwork format required by Gallery component
const convertArtStyleToArtwork = (artStyle: ArtStyle): Artwork[] => {
  // Create artwork objects from art style, one for each artist
  return artStyle.artists.map((artist: string, index: number) => {
    // Determine image URL
    let imageUrl = '';
    
    // If artStyle has images property and enough images, use corresponding image
    if (artStyle.images && artStyle.images.length > 0) {
      // Select different image for each artist, ensure no out of bounds
      const imageIndex = index % artStyle.images.length;
      imageUrl = artStyle.images[imageIndex];
    } else {
      // Use test images from TestData as backup
      imageUrl = `/TestData/${10001 + (index % 30)}.jpg`;
    }
    
    return {
      id: `${artStyle.id}-${index}`,
      title: `${artist}'s ${artStyle.title} work`,
      artist: artist,
      year: artStyle.year,
      imageUrl: imageUrl,
      style: artStyle.title,
      description: artStyle.description
    };
  });
};

const ArtMovementPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artStyle, setArtStyle] = useState<ArtStyle | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [artStylesWithImages, setArtStylesWithImages] = useState(artStylesData);
  const [activeTab, setActiveTab] = useState<'description' | 'artists' | 'influences'>('description');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load art movement data
  useEffect(() => {
    setLoading(true);
    setImageLoaded(false);
    
    // Try to dynamically import artStylesWithImages.json
    const loadArtStylesWithImages = async () => {
      try {
        const response = await fetch('/artStylesWithImages.json');
        if (response.ok) {
          const data = await response.json();
          setArtStylesWithImages(data);
        } else {
          console.warn('Unable to load artStylesWithImages.json, using default data');
          setArtStylesWithImages(artStylesData);
        }
      } catch (error) {
        console.warn('Error loading artStylesWithImages.json, using default data', error);
        setArtStylesWithImages(artStylesData);
      } finally {
        // Find current art movement after loading is complete
        findCurrentArtStyle();
      }
    };
    
    loadArtStylesWithImages();
  }, [id]);

  // Find current art movement - optimized with useCallback
  const findCurrentArtStyle = useCallback(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const foundArtStyle = artStylesWithImages.find(style => style.id === id);
    
    if (foundArtStyle) {
      setArtStyle(foundArtStyle);
      const artworksFromStyle = convertArtStyleToArtwork(foundArtStyle);
      setArtworks(artworksFromStyle);
    } else {
      console.error(`Art movement with ID ${id} not found`);
    }
    
    setLoading(false);
  }, [id, artStylesWithImages]);

  // When artStylesWithImages updates, find current art movement again
  useEffect(() => {
    findCurrentArtStyle();
  }, [findCurrentArtStyle]);

  // Return to gallery page
  const goBackToGallery = useCallback(() => {
    navigate('/gallery');
  }, [navigate]);

  // Go back to previous page
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Handle image load complete
  const handleImageLoaded = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Handle image load error
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    const target = e.target as HTMLImageElement;
    target.src = `/TestData/${10001 + (index % 30)}.jpg`;
    target.onerror = null; // Prevent infinite loop
    setImageLoaded(true);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm">
        <div className="relative flex flex-col items-center justify-center gap-3 p-6 bg-black/40 rounded-xl border border-white/10 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-white/60 animate-pulse">Loading art movement information...</p>
        </div>
      </div>
    );
  }

  if (!artStyle) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm">
        <div className="relative p-6 bg-black/40 rounded-xl border border-white/10 shadow-2xl text-center max-w-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Art Movement Not Found</h2>
          <p className="text-gray-400 mb-6">The specified art movement could not be found. It may have been removed or the ID is incorrect.</p>
          <div className="flex justify-center gap-4">
            <Button variant="destructive" className="mr-2" onClick={goBack}>
              Go Back
            </Button>
            <Button variant="outline" onClick={goBackToGallery}>
              Return to Gallery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={goBack}
        style={{ pointerEvents: 'auto' }}
      />
      
      <motion.div 
        className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ pointerEvents: 'auto' }}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        {/* Header navigation */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Timeline
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {artStyle.title}
            </h1>
            <div className="flex items-center ml-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {artStyle.year}
              </span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={goBack}
            className="rounded-full w-8 h-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content area - scrollable */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-7 h-full">
            {/* Left side: Art movement introduction, adjusted to be wider */}
            <div className="lg:col-span-5 p-6 overflow-y-auto">
              {/* Tab navigation */}
              <div className="flex border-b border-white/10 mb-6">
                <button
                  className={`px-4 py-2 ${activeTab === 'description' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/60 hover:text-white/90'}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'artists' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/60 hover:text-white/90'}`}
                  onClick={() => setActiveTab('artists')}
                >
                  Artists
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'influences' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/60 hover:text-white/90'}`}
                  onClick={() => setActiveTab('influences')}
                >
                  Influences
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="prose prose-invert max-w-none">
                      <p className="text-base leading-relaxed">{artStyle.description}</p>
                    </div>
                    
                    {artStyle.tags.length > 0 && (
                      <div>
                        <h3 className="flex items-center text-sm text-gray-400 mb-2"><Tag className="h-4 w-4 mr-1" /> Keywords</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {artStyle.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="inline-block bg-purple-500/10 text-purple-300 text-sm px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'artists' && (
                  <motion.div
                    key="artists"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="flex items-center text-sm text-gray-400 mb-2"><User className="h-4 w-4 mr-1" /> Main Artists</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                        {artStyle.artists.map((artist, index) => (
                          <div
                            key={index}
                            className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-3 cursor-pointer"
                          >
                            <div className="h-24 w-24 mx-auto mb-2 rounded-full overflow-hidden bg-white/10">
                              <img
                                src={artworks[index]?.imageUrl || `/TestData/${10001 + (index % 30)}.jpg`}
                                alt={artist}
                                className="w-full h-full object-cover"
                                onLoad={handleImageLoaded}
                                onError={(e) => handleImageError(e, index)}
                              />
                            </div>
                            <h4 className="text-center font-medium truncate">{artist}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'influences' && (
                  <motion.div
                    key="influences"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {artStyle.influences.length > 0 && (
                      <div>
                        <h3 className="flex items-center text-sm text-gray-400 mb-2"><Lightbulb className="h-4 w-4 mr-1" /> Influenced By</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {artStyle.influences.map((influence, index) => (
                            <span 
                              key={index}
                              className="inline-block bg-blue-500/10 text-blue-300 text-sm px-3 py-1 rounded-full"
                            >
                              {influence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {artStyle.influencedBy.length > 0 && (
                      <div className="mt-6">
                        <h3 className="flex items-center text-sm text-gray-400 mb-2"><Lightbulb className="h-4 w-4 mr-1" /> Influences</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {artStyle.influencedBy.map((influenced, index) => (
                            <span 
                              key={index}
                              className="inline-block bg-green-500/10 text-green-300 text-sm px-3 py-1 rounded-full"
                            >
                              {influenced}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Right side: Artwork display */}
            <div className="lg:col-span-2 bg-black/40 border-l border-white/10 p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
              <h3 className="flex items-center text-lg font-medium mb-4"><Clock className="h-4 w-4 mr-2" /> Representative Works</h3>
              
              <div className="space-y-3">
                {artworks.map((artwork, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setSelectedArtwork(artwork)}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full aspect-square object-cover"
                      onLoad={handleImageLoaded}
                      onError={(e) => handleImageError(e, index)}
                    />
                    <div className="p-2">
                      <h4 className="text-sm font-medium truncate">{artwork.title}</h4>
                      <p className="text-xs text-gray-400">{artwork.artist}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArtMovementPage; 