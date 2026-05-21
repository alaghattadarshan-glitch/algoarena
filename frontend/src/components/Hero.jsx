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
          Algorithm Race Visualizer
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Watch multiple algorithms compete in real-time. Configure datasets, adjust execution speeds, and analyze live performance metrics in a futuristic arena.
        </p>
      </motion.div>
    </div>
  );
};

export default Hero;
