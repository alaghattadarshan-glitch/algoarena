import React, { useState } from 'react';
import { useTreeStore } from '../store/useTreeStore';
import TreeVisualizer from '../visualizers/TreeVisualizer';
import { insertBSTNode, inOrderTraversal, preOrderTraversal, postOrderTraversal } from '../algorithms/treeAlgorithms';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

import AlgorithmWikiModal from './AlgorithmWikiModal';
import { Cpu, Globe2, Lightbulb } from 'lucide-react';

const TREE_ALGO_COMPLEXITY = {
  'BST Insertion': {
    best: 'O(log N)',
    avg: 'O(log N)',
    worst: 'O(N)',
    space: 'O(log N)',
    tooltip: 'Traverses down comparing values. Time complexity depends heavily on tree balance.'
  },
  'In-Order Traversal': {
    best: 'O(N)',
    avg: 'O(N)',
    worst: 'O(N)',
    space: 'O(H)',
    tooltip: 'Visits Left-Root-Right. Standard way to retrieve sorted keys in ascending order.'
  },
  'Pre-Order Traversal': {
    best: 'O(N)',
    avg: 'O(N)',
    worst: 'O(N)',
    space: 'O(H)',
    tooltip: 'Visits Root-Left-Right. Excellent for copying, cloning or serializing trees.'
  },
  'Post-Order Traversal': {
    best: 'O(N)',
    avg: 'O(N)',
    worst: 'O(N)',
    space: 'O(H)',
    tooltip: 'Visits Left-Right-Root. Essential for safely deleting/deallocating parent-child nodes.'
  }
};

const evaluateTreeComplexity = (notation, n) => {
  const clean = notation.toLowerCase().replace(/\s/g, '');
  if (clean.includes('logn')) return Math.log2(n);
  if (clean.includes('h')) return Math.log2(n); // Height of balanced tree is log N
  return n; // linear O(N)
};

const generateTreeComplexityData = (comp) => {
  const data = [];
  for (let n = 2; n <= 16; n += 2) {
    data.push({
      name: `N=${n}`,
      'Time Complexity': evaluateTreeComplexity(comp.avg || comp.best, n),
      'Space Complexity': evaluateTreeComplexity(comp.space, n)
    });
  }
  return data;
};

const TreeArena = () => {
  const { nodes, clearTree, speed, setSpeed, traversalOutput } = useTreeStore();
  const [inputValue, setInputValue] = useState('');
  const [selectedTreeAlgo, setSelectedTreeAlgo] = useState('BST Insertion');

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

  const treeWikiData = [
    {
      id: 'bst-insert',
      name: 'BST Insertion',
      imagePath: '/algoarena/img/tree_flowchart.png',
      imageAlt: 'BST Insertion Flowchart',
      colorGradient: 'from-[#ff0080] to-purple-500',
      borderColor: 'border-[#ff0080]/30',
      imageExplanation: "This flowchart illustrates the core rule of Binary Search Trees. A new node enters at the root and compares itself. If it's smaller, it goes left. If larger, it goes right. It falls down the tree until it finds an empty spot to attach itself, permanently maintaining the perfectly sorted horizontal structure.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">To insert a new node into a Binary Search Tree, you begin at the root. You compare the new value with the current node's value. If it's less, you move to the left child; if it's greater, you move to the right child. You repeat this recursively until you hit a null pointer, where you insert the new node.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(log N) average case, but O(N) worst case if the tree becomes unbalanced (like a linked list).</li>
            <li><strong>Space:</strong> O(log N) for the recursive call stack.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>BSTs form the foundation for more complex self-balancing trees like AVL and Red-Black trees, which are the backbone of almost every dictionary map (like C++ std::map) and database indexing system in the world.</p>
        </>
      )
    },
    {
      id: 'in-order',
      name: 'In-Order Traversal',
      imagePath: '/algoarena/img/tree_flowchart.png',
      imageAlt: 'In-Order Flowchart',
      colorGradient: 'from-green-400 to-emerald-500',
      borderColor: 'border-green-400/30',
      imageExplanation: "This diagram traces the exact path of In-Order traversal: Left-Root-Right. By recursively diving down the far left branch first, the algorithm physically extracts the data in perfectly sorted, ascending numerical order.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">In-order traversal visits the left subtree, then the root node, and finally the right subtree. On a Binary Search Tree, this specific order of operations guarantees that every node is visited in ascending sorted order.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N) because every node must be visited exactly once.</li>
            <li><strong>Space:</strong> O(H) where H is the height of the tree, due to the recursive stack.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>In-order traversal is used whenever you need to 'flatten' a BST back into a sorted array, or when you need to print out the contents of a directory structure in alphabetical order.</p>
        </>
      )
    },
    {
      id: 'pre-order',
      name: 'Pre-Order Traversal',
      imagePath: '/algoarena/img/tree_flowchart.png',
      imageAlt: 'Pre-Order Flowchart',
      colorGradient: 'from-blue-400 to-indigo-500',
      borderColor: 'border-blue-400/30',
      imageExplanation: "This diagram shows the Root-Left-Right pattern. The algorithm processes the current node immediately before diving into its children. This is perfect for making a structural clone of the tree because it reads the parents before the children.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Pre-order traversal visits the root node first, then recursively visits the left subtree, followed by the right subtree. It 'processes' the node before touching any of its descendants.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N).</li>
            <li><strong>Space:</strong> O(H) for the recursive stack.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Pre-order traversal is used to create a physical copy of a tree, or to serialize a tree into a flat string so it can be saved to a hard drive and accurately reconstructed later.</p>
        </>
      )
    },
    {
      id: 'post-order',
      name: 'Post-Order Traversal',
      imagePath: '/algoarena/img/tree_flowchart.png',
      imageAlt: 'Post-Order Flowchart',
      colorGradient: 'from-orange-400 to-red-500',
      borderColor: 'border-orange-400/30',
      imageExplanation: "This diagram illustrates the Left-Right-Root pattern. It is a highly destructive traversal because it guarantees that a node's children are fully processed (or deleted) before the parent node itself is touched.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Post-order traversal recursively visits the left subtree, then the right subtree, and only processes the root node at the very end. This ensures we never process a node until all its children are completely finished.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N).</li>
            <li><strong>Space:</strong> O(H) for the recursive stack.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Post-order is the algorithm you use when deleting a tree from RAM. You cannot delete a parent node before deleting its children (otherwise you cause memory leaks). Post-order safely deletes the leaves, moving upward to the root.</p>
        </>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 relative">
      <AlgorithmWikiModal title="Tree Algorithms Wiki" sections={treeWikiData} />
      
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

      {/* Tree Complexity Analysis Card */}
      {(() => {
        const treeComp = TREE_ALGO_COMPLEXITY[selectedTreeAlgo];
        return (
          <div className="glass-panel p-5 rounded-2xl w-full mx-auto mb-8 border border-[#ff0080]/30 z-10 relative flex flex-col md:flex-row gap-6">
            <div className="flex flex-col w-full md:w-1/3 gap-3">
              <h3 className="text-sm font-bold text-[#ff0080] uppercase tracking-wider">Complexity Reference</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(TREE_ALGO_COMPLEXITY).map(algo => (
                  <button
                    key={algo}
                    onClick={() => setSelectedTreeAlgo(algo)}
                    className={`py-1.5 px-2 rounded text-[10px] font-bold uppercase transition ${selectedTreeAlgo === algo ? 'bg-[#ff0080] text-white shadow-[0_0_10px_rgba(255,0,128,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {algo === 'BST Insertion' ? 'Insertion' : algo.replace(' Traversal', '')}
                  </button>
                ))}
              </div>
              
              <div className="text-[10px] text-gray-400 font-mono leading-relaxed mt-1">
                <span className="text-gray-500 block uppercase font-bold mb-1">Behavior</span>
                {treeComp.tooltip}
              </div>
            </div>

            <div className="flex flex-col w-full md:w-2/3 h-44 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400 font-mono">
                  Selected: <span className="text-[#ff0080] font-black">{selectedTreeAlgo}</span>
                </span>
                <div className="flex gap-3 text-[9px] font-mono">
                  <div>Best: <span className="text-[#00f3ff] font-bold">{treeComp.best}</span></div>
                  <div>Avg: <span className="text-[#ffae00] font-bold">{treeComp.avg}</span></div>
                  <div>Worst: <span className="text-[#ff0055] font-bold">{treeComp.worst}</span></div>
                  <div>Space: <span className="text-[#10b981] font-bold">{treeComp.space}</span></div>
                </div>
              </div>
              
              <div className="flex-1 bg-black/40 rounded border border-white/5 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateTreeComplexityData(treeComp)} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#888" style={{ fontSize: 8 }} />
                    <YAxis stroke="#888" style={{ fontSize: 8 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222', fontSize: 9 }}
                      itemStyle={{ padding: 0 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 8 }} />
                    <Line type="monotone" dataKey="Time Complexity" stroke="#00f3ff" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="Space Complexity" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })()}

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
