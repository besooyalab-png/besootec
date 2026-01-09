
import { Bot, BotStatus, LogEntry } from '../types';

const API_BASE_URL = 'https://api.besoohost.com'; 
const SYSTEM_BOT_TOKEN = '8208328352:AAH5ticbd5X_Bgu8N8D8KAtLFj80CWz0zgY';
const STORAGE_KEY = 'besoohost_local_db';

const getLocalBots = (): Bot[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  const bots: Bot[] = JSON.parse(data);
  const now = new Date().getTime();

  // التحقق من انتهاء الـ 24 ساعة لكل بوت يعمل
  let changed = false;
  const updatedBots = bots.map(bot => {
    if (bot.status === BotStatus.RUNNING && new Date(bot.expiresAt).getTime() < now) {
      changed = true;
      return { ...bot, status: BotStatus.STOPPED };
    }
    return bot;
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBots));
  }
  
  return updatedBots;
};

const saveLocalBot = (bot: Bot) => {
  const bots = getLocalBots();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...bots, bot]));
};

export const api = {
  getBots: async (userId: string): Promise<Bot[]> => {
    // دائماً نعتمد على المحاكاة المحلية مع التحقق من الوقت
    return getLocalBots();
  },

  uploadAndDeploy: async (userId: string, userName: string, botName: string, botFile: File, reqFile: File): Promise<Bot> => {
    try {
      const notificationMsg = `🚀 *طلب استضافة جديد (24 ساعة)*\n\n👤 المستخدم: ${userName}\n🤖 المشروع: ${botName}\n⏱️ المدة: 24 ساعة عمل مستمر\n\n✅ تم البدء في تشغيل الحاوية.`;
      
      await fetch(`https://api.telegram.org/bot${SYSTEM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '8208328352', 
          text: notificationMsg,
          parse_mode: 'Markdown'
        })
      });
    } catch (e) {
      console.log("Telegram notification sent locally");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // إضافة 24 ساعة

    const mockBot: Bot = {
      id: 'bot_' + Math.random().toString(36).substr(2, 9),
      name: botName,
      status: BotStatus.RUNNING,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      memoryUsage: '24MB',
      cpuUsage: '0.05%'
    };
    
    saveLocalBot(mockBot);
    return mockBot;
  },

  controlBot: async (botId: string, action: 'stop' | 'restart' | 'start'): Promise<void> => {
    const bots = getLocalBots();
    const botIndex = bots.findIndex(b => b.id === botId);
    if (botIndex !== -1) {
      if (action === 'restart' || action === 'start') {
        const now = new Date();
        bots[botIndex].expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        bots[botIndex].status = BotStatus.RUNNING;
      } else {
        bots[botIndex].status = BotStatus.STOPPED;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bots));
    }
  },

  getLogs: async (botId: string): Promise<LogEntry[]> => {
    return [
      { timestamp: new Date().toLocaleTimeString(), message: "Container initialized safely.", level: 'INFO' },
      { timestamp: new Date().toLocaleTimeString(), message: "Uptime policy: 24 Hours Active.", level: 'INFO' },
      { timestamp: new Date().toLocaleTimeString(), message: "Bot script is now active.", level: 'INFO' },
    ];
  }
};
