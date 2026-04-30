import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Send, Layout, Type as TypeIcon, Info, Image as ImageIcon, Loader2 } from 'lucide-react';
import { generateAdScript } from '../services/geminiService';
import { VideoPreview } from './VideoPreview';
import { AdData } from '../types';

export const PromoStudio: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vibe: 'Modern & Clean',
  });
  const [adData, setAdData] = useState<AdData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const vibes = [
    'Modern & Clean',
    'High Energy & Bold',
    'Gaming & AI Tech',
    'Playful & Friendly',
    'Dark & Cinematic'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setLoading(true);
    try {
      const script = await generateAdScript(formData.title, formData.description, formData.vibe);
      
      setAdData({
        ...formData,
        ...script,
        heroImageUrl: `https://picsum.photos/seed/${formData.title}-${Date.now()}/720/1280`
      });
      setIsPlaying(true);
      
      // Clear specific error if any
    } catch (err: any) {
      console.error(err);
      alert("Error: " + (err.message || "Failed to generate script. Check your connection."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Input & Settings */}
        <div className="space-y-12">
          <header className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono uppercase tracking-widest text-zinc-400"
            >
              <Sparkles size={14} className="text-white" />
              AI-Powered Promo Creator
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl leading-[0.85] text-white">
              MAKE YOUR APP <br /> <span className="text-zinc-600">UNMISSABLE.</span>
            </h1>
            <p className="text-zinc-500 max-w-lg text-lg">
              Transform your Android app's concept into a professional 30-second video script and animated preview in seconds. 
            </p>
          </header>

          <form onSubmit={handleGenerate} className="space-y-8 max-w-md">
            <div className="space-y-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
                  App Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. ZenFit Tracker"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl transition-all placeholder:text-zinc-700"
                  required
                />
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-focus-within:text-white transition-colors">
                  App Description
                </label>
                <textarea 
                  rows={4}
                  placeholder="What makes your app special? Describe its core feature..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl transition-all placeholder:text-zinc-700 resize-none"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Visual Direction / Vibe
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {vibes.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setFormData({...formData, vibe: v})}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                        formData.vibe === v 
                        ? 'bg-white text-black border-white' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Generating Masterpiece...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Build Promo Assets
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Preview & Script */}
        <div className="lg:sticky lg:top-12 space-y-8">
          <div className="flex flex-col items-center">
            <VideoPreview 
              scenes={adData?.scenes || []}
              title={adData?.title || 'YOUR APP'}
              slogan={adData?.slogan || 'The future in your pocket.'}
              heroImage={adData?.heroImageUrl}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          </div>

          {adData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-zinc-400">
                  <TypeIcon size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Ad Slogan</span>
                </div>
                <p className="text-xl font-serif italic text-white md:text-2xl">"{adData.slogan}"</p>
                <button 
                  onClick={() => {
                    const text = `Slogan: ${adData.slogan}\n\nScript:\n${adData.scenes.map((s, i) => `Scene ${i+1}: ${s.narration}`).join('\n')}`;
                    navigator.clipboard.writeText(text);
                    alert("Script copied to clipboard!");
                  }}
                  className="mt-4 text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors"
                >
                  Copy Full Script
                </button>
              </div>

              <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-zinc-400">
                  <Layout size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Key Features</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {adData.keyFeatures.map((f, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-bold uppercase text-zinc-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900 text-zinc-600 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-xs font-mono">
          <span>&copy; 2026 PROMOSTUDIO AI</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>VERSION 1.0</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest">
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Guidelines</a>
           <a href="#" className="hover:text-white transition-colors">API Docs</a>
        </div>
      </footer>
    </div>
  );
};
