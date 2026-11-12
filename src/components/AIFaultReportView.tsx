import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  Filter,
  Eye,
  RefreshCw,
  Search,
  Zap,
  Server,
  Terminal,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Scatter,
} from 'recharts';

interface AIFaultReportViewProps {
  onOpenRootCause?: (alarmId: string) => void;
}

// 近7日预测故障数与告警数统计 (2026-10-10 ~ 2026-10-16 近期数据)
const DAILY_PREDICTION_STATS = [
  { date: '10.10', predictFaults: 3, totalAlerts: 1 },
  { date: '10.11', predictFaults: 6, totalAlerts: 2 },
  { date: '10.12', predictFaults: 4, totalAlerts: 1 },
  { date: '10.13', predictFaults: 3, totalAlerts: 2 },
  { date: '10.14', predictFaults: 5, totalAlerts: 8 },
  { date: '10.15', predictFaults: 4, totalAlerts: 2 },
  { date: '10.16', predictFaults: 5, totalAlerts: 7 },
];

// 故障趋势时间轴 (近期时间 2026-10-16 12:55:00 - 14:30:00)
const BUBBLE_TIMELINE_PREDICT = [
  { time: '12:55', value: 1, size: 18, label: 'CPU异常预测' },
  { time: '13:00', value: 1, size: 24, label: '内存泄露预警' },
  { time: '13:05', value: 1, size: 30, label: '网络接口包丢失' },
  { time: '13:10', value: 1, size: 36, label: 'SAN存储死锁风险' },
  { time: '13:15', value: 1, size: 28, label: '软中断饱和' },
  { time: '13:30', value: 1, size: 20, label: 'BBU电池降级' },
  { time: '13:35', value: 1, size: 26, label: 'GC停顿预警' },
  { time: '13:40', value: 1, size: 16, label: 'TCP重传突增' },
  { time: '13:45', value: 1, size: 22, label: '磁盘队列超标' },
  { time: '13:50', value: 1, size: 28, label: '连接池逼近上限' },
  { time: '13:55', value: 1, size: 34, label: '微服务响应延迟' },
  { time: '14:00', value: 1, size: 38, label: 'CPU负载突破95%' },
  { time: '14:05', value: 1, size: 40, label: '网络拥塞风险' },
  { time: '14:20', value: 1, size: 24, label: '日志分区容量不足' },
  { time: '14:25', value: 1, size: 18, label: '线程阻塞隐患' },
  { time: '14:30', value: 1, size: 22, label: '网络中断故障预测' },
];

const BUBBLE_TIMELINE_ANOMALY = [
  { time: '12:55', value: 1, size: 22, label: 'NMS网管告警' },
  { time: '13:00', value: 1, size: 16, label: 'AI指标离群' },
  { time: '13:05', value: 1, size: 28, label: 'CPU软中断溢出' },
  { time: '13:10', value: 1, size: 32, label: '丢包率达到6.4%' },
  { time: '13:15', value: 1, size: 36, label: '端口Down预警' },
  { time: '13:30', value: 1, size: 24, label: '内存利用率88%' },
  { time: '13:35', value: 1, size: 18, label: 'I/O读写延迟48ms' },
  { time: '13:40', value: 1, size: 22, label: '网卡Rx错包率升高' },
  { time: '13:45', value: 1, size: 26, label: '系统句柄占用92%' },
  { time: '13:50', value: 1, size: 16, label: 'SWAP交换区频繁读写' },
  { time: '13:55', value: 1, size: 30, label: '数据库响应耗时突增' },
  { time: '14:00', value: 1, size: 32, label: '网关抖动加剧' },
  { time: '14:05', value: 1, size: 38, label: '流量旁路失败' },
  { time: '14:20', value: 1, size: 22, label: '磁盘剩余空间5%' },
  { time: '14:25', value: 1, size: 20, label: '链路光衰异常' },
  { time: '14:30', value: 1, size: 18, label: '接口心跳丢包' },
];

// 性能指标时序数据 (2026-10-16 近期 12:55 ~ 14:30)
const PERFORMANCE_METRICS_DATA = [
  { time: '12:55', cpu: 28, mem: 30, netRate: 15, ioQueue: 2, trigger: null },
  { time: '13:00', cpu: 32, mem: 34, netRate: 38, ioQueue: 5, trigger: null },
  { time: '13:05', cpu: 30, mem: 36, netRate: 62, ioQueue: 4, trigger: null },
  { time: '13:10', cpu: 28, mem: 38, netRate: 12, ioQueue: 3, trigger: null },
  { time: '13:15', cpu: 26, mem: 37, netRate: 48, ioQueue: 2, trigger: null },
  { time: '13:20', cpu: 25, mem: 28, netRate: 8, ioQueue: 1, trigger: null },
  { time: '13:25', cpu: 35, mem: 32, netRate: 12, ioQueue: 8, trigger: 52 },
  { time: '13:30', cpu: 40, mem: 82, netRate: 58, ioQueue: 0, trigger: 82, isFaultPoint: true },
  { time: '13:35', cpu: 42, mem: 68, netRate: 30, ioQueue: 2, trigger: 68, isFaultPoint: true },
  { time: '13:40', cpu: 32, mem: 42, netRate: 12, ioQueue: 1, trigger: null },
  { time: '13:45', cpu: 24, mem: 26, netRate: 8, ioQueue: 0, trigger: null },
  { time: '13:50', cpu: 20, mem: 18, netRate: 5, ioQueue: 0, trigger: null },
  { time: '13:55', cpu: 18, mem: 14, netRate: 12, ioQueue: 0, trigger: null },
  { time: '14:00', cpu: 22, mem: 12, netRate: 88, ioQueue: 3, trigger: null },
  { time: '14:05', cpu: 30, mem: 24, netRate: 64, ioQueue: 2, trigger: null },
  { time: '14:10', cpu: 22, mem: 32, netRate: 18, ioQueue: 1, trigger: null },
  { time: '14:15', cpu: 15, mem: 38, netRate: 65, ioQueue: 4, trigger: 65 },
  { time: '14:20', cpu: 12, mem: 36, netRate: 82, ioQueue: 8, trigger: null },
  { time: '14:25', cpu: 10, mem: 34, netRate: 90, ioQueue: 12, trigger: null },
  { time: '14:30', cpu: 8, mem: 32, netRate: 95, ioQueue: 15, trigger: 95, isFaultPoint: true },
];

// 1. AI故障预测告警数据 (严格按时间降序排列，近期 2026-10-16)
const AI_PREDICT_ALERTS = [
  {
    seq: 1,
    isNew: true,
    checkTime: '2026-10-16 16:30:00',
    alarmTime: '2026-10-16 16:31:00',
    level: '严重',
    title: '网络中断故障预测',
    body: '未来1小时内，2026-10-16 16:30:00 至 2026-10-16 17:30:00，虚拟机 SN-46567 发生 网络中断 故障概率达65%；触发原因为cpu利用率异常检测告警，cpu_rate>75%|网络数据包速率异常检测告警，data_I/O_rate<35kb|异常日志级别严重，记录内容虚拟机 SN-46567 产生网管告警。未来2小时内，2026-10-16 16:30:00 至 2026-10-16 18:30:00，虚拟机 SN-46567 发生 网络中断 故障概率达75%；触发原因为未来3小时内，2026-10-16 16:30:00 至 2026-10-16 19:30:00，虚拟机 SN-46567 发生 网络中断 故障概率达85%；触发原因为...',
  },
  {
    seq: 2,
    isNew: true,
    checkTime: '2026-10-16 15:30:00',
    alarmTime: '2026-10-16 15:30:00',
    level: '致命',
    title: '存储空间不足风险预测',
    body: '虚拟机SN-8379952的存储空间在接下来的1小时内将耗尽，当前使用率已达到98%，触发告警条件为storage_usage>95%。可能导致业务中断，请立即采取措施释放存储空间。',
  },
  {
    seq: 3,
    isNew: false,
    checkTime: '2026-10-16 14:15:00',
    alarmTime: '2026-10-16 14:15:00',
    level: '一般',
    title: 'CPU使用率过高预测',
    body: '虚拟机SN-775589的CPU使用率在过去1小时内持续超过80%，触发告警条件为cpu_usage>80%。建议检查相关进程并优化资源分配。',
  },
  {
    seq: 4,
    isNew: false,
    checkTime: '2026-10-16 12:45:00',
    alarmTime: '2026-10-16 12:45:00',
    level: '严重',
    title: 'SAN存储死锁与IO排队过载预测',
    body: '预计未来2小时内SAN存储控制器阵列01将发生IO死锁，磁盘等待队列大于45个请求，读写时延陡增至180ms，触发原因为多线程文件锁定竞争。',
  },
  {
    seq: 5,
    isNew: false,
    checkTime: '2026-10-16 10:20:00',
    alarmTime: '2026-10-16 10:20:00',
    level: '重要',
    title: 'BBU电池定期自检降级风险预警',
    body: 'RAID卡BBU电池放电测试显示电容衰减超25%，未来22小时内Write-Back模式有降级为Write-Through风险，写性能预计下降60%。',
  },
  {
    seq: 6,
    isNew: false,
    checkTime: '2026-10-15 22:10:00',
    alarmTime: '2026-10-15 22:10:00',
    level: '一般',
    title: 'TCP连接池套接字泄露预警',
    body: 'JVM老年代内存占用达到89%，CLOSE_WAIT状态连接数达4,200个，预计未来4小时内引发OutOfMemoryError溢出故障。',
  },
  {
    seq: 7,
    isNew: false,
    checkTime: '2026-10-15 18:30:00',
    alarmTime: '2026-10-15 18:30:00',
    level: '重要',
    title: '日志分区容量水位暴涨预警',
    body: '/var/log 挂载分区日志写入速率异常翻倍 (12MB/s)，预计未来6小时内达到 100% 满盘阈值，引发系统级读写锁保护。',
  },
];

// 2. AI异常检测告警 (降序)
const AI_ANOMALY_ALERTS = [
  {
    seq: 1,
    time: '2026-10-16 16:25:00',
    metric: '主机cpu利用率',
    val: '94.2%',
    baseline: '35.0%',
    level: '重大告警',
    title: 'CPU内核#3软中断持续100%离群',
  },
  {
    seq: 2,
    time: '2026-10-16 15:10:00',
    metric: '网络数据包丢包率',
    val: '6.42%',
    baseline: '0.01%',
    level: '高级告警',
    title: 'GE 1/1/1网卡Rx接口丢包突增',
  },
  {
    seq: 3,
    time: '2026-10-16 13:40:00',
    metric: '内存使用率',
    val: '88.5%',
    baseline: '45.0%',
    level: '中级告警',
    title: 'JVM堆外内存占用偏离包络线',
  },
  {
    seq: 4,
    time: '2026-10-16 11:15:00',
    metric: '磁盘I/O等待耗时',
    val: '48.2ms',
    baseline: '2.5ms',
    level: '高级告警',
    title: 'SATA SSD写延迟异常偏高',
  },
];

// 3. 网管中心告警 (降序)
const NMS_ALERTS = [
  {
    seq: 1,
    time: '2026-10-16 16:30:05',
    source: '网管中心',
    level: '重大',
    title: '呼池015虚拟节点网络接口Flapping中断',
    body: '核心交换机SW-01检测到端口GE0/1状态频繁Up/Down',
  },
  {
    seq: 2,
    time: '2026-10-16 15:00:12',
    source: '网管中心',
    level: '高',
    title: 'SAN存储控制器B通道链路通信丢失',
    body: 'FC光纤通道光衰减大于15dB，冗余链路已切换',
  },
  {
    seq: 3,
    time: '2026-10-16 12:20:00',
    source: '网管中心',
    level: '中',
    title: '主机硬件风扇转速告警',
    body: '服务器01号散热风扇转速下降至1200 RPM',
  },
];

// 日志数据 (严格降序 2026-10-16)
const LOG_DATA = [
  {
    seq: 1,
    time: '2026-10-16 16:30:00',
    category: 'System',
    service: 'kernel',
    program: 'systemd',
    level: 'ERROR',
    tag: 'net_drop',
    body: 'kernel: [198234.102] eth0: rx_dropped exceeded 1400/s threshold, softirq cpu#3 bottleneck',
  },
  {
    seq: 2,
    time: '2026-10-16 15:30:00',
    category: 'Storage',
    service: 'stor-daemon',
    program: 'stor-cli',
    level: 'CRITICAL',
    tag: 'disk_full',
    body: 'stor-daemon: /dev/sdb1 mount threshold reached 98.2%. Free capacity < 2.1GB.',
  },
  {
    seq: 3,
    time: '2026-10-16 14:15:00',
    category: 'Application',
    service: 'CRM-Core',
    program: 'java',
    level: 'WARN',
    tag: 'gc_pause',
    body: 'java[18902]: [GC (Allocation Failure) [PSYoungGen: 409600K->6210K] 820100K->412000K, 0.4210921 secs]',
  },
  {
    seq: 4,
    time: '2026-10-16 12:45:00',
    category: 'Database',
    service: 'MySQL-Cluster',
    program: 'mysqld',
    level: 'ERROR',
    tag: 'conn_overflow',
    body: 'mysqld[2210]: Aborted connection 14920 to db: "crm_db" user: "app_usr" (Got timeout reading communication packets)',
  },
  {
    seq: 5,
    time: '2026-10-16 10:20:00',
    category: 'Hardware',
    service: 'IPMI-Driver',
    program: 'ipmitool',
    level: 'WARN',
    tag: 'bbu_degraded',
    body: 'ipmitool: Sensor BBU_Battery_Status reported 0x04 (Learn Cycle In Progress, Capacity -26%)',
  },
];

// 事件数据 (严格降序 2026-10-16)
const EVENT_DATA = [
  {
    seq: 1,
    time: '2026-10-16 16:30:00',
    source: 'CRM',
    type: '漏洞升级',
    title: 'CRM核心服务安全补丁在线更新',
    content: '发布单 #PATCH-20261016-09 已对 呼池-虚拟015 完成微服务安全补丁热加载。',
  },
  {
    seq: 2,
    time: '2026-10-16 13:30:00',
    source: 'CMDB',
    type: '服务重启',
    title: '节点SWAP交换空间热清洗',
    content: '运维自动化脚本自动触发了SWAP虚拟内存热回收与缓存刷盘动作。',
  },
  {
    seq: 3,
    time: '2026-10-16 11:00:00',
    source: 'CloudPlatform',
    type: '配置变更',
    title: '呼池015带宽QoS策略调整',
    content: '流量控制引擎将虚拟节点入口带宽限制提升至 10Gbps。',
  },
  {
    seq: 4,
    time: '2026-10-15 21:15:00',
    source: 'Kubernetes',
    type: '节点扩容',
    title: 'CRM-Dispatch 弹性Pod扩容完成',
    content: '检测到业务请求高峰，自动横向扩容 4 个 Worker Pod 节点。',
  },
];

export const AIFaultReportView: React.FC<AIFaultReportViewProps> = ({ onOpenRootCause }) => {
  // Main Panel Tabs: '告警' | '性能指标' | '日志' | '事件'
  const [mainTab, setMainTab] = useState<'告警' | '性能指标' | '日志' | '事件'>('告警');

  // Alarm Sub Tabs: 'AI故障预测' | 'AI异常检测' | '网管中心'
  const [alarmSubTab, setAlarmSubTab] = useState<'AI故障预测' | 'AI异常检测' | '网管中心'>('AI故障预测');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-fadeIn pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-sky-500/90 border border-sky-400 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Information Bar (Matches Screenshot 1 Header) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">监控时间：</span>
            <span className="text-sky-400 font-semibold">2026-10-09 16:36 - 2026-10-16 16:36</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">监控对象：</span>
            <span className="text-sky-400 font-bold hover:underline cursor-pointer">虚拟机</span>
            <span className="text-sky-300 font-bold hover:underline cursor-pointer">SN-46567</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">IP地址：</span>
            <span className="text-cyan-400 font-bold hover:underline cursor-pointer">220.10.51.15</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">业务系统：</span>
            <span className="text-sky-300 font-semibold">CRM</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">操作系统：</span>
            <span className="text-slate-200">Linux 63.5.28</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">资源池：</span>
            <span className="text-sky-300 font-medium">省级IT云|华北二|呼池|呼池-虚拟015</span>
          </div>
        </div>
      </div>

      {/* Main Container Header: ▶ AI故障预测报告 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-sky-400 text-sm">▶</span>
            <span>AI故障预测报告</span>
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => showToast('已成功刷新AI故障预测报告数据')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>刷新报告</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: 故障预测统计 (Matches Screenshot 1) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>故障预测统计</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Big Totals */}
            <div className="lg:col-span-4 space-y-5 bg-slate-900/60 p-5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm font-medium">预测故障总数：</span>
                <span className="text-4xl font-extrabold text-rose-500 font-mono tracking-tight">41</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-300 text-sm font-medium block">告警总数：</span>
                  <span className="text-[11px] text-slate-500 block">(AI异常检测和网管告警总数)</span>
                </div>
                <span className="text-3xl font-extrabold text-amber-500 font-mono tracking-tight">35</span>
              </div>
            </div>

            {/* Right Chart: 近7日每日预测故障数和其他告警总数统计 */}
            <div className="lg:col-span-8 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 h-48">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span className="text-sky-300 font-medium">近7日每日预测故障数和其他告警总数统计</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 预测故障数
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 告警数
                  </span>
                </div>
              </div>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DAILY_PREDICTION_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradFaults" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradAlerts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="predictFaults" stroke="#f43f5e" strokeWidth={2.5} fill="url(#gradFaults)" name="预测故障数" />
                    <Area type="monotone" dataKey="totalAlerts" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradAlerts)" name="告警数" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom 3 Summary Sub-Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Sub-Card 1: 告警统计 */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-white text-sm font-sans border-b border-slate-800 pb-2">告警统计</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">AI异常检测指标数</span>
                  <span className="text-white font-bold font-mono">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">AI异常检测告警总数</span>
                  <span className="text-white font-bold font-mono">14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">AI故障预测告警总数</span>
                  <span className="text-white font-bold font-mono">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">网管告警总数</span>
                  <span className="text-white font-bold font-mono">28</span>
                </div>
              </div>
            </div>

            {/* Sub-Card 2: 历史预测 */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-white text-sm font-sans border-b border-slate-800 pb-2">历史预测</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">已预测历史故障数</span>
                  <span className="text-white font-bold font-mono">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">已预测历史故障告警数</span>
                  <span className="text-white font-bold font-mono">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">平均超前预警时间</span>
                  <span className="text-sky-300 font-bold font-mono">3.5h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">最长超前预警时间</span>
                  <span className="text-emerald-400 font-bold font-mono">5h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">最短超前预警时间</span>
                  <span className="text-amber-400 font-bold font-mono">1h</span>
                </div>
              </div>
            </div>

            {/* Sub-Card 3: 最新预测 */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-white text-sm font-sans border-b border-slate-800 pb-2">最新预测</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">预测即将发生故障数</span>
                  <span className="text-white font-bold font-mono">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">预测即将发生故障告警数</span>
                  <span className="text-white font-bold font-mono">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">预测最近发生故障时间</span>
                  <span className="text-cyan-300 font-bold font-mono text-[11px]">2026-10-16 18:45:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 font-sans block">预测最近发生故障概率</span>
                    <span className="text-[10px] text-slate-500 font-sans block">(预测发生概率超80%时标红)</span>
                  </div>
                  <span className="text-2xl font-black text-rose-500 font-mono">88%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: 故障趋势图 (Matches Screenshot 2) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>故障趋势图</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">近期时间粒度: 5min (2026-10-16 12:55:00 - 14:30:00)</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Timeline Row 1: AI故障预测告警 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  AI故障预测告警
                </span>
                <span className="text-slate-500 font-mono text-[11px]">气泡大小代表离群概率或风险等级</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 h-24 relative overflow-x-auto">
                <div className="flex items-center justify-between min-w-[700px] h-full relative px-4">
                  {/* Axis Line */}
                  <div className="absolute left-4 right-4 top-1/2 h-[1px] bg-slate-700" />

                  {BUBBLE_TIMELINE_PREDICT.map((item, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center group cursor-pointer">
                      <div
                        style={{ width: `${item.size}px`, height: `${item.size}px` }}
                        className="rounded-full bg-emerald-400/30 border border-emerald-400 shadow-lg shadow-emerald-500/20 group-hover:bg-emerald-400 group-hover:scale-125 transition-all"
                      />
                      <span className="text-[10px] text-slate-400 font-mono mt-1">{item.time}</span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-950 border border-emerald-500 text-slate-200 text-[11px] p-2 rounded-lg whitespace-nowrap z-30 shadow-xl">
                        <span className="font-bold text-emerald-400">{item.label}</span>
                        <span>时间: 2026-10-16 {item.time}:00</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline Row 2: AI异常检测和网管告警 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  AI异常检测和网管告警
                </span>
                <span className="text-slate-500 font-mono text-[11px]">窗口区间: 2026-10-16 12:55:00 ~ 14:30:00</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 h-24 relative overflow-x-auto">
                <div className="flex items-center justify-between min-w-[700px] h-full relative px-4">
                  {/* Axis Line */}
                  <div className="absolute left-4 right-4 top-1/2 h-[1px] bg-slate-700" />

                  {BUBBLE_TIMELINE_ANOMALY.map((item, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center group cursor-pointer">
                      <div
                        style={{ width: `${item.size}px`, height: `${item.size}px` }}
                        className="rounded-full bg-sky-400/30 border border-sky-400 shadow-lg shadow-sky-500/20 group-hover:bg-sky-400 group-hover:scale-125 transition-all"
                      />
                      <span className="text-[10px] text-slate-400 font-mono mt-1">{item.time}</span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-950 border border-sky-500 text-slate-200 text-[11px] p-2 rounded-lg whitespace-nowrap z-30 shadow-xl">
                        <span className="font-bold text-sky-400">{item.label}</span>
                        <span>时间: 2026-10-16 {item.time}:00</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Main Navigation Tabbed Panel (Matches Screenshots 3, 4, 5, 6) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          {/* Main Tabs Header: [ 告警 ] [ 性能指标 ] [ 日志 ] [ 事件 ] */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            {(['告警', '性能指标', '日志', '事件'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  mainTab === tab
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-400/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ========================================================
              TAB 1: 告警 (Sub-Tabs: AI故障预测 | AI异常检测 | 网管中心)
             ======================================================== */}
          {mainTab === '告警' && (
            <div className="space-y-4">
              {/* Sub-Tabs Row */}
              <div className="flex items-center gap-2">
                {(['AI故障预测', 'AI异常检测', '网管中心'] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setAlarmSubTab(sub)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      alarmSubTab === sub
                        ? 'bg-slate-800 text-sky-400 font-bold border border-sky-500/50'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Sub-Tab 1.1: AI故障预测 表格 (Matches Screenshot 3) */}
              {alarmSubTab === 'AI故障预测' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/80 text-xs">
                    <table className="w-full text-left border-collapse font-mono">
                      <thead>
                        <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
                          <th className="py-3 px-3 w-14">序号</th>
                          <th className="py-3 px-3 w-40">检测时间</th>
                          <th className="py-3 px-3 w-40">告警时间</th>
                          <th className="py-3 px-3 w-24">告警级别</th>
                          <th className="py-3 px-3 w-48">告警标题</th>
                          <th className="py-3 px-3">告警正文</th>
                          <th className="py-3 px-3 text-center w-36">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {AI_PREDICT_ALERTS.map((row) => (
                          <tr key={row.seq} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-3 text-slate-400 text-center">{row.seq}</td>
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-1.5">
                                {row.isNew && (
                                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded border border-rose-500/30">
                                    New!
                                  </span>
                                )}
                                <span className="text-slate-200 font-mono">{row.checkTime}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-slate-300 font-mono">{row.alarmTime}</td>
                            <td className="py-3.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  row.level === '致命'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : row.level === '严重'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : row.level === '重要'
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {row.level}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-bold text-white font-sans">{row.title}</td>
                            <td className="py-3.5 px-3 font-sans text-slate-300 leading-relaxed max-w-xl text-[11px]">
                              {row.body}
                            </td>
                            <td className="py-3.5 px-3 text-center font-sans whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setMainTab('性能指标');
                                    showToast('已切换至 [性能指标] 时序推演图谱');
                                  }}
                                  className="text-sky-400 hover:text-sky-300 hover:underline font-medium"
                                >
                                  性能指标监控
                                </button>
                                <span className="text-slate-600">|</span>
                                <button
                                  onClick={() => {
                                    if (onOpenRootCause) onOpenRootCause(`ALM-PRED-${row.seq}`);
                                    showToast(`正在对告警 [${row.title}] 执行智能根因定位...`);
                                  }}
                                  className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
                                >
                                  根因分析
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>


                </div>
              )}

              {/* Sub-Tab 1.2: AI异常检测 表格 */}
              {alarmSubTab === 'AI异常检测' && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/80 text-xs">
                  <table className="w-full text-left border-collapse font-mono">
                    <thead>
                      <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                        <th className="py-3 px-3">序号</th>
                        <th className="py-3 px-3">检测时间</th>
                        <th className="py-3 px-3">检测指标</th>
                        <th className="py-3 px-3">实测值</th>
                        <th className="py-3 px-3">基线预测值</th>
                        <th className="py-3 px-3">告警级别</th>
                        <th className="py-3 px-3">异常描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {AI_ANOMALY_ALERTS.map((row) => (
                        <tr key={row.seq} className="hover:bg-slate-800/40">
                          <td className="py-3 px-3 text-slate-400">{row.seq}</td>
                          <td className="py-3 px-3 text-slate-300">{row.time}</td>
                          <td className="py-3 px-3 text-cyan-300 font-sans font-medium">{row.metric}</td>
                          <td className="py-3 px-3 text-rose-400 font-bold">{row.val}</td>
                          <td className="py-3 px-3 text-slate-400">{row.baseline}</td>
                          <td className="py-3 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[11px]">
                              {row.level}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-sans text-white">{row.title}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub-Tab 1.3: 网管中心 表格 */}
              {alarmSubTab === '网管中心' && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/80 text-xs">
                  <table className="w-full text-left border-collapse font-mono">
                    <thead>
                      <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                        <th className="py-3 px-3">序号</th>
                        <th className="py-3 px-3">发生时间</th>
                        <th className="py-3 px-3">来源</th>
                        <th className="py-3 px-3">级别</th>
                        <th className="py-3 px-3">告警标题</th>
                        <th className="py-3 px-3">告警正文</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {NMS_ALERTS.map((row) => (
                        <tr key={row.seq} className="hover:bg-slate-800/40">
                          <td className="py-3 px-3 text-slate-400">{row.seq}</td>
                          <td className="py-3 px-3 text-slate-300">{row.time}</td>
                          <td className="py-3 px-3 font-sans text-sky-400">{row.source}</td>
                          <td className="py-3 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[11px]">
                              {row.level}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-sans font-bold text-white">{row.title}</td>
                          <td className="py-3 px-3 font-sans text-slate-400">{row.body}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: 性能指标 (Matches Screenshot 4)
             ======================================================== */}
          {mainTab === '性能指标' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">虚拟机：</span>
                  <span className="text-cyan-400 font-bold">220.10.51.15</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <span className="w-3 h-0.5 bg-slate-200 inline-block" /> CPU利用率
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <span className="w-3 h-0.5 bg-sky-400 inline-block" /> 内存利用率
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> 网络数据包速率
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <span className="w-3 h-0.5 bg-purple-400 inline-block" /> 磁盘I/O队列
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> 预测故障触发点
                  </span>
                  <span className="flex items-center gap-1 text-rose-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 预测故障点
                  </span>
                </div>
              </div>

              <div className="h-80 w-full bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={PERFORMANCE_METRICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1">
                              <div className="text-slate-300 font-bold border-b border-slate-800 pb-1">
                                2026-10-16 {label}:00
                              </div>
                              <div className="text-slate-200">CPU利用率: <span className="font-bold text-white">{data.cpu}%</span></div>
                              <div className="text-sky-400">内存利用率: <span className="font-bold">{data.mem}%</span></div>
                              <div className="text-emerald-400">网络数据包速率: <span className="font-bold">{data.netRate}%</span></div>
                              <div className="text-purple-400">磁盘I/O队列: <span className="font-bold">{data.ioQueue}%</span></div>
                              <div className="text-amber-400 pt-1 border-t border-slate-800/80">
                                是否为预测故障触发点: <span className="font-bold">{data.trigger ? '是' : '否'}</span>
                              </div>
                              <div className="text-rose-400">
                                是否为预测故障点: <span className="font-bold">{data.isFaultPoint ? '是' : '否'}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="cpu" stroke="#e2e8f0" strokeWidth={1.5} dot={false} name="CPU利用率" />
                    <Line type="monotone" dataKey="mem" stroke="#38bdf8" strokeWidth={2} dot={false} name="内存利用率" />
                    <Line type="monotone" dataKey="netRate" stroke="#34d399" strokeWidth={2} dot={false} name="网络数据包速率" />
                    <Line type="monotone" dataKey="ioQueue" stroke="#c084fc" strokeWidth={1.5} dot={false} name="磁盘I/O队列" />
                    <Scatter dataKey="trigger" fill="#f59e0b" name="预测故障触发点" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: 日志 (Matches Screenshot 5)
             ======================================================== */}
          {mainTab === '日志' && (
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/80 text-xs">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                    <th className="py-3 px-3">序号</th>
                    <th className="py-3 px-3">产生时间</th>
                    <th className="py-3 px-3">类别</th>
                    <th className="py-3 px-3">服务</th>
                    <th className="py-3 px-3">程序</th>
                    <th className="py-3 px-3">重要级别</th>
                    <th className="py-3 px-3">标签</th>
                    <th className="py-3 px-3">日志正文</th>
                    <th className="py-3 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {LOG_DATA.map((row) => (
                    <tr key={row.seq} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-3 text-slate-400">{row.seq}</td>
                      <td className="py-3.5 px-3 text-slate-200">{row.time}</td>
                      <td className="py-3.5 px-3 font-sans text-sky-300">{row.category}</td>
                      <td className="py-3.5 px-3 font-sans text-slate-300">{row.service}</td>
                      <td className="py-3.5 px-3 text-slate-400">{row.program}</td>
                      <td className="py-3.5 px-3 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.level === 'CRITICAL' || row.level === 'ERROR'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {row.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-cyan-400 font-mono text-[11px]">{row.tag}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px] max-w-lg truncate">{row.body}</td>
                      <td className="py-3.5 px-3 text-center font-sans whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => showToast(`日志详情: ${row.body}`)} className="text-sky-400 hover:underline">
                            查看详情
                          </button>
                          <span className="text-slate-600">|</span>
                          <span className="text-slate-500">预留</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================
              TAB 4: 事件 (Matches Screenshot 6)
             ======================================================== */}
          {mainTab === '事件' && (
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/80 text-xs">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                    <th className="py-3 px-3">序号</th>
                    <th className="py-3 px-3">时间</th>
                    <th className="py-3 px-3">事件来源</th>
                    <th className="py-3 px-3">事件类型</th>
                    <th className="py-3 px-3">事件标题</th>
                    <th className="py-3 px-3">事件内容</th>
                    <th className="py-3 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {EVENT_DATA.map((row) => (
                    <tr key={row.seq} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-3 text-slate-400">{row.seq}</td>
                      <td className="py-3.5 px-3 text-slate-200">{row.time}</td>
                      <td className="py-3.5 px-3 font-sans text-sky-400 font-bold">{row.source}</td>
                      <td className="py-3.5 px-3 font-sans text-cyan-300">{row.type}</td>
                      <td className="py-3.5 px-3 font-sans font-bold text-white">{row.title}</td>
                      <td className="py-3.5 px-3 font-sans text-slate-300 text-[11px] max-w-xl">{row.content}</td>
                      <td className="py-3.5 px-3 text-center font-sans whitespace-nowrap">
                        <button onClick={() => showToast(`已调阅 [${row.title}] 操作审计日志`)} className="text-sky-400 hover:underline">
                          操作日志
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
