const express = require('express');
const router = express.Router();
const Algorithm = require('../models/Algorithm');

// Get all algorithms
router.get('/', async (req, res) => {
  try {
    const algorithms = await Algorithm.find({});
    res.json(algorithms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Seed some dummy algorithms
router.post('/seed', async (req, res) => {
  try {
    const algos = [
      {
        name: 'Bubble Sort',
        category: 'Sorting',
        complexity: { time: 'O(n^2)', space: 'O(1)' },
        description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        pseudocode: 'for i from 0 to n: for j from 0 to n-i-1: if arr[j] > arr[j+1] swap(arr[j], arr[j+1])',
        implementations: {
          python: 'def bubble_sort(arr):...',
          java: 'class BubbleSort {...}',
          cpp: 'void bubbleSort(int arr[], int n) {...}'
        }
      },
      {
        name: 'Quick Sort',
        category: 'Sorting',
        complexity: { time: 'O(n log n)', space: 'O(log n)' },
        description: 'Picks an element as pivot and partitions the given array around the picked pivot.',
        pseudocode: 'quickSort(arr, low, high) { if (low < high) { pi = partition(arr, low, high); quickSort(arr, low, pi - 1); quickSort(arr, pi + 1, high); } }',
        implementations: {
          python: 'def quick_sort(arr):...',
          java: 'class QuickSort {...}',
          cpp: 'void quickSort(int arr[], int low, int high) {...}'
        }
      }
    ];
    await Algorithm.deleteMany({});
    const created = await Algorithm.insertMany(algos);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
