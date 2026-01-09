
import { Bot, BotStatus, LogEntry } from '../types';

// In a real app, these would call the FastAPI endpoints:
// POST /upload-bot, POST /deploy-bot, GET /bot-status, etc.

const STORAGE_KEY = 'botcloud_bots';

export const mockApi = {
  getBots: async (): Promise<Bot[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  uploadAndDeploy: async (name: string, botFile: File, reqFile: File): Promise<Bot> => {
    await new Promise(r => setTimeout(r, 2000)); // Simulate build time
    // Added missing 'expiresAt' property to satisfy the Bot interface
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); 
    
    const newBot: Bot = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      status: BotStatus.RUNNING,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      memoryUsage: '45MB',
      cpuUsage: '0.2%'
    };
    const current = await mockApi.getBots();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, newBot]));
    return newBot;
  },

  toggleBot: async (id: string, action: 'stop' | 'restart'): Promise<BotStatus> => {
    await new Promise(r => setTimeout(r, 800));
    const bots = await mockApi.getBots();
    const bot = bots.find(b => b.id === id);
    if (!bot) throw new Error("Bot not found");
    
    bot.status = action === 'stop' ? BotStatus.STOPPED : BotStatus.RUNNING;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bots));
    return bot.status;
  },

  getLogs: async (id: string): Promise<LogEntry[]> => {
    return [
      { timestamp: new Date().toISOString(), message: "Container started successfully", level: 'INFO' },
      { timestamp: new Date().toISOString(), message: "Installing dependencies...", level: 'INFO' },
      { timestamp: new Date().toISOString(), message: "Python bot.py is now running", level: 'INFO' },
      { timestamp: new Date().toISOString(), message: "Listening for events...", level: 'INFO' },
    ];
  }
};
