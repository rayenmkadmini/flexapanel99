import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Bell, Sun, Moon, Globe, DollarSign, LogOut, LogIn, CheckCircle2, UserCheck, Star } from 'lucide-react';
import { Currency, Language } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    settings,
    logout,
    currency,
    setCurrency,
    language,
    setLanguage,
    theme,
    setTheme,
    t,
    formatPrice,
    hideBalance,
    setHideBalance,
    setCurrentView,
    deposits,
    tickets
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrMenu, setShowCurrMenu] = useState(false);

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const openTickets = tickets.filter(tk => tk.status === 'open');
  const notifCount = (currentUser?.role === 'superadmin' || currentUser?.role === 'admin' ? pendingDeposits.length : 0) + openTickets.length;
  const logoUrl = settings.logoUrl || '/Flogo.svg';

  const renderTierBadge = () => {
    if (!currentUser) return null;
    switch (currentUser.tier) {
      case 'vip':
        return (
          <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-lg shadow-yellow-500/20">
            <Star className="w-3 h-3 fill-black" /> VIP
          </span>
        );
      case 'plus':
        return (
          <span className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-lg shadow-blue-500/20">
            <UserCheck className="w-3 h-3" /> Plus
          </span>
        );
      default:
        return (
          <span className="bg-slate-700 text-slate-300 font-medium text-xs px-2.5 py-0.5 rounded-full">
            عادي
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-[80] bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pl-14 lg:pl-0">
        
        {/* User Greeting & Balances */}
        <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/25 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <img src={logoUrl} onError={e => { e.currentTarget.src = '/flexa-mark.svg'; }} alt="FlexaPanel" className="w-9 h-9 object-contain" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:flex-none">
              {currentUser ? (
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span className="text-xs text-slate-400 font-medium">{t('nav.welcome')}</span>
                  <span className="font-extrabold text-white text-sm sm:text-base tracking-wide truncate max-w-[140px] sm:max-w-none">{currentUser.username}</span>
                  {renderTierBadge()}
                </div>
              ) : (
                <span className="text-sm font-bold text-slate-300">الرجاء تسجيل الدخول</span>
              )}
              {currentUser && (
                <div className="flex items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-400 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-300">
                    {t('nav.currentBalance')}:{' '}
                    <strong className="text-emerald-400 font-mono font-bold">
                      {hideBalance ? '$***.**' : formatPrice(currentUser.balance)}
                    </strong>
                  </span>

                  <span className="hidden sm:inline text-slate-500">|</span>

                  <span className="hidden sm:flex items-center gap-1 text-slate-400">
                    {t('nav.spentBalance')}:{' '}
                    <strong className="text-rose-400 font-mono">
                      {hideBalance ? '$***.**' : formatPrice(currentUser.spent)}
                    </strong>
                  </span>

                  <button
                    onClick={() => setHideBalance(!hideBalance)}
                    className="text-slate-400 hover:text-white transition-colors ml-1 focus:outline-none"
                    title={hideBalance ? 'إظهار الرصيد' : 'إخفاء الرصيد'}
                  >
                    {hideBalance ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Dropdowns */}
        <div className="relative z-[90] flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto sm:overflow-visible no-scrollbar pb-1 sm:pb-0 justify-start sm:justify-end">
          
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowCurrMenu(!showCurrMenu); setShowLangMenu(false); setShowNotifications(false); }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold transition-all"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currency}</span>
            </button>
            {showCurrMenu && (
              <div className="fixed top-24 left-3 right-3 sm:absolute sm:top-full sm:left-0 sm:right-auto sm:mt-2 sm:w-32 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl shadow-black/40 py-2 z-[9999] ring-1 ring-white/5">
                <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 border-b border-slate-800 mb-1">اختر العملة</div>
                {(['USD', 'TND', 'EUR'] as Currency[]).map(curr => (
                  <button
                    key={curr}
                    onClick={() => { setCurrency(curr); setShowCurrMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-slate-800 text-white ${currency === curr ? 'bg-blue-600/20 text-blue-400' : ''}`}
                  >
                    <span>{curr}</span>
                    {currency === curr && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowCurrMenu(false); setShowNotifications(false); }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="uppercase">{language}</span>
            </button>
            {showLangMenu && (
              <div className="fixed top-24 left-3 right-3 sm:absolute sm:top-full sm:left-0 sm:right-auto sm:mt-2 sm:w-44 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl shadow-black/40 py-2 z-[9999] ring-1 ring-white/5">
                <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 border-b border-slate-800 mb-1">اختر اللغة / Language</div>
                {(['ar', 'fr', 'en'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-slate-800 text-white ${language === lang ? 'bg-blue-600/20 text-blue-400' : ''}`}
                  >
                    <span>{lang === 'ar' ? 'العربية 🇹🇳' : lang === 'fr' ? 'Français 🇫🇷' : 'English 🇬🇧'}</span>
                    {language === lang && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all"
            title="تغيير المظهر"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications Modal / Bell */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowCurrMenu(false); setShowLangMenu(false); }}
              className="relative p-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all"
            >
              <Bell className="w-4 h-4" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse border-2 border-slate-900">
                  {notifCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="fixed top-24 left-3 right-3 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-3 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl shadow-black/40 p-4 z-[9999] max-h-[70vh] sm:max-h-96 overflow-y-auto ring-1 ring-white/5">
                <h4 className="text-sm font-extrabold text-white mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>الإشعارات والتنبيهات</span>
                  <span className="bg-slate-800 text-blue-400 px-2 py-0.5 rounded-lg text-xs font-mono">{notifCount}</span>
                </h4>
                {notifCount === 0 ? (
                  <p className="text-slate-400 text-xs text-center py-6">لا توجد إشعارات جديدة حالياً.</p>
                ) : (
                  <div className="space-y-2.5">
                    {currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'admin') && pendingDeposits.map(d => (
                      <div
                        key={d.id}
                        onClick={() => { setCurrentView('adminPanel'); setShowNotifications(false); }}
                        className="p-3 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-blue-500/30 cursor-pointer transition-colors"
                      >
                        <span className="text-xs text-blue-400 font-bold block">طلب شحن رصيد جديد 💳</span>
                        <p className="text-xs text-slate-300 mt-1">
                          المستخدم <strong className="text-white">{d.username}</strong> طلب إيداع <strong className="text-emerald-400">{d.amount}$</strong> عبر {d.gateway}.
                        </p>
                      </div>
                    ))}
                    {openTickets.map(t => (
                      <div
                        key={t.id}
                        onClick={() => { setCurrentView('tickets'); setShowNotifications(false); }}
                        className="p-3 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-amber-500/30 cursor-pointer transition-colors"
                      >
                        <span className="text-xs text-amber-400 font-bold block">تذكرة دعم مفتوحة 💬</span>
                        <p className="text-xs text-slate-300 mt-1 truncate">{t.subject}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {currentUser ? (
            <button
              onClick={logout}
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl border border-rose-500/20 transition-all flex items-center gap-1 text-xs font-bold"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">{t('nav.logout')}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('auth')}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-all flex items-center gap-1.5 text-xs font-bold px-3"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('nav.login')} / {t('nav.register')}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
