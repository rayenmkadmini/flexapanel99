import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, Key, Clock, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import { Service } from '../types';

export const DigitalStoreView: React.FC = () => {
  const { services, buyAccount, formatPrice, t } = useApp();
  const storeItems = services.filter(s => s.isDigitalGood);

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const categories = Array.from(new Set(storeItems.map(s => s.categoryName)));

  const filtered = selectedCat === 'all' ? storeItems : storeItems.filter(s => s.categoryName === selectedCat);

  const handleBuy = (item: Service) => {
    if (!confirm(`هل أنت متأكد من شراء "${item.name}" بسعر ${formatPrice(item.ratePer1000)}؟`)) return;
    const res = buyAccount(item);
    if (!res.success) {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 lg:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-white">{t('store.title')}</h2>
            <p className="text-xs text-slate-400 mt-1">{t('store.subtitle')}</p>
          </div>
        </div>

        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center gap-3">
          <span className="text-xs text-slate-300 font-bold">المنتجات المتاحة للتسليم الفوري:</span>
          <span className="bg-emerald-500/20 text-emerald-400 font-mono font-bold px-3 py-1 rounded-xl text-xs border border-emerald-500/30">
            {storeItems.reduce((acc, curr) => acc + (curr.accountsAvailable?.length || 0), 0)} حساب جاهز
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${selectedCat === 'all' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
        >
          جميع الحسابات
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${selectedCat === cat ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => {
          const stock = item.accountsAvailable?.length || 0;
          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col transition-transform hover:-translate-y-1 duration-300 group"
            >
              {item.image && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  
                  <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/80 font-mono font-black text-amber-400 text-sm shadow-lg">
                    {formatPrice(item.ratePer1000)}
                  </div>

                  <div className="absolute bottom-4 left-4 bg-emerald-500/90 text-black font-extrabold text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ضمان كامل المدة</span>
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">{item.categoryName}</span>
                  <h3 className="text-base font-extrabold text-white leading-snug">{item.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>وقت التسليم:</span>
                    </span>
                    <span className="text-emerald-400">{item.avgTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold font-mono">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-purple-400" />
                      <span>{t('store.stock')}:</span>
                    </span>
                    <span className={stock > 0 ? 'text-amber-400' : 'text-rose-400'}>{stock} متوفر</span>
                  </div>

                  {stock > 0 ? (
                    <button
                      onClick={() => handleBuy(item)}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 text-sm"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>{t('store.buy')}</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-800 text-slate-500 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed text-sm border border-slate-700"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                      <span>نفدت الكمية المتاحة حالياً</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
