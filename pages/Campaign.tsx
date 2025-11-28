import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { isBirthdayToday, formatDate } from '../utils';
import { generatePersonalizedMessage } from '../services/ai';
import { Sparkles, Send, CheckCircle, RefreshCw, AlertCircle, Bot, MessageSquare } from 'lucide-react';
import { Client } from '../types';

export const Campaign: React.FC = () => {
  const { clients, config, logMessage } = useStore();
  const [targets, setTargets] = useState<Client[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [generatedMessages, setGeneratedMessages] = useState<{[key: string]: string}>({});
  const [aiLoading, setAiLoading] = useState<{[key: string]: boolean}>({});

  // 1. Filter clients: Birthday TODAY + INACTIVE
  useEffect(() => {
    const todayTargets = clients.filter(c => 
      c.status === 'inativo' && isBirthdayToday(c.dob)
    );
    setTargets(todayTargets);
    
    // Pre-fill standard messages
    const initialMessages: any = {};
    todayTargets.forEach(t => {
       initialMessages[t.id] = config.template
         .replace('[NOME]', t.name)
         .replace('[EMPRESA]', config.companyName)
         .replace('[OFERTA ESPECIAL]', config.defaultOffer)
         .replace('[DATA]', '7 dias');
    });
    setGeneratedMessages(initialMessages);
  }, [clients, config]);

  const handleGenerateAI = async (client: Client, style: 'friendly' | 'formal' | 'funny') => {
    setAiLoading(prev => ({ ...prev, [client.id]: true }));
    try {
      const msg = await generatePersonalizedMessage(client.name, config.companyName, config.defaultOffer, style);
      setGeneratedMessages(prev => ({ ...prev, [client.id]: msg }));
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(prev => ({ ...prev, [client.id]: false }));
    }
  };

  const handleSend = async (client: Client) => {
    setProcessingId(client.id);
    
    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    logMessage(client.id, generatedMessages[client.id]);
    setProcessingId(null);
  };

  // Check if a client has already received a message TODAY
  const hasReceivedToday = (client: Client) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return client.history.some(h => h.date.startsWith(todayStr) && h.type === 'birthday');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-500/10 text-cyber-400 border border-cyber-500/20 text-xs font-mono mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-500"></span>
          </span>
          PROCESSADOR AUTOMÁTICO
        </div>
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">
          Central de Reativação
        </h2>
        <p className="text-slate-400">
          O robô identificou <strong className="text-white">{targets.length}</strong> aniversariantes inativos hoje.
        </p>
      </div>

      {targets.length === 0 ? (
        <div className="bg-cyber-800/40 border border-dashed border-cyber-700 rounded-2xl p-12 text-center">
          <CheckCircle className="mx-auto w-16 h-16 text-emerald-500/50 mb-4" />
          <h3 className="text-xl font-bold text-slate-200">Tudo limpo por aqui!</h3>
          <p className="text-slate-400 mt-2">Nenhum cliente inativo faz aniversário hoje.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {targets.map(client => {
            const isSent = hasReceivedToday(client);
            const isLoading = processingId === client.id;
            const isAiThinking = aiLoading[client.id];

            return (
              <div key={client.id} className={`relative bg-cyber-800/40 border ${isSent ? 'border-emerald-500/30' : 'border-cyber-700/50'} rounded-2xl p-6 transition-all duration-300`}>
                {/* Status Badge */}
                {isSent && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                    <CheckCircle size={14} /> ENVIADO
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Client Info */}
                  <div className="md:w-1/3 space-y-3 border-b md:border-b-0 md:border-r border-cyber-700/50 pb-4 md:pb-0 md:pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">
                        🎂
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white leading-tight">{client.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">ID: {client.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mt-4 bg-slate-900/50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contato:</span>
                        <span className="text-slate-300">{client.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Última Compra:</span>
                        <span className="text-slate-300">{formatDate(client.lastPurchaseDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status:</span>
                        <span className="text-rose-400 font-medium">INATIVO</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Area */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <MessageSquare size={14} /> Conteúdo da Mensagem
                      </label>
                      
                      {!isSent && (
                        <div className="flex gap-2">
                           <button 
                            onClick={() => handleGenerateAI(client, 'friendly')}
                            disabled={isAiThinking}
                            className="text-xs flex items-center gap-1 bg-cyber-500/10 text-cyber-400 px-2 py-1 rounded hover:bg-cyber-500/20 transition-colors disabled:opacity-50"
                          >
                            <Sparkles size={12} /> AI Friendly
                          </button>
                          <button 
                            onClick={() => handleGenerateAI(client, 'funny')}
                            disabled={isAiThinking}
                            className="text-xs flex items-center gap-1 bg-cyber-500/10 text-cyber-400 px-2 py-1 rounded hover:bg-cyber-500/20 transition-colors disabled:opacity-50"
                          >
                            <Sparkles size={12} /> AI Divertido
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      {isAiThinking && (
                        <div className="absolute inset-0 bg-slate-900/80 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-2">
                             <RefreshCw className="animate-spin text-cyber-500" />
                             <span className="text-xs text-cyber-400 font-mono">GERANDO VARIANTES...</span>
                          </div>
                        </div>
                      )}
                      <textarea 
                        value={generatedMessages[client.id]}
                        onChange={(e) => setGeneratedMessages({...generatedMessages, [client.id]: e.target.value})}
                        disabled={isSent}
                        className={`w-full h-32 bg-slate-900/80 border ${isSent ? 'border-emerald-900/50 text-emerald-100/50' : 'border-slate-700 text-slate-200'} rounded-xl p-4 resize-none focus:outline-none focus:border-cyber-500 transition-colors font-sans text-sm leading-relaxed`}
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      {isSent ? (
                        <span className="text-xs font-mono text-slate-500 flex items-center gap-2">
                          LOG: DISPARO REALIZADO COM SUCESSO
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSend(client)}
                          disabled={isLoading}
                          className="group relative flex items-center gap-3 px-6 py-3 bg-cyber-500 hover:bg-cyber-400 text-slate-900 font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="animate-spin" size={18} />
                              ENVIANDO...
                            </>
                          ) : (
                            <>
                              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                              DISPARAR MENSAGEM
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};