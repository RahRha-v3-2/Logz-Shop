import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LogzLogoProps {
  className?: string;
}

export function LogzLogo({ className = "" }: LogzLogoProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'LOGZ';

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        // Start cursor blinking after typing is complete
        const cursorInterval = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
      }
    }, 150);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div className={`font-mono text-neon-cyan ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        <span className="text-neon-green/60 mr-2">$</span>
        <span className="text-white">
          {displayedText}
        </span>
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-neon-cyan ml-1"
          >
            █
          </motion.span>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-[8px] text-neon-green/40 tracking-[0.2em] uppercase mt-1"
      >
        TERMINAL_MARKET
      </motion.div>
    </div>
  );
}