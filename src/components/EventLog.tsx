import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, XSquare, FileWarning, Terminal, Filter } from 'lucide-react';
import { LogEntry, LogStatus } from '../types';
import { format } from 'date-fns';

interface EventLogProps {
  logs: LogEntry[];
}

type FilterType = 'all' | LogStatus;

export function EventLog({ logs }: EventLogProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      
      {/* Filters Header */}
      <div className="brutal-panel p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-neutral-400 text-sm font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Фильтры Логов</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label={`Все (${logs.length})`} />
          <FilterButton active={filter === 'valid'} onClick={() => setFilter('valid')} label="Валид" className="text-green-500" />
          <FilterButton active={filter === 'wrong_pass'} onClick={() => setFilter('wrong_pass')} label="Не верные пароли" className="text-orange-500" />
          <FilterButton active={filter === 'not_found'} onClick={() => setFilter('not_found')} label="Не существующие" className="text-red-600" />
        </div>
      </div>

      {/* Log List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {filteredLogs.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-center py-12 text-neutral-600 font-mono text-sm uppercase"
            >
              Записей не найдено.
            </motion.div>
          ) : (
            filteredLogs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

function FilterButton({ active, onClick, label, className }: { active: boolean, onClick: () => void, label: string, className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border ${
        active 
          ? `bg-[#1f1f1f] border-neutral-500 ${className || 'text-white'}` 
          : `bg-[#050505] border-[#1f1f1f] text-neutral-500 hover:border-neutral-700 ${className || ''}`
      }`}
    >
      {label}
    </button>
  );
}

const LogCard = React.forwardRef<HTMLDivElement, { log: LogEntry }>(({ log }, ref) => {
  const isSuccess = log.status === 'valid';
  const isWrongPass = log.status === 'wrong_pass';
  const isNotFound = log.status === 'not_found';
  const isInfo = log.status === 'info';

  const borderColor = isSuccess ? 'border-green-500' : isWrongPass ? 'border-orange-500' : isNotFound ? 'border-red-600' : 'border-neutral-600';
  const textColor = isSuccess ? 'text-green-500' : isWrongPass ? 'text-orange-500' : isNotFound ? 'text-red-600' : 'text-neutral-400';

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={`bg-[#0a0a0a] border border-[#1f1f1f] border-l-4 ${borderColor} p-3`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {isSuccess && <CheckSquare className="w-4 h-4 text-green-500" />}
          {isWrongPass && <FileWarning className="w-4 h-4 text-orange-500" />}
          {isNotFound && <XSquare className="w-4 h-4 text-red-600" />}
          {isInfo && <Terminal className="w-4 h-4 text-neutral-500" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
            <span className="font-mono text-sm text-neutral-200 truncate">
              {log.data}
            </span>
            <span className="font-mono text-xs text-neutral-600 whitespace-nowrap">
              {format(log.timestamp, 'HH:mm:ss.SSS')}
            </span>
          </div>
          
          <p className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
            {log.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
});
LogCard.displayName = 'LogCard';
