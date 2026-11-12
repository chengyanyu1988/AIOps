import React from 'react';
import { KPIItem } from '../types/aiops';
import { TrendingUp, TrendingDown, Server, Cpu, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface KPIBarProps {
  kpis: KPIItem[];
  onSelectKpi?: (kpiId: string) => void;
}

export const KPIBar: React.FC<KPIBarProps> = ({ kpis, onSelectKpi }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'kpi-1':
        return <Server className="w-5 h-5 text-cyan-400" />;
      case 'kpi-2':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'kpi-3':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'kpi-4':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'kpi-5':
        return <Clock className="w-5 h-5 text-cyan-300" />;
      default:
        return <Server className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        return (
          <div
            key={kpi.id}
            onClick={() => onSelectKpi && onSelectKpi(kpi.id)}
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-300 shadow-lg cursor-pointer overflow-hidden backdrop-blur-sm"
          >
            {/* Top row: Title and Icon */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                {kpi.title}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:bg-cyan-950/80 transition-colors">
                {getIcon(kpi.id)}
              </div>
            </div>

            {/* Main Value */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums group-hover:text-cyan-300 transition-colors">
                {kpi.value}
              </span>
            </div>

            {/* Sub Metrics or Trend Badge */}
            {kpi.subMetrics ? (
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-1">
                {kpi.subMetrics.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="text-slate-400">{sub.label.replace('平均时长', '')}:</span>
                    <span className="font-mono font-bold text-cyan-400">{sub.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs border-t border-slate-800/60 pt-2">
                {kpi.isUp ? (
                  <span className="flex items-center text-emerald-400 font-medium gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-mono">{kpi.changeRate}%</span>
                  </span>
                ) : (
                  <span className="flex items-center text-emerald-400 font-medium gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span className="font-mono">{kpi.changeRate}%</span>
                  </span>
                )}
                <span className="text-[11px] text-slate-400 truncate">同比上周同期</span>
              </div>
            )}

            {/* Decorative bottom glow */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/0 group-hover:via-cyan-500/60 to-transparent transition-all duration-300" />
          </div>
        );
      })}
    </div>
  );
};
