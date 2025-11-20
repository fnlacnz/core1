
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserState } from '../types';
import { Settings, Edit2, Save, Award, Zap } from 'lucide-react';

interface ProfileProps {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
}

export const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempTitle, setTempTitle] = useState(user.title);
  const [tempAvatar, setTempAvatar] = useState(user.avatar);

  const handleSave = () => {
      setUser(prev => ({ ...prev, name: tempName, title: tempTitle, avatar: tempAvatar }));
      setIsEditing(false);
  };

  const avatars = ['👨‍🚀', '🧙‍♂️', '🥷', '🧛', '🧞', '🦊', '🐺', '🦁'];

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col items-center"
    >
       <div className="w-full max-w-3xl">
           <h2 className="text-4xl font-bold text-white font-['Outfit'] mb-8">Settings</h2>

           <div className="bg-[#1a1625]/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
               {/* Edit Button */}
               <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-20"
               >
                   {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
               </button>

               <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                   <div className="relative group">
                       <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-[2px]">
                           <div className="w-full h-full rounded-full bg-[#0f0c29] flex items-center justify-center text-6xl">
                               {isEditing ? tempAvatar : user.avatar}
                           </div>
                       </div>
                       {isEditing && (
                           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#1a1625] border border-white/10 rounded-xl p-2 flex gap-2 shadow-xl">
                               {avatars.map(a => (
                                   <button key={a} onClick={() => setTempAvatar(a)} className="hover:scale-125 transition-transform">{a}</button>
                               ))}
                           </div>
                       )}
                   </div>

                   <div className="text-center md:text-left">
                       {isEditing ? (
                           <div className="space-y-3">
                               <input 
                                value={tempName} 
                                onChange={e => setTempName(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-2xl font-bold text-white w-full outline-none focus:border-fuchsia-500"
                               />
                               <input 
                                value={tempTitle} 
                                onChange={e => setTempTitle(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-lg text-white/60 w-full outline-none focus:border-indigo-500"
                               />
                           </div>
                       ) : (
                           <>
                                <h3 className="text-3xl font-bold text-white font-['Outfit']">{user.name}</h3>
                                <p className="text-lg text-fuchsia-400 font-medium">{user.title}</p>
                           </>
                       )}
                   </div>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-2 gap-4 mt-12">
                   <div className="p-4 rounded-2xl bg-white/5 text-center border border-white/5">
                       <Award className="mx-auto text-amber-400 mb-2" size={24} />
                       <div className="text-2xl font-bold text-white">{user.streak}</div>
                       <div className="text-xs text-white/40 uppercase">Day Streak</div>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 text-center border border-white/5">
                       <Zap className="mx-auto text-fuchsia-400 mb-2" size={24} />
                       <div className="text-2xl font-bold text-white">{user.tasksCompleted}</div>
                       <div className="text-xs text-white/40 uppercase">Tasks Done</div>
                   </div>
               </div>
           </div>

           {/* Settings Section */}
           <div className="mt-8">
               <h3 className="text-xl font-bold text-white mb-4">System Preferences</h3>
               <div className="space-y-2">
                   {['Notifications', 'Sound Effects', 'Haptics', 'Public Profile'].map(setting => (
                       <div key={setting} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                           <span className="text-white/80">{setting}</span>
                           <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                               <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md" />
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </div>
    </motion.div>
  );
};
