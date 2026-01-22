import { motion, AnimatePresence } from 'framer-motion';

export interface Activity {
  user: string;
  action: string;
  amount: string;
  time: string;
}

export function ActivityFeed({ activities = [] }: { activities?: Activity[] }) {
  return (
    <div className="h-full flex flex-col font-mono">
      <div className="text-[10px] text-neon-green/30 mb-4 border-b border-neon-green/10 pb-2 flex justify-between uppercase italic">
        <span>// recv_activity_pipe</span>
        <span className="text-neon-green/60 animate-pulse">[! LIVE]</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {activities.map((activity, i) => (
              <motion.div 
                key={`${activity.user}-${activity.time}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center text-[10px] gap-2 py-0.5 border-l border-transparent hover:border-neon-green hover:bg-neon-green/5 transition-all cursor-default"
              >
                <span className="text-neon-green/30">{activity.time}</span>
                <span className="text-neon-cyan font-bold">[{activity.user}]</span>
                <span className="text-neon-green/60 uppercase">{activity.action}</span>
                {activity.amount && <span className="text-white ml-auto">{activity.amount}</span>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
