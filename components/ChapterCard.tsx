
import React, { useState, useRef } from 'react';
import { Chapter } from '../types';
import { generateNarration, decodeBase64, decodeAudioData } from '../services/geminiService';

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, index }) => {
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
      const audioBase64 = await generateNarration(chapter.content);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const audioBytes = decodeBase64(audioBase64);
      const audioBuffer = await decodeAudioData(audioBytes, ctx);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsNarrating(false);
      source.start();
      sourceRef.current = source;
      setIsNarrating(true);
    } catch (e) {
      console.error("Narration failed", e);
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <section className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-start`}>
      <div className="flex-1 space-y-8 py-4">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-indigo-400">
             <span className="text-xs font-mono tracking-tighter">0{index + 1}</span>
             <div className="h-px w-8 bg-indigo-500/30"></div>
          </div>
          <h3 className="text-4xl font-mythic text-white leading-tight tracking-tight">{chapter.title}</h3>
        </div>
        
        <div className="relative">
          <p className="text-2xl font-story leading-relaxed text-slate-300 first-letter:text-6xl first-letter:font-mythic first-letter:mr-4 first-letter:float-left first-letter:text-indigo-400 first-letter:leading-none">
            {chapter.content}
          </p>
        </div>

        <button 
          onClick={toggleNarration}
          disabled={!chapter.content || isAudioLoading}
          className={`group flex items-center gap-4 px-6 py-3 rounded-xl transition-all border ${
            isNarrating 
            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
            : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-white'
          }`}
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            {isAudioLoading ? (
                <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            ) : isNarrating ? (
                <div className="flex gap-1 items-end h-full">
                    <div className="w-1 bg-current animate-[bounce_1s_infinite_0.1s]" style={{height: '60%'}}></div>
                    <div className="w-1 bg-current animate-[bounce_1s_infinite_0.3s]" style={{height: '100%'}}></div>
                    <div className="w-1 bg-current animate-[bounce_1s_infinite_0.5s]" style={{height: '40%'}}></div>
                </div>
            ) : (
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1"></div>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
            {isAudioLoading ? 'Conjuring Voice...' : isNarrating ? 'Reading Chapter' : 'Listen to Legend'}
          </span>
        </button>
      </div>

      <div className="flex-1 w-full aspect-[4/5] md:aspect-[3/4] relative group">
        {/* Ornate Frame Decor */}
        <div className="absolute -inset-4 border border-indigo-500/10 rounded-[2.5rem] opacity-50"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500/30 rounded-br-2xl"></div>
        
        <div className="relative w-full h-full glass-panel rounded-3xl overflow-hidden border-white/5 shadow-2xl">
          {chapter.imageUrl ? (
            <img 
              src={chapter.imageUrl} 
              alt={chapter.title} 
              className="w-full h-full object-cover transition-all duration-[3000ms] group-hover:scale-110 group-hover:rotate-1"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/80 p-12 text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-b-2 border-purple-500/50 rounded-full animate-spin-reverse"></div>
              </div>
              <div className="space-y-2">
                  <p className="text-xs font-mythic text-slate-500 tracking-[0.3em] uppercase">Materializing Imagery</p>
                  <p className="text-[10px] text-slate-700 font-mono italic px-4">"{chapter.imagePrompt.substring(0, 60)}..."</p>
              </div>
            </div>
          )}
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 mix-blend-overlay"></div>
        </div>
      </div>
    </section>
  );
};

export default ChapterCard;
