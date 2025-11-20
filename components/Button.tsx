import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const baseStyles = "relative overflow-hidden px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide";
  
  const variants = {
    primary: "bg-white hover:bg-gray-200 text-black shadow-lg shadow-white/5 border border-transparent active:scale-[0.98]",
    secondary: "bg-white/5 hover:bg-white/10 border border-white/10 text-white active:bg-white/20",
    ghost: "bg-transparent border-transparent hover:bg-white/5 text-gray-400 hover:text-white",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </motion.button>
  );
};