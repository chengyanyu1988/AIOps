import React, { useState, useEffect } from 'react';
import {
  Database,
  Calendar,
  Search,
  RotateCcw,
  CheckCircle2,
  Plus,
  Play,
  X,
  Clock,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';

interface DataManagementProps {
  initialSubView?: string;
  onSubViewChange?: (subView: string) => void;
}

export const DataManagementView: React.FC<DataManagementProps> = ({
  initialSubView = 'exploration',
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

  const subNavs = [
    { id: 'exploration', label: '数据探索' },
    { id: 'calendar', label: '重大活动日期标注' },
  ];

  // ==========================================
  // 1. 数据探索 (探索任务列表) 数据 (字段标题与原型完全一致)
  // 任务序号 | 数据名称 | 表名 | 库名 | 数据来源 | 样本数 | 文件名 | 归属对象 | 任务状态 | 开始时间 | 完成时间 | 操作
  // ==========================================
  const [searchDataName, setSearchDataName] = useState('');
  const [searchTimeRange, setSearchTimeRange] = useState('2026-10-01 至 2026-10-16');

  const [exploreTaskList, setExploreTaskList] = useState([
    {
      seq: 1,
      name: '市场调研分析',
      tableName: 'survey_data',
      dbName: 'db_survey',
      source: '用户上传',
      sampleCount: 9000,
      fileName: 'survey.csv',
      owner: '用户F',
      status: '执行中',
      startTime: '2026-10-16 10:30:00',
      finishTime: '--',
    },
    {
      seq: 2,
      name: '产品评价分析',
      tableName: 'product_data',
      dbName: 'db_product',
      source: '系统采集',
      sampleCount: 7000,
      fileName: 'product.csv',
      owner: '用户E',
      status: '已完成',
      startTime: '2026-10-15 15:00:00',
      finishTime: '2026-10-15 17:00:00',
    },
    {
      seq: 3,
      name: '用户行为分析',
      tableName: 'user_data',
      dbName: 'db_user',
      source: '业务埋点',
      sampleCount: 15000,
      fileName: 'user.csv',
      owner: '用户A',
      status: '已完成',
      startTime: '2026-10-14 09:10:00',
      finishTime: '2026-10-14 11:30:00',
    },
    {
      seq: 4,
      name: '算力节点时序指标质检',
      tableName: 'metric_timeseries',
      dbName: 'aiops_tsdb',
      source: '系统采集',
      sampleCount: 45000,
      fileName: 'metrics_raw.parquet',
      owner: '运维组',
      status: '已完成',
      startTime: '2026-10-13 14:00:00',
      finishTime: '2026-10-13 14:45:00',
    },
  ]);

  // ==========================================
  // 2. 重大活动日期标注 (重大活动日期列表) 数据 (字段标题与原型完全一致)
  // 序号 | 重大活动名称 | 日期范围 | 描述 | 操作 (查看、修改、删除)
  // ==========================================
  const [searchEventName, setSearchEventName] = useState('');
  const [searchEventTime, setSearchEventTime] = useState('2026-01-01 至 2026-12-31');
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([1]);

  const [eventList, setEventList] = useState([
    {
      seq: 1,
      name: '国庆节庆祝活动',
      dateRange: '2026-10-01 至 2026-10-07',
      desc: '国庆节期间的庆祝和促销活动',
    },
    {
      seq: 2,
      name: '中秋节团圆活动',
      dateRange: '2026-09-29 至 2026-10-03',
      desc: '中秋节期间的家庭团圆活动',
    },
    {
      seq: 3,
      name: '双十一购物狂欢节',
      dateRange: '2026-11-11 至 2026-11-12',
      desc: '双十一期间的大规模购物促销',
    },
    {
      seq: 4,
      name: '新年倒计时活动',
      dateRange: '2026-12-31 至 2027-01-01',
      desc: '新年倒计时庆祝活动',
    },
    {
      seq: 5,
      name: '春节返乡高峰',
      dateRange: '2026-01-20 至 2026-02-10',
      desc: '春节期间的旅客返乡高峰期',
    },
    {
      seq: 6,
      name: '劳动节假期活动',
      dateRange: '2026-05-01 至 2026-05-03',
      desc: '劳动节期间的假期活动',
    },
  ]);

  // 新增日期模态框
  const [isNewDateModalOpen, setIsNewDateModalOpen] = useState(false);
  const [newDateName, setNewDateName] = useState('');
  const [newDateRange, setNewDateRange] = useState('2026-10-25 至 2026-10-27');
  const [newDateDesc, setNewDateDesc] = useState('');

  const handleAddDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateName) return;
    const item = {
      seq: eventList.length + 1,
      name: newDateName,
      dateRange: newDateRange,
      desc: newDateDesc || '自定义业务重大活动日期标注',
    };
    setEventList([item, ...eventList]);
    setIsNewDateModalOpen(false);
    setNewDateName('');
    setNewDateDesc('');
    showToast('新增日期成功！');
  };

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
          SUB-VIEW 1: 数据探索 (完全对齐原型字段)
         ======================================================== */}
      {subTab === 'exploration' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>数据探索</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">探索任务列表</span>
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">数据名称：</span>
              <input
                type="text"
                value={searchDataName}
                onChange={(e) => setSearchDataName(e.target.value)}
                placeholder="输入数据名称..."
                className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs w-36"
              />
              <span className="text-slate-400">时间查询：</span>
              <input
                type="text"
                value={searchTimeRange}
                onChange={(e) => setSearchTimeRange(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs w-52"
              />
              <button onClick={() => showToast('已执行数据探索任务查询')} className="px-3.5 py-1 bg-sky-600 text-white rounded font-bold text-xs">
                查询
              </button>
              <button
                onClick={() => {
                  setSearchDataName('');
                  showToast('已重置');
                }}
                className="px-3.5 py-1 bg-slate-800 text-slate-300 rounded text-xs"
              >
                重置
              </button>
            </div>
          </div>

          {/* 表头完全对齐: 任务序号 | 数据名称 | 表名 | 库名 | 数据来源 | 样本数 | 文件名 | 归属对象 | 任务状态 | 开始时间 | 完成时间 | 操作 */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-3">任务序号</th>
                  <th className="py-3 px-3">数据名称</th>
                  <th className="py-3 px-3">表名</th>
                  <th className="py-3 px-3">库名</th>
                  <th className="py-3 px-3">数据来源</th>
                  <th className="py-3 px-3">样本数</th>
                  <th className="py-3 px-3">文件名</th>
                  <th className="py-3 px-3">归属对象</th>
                  <th className="py-3 px-3">任务状态</th>
                  <th className="py-3 px-3">开始时间</th>
                  <th className="py-3 px-3">完成时间</th>
                  <th className="py-3 px-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {exploreTaskList.map((row) => (
                  <tr key={row.seq} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-slate-400">{row.seq}</td>
                    <td className="py-3 px-3 font-sans text-cyan-300 font-bold">{row.name}</td>
                    <td className="py-3 px-3">{row.tableName}</td>
                    <td className="py-3 px-3 text-slate-400">{row.dbName}</td>
                    <td className="py-3 px-3 font-sans text-slate-300">{row.source}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{row.sampleCount}</td>
                    <td className="py-3 px-3 text-indigo-300">{row.fileName}</td>
                    <td className="py-3 px-3 font-sans">{row.owner}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.status === '已完成'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{row.startTime}</td>
                    <td className="py-3 px-3 text-slate-400">{row.finishTime}</td>
                    <td className="py-3 px-3 text-center font-sans">
                      <button onClick={() => showToast(`查看探索报告 [${row.name}]`)} className="text-sky-400 hover:underline">
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW 2: 重大活动日期标注 (完全对齐原型字段)
         ======================================================== */}
      {subTab === 'calendar' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>重大活动日期标注</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">重大活动日期列表</span>
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">重大活动名称：</span>
              <input
                type="text"
                value={searchEventName}
                onChange={(e) => setSearchEventName(e.target.value)}
                placeholder="输入活动名称..."
                className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs w-36"
              />
              <span className="text-slate-400">时间查询：</span>
              <input
                type="text"
                value={searchEventTime}
                onChange={(e) => setSearchEventTime(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs w-52"
              />
              <button onClick={() => showToast('已执行活动名称查询')} className="px-3.5 py-1 bg-sky-600 text-white rounded font-bold text-xs">
                查询
              </button>
              <button
                onClick={() => {
                  setSearchEventName('');
                  showToast('已重置');
                }}
                className="px-3.5 py-1 bg-slate-800 text-slate-300 rounded text-xs"
              >
                重置
              </button>
            </div>
          </div>

          {/* 按钮行: 本页全选 | 新增日期 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedEventIds(eventList.map(e => e.seq))}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                本页全选
              </button>
            </div>
            <button
              onClick={() => setIsNewDateModalOpen(true)}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-md shadow-sky-600/20"
            >
              + 新增日期
            </button>
          </div>

          {/* 表头完全对齐: 序号 | 重大活动名称 | 日期范围 | 描述 | 操作 (查看、修改、删除) */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedEventIds.length === eventList.length}
                      onChange={(e) => setSelectedEventIds(e.target.checked ? eventList.map(item => item.seq) : [])}
                    />
                  </th>
                  <th className="py-3 px-4 font-mono">序号</th>
                  <th className="py-3 px-4">重大活动名称</th>
                  <th className="py-3 px-4 font-mono">日期范围</th>
                  <th className="py-3 px-4">描述</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {eventList.map((row) => (
                  <tr key={row.seq} className="hover:bg-slate-800/40 font-mono">
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedEventIds.includes(row.seq)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedEventIds([...selectedEventIds, row.seq]);
                          else setSelectedEventIds(selectedEventIds.filter(id => id !== row.seq));
                        }}
                      />
                    </td>
                    <td className="py-3 px-4 text-slate-400">{row.seq}</td>
                    <td className="py-3 px-4 font-sans text-white font-bold">{row.name}</td>
                    <td className="py-3 px-4 text-cyan-300">{row.dateRange}</td>
                    <td className="py-3 px-4 font-sans text-slate-400">{row.desc}</td>
                    <td className="py-3 px-4 text-center font-sans whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => showToast(`查看 [${row.name}] 详情`)} className="text-sky-400 hover:underline">
                          查看
                        </button>
                        <span className="text-slate-600">|</span>
                        <button onClick={() => showToast(`修改 [${row.name}]`)} className="text-amber-400 hover:underline">
                          修改
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          onClick={() => {
                            setEventList(eventList.filter(e => e.seq !== row.seq));
                            showToast(`已删除 [${row.name}]`);
                          }}
                          className="text-rose-400 hover:underline"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 (完全对齐原型文案) */}
          {/* 第1/80页 | 10条/页 | 跳至 [ ] 页 | 共140条记录 */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 font-mono">
            <span>共140条记录 第1/80页</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-800 rounded">10条/页</span>
              <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                上一页
              </button>
              <span className="px-2 py-1 bg-sky-600 text-white rounded font-bold">1</span>
              <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                下一页
              </button>
              <div className="flex items-center gap-1">
                <span>跳至</span>
                <input
                  type="text"
                  defaultValue="1"
                  className="w-10 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center text-white"
                />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 新增日期 */}
      {isNewDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <form
            onSubmit={handleAddDate}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <span>新增重大活动日期</span>
              </h3>
              <button type="button" onClick={() => setIsNewDateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">重大活动名称 *</label>
                <input
                  type="text"
                  required
                  value={newDateName}
                  onChange={(e) => setNewDateName(e.target.value)}
                  placeholder="例如: 2026 电网调峰演练"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">日期范围 *</label>
                <input
                  type="text"
                  required
                  value={newDateRange}
                  onChange={(e) => setNewDateRange(e.target.value)}
                  placeholder="YYYY-MM-DD 至 YYYY-MM-DD"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">描述</label>
                <textarea
                  rows={2}
                  value={newDateDesc}
                  onChange={(e) => setNewDateDesc(e.target.value)}
                  placeholder="输入活动期间的说明与影响..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewDateModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20"
              >
                确定
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
