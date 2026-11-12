import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Activity,
  Layers,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Sliders,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ScenarioAnomalyRecord {
  id: number;
  checkTime: string;
  alertTime: string;
  exceedDegree: string;
  level: '超限非告警' | '警告告警' | '高级告警' | '重大告警';
  title: string;
  body: string;
  actualVal: string;
  fittedVal: string;
}

interface ScenarioMetricDataset {
  scenarioName: string;
  totalPoints: number;
  alertCount: number;
  alertRate: string;
  upperBreachCount: number;
  lowerBreachCount: number;
  currentVal: string;
  upperLimit: string;
  lowerLimit: string;
  lastCheckTime: string;
  anomalies: ScenarioAnomalyRecord[];
}

const SCENARIO_DATASETS: Record<string, ScenarioMetricDataset> = {
  '主机CPU利用率': {
    scenarioName: '主机CPU利用率',
    totalPoints: 135,
    alertCount: 5,
    alertRate: '4%',
    upperBreachCount: 22,
    lowerBreachCount: 13,
    currentVal: '61%',
    upperLimit: '59%',
    lowerLimit: '12%',
    lastCheckTime: '2026-10-16 09:30:23',
    anomalies: [
      {
        id: 1,
        checkTime: '2026-10-16 14:30:00',
        alertTime: '2026-10-16 14:30:00',
        exceedDegree: '0%-30%',
        level: '超限非告警',
        title: '注塑模具温度偏高',
        body: '当前温度61%，超出正常范围但未达阈值',
        actualVal: '61%',
        fittedVal: '38%',
      },
      {
        id: 2,
        checkTime: '2026-10-16 13:45:00',
        alertTime: '2026-10-16 13:45:00',
        exceedDegree: '30%-50%',
        level: '警告告警',
        title: '光伏板电压波动风险',
        body: '指标已超出40%',
        actualVal: '82%',
        fittedVal: '40%',
      },
      {
        id: 3,
        checkTime: '2026-10-16 12:20:00',
        alertTime: '2026-10-16 12:20:00',
        exceedDegree: '50%-70%',
        level: '高级告警',
        title: '空压机排气压力持续偏低',
        body: '压力连续30分钟低于设定值，需检查泄漏',
        actualVal: '76%',
        fittedVal: '25%',
      },
      {
        id: 4,
        checkTime: '2026-10-16 11:10:00',
        alertTime: '2026-10-16 11:10:00',
        exceedDegree: '70%-90%',
        level: '重大告警',
        title: '车床主轴振动幅值急剧上升',
        body: '振动峰值接近报警上限，存在断裂风险',
        actualVal: '88%',
        fittedVal: '12%',
      },
      {
        id: 5,
        checkTime: '2026-10-16 10:05:00',
        alertTime: '2026-10-16 10:05:00',
        exceedDegree: '90%-100%',
        level: '重大告警',
        title: '工业网关CPU负载逼近极限',
        body: 'CPU占用率已达95%，可能引发通信中断',
        actualVal: '95%',
        fittedVal: '5%',
      },
      {
        id: 6,
        checkTime: '2026-10-16 09:30:00',
        alertTime: '2026-10-16 09:30:00',
        exceedDegree: '30%-50%',
        level: '警告告警',
        title: '变压器油温升高趋势明显',
        body: '油温上升速率超过正常值2倍',
        actualVal: '78%',
        fittedVal: '42%',
      },
      {
        id: 7,
        checkTime: '2026-10-15 16:15:00',
        alertTime: '2026-10-15 16:15:00',
        exceedDegree: '0%-30%',
        level: '超限非告警',
        title: '冷却水流量轻微波动',
        body: '流量在允许范围内波动，无影响',
        actualVal: '65%',
        fittedVal: '35%',
      },
      {
        id: 8,
        checkTime: '2026-10-15 14:40:00',
        alertTime: '2026-10-15 14:40:00',
        exceedDegree: '50%-70%',
        level: '高级告警',
        title: '除尘系统滤袋压差异常增大',
        body: '压差增长速度加快，可能存在堵塞',
        actualVal: '72%',
        fittedVal: '28%',
      },
      {
        id: 9,
        checkTime: '2026-10-15 10:25:00',
        alertTime: '2026-10-15 10:25:00',
        exceedDegree: '70%-90%',
        level: '重大告警',
        title: '气体浓度监测异常波动',
        body: 'CO浓度出现尖峰，疑似泄漏源附近',
        actualVal: '85%',
        fittedVal: '15%',
      },
      {
        id: 10,
        checkTime: '2026-10-15 08:10:00',
        alertTime: '2026-10-15 08:10:00',
        exceedDegree: '30%-50%',
        level: '警告告警',
        title: '液位传感器数据漂移趋势',
        body: '液位显示值持续偏离历史曲线',
        actualVal: '70%',
        fittedVal: '45%',
      },
    ],
  },
  '主机CPU近5分钟平均负载': {
    scenarioName: '主机CPU近5分钟平均负载',
    totalPoints: 180,
    alertCount: 3,
    alertRate: '2%',
    upperBreachCount: 15,
    lowerBreachCount: 8,
    currentVal: '3.85',
    upperLimit: '3.50',
    lowerLimit: '0.20',
    lastCheckTime: '2026-10-16 14:25:00',
    anomalies: [
      {
        id: 1,
        checkTime: '2026-10-16 14:15:00',
        alertTime: '2026-10-16 14:15:00',
        exceedDegree: '30%-50%',
        level: '警告告警',
        title: '短期计算密集任务爆发',
        body: '5分钟平均 Load Average 骤增至 3.85',
        actualVal: '3.85',
        fittedVal: '2.10',
      },
    ],
  },
  '主机CPU近15分钟平均负载': {
    scenarioName: '主机CPU近15分钟平均负载',
    totalPoints: 140,
    alertCount: 2,
    alertRate: '1.5%',
    upperBreachCount: 10,
    lowerBreachCount: 5,
    currentVal: '2.90',
    upperLimit: '3.00',
    lowerLimit: '0.30',
    lastCheckTime: '2026-10-16 14:20:00',
    anomalies: [
      {
        id: 1,
        checkTime: '2026-10-16 13:00:00',
        alertTime: '2026-10-16 13:00:00',
        exceedDegree: '0%-30%',
        level: '超限非告警',
        title: '15分钟负载持续阴跌恢复中',
        body: '负载均值缓慢回落至正常区间',
        actualVal: '2.90',
        fittedVal: '2.60',
      },
    ],
  },
};

export const MetricScenarioReportView: React.FC = () => {
  // Search filter states
  const [selectedMetric, setSelectedMetric] = useState<string>('主机cpu利用率');
  const [period, setPeriod] = useState<string>('近7天');
  const [startDate, setStartDate] = useState<string>('2026-10-09');
  const [endDate, setEndDate] = useState<string>('2026-10-16');

  // Scenario Tab state
  const [activeScenarioTab, setActiveScenarioTab] = useState<string>('主机CPU利用率');

  // Realtime simulation state
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Hover Tooltip state
  const [hoveredPoint, setHoveredPoint] = useState<{
    time: string;
    actualVal: string;
    baselineVal: string;
    upperVal: string;
    lowerVal: string;
    isBreach: boolean;
    x: number;
    y: number;
  } | null>({
    time: '2026-10-16 13:30:00',
    actualVal: '82%',
    baselineVal: '40%',
    upperVal: '58%',
    lowerVal: '0%',
    isBreach: true,
    x: 350,
    y: 80,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active dataset
  const currentDataset = useMemo(() => {
    return SCENARIO_DATASETS[activeScenarioTab] || SCENARIO_DATASETS['主机CPU利用率'];
  }, [activeScenarioTab]);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshSeed((prev) => prev + 1);
      setIsRefreshing(false);
      setToastMessage('已完成主机负载异常检测报告场景数据全量重新更新！');
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  const handleSearch = () => {
    setToastMessage(`已查询【${selectedMetric}】在 ${period} 范围内的场景异常报告`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    setSelectedMetric('主机cpu利用率');
    setPeriod('近7天');
    setStartDate('2026-10-09');
    setEndDate('2026-10-16');
    setToastMessage('已重置场景筛选条件');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>主机负载异常检测报告</span>
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="px-3 py-1 bg-cyan-950 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>重新更新数据</span>
          </button>
          <div className="text-xs text-slate-400 font-mono">
            控制台实时同步: <strong className="text-cyan-400 font-bold">2026-10-16 14:30:00</strong>
          </div>
        </div>
      </div>

      {/* Top Form Filter Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-medium">统计指标:</span>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="主机cpu利用率">主机cpu利用率</option>
            <option value="主机内存利用率">主机内存利用率</option>
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

      {/* ===================== SECTION 1: ▶ 指标异常检测报告 ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-l-4 border-cyan-400 pl-3">
          <h3 className="text-xs font-bold text-cyan-400">▶ 指标异常检测报告</h3>
          <BarChart2 className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-pointer" />
        </div>

        <div className="pt-1 text-xs font-bold text-white">检测统计</div>

        {/* 3 Scenario Tabs Matching Screenshot 1 */}
        <div className="grid grid-cols-3 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 text-xs text-center font-medium">
          {['主机CPU利用率', '主机CPU近5分钟平均负载', '主机CPU近15分钟平均负载'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveScenarioTab(tab)}
              className={`py-2.5 rounded-xl transition-all ${
                activeScenarioTab === tab
                  ? 'bg-slate-800 text-white font-bold shadow-md shadow-slate-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Horizontal Gray Stats Card Bar Matching Screenshot 1 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-around text-xs gap-4 font-mono">
          <div>检测点总数: <strong className="text-cyan-300 text-sm">{currentDataset.totalPoints + refreshSeed * 2}</strong></div>
          <div>告警数: <strong className="text-rose-500 text-sm font-bold">{currentDataset.alertCount}</strong></div>
          <div>告警占比: <strong className="text-rose-400 font-bold">{currentDataset.alertRate}</strong></div>
          <div>超上限数: <strong className="text-amber-300 font-bold">{currentDataset.upperBreachCount}</strong></div>
          <div>超下限数: <strong className="text-amber-300 font-bold">{currentDataset.lowerBreachCount}</strong></div>
        </div>
      </div>

      {/* ===================== SECTION 2: 检测对象 (Target Metadata) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
        <div className="font-bold text-white text-xs border-b border-slate-800/80 pb-2">检测对象</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-y-3 gap-x-4 text-slate-300">
          <div><span className="text-slate-400">主机序列号:</span> <span className="text-sky-400 font-mono font-bold hover:underline cursor-pointer">SN-46567</span></div>
          <div><span className="text-slate-400">主机IP地址:</span> <span className="font-mono text-slate-200">220.10.51.15</span></div>
          <div><span className="text-slate-400">设备类型:</span> <span className="font-mono text-slate-200">server</span></div>
          <div><span className="text-slate-400">设备名称:</span> <span className="font-mono text-slate-200">PC-001</span></div>
          <div><span className="text-slate-400">系统信息:</span> <span className="font-mono text-slate-200">Linux 78.6.0.0</span></div>
          <div className="md:col-span-5 pt-1 text-slate-300">
            <span className="text-slate-400">资源池:</span> <span className="text-cyan-300 font-semibold font-sans">省级IT云|华北二|呼池|呼池-虚拟015</span> <span className="text-slate-500 text-[11px]">(按照资源池级别显示)</span>
          </div>
        </div>
      </div>

      {/* ===================== SECTION 3: AI模型 (AI Model Specs) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
        <div className="font-bold text-white text-xs border-b border-slate-800/80 pb-2">AI模型</div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-3 gap-x-4 text-slate-300 font-mono">
          <div><span className="text-slate-400">模型ID:</span> <span className="text-slate-200">sn-190001</span></div>
          <div><span className="text-slate-400">模型工程名称:</span> <span className="text-slate-200 font-sans">语言处理</span></div>
          <div><span className="text-slate-400">算法名称:</span> <span className="text-slate-200 font-sans">线性回归</span></div>
          <div><span className="text-slate-400">评价方法:</span> <span className="text-slate-200">AUC</span></div>

          <div><span className="text-slate-400">问题类型:</span> <span className="text-slate-200 font-sans">异常检测</span></div>
          <div><span className="text-slate-400">数据类型:</span> <span className="text-slate-200 font-sans">时间序列</span></div>
          <div><span className="text-slate-400">数据特征:</span> <span className="text-slate-200 font-sans">周期型</span></div>
          <div><span className="text-slate-400">样本数量:</span> <span className="text-slate-200">35100</span></div>

          <div><span className="text-slate-400">首次训练完成时间:</span> <span className="text-slate-200">2026-03-15 13:15:30</span></div>
          <div><span className="text-slate-400">训练时长:</span> <span className="text-slate-200">3day23hours</span></div>
          <div><span className="text-slate-400">训练结果:</span> <span className="text-rose-400 font-bold font-sans">失败</span></div>
          <div><span className="text-slate-400">Score:</span> <span className="text-cyan-400">0.63</span></div>

          <div><span className="text-slate-400">最新训练完成时间:</span> <span className="text-slate-200">2026-10-05 13:15:30</span></div>
          <div><span className="text-slate-400">训练时长:</span> <span className="text-slate-200">23hours</span></div>
          <div><span className="text-slate-400">训练结果:</span> <span className="text-emerald-400 font-bold font-sans">成功</span></div>
          <div><span className="text-slate-400">Score:</span> <span className="text-cyan-400">0.77</span></div>
        </div>
      </div>

      {/* ===================== SECTION 4: AI检测看板 (Timeseries Chart & Tooltip) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">AI检测看板</div>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono">
              <span>最新检测点时间: <strong className="text-slate-100">{currentDataset.lastCheckTime}</strong></span>
              <span>{activeScenarioTab}: <strong className="text-cyan-400">{currentDataset.currentVal}</strong></span>
            </div>
            <div className="text-slate-300">
              AI结论: 最新检测性能上限{currentDataset.upperLimit}，下限{currentDataset.lowerLimit}，当前值{currentDataset.currentVal}，超出上限范围为 <span className="text-rose-500 font-bold">0%-50%</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-500/20 border border-sky-400/50 inline-block" />
              动态区间
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-slate-400 inline-block" />
              动态基线
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

        {/* Dynamic Envelope Timeseries Chart */}
        <div className="relative h-64 w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
          <svg className="w-full h-full" viewBox="0 0 900 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="scenarioBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {[0, 20, 40, 60, 80, 100].map((val) => {
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

            {/* Shaded Envelope Interval */}
            <path
              d="M 40,120 Q 200,110 350,115 T 500,120 T 700,110 T 880,120 L 880,160 Q 700,150 500,155 T 350,160 T 200,150 T 40,160 Z"
              fill="url(#scenarioBg)"
              stroke="#38bdf8"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />

            {/* Actual Curve */}
            <path
              d="M 40,130 Q 150,120 250,125 Q 320,110 380,30 Q 420,50 480,120 T 650,140 T 800,110 L 880,60"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />

            {/* Baseline (Dashed Gray) */}
            <path
              d="M 40,135 Q 200,125 350,130 T 500,135 T 700,125 T 880,135"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Red Alert Breach Points */}
            <circle cx="380" cy="30" r="5" fill="#f43f5e" className="animate-pulse cursor-pointer" />
            <circle cx="420" cy="50" r="4" fill="#f43f5e" className="cursor-pointer" />
            <circle cx="880" cy="60" r="4" fill="#f43f5e" className="cursor-pointer" />
          </svg>

          {/* Floating Tooltip Box matching Screenshot 2 */}
          {hoveredPoint && (
            <div
              style={{ left: `${hoveredPoint.x}px`, top: `${hoveredPoint.y}px` }}
              className="absolute z-20 bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl text-[11px] font-mono space-y-1 text-slate-200 pointer-events-none"
            >
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">{hoveredPoint.time}</div>
              <div>实际值: <span className="text-cyan-300 font-bold">{hoveredPoint.actualVal}</span></div>
              <div>基线值: <span className="text-slate-300">{hoveredPoint.baselineVal}</span></div>
              <div>上限值: <span className="text-slate-300">{hoveredPoint.upperVal}</span></div>
              <div>下限值: <span className="text-slate-300">{hoveredPoint.lowerVal}</span></div>
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

      {/* ===================== SECTION 5: 异常列表 (Anomaly Table - Screenshot 2 Rows 100% Match) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="font-bold text-white text-xs">异常列表</div>
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
                <th className="py-3 px-3 whitespace-nowrap">告警级别</th>
                <th className="py-3 px-3 whitespace-nowrap">告警标题</th>
                <th className="py-3 px-3 whitespace-nowrap">告警正文</th>
                <th className="py-3 px-3 whitespace-nowrap">实际值</th>
                <th className="py-3 px-3 whitespace-nowrap">拟合值</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentDataset.anomalies.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-bold whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-3 text-slate-200 whitespace-nowrap">{row.checkTime}</td>
                  <td className="py-3 px-3 text-slate-200 whitespace-nowrap">{row.alertTime}</td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{row.exceedDegree}</td>
                  <td className="py-3 px-3 font-sans whitespace-nowrap">
                    {row.level === '超限非告警' && (
                      <span className="text-sky-400 font-medium">超限非告警</span>
                    )}
                    {row.level === '警告告警' && (
                      <span className="text-amber-400 font-medium">警告告警</span>
                    )}
                    {row.level === '高级告警' && (
                      <span className="text-rose-400 font-bold">高级告警</span>
                    )}
                    {row.level === '重大告警' && (
                      <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold border border-rose-500/30">
                        重大告警
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-sans font-medium whitespace-nowrap">{row.title}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{row.body}</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold whitespace-nowrap">{row.actualVal}</td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{row.fittedVal}</td>
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
              <option>10条/页</option>
              <option>20条/页</option>
              <option>50条/页</option>
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
