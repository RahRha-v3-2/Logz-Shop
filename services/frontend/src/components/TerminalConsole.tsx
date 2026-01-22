import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface TerminalConsoleProps {
  onCommand?: (cmd: string) => void;
}

export function TerminalConsole({ onCommand }: TerminalConsoleProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['SESSION_INITIALIZED... v2.1.0-organic', 'TYPE /help FOR PROTOCOL_LIST']);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const fullCmd = input.trim();
    const cmd = fullCmd.toLowerCase();
    
    setCommandHistory(prev => [...prev, fullCmd]);
    setHistoryIndex(-1);
    setHistory(prev => [...prev, `[USER@KRONOS]~ ${fullCmd}`]);

    if (cmd === '/help') {
      setHistory(prev => [...prev, 
        ':: PROTOCOL_LIST ::', 
        '  /ls      - BUFFER_MARKET_INDEX', 
        '  /auction - RECV_LIVE_STREAM', 
        '  /clear   - FLUSH_CONSOLE_BUFFER', 
        '  /exit    - DEACTIVATE_TERMINAL',
        '  /status  - SYSTEM_INTEGRITY_CHECK'
      ]);
    } else if (cmd === '/ls') {
      setHistory(prev => [...prev, 'OK: ACCESSING_MARKET_INDEX...', 'FETCHING_METADATA...']);
      setTimeout(() => {
        setHistory(prev => [...prev, 
          '----------------------------------------',
          'TYPE            ID          RELIABILITY  ',
          'DB_DUMP         0xA12F      98%         ',
          'ADMIN_PANEL     0xB44E      92%         ',
          'SERVER_ACCESS   0xC99D      88%         ',
          'CLOUD_KEYS      0xD33C      95%         ',
          '----------------------------------------',
          'OK: 4 ENTRIES_FOUND'
        ]);
        navigate('/');
      }, 800);
    } else if (cmd === '/auction') {
      setHistory(prev => [...prev, 'OK: TUNNELING_TO_AUCTION_RELAY...', 'ESTABLISHING_HANDSHAKE...']);
      setTimeout(() => {
        navigate('/auction');
        setHistory(prev => [...prev, 'STATUS: SECURE_LINK_ESTABLISHED']);
      }, 800);
    } else if (cmd === '/clear') {
      setHistory(['CONSOLE_BUFFER_FLUSHED']);
    } else if (cmd === '/status') {
      setHistory(prev => [...prev, 
        'NODE: KRONOS_SYDN_01', 
        'STATUS: NOMINAL', 
        'LATENCY: 12ms', 
        'ENCRYPTION: AES-256-GCM',
        'TERMINAL: v2.1.0-organic'
      ]);
    } else if (cmd === '/exit') {
      setIsOpen(false);
    } else {
      setHistory(prev => [...prev, `ERROR: UNDEFINED_PROTO "${cmd}"`]);
    }

    if (onCommand) onCommand(cmd);
    setInput('');
  };

  return (
    <div className="fixed bottom-0 right-0 w-full max-w-2xl z-[60] px-8 pb-4">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0, y: 20 }}
            animate={{ height: '350px', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 20 }}
            className="flex flex-col font-mono text-[11px] bg-black border border-neon-green shadow-[0_0_30px_rgba(0,255,65,0.15)] relative overflow-hidden"
          >
            {/* Header */}
            <div className="bg-neon-green text-black px-3 py-1 flex justify-between items-center font-bold">
              <span className="flex items-center gap-2">
                <Terminal className="w-3 h-3" /> TERMINAL_LINK // v2.1.0
              </span>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black hover:text-neon-green px-1 transition-colors">
                [X]
              </button>
            </div>

            {/* Output */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide bg-black/90"
            >
              {history.map((line, i) => (
                <div key={i} className={clsx(
                  "leading-relaxed tracking-wider",
                  line.startsWith('[USER') ? 'text-neon-cyan' : 
                  line.startsWith('ERROR') ? 'text-red-500' : 
                  line.startsWith('::') ? 'text-white font-bold' : 'text-neon-green/80'
                )}>
                  {line}
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleCommand} className="p-3 border-t border-neon-green/30 bg-black">
              <div className="flex gap-2">
                <span className="text-neon-green font-bold">▶</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-white flex-1 caret-neon-green placeholder:opacity-20"
                  placeholder="EXECUTE_CMD..."
                />
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(true)}
            className="bg-black border border-neon-green px-4 py-2 text-neon-green text-[10px] font-bold tracking-[0.2em] shadow-[0_0_15px_rgba(0,255,65,0.1)] hover:bg-neon-green hover:text-black transition-all flex items-center gap-2 ml-auto"
          >
            <Terminal className="w-3 h-3" /> [ TERMINAL_ACCESS ]
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
