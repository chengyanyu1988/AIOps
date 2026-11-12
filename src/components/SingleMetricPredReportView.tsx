import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Calendar,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu,
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
  Legend,
} from 'recharts';

interface SingleMetricPredReportViewProps {
  onNavigate?: (subView: string) => void;
}

// 动态阈值拟合包络线数据 (近期 2026-10-16)
const DYNAMIC_ENVELOPE_SERIES = [
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

// 预警列表数据 (严格按时间降序排列，近期 2026-10-16)
const INITIAL_PRED_ALERTS = [
  {
    seq: 1,
    checkTime: '2026-10-16 14:30:00',
    predTime: '2026-10-16 14:30:00',
    level: '低级告警',
    title: '超限非告警',
    body: '当前资源使用率低于设定下限，属于基线轻微下偏移离群',
    predictVal: '38%',
    upperVal: '59%',
    lowerVal: '0%',
  },
  {
    seq: 2,
    checkTime: '2026-10-16 13:30:00',
    predTime: '2026-10-16 13:30:00',
    level: '中级告警',
    title: '警告告警',
    body: '当前资源使用率超过设定上限，实际突破至 82%，超过基线上限 24%',
    predictVal: '40%',
    upperVal: '58%',
    lowerVal: '0%',
  },
  {
    seq: 3,
    checkTime: '2026-10-16 12:15:00',
    predTime: '2026-10-16 12:15:00',
    level: '高级告警',
    title: 'CPU计算突发峰值离群',
    body: '密集批处理作业触发多核软中断突增，预测拐点提前 15 分钟召回',
    predictVal: '75%',
    upperVal: '62%',
    lowerVal: '10%',
  },
  {
    seq: 4,
    checkTime: '2026-10-16 11:00:00',
    predTime: '2026-10-16 11:00:00',
    level: '重大告警',
    title: '主机算力持续过载预警',
    body: 'CPU使用率已连续 3 个采集周期逼近 95%，预测未来 2 小时将产生线程阻塞锁死',
    predictVal: '92%',
    upperVal: '70%',
    lowerVal: '15%',
  },
  {
    seq: 5,
    checkTime: '2026-10-16 09:45:00',
    predTime: '2026-10-16 09:45:00',
    level: '低级告警',
    title: '网络子接口I/O队列平缓包络',
    body: '网络收发包速率在置信区间内小幅震荡，无系统故障风险',
    predictVal: '28%',
    upperVal: '55%',
    lowerVal: '5%',
  },
  {
    seq: 6,
    checkTime: '2026-10-15 22:30:00',
    predTime: '2026-10-15 22:30:00',
    level: '中级告警',
    title: '内存Swap频繁交换离群',
    body: '交换区使用率持续上升，预测老年代回收停顿增长 1.8 秒',
    predictVal: '68%',
    upperVal: '50%',
    lowerVal: '0%',
  },
];

export const SingleMetricPredReportView: React.FC<SingleMetricPredReportViewProps> = ({ onNavigate }) => {
  // Filter bar states
  const [metricOption, setMetricOption] = useState('主机cpu利用率');
  const [subDevice, setSubDevice] = useState('GE 1/1/1');
  const [period, setPeriod] = useState('近7天');
  const [startTime, setStartTime] = useState('2026-10-09 00:00:00');
  const [endTime, setEndTime] = useState('2026-10-16 16:30:00');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSearch = () => {
    showToast(`已成功更新【${metricOption} / ${subDevice}】的单指标预测报告`);
  };

  const handleReset = () => {
    setMetricOption('主机cpu利用率');
    setSubDevice('GE 1/1/1');
    setPeriod('近7天');
    setStartTime('2026-10-09 00:00:00');
    setEndTime('2026-10-16 16:30:00');
    showToast('已重置单指标筛选条件');
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

      {/* Top Filter Bar (Matches Screenshot 1) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">统计指标：</span>
              <select
                value={metricOption}
                onChange={(e) => setMetricOption(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="主机cpu利用率">主机cpu利用率</option>
                <option value="主机内存利用率">主机内存利用率</option>
                <option value="磁盘I/O读写速率">磁盘I/O读写速率</option>
                <option value="网络接口丢包率">网络接口丢包率</option>
              </select>

              <select
                value={subDevice}
                onChange={(e) => setSubDevice(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="GE 1/1/1">GE 1/1/1</option>
                <option value="GE 1/1/2">GE 1/1/2</option>
                <option value="eth0">eth0</option>
                <option value="sdb1">sdb1</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">统计周期：</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="近24小时">近24小时</option>
                <option value="近3天">近3天</option>
                <option value="近7天">近7天</option>
                <option value="近30天">近30天</option>
              </select>

              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="请输入起始时间"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs w-44 focus:outline-none focus:border-sky-500 font-mono"
              />
              <span className="text-slate-500">——</span>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="请输入结束时间"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs w-44 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSearch}
              className="px-5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
            >
              查询
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors text-xs"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container: ▶ 动态阈值报告 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-sky-400 text-sm">▶</span>
            <span>动态阈值报告</span>
          </h2>
        </div>

        {/* Card 1: 检测对象 (Matches Screenshot 1) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="font-bold text-white font-sans text-sm border-b border-slate-800 pb-2">检测对象</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
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
            <div>
              <span className="text-slate-400 font-sans">子设备名称：</span>
              <span className="text-sky-300 font-bold ml-1">GE 1/1/1</span>
            </div>
          </div>
        </div>

        {/* Card 2: AI模型 (Matches Screenshot 1) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="font-bold text-white font-sans text-sm border-b border-slate-800 pb-2">AI模型</div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 font-sans">模型ID：</span>
                <span className="text-slate-200 ml-1">sn-190001</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">模型工程名称：</span>
                <span className="text-slate-200 ml-1">时序异常预测</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">算法名称：</span>
                <span className="text-sky-300 font-bold ml-1">Prophet-V2 + 线性回归</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">评价方法：</span>
                <span className="text-slate-200 ml-1">AUC</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">问题类型：</span>
                <span className="text-slate-200 ml-1">异常检测</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">数据类型：</span>
                <span className="text-slate-200 ml-1">时间序列</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">数据特征：</span>
                <span className="text-slate-200 ml-1">周期型</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">样本数量：</span>
                <span className="text-white font-bold ml-1">35100</span>
              </div>
            </div>

            {/* Training History Rows */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex flex-wrap items-center justify-between text-slate-400">
                <span>首次训练时间：<strong className="text-slate-200">2026-03-15 13:15:30</strong></span>
                <span>训练时长：<strong className="text-slate-200">3day23hours</strong></span>
                <span>训练结果：<strong className="text-rose-400 font-bold">失败</strong></span>
                <span>Score：<strong className="text-slate-200">0.63</strong></span>
              </div>
              <div className="flex flex-wrap items-center justify-between text-slate-400">
                <span>上次训练时间：<strong className="text-slate-200">2026-10-03 13:15:30</strong></span>
                <span>训练时长：<strong className="text-slate-200">23hours</strong></span>
                <span>训练结果：<strong className="text-emerald-400 font-bold">成功</strong></span>
                <span>Score：<strong className="text-emerald-300 font-bold">0.77</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: AI预测看板 & 动态包络线图表 (Matches Screenshot 1 & 2) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2">
            <div className="font-bold text-white font-sans text-sm">AI预测看板</div>
            <div className="text-sky-400">
              最近预测时间：<strong className="text-white font-mono">2026-10-16 23:59:59</strong>
            </div>
          </div>

          {/* Dynamic Envelope Recharts Chart */}
          <div className="h-80 w-full bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-end gap-6 text-[11px] mb-2 font-mono">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-2 bg-sky-500/20 border border-sky-400/50 inline-block rounded" /> 动态区间
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 bg-slate-400 stroke-dashed inline-block" /> 预测值
              </span>
              <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span className="w-3 h-0.5 bg-blue-500 inline-block" /> 实际值
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={DYNAMIC_ENVELOPE_SERIES}>
                  <defs>
                    <linearGradient id="gradUpper" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1">
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
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#gradUpper)" name="动态区间" />
                  <Line type="monotone" dataKey="predict" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="预测值" />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} name="实际值" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION: 预警列表 (只呈现预警信息，过期删掉) (Matches Screenshot 3) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>预警列表 (只呈现预警信息，过期删掉)</span>
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
                {INITIAL_PRED_ALERTS.map((row) => (
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
      </div>
    </div>
  );
};
