export const layoutTree = (rootId, nodes, edges) => {
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);
  
  const VERTICAL_SPACING = 80;
  
  const assignPositions = (id, depth, minX, maxX) => {
    if (!id) return;
    const node = nodeMap[id];
    node.depth = depth;
    node.x = (minX + maxX) / 2;
    node.y = depth * VERTICAL_SPACING + 60;
    
    let leftChildId = null;
    let rightChildId = null;
    edges.forEach(e => {
      if (e.from === id) {
        if (nodeMap[e.to].value < node.value) leftChildId = e.to;
        else rightChildId = e.to;
      }
    });
    
    if (leftChildId) assignPositions(leftChildId, depth + 1, minX, node.x);
    if (rightChildId) assignPositions(rightChildId, depth + 1, node.x, maxX);
  };
  
  // Assume a canvas width around 800 for centering
  assignPositions(rootId, 0, 0, 800);
  return Object.values(nodeMap);
};

export function* insertBSTNode(storeState, value) {
  let { nodes, edges, rootId, setTreeState, setActiveNodes } = storeState;
  
  // Clone to avoid direct mutation
  nodes = JSON.parse(JSON.stringify(nodes));
  edges = JSON.parse(JSON.stringify(edges));
  
  const newNode = { id: `node-${Date.now()}-${Math.random()}`, value, x: 0, y: 0, depth: 0 };
  
  if (!rootId) {
    nodes.push(newNode);
    nodes = layoutTree(newNode.id, nodes, edges);
    setTreeState(nodes, edges, newNode.id);
    setActiveNodes([newNode.id]);
    yield { finished: true };
    setActiveNodes([]);
    return;
  }
  
  let currentId = rootId;
  while (currentId) {
    setActiveNodes([currentId]);
    yield { finished: false };
    
    const current = nodes.find(n => n.id === currentId);
    if (value === current.value) {
      setActiveNodes([]); // No duplicates
      return; 
    }
    
    let leftChildId = null;
    let rightChildId = null;
    edges.forEach(e => {
      if (e.from === currentId) {
        if (nodes.find(n => n.id === e.to).value < current.value) leftChildId = e.to;
        else rightChildId = e.to;
      }
    });
    
    if (value < current.value) {
      if (!leftChildId) {
        nodes.push(newNode);
        edges.push({ from: currentId, to: newNode.id });
        nodes = layoutTree(rootId, nodes, edges);
        setTreeState(nodes, edges, rootId);
        setActiveNodes([currentId, newNode.id]);
        yield { finished: true };
        setActiveNodes([]);
        return;
      } else {
        currentId = leftChildId;
      }
    } else {
      if (!rightChildId) {
        nodes.push(newNode);
        edges.push({ from: currentId, to: newNode.id });
        nodes = layoutTree(rootId, nodes, edges);
        setTreeState(nodes, edges, rootId);
        setActiveNodes([currentId, newNode.id]);
        yield { finished: true };
        setActiveNodes([]);
        return;
      } else {
        currentId = rightChildId;
      }
    }
  }
}

const getChildren = (nodeId, nodes, edges) => {
  const node = nodes.find(n => n.id === nodeId);
  let left = null, right = null;
  edges.forEach(e => {
    if (e.from === nodeId) {
      if (nodes.find(n => n.id === e.to).value < node.value) left = e.to;
      else right = e.to;
    }
  });
  return { left, right };
};

export function* inOrderTraversal(storeState) {
  const { nodes, edges, rootId, setActiveNodes, setTraversalOutput } = storeState;
  const output = [];
  
  function* traverse(nodeId) {
    if (!nodeId) return;
    const { left, right } = getChildren(nodeId, nodes, edges);
    
    yield* traverse(left);
    
    setActiveNodes([nodeId]);
    const node = nodes.find(n => n.id === nodeId);
    output.push(node.value);
    setTraversalOutput([...output]);
    yield { finished: false };
    
    yield* traverse(right);
  }
  
  setTraversalOutput([]);
  yield* traverse(rootId);
  setActiveNodes([]);
  yield { finished: true };
}

export function* preOrderTraversal(storeState) {
  const { nodes, edges, rootId, setActiveNodes, setTraversalOutput } = storeState;
  const output = [];
  
  function* traverse(nodeId) {
    if (!nodeId) return;
    
    setActiveNodes([nodeId]);
    const node = nodes.find(n => n.id === nodeId);
    output.push(node.value);
    setTraversalOutput([...output]);
    yield { finished: false };
    
    const { left, right } = getChildren(nodeId, nodes, edges);
    yield* traverse(left);
    yield* traverse(right);
  }
  
  setTraversalOutput([]);
  yield* traverse(rootId);
  setActiveNodes([]);
  yield { finished: true };
}

export function* postOrderTraversal(storeState) {
  const { nodes, edges, rootId, setActiveNodes, setTraversalOutput } = storeState;
  const output = [];
  
  function* traverse(nodeId) {
    if (!nodeId) return;
    const { left, right } = getChildren(nodeId, nodes, edges);
    
    yield* traverse(left);
    yield* traverse(right);
    
    setActiveNodes([nodeId]);
    const node = nodes.find(n => n.id === nodeId);
    output.push(node.value);
    setTraversalOutput([...output]);
    yield { finished: false };
  }
  
  setTraversalOutput([]);
  yield* traverse(rootId);
  setActiveNodes([]);
  yield { finished: true };
}
