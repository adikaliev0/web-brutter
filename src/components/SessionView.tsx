import React, { useState } from 'react';
import { SessionData } from '../types';
import { Monitoring } from './Monitoring';
import { EventLog } from './EventLog';
import { ArrowLeft } from 'lucide-react';

interface SessionViewProps {
  session: SessionData;
  onBack: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function SessionView({ session, onBack, onPause, onResume, onStop }: SessionViewProps) {
  const [view, setView] = useState<'monitoring' | 'logs'>('monitoring');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1f1f1f] pb-4 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-[#1f1f1f] text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">{session.config.sessionName}</h2>
            <div className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest mt-1">
              Статус: <span className={session.status === 'running' ? 'text-red-500' : 'text-neutral-400'}>{session.status}</span>
            </div>
          </div>
        </div>
        <div className="flex bg-[#050505] border border-[#1f1f1f] p-1 w-full md:w-auto">
          <button 
            onClick={() => setView('monitoring')} 
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${view === 'monitoring' ? 'bg-[#1f1f1f] text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Мониторинг
          </button>
          <button 
            onClick={() => setView('logs')} 
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${view === 'logs' ? 'bg-[#1f1f1f] text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Логи
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'monitoring' ? (
          <Monitoring 
            status={session.status} 
            stats={session.stats} 
            onPause={onPause}
            onResume={onResume}
            onStop={onStop}
          />
        ) : (
          <EventLog logs={session.logs} />
        )}
      </div>
    </div>
  );
}
