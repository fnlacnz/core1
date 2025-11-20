
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientSound } from '../types';
import { Play, Pause, RotateCcw, Volume2, X, Minimize2, Maximize2, CloudRain, TreePine, Rocket, Coffee, Waves } from 'lucide-react';

interface SprintOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (minutes: number) => void;
}

export const SprintOverlay: React.FC<SprintOverlayProps> = ({ isOpen, onClose, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [duration, setDuration] = useState(25);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedSound, setSelectedSound] = useState<AmbientSound>('Rain');

  useEffect(() => {
    let interval: any;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
      onComplete(duration);
      // Play sound or notify
    }
    return () => clearInterval(interval);
  }, [isActive, time, duration, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStart = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTime(duration * 60);
  };

  const sounds: { id: AmbientSound; icon: any; label: string }[] = [
      { id: 'Silence', icon: Volume2, label: 'Silence' },
      { id: 'Rain', icon: CloudRain, label: 'Rain' },
      { id: 'Forest', icon: TreePine, label: 'Forest' },
      { id: 'Space', icon: Rocket, label: 'Space' },
      { id: 'Ocean', icon: Waves, label: 'Ocean' },
      { id: 'Cafe', icon: Coffee, label: 'Café' },
    ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={`fixed z-[100] transition-all duration-500 ease-spring ${
            isMinimized 
              ? 'bottom-6 right-6 w-80 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden'
              : 'inset-0 md:inset-12 md:rounded-[3rem] bg-[#0f0c29]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center justify-center'
          }`}
        >
            {/* Background Ambience for Maximized View */}
            {!isMinimized && isActive && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse-slow" />
                </div>
            )}

            {/* Content Container */}
            <div className={`relative w-full h-full flex flex-col ${isMinimized ? 'p-4' : 'p-8 md:p-12 max-w-4xl mx-auto'}`}>
                
                {/* Header Controls */}
                <div className="flex justify-between items-center mb-4 z-20">
                    <div className="flex items-center gap-2 text-white/60">
                         <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                         <span className="text-xs uppercase font-bold tracking-widest">{isActive ? 'Focusing' : 'Ready'}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={20} />}
                        </button>
                        <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={isMinimized ? 16 : 20} />
                        </button>
                    </div>
                </div>

                {/* Timer Display */}
                <div className={`flex-1 flex flex-col items-center justify-center z-10 ${isMinimized ? 'gap-2' : 'gap-8'}`}>
                    <div 
                        className={`font-['Space_Grotesk'] font-bold text-white tabular-nums leading-none tracking-tighter transition-all duration-500
                        ${isMinimized ? 'text-5xl' : 'text-[8rem] md:text-[12rem]'}`}
                    >
                        {formatTime(time)}
                    </div>

                    {/* Duration Selection (Maximized Only) */}
                    {!isMinimized && (
                        <div className="flex gap-3">
                            {[25, 45, 60, 90].map(m => (
                                <button
                                    key={m}
                                    onClick={() => { setDuration(m); setTime(m * 60); setIsActive(false); }}
                                    className={`px-6 py-2 rounded-full border transition-all ${duration === m ? 'bg-white text-black border-white' : 'bg-transparent text-white/30 border-white/10 hover:border-white/40'}`}
                                >
                                    {m}m
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Play Controls */}
                <div className={`flex items-center justify-center z-10 ${isMinimized ? 'gap-4 mt-2' : 'gap-8 mb-8'}`}>
                     <button onClick={handleReset} className="p-3 text-white/30 hover:text-white transition-colors"><RotateCcw size={isMinimized ? 18 : 24} /></button>
                     <button 
                        onClick={handleStart}
                        className={`${isMinimized ? 'w-12 h-12' : 'w-20 h-20'} rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-white/10`}
                     >
                         {isActive ? <Pause size={isMinimized ? 20 : 32} fill="currentColor" /> : <Play size={isMinimized ? 20 : 32} fill="currentColor" className="ml-1" />}
                     </button>
                     {!isMinimized && (
                         // Sound selector toggle could go here, for now invisible spacer
                         <div className="w-12" />
                     )}
                </div>

                {/* Soundscape (Maximized Only) */}
                {!isMinimized && (
                    <div className="mt-auto bg-white/5 border border-white/5 rounded-2xl p-4 backdrop-blur-md">
                        <div className="flex justify-between items-center gap-4">
                             <span className="text-xs font-bold text-white/40 uppercase flex items-center gap-2"><Volume2 size={14} /> Ambience</span>
                             <div className="flex gap-2">
                                 {sounds.map(s => (
                                     <button
                                        key={s.id}
                                        onClick={() => setSelectedSound(s.id)}
                                        className={`p-2 rounded-lg transition-all ${selectedSound === s.id ? 'bg-white/20 text-white' : 'text-white/20 hover:bg-white/5'}`}
                                        title={s.label}
                                     >
                                         <s.icon size={18} />
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
