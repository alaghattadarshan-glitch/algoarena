import React, { useState, useEffect, useRef } from 'react';
import { useDpStore } from '../store/useDpStore';
import DPVisualizer from '../visualizers/DPVisualizer';
import { lcsAlgorithm, knapsackAlgorithm } from '../algorithms/dpAlgorithms';
import { Play, RotateCcw, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

import InfoModal from './InfoModal';
import { Cpu, Globe2, Lightbulb } from 'lucide-react';

const DPArena = () => {
  const { speed, setSpeed, initGrid, updateCell, setActiveCell, setReferenceCells, setMatchCells, setStatus, status } = useDpStore();
  
  const [algo, setAlgo] = useState('lcs'); // 'lcs' or 'knapsack'
  
  // LCS state
  const [str1, setStr1] = useState('STONE');
  const [str2, setStr2] = useState('LONGEST');
  
  // Knapsack state
  const [weights, setWeights] = useState('1,3,4,5');
  const [values, setValues] = useState('1,4,5,7');
  const [capacity, setCapacity] = useState('7');

  const generatorRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize grids whenever inputs change (if idle)
  useEffect(() => {
    if (status !== 'idle') return;
    
    if (algo === 'lcs') {
      const s1 = str1.toUpperCase();
      const s2 = str2.toUpperCase();
      const rowHeaders = ['Ø', ...s1.split('')];
      const colHeaders = ['Ø', ...s2.split('')];
      initGrid(s1.length + 1, s2.length + 1, rowHeaders, colHeaders);
    } else {
      const w = weights.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      const v = values.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      const cap = parseInt(capacity);
      
      if (w.length === v.length && !isNaN(cap)) {
         const rowHeaders = ['0', ...w.map((weight, i) => `I${i+1}(w${weight},v${v[i]})`)];
         const colHeaders = Array.from({ length: cap + 1 }, (_, i) => `${i}`);
         initGrid(w.length + 1, cap + 1, rowHeaders, colHeaders);
      }
    }
  }, [algo, str1, str2, weights, values, capacity, status, initGrid]);

  const handleStart = () => {
    if (status === 'running') return;
    
    if (algo === 'lcs') {
      generatorRef.current = lcsAlgorithm(str1.toUpperCase(), str2.toUpperCase());
    } else {
      const w = weights.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      const v = values.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      const cap = parseInt(capacity);
      generatorRef.current = knapsackAlgorithm(w, v, cap);
    }
    
    setStatus('running');
    runStep();
  };

  const runStep = () => {
    if (!generatorRef.current) return;
    
    const { value, done } = generatorRef.current.next();
    
    if (done || value?.finished) {
      setStatus('finished');
      if (value?.grid) {
         // Final sync
         useDpStore.setState({ 
           grid: value.grid, 
           activeCell: null, 
           referenceCells: [], 
           matchCells: value.matchCells || [] 
         });
      }
      return;
    }
    
    if (value) {
      useDpStore.setState({
        grid: value.grid,
        activeCell: value.activeCell,
        referenceCells: value.referenceCells,
        matchCells: value.matchCells || []
      });
    }
    
    timeoutRef.current = setTimeout(runStep, 1000 - speed + 50);
  };

  const handleReset = () => {
    clearTimeout(timeoutRef.current);
    generatorRef.current = null;
    setStatus('idle');
  };

  const dpInfo = (
    <div className="flex flex-col gap-6">
      <div className="w-full rounded-2xl overflow-hidden border border-[#ffae00]/30 shadow-[0_0_30px_rgba(255,174,0,0.15)] relative">
        <img src="/algoarena/img/dp_flowchart.png" alt="Dynamic Programming Algorithm Diagram" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="bg-black/40 border border-[#ffae00]/20 p-5 rounded-xl">
        <h3 className="text-[#ffae00] font-bold text-lg mb-2 flex items-center gap-2"><Cpu className="w-5 h-5"/> Memoization Mechanics</h3>
        <p className="mb-3 text-gray-300">
          Dynamic Programming (DP) is a mathematical optimization method that breaks down complex problems into overlapping "sub-problems".
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li><strong>Memoization (The Matrix):</strong> Instead of recalculating the same sub-problems repeatedly, DP stores their answers in a 2D memory grid and builds the final solution bottom-up.</li>
          <li><strong>State Transitions:</strong> The highlighted cell (Orange) represents the current calculation. The "Reference" cells (Cyan) show you exactly which previously solved sub-problems are being used to compute the current answer!</li>
        </ul>
      </div>

      <div className="bg-black/40 border border-green-500/20 p-5 rounded-xl mt-6">
        <h3 className="text-green-400 font-bold text-lg mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5"/> Algorithmic Optimization</h3>
        <p className="mb-3 text-gray-300">
          DP takes impossible algorithms and makes them lightning fast.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li><strong>0/1 Knapsack Problem:</strong> A thief has a bag with a weight capacity. Given items with specific weights and values, what is the maximum value he can steal? Normally this takes exponential time $O(2^N)$ to check every combination. By using DP, we collapse that down to $O(N \times W)$!</li>
          <li><strong>Longest Common Subsequence:</strong> Finding the longest matching sequence of characters between two strings. Using DP, this is solved in $O(M \times N)$ by traversing the grid and inheriting diagonal matches.</li>
        </ul>
      </div>

      <div className="bg-black/40 border border-purple-500/20 p-5 rounded-xl mt-6">
        <h3 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2"><Globe2 className="w-5 h-5"/> Industry Applications</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li><strong>DNA Sequencing:</strong> Biologists use LCS algorithms to find similarities between DNA strands to determine genetic lineage.</li>
          <li><strong>Git / Version Control:</strong> When you run `git diff`, it uses an LCS algorithm to highlight exactly which lines of code changed between two commits!</li>
          <li><strong>Financial Trading:</strong> Portfolio optimization and maximizing return-on-investment within specific budget constraints uses exactly the same math as the 0/1 Knapsack problem.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <InfoModal title="The Science of DP Matrices" content={dpInfo} />
      
      {/* Header Info */}
      <div className="mb-8 relative z-10 pointer-events-none">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ffae00] uppercase tracking-widest mb-6 drop-shadow-[0_0_15px_rgba(255,174,0,0.3)] flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-[#ffae00]" />
          Dynamic Programming Matrix
        </h1>
      </div>

      {/* Control Panel */}
      <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,174,0,0.05)] relative overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          
          {/* Algorithm Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Algorithm</label>
            <select 
              value={algo}
              onChange={(e) => { setAlgo(e.target.value); handleReset(); }}
              disabled={status === 'running'}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffae00] transition disabled:opacity-50"
            >
              <option value="lcs">Longest Common Subsequence (LCS)</option>
              <option value="knapsack">0/1 Knapsack Problem</option>
            </select>
          </div>

          {/* Dynamic Inputs based on Algo */}
          {algo === 'lcs' ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">String 1 (Rows)</label>
                <input 
                  type="text" 
                  value={str1}
                  onChange={(e) => setStr1(e.target.value)}
                  disabled={status === 'running'}
                  maxLength={12}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffae00] transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">String 2 (Cols)</label>
                <input 
                  type="text" 
                  value={str2}
                  onChange={(e) => setStr2(e.target.value)}
                  disabled={status === 'running'}
                  maxLength={12}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffae00] transition"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Weights (comma sep)</label>
                <input 
                  type="text" 
                  value={weights}
                  onChange={(e) => setWeights(e.target.value)}
                  disabled={status === 'running'}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffae00] transition text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Values (comma sep)</label>
                <input 
                  type="text" 
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  disabled={status === 'running'}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffae00] transition text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Capacity</label>
                <input 
                  type="number" 
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  disabled={status === 'running'}
                  max={20}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffae00] transition"
                />
              </div>
            </>
          )}

        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-6 mt-8 relative z-10 p-4 bg-black/30 rounded-xl border border-white/5">
           <button
             onClick={handleStart}
             disabled={status === 'running'}
             className="flex items-center gap-2 bg-[#ffae00] hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,174,0,0.4)]"
           >
             <Play className="w-5 h-5" />
             {status === 'finished' ? 'Re-Run' : 'Compute Matrix'}
           </button>
           
           <button
             onClick={handleReset}
             className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold transition-colors"
           >
             <RotateCcw className="w-5 h-5" />
             Reset
           </button>

           <div className="flex-1 flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
              <span className="text-sm font-bold text-gray-400 whitespace-nowrap">Engine Speed</span>
              <input 
                type="range" 
                min="100" 
                max="1000" 
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-[#ffae00]"
              />
           </div>
        </div>

      </div>

      {/* Matrix Visualizer */}
      <DPVisualizer />

    </div>
  );
};

export default DPArena;
