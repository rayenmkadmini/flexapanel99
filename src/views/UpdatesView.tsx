import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Bell, Calendar } from 'lucide-react';

export const UpdatesView: React.FC = () => {
  const { announcements } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
          <Sparkles className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">سجل التحديثات والأخبار (Updates)</h2>
          <p className="text-xs text-slate-400">آخر التحسينات، الخدمات الجديدة، والإشعارات الدورية لمنصة فليكسا بانل (Flexapanel)</p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>{ann.date}</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                ann.type === 'gift' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                ann.type === 'update' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                <Bell className="w-3.5 h-3.5" />
                <span>{ann.type === 'gift' ? 'مكافأة' : ann.type === 'update' ? 'تحديث نظام' : 'إعلان هام'}</span>
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2">{ann.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
