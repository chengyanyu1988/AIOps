import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  RefreshCw,
  Clock,
  User,
  LogOut,
  Activity,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  onOpenAIDiagnostics: () => void;
  currentUser?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLiveMode,
  setIsLiveMode,
  onOpenAIDiagnostics,
  currentUser,
  onLogout,
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) +
          ' ' +
          now.toLocaleTimeString('zh-CN', { hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-6">
        {/* Zone 1: Single Brand Wordmark & System Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <a
              href="#"
              className="text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap"
            >
              <span>DeepBrain</span>
              <span className="text-cyan-400 font-normal text-sm bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                AIOps 数智运维
              </span>
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>系统推理正常</span>
          </div>
        </div>

        {/* Zone 2: Actions & Telemetry Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* AI Diagnostic Copilot Trigger */}
          <button
            onClick={onOpenAIDiagnostics}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-500/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>AI根因助手</span>
          </button>

          {/* Live Stream Simulation Toggle */}
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              isLiveMode
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
            title="切换动态实时演算"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveMode ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">{isLiveMode ? '实时推演中' : '静态展示'}</span>
          </button>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{timeString || '2026-10-15 23:47:31'}</span>
          </div>

          {/* User Account & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-200 font-mono bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 shadow-inner">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline max-w-[130px] truncate">{currentUser}</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
