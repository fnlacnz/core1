import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050508]">
      {/* Subtle Noise Texture for Texture feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
      
      {/* Very subtle ambient gradient for dark mode depth */}
      <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-indigo-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-purple-900/10 rounded-full blur-[120px]" />
    </div>
  );
};