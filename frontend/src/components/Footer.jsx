import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 glass-panel py-6 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} AlgoArena - Advanced Algorithm Race Platform. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
