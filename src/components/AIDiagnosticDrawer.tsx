import React, { useState } from 'react';
import { X, Sparkles, Brain, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, Send, ShieldAlert } from 'lucide-react';
import { NotificationItem } from '../types/aiops';

interface AIDiagnosticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAlert?: NotificationItem | null;
}

export const AIDiagnosticDrawer: React.FC<AIDiagnosticDrawerProps> = ({
  isOpen,
  onClose,
  selectedAlert,
}) => {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisReport, setDiagnosisReport] = useState<string | null>(null);
  const [queryInput, setQueryInput] = useState('');

  if (!isOpen) return null;

  const handleRunDiagnosis = () => {
    setIsDiagnosing(true);
    setDiagnosisReport(null);

    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagnosisReport(
        selectedAlert
          ? `【AI 根因分析诊断结论】\n\n1. 告警对象: 设备 [${selectedAlert.deviceCode}] (${selectedAlert.location})\n2. 异常维度: [${selectedAlert.contentType}]，匹配【柯南算法族 - 异常传播链】\n3. 根因推演: 发现上游网关 226.15.10.31 在 16:19:45 出现 CPU 利用率突增 (98.2%)，导致下游缓冲区溢出，触发告警。\n4. 建议处置动作:\n   - 执行自动化路由流量打散\n   - 重启容器 Pod 节点\n   - 规则自愈解决率预测: 96.5%`
          : `【DeepBrain AIOps 全局健康诊断报告】\n\n1. 当前全网 111,925 台纳管设备运行状态良好，收敛率达 95.68%。\n2. 预警提示: [设备1 - 226.15.10.31] 预测在 4 小时后可能发生网卡拥塞 (概率 90%)。\n3. 优化建议: 建议提前扩容带宽或调优【预言算法族】容量阈值。`
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-950 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slideInRight">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">DeepBrain AI 根因诊断助手</h3>
              <p className="text-xs text-slate-400">大模型 + 知识图谱智能归因</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Context */}
        {selectedAlert && (
          <div className="mb-4 p-3 bg-slate-900 border border-cyan-900/50 rounded-xl text-xs">
            <span className="text-cyan-400 font-bold block mb-1">已锁定诊断目标:</span>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>设备: {selectedAlert.deviceCode}</span>
              <span className="text-amber-400">{selectedAlert.contentType}</span>
            </div>
            <div className="text-slate-400 text-[11px] mt-1">{selectedAlert.location} | {selectedAlert.timestamp}</div>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleRunDiagnosis}
          disabled={isDiagnosing}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
        >
          {isDiagnosing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
              <span>正在推演因果图谱与异常传播链...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 text-cyan-200" />
              <span>一键启动 AI 根因推演</span>
            </>
          )}
        </button>

        {/* Diagnostic Output */}
        {diagnosisReport && (
          <div className="bg-slate-900/90 border border-cyan-800/60 rounded-xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
            {diagnosisReport}
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="border-t border-slate-800 pt-4 mt-6">
        <div className="relative">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="询问 AI 运维助手 (例如: 帮我分析网关高负载原因)"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRunDiagnosis();
            }}
          />
          <button
            onClick={handleRunDiagnosis}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
