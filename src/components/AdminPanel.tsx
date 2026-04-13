import React, { useState } from 'react';
import { ShieldAlert, Key, Activity, LogOut, Plus } from 'lucide-react';
import { SecurityAlert } from '../types';
import { format } from 'date-fns';

interface AdminPanelProps {
  alerts: SecurityAlert[];
  onLogout: () => void;
}

export function AdminPanel({ alerts, onLogout }: AdminPanelProps) {
  const [keys, setKeys] = useState([
    { id: '1', key: 'USER-VALID-123', user: 'Client A', status: 'active', created: new Date() },
    { id: '2', key: 'STOLEN-KEY-000', user: 'Client B', status: 'revoked', created: new Date(Date.now() - 86400000) }
  ]);

  const generateKey = () => {
    const newKey = `KEY-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setKeys([{ id: Date.now().toString(), key: newKey, user: 'Не назначен', status: 'active', created: new Date() }, ...keys]);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 brutal-panel p-6">
        <div>
          <h1 className="text-2xl font-bold text-red-500 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6" />
            ПАНЕЛЬ АДМИНИСТРАТОРА
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Управление доступом и безопасностью</p>
        </div>
        <button onClick={onLogout} className="brutal-button px-6 py-2 text-sm">
          <LogOut className="w-4 h-4" /> Завершить Сеанс
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Security Alerts */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-300">
            <Activity className="w-5 h-5 text-red-500" />
            Угрозы Безопасности
          </h2>
          <div className="brutal-panel p-4 h-[500px] overflow-y-auto custom-scrollbar space-y-3">
            {alerts.length === 0 ? (
              <div className="text-neutral-600 text-sm text-center py-10">Нарушений безопасности не обнаружено.</div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="bg-red-950/20 border border-red-900/50 p-3 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-red-500 font-bold">ПОПЫТКА ВЗЛОМА</span>
                    <span className="text-neutral-500 text-xs">{format(alert.timestamp, 'HH:mm:ss')}</span>
                  </div>
                  <div className="space-y-1 text-neutral-300">
                    <p><span className="text-neutral-500">Ключ:</span> {alert.key}</p>
                    <p><span className="text-neutral-500">IP:</span> {alert.ip}</p>
                    <p className="text-red-400 mt-2">{alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Key Management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-300">
              <Key className="w-5 h-5 text-neutral-400" />
              Ключи Доступа
            </h2>
            <button onClick={generateKey} className="brutal-button px-4 py-2 text-sm">
              <Plus className="w-4 h-4" /> Создать Ключ
            </button>
          </div>
          
          <div className="brutal-panel overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-[#050505] border-b border-[#1f1f1f]">
                <tr>
                  <th className="px-6 py-4 font-medium">Ключ Доступа</th>
                  <th className="px-6 py-4 font-medium">Привязан К</th>
                  <th className="px-6 py-4 font-medium">Статус</th>
                  <th className="px-6 py-4 font-medium">Создан</th>
                </tr>
              </thead>
              <tbody>
                {keys.map(k => (
                  <tr key={k.id} className="border-b border-[#1f1f1f] hover:bg-[#0a0a0a]">
                    <td className="px-6 py-4 font-mono text-neutral-300">{k.key}</td>
                    <td className="px-6 py-4 text-neutral-400">{k.user}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold ${k.status === 'active' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                        {k.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{format(k.created, 'dd.MM.yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
