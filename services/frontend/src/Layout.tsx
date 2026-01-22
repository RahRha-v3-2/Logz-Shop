import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TerminalConsole } from './components/TerminalConsole';
import { LogzLogo } from './components/LogzLogo';

export function Layout() {
  return (
    <div className="min-h-screen bg-black text-neon-green crt-screen">
      <div className="digital-rain" />
      
      <Sidebar />
      
       <main className="ml-64 p-8 min-h-screen relative overflow-hidden flex flex-col">
         <div className="mb-8 flex justify-center">
           <LogzLogo className="text-4xl" />
         </div>
         <div className="flex-1">
           <Outlet />
         </div>
       </main>

      <TerminalConsole />
    </div>
  );
}
