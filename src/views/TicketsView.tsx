import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, PlusCircle, Send, Clock, CheckCircle, MessageSquare, Tag, ShieldCheck } from 'lucide-react';

export const TicketsView: React.FC = () => {
  const { tickets, createTicket, replyTicket, currentUser, t } = useApp();
  const [activeTkId, setActiveTkId] = useState<string>(tickets[0]?.id || '');
  const [showNewModal, setShowNewModal] = useState(false);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'deposit' | 'order' | 'refill' | 'other'>('deposit');
  const [message, setMessage] = useState('');

  // Reply state
  const [replyText, setReplyText] = useState('');

  const userTickets = tickets.filter(tk => currentUser?.role === 'superadmin' || currentUser?.role === 'admin' ? true : tk.userId === currentUser?.id);
  const activeTk = userTickets.find(t => t.id === activeTkId) || userTickets[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    createTicket(subject.trim(), category, message.trim());
    setShowNewModal(false);
    setSubject('');
    setMessage('');
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTk) return;
    replyTicket(activeTk.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t('side.supportTickets')}</h2>
            <p className="text-xs text-slate-400">تواصل مباشر مع الدعم الفني لحل المشكلات والاستفسار عن الطلبات</p>
          </div>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-2 text-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>فتح تذكرة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tickets List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 lg:col-span-1 max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase px-3 pt-2">التذاكر الخاصة بك</h3>
          {userTickets.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-12">لا توجد تذاكر دعم حالياً</p>
          ) : (
            userTickets.map(tk => (
              <div
                key={tk.id}
                onClick={() => setActiveTkId(tk.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-right ${activeTk?.id === tk.id ? 'bg-slate-800 border-blue-500 text-white shadow-lg' : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800 text-slate-300'}`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-blue-400 font-bold">{tk.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tk.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {tk.status === 'open' ? 'مفتوحة (تنتظر الرد)' : 'مُجاب عنها'}
                  </span>
                </div>
                <h4 className="font-bold text-sm truncate mb-1">{tk.subject}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Tag className="w-3 h-3 text-slate-500" />
                  <span>{tk.category === 'deposit' ? 'شحن رصيد' : tk.category === 'order' ? 'مشكلة بطلب' : tk.category === 'refill' ? 'طلب تعويض' : 'استفسار عام'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ticket Chat View */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl lg:col-span-2 flex flex-col h-[600px] overflow-hidden">
          {activeTk ? (
            <>
              {/* Chat Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">{activeTk.id}</span>
                    <h3 className="font-black text-white text-base">{activeTk.subject}</h3>
                  </div>
                  <span className="text-xs text-slate-400 block font-mono">بواسطة: {activeTk.username} | {activeTk.createdAt}</span>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${activeTk.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {activeTk.status === 'open' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  <span>{activeTk.status === 'open' ? 'تنتظر رد الإدارة' : 'تم الرد'}</span>
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {activeTk.messages.map((msg, i) => {
                  const isAdmin = msg.role === 'superadmin' || msg.role === 'admin';
                  return (
                    <div key={i} className={`flex flex-col max-w-lg ${isAdmin ? 'mr-auto items-start' : 'ml-auto items-end'}`}>
                      <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 font-bold px-1">
                        {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                        <span>{msg.sender}</span>
                        <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                      </div>
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                        isAdmin
                          ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input */}
              <form onSubmit={handleReplySubmit} className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="اكتب ردك هنا لخدمة العملاء..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span className="hidden sm:inline">إرسال الرد</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-12 text-center space-y-3">
              <MessageSquare className="w-16 h-16 text-slate-700" />
              <p className="font-bold">اختر تذكرة من القائمة الجانبية لعرض المحادثة أو قم بفتح تذكرة جديدة</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal New Ticket */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-xl font-black text-white mb-6">فتح تذكرة دعم فني جديدة</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">القسم</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-bold"
                >
                  <option value="deposit">شحن وإيداع الرصيد</option>
                  <option value="order">مشكلة في طلب SMM</option>
                  <option value="refill">طلب تعويض أو ضمان</option>
                  <option value="other">استفسار عام / اقتراحات</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">عنوان التذكرة / رقم الطلب</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="مثال: استفسار بخصوص الطلب ORD-9821"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">نص الرسالة والتفاصيل</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="يرجى كتابة تفاصيل المشكلة بكل وضوح لمساعدتك بشكل سريع..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 text-sm leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all"
                >
                  إرسال التذكرة
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
