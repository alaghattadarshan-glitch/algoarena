import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#9d00ff] mb-6 drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">
          Watch Algorithms Compete in Real-Time
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
          The ultimate platform to visualize, compare, and analyze sorting, searching, and graph algorithms.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/arena">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] text-xl font-bold neon-border-blue hover:bg-[#00f3ff]/10 transition-colors"
            >
              Enter The Arena
            </motion.button>
          </Link>
          <Link to="/algorithms">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-bold shadow-[0_0_20px_rgba(157,0,255,0.4)]"
            >
              Algorithm Encyclopedia
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Placeholder for animated 3D or visual demo on homepage */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-20 w-full max-w-5xl h-64 glass-panel rounded-2xl flex items-center justify-center border border-white/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#00f3ff]/10 to-transparent"></div>
        <h3 className="text-2xl text-gray-300 z-10 font-mono tracking-widest">[ LIVE RACE PREVIEW ]</h3>
      </motion.div>
    </div>
  );
};

export default Home;
