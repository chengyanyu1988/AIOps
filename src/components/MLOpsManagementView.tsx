import React, { useState, useEffect } from 'react';
import {
  Cpu,
  GitBranch,
  Camera,
  History,
  Activity,
  AlertOctagon,
  CheckCircle2,
  Sliders,
  RefreshCw,
  Search,
  RotateCcw,
  Plus,
  Play,
  X,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Layers,
} from 'lucide-react';

interface MLOpsProps {
  initialSubView?: string;
  onSubViewChange?: (subView: string) => void;
}

export const MLOpsManagementView: React.FC<MLOpsProps> = ({
  initialSubView = 'model_version_mgmt',
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

  // Sub Navigation items matching prototype
  const subNavs = [
    { id: 'model_version_mgmt', label: '模型版本管理' },
    { id: 'model_snapshot', label: '模型快照' },
    { id: 'version_history', label: '模型版本变更历史' },
    { id: 'model_perf_monitor', label: '模型性能监控' },
    { id: 'degraded_model_monitor', label: '劣化模型监控' },
  ];

  // Search input states matching prototype screenshot
  const [modelIdSearch, setModelIdSearch] = useState('');
  const [projectIdSearch, setProjectIdSearch] = useState('');
  const [problemTypeSearch, setProblemTypeSearch] = useState('');
  const [dataTypeSearch, setDataTypeSearch] = useState('');

  // ==========================================
  // 1. 模型版本管理 数据 (字段标题与原型完全一致)
  // 模型ID | 问题类型 | 数据名称 | 数据类型 | 算法名称 | Score | 当前版本状态 | 当前版本号 | 模型工程名称 | 模型工程ID | 操作
  // ==========================================
  const [versionModelList, setVersionModelList] = useState([
    {
      modelId: 'sn-190001',
      problemType: '分类问题',
      dataName: '用户行为日志',
      dataType: '结构化数据',
      algorithmName: '随机森林',
      score: '0.85',
      status: '启用',
      version: 'v1.2',
      projectName: '用户行为分析',
      projectId: 'ME_02525',
    },
    {
      modelId: 'SN_654482',
      problemType: '回归预测',
      dataName: '销售额历史数据',
      dataType: '结构化数据',
      algorithmName: 'XGBoost',
      score: '0.78',
      status: '停用',
      version: 'v2.0',
      projectName: '销售预测模型',
      projectId: 'ME_02526',
    },
    {
      modelId: 'No.99876',
      problemType: '异常检测',
      dataName: '服务器监控日志',
      dataType: '时序数据',
      algorithmName: 'Isolation Forest',
      score: '0.90',
      status: '待发布',
      version: 'v1.5',
      projectName: '服务器异常检测',
      projectId: 'ME_02527',
    },
    {
      modelId: 'sn-330654',
      problemType: '动态阈值',
      dataName: 'CPU/内存指标序列',
      dataType: '时序数据',
      algorithmName: 'LSTM-AE',
      score: '0.94',
      status: '启用',
      version: 'v3.1',
      projectName: '核心算力基线模型',
      projectId: 'ME_02528',
    },
    {
      modelId: 'sn-882109',
      problemType: '时序预测',
      dataName: '网关带宽流量序列',
      dataType: '时序数据',
      algorithmName: 'Prophet-V2',
      score: '0.91',
      status: '启用',
      version: 'v2.4',
      projectName: '出口带宽容量预测',
      projectId: 'ME_02529',
    },
  ]);

  // Computed filtered version model list
  const filteredVersionModelList = versionModelList.filter((item) => {
    if (modelIdSearch.trim() && !item.modelId.toLowerCase().includes(modelIdSearch.trim().toLowerCase())) {
      return false;
    }
    if (projectIdSearch.trim() && !item.projectId.toLowerCase().includes(projectIdSearch.trim().toLowerCase())) {
      return false;
    }
    if (problemTypeSearch.trim() && !item.problemType.toLowerCase().includes(problemTypeSearch.trim().toLowerCase())) {
      return false;
    }
    if (dataTypeSearch.trim() && !item.dataType.toLowerCase().includes(dataTypeSearch.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  // ==========================================
  // 2. 模型快照 回滚弹窗状态
  // ==========================================
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const [activeRollbackVersion, setActiveRollbackVersion] = useState('v1.2');

  // 模型快照表格数据
  // 模型ID | 问题类型 | 数据名称 | 数据类型 | 算法名称 | Score | 创建时间 | 最新训练完成时间 | 最新启用时间 | 模型工程名称 | 模型工程ID
  const [snapshotRepoList, setSnapshotRepoList] = useState([
    {
      modelId: 'sn-190001',
      problemType: '异常检测',
      dataName: '服务器监控日志',
      dataType: '时序数据',
      algorithmName: '逻辑回归 + IsolationForest',
      score: '0.88',
      createTime: '2026-10-10 14:30:00',
      latestFinishTime: '2026-10-15 16:20:00',
      latestEnableTime: '2026-10-16 09:00:00',
      projectName: '算力节点时序离群检测',
      projectId: 'ME_02525',
    },
    {
      modelId: 'SN_654482',
      problemType: '回归预测',
      dataName: '电网负荷历史时序',
      dataType: '时序数据',
      algorithmName: '线性回归 + Prophet',
      score: '0.92',
      createTime: '2026-10-08 11:00:00',
      latestFinishTime: '2026-10-14 18:30:00',
      latestEnableTime: '2026-10-15 10:00:00',
      projectName: '负荷高峰容量预测',
      projectId: 'ME_02526',
    },
  ]);

  // Search states for 模型版本变更历史
  const [historyModelIdSearch, setHistoryModelIdSearch] = useState('');
  const [historyAuthorSearch, setHistoryAuthorSearch] = useState('');

  // ==========================================
  // 3. 模型版本变更历史 数据 (对应规范模型ID与丰富变更内容)
  // 序号 | 模型ID | 模型名称 | 变更时间 | 是否成功 | 变更人 | 当前版本号 | 上一版本号 | 变更说明 | 操作
  // ==========================================
  const [historyList, setHistoryList] = useState([
    {
      seq: 1,
      modelId: 'sn-190001',
      modelName: '用户行为分析与算力离群模型',
      changeTime: '2026-10-16 08:30:00',
      success: '是',
      author: '陈宇',
      currentVer: 'v2.1',
      prevVer: 'v2.0',
      description: '优化数据流特征加权算法，降低误报率 12%',
    },
    {
      seq: 2,
      modelId: 'sn-330654',
      modelName: '核心算力基线与动态阈值模型',
      changeTime: '2026-10-15 14:20:00',
      success: '是',
      author: '郑希',
      currentVer: 'v3.1',
      prevVer: 'v3.0',
      description: '完成在线增量训练，提升高峰算力预测精度',
    },
    {
      seq: 3,
      modelId: 'SN_654482',
      modelName: '电网负荷与存储降级预测模型',
      changeTime: '2026-10-14 16:40:00',
      success: '是',
      author: '王琳',
      currentVer: 'v2.0',
      prevVer: 'v1.9',
      description: '集成 Prophet-V2 超参自动调优，完成快照归档',
    },
    {
      seq: 4,
      modelId: 'No.99876',
      modelName: '服务器监控与异常检测模型',
      changeTime: '2026-10-13 11:00:00',
      success: '是',
      author: '郑宇',
      currentVer: 'v1.5',
      prevVer: 'v1.4',
      description: '调整 Isolation Forest 树深度，增加 CPU 丢包关联维度',
    },
    {
      seq: 5,
      modelId: 'sn-882109',
      modelName: '出口带宽与网络容量预测模型',
      changeTime: '2026-10-12 10:15:00',
      success: '否',
      author: '王振',
      currentVer: 'v2.4',
      prevVer: 'v2.3',
      description: '超参拟合未达收敛标准，已自动触发版本保护隔离',
    },
    {
      seq: 6,
      modelId: 'SN-46567',
      modelName: '虚拟机算力与丢包故障预测模型',
      changeTime: '2026-10-11 14:30:00',
      success: '是',
      author: '赵琳',
      currentVer: 'v1.2',
      prevVer: 'v1.1',
      description: '针对呼池-虚拟015更新特征工程包',
    },
    {
      seq: 7,
      modelId: 'SN-8379952',
      modelName: '计费账务核心数据库模型',
      changeTime: '2026-10-10 09:15:00',
      success: '是',
      author: '张伟',
      currentVer: 'v2.0',
      prevVer: 'v1.8',
      description: '热加载 XGBoost 规则库并重训基线包络线',
    },
    {
      seq: 8,
      modelId: 'SN-775589',
      modelName: 'AI推理节点GPU显存预测模型',
      changeTime: '2026-10-09 17:00:00',
      success: '是',
      author: '刘洋',
      currentVer: 'v1.8',
      prevVer: 'v1.7',
      description: '优化显存碎片预测概率分布',
    },
  ]);

  const filteredHistoryList = historyList.filter((item) => {
    if (historyModelIdSearch.trim() && !item.modelId.toLowerCase().includes(historyModelIdSearch.trim().toLowerCase())) {
      return false;
    }
    if (historyAuthorSearch.trim() && !item.author.toLowerCase().includes(historyAuthorSearch.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  // ==========================================
  // 5. 劣化模型监控 数据 (字段标题与原型完全一致)
  // 模型ID | 问题类型 | 数据名称 | 数据类型 | 算法名称 | Score | 当前版本状态 | 当前版本号 | 模型工程名称 | 模型工程ID | 操作
  // ==========================================
  const [degradedList, setDegradedList] = useState([
    {
      modelId: 'sn-190001',
      problemType: '分类问题',
      dataName: '用户行为日志',
      dataType: '结构化数据',
      algorithmName: '随机森林',
      score: '0.85',
      status: '已劣化',
      version: 'v1.2',
      projectName: '用户行为分析',
      projectId: 'ME_02525',
    },
    {
      modelId: 'SN_654482',
      problemType: '回归预测',
      dataName: '销售额历史数据',
      dataType: '时序数据',
      algorithmName: 'XGBoost',
      score: '0.78',
      status: '已劣化',
      version: 'v2.0',
      projectName: '销售预测模型',
      projectId: 'ME_02526',
    },
    {
      modelId: 'No.99876',
      problemType: '异常检测',
      dataName: '服务器监控日志',
      dataType: '时序数据',
      algorithmName: 'Isolation Forest',
      score: '0.90',
      status: '已劣化',
      version: 'v1.5',
      projectName: '服务器异常检测',
      projectId: 'ME_02527',
    },
  ]);

  // 劣化模型 Search States (完全对齐截图)
  const [degradedModelIdSearch, setDegradedModelIdSearch] = useState('');
  const [degradedProjectIdSearch, setDegradedProjectIdSearch] = useState('');
  const [degradedProblemTypeSearch, setDegradedProblemTypeSearch] = useState('');
  const [degradedDataTypeSearch, setDegradedDataTypeSearch] = useState('');
  const [isDegradedSearchExpanded, setIsDegradedSearchExpanded] = useState(true);

  const filteredDegradedList = degradedList.filter((item) => {
    if (degradedModelIdSearch.trim() && !item.modelId.toLowerCase().includes(degradedModelIdSearch.trim().toLowerCase())) {
      return false;
    }
    if (degradedProjectIdSearch.trim() && !item.projectId.toLowerCase().includes(degradedProjectIdSearch.trim().toLowerCase())) {
      return false;
    }
    if (degradedProblemTypeSearch.trim() && !item.problemType.toLowerCase().includes(degradedProblemTypeSearch.trim().toLowerCase())) {
      return false;
    }
    if (degradedDataTypeSearch.trim() && !item.dataType.toLowerCase().includes(degradedDataTypeSearch.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  // 模型性能监控 State (完全对齐截图)
  const [perfModelIdSearch, setPerfModelIdSearch] = useState('');
  const [perfVersionSelect, setPerfVersionSelect] = useState('V1.00.0.1');
  const [isPerfSearchExpanded, setIsPerfSearchExpanded] = useState(true);
  const [isPerfMetricExpanded, setIsPerfMetricExpanded] = useState(true);

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
          SUB-VIEW 1: 模型版本管理 (完全对齐原型字段)
         ======================================================== */}
      {subTab === 'model_version_mgmt' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>模型版本管理</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">模型库</span>
            </h2>
          </div>

          {/* 搜索条件栏 (完全对齐原型截图) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-sans text-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">模型ID:</span>
                  <input
                    type="text"
                    value={modelIdSearch}
                    onChange={(e) => setModelIdSearch(e.target.value)}
                    placeholder="请输入查询内容"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">模型工程ID:</span>
                  <input
                    type="text"
                    value={projectIdSearch}
                    onChange={(e) => setProjectIdSearch(e.target.value)}
                    placeholder="请输入查询内容"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">问题类型:</span>
                  <input
                    type="text"
                    value={problemTypeSearch}
                    onChange={(e) => setProblemTypeSearch(e.target.value)}
                    placeholder="请输入查询内容"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-sky-500 font-sans"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">数据类型:</span>
                  <input
                    type="text"
                    value={dataTypeSearch}
                    onChange={(e) => setDataTypeSearch(e.target.value)}
                    placeholder="请输入查询内容"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-sky-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast(`已成功搜索，匹配到 ${filteredVersionModelList.length} 条模型版本记录`);
                  }}
                  className="px-6 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
                >
                  查询
                </button>
                <button
                  onClick={() => {
                    setModelIdSearch('');
                    setProjectIdSearch('');
                    setProblemTypeSearch('');
                    setDataTypeSearch('');
                    showToast('已重置所有模型版本搜索条件');
                  }}
                  className="px-6 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors text-xs"
                >
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* 表头完全对齐: 模型ID | 问题类型 | 数据名称 | 数据类型 | 算法名称 | Score | 当前版本状态 | 当前版本号 | 模型工程名称 | 模型工程ID | 操作 */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-4">模型ID</th>
                  <th className="py-3 px-4">问题类型</th>
                  <th className="py-3 px-4">数据名称</th>
                  <th className="py-3 px-4">数据类型</th>
                  <th className="py-3 px-4">算法名称</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">当前版本状态</th>
                  <th className="py-3 px-4">当前版本号</th>
                  <th className="py-3 px-4">模型工程名称</th>
                  <th className="py-3 px-4">模型工程ID</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredVersionModelList.length > 0 ? (
                  filteredVersionModelList.map((row) => (
                    <tr key={row.modelId} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-cyan-300 font-bold">{row.modelId}</td>
                      <td className="py-3 px-4 font-sans">{row.problemType}</td>
                      <td className="py-3 px-4 font-sans text-white">{row.dataName}</td>
                      <td className="py-3 px-4 font-sans text-slate-400">{row.dataType}</td>
                      <td className="py-3 px-4">{row.algorithmName}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{row.score}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.status === '启用'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : row.status === '待发布'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-indigo-400 font-bold">{row.version}</td>
                      <td className="py-3 px-4 font-sans text-white">{row.projectName}</td>
                      <td className="py-3 px-4 text-slate-400">{row.projectId}</td>
                      <td className="py-3 px-4 text-center font-sans whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setVersionModelList(prev => prev.map(m => m.modelId === row.modelId ? { ...m, status: m.status === '启用' ? '停用' : '启用' } : m));
                              showToast(`模型 [${row.modelId}] 状态已变更`);
                            }}
                            className={`${row.status === '启用' ? 'text-amber-400' : 'text-emerald-400'} hover:underline`}
                          >
                            {row.status === '启用' ? '停用' : '启用'}
                          </button>
                          <span className="text-slate-600">|</span>
                          <button
                            onClick={() => {
                              setActiveRollbackVersion(row.version);
                              setIsRollbackModalOpen(true);
                            }}
                            className="text-sky-400 hover:underline"
                          >
                            回滚
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-500 font-sans">
                      暂无匹配的模型版本记录，请尝试调整查询条件
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 2: 模型快照 (完全对齐原型字段)
         ======================================================== */}
      {subTab === 'model_snapshot' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>模型快照</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">已启用模型库</span>
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">模型ID：</span>
              <input type="text" placeholder="sn-190001" className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs w-28" />
              <span className="text-slate-400">问题类型：</span>
              <input type="text" placeholder="异常检测" className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs w-28" />
              <span className="text-slate-400">模型工程名称：</span>
              <input type="text" placeholder="输入名称..." className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs w-32" />
              <button onClick={() => showToast('已执行快照库检索')} className="px-3 py-1 bg-sky-600 text-white rounded font-bold text-xs">
                查询
              </button>
            </div>
          </div>

          {/* 快照详细属性卡片 (对齐原型字段) */}
          {/* 模型训练完成时间： | 模型版本号： | 回滚至该版本 | 查看性能监控 | 当前 | 算法名称：线性回归 | 数据类型：时间序列 | 样本数量：35100 | 数据特征：周期型 | 训练时长：3day23hours | 训练结果：成功 | 评价方法：AUC | Score：0.63 | 问题类型：异常检测 */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-4">
                <span>模型版本号：<strong className="text-indigo-400 text-sm">v1.2</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">当前</span>
                <span>模型训练完成时间：<strong className="text-white">2026-10-15 16:20:00</strong></span>
              </div>
              <div className="flex items-center gap-2 font-sans">
                <button
                  onClick={() => setIsRollbackModalOpen(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold"
                >
                  回滚至该版本
                </button>
                <button
                  onClick={() => handleTabChange('model_perf_monitor')}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold"
                >
                  查看性能监控
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-300">
              <div>算法名称：<span className="text-white font-bold">线性回归 / 逻辑回归</span></div>
              <div>数据类型：<span className="text-cyan-300">时间序列</span></div>
              <div>样本数量：<span className="text-white">35100</span></div>
              <div>数据特征：<span className="text-white">周期型</span></div>
              <div>训练时长：<span className="text-white">3day23hours</span></div>
              <div>训练结果：<span className="text-emerald-400 font-bold">成功</span></div>
              <div>评价方法：<span className="text-white">AUC</span></div>
              <div>Score：<span className="text-emerald-400 font-bold">0.88</span></div>
            </div>
          </div>

          {/* 表头完全对齐: 模型ID | 问题类型 | 数据名称 | 数据类型 | 算法名称 | Score | 创建时间 | 最新训练完成时间 | 最新启用时间 | 模型工程名称 | 模型工程ID */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-3">模型ID</th>
                  <th className="py-3 px-3">问题类型</th>
                  <th className="py-3 px-3">数据名称</th>
                  <th className="py-3 px-3">数据类型</th>
                  <th className="py-3 px-3">算法名称</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">创建时间</th>
                  <th className="py-3 px-3">最新训练完成时间</th>
                  <th className="py-3 px-3">最新启用时间</th>
                  <th className="py-3 px-3">模型工程名称</th>
                  <th className="py-3 px-3">模型工程ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {snapshotRepoList.map((row) => (
                  <tr key={row.modelId} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-cyan-300 font-bold">{row.modelId}</td>
                    <td className="py-3 px-3 font-sans">{row.problemType}</td>
                    <td className="py-3 px-3 font-sans text-white">{row.dataName}</td>
                    <td className="py-3 px-3 font-sans text-slate-400">{row.dataType}</td>
                    <td className="py-3 px-3">{row.algorithmName}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{row.score}</td>
                    <td className="py-3 px-3 text-slate-400">{row.createTime}</td>
                    <td className="py-3 px-3 text-slate-400">{row.latestFinishTime}</td>
                    <td className="py-3 px-3 text-slate-400">{row.latestEnableTime}</td>
                    <td className="py-3 px-3 font-sans text-white">{row.projectName}</td>
                    <td className="py-3 px-3 text-slate-400">{row.projectId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 3: 模型版本变更历史 (完全对齐原型字段)
         ======================================================== */}
      {subTab === 'version_history' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>模型版本变更历史列表</span>
            </h2>
          </div>

          {/* 模型ID & 变更人搜索筛选栏 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-medium">模型ID:</span>
                <input
                  type="text"
                  value={historyModelIdSearch}
                  onChange={(e) => setHistoryModelIdSearch(e.target.value)}
                  placeholder="输入模型ID..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs w-48 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-medium">变更人:</span>
                <input
                  type="text"
                  value={historyAuthorSearch}
                  onChange={(e) => setHistoryAuthorSearch(e.target.value)}
                  placeholder="输入变更人..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs w-40 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast(`检索到 ${filteredHistoryList.length} 条模型版本变更记录`)}
                className="px-6 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
              >
                查询
              </button>
              <button
                onClick={() => {
                  setHistoryModelIdSearch('');
                  setHistoryAuthorSearch('');
                  showToast('已重置模型版本变更历史搜索条件');
                }}
                className="px-6 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors text-xs"
              >
                重置
              </button>
            </div>
          </div>

          {/* 表头完全对齐: 序号 | 模型ID | 模型名称 | 变更时间 | 是否成功 | 变更人 | 当前版本号 | 上一版本号 | 变更说明 | 操作 */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-4">序号</th>
                  <th className="py-3 px-4">模型ID</th>
                  <th className="py-3 px-4">模型名称</th>
                  <th className="py-3 px-4">变更时间</th>
                  <th className="py-3 px-4">是否成功</th>
                  <th className="py-3 px-4">变更人</th>
                  <th className="py-3 px-4">当前版本号</th>
                  <th className="py-3 px-4">上一版本号</th>
                  <th className="py-3 px-4">变更说明</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredHistoryList.length > 0 ? (
                  filteredHistoryList.map((row) => (
                    <tr key={row.seq} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400">{row.seq}</td>
                      <td className="py-3 px-4 text-cyan-300 font-bold">{row.modelId}</td>
                      <td className="py-3 px-4 font-sans text-white font-medium">{row.modelName}</td>
                      <td className="py-3 px-4 text-slate-400">{row.changeTime}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.success === '是' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {row.success}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-white">{row.author}</td>
                      <td className="py-3 px-4 text-indigo-400 font-bold">{row.currentVer}</td>
                      <td className="py-3 px-4 text-slate-400">{row.prevVer}</td>
                      <td className="py-3 px-4 font-sans text-slate-300 text-[11px] max-w-xs">{row.description}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <button onClick={() => showToast(`查看模型 [${row.modelId}] 的变更日志: ${row.description}`)} className="text-sky-400 hover:underline">
                          查看
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500 font-sans">
                      暂无匹配的模型变更历史，请尝试调整查询条件
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>共 {filteredHistoryList.length} 条历史变更记录</span>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 4: 模型性能监控 (完全对齐原型截图 layout)
         ======================================================== */}
      {subTab === 'model_perf_monitor' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          {/* 页面大标题 */}
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">模型性能监控</h2>
          </div>

          {/* 顶部搜索条 (完全对齐截图: 模型ID | 请输入查询内容 | [查询] [重置] 收起^) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans text-xs">
            {isPerfSearchExpanded ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-medium">模型ID:</span>
                  <input
                    type="text"
                    value={perfModelIdSearch}
                    onChange={(e) => setPerfModelIdSearch(e.target.value)}
                    placeholder="请输入查询内容"
                    className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white text-xs w-52 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => showToast(`已为您查询模型 [${perfModelIdSearch || 'sn-190001'}] 的性能监控特征`)}
                    className="px-6 py-1 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded shadow-md transition-colors text-xs"
                  >
                    查询
                  </button>
                  <button
                    onClick={() => {
                      setPerfModelIdSearch('');
                      showToast('已重置查询条件');
                    }}
                    className="px-6 py-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded transition-colors text-xs"
                  >
                    重置
                  </button>
                  <button
                    onClick={() => setIsPerfSearchExpanded(false)}
                    className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 text-xs ml-1"
                  >
                    <span>收起</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">查询条件已收起</span>
                <button
                  onClick={() => setIsPerfSearchExpanded(true)}
                  className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 text-xs"
                >
                  <span>展开</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 子块分割标题: | 模型性能监控 */}
          <div className="pt-2 pb-2 border-b border-slate-800/80 flex items-center">
            <div className="border-l-4 border-sky-400 pl-3 font-bold text-white text-sm">
              模型性能监控
            </div>
          </div>

          {/* 指标卡片 (v cpu_usage_percent 折叠层) */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6 font-sans text-xs">
            {/* 指标名称头部 (可展开/折叠) */}
            <div
              onClick={() => setIsPerfMetricExpanded(!isPerfMetricExpanded)}
              className="flex items-center gap-2 cursor-pointer text-sky-400 hover:text-sky-300 font-semibold text-sm transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 text-sky-400 transition-transform ${isPerfMetricExpanded ? '' : '-rotate-90'}`}
              />
              <span>cpu_usage_percent</span>
            </div>

            {/* 指标详情字段列表 (完全对齐截图排列与红条柱状图) */}
            {isPerfMetricExpanded && (
              <div className="grid grid-cols-[160px_1fr] items-center gap-y-5 text-slate-300 text-xs pl-4 font-sans">
                {/* 1. 选择模型查询版本 */}
                <span className="text-slate-400 text-right pr-8 font-medium">选择模型查询版本</span>
                <div>
                  <select
                    value={perfVersionSelect}
                    onChange={(e) => {
                      setPerfVersionSelect(e.target.value);
                      showToast(`已切换模型查询版本为 [${e.target.value}]`);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white text-xs w-48 focus:outline-none focus:border-sky-500 font-mono"
                  >
                    <option value="V1.00.0.1">V1.00.0.1</option>
                    <option value="V1.00.0.2">V1.00.0.2</option>
                    <option value="V1.00.0.3">V1.00.0.3</option>
                  </select>
                </div>

                {/* 2. 类型 */}
                <span className="text-slate-400 text-right pr-8 font-medium">类型</span>
                <span className="text-slate-200 font-mono font-bold">CAT</span>

                {/* 3. 参考分布 (红色直方图柱状) */}
                <span className="text-slate-400 text-right pr-8 font-medium">参考分布</span>
                <div className="flex items-end gap-1 h-8 py-0.5">
                  {[28, 26, 24, 22, 20, 16, 12, 8, 5, 2].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}px` }}
                      className="w-2.5 bg-red-600 rounded-xs hover:bg-red-500 transition-all"
                    />
                  ))}
                </div>

                {/* 4. 当前分布 (红色直方图柱状) */}
                <span className="text-slate-400 text-right pr-8 font-medium">当前分布</span>
                <div className="flex items-end gap-1 h-8 py-0.5">
                  {[26, 26, 24, 22, 20, 16, 12, 8, 5, 2].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}px` }}
                      className="w-2.5 bg-red-600 rounded-xs hover:bg-red-500 transition-all"
                    />
                  ))}
                </div>

                {/* 5. 数据漂移 */}
                <span className="text-slate-400 text-right pr-8 font-medium">数据漂移</span>
                <span className="text-slate-200 font-mono font-bold">Detected</span>

                {/* 6. 相似度检验P值 */}
                <span className="text-slate-400 text-right pr-8 font-medium">相似度检验P值</span>
                <span className="text-slate-200 font-mono font-bold">0.0000118</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 5: 劣化模型监控 (完全对齐原型字段)
         ======================================================== */}
      {subTab === 'degraded_model_monitor' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>劣化模型监控</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">劣化模型库</span>
            </h2>
          </div>

          {/* 搜索条件栏 (完全对齐原型截图: 模型ID | 模型工程ID | 问题类型 | 数据类型 | 查询 | 重置 | 收起) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans text-xs">
            {isDegradedSearchExpanded ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">模型ID:</span>
                    <input
                      type="text"
                      value={degradedModelIdSearch}
                      onChange={(e) => setDegradedModelIdSearch(e.target.value)}
                      placeholder="请输入查询内容"
                      className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">模型工程ID:</span>
                    <input
                      type="text"
                      value={degradedProjectIdSearch}
                      onChange={(e) => setDegradedProjectIdSearch(e.target.value)}
                      placeholder="请输入查询内容"
                      className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">问题类型:</span>
                    <input
                      type="text"
                      value={degradedProblemTypeSearch}
                      onChange={(e) => setDegradedProblemTypeSearch(e.target.value)}
                      placeholder="请输入查询内容"
                      className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-sky-500 font-sans"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">数据类型:</span>
                    <input
                      type="text"
                      value={degradedDataTypeSearch}
                      onChange={(e) => setDegradedDataTypeSearch(e.target.value)}
                      placeholder="请输入查询内容"
                      className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-sky-500 font-sans"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      showToast(`已成功查询劣化模型，匹配到 ${filteredDegradedList.length} 条记录`);
                    }}
                    className="px-6 py-1 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded shadow-md transition-colors text-xs"
                  >
                    查询
                  </button>
                  <button
                    onClick={() => {
                      setDegradedModelIdSearch('');
                      setDegradedProjectIdSearch('');
                      setDegradedProblemTypeSearch('');
                      setDegradedDataTypeSearch('');
                      showToast('已重置所有劣化模型查询条件');
                    }}
                    className="px-6 py-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded transition-colors text-xs"
                  >
                    重置
                  </button>
                  <button
                    onClick={() => setIsDegradedSearchExpanded(false)}
                    className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 text-xs ml-1"
                  >
                    <span>收起</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">查询条件已收起</span>
                <button
                  onClick={() => setIsDegradedSearchExpanded(true)}
                  className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 text-xs"
                >
                  <span>展开</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 表头完全对齐: 模型ID | 问题类型 | 数据名称 | 数据类型 | 算法名称 | Score | 当前版本状态 | 当前版本号 | 模型工程名称 | 模型工程ID | 操作 */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-4">模型ID</th>
                  <th className="py-3 px-4">问题类型</th>
                  <th className="py-3 px-4">数据名称</th>
                  <th className="py-3 px-4">数据类型</th>
                  <th className="py-3 px-4">算法名称</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">当前版本状态</th>
                  <th className="py-3 px-4">当前版本号</th>
                  <th className="py-3 px-4">模型工程名称</th>
                  <th className="py-3 px-4">模型工程ID</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredDegradedList.length > 0 ? (
                  filteredDegradedList.map((row) => (
                    <tr key={row.modelId} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-cyan-300 font-bold">{row.modelId}</td>
                      <td className="py-3 px-4 font-sans">{row.problemType}</td>
                      <td className="py-3 px-4 font-sans text-white">{row.dataName}</td>
                      <td className="py-3 px-4 font-sans text-slate-400">{row.dataType}</td>
                      <td className="py-3 px-4">{row.algorithmName}</td>
                      <td className="py-3 px-4 text-rose-400 font-bold">{row.score}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-indigo-400 font-bold">{row.version}</td>
                      <td className="py-3 px-4 font-sans text-white">{row.projectName}</td>
                      <td className="py-3 px-4 text-slate-400">{row.projectId}</td>
                      <td className="py-3 px-4 text-center font-sans whitespace-nowrap">
                        <button
                          onClick={() => showToast(`已为模型 [${row.modelId}] 触发自动重训流水线！`)}
                          className="text-amber-400 hover:underline font-bold"
                        >
                          自动重新训练
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-500 font-sans">
                      暂无匹配的劣化模型，请尝试调整查询条件
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 原型回滚模态弹窗 (文案严格对齐原型) */}
      {/* 请确认是否进行回滚操作，回滚将在5分钟内完成，在回滚期间，结论可能来自旧版本模型。 | 确定 | 取消 */}
      {isRollbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <span>回滚确认</span>
              </h3>
              <button onClick={() => setIsRollbackModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              请确认是否进行回滚操作，回滚将在5分钟内完成，在回滚期间，结论可能来自旧版本模型。
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsRollbackModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsRollbackModalOpen(false);
                  showToast(`已成功将模型回滚至 ${activeRollbackVersion} 版本！`);
                }}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/20"
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
