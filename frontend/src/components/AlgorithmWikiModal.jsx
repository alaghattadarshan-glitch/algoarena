import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ChevronRight } from 'lucide-react';

const AlgorithmWikiModal = ({ title, sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id);

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <>
      {/* Floating Info Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          title={`Open ${title}`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Algorithm Wiki</span>
        </button>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl h-[85vh] bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Sidebar (Navigation) */}
              <div className="w-full md:w-64 border-r border-white/10 bg-black/40 flex flex-col h-1/3 md:h-full">
                <div className="p-4 border-b border-white/10 bg-white/5 shrink-0">
                  <h2 className="text-lg font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-white" />
                    Wiki
                  </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSectionId(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                        activeSectionId === section.id 
                          ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      <span className="font-bold tracking-wide text-sm">{section.name}</span>
                      {activeSectionId === section.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 flex flex-col h-2/3 md:h-full overflow-hidden relative">
                {/* Close Button Mobile/Desktop */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 hover:bg-white/10 text-gray-400 hover:text-white transition-colors backdrop-blur-md border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-8">
                  {activeSection && (
                    <motion.div
                      key={activeSection.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-4xl mx-auto"
                    >
                      {/* Header */}
                      <div className="mb-8">
                        <h1 className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${activeSection.colorGradient || 'from-white to-gray-400'} uppercase tracking-widest mb-2`}>
                          {activeSection.name}
                        </h1>
                      </div>

                      {/* AI Generated Diagram */}
                      <div className={`w-full rounded-2xl overflow-hidden border ${activeSection.borderColor || 'border-white/20'} shadow-[0_0_30px_rgba(255,255,255,0.05)] relative mb-8 group`}>
                        <img 
                          src={activeSection.imagePath} 
                          alt={activeSection.imageAlt} 
                          className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                      </div>

                      {/* Image Explanation */}
                      <div className={`bg-black/40 border ${activeSection.borderColor || 'border-white/10'} p-6 rounded-xl mb-8`}>
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                          <BookOpen className="w-5 h-5"/> Diagram Breakdown
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {activeSection.imageExplanation}
                        </p>
                      </div>

                      {/* Detailed Theory Info */}
                      <div className="prose prose-invert max-w-none text-gray-300">
                        {activeSection.detailedInfo}
                      </div>

                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AlgorithmWikiModal;
