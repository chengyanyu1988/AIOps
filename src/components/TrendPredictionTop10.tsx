import React, { useState } from 'react';
import { TrendPredictionItem } from '../types/aiops';
import { TrendingUp, ShieldAlert, Cpu, Filter, ChevronRight } from 'lucide-react';

interface TrendPredictionTop10Props {
  predictions: TrendPredictionItem[];
  onSelectPrediction?: (item: TrendPredictionItem) => void;
}

export const TrendPredictionTop10: React.FC<TrendPredictionTop10Props> = ({
  predictions,
  onSelectPrediction,
}) => {
  const [activeType, setActiveType] = useState<'fault' | 'capacity' | 'performance'>('fault');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', '交换机', '路由器', '防火墙', '负载均衡', 'SDN'];

  const filtered = predictions.filter((item) => {
    const matchesType = item.predictionType === activeType;
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 lg:p-5 backdrop-blur-md flex flex-col justify-between h-full min-h-[380px]">
      <div>
        {/* Title and Prediction Type Sub-Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            智能趋势预测 Top10
          </h3>

          {/* Type Sub-Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveType('fault')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeType === 'fault'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              网络故障预测
            </button>
            <button
              onClick={() => setActiveType('capacity')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeType === 'capacity'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              网络容量预测
            </button>
            <button
              onClick={() => setActiveType('performance')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeType === 'performance'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              网络性能预测
            </button>
          </div>
        </div>

        {/* Device Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-800/60">
          <span className="text-[11px] text-slate-500 font-medium shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            分类:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 text-xs font-medium rounded-md transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? '全部分类' : cat}
            </button>
          ))}
        </div>

        {/* Prediction Risk List */}
        <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectPrediction && onSelectPrediction(item)}
              className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/50 transition-colors cursor-pointer group"
            >
              {/* Rank & Device */}
              <div className="flex items-center gap-2.5 min-w-[140px]">
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold font-mono ${
                    idx < 3
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 block">
                    {item.deviceName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.ip}</span>
                </div>
              </div>

              {/* Category Tag */}
              <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 hidden sm:inline">
                {item.category}
              </span>

              {/* Risk Bar */}
              <div className="flex items-center gap-2 flex-1 max-w-[160px]">
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.riskPercent >= 80
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                    }`}
                    style={{ width: `${item.riskPercent}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-bold font-mono min-w-[35px] text-right ${
                    item.riskPercent >= 80 ? 'text-amber-400' : 'text-cyan-400'
                  }`}
                >
                  {item.riskPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/80 pt-2.5 mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>基于 Transformer-TS 时序算法</span>
        <span className="text-cyan-400">提前 4 小时深度预警</span>
      </div>
    </div>
  );
};
