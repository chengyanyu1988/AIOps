import React from 'react';
import { ClassifiedTrendPoint } from '../types/aiops';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface ClassifiedModelAlertsTrendProps {
  data: ClassifiedTrendPoint[];
}

export const ClassifiedModelAlertsTrend: React.FC<ClassifiedModelAlertsTrendProps> = ({
  data,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 lg:p-5 backdrop-blur-md flex flex-col justify-between h-full min-h-[340px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            近7日分类模型告警数 (趋势演变)
          </h3>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              异常检测模型告警
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              回归预测模型告警
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-56 w-full my-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRegression" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs">
                        <div className="font-bold text-white mb-1">日期: {label}</div>
                        <div className="text-amber-400 font-mono">
                          异常检测模型告警: <span className="font-bold">{payload[0].value}</span>
                        </div>
                        <div className="text-rose-400 font-mono">
                          回归预测模型告警: <span className="font-bold">{payload[1].value}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="anomalyAlerts"
                name="异常检测模型告警"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAnomaly)"
              />
              <Area
                type="monotone"
                dataKey="regressionAlerts"
                name="回归预测模型告警"
                stroke="#F43F5E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRegression)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>峰值告警日: 4.5 (8次)</span>
        <span className="font-mono text-emerald-400">告警收敛率: 95.68%</span>
      </div>
    </div>
  );
};
