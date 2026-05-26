import React from 'react';
import { useTreeStore } from '../store/useTreeStore';
import { motion } from 'framer-motion';

const TreeVisualizer = () => {
  const { nodes, edges, activeNodes } = useTreeStore();

  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" className="w-full h-full">
      {/* Draw Edges */}
      {edges.map((edge, i) => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return null;
        
        const isActiveEdge = activeNodes.includes(edge.from) && activeNodes.includes(edge.to);
        
        return (
          <motion.line 
            key={`edge-${i}`}
            x1={fromNode.x} y1={fromNode.y}
            x2={toNode.x} y2={toNode.y}
            stroke={isActiveEdge ? '#ff0080' : 'rgba(255, 255, 255, 0.2)'}
            strokeWidth={isActiveEdge ? 3 : 2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}

      {/* Draw Nodes */}
      {nodes.map(node => {
        const isActive = activeNodes.includes(node.id);
        
        return (
          <motion.g 
            key={node.id} 
            initial={{ x: 400, y: 0, opacity: 0 }}
            animate={{ x: node.x, y: node.y, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.circle 
              r="22"
              animate={{ 
                fill: isActive ? '#ff0080' : '#111',
                stroke: isActive ? '#fff' : '#ff0080',
                scale: isActive ? 1.2 : 1
              }}
              transition={{ duration: 0.2 }}
              strokeWidth="2"
              className={isActive ? "drop-shadow-[0_0_20px_rgba(255,0,128,0.8)]" : "drop-shadow-[0_0_10px_rgba(255,0,128,0.3)]"}
            />
            <text 
              textAnchor="middle" 
              dy=".3em" 
              fill={isActive ? 'white' : '#ffb3d9'}
              className="text-sm font-black font-mono pointer-events-none"
            >
              {node.value}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
};

export default TreeVisualizer;
