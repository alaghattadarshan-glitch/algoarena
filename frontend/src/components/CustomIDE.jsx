import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { useRaceStore } from '../store/useRaceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const CustomIDE = () => {
  const { customCode, setCustomCode, algorithms } = useRaceStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!algorithms.includes('Custom Sort')) {
      useRaceStore.getState().toggleAlgorithm('Custom Sort');
    }
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-8 relative z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-[#00f3ff] border border-[#00f3ff]/50 px-4 py-2 rounded-lg bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 transition shadow-[0_0_15px_rgba(0,243,255,0.2)]"
      >
        <Terminal className="w-4 h-4" />
        {isOpen ? 'Close IDE' : 'Open Custom Code IDE (Player vs Machine)'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 glass-panel rounded-xl border border-[#00f3ff]/30 overflow-hidden"
          >
            <div className="bg-black/60 p-3 border-b border-white/10 flex justify-between items-center">
              <span className="text-gray-300 font-mono text-sm">Write a JavaScript Generator function. Must yield an object with {`{ arr, active, comparisons, swaps, sorted, line }`}</span>
              <button 
                onClick={handleSave}
                className="bg-green-500/20 text-green-400 px-4 py-1.5 rounded text-xs font-bold border border-green-500/50 hover:bg-green-500/30 transition shadow-[0_0_10px_rgba(74,222,128,0.3)]"
              >
                Inject into Arena
              </button>
            </div>
            <div className="p-4 bg-[#1e1e1e] font-mono text-sm max-h-[500px] overflow-y-auto">
              <Editor
                value={customCode}
                onValueChange={code => setCustomCode(code)}
                highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
                padding={15}
                style={{
                  fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                  fontSize: 14,
                  backgroundColor: 'transparent',
                  color: '#e2e8f0',
                  outline: 'none',
                  minHeight: '300px'
                }}
                textareaClassName="focus:outline-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomIDE;
