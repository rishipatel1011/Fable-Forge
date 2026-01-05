
import React, { useState, useEffect, useCallback } from 'react';
import { Chapter, Story, StoryStatus, Page, GenerationParams } from './types';
import { generateStoryContent, generateChapterImage } from './services/geminiService';
import Sidebar from './components/Sidebar';
import StoryForm from './components/StoryForm';
import StoryDisplay from './components/StoryDisplay';
import Loader from './components/Loader';
import Library from './components/Library';
import Explore from './components/Explore';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.FORGE);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [status, setStatus] = useState<StoryStatus>(StoryStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Story[]>([]);
  const [settings, setSettings] = useState({
    voice: 'Kore',
    narrativeDepth: 'Deep',
    imageStyle: 'Photorealistic'
  });

  useEffect(() => {
    const saved = localStorage.getItem('fable_forge_v3_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("History parse failed", e);
      }
    }
    
    const savedSettings = localStorage.getItem('fable_forge_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Settings parse failed", e);
      }
    }
  }, []);

  const saveSettings = (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem('fable_forge_settings', JSON.stringify(newSettings));
  };

  const saveToHistory = useCallback((story: Story) => {
    setHistory(prev => {
      const filtered = prev.filter(s => s.id !== story.id);
      const updated = [story, ...filtered].slice(0, 10);
      try {
        const storageSafe = updated.map(s => ({
            ...s,
            chapters: s.chapters.map(ch => ({ ...ch, imageUrl: undefined })) 
        }));
        localStorage.setItem('fable_forge_v3_history', JSON.stringify(storageSafe));
      } catch (e) {
        console.warn("Storage full.");
      }
      return updated;
    });
  }, []);

  const handleGenerate = async (params: GenerationParams) => {
    setStatus(StoryStatus.GENERATING_TEXT);
    setError(null);
    setCurrentStory(null);
    setActivePage(Page.FORGE); // Switch to forge page to see loader if coming from Nexus

    try {
      const storyPartial = await generateStoryContent(params.prompt, params.genre, params.tone);
      const initialStory: Story = {
        id: storyPartial.id || crypto.randomUUID(),
        title: storyPartial.title || "Untitled Fragment",
        summary: storyPartial.summary || "Echoes of a world yet seen.",
        createdAt: storyPartial.createdAt || Date.now(),
        genre: storyPartial.genre || params.genre,
        chapters: (storyPartial.chapters || []).map(ch => ({ ...ch, id: crypto.randomUUID() }))
      };

      setCurrentStory(initialStory);
      setStatus(StoryStatus.GENERATING_IMAGES);

      const chaptersWithImages = [...initialStory.chapters];
      for (let i = 0; i < chaptersWithImages.length; i++) {
        try {
          const imgUrl = await generateChapterImage(chaptersWithImages[i].imagePrompt);
          chaptersWithImages[i] = { ...chaptersWithImages[i], imageUrl: imgUrl };
          setCurrentStory(prev => {
            if (!prev) return null;
            const updated = [...prev.chapters];
            updated[i] = chaptersWithImages[i];
            return { ...prev, chapters: updated };
          });
        } catch (imgErr) {
          console.error("Visual failure", imgErr);
        }
      }

      saveToHistory(initialStory);
      setStatus(StoryStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || "Archive access denied.");
      setStatus(StoryStatus.ERROR);
    }
  };

  const renderContent = () => {
    if (status === StoryStatus.GENERATING_TEXT) return <Loader status={status} />;
    
    if (currentStory && (status === StoryStatus.COMPLETED || status === StoryStatus.GENERATING_IMAGES)) {
        return <StoryDisplay story={currentStory} onBack={() => { setCurrentStory(null); setStatus(StoryStatus.IDLE); }} isGenerating={status === StoryStatus.GENERATING_IMAGES} selectedVoice={settings.voice} />;
    }

    if (status === StoryStatus.ERROR) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] animate-page">
          <h2 className="text-4xl font-serif mb-4 text-zinc-400">Archival Error</h2>
          <p className="text-zinc-600 mb-8 max-w-md text-center">{error}</p>
          <button onClick={() => setStatus(StoryStatus.IDLE)} className="btn-premium px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase">Restart Forge</button>
        </div>
      );
    }

    switch (activePage) {
      case Page.FORGE:
        return (
          <div className="animate-page pt-12">
            <div className="mb-16">
                <h1 className="text-5xl md:text-7xl font-serif mb-4 font-bold tracking-tight">The Crucible</h1>
                <p className="text-zinc-500 max-w-xl text-lg">Input a fragment of reality. Our archival engine will synthesize a cinematic legend from the void.</p>
            </div>
            <StoryForm onSubmit={handleGenerate} isLoading={false} />
          </div>
        );
      case Page.LIBRARY:
        return <Library history={history} onSelect={(s) => { setCurrentStory(s); setStatus(StoryStatus.COMPLETED); }} />;
      case Page.EXPLORE:
        return <Explore onForgeSeed={(seed, genre) => handleGenerate({ prompt: seed, genre, tone: 'Epic' })} />;
      case Page.SETTINGS:
        return <Settings settings={settings} onSave={saveSettings} />;
      default:
        return <div className="p-20 text-center text-zinc-600">Module under construction.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onReset={() => { 
          setCurrentStory(null); 
          setStatus(StoryStatus.IDLE); 
          setActivePage(Page.FORGE); 
        }} 
      />
      
      <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-24 relative">
        <div className="max-w-7xl mx-auto">
            {renderContent()}
        </div>
      </main>

      <div className="fixed top-8 right-8 z-50">
         <div className="flex items-center gap-3 glass-ui px-4 py-2 rounded-full border-white/10">
            <div className={`w-2 h-2 rounded-full ${status === StoryStatus.IDLE ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">System: {status}</span>
         </div>
      </div>
    </div>
  );
};

export default App;
