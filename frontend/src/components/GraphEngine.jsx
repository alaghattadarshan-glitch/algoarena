import React, { useEffect, useRef } from 'react';
import { useGraphStore } from '../store/useGraphStore';
import GraphWorker from '../workers/graphWorker?worker';
import { playFinishSound } from '../utils/audio';

const GraphEngine = () => {
  const { grid, algorithms, raceStatus, updateMetric, speed, setWinner, finishRace, startNode, endNode, walls } = useGraphStore();
  const workersRef = useRef({});
  const intervalRef = useRef(null);
  const finishedStateRef = useRef({});

  useEffect(() => {
    if (raceStatus === 'running') {
      
      if (Object.keys(workersRef.current).length === 0) {
        // Convert walls Set to Array to pass to worker
        const wallsArray = Array.from(walls);
        const rows = grid.length;
        const cols = grid[0].length;
        
        algorithms.forEach(algo => {
          const worker = new GraphWorker();
          worker.postMessage({ 
            type: 'INIT', 
            payload: { algorithm: algo, rows, cols, startNode, endNode, wallsArray } 
          });
          
          worker.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'STEP') {
              const { algorithm, value, done, timeTaken } = payload;
              
              if (done || value.finished) {
                 finishedStateRef.current[algorithm] = true;
                 updateMetric(algorithm, { ...value, finished: true, time: timeTaken });
                 
                 if (!useGraphStore.getState().winner) {
                   setWinner(algorithm);
                 }
                 
                 if (Object.keys(finishedStateRef.current).length === algorithms.length) {
                   clearInterval(intervalRef.current);
                   finishRace();
                   playFinishSound(true); // Always play finish sound for graph
                   
                   Object.values(workersRef.current).forEach(w => w.terminate());
                   workersRef.current = {};
                 }
              } else {
                 updateMetric(algorithm, value);
              }
            }
          };
          
          workersRef.current[algo] = worker;
        });
        finishedStateRef.current = {};
      }

      intervalRef.current = setInterval(() => {
        Object.values(workersRef.current).forEach(worker => {
           worker.postMessage({ type: 'TICK' });
        });
      }, 1000 / speed);

    } else if (raceStatus === 'idle') {
      clearInterval(intervalRef.current);
      Object.values(workersRef.current).forEach(worker => worker.terminate());
      workersRef.current = {};
      finishedStateRef.current = {};
    }

    return () => {
       clearInterval(intervalRef.current);
    };
  }, [raceStatus, speed, algorithms, grid, startNode, endNode, walls]);

  useEffect(() => {
    return () => {
      Object.values(workersRef.current).forEach(worker => worker.terminate());
    };
  }, []);

  return null;
};

export default GraphEngine;
