export function generateRecursiveDivisionMaze(rows, cols, startNode, endNode) {
  const walls = new Set();
  
  // Inner recursive division
  function divide(rStart, rEnd, cStart, cEnd, orientation) {
    if (rEnd < rStart || cEnd < cStart) return;
    
    let isHorizontal = orientation === "HORIZONTAL";
    
    let possibleRows = [];
    for (let i = rStart; i <= rEnd; i += 2) possibleRows.push(i);
    let possibleCols = [];
    for (let i = cStart; i <= cEnd; i += 2) possibleCols.push(i);
    
    if (possibleRows.length === 0 || possibleCols.length === 0) return;

    let wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
    let wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
    
    if (isHorizontal) {
      let passCol = Math.floor(Math.random() * ((cEnd - cStart) / 2 + 1)) * 2 + cStart - 1;
      
      for (let c = cStart - 1; c <= cEnd + 1; c++) {
        if (c !== passCol && c >= 0 && c < cols) {
          walls.add(`${wallRow}-${c}`);
        }
      }
      
      let nextTop = wallRow - 1 - rStart > cEnd - cStart ? "HORIZONTAL" : "VERTICAL";
      divide(rStart, wallRow - 2, cStart, cEnd, nextTop);
      
      let nextBottom = rEnd - (wallRow + 1) > cEnd - cStart ? "HORIZONTAL" : "VERTICAL";
      divide(wallRow + 2, rEnd, cStart, cEnd, nextBottom);
      
    } else {
      let passRow = Math.floor(Math.random() * ((rEnd - rStart) / 2 + 1)) * 2 + rStart - 1;
      
      for (let r = rStart - 1; r <= rEnd + 1; r++) {
        if (r !== passRow && r >= 0 && r < rows) {
          walls.add(`${r}-${wallCol}`);
        }
      }
      
      let nextLeft = rEnd - rStart > wallCol - 1 - cStart ? "HORIZONTAL" : "VERTICAL";
      divide(rStart, rEnd, cStart, wallCol - 2, nextLeft);
      
      let nextRight = rEnd - rStart > cEnd - (wallCol + 1) ? "HORIZONTAL" : "VERTICAL";
      divide(rStart, rEnd, wallCol + 2, cEnd, nextRight);
    }
  }
  
  // Add outer boundary
  for (let r = 0; r < rows; r++) { walls.add(`${r}-0`); walls.add(`${r}-${cols - 1}`); }
  for (let c = 0; c < cols; c++) { walls.add(`0-${c}`); walls.add(`${rows - 1}-${c}`); }
  
  divide(2, rows - 3, 2, cols - 3, (rows - 4 > cols - 4) ? "HORIZONTAL" : "VERTICAL");
  
  // Guarantee start/end are clear, plus their immediate neighbors to avoid being trapped
  const clearArea = (node) => {
    walls.delete(`${node.row}-${node.col}`);
    walls.delete(`${node.row+1}-${node.col}`);
    walls.delete(`${node.row-1}-${node.col}`);
    walls.delete(`${node.row}-${node.col+1}`);
    walls.delete(`${node.row}-${node.col-1}`);
  };
  clearArea(startNode);
  clearArea(endNode);
  
  return walls;
}
