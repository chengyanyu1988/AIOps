import React from 'react';
import { CapabilityNode } from '../types/aiops';
import { X, CheckCircle2, Clock, Compass, Layers, User, Cpu, ArrowRight } from 'lucide-react';

interface NodeDetailModalProps {
  node: CapabilityNode | null;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{node.title}</h3>
              <p className="text-xs text-slate-400 font-mono">ID: {node.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">能力概述</span>
            <p className="text-sm text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
              {node.description}
            </p>
          </div>

          {/* Metrics Grid */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">运行核心指标</span>
            <div className="grid grid-cols-2 gap-2">
              {node.metrics.map((m, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">{m.label}</span>
                  <span className="text-lg font-bold text-cyan-300 font-mono tabular-nums">
                    {m.value} {m.unit || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sub Modules */}
          {node.subModules && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">包含核心子模块</span>
              <div className="flex flex-wrap gap-2">
                {node.subModules.map((sub, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-lg"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner & Active Models */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              负责团队: <strong className="text-slate-200">{node.owner || '运维架构组'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              活跃模型: <strong className="text-cyan-300 font-mono">{node.activeModelsCount || 42} 个</strong>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            关闭
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
          >
            进入建模工作台
          </button>
        </div>
      </div>
    </div>
  );
};
