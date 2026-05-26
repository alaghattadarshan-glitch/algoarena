import React from 'react';
import { motion } from 'framer-motion';
import InfoModal from './InfoModal';
import { Cpu, Globe2, Lightbulb } from 'lucide-react';

const Hero = () => {
  const sortingInfo = (
    <div className="flex flex-col gap-6">
      <div className="w-full rounded-2xl overflow-hidden border border-[#00f3ff]/30 shadow-[0_0_30px_rgba(0,243,255,0.15)] relative">
        <img src="/algoarena/img/sorting_flowchart.png" alt="Sorting Algorithm Diagram" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="bg-black/40 border border-[#00f3ff]/20 p-5 rounded-xl">
        <h3 className="text-[#00f3ff] font-bold text-lg mb-2 flex items-center gap-2"><Cpu className="w-5 h-5"/> Computational Mechanics</h3>
        <p className="mb-3 text-gray-300">
          Sorting algorithms transform a mathematically disordered dataset into a structured, monotonic sequence (either ascending or descending).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li><strong>Comparisons:</strong> The engine asks "Is Element A larger than Element B?" This is the core logic engine of $O(N \log N)$ bounds.</li>
          <li><strong>Swaps:</strong> The physical memory operation of transposing two values. Swapping is often more expensive than comparing in physical hardware!</li>
          <li><strong>In-Place vs Out-of-Place:</strong> "In-Place" algorithms (like Quick Sort) modify the original array, using $O(1)$ memory. "Out-of-Place" (like Merge Sort) require an entirely separate $O(N)$ memory buffer.</li>
        </ul>
      </div>

      <div className="bg-black/40 border border-green-500/20 p-5 rounded-xl">
        <h3 className="text-green-400 font-bold text-lg mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5"/> Algorithmic Tradeoffs</h3>
        <p className="mb-3 text-gray-300">
          There is no "perfect" algorithm. Choosing the right one depends entirely on the dataset:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li><strong>Nearly Sorted Data:</strong> Insertion Sort operates in nearly $O(N)$ linear time!</li>
          <li><strong>Massive Datasets:</strong> Radix Sort ignores comparisons entirely and uses memory "buckets" to sort integers in $O(N)$ time.</li>
          <li><strong>Memory Constrained:</strong> Heap Sort guarantees $O(N \log N)$ worst-case performance while using exactly $O(1)$ extra memory.</li>
        </ul>
      </div>

      <div className="bg-black/40 border border-purple-500/20 p-5 rounded-xl">
        <h3 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2"><Globe2 className="w-5 h-5"/> Industry Applications</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li><strong>Database Engines (PostgreSQL / MySQL):</strong> Indexing petabytes of data using B-Trees and specific sorting derivatives to allow hyper-fast querying.</li>
          <li><strong>Computer Graphics:</strong> Painter's Algorithm and Z-buffering require sorting polygons by depth distance from the camera before rendering frames to the GPU.</li>
          <li><strong>Compression Algorithms:</strong> The Burrows-Wheeler Transform (used in bzip2) requires sorting massive permutations of strings to optimize entropy.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden pt-20 pb-16 flex flex-col items-center justify-center min-h-[40vh] px-4 text-center">
      <InfoModal title="The Science of Sorting" content={sortingInfo} />
      
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
      </motion.div>
    </div>
  );
};

export default Hero;
