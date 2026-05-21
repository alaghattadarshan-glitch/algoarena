const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();

// Connect Database (mocked out in dummy run if no mongodb instance)
// connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const algoRoutes = require('./routes/algoRoutes');
const raceRoutes = require('./routes/raceRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/algos', algoRoutes);
app.use('/api/races', raceRoutes);

app.get('/', (req, res) => {
  res.send('AlgoArena API is running');
});

// Socket.IO Logic for Real-Time Race
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('start-race', (data) => {
    // Simulate real-time progress for algorithms
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      io.emit('race-progress', { progress, algorithms: data.algorithms });
      if (progress >= 100) {
        clearInterval(interval);
        io.emit('race-complete', { winner: data.algorithms[Math.floor(Math.random()*data.algorithms.length)] });
      }
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
