import React from 'react';
import { ResourceMonitorCard } from '../types/aiops';
import { Server, Network, Layers, Cpu, Radio } from 'lucide-react';

interface MonitoredResourcesGridProps {
  resources: ResourceMonitorCard[];
}

export const MonitoredResourcesGrid: React.FC<MonitoredResourcesGridProps> = ({ resources }) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'host':
        return <Server className="w-5 h-5 text-cyan-400" />;
      case 'network':
        return <Network className="w-5 h-5 text-indigo-400" />;
      case 'pool':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'cluster':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      default:
        return <Radio className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 lg:p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          模型监控资源
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">4 核心分类</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl p-3 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                {getResourceIcon(res.type)}
              </div>
              <span className="text-xs font-bold text-slate-100">{res.title}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] border-t border-slate-800/60 pt-2">
              <div>
                <span className="text-slate-400 block mb-0.5">单一指标</span>
                <span className="text-xs font-bold text-cyan-400 font-mono tabular-nums">
                  {res.singleMetricCount}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">模型数</span>
                <span className="text-xs font-bold text-indigo-400 font-mono tabular-nums">
                  {res.modelCount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">纳管设备</span>
                <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums">
                  {res.managedDevicesCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
