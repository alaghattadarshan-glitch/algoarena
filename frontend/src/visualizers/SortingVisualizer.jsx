import React, { useState } from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { algorithmsMap } from '../algorithms/sorting';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const evaluateComplexity = (notation, n) => {
  const cleanNotation = notation.toLowerCase().replace(/\s/g, '');
  if (cleanNotation.includes('o(1)')) return 1;
  if (cleanNotation.includes('o(logn)')) return Math.log2(n);
  if (cleanNotation.includes('o(nlogn)')) return n * Math.log2(n);
  if (cleanNotation.includes('o(n2)') || cleanNotation.includes('o(n^2)')) return n * n;
  if (cleanNotation.includes('o(n)')) return n;
  if (cleanNotation.includes('o(nk)')) return n * 1.2; // Radix Sort scale
  if (cleanNotation.includes('o(n*n!)') || cleanNotation.includes('o(∞)')) return n * n * 2.5; // Bogo Sort scale
  return n;
};

const getComplexityChartData = (complexity) => {
  const data = [];
  for (let n = 2; n <= 8; n++) {
    data.push({
      name: `N=${n}`,
      'Best Case': evaluateComplexity(complexity.best, n),
      'Avg Case': evaluateComplexity(complexity.avg, n),
      'Worst Case': evaluateComplexity(complexity.worst, n),
      'Space': evaluateComplexity(complexity.space, n)
    });
  }
  return data;
};

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
  
  const [tiltStyle, setTiltStyle] = useState({});
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'chart'

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rX = -(y / (box.height / 2)) * 7;
    const rY = (x / (box.width / 2)) * 7;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: 'none',
      zIndex: 20
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out',
      zIndex: 1
    });
  };

  const metric = metrics[algorithm] || { comparisons: 0, swaps: 0, time: 0, array: array };
  const bars = metric.arr || [];
  const codeLines = algorithmsMap[algorithm].code;
  const complexity = algorithmsMap[algorithm].complexity || { best: 'N/A', avg: 'N/A', worst: 'N/A', space: 'N/A' };

  const colors = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-400',
    'from-orange-500 to-yellow-400'
  ];
  const baseColor = colors[index % colors.length];

  const maxVal = Math.max(...bars, 1);

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`glass-panel flex flex-col rounded-xl overflow-hidden transition-all h-[540px] ${metric.finished ? 'border-2 border-green-400 shadow-[0_0_15px_#4ade80]' : 'border border-white/10'}`}
    >
      
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

          {geometryMode === '3d-bars' && (
            <div 
              className="w-full h-full flex items-end justify-center gap-[6px] overflow-visible" 
              style={{ 
                perspective: '1000px', 
                transformStyle: 'preserve-3d', 
                paddingBottom: '30px'
              }}
            >
              <div 
                className="flex items-end justify-center w-full h-[90%] transition-transform duration-500" 
                style={{ 
                  transform: 'rotateX(22deg) rotateY(-15deg)', 
                  transformStyle: 'preserve-3d' 
                }}
              >
                {bars.map((val, idx) => {
                  let colorClass = baseColor;
                  let glowClass = '';
                  if (metric.active.includes(idx)) {
                    colorClass = 'from-red-600 to-red-500';
                    glowClass = 'shadow-[0_0_15px_red]';
                  } else if (metric.finished) {
                    colorClass = 'from-[#00ff88] to-emerald-500';
                    glowClass = 'shadow-[0_0_15px_#00ff88]';
                  }
                  
                  const barHeight = (val / maxVal) * 100;
                  const barWidth = Math.max(4, Math.min(24, 250 / bars.length));
                  const halfWidth = barWidth / 2;

                  return (
                    <div 
                      key={idx}
                      className="relative transition-all duration-75"
                      style={{ 
                        height: `${barHeight}%`, 
                        width: `${barWidth}px`, 
                        transformStyle: 'preserve-3d' 
                      }}
                    >
                      {/* Front Face */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-t ${colorClass} border border-white/20 rounded-sm ${glowClass}`} 
                        style={{ transform: `translateZ(${halfWidth}px)` }} 
                      />
                      {/* Back Face */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-t ${colorClass} brightness-50`} 
                        style={{ transform: `rotateY(180deg) translateZ(${halfWidth}px)` }} 
                      />
                      {/* Left Face */}
                      <div 
                        className={`absolute inset-y-0 bg-gradient-to-t ${colorClass} brightness-75`} 
                        style={{ 
                          width: `${barWidth}px`, 
                          left: 0, 
                          transform: `rotateY(-90deg) translateZ(${halfWidth}px)` 
                        }} 
                      />
                      {/* Right Face */}
                      <div 
                        className={`absolute inset-y-0 bg-gradient-to-t ${colorClass} brightness-75`} 
                        style={{ 
                          width: `${barWidth}px`, 
                          right: 0, 
                          transform: `rotateY(90deg) translateZ(${halfWidth}px)` 
                        }} 
                      />
                      {/* Top Face */}
                      <div 
                        className="absolute bg-white/30" 
                        style={{ 
                          height: `${barWidth}px`, 
                          width: `${barWidth}px`, 
                          top: 0, 
                          transform: `rotateX(90deg) translateZ(${halfWidth}px)` 
                        }} 
                      />
                    </div>
                  );
                })}
              </div>
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
            <div 
              className="w-full h-full flex flex-wrap content-center justify-center gap-1.5 overflow-y-auto px-2"
              style={{ perspective: '800px' }}
            >
              {bars.map((val, idx) => {
                const isActive = metric.active.includes(idx);
                const isFinished = metric.finished;

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
                    className={`relative transition-transform duration-300 ${cardSize}`}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: isActive ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {/* Front Face (Default) */}
                    <div 
                      className={`absolute inset-0 flex items-center justify-center font-black border-2 backdrop-blur-md rounded-md transition-all ${
                        isFinished 
                          ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                          : 'border-white/20 text-white bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                      }`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {val}
                    </div>
                    {/* Back Face (Active/Flipped state) */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center font-black border-2 border-orange-500 text-orange-400 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.6)] rounded-md"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)' 
                      }}
                    >
                      {val}
                    </div>
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

      {/* Tab Selector Buttons */}
      <div className="flex justify-between items-center bg-black/50 border-t border-white/10 px-3 py-1.5 text-xs">
        <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Reference Info</span>
        <div className="flex gap-1.5">
          <button 
            onClick={() => setActiveTab('code')}
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition ${activeTab === 'code' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            Pseudocode
          </button>
          <button 
            onClick={() => setActiveTab('chart')}
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition ${activeTab === 'chart' ? 'bg-[#00f3ff] text-black shadow-[0_0_8px_#00f3ff]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            Complexity Graph
          </button>
        </div>
      </div>

      {/* Complexity Metadata Info Bar */}
      <div className="grid grid-cols-4 gap-1 bg-black/40 border-t border-white/10 py-2 px-3 text-[9px] sm:text-[10px] font-mono text-gray-400 text-center">
        <div className="truncate">Best: <span className="text-[#00f3ff] font-bold">{complexity.best}</span></div>
        <div className="truncate">Avg: <span className="text-[#ffae00] font-bold">{complexity.avg}</span></div>
        <div className="truncate">Worst: <span className="text-[#ff0055] font-bold">{complexity.worst}</span></div>
        <div className="truncate">Space: <span className="text-[#10b981] font-bold">{complexity.space}</span></div>
      </div>

      {/* Dynamic Tab Content (Pseudocode or Line Chart) */}
      <div className="h-44 bg-[#0a0a0a] border-t border-white/10 p-3 overflow-y-auto flex items-center justify-center">
        {activeTab === 'code' ? (
          <div className="font-mono text-[10px] sm:text-xs w-full">
            {codeLines.map((line, i) => (
              <div key={i} className={`px-2 py-1 rounded transition-colors ${metric.line === i ? 'bg-[#00f3ff]/20 text-[#00f3ff] font-bold border-l-2 border-[#00f3ff]' : 'text-gray-400'}`}>
                <span className="opacity-30 mr-2">{i+1}</span>
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getComplexityChartData(complexity)} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#888" style={{ fontSize: 8 }} />
                <YAxis stroke="#888" style={{ fontSize: 8 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222', fontSize: 9 }}
                  itemStyle={{ padding: 0 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 8 }} />
                <Line type="monotone" dataKey="Best Case" stroke="#00f3ff" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Avg Case" stroke="#ffae00" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Worst Case" stroke="#ff0055" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Space" stroke="#10b981" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
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
