import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { useRaceStore } from '../store/useRaceStore';

// Sorting techniques metadata
const techniques = [
  {
    name: 'Bubble Sort',
    color: '#00f3ff', // neon blue
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)'
  },
  {
    name: 'Selection Sort',
    color: '#ffae00', // neon yellow/orange
    best: 'O(n²)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)'
  },
  {
    name: 'Insertion Sort',
    color: '#10b981', // green
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)'
  },
  {
    name: 'Quick Sort',
    color: '#9d00ff', // neon purple
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)'
  }
];

// Helper to calculate complexity growth function values
const evaluateComplexity = (notation, n) => {
  switch (notation) {
    case 'O(1)':
      return 1;
    case 'O(log n)':
      return Math.log2(n);
    case 'O(n)':
      return n;
    case 'O(n log n)':
      return n * Math.log2(n);
    case 'O(n²)':
      return n * n;
    default:
      return n;
  }
};

// Generate points for the complexity curves (N=2 to N=16)
const generateComplexityData = () => {
  const data = [];
  for (let n = 2; n <= 16; n++) {
    const point = { name: `N=${n}` };
    techniques.forEach(tech => {
      point[`${tech.name}_best`] = evaluateComplexity(tech.best, n);
      point[`${tech.name}_avg`] = evaluateComplexity(tech.avg, n);
      point[`${tech.name}_worst`] = evaluateComplexity(tech.worst, n);
      point[`${tech.name}_space`] = evaluateComplexity(tech.space, n);
    });
    data.push(point);
  }
  return data;
};

const complexityData = generateComplexityData();

const CustomComplexityTooltip = ({ active, payload, label, caseKey }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0f] border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-400 font-bold mb-2">{label}</p>
        {payload.map((item, idx) => {
          const name = item.name.split('_')[0];
          const tech = techniques.find(t => t.name === name);
          const notation = tech ? tech[caseKey] : '';
          return (
            <p key={idx} style={{ color: item.color }} className="text-xs font-mono">
              {name}: <span className="font-bold">{notation}</span> ({Number(item.value).toFixed(1)} ops)
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

const ComparisonCharts = () => {
  const { algorithms, metrics } = useRaceStore();

  const hasLiveMetrics = algorithms.length > 0;
  const liveData = algorithms.map(algo => ({
    name: algo,
    Comparisons: metrics[algo]?.comparisons || 0,
    Swaps: metrics[algo]?.swaps || 0,
    Time: metrics[algo]?.time || 0
  }));

  return (
    <div className="mt-12 space-y-12">
      
      {/* Live Run Statistics */}
      {hasLiveMetrics && (
        <div>
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-3">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            Live Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Operations Chart */}
            <div className="glass-panel p-6 rounded-2xl h-80 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Operations Comparison</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff'}} 
                  />
                  <Legend />
                  <Bar dataKey="Comparisons" fill="#00f3ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Swaps" fill="#9d00ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Execution Time Chart */}
            <div className="glass-panel p-6 rounded-2xl h-80 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Execution Time (ms)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff'}} 
                  />
                  <Bar dataKey="Time" fill="#ff00a0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Theoretical Asymptotic Complexity */}
      <div>
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wider flex items-center gap-3">
          <span className="w-3 h-3 bg-[#9d00ff] rounded-full shadow-[0_0_10px_#9d00ff]"></span>
          Theoretical Complexity Analysis
        </h2>
        <p className="text-xs text-gray-500 mb-6 tracking-wide">COMPARES ASYMPTOTIC GROWTH RATE SCALING FOR KEY ALGORITHMS</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Best Case Time Complexity */}
          <div className="glass-panel p-6 rounded-2xl h-80 border border-white/10">
            <h3 className="text-lg font-bold text-[#00f3ff] mb-4">Best Case Time Complexity</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complexityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: 10 }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: 10 }} />
                <Tooltip content={<CustomComplexityTooltip caseKey="best" />} />
                <Legend iconType="circle" />
                {techniques.map(tech => (
                  <Line 
                    key={tech.name}
                    type="monotone"
                    dataKey={`${tech.name}_best`}
                    name={tech.name}
                    stroke={tech.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Average Case Time Complexity */}
          <div className="glass-panel p-6 rounded-2xl h-80 border border-white/10">
            <h3 className="text-lg font-bold text-[#ffae00] mb-4">Average Case Time Complexity</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complexityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: 10 }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: 10 }} />
                <Tooltip content={<CustomComplexityTooltip caseKey="avg" />} />
                <Legend iconType="circle" />
                {techniques.map(tech => (
                  <Line 
                    key={tech.name}
                    type="monotone"
                    dataKey={`${tech.name}_avg`}
                    name={tech.name}
                    stroke={tech.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Worst Case Time Complexity */}
          <div className="glass-panel p-6 rounded-2xl h-80 border border-white/10">
            <h3 className="text-lg font-bold text-[#ff0055] mb-4">Worst Case Time Complexity</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complexityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: 10 }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: 10 }} />
                <Tooltip content={<CustomComplexityTooltip caseKey="worst" />} />
                <Legend iconType="circle" />
                {techniques.map(tech => (
                  <Line 
                    key={tech.name}
                    type="monotone"
                    dataKey={`${tech.name}_worst`}
                    name={tech.name}
                    stroke={tech.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Space Complexity */}
          <div className="glass-panel p-6 rounded-2xl h-80 border border-white/10">
            <h3 className="text-lg font-bold text-[#10b981] mb-4">Space Complexity</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complexityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: 10 }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: 10 }} />
                <Tooltip content={<CustomComplexityTooltip caseKey="space" />} />
                <Legend iconType="circle" />
                {techniques.map(tech => (
                  <Line 
                    key={tech.name}
                    type="monotone"
                    dataKey={`${tech.name}_space`}
                    name={tech.name}
                    stroke={tech.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ComparisonCharts;
