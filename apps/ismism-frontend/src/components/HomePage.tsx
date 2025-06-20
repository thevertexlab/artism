import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import IsmismIntro from './IsmismIntro';
import SimpleNavbar from './SimpleNavbar';
import { useNavigate } from 'react-router-dom';

// Format text with line breaks at commas
const formatTextWithLineBreaks = (text: string) => {
  return text.split(',').map((part, index, array) => (
    <React.Fragment key={index}>
      {part}
      {index < array.length - 1 && (
        <>
          ,<br />
        </>
      )}
    </React.Fragment>
  ));
};

const HomePage: React.FC = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFirstPhrase, setIsFirstPhrase] = useState(true);
  const [isAutoSwitch, setIsAutoSwitch] = useState(true);
  const introRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100 && !scrolled) {
        setScrolled(true);
        setShowIntro(true);
      } else if (scrollPosition <= 100 && scrolled) {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Text switching effect
  useEffect(() => {
    if (isAutoSwitch) {
      intervalRef.current = setInterval(() => {
        setIsFirstPhrase(prev => !prev);
      }, 3000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoSwitch]);

  // Handle text click
  const handlePhraseClick = () => {
    // Pause auto switching
    setIsAutoSwitch(false);
    // Manual switch
    setIsFirstPhrase(prev => !prev);
    
    // Resume auto switching after 5 seconds
    setTimeout(() => {
      setIsAutoSwitch(true);
    }, 5000);
  };

  // Scroll to intro section
  const scrollToIntro = () => {
    setShowIntro(true);
    if (introRef.current) {
      introRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Text content - with commas for line breaks
  const firstPhrase = "IF YOU THIS, WHY I NOT THAT";
  const secondPhrase = "IF YOU THAT, WHY NOT I THIS";

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0b]">
      <SimpleNavbar onMenuClick={() => {}} />
      
      {/* Dynamic background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0a0a0b] to-[#0a0a0b] opacity-80"></div>
        
        {/* Glow effects */}
        <div className="absolute -inset-[10px] opacity-60">
          {/* Top left glow */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse"></div>
          {/* Bottom right glow */}
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>
          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        </div>
      </div>
      
      {/* Homepage header */}
      <motion.div
        className="h-screen flex flex-col items-center justify-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center px-4 w-full max-w-[95%] lg:max-w-[85%] mx-auto flex flex-col h-full">
          {/* Top empty space */}
          <div className="flex-grow-0 h-[25vh]"></div>
          
          {/* Text section */}
          <div 
            className="relative overflow-visible cursor-pointer"
            onClick={handlePhraseClick}
          >
            <AnimatePresence mode="wait">
              {isFirstPhrase ? (
                <motion.div
                  key="phrase1"
                  className="w-full"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block w-full">
                      <div>IF YOU THIS,</div>
                      <div>WHY I NOT THAT</div>
                    </div>
                  </h1>
                </motion.div>
              ) : (
                <motion.div
                  key="phrase2"
                  className="w-full"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block w-full">
                      <div>IF YOU THAT,</div>
                      <div>WHY NOT I THIS</div>
                    </div>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Remaining space for button placement */}
          <div className="flex-grow flex items-center justify-center">
            <motion.div
              className="mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button
                onClick={scrollToIntro}
                className="flex flex-col items-center text-gray-300 hover:text-white transition-colors group mt-20"
              >
                <span className="mb-3 text-lg group-hover:text-blue-300 transition-colors">About</span>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-blue-400"
                >
                  <ChevronDown size={32} />
                </motion.div>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Ismism introduction section */}
      <div ref={introRef} className="min-h-screen z-10 relative">
        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <IsmismIntro />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage; 