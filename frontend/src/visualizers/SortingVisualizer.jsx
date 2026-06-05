import React from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { algorithmsMap } from '../algorithms/sorting';

const getActionDescription = (metric, bars) => {
  if (metric.finished) {
    return "✅ Array Sorted Successfully!";
  }
  if (!metric.active || metric.active.length === 0) {
    return "⚡ Ready / Idle";
  }
  
  const indices = metric.active;
  const safeBars = bars || [];
  if (indices.length === 2) {
    const val1 = safeBars[indices[0]] !== undefined ? safeBars[indices[0]] : '?';
    const val2 = safeBars[indices[1]] !== undefined ? safeBars[indices[1]] : '?';
    if (metric.swappedValue !== undefined) {
      return `SWAP a[${indices[0]}] ↔ a[${indices[1]}] (values: ${val1} ↔ ${val2})`;
    }
    return `COMPARE a[${indices[0]}] & a[${indices[1]}] (values: ${val1} vs ${val2})`;
  }
  
  if (indices.length === 1) {
    const val = safeBars[indices[0]] !== undefined ? safeBars[indices[0]] : '?';
    return `ACTIVE a[${indices[0]}] (value: ${val})`;
  }
  
  return "⚡ Processing...";
};

const SortingVisualizer = ({ algorithm, index }) => {
  const { metrics, array, geometryMode } = useRaceStore();
  
  const metric = metrics[algorithm] || { comparisons: 0, swaps: 0, time: 0, array: array };
  const bars = metric.arr || [];
  const codeLines = algorithmsMap[algorithm].code;

  const colors = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-400',
    'from-orange-500 to-yellow-400'
  ];
  const baseColor = colors[index % colors.length];

  const maxVal = Math.max(...bars, 1);

  return (
    <div className={`glass-panel flex flex-col rounded-xl overflow-hidden transition-all h-[540px] ${metric.finished ? 'border-2 border-green-400 shadow-[0_0_15px_#4ade80]' : 'border border-white/10'}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
        <h3 className="text-lg font-bold text-white">{algorithm}</h3>
        {metric.finished && <span className="text-xs font-bold text-green-400 bg-green-400/20 px-2 py-1 rounded shadow-[0_0_10px_#4ade80]">FINISHED</span>}
      </div>
      
      {/* Main Visualization Area */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center relative min-h-[200px]">
        <div className="flex-1 w-full flex items-center justify-center min-h-[160px]">
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
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  ></div>
                );
              })}
            </div>
          )}

          {geometryMode === 'scatter' && (
            <div className="w-full h-full relative">
              {bars.map((val, idx) => {
                const xPos = (idx / bars.length) * 100;
                const yPos = 100 - (val / maxVal) * 90 - 5;
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

          {geometryMode === 'cards' && (
            <div className="w-full h-full flex flex-wrap content-center justify-center gap-1.5 overflow-y-auto px-2">
              {bars.map((val, idx) => {
                let borderClass = 'border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]';
                let bgClass = 'bg-white/5';
                let scaleClass = 'scale-100';

                if (metric.active.includes(idx)) {
                  borderClass = 'border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.6)]';
                  bgClass = 'bg-orange-500/10';
                  scaleClass = 'scale-110';
                } else if (metric.finished) {
                  borderClass = 'border-[#00ff88] text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.4)]';
                  bgClass = 'bg-[#00ff88]/10';
                }

                let cardSize = 'w-12 h-12 text-sm';
                if (bars.length > 20) {
                  cardSize = 'w-7 h-7 text-[10px] rounded-md';
                } else if (bars.length > 12) {
                  cardSize = 'w-9 h-9 text-xs rounded-md';
                } else {
                  cardSize = 'w-14 h-14 text-base rounded-lg';
                }

                return (
                  <div 
                    key={idx}
                    className={`flex items-center justify-center font-black border-2 backdrop-blur-md transition-all duration-150 ${borderClass} ${bgClass} ${scaleClass} ${cardSize}`}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Real-time Operation Description */}
        <div className="w-full text-center mt-3 pt-2 border-t border-white/5 min-h-[28px] flex items-center justify-center">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400">
            {getActionDescription(metric, bars)}
          </span>
        </div>
      </div>

      {/* Live Code Panel */}
      <div className="h-44 bg-[#0a0a0a] border-t border-white/10 p-3 overflow-y-auto">
        <div className="font-mono text-[10px] sm:text-xs">
          {codeLines.map((line, i) => (
            <div key={i} className={`px-2 py-1 rounded transition-colors ${metric.line === i ? 'bg-[#00f3ff]/20 text-[#00f3ff] font-bold border-l-2 border-[#00f3ff]' : 'text-gray-400'}`}>
              <span className="opacity-30 mr-2">{i+1}</span>
              {line}
            </div>
          ))}
        </div>
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
