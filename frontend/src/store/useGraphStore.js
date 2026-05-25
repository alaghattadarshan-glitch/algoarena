import { create } from 'zustand';
import { generateRecursiveDivisionMaze } from '../algorithms/mazeGeneration';

export const useGraphStore = create((set, get) => ({
  grid: [], // 2D array representing nodes
  rows: 20,
  cols: 50,
  startNode: { row: 10, col: 5 },
  endNode: { row: 10, col: 44 },
  walls: new Set(),
  
  algorithms: [],
  speed: 50,
  raceStatus: 'idle', // idle, running, finished
  
  metrics: {}, // Stores nodes visited, path, and time for each algorithm
  winner: null,

  initializeGrid: () => {
    const { rows, cols } = get();
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({ row, col });
      }
      grid.push(currentRow);
    }
    set({ grid, raceStatus: 'idle', metrics: {}, winner: null });
  },

  generateMaze: () => {
    const { rows, cols, startNode, endNode } = get();
    const newWalls = generateRecursiveDivisionMaze(rows, cols, startNode, endNode);
    set({ walls: newWalls, metrics: {}, raceStatus: 'idle' });
  },

  setStartNode: (row, col) => set({ startNode: { row, col } }),
  setEndNode: (row, col) => set({ endNode: { row, col } }),
  
  toggleWall: (row, col) => {
    const walls = new Set(get().walls);
    const key = `${row}-${col}`;
    if (walls.has(key)) {
      walls.delete(key);
    } else {
      // Don't place wall on start or end
      const { startNode, endNode } = get();
      if ((row === startNode.row && col === startNode.col) || (row === endNode.row && col === endNode.col)) return;
      walls.add(key);
    }
    set({ walls });
  },
  
  clearWalls: () => set({ walls: new Set() }),
  
  toggleAlgorithm: (algo) => set((state) => {
    const algos = [...state.algorithms];
    if (algos.includes(algo)) {
      return { algorithms: algos.filter(a => a !== algo) };
    } else {
      if (algos.length < 4) return { algorithms: [...algos, algo] };
      return { algorithms: algos };
    }
  }),

  setSpeed: (speed) => set({ speed }),
  
  startRace: () => set({ raceStatus: 'running', metrics: {}, winner: null }),
  finishRace: () => set({ raceStatus: 'finished' }),
  resetRace: () => {
    get().initializeGrid();
  },

  updateMetric: (algo, metricData) => set((state) => ({
    metrics: {
      ...state.metrics,
      [algo]: { ...state.metrics[algo], ...metricData }
    }
  })),

  setWinner: (algo) => set({ winner: algo })
}));
