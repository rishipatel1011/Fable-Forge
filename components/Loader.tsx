
import React, { useState, useEffect } from 'react';
import { StoryStatus } from '../types';

const MESSAGES = [
  "Stoking the celestial fire...",
  "Heating the ink of destiny...",
  "Hammering out the narrative structure...",
  "Quenching the first chapter in cosmic light...",
  "Tempering the visuals...",
  "Engraving the details...",
  "Final polish on the legend..."
];

const Loader: React.FC<{ status: StoryStatus }> = ({ status }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-b-2 border-indigo-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,191,36,0.8)] animate-pulse"></div>
        </div>
      </div>
      
      <h3 className="text-2xl font-mythic mb-4 bg-gradient-to-r from-amber-300 to-indigo-300 bg-clip-text text-transparent">
        {status === StoryStatus.GENERATING_TEXT ? "Forging Narrative" : "Illustrating Myth"}
      </h3>
      
      <p className="text-slate-500 font-story italic text-lg animate-pulse transition-all duration-500">
        {MESSAGES[msgIndex]}
      </p>

      <div className="mt-8 w-64 h-1 bg-slate-900 rounded-full overflow-hidden">
        <div className={`h-full bg-amber-500 transition-all duration-1000 ease-out ${status === StoryStatus.GENERATING_TEXT ? 'w-1/3' : 'w-2/3'}`}></div>
      </div>
    </div>
  );
};

export default Loader;
