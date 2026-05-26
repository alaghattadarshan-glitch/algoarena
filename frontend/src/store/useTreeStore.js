import { create } from 'zustand';

export const useTreeStore = create((set, get) => ({
  nodes: [], // { id, value, x, y, leftId, rightId, parentId }
  edges: [], // { from: parentId, to: childId }
  rootId: null,
  
  activeNodes: [], // For highlighting traversal path
  traversalOutput: [], // Stores the result of tree traversals
  speed: 500, // ms per step
  status: 'idle', // 'idle', 'animating'

  setSpeed: (speed) => set({ speed }),
  
  clearTree: () => set({ nodes: [], edges: [], rootId: null, activeNodes: [], traversalOutput: [], status: 'idle' }),
  
  // Directly set the finalized structural state (used by treeAlgorithms)
  setTreeState: (nodes, edges, rootId) => set({ nodes, edges, rootId }),
  
  setActiveNodes: (activeNodes) => set({ activeNodes }),
  setTraversalOutput: (traversalOutput) => set({ traversalOutput }),
  setStatus: (status) => set({ status })
}));
