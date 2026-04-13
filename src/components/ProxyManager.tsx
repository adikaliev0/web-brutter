import React, { useState } from 'react';
import { Network, Save, Trash2, AlertTriangle } from 'lucide-react';
import { Proxy } from '../types';

interface ProxyManagerProps {
  proxies: Proxy[];
  setProxies: (proxies: Proxy[]) => void;
}

export function ProxyManager({ proxies, setProxies }: ProxyManagerProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    setError(null);
    if (!input.trim()) {
      setProxies([]);
      return;
    }

    const lines = input.split('\n').filter(l => l.trim().length > 0);
    const parsed: Proxy[] = [];
    let errCount = 0;

    for (const line of lines) {
      const parts = line.trim().split(':');
      if (parts.length === 2 || parts.length === 4) {
        parsed.push({
          ip: parts[0],
          port: parts[1],
          user: parts[2],
          pass: parts[3],
          raw: line.trim()
        });
      } else {
        errCount++;
      }
    }

    if (errCount > 0) {
      setError(`Не удалось распознать ${errCount} строк. Ожидаемый формат: ip:port или ip:port:user:pass`);
    }

    setProxies(parsed);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-neutral-200 uppercase tracking-wider">
            <Network className="w-5 h-5 text-neutral-400" />
            Управление Прокси
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Формат: ip:port:user:pass или ip:port</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{proxies.length}</div>
          <div className="text-xs text-neutral-500 uppercase">Загружено</div>
        </div>
      </div>

      <div className="brutal-panel p-1">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.1:8080&#10;10.0.0.1:3128:admin:pass123"
          className="w-full h-64 bg-[#050505] text-neutral-300 p-4 font-mono text-sm focus:outline-none resize-none custom-scrollbar"
        />
      </div>

      {error && (
        <div className="bg-orange-950/30 border border-orange-900/50 p-3 flex items-start gap-3 text-orange-500 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button onClick={handleParse} className="brutal-button flex-1 py-3">
          <Save className="w-4 h-4" /> Сохранить
        </button>
        <button 
          onClick={() => { setInput(''); setProxies([]); setError(null); }} 
          className="brutal-button-danger px-6"
        >
          <Trash2 className="w-4 h-4" /> Очистить
        </button>
      </div>

    </div>
  );
}
