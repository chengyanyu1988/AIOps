import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  Layers,
  Server,
  Network,
  ShieldAlert,
  Radio,
  HardDrive,
  Box,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface PerfMetricPredictionViewProps {
  onNavigate: (subView: string) => void;
}

interface PerfRecord {
  sn: string;
  regionCategory: string;
  regionCenter: string;
  resourcePool: string;
  pod: string;
  mgmtIp: string;
  bizIp: string;
  model: string;
  name: string;
  vendor: string;
  bizSystem: string;
  osType: string;
  osVer: string;
  monitoredMetricsCount: number;
  enabledModelsCount: number;
  categoryKey: 'cloud_host' | 'network_dev' | 'security_dev' | 'sdn_dev' | 'storage_dev' | 'vcenter_dev';
}

// 多维度分类真实数据集合
const ALL_PERF_RECORDS: PerfRecord[] = [
  // 1. 云主机监控
  {
    sn: 'SN-46567',
    regionCategory: '省级IT云',
    regionCenter: '华北二',
    resourcePool: '呼池',
    pod: '呼池-虚拟015',
    mgmtIp: '220.10.51.15',
    bizIp: '10.240.51.15',
    model: 'RH2288 V5',
    name: 'Server-Host-46567',
    vendor: '华为',
    bizSystem: 'CRM',
    osType: 'Linux',
    osVer: '63.5.28',
    monitoredMetricsCount: 14,
    enabledModelsCount: 6,
    categoryKey: 'cloud_host',
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
    name: 'Server-Billing-02',
    vendor: 'Dell',
    bizSystem: '计费账务',
    osType: 'Linux',
    osVer: '7.9.2009',
    monitoredMetricsCount: 12,
    enabledModelsCount: 5,
    categoryKey: 'cloud_host',
  },
  {
    sn: 'SN-775589',
    regionCategory: '一级资源池',
    regionCenter: '华东一',
    resourcePool: '北京资源池',
    pod: '东莞-ironic资源池',
    mgmtIp: '192.168.10.42',
    bizIp: '10.128.10.42',
    model: 'NF5280M6',
    name: 'Edge-GPU-01',
    vendor: '浪潮',
    bizSystem: 'AI推理调度',
    osType: 'Linux',
    osVer: 'Ubuntu 22.04',
    monitoredMetricsCount: 18,
    enabledModelsCount: 8,
    categoryKey: 'cloud_host',
  },
  {
    sn: 'SN-991204',
    regionCategory: '池外',
    regionCenter: '华中',
    resourcePool: '安徽资源池',
    pod: '东莞-kvm资源池',
    mgmtIp: '172.16.80.12',
    bizIp: '10.16.80.12',
    model: 'PowerEdge R650',
    name: 'App-Portal-04',
    vendor: 'BMC',
    bizSystem: '统一门户',
    osType: 'Linux',
    osVer: 'CentOS 8.4',
    monitoredMetricsCount: 10,
    enabledModelsCount: 4,
    categoryKey: 'cloud_host',
  },

  // 2. 网络设备监控
  {
    sn: 'NET-SW-9001',
    regionCategory: '一级资源池',
    regionCenter: '东北',
    resourcePool: '东莞资源池',
    pod: '二期一阶段POD7',
    mgmtIp: '10.200.1.1',
    bizIp: '10.200.1.254',
    model: 'CloudEngine 12800',
    name: 'Core-Switch-01',
    vendor: '华为',
    bizSystem: '核心数据网',
    osType: 'VRP',
    osVer: 'V800R012',
    monitoredMetricsCount: 24,
    enabledModelsCount: 10,
    categoryKey: 'network_dev',
  },
  {
    sn: 'NET-RT-6012',
    regionCategory: '省级IT云',
    regionCenter: '华北',
    resourcePool: '重庆资源池',
    pod: '东莞-二期-ironic-POD1资源池',
    mgmtIp: '10.200.2.1',
    bizIp: '10.200.2.254',
    model: 'S12700',
    name: 'Agg-Router-02',
    vendor: '3COM',
    bizSystem: '骨干传输网',
    osType: 'Comware',
    osVer: 'V7.1.070',
    monitoredMetricsCount: 20,
    enabledModelsCount: 7,
    categoryKey: 'network_dev',
  },

  // 3. 安全设备监控
  {
    sn: 'SEC-FW-8088',
    regionCategory: '省级IT云',
    regionCenter: '华北一',
    resourcePool: '广东资源池',
    pod: '东莞-vmware',
    mgmtIp: '192.168.100.1',
    bizIp: '10.100.0.1',
    model: 'USG6600E',
    name: 'Boundary-FW-01',
    vendor: 'BEA',
    bizSystem: '安全审计平台',
    osType: 'EudemonOS',
    osVer: 'V600R007',
    monitoredMetricsCount: 16,
    enabledModelsCount: 6,
    categoryKey: 'security_dev',
  },
  {
    sn: 'SEC-WAF-3021',
    regionCategory: '池外',
    regionCenter: '华中',
    resourcePool: '甘肃资源池',
    pod: '东莞-ironic资源池',
    mgmtIp: '192.168.100.25',
    bizIp: '10.100.0.25',
    model: 'WAF-5000',
    name: 'Web-WAF-Node-02',
    vendor: 'A10',
    bizSystem: 'Web应用防火墙',
    osType: 'ACOS',
    osVer: '4.1.4-P5',
    monitoredMetricsCount: 15,
    enabledModelsCount: 5,
    categoryKey: 'security_dev',
  },

  // 4. SDN监控
  {
    sn: 'SDN-CTL-1001',
    regionCategory: '一级资源池',
    regionCenter: '华北一',
    resourcePool: '东莞资源池',
    pod: '东莞-kvm资源池',
    mgmtIp: '10.240.2.20',
    bizIp: '10.240.2.120',
    model: 'Agile Controller-DCN',
    name: 'SDN-Cluster-Master',
    vendor: '华为',
    bizSystem: '软件定义网络',
    osType: 'Linux',
    osVer: 'EulerOS 2.0',
    monitoredMetricsCount: 22,
    enabledModelsCount: 9,
    categoryKey: 'sdn_dev',
  },
  {
    sn: 'SDN-GW-0042',
    regionCategory: '省级IT云',
    regionCenter: '东北',
    resourcePool: '安徽资源池',
    pod: '二期一阶段POD7',
    mgmtIp: '10.240.2.21',
    bizIp: '10.240.2.121',
    model: 'vGateway-V3',
    name: 'SDN-Border-Gateway',
    vendor: '3COM',
    bizSystem: '云网络网关',
    osType: 'Linux',
    osVer: '63.5.28',
    monitoredMetricsCount: 19,
    enabledModelsCount: 7,
    categoryKey: 'sdn_dev',
  },

  // 5. 存储监控
  {
    sn: 'STOR-SAN-8800',
    regionCategory: '一级资源池',
    regionCenter: '华北',
    resourcePool: '北京资源池',
    pod: '东莞-二期-ironic-POD1资源池',
    mgmtIp: '10.10.30.15',
    bizIp: '10.10.30.115',
    model: 'OceanStor 18800 V5',
    name: 'SAN-Storage-Array-01',
    vendor: '华为',
    bizSystem: '核心分布式数据库存储',
    osType: 'OceanStor OS',
    osVer: 'V500R007',
    monitoredMetricsCount: 26,
    enabledModelsCount: 11,
    categoryKey: 'storage_dev',
  },
  {
    sn: 'STOR-NAS-5500',
    regionCategory: '池外',
    regionCenter: '华中',
    resourcePool: '重庆资源池',
    pod: '东莞-vmware',
    mgmtIp: '10.10.30.16',
    bizIp: '10.10.30.116',
    model: 'FAS8300',
    name: 'NAS-FileShare-Node',
    vendor: 'BMC',
    bizSystem: '归档与共享文件存储',
    osType: 'ONTAP',
    osVer: '9.8P4',
    monitoredMetricsCount: 14,
    enabledModelsCount: 5,
    categoryKey: 'storage_dev',
  },

  // 6. Vcenter监控
  {
    sn: 'VCENTER-VC-01',
    regionCategory: '省级IT云',
    regionCenter: '华北二',
    resourcePool: '广东资源池',
    pod: '东莞-vmware',
    mgmtIp: '10.50.1.100',
    bizIp: '10.50.1.200',
    model: 'vCenter Server Appliance',
    name: 'vCenter-Cluster-Center',
    vendor: 'BEA',
    bizSystem: '虚拟化管理集群',
    osType: 'Photon OS',
    osVer: '7.0U3',
    monitoredMetricsCount: 30,
    enabledModelsCount: 12,
    categoryKey: 'vcenter_dev',
  },
  {
    sn: 'VCENTER-ESXI-08',
    regionCategory: '一级资源池',
    regionCenter: '东北',
    resourcePool: '甘肃资源池',
    pod: '东莞-kvm资源池',
    mgmtIp: '10.50.1.108',
    bizIp: '10.50.1.208',
    model: 'ESXi Host Pro',
    name: 'ESXi-Hypervisor-Node08',
    vendor: 'A10',
    bizSystem: 'VMware计算宿主机',
    osType: 'VMkernel',
    osVer: '7.0.3-20328353',
    monitoredMetricsCount: 25,
    enabledModelsCount: 9,
    categoryKey: 'vcenter_dev',
  },
];

export const PerfMetricPredictionView: React.FC<PerfMetricPredictionViewProps> = ({ onNavigate }) => {
  // 1. Left Sidebar Active Category
  const [selectedCategory, setSelectedCategory] = useState<
    'cloud_host' | 'network_dev' | 'security_dev' | 'sdn_dev' | 'storage_dev' | 'vcenter_dev'
  >('cloud_host');

  const [isIaaSExpanded, setIsIaaSExpanded] = useState(true);

  // 2. Filter Bar States (Aligned with Screenshot)
  const [regionCategory, setRegionCategory] = useState('全部');
  const [regionCenter, setRegionCenter] = useState('全部');
  const [resourcePool, setResourcePool] = useState('全部');
  const [pod, setPod] = useState('全部');
  const [vendor, setVendor] = useState('全部');
  const [period, setPeriod] = useState('全部');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [exactType, setExactType] = useState('全部');
  const [exactQuery, setExactQuery] = useState('');

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 3. Computed Filtered Records
  const filteredRecords = useMemo(() => {
    return ALL_PERF_RECORDS.filter((rec) => {
      // Filter by Left Sidebar Category
      if (rec.categoryKey !== selectedCategory) return false;

      // Filter by Region Category
      if (regionCategory !== '全部' && rec.regionCategory !== regionCategory) return false;

      // Filter by Region Center
      if (regionCenter !== '全部' && rec.regionCenter !== regionCenter) return false;

      // Filter by Resource Pool
      if (resourcePool !== '全部' && rec.resourcePool !== resourcePool) return false;

      // Filter by POD
      if (pod !== '全部' && rec.pod !== pod) return false;

      // Filter by Vendor
      if (vendor !== '全部' && rec.vendor !== vendor) return false;

      // Filter by Exact Query
      if (exactQuery.trim() !== '') {
        const q = exactQuery.trim().toLowerCase();
        if (exactType === '按序列号') return rec.sn.toLowerCase().includes(q);
        if (exactType === '按管理IP') return rec.mgmtIp.toLowerCase().includes(q);
        if (exactType === '按设备名称') return rec.name.toLowerCase().includes(q);
        if (exactType === '按业务系统') return rec.bizSystem.toLowerCase().includes(q);

        // '全部' search across fields
        return (
          rec.sn.toLowerCase().includes(q) ||
          rec.mgmtIp.toLowerCase().includes(q) ||
          rec.name.toLowerCase().includes(q) ||
          rec.bizSystem.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [
    selectedCategory,
    regionCategory,
    regionCenter,
    resourcePool,
    pod,
    vendor,
    exactType,
    exactQuery,
  ]);

  const handleReset = () => {
    setRegionCategory('全部');
    setRegionCenter('全部');
    setResourcePool('全部');
    setPod('全部');
    setVendor('全部');
    setPeriod('全部');
    setStartTime('');
    setEndTime('');
    setExactType('全部');
    setExactQuery('');
    showToast('已重置所有筛选条件');
  };

  const handleSearch = () => {
    showToast(`筛选完成，共匹配到 ${filteredRecords.length} 条对象指标模型数据`);
  };

  return (
    <div className="w-full bg-[#0b0f19] text-slate-200 min-h-[calc(100vh-120px)] flex flex-col gap-4 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-sky-500/90 border border-sky-400 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Outer 2-Column Split Layout: Left Menu Sidebar + Right Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================
            LEFT SIDEBAR MENU: IaaS平台异常发现
           ======================================================== */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 backdrop-blur-md shadow-xl">
          {/* Category Dropdown Accordion Header */}
          <div
            onClick={() => setIsIaaSExpanded(!isIaaSExpanded)}
            className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none pb-2 border-b border-slate-800/80 hover:text-sky-400 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] transform transition-transform ${isIaaSExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
              <span>IaaS平台异常发现</span>
            </div>
          </div>

          {/* Collapsible Menu Options */}
          {isIaaSExpanded && (
            <div className="space-y-1 pl-2 text-xs">
              {[
                { id: 'cloud_host', label: '云主机监控' },
                { id: 'network_dev', label: '网络设备监控' },
                { id: 'security_dev', label: '安全设备监控' },
                { id: 'sdn_dev', label: 'SDN监控' },
                { id: 'storage_dev', label: '存储监控' },
                { id: 'vcenter_dev', label: 'Vcenter监控' },
              ].map((item) => {
                const isActive = selectedCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedCategory(item.id as any);
                      showToast(`已切换至标签：【${item.label}】`);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs font-medium ${
                      isActive
                        ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20 ring-1 ring-sky-400/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT MAIN PANEL: 筛选对象指标模型
           ======================================================== */}
        <div className="lg:col-span-10 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md">
          {/* Section Header: ▶ 筛选对象指标模型 */}
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 text-sm">▶</span>
              <span>筛选对象指标模型</span>
            </h2>
          </div>

          {/* Filter Card Container (Matches Screenshot Layout) */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs font-sans">
            {/* Row 1: 区域分类 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 text-slate-400 font-medium text-right shrink-0">区域分类：</span>
              <div className="flex flex-wrap items-center gap-2">
                {['全部', '一级资源池', '省级IT云', '池外'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRegionCategory(val)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      regionCategory === val
                        ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: 区域中心 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 text-slate-400 font-medium text-right shrink-0">区域中心：</span>
              <div className="flex flex-wrap items-center gap-2">
                {['全部', '东北', '华北', '华北一', '华中', '华北二', '华东一'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRegionCenter(val)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      regionCenter === val
                        ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: 资源池 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 text-slate-400 font-medium text-right shrink-0">资源池：</span>
              <div className="flex flex-wrap items-center gap-2">
                {['全部', '东莞资源池', '安徽资源池', '北京资源池', '重庆资源池', '广东资源池', '甘肃资源池', '呼池'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setResourcePool(val)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      resourcePool === val
                        ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 4: POD */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 text-slate-400 font-medium text-right shrink-0">POD：</span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  '全部',
                  '东莞-ironic资源池',
                  '东莞-kvm资源池',
                  '东莞-vmware',
                  '东莞-二期-ironic-POD1资源池',
                  '二期一阶段POD7',
                  '呼池-虚拟015',
                ].map((val) => (
                  <button
                    key={val}
                    onClick={() => setPod(val)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      pod === val
                        ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 5: 设备厂家 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-24 text-slate-400 font-medium text-right shrink-0">设备厂家：</span>
              <div className="flex flex-wrap items-center gap-2">
                {['全部', '3COM', 'A10', 'BEA', 'BMC', '华为', '中兴', '浪潮', 'Dell'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setVendor(val)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      vendor === val
                        ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 6: 报告统计周期 */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
              <span className="w-24 text-slate-400 font-medium text-right shrink-0">报告统计周期：</span>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="全部">请选择统计周期</option>
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
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs w-40 focus:outline-none focus:border-sky-500 font-mono"
                />
                <span className="text-slate-500">——</span>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="请输入结束时间"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs w-40 focus:outline-none focus:border-sky-500 font-mono"
                />

                <span className="text-slate-500 text-[11px] ml-2">(如不选择统计周期，默认查询近3天结果数据)</span>
              </div>
            </div>

            {/* Row 7: 精确查询 & 操作按钮 */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-24 text-slate-400 font-medium text-right shrink-0">精确查询：</span>
                <select
                  value={exactType}
                  onChange={(e) => setExactType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="全部">请选择查询方式</option>
                  <option value="按序列号">按序列号</option>
                  <option value="按管理IP">按管理IP</option>
                  <option value="按设备名称">按设备名称</option>
                  <option value="按业务系统">按业务系统</option>
                </select>

                <input
                  type="text"
                  value={exactQuery}
                  onChange={(e) => setExactQuery(e.target.value)}
                  placeholder="请输入查询内容"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs w-56 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSearch}
                  className="px-6 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
                >
                  查询
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors text-xs"
                >
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* Table Container (Matches Screenshot Table Structure) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
              <span>
                当前标签：【
                <span className="text-sky-400 font-bold">
                  {selectedCategory === 'cloud_host' && '云主机监控'}
                  {selectedCategory === 'network_dev' && '网络设备监控'}
                  {selectedCategory === 'security_dev' && '安全设备监控'}
                  {selectedCategory === 'sdn_dev' && 'SDN监控'}
                  {selectedCategory === 'storage_dev' && '存储监控'}
                  {selectedCategory === 'vcenter_dev' && 'Vcenter监控'}
                </span>
                】 匹配记录数：<strong className="text-white font-mono">{filteredRecords.length}</strong> 条
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
                    <th className="py-3 px-3">序列号</th>
                    <th className="py-3 px-3">区域分类</th>
                    <th className="py-3 px-3">区域中心</th>
                    <th className="py-3 px-3">资源池</th>
                    <th className="py-3 px-3">POD</th>
                    <th className="py-3 px-3">管理IP地址</th>
                    <th className="py-3 px-3">业务IP地址</th>
                    <th className="py-3 px-3">设备型号</th>
                    <th className="py-3 px-3">设备名称</th>
                    <th className="py-3 px-3">设备厂家</th>
                    <th className="py-3 px-3">业务系统</th>
                    <th className="py-3 px-3">操作系统类型</th>
                    <th className="py-3 px-3">操作系统版本</th>
                    <th className="py-3 px-3 text-center">已监控异常检测指标数</th>
                    <th className="py-3 px-3 text-center">已启用异常检测模型数</th>
                    <th className="py-3 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((row) => (
                      <tr key={row.sn} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-cyan-300 font-bold">{row.sn}</td>
                        <td className="py-3 px-3 font-sans">{row.regionCategory}</td>
                        <td className="py-3 px-3 font-sans">{row.regionCenter}</td>
                        <td className="py-3 px-3 font-sans">{row.resourcePool}</td>
                        <td className="py-3 px-3 font-sans">{row.pod}</td>
                        <td className="py-3 px-3 text-cyan-400">{row.mgmtIp}</td>
                        <td className="py-3 px-3 text-slate-400">{row.bizIp}</td>
                        <td className="py-3 px-3">{row.model}</td>
                        <td className="py-3 px-3 font-sans text-white font-bold">{row.name}</td>
                        <td className="py-3 px-3 font-sans">{row.vendor}</td>
                        <td className="py-3 px-3 font-sans text-sky-300">{row.bizSystem}</td>
                        <td className="py-3 px-3">{row.osType}</td>
                        <td className="py-3 px-3 text-slate-400">{row.osVer}</td>
                        <td className="py-3 px-3 text-center font-bold text-cyan-300">{row.monitoredMetricsCount}</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-400">{row.enabledModelsCount}</td>
                        <td className="py-3 px-3 text-center font-sans whitespace-nowrap">
                          {/* CRITICAL USER REQUIREMENT: 操作列下的两个按钮修改为【AI预测报告】和【指标整体预测报告】 */}
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                onNavigate('ai_fault_report');
                                showToast(`已调阅 [${row.name}] 的 AI预测报告`);
                              }}
                              className="text-sky-400 hover:text-sky-300 hover:underline font-medium"
                            >
                              AI预测报告
                            </button>
                            <span className="text-slate-600">|</span>
                            <button
                              onClick={() => {
                                onNavigate('overall_metric_pred_report');
                                showToast(`已调阅 [${row.name}] 的 指标整体预测报告`);
                              }}
                              className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
                            >
                              指标整体预测报告
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={16} className="py-8 text-center text-slate-500 font-sans">
                        暂无匹配的对象指标模型记录，请重新调整筛选条件
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
