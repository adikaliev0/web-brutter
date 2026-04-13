import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, ShieldAlert, Terminal } from 'lucide-react';
import { AuthState } from '../types';

interface LoginProps {
  onLogin: (auth: AuthState) => void;
  onSecurityAlert: (key: string) => void;
}

export function Login({ onLogin, onSecurityAlert }: LoginProps) {
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Mock Auth Logic
    if (key === 'ADMIN-ROOT-999') {
      onLogin({ isLoggedIn: true, role: 'admin', key });
    } else if (key === 'USER-VALID-123') {
      onLogin({ isLoggedIn: true, role: 'user', key });
    } else if (key === 'STOLEN-KEY-000') {
      setIsGlitching(true);
      setError("ОБНАРУЖЕНА УГРОЗА. КЛЮЧ АННУЛИРОВАН. IP ЗАПИСАН.");
      onSecurityAlert(key);
      setTimeout(() => setIsGlitching(false), 3000);
    } else {
      setError("НЕВЕРНЫЙ КЛЮЧ ДОСТУПА.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`brutal-panel p-8 w-full max-w-md relative z-10 ${isGlitching ? 'animate-pulse border-red-600' : ''}`}
      >
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-900" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-900" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-900" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-900" />
        
        <div className="absolute top-2 left-2 text-[8px] text-neutral-700 font-mono">SYS.AUTH.v9.4.2</div>
        <div className="absolute bottom-2 right-2 text-[8px] text-neutral-700 font-mono">SECURE_CONNECTION</div>

        <div className="flex flex-col items-center mb-6 md:mb-8 mt-2 md:mt-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#050505] border border-[#1f1f1f] flex items-center justify-center mb-4 relative overflow-hidden">
            <motion.div 
              animate={{ top: ['-10%', '110%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute left-0 w-full h-[1px] bg-red-500/50"
            />
            <Terminal className={`w-6 h-6 md:w-8 md:h-8 relative z-10 ${isGlitching ? 'text-red-500' : 'text-neutral-400'}`} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-widest text-center">
            <span className={isGlitching ? "glitch-text text-red-500" : ""} data-text="ADIXXLEE">ADIXXLEE</span>
            <br />
            <span className="text-red-500 text-base md:text-lg">CPM2 BRUTER</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wider flex items-center justify-between">
              <span>Лицензионный Ключ</span>
              <span className="text-[9px] text-red-900">REQ_AUTH</span>
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="brutal-input !pl-12 font-mono tracking-widest"
                placeholder="XXXX-XXXX-XXXX"
                autoComplete="off"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/50 border border-red-900 p-3 flex items-start gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400 font-bold leading-relaxed">{error}</p>
            </motion.div>
          )}

          <button type="submit" className="brutal-button w-full py-4 group">
            <span>Аутентификация</span>
            <motion.span 
              className="inline-block ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            >
              →
            </motion.span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
