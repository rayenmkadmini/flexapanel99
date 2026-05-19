import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Star, UserCheck, CheckCircle2, Zap } from 'lucide-react';

export const MembershipsView: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 lg:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-white">نظام العضوية والاشتراكات (VIP Tiers)</h2>
            <p className="text-xs text-slate-400 mt-1">ترقى في مستويات العضوية التلقائية واحصل على أسعار مخفضة وخدمة عملاء ذات أولوية قصوى</p>
          </div>
        </div>

        {currentUser && (
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center min-w-[200px]">
            <span className="text-xs text-slate-400 font-bold block mb-1">عضويتك الحالية:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black inline-block uppercase ${
              currentUser.tier === 'vip' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' :
              currentUser.tier === 'plus' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-slate-700 text-slate-200'
            }`}>
              {currentUser.tier === 'vip' ? 'VIP Gold 👑' : currentUser.tier === 'plus' ? 'Plus Member 🚀' : 'عضوية عادية 🛡️'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier Normal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">المستوى الأساسي</span>
            <h3 className="text-2xl font-black text-white">عضوية قياسية (Normal)</h3>
            <div className="text-xs text-slate-400">
              يحصل عليها كل مستخدم جديد فور التسجيل بالموقع.
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl font-mono text-center text-slate-300 font-bold">
              الإنفاق المطلوب: 0$ - 300$
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>الوصول لجميع خدمات السوشيال ميديا</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>5 نقاط مكتسبة لكل 1$ إنفاق</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500 line-through">
                <span>أولوية قصوى في الرد على التذاكر</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500 line-through">
                <span>خصومات إضافية 10% على الخدمات</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tier Plus */}
        <div className="bg-gradient-to-b from-blue-900/40 via-slate-900 to-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">
            شائع 🚀
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">المستوى المتوسط</span>
            <h3 className="text-2xl font-black text-white">عضوية بلاس (Plus)</h3>
            <div className="text-xs text-slate-300 leading-relaxed">
              تمنح للأعضاء النشطين الذين يتجاوزون الحد المطلوب من الشراء.
            </div>

            <div className="bg-blue-950/60 p-4 rounded-2xl font-mono text-center text-blue-300 font-bold border border-blue-500/30">
              الإنفاق المطلوب: 300$ - 1,000$
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>الوصول لجميع خدمات السوشيال ميديا</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7 نقاط مكتسبة لكل 1$ إنفاق (علاوة 40%)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>أولوية في سرعة تنفيذ الطلبات</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500 line-through">
                <span>مدير حساب شخصي على الواتساب</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tier VIP */}
        <div className="bg-gradient-to-b from-amber-900/40 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">
            الملكي 👑
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">المستوى الأعلى والأرقى</span>
            <h3 className="text-2xl font-black text-white">العضوية الذهبية VIP</h3>
            <div className="text-xs text-slate-300 leading-relaxed">
              المستوى المخصص لكبار الموزعين والتجار للاستمتاع بأرقى المزايا والأسعار.
            </div>

            <div className="bg-amber-950/60 p-4 rounded-2xl font-mono text-center text-amber-300 font-bold border border-amber-500/30">
              الإنفاق المطلوب: أكثر من 1,000$
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>خصم تلقائي 15% على كافة الخدمات</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>10 نقاط مكتسبة لكل 1$ إنفاق (علاوة 100%)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مدير حساب شخصي مخصص 24/7</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>سيرفرات خاصة فائقة السرعة</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
