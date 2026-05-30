import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Users, CreditCard, CheckCircle, XCircle, Ban, Eye, EyeOff, Activity, Sliders, DollarSign, RefreshCw, Key, Plus, Trash2, ShoppingBag, Bell, MessageSquare, Server, Edit3, BarChart3, Percent } from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const {
    currentUser,
    theme,
    setTheme,
    exchangeRates,
    updateExchangeRates,
    users,
    addUser,
    deleteUser,
    deposits,
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
    logs,
    toggleBanUser,
    updateUserBalance,
    services,
    updateServicePrice,
    updateServiceImage,
    updateService,
    orders,
    updateOrderStatus,
    deleteOrder,
    addService,
    deleteService,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    tickets,
    replyTicket,
    providers,
    addProvider,
    updateProvider,
    deleteProvider,
    syncProviderServices,
    syncProviderBalance,
    formatPrice
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'deposits' | 'orders' | 'providers' | 'superAdd' | 'users' | 'services' | 'images' | 'database' | 'announcements' | 'tickets' | 'settings' | 'logs'>('analytics');

  // Edit payment settings state
  const [d17, setD17] = useState(settings.d17Phone);
  const [poste, setPoste] = useState(settings.posteAccount);
  const [crypto, setCrypto] = useState(settings.cryptoWallet);
  const [paypal, setPaypal] = useState(settings.paypalEmail);
  const [brandLogoUrl, setBrandLogoUrl] = useState(settings.logoUrl || '/Flogo.svg');
  const [brandWordmarkUrl, setBrandWordmarkUrl] = useState(settings.wordmarkUrl || '/Flogo.svg');
  const [serviceImageDrafts, setServiceImageDrafts] = useState<Record<string, string>>({});
  const dbProvider = 'supabase' as const;
  const [dbUrl, setDbUrl] = useState(settings.database?.supabaseUrl || '');
  const [dbKey, setDbKey] = useState(settings.database?.supabaseAnonKey || '');
  const [dbTable, setDbTable] = useState(settings.database?.tableName || 'flexapanel_data');
  const [dbAutoSync, setDbAutoSync] = useState(settings.database?.autoSyncEnabled ?? true);
  const [dbAutoSyncMs, setDbAutoSyncMs] = useState(settings.database?.autoSyncIntervalMs || 5000);
  const [dbAutoPull, setDbAutoPull] = useState(settings.database?.autoPullEnabled ?? true);
  const [dbAutoPullMs, setDbAutoPullMs] = useState(settings.database?.autoPullIntervalMs || 15000);
  const [rateUsd, setRateUsd] = useState<number>(exchangeRates.USD);
  const [rateEur, setRateEur] = useState<number>(exchangeRates.EUR);
  const [rateTnd, setRateTnd] = useState<number>(exchangeRates.TND);

  // Show password toggle state
  const [showPasswords, setShowPasswords] = useState<{ [id: string]: boolean }>({});

  // Modals / form state for new items
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [newSrvCat, setNewSrvCat] = useState('متابعين انستغرام');
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvRate, setNewSrvRate] = useState<number>(1.0);
  const [newSrvMin, setNewSrvMin] = useState<number>(100);
  const [newSrvMax, setNewSrvMax] = useState<number>(10000);
  const [newSrvTime, setNewSrvTime] = useState('15 دقيقة');
  const [newSrvDesc, setNewSrvDesc] = useState('');
  const [newSrvIsDigital, setNewSrvIsDigital] = useState(false);
  const [newSrvAccountsStr, setNewSrvAccountsStr] = useState('');

  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'gift' | 'update'>('info');

  const [activeTicketReplyId, setActiveTicketReplyId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Provider modal state
  const [showAddProvModal, setShowAddProvModal] = useState(false);
  const [editProvId, setEditProvId] = useState<string | null>(null);
  const [provName, setProvName] = useState('');
  const [provUrl, setProvUrl] = useState('https://smmparty.com/api/v2');
  const [provKey, setProvKey] = useState('');
  const [provProxyUrl, setProvProxyUrl] = useState('https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy');
  const [bulkProvidersText, setBulkProvidersText] = useState('');

  // Super admin universal add forms
  const [suUsername, setSuUsername] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suWhatsapp, setSuWhatsapp] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suRole, setSuRole] = useState<'user' | 'admin' | 'superadmin'>('user');
  const [suTier, setSuTier] = useState<'normal' | 'plus' | 'vip'>('normal');
  const [suBalance, setSuBalance] = useState<number>(0);

  const [payName, setPayName] = useState('');
  const [payIcon, setPayIcon] = useState('💳');
  const [payDesc, setPayDesc] = useState('');
  const [payLabel, setPayLabel] = useState('بيانات الدفع');
  const [payValue, setPayValue] = useState('');

  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalSales = orders.reduce((sum, order) => sum + order.pricePaid, 0);
  const completedSales = completedOrders.reduce((sum, order) => sum + order.pricePaid, 0);
  const approvedDeposits = deposits.filter(dep => dep.status === 'approved').reduce((sum, dep) => sum + dep.amount, 0);
  const completionRate = orders.length ? Math.round((completedOrders.length / orders.length) * 100) : 0;
  const pendingDepositRate = deposits.length ? Math.round((deposits.filter(dep => dep.status === 'pending').length / deposits.length) * 100) : 0;
  const activeUsersRate = users.length ? Math.round((users.filter(user => !user.isBanned).length / users.length) * 100) : 0;
  const digitalServicesRate = services.length ? Math.round((services.filter(service => service.isDigitalGood).length / services.length) * 100) : 0;
  const categoryNames = Array.from(new Set(services.map(service => service.categoryName)));
  const topServices = [...services]
    .map(service => ({
      service,
      count: orders.filter(order => order.serviceName === service.name).length,
      sales: orders.filter(order => order.serviceName === service.name).reduce((sum, order) => sum + order.pricePaid, 0)
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const downloadFile = (filename: string, content: string, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toCsv = (rows: Record<string, unknown>[]) => {
    if (rows.length === 0) return 'No data available';
    const headers = Object.keys(rows[0]);
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    return [headers.join(','), ...rows.map(row => headers.map(header => escape(row[header])).join(','))].join('\n');
  };

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    alert(`${label} copied successfully`);
  };

  const stockDigitalCount = services.reduce((sum, service) => sum + (service.accountsAvailable?.length || 0), 0);
  const bannedUsersCount = users.filter(user => user.isBanned).length;
  const lowBalanceUsersCount = users.filter(user => user.balance < 5).length;

  const exportAdminReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      domain: 'panel.flexashop.shop',
      analytics: {
        totalSales,
        completedSales,
        approvedDeposits,
        completionRate,
        pendingDepositRate,
        activeUsersRate,
        digitalServicesRate,
        categories: categoryNames.length,
        services: services.length,
        users: users.length,
        orders: orders.length
      },
      topServices: topServices.map(item => ({
        id: item.service.id,
        name: item.service.name,
        category: item.service.categoryName,
        orders: item.count,
        sales: item.sales
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flexashop-panel-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.role !== 'admin')) {
    return (
      <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-8 rounded-3xl text-center max-w-lg mx-auto">
        <ShieldAlert className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">صلاحيات غير كافية</h3>
        <p className="text-sm">هذه الصفحة مخصصة لمديري النظام والسوبر أدمين فقط.</p>
      </div>
    );
  }

  const isSuperAdmin = currentUser.role === 'superadmin';
  const smmPartyProvider = providers.find(p => p.apiUrl.includes('smmparty.com') || p.name.toLowerCase().includes('smm party'));

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      d17Phone: d17,
      posteAccount: poste,
      cryptoWallet: crypto,
      paypalEmail: paypal
    });
    alert('تم حفظ إعدادات وحسابات الدفع بنجاح!');
  };

  const handleBalanceAdd = (userId: string) => {
    const amountStr = prompt('أدخل المبلغ المراد إضافته (أو خصمه بكتابة سالب):', '10');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      alert('مبلغ غير صحيح');
      return;
    }
    updateUserBalance(userId, amount);
  };

  const handlePriceEdit = (srvId: string, oldRate: number) => {
    const rateStr = prompt('أدخل السعر الجديد لكل 1000 ($ USD):', oldRate.toString());
    if (!rateStr) return;
    const newRate = parseFloat(rateStr);
    if (isNaN(newRate) || newRate <= 0) {
      alert('سعر غير صحيح');
      return;
    }
    updateServicePrice(srvId, newRate);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn pb-12">
      
      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 lg:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-rose-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase ${isSuperAdmin ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
              <h2 className="text-2xl lg:text-3xl font-black text-white">لوحة تحكم الإدارة (Admin Panel)</h2>
            </div>
            <p className="text-xs text-slate-400">تحكم كامل بالطلبات، الشحن، الأعضاء، وسجلات الأمان وقطع الثغرات</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-center font-mono">
            <span className="text-slate-400 text-xs block">إجمالي الأعضاء</span>
            <strong className="text-white text-lg">{users.length}</strong>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-center font-mono">
            <span className="text-slate-400 text-xs block">طلبات شحن معلقة</span>
            <strong className="text-amber-400 text-lg">{deposits.filter(d => d.status === 'pending').length}</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Analyse & Ventes</span>
        </button>

        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'deposits' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>طلبات الإيداع ({deposits.filter(d => d.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>إدارة الطلبات ({orders.filter(o => o.status === 'processing').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'providers' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Server className="w-4 h-4 text-purple-400" />
          <span>مزودي الخدمات (API Providers)</span>
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('superAdd')}
            className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'superAdd' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-rose-500/30'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>إضافة أي شيء (Super)</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tickets' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>تذاكر الدعم ({tickets.filter(t => t.status === 'open').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>الأعضاء والحظر</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'services' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>الخدمات والحسابات</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'images' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <span>إدارة الصور</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'database' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Server className="w-4 h-4 text-emerald-400" />
          <span>Database Online</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'announcements' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>الإعلانات والتحديثات</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>إعدادات الدفع (D17)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'logs' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>سجلات الأمان</span>
        </button>
      </div>

      {/* Content 0: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white">Pro Panel Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1">مركز تحسين سريع: بحث عالمي، مراقبة رصيد، وتحميل تقرير JSON للإدارة.</p>
            </div>
            <button
              onClick={exportAdminReport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-lg"
            >
              Export rapport JSON
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Ventes totales', value: formatPrice(totalSales), hint: 'كل الطلبات', color: 'text-emerald-400' },
              { label: 'Ventes terminées', value: formatPrice(completedSales), hint: `${completionRate}% commandes terminées`, color: 'text-blue-400' },
              { label: 'Recharge approuvée', value: formatPrice(approvedDeposits), hint: `${pendingDepositRate}% dépôts en attente`, color: 'text-amber-400' },
              { label: 'Utilisateurs actifs', value: `${activeUsersRate}%`, hint: `${users.filter(user => !user.isBanned).length}/${users.length} comptes actifs`, color: 'text-purple-400' }
            ].map(card => (
              <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <span className="text-xs text-slate-400 font-bold">{card.label}</span>
                <strong className={`block mt-2 text-2xl font-black font-mono ${card.color}`}>{card.value}</strong>
                <span className="text-[11px] text-slate-500 mt-1 block">{card.hint}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span>Analyse des ventes et services</span>
                </h3>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl px-3 py-1 font-mono">{digitalServicesRate}% digital</span>
              </div>

              <div className="space-y-3">
                {topServices.map(item => {
                  const percent = totalSales > 0 ? Math.round((item.sales / totalSales) * 100) : 0;
                  return (
                    <div key={item.service.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                      <div className="flex items-center justify-between gap-3 text-xs mb-2">
                        <span className="text-white font-bold truncate">{item.service.name}</span>
                        <span className="text-emerald-400 font-mono font-bold">{formatPrice(item.sales)} / {percent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${Math.max(percent, 3)}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-400 mt-2 block">Commandes: {item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-400" />
                <span>Pourcentages</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700"><span>Completion orders</span><strong className="text-emerald-400">{completionRate}%</strong></div>
                <div className="flex justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700"><span>Dépôts pending</span><strong className="text-amber-400">{pendingDepositRate}%</strong></div>
                <div className="flex justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700"><span>Comptes actifs</span><strong className="text-blue-400">{activeUsersRate}%</strong></div>
                <div className="flex justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700"><span>Catégories</span><strong className="text-purple-400">{categoryNames.length}</strong></div>
                <div className="flex justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700"><span>Services</span><strong className="text-rose-400">{services.length}</strong></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-white">20 outils Pro supplémentaires</h3>
                <p className="text-xs text-slate-400 mt-1">Actions rapides pour audit, export, monitoring, support et maintenance.</p>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-xl font-mono">20 tools</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {[
                { title: 'Export users CSV', desc: `${users.length} comptes`, action: () => downloadFile('users.csv', toCsv(users.map(u => ({ id: u.id, username: u.username, email: u.email, whatsapp: u.whatsapp, role: u.role, balance: u.balance }))), 'text/csv') },
                { title: 'Export orders CSV', desc: `${orders.length} commandes`, action: () => downloadFile('orders.csv', toCsv(orders.map(o => ({ id: o.id, service: o.serviceName, quantity: o.quantity, price: o.pricePaid, status: o.status }))), 'text/csv') },
                { title: 'Export services CSV', desc: `${services.length} services`, action: () => downloadFile('services.csv', toCsv(services.map(s => ({ id: s.id, category: s.categoryName, name: s.name, rate: s.ratePer1000, min: s.minQty, max: s.maxQty }))), 'text/csv') },
                { title: 'Export deposits CSV', desc: `${deposits.length} dépôts`, action: () => downloadFile('deposits.csv', toCsv(deposits.map(d => ({ id: d.id, username: d.username, gateway: d.gateway, amount: d.amount, status: d.status }))), 'text/csv') },
                { title: 'Export report JSON', desc: 'rapport complet', action: exportAdminReport },
                { title: 'Copy API endpoint', desc: 'panel.flexashop.shop', action: () => copyText('https://panel.flexashop.shop/api/v2', 'API endpoint') },
                { title: 'Copy WhatsApp link', desc: '+21695989977', action: () => copyText('https://wa.me/21695989977', 'WhatsApp link') },
                { title: 'Supabase upload', desc: 'sync now', action: () => uploadDatabaseSnapshot(true) },
                { title: 'Supabase download', desc: 'pull now', action: () => downloadDatabaseSnapshot(true) },
                { title: 'Test database', desc: 'connection check', action: testDatabaseConnection },
                { title: 'Sync API balances', desc: `${providers.length} providers`, action: () => providers.filter(p => p.isActive).forEach(p => syncProviderBalance(p.id)) },
                { title: 'Sync API services', desc: 'import services', action: () => providers.filter(p => p.isActive).forEach(p => syncProviderServices(p.id)) },
                { title: 'Open add service', desc: 'new service', action: () => setShowAddServiceModal(true) },
                { title: 'Open add provider', desc: 'new API panel', action: () => { setEditProvId(null); setProvName(''); setProvUrl('https://smmparty.com/api/v2'); setProvKey(''); setProvProxyUrl('https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy'); setShowAddProvModal(true); } },
                { title: 'Open announcements', desc: 'publish update', action: () => setShowAddAnnModal(true) },
                { title: 'Low balance users', desc: `${lowBalanceUsersCount} users`, action: () => alert(`${lowBalanceUsersCount} users have balance under 5$`) },
                { title: 'Banned users', desc: `${bannedUsersCount} comptes`, action: () => alert(`${bannedUsersCount} banned users`) },
                { title: 'Open tickets', desc: `${tickets.filter(t => t.status === 'open').length} tickets`, action: () => setActiveTab('tickets') },
                { title: 'Pending deposits', desc: `${deposits.filter(d => d.status === 'pending').length} dépôts`, action: () => setActiveTab('deposits') },
                { title: 'Digital stock', desc: `${stockDigitalCount} comptes`, action: () => setActiveTab('services') }
              ].map(tool => (
                <button
                  key={tool.title}
                  onClick={() => tool.action()}
                  className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700 rounded-2xl p-4 text-right transition-all hover:border-blue-500/40"
                >
                  <span className="text-sm font-black text-white block">{tool.title}</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">{tool.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Universal Add Center */}
      {activeTab === 'superAdd' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-950/50 to-amber-950/40 border border-rose-500/30 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl font-black text-white">مركز السوبر أدمين: إضافة أي شيء في الموقع</h3>
            <p className="text-xs text-slate-300 mt-1">من هنا يمكنك إضافة مستخدمين، أدمن، طرق دفع، خدمات، حسابات رقمية، مزودي API، وإعلانات بدون تغيير بنية الموقع.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>إضافة مستخدم / أدمن / سوبر أدمين</span>
              </h4>

              <form onSubmit={e => {
                e.preventDefault();
                if (!suUsername.trim() || !suEmail.trim() || !suPassword.trim()) return;
                addUser({
                  username: suUsername.trim(),
                  email: suEmail.trim(),
                  whatsapp: suWhatsapp.trim(),
                  role: suRole,
                  tier: suTier,
                  balance: Number(suBalance),
                  spent: 0,
                  points: 0,
                  isBanned: false,
                  passwordMock: suPassword,
                  twoFactorEnabled: false
                });
                setSuUsername('');
                setSuEmail('');
                setSuWhatsapp('');
                setSuPassword('');
                setSuBalance(0);
              }} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={suUsername} onChange={e => setSuUsername(e.target.value)} placeholder="اسم المستخدم" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" required />
                  <input value={suEmail} onChange={e => setSuEmail(e.target.value)} placeholder="email@example.com" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white text-left" dir="ltr" required />
                  <input value={suWhatsapp} onChange={e => setSuWhatsapp(e.target.value)} placeholder="رقم واتساب" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white text-left" dir="ltr" />
                  <input value={suPassword} onChange={e => setSuPassword(e.target.value)} placeholder="كلمة المرور" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select value={suRole} onChange={e => setSuRole(e.target.value as any)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-bold">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  <select value={suTier} onChange={e => setSuTier(e.target.value as any)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-bold">
                    <option value="normal">Normal</option>
                    <option value="plus">Plus</option>
                    <option value="vip">VIP</option>
                  </select>
                  <input type="number" value={suBalance} onChange={e => setSuBalance(Number(e.target.value))} placeholder="الرصيد" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono" />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all">إضافة الحساب</button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>إضافة طريقة دفع جديدة</span>
              </h4>

              <form onSubmit={e => {
                e.preventDefault();
                if (!payName.trim() || !payValue.trim()) return;
                addPaymentGateway({
                  name: payName.trim(),
                  icon: payIcon.trim() || '💳',
                  description: payDesc.trim() || 'طريقة دفع مضافة من السوبر أدمين.',
                  accountLabel: payLabel.trim() || 'بيانات الدفع',
                  accountValue: payValue.trim(),
                  isActive: true
                });
                setPayName('');
                setPayDesc('');
                setPayValue('');
              }} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={payName} onChange={e => setPayName(e.target.value)} placeholder="اسم طريقة الدفع" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" required />
                  <input value={payIcon} onChange={e => setPayIcon(e.target.value)} placeholder="رمز صغير" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" />
                  <input value={payLabel} onChange={e => setPayLabel(e.target.value)} placeholder="عنوان الحقل" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" />
                  <input value={payValue} onChange={e => setPayValue(e.target.value)} placeholder="رقم / حساب / رابط الدفع" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white text-left" dir="ltr" required />
                </div>
                <textarea value={payDesc} onChange={e => setPayDesc(e.target.value)} placeholder="وصف وتعليمات طريقة الدفع" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white" rows={3} />
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-all">إضافة طريقة الدفع</button>
              </form>

              <div className="space-y-2 pt-3 border-t border-slate-800">
                {(settings.customGateways || []).map(g => (
                  <div key={g.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white">{g.icon} {g.name}</div>
                      <div className="text-slate-400 font-mono" dir="ltr">{g.accountValue}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updatePaymentGateway(g.id, { isActive: !g.isActive })} className={`px-3 py-1.5 rounded-lg font-bold ${g.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>{g.isActive ? 'نشط' : 'معطل'}</button>
                      <button onClick={() => deletePaymentGateway(g.id)} className="bg-rose-500/10 text-rose-400 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h4 className="text-base font-extrabold text-white mb-4">إضافات سريعة لكل أقسام الموقع</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button onClick={() => setShowAddServiceModal(true)} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2"><Sliders className="w-5 h-5 text-blue-400" /> إضافة خدمة أو حساب</button>
              <button onClick={() => { setEditProvId(null); setProvName(''); setProvUrl('https://smmparty.com/api/v2'); setProvKey(''); setProvProxyUrl('https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy'); setShowAddProvModal(true); }} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2"><Server className="w-5 h-5 text-purple-400" /> إضافة مزود API</button>
              <button onClick={() => setShowAddAnnModal(true)} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2"><Bell className="w-5 h-5 text-amber-400" /> إضافة إعلان</button>
            </div>
          </div>
        </div>
      )}

      {/* Content 1.1: Orders Manager */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white">إدارة طلبات العملاء وتعديل حالاتها</h3>
          {orders.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-12">لا توجد طلبات مسجلة</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 font-bold uppercase">
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">الخدمة</th>
                    <th className="p-4">الرابط / الحساب المستهدف</th>
                    <th className="p-4 text-center">الكمية</th>
                    <th className="p-4 text-center">المبلغ</th>
                    <th className="p-4 text-center">الحالة</th>
                    <th className="p-4 text-center">تغيير الحالة / حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs text-slate-300 font-medium">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-400">{o.id}</td>
                      <td className="p-4 font-bold text-white max-w-xs truncate">{o.serviceName}</td>
                      <td className="p-4 font-mono max-w-xs truncate" dir="ltr">{o.linkOrTarget}</td>
                      <td className="p-4 text-center font-bold">{o.quantity.toLocaleString()}</td>
                      <td className="p-4 text-center font-mono text-emerald-400 font-bold">{formatPrice(o.pricePaid)}</td>
                      <td className="p-4 text-center">
                        <select
                          value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                        >
                          <option value="pending">معلق (Pending)</option>
                          <option value="processing">قيد التنفيذ (Processing)</option>
                          <option value="completed">مكتمل (Completed)</option>
                          <option value="refilling">جاري التعويض (Refilling)</option>
                          <option value="cancelled">ملغي (Cancelled)</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => { if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) deleteOrder(o.id); }}
                          className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white p-2 rounded-xl transition-all border border-rose-500/20"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Content 1.15: Providers (SMM API Integration) */}
      {activeTab === 'providers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">إدارة واجهات الربط الخارجية (API Providers)</h3>
              <p className="text-xs text-slate-400 mt-1">اربط المنصة مع سيرفرات SMM أخرى (مثل SMMParty) لمزامنة الخدمات والرصيد</p>
            </div>
            <button
              onClick={() => {
                setEditProvId(null);
                setProvName('');
                setProvUrl('https://smmparty.com/api/v2');
                setProvKey('');
                setProvProxyUrl('https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy');
                setShowAddProvModal(true);
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مزود API جديد</span>
            </button>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const apiUrl = String(formData.get('smmPartyUrl') || '').trim();
              const apiKey = String(formData.get('smmPartyKey') || '').trim();
              const proxyUrl = String(formData.get('smmPartyProxyUrl') || '').trim();
              const isActive = formData.get('smmPartyActive') === 'on';
              if (!apiUrl || !apiKey) {
                alert('ضع رابط API و API Key الخاص بـ SMM Party أولاً.');
                return;
              }

              if (smmPartyProvider) {
                updateProvider(smmPartyProvider.id, {
                  name: 'SMM Party (Main)',
                  apiUrl,
                  apiKey,
                  proxyUrl: proxyUrl || undefined,
                  isActive,
                  balance: undefined,
                  currency: undefined
                });
              } else {
                addProvider({
                  name: 'SMM Party (Main)',
                  apiUrl,
                  apiKey,
                  proxyUrl: proxyUrl || undefined,
                  isActive
                });
              }
              alert('تم حفظ إعدادات API الخاصة بـ SMM Party بنجاح.');
            }}
            className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-white text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span>تعديل API SMM Party مباشرة</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">غيّر API URL و API Key الخاص بـ smmparty.com من هنا بدون فتح نافذة إضافية.</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 cursor-pointer">
                <input name="smmPartyActive" type="checkbox" defaultChecked={smmPartyProvider?.isActive ?? true} className="accent-emerald-500" />
                <span>نشط</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">API URL</label>
                <input
                  name="smmPartyUrl"
                  type="url"
                  defaultValue={smmPartyProvider?.apiUrl || 'https://smmparty.com/api/v2'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">API Key</label>
                <input
                  name="smmPartyKey"
                  type="password"
                  defaultValue={smmPartyProvider?.apiKey || ''}
                  placeholder="ضع API Key من صفحة Account في SMM Party"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                  dir="ltr"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Proxy URL مهم جداً</label>
                <input
                  name="smmPartyProxyUrl"
                  type="url"
                  defaultValue={smmPartyProvider?.proxyUrl || 'https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy'}
                  placeholder="https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all">
                حفظ API SMM Party
              </button>
              <button
                type="button"
                disabled={!smmPartyProvider}
                onClick={async () => {
                  if (!smmPartyProvider) return;
                  const ok = await syncProviderBalance(smmPartyProvider.id);
                  alert(ok ? 'تم جلب الرصيد الحقيقي بنجاح.' : 'فشل جلب الرصيد. راجع Logs أو تأكد من Proxy/API Key.');
                }}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs border border-emerald-500/30 transition-all"
              >
                اختبار الاتصال / جلب الرصيد
              </button>
              <button
                type="button"
                disabled={!smmPartyProvider}
                onClick={async () => {
                  if (!smmPartyProvider) return;
                  const ok = await syncProviderServices(smmPartyProvider.id);
                  alert(ok ? 'تمت مزامنة خدمات SMM Party بنجاح.' : 'فشلت مزامنة الخدمات. راجع Logs أو تأكد من Proxy/API Key.');
                }}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
              >
                مزامنة خدمات SMM Party
              </button>
            </div>
          </form>

          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-white text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span>إضافة عدة Panels دفعة واحدة</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  اكتب كل بانل في سطر مستقل بهذه الصيغة: <code className="font-mono text-blue-300">name | api_url | api_key</code>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => providers.filter(p => p.isActive).forEach(p => syncProviderBalance(p.id))}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-4 py-2 rounded-xl text-xs border border-emerald-500/30 transition-all"
                >
                  تحديث أرصدة كل الـ Panels
                </button>
                <button
                  type="button"
                  onClick={() => providers.filter(p => p.isActive).forEach(p => syncProviderServices(p.id))}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all"
                >
                  مزامنة كل الخدمات
                </button>
              </div>
            </div>

            <textarea
              value={bulkProvidersText}
              onChange={e => setBulkProvidersText(e.target.value)}
              rows={4}
              dir="ltr"
              placeholder={"Panel One | https://example.com/api/v2 | YOUR_API_KEY\nPanel Two | https://another-panel.com/api/v2 | YOUR_API_KEY"}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono text-left focus:outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => {
                const rows = bulkProvidersText.split('\n').map(row => row.trim()).filter(Boolean);
                let added = 0;
                rows.forEach(row => {
                  const [name, apiUrl, apiKey] = row.split('|').map(part => part?.trim());
                  if (name && apiUrl && apiKey) {
                    addProvider({ name, apiUrl, apiKey, proxyUrl: 'https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy', isActive: true });
                    added += 1;
                  }
                });
                if (added === 0) {
                  alert('لم يتم العثور على أي سطر صحيح. الصيغة: name | api_url | api_key');
                  return;
                }
                setBulkProvidersText('');
                alert(`تمت إضافة ${added} بانل API بنجاح.`);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 rounded-xl text-xs transition-all shadow-lg"
            >
              إضافة كل الـ Panels المكتوبة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map(p => (
              <div key={p.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20">{p.name}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${p.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {p.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 font-mono" dir="ltr">
                    <div className="text-slate-400 text-right font-sans">رابط الـ API:</div>
                    <div className="bg-black/40 p-2.5 rounded-xl border border-slate-700 text-slate-200 truncate">{p.apiUrl}</div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 font-mono" dir="ltr">
                    <div className="text-slate-400 text-right font-sans">المفتاح (API Key):</div>
                    <div className="bg-black/40 p-2.5 rounded-xl border border-slate-700 text-slate-200 truncate">
                      {p.apiKey ? p.apiKey.slice(0, 10) + '...' + p.apiKey.slice(-5) : 'غير مسجل'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl font-mono text-xs">
                    <span className="text-purple-300 font-sans font-bold">الرصيد في السيرفر:</span>
                    <strong className="text-emerald-400 font-bold text-sm">
                      {p.apiKey && p.balance !== undefined ? `${p.balance} ${p.currency || '$'}` : 'اضغط تحديث الرصيد'}
                    </strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between gap-2 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => syncProviderBalance(p.id)}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl transition-all flex items-center gap-1 border border-emerald-500/30"
                      title="تحديث الرصيد"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>الرصيد</span>
                    </button>
                    <button
                      onClick={() => syncProviderServices(p.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                      title="استيراد وتحديث الخدمات من السيرفر"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>مزامنة الخدمات</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditProvId(p.id);
                        setProvName(p.name);
                        setProvUrl(p.apiUrl);
                        setProvKey(p.apiKey);
                        setProvProxyUrl(p.proxyUrl || 'https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy');
                        setShowAddProvModal(true);
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-xl transition-all"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { if (confirm('هل أنت متأكد من حذف هذا المزود؟')) deleteProvider(p.id); }}
                      className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white p-2 rounded-xl transition-all border border-rose-500/20"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-2 text-amber-400">
              <Server className="w-4 h-4" />
              <span>مواصفات الربط القياسية (API Docs)</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              يدعم النظام بروتوكول SMM القياسي (v2). عند الضغط على "مزامنة الخدمات"، يقوم البانل بإرسال طلب <code className="text-purple-300 font-mono">action=services</code> واستيراد كافة الخدمات المتوفرة وإدراجها في قائمة الموقع تلقائياً.
            </p>
          </div>
        </div>
      )}

      {/* Content 1.2: Tickets Manager */}
      {activeTab === 'tickets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white">إدارة تذاكر الدعم الفني والرد على العملاء</h3>
          {tickets.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-12">لا توجد تذاكر دعم مسجلة</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {tickets.map(t => (
                <div key={t.id} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-xl text-xs font-bold border border-indigo-500/30">{t.id}</span>
                      <h4 className="font-bold text-white text-sm">{t.subject}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">بواسطة: {t.username} | {t.createdAt}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${t.status === 'open' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {t.status === 'open' ? 'مفتوحة (تنتظر ردك)' : 'تم الرد'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                    {t.messages.map((m, idx) => (
                      <div key={idx} className={`text-xs p-3 rounded-xl max-w-xl ${m.role === 'superadmin' || m.role === 'admin' ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30 mr-auto' : 'bg-slate-800 text-slate-300 ml-auto'}`}>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>{m.sender} ({m.role})</span>
                          <span className="font-mono">{m.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{m.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    {activeTicketReplyId === t.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={ticketReplyText}
                          onChange={e => setTicketReplyText(e.target.value)}
                          placeholder="اكتب ردك هنا..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => {
                            if (!ticketReplyText.trim()) return;
                            replyTicket(t.id, ticketReplyText.trim());
                            setTicketReplyText('');
                            setActiveTicketReplyId(null);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
                        >
                          إرسال الرد
                        </button>
                        <button
                          onClick={() => setActiveTicketReplyId(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setActiveTicketReplyId(t.id); setTicketReplyText(''); }}
                        className="bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-700"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>الرد على هذه التذكرة</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content 1: Deposit Approvals */}
      {activeTab === 'deposits' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white">إشعارات الشحن الواردة من العملاء</h3>
          {deposits.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-12">لا توجد طلبات إيداع مسجلة</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 font-bold uppercase">
                    <th className="p-4">رقم الإشعار</th>
                    <th className="p-4">المستخدم</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4 text-center">المبلغ ($ USD)</th>
                    <th className="p-4 text-center">المبلغ المحول</th>
                    <th className="p-4">هاتف / مرجع المرسل</th>
                    <th className="p-4 text-center">الحالة</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4 text-center">إجراءات الموافقة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs text-slate-300 font-medium">
                  {deposits.map(d => (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-400">{d.id}</td>
                      <td className="p-4 font-bold text-white">{d.username}</td>
                      <td className="p-4 font-bold">{d.gateway}</td>
                      <td className="p-4 text-center font-mono font-bold text-emerald-400">{d.amount}$</td>
                      <td className="p-4 text-center font-mono text-slate-400">{d.amountLocal} {d.currency}</td>
                      <td className="p-4 font-mono text-amber-300 select-all" dir="ltr">{d.senderPhoneOrRef}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                          d.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          d.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {d.status === 'approved' ? 'تمت الموافقة وإضافة الرصيد' : d.status === 'rejected' ? 'مرفوض' : 'معلق (بانتظار التأكيد)'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-500 whitespace-nowrap">{d.createdAt}</td>
                      <td className="p-4 text-center">
                        {d.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => approveDeposit(d.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all"
                              title="موافقة وإضافة الرصيد للمستخدم"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => rejectDeposit(d.id)}
                              className="bg-rose-600 hover:bg-rose-500 text-white p-2 rounded-xl transition-all"
                              title="رفض الإشعار"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Content 2: Users Manager */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">إدارة الأعضاء وصلاحيات الحسابات</h3>
            <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              {isSuperAdmin ? 'أنت السوبر أدمين: يمكنك كشف كلمات المرور' : 'أنت أدمين عادي: كلمات المرور مشفرة'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 font-bold uppercase">
                  <th className="p-4">رقم</th>
                  <th className="p-4">اسم المستخدم</th>
                  <th className="p-4">البريد الإلكتروني / واتساب</th>
                  <th className="p-4 text-center">الصلاحية</th>
                  <th className="p-4 text-center">الرصيد المتاح</th>
                  <th className="p-4 text-center">كلمة المرور</th>
                  <th className="p-4 text-center">الحالة (حظر)</th>
                  <th className="p-4 text-center">إجراءات إدارية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs text-slate-300 font-medium">
                {users.map(u => (
                  <tr key={u.id} className={`transition-colors ${u.isBanned ? 'bg-rose-950/20' : 'hover:bg-slate-800/40'}`}>
                    <td className="p-4 font-mono font-bold text-slate-400">{u.id}</td>
                    <td className="p-4 font-bold text-white flex items-center gap-1.5">
                      <span>{u.username}</span>
                      {u.role === 'superadmin' && <span className="text-rose-400 font-bold text-[10px] bg-rose-500/10 px-1 rounded">Super</span>}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-emerald-400">{u.whatsapp || 'غير مسجل'}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        u.role === 'superadmin' ? 'bg-rose-500/20 text-rose-400' :
                        u.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-emerald-400">{formatPrice(u.balance)}</td>
                    <td className="p-4 text-center font-mono">
                      {isSuperAdmin ? (
                        <div className="flex items-center justify-center gap-1">
                          <span className="bg-slate-800 px-2 py-1 rounded text-amber-300 font-bold text-xs select-all">
                            {showPasswords[u.id] ? u.passwordMock : '••••••••'}
                          </span>
                          <button
                            onClick={() => setShowPasswords(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                            className="text-slate-400 hover:text-white p-1"
                            title="كشف / إخفاء الباسورد"
                          >
                            {showPasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <span className="bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono text-xs">•••••••• (مشفر)</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.isBanned ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {u.isBanned ? 'محظور (Banned)' : 'نشط'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleBalanceAdd(u.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl font-bold transition-all text-[11px]"
                          title="تعديل رصيد المستخدم"
                        >
                          تعديل الرصيد
                        </button>
                        <button
                          onClick={() => toggleBanUser(u.id)}
                          disabled={u.role === 'superadmin'}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] flex items-center gap-1 ${
                            u.isBanned ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                          } ${u.role === 'superadmin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="حظر / فك حظر"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{u.isBanned ? 'فك الحظر' : 'حظر'}</span>
                        </button>
                        <button
                          onClick={() => {
                            if (u.id === currentUser.id) {
                              alert('لا يمكنك حذف حسابك الحالي.');
                              return;
                            }
                            if (!isSuperAdmin && u.role !== 'user') {
                              alert('الأدمين العادي يمكنه حذف المستخدمين فقط.');
                              return;
                            }
                            if (confirm(`حذف المستخدم ${u.username} وكل بياناته؟`)) deleteUser(u.id);
                          }}
                          disabled={u.id === currentUser.id || (!isSuperAdmin && u.role !== 'user')}
                          className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] flex items-center gap-1 border border-rose-500/20"
                          title="حذف المستخدم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 3: Services Pricing Manager */}
      {activeTab === 'services' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">إدارة الخدمات والحسابات الرقمية</h3>
            <button
              onClick={() => {
                setEditServiceId(null);
                setNewSrvCat('متابعين انستغرام');
                setNewSrvName('');
                setNewSrvRate(1);
                setNewSrvMin(100);
                setNewSrvMax(10000);
                setNewSrvTime('15 دقيقة');
                setNewSrvDesc('');
                setNewSrvIsDigital(false);
                setNewSrvAccountsStr('');
                setShowAddServiceModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة خدمة أو حساب جديد</span>
            </button>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
            <h4 className="font-black text-white text-sm">Liste Pro des catégories</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {categoryNames.map(category => (
                <div key={category} className="bg-slate-900 border border-slate-700 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-400 truncate">{category}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{services.filter(s => s.categoryName === category).length} services</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newCategory = prompt('اكتب اسم الفئة الجديد:', category);
                        if (!newCategory?.trim()) return;
                        services.filter(s => s.categoryName === category).forEach(s => updateService(s.id, { categoryName: newCategory.trim() }));
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-[11px] transition-all"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`حذف الفئة ${category} وكل خدماتها؟`)) return;
                        services.filter(s => s.categoryName === category).forEach(s => deleteService(s.id));
                      }}
                      className="flex-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold py-2 rounded-lg text-[11px] transition-all border border-rose-500/20"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 font-bold uppercase">
                  <th className="p-4">رقم الخدمة</th>
                  <th className="p-4">النوع / الفئة</th>
                  <th className="p-4">اسم الخدمة</th>
                  <th className="p-4 text-center">السعر المعتمد (1000)</th>
                  <th className="p-4 text-center">متوسط الوقت</th>
                  <th className="p-4 text-center">إجراءات (تعديل / حذف)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs text-slate-300 font-medium">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">{s.id}</td>
                    <td className="p-4 font-bold text-amber-400">
                      <div>{s.categoryName}</div>
                      {s.isDigitalGood && <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded font-mono">حسابات رقمية</span>}
                    </td>
                    <td className="p-4 font-bold text-white max-w-xs truncate">{s.name}</td>
                    <td className="p-4 text-center font-mono font-bold text-emerald-400 text-base">{s.ratePer1000}$</td>
                    <td className="p-4 text-center font-mono">{s.avgTime}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditServiceId(s.id);
                            setNewSrvCat(s.categoryName);
                            setNewSrvName(s.name);
                            setNewSrvRate(s.ratePer1000);
                            setNewSrvMin(s.minQty);
                            setNewSrvMax(s.maxQty);
                            setNewSrvTime(s.avgTime);
                            setNewSrvDesc(s.description);
                            setNewSrvIsDigital(Boolean(s.isDigitalGood));
                            setNewSrvAccountsStr((s.accountsAvailable || []).join('\n'));
                            setShowAddServiceModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1"
                          title="تعديل الخدمة والفئة"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => handlePriceEdit(s.id, s.ratePer1000)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1"
                          title="تغيير السعر"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>السعر</span>
                        </button>
                        <button
                          onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) deleteService(s.id); }}
                          className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white p-1.5 rounded-xl transition-all border border-rose-500/20"
                          title="حذف الخدمة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 3.25: Images Manager */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-white">إدارة جميع صور الموقع</h3>
              <p className="text-xs text-slate-400 mt-1">غيّر اللوقو وصور الخدمات والحسابات الرقمية مباشرة من لوحة الإدارة.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-black text-white">لوقو الموقع</h4>
                <div className="flex items-center gap-4">
                  <img src={brandLogoUrl || '/Flogo.svg'} onError={e => { e.currentTarget.src = '/flexa-mark.svg'; }} alt="Logo preview" className="w-16 h-16 rounded-2xl object-contain bg-slate-950 border border-slate-700" />
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-bold text-slate-300">رابط / مسار اللوقو الصغير</label>
                    <input
                      value={brandLogoUrl}
                      onChange={e => setBrandLogoUrl(e.target.value)}
                      placeholder="/logo.png أو رابط صورة كامل"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <img src={brandWordmarkUrl || brandLogoUrl || '/Flogo.svg'} onError={e => { e.currentTarget.src = '/flexa-logo.svg'; }} alt="Wordmark preview" className="w-32 h-16 rounded-2xl object-contain bg-slate-950 border border-slate-700" />
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-bold text-slate-300">رابط / مسار اللوقو الكامل</label>
                    <input
                      value={brandWordmarkUrl}
                      onChange={e => setBrandWordmarkUrl(e.target.value)}
                      placeholder="/logo.png أو رابط صورة كامل"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  onClick={() => updateSettings({ ...settings, logoUrl: brandLogoUrl.trim() || '/Flogo.svg', wordmarkUrl: brandWordmarkUrl.trim() || brandLogoUrl.trim() || '/Flogo.svg' })}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all"
                >
                  حفظ صور اللوقو
                </button>
              </div>

              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-3 text-xs text-slate-300">
                <h4 className="text-sm font-black text-white">ملاحظة مهمة</h4>
                <p>يمكنك وضع صورة في مجلد <code className="text-blue-300 font-mono">public/</code> مثل <code className="text-blue-300 font-mono">/logo.png</code> أو استعمال رابط خارجي مباشر مثل Unsplash / CDN.</p>
                <p>أي صورة خدمة تقوم بحفظها هنا ستظهر في صفحة الطلب الجديد، صفحة الخدمات، ومتجر الحسابات الرقمية.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-extrabold text-white">صور الخدمات والحسابات الرقمية</h4>
            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {services.map(service => {
                const currentImage = serviceImageDrafts[service.id] ?? service.image ?? '';
                return (
                  <div key={service.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 grid grid-cols-1 lg:grid-cols-[96px_1fr_auto] gap-4 items-center">
                    <div className="w-24 h-20 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center">
                      {currentImage ? (
                        <img src={currentImage} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-500 text-center px-2">No image</span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div>
                        <span className="text-[10px] text-blue-400 font-bold">{service.categoryName}</span>
                        <h5 className="text-sm font-bold text-white truncate">{service.name}</h5>
                      </div>
                      <input
                        value={currentImage}
                        onChange={e => setServiceImageDrafts(prev => ({ ...prev, [service.id]: e.target.value }))}
                        placeholder="ضع رابط الصورة أو اتركه فارغاً"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                        dir="ltr"
                      />
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => updateServiceImage(service.id, currentImage)}
                        className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => {
                          setServiceImageDrafts(prev => ({ ...prev, [service.id]: '' }));
                          updateServiceImage(service.id, '');
                        }}
                        className="flex-1 lg:flex-none bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-rose-500/20"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content 3.5: Announcements Manager */}
      {activeTab === 'announcements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">إدارة الإعلانات، التحديثات والمكافآت</h3>
            <button
              onClick={() => setShowAddAnnModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>نشر إعلان أو تحديث جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ann.type === 'gift' ? 'bg-amber-500/20 text-amber-300' :
                      ann.type === 'update' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {ann.type === 'gift' ? 'مكافأة' : ann.type === 'update' ? 'تحديث' : 'معلومة'}
                    </span>
                    <h4 className="font-bold text-white text-sm">{ann.title}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">({ann.date})</span>
                  </div>
                  <p className="text-xs text-slate-300">{ann.content}</p>
                </div>
                <button
                  onClick={() => { if (confirm('حذف هذا الإعلان؟')) deleteAnnouncement(ann.id); }}
                  className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white p-2 rounded-xl transition-all shrink-0 border border-rose-500/20"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content 3.75: Online Database */}
      {activeTab === 'database' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-xl font-black text-white">Database Online بدل Local Storage</h3>
              <p className="text-xs text-slate-400 mt-1">تم حذف كل قواعد البيانات الأخرى. التخزين والمزامنة في هذا المشروع تعمل دائماً عبر Supabase Postgres فقط.</p>
            </div>

            <div className="bg-blue-600/15 border border-blue-500/30 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <span className="font-black text-white text-base block">Supabase Postgres</span>
                <span className="text-xs text-blue-300">Database backend الوحيد للموقع</span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">ACTIVE</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-white text-sm">إعدادات Supabase</h4>
                  <p className="text-[11px] text-slate-400 mt-1">ضع Project URL و anon public key من لوحة Supabase.</p>
                </div>
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">مفعّل دائماً</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Supabase URL</label>
                  <input value={dbUrl} onChange={e => setDbUrl(e.target.value)} dir="ltr" placeholder="https://xxxx.supabase.co" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Anon Public Key</label>
                  <input value={dbKey} onChange={e => setDbKey(e.target.value)} dir="ltr" type="password" placeholder="eyJhbGciOi..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Table Name</label>
                <input value={dbTable} onChange={e => setDbTable(e.target.value)} dir="ltr" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-400 cursor-pointer">
                  <input type="checkbox" checked={dbAutoSync} onChange={e => setDbAutoSync(e.target.checked)} className="accent-emerald-500" />
                  <span>رفع البيانات تلقائياً إلى Supabase بطريقة مستقرة</span>
                </label>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Interval ms</label>
                  <input
                    type="number"
                    min={5000}
                    step={1000}
                    value={dbAutoSyncMs}
                    onChange={e => setDbAutoSyncMs(Math.max(5000, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                <label className="flex items-center gap-2 text-xs font-bold text-blue-400 cursor-pointer">
                  <input type="checkbox" checked={dbAutoPull} onChange={e => setDbAutoPull(e.target.checked)} className="accent-blue-500" />
                  <span>تحميل البيانات تلقائياً من Supabase بطريقة مستقرة</span>
                </label>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Download interval ms</label>
                  <input
                    type="number"
                    min={15000}
                    step={1000}
                    value={dbAutoPullMs}
                    onChange={e => setDbAutoPullMs(Math.max(15000, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateSettings({
                    ...settings,
                    database: {
                      provider: dbProvider as any,
                      supabaseUrl: dbUrl.trim(),
                      supabaseAnonKey: dbKey.trim(),
                      tableName: dbTable.trim() || 'flexapanel_data',
                      isEnabled: true,
                      autoSyncEnabled: dbAutoSync,
                      autoSyncIntervalMs: Math.max(5000, Number(dbAutoSyncMs || 5000)),
                      autoPullEnabled: dbAutoPull,
                      autoPullIntervalMs: Math.max(15000, Number(dbAutoPullMs || 15000)),
                      lastSync: settings.database?.lastSync
                    }
                  })}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all"
                >
                  حفظ إعدادات قاعدة البيانات
                </button>
                <button onClick={testDatabaseConnection} className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs border border-emerald-500/30 transition-all">اختبار الاتصال</button>
                <button onClick={() => uploadDatabaseSnapshot()} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all">رفع كل البيانات إلى Supabase</button>
                <button onClick={() => downloadDatabaseSnapshot()} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition-all">تحميل البيانات من Supabase</button>
              </div>

              <div className="bg-black/30 border border-slate-700 rounded-xl p-3 text-xs text-slate-300">
                <strong className="text-white block mb-1">الحالة:</strong>
                <span className="font-mono text-emerald-400">{databaseStatus}</span>
                {settings.database?.lastSync && <span className="block mt-1 text-slate-400">آخر Sync: {settings.database.lastSync}</span>}
              </div>
            </div>

            <div className="bg-slate-800/40 border border-amber-500/20 rounded-2xl p-5 text-xs text-slate-300 space-y-3">
              <h4 className="font-black text-amber-400">SQL المطلوب في Supabase مرة واحدة فقط</h4>
              <pre dir="ltr" className="bg-black/60 text-emerald-300 rounded-xl p-4 overflow-x-auto text-[11px] leading-relaxed">{`create table if not exists flexapanel_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table flexapanel_data enable row level security;

create policy "Allow anon read/write for Flexapanel"
on flexapanel_data
for all
to anon
using (true)
with check (true);`}</pre>
              <p>للإنتاج الحقيقي والأمان العالي، الأفضل استعمال Backend API أو Supabase Edge Functions بدل وضع مفاتيح الإدارة داخل الواجهة.</p>
            </div>
          </div>
        </div>
      )}

      {/* Content 4: Payment Settings (D17, etc.) */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">أرقام وحسابات الدفع (تظهر في صفحة الشحن)</h3>
            <p className="text-xs text-slate-400">قم بتغيير رقم هاتف تطبيق D17، عنوان العملات الرقمية، أو الحسابات البنكية ليتم تحديثها فوراً للعملاء</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">رقم هاتف تطبيق D17 (البريد التونسي)</label>
              <input
                type="text"
                value={d17}
                onChange={e => setD17(e.target.value)}
                placeholder="28 444 555"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-mono text-base focus:outline-none focus:border-blue-500 text-left"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">حساب البريد الجاري (RIB/Poste Compte)</label>
              <input
                type="text"
                value={poste}
                onChange={e => setPoste(e.target.value)}
                placeholder="17001 0000 4567 89"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-mono text-base focus:outline-none focus:border-blue-500 text-left"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">عنوان محفظة العملات الرقمية USDT (TRC20)</label>
              <input
                type="text"
                value={crypto}
                onChange={e => setCrypto(e.target.value)}
                placeholder="TXab89sJ9kL1mN3oP4qR5sT6uV7wX8yZ9 (TRC20)"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-mono text-base focus:outline-none focus:border-blue-500 text-left"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">بريد حساب PayPal</label>
                <input
                  type="email"
                  value={paypal}
                  onChange={e => setPaypal(e.target.value)}
                  placeholder="payments@flexashop.shop"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-mono text-base focus:outline-none focus:border-blue-500 text-left"
                  dir="ltr"
                  required
                />
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-white text-sm">Modes de paiement - Liste Pro</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Super Admin يمكنه إضافة، تعديل، تعطيل وحذف طرق الدفع.</p>
                </div>
                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('superAdd')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all"
                  >
                    + Ajouter mode
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {[
                  { id: 'd17', name: 'D17 Post', label: 'Téléphone D17', value: d17, setter: setD17 },
                  { id: 'poste', name: 'Poste Compte', label: 'RIB / CCP', value: poste, setter: setPoste },
                  { id: 'crypto', name: 'Crypto USDT', label: 'Wallet', value: crypto, setter: setCrypto },
                  { id: 'paypal', name: 'PayPal', label: 'Email', value: paypal, setter: setPaypal }
                ].map(mode => (
                  <div key={mode.id} className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-black text-white block">{mode.name}</span>
                      <span className="text-slate-400 font-mono" dir="ltr">{mode.label}: {mode.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = prompt(`Modifier ${mode.name}:`, mode.value);
                        if (next !== null) mode.setter(next);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg transition-all"
                    >
                      Modifier
                    </button>
                  </div>
                ))}

                {(settings.customGateways || []).map(gateway => (
                  <div key={gateway.id} className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-black text-white block">{gateway.icon} {gateway.name}</span>
                      <span className="text-slate-400 font-mono" dir="ltr">{gateway.accountLabel}: {gateway.accountValue}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const name = prompt('Nom mode:', gateway.name) || gateway.name;
                          const value = prompt('Compte / numéro:', gateway.accountValue) || gateway.accountValue;
                          updatePaymentGateway(gateway.id, { name, accountValue: value });
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded-lg transition-all"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePaymentGateway(gateway.id, { isActive: !gateway.isActive })}
                        className={`font-bold px-3 py-2 rounded-lg transition-all ${gateway.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'}`}
                      >
                        {gateway.isActive ? 'Actif' : 'Off'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { if (confirm('Supprimer ce mode de paiement?')) deletePaymentGateway(gateway.id); }}
                        className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold px-3 py-2 rounded-lg transition-all border border-rose-500/20"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
              <div>
                <h4 className="font-black text-white text-sm">أسعار الصرف والمظهر العام</h4>
                <p className="text-[11px] text-slate-400 mt-1">تحكم في taux تحويل الدولار إلى اليورو والدينار، وتحكم في وضع الموقع Light / Dark.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">USD</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rateUsd}
                    onChange={e => setRateUsd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">EUR مقابل 1$</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rateEur}
                    onChange={e => setRateEur(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">TND مقابل 1$</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rateTnd}
                    onChange={e => setRateTnd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-sm text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={theme}
                  onChange={e => setTheme(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold text-sm"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                </select>
                <button
                  type="button"
                  onClick={() => updateExchangeRates({ USD: rateUsd, EUR: rateEur, TND: rateTnd })}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                >
                  حفظ أسعار الصرف
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all text-base"
            >
              <Key className="w-5 h-5" />
              <span>حفظ وتطبيق بيانات الدفع 💾</span>
            </button>
          </form>
        </div>
      )}

      {/* Content 5: System Security Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white">سجلات الأمان وقطع الثغرات (Security Logs)</h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-mono border border-emerald-500/20">
              النظام محمي ومؤمن 100%
            </span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {logs.map(lg => (
              <div key={lg.id} className="p-4 bg-slate-850/60 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    lg.severity === 'success' ? 'bg-emerald-500' :
                    lg.severity === 'danger' ? 'bg-rose-500 animate-pulse' :
                    lg.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <strong className="text-white block font-bold text-sm mb-0.5">{lg.action}</strong>
                    <span className="text-slate-400 text-[11px]">المستخدم: <strong className="text-blue-400 font-mono">{lg.username}</strong> | IP: <strong className="font-mono text-slate-500">{lg.ip}</strong></span>
                  </div>
                </div>
                <span className="font-mono text-slate-500 text-[11px] whitespace-nowrap">{lg.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Service */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-right">
            <h3 className="text-lg font-black text-white">{editServiceId ? 'تعديل الخدمة والفئة' : 'إضافة خدمة أو حساب جديد للمنظومة'}</h3>

            <form onSubmit={e => {
              e.preventDefault();
              if (!newSrvName.trim()) return;
              if (!newSrvCat.trim()) {
                alert('الرجاء اختيار أو إضافة فئة للخدمة.');
                return;
              }
              const cleanCategory = newSrvCat.trim();
              const servicePayload = {
                categoryId: 'cat_' + cleanCategory.toLowerCase().replace(/\s+/g, '-'),
                categoryName: cleanCategory,
                name: newSrvName.trim(),
                ratePer1000: Number(newSrvRate),
                minQty: Number(newSrvMin),
                maxQty: Number(newSrvMax),
                avgTime: newSrvTime.trim(),
                description: newSrvDesc.trim(),
                isDigitalGood: newSrvIsDigital,
                accountsAvailable: newSrvIsDigital && newSrvAccountsStr ? newSrvAccountsStr.split('\n').filter(a => a.trim()) : undefined
              };
              if (editServiceId) {
                updateService(editServiceId, servicePayload);
              } else {
                addService(servicePayload);
              }
              setShowAddServiceModal(false);
              setEditServiceId(null);
              setNewSrvName('');
              setNewSrvAccountsStr('');
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">النوع</label>
                <select
                  value={newSrvIsDigital ? 'digital' : 'smm'}
                  onChange={e => {
                    const isDig = e.target.value === 'digital';
                    setNewSrvIsDigital(isDig);
                    if (isDig) {
                      setNewSrvCat('حسابات نتفليكس (Netflix)');
                      setNewSrvMin(1);
                      setNewSrvMax(5);
                    } else {
                      setNewSrvCat('متابعين انستغرام (ضمان 30 يوم)');
                      setNewSrvMin(100);
                      setNewSrvMax(10000);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                >
                  <option value="smm">خدمات سوشيال ميديا (SMM)</option>
                  <option value="digital">حسابات رقمية واشتراكات (Netflix, Spotify...)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الفئة</label>
                  <select
                    value={categoryNames.includes(newSrvCat) ? newSrvCat : '__new__'}
                    onChange={e => {
                      if (e.target.value === '__new__') {
                        setNewSrvCat('');
                      } else {
                        setNewSrvCat(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                    required
                  >
                    <option value="__new__">+ إضافة فئة جديدة</option>
                    {categoryNames.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {!categoryNames.includes(newSrvCat) && (
                    <input
                      type="text"
                      value={newSrvCat}
                      onChange={e => setNewSrvCat(e.target.value)}
                      placeholder="اكتب اسم الفئة الجديدة مرة واحدة"
                      className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">متوسط وقت التسليم</label>
                  <input
                    type="text"
                    value={newSrvTime}
                    onChange={e => setNewSrvTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم الخدمة والتوصيف الكامل</label>
                <input
                  type="text"
                  value={newSrvName}
                  onChange={e => setNewSrvName(e.target.value)}
                  placeholder="متابعين انستغرام حقيقيين 🚀"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">السعر ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSrvRate}
                    onChange={e => setNewSrvRate(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الحد الأدنى</label>
                  <input
                    type="number"
                    value={newSrvMin}
                    onChange={e => setNewSrvMin(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الحد الأقصى</label>
                  <input
                    type="number"
                    value={newSrvMax}
                    onChange={e => setNewSrvMax(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الوصف والشروط</label>
                <textarea
                  rows={2}
                  value={newSrvDesc}
                  onChange={e => setNewSrvDesc(e.target.value)}
                  placeholder="اكتب تفاصيل الخدمة والضمان..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {newSrvIsDigital && (
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">الحسابات المتاحة للتسليم الفوري (كل حساب في سطر)</label>
                  <textarea
                    rows={3}
                    value={newSrvAccountsStr}
                    onChange={e => setNewSrvAccountsStr(e.target.value)}
                    placeholder="email1@flexashop.shop:pass123&#10;email2@flexashop.shop:pass456"
                    className="w-full bg-black border border-amber-500/40 rounded-xl p-3 text-xs text-emerald-300 font-mono text-left"
                    dir="ltr"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  حفظ الخدمة بالموقع
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Announcement */}
      {showAddAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-right">
            <h3 className="text-lg font-black text-white">نشر إعلان أو تحديث جديد للعملاء</h3>

            <form onSubmit={e => {
              e.preventDefault();
              if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
              addAnnouncement({
                title: newAnnTitle.trim(),
                content: newAnnContent.trim(),
                type: newAnnType
              });
              setShowAddAnnModal(false);
              setNewAnnTitle('');
              setNewAnnContent('');
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نوع الإعلان</label>
                <select
                  value={newAnnType}
                  onChange={e => setNewAnnType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                >
                  <option value="info">إعلان / معلومة عامة</option>
                  <option value="update">تحديث منصة وسيرفرات</option>
                  <option value="gift">هدية أو مكافأة أو عرض خاص</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان الإشعار</label>
                <input
                  type="text"
                  value={newAnnTitle}
                  onChange={e => setNewAnnTitle(e.target.value)}
                  placeholder="🎉 سيرفرات المتابعين الفورية عادت للعمل!"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نص وتفاصيل الإعلان</label>
                <textarea
                  rows={4}
                  value={newAnnContent}
                  onChange={e => setNewAnnContent(e.target.value)}
                  placeholder="تم تحديث السرعة وزيادة استقرار التعويض التلقائي..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  نشر الإشعار بالصفحة الرئيسية
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAnnModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Provider */}
      {showAddProvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-right">
            <h3 className="text-lg font-black text-white">{editProvId ? 'تعديل بيانات مزود API' : 'إضافة مزود API SMM جديد'}</h3>

            <form onSubmit={e => {
              e.preventDefault();
              if (!provName.trim() || !provUrl.trim() || !provKey.trim()) return;
              if (editProvId) {
                updateProvider(editProvId, { name: provName.trim(), apiUrl: provUrl.trim(), apiKey: provKey.trim(), proxyUrl: provProxyUrl.trim() || undefined, balance: undefined, currency: undefined });
              } else {
                addProvider({ name: provName.trim(), apiUrl: provUrl.trim(), apiKey: provKey.trim(), proxyUrl: provProxyUrl.trim() || undefined, isActive: true });
              }
              setShowAddProvModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المزود / البانل</label>
                <input
                  type="text"
                  value={provName}
                  onChange={e => setProvName(e.target.value)}
                  placeholder="SMM Party Server"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">رابط الـ API (API URL)</label>
                <input
                  type="url"
                  value={provUrl}
                  onChange={e => setProvUrl(e.target.value)}
                  placeholder="https://smmparty.com/api/v2"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                  dir="ltr"
                  required
                />
                <span className="text-[10px] text-slate-500 block mt-1">يجب أن يدعم بروتوكول SMM v2 الموحد.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">المفتاح السري (API Key)</label>
                <input
                  type="text"
                  value={provKey}
                  onChange={e => setProvKey(e.target.value)}
                  placeholder="ضع مفتاح الـ API هنا..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Proxy URL</label>
                <input
                  type="url"
                  value={provProxyUrl}
                  onChange={e => setProvProxyUrl(e.target.value)}
                  placeholder="https://iinakypsmwooxnjmmvfz.supabase.co/functions/v1/smm-proxy"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-left"
                  dir="ltr"
                />
                <span className="text-[10px] text-amber-400 block mt-1">الحل النهائي: انشر Supabase Edge Function smm-proxy ثم استعمل هذا الرابط.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  حفظ بيانات المزود
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProvModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
