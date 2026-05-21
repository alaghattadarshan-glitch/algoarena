# AlgoArena - Algorithm Race Platform

AlgoArena is an advanced full-stack web application that allows users to visualize and race different algorithms (Sorting, Searching, Graph, DP) in real-time. It features a modern, premium cyberpunk UI with glassmorphism and neon gradients.

## Tech Stack
- **Frontend**: React + Vite, Tailwind CSS (v4), Framer Motion, Zustand, Socket.IO Client.
- **Backend**: Node.js, Express, MongoDB Atlas, Socket.IO.

## Features
- Real-time algorithm racing with visualizers.
- Stunning Premium UI (Neon gradients, glass panels, dark theme).
- Complete User Authentication System (JWT).
- Leaderboard & Statistics.
- Race Arena with customizable inputs & speed.

## Local Installation

1. **Clone the repository** (or navigate to directory):
   ```bash
   cd algoarena
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with your MONGO_URI, PORT=5000, and JWT_SECRET
   npm run dev # (requires nodemon, or use node server.js)
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Deployment Instructions

### Frontend (Vercel)
1. Push your code to GitHub.
2. Go to Vercel and create a new project.
3. Select the `frontend` folder as the Root Directory.
4. Vercel will automatically detect Vite. Click Deploy.

### Backend (Render/Railway)
1. Create a Web Service on Render/Railway.
2. Select the repository and set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).
6. Deploy.
