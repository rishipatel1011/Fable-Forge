
import React from 'react';

interface SettingsProps {
  settings: {
    voice: string;
    narrativeDepth: string;
    imageStyle: string;
  };
  onSave: (settings: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const voices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
  const styles = ['Photorealistic', 'Cinematic Oil', '35mm Film', 'Surrealist'];

  const handleChange = (key: string, value: string) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <div className="animate-page pt-12">
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight">System Core</h1>
        <p className="text-zinc-500 max-w-xl">Configure the parameters of the Fable Forge archival engine.</p>
      </div>

      <div className="max-w-2xl space-y-12">
        <section className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
             </div>
             <h3 className="text-xl font-serif font-bold">Narration Voice</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {voices.map(v => (
              <button
                key={v}
                onClick={() => handleChange('voice', v)}
                className={`px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                  settings.voice === v ? 'bg-white text-black shadow-xl scale-[1.02]' : 'glass-ui text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
             </div>
             <h3 className="text-xl font-serif font-bold">Visual Manifestation</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {styles.map(s => (
              <button
                key={s}
                onClick={() => handleChange('imageStyle', s)}
                className={`px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                  settings.imageStyle === s ? 'bg-white text-black shadow-xl scale-[1.02]' : 'glass-ui text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <div className="pt-8 border-t border-white/5 flex justify-between items-center">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Engine Version 3.4.1</div>
            <button className="text-xs text-zinc-400 hover:text-white transition-colors underline underline-offset-4">Reset to Factory Presets</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
