import React from 'react';
import Hero from './components/Hero';
import ControlPanel from './components/ControlPanel';
import SortingVisualizer from './visualizers/SortingVisualizer';
import CustomIDE from './components/CustomIDE';
import ComparisonCharts from './components/ComparisonCharts';
import RaceEngine from './components/RaceEngine';
import AIAnalyst from './components/AIAnalyst';
import PathfindingArena from './components/PathfindingArena';
import { useRaceStore } from './store/useRaceStore';
import { motion, AnimatePresence } from 'framer-motion';
import TreeArena from './components/TreeArena';

function App() {
  const { algorithms, winner, raceStatus, arenaMode, setArenaMode } = useRaceStore();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#00f3ff] selection:text-black font-sans pb-20 relative overflow-x-hidden">
      
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 flex justify-center gap-8 py-4">
        <button 
          onClick={() => setArenaMode('sorting')}
          className={`font-black tracking-widest uppercase transition-colors ${arenaMode === 'sorting' ? 'text-[#00f3ff] drop-shadow-[0_0_10px_#00f3ff]' : 'text-gray-500 hover:text-white'}`}
        >
          Sorting Arena
        </button>
        <button 
          onClick={() => setArenaMode('graph')}
          className={`font-black tracking-widest uppercase transition-colors ${arenaMode === 'graph' ? 'text-[#9d00ff] drop-shadow-[0_0_10px_#9d00ff]' : 'text-gray-500 hover:text-white'}`}
        >
          Pathfinding Arena
        </button>
        <button 
          onClick={() => setArenaMode('tree')}
          className={`font-black tracking-widest uppercase transition-colors ${arenaMode === 'tree' ? 'text-[#ff0080] drop-shadow-[0_0_10px_#ff0080]' : 'text-gray-500 hover:text-white'}`}
        >
          Tree Arena
        </button>
      </div>

      <RaceEngine />
      
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 mt-16">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 pt-20">
        
        {arenaMode === 'sorting' && (
          <>
            <Hero />
            <CustomIDE />
            <ControlPanel />
            <AIAnalyst />

            {/* Winner Summary Banner */}
            <AnimatePresence>
              {winner && raceStatus === 'finished' && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border border-green-500/50 p-6 rounded-2xl text-center shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-md"
                >
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200 uppercase tracking-widest">
                    Winner: {winner}
                  </h2>
                  <p className="text-green-100 mt-2">Finished first based on execution steps!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Visualizers Grid */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
              {algorithms.length === 0 ? (
                <div className="text-center py-20 text-gray-500 border border-dashed border-gray-700 rounded-2xl">
                  Select algorithms above to enter the arena.
                </div>
              ) : (
                <div className={`grid gap-6 ${algorithms.length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : algorithms.length === 2 ? 'grid-cols-1 md:grid-cols-2' : algorithms.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                  {algorithms.map((algo, index) => (
                    <SortingVisualizer key={algo} algorithm={algo} index={index} />
                  ))}
                </div>
              )}
            </div>

            {/* Charts Section */}
            <div className="max-w-7xl mx-auto px-4">
              <ComparisonCharts />
            </div>
          </>
        )}
        
        {arenaMode === 'graph' && (
          <PathfindingArena />
        )}

        {arenaMode === 'tree' && (
          <TreeArena />
        )}

      </div>
    </div>
  );
}

export default App;
