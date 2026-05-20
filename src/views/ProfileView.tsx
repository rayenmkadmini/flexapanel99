import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, Lock, Save, ShieldCheck, Award, Wallet, Activity } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, formatPrice } = useApp();

  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!currentUser) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        يجب تسجيل الدخول لتعديل البروفيل.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert('تأكيد كلمة المرور الجديدة غير مطابق.');
      return;
    }

    const result = updateProfile({
      username,
      email,
      whatsapp,
      currentPassword,
      newPassword
    });

    if (!result.success) {
      alert(result.error || 'تعذر تحديث البروفيل.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('تم تحديث البروفيل بنجاح.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 lg:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-white">تعديل البروفيل</h2>
            <p className="text-xs text-slate-400 mt-1">عدّل بيانات حسابك، رقم الواتساب، وكلمة المرور بأمان.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-xl">{currentUser.role}</span>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl">{currentUser.tier}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">اسم المستخدم</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-white focus:outline-none focus:border-blue-500 text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">رقم الواتساب</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="+21695989977"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-white focus:outline-none focus:border-blue-500 text-left font-mono"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>تغيير كلمة المرور اختياري</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="كلمة المرور الحالية"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="كلمة المرور الجديدة"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="تأكيد كلمة المرور"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-5 h-5" />
              <span>حفظ تعديلات البروفيل</span>
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>ملخص الحساب</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                <span className="text-slate-400 flex items-center gap-1"><Wallet className="w-4 h-4 text-emerald-400" /> الرصيد</span>
                <strong className="font-mono text-emerald-400">{formatPrice(currentUser.balance)}</strong>
              </div>
              <div className="flex justify-between bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                <span className="text-slate-400 flex items-center gap-1"><Activity className="w-4 h-4 text-blue-400" /> الرصيد المنفق</span>
                <strong className="font-mono text-blue-400">{formatPrice(currentUser.spent)}</strong>
              </div>
              <div className="flex justify-between bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                <span className="text-slate-400 flex items-center gap-1"><Award className="w-4 h-4 text-amber-400" /> النقاط</span>
                <strong className="font-mono text-amber-400">{currentUser.points.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};