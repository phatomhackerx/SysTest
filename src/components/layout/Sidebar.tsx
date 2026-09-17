import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  LayoutDashboard,
  FolderGit2,
  FileCode,
  Layers,
  GitGraph,
  Server,
  Terminal,
  ShieldCheck,
  Clock,
  Settings,
  Search,
  Cpu,
  Activity,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { ViewMode } from '../../types';
import { SysTestLogo } from '../common/SysTestLogo';

export const Sidebar: React.FC<{ onOpenPro?: () => void }> = ({ onOpenPro }) => {
  const { activeView, setActiveView, telemetry, activeTarget } = useWatson();

  const workspaceItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'file-builder', label: 'Files', icon: <FileCode className="w-4 h-4" />, badge: 'IDE' },
    { id: 'template-builder', label: 'Templates', icon: <Layers className="w-4 h-4" /> },
    { id: 'workflow', label: 'Workflows', icon: <GitGraph className="w-4 h-4" />, badge: 'Grafo' },
    { id: 'lab-targets', label: 'Lab Targets', icon: <Server className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sessions', icon: <Clock className="w-4 h-4" /> },
    { id: 'analyzer', label: 'Analyzer', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-4 h-4" />, badge: 'CLI' },
  ];

  const toolsItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'corporate-search', label: 'Investigação OSINT', icon: <Search className="w-4 h-4 text-amber-400" />, badge: 'CNPJ' },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 bg-[#07090e] border-r border-[#161f2e] flex flex-col justify-between shrink-0 select-none z-20 font-mono">
      {/* Top Section: SysTest Brand & Workspace Items */}
      <div className="overflow-y-auto">
        {/* Brand header */}
        <div
          onClick={() => setActiveView('dashboard')}
          className="p-3.5 border-b border-[#161f2e] flex items-center justify-between bg-black/40 hover:bg-[#0c1119] cursor-pointer transition-colors"
          title="SysTest - Visual Security Laboratory"
        >
          <SysTestLogo size="sm" showSubtitle={true} />
        </div>

        {/* WORKSPACE Menu Section */}
        <nav className="p-2 space-y-0.5">
          <div className="px-3 pt-2.5 pb-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
            <span>WORKSPACE</span>
            <span className="text-[9px] text-amber-400/80">CORE</span>
          </div>

          {workspaceItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-[#101724] text-white font-bold border border-amber-500/40 text-amber-300'
                    : 'text-zinc-400 hover:bg-[#0c1119] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-amber-400' : 'text-zinc-500'}>
                    {item.icon}
                  </span>
                  <span className="text-xs font-mono tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-[#101520] text-zinc-500 border border-[#1a2332]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="px-3 pt-3 pb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            FERRAMENTAS & LAB
          </div>

          {toolsItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-[#101724] text-white font-bold border border-amber-500/40 text-amber-300'
                    : 'text-zinc-400 hover:bg-[#0c1119] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-amber-400' : 'text-zinc-500'}>
                    {item.icon}
                  </span>
                  <span className="text-xs font-mono tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold bg-[#101520] text-amber-400 border border-[#1a2332]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Sandbox Telemetry Status */}
      <div className="p-3 border-t border-[#161f2e] bg-[#05070a] space-y-2 text-[10px]">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 font-bold uppercase">SANDBOX ISOLATION</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AIRGAPPED
          </span>
        </div>

        <div className="flex items-center justify-between text-zinc-400">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-zinc-500" /> CPU
          </span>
          <span className="text-amber-400 font-bold">{telemetry.cpu}%</span>
        </div>

        <div className="w-full bg-[#121824] h-1 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(telemetry.cpu * 3, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-zinc-400 pt-0.5">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-zinc-500" /> RAM
          </span>
          <span className="text-cyan-400 font-bold">{telemetry.ram}</span>
        </div>

        <div className="flex items-center justify-between text-[9px] text-zinc-600 pt-1 border-t border-[#121824]">
          <span>SYSTEST WORKSTATION</span>
          <span className="text-emerald-400">{activeTarget.name}</span>
        </div>
      </div>
    </aside>
  );
};
