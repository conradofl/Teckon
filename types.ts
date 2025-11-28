export interface Client {
  id: string;
  name: string;
  dob: string; // YYYY-MM-DD
  contact: string; // Email or Phone
  status: 'ativo' | 'inativo';
  lastPurchaseDate: string;
  history: MessageLog[];
}

export interface MessageLog {
  id: string;
  date: string;
  type: 'birthday' | 'promo';
  content: string;
  status: 'sent' | 'failed';
}

export interface CampaignConfig {
  companyName: string;
  defaultOffer: string;
  template: string;
}

export interface DashboardStats {
  totalClients: number;
  inactiveClients: number;
  birthdaysToday: number;
  messagesSentTotal: number;
}