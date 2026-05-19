import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListFilter, Search, Clock, Zap } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, formatPrice, t, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const categories = Array.from(new Set(services.map(s => s.categoryName)));

  const filtered = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'all' || s.categoryName === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <ListFilter className="w-7 h-7" />
          </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('side.services')}</h2>
          <p className="text-xs text-slate-400">قائمة بجميع خدمات زيادة المتابعين والحسابات الرقمية المتوفرة في سيرفرات فليكسا بانل</p>
        </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث عن خدمة (مثال: انستغرام، يوتيوب، نتفليكس)..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedCat === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            الكل
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedCat === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 font-extrabold uppercase">
                <th className="p-4">رقم الخدمة</th>
                <th className="p-4">اسم الخدمة والتفاصيل</th>
                <th className="p-4 text-center">السعر لكل 1000</th>
                <th className="p-4 text-center">الحد الأدنى - الأقصى</th>
                <th className="p-4 text-center">متوسط الوقت</th>
                <th className="p-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 font-medium">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-400">{s.id}</td>
                  <td className="p-4 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold block">{s.categoryName}</span>
                    <strong className="text-white text-sm font-bold block">{s.name}</strong>
                    <p className="text-slate-400 text-xs max-w-md line-clamp-2">{s.description}</p>
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-400 text-base">{formatPrice(s.ratePer1000)}</td>
                  <td className="p-4 text-center font-mono text-slate-400">{s.minQty.toLocaleString()} - {s.maxQty.toLocaleString()}</td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{s.avgTime}</span>
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setCurrentView(s.isDigitalGood ? 'digitalStore' : 'newOrder')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition-all text-xs whitespace-nowrap flex items-center justify-center gap-1 mx-auto shadow-lg shadow-blue-500/20"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>طلب الخدمة</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
