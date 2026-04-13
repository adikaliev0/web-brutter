import React, { useState } from 'react';
import { PlaySquare, Network, LogOut, History, Terminal } from 'lucide-react';
import { StartProcess } from './components/StartProcess';
import { ProxyManager } from './components/ProxyManager';
import { SessionsList } from './components/SessionsList';
import { SessionView } from './components/SessionView';
import { BootSequence } from './components/BootSequence';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { useProcessSimulation } from './hooks/useProcessSimulation';
import { AuthState, SecurityAlert, Proxy } from './types';

type Tab = 'start' | 'sessions' | 'proxies';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, role: 'guest', key: null });
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [proxies, setProxies] = useState<Proxy[]>([]);
  
  const [activeTab, setActiveTab] = useState<Tab>('start');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  const { 
    sessions, 
    startProcess, 
    pauseProcess, 
    resumeProcess, 
    stopProcess 
  } = useProcessSimulation(proxies);

  const handleSecurityAlert = (key: string) => {
    setAlerts(prev => [{
      id: Date.now().toString(),
      timestamp: new Date(),
      key,
      ip: '192.168.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255),
      device: 'Неизвестное Устройство',
      message: 'Попытка входа с аннулированным ключом.'
    }, ...prev]);
  };

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, role: 'guest', key: null });
  };

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
  }

  if (!auth.isLoggedIn) {
    return <Login onLogin={setAuth} onSecurityAlert={handleSecurityAlert} />;
  }

  if (auth.role === 'admin') {
    return <AdminPanel alerts={alerts} onLogout={handleLogout} />;
  }

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row overflow-hidden bg-[#050505]">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-[#1f1f1f] bg-[#0a0a0a] z-20 relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-950 border border-red-900 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-widest uppercase text-xs">ADIXXLEE</h1>
            <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">CPM2 BRUTER</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-neutral-500 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 flex-shrink-0 bg-[#0a0a0a] border-r border-[#1f1f1f] flex-col z-20 relative">
        <div className="absolute right-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-red-900/20 to-transparent" />
        <div className="p-6 flex items-center gap-3 border-b border-[#1f1f1f]">
          <div className="w-10 h-10 bg-red-950 border border-red-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
            <Terminal className="w-5 h-5 text-red-500 relative z-10" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-widest uppercase text-sm">ADIXXLEE</h1>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">CPM2 BRUTER</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 flex flex-col gap-2">
          <NavButton 
            active={activeTab === 'start' && !selectedSessionId} 
            onClick={() => { setActiveTab('start'); setSelectedSessionId(null); }}
            icon={<PlaySquare className="w-4 h-4" />}
            label="Запуск"
          />
          <NavButton 
            active={activeTab === 'sessions' || !!selectedSessionId} 
            onClick={() => { setActiveTab('sessions'); setSelectedSessionId(null); }}
            icon={<History className="w-4 h-4" />}
            label="Сессии"
            badge={sessions.length > 0 ? sessions.length : undefined}
          />
          <NavButton 
            active={activeTab === 'proxies' && !selectedSessionId} 
            onClick={() => { setActiveTab('proxies'); setSelectedSessionId(null); }}
            icon={<Network className="w-4 h-4" />}
            label="Прокси"
            badge={proxies.length > 0 ? proxies.length : undefined}
          />
        </div>

        <div className="p-4 mt-auto border-t border-[#1f1f1f]">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-neutral-500 hover:text-red-500 transition-colors uppercase tracking-wider py-2">
            <LogOut className="w-4 h-4" /> Выход
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative p-4 md:p-8 custom-scrollbar pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto relative z-10 h-full">
          {selectedSession ? (
            <SessionView 
              session={selectedSession}
              onBack={() => setSelectedSessionId(null)}
              onPause={() => pauseProcess(selectedSession.id)}
              onResume={() => resumeProcess(selectedSession.id)}
              onStop={() => stopProcess(selectedSession.id)}
            />
          ) : (
            <>
              {activeTab === 'start' && (
                <StartProcess 
                  proxies={proxies}
                  onStart={(config) => {
                    const id = startProcess(config);
                    setActiveTab('sessions');
                    setSelectedSessionId(id);
                  }} 
                />
              )}
              {activeTab === 'sessions' && (
                <SessionsList 
                  sessions={sessions} 
                  onSelect={setSelectedSessionId} 
                />
              )}
              {activeTab === 'proxies' && (
                <ProxyManager proxies={proxies} setProxies={setProxies} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-t border-[#1f1f1f] z-30 pb-safe">
        <div className="flex justify-around items-center p-2">
          <MobileNavButton 
            active={activeTab === 'start' && !selectedSessionId} 
            onClick={() => { setActiveTab('start'); setSelectedSessionId(null); }}
            icon={<PlaySquare className="w-5 h-5" />}
            label="Запуск"
          />
          <MobileNavButton 
            active={activeTab === 'sessions' || !!selectedSessionId} 
            onClick={() => { setActiveTab('sessions'); setSelectedSessionId(null); }}
            icon={<History className="w-5 h-5" />}
            label="Сессии"
            badge={sessions.length > 0 ? sessions.length : undefined}
          />
          <MobileNavButton 
            active={activeTab === 'proxies' && !selectedSessionId} 
            onClick={() => { setActiveTab('proxies'); setSelectedSessionId(null); }}
            icon={<Network className="w-5 h-5" />}
            label="Прокси"
            badge={proxies.length > 0 ? proxies.length : undefined}
          />
        </div>
      </nav>

    </div>
  );
}

function NavButton({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 whitespace-nowrap border relative overflow-hidden ${
        active 
          ? "bg-[#1f1f1f] text-white border-neutral-600" 
          : "bg-transparent text-neutral-500 border-transparent hover:bg-[#111] hover:text-neutral-300"
      }`}
    >
      {active && <div className="absolute left-0 top-0 w-1 h-full bg-red-600" />}
      <span className="relative z-10">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider relative z-10">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-red-950 text-red-500 text-[10px] font-bold px-2 py-0.5 border border-red-900 relative z-10">
          {badge}
        </span>
      )}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 p-2 w-full relative ${
        active ? "text-white" : "text-neutral-500"
      }`}
    >
      <div className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-red-600 rounded-b-md" />
      )}
    </button>
  );
}
