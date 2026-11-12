import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Sliders,
  Clock,
  Settings2,
} from 'lucide-react';

interface GeneralAlarmConfigItem {
  id: number;
  name: string;
  createTime: string;
  lowScope: string;
  midScope: string;
  highScope: string;
  majorScope: string;
  status: '已启用' | '待启用';
}

const INITIAL_GENERAL_CONFIGS: GeneralAlarmConfigItem[] = [
  {
    id: 1,
    name: '高密度服务器_CPU温度离群检测',
    createTime: '2026-10-16 15:20:00',
    lowScope: '72°C',
    midScope: '82°C',
    highScope: '90°C',
    majorScope: '98°C',
    status: '已启用',
  },
  {
    id: 2,
    name: '核心存储阵列_IOPS抖动阈值预警',
    createTime: '2026-10-16 14:45:00',
    lowScope: '+15%',
    midScope: '+30%',
    highScope: '+50%',
    majorScope: '+80%',
    status: '已启用',
  },
  {
    id: 3,
    name: 'GPU算力节点_显存利用率异常检测',
    createTime: '2026-10-16 14:10:00',
    lowScope: '80%',
    midScope: '88%',
    highScope: '94%',
    majorScope: '99%',
    status: '已启用',
  },
  {
    id: 4,
    name: 'IDC机房水冷系统_流量陡降监测',
    createTime: '2026-10-16 13:30:00',
    lowScope: '<18 L/min',
    midScope: '<15 L/min',
    highScope: '<11 L/min',
    majorScope: '<7 L/min',
    status: '已启用',
  },
  {
    id: 5,
    name: '5G边缘网关_丢包率升高告警',
    createTime: '2026-10-16 12:50:00',
    lowScope: '>1.5%',
    midScope: '>3.0%',
    highScope: '>5.0%',
    majorScope: '>10.0%',
    status: '待启用',
  },
  {
    id: 6,
    name: '核心交换机_端口吞吐量偏低分析',
    createTime: '2026-10-16 11:40:00',
    lowScope: '<20 Gbps',
    midScope: '<15 Gbps',
    highScope: '<10 Gbps',
    majorScope: '<5 Gbps',
    status: '已启用',
  },
  {
    id: 7,
    name: 'AI推理加速卡_功耗激增安全监控',
    createTime: '2026-10-16 10:15:00',
    lowScope: '280W',
    midScope: '320W',
    highScope: '360W',
    majorScope: '400W',
    status: '待启用',
  },
  {
    id: 8,
    name: '工业机器人关节_扭矩震荡告警',
    createTime: '2026-10-15 17:05:00',
    lowScope: '45 N·m',
    midScope: '60 N·m',
    highScope: '75 N·m',
    majorScope: '90 N·m',
    status: '已启用',
  },
  {
    id: 9,
    name: '高压变电站_绝缘气体压力监测',
    createTime: '2026-10-15 15:25:00',
    lowScope: '<5.8 bar',
    midScope: '<5.2 bar',
    highScope: '<4.6 bar',
    majorScope: '<4.0 bar',
    status: '已启用',
  },
  {
    id: 10,
    name: '分布式数据库_响应时延突增预警',
    createTime: '2026-10-15 11:10:00',
    lowScope: '>35ms',
    midScope: '>80ms',
    highScope: '>150ms',
    majorScope: '>300ms',
    status: '待启用',
  },
];

export const GeneralAlarmConfigView: React.FC = () => {
  const [configList, setConfigList] = useState<GeneralAlarmConfigItem[]>(INITIAL_GENERAL_CONFIGS);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New item form state
  const [newName, setNewName] = useState<string>('');
  const [newLow, setNewLow] = useState<string>('70%');
  const [newMid, setNewMid] = useState<string>('80%');
  const [newHigh, setNewHigh] = useState<string>('90%');
  const [newMajor, setNewMajor] = useState<string>('95%');
  const [newStatus, setNewStatus] = useState<'已启用' | '待启用'>('已启用');

  // Toggle item status
  const handleToggleStatus = (id: number) => {
    setConfigList(
      configList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === '已启用' ? '待启用' : '已启用',
          };
        }
        return item;
      })
    );
  };

  // Delete item
  const handleDelete = (id: number) => {
    setConfigList(configList.filter((item) => item.id !== id));
  };

  // Add new item
  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: GeneralAlarmConfigItem = {
      id: Date.now(),
      name: newName.trim(),
      createTime: '2026-10-16 15:00:00',
      lowScope: newLow,
      midScope: newMid,
      highScope: newHigh,
      majorScope: newMajor,
      status: newStatus,
    };

    setConfigList([newItem, ...configList]);
    setIsAddModalOpen(false);
    setNewName('');
  };

  return (
    <div className="w-full bg-[#0b0f19] text-slate-200 min-h-[calc(100vh-100px)] p-4 flex flex-col gap-4">
      {/* SECTION HEADER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
            <span className="text-cyan-400 font-bold">▶</span>
            <span>配置列表</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-sky-500 hover:bg-sky-400 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>新增配置</span>
          </button>
        </div>

        {/* CONFIG TABLE */}
        <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950/60 mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700/80 font-medium">
                <th className="py-3 px-4 text-center w-16 whitespace-nowrap">序号</th>
                <th className="py-3 px-4 whitespace-nowrap">配置名称</th>
                <th className="py-3 px-4 whitespace-nowrap">创建时间</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">低级告警范围</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">中级告警范围</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">高级告警范围</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">重大告警范围</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">状态</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {configList.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-medium text-slate-200 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{row.createTime}</td>
                  <td className="py-3 px-4 text-center font-mono text-sky-300 whitespace-nowrap">
                    {row.lowScope}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-yellow-300 whitespace-nowrap">
                    {row.midScope}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-amber-300 whitespace-nowrap">
                    {row.highScope}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-rose-300 whitespace-nowrap">
                    {row.majorScope}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          row.status === '已启用' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <span className={row.status === '已启用' ? 'text-emerald-300' : 'text-amber-300'}>
                        {row.status}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      {/* Toggle switch button */}
                      <button
                        onClick={() => handleToggleStatus(row.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 transition-all border ${
                          row.status === '已启用'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span>{row.status === '已启用' ? '启用' : '停用'}</span>
                      </button>

                      {/* Trash icon */}
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-cyan-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                        title="删除配置"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTTOM PAGINATION */}
        <div className="flex flex-wrap items-center justify-end gap-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>共 140 条记录 第 1/80 页</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                &lt;
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-sky-500 text-white font-bold">
                1
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                2
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                3
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                4
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                5
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                &gt;
              </button>
            </div>

            <select className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1">
              <option>10条/页</option>
              <option>20条/页</option>
              <option>50条/页</option>
            </select>

            <div className="flex items-center gap-1">
              <span>跳至</span>
              <input
                type="text"
                defaultValue="1"
                className="w-10 text-center bg-slate-950 border border-slate-700 text-slate-200 rounded py-1"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: 新增通用动态阈值告警配置 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleCreateNew}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-cyan-400" />
                <span>新增通用动态阈值告警配置</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-300">配置名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 压力传感器_偏高风险告警"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-slate-300">低级告警范围</label>
                  <input
                    type="text"
                    value={newLow}
                    onChange={(e) => setNewLow(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-slate-300">中级告警范围</label>
                  <input
                    type="text"
                    value={newMid}
                    onChange={(e) => setNewMid(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-slate-300">高级告警范围</label>
                  <input
                    type="text"
                    value={newHigh}
                    onChange={(e) => setNewHigh(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-slate-300">重大告警范围</label>
                  <input
                    type="text"
                    value={newMajor}
                    onChange={(e) => setNewMajor(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-300">初始状态</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as '已启用' | '待启用')}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2"
                >
                  <option value="已启用">已启用</option>
                  <option value="待启用">待启用</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium transition-colors shadow-lg shadow-sky-500/20"
              >
                保存新增
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
