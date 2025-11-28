import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [localConfig, setLocalConfig] = useState(config);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold">Configurações</h2>
        <p className="text-slate-400">Personalize o comportamento padrão do robô.</p>
      </div>

      <form onSubmit={handleSave} className="bg-cyber-800/40 border border-cyber-700/50 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
          <input 
            type="text" 
            value={localConfig.companyName}
            onChange={e => setLocalConfig({...localConfig, companyName: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-cyber-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Oferta Padrão de Aniversário</label>
          <input 
            type="text" 
            value={localConfig.defaultOffer}
            onChange={e => setLocalConfig({...localConfig, defaultOffer: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-cyber-500 outline-none transition-colors"
            placeholder="Ex: 10% OFF"
          />
          <p className="text-xs text-slate-500 mt-1">Isso será usado caso a AI falhe ou no template padrão.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Template Padrão</label>
          <div className="relative">
            <textarea 
              value={localConfig.template}
              onChange={e => setLocalConfig({...localConfig, template: e.target.value})}
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-cyber-500 outline-none transition-colors font-mono text-sm"
            />
            <div className="absolute top-2 right-2 text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
              [NOME], [EMPRESA], [OFERTA ESPECIAL], [DATA]
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Variáveis disponíveis para substituição automática.</p>
        </div>

        <div className="pt-4 flex items-center justify-between">
            <div className="text-sm">
                {saved && <span className="text-emerald-400 font-bold animate-pulse">Configurações salvas!</span>}
            </div>
            <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-cyber-500 text-black font-bold rounded-lg hover:bg-cyber-400 transition-colors"
            >
                <Save size={18} />
                Salvar Alterações
            </button>
        </div>
      </form>
    </div>
  );
};