import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillNode, UserState } from '../types';
import { Lock, Unlock, Star, ArrowUp } from 'lucide-react';
import { Button } from '../components/Button';

interface SkillTreeProps {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  skills: SkillNode[];
  setSkills: React.Dispatch<React.SetStateAction<SkillNode[]>>;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ user, setUser, skills, setSkills }) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const selectedSkill = skills.find(s => s.id === selectedSkillId);

  const handleUpgrade = () => {
    if (!selectedSkill) return;
    if (user.xp >= selectedSkill.cost && selectedSkill.level < selectedSkill.maxLevel) {
        // Deduct XP
        setUser(prev => ({ ...prev, xp: prev.xp - selectedSkill.cost }));
        
        // Upgrade Skill
        setSkills(prev => prev.map(s => {
            if (s.id === selectedSkill.id) {
                const newLevel = s.level + 1;
                return { 
                    ...s, 
                    level: newLevel,
                    status: newLevel === s.maxLevel ? 'mastered' : 'unlocked'
                };
            }
            return s;
        }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full relative overflow-hidden flex flex-col items-center p-6"
    >
       <div className="text-center mb-4 relative z-10">
         <h2 className="text-4xl text-white font-['Outfit'] mb-2">Skill Constellation</h2>
         <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1 rounded-full backdrop-blur-md">
            <span className="text-emerald-400 font-bold">{user.xp} XP</span>
            <span className="text-white/40 text-sm">Available</span>
         </div>
       </div>

      <div className="flex-1 w-full relative max-w-3xl mx-auto bg-gradient-to-b from-transparent to-indigo-900/10 rounded-[3rem] border border-white/5" onClick={() => setSelectedSkillId(null)}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {skills.map(skill => (
            skill.connections.map(targetId => {
              const target = skills.find(s => s.id === targetId);
              if (!target) return null;
              // Note: connections logic might need adjustment based on strict direction
              // Drawing line from current skill to its target
              return (
                <motion.line
                  key={`${skill.id}-${target.id}`}
                  x1={`${skill.x}%`}
                  y1={`${skill.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={skill.status === 'locked' ? 'rgba(255,255,255,0.05)' : 'rgba(129, 140, 248, 0.4)'}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />
              );
            })
          ))}
        </svg>

        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            onClick={(e) => { e.stopPropagation(); setSelectedSkillId(skill.id); }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer group z-20"
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
            whileHover={{ scale: 1.1 }}
          >
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 backdrop-blur-md transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]
              ${selectedSkillId === skill.id ? 'ring-4 ring-white/20 scale-110' : ''}
              ${skill.status === 'mastered' 
                ? 'bg-emerald-500/20 border-emerald-400 shadow-emerald-500/20 text-emerald-100' 
                : skill.status === 'unlocked'
                ? 'bg-indigo-500/20 border-indigo-400 shadow-indigo-500/20 text-indigo-100'
                : 'bg-gray-900/80 border-gray-700 text-gray-600'
              }`}
            >
              {skill.status === 'locked' ? <Lock size={20} /> : skill.status === 'mastered' ? <Star size={24} fill="currentColor" /> : <span className="text-xl font-bold">{skill.level}</span>}
            </div>
            <span className={`text-xs font-medium tracking-wider uppercase bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5 ${skill.status === 'locked' ? 'text-gray-500' : 'text-white/90'}`}>
              {skill.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Skill Detail Panel */}
      <AnimatePresence>
        {selectedSkill && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-[#0A0A0F] border-t border-white/10 p-6 rounded-t-3xl shadow-2xl z-30"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-['Space_Grotesk'] text-white">{selectedSkill.label}</h3>
                        <p className="text-white/50 mt-1">{selectedSkill.description}</p>
                    </div>
                    <button onClick={() => setSelectedSkillId(null)} className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white"><Unlock size={16} /></button>
                </div>
                
                <div className="mt-6 flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs text-white/40 uppercase">Current</p>
                            <p className="text-xl font-bold text-white">{selectedSkill.level}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10"></div>
                        <div>
                            <p className="text-xs text-white/40 uppercase">Max</p>
                            <p className="text-xl font-bold text-white/60">{selectedSkill.maxLevel}</p>
                        </div>
                    </div>

                    {selectedSkill.status === 'locked' ? (
                        <div className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium">
                            Locked (Prerequisites needed)
                        </div>
                    ) : selectedSkill.level >= selectedSkill.maxLevel ? (
                        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium flex items-center gap-2">
                            <Star size={16} /> Mastered
                        </div>
                    ) : (
                        <Button 
                            onClick={handleUpgrade} 
                            disabled={user.xp < selectedSkill.cost}
                            className={user.xp >= selectedSkill.cost ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "opacity-50"}
                        >
                            <ArrowUp size={16} />
                            Upgrade ({selectedSkill.cost} XP)
                        </Button>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};