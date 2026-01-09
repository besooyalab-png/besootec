
import React, { useState, useEffect } from 'react';
import { Bot, BotStatus, User } from '../types';
import { api } from '../services/api';

interface DashboardScreenProps {
  user: User;
  onAddBot: () => void;
  onShowLogs: (id: string) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onAddBot, onShowLogs }) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBots = async () => {
    try {
      const data = await api.getBots(user.id);
      setBots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBots();
    const interval = setInterval(loadBots, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, action: 'stop' | 'restart') => {
    try {
      await api.controlBot(id, action);
      loadBots();
    } catch (e) {
      alert("Error controlling bot");
    }
  };

  const getRemainingTime = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  const getStatusColor = (status: BotStatus) => {
    switch (status) {
      case BotStatus.RUNNING: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case BotStatus.STOPPED: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case BotStatus.ERROR: return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-slate-800 border border-slate-700 p-4 md:p-6 rounded-2xl">
          <p className="text-slate-400 text-xs md:text-sm font-medium">Active Bots</p>
          <p className="text-xl md:text-2xl font-bold text-white">{bots.filter(b => b.status === BotStatus.RUNNING).length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-4 md:p-6 rounded-2xl">
          <p className="text-slate-400 text-xs md:text-sm font-medium">Session Policy</p>
          <p className="text-xl md:text-2xl font-bold text-indigo-400">24h Cycle</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 md:p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-bold text-white">Instances</h3>
          <button onClick={onAddBot} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
            + New Bot
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center"><i className="fa-solid fa-spinner animate-spin"></i></div>
        ) : bots.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No bots deployed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Bot Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time Left</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {bots.map(bot => (
                  <tr key={bot.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{bot.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(bot.status)}`}>
                        {bot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      {bot.status === BotStatus.RUNNING ? getRemainingTime(bot.expiresAt) : '--'}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => onShowLogs(bot.id)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors" title="Logs">
                        <i className="fa-solid fa-terminal"></i>
                      </button>
                      {bot.status === BotStatus.RUNNING ? (
                        <button onClick={() => handleAction(bot.id, 'stop')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Stop">
                          <i className="fa-solid fa-stop"></i>
                        </button>
                      ) : (
                        <button onClick={() => handleAction(bot.id, 'restart')} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all" title="Restart 24h">
                          <i className="fa-solid fa-play"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
