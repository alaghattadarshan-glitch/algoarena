// LCS Generator
export function* lcsAlgorithm(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Initialize matrix with 0s
  const grid = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const matchCells = [];

  // Yield initial state
  yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: null, referenceCells: [], matchCells: [...matchCells] };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let refCells = [];
      
      // Highlight the cell we are about to compute
      yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: { r: i, c: j }, referenceCells: refCells, matchCells: [...matchCells] };

      if (str1[i - 1] === str2[j - 1]) {
        // Characters match
        refCells = [{ r: i - 1, c: j - 1 }];
        grid[i][j] = grid[i - 1][j - 1] + 1;
        matchCells.push({ r: i, c: j }); // Store this cell as part of a match
        
        // Show referencing the diagonal
        yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: { r: i, c: j }, referenceCells: refCells, matchCells: [...matchCells] };
      } else {
        // Characters don't match, take max of top or left
        refCells = [{ r: i - 1, c: j }, { r: i, c: j - 1 }];
        grid[i][j] = Math.max(grid[i - 1][j], grid[i][j - 1]);
        
        // Show referencing top and left
        yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: { r: i, c: j }, referenceCells: refCells, matchCells: [...matchCells] };
      }
    }
  }

  // Final yield
  yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: null, referenceCells: [], matchCells: [...matchCells], finished: true };
}

// 0/1 Knapsack Generator
export function* knapsackAlgorithm(weights, values, capacity) {
  const n = weights.length;
  
  // Initialize matrix with 0s
  const grid = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  // Yield initial state
  yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: null, referenceCells: [], matchCells: [] };

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      let refCells = [];
      
      // Highlight active cell
      yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: { r: i, c: w }, referenceCells: refCells, matchCells: [] };

      if (weights[i - 1] <= w) {
        // We can include the item
        const valIfIncluded = values[i - 1] + grid[i - 1][w - weights[i - 1]];
        const valIfExcluded = grid[i - 1][w];
        
        refCells = [{ r: i - 1, c: w }, { r: i - 1, c: w - weights[i - 1] }]; // Top cell, and cell shifted back by weight
        
        grid[i][w] = Math.max(valIfIncluded, valIfExcluded);
        
        yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: { r: i, c: w }, referenceCells: refCells, matchCells: [] };
      } else {
        // We cannot include the item (too heavy)
        refCells = [{ r: i - 1, c: w }];
        grid[i][w] = grid[i - 1][w];
        
        yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: { r: i, c: w }, referenceCells: refCells, matchCells: [] };
      }
    }
  }

  // Final yield
  yield { grid: JSON.parse(JSON.stringify(grid)), activeCell: null, referenceCells: [], matchCells: [], finished: true };
}
