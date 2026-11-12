import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  ShieldAlert,
  Stethoscope,
  TrendingUp,
  GitBranch,
  Database,
  ChevronDown,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Box,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string, subView?: string) => void;
  currentSubViews: {
    modeling: string;
    anomaly: string;
    diagnosis: string;
    prediction: string;
    mlops: string;
    data: string;
  };
}

export const NAV_ITEMS = [
  { id: 'overview', label: '总览', icon: Activity },
  {
    id: 'modeling',
    label: 'AI建模管理',
    icon: Cpu,
    subItems: [
      { id: 'project', label: '创建模型工程' },
      { id: 'training', label: '训练中心' },
      { id: 'models', label: '模型库与算法库' },
      { id: 'exploration', label: '数据探索' },
      { id: 'calendar', label: '重大活动日期标注' },
    ],
  },
  {
    id: 'anomaly',
    label: '异常发现',
    icon: ShieldAlert,
    subItems: [
      { id: 'anomaly_hall', label: '异常发现统计大厅' },
      { id: 'metric_anomaly', label: '指标异常发现' },
      { id: 'model_board', label: '模型看板' },
      { id: 'dynamic_threshold_report', label: '动态阈值报告' },
      { id: 'single_metric_report', label: '单指标异常检测报告' },
      { id: 'multi_metric_report', label: '多指标异常检测报告' },
      { id: 'metric_scenario_report', label: '指标异常发现报告(场景)' },
      { id: 'dynamic_alarm_config', label: '动态阈值告警配置' },
      { id: 'dynamic_alarm_general_config', label: '动态阈值告警配置(通用配置)' },
    ],
  },
  {
    id: 'diagnosis',
    label: '故障诊断',
    icon: Stethoscope,
    subItems: [
      { id: 'alert_mgmt', label: '告警管理' },
      { id: 'alert_convergence', label: '告警收敛' },
      { id: 'fault_trace', label: '故障溯源分析' },
      { id: 'demarcation', label: '定界定位' },
      { id: 'demarcation_table', label: '定界定位（表格）' },
      { id: 'root_cause_analysis', label: '故障根因分析' },
      { id: 'root_cause_table', label: '故障根因分析(表格)' },
      { id: 'rule_base', label: '根因规则库' },
      { id: 'rule_base_simplified', label: '根因规则库(简化)' },
    ],
  },
  {
    id: 'prediction',
    label: '智能预测',
    icon: TrendingUp,
    subItems: [
      { id: 'fault_prediction', label: '故障预测' },
      { id: 'ai_fault_report', label: 'AI故障预测报告' },
      { id: 'perf_metric_prediction', label: '性能指标预测' },
      { id: 'single_metric_pred_report', label: '单指标预测报告' },
      { id: 'overall_metric_pred_report', label: '指标整体预测报告' },
    ],
  },
  {
    id: 'mlops',
    label: 'MLOps',
    icon: GitBranch,
    subItems: [
      { id: 'model_version_mgmt', label: '模型版本管理' },
      { id: 'model_snapshot', label: '模型快照' },
      { id: 'version_history', label: '模型版本变更历史' },
      { id: 'model_perf_monitor', label: '模型性能监控' },
      { id: 'degraded_model_monitor', label: '劣化模型监控' },
    ],
  },
  {
    id: 'data',
    label: '数据管理',
    icon: Database,
    subItems: [
      { id: 'exploration', label: '数据探索' },
      { id: 'calendar', label: '重大活动日期标注' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentSubViews,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({
    modeling: true,
    anomaly: true,
    diagnosis: true,
    prediction: true,
    mlops: true,
    data: true,
  });

  const toggleTabExpand = (tabId: string) => {
    setExpandedTabs((prev) => ({
      ...prev,
      [tabId]: !prev[tabId],
    }));
  };

  return (
    <aside
      className={`shrink-0 bg-slate-950/95 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between sticky top-16 h-[calc(100vh-64px)] z-30 font-sans select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="overflow-y-auto py-4 px-2 space-y-1.5 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActiveTab = activeTab === item.id;
          const isExpanded = expandedTabs[item.id] ?? false;
          const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);

          // Get active subView for this tab
          const activeSubView = currentSubViews[item.id as keyof typeof currentSubViews] || '';

          return (
            <div key={item.id} className="space-y-0.5">
              {/* Category Main Header Button */}
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleTabExpand(item.id);
                    const firstSub = item.subItems?.[0]?.id || '';
                    setActiveTab(item.id, activeSubView || firstSub);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActiveTab
                    ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActiveTab ? 'text-cyan-400 font-bold' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && hasSubItems && (
                  <div className="text-slate-500 group-hover:text-slate-300 transition-colors shrink-0 ml-1">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                )}
              </button>

              {/* Accordion Sub-items List */}
              {!isCollapsed && hasSubItems && isExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-slate-800/80 ml-4 animate-fadeIn">
                  {item.subItems?.map((sub) => {
                    const isSubActive = isActiveTab && activeSubView === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab(item.id, sub.id);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between ${
                          isSubActive
                            ? 'bg-sky-500 text-white font-bold shadow-sm shadow-sky-500/30 pl-3.5'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-glow" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Collapse Toggle Button */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-950">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-cyan-400" />
              <span>收起侧边栏</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
