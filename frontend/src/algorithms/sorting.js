export const bubbleSortCode = [
  "for i = 0 to n - 1",
  "  for j = 0 to n - i - 1",
  "    if arr[j] > arr[j + 1]",
  "      swap(arr[j], arr[j + 1])"
];

export function* bubbleSort(array) {
  let arr = [...array];
  let comparisons = 0, swaps = 0, n = arr.length;
  
  for (let i = 0; i < n; i++) {
    yield { arr: [...arr], active: [], comparisons, swaps, sorted: false, line: 0 };
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      yield { arr: [...arr], active: [j, j+1], comparisons, swaps, sorted: false, line: 2 };
      
      if (arr[j] > arr[j + 1]) {
        swaps++;
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        yield { arr: [...arr], active: [j, j+1], comparisons, swaps, sorted: false, line: 3, swappedValue: arr[j+1] };
      }
    }
  }
  yield { arr: [...arr], active: [], comparisons, swaps, sorted: true, line: null };
}

export const selectionSortCode = [
  "for i = 0 to n - 1",
  "  minIdx = i",
  "  for j = i + 1 to n",
  "    if arr[j] < arr[minIdx]",
  "      minIdx = j",
  "  if minIdx != i",
  "    swap(arr[i], arr[minIdx])"
];

export function* selectionSort(array) {
  let arr = [...array];
  let comparisons = 0, swaps = 0, n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { arr: [...arr], active: [i], comparisons, swaps, sorted: false, line: 1 };
    
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield { arr: [...arr], active: [minIdx, j], comparisons, swaps, sorted: false, line: 3 };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield { arr: [...arr], active: [minIdx], comparisons, swaps, sorted: false, line: 4 };
      }
    }
    
    yield { arr: [...arr], active: [i, minIdx], comparisons, swaps, sorted: false, line: 5 };
    if (minIdx !== i) {
      swaps++;
      let temp = arr[minIdx];
      arr[minIdx] = arr[i];
      arr[i] = temp;
      yield { arr: [...arr], active: [i, minIdx], comparisons, swaps, sorted: false, line: 6, swappedValue: arr[i] };
    }
  }
  yield { arr: [...arr], active: [], comparisons, swaps, sorted: true, line: null };
}

export const insertionSortCode = [
  "for i = 1 to n",
  "  key = arr[i], j = i - 1",
  "  while j >= 0 and arr[j] > key",
  "    arr[j + 1] = arr[j]",
  "    j = j - 1",
  "  arr[j + 1] = key"
];

export function* insertionSort(array) {
  let arr = [...array];
  let comparisons = 0, swaps = 0, n = arr.length;
  
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    yield { arr: [...arr], active: [i], comparisons, swaps, sorted: false, line: 1 };
    
    while (j >= 0) {
      comparisons++;
      yield { arr: [...arr], active: [j, j+1], comparisons, swaps, sorted: false, line: 2 };
      if (arr[j] > key) {
        swaps++;
        arr[j + 1] = arr[j];
        j = j - 1;
        yield { arr: [...arr], active: [j+1], comparisons, swaps, sorted: false, line: 3, swappedValue: arr[j+1] };
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    yield { arr: [...arr], active: [j+1], comparisons, swaps, sorted: false, line: 5, swappedValue: key };
  }
  yield { arr: [...arr], active: [], comparisons, swaps, sorted: true, line: null };
}

export const quickSortCode = [
  "function quickSort(arr, low, high)",
  "  if low < high",
  "    pi = partition(arr, low, high)",
  "    quickSort(arr, low, pi - 1)",
  "    quickSort(arr, pi + 1, high)"
];

export function* quickSort(array) {
  let arr = [...array];
  let comparisons = 0, swaps = 0;

  function* partition(low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      yield { arr: [...arr], active: [j, high], comparisons, swaps, sorted: false, line: 2 };
      if (arr[j] < pivot) {
        i++;
        swaps++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        yield { arr: [...arr], active: [i, j], comparisons, swaps, sorted: false, line: 2, swappedValue: arr[i] };
      }
    }
    swaps++;
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    yield { arr: [...arr], active: [i+1, high], comparisons, swaps, sorted: false, line: 2, swappedValue: arr[i+1] };
    return i + 1;
  }

  function* qSort(low, high) {
    if (low < high) {
      yield { arr: [...arr], active: [low, high], comparisons, swaps, sorted: false, line: 1 };
      let pi = yield* partition(low, high);
      yield { arr: [...arr], active: [pi], comparisons, swaps, sorted: false, line: 3 };
      yield* qSort(low, pi - 1);
      yield { arr: [...arr], active: [pi], comparisons, swaps, sorted: false, line: 4 };
      yield* qSort(pi + 1, high);
    }
  }

  yield* qSort(0, arr.length - 1);
  yield { arr: [...arr], active: [], comparisons, swaps, sorted: true, line: null };
}

// --- Heap Sort ---
export const heapSortCode = [
  "function heapSort(arr)",
  "  buildMaxHeap(arr)",
  "  for i = arr.length - 1 down to 1",
  "    swap(arr[0], arr[i])",
  "    heapify(arr, i, 0)"
];

export function* heapSort(array) {
  let arr = [...array];
  let comparisons = 0, swaps = 0, n = arr.length;

  function* heapify(n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n) {
      comparisons++;
      yield { arr: [...arr], active: [left, largest], comparisons, swaps, sorted: false, line: 4 };
      if (arr[left] > arr[largest]) largest = left;
    }

    if (right < n) {
      comparisons++;
      yield { arr: [...arr], active: [right, largest], comparisons, swaps, sorted: false, line: 4 };
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
      swaps++;
      let temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      yield { arr: [...arr], active: [i, largest], comparisons, swaps, sorted: false, line: 4, swappedValue: arr[i] };
      yield* heapify(n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    swaps++;
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    yield { arr: [...arr], active: [0, i], comparisons, swaps, sorted: false, line: 3, swappedValue: arr[0] };
    yield* heapify(i, 0);
  }

  yield { arr: [...arr], active: [], comparisons, swaps, sorted: true, line: null };
}

// --- Radix Sort ---
export const radixSortCode = [
  "function radixSort(arr)",
  "  max = getMax(arr)",
  "  for exp = 1; max / exp > 0; exp *= 10",
  "    countingSort(arr, exp)"
];

export function* radixSort(array) {
  let arr = [...array];
  let comparisons = 0, swaps = 0; 
  
  let max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      let index = Math.floor(arr[i] / exp) % 10;
      count[index]++;
      yield { arr: [...arr], active: [i], comparisons, swaps, sorted: false, line: 3 };
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      let index = Math.floor(arr[i] / exp) % 10;
      output[count[index] - 1] = arr[i];
      count[index]--;
      swaps++;
      yield { arr: [...arr], active: [i], comparisons, swaps, sorted: false, line: 3 };
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
      yield { arr: [...arr], active: [i], comparisons, swaps, sorted: false, line: 3, swappedValue: arr[i] };
    }
  }
  yield { arr: [...arr], active: [], comparisons, swaps, sorted: true, line: null };
}

// --- Bogo Sort ---
export const bogoSortCode = [
  "function bogoSort(arr)",
  "  while not isSorted(arr)",
  "    shuffle(arr)"
];

export function* bogoSort(array) {
  let arr = [...array];
  let comparisons = 0, swaps = 0;

  const isSorted = (a) => {
    for (let i = 1; i < a.length; i++) {
      comparisons++;
      if (a[i - 1] > a[i]) return false;
    }
    return true;
  };

  let attempts = 0; 
  while (!isSorted(arr) && attempts < 500) {
    attempts++;
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
      swaps++;
    }
    yield { arr: [...arr], active: [Math.floor(Math.random() * arr.length)], comparisons, swaps, sorted: false, line: 2 };
  }
  yield { arr: [...arr], active: [], comparisons, swaps, sorted: isSorted(arr), line: null };
}

export const algorithmsMap = {
  'Heap Sort': { 
    generator: heapSort, 
    code: heapSortCode,
    complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', curve: 'loglinear', tooltip: 'Builds a max-heap and repeatedly extracts the max element. Excellent memory efficiency.' }
  },
  'Radix Sort': { 
    generator: radixSort, 
    code: radixSortCode,
    complexity: { best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n+k)', curve: 'linear', tooltip: 'Non-comparative sorting by digit/bucket. Unbeatable for large arrays of numbers.' }
  },
  'Quick Sort': { 
    generator: quickSort, 
    code: quickSortCode,
    complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', curve: 'loglinear', tooltip: 'Partitions the array around a pivot. Extremely fast on average, but degrades if the pivot is poor.' }
  },
  'Insertion Sort': { 
    generator: insertionSort, 
    code: insertionSortCode,
    complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', curve: 'quadratic', tooltip: 'Builds the sorted array one element at a time. Very fast for nearly sorted data.' }
  },
  'Selection Sort': { 
    generator: selectionSort, 
    code: selectionSortCode,
    complexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', curve: 'quadratic', tooltip: 'Scans the entire array to find the minimum element in every pass.' }
  },
  'Bubble Sort': { 
    generator: bubbleSort, 
    code: bubbleSortCode,
    complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', curve: 'quadratic', tooltip: 'Compares adjacent elements repeatedly. Highly inefficient for large datasets.' }
  },
  'Bogo Sort': { 
    generator: bogoSort, 
    code: bogoSortCode,
    complexity: { best: 'O(n)', avg: 'O(n * n!)', worst: 'O(∞)', space: 'O(1)', curve: 'quadratic', tooltip: 'Meme algorithm. Randomly shuffles the array over and over until it happens to be sorted.' }
  }
};
