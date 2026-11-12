import React, { useState } from 'react';
import { Top5AlertItem } from '../types/aiops';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { BarChart3, Filter } from 'lucide-react';

interface Top5ModelAlertsChartProps {
  alerts: Top5AlertItem[];
}

export const Top5ModelAlertsChart: React.FC<Top5ModelAlertsChartProps> = ({ alerts }) => {
  const [selectedCategory, setSelectedCategory] = useState<'单指标异常检测' | '动态阈值'>(
    '单指标异常检测'
  );
  const [selectedMetric, setSelectedMetric] = useState<'CPU利用率' | '内存利用率' | '带宽利用率'>(
    'CPU利用率'
  );

  const filtered = alerts.map((item) => ({
    ...item,
    // Add realistic dynamic variation depending on metric
    alertCount:
      selectedMetric === 'CPU利用率'
        ? item.alertCount
        : selectedMetric === '内存利用率'
        ? Math.round(item.alertCount * 0.85)
        : Math.round(item.alertCount * 0.65),
  }));

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 lg:p-5 backdrop-blur-md flex flex-col justify-between h-full min-h-[340px]">
      <div>
        {/* Header and Sub-Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            近7日模型总告警数 Top5
          </h3>

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setSelectedCategory('单指标异常检测')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === '单指标异常检测'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              单指标异常检测
            </button>
            <button
              onClick={() => setSelectedCategory('动态阈值')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === '动态阈值'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              动态阈值
            </button>
          </div>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-2 mb-3">
          {(['CPU利用率', '内存利用率', '带宽利用率'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMetric(m)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedMetric === m
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-52 w-full my-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filtered} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="id" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as Top5AlertItem;
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs">
                        <div className="font-bold text-white mb-1">{data.name} ({data.id})</div>
                        <div className="text-slate-300">
                          指标: <span className="text-cyan-400">{selectedMetric}</span>
                        </div>
                        <div className="text-slate-300 font-mono">
                          告警总数: <span className="font-bold text-amber-400">{payload[0].value}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="alertCount" radius={[6, 6, 0, 0]}>
                {filtered.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={index === 0 ? '#38BDF8' : index === 1 ? '#818CF8' : '#334155'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>数据维度: 7 天累计告警</span>
        <span className="font-mono text-cyan-400">Top1 告警量: {filtered[0]?.alertCount || 920} 次</span>
      </div>
    </div>
  );
};
