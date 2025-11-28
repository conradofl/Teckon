import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Bot, Settings, Activity } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-cyber-500/10 text-cyber-400 border border-cyber-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
          : 'text-slate-400 hover:bg-cyber-800/50 hover:text-slate-200'
      }`
    }
  >
    <Icon size={20} className="transition-transform group-hover:scale-110" />
    <span className="font-medium tracking-wide">{label}</span>
  </NavLink>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-cyber-900 text-slate-200 overflow-hidden font-sans selection:bg-cyber-500/30">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-cyber-700/50 bg-cyber-900/95 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyber-500 to-cyber-accent flex items-center justify-center shadow-lg shadow-cyber-500/20">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Reactivate
                <span className="text-cyber-400">AI</span>
              </h1>
              <span className="text-xs text-slate-500 font-mono">v2.0.4 ONLINE</span>
            </div>
          </div>
          
          <nav className="space-y-2">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/campaign" icon={Activity} label="Auto-Piloto" />
            <SidebarItem to="/clients" icon={Users} label="Base de Clientes" />
            <SidebarItem to="/settings" icon={Settings} label="Configurações" />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-cyber-700/50">
          <div className="bg-cyber-800/50 rounded-lg p-3 border border-cyber-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>System Health</span>
              <span className="text-green-400">98%</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-400 h-full w-[98%] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};