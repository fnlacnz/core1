
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Target } from 'lucide-react';

export const Review: React.FC = () => {
  const dataPoints = [20, 45, 30, 60, 55, 80, 90]; // Fake trend data
  const max = Math.max(...dataPoints);

  // Generate SVG path for the line chart
  const pathD = dataPoints.map((val, i) => {
      const x = (i / (dataPoints.length - 1)) * 100;
      const y = 100 - (val / max) * 100;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar"
    >
       <h2 className="text-4xl font-bold text-white font-['Outfit'] mb-2">System Review</h2>
       <p className="text-white/40 mb-8">Advanced analytics and insights.</p>

       {/* Top Score Cards */}
       <div className="grid md:grid-cols-3 gap-6 mb-8">
           <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300"><Activity size={20} /></div>
                   <span className="text-white/60 text-sm uppercase font-bold">Consistency</span>
               </div>
               <div className="text-3xl font-bold text-white">84%</div>
               <div className="w-full bg-white/5 h-1.5 mt-4 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-500 w-[84%]" />
               </div>
           </div>

           <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-orange-500/20 rounded-lg text-orange-300"><Flame size={20} /></div>
                   <span className="text-white/60 text-sm uppercase font-bold">Momentum</span>
               </div>
               <div className="text-3xl font-bold text-white">High</div>
                <div className="w-full bg-white/5 h-1.5 mt-4 rounded-full overflow-hidden">
                   <div className="h-full bg-orange-500 w-[90%]" />
               </div>
           </div>

           <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300"><Target size={20} /></div>
                   <span className="text-white/60 text-sm uppercase font-bold">Execution</span>
               </div>
               <div className="text-3xl font-bold text-white">13 Tasks</div>
                <div className="w-full bg-white/5 h-1.5 mt-4 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[65%]" />
               </div>
           </div>
       </div>

       {/* Main Chart Area */}
       <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-md relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xl font-bold text-white">Long-Term Trends</h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white">Monthly</span>
                    <span className="px-3 py-1 rounded-full text-white/30 text-xs hover:bg-white/5 cursor-pointer">Yearly</span>
                </div>
            </div>
            
            {/* CSS Chart */}
            <div className="h-64 w-full relative z-10">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    ))}
                    
                    {/* Area fill */}
                    <path d={`${pathD} L 100 100 L 0 100 Z`} fill="url(#gradient)" opacity="0.3" />
                    
                    {/* Line */}
                    <path d={pathD} fill="none" stroke="#c026d3" strokeWidth="2" strokeLinecap="round" />

                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#c026d3" />
                            <stop offset="100%" stopColor="rgba(192, 38, 211, 0)" />
                        </linearGradient>
                    </defs>
                </svg>
                
                {/* X Axis Labels */}
                <div className="flex justify-between mt-4 text-xs text-white/30 font-mono uppercase">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                </div>
            </div>
       </div>

       {/* Heatmap Mockup */}
       <div className="mt-8 p-8 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-md">
           <h3 className="text-xl font-bold text-white mb-6">Activity Heatmap</h3>
           <div className="flex gap-1 flex-wrap">
               {Array.from({ length: 52 }).map((_, i) => (
                   <div key={i} className="w-3 h-12 flex flex-col gap-1">
                       {Array.from({ length: 7 }).map((_, j) => {
                           const active = Math.random() > 0.7;
                           const opacity = active ? Math.random() * 0.8 + 0.2 : 0.1;
                           return (
                               <div 
                                key={j} 
                                className="w-3 h-3 rounded-sm bg-fuchsia-500 transition-opacity hover:scale-150 hover:z-10"
                                style={{ opacity }}
                               />
                           )
                       })}
                   </div>
               ))}
           </div>
       </div>
    </motion.div>
  );
};
