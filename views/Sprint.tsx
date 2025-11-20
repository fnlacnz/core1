
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AmbientSound, AppView } from '../types';
import { Play, Pause, RotateCcw, Volume2, CloudRain, TreePine, Rocket, Coffee, Waves } from 'lucide-react';

interface SprintProps {
    setView: (view: AppView) => void;
}

export const Sprint: React.FC<SprintProps> = ({ setView }) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 min
  const [selectedSound, setSelectedSound] = useState<AmbientSound>('Rain');
  const [durationConfig, setDurationConfig] = useState(25);

  const sounds: { id: AmbientSound; icon: any; label: string }[] = [
    { id: 'Silence', icon: Volume2, label: 'Silence' },
    { id: 'Rain', icon: CloudRain, label: 'Rain' },
    { id: 'Forest', icon: TreePine, label: 'Forest' },
    { id: 'Space', icon: Rocket, label: 'Space' },
    { id: 'Ocean', icon: Waves, label: 'Ocean' },
    { id: 'Cafe', icon: Coffee, label: 'Café' },
  ];

  useEffect(() => {
    let interval: any;
    if (isActive && time > 0) {
        interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0) {
        setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
      setIsActive(false);
      setTime(durationConfig * 60);
  };

  const setDuration = (min: number) => {
      setDurationConfig(min);
      setTime(min * 60);
      setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="h-full p-6 md:p-8 flex flex-col items-center justify-center relative"
    >
       {/* Background Glow based on active state */}
       <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
       </div>

       <div className="relative z-10 w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-orange-500/20 rounded-2xl mb-6 text-orange-400">
                    <ClockIcon isActive={isActive} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-['Outfit'] mb-2">Sprint Mode</h2>
                <p className="text-white/50">Immersive focus with adaptive soundscapes.</p>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-12">
                <div className="text-[8rem] md:text-[10rem] font-bold text-white leading-none font-['Space_Grotesk'] tabular-nums tracking-tighter">
                    {formatTime(time)}
                </div>
                <div className="flex justify-center gap-4 mt-8">
                     {[25, 45, 90].map(min => (
                         <button 
                            key={min}
                            onClick={() => setDuration(min)}
                            className={`px-6 py-2 rounded-full border transition-all ${durationConfig === min ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                         >
                             {min} min
                         </button>
                     ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6 mb-16">
                <button onClick={resetTimer} className="p-4 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <RotateCcw size={24} />
                </button>
                <button 
                    onClick={toggleTimer}
                    className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
            </div>

            {/* Soundscape Selector */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                    <Volume2 size={12} /> Ambient Sound
                </p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {sounds.map(sound => (
                        <button
                            key={sound.id}
                            onClick={() => setSelectedSound(sound.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                                selectedSound === sound.id 
                                ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                                : 'bg-transparent text-white/30 hover:text-white/70'
                            }`}
                        >
                            <sound.icon size={20} />
                            <span className="text-xs font-medium">{sound.label}</span>
                        </button>
                    ))}
                </div>
            </div>
       </div>
    </motion.div>
  );
};

const ClockIcon = ({ isActive }: { isActive: boolean }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? "animate-spin [animation-duration:4s]" : ""}>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);
