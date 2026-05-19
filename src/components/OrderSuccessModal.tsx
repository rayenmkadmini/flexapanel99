import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Wallet, ArrowRight, Clock, FileText, Gift, Key } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { lastOrderSuccess, setLastOrderSuccess, formatPrice } = useApp();

  if (!lastOrderSuccess) return null;

  const { oldBal, newBal, spent, order } = lastOrderSuccess;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-white">تم إرسال طلبك بنجاح!</h3>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-3 py-1 rounded-full mt-2 border border-emerald-500/30">
            {order.id}
          </span>
        </div>

        {/* Financial Overview Card */}
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700 mb-6 space-y-3">
          <div className="flex justify-between items-center text-sm border-b border-slate-700/60 pb-3">
            <span className="text-slate-400 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-indigo-400" /> الرصيد السابق:
            </span>
            <span className="font-bold font-mono text-slate-200">{formatPrice(oldBal)}</span>
          </div>

          <div className="flex justify-between items-center text-sm border-b border-slate-700/60 pb-3">
            <span className="text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" /> المبلغ المنفق للطلب:
            </span>
            <span className="font-bold font-mono text-rose-400">-{formatPrice(spent)}</span>
          </div>

          <div className="flex justify-between items-center text-base pt-1">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" /> الرصيد الحالي المتبقي:
            </span>
            <span className="text-xl font-extrabold font-mono text-emerald-400">{formatPrice(newBal)}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 mb-6 space-y-3 text-right">
          <div>
            <span className="text-xs text-slate-500 block">الخدمة المطلوبة:</span>
            <span className="text-sm font-semibold text-white block">{order.serviceName}</span>
          </div>

          {order.deliveredAccount ? (
            <div className="bg-indigo-950/50 border border-indigo-500/30 p-4 rounded-xl">
              <span className="text-xs text-indigo-300 block mb-1 flex items-center gap-1 font-bold">
                <Key className="w-4 h-4 text-amber-400" /> بيانات الحساب المسلّم فورا:
              </span>
              <div className="bg-black/60 font-mono text-sm p-3 rounded-lg text-emerald-300 select-all border border-indigo-500/20 text-left" dir="ltr">
                {order.deliveredAccount}
              </div>
              <span className="text-xs text-slate-400 block mt-2 text-center">قم بنسخ الإيميل وكلمة المرور لتسجيل الدخول الفوري</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-slate-500 block">الرابط / الحساب:</span>
                <span className="font-mono text-slate-300 truncate block">{order.linkOrTarget}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">الكمية:</span>
                <span className="font-bold text-blue-400">{order.quantity.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>متوسط وقت التنفيذ التقريبي: <strong className="text-white">{order.avgTime}</strong></span>
          </div>
        </div>

        {/* Points Notification */}
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-3 mb-6">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <Gift className="w-5 h-5 text-amber-400" />
            <span>مكافأة الشراء: حصلت على {Math.floor(spent * 5)} نقطة جديدة!</span>
          </div>
        </div>

        <button
          onClick={() => setLastOrderSuccess(null)}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>متابعة التصفح</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
