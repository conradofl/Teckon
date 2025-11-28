import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../utils';
import { Plus, Search, Trash2, Upload, FileUp } from 'lucide-react';
import { Client } from '../types';

export const ClientManager: React.FC = () => {
  const { clients, addClient, deleteClient, importMockData } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    dob: '',
    contact: '',
    status: 'inativo' as 'ativo' | 'inativo',
    lastPurchaseDate: ''
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contact.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(newClient);
    setIsModalOpen(false);
    setNewClient({ name: '', dob: '', contact: '', status: 'inativo', lastPurchaseDate: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Base de Clientes</h2>
          <p className="text-slate-400">Gerencie sua lista de contatos para automação.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={importMockData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors text-sm font-medium"
          >
            <FileUp size={16} />
            Simular Importação CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-500 hover:bg-cyber-400 text-black rounded-lg transition-colors font-bold text-sm"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-cyber-800/40 border border-cyber-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-cyber-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou contato..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-cyber-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Data Nasc.</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Última Compra</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-700/50">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum cliente encontrado. Importe dados ou adicione um novo.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-cyber-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{client.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{formatDate(client.dob)}</td>
                    <td className="px-6 py-4 text-slate-300">{client.contact}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        client.status === 'ativo' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {client.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">{formatDate(client.lastPurchaseDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteClient(client.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cyber-800 border border-cyber-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Adicionar Novo Cliente</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyber-500 outline-none"
                  value={newClient.name}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm text-slate-400 mb-1">Data de Nascimento</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyber-500 outline-none"
                    value={newClient.dob}
                    onChange={e => setNewClient({...newClient, dob: e.target.value})}
                  />
                </div>
                 <div>
                  <label className="block text-sm text-slate-400 mb-1">Última Compra</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyber-500 outline-none"
                    value={newClient.lastPurchaseDate}
                    onChange={e => setNewClient({...newClient, lastPurchaseDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email / WhatsApp</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyber-500 outline-none"
                  value={newClient.contact}
                  onChange={e => setNewClient({...newClient, contact: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyber-500 outline-none"
                  value={newClient.status}
                  onChange={e => setNewClient({...newClient, status: e.target.value as any})}
                >
                  <option value="inativo">Inativo</option>
                  <option value="ativo">Ativo</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-cyber-500 text-black font-bold rounded-lg hover:bg-cyber-400 transition-colors"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};