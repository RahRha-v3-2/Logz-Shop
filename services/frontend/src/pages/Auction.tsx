import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuctionCard } from '../components/AuctionCard';
import { LiveChart } from '../components/LiveChart';
import { ActivityFeed, Activity } from '../components/ActivityFeed';
import { NeoCard } from '../components/NeoCard';
import { PaymentOptions } from '../components/PaymentOptions';
import { AuctionState } from '../types';
import clsx from 'clsx';

interface SystemLog {
  level: string;
  message: string;
  timestamp: string;
}

function Auction() {
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [priceFlash, setPriceFlash] = useState(false);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<{symbol: string, address: string} | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3002/ws');

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'AUCTION_SYNC':
          setAuctionState(data.state);
          const historyActivities = data.state.history.filter((h: any) => h).map((h: any) => ({
            user: h.user,
            action: 'PLACED_BID',
            amount: `Ξ ${(h.price / 1000).toFixed(3)}`,
            time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          })).reverse();
          setActivities(historyActivities);
          break;

        case 'AUCTION_TICK':
          setAuctionState(prev => prev ? {
            ...prev,
            timeLeft: data.timeLeft,
            currentPrice: data.price,
            highestBidder: data.highestBidder
          } : null);
          
          if (data.price !== (auctionState?.currentPrice || 0)) {
            setChartData(prev => {
              const newData = [...prev, { 
                time: new Date().toLocaleTimeString([], { second: '2-digit' }), 
                value: data.price 
              }];
              return newData.slice(-50);
            });
          }
          break;

        case 'BID_EVENT':
          setPriceFlash(true);
          setTimeout(() => setPriceFlash(false), 200);
          
          const newActivity = {
            user: data.user,
            action: 'PLACED_BID',
            amount: `Ξ ${(data.price / 1000).toFixed(3)}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 8));
          break;

        case 'AUCTION_NEW_ITEM':
          setAuctionState(data.state);
          setActivities([]);
          setChartData([]);
          break;

        case 'SYSTEM_LOG':
          setSystemLogs(prev => [data, ...prev].slice(0, 15));
          break;
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, [auctionState?.currentPrice]);

  return (
    <div className={`space-y-6 h-[calc(100vh-140px)] flex flex-col transition-colors duration-200 ${priceFlash ? 'bg-neon-green/5' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-neon-green/10 pb-8"
      >
        <div className="font-mono">
          <div className="text-neon-green text-xs font-bold mb-2 flex items-center gap-3">
             <span className="bg-neon-green text-black px-2 py-0.5 font-black uppercase">LIVE_UPLINK</span>
             <span className="opacity-40 tracking-[0.5em]">////////////////////</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">
            Auction_Relay<span className="text-neon-cyan animate-pulse">_</span>
          </h1>
          <div className="flex items-center gap-6 pl-0.5">
            <p className="text-neon-green/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              STATUS: <span className={clsx("px-1 border", isConnected ? "text-neon-green border-neon-green/30" : "text-red-500 border-red-500/30")}>
                {isConnected ? 'ONLINE' : 'CONNECTING'}
              </span>
            </p>
            <p className="text-neon-green/40 text-[10px] font-bold uppercase tracking-widest">
              HUB: <span className="text-neon-cyan">KRONOS_SYDN_01</span>
            </p>
          </div>
        </div>

        <div className="flex gap-10 font-mono items-end">
          <div className="text-right">
            <div className="text-[10px] text-neon-green/30 font-bold tracking-tight mb-1 uppercase">NODE_TRAFFIC</div>
            <div className="text-xl text-white font-black tracking-tighter glow-sm">[ 1.2k ]</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-neon-green/30 font-bold tracking-tight mb-1 uppercase">24H_TX_FLOW</div>
            <div className="text-xl text-neon-cyan font-black tracking-tighter glow-sm">[ Ξ 142 ]</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Active Item & Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          {auctionState ? (
            <AuctionCard 
              title={auctionState.item.title}
              price={auctionState.currentPrice / 1000} 
              timeLeft={auctionState.timeLeft}
              highestBidder={auctionState.highestBidder}
            />
          ) : (
            <div className="h-64 border border-neon-green/10 flex items-center justify-center font-mono text-[10px] text-neon-green/30 animate-pulse">
              [ AWAITING_BUFFER_SYNC... ]
            </div>
          )}

          <PaymentOptions
            selectedCurrency={selectedCurrency?.symbol}
            onCurrencySelect={setSelectedCurrency}
          />

          <NeoCard className="flex-1 min-h-0 bg-black overflow-hidden flex flex-col">
             <div className="px-1 h-full font-mono">
                 <div className="text-[10px] text-neon-green/40 mb-3 border-b border-neon-green/10 pb-1">
                    // realtime_bid_stream
                 </div>
                 <div aria-live="polite" aria-label="Real-time bid activities">
                   <ActivityFeed activities={activities} />
                 </div>
             </div>
          </NeoCard>
        </motion.div>

        {/* Right Column: Chart & Terminal */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 flex flex-col gap-6"
        >
          <NeoCard className="h-[60%] w-full bg-black relative">
            <div className="absolute top-4 right-4 z-10 flex gap-1">
              {['1H', '4H', '1D', 'ALL'].map(t => (
                <button key={t} className="px-2 py-0.5 text-[10px] font-mono border border-neon-green/20 text-neon-green/40 hover:text-white hover:border-neon-green transition-all">
                  [{t}]
                </button>
              ))}
            </div>
            <div className="absolute top-4 left-4 z-10 text-[10px] font-mono text-neon-green/30 uppercase flex items-center gap-2">
              <span className="animate-pulse">●</span> ANALYZING_MARKET_FLUX...
            </div>
            <div className="pt-8 h-full w-full">
              <LiveChart data={chartData} />
            </div>
          </NeoCard>

          {/* System Terminal Overlay */}
          <NeoCard className="flex-1 bg-black font-mono text-[10px] p-4 relative overflow-hidden group">
            <div className="flex items-center gap-2 text-neon-green/40 mb-3 border-b border-neon-green/10 pb-2">
              <span>$ cat /var/log/system/events_pipe</span>
            </div>
            <div className="space-y-1 h-[calc(100%-40px)] overflow-hidden opacity-80">
              <AnimatePresence initial={false}>
                {systemLogs.map((log, i) => (
                  <motion.div 
                    key={`${log.timestamp}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    <span className="text-neon-green/20">[{log.timestamp.split('T')[1].slice(0, 8)}]</span>
                    <span className={
                      log.level === 'CRITICAL' || log.level === 'WARN' ? 'text-red-500' : 
                      log.level === 'DEBUG' ? 'text-neon-cyan' : 'text-neon-green'
                    }>
                      {log.level}
                    </span>
                    <span className="text-neon-green/60">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isConnected && systemLogs.length === 0 && (
                <div className="text-neon-green/20 animate-pulse">AWAITING_BUFFER_FILL...</div>
              )}
            </div>
          </NeoCard>
        </motion.div>
      </div>
    </div>
   );
 }

export default Auction;
