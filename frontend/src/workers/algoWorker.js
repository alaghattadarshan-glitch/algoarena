import { algorithmsMap } from '../algorithms/sorting';

let generator = null;
let algorithmName = '';
let startTime = 0;

self.onmessage = (e) => {
  const { type, payload } = e.data;
  
  if (type === 'INIT') {
    algorithmName = payload.algorithm;
    generator = algorithmsMap[algorithmName].generator(payload.array);
    startTime = performance.now();
    self.postMessage({ type: 'INIT_DONE' });
  } 
  else if (type === 'TICK') {
    if (!generator) return;
    const { value, done } = generator.next();
    const timeTaken = (performance.now() - startTime).toFixed(2);
    
    self.postMessage({
      type: 'STEP',
      payload: {
        algorithm: algorithmName,
        value,
        done,
        timeTaken
      }
    });
  }
};
