import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useRaceStore } from '../store/useRaceStore';

const ComparisonCharts = () => {
  const { algorithms, metrics } = useRaceStore();

  if (algorithms.length === 0) return null;

  const data = algorithms.map(algo => ({
    name: algo,
    Comparisons: metrics[algo]?.comparisons || 0,
    Swaps: metrics[algo]?.swaps || 0,
    Time: metrics[algo]?.time || 0
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Operations Chart */}
      <div className="glass-panel p-6 rounded-2xl h-80">
        <h3 className="text-xl font-bold text-white mb-4">Operations Comparison</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
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
      <div className="glass-panel p-6 rounded-2xl h-80">
        <h3 className="text-xl font-bold text-white mb-4">Execution Time (ms)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
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
  );
};

export default ComparisonCharts;
