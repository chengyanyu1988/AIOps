import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Activity,
  Layers,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Eye,
  Sliders,
  X,
  AlertOctagon,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface MultiAlertRecord {
  id: number;
  checkTime: string;
  alertTime: string;
  level: '重大异常' | '高级异常' | '中级异常' | '一般异常';
  title: string;
  body: string;
}

interface DatasetCombo {
  name: string;
  metric1Label: string;
  metric2Label: string;
  metric1Value: string;
  metric2Value: string;
  totalPoints: number;
  alertCount: number;
  alertRate: string;
  majorRate: string;
  highRate: string;
  algorithmName: string;
  lastCheckTime: string;
  alerts: MultiAlertRecord[];
}

const MULTI_DATASETS: Record<string, DatasetCombo> = {
  '主机cpu利用率, 主机内存利用率': {
    name: '主机CPU利用率, 主机内存利用率',
    metric1Label: '主机CPU利用率',
    metric2Label: '主机内存利用率',
    metric1Value: '61%',
    metric2Value: '68%',
    totalPoints: 135,
    alertCount: 5,
    alertRate: '4 %',
    majorRate: '22 %',
    highRate: '13 %',
    algorithmName: '线性回归 + IsolationForest',
    lastCheckTime: '2026-10-16 14:30:00',
    alerts: [
      {
        id: 1,
        checkTime: '2026-10-16 14:20:00',
        alertTime: '2026-10-16 14:18:00',
        level: '重大异常',
        title: '注塑机冷却系统失效导致连锁过热',
        body: '冷却水流量↓、模具温度↑、电机温度↑、能耗↑',
      },
      {
        id: 2,
        checkTime: '2026-10-16 13:05:00',
        alertTime: '2026-10-16 13:00:00',
        level: '高级异常',
        title: '光伏逆变器散热不良引发电压与效率双降',
        body: '散热风扇转速↓、模块温度↑、输出功率↓',
      },
      {
        id: 3,
        checkTime: '2026-10-16 11:40:00',
        alertTime: '2026-10-16 11:35:00',
        level: '中级异常',
        title: '空压机加载异常伴随压力与电流波动',
        body: '排气压力波动↑、电机电流脉冲↑、运行状态频繁切换',
      },
      {
        id: 4,
        checkTime: '2026-10-16 10:15:00',
        alertTime: '2026-10-16 10:10:00',
        level: '高级异常',
        title: '车床主轴综合健康度下降',
        body: '振动加速度↑、轴承温度↑、切削力波动↑、进给误差↑、刀具磨损指数↑',
      },
      {
        id: 5,
        checkTime: '2026-10-16 09:25:00',
        alertTime: '2026-10-16 09:20:00',
        level: '一般异常',
        title: '工业网关通信延迟与CPU负载同步升高',
        body: '网络延迟↑、CPU使用率↑',
      },
    ],
  },
  '磁盘IO, 网络丢包率': {
    name: '磁盘IO读写速率, 网络接口丢包率',
    metric1Label: '磁盘IO读写速率',
    metric2Label: '网络接口丢包率',
    metric1Value: '82MB/s',
    metric2Value: '3.2%',
    totalPoints: 210,
    alertCount: 8,
    alertRate: '6 %',
    majorRate: '25 %',
    highRate: '18 %',
    algorithmName: '主成分分析 (PCA) + 随机森林',
    lastCheckTime: '2026-10-16 14:28:10',
    alerts: [
      {
        id: 1,
        checkTime: '2026-10-16 14:15:00',
        alertTime: '2026-10-16 14:12:00',
        level: '重大异常',
        title: 'SAN存储阵列IO死锁与网卡丢包暴增',
        body: '磁盘等待队列>45、接口Rx/Tx丢包率达到3.2%',
      },
      {
        id: 2,
        checkTime: '2026-10-16 12:40:00',
        alertTime: '2026-10-16 12:35:00',
        level: '高级异常',
        title: '分布式数据库集群刷盘同步延迟',
        body: 'Write I/O 阻塞、网络吞吐瞬间大幅跌落',
      },
    ],
  },
  'TCP连接数, 句柄占用数': {
    name: 'TCP连接数, 句柄占用数',
    metric1Label: 'TCP连接数',
    metric2Label: '句柄占用数',
    metric1Value: '14,200',
    metric2Value: '38,500',
    totalPoints: 98,
    alertCount: 3,
    alertRate: '3 %',
    majorRate: '15 %',
    highRate: '10 %',
    algorithmName: '多维协同聚类 (DBSCAN)',
    lastCheckTime: '2026-10-16 14:25:00',
    alerts: [
      {
        id: 1,
        checkTime: '2026-10-16 11:10:00',
        alertTime: '2026-10-16 11:05:00',
        level: '中级异常',
        title: '高并发套接字句柄未及时释放异常',
        body: 'CLOSE_WAIT 数量达到 4200、File Descriptors 占用 92%',
      },
    ],
  },
};

export const MultiMetricReportView: React.FC = () => {
  // Filter form state
  const [metricOption, setMetricOption] = useState<string>('主机cpu利用率, 主机内存利用率');
  const [period, setPeriod] = useState<string>('近7天');
  const [startDate, setStartDate] = useState<string>('2026-10-09');
  const [endDate, setEndDate] = useState<string>('2026-10-16');

  // Realtime simulation ticker count
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Active combo dataset
  const currentDataset = useMemo(() => {
    return MULTI_DATASETS[metricOption] || MULTI_DATASETS['主机cpu利用率, 主机内存利用率'];
  }, [metricOption]);

  const [selectedAlertForInspect, setSelectedAlertForInspect] = useState<MultiAlertRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshSeed((prev) => prev + 1);
      setIsRefreshing(false);
      setToastMessage('已完成多指标特征引擎全量实时数据重新刷新！');
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  const handleSearch = () => {
    setToastMessage(`已对多指标【${currentDataset.name}】开启跨变量特征关联推演`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    setMetricOption('主机cpu利用率, 主机内存利用率');
    setPeriod('近7天');
    setStartDate('2026-10-09');
    setEndDate('2026-10-16');
    setToastMessage('已重置多指标筛选条件');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>多指标异常检测报告</span>
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="px-3 py-1 bg-cyan-950 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>重新刷新数据</span>
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
            value={metricOption}
            onChange={(e) => setMetricOption(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 max-w-xs"
          >
            <option value="主机cpu利用率, 主机内存利用率">主机cpu利用率, 主机内存利用率</option>
            <option value="磁盘IO, 网络丢包率">磁盘IO, 网络丢包率</option>
            <option value="TCP连接数, 句柄占用数">TCP连接数, 句柄占用数</option>
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

      {/* ===================== SECTION 1: ▶ 多指标异常检测报告 ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-l-4 border-cyan-400 pl-3">
          <h3 className="text-xs font-bold text-cyan-400">▶ 多指标异常检测报告</h3>
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>实时关联特征: {currentDataset.algorithmName}</span>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <div className="font-bold text-white">模型指标</div>
          <div className="text-slate-300">指标名称: <span className="text-slate-100 font-medium">{currentDataset.name}</span></div>
        </div>

        <div className="pt-2 text-xs font-bold text-white">检测统计</div>

        {/* Gray Stats Card Bar (Dynamically updated) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-around text-xs gap-4 font-mono">
          <div>关联检测点总数: <strong className="text-cyan-300 text-sm">{currentDataset.totalPoints + refreshSeed * 2}</strong></div>
          <div>告警数: <strong className="text-rose-500 text-sm font-bold">{currentDataset.alertCount}</strong></div>
          <div>告警占比: <strong className="text-slate-200">{currentDataset.alertRate}</strong></div>
          <div>重大告警占比: <strong className="text-rose-400">{currentDataset.majorRate}</strong></div>
          <div>高级告警占比: <strong className="text-amber-400">{currentDataset.highRate}</strong></div>
        </div>
      </div>

      {/* ===================== SECTION 2: 检测对象 (Target Metadata) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
        <div className="font-bold text-white text-xs border-b border-slate-800/80 pb-2">检测对象</div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-y-3 gap-x-4 text-slate-300">
          <div><span className="text-slate-400">主机序列号:</span> <span className="text-sky-400 font-mono font-bold hover:underline cursor-pointer">SN-46567</span></div>
          <div><span className="text-slate-400">管理IP地址:</span> <span className="font-mono text-slate-200">220.10.51.15</span></div>
          <div><span className="text-slate-400">业务IP地址:</span> <span className="font-mono text-slate-200">220.10.51.15</span></div>
          <div><span className="text-slate-400">设备类型:</span> <span className="font-mono text-slate-200">server</span></div>
          <div><span className="text-slate-400">设备名称:</span> <span className="font-mono text-slate-200">PC-001</span></div>
          <div><span className="text-slate-400">系统信息:</span> <span className="font-mono text-slate-200">Linux 78.6.0.0</span></div>
        </div>
      </div>

      {/* ===================== SECTION 3: AI模型 (AI Model Specs) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
        <div className="font-bold text-white text-xs border-b border-slate-800/80 pb-2">AI模型</div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-3 gap-x-4 text-slate-300 font-mono">
          <div><span className="text-slate-400">模型ID:</span> <span className="text-slate-200">sn-190001</span></div>
          <div><span className="text-slate-400">模型工程名称:</span> <span className="text-slate-200 font-sans">语言处理</span></div>
          <div><span className="text-slate-400">算法名称:</span> <span className="text-slate-200 font-sans">{currentDataset.algorithmName}</span></div>
          <div><span className="text-slate-400">评价方法:</span> <span className="text-slate-200">AUC</span></div>

          <div><span className="text-slate-400">问题类型:</span> <span className="text-slate-200 font-sans">异常检测</span></div>
          <div><span className="text-slate-400">数据类型:</span> <span className="text-slate-200 font-sans">表格数据</span></div>
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

      {/* ===================== SECTION 4: AI异常检测看板 (Side-by-Side Dual Timeseries Charts) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
        <div className="space-y-1 border-b border-slate-800/80 pb-3">
          <div className="font-bold text-white text-sm">AI异常检测看板</div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono">
            <span>最新检测点时间: <strong className="text-slate-100">{currentDataset.lastCheckTime}</strong></span>
            <span>{currentDataset.metric1Label}: <strong className="text-cyan-400">{currentDataset.metric1Value}</strong></span>
            <span>| {currentDataset.metric2Label}: <strong className="text-cyan-400">{currentDataset.metric2Value}</strong></span>
          </div>
          <div className="text-slate-300">
            AI结论: 模型检测到关联指标产生异常波动，监控结果为 <span className="text-rose-500 font-bold">异常</span>
          </div>
        </div>

        {/* Display Metric Toggles Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">显示监控指标:</span>
            <span className="bg-sky-500/20 text-sky-300 font-bold px-2.5 py-1 rounded-lg border border-sky-500/30">
              {currentDataset.metric1Label}
            </span>
            <span className="bg-sky-500/20 text-sky-300 font-bold px-2.5 py-1 rounded-lg border border-sky-500/30">
              {currentDataset.metric2Label}
            </span>
            <span className="text-slate-400 hover:text-slate-200 cursor-pointer">主机CPU iowait时间占比</span>
            <span className="text-slate-400 hover:text-slate-200 cursor-pointer">主机CPU iowait状态占比</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">查询监控周期:</span>
            <input type="date" defaultValue={startDate} className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 font-mono" />
            <span className="text-slate-500">—</span>
            <input type="date" defaultValue={endDate} className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 font-mono" />
            <button onClick={handleSearch} className="px-3 py-1 bg-sky-500 text-white font-bold rounded-lg ml-1">查询</button>
            <button onClick={handleReset} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg">重置</button>
          </div>
        </div>

        {/* Side-by-Side Dual SVG Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Chart 1 */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200 text-xs">
              <span>{currentDataset.metric1Label}</span>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-cyan-400 rounded-full inline-block" /> 实际值</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 关联告警事件点</span>
              </div>
            </div>

            <div className="relative h-56 w-full">
              <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                {/* Y Grid lines */}
                {[0, 20, 40, 60, 80, 100].map((v) => {
                  const y = 140 - (v / 100) * 120;
                  return (
                    <g key={v}>
                      <line x1="30" y1={y} x2="390" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <text x="22" y={y + 3} fill="#64748b" fontSize="8" textAnchor="end" className="font-mono">{v}</text>
                    </g>
                  );
                })}

                {/* Correlated Vertical Red Reference Lines */}
                <line x1="260" y1="10" x2="260" y2="140" stroke="#f43f5e" strokeWidth="1" opacity="0.6" />
                <line x1="290" y1="10" x2="290" y2="140" stroke="#f43f5e" strokeWidth="1" opacity="0.6" />
                <line x1="310" y1="10" x2="310" y2="140" stroke="#f43f5e" strokeWidth="1" opacity="0.6" />

                {/* Metric 1 Curve */}
                <path
                  d="M 30,110 Q 80,100 130,105 Q 180,60 210,20 Q 240,60 260,80 L 290,55 Q 330,80 390,40"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                <circle cx="290" cy="55" r="4" fill="#f43f5e" className="animate-pulse" />
              </svg>

              <div className="absolute top-12 right-12 bg-slate-950/95 border border-slate-700 rounded-xl p-2.5 shadow-2xl text-[10px] font-mono space-y-1 pointer-events-none">
                <div className="text-slate-400 border-b border-slate-800 pb-1">{currentDataset.lastCheckTime}</div>
                <div>实际值: <span className="text-cyan-300 font-bold">{currentDataset.metric1Value}</span></div>
                <div>是否为关联告警点: <span className="text-rose-400 font-bold">是</span></div>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-800 rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 left-1/3 right-1/4 bg-cyan-500/40 rounded-full" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>2026-10-16 12:55:00</span>
              <span>2026-10-16 14:30:00</span>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200 text-xs">
              <span>{currentDataset.metric2Label}</span>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-cyan-400 rounded-full inline-block" /> 实际值</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 关联告警事件点</span>
              </div>
            </div>

            <div className="relative h-56 w-full">
              <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                {[0, 20, 40, 60, 80, 100].map((v) => {
                  const y = 140 - (v / 100) * 120;
                  return (
                    <g key={v}>
                      <line x1="30" y1={y} x2="390" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <text x="22" y={y + 3} fill="#64748b" fontSize="8" textAnchor="end" className="font-mono">{v}</text>
                    </g>
                  );
                })}

                <line x1="260" y1="10" x2="260" y2="140" stroke="#f43f5e" strokeWidth="1" opacity="0.6" />
                <line x1="290" y1="10" x2="290" y2="140" stroke="#f43f5e" strokeWidth="1" opacity="0.6" />
                <line x1="310" y1="10" x2="310" y2="140" stroke="#f43f5e" strokeWidth="1" opacity="0.6" />

                <path
                  d="M 30,100 Q 100,90 160,95 Q 210,20 250,90 T 290,125 T 330,130 L 390,70"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                <circle cx="290" cy="125" r="4" fill="#f43f5e" className="animate-pulse" />
              </svg>

              <div className="absolute bottom-8 right-12 bg-slate-950/95 border border-slate-700 rounded-xl p-2.5 shadow-2xl text-[10px] font-mono space-y-1 pointer-events-none">
                <div className="text-slate-400 border-b border-slate-800 pb-1">{currentDataset.lastCheckTime}</div>
                <div>实际值: <span className="text-cyan-300 font-bold">{currentDataset.metric2Value}</span></div>
                <div>是否为关联告警点: <span className="text-rose-400 font-bold">是</span></div>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-800 rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 left-1/3 right-1/4 bg-cyan-500/40 rounded-full" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>2026-10-16 12:55:00</span>
              <span>2026-10-16 14:30:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SECTION 5: 告警列表 (Alert Table) ===================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="font-bold text-white text-xs">告警列表</div>
          <div className="text-xs text-slate-400 font-mono">
            当前多指标关联列表: <strong className="text-cyan-400 font-mono">{currentDataset.alerts.length}</strong> 条记录
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
                <th className="py-3 px-3 whitespace-nowrap">告警级别</th>
                <th className="py-3 px-3 whitespace-nowrap">告警标题</th>
                <th className="py-3 px-3 whitespace-nowrap">告警正文</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">指标实际值</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentDataset.alerts.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-bold whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-3 text-slate-200 whitespace-nowrap">{row.checkTime}</td>
                  <td className="py-3 px-3 text-slate-200 whitespace-nowrap">{row.alertTime}</td>
                  <td className="py-3 px-3 font-sans whitespace-nowrap">
                    {row.level === '重大异常' && (
                      <span className="bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded border border-rose-500/30">
                        重大异常
                      </span>
                    )}
                    {row.level === '高级异常' && (
                      <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                        高级异常
                      </span>
                    )}
                    {row.level === '中级异常' && (
                      <span className="text-sky-400 font-medium">中级异常</span>
                    )}
                    {row.level === '一般异常' && (
                      <span className="text-slate-300 font-medium">一般异常</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-sans font-medium whitespace-nowrap">{row.title}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{row.body}</td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedAlertForInspect(row)}
                      className="text-sky-400 hover:text-sky-300 font-medium font-sans flex items-center justify-end gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>查看</span>
                    </button>
                  </td>
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

      {/* Alert Inspection Modal */}
      {selectedAlertForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl shadow-cyan-950/50 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>多指标关联告警详情 - #{selectedAlertForInspect.id}</span>
              </h3>
              <button onClick={() => setSelectedAlertForInspect(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 font-mono">
              <div>告警标题: <span className="text-cyan-300 font-bold font-sans">{selectedAlertForInspect.title}</span></div>
              <div>检测时间: <span className="text-slate-200">{selectedAlertForInspect.checkTime}</span></div>
              <div>告警级别: <span className="text-rose-400 font-bold font-sans">{selectedAlertForInspect.level}</span></div>
              <div>关联正文: <span className="text-slate-300 font-sans">{selectedAlertForInspect.body}</span></div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-cyan-300 font-sans leading-relaxed">
                🔗 跨多指标特征相关性计算表明，{currentDataset.metric1Label} 与 {currentDataset.metric2Label} 具有 0.89 互信息联合波动特征。
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAlertForInspect(null)}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl"
              >
                确定关闭
              </button>
            </div>
          </div>
        </div>
      )}

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
