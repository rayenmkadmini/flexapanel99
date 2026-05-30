import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export const MassOrderView: React.FC = () => {
  const { services, placeOrder } = useApp();
  const [massText, setMassText] = useState('');
  const [log, setLog] = useState<{ text: string; type: 'success' | 'error' }[]>([]);

  const handleMassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!massText.trim()) return;

    const lines = massText.split('\n');
    const newLogs: { text: string; type: 'success' | 'error' }[] = [];

    for (const [idx, line] of lines.entries()) {
      if (!line.trim()) return;
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 3) {
        newLogs.push({ text: `السطر #${idx + 1}: صيغة غير صحيحة. مطلوب (service_id | link | qty)`, type: 'error' });
        return;
      }
      const [srvId, link, qtyStr] = parts;
      const srv = services.find(s => s.id === srvId);
      if (!srv) {
        newLogs.push({ text: `السطر #${idx + 1}: الخدمة "${srvId}" غير موجودة.`, type: 'error' });
        return;
      }
      const qty = parseInt(qtyStr, 10);
      if (isNaN(qty)) {
        newLogs.push({ text: `السطر #${idx + 1}: الكمية "${qtyStr}" غير صالحة.`, type: 'error' });
        return;
      }

      const res = await placeOrder(srv, link, qty);
      if (res.success) {
        newLogs.push({ text: `السطر #${idx + 1}: تم طلب ${srv.name} (${qty}) بنجاح!`, type: 'success' });
      } else {
        newLogs.push({ text: `السطر #${idx + 1}: فشل (${res.error})`, type: 'error' });
      }
    }

    setLog(newLogs);
    setMassText('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
          <Layers className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">الطلبات الجماعية (Mass Order)</h2>
          <p className="text-xs text-slate-400">إضافة أكثر من طلب في وقت واحد باستخدام الصيغة المخصصة</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
        <div className="bg-slate-800/80 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-white block">تعليمات إدخال الطلب الجماعي:</span>
            <p>أدخل كل طلب في سطر مستقل بالصيغة التالية بالضبط:</p>
            <code className="bg-black/50 px-2 py-1 rounded text-amber-400 block font-mono my-2 text-left" dir="ltr">
              service_id | link | quantity
            </code>
            <p className="text-slate-400">مثال: <code className="text-emerald-400 font-mono">s1 | https://instagram.com/user | 1000</code></p>
          </div>
        </div>

        <form onSubmit={handleMassSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">قائمة الطلبات</label>
            <textarea
              rows={8}
              value={massText}
              onChange={e => setMassText(e.target.value)}
              placeholder="s1 | https://instagram.com/user1 | 1000&#10;s2 | https://instagram.com/user2 | 500"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 text-left"
              dir="ltr"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all text-base"
          >
            <span>تنفيذ الطلبات الجماعية 🚀</span>
          </button>
        </form>

        {log.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase">سجل التنفيذ</h4>
            {log.map((l, i) => (
              <div key={i} className={`text-xs p-2.5 rounded-xl flex items-center gap-2 ${l.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {l.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span className="font-mono">{l.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
