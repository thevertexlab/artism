import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, LayoutGrid, ArrowUpDown, Sparkles } from 'lucide-react';
import GalleryGrid from '../components/GalleryGrid';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { fetchAllArtworks, Artwork } from '../api/galleryApi';

const GalleryPage = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch artwork data
  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setLoading(true);
        const data = await fetchAllArtworks();
        setArtworks(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch artworks:', err);
        setError('Failed to load artworks, please try again later');
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  // Close details modal
  const closeArtworkDetails = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="page-container relative">
      {/* Title bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6 border border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-border-flow h-[1px] w-full absolute top-0 opacity-30"></div>
          </div>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-glow-pulse" />
              <h1 className="text-xl font-bold">Art Gallery</h1>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="gap-1 hidden sm:flex bg-muted/50 border-primary/20 backdrop-blur-sm hover:bg-primary/10">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort by Date</span>
              </Button>
              
              <div className="border border-primary/20 rounded-md overflow-hidden flex">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-primary/10">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none bg-primary/10 hover:bg-primary/20">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Content area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-4"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-400">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => fetchAllArtworks().then(setArtworks).catch(() => {})}
            >
              Retry
            </Button>
          </div>
        ) : (
          <GalleryGrid artworks={artworks} onSelect={setSelectedArtwork} />
        )}
      </motion.div>
      
      {/* Artwork details modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            onClick={closeArtworkDetails}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-card/90 backdrop-blur-md rounded-lg border border-primary/30 max-w-4xl w-full max-h-[90vh] overflow-hidden relative" 
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="animate-border-flow h-[1px] w-full absolute top-0 opacity-40"></div>
                <div className="animate-border-flow h-[1px] w-full absolute bottom-0 opacity-40"></div>
              </div>
              
              <div className="relative">
                <Button 
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-black/40 text-white hover:bg-black/60 z-10"
                  onClick={closeArtworkDetails}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
                <div className="h-80 overflow-hidden bg-muted/30 flex items-center justify-center">
                  <motion.img 
                    src={selectedArtwork.imageUrl} 
                    alt={selectedArtwork.title}
                    className="w-full h-full object-contain"
                    initial={{ filter: 'blur(10px)', opacity: 0 }}
                    animate={{ filter: 'blur(0px)', opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-primary/90">{selectedArtwork.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <span>{selectedArtwork.artist}, {selectedArtwork.year}</span>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {selectedArtwork.style}
                  </span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">{selectedArtwork.description}</p>
              </CardContent>
              
              <CardFooter className="flex-wrap gap-2 border-t border-border/40">
                <Button 
                  className="gap-2 bg-gradient-to-r from-primary to-secondary text-white" 
                  variant="default"
                  onClick={() => {
                    closeArtworkDetails();
                    window.location.href = `/timeline`;
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  View in Timeline
                </Button>
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">View Related Works</Button>
              </CardFooter>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage; 