// Helper function to get neighbors (Up, Down, Left, Right)
const getNeighbors = (node, rows, cols, walls) => {
  const neighbors = [];
  const { row, col } = node;
  
  if (row > 0) neighbors.push({ row: row - 1, col }); // Up
  if (row < rows - 1) neighbors.push({ row: row + 1, col }); // Down
  if (col > 0) neighbors.push({ row, col: col - 1 }); // Left
  if (col < cols - 1) neighbors.push({ row, col: col + 1 }); // Right
  
  return neighbors.filter(n => !walls.has(`${n.row}-${n.col}`));
};

const getPath = (cameFrom, endNode) => {
  const path = [];
  let current = `${endNode.row}-${endNode.col}`;
  while (cameFrom[current]) {
    path.push(cameFrom[current]);
    current = `${cameFrom[current].row}-${cameFrom[current].col}`;
  }
  return path.reverse();
};

export function* bfs(rows, cols, startNode, endNode, walls) {
  const queue = [startNode];
  const visited = new Set([`${startNode.row}-${startNode.col}`]);
  const cameFrom = {};
  const visitedNodesInOrder = [];
  
  while (queue.length > 0) {
    const current = queue.shift();
    visitedNodesInOrder.push(current);
    
    if (current.row === endNode.row && current.col === endNode.col) {
      yield { visitedNodes: visitedNodesInOrder, path: getPath(cameFrom, endNode), finished: true };
      return;
    }
    
    const neighbors = getNeighbors(current, rows, cols, walls);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        cameFrom[key] = current;
        queue.push(neighbor);
      }
    }
    
    yield { visitedNodes: visitedNodesInOrder, path: [], finished: false };
  }
  
  yield { visitedNodes: visitedNodesInOrder, path: [], finished: true };
}

export function* dfs(rows, cols, startNode, endNode, walls) {
  const stack = [startNode];
  const visited = new Set([`${startNode.row}-${startNode.col}`]);
  const cameFrom = {};
  const visitedNodesInOrder = [];
  
  while (stack.length > 0) {
    const current = stack.pop();
    visitedNodesInOrder.push(current);
    
    if (current.row === endNode.row && current.col === endNode.col) {
      yield { visitedNodes: visitedNodesInOrder, path: getPath(cameFrom, endNode), finished: true };
      return;
    }
    
    const neighbors = getNeighbors(current, rows, cols, walls);
    // Reverse to explore Up, Left, Down, Right natively
    for (const neighbor of neighbors.reverse()) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        cameFrom[key] = current;
        stack.push(neighbor);
      }
    }
    
    yield { visitedNodes: visitedNodesInOrder, path: [], finished: false };
  }
  
  yield { visitedNodes: visitedNodesInOrder, path: [], finished: true };
}

export function* dijkstra(rows, cols, startNode, endNode, walls) {
  const distances = {};
  const cameFrom = {};
  const unvisited = [];
  const visitedNodesInOrder = [];
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!walls.has(`${r}-${c}`)) {
        distances[`${r}-${c}`] = Infinity;
        unvisited.push({ row: r, col: c });
      }
    }
  }
  
  distances[`${startNode.row}-${startNode.col}`] = 0;
  
  while (unvisited.length > 0) {
    unvisited.sort((a, b) => distances[`${a.row}-${a.col}`] - distances[`${b.row}-${b.col}`]);
    const current = unvisited.shift();
    
    if (distances[`${current.row}-${current.col}`] === Infinity) break;
    
    visitedNodesInOrder.push(current);
    
    if (current.row === endNode.row && current.col === endNode.col) {
      yield { visitedNodes: visitedNodesInOrder, path: getPath(cameFrom, endNode), finished: true };
      return;
    }
    
    const neighbors = getNeighbors(current, rows, cols, walls);
    for (const neighbor of neighbors) {
      const alt = distances[`${current.row}-${current.col}`] + 1;
      const key = `${neighbor.row}-${neighbor.col}`;
      if (alt < distances[key]) {
        distances[key] = alt;
        cameFrom[key] = current;
      }
    }
    
    yield { visitedNodes: visitedNodesInOrder, path: [], finished: false };
  }
  
  yield { visitedNodes: visitedNodesInOrder, path: [], finished: true };
}

const manhattan = (node1, node2) => Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);

export function* astar(rows, cols, startNode, endNode, walls) {
  const openSet = [startNode];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const visitedNodesInOrder = [];
  const inOpenSet = new Set([`${startNode.row}-${startNode.col}`]);
  const closedSet = new Set();
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gScore[`${r}-${c}`] = Infinity;
      fScore[`${r}-${c}`] = Infinity;
    }
  }
  
  gScore[`${startNode.row}-${startNode.col}`] = 0;
  fScore[`${startNode.row}-${startNode.col}`] = manhattan(startNode, endNode);
  
  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[`${a.row}-${a.col}`] - fScore[`${b.row}-${b.col}`]);
    const current = openSet.shift();
    const currentKey = `${current.row}-${current.col}`;
    inOpenSet.delete(currentKey);
    closedSet.add(currentKey);
    
    visitedNodesInOrder.push(current);
    
    if (current.row === endNode.row && current.col === endNode.col) {
      yield { visitedNodes: visitedNodesInOrder, path: getPath(cameFrom, endNode), finished: true };
      return;
    }
    
    const neighbors = getNeighbors(current, rows, cols, walls);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (closedSet.has(key)) continue;
      
      const tentativeGScore = gScore[currentKey] + 1;
      
      if (tentativeGScore < gScore[key]) {
        cameFrom[key] = current;
        gScore[key] = tentativeGScore;
        fScore[key] = gScore[key] + manhattan(neighbor, endNode);
        
        if (!inOpenSet.has(key)) {
          openSet.push(neighbor);
          inOpenSet.add(key);
        }
      }
    }
    
    yield { visitedNodes: visitedNodesInOrder, path: [], finished: false };
  }
  
  yield { visitedNodes: visitedNodesInOrder, path: [], finished: true };
}

export function* greedyBFS(rows, cols, startNode, endNode, walls) {
  const openSet = [startNode];
  const cameFrom = {};
  const visitedNodesInOrder = [];
  const inOpenSet = new Set([`${startNode.row}-${startNode.col}`]);
  const closedSet = new Set();
  
  while (openSet.length > 0) {
    openSet.sort((a, b) => manhattan(a, endNode) - manhattan(b, endNode));
    const current = openSet.shift();
    const currentKey = `${current.row}-${current.col}`;
    inOpenSet.delete(currentKey);
    closedSet.add(currentKey);
    
    visitedNodesInOrder.push(current);
    
    if (current.row === endNode.row && current.col === endNode.col) {
      yield { visitedNodes: visitedNodesInOrder, path: getPath(cameFrom, endNode), finished: true };
      return;
    }
    
    const neighbors = getNeighbors(current, rows, cols, walls);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (closedSet.has(key) || inOpenSet.has(key)) continue;
      
      cameFrom[key] = current;
      openSet.push(neighbor);
      inOpenSet.add(key);
    }
    yield { visitedNodes: visitedNodesInOrder, path: [], finished: false };
  }
  yield { visitedNodes: visitedNodesInOrder, path: [], finished: true };
}

export function* bidirectionalSwarm(rows, cols, startNode, endNode, walls) {
  const queueA = [startNode];
  const queueB = [endNode];
  const visitedA = new Set([`${startNode.row}-${startNode.col}`]);
  const visitedB = new Set([`${endNode.row}-${endNode.col}`]);
  const cameFromA = {};
  const cameFromB = {};
  const visitedNodesInOrder = [];
  
  while (queueA.length > 0 && queueB.length > 0) {
    // Expand A
    if (queueA.length > 0) {
      const currA = queueA.shift();
      visitedNodesInOrder.push(currA);
      const keyA = `${currA.row}-${currA.col}`;
      
      if (visitedB.has(keyA)) {
        let full = [];
        let curr = keyA;
        while(cameFromA[curr]) { full.push(cameFromA[curr]); curr = `${cameFromA[curr].row}-${cameFromA[curr].col}`; }
        full.reverse();
        full.push(currA);
        curr = keyA;
        while(cameFromB[curr]) { full.push(cameFromB[curr]); curr = `${cameFromB[curr].row}-${cameFromB[curr].col}`; }
        yield { visitedNodes: visitedNodesInOrder, path: full, finished: true };
        return;
      }
      
      const neighborsA = getNeighbors(currA, rows, cols, walls);
      for (const n of neighborsA) {
        const nKey = `${n.row}-${n.col}`;
        if (!visitedA.has(nKey)) {
          visitedA.add(nKey);
          cameFromA[nKey] = currA;
          queueA.push(n);
        }
      }
    }
    
    // Expand B
    if (queueB.length > 0) {
      const currB = queueB.shift();
      visitedNodesInOrder.push(currB);
      const keyB = `${currB.row}-${currB.col}`;
      
      if (visitedA.has(keyB)) {
        let full = [];
        let curr = keyB;
        while(cameFromA[curr]) { full.push(cameFromA[curr]); curr = `${cameFromA[curr].row}-${cameFromA[curr].col}`; }
        full.reverse();
        full.push(currB);
        curr = keyB;
        while(cameFromB[curr]) { full.push(cameFromB[curr]); curr = `${cameFromB[curr].row}-${cameFromB[curr].col}`; }
        yield { visitedNodes: visitedNodesInOrder, path: full, finished: true };
        return;
      }
      
      const neighborsB = getNeighbors(currB, rows, cols, walls);
      for (const n of neighborsB) {
        const nKey = `${n.row}-${n.col}`;
        if (!visitedB.has(nKey)) {
          visitedB.add(nKey);
          cameFromB[nKey] = currB;
          queueB.push(n);
        }
      }
    }
    yield { visitedNodes: visitedNodesInOrder, path: [], finished: false };
  }
  yield { visitedNodes: visitedNodesInOrder, path: [], finished: true };
}

export const graphAlgorithmsMap = {
  'A* Search': { generator: astar, complexity: { time: 'O(E)', space: 'O(V)', tag: 'Heuristic Best', curve: 'linear', tooltip: 'Uses a heuristic (Manhattan distance) to "guess" the direction of the target, massively reducing search time.' } },
  'Dijkstra': { generator: dijkstra, complexity: { time: 'O((V + E) log V)', space: 'O(V)', tag: 'Weighted Shortest', curve: 'loglinear', tooltip: 'Explores based on lowest distance cost. The gold standard for weighted graphs.' } },
  'Greedy Best-First': { generator: greedyBFS, complexity: { time: 'O(V log V)', space: 'O(V)', tag: 'Extreme Speed', curve: 'loglinear', tooltip: 'Focuses entirely on the heuristic. Incredibly fast, but ignores actual edge costs and may not find the shortest path.' } },
  'Bidirectional Swarm': { generator: bidirectionalSwarm, complexity: { time: 'O(V^(d/2))', space: 'O(V^(d/2))', tag: 'Dual Search', curve: 'loglinear', tooltip: 'Starts from both the Start and End nodes simultaneously. When they meet, the path is formed!' } },
  'BFS': { generator: bfs, complexity: { time: 'O(V + E)', space: 'O(V)', tag: 'Unweighted Shortest', curve: 'linear', tooltip: 'Explores neighbors uniformly. Guarantees the absolute shortest path on unweighted grids.' } },
  'DFS': { generator: dfs, complexity: { time: 'O(V + E)', space: 'O(V)', tag: 'Deep Exploration', curve: 'linear', tooltip: 'Dives as deep as possible before backtracking. Terrible for shortest paths, great for maze generation.' } }
};
