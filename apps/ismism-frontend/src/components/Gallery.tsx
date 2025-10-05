import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Search, X, Zap, ArrowRight, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import GalleryGrid from './GalleryGrid';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

// Import local database
import artStylesData from '../../data/artStyles.json';

// Sort option types
type SortOption = 'default' | 'year' | 'alphabetical' | 'style';
type SortDirection = 'asc' | 'desc';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  imageUrl: string;
  style: string;
  description: string;
}

// Convert artStyles data to Artwork format required by Gallery component
const convertArtStyleToArtwork = (artStyle: any): Artwork[] => {
  // Create artwork objects from each art style, one work for each artist
  return artStyle.artists.map((artist: string, index: number) => {
    // Determine image URL - using fixed index rules
    const imageIndex = 10001 + (index % 30);
    const imageUrl = `/TestData/${imageIndex}.jpg`;

    return {
      id: `${artStyle.id}-${index}`,
      title: `${artist}'s ${artStyle.title} Work`,
      artist: artist,
      year: artStyle.year,
      imageUrl: imageUrl,
      style: artStyle.title,
      description: artStyle.description
    };
  });
};

const Gallery = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [artStylesWithImages, setArtStylesWithImages] = useState(artStylesData);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const navigate = useNavigate();
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Try to load art style data with images
  useEffect(() => {
    // Show loading state
    setLoading(true);

    // Try to dynamically import artStylesWithImages.json
    const loadArtStylesWithImages = async () => {
      try {
        const response = await fetch('/data/artStylesWithImages.json');
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
        // Generate artwork data after loading is complete
        generateArtworks();
      }
    };

    loadArtStylesWithImages();
  }, []);

  // Generate artwork data
  const generateArtworks = () => {
    // Convert art style data to artworks
    const allArtworks = artStylesWithImages.flatMap(convertArtStyleToArtwork);

    // No need for additional image URL processing since convertArtStyleToArtwork ensures all artworks have image URLs
    setArtworks(allArtworks);
    setFilteredArtworks(allArtworks); // Initially set filtered artworks to all artworks
    setLoading(false);
  };

  // Regenerate artworks when artStylesWithImages updates
  useEffect(() => {
    generateArtworks();
  }, [artStylesWithImages]);

  // 排序函数
  const sortArtworks = (artworksToSort: Artwork[]): Artwork[] => {
    if (sortBy === 'default') {
      return artworksToSort;
    }
    
    let sorted: Artwork[] = [];
    
    switch (sortBy) {
      case 'year':
        sorted = [...artworksToSort].sort((a, b) => a.year - b.year);
        break;
      case 'alphabetical':
        sorted = [...artworksToSort].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'style':
        sorted = [...artworksToSort].sort((a, b) => a.style.localeCompare(b.style));
        break;
      default:
        return artworksToSort;
    }
    
    // If descending, reverse the array
    return sortDirection === 'desc' ? sorted.reverse() : sorted;
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Set sort option
  const handleSetSortBy = (option: SortOption) => {
    if (sortBy === option) {
      // If clicking current sort option, toggle sort direction
      toggleSortDirection();
    } else {
      // If selecting new sort option, set to ascending
      setSortBy(option);
      setSortDirection('asc');
    }
    setShowSortDropdown(false);
  };

  // Re-sort when sort options change
  useEffect(() => {
    // Avoid infinite loops, only re-sort when sort options change, not dependent on filteredArtworks
    if (searchTerm.trim()) {
      const filtered = artworks.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArtworks(sortArtworks(filtered));
    } else {
      setFilteredArtworks(sortArtworks(artworks));
    }
  }, [sortBy, artworks, searchTerm, sortDirection]);

  // Search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredArtworks(sortArtworks(artworks));
      return;
    }

    const filtered = artworks.filter(artwork =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredArtworks(sortArtworks(filtered));
  }, [searchTerm, artworks]);

  // Close sort dropdown when clicking elsewhere on the page
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close artwork details modal
  const closeArtworkDetails = () => {
    setSelectedArtwork(null);
  };

  // View art movement position on timeline
  const viewInTimeline = (style: string) => {
    // Navigate to timeline page, passing art movement name via URL parameter
    navigate(`/timeline?style=${encodeURIComponent(style)}`);
  };

  // Get art movement ID
  const getArtMovementId = (styleName: string): string => {
    // Find corresponding ID based on style name
    const styleToIdMap: Record<string, string> = {
      'Impressionism': 'impressionism',
      'Cubism': 'cubism',
      'Surrealism': 'surrealism',
      'Neo-Impressionism': 'neo-impressionism',
      'Post-Impressionism': 'post-impressionism',
      'Expressionism': 'expressionism',
      'Fauvism': 'fauvism',
      'Dadaism': 'dadaism',
      'Constructivism': 'constructivism',
      'Abstract Expressionism': 'abstract-expressionism',
      'Pop Art': 'pop-art',
      'Minimalism': 'minimalism',
      'Conceptual Art': 'conceptual-art',
      'Neo-Expressionism': 'neo-expressionism',
      'Installation Art': 'installation-art',
      'Video Art': 'video-art',
      'Performance Art': 'performance-art',
      'Digital Art': 'digital-art'
    };

    return styleToIdMap[styleName] || styleName.toLowerCase().replace(/\s+/g, '-');
  };

  // Navigate to art movement detail page
  const navigateToArtMovement = (style: string) => {
    closeArtworkDetails();
    const artMovementId = getArtMovementId(style);
    navigate(`/art-movement/${artMovementId}`);
  };

  // Navigate to artwork detail page
  const navigateToArtworkDetail = (artwork: Artwork) => {
    closeArtworkDetails();
    navigate(`/artwork/${artwork.id}`);
  };

  return (
    <div className="relative pb-10">
      {/* Header title and filter bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center">
            Art Movement Gallery
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <div className="flex items-center p-2 px-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  className="bg-transparent border-none outline-none text-sm text-muted-foreground w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Sort dropdown menu */}
            <div className="relative" ref={sortDropdownRef}>
                <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5 gap-2"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                {sortBy === 'default' && 'Default Sort'}
                {sortBy === 'year' && 'Sort by Time'}
                {sortBy === 'alphabetical' && 'Sort Alphabetically'}
                {sortBy === 'style' && 'Sort by Art Movement'}
                {sortBy !== 'default' && (
                  sortDirection === 'asc' ? 
                    <ArrowUp className="h-3 w-3 ml-1" /> : 
                    <ArrowDown className="h-3 w-3 ml-1" />
                )}
                <ChevronDown className="h-4 w-4" />
                </Button>
              
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[rgba(10,10,11,0.95)] backdrop-blur-lg rounded-lg border border-white/10 shadow-lg z-10"
                    onClick={() => setShowSortDropdown(false)}
                  >
                    <div className="py-1">
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${sortBy === 'default' ? 'text-blue-400' : 'text-gray-300'}`}
                        onClick={() => handleSetSortBy('default')}
                      >
                        Default Sort
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex justify-between items-center ${sortBy === 'year' ? 'text-blue-400' : 'text-gray-300'}`}
                        onClick={() => handleSetSortBy('year')}
                      >
                        <span>Sort by Time</span>
                        {sortBy === 'year' && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                        )}
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex justify-between items-center ${sortBy === 'alphabetical' ? 'text-blue-400' : 'text-gray-300'}`}
                        onClick={() => handleSetSortBy('alphabetical')}
                      >
                        <span>Sort Alphabetically</span>
                        {sortBy === 'alphabetical' && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                        )}
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex justify-between items-center ${sortBy === 'style' ? 'text-blue-400' : 'text-gray-300'}`}
                        onClick={() => handleSetSortBy('style')}
                      >
                        <span>Sort by Art Movement</span>
                        {sortBy === 'style' && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                        )}
                      </button>
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Content area */}
      {!loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
          {/* Display sort and filter status */}
          {(sortBy !== 'default' || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-6 flex flex-wrap items-center gap-2 text-sm text-gray-400"
            >
              <span>Currently showing:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-white/5 rounded-full flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button
                    className="ml-1 hover:text-blue-400"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {sortBy !== 'default' && (
                <span className="px-2 py-1 bg-white/5 rounded-full flex items-center gap-1">
                  {sortBy === 'year' && 'By Time'}
                  {sortBy === 'alphabetical' && 'Alphabetically'}
                  {sortBy === 'style' && 'By Art Movement'}
                  {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                  <button
                    className="ml-1 hover:text-blue-400"
                    onClick={() => {
                      setSortBy('default');
                      setSortDirection('asc');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <span className="ml-auto">
                Total {filteredArtworks.length} artworks
              </span>
            </motion.div>
          )}

          {filteredArtworks.length > 0 ? (
            <GalleryGrid artworks={filteredArtworks} onSelect={setSelectedArtwork} />
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No artworks found matching the criteria</p>
            </div>
          )}
      </motion.div>
      )}
      
      {/* Artwork details modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            onClick={closeArtworkDetails}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-[rgba(10,10,11,0.95)] backdrop-blur-lg rounded-xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden relative" 
              onClick={e => e.stopPropagation()}
            >
              <Button 
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-black/40 text-white hover:bg-black/60 z-10"
                onClick={closeArtworkDetails}
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 h-60 md:h-auto overflow-hidden bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                  <motion.img 
                    src={selectedArtwork.imageUrl} 
                    alt={selectedArtwork.title}
                    className="w-full h-full object-contain"
                    initial={{ filter: 'blur(10px)', opacity: 0 }}
                    animate={{ filter: 'blur(0px)', opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                      // Use fallback image when image loading fails
                      const target = e.target as HTMLImageElement;
                      const artworkIndex = parseInt(selectedArtwork.id.split('-')[1] || '0');
                      target.src = `/TestData/${10001 + (artworkIndex % 30)}.jpg`;
                    }}
                  />
                </div>
                
                <div className="md:w-1/2 p-6 flex flex-col">
                  <div className="mb-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {selectedArtwork.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                      <span>{selectedArtwork.artist}, {selectedArtwork.year}</span>
                      <span 
                        className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full cursor-pointer hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                        onClick={() => navigateToArtMovement(selectedArtwork.style)}
                      >
                        {selectedArtwork.style}
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto py-4 text-gray-300">
                    <p className="leading-relaxed">{selectedArtwork.description}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    <Button 
                      className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none"
                      onClick={() => navigateToArtworkDetail(selectedArtwork)}
                    >
                      <ArrowRight className="h-4 w-4" />
                      View Artwork Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white/10 hover:bg-white/5 gap-2"
                      onClick={() => viewInTimeline(selectedArtwork.style)}
                    >
                      <Zap className="h-4 w-4" />
                      View on Timeline
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white/10 hover:bg-white/5 gap-2"
                      onClick={() => navigateToArtMovement(selectedArtwork.style)}
                    >
                      <ArrowRight className="h-4 w-4" />
                      View Art Movement Details
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery; 