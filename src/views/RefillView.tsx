import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, Info, CheckCircle, Search, AlertTriangle } from 'lucide-react';

export const RefillView: React.FC = () => {
  const { orders, requestRefill } = useApp();
  const [orderIdInput, setOrderIdInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    const targetOrder = orders.find(o => o.id.toLowerCase() === orderIdInput.trim().toLowerCase());
    if (!targetOrder) {
      setStatusMsg({ text: `عذراً، الطلب برقم "${orderIdInput}" غير موجود في سجلاتنا.`, type: 'error' });
      return;
    }
    if (!targetOrder.refillAvailable) {
      setStatusMsg({ text: `الطلب "${targetOrder.id}" غير مشمول بخدمة التعويض التلقائي (لا يوجد ضمان).`, type: 'error' });
      return;
    }
    if (targetOrder.status === 'refilling') {
      setStatusMsg({ text: `الطلب "${targetOrder.id}" جاري تعويضه بالفعل من قبل السيرفر.`, type: 'error' });
      return;
    }
    if (targetOrder.status !== 'completed') {
      setStatusMsg({ text: `لا يمكن طلب التعويض إلا للطلبات المكتملة (Completed).`, type: 'error' });
      return;
    }

    requestRefill(targetOrder.id);
    setStatusMsg({ text: `تم إرسال أمر التعويض التلقائي للطلب "${targetOrder.id}" بنجاح!`, type: 'success' });
    setOrderIdInput('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
          <RotateCcw className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">نظام التعويض والضمان التلقائي (Refill)</h2>
          <p className="text-xs text-slate-400">إذا لاحظت أي نقص في أعداد المتابعين أو الإعجابات خلال فترة الضمان، يمكنك تفعيل التعويض التلقائي هنا</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
        <div className="bg-slate-800/80 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-white block">شروط وأحكام التعويض:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>يجب أن تكون حالة الطلب "مكتمل" (Completed).</li>
              <li>التعويض متاح فقط للخدمات التي تحتوي على ضمان في وصفها (مثال: ضمان 30 يوم).</li>
              <li>لا تقم بتغيير اسم المستخدم (Username) أو جعل الحساب خاص (Private) أثناء فترة التعويض.</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleRefillSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">رقم الطلب (Order ID)</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={orderIdInput}
                onChange={e => setOrderIdInput(e.target.value)}
                placeholder="مثال: ORD-9821"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-11 pl-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-sm"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all text-base"
          >
            <RotateCcw className="w-5 h-5" />
            <span>التحقق وإرسال أمر التعويض للسيرفر 🚀</span>
          </button>
        </form>

        {statusMsg && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
            statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Quick Recent Refillable Orders */}
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase">طلباتك الأخيرة القابلة للتعويض</h4>
          <div className="space-y-2">
            {orders.filter(o => o.refillAvailable && o.status === 'completed').slice(0, 3).map(o => (
              <div key={o.id} className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-amber-400 font-bold">{o.id}</span>
                  <span className="text-white font-bold truncate max-w-xs">{o.serviceName}</span>
                </div>
                <button
                  onClick={() => { setOrderIdInput(o.id); }}
                  className="bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  اختيار للتعويض
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
