import React from 'react';
import { useStore } from '../context/StoreContext';
import { isBirthdayToday } from '../utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, UserX, Gift, Send } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-cyber-800/40 border border-cyber-700/50 p-6 rounded-2xl backdrop-blur-sm hover:border-cyber-500/30 transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-100 font-mono">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-opacity-10 ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 opacity-80`} />
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { clients } = useStore();

  const totalClients = clients.length;
  const inactiveClients = clients.filter(c => c.status === 'inativo').length;
  const birthdaysToday = clients.filter(c => isBirthdayToday(c.dob)).length;
  const totalSent = clients.reduce((acc, curr) => acc + curr.history.length, 0);

  // Mock data for the chart since we don't store historical dates deeply
  const data = [
    { name: 'Seg', sent: 12, reactivated: 4 },
    { name: 'Ter', sent: 19, reactivated: 6 },
    { name: 'Qua', sent: 8, reactivated: 2 },
    { name: 'Qui', sent: 24, reactivated: 8 },
    { name: 'Sex', sent: 15, reactivated: 5 },
    { name: 'Sáb', sent: 5, reactivated: 1 },
    { name: 'Dom', sent: 2, reactivated: 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold mb-2">Visão Geral</h2>
        <p className="text-slate-400">Monitoramento em tempo real da base de clientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Clientes" 
          value={totalClients} 
          icon={Users} 
          color="bg-blue-500 text-blue-400" 
        />
        <StatCard 
          title="Inativos" 
          value={inactiveClients} 
          icon={UserX} 
          color="bg-rose-500 text-rose-400" 
        />
        <StatCard 
          title="Aniversários Hoje" 
          value={birthdaysToday} 
          icon={Gift} 
          color="bg-amber-500 text-amber-400" 
        />
        <StatCard 
          title="Mensagens Enviadas" 
          value={totalSent} 
          icon={Send} 
          color="bg-emerald-500 text-emerald-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-cyber-800/40 border border-cyber-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ActivityIcon /> Performance da Semana
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="sent" name="Enviadas" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reactivated" name="Reativados" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-cyber-800/40 border border-cyber-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Status da Base</h3>
          <div className="flex items-center justify-center h-48 relative">
            {/* Simple Circular Progress Simulation */}
            <div className="relative w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-8 border-rose-500 border-t-transparent -rotate-45"
                style={{ clipPath: `inset(0 0 0 ${100 - (inactiveClients / (totalClients || 1) * 100)}%)` }} 
              ></div>
               <div className="text-center">
                <span className="text-2xl font-bold text-white block">
                  {totalClients > 0 ? Math.round((inactiveClients / totalClients) * 100) : 0}%
                </span>
                <span className="text-xs text-slate-400">Inatividade</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Ativos
                </span>
                <span className="font-mono text-white">{totalClients - inactiveClients}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div> Inativos
                </span>
                <span className="font-mono text-white">{inactiveClients}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityIcon = () => (
  <svg className="w-5 h-5 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);