import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Activity,
  ChevronRight,
  ChevronDown,
  Server,
  Network,
  Sliders,
  X,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Settings,
  Eye,
  FileText,
} from 'lucide-react';
import { ModelBoardView } from './ModelBoardView';

interface AlarmConfigItem {
  id: number;
  sn: string;
  regionCategory: string;
  regionCenter: string;
  resourcePool: string;
  pod: string;
  mgmtIp: string;
  deviceType: 'server' | 'edge-node' | 'switch' | 'router';
  deviceName: string;
  vendor: string;
  bizSystem: string;
  osSystem: string;
  monitoredMetricCount: number;
  alarmLevel: '重大告警' | '高级告警' | '警告告警' | '提示告警';
  cpuUpperThreshold: number;
  cpuLowerThreshold: number;
  iowaitThreshold: number;
  isEnabled: boolean;
}

const ALARM_CONFIG_DATASET: AlarmConfigItem[] = [
  {
    id: 1,
    sn: 'SN-46567',
    regionCategory: '省级IT云',
    regionCenter: '华北二',
    resourcePool: '呼池',
    pod: '呼池-虚拟015',
    mgmtIp: '220.10.51.15',
    deviceType: 'server',
    deviceName: 'PC-001',
    vendor: 'BMC',
    bizSystem: 'IT云运维中心',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 8,
    alarmLevel: '重大告警',
    cpuUpperThreshold: 85,
    cpuLowerThreshold: 15,
    iowaitThreshold: 30,
    isEnabled: true,
  },
  {
    id: 2,
    sn: 'SN-8379952',
    regionCategory: '省级IT云',
    regionCenter: '华北三',
    resourcePool: '京池',
    pod: '京池-虚拟023',
    mgmtIp: '220.10.52.23',
    deviceType: 'server',
    deviceName: 'PC-002',
    vendor: 'HUAWEI',
    bizSystem: '核心数据库集群',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 6,
    alarmLevel: '高级告警',
    cpuUpperThreshold: 80,
    cpuLowerThreshold: 10,
    iowaitThreshold: 25,
    isEnabled: true,
  },
  {
    id: 3,
    sn: 'SN-775589',
    regionCategory: '地市级边缘云',
    regionCenter: '华东一',
    resourcePool: '上海池',
    pod: '上海-边缘001',
    mgmtIp: '192.168.10.101',
    deviceType: 'edge-node',
    deviceName: 'Edge-01',
    vendor: 'DELL',
    bizSystem: '边缘AI音视频转码',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 5,
    alarmLevel: '警告告警',
    cpuUpperThreshold: 90,
    cpuLowerThreshold: 20,
    iowaitThreshold: 40,
    isEnabled: true,
  },
  {
    id: 4,
    sn: 'SN-912045',
    regionCategory: '省级IT云',
    regionCenter: '华南一',
    resourcePool: '深圳池',
    pod: '深圳-虚拟045',
    mgmtIp: '220.10.53.45',
    deviceType: 'server',
    deviceName: 'PC-003',
    vendor: '3COM',
    bizSystem: '高并发API网关',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 9,
    alarmLevel: '重大告警',
    cpuUpperThreshold: 88,
    cpuLowerThreshold: 12,
    iowaitThreshold: 35,
    isEnabled: true,
  },
  {
    id: 5,
    sn: 'SN-654210',
    regionCategory: '地市级边缘云',
    regionCenter: '华中一',
    resourcePool: '武汉池',
    pod: '武汉-边缘002',
    mgmtIp: '192.168.11.202',
    deviceType: 'edge-node',
    deviceName: 'Edge-02',
    vendor: 'A10',
    bizSystem: '智慧城市视频安防',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 4,
    alarmLevel: '提示告警',
    cpuUpperThreshold: 75,
    cpuLowerThreshold: 10,
    iowaitThreshold: 20,
    isEnabled: false,
  },
  {
    id: 6,
    sn: 'SN-330876',
    regionCategory: '省级IT云',
    regionCenter: '西北一',
    resourcePool: '兰州池',
    pod: '兰州-虚拟018',
    mgmtIp: '220.10.54.18',
    deviceType: 'server',
    deviceName: 'PC-004',
    vendor: 'BEA',
    bizSystem: '分布式海量数据湖',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 7,
    alarmLevel: '警告告警',
    cpuUpperThreshold: 82,
    cpuLowerThreshold: 18,
    iowaitThreshold: 28,
    isEnabled: true,
  },
  {
    id: 7,
    sn: 'SN-789123',
    regionCategory: '省级IT云',
    regionCenter: '华北一',
    resourcePool: '天津池',
    pod: '天津-虚拟030',
    mgmtIp: '220.10.55.30',
    deviceType: 'server',
    deviceName: 'PC-005',
    vendor: 'BMC',
    bizSystem: '云资源智能调度引擎',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 6,
    alarmLevel: '高级告警',
    cpuUpperThreshold: 85,
    cpuLowerThreshold: 15,
    iowaitThreshold: 30,
    isEnabled: true,
  },
  {
    id: 8,
    sn: 'SN-441029',
    regionCategory: '地市级边缘云',
    regionCenter: '西南一',
    resourcePool: '成都池',
    pod: '成都-边缘003',
    mgmtIp: '192.168.12.103',
    deviceType: 'edge-node',
    deviceName: 'Edge-03',
    vendor: 'HUAWEI',
    bizSystem: '工业IoT数据遥测网关',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 4,
    alarmLevel: '提示告警',
    cpuUpperThreshold: 78,
    cpuLowerThreshold: 10,
    iowaitThreshold: 22,
    isEnabled: true,
  },
  {
    id: 9,
    sn: 'SN-552034',
    regionCategory: '省级IT云',
    regionCenter: '华东二',
    resourcePool: '杭州池',
    pod: '杭州-虚拟028',
    mgmtIp: '220.10.56.28',
    deviceType: 'server',
    deviceName: 'PC-006',
    vendor: 'DELL',
    bizSystem: '微服务网关路由中心',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 8,
    alarmLevel: '重大告警',
    cpuUpperThreshold: 90,
    cpuLowerThreshold: 10,
    iowaitThreshold: 38,
    isEnabled: true,
  },
  {
    id: 10,
    sn: 'SN-884412',
    regionCategory: '一级资源池',
    regionCenter: '东北',
    resourcePool: '沈阳池',
    pod: '沈阳-虚拟009',
    mgmtIp: '220.10.57.12',
    deviceType: 'server',
    deviceName: 'PC-007',
    vendor: '3COM',
    bizSystem: '核心财务分布式账本',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 5,
    alarmLevel: '警告告警',
    cpuUpperThreshold: 80,
    cpuLowerThreshold: 15,
    iowaitThreshold: 25,
    isEnabled: true,
  },
  {
    id: 11,
    sn: 'SN-993188',
    regionCategory: '省级IT云',
    regionCenter: '华中',
    resourcePool: '长沙池',
    pod: '长沙-虚拟012',
    mgmtIp: '220.10.58.19',
    deviceType: 'server',
    deviceName: 'PC-008',
    vendor: 'HUAWEI',
    bizSystem: 'AI超算训练集群节点',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 10,
    alarmLevel: '重大告警',
    cpuUpperThreshold: 95,
    cpuLowerThreshold: 5,
    iowaitThreshold: 50,
    isEnabled: true,
  },
  {
    id: 12,
    sn: 'SN-114820',
    regionCategory: '地市级边缘云',
    regionCenter: '华南一',
    resourcePool: '广州池',
    pod: '广州-边缘008',
    mgmtIp: '192.168.13.88',
    deviceType: 'edge-node',
    deviceName: 'Edge-04',
    vendor: 'A10',
    bizSystem: '5G车联网低延迟算力',
    osSystem: 'Linux 78.6.0.0',
    monitoredMetricCount: 6,
    alarmLevel: '高级告警',
    cpuUpperThreshold: 86,
    cpuLowerThreshold: 12,
    iowaitThreshold: 28,
    isEnabled: true,
  },
];

export const DynamicAlarmConfigView: React.FC = () => {
  // Left object category tree state
  const [objectCategory, setObjectCategory] = useState<'host' | 'network'>('host');

  // Multi-select or single-select filter tags
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['主机CPU利用率']);
  const [selectedCategory, setSelectedCategory] = useState<string>('省级IT云');
  const [selectedCenter, setSelectedCenter] = useState<string>('华北二');
  const [selectedPool, setSelectedPool] = useState<string>('呼池');
  const [selectedPod, setSelectedPod] = useState<string>('呼池-虚拟015');
  const [selectedVendor, setSelectedVendor] = useState<string>('BMC');

  // Search input states
  const [searchType, setSearchType] = useState<string>('sn');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected table rows
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([1]);

  // Modal dialog states
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [configTargetItems, setConfigTargetItems] = useState<AlarmConfigItem[]>([]);

  // Config Modal form values
  const [formAlarmLevel, setFormAlarmLevel] = useState<'重大告警' | '高级告警' | '警告告警' | '提示告警'>('重大告警');
  const [formUpperThresh, setFormUpperThresh] = useState<number>(85);
  const [formLowerThresh, setFormLowerThresh] = useState<number>(15);
  const [formIowaitThresh, setFormIowaitThresh] = useState<number>(30);
  const [formIsEnabled, setFormIsEnabled] = useState<boolean>(true);

  // Model Board Modal state
  const [boardTargetItem, setBoardTargetItem] = useState<AlarmConfigItem | null>(null);

  // AI Diagnostic Modal state
  const [reportTargetItem, setReportTargetItem] = useState<AlarmConfigItem | null>(null);

  // Tag options
  const metricsList = [
    '主机CPU利用率',
    '主机内存利用率',
    '主机CPU iowait时间占比',
    '主机CPU iowait状态占比',
    '主机文件系统使用率',
  ];
  const categoriesList = ['一级资源池', '省级IT云', '池外', '地市级边缘云'];
  const centersList = ['东北', '华北', '华北一', '华北二', '华北三', '华中', '华东一', '华南一', '西北一', '西南一'];
  const poolsList = ['东莞资源池', '安徽资源池', '北京资源池', '重庆资源池', '广东资源池', '甘肃资源池', '呼池', '京池', '上海池', '深圳池'];
  const podsList = [
    '东莞-ironic资源池',
    '东莞-kvm资源池',
    '东莞-vmware',
    '东莞二期-ironic-POD1资源池',
    '二期阶段POD7',
    '呼池-虚拟015',
    '京池-虚拟023',
    '上海-边缘001',
  ];
  const vendorsList = ['3COM', 'A10', 'BEA', 'BMC', 'HUAWEI', 'DELL'];

  // Filtered table rows
  const filteredData = useMemo(() => {
    return ALARM_CONFIG_DATASET.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (searchType === 'sn' && !item.sn.toLowerCase().includes(q)) return false;
        if (searchType === 'ip' && !item.mgmtIp.includes(q)) return false;
        if (searchType === 'deviceName' && !item.deviceName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, searchType]);

  // Handle select all on current page
  const handleSelectAll = () => {
    if (selectedRowIds.length === filteredData.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredData.map((d) => d.id));
    }
  };

  const handleRowCheckboxToggle = (id: number) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((rId) => rId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const openBatchConfig = () => {
    const targets = ALARM_CONFIG_DATASET.filter((d) => selectedRowIds.includes(d.id));
    if (targets.length === 0) return;
    setConfigTargetItems(targets);
    setFormAlarmLevel(targets[0].alarmLevel);
    setFormUpperThresh(targets[0].cpuUpperThreshold);
    setFormLowerThresh(targets[0].cpuLowerThreshold);
    setFormIowaitThresh(targets[0].iowaitThreshold);
    setFormIsEnabled(targets[0].isEnabled);
    setIsConfigModalOpen(true);
  };

  const openSingleConfig = (item: AlarmConfigItem) => {
    setConfigTargetItems([item]);
    setFormAlarmLevel(item.alarmLevel);
    setFormUpperThresh(item.cpuUpperThreshold);
    setFormLowerThresh(item.cpuLowerThreshold);
    setFormIowaitThresh(item.iowaitThreshold);
    setFormIsEnabled(item.isEnabled);
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = () => {
    configTargetItems.forEach((target) => {
      target.alarmLevel = formAlarmLevel;
      target.cpuUpperThreshold = formUpperThresh;
      target.cpuLowerThreshold = formLowerThresh;
      target.iowaitThreshold = formIowaitThresh;
      target.isEnabled = formIsEnabled;
    });
    setIsConfigModalOpen(false);
  };

  return (
    <div className="flex gap-4 w-full bg-[#0b0f19] text-slate-200 min-h-[calc(100vh-100px)] p-2">
      {/* ==================== LEFT SIDEBAR: 配置对象分类 ==================== */}
      <div className="w-52 shrink-0 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 font-bold text-slate-300">
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
          <span>配置对象分类</span>
        </div>

        <div className="flex flex-col gap-1 pl-2">
          <button
            onClick={() => setObjectCategory('host')}
            className={`flex items-center gap-2 py-2 px-3 rounded-lg font-medium transition-all text-left ${
              objectCategory === 'host'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>主机设备</span>
          </button>

          <button
            onClick={() => setObjectCategory('network')}
            className={`flex items-center gap-2 py-2 px-3 rounded-lg font-medium transition-all text-left ${
              objectCategory === 'network'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>网络设备</span>
          </button>
        </div>
      </div>

      {/* ==================== RIGHT MAIN CONTAINER ==================== */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* SECTION 1: 筛选对象指标模型 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
            <span className="text-cyan-400 font-bold">▶</span>
            <span>筛选对象指标模型</span>
          </div>

          {/* Filter Tags Rows */}
          <div className="flex flex-col gap-3 pl-2">
            {/* 1. 监控指标 */}
            <div className="flex items-start gap-4">
              <span className="w-20 shrink-0 text-slate-400 py-1 font-medium">监控指标：</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {metricsList.map((m) => {
                  const active = selectedMetrics.includes(m);
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        if (active) {
                          if (selectedMetrics.length > 1) {
                            setSelectedMetrics(selectedMetrics.filter((item) => item !== m));
                          }
                        } else {
                          setSelectedMetrics([...selectedMetrics, m]);
                        }
                      }}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        active
                          ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 self-center cursor-pointer hover:text-slate-300" />
            </div>

            {/* 2. 区域分类 */}
            <div className="flex items-center gap-4">
              <span className="w-20 shrink-0 text-slate-400 font-medium">区域分类：</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {categoriesList.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedCategory === c
                        ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 区域中心 */}
            <div className="flex items-center gap-4">
              <span className="w-20 shrink-0 text-slate-400 font-medium">区域中心：</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {centersList.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCenter(c)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedCenter === c
                        ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. 资源池 */}
            <div className="flex items-start gap-4">
              <span className="w-20 shrink-0 text-slate-400 py-1 font-medium">资源池：</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {poolsList.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPool(p)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedPool === p
                        ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 self-center cursor-pointer hover:text-slate-300" />
            </div>

            {/* 5. POD */}
            <div className="flex items-start gap-4">
              <span className="w-20 shrink-0 text-slate-400 py-1 font-medium">POD：</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {podsList.map((pod) => (
                  <button
                    key={pod}
                    onClick={() => setSelectedPod(pod)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedPod === pod
                        ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {pod}
                  </button>
                ))}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 self-center cursor-pointer hover:text-slate-300" />
            </div>

            {/* 6. 设备厂家 */}
            <div className="flex items-start gap-4">
              <span className="w-20 shrink-0 text-slate-400 py-1 font-medium">设备厂家：</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {vendorsList.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVendor(v)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedVendor === v
                        ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 self-center cursor-pointer hover:text-slate-300" />
            </div>
          </div>

          {/* Search Row */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
            <span className="text-slate-400 font-medium">精确查询：</span>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="sn">序列号 (SN)</option>
              <option value="ip">IP地址</option>
              <option value="deviceName">设备名称</option>
            </select>

            <input
              type="text"
              placeholder="请输入查询内容"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-52 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-3 py-1.5 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <button className="bg-sky-500 hover:bg-sky-400 text-white font-medium px-4 py-1.5 rounded transition-colors flex items-center gap-1">
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>

            <button
              onClick={() => setSearchQuery('')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-1.5 rounded transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: 配置指标模型告警规则 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 text-xs flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
              <span className="text-cyan-400 font-bold">▶</span>
              <span>配置指标模型告警规则</span>
            </div>

            <button
              onClick={openBatchConfig}
              disabled={selectedRowIds.length === 0}
              className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-1.5 rounded transition-colors flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>告警配置</span>
            </button>
          </div>

          {/* Selection Bar */}
          <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg px-4 py-2 flex items-center gap-3 text-sky-300">
            <span>已选择 <strong className="text-sky-200 font-bold">{selectedRowIds.length}</strong> 项</span>
            <button
              onClick={() => setSelectedRowIds([])}
              className="text-sky-400 hover:text-sky-200 transition-colors underline text-xs"
            >
              清空
            </button>
          </div>

          {/* Table Container with Horizontal and Vertical Scrolling */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950/60 flex-1">
            <table className="w-full text-left border-collapse min-w-[1300px]">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700/80 font-medium">
                  <th className="py-3 px-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={selectedRowIds.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 whitespace-nowrap">序列号</th>
                  <th className="py-3 px-3 whitespace-nowrap">区域分类</th>
                  <th className="py-3 px-3 whitespace-nowrap">区域中心</th>
                  <th className="py-3 px-3 whitespace-nowrap">资源池</th>
                  <th className="py-3 px-3 whitespace-nowrap">POD</th>
                  <th className="py-3 px-3 whitespace-nowrap">IP地址</th>
                  <th className="py-3 px-3 whitespace-nowrap">设备类型</th>
                  <th className="py-3 px-3 whitespace-nowrap">设备名称</th>
                  <th className="py-3 px-3 whitespace-nowrap">设备厂家</th>
                  <th className="py-3 px-3 whitespace-nowrap">业务系统</th>
                  <th className="py-3 px-3 whitespace-nowrap">操作系统</th>
                  <th className="py-3 px-3 whitespace-nowrap text-center">已监控异常检测指标数</th>
                  <th className="py-3 px-3 whitespace-nowrap text-center">异常检测告警级别</th>
                  <th className="py-3 px-3 whitespace-nowrap text-center sticky right-0 bg-slate-800/90 shadow-l">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredData.map((row) => {
                  const isChecked = selectedRowIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isChecked ? 'bg-sky-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRowCheckboxToggle(row.id)}
                          className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-300 whitespace-nowrap font-medium">
                        {row.sn}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{row.regionCategory}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{row.regionCenter}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{row.resourcePool}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{row.pod}</td>
                      <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">{row.mgmtIp}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {row.deviceType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-200 whitespace-nowrap">{row.deviceName}</td>
                      <td className="py-3 px-3 font-medium text-slate-300 whitespace-nowrap">{row.vendor}</td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{row.bizSystem}</td>
                      <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">{row.osSystem}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-sky-400">
                        {row.monitoredMetricCount}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            row.alarmLevel === '重大告警'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : row.alarmLevel === '高级告警'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : row.alarmLevel === '警告告警'
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          }`}
                        >
                          {row.alarmLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap sticky right-0 bg-slate-900/90 shadow-l">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setBoardTargetItem(row)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium flex items-center gap-0.5"
                          >
                            <span>指标看板</span>
                          </button>
                          <button
                            onClick={() => setReportTargetItem(row)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium flex items-center gap-0.5"
                          >
                            <span>AI异常检测报告</span>
                          </button>
                          <button
                            onClick={() => openSingleConfig(row)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium flex items-center gap-0.5"
                          >
                            <span>当前告警配置</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Row: Select All & Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              onClick={handleSelectAll}
              className="bg-sky-500 hover:bg-sky-400 text-white font-medium px-4 py-1.5 rounded transition-colors text-xs"
            >
              本页全选
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>共 140 条记录 第 1/80 页</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  &lt;
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded bg-sky-500 text-white font-bold">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  3
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  4
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  5
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  &gt;
                </button>
              </div>

              <select className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1">
                <option>10条/页</option>
                <option>20条/页</option>
                <option>50条/页</option>
              </select>

              <div className="flex items-center gap-1">
                <span>跳至</span>
                <input
                  type="text"
                  defaultValue="1"
                  className="w-10 text-center bg-slate-950 border border-slate-700 text-slate-200 rounded py-1"
                />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MODAL: 动态阈值告警配置 ==================== */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl flex flex-col gap-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>动态阈值告警规则配置</span>
                <span className="text-xs text-cyan-400 font-mono">
                  (已选 {configTargetItems.length} 台设备)
                </span>
              </h3>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Target items list summary */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {configTargetItems.map((item) => (
                  <span
                    key={item.id}
                    className="bg-slate-800 text-cyan-300 font-mono px-2 py-0.5 rounded border border-slate-700 text-[11px]"
                  >
                    {item.sn} ({item.deviceName})
                  </span>
                ))}
              </div>

              {/* Dynamic Threshold Toggle */}
              <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-200">启用AI动态阈值自适应监控</span>
                  <span className="text-[11px] text-slate-400">
                    由AI离群检侧模型自动生成上限与下限包络线，无需人工固定阈值
                  </span>
                </div>
                <button
                  onClick={() => setFormIsEnabled(!formIsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    formIsEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      formIsEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Alarm Severity Level */}
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-slate-300">触发告警级别：</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['重大告警', '高级告警', '警告告警', '提示告警'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormAlarmLevel(lvl)}
                      className={`py-2 px-3 rounded-lg font-medium border text-center transition-all ${
                        formAlarmLevel === lvl
                          ? lvl === '重大告警'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                            : lvl === '高级告警'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                            : lvl === '警告告警'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* CPU Upper Threshold Range */}
              <div className="flex flex-col gap-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center text-slate-300 font-medium">
                  <span>动态上限灵敏度偏置 (%):</span>
                  <span className="font-mono text-cyan-400 font-bold">+{formUpperThresh}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={formUpperThresh}
                  onChange={(e) => setFormUpperThresh(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* CPU Lower Threshold Range */}
              <div className="flex flex-col gap-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center text-slate-300 font-medium">
                  <span>动态下限灵敏度偏置 (%):</span>
                  <span className="font-mono text-cyan-400 font-bold">-{formLowerThresh}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={formLowerThresh}
                  onChange={(e) => setFormLowerThresh(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* IO Wait Threshold */}
              <div className="flex flex-col gap-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center text-slate-300 font-medium">
                  <span>iowait 容忍连续时长 (秒):</span>
                  <span className="font-mono text-cyan-400 font-bold">{formIowaitThresh}s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={formIowaitThresh}
                  onChange={(e) => setFormIowaitThresh(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium transition-colors shadow-lg shadow-sky-500/20"
              >
                保存配置规则
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FULL MODEL BOARD MODAL ==================== */}
      {boardTargetItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b0f19] p-6 animate-fadeIn">
          <ModelBoardView
            sn={boardTargetItem.sn}
            mgmtIp={boardTargetItem.mgmtIp}
            bizIp="220.10.51.80"
            onBack={() => setBoardTargetItem(null)}
          />
        </div>
      )}

      {/* ==================== AI DIAGNOSTIC REPORT MODAL ==================== */}
      {reportTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>AI 异常检测诊断报告 - {reportTargetItem.sn}</span>
              </h3>
              <button
                onClick={() => setReportTargetItem(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-slate-300">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div>设备SN: <span className="text-cyan-400">{reportTargetItem.sn}</span> ({reportTargetItem.deviceName})</div>
                <div>管理IP: {reportTargetItem.mgmtIp}</div>
                <div>操作系统: {reportTargetItem.osSystem}</div>
                <div>诊断时间: 2026-10-16 09:35:12</div>
              </div>

              <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-cyan-200 leading-relaxed space-y-2">
                <div className="font-bold flex items-center gap-2 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>AI 离群评估摘要</span>
                </div>
                <p>
                  智能诊断引擎分析近7天 (`2026-10-09` 至 `2026-10-16`) 的时序数据，检测到该设备 CPU 抖动频次超出自适应置信边界 22 次，主因系 iowait 周期性升高导致。
                </p>
                <p className="text-slate-400 text-[11px]">
                  推荐操作: 调整动态上限灵敏度偏置为 +85%，并为 [{reportTargetItem.bizSystem}] 分配独立的 I/O 调度队列。
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setReportTargetItem(null)}
                className="px-4 py-2 rounded-lg bg-sky-500 text-white font-medium hover:bg-sky-400"
              >
                关闭报告
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
