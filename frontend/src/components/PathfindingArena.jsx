import React, { useEffect } from 'react';
import { useGraphStore } from '../store/useGraphStore';
import GraphGrid from '../visualizers/GraphGrid';
import GraphEngine from './GraphEngine';
import InfoModal from './InfoModal';
import { Cpu, Globe2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PathfindingArena = () => {
  const { 
    initializeGrid, algorithms, toggleAlgorithm, clearWalls, generateMaze,
    speed, setSpeed, raceStatus, startRace, resetRace, winner
  } = useGraphStore();

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const availableAlgos = ['BFS', 'DFS', 'Dijkstra', 'A* Search', 'Greedy Best-First', 'Bidirectional Swarm'];

  const pathfindingInfo = (
    <div className="flex flex-col gap-6">
      <div className="w-full rounded-2xl overflow-hidden border border-[#9d00ff]/30 shadow-[0_0_30px_rgba(157,0,255,0.15)] relative">
        <img src="/algoarena/img/pathfinding_flowchart.png" alt="Pathfinding Algorithm Diagram" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="bg-black/40 border border-[#9d00ff]/20 p-5 rounded-xl">
        <h3 className="text-[#9d00ff] font-bold text-lg mb-2 flex items-center gap-2"><Cpu className="w-5 h-5"/> Graph Traversal Mechanics</h3>
        <p className="mb-3 text-gray-300">
          Pathfinding algorithms explore a mathematical graph (like a grid of nodes) to find a route from a Start point to a Destination while avoiding obstacles.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li><strong>Uninformed Search:</strong> Algorithms like BFS (Breadth-First) expand equally in all directions, guaranteeing the shortest path but wasting massive amounts of compute time on irrelevant areas.</li>
          <li><strong>Heuristics:</strong> Algorithms like A* use a "heuristic" (a smart guess, like calculating the straight-line Manhattan distance to the target) to prioritize exploring nodes that seem closer to the goal.</li>
          <li><strong>Weights:</strong> In real networks (like roads), some paths cost more than others (traffic, tolls). Dijkstra's algorithm perfectly handles these weighted graphs.</li>
        </ul>
      </div>

      <div className="bg-black/40 border border-green-500/20 p-5 rounded-xl mt-6">
        <h3 className="text-green-400 font-bold text-lg mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5"/> Algorithmic Optimization</h3>
        <p className="mb-3 text-gray-300">
          Reducing the search space is critical for high-performance pathfinding.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li><strong>Bidirectional Swarm:</strong> Initiating a search from both the Start node and the End node simultaneously mathematically cuts the search space exponent in half!</li>
          <li><strong>Greedy Best-First:</strong> By ignoring the cost of the path taken and blindly rushing towards the target heuristic, it finds *a* path extremely fast, but sacrifices the guarantee of it being the *shortest* path.</li>
        </ul>
      </div>

      <div className="bg-black/40 border border-purple-500/20 p-5 rounded-xl mt-6">
        <h3 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2"><Globe2 className="w-5 h-5"/> Industry Applications</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li><strong>GPS & Mapping:</strong> Google Maps relies heavily on A* and Dijkstra variants to calculate the fastest route between two cities considering traffic weights.</li>
          <li><strong>Video Game AI:</strong> NPCs use A* pathfinding on "NavMeshes" to navigate around obstacles and chase the player.</li>
          <li><strong>Network Routing:</strong> Internet packets use shortest-path algorithms like OSPF (Open Shortest Path First) to navigate router topologies.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 relative">
      <InfoModal title="The Science of Pathfinding" content={pathfindingInfo} />
      
      {/* Header Info */}
      <div className="mb-8 relative z-10 pointer-events-none">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#9d00ff] uppercase tracking-widest mb-6 drop-shadow-[0_0_15px_rgba(157,0,255,0.3)]">
          Pathfinding Arena
        </h1>
      </div>
      {/* Graph Control Panel */}
      <div className="glass-panel p-6 rounded-2xl w-full mx-auto mb-8 border border-[#9d00ff]/30 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Settings */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#9d00ff] animate-pulse"></span>
               Grid Parameters
            </h3>
            <div>
               <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Traversal Speed (Steps/sec)</span>
                <span className="text-[#9d00ff]">{speed}</span>
              </div>
              <input 
                type="range" min="10" max="1000" value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-[#9d00ff] bg-gray-800 rounded-lg appearance-none h-1"
              />
            </div>
            <p className="text-[10px] text-gray-500 italic mt-2">
              Tip: Click and drag on any grid below to draw walls!
            </p>
          </div>

          {/* Competitors */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Pathfinding Algorithms</h3>
              <div className="flex flex-wrap gap-2">
                {availableAlgos.map(algo => {
                  const isSelected = algorithms.includes(algo);
                  return (
                    <button 
                      key={algo}
                      onClick={() => toggleAlgorithm(algo)}
                      disabled={raceStatus !== 'idle'}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        isSelected 
                        ? 'bg-gradient-to-r from-purple-600 to-[#9d00ff]/80 text-white shadow-[0_0_10px_rgba(157,0,255,0.4)] border border-transparent' 
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {algo}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
               <button 
                 onClick={generateMaze}
                 disabled={raceStatus !== 'idle'}
                 className="py-1.5 px-4 rounded text-xs border border-purple-500 text-purple-400 hover:bg-purple-500/20 transition shadow-[0_0_10px_rgba(157,0,255,0.2)]"
               >
                 Generate Maze
               </button>
               <button 
                 onClick={clearWalls}
                 disabled={raceStatus !== 'idle'}
                 className="py-1.5 px-4 rounded text-xs border border-gray-600 hover:bg-white/10 transition"
               >
                 Clear All Walls
               </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-end">
            {raceStatus === 'idle' && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startRace}
                disabled={algorithms.length === 0}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9d00ff] to-fuchsia-500 text-white font-black tracking-widest uppercase shadow-[0_0_20px_rgba(157,0,255,0.5)] disabled:opacity-50"
              >
                Start Race
              </motion.button>
            )}

            {raceStatus === 'running' && (
              <button 
                disabled
                className="w-full py-2.5 rounded-lg bg-yellow-500/20 border border-yellow-500 text-yellow-500 font-black tracking-widest uppercase shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-pulse"
              >
                Traversing...
              </button>
            )}

            {raceStatus === 'finished' && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={resetRace}
                className="w-full py-2.5 rounded-lg bg-white text-black font-black tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              >
                Reset Grid
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <GraphEngine />

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
              Shortest Path Found: {winner}
            </h2>
            <p className="text-green-100 mt-2">Finished first based on execution nodes visited!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visualizers Grid */}
      <div className="mb-12">
        {algorithms.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-dashed border-gray-700 rounded-2xl">
            Select graph algorithms above to render grids.
          </div>
        ) : (
          <div className={`grid gap-6 ${algorithms.length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : algorithms.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
            {algorithms.map((algo, index) => (
              <GraphGrid key={algo} algorithm={algo} index={index} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default PathfindingArena;
