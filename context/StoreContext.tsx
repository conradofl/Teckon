import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, CampaignConfig, MessageLog } from '../types';
import { generateId } from '../utils';

interface StoreContextType {
  clients: Client[];
  config: CampaignConfig;
  addClient: (client: Omit<Client, 'id' | 'history'>) => void;
  updateConfig: (newConfig: Partial<CampaignConfig>) => void;
  logMessage: (clientId: string, content: string) => void;
  importMockData: () => void;
  deleteClient: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  
  const [config, setConfig] = useState<CampaignConfig>({
    companyName: 'TechStore',
    defaultOffer: '20% de desconto em toda a loja',
    template: 'Olá [NOME]! 🎉 Feliz aniversário! A equipe [EMPRESA] deseja um dia especial. Como presente, preparamos [OFERTA ESPECIAL]. Estamos com saudades!'
  });

  // Load initial mock data if empty (simulated persistence could go here)
  useEffect(() => {
    // Intentionally empty for now, user manually imports
  }, []);

  const addClient = (clientData: Omit<Client, 'id' | 'history'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      history: []
    };
    setClients(prev => [...prev, newClient]);
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const logMessage = (clientId: string, content: string) => {
    const log: MessageLog = {
      id: generateId(),
      date: new Date().toISOString(),
      type: 'birthday',
      content,
      status: 'sent'
    };

    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          history: [log, ...client.history]
        };
      }
      return client;
    }));
  };

  const updateConfig = (newConfig: Partial<CampaignConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const importMockData = () => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    // Create some clients who have birthday today
    const mockClients: Client[] = [
      {
        id: generateId(),
        name: 'Roberto Silva',
        dob: `1985-${mm}-${dd}`,
        contact: 'roberto@email.com',
        status: 'inativo',
        lastPurchaseDate: '2023-01-15',
        history: []
      },
      {
        id: generateId(),
        name: 'Ana Souza',
        dob: `1990-${mm}-${dd}`,
        contact: '11999998888',
        status: 'inativo',
        lastPurchaseDate: '2022-11-20',
        history: []
      },
      {
        id: generateId(),
        name: 'Carlos Oliveira',
        dob: `1988-${mm}-${dd}`,
        contact: 'carlos@email.com',
        status: 'ativo', // Active client, should be filtered out by logic usually
        lastPurchaseDate: '2024-05-10',
        history: []
      },
      {
        id: generateId(),
        name: 'Fernanda Lima',
        dob: '1995-05-20', // Not today
        contact: 'fernanda@email.com',
        status: 'inativo',
        lastPurchaseDate: '2023-03-01',
        history: []
      },
       {
        id: generateId(),
        name: 'Bruno Tech',
        dob: `1992-${mm}-${dd}`,
        contact: 'bruno@tech.com',
        status: 'inativo',
        lastPurchaseDate: '2021-05-15',
        history: []
      },
    ];
    setClients(prev => [...prev, ...mockClients]);
  };

  return (
    <StoreContext.Provider value={{ clients, config, addClient, updateConfig, logMessage, importMockData, deleteClient }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};