import React, { useState } from 'react';
import { Code, Copy, Key, RefreshCw, Server, Check } from 'lucide-react';

export const ApiView: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    const saved = localStorage.getItem('shield_api_key');
    return saved || 'sh_live_8f9c2e4b1a0d3e6f9a2b5c8e7d4f1a3b';
  });
  const [copied, setCopied] = useState(false);

  const generateNewKey = () => {
    if (!confirm('توليد مفتاح جديد سيؤدي لإيقاف الربط الحالي بالمواقع الأخرى. هل ترغب بالمتابعة؟')) return;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = 'sh_live_';
    for (let i = 0; i < 32; i++) result += chars[Math.floor(Math.random() * chars.length)];
    setApiKey(result);
    localStorage.setItem('shield_api_key', result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
          <Code className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">ربط المنظومة عبر واجهة API</h2>
          <p className="text-xs text-slate-400">اربط موقعك أو البانل الخاص بك مباشرة مع سيرفرات فليكسا بانل للحصول على الطلبات التلقائية</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6 text-right">
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" /> مفتاح API الخاص بحسابك (API Key):
            </span>
            <button
              onClick={generateNewKey}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-xl transition-colors border border-blue-500/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة توليد المفتاح</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 bg-black/60 p-4 rounded-xl border border-slate-700">
            <span className="font-mono text-emerald-400 select-all text-sm font-bold tracking-wider" dir="ltr">{apiKey}</span>
            <button
              onClick={handleCopy}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ المفتاح'}</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-500 block">تنبيه: لا تقم بمشاركة هذا المفتاح مع أي شخص لمنع تنفيذ طلبات غير مصرحة من رصيدك.</span>
        </div>

        {/* Documentation Section */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-white font-extrabold text-base">
            <Server className="w-5 h-5 text-indigo-400" />
            <h3>دليل الاستخدام البرمجي (API Documentation)</h3>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-left" dir="ltr">
            <span className="text-amber-400 font-mono font-bold block">// 1. Endpoint URL</span>
            <code className="text-slate-200 block bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                POST https://panel.flexashop.shop/api/v2
            </code>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-left" dir="ltr">
              <span className="text-blue-400 font-mono font-bold block">// 2. Get Services List</span>
              <code className="text-slate-200 block bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono">
                {`{
  "key": "${apiKey.slice(0, 12)}...",
  "action": "services"
}`}
              </code>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-left" dir="ltr">
              <span className="text-emerald-400 font-mono font-bold block">// 3. Add New Order</span>
              <code className="text-slate-200 block bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono">
                {`{
  "key": "${apiKey.slice(0, 12)}...",
  "action": "add",
  "service": 101,
  "link": "https://instagram.com/user",
  "quantity": 1000
}`}
              </code>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-left" dir="ltr">
              <span className="text-purple-400 font-mono font-bold block">// 4. Response Success</span>
              <code className="text-emerald-300 block bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono">
                {`{
  "status": "success",
  "order": "ORD-9821",
  "balance": 145.50
}`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
