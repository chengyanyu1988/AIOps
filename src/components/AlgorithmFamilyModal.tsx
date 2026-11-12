import React from 'react';
import { AlgorithmFamily } from '../types/aiops';
import { X, Brain, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface AlgorithmFamilyModalProps {
  family: AlgorithmFamily | null;
  onClose: () => void;
}

export const AlgorithmFamilyModal: React.FC<AlgorithmFamilyModalProps> = ({
  family,
  onClose,
}) => {
  if (!family) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-900 to-cyan-900 text-cyan-300 border border-cyan-800">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{family.name}</h3>
              <p className="text-xs text-slate-400 font-mono">智能推理准确率: {family.accuracy}</p>
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
            <span className="text-xs font-semibold text-slate-400 block mb-1">算法族特性说明</span>
            <p className="text-sm text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
              {family.description}
            </p>
          </div>

          {/* Model Types */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">涵盖算法模型架构</span>
            <div className="space-y-2">
              {family.modelTypes.map((model, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-cyan-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {model}
                  </span>
                  <span className="text-slate-400 font-mono">已训练上线</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>正在推理模型例程: <strong className="text-cyan-300 font-mono">{family.activeCount} 个</strong></span>
            <span className="text-emerald-400">持续自适应演进中</span>
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
            查看模型超参配置
          </button>
        </div>
      </div>
    </div>
  );
};
