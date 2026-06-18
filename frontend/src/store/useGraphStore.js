import { create } from 'zustand';
import { generateRecursiveDivisionMaze } from '../algorithms/mazeGeneration';

export const useGraphStore = create((set, get) => ({
  grid: [], // 2D array representing nodes
  rows: 20,
  cols: 50,
  startNode: { row: 10, col: 5 },
  endNode: { row: 10, col: 44 },
  walls: new Set(),
  clickTool: 'wall', // wall, start, end
  
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

  setStartNode: (row, col) => {
    const { endNode, rows, cols } = get();
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;
    if (row === endNode.row && col === endNode.col) return;
    
    // Remove wall if present
    const walls = new Set(get().walls);
    walls.delete(`${row}-${col}`);
    
    set({ startNode: { row, col }, walls, metrics: {}, winner: null });
  },

  setEndNode: (row, col) => {
    const { startNode, rows, cols } = get();
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;
    if (row === startNode.row && col === startNode.col) return;
    
    // Remove wall if present
    const walls = new Set(get().walls);
    walls.delete(`${row}-${col}`);
    
    set({ endNode: { row, col }, walls, metrics: {}, winner: null });
  },

  setClickTool: (tool) => set({ clickTool: tool }),

  setRows: (rows) => {
    const { startNode, endNode, cols } = get();
    // Clamp start and end nodes to the new rows limit
    const newStartNode = {
      row: Math.min(startNode.row, rows - 1),
      col: Math.min(startNode.col, cols - 1)
    };
    const newEndNode = {
      row: Math.min(endNode.row, rows - 1),
      col: Math.min(endNode.col, cols - 1)
    };
    // Ensure they don't overlap. If they do, adjust one of them.
    if (newStartNode.row === newEndNode.row && newStartNode.col === newEndNode.col) {
      if (newStartNode.row > 0) newStartNode.row--;
      else newEndNode.row++;
    }

    // Filter existing walls that are out of bounds
    const newWalls = new Set();
    get().walls.forEach(key => {
      const [r, c] = key.split('-').map(Number);
      if (r < rows && c < cols) {
        newWalls.add(key);
      }
    });

    set({ rows, startNode: newStartNode, endNode: newEndNode, walls: newWalls });
    get().initializeGrid();
  },

  setCols: (cols) => {
    const { startNode, endNode, rows } = get();
    // Clamp start and end nodes to the new cols limit
    const newStartNode = {
      row: Math.min(startNode.row, rows - 1),
      col: Math.min(startNode.col, cols - 1)
    };
    const newEndNode = {
      row: Math.min(endNode.row, rows - 1),
      col: Math.min(endNode.col, cols - 1)
    };
    // Ensure they don't overlap. If they do, adjust one of them.
    if (newStartNode.row === newEndNode.row && newStartNode.col === newEndNode.col) {
      if (newStartNode.col > 0) newStartNode.col--;
      else newEndNode.col++;
    }

    // Filter existing walls that are out of bounds
    const newWalls = new Set();
    get().walls.forEach(key => {
      const [r, c] = key.split('-').map(Number);
      if (r < rows && c < cols) {
        newWalls.add(key);
      }
    });

    set({ cols, startNode: newStartNode, endNode: newEndNode, walls: newWalls });
    get().initializeGrid();
  },

  setCustomWallsFromText: (text) => {
    const { rows, cols, startNode, endNode } = get();
    const newWalls = new Set();
    const regex = /(\d+)\D+(\d+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const r = parseInt(match[1]);
      const c = parseInt(match[2]);
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        // Don't place on start or end node
        if ((r === startNode.row && c === startNode.col) || (r === endNode.row && c === endNode.col)) continue;
        newWalls.add(`${r}-${c}`);
      }
    }
    set({ walls: newWalls, metrics: {}, raceStatus: 'idle', winner: null });
  },

  setWallPreset: (type) => {
    const { rows, cols, startNode, endNode } = get();
    const newWalls = new Set();
    
    const isReserved = (r, c) => {
      return (r === startNode.row && c === startNode.col) || (r === endNode.row && c === endNode.col);
    };

    if (type === 'spiral') {
      let top = 1, bottom = rows - 2;
      let left = 2, right = cols - 3;
      let count = 0;
      while (top <= bottom && left <= right) {
        if (count % 2 === 0) {
          for (let i = left; i <= right; i++) { if (!isReserved(top, i)) newWalls.add(`${top}-${i}`); }
          for (let i = top; i <= bottom; i++) { if (!isReserved(i, right)) newWalls.add(`${i}-${right}`); }
          for (let i = right; i >= left; i--) { if (!isReserved(bottom, i)) newWalls.add(`${bottom}-${i}`); }
          for (let i = bottom; i >= top; i--) { if (!isReserved(i, left)) newWalls.add(`${i}-${left}`); }
        }
        top += 2; bottom -= 2;
        left += 4; right -= 4;
        count++;
      }
    } else if (type === 'checkerboard') {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 4 === 0 && !isReserved(r, c)) {
            newWalls.add(`${r}-${c}`);
          }
        }
      }
    } else if (type === 'random') {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < 0.25 && !isReserved(r, c)) {
            newWalls.add(`${r}-${c}`);
          }
        }
      }
    } else if (type === 'slit') {
      const midCol = Math.floor(cols / 2);
      for (let r = 0; r < rows; r++) {
        if (r !== Math.floor(rows / 3) && r !== Math.floor(2 * rows / 3)) {
          if (!isReserved(r, midCol)) newWalls.add(`${r}-${midCol}`);
        }
      }
    } else if (type === 'cross') {
      const midRow = Math.floor(rows / 2);
      const midCol = Math.floor(cols / 2);
      for (let c = 0; c < cols; c++) {
        if (Math.abs(c - midCol) > 4 && !isReserved(midRow, c)) newWalls.add(`${midRow}-${c}`);
      }
      for (let r = 0; r < rows; r++) {
        if (Math.abs(r - midRow) > 2 && !isReserved(r, midCol)) newWalls.add(`${r}-${midCol}`);
      }
    }
    set({ walls: newWalls, metrics: {}, raceStatus: 'idle', winner: null });
  },

  setNodePreset: (type) => {
    const { rows, cols } = get();
    let startNode = { row: 10, col: 5 };
    let endNode = { row: 10, col: 44 };

    if (type === 'left-right') {
      startNode = { row: Math.floor(rows / 2), col: Math.max(1, Math.floor(cols * 0.1)) };
      endNode = { row: Math.floor(rows / 2), col: Math.min(cols - 2, Math.floor(cols * 0.9)) };
    } else if (type === 'top-bottom') {
      startNode = { row: 1, col: Math.floor(cols / 2) };
      endNode = { row: rows - 2, col: Math.floor(cols / 2) };
    } else if (type === 'diagonal') {
      startNode = { row: 2, col: 2 };
      endNode = { row: rows - 3, col: cols - 3 };
    } else if (type === 'center-corner') {
      startNode = { row: Math.floor(rows / 2), col: Math.floor(cols / 2) };
      endNode = { row: rows - 2, col: cols - 2 };
    }

    const walls = new Set(get().walls);
    walls.delete(`${startNode.row}-${startNode.col}`);
    walls.delete(`${endNode.row}-${endNode.col}`);

    set({ startNode, endNode, walls, metrics: {}, raceStatus: 'idle', winner: null });
  },
  
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
