
import React, { useState, useRef } from 'react';
import { Chapter } from '../types';
import { generateNarration, decodeBase64, decodeAudioData } from '../services/geminiService';

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
  selectedVoice?: string;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, index, selectedVoice = 'Kore' }) => {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const toggleNarration = async () => {
    if (isNarrating) {
      sourceRef.current?.stop();
      setIsNarrating(false);
      return;
    }
    try {
      setIsAudioLoading(true);
      const audioBase64 = await generateNarration(chapter.content, selectedVoice);
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(decodeBase64(audioBase64), ctx);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsNarrating(false);
      source.start();
      sourceRef.current = source;
      setIsNarrating(true);
    } catch (e) { console.error(e); } finally { setIsAudioLoading(false); }
  };

  return (
    <article className="space-y-16">
      <div className="relative group rounded-[2.5rem] overflow-hidden editorial-shadow bg-zinc-900 aspect-video">
        {chapter.imageUrl ? (
          <img src={chapter.imageUrl} alt={chapter.title} className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-zinc-950/50">
             <div className="w-12 h-12 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin mb-6"></div>
             <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 uppercase">Synthesizing Visual Fragment...</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
      </div>

      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-4">
            <div className="text-[10px] font-bold tracking-[0.5em] text-zinc-500 uppercase">Archival Plate {index + 1}</div>
            <h3 className="text-4xl font-serif font-bold tracking-tight">{chapter.title}</h3>
        </header>

        <div className="relative">
          <p className="text-xl md:text-2xl font-serif leading-relaxed text-zinc-300 first-letter:text-7xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:leading-none">
            {chapter.content}
          </p>
        </div>

        <button 
          onClick={toggleNarration}
          disabled={!chapter.content || isAudioLoading}
          className="flex items-center gap-6 px-8 py-4 glass-ui rounded-full border-white/5 hover:border-white/20 transition-all text-zinc-400 hover:text-white"
        >
          {isAudioLoading ? (
              <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
          ) : isNarrating ? (
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{isAudioLoading ? 'Processing Audio' : isNarrating ? 'Audio Active' : 'Begin Narration'}</span>
        </button>
      </div>
    </article>
  );
};

export default ChapterCard;
