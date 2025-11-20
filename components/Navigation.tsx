import React from 'react';
import { AppView } from '../types';
import { LayoutGrid, Compass, Target, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.OVERVIEW, icon: LayoutGrid, label: 'Hub' },
    { id: AppView.GOALS, icon: Target, label: 'Goals' },
    { id: AppView.TASKS, icon: Compass, label: 'Tasks' },
    { id: AppView.REFLECTIONS, icon: BookOpen, label: 'Log' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-6">
      <div className="bg-[#121217] border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl shadow-black/50 backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="relative px-6 py-3 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-white'}`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};