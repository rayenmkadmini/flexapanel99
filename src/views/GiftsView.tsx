import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Award, Zap, CheckCircle2 } from 'lucide-react';

export const GiftsView: React.FC = () => {
  const { currentUser, updateUserBalance, formatPrice } = useApp();
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    if (!currentUser) return;
    if (currentUser.points < 500) {
      alert('الحد الأدنى للتحويل هو 500 نقطة (تساوي 1$)');
      return;
    }
    const dollarsGained = Math.floor(currentUser.points / 500);
    updateUserBalance(currentUser.id, dollarsGained);
    setClaimed(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="bg-gradient-to-r from-amber-600 to-yellow-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-black/20 rounded-2xl border border-white/20">
            <Gift className="w-12 h-12 text-amber-300" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-1">الهدايا والمكافآت اليومية 🎁</h2>
            <p className="text-white/80 text-sm">برنامج الولاء الخاص بعملاء فليكسا بانل (Flexapanel): حوّل نقاطك المكتسبة إلى رصيد حقيقي في محفظتك!</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                <Award className="w-4 h-4" /> رصيد النقاط الحالي
              </span>
              <h3 className="text-4xl font-black font-mono text-white mb-1">
                {currentUser ? currentUser.points.toLocaleString() : 0}
              </h3>
              <p className="text-xs text-slate-400">تحصل على 5 نقاط على كل 1$ تنفقه في الموقع</p>
            </div>

            <div className="pt-6">
              {claimed ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تم تحويل النقاط إلى رصيد بنجاح!</span>
                </div>
              ) : (
                <button
                  onClick={handleClaim}
                  disabled={!currentUser || currentUser.points < 500}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                    currentUser && currentUser.points >= 500
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-102 active:scale-98'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  <span>تحويل النقاط لرصيد (كل 500 نقطة = {formatPrice(1)})</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h4 className="font-bold text-white text-base">مستويات النقاط والمكافآت</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span>500 نقطة</span> <strong className="text-emerald-400 font-mono">{formatPrice(1.00)}</strong>
              </li>
              <li className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span>2,500 نقطة</span> <strong className="text-emerald-400 font-mono">{formatPrice(5.00)}</strong>
              </li>
              <li className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span>5,000 نقطة</span> <strong className="text-emerald-400 font-mono">{formatPrice(10.00)}</strong>
              </li>
              <li className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span>25,000 نقطة</span> <strong className="text-amber-400 font-mono">{formatPrice(55.00)} (علاوة 10%)</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
