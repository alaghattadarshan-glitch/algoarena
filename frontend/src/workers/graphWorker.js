import { graphAlgorithmsMap } from '../algorithms/pathfinding';

let generator = null;
let algorithmName = '';
let accumulatedTime = 0;

self.onmessage = (e) => {
  const { type, payload } = e.data;
  
  if (type === 'INIT') {
    const { algorithm, rows, cols, startNode, endNode, wallsArray } = payload;
    algorithmName = algorithm;
    const wallsSet = new Set(wallsArray);
    
    generator = graphAlgorithmsMap[algorithmName].generator(rows, cols, startNode, endNode, wallsSet);
    accumulatedTime = 0;
    self.postMessage({ type: 'INIT_DONE' });
  } 
  else if (type === 'TICK') {
    if (!generator) return;
    
    const t0 = performance.now();
    const result = generator.next();
    accumulatedTime += (performance.now() - t0);
    
    if (result.done) {
      // Completed naturally (or no path found)
      self.postMessage({ 
        type: 'STEP', 
        payload: { 
          algorithm: algorithmName, 
          value: result.value || { visitedNodes: [], path: [], finished: true }, 
          done: true,
          timeTaken: accumulatedTime
        } 
      });
      generator = null;
    } else {
      self.postMessage({ 
        type: 'STEP', 
        payload: { 
          algorithm: algorithmName, 
          value: result.value, 
          done: result.value.finished,
          timeTaken: accumulatedTime
        } 
      });
      
      if (result.value.finished) {
        generator = null;
      }
    }
  }
};
