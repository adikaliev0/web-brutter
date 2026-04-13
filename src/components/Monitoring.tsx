import React from 'react';
import { Play, Pause, Square, Activity, CheckSquare, XSquare, FileWarning, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProcessStats, ProcessStatus } from '../types';

interface MonitoringProps {
  status: ProcessStatus;
  stats: ProcessStats;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function Monitoring({ status, stats, onPause, onResume, onStop }: MonitoringProps) {
  const isRunning = status === 'running';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard 
          title="Проверено" 
          value={stats.checked.toLocaleString()} 
          icon={<Target className="w-4 h-4 md:w-5 md:h-5 text-neutral-500" />}
          trend={`+${stats.speed}/s`}
        />
        <StatCard 
          title="Валид" 
          value={stats.valid.toLocaleString()} 
          icon={<CheckSquare className="w-4 h-4 md:w-5 md:h-5 text-green-500" />}
          valueClassName="text-green-500"
        />
        <StatCard 
          title="Не верные пароли" 
          value={stats.wrongPass.toLocaleString()} 
          icon={<FileWarning className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />}
          valueClassName="text-orange-500"
        />
        <StatCard 
          title="Не существующие" 
          value={stats.notFound.toLocaleString()} 
          icon={<XSquare className="w-4 h-4 md:w-5 md:h-5 text-red-600" />}
          valueClassName="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Target & Controls */}
        <div className="brutal-panel p-6 flex flex-col justify-between lg:col-span-1 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Текущий Аккаунт
            </h3>
            <div className="bg-[#050505] border border-[#1f1f1f] p-4 relative overflow-hidden">
              <p className="font-mono text-sm text-neutral-300 truncate w-full text-center">
                {stats.currentData}
              </p>
              {isRunning && (
                <div className="absolute bottom-0 left-0 h-[2px] bg-red-600 w-full animate-pulse" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {status === 'running' ? (
              <button onClick={onPause} className="brutal-button py-4">
                <Pause className="w-4 h-4" /> Пауза
              </button>
            ) : (
              <button 
                onClick={onResume}
                disabled={status === 'idle' || status === 'completed'}
                className="brutal-button py-4 disabled:opacity-50"
              >
                <Play className="w-4 h-4" /> Продолжить
              </button>
            )}
            <button 
              onClick={onStop}
              disabled={status === 'idle'}
              className="brutal-button-danger py-4 disabled:opacity-50"
            >
              <Square className="w-4 h-4" /> Остановить
            </button>
          </div>
        </div>

        {/* Speed Chart */}
        <div className="brutal-panel p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Скорость Работы</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {isRunning && <span className="animate-ping absolute inline-flex h-full w-full bg-red-500 opacity-75"></span>}
                <span className={`relative inline-flex h-2 w-2 ${isRunning ? "bg-red-600" : "bg-neutral-600"}`}></span>
              </span>
              <span className="text-sm font-mono text-neutral-400">{stats.speed} acc/s</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f1f1f" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#525252" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#525252" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f', borderRadius: '0', fontFamily: 'monospace', fontSize: '12px' }}
                  itemStyle={{ color: '#dc2626' }}
                />
                <Area 
                  type="step" 
                  dataKey="speed" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSpeed)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, valueClassName }: { title: string, value: string, icon: React.ReactNode, trend?: string, valueClassName?: string }) {
  return (
    <div className="brutal-panel p-4 md:p-6 relative group">
      <div className="absolute top-0 right-0 p-3 md:p-4 opacity-30">
        {icon}
      </div>
      <h3 className="text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 md:mb-2 pr-6">{title}</h3>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
        <p className={`text-xl md:text-3xl font-bold font-mono tracking-tight ${valueClassName || 'text-white'}`}>
          {value}
        </p>
        {trend && (
          <span className="text-[10px] md:text-xs font-bold text-neutral-400 bg-[#1f1f1f] px-1.5 py-0.5 w-fit">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
