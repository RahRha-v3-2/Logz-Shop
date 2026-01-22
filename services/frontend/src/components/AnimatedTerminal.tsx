import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AnimatedTerminalProps {
  className?: string;
}

export function AnimatedTerminal({ className = "" }: AnimatedTerminalProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const terminalLines = [
    '$ LOGZ',
    'Initializing TUI Terminal...',
    'Loading modules... [██████████] 100%',
    'System ready.',
    'Welcome to LOGZ TERMINAL MARKET',
    '> '
  ];

  useEffect(() => {
    let charIndex = 0;
    let lineIndex = 0;

    const typeInterval = setInterval(() => {
      if (lineIndex < terminalLines.length) {
        const currentText = terminalLines[lineIndex];
        if (charIndex < currentText.length) {
          setCurrentLine(currentText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          // Line complete
          setLines(prev => [...prev, currentText]);
          setCurrentLine('');
          charIndex = 0;
          lineIndex++;
          // Pause between lines
          setTimeout(() => {}, 500);
        }
      } else {
        clearInterval(typeInterval);
        // Start cursor blinking on last line
        const cursorInterval = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
      }
    }, lineIndex === 0 ? 100 : 50); // Faster typing for LOGZ

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div className={`font-mono text-left bg-black/80 border border-neon-green/30 p-4 rounded-lg shadow-lg ${className}`}>
      <div className="text-neon-green text-xs mb-2">// TERMINAL SESSION STARTED</div>
      <div className="space-y-1">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`text-neon-cyan ${index === 0 ? 'text-lg font-bold' : 'text-sm'}`}
          >
            {line}
          </motion.div>
        ))}
        {currentLine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neon-cyan text-sm"
          >
            {currentLine}
          </motion.div>
        )}
        {currentLineIndex === terminalLines.length - 1 && showCursor && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-neon-cyan ml-1"
          >
            █
          </motion.span>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
        className="text-[8px] text-neon-green/60 tracking-widest uppercase mt-4 text-center"
      >
        VERBOSE TERMINAL ANIMATION | EYE-CATCHING TUI STYLE
      </motion.div>
    </div>
  );
}