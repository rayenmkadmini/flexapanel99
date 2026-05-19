import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, ShieldAlert, CheckCircle, Info, Copy, MessageSquare, Ticket as TicketIcon } from 'lucide-react';

export const AddBalanceView: React.FC = () => {
  const { settings, requestDeposit, formatPrice, currency, users, setCurrentView } = useApp();

  const gateways = [
    { id: 'D17 Post', name: 'تطبيق D17 (البريد التونسي)', icon: '🇹🇳', desc: `التحويل المباشر عبر تطبيق D17 إلى رقم الهاتف المعمتد. سعر الصرف: 1 دولار = 3.1 دينار تونسي.`, account: settings.d17Phone, label: 'رقم هاتف D17 للإرسال' },
    { id: 'Poste Compte', name: 'تحويل بنكي / بريدي (Poste)', icon: '🏛️', desc: 'التحويل المالي إلى الحساب الجاري البريدي. يرجى إرفاق وصل التحويل.', account: settings.posteAccount, label: 'رقم الحساب البريدي (RIB)' },
    { id: 'Crypto USDT', name: 'العملات الرقمية (USDT TRC20)', icon: '🪙', desc: 'الإيداع الآلي عبر شبكة TRON TRC20 بدون أي عمولات إضافية.', account: settings.cryptoWallet, label: 'عنوان محفظة USDT (TRC20)' },
    { id: 'PayPal', name: 'باي بال (PayPal)', icon: '💳', desc: 'الدفع الآمن والموثوق عبر باي بال للأصدقاء والعائلة.', account: settings.paypalEmail, label: 'حساب PayPal' },
    ...((settings.customGateways || []).filter(g => g.isActive).map(g => ({
      id: g.name,
      name: g.name,
      icon: g.icon || '💳',
      desc: g.description,
      account: g.accountValue,
      label: g.accountLabel
    })))
  ];

  const [selectedGwId, setSelectedGwId] = useState(gateways[0].id);
  const [usdAmount, setUsdAmount] = useState<number>(10);
  const [senderRef, setSenderRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const activeGw = gateways.find(g => g.id === selectedGwId) || gateways[0];
  const localVal = currency === 'TND' ? usdAmount * 3.1 : currency === 'EUR' ? usdAmount * 0.92 : usdAmount;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderRef.trim()) {
      alert('الرجاء إدخال رقم هاتفك أو معرف العملية (Ref)');
      return;
    }
    requestDeposit(activeGw.id, Number(usdAmount), senderRef.trim());
    setSuccessMsg(true);
    setSenderRef('');
  };

  const superAdmin = users.find(u => u.role === 'superadmin');
  const whatsappNumber = superAdmin?.whatsapp?.replace(/[^0-9]/g, '') || '21655123456';
  const waMsg = encodeURIComponent(`مرحباً، قمت بطلب شحن رصيد بقيمة ${usdAmount}$ عبر ${activeGw.name}. المرجع/الرقم: ${senderRef}`);
  const whatsappConfirmUrl = `https://wa.me/${whatsappNumber}?text=${waMsg}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
          <CreditCard className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">شحن الرصيد (Deposit)</h2>
          <p className="text-xs text-slate-400">نظام الدفع الفوري والشحن التلقائي لحسابك عبر وسائل الدفع المعتمدة</p>
        </div>
      </div>

      {successMsg ? (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 p-8 rounded-3xl text-center shadow-2xl space-y-6 animate-scaleUp">
          <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-white">تم استلام إشعار الإيداع بنجاح!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            تم تسجيل طلب الشحن في النظام وسيتم مراجعته من قبل الإدارة وإضافة الرصيد لحسابك فور التحقق.
          </p>

          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 max-w-md mx-auto text-right space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>طريقة التحويل:</span> <strong className="text-white">{activeGw.name}</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>المبلغ المطلوب:</span> <strong className="text-emerald-400 font-mono font-bold">{usdAmount}$ ({localVal.toFixed(2)} {currency})</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href={whatsappConfirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>تأكيد الإيداع عبر واتساب المباشر</span>
            </a>
            <button
              onClick={() => setCurrentView('tickets')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-3.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <TicketIcon className="w-5 h-5 text-indigo-400" />
              <span>متابعة التذكرة في الدعم الفني</span>
            </button>
          </div>

          <button
            onClick={() => setSuccessMsg(false)}
            className="text-xs text-slate-500 hover:text-slate-300 underline block mx-auto pt-2"
          >
            إرسال إشعار شحن آخر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Payment Gateways Selection */}
          <div className="space-y-3 md:col-span-1">
            <label className="block text-xs font-extrabold text-slate-400 uppercase">اختر طريقة الدفع</label>
            {gateways.map(gw => (
              <button
                key={gw.id}
                type="button"
                onClick={() => setSelectedGwId(gw.id)}
                className={`w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between ${selectedGwId === gw.id ? 'bg-blue-600/20 border-blue-500 text-white shadow-xl shadow-blue-500/10' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{gw.icon}</span>
                  <span className="font-bold text-sm">{gw.name}</span>
                </div>
                {selectedGwId === gw.id && <CheckCircle className="w-5 h-5 text-blue-400" />}
              </button>
            ))}
          </div>

          {/* Form & Instructions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl md:col-span-2 space-y-6">
            <div className="bg-slate-800/80 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm mb-1">{activeGw.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{activeGw.desc}</p>
              </div>
            </div>

            <div className="p-5 bg-black/40 border border-slate-700/80 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-bold block">{activeGw.label}:</span>
              <div className="flex items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="font-mono font-black text-amber-400 text-base select-all tracking-wider" dir="ltr">{activeGw.account}</span>
                <button
                  onClick={() => handleCopy(activeGw.account)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-500 block">يرجى نسخ الرقم/الحساب وإجراء التحويل قبل ملء النموذج أدناه.</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">المبلغ المراد شحنه ($ USD)</label>
                  <input
                    type="number"
                    min={5}
                    max={5000}
                    value={usdAmount}
                    onChange={e => setUsdAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-white font-mono font-black text-lg focus:outline-none focus:border-blue-500 text-center"
                    required
                  />
                  <span className="text-xs text-slate-500 block mt-1">الحد الأدنى: 5$</span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">المبلغ المعادل بالعملة المحددة</label>
                  <div className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 font-mono font-black text-xl text-emerald-400 flex items-center justify-center">
                    <span>{formatPrice(usdAmount)}</span>
                  </div>
                  <span className="text-xs text-slate-500 block mt-1 text-center">سعر الصرف المعتمد والمحدث</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  رقم هاتفك (المرسل) أو معرف العملية (Transaction Ref)
                </label>
                <input
                  type="text"
                  value={senderRef}
                  onChange={e => setSenderRef(e.target.value)}
                  placeholder="مثال: +216 55 000 111 أو TX_9821"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500 text-left font-mono text-sm"
                  dir="ltr"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>بعد الضغط على الزر، سيتم إنشاء تذكرة شحن فورية للإدارة لتسريع المراجعة.</span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all text-base transform active:scale-98"
              >
                <span>تأكيد وإرسال إشعار الدفع 📤</span>
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};
