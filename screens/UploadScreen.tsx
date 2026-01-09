
import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface UploadScreenProps {
  user: User;
  onSuccess: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ user, onSuccess }) => {
  const [name, setName] = useState('');
  const [botFile, setBotFile] = useState<File | null>(null);
  const [reqFile, setReqFile] = useState<File | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const botInputRef = useRef<HTMLInputElement>(null);
  const reqInputRef = useRef<HTMLInputElement>(null);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !botFile || !reqFile) {
      setError("يرجى تسمية المشروع ورفع ملف الكود وملف المكتبات.");
      return;
    }

    setIsDeploying(true);
    setError(null);
    setStatusMsg('جارٍ رفع الملفات وتفعيل الاستضافة...');

    try {
      // نرسل فقط اسم البوت والملفات، والتوكن يتم التعامل معه داخلياً
      await api.uploadAndDeploy(user.id, user.displayName, name, botFile, reqFile); 
      
      setStatusMsg('🚀 تم التشغيل بنجاح! البوت يعمل الآن.');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تشغيل الحاوية.");
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <div className="bg-slate-800 p-6 md:p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/10 blur-3xl -mr-20 -mt-20 rounded-full"></div>
        
        <div className="mb-8 text-right relative z-10" dir="rtl">
          <h2 className="text-3xl font-black text-white mb-2">استضافة سريعة</h2>
          <p className="text-slate-400 text-sm">ارفع ملفاتك وسنقوم بتشغيلها لك خلال ثوانٍ معدودة.</p>
        </div>

        <form onSubmit={handleDeploy} className="space-y-6 text-right relative z-10" dir="rtl">
          <div>
            <label className="block text-xs font-bold text-indigo-400 mb-2 mr-1 uppercase tracking-wider">اسم المشروع</label>
            <input 
              type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 p-4 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="مثال: بوت ردود تلقائية"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => botInputRef.current?.click()} 
              className={`group border-2 border-dashed p-6 text-center rounded-3xl cursor-pointer transition-all duration-300 ${botFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 hover:border-indigo-500 bg-slate-900/30'}`}
            >
              <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-colors ${botFile ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                <i className={`fa-solid ${botFile ? 'fa-file-check' : 'fa-file-code'} text-xl`}></i>
              </div>
              <p className="text-xs font-bold text-white mb-1 truncate px-2">{botFile ? botFile.name : 'اختر bot.py'}</p>
              <input type="file" ref={botInputRef} hidden accept=".py" onChange={e => setBotFile(e.target.files?.[0] || null)} />
            </div>

            <div 
              onClick={() => reqInputRef.current?.click()} 
              className={`group border-2 border-dashed p-6 text-center rounded-3xl cursor-pointer transition-all duration-300 ${reqFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 hover:border-indigo-500 bg-slate-900/30'}`}
            >
              <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-colors ${reqFile ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                <i className={`fa-solid ${reqFile ? 'fa-file-check' : 'fa-file-lines'} text-xl`}></i>
              </div>
              <p className="text-xs font-bold text-white mb-1 truncate px-2">{reqFile ? reqFile.name : 'اختر requirements.txt'}</p>
              <input type="file" ref={reqInputRef} hidden accept=".txt" onChange={e => setReqFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[11px] flex items-center gap-3">
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              <span className="font-bold">{error}</span>
            </div>
          )}

          <button 
            disabled={isDeploying}
            className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-700 py-5 rounded-2xl font-black text-white shadow-2xl shadow-indigo-600/40 disabled:opacity-50 transition-all transform active:scale-[0.97]"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {isDeploying ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin text-xl"></i>
                  <span>{statusMsg}</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-rocket text-xl group-hover:translate-y-[-2px] transition-transform"></i>
                  <span className="text-lg uppercase">بدء الاستضافة الآن</span>
                </>
              )}
            </div>
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
           <span>⚡ معالج فائق السرعة</span>
           <span className="text-slate-700">•</span>
           <span>🔒 حماية Docker كاملة</span>
           <span className="text-slate-700">•</span>
           <span>🌍 وصول عالمي</span>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
