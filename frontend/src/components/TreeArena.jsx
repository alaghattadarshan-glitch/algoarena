import React, { useState } from 'react';
import { useTreeStore } from '../store/useTreeStore';
import TreeVisualizer from '../visualizers/TreeVisualizer';
import { insertBSTNode, inOrderTraversal, preOrderTraversal, postOrderTraversal } from '../algorithms/treeAlgorithms';

import InfoModal from './InfoModal';
import { Cpu, Globe2, Lightbulb } from 'lucide-react';

const TreeArena = () => {
  const { nodes, clearTree, speed, setSpeed, traversalOutput } = useTreeStore();
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
       // eslint-disable-next-line no-empty
       while(!generator.next().done) {} 
    }
  };

  const treeInfo = (
    <div className="flex flex-col gap-6">
      <div className="w-full rounded-2xl overflow-hidden border border-[#ff0080]/30 shadow-[0_0_30px_rgba(255,0,128,0.15)] relative">
        <img src="/algoarena/img/tree_flowchart.png" alt="Tree Algorithm Diagram" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="bg-black/40 border border-[#ff0080]/20 p-5 rounded-xl">
        <h3 className="text-[#ff0080] font-bold text-lg mb-2 flex items-center gap-2"><Cpu className="w-5 h-5"/> Tree Data Structures</h3>
        <p className="mb-3 text-gray-300">
          Trees are hierarchical data structures consisting of "Nodes" connected by "Edges". Unlike arrays which are linear, trees branch out, allowing for complex relational mapping.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li><strong>Binary Search Tree (BST):</strong> Organizes data mathematically so that the left child is always smaller than the parent, and the right child is larger. This enables $O(\log N)$ search times.</li>
          <li><strong>Root & Leaves:</strong> The absolute top node is the "Root". Any node at the bottom without children is a "Leaf".</li>
        </ul>
      </div>

      <div className="bg-black/40 border border-green-500/20 p-5 rounded-xl mt-6">
        <h3 className="text-green-400 font-bold text-lg mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5"/> Recursive Traversals</h3>
        <p className="mb-3 text-gray-300">
          Because trees are not linear, you cannot just loop from 0 to N. You must use recursive logic to explore the branches.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li><strong>In-Order (Left, Root, Right):</strong> Extremely powerful! When run on a BST, it retrieves all the data perfectly sorted in ascending order!</li>
          <li><strong>Pre-Order (Root, Left, Right):</strong> Explores the parent before the children. Used to perfectly clone a tree or serialize it for storage.</li>
          <li><strong>Post-Order (Left, Right, Root):</strong> Explores all the way to the leaves first. Used to safely delete a tree from the bottom up without creating memory leaks!</li>
        </ul>
      </div>

      <div className="bg-black/40 border border-purple-500/20 p-5 rounded-xl mt-6">
        <h3 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2"><Globe2 className="w-5 h-5"/> Industry Applications</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li><strong>Web Browsers (DOM):</strong> The HTML on this very webpage is parsed and rendered as a "Document Object Model" Tree.</li>
          <li><strong>File Systems:</strong> Your computer's folders and directories are mathematically represented as a Tree data structure.</li>
          <li><strong>Machine Learning:</strong> Decision Trees and Random Forests use this architecture to classify data and make AI predictions.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 relative">
      <InfoModal title="The Science of Trees" content={treeInfo} />
      
      {/* Header Info */}
      <div className="mb-8 relative z-10 pointer-events-none">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ff0080] uppercase tracking-widest mb-6 drop-shadow-[0_0_15px_rgba(255,0,128,0.3)]">
          Tree Arena
        </h1>
      </div>
      
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
