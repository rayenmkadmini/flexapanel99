export type Role = 'superadmin' | 'admin' | 'user';
export type Tier = 'normal' | 'plus' | 'vip';
export type Currency = 'USD' | 'TND' | 'EUR';
export type Language = 'ar' | 'fr' | 'en';
export type Theme = 'dark' | 'light';

export interface User {
  id: string;
  username: string;
  email: string;
  whatsapp?: string;
  role: Role;
  tier: Tier;
  balance: number;
  spent: number;
  points: number;
  isBanned: boolean;
  passwordMock: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  providerId?: string;
  providerName?: string;
  externalServiceId?: string | number;
  categoryId: string;
  categoryName: string;
  name: string;
  ratePer1000: number; // in USD
  minQty: number;
  maxQty: number;
  avgTime: string;
  description: string;
  image?: string;
  isDigitalGood?: boolean;
  accountsAvailable?: string[]; // list of "email:pass"
}

export interface Order {
  id: string;
  providerId?: string;
  externalOrderId?: string | number;
  userId: string;
  serviceName: string;
  linkOrTarget: string;
  quantity: number;
  pricePaid: number; // in USD
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refilling';
  createdAt: string;
  avgTime: string;
  deliveredAccount?: string; // If digital good
  refillAvailable: boolean;
}

export interface DepositRequest {
  id: string;
  userId: string;
  username: string;
  gateway: string;
  amount: number; // in USD
  amountLocal: number; // in chosen currency
  currency: Currency;
  senderPhoneOrRef: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  category: 'deposit' | 'order' | 'refill' | 'other';
  status: 'open' | 'answered' | 'closed';
  messages: {
    sender: string;
    role: Role;
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface ConnectedProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  proxyUrl?: string;
  balance?: string;
  currency?: string;
  isActive: boolean;
}

export interface PaymentGateway {
  id: string;
  name: string;
  icon: string;
  description: string;
  accountLabel: string;
  accountValue: string;
  isActive: boolean;
}

export type DatabaseProvider = 'supabase';

export interface DatabaseSettings {
  provider: DatabaseProvider;
  supabaseUrl: string;
  supabaseAnonKey: string;
  tableName: string;
  isEnabled: boolean;
  autoSyncEnabled?: boolean;
  autoSyncIntervalMs?: number;
  autoPullEnabled?: boolean;
  autoPullIntervalMs?: number;
  lastSync?: string;
}

export interface PaymentSettings {
  d17Phone: string;
  posteAccount: string;
  cryptoWallet: string;
  paypalEmail: string;
  logoUrl?: string;
  wordmarkUrl?: string;
  database?: DatabaseSettings;
  customGateways?: PaymentGateway[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  ip: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'gift' | 'update';
}
