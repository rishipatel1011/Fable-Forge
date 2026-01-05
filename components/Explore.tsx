
import React from 'react';

interface ExploreProps {
  onForgeSeed: (seed: string, genre: string) => void;
}

const FEATURED = [
  { 
    title: "The Obsidian Citadel", 
    genre: "High Fantasy", 
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    seed: "A fortress carved from a single piece of dark glass, floating in a sea of stars where the residents speak only in music."
  },
  { 
    title: "Neon Drifters", 
    genre: "Cyberpunk", 
    image: "https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=800",
    seed: "In a rain-slicked metropolis where memories are traded like currency, a detective finds a file containing their own childhood, which shouldn't exist."
  },
  { 
    title: "The Last Lighthouse", 
    genre: "Hopeful", 
    image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&q=80&w=800",
    seed: "At the edge of a dying universe, a lone guardian tends to a beacon that keeps the last remaining world from drifting into the void."
  }
];

const Explore: React.FC<ExploreProps> = ({ onForgeSeed }) => {
  const dailySeed = "In a world where shadows have their own memories, a young clockmaker discovers a gear that turns backward in time...";

  return (
    <div className="animate-page pt-12">
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight">The Nexus</h1>
        <p className="text-zinc-500 max-w-xl">A window into other forged realities. Be inspired by the collective imagination of the archivists.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURED.map((item, i) => (
          <div 
            key={i} 
            onClick={() => onForgeSeed(item.seed, item.genre)}
            className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer editorial-shadow transition-transform hover:scale-[1.01]"
          >
            <img src={item.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="text-[10px] font-bold tracking-[0.4em] text-white/60 uppercase mb-2 block">{item.genre}</span>
              <h3 className="text-2xl font-serif text-white font-bold mb-4">{item.title}</h3>
              <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500">
                 <p className="text-xs text-white/70 leading-relaxed mb-4">Click to manifest this legend.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 glass-ui p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
        </div>
        <div className="relative z-10">
            <h4 className="text-2xl font-serif mb-4">The Daily Seed</h4>
            <p className="text-zinc-400 italic font-serif text-xl leading-relaxed max-w-2xl">"{dailySeed}"</p>
            <button 
              onClick={() => onForgeSeed(dailySeed, "Steampunk")}
              className="mt-8 px-6 py-3 btn-premium rounded-full text-xs font-bold uppercase tracking-widest"
            >
              Forge This Seed
            </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;
