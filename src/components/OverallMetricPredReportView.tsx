import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Layers,
  Sparkles,
  TrendingUp,
  Search,
  RotateCcw,
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface OverallMetricPredReportViewProps {
  onNavigate?: (subView: string) => void;
}

// 主机CPU利用率时序推演数据 (近期 2026-10-16)
const CPU_METRIC_SERIES = [
  { time: '12:55:00', actual: 28, predict: 30, upper: 52, lower: 0 },
  { time: '13:00:00', actual: 32, predict: 34, upper: 53, lower: 0 },
  { time: '13:05:00', actual: 35, predict: 36, upper: 54, lower: 0 },
  { time: '13:10:00', actual: 34, predict: 35, upper: 55, lower: 0 },
  { time: '13:15:00', actual: 32, predict: 33, upper: 55, lower: 0 },
  { time: '13:20:00', actual: 28, predict: 30, upper: 56, lower: 0 },
  { time: '13:25:00', actual: 48, predict: 35, upper: 57, lower: 0 },
  { time: '13:30:00', actual: 82, predict: 40, upper: 58, lower: 0 }, // Outlier Peak
  { time: '13:35:00', actual: 68, predict: 38, upper: 58, lower: 0 },
  { time: '13:40:00', actual: 42, predict: 32, upper: 57, lower: 0 },
  { time: '13:45:00', actual: 26, predict: 28, upper: 56, lower: 0 },
  { time: '13:50:00', actual: 20, predict: 24, upper: 55, lower: 0 },
  { time: '13:55:00', actual: 16, predict: 22, upper: 55, lower: 0 },
  { time: '14:00:00', actual: 20, predict: 25, upper: 56, lower: 0 },
  { time: '14:05:00', actual: 28, predict: 30, upper: 57, lower: 0 },
  { time: '14:10:00', actual: 32, predict: 34, upper: 58, lower: 0 },
  { time: '14:15:00', actual: 36, predict: 38, upper: 59, lower: 0 },
  { time: '14:20:00', actual: 38, predict: 40, upper: 59, lower: 0 },
  { time: '14:25:00', actual: 40, predict: 42, upper: 60, lower: 0 },
  { time: '14:30:00', actual: 61, predict: 38, upper: 59, lower: 0 },
];

// 主机内存利用率时序推演数据 (近期 2026-10-16)
const MEM_METRIC_SERIES = [
  { time: '12:55:00', actual: 30, predict: 32, upper: 55, lower: 0 },
  { time: '13:00:00', actual: 34, predict: 35, upper: 56, lower: 0 },
  { time: '13:05:00', actual: 38, predict: 38, upper: 56, lower: 0 },
  { time: '13:10:00', actual: 36, predict: 37, upper: 57, lower: 0 },
  { time: '13:15:00', actual: 35, predict: 36, upper: 57, lower: 0 },
  { time: '13:20:00', actual: 30, predict: 32, upper: 58, lower: 0 },
  { time: '13:25:00', actual: 52, predict: 38, upper: 59, lower: 0 },
  { time: '13:30:00', actual: 88, predict: 45, upper: 60, lower: 0 }, // Outlier Peak
  { time: '13:35:00', actual: 72, predict: 42, upper: 60, lower: 0 },
  { time: '13:40:00', actual: 48, predict: 35, upper: 59, lower: 0 },
  { time: '13:45:00', actual: 30, predict: 30, upper: 58, lower: 0 },
  { time: '13:50:00', actual: 22, predict: 26, upper: 57, lower: 0 },
  { time: '13:55:00', actual: 18, predict: 24, upper: 56, lower: 0 },
  { time: '14:00:00', actual: 22, predict: 28, upper: 57, lower: 0 },
  { time: '14:05:00', actual: 30, predict: 32, upper: 58, lower: 0 },
  { time: '14:10:00', actual: 35, predict: 36, upper: 59, lower: 0 },
  { time: '14:15:00', actual: 38, predict: 40, upper: 60, lower: 0 },
  { time: '14:20:00', actual: 42, predict: 42, upper: 60, lower: 0 },
  { time: '14:25:00', actual: 45, predict: 44, upper: 61, lower: 0 },
  { time: '14:30:00', actual: 68, predict: 40, upper: 60, lower: 0 },
];

// 预警列表数据 (严格按时间降序排列，近期 2026-10-16)
const OVERALL_PRED_ALERTS = [
  {
    seq: 1,
    checkTime: '2026-10-16 14:30:00',
    predTime: '2026-10-16 14:30:00',
    level: '低级告警',
    title: '超限非告警',
    body: '当前资源使用率低于设定下限，属于多指标小幅震荡',
    predictVal: '38%',
    upperVal: '59%',
    lowerVal: '0%',
  },
  {
    seq: 2,
    checkTime: '2026-10-16 13:30:00',
    predTime: '2026-10-16 13:30:00',
    level: '中级告警',
    title: '内存爆满',
    body: '物理内存与Swap区占用同步攀升至 88%，触发协同预警上限',
    predictVal: '40%',
    upperVal: '58%',
    lowerVal: '0%',
  },
  {
    seq: 3,
    checkTime: '2026-10-16 12:15:00',
    predTime: '2026-10-16 12:15:00',
    level: '高级告警',
    title: '多指标协同过载',
    body: 'CPU利用率 (82%) 与磁盘I/O写延迟 (48ms) 联动离群，预测系统响应陡降',
    predictVal: '82%',
    upperVal: '65%',
    lowerVal: '10%',
  },
  {
    seq: 4,
    checkTime: '2026-10-16 11:00:00',
    predTime: '2026-10-16 11:00:00',
    level: '重大告警',
    title: '算力与I/O双过载',
    body: 'CPU使用率与网络Rx丢包率连续 3 个周期越界，预计未来 1.5 小时引发服务熔断',
    predictVal: '91%',
    upperVal: '72%',
    lowerVal: '12%',
  },
  {
    seq: 5,
    checkTime: '2026-10-16 09:45:00',
    predTime: '2026-10-16 09:45:00',
    level: '低级告警',
    title: '轻微波动离群',
    body: '计算与存储负载在置信包络线内交替回归',
    predictVal: '25%',
    upperVal: '52%',
    lowerVal: '0%',
  },
];

export const OverallMetricPredReportView: React.FC<OverallMetricPredReportViewProps> = ({ onNavigate }) => {
  // Selected metrics to show
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    '主机CPU利用率',
    '主机内存利用率',
  ]);

  const [startTime, setStartTime] = useState('2026-10-16 00:00:00');
  const [endTime, setEndTime] = useState('2026-10-16 16:30:00');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleMetric = (m: string) => {
    if (selectedMetrics.includes(m)) {
      if (selectedMetrics.length === 1) {
        showToast('请至少保留一个预测指标展示');
        return;
      }
      setSelectedMetrics(selectedMetrics.filter((x) => x !== m));
    } else {
      setSelectedMetrics([...selectedMetrics, m]);
    }
  };

  return (
    <div className="w-full bg-[#0b0f19] text-slate-200 min-h-[calc(100vh-120px)] flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-sky-500/90 border border-sky-400 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Content Container: ▶ 多指标异常检测报告 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-sky-400 text-sm">▶</span>
            <span>多指标异常检测报告</span>
          </h2>
        </div>

        {/* Section 1: 设备整体预测指标 (Matches Screenshot 1) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="font-bold text-white font-sans text-sm border-b border-slate-800 pb-2">设备整体预测指标</div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="text-slate-400 font-sans">指标名称：</span>
            <span className="text-sky-300 font-bold font-sans">主机CPU利用率，主机内存利用率</span>
          </div>
        </div>

        {/* Section 2: 检测对象 (Matches Screenshot 1) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="font-bold text-white font-sans text-sm border-b border-slate-800 pb-2">检测对象</div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 font-sans">主机序列号：</span>
              <span className="text-sky-400 font-bold ml-1 hover:underline cursor-pointer">SN-46567</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans">管理IP地址：</span>
              <span className="text-cyan-400 font-bold ml-1 hover:underline cursor-pointer">220.10.51.15</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans">业务IP地址：</span>
              <span className="text-cyan-400 font-bold ml-1 hover:underline cursor-pointer">220.10.51.15</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans">设备类型：</span>
              <span className="text-slate-200 ml-1">server</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans">设备名称：</span>
              <span className="text-sky-300 font-bold ml-1">PC-001</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans">系统信息：</span>
              <span className="text-slate-200 ml-1">Linux 78.6.0.0</span>
            </div>
          </div>
        </div>

        {/* Section 3: 预警列表 (Matches Screenshot 1) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>预警列表</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">排序规则: 按预警时间降序排列</span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/80">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
                  <th className="py-3 px-3 w-14 text-center">序号</th>
                  <th className="py-3 px-3 w-40">检测时间</th>
                  <th className="py-3 px-3 w-40">预警时间</th>
                  <th className="py-3 px-3 w-24">预警级别</th>
                  <th className="py-3 px-3 w-36">预警标题</th>
                  <th className="py-3 px-3">预警正文</th>
                  <th className="py-3 px-3 w-20 text-center">预测值</th>
                  <th className="py-3 px-3 w-20 text-center">上限</th>
                  <th className="py-3 px-3 w-20 text-center">下限</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {OVERALL_PRED_ALERTS.map((row) => (
                  <tr key={row.seq} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-3 text-slate-400 text-center">{row.seq}</td>
                    <td className="py-3.5 px-3 text-slate-300">{row.checkTime}</td>
                    {/* CRITICAL USER REQUIREMENT: 预警时间降序排列，近期 2026-10-16 */}
                    <td className="py-3.5 px-3 text-sky-400 font-bold">{row.predTime}</td>
                    <td className="py-3.5 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.level === '重大告警'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : row.level === '高级告警'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : row.level === '中级告警'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {row.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white font-sans">{row.title}</td>
                    <td className="py-3.5 px-3 font-sans text-slate-300 leading-relaxed text-[11px]">
                      {row.body}
                    </td>
                    <td className="py-3.5 px-3 text-center text-cyan-300 font-bold">{row.predictVal}</td>
                    <td className="py-3.5 px-3 text-center text-rose-400">{row.upperVal}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{row.lowerVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: AI整体指标预测看板 (Matches Screenshot 2) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2">
            <div className="font-bold text-white font-sans text-sm">AI整体指标预测看板</div>
            <div className="text-sky-400">
              最新预测点时间：<strong className="text-white font-mono">2026-10-16 09:30:23</strong>
            </div>
          </div>

          {/* Filter / Toggle Bar */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-400 font-sans font-medium">显示预测指标：</span>
              {[
                '主机CPU利用率',
                '主机内存利用率',
                '主机CPU iowait时间占比',
                '主机CPU iowait状态占比',
              ].map((m) => {
                const isSelected = selectedMetrics.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => toggleMetric(m)}
                    className={`px-3 py-1 rounded-lg transition-colors font-sans text-xs ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 font-sans font-medium">查询监控周期：</span>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="请输入起始时间"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-slate-200 text-xs w-44 focus:outline-none focus:border-sky-500 font-mono"
              />
              <span className="text-slate-500">——</span>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="请输入结束时间"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-slate-200 text-xs w-44 focus:outline-none focus:border-sky-500 font-mono"
              />

              <button
                onClick={() => showToast('已成功刷新AI整体指标预测曲线看板')}
                className="px-5 py-1 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg transition-colors text-xs ml-2"
              >
                查询
              </button>
              <button
                onClick={() => {
                  setStartTime('2026-10-16 00:00:00');
                  setEndTime('2026-10-16 16:30:00');
                  showToast('已重置整体指标查询范围');
                }}
                className="px-5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors text-xs"
              >
                重置
              </button>
            </div>
          </div>

          {/* Side-by-side Dual Charts View (Matches Screenshot 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: 主机CPU利用率 */}
            {selectedMetrics.includes('主机CPU利用率') && (
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold font-sans text-xs">主机CPU利用率</span>
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-sky-400">
                      <span className="w-2.5 h-2 bg-sky-500/20 border border-sky-400/50 inline-block rounded" /> 动态区间
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="w-2.5 h-0.5 bg-slate-400 stroke-dashed inline-block" /> 预测值
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 font-bold">
                      <span className="w-2.5 h-0.5 bg-blue-500 inline-block" /> 实际值
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={CPU_METRIC_SERIES}>
                      <defs>
                        <linearGradient id="gradCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-[11px] font-mono space-y-1">
                                <div className="text-slate-300 font-bold border-b border-slate-800 pb-1">
                                  2026-10-16 {label}
                                </div>
                                <div className="text-blue-400 font-bold">实际值: {d.actual}%</div>
                                <div className="text-slate-300">预测值: {d.predict}%</div>
                                <div className="text-sky-300">上限值: {d.upper}%</div>
                                <div className="text-slate-400">下限值: {d.lower}%</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="upper" stroke="none" fill="url(#gradCpu)" name="动态区间" />
                      <Line type="monotone" dataKey="predict" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="预测值" />
                      <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} name="实际值" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Chart 2: 主机内存利用率 */}
            {selectedMetrics.includes('主机内存利用率') && (
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold font-sans text-xs">主机内存利用率</span>
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-sky-400">
                      <span className="w-2.5 h-2 bg-sky-500/20 border border-sky-400/50 inline-block rounded" /> 动态区间
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="w-2.5 h-0.5 bg-slate-400 stroke-dashed inline-block" /> 预测值
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 font-bold">
                      <span className="w-2.5 h-0.5 bg-blue-500 inline-block" /> 实际值
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={MEM_METRIC_SERIES}>
                      <defs>
                        <linearGradient id="gradMem" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-[11px] font-mono space-y-1">
                                <div className="text-slate-300 font-bold border-b border-slate-800 pb-1">
                                  2026-10-16 {label}
                                </div>
                                <div className="text-blue-400 font-bold">实际值: {d.actual}%</div>
                                <div className="text-slate-300">预测值: {d.predict}%</div>
                                <div className="text-sky-300">上限值: {d.upper}%</div>
                                <div className="text-slate-400">下限值: {d.lower}%</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="upper" stroke="none" fill="url(#gradMem)" name="动态区间" />
                      <Line type="monotone" dataKey="predict" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="预测值" />
                      <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} name="实际值" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-mono pt-1 text-left">
            默认1小时过去，5小时未来
          </div>
        </div>
      </div>
    </div>
  );
};
