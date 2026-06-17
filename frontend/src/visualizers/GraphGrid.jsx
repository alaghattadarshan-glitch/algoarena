import React, { useState } from 'react';
import { useGraphStore } from '../store/useGraphStore';
import { graphAlgorithmsMap } from '../algorithms/pathfinding';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const evaluateGraphComplexity = (notation, n) => {
  const clean = notation.toLowerCase().replace(/\s/g, '');
  if (clean.includes('v+e') || clean.includes('e')) return n * 1.2;
  if (clean.includes('log')) return n * Math.log2(n) * 0.1;
  if (clean.includes('v^2') || clean.includes('v²')) return n * n * 0.01;
  if (clean.includes('v^(d/2)')) return Math.sqrt(n) * 2;
  return n;
};

const generateGraphComplexityData = (comp, maxNodes) => {
  const data = [];
  const step = Math.ceil(maxNodes / 10);
  for (let n = 10; n <= maxNodes; n += step) {
    data.push({
      name: `V=${n}`,
      'Time Complexity': evaluateGraphComplexity(comp.time, n),
      'Space Complexity': evaluateGraphComplexity(comp.space, n)
    });
  }
  return data;
};

const getComplexityColor = (complexity) => {
  if (!complexity) return 'bg-gray-500 shadow-[0_0_10px_rgba(107,114,128,0.6)]';
  if (complexity.includes('n²') || complexity.includes('V²')) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
  if (complexity.includes('log')) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]';
  if (complexity.includes('1')) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
  return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]';
};

const GraphGrid = ({ algorithm, index }) => {
  const { 
    grid, startNode, endNode, walls, toggleWall, raceStatus, metrics,
    clickTool, setStartNode, setEndNode
  } = useGraphStore();
  const [isMousePressed, setIsMousePressed] = useState(false);

  const metric = metrics[algorithm] || { visitedNodes: [], path: [], finished: false, time: 0 };
  const { visitedNodes, path } = metric;
  const complexity = graphAlgorithmsMap[algorithm].complexity;
  
  const totalNodes = grid.length * grid[0].length;

  const handleMouseDown = (row, col) => {
    if (raceStatus !== 'idle') return;
    setIsMousePressed(true);
    if (clickTool === 'start') {
      setStartNode(row, col);
    } else if (clickTool === 'end') {
      setEndNode(row, col);
    } else {
      toggleWall(row, col);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (raceStatus !== 'idle' || !isMousePressed) return;
    if (clickTool === 'start') {
      setStartNode(row, col);
    } else if (clickTool === 'end') {
      setEndNode(row, col);
    } else {
      toggleWall(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const colors = [
    'rgba(59, 130, 246, 0.7)',  // Blue
    'rgba(168, 85, 247, 0.7)',  // Purple
    'rgba(16, 185, 129, 0.7)',  // Green
    'rgba(249, 115, 22, 0.7)'   // Orange
  ];
  const activeColor = colors[index % colors.length];

  const pathSet = new Set(path.map(p => `${p.row}-${p.col}`));
  const visitedSet = new Set(visitedNodes.map(v => `${v.row}-${v.col}`));

  return (
    <div className={`glass-panel flex flex-col rounded-xl overflow-hidden transition-all ${metric.finished ? 'border-2 border-green-400 shadow-[0_0_15px_#4ade80]' : 'border border-white/10'}`}>
      
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/40">
        <h3 className="text-md font-bold text-white">{algorithm}</h3>
        {metric.finished && <span className="text-[10px] font-bold text-green-400 bg-green-400/20 px-2 py-1 rounded shadow-[0_0_10px_#4ade80]">FINISHED</span>}
      </div>
      
      {/* Grid Area */}
      <div 
        className="flex-1 p-2 bg-[#050505] flex flex-col items-center justify-center relative"
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="grid gap-[1px]" 
          style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
        >
          {grid.map((row, rowIdx) => (
            row.map((node, colIdx) => {
              const key = `${node.row}-${node.col}`;
              const isStart = node.row === startNode.row && node.col === startNode.col;
              const isEnd = node.row === endNode.row && node.col === endNode.col;
              const isWall = walls.has(key);
              
              const isPath = pathSet.has(key);
              const isVisited = !isPath && visitedSet.has(key);

              let bgClass = 'bg-[#1a1a1a] hover:bg-[#2a2a2a]';
              let extraStyle = {};

              if (isStart) {
                bgClass = 'bg-[#00f3ff] shadow-[0_0_10px_#00f3ff] z-10';
              } else if (isEnd) {
                bgClass = 'bg-[#ff003c] shadow-[0_0_10px_#ff003c] z-10';
              } else if (isWall) {
                bgClass = 'bg-gray-400';
              } else if (isPath) {
                bgClass = 'bg-[#00ff88] shadow-[0_0_8px_#00ff88] z-10';
              } else if (isVisited) {
                extraStyle = { backgroundColor: activeColor };
                bgClass = ''; // Controlled by style
              }

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  id={`node-${rowIdx}-${colIdx}`}
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200 ${bgClass}`}
                  style={extraStyle}
                  onMouseDown={() => handleMouseDown(node.row, node.col)}
                  onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                  onMouseUp={handleMouseUp}
                ></div>
              );
            })
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-3 bg-[#0a0a0a] border-t border-white/5 text-[10px] text-gray-400 font-mono text-center divide-x divide-white/10">
        <div className="py-2 flex flex-col">
          <span className="text-gray-500 uppercase">Visited</span>
          <span className="text-white font-bold">{visitedNodes.length}</span>
        </div>
        <div className="py-2 flex flex-col">
          <span className="text-gray-500 uppercase">Path Length</span>
          <span className="text-white font-bold">{path.length}</span>
        </div>
        <div className="py-2 flex flex-col">
          <span className="text-gray-500 uppercase">Time</span>
          <span className="text-white font-bold">{(metric.time || 0).toFixed(1)}ms</span>
        </div>
      </div>
      
      {/* Complexity Graph Panel */}
      <div className="bg-[#050505] p-3 border-t border-white/5 flex gap-4 h-28 relative group cursor-help">
        
        {/* Tooltip Layer */}
        <div className="absolute -top-12 left-0 right-0 p-2 bg-black/90 border border-[#9d00ff]/50 rounded text-white text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-[0_0_15px_rgba(157,0,255,0.3)]">
          {complexity.tooltip}
        </div>

        <div className="flex flex-col justify-center gap-2 text-[10px] font-mono text-gray-300 w-1/3">
          <span className="text-[#9d00ff] font-bold mb-1 uppercase tracking-wider">{complexity.tag}</span>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Time:</span> 
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getComplexityColor(complexity.time)}`}></span>
              <span className="text-yellow-400">{complexity.time}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Space:</span> 
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getComplexityColor(complexity.space)}`}></span>
              <span className="text-[#00f3ff]">{complexity.space}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-2/3 h-full relative">
          <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 text-center block">
            Asymptotic Growth (V={totalNodes})
          </span>
          <div className="flex-1 bg-black/40 rounded border border-white/5 relative min-h-[50px]">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateGraphComplexityData(complexity, totalNodes)} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#888" style={{ fontSize: 7 }} />
                  <YAxis stroke="#888" style={{ fontSize: 7 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222', fontSize: 8 }}
                    itemStyle={{ padding: 0 }}
                  />
                  <Line type="monotone" dataKey="Time Complexity" stroke="#00f3ff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="Space Complexity" stroke="#10b981" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphGrid;
