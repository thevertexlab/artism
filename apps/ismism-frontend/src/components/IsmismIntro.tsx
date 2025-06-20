import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IsmismIntro: React.FC = () => {
  const navigate = useNavigate();

  const navigateToTimeline = () => {
    navigate('/timeline');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black/20 to-black/40 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            Ismism Machine
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Deconstruction and Reconstruction of Art Movements
          </p>
        </motion.div>

        {/* Detailed introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg prose-invert mx-auto mb-16 text-gray-300 leading-relaxed"
        >
          <p>
            The Ismism Machine is an engine of thought, as well as a deep dissection and 
            reorganization of the tradition of "isms" in art history. The project takes a 
            highly critical perspective to analyze the phenomenon of endless "isms" in modern 
            and contemporary art—whether Impressionism, Expressionism, or Postmodernism and 
            Conceptualism, these labels constantly evolve throughout art history, often 
            remaining superficial changes in form and style rather than true innovation in 
            concepts and essence.
          </p>
          <p>
            Through deconstructing, recombining, and recreating existing "isms," the Ismism 
            Machine generates numerous new and absurd "isms"—these new "isms" are both 
            parodies of history and satires of the current art ecosystem. The project employs 
            various artistic methods such as anagramme, semantic displacement, and conceptual 
            collage to transform serious art theories into playful and critical textual and 
            visual works. When confronted with these new "isms," audiences experience both 
            absurdity and humor, while being forced to consider: Is artistic progress a 
            breakthrough in concepts, or merely an accumulation of labels? Are artists simply 
            wandering within the shells of "isms" while neglecting innovation at the core?
          </p>
          <p>
            With its unique satirical and experimental nature, the Ismism Machine reveals the 
            dilemmas and misconceptions of contemporary art in the carnival of "isms," calling 
            for artists and viewers to reexamine the essence of art and its future possibilities. 
            It is not only a reflection on art history but also a radical questioning of the 
            future of art.
          </p>
        </motion.div>

        {/* Explore button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <button 
            onClick={navigateToTimeline}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <span>Explore Art Timeline</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default IsmismIntro; 