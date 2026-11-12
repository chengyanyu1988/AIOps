import React from 'react';
import { ModelCategoryItem } from '../types/aiops';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface ModelDistributionDonutProps {
  categories: ModelCategoryItem[];
  totalModels: number;
}

export const ModelDistributionDonut: React.FC<ModelDistributionDonutProps> = ({
  categories,
  totalModels,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 lg:p-5 backdrop-blur-md flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-cyan-400" />
          启用模型分类
        </h3>
        <span className="text-[11px] font-mono text-slate-400">TOTAL: {totalModels.toLocaleString()}</span>
      </div>

      {/* Chart Section */}
      <div className="relative h-56 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="count"
              nameKey="name"
            >
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ModelCategoryItem;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs">
                      <div className="font-semibold text-white flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                        {data.name}
                      </div>
                      <div className="text-slate-300 font-mono">
                        数量: <span className="font-bold text-cyan-400">{data.count.toLocaleString()}</span>
                      </div>
                      <div className="text-slate-400 font-mono">
                        占比: <span className="font-bold text-white">{data.percentage}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-400 font-medium">启用模型总数</span>
          <span className="text-lg font-extrabold text-white font-mono tabular-nums">
            {totalModels.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3 text-xs">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between gap-1 p-1.5 rounded-lg bg-slate-950/40">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-slate-300 truncate">{cat.name}</span>
            </div>
            <span className="font-mono text-slate-400 font-bold shrink-0">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
