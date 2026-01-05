
import React from 'react';
import { Story } from '../types';
import ChapterCard from './ChapterCard';

interface StoryDisplayProps {
  story: Story;
  onBack: () => void;
  isGenerating?: boolean;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, onBack, isGenerating }) => {
  const firstImage = story.chapters[0]?.imageUrl;

  return (
    <div className="space-y-24">
      {/* Cinematic Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] w-full rounded-[3rem] overflow-hidden group shadow-2xl">
        {/* Background Layer */}
        {firstImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40 transition-transform duration-10000 group-hover:scale-100"
            style={{ backgroundImage: `url(${firstImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950"></div>
        
        {/* Content Layer */}
        <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <button 
                onClick={onBack}
                className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white group/back"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>

            <div className="space-y-6 max-w-4xl">
                <div className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.6em] text-amber-500 uppercase">
                    <span className="w-12 h-px bg-amber-500/50"></span>
                    {story.genre} Forge-Work
                    <span className="w-12 h-px bg-amber-500/50"></span>
                </div>
                
                <h2 className="text-6xl md:text-8xl font-mythic leading-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent drop-shadow-2xl">
                    {story.title}
                </h2>
                
                <p className="text-xl md:text-2xl font-story italic text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    "{story.summary}"
                </p>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce opacity-50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Descend into Legend</span>
                <div className="w-px h-12 bg-gradient-to-b from-slate-400 to-transparent"></div>
            </div>
        </div>

        {/* Progress bar if generating */}
        {isGenerating && (
           <div className="absolute bottom-0 left-0 h-1 bg-amber-500/50 animate-pulse transition-all" style={{ width: '100%' }}></div>
        )}
      </div>

      <div className="max-w-5xl mx-auto space-y-32">
        {story.chapters.map((chapter, index) => (
          <ChapterCard 
            key={chapter.id} 
            chapter={chapter} 
            index={index} 
          />
        ))}
      </div>

      <div className="py-32 text-center">
        <div className="relative inline-block px-12 py-6 group">
            <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex flex-col items-center gap-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                <p className="text-slate-500 font-mythic tracking-[0.8em] text-sm uppercase">Finitum</p>
                <button 
                onClick={onBack}
                className="px-12 py-4 bg-slate-900/50 border border-slate-700 hover:border-amber-500 rounded-full text-slate-400 hover:text-white transition-all font-mythic tracking-[0.3em] uppercase text-xs"
                >
                Forge New Legend
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
