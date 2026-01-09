
export enum BotStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  ERROR = 'ERROR',
  BUILDING = 'BUILDING'
}

export interface Bot {
  id: string;
  name: string;
  status: BotStatus;
  createdAt: string;
  expiresAt: string; // الوقت الذي سيتوقف فيه البوت تلقائياً
  memoryUsage: string;
  cpuUsage: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  isPremium: boolean;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  level: 'INFO' | 'ERROR' | 'WARN';
}
