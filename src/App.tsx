import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KPIBar } from './components/KPIBar';
import { CapabilityFlowMap } from './components/CapabilityFlowMap';
import { ModelDistributionDonut } from './components/ModelDistributionDonut';
import { MonitoredResourcesGrid } from './components/MonitoredResourcesGrid';
import { AlgorithmFamilyBrain } from './components/AlgorithmFamilyBrain';
import { NotificationCenter } from './components/NotificationCenter';
import { TrendPredictionTop10 } from './components/TrendPredictionTop10';
import { Top5ModelAlertsChart } from './components/Top5ModelAlertsChart';
import { ClassifiedModelAlertsTrend } from './components/ClassifiedModelAlertsTrend';
import { NodeDetailModal } from './components/NodeDetailModal';
import { AlgorithmFamilyModal } from './components/AlgorithmFamilyModal';
import { AIDiagnosticDrawer } from './components/AIDiagnosticDrawer';
import { AIModelingManagementView } from './components/AIModelingManagementView';
import { AnomalyHallView } from './components/AnomalyHallView';
import { MetricAnomalyView } from './components/MetricAnomalyView';
import { ModelBoardView } from './components/ModelBoardView';
import { DynamicThresholdReportView } from './components/DynamicThresholdReportView';
import { MultiMetricReportView } from './components/MultiMetricReportView';
import { SingleMetricReportView } from './components/SingleMetricReportView';
import { MetricScenarioReportView } from './components/MetricScenarioReportView';
import { DynamicAlarmConfigView } from './components/DynamicAlarmConfigView';
import { GeneralAlarmConfigView } from './components/GeneralAlarmConfigView';
import { FaultDiagnosisView } from './components/FaultDiagnosisView';
import { SmartPredictionView } from './components/SmartPredictionView';
import { MLOpsManagementView } from './components/MLOpsManagementView';
import { DataManagementView } from './components/DataManagementView';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';

import {
  INITIAL_KPIS,
  CAPABILITY_NODES,
  MODEL_CATEGORY_DISTRIBUTION,
  TOTAL_ENABLED_MODELS,
  MONITORED_RESOURCES,
  ALGORITHM_FAMILIES,
  INITIAL_NOTIFICATIONS,
  TREND_PREDICTIONS,
  TOP5_MODEL_ALERTS,
  CLASSIFIED_TREND_DATA,
} from './mock/aiopsData';

import { CapabilityNode, AlgorithmFamily, NotificationItem } from './types/aiops';

export default function App() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<string>('admin');

  const handleLogin = (userAccount: string) => {
    setCurrentUser(userAccount || 'admin');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [modelingSubView, setModelingSubView] = useState<string>('models');
  const [anomalySubView, setAnomalySubView] = useState<string>('anomaly_hall');
  const [diagnosisSubView, setDiagnosisSubView] = useState<string>('alert_mgmt');
  const [predictionSubView, setPredictionSubView] = useState<string>('fault_prediction');
  const [mlopsSubView, setMlopsSubView] = useState<string>('model_version_mgmt');
  const [dataSubView, setDataSubView] = useState<string>('exploration');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);

  // Data states
  const [kpis, setKpis] = useState(INITIAL_KPIS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Modals / Drawers
  const [selectedNode, setSelectedNode] = useState<CapabilityNode | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<AlgorithmFamily | null>(null);
  const [selectedAlertForDiag, setSelectedAlertForDiag] = useState<NotificationItem | null>(null);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState<boolean>(false);

  // Live simulation ticker
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setKpis((prev) =>
        prev.map((kpi) => {
          if (kpi.id === 'kpi-3') {
            const currentVal = parseInt(kpi.value.toString(), 10) || 813;
            const delta = Math.floor(Math.random() * 5) - 2;
            return { ...kpi, value: Math.max(780, currentVal + delta).toString() };
          }
          return kpi;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const handleOpenAIDiagnosticsWithAlert = (alertItem: NotificationItem) => {
    setSelectedAlertForDiag(alertItem);
    setIsAIDrawerOpen(true);
  };

  const handleSetActiveTab = (tab: string, subView?: string) => {
    setActiveTab(tab);
    if (tab === 'modeling' && subView) {
      setModelingSubView(subView);
    }
    if (tab === 'anomaly' && subView) {
      setAnomalySubView(subView);
    }
    if (tab === 'diagnosis' && subView) {
      setDiagnosisSubView(subView);
    }
    if (tab === 'prediction' && subView) {
      setPredictionSubView(subView);
    }
    if (tab === 'mlops' && subView) {
      setMlopsSubView(subView);
    }
    if (tab === 'data' && subView) {
      setDataSubView(subView);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black flex flex-col">
      {/* Top Header */}
      <Header
        isLiveMode={isLiveMode}
        setIsLiveMode={setIsLiveMode}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAIDiagnostics={() => {
          setSelectedAlertForDiag(null);
          setIsAIDrawerOpen(true);
        }}
      />

      {/* Main Container with Left Sidebar & Content Viewport */}
      <div className="flex flex-1 w-full relative min-h-[calc(100vh-64px)]">
        {/* Left Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          currentSubViews={{
            modeling: modelingSubView,
            anomaly: anomalySubView,
            diagnosis: diagnosisSubView,
            prediction: predictionSubView,
            mlops: mlopsSubView,
            data: dataSubView,
          }}
        />

        {/* Right Content Viewport */}
        <main className="flex-1 px-4 lg:px-8 py-6 max-w-[1800px] w-full min-w-0 space-y-6 overflow-x-hidden">
        {activeTab === 'overview' && (
          <>
            {/* Row 1: KPI Top Bar */}
            <KPIBar kpis={kpis} onSelectKpi={(id) => console.log('Selected KPI:', id)} />

            {/* Row 2: Core Capability Flow Map Diagram */}
            <CapabilityFlowMap
              nodes={CAPABILITY_NODES}
              onSelectNode={(node) => setSelectedNode(node)}
            />

            {/* Row 3: Middle Operational Matrix (3 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Column 1: Model Classification Donut + Monitored Resources */}
              <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
                <ModelDistributionDonut
                  categories={MODEL_CATEGORY_DISTRIBUTION}
                  totalModels={TOTAL_ENABLED_MODELS}
                />
                <MonitoredResourcesGrid resources={MONITORED_RESOURCES} />
              </div>

              {/* Column 2: Central AI Brain & Algorithm Family Matrix */}
              <div className="lg:col-span-4">
                <AlgorithmFamilyBrain
                  families={ALGORITHM_FAMILIES}
                  onSelectFamily={(fam) => setSelectedFamily(fam)}
                />
              </div>

              {/* Column 3: Real-Time Notification Center */}
              <div className="lg:col-span-4">
                <NotificationCenter
                  notifications={notifications}
                  onDiagnoseItem={handleOpenAIDiagnosticsWithAlert}
                />
              </div>
            </div>

            {/* Row 4: Bottom Analytical Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Trend Prediction Top 10 */}
              <div className="lg:col-span-4">
                <TrendPredictionTop10 predictions={TREND_PREDICTIONS} />
              </div>

              {/* Top 5 Model Alerts Bar Chart */}
              <div className="lg:col-span-4">
                <Top5ModelAlertsChart alerts={TOP5_MODEL_ALERTS} />
              </div>

              {/* Classified Model Alerts Spline Trend */}
              <div className="lg:col-span-4">
                <ClassifiedModelAlertsTrend data={CLASSIFIED_TREND_DATA} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'modeling' && <AIModelingManagementView initialSubView={modelingSubView} />}

        {activeTab === 'anomaly' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-md shadow-xl animate-fadeIn">
            {/* Anomaly Sub-Menu Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
              {[
                { id: 'anomaly_hall', label: '异常发现统计大厅' },
                { id: 'metric_anomaly', label: '指标异常发现' },
                { id: 'model_board', label: '模型看板' },
                { id: 'dynamic_threshold_report', label: '动态阈值报告' },
                { id: 'single_metric_report', label: '单指标异常检测报告' },
                { id: 'multi_metric_report', label: '多指标异常检测报告' },
                { id: 'metric_scenario_report', label: '指标异常发现报告(场景)' },
                { id: 'dynamic_alarm_config', label: '动态阈值告警配置' },
                { id: 'dynamic_alarm_general_config', label: '动态阈值告警配置(通用配置)' },
              ].map((sub) => {
                const isSelected = anomalySubView === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setAnomalySubView(sub.id)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
                      isSelected
                        ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                        : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-view Content Body */}
            {anomalySubView === 'anomaly_hall' ? (
              <AnomalyHallView />
            ) : anomalySubView === 'metric_anomaly' ? (
              <MetricAnomalyView onOpenModelBoard={() => setAnomalySubView('model_board')} />
            ) : anomalySubView === 'model_board' ? (
              <ModelBoardView onBack={() => setAnomalySubView('metric_anomaly')} />
            ) : anomalySubView === 'dynamic_threshold_report' ? (
              <DynamicThresholdReportView />
            ) : anomalySubView === 'multi_metric_report' ? (
              <MultiMetricReportView />
            ) : anomalySubView === 'single_metric_report' ? (
              <SingleMetricReportView />
            ) : anomalySubView === 'metric_scenario_report' ? (
              <MetricScenarioReportView />
            ) : anomalySubView === 'dynamic_alarm_config' ? (
              <DynamicAlarmConfigView />
            ) : anomalySubView === 'dynamic_alarm_general_config' ? (
              <GeneralAlarmConfigView />
            ) : (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>
                      {anomalySubView === 'metric_anomaly' && '指标异常发现'}
                      {anomalySubView === 'model_board' && '模型看板'}
                      {anomalySubView === 'dynamic_threshold_report' && '动态阈值报告'}
                      {anomalySubView === 'single_metric_report' && '单指标异常检测报告'}
                      {anomalySubView === 'multi_metric_report' && '多指标异常检测报告'}
                      {anomalySubView === 'metric_scenario_report' && '指标异常发现报告(场景)'}
                      {anomalySubView === 'dynamic_alarm_config' && '动态阈值告警配置'}
                      {anomalySubView === 'dynamic_alarm_general_config' && '动态阈值告警配置(通用配置)'}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">实时推演状态: 已同步</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  当前正处于【
                  <span className="text-cyan-400 font-bold">
                    {anomalySubView === 'metric_anomaly' && '指标异常发现'}
                    {anomalySubView === 'model_board' && '模型看板'}
                    {anomalySubView === 'dynamic_threshold_report' && '动态阈值报告'}
                    {anomalySubView === 'single_metric_report' && '单指标异常检测报告'}
                    {anomalySubView === 'multi_metric_report' && '多指标异常检测报告'}
                    {anomalySubView === 'metric_scenario_report' && '指标异常发现报告(场景)'}
                    {anomalySubView === 'dynamic_alarm_config' && '动态阈值告警配置'}
                    {anomalySubView === 'dynamic_alarm_general_config' && '动态阈值告警配置(通用配置)'}
                  </span>
                  】功能子模块，AI 推理引擎实时对接 256+ 核心节点的基线离群率与概率密度分布。
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnosis' && (
          <FaultDiagnosisView
            initialSubView={diagnosisSubView}
            onSubViewChange={setDiagnosisSubView}
          />
        )}
        {activeTab === 'prediction' && (
          <SmartPredictionView
            initialSubView={predictionSubView}
            onSubViewChange={setPredictionSubView}
          />
        )}
        {activeTab === 'mlops' && (
          <MLOpsManagementView
            initialSubView={mlopsSubView}
            onSubViewChange={setMlopsSubView}
          />
        )}
        {activeTab === 'data' && (
          <DataManagementView
            initialSubView={dataSubView}
            onSubViewChange={setDataSubView}
          />
        )}
      </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1800px] mx-auto">
          <span>DeepBrain AIOps 数智运维系统 © 2026 企业级高可用运维总览平台</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>建模引擎 v4.2.0</span>
            <span>·</span>
            <span>图谱节点: 256</span>
            <span>·</span>
            <span>推演延迟: &lt; 0.8s</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      <AlgorithmFamilyModal family={selectedFamily} onClose={() => setSelectedFamily(null)} />
      <AIDiagnosticDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        selectedAlert={selectedAlertForDiag}
      />
    </div>
  );
}
