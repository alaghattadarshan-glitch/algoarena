import React, { useEffect, useRef, useState } from 'react';
import { Settings, X, RefreshCw, Sliders, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLOR_PRESETS = {
  sorting: {
    name: 'Cyber Cyan (Sorting)',
    birth: 'rgba(0, 243, 255, 1)',
    rgb: [0, 243, 255]
  },
  graph: {
    name: 'Hyper Purple (Pathfinding)',
    birth: 'rgba(157, 0, 255, 1)',
    rgb: [157, 0, 255]
  },
  tree: {
    name: 'Neon Pink (Tree Arena)',
    birth: 'rgba(255, 0, 128, 1)',
    rgb: [255, 0, 128]
  },
  matrix: {
    name: 'Matrix Green',
    birth: 'rgba(0, 255, 100, 1)',
    rgb: [0, 255, 100]
  },
  solar: {
    name: 'Solar Orange',
    birth: 'rgba(255, 110, 0, 1)',
    rgb: [255, 110, 0]
  }
};

const ParticleBackground = ({ arenaMode }) => {
  const canvasRef = useRef(null);
  
  // Customization settings
  const [showSettings, setShowSettings] = useState(false);
  const [connectionMode, setConnectionMode] = useState('globe'); // globe, constellation, nebula
  const [globeRadius, setGlobeRadius] = useState(200);           // Radius of the 3D sphere
  const [nodeCount, setNodeCount] = useState(90);                // Quantity of nodes on sphere
  const [neuralCount, setNeuralCount] = useState(300);           // Quantity of background neural network nodes (200 to 400)
  const [linkDistance, setLinkDistance] = useState(150);         // Constellation linking distance
  const [velocity, setVelocity] = useState(0.8);                 // Drift speed multiplier
  const [nodeSize, setNodeSize] = useState(2.2);                 // Node size
  const [rotationSpeed, setRotationSpeed] = useState(1.0);       // Globe spin speed
  const [cameraSway, setCameraSway] = useState(1.0);             // Mouse sway intensity
  const [interactiveMode, setInteractiveMode] = useState('Connect'); // Connect, Attract, Repel, Off
  const [colorPreset, setColorPreset] = useState('sorting');

  const mouseRef = useRef({ x: 0, y: 0, active: false, clickDown: false });
  
  // 3D rotation tracking
  const angleYRef = useRef(0);
  const angleXRef = useRef(0);

  // Particle sets
  const spherePointsRef = useRef([]);
  const outerSpherePointsRef = useRef([]);
  const ringPointsRef = useRef({ equator: [], polarY: [], polarX: [] });
  const neuralClustersRef = useRef([]);
  const constellationRef = useRef([]); // Free float particles (constellation mode)

  // Handle active arena-specific overrides dynamically
  useEffect(() => {
    if (arenaMode === 'sorting') {
      setColorPreset('sorting');
    } else if (arenaMode === 'graph') {
      setColorPreset('graph');
    } else if (arenaMode === 'tree') {
      setColorPreset('tree');
    }
  }, [arenaMode]);

  // Handle canvas resize and auto-scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Responsive auto-radius sizing for the 3D globe
      const minDim = Math.min(window.innerWidth, window.innerHeight);
      const targetRadius = Math.max(120, Math.min(240, minDim * 0.23));
      setGlobeRadius(targetRadius);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleMouseDown = () => { mouseRef.current.clickDown = true; };
    const handleMouseUp = () => { mouseRef.current.clickDown = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Math helper functions for 3D rotations
  const rotateY = (x, y, z, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos - z * sin,
      y: y,
      z: x * sin + z * cos
    };
  };

  const rotateX = (x, y, z, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x,
      y: y * cos - z * sin,
      z: y * sin + z * cos
    };
  };

  // Generate uniformly distributed points on a sphere using Fibonacci grid
  const generateSpherePoints = (count, r) => {
    const points = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * (1 - 1 / goldenRatio);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = Math.sin(inclination) * Math.cos(azimuth) * r;
      const y = Math.sin(inclination) * Math.sin(azimuth) * r;
      const z = Math.cos(inclination) * r;

      points.push({
        x, y, z,
        size: Math.random() * (nodeSize * 1.3 - nodeSize * 0.7) + nodeSize * 0.7,
        connections: [],
        opacity: 0
      });
    }

    // Calculate nearest neighbors for wireframe grid (3 closest)
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const dists = [];
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const p2 = points[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const d = dx*dx + dy*dy + dz*dz;
        dists.push({ index: j, dist: d });
      }
      dists.sort((a, b) => a.dist - b.dist);
      p1.connections = dists.slice(0, 3).map(d => d.index);
    }

    return points;
  };

  // Generate outer concentric sphere shell
  const generateOuterSpherePoints = (count, r) => {
    const points = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * (1 - 1 / goldenRatio);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = Math.sin(inclination) * Math.cos(azimuth) * r;
      const y = Math.sin(inclination) * Math.sin(azimuth) * r;
      const z = Math.cos(inclination) * r;

      points.push({
        x, y, z,
        size: Math.random() * 1.2 + 0.8,
        connections: [],
        opacity: 0
      });
    }

    // Calculate nearest neighbors for outer shell grid (2 closest)
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const dists = [];
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const p2 = points[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const d = dx*dx + dy*dy + dz*dz;
        dists.push({ index: j, dist: d });
      }
      dists.sort((a, b) => a.dist - b.dist);
      p1.connections = dists.slice(0, 2).map(d => d.index);
    }

    return points;
  };

  // Generate 3D ring segments for orbital lines
  const generateRingPoints = (r, axis) => {
    const points = [];
    const segments = 36;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      let x = 0, y = 0, z = 0;
      if (axis === 'equator') {
        x = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
      } else if (axis === 'polarY') {
        x = Math.cos(angle) * r;
        y = Math.sin(angle) * r;
      } else if (axis === 'polarX') {
        y = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
      }
      points.push({ x, y, z });
    }
    return points;
  };

  // Generate O(N) O-shaped 3D Neural Networks/Clusters scattered in empty space
  const generateNeuralClusters = (totalNodes, r) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const nodesPerCluster = 8;
    const numClusters = Math.max(2, Math.floor(totalNodes / nodesPerCluster));
    const clusters = [];
    
    for (let c = 0; c < numClusters; c++) {
      // Find coordinates in empty space (distribute away from center globe)
      let cx = 0, cy = 0, cz = 0;
      let dist = 0;
      let attempts = 0;
      
      do {
        cx = (Math.random() - 0.5) * w * 1.5;
        cy = (Math.random() - 0.5) * h * 1.5;
        cz = (Math.random() - 0.5) * 600;
        dist = Math.sqrt(cx*cx + cy*cy + cz*cz);
        attempts++;
      } while (dist < r * 1.55 && attempts < 100);
      
      const nodes = [];
      for (let i = 0; i < nodesPerCluster; i++) {
        // Generate offsets on a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const d = Math.random() * 45 + 15; // cluster radius between 15 and 60px
        
        const dx = d * Math.sin(phi) * Math.cos(theta);
        const dy = d * Math.sin(phi) * Math.sin(theta);
        const dz = d * Math.cos(phi);
        
        nodes.push({
          dx, dy, dz,
          size: Math.random() * 1.25 + 0.6,
          opacity: Math.random() * 0.55 + 0.2, // faint background nodes
          pulseOffset: Math.random() * Math.PI * 2,
          connections: []
        });
      }
      
      // Calculate connections within this cluster (nearest 2 neighbors)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        const dists = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const n2 = nodes[j];
          const ldx = n1.dx - n2.dx;
          const ldy = n1.dy - n2.dy;
          const ldz = n1.dz - n2.dz;
          const ld = ldx*ldx + ldy*ldy + ldz*ldz;
          dists.push({ index: j, dist: ld });
        }
        dists.sort((a, b) => a.dist - b.dist);
        n1.connections = dists.slice(0, 2).map(d => d.index);
      }
      
      clusters.push({
        cx, cy, cz,
        cvx: (Math.random() - 0.5) * 0.3 * velocity,
        cvy: (Math.random() - 0.5) * 0.3 * velocity,
        cvz: (Math.random() - 0.5) * 0.3 * velocity,
        nodes
      });
    }
    
    return clusters;
  };

  // Generate / update components when parameters adjust
  useEffect(() => {
    if (connectionMode === 'globe') {
      spherePointsRef.current = generateSpherePoints(nodeCount, globeRadius);
      outerSpherePointsRef.current = generateOuterSpherePoints(Math.floor(nodeCount / 2), globeRadius * 1.35);
      ringPointsRef.current = {
        equator: generateRingPoints(globeRadius, 'equator'),
        polarY: generateRingPoints(globeRadius, 'polarY'),
        polarX: generateRingPoints(globeRadius, 'polarX')
      };
      neuralClustersRef.current = generateNeuralClusters(neuralCount, globeRadius);
    }
  }, [nodeCount, globeRadius, connectionMode, velocity, nodeSize, neuralCount]);

  // Main simulation and rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const perspective = 500; // Focal perspective depth

    // Initialize free float particles (constellation mode)
    const initFreeParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const spreadX = w * 1.3;
      const spreadY = h * 1.3;
      const spreadZ = 500;
      
      let pts = [];
      for (let i = 0; i < nodeCount; i++) {
        pts.push({
          x: (Math.random() - 0.5) * spreadX,
          y: (Math.random() - 0.5) * spreadY,
          z: (Math.random() - 0.5) * spreadZ,
          vx: (Math.random() - 0.5) * 1.2 * velocity,
          vy: (Math.random() - 0.5) * 1.2 * velocity,
          vz: (Math.random() - 0.5) * 1.2 * velocity,
          size: Math.random() * (nodeSize * 1.4 - nodeSize * 0.6) + nodeSize * 0.6,
          opacity: 1
        });
      }
      constellationRef.current = pts;
    };

    if (connectionMode !== 'globe') {
      initFreeParticles();
    }

    const updateAndDraw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const centerX = w / 2;
      const centerY = h / 2;

      // Background clearing
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      // Ambient radial gradient
      const activePreset = COLOR_PRESETS[colorPreset] || COLOR_PRESETS.sorting;
      const [r, g, b] = activePreset.rgb;
      
      const ambientGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, Math.max(w, h) * 0.8);
      ambientGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.05)`);
      ambientGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, w, h);

      // Camera mouse sway angle calculations
      const screenCenterX = w / 2;
      const screenCenterY = h / 2;
      const camAngleY = (mouseRef.current.active ? ((mouseRef.current.x - screenCenterX) / screenCenterX) * 0.35 : 0) * cameraSway;
      const camAngleX = (mouseRef.current.active ? ((mouseRef.current.y - screenCenterY) / screenCenterY) * 0.35 : 0) * cameraSway;

      const cosCY = Math.cos(camAngleY);
      const sinCY = Math.sin(camAngleY);
      const cosCX = Math.cos(camAngleX);
      const sinCX = Math.sin(camAngleX);

      // RENDER MODE: 3D Connected Globe / Sphere
      if (connectionMode === 'globe') {
        // Increment continuous automatic spin rotations
        angleYRef.current += 0.0025 * rotationSpeed;
        angleXRef.current += 0.0008 * rotationSpeed;

        const spinY = angleYRef.current;
        const spinX = angleXRef.current;
        
        const cosSY = Math.cos(spinY);
        const sinSY = Math.sin(spinY);
        const cosSX = Math.cos(spinX);
        const sinSX = Math.sin(spinX);

        // helper to transform and project 3D points
        const projectPoint = (pt) => {
          // 1. Sphere spin rotation
          // Rotate Y
          let x1 = pt.x * cosSY - pt.z * sinSY;
          let z1 = pt.x * sinSY + pt.z * cosSY;
          // Rotate X
          let y1 = pt.y * cosSX - z1 * sinSX;
          let z2 = pt.y * sinSX + z1 * cosSX;

          // 2. Camera sway rotation
          // Rotate Y
          let x2 = x1 * cosCY - z2 * sinCY;
          let z3 = x1 * sinCY + z2 * cosCY;
          // Rotate X
          let y2 = y1 * cosCX - z3 * sinCX;
          let z_final = y1 * sinCX + z3 * cosCX;

          // Perspective projection
          const scale = perspective / (perspective + z_final);
          const projX = centerX + x2 * scale;
          const projY = centerY + y2 * scale;
          
          return {
            projX,
            projY,
            scale,
            z_final,
            projR: Math.max(0.1, pt.size * scale)
          };
        };

        // Project inner and outer shell coordinates
        const innerNodes = spherePointsRef.current;
        const outerNodes = outerSpherePointsRef.current;

        for (let p of innerNodes) {
          const proj = projectPoint(p);
          Object.assign(p, proj);
          if (p.opacity < 1) p.opacity += 0.02;
          p.projOpacity = p.opacity * Math.max(0.1, (perspective + p.z_final) / (perspective + globeRadius));
        }

        for (let p of outerNodes) {
          const proj = projectPoint(p);
          Object.assign(p, proj);
          if (p.opacity < 1) p.opacity += 0.02;
          p.projOpacity = p.opacity * Math.max(0.05, (perspective + p.z_final) / (perspective + globeRadius * 1.35));
        }

        // Draw Rings (Equator and Poles)
        const rings = ringPointsRef.current;
        const drawRing = (ringPts) => {
          const projectedRing = ringPts.map(pt => projectPoint({ ...pt, size: 1 }));
          
          for (let i = 0; i < projectedRing.length - 1; i++) {
            const p1 = projectedRing[i];
            const p2 = projectedRing[i + 1];
            
            // Fades ring visibility at the back
            const z_avg = (p1.z_final + p2.z_final) / 2;
            const alpha = (1 - z_avg / (globeRadius * 1.5)) * 0.14;
            
            if (alpha > 0) {
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.lineWidth = 0.8 * Math.min(p1.scale, p2.scale);
              ctx.beginPath();
              ctx.moveTo(p1.projX, p1.projY);
              ctx.lineTo(p2.projX, p2.projY);
              ctx.stroke();
            }
          }
        };

        drawRing(rings.equator);
        drawRing(rings.polarY);
        drawRing(rings.polarX);

        // Draw Inner Sphere wireframe grid links
        for (let i = 0; i < innerNodes.length; i++) {
          const p1 = innerNodes[i];
          if (p1.projOpacity <= 0.05) continue;
          
          for (let idx of p1.connections) {
            const p2 = innerNodes[idx];
            if (p2.projOpacity <= 0.05) continue;
            
            const alpha = 0.12 * Math.min(p1.projOpacity, p2.projOpacity);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 0.8 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }

        // Draw Outer Sphere wireframe links
        for (let i = 0; i < outerNodes.length; i++) {
          const p1 = outerNodes[i];
          if (p1.projOpacity <= 0.05) continue;
          
          for (let idx of p1.connections) {
            const p2 = outerNodes[idx];
            if (p2.projOpacity <= 0.05) continue;
            
            const alpha = 0.07 * Math.min(p1.projOpacity, p2.projOpacity);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 0.5 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }

        // Draw Inner & Outer Sphere nodes
        const drawNodeSet = (nodes, glowMultiplier = 3.5, opacityFactor = 0.85) => {
          for (let p of nodes) {
            if (p.projOpacity <= 0.05) continue;

            // Core dot
            ctx.beginPath();
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacityFactor * p.projOpacity})`;
            ctx.arc(p.projX, p.projY, p.projR, 0, Math.PI * 2);
            ctx.fill();

            // Glow shell
            ctx.beginPath();
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.11 * p.projOpacity})`;
            ctx.arc(p.projX, p.projY, p.projR * glowMultiplier, 0, Math.PI * 2);
            ctx.fill();
          }
        };

        drawNodeSet(innerNodes, 3.5, 0.85);
        drawNodeSet(outerNodes, 2.5, 0.65);

        // Update and render O(N) 3D Neural Networks/Clusters scattered in empty space
        const clusters = neuralClustersRef.current;
        const timePulse = Date.now() * 0.0015;
        
        for (let c of clusters) {
          // Drifting physics for cluster center
          c.cx += c.cvx;
          c.cy += c.cvy;
          c.cz += c.cvz;

          // Box bounds check for cluster center (covering background area)
          const boundX = w * 1.25;
          const boundY = h * 1.25;
          const boundZ = 400;
          if (Math.abs(c.cx) > boundX) { c.cvx = -c.cvx; c.cx = Math.sign(c.cx) * boundX; }
          if (Math.abs(c.cy) > boundY) { c.cvy = -c.cvy; c.cy = Math.sign(c.cy) * boundY; }
          if (Math.abs(c.cz) > boundZ) { c.cvz = -c.cvz; c.cz = Math.sign(c.cz) * boundZ; }

          // Project nodes inside this cluster
          for (let n of c.nodes) {
            // Apply a tiny micro-wobble oscillation
            const wobbleX = n.dx + Math.sin(timePulse + n.pulseOffset) * 2;
            const wobbleY = n.dy + Math.cos(timePulse * 0.85 + n.pulseOffset) * 2;
            const wobbleZ = n.dz + Math.sin(timePulse * 1.2 + n.pulseOffset) * 2;

            const gx = c.cx + wobbleX;
            const gy = c.cy + wobbleY;
            const gz = c.cz + wobbleZ;

            // Camera mouse sway rotation
            const x_cam = gx * cosCY - gz * sinCY;
            const z_cam = gx * sinCY + gz * cosCY;
            const y_cam = gy * cosCX - z_cam * sinCX;
            const z_final = gy * sinCX + z_cam * cosCX;

            const scale = perspective / (perspective + z_final);
            n.projX = centerX + x_cam * scale;
            n.projY = centerY + y_cam * scale;
            n.scale = scale;
            n.projR = Math.max(0.1, n.size * scale);

            const depthOpacity = Math.max(0.02, Math.min(1.0, (perspective + z_final) / 600));
            n.projOpacity = n.opacity * depthOpacity;
          }

          // Draw cluster connections
          for (let i = 0; i < c.nodes.length; i++) {
            const n1 = c.nodes[i];
            if (n1.projOpacity <= 0.05) continue;

            for (let idx of n1.connections) {
              const n2 = c.nodes[idx];
              if (n2.projOpacity <= 0.05) continue;

              const alpha = 0.09 * Math.min(n1.projOpacity, n2.projOpacity);
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.lineWidth = 0.5 * Math.min(n1.scale, n2.scale);
              ctx.beginPath();
              ctx.moveTo(n1.projX, n1.projY);
              ctx.lineTo(n2.projX, n2.projY);
              ctx.stroke();
            }
          }

          // Draw cluster nodes (neuron nuclei)
          for (let n of c.nodes) {
            if (n.projOpacity <= 0.05) continue;

            ctx.beginPath();
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.72 * n.projOpacity})`;
            ctx.arc(n.projX, n.projY, n.projR, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.1 * n.projOpacity})`;
            ctx.arc(n.projX, n.projY, n.projR * 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Mouse connector drawing to floating neural nodes
            if (interactiveMode === 'Connect' && mouseRef.current.active) {
              const dx = n.projX - mouseRef.current.x;
              const dy = n.projY - mouseRef.current.y;
              const dist2D = Math.sqrt(dx*dx + dy*dy);
              
              if (dist2D < 130) {
                const lineAlpha = (1 - dist2D / 130) * 0.18 * n.projOpacity;
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineAlpha})`;
                ctx.lineWidth = 0.45 * n.scale;
                ctx.beginPath();
                ctx.moveTo(n.projX, n.projY);
                ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                ctx.stroke();
              }
            }
          }
        }
      } 
      // RENDER MODE: Standard 3D Constellation / Grid Network
      else {
        const particles = constellationRef.current;
        const spreadX = w * 1.3;
        const spreadY = h * 1.3;
        const spreadZ = 500;

        const cosCY = Math.cos(camAngleY);
        const sinCY = Math.sin(camAngleY);
        const cosCX = Math.cos(camAngleX);
        const sinCX = Math.sin(camAngleX);

        // Update coordinates
        for (let p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Bounce limits
          if (Math.abs(p.x) > spreadX / 2) { p.vx = -p.vx; p.x = Math.sign(p.x) * (spreadX / 2); }
          if (Math.abs(p.y) > spreadY / 2) { p.vy = -p.vy; p.y = Math.sign(p.y) * (spreadY / 2); }
          if (Math.abs(p.z) > spreadZ / 2) { p.vz = -p.vz; p.z = Math.sign(p.z) * (spreadZ / 2); }

          // Projection
          const x1 = p.x * cosCY - p.z * sinCY;
          const z1 = p.x * sinCY + p.z * cosCY;
          const y1 = p.y * cosCX - z1 * sinCX;
          const z_final = p.y * sinCX + z1 * cosCX;

          const scale = perspective / (perspective + z_final);
          p.projX = centerX + x1 * scale;
          p.projY = centerY + y1 * scale;
          p.scale = scale;
          p.projR = Math.max(0.1, p.size * scale);
          
          const depthOpacity = Math.max(0.05, Math.min(1.0, (perspective + z_final) / 350));
          p.projOpacity = depthOpacity * p.opacity;
        }

        // Draw connections
        if (connectionMode === 'constellation') {
          const threshold = linkDistance;
          for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            if (p1.projOpacity <= 0.05) continue;
            
            for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              if (p2.projOpacity <= 0.05) continue;

              const dx = p1.x - p2.x;
              if (Math.abs(dx) > threshold) continue;
              
              const dy = p1.y - p2.y;
              if (Math.abs(dy) > threshold) continue;
              
              const dz = p1.z - p2.z;
              if (Math.abs(dz) > threshold) continue;

              const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
              if (dist < threshold) {
                const alpha = (1 - dist / threshold) * 0.16 * Math.min(p1.projOpacity, p2.projOpacity);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.lineWidth = 0.85 * Math.min(p1.scale, p2.scale);
                ctx.beginPath();
                ctx.moveTo(p1.projX, p1.projY);
                ctx.lineTo(p2.projX, p2.projY);
                ctx.stroke();
              }
            }
          }
        }

        // Render nodes
        for (let p of particles) {
          if (p.projOpacity <= 0.05) continue;

          ctx.beginPath();
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.85 * p.projOpacity})`;
          ctx.arc(p.projX, p.projY, p.projR, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.12 * p.projOpacity})`;
          ctx.arc(p.projX, p.projY, p.projR * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [nodeCount, globeRadius, linkDistance, velocity, nodeSize, rotationSpeed, cameraSway, connectionMode, interactiveMode, colorPreset, neuralCount]);

  const handleReset = () => {
    setGlobeRadius(200);
    setNodeCount(90);
    setNeuralCount(300);
    setLinkDistance(150);
    setVelocity(0.8);
    setNodeSize(2.2);
    setRotationSpeed(1.0);
    setCameraSway(1.0);
    setConnectionMode('globe');
    setInteractiveMode('Connect');

    if (arenaMode === 'sorting') setColorPreset('sorting');
    else if (arenaMode === 'graph') setColorPreset('graph');
    else if (arenaMode === 'tree') setColorPreset('tree');
  };

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ 
          background: '#0a0a0a', 
          width: '100vw', 
          height: '100vh', 
          imageRendering: 'auto' 
        }}
      />

      {/* Floating config panel triggers */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 30 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-3.5 bg-black/60 border border-white/10 hover:border-[#00f3ff]/50 text-white rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(0,243,255,0.25)] flex items-center justify-center pointer-events-auto cursor-pointer"
        >
          {showSettings ? <X className="w-5 h-5 text-[#00f3ff]" /> : <Globe className="w-5 h-5 text-[#9d00ff]" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-24 right-6 w-80 bg-black/85 border border-[#9d00ff]/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(157,0,255,0.3)] backdrop-blur-lg z-50 pointer-events-auto text-xs"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00f3ff]" />
                <h4 className="font-black tracking-widest text-[#00f3ff] uppercase text-sm">Constellation UI</h4>
              </div>
              <button 
                onClick={handleReset}
                title="Reset Parameters"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Network Rendering Style */}
              <div>
                <span className="text-gray-400 block mb-1 font-mono">Rendering Mode</span>
                <div className="grid grid-cols-3 gap-1">
                  {['globe', 'constellation', 'nebula'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setConnectionMode(mode)}
                      className={`py-1 rounded text-[10px] font-bold uppercase transition ${connectionMode === mode ? 'bg-[#9d00ff] text-white shadow-[0_0_8px_#9d00ff]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Node Quantity */}
              <div>
                <div className="flex justify-between text-gray-400 mb-1 font-mono">
                  <span>{connectionMode === 'globe' ? 'Sphere Node Qty' : 'Node Quantity'}</span>
                  <span className="text-[#00f3ff]">{nodeCount}</span>
                </div>
                <input 
                  type="range" min="30" max="150" value={nodeCount}
                  onChange={(e) => setNodeCount(Number(e.target.value))}
                  className="w-full accent-[#00f3ff] bg-gray-800 rounded-lg appearance-none h-1"
                />
              </div>

              {/* Globe Specific: Globe Radius & Neural Count */}
              {connectionMode === 'globe' && (
                <>
                  <div>
                    <div className="flex justify-between text-gray-400 mb-1 font-mono">
                      <span>Globe Radius</span>
                      <span className="text-yellow-500">{globeRadius}px</span>
                    </div>
                    <input 
                      type="range" min="100" max="320" value={globeRadius}
                      onChange={(e) => setGlobeRadius(Number(e.target.value))}
                      className="w-full accent-yellow-500 bg-gray-800 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400 mb-1 font-mono">
                      <span>Neural Net Nodes</span>
                      <span className="text-orange-400">{neuralCount}</span>
                    </div>
                    <input 
                      type="range" min="160" max="400" step="16" value={neuralCount}
                      onChange={(e) => setNeuralCount(Number(e.target.value))}
                      className="w-full accent-orange-400 bg-gray-800 rounded-lg appearance-none h-1"
                    />
                  </div>
                </>
              )}

              {/* Constellation Specific: Link Distance */}
              {connectionMode === 'constellation' && (
                <div>
                  <div className="flex justify-between text-gray-400 mb-1 font-mono">
                    <span>Link Distance (3D)</span>
                    <span className="text-[#9d00ff]">{linkDistance}</span>
                  </div>
                  <input 
                    type="range" min="80" max="240" value={linkDistance}
                    onChange={(e) => setLinkDistance(Number(e.target.value))}
                    className="w-full accent-[#9d00ff] bg-gray-800 rounded-lg appearance-none h-1"
                  />
                </div>
              )}

              {/* Globe Specific: Spin Speed */}
              {connectionMode === 'globe' && (
                <div>
                  <div className="flex justify-between text-gray-400 mb-1 font-mono">
                    <span>Sphere Spin Speed</span>
                    <span className="text-[#9d00ff]">{rotationSpeed.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="0.0" max="3.0" step="0.2" value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(Number(e.target.value))}
                    className="w-full accent-[#9d00ff] bg-gray-800 rounded-lg appearance-none h-1"
                  />
                </div>
              )}

              {/* Drift Velocity / Float Speed */}
              <div>
                <div className="flex justify-between text-gray-400 mb-1 font-mono">
                  <span>{connectionMode === 'globe' ? 'Neural Net Drift' : 'Float Speed'}</span>
                  <span className="text-[#ff0080]">{velocity.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.1" max="2.5" step="0.1" value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full accent-[#ff0080] bg-gray-800 rounded-lg appearance-none h-1"
                />
              </div>

              {/* Node Size */}
              <div>
                <div className="flex justify-between text-gray-400 mb-1 font-mono">
                  <span>Node Radius</span>
                  <span className="text-yellow-500">{nodeSize.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.8" max="5.0" step="0.2" value={nodeSize}
                  onChange={(e) => setNodeSize(Number(e.target.value))}
                  className="w-full accent-yellow-500 bg-gray-800 rounded-lg appearance-none h-1"
                />
              </div>

              {/* Camera Sway (Mouse sway multiplier) */}
              <div>
                <div className="flex justify-between text-gray-400 mb-1 font-mono">
                  <span>3D Camera Sway</span>
                  <span className="text-green-400">{cameraSway.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.0" max="3.0" step="0.2" value={cameraSway}
                  onChange={(e) => setCameraSway(Number(e.target.value))}
                  className="w-full accent-green-400 bg-gray-800 rounded-lg appearance-none h-1"
                />
              </div>

              {/* Color Map Presets */}
              <div>
                <span className="text-gray-400 block mb-1 font-mono">Color Theme Override</span>
                <div className="grid grid-cols-5 gap-1">
                  {Object.keys(COLOR_PRESETS).map((p) => (
                    <button
                      key={p}
                      onClick={() => setColorPreset(p)}
                      title={COLOR_PRESETS[p].name}
                      className={`py-1 rounded text-[8px] font-bold uppercase transition ${colorPreset === p ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Emitter Toggle */}
              <div>
                <span className="text-gray-400 block mb-1 font-mono">Mouse Interaction Mode</span>
                <div className="grid grid-cols-4 gap-1">
                  {['Connect', 'Attract', 'Repel', 'Off'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setInteractiveMode(mode)}
                      className={`py-1 rounded text-[9px] font-bold uppercase transition ${interactiveMode === mode ? 'bg-[#00f3ff] text-black shadow-[0_0_8px_#00f3ff]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[9px] text-gray-500 text-center italic font-mono pt-2 border-t border-white/5">
                {interactiveMode === 'Connect' && 'Hover to form lines. Click & hold to attract.'}
                {interactiveMode === 'Attract' && 'Nodes gravitate to mouse position.'}
                {interactiveMode === 'Repel' && 'Nodes disperse away from mouse.'}
                {interactiveMode === 'Off' && 'Mouse interaction is disabled.'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ParticleBackground;
