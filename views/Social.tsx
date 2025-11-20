
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserState, GuildMember } from '../types';
import { Shield, Crown, CheckCircle } from 'lucide-react';

interface SocialProps {
  user: UserState;
}

// Simulated "Friends" Data
const GUILD_MEMBERS: GuildMember[] = [
    { id: 'bot-1', name: 'Marcus A.', avatar: '🦁', tasksCompleted: 42, status: 'online' },
    { id: 'bot-2', name: 'Elena R.', avatar: '🚀', tasksCompleted: 85, status: 'focusing' },
    { id: 'bot-3', name: 'Sarah K.', avatar: '⚡', tasksCompleted: 15, status: 'offline' },
    { id: 'bot-4', name: 'David Chen', avatar: '🔮', tasksCompleted: 63, status: 'online' },
];

export const Social: React.FC<SocialProps> = ({ user }) => {
  
  // Ranking Logic based on Tasks Completed
  const leaderboard = useMemo(() => {
      const userAsMember: GuildMember = {
          id: user.id,
          name: 'You',
          avatar: user.avatar,
          tasksCompleted: user.tasksCompleted,
          status: 'online',
          isUser: true
      };

      // Sort descending by Tasks Completed
      const allMembers = [...GUILD_MEMBERS, userAsMember].sort((a, b) => b.tasksCompleted - a.tasksCompleted);
      return allMembers;
  }, [user.tasksCompleted]);

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar"
    >
       <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
           <div>
               <h2 className="text-4xl font-bold text-white font-['Outfit']">Leaderboard</h2>
               <p className="text-white/40 mt-1">Ranking by Tasks Executed.</p>
           </div>
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
           {/* Main Content */}
           <div className="lg:col-span-2 space-y-4">
                {/* Top 3 Podium */}
                <div className="flex items-end justify-center gap-4 mb-8 py-8">
                    {leaderboard.slice(0, 3).map((member, i) => (
                        <div key={member.id} className={`flex flex-col items-center ${i === 1 ? 'order-2 -mt-8' : i === 0 ? 'order-1' : 'order-3'}`}>
                            <div className="relative">
                                {i === 1 && <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-400" fill="currentColor" />}
                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center text-3xl bg-[#1a1625] relative z-10 ${member.isUser ? 'border-fuchsia-500 shadow-[0_0_20px_rgba(192,38,211,0.5)]' : i === 1 ? 'border-amber-400' : 'border-white/10'}`}>
                                    {member.avatar}
                                </div>
                                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-8 h-8 -mt-4 rounded-full border-4 border-[#0f0c29] flex items-center justify-center text-xs font-bold text-white ${i === 1 ? 'bg-amber-400' : 'bg-white/20'}`}>
                                    {i === 1 ? 1 : i === 0 ? 2 : 3}
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <p className={`font-bold ${member.isUser ? 'text-fuchsia-400' : 'text-white'}`}>{member.name}</p>
                                <p className="text-xs text-white/40">{member.tasksCompleted} Tasks</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Full List */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    {leaderboard.map((member, idx) => (
                        <div key={member.id} className={`flex items-center justify-between p-4 border-b border-white/5 transition-colors ${member.isUser ? 'bg-fuchsia-500/10' : 'hover:bg-white/5'}`}>
                            <div className="flex items-center gap-4">
                                <span className="text-white/30 w-6 text-center font-mono">{idx + 1}</span>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                                    {member.avatar}
                                </div>
                                <div>
                                    <p className={`font-medium ${member.isUser ? 'text-fuchsia-400' : 'text-white'}`}>{member.name}</p>
                                    <p className="text-xs text-white/30 capitalize">{member.status}</p>
                                </div>
                            </div>
                            <div className="font-mono text-white font-bold flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-400" />
                                {member.tasksCompleted}
                            </div>
                        </div>
                    ))}
                </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-6">
               <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 border border-white/10">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield size={18} /> Your Rank</h3>
                   <div className="text-5xl font-bold text-white mb-1 font-['Space_Grotesk']">
                       #{leaderboard.findIndex(m => m.id === user.id) + 1}
                   </div>
                   <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Global Position</p>
                   
                   <div className="p-4 rounded-xl bg-black/20 text-sm text-white/70 leading-relaxed border border-white/5">
                       Rankings are determined solely by total task output. Execute more to climb.
                   </div>
               </div>
           </div>
       </div>
    </motion.div>
  );
};
