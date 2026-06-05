import { create } from 'zustand';

export const useRaceStore = create((set, get) => ({
  arenaMode: 'sorting',
  array: [],
  arraySize: 50,
  arrayType: 'random',
  speed: 50,
  debugMode: false,
  stepTrigger: 0,
  customCode: `function* customSort(array) {
  let arr = [...array];
  let comparisons = 0, swaps = 0;
  // Write your logic here! 
  // yield { arr: [...arr], active: [], comparisons, swaps, sorted: false, line: 0 };
  
  yield { arr: [...arr], active: [], comparisons, swaps, sorted: true, line: null };
}`,
  algorithms: [],
  raceStatus: 'idle', // idle, running, paused, finished
  
  // metrics: { 'Bubble Sort': { arr: [], active: [], comparisons: 0, swaps: 0, time: 0, finished: false, history: [], line: null } }
  metrics: {},
  winner: null,
  
  soundEnabled: true,
  geometryMode: 'bars', // bars, scatter, spectrum
  timelineIndex: -1, // -1 means live/latest
  maxTimelineLength: 0,
  customInput: '10, 6, 7, 2, 3, 5, 9, 4, 1, 8',

  setArraySize: (size) => set({ arraySize: size }),
  setSpeed: (speed) => set({ speed }),
  setArenaMode: (mode) => set({ arenaMode: mode }),
  setArrayType: (type) => set({ arrayType: type }),
  setDebugMode: (mode) => set({ debugMode: mode }),
  triggerNextStep: () => set((state) => ({ stepTrigger: state.stepTrigger + 1 })),
  setCustomCode: (code) => set({ customCode: code }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setGeometryMode: (mode) => set({ geometryMode: mode }),
  setTimelineIndex: (index) => set({ timelineIndex: index }),
  setCustomInput: (input) => set({ customInput: input }),

  setArray: (arr) => {
    const { algorithms } = get();
    const initialMetrics = {};
    algorithms.forEach(algo => {
      initialMetrics[algo] = { arr: [...arr], active: [], comparisons: 0, swaps: 0, time: 0, finished: false, history: [], line: null };
    });
    set({ array: arr, metrics: initialMetrics, raceStatus: 'idle', winner: null, timelineIndex: -1, maxTimelineLength: 0 });
  },
  
  toggleAlgorithm: (algo) => set((state) => {
    let newAlgos;
    if (state.algorithms.includes(algo)) {
      newAlgos = state.algorithms.filter(a => a !== algo);
    } else {
      if (state.algorithms.length < 4) {
        newAlgos = [...state.algorithms, algo];
      } else {
        newAlgos = state.algorithms;
      }
    }
    const initialMetrics = {};
    newAlgos.forEach(a => {
      initialMetrics[a] = { arr: [...state.array], active: [], comparisons: 0, swaps: 0, time: 0, finished: false, history: [], line: null };
    });
    return { algorithms: newAlgos, metrics: initialMetrics, raceStatus: 'idle', timelineIndex: -1, maxTimelineLength: 0 };
  }),
  
  updateMetric: (algo, data) => set((state) => {
    const prevMetrics = state.metrics[algo];
    // Cap history at 1000 to prevent memory leak
    const newHistory = [...(prevMetrics.history || []), { ...data }];
    if (newHistory.length > 2000) newHistory.shift(); 
    
    const maxLen = Math.max(state.maxTimelineLength, newHistory.length);

    const newMetrics = { 
      ...state.metrics, 
      [algo]: { 
        ...prevMetrics, 
        ...data,
        history: newHistory
      } 
    };
    return { metrics: newMetrics, maxTimelineLength: maxLen };
  }),
  
  startRace: () => set({ raceStatus: 'running', winner: null, timelineIndex: -1 }),
  pauseRace: () => set({ raceStatus: 'paused' }),
  resumeRace: () => set({ raceStatus: 'running' }),
  finishRace: () => set({ raceStatus: 'finished' }),
  setWinner: (algo) => set({ winner: algo })
}));
