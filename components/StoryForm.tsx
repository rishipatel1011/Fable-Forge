
import React, { useState } from 'react';
import { GenerationParams } from '../types';

interface StoryFormProps {
  onSubmit: (params: GenerationParams) => void;
  isLoading: boolean;
}

const GENRES = ["High Fantasy", "Cyberpunk", "Cosmic Horror", "Greek Myth", "Steampunk", "Fable"];
const TONES = ["Epic", "Dark", "Whimsical", "Tragic", "Hopeful", "Cerebral"];

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState(GENRES[0]);
  const [tone, setTone] = useState(TONES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit({ prompt, genre, tone });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
      {/* Dynamic Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative glass-panel p-10 rounded-[2.5rem] border-white/5 shadow-2xl space-y-8">
        <div>
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400 mb-4">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
             Input Original Seed
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A forgotten city underwater where the statues still weep gold..."
              className="w-full h-44 bg-slate-950/40 border border-slate-800/50 rounded-2xl p-6 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none resize-none font-story text-xl leading-relaxed placeholder:text-slate-700"
              required
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono">
                {prompt.length} CHR
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 pl-1">Universe Setting</label>
            <div className="relative group/select">
                <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800/50 rounded-xl p-4 text-white hover:border-slate-700 transition-colors focus:border-indigo-500/50 outline-none appearance-none font-mythic tracking-widest text-sm"
                >
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 pl-1">Vibrational Tone</label>
            <div className="relative group/select">
                <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800/50 rounded-xl p-4 text-white hover:border-slate-700 transition-colors focus:border-indigo-500/50 outline-none appearance-none font-mythic tracking-widest text-sm"
                >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="group relative w-full h-16 bg-white overflow-hidden rounded-xl transition-all active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform group-hover:scale-110"></div>
          <span className="relative z-10 text-white font-mythic text-lg tracking-[0.4em] uppercase">
            {isLoading ? 'Spinning the Fates...' : 'Manifest Reality'}
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </button>
      </div>
    </form>
  );
};

export default StoryForm;
