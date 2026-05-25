import { graphAlgorithmsMap } from '../algorithms/pathfinding';

let generator = null;
let algorithmName = '';
let startTime = 0;

self.onmessage = (e) => {
  const { type, payload } = e.data;
  
  if (type === 'INIT') {
    const { algorithm, rows, cols, startNode, endNode, wallsArray } = payload;
    algorithmName = algorithm;
    const wallsSet = new Set(wallsArray);
    
    generator = graphAlgorithmsMap[algorithmName].generator(rows, cols, startNode, endNode, wallsSet);
    startTime = performance.now();
    self.postMessage({ type: 'INIT_DONE' });
  } 
  else if (type === 'TICK') {
    if (!generator) return;
    
    const result = generator.next();
    
    if (result.done) {
      // Completed naturally (or no path found)
      self.postMessage({ 
        type: 'STEP', 
        payload: { 
          algorithm: algorithmName, 
          value: result.value || { visitedNodes: [], path: [], finished: true }, 
          done: true,
          timeTaken: performance.now() - startTime
        } 
      });
      generator = null;
    } else {
      const timeTaken = performance.now() - startTime;
      self.postMessage({ 
        type: 'STEP', 
        payload: { 
          algorithm: algorithmName, 
          value: result.value, 
          done: result.value.finished,
          timeTaken
        } 
      });
      
      if (result.value.finished) {
        generator = null;
      }
    }
  }
};
