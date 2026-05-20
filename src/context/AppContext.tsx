import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, Service, Order, DepositRequest, Ticket, PaymentSettings, ConnectedProvider, PaymentGateway, LogEntry, Announcement, Currency, Language, Theme } from '../types';
import { INITIAL_USERS, INITIAL_SERVICES, INITIAL_ORDERS, INITIAL_DEPOSITS, INITIAL_TICKETS, INITIAL_SETTINGS, INITIAL_PROVIDERS, INITIAL_LOGS, INITIAL_ANNOUNCEMENTS } from '../data/mockData';
import { translations } from '../data/translations';

type ExchangeRates = {
  USD: number;
  EUR: number;
  TND: number;
};

interface AppContextType {
  // Config & Preferences
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: (key: string) => string;
  formatPrice: (usdAmount: number) => string;
  exchangeRates: ExchangeRates;
  updateExchangeRates: (rates: ExchangeRates) => void;
  hideBalance: boolean;
  setHideBalance: React.Dispatch<React.SetStateAction<boolean>>;

  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;

  // Auth & User
  currentUser: User | null;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (userId: string) => void;
  updateProfile: (updates: { username: string; email: string; whatsapp: string; currentPassword?: string; newPassword?: string }) => { success: boolean; error?: string };
  login: (username: string, pass: string) => boolean;
  register: (username: string, email: string, pass: string, whatsapp: string) => boolean;
  logout: () => void;
  updateWhatsApp: (phone: string) => void;
  showMissingPhoneModal: boolean;
  setShowMissingPhoneModal: React.Dispatch<React.SetStateAction<boolean>>;
  twoFactorStep: boolean;
  setTwoFactorStep: React.Dispatch<React.SetStateAction<boolean>>;

  // Services & Store
  services: Service[];
  updateServicePrice: (id: string, newRate: number) => void;
  updateServiceImage: (id: string, imageUrl: string) => void;
  updateService: (id: string, updates: Partial<Service>) => void;

  // Orders
  orders: Order[];
  placeOrder: (service: Service, link: string, quantity: number) => { success: boolean; error?: string; order?: Order };
  buyAccount: (service: Service) => { success: boolean; error?: string; order?: Order };
  requestRefill: (orderId: string) => void;

  // Success Modal
  lastOrderSuccess: { oldBal: number; newBal: number; spent: number; order: Order } | null;
  setLastOrderSuccess: React.Dispatch<React.SetStateAction<{ oldBal: number; newBal: number; spent: number; order: Order } | null>>;

  // Finance & Deposits
  deposits: DepositRequest[];
  requestDeposit: (gateway: string, usdAmount: number, phoneRef: string) => void;
  approveDeposit: (id: string) => void;
  rejectDeposit: (id: string) => void;
  settings: PaymentSettings;
  updateSettings: (s: PaymentSettings) => void;
  databaseStatus: string;
  testDatabaseConnection: () => Promise<boolean>;
  uploadDatabaseSnapshot: (silent?: boolean) => Promise<boolean>;
  downloadDatabaseSnapshot: () => Promise<boolean>;
  addPaymentGateway: (gateway: Omit<PaymentGateway, 'id'>) => void;
  updatePaymentGateway: (id: string, gateway: Partial<PaymentGateway>) => void;
  deletePaymentGateway: (id: string) => void;

  // Support Tickets
  tickets: Ticket[];
  createTicket: (subject: string, category: 'deposit' | 'order' | 'refill' | 'other', initialMsg: string) => void;
  replyTicket: (ticketId: string, message: string) => void;

  // Admin Logs & User Management
  logs: LogEntry[];
  toggleBanUser: (userId: string) => void;
  updateUserBalance: (userId: string, amount: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  deleteService: (serviceId: string) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (annId: string) => void;
  announcements: Announcement[];

  // Connected Providers (External SMM APIs)
  providers: ConnectedProvider[];
  addProvider: (prov: Omit<ConnectedProvider, 'id'>) => void;
  updateProvider: (id: string, prov: Partial<ConnectedProvider>) => void;
  deleteProvider: (id: string) => void;
  syncProviderServices: (providerId: string) => Promise<boolean>;
  syncProviderBalance: (providerId: string) => Promise<boolean>;
}

interface AppContextType {
  // Config & Preferences
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: (key: string) => string;
  formatPrice: (usdAmount: number) => string;
  hideBalance: boolean;
  setHideBalance: React.Dispatch<React.SetStateAction<boolean>>;

  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;

  // Auth & User
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  login: (username: string, pass: string) => boolean;
  register: (username: string, email: string, pass: string, whatsapp: string) => boolean;
  logout: () => void;
  updateWhatsApp: (phone: string) => void;
  showMissingPhoneModal: boolean;
  setShowMissingPhoneModal: React.Dispatch<React.SetStateAction<boolean>>;
  twoFactorStep: boolean;
  setTwoFactorStep: React.Dispatch<React.SetStateAction<boolean>>;

  // Services & Store
  services: Service[];
  updateServicePrice: (id: string, newRate: number) => void;

  // Orders
  orders: Order[];
  placeOrder: (service: Service, link: string, quantity: number) => { success: boolean; error?: string; order?: Order };
  buyAccount: (service: Service) => { success: boolean; error?: string; order?: Order };
  requestRefill: (orderId: string) => void;

  // Success Modal
  lastOrderSuccess: { oldBal: number; newBal: number; spent: number; order: Order } | null;
  setLastOrderSuccess: React.Dispatch<React.SetStateAction<{ oldBal: number; newBal: number; spent: number; order: Order } | null>>;

  // Finance & Deposits
  deposits: DepositRequest[];
  requestDeposit: (gateway: string, usdAmount: number, phoneRef: string) => void;
  approveDeposit: (id: string) => void;
  rejectDeposit: (id: string) => void;
  settings: PaymentSettings;
  updateSettings: (s: PaymentSettings) => void;

  // Support Tickets
  tickets: Ticket[];
  createTicket: (subject: string, category: 'deposit' | 'order' | 'refill' | 'other', initialMsg: string) => void;
  replyTicket: (ticketId: string, message: string) => void;

  // Admin Logs & User Management
  logs: LogEntry[];
  toggleBanUser: (userId: string) => void;
  updateUserBalance: (userId: string, amount: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  deleteService: (serviceId: string) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (annId: string) => void;
  announcements: Announcement[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence Helpers
  const getSaved = <T,>(key: string, defaultVal: T): T => {
    const saved = localStorage.getItem(`shield_${key}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultVal;
      }
    }
    return defaultVal;
  };

  const [currency, setCurrencyState] = useState<Currency>(() => getSaved('currency', 'USD'));
  const [language, setLanguageState] = useState<Language>(() => getSaved('language', 'ar'));
  const [theme, setThemeState] = useState<Theme>(() => getSaved('theme', 'dark'));
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(() => getSaved('exchangeRates', { USD: 1, EUR: 0.92, TND: 3.1 }));
  const [hideBalance, setHideBalance] = useState<boolean>(() => getSaved('hideBalance', false));
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const [users, setUsers] = useState<User[]>(() => getSaved('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(null); // No account is logged in by default.
  const [showMissingPhoneModal, setShowMissingPhoneModal] = useState<boolean>(false);
  const [twoFactorStep, setTwoFactorStep] = useState<boolean>(false);

  const [services, setServices] = useState<Service[]>(() => getSaved('services', INITIAL_SERVICES));
  const [orders, setOrders] = useState<Order[]>(() => getSaved('orders', INITIAL_ORDERS));
  const [deposits, setDeposits] = useState<DepositRequest[]>(() => getSaved('deposits', INITIAL_DEPOSITS));
  const [tickets, setTickets] = useState<Ticket[]>(() => getSaved('tickets', INITIAL_TICKETS));
  const [settings, setSettings] = useState<PaymentSettings>(() => getSaved('settings', INITIAL_SETTINGS));
  const [logs, setLogs] = useState<LogEntry[]>(() => getSaved('logs', INITIAL_LOGS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getSaved('announcements', INITIAL_ANNOUNCEMENTS));
  const [providers, setProviders] = useState<ConnectedProvider[]>(() => getSaved('providers', INITIAL_PROVIDERS));
  const [databaseStatus, setDatabaseStatus] = useState<string>('Local storage mode');
  const settingsRef = useRef(settings);
  const snapshotRef = useRef<any>(null);
  const autoSyncInFlightRef = useRef(false);
  const autoPullInFlightRef = useRef(false);

  useEffect(() => {
    // Production mode: Supabase is the only database backend.
    setSettings(prev => {
      const db = prev.database || INITIAL_SETTINGS.database;
      const nextDb = {
        ...db,
        provider: 'supabase' as const,
        supabaseUrl: db?.supabaseUrl || '',
        supabaseAnonKey: db?.supabaseAnonKey || '',
        tableName: db?.tableName || 'flexapanel_data',
        isEnabled: true,
        autoSyncEnabled: db?.autoSyncEnabled ?? true,
        autoSyncIntervalMs: db?.autoSyncIntervalMs || 1000,
        autoPullEnabled: db?.autoPullEnabled ?? true,
        autoPullIntervalMs: db?.autoPullIntervalMs || 1000
      };

      if (
        db?.provider === nextDb.provider &&
        db?.tableName === nextDb.tableName &&
        db?.isEnabled === nextDb.isEnabled &&
        db?.autoSyncEnabled === nextDb.autoSyncEnabled &&
        db?.autoSyncIntervalMs === nextDb.autoSyncIntervalMs &&
        db?.autoPullEnabled === nextDb.autoPullEnabled &&
        db?.autoPullIntervalMs === nextDb.autoPullIntervalMs
      ) {
        return prev;
      }

      return { ...prev, database: nextDb };
    });
  }, []);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    snapshotRef.current = {
      users,
      services,
      orders,
      deposits,
      tickets,
      settings,
      logs,
      announcements,
      providers
    };
  }, [users, services, orders, deposits, tickets, settings, logs, announcements, providers]);

  useEffect(() => { localStorage.setItem('shield_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('shield_providers', JSON.stringify(providers)); }, [providers]);

  const [lastOrderSuccess, setLastOrderSuccess] = useState<{ oldBal: number; newBal: number; spent: number; order: Order } | null>(null);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('shield_currency', JSON.stringify(currency)); }, [currency]);
  useEffect(() => { localStorage.setItem('shield_language', JSON.stringify(language)); }, [language]);
  useEffect(() => { localStorage.setItem('shield_theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('shield_exchangeRates', JSON.stringify(exchangeRates)); }, [exchangeRates]);
  useEffect(() => { localStorage.setItem('shield_hideBalance', JSON.stringify(hideBalance)); }, [hideBalance]);
  useEffect(() => { localStorage.setItem('shield_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('shield_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('shield_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('shield_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('shield_deposits', JSON.stringify(deposits)); }, [deposits]);
  useEffect(() => { localStorage.setItem('shield_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('shield_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('shield_logs', JSON.stringify(logs)); }, [logs]);

  useEffect(() => {
    const faviconUrl = settings.logoUrl || '/Flogo.svg';
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [settings.logoUrl]);

  // Apply dark mode & RTL
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setCurrency = (c: Currency) => setCurrencyState(c);
  const setLanguage = (l: Language) => setLanguageState(l);
  const setTheme = (t: Theme) => setThemeState(t);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const formatPrice = (usdAmount: number): string => {
    if (currency === 'TND') {
      return (usdAmount * exchangeRates.TND).toFixed(2) + ' DT';
    }
    if (currency === 'EUR') {
      return (usdAmount * exchangeRates.EUR).toFixed(2) + ' €';
    }
    return '$' + (usdAmount * exchangeRates.USD).toFixed(2);
  };

  const addLog = (action: string, severity: 'info' | 'warning' | 'danger' | 'success', userOverride?: User) => {
    const activeUser = userOverride || currentUser || { id: 'sys', username: 'System' };
    const newLog: LogEntry = {
      id: 'LOG-' + (Date.now() + Math.floor(Math.random() * 1000)),
      timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'),
      userId: activeUser.id,
      username: activeUser.username,
      action,
      ip: '197.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.1',
      severity
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const updateExchangeRates = (rates: ExchangeRates) => {
    const cleanRates = {
      USD: Number(rates.USD) > 0 ? Number(rates.USD) : 1,
      EUR: Number(rates.EUR) > 0 ? Number(rates.EUR) : 0.92,
      TND: Number(rates.TND) > 0 ? Number(rates.TND) : 3.1
    };
    setExchangeRates(cleanRates);
    addLog(`تحديث أسعار الصرف: USD=${cleanRates.USD}, EUR=${cleanRates.EUR}, TND=${cleanRates.TND}`, 'warning');
  };

  const login = (username: string, pass: string): boolean => {
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.passwordMock === pass);
    if (found) {
      if (found.isBanned) {
        alert('هذا الحساب محظور من قبل الإدارة.');
        return false;
      }
      setCurrentUser(found);
      setCurrentView('dashboard');
      addLog('تسجيل دخول ناجح', 'info', found);
      if (!found.whatsapp || found.whatsapp.trim() === '') {
        setShowMissingPhoneModal(true);
      }
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, pass: string, whatsapp: string): boolean => {
    if (!whatsapp || whatsapp.trim() === '') {
      alert('رقم الواتساب مطلوب وإجباري للتسجيل!');
      return false;
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      alert('اسم المستخدم موجود مسبقاً!');
      return false;
    }
    const newUser: User = {
      id: (users.length + 1).toString(),
      username,
      email,
      whatsapp,
      role: 'user',
      tier: 'normal',
      balance: 0,
      spent: 0,
      points: 100, // Welcome gift points
      isBanned: false,
      passwordMock: pass,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView('dashboard');
    addLog(`حساب جديد مسجل: ${username}`, 'success', newUser);
    return true;
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
    addLog(`إضافة مستخدم جديد من السوبر أدمين: ${newUser.username}`, 'success');
  };

  const deleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
    setOrders(prev => prev.filter(o => o.userId !== userId));
    setDeposits(prev => prev.filter(d => d.userId !== userId));
    setTickets(prev => prev.filter(t => t.userId !== userId));
    if (currentUser?.id === userId) setCurrentUser(null);
    addLog(`حذف المستخدم ${target.username} وجميع بياناته المرتبطة`, 'danger');
  };

  const logout = () => {
    if (currentUser) addLog('تسجيل خروج', 'info', currentUser);
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const updateWhatsApp = (phone: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, whatsapp: phone };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setShowMissingPhoneModal(false);
    addLog(`تحديث رقم الواتساب: ${phone}`, 'info');
  };

  const updateProfile = (updates: { username: string; email: string; whatsapp: string; currentPassword?: string; newPassword?: string }) => {
    if (!currentUser) return { success: false, error: 'يجب تسجيل الدخول أولاً.' };

    const username = updates.username.trim();
    const email = updates.email.trim();
    const whatsapp = updates.whatsapp.trim();

    if (!username || !email || !whatsapp) {
      return { success: false, error: 'اسم المستخدم، البريد الإلكتروني ورقم الواتساب مطلوبة.' };
    }

    const usernameTaken = users.some(user => user.id !== currentUser.id && user.username.toLowerCase() === username.toLowerCase());
    if (usernameTaken) {
      return { success: false, error: 'اسم المستخدم مستعمل من حساب آخر.' };
    }

    if (updates.newPassword && updates.newPassword.trim()) {
      if (!updates.currentPassword || updates.currentPassword !== currentUser.passwordMock) {
        return { success: false, error: 'كلمة المرور الحالية غير صحيحة.' };
      }
      if (updates.newPassword.length < 6) {
        return { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.' };
      }
    }

    const oldUsername = currentUser.username;
    const updatedUser: User = {
      ...currentUser,
      username,
      email,
      whatsapp,
      passwordMock: updates.newPassword?.trim() ? updates.newPassword.trim() : currentUser.passwordMock
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(user => user.id === currentUser.id ? updatedUser : user));
    setDeposits(prev => prev.map(dep => dep.userId === currentUser.id ? { ...dep, username } : dep));
    setTickets(prev => prev.map(ticket => ticket.userId === currentUser.id ? { ...ticket, username } : ticket));
    addLog(`تعديل البروفيل من ${oldUsername} إلى ${username}`, 'success', updatedUser);

    return { success: true };
  };

  const placeOrder = (service: Service, link: string, quantity: number) => {
    if (!currentUser) return { success: false, error: 'الرجاء تسجيل الدخول أولاً' };
    if (quantity < service.minQty || quantity > service.maxQty) {
      return { success: false, error: `الكمية يجب أن تكون بين ${service.minQty} و ${service.maxQty}` };
    }

    const price = (quantity / 1000) * service.ratePer1000;
    if (currentUser.balance < price) {
      return { success: false, error: 'رصيدك الحالي غير كافٍ لإتمام هذا الطلب! الرجاء شحن الرصيد.' };
    }

    // Deduct balance and update spent + points
    const pointsEarned = Math.floor(price * 5);
    const oldBal = currentUser.balance;
    const newBal = oldBal - price;
    const newSpent = currentUser.spent + price;
    const newPoints = currentUser.points + pointsEarned;

    const updatedUser = {
      ...currentUser,
      balance: newBal,
      spent: newSpent,
      points: newPoints,
      tier: newSpent > 1000 ? ('vip' as const) : newSpent > 300 ? ('plus' as const) : currentUser.tier
    };

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      serviceName: service.name,
      linkOrTarget: link,
      quantity,
      pricePaid: price,
      status: 'processing',
      createdAt: new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'),
      avgTime: service.avgTime,
      refillAvailable: true
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setOrders(prev => [newOrder, ...prev]);

    setLastOrderSuccess({
      oldBal,
      newBal,
      spent: price,
      order: newOrder
    });

    addLog(`طلب جديد SMM: ${service.name} | الكمية: ${quantity}`, 'success', updatedUser);
    return { success: true, order: newOrder };
  };

  const buyAccount = (service: Service) => {
    if (!currentUser) return { success: false, error: 'الرجاء تسجيل الدخول أولاً' };
    const price = service.ratePer1000; // Digital goods use ratePer1000 as unit price
    if (currentUser.balance < price) {
      return { success: false, error: 'رصيدك الحالي غير كافٍ لشراء هذا الحساب!' };
    }
    if (!service.accountsAvailable || service.accountsAvailable.length === 0) {
      return { success: false, error: 'عذراً، نفدت الكمية المتاحة حالياً من هذا الحساب.' };
    }

    const accountDelivered = service.accountsAvailable[0];
    const remainingAccounts = service.accountsAvailable.slice(1);

    // Update service stock
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, accountsAvailable: remainingAccounts } : s));

    const pointsEarned = Math.floor(price * 5);
    const oldBal = currentUser.balance;
    const newBal = oldBal - price;
    const newSpent = currentUser.spent + price;
    const newPoints = currentUser.points + pointsEarned;

    const updatedUser = { ...currentUser, balance: newBal, spent: newSpent, points: newPoints };

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      serviceName: service.name,
      linkOrTarget: 'متجر الحسابات (تسليم تلقائي)',
      quantity: 1,
      pricePaid: price,
      status: 'completed',
      createdAt: new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'),
      avgTime: 'تسليم فوري',
      deliveredAccount: accountDelivered,
      refillAvailable: false
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setOrders(prev => [newOrder, ...prev]);

    setLastOrderSuccess({ oldBal, newBal, spent: price, order: newOrder });

    addLog(`شراء حساب رقمي: ${service.name}`, 'success', updatedUser);
    return { success: true, order: newOrder };
  };

  const requestRefill = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'refilling' } : o));
    addLog(`طلب تعويض للطلب ${orderId}`, 'warning');
    alert('تم إرسال طلب التعويض التلقائي إلى السيرفر بنجاح.');
  };

  const requestDeposit = (gateway: string, usdAmount: number, phoneRef: string) => {
    if (!currentUser) return;
    const localVal = currency === 'TND' ? usdAmount * 3.1 : currency === 'EUR' ? usdAmount * 0.92 : usdAmount;

    const newDeposit: DepositRequest = {
      id: 'DEP-' + Math.floor(100 + Math.random() * 900),
      userId: currentUser.id,
      username: currentUser.username,
      gateway,
      amount: usdAmount,
      amountLocal: Number(localVal.toFixed(2)),
      currency,
      senderPhoneOrRef: phoneRef,
      status: 'pending',
      createdAt: new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')
    };

    setDeposits(prev => [newDeposit, ...prev]);
    addLog(`طلب شحن جديد عبر ${gateway} بقيمة ${usdAmount}$ (${phoneRef})`, 'info');

    // Also auto-generate a ticket for tracking
    createTicket(
      `إشعار إيداع رصيد عبر ${gateway}`,
      'deposit',
      `قمت بإيداع مبلغ ${localVal.toFixed(2)} ${currency} من الرقم/المرجع: ${phoneRef}. الرجاء إضافة ${usdAmount}$ لرصيدي.`
    );
  };

  const approveDeposit = (id: string) => {
    const dep = deposits.find(d => d.id === id);
    if (!dep || dep.status !== 'pending') return;

    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    updateUserBalance(dep.userId, dep.amount);
    addLog(`تمت الموافقة على شحن ${dep.amount}$ للمستخدم ${dep.username}`, 'success');
  };

  const rejectDeposit = (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
    addLog(`تم رفض إيداع ${id}`, 'danger');
  };

  const updateSettings = (s: PaymentSettings) => {
    setSettings(s);
    addLog('تحديث أرقام وبيانات الدفع', 'warning');
  };

  const addPaymentGateway = (gateway: Omit<PaymentGateway, 'id'>) => {
    const newGateway: PaymentGateway = { ...gateway, id: 'pay_' + Date.now() };
    setSettings(prev => ({
      ...prev,
      customGateways: [newGateway, ...(prev.customGateways || [])]
    }));
    addLog(`إضافة طريقة دفع جديدة: ${gateway.name}`, 'success');
  };

  const updatePaymentGateway = (id: string, gateway: Partial<PaymentGateway>) => {
    setSettings(prev => ({
      ...prev,
      customGateways: (prev.customGateways || []).map(g => g.id === id ? { ...g, ...gateway } : g)
    }));
    addLog(`تعديل طريقة دفع: ${id}`, 'warning');
  };

  const deletePaymentGateway = (id: string) => {
    setSettings(prev => ({
      ...prev,
      customGateways: (prev.customGateways || []).filter(g => g.id !== id)
    }));
    addLog(`حذف طريقة دفع: ${id}`, 'danger');
  };

  const createTicket = (subject: string, category: 'deposit' | 'order' | 'refill' | 'other', initialMsg: string) => {
    if (!currentUser) return;
    const newTicket: Ticket = {
      id: 'TCK-' + Math.floor(500 + Math.random() * 500),
      userId: currentUser.id,
      username: currentUser.username,
      subject,
      category,
      status: 'open',
      createdAt: new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'),
      messages: [
        {
          sender: currentUser.username,
          role: currentUser.role,
          content: initialMsg,
          timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')
        }
      ]
    };
    setTickets(prev => [newTicket, ...prev]);
    addLog(`فتح تذكرة جديدة: ${subject}`, 'info');
  };

  const replyTicket = (ticketId: string, message: string) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: currentUser.role !== 'user' ? 'answered' : 'open',
          messages: [
            ...t.messages,
            {
              sender: currentUser.username,
              role: currentUser.role,
              content: message,
              timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')
            }
          ]
        };
      }
      return t;
    }));
    addLog(`رد على التذكرة ${ticketId}`, 'info');
  };

  const toggleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const isNowBanned = !u.isBanned;
        addLog(`${isNowBanned ? 'حظر' : 'إلغاء حظر'} المستخدم ${u.username}`, 'warning');
        return { ...u, isBanned: isNowBanned };
      }
      return u;
    }));
  };

  const updateUserBalance = (userId: string, amountDelta: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newBal = u.balance + amountDelta;
        if (currentUser && currentUser.id === userId) {
          setCurrentUser({ ...u, balance: newBal });
        }
        return { ...u, balance: newBal };
      }
      return u;
    }));
  };

  const updateServicePrice = (id: string, newRate: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ratePer1000: newRate } : s));
    addLog(`تعديل سعر الخدمة ${id} إلى ${newRate}$`, 'warning');
  };

  const updateServiceImage = (id: string, imageUrl: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, image: imageUrl.trim() || undefined } : s));
    addLog(`تعديل صورة الخدمة ${id}`, 'warning');
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    addLog(`تعديل بيانات الخدمة/الفئة ${id}`, 'warning');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    addLog(`تحديث حالة الطلب ${orderId} إلى ${status}`, 'warning');
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    addLog(`حذف الطلب ${orderId}`, 'danger');
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newId = service.isDigitalGood ? 'acc_' + Date.now() : 's_' + Date.now();
    const newService: Service = { ...service, id: newId };
    setServices(prev => [newService, ...prev]);
    addLog(`إضافة خدمة/حساب جديد: ${service.name}`, 'success');
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    addLog(`حذف الخدمة/الحساب ${serviceId}`, 'danger');
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: 'ann_' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addLog(`نشر إعلان/تحديث جديد: ${ann.title}`, 'success');
  };

  const deleteAnnouncement = (annId: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
    addLog(`حذف الإعلان ${annId}`, 'warning');
  };

  const getSupabaseClient = () => {
    const db = settings.database;
    if (!db?.supabaseUrl || !db?.supabaseAnonKey) return null;
    return createClient(db.supabaseUrl, db.supabaseAnonKey);
  };

  const getDatabaseSnapshot = () => ({
    users,
    services,
    orders,
    deposits,
    tickets,
    settings,
    logs,
    announcements,
    providers
  });

  const applyDatabaseSnapshot = (snapshot: Partial<ReturnType<typeof getDatabaseSnapshot>>) => {
    if (snapshot.users) setUsers(snapshot.users);
    if (snapshot.services) setServices(snapshot.services);
    if (snapshot.orders) setOrders(snapshot.orders);
    if (snapshot.deposits) setDeposits(snapshot.deposits);
    if (snapshot.tickets) setTickets(snapshot.tickets);
    if (snapshot.settings) setSettings(snapshot.settings);
    if (snapshot.logs) setLogs(snapshot.logs);
    if (snapshot.announcements) setAnnouncements(snapshot.announcements);
    if (snapshot.providers) setProviders(snapshot.providers);
  };

  const testDatabaseConnection = async (): Promise<boolean> => {
    const db = settings.database;
    if (!db?.isEnabled || db.provider !== 'supabase') {
      setDatabaseStatus('Database is disabled or provider is not Supabase');
      return false;
    }
    const supabase = getSupabaseClient();
    if (!supabase) {
      setDatabaseStatus('Missing Supabase URL or anon key');
      return false;
    }
    const tableName = db.tableName || 'flexapanel_data';
    const { error } = await supabase.from(tableName).select('key').limit(1);
    if (error) {
      setDatabaseStatus(`Supabase error: ${error.message}`);
      return false;
    }
    setDatabaseStatus('Supabase connected successfully');
    addLog('اختبار اتصال Supabase ناجح', 'success');
    return true;
  };

  const uploadDatabaseSnapshot = async (silent = false): Promise<boolean> => {
    const db = settings.database;
    const supabase = getSupabaseClient();
    if (!db?.isEnabled || db.provider !== 'supabase' || !supabase) {
      setDatabaseStatus('Enable Supabase and add credentials first');
      return false;
    }
    const tableName = db.tableName || 'flexapanel_data';
    const snapshot = getDatabaseSnapshot();
    const rows = Object.entries(snapshot).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));
    const { error } = await supabase.from(tableName).upsert(rows, { onConflict: 'key' });
    if (error) {
      setDatabaseStatus(`Upload failed: ${error.message}`);
      return false;
    }
    const lastSync = new Date().toISOString();
    setSettings(prev => ({ ...prev, database: { ...(prev.database || db), lastSync } }));
    setDatabaseStatus(`${silent ? 'Auto uploaded' : 'Uploaded'} to Supabase at ${lastSync}`);
    if (!silent) addLog('رفع بيانات الموقع إلى Supabase', 'success');
    return true;
  };

  const downloadDatabaseSnapshot = async (): Promise<boolean> => {
    const db = settings.database;
    const supabase = getSupabaseClient();
    if (!db?.isEnabled || db.provider !== 'supabase' || !supabase) {
      setDatabaseStatus('Enable Supabase and add credentials first');
      return false;
    }
    const tableName = db.tableName || 'flexapanel_data';
    const { data, error } = await supabase.from(tableName).select('key,value');
    if (error) {
      setDatabaseStatus(`Download failed: ${error.message}`);
      return false;
    }
    const snapshot = (data || []).reduce((acc: Record<string, any>, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    applyDatabaseSnapshot(snapshot);
    setDatabaseStatus('Downloaded latest data from Supabase');
    addLog('تحميل بيانات الموقع من Supabase', 'success');
    return true;
  };

  useEffect(() => {
    const db = settings.database;
    if (!db?.isEnabled || db.provider !== 'supabase' || db.autoSyncEnabled === false) return;
    if (!db.supabaseUrl || !db.supabaseAnonKey) return;

    const intervalMs = Math.max(1000, Number(db.autoSyncIntervalMs || 1000));
    setDatabaseStatus(`Auto sync Supabase active: every ${intervalMs / 1000}s`);

    const timer = window.setInterval(async () => {
      if (autoSyncInFlightRef.current) return;
      const currentDb = settingsRef.current.database;
      const snapshot = snapshotRef.current;
      if (!currentDb?.isEnabled || currentDb.provider !== 'supabase' || currentDb.autoSyncEnabled === false || !snapshot) return;
      if (!currentDb.supabaseUrl || !currentDb.supabaseAnonKey) return;

      autoSyncInFlightRef.current = true;
      try {
        const supabase = createClient(currentDb.supabaseUrl, currentDb.supabaseAnonKey);
        const tableName = currentDb.tableName || 'flexapanel_data';
        const rows = Object.entries(snapshot).map(([key, value]) => ({
          key,
          value,
          updated_at: new Date().toISOString()
        }));
        const { error } = await supabase.from(tableName).upsert(rows, { onConflict: 'key' });
        if (error) {
          setDatabaseStatus(`Auto sync failed: ${error.message}`);
          return;
        }
        const lastSync = new Date().toISOString();
        setSettings(prev => ({ ...prev, database: { ...(prev.database || currentDb), lastSync } }));
        setDatabaseStatus(`Auto synced to Supabase at ${lastSync}`);
      } catch (err: any) {
        setDatabaseStatus(`Auto sync error: ${err.message || 'Unknown error'}`);
      } finally {
        autoSyncInFlightRef.current = false;
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [
    settings.database?.provider,
    settings.database?.isEnabled,
    settings.database?.autoSyncEnabled,
    settings.database?.autoSyncIntervalMs,
    settings.database?.supabaseUrl,
    settings.database?.supabaseAnonKey,
    settings.database?.tableName
  ]);

  useEffect(() => {
    const db = settings.database;
    if (!db?.isEnabled || db.provider !== 'supabase' || db.autoPullEnabled === false) return;
    if (!db.supabaseUrl || !db.supabaseAnonKey) return;

    const intervalMs = Math.max(1000, Number(db.autoPullIntervalMs || 1000));
    setDatabaseStatus(`Auto upload/download Supabase active: every ${intervalMs / 1000}s`);

    const timer = window.setInterval(async () => {
      if (autoPullInFlightRef.current) return;
      const currentDb = settingsRef.current.database;
      if (!currentDb?.isEnabled || currentDb.provider !== 'supabase' || currentDb.autoPullEnabled === false) return;
      if (!currentDb.supabaseUrl || !currentDb.supabaseAnonKey) return;

      autoPullInFlightRef.current = true;
      try {
        const supabase = createClient(currentDb.supabaseUrl, currentDb.supabaseAnonKey);
        const tableName = currentDb.tableName || 'flexapanel_data';
        const { data, error } = await supabase.from(tableName).select('key,value');
        if (error) {
          setDatabaseStatus(`Auto download failed: ${error.message}`);
          return;
        }
        const snapshot = (data || []).reduce((acc: Record<string, any>, row: any) => {
          acc[row.key] = row.value;
          return acc;
        }, {});
        applyDatabaseSnapshot(snapshot);
        setDatabaseStatus(`Auto downloaded from Supabase at ${new Date().toISOString()}`);
      } catch (err: any) {
        setDatabaseStatus(`Auto download error: ${err.message || 'Unknown error'}`);
      } finally {
        autoPullInFlightRef.current = false;
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [
    settings.database?.provider,
    settings.database?.isEnabled,
    settings.database?.autoPullEnabled,
    settings.database?.autoPullIntervalMs,
    settings.database?.supabaseUrl,
    settings.database?.supabaseAnonKey,
    settings.database?.tableName
  ]);

  // Provider / API Sync Methods
  const addProvider = (prov: Omit<ConnectedProvider, 'id'>) => {
    const newProv: ConnectedProvider = { ...prov, id: 'prov_' + Date.now() };
    setProviders(prev => [newProv, ...prev]);
    addLog(`إضافة مزود API جديد: ${prov.name}`, 'success');
  };

  const updateProvider = (id: string, prov: Partial<ConnectedProvider>) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, ...prov } : p));
    addLog(`تحديث بيانات مزود API: ${id}`, 'info');
  };

  const deleteProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
    addLog(`حذف مزود API: ${id}`, 'danger');
  };

  const syncProviderServices = async (providerId: string): Promise<boolean> => {
    const prov = providers.find(p => p.id === providerId);
    if (!prov || !prov.apiUrl) return false;

    try {
      addLog(`جاري مزامنة خدمات المزود: ${prov.name}...`, 'info');
      const body = new URLSearchParams({ key: prov.apiKey, action: 'services' });
      const res = await fetch(prov.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'application/json'
        },
        body
      });
      const data = await res.json();
      if (!Array.isArray(data)) {
        addLog(`فشل في استلام صيغة صحيحة من ${prov.name}`, 'danger');
        return false;
      }

      // Convert imported services to local services format
      const imported: Service[] = data.map((item: any) => ({
        id: `api_${prov.id}_${item.service || Date.now() + Math.random()}`,
        categoryId: `cat_${item.category || 'imported'}`,
        categoryName: `${prov.name} - ${item.category || 'عام'}`,
        name: item.name || 'خدمة مستوردة',
        ratePer1000: Number(item.rate || 1.0),
        minQty: Number(item.min || 100),
        maxQty: Number(item.max || 10000),
        avgTime: 'تلقائي API',
        description: `خدمة مستوردة من سيرفر ${prov.name}. (Service ID: ${item.service})`,
        isDigitalGood: false
      }));

      // Merge services without duplicates
      setServices(prev => {
        const filtered = prev.filter(s => !s.id.startsWith(`api_${prov.id}`));
        return [...imported, ...filtered];
      });

      addLog(`تمت مزامنة ${imported.length} خدمة بنجاح من ${prov.name}`, 'success');
      return true;
    } catch (err: any) {
      addLog(`خطأ اتصال بمزود ${prov?.name}: ${err.message}`, 'danger');
      return false;
    }
  };

  const syncProviderBalance = async (providerId: string): Promise<boolean> => {
    const prov = providers.find(p => p.id === providerId);
    if (!prov || !prov.apiUrl) return false;

    try {
      const body = new URLSearchParams({ key: prov.apiKey, action: 'balance' });
      const res = await fetch(prov.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'application/json'
        },
        body
      });
      const data = await res.json();
      if (data && data.balance !== undefined) {
        updateProvider(prov.id, { balance: String(data.balance), currency: data.currency || 'USD' });
        addLog(`تم تحديث رصيد المزود ${prov.name}: ${data.balance} ${data.currency || '$'}`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      addLog(`فشل جلب رصيد المزود ${prov.name}`, 'warning');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        theme,
        setTheme,
        t,
        formatPrice,
        exchangeRates,
        updateExchangeRates,
        hideBalance,
        setHideBalance,
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        users,
        addUser,
        deleteUser,
        updateProfile,
        login,
        register,
        logout,
        updateWhatsApp,
        showMissingPhoneModal,
        setShowMissingPhoneModal,
        twoFactorStep,
        setTwoFactorStep,
        services,
        updateServicePrice,
        updateServiceImage,
        updateService,
        orders,
        placeOrder,
        buyAccount,
        requestRefill,
        lastOrderSuccess,
        setLastOrderSuccess,
        deposits,
        requestDeposit,
        approveDeposit,
        rejectDeposit,
        settings,
        updateSettings,
        databaseStatus,
        testDatabaseConnection,
        uploadDatabaseSnapshot,
        downloadDatabaseSnapshot,
        addPaymentGateway,
        updatePaymentGateway,
        deletePaymentGateway,
        tickets,
        createTicket,
        replyTicket,
        logs,
        toggleBanUser,
        updateUserBalance,
        updateOrderStatus,
        deleteOrder,
        addService,
        deleteService,
        addAnnouncement,
        deleteAnnouncement,
        announcements,
        providers,
        addProvider,
        updateProvider,
        deleteProvider,
        syncProviderServices,
        syncProviderBalance
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
