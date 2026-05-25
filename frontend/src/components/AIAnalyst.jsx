import React from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { generateCommentary } from '../utils/aiCommentary';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const AIAnalyst = () => {
  const { metrics, winner, raceStatus, arraySize, arrayType } = useRaceStore();

  if (raceStatus !== 'finished' || !winner) return null;

  const commentary = generateCommentary(metrics, winner, arraySize, arrayType);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl w-full max-w-7xl mx-auto mb-8 border border-[#9d00ff]/30 shadow-[0_0_30px_rgba(157,0,255,0.15)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f3ff] to-[#9d00ff]"></div>
      
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-[#9d00ff]/20 border border-[#9d00ff]/50 shrink-0 shadow-[0_0_15px_rgba(157,0,255,0.4)]">
          <Bot className="w-8 h-8 text-[#00f3ff]" />
        </div>
        
        <div>
          <h3 className="text-[#00f3ff] font-bold text-lg mb-1 flex items-center gap-2 tracking-wider">
            AI RACE ANALYST
            <span className="text-[10px] bg-[#9d00ff]/30 text-[#9d00ff] px-2 py-0.5 rounded border border-[#9d00ff]/50 animate-pulse">LIVE</span>
          </h3>
          
          <div className="text-gray-300 text-sm leading-relaxed mt-2 font-mono" dangerouslySetInnerHTML={{ __html: commentary.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-bold">$1</span>') }} />
        </div>
      </div>
    </motion.div>
  );
};

export default AIAnalyst;
