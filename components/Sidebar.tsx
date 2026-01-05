
import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onReset: () => void;
}

const NavIcon = ({ type }: { type: string }) => {
  switch (type) {
    case Page.FORGE: return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>;
    case Page.LIBRARY: return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>;
    case Page.EXPLORE: return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
    case Page.SETTINGS: return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
    default: return null;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onReset }) => {
  const menuItems = [
    { id: Page.FORGE, label: 'The Forge' },
    { id: Page.LIBRARY, label: 'Archive' },
    { id: Page.EXPLORE, label: 'Nexus' },
    { id: Page.SETTINGS, label: 'Settings' },
  ];

  return (
    <aside className="w-20 md:w-64 border-r border-white/5 bg-black flex flex-col items-center md:items-stretch transition-all z-50">
      <div className="p-6 md:p-8 mb-8 cursor-pointer" onClick={onReset}>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-mythic text-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">F</div>
            <h1 className="hidden md:block font-mythic tracking-tighter text-xl">Fable Forge<span className="text-zinc-500">.</span></h1>
         </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
              activePage === item.id 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            <NavIcon type={item.id} />
            <span className="hidden md:block font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="hidden md:block p-4 glass-ui rounded-2xl border-white/5">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
            <p className="text-xs text-white font-medium">Archivist Pro</p>
            <div className="mt-3 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-white w-full h-full opacity-50 animate-pulse"></div>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
