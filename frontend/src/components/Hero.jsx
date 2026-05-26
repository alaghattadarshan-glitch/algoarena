import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-20 pb-16 flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      {/* Background visual elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/10 text-[#00f3ff] text-sm font-medium mb-6 backdrop-blur-md">
          v2.0 Single-Page Advanced Engine
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#00f3ff] mb-6 drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">
          Sorting Arena
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
          Watch multiple algorithms compete in real-time. Configure datasets, adjust execution speeds, and analyze live performance metrics.
        </p>

        <div className="max-w-4xl mx-auto bg-black/40 border border-[#00f3ff]/20 rounded-2xl p-6 text-left backdrop-blur-sm mb-10 shadow-[0_0_30px_rgba(0,243,255,0.05)]">
          <h3 className="text-[#00f3ff] font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00f3ff] rounded-full animate-pulse"></span>
            About Sorting Algorithms
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            <strong className="text-white">How they work:</strong> Sorting algorithms take an unordered collection of data and arrange it mathematically into a specific sequence (ascending or descending) using comparisons, swaps, or bucketing strategies.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            <strong className="text-white">Why they matter:</strong> Searching through an unsorted dataset takes linear time $O(N)$. By sorting the data first, we can unlock blazing fast algorithms like Binary Search to find items in $O(\log N)$ time.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">Real-world applications:</strong> Database indexing (SQL), rendering graphics by depth (Z-buffering), optimizing e-commerce search results, processing scheduling in OS kernels, and compressing data.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
