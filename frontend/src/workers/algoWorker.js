import { algorithmsMap } from '../algorithms/sorting';

let generator = null;
let algorithmName = '';
let startTime = 0;

self.onmessage = (e) => {
  const { type, payload } = e.data;
  
  if (type === 'INIT') {
    algorithmName = payload.algorithm;
    if (algorithmName === 'Custom Sort') {
      try {
        const fn = new Function('return ' + payload.customCode)();
        generator = fn(payload.array);
      } catch (e) {
        self.postMessage({ type: 'ERROR', payload: e.message });
        return;
      }
    } else {
      generator = algorithmsMap[algorithmName].generator(payload.array);
    }
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
