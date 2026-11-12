import React, { useState } from 'react';
import { Cpu, Plus, Search, CheckCircle2, Clock, Layers, Database, Calendar, Play, ChevronRight, ChevronDown, AlertCircle, ArrowRight, ArrowLeft, LayoutGrid, List, ArrowLeft as BackIcon, X, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface AIModelRecord {
  id: string;
  name: string;
  category: string;
  algorithm: string;
  accuracy: string;
  status: 'active' | 'training' | 'offline';
  updateTime: string;
  owner: string;
}

interface TrainingProject {
  id: string;
  code: string;
  name: string;
  dataType: string;
  problemType: string;
  status: '已完成' | '训练中' | '失败';
  modelCount: number;
  successCount: number;
  failCount: number;
  progress: number;
  elapsedTime: string;
  createTime: string;
  finishTime: string;
  taskScenario: string;
  targetObject: string;
  processData: string;
}

interface SubModelItem {
  id: string;
  modelId: string;
  createTime: string;
  problem: string;
  dataName: string;
  dataType: string;
  status: '训练中' | '已完成' | '待训练';
  startTime: string;
  firstFinishTime: string;
  latestFinishTime: string;
}

// Recent descending training projects in October 2026 matching screenshots
const INITIAL_TRAINING_PROJECTS: TrainingProject[] = [
  { id: '1', code: '0112584', name: '资源池服务器容量预测', dataType: '时序', problemType: '回归/预测', status: '训练中', modelCount: 1500, successCount: 750, failCount: 0, progress: 50, elapsedTime: '5小时30分30秒', createTime: '2026-10-15 13:54:61', finishTime: '--', taskScenario: '容量预测', targetObject: '资源池服务器', processData: 'CPU/内存/带宽' },
  { id: '2', code: 'sn-190001', name: '核心交换机时序异常检测', dataType: '时序', problemType: '异常检测', status: '已完成', modelCount: 1500, successCount: 1500, failCount: 0, progress: 100, elapsedTime: '5小时30分30秒', createTime: '2026-10-14 13:54:61', finishTime: '2026-10-14 18:54:61', taskScenario: '异常发现', targetObject: '交换机', processData: '接口流量/丢包率' },
  { id: '3', code: 'SN 654482', name: '云数据库存储空间超载预警', dataType: '时序', problemType: '回归/预测', status: '已完成', modelCount: 1500, successCount: 1500, failCount: 0, progress: 100, elapsedTime: '5小时30分30秒', createTime: '2026-10-13 13:54:61', finishTime: '2026-10-13 18:54:61', taskScenario: '容量预测', targetObject: '云数据库', processData: '存储使用率/IOPS' },
  { id: '4', code: 'No.99876', name: 'K8s集群Pod高并发吞吐预测', dataType: '时序', problemType: '回归/预测', status: '训练中', modelCount: 1500, successCount: 750, failCount: 0, progress: 50, elapsedTime: '5小时30分30秒', createTime: '2026-10-12 10:54:61', finishTime: '--', taskScenario: '流量预测', targetObject: 'K8s Pod', processData: 'QPS/RT' },
  { id: '5', code: 'sn-330654', name: '防火墙安全日志异常聚类', dataType: '表格', problemType: '分类聚类', status: '训练中', modelCount: 1200, successCount: 400, failCount: 0, progress: 35, elapsedTime: '3小时15分10秒', createTime: '2026-10-11 09:54:61', finishTime: '--', taskScenario: '安全审计', targetObject: '防火墙', processData: '安全日志/拦截率' },
  { id: '6', code: 'sn-02525', name: '微服务网关CPU动态基线', dataType: '时序', problemType: '动态阈值', status: '训练中', modelCount: 2000, successCount: 1000, failCount: 0, progress: 50, elapsedTime: '4小时10分00秒', createTime: '2026-10-10 19:54:61', finishTime: '--', taskScenario: '动态阈值', targetObject: '网关集群', processData: 'CPU利用率' },
];

const INITIAL_SUB_MODELS: SubModelItem[] = [
  { id: '1', modelId: 'd23f43t', createTime: '2026-10-15 15:30:12', problem: '预测', dataName: 'cpu_usage_percent', dataType: '时序数据', status: '训练中', startTime: '2026-10-15 16:00', firstFinishTime: '-', latestFinishTime: '-' },
  { id: '2', modelId: 'SN_654482', createTime: '2026-10-14 14:30', problem: '电机过载预警', dataName: '电机电流日志', dataType: '时序数据', status: '已完成', startTime: '2026-10-14 15:00', firstFinishTime: '2026-10-14 16:20', latestFinishTime: '2026-10-14 16:20' },
  { id: '3', modelId: 'No.99876', createTime: '2026-10-13 11:15', problem: '图像缺陷识别', dataName: 'PCB板焊点检测图像', dataType: '图像数据', status: '已完成', startTime: '2026-10-13 12:00', firstFinishTime: '2026-10-13 13:45', latestFinishTime: '2026-10-13 13:45' },
];

interface RepoModelItem {
  id: string;
  modelId: string;
  problemType: string;
  dataName: string;
  dataType: string;
  algorithmName: string;
  score: string;
  createTime: string;
  latestFinishTime: string;
  projectName: string;
  projectId: string;
  status: '待启用' | '已启用' | '已停用' | '失败';
}

const INITIAL_REPO_MODELS: RepoModelItem[] = [
  {
    id: '1',
    modelId: 'sn-190001',
    problemType: '设备过热预警',
    dataName: '风机轴承振动数据',
    dataType: '时序数据',
    algorithmName: 'LSTM + Attention',
    score: '0.96',
    createTime: '2026-10-10 09:00',
    latestFinishTime: '2026-10-15 11:30',
    projectName: '风机状态预测_V2',
    projectId: 'sn-001001',
    status: '待启用'
  },
  {
    id: '2',
    modelId: 'SN_654482',
    problemType: '电机过载预警',
    dataName: '电机电流日志',
    dataType: '时序数据',
    algorithmName: 'Prophet',
    score: '0.94',
    createTime: '2026-10-09 14:30',
    latestFinishTime: '2026-10-14 16:20',
    projectName: '电机健康评估_V1',
    projectId: 'sn-001002',
    status: '待启用'
  },
  {
    id: '3',
    modelId: 'No.99876',
    problemType: '图像缺陷识别',
    dataName: 'PCB板焊点检测图像',
    dataType: '图像数据',
    algorithmName: 'ResNet50 + YOLOv5',
    score: '0.98',
    createTime: '2026-10-08 11:15',
    latestFinishTime: '2026-10-13 13:45',
    projectName: 'PCB质检系统_V3',
    projectId: 'sn-001003',
    status: '待启用'
  },
  {
    id: '4',
    modelId: 'sn-330654',
    problemType: '网络延迟预测',
    dataName: '工业网关流量日志',
    dataType: '文本数据',
    algorithmName: 'LightGBM',
    score: '0.92',
    createTime: '2026-10-07 16:45',
    latestFinishTime: '2026-10-12 18:10',
    projectName: '网络稳定性分析_V1',
    projectId: 'sn-001004',
    status: '待启用'
  },
  {
    id: '5',
    modelId: 'sn-02525',
    problemType: '变压器油温异常',
    dataName: '变压器温度传感器数据',
    dataType: '时序数据',
    algorithmName: 'ARIMA + XGBoost',
    score: '0.89',
    createTime: '2026-10-06 08:30',
    latestFinishTime: '2026-10-11 10:00',
    projectName: '变压器监控_V2',
    projectId: 'sn-001005',
    status: '待启用'
  },
  {
    id: '6',
    modelId: 'sn-336',
    problemType: '生产效率优化',
    dataName: '产线节拍时间数据',
    dataType: '时序数据',
    algorithmName: 'Random Forest',
    score: '0.93',
    createTime: '2026-10-05 13:20',
    latestFinishTime: '2026-10-10 14:50',
    projectName: '节拍分析系统_V1',
    projectId: 'sn-001006',
    status: '待启用'
  },
  {
    id: '7',
    modelId: 'sn-100007',
    problemType: '制冷系统故障诊断',
    dataName: '压缩机压力数据',
    dataType: '时序数据',
    algorithmName: 'CNN-LSTM',
    score: '0.95',
    createTime: '2026-10-04 10:00',
    latestFinishTime: '2026-10-09 11:50',
    projectName: '冷却系统诊断_V2',
    projectId: 'sn-001007',
    status: '待启用'
  },
  {
    id: '8',
    modelId: 'SN_100008',
    problemType: '空气质量监测',
    dataName: '车间PM2.5传感器数据',
    dataType: '时序数据',
    algorithmName: 'SVR + PCA',
    score: '0.91',
    createTime: '2026-10-03 15:45',
    latestFinishTime: '2026-10-08 17:15',
    projectName: '环境监测系统_V1',
    projectId: 'sn-001008',
    status: '待启用'
  },
  {
    id: '9',
    modelId: 'No.100009',
    problemType: '设备寿命预测',
    dataName: '机床主轴运行数据',
    dataType: '时序数据',
    algorithmName: 'Survival Analysis',
    score: '0.90',
    createTime: '2026-10-02 17:10',
    latestFinishTime: '2026-10-07 18:40',
    projectName: '主轴寿命预测_V1',
    projectId: 'sn-001009',
    status: '待启用'
  },
  {
    id: '10',
    modelId: 'sn-100010',
    problemType: '视觉检测系统',
    dataName: '汽车零部件表面瑕疵图像',
    dataType: '图像数据',
    algorithmName: 'EfficientNet-B3',
    score: '0.97',
    createTime: '2026-10-01 09:25',
    latestFinishTime: '2026-10-06 11:30',
    projectName: '零部件质检系统_V2',
    projectId: 'sn-001010',
    status: '待启用'
  }
];

const INITIAL_MODELS: AIModelRecord[] = [
  { id: 'MOD-001', name: '核心网关时序异常检测v4', category: '单指标异常检测', algorithm: 'IsolationForest', accuracy: '98.5%', status: 'active', updateTime: '2026-10-15 23:45:10', owner: '算法一组' },
  { id: 'MOD-002', name: '云主机CPU动态基线预测', category: '动态阈值', algorithm: 'Prophet-V2', accuracy: '97.2%', status: 'active', updateTime: '2026-10-15 22:15:30', owner: '智能运维组' },
];

interface ExplorationTaskItem {
  id: string;
  taskSeq: number;
  dataName: string;
  dbName: string;
  tableName: string;
  status: '执行中' | '已完成' | '失败';
  startTime: string;
  finishTime: string;
}

const INITIAL_EXPLORATION_TASKS: ExplorationTaskItem[] = [
  { id: 'exp-1', taskSeq: 1, dataName: '(单指标)', dbName: 'ai_model_data', tableName: 'user_age_distribution', status: '执行中', startTime: '2026-10-15 11:00:01', finishTime: '--' },
  { id: 'exp-2', taskSeq: 2, dataName: '(多指标, 多指标, 多指标)', dbName: 'ai_model_data', tableName: 'gmv_roi_conversion', status: '已完成', startTime: '2026-10-15 10:32:47', finishTime: '2026-10-15 10:35:23' },
  { id: 'exp-3', taskSeq: 3, dataName: '(单指标)', dbName: 'ai_model_data', tableName: 'risk_rate_task', status: '已完成', startTime: '2026-10-15 10:28:21', finishTime: '2026-10-15 10:32:41' },
  { id: 'exp-4', taskSeq: 4, dataName: '(多指标, 多指标, 多指标)', dbName: 'ai_model_data', tableName: 'marketing_click_task', status: '已完成', startTime: '2026-10-15 10:24:30', finishTime: '2026-10-15 10:24:30' },
  { id: 'exp-5', taskSeq: 5, dataName: '(多指标, 多指标, 多指标)', dbName: 'ai_model_data', tableName: 'product_sales_margin', status: '已完成', startTime: '2026-10-15 10:15:51', finishTime: '2026-10-15 10:17:31' },
  { id: 'exp-6', taskSeq: 6, dataName: '(多指标, 多指标, 多指标)', dbName: 'ai_model_data', tableName: 'finance_revenue_cost', status: '已完成', startTime: '2026-10-15 10:12:27', finishTime: '2026-10-15 10:16:15' },
  { id: 'exp-7', taskSeq: 7, dataName: '(单指标)', dbName: 'ai_model_data', tableName: 'finance_multi_revenue_profit', status: '已完成', startTime: '2026-10-15 10:10:35', finishTime: '2026-10-15 10:12:35' },
  { id: 'exp-8', taskSeq: 8, dataName: '(单指标)', dbName: 'ai_model_data', tableName: 'user_active_days', status: '执行中', startTime: '2026-10-15 10:00:01', finishTime: '--' },
  { id: 'exp-9', taskSeq: 9, dataName: '(多指标, 多指标, 多指标)', dbName: 'ai_model_data', tableName: 'user_login_frequency', status: '已完成', startTime: '2026-10-15 09:30:01', finishTime: '2026-10-15 09:30:04' },
  { id: 'exp-10', taskSeq: 10, dataName: '(单指标)', dbName: 'ai_model_data', tableName: 'risk_overdue_ratio', status: '已完成', startTime: '2026-10-15 09:26:11', finishTime: '2026-10-15 09:29:42' },
];

interface MajorEventDateItem {
  id: string;
  seq: number;
  eventName: string;
  dateRange: string;
  description: string;
}

const INITIAL_MAJOR_EVENT_DATES: MajorEventDateItem[] = [
  { id: 'evt-1', seq: 1, eventName: '2026.11.11 双十一大促重保', dateRange: '2026.11.10-2026.11.12', description: '核心交易链路与高并发压力保障' },
  { id: 'evt-2', seq: 2, eventName: '2026.10.1 国庆黄金周保障', dateRange: '2026.10.01-2026.10.08', description: '国庆安保维稳与流量高峰监控' },
  { id: 'evt-3', seq: 3, eventName: '2026.9.3 阅兵重大会议', dateRange: '2026.09.01-2026.09.05', description: '9.3阅兵，特级安保维稳保障' },
  { id: 'evt-4', seq: 4, eventName: '2026年8月国家级攻防演习', dateRange: '2026.08.05-2026.08.15', description: '全网实战攻防演练与安全重保' },
  { id: 'evt-5', seq: 5, eventName: '2026.6.18 年中狂欢节', dateRange: '2026.06.16-2026.06.20', description: '电商年中大促算力动态扩容' },
  { id: 'evt-6', seq: 6, eventName: '2026.5.1 劳动节假期维稳', dateRange: '2026.05.01-2026.05.05', description: '节假日出行流量与系统维稳' },
  { id: 'evt-7', seq: 7, eventName: '2026年3月春季网络攻防演练', dateRange: '2026.03.05-2026.03.12', description: '季度网络安全攻防与应急预演' },
  { id: 'evt-8', seq: 8, eventName: '2026年1月春节返乡高峰保障', dateRange: '2026.01.29-2026.02.08', description: '春节高并发业务容灾调度' },
  { id: 'evt-9', seq: 9, eventName: '2026年7月全网多活容灾演练', dateRange: '2026.07.12-2026.07.15', description: '主备机房切流与容灾演练' },
  { id: 'evt-10', seq: 10, eventName: '2026-2027 跨年双十二及倒计时', dateRange: '2026.12.12-2027.01.02', description: '跨年业务高峰与系统重保' },
];

const MOCK_METRIC_LIST = [
  { id: 'm1', name: 'cpu_usage_percent', tableName: 'cpu_usage_percent' },
  { id: 'm2', name: 'if_errorPacketIn_count', tableName: 'if_errorPacketIn_count' },
  { id: 'm3', name: 'cpu_usage_percent', tableName: 'cpu_usage_percent' },
  { id: 'm4', name: 'memory_usage_bytes', tableName: 'memory_usage_bytes' },
  { id: 'm5', name: 'disk_read_iops', tableName: 'disk_read_iops' },
  { id: 'm6', name: 'network_rx_packets', tableName: 'network_rx_packets' },
  { id: 'm7', name: 'tcp_connection_errors', tableName: 'tcp_connection_errors' },
  { id: 'm8', name: 'http_response_latency', tableName: 'http_response_latency' },
];

const MOCK_DEVICE_LIST = [
  { id: 'd1', sn: 'sn-190001', type: 'Server', ip: '10.240.1.15', model: 'RH2288H', name: 'DB-Node-01', vendor: 'Huawei', region: '华东1区' },
  { id: 'd2', sn: 'SN_654482', type: 'Switch', ip: '10.240.2.20', model: 'CE12800', name: 'Core-SW-01', vendor: 'Huawei', region: '华北2区' },
  { id: 'd3', sn: 'No.99876', type: 'Gateway', ip: '10.240.0.1', model: 'SR6608', name: 'GW-Router-A', vendor: 'H3C', region: '华南1区' },
  { id: 'd4', sn: 'sn-330854', type: 'Server', ip: '10.240.1.88', model: 'R740', name: 'App-Host-03', vendor: 'Dell', region: '西南区' },
  { id: 'd5', sn: 'sn-02525', type: 'Storage', ip: '10.240.5.12', model: 'OceanStor', name: 'SAN-Storage-A', vendor: 'Huawei', region: '华东2区' },
  { id: 'd6', sn: 'sn-336', type: 'Server', ip: '10.240.1.99', model: 'ProLiant', name: 'Web-Node-08', vendor: 'HPE', region: '华北1区' },
];

interface AIModelingManagementViewProps {
  initialSubView?: string;
}

export const AIModelingManagementView: React.FC<AIModelingManagementViewProps> = ({ initialSubView = 'models' }) => {
  const [subView, setSubView] = useState<string>(initialSubView);

  React.useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView);
    }
  }, [initialSubView]);

  const [models, setModels] = useState<AIModelRecord[]>(INITIAL_MODELS);
  const [searchTerm, setSearchTerm] = useState('');

  const [trainingViewMode, setTrainingViewMode] = useState<'card' | 'list'>('card');
  const [queryType, setQueryType] = useState('模型工程名称');
  const [queryContent, setQueryContent] = useState('');
  const [timeQueryType, setTimeQueryType] = useState('创建时间');
  const [sortBy, setSortBy] = useState('创建时间');

  const [selectedProjectForModels, setSelectedProjectForModels] = useState<TrainingProject | null>(null);
  const [selectedSubModelIds, setSelectedSubModelIds] = useState<string[]>(['1']);

  const [isModelInfoModalOpen, setIsModelInfoModalOpen] = useState(false);
  const [activeModelInfo, setActiveModelInfo] = useState<SubModelItem | null>(null);

  const [wizardStep, setWizardStep] = useState<number>(1);
  const [dataType, setDataType] = useState<'timeseries' | 'table'>('timeseries');
  const [timeSeriesCategory, setTimeSeriesCategory] = useState<'dynamic_threshold' | 'anomaly' | 'forecast'>('dynamic_threshold');

  const [projectName, setProjectName] = useState('');
  const [projectUniqueId, setProjectUniqueId] = useState('sn.001001');
  const [taskScenario, setTaskScenario] = useState('');
  const [targetObject, setTargetObject] = useState('');
  const [processData, setProcessData] = useState('');

  const [isSidebarOpenTimeSeries, setIsSidebarOpenTimeSeries] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModelName, setNewModelName] = useState('');

  const [repoTab, setRepoTab] = useState<string>('待启用模型库');
  const [isCustomRepoOpen, setIsCustomRepoOpen] = useState<boolean>(true);
  const [isPublicRepoOpen, setIsPublicRepoOpen] = useState<boolean>(true);
  const [isAlgorithmRepoOpen, setIsAlgorithmRepoOpen] = useState<boolean>(true);
  const [isRepoFilterCollapsed, setIsRepoFilterCollapsed] = useState<boolean>(false);

  const [repoSearchId, setRepoSearchId] = useState('');
  const [repoSearchProblem, setRepoSearchProblem] = useState('');
  const [repoSearchDataName, setRepoSearchDataName] = useState('');
  const [repoSearchDataType, setRepoSearchDataType] = useState('');

  const [selectedRepoRowIds, setSelectedRepoRowIds] = useState<string[]>(['1']);
  const [repoModelList, setRepoModelList] = useState<RepoModelItem[]>(INITIAL_REPO_MODELS);

  const [isRepoDetailModalOpen, setIsRepoDetailModalOpen] = useState(false);
  const [activeRepoDetail, setActiveRepoDetail] = useState<RepoModelItem | null>(null);

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RepoModelItem | null>(null);

  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const [explorationTasks, setExplorationTasks] = useState<ExplorationTaskItem[]>(INITIAL_EXPLORATION_TASKS);
  const [selectedExplorationIds, setSelectedExplorationIds] = useState<string[]>(['exp-1']);
  const [searchDataName, setSearchDataName] = useState('');

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [leftSearchMetric, setLeftSearchMetric] = useState('');
  const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>(['m1', 'm2', 'm3']);

  const [rightSearchMode, setRightSearchMode] = useState('请选择查询方式');
  const [rightSearchQuery, setRightSearchQuery] = useState('');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(['d2', 'd5', 'd6']);

  const [selectedExploreTags, setSelectedExploreTags] = useState([
    { id: 'tag1', metric: 'cpu_usage_percent', count: '3项对象数据' },
    { id: 'tag2', metric: 'if_errorPacketIn_count', count: '5项对象数据' },
    { id: 'tag3', metric: 'if_portnumber_count', count: '5项对象数据' },
  ]);

  const [isSelfDataAssociated, setIsSelfDataAssociated] = useState(false);

  const [activeReportModalItem, setActiveReportModalItem] = useState<ExplorationTaskItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [activeExplorationDetailItem, setActiveExplorationDetailItem] = useState<ExplorationTaskItem | null>(null);
  const [isExplorationDetailModalOpen, setIsExplorationDetailModalOpen] = useState(false);

  const [eventDateItems, setEventDateItems] = useState<MajorEventDateItem[]>(INITIAL_MAJOR_EVENT_DATES);
  const [selectedEventDateIds, setSelectedEventDateIds] = useState<string[]>(['evt-1']);
  const [searchEventName, setSearchEventName] = useState('');

  const [isEventDateModalOpen, setIsEventDateModalOpen] = useState(false);
  const [editingEventItem, setEditingEventItem] = useState<MajorEventDateItem | null>(null);
  const [eventFormName, setEventFormName] = useState('');
  const [eventFormStart, setEventFormStart] = useState('2026.09.01');
  const [eventFormEnd, setEventFormEnd] = useState('2026.09.05');
  const [eventFormDesc, setEventFormDesc] = useState('');

  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [activeEventDetailItem, setActiveEventDetailItem] = useState<MajorEventDateItem | null>(null);

  const displayedRepoModels = repoModelList.filter((item) => {
    if (repoTab === '待启用模型库' && item.status !== '待启用') return false;
    if (repoTab === '已启用模型库' && item.status !== '已启用') return false;
    if (repoTab === '已停用模型库' && item.status !== '已停用') return false;
    if (repoTab === '失败模型库' && item.status !== '失败') return false;

    if (repoSearchId && !item.modelId.toLowerCase().includes(repoSearchId.toLowerCase())) return false;
    if (repoSearchProblem && !item.problemType.includes(repoSearchProblem)) return false;
    if (repoSearchDataName && !item.dataName.includes(repoSearchDataName)) return false;
    if (repoSearchDataType && !item.dataType.includes(repoSearchDataType)) return false;

    return true;
  });

  const handleOpenRepoDetail = (item: RepoModelItem) => {
    setActiveRepoDetail(item);
    setIsRepoDetailModalOpen(true);
  };

  const handleEnableModel = (id: string) => {
    setRepoModelList(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: '已启用' };
      }
      return m;
    }));
    setNotificationToast(`模型已成功启用！`);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const handlePromptDeleteModel = (item: RepoModelItem) => {
    setItemToDelete(item);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmDeleteModel = () => {
    if (itemToDelete) {
      setRepoModelList(prev => prev.filter(m => m.id !== itemToDelete.id));
      setSelectedRepoRowIds(prev => prev.filter(id => id !== itemToDelete.id));
      setNotificationToast(`模型 [${itemToDelete.modelId}] 已成功删除！`);
      setTimeout(() => setNotificationToast(null), 3000);
    }
    setIsDeleteConfirmModalOpen(false);
    setItemToDelete(null);
  };

  const filteredModels = models.filter(m => m.name.includes(searchTerm) || m.category.includes(searchTerm));

  const handleOpenModelInfo = (sub: SubModelItem) => {
    setActiveModelInfo(sub);
    setIsModelInfoModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Sub-Menu Navigation Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-2 backdrop-blur-md">
        {[
          { id: 'project', label: '创建模型工程', icon: Plus },
          { id: 'training', label: '训练中心', icon: Play },
          { id: 'models', label: '模型库与算法库', icon: Cpu },
          { id: 'exploration', label: '数据探索', icon: Database },
          { id: 'calendar', label: '重大活动日期标注', icon: Calendar },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = subView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedProjectForModels(null);
                setSubView(item.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================== MODEL LIST DETAIL SUB-VIEW ===================== */}
      {subView === 'training' && selectedProjectForModels && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedProjectForModels(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                <BackIcon className="w-4 h-4" />
                <span>返回训练中心</span>
              </button>
              <div>
                <h3 className="text-sm font-bold text-white">
                  模型列表详情: <span className="text-cyan-400 font-mono">{selectedProjectForModels.name}</span> (ID: {selectedProjectForModels.code})
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="border-l-4 border-cyan-500 pl-3">
              <h3 className="text-sm font-bold text-white">模型列表</h3>
            </div>

            <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
              <span className="text-cyan-300">
                已选择 <strong className="text-white font-mono">{selectedSubModelIds.length}</strong> 项
              </span>
              <button onClick={() => setSelectedSubModelIds([])} className="text-slate-400 hover:text-white transition-colors">清空</button>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedSubModelIds.length === INITIAL_SUB_MODELS.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedSubModelIds(INITIAL_SUB_MODELS.map(m => m.id));
                            else setSelectedSubModelIds([]);
                          }}
                          className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                        />
                      </th>
                      <th className="py-3 px-3">模型ID</th>
                      <th className="py-3 px-3">创建时间 (降序)</th>
                      <th className="py-3 px-3">处理问题</th>
                      <th className="py-3 px-3">数据名称</th>
                      <th className="py-3 px-3">数据类型</th>
                      <th className="py-3 px-3">训练状态</th>
                      <th className="py-3 px-3">训练开始时间</th>
                      <th className="py-3 px-3">首次训练完成时间</th>
                      <th className="py-3 px-3">最新训练完成时间</th>
                      <th className="py-3 px-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {INITIAL_SUB_MODELS.map((sub) => {
                      const isSelected = selectedSubModelIds.includes(sub.id);
                      return (
                        <tr key={sub.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedSubModelIds([...selectedSubModelIds, sub.id]);
                                else setSelectedSubModelIds(selectedSubModelIds.filter(id => id !== sub.id));
                              }}
                              className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                            />
                          </td>
                          <td className="py-3 px-3 font-mono text-cyan-300 font-bold">{sub.modelId}</td>
                          <td className="py-3 px-3 font-mono text-slate-400">{sub.createTime}</td>
                          <td className="py-3 px-3 font-semibold text-white">{sub.problem}</td>
                          <td className="py-3 px-3 text-slate-300">{sub.dataName}</td>
                          <td className="py-3 px-3 text-slate-300">{sub.dataType}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${
                                sub.status === '已完成' ? 'bg-emerald-500' : sub.status === '训练中' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                              }`} />
                              <span className="text-slate-200">{sub.status}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-400">{sub.startTime}</td>
                          <td className="py-3 px-3 font-mono text-slate-400">{sub.firstFinishTime}</td>
                          <td className="py-3 px-3 font-mono text-slate-400">{sub.latestFinishTime}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleOpenModelInfo(sub)}
                              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                            >
                              查看
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUBVIEW: 训练中心主界面 (Card & List Toggle with recent descending dates) ===================== */}
      {subView === 'training' && !selectedProjectForModels && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">查询方式:</span>
                  <select
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="模型工程名称">模型工程名称</option>
                    <option value="模型工程ID">模型工程ID</option>
                  </select>
                  <input
                    type="text"
                    value={queryContent}
                    onChange={(e) => setQueryContent(e.target.value)}
                    placeholder="请输入查询内容"
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 w-40 sm:w-56"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">时间查询:</span>
                  <select
                    value={timeQueryType}
                    onChange={(e) => setTimeQueryType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="创建时间">创建时间</option>
                  </select>
                  <input type="date" className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2" />
                  <span className="text-slate-500">—</span>
                  <input type="date" className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all">查询</button>
                <button onClick={() => setQueryContent('')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium">重置</button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="border-l-4 border-cyan-500 pl-3">
              <h3 className="text-sm font-bold text-white">模型工程中心</h3>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">排序方式:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="创建时间">创建时间 (降序)</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTrainingViewMode('card')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    trainingViewMode === 'card' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>标签视图</span>
                </button>
                <button
                  onClick={() => setTrainingViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    trainingViewMode === 'list' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>列表视图</span>
                </button>
              </div>
            </div>

            {/* CARD VIEW */}
            {trainingViewMode === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {INITIAL_TRAINING_PROJECTS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProjectForModels(item)}
                    className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 space-y-3 transition-all shadow-lg cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                      <span className="font-mono text-cyan-300 font-bold">{item.code}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">数据类型: <strong className="text-white">{item.dataType}</strong></span>
                        <span className="text-slate-500">|</span>
                        <span className="text-indigo-400 font-medium">{item.problemType}</span>
                      </div>
                    </div>

                    <div className="text-center py-1">
                      <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1 group-hover:text-cyan-300 transition-colors">
                        <span>{item.name}</span>
                        <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 font-mono">
                      <span>状态: <strong className={item.status === '已完成' ? 'text-emerald-400' : 'text-cyan-400'}>{item.status}</strong></span>
                      <span>模型数量: <strong className="text-white">{item.modelCount}</strong></span>
                      <span>成功: <strong className="text-emerald-400">{item.successCount}</strong></span>
                      <span>失败: <strong className="text-rose-400">{item.failCount}</strong></span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>进度:</span>
                        <span className="font-mono font-bold text-cyan-400">{item.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1 font-mono border-t border-slate-800/60 pt-2">
                      <div>已耗时: <span className="text-slate-200">{item.elapsedTime}</span></div>
                      <div>创建时间: {item.createTime}</div>
                      {item.finishTime !== '--' && <div>完成时间: <span className="text-slate-200">{item.finishTime}</span></div>}
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800/60">
                      <div className="truncate">任务场景: <span className="text-slate-200">{item.taskScenario}</span></div>
                      <div className="truncate">归属对象: <span className="text-slate-200">{item.targetObject}</span></div>
                      <div className="truncate">处理数据: <span className="text-slate-200">{item.processData}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* LIST VIEW */}
            {trainingViewMode === 'list' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3">模型工程ID</th>
                        <th className="py-3 px-3">模型工程名称</th>
                        <th className="py-3 px-3">任务场景</th>
                        <th className="py-3 px-3">归属对象</th>
                        <th className="py-3 px-3">处理数据</th>
                        <th className="py-3 px-3">问题类型</th>
                        <th className="py-3 px-3">数据类型</th>
                        <th className="py-3 px-3">模型数量</th>
                        <th className="py-3 px-3">训练状态</th>
                        <th className="py-3 px-3">训练进度</th>
                        <th className="py-3 px-3">成功数量</th>
                        <th className="py-3 px-3">失败数量</th>
                        <th className="py-3 px-3">创建时间 (降序)</th>
                        <th className="py-3 px-3">完成时间</th>
                        <th className="py-3 px-3">已耗时</th>
                        <th className="py-3 px-3 text-right">模型列表</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {INITIAL_TRAINING_PROJECTS.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 px-3 font-mono text-cyan-300 font-bold">{item.code}</td>
                          <td className="py-3 px-3 font-semibold text-white">{item.name}</td>
                          <td className="py-3 px-3 text-slate-300">{item.taskScenario}</td>
                          <td className="py-3 px-3 text-slate-300">{item.targetObject}</td>
                          <td className="py-3 px-3 text-slate-300">{item.processData}</td>
                          <td className="py-3 px-3 text-indigo-300">{item.problemType}</td>
                          <td className="py-3 px-3 text-slate-300">{item.dataType}</td>
                          <td className="py-3 px-3 font-mono text-white">{item.modelCount}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${
                              item.status === '已完成' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-cyan-400">{item.progress}%</td>
                          <td className="py-3 px-3 font-mono text-emerald-400">{item.successCount}</td>
                          <td className="py-3 px-3 font-mono text-rose-400">{item.failCount}</td>
                          <td className="py-3 px-3 font-mono text-slate-400">{item.createTime}</td>
                          <td className="py-3 px-3 font-mono text-slate-400">{item.finishTime}</td>
                          <td className="py-3 px-3 font-mono text-slate-300">{item.elapsedTime}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedProjectForModels(item)}
                              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                            >
                              点击查看
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-800 text-xs text-slate-400">
                  <span>共 140 条记录 第 1/80 页</span>
                  <div className="flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">上一页</button>
                    <button className="px-3 py-1 rounded bg-cyan-600 text-white font-bold">1</button>
                    <button className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">2</button>
                    <button className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">3</button>
                    <span className="px-1 text-slate-500">...</span>
                    <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">下一页</button>
                    <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 ml-2">
                      <option>10条/页</option>
                    </select>
                    <span className="ml-2">跳至</span>
                    <input type="text" defaultValue="1" className="w-10 bg-slate-900 border border-slate-800 text-center rounded py-1 text-white" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== OTHER SUBVIEWS ===================== */}
      {/* ===================== SUBVIEW: 创建模型工程 (Matching user screenshot) ===================== */}
      {subView === 'project' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6 shadow-xl animate-fadeIn">
          {/* Header Title */}
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>创建模型工程</span>
            </h2>
            <button
              onClick={() => setSubView('training')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              返回训练中心
            </button>
          </div>

          {/* Top Info Banner (Blue alert box matching screenshot) */}
          <div className="bg-sky-950/60 border border-sky-800/80 rounded-xl p-4 flex items-start gap-3 text-xs text-sky-200">
            <div className="p-1 bg-sky-900/80 text-sky-300 rounded-full mt-0.5 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="leading-relaxed">
              模型工程是AI模型的集合，创建为一个模型工程即根据将要选择分析的数据源创建该数据源所包含的所有对象的AI模型。在创建模型工程的引导流程中，用户首先需要配置模型工程的基础信息，作为该模型工程的相关展示信息。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Tree selection for Data & Problem Type */}
            <div className="lg:col-span-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between font-bold text-xs text-slate-200 border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1.5">
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                  选择数据和问题类型
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 时序数据 Section */}
                <div>
                  <button
                    onClick={() => setIsSidebarOpenTimeSeries(!isSidebarOpenTimeSeries)}
                    className="w-full flex items-center gap-1.5 text-slate-300 hover:text-white font-medium py-1.5 px-2 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSidebarOpenTimeSeries ? '' : '-rotate-90'}`} />
                    <span>时序数据</span>
                  </button>

                  {isSidebarOpenTimeSeries && (
                    <div className="ml-5 pl-2 border-l border-slate-800 space-y-1 mt-1">
                      <button
                        onClick={() => {
                          setDataType('timeseries');
                          setTimeSeriesCategory('dynamic_threshold');
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all ${
                          dataType === 'timeseries' && timeSeriesCategory === 'dynamic_threshold'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        时序数据动态阈值
                      </button>
                      <button
                        onClick={() => {
                          setDataType('timeseries');
                          setTimeSeriesCategory('anomaly');
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all ${
                          dataType === 'timeseries' && timeSeriesCategory === 'anomaly'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        时序数据异常发现
                      </button>
                      <button
                        onClick={() => {
                          setDataType('timeseries');
                          setTimeSeriesCategory('forecast');
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all ${
                          dataType === 'timeseries' && timeSeriesCategory === 'forecast'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        时序数据容量预测
                      </button>
                    </div>
                  )}
                </div>

                {/* 表格数据 Section */}
                <div className="pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => setDataType('table')}
                    className={`w-full flex items-center gap-1.5 font-medium py-1.5 px-2 rounded-lg transition-colors ${
                      dataType === 'table' ? 'text-cyan-300 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>表格数据</span>
                  </button>
                  {dataType === 'table' && (
                    <div className="ml-5 pl-2 border-l border-slate-800 space-y-1 mt-1">
                      <div className="py-1 px-2 text-slate-400 hover:text-white cursor-pointer">表格数据分类聚类</div>
                      <div className="py-1 px-2 text-slate-400 hover:text-white cursor-pointer">表格数据回归</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Main Content: 5-Step Wizard */}
            <div className="lg:col-span-9 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 space-y-8">
              {/* Sub-header title based on tree selection */}
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  {dataType === 'timeseries'
                    ? timeSeriesCategory === 'dynamic_threshold'
                      ? '时序数据动态阈值'
                      : timeSeriesCategory === 'anomaly'
                      ? '时序数据异常发现'
                      : '时序数据容量预测'
                    : '表格数据分析模型'}
                </h3>
              </div>

              {/* Step Bar (5 steps matching screenshot) */}
              <div className="relative flex items-center justify-between px-4 sm:px-10">
                {/* Connector line behind circles */}
                <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-800 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${((wizardStep - 1) / 4) * 100}%` }}
                  />
                </div>

                {[
                  { step: 1, label: '模型工程基础信息' },
                  { step: 2, label: '指标数据集' },
                  { step: 3, label: '数据清洗' },
                  { step: 4, label: '特征工程' },
                  { step: 5, label: '开始模型训练' },
                ].map((item) => {
                  const isActive = wizardStep === item.step;
                  const isDone = wizardStep > item.step;
                  return (
                    <div
                      key={item.step}
                      onClick={() => setWizardStep(item.step)}
                      className="relative z-10 flex flex-col items-center cursor-pointer group"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                          isActive
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40 ring-4 ring-sky-500/20'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 text-slate-400 border border-slate-700 group-hover:border-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : item.step}
                      </div>
                      <span
                        className={`text-[11px] font-medium mt-2 transition-colors ${
                          isActive ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* STEP 1: Form matching screenshot */}
              {wizardStep === 1 && (
                <div className="max-w-xl mx-auto space-y-5 pt-4">
                  {/* Field 1: 模型工程名称 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <span className="text-rose-500">*</span> 模型工程名称
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="请输入模型工程名称"
                        className="w-full bg-slate-900 border border-amber-500/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 pr-10 shadow-sm"
                      />
                      <div className="absolute right-3 top-2.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                        !
                      </div>
                    </div>
                    <p className="text-[11px] text-amber-500 font-medium">名称不允许输入空格，且建议不超过24个字</p>
                  </div>

                  {/* Field 2: 唯一ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <span className="text-rose-500">*</span> 唯一ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={projectUniqueId}
                        onChange={(e) => setProjectUniqueId(e.target.value)}
                        placeholder="例如: sn.001001"
                        className="w-full bg-slate-900 border border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400 pr-10 shadow-sm"
                      />
                      <button
                        onClick={() => setProjectUniqueId('')}
                        className="absolute right-3 top-2.5 text-rose-400 hover:text-rose-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-rose-500 font-medium">当前ID已存在</p>
                  </div>

                  {/* Field 3: 任务场景 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <span className="text-rose-500">*</span> 任务场景
                    </label>
                    <input
                      type="text"
                      value={taskScenario}
                      onChange={(e) => setTaskScenario(e.target.value)}
                      placeholder="例如：动态阈值 / 容量预测 / 接口流量监控"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 shadow-sm"
                    />
                  </div>

                  {/* Field 4: 归属对象 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <span className="text-rose-500">*</span> 归属对象
                    </label>
                    <input
                      type="text"
                      value={targetObject}
                      onChange={(e) => setTargetObject(e.target.value)}
                      placeholder="例如：资源池服务器 / 核心交换机 / K8s Pod"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 shadow-sm"
                    />
                  </div>

                  {/* Field 5: 处理数据 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <span className="text-rose-500">*</span> 处理数据
                    </label>
                    <input
                      type="text"
                      value={processData}
                      onChange={(e) => setProcessData(e.target.value)}
                      placeholder="例如：CPU利用率 / 内存使用率 / 带宽流量"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 shadow-sm"
                    />
                  </div>

                  {/* Submit / Next Step Button */}
                  <div className="pt-6 flex justify-center">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-8 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-sky-500/30"
                    >
                      下一步
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: 指标数据集 */}
              {wizardStep === 2 && (
                <div className="max-w-xl mx-auto space-y-5 pt-4">
                  <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">步骤 2: 指标数据集选择与配置</h4>
                  <div className="space-y-2 text-xs">
                    <label className="text-slate-300">数据源选择:</label>
                    <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white">
                      <option>Prometheus Metrics DataSource (时序指标库)</option>
                      <option>ElasticSearch Log Index (日志序列)</option>
                      <option>InfluxDB Telemetry (设备监控度量)</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-xs">
                    <label className="text-slate-300">指标采样粒度:</label>
                    <div className="flex gap-3">
                      {['10s', '1m', '5m', '15m'].map((gran) => (
                        <button key={gran} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 hover:border-cyan-500 font-mono">
                          {gran}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 flex justify-between">
                    <button onClick={() => setWizardStep(1)} className="px-6 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl">上一步</button>
                    <button onClick={() => setWizardStep(3)} className="px-8 py-2.5 bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg">下一步</button>
                  </div>
                </div>
              )}

              {/* STEP 3: 数据清洗 */}
              {wizardStep === 3 && (
                <div className="max-w-xl mx-auto space-y-5 pt-4">
                  <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">步骤 3: 缺失值补全与离群值清洗规则</h4>
                  <div className="space-y-2 text-xs">
                    <label className="text-slate-300">缺失值填充策略:</label>
                    <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white">
                      <option>线性插值 (Linear Interpolation - 推荐)</option>
                      <option>前向填充 (Forward Fill)</option>
                      <option>零值填充 (Zero Imputation)</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-xs">
                    <label className="text-slate-300">异常噪声过滤策略:</label>
                    <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white">
                      <option>3-Sigma 离群值去噪规则</option>
                      <option>IQR 四分位距滤波</option>
                    </select>
                  </div>
                  <div className="pt-6 flex justify-between">
                    <button onClick={() => setWizardStep(2)} className="px-6 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl">上一步</button>
                    <button onClick={() => setWizardStep(4)} className="px-8 py-2.5 bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg">下一步</button>
                  </div>
                </div>
              )}

              {/* STEP 4: 特征工程 */}
              {wizardStep === 4 && (
                <div className="max-w-xl mx-auto space-y-5 pt-4">
                  <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">步骤 4: 滑动时间窗口与滞后特征抽取</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-300">历史观察窗口 (Lag Window):</label>
                      <input type="text" defaultValue="60 个时间步" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300">滑动统计特征:</label>
                      <input type="text" defaultValue="Mean, Std, Max, Min" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                    </div>
                  </div>
                  <div className="pt-6 flex justify-between">
                    <button onClick={() => setWizardStep(3)} className="px-6 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl">上一步</button>
                    <button onClick={() => setWizardStep(5)} className="px-8 py-2.5 bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg">下一步</button>
                  </div>
                </div>
              )}

              {/* STEP 5: 开始模型训练 */}
              {wizardStep === 5 && (
                <div className="max-w-xl mx-auto space-y-5 pt-4 text-xs">
                  <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">步骤 5: 核心算法模型选择与训练集群配置</h4>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-slate-300 font-bold">算法选择: <span className="text-cyan-400">Prophet / Dynamic Threshold Engine</span></div>
                    <div className="text-slate-400">计算节点: <span className="text-white">AIOps GPU Cluster (Node 01-04)</span></div>
                    <div className="text-slate-400">预估并发模型数: <span className="text-emerald-400 font-mono font-bold">1,500 个</span></div>
                  </div>
                  <div className="pt-6 flex justify-between">
                    <button onClick={() => setWizardStep(4)} className="px-6 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl">上一步</button>
                    <button
                      onClick={() => {
                        alert('成功创建模型工程！正为您跳转至训练中心...');
                        setWizardStep(1);
                        setSubView('training');
                      }}
                      className="px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                    >
                      提交并开始训练
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUBVIEW: 模型库与算法库 (Matching user screenshots) ===================== */}
      {subView === 'models' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6 shadow-xl animate-fadeIn">
          {/* Page Title */}
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>模型库与算法库</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Navigation Tree for Model / Algorithm Repositories */}
            <div className="lg:col-span-3 xl:col-span-2 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 space-y-4">
              {/* Group 1: 自定义模型 */}
              <div className="space-y-1">
                <button
                  onClick={() => setIsCustomRepoOpen(!isCustomRepoOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-200 py-1.5 px-2 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCustomRepoOpen ? '' : '-rotate-90'}`} />
                    自定义模型
                  </span>
                </button>
                {isCustomRepoOpen && (
                  <div className="ml-4 pl-2 border-l border-slate-800 space-y-1 text-xs">
                    {['待启用模型库', '已启用模型库', '已停用模型库', '失败模型库'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setRepoTab(tab)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${
                          repoTab === tab
                            ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/80 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Group 2: 公共模型 */}
              <div className="space-y-1 border-t border-slate-800/60 pt-2">
                <button
                  onClick={() => setIsPublicRepoOpen(!isPublicRepoOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-200 py-1.5 px-2 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPublicRepoOpen ? '' : '-rotate-90'}`} />
                    公共模型
                  </span>
                </button>
                {isPublicRepoOpen && (
                  <div className="ml-4 pl-2 border-l border-slate-800 space-y-1 text-xs">
                    {['公共模型库', '已纳管对象库', '已停止纳管对象库'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setRepoTab(tab)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${
                          repoTab === tab
                            ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/80 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Group 3: 算法 */}
              <div className="space-y-1 border-t border-slate-800/60 pt-2">
                <button
                  onClick={() => setIsAlgorithmRepoOpen(!isAlgorithmRepoOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-200 py-1.5 px-2 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isAlgorithmRepoOpen ? '' : '-rotate-90'}`} />
                    算法
                  </span>
                </button>
                {isAlgorithmRepoOpen && (
                  <div className="ml-4 pl-2 border-l border-slate-800 space-y-1 text-xs">
                    <button
                      onClick={() => setRepoTab('算法库')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${
                        repoTab === '算法库'
                          ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/80 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      算法库
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Search Filters & Data Table */}
            <div className="lg:col-span-9 xl:col-span-10 space-y-5">
              {/* Top Search Filter Box */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">模型ID:</span>
                    <input
                      type="text"
                      placeholder="请输入查询内容"
                      value={repoSearchId}
                      onChange={(e) => setRepoSearchId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">问题类型:</span>
                    <input
                      type="text"
                      placeholder="请输入查询内容"
                      value={repoSearchProblem}
                      onChange={(e) => setRepoSearchProblem(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">数据名称:</span>
                    <input
                      type="text"
                      placeholder="请输入查询内容"
                      value={repoSearchDataName}
                      onChange={(e) => setRepoSearchDataName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-slate-400 shrink-0">数据类型:</span>
                      <input
                        type="text"
                        placeholder="请输入查询内容"
                        value={repoSearchDataType}
                        onChange={(e) => setRepoSearchDataType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <button className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-medium transition-all shrink-0">
                        查询
                      </button>
                      <button
                        onClick={() => {
                          setRepoSearchId('');
                          setRepoSearchProblem('');
                          setRepoSearchDataName('');
                          setRepoSearchDataType('');
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors shrink-0"
                      >
                        重置
                      </button>
                      <button
                        onClick={() => setIsRepoFilterCollapsed(!isRepoFilterCollapsed)}
                        className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-0.5 shrink-0 ml-1"
                      >
                        {isRepoFilterCollapsed ? '展开 v' : '收起 ^'}
                      </button>
                    </div>
                  </div>
                </div>

                {!isRepoFilterCollapsed && (
                  <div className="space-y-3 pt-2 border-t border-slate-800/60 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 shrink-0">模型工程名称:</span>
                        <input
                          type="text"
                          placeholder="请输入查询内容"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 shrink-0">模型工程ID:</span>
                        <input
                          type="text"
                          placeholder="请输入查询内容"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 shrink-0">时间查询:</span>
                        <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5">
                          <option>请选择查询方式</option>
                          <option>创建时间</option>
                          <option>训练完成时间</option>
                        </select>
                        <input type="date" className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5" />
                        <span className="text-slate-500">—</span>
                        <input type="date" className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 max-w-sm">
                      <span className="text-slate-400 shrink-0">设备信息查询:</span>
                      <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5">
                        <option>请选择查询方式</option>
                      </select>
                      <input
                        type="text"
                        placeholder="请输入查询内容"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-header title and batch action buttons */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="border-l-4 border-cyan-500 pl-3">
                    <h3 className="text-sm font-bold text-white">{repoTab}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (selectedRepoRowIds.length === 0) return alert('请先勾选需要删除的项！');
                        alert(`已批量删除 ${selectedRepoRowIds.length} 项模型！`);
                        setSelectedRepoRowIds([]);
                      }}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors border border-slate-700/80"
                    >
                      批量删除
                    </button>
                    <button
                      onClick={() => {
                        if (selectedRepoRowIds.length === 0) return alert('请先勾选需要启用的项！');
                        alert(`已批量启用 ${selectedRepoRowIds.length} 项模型！`);
                      }}
                      className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                    >
                      批量启用
                    </button>
                  </div>
                </div>

                {/* Selection Counter Bar (Light cyan banner matching screenshot) */}
                <div className="bg-cyan-950/60 border border-cyan-800/60 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
                  <span className="text-cyan-300">
                    已选择 <strong className="text-white font-mono">{selectedRepoRowIds.length}</strong> 项
                  </span>
                  <button onClick={() => setSelectedRepoRowIds([])} className="text-slate-400 hover:text-white transition-colors">
                    清空
                  </button>
                </div>

                {/* Data Table matching screenshot */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={selectedRepoRowIds.length === repoModelList.length}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedRepoRowIds(repoModelList.map(m => m.id));
                                else setSelectedRepoRowIds([]);
                              }}
                              className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                            />
                          </th>
                          <th className="py-3 px-3 whitespace-nowrap">模型ID</th>
                          <th className="py-3 px-3 whitespace-nowrap">问题类型</th>
                          <th className="py-3 px-3 whitespace-nowrap">数据名称</th>
                          <th className="py-3 px-3 whitespace-nowrap">数据类型</th>
                          <th className="py-3 px-3 whitespace-nowrap">算法名称</th>
                          <th className="py-3 px-3 whitespace-nowrap">Score</th>
                          <th className="py-3 px-3 whitespace-nowrap">创建时间</th>
                          <th className="py-3 px-3 whitespace-nowrap">最新训练完成时间</th>
                          <th className="py-3 px-3 whitespace-nowrap">模型工程名称</th>
                          <th className="py-3 px-3 whitespace-nowrap">模型工程ID</th>
                          <th className="py-3 px-3 text-right whitespace-nowrap">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {displayedRepoModels.map((item) => {
                          const isSelected = selectedRepoRowIds.includes(item.id);
                          return (
                            <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="py-3 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedRepoRowIds([...selectedRepoRowIds, item.id]);
                                    else setSelectedRepoRowIds(selectedRepoRowIds.filter(id => id !== item.id));
                                  }}
                                  className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                                />
                              </td>
                              <td className="py-3 px-3 font-mono text-cyan-300 font-bold whitespace-nowrap">{item.modelId}</td>
                              <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">{item.problemType}</td>
                              <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{item.dataName}</td>
                              <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{item.dataType}</td>
                              <td className="py-3 px-3 text-indigo-300 whitespace-nowrap">{item.algorithmName}</td>
                              <td className="py-3 px-3 font-mono text-emerald-400 font-bold whitespace-nowrap">{item.score}</td>
                              <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">{item.createTime}</td>
                              <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">{item.latestFinishTime}</td>
                              <td className="py-3 px-3 font-medium text-slate-200 whitespace-nowrap">{item.projectName}</td>
                              <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">{item.projectId}</td>
                              <td className="py-3 px-3 text-right whitespace-nowrap space-x-2">
                                <button
                                  onClick={() => handleOpenRepoDetail(item)}
                                  className="text-sky-400 hover:text-sky-300 font-medium"
                                >
                                  查看
                                </button>
                                <button
                                  onClick={() => handleEnableModel(item.id)}
                                  className="text-sky-400 hover:text-sky-300 font-medium ml-1"
                                >
                                  {item.status === '已启用' ? '已启用' : '启用'}
                                </button>
                                <button
                                  onClick={() => handlePromptDeleteModel(item)}
                                  className="text-rose-400 hover:text-rose-300 font-medium ml-1"
                                >
                                  删除
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Pagination Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-800 text-xs text-slate-400">
                    <span>共 10 条记录 第 1/1 页</span>
                    <div className="flex items-center gap-1.5">
                      <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">上一页</button>
                      <button className="px-3 py-1 rounded bg-sky-600 text-white font-bold">1</button>
                      <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">下一页</button>
                      <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 ml-2">
                        <option>10条/页</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUBVIEW: 数据探索 (Matching User Screenshot) ===================== */}
      {subView === 'exploration' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6 shadow-xl animate-fadeIn">
          {/* Header */}
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>数据探索</span>
            </h2>
          </div>

          {/* Top Search Filter Box */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 shrink-0">数据名称:</span>
                <input
                  type="text"
                  placeholder="请输入查询内容"
                  value={searchDataName}
                  onChange={(e) => setSearchDataName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 w-48"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 shrink-0">时间查询:</span>
                <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5">
                  <option>请选择查询方式</option>
                  <option>创建时间</option>
                </select>
                <input type="date" className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5" />
                <span className="text-slate-500">—</span>
                <input type="date" className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5" />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-medium transition-all shadow-md shadow-sky-500/20">
                  查询
                </button>
                <button
                  onClick={() => setSearchDataName('')}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors border border-slate-700/80"
                >
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* Section Title & Right Buttons */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="border-l-4 border-cyan-500 pl-3">
                <h3 className="text-sm font-bold text-white">探索任务列表</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (selectedExplorationIds.length === 0) return alert('请先勾选要删除的任务！');
                    setExplorationTasks(prev => prev.filter(t => !selectedExplorationIds.includes(t.id)));
                    setSelectedExplorationIds([]);
                    setNotificationToast('已批量删除选中的探索任务！');
                    setTimeout(() => setNotificationToast(null), 3000);
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700/80 transition-colors"
                >
                  批量删除
                </button>
                <button
                  onClick={() => {
                    if (selectedExplorationIds.length === 0) return alert('请先勾选需要重新探索的任务！');
                    setNotificationToast(`已对 ${selectedExplorationIds.length} 项任务发起重新探索！`);
                    setTimeout(() => setNotificationToast(null), 3000);
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700/80 transition-colors"
                >
                  批量重新探索
                </button>
                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/20 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建任务</span>
                </button>
              </div>
            </div>

            {/* Selection Counter Bar */}
            <div className="bg-cyan-950/60 border border-cyan-800/60 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-cyan-300">
                已选择 <strong className="text-white font-mono">{selectedExplorationIds.length}</strong> 项
              </span>
              <button onClick={() => setSelectedExplorationIds([])} className="text-slate-400 hover:text-white transition-colors">
                清空
              </button>
            </div>

            {/* Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedExplorationIds.length === explorationTasks.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedExplorationIds(explorationTasks.map(t => t.id));
                            else setSelectedExplorationIds([]);
                          }}
                          className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                        />
                      </th>
                      <th className="py-3 px-3">任务序号</th>
                      <th className="py-3 px-3">数据名称 ▾</th>
                      <th className="py-3 px-3">库名 ▾</th>
                      <th className="py-3 px-3">表名 ▾</th>
                      <th className="py-3 px-3">任务状态</th>
                      <th className="py-3 px-3">开始时间 (降序) ⇕</th>
                      <th className="py-3 px-3">完成时间 ⇕</th>
                      <th className="py-3 px-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {explorationTasks
                      .filter(t => searchDataName === '' || t.tableName.includes(searchDataName) || t.dataName.includes(searchDataName))
                      .map((task) => {
                        const isSelected = selectedExplorationIds.includes(task.id);
                        return (
                          <tr key={task.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedExplorationIds([...selectedExplorationIds, task.id]);
                                  else setSelectedExplorationIds(selectedExplorationIds.filter(id => id !== task.id));
                                }}
                                className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                              />
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-300 font-medium">{task.taskSeq}</td>
                            <td className="py-3 px-3 text-sky-300 font-medium">{task.dataName}</td>
                            <td className="py-3 px-3 font-mono text-slate-400">{task.dbName}</td>
                            <td className="py-3 px-3 font-mono text-white font-semibold">{task.tableName}</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${
                                  task.status === '已完成' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                                }`} />
                                <span className={task.status === '已完成' ? 'text-slate-200' : 'text-rose-400'}>{task.status}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-400">{task.startTime}</td>
                            <td className="py-3 px-3 font-mono text-slate-400">{task.finishTime}</td>
                            <td className="py-3 px-3 text-right space-x-2.5">
                              <button
                                onClick={() => {
                                  setActiveExplorationDetailItem(task);
                                  setIsExplorationDetailModalOpen(true);
                                }}
                                className="text-sky-400 hover:text-sky-300 font-medium"
                              >
                                查看
                              </button>
                              <button
                                onClick={() => {
                                  setExplorationTasks(prev => prev.filter(t => t.id !== task.id));
                                  setNotificationToast(`已删除探索任务 [${task.tableName}]`);
                                  setTimeout(() => setNotificationToast(null), 3000);
                                }}
                                className="text-sky-400 hover:text-sky-300 font-medium"
                              >
                                删除
                              </button>
                              <button
                                onClick={() => {
                                  setNotificationToast(`已对 [${task.tableName}] 发起重新探索！`);
                                  setTimeout(() => setNotificationToast(null), 3000);
                                }}
                                className="text-sky-400 hover:text-sky-300 font-medium"
                              >
                                重新探索
                              </button>
                              <button
                                onClick={() => {
                                  setActiveReportModalItem(task);
                                  setIsReportModalOpen(true);
                                }}
                                className="text-sky-400 hover:text-sky-300 font-medium"
                              >
                                查看结论报告
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination & Select All Current Page */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-800 text-xs text-slate-400">
                <button
                  onClick={() => setSelectedExplorationIds(explorationTasks.map(t => t.id))}
                  className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  本页全选
                </button>

                <div className="flex items-center gap-1.5">
                  <span>共 140 条记录 第 1/80 页</span>
                  <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white ml-2">&lt;</button>
                  <button className="px-3 py-1 rounded bg-sky-600 text-white font-bold">1</button>
                  <button className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">2</button>
                  <button className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">3</button>
                  <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">&gt;</button>
                  <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 ml-2">
                    <option>10条/页</option>
                  </select>
                  <span className="ml-2">跳至</span>
                  <input type="text" defaultValue="1" className="w-10 bg-slate-900 border border-slate-800 text-center rounded py-1 text-white" />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUBVIEW: 重大活动日期标注 (Matching User Screenshot) ===================== */}
      {subView === 'calendar' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6 shadow-xl animate-fadeIn">
          {/* Header */}
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>重大活动日期标注</span>
            </h2>
          </div>

          {/* Top Search Filter Box */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 shrink-0">重大活动名称:</span>
                <input
                  type="text"
                  placeholder="请输入查询内容"
                  value={searchEventName}
                  onChange={(e) => setSearchEventName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 w-48"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 shrink-0">时间查询:</span>
                <input type="date" className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5" />
                <span className="text-slate-500">—</span>
                <input type="date" className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5" />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-medium transition-all shadow-md shadow-sky-500/20">
                  查询
                </button>
                <button
                  onClick={() => setSearchEventName('')}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors border border-slate-700/80"
                >
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* Section Title & Right Buttons */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="border-l-4 border-cyan-500 pl-3">
                <h3 className="text-sm font-bold text-white">重大活动日期列表</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (selectedEventDateIds.length === 0) return alert('请先勾选需要删除的活动项！');
                    setEventDateItems(prev => prev.filter(item => !selectedEventDateIds.includes(item.id)));
                    setSelectedEventDateIds([]);
                    setNotificationToast('已批量删除选中的重大活动日期！');
                    setTimeout(() => setNotificationToast(null), 3000);
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700/80 transition-colors"
                >
                  批量删除
                </button>
                <button
                  onClick={() => {
                    setEditingEventItem(null);
                    setEventFormName('');
                    setEventFormStart('2026-09-01');
                    setEventFormEnd('2026-09-05');
                    setEventFormDesc('');
                    setIsEventDateModalOpen(true);
                  }}
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/20 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增日期</span>
                </button>
              </div>
            </div>

            {/* Selection Counter Bar */}
            <div className="bg-cyan-950/60 border border-cyan-800/60 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-cyan-300">
                已选择 <strong className="text-white font-mono">{selectedEventDateIds.length}</strong> 项
              </span>
              <button onClick={() => setSelectedEventDateIds([])} className="text-slate-400 hover:text-white transition-colors">
                清空
              </button>
            </div>

            {/* Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedEventDateIds.length === eventDateItems.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedEventDateIds(eventDateItems.map(item => item.id));
                            else setSelectedEventDateIds([]);
                          }}
                          className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                        />
                      </th>
                      <th className="py-3 px-3">序号</th>
                      <th className="py-3 px-3">重大活动名称</th>
                      <th className="py-3 px-3">日期范围 ⇕</th>
                      <th className="py-3 px-3">描述</th>
                      <th className="py-3 px-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {eventDateItems
                      .filter(item => searchEventName === '' || item.eventName.includes(searchEventName))
                      .map((item) => {
                        const isSelected = selectedEventDateIds.includes(item.id);
                        return (
                          <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedEventDateIds([...selectedEventDateIds, item.id]);
                                  else setSelectedEventDateIds(selectedEventDateIds.filter(id => id !== item.id));
                                }}
                                className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                              />
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-300 font-medium">{item.seq}</td>
                            <td className="py-3 px-3 font-semibold text-white">{item.eventName}</td>
                            <td className="py-3 px-3 font-mono text-cyan-300 font-medium">{item.dateRange}</td>
                            <td className="py-3 px-3 text-slate-300">{item.description}</td>
                            <td className="py-3 px-3 text-right space-x-2.5">
                              <button
                                onClick={() => {
                                  setActiveEventDetailItem(item);
                                  setIsEventDetailModalOpen(true);
                                }}
                                className="text-sky-400 hover:text-sky-300 font-medium"
                              >
                                查看
                              </button>
                              <button
                                onClick={() => {
                                  setEditingEventItem(item);
                                  setEventFormName(item.eventName);
                                  const parts = item.dateRange.split('-');
                                  setEventFormStart(parts[0] || '2026.09.01');
                                  setEventFormEnd(parts[1] || '2026.09.05');
                                  setEventFormDesc(item.description);
                                  setIsEventDateModalOpen(true);
                                }}
                                className="text-sky-400 hover:text-sky-300 font-medium"
                              >
                                修改
                              </button>
                              <button
                                onClick={() => {
                                  setEventDateItems(prev => prev.filter(evt => evt.id !== item.id));
                                  setNotificationToast(`已删除重大活动 [${item.eventName}]`);
                                  setTimeout(() => setNotificationToast(null), 3000);
                                }}
                                className="text-sky-400 hover:text-sky-300 font-medium"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination & Select All Current Page */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-800 text-xs text-slate-400">
                <button
                  onClick={() => setSelectedEventDateIds(eventDateItems.map(item => item.id))}
                  className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  本页全选
                </button>

                <div className="flex items-center gap-1.5">
                  <span>共 140 条记录 第 1/80 页</span>
                  <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white ml-2">&lt;</button>
                  <button className="px-3 py-1 rounded bg-sky-600 text-white font-bold">1</button>
                  <button className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">2</button>
                  <button className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">3</button>
                  <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">&gt;</button>
                  <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 ml-2">
                    <option>10条/页</option>
                  </select>
                  <span className="ml-2">跳至</span>
                  <input type="text" defaultValue="1" className="w-10 bg-slate-900 border border-slate-800 text-center rounded py-1 text-white" />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODEL DETAILS INSPECT MODAL ===================== */}
      {isModelInfoModalOpen && activeModelInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-950/50 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800/80 text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">模型列表详情 - 查看</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                      activeModelInfo.status === '已完成' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {activeModelInfo.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">模型ID: <span className="text-cyan-300 font-bold">{activeModelInfo.modelId}</span> | 数据名称: {activeModelInfo.dataName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModelInfoModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="text-slate-400">处理问题</div>
                  <div className="text-white font-semibold mt-1">{activeModelInfo.problem}</div>
                </div>
                <div>
                  <div className="text-slate-400">数据类型</div>
                  <div className="text-cyan-400 font-mono mt-1">{activeModelInfo.dataType}</div>
                </div>
                <div>
                  <div className="text-slate-400">训练开始时间</div>
                  <div className="text-slate-300 font-mono mt-1">{activeModelInfo.startTime}</div>
                </div>
                <div>
                  <div className="text-slate-400">最新完成时间</div>
                  <div className="text-slate-300 font-mono mt-1">{activeModelInfo.latestFinishTime}</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400">模型准确率 (Accuracy)</div>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-1">98.65%</div>
                  <div className="text-[10px] text-emerald-500/80 mt-0.5">提升 +1.2%</div>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400">均方根误差 (RMSE)</div>
                  <div className="text-xl font-mono font-bold text-cyan-400 mt-1">0.0182</div>
                  <div className="text-[10px] text-cyan-500/80 mt-0.5">损失函数收敛优良</div>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400">F1-Score</div>
                  <div className="text-xl font-mono font-bold text-indigo-400 mt-1">0.974</div>
                  <div className="text-[10px] text-indigo-500/80 mt-0.5">召回率 97.8%</div>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400">推理延时 (Latency)</div>
                  <div className="text-xl font-mono font-bold text-amber-400 mt-1">2.4ms</div>
                  <div className="text-[10px] text-amber-500/80 mt-0.5">毫秒级实效性</div>
                </div>
              </div>

              {/* Chart 1: Training Loss Curve */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>训练损失收敛曲线 (Loss / Validation Loss)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">100 Epochs</span>
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { epoch: 'E10', trainLoss: 0.45, valLoss: 0.52 },
                      { epoch: 'E20', trainLoss: 0.28, valLoss: 0.31 },
                      { epoch: 'E30', trainLoss: 0.18, valLoss: 0.22 },
                      { epoch: 'E40', trainLoss: 0.11, valLoss: 0.15 },
                      { epoch: 'E50', trainLoss: 0.07, valLoss: 0.09 },
                      { epoch: 'E60', trainLoss: 0.04, valLoss: 0.06 },
                      { epoch: 'E70', trainLoss: 0.028, valLoss: 0.041 },
                      { epoch: 'E80', trainLoss: 0.021, valLoss: 0.029 },
                      { epoch: 'E90', trainLoss: 0.016, valLoss: 0.022 },
                      { epoch: 'E100', trainLoss: 0.014, valLoss: 0.018 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="trainLoss" name="训练损失" stroke="#06b6d4" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="valLoss" name="验证损失" stroke="#f43f5e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Feature Importance & Logs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>特征权重贡献度 (Feature Importance)</span>
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { name: 'CPU Utilization (CPU利用率)', weight: 42, color: 'bg-cyan-500' },
                      { name: 'Memory Usage (内存占用)', weight: 28, color: 'bg-indigo-500' },
                      { name: 'Disk IOPS (磁盘读写)', weight: 18, color: 'bg-emerald-500' },
                      { name: 'Network Traffic (网络吞吐)', weight: 12, color: 'bg-amber-500' },
                    ].map((feat) => (
                      <div key={feat.name} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-300">{feat.name}</span>
                          <span className="font-mono text-cyan-300 font-bold">{feat.weight}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                          <div className={`h-full rounded-full ${feat.color}`} style={{ width: `${feat.weight}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>训练执行日志终端</span>
                  </h4>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-emerald-400 space-y-1 max-h-36 overflow-y-auto">
                    <div>[2026-10-15 16:00:01] [INFO] Starting training pipeline for {activeModelInfo.modelId}...</div>
                    <div>[2026-10-15 16:00:15] [INFO] Loaded dataset: {activeModelInfo.dataName} (120,000 samples)</div>
                    <div>[2026-10-15 16:05:22] [INFO] Epoch 50/100 - Loss: 0.0712 - Val Loss: 0.0910</div>
                    <div>[2026-10-15 16:15:40] [INFO] Epoch 100/100 - Loss: 0.0142 - Val Loss: 0.0185</div>
                    <div className="text-cyan-300">[2026-10-15 16:20:00] [SUCCESS] Model weights saved to /models/{activeModelInfo.modelId}.pt</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                导出格式: <span className="text-slate-200 font-mono">PyTorch (.pt) / ONNX (.onnx)</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsModelInfoModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    alert(`已发起模型 [${activeModelInfo.modelId}] 的重新训练任务！`);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
                >
                  重新训练模型
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== REPO MODEL DETAIL INSPECT MODAL (Matching User Screenshot) ===================== */}
      {isRepoDetailModalOpen && activeRepoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl shadow-cyan-950/50 flex flex-col text-xs">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-400 rounded-full"></span>
                <h3 className="text-sm font-bold text-cyan-400">模型信息</h3>
              </div>
              <button
                onClick={() => setIsRepoDetailModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              {/* Section 1: 模型信息 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white border-l-2 border-cyan-400 pl-2">模型信息</h4>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6">
                  <div>
                    <span className="text-slate-400">模型ID: </span>
                    <span className="text-white font-mono font-bold">{activeRepoDetail.modelId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">问题类型: </span>
                    <span className="text-white font-medium">{activeRepoDetail.problemType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">算法名称: </span>
                    <span className="text-white font-medium">{activeRepoDetail.algorithmName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400">评价方法: </span>
                    <span className="text-slate-200">均方根误差 / 召回率</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Score: </span>
                    <span className="text-emerald-400 font-mono font-bold">{activeRepoDetail.score}</span>
                  </div>
                  <div></div>

                  <div>
                    <span className="text-slate-400">创建时间: </span>
                    <span className="text-slate-200 font-mono">{activeRepoDetail.createTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">模型工程名称: </span>
                    <span className="text-slate-200">{activeRepoDetail.projectName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">模型工程ID: </span>
                    <span className="text-slate-200 font-mono">{activeRepoDetail.projectId}</span>
                  </div>

                  <div>
                    <span className="text-slate-400">首次训练时间: </span>
                    <span className="text-slate-200 font-mono">{activeRepoDetail.createTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">训练时长: </span>
                    <span className="text-slate-200">3day23hours</span>
                  </div>
                  <div>
                    <span className="text-slate-400">训练结果: </span>
                    <span className="text-emerald-400 font-bold">成功</span>
                  </div>
                </div>
              </div>

              {/* Section 2: 设备信息 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white border-l-2 border-cyan-400 pl-2">设备信息</h4>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-slate-400">设备序列号: </span>
                    <span className="text-sky-400 font-mono font-semibold">SN-46567</span>
                  </div>
                  <div>
                    <span className="text-slate-400">设备类型: </span>
                    <span className="text-slate-200">server</span>
                  </div>
                  <div>
                    <span className="text-slate-400">设备名称: </span>
                    <span className="text-slate-200">PC-001</span>
                  </div>
                  <div>
                    <span className="text-slate-400">设备厂家: </span>
                    <span className="text-slate-200">PC-001</span>
                  </div>

                  <div>
                    <span className="text-slate-400">资源池: </span>
                    <span className="text-slate-200">PC-001</span>
                  </div>
                  <div>
                    <span className="text-slate-400">POD: </span>
                    <span className="text-slate-200">东莞ironic资源池</span>
                  </div>
                  <div>
                    <span className="text-slate-400">管理IP地址: </span>
                    <span className="text-sky-400 font-mono">220.10.51.15</span>
                  </div>
                  <div>
                    <span className="text-slate-400">业务IP地址: </span>
                    <span className="text-sky-400 font-mono">220.10.51.55</span>
                  </div>

                  <div>
                    <span className="text-slate-400">业务系统: </span>
                    <span className="text-slate-200">计费系统</span>
                  </div>
                  <div>
                    <span className="text-slate-400">操作系统: </span>
                    <span className="text-slate-200 font-mono">Linux 78.6.0.0</span>
                  </div>
                </div>
              </div>

              {/* Section 3: 训练数据集信息 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white border-l-2 border-cyan-400 pl-2">训练数据集信息</h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="text-sky-400 font-bold">&gt;&gt;</span>
                        <span className="text-slate-400">数据名称:</span>
                        <span className="text-sky-400 font-mono">{activeRepoDetail.dataName}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-5 text-slate-300">
                        <div>
                          <span className="text-slate-400">数据类型: </span>
                          <span className="text-sky-400 font-medium">{activeRepoDetail.dataType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">数据特征: </span>
                          <span className="text-sky-400 font-medium">周期型</span>
                        </div>
                        <div>
                          <span className="text-slate-400">训练样本数: </span>
                          <span className="text-sky-400 font-mono font-bold">999</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex justify-end">
              <button
                onClick={() => setIsRepoDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      {isDeleteConfirmModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl shadow-rose-950/40">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">确认要删除该模型吗？</h3>
                <p className="text-xs text-slate-400 mt-0.5">此操作不可撤销</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
              <div>模型ID: <span className="text-cyan-300 font-bold">{itemToDelete.modelId}</span></div>
              <div>问题类型: <span className="text-white">{itemToDelete.problemType}</span></div>
              <div>数据名称: <span className="text-slate-300">{itemToDelete.dataName}</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsDeleteConfirmModalOpen(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteModel}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/30"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== NEW EXPLORATION TASK MODAL (Matching User Screenshot) ===================== */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl shadow-cyan-950/50 flex flex-col text-xs">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-400 rounded-full"></span>
                <h3 className="text-sm font-bold text-cyan-400">新建数据探索任务</h3>
              </div>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Split Columns Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: 指标数据列表 (4 Cols) */}
                <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white border-l-2 border-cyan-400 pl-2">指标数据列表</h4>
                    
                    {/* Left Filter Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 shrink-0">数据名称:</span>
                      <input
                        type="text"
                        placeholder="请输入查询内容"
                        value={leftSearchMetric}
                        onChange={(e) => setLeftSearchMetric(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-2.5 py-1.5 w-full focus:outline-none focus:border-cyan-500"
                      />
                      <button className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium shrink-0">
                        查询
                      </button>
                    </div>

                    {/* Left Table */}
                    <div className="border border-slate-800/80 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3 w-8 text-center">
                              <input
                                type="checkbox"
                                checked={selectedMetricIds.length === MOCK_METRIC_LIST.length}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedMetricIds(MOCK_METRIC_LIST.map(m => m.id));
                                  else setSelectedMetricIds([]);
                                }}
                                className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                              />
                            </th>
                            <th className="py-2.5 px-3">数据名称</th>
                            <th className="py-2.5 px-3">表名 ▾</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {MOCK_METRIC_LIST
                            .filter(m => leftSearchMetric === '' || m.name.includes(leftSearchMetric))
                            .map((metric) => {
                              const isChecked = selectedMetricIds.includes(metric.id);
                              return (
                                <tr key={metric.id} className="hover:bg-slate-900/60 transition-colors">
                                  <td className="py-2 px-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) setSelectedMetricIds([...selectedMetricIds, metric.id]);
                                        else setSelectedMetricIds(selectedMetricIds.filter(id => id !== metric.id));
                                      }}
                                      className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                                    />
                                  </td>
                                  <td className="py-2 px-3 text-slate-200 font-semibold">{metric.name}</td>
                                  <td className="py-2 px-3 text-slate-400">{metric.tableName}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Left Bottom Action Button */}
                  <div className="pt-2">
                    <button className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-md transition-all">
                      查询对象列表
                    </button>
                  </div>
                </div>

                {/* Right Column: 数据归属对象列表 (8 Cols) */}
                <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white border-l-2 border-cyan-400 pl-2">数据归属对象列表</h4>

                    {/* Right Filter Bar */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 shrink-0">查询方式:</span>
                        <select
                          value={rightSearchMode}
                          onChange={(e) => setRightSearchMode(e.target.value)}
                          className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2 py-1.5"
                        >
                          <option>请选择查询方式</option>
                          <option>按序列号</option>
                          <option>按设备IP</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="请输入查询内容"
                        value={rightSearchQuery}
                        onChange={(e) => setRightSearchQuery(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 w-44 focus:outline-none focus:border-cyan-500"
                      />

                      <button className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium shrink-0">
                        查询
                      </button>
                    </div>

                    {/* Right Selection Counter Banner */}
                    <div className="bg-cyan-950/60 border border-cyan-800/60 rounded-xl px-3.5 py-1.5 flex items-center justify-between text-xs">
                      <span className="text-cyan-300">
                        已选择 <strong className="text-white font-mono">{selectedMetricIds.length}</strong> 项指标的 <strong className="text-white font-mono">{selectedDeviceIds.length}</strong> 项对象
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setNotificationToast('已确认对象匹配规则');
                            setTimeout(() => setNotificationToast(null), 3000);
                          }}
                          className="text-sky-400 hover:text-sky-300 font-bold"
                        >
                          确认
                        </button>
                        <button
                          onClick={() => setSelectedDeviceIds([])}
                          className="text-slate-400 hover:text-white"
                        >
                          清空
                        </button>
                      </div>
                    </div>

                    {/* Right Table */}
                    <div className="border border-slate-800/80 rounded-xl overflow-x-auto max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3 w-8 text-center">
                              <input
                                type="checkbox"
                                checked={selectedDeviceIds.length === MOCK_DEVICE_LIST.length}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedDeviceIds(MOCK_DEVICE_LIST.map(d => d.id));
                                  else setSelectedDeviceIds([]);
                                }}
                                className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                              />
                            </th>
                            <th className="py-2.5 px-3">序列号</th>
                            <th className="py-2.5 px-3">设备类型</th>
                            <th className="py-2.5 px-3">IP地址</th>
                            <th className="py-2.5 px-3">设备型号</th>
                            <th className="py-2.5 px-3">设备名称</th>
                            <th className="py-2.5 px-3">设备厂家</th>
                            <th className="py-2.5 px-3">区域分类</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {MOCK_DEVICE_LIST
                            .filter(d => rightSearchQuery === '' || d.sn.includes(rightSearchQuery) || d.name.includes(rightSearchQuery))
                            .map((dev) => {
                              const isChecked = selectedDeviceIds.includes(dev.id);
                              return (
                                <tr key={dev.id} className="hover:bg-slate-900/60 transition-colors">
                                  <td className="py-2 px-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) setSelectedDeviceIds([...selectedDeviceIds, dev.id]);
                                        else setSelectedDeviceIds(selectedDeviceIds.filter(id => id !== dev.id));
                                      }}
                                      className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0"
                                    />
                                  </td>
                                  <td className="py-2 px-3 font-semibold text-white">{dev.sn}</td>
                                  <td className="py-2 px-3 text-slate-300 font-sans">{dev.type}</td>
                                  <td className="py-2 px-3 text-sky-400">{dev.ip}</td>
                                  <td className="py-2 px-3 text-slate-400">{dev.model}</td>
                                  <td className="py-2 px-3 text-slate-200 font-sans">{dev.name}</td>
                                  <td className="py-2 px-3 text-slate-300 font-sans">{dev.vendor}</td>
                                  <td className="py-2 px-3 text-slate-400 font-sans">{dev.region}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Bottom Pagination Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
                    <button
                      onClick={() => setSelectedDeviceIds(MOCK_DEVICE_LIST.map(d => d.id))}
                      className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow transition-all"
                    >
                      本页全选
                    </button>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span>共140条记录 第1/80页</span>
                      <button className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">&lt;</button>
                      <button className="px-2.5 py-0.5 rounded bg-sky-600 text-white font-bold">1</button>
                      <button className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">2</button>
                      <button className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">3</button>
                      <button className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">&gt;</button>
                      <select className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-1.5 py-0.5 ml-1">
                        <option>10条/页</option>
                      </select>
                      <span className="ml-1">跳至</span>
                      <input type="text" defaultValue="1" className="w-8 bg-slate-900 border border-slate-800 text-center rounded py-0.5 text-white" />
                      <span>页</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Selected Tags Container (Dashed Border Box matching Screenshot) */}
              <div className="border border-dashed border-slate-800/90 rounded-2xl p-4 bg-slate-950/60 space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-slate-400 shrink-0 font-medium">已选探索数据:</span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {selectedExploreTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center gap-2 bg-slate-900 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-xl font-mono text-xs shadow-sm"
                      >
                        <span className="font-semibold">{tag.metric}</span>
                        <span className="text-slate-400 text-[11px]">{tag.count}</span>
                        <button
                          onClick={() => setSelectedExploreTags(prev => prev.filter(t => t.id !== tag.id))}
                          className="text-rose-400 hover:text-rose-200 ml-1 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="text-slate-400 font-medium">是否自用数据关联探索:</span>
                  <button
                    onClick={() => setIsSelfDataAssociated(!isSelfDataAssociated)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isSelfDataAssociated ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isSelfDataAssociated ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={isSelfDataAssociated ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                    {isSelfDataAssociated ? '开' : '关'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  const newTask: ExplorationTaskItem = {
                    id: `exp-${Date.now()}`,
                    taskSeq: explorationTasks.length + 1,
                    dataName: selectedExploreTags[0]?.metric ? `(${selectedExploreTags[0].metric})` : '(单指标)',
                    dbName: 'ai_model_data',
                    tableName: selectedExploreTags[0]?.metric || 'user_metrics_task',
                    status: '执行中',
                    startTime: '2026-10-16 01:43:00',
                    finishTime: '--',
                  };
                  setExplorationTasks([newTask, ...explorationTasks]);
                  setIsNewTaskModalOpen(false);
                  setNotificationToast('已成功创建并开始数据探索任务！');
                  setTimeout(() => setNotificationToast(null), 3000);
                }}
                className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all"
              >
                确认
              </button>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors border border-slate-700/80"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EXPLORATION REPORT MODAL ===================== */}
      {isReportModalOpen && activeReportModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-950/50 flex flex-col text-xs">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">数据探索结论报告 - {activeReportModalItem.tableName}</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div><span className="text-slate-400">数据库:</span> <span className="text-white">{activeReportModalItem.dbName}</span></div>
                <div><span className="text-slate-400">数据表:</span> <span className="text-cyan-300 font-bold">{activeReportModalItem.tableName}</span></div>
                <div><span className="text-slate-400">指标分类:</span> <span className="text-slate-200">{activeReportModalItem.dataName}</span></div>
                <div><span className="text-slate-400">状态:</span> <span className="text-emerald-400 font-bold">{activeReportModalItem.status}</span></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-300">📊 数据分布与特征探索摘要</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  对表 <code className="text-cyan-300 font-mono">{activeReportModalItem.tableName}</code> 进行了深度数据探索分析。数据平稳性检验 (ADF) 显示该指标呈现强周期性与低置信度离群值。缺失值比例小于 0.05%，建议使用线性插值模型进行数据清洗。
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-slate-400">探索数据总量</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 mt-1">1,250,000</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-slate-400">有效字段维度</div>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">18 项</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-slate-400">异常数据噪音</div>
                  <div className="text-lg font-mono font-bold text-amber-400 mt-1">0.12%</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex justify-end">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EXPLORATION DATASET INSPECT MODAL (Matching User Screenshot) ===================== */}
      {isExplorationDetailModalOpen && activeExplorationDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl shadow-cyan-950/50 flex flex-col text-xs">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-400 rounded-full"></span>
                <h3 className="text-sm font-bold text-cyan-400">探索数据集信息</h3>
              </div>
              <button
                onClick={() => setIsExplorationDetailModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
                  {/* Top Line */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sky-400 font-bold">&gt;&gt;</span>
                      <span className="text-slate-400">数据名称:</span>
                      <span className="text-sky-400 font-mono">cpu_usage_percent</span>
                    </div>
                    <div>
                      <span className="text-slate-400">库名: </span>
                      <span className="text-sky-400 font-mono">base_1</span>
                    </div>
                    <div>
                      <span className="text-slate-400">表名: </span>
                      <span className="text-sky-400 font-mono">table_1</span>
                    </div>
                  </div>

                  {/* Second Line */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-5 text-slate-300">
                    <div>
                      <span className="text-slate-400">数据类型: </span>
                      <span className="text-sky-400 font-medium">时序</span>
                    </div>
                    <div>
                      <span className="text-slate-400">数据特征: </span>
                      <span className="text-sky-400 font-medium">周期型</span>
                    </div>
                    <div>
                      <span className="text-slate-400">探索样本数: </span>
                      <span className="text-sky-400 font-mono font-bold">999</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex justify-end">
              <button
                onClick={() => setIsExplorationDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EVENT DATE EDIT / ADD MODAL ===================== */}
      {isEventDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl shadow-cyan-950/50 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{editingEventItem ? '修改重大活动日期' : '新增重大活动日期'}</span>
              </h3>
              <button onClick={() => setIsEventDateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">重大活动名称:</label>
                <input
                  type="text"
                  value={eventFormName}
                  onChange={(e) => setEventFormName(e.target.value)}
                  placeholder="例如: 2026.9.3 阅兵"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">起始日期:</label>
                  <input
                    type="text"
                    value={eventFormStart}
                    onChange={(e) => setEventFormStart(e.target.value)}
                    placeholder="2026.09.01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">结束日期:</label>
                  <input
                    type="text"
                    value={eventFormEnd}
                    onChange={(e) => setEventFormEnd(e.target.value)}
                    placeholder="2026.09.05"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">活动描述:</label>
                <textarea
                  value={eventFormDesc}
                  onChange={(e) => setEventFormDesc(e.target.value)}
                  placeholder="例如: 安保维稳 / 节日流量高峰监控"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsEventDateModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (!eventFormName) return alert('请输入重大活动名称！');
                  if (editingEventItem) {
                    setEventDateItems(prev => prev.map(item => item.id === editingEventItem.id ? {
                      ...item,
                      eventName: eventFormName,
                      dateRange: `${eventFormStart}-${eventFormEnd}`,
                      description: eventFormDesc
                    } : item));
                    setNotificationToast(`已修改重大活动 [${eventFormName}]`);
                  } else {
                    const newEvt: MajorEventDateItem = {
                      id: `evt-${Date.now()}`,
                      seq: eventDateItems.length + 1,
                      eventName: eventFormName,
                      dateRange: `${eventFormStart}-${eventFormEnd}`,
                      description: eventFormDesc || '日常安保保障'
                    };
                    setEventDateItems([newEvt, ...eventDateItems]);
                    setNotificationToast(`已新增重大活动 [${eventFormName}]`);
                  }
                  setIsEventDateModalOpen(false);
                  setTimeout(() => setNotificationToast(null), 3000);
                }}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-lg"
              >
                保存日期
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EVENT DETAIL INSPECT MODAL ===================== */}
      {isEventDetailModalOpen && activeEventDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl shadow-cyan-950/50 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>重大活动详情 - {activeEventDetailItem.eventName}</span>
              </h3>
              <button onClick={() => setIsEventDetailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div><span className="text-slate-400">序号:</span> <span className="text-white font-mono">{activeEventDetailItem.seq}</span></div>
              <div><span className="text-slate-400">活动名称:</span> <span className="text-cyan-300 font-bold">{activeEventDetailItem.eventName}</span></div>
              <div><span className="text-slate-400">日期范围:</span> <span className="text-sky-400 font-mono font-bold">{activeEventDetailItem.dateRange}</span></div>
              <div><span className="text-slate-400">活动描述:</span> <span className="text-slate-200">{activeEventDetailItem.description}</span></div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsEventDetailModalOpen(false)}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl"
              >
                关闭
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
