
import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

const FableForgeLogo = () => (
  <div className="relative w-14 h-14 flex items-center justify-center group">
    {/* Outer Glow Aura */}
    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-amber-500/30 transition-all duration-700"></div>
    
    <svg viewBox="0 0 100 100" className="relative w-12 h-12 drop-shadow-2xl overflow-visible">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main Circular Backdrop */}
      <circle cx="50" cy="50" r="45" fill="#1e1b4b" stroke="url(#logo-grad)" strokeWidth="1.5" className="opacity-90" />
      
      {/* The Open Book */}
      <path 
        d="M25,40 Q35,35 45,40 L45,75 Q35,70 25,75 Z" 
        fill="url(#logo-grad)" 
        className="opacity-80"
      />
      <path 
        d="M28,43 Q35,39 42,43 L42,72 Q35,68 28,72 Z" 
        fill="#ffffff" 
        className="opacity-20"
      />

      {/* Magical Swirls from the Book */}
      <path 
        d="M45,55 Q55,40 40,30 Q30,25 35,15" 
        fill="none" 
        stroke="#fbbf24" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        className="animate-pulse"
        filter="url(#glow)"
      />
      <circle cx="35" cy="15" r="1" fill="#fff" />
      <circle cx="52" cy="45" r="0.8" fill="#fbbf24" />

      {/* The Forge-Hammer-Pen Hybrid (The Unique Tool) */}
      <g className="group-hover:translate-y-[-2px] transition-transform duration-500">
        {/* Hammer Head */}
        <path 
          d="M55,30 L80,30 Q85,30 85,35 L85,45 Q85,50 80,50 L55,50 Z" 
          fill="#94a3b8" 
          stroke="#fff"
          strokeWidth="0.5"
        />
        {/* Pen Body / Handle */}
        <path 
          d="M65,45 L65,75 Q65,85 70,85 Q75,85 75,75 L75,45" 
          fill="url(#logo-grad)" 
        />
        {/* Pen Nib detail on handle */}
        <path d="M70,85 L68,92 L72,92 Z" fill="#fbbf24" filter="url(#glow)" />
        <line x1="70" y1="70" x2="70" y2="80" stroke="#1e1b4b" strokeWidth="0.5" />
      </g>

      {/* Distant Castle Silhouettes inside circle */}
      <path d="M60,75 L60,65 L63,65 L63,75 Z M66,75 L66,60 L69,60 L69,75 Z" fill="#4338ca" className="opacity-60" />

      {/* Floating Sparkles */}
      <circle cx="20" cy="50" r="0.5" fill="#fff" className="animate-ping" />
      <circle cx="80" cy="20" r="0.7" fill="#fbbf24" className="animate-pulse" />
      <circle cx="50" cy="10" r="0.5" fill="#fff" />
    </svg>
  </div>
);

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-4 cursor-pointer group"
        onClick={onReset}
      >
        <FableForgeLogo />
        <h1 className="text-2xl font-mythic tracking-tighter bg-gradient-to-r from-white via-slate-200 to-amber-200 bg-clip-text text-transparent">
          Fable <span className="text-amber-500">Forge</span>
        </h1>
      </div>
      
      <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">
        <button 
          onClick={onReset} 
          className="hover:text-amber-400 transition-colors flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
          The Crucible
        </button>
        <a 
          href="https://ai.google.dev" 
          target="_blank" 
          className="hover:text-white transition-colors"
        >
          Nexus
        </a>
      </nav>
    </header>
  );
};

export default Header;
