import { algorithmsMap } from '../algorithms/sorting';

let generator = null;
let algorithmName = '';
let accumulatedTime = 0;

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
    accumulatedTime = 0;
    self.postMessage({ type: 'INIT_DONE' });
  } 
  else if (type === 'TICK') {
    if (!generator) return;
    const t0 = performance.now();
    const { value, done } = generator.next();
    accumulatedTime += (performance.now() - t0);
    const timeTaken = accumulatedTime.toFixed(3);
    
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
