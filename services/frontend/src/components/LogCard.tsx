import clsx from 'clsx';
import { LogItem } from '../types';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';

interface LogCardProps {
  item: LogItem;
  onPurchase?: (item: LogItem) => void;
}

export function LogCard({ item, onPurchase }: LogCardProps) {
  return (
    <NeoCard hoverEffect className="group flex flex-col h-full font-mono border-neon-green/30 bg-black/40">
      <div className="flex justify-between items-start mb-4 border-b border-neon-green/20 pb-3">
        <div className="flex flex-col">
          <div className="text-neon-cyan text-[9px] font-bold tracking-widest mb-1 opacity-60">ID://{item.id.split('-')[0].toUpperCase()}</div>
          <h3 className="text-white text-sm font-bold tracking-tight uppercase group-hover:text-neon-green transition-colors">
            {item.title}
          </h3>
          <span className="text-[9px] text-neon-green/50 uppercase tracing-tighter mt-1 font-semibold">
            {item.source} » {item.region}
          </span>
        </div>
        <div className="text-right">
          <div className="text-neon-green font-bold text-base tracking-tighter glow-sm animate-pulse-slow">
            Ξ {(item.price / 1000).toFixed(3)}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6 flex-1 text-[10px]">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-neon-green/30">RISK_ASSESS</span>
            <span className={clsx(
              "font-bold text-[10px] items-center flex gap-1",
              item.risk === 'CRITICAL' ? "text-red-500" :
              item.risk === 'HIGH' ? "text-orange-500" :
              "text-yellow-500"
            )}>
              <span className="opacity-50">[</span>{item.risk}<span className="opacity-50">]</span>
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[8px] text-neon-green/30">DATA_VOL</span>
            <span className="text-neon-cyan font-bold uppercase">{item.size}</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-neon-green/5 pt-3">
          <div className="flex justify-between text-[9px] font-bold">
            <span className="text-neon-green/40 italic">RELIABILITY_INDEX</span>
            <span className={item.reliability > 80 ? "text-neon-green" : "text-yellow-500"}>
              {item.reliability}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-neon-green/5 rounded-none relative overflow-hidden border border-neon-green/10">
            <div 
              className={clsx(
                "h-full transition-all duration-1000 ease-out",
                item.reliability > 80 ? "bg-neon-green" : "bg-yellow-500"
              )}
              style={{ width: `${item.reliability}%` }}
            />
          </div>
        </div>

        <div className="text-[9px] text-neon-green/20 font-light italic">
           BUFFER_TS: {item.leakedAt}
        </div>
      </div>

       <NeoButton
         variant="primary"
         onClick={() => onPurchase?.(item)}
         className="w-full justify-center text-[11px] font-bold tracking-[0.2em] border-neon-green hover:shadow-[0_0_20px_rgba(0,255,65,0.2)]"
       >
         [ INIT_ACQUISITION ]
       </NeoButton>
    </NeoCard>
  );
}
