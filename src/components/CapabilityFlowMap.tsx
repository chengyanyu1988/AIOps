import React from 'react';
import { CapabilityNode } from '../types/aiops';
import {
  Layers,
  Cpu,
  AlertTriangle,
  TrendingUp,
  BellRing,
  GitGraph,
  Zap,
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';

interface CapabilityFlowMapProps {
  nodes: CapabilityNode[];
  onSelectNode: (node: CapabilityNode) => void;
}

export const CapabilityFlowMap: React.FC<CapabilityFlowMapProps> = ({
  nodes,
  onSelectNode,
}) => {
  const getNode = (id: string) => nodes.find((n) => n.id === id);

  const getStatusBadge = (status: 'built' | 'building' | 'planned') => {
    switch (status) {
      case 'built':
        return (
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>已建</span>
          </span>
        );
      case 'building':
        return (
          <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>在建</span>
          </span>
        );
      case 'planned':
        return (
          <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" />
            <span>规划</span>
          </span>
        );
    }
  };

  const renderCardNode = (nodeId: string, icon: React.ReactNode) => {
    const node = getNode(nodeId);
    if (!node) return null;

    return (
      <div
        onClick={() => onSelectNode(node)}
        className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3.5 transition-all duration-200 shadow-md hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:bg-cyan-950 text-cyan-400 transition-colors">
                {icon}
              </div>
              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {node.title}
              </h4>
            </div>
            {getStatusBadge(node.status)}
          </div>

          {/* Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/60">
            {node.metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] text-slate-400">{m.label}</span>
                <span className="text-xs font-bold text-white font-mono tabular-nums">
                  {m.value}
                  {m.unit && <span className="text-[10px] ml-0.5 font-normal text-slate-400">{m.unit}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/40">
          <span className="text-slate-400 truncate group-hover:text-cyan-400/80 transition-colors">
            {node.owner || 'AIOps Engine'}
          </span>
          <span className="flex items-center gap-0.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>详情</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/90 rounded-2xl p-4 lg:p-6 backdrop-blur-md relative overflow-hidden">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />

      {/* Header Label */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            AIOps 场景全景 & 建模基础能力图谱
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            涵盖数据采集、算法训练、场景感知与全流程故障治理链路
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-lg">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> 已建 (5)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> 在建 (3)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> 规划 (3)
          </span>
        </div>
      </div>

      {/* Grid Layout: Left Column (Modeling Core) vs Right Column (AIOps Scenario) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Section: 建模基础能力 (4 columns on desktop) */}
        <div className="lg:col-span-4 bg-slate-950/60 border border-cyan-900/30 rounded-xl p-4 relative">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-900/40">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              建模基础能力
            </span>
            <span className="text-[11px] text-cyan-400/80 font-mono">CORE PIPELINE</span>
          </div>

          <div className="space-y-4">
            {renderCardNode('cap-data-explore', <Layers className="w-4 h-4" />)}

            <div className="flex justify-center my-1">
              <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-500 to-indigo-500" />
            </div>

            {renderCardNode('cap-algo-modeling', <Cpu className="w-4 h-4" />)}
          </div>
        </div>

        {/* Right Section: AIOps场景能力 (8 columns on desktop) */}
        <div className="lg:col-span-8 bg-slate-950/60 border border-indigo-900/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-900/40">
            <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              AIOps 场景应用能力
            </span>
            <span className="text-[11px] text-indigo-400/80 font-mono">SCENARIO ENGINES</span>
          </div>

          {/* Row 1: Perception & Prediction & Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {renderCardNode('cap-anomaly-discovery', <AlertTriangle className="w-4 h-4" />)}
            {renderCardNode('cap-smart-predict', <TrendingUp className="w-4 h-4" />)}
            {renderCardNode('cap-alert-mgmt', <BellRing className="w-4 h-4" />)}
          </div>

          {/* Row 2: Knowledge Graph & Self Healing & Review */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {renderCardNode('cap-knowledge-graph', <GitGraph className="w-4 h-4" />)}
            {renderCardNode('cap-fault-self-healing', <Zap className="w-4 h-4" />)}
            {renderCardNode('cap-fault-review', <RotateCcw className="w-4 h-4" />)}
          </div>

          {/* Row 3: Diagnosis & Demarcation & Lineage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {renderCardNode('cap-fault-rca', <Search className="w-4 h-4" />)}
            {renderCardNode('cap-fault-demarcation', <CheckCircle2 className="w-4 h-4" />)}
            {renderCardNode('cap-fault-lineage', <Compass className="w-4 h-4" />)}
          </div>
        </div>
      </div>
    </div>
  );
};
