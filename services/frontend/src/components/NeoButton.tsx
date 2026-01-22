import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  glow?: boolean;
}

export function NeoButton({ children, className, variant = 'primary', glow = false, ...props }: NeoButtonProps) {
  const baseStyles = "relative px-4 py-2 font-mono text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-100 active:scale-95 select-none";
  
  const variants = {
    primary: "text-neon-green border border-neon-green/30 hover:bg-neon-green/10 hover:border-neon-green hover:shadow-[0_0_15px_rgba(0,255,65,0.1)]",
    secondary: "text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]",
    danger: "text-red-500 border border-red-500/30 hover:bg-red-500/10 hover:border-red-500 hover:shadow-[0_0_15px_rgba(255,0,0,0.1)]",
    ghost: "text-neon-green/40 hover:text-white transition-colors",
  };

  return (
    <motion.button 
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        baseStyles, 
        variants[variant],
        className
      )} 
      {...(props as any)}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="opacity-40 select-none">[</span>
        {children}
        <span className="opacity-40 select-none">]</span>
      </div>
    </motion.button>
  );
}
