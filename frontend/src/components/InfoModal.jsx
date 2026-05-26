import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, BookOpen, Cpu, Globe2, Lightbulb } from 'lucide-react';

const InfoModal = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Info Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md shadow-lg"
          title={`Learn about ${title}`}
        >
          <Info className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Learn More</span>
        </button>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-white" />
                  {title}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content (Scrollable) */}
              <div className="p-6 overflow-y-auto text-gray-300 space-y-6 text-sm leading-relaxed custom-scrollbar">
                {content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InfoModal;
