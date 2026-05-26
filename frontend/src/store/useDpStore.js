import { create } from 'zustand';

export const useDpStore = create((set) => ({
  grid: [], // 2D array representing the DP table
  rowHeaders: [], // Labels for rows (e.g., characters of string 1, or items)
  colHeaders: [], // Labels for columns (e.g., characters of string 2, or capacity)
  
  activeCell: null, // { r, c } - The cell currently being calculated
  referenceCells: [], // Array of { r, c } - Cells being referenced to calculate activeCell
  matchCells: [], // Array of { r, c } - For highlighting matches (e.g., matching chars in LCS)
  
  speed: 500, // Animation speed in ms
  status: 'idle', // 'idle', 'running', 'finished'

  setSpeed: (speed) => set({ speed }),
  
  initGrid: (rows, cols, rowHeaders, colHeaders) => {
    // Create an empty grid filled with nulls or empty strings
    const grid = Array.from({ length: rows }, () => Array(cols).fill(''));
    set({ grid, rowHeaders, colHeaders, activeCell: null, referenceCells: [], matchCells: [], status: 'idle' });
  },
  
  updateCell: (r, c, value) => set((state) => {
    const newGrid = [...state.grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = value;
    return { grid: newGrid };
  }),
  
  setActiveCell: (r, c) => set({ activeCell: { r, c } }),
  setReferenceCells: (cells) => set({ referenceCells: cells }),
  setMatchCells: (cells) => set({ matchCells: cells }),
  setStatus: (status) => set({ status })
}));
