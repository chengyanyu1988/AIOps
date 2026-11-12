import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  BarChart2,
  ChevronDown,
  X,
  Activity,
  Brain,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface MetricAnomalyItem {
  sn: string;
  regionCategory: string;
  regionCenter: string;
  resourcePool: string;
  pod: string;
  mgmtIp: string;
  bizIp: string;
  deviceModel: string;
  deviceName: string;
  vendor: string;
  bizSystem?: string;
  osType?: string;
  osVersion?: string;
  modelType: 'single' | 'dynamic' | 'multi';
}

// Dataset 1: 单指标异常检测模型
const SINGLE_METRIC_DATASET: MetricAnomalyItem[] = [
  { sn: 'SN-46567', regionCategory: '省级IT云', regionCenter: '华北二', resourcePool: '呼池', pod: '呼池-虚拟015', mgmtIp: '220.10.51.14', bizIp: '220.10.51.15', deviceModel: '--', deviceName: 'PC-001', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-8379952', regionCategory: '一级资源池', regionCenter: '华东一', resourcePool: '东莞资源池', pod: '东莞-kvm资源池', mgmtIp: '10.240.1.18', bizIp: '10.240.1.19', deviceModel: 'RH2288H', deviceName: 'SRV-Node-02', vendor: 'HUAWEI', bizSystem: 'IT云运维系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-775589', regionCategory: '省级IT云', regionCenter: '华南一', resourcePool: '广东资源池', pod: '东莞-二期-ironic-POD1资源池', mgmtIp: '10.240.2.10', bizIp: '10.240.2.11', deviceModel: 'CE12800', deviceName: 'Core-SW-02', vendor: '3COM', bizSystem: '核心交换系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-901234', regionCategory: '一级资源池', regionCenter: '东北', resourcePool: '北京资源池', pod: '二期一阶段POD7', mgmtIp: '10.240.3.45', bizIp: '10.240.3.46', deviceModel: 'SR6608', deviceName: 'GW-Router-01', vendor: 'A10', bizSystem: '网关路由系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-338210', regionCategory: '池外', regionCenter: '华中', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.4.88', bizIp: '10.240.4.89', deviceModel: 'R740', deviceName: 'App-Host-11', vendor: 'BEA', bizSystem: '应用托管系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-612988', regionCategory: '省级IT云', regionCenter: '华北一', resourcePool: '安徽资源池', pod: '东莞-ironic资源池', mgmtIp: '10.240.5.30', bizIp: '10.240.5.31', deviceModel: 'OceanStor', deviceName: 'SAN-Storage-03', vendor: 'DELL', bizSystem: 'SAN存储管理', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-882190', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '北京资源池', pod: '二期一阶段POD7', mgmtIp: '10.240.12.11', bizIp: '10.240.12.12', deviceModel: 'ProLiant', deviceName: 'Web-Front-05', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-102934', regionCategory: '一级资源池', regionCenter: '华中', resourcePool: '甘肃资源池', pod: '呼池-虚拟015', mgmtIp: '10.240.13.20', bizIp: '10.240.13.21', deviceModel: 'RH2288H', deviceName: 'DB-Primary-08', vendor: 'HUAWEI', bizSystem: '主数据库系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-440129', regionCategory: '池外', regionCenter: '东北', resourcePool: '呼池', pod: '呼池-虚拟015', mgmtIp: '10.240.14.33', bizIp: '10.240.14.34', deviceModel: 'N9K', deviceName: 'Edge-Gate-02', vendor: '3COM', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-559012', regionCategory: '省级IT云', regionCenter: '华南一', resourcePool: '广东资源池', pod: '东莞-二期-ironic-POD1资源池', mgmtIp: '10.240.15.40', bizIp: '10.240.15.41', deviceModel: 'A10-ADC', deviceName: 'LB-VIP-04', vendor: 'A10', bizSystem: '负载均衡系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-771209', regionCategory: '一级资源池', regionCenter: '华北一', resourcePool: '东莞资源池', pod: '东莞-kvm资源池', mgmtIp: '10.240.16.55', bizIp: '10.240.16.56', deviceModel: 'R740xd', deviceName: 'K8s-Worker-09', vendor: 'DELL', bizSystem: '容器调度系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-908123', regionCategory: '省级IT云', regionCenter: '华东一', resourcePool: '安徽资源池', pod: '东莞-vmware', mgmtIp: '10.240.17.60', bizIp: '10.240.17.61', deviceModel: 'RH2288H', deviceName: 'Auth-Server-01', vendor: 'BEA', bizSystem: '统一认证系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-110293', regionCategory: '省级IT云', regionCenter: '华北二', resourcePool: '呼池', pod: '呼池-虚拟015', mgmtIp: '10.240.30.11', bizIp: '10.240.30.12', deviceModel: 'R740', deviceName: 'Huchia-KVM-Node01', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-110294', regionCategory: '省级IT云', regionCenter: '华北二', resourcePool: '呼池', pod: '呼池-虚拟015', mgmtIp: '10.240.30.13', bizIp: '10.240.30.14', deviceModel: 'RH2288H', deviceName: 'Huchia-KVM-Node02', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-110295', regionCategory: '一级资源池', regionCenter: '华中', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.30.15', bizIp: '10.240.30.16', deviceModel: 'CE12800', deviceName: 'Chongqing-Switch-01', vendor: 'HUAWEI', bizSystem: '网管系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
  { sn: 'SN-110296', regionCategory: '池外', regionCenter: '华东一', resourcePool: '安徽资源池', pod: '东莞-ironic资源池', mgmtIp: '10.240.30.17', bizIp: '10.240.30.18', deviceModel: 'OceanStor', deviceName: 'Anhui-Storage-01', vendor: 'DELL', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'single' },
];

// Dataset 2: 动态阈值模型 (Matches user screenshot: 重庆资源池 / 东莞-vmware / BMC / 省级IT云 / 华北)
const DYNAMIC_THRESHOLD_DATASET: MetricAnomalyItem[] = [
  { sn: 'SN-CQ-88201', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.6.11', bizIp: '10.240.6.12', deviceModel: 'RH2288H', deviceName: 'Chongqing-KVM-Node01', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-CQ-88202', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.6.13', bizIp: '10.240.6.14', deviceModel: 'RH2288H', deviceName: 'Chongqing-KVM-Node02', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-CQ-88203', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.6.15', bizIp: '10.240.6.16', deviceModel: 'R740', deviceName: 'Chongqing-DB-Cluster01', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-CQ-88204', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.6.17', bizIp: '10.240.6.18', deviceModel: 'SR6608', deviceName: 'Chongqing-GW-Router02', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-DG-10922', regionCategory: '一级资源池', regionCenter: '华北一', resourcePool: '东莞资源池', pod: '东莞-kvm资源池', mgmtIp: '10.240.7.20', bizIp: '10.240.7.21', deviceModel: 'CE12800', deviceName: 'Dongguan-Core-SW01', vendor: 'HUAWEI', bizSystem: '核心交换系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-BJ-30219', regionCategory: '省级IT云', regionCenter: '东北', resourcePool: '北京资源池', pod: '二期一阶段POD7', mgmtIp: '10.240.8.50', bizIp: '10.240.8.51', deviceModel: 'R740', deviceName: 'Beijing-Compute-Node', vendor: 'DELL', bizSystem: '云计算节点', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-AH-55102', regionCategory: '池外', regionCenter: '华中', resourcePool: '安徽资源池', pod: '东莞-ironic资源池', mgmtIp: '10.240.9.33', bizIp: '10.240.9.34', deviceModel: 'SR6608', deviceName: 'Anhui-GW-Router', vendor: 'A10', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-GD-99120', regionCategory: '一级资源池', regionCenter: '华南一', resourcePool: '广东资源池', pod: '东莞-二期-ironic-POD1资源池', mgmtIp: '10.240.10.88', bizIp: '10.240.10.89', deviceModel: 'OceanStor', deviceName: 'Guangdong-SAN-Storage', vendor: '3COM', bizSystem: '存储服务', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-GS-22101', regionCategory: '省级IT云', regionCenter: '华中', resourcePool: '甘肃资源池', pod: '呼池-虚拟015', mgmtIp: '10.240.18.10', bizIp: '10.240.18.11', deviceModel: 'ProLiant', deviceName: 'Gansu-Edge-Host01', vendor: 'BEA', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-CQ-88205', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.6.19', bizIp: '10.240.6.20', deviceModel: 'RH2288H', deviceName: 'Chongqing-Web-Proxy03', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-BJ-30220', regionCategory: '一级资源池', regionCenter: '东北', resourcePool: '北京资源池', pod: '二期一阶段POD7', mgmtIp: '10.240.19.40', bizIp: '10.240.19.41', deviceModel: 'RH2288H-GPU', deviceName: 'Beijing-GPU-Cluster01', vendor: 'HUAWEI', bizSystem: 'AI计算平台', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-DG-10923', regionCategory: '一级资源池', regionCenter: '华北一', resourcePool: '东莞资源池', pod: '东莞-kvm资源池', mgmtIp: '10.240.20.50', bizIp: '10.240.20.51', deviceModel: 'CE12800', deviceName: 'Dongguan-Spine-SW02', vendor: '3COM', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-GD-99121', regionCategory: '省级IT云', regionCenter: '华南一', resourcePool: '广东资源池', pod: '东莞-二期-ironic-POD1资源池', mgmtIp: '10.240.21.80', bizIp: '10.240.21.81', deviceModel: 'R740', deviceName: 'Guangdong-Compute-Node04', vendor: 'DELL', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-AH-55103', regionCategory: '池外', regionCenter: '华中', resourcePool: '安徽资源池', pod: '东莞-ironic资源池', mgmtIp: '10.240.22.90', bizIp: '10.240.22.91', deviceModel: 'OceanStor', deviceName: 'Anhui-DB-Backup02', vendor: 'A10', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-CQ-88206', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.6.21', bizIp: '10.240.6.22', deviceModel: 'RH2288H', deviceName: 'Chongqing-AppServer-05', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
  { sn: 'SN-CQ-88207', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.6.23', bizIp: '10.240.6.24', deviceModel: 'R740', deviceName: 'Chongqing-Redis-Master', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'dynamic' },
];

// Dataset 3: 多指标异常检测模型
const MULTI_METRIC_DATASET: MetricAnomalyItem[] = [
  { sn: 'SN-MULTI-001', regionCategory: '省级IT云', regionCenter: '华北一', resourcePool: '安徽资源池', pod: '东莞-vmware', mgmtIp: '10.240.11.10', bizIp: '10.240.11.11', deviceModel: 'ProLiant', deviceName: 'MultiVar-AppCluster-01', vendor: 'BEA', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-002', regionCategory: '一级资源池', regionCenter: '华北', resourcePool: '东莞资源池', pod: '东莞-kvm资源池', mgmtIp: '10.240.11.12', bizIp: '10.240.11.13', deviceModel: 'RH2288H', deviceName: 'MultiVar-DBCluster-02', vendor: 'HUAWEI', bizSystem: '核心数据库系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-003', regionCategory: '池外', regionCenter: '华中', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.11.14', bizIp: '10.240.11.15', deviceModel: 'R740', deviceName: 'MultiVar-K8sMaster-01', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-004', regionCategory: '省级IT云', regionCenter: '华南一', resourcePool: '广东资源池', pod: '东莞-二期-ironic-POD1资源池', mgmtIp: '10.240.11.16', bizIp: '10.240.11.17', deviceModel: 'CE12800', deviceName: 'MultiVar-BorderGateway', vendor: '3COM', bizSystem: '边界网关系统', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-005', regionCategory: '一级资源池', regionCenter: '东北', resourcePool: '北京资源池', pod: '二期一阶段POD7', mgmtIp: '10.240.11.18', bizIp: '10.240.11.19', deviceModel: 'SR6608', deviceName: 'MultiVar-EdgeNode-05', vendor: 'A10', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-006', regionCategory: '省级IT云', regionCenter: '华北二', resourcePool: '呼池', pod: '呼池-虚拟015', mgmtIp: '10.240.23.10', bizIp: '10.240.23.11', deviceModel: 'RH2288H', deviceName: 'MultiVar-HadoopMaster-01', vendor: 'DELL', bizSystem: '大数据平台', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-007', regionCategory: '池外', regionCenter: '华中', resourcePool: '甘肃资源池', pod: '呼池-虚拟015', mgmtIp: '10.240.24.20', bizIp: '10.240.24.21', deviceModel: 'OceanStor', deviceName: 'MultiVar-StorageArray-02', vendor: 'BEA', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-008', regionCategory: '一级资源池', regionCenter: '华东一', resourcePool: '广东资源池', pod: '东莞-二期-ironic-POD1资源池', mgmtIp: '10.240.25.30', bizIp: '10.240.25.31', deviceModel: 'CE12800', deviceName: 'MultiVar-SpineSwitch-04', vendor: 'HUAWEI', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-009', regionCategory: '省级IT云', regionCenter: '华北', resourcePool: '重庆资源池', pod: '东莞-vmware', mgmtIp: '10.240.26.40', bizIp: '10.240.26.41', deviceModel: 'R740', deviceName: 'MultiVar-KafkaWorker-08', vendor: 'BMC', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-010', regionCategory: '一级资源池', regionCenter: '东北', resourcePool: '北京资源池', pod: '二期一阶段POD7', mgmtIp: '10.240.27.50', bizIp: '10.240.27.51', deviceModel: 'A10-ADC', deviceName: 'MultiVar-LoadBalancer-02', vendor: 'A10', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-011', regionCategory: '池外', regionCenter: '华北一', resourcePool: '安徽资源池', pod: '东莞-ironic资源池', mgmtIp: '10.240.28.60', bizIp: '10.240.28.61', deviceModel: 'ProLiant', deviceName: 'MultiVar-RedisCluster-03', vendor: '3COM', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-012', regionCategory: '省级IT云', regionCenter: '华南一', resourcePool: '东莞资源池', pod: '东莞-ironic资源池', mgmtIp: '10.240.29.70', bizIp: '10.240.29.71', deviceModel: 'RH2288H', deviceName: 'MultiVar-ESComputeNode-06', vendor: 'DELL', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-013', regionCategory: '省级IT云', regionCenter: '华北一', resourcePool: '安徽资源池', pod: '东莞-vmware', mgmtIp: '10.240.31.10', bizIp: '10.240.31.11', deviceModel: 'ProLiant', deviceName: 'MultiVar-SearchService-01', vendor: 'BEA', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
  { sn: 'SN-MULTI-014', regionCategory: '省级IT云', regionCenter: '华北一', resourcePool: '安徽资源池', pod: '东莞-vmware', mgmtIp: '10.240.31.12', bizIp: '10.240.31.13', deviceModel: 'RH2288H', deviceName: 'MultiVar-InferenceEngine-02', vendor: 'HUAWEI', bizSystem: '', osType: 'Linux', osVersion: '78.6.0.0', modelType: 'multi' },
];


import { ModelBoardView } from './ModelBoardView';

interface MetricAnomalyViewProps {
  onOpenModelBoard?: () => void;
}

export const MetricAnomalyView: React.FC<MetricAnomalyViewProps> = ({ onOpenModelBoard }) => {
  // Top model tabs ('single' | 'dynamic' | 'multi')
  const [modelTypeTab, setModelTypeTab] = useState<'single' | 'dynamic' | 'multi'>('single');

  // Dimension filter states (Allowing 'ALL' or specific option)
  const [selectedRegionCategory, setSelectedRegionCategory] = useState<string>('省级IT云');
  const [selectedRegionCenter, setSelectedRegionCenter] = useState<string>('华北');
  const [selectedResourcePool, setSelectedResourcePool] = useState<string>('重庆资源池');
  const [selectedPod, setSelectedPod] = useState<string>('东莞-vmware');
  const [selectedVendor, setSelectedVendor] = useState<string>('BMC');

  const [period, setPeriod] = useState('');
  const [searchMode, setSearchMode] = useState('请选择查询方式');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReportItem, setActiveReportItem] = useState<MetricAnomalyItem | null>(null);

  const [isKanbanModalOpen, setIsKanbanModalOpen] = useState(false);
  const [activeKanbanItem, setActiveKanbanItem] = useState<MetricAnomalyItem | null>(null);

  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Active raw dataset based on top tab
  const activeDataset = useMemo(() => {
    if (modelTypeTab === 'single') return SINGLE_METRIC_DATASET;
    if (modelTypeTab === 'dynamic') return DYNAMIC_THRESHOLD_DATASET;
    return MULTI_METRIC_DATASET;
  }, [modelTypeTab]);

  // Reactive filtering logic
  const filteredDisplayItems = useMemo(() => {
    return activeDataset.filter((item) => {
      if (selectedRegionCategory !== 'ALL' && selectedRegionCategory !== item.regionCategory) return false;
      if (selectedRegionCenter !== 'ALL' && selectedRegionCenter !== item.regionCenter) return false;
      if (selectedResourcePool !== 'ALL' && selectedResourcePool !== item.resourcePool) return false;
      if (selectedPod !== 'ALL' && selectedPod !== item.pod) return false;
      if (selectedVendor !== 'ALL' && selectedVendor !== item.vendor) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchSn = item.sn.toLowerCase().includes(q);
        const matchName = item.deviceName.toLowerCase().includes(q);
        const matchIp = item.mgmtIp.includes(q) || item.bizIp.includes(q);
        if (!matchSn && !matchName && !matchIp) return false;
      }
      return true;
    });
  }, [activeDataset, selectedRegionCategory, selectedRegionCenter, selectedResourcePool, selectedPod, selectedVendor, searchQuery]);

  // Handle Tab Switch (Pre-selects matching pill states matching user screenshot for 'dynamic')
  const handleModelTabSwitch = (tab: 'single' | 'dynamic' | 'multi') => {
    setModelTypeTab(tab);
    if (tab === 'dynamic') {
      setSelectedRegionCategory('省级IT云');
      setSelectedRegionCenter('华北');
      setSelectedResourcePool('重庆资源池');
      setSelectedPod('东莞-vmware');
      setSelectedVendor('BMC');
    } else if (tab === 'single') {
      setSelectedRegionCategory('省级IT云');
      setSelectedRegionCenter('华北二');
      setSelectedResourcePool('呼池');
      setSelectedPod('ALL');
      setSelectedVendor('ALL');
    } else {
      setSelectedRegionCategory('省级IT云');
      setSelectedRegionCenter('华北一');
      setSelectedResourcePool('安徽资源池');
      setSelectedPod('ALL');
      setSelectedVendor('ALL');
    }
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedRegionCategory('ALL');
    setSelectedRegionCenter('ALL');
    setSelectedResourcePool('ALL');
    setSelectedPod('ALL');
    setSelectedVendor('ALL');
    setSearchQuery('');
    setPeriod('');
    setNotificationToast('已重置所有筛选条件');
    setTimeout(() => setNotificationToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>指标异常发现</span>
        </h2>
        <div className="text-xs text-slate-400 font-mono">
          控制台数据实时对齐：<span className="text-cyan-400 font-bold">2026-10-16</span>
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Right Filter and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>IaaS平台异常发现</span>
            </div>
            <div className="pl-5 space-y-1">
              <button className="w-full text-left text-xs px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 flex items-center justify-between">
                <span>服务器监控</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Filter Grid + Table */}
        <div className="lg:col-span-10 space-y-6">
          {/* Top Model Type Nav Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => handleModelTabSwitch('single')}
              className={`pb-3 transition-all relative ${
                modelTypeTab === 'single'
                  ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              单指标异常检测模型
            </button>
            <button
              onClick={() => handleModelTabSwitch('dynamic')}
              className={`pb-3 transition-all relative ${
                modelTypeTab === 'dynamic'
                  ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              动态阈值模型
            </button>
            <button
              onClick={() => handleModelTabSwitch('multi')}
              className={`pb-3 transition-all relative ${
                modelTypeTab === 'multi'
                  ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              多指标异常检测模型
            </button>
          </div>

          {/* Section Title & Filter Grid */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-l-4 border-cyan-400 pl-3">
              <h3 className="text-xs font-bold text-cyan-400">筛选对象指标模型</h3>
              <span className="text-[11px] text-slate-400 font-mono">
                当前分类算法: <strong className="text-white">{modelTypeTab === 'single' ? '单指标 (Prophet)' : modelTypeTab === 'dynamic' ? '动态阈值 (3Sigma+Envelope)' : '多指标 (IsolationForest)'}</strong>
              </span>
            </div>

            {/* Filter Dimensions List */}
            <div className="space-y-3 text-xs">
              {/* Row 1: 区域分类 */}
              <div className="flex items-center gap-4">
                <span className="text-slate-400 shrink-0 w-24 text-right">区域分类:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {['ALL', '一级资源池', '省级IT云', '池外'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedRegionCategory(item)}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        selectedRegionCategory === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {item === 'ALL' ? '全部' : item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: 区域中心 */}
              <div className="flex items-center gap-4">
                <span className="text-slate-400 shrink-0 w-24 text-right">区域中心:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {['ALL', '东北', '华北', '华北一', '华北二', '华中', '华东一', '华南一'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedRegionCenter(item)}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        selectedRegionCenter === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {item === 'ALL' ? '全部' : item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: 资源池 */}
              <div className="flex items-center gap-4">
                <span className="text-slate-400 shrink-0 w-24 text-right">资源池:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {['ALL', '东莞资源池', '安徽资源池', '北京资源池', '重庆资源池', '广东资源池', '呼池', '甘肃资源池'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedResourcePool(item)}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        selectedResourcePool === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {item === 'ALL' ? '全部' : item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: POD */}
              <div className="flex items-center gap-4">
                <span className="text-slate-400 shrink-0 w-24 text-right">POD:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {['ALL', '东莞-ironic资源池', '东莞-kvm资源池', '东莞-vmware', '东莞-二期-ironic-POD1资源池', '二期一阶段POD7', '呼池-虚拟015'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedPod(item)}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        selectedPod === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {item === 'ALL' ? '全部' : item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: 设备厂家 */}
              <div className="flex items-center gap-4">
                <span className="text-slate-400 shrink-0 w-24 text-right">设备厂家:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {['ALL', '3COM', 'A10', 'BEA', 'BMC', 'HUAWEI', 'DELL'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedVendor(item)}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        selectedVendor === item
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {item === 'ALL' ? '全部' : item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 6: 报告统计周期 */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <span className="text-slate-400 shrink-0 w-24 text-right">报告统计周期:</span>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5"
                >
                  <option value="">请选择统计周期</option>
                  <option value="3d">近3天</option>
                  <option value="7d">近7天</option>
                  <option value="30d">近30天</option>
                </select>
                <div className="flex items-center gap-2 font-mono">
                  <input type="date" className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5" />
                  <span className="text-slate-500">—</span>
                  <input type="date" className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5" />
                </div>
                <span className="text-slate-500 text-[11px]">(如不选择统计周期，默认查询近3天结果数据)</span>
              </div>

              {/* Row 7: 精确查询 & Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <span className="text-slate-400 shrink-0 w-24 text-right">精确查询:</span>
                <select
                  value={searchMode}
                  onChange={(e) => setSearchMode(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5"
                >
                  <option>请选择查询方式</option>
                  <option>按序列号</option>
                  <option>按设备IP</option>
                  <option>按设备名称</option>
                </select>
                <input
                  type="text"
                  placeholder="请输入查询内容"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 w-48 focus:outline-none focus:border-cyan-500"
                />

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => {
                      setNotificationToast(`已按关键项筛选出 ${filteredDisplayItems.length} 条算法结果！`);
                      setTimeout(() => setNotificationToast(null), 3000);
                    }}
                    className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-sky-500/20 flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700/80 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl space-y-2">
            <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">
                查询结果列表 (<strong className="text-cyan-400 font-mono">{filteredDisplayItems.length}</strong> 条)
              </span>
              <span className="text-slate-500 text-[11px]">
                实时离群计算引擎: {modelTypeTab === 'single' ? 'Prophet 单指标时序分解' : modelTypeTab === 'dynamic' ? '3Sigma 动态包络预测' : 'IsolationForest 多维联合特征'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900/90 text-slate-400 font-medium border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3 whitespace-nowrap">序列号</th>
                    <th className="py-3 px-3 whitespace-nowrap">区域分类</th>
                    <th className="py-3 px-3 whitespace-nowrap">区域中心</th>
                    <th className="py-3 px-3 whitespace-nowrap">资源池</th>
                    <th className="py-3 px-3 whitespace-nowrap">POD</th>
                    <th className="py-3 px-3 whitespace-nowrap">管理IP地址</th>
                    <th className="py-3 px-3 whitespace-nowrap">业务IP地址</th>
                    <th className="py-3 px-3 whitespace-nowrap">设备型号</th>
                    <th className="py-3 px-3 whitespace-nowrap">设备名称</th>
                    <th className="py-3 px-3 whitespace-nowrap">设备厂家</th>
                    <th className="py-3 px-3 whitespace-nowrap">业务系统</th>
                    <th className="py-3 px-3 whitespace-nowrap">操作系统类型</th>
                    <th className="py-3 px-3 whitespace-nowrap">操作系统版本</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredDisplayItems.length > 0 ? (
                    filteredDisplayItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3 px-3 text-slate-200 font-semibold whitespace-nowrap">{item.sn}</td>
                        <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{item.regionCategory}</td>
                        <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{item.regionCenter}</td>
                        <td className="py-3 px-3 text-slate-400 font-sans whitespace-nowrap">{item.resourcePool}</td>
                        <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{item.pod}</td>
                        <td className="py-3 px-3 text-cyan-400 whitespace-nowrap">{item.mgmtIp}</td>
                        <td className="py-3 px-3 text-cyan-400 whitespace-nowrap">{item.bizIp}</td>
                        <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{item.deviceModel}</td>
                        <td className="py-3 px-3 text-slate-200 font-sans font-medium whitespace-nowrap">{item.deviceName}</td>
                        <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{item.vendor}</td>
                        <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{item.bizSystem || ''}</td>
                        <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{item.osType || 'Linux'}</td>
                        <td className="py-3 px-3 text-slate-300 font-sans whitespace-nowrap">{item.osVersion || '78.6.0.0'}</td>
                        <td className="py-3 px-3 text-right space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setActiveKanbanItem(item);
                              setIsKanbanModalOpen(true);
                            }}
                            className="text-sky-400 hover:text-sky-300 font-medium"
                          >
                            模型看板
                          </button>
                          <button
                            onClick={() => {
                              setActiveReportItem(item);
                              setIsReportModalOpen(true);
                            }}
                            className="text-sky-400 hover:text-sky-300 font-medium"
                          >
                            AI异常发现报告
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={14} className="py-8 text-center text-slate-500 font-sans">
                        暂无符合筛选条件的数据节点，请尝试切换标签或点击【重置】。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== FULL MODEL BOARD VIEW ===================== */}
      {isKanbanModalOpen && activeKanbanItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b0f19] p-6 animate-fadeIn">
          <ModelBoardView
            sn={activeKanbanItem.sn}
            mgmtIp={activeKanbanItem.mgmtIp}
            bizIp={activeKanbanItem.bizIp}
            onBack={() => setIsKanbanModalOpen(false)}
          />
        </div>
      )}

      {/* ===================== MODAL 2: AI异常发现报告 (With 2026 Timestamps) ===================== */}
      {isReportModalOpen && activeReportItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-3xl p-6 space-y-5 shadow-2xl shadow-cyan-950/50 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>AI 异常发现诊断分析报告 - {activeReportItem.deviceName}</span>
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>检测时间: <strong className="text-cyan-300 font-mono">2026-10-16 14:30:00</strong></span>
                  <span>分析周期: <strong className="text-slate-200">近 3 天</strong></span>
                </div>
                <p className="text-slate-300 leading-relaxed pt-2">
                  对设备 <code className="text-sky-300 font-mono">{activeReportItem.sn}</code> ({activeReportItem.deviceName}) 在【{activeReportItem.resourcePool} / {activeReportItem.pod}】节点进行了算法推理分析。指标在过去 72 小时内概率密度正常，离群噪音低于 0.08%。
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400">检测点数</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 mt-1">43,200</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400">离群点数</div>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">0</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400">置信区间</div>
                  <div className="text-lg font-mono font-bold text-sky-400 mt-1">99.2%</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl"
              >
                确认关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-2xl shadow-xl shadow-cyan-950/60 text-xs font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notificationToast}</span>
        </div>
      )}
    </div>
  );
};
