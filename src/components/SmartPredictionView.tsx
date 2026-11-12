import React, { useState, useEffect } from 'react';
import { AIFaultReportView } from './AIFaultReportView';
import { PerfMetricPredictionView } from './PerfMetricPredictionView';
import { SingleMetricPredReportView } from './SingleMetricPredReportView';
import { OverallMetricPredReportView } from './OverallMetricPredReportView';
import {
  TrendingUp,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Search,
  RotateCcw,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Gauge,
  ArrowRight,
  Filter,
  RefreshCw,
  Eye,
  Server,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface SmartPredictionProps {
  initialSubView?: string;
  onSubViewChange?: (subView: string) => void;
}

// 2026 时序预测数据 (带 95% 置信区间)
const PREDICTION_SERIES_DATA = [
  { time: '10-16 16:00', actual: 48, predict: 48, upper: 53, lower: 43 },
  { time: '10-16 18:00', actual: 62, predict: 60, upper: 66, lower: 54 },
  { time: '10-16 20:00', actual: 78, predict: 76, upper: 82, lower: 70 },
  { time: '10-16 22:00', actual: 85, predict: 84, upper: 90, lower: 78 },
  { time: '10-17 00:00', actual: null, predict: 55, upper: 62, lower: 48 },
  { time: '10-17 04:00', actual: null, predict: 38, upper: 45, lower: 31 },
  { time: '10-17 08:00', actual: null, predict: 72, upper: 80, lower: 64 },
  { time: '10-17 12:00', actual: null, predict: 89, upper: 96, lower: 82 },
  { time: '10-17 16:00', actual: null, predict: 94, upper: 101, lower: 87 },
  { time: '10-17 20:00', actual: null, predict: 79, upper: 87, lower: 71 },
  { time: '10-18 00:00', actual: null, predict: 52, upper: 60, lower: 44 },
  { time: '10-18 08:00', actual: null, predict: 75, upper: 84, lower: 66 },
  { time: '10-18 16:00', actual: null, predict: 88, upper: 97, lower: 79 },
];

export const SmartPredictionView: React.FC<SmartPredictionProps> = ({
  initialSubView = 'fault_prediction',
  onSubViewChange,
}) => {
  const [subTab, setSubTab] = useState<string>(initialSubView);

  useEffect(() => {
    if (initialSubView) {
      setSubTab(initialSubView);
    }
  }, [initialSubView]);

  const handleTabChange = (tabId: string) => {
    setSubTab(tabId);
    if (onSubViewChange) {
      onSubViewChange(tabId);
    }
  };

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 筛选字段 (严格对齐原型: 区域分类 / 区域中心 / 资源池 / POD / 设备厂家 / 业务系统 / 精确查询)
  const [regionCategory, setRegionCategory] = useState('全部');
  const [regionCenter, setRegionCenter] = useState('全部');
  const [resourcePool, setResourcePool] = useState('全部');
  const [pod, setPod] = useState('全部');
  const [vendor, setVendor] = useState('全部');
  const [bizSystem, setBizSystem] = useState('全部');
  const [exactQuery, setExactQuery] = useState('');
  const [targetCategory, setTargetCategory] = useState<'业务' | '服务' | '设备'>('设备');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPage, setJumpPage] = useState<string>('');
  const pageSize = 10;

  // 选中的预测对象 IDs
  const [selectedIds, setSelectedIds] = useState<string[]>(['sn-190001']);

  const subNavs = [
    { id: 'fault_prediction', label: '故障预测' },
    { id: 'ai_fault_report', label: 'AI故障预测报告' },
    { id: 'perf_metric_prediction', label: '性能指标预测' },
    { id: 'single_metric_pred_report', label: '单指标预测报告' },
    { id: 'overall_metric_pred_report', label: '指标整体预测报告' },
  ];

  // ==========================================
  // 1. 故障预测 列表数据 (字段标题与原型完全一致)
  // 序号 | 序列号 | 区域分类 | 区域中心 | 资源池 | POD | IP地址 | 设备类型 | 设备名称 | 监控状态 | 设备厂家 | 业务系统 | 操作系统 | 故障预测告警时间 | 故障预测告警级别 | 故障预测告警标题 | 故障预测告警正文 | 操作
  // ==========================================
  const [predList, setPredList] = useState([
    {
      seq: 1,
      sn: 'sn-190001',
      regionCategory: '省级IT云',
      regionCenter: '华北二',
      resourcePool: '呼池',
      pod: '呼池-虚拟015',
      ip: '220.10.51.14',
      deviceType: '虚拟机',
      deviceName: '设备A',
      status: '监控中',
      vendor: '华为',
      bizSystem: 'CRM客户中心',
      os: 'Linux 63.5.28',
      alarmTime: '2026-10-17 08:30:00',
      alarmLevel: '重大',
      alarmTitle: '网络接口死锁隐患预警',
      alarmBody: '未来 16 小时内软中断满溢概率 88.5%',
    },
    {
      seq: 2,
      sn: 'SN_654482',
      regionCategory: '华南一',
      regionCenter: '华南一',
      resourcePool: '广州资源池',
      pod: '广州-虚拟001',
      ip: '192.168.1.10',
      deviceType: '服务器',
      deviceName: '设备B',
      status: '监控中',
      vendor: '中兴',
      bizSystem: '计费账务中台',
      os: 'CentOS 7.9',
      alarmTime: '2026-10-17 14:00:00',
      alarmLevel: '高',
      alarmTitle: '存储BBU电池学习降级预警',
      alarmBody: '未来 22 小时内 Write-Through 降速概率 76.2%',
    },
    {
      seq: 3,
      sn: 'No.99876',
      regionCategory: '华东三',
      regionCenter: '华东三',
      resourcePool: '上海资源池',
      pod: '上海-虚拟002',
      ip: '10.0.0.1',
      deviceType: '路由器',
      deviceName: '设备C',
      status: '已停止',
      vendor: '华三',
      bizSystem: '统一门户网关',
      os: 'Comware V7',
      alarmTime: '2026-10-18 10:15:00',
      alarmLevel: '中',
      alarmTitle: 'Trunk链路瞬态抖动预警',
      alarmBody: '未来 42 小时内偶发丢包概率 42.0%',
    },
    {
      seq: 4,
      sn: 'sn-330654',
      regionCategory: '华中四',
      regionCenter: '华中四',
      resourcePool: '武汉资源池',
      pod: '武汉-虚拟003',
      ip: '172.16.0.1',
      deviceType: '虚拟机',
      deviceName: '设备D',
      status: '监控中',
      vendor: '浪潮',
      bizSystem: '电网调度总控',
      os: 'EulerOS 2.0',
      alarmTime: '2026-10-18 15:45:00',
      alarmLevel: '低',
      alarmTitle: '日志存储分区水位预警',
      alarmBody: '预计未来 3 天达到 85% 警戒水位',
    },
    {
      seq: 5,
      sn: 'sn-551029',
      regionCategory: '省级IT云',
      regionCenter: '华北二',
      resourcePool: '呼池',
      pod: '呼池-虚拟018',
      ip: '220.10.51.22',
      deviceType: '服务器',
      deviceName: '设备E-KafkaBroker03',
      status: '监控中',
      vendor: '华为',
      bizSystem: '流计算分析引擎',
      os: 'Rocky Linux 9.1',
      alarmTime: '2026-10-18 18:20:00',
      alarmLevel: '高',
      alarmTitle: '消息队列写入延迟持续爬升预警',
      alarmBody: '未来 12 小时内由于磁盘IO饱和引发生产端阻塞概率 81.4%',
    },
    {
      seq: 6,
      sn: 'SN_782014',
      regionCategory: '一级资源池',
      regionCenter: '华北一',
      resourcePool: '京池',
      pod: '京池-边缘003',
      ip: '192.168.10.66',
      deviceType: '虚拟机',
      deviceName: '设备F-IngressProxy01',
      status: '监控中',
      vendor: '中兴',
      bizSystem: '微服务网关平台',
      os: 'Ubuntu 22.04 LTS',
      alarmTime: '2026-10-19 02:10:00',
      alarmLevel: '中',
      alarmTitle: 'TCP TIME_WAIT 套接字耗尽预警',
      alarmBody: '预测长连接新建速率激增，未来 24 小时内本地端口耗尽风险 65.0%',
    },
    {
      seq: 7,
      sn: 'SN_889102',
      regionCategory: '省级IT云',
      regionCenter: '华东二',
      resourcePool: '安徽资源池',
      pod: '安徽-虚拟005',
      ip: '220.10.63.18',
      deviceType: '服务器',
      deviceName: '设备G-RedisCache02',
      status: '监控中',
      vendor: 'Dell',
      bizSystem: '用户鉴权中台',
      os: 'Debian 11',
      alarmTime: '2026-10-19 09:40:00',
      alarmLevel: '重大',
      alarmTitle: '内存碎片率超标引发OOM高危预警',
      alarmBody: '预测主存碎片比率突破 2.8，未来 8 小时内发生内存驱逐震荡概率 89.2%',
    },
    {
      seq: 8,
      sn: 'No.443190',
      regionCategory: '华南一',
      regionCenter: '华南一',
      resourcePool: '深圳资源池',
      pod: '深圳-虚拟007',
      ip: '10.240.18.99',
      deviceType: '负载均衡',
      deviceName: '设备H-SLB-Core01',
      status: '监控中',
      vendor: 'A10',
      bizSystem: '外网边界流量分发',
      os: 'ACOS 4.1',
      alarmTime: '2026-10-19 14:15:00',
      alarmLevel: '中',
      alarmTitle: '七层会话并发规格趋近瓶颈',
      alarmBody: '预测高峰期活跃连接数将突破 180,000，触发规格门限保护 58.7%',
    },
    {
      seq: 9,
      sn: 'sn-667231',
      regionCategory: '一级资源池',
      regionCenter: '华东一',
      resourcePool: '京池',
      pod: '京池-ironic01',
      ip: '192.168.12.80',
      deviceType: '服务器',
      deviceName: '设备I-GPU-Infer08',
      status: '监控中',
      vendor: '浪潮',
      bizSystem: '大模型推理中心',
      os: 'EulerOS 2.8',
      alarmTime: '2026-10-19 19:50:00',
      alarmLevel: '高',
      alarmTitle: '显卡供电模组温度异常超标预警',
      alarmBody: '热力学时序推演显示 GPU #2 结温预计 18 小时内突破 92℃',
    },
    {
      seq: 10,
      sn: 'SN_901844',
      regionCategory: '华中四',
      regionCenter: '华中四',
      resourcePool: '武汉资源池',
      pod: '武汉-虚拟008',
      ip: '172.16.2.45',
      deviceType: '交换机',
      deviceName: '设备J-ToR-Switch12',
      status: '已停止',
      vendor: '华三',
      bizSystem: '基础承载云网',
      os: 'Comware V9',
      alarmTime: '2026-10-20 04:30:00',
      alarmLevel: '低',
      alarmTitle: '光模块接收光功率微弱衰减预警',
      alarmBody: '预测未来 7 天光功率衰减达到 -23.5dBm 临界下限',
    },
    {
      seq: 11,
      sn: 'sn-204918',
      regionCategory: '省级IT云',
      regionCenter: '华北二',
      resourcePool: '呼池',
      pod: '呼池-虚拟020',
      ip: '220.10.51.88',
      deviceType: '虚拟机',
      deviceName: '设备K-ES-Search04',
      status: '监控中',
      vendor: '华为',
      bizSystem: '全文日志检索',
      os: 'CentOS 8.4',
      alarmTime: '2026-10-20 11:00:00',
      alarmLevel: '高',
      alarmTitle: 'Elasticsearch熔断器触发预警',
      alarmBody: 'JVM堆内存老年代回收耗时预计超过 3.5s，触发字段数据熔断风险 74.5%',
    },
    {
      seq: 12,
      sn: 'SN_338901',
      regionCategory: '华东三',
      regionCenter: '华东三',
      resourcePool: '上海资源池',
      pod: '上海-虚拟009',
      ip: '10.0.4.15',
      deviceType: '服务器',
      deviceName: '设备L-PostgresMaster01',
      status: '监控中',
      vendor: 'Dell',
      bizSystem: '核心账务系统',
      os: 'RHEL 8.6',
      alarmTime: '2026-10-20 16:45:00',
      alarmLevel: '重大',
      alarmTitle: 'WAL日志归档队列阻塞风险预警',
      alarmBody: '预测归档存储带宽饱和，未来 6 小时内事务写入挂起概率 91.0%',
    },
    {
      seq: 13,
      sn: 'No.774912',
      regionCategory: '省级IT云',
      regionCenter: '华东二',
      resourcePool: '安徽资源池',
      pod: '安徽-虚拟011',
      ip: '220.10.63.50',
      deviceType: '虚拟机',
      deviceName: '设备M-RabbitMQ-Node02',
      status: '监控中',
      vendor: '中兴',
      bizSystem: '异步解耦中间件',
      os: 'Ubuntu 20.04',
      alarmTime: '2026-10-21 01:20:00',
      alarmLevel: '中',
      alarmTitle: 'Erlang虚拟进程数超高预警',
      alarmBody: '未消费消息堆积引发连接突增，未来 20 小时内到达 80% 进程池上限',
    },
    {
      seq: 14,
      sn: 'sn-449102',
      regionCategory: '华南一',
      regionCenter: '华南一',
      resourcePool: '深圳资源池',
      pod: '深圳-虚拟012',
      ip: '10.240.20.11',
      deviceType: '路由器',
      deviceName: '设备N-BorderGateway02',
      status: '监控中',
      vendor: '华为',
      bizSystem: '跨域互联专线',
      os: 'VRP 8.180',
      alarmTime: '2026-10-21 07:15:00',
      alarmLevel: '低',
      alarmTitle: 'BGP前缀条目容量逼近预警',
      alarmBody: '路由表条目日均递增 1,200 条，预计未来 10 天达到路由内存 85% 水位',
    },
    {
      seq: 15,
      sn: 'SN_663189',
      regionCategory: '华中四',
      regionCenter: '华中四',
      resourcePool: '长沙资源池',
      pod: '长沙-虚拟002',
      ip: '172.18.5.30',
      deviceType: '服务器',
      deviceName: '设备O-MinIO-ObjectStore03',
      status: '监控中',
      vendor: '浪潮',
      bizSystem: '非结构化文档存储',
      os: 'Rocky Linux 8.8',
      alarmTime: '2026-10-21 13:50:00',
      alarmLevel: '中',
      alarmTitle: '分布式对象纠删码重建时延超标',
      alarmBody: '磁盘降速推演表明校验块修复时间延长超 45%，影响整体写入吞吐',
    },
    {
      seq: 16,
      sn: 'No.558190',
      regionCategory: '省级IT云',
      regionCenter: '华北二',
      resourcePool: '呼池',
      pod: '呼池-虚拟025',
      ip: '220.10.51.105',
      deviceType: '虚拟机',
      deviceName: '设备P-ClickHouse-Shard02',
      status: '监控中',
      vendor: '华为',
      bizSystem: '实时大屏指标计算',
      os: 'Debian 12',
      alarmTime: '2026-10-21 20:30:00',
      alarmLevel: '高',
      alarmTitle: '分布式MergeTree合并阻塞预警',
      alarmBody: '预测Part分区碎片累积超过 280 个，查询时延突增概率 78.3%',
    },
    {
      seq: 17,
      sn: 'sn-883019',
      regionCategory: '一级资源池',
      regionCenter: '华北一',
      京池: '京池',
      resourcePool: '京池',
      pod: '京池-边缘006',
      ip: '192.168.10.92',
      deviceType: '服务器',
      deviceName: '设备Q-ContainerHost04',
      status: '监控中',
      vendor: '中兴',
      bizSystem: 'K8S核心计算集群',
      os: 'Ubuntu 22.04 LTS',
      alarmTime: '2026-10-22 03:40:00',
      alarmLevel: '重大',
      alarmTitle: 'PID资源分配耗尽预警',
      alarmBody: '容器僵尸线程未正常回收，未来 14 小时内主机 kernel.pid_max 耗尽概率 86.9%',
    },
    {
      seq: 18,
      sn: 'SN_120499',
      regionCategory: '华东三',
      regionCenter: '华东三',
      resourcePool: '杭州资源池',
      pod: '杭州-虚拟004',
      ip: '10.8.2.19',
      deviceType: '虚拟机',
      deviceName: '设备R-Nginx-Edge01',
      status: '已停止',
      vendor: '华三',
      bizSystem: '静态资源加速',
      os: 'CentOS 7.8',
      alarmTime: '2026-10-22 09:10:00',
      alarmLevel: '低',
      alarmTitle: 'SSL证书到期替换预警',
      alarmBody: '边缘通配符证书有效期不足 15 天，需及时滚动续签',
    },
    {
      seq: 19,
      sn: 'No.882910',
      regionCategory: '华南一',
      regionCenter: '华南一',
      resourcePool: '广州资源池',
      pod: '广州-虚拟008',
      ip: '192.168.1.55',
      deviceType: '服务器',
      deviceName: '设备S-MongoDB-ReplSet01',
      status: '监控中',
      vendor: 'Dell',
      bizSystem: '用户画像标签库',
      os: 'RHEL 9.0',
      alarmTime: '2026-10-22 15:25:00',
      alarmLevel: '中',
      alarmTitle: '从节点Oplog复制窗口滞后预警',
      alarmBody: '预测主库写入突发使从节点追赶落后超过 450s，存在脏读风险 62.4%',
    },
    {
      seq: 20,
      sn: 'sn-991048',
      regionCategory: '华中四',
      regionCenter: '华中四',
      resourcePool: '武汉资源池',
      pod: '武汉-虚拟010',
      ip: '172.16.3.70',
      deviceType: '服务器',
      deviceName: '设备T-Zookeeper-Quorum02',
      status: '监控中',
      vendor: '浪潮',
      bizSystem: '配置中心分布式锁',
      os: 'EulerOS 2.0',
      alarmTime: '2026-10-22 22:00:00',
      alarmLevel: '高',
      alarmTitle: 'Leader心跳丢弃导致选举翻滚预警',
      alarmBody: '预测网络瞬态微拥塞将引发心跳超时，导致分布式锁闪断风险 72.8%',
    },
    {
      seq: 21,
      sn: 'SN_441920',
      regionCategory: '一级资源池',
      regionCenter: '华北一',
      resourcePool: '京池',
      pod: '京池-边缘008',
      ip: '192.168.10.118',
      deviceType: '服务器',
      deviceName: '设备U-TiDB-KV-Server05',
      status: '监控中',
      vendor: '华为',
      bizSystem: '分布式金融交易库',
      os: 'EulerOS 2.9',
      alarmTime: '2026-10-23 03:15:00',
      alarmLevel: '高',
      alarmTitle: 'Raft状态机Apply日志堆积预警',
      alarmBody: '预测底层NVMe盘写放大倍率上升，未来 12 小时内 Raft 选举响应延迟突破 2.5s',
    },
    {
      seq: 22,
      sn: 'sn-772183',
      regionCategory: '华东三',
      regionCenter: '华东三',
      resourcePool: '上海资源池',
      pod: '上海-虚拟016',
      ip: '10.0.8.42',
      deviceType: '虚拟机',
      deviceName: '设备V-Envoy-MeshProxy03',
      status: '监控中',
      vendor: '中兴',
      bizSystem: '服务网格流量管控',
      os: 'Alpine Linux 3.19',
      alarmTime: '2026-10-23 09:30:00',
      alarmLevel: '中',
      alarmTitle: 'xDS动态配置下发同步超时预警',
      alarmBody: '服务发现节点数量突破 15,000，预测增量 CDS 编译时延超过 5 秒',
    },
    {
      seq: 23,
      sn: 'No.661092',
      regionCategory: '省级IT云',
      regionCenter: '华北二',
      resourcePool: '呼池',
      pod: '呼池-虚拟031',
      ip: '220.10.51.130',
      deviceType: '服务器',
      deviceName: '设备W-Ceph-OSD12',
      status: '监控中',
      vendor: '浪潮',
      bizSystem: '云原生块存储集群',
      os: 'CentOS 8.5',
      alarmTime: '2026-10-23 14:40:00',
      alarmLevel: '重大',
      alarmTitle: 'OSD慢请求心跳降级预警',
      alarmBody: '推演显示蓝图磁盘坏道率微增，未来 16 小时内触发 PG 状态 degraded 重平衡震荡',
    },
    {
      seq: 24,
      sn: 'SN_553901',
      regionCategory: '华南一',
      regionCenter: '华南一',
      resourcePool: '深圳资源池',
      pod: '深圳-虚拟018',
      ip: '10.240.22.65',
      deviceType: '交换机',
      deviceName: '设备X-Spine-Core04',
      status: '监控中',
      vendor: '华三',
      bizSystem: '数据中心无损网络',
      os: 'Comware V9',
      alarmTime: '2026-10-23 18:20:00',
      alarmLevel: '低',
      alarmTitle: 'PFC流控死锁反压预警',
      alarmBody: 'RoCEv2 队列深度接近缓冲区高水位，预测突发流量下可能诱发全局暂停帧风暴',
    },
    {
      seq: 25,
      sn: 'sn-338290',
      regionCategory: '华中四',
      regionCenter: '华中四',
      resourcePool: '武汉资源池',
      pod: '武汉-虚拟015',
      ip: '172.16.5.88',
      deviceType: '虚拟机',
      deviceName: '设备Y-Apollo-ConfigServer01',
      status: '监控中',
      vendor: '华为',
      bizSystem: '微服务全局配置中心',
      os: 'Rocky Linux 9.2',
      alarmTime: '2026-10-24 02:10:00',
      alarmLevel: '中',
      alarmTitle: '长轮询连接数渐进耗尽预警',
      alarmBody: '预测微服务弹性扩容后客户端 Notification 挂起连接突破 45,000，可能引发轻微线程阻塞',
    },
    {
      seq: 26,
      sn: 'No.119283',
      regionCategory: '省级IT云',
      regionCenter: '华东二',
      resourcePool: '安徽资源池',
      pod: '安徽-虚拟014',
      ip: '220.10.63.85',
      deviceType: '服务器',
      deviceName: '设备Z-Harbor-Registry01',
      status: '监控中',
      vendor: 'Dell',
      bizSystem: 'CI/CD持续集成镜像仓',
      os: 'Ubuntu 22.04 LTS',
      alarmTime: '2026-10-24 08:45:00',
      alarmLevel: '高',
      alarmTitle: '镜像Blob垃圾回收I/O峰值预警',
      alarmBody: '无用镜像制品堆积达到 4.2TB，定时 GC 作业预测将在夜间引发存储 IOPS 尖刺 82%',
    },
    {
      seq: 27,
      sn: 'SN_882041',
      regionCategory: '华南一',
      regionCenter: '华南一',
      resourcePool: '广州资源池',
      pod: '广州-虚拟012',
      ip: '192.168.1.92',
      deviceType: '服务器',
      deviceName: '设备AA-Clickhouse-Replica03',
      status: '已停止',
      vendor: '浪潮',
      bizSystem: '风控反欺诈实时引擎',
      os: 'Debian 11',
      alarmTime: '2026-10-24 13:30:00',
      alarmLevel: '低',
      alarmTitle: 'ZooKeeper元数据同步慢同步预警',
      alarmBody: '复制表分片间通信偶发超时，时序推演显示未来 48 小时存在只读降级隐患',
    },
    {
      seq: 28,
      sn: 'sn-902834',
      regionCategory: '一级资源池',
      regionCenter: '华北一',
      resourcePool: '京池',
      pod: '京池-边缘010',
      ip: '192.168.10.155',
      deviceType: '服务器',
      deviceName: '设备AB-Prometheus-TSDB02',
      status: '监控中',
      vendor: '华为',
      bizSystem: '全链路指标监控中心',
      os: 'EulerOS 2.0',
      alarmTime: '2026-10-24 19:15:00',
      alarmLevel: '重大',
      alarmTitle: 'WAL内存块落盘背压预警',
      alarmBody: '时间序列激增至 8,500,000 条，预测未来 8 小时内引发 Head Block Compaction 挂起',
    },
    {
      seq: 29,
      sn: 'No.338192',
      regionCategory: '华东三',
      regionCenter: '华东三',
      resourcePool: '杭州资源池',
      pod: '杭州-虚拟007',
      ip: '10.8.5.60',
      deviceType: '虚拟机',
      deviceName: '设备AC-Sentinel-Flow02',
      status: '监控中',
      vendor: '中兴',
      bizSystem: '网关高可用熔断限流',
      os: 'CentOS 7.9',
      alarmTime: '2026-10-25 01:40:00',
      alarmLevel: '中',
      alarmTitle: '秒级QPS滑动窗口统计漂移预警',
      alarmBody: '多节点时钟同步漂移预测达到 45ms，可能引发限流阈值计算轻度失真',
    },
    {
      seq: 30,
      sn: 'SN_772091',
      regionCategory: '华中四',
      regionCenter: '华中四',
      resourcePool: '长沙资源池',
      pod: '长沙-虚拟005',
      ip: '172.18.6.14',
      deviceType: '服务器',
      deviceName: '设备AD-Spark-Worker08',
      status: '监控中',
      vendor: '浪潮',
      bizSystem: '离线离散大数据批处理',
      os: 'Rocky Linux 8.9',
      alarmTime: '2026-10-25 08:20:00',
      alarmLevel: '高',
      alarmTitle: 'Shuffle文件临时存储溢出预警',
      alarmBody: '批处理 Job 预测产生 1.8TB 中间溢出数据，本地 SSD 暂存区未来 6 小时内使用率达 94%',
    },
  ]);

  // ==========================================
  // 3. 性能指标预测 列表数据 (字段标题与原型完全一致)
  // 序列号 | 区域分类 | 区域中心 | 资源池 | POD | 管理IP地址 | 业务IP地址 | 设备型号 | 设备名称 | 设备厂家 | 业务系统 | 操作系统类型 | 操作系统版本 | 已监控异常检测指标数 | 已启用异常检测模型数 | 操作
  // ==========================================
  const [perfList, setPerfList] = useState([
    {
      sn: 'SN-46567',
      regionCategory: '省级IT云',
      regionCenter: '华北二',
      resourcePool: '呼池',
      pod: '呼池-虚拟015',
      mgmtIp: '220.10.51.15',
      bizIp: '10.240.51.15',
      model: 'RH2288 V5',
      name: 'Server-001',
      vendor: '华为',
      bizSystem: 'CRM',
      osType: 'Linux',
      osVer: '63.5.28',
      monitoredMetricsCount: 14,
      enabledModelsCount: 6,
    },
    {
      sn: 'SN-8379952',
      regionCategory: '省级IT云',
      regionCenter: '华北二',
      resourcePool: '呼池',
      pod: '呼池-虚拟023',
      mgmtIp: '220.10.52.23',
      bizIp: '10.240.52.23',
      model: 'R740',
      name: 'Server-002',
      vendor: 'Dell',
      bizSystem: '计费账务',
      osType: 'Linux',
      osVer: '7.9.2009',
      monitoredMetricsCount: 12,
      enabledModelsCount: 5,
    },
    {
      sn: 'SN-775589',
      regionCategory: '一级资源池',
      regionCenter: '华东一',
      resourcePool: '京池',
      pod: '京池-边缘001',
      mgmtIp: '192.168.10.42',
      bizIp: '10.128.10.42',
      model: 'NF5280M6',
      name: 'Edge-GPU-01',
      vendor: '浪潮',
      bizSystem: 'AI推理',
      osType: 'Linux',
      osVer: 'Ubuntu 22.04',
      monitoredMetricsCount: 18,
      enabledModelsCount: 8,
    },
  ]);

  // 分页计算 (故障预测)
  const totalItems = predList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedList = predList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full bg-[#0b0f19] text-slate-200 min-h-[calc(100vh-100px)] flex flex-col gap-4 animate-fadeIn">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-500/90 border border-emerald-400 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sub-menu Pills Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-2 shadow-lg backdrop-blur-md">
        {subNavs.map((nav) => {
          const isSelected = subTab === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => handleTabChange(nav.id)}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/25 ring-2 ring-sky-400/40'
                  : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {nav.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================
          SUB-VIEW 1: 故障预测 (完全对齐原型字段)
         ======================================================== */}
      {subTab === 'fault_prediction' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          {/* 筛选区域: 预测对象类别选择 + 区域分类/中心/资源池/POD/厂家/系统/精确查询 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">请选择预测对象类别：</span>
                {(['业务', '服务', '设备'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTargetCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      targetCategory === cat ? 'bg-sky-500 text-white' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">精确查询：</span>
                <input
                  type="text"
                  value={exactQuery}
                  onChange={(e) => setExactQuery(e.target.value)}
                  placeholder="输入序列号 / IP / 名称..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs w-56 focus:outline-none focus:border-sky-500"
                />
                <button onClick={() => showToast('已执行故障预测过滤查询')} className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg">
                  查询
                </button>
                <button onClick={() => { setExactQuery(''); showToast('已重置'); }} className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
                  重置
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
              <div>
                <span className="text-slate-500 block">区域分类：</span>
                <span className="text-slate-200 font-mono">省级IT云 / 全部</span>
              </div>
              <div>
                <span className="text-slate-500 block">区域中心：</span>
                <span className="text-slate-200 font-mono">华北二 / 全部</span>
              </div>
              <div>
                <span className="text-slate-500 block">资源池：</span>
                <span className="text-slate-200 font-mono">呼池 / 全部</span>
              </div>
              <div>
                <span className="text-slate-500 block">POD：</span>
                <span className="text-slate-200 font-mono">呼池-虚拟015</span>
              </div>
              <div>
                <span className="text-slate-500 block">设备厂家：</span>
                <span className="text-slate-200 font-mono">华为 / 中兴</span>
              </div>
              <div>
                <span className="text-slate-500 block">业务系统：</span>
                <span className="text-slate-200 font-mono">CRM / 计费</span>
              </div>
            </div>
          </div>

          {/* 列表头部操作: 预测对象列表 | 本页全选 | 批量停用 | 批量启用 | 已选择 X 项 | 清空 */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-sm">预测对象列表</span>
              <span className="text-slate-400">已选择 <strong className="text-sky-400 font-mono">{selectedIds.length}</strong> 项</span>
              <button onClick={() => setSelectedIds([])} className="text-slate-400 hover:text-white underline">
                清空
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentPageSns = paginatedList.map(p => p.sn);
                  const allCurrentSelected = currentPageSns.length > 0 && currentPageSns.every(sn => selectedIds.includes(sn));
                  if (allCurrentSelected) {
                    setSelectedIds(prev => prev.filter(sn => !currentPageSns.includes(sn)));
                  } else {
                    setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageSns])));
                  }
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                本页全选
              </button>
              <button
                onClick={() => {
                  setPredList(prev => prev.map(p => selectedIds.includes(p.sn) ? { ...p, status: '已停止' } : p));
                  showToast('已批量停用选定对象的故障预测模型');
                }}
                className="px-3 py-1 bg-amber-600/80 hover:bg-amber-500 text-white rounded-lg font-medium"
              >
                批量停用
              </button>
              <button
                onClick={() => {
                  setPredList(prev => prev.map(p => selectedIds.includes(p.sn) ? { ...p, status: '监控中' } : p));
                  showToast('已批量启用选定对象的故障预测模型');
                }}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium"
              >
                批量启用
              </button>
            </div>
          </div>

          {/* 表头严格对齐: 序号 | 序列号 | 区域分类 | 区域中心 | 资源池 | POD | IP地址 | 设备类型 | 设备名称 | 监控状态 | 设备厂家 | 业务系统 | 操作系统 | 故障预测告警时间 | 故障预测告警级别 | 故障预测告警标题 | 故障预测告警正文 | 操作 */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-3">序号</th>
                  <th className="py-3 px-3">序列号</th>
                  <th className="py-3 px-3">区域分类</th>
                  <th className="py-3 px-3">区域中心</th>
                  <th className="py-3 px-3">资源池</th>
                  <th className="py-3 px-3">POD</th>
                  <th className="py-3 px-3">IP地址</th>
                  <th className="py-3 px-3">设备类型</th>
                  <th className="py-3 px-3">设备名称</th>
                  <th className="py-3 px-3">监控状态</th>
                  <th className="py-3 px-3">设备厂家</th>
                  <th className="py-3 px-3">业务系统</th>
                  <th className="py-3 px-3">操作系统</th>
                  <th className="py-3 px-3">故障预测告警时间</th>
                  <th className="py-3 px-3">故障预测告警级别</th>
                  <th className="py-3 px-3">故障预测告警标题</th>
                  <th className="py-3 px-3">故障预测告警正文</th>
                  <th className="py-3 px-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {paginatedList.map((row) => (
                  <tr key={row.sn} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-slate-400">{row.seq}</td>
                    <td className="py-3 px-3 text-cyan-300 font-bold">{row.sn}</td>
                    <td className="py-3 px-3 font-sans">{row.regionCategory}</td>
                    <td className="py-3 px-3 font-sans">{row.regionCenter}</td>
                    <td className="py-3 px-3 font-sans">{row.resourcePool}</td>
                    <td className="py-3 px-3 font-sans">{row.pod}</td>
                    <td className="py-3 px-3 text-cyan-400">{row.ip}</td>
                    <td className="py-3 px-3 font-sans">{row.deviceType}</td>
                    <td className="py-3 px-3 font-sans text-white">{row.deviceName}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.status === '监控中' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">{row.vendor}</td>
                    <td className="py-3 px-3 font-sans text-white">{row.bizSystem}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{row.os}</td>
                    <td className="py-3 px-3 text-slate-400">{row.alarmTime}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.alarmLevel === '重大' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {row.alarmLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-white max-w-xs">{row.alarmTitle}</td>
                    <td className="py-3 px-3 font-sans text-slate-400 max-w-xs truncate">{row.alarmBody}</td>
                    <td className="py-3 px-3 text-center font-sans whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setPredList(prev => prev.map(p => p.sn === row.sn ? { ...p, status: p.status === '监控中' ? '已停止' : '监控中' } : p));
                            showToast(`对象 [${row.deviceName}] 状态已更新`);
                          }}
                          className={`${row.status === '监控中' ? 'text-amber-400' : 'text-emerald-400'} hover:underline`}
                        >
                          {row.status === '监控中' ? '停止' : '启用'}
                        </button>
                        <span className="text-slate-600">|</span>
                        <button onClick={() => handleTabChange('ai_fault_report')} className="text-sky-400 hover:underline">
                          AI预测报告
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页控制栏 (按表格实际条数计算并带完整翻页) */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-mono gap-3 pt-2">
            <div>
              <span>共{totalItems}条记录 第{currentPage}/{totalPages}页</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 rounded border border-slate-700 transition-colors"
                title="上一页"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs transition-colors ${
                    currentPage === pageNum
                      ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 rounded border border-slate-700 transition-colors"
                title="下一页"
              >
                &gt;
              </button>

              <span className="text-slate-400 ml-2">10条/页</span>

              <div className="flex items-center gap-1.5 ml-2">
                <span>跳至</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const p = parseInt(jumpPage, 10);
                      if (!isNaN(p) && p >= 1 && p <= totalPages) {
                        setCurrentPage(p);
                        setJumpPage('');
                      }
                    }
                  }}
                  className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-white text-xs focus:outline-none focus:border-sky-500"
                />
                <span>页</span>
                <button
                  onClick={() => {
                    const p = parseInt(jumpPage, 10);
                    if (!isNaN(p) && p >= 1 && p <= totalPages) {
                      setCurrentPage(p);
                      setJumpPage('');
                    }
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 2: AI故障预测报告 (完全对齐原型图1~6全景)
         ======================================================== */}
      {subTab === 'ai_fault_report' && (
        <AIFaultReportView
          onOpenRootCause={(alarmId) => {
            showToast(`正在跳转对告警 [${alarmId}] 进行根因分析`);
          }}
        />
      )}

      {/* ========================================================
          SUB-VIEW 3: 性能指标预测 (对齐原型搜索条件与分类切换)
         ======================================================== */}
      {subTab === 'perf_metric_prediction' && (
        <PerfMetricPredictionView onNavigate={handleTabChange} />
      )}

      {/* ========================================================
          SUB-VIEW 4: 单指标预测报告 (完全对齐原型图1~3全景)
         ======================================================== */}
      {subTab === 'single_metric_pred_report' && (
        <SingleMetricPredReportView onNavigate={handleTabChange} />
      )}

      {/* ========================================================
          SUB-VIEW 5: 指标整体预测报告 (完全对齐原型图1~2全景)
         ======================================================== */}
      {subTab === 'overall_metric_pred_report' && (
        <OverallMetricPredReportView onNavigate={handleTabChange} />
      )}
    </div>
  );
};
