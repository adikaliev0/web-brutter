import { useState, useEffect, useCallback, useRef } from 'react';
import { ProcessStatus, LogEntry, ProcessStats, ProcessConfig, Proxy, SessionData } from '../types';

const MOCK_DATA = [
  'alex@gmail.com:qwerty1234', 'john.doe@yahoo.com:password123', 'sarah_99@hotmail.com:sarah1999',
  'gamer_x@yandex.ru:123456789', 'pro_player@mail.ru:qweasdzxc', 'admin@game.com:admin123',
  'test1234@gmail.com:testtest', 'user_007@outlook.com:jamesbond', 'shadow_hunter@gmail.com:hunter2',
  'lucky_strike@yahoo.com:lucky777'
];

export function useProcessSimulation(proxies: Proxy[]) {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const checksSinceLastTick = useRef(0);

  const startProcess = useCallback((config: ProcessConfig) => {
    const id = Date.now().toString();
    const newSession: SessionData = {
      id,
      config,
      status: 'running',
      createdAt: new Date(),
      stats: {
        total: 100000,
        checked: 0,
        valid: 0,
        wrongPass: 0,
        notFound: 0,
        currentData: '-',
        speed: 0,
        history: Array.from({ length: 20 }).map((_, i) => ({ time: `${i}s`, speed: 0 }))
      },
      logs: [{
        id: Date.now().toString(),
        timestamp: new Date(),
        data: 'СИСТЕМА',
        status: 'info',
        message: `[СТАРТ] Сессия: ${config.sessionName} | Потоки: ${config.threads} | Прокси: ${proxies.length}`
      }]
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
    checksSinceLastTick.current = 0;
    return id;
  }, [proxies.length]);

  const pauseProcess = useCallback((id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'paused' } : s));
  }, []);

  const resumeProcess = useCallback((id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'running' } : s));
    setActiveSessionId(id);
  }, []);

  const stopProcess = useCallback((id: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'completed',
          logs: [{
            id: Date.now().toString(),
            timestamp: new Date(),
            data: 'СИСТЕМА',
            status: 'info',
            message: '[ОСТАНОВЛЕНО] Процесс завершен пользователем.'
          }, ...s.logs]
        };
      }
      return s;
    }));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  // Main simulation loop
  useEffect(() => {
    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (!activeSession || activeSession.status !== 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const baseDelay = Math.max(10, 1000 / activeSession.config.threads); 
    
    intervalRef.current = setInterval(() => {
      const rand = Math.random();
      let logStatus: 'valid' | 'wrong_pass' | 'not_found' = 'not_found';
      
      if (rand > 0.95) logStatus = 'valid';
      else if (rand > 0.70) logStatus = 'wrong_pass';
      
      const data = MOCK_DATA[Math.floor(Math.random() * MOCK_DATA.length)];
      
      checksSinceLastTick.current += 1;

      setSessions(prev => prev.map(session => {
        if (session.id !== activeSessionId) return session;

        const newChecked = session.stats.checked + 1;
        const newValid = session.stats.valid + (logStatus === 'valid' ? 1 : 0);
        let newStatus = session.status;
        let newLogs = session.logs;
        
        if (session.config.stopCondition === 'count' && session.config.stopCount && newValid >= session.config.stopCount) {
          newStatus = 'completed';
          newLogs = [{
            id: Date.now().toString(),
            timestamp: new Date(),
            data: 'СИСТЕМА',
            status: 'info',
            message: `[ЗАВЕРШЕНО] Достигнут лимит находок: ${session.config.stopCount}.`
          }, ...newLogs];
          setTimeout(() => setActiveSessionId(null), 0);
        }

        if (logStatus === 'valid' || logStatus === 'wrong_pass' || Math.random() > 0.98) {
          const newLog: LogEntry = {
            id: Math.random().toString(36).substring(7),
            timestamp: new Date(),
            data,
            status: logStatus,
            message: logStatus === 'valid' ? 'Успешная авторизация' : logStatus === 'wrong_pass' ? 'Неверный пароль' : 'Аккаунт не найден'
          };
          newLogs = [newLog, ...newLogs].slice(0, 500);
        }

        return {
          ...session,
          status: newStatus,
          logs: newLogs,
          stats: {
            ...session.stats,
            checked: newChecked,
            valid: newValid,
            wrongPass: session.stats.wrongPass + (logStatus === 'wrong_pass' ? 1 : 0),
            notFound: session.stats.notFound + (logStatus === 'not_found' ? 1 : 0),
            currentData: data,
          }
        };
      }));

    }, baseDelay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSessionId, sessions]);

  // Speed calculation loop (every second)
  useEffect(() => {
    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (!activeSession || activeSession.status !== 'running') {
      if (speedIntervalRef.current) clearInterval(speedIntervalRef.current);
      return;
    }

    speedIntervalRef.current = setInterval(() => {
      const currentSpeed = checksSinceLastTick.current;
      checksSinceLastTick.current = 0;

      setSessions(prev => prev.map(session => {
        if (session.id !== activeSessionId) return session;

        const newHistory = [...session.stats.history.slice(1), { 
          time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }), 
          speed: currentSpeed 
        }];

        return {
          ...session,
          stats: {
            ...session.stats,
            speed: currentSpeed,
            history: newHistory
          }
        };
      }));
    }, 1000);

    return () => {
      if (speedIntervalRef.current) clearInterval(speedIntervalRef.current);
    };
  }, [activeSessionId, sessions]);

  return {
    sessions,
    activeSessionId,
    startProcess,
    pauseProcess,
    resumeProcess,
    stopProcess
  };
}
