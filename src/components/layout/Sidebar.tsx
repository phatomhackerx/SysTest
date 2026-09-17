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
  Star,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { ViewMode } from '../../types';
import { WatsonLogo } from '../common/WatsonLogo';

export const Sidebar: React.FC<{ onOpenPro?: () => void }> = ({ onOpenPro }) => {
  const { activeView, setActiveView, telemetry, activeTarget } = useWatson();

  const menuItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'corporate-search', label: 'Investigação Corp.', icon: <Search className="w-4 h-4 text-amber-400" />, badge: 'NOVO' },
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projetos', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'file-builder', label: 'Editor de Arquivos', icon: <FileCode className="w-4 h-4" />, badge: 'IDE' },
    { id: 'template-builder', label: 'Construtor Templates', icon: <Layers className="w-4 h-4" /> },
    { id: 'workflow', label: 'Workflow de Nós', icon: <GitGraph className="w-4 h-4" />, badge: 'Grafo' },
    { id: 'lab-targets', label: 'Alvos do Lab', icon: <Server className="w-4 h-4" /> },
    { id: 'terminal', label: 'Terminal Kali', icon: <Terminal className="w-4 h-4" />, badge: 'CLI' },
    { id: 'analyzer', label: 'Auditoria & AST', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sessões Ativas', icon: <Clock className="w-4 h-4" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#07090e] border-r border-[#1a2130] flex flex-col justify-between shrink-0 select-none z-20 font-sans">
      {/* Top Section: Fedora Logo & Branding */}
      <div>
        <div
          onClick={() => setActiveView('corporate-search')}
          className="p-4 border-b border-[#18202e] flex items-center justify-between bg-black/60 hover:bg-[#0f1420] cursor-pointer transition-all group"
          title="Clique para abrir a Busca Corporativa"
        >
          <div className="flex items-center gap-2.5">
            <WatsonLogo size="sm" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 group-hover:border-amber-400 transition-colors">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            PRO
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-semibold text-[#536279] uppercase tracking-wider">
            Navegação Principal
          </div>

          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-[#151b27] text-white font-semibold border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                    : 'text-[#94a3b8] hover:bg-[#0f141f] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-amber-400' : 'text-[#627289]'}`}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide text-xs">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold tracking-tight ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-[#121722] text-[#6b7b92] border border-[#1e2736]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Pro Upgrade Banner & Telemetry */}
      <div className="p-3 border-t border-[#18202e] bg-black/40 space-y-3 font-mono text-[11px]">
        {/* Pro Banner Pill */}
        <div
          onClick={onOpenPro}
          className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 cursor-pointer hover:border-amber-500/60 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-500 text-black">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-white font-bold text-[11px] font-sans group-hover:text-amber-300 transition-colors">
                Plano Watson Pro
              </div>
              <div className="text-[10px] text-[#78889e]">Consultas ilimitadas</div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* System Status & Telemetry */}
        <div className="p-2.5 rounded-xl bg-[#0b0e15] border border-[#1a2232] space-y-2 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-[#64748b]">Status do Sandbox</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AIRGAPPED
            </span>
          </div>

          <div className="flex items-center justify-between text-[#8896aa]">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#64748b]" /> CPU
            </span>
            <span className="text-white font-bold">{telemetry.cpu}%</span>
          </div>

          <div className="w-full bg-[#151b26] h-1 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(telemetry.cpu * 3, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[#8896aa] pt-0.5">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#64748b]" /> RAM
            </span>
            <span className="text-cyan-300 font-bold">{telemetry.ram}</span>
          </div>
        </div>

        {/* Target Indicator */}
        <div className="flex items-center justify-between text-[10px] text-[#556377] px-1">
          <span>v2.4.1 · Sr. Watson</span>
          <span className="text-amber-400/80 font-semibold">{activeTarget.name}</span>
        </div>
      </div>
    </aside>
  );
};
