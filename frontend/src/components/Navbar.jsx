import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass-panel border-b border-white/10 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider text-white">
          ALGO<span className="text-[#00f3ff] neon-text-blue">ARENA</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/arena" className="text-gray-300 hover:text-white transition-colors">Race Arena</Link>
          <Link to="/algorithms" className="text-gray-300 hover:text-white transition-colors">Encyclopedia</Link>
          <Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</Link>
          <Link to="/login" className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            Login
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
