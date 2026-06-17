import React, { useEffect } from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { motion } from 'framer-motion';

const ControlPanel = () => {
  const { 
    arraySize, setArraySize, 
    speed, setSpeed, 
    algorithms, toggleAlgorithm, 
    setArray, setArrayType, raceStatus, startRace, pauseRace, resumeRace,
    soundEnabled, setSoundEnabled,
    geometryMode, setGeometryMode,
    timelineIndex, setTimelineIndex, maxTimelineLength,
    debugMode, setDebugMode, triggerNextStep,
    arrayType, customInput, setCustomInput
  } = useRaceStore();

  const availableAlgos = ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Quick Sort'];

  const generateArray = (type = 'random', customVal = customInput) => {
    let newArr = [];
    if (type === 'custom') {
      const numbers = customVal
        .split(/[\s,]+/)
        .map(x => parseInt(x.trim(), 10))
        .filter(x => !isNaN(x));
      if (numbers.length === 0) {
        newArr = [10, 6, 7, 2, 3, 5, 9, 4, 1, 8];
      } else {
        newArr = numbers;
      }
      setArrayType('custom');
      setArraySize(newArr.length);
      setArray(newArr);
    } else {
      if (type === 'random') {
        newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5);
      } else if (type === 'sorted') {
        newArr = Array.from({ length: arraySize }, (_, i) => Math.floor((i/arraySize)*100) + 5);
      } else if (type === 'reverse') {
        newArr = Array.from({ length: arraySize }, (_, i) => Math.floor(((arraySize-i)/arraySize)*100) + 5);
      }
      setArrayType(type);
      setArray(newArr);
    }
  };

  useEffect(() => {
    if (arrayType !== 'custom') {
      generateArray(arrayType);
    }
  }, [arraySize]);

  return (
    <div className="glass-panel p-6 rounded-2xl w-full max-w-7xl mx-auto mb-8 border border-white/10 z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Settings */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></span>
             Parameters
          </h3>
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Input Size {arrayType === 'custom' && '(Custom)'}</span>
              <span className="text-[#00f3ff]">{arraySize}</span>
            </div>
            <input 
              type="range" min="5" max="1000" value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="w-full accent-[#00f3ff] bg-gray-800 rounded-lg appearance-none h-1"
              disabled={raceStatus !== 'idle' || arrayType === 'custom'}
            />
          </div>
          <div>
             <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Speed (Steps/sec)</span>
              <span className="text-[#9d00ff]">{speed}</span>
            </div>
            <input 
              type="range" min="10" max="1000" value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={debugMode}
              className={`w-full accent-[#9d00ff] rounded-lg appearance-none h-1 ${debugMode ? 'bg-gray-900 opacity-50' : 'bg-gray-800'}`}
            />
          </div>
        </div>

        {/* Competitors & Advanced */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Competitors</h3>
            <div className="flex flex-wrap gap-2">
              {availableAlgos.map(algo => {
                const isSelected = algorithms.includes(algo);
                return (
                  <button 
                    key={algo}
                    onClick={() => toggleAlgorithm(algo)}
                    disabled={raceStatus !== 'idle'}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      isSelected 
                      ? 'bg-gradient-to-r from-blue-600 to-[#00f3ff]/80 text-white shadow-[0_0_10px_rgba(0,243,255,0.4)] border border-transparent' 
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {algo}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Geometry</h3>
              <div className="flex flex-wrap gap-1.5">
                {['bars', '3d-bars', 'scatter', 'cards'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setGeometryMode(mode)}
                    className={`flex-1 min-w-[52px] py-1 rounded text-[10px] capitalize transition-all ${geometryMode === mode ? 'bg-purple-600 text-white font-bold shadow-[0_0_8px_rgba(147,51,234,0.5)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {mode === '3d-bars' ? '3D Bars' : mode}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Audio Feedback</h3>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-full py-1 rounded text-xs flex items-center justify-center gap-2 mb-2 ${soundEnabled ? 'bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
              >
                {soundEnabled ? '🔊 Sound ON' : '🔈 Sound OFF'}
              </button>
              <button 
                onClick={() => setDebugMode(!debugMode)}
                disabled={raceStatus !== 'idle'}
                className={`w-full py-1 rounded text-xs flex items-center justify-center gap-2 ${debugMode ? 'bg-red-500/20 text-red-500 border border-red-500' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
              >
                {debugMode ? '🐞 Debug ON' : '🐞 Debug OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 justify-end">
          <div className="flex gap-1 mb-1">
            <button 
              onClick={() => generateArray('random')} 
              disabled={raceStatus !== 'idle'} 
              className={`flex-1 text-[10px] py-1.5 rounded border transition-all ${arrayType === 'random' ? 'bg-blue-600/30 text-blue-400 border-blue-500 font-bold' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'}`}
            >
              Random
            </button>
            <button 
              onClick={() => generateArray('sorted')} 
              disabled={raceStatus !== 'idle'} 
              className={`flex-1 text-[10px] py-1.5 rounded border transition-all ${arrayType === 'sorted' ? 'bg-blue-600/30 text-blue-400 border-blue-500 font-bold' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'}`}
            >
              Sorted
            </button>
            <button 
              onClick={() => generateArray('reverse')} 
              disabled={raceStatus !== 'idle'} 
              className={`flex-1 text-[10px] py-1.5 rounded border transition-all ${arrayType === 'reverse' ? 'bg-blue-600/30 text-blue-400 border-blue-500 font-bold' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'}`}
            >
              Reverse
            </button>
            <button 
              onClick={() => generateArray('custom')} 
              disabled={raceStatus !== 'idle'} 
              className={`flex-1 text-[10px] py-1.5 rounded border transition-all ${arrayType === 'custom' ? 'bg-[#00f3ff]/20 text-[#00f3ff] border-[#00f3ff] font-bold shadow-[0_0_8px_rgba(0,243,255,0.3)]' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'}`}
            >
              Custom
            </button>
          </div>
          {arrayType === 'custom' && (
            <div className="flex flex-col gap-1.5 mb-1 text-left">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Custom Values (comma or space separated)</span>
              <input 
                type="text" 
                placeholder="e.g. 10, 6, 7, 2, 3, 5, 9, 4, 1, 8" 
                value={customInput}
                disabled={raceStatus !== 'idle'}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  generateArray('custom', e.target.value);
                }}
                className="w-full px-3 py-1.5 text-xs bg-black/60 border border-white/10 rounded-lg text-[#00f3ff] placeholder-gray-600 focus:outline-none focus:border-[#00f3ff] transition-all font-mono shadow-inner"
              />
            </div>
          )}
          
          {raceStatus === 'idle' && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startRace}
              disabled={algorithms.length === 0}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#00f3ff] to-[#9d00ff] text-white font-black tracking-widest uppercase shadow-[0_0_20px_rgba(157,0,255,0.5)] disabled:opacity-50"
            >
              Start Race
            </motion.button>
          )}

          {raceStatus === 'running' && (
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={pauseRace}
                className="flex-1 py-2.5 rounded-lg bg-yellow-500/20 border border-yellow-500 text-yellow-500 font-black tracking-widest uppercase shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              >
                Pause Race
              </motion.button>
              {debugMode && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={triggerNextStep}
                  className="flex-1 py-2.5 rounded-lg bg-red-500/20 border border-red-500 text-red-500 font-black tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Step ▶
                </motion.button>
              )}
            </div>
          )}

          {raceStatus === 'paused' && (
            <div className="flex gap-2">
               <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={resumeRace}
                className="flex-1 py-2.5 rounded-lg bg-green-500/20 border border-green-500 text-green-500 font-bold uppercase text-sm"
              >
                Resume
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => generateArray('random')}
                className="flex-1 py-2.5 rounded-lg bg-red-500/20 border border-red-500 text-red-500 font-bold uppercase text-sm"
              >
                Reset
              </motion.button>
            </div>
          )}

          {raceStatus === 'finished' && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={() => generateArray('random')}
              className="w-full py-2.5 rounded-lg bg-white text-black font-black tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            >
              Reset Arena
            </motion.button>
          )}
        </div>
      </div>

      {/* Timeline Scrubber */}
      {(raceStatus === 'finished' || raceStatus === 'paused') && maxTimelineLength > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
             <span>Historical Timeline Replay (Latest {maxTimelineLength} steps)</span>
             <span className="text-[#00f3ff]">{timelineIndex === -1 ? 'LIVE' : `Step ${timelineIndex}`}</span>
          </div>
          <input 
             type="range" min="0" max={maxTimelineLength - 1} 
             value={timelineIndex === -1 ? maxTimelineLength - 1 : timelineIndex}
             onChange={(e) => setTimelineIndex(Number(e.target.value))}
             className="w-full accent-green-400 bg-gray-800 rounded-lg appearance-none h-2"
          />
        </div>
      )}

    </div>
  );
};

export default ControlPanel;
