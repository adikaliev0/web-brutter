import React, { useState, useEffect } from 'react';
import { Play, Settings2, Database, Hash, Infinity, Target, FileText, Send, AlertTriangle } from 'lucide-react';
import { ProcessConfig, Proxy } from '../types';

interface StartProcessProps {
  onStart: (config: ProcessConfig) => void;
  proxies: Proxy[];
}

export function StartProcess({ onStart, proxies }: StartProcessProps) {
  const recommendedThreads = Math.max(1, proxies.length * 5);
  
  const [config, setConfig] = useState<ProcessConfig>({
    format: 'email:password',
    sessionName: `SESSION_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
    threads: recommendedThreads > 0 ? recommendedThreads : 10,
    stopCondition: 'infinite',
    stopCount: 100,
    filePrefix: 'result',
    telegramLogs: false
  });

  // Update threads if proxies change and we haven't manually touched it much
  useEffect(() => {
    if (proxies.length > 0) {
      setConfig(c => ({ ...c, threads: proxies.length * 5 }));
    }
  }, [proxies.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  const isOverloaded = config.threads > recommendedThreads && proxies.length > 0;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="brutal-panel p-6 md:p-8">
        
        <div className="flex items-center gap-3 mb-8 border-b border-[#1f1f1f] pb-6">
          <Settings2 className="w-6 h-6 text-neutral-400" />
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Настройки Запуска</h2>
            <p className="text-neutral-500 text-sm">Установите параметры для новой задачи</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Имя Сессии</label>
              <input 
                type="text" 
                value={config.sessionName}
                onChange={e => setConfig({...config, sessionName: e.target.value})}
                className="brutal-input"
                required
              />
            </div>

            {/* Format */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3 h-3" /> Формат Базы
              </label>
              <select 
                value={config.format}
                onChange={e => setConfig({...config, format: e.target.value})}
                className="brutal-input appearance-none"
              >
                <option value="email:password">email:password</option>
                <option value="username:password">username:password</option>
                <option value="phone:password">phone:password</option>
              </select>
            </div>
          </div>

          {/* Threads & Proxies */}
          <div className="space-y-4 bg-[#050505] p-6 border border-[#1f1f1f]">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-3 h-3" /> Количество Потоков
              </label>
              <div className="text-right">
                <div className="text-xs text-neutral-500">Загружено Прокси: <span className="text-white font-bold">{proxies.length}</span></div>
                <div className="text-xs text-neutral-500">Рекомендуемый Максимум: <span className="text-green-500 font-bold">{recommendedThreads}</span></div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <input 
                type="range" 
                min="1" 
                max={Math.max(1000, recommendedThreads * 2)} 
                value={config.threads}
                onChange={e => setConfig({...config, threads: parseInt(e.target.value)})}
                className="flex-1 h-1 bg-[#1f1f1f] appearance-none cursor-pointer accent-red-600"
              />
              <input 
                type="number"
                value={config.threads}
                onChange={e => setConfig({...config, threads: parseInt(e.target.value) || 1})}
                className="brutal-input w-24 text-center font-bold text-lg"
              />
            </div>

            {isOverloaded && (
              <div className="flex items-start gap-2 text-orange-500 text-xs mt-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p>Внимание: Количество потоков превышает рекомендуемый лимит на основе загруженных прокси. Это может привести к банам.</p>
              </div>
            )}
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3 h-3" /> Префикс Файла
              </label>
              <input 
                type="text" 
                value={config.filePrefix}
                onChange={e => setConfig({...config, filePrefix: e.target.value})}
                className="brutal-input"
                placeholder="например: valid_accounts"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <Send className="w-3 h-3" /> Уведомления в Telegram
              </label>
              <button
                type="button"
                onClick={() => setConfig({...config, telegramLogs: !config.telegramLogs})}
                className={`w-full py-3 px-4 border text-left flex justify-between items-center transition-colors ${
                  config.telegramLogs 
                    ? 'bg-blue-950/30 border-blue-900 text-blue-400' 
                    : 'bg-[#050505] border-[#1f1f1f] text-neutral-500'
                }`}
              >
                <span className="font-bold text-sm uppercase">Отправлять логи боту</span>
                <div className={`w-3 h-3 rounded-full ${config.telegramLogs ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-neutral-700'}`} />
              </button>
            </div>
          </div>

          {/* Stop Conditions */}
          <div className="space-y-4 pt-4 border-t border-[#1f1f1f]">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Условие Остановки</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setConfig({...config, stopCondition: 'infinite'})}
                className={`p-4 border text-left transition-colors ${
                  config.stopCondition === 'infinite' 
                    ? 'bg-neutral-900 border-neutral-500 text-white' 
                    : 'bg-[#050505] border-[#1f1f1f] text-neutral-500 hover:border-neutral-700'
                }`}
              >
                <Infinity className={`w-5 h-5 mb-2 ${config.stopCondition === 'infinite' ? 'text-white' : ''}`} />
                <div className="font-bold uppercase text-sm">Бесконечная Работа</div>
                <div className="text-xs opacity-70 mt-1">Работать до конца базы</div>
              </button>

              <button
                type="button"
                onClick={() => setConfig({...config, stopCondition: 'count'})}
                className={`p-4 border text-left transition-colors ${
                  config.stopCondition === 'count' 
                    ? 'bg-neutral-900 border-neutral-500 text-white' 
                    : 'bg-[#050505] border-[#1f1f1f] text-neutral-500 hover:border-neutral-700'
                }`}
              >
                <Target className={`w-5 h-5 mb-2 ${config.stopCondition === 'count' ? 'text-white' : ''}`} />
                <div className="font-bold uppercase text-sm">Лимит Находок</div>
                <div className="text-xs opacity-70 mt-1">Остановить после N валидов</div>
              </button>
            </div>

            {config.stopCondition === 'count' && (
              <div className="pt-2">
                <input 
                  type="number" 
                  min="1"
                  value={config.stopCount}
                  onChange={e => setConfig({...config, stopCount: parseInt(e.target.value)})}
                  className="brutal-input"
                  placeholder="Введите лимит..."
                />
              </div>
            )}
          </div>

          <div className="pt-8">
            <button
              type="submit"
              className="w-full py-5 bg-red-900/20 border border-red-900 text-red-500 hover:bg-red-900 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 font-bold uppercase tracking-widest"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Запустить Брут
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
