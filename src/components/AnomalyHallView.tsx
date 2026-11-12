import React, { useState } from 'react';
import {
  Bell,
  Activity,
  Server,
  Cpu,
  Boxes,
  XCircle,
} from 'lucide-react';

export const AnomalyHallView: React.FC = () => {
  // 30-Day Alert Trends Mock Data for Section 1 (Recent dates in Oct 2026)
  const alertTrendDays = [
    { date: '10.01', alert: 3, major: 1, high: 1 },
    { date: '10.02', alert: 6, major: 2, high: 1 },
    { date: '10.03', alert: 2, major: 0, high: 1 },
    { date: '10.04', alert: 3, major: 1, high: 0 },
    { date: '10.05', alert: 8, major: 3, high: 2 },
    { date: '10.06', alert: 5, major: 1, high: 2 },
    { date: '10.07', alert: 4, major: 1, high: 1 },
    { date: '10.08', alert: 7, major: 2, high: 3 },
    { date: '10.09', alert: 3, major: 0, high: 1 },
    { date: '10.10', alert: 5, major: 1, high: 2 },
    { date: '10.11', alert: 2, major: 0, high: 0 },
    { date: '10.12', alert: 4, major: 1, high: 1 },
    { date: '10.13', alert: 5, major: 2, high: 1 },
    { date: '10.14', alert: 3, major: 0, high: 1 },
    { date: '10.15', alert: 6, major: 2, high: 2 },
    { date: '10.16', alert: 4, major: 1, high: 1 },
  ];

  // 30-Day Dynamic Threshold Alert Trends Mock Data for Section 2 (Recent dates in Oct 2026)
  const dynamicAlertTrendDays = [
    { date: '10.01', alert: 2, major: 0, high: 1 },
    { date: '10.02', alert: 5, major: 1, high: 2 },
    { date: '10.03', alert: 3, major: 1, high: 0 },
    { date: '10.04', alert: 4, major: 1, high: 1 },
    { date: '10.05', alert: 7, major: 2, high: 2 },
    { date: '10.06', alert: 4, major: 1, high: 1 },
    { date: '10.07', alert: 3, major: 0, high: 1 },
    { date: '10.08', alert: 6, major: 2, high: 2 },
    { date: '10.09', alert: 2, major: 0, high: 1 },
    { date: '10.10', alert: 4, major: 1, high: 1 },
    { date: '10.11', alert: 3, major: 1, high: 0 },
    { date: '10.12', alert: 5, major: 2, high: 1 },
    { date: '10.13', alert: 4, major: 1, high: 1 },
    { date: '10.14', alert: 2, major: 0, high: 0 },
    { date: '10.15', alert: 5, major: 2, high: 1 },
    { date: '10.16', alert: 3, major: 1, high: 1 },
  ];

  // Latest 10 Alerts Data for Section 1 with Recent 2026 Timestamps
  const latest10Alerts = [
    {
      seq: 1,
      checkTime: '2026-10-16 14:30:00',
      alarmTime: '2026-10-16 14:30:05',
      level: '重大告警',
      title: '核心网关SDN控制器CPU利用率突增离群',
      text: '指标值已超出上限100%',
      actualValue: '96.5%',
      predictedValue: '45.0%',
      upperLimit: '80.0%',
      lowerLimit: '10.0%',
      resId: 'RES-SDN-001',
      resType: 'SDN',
      resIp: '10.240.2.20',
    },
    {
      seq: 2,
      checkTime: '2026-10-16 13:30:00',
      alarmTime: '2026-10-16 13:30:04',
      level: '高级告警',
      title: '云主机App内存占用骤增离群',
      text: '指标值已超出82%',
      actualValue: '82.0%',
      predictedValue: '50.0%',
      upperLimit: '75.0%',
      lowerLimit: '15.0%',
      resId: 'RES-SRV-008',
      resType: 'Server',
      resIp: '10.240.1.15',
    },
    {
      seq: 3,
      checkTime: '2026-10-16 12:15:00',
      alarmTime: '2026-10-16 12:15:02',
      level: '中级告警',
      title: '核心交换机GE0/1端口丢包率抖动',
      text: '包丢弃率连续3个周期超基线',
      actualValue: '12.4%',
      predictedValue: '0.1%',
      upperLimit: '5.0%',
      lowerLimit: '0.0%',
      resId: 'RES-SW-004',
      resType: 'Switch',
      resIp: '10.240.0.1',
    },
    {
      seq: 4,
      checkTime: '2026-10-16 11:00:00',
      alarmTime: '2026-10-16 11:00:01',
      level: '一般告警',
      title: '分布式存储SAN-Storage IO延迟增加',
      text: '指标值已超出61%',
      actualValue: '61.0%',
      predictedValue: '30.0%',
      upperLimit: '55.0%',
      lowerLimit: '5.0%',
      resId: 'RES-STOR-002',
      resType: 'Storage',
      resIp: '10.240.5.12',
    },
    {
      seq: 5,
      checkTime: '2026-10-16 10:20:00',
      alarmTime: '2026-10-16 10:20:03',
      level: '高级告警',
      title: 'Web前端节点HTTP 5xx状态码突增',
      text: '错误响应数突破动态离群上限',
      actualValue: '78.2%',
      predictedValue: '2.0%',
      upperLimit: '10.0%',
      lowerLimit: '0.0%',
      resId: 'RES-WEB-009',
      resType: 'Server',
      resIp: '10.240.1.99',
    },
    {
      seq: 6,
      checkTime: '2026-10-16 09:45:00',
      alarmTime: '2026-10-16 09:45:02',
      level: '中级告警',
      title: '数据库写集群TCP连接数陡增',
      text: '当前活跃连接数超置信区间',
      actualValue: '880',
      predictedValue: '320',
      upperLimit: '600',
      lowerLimit: '50',
      resId: 'RES-DB-003',
      resType: 'Database',
      resIp: '10.240.3.18',
    },
    {
      seq: 7,
      checkTime: '2026-10-16 08:30:00',
      alarmTime: '2026-10-16 08:30:01',
      level: '一般告警',
      title: '边界防火墙Session表利用率较高',
      text: '利用率超出常规基线',
      actualValue: '68.5%',
      predictedValue: '40.0%',
      upperLimit: '65.0%',
      lowerLimit: '10.0%',
      resId: 'RES-FW-001',
      resType: 'Firewall',
      resIp: '10.240.0.254',
    },
    {
      seq: 8,
      checkTime: '2026-10-16 07:10:00',
      alarmTime: '2026-10-16 07:10:02',
      level: '重大告警',
      title: '核心路由节点BGP邻居会话断开',
      text: '路由可达性严重偏离正常概率分布',
      actualValue: '0 (Down)',
      predictedValue: '1 (Up)',
      upperLimit: '1',
      lowerLimit: '1',
      resId: 'RES-RT-002',
      resType: 'Router',
      resIp: '10.240.0.2',
    },
    {
      seq: 9,
      checkTime: '2026-10-16 06:00:00',
      alarmTime: '2026-10-16 06:00:01',
      level: '一般告警',
      title: '大数据计算节点Disk I/O Wait率上升',
      text: '等待时间突破边缘阈值',
      actualValue: '42.1%',
      predictedValue: '12.0%',
      upperLimit: '35.0%',
      lowerLimit: '0.0%',
      resId: 'RES-HADOOP-05',
      resType: 'Server',
      resIp: '10.240.8.55',
    },
    {
      seq: 10,
      checkTime: '2026-10-16 04:15:00',
      alarmTime: '2026-10-16 04:15:04',
      level: '中级告警',
      title: '容器Pod网络吞吐流量异常掉落',
      text: '包吞吐速率偏离正常周期型曲线',
      actualValue: '12 MB/s',
      predictedValue: '120 MB/s',
      upperLimit: '200 MB/s',
      lowerLimit: '80 MB/s',
      resId: 'RES-K8S-POD12',
      resType: 'Container',
      resIp: '10.244.3.44',
    },
  ];

  // Dynamic Threshold Latest 10 Alerts Data
  const dynamicLatest10Alerts = [
    {
      seq: 1,
      checkTime: '2026-10-16 14:25:00',
      alarmTime: '2026-10-16 14:25:03',
      level: '重大告警',
      title: 'SDN节点CPU动态阈值超越100%',
      text: '指标值已超出100%',
      actualValue: '95.2%',
      predictedValue: '40.0%',
      upperLimit: '78.0%',
      lowerLimit: '10.0%',
      resId: 'RES-SDN-002',
      resType: 'SDN',
      resIp: '10.240.2.22',
    },
    {
      seq: 2,
      checkTime: '2026-10-16 13:10:00',
      alarmTime: '2026-10-16 13:10:02',
      level: '高级告警',
      title: '应用服务器内存动态基线偏移',
      text: '指标值已超出82%',
      actualValue: '82.0%',
      predictedValue: '48.0%',
      upperLimit: '72.0%',
      lowerLimit: '12.0%',
      resId: 'RES-SRV-005',
      resType: 'Server',
      resIp: '10.240.1.18',
    },
    {
      seq: 3,
      checkTime: '2026-10-16 12:00:00',
      alarmTime: '2026-10-16 12:00:01',
      level: '中级告警',
      title: '核心交换机接口包丢弃率超越边界',
      text: '指标值已超出61%',
      actualValue: '61.0%',
      predictedValue: '25.0%',
      upperLimit: '50.0%',
      lowerLimit: '5.0%',
      resId: 'RES-SW-008',
      resType: 'Switch',
      resIp: '10.240.0.8',
    },
    {
      seq: 4,
      checkTime: '2026-10-16 10:45:00',
      alarmTime: '2026-10-16 10:45:02',
      level: '一般告警',
      title: '存储集群写入IO延迟超出动态包络',
      text: '指标低于动态下限',
      actualValue: '15.0%',
      predictedValue: '45.0%',
      upperLimit: '85.0%',
      lowerLimit: '20.0%',
      resId: 'RES-STOR-005',
      resType: 'Storage',
      resIp: '10.240.5.15',
    },
    {
      seq: 5,
      checkTime: '2026-10-16 09:30:00',
      alarmTime: '2026-10-16 09:30:03',
      level: '高级告警',
      title: '网关QoS策略流速抖动超过动态边界',
      text: '流量峰值突破3卡方显著区',
      actualValue: '84.5%',
      predictedValue: '35.0%',
      upperLimit: '70.0%',
      lowerLimit: '10.0%',
      resId: 'RES-GW-003',
      resType: 'Gateway',
      resIp: '10.240.0.3',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>异常发现统计大厅</span>
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>数据推演中 (2026-10-16)</span>
        </div>
      </div>

      {/* ===================== SECTION 1: 异常检测 ===================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-cyan-400 pl-3">
          <h3 className="text-sm font-bold text-cyan-400">异常检测</h3>
        </div>

        {/* 5 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-400">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">昨日告警数</div>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-1">203</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">监控指标数</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">35</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">纳管设备数</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">352</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">模型数</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">326</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">模型调用总数</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">2365</div>
            </div>
          </div>
        </div>

        {/* 告警统计 Section */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-md shadow-xl">
          <div className="text-xs font-bold text-slate-300">告警统计</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-2 text-center lg:text-left space-y-2 border-r border-slate-800/80 pr-4">
              <div className="text-xs text-slate-400 font-medium">告警总数</div>
              <div className="text-3xl font-extrabold font-mono text-rose-500 tracking-tight">35568</div>
            </div>

            <div className="lg:col-span-10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <span className="text-sky-400 font-bold">近30日每日告警统计</span>
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 重大告警</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 高级告警</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> 中级告警</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> 一般告警</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 h-44 flex items-end justify-between gap-1.5 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 Q10,30 20,60 T40,20 T60,50 T80,30 T100,70 L100,100 L0,100 Z" fill="url(#roseGrad)" />
                  <path d="M0,90 Q10,50 20,70 T40,40 T60,65 T80,45 T100,80" fill="none" stroke="#f43f5e" strokeWidth="2" />
                  <defs>
                    <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {alertTrendDays.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group z-10">
                    <div className="relative w-full flex flex-col justify-end items-center h-28">
                      <div
                        style={{ height: `${item.alert * 11}%` }}
                        className="w-2 sm:w-3.5 bg-gradient-to-t from-rose-600/80 via-amber-500/80 to-sky-400/90 rounded-t-lg transition-all group-hover:brightness-125"
                      />
                      <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded text-[10px] whitespace-nowrap shadow-xl z-20">
                        重大告警: {item.major} | 高级告警: {item.high}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 模型统计 Section */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5 backdrop-blur-md shadow-xl">
          <div className="text-xs font-bold text-slate-300">模型统计</div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
                <span className="text-xs text-slate-300 font-medium">监控中模型</span>
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">335</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50" />
                <span className="text-xs text-slate-300 font-medium">已停用模型</span>
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">24</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-500 shadow-md shadow-slate-500/50" />
                <span className="text-xs text-slate-300 font-medium">待启用模型</span>
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">68</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span className="text-xs text-slate-300 font-medium">失败模型</span>
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">12</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">模型监控时长Top3</h4>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-sky-500" />
                  <span className="w-2 h-2 rounded bg-slate-800" />
                  <span className="w-2 h-2 rounded bg-slate-800" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs border-y border-slate-800/80 py-2 font-mono">
                <div>
                  <span className="text-slate-400">监控时长 </span>
                  <span className="text-sky-400 font-bold text-sm">87 天</span>
                </div>
                <div>
                  <span className="text-slate-400">启用时间 </span>
                  <span className="text-sky-400 font-bold">2026.08.19</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 font-medium border-b border-slate-800/60">
                    <tr>
                      <th className="py-2">模型指标</th>
                      <th className="py-2">设备资源ID</th>
                      <th className="py-2">设备类型</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 text-sky-300">cpu_rate_percent</td>
                      <td className="py-2 text-slate-400">RES-SDN-001</td>
                      <td className="py-2 text-slate-200">SDN</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sky-300">memory_usage_ratio</td>
                      <td className="py-2 text-slate-400">RES-SRV-008</td>
                      <td className="py-2 text-slate-200">Server</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sky-300">traffic_latency_ms</td>
                      <td className="py-2 text-slate-400">RES-GW-012</td>
                      <td className="py-2 text-slate-200">Gateway</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">模型近7天告警数Top3</h4>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-sky-500" />
                  <span className="w-2 h-2 rounded bg-slate-800" />
                  <span className="w-2 h-2 rounded bg-slate-800" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs border-y border-slate-800/80 py-2 font-mono">
                <div>
                  <span className="text-slate-400">告警数 </span>
                  <span className="text-sky-400 font-bold text-sm">898</span>
                </div>
                <div>
                  <span className="text-slate-400">告警率 </span>
                  <span className="text-sky-400 font-bold text-sm">6 %</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 font-medium border-b border-slate-800/60">
                    <tr>
                      <th className="py-2">模型指标</th>
                      <th className="py-2">设备资源ID</th>
                      <th className="py-2">设备类型</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 text-sky-300">cpu_rate_percent</td>
                      <td className="py-2 text-slate-400">RES-SDN-001</td>
                      <td className="py-2 text-slate-200">SDN</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sky-300">interface_drop_packets</td>
                      <td className="py-2 text-slate-400">RES-SW-004</td>
                      <td className="py-2 text-slate-200">Switch</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sky-300">disk_io_wait</td>
                      <td className="py-2 text-slate-400">RES-STOR-002</td>
                      <td className="py-2 text-slate-200">Storage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white">最新告警Top10</h4>

                <div className="overflow-x-auto max-h-52 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800 sticky top-0">
                      <tr>
                        <th className="py-2 px-2 shrink-0">序号</th>
                        <th className="py-2 px-2 shrink-0">检测时间</th>
                        <th className="py-2 px-2 shrink-0">告警时间</th>
                        <th className="py-2 px-2 shrink-0">告警级别</th>
                        <th className="py-2 px-2">告警正文</th>
                        <th className="py-2 px-2">实际值</th>
                        <th className="py-2 px-2">预测值</th>
                        <th className="py-2 px-2">上限</th>
                        <th className="py-2 px-2">下限</th>
                        <th className="py-2 px-2">设备资源ID</th>
                        <th className="py-2 px-2">设备类型</th>
                        <th className="py-2 px-2">设备IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {latest10Alerts.map((row) => (
                        <tr key={row.seq} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2 px-2 text-slate-400">{row.seq}</td>
                          <td className="py-2 px-2 text-slate-300 whitespace-nowrap">{row.checkTime}</td>
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{row.alarmTime}</td>
                          <td className="py-2 px-2 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                row.level === '重大告警'
                                  ? 'bg-rose-950 border border-rose-800 text-rose-400'
                                  : row.level === '高级告警'
                                  ? 'bg-amber-950 border border-amber-800 text-amber-400'
                                  : row.level === '中级告警'
                                  ? 'bg-yellow-950 border border-yellow-800 text-yellow-300'
                                  : 'bg-sky-950 border border-sky-800 text-sky-300'
                              }`}
                            >
                              {row.level}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-slate-300 font-sans whitespace-nowrap">{row.text}</td>
                          <td className="py-2 px-2 text-sky-300 font-bold">{row.actualValue}</td>
                          <td className="py-2 px-2 text-slate-400">{row.predictedValue}</td>
                          <td className="py-2 px-2 text-rose-400">{row.upperLimit}</td>
                          <td className="py-2 px-2 text-slate-400">{row.lowerLimit}</td>
                          <td className="py-2 px-2 text-slate-300">{row.resId}</td>
                          <td className="py-2 px-2 text-slate-400 font-sans">{row.resType}</td>
                          <td className="py-2 px-2 text-sky-400">{row.resIp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SECTION 2: 动态阈值 ===================== */}
      <div className="space-y-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2 border-l-4 border-cyan-400 pl-3">
          <h3 className="text-sm font-bold text-cyan-400">动态阈值</h3>
        </div>

        {/* 5 Dynamic Threshold KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-400">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">昨日告警数</div>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-1">263</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">监控指标数</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">35</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">纳管设备数</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">225</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">模型数</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">136</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">模型调用总数</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">2651</div>
            </div>
          </div>
        </div>

        {/* ===================== NEWLY ADDED: 动态阈值 告警统计 Section ===================== */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-md shadow-xl">
          <div className="text-xs font-bold text-slate-300">告警统计</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-2 text-center lg:text-left space-y-2 border-r border-slate-800/80 pr-4">
              <div className="text-xs text-slate-400 font-medium">告警总数</div>
              <div className="text-3xl font-extrabold font-mono text-rose-500 tracking-tight">28950</div>
            </div>

            <div className="lg:col-span-10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <span className="text-sky-400 font-bold">近30日每日动态阈值告警统计</span>
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 重大告警</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 高级告警</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> 中级告警</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> 一般告警</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 h-44 flex items-end justify-between gap-1.5 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,85 Q10,40 20,70 T40,30 T60,60 T80,35 T100,75 L100,100 L0,100 Z" fill="url(#skyGrad)" />
                  <path d="M0,85 Q10,40 20,70 T40,30 T60,60 T80,35 T100,75" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <defs>
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {dynamicAlertTrendDays.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group z-10">
                    <div className="relative w-full flex flex-col justify-end items-center h-28">
                      <div
                        style={{ height: `${item.alert * 12}%` }}
                        className="w-2 sm:w-3.5 bg-gradient-to-t from-sky-600/80 via-amber-500/80 to-rose-400/90 rounded-t-lg transition-all group-hover:brightness-125"
                      />
                      <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded text-[10px] whitespace-nowrap shadow-xl z-20">
                        重大告警: {item.major} | 高级告警: {item.high}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NEWLY ADDED: 动态阈值 模型统计 Section ===================== */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5 backdrop-blur-md shadow-xl">
          <div className="text-xs font-bold text-slate-300">模型统计</div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
                <span className="text-xs text-slate-300 font-medium">监控中模型</span>
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">136</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50" />
                <span className="text-xs text-slate-300 font-medium">已停用模型</span>
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">18</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-500 shadow-md shadow-slate-500/50" />
                <span className="text-xs text-slate-300 font-medium">待启用模型</span>
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">42</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span className="text-xs text-slate-300 font-medium">失败模型</span>
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">6</div>
            </div>
          </div>

          {/* ===================== NEWLY ADDED: 动态阈值 Bottom 3 Cards ===================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Card 1: 模型监控时长Top3 */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">模型监控时长Top3</h4>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-sky-500" />
                  <span className="w-2 h-2 rounded bg-slate-800" />
                  <span className="w-2 h-2 rounded bg-slate-800" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs border-y border-slate-800/80 py-2 font-mono">
                <div>
                  <span className="text-slate-400">监控时长 </span>
                  <span className="text-sky-400 font-bold text-sm">65 天</span>
                </div>
                <div>
                  <span className="text-slate-400">启用时间 </span>
                  <span className="text-sky-400 font-bold">2026.09.01</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 font-medium border-b border-slate-800/60">
                    <tr>
                      <th className="py-2">模型指标</th>
                      <th className="py-2">设备资源ID</th>
                      <th className="py-2">设备类型</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 text-sky-300">cpu_usage_dynamic_threshold</td>
                      <td className="py-2 text-slate-400">RES-SDN-002</td>
                      <td className="py-2 text-slate-200">SDN</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sky-300">mem_dynamic_baseline</td>
                      <td className="py-2 text-slate-400">RES-SRV-005</td>
                      <td className="py-2 text-slate-200">Server</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sky-300">bandwidth_dynamic_wave</td>
                      <td className="py-2 text-slate-400">RES-GW-003</td>
                      <td className="py-2 text-slate-200">Gateway</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 2: 模型近7天告警数Top3 */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">模型近7天告警数Top3</h4>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-sky-500" />
                  <span className="w-2 h-2 rounded bg-slate-800" />
                  <span className="w-2 h-2 rounded bg-slate-800" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs border-y border-slate-800/80 py-2 font-mono">
                <div>
                  <span className="text-slate-400">告警数 </span>
                  <span className="text-sky-400 font-bold text-sm">520</span>
                </div>
                <div>
                  <span className="text-slate-400">告警率 </span>
                  <span className="text-sky-400 font-bold text-sm">4 %</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 font-medium border-b border-slate-800/60">
                    <tr>
                      <th className="py-2">模型指标</th>
                      <th className="py-2">设备资源ID</th>
                      <th className="py-2">设备类型</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 text-sky-300">cpu_usage_dynamic_threshold</td>
                      <td className="py-2 text-slate-400">RES-SDN-002</td>
                      <td className="py-2 text-slate-200">SDN</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sky-300">interface_drop_packets</td>
                      <td className="py-2 text-slate-400">RES-SW-008</td>
                      <td className="py-2 text-slate-200">Switch</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sky-300">disk_iops_dynamic</td>
                      <td className="py-2 text-slate-400">RES-STOR-005</td>
                      <td className="py-2 text-slate-200">Storage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 3: 最新告警Top10 */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white">最新告警Top10</h4>

                <div className="overflow-x-auto max-h-52 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800 sticky top-0">
                      <tr>
                        <th className="py-2 px-2 shrink-0">序号</th>
                        <th className="py-2 px-2 shrink-0">检测时间</th>
                        <th className="py-2 px-2 shrink-0">告警时间</th>
                        <th className="py-2 px-2 shrink-0">告警级别</th>
                        <th className="py-2 px-2">告警正文</th>
                        <th className="py-2 px-2">实际值</th>
                        <th className="py-2 px-2">预测值</th>
                        <th className="py-2 px-2">上限</th>
                        <th className="py-2 px-2">下限</th>
                        <th className="py-2 px-2">设备资源ID</th>
                        <th className="py-2 px-2">设备类型</th>
                        <th className="py-2 px-2">设备IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {dynamicLatest10Alerts.map((row) => (
                        <tr key={row.seq} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2 px-2 text-slate-400">{row.seq}</td>
                          <td className="py-2 px-2 text-slate-300 whitespace-nowrap">{row.checkTime}</td>
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{row.alarmTime}</td>
                          <td className="py-2 px-2 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                row.level === '重大告警'
                                  ? 'bg-rose-950 border border-rose-800 text-rose-400'
                                  : row.level === '高级告警'
                                  ? 'bg-amber-950 border border-amber-800 text-amber-400'
                                  : row.level === '中级告警'
                                  ? 'bg-yellow-950 border border-yellow-800 text-yellow-300'
                                  : 'bg-sky-950 border border-sky-800 text-sky-300'
                              }`}
                            >
                              {row.level}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-slate-300 font-sans whitespace-nowrap">{row.text}</td>
                          <td className="py-2 px-2 text-sky-300 font-bold">{row.actualValue}</td>
                          <td className="py-2 px-2 text-slate-400">{row.predictedValue}</td>
                          <td className="py-2 px-2 text-rose-400">{row.upperLimit}</td>
                          <td className="py-2 px-2 text-slate-400">{row.lowerLimit}</td>
                          <td className="py-2 px-2 text-slate-300">{row.resId}</td>
                          <td className="py-2 px-2 text-slate-400 font-sans">{row.resType}</td>
                          <td className="py-2 px-2 text-sky-400">{row.resIp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
