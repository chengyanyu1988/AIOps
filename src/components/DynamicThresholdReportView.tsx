import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Activity,
  Calendar,
  Layers,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface AlertRecord {
  id: number;
  checkTime: string;
  alertTime: string;
  exceedDegree: string;
  exceedType: string;
  alertLevel: '低级告警' | '中级告警' | '高级告警' | '重大告警';
  alertTitle: string;
  alertBody: string;
  actualVal: string;
  predVal: string;
  upperVal: string;
  lowerVal: string;
}

const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: 1,
    checkTime: '2026-10-16 14:30:00',
    alertTime: '2026-10-16 14:30:00',
    exceedDegree: '0%-30%',
    exceedType: '超下限',
    alertLevel: '低级告警',
    alertTitle: '超限非告警',
    alertBody: '当前资源使用率低于设定下限',
    actualVal: '61%',
    predVal: '38%',
    upperVal: '59%',
    lowerVal: '0%',
  },
  {
    id: 2,
    checkTime: '2026-10-16 13:30:00',
    alertTime: '2026-10-16 13:30:00',
    exceedDegree: '30%-50%',
    exceedType: '超上限',
    alertLevel: '中级告警',
    alertTitle: '警告告警',
    alertBody: '当前资源使用率超过设定上限',
    actualVal: '82%',
    predVal: '40%',
    upperVal: '58%',
    lowerVal: '0%',
  },
  {
    id: 3,
    checkTime: '2026-10-16 12:30:00',
    alertTime: '2026-10-16 12:30:00',
    exceedDegree: '50%-100%',
    exceedType: '超上限',
    alertLevel: '高级告警',
    alertTitle: '资源使用率过高',
    alertBody: '当前资源使用率显著高于正常范围',
    actualVal: '120%',
    predVal: '50%',
    upperVal: '60%',
    lowerVal: '0%',
  },
  {
    id: 4,
    checkTime: '2026-10-16 11:15:00',
    alertTime: '2026-10-16 11:15:00',
    exceedDegree: '30%-50%',
    exceedType: '超上限',
    alertLevel: '中级告警',
    alertTitle: '警告告警',
    alertBody: 'CPU计算突发峰值离群',
    actualVal: '78%',
    predVal: '42%',
    upperVal: '58%',
    lowerVal: '0%',
  },
  {
    id: 5,
    checkTime: '2026-10-16 09:45:00',
    alertTime: '2026-10-16 09:45:00',
    exceedDegree: '0%-30%',
    exceedType: '超下限',
    alertLevel: '低级告警',
    alertTitle: '轻微偏离',
    alertBody: 'IO Wait 偏离参考包络线',
    actualVal: '11%',
    predVal: '25%',
    upperVal: '55%',
    lowerVal: '12%',
  },
];

export const DynamicThresholdReportView: React.FC = () => {
  // Top filter states
  const [metric, setMetric] = useState('主机cpu利用率');
  const [subDevice, setSubDevice] = useState('GE 1/1/1');
  const [period, setPeriod] = useState('近7天');
  const [startDate, setStartDate] = useState('2026-10-09');
  const [endDate, setEndDate] = useState('2026-10-16');

  // Interactive Chart Tooltip
  const [hoverPoint, setHoverPoint] = useState<{
    time: string;
    actual: string;
    baseline: string;
    upper: string;
    lower: string;
    isBreach: boolean;
    x: number;
    y: number;
  } | null>({
    time: '2026-10-16 13:30:00',
    actual: '82%',
    baseline: '40%',
    upper: '58%',
    lower: '0%',
    isBreach: true,
    x: 350,
    y: 80,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSearch = () => {
    setToastMessage(`已查询【${metric} / ${subDevice}】在 ${period} 范围内的动态阈值报告`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    setMetric('主机cpu利用率');
    setSubDevice('GE 1/1/1');
    setPeriod('近7天');
    setStartDate('2026-10-09');
    setEndDate('2026-10-16');
    setToastMessage('已重置筛选条件');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>动态阈值报告</span>
        </h2>
        <div className="text-xs text-slate-400 font-mono">
          控制台数据实时同步：<strong className="text-cyan-400 font-bold">2026-10-16</strong>
        </div>
      </div>

      {/* Top Form Filter Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-medium">统计指标:</span>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="主机cpu利用率">主机cpu利用率</option>
            <option value="内存利用率">内存利用率</option>
            <option value="磁盘IO读写速率">磁盘IO读写速率</option>
            <option value="网络接口丢包率">网络接口丢包率</option>
          </select>
          <select
            value={subDevice}
            onChange={(e) => setSubDevice(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="GE 1/1/1">GE 1/1/1</option>
            <option value="GE 1/1/2">GE 1/1/2</option>
            <option value="XGE 2/0/1">XGE 2/0/1</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-medium">统计周期:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="近3天">近3天</option>
            <option value="近7天">近7天</option>
            <option value="近30天">近30天</option>
          </select>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          />
          <span className="text-slate-500">—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleSearch}
            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-sky-500/20 flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700/80 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* ===================== SECTION 1: 动态阈值报告 -> 检测统计 ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-l-4 border-cyan-400 pl-3">
          <h3 className="text-xs font-bold text-cyan-400">▶ 动态阈值报告</h3>
          <Layers className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-pointer" />
        </div>

        <div className="pt-2 text-xs font-bold text-white">检测统计</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left summary counter */}
          <div className="lg:col-span-3 space-y-2 border-r border-slate-800/80 pr-6">
            <div className="text-sm font-bold text-slate-200">CPU利用率</div>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-slate-400 text-xs">告警总数:</span>
              <span className="text-3xl font-bold font-mono text-rose-500">124</span>
            </div>
          </div>

          {/* Right Area Chart: 近30日每日告警统计 */}
          <div className="lg:col-span-9 space-y-2">
            <div className="text-[11px] text-sky-400 font-mono flex items-center justify-between">
              <span>近30日每日告警统计</span>
              <div className="flex items-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 告警数</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> 异常数</span>
              </div>
            </div>

            {/* SVG 30-Day Area Spline Chart */}
            <div className="relative h-28 w-full bg-slate-900/40 rounded-xl border border-slate-800/60 p-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="gradAnomalies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="20" x2="800" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="800" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="800" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* Area 1: 告警数 (Rose Area Curve) */}
                <path
                  d="M 0,80 Q 50,20 100,50 T 200,60 T 300,30 T 400,70 T 500,40 T 600,60 T 700,30 T 800,80 L 800,100 L 0,100 Z"
                  fill="url(#gradAlerts)"
                />
                <path
                  d="M 0,80 Q 50,20 100,50 T 200,60 T 300,30 T 400,70 T 500,40 T 600,60 T 700,30 T 800,80"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />

                {/* Area 2: 异常数 (Amber Area Curve) */}
                <path
                  d="M 0,90 Q 50,70 100,40 T 200,20 T 300,50 T 400,30 T 500,50 T 600,20 T 700,50 T 800,70 L 800,100 L 0,100 Z"
                  fill="url(#gradAnomalies)"
                />
                <path
                  d="M 0,90 Q 50,70 100,40 T 200,20 T 300,50 T 400,30 T 500,50 T 600,20 T 700,50 T 800,70"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />

                {/* Dots */}
                <circle cx="600" cy="20" r="3" fill="#fbbf24" />
                <circle cx="600" cy="60" r="3" fill="#f43f5e" />
              </svg>

              {/* Point callouts */}
              <div className="absolute top-2 right-44 text-[10px] bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono">
                异常数: 4
              </div>
              <div className="absolute bottom-6 right-44 text-[10px] bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded text-rose-300 font-mono">
                告警数: 2
              </div>
            </div>

            {/* X-Axis dates (2026 Recent) */}
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
              {['10.1', '10.2', '10.3', '10.4', '10.5', '10.6', '10.7', '10.8', '10.9', '10.10', '10.11', '10.12', '10.13', '10.14', '10.15', '10.16'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SECTION 2: 检测对象 (Target Metadata) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
        <div className="font-bold text-white text-xs border-b border-slate-800/80 pb-2">检测对象</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-3 gap-x-4 text-slate-300">
          <div><span className="text-slate-400">主机序列号:</span> <span className="text-sky-400 font-mono font-bold hover:underline cursor-pointer">SN-46567</span></div>
          <div><span className="text-slate-400">管理IP地址:</span> <span className="font-mono text-slate-200">220.10.51.15</span></div>
          <div><span className="text-slate-400">业务IP地址:</span> <span className="font-mono text-slate-200">220.10.51.15</span></div>
          <div><span className="text-slate-400">设备类型:</span> <span className="font-mono text-slate-200">server</span></div>
          <div><span className="text-slate-400">设备名称:</span> <span className="font-mono text-slate-200">PC-001</span></div>
          <div><span className="text-slate-400">系统信息:</span> <span className="font-mono text-slate-200">Linux 78.6.0.0</span></div>
          <div><span className="text-slate-400">子设备名称:</span> <span className="font-mono text-slate-200">GE 1/1/1</span></div>
        </div>
      </div>

      {/* ===================== SECTION 3: AI模型 (AI Model Specs) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
        <div className="font-bold text-white text-xs border-b border-slate-800/80 pb-2">AI模型</div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-3 gap-x-4 text-slate-300 font-mono">
          <div><span className="text-slate-400">模型ID:</span> <span className="text-slate-200">sn-190001</span></div>
          <div><span className="text-slate-400">模型工程名称:</span> <span className="text-slate-200 font-sans">用户行为分析</span></div>
          <div><span className="text-slate-400">算法名称:</span> <span className="text-slate-200 font-sans">随机森林</span></div>
          <div><span className="text-slate-400">评价方法:</span> <span className="text-slate-200">AUC</span></div>

          <div><span className="text-slate-400">问题类型:</span> <span className="text-slate-200 font-sans">异常检测</span></div>
          <div><span className="text-slate-400">数据类型:</span> <span className="text-slate-200 font-sans">时间序列</span></div>
          <div><span className="text-slate-400">数据特征:</span> <span className="text-slate-200 font-sans">周期型</span></div>
          <div><span className="text-slate-400">样本数量:</span> <span className="text-slate-200">35100</span></div>

          <div><span className="text-slate-400">首次训练时间:</span> <span className="text-slate-200">2026-03-15 13:15:30</span></div>
          <div><span className="text-slate-400">训练时长:</span> <span className="text-slate-200">3day23hours</span></div>
          <div><span className="text-slate-400">训练结果:</span> <span className="text-rose-400 font-bold font-sans">失败</span></div>
          <div><span className="text-slate-400">Score:</span> <span className="text-cyan-400">0.63</span></div>

          <div><span className="text-slate-400">上次训练时间:</span> <span className="text-slate-200">2026-10-05 13:15:30</span></div>
          <div><span className="text-slate-400">训练时长:</span> <span className="text-slate-200">23hours</span></div>
          <div><span className="text-slate-400">训练结果:</span> <span className="text-emerald-400 font-bold font-sans">成功</span></div>
          <div><span className="text-slate-400">Score:</span> <span className="text-cyan-400">0.77</span></div>
        </div>
      </div>

      {/* ===================== SECTION 4: AI动态阈值看板 (Timeseries Chart & Tooltip) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">AI动态阈值看板</div>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono">
              <span>最新检测点时间: <strong className="text-slate-100">2026-10-16 09:30:23</strong></span>
              <span>主机CPU利用率: <strong className="text-cyan-400">61%</strong></span>
            </div>
            <div className="text-slate-300">
              AI结论: 最新检测点指标数据上限59%，下限12%，当前值61%，超出上限范围为 <span className="text-rose-400 font-bold">0%-50%</span>
            </div>
          </div>

          {/* Chart Legends */}
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-500/20 border border-sky-400/50 inline-block" />
              动态区间
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-slate-400 inline-block" />
              预测值
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 inline-block" />
              实际值
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              告警点
            </span>
          </div>
        </div>

        {/* Main Interactive Dynamic Envelope Chart */}
        <div className="relative h-64 w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
          <svg className="w-full h-full" viewBox="0 0 900 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="envelopeBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Y-Axis Grid Lines */}
            {[0, 20, 40, 60, 80, 100].map((val, idx) => {
              const y = 180 - (val / 100) * 160;
              return (
                <g key={val}>
                  <line x1="40" y1={y} x2="880" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                  <text x="30" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" className="font-mono">
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Shaded Upper / Lower Boundary Dynamic Interval */}
            <path
              d="M 40,120 Q 200,110 350,115 T 500,120 T 700,110 T 880,120 L 880,160 Q 700,150 500,155 T 350,160 T 200,150 T 40,160 Z"
              fill="url(#envelopeBg)"
              stroke="#38bdf8"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />

            {/* Actual Metric Curve (Solid Cyan Spline) */}
            <path
              d="M 40,130 Q 150,120 250,125 Q 320,110 380,30 Q 420,50 480,120 T 650,140 T 800,110 L 880,60"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />

            {/* Predicted Curve (Dashed Gray) */}
            <path
              d="M 40,135 Q 200,125 350,130 T 500,135 T 700,125 T 880,135"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Red Alert Breach Points (Matching user screenshot red dots at peaks) */}
            <circle cx="380" cy="30" r="5" fill="#f43f5e" className="animate-pulse cursor-pointer" />
            <circle cx="420" cy="50" r="4" fill="#f43f5e" className="cursor-pointer" />
            <circle cx="880" cy="60" r="4" fill="#f43f5e" className="cursor-pointer" />
          </svg>

          {/* Floating Tooltip Box matching Screenshot 2 */}
          {hoverPoint && (
            <div
              style={{ left: `${hoverPoint.x}px`, top: `${hoverPoint.y}px` }}
              className="absolute z-20 bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl text-[11px] font-mono space-y-1 text-slate-200 pointer-events-none"
            >
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">{hoverPoint.time}</div>
              <div>实际值: <span className="text-cyan-300 font-bold">{hoverPoint.actual}</span></div>
              <div>基线值: <span className="text-slate-300">{hoverPoint.baseline}</span></div>
              <div>上限值: <span className="text-slate-300">{hoverPoint.upper}</span></div>
              <div>下限值: <span className="text-slate-300">{hoverPoint.lower}</span></div>
              <div>是否超限: <span className="text-rose-400 font-bold">是</span></div>
            </div>
          )}
        </div>

        {/* Range Slider Preview Below Chart */}
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>2026-10-16 12:55:00</span>
          <div className="h-2 w-full mx-4 bg-slate-800 rounded-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-1/4 right-1/4 bg-cyan-500/30 border border-cyan-400/50 rounded-full" />
          </div>
          <span>2026-10-16 14:30:00</span>
        </div>
      </div>

      {/* ===================== SECTION 5: 告警列表 (Alert Table) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="font-bold text-white text-xs">告警列表</div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>低级告警: <strong className="text-slate-200">0%-50%</strong></span>
            <span>中级告警: <strong className="text-slate-200">50%-100%</strong></span>
            <span>高级告警: <strong className="text-slate-200">100%-200%</strong></span>
            <span>重大告警: <strong className="text-slate-200">超过200%</strong></span>

            <button className="ml-2 px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center gap-1 font-sans">
              <Sliders className="w-3.5 h-3.5" />
              <span>告警规则配置</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 whitespace-nowrap">序号</th>
                <th className="py-3 px-3 whitespace-nowrap">检测时间</th>
                <th className="py-3 px-3 whitespace-nowrap">告警时间</th>
                <th className="py-3 px-3 whitespace-nowrap">超限程度</th>
                <th className="py-3 px-3 whitespace-nowrap">超限类别</th>
                <th className="py-3 px-3 whitespace-nowrap">告警级别</th>
                <th className="py-3 px-3 whitespace-nowrap">告警标题</th>
                <th className="py-3 px-3 whitespace-nowrap">告警正文</th>
                <th className="py-3 px-3 whitespace-nowrap">实际值</th>
                <th className="py-3 px-3 whitespace-nowrap">预测值</th>
                <th className="py-3 px-3 whitespace-nowrap">上限</th>
                <th className="py-3 px-3 whitespace-nowrap">下限</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {INITIAL_ALERTS.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-bold whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-3 text-slate-200 whitespace-nowrap">{row.checkTime}</td>
                  <td className="py-3 px-3 text-slate-200 whitespace-nowrap">{row.alertTime}</td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{row.exceedDegree}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{row.exceedType}</td>
                  <td className="py-3 px-3 font-sans whitespace-nowrap">
                    {row.alertLevel === '低级告警' && (
                      <span className="text-sky-400 font-medium">低级告警</span>
                    )}
                    {row.alertLevel === '中级告警' && (
                      <span className="text-amber-400 font-medium">中级告警</span>
                    )}
                    {row.alertLevel === '高级告警' && (
                      <span className="text-rose-400 font-bold">高级告警</span>
                    )}
                    {row.alertLevel === '重大告警' && (
                      <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold border border-rose-500/30">
                        重大告警
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-sans font-medium whitespace-nowrap">{row.alertTitle}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{row.alertBody}</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold whitespace-nowrap">{row.actualVal}</td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{row.predVal}</td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{row.upperVal}</td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{row.lowerVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <div>共140条记录 第1/80页</div>
          <div className="flex items-center gap-1 font-mono">
            <button className="px-2 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white">&lt;</button>
            <button className="px-2.5 py-1 bg-sky-500 text-white font-bold rounded">1</button>
            <button className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white">2</button>
            <button className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white">3</button>
            <button className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white">4</button>
            <button className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white">5</button>
            <button className="px-2 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white">&gt;</button>
            <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 ml-2">
              <option>5条/页</option>
              <option>10条/页</option>
              <option>20条/页</option>
            </select>
            <span className="ml-2">跳至</span>
            <input
              type="text"
              defaultValue="1"
              className="w-10 bg-slate-900 border border-slate-800 text-center text-white rounded py-0.5"
            />
            <span>页</span>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-2xl shadow-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
