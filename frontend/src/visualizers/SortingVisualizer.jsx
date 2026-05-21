import React from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { algorithmsMap } from '../algorithms/sorting';

const SortingVisualizer = ({ algorithm, index }) => {
  const { metrics, array, geometryMode, timelineIndex } = useRaceStore();
  
  const baseMetric = metrics[algorithm] || { arr: array, active: [], comparisons: 0, swaps: 0, finished: false, time: 0, history: [], line: null };
  
  // Use historical state if scrubbing, otherwise live
  let metric = baseMetric;
  if (timelineIndex !== -1 && baseMetric.history && baseMetric.history.length > 0) {
    const safeIndex = Math.min(timelineIndex, baseMetric.history.length - 1);
    metric = { ...baseMetric, ...baseMetric.history[safeIndex] };
  }

  const bars = metric.arr || [];
  const codeLines = algorithmsMap[algorithm].code;

  const colors = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-400',
    'from-orange-500 to-yellow-400'
  ];
  const baseColor = colors[index % colors.length];

  return (
    <div className={`glass-panel flex flex-col rounded-xl overflow-hidden transition-all h-[500px] ${metric.finished ? 'border-2 border-green-400 shadow-[0_0_15px_#4ade80]' : 'border border-white/10'}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
        <h3 className="text-lg font-bold text-white">{algorithm}</h3>
        {metric.finished && <span className="text-xs font-bold text-green-400 bg-green-400/20 px-2 py-1 rounded shadow-[0_0_10px_#4ade80]">FINISHED</span>}
      </div>
      
      {/* Main Visualization Area */}
      <div className="flex-1 p-4 flex flex-col items-center justify-end gap-[2px] relative">
        {geometryMode === 'bars' && (
          <div className="w-full h-full flex items-end justify-center gap-[2px]">
            {bars.map((val, idx) => {
              let bgClass = `bg-gradient-to-t ${baseColor}`;
              if (metric.active.includes(idx)) {
                bgClass = 'bg-red-500 shadow-[0_0_10px_red]';
              } else if (metric.finished) {
                bgClass = 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]';
              }
              return (
                <div 
                  key={idx} 
                  className={`w-full rounded-t-sm transition-all duration-75 ${bgClass}`}
                  style={{ height: `${val}%` }}
                ></div>
              );
            })}
          </div>
        )}

        {geometryMode === 'scatter' && (
          <div className="w-full h-full relative">
            {bars.map((val, idx) => {
              const xPos = (idx / bars.length) * 100;
              const yPos = 100 - val;
              let bgClass = `bg-white`;
              let size = 6;
              if (metric.active.includes(idx)) {
                bgClass = 'bg-red-500 shadow-[0_0_10px_red] scale-150 z-10';
                size = 10;
              } else if (metric.finished) {
                bgClass = 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]';
              }
              return (
                <div 
                  key={idx} 
                  className={`absolute rounded-full transition-all duration-75 ${bgClass}`}
                  style={{ 
                    left: `${xPos}%`, 
                    top: `${yPos}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              );
            })}
          </div>
        )}
      </div>

      {/* Code Highlighting Panel */}
      <div className="h-40 bg-[#050505] border-t border-white/5 p-3 overflow-y-auto font-mono text-[10px] sm:text-xs">
        {codeLines.map((line, i) => (
          <div key={i} className={`px-2 py-1 rounded transition-colors ${metric.line === i ? 'bg-[#00f3ff]/20 text-[#00f3ff] font-bold border-l-2 border-[#00f3ff]' : 'text-gray-500'}`}>
            <span className="opacity-30 mr-2">{i+1}</span>
            {line}
          </div>
        ))}
      </div>

      {/* Mini Metrics */}
      <div className="flex justify-between p-3 bg-black/60 text-xs text-gray-400 font-mono border-t border-white/5">
        <div>Cmp: <span className="text-white">{metric.comparisons}</span></div>
        <div>Swp: <span className="text-white">{metric.swaps}</span></div>
        <div>Time: <span className="text-white">{metric.time}ms</span></div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
