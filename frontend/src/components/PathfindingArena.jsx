import React, { useEffect } from 'react';
import { useGraphStore } from '../store/useGraphStore';
import GraphGrid from '../visualizers/GraphGrid';
import GraphEngine from './GraphEngine';
import AlgorithmWikiModal from './AlgorithmWikiModal';
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
    },
    {
      id: 'greedy',
      name: 'Greedy Best-First Search',
      imagePath: '/algoarena/img/greedy_flow.png',
      imageAlt: 'Greedy Flowchart',
      colorGradient: 'from-red-500 to-yellow-500',
      borderColor: 'border-red-500/30',
      imageExplanation: "This diagram illustrates the danger of being 'greedy'. The algorithm ignores the G-cost (how far it has traveled) and only looks at the H-cost (how close it looks to the goal). It sprints blindly toward the target, often getting trapped in dead-ends or finding sub-optimal zigzag paths.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Greedy Best-First explores the graph by expanding the most promising node chosen according to a specified rule. It uses only a heuristic function f(n) = h(n) to estimate the cost to the goal, completely ignoring the cost already incurred.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(b^m) worst case.</li>
            <li><strong>Space:</strong> O(b^m) worst case.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Greedy is used when speed is absolutely critical and finding the mathematical 'best' path doesn't matter (e.g., real-time enemy AI swarming the player in a fast-paced shooter). It is incredibly fast, but does not guarantee the shortest path.</p>
        </>
      )
    },
    {
      id: 'bidirectional',
      name: 'Bidirectional Swarm',
      imagePath: '/algoarena/img/pathfinding_flowchart.png',
      imageAlt: 'Bidirectional Swarm Flowchart',
      colorGradient: 'from-fuchsia-500 to-indigo-500',
      borderColor: 'border-fuchsia-500/30',
      imageExplanation: "This diagram shows a pincer maneuver. Two separate search algorithms (like BFS or A*) launch simultaneously—one from the Start Node, and one from the End Node. When the two frontiers collide in the middle, the paths are fused together.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Bidirectional search runs two simultaneous searches: one forward from the initial state and the other backward from the goal. It replaces a single massive search graph with two much smaller sub-graphs that meet in the middle.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(b^(d/2)). This is a massive optimization over O(b^d).</li>
            <li><strong>Space:</strong> O(b^(d/2)).</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Used heavily in massive social network analysis (like checking the 'Degrees of Separation' between two LinkedIn users) where a standard BFS would quickly run out of memory trying to search billions of nodes.</p>
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
