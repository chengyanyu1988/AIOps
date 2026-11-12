export type CapabilityStatus = 'built' | 'building' | 'planned';

export interface CapabilityNode {
  id: string;
  title: string;
  category: 'foundation' | 'scenario';
  status: CapabilityStatus; // '已建' | '在建' | '规划'
  metrics: { label: string; value: string | number; unit?: string }[];
  description: string;
  subModules?: string[];
  owner?: string;
  activeModelsCount?: number;
}

export interface KPIItem {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  changeRate: number; // e.g. 10.35
  isUp: boolean;
  subMetrics?: { label: string; value: string }[];
}

export interface ModelCategoryItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ResourceMonitorCard {
  id: string;
  title: string;
  type: 'host' | 'network' | 'pool' | 'cluster';
  icon: string;
  singleMetricCount: number;
  modelCount: number;
  managedDevicesCount: number;
  status: 'nominal' | 'warning' | 'critical';
}

export interface NotificationItem {
  id: string;
  deviceCode: string;
  location: string;
  timestamp: string;
  contentType: string;
  level: 'P1' | 'P2' | 'P3';
  status: 'pending' | 'diagnosing' | 'resolved';
}

export interface TrendPredictionItem {
  id: number;
  deviceName: string;
  ip: string;
  riskPercent: number;
  category: string; // '交换机' | '路由器' | '防火墙' | '负载均衡' | 'SDN'
  predictionType: 'fault' | 'capacity' | 'performance';
}

export interface Top5AlertItem {
  id: string;
  name: string;
  alertCount: number;
  metric: string;
  category: string;
}

export interface ClassifiedTrendPoint {
  date: string;
  anomalyAlerts: number; // 异常检测模型告警数
  regressionAlerts: number; // 回归预测模型告警数
}

export interface AlgorithmFamily {
  id: string;
  name: string;
  description: string;
  modelTypes: string[];
  activeCount: number;
  accuracy: string;
  icon: string;
}
