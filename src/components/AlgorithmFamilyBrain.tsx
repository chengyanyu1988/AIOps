import React, { useState } from 'react';
import { AlgorithmFamily } from '../types/aiops';
import { Brain, Cpu, Sparkles, Activity, ShieldAlert, Boxes, ChevronRight, Info } from 'lucide-react';

interface AlgorithmFamilyBrainProps {
  families: AlgorithmFamily[];
  onSelectFamily: (family: AlgorithmFamily) => void;
}

export const AlgorithmFamilyBrain: React.FC<AlgorithmFamilyBrainProps> = ({
  families,
  onSelectFamily,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getFamilyIcon = (id: string) => {
    switch (id) {
      case 'algo-conan':
        return <Brain className="w-5 h-5 text-cyan-400" />;
      case 'algo-prophecy':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'algo-neuron':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'noah':
      case 'algo-noah':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'algo-hewu':
        return <Boxes className="w-5 h-5 text-cyan-300" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-full min-h-[420px]">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-cyan-950/30 via-slate-950/80 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            AI 算法族矩阵与智能大脑
          </h3>
          <p className="text-[11px] text-slate-400">点击算法节点展开底层算法模型与推理树</p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-md">
          5 核心算法族
        </span>
      </div>

      {/* Central Interactive Brain Visual Area */}
      <div className="relative flex-1 flex items-center justify-center my-4 min-h-[260px]">
        {/* Animated Brain Center Globe */}
        <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-600/30 via-indigo-600/20 to-purple-600/30 border border-cyan-500/40 flex items-center justify-center shadow-2xl shadow-cyan-500/20 group">
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-25" />
          <div className="absolute -inset-4 rounded-full border border-dashed border-cyan-500/30 animate-spin opacity-40" />

          <div className="flex flex-col items-center justify-center text-center p-2">
            <Brain className="w-10 h-10 text-cyan-300 animate-pulse mb-1" />
            <span className="text-xs font-bold text-white tracking-wider">DeepBrain</span>
            <span className="text-[10px] text-cyan-400 font-mono">推理协同中心</span>
          </div>
        </div>

        {/* Floating Algorithm Family Nodes (Surrounding Orb Layout) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {families.map((family, idx) => {
            // Position around circle
            const total = families.length;
            const angle = (idx * (360 / total) - 90) * (Math.PI / 180);
            const radius = 135; // px distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const isHovered = hoveredId === family.id;

            return (
              <div
                key={family.id}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                onMouseEnter={() => setHoveredId(family.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectFamily(family)}
                className="absolute pointer-events-auto cursor-pointer group"
              >
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-xl ${
                    isHovered
                      ? 'bg-cyan-950 border-cyan-400 scale-110 z-30 shadow-cyan-500/30'
                      : 'bg-slate-950/90 border-slate-800 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {getFamilyIcon(family.id)}
                  </div>
                  <div className="text-left whitespace-nowrap">
                    <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
                      {family.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      准确率 <span className="text-emerald-400 font-bold">{family.accuracy}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Banner */}
      <div className="relative z-10 border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          知识图谱关联规则: <span className="font-mono text-white font-bold">5,423 条</span>
        </span>
        <button
          onClick={() => onSelectFamily(families[0])}
          className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-xs transition-colors"
        >
          <span>算法族大地图</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
