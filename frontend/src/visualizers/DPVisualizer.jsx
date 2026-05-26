import React from 'react';
import { useDpStore } from '../store/useDpStore';
import { motion } from 'framer-motion';

const DPVisualizer = () => {
  const { grid, rowHeaders, colHeaders, activeCell, referenceCells, matchCells } = useDpStore();

  if (!grid || grid.length === 0) return null;

  return (
    <div className="w-full flex justify-center p-8 overflow-x-auto">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <div className="w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>
        
        <table className="border-collapse border-spacing-0 relative z-10">
          <thead>
            <tr>
              {/* Top-left empty cell */}
              <th className="p-2 min-w-[3rem] h-12"></th>
              {/* Col headers (e.g., String 2, or Capacity) */}
              {colHeaders.map((colHeader, cIndex) => (
                <th key={cIndex} className="p-2 min-w-[3rem] h-12 text-center text-[#ffae00] font-black text-lg border-b border-l border-white/20 bg-black/40 shadow-inner">
                  {colHeader}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, rIndex) => (
              <tr key={rIndex}>
                {/* Row header (e.g., String 1, or Items) */}
                <th className="p-2 min-w-[3rem] h-12 text-center text-[#ffae00] font-black text-lg border-b border-r border-white/20 bg-black/40 shadow-inner">
                  {rowHeaders[rIndex]}
                </th>
                
                {/* Grid cells */}
                {row.map((val, cIndex) => {
                  const isActive = activeCell?.r === rIndex && activeCell?.c === cIndex;
                  const isReferenced = referenceCells.some(cell => cell.r === rIndex && cell.c === cIndex);
                  const isMatched = matchCells.some(cell => cell.r === rIndex && cell.c === cIndex);
                  
                  let borderColor = 'border-white/10';
                  let textColor = 'text-gray-300';
                  let scale = 1;
                  let zIndex = 0;
                  let glow = '';

                  if (isActive) {
                    borderColor = 'border-[#ffae00]';
                    textColor = 'text-black';
                    scale = 1.1;
                    zIndex = 20;
                    glow = 'shadow-[0_0_20px_#ffae00]';
                  } else if (isReferenced) {
                    borderColor = 'border-cyan-400';
                    textColor = 'text-cyan-100';
                    scale = 1.05;
                    zIndex = 10;
                    glow = 'shadow-[0_0_15px_rgba(34,211,238,0.5)]';
                  } else if (isMatched) {
                    borderColor = 'border-pink-500/50';
                    textColor = 'text-pink-300';
                    glow = 'shadow-[inset_0_0_10px_rgba(236,72,153,0.3)]';
                  }

                  // To visually separate the "zero padding" row/col typical in DP:
                  if ((rIndex === 0 || cIndex === 0) && !isActive && !isReferenced && !isMatched) {
                     textColor = 'text-gray-600';
                  }

                  return (
                    <td key={cIndex} className="p-0 border border-white/10 relative">
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale, backgroundColor: isActive ? '#ffae00' : isReferenced ? 'rgba(6, 182, 212, 0.4)' : isMatched ? 'rgba(236, 72, 153, 0.2)' : (rIndex === 0 || cIndex === 0) ? '#0a0a0f' : '#1a1a2e' }}
                        transition={{ duration: 0.2 }}
                        className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded-sm ${borderColor} ${textColor} ${glow}`}
                        style={{ zIndex }}
                      >
                        {val}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DPVisualizer;
