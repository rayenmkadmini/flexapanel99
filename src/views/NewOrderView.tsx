import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, Clock, Info, ShieldCheck, Zap, DollarSign, Layers, Search } from 'lucide-react';

export const NewOrderView: React.FC = () => {
  const { services, placeOrder, formatPrice, t, setCurrentView } = useApp();

  const smmServices = services.filter(s => !s.isDigitalGood);
  const categories = Array.from(new Set(smmServices.map(s => s.categoryName)));

  const [selectedCat, setSelectedCat] = useState<string>(categories[0] || '');
  const filteredServices = smmServices.filter(s => s.categoryName === selectedCat);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(filteredServices[0]?.id || '');
  const [serviceSearch, setServiceSearch] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);

  const getServicePublicId = (service: typeof smmServices[number]) => String(service.externalServiceId || service.id);
  const serviceQuery = serviceSearch.trim().toLowerCase();
  const searchableServices = serviceQuery
    ? smmServices.filter(service => {
        const publicId = getServicePublicId(service).toLowerCase();
        return (
          service.id.toLowerCase().includes(serviceQuery) ||
          publicId.includes(serviceQuery) ||
          service.name.toLowerCase().includes(serviceQuery) ||
          service.categoryName.toLowerCase().includes(serviceQuery)
        );
      })
    : filteredServices;

  const activeService = smmServices.find(s => s.id === selectedServiceId) || searchableServices[0] || filteredServices[0];
  const calculatedPrice = activeService ? (quantity / 1000) * activeService.ratePer1000 : 0;

  const handleCategoryChange = (catName: string) => {
    setSelectedCat(catName);
    setServiceSearch('');
    const srvs = smmServices.filter(s => s.categoryName === catName);
    if (srvs.length > 0) {
      setSelectedServiceId(srvs[0].id);
      setQuantity(srvs[0].minQty);
    }
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const s = smmServices.find(srv => srv.id === serviceId);
    if (s) setQuantity(s.minQty);
  };

  const handleServiceSearch = (value: string) => {
    setServiceSearch(value);
    const query = value.trim().toLowerCase();
    if (!query) return;
    const exactService = smmServices.find(service =>
      service.id.toLowerCase() === query ||
      getServicePublicId(service).toLowerCase() === query
    );
    if (exactService) {
      setSelectedCat(exactService.categoryName);
      setSelectedServiceId(exactService.id);
      setQuantity(exactService.minQty);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;
    if (!link.trim()) {
      alert('الرجاء إدخال الرابط / الحساب المستهدف');
      return;
    }
    const res = await placeOrder(activeService, link.trim(), Number(quantity));
    if (!res.success) {
      alert(res.error);
    } else {
      setLink('');
      setQuantity(activeService.minQty);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-5xl mx-auto">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <PlusCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t('side.newOrder')}</h2>
            <p className="text-xs text-slate-400">اختر الخدمة، حدد الكمية وسيقوم النظام بتطبيق السعر تلقائياً</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('massOrder')}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-700"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>الانتقال للطلبات الجماعية</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Select */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">{t('order.category')}</label>
              <select
                value={selectedCat}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-blue-500 text-sm shadow-inner"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Service Select */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">{t('order.service')}</label>
              <div className="relative mb-3">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={e => handleServiceSearch(e.target.value)}
                  placeholder="ابحث برقم الخدمة ID أو اسم الخدمة..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono text-left"
                  dir="ltr"
                />
              </div>
              <select
                value={activeService?.id || selectedServiceId}
                onChange={e => handleServiceChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-blue-500 text-sm shadow-inner"
              >
                {searchableServices.map(s => (
                  <option key={s.id} value={s.id}>
                    #{getServicePublicId(s)} | {s.name} - ({s.ratePer1000}$ / 1000)
                  </option>
                ))}
              </select>
              {searchableServices.length === 0 && (
                <p className="text-xs text-rose-400 mt-2">لا توجد خدمة بهذا ID أو الاسم.</p>
              )}
            </div>

            {/* Target Link */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">{t('order.link')}</label>
              <input
                type="text"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left font-mono text-sm"
                dir="ltr"
                required
              />
            </div>

            {/* Quantity Input */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-200">{t('order.quantity')}</label>
                <span className="text-xs text-blue-400 font-mono">1000 = {activeService ? formatPrice(activeService.ratePer1000) : ''}</span>
              </div>

              <input
                type="number"
                min={activeService?.minQty || 10}
                max={activeService?.maxQty || 100000}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono font-black text-lg focus:outline-none focus:border-blue-500 text-center"
              />

              <div className="flex justify-between text-xs text-slate-400 font-mono pt-1">
                <span>الحد الأدنى: {activeService?.minQty.toLocaleString()}</span>
                <span>الحد الأقصى: {activeService?.maxQty.toLocaleString()}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700/60">
                {[100, 500, 1000, 2000, 5000, 10000].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors border border-slate-700"
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Submit */}
            <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">{t('order.price')}:</span>
                <span className="text-3xl font-black font-mono text-emerald-400">{formatPrice(calculatedPrice)}</span>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-all text-base transform active:scale-95"
              >
                <span>{t('order.submit')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Service Details & Preview Card */}
        <div className="space-y-6">
          {activeService && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              {activeService.image && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={activeService.image}
                    alt={activeService.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <span className="absolute bottom-4 right-4 bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                    جودة ممتازة 🚀
                  </span>
                </div>
              )}

              <div className="p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-white leading-snug">{activeService.name}</h3>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('order.avgTime')}: <strong className="text-white font-mono">{activeService.avgTime}</strong></span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>وصف الخدمة وشروط التنفيذ:</span>
                  </span>
                <div className="inline-flex items-center gap-2 text-[11px] text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl font-mono">
                  Service ID: #{getServicePublicId(activeService)}
                </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                    {activeService.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>ضمان التعويض التلقائي متاح 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>بدء فوري بعد تأكيد الطلب</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    <span>السعر يقل نسبياً مع الكميات الأكبر</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
