
import React from 'react';
import { Story } from '../types';
import ChapterCard from './ChapterCard';

interface StoryDisplayProps {
  story: Story;
  onBack: () => void;
  isGenerating?: boolean;
  selectedVoice?: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, onBack, isGenerating, selectedVoice = 'Kore' }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 animate-page">
      <div className="mb-24 flex items-center justify-between">
         <button onClick={onBack} className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span className="text-xs font-bold uppercase tracking-widest">Exit Archive</span>
         </button>
         <div className="text-[10px] font-bold text-zinc-500 tracking-[0.4em] uppercase">Manuscript ID: {story.id.substring(0, 8)}</div>
      </div>

      <header className="mb-32 text-center space-y-8">
        <div className="inline-block px-4 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
           {story.genre} / {new Date(story.createdAt).getFullYear()}
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-none italic">{story.title}</h1>
        <p className="text-2xl md:text-3xl font-serif italic text-zinc-400 max-w-2xl mx-auto leading-relaxed opacity-80">
          {story.summary}
        </p>
        <div className="h-px w-24 bg-white/20 mx-auto"></div>
      </header>

      <div className="space-y-48">
        {story.chapters.map((chapter, index) => (
          <ChapterCard key={chapter.id} chapter={chapter} index={index} selectedVoice={selectedVoice} />
        ))}
      </div>

      <footer className="mt-48 pt-20 border-t border-white/5 text-center">
         <div className="text-zinc-600 font-serif italic mb-8">This legend was forged by the neural synthesis of the Fable Forge engine.</div>
         <button onClick={onBack} className="btn-premium px-12 py-4 rounded-full text-xs font-bold uppercase tracking-widest">Archive Complete</button>
      </footer>
    </div>
  );
};

export default StoryDisplay;
