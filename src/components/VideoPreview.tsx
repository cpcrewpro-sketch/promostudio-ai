import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scene } from '../types';
import { Play, Pause, RotateCcw, Smartphone } from 'lucide-react';

interface VideoPreviewProps {
  scenes: Scene[];
  title: string;
  slogan: string;
  heroImage?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  scenes, 
  title, 
  slogan, 
  heroImage,
  isPlaying,
  onTogglePlay
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && scenes.length > 0) {
      const currentScene = scenes[currentSceneIndex];
      const durationMs = currentScene.duration * 1000;
      
      const startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / durationMs) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(interval);
          if (currentSceneIndex < scenes.length - 1) {
            setCurrentSceneIndex(prev => prev + 1);
            setProgress(0);
          } else {
            onTogglePlay(); // End reached
          }
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIndex, scenes, onTogglePlay]);

  const resetVideo = () => {
    setCurrentSceneIndex(0);
    setProgress(0);
    if (!isPlaying) onTogglePlay();
  };

  if (scenes.length === 0) {
    return (
      <div className="w-full aspect-[9/16] bg-zinc-900 rounded-3xl border-8 border-zinc-800 flex items-center justify-center p-8 text-center text-zinc-500">
        <div className="flex flex-col items-center gap-4">
          <Smartphone size={48} />
          <p className="font-medium">Generate a script to see the preview</p>
        </div>
      </div>
    );
  }

  const currentScene = scenes[currentSceneIndex];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Device Frame */}
      <div className="relative aspect-[9/16] bg-black rounded-[3rem] border-[12px] border-zinc-800 shadow-2xl overflow-hidden group">
        
        {/* Dynamic Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneIndex}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
            <img 
              src={heroImage || `https://picsum.photos/seed/${currentSceneIndex + 14}/720/1280`} 
              className="w-full h-full object-cover grayscale-[20%] brightness-75"
              alt="Promo background"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Content Layers */}
        <div className="absolute inset-0 z-20 flex flex-col p-8 justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-start"
          >
            <span className="text-xs font-mono tracking-widest text-white/50 uppercase">
              {title}
            </span>
            <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-tighter">
              Scene {currentSceneIndex + 1}
            </span>
          </motion.div>

          <div className="space-y-6">
             <AnimatePresence mode="wait">
              <motion.div
                key={currentSceneIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
                  {currentScene.narration}
                </h2>
                <p className="text-sm text-white/70 italic border-l-2 border-white/20 pl-4">
                  {currentScene.visualDescription}
                </p>
              </motion.div>
            </AnimatePresence>

            {currentSceneIndex === scenes.length - 1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="pt-4"
              >
                <button className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors">
                  Download Now
                </button>
                <p className="text-center text-xs text-white/50 mt-4 uppercase tracking-[0.2em] font-medium">
                  {slogan}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-30">
          <motion.div 
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Overlay Controls */}
        <div className="absolute inset-0 z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 flex items-center justify-center gap-4">
           <button 
            onClick={onTogglePlay}
            className="p-4 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-xl"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          <button 
            onClick={resetVideo}
            className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      {/* Shadows and Decoration */}
      <div className="absolute -inset-4 bg-white/5 rounded-[4rem] -z-10 blur-2xl" />
    </div>
  );
};
