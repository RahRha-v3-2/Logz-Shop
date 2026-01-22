import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface NeoCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function NeoCard({ children, className, hoverEffect = false }: NeoCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "border border-neon-green/30 p-6 relative group ascii-border",
        hoverEffect && "hover:border-neon-green transition-colors",
        className
      )} 
    >
      {/* ASCII Corner Decorators */}
      <div className="absolute top-[-0.5rem] left-[-0.25rem] text-neon-green font-bold z-10 bg-black px-1 group-hover:neon-flicker transition-opacity">+</div>
      <div className="absolute top-[-0.5rem] right-[-0.25rem] text-neon-green font-bold z-10 bg-black px-1 group-hover:neon-flicker transition-opacity">+</div>
      <div className="absolute bottom-[-0.5rem] left-[-0.25rem] text-neon-green font-bold z-10 bg-black px-1 group-hover:neon-flicker transition-opacity">+</div>
      <div className="absolute bottom-[-0.5rem] right-[-0.25rem] text-neon-green font-bold z-10 bg-black px-1 group-hover:neon-flicker transition-opacity">+</div>
      
      <div className="relative z-20">
        {children}
      </div>
    </motion.div>
  );
}
