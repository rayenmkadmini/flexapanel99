import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Copy, DollarSign, Users, Award, CheckCircle2, TrendingUp } from 'lucide-react';

export const AffiliateView: React.FC = () => {
  const { currentUser, formatPrice } = useApp();
  const [copied, setCopied] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);

  const referralLink = `https://flexapanel.net/ref/${currentUser ? currentUser.username : 'demo'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      alert('تم إرسال طلب سحب الأرباح إلى الإدارة وسيتم تحويله إلى رصيد حسابك قريباً!');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-emerald-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-black/20 rounded-2xl border border-white/20">
            <Share2 className="w-12 h-12 text-teal-300" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-1">نظام التسويق بالعمولة (Affiliate Program) 🤝</h2>
            <p className="text-white/80 text-sm">شارك رابط الإحالة الخاص بك واحصل على عمولة دائمة 5% على كل عملية شحن يقوم بها المسجلون عن طريقك!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Affiliate Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">إحصائيات الإحالة</h3>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mb-1">
                <Users className="w-4 h-4 text-blue-400" /> المسجلين عن طريقك
              </span>
              <strong className="text-3xl font-black text-white font-mono">14</strong>
              <span className="text-[11px] text-emerald-400 block mt-1">+3 هذا الأسبوع</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" /> الأرباح المتاحة للسحب
              </span>
              <strong className="text-3xl font-black text-emerald-400 font-mono">{formatPrice(12.50)}</strong>
              <span className="text-[11px] text-slate-400 block mt-1">الحد الأدنى للسحب: 10$</span>
            </div>
          </div>

          <div>
            {payoutRequested ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>طلب السحب قيد المراجعة والإضافة لمحفظتك</span>
              </div>
            ) : (
              <button
                onClick={handlePayout}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                <span>سحب الأرباح إلى رصيد الحساب</span>
              </button>
            )}
          </div>
        </div>

        {/* Link & Instructions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-lg">رابط الإحالة المخصص لك:</h4>
            <p className="text-xs text-slate-400">انسخ الرابط أدناه وشاركه في قروبات الواتساب، التليجرام، أو وسائل التواصل الاجتماعي.</p>

            <div className="flex items-center justify-between gap-4 bg-black/60 p-4 rounded-2xl border border-slate-700 mt-3">
              <span className="font-mono text-emerald-400 select-all text-sm truncate" dir="ltr">{referralLink}</span>
              <button
                onClick={handleCopy}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0 border border-slate-700"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-800 text-xs text-slate-300">
            <h4 className="font-bold text-white text-base flex items-center gap-2 text-amber-400">
              <Award className="w-5 h-5" />
              <span>كيف تعمل أرباح التسويق بالعمولة؟</span>
            </h4>

            <div className="space-y-3">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-white block mb-1">شارك الرابط مع أصدقائك</strong>
                  <p className="text-slate-400">كل شخص يسجل عبر رابطك يتم تسجيله في قاعدة البيانات كـ "مُحال من قبلك" مدى الحياة.</p>
                </div>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-white block mb-1">احصل على 5% من كل إيداع</strong>
                  <p className="text-slate-400">عندما يقوم الشخص بإيداع 100$ في حسابه، يضاف لرصيد أرباحك 5$ بشكل تلقائي وفوري.</p>
                </div>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-white block mb-1">سحب مرن وسريع</strong>
                  <p className="text-slate-400">يمكنك تحويل أرباحك إلى رصيد لطلب الخدمات أو طلب سحب مالي مباشر عند وصولك لـ 10$.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
