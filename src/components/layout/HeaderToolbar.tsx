import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  ChevronRight,
  Shield,
  Play,
  CheckCircle2,
  Eye,
  Activity,
  Download,
  Terminal,
  Search,
  Server,
  FolderTree,
  Star,
  Plus,
} from 'lucide-react';

export const HeaderToolbar: React.FC<{ onOpenPro?: () => void }> = ({ onOpenPro }) => {
  const {
    activeView,
    setActiveView,
    activeProject,
    activeTarget,
    pipelineStatus,
    runValidation,
    runBuild,
    runPreview,
    runAnalysis,
    runExport,
    setCommandPaletteOpen,
    setNewProjectModalOpen,
  } = useWatson();

  const viewLabels: Record<string, string> = {
    'corporate-search': 'Investigação Corporativa',
    'dashboard': 'Painel Geral',
    'file-builder': 'Editor de Arquivos',
    'template-builder': 'Construtor de Templates',
    'workflow': 'Workflow de Nós',
    'lab-targets': 'Alvos do Lab',
    'terminal': 'Terminal Kali',
    'analyzer': 'Auditoria & AST',
    'sessions': 'Sessões Ativas',
    'projects': 'Gerenciador de Projetos',
    'settings': 'Configurações',
  };

  const getStepColor = (targetStatus: string) => {
    if (pipelineStatus === targetStatus) return 'text-amber-300 bg-amber-500/20 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
    return 'text-[#94a3b8] hover:text-white hover:bg-[#151b27] border-[#1d2638]';
  };

  return (
    <header className="h-14 bg-[#080a0f] border-b border-[#18202e] px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-10 font-sans">
      {/* Left: Breadcrumbs & Project Switcher */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <button
          onClick={() => setActiveView('corporate-search')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0e121a] hover:bg-[#161c28] border border-[#1e2637] text-zinc-400 hover:text-white transition-colors"
          title="Ir para o Portal de Investigação"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-bold text-white tracking-wider">WATSON</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />

        <span className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
          {viewLabels[activeView] || activeView.replace('-', ' ')}
        </span>

        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />

        <button
          onClick={() => setActiveView('projects')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111622] hover:bg-[#1a2233] text-amber-300 border border-amber-500/25 transition-all text-xs"
          title="Clique para alternar projeto"
        >
          <FolderTree className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold">{activeProject.name}</span>
        </button>

        <button
          onClick={() => setActiveView('lab-targets')}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d141e] hover:bg-[#152132] text-cyan-300 border border-cyan-500/25 transition-all text-xs"
          title="Alvo ativo do sandbox"
        >
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span>{activeTarget.name}</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              activeTarget.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
            }`}
          />
        </button>
      </div>

      {/* Center: Operational Pipeline Steps (Direct Capsule Controls) */}
      <div className="hidden xl:flex items-center gap-1.5 bg-[#0d1118] p-1 rounded-full border border-[#1b2332] text-xs font-mono">
        <span className="text-[10px] text-zinc-500 px-2 uppercase font-bold tracking-wider">Pipeline:</span>

        {/* Validate */}
        <button
          onClick={runValidation}
          className={`px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all text-[11px] ${getStepColor(
            'validating',
          )}`}
          title="Validação estática e AST"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Validar</span>
        </button>

        {/* Build */}
        <button
          onClick={runBuild}
          className={`px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all text-[11px] ${getStepColor(
            'building',
          )}`}
          title="Compilar artefato para laboratório"
        >
          <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
          <span>Compilar</span>
        </button>

        {/* Preview */}
        <button
          onClick={runPreview}
          className={`px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all text-[11px] ${getStepColor(
            'previewing',
          )}`}
          title="Pré-visualizar sandbox isolado"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pré-visualizar</span>
        </button>

        {/* Analyze */}
        <button
          onClick={runAnalysis}
          className={`px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all text-[11px] ${getStepColor(
            'analyzing',
          )}`}
          title="Scanner de entropia e conformidade"
        >
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Analisar</span>
        </button>

        {/* Export */}
        <button
          onClick={runExport}
          className="px-3 py-1 rounded-full border border-[#1f293b] text-zinc-400 hover:text-white hover:bg-[#161e2b] flex items-center gap-1.5 text-[11px] transition-all"
          title="Exportar pacote assinado"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Exportar</span>
        </button>
      </div>

      {/* Right: Search, Pro, Terminal & New Project */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Investigação Corp Switcher Pill */}
        <button
          onClick={() => setActiveView('corporate-search')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#11151f] hover:bg-[#1a2130] text-amber-300 border border-amber-500/30 text-xs font-sans font-medium transition-all"
          title="Abrir Busca Corporativa (CNPJ / QSA)"
        >
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Investigar CNPJ</span>
        </button>

        {/* Seja PRO Button (Gold Pill matching the screenshot) */}
        <button
          onClick={onOpenPro}
          className="px-3.5 py-1.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-1"
        >
          <Star className="w-3 h-3 fill-black" />
          <span>Seja PRO</span>
        </button>

        {/* Command Palette Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#0e1219] hover:bg-[#161c28] text-zinc-400 hover:text-white border border-[#1e2636] text-xs font-mono transition-colors"
          title="Pressione Ctrl+K para comandos"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <kbd className="text-[10px] px-1.5 py-0.2 rounded bg-black text-zinc-500 border border-zinc-800">
            Ctrl+K
          </kbd>
        </button>

        {/* Terminal Quick Switcher */}
        <button
          onClick={() => setActiveView('terminal')}
          className={`p-2 rounded-full border text-xs font-mono flex items-center justify-center transition-colors ${
            activeView === 'terminal'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-[#0e1219] hover:bg-[#161c28] text-zinc-400 hover:text-white border-[#1e2636]'
          }`}
          title="Abrir Terminal Integrado"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
        </button>

        {/* New Project Quick Button */}
        <button
          onClick={() => setNewProjectModalOpen(true)}
          className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-full font-sans text-xs transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Novo Projeto</span>
        </button>
      </div>
    </header>
  );
};
