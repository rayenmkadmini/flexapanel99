import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, Phone, Mail, CheckCircle2, KeyRound } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register, twoFactorStep, setTwoFactorStep, users, setCurrentUser, settings } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const logoUrl = settings.logoUrl || '/Flogo.svg';
  const wordmarkUrl = settings.wordmarkUrl || logoUrl;

  // Login form
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // 2FA state
  const [twoFaCode, setTwoFaCode] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser.trim() || !loginPass) return;
    const res = login(loginUser.trim(), loginPass);
    if (!res) {
      alert('بيانات الدخول غير صحيحة أو الحساب محظور.');
    }
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUser.trim() || !regEmail.trim() || !regPass || !regPhone.trim()) {
      alert('جميع الحقول مطلوبة، بما في ذلك رقم الواتساب!');
      return;
    }
    const res = register(regUser.trim(), regEmail.trim(), regPass, regPhone.trim());
    if (res) {
      alert('تم إنشاء الحساب بنجاح! تم منحك 100 نقطة هدية ترحيبية.');
    }
  };

  const handleTwoFaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFaCode.trim() === '123456') {
      const found = users.find(u => u.username.toLowerCase() === loginUser.toLowerCase());
      if (found) {
        setTwoFactorStep(false);
        setCurrentUser(found);
        window.location.reload();
      }
    } else {
      alert('رمز المصادقة الثنائية غير صحيح! (للتجربة أدخل: 123456)');
    }
  };

  if (twoFactorStep) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fadeIn">
        <div className="bg-slate-900 border border-blue-500/30 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-blue-500/10 border-2 border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 mx-auto">
            <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">المصادقة الثنائية (2FA)</h3>
            <p className="text-xs text-slate-400 mt-1">حسابك محمي بالمصادقة الثنائية. أدخل الرمز المؤقت للمتابعة.</p>
          </div>

          <form onSubmit={handleTwoFaSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={twoFaCode}
                onChange={e => setTwoFaCode(e.target.value)}
                placeholder="أدخل الرمز 123456"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-center text-white font-mono font-black text-2xl tracking-widest focus:outline-none focus:border-blue-500"
                dir="ltr"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/25 transition-all text-base"
            >
              التحقق وتسجيل الدخول
            </button>
          </form>

          <span className="text-[11px] text-amber-400 block font-mono">أدخل الرمز المرسل لتطبيق المصادقة الخاص بك</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand */}
        <div className="bg-slate-950/60 p-6 text-center border-b border-slate-800">
          <img src={logoUrl} onError={e => { e.currentTarget.src = '/flexa-mark.svg'; }} alt="FlexaPanel" className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-lg shadow-blue-500/30 object-contain" />
          <img src={wordmarkUrl} onError={e => { e.currentTarget.src = '/flexa-logo.svg'; }} alt="FlexaPanel" className="h-12 w-64 mx-auto object-contain invert brightness-0" />
          <p className="text-xs text-slate-400 mt-1">سجل الدخول للاستمتاع بأرقى خدمات المتابعين والحسابات الفورية</p>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 text-sm font-bold bg-slate-950/20">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-4 text-center border-b-2 transition-all ${tab === 'login' ? 'border-blue-500 text-blue-400 bg-blue-500/5 font-black' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-4 text-center border-b-2 transition-all ${tab === 'register' ? 'border-blue-500 text-blue-400 bg-blue-500/5 font-black' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المستخدم</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={loginUser}
                    onChange={e => setLoginUser(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-400 text-center font-mono">
                <span>أدخل بيانات حسابك المعتمدة للدخول</span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/25 transition-all text-base transform active:scale-98 mt-2"
              >
                الدخول للحساب 🚀
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegSubmit} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المستخدم</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={regUser}
                    onChange={e => setRegUser(e.target.value)}
                    placeholder="shield_user"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  رقم الواتساب (إجباري ومطلوب) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="+216 55 123 456"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm text-left font-mono"
                    dir="ltr"
                    required
                  />
                </div>
                <span className="text-[10px] text-amber-400 block mt-1">حسب الشروط، يُلزم كل شخص بوضع رقم الواتس للتسجيل.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تحصل على 100 نقطة هدية فور إكمال التسجيل بنجاح!</span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/25 transition-all text-base transform active:scale-98 mt-2"
              >
                إنشاء الحساب وبدء التصفح 🚀
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
