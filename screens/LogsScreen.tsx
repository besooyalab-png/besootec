
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { api } from '../services/api';

interface LogsScreenProps {
  botId: string;
  onBack: () => void;
}

const LogsScreen: React.FC<LogsScreenProps> = ({ botId, onBack }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.getLogs(botId);
        setLogs(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to stream logs");
      }
    };

    fetchLogs();
    // نظام Real-time Polling لجلب السجلات كل 5 ثوانٍ
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, [botId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-[calc(100vh-120px)] md:h-full flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2.5 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors shrink-0"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-white truncate">Live Container Logs</h2>
            <p className="text-[10px] font-mono text-indigo-500 truncate">ATTACHED TO: {botId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE STREAMING
            </span>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono relative">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
            </div>
            <span className="text-[8px] text-slate-600 uppercase tracking-widest font-bold">Terminal output</span>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex-1 p-4 md:p-6 overflow-y-auto space-y-2 scrollbar-hide text-[11px] md:text-sm"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <i className="fa-solid fa-circle-notch animate-spin text-indigo-600 text-2xl"></i>
              <p className="text-slate-500 text-xs">Attaching to Docker container...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-700 italic">No output detected from bot. Check your code.</p>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:gap-4 group border-l border-slate-800 pl-3 sm:pl-0 sm:border-none">
                <span className="text-slate-600 text-[9px] shrink-0 select-none font-mono">
                  {log.timestamp}
                </span>
                <div className="flex gap-2 items-start">
                  <span className={`text-[9px] px-1 rounded uppercase font-bold shrink-0 mt-0.5 ${
                    log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' : 
                    log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 break-all leading-relaxed">{log.message}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsScreen;
