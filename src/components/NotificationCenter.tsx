import React, { useState } from 'react';
import { NotificationItem } from '../types/aiops';
import { Bell, Search, AlertOctagon, CheckCircle, Clock, Sparkles, Filter } from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onDiagnoseItem?: (item: NotificationItem) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDiagnoseItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filtered = notifications.filter((item) => {
    const matchesSearch =
      item.deviceCode.includes(searchTerm) ||
      item.location.includes(searchTerm) ||
      item.contentType.includes(searchTerm);
    const matchesLevel = filterLevel === 'ALL' || item.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (level: 'P1' | 'P2' | 'P3') => {
    switch (level) {
      case 'P1':
        return (
          <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800/60 px-1.5 py-0.5 rounded font-mono">
            P1 紧急
          </span>
        );
      case 'P2':
        return (
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.5 rounded font-mono">
            P2 重要
          </span>
        );
      case 'P3':
        return (
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.5 rounded font-mono">
            P3 一般
          </span>
        );
    }
  };

  const getStatusBadge = (status: 'pending' | 'diagnosing' | 'resolved') => {
    switch (status) {
      case 'pending':
        return (
          <span className="text-[10px] text-amber-400 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            待处理
          </span>
        );
      case 'diagnosing':
        return (
          <span className="text-[10px] text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" />
            诊断中
          </span>
        );
      case 'resolved':
        return (
          <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            已收敛
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 lg:p-5 backdrop-blur-md flex flex-col justify-between h-full min-h-[380px]">
      {/* Header & Filter Controls */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            通知中心 (实时告警事件)
          </h3>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索设备/位置/类型..."
                className="bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-2.5 py-1 focus:outline-none focus:border-cyan-500 w-32 sm:w-40"
              />
            </div>

            {/* Level Selector */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">全部级别</option>
              <option value="P1">P1 紧急</option>
              <option value="P2">P2 重要</option>
              <option value="P3">P3 一般</option>
            </select>
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto max-h-[280px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-950 text-slate-400 font-medium border-b border-slate-800/80 text-[11px]">
              <tr>
                <th className="py-2 px-2.5">设备编号</th>
                <th className="py-2 px-2.5">属地信息</th>
                <th className="py-2 px-2.5">告警时间</th>
                <th className="py-2 px-2.5">告警类型</th>
                <th className="py-2 px-2.5">状态/级别</th>
                <th className="py-2 px-2.5 text-right">诊断</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-2 px-2.5 font-mono text-cyan-300 font-bold whitespace-nowrap">
                    {item.deviceCode}
                  </td>
                  <td className="py-2 px-2.5 text-slate-300 whitespace-nowrap">
                    {item.location}
                  </td>
                  <td className="py-2 px-2.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="py-2 px-2.5 whitespace-nowrap">
                    <span className="text-slate-200 font-medium">{item.contentType}</span>
                  </td>
                  <td className="py-2 px-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {getLevelBadge(item.level)}
                      {getStatusBadge(item.status)}
                    </div>
                  </td>
                  <td className="py-2 px-2.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onDiagnoseItem && onDiagnoseItem(item)}
                      className="px-2 py-0.5 text-[11px] font-medium rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 transition-colors inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>诊断</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer stats */}
      <div className="border-t border-slate-800/80 pt-2.5 mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>已显示 {filtered.length} 条记录</span>
        <span className="font-mono text-cyan-400">24h 告警消除率: 98.2%</span>
      </div>
    </div>
  );
};
