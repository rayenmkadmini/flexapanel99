import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, PlusCircle, Layers, History, ListFilter, Award, RotateCcw,
  CreditCard, Share2, Store, HelpCircle, Gift, Sparkles,
  Code, ShieldAlert, ChevronDown, ChevronUp, Bot, Menu, X, User
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, currentUser, settings, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const logoUrl = settings.logoUrl || '/Flogo.svg';
  const wordmarkUrl = settings.wordmarkUrl || logoUrl;

  // Collapsible categories state
  const [collapsed, setCollapsed] = useState({
    main: false,
    finance: false,
    help: false,
    client: false,
  });

  const toggleCat = (cat: keyof typeof collapsed) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const navItem = (id: string, label: string, Icon: React.ElementType, badge?: string) => {
    const active = currentView === id;
    return (
      <button
        key={id}
        onClick={() => { setCurrentView(id); setIsOpen(false); }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
          active
            ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
          <span>{label}</span>
        </div>
        {badge && (
          <span className="bg-blue-500/20 text-blue-400 text-[10px] font-mono px-2 py-0.5 rounded-md border border-blue-500/30">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-slate-800 text-white rounded-xl border border-slate-700 shadow-xl focus:outline-none"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-40 w-[86vw] max-w-72 lg:w-64 bg-slate-900 border-l border-slate-800 flex flex-col transition-transform duration-300 shadow-2xl lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoUrl} onError={e => { e.currentTarget.src = '/flexa-mark.svg'; }} alt="FlexaPanel" className="w-10 h-10 rounded-xl shadow-lg shadow-blue-500/30 object-contain" />
            <div>
              <img src={wordmarkUrl} onError={e => { e.currentTarget.src = '/flexa-logo.svg'; }} alt="FlexaPanel" className="h-8 w-36 object-contain object-left invert brightness-0" />
              <span className="text-[10px] text-blue-400 font-mono tracking-widest block font-bold">VIP SMM & STORE</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Main Links */}
          <div className="space-y-1.5">
            <button
              onClick={() => toggleCat('main')}
              className="w-full flex items-center justify-between px-2 py-1 text-slate-400 font-extrabold text-[11px] tracking-wider uppercase hover:text-white"
            >
              <span>{t('side.mainLinks')}</span>
              {collapsed.main ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            {!collapsed.main && (
              <div className="space-y-1 mt-2">
                {navItem('dashboard', t('side.dashboard'), Home)}
                {navItem('newOrder', t('side.newOrder'), PlusCircle, 'سريع')}
                {navItem('massOrder', t('side.massOrder'), Layers)}
                {navItem('orderHistory', t('side.orderHistory'), History)}
                {navItem('services', t('side.services'), ListFilter)}
                {navItem('memberships', t('side.memberships'), Award)}
                {navItem('refill', t('side.refill'), RotateCcw)}
              </div>
            )}
          </div>

          {/* Finance & Store */}
          <div className="space-y-1.5">
            <button
              onClick={() => toggleCat('finance')}
              className="w-full flex items-center justify-between px-2 py-1 text-slate-400 font-extrabold text-[11px] tracking-wider uppercase hover:text-white"
            >
              <span>{t('side.finance')}</span>
              {collapsed.finance ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            {!collapsed.finance && (
              <div className="space-y-1 mt-2">
                {navItem('addBalance', t('side.addBalance'), CreditCard, 'D17/Crypto')}
                {navItem('digitalStore', t('side.digitalStore'), Store, 'Netflix/Spotify')}
                {navItem('affiliate', t('side.affiliate'), Share2)}
              </div>
            )}
          </div>

          {/* Help & Support */}
          <div className="space-y-1.5">
            <button
              onClick={() => toggleCat('help')}
              className="w-full flex items-center justify-between px-2 py-1 text-slate-400 font-extrabold text-[11px] tracking-wider uppercase hover:text-white"
            >
              <span>{t('side.help')}</span>
              {collapsed.help ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            {!collapsed.help && (
              <div className="space-y-1 mt-2">
                {navItem('tickets', t('side.supportTickets'), HelpCircle)}
              </div>
            )}
          </div>

          {/* Client Info & AI */}
          <div className="space-y-1.5">
            <button
              onClick={() => toggleCat('client')}
              className="w-full flex items-center justify-between px-2 py-1 text-slate-400 font-extrabold text-[11px] tracking-wider uppercase hover:text-white"
            >
              <span>{t('side.clientInfo')}</span>
              {collapsed.client ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            {!collapsed.client && (
              <div className="space-y-1 mt-2">
                {navItem('profile', 'تعديل البروفيل', User)}
                {navItem('gifts', t('side.gifts'), Gift, 'يومي')}
                {navItem('updates', t('side.updates'), Sparkles)}
                {navItem('api', t('side.api'), Code)}
                {navItem('aiAutomation', t('side.aiAutomation'), Bot, 'AI 🤖')}
              </div>
            )}
          </div>

          {/* Admin Panel Access */}
          {currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'admin') && (
            <div className="pt-4 border-t border-slate-800">
              <span className="px-2 text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-2">إدارة المنظومة</span>
              {navItem('adminPanel', t('side.adminPanel'), ShieldAlert, currentUser.role === 'superadmin' ? 'Super' : 'Admin')}
            </div>
          )}

        </div>

        {/* Footer Stats / Version */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>متصل وسريع</span>
          </span>
          <span>v3.5.0 PRO</span>
        </div>
      </aside>
    </>
  );
};
