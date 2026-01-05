
import React, { useState, useEffect, useCallback } from 'react';
import { Chapter, Story, StoryStatus, GenerationParams } from './types';
import { generateStoryContent, generateChapterImage } from './services/geminiService';
import Header from './components/Header';
import StoryForm from './components/StoryForm';
import StoryDisplay from './components/StoryDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [status, setStatus] = useState<StoryStatus>(StoryStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Story[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('fable_forge_v2_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("History parse failed", e);
      }
    }
  }, []);

  const saveToHistory = useCallback((story: Story) => {
    setHistory(prev => {
      // To prevent LocalStorage crashes, we store a lightweight version for history (no large images)
      // or we just store the current one in memory.
      const simplifiedStory = {
        ...story,
        chapters: story.chapters.map(c => ({ ...c, imageUrl: c.imageUrl ? '(image)' : undefined }))
      };
      
      const filtered = prev.filter(s => s.id !== story.id);
      const updated = [story, ...filtered].slice(0, 5);
      
      try {
        // We only save the text to history to stay under the 5MB limit
        const storageSafe = updated.map(s => ({
            ...s,
            chapters: s.chapters.map(ch => ({ ...ch, imageUrl: undefined })) // Don't save images to disk
        }));
        localStorage.setItem('fable_forge_v2_history', JSON.stringify(storageSafe));
      } catch (e) {
        console.warn("Storage full, history not persisted.");
      }
      return updated;
    });
  }, []);

  const handleGenerate = async (params: GenerationParams) => {
    setStatus(StoryStatus.GENERATING_TEXT);
    setError(null);
    setCurrentStory(null);

    try {
      // 1. Forge Text Content
      const storyPartial = await generateStoryContent(params.prompt, params.genre, params.tone);
      
      const initialStory: Story = {
        id: storyPartial.id || crypto.randomUUID(),
        title: storyPartial.title || "Untitled Legend",
        summary: storyPartial.summary || "A journey begins...",
        createdAt: storyPartial.createdAt || Date.now(),
        genre: storyPartial.genre || params.genre,
        chapters: (storyPartial.chapters || []).map(ch => ({ ...ch, id: crypto.randomUUID() }))
      };

      // CRITICAL: Set the story and keep it there
      setCurrentStory(initialStory);
      setStatus(StoryStatus.GENERATING_IMAGES);

      // 2. Background Image Generation (Does not block or reset the view)
      const chaptersWithImages = [...initialStory.chapters];
      for (let i = 0; i < chaptersWithImages.length; i++) {
        try {
          const imgUrl = await generateChapterImage(chaptersWithImages[i].imagePrompt);
          chaptersWithImages[i] = { ...chaptersWithImages[i], imageUrl: imgUrl };
          
          // Functional update to ensure we don't overwrite other changes
          setCurrentStory(prev => {
            if (!prev) return null;
            const updated = [...prev.chapters];
            updated[i] = chaptersWithImages[i];
            return { ...prev, chapters: updated };
          });
        } catch (imgErr) {
          console.error("Image forge failed for chapter", i, imgErr);
          // Keep going so the text remains visible
        }
      }

      saveToHistory(initialStory);
      setStatus(StoryStatus.COMPLETED);

    } catch (err: any) {
      console.error("Fatal Forge Error:", err);
      setError(err.message || "The celestial forge cooled unexpectedly.");
      setStatus(StoryStatus.ERROR);
    }
  };

  const handleReset = () => {
    setCurrentStory(null);
    setStatus(StoryStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-32">
      <Header onReset={handleReset} />
      
      <main className="max-w-6xl mx-auto px-6 pt-12">
        {status === StoryStatus.IDLE && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-6 border border-amber-500/20">
                AI Cinematic Legend Engine
              </span>
              <h2 className="text-5xl md:text-7xl font-mythic mb-6 tracking-tight font-black bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                Forge Reality
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-story italic">
                Describe a world. We will forge the myth, the voice, and the cinematic reality.
              </p>
            </div>
            
            <StoryForm onSubmit={handleGenerate} isLoading={status === StoryStatus.GENERATING_TEXT} />
          </div>
        )}

        {status === StoryStatus.GENERATING_TEXT && (
          <Loader status={status} />
        )}

        {status === StoryStatus.ERROR && (
          <div className="glass-panel p-12 rounded-[2rem] text-center border-red-900/20 max-w-2xl mx-auto">
            <h3 className="text-3xl font-mythic mb-4 text-red-200">The Forge Cracked</h3>
            <p className="text-slate-400 mb-8 font-story text-lg">{error}</p>
            <button onClick={handleReset} className="px-8 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl font-bold uppercase text-sm">
              Restart Forge
            </button>
          </div>
        )}

        {currentStory && (status === StoryStatus.COMPLETED || status === StoryStatus.GENERATING_IMAGES) && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <StoryDisplay 
              story={currentStory} 
              onBack={handleReset} 
              isGenerating={status === StoryStatus.GENERATING_IMAGES} 
            />
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 py-4 bg-slate-950/80 backdrop-blur-sm border-t border-slate-900 text-center text-[10px] text-slate-600 tracking-[0.4em] uppercase z-40">
        Forged by Gemini 3 • 8K Photorealistic Engine Active
      </footer>
    </div>
  );
};

export default App;
