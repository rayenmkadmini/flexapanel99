import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, AlertCircle, CheckCircle } from 'lucide-react';

export const MissingPhoneModal: React.FC = () => {
  const { showMissingPhoneModal, updateWhatsApp, currentUser } = useApp();
  const [phoneInput, setPhoneInput] = useState('');

  if (!showMissingPhoneModal || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.trim().length < 8) {
      alert('الرجاء إدخال رقم هاتف صحيح');
      return;
    }
    updateWhatsApp(phoneInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3 text-amber-400 mb-4">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">مطلوب خطوة إضافية للحساب القديم</h3>
            <p className="text-sm text-slate-400">تحديث بيانات الاتصال الإلزامية</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
          مرحباً <strong className="text-blue-400">{currentUser.username}</strong>، لضمان استلام إشعارات الطلبات وتأكيدات الشحن الفورية، يُرجى إدخال رقم الواتساب الخاص بك لمرة واحدة فقط.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              رقم الواتساب (مع الرمز الدولي، مثال: +21655123456)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Phone className="w-5 h-5" />
              </span>
              <input
                type="tel"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                placeholder="+216 55 123 456"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <CheckCircle className="w-5 h-5" />
            <span>حفظ الرقم ومتابعة التصفح</span>
          </button>
        </form>
      </div>
    </div>
  );
};
