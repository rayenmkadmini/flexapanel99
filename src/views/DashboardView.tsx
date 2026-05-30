import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShoppingBag, ShieldCheck, TrendingUp, ArrowLeft, Gift, Bell, Award, ArrowUpRight, Zap } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentUser, services, placeOrder, setCurrentView, formatPrice, announcements } = useApp();

  // Quick order state
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [quickServiceSearch, setQuickServiceSearch] = useState('');
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);

  const getServicePublicId = (service: typeof services[number]) => String(service.externalServiceId || service.id);
  const quickServices = services.filter(service => {
    if (service.isDigitalGood) return false;
    const query = quickServiceSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      service.id.toLowerCase().includes(query) ||
      getServicePublicId(service).toLowerCase().includes(query) ||
      service.name.toLowerCase().includes(query) ||
      service.categoryName.toLowerCase().includes(query)
    );
  });

  const selectedService = services.find(s => s.id === selectedServiceId) || quickServices[0] || services[0];
  const calculatedPrice = selectedService ? (quantity / 1000) * selectedService.ratePer1000 : 0;

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    if (!targetLink.trim()) {
      alert('الرجاء إدخال الرابط المستهدف');
      return;
    }
    const res = await placeOrder(selectedService, targetLink.trim(), Number(quantity));
    if (!res.success) {
      alert(res.error);
    } else {
      setTargetLink('');
      setQuantity(selectedService.minQty);
    }
  };

  const getTierDetails = () => {
    if (!currentUser) return { name: 'زائر', color: 'from-slate-700 to-slate-800', badge: 'غير مسجل' };
    switch (currentUser.tier) {
      case 'vip':
        return { name: 'عضوية VIP الملكية 👑', color: 'from-amber-600 via-yellow-600 to-amber-700', badge: 'VIP Gold' };
      case 'plus':
        return { name: 'عضوية بلاس المميزة 🚀', color: 'from-blue-600 via-indigo-600 to-blue-700', badge: 'Plus Member' };
      default:
        return { name: 'عضوية قياسية 🛡️', color: 'from-slate-700 via-slate-800 to-slate-900', badge: 'Normal' };
    }
  };

  const tierInfo = getTierDetails();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Welcome Banner */}
      <div className={`rounded-3xl p-6 lg:p-8 bg-gradient-to-r ${tierInfo.color} text-white shadow-2xl relative overflow-hidden border border-white/10`}>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="bg-black/30 border border-white/20 text-white/90 text-xs font-bold px-3 py-1 rounded-full uppercase inline-block mb-3">
              {tierInfo.badge}
            </span>
            <h2 className="text-2xl lg:text-4xl font-black mb-2">
              مرحباً بك في فليكسا بانل (Flexapanel)، {currentUser ? currentUser.username : 'ضيفنا الكريم'}!
            </h2>
            <p className="text-white/80 text-sm lg:text-base max-w-xl leading-relaxed">
              المنصة رقم #1 في الوطن العربي لخدمات السوشيال ميديا الفورية وبيع الحسابات الرقمية (Netflix, Spotify, IPTV) بأفضل الأسعار.
            </p>

            {currentUser && (
              <div className="flex items-center gap-4 mt-6 text-xs sm:text-sm font-bold bg-black/20 p-3 rounded-2xl border border-white/15 max-w-md">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>النقاط المكتسبة: <strong className="text-white">{currentUser.points}</strong></span>
                </span>
                <span className="text-white/40">|</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>5 نقاط / 1$ إنفاق</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              onClick={() => setCurrentView('newOrder')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-black px-6 py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>طلب جديد سريع</span>
            </button>
            <button
              onClick={() => setCurrentView('digitalStore')}
              className="bg-black/40 hover:bg-black/60 text-white font-bold px-6 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>متجر الحسابات الفورية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Quick Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setCurrentView('addBalance')}
          className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 cursor-pointer group transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-base mb-1">شحن الرصيد</h4>
          <p className="text-xs text-slate-400">D17, Poste, Crypto, PayPal</p>
        </div>

        <div
          onClick={() => setCurrentView('orderHistory')}
          className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 cursor-pointer group transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-base mb-1">سجل الطلبات</h4>
          <p className="text-xs text-slate-400">تتبع الطلبات وطلب التعويض</p>
        </div>

        <div
          onClick={() => setCurrentView('gifts')}
          className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 cursor-pointer group transition-all hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10"
        >
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
            <Gift className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-base mb-1">الهدايا اليومية</h4>
          <p className="text-xs text-slate-400">تحويل النقاط لرصيد حقيقي</p>
        </div>

        <div
          onClick={() => setCurrentView('aiAutomation')}
          className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 cursor-pointer group transition-all hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10"
        >
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-base mb-1">المساعد الذكي AI</h4>
          <p className="text-xs text-slate-400">توصيات واختيار الباقات الأمثل</p>
        </div>
      </div>

      {/* Main Content: Quick Order & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Order Box */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 font-bold">
                🚀
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">الطلب السريع</h3>
                <p className="text-xs text-slate-400">اختر الخدمة، ضع الرابط واطلب فوراً</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('newOrder')}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>الخيارات المتقدمة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">اختر الخدمة السريعة</label>
              <input
                type="text"
                value={quickServiceSearch}
                onChange={e => {
                  const value = e.target.value;
                  setQuickServiceSearch(value);
                  const query = value.trim().toLowerCase();
                  const exactService = services.find(service =>
                    !service.isDigitalGood &&
                    (service.id.toLowerCase() === query || getServicePublicId(service).toLowerCase() === query)
                  );
                  if (exactService) {
                    setSelectedServiceId(exactService.id);
                    setQuantity(exactService.minQty);
                  }
                }}
                placeholder="بحث سريع برقم الخدمة ID أو الاسم..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mb-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-left text-sm"
                dir="ltr"
              />
              <select
                value={selectedService?.id || selectedServiceId}
                onChange={e => {
                  setSelectedServiceId(e.target.value);
                  const s = services.find(srv => srv.id === e.target.value);
                  if (s) setQuantity(s.minQty);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                {quickServices.map(s => (
                  <option key={s.id} value={s.id}>
                    #{getServicePublicId(s)} | {s.name} - ({s.ratePer1000}$ / 1000)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">الرابط / الحساب المستهدف</label>
              <input
                type="text"
                value={targetLink}
                onChange={e => setTargetLink(e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left font-mono"
                dir="ltr"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">الكمية المطلوبة</label>
                <input
                  type="number"
                  min={selectedService?.minQty || 100}
                  max={selectedService?.maxQty || 100000}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-bold"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  الحد الأدنى: {selectedService?.minQty} | الحد الأقصى: {selectedService?.maxQty}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">السعر المحسوب تلقائياً</label>
                <div className="w-full bg-slate-800/50 border border-blue-500/30 rounded-xl px-4 py-3 font-mono font-black text-xl text-emerald-400 flex items-center justify-between">
                  <span>{formatPrice(calculatedPrice)}</span>
                  <span className="text-xs font-sans text-slate-400 font-normal">({selectedService?.avgTime})</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 px-6 rounded-xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all text-base transform active:scale-98"
            >
              <span>تأكيد وإرسال الطلب فوراً 🚀</span>
            </button>
          </form>
        </div>

        {/* Announcements Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800 text-amber-400">
            <Bell className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">آخر التحديثات والأخبار</h3>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 hover:bg-slate-800 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono">{ann.date}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ann.type === 'gift' ? 'bg-amber-500/20 text-amber-400' :
                    ann.type === 'update' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {ann.type === 'gift' ? 'مكافأة' : ann.type === 'update' ? 'تحديث' : 'معلومة'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{ann.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('updates')}
            className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <span>عرض كل التحديثات</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
