import React, { useEffect, useState } from 'react';
import { useGraphStore } from '../store/useGraphStore';
import GraphGrid from '../visualizers/GraphGrid';
import GraphEngine from './GraphEngine';
import AlgorithmWikiModal from './AlgorithmWikiModal';
import { Cpu, Globe2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PathfindingArena = () => {
  const { 
    initializeGrid, algorithms, toggleAlgorithm, clearWalls, generateMaze,
    speed, setSpeed, raceStatus, startRace, resetRace, winner,
    rows, cols, startNode, endNode, clickTool, setClickTool, setRows, setCols,
    setStartNode, setEndNode
  } = useGraphStore();

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const availableAlgos = ['BFS', 'DFS', 'Dijkstra', 'A* Search'];

  const pathfindingWikiData = [
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      imagePath: '/algoarena/img/bfs_flow.png',
      imageAlt: 'BFS Flowchart',
      colorGradient: 'from-cyan-400 to-blue-500',
      borderColor: 'border-cyan-400/30',
      imageExplanation: "This diagram shows a ripple-like expansion. A FIFO (First-In, First-Out) Queue manages the frontier, guaranteeing that all nodes at layer N are fully explored before any node at layer N+1 is touched. This perfectly symmetrical expansion is what guarantees the absolute shortest path in unweighted graphs.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">BFS starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a 'search key') and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(V + E) where V is vertices and E is edges.</li>
            <li><strong>Space:</strong> O(V) to store the queue.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>BFS is used in peer-to-peer networks (like BitTorrent) to find all neighbor nodes, web crawlers to build search indexes layer by layer, and GPS navigation systems to find the shortest path when all roads have an equal distance cost.</p>
        </>
      )
    },
    {
      id: 'dfs',
      name: 'Depth-First Search',
      imagePath: '/algoarena/img/dfs_flow.png',
      imageAlt: 'DFS Flowchart',
      colorGradient: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/30',
      imageExplanation: "This flowchart illustrates the blind, plunging nature of DFS. It uses a LIFO (Last-In, First-Out) Stack. The search immediately shoots down a single path as deep as possible until it hits a dead-end, at which point the stack 'pops' the nodes off to backtrack to the nearest intersection.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">DFS explores as far as possible along each branch before backtracking. It relies heavily on recursion (which inherently uses the system call stack) or a manual stack data structure to remember where to backtrack to once a dead end is reached.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(V + E).</li>
            <li><strong>Space:</strong> O(V) for the stack memory.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>DFS is brilliant for maze generation, topological sorting (like compiling code dependencies where A must build before B), and finding strongly connected components in massive social network graphs.</p>
        </>
      )
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      imagePath: '/algoarena/img/dijkstra_flow.png',
      imageAlt: 'Dijkstra Flowchart',
      colorGradient: 'from-yellow-400 to-orange-500',
      borderColor: 'border-yellow-400/30',
      imageExplanation: "This diagram shows a graph with weighted edges (costs). Instead of a standard queue, Dijkstra uses a Priority Queue to constantly select the node with the lowest total travel cost from the Start node. This ensures it mathematically calculates the absolute shortest path around obstacles.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Dijkstra's algorithm finds the shortest path between nodes in a graph. It maintains a set of unvisited nodes and calculates a tentative distance for every node. It continually selects the unvisited node with the smallest tentative distance, updates its neighbors, and marks it as visited.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O((V + E) log V) with a binary heap priority queue.</li>
            <li><strong>Space:</strong> O(V).</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Dijkstra is the backbone of network routing protocols (OSPF - Open Shortest Path First), finding the fastest route in Google Maps (factoring in traffic time as the 'weight'), and flight itinerary systems.</p>
        </>
      )
    },
    {
      id: 'astar',
      name: 'A* Search',
      imagePath: '/algoarena/img/astar_flow.png',
      imageAlt: 'A-Star Flowchart',
      colorGradient: 'from-green-400 to-cyan-500',
      borderColor: 'border-green-400/30',
      imageExplanation: "The ultimate pathfinder. This flowchart shows the F = G + H calculation. It doesn't just calculate distance traveled (G), it uses a straight-line Heuristic (H) to 'guess' how close it is to the goal. This pulls the search beam directly toward the target like a magnet.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">A* is a 'smart' informed search algorithm. It combines the guaranteed shortest-path capabilities of Dijkstra with a heuristic (a rule-of-thumb guess, like Euclidean distance). At each step, it chooses the path that minimizes F(n) = G(n) + H(n).</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(E) in the best case, but bounded exponentially in the worst case depending on the heuristic quality.</li>
            <li><strong>Space:</strong> O(V) as it stores all generated nodes in memory.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>A* is the undisputed king of Video Game AI. Almost every unit moving in a modern Strategy game (like StarCraft or Age of Empires) uses A* to navigate complex terrain while avoiding dynamic obstacles.</p>
        </>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 relative">
      <AlgorithmWikiModal title="Pathfinding Wiki" sections={pathfindingWikiData} />
      
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
                type="range" min="1" max="1000" value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-[#9d00ff] bg-gray-800 rounded-lg appearance-none h-1"
              />
            </div>
            <p className="text-[10px] text-gray-500 italic mt-2">
              Tip: Drag on any grid below to place start/end or walls depending on tool mode!
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

        {/* Custom Data Input Controls */}
        <div className="border-t border-[#9d00ff]/20 pt-6 mt-6">
          <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></span>
            Arena Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Click Interaction Tool */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mouse Mode</span>
              <div className="flex gap-2.5 mt-1">
                <button 
                  onClick={() => setClickTool('wall')}
                  disabled={raceStatus !== 'idle'}
                  className={`flex-1 px-3 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition ${clickTool === 'wall' ? 'bg-[#9d00ff] text-white shadow-[0_0_10px_#9d00ff]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  🧱 Draw Walls
                </button>
                <button 
                  onClick={() => setClickTool('start')}
                  disabled={raceStatus !== 'idle'}
                  className={`flex-1 px-3 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition ${clickTool === 'start' ? 'bg-[#00f3ff] text-black shadow-[0_0_10px_#00f3ff]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  🟢 Set Start Node
                </button>
                <button 
                  onClick={() => setClickTool('end')}
                  disabled={raceStatus !== 'idle'}
                  className={`flex-1 px-3 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition ${clickTool === 'end' ? 'bg-[#ff003c] text-white shadow-[0_0_10px_#ff003c]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  🔴 Set End Node
                </button>
              </div>
            </div>

            {/* Grid Size Parameters */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Grid Dimensions</span>
              <div className="flex gap-4 mt-1">
                <div className="flex-1 flex items-center justify-between bg-white/5 border border-white/10 rounded px-3 py-1.5">
                  <span className="text-xs text-gray-400">Rows (5-30)</span>
                  <input 
                    type="number" 
                    min="5" 
                    max="30" 
                    value={rows} 
                    disabled={raceStatus !== 'idle'}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 5 && val <= 30) setRows(val);
                    }}
                    className="bg-black/60 border border-purple-500/30 rounded px-2 py-0.5 text-white text-xs w-14 text-center outline-none focus:border-[#9d00ff]"
                  />
                </div>
                <div className="flex-1 flex items-center justify-between bg-white/5 border border-white/10 rounded px-3 py-1.5">
                  <span className="text-xs text-gray-400">Cols (5-60)</span>
                  <input 
                    type="number" 
                    min="5" 
                    max="60" 
                    value={cols} 
                    disabled={raceStatus !== 'idle'}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 5 && val <= 60) setCols(val);
                    }}
                    className="bg-black/60 border border-[#9d00ff]/30 rounded px-2 py-0.5 text-white text-xs w-14 text-center outline-none focus:border-[#9d00ff]"
                  />
                </div>
              </div>
            </div>

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
