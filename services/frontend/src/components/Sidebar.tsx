import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LogzLogo } from './LogzLogo';

export function Sidebar() {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-black border-r border-neon-green/10 flex flex-col z-50 font-mono overflow-hidden">
       <div className="p-6 border-b border-neon-green/10">
         <div className="mb-4">
           <LogzLogo className="text-xl justify-center" />
         </div>
         <div className="text-[9px] text-neon-green/30 tracking-tighter">SECURE_NODE: KRONOS_01</div>
       </div>

      <nav className="flex-1 p-4 space-y-4 pt-8">
        <div className="space-y-1">
          <div className="text-[10px] text-neon-green/20 mb-2 px-2">// nav_modules</div>
          <NavLink to="/" className={({ isActive }) => clsx("flex items-center gap-2 px-3 py-1 text-xs transition-all", isActive ? "text-neon-green font-bold bg-neon-green/10" : "text-neon-green/40 hover:text-white")}>
             <span className="opacity-50">{'{'}</span> MARKETPLACE <span className="opacity-50">{'}'}</span>
          </NavLink>
          <NavLink to="/auction" className={({ isActive }) => clsx("flex items-center gap-2 px-3 py-1 text-xs transition-all", isActive ? "text-neon-green font-bold bg-neon-green/10" : "text-neon-green/40 hover:text-white")}>
             <span className="opacity-50">{'{'}</span> LIVE_AUCTION <span className="opacity-50">{'}'}</span>
          </NavLink>
        </div>
        
        <div className="space-y-1">
          <div className="text-[10px] text-neon-green/20 mt-6 mb-2 px-2">// user_data</div>
          <NavLink to="/profile" className={({ isActive }) => clsx("flex items-center gap-2 px-3 py-1 text-xs transition-all", isActive ? "text-neon-green font-bold bg-neon-green/10" : "text-neon-green/40 hover:text-white")}>
             <span className="opacity-50">[</span> IDENTITY <span className="opacity-50">]</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => clsx("flex items-center gap-2 px-3 py-1 text-xs transition-all", isActive ? "text-neon-green font-bold bg-neon-green/10" : "text-neon-green/40 hover:text-white")}>
             <span className="opacity-50">[</span> CONFIG <span className="opacity-50">]</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-neon-green/10 bg-black/40 space-y-4">
        <div className="px-2 space-y-2">
          <div className="flex justify-between text-[8px] font-mono text-neon-green/20">
            <span>MEM_USAGE</span>
            <span className="text-neon-cyan">[ 42% ]</span>
          </div>
          <div className="h-0.5 bg-neon-green/5 rounded-full overflow-hidden">
            <div className="h-full bg-neon-cyan w-[42%] shadow-[0_0_5px_theme(colors.neon-cyan)]" />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-neon-green/20">
            <span>NET_SYNC</span>
            <span className="text-neon-green">[ OK ]</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 border border-neon-green/10 py-2">
          <div className="w-8 h-8 bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green font-mono text-xs font-bold">
            00
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-neon-green font-bold">OPERATOR_ZER0</span>
            <span className="text-[9px] text-neon-cyan/50 tracking-tighter">CR: 45,290.00</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
