import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Sparkles, ArrowLeft, TrendingUp } from 'lucide-react';

export const AiAutomationView: React.FC = () => {
  const { services, placeOrder, setCurrentView } = useApp();
  const [goal, setGoal] = useState<string>('growth');
  const [platform, setPlatform] = useState<string>('instagram');
  const [budget, setBudget] = useState<number>(20);

  const smmServices = services.filter(s => !s.isDigitalGood);
  const [recommendations, setRecommendations] = useState<{ srv: any; qty: number; rationale: string }[]>([]);

  const handleAiSuggest = (e: React.FormEvent) => {
    e.preventDefault();
    const results = [];

    if (platform === 'instagram') {
      const s1 = smmServices.find(s => s.name.includes('حقيقيين') || s.name.includes('انستغرام'));
      const s2 = smmServices.find(s => s.name.includes('إعجابات'));
      if (s1 && budget >= 5) results.push({ srv: s1, qty: Math.floor((budget * 0.7) / s1.ratePer1000) * 1000, rationale: 'زيادة القاعدة الجماهيرية والمصداقية بحسابات حقيقية وتفاعلية.' });
      if (s2 && budget >= 2) results.push({ srv: s2, qty: Math.floor((budget * 0.3) / s2.ratePer1000) * 1000, rationale: 'توزيع الإعجابات على آخر 5 منشورات لرفع معدل التفاعل (Engagement Rate).' });
    } else if (platform === 'tiktok') {
      const s = smmServices.find(srv => srv.name.includes('تيك توك')) || smmServices[0];
      if (s) results.push({ srv: s, qty: Math.floor(budget / s.ratePer1000) * 1000, rationale: 'تخطي حاجز 1000 متابع لفتح خاصية البث المباشر وبدء تحقيق الأرباح.' });
    } else {
      const s = smmServices.find(srv => srv.name.includes('يوتيوب')) || smmServices[0];
      if (s) results.push({ srv: s, qty: Math.floor(budget / s.ratePer1000) * 1000, rationale: 'زيادة ساعات المشاهدة العالية الاحتفاظ للمساعدة في ترشيح الفيديو في الخوارزميات.' });
    }

    setRecommendations(results.filter(r => r.qty >= r.srv.minQty));
  };

  const handleApplyOrder = async (srv: any, qty: number) => {
    const link = prompt(`الرجاء إدخال رابط حساب ${platform}:`, 'https://');
    if (!link) return;
    const res = await placeOrder(srv, link, qty);
    if (!res.success) {
      alert(res.error);
    } else {
      setCurrentView('orderHistory');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/30 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30 text-purple-300">
            <Bot className="w-12 h-12" />
          </div>
          <div>
            <span className="bg-purple-500/30 border border-purple-500/40 text-purple-300 font-mono text-xs px-3 py-1 rounded-full uppercase inline-block mb-2">AI SMM Expert</span>
            <h2 className="text-3xl font-black mb-1">المساعد الذكي للأتمتة (AI Automation)</h2>
            <p className="text-purple-200 text-sm max-w-xl">
              أدخل ميزانيتك وهدفك التسويقي وسيقوم خوارزميات الذكاء الاصطناعي بتوليد أفضل باقة متكاملة لنمو حسابك بأسرع وقت.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
        <form onSubmit={handleAiSuggest} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">المنصة المستهدفة</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="instagram">انستغرام (Instagram)</option>
              <option value="tiktok">تيك توك (TikTok)</option>
              <option value="youtube">يوتيوب (YouTube)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">الهدف الأساسي</label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="growth">نمو سريع وزيادة المتابعين</option>
              <option value="engagement">رفع التفاعل والمصداقية</option>
              <option value="monetization">تحقيق شروط الربح والبث</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">الميزانية المخصصة ($ USD)</label>
            <input
              type="number"
              min={5}
              max={1000}
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-bold text-center font-mono focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 transition-all text-base transform active:scale-98"
            >
              <Sparkles className="w-5 h-5" />
              <span>تحليل وتوليد الخطة الذكية 🚀</span>
            </button>
          </div>
        </form>

        {recommendations.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>الباقة المقترحة من الذكاء الاصطناعي:</span>
            </h3>

            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-slate-800/80 border border-purple-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-right w-full sm:w-auto">
                    <span className="text-xs text-purple-400 font-bold block">توصية الخدمة #{i + 1}</span>
                    <h4 className="text-white font-extrabold text-base">{rec.srv.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-md">{rec.rationale}</p>
                    <span className="text-xs text-emerald-400 font-mono font-bold block mt-1">
                      الكمية المقترحة: {rec.qty.toLocaleString()} | التكلفة: {((rec.qty / 1000) * rec.srv.ratePer1000).toFixed(2)}$
                    </span>
                  </div>

                  <button
                    onClick={() => handleApplyOrder(rec.srv, rec.qty)}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-3 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>طلب فوري</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
