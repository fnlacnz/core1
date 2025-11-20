import React from 'react';
import { AppView } from '../types';
import { LayoutGrid, Compass, Zap, Target, BookOpen, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onToggleSprint: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onToggleSprint }) => {
  const menuItems = [
    { id: AppView.OVERVIEW, icon: LayoutGrid, label: 'Overview' },
    { id: AppView.GOALS, icon: Target, label: 'Goals' },
    { id: AppView.TASKS, icon: Compass, label: 'Tasks' },
    { id: AppView.REFLECTIONS, icon: BookOpen, label: 'Logbook' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-full fixed left-0 top-0 border-r border-white/5 bg-[#050508] z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Box size={18} strokeWidth={3} />
        </div>
        <div>
            <h1 className="font-['Outfit'] font-bold text-xl tracking-tight text-white">NukeCore</h1>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/5"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={20} className="relative z-10" strokeWidth={isActive ? 2.5 : 2} />
              <span className="relative z-10 font-['Space_Grotesk'] font-semibold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sprint Button */}
      <div className="p-6 border-t border-white/5">
          <button 
            onClick={onToggleSprint}
            className="w-full py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
          >
              <Zap size={18} fill="currentColor" />
              Focus Mode
          </button>
      </div>
    </div>
  );
};