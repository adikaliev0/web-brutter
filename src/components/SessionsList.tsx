import React from 'react';
import { SessionData } from '../types';
import { ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export function SessionsList({ sessions, onSelect }: { sessions: SessionData[], onSelect: (id: string) => void }) {
  if (sessions.length === 0) {
    return <div className="text-neutral-500 text-center py-20 uppercase font-bold tracking-widest">Нет активных сессий</div>;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">История Сессий</h2>
      {sessions.map(session => (
        <div 
          key={session.id} 
          onClick={() => onSelect(session.id)} 
          className="brutal-panel p-4 hover:border-red-600 cursor-pointer transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-2 h-2 rounded-full ${session.status === 'running' ? 'bg-red-500 animate-pulse' : session.status === 'paused' ? 'bg-orange-500' : 'bg-neutral-500'}`} />
              <h3 className="font-bold text-white text-lg uppercase tracking-wider">{session.config.sessionName}</h3>
              <span className="text-xs text-neutral-500 font-mono">{format(session.createdAt, 'dd.MM.yyyy HH:mm')}</span>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm font-mono">
              <span className="text-neutral-400">Проверено: <span className="text-white">{session.stats.checked}</span></span>
              <span className="text-green-500">Валид: {session.stats.valid}</span>
              <span className="text-orange-500">Неверные: {session.stats.wrongPass}</span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-neutral-600 group-hover:text-red-500 transition-colors hidden md:block" />
        </div>
      ))}
    </div>
  );
}
