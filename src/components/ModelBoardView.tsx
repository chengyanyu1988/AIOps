import React, { useState, useMemo } from 'react';
import {
  Clock,
  Table,
  FileText,
  Bell,
  Search,
  Activity,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  Filter,
} from 'lucide-react';

interface ModelBoardViewProps {
  sn?: string;
  mgmtIp?: string;
  bizIp?: string;
  onBack?: () => void;
}

interface ModelItem {
  id: string;
  name: string;
  type: string;
  isDisabled?: boolean;
  currentValue: string;
  upperLimit?: string;
  lowerLimit?: string;
  aiConclusion?: '异常' | '正常' | '未知';
  totalAlerts: string;
  aiScore: string;
  lastCheckTime: string;
  lastAlertTime: string;
  lastTrainTime: string;
}

const INITIAL_MODELS: ModelItem[] = [
  // 1 ~ 10: 单指标异常检测
  {
    id: 'm-1',
    name: 'CPU利用率',
    type: '单指标异常检测',
    currentValue: '61%',
    aiConclusion: '异常',
    totalAlerts: '3155',
    aiScore: '0.77',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 09:30:23',
    lastTrainTime: '2026-10-05 13:15:30',
  },
  {
    id: 'm-2',
    name: '近15分钟平均CPU利用率',
    type: '单指标异常检测',
    currentValue: '58.4%',
    aiConclusion: '正常',
    totalAlerts: '1240',
    aiScore: '0.85',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-15 18:22:10',
    lastTrainTime: '2026-10-05 13:15:30',
  },
  {
    id: 'm-3',
    name: '磁盘I/O使用率 (sda)',
    type: '单指标异常检测',
    currentValue: '84.2%',
    aiConclusion: '异常',
    totalAlerts: '2680',
    aiScore: '0.92',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 08:45:12',
    lastTrainTime: '2026-10-06 11:20:00',
  },
  {
    id: 'm-4',
    name: '网卡接收丢包数 (eth0)',
    type: '单指标异常检测',
    currentValue: '142包/s',
    aiConclusion: '异常',
    totalAlerts: '1890',
    aiScore: '0.81',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 07:15:00',
    lastTrainTime: '2026-10-07 14:00:00',
  },
  {
    id: 'm-5',
    name: 'TCP活跃连接数 (Active Connections)',
    type: '单指标异常检测',
    currentValue: '8520',
    aiConclusion: '正常',
    totalAlerts: '954',
    aiScore: '0.88',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-14 20:10:05',
    lastTrainTime: '2026-10-08 09:30:00',
  },
  {
    id: 'm-6',
    name: '系统上下文切换频率 (Context Switch)',
    type: '单指标异常检测',
    currentValue: '45,210/s',
    aiConclusion: '正常',
    totalAlerts: '620',
    aiScore: '0.90',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-13 15:40:22',
    lastTrainTime: '2026-10-08 16:45:00',
  },
  {
    id: 'm-7',
    name: '内存活跃页占用率 (Active Pages)',
    type: '单指标异常检测',
    currentValue: '72.6%',
    aiConclusion: '正常',
    totalAlerts: '1120',
    aiScore: '0.86',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-15 11:05:40',
    lastTrainTime: '2026-10-09 10:15:00',
  },
  {
    id: 'm-8',
    name: '网卡发送丢包率 (Tx Dropped)',
    type: '单指标异常检测',
    currentValue: '0.04%',
    aiConclusion: '正常',
    totalAlerts: '430',
    aiScore: '0.94',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-12 18:30:11',
    lastTrainTime: '2026-10-09 15:20:00',
  },
  {
    id: 'm-9',
    name: '交换分区使用率 (Swap Usage)',
    type: '单指标异常检测',
    currentValue: '12.8%',
    aiConclusion: '正常',
    totalAlerts: '310',
    aiScore: '0.89',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-11 09:12:35',
    lastTrainTime: '2026-10-10 14:10:00',
  },
  {
    id: 'm-10',
    name: '进程句柄打开数 (File Descriptors)',
    type: '单指标异常检测',
    currentValue: '28,450',
    aiConclusion: '异常',
    totalAlerts: '2150',
    aiScore: '0.79',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 06:20:45',
    lastTrainTime: '2026-10-10 18:30:00',
  },

  // 11 ~ 18: 动态阈值
  {
    id: 'm-11',
    name: '近5分钟平均CPU利用率',
    type: '动态阈值',
    isDisabled: true,
    currentValue: '--',
    upperLimit: '--',
    lowerLimit: '--',
    totalAlerts: '--',
    aiScore: '0.77',
    lastCheckTime: '--',
    lastAlertTime: '--',
    lastTrainTime: '2026-10-05 13:15:30',
  },
  {
    id: 'm-12',
    name: '接口接收丢包数 (sub_resname)',
    type: '动态阈值',
    currentValue: '61%',
    upperLimit: '59%',
    lowerLimit: '13%',
    totalAlerts: '3155',
    aiScore: '0.77',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 09:30:23',
    lastTrainTime: '2026-10-05 13:15:30',
  },
  {
    id: 'm-13',
    name: '微服务网关HTTP响应延迟动态基线',
    type: '动态阈值',
    currentValue: '128ms',
    upperLimit: '150ms',
    lowerLimit: '30ms',
    totalAlerts: '1420',
    aiScore: '0.88',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-15 21:40:15',
    lastTrainTime: '2026-10-07 10:20:00',
  },
  {
    id: 'm-14',
    name: '数据库活跃连接数动态包络',
    type: '动态阈值',
    currentValue: '340',
    upperLimit: '420',
    lowerLimit: '80',
    totalAlerts: '890',
    aiScore: '0.91',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-14 16:55:00',
    lastTrainTime: '2026-10-08 11:30:00',
  },
  {
    id: 'm-15',
    name: 'JVM老年代堆内存占用动态阈值',
    type: '动态阈值',
    currentValue: '76.5%',
    upperLimit: '85.0%',
    lowerLimit: '25.0%',
    totalAlerts: '1640',
    aiScore: '0.86',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 05:10:20',
    lastTrainTime: '2026-10-09 13:45:00',
  },
  {
    id: 'm-16',
    name: '存储卷读写响应延迟 (Latency)',
    type: '动态阈值',
    currentValue: '4.8ms',
    upperLimit: '8.0ms',
    lowerLimit: '0.5ms',
    totalAlerts: '760',
    aiScore: '0.93',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-13 14:22:18',
    lastTrainTime: '2026-10-10 09:15:00',
  },
  {
    id: 'm-17',
    name: '接口发送队列长度 (Tx Queue)',
    type: '动态阈值',
    currentValue: '35',
    upperLimit: '50',
    lowerLimit: '0',
    totalAlerts: '510',
    aiScore: '0.89',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-12 11:04:30',
    lastTrainTime: '2026-10-11 15:30:00',
  },
  {
    id: 'm-18',
    name: '消息队列消费积压数动态包络',
    type: '动态阈值',
    currentValue: '124条',
    upperLimit: '500条',
    lowerLimit: '0条',
    totalAlerts: '980',
    aiScore: '0.87',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-15 19:35:42',
    lastTrainTime: '2026-10-12 10:20:00',
  },

  // 19 ~ 25: 回归预测
  {
    id: 'm-19',
    name: '内存利用率',
    type: '回归预测',
    currentValue: '61%',
    upperLimit: '59%',
    lowerLimit: '13%',
    totalAlerts: '3155',
    aiScore: '0.77',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 09:30:23',
    lastTrainTime: '2026-10-05 13:15:30',
  },
  {
    id: 'm-20',
    name: '接口接收速率 (sub_resname)',
    type: '回归预测',
    currentValue: '61%',
    upperLimit: '59%',
    lowerLimit: '13%',
    totalAlerts: '3155',
    aiScore: '0.77',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 09:30:23',
    lastTrainTime: '2026-10-05 13:15:30',
  },
  {
    id: 'm-21',
    name: '磁盘存储空间耗尽时间预测 (Days to Full)',
    type: '回归预测',
    currentValue: '28天',
    upperLimit: '90天',
    lowerLimit: '7天',
    totalAlerts: '1840',
    aiScore: '0.91',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-15 14:10:00',
    lastTrainTime: '2026-10-08 17:30:00',
  },
  {
    id: 'm-22',
    name: '出口带宽峰值容量预测 (Egress Bandwidth)',
    type: '回归预测',
    currentValue: '8.4Gbps',
    upperLimit: '9.2Gbps',
    lowerLimit: '2.0Gbps',
    totalAlerts: '2100',
    aiScore: '0.89',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 01:25:00',
    lastTrainTime: '2026-10-09 11:45:00',
  },
  {
    id: 'm-23',
    name: 'CPU温度与散热负荷预测 (Temperature)',
    type: '回归预测',
    currentValue: '68°C',
    upperLimit: '75°C',
    lowerLimit: '40°C',
    totalAlerts: '1290',
    aiScore: '0.85',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-14 12:40:00',
    lastTrainTime: '2026-10-10 16:10:00',
  },
  {
    id: 'm-24',
    name: '日志盘写入吞吐预测 (Log IOPS Trend)',
    type: '回归预测',
    currentValue: '1,450 IOPS',
    upperLimit: '2,200 IOPS',
    lowerLimit: '300 IOPS',
    totalAlerts: '1620',
    aiScore: '0.90',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-15 08:50:00',
    lastTrainTime: '2026-10-11 13:20:00',
  },
  {
    id: 'm-25',
    name: 'GPU算力集群显存分配预测 (VRAM Allocation)',
    type: '回归预测',
    currentValue: '21.4GB',
    upperLimit: '23.0GB',
    lowerLimit: '4.0GB',
    totalAlerts: '1980',
    aiScore: '0.93',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 04:15:30',
    lastTrainTime: '2026-10-12 14:40:00',
  },

  // 26 ~ 30: 多指标异常检测
  {
    id: 'm-26',
    name: 'CPU利用率，内存利用率',
    type: '多指标异常检测',
    currentValue: '61%, 74%',
    aiConclusion: '正常',
    totalAlerts: '3155',
    aiScore: '0.77',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 09:30:23',
    lastTrainTime: '2026-10-05 13:15:30',
  },
  {
    id: 'm-27',
    name: '网络丢包率，重传率，往返时延 (RTT)',
    type: '多指标异常检测',
    currentValue: '1.2%, 0.8%, 42ms',
    aiConclusion: '异常',
    totalAlerts: '2410',
    aiScore: '0.88',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 08:12:00',
    lastTrainTime: '2026-10-07 15:50:00',
  },
  {
    id: 'm-28',
    name: '磁盘读写延迟，IOPS，I/O队列深度',
    type: '多指标异常检测',
    currentValue: '6.2ms, 1850, 14',
    aiConclusion: '正常',
    totalAlerts: '1360',
    aiScore: '0.91',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-14 17:35:10',
    lastTrainTime: '2026-10-09 10:30:00',
  },
  {
    id: 'm-29',
    name: '数据库连接数，慢SQL耗时，行锁等待数',
    type: '多指标异常检测',
    currentValue: '380, 1.4s, 8',
    aiConclusion: '异常',
    totalAlerts: '2890',
    aiScore: '0.84',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-16 07:45:20',
    lastTrainTime: '2026-10-11 11:25:00',
  },
  {
    id: 'm-30',
    name: '微服务响应时间，调用错误率，吞吐量',
    type: '多指标异常检测',
    currentValue: '85ms, 0.02%, 4800QPS',
    aiConclusion: '正常',
    totalAlerts: '1750',
    aiScore: '0.92',
    lastCheckTime: '2026-10-16 09:30:23',
    lastAlertTime: '2026-10-15 22:10:05',
    lastTrainTime: '2026-10-13 16:00:00',
  },
];

export const ModelBoardView: React.FC<ModelBoardViewProps> = ({
  sn = 'SN-46567',
  mgmtIp = '220.10.51.15',
  bizIp = '220.10.51.80',
  onBack,
}) => {
  const [filterType, setFilterType] = useState<string>('全部类型');
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filter models
  const filteredModels = useMemo(() => {
    if (!filterType || filterType === '全部类型') return INITIAL_MODELS;
    return INITIAL_MODELS.filter((m) => m.type.includes(filterType) || filterType.includes(m.type));
  }, [filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredModels.length / pageSize));

  // Current page models
  const paginatedModels = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredModels.slice(startIndex, startIndex + pageSize);
  }, [filteredModels, currentPage]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-cyan-400" />
          <span>模型看板</span>
        </h2>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回上一页</span>
          </button>
        )}
      </div>

      {/* Main Grid Layout: Left Column (纳管模型总览) + Right Column (纳管模型看板) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ===================== LEFT COLUMN: 纳管模型总览 ===================== */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-6">
          <h3 className="text-sm font-bold text-white border-l-4 border-cyan-400 pl-3">纳管模型总览</h3>

          {/* Device and Metadata Box */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">统计时间:</span>
              <span className="font-mono text-cyan-300 font-semibold">2026-10-13 16:36 - 2026-10-16 16:36</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">纳管对象:</span>
              <span className="text-sky-400 font-mono font-bold hover:underline cursor-pointer">Server {sn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">管理IP地址:</span>
              <span className="font-mono text-slate-200">{mgmtIp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">业务IP地址:</span>
              <span className="font-mono text-slate-200">{bizIp}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">已纳管模型</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white font-mono">{INITIAL_MODELS.length}</span>
                <span className="text-xs text-slate-400">项</span>
              </div>
            </div>
          </div>

          {/* 3 Sky/Cyan Gradient Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl p-3 text-white shadow-lg shadow-sky-500/10 space-y-1">
              <div className="text-[11px] text-sky-100 font-medium">已检测告警数量</div>
              <div className="text-lg font-bold font-mono tracking-tight">13568</div>
            </div>

            <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl p-3 text-white shadow-lg shadow-sky-500/10 space-y-1">
              <div className="text-[11px] text-sky-100 font-medium">重大告警占比</div>
              <div className="text-lg font-bold font-mono tracking-tight">18%</div>
            </div>

            <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl p-3 text-white shadow-lg shadow-sky-500/10 space-y-1">
              <div className="text-[11px] text-sky-100 font-medium">高级告警占比</div>
              <div className="text-lg font-bold font-mono tracking-tight">18%</div>
            </div>
          </div>

          {/* Matrix Section: 数据类型 | 问题场景 | 模型训练历史 */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800 text-xs">
            {/* Sub-col 1: 数据类型 */}
            <div className="space-y-3">
              <div className="text-slate-400 font-semibold text-[11px]">数据类型</div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-300">时间序列</div>
                    <div className="font-bold font-mono text-white text-xs">20项</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-300">表格数据</div>
                    <div className="font-bold font-mono text-white text-xs">6项</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-300">日志</div>
                    <div className="font-bold font-mono text-white text-xs">2项</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-300">告警</div>
                    <div className="font-bold font-mono text-white text-xs">2项</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-col 2: 问题场景 */}
            <div className="space-y-3">
              <div className="text-slate-400 font-semibold text-[11px]">问题场景</div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-300">异常检测</div>
                    <div className="font-bold font-mono text-white text-xs">15项</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-300">动态阈值</div>
                    <div className="font-bold font-mono text-white text-xs">8项</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-300">回归/预测</div>
                    <div className="font-bold font-mono text-white text-xs">7项</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-col 3: 模型训练历史 */}
            <div className="space-y-3">
              <div className="text-slate-400 font-semibold text-[11px]">模型训练历史</div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">训练成功</span>
                  <span className="text-emerald-400 font-bold font-mono text-xs">22</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">训练失败</span>
                  <span className="text-rose-400 font-bold font-mono text-xs underline cursor-pointer">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">训练中</span>
                  <span className="text-cyan-300 font-bold font-mono text-xs underline cursor-pointer">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">已禁用</span>
                  <span className="text-slate-200 font-bold font-mono text-xs underline cursor-pointer">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">待发布</span>
                  <span className="text-slate-200 font-bold font-mono text-xs underline cursor-pointer">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT COLUMN: 纳管模型看板 ===================== */}
        <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header & Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">纳管模型看板</h3>
                <span className="text-xs text-slate-400 font-mono">
                  (显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredModels.length)} 条，共 {filteredModels.length} 条)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">模型问题类型:</span>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="全部类型">全部类型 (30项)</option>
                  <option value="单指标异常检测">单指标异常检测 (10项)</option>
                  <option value="动态阈值">动态阈值 (8项)</option>
                  <option value="回归预测">回归预测 (7项)</option>
                  <option value="多指标异常检测">多指标异常检测 (5项)</option>
                </select>
              </div>
            </div>

            {/* Model Card List (Paginated with exactly 10 items/page) */}
            <div className="space-y-3">
              {paginatedModels.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedModel(item)}
                  className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-md"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                    {/* Col 1: Model Title + Badges + Values */}
                    <div className="md:col-span-6 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                          {item.name}
                        </span>
                        {item.isDisabled && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            已停用
                          </span>
                        )}
                      </div>

                      <div className="text-slate-400 text-[11px]">{item.type}</div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] pt-0.5">
                        <span className="text-slate-300">当前: <strong className="text-white font-mono">{item.currentValue}</strong></span>
                        {item.upperLimit && (
                          <span className="text-slate-400">上限: <strong className="text-slate-200 font-mono">{item.upperLimit}</strong></span>
                        )}
                        {item.lowerLimit && (
                          <span className="text-slate-400">下限: <strong className="text-slate-200 font-mono">{item.lowerLimit}</strong></span>
                        )}
                        {item.aiConclusion && (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">AI监控结论:</span>
                            {item.aiConclusion === '异常' ? (
                              <span className="bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.5 rounded border border-rose-500/30 text-[11px]">
                                指标异常
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-bold text-[11px]">
                                当前指标正常
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Col 2: Stat Numbers */}
                    <div className="md:col-span-2 text-left space-y-1 border-l border-slate-800/60 pl-3">
                      <div className="text-slate-400 text-[11px]">总告警数</div>
                      <div className="font-bold font-mono text-white text-sm">{item.totalAlerts}</div>

                      <div className="text-slate-400 text-[11px] pt-1">AI模型Score</div>
                      <div className="font-bold font-mono text-cyan-400 text-sm">{item.aiScore}</div>
                    </div>

                    {/* Col 3: Timestamps */}
                    <div className="md:col-span-3 text-slate-400 text-[11px] space-y-1 font-mono border-l border-slate-800/60 pl-3">
                      <div>最新检测点: <span className="text-slate-200">{item.lastCheckTime}</span></div>
                      <div>最新告警: <span className="text-slate-200">{item.lastAlertTime}</span></div>
                      <div>上次训练: <span className="text-slate-200">{item.lastTrainTime}</span></div>
                    </div>

                    {/* Col 4: Chevron Right Arrow */}
                    <div className="md:col-span-1 flex justify-end">
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Pagination Bar (Fully Interactive matching 10 items/page) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <div>共{filteredModels.length}条记录 第{currentPage}/{totalPages}页</div>
            <div className="flex items-center gap-1 font-mono">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 cursor-pointer"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 cursor-pointer"
              >
                &gt;
              </button>
              <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 ml-2">
                <option>10条/页</option>
              </select>
              <span className="ml-2">跳至</span>
              <input
                type="text"
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1 && val <= totalPages) {
                    setCurrentPage(val);
                  }
                }}
                className="w-10 bg-slate-900 border border-slate-800 text-center text-white rounded py-0.5"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MODEL DETAIL INSPECT MODAL ===================== */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl shadow-cyan-950/50 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>模型监控详情 - {selectedModel.name}</span>
              </h3>
              <button onClick={() => setSelectedModel(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>模型名称: <span className="text-cyan-300 font-bold font-sans">{selectedModel.name}</span></div>
                <div>模型类型: <span className="text-white font-sans">{selectedModel.type}</span></div>
                <div>当前数值: <span className="text-white">{selectedModel.currentValue}</span></div>
                <div>AI Score: <span className="text-cyan-400">{selectedModel.aiScore}</span></div>
                <div>最新检测点: <span className="text-slate-200">{selectedModel.lastCheckTime}</span></div>
                <div>上次训练: <span className="text-slate-200">{selectedModel.lastTrainTime}</span></div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 text-cyan-300 font-sans leading-relaxed">
                📊 AI 推理算法已根据过去 30 天时序特征建立概率包络区，当前离群概率符合 99.2% 置信度分布。
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedModel(null)}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
