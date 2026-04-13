export type ProcessStatus = 'idle' | 'running' | 'paused' | 'completed';
export type LogStatus = 'valid' | 'wrong_pass' | 'not_found' | 'info';

export interface LogEntry {
  id: string;
  timestamp: Date;
  data: string;
  status: LogStatus;
  message: string;
}

export interface ProcessStats {
  total: number;
  checked: number;
  valid: number;
  wrongPass: number;
  notFound: number;
  currentData: string;
  speed: number; // accounts per second
  history: { time: string; speed: number }[];
}

export interface ProcessConfig {
  format: string;
  sessionName: string;
  threads: number;
  stopCondition: 'infinite' | 'count';
  stopCount?: number;
  filePrefix: string;
  telegramLogs: boolean;
}

export interface SessionData {
  id: string;
  config: ProcessConfig;
  status: ProcessStatus;
  stats: ProcessStats;
  logs: LogEntry[];
  createdAt: Date;
}

export interface Proxy {
  ip: string;
  port: string;
  user?: string;
  pass?: string;
  raw: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  role: 'guest' | 'user' | 'admin';
  key: string | null;
}

export interface SecurityAlert {
  id: string;
  timestamp: Date;
  key: string;
  ip: string;
  device: string;
  message: string;
}
