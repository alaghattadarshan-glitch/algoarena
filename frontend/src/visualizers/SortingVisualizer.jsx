import React, { useState } from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { algorithmsMap } from '../algorithms/sorting';
import { LineChart, Line, ResponsiveContainer, ReferenceDot } from 'recharts';

const generateCurveData = (curve, currentSize) => {
  const data = [];
  const max = Math.max(100, currentSize * 1.5);
  const step = Math.ceil(max / 20);
  for (let i = 10; i <= max; i += step) {
    let val;
    if (curve === 'quadratic') val = i * i;
    else if (curve === 'loglinear') val = i * Math.log2(i);
    else val = i; // linear
    data.push({ x: i, y: val });
  }
  return data;
};

const getComplexityColor = (complexity) => {
  if (complexity.includes('n²')) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
  if (complexity.includes('n log n')) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]';
  if (complexity.includes('1') || complexity.includes('log n')) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
  return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]';
};

const SortingVisualizer = ({ algorithm, index }) => {
  const { metrics, array, geometryMode, timelineIndex, arraySize } = useRaceStore();
  const [activeTab, setActiveTab] = useState('code');
  
  const metric = metrics[algorithm] || { comparisons: 0, swaps: 0, time: 0, array: array };
  const complexity = algorithmsMap[algorithm].complexity || {};
  const code = algorithmsMap[algorithm].code || [];
  
  const curveData = generateCurveData(complexity.curve || 'linear', arraySize);
  let currentY = arraySize;
  if (complexity.curve === 'quadratic') currentY = arraySize * arraySize;
  if (complexity.curve === 'loglinear') currentY = arraySize * Math.log2(arraySize);

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
    <div className={`glass-panel flex flex-col rounded-xl overflow-hidden transition-all h-[540px] ${metric.finished ? 'border-2 border-green-400 shadow-[0_0_15px_#4ade80]' : 'border border-white/10'}`}>
      
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

      {/* Tabs Header */}
      <div className="flex bg-[#050505] border-t border-white/10">
        <button 
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'code' ? 'bg-[#00f3ff]/10 text-[#00f3ff] border-b-2 border-[#00f3ff]' : 'text-gray-500 hover:bg-white/5'}`}
        >
          Live Code
        </button>
        <button 
          onClick={() => setActiveTab('complexity')}
          className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'complexity' ? 'bg-[#9d00ff]/10 text-[#9d00ff] border-b-2 border-[#9d00ff]' : 'text-gray-500 hover:bg-white/5'}`}
        >
          Complexity
        </button>
      </div>

      {/* Dynamic Panel */}
      <div className="h-44 bg-[#0a0a0a] border-t border-white/5 p-3 overflow-y-auto">
        {activeTab === 'code' ? (
          <div className="font-mono text-[10px] sm:text-xs">
            {codeLines.map((line, i) => (
              <div key={i} className={`px-2 py-1 rounded transition-colors ${metric.line === i ? 'bg-[#00f3ff]/20 text-[#00f3ff] font-bold border-l-2 border-[#00f3ff]' : 'text-gray-400'}`}>
                <span className="opacity-30 mr-2">{i+1}</span>
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 text-[10px] font-mono flex gap-4 h-full relative">
            
            {/* Tooltip Layer */}
            <div className="absolute -top-10 left-0 right-0 p-2 bg-black/90 border border-[#9d00ff]/50 rounded text-white text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-[0_0_15px_rgba(157,0,255,0.3)]">
              {complexity.tooltip}
            </div>
            
            <div className="flex flex-col justify-center gap-2 w-1/3 border-r border-white/5 pr-4 group cursor-help relative">
              <div className="flex justify-between items-center group/item relative">
                <span className="text-gray-500">Best:</span> 
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getComplexityColor(complexity.best)}`}></span>
                  <span className="text-[#00ff88]">{complexity.best}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Avg:</span> 
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getComplexityColor(complexity.avg)}`}></span>
                  <span className="text-yellow-400">{complexity.avg}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Worst:</span> 
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getComplexityColor(complexity.worst)}`}></span>
                  <span className="text-[#ff003c]">{complexity.worst}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-1 mt-1">
                <span className="text-gray-500">Space:</span> 
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getComplexityColor(complexity.space)}`}></span>
                  <span className="text-[#00f3ff]">{complexity.space}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-2/3">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 text-center block relative group">
                Asymptotic Growth (Live Dot: N={arraySize})
              </span>
              <div className="flex-1 bg-black/40 rounded-lg p-2 border border-white/5 w-full min-h-[100px] relative">
                <div className="absolute inset-0 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={curveData}>
                      <Line type="monotone" dataKey="y" stroke="#9d00ff" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <ReferenceDot x={arraySize} y={currentY} r={4} fill="#00ff88" stroke="#fff" strokeWidth={1} isFront={true} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
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
