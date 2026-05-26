import React, { useEffect, useRef } from 'react';
import { useRaceStore } from '../store/useRaceStore';
import AlgoWorker from '../workers/algoWorker?worker';
import { playTone, playFinishSound } from '../utils/audio';

const RaceEngine = () => {
  const { array, algorithms, raceStatus, updateMetric, speed, setWinner, finishRace, soundEnabled, debugMode, stepTrigger } = useRaceStore();
  const workersRef = useRef({});
  const intervalRef = useRef(null);
  const finishedStateRef = useRef({});

  useEffect(() => {
    if (raceStatus === 'running') {
      
      if (Object.keys(workersRef.current).length === 0) {
        algorithms.forEach(algo => {
          const worker = new AlgoWorker();
          worker.postMessage({ type: 'INIT', payload: { algorithm: algo, array, customCode: useRaceStore.getState().customCode } });
          
          worker.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'ERROR') {
              alert(`Syntax Error in Custom Code IDE:\n\n${payload}`);
              finishRace();
              Object.values(workersRef.current).forEach(w => w.terminate());
              workersRef.current = {};
              clearInterval(intervalRef.current);
            } else if (type === 'STEP') {
              const { algorithm, value, done, timeTaken } = payload;
              
              if (done || value?.sorted) {
                 finishedStateRef.current[algorithm] = true;
                 updateMetric(algorithm, { ...value, finished: true, time: timeTaken });
                 
                 if (!useRaceStore.getState().winner) {
                   setWinner(algorithm);
                 }
                 
                 if (Object.keys(finishedStateRef.current).length === algorithms.length) {
                   clearInterval(intervalRef.current);
                   finishRace();
                   playFinishSound(soundEnabled);
                   
                   Object.values(workersRef.current).forEach(w => w.terminate());
                   workersRef.current = {};
                 }
              } else {
                 updateMetric(algorithm, value);
                 if (value.swappedValue !== undefined) {
                   playTone(value.swappedValue, 105, soundEnabled);
                 }
              }
            }
          };
          
          workersRef.current[algo] = worker;
        });
        finishedStateRef.current = {};
      }

      if (!debugMode) {
        intervalRef.current = setInterval(() => {
          Object.values(workersRef.current).forEach(worker => {
             worker.postMessage({ type: 'TICK' });
          });
        }, 1000 / speed);
      }

    } else if (raceStatus === 'paused') {
      clearInterval(intervalRef.current);
    } else if (raceStatus === 'idle') {
      clearInterval(intervalRef.current);
      Object.values(workersRef.current).forEach(worker => worker.terminate());
      workersRef.current = {};
      finishedStateRef.current = {};
    }

    return () => {
       clearInterval(intervalRef.current);
    };
  }, [raceStatus, speed, algorithms, array, soundEnabled, debugMode]);

  // Handle manual steps in debug mode
  useEffect(() => {
    if (debugMode && raceStatus === 'running' && stepTrigger > 0) {
      Object.values(workersRef.current).forEach(worker => {
         worker.postMessage({ type: 'TICK' });
      });
    }
  }, [stepTrigger, debugMode, raceStatus]);

  // Cleanup workers on unmount
  useEffect(() => {
    return () => {
      Object.values(workersRef.current).forEach(worker => worker.terminate());
    };
  }, []);

  return null;
};

export default RaceEngine;
