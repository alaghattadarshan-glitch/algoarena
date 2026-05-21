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

export const algorithmsMap = {
  'Bubble Sort': { generator: bubbleSort, code: bubbleSortCode },
  'Selection Sort': { generator: selectionSort, code: selectionSortCode },
  'Insertion Sort': { generator: insertionSort, code: insertionSortCode },
  'Quick Sort': { generator: quickSort, code: quickSortCode }
};
