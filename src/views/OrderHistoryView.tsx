import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, Search, RefreshCw, CheckCircle, Clock, RotateCcw, AlertCircle } from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { orders, requestRefill, formatPrice, t, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter orders by active user
  const userOrders = orders.filter(o => currentUser?.role === 'superadmin' || currentUser?.role === 'admin' ? true : o.userId === currentUser?.id);

  const filtered = userOrders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) || o.linkOrTarget.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> مكتمل</span>;
      case 'processing':
        return <span className="flex items-center gap-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-bold"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> قيد التنفيذ</span>;
      case 'refilling':
        return <span className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold"><RotateCcw className="w-3.5 h-3.5 animate-spin" /> جاري التعويض</span>;
      default:
        return <span className="flex items-center gap-1 bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full text-xs font-bold"><Clock className="w-3.5 h-3.5" /> {status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t('side.orderHistory')}</h2>
            <p className="text-xs text-slate-400">سجل جميع طلباتك السابقة مع إمكانية تتبع الحالة وطلب التعويض التلقائي</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الطلب، اسم الخدمة، الرابط..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'completed', 'processing', 'refilling'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterStatus === st ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {st === 'all' ? 'الكل' : st === 'completed' ? 'مكتمل' : st === 'processing' ? 'قيد التنفيذ' : 'جاري التعويض'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold">لا توجد طلبات مطابقة للبحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 font-extrabold uppercase">
                  <th className="p-4">رقم الطلب</th>
                  <th className="p-4">الخدمة</th>
                  <th className="p-4">الرابط / الحساب</th>
                  <th className="p-4 text-center">الكمية</th>
                  <th className="p-4 text-center">السعر</th>
                  <th className="p-4 text-center">الحالة</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 font-medium">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">{o.id}</td>
                    <td className="p-4 font-bold text-white max-w-xs truncate">{o.serviceName}</td>
                    <td className="p-4 font-mono max-w-xs truncate" dir="ltr">{o.linkOrTarget}</td>
                    <td className="p-4 text-center font-bold text-slate-100">{o.quantity.toLocaleString()}</td>
                    <td className="p-4 text-center font-mono font-bold text-emerald-400">{formatPrice(o.pricePaid)}</td>
                    <td className="p-4 text-center">{getStatusBadge(o.status)}</td>
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">{o.createdAt}</td>
                    <td className="p-4 text-center">
                      {o.refillAvailable && o.status === 'completed' ? (
                        <button
                          onClick={() => requestRefill(o.id)}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-1 mx-auto"
                          title="طلب تعويض النقص تلقائياً"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>تعويض النقص</span>
                        </button>
                      ) : (
                        <span className="text-slate-600 font-mono text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
