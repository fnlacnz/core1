import React from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-6 bg-[#050508]">
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         className="relative z-10 text-center max-w-md w-full"
       >
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <Box size={40} className="text-black" strokeWidth={2} />
          </div>

          <h1 className="text-6xl font-bold text-white font-['Outfit'] mb-4 tracking-tighter">NukeCore</h1>
          <p className="text-xl text-gray-400 font-['Space_Grotesk'] mb-12">Operating System for High Performers.</p>

          <div className="space-y-4">
              <button 
                onClick={onLogin}
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-white/10"
              >
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                  Continue with Google
              </button>
              
              <button className="w-full bg-white/5 border border-white/10 text-white font-medium py-4 rounded-xl hover:bg-white/10 transition-all">
                  Enter as Guest
              </button>
          </div>

          <p className="mt-8 text-xs text-gray-600 uppercase tracking-widest">Protocol v2.2 • Secure Login</p>
       </motion.div>
    </div>
  );
};