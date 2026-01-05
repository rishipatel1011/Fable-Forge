
import React from 'react';
import { Story } from '../types';

interface LibraryProps {
  history: Story[];
  onSelect: (story: Story) => void;
}

const Library: React.FC<LibraryProps> = ({ history, onSelect }) => {
  return (
    <div className="animate-page pt-12">
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight">The Archive</h1>
        <p className="text-zinc-500 max-w-xl">Your previously forged legends, preserved in the digital amber of our neural network.</p>
      </div>

      {history.length === 0 ? (
        <div className="h-[40vh] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-zinc-600">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            <p className="font-medium">The Archive is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map(story => (
            <div 
              key={story.id} 
              onClick={() => onSelect(story)}
              className="group glass-ui rounded-3xl overflow-hidden cursor-pointer hover:border-white/20 transition-all editorial-shadow"
            >
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                   <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">{story.genre}</span>
                   <span className="text-[10px] text-zinc-600">{new Date(story.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold group-hover:text-zinc-300 transition-colors">{story.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">"{story.summary}"</p>
                <div className="pt-4 flex items-center gap-2 text-xs font-bold text-zinc-400 group-hover:text-white transition-all">
                    Access Manuscript
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
