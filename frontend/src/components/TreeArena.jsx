import React, { useEffect, useState } from 'react';
import { useTreeStore } from '../store/useTreeStore';
import TreeVisualizer from '../visualizers/TreeVisualizer';
import { insertBSTNode, inOrderTraversal, preOrderTraversal, postOrderTraversal } from '../algorithms/treeAlgorithms';

const TreeArena = () => {
  const { nodes, rootId, clearTree, speed, setSpeed, setTreeState, traversalOutput } = useTreeStore();
  const [inputValue, setInputValue] = useState('');

  const handleInsert = async (e) => {
    e.preventDefault();
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    
    const generator = insertBSTNode(useTreeStore.getState(), val);
    const runAnimation = async () => {
      let result = generator.next();
      while (!result.done) {
        await new Promise(resolve => setTimeout(resolve, 1000 - speed + 50));
        result = generator.next();
      }
    };
    runAnimation();
    setInputValue('');
  };

  const handleTraversal = async (type) => {
    let generator;
    if (type === 'inorder') generator = inOrderTraversal(useTreeStore.getState());
    else if (type === 'preorder') generator = preOrderTraversal(useTreeStore.getState());
    else if (type === 'postorder') generator = postOrderTraversal(useTreeStore.getState());
    
    if (!generator) return;
    
    const runAnimation = async () => {
      let result = generator.next();
      while (!result.done) {
        await new Promise(resolve => setTimeout(resolve, 1000 - speed + 50));
        result = generator.next();
      }
    };
    runAnimation();
  };

  const generateRandomTree = async () => {
    clearTree();
    const vals = [];
    for(let i=0; i<7; i++) {
      vals.push(Math.floor(Math.random() * 100));
    }
    for(let val of vals) {
       const generator = insertBSTNode(useTreeStore.getState(), val);
       while(!generator.next().done) {} 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      
      {/* Control Panel */}
      <div className="glass-panel p-6 rounded-2xl w-full mx-auto mb-8 border border-[#ff0080]/30 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#ff0080] animate-pulse"></span>
               Tree Operations
            </h3>
            <form onSubmit={handleInsert} className="flex gap-2">
               <input 
                 type="number" 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="Enter a number..."
                 className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#ff0080] transition-colors"
               />
               <button 
                 type="submit"
                 className="px-4 py-2 bg-[#ff0080] text-white font-bold rounded-lg hover:bg-pink-600 transition-colors shadow-[0_0_15px_rgba(255,0,128,0.4)]"
               >
                 Insert
               </button>
            </form>
          </div>

          <div className="flex flex-col gap-4 justify-center">
             <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Animation Speed</span>
              <span className="text-[#ff0080]">{speed}</span>
            </div>
            <input 
              type="range" min="100" max="1000" value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-[#ff0080] bg-gray-800 rounded-lg appearance-none h-1"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
             <button 
               onClick={generateRandomTree}
               className="w-full py-2 rounded border border-gray-600 text-gray-300 hover:bg-white/5 transition"
             >
               Random Tree (Instant)
             </button>
             <button 
               onClick={clearTree}
               className="w-full py-2 rounded bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/40 transition"
             >
               Clear Tree
             </button>
          </div>

        </div>

        {/* Traversal Controls */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Tree Sorting & Traversals</h3>
          <div className="flex flex-wrap gap-3">
             <button onClick={() => handleTraversal('inorder')} className="px-4 py-1.5 rounded-md text-sm font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-[#ff0080] transition-all">
               In-Order (Sorts Ascending)
             </button>
             <button onClick={() => handleTraversal('preorder')} className="px-4 py-1.5 rounded-md text-sm font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-[#ff0080] transition-all">
               Pre-Order
             </button>
             <button onClick={() => handleTraversal('postorder')} className="px-4 py-1.5 rounded-md text-sm font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-[#ff0080] transition-all">
               Post-Order
             </button>
          </div>
        </div>
      </div>

      {/* Traversal Output Bar */}
      {traversalOutput.length > 0 && (
        <div className="mb-6 bg-[#050505] border border-white/10 rounded-xl p-4 flex items-center gap-4 overflow-x-auto">
          <span className="text-[#ff0080] font-black uppercase text-sm whitespace-nowrap">Traversal Output:</span>
          <div className="flex gap-2">
            {traversalOutput.map((val, i) => (
              <span key={i} className="w-10 h-10 flex items-center justify-center bg-black border border-[#ff0080]/50 rounded-lg text-white font-mono font-bold shadow-[0_0_10px_rgba(255,0,128,0.2)]">
                {val}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visualizer Canvas */}
      <div className="bg-[#050505] rounded-2xl border border-white/10 w-full h-[600px] relative overflow-hidden flex items-center justify-center mb-12">
         {nodes.length === 0 ? (
           <span className="text-gray-500 font-mono">Tree is empty. Insert a node to begin.</span>
         ) : (
           <TreeVisualizer />
         )}
      </div>

    </div>
  );
};

export default TreeArena;
