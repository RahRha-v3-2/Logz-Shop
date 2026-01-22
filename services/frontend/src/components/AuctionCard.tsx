import { motion } from 'framer-motion';
import clsx from 'clsx';
import { memo } from 'react';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';

const AuctionCardComponent = ({
  title = "AWAITING_ITEM...",
  price = 0,
  timeLeft = 0,
  highestBidder = "---"
}: {
  title?: string;
  price?: number;
  timeLeft?: number;
  highestBidder?: string;
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <NeoCard className="border-neon-cyan/30 bg-black/60 font-mono relative overflow-hidden">
      <div className="absolute top-0 right-0 px-3 py-1 bg-neon-cyan text-black text-[10px] font-bold tracking-tighter">
        LIVE_AUCTION_RECV
      </div>

      <div className="flex flex-col gap-6 mt-4">
        <div className="border-b border-neon-cyan/20 pb-4">
          <div className="text-neon-cyan/40 text-[9px] font-bold tracking-[0.3em] mb-2 uppercase italic">PROTOCOL::ASSET_TRANSIT</div>
          <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-3">
             {title}
          </h2>
        </div>

        <div className="flex justify-between items-end bg-neon-cyan/5 p-4 border border-neon-cyan/10">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-neon-cyan/40 font-bold uppercase tracking-tight">CURRENT_VALUATION</span>
            <motion.div 
              key={price}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white tracking-tighter glow-sm"
            >
              Ξ {price.toFixed(3)}
            </motion.div>
          </div>
          <div className="text-right">
             <span className="text-[9px] text-neon-cyan/40 font-bold uppercase block mb-1">HIGH_BIDDER</span>
             <span className="text-xs text-neon-cyan font-bold bg-neon-cyan/20 px-2 py-0.5 select-none">{highestBidder}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-16">
          <div className="border border-neon-cyan/20 flex flex-col justify-center items-center bg-black/40">
            <div className="text-[9px] text-neon-cyan/30 uppercase tracking-tighter mb-1">T_REMAINING</div>
            <div className={clsx("text-sm font-bold tracking-[0.2em]", timeLeft < 15 ? "text-red-500 animate-pulse" : "text-white")}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="border border-neon-cyan/20 flex flex-col justify-center items-center bg-black/40">
            <div className="text-[9px] text-neon-cyan/30 uppercase tracking-tighter mb-1">PARTICIPANTS</div>
            <div className="text-sm text-neon-green font-bold tracking-[0.2em]">12_ACTIVE</div>
          </div>
        </div>

        <NeoButton variant="secondary" className="w-full justify-center py-3 font-bold tracking-[0.4em] text-xs border-neon-cyan hover:bg-neon-cyan hover:text-black transition-all">
          [ SUBMIT_BID_SEQUENCE ]
        </NeoButton>
      </div>
    </NeoCard>
  );
};

export const AuctionCard = memo(AuctionCardComponent);
