import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  RotateCcw,
  CheckCircle2,
  X,
  Play,
  Share2,
  Sliders,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  RefreshCw,
  GitCommit,
  Layers,
  FileText,
  Clock,
  Pin,
  Lock,
  Unlock,
  Radio,
  Filter,
  Calendar,
  Activity,
  Cpu,
  HardDrive,
  Network,
  GitBranch,
  AlertTriangle,
  Terminal,
  TrendingUp,
  ExternalLink,
  Server,
  Database,
  Box,
  ArrowRight,
  Zap,
  Sparkles,
  BarChart3,
  Eye,
  Plus,
  Trash2,
  MoreVertical,
  Check,
  ArrowUpDown,
  Undo2,
} from 'lucide-react';

interface FaultDiagnosisProps {
  initialSubView?: string;
  onSubViewChange?: (subView: string) => void;
}

export const FaultDiagnosisView: React.FC<FaultDiagnosisProps> = ({
  initialSubView = 'alert_mgmt',
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

  // Filter States for 告警管理 & 告警收敛 (按截图结构精确实现)
  const [exactQueryType, setExactQueryType] = useState('请选择查询方式'); // '请选择查询方式' | 'IP' | '序列号' | '告警标识'
  const [exactQuery, setExactQuery] = useState('');
  const [convStartTime, setConvStartTime] = useState('');
  const [convEndTime, setConvEndTime] = useState('');
  const [timeQuery, setTimeQuery] = useState('2026-10-09 10:00:00 - 2026-10-16 16:30:00');
  const [regionCategory, setRegionCategory] = useState('全部');
  const [regionCenter, setRegionCenter] = useState('全部');
  const [resourcePool, setResourcePool] = useState('全部');
  const [pod, setPod] = useState('全部');
  const [vendor, setVendor] = useState('全部');
  const [deviceType, setDeviceType] = useState('全部');
  const [activeAlarmTab, setActiveAlarmTab] = useState<'活动告警列表' | '锁定列表' | '聚合告警列表'>('活动告警列表');
  const [isConvergenceExpanded, setIsConvergenceExpanded] = useState(true);

  // 9 Sub Navigation items matching prototype
  const subNavs = [
    { id: 'alert_mgmt', label: '告警管理' },
    { id: 'alert_convergence', label: '告警收敛' },
    { id: 'fault_trace', label: '故障溯源分析' },
    { id: 'demarcation', label: '定界定位' },
    { id: 'demarcation_table', label: '定界定位（表格）' },
    { id: 'root_cause_analysis', label: '故障根因分析' },
    { id: 'root_cause_table', label: '故障根因分析(表格)' },
    { id: 'rule_base', label: '根因规则库' },
    { id: 'rule_base_simplified', label: '根因规则库(简化)' },
  ];

  // ==========================================
  // ==========================================
  // 1. 告警管理 数据 (字段标题与原型完全一致，含「发生时间」与「告警标识」)
  // 发生时间 | 告警级别 | 告警标识 | 设备名称 | 设备类型 | 系统来源 | 一级专业分类 | 告警标题 | 告警正文 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称 | 操作
  // ==========================================
  const [alarmMgmtList, setAlarmMgmtList] = useState([
    {
      id: 'ALM-20261016-01',
      time: '2026-10-16 16:30:12',
      level: '重大',
      tag: '主',
      isNew: true,
      deviceName: 'Server-Host-46567',
      deviceType: '服务器',
      systemSource: '网管中心',
      majorCategory: '动环',
      alarmTitle: '呼池015虚拟节点网络接口丢包率持续超标',
      alarmBody: 'GE 1/1/1 网卡丢包率达 6.42%，CPU Core #3 软中断持续 100%',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      id: 'ALM-20261016-02',
      time: '2026-10-16 15:45:00',
      level: '高',
      tag: '聚',
      isNew: true,
      deviceName: 'DB-Cluster-023',
      deviceType: '服务器',
      systemSource: 'AIOps',
      majorCategory: '异常检测',
      alarmTitle: '核心PostgreSQL写队列延迟突增',
      alarmBody: '主从同步延迟超过 1200ms，Write IOPS 出现周期性震荡',
      ip: '220.10.52.23',
      sn: 'SN-8379952',
      resourcePool: '省级IT云',
      pod: '京池-虚拟023',
      vendor: '中兴',
    },
    {
      id: 'ALM-20261016-03',
      time: '2026-10-16 14:18:22',
      level: '高',
      tag: '主',
      isNew: false,
      deviceName: 'SW-Core-Spine01',
      deviceType: '路由器',
      systemSource: '网管中心',
      majorCategory: '动环',
      alarmTitle: 'Spine骨干交换机BGP会话抖动及光衰告警',
      alarmBody: 'BGP Keepalive超时，Eth1/48端口接收光功率低至 -21.4dBm',
      ip: '220.10.60.1',
      sn: 'SN-901284',
      resourcePool: '一级资源池',
      pod: '东莞-二期-ironic-POD1资源池',
      vendor: '华三',
    },
    {
      id: 'ALM-20261016-04',
      time: '2026-10-16 13:05:40',
      level: '中',
      tag: '从',
      isNew: false,
      deviceName: 'Edge-GPU-Node-01',
      deviceType: '虚拟机',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: '边缘音视频转码显存碎片超载预警',
      alarmBody: 'CUDA 显存碎片率达 78%，存在 OOM 杀进程中断高危隐患',
      ip: '192.168.10.42',
      sn: 'SN-775589',
      resourcePool: '一级资源池',
      pod: '东莞-kvm资源池',
      vendor: '浪潮',
    },
    {
      id: 'ALM-20261016-05',
      time: '2026-10-16 11:20:15',
      level: '低',
      tag: '合',
      isNew: false,
      deviceName: 'LB-F5-VIP-08',
      deviceType: '负载均衡',
      systemSource: '网管中心',
      majorCategory: '动环',
      alarmTitle: '入口七层负载均衡并发连接数突破80%警戒线',
      alarmBody: 'Active Connections: 184,200/200,000, 会话新建速率激增',
      ip: '220.10.50.88',
      sn: 'SN-102938',
      resourcePool: '池外',
      pod: '二期一阶段POD7',
      vendor: 'A10',
    },
    {
      id: 'ALM-20261016-06',
      time: '2026-10-16 09:15:30',
      level: '低',
      tag: '从',
      isNew: false,
      deviceName: 'SDN-Ctrl-Master02',
      deviceType: 'SDN控制器',
      systemSource: 'AIOps',
      majorCategory: '异常检测',
      alarmTitle: 'SDN南北向流表下发延迟偏离基线',
      alarmBody: 'OpenFlow 流表下发响应延迟 86ms (基线 12ms)，缓存待下发流表 420条',
      ip: '220.10.55.19',
      sn: 'SN-556102',
      resourcePool: '一级资源池',
      pod: '东莞-ironic资源池',
      vendor: '3COM',
    },
    {
      id: 'ALM-20261015-07',
      time: '2026-10-15 22:40:00',
      level: '中',
      tag: '主',
      isNew: false,
      deviceName: 'Storage-SAN-Array04',
      deviceType: '服务器',
      systemSource: '网管中心',
      majorCategory: '动环',
      alarmTitle: '集中存储双活控制器Cache脏数据刷盘缓慢',
      alarmBody: 'Dirty Cache Ratio 达 82%，FC SAN 端口存在轻微丢包',
      ip: '220.10.72.10',
      sn: 'SN-663201',
      resourcePool: '省级IT云',
      pod: '东莞-vmware',
      vendor: '华为',
    },
    {
      id: 'ALM-20261015-08',
      time: '2026-10-15 18:10:20',
      level: '高',
      tag: '聚',
      isNew: false,
      deviceName: 'VPN-GW-Border01',
      deviceType: 'VPN',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: '边界IPsec VPN隧道重协商握手偶发丢弃',
      alarmBody: 'IKE SA 重协商失败率 3.8%，对端网关公网路由抖动',
      ip: '220.10.80.3',
      sn: 'SN-882019',
      resourcePool: '池外',
      pod: '二期一阶段POD7',
      vendor: 'BMC',
    },
    {
      id: 'ALM-20261015-09',
      time: '2026-10-15 16:25:40',
      level: '高',
      tag: '主',
      isNew: false,
      deviceName: 'K8S-Master-Node03',
      deviceType: '服务器',
      systemSource: '网管中心',
      majorCategory: '动环',
      alarmTitle: 'K8S控制面API-Server请求响应P99延时突增',
      alarmBody: 'etcd 集群写入阻塞引发 API-Server 队列堆积，超时率超 4.5%',
      ip: '220.10.53.19',
      sn: 'SN-772901',
      resourcePool: '省级IT云',
      pod: '东莞-vmware',
      vendor: '华为',
    },
    {
      id: 'ALM-20261015-10',
      time: '2026-10-15 14:05:10',
      level: '中',
      tag: '从',
      isNew: false,
      deviceName: 'FW-Border-Trust02',
      deviceType: '防火墙',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: '核心防火墙会话状态表占用率逼近容量阈值',
      alarmBody: '并发连接会话数达 1,890,000 条，超出安全预警水位 85%',
      ip: '220.10.90.12',
      sn: 'SN-665120',
      resourcePool: '一级资源池',
      pod: '东莞-POD1',
      vendor: '山石网科',
    },
  ]);

  // 按近期时间降序排序
  const sortedAlarmMgmtList = useMemo(() => {
    return [...alarmMgmtList].sort((a, b) => {
      const timeA = new Date(a.time.replace(/-/g, '/')).getTime();
      const timeB = new Date(b.time.replace(/-/g, '/')).getTime();
      return timeB - timeA;
    });
  }, [alarmMgmtList]);

  // ==========================================
  // 2. 告警收敛 主告警数据 (完全对齐原型字段与截图筛选条件)
  // 告警ID | 发生时间 | 告警级别 | 告警类型 | 告警标题 | 告警正文 | 设备类型 | 业务系统名称 | 采集资源ID | ciCode | 网元IP | 资源池 | POD | 厂家名称 | 告警标识 | 区域分类 | 区域中心
  // ==========================================
  const [convergenceList, setConvergenceList] = useState([
    {
      alarmId: 'CR-ALM-20261016-01',
      occurTime: '2026-10-16 15:30:12',
      alarmLevel: '重大',
      alarmType: '系统故障',
      alarmTag: '主',
      isNew: true,
      alarmTitle: '物理网卡多队列倾斜导致全集群级联响应超时',
      alarmBody: '底层硬件中断拥塞，时空收敛已自动聚合 482 条次生网络与连接池超时告警',
      deviceType: '服务器',
      businessSystem: '虚拟电厂能量协同系统',
      collectResourceId: 'RES-NIC-46567',
      ciCode: 'CI_SRV_0046567',
      ip: '220.10.51.15',
      sn: 'SN-465671',
      resourcePool: '东莞资源池',
      regionCategory: '一级资源池',
      regionCenter: '华北',
      pod: '东莞-ironic资源池',
      vendor: '3COM',
    },
    {
      alarmId: 'CR-ALM-20261016-02',
      occurTime: '2026-10-16 14:15:00',
      alarmLevel: '高',
      alarmType: '网络异常',
      alarmTag: '聚',
      isNew: false,
      alarmTitle: '虚拟机网络连接中断及跨节点RPC握手超时',
      alarmBody: '写缓存临时降级为 Write-Through，收敛聚合 128 条数据库慢查告警',
      deviceType: '虚拟机',
      businessSystem: '时序遥测大数据平台',
      collectResourceId: 'RES-SAN-8379952',
      ciCode: 'CI_SAN_8379952',
      ip: '220.10.52.23',
      sn: 'SN-837995',
      resourcePool: '安徽资源池',
      regionCategory: '省级IT云',
      regionCenter: '东北',
      pod: '东莞-kvm资源池',
      vendor: 'A10',
    },
    {
      alarmId: 'CR-ALM-20261016-03',
      occurTime: '2026-10-16 13:45:20',
      alarmLevel: '高',
      alarmType: '存储问题',
      alarmTag: '主',
      isNew: true,
      alarmTitle: '骨干路由器OSPF邻居关系震荡导致跨区流表重算',
      alarmBody: 'Ceph OSD 存储利用率达 91.4%，时空收敛引擎归并 86 条磁盘I/O排队告警',
      deviceType: '路由器',
      businessSystem: '多能互补调度总控中心',
      collectResourceId: 'RES-ROUT-10928',
      ciCode: 'CI_ROUT_10928',
      ip: '220.10.53.18',
      sn: 'SN-109280',
      resourcePool: '北京资源池',
      regionCategory: '池外',
      regionCenter: '华北一',
      pod: '东莞-vmware',
      vendor: 'BEA',
    },
    {
      alarmId: 'CR-ALM-20261016-04',
      occurTime: '2026-10-16 11:20:15',
      alarmLevel: '中',
      alarmType: '应用错误',
      alarmTag: '从',
      isNew: false,
      alarmTitle: '负载均衡七层HTTP连接池饱和与网关504超时',
      alarmBody: 'HTTP 504 Gateway Timeout 率突增至 4.2%，聚合收敛 64 条微服务熔断事件',
      deviceType: '负载均衡',
      businessSystem: '电价智能预测引擎',
      collectResourceId: 'RES-LB-55219',
      ciCode: 'CI_LB_55219',
      ip: '220.10.54.42',
      sn: 'SN-552193',
      resourcePool: '重庆资源池',
      regionCategory: '一级资源池',
      regionCenter: '华中',
      pod: '东莞-二期-ironic-POD1资源池',
      vendor: 'BMC',
    },
    {
      alarmId: 'CR-ALM-20261016-05',
      occurTime: '2026-10-16 10:05:40',
      alarmLevel: '低',
      alarmType: '配置变更',
      alarmTag: '合',
      isNew: false,
      alarmTitle: 'SDN控制器南北向流表下发延迟超出基线警戒值',
      alarmBody: 'BGP EVPN 路由重分发策略配置与基线漂移，收敛聚合 32 条心跳丢失告警',
      deviceType: 'SDN控制器',
      businessSystem: '电网拓扑数字孪生平台',
      collectResourceId: 'RES-SDN-33418',
      ciCode: 'CI_SDN_33418',
      ip: '220.10.55.19',
      sn: 'SN-334189',
      resourcePool: '广东资源池',
      regionCategory: '省级IT云',
      regionCenter: '华北',
      pod: '二期一阶段POD7',
      vendor: '3COM',
    },
    {
      alarmId: 'CR-ALM-20261015-06',
      occurTime: '2026-10-15 22:30:00',
      alarmLevel: '高',
      alarmType: '网络异常',
      alarmTag: '主',
      isNew: false,
      alarmTitle: '边界IPsec VPN隧道重协商握手偶发丢弃',
      alarmBody: 'IKE SA 重协商失败率 3.8%，对端网关公网路由抖动，收敛 24 条隧道下线事件',
      deviceType: 'VPN',
      businessSystem: '微电网分布式协同控制',
      collectResourceId: 'RES-VPN-77102',
      ciCode: 'CI_VPN_77102',
      ip: '220.10.56.88',
      sn: 'SN-771024',
      resourcePool: '甘肃资源池',
      regionCategory: '池外',
      regionCenter: '东北',
      pod: '二期一阶段POD7',
      vendor: 'A10',
    },
    {
      alarmId: 'CR-ALM-20261015-07',
      occurTime: '2026-10-15 19:12:45',
      alarmLevel: '重大',
      alarmType: '系统故障',
      alarmTag: '聚',
      isNew: false,
      alarmTitle: '服务器阵列卡电容电压异常致写缓存保护关闭',
      alarmBody: 'RAID Controller BBU 电压持续低于 3.2V，收敛聚合 110 条 IO 慢请求',
      deviceType: '服务器',
      businessSystem: '负荷聚合计费结算中心',
      collectResourceId: 'RES-SRV-99214',
      ciCode: 'CI_SRV_99214',
      ip: '220.10.57.10',
      sn: 'SN-992140',
      resourcePool: '东莞资源池',
      regionCategory: '一级资源池',
      regionCenter: '华北一',
      pod: '东莞-ironic资源池',
      vendor: 'BEA',
    },
    {
      alarmId: 'CR-ALM-20261015-08',
      occurTime: '2026-10-15 16:08:33',
      alarmLevel: '中',
      alarmType: '存储问题',
      alarmTag: '从',
      isNew: false,
      alarmTitle: '虚拟机磁盘I/O队列堵塞与元数据分裂延迟',
      alarmBody: 'RocksDB 压实耗时超过 1500ms，时空收敛算法自动归并在途 45 条 PUT 失败告警',
      deviceType: '虚拟机',
      businessSystem: '储能健康度全生命周期评估',
      collectResourceId: 'RES-VM-22340',
      ciCode: 'CI_VM_22340',
      ip: '220.10.58.67',
      sn: 'SN-223401',
      resourcePool: '安徽资源池',
      regionCategory: '省级IT云',
      regionCenter: '华中',
      pod: '东莞-kvm资源池',
      vendor: 'BMC',
    },
  ]);

  // 告警收敛 动态筛选结果 (选择上面的条件，下面的表格会跟着变化)
  const filteredConvergenceList = useMemo(() => {
    return convergenceList.filter((item) => {
      // 发生时间筛选
      if (convStartTime.trim()) {
        const start = convStartTime.trim();
        if (item.occurTime < start) return false;
      }
      if (convEndTime.trim()) {
        const end = convEndTime.trim();
        if (item.occurTime > end) return false;
      }

      // 精确查询筛选
      if (exactQuery.trim()) {
        const kw = exactQuery.trim().toLowerCase();
        if (exactQueryType === 'IP') {
          if (!item.ip.toLowerCase().includes(kw)) return false;
        } else if (exactQueryType === '序列号') {
          if (!item.sn.toLowerCase().includes(kw)) return false;
        } else if (exactQueryType === '告警标识') {
          if (!item.alarmTag.toLowerCase().includes(kw)) return false;
        } else {
          // 请选择查询方式 或 全部 模糊匹配
          const matches =
            item.alarmId.toLowerCase().includes(kw) ||
            item.ip.toLowerCase().includes(kw) ||
            item.sn.toLowerCase().includes(kw) ||
            item.alarmTag.toLowerCase().includes(kw) ||
            item.alarmTitle.toLowerCase().includes(kw) ||
            item.businessSystem.toLowerCase().includes(kw);
          if (!matches) return false;
        }
      }

      // 区域分类
      if (regionCategory !== '全部' && item.regionCategory !== regionCategory) return false;

      // 区域中心
      if (regionCenter !== '全部' && item.regionCenter !== regionCenter) return false;

      // 资源池
      if (resourcePool !== '全部' && item.resourcePool !== resourcePool) return false;

      // POD
      if (pod !== '全部' && item.pod !== pod) return false;

      // 设备厂家
      if (vendor !== '全部' && item.vendor !== vendor) return false;

      // 设备类型
      if (deviceType !== '全部' && item.deviceType !== deviceType) return false;

      return true;
    });
  }, [
    convergenceList,
    convStartTime,
    convEndTime,
    exactQueryType,
    exactQuery,
    regionCategory,
    regionCenter,
    resourcePool,
    pod,
    vendor,
    deviceType,
  ]);

  // 告警收敛 重置筛选条件
  const handleResetConvergenceFilters = () => {
    setConvStartTime('');
    setConvEndTime('');
    setExactQueryType('请选择查询方式');
    setExactQuery('');
    setRegionCategory('全部');
    setRegionCenter('全部');
    setResourcePool('全部');
    setPod('全部');
    setVendor('全部');
    setDeviceType('全部');
    showToast('筛选条件已重置，已展示全部收敛告警');
  };

  // ==========================================
  // 3. 故障溯源分析 状态与数据 (按截图完整生成，时间近期化并降序排列，内容全新定制)
  // ==========================================
  const [traceAlarmTab, setTraceAlarmTab] = useState<'主从告警' | '聚合告警'>('主从告警');
  const [traceMetricTab, setTraceMetricTab] = useState<'性能指标' | '日志' | '操作事件'>('性能指标');
  const [traceMetricVisibility, setTraceMetricVisibility] = useState({
    cpu: true,
    mem: true,
    net: true,
    diskIo: true,
    anomalyBand: true,
  });
  const [traceHoverIndex, setTraceHoverIndex] = useState<number | null>(7);

  // 主告警基本信息 (对齐截图1顶部卡片)
  const traceMainAlarm = {
    level: '重大',
    title: '核心骨干交换机跨区BGP路由震荡致时序遥测多路径级联收敛重算',
    systemSource: 'AIOps智能运维总控',
    majorCategory: '时钟与路由同步',
    vendor: '华为',
    deviceType: '核心路由器',
    sn: 'SN_1334',
    deviceName: '环-335',
    ip: '220.15.5.18',
    summary:
      'BGP EVPN邻居Peer心跳丢弃，底层光模块光衰超阈值(-24.8dBm)，导致控制平面发生路由震荡，级联触发全网32个边缘节点长连接池闪断与时序数据上报队列瞬时堆积。',
    resourcePool: '东莞资源池',
    pod: '东莞ironic资源池',
    occurTime: '2026-10-16 15:40:00',
  };

  // 主从告警关联表格数据 (时间按近期降序排列，内容全新生成，字段与截图完全一致)
  // 发生时间 | 告警级别 | 设备名称 | 设备类型 | 系统来源 | 一级专业分类 | 告警标题 | 告警正文 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称
  const traceAlarmList = [
    {
      seq: 1,
      occurTime: '2026-10-16 15:40:00',
      alarmLevel: '重大',
      tag: '主',
      clusterTag: '聚',
      isNew: true,
      treeRole: 'master',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: '网管中心',
      majorCategory: '动环电力及拓扑',
      alarmTitle: '主告警：核心骨干路由BGP会话震荡',
      alarmBody: 'Cisco核心路由器SN_1334出现严重控制平面震荡，导致遥测总线心跳中断',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 2,
      occurTime: '2026-10-16 15:38:12',
      alarmLevel: '高',
      tag: '从',
      clusterTag: undefined,
      isNew: false,
      treeRole: 'slave',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: 'AIOps',
      majorCategory: '异常检测',
      alarmTitle: '从告警：路由器控制板CPU使用率异常升高',
      alarmBody: '由于BGP路由收敛重算，路由引擎CPU利用率突增至94.6%',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 3,
      occurTime: '2026-10-16 15:35:10',
      alarmLevel: '中',
      tag: '从',
      clusterTag: '聚',
      isNew: false,
      treeRole: 'slave',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: '从告警：预测到出向光口可能出现网络拥塞',
      alarmBody: '时序遥测数据显示光口TX队列持续高位(92%)，可能产生次生微秒丢包',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 4,
      occurTime: '2026-10-16 15:28:40',
      alarmLevel: '中',
      tag: '从',
      clusterTag: undefined,
      isNew: false,
      treeRole: 'slave',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: '从告警：预测到路由器控制内存余量不足',
      alarmBody: 'FIB转发表项扩容突发消耗共享内存，余量低于警戒阈值15%',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 5,
      occurTime: '2026-10-16 15:21:15',
      alarmLevel: '中',
      tag: '从',
      clusterTag: undefined,
      isNew: false,
      treeRole: 'slave',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: '从告警：预测到路由器闪存磁盘空间即将耗尽',
      alarmBody: '高频异常转储日志刷盘速率达 42MB/s，闪存预留空间预计30分钟内用尽',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 6,
      occurTime: '2026-10-16 15:15:30',
      alarmLevel: '中',
      tag: '合',
      clusterTag: undefined,
      isNew: false,
      treeRole: 'merge',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: 'AIOps',
      majorCategory: '异常检测',
      alarmTitle: '合告警：路由器边缘端口流量微突发异常',
      alarmBody: '时空关联分析合并了跨汇聚节点的 28 条微突发吞吐量抖动告警',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 7,
      occurTime: '2026-10-16 15:10:00',
      alarmLevel: '中',
      tag: '合',
      clusterTag: undefined,
      isNew: false,
      treeRole: 'merge',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: '合告警：预测到路由器光模块可能出现硬件故障',
      alarmBody: '光模块 DDM 接收光功率衰减异常，预警光衰超标',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 8,
      occurTime: '2026-10-16 14:55:00',
      alarmLevel: '中',
      tag: '合',
      clusterTag: undefined,
      isNew: false,
      treeRole: 'merge',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: 'AIOps',
      majorCategory: '异常检测',
      alarmTitle: '合告警：路由器日志中出现大量TCP握手失败记录',
      alarmBody: 'BGP HoldTime 期间检测到 3 次快速重传，收敛合并为前置合告警',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 9,
      occurTime: '2026-10-16 14:40:20',
      alarmLevel: '低',
      tag: '从',
      clusterTag: undefined,
      isNew: false,
      treeRole: 'slave',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: '从告警：路由器BGP邻居Keepalive响应延迟微涨',
      alarmBody: '检测到与相邻接入层Peer的Keepalive报文应答时间突增至850ms，波动小于警戒门限',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
    {
      seq: 10,
      occurTime: '2026-10-16 14:25:00',
      alarmLevel: '低',
      tag: '合',
      clusterTag: '聚',
      isNew: false,
      treeRole: 'merge',
      deviceName: '环-335',
      deviceType: '核心路由器',
      systemSource: '网管中心',
      majorCategory: '异常检测',
      alarmTitle: '合告警：底层物理链路CRC校验轻微错包聚合',
      alarmBody: '关联分析引擎聚合了主备双链路以太网物理帧的42次CRC校验重发告警',
      ip: '220.15.5.18',
      resourcePool: '东莞资源池',
      pod: '东莞ironic资源池',
      vendor: '华为',
    },
  ];

  // 故障溯源情报 设备主机列表 (对齐截图3表格)
  // 序列号 | 区域分类 | 区域中心 | 资源池 | POD | IP地址 | 设备类型 | 设备名称 | 设备厂家 | 业务系统 | 操作系统 | 告警对应
  const traceIntelligenceList = [
    {
      sn: 'SN-46567',
      regionCategory: '省级IT云',
      regionCenter: '华北二',
      resourcePool: '呼池',
      pod: '呼池-虚拟015',
      ip: '220.10.51.15',
      deviceType: 'server',
      deviceName: 'PC-Core-001',
      vendor: '浪潮',
      businessSystem: '虚拟电厂能量协同总控',
      os: 'Linux 78.6.0.0 (EulerOS)',
      alarmRole: '主',
    },
    {
      sn: 'SN-8379952',
      regionCategory: '省级IT云',
      regionCenter: '东北',
      resourcePool: '沈池',
      pod: '沈池-ironic01',
      ip: '220.10.52.23',
      deviceType: 'router',
      deviceName: 'R-Border-335',
      vendor: '华为',
      businessSystem: '多能互补时序大数据',
      os: 'VRP 8.21.0',
      alarmRole: '从',
    },
    {
      sn: 'SN-775589',
      regionCategory: '一级资源池',
      regionCenter: '华北一',
      resourcePool: '京池',
      pod: '京池-KVM02',
      ip: '220.10.53.88',
      deviceType: 'switch',
      deviceName: 'SW-Agg-05',
      vendor: '新华三',
      businessSystem: '负荷聚合计费结算中心',
      os: 'Comware V7.1',
      alarmRole: '从',
    },
    {
      sn: 'SN-788012',
      regionCategory: '池外',
      regionCenter: '华中',
      resourcePool: '汉池',
      pod: '汉池-POD08',
      ip: '220.10.54.42',
      deviceType: 'storage',
      deviceName: 'SAN-Array-01',
      vendor: '中兴',
      businessSystem: '电价智能实时预测引擎',
      os: 'StorageOS 4.2',
      alarmRole: '从',
    },
    {
      sn: 'SN-113204',
      regionCategory: '省级IT云',
      regionCenter: '华东',
      resourcePool: '穗池',
      pod: '穗池-GPU03',
      ip: '220.10.55.19',
      deviceType: 'gateway',
      deviceName: 'LB-VIP-09',
      vendor: '思科',
      businessSystem: '微电网分布式协同控制',
      os: 'IOS-XE 17.6',
      alarmRole: '从',
    },
  ];

  // 时序指标采样数据 (对齐截图3图表，近期时间，含异常告警周期高亮)
  const traceMetricSeries = [
    { time: '14:55:00', cpu: 25, mem: 28, net: 30, diskIo: 20, isAlarm: false },
    { time: '15:00:00', cpu: 32, mem: 31, net: 42, diskIo: 22, isAlarm: false },
    { time: '15:05:00', cpu: 38, mem: 34, net: 35, diskIo: 24, isAlarm: false },
    { time: '15:10:00', cpu: 44, mem: 36, net: 20, diskIo: 27, isAlarm: true }, // 告警周期1
    { time: '15:15:00', cpu: 42, mem: 38, net: 58, diskIo: 25, isAlarm: true },
    { time: '15:20:00', cpu: 31, mem: 34, net: 44, diskIo: 23, isAlarm: false },
    { time: '15:25:00', cpu: 26, mem: 30, net: 19, diskIo: 24, isAlarm: false },
    { time: '15:30:00', cpu: 35, mem: 40, net: 22, diskIo: 29, isAlarm: true }, // 告警周期2 (主事件)
    { time: '15:35:00', cpu: 42, mem: 78, net: 38, diskIo: 32, isAlarm: true },
    { time: '15:40:00', cpu: 92, mem: 86, net: 46, diskIo: 68, isAlarm: true }, // 触发主告警
    { time: '15:45:00', cpu: 60, mem: 72, net: 52, diskIo: 46, isAlarm: true },
    { time: '15:50:00', cpu: 40, mem: 44, net: 40, diskIo: 34, isAlarm: false },
    { time: '15:55:00', cpu: 33, mem: 36, net: 26, diskIo: 26, isAlarm: false },
    { time: '16:00:00', cpu: 28, mem: 32, net: 20, diskIo: 22, isAlarm: false },
    { time: '16:05:00', cpu: 34, mem: 35, net: 28, diskIo: 25, isAlarm: false },
    { time: '16:10:00', cpu: 42, mem: 41, net: 46, diskIo: 28, isAlarm: false },
    { time: '16:15:00', cpu: 52, mem: 44, net: 51, diskIo: 33, isAlarm: true }, // 告警周期3
    { time: '16:20:00', cpu: 38, mem: 32, net: 26, diskIo: 21, isAlarm: true },
    { time: '16:25:00', cpu: 22, mem: 18, net: 14, diskIo: 15, isAlarm: true },
    { time: '16:30:00', cpu: 18, mem: 22, net: 16, diskIo: 18, isAlarm: false },
  ];

  // 日志流数据 (近期时间降序排列)
  const traceLogList = [
    {
      time: '2026-10-16 15:40:02',
      level: 'FATAL',
      source: 'kernel:ksoftirqd/3',
      content: 'softirq skew detected: net_rx processing time exceeded 45ms threshold, 12,480 packets dropped',
    },
    {
      time: '2026-10-16 15:39:58',
      level: 'ERROR',
      source: 'bgpd[3182]',
      content: 'BGP EVPN Peer 220.15.5.18 HoldTimer expired (90s), state change from Established to Idle',
    },
    {
      time: '2026-10-16 15:38:12',
      level: 'WARN',
      source: 'snmpd:sensor',
      content: 'Optical Transceiver Port Ten-Gig0/1/4 RX Power -24.8dBm is below Warning Threshold (-23.0dBm)',
    },
    {
      time: '2026-10-16 15:35:10',
      level: 'WARN',
      source: 'queue_monitor',
      content: 'Egress buffer occupancy 92.4% on interface HundredGigE0/0/1, PFC pause frames sent: 4820',
    },
    {
      time: '2026-10-16 15:28:40',
      level: 'INFO',
      source: 'fib_alloc',
      content: 'Route table prefix capacity auto-scaling triggered, allocated 32MB continuous pool',
    },
  ];

  // 操作审计事件 (近期时间降序排列)
  const traceOperationList = [
    {
      time: '2026-10-16 15:30:15',
      user: 'admin_sys02',
      action: '修改BGP Route-Policy',
      target: 'Core-Router-V09',
      result: '成功',
      detail: '更新 AS-Path 过滤黑名单规则，触发全量 FIB 路由表软重置',
    },
    {
      time: '2026-10-16 15:12:00',
      user: 'aiops_automation',
      action: '自动执行光衰补偿',
      target: 'Ten-Gig0/1/4',
      result: '部分成功',
      detail: '自适应增益放大器增益提升 1.5dB，但光信噪比仍低于警戒线',
    },
    {
      time: '2026-10-16 14:40:22',
      user: 'devops_runner',
      action: '配置基线同步下发',
      target: '东莞ironic集群',
      result: '成功',
      detail: '批量下发虚拟电厂时序遥测采集代理微内核补丁 v3.4.1',
    },
  ];

  // ==========================================
  // 4. 定界定位 拓扑与节点属性数据 (按原型字段与最新时序生成，时间近期且降序排列)
  // ==========================================
  const [selectedDemarcNode, setSelectedDemarcNode] = useState<'device' | 'alarm' | 'metric' | 'service' | 'resource'>('device');

  // 定界定位顶部要素 (对齐原型)
  const demarcHeader = {
    deviceObject: '（环-3355）',
    metric: '（disk_IO_rate）',
    startAlarm: '（cpu_rate异常检测告警）',
    secondMetric: '（memory_rate）',
  };

  // 节点详情 - 设备对象属性 (对齐原型字段)
  // 序列号： | 资源池： | 设备对象 | 设备名称： | IP地址： | 设备类型： | 设备厂商： | 资源池： | POD： | 系统来源：
  const demarcDeviceNode = {
    sn: 'SN-46567',
    resourcePool: '省级IT云-华北二-呼池',
    deviceName: '环-3355',
    ip: '220.10.51.15',
    deviceType: '服务器 / 虚拟化宿主机',
    vendor: '华为技术',
    pod: '呼池-虚拟015',
    systemSource: 'AIOps智能运维总控平台',
  };

  // 节点详情 - 告警节点属性 (对齐原型字段)
  // 告警标题： | 一级专业分类： | 告警时间： | 告警级别： | 告警正文： | 根因分析
  const demarcAlarmNode = {
    title: 'cpu_rate异常检测告警 (控制板CPU瞬时突增)',
    majorCategory: '异常检测',
    alarmTime: '2026-10-16 15:40:00',
    alarmLevel: '重大',
    alarmBody: '设备环-3355(SN-46567)由于底层FIB转发表频繁重算与软中断倾斜，单核占用达98.2%，超过高危阈值持续90s。',
  };

  // 节点详情 - 指标属性 (对齐原型字段)
  // 关联数据采集时间： | 指标名称： | 起始告警关联数据： | 采集时间： | 最新数据： | 是否触发告警： | 告警标题： | 告警时间： | 告警级别：
  const demarcMetricNode = {
    relatedCollectTime: '2026-10-16 15:39:50',
    metricName: 'disk_IO_rate',
    startAlarmRelatedData: 'cpu_rate: 98.2% | softirq_skew: 0.89',
    collectTime: '2026-10-16 15:40:00',
    latestData: '94.8 MB/s (动态基线 24.2 MB/s)',
    isTriggerAlarm: '是 (高于动态基线阈值 58%)',
    alarmTitle: 'disk_IO_rate持续高位突发告警',
    alarmTime: '2026-10-16 15:40:00',
    alarmLevel: '高',
  };

  // 节点详情 - 服务属性 (对齐原型字段)
  // 服务端口： | 服务名称： | 启动状态： | 描述信息： | 部署方式： | 日志路径： | 版本信息： | 连接数： | 应用： | 启动类型：
  const demarcServiceNode = {
    servicePort: 'TCP: 6653 / UDP: 4789 (Geneve)',
    serviceName: 'ksoftirqd/3 & openvswitch-vswitchd',
    runStatus: 'DEGRADED (受损运行)',
    desc: '虚拟交换机内核流表查询模块，负责将物理网卡多队列报文分发至各虚机微切片',
    deployType: 'Host Kernel Module / Systemd',
    logPath: '/var/log/openvswitch/ovs-vswitchd.log',
    version: 'OVS v2.17.2-LTS-Euler',
    connectionCount: '28,450',
    appName: '虚拟电厂能量协同总控系统 (VPP-Core)',
    startupType: 'System Boot (开机自启)',
  };

  // 节点详情 - 资源/磁盘属性 (对齐原型字段)
  // 运行状态： | 磁盘ID： | 磁盘名称： | 已用容量： | 总容量： | 可用容量： | 位置信息： | 磁盘类型： | 健康状态： | 节点ID： | 磁盘域ID：
  const demarcResourceNode = {
    runStatus: 'WARNING (告警预警)',
    diskId: 'DISK-NVME-008',
    diskName: 'Huawei-SSD-ES3000-V5',
    usedCapacity: '768.4 GB (89.3%)',
    totalCapacity: '860.0 GB',
    freeCapacity: '91.6 GB',
    location: '机架 DC-02-Rack08 槽位 #04',
    diskType: 'NVMe SSD PCIe 4.0',
    healthStatus: '良好 (SMART 寿命余量 96%)',
    nodeId: 'HOST-HUCHI-3355',
    diskDomainId: 'STORAGE-DOMAIN-CEPH-01',
  };

  // ==========================================
  // 5. 定界定位 (表格) 数据 (按截图三大模块精确实现，时间近期且降序排列，内容定制)
  // ==========================================
  const [activeDemarcPathItem, setActiveDemarcPathItem] = useState<{
    resourceCategory: string;
    resourceName: string;
    resourceId: string;
    prob: string;
    pathInfo: string;
    pathSteps: { step: string; id: string; prob: string }[];
  } | null>(null);

  const [demarcSortDesc, setDemarcSortDesc] = useState<boolean>(true);

  // 模块一: 主告警基本信息 (对齐截图)
  // 重大 | 网管中心 | 类型 | 告警标题 | 告警正文摘要 | 告警时间
  const demarcTableMainAlarm = {
    level: '重大',
    systemSource: '网管中心',
    alarmType: '存储与控制总线时序异常',
    title: '分布式块存储池底层 NVMe 阵列 I/O 写入延迟超标与控制器反压告警',
    summary:
      '监测到呼池分布式块存储 0428 节点因底层控制器缓存高水位写回受阻，写入时延由 1.2ms 异常突增至 280ms，触发上游 Ceph 客户端事务挂起与多节点心跳重传。',
    alarmTime: '2026-10-16 15:40:00',
  };

  // 模块二: 主告警设备信息 (对齐截图10个字段标题)
  // 设备序列号 | 设备类型 | 设备名称 | 设备厂家 | 业务系统 | 资源池 | POD | 管理IP地址 | 业务IP地址 | 操作系统
  const demarcTableDevice = {
    sn: 'SN-46567',
    deviceType: 'server (虚拟化计算宿主机)',
    deviceName: 'PC-Edge-Core-001',
    vendor: '华为技术 (FusionServer Pro)',
    businessSystem: '虚拟电厂能量协同与计费总控',
    resourcePool: '省级IT云-华北二-呼池',
    pod: '东莞ironic资源池 (POD-015)',
    manageIp: '220.10.51.15',
    businessIp: '220.10.51.55',
    os: 'EulerOS 22.03 LTS (Linux 5.10.0-182)',
  };

  // 模块三: 定界定位结论列表 (对齐截图表头：序号 | 结论概率 | 资源类别 | 资源名称 | 资源ID | 定界定位路径信息 | 路径节点数 | 定界定位路径图)
  // 时间均按近期降序排列
  const demarcTableConclusionList = [
    {
      seq: 1,
      occurTime: '2026-10-16 15:40:00',
      prob: '90%',
      probVal: 90,
      resourceCategory: '磁盘',
      resourceName: 'raid_nvme_445',
      resourceId: 'RES-DISK-0428',
      pathInfo:
        '计算节点: RES-NODE-46567 (95%) --> 分布式块0428: RES-BLK-0428 (90%) --> 存储控制器: RES-CTRL-09 (82%) --> 磁盘: RES-DISK-0428',
      pathSteps: [
        { step: '计算节点', id: 'RES-NODE-46567', prob: '95%' },
        { step: '分布式块0428', id: 'RES-BLK-0428', prob: '90%' },
        { step: '存储控制器', id: 'RES-CTRL-09', prob: '82%' },
        { step: '磁盘', id: 'RES-DISK-0428', prob: '90%' },
      ],
      nodeCount: 4,
    },
    {
      seq: 2,
      occurTime: '2026-10-16 15:38:12',
      prob: '80%',
      probVal: 80,
      resourceCategory: '磁盘域',
      resourceName: 'mem_domain_1334',
      resourceId: 'RES-MEM-8812',
      pathInfo:
        '业务容器: POD-VPP-01 (92%) --> 虚拟切片网络: VNET-OVS (86%) --> 内核协议栈: TCP-SOCK-44 (83%) --> 内存总线: BUS-NUMA-02 (80%) --> 磁盘域: RES-MEM-8812',
      pathSteps: [
        { step: '业务容器', id: 'POD-VPP-01', prob: '92%' },
        { step: '虚拟切片网络', id: 'VNET-OVS', prob: '86%' },
        { step: '内核协议栈', id: 'TCP-SOCK-44', prob: '83%' },
        { step: '内存总线', id: 'BUS-NUMA-02', prob: '80%' },
        { step: '磁盘域', id: 'RES-MEM-8812', prob: '80%' },
      ],
      nodeCount: 5,
    },
    {
      seq: 3,
      occurTime: '2026-10-16 15:35:10',
      prob: '70%',
      probVal: 70,
      resourceCategory: '存储池',
      resourceName: 'ceph_pool_335',
      resourceId: 'RES-POOL-9930',
      pathInfo:
        '网关负载均衡: LB-VIP-09 (88%) --> 存储客户端: CEPH-CLI-01 (79%) --> PG资源映射: PG-GROUP-12 (72%) --> 存储池: RES-POOL-9930',
      pathSteps: [
        { step: '网关负载均衡', id: 'LB-VIP-09', prob: '88%' },
        { step: '存储客户端', id: 'CEPH-CLI-01', prob: '79%' },
        { step: 'PG资源映射', id: 'PG-GROUP-12', prob: '72%' },
        { step: '存储池', id: 'RES-POOL-9930', prob: '70%' },
      ],
      nodeCount: 4,
    },
    {
      seq: 4,
      occurTime: '2026-10-16 15:28:40',
      prob: '60%',
      probVal: 60,
      resourceCategory: '逻辑单元（LUN）',
      resourceName: 'lun_vpp_core_01',
      resourceId: 'RES-LUN-1024',
      pathInfo:
        'SCSI主机适配器: HBA-PORT-01 (70%) --> 存储映射通道: MAP-CHAN-04 (66%) --> 逻辑单元: RES-LUN-1024',
      pathSteps: [
        { step: 'SCSI主机适配器', id: 'HBA-PORT-01', prob: '70%' },
        { step: '存储映射通道', id: 'MAP-CHAN-04', prob: '66%' },
        { step: '逻辑单元', id: 'RES-LUN-1024', prob: '60%' },
      ],
      nodeCount: 3,
    },
    {
      seq: 5,
      occurTime: '2026-10-16 15:21:15',
      prob: '50%',
      probVal: 50,
      resourceCategory: '逻辑单元组',
      resourceName: 'logic_group_storage_11',
      resourceId: 'RES-GRP-5510',
      pathInfo:
        '应用集群实例: APP-INGRESS (62%) --> 卷管理器: LVM-POOL-03 (58%) --> 逻辑单元组: RES-GRP-5510',
      pathSteps: [
        { step: '应用集群实例', id: 'APP-INGRESS', prob: '62%' },
        { step: '卷管理器', id: 'LVM-POOL-03', prob: '58%' },
        { step: '逻辑单元组', id: 'RES-GRP-5510', prob: '50%' },
      ],
      nodeCount: 3,
    },
  ];

  // ==========================================
  // 6. 故障根因分析 核心数据与交互状态 (对齐原型全量字段标题，时间近期严格降序，高保真全新数据)
  // ==========================================
  const [rcaDeviceTypeFilter, setRcaDeviceTypeFilter] = useState('全部');
  const [rcaAlarmTitleFilter, setRcaAlarmTitleFilter] = useState('');
  const [rcaIpFilter, setRcaIpFilter] = useState('');
  const [rcaLogTitleFilter, setRcaLogTitleFilter] = useState('');
  const [rcaEventTitleFilter, setRcaEventTitleFilter] = useState('');
  const [rcaNodeQuery, setRcaNodeQuery] = useState('');
  const [rcaGraphMode, setRcaGraphMode] = useState<'topology' | 'timeline'>('topology');
  const [rcaPenetrateTab, setRcaPenetrateTab] = useState<'alarm' | 'event' | 'log'>('alarm');
  const [selectedRcaComboIndex, setSelectedRcaComboIndex] = useState<number>(0);
  const [rcaPrimaryCardTab, setRcaPrimaryCardTab] = useState<'alarm' | 'log' | 'event'>('alarm');
  const [selectedRcaNode, setSelectedRcaNode] = useState<{
    id: string;
    name: string;
    type: 'alarm' | 'log' | 'event';
    level: string;
    time: string;
    role: string;
    detail: string;
    ip: string;
    device: string;
    source: string;
  } | null>(null);
  const [showFullRcaTopologyModal, setShowFullRcaTopologyModal] = useState<boolean>(false);

  // 根因分析结论组合 (多组候选根因结论，时间近期降序，置信度排序)
  const rcaCombos = [
    {
      seq: 1,
      prob: '88%',
      probVal: 88,
      name: '分布式存储 NVMe 阵列缓存溢出导致控制器反压及软中断锁死',
      time: '2026-10-16 15:40:00',
      deviceType: '分布式存储节点',
      ip: '220.10.51.15',
      counts: { alarms: 4, events: 2, logs: 3, totalNodes: 9 },
      alarmTitle: '分布式块存储 pool-0428 写入延迟超标与控制器反压告警',
      logTitle: 'nvme_controller_timeout_abort: Command 0x3a4f wait completion timeout',
      eventTitle: '分布式存储底层 sysctl 动态调优变更上线',
      statusTag: '主根因推荐',
      actionPlan: '下发存储阵列缓存刷新与 I/O 队列重调度预案',
    },
    {
      seq: 2,
      prob: '78%',
      probVal: 78,
      name: '网关物理端口 NAPI Poll 软中断核亲和性倾斜与 RingBuffer 溢出',
      time: '2026-10-16 15:35:10',
      deviceType: '骨干网关',
      ip: '220.10.51.10',
      counts: { alarms: 3, events: 1, logs: 2, totalNodes: 6 },
      alarmTitle: '骨干网关 GE 1/1/1 网络接口丢包率持续超标',
      logTitle: 'napi_poll_weight_exceeded: CPU Core #3 softirq load 100%',
      eventTitle: '网关端口多队列动态扩容调度工单执行',
      statusTag: '次要候选',
      actionPlan: '执行网卡多队列 NUMA RSS 动态均衡绑核预案',
    },
    {
      seq: 3,
      prob: '68%',
      probVal: 68,
      name: '业务容器 CGroup 内存超额回收引发 JVM 持续垃圾回收长停顿 (STW)',
      time: '2026-10-16 15:28:40',
      deviceType: '服务器 (K8s微服务)',
      ip: '10.244.18.92',
      counts: { alarms: 2, events: 1, logs: 2, totalNodes: 5 },
      alarmTitle: '交易微服务响应毛刺且 HTTP 504 错误率升高',
      logTitle: 'jvm_gc_pause_duration_exceeded: G1 Young GC took 2840ms',
      eventTitle: '容器 CGroup 内存配额动态伸缩调整',
      statusTag: '次要候选',
      actionPlan: '扩容容器内存 Limit 门限并触发微服务弹性副本伸缩',
    },
    {
      seq: 4,
      prob: '67%',
      probVal: 67,
      name: '运维变更执行分布式数据库连接池缩容引发瞬时突发排队',
      time: '2026-10-16 15:18:22',
      deviceType: '服务器 (DB集群)',
      ip: '220.10.52.23',
      counts: { alarms: 2, events: 2, logs: 1, totalNodes: 5 },
      alarmTitle: 'PostgreSQL 核心主库事务写延迟毛刺突增',
      logTitle: 'pg_pool_connection_starvation: pool wait queue > 500',
      eventTitle: '数据库连接池参数热重载工单',
      statusTag: '诱发因素',
      actionPlan: '一键热回滚数据库连接池参数并重启 PgBouncer',
    },
    {
      seq: 5,
      prob: '58%',
      probVal: 58,
      name: '智能动力环境机房 PDU 电源电压波动瞬态尖峰致动环传感器误报',
      time: '2026-10-16 15:05:00',
      deviceType: '动环监控设备',
      ip: '192.168.100.12',
      counts: { alarms: 1, events: 1, logs: 1, totalNodes: 3 },
      alarmTitle: '机房 02-Rack08 供电相位微电流抖动预警',
      logTitle: 'pdu_sensor_sample_spike: phase B voltage ripple > 8%',
      eventTitle: '机房配电柜常规自检巡检',
      statusTag: '辅助告警',
      actionPlan: '标记为动环误报并通知配电值班工程师现场排查',
    },
  ];

  // 核心主节点详情 (对齐原型三大卡片全字段：告警 / 日志 / 事件)
  const rcaPrimaryCards = {
    alarm: {
      occurTime: '2026-10-16 15:40:00',
      level: '重大',
      source: '网管中心 动环',
      systemSource: '网管中心',
      majorCategory: '分布式存储系统',
      deviceType: '分布式存储节点 / 网关',
      deviceName: 'HOST-HUCHI-3355',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
      title: '分布式块存储 pool-0428 写入延迟超标与控制器反压告警',
      body: '监测到呼池分布式块存储 0428 节点因底层控制器缓存高水位写回受阻，写入时延由 1.2ms 异常突增至 280ms，触发上游 Ceph 客户端事务挂起与多节点心跳重传。',
      prob: '88%',
    },
    log: {
      occurTime: '2026-10-16 15:38:22',
      level: '高级',
      service: 'storage-io-daemon',
      program: 'nvme_core',
      tag: 'IO_TIMEOUT / DRV_ABORT',
      deviceType: '分布式存储节点',
      deviceName: 'HOST-HUCHI-3355',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
      title: 'nvme_controller_timeout_abort: Command 0x3a4f wait completion timeout',
      body: '[15:38:22.418] io_poll_queue_timeout: NVMe PCIe controller 0000:3b:00.0 CID 0x3a4f wait completion timeout > 30000ms, abort command submitted to controller, hardware retry exhausted.',
      prob: '85%',
    },
    event: {
      occurTime: '2026-10-16 15:35:10',
      source: 'CMDB 运维变更管理平台',
      eventType: '内核参数动态调优 (sysctl)',
      deviceType: '分布式存储节点',
      deviceName: 'HOST-HUCHI-3355',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
      title: '分布式存储底层 sysctl 动态调优变更上线',
      body: '变更工单 CHG-20261016-8801：运维人员热加载执行了 sysctl -p 调整存储节点 net.core.wmem_max 与 nvme.io_timeout 限制，由于高并发导致驱动内部等待队列突发锁死。',
      prob: '92%',
    },
  };

  // 故障因果拓扑图节点与因果连线 (含 #主要告警光影效果# 与 #根因光影效果#)
  const rcaTopolNodes = [
    {
      id: 'EVT-01',
      name: 'CMDB参数调优变更',
      type: 'event' as const,
      level: '高级',
      time: '2026-10-16 15:35:10',
      role: '诱发根因',
      glow: 'cause' as const,
      ip: '220.10.51.15',
      device: 'HOST-HUCHI-3355',
      source: 'CMDB运维平台',
      detail: '热加载 sysctl -p 调整存储节点 net.core.wmem_max 与 nvme.io_timeout',
      x: 10,
      y: 40,
    },
    {
      id: 'LOG-01',
      name: 'nvme_core驱动超时日志',
      type: 'log' as const,
      level: '高级',
      time: '2026-10-16 15:38:22',
      role: '内核征兆',
      glow: 'cause' as const,
      ip: '220.10.51.15',
      device: 'HOST-HUCHI-3355',
      source: 'nvme_core 内核驱动',
      detail: 'CID 0x3a4f wait completion timeout > 30000ms, abort submitted',
      x: 28,
      y: 40,
    },
    {
      id: 'ALM-01',
      name: '存储I/O写入延迟超标',
      type: 'alarm' as const,
      level: '重大',
      time: '2026-10-16 15:40:00',
      role: '主要告警',
      glow: 'main' as const,
      ip: '220.10.51.15',
      device: 'HOST-HUCHI-3355',
      source: '网管中心',
      detail: '分布式块存储 pool-0428 写入时延突增至 280ms，触发写反压',
      x: 48,
      y: 40,
    },
    {
      id: 'ALM-02',
      name: 'CPU Core#3 软中断100%',
      type: 'alarm' as const,
      level: '高',
      time: '2026-10-16 15:41:15',
      role: '次级传播',
      glow: 'normal' as const,
      ip: '220.10.51.15',
      device: 'HOST-HUCHI-3355',
      source: 'AIOps异常检测',
      detail: 'ksoftirqd/3 持续打满，多队列中断 RSS 调度失衡',
      x: 68,
      y: 22,
    },
    {
      id: 'ALM-03',
      name: '网卡 RingBuffer 满溢丢包',
      type: 'alarm' as const,
      level: '高',
      time: '2026-10-16 15:42:30',
      role: '级联效应',
      glow: 'normal' as const,
      ip: '220.10.51.15',
      device: 'HOST-HUCHI-3355',
      source: '网管中心',
      detail: '网卡 rx_queue_0 丢包率达 6.42%，主机缓冲耗尽',
      x: 88,
      y: 22,
    },
    {
      id: 'ALM-04',
      name: '数据库写入延迟突增',
      type: 'alarm' as const,
      level: '中',
      time: '2026-10-16 15:43:00',
      role: '业务影响',
      glow: 'normal' as const,
      ip: '220.10.52.23',
      device: 'DB-PG-CLUSTER-02',
      source: 'AIOps故障预测',
      detail: 'PostgreSQL 事务队列积压，RPC 端到端时延上升',
      x: 78,
      y: 65,
    },
  ];

  // 拓扑连线
  const rcaTopolEdges = [
    { from: 'EVT-01', to: 'LOG-01', prob: '94%', label: '参数诱发超时' },
    { from: 'LOG-01', to: 'ALM-01', prob: '91%', label: '驱动死锁引起反压' },
    { from: 'ALM-01', to: 'ALM-02', prob: '88%', label: '反压导致软中断锁' },
    { from: 'ALM-02', to: 'ALM-03', prob: '85%', label: '中断耗尽引发丢包' },
    { from: 'ALM-01', to: 'ALM-04', prob: '82%', label: '存储时延波及数据库' },
  ];

  // 故障因果关系时序图 (三轨道瀑布流：告警、日志、事件，严格按近期时间倒序排列)
  const rcaTimelineWaterfall = [
    {
      id: 'TL-01',
      time: '2026-10-16 15:43:00',
      track: 'alarm' as const,
      level: '中级',
      title: '业务感知：PostgreSQL 写入事务队列阻塞',
      content: '主库事务等待队列超过 500 个，客户端写入延迟上涨至 1250ms',
      entity: 'DB-PG-CLUSTER-02',
      isRootInterval: false,
    },
    {
      id: 'TL-02',
      time: '2026-10-16 15:42:30',
      track: 'alarm' as const,
      level: '高级',
      title: '网络传输：GE 1/1/1 网卡丢包率达 6.42%',
      content: 'RingBuffer 接收缓冲区溢出，NIC rx_dropped 持续飙升',
      entity: 'HOST-HUCHI-3355',
      isRootInterval: false,
    },
    {
      id: 'TL-03',
      time: '2026-10-16 15:41:15',
      track: 'alarm' as const,
      level: '高级',
      title: '操作系统：CPU Core #3 ksoftirqd 持续 100%',
      content: '多网卡队列 RSS 绑定倾斜至单核，软中断处理饥饿',
      entity: 'HOST-HUCHI-3355',
      isRootInterval: false,
    },
    {
      id: 'TL-04',
      time: '2026-10-16 15:40:00',
      track: 'alarm' as const,
      level: '重大',
      title: '存储硬件：分布式块存储 pool-0428 写入延迟超标 (主告警)',
      content: 'NVMe 存储阵列控制器高水位反压，写时延突破 280ms 警戒阈值',
      entity: 'HOST-HUCHI-3355 (分布式存储)',
      isRootInterval: true,
      glow: 'main',
    },
    {
      id: 'TL-05',
      time: '2026-10-16 15:38:22',
      track: 'log' as const,
      level: '高级',
      title: '内核驱动：nvme_core io_poll_queue_timeout > 30s (根因日志)',
      content: 'PCIe 0000:3b:00.0 CID 0x3a4f wait completion timeout, abort command submitted',
      entity: 'HOST-HUCHI-3355 (nvme_core)',
      isRootInterval: true,
      glow: 'cause',
    },
    {
      id: 'TL-06',
      time: '2026-10-16 15:36:45',
      track: 'log' as const,
      level: '中级',
      title: '协议栈：TCP socket send buffer memory pressure',
      content: '内核 wmem 申请超过单套接字上限，TCP 拥塞窗口收缩至 2 MSS',
      entity: 'HOST-HUCHI-3355',
      isRootInterval: true,
    },
    {
      id: 'TL-07',
      time: '2026-10-16 15:35:10',
      track: 'event' as const,
      level: '高级',
      title: '运维管理：CMDB 执行内核参数 sysctl 动态调优上线 (诱发事件)',
      content: '运维工程师热加载调整 net.core.wmem_max 与 nvme.io_timeout 参数',
      entity: 'HOST-HUCHI-3355 (CMDB变更工单)',
      isRootInterval: true,
      glow: 'cause',
    },
    {
      id: 'TL-08',
      time: '2026-10-16 15:30:00',
      track: 'event' as const,
      level: '低级',
      title: '巡检审计：存储控制器缓存电池 BBU 周期性状态校验',
      content: '存储控制器固件执行例行自检，短时由 Write-Back 降级为 Write-Through',
      entity: 'SAN-CTRL-09',
      isRootInterval: false,
    },
    {
      id: 'TL-09',
      time: '2026-10-16 15:25:00',
      track: 'log' as const,
      level: '低级',
      title: '服务监控：分布式 Ceph OSD-04 心跳包轻度抖动',
      content: 'OSD 心跳周期耗时 120ms (常规 5ms)，未超过剔除集群阈值',
      entity: 'HOST-HUCHI-3355',
      isRootInterval: false,
    },
    {
      id: 'TL-10',
      time: '2026-10-16 15:20:00',
      track: 'alarm' as const,
      level: '低级',
      title: '动环监控：机房 A 栋机架供电 PDU 谐波电流瞬变',
      content: 'PDU B 相瞬态谐波电流微弱超标，传感器已自动恢复平稳',
      entity: 'PDU-POWER-DC02',
      isRootInterval: false,
    },
    {
      id: 'TL-11',
      time: '2026-10-16 15:10:00',
      track: 'event' as const,
      level: '低级',
      title: '调度事件：容器编排系统触发非核心 Pod 滚动更新',
      content: '边缘计算推理应用滚动发布完成 4/4 副本，流量切换顺畅',
      entity: 'POD-INGRESS-01',
      isRootInterval: false,
    },
  ];

  // 穿透详情表 1: 故障/告警详情列表 (对齐原型 14 个字段，时间近期降序，内容全新)
  // 序号 | 发生时间 | 告警级别 | 设备名称 | 设备类型 | 系统来源 | 一级专业分类 | 告警标题 | 告警正文 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称
  const rcaDetailAlarmList = [
    {
      seq: 1,
      occurTime: '2026-10-16 15:40:00',
      level: '重大',
      deviceName: 'HOST-HUCHI-3355',
      deviceType: '分布式存储',
      systemSource: '网管中心',
      majorCategory: '动环与存储',
      alarmTitle: '分布式块存储 pool-0428 写入延迟超标与控制器反压告警',
      alarmBody: '监测到呼池分布式块存储 0428 节点因底层控制器缓存高水位写回受阻，写入时延由 1.2ms 异常突增至 280ms，触发上游 Ceph 事务挂起与多节点心跳重传。',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      seq: 2,
      occurTime: '2026-10-16 15:38:45',
      level: '高级',
      deviceName: 'HOST-HUCHI-3355',
      deviceType: '虚拟宿主机',
      systemSource: 'AIOps',
      majorCategory: '异常检测',
      alarmTitle: 'CPU Core #3 ksoftirqd 软中断单核占满持续超标告警',
      alarmBody: '单核软中断 CPU 占用率持续达 100% 超 180 秒，触发 ksoftirqd 抢占超时，I/O 调度队列出现反压死锁。',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      seq: 3,
      occurTime: '2026-10-16 15:37:12',
      level: '高级',
      deviceName: 'SW-TOR-LEAF02',
      deviceType: '交换机',
      systemSource: '网管中心',
      majorCategory: '网络设备',
      alarmTitle: '存储专用 ToR 交换机端口 PFC 流控拥塞与降速告警',
      alarmBody: '100GE 1/0/2 端口持续接收到来自存储阵列的 PFC 优先级流控暂停帧，链路传输吞吐暴跌 82%。',
      ip: '220.10.51.2',
      sn: 'SN-99812',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华三',
    },
    {
      seq: 4,
      occurTime: '2026-10-16 15:35:00',
      level: '中级',
      deviceName: 'DB-PG-CLUSTER-02',
      deviceType: '服务器',
      systemSource: 'AIOps',
      majorCategory: '故障预测',
      alarmTitle: 'PostgreSQL 核心主库事务写延迟毛刺突增异常预警',
      alarmBody: 'write_io_latency 突破预测基线 180%，预测在 10 分钟内发生级联阻塞，可能波及能量交易计费账单事务。',
      ip: '220.10.52.23',
      sn: 'SN-8379952',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '京池-虚拟023',
      vendor: '中兴',
    },
    {
      seq: 5,
      occurTime: '2026-10-16 15:30:15',
      level: '低级',
      deviceName: 'PDU-POWER-DC02',
      deviceType: '动环监控',
      systemSource: '动环监控',
      majorCategory: '动力环境',
      alarmTitle: '机房 02-Rack08 供电相位微电流抖动瞬态预警',
      alarmBody: '检测到机柜 PDU 相位电流微秒级瞬态变化率 > 15%，未触发跳闸保护阈值，属电网波动谐波干扰。',
      ip: '192.168.100.12',
      sn: 'SN-PDU-08',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-动力区',
      vendor: '维谛',
    },
    {
      seq: 6,
      occurTime: '2026-10-16 15:21:00',
      level: '中级',
      deviceName: 'PC-EDGE-CORE-01',
      deviceType: '服务器',
      systemSource: 'AIOps',
      majorCategory: '异常检测',
      alarmTitle: '边缘网关代理连接超时与 HTTP 504 错误率升高',
      alarmBody: '上游 API Gateway 对存储代理后端反向代理请求超时比例升至 3.4%，触达业务降级警戒线。',
      ip: '220.10.51.55',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
  ];

  // 穿透详情表 2: 事件详情列表 (对齐原型 13 个字段，时间近期降序，内容全新)
  // 序号 | 时间 | 事件来源 | 事件类型 | 事件标题 | 事件内容 | 网元名称 | 设备类型 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称
  const rcaDetailEventList = [
    {
      seq: 1,
      time: '2026-10-16 15:35:10',
      source: 'CMDB',
      type: '内核调优',
      title: '分布式存储底层 sysctl 动态调优热更新',
      content: '变更工单 CHG-20261016-8801：运维人员热加载执行了 sysctl -p 调整存储节点 net.core.wmem_max 与 nvme.io_timeout 限制，由于并发量高导致驱动内部等待队列突发锁死。',
      netElementName: 'HOST-HUCHI-3355',
      deviceType: '虚拟宿主机',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      seq: 2,
      time: '2026-10-16 15:30:00',
      source: '巡检中心',
      type: '自动巡检',
      title: '存储阵列 BBU 电池学习自检状态变更',
      content: '存储控制器固件执行电池学习放电测试，写缓存由 Write-Back 模式临时降级为 Write-Through 安全直写模式，致写入 I/O 吞吐受限。',
      netElementName: 'SAN-CTRL-09',
      deviceType: '存储控制器',
      ip: '220.10.51.18',
      sn: 'SN-CTRL-09',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      seq: 3,
      time: '2026-10-16 15:20:00',
      source: '变更平台',
      type: '服务重启',
      title: '存储前端网关代理 proxy-ingress 优雅重启',
      content: '配合安全漏洞修复补丁热加载，对 ingress 容器代理执行热重启，引发存储控制前端瞬态连接重连。',
      netElementName: 'POD-INGRESS-01',
      deviceType: '容器实例',
      ip: '10.244.18.88',
      sn: 'SN-K8S-01',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-K8s池',
      vendor: '浪潮',
    },
    {
      seq: 4,
      time: '2026-10-16 15:10:00',
      source: '自动化运维',
      type: '漏洞升级',
      title: 'OpenSSL 与内核网络安全加固补丁动态升级',
      content: '针对核心计算集群在线加载 CVE-2026-4418 内存溢出加固补丁，审计显示补丁热修补成功，无服务中断。',
      netElementName: 'HOST-HUCHI-3355',
      deviceType: '虚拟宿主机',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      seq: 5,
      time: '2026-10-16 14:50:00',
      source: 'CRM运维',
      type: '权限变更',
      title: '业务计费中台跨域调用 IP 白名单刷新重载',
      content: '安全审计通过，新增两组大数据分析引擎节点 IP 加入高速读取白名单，规则同步完成。',
      netElementName: 'AP-GATEWAY-01',
      deviceType: '网关',
      ip: '220.10.50.1',
      sn: 'SN-GW-01',
      resourcePool: '一级资源池',
      pod: '东莞-POD1',
      vendor: '中兴',
    },
  ];

  // 穿透详情表 3: 日志详情列表 (对齐原型 14 个字段，时间近期降序，内容全新)
  // 序号 | 产生时间 | 类别 | 服务 | 程序 | 重要级别 | 标签 | 日志正文 | 网元名称 | 设备类型 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称
  const rcaDetailLogList = [
    {
      seq: 1,
      occurTime: '2026-10-16 15:38:22',
      category: '内核驱动',
      service: 'storage-io-daemon',
      program: 'nvme_core',
      level: '高级',
      tag: 'IO_TIMEOUT',
      logBody: '[15:38:22.418] io_poll_queue_timeout: NVMe PCIe controller 0000:3b:00.0 CID 0x3a4f wait completion timeout > 30000ms, abort command submitted to controller, hardware retry exhausted.',
      netElementName: 'HOST-HUCHI-3355',
      deviceType: '分布式存储',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      seq: 2,
      occurTime: '2026-10-16 15:37:05',
      category: '存储引擎',
      service: 'ceph-osd',
      program: 'ceph-osd.0428',
      level: '高级',
      tag: 'SLOW_REQUEST',
      logBody: '[15:37:05.102] 12 slow requests are blocked > 32 sec, osd.0428 waiting for sub_op commit on backend disk RES-DISK-0428, throttled bytes 512MB.',
      netElementName: 'HOST-HUCHI-3355',
      deviceType: '分布式存储',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      seq: 3,
      occurTime: '2026-10-16 15:36:18',
      category: '系统中断',
      service: 'kernel',
      program: 'ksoftirqd',
      level: '中级',
      tag: 'IRQ_AFFINITY',
      logBody: '[15:36:18.891] smp_affinity_skew: irq 42 (mlx5_comp3) affinity bound to cpu 3 exceeds load threshold 98.6%, packet buffer backlog reached 4096 frames.',
      netElementName: 'HOST-HUCHI-3355',
      deviceType: '虚拟宿主机',
      ip: '220.10.51.15',
      sn: 'SN-46567',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华为',
    },
    {
      seq: 4,
      occurTime: '2026-10-16 15:33:40',
      category: '网卡驱动',
      service: 'network-driver',
      program: 'mlx5_core',
      level: '中级',
      tag: 'RING_DROP',
      logBody: '[15:33:40.012] rx_queue_0 drop count increased by 1420 packets due to host buffer starvation, pause frame generated to switch port.',
      netElementName: 'SW-TOR-LEAF02',
      deviceType: '交换机',
      ip: '220.10.51.2',
      sn: 'SN-99812',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-虚拟015',
      vendor: '华三',
    },
    {
      seq: 5,
      occurTime: '2026-10-16 15:25:12',
      category: '数据库',
      service: 'postgresql',
      program: 'pg_wal',
      level: '低级',
      tag: 'CHECKPOINT',
      logBody: '[15:25:12.650] checkpoint starting: time, wal file 00000001000003F400000021, total write time 820ms, sync time 210ms.',
      netElementName: 'DB-PG-CLUSTER-02',
      deviceType: '服务器',
      ip: '220.10.52.23',
      sn: 'SN-8379952',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '京池-虚拟023',
      vendor: '中兴',
    },
  ];

  // ==========================================
  // 7. 故障根因分析 (表格) 数据 (根据截图四大模块精确实现，时间近期且降序排列，内容全新定制)
  // ==========================================
  const [rcaTableSortDesc, setRcaTableSortDesc] = useState<boolean>(true);
  const [rcaRelTab, setRcaRelTab] = useState<'alarm' | 'log' | 'event' | 'timeline'>('alarm');
  const [activeRcaPathModalItem, setActiveRcaPathModalItem] = useState<{
    seq: number;
    prob: string;
    source: string;
    desc: string;
    pathInfo: string;
    pathSteps: { name: string; conf: string; role: string }[];
    nodeCount: number;
    occurTime: string;
  } | null>(null);

  // 模块一: 主告警基本信息 (严格对齐截图)
  // 重大 | 网管中心 | 性能告警 | 告警标题 | 告警正文摘要 | 告警时间 (近期)
  const rcaTableMainAlarm = {
    level: '重大',
    systemSource: '网管中心',
    alarmType: '性能告警',
    title: '呼池分布式块存储 0428 节点写入延迟超标与存储控制器反压告警',
    summary:
      '监测到呼池分布式块存储 0428 节点因底层控制器写入缓存高水位写回受阻，写入时延由 1.2ms 异常飙升至 280ms，触发上游 Ceph 客户端事务挂起与多节点心跳重传。',
    alarmTime: '2026-10-16 15:40:00',
  };

  // 模块二: 主告警设备信息 (严格对齐截图6个字段)
  // cicode: SN-46567 | 设备类型: server | 设备名称: PC-001 | 资源池: PC-001 | POD: 东莞ironic资源池 | 网元IP: 220.10.51.15
  const rcaTableDevice = {
    cicode: 'SN-46567',
    deviceType: 'server',
    deviceName: 'HOST-HUCHI-3355 (PC-001)',
    resourcePool: '省级IT云-呼池资源池 (PC-001)',
    pod: '东莞ironic资源池',
    netElementIp: '220.10.51.15',
  };

  // 模块三: 根因分析结论列表 (严格对齐截图7大表头，时间近期且降序)
  // 序号 | 根因概率 (可排序) | 根因来源 | 根因描述 | 根因分析路径信息 | 路径节点数 | 根因关联关系图 (点击查看)
  const rcaTableConclusionList = [
    {
      seq: 1,
      prob: '90%',
      probVal: 90,
      source: '告警',
      desc: '分布式存储 pool-0428 写入延迟超阈值告警',
      pathInfo:
        '根因来源A: CMDB参数调优 (95%) --> 根因来源B: nvme_core超时 (91%) --> 根因来源C: 块存储写反压 (88%) --> 根因来源D: 接口丢包 (82%)',
      pathSteps: [
        { name: '根因来源A: CMDB参数调优', conf: '95%', role: '诱发源' },
        { name: '根因来源B: nvme_core超时', conf: '91%', role: '系统征兆' },
        { name: '根因来源C: 块存储写反压', conf: '88%', role: '主要告警' },
        { name: '根因来源D: 接口丢包', conf: '82%', role: '次级影响' },
      ],
      nodeCount: 4,
      occurTime: '2026-10-16 15:40:00',
    },
    {
      seq: 2,
      prob: '80%',
      probVal: 80,
      source: '日志',
      desc: '网关物理端口 NAPI Poll 软中断核亲和性倾斜',
      pathInfo:
        '根因来源A: 网络驱动队列倾斜 (89%) --> 根因来源B: ksoftirqd CPU100% (84%) --> 根因来源C: RingBuffer溢出 (80%) --> 根因来源D: TCP重传 (76%) --> 根因来源E: 业务超时 (72%)',
      pathSteps: [
        { name: '根因来源A: 驱动队列倾斜', conf: '89%', role: '硬件配置' },
        { name: '根因来源B: ksoftirqd 100%', conf: '84%', role: '内核调度' },
        { name: '根因来源C: RingBuffer溢出', conf: '80%', role: '缓冲区' },
        { name: '根因来源D: TCP重传风暴', conf: '76%', role: '协议栈' },
        { name: '根因来源E: 业务超时', conf: '72%', role: '应用层' },
      ],
      nodeCount: 5,
      occurTime: '2026-10-16 15:35:10',
    },
    {
      seq: 3,
      prob: '70%',
      probVal: 70,
      source: 'CDMB',
      desc: '服务器 RAID_1 NVMe 缓存控制器写策略变更',
      pathInfo:
        '根因来源A: 控制器固件自检 (85%) --> 根因来源B: BBU电池学习 (80%) --> 根因来源C: 缓存直写降级 (75%) --> 根因来源D: IO吞吐下降 (72%) --> 根因来源E: 事务阻塞 (70%)',
      pathSteps: [
        { name: '根因来源A: 固件自检', conf: '85%', role: '固件事件' },
        { name: '根因来源B: BBU电池学习', conf: '80%', role: '电池状态' },
        { name: '根因来源C: 缓存直写降级', conf: '75%', role: '策略重置' },
        { name: '根因来源D: IO吞吐骤降', conf: '72%', role: '存储性能' },
        { name: '根因来源E: 事务阻塞', conf: '70%', role: '业务库' },
      ],
      nodeCount: 5,
      occurTime: '2026-10-16 15:28:40',
    },
    {
      seq: 4,
      prob: '60%',
      probVal: 60,
      source: '配置变更',
      desc: '分布式数据库连接池缩容配置热重载',
      pathInfo:
        '根因来源A: PgBouncer参数重载 (76%) --> 根因来源B: 连接池排队 (68%) --> 根因来源C: 事务等待超时 (60%)',
      pathSteps: [
        { name: '根因来源A: 参数重载', conf: '76%', role: '配置热更新' },
        { name: '根因来源B: 连接池排队', conf: '68%', role: '资源耗尽' },
        { name: '根因来源C: 事务等待超时', conf: '60%', role: '业务感知' },
      ],
      nodeCount: 3,
      occurTime: '2026-10-16 15:18:22',
    },
    {
      seq: 5,
      prob: '50%',
      probVal: 50,
      source: '算法挖掘',
      desc: '机房供电 PDU 谐波电流瞬变致传感器误报',
      pathInfo:
        '根因来源A: 市电谐波浪涌 (65%) --> 根因来源B: PDU微电流抖动 (50%)',
      pathSteps: [
        { name: '根因来源A: 市电谐波浪涌', conf: '65%', role: '供电波动' },
        { name: '根因来源B: PDU微电流抖动', conf: '50%', role: '传感器采样' },
      ],
      nodeCount: 2,
      occurTime: '2026-10-16 15:05:00',
    },
  ];

  // 模块四: 主告警关联信息列表 (严格对齐截图2与截图3表头)
  // 选项卡: 告警 | 日志 | 事件 | 时序图
  // 告警表头: 告警ID | 发生时间 | 告警级别 | 告警类型 | 告警标题 | 告警正文 | 设备类型 | 业务系统名称 | 采集资源ID | ciCode | 网元IP | 资源池 | POD
  const rcaTableRelAlarmList = [
    {
      id: 'ALM-20261016-01',
      occurTime: '2026-10-16 15:40:00',
      level: '重大',
      type: '性能告警',
      title: '分布式块存储 pool-0428 写入延迟超标与控制器反压',
      body: '写入时延异常飙升至 280ms，触发 Ceph 事务挂起与多节点心跳重传',
      deviceType: 'server',
      businessSystem: '计费中台分布式块存储',
      resourceId: 'RES-DISK-0428',
      ciCode: 'SN-46567',
      netElementIp: '220.10.51.15',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'ALM-20261016-02',
      occurTime: '2026-10-16 15:38:45',
      level: '高',
      type: '故障告警',
      title: 'CPU Core #3 ksoftirqd 软中断单核占满持续超标',
      body: '单核软中断 CPU 占用率达 100% 超 180 秒，触发调度死锁与缓冲队列满溢',
      deviceType: 'server',
      businessSystem: '计费中台分布式块存储',
      resourceId: 'RES-CPU-C3',
      ciCode: 'SN-46567',
      netElementIp: '220.10.51.15',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'ALM-20261016-03',
      occurTime: '2026-10-16 15:37:12',
      level: '高',
      type: '链路告警',
      title: '存储专用 ToR 交换机端口 PFC 流控拥塞降速',
      body: '100GE 1/0/2 端口持续接收来自存储阵列的 PFC 优先级流控暂停帧',
      deviceType: 'switch',
      businessSystem: '虚拟电厂核心网络承载',
      resourceId: 'RES-PORT-100GE',
      ciCode: 'SN-99812',
      netElementIp: '220.10.51.2',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'ALM-20261016-04',
      occurTime: '2026-10-16 15:35:00',
      level: '中',
      type: '资源告警',
      title: 'PostgreSQL 核心主库事务写延迟毛刺突增异常',
      body: 'write_io_latency 突破预测基线 180%，预测 10 分钟内发生级联阻塞',
      deviceType: 'server',
      businessSystem: '虚拟电厂能量交易系统',
      resourceId: 'RES-DB-PG02',
      ciCode: 'SN-8379952',
      netElementIp: '220.10.52.23',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '京池-虚拟023',
    },
    {
      id: 'ALM-20261016-05',
      occurTime: '2026-10-16 15:30:15',
      level: '低',
      type: '环境告警',
      title: '机房 02-Rack08 供电相位微电流抖动瞬态预警',
      body: '机柜 PDU 相位电流微秒级瞬态变化率 > 15%，属电网波动谐波干扰',
      deviceType: 'pdu',
      businessSystem: '省级IT云机房动力环境',
      resourceId: 'RES-PDU-08',
      ciCode: 'SN-PDU-08',
      netElementIp: '192.168.100.12',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '呼池-动力区',
    },
    {
      id: 'ALM-20261016-06',
      occurTime: '2026-10-16 15:21:00',
      level: '中',
      type: '性能告警',
      title: '边缘网关代理连接超时与 HTTP 504 错误率升高',
      body: '上游 API Gateway 对存储代理后端反向代理请求超时比例升至 3.4%',
      deviceType: 'server',
      businessSystem: '边缘微服务接入总控',
      resourceId: 'RES-GW-INGRESS',
      ciCode: 'SN-46567',
      netElementIp: '220.10.51.55',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
  ];

  // 日志关联数据列表: 日志ID | 产生时间 | 日志级别 | 服务 | 程序 | 日志标题 | 日志正文 | 设备类型 | 业务系统名称 | 采集资源ID | ciCode | 网元IP | 资源池 | POD
  const rcaTableRelLogList = [
    {
      id: 'LOG-20261016-01',
      occurTime: '2026-10-16 15:38:22',
      level: '高级',
      service: 'storage-io-daemon',
      program: 'nvme_core',
      title: 'nvme_controller_timeout_abort',
      body: '[15:38:22.418] io_poll_queue_timeout: NVMe PCIe CID 0x3a4f wait completion timeout > 30000ms',
      deviceType: 'server',
      businessSystem: '计费中台分布式块存储',
      resourceId: 'RES-DISK-0428',
      ciCode: 'SN-46567',
      netElementIp: '220.10.51.15',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'LOG-20261016-02',
      occurTime: '2026-10-16 15:37:05',
      level: '高级',
      service: 'ceph-osd',
      program: 'ceph-osd.0428',
      title: 'slow requests blocked on disk',
      body: '[15:37:05.102] 12 slow requests blocked > 32s waiting for commit on backend disk',
      deviceType: 'server',
      businessSystem: '计费中台分布式块存储',
      resourceId: 'RES-DISK-0428',
      ciCode: 'SN-46567',
      netElementIp: '220.10.51.15',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'LOG-20261016-03',
      occurTime: '2026-10-16 15:36:18',
      level: '中级',
      service: 'kernel',
      program: 'ksoftirqd',
      title: 'smp_affinity_skew load high',
      body: '[15:36:18.891] irq 42 affinity bound to cpu 3 exceeds threshold 98.6%',
      deviceType: 'server',
      businessSystem: '计费中台分布式块存储',
      resourceId: 'RES-CPU-C3',
      ciCode: 'SN-46567',
      netElementIp: '220.10.51.15',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'LOG-20261016-04',
      occurTime: '2026-10-16 15:33:40',
      level: '中级',
      service: 'network-driver',
      program: 'mlx5_core',
      title: 'rx_queue_0 drop count increased',
      body: '[15:33:40.012] rx_queue_0 drop count increased by 1420 packets',
      deviceType: 'switch',
      businessSystem: '虚拟电厂核心网络承载',
      resourceId: 'RES-PORT-100GE',
      ciCode: 'SN-99812',
      netElementIp: '220.10.51.2',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'LOG-20261016-05',
      occurTime: '2026-10-16 15:25:12',
      level: '低级',
      service: 'postgresql',
      program: 'pg_wal',
      title: 'checkpoint write time spike',
      body: '[15:25:12.650] checkpoint starting: time, wal file 00000001000003F400000021, write time 820ms',
      deviceType: 'server',
      businessSystem: '虚拟电厂能量交易系统',
      resourceId: 'RES-DB-PG02',
      ciCode: 'SN-8379952',
      netElementIp: '220.10.52.23',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '京池-虚拟023',
    },
  ];

  // 事件关联数据列表: 事件ID | 时间 | 事件来源 | 事件类型 | 事件标题 | 事件内容 | 设备类型 | 业务系统名称 | ciCode | 网元IP | 资源池 | POD
  const rcaTableRelEventList = [
    {
      id: 'EVT-20261016-01',
      occurTime: '2026-10-16 15:35:10',
      source: 'CMDB',
      type: '内核调优',
      title: '分布式存储底层 sysctl 动态调优热更新',
      content: '运维工程师执行 sysctl -p 调整存储节点 net.core.wmem_max 与 nvme.io_timeout',
      deviceType: 'server',
      businessSystem: '计费中台分布式块存储',
      ciCode: 'SN-46567',
      netElementIp: '220.10.51.15',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'EVT-20261016-02',
      occurTime: '2026-10-16 15:30:00',
      source: '巡检中心',
      type: '自动巡检',
      title: '存储阵列 BBU 电池学习自检状态变更',
      content: '存储控制器固件执行电池学习放电，写缓存临时降级为 Write-Through 直写模式',
      deviceType: 'storage',
      businessSystem: '计费中台分布式块存储',
      ciCode: 'SN-CTRL-09',
      netElementIp: '220.10.51.18',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'EVT-20261016-03',
      occurTime: '2026-10-16 15:20:00',
      source: '变更平台',
      type: '服务重启',
      title: '存储前端网关代理 proxy-ingress 优雅重启',
      content: '配合漏洞修复补丁，执行 ingress 容器代理重启，瞬时引发连接重连',
      deviceType: 'container',
      businessSystem: '边缘微服务接入总控',
      ciCode: 'SN-K8S-01',
      netElementIp: '10.244.18.88',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'EVT-20261016-04',
      occurTime: '2026-10-16 15:10:00',
      source: '自动化运维',
      type: '漏洞升级',
      title: 'OpenSSL 与内核网络安全加固补丁动态升级',
      content: '核心集群在线热加载 CVE-2026 内存安全加固补丁',
      deviceType: 'server',
      businessSystem: '虚拟电厂核心调度',
      ciCode: 'SN-46567',
      netElementIp: '220.10.51.15',
      resourcePool: '省级IT云-华北二-呼池',
      pod: '东莞ironic资源池',
    },
    {
      id: 'EVT-20261016-05',
      occurTime: '2026-10-16 14:50:00',
      source: 'CRM运维',
      type: '权限变更',
      title: '业务计费中台跨域调用 IP 白名单刷新重载',
      content: '增量增加两组数据分析引擎节点 IP 加入高速读取白名单',
      deviceType: 'gateway',
      businessSystem: '虚拟电厂核心调度',
      ciCode: 'SN-GW-01',
      netElementIp: '220.10.50.1',
      resourcePool: '一级资源池',
      pod: '东莞-POD1',
    },
  ];

  // ==========================================
  // 8. 根因规则库 (通用根因规则) 数据与状态 (全部采用近期时间，严格降序排列，数据全新定制，展示样式突破截图)
  // ==========================================
  const [ruleSearchCauseName, setRuleSearchCauseName] = useState('');
  const [ruleSearchEffectName, setRuleSearchEffectName] = useState('');
  const [ruleSearchConfidence, setRuleSearchConfidence] = useState('');
  const [ruleSearchAuditor, setRuleSearchAuditor] = useState('');
  const [ruleSearchAuditStartTime, setRuleSearchAuditStartTime] = useState('');
  const [ruleSearchAuditEndTime, setRuleSearchAuditEndTime] = useState('');
  const [ruleFilterExpanded, setRuleFilterExpanded] = useState<boolean>(true);

  // 下拉筛选
  const [ruleCauseTypeFilter, setRuleCauseTypeFilter] = useState('全部');
  const [ruleEffectTypeFilter, setRuleEffectTypeFilter] = useState('全部');
  const [ruleEffectAttrFilter, setRuleEffectAttrFilter] = useState('全部');
  const [ruleCauseAttrFilter, setRuleCauseAttrFilter] = useState('全部');
  const [ruleRelationFilter, setRuleRelationFilter] = useState('全部');
  const [ruleSourceFilter, setRuleSourceFilter] = useState('全部');
  const [ruleStatusFilter, setRuleStatusFilter] = useState('全部');
  const [ruleAuditStatusFilter, setRuleAuditStatusFilter] = useState('全部');

  // 排序字段与方向 (默认按最近更新时间严格降序)
  const [ruleSortField, setRuleSortField] = useState<'updateTime' | 'auditTime' | 'confidence' | 'seq'>('updateTime');
  const [ruleSortOrder, setRuleSortOrder] = useState<'desc' | 'asc'>('desc');

  // 分页状态
  const [ruleCurrentPage, setRuleCurrentPage] = useState<number>(1);
  const [rulePageSize, setRulePageSize] = useState<number>(10);

  // 选项卡：通用根因规则 vs 个性根因规则
  const [ruleActiveTab, setRuleActiveTab] = useState<'universal' | 'custom'>('universal');

  // 多选选中状态
  const [selectedRuleIds, setSelectedRuleIds] = useState<number[]>([1]);

  // 行展开详情 (默认展开第1项与第3项展示微档案)
  const [expandedRuleRowIds, setExpandedRuleRowIds] = useState<number[]>([1, 3]);

  // 弹窗状态
  const [showRuleTopologyModal, setShowRuleTopologyModal] = useState<boolean>(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState<boolean>(false);
  const [showRuleMoreMenu, setShowRuleMoreMenu] = useState<boolean>(false);

  // 撤销操作通知状态 (5秒内可撤销删除/停用/启用)
  const [ruleUndoToast, setRuleUndoToast] = useState<{
    message: string;
    actionType: 'delete' | 'status_change';
    previousList: any[];
  } | null>(null);

  // 表格全量数据 (对齐原型全部16个字段标题 + 展开项ID/IP，时间近期且严格降序排列，内容全新高保真，严禁重复图上数据)
  // 复选框 | 序号 | 果节点资源类别 | 果节点资源名称 | 因节点资源属性 | 因节点资源类别 | 因节点资源名称 | 因果关系 | 置信度 | 规则来源 | 规则状态 | 审核状态 | 审核人员 | 审核时间 | 最近更新时间 | 更新人员
  const [ruleBaseList, setRuleBaseList] = useState([
    {
      id: 1,
      seq: 1,
      effectType: '分布式图数据库',
      effectName: 'NebulaGraph跨分片并行遍历P99延时超500ms',
      effectId: 'SN-NEBULA-G801',
      effectIp: '10.240.68.21',
      effectAttr: '指标',
      causeAttr: '指标',
      causeType: '高性能计算宿主机',
      causeName: 'NUMA Node#1 内存远程访问跨节点总线QPI饱和',
      causeId: 'SN-HOST-NUMA-901',
      causeIp: '10.240.68.105',
      relation: '强因果',
      confidence: '0.99',
      confidenceVal: 0.99,
      source: '多模态因果图挖掘',
      ruleStatus: '启用',
      auditStatus: '已通过',
      auditor: '钱专家 (基础架构实验室)',
      auditTime: '2026-10-16 16:40:00',
      updateTime: '2026-10-16 16:45:12',
      updater: 'AutoML因果引擎-04',
      detailDesc: 'NUMA跨节点总线QPI/UPI饱和导致远端内存存取延迟骤增，直接拖垮图计算分布式遍历查询吞吐。',
      algorithm: 'Granger 贝叶斯因果网络 + PC因果学习',
      pool: '华东金融区-POD01',
      verifiedCount: 1420,
    },
    {
      id: 2,
      seq: 2,
      effectType: 'Kubernetes微服务网关',
      effectName: 'EnvoyIngress网关断路器熔断率升至15.2%',
      effectId: 'SN-K8S-INGRESS-02',
      effectIp: '10.240.12.80',
      effectAttr: '告警',
      causeAttr: '日志',
      causeType: '核心认证鉴权服务',
      causeName: 'RedisClusterSentinel故障转移慢查询积压阻断',
      causeId: 'SN-REDIS-CLU-06',
      causeIp: '10.240.12.114',
      relation: '级联因果',
      confidence: '0.98',
      confidenceVal: 0.98,
      source: '算法自动挖掘',
      ruleStatus: '启用',
      auditStatus: '已通过',
      auditor: '孙架构师 (微服务平台组)',
      auditTime: '2026-10-16 16:28:10',
      updateTime: '2026-10-16 16:32:45',
      updater: '孙架构师',
      detailDesc: 'Redis集群哨兵选举耗时导致JWT校验鉴权Token超时，上游Envoy网关断路器自动触发熔断降级。',
      algorithm: 'LiNGAM 线性非高斯因果发现',
      pool: '华南核心区-POD03',
      verifiedCount: 986,
    },
    {
      id: 3,
      seq: 3,
      effectType: '云原生对象存储',
      effectName: 'S3多版本并发PUT对象频繁出现499连接中断',
      effectId: 'SN-OSS-BUCKET-29',
      effectIp: '10.240.180.52',
      effectAttr: '告警',
      causeAttr: '告警',
      causeType: 'NVMe全闪存储阵列',
      causeName: 'PCIe Switch Gen5 单通道误码率超限自动降速',
      causeId: 'SN-NVME-ARRAY-01',
      causeIp: '10.240.180.12',
      relation: '包含',
      confidence: '0.96',
      confidenceVal: 0.96,
      source: 'AI挖掘',
      ruleStatus: '启用',
      auditStatus: '已通过',
      auditor: '周高级专家 (存储保障部)',
      auditTime: '2026-10-16 16:10:00',
      updateTime: '2026-10-16 16:15:00',
      updater: 'AIOps智能闭环平台',
      detailDesc: 'PCIe总线误码自动降速为Gen3模式，全闪存阵列通道带宽骤降引发写入缓冲池撑满丢包。',
      algorithm: '动态时间规整(DTW) + 互信息因果分析',
      pool: '京津冀算力池-POD02',
      verifiedCount: 840,
    },
    {
      id: 4,
      seq: 4,
      effectType: '数据中心ToR交换机',
      effectName: '骨干ECMP等价多路径路由微突发拥塞丢包',
      effectId: 'SN-SW-TOR-LEAF08',
      effectIp: '10.240.3.16',
      effectAttr: '事件',
      causeAttr: '事件',
      causeType: '分布式AI算力集群',
      causeName: '8xH100 GPU AllReduce集合通信大流量突发冲击',
      causeId: 'SN-GPU-NODE-H800',
      causeIp: '10.240.3.88',
      relation: '属于',
      confidence: '0.95',
      confidenceVal: 0.95,
      source: '专家经验规则',
      ruleStatus: '停用',
      auditStatus: '已通过',
      auditor: '吴网络总监 (网络运营中心)',
      auditTime: '2026-10-16 15:45:00',
      updateTime: '2026-10-16 15:52:18',
      updater: '吴网络总监',
      detailDesc: '大模型分布式训练梯度同步脉冲触发RDMA RoCEv2 PFC死锁边缘，交换机MMU浅缓存溢出丢包。',
      algorithm: '拓扑图卷积神经网络 (GCN-Causal)',
      pool: '智算超算区-POD05',
      verifiedCount: 652,
    },
    {
      id: 5,
      seq: 5,
      effectType: '核心消息队列中间件',
      effectName: 'Apache Kafka 核心分区副本落后ISR水位超阈值',
      effectId: 'SN-KAFKA-BROKER-07',
      effectIp: '10.240.90.35',
      effectAttr: '告警',
      causeAttr: '告警',
      causeType: '操作系统内核',
      causeName: 'Linux dirty_background_ratio 页缓存脏页强制回刷',
      causeId: 'SN-NODE-KERNEL-33',
      causeIp: '10.240.90.35',
      relation: '强因果',
      confidence: '0.94',
      confidenceVal: 0.94,
      source: 'AI挖掘',
      ruleStatus: '启用',
      auditStatus: '已通过',
      auditor: '郑系统专家 (OS专家组)',
      auditTime: '2026-10-16 15:18:00',
      updateTime: '2026-10-16 15:25:30',
      updater: 'AutoML因果引擎-04',
      detailDesc: 'Page Cache脏页剧烈回刷引起磁盘阻塞与JVM长时间STW停顿，导致Kafka Fetcher心跳失联超时。',
      algorithm: 'Apriori 频繁项集模式匹配',
      pool: '华东金融区-POD02',
      verifiedCount: 1105,
    },
    {
      id: 6,
      seq: 6,
      effectType: '容器服务网格控制面',
      effectName: 'Istio ServiceMesh 控制面同步 xDS 推送延时异常',
      effectId: 'SN-MESH-ISTIOD-01',
      effectIp: '10.240.15.19',
      effectAttr: '指标',
      causeAttr: '日志',
      causeType: 'Kubernetes控制面',
      causeName: 'etcd3 RaftWAL 同步由于快照过大发生短暂磁盘等待',
      causeId: 'SN-ETCD-LEADER-03',
      causeIp: '10.240.15.10',
      relation: '同一集群',
      confidence: '0.92',
      confidenceVal: 0.92,
      source: '算法自动挖掘',
      ruleStatus: '未启用',
      auditStatus: '待审核',
      auditor: '冯云原生组长 (待审核)',
      auditTime: '2026-10-16 14:50:00',
      updateTime: '2026-10-16 14:58:00',
      updater: '运维数据中台',
      detailDesc: 'etcd高频写入大量临时Endpoint导致Compaction延迟，阻断istiod监听事件并延迟配置分发。',
      algorithm: '因果网络条件独立性检验',
      pool: '容器云核心区-POD01',
      verifiedCount: 430,
    },
    {
      id: 7,
      seq: 7,
      effectType: '智能时序监控引擎',
      effectName: 'Prometheus采集探针大量丢弃指标采样数据点',
      effectId: 'SN-PROM-AGENT-14',
      effectIp: '10.240.55.72',
      effectAttr: '告警',
      causeAttr: '指标',
      causeType: '边缘节点网关',
      causeName: 'Socket TCP TIME_WAIT状态套接字超过65535上限',
      causeId: 'SN-GW-EDGE-02',
      causeIp: '10.240.55.11',
      relation: '级联因果',
      confidence: '0.90',
      confidenceVal: 0.90,
      source: '人工配置',
      ruleStatus: '启用',
      auditStatus: '已通过',
      auditor: '蒋网络专家',
      auditTime: '2026-10-16 14:05:00',
      updateTime: '2026-10-16 14:15:20',
      updater: '蒋网络专家',
      detailDesc: '高并发短连接快速耗尽本地临时端口号，采集客户端无法建立新TCP连接导致抓取指标超时丢弃。',
      algorithm: '专家先验逻辑树验证',
      pool: '边缘计算集群-POD04',
      verifiedCount: 520,
    },
    {
      id: 8,
      seq: 8,
      effectType: '分布式关系型数据库',
      effectName: 'TiDB计算节点SQL执行计划抖动全表扫描告警',
      effectId: 'SN-TIDB-SQL-09',
      effectIp: '10.240.80.44',
      effectAttr: '告警',
      causeAttr: '事件',
      causeType: '自动化运维编排平台',
      causeName: '定时 Analyze Table 统计信息搜集被手动中断',
      causeId: 'SN-OPS-RUNNER-01',
      causeIp: '10.240.80.201',
      relation: '强因果',
      confidence: '0.88',
      confidenceVal: 0.88,
      source: '专家经验规则',
      ruleStatus: '启用',
      auditStatus: '已通过',
      auditor: '戴DBA专家 (数据库组)',
      auditTime: '2026-10-16 13:30:00',
      updateTime: '2026-10-16 13:40:55',
      updater: '戴DBA专家',
      detailDesc: '表索引基数统计失效导致CBO优化器错误选择代价更高的非索引路径，瞬时耗尽计算节点CPU。',
      algorithm: '因果路径置信评分模型',
      pool: '金融分布式数据库-POD02',
      verifiedCount: 780,
    },
    {
      id: 9,
      seq: 9,
      effectType: '边缘CDN加速节点',
      effectName: '视频推流边缘节点TCP丢包重传率超5%门限',
      effectId: 'SN-CDN-POP-SH03',
      effectIp: '10.240.210.9',
      effectAttr: '告警',
      causeAttr: '告警',
      causeType: '边界BGP出口路由器',
      causeName: '运营商跨域互联AS路径出现路由频繁翻滚(Flap)',
      causeId: 'SN-BGP-PEER-102',
      causeIp: '10.240.210.1',
      relation: '属于',
      confidence: '0.87',
      confidenceVal: 0.87,
      source: 'AI挖掘',
      ruleStatus: '启用',
      auditStatus: '已通过',
      auditor: '曹网络架构师',
      auditTime: '2026-10-16 12:10:00',
      updateTime: '2026-10-16 12:20:10',
      updater: 'AIOps智能闭环平台',
      detailDesc: '外部公网对等互联抖动使BGP衰减算法震荡抑制，导致部分边缘分发流量绕行高延迟备份路径。',
      algorithm: '网络因果拓扑矩阵挖掘',
      pool: '华东边缘CDN网络-POP08',
      verifiedCount: 310,
    },
    {
      id: 10,
      seq: 10,
      effectType: '基础设施动环机房',
      effectName: '核心高密机柜PDU母线三相电流负载不均衡预警',
      effectId: 'SN-PDU-RACK-A09',
      effectIp: '10.240.250.31',
      effectAttr: '指标',
      causeAttr: '指标',
      causeType: '供电UPS冗余配电柜',
      causeName: 'B路输入静态旁路开关自检晶闸管阻抗漂移',
      causeId: 'SN-UPS-CAB-02',
      causeIp: '10.240.250.15',
      relation: '强因果',
      confidence: '0.86',
      confidenceVal: 0.86,
      source: '人工配置',
      ruleStatus: '未启用',
      auditStatus: '待审核',
      auditor: '严动力工程师 (待审核)',
      auditTime: '2026-10-16 10:55:00',
      updateTime: '2026-10-16 11:05:00',
      updater: '严动力工程师',
      detailDesc: '晶闸管静态导通特性微变造成A/B双母线分流失衡，触发PDU智能监测单元差异告警。',
      algorithm: '机电物理仿真模型映射',
      pool: '深圳主数据中心-机房D04',
      verifiedCount: 195,
    },
  ]);

  // 计算筛选过滤与排序后的规则列表
  const sortedAndFilteredRuleList = useMemo(() => {
    return ruleBaseList
      .filter((rule) => {
        // Tab 过滤: 通用 vs 个性
        if (ruleActiveTab === 'custom') {
          // 个性规则仅保留 source 为 '人工配置' 或 '专家经验规则'
          if (rule.source !== '人工配置' && rule.source !== '专家经验规则') return false;
        }

        // 因节点资源名称
        if (ruleSearchCauseName.trim() && !rule.causeName.toLowerCase().includes(ruleSearchCauseName.trim().toLowerCase())) {
          return false;
        }
        // 果节点资源名称
        if (ruleSearchEffectName.trim() && !rule.effectName.toLowerCase().includes(ruleSearchEffectName.trim().toLowerCase())) {
          return false;
        }
        // 置信度
        if (ruleSearchConfidence.trim()) {
          const minConf = parseFloat(ruleSearchConfidence.replace(/[^0-9.]/g, ''));
          if (!isNaN(minConf) && rule.confidenceVal < minConf) return false;
        }
        // 审核人
        if (ruleSearchAuditor.trim() && !rule.auditor.toLowerCase().includes(ruleSearchAuditor.trim().toLowerCase())) {
          return false;
        }
        // 审核时间范围
        if (ruleSearchAuditStartTime.trim() && rule.auditTime < ruleSearchAuditStartTime.trim()) {
          return false;
        }
        if (ruleSearchAuditEndTime.trim() && rule.auditTime > ruleSearchAuditEndTime.trim()) {
          return false;
        }
        // 下拉筛选
        if (ruleCauseTypeFilter !== '全部' && rule.causeType !== ruleCauseTypeFilter) return false;
        if (ruleEffectTypeFilter !== '全部' && rule.effectType !== ruleEffectTypeFilter) return false;
        if (ruleEffectAttrFilter !== '全部' && rule.effectAttr !== ruleEffectAttrFilter) return false;
        if (ruleCauseAttrFilter !== '全部' && rule.causeAttr !== ruleCauseAttrFilter) return false;
        if (ruleRelationFilter !== '全部' && rule.relation !== ruleRelationFilter) return false;
        if (ruleSourceFilter !== '全部' && rule.source !== ruleSourceFilter) return false;
        if (ruleStatusFilter !== '全部' && rule.ruleStatus !== ruleStatusFilter) return false;
        if (ruleAuditStatusFilter !== '全部' && rule.auditStatus !== ruleAuditStatusFilter) return false;

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (ruleSortField === 'updateTime') {
          comp = a.updateTime.localeCompare(b.updateTime);
        } else if (ruleSortField === 'auditTime') {
          comp = a.auditTime.localeCompare(b.auditTime);
        } else if (ruleSortField === 'confidence') {
          comp = a.confidenceVal - b.confidenceVal;
        } else if (ruleSortField === 'seq') {
          comp = a.seq - b.seq;
        }
        return ruleSortOrder === 'desc' ? -comp : comp;
      });
  }, [
    ruleBaseList,
    ruleActiveTab,
    ruleSearchCauseName,
    ruleSearchEffectName,
    ruleSearchConfidence,
    ruleSearchAuditor,
    ruleSearchAuditStartTime,
    ruleSearchAuditEndTime,
    ruleCauseTypeFilter,
    ruleEffectTypeFilter,
    ruleEffectAttrFilter,
    ruleCauseAttrFilter,
    ruleRelationFilter,
    ruleSourceFilter,
    ruleStatusFilter,
    ruleAuditStatusFilter,
    ruleSortField,
    ruleSortOrder,
  ]);

  // 处理可撤销的批量操作
  const triggerUndoableAction = (
    actionType: 'delete' | 'status_change',
    message: string,
    actionFn: () => void
  ) => {
    const backupList = [...ruleBaseList];
    actionFn();
    setRuleUndoToast({
      message,
      actionType,
      previousList: backupList,
    });
  };

  const handleUndo = () => {
    if (ruleUndoToast) {
      setRuleBaseList(ruleUndoToast.previousList);
      setRuleUndoToast(null);
      showToast('已撤销上一次操作，规则已恢复');
    }
  };

  // ==========================================
  // 9. 根因规则库 (简化) 数据 (完全对齐原型表头)
  // 序号 | 果节点资源类别 | 果节点描述 | 因节点资源类别 | 因节点描述 | 因果关系 | 置信度
  // ==========================================
  const [ruleBaseSimpleList, setRuleBaseSimpleList] = useState([
    {
      seq: 1,
      effectType: '服务器',
      effectDesc: '服务器磁盘空间满',
      causeType: '虚拟机',
      causeDesc: '虚拟机告警',
      relation: '包含',
      confidence: '98%',
    },
    {
      seq: 2,
      effectType: '服务器',
      effectDesc: '主机接口丢包超阈值',
      causeType: '网络交换机',
      causeDesc: '端口光衰衰减过大',
      relation: '因果',
      confidence: '95%',
    },
    {
      seq: 3,
      effectType: '关系型数据库',
      effectDesc: '数据库只读锁定',
      causeType: '分布式存储',
      causeDesc: '存储卷只读挂载保护',
      relation: '依赖',
      confidence: '96%',
    },
  ]);

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
          SUB-VIEW 1: 告警管理 (完全还原原型字段与交互)
         ======================================================== */}
      {subTab === 'alert_mgmt' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          {/* 筛选区域 (对齐原型字段) */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3 text-xs">
            {/* Row 1: 发生时间查询 & 精确查询 & 操作按钮 */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium whitespace-nowrap">发生时间查询：</span>
                  <input
                    type="text"
                    value={timeQuery}
                    onChange={(e) => setTimeQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs w-64 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium whitespace-nowrap">精确查询：</span>
                  <input
                    type="text"
                    value={exactQuery}
                    onChange={(e) => setExactQuery(e.target.value)}
                    placeholder="输入设备名称 / IP / 告警标题..."
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs w-60 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('已按照条件执行检索！')}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs shadow-md shadow-sky-600/20"
                >
                  查询
                </button>
                <button
                  onClick={() => {
                    setExactQuery('');
                    setRegionCategory('全部');
                    setRegionCenter('全部');
                    setResourcePool('全部');
                    setPod('全部');
                    setVendor('全部');
                    setDeviceType('全部');
                    showToast('条件已重置');
                  }}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  重置
                </button>
              </div>
            </div>

            {/* Filter Tags: 区域分类 / 区域中心 / 资源池 / POD / 设备厂家 / 设备类型 */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-20 shrink-0">区域分类：</span>
                <div className="flex flex-wrap gap-1.5">
                  {['全部', '一级资源池', '省级IT云', '池外'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setRegionCategory(item)}
                      className={`px-2.5 py-1 rounded text-[11px] ${
                        regionCategory === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-20 shrink-0">区域中心：</span>
                <div className="flex flex-wrap gap-1.5">
                  {['全部', '东北', '华北', '华北一', '华中'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setRegionCenter(item)}
                      className={`px-2.5 py-1 rounded text-[11px] ${
                        regionCenter === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-20 shrink-0">资源池：</span>
                <div className="flex flex-wrap gap-1.5">
                  {['全部', '东莞资源池', '安徽资源池', '北京资源池', '重庆资源池', '广东资源池', '甘肃资源池'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setResourcePool(item)}
                      className={`px-2.5 py-1 rounded text-[11px] ${
                        resourcePool === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-20 shrink-0">设备类型：</span>
                <div className="flex flex-wrap gap-1.5">
                  {['全部', '服务器', '虚拟机', '路由器', '负载均衡', 'SDN控制器', 'VPN'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setDeviceType(item)}
                      className={`px-2.5 py-1 rounded text-[11px] ${
                        deviceType === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Switcher: 活动告警列表 / 锁定列表 / 聚合告警列表 */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              {(['活动告警列表', '锁定列表', '聚合告警列表'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveAlarmTab(t)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    activeAlarmTab === t
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => showToast('已成功锁定选中告警！')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>锁定列表</span>
              </button>
              <button
                onClick={() => showToast('已解除锁定！')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>解除锁定</span>
              </button>
              <button
                onClick={() => showToast('已将关键告警置顶')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>置顶</span>
              </button>
            </div>
          </div>

          {/* 表格 (表头严格与原型对齐，包含「发生时间」与「告警标识」) */}
          {/* 发生时间 | 告警级别 | 告警标识 | 设备名称 | 设备类型 | 系统来源 | 一级专业分类 | 告警标题 | 告警正文 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称 | 操作 */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 font-medium border-b border-slate-700">
                  <th className="py-3 px-4 whitespace-nowrap">发生时间</th>
                  <th className="py-3 px-4 whitespace-nowrap">告警级别</th>
                  <th className="py-3 px-4 whitespace-nowrap">告警标识</th>
                  <th className="py-3 px-4 whitespace-nowrap">设备名称</th>
                  <th className="py-3 px-4 whitespace-nowrap">设备类型</th>
                  <th className="py-3 px-4 whitespace-nowrap">系统来源</th>
                  <th className="py-3 px-4 whitespace-nowrap">一级专业分类</th>
                  <th className="py-3 px-4 whitespace-nowrap">告警标题</th>
                  <th className="py-3 px-4 whitespace-nowrap">告警正文</th>
                  <th className="py-3 px-4 whitespace-nowrap">IP地址</th>
                  <th className="py-3 px-4 whitespace-nowrap">序列号</th>
                  <th className="py-3 px-4 whitespace-nowrap">资源池</th>
                  <th className="py-3 px-4 whitespace-nowrap">POD池</th>
                  <th className="py-3 px-4 whitespace-nowrap">厂家名称</th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {sortedAlarmMgmtList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* 发生时间 (近期降序排列) */}
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    </td>
                    {/* 告警级别 */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.level === '重大'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.level === '高'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : item.level === '中'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {item.level}
                      </span>
                    </td>
                    {/* 告警标识 (主/聚/从/合 & New!) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.tag === '主'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : item.tag === '聚'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                              : item.tag === '从'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {item.tag}
                        </span>
                        {item.isNew && (
                          <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded text-[10px] font-bold animate-pulse">
                            New！
                          </span>
                        )}
                      </div>
                    </td>
                    {/* 设备名称 */}
                    <td className="py-3 px-4 font-sans font-bold text-white whitespace-nowrap">
                      {item.deviceName}
                    </td>
                    {/* 设备类型 */}
                    <td className="py-3 px-4 font-sans whitespace-nowrap">{item.deviceType}</td>
                    {/* 系统来源 */}
                    <td className="py-3 px-4 font-sans text-slate-400 whitespace-nowrap">{item.systemSource}</td>
                    {/* 一级专业分类 */}
                    <td className="py-3 px-4 font-sans text-cyan-300 whitespace-nowrap">{item.majorCategory}</td>
                    {/* 告警标题 */}
                    <td className="py-3 px-4 font-sans text-white font-medium max-w-xs">
                      <span>{item.alarmTitle}</span>
                    </td>
                    {/* 告警正文 */}
                    <td className="py-3 px-4 font-sans text-slate-400 max-w-xs truncate">
                      {item.alarmBody}
                    </td>
                    {/* IP地址 */}
                    <td className="py-3 px-4 text-cyan-400 font-mono whitespace-nowrap">{item.ip}</td>
                    {/* 序列号 */}
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{item.sn}</td>
                    {/* 资源池 */}
                    <td className="py-3 px-4 font-sans whitespace-nowrap">{item.resourcePool}</td>
                    {/* POD池 */}
                    <td className="py-3 px-4 font-sans whitespace-nowrap">{item.pod}</td>
                    {/* 厂家名称 */}
                    <td className="py-3 px-4 font-sans whitespace-nowrap">{item.vendor}</td>
                    {/* 操作 */}
                    <td className="py-3 px-4 text-center font-sans whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleTabChange('demarcation')}
                          className="text-sky-400 hover:underline"
                        >
                          定界定位
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          onClick={() => handleTabChange('root_cause_analysis')}
                          className="text-cyan-400 hover:underline"
                        >
                          根因分析
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          onClick={() => handleTabChange('fault_trace')}
                          className="text-indigo-400 hover:underline"
                        >
                          溯源分析
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 (对齐原型文案) */}
          {/* 第1/14页 | 10条/页 | 跳至 [ ] 页 | 共140条记录 */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 font-mono">
            <span>共140条记录 第1/14页</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-800 rounded">10条/页</span>
              <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                上一页
              </button>
              <span className="px-2 py-1 bg-sky-600 text-white rounded font-bold">1</span>
              <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                下一页
              </button>
              <div className="flex items-center gap-1">
                <span>跳至</span>
                <input
                  type="text"
                  defaultValue="1"
                  className="w-10 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center text-white"
                />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 2: 告警收敛 (按截图精确生成搜索条件并支持实时动态联动)
         ======================================================== */}
      {subTab === 'alert_convergence' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          {/* 顶部标题与快速状态 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>告警收敛</span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30">
                时空自动收敛聚合度: 94.2%
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  showToast(`已完成检索，共匹配 ${filteredConvergenceList.length} 条收敛告警记录`);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>查询</span>
              </button>
              <button
                onClick={handleResetConvergenceFilters}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 筛选条件区域 (完全对齐截图要素: 发生时间查询 + 精确查询 + 告警对象筛选) */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
            {/* 第一排: 发生时间查询 & 精确查询 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 发生时间查询 */}
              <div className="lg:col-span-7 flex flex-wrap sm:flex-nowrap items-center gap-2">
                <span className="text-slate-300 font-medium whitespace-nowrap min-w-[96px]">
                  发生时间查询：
                </span>
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={convStartTime}
                      onChange={(e) => setConvStartTime(e.target.value)}
                      placeholder="开始时间 (如 2026-10-15)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                    />
                    {convStartTime && (
                      <button
                        onClick={() => setConvStartTime('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <span className="text-slate-500 text-xs">至</span>
                  <div className="relative flex-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={convEndTime}
                      onChange={(e) => setConvEndTime(e.target.value)}
                      placeholder="结束时间 (如 2026-10-16)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                    />
                    {convEndTime && (
                      <button
                        onClick={() => setConvEndTime('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 精确查询 */}
              <div className="lg:col-span-5 flex items-center gap-2">
                <span className="text-slate-300 font-medium whitespace-nowrap min-w-[70px]">
                  精确查询：
                </span>
                <div className="flex items-center gap-1.5 w-full">
                  <select
                    value={exactQueryType}
                    onChange={(e) => setExactQueryType(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 shrink-0"
                  >
                    <option value="请选择查询方式">请选择查询方式</option>
                    <option value="IP">IP</option>
                    <option value="序列号">序列号</option>
                    <option value="告警标识">告警标识</option>
                  </select>
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={exactQuery}
                      onChange={(e) => setExactQuery(e.target.value)}
                      placeholder="输入关键字搜索..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                    />
                    {exactQuery && (
                      <button
                        onClick={() => setExactQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 告警对象筛选 开关标题栏 */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-bold text-white">告警对象筛选</span>
                {(regionCategory !== '全部' ||
                  regionCenter !== '全部' ||
                  resourcePool !== '全部' ||
                  pod !== '全部' ||
                  vendor !== '全部' ||
                  deviceType !== '全部' ||
                  exactQuery ||
                  convStartTime ||
                  convEndTime) && (
                  <span className="px-2 py-0.5 rounded text-[11px] bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">
                    已激活自定义筛选
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsConvergenceExpanded(!isConvergenceExpanded)}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>{isConvergenceExpanded ? '收起' : '展开'}</span>
                {isConvergenceExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* 展开的6行筛选条件 (按截图生成，点击任一选项下面的表格立刻动态变化) */}
            {isConvergenceExpanded && (
              <div className="space-y-2.5 pt-1 pl-1">
                {/* 1. 区域分类 */}
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-medium whitespace-nowrap min-w-[76px] text-right">
                    区域分类：
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['全部', '一级资源池', '省级IT云', '池外'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setRegionCategory(opt)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          regionCategory === opt
                            ? 'bg-sky-600 text-white font-medium shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 区域中心 */}
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-medium whitespace-nowrap min-w-[76px] text-right">
                    区域中心：
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['全部', '东北', '华北', '华北一', '华中'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setRegionCenter(opt)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          regionCenter === opt
                            ? 'bg-sky-600 text-white font-medium shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. 资源池 */}
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-medium whitespace-nowrap min-w-[76px] text-right">
                    资源池：
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      '全部',
                      '东莞资源池',
                      '安徽资源池',
                      '北京资源池',
                      '重庆资源池',
                      '广东资源池',
                      '甘肃资源池',
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setResourcePool(opt)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          resourcePool === opt
                            ? 'bg-sky-600 text-white font-medium shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. POD */}
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-medium whitespace-nowrap min-w-[76px] text-right">
                    POD：
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      '全部',
                      '东莞-ironic资源池',
                      '东莞-kvm资源池',
                      '东莞-vmware',
                      '东莞-二期-ironic-POD1资源池',
                      '二期一阶段POD7',
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setPod(opt)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          pod === opt
                            ? 'bg-sky-600 text-white font-medium shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. 设备厂家 */}
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-medium whitespace-nowrap min-w-[76px] text-right">
                    设备厂家：
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['全部', '3COM', 'A10', 'BEA', 'BMC'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setVendor(opt)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          vendor === opt
                            ? 'bg-sky-600 text-white font-medium shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. 设备类型 */}
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-medium whitespace-nowrap min-w-[76px] text-right">
                    设备类型：
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['全部', '服务器', '虚拟机', '路由器', '负载均衡', 'SDN控制器', 'VPN'].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => setDeviceType(opt)}
                          className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                            deviceType === opt
                              ? 'bg-sky-600 text-white font-medium shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 主告警列表 (字段与原型完全一致，随筛选条件联动变化) */}
          {/* 告警ID | 发生时间 | 告警级别 | 告警类型 | 告警标题 | 告警正文 | 设备类型 | 业务系统名称 | 采集资源ID | ciCode | 网元IP | 资源池 | POD | 操作 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">主告警列表</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  (已收敛匹配: <span className="text-sky-400 font-bold">{filteredConvergenceList.length}</span> 条)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>列表自动同步：已开启</span>
              </div>
            </div>

            {filteredConvergenceList.length === 0 ? (
              <div className="py-12 border border-slate-800 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-slate-800/60 rounded-full text-slate-400">
                  <Filter className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">无匹配的收敛告警记录</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    当前组合条件未筛选到任何主告警数据，请尝试调整搜索关键字或筛选选项。
                  </p>
                </div>
                <button
                  onClick={handleResetConvergenceFilters}
                  className="px-3.5 py-1.5 bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 border border-sky-500/30 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  清空筛选条件并重置
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                      <th className="py-3 px-4 whitespace-nowrap">告警ID</th>
                      <th className="py-3 px-4 whitespace-nowrap">发生时间</th>
                      <th className="py-3 px-4 whitespace-nowrap">告警级别</th>
                      <th className="py-3 px-4 whitespace-nowrap">告警类型</th>
                      <th className="py-3 px-4 whitespace-nowrap">告警标题</th>
                      <th className="py-3 px-4 whitespace-nowrap">告警正文</th>
                      <th className="py-3 px-4 whitespace-nowrap">设备类型</th>
                      <th className="py-3 px-4 whitespace-nowrap">业务系统名称</th>
                      <th className="py-3 px-4 whitespace-nowrap">采集资源ID</th>
                      <th className="py-3 px-4 whitespace-nowrap">ciCode</th>
                      <th className="py-3 px-4 whitespace-nowrap">网元IP</th>
                      <th className="py-3 px-4 whitespace-nowrap">资源池</th>
                      <th className="py-3 px-4 whitespace-nowrap">POD</th>
                      <th className="py-3 px-4 text-center whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {filteredConvergenceList.map((row) => (
                      <tr key={row.alarmId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-sky-400 font-bold whitespace-nowrap">{row.alarmId}</td>
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>{row.occurTime}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              row.alarmLevel === '重大'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : row.alarmLevel === '高'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : row.alarmLevel === '中'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {row.alarmLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                            {row.alarmType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans text-white font-medium max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                                row.alarmTag === '主'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : row.alarmTag === '聚'
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {row.alarmTag}
                            </span>
                            {row.isNew && (
                              <span className="px-1 py-0.2 bg-rose-600 text-white rounded text-[9px] font-bold shrink-0">
                                New！
                              </span>
                            )}
                            <span className="truncate">{row.alarmTitle}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-400 max-w-xs truncate">
                          {row.alarmBody}
                        </td>
                        <td className="py-3 px-4 font-sans whitespace-nowrap text-slate-200">
                          {row.deviceType}
                        </td>
                        <td className="py-3 px-4 font-sans text-cyan-300 whitespace-nowrap">
                          {row.businessSystem}
                        </td>
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{row.collectResourceId}</td>
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{row.ciCode}</td>
                        <td className="py-3 px-4 text-cyan-400 font-mono whitespace-nowrap">{row.ip}</td>
                        <td className="py-3 px-4 font-sans whitespace-nowrap">{row.resourcePool}</td>
                        <td className="py-3 px-4 font-sans whitespace-nowrap">{row.pod}</td>
                        <td className="py-3 px-4 text-center font-sans whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleTabChange('demarcation')}
                              className="text-sky-400 hover:underline cursor-pointer"
                            >
                              定界定位
                            </button>
                            <span className="text-slate-600">|</span>
                            <button
                              onClick={() => handleTabChange('root_cause_analysis')}
                              className="text-cyan-400 hover:underline cursor-pointer"
                            >
                              根因分析
                            </button>
                            <span className="text-slate-600">|</span>
                            <button
                              onClick={() => showToast(`已完成告警 [${row.alarmId}] 重复聚合处理！`)}
                              className="text-amber-400 hover:underline cursor-pointer"
                            >
                              重复告警聚合
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 分页与统计信息 */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-mono gap-2 pt-1">
              <span>
                共 {filteredConvergenceList.length} 条记录 第 1 / {Math.max(1, Math.ceil(filteredConvergenceList.length / 30))} 页
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-800 rounded">30条/页</span>
                <button
                  disabled
                  className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="px-2 py-0.5 bg-sky-600 text-white rounded font-bold">1</span>
                <button
                  disabled
                  className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded cursor-not-allowed"
                >
                  下一页
                </button>
                <div className="flex items-center gap-1">
                  <span>跳至</span>
                  <input
                    type="text"
                    defaultValue="1"
                    className="w-10 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center text-white"
                  />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 3: 故障溯源分析 (根据3张截图完整复刻与高端升级)
         ======================================================== */}
      {subTab === 'fault_trace' && (
        <div className="space-y-6">
          {/* ===================================================
              模块一: 主告警基本信息 + 关系切换 (对齐截图1)
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  主告警基本信息
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  重大
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {traceMainAlarm.systemSource}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-cyan-400 font-medium">
                  {traceMainAlarm.majorCategory}
                </span>
              </div>

              {/* 右侧元数据与快速下钻操作 */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <div>
                  <span className="text-slate-500">资源池: </span>
                  <span className="text-slate-200">{traceMainAlarm.resourcePool}</span>
                </div>
                <div>
                  <span className="text-slate-500">POD: </span>
                  <span className="text-slate-200">{traceMainAlarm.pod}</span>
                </div>
                <div>
                  <span className="text-slate-500">告警时间: </span>
                  <span className="text-sky-400 font-bold">{traceMainAlarm.occurTime}</span>
                </div>
                <button
                  onClick={() => handleTabChange('root_cause_analysis')}
                  className="px-3 py-1 bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 border border-sky-500/30 rounded-lg font-sans font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>根因分析</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 告警设备要素与摘要 */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold">
                    {traceMainAlarm.vendor}
                  </span>
                  <span className="text-slate-400 font-sans">{traceMainAlarm.deviceType}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-300 font-mono font-bold">{traceMainAlarm.sn}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-white font-sans font-bold">{traceMainAlarm.deviceName}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-sky-400 font-mono">{traceMainAlarm.ip}</span>
                </div>
                <p className="text-slate-400 font-sans leading-relaxed">
                  <span className="text-slate-500">告警正文摘要：</span>
                  {traceMainAlarm.summary}
                </p>
              </div>

              {/* 主从告警 / 聚合告警 切换按钮 (截图1右侧) */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 self-start md:self-center">
                <button
                  onClick={() => setTraceAlarmTab('主从告警')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    traceAlarmTab === '主从告警'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  主从告警
                </button>
                <button
                  onClick={() => setTraceAlarmTab('聚合告警')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    traceAlarmTab === '聚合告警'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  聚合告警
                </button>
              </div>
            </div>

            {/* ===================================================
                时序分布时间轴带 (Timeline Ribbon - 截图1时间刻度轴)
               =================================================== */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>全链路时序分布时间带 (5分钟跨度)</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                    <span>主告警事件 (15:40:00)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>从告警事件</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>合告警事件</span>
                  </span>
                </div>
              </div>

              {/* 时间轴刻度容器 */}
              <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
                <div className="min-w-[860px] relative pt-6 pb-2">
                  {/* 主基线 */}
                  <div className="absolute top-9 left-0 right-0 h-0.5 bg-slate-800"></div>

                  {/* 刻度点与时间标识 */}
                  <div className="grid grid-cols-10 text-center relative z-10">
                    {[
                      { time: '14:55:00', type: 'merge' },
                      { time: '15:05:00', type: 'none' },
                      { time: '15:10:00', type: 'merge' },
                      { time: '15:15:00', type: 'merge' },
                      { time: '15:20:00', type: 'none' },
                      { time: '15:28:40', type: 'slave' },
                      { time: '15:35:10', type: 'slave' },
                      { time: '15:38:12', type: 'slave' },
                      { time: '15:40:00', type: 'master' },
                      { time: '16:30:00', type: 'none' },
                    ].map((tick, idx) => (
                      <div key={idx} className="flex flex-col items-center group relative">
                        {/* 垂直指示线 */}
                        <div
                          className={`w-0.5 transition-all ${
                            tick.type === 'master'
                              ? 'h-10 -mt-6 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                              : tick.type === 'slave'
                              ? 'h-6 -mt-3 bg-amber-400/80'
                              : tick.type === 'merge'
                              ? 'h-5 -mt-2 bg-emerald-400/80'
                              : 'h-2 bg-slate-700'
                          }`}
                        />

                        {/* 节点圆圈 */}
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center my-1.5 ${
                            tick.type === 'master'
                              ? 'bg-rose-500 text-white font-bold text-[9px] ring-4 ring-rose-500/20'
                              : tick.type === 'slave'
                              ? 'bg-amber-400 text-slate-950 font-bold text-[8px]'
                              : tick.type === 'merge'
                              ? 'bg-emerald-400 text-slate-950 font-bold text-[8px]'
                              : 'bg-slate-800'
                          }`}
                        >
                          {tick.type === 'master'
                            ? '主'
                            : tick.type === 'slave'
                            ? '从'
                            : tick.type === 'merge'
                            ? '合'
                            : ''}
                        </div>

                        {/* 时间文字 */}
                        <span
                          className={`text-[10px] font-mono mt-1 ${
                            tick.type === 'master'
                              ? 'text-rose-400 font-bold scale-105'
                              : 'text-slate-400'
                          }`}
                        >
                          {tick.time}
                        </span>

                        {tick.type === 'master' && (
                          <div className="absolute -top-7 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold whitespace-nowrap shadow-lg">
                            主告警 15:40:00
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================
                主从/聚合告警表格 (时间降序排，截图1与截图2全量字段)
               =================================================== */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {traceAlarmTab === '主从告警' ? '主从因果关联告警明细' : '全量聚合告警明细'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    (按发生时间降序排列，共 {traceAlarmList.length} 条关联记录)
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  时空因果树深度：3层 | 聚类置信度：99.2%
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                      <th className="py-3 px-4">关联拓扑</th>
                      <th className="py-3 px-4">发生时间</th>
                      <th className="py-3 px-4">告警级别</th>
                      <th className="py-3 px-4">设备名称</th>
                      <th className="py-3 px-4">设备类型</th>
                      <th className="py-3 px-4">系统来源</th>
                      <th className="py-3 px-4">一级专业分类</th>
                      <th className="py-3 px-4">告警标题</th>
                      <th className="py-3 px-4">告警正文</th>
                      <th className="py-3 px-4">IP地址</th>
                      <th className="py-3 px-4">序列号</th>
                      <th className="py-3 px-4">资源池</th>
                      <th className="py-3 px-4">POD池</th>
                      <th className="py-3 px-4">厂家名称</th>
                      <th className="py-3 px-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/90 text-slate-300">
                    {traceAlarmList.map((row) => (
                      <tr
                        key={row.seq}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          row.treeRole === 'master' ? 'bg-rose-500/5' : ''
                        }`}
                      >
                        {/* 关联拓扑徽章与层级结构 */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {row.isNew && (
                              <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded text-[10px] font-bold animate-pulse">
                                New！
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                row.tag === '主'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                  : row.tag === '从'
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {row.tag}
                            </span>
                            {row.clusterTag && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-bold border border-slate-700">
                                {row.clusterTag}
                              </span>
                            )}
                            {row.treeRole === 'slave' && (
                              <span className="text-slate-600 text-xs font-mono ml-0.5">└─</span>
                            )}
                          </div>
                        </td>

                        {/* 发生时间 (近期时间降序排列) */}
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-sky-400">
                          {row.occurTime}
                        </td>

                        {/* 告警级别 */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              row.alarmLevel === '重大'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : row.alarmLevel === '高'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {row.alarmLevel}
                          </span>
                        </td>

                        {/* 设备名称 */}
                        <td className="py-3 px-4 whitespace-nowrap font-sans font-bold text-white">
                          {row.deviceName}
                        </td>

                        {/* 设备类型 */}
                        <td className="py-3 px-4 whitespace-nowrap font-sans text-slate-300">
                          {row.deviceType}
                        </td>

                        {/* 系统来源 */}
                        <td className="py-3 px-4 whitespace-nowrap font-sans text-slate-400">
                          {row.systemSource}
                        </td>

                        {/* 一级专业分类 */}
                        <td className="py-3 px-4 whitespace-nowrap font-sans text-cyan-300">
                          {row.majorCategory}
                        </td>

                        {/* 告警标题 */}
                        <td className="py-3 px-4 font-sans text-white font-medium max-w-xs truncate">
                          {row.alarmTitle}
                        </td>

                        {/* 告警正文 */}
                        <td className="py-3 px-4 font-sans text-slate-400 max-w-sm truncate">
                          {row.alarmBody}
                        </td>

                        {/* IP地址 */}
                        <td className="py-3 px-4 whitespace-nowrap text-cyan-400 font-mono">
                          {row.ip}
                        </td>

                        {/* 序列号 */}
                        <td className="py-3 px-4 whitespace-nowrap text-slate-300">{row.seq}</td>

                        {/* 资源池 */}
                        <td className="py-3 px-4 whitespace-nowrap font-sans">{row.resourcePool}</td>

                        {/* POD池 */}
                        <td className="py-3 px-4 whitespace-nowrap font-sans">{row.pod}</td>

                        {/* 厂家名称 */}
                        <td className="py-3 px-4 whitespace-nowrap font-sans">{row.vendor}</td>

                        {/* 操作 */}
                        <td className="py-3 px-4 whitespace-nowrap text-center font-sans">
                          <button
                            onClick={() => handleTabChange('root_cause_analysis')}
                            className="text-sky-400 hover:underline cursor-pointer"
                          >
                            溯源根因
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页条 (对齐截图1底部) */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-mono gap-2 pt-1">
                <span>共140条记录 第1/14页</span>
                <div className="flex items-center gap-1.5">
                  <button className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded hover:bg-slate-700">
                    &lt;
                  </button>
                  <span className="px-2 py-0.5 bg-sky-600 text-white rounded font-bold">1</span>
                  <button className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">
                    2
                  </button>
                  <button className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">
                    3
                  </button>
                  <button className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">
                    4
                  </button>
                  <button className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">
                    5
                  </button>
                  <button className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded hover:bg-slate-700">
                    &gt;
                  </button>
                  <span className="px-2 py-0.5 bg-slate-800 rounded">10条/页</span>
                  <div className="flex items-center gap-1">
                    <span>跳至</span>
                    <input
                      type="text"
                      defaultValue="1"
                      className="w-9 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-white"
                    />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              模块二: 故障溯源情报 + 时序指标多维监控 (对齐截图3)
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-cyan-400 rounded-full"></div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  故障溯源情报
                </h2>
                <span className="text-xs text-slate-400">
                  全链路主机与拓扑网元溯源画像
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                数据采集间隔: 10s | 异常识别模型: LSTM-AE-V3
              </span>
            </div>

            {/* 溯源主机设备表格 (截图3上方表格) */}
            {/* 序列号 | 区域分类 | 区域中心 | 资源池 | POD | IP地址 | 设备类型 | 设备名称 | 设备厂家 | 业务系统 | 操作系统 | 告警对应 */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                    <th className="py-3 px-4">序列号</th>
                    <th className="py-3 px-4">区域分类</th>
                    <th className="py-3 px-4">区域中心</th>
                    <th className="py-3 px-4">资源池</th>
                    <th className="py-3 px-4">POD</th>
                    <th className="py-3 px-4">IP地址</th>
                    <th className="py-3 px-4">设备类型</th>
                    <th className="py-3 px-4">设备名称</th>
                    <th className="py-3 px-4">设备厂家</th>
                    <th className="py-3 px-4">业务系统</th>
                    <th className="py-3 px-4">操作系统</th>
                    <th className="py-3 px-4 text-center">告警对应</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {traceIntelligenceList.map((item) => (
                    <tr
                      key={item.sn}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        item.alarmRole === '主' ? 'bg-rose-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-cyan-300 whitespace-nowrap">
                        {item.sn}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans">{item.regionCategory}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans">{item.regionCenter}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans">{item.resourcePool}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans">{item.pod}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sky-400">{item.ip}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans text-slate-300">
                        {item.deviceType}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans font-bold text-white">
                        {item.deviceName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans">{item.vendor}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans text-emerald-300">
                        {item.businessSystem}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">{item.os}</td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.alarmRole === '主'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}
                        >
                          {item.alarmRole}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 监控指标选项卡与图表区域 (截图3下半部分) */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* 选项卡: 性能指标 | 日志 | 操作事件 */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['性能指标', '日志', '操作事件'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTraceMetricTab(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        traceMetricTab === tab
                          ? 'bg-sky-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* 指标图例 (可点击切换显示隐藏) */}
                {traceMetricTab === '性能指标' && (
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400">监控指标：</span>
                    <button
                      onClick={() =>
                        setTraceMetricVisibility((prev) => ({ ...prev, cpu: !prev.cpu }))
                      }
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-opacity ${
                        traceMetricVisibility.cpu ? 'opacity-100' : 'opacity-40 line-through'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                      <span className="text-slate-200">CPU利用率</span>
                    </button>
                    <button
                      onClick={() =>
                        setTraceMetricVisibility((prev) => ({ ...prev, mem: !prev.mem }))
                      }
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-opacity ${
                        traceMetricVisibility.mem ? 'opacity-100' : 'opacity-40 line-through'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                      <span className="text-sky-400">内存利用率</span>
                    </button>
                    <button
                      onClick={() =>
                        setTraceMetricVisibility((prev) => ({ ...prev, net: !prev.net }))
                      }
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-opacity ${
                        traceMetricVisibility.net ? 'opacity-100' : 'opacity-40 line-through'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="text-emerald-400">网络数据包速率</span>
                    </button>
                    <button
                      onClick={() =>
                        setTraceMetricVisibility((prev) => ({ ...prev, diskIo: !prev.diskIo }))
                      }
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-opacity ${
                        traceMetricVisibility.diskIo ? 'opacity-100' : 'opacity-40 line-through'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                      <span className="text-purple-400">磁盘I/O队列</span>
                    </button>
                    <button
                      onClick={() =>
                        setTraceMetricVisibility((prev) => ({
                          ...prev,
                          anomalyBand: !prev.anomalyBand,
                        }))
                      }
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-opacity ${
                        traceMetricVisibility.anomalyBand
                          ? 'opacity-100'
                          : 'opacity-40 line-through'
                      }`}
                    >
                      <span className="w-3 h-2.5 rounded-sm bg-rose-500/50 border border-rose-500"></span>
                      <span className="text-rose-300 font-bold">告警周期</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 选项卡内容 1: 性能指标 (SVG高保真曲线与告警周期标注，带悬浮交互与时间刷选器) */}
              {traceMetricTab === '性能指标' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                  {/* 图表主区域 */}
                  <div className="relative h-72 w-full pt-4">
                    {/* Y 轴刻度 */}
                    <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-slate-500 text-[10px] select-none">
                      <span>100%</span>
                      <span>80%</span>
                      <span>60%</span>
                      <span>40%</span>
                      <span>20%</span>
                      <span>0%</span>
                    </div>

                    {/* 图表绘图网格与曲线 */}
                    <div className="ml-12 h-64 relative border-l border-b border-slate-800">
                      {/* 水平辅助虚线 */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="border-b border-dashed border-slate-600 w-full"></div>
                        <div className="border-b border-dashed border-slate-600 w-full"></div>
                        <div className="border-b border-dashed border-slate-600 w-full"></div>
                        <div className="border-b border-dashed border-slate-600 w-full"></div>
                        <div className="border-b border-dashed border-slate-600 w-full"></div>
                        <div className="border-b border-slate-700 w-full"></div>
                      </div>

                      {/* 红色高亮告警周期阴影块 (对应截图3红色告警周期背景带) */}
                      {traceMetricVisibility.anomalyBand && (
                        <>
                          {/* 告警周期 1: 15:10 - 15:15 */}
                          <div
                            className="absolute top-0 bottom-0 bg-rose-500/15 border-x border-rose-500/40 pointer-events-none"
                            style={{ left: '15%', width: '10%' }}
                          >
                            <span className="absolute top-1 left-1 text-[9px] text-rose-400 font-bold">
                              告警周期
                            </span>
                          </div>
                          {/* 告警周期 2 (主事件发生期): 15:30 - 15:45 */}
                          <div
                            className="absolute top-0 bottom-0 bg-rose-500/20 border-x border-rose-500/50 pointer-events-none"
                            style={{ left: '35%', width: '20%' }}
                          >
                            <span className="absolute top-1 left-1 text-[9px] text-rose-300 font-bold animate-pulse">
                              主告警爆发周期
                            </span>
                          </div>
                          {/* 告警周期 3: 16:15 - 16:25 */}
                          <div
                            className="absolute top-0 bottom-0 bg-rose-500/15 border-x border-rose-500/40 pointer-events-none"
                            style={{ left: '80%', width: '12%' }}
                          >
                            <span className="absolute top-1 left-1 text-[9px] text-rose-400 font-bold">
                              告警周期
                            </span>
                          </div>
                        </>
                      )}

                      {/* SVG 曲线图绘制 */}
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="cpuGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="memGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* CPU 利用率曲线 */}
                        {traceMetricVisibility.cpu && (
                          <path
                            d={traceMetricSeries
                              .map((pt, i) => {
                                const x = (i / (traceMetricSeries.length - 1)) * 100;
                                const y = 100 - pt.cpu;
                                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                              })
                              .join(' ')}
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        )}

                        {/* 内存利用率曲线 */}
                        {traceMetricVisibility.mem && (
                          <path
                            d={traceMetricSeries
                              .map((pt, i) => {
                                const x = (i / (traceMetricSeries.length - 1)) * 100;
                                const y = 100 - pt.mem;
                                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                              })
                              .join(' ')}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        )}

                        {/* 网络数据包速率曲线 */}
                        {traceMetricVisibility.net && (
                          <path
                            d={traceMetricSeries
                              .map((pt, i) => {
                                const x = (i / (traceMetricSeries.length - 1)) * 100;
                                const y = 100 - pt.net;
                                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                              })
                              .join(' ')}
                            fill="none"
                            stroke="#34d399"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        )}

                        {/* 磁盘 I/O 队列曲线 */}
                        {traceMetricVisibility.diskIo && (
                          <path
                            d={traceMetricSeries
                              .map((pt, i) => {
                                const x = (i / (traceMetricSeries.length - 1)) * 100;
                                const y = 100 - pt.diskIo;
                                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                              })
                              .join(' ')}
                            fill="none"
                            stroke="#c084fc"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        )}

                        {/* 关键异常点高亮红圈 (截图3红圈标记) */}
                        {traceMetricSeries.map((pt, i) => {
                          if (!pt.isAlarm) return null;
                          const x = (i / (traceMetricSeries.length - 1)) * 100;
                          return (
                            <g key={i}>
                              <circle
                                cx={`${x}%`}
                                cy={`${100 - pt.cpu}%`}
                                r="4.5"
                                fill="#f43f5e"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                className="cursor-pointer"
                              />
                              <circle
                                cx={`${x}%`}
                                cy={`${100 - pt.mem}%`}
                                r="4"
                                fill="#f43f5e"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                className="cursor-pointer"
                              />
                            </g>
                          );
                        })}
                      </svg>

                      {/* 鼠标交互十字指针与悬浮提示卡片 (对应截图3悬浮Tooltip) */}
                      {traceHoverIndex !== null && (
                        <div
                          className="absolute top-0 bottom-0 pointer-events-none flex flex-col justify-center"
                          style={{
                            left: `${(traceHoverIndex / (traceMetricSeries.length - 1)) * 100}%`,
                          }}
                        >
                          {/* 垂线 */}
                          <div className="absolute top-0 bottom-0 w-px bg-sky-400/80 -translate-x-1/2"></div>

                          {/* Tooltip 卡片 */}
                          <div
                            className={`absolute z-30 bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md min-w-[170px] space-y-1.5 ${
                              traceHoverIndex > 10 ? 'right-4' : 'left-4'
                            }`}
                          >
                            <div className="text-[11px] font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between">
                              <span>{traceMetricSeries[traceHoverIndex].time}</span>
                              {traceMetricSeries[traceHoverIndex].isAlarm && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                                  告警异常
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-[11px]">
                              <div className="flex justify-between items-center text-slate-300">
                                <span className="text-slate-400">CPU利用率:</span>
                                <span className="font-bold text-slate-100">
                                  {traceMetricSeries[traceHoverIndex].cpu}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sky-400">
                                <span className="text-slate-400">内存利用率:</span>
                                <span className="font-bold">
                                  {traceMetricSeries[traceHoverIndex].mem}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-emerald-400">
                                <span className="text-slate-400">网络包速率:</span>
                                <span className="font-bold">
                                  {traceMetricSeries[traceHoverIndex].net}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-purple-400">
                                <span className="text-slate-400">磁盘I/O队列:</span>
                                <span className="font-bold">
                                  {traceMetricSeries[traceHoverIndex].diskIo}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 交互触发透明热区 */}
                      <div className="absolute inset-0 grid grid-cols-20 cursor-crosshair">
                        {traceMetricSeries.map((_, i) => (
                          <div
                            key={i}
                            onMouseEnter={() => setTraceHoverIndex(i)}
                            className="h-full hover:bg-white/5 transition-colors"
                          />
                        ))}
                      </div>
                    </div>

                    {/* X 轴时间标签 */}
                    <div className="ml-12 mt-2 flex justify-between text-slate-500 text-[10px] select-none">
                      {traceMetricSeries
                        .filter((_, i) => i % 2 === 0)
                        .map((pt, i) => (
                          <span key={i}>{pt.time}</span>
                        ))}
                    </div>
                  </div>

                  {/* 底部时间轴缩放条 (截图3底部微缩轨迹条) */}
                  <div className="pt-2">
                    <div className="h-4 bg-slate-900 rounded border border-slate-800 relative flex items-center px-1">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full relative">
                        <div
                          className="absolute top-0 bottom-0 bg-sky-500/60 rounded-full"
                          style={{ left: '15%', width: '70%' }}
                        ></div>
                        <div
                          className="absolute -top-1 w-2.5 h-3.5 bg-sky-400 rounded cursor-ew-resize shadow"
                          style={{ left: '15%' }}
                        ></div>
                        <div
                          className="absolute -top-1 w-2.5 h-3.5 bg-sky-400 rounded cursor-ew-resize shadow"
                          style={{ left: '85%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 选项卡内容 2: 日志 (近期降序排列) */}
              {traceMetricTab === '日志' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="text-xs text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>异常触发时序内核与守护进程日志流</span>
                    </span>
                    <span>共 {traceLogList.length} 条时序日志记录</span>
                  </div>
                  <div className="space-y-2">
                    {traceLogList.map((log, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sky-400 font-bold">{log.time}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              log.level === 'FATAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : log.level === 'ERROR'
                                ? 'bg-rose-500/10 text-rose-400'
                                : log.level === 'WARN'
                                ? 'bg-amber-500/10 text-amber-300'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {log.level}
                          </span>
                          <span className="text-cyan-300">[{log.source}]</span>
                        </div>
                        <div className="text-slate-300 sm:max-w-xl text-left truncate font-sans">
                          {log.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 选项卡内容 3: 操作事件 (近期降序排列) */}
              {traceMetricTab === '操作事件' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="text-xs text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>时间窗口期内运维操作审计溯源</span>
                    </span>
                    <span>共 {traceOperationList.length} 条审计操作</span>
                  </div>
                  <div className="space-y-2">
                    {traceOperationList.map((op, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sky-400 font-bold">{op.time}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {op.user}
                          </span>
                          <span className="font-bold text-white font-sans">{op.action}</span>
                          <span className="text-cyan-300">@{op.target}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-sans">{op.detail}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                            {op.result}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 4: 定界定位 (根据原型与最新规范深度升级：交互式拓扑图 + 全量节点穿透详情)
         ======================================================== */}
      {subTab === 'demarcation' && (
        <div className="space-y-6">
          {/* 顶部主横幅与关联要素指标 (完全对齐原型) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <span>定界定位</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400">定界定位拓扑图</span>
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  因果图推理引擎在线
                </span>
              </div>

              {/* 顶部要素 (对齐原型：设备对象 | 指标 | 起始告警 | 指标) */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">设备对象：</span>
                  <strong className="text-white font-sans">{demarcHeader.deviceObject}</strong>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">指标：</span>
                  <strong className="text-cyan-300">{demarcHeader.metric}</strong>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">起始告警：</span>
                  <strong className="text-rose-400 font-sans">{demarcHeader.startAlarm}</strong>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">指标：</span>
                  <strong className="text-amber-300">{demarcHeader.secondMetric}</strong>
                </div>
                <button
                  onClick={() => handleTabChange('demarcation_table')}
                  className="px-3 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-sans transition-colors cursor-pointer flex items-center gap-1.5 ml-auto lg:ml-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>切换定界结论列表</span>
                </button>
              </div>
            </div>

            {/* 定界拓扑可视化画布 (交互式节点网络，点击节点联动下方详情) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2 font-mono">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>多维依赖定界因果拓扑（点击图上节点可穿透查看各维度字段详情）</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30"></span>
                    <span>定位主根因节点</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                    <span>传导扩散节点</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30"></span>
                    <span>次生波及节点</span>
                  </span>
                </div>
              </div>

              {/* 交互拓扑图容器 */}
              <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-hidden">
                {/* 背景点阵 */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

                {/* 连线与节点图 */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* 节点 1: 设备对象 */}
                  <div
                    onClick={() => setSelectedDemarcNode('device')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      selectedDemarcNode === 'device'
                        ? 'bg-slate-900 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] ring-2 ring-sky-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                        <Server className="w-3.5 h-3.5" />
                        <span>设备对象</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono">
                        宿主机
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="font-bold text-white truncate font-sans">
                        {demarcDeviceNode.deviceName}
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        {demarcDeviceNode.ip}
                      </div>
                      <div className="text-[11px] text-cyan-300 font-mono">
                        {demarcDeviceNode.sn}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between items-center">
                      <span>状态: 异常倾斜</span>
                      <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform">
                        查看详情 →
                      </span>
                    </div>
                  </div>

                  {/* 箭头指示 1 */}
                  <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                    <span className="text-[10px] font-mono text-rose-400 mb-1">触发异常 98%</span>
                    <div className="w-full h-0.5 bg-gradient-to-r from-sky-500 to-rose-500 relative">
                      <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-rose-500 rotate-45"></div>
                    </div>
                  </div>

                  {/* 节点 2: 起始告警 */}
                  <div
                    onClick={() => setSelectedDemarcNode('alarm')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      selectedDemarcNode === 'alarm'
                        ? 'bg-slate-900 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-rose-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>起始告警</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                        重大
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="font-bold text-white truncate font-sans">
                        cpu_rate 异常检测告警
                      </div>
                      <div className="text-rose-400 font-mono text-[11px]">
                        {demarcAlarmNode.alarmTime.split(' ')[1]}
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans truncate">
                        单核CPU 98.2% 持续超标
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between items-center">
                      <span>定界源: 主故障</span>
                      <span className="text-rose-400 group-hover:translate-x-0.5 transition-transform">
                        查看详情 →
                      </span>
                    </div>
                  </div>

                  {/* 箭头指示 2 */}
                  <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                    <span className="text-[10px] font-mono text-amber-400 mb-1">指标联动 89%</span>
                    <div className="w-full h-0.5 bg-gradient-to-r from-rose-500 to-amber-500 relative">
                      <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-amber-500 rotate-45"></div>
                    </div>
                  </div>

                  {/* 节点 3: 遥测指标 */}
                  <div
                    onClick={() => setSelectedDemarcNode('metric')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      selectedDemarcNode === 'metric'
                        ? 'bg-slate-900 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] ring-2 ring-amber-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" />
                        <span>遥测指标</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                        94.8 MB/s
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="font-bold text-white truncate font-mono">
                        {demarcMetricNode.metricName}
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        采集: {demarcMetricNode.collectTime.split(' ')[1]}
                      </div>
                      <div className="text-[11px] text-amber-300 font-sans truncate">
                        已超出动态基线 58%
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between items-center">
                      <span>告警级别: 高</span>
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">
                        查看详情 →
                      </span>
                    </div>
                  </div>
                </div>

                {/* 第二排拓扑节点：服务层与资源层 */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 节点 4: 服务节点 */}
                  <div
                    onClick={() => setSelectedDemarcNode('service')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      selectedDemarcNode === 'service'
                        ? 'bg-slate-900 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.25)] ring-2 ring-emerald-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <Box className="w-3.5 h-3.5" />
                        <span>承载服务</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                        {demarcServiceNode.runStatus}
                      </span>
                    </div>
                    <div className="mt-2 text-xs space-y-1">
                      <div className="font-bold text-white font-mono truncate">
                        {demarcServiceNode.serviceName}
                      </div>
                      <div className="text-slate-400 text-[11px] truncate">
                        端口：{demarcServiceNode.servicePort} | 活跃连接：{demarcServiceNode.connectionCount}
                      </div>
                    </div>
                  </div>

                  {/* 节点 5: 底层资源/存储 */}
                  <div
                    onClick={() => setSelectedDemarcNode('resource')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      selectedDemarcNode === 'resource'
                        ? 'bg-slate-900 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.25)] ring-2 ring-purple-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>底层存储资源</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                        {demarcResourceNode.runStatus}
                      </span>
                    </div>
                    <div className="mt-2 text-xs space-y-1">
                      <div className="font-bold text-white font-mono truncate">
                        {demarcResourceNode.diskName} ({demarcResourceNode.diskId})
                      </div>
                      <div className="text-slate-400 text-[11px] truncate">
                        容量：{demarcResourceNode.usedCapacity} / {demarcResourceNode.totalCapacity} ({demarcResourceNode.diskType})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================
                节点详情穿透卡片 (完全还原 http://ai-ops.zhongfy.cn/定界定位.html 字段)
               =================================================== */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-sky-400 rounded-full"></div>
                  <h3 className="font-bold text-white text-sm font-sans">
                    节点详情：
                  </h3>
                  <span className="text-xs text-slate-400 font-sans">
                    (当前查看：
                    {selectedDemarcNode === 'device' && '设备对象详情'}
                    {selectedDemarcNode === 'alarm' && '起始告警详情'}
                    {selectedDemarcNode === 'metric' && '指标及关联告警详情'}
                    {selectedDemarcNode === 'service' && '服务运行详情'}
                    {selectedDemarcNode === 'resource' && '磁盘及存储资源详情'}
                    )
                  </span>
                </div>

                {/* 快速切换当前节点详情 */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {(
                    [
                      { id: 'device', label: '设备对象' },
                      { id: 'alarm', label: '告警信息' },
                      { id: 'metric', label: '指标数据' },
                      { id: 'service', label: '服务状态' },
                      { id: 'resource', label: '磁盘资源' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedDemarcNode(t.id)}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        selectedDemarcNode === t.id
                          ? 'bg-sky-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 节点详情内容区域 (对齐原型字段) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono">
                {/* 1. 设备对象节点字段 */}
                {/* 序列号： | 资源池： | 设备对象 | 设备名称： | IP地址： | 设备类型： | 设备厂商： | 资源池： | POD： | 系统来源： */}
                {selectedDemarcNode === 'device' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500">序列号：</span>
                        <div className="text-cyan-300 font-bold mt-1.5">{demarcDeviceNode.sn}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">资源池：</span>
                        <div className="text-white mt-1.5 font-sans">{demarcDeviceNode.resourcePool}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">设备名称：</span>
                        <div className="text-white mt-1.5 font-sans font-bold">{demarcDeviceNode.deviceName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">IP地址：</span>
                        <div className="text-sky-400 mt-1.5">{demarcDeviceNode.ip}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">设备类型：</span>
                        <div className="text-slate-300 mt-1.5 font-sans">{demarcDeviceNode.deviceType}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">设备厂商：</span>
                        <div className="text-white mt-1.5 font-sans font-bold">{demarcDeviceNode.vendor}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">POD：</span>
                        <div className="text-slate-300 mt-1.5 font-sans">{demarcDeviceNode.pod}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">系统来源：</span>
                        <div className="text-cyan-300 mt-1.5 font-sans font-medium">{demarcDeviceNode.systemSource}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. 告警节点字段 */}
                {/* 告警标题： | 一级专业分类： | 告警时间： | 告警级别： | 告警正文： | 根因分析 */}
                {selectedDemarcNode === 'alarm' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">告警标题：</span>
                        <div className="text-white mt-1.5 font-sans font-bold">{demarcAlarmNode.title}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">一级专业分类：</span>
                        <div className="text-cyan-300 mt-1.5 font-sans">{demarcAlarmNode.majorCategory}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">告警级别：</span>
                        <div className="mt-1.5">
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                            {demarcAlarmNode.alarmLevel}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">告警时间：</span>
                        <div className="text-sky-400 mt-1.5 font-bold">{demarcAlarmNode.alarmTime}</div>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-3">
                        <span className="text-slate-500">告警正文：</span>
                        <div className="text-slate-300 mt-1.5 font-sans leading-relaxed">
                          {demarcAlarmNode.alarmBody}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleTabChange('root_cause_analysis')}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-sans font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>根因分析</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. 指标节点字段 */}
                {/* 关联数据采集时间： | 指标名称： | 起始告警关联数据： | 采集时间： | 最新数据： | 是否触发告警： | 告警标题： | 告警时间： | 告警级别： */}
                {selectedDemarcNode === 'metric' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500">指标名称：</span>
                      <div className="text-cyan-300 font-bold mt-1.5 font-mono">{demarcMetricNode.metricName}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">关联数据采集时间：</span>
                      <div className="text-slate-300 mt-1.5">{demarcMetricNode.relatedCollectTime}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">采集时间：</span>
                      <div className="text-sky-400 mt-1.5 font-bold">{demarcMetricNode.collectTime}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">最新数据：</span>
                      <div className="text-amber-300 mt-1.5 font-bold">{demarcMetricNode.latestData}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500">起始告警关联数据：</span>
                      <div className="text-white mt-1.5 font-mono">{demarcMetricNode.startAlarmRelatedData}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">是否触发告警：</span>
                      <div className="text-rose-400 mt-1.5 font-bold font-sans">{demarcMetricNode.isTriggerAlarm}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">告警级别：</span>
                      <div className="mt-1.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                          {demarcMetricNode.alarmLevel}
                        </span>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500">告警标题：</span>
                      <div className="text-white mt-1.5 font-sans">{demarcMetricNode.alarmTitle}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">告警时间：</span>
                      <div className="text-sky-400 mt-1.5 font-bold">{demarcMetricNode.alarmTime}</div>
                    </div>
                  </div>
                )}

                {/* 4. 服务节点字段 */}
                {/* 服务端口： | 服务名称： | 启动状态： | 描述信息： | 部署方式： | 日志路径： | 版本信息： | 连接数： | 应用： | 启动类型： */}
                {selectedDemarcNode === 'service' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                    <div className="sm:col-span-2">
                      <span className="text-slate-500">服务名称：</span>
                      <div className="text-white font-bold mt-1.5 font-mono">{demarcServiceNode.serviceName}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">服务端口：</span>
                      <div className="text-cyan-300 mt-1.5 font-mono">{demarcServiceNode.servicePort}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">启动状态：</span>
                      <div className="mt-1.5">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                          {demarcServiceNode.runStatus}
                        </span>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500">描述信息：</span>
                      <div className="text-slate-300 mt-1.5 font-sans leading-relaxed">
                        {demarcServiceNode.desc}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">部署方式：</span>
                      <div className="text-slate-300 mt-1.5 font-sans">{demarcServiceNode.deployType}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">版本信息：</span>
                      <div className="text-slate-300 mt-1.5 font-mono">{demarcServiceNode.version}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">日志路径：</span>
                      <div className="text-sky-400 mt-1.5 font-mono truncate">{demarcServiceNode.logPath}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">连接数：</span>
                      <div className="text-white mt-1.5 font-mono font-bold">{demarcServiceNode.connectionCount}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">应用：</span>
                      <div className="text-emerald-300 mt-1.5 font-sans font-medium">{demarcServiceNode.appName}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">启动类型：</span>
                      <div className="text-slate-300 mt-1.5 font-sans">{demarcServiceNode.startupType}</div>
                    </div>
                  </div>
                )}

                {/* 5. 资源/磁盘节点字段 */}
                {/* 运行状态： | 磁盘ID： | 磁盘名称： | 已用容量： | 总容量： | 可用容量： | 位置信息： | 磁盘类型： | 健康状态： | 节点ID： | 磁盘域ID： */}
                {selectedDemarcNode === 'resource' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500">磁盘ID：</span>
                      <div className="text-cyan-300 font-bold mt-1.5 font-mono">{demarcResourceNode.diskId}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">磁盘名称：</span>
                      <div className="text-white font-bold mt-1.5 font-sans">{demarcResourceNode.diskName}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">运行状态：</span>
                      <div className="mt-1.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          {demarcResourceNode.runStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">健康状态：</span>
                      <div className="text-emerald-400 mt-1.5 font-sans font-bold">{demarcResourceNode.healthStatus}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">已用容量：</span>
                      <div className="text-rose-400 mt-1.5 font-bold font-mono">{demarcResourceNode.usedCapacity}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">总容量：</span>
                      <div className="text-white mt-1.5 font-mono">{demarcResourceNode.totalCapacity}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">可用容量：</span>
                      <div className="text-emerald-300 mt-1.5 font-mono">{demarcResourceNode.freeCapacity}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">磁盘类型：</span>
                      <div className="text-slate-300 mt-1.5 font-mono">{demarcResourceNode.diskType}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">位置信息：</span>
                      <div className="text-slate-300 mt-1.5 font-sans">{demarcResourceNode.location}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">节点ID：</span>
                      <div className="text-slate-300 mt-1.5 font-mono">{demarcResourceNode.nodeId}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500">磁盘域ID：</span>
                      <div className="text-sky-400 mt-1.5 font-mono">{demarcResourceNode.diskDomainId}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 5: 定界定位（表格） (根据截图三大模块完整实现，时间近期且降序排列)
         ======================================================== */}
      {subTab === 'demarcation_table' && (
        <div className="space-y-6">
          {/* ===================================================
              模块一: 主告警基本信息 (对齐截图1顶部卡片)
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h2 className="text-base font-bold text-white tracking-wide font-sans">
                  主告警基本信息
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono text-slate-400">
                  <span>告警时间：</span>
                  <span className="text-sky-400 font-bold">{demarcTableMainAlarm.alarmTime}</span>
                </div>
                <button
                  onClick={() => handleTabChange('demarcation')}
                  className="px-3 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-sans transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>切换定界拓扑图</span>
                </button>
              </div>
            </div>

            {/* 告警信息内容主体 (带红色左边框指示条) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
              {/* 左侧红色重磅告警竖条 */}
              <div className="w-1.5 self-stretch bg-rose-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(244,63,94,0.6)]"></div>

              <div className="space-y-2.5 flex-1 min-w-0">
                {/* 顶排标签: 重大 | 网管中心 | 类型 */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm">
                    {demarcTableMainAlarm.level}
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-sans">
                    {demarcTableMainAlarm.systemSource}
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-sans">
                    {demarcTableMainAlarm.alarmType}
                  </span>
                </div>

                {/* 告警标题与摘要 */}
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-white font-sans text-sm flex items-center gap-2">
                    <span className="text-slate-400 font-normal">告警标题：</span>
                    <span className="text-white">{demarcTableMainAlarm.title}</span>
                  </div>
                  <p className="text-slate-400 font-sans leading-relaxed text-xs">
                    <span className="text-slate-500">告警正文摘要：</span>
                    {demarcTableMainAlarm.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              模块二: 主告警设备信息 (对齐截图10个字段)
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h2 className="text-base font-bold text-white tracking-wide font-sans">
                  主告警设备信息
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                设备在线状态：<strong className="text-emerald-400">NORMAL</strong> | 告警纳管率：100%
              </span>
            </div>

            {/* 10个设备字段网格排布 (完全对齐截图) */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">
              <div>
                <span className="text-sky-400 font-medium">设备序列号：</span>
                <div className="text-cyan-300 font-bold mt-1">{demarcTableDevice.sn}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">设备类型：</span>
                <div className="text-white mt-1 font-sans">{demarcTableDevice.deviceType}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">设备名称：</span>
                <div className="text-white font-bold mt-1 font-sans">{demarcTableDevice.deviceName}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">设备厂家：</span>
                <div className="text-slate-200 mt-1 font-sans">{demarcTableDevice.vendor}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">业务系统：</span>
                <div className="text-emerald-300 mt-1 font-sans">{demarcTableDevice.businessSystem}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">资源池：</span>
                <div className="text-slate-300 mt-1 font-sans">{demarcTableDevice.resourcePool}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">POD：</span>
                <div className="text-slate-300 mt-1 font-sans">{demarcTableDevice.pod}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">管理IP地址：</span>
                <div className="text-cyan-400 mt-1 font-bold">{demarcTableDevice.manageIp}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">业务IP地址：</span>
                <div className="text-cyan-400 mt-1 font-bold">{demarcTableDevice.businessIp}</div>
              </div>
              <div>
                <span className="text-sky-400 font-medium">操作系统：</span>
                <div className="text-slate-300 mt-1">{demarcTableDevice.os}</div>
              </div>
            </div>
          </div>

          {/* ===================================================
              模块三: 定界定位结论列表 (对齐截图表头与列定义)
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h2 className="text-base font-bold text-white tracking-wide font-sans">
                  定界定位结论列表
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>时空关联因果推理深度：4层</span>
                <span>置信度区间：50% ~ 90%</span>
              </div>
            </div>

            {/* 定界定位结论表格 (字段对齐截图：序号 | 结论概率 | 资源类别 | 资源名称 | 资源ID | 定界定位路径信息 | 路径节点数 | 定界定位路径图) */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                    <th className="py-3.5 px-4 text-center">序号</th>
                    <th className="py-3.5 px-4">发生时间</th>
                    <th
                      onClick={() => setDemarcSortDesc(!demarcSortDesc)}
                      className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>结论概率</span>
                        <span className="text-[10px] text-sky-400">{demarcSortDesc ? '▼' : '▲'}</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4">资源类别</th>
                    <th className="py-3.5 px-4">资源名称</th>
                    <th className="py-3.5 px-4">资源ID</th>
                    <th className="py-3.5 px-4">定界定位路径信息</th>
                    <th className="py-3.5 px-4 text-center">路径节点数</th>
                    <th className="py-3.5 px-4 text-center">定界定位路径图</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {[...demarcTableConclusionList]
                    .sort((a, b) => (demarcSortDesc ? b.probVal - a.probVal : a.probVal - b.probVal))
                    .map((row) => (
                      <tr
                        key={row.seq}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          row.probVal >= 90 ? 'bg-rose-500/5' : ''
                        }`}
                      >
                        {/* 序号 */}
                        <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                          {row.seq}
                        </td>

                        {/* 发生时间 (近期降序排列) */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-sky-400">
                          {row.occurTime}
                        </td>

                        {/* 结论概率 */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-sm ${
                                row.probVal >= 90
                                  ? 'text-rose-400'
                                  : row.probVal >= 80
                                  ? 'text-amber-400'
                                  : row.probVal >= 70
                                  ? 'text-yellow-400'
                                  : 'text-slate-300'
                              }`}
                            >
                              {row.prob}
                            </span>
                            {/* 进度微进度条 */}
                            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  row.probVal >= 90
                                    ? 'bg-rose-500'
                                    : row.probVal >= 80
                                    ? 'bg-amber-400'
                                    : row.probVal >= 70
                                    ? 'bg-yellow-400'
                                    : 'bg-sky-400'
                                }`}
                                style={{ width: `${row.probVal}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* 资源类别 */}
                        <td className="py-3.5 px-4 font-sans font-bold text-white whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                            {row.resourceCategory}
                          </span>
                        </td>

                        {/* 资源名称 */}
                        <td className="py-3.5 px-4 font-sans text-slate-200 whitespace-nowrap">
                          {row.resourceName}
                        </td>

                        {/* 资源ID */}
                        <td className="py-3.5 px-4 text-cyan-400 font-mono whitespace-nowrap">
                          {row.resourceId}
                        </td>

                        {/* 定界定位路径信息 (带箭头面包屑卡片) */}
                        <td className="py-3.5 px-4 max-w-xl font-sans text-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {row.pathSteps.map((step, idx) => (
                              <React.Fragment key={idx}>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                                  <span>{step.step}:</span>
                                  <span className="text-cyan-300">{step.id}</span>
                                  <span
                                    className={`font-bold ${
                                      parseInt(step.prob) >= 90
                                        ? 'text-rose-400'
                                        : parseInt(step.prob) >= 80
                                        ? 'text-amber-400'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    ({step.prob})
                                  </span>
                                </span>
                                {idx < row.pathSteps.length - 1 && (
                                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </td>

                        {/* 路径节点数 */}
                        <td className="py-3.5 px-4 text-center font-bold text-white whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {row.nodeCount}
                          </span>
                        </td>

                        {/* 定界定位路径图 (点击查看) */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap font-sans">
                          <button
                            onClick={() => setActiveDemarcPathItem(row)}
                            className="text-sky-400 hover:text-sky-300 hover:underline cursor-pointer font-medium"
                          >
                            点击查看
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================================
              路径图高保真弹窗 (当点击「点击查看」时展示路径拓扑推演图)
             =================================================== */}
          {activeDemarcPathItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-sky-400 rounded-full"></div>
                    <h3 className="font-bold text-white text-base font-sans">
                      定界定位路径因果推演图谱
                    </h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-cyan-300 font-mono">
                      {activeDemarcPathItem.resourceCategory} - {activeDemarcPathItem.resourceName} ({activeDemarcPathItem.resourceId})
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveDemarcPathItem(null)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>
                      综合定位概率：
                      <strong className="text-rose-400 text-sm ml-1">
                        {activeDemarcPathItem.prob}
                      </strong>
                    </span>
                    <span>链路节点数：{activeDemarcPathItem.pathSteps.length} 个节点</span>
                  </div>

                  {/* 路径拓扑节点图 */}
                  <div className="py-6 flex flex-col md:flex-row items-center justify-center gap-3 overflow-x-auto">
                    {activeDemarcPathItem.pathSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900 border border-slate-700/80 min-w-[150px] shadow-lg">
                          <span className="text-[10px] text-slate-400 font-mono">Step #{idx + 1}</span>
                          <span className="font-bold text-white text-xs mt-1 font-sans">{step.step}</span>
                          <span className="text-[11px] text-cyan-300 font-mono mt-0.5">{step.id}</span>
                          <span
                            className={`mt-2 px-2 py-0.5 rounded text-[11px] font-bold ${
                              parseInt(step.prob) >= 90
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : parseInt(step.prob) >= 80
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            }`}
                          >
                            置信度 {step.prob}
                          </span>
                        </div>
                        {idx < activeDemarcPathItem.pathSteps.length - 1 && (
                          <div className="flex flex-col items-center text-slate-500 my-2 md:my-0">
                            <span className="text-[10px] text-slate-500 font-mono">因果传导</span>
                            <ArrowRight className="w-5 h-5 text-sky-400 animate-pulse hidden md:block" />
                            <ChevronDown className="w-5 h-5 text-sky-400 animate-pulse md:hidden" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-lg text-xs font-mono text-slate-400">
                    <span className="text-slate-500">完整因果传播链：</span>
                    <span className="text-slate-200">{activeDemarcPathItem.pathInfo}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveDemarcPathItem(null);
                      handleTabChange('root_cause_analysis');
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-sans font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>跳转根因分析</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveDemarcPathItem(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-sans transition-colors cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 6: 故障根因分析 (根据原型与最新规范深度升级：搜索筛选 + 根因结论组合 + 核心主节点卡片 + 拓扑与时序双模态 + 穿透列表)
         ======================================================== */}
      {subTab === 'root_cause_analysis' && (
        <div className="space-y-6">
          {/* ===================================================
              模块一: 顶部筛选栏与视图控制器 (严格对齐原型全部搜索字段)
              设备类型： | 告警标题 | IP地址 | 日志标题 | 事件标题 | 查询 | 重置 | 拓扑/时序切换 | 展示完整根因拓扑
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-6 bg-gradient-to-b from-rose-500 to-amber-500 rounded-full"></div>
                <h2 className="text-base font-bold text-white tracking-wide font-sans flex items-center gap-2">
                  <span>故障根因分析</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                    AI多模态因果推演引擎
                  </span>
                </h2>
              </div>

              {/* 模式切换与工具按钮 */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-sans">
                <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                  <button
                    onClick={() => setRcaGraphMode('topology')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      rcaGraphMode === 'topology'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>故障因果拓扑图</span>
                  </button>
                  <button
                    onClick={() => setRcaGraphMode('timeline')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      rcaGraphMode === 'timeline'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>故障因果时序图</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowFullRcaTopologyModal(true)}
                  className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>展示完整根因拓扑</span>
                </button>
              </div>
            </div>

            {/* 检索字段表单 (对齐原型：设备类型、告警标题、IP地址、日志标题、事件标题) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
              {/* 设备类型 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">设备类型：</label>
                <select
                  value={rcaDeviceTypeFilter}
                  onChange={(e) => setRcaDeviceTypeFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="全部">全部设备类型</option>
                  <option value="分布式存储节点">分布式存储节点</option>
                  <option value="虚拟宿主机">虚拟计算宿主机</option>
                  <option value="骨干网关">骨干网关</option>
                  <option value="交换机">数据中心交换机</option>
                  <option value="服务器">服务器 / 数据库节点</option>
                  <option value="动环监控">动环监控设备</option>
                </select>
              </div>

              {/* 告警标题 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">告警标题：</label>
                <div className="relative">
                  <input
                    type="text"
                    value={rcaAlarmTitleFilter}
                    onChange={(e) => setRcaAlarmTitleFilter(e.target.value)}
                    placeholder="输入告警标题关键词..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-7 text-white outline-none focus:border-sky-500 font-mono text-xs"
                  />
                  {rcaAlarmTitleFilter && (
                    <button
                      onClick={() => setRcaAlarmTitleFilter('')}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* IP地址 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">IP地址：</label>
                <div className="relative">
                  <input
                    type="text"
                    value={rcaIpFilter}
                    onChange={(e) => setRcaIpFilter(e.target.value)}
                    placeholder="例如：220.10.51.15..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-7 text-white outline-none focus:border-sky-500 font-mono text-xs"
                  />
                  {rcaIpFilter && (
                    <button
                      onClick={() => setRcaIpFilter('')}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 日志标题 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">日志标题：</label>
                <div className="relative">
                  <input
                    type="text"
                    value={rcaLogTitleFilter}
                    onChange={(e) => setRcaLogTitleFilter(e.target.value)}
                    placeholder="输入日志关键词..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-7 text-white outline-none focus:border-sky-500 font-mono text-xs"
                  />
                  {rcaLogTitleFilter && (
                    <button
                      onClick={() => setRcaLogTitleFilter('')}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 事件标题 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">事件标题：</label>
                <div className="relative">
                  <input
                    type="text"
                    value={rcaEventTitleFilter}
                    onChange={(e) => setRcaEventTitleFilter(e.target.value)}
                    placeholder="输入变更/事件关键词..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-7 text-white outline-none focus:border-sky-500 font-mono text-xs"
                  />
                  {rcaEventTitleFilter && (
                    <button
                      onClick={() => setRcaEventTitleFilter('')}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮组 */}
            <div className="flex justify-end items-center gap-2.5 pt-1">
              <button
                onClick={() => showToast('已按照多维搜索条件完成根因聚合匹配')}
                className="px-5 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl font-medium text-xs shadow-md shadow-sky-900/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>查询</span>
              </button>
              <button
                onClick={() => {
                  setRcaDeviceTypeFilter('全部');
                  setRcaAlarmTitleFilter('');
                  setRcaIpFilter('');
                  setRcaLogTitleFilter('');
                  setRcaEventTitleFilter('');
                  showToast('检索条件已重置');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* ===================================================
              模块二: 根因分析结论组合 (多组候选根因结论，时间近期降序，置信度排序)
              排序 | 根因组合 | 根因概率 | 实体构成: 告警、事件、日志、节点数
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  根因分析结论组合
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>综合置信度区间：58% ~ 88%</span>
                <span>主根因判定周期：近期 15:40:00</span>
              </div>
            </div>

            {/* 组合卡片与列表 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 左侧：当前选中的主根因聚焦看板 */}
              <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-rose-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="space-y-3.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      TOP #{rcaCombos[selectedRcaComboIndex].seq} 推荐组合
                    </span>
                    <span className="text-2xl font-black text-rose-400 font-mono tracking-tight flex items-baseline gap-1">
                      {rcaCombos[selectedRcaComboIndex].prob}
                      <span className="text-xs text-rose-300/80 font-normal">根因概率</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-relaxed font-sans">
                    {rcaCombos[selectedRcaComboIndex].name}
                  </h4>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>发生时间：</span>
                      <strong className="text-cyan-400">{rcaCombos[selectedRcaComboIndex].time}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>归属设备：</span>
                      <span className="text-slate-200">{rcaCombos[selectedRcaComboIndex].deviceType}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>定位IP：</span>
                      <span className="text-cyan-300 font-bold">{rcaCombos[selectedRcaComboIndex].ip}</span>
                    </div>
                  </div>

                  {/* 实体构成 */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                      <div className="text-slate-400 text-[10px]">告警</div>
                      <div className="text-amber-400 font-bold text-sm mt-0.5">
                        {rcaCombos[selectedRcaComboIndex].counts.alarms}
                      </div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                      <div className="text-slate-400 text-[10px]">事件</div>
                      <div className="text-cyan-400 font-bold text-sm mt-0.5">
                        {rcaCombos[selectedRcaComboIndex].counts.events}
                      </div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                      <div className="text-slate-400 text-[10px]">日志</div>
                      <div className="text-emerald-400 font-bold text-sm mt-0.5">
                        {rcaCombos[selectedRcaComboIndex].counts.logs}
                      </div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                      <div className="text-slate-400 text-[10px]">节点数</div>
                      <div className="text-white font-bold text-sm mt-0.5">
                        {rcaCombos[selectedRcaComboIndex].counts.totalNodes}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
                  <div className="text-xs text-slate-400 font-sans">
                    <span className="text-amber-300 font-medium">推荐处置：</span>
                    <span>{rcaCombos[selectedRcaComboIndex].actionPlan}</span>
                  </div>
                  <button
                    onClick={() =>
                      showToast(`已成功下发推荐自愈预案：${rcaCombos[selectedRcaComboIndex].actionPlan}`)
                    }
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>一键下发自愈预案</span>
                  </button>
                </div>
              </div>

              {/* 右侧：5 组结论组合表格 (对齐原型：排序 | 根因组合 | 根因概率 | 实体构成) */}
              <div className="lg:col-span-8 overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                      <th className="py-3 px-3 text-center">排序</th>
                      <th className="py-3 px-3">发生时间</th>
                      <th className="py-3 px-3">根因组合推演结论</th>
                      <th className="py-3 px-3">根因概率</th>
                      <th className="py-3 px-3">实体构成 (告警/事件/日志)</th>
                      <th className="py-3 px-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {rcaCombos.map((combo, idx) => (
                      <tr
                        key={combo.seq}
                        onClick={() => setSelectedRcaComboIndex(idx)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          selectedRcaComboIndex === idx ? 'bg-sky-500/10 border-l-2 border-sky-400' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`w-5 h-5 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                              idx === 0
                                ? 'bg-rose-500 text-white'
                                : idx === 1
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {combo.seq}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-sky-400 font-bold">
                          {combo.time}
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <div className="font-bold text-white">{combo.name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{combo.deviceType}</span>
                            <span className="text-slate-600">|</span>
                            <span className="text-cyan-400 font-mono">{combo.ip}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-bold">
                          <span
                            className={
                              combo.probVal >= 80
                                ? 'text-rose-400'
                                : combo.probVal >= 70
                                ? 'text-amber-400'
                                : 'text-yellow-400'
                            }
                          >
                            {combo.prob}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                              告警 {combo.counts.alarms}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                              事件 {combo.counts.events}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                              日志 {combo.counts.logs}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap font-sans">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRcaComboIndex(idx);
                              showToast(`已激活组合 #${combo.seq}，关联拓扑与列表已联动`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                              selectedRcaComboIndex === idx
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {selectedRcaComboIndex === idx ? '当前激活' : '切换推演'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ===================================================
              模块三: 核心主节点卡片 (对齐原型全字段：告警 / 日志 / 事件 三合一高光卡片)
              产生时间： | 告警级别/日志级别 | 告警来源/事件来源 | 归属设备类型 | IP地址 | 标题 | 正文
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  核心根因关联主节点穿透详情
                </h3>
              </div>

              {/* 三大卡片切换标签 */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-sans">
                <button
                  onClick={() => setRcaPrimaryCardTab('alarm')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    rcaPrimaryCardTab === 'alarm'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>主告警节点 (88%)</span>
                </button>
                <button
                  onClick={() => setRcaPrimaryCardTab('log')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    rcaPrimaryCardTab === 'log'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>根因征兆日志 (85%)</span>
                </button>
                <button
                  onClick={() => setRcaPrimaryCardTab('event')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    rcaPrimaryCardTab === 'event'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>诱发源头变更事件 (92%)</span>
                </button>
              </div>
            </div>

            {/* 卡片详情容器 (根据选中 Tab 渲染原型所有字段标题与全新近期数据) */}
            {rcaPrimaryCardTab === 'alarm' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800/90 p-5 space-y-4 font-mono text-xs shadow-inner">
                {/* 顶部标题与标签 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-xs">
                      {rcaPrimaryCards.alarm.level}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                      {rcaPrimaryCards.alarm.source}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-xs">
                      {rcaPrimaryCards.alarm.majorCategory}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    产生时间：<strong className="text-sky-400">{rcaPrimaryCards.alarm.occurTime}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 font-sans">告警标题：</div>
                  <div className="text-white font-sans font-bold text-sm">
                    {rcaPrimaryCards.alarm.title}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 font-sans">告警正文：</div>
                  <div className="text-slate-300 font-sans leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {rcaPrimaryCards.alarm.body}
                  </div>
                </div>

                {/* 设备与网元元数据 (对齐原型全部字段) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500">归属设备类型：</span>
                    <div className="text-slate-200 mt-1 font-sans">{rcaPrimaryCards.alarm.deviceType}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">设备名称：</span>
                    <div className="text-cyan-400 mt-1 font-bold">{rcaPrimaryCards.alarm.deviceName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">IP地址：</span>
                    <div className="text-cyan-400 mt-1 font-bold">{rcaPrimaryCards.alarm.ip}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">序列号：</span>
                    <div className="text-slate-300 mt-1">{rcaPrimaryCards.alarm.sn}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">系统来源：</span>
                    <div className="text-slate-200 mt-1 font-sans">{rcaPrimaryCards.alarm.systemSource}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">资源池：</span>
                    <div className="text-slate-300 mt-1 font-sans">{rcaPrimaryCards.alarm.resourcePool}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">POD池：</span>
                    <div className="text-slate-300 mt-1 font-sans">{rcaPrimaryCards.alarm.pod}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">厂家名称：</span>
                    <div className="text-slate-200 mt-1 font-sans">{rcaPrimaryCards.alarm.vendor}</div>
                  </div>
                </div>
              </div>
            )}

            {rcaPrimaryCardTab === 'log' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800/90 p-5 space-y-4 font-mono text-xs shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-xs">
                      {rcaPrimaryCards.log.level}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs">
                      {rcaPrimaryCards.log.tag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    产生时间：<strong className="text-sky-400">{rcaPrimaryCards.log.occurTime}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 font-sans">日志标题：</div>
                  <div className="text-white font-sans font-bold text-sm">
                    {rcaPrimaryCards.log.title}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 font-sans">日志正文：</div>
                  <div className="text-emerald-300 font-mono leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                    {rcaPrimaryCards.log.body}
                  </div>
                </div>

                {/* 服务、程序、设备元数据 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500">服务：</span>
                    <div className="text-cyan-400 mt-1 font-bold">{rcaPrimaryCards.log.service}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">程序：</span>
                    <div className="text-cyan-300 mt-1 font-bold">{rcaPrimaryCards.log.program}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">归属设备类型：</span>
                    <div className="text-slate-200 mt-1 font-sans">{rcaPrimaryCards.log.deviceType}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">IP地址：</span>
                    <div className="text-cyan-400 mt-1 font-bold">{rcaPrimaryCards.log.ip}</div>
                  </div>
                </div>
              </div>
            )}

            {rcaPrimaryCardTab === 'event' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800/90 p-5 space-y-4 font-mono text-xs shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-600 text-white font-bold text-xs">
                      {rcaPrimaryCards.event.source}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-sans text-xs">
                      {rcaPrimaryCards.event.eventType}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    产生时间：<strong className="text-sky-400">{rcaPrimaryCards.event.occurTime}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 font-sans">事件标题：</div>
                  <div className="text-white font-sans font-bold text-sm">
                    {rcaPrimaryCards.event.title}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 font-sans">事件正文 / 审计详情：</div>
                  <div className="text-slate-300 font-sans leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {rcaPrimaryCards.event.body}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500">事件来源：</span>
                    <div className="text-slate-200 mt-1 font-sans">{rcaPrimaryCards.event.source}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">事件类型：</span>
                    <div className="text-cyan-300 mt-1 font-sans">{rcaPrimaryCards.event.eventType}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">归属设备类型：</span>
                    <div className="text-slate-200 mt-1 font-sans">{rcaPrimaryCards.event.deviceType}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">IP地址：</span>
                    <div className="text-cyan-400 mt-1 font-bold">{rcaPrimaryCards.event.ip}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              模块四: 因果图谱与时序多模态呈现 (拓扑图 vs 时序图)
              含 #主要告警光影效果#、#根因光影效果#、节点查询、节点数、告警数、事件数、日志数
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  {rcaGraphMode === 'topology' ? '故障因果关系拓扑图' : '故障因果关系时序图'}
                </h3>
              </div>

              {/* 统计指标与节点快速检索 */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans">节点查询：</span>
                  <input
                    type="text"
                    value={rcaNodeQuery}
                    onChange={(e) => setRcaNodeQuery(e.target.value)}
                    placeholder="输入节点名称..."
                    className="bg-transparent text-white outline-none w-28 text-xs font-mono placeholder:text-slate-600"
                  />
                  {rcaNodeQuery && (
                    <button
                      onClick={() => setRcaNodeQuery('')}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800">节点数：6</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    告警：4
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    事件：2
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    日志：3
                  </span>
                </div>
              </div>
            </div>

            {/* 模式 A: 故障因果关系拓扑图 */}
            {rcaGraphMode === 'topology' && (
              <div className="relative bg-slate-950 rounded-2xl border border-slate-800/90 p-6 overflow-hidden">
                {/* 拓扑网格底纹与科技微光 */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.3) 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                ></div>

                {/* 图例 */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-6 font-sans relative z-10">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20 animate-pulse"></span>
                      <span className="text-rose-300">#根因光影效果# (诱发源头)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20 animate-pulse"></span>
                      <span className="text-purple-300">#主要告警光影效果# (承载核心)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                      <span>次级传播告警/日志</span>
                    </span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    因果箭头标注为 Bayesian 贝叶斯因果传播置信度
                  </div>
                </div>

                {/* 拓扑节点与因果连线示意 */}
                <div className="relative py-8 px-4 flex flex-col md:flex-row items-center justify-around gap-6 z-10 min-h-[260px]">
                  {rcaTopolNodes
                    .filter((n) =>
                      rcaNodeQuery
                        ? n.name.includes(rcaNodeQuery) || n.id.includes(rcaNodeQuery)
                        : true
                    )
                    .map((node) => (
                      <div
                        key={node.id}
                        onClick={() => setSelectedRcaNode(node)}
                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center min-w-[150px] shadow-xl ${
                          node.glow === 'cause'
                            ? 'bg-slate-900 border-rose-500/60 shadow-rose-950/40 ring-4 ring-rose-500/10'
                            : node.glow === 'main'
                            ? 'bg-slate-900 border-purple-500/60 shadow-purple-950/40 ring-4 ring-purple-500/10'
                            : 'bg-slate-900/90 border-slate-700 hover:border-sky-500'
                        } ${selectedRcaNode?.id === node.id ? 'ring-2 ring-cyan-400' : ''}`}
                      >
                        {/* 顶部标签 */}
                        <div className="flex items-center gap-1 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              node.type === 'event'
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : node.type === 'log'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {node.role}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">({node.id})</span>
                        </div>

                        {/* 节点图标 */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-inner ${
                            node.glow === 'cause'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : node.glow === 'main'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                              : 'bg-slate-800 text-sky-400 border border-slate-700'
                          }`}
                        >
                          {node.type === 'event' ? (
                            <Activity className="w-6 h-6" />
                          ) : node.type === 'log' ? (
                            <FileText className="w-6 h-6" />
                          ) : (
                            <AlertTriangle className="w-6 h-6" />
                          )}
                        </div>

                        {/* 节点名称 */}
                        <span className="font-bold text-white text-xs font-sans group-hover:text-cyan-300 transition-colors">
                          {node.name}
                        </span>

                        {/* 发生时间 (近期降序) */}
                        <span className="text-[10px] text-slate-400 font-mono mt-1">{node.time}</span>

                        <span className="text-[10px] text-cyan-400 font-mono mt-0.5">{node.ip}</span>
                      </div>
                    ))}
                </div>

                {/* 选中的节点详情抽屉/卡片 */}
                {selectedRcaNode && (
                  <div className="mt-4 p-4 bg-slate-900 border border-cyan-500/40 rounded-xl relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-sans">
                          {selectedRcaNode.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 font-mono">
                          {selectedRcaNode.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono">
                          {selectedRcaNode.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-sans">{selectedRcaNode.detail}</div>
                      <div className="text-xs text-slate-400 font-mono flex items-center gap-4 pt-1">
                        <span>发生时间：{selectedRcaNode.time}</span>
                        <span>设备网元：{selectedRcaNode.device}</span>
                        <span>IP：{selectedRcaNode.ip}</span>
                        <span>来源：{selectedRcaNode.source}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRcaNode(null)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      关闭详情
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 模式 B: 故障因果关系时序图 (三轨道纵深瀑布流，严格按近期时间倒序排列，含根因发生区间光影) */}
            {rcaGraphMode === 'timeline' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800/90 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white font-sans">三轨道时序瀑布流</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      发生时序严格降序
                    </span>
                  </div>

                  {/* 根因发生区间高光指示 */}
                  <div className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span>根因发生区间：2026-10-16 15:34:00 ~ 15:40:00</span>
                  </div>
                </div>

                {/* 时序图内容流 */}
                <div className="space-y-3 font-mono text-xs">
                  {rcaTimelineWaterfall.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                        item.isRootInterval
                          ? 'bg-rose-500/5 border-rose-500/30 shadow-md'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                      }`}
                    >
                      {/* 时间与轨道标识 */}
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <span className="text-sky-400 font-bold whitespace-nowrap">{item.time}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.track === 'alarm'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.track === 'log'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {item.track === 'alarm' ? '告警' : item.track === 'log' ? '日志' : '事件'}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] ${
                            item.level === '重大'
                              ? 'bg-rose-600 text-white font-bold'
                              : item.level === '高级'
                              ? 'bg-amber-500 text-white font-bold'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.level}
                        </span>
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 font-sans">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.glow === 'main' && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/40">
                              #主要告警光影#
                            </span>
                          )}
                          {item.glow === 'cause' && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/40">
                              #根因光影#
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">{item.content}</div>
                      </div>

                      {/* 归属网元 */}
                      <div className="text-slate-400 text-right text-xs whitespace-nowrap font-mono">
                        {item.entity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              模块五: 穿透详情列表 (支持告警、事件、日志三合一穿透，对齐原型全部 14 个字段，时间近期降序，内容全新)
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  因果节点穿透详情列表
                </h3>
              </div>

              {/* 三大穿透标签页切换 */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-sans">
                <button
                  onClick={() => setRcaPenetrateTab('alarm')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    rcaPenetrateTab === 'alarm'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>故障/告警详情列表 ({rcaDetailAlarmList.length})</span>
                </button>
                <button
                  onClick={() => setRcaPenetrateTab('event')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    rcaPenetrateTab === 'event'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>事件详情列表 ({rcaDetailEventList.length})</span>
                </button>
                <button
                  onClick={() => setRcaPenetrateTab('log')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    rcaPenetrateTab === 'log'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>日志详情列表 ({rcaDetailLogList.length})</span>
                </button>
              </div>
            </div>

            {/* TAB 1: 故障/告警详情列表 (对齐原型表头 14 个字段，时间近期降序，内容全新)
                序号 | 发生时间 | 告警级别 | 设备名称 | 设备类型 | 系统来源 | 一级专业分类 | 告警标题 | 告警正文 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称 */}
            {rcaPenetrateTab === 'alarm' && (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                      <th className="py-3 px-3 text-center">序号</th>
                      <th className="py-3 px-3">发生时间</th>
                      <th className="py-3 px-3">告警级别</th>
                      <th className="py-3 px-3">设备名称</th>
                      <th className="py-3 px-3">设备类型</th>
                      <th className="py-3 px-3">系统来源</th>
                      <th className="py-3 px-3">一级专业分类</th>
                      <th className="py-3 px-3">告警标题</th>
                      <th className="py-3 px-3">告警正文</th>
                      <th className="py-3 px-3">IP地址</th>
                      <th className="py-3 px-3">序列号</th>
                      <th className="py-3 px-3">资源池</th>
                      <th className="py-3 px-3">POD池</th>
                      <th className="py-3 px-3">厂家名称</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {rcaDetailAlarmList.map((row) => (
                      <tr
                        key={row.seq}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          row.level === '重大' ? 'bg-rose-500/5' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center text-slate-400 font-bold">{row.seq}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-sky-400 font-bold">
                          {row.occurTime}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              row.level === '重大'
                                ? 'bg-rose-500 text-white'
                                : row.level === '高级'
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {row.level}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans font-bold text-white">
                          {row.deviceName}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">{row.deviceType}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-cyan-300">
                          {row.systemSource}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.majorCategory}
                        </td>
                        <td className="py-3 px-3 font-sans font-bold text-white max-w-xs truncate">
                          {row.alarmTitle}
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-300 max-w-md truncate">
                          {row.alarmBody}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-cyan-400">{row.ip}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-400">{row.sn}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.resourcePool}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.pod}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-300">
                          {row.vendor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: 事件详情列表 (对齐原型表头 13 个字段，时间近期降序，内容全新)
                序号 | 时间 | 事件来源 | 事件类型 | 事件标题 | 事件内容 | 网元名称 | 设备类型 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称 */}
            {rcaPenetrateTab === 'event' && (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                      <th className="py-3 px-3 text-center">序号</th>
                      <th className="py-3 px-3">时间</th>
                      <th className="py-3 px-3">事件来源</th>
                      <th className="py-3 px-3">事件类型</th>
                      <th className="py-3 px-3">事件标题</th>
                      <th className="py-3 px-3">事件内容</th>
                      <th className="py-3 px-3">网元名称</th>
                      <th className="py-3 px-3">设备类型</th>
                      <th className="py-3 px-3">IP地址</th>
                      <th className="py-3 px-3">序列号</th>
                      <th className="py-3 px-3">资源池</th>
                      <th className="py-3 px-3">POD池</th>
                      <th className="py-3 px-3">厂家名称</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {rcaDetailEventList.map((row) => (
                      <tr key={row.seq} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-center text-slate-400 font-bold">{row.seq}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-sky-400 font-bold">{row.time}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-cyan-300 font-bold">
                          {row.source}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-amber-300">
                          {row.type}
                        </td>
                        <td className="py-3 px-3 font-sans font-bold text-white max-w-xs truncate">
                          {row.title}
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-300 max-w-md truncate">
                          {row.content}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans font-bold text-white">
                          {row.netElementName}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">{row.deviceType}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-cyan-400">{row.ip}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-400">{row.sn}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.resourcePool}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.pod}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-300">
                          {row.vendor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: 日志详情列表 (对齐原型表头 14 个字段，时间近期降序，内容全新)
                序号 | 产生时间 | 类别 | 服务 | 程序 | 重要级别 | 标签 | 日志正文 | 网元名称 | 设备类型 | IP地址 | 序列号 | 资源池 | POD池 | 厂家名称 */}
            {rcaPenetrateTab === 'log' && (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                      <th className="py-3 px-3 text-center">序号</th>
                      <th className="py-3 px-3">产生时间</th>
                      <th className="py-3 px-3">类别</th>
                      <th className="py-3 px-3">服务</th>
                      <th className="py-3 px-3">程序</th>
                      <th className="py-3 px-3">重要级别</th>
                      <th className="py-3 px-3">标签</th>
                      <th className="py-3 px-3">日志正文</th>
                      <th className="py-3 px-3">网元名称</th>
                      <th className="py-3 px-3">设备类型</th>
                      <th className="py-3 px-3">IP地址</th>
                      <th className="py-3 px-3">序列号</th>
                      <th className="py-3 px-3">资源池</th>
                      <th className="py-3 px-3">POD池</th>
                      <th className="py-3 px-3">厂家名称</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {rcaDetailLogList.map((row) => (
                      <tr key={row.seq} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-center text-slate-400 font-bold">{row.seq}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-sky-400 font-bold">
                          {row.occurTime}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-cyan-300">
                          {row.category}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans font-bold text-white">
                          {row.service}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-mono text-cyan-400">
                          {row.program}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              row.level === '高级'
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {row.level}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-amber-300 font-bold">
                          {row.tag}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300 max-w-md truncate">
                          {row.logBody}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans font-bold text-white">
                          {row.netElementName}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">{row.deviceType}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-cyan-400">{row.ip}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-400">{row.sn}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.resourcePool}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.pod}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-300">
                          {row.vendor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ===================================================
              大图谱推演弹窗 (点击「展示完整根因拓扑」弹出)
             =================================================== */}
          {showFullRcaTopologyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                    <h3 className="font-bold text-white text-base font-sans">
                      全景故障因果拓扑推演图谱
                    </h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-300 font-mono">
                      深度：5级因果传导 | 置信度：88%
                    </span>
                  </div>
                  <button
                    onClick={() => setShowFullRcaTopologyModal(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>
                      推荐根因主节点：
                      <strong className="text-rose-400 ml-1">
                        HOST-HUCHI-3355 (分布式块存储 pool-0428)
                      </strong>
                    </span>
                    <span>因果边置信度范围：82% ~ 94%</span>
                  </div>

                  {/* 全景拓扑交互图谱 */}
                  <div className="py-6 flex flex-col md:flex-row items-center justify-center gap-4 overflow-x-auto">
                    {rcaTopolNodes.map((node, idx) => (
                      <React.Fragment key={node.id}>
                        <div
                          className={`flex flex-col items-center p-4 rounded-xl border min-w-[145px] shadow-lg ${
                            node.glow === 'cause'
                              ? 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/20'
                              : node.glow === 'main'
                              ? 'bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/20'
                              : 'bg-slate-900 border-slate-700'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 font-mono">Step #{idx + 1}</span>
                          <span className="font-bold text-white text-xs mt-1 font-sans">{node.name}</span>
                          <span className="text-[11px] text-cyan-300 font-mono mt-0.5">{node.id}</span>
                          <span
                            className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                              node.glow === 'cause'
                                ? 'bg-rose-500/20 text-rose-300'
                                : node.glow === 'main'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {node.role}
                          </span>
                        </div>
                        {idx < rcaTopolNodes.length - 1 && (
                          <div className="flex flex-col items-center text-slate-500">
                            <span className="text-[9px] text-cyan-400 font-mono">
                              {rcaTopolEdges[idx]?.prob || '85%'}
                            </span>
                            <ArrowRight className="w-4 h-4 text-sky-400 animate-pulse hidden md:block" />
                            <ChevronDown className="w-4 h-4 text-sky-400 animate-pulse md:hidden" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-lg text-xs font-mono text-slate-400">
                    <span className="text-slate-500">因果拓扑推演判定结论：</span>
                    <span className="text-slate-200">
                      系统审计发现 15:35:10 的 CMDB 内核参数调优变更诱发了 nvme_core 驱动等待队列拥塞超时，进而引发 15:40:00 分布式存储 pool-0428 写入延迟超标与控制器反压，随后级联导致 CPU Core #3 软中断持续 100% 打满与网卡 RingBuffer 丢包。
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowFullRcaTopologyModal(false);
                      showToast('已导出高保真故障根因推演分析报告 (PDF/JSON)');
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-sans font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>导出根因分析报告</span>
                  </button>
                  <button
                    onClick={() => setShowFullRcaTopologyModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-sans transition-colors cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 7: 故障根因分析(表格) (根据最新截图四大模块完整实现，时间近期且降序排列)
         ======================================================== */}
      {subTab === 'root_cause_table' && (
        <div className="space-y-6">
          {/* ===================================================
              模块一: 主告警基本信息 (对齐截图1第一区域)
              左侧红色高光边框 | 重大 | 网管中心 | 性能告警 | 告警标题 | 告警正文摘要 | 告警时间 (近期时间)
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  主告警基本信息
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-400">
                <span>告警时间：</span>
                <strong className="text-rose-400 font-bold ml-1">{rcaTableMainAlarm.alarmTime}</strong>
              </div>
            </div>

            {/* 告警内容卡片：左侧红色提示柱 + 标签组 + 标题正文 */}
            <div className="mt-4 bg-slate-950 rounded-xl border border-slate-800/90 p-5 flex flex-col md:flex-row items-start gap-4">
              {/* 左侧醒目指示柱 */}
              <div className="w-1.5 self-stretch bg-rose-500 rounded-full shrink-0 shadow-lg shadow-rose-500/50 hidden md:block"></div>

              <div className="flex-1 space-y-3 font-sans">
                {/* 徽章体系 (严格对齐截图：重大 | 网管中心 | 性能告警) */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded font-bold bg-rose-500 text-white shadow-sm">
                    {rcaTableMainAlarm.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {rcaTableMainAlarm.systemSource}
                  </span>
                  <span className="px-2.5 py-0.5 rounded font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {rcaTableMainAlarm.alarmType}
                  </span>
                </div>

                {/* 告警标题与摘要 */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs shrink-0 font-medium">告警标题：</span>
                    <h4 className="text-white font-bold text-sm leading-snug">
                      {rcaTableMainAlarm.title}
                    </h4>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 text-xs shrink-0 font-medium pt-0.5">告警正文摘要：</span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {rcaTableMainAlarm.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              模块二: 主告警设备信息 (严格对齐截图1第二区域6个字段)
              cicode | 设备类型 | 设备名称 | 资源池 | POD | 网元IP
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  主告警设备信息
                </h3>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800/90 p-5 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs font-mono">
              <div>
                <span className="text-sky-400 font-medium">cicode：</span>
                <span className="text-slate-200 ml-1 font-bold">{rcaTableDevice.cicode}</span>
              </div>
              <div>
                <span className="text-sky-400 font-medium">设备类型：</span>
                <span className="text-slate-200 ml-1 font-sans">{rcaTableDevice.deviceType}</span>
              </div>
              <div>
                <span className="text-sky-400 font-medium">设备名称：</span>
                <span className="text-white ml-1 font-bold font-sans">{rcaTableDevice.deviceName}</span>
              </div>
              <div>
                <span className="text-sky-400 font-medium">资源池：</span>
                <span className="text-slate-300 ml-1 font-sans">{rcaTableDevice.resourcePool}</span>
              </div>
              <div>
                <span className="text-sky-400 font-medium">POD：</span>
                <span className="text-slate-300 ml-1 font-sans">{rcaTableDevice.pod}</span>
              </div>
              <div>
                <span className="text-sky-400 font-medium">网元IP：</span>
                <span className="text-cyan-400 ml-1 font-bold">{rcaTableDevice.netElementIp}</span>
              </div>
            </div>
          </div>

          {/* ===================================================
              模块三: 根因分析结论列表 (严格对齐截图1第三区域)
              序号 | 根因概率 (可排序) | 根因来源 | 根因描述 | 根因分析路径信息 | 路径节点数 | 根因关联关系图
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  根因分析结论列表
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>时空推演分析结论：5条候选</span>
                <span>置信度门限：≥ 50%</span>
              </div>
            </div>

            {/* 根因结论表格 */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                    <th className="py-3 px-3 text-center">序号</th>
                    <th className="py-3 px-3">发生时间</th>
                    <th
                      onClick={() => setRcaTableSortDesc(!rcaTableSortDesc)}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>根因概率</span>
                        <span className="text-[10px] text-sky-400">
                          {rcaTableSortDesc ? '▼' : '▲'}
                        </span>
                      </div>
                    </th>
                    <th className="py-3 px-3">根因来源</th>
                    <th className="py-3 px-3">根因描述</th>
                    <th className="py-3 px-3">根因分析路径信息</th>
                    <th className="py-3 px-3 text-center">路径节点数</th>
                    <th className="py-3 px-3 text-center">根因关联关系图</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {[...rcaTableConclusionList]
                    .sort((a, b) =>
                      rcaTableSortDesc ? b.probVal - a.probVal : a.probVal - b.probVal
                    )
                    .map((row) => (
                      <tr
                        key={row.seq}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          row.probVal >= 90 ? 'bg-rose-500/5' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center text-slate-400 font-bold">{row.seq}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-sky-400 font-bold">
                          {row.occurTime}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-sm ${
                                row.probVal >= 90
                                  ? 'text-rose-400'
                                  : row.probVal >= 80
                                  ? 'text-amber-400'
                                  : row.probVal >= 70
                                  ? 'text-yellow-400'
                                  : 'text-slate-300'
                              }`}
                            >
                              {row.prob}
                            </span>
                            <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  row.probVal >= 90
                                    ? 'bg-rose-500'
                                    : row.probVal >= 80
                                    ? 'bg-amber-400'
                                    : row.probVal >= 70
                                    ? 'bg-yellow-400'
                                    : 'bg-sky-400'
                                }`}
                                style={{ width: `${row.probVal}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans font-bold text-cyan-300">
                          {row.source}
                        </td>
                        <td className="py-3 px-3 font-sans font-bold text-white max-w-xs">
                          {row.desc}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap items-center gap-1.5 py-1">
                            {row.pathSteps.map((step, idx) => (
                              <React.Fragment key={idx}>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-[11px]">
                                  <span className="text-white font-sans">{step.name}</span>
                                  <span className="text-cyan-300 font-bold font-mono">
                                    ({step.conf})
                                  </span>
                                </span>
                                {idx < row.pathSteps.length - 1 && (
                                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                            {row.nodeCount}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap font-sans">
                          <button
                            onClick={() => setActiveRcaPathModalItem(row)}
                            className="text-sky-400 hover:text-sky-300 hover:underline cursor-pointer font-medium"
                          >
                            点击查看
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================================
              模块四: 主告警关联信息列表 (严格对齐截图2与截图3四大选项卡与全量字段)
              选项卡: 告警 | 日志 | 事件 | 时序图
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  主告警关联信息列表
                </h3>
              </div>

              {/* 四大选项卡 (完全对齐截图2左上角：告警 | 日志 | 事件 | 时序图) */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-sans">
                <button
                  onClick={() => setRcaRelTab('alarm')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    rcaRelTab === 'alarm'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  告警
                </button>
                <button
                  onClick={() => setRcaRelTab('log')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    rcaRelTab === 'log'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  日志
                </button>
                <button
                  onClick={() => setRcaRelTab('event')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    rcaRelTab === 'event'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  事件
                </button>
                <button
                  onClick={() => setRcaRelTab('timeline')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    rcaRelTab === 'timeline'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  时序图
                </button>
              </div>
            </div>

            {/* TAB 1: 告警 (完全对齐截图2与截图3表头 13 个字段，发生时间近期且降序排列)
                告警ID | 发生时间 | 告警级别 | 告警类型 | 告警标题 | 告警正文 | 设备类型 | 业务系统名称 | 采集资源ID | ciCode | 网元IP | 资源池 | POD */}
            {rcaRelTab === 'alarm' && (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                      <th className="py-3.5 px-3">告警ID</th>
                      <th className="py-3.5 px-3">发生时间</th>
                      <th className="py-3.5 px-3">告警级别</th>
                      <th className="py-3.5 px-3">告警类型</th>
                      <th className="py-3.5 px-3">告警标题</th>
                      <th className="py-3.5 px-3">告警正文</th>
                      <th className="py-3.5 px-3">设备类型</th>
                      <th className="py-3.5 px-3">业务系统名称</th>
                      <th className="py-3.5 px-3">采集资源ID</th>
                      <th className="py-3.5 px-3">ciCode</th>
                      <th className="py-3.5 px-3">网元IP</th>
                      <th className="py-3.5 px-3">资源池</th>
                      <th className="py-3.5 px-3">POD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {rcaTableRelAlarmList.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          row.level === '重大' ? 'bg-rose-500/5' : ''
                        }`}
                      >
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-sky-400">{row.id}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-cyan-400 font-bold">
                          {row.occurTime}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-xs ${
                              row.level === '重大'
                                ? 'bg-rose-600 text-white'
                                : row.level === '高'
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {row.level}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-amber-300">
                          {row.type}
                        </td>
                        <td className="py-3 px-3 font-sans font-bold text-white max-w-xs truncate">
                          {row.title}
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-300 max-w-md truncate">
                          {row.body}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">{row.deviceType}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-emerald-300">
                          {row.businessSystem}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-300">{row.resourceId}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-400">{row.ciCode}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-cyan-400 font-bold">
                          {row.netElementIp}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.resourcePool}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.pod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: 日志 (对齐日志关联信息全量字段，产生时间近期且降序)
                日志ID | 产生时间 | 日志级别 | 服务 | 程序 | 日志标题 | 日志正文 | 设备类型 | 业务系统名称 | 采集资源ID | ciCode | 网元IP | 资源池 | POD */}
            {rcaRelTab === 'log' && (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                      <th className="py-3.5 px-3">日志ID</th>
                      <th className="py-3.5 px-3">产生时间</th>
                      <th className="py-3.5 px-3">日志级别</th>
                      <th className="py-3.5 px-3">服务</th>
                      <th className="py-3.5 px-3">程序</th>
                      <th className="py-3.5 px-3">日志标题</th>
                      <th className="py-3.5 px-3">日志正文</th>
                      <th className="py-3.5 px-3">设备类型</th>
                      <th className="py-3.5 px-3">业务系统名称</th>
                      <th className="py-3.5 px-3">采集资源ID</th>
                      <th className="py-3.5 px-3">ciCode</th>
                      <th className="py-3.5 px-3">网元IP</th>
                      <th className="py-3.5 px-3">资源池</th>
                      <th className="py-3.5 px-3">POD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {rcaTableRelLogList.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-sky-400">{row.id}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-cyan-400 font-bold">
                          {row.occurTime}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-xs ${
                              row.level === '高级'
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {row.level}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans font-bold text-white">
                          {row.service}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-cyan-300">{row.program}</td>
                        <td className="py-3 px-3 font-sans font-bold text-white max-w-xs truncate">
                          {row.title}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300 max-w-md truncate">
                          {row.body}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">{row.deviceType}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-emerald-300">
                          {row.businessSystem}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-300">{row.resourceId}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-400">{row.ciCode}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-cyan-400 font-bold">
                          {row.netElementIp}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.resourcePool}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.pod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: 事件 (对齐事件关联信息全量字段，时间近期且降序)
                事件ID | 时间 | 事件来源 | 事件类型 | 事件标题 | 事件内容 | 设备类型 | 业务系统名称 | ciCode | 网元IP | 资源池 | POD */}
            {rcaRelTab === 'event' && (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
                <table className="w-full text-left border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 whitespace-nowrap">
                      <th className="py-3.5 px-3">事件ID</th>
                      <th className="py-3.5 px-3">时间</th>
                      <th className="py-3.5 px-3">事件来源</th>
                      <th className="py-3.5 px-3">事件类型</th>
                      <th className="py-3.5 px-3">事件标题</th>
                      <th className="py-3.5 px-3">事件内容</th>
                      <th className="py-3.5 px-3">设备类型</th>
                      <th className="py-3.5 px-3">业务系统名称</th>
                      <th className="py-3.5 px-3">ciCode</th>
                      <th className="py-3.5 px-3">网元IP</th>
                      <th className="py-3.5 px-3">资源池</th>
                      <th className="py-3.5 px-3">POD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {rcaTableRelEventList.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-sky-400">{row.id}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-cyan-400 font-bold">
                          {row.occurTime}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans font-bold text-cyan-300">
                          {row.source}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-amber-300">
                          {row.type}
                        </td>
                        <td className="py-3 px-3 font-sans font-bold text-white max-w-xs truncate">
                          {row.title}
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-300 max-w-md truncate">
                          {row.content}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans">{row.deviceType}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-emerald-300">
                          {row.businessSystem}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-400">{row.ciCode}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-cyan-400 font-bold">
                          {row.netElementIp}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.resourcePool}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-sans text-slate-400">
                          {row.pod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: 时序图 (高保真关联时序因果瀑布流，时间严格降序) */}
            {rcaRelTab === 'timeline' && (
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>主告警与关联因果链时序瀑布流</span>
                  <span className="text-rose-400">时序区间：2026-10-16 15:40:00 ~ 14:50:00 (降序排列)</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {[
                    {
                      time: '2026-10-16 15:40:00',
                      track: '告警',
                      level: '重大',
                      title: '主告警：分布式块存储 pool-0428 写入延迟超标与控制器反压',
                      entity: 'HOST-HUCHI-3355 (220.10.51.15)',
                      glow: true,
                    },
                    {
                      time: '2026-10-16 15:38:22',
                      track: '日志',
                      level: '高级',
                      title: '关联日志：nvme_controller_timeout_abort: CID 0x3a4f wait completion timeout > 30s',
                      entity: 'nvme_core (SN-46567)',
                      glow: true,
                    },
                    {
                      time: '2026-10-16 15:37:12',
                      track: '告警',
                      level: '高',
                      title: '关联告警：存储专用 ToR 交换机端口 PFC 流控拥塞降速',
                      entity: 'SW-TOR-LEAF02 (220.10.51.2)',
                    },
                    {
                      time: '2026-10-16 15:35:10',
                      track: '事件',
                      level: '变更',
                      title: '诱发事件：CMDB 分布式存储底层 sysctl 动态调优热更新',
                      entity: 'CMDB工单 (HOST-HUCHI-3355)',
                      glow: true,
                    },
                    {
                      time: '2026-10-16 15:30:15',
                      track: '告警',
                      level: '低',
                      title: '关联告警：机房 02-Rack08 供电相位微电流抖动瞬态预警',
                      entity: 'PDU-POWER-DC02 (192.168.100.12)',
                    },
                    {
                      time: '2026-10-16 15:20:00',
                      track: '事件',
                      level: '重启',
                      title: '前置事件：存储前端网关代理 proxy-ingress 优雅重启',
                      entity: 'POD-INGRESS-01 (10.244.18.88)',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                        item.glow
                          ? 'bg-rose-500/5 border-rose-500/30 shadow-md'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-[230px]">
                        <span className="text-sky-400 font-bold">{item.time}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.track === '告警'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.track === '日志'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {item.track}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                          {item.level}
                        </span>
                      </div>
                      <div className="flex-1 font-sans text-white font-medium">
                        {item.title}
                      </div>
                      <div className="text-slate-400 text-right text-xs whitespace-nowrap">
                        {item.entity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              路径图高保真弹窗 (当点击「点击查看」时展示根因推演路径图谱)
             =================================================== */}
          {activeRcaPathModalItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                    <h3 className="font-bold text-white text-base font-sans">
                      根因分析因果推演图谱
                    </h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-cyan-300 font-mono">
                      {activeRcaPathModalItem.source} - {activeRcaPathModalItem.desc}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveRcaPathModalItem(null)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>
                      综合判定置信度：
                      <strong className="text-rose-400 text-sm ml-1">
                        {activeRcaPathModalItem.prob}
                      </strong>
                    </span>
                    <span>推演节点数：{activeRcaPathModalItem.nodeCount} 个因果节点</span>
                  </div>

                  {/* 路径节点 */}
                  <div className="py-6 flex flex-col md:flex-row items-center justify-center gap-3 overflow-x-auto">
                    {activeRcaPathModalItem.pathSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900 border border-slate-700/80 min-w-[150px] shadow-lg">
                          <span className="text-[10px] text-slate-400 font-mono">Step #{idx + 1}</span>
                          <span className="font-bold text-white text-xs mt-1 font-sans">{step.name}</span>
                          <span className="text-[11px] text-cyan-300 font-mono mt-0.5">{step.role}</span>
                          <span
                            className={`mt-2 px-2 py-0.5 rounded text-[11px] font-bold ${
                              parseInt(step.conf) >= 90
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : parseInt(step.conf) >= 80
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            }`}
                          >
                            置信度 {step.conf}
                          </span>
                        </div>
                        {idx < activeRcaPathModalItem.pathSteps.length - 1 && (
                          <div className="flex flex-col items-center text-slate-500 my-2 md:my-0">
                            <span className="text-[10px] text-slate-500 font-mono">因果传导</span>
                            <ArrowRight className="w-5 h-5 text-rose-400 animate-pulse hidden md:block" />
                            <ChevronDown className="w-5 h-5 text-rose-400 animate-pulse md:hidden" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-lg text-xs font-mono text-slate-400">
                    <span className="text-slate-500">完整因果传播路径：</span>
                    <span className="text-slate-200">{activeRcaPathModalItem.pathInfo}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveRcaPathModalItem(null);
                      handleTabChange('root_cause_analysis');
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-sans font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>跳转根因全景拓扑</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveRcaPathModalItem(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-sans transition-colors cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 8: 根因规则库 - 通用根因规则 (根据最新截图与全量要求深度升级：时间近期严格降序、数据全新、样式超越截图)
         ======================================================== */}
      {subTab === 'rule_base' && (
        <div className="space-y-6">
          {/* 可撤销操作浮动 Toast 栏 (支持删除/停用/启用 5秒内撤销) */}
          {ruleUndoToast && (
            <div className="flex items-center justify-between p-3.5 px-5 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-sans shadow-2xl backdrop-blur-md animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="font-medium">{ruleUndoToast.message}</span>
                <span className="text-amber-400/80 font-mono text-[11px]">（5秒内可撤销此变更）</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUndo}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>点击撤销</span>
                </button>
                <button
                  onClick={() => setRuleUndoToast(null)}
                  className="text-amber-400 hover:text-white p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ===================================================
              模块一: 检索筛选表单区 (严格对齐截图两行式筛选系统，科技微光面板)
              行1: 因节点资源名称 | 果节点资源名称 | 置信度 | 审核人 | 审核时间范围 | 查询 | 重置 | 收起/展开
              行2: 因节点资源类别 | 果节点资源类别 | 果节点资源属性 | 因节点资源属性 | 因果关系 | 规则来源 | 规则状态 | 审核状态
             =================================================== */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-sky-400 via-cyan-400 to-indigo-500 rounded-full shadow-sm shadow-sky-500/50"></div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-white tracking-wide font-sans flex items-center gap-2">
                    <span>根因规则库</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 font-mono font-medium">
                      通用根因规则引擎
                    </span>
                  </h2>
                </div>
              </div>

              {/* 顶部指标胶囊卡片 */}
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">规则活跃率:</span>
                  <span className="text-emerald-400 font-bold">95.8%</span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">库容推导规则数:</span>
                  <span className="text-sky-400 font-bold">{sortedAndFilteredRuleList.length} 条</span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">最近推导更新:</span>
                  <span className="text-cyan-300 font-bold font-mono">16:45:12</span>
                </div>
              </div>
            </div>

            {/* 第一行筛选表单 (文本输入与时间范围) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
              {/* 因节点资源名称 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1 font-sans">
                  因节点资源名称：
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ruleSearchCauseName}
                    onChange={(e) => setRuleSearchCauseName(e.target.value)}
                    placeholder="请输入因节点名称关键词"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-mono text-xs placeholder:text-slate-600 transition-colors"
                  />
                  {ruleSearchCauseName && (
                    <button
                      onClick={() => setRuleSearchCauseName('')}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 果节点资源名称 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1 font-sans">
                  果节点资源名称：
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ruleSearchEffectName}
                    onChange={(e) => setRuleSearchEffectName(e.target.value)}
                    placeholder="请输入果节点名称关键词"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-mono text-xs placeholder:text-slate-600 transition-colors"
                  />
                  {ruleSearchEffectName && (
                    <button
                      onClick={() => setRuleSearchEffectName('')}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 置信度 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1 font-sans">置信度：</label>
                <div className="relative">
                  <input
                    type="text"
                    value={ruleSearchConfidence}
                    onChange={(e) => setRuleSearchConfidence(e.target.value)}
                    placeholder="例如 ≥0.90"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-mono text-xs placeholder:text-slate-600 transition-colors"
                  />
                  {ruleSearchConfidence && (
                    <button
                      onClick={() => setRuleSearchConfidence('')}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 审核人 */}
              <div>
                <label className="block text-slate-400 font-medium mb-1 font-sans">审核人：</label>
                <div className="relative">
                  <input
                    type="text"
                    value={ruleSearchAuditor}
                    onChange={(e) => setRuleSearchAuditor(e.target.value)}
                    placeholder="请输入审核人员姓名"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-mono text-xs placeholder:text-slate-600 transition-colors"
                  />
                  {ruleSearchAuditor && (
                    <button
                      onClick={() => setRuleSearchAuditor('')}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 审核时间范围 */}
              <div className="lg:col-span-2">
                <label className="block text-slate-400 font-medium mb-1 font-sans">审核时间范围：</label>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={ruleSearchAuditStartTime}
                      onChange={(e) => setRuleSearchAuditStartTime(e.target.value)}
                      placeholder="2026-10-16 00:00:00"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-mono text-xs placeholder:text-slate-600"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                  <span className="text-slate-500 font-mono">至</span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={ruleSearchAuditEndTime}
                      onChange={(e) => setRuleSearchAuditEndTime(e.target.value)}
                      placeholder="2026-10-16 23:59:59"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-mono text-xs placeholder:text-slate-600"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 第二行高级下拉筛选 (可由「收起/展开」动态折叠) */}
            {ruleFilterExpanded && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2 text-xs animate-in fade-in">
                {/* 因节点资源类别 */}
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-sans">因节点资源类别</label>
                  <select
                    value={ruleCauseTypeFilter}
                    onChange={(e) => setRuleCauseTypeFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="全部">全部类别</option>
                    <option value="高性能计算宿主机">高性能计算宿主机</option>
                    <option value="核心认证鉴权服务">核心认证鉴权服务</option>
                    <option value="NVMe全闪存储阵列">NVMe全闪存储阵列</option>
                    <option value="分布式AI算力集群">分布式AI算力集群</option>
                    <option value="操作系统内核">操作系统内核</option>
                    <option value="Kubernetes控制面">Kubernetes控制面</option>
                    <option value="边缘节点网关">边缘节点网关</option>
                    <option value="自动化运维编排平台">自动化运维编排平台</option>
                    <option value="边界BGP出口路由器">边界BGP出口路由器</option>
                    <option value="供电UPS冗余配电柜">供电UPS冗余配电柜</option>
                  </select>
                </div>

                {/* 果节点资源类别 */}
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-sans">果节点资源类别</label>
                  <select
                    value={ruleEffectTypeFilter}
                    onChange={(e) => setRuleEffectTypeFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="全部">全部类别</option>
                    <option value="分布式图数据库">分布式图数据库</option>
                    <option value="Kubernetes微服务网关">Kubernetes微服务网关</option>
                    <option value="云原生对象存储">云原生对象存储</option>
                    <option value="数据中心ToR交换机">数据中心ToR交换机</option>
                    <option value="核心消息队列中间件">核心消息队列中间件</option>
                    <option value="容器服务网格控制面">容器服务网格控制面</option>
                    <option value="智能时序监控引擎">智能时序监控引擎</option>
                    <option value="分布式关系型数据库">分布式关系型数据库</option>
                    <option value="边缘CDN加速节点">边缘CDN加速节点</option>
                    <option value="基础设施动环机房">基础设施动环机房</option>
                  </select>
                </div>

                {/* 果节点资源属性 */}
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-sans">果节点资源属性</label>
                  <select
                    value={ruleEffectAttrFilter}
                    onChange={(e) => setRuleEffectAttrFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="全部">全部属性</option>
                    <option value="告警">告警</option>
                    <option value="指标">指标</option>
                    <option value="日志">日志</option>
                    <option value="事件">事件</option>
                  </select>
                </div>

                {/* 因节点资源属性 */}
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-sans">因节点资源属性</label>
                  <select
                    value={ruleCauseAttrFilter}
                    onChange={(e) => setRuleCauseAttrFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="全部">全部属性</option>
                    <option value="告警">告警</option>
                    <option value="日志">日志</option>
                    <option value="事件">事件</option>
                    <option value="指标">指标</option>
                  </select>
                </div>

                {/* 因果关系 */}
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-sans">因果关系</label>
                  <select
                    value={ruleRelationFilter}
                    onChange={(e) => setRuleRelationFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="全部">全部关系</option>
                    <option value="强因果">强因果</option>
                    <option value="包含">包含</option>
                    <option value="属于">属于</option>
                    <option value="同一集群">同一集群</option>
                    <option value="级联因果">级联因果</option>
                  </select>
                </div>

                {/* 规则来源 */}
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-sans">规则来源</label>
                  <select
                    value={ruleSourceFilter}
                    onChange={(e) => setRuleSourceFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="全部">全部来源</option>
                    <option value="多模态因果图挖掘">多模态因果图挖掘</option>
                    <option value="AI挖掘">AI挖掘</option>
                    <option value="算法自动挖掘">算法自动挖掘</option>
                    <option value="专家经验规则">专家经验规则</option>
                    <option value="人工配置">人工配置</option>
                  </select>
                </div>

                {/* 规则状态 */}
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-sans">规则状态</label>
                  <select
                    value={ruleStatusFilter}
                    onChange={(e) => setRuleStatusFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="全部">全部状态</option>
                    <option value="启用">启用</option>
                    <option value="停用">停用</option>
                    <option value="未启用">未启用</option>
                  </select>
                </div>

                {/* 审核状态 */}
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-sans">审核状态</label>
                  <select
                    value={ruleAuditStatusFilter}
                    onChange={(e) => setRuleAuditStatusFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="全部">全部审核状态</option>
                    <option value="已通过">已通过</option>
                    <option value="待审核">待审核</option>
                    <option value="已驳回">已驳回</option>
                  </select>
                </div>
              </div>
            )}

            {/* 检索操作与收起/展开按钮 */}
            <div className="flex justify-end items-center gap-3 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => showToast(`已检索到 ${sortedAndFilteredRuleList.length} 条符合条件的因果规则`)}
                className="px-5 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-xl font-medium text-xs shadow-md shadow-sky-900/40 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>查询</span>
              </button>
              <button
                onClick={() => {
                  setRuleSearchCauseName('');
                  setRuleSearchEffectName('');
                  setRuleSearchConfidence('');
                  setRuleSearchAuditor('');
                  setRuleSearchAuditStartTime('');
                  setRuleSearchAuditEndTime('');
                  setRuleCauseTypeFilter('全部');
                  setRuleEffectTypeFilter('全部');
                  setRuleEffectAttrFilter('全部');
                  setRuleCauseAttrFilter('全部');
                  setRuleRelationFilter('全部');
                  setRuleSourceFilter('全部');
                  setRuleStatusFilter('全部');
                  setRuleAuditStatusFilter('全部');
                  showToast('规则筛选条件已全部重置');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
              <button
                onClick={() => setRuleFilterExpanded(!ruleFilterExpanded)}
                className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-sans cursor-pointer ml-1 select-none"
              >
                <span>{ruleFilterExpanded ? '收起筛选' : '展开多维筛选'}</span>
                {ruleFilterExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* ===================================================
              模块二: 根因规则列表操作栏与选项卡
              ▶ 根因规则列表 | 显示规则拓扑 | [通用根因规则] [个性根因规则] | [新增] [更新] [删除] [停用] [启用] [:]
              已选择 X 项 清空
             =================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 backdrop-blur-md">
            <div className="border-b border-slate-800/80 pb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                  <h3 className="text-base font-bold text-white tracking-wide font-sans">
                    根因规则列表
                  </h3>
                </div>

                {/* 显示规则拓扑 按钮 */}
                <button
                  onClick={() => setShowRuleTopologyModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-cyan-950/40 hover:scale-[1.02]"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>显示规则拓扑</span>
                </button>

                {/* 活跃排序指示条 */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                  <span>排序:</span>
                  <span className="text-sky-400 font-bold">
                    {ruleSortField === 'updateTime' && '最近更新时间'}
                    {ruleSortField === 'auditTime' && '审核时间'}
                    {ruleSortField === 'confidence' && '置信度'}
                    {ruleSortField === 'seq' && '序号'}
                  </span>
                  <span className="text-cyan-300 font-bold">
                    ({ruleSortOrder === 'desc' ? '降序 ↓' : '升序 ↑'})
                  </span>
                </div>
              </div>

              {/* 选项卡 + 操作按钮组 */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 选项卡：通用根因规则 vs 个性根因规则 (对齐截图左侧tab) */}
                <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs font-sans">
                  <button
                    onClick={() => {
                      setRuleActiveTab('universal');
                      showToast('已切换至 通用根因规则 列表');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      ruleActiveTab === 'universal'
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold shadow-md shadow-sky-900/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    通用根因规则
                  </button>
                  <button
                    onClick={() => {
                      setRuleActiveTab('custom');
                      showToast('已切换至 个性根因规则 列表');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      ruleActiveTab === 'custom'
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold shadow-md shadow-sky-900/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    个性根因规则
                  </button>
                </div>

                {/* 右侧主按钮组：新增 / 更新 / 删除 / 停用 / 启用 / 更多 */}
                <div className="flex items-center gap-2 text-xs font-sans">
                  <button
                    onClick={() => setShowAddRuleModal(true)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all shadow-md shadow-sky-900/30 cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('已成功刷新规则集与图谱因果权重，全部数据保持最新！');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>更新</span>
                  </button>
                  <button
                    onClick={() => {
                      if (selectedRuleIds.length === 0) {
                        showToast('请先勾选需要删除的根因规则');
                        return;
                      }
                      triggerUndoableAction('delete', `【根因规则库】所选 ${selectedRuleIds.length} 项规则已经被删除`, () => {
                        setRuleBaseList((prev) => prev.filter((r) => !selectedRuleIds.includes(r.id)));
                        setSelectedRuleIds([]);
                      });
                      showToast(`已删除所选 ${selectedRuleIds.length} 项规则，5秒内可撤销`);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>删除</span>
                  </button>
                  <button
                    onClick={() => {
                      if (selectedRuleIds.length === 0) {
                        showToast('请先勾选需要停用的规则');
                        return;
                      }
                      triggerUndoableAction('status_change', `所选 ${selectedRuleIds.length} 项规则已被停用`, () => {
                        setRuleBaseList((prev) =>
                          prev.map((r) =>
                            selectedRuleIds.includes(r.id) ? { ...r, ruleStatus: '停用' } : r
                          )
                        );
                      });
                      showToast(`已停用选中的 ${selectedRuleIds.length} 项规则，5秒内可撤销`);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-amber-900/60 text-slate-300 hover:text-amber-300 rounded-xl transition-colors cursor-pointer"
                  >
                    停用
                  </button>
                  <button
                    onClick={() => {
                      if (selectedRuleIds.length === 0) {
                        showToast('请先勾选需要启用的规则');
                        return;
                      }
                      triggerUndoableAction('status_change', `所选 ${selectedRuleIds.length} 项规则已被启用`, () => {
                        setRuleBaseList((prev) =>
                          prev.map((r) =>
                            selectedRuleIds.includes(r.id) ? { ...r, ruleStatus: '启用' } : r
                          )
                        );
                      });
                      showToast(`已启用选中的 ${selectedRuleIds.length} 项规则，5秒内可撤销`);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-900/60 text-slate-300 hover:text-emerald-300 rounded-xl transition-colors cursor-pointer"
                  >
                    启用
                  </button>

                  {/* 更多操作下拉 */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRuleMoreMenu(!showRuleMoreMenu)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {showRuleMoreMenu && (
                      <div className="absolute right-0 top-full mt-1.5 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-20 space-y-1 text-xs">
                        <button
                          onClick={() => {
                            setShowRuleMoreMenu(false);
                            showToast('已导出通用根因规则库 (全量JSON/Excel格式)');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                        >
                          批量导出规则
                        </button>
                        <button
                          onClick={() => {
                            setShowRuleMoreMenu(false);
                            showToast('请选择需要导入的标准化因果模板文件 (.xlsx)');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                        >
                          批量导入规则
                        </button>
                        <button
                          onClick={() => {
                            setShowRuleMoreMenu(false);
                            showToast('已创建规则基线版本快照 v2026.10-RC4');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                        >
                          规则历史快照
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 批量已选择条目提示栏 (严格对齐截图：已选择 1 项 清空) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-950/50 via-slate-900/60 to-slate-950 border border-sky-800/40 text-xs font-sans text-sky-300">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-sky-500/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <span>
                  已选择 <strong className="font-bold text-white font-mono text-sm">{selectedRuleIds.length}</strong> 项
                </span>
                {selectedRuleIds.length > 0 && (
                  <button
                    onClick={() => setSelectedRuleIds([])}
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer ml-3 font-medium transition-colors"
                  >
                    清空选择
                  </button>
                )}
              </div>
              <div className="text-slate-400 font-mono text-[11px] hidden sm:flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  规则因果链实时校验中
                </span>
                <span>支持点击表头自由切换升降序，默认时间严格近期倒序</span>
              </div>
            </div>

            {/* ===================================================
                模块三: 通用根因规则全量数据表格 (严格对齐截图1与截图2全部16列)
                复选框 | 序号 | 果节点资源类别 | 果节点资源名称 | 因节点资源属性 | 因节点资源类别 | 因节点资源名称 | 因果关系 | 置信度 | 规则来源 | 规则状态 | 审核状态 | 审核人员 | 审核时间 | 最近更新时间 | 更新人员
                全部采用近期时间，严格降序排列，数据全新定制
               =================================================== */}
            <div className="overflow-x-auto border border-slate-800/90 rounded-2xl bg-slate-950 text-xs shadow-inner">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-slate-300 border-b border-slate-700/80 whitespace-nowrap select-none">
                    {/* 复选框 */}
                    <th className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedRuleIds.length === sortedAndFilteredRuleList.length &&
                          sortedAndFilteredRuleList.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRuleIds(sortedAndFilteredRuleList.map((r) => r.id));
                          } else {
                            setSelectedRuleIds([]);
                          }
                        }}
                        className="rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-0 cursor-pointer"
                      />
                    </th>

                    {/* 序号 */}
                    <th
                      onClick={() => {
                        if (ruleSortField === 'seq') {
                          setRuleSortOrder(ruleSortOrder === 'desc' ? 'asc' : 'desc');
                        } else {
                          setRuleSortField('seq');
                          setRuleSortOrder('asc');
                        }
                      }}
                      className="py-3.5 px-3 text-center cursor-pointer hover:text-white"
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>序号</span>
                        <ArrowUpDown className={`w-3 h-3 ${ruleSortField === 'seq' ? 'text-sky-400' : 'text-slate-600'}`} />
                      </div>
                    </th>

                    <th className="py-3.5 px-3">果节点资源类别</th>
                    <th className="py-3.5 px-3">果节点资源名称</th>
                    <th className="py-3.5 px-3">因节点资源属性</th>
                    <th className="py-3.5 px-3">因节点资源类别</th>
                    <th className="py-3.5 px-3">因节点资源名称</th>
                    <th className="py-3.5 px-3">因果关系</th>

                    {/* 置信度 (支持排序) */}
                    <th
                      onClick={() => {
                        if (ruleSortField === 'confidence') {
                          setRuleSortOrder(ruleSortOrder === 'desc' ? 'asc' : 'desc');
                        } else {
                          setRuleSortField('confidence');
                          setRuleSortOrder('desc');
                        }
                      }}
                      className="py-3.5 px-3 cursor-pointer hover:text-white"
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>置信度</span>
                        <ArrowUpDown className={`w-3 h-3 ${ruleSortField === 'confidence' ? 'text-emerald-400' : 'text-slate-600'}`} />
                      </div>
                    </th>

                    <th className="py-3.5 px-3">规则来源</th>
                    <th className="py-3.5 px-3">规则状态</th>
                    <th className="py-3.5 px-3">审核状态</th>
                    <th className="py-3.5 px-3">审核人员</th>

                    {/* 审核时间 (支持排序) */}
                    <th
                      onClick={() => {
                        if (ruleSortField === 'auditTime') {
                          setRuleSortOrder(ruleSortOrder === 'desc' ? 'asc' : 'desc');
                        } else {
                          setRuleSortField('auditTime');
                          setRuleSortOrder('desc');
                        }
                      }}
                      className="py-3.5 px-3 cursor-pointer hover:text-white"
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>审核时间</span>
                        <ArrowUpDown className={`w-3 h-3 ${ruleSortField === 'auditTime' ? 'text-sky-400' : 'text-slate-600'}`} />
                      </div>
                    </th>

                    {/* 最近更新时间 (默认降序排序列) */}
                    <th
                      onClick={() => {
                        if (ruleSortField === 'updateTime') {
                          setRuleSortOrder(ruleSortOrder === 'desc' ? 'asc' : 'desc');
                        } else {
                          setRuleSortField('updateTime');
                          setRuleSortOrder('desc');
                        }
                      }}
                      className="py-3.5 px-3 cursor-pointer hover:text-white"
                    >
                      <div className="inline-flex items-center gap-1 text-cyan-300">
                        <span>最近更新时间</span>
                        <ArrowUpDown className={`w-3.5 h-3.5 ${ruleSortField === 'updateTime' ? 'text-cyan-400' : 'text-slate-600'}`} />
                        {ruleSortField === 'updateTime' && (
                          <span className="text-[10px] font-bold text-cyan-400">
                            {ruleSortOrder === 'desc' ? '↓' : '↑'}
                          </span>
                        )}
                      </div>
                    </th>

                    <th className="py-3.5 px-3">更新人员</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {sortedAndFilteredRuleList.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="py-12 text-center text-slate-500 font-sans">
                        <div className="flex flex-col items-center gap-2">
                          <Filter className="w-8 h-8 text-slate-600" />
                          <span>未找到匹配当前筛选条件的因果规则</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedAndFilteredRuleList.map((rule) => {
                      const isSelected = selectedRuleIds.includes(rule.id);
                      const isExpanded = expandedRuleRowIds.includes(rule.id);
                      return (
                        <React.Fragment key={rule.id}>
                          <tr
                            className={`hover:bg-slate-800/50 transition-colors ${
                              isSelected ? 'bg-sky-950/25 border-l-2 border-l-sky-500' : ''
                            }`}
                          >
                            {/* 复选框 */}
                            <td className="py-3.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRuleIds([...selectedRuleIds, rule.id]);
                                  } else {
                                    setSelectedRuleIds(
                                      selectedRuleIds.filter((id) => id !== rule.id)
                                    );
                                  }
                                }}
                                className="rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-0 cursor-pointer"
                              />
                            </td>

                            {/* 序号 (点击行折叠展开小箭头) */}
                            <td className="py-3.5 px-3 text-center whitespace-nowrap">
                              <button
                                onClick={() => {
                                  if (isExpanded) {
                                    setExpandedRuleRowIds(
                                      expandedRuleRowIds.filter((id) => id !== rule.id)
                                    );
                                  } else {
                                    setExpandedRuleRowIds([...expandedRuleRowIds, rule.id]);
                                  }
                                }}
                                className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer font-bold transition-transform"
                              >
                                <span className={`text-[10px] text-sky-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                  ▶
                                </span>
                                <span>{rule.seq}</span>
                              </button>
                            </td>

                            {/* 果节点资源类别 */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans font-bold text-white">
                              {rule.effectType}
                            </td>

                            {/* 果节点资源名称 */}
                            <td className="py-3.5 px-3 font-sans text-cyan-300 font-medium max-w-xs truncate" title={rule.effectName}>
                              {rule.effectName}
                            </td>

                            {/* 因节点资源属性 (告警/日志/事件/指标) */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  rule.causeAttr === '告警'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : rule.causeAttr === '日志'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : rule.causeAttr === '事件'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {rule.causeAttr}
                              </span>
                            </td>

                            {/* 因节点资源类别 */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans text-slate-300">
                              {rule.causeType}
                            </td>

                            {/* 因节点资源名称 */}
                            <td className="py-3.5 px-3 font-sans text-slate-100 max-w-xs truncate" title={rule.causeName}>
                              {rule.causeName}
                            </td>

                            {/* 因果关系 */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30 text-[11px] font-medium">
                                {rule.relation}
                              </span>
                            </td>

                            {/* 置信度 */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold text-xs ${
                                    rule.confidenceVal >= 0.95
                                      ? 'text-emerald-400'
                                      : rule.confidenceVal >= 0.9
                                      ? 'text-sky-400'
                                      : 'text-amber-400'
                                  }`}
                                >
                                  {rule.confidence}
                                </span>
                                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                  <div
                                    className={`h-full rounded-full ${
                                      rule.confidenceVal >= 0.95
                                        ? 'bg-emerald-400'
                                        : rule.confidenceVal >= 0.9
                                        ? 'bg-sky-400'
                                        : 'bg-amber-400'
                                    }`}
                                    style={{ width: `${rule.confidenceVal * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* 规则来源 */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans text-slate-300">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
                                {rule.source}
                              </span>
                            </td>

                            {/* 规则状态 (启用/停用/未启用) */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans">
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[11px] inline-flex items-center gap-1 ${
                                  rule.ruleStatus === '启用'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : rule.ruleStatus === '停用'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {rule.ruleStatus === '启用' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                )}
                                <span>{rule.ruleStatus}</span>
                              </span>
                            </td>

                            {/* 审核状态 (已通过/待审核/已驳回) */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans">
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                                  rule.auditStatus === '已通过'
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                    : rule.auditStatus === '待审核'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {rule.auditStatus}
                              </span>
                            </td>

                            {/* 审核人员 */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans text-slate-300">
                              {rule.auditor}
                            </td>

                            {/* 审核时间 (近期降序) */}
                            <td className="py-3.5 px-3 whitespace-nowrap text-sky-400 font-medium">
                              {rule.auditTime}
                            </td>

                            {/* 最近更新时间 (近期降序高亮) */}
                            <td className="py-3.5 px-3 whitespace-nowrap text-cyan-300 font-bold bg-cyan-950/20">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                                <span>{rule.updateTime}</span>
                              </div>
                            </td>

                            {/* 更新人员 */}
                            <td className="py-3.5 px-3 whitespace-nowrap font-sans text-slate-300">
                              {rule.updater}
                            </td>
                          </tr>

                          {/* 展开的详情说明卡片 (包含原型截图中的果节点资源ID、IP与因节点资源ID、IP) */}
                          {isExpanded && (
                            <tr className="bg-slate-900/70 border-b border-slate-800/90">
                              <td colSpan={16} className="p-4 px-6 text-xs font-sans">
                                <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 shadow-lg space-y-3">
                                  {/* 卡片头部与资源属性条 */}
                                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                      <span className="font-bold text-white text-xs font-sans">
                                        规则 #{rule.seq} 详细特征与设备资源映射表
                                      </span>
                                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                        资源池: {rule.pool}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-[11px] text-emerald-400 font-mono">
                                        历史自动化校验: {rule.verifiedCount} 次无误
                                      </span>
                                      <button
                                        onClick={() => setShowRuleTopologyModal(true)}
                                        className="px-2.5 py-1 bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                                      >
                                        拓扑高亮此规则
                                      </button>
                                    </div>
                                  </div>

                                  {/* 原型截图对应4大关键设备信息字段 (果节点资源ID、IP / 因节点资源ID、IP) */}
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                                      <span className="text-[11px] text-slate-500 block">果节点资源ID</span>
                                      <span className="text-cyan-300 font-bold text-xs">{rule.effectId}</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                                      <span className="text-[11px] text-slate-500 block">果节点资源IP</span>
                                      <span className="text-cyan-300 font-bold text-xs">{rule.effectIp}</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                                      <span className="text-[11px] text-slate-500 block">因节点资源ID</span>
                                      <span className="text-amber-300 font-bold text-xs">{rule.causeId}</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                                      <span className="text-[11px] text-slate-500 block">因节点资源IP</span>
                                      <span className="text-amber-300 font-bold text-xs">{rule.causeIp}</span>
                                    </div>
                                  </div>

                                  {/* 因果机理推演说明 */}
                                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/80 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sky-400 font-bold font-sans">
                                        机理传导推演逻辑：
                                      </span>
                                      <span className="text-slate-200">{rule.detailDesc}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-4 pt-1">
                                      <span>推导算法：<strong className="text-slate-300">{rule.algorithm}</strong></span>
                                      <span>·</span>
                                      <span>判定滑动窗口：<strong className="text-slate-300">5分钟聚合窗口</strong></span>
                                      <span>·</span>
                                      <span>规则模式：<strong className="text-emerald-400">实时自动注入AIOps诊断引擎</strong></span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================================
              弹窗 1: 规则拓扑因果关系图谱弹窗 (点击「显示规则拓扑」唤出)
             =================================================== */}
          {showRuleTopologyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-sky-400 to-cyan-500 rounded-full"></div>
                    <h3 className="font-bold text-white text-base font-sans">
                      通用根因规则因果网络拓扑图谱 (DAG)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded text-xs bg-slate-800 text-cyan-300 font-mono">
                      活跃规则节点：{sortedAndFilteredRuleList.length} 条 | 因果传导边：12条
                    </span>
                  </div>
                  <button
                    onClick={() => setShowRuleTopologyModal(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>拓扑布局方式：贝叶斯概率因果网络 (因节点 → 果节点传导)</span>
                    <span className="text-emerald-400">平均规则置信度：95.8% (高精度模式)</span>
                  </div>

                  {/* 规则因果链可视化流动展示 */}
                  <div className="py-6 flex flex-col md:flex-row items-center justify-around gap-4 overflow-x-auto">
                    {sortedAndFilteredRuleList.slice(0, 4).map((rule, idx) => (
                      <React.Fragment key={rule.id}>
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 min-w-[200px] shadow-lg flex flex-col items-center text-center">
                          <span className="text-[10px] text-slate-400 font-mono">
                            因节点 #{rule.seq} ({rule.causeAttr})
                          </span>
                          <span className="font-bold text-white text-xs mt-1 font-sans line-clamp-2">
                            {rule.causeName}
                          </span>
                          <span className="text-[11px] text-cyan-300 font-mono mt-0.5">
                            {rule.causeType}
                          </span>
                          <span className="mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {rule.relation}
                          </span>
                          <ArrowRight className="w-4 h-4 text-sky-400 my-1 animate-pulse" />
                          <span className="font-bold text-emerald-300 text-xs font-sans line-clamp-2">
                            {rule.effectName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                            置信度 {rule.confidence}
                          </span>
                        </div>
                        {idx < 3 && (
                          <div className="flex flex-col items-center text-slate-500">
                            <span className="text-[10px] text-sky-400 font-mono">因果传导</span>
                            <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="p-3.5 bg-slate-900/60 rounded-xl text-xs font-mono text-slate-400 border border-slate-800/80 space-y-1">
                    <div className="text-slate-300 font-bold">自愈回溯验证结论：</div>
                    <div className="text-slate-400 leading-relaxed">
                      全量通用根因规则均已通过华东与华南双核心区近 72 小时真实运维工单回测验证，误报抑制率达 99.1%，可无缝联动「故障根因分析」驾驶舱实现秒级自动定界推断。
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowRuleTopologyModal(false);
                      showToast('已成功导出规则因果拓扑图谱 (矢量SVG/高精度PNG格式)');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-xl text-xs font-sans font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>导出因果图谱</span>
                  </button>
                  <button
                    onClick={() => setShowRuleTopologyModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-sans transition-colors cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              弹窗 2: 新增通用根因规则弹窗 (点击「新增」唤出，提交后自动前置插入，时间降序)
             =================================================== */}
          {showAddRuleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-sky-400" />
                    <h3 className="font-bold text-white text-base font-sans">
                      新增通用根因分析规则
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddRuleModal(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const causeType = (form.elements.namedItem('causeType') as HTMLInputElement).value;
                    const causeAttr = (form.elements.namedItem('causeAttr') as HTMLSelectElement).value;
                    const causeName = (form.elements.namedItem('causeName') as HTMLInputElement).value || '内核调度单核心死锁';
                    const effectType = (form.elements.namedItem('effectType') as HTMLInputElement).value;
                    const effectName = (form.elements.namedItem('effectName') as HTMLInputElement).value || '微服务API响应超时超标';
                    const relation = (form.elements.namedItem('relation') as HTMLSelectElement).value;
                    const confidence = (form.elements.namedItem('confidence') as HTMLInputElement).value || '0.97';
                    const source = (form.elements.namedItem('source') as HTMLSelectElement).value;

                    const newRule = {
                      id: Date.now(),
                      seq: 1,
                      effectType,
                      effectName,
                      effectId: `SN-EFFECT-${Math.floor(Math.random() * 9000 + 1000)}`,
                      effectIp: '10.240.77.19',
                      effectAttr: '告警',
                      causeAttr,
                      causeType,
                      causeName,
                      causeId: `SN-CAUSE-${Math.floor(Math.random() * 9000 + 1000)}`,
                      causeIp: '10.240.77.82',
                      relation,
                      confidence,
                      confidenceVal: parseFloat(confidence) || 0.97,
                      source,
                      ruleStatus: '启用',
                      auditStatus: '待审核',
                      auditor: '系统安全员 (待审核)',
                      auditTime: '2026-10-16 16:48:00',
                      updateTime: '2026-10-16 16:50:00',
                      updater: '当前值班工程师',
                      detailDesc: `${causeName} 引发 ${effectName}，因果关系确立为 ${relation}。`,
                      algorithm: '人工专家配置校验',
                      pool: '生产主网区-POD01',
                      verifiedCount: 1,
                    };

                    setRuleBaseList([newRule, ...ruleBaseList.map((r) => ({ ...r, seq: r.seq + 1 }))]);
                    setShowAddRuleModal(false);
                    showToast('新增通用根因规则成功，已排入列表首位（最新时间）！');
                  }}
                  className="space-y-3.5 text-xs font-sans"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">因节点资源类别：</label>
                      <input
                        name="causeType"
                        type="text"
                        defaultValue="高性能计算宿主机"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">因节点资源属性：</label>
                      <select name="causeAttr" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono">
                        <option>告警</option>
                        <option>日志</option>
                        <option>事件</option>
                        <option>指标</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">因节点资源名称：</label>
                    <input
                      name="causeName"
                      type="text"
                      placeholder="例如：CPU Core #1 软中断单核打满100%..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">果节点资源类别：</label>
                      <input
                        name="effectType"
                        type="text"
                        defaultValue="分布式图数据库"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">因果关系：</label>
                      <select name="relation" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono">
                        <option>强因果</option>
                        <option>包含</option>
                        <option>属于</option>
                        <option>同一集群</option>
                        <option>级联因果</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">果节点资源名称：</label>
                    <input
                      name="effectName"
                      type="text"
                      placeholder="例如：NebulaGraph跨分片查询P99延时超标告警..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">置信度门限：</label>
                      <input
                        name="confidence"
                        type="text"
                        defaultValue="0.98"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">规则来源：</label>
                      <select name="source" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono">
                        <option>专家经验规则</option>
                        <option>人工配置</option>
                        <option>AI挖掘</option>
                        <option>多模态因果图挖掘</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddRuleModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-sans transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-xl text-xs font-sans font-bold transition-all shadow-md cursor-pointer"
                    >
                      提交并写入规则库
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 9: 根因规则库(简化) (完全对齐原型字段)
         ======================================================== */}
      {subTab === 'rule_base_simplified' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>根因规则库</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">根因规则列表 (简化视图)</span>
            </h2>
          </div>

          {/* 表头完全对齐: 序号 | 果节点资源类别 | 果节点描述 | 因节点资源类别 | 因节点描述 | 因果关系 | 置信度 */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-4">序号</th>
                  <th className="py-3 px-4">果节点资源类别</th>
                  <th className="py-3 px-4">果节点描述</th>
                  <th className="py-3 px-4">因节点资源类别</th>
                  <th className="py-3 px-4">因节点描述</th>
                  <th className="py-3 px-4">因果关系</th>
                  <th className="py-3 px-4">置信度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
                {ruleBaseSimpleList.map((row) => (
                  <tr key={row.seq} className="hover:bg-slate-800/40 font-mono">
                    <td className="py-3 px-4 text-slate-400">{row.seq}</td>
                    <td className="py-3 px-4 font-sans text-cyan-300 font-bold">{row.effectType}</td>
                    <td className="py-3 px-4 font-sans text-white">{row.effectDesc}</td>
                    <td className="py-3 px-4 font-sans text-indigo-300">{row.causeType}</td>
                    <td className="py-3 px-4 font-sans text-slate-300">{row.causeDesc}</td>
                    <td className="py-3 px-4 font-sans text-amber-300 font-bold">{row.relation}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{row.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
