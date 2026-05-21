import React, { useState, useEffect } from 'react';
import SortingVisualizer from '../visualizers/SortingVisualizer';
import { useRaceStore } from '../store/useRaceStore';

const Arena = () => {
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const { array, setArray, algorithms, setAlgorithms, raceStatus, startRace, resetRace } = useRaceStore();

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const generateArray = () => {
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5);
    setArray(newArr);
    resetRace();
  };

  const toggleAlgorithm = (algo) => {
    if (algorithms.includes(algo)) {
      setAlgorithms(algorithms.filter(a => a !== algo));
    } else {
      if (algorithms.length < 4) {
        setAlgorithms([...algorithms, algo]);
      }
    }
  };

  const handleStart = () => {
    if (algorithms.length > 0) {
      startRace();
    }
  };

  const availableAlgos = ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        
        {/* Controls Panel */}
        <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white mb-2">Race Configuration</h2>
          
          <div>
            <label className="text-gray-300 block mb-2">Input Size: {arraySize}</label>
            <input 
              type="range" min="10" max="200" value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="w-full accent-[#00f3ff]"
              disabled={raceStatus === 'running'}
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-2">Speed: {speed}ms</label>
            <input 
              type="range" min="1" max="1000" value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-[#9d00ff]"
              disabled={raceStatus === 'running'}
            />
          </div>

          <div>
            <h3 className="text-gray-300 mb-2">Select Algorithms (Max 4):</h3>
            <div className="flex flex-wrap gap-3">
              {availableAlgos.map(algo => (
                <button 
                  key={algo}
                  onClick={() => toggleAlgorithm(algo)}
                  disabled={raceStatus === 'running'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    algorithms.includes(algo) 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(0,243,255,0.5)]' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-auto pt-4 border-t border-white/10">
            <button 
              onClick={generateArray}
              disabled={raceStatus === 'running'}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              Generate New Array
            </button>
            <button 
              onClick={handleStart}
              disabled={raceStatus === 'running' || algorithms.length === 0}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f3ff] to-blue-500 text-black font-bold hover:scale-105 transition transform shadow-[0_0_15px_rgba(0,243,255,0.4)] disabled:opacity-50 disabled:scale-100"
            >
              {raceStatus === 'running' ? 'Racing...' : 'Start Race'}
            </button>
          </div>
        </div>

        {/* Live Metrics Panel */}
        <div className="glass-panel p-6 rounded-2xl w-full md:w-80">
          <h2 className="text-xl font-bold text-white mb-4">Live Metrics</h2>
          <div className="space-y-4">
            {algorithms.length === 0 && <p className="text-gray-500 italic">Select algorithms to see metrics</p>}
            {algorithms.map(algo => (
              <div key={algo} className="p-3 bg-black/40 rounded-lg border border-white/5">
                <h4 className="text-[#00f3ff] font-semibold">{algo}</h4>
                <div className="flex justify-between text-sm mt-2 text-gray-400">
                  <span>Comparisons:</span>
                  <span className="font-mono text-white">0</span>
                </div>
                <div className="flex justify-between text-sm mt-1 text-gray-400">
                  <span>Swaps:</span>
                  <span className="font-mono text-white">0</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Race Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {algorithms.map((algo, index) => (
          <SortingVisualizer key={algo} algorithm={algo} speed={speed} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Arena;
