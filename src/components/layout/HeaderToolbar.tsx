import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import { SysTestLogo } from '../common/SysTestLogo';
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
  Settings as SettingsIcon,
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
    telemetry,
  } = useWatson();

  const viewLabels: Record<string, string> = {
    'corporate-search': 'Investigação Corporativa',
    'dashboard': 'Dashboard',
    'workspace': 'Workspace',
    'file-builder': 'File Builder',
    'template-builder': 'Template Builder',
    'workflow': 'Workflow Builder',
    'lab-targets': 'Lab Targets',
    'terminal': 'Terminal',
    'analyzer': 'Analyzer',
    'sessions': 'Sessions',
    'projects': 'Gerenciador de Projetos',
    'settings': 'Configurações',
  };

  const getStepColor = (targetStatus: string) => {
    if (pipelineStatus === targetStatus) return 'text-amber-300 bg-amber-500/20 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
    return 'text-[#94a3b8] hover:text-white hover:bg-[#151b27] border-[#1d2638]';
  };

  return (
    <header className="h-14 bg-[#07090e] border-b border-[#161f2e] px-3 sm:px-5 flex items-center justify-between shrink-0 select-none z-10 font-mono">
      {/* Left: SysTest Logo + Breadcrumbs */}
      <div className="flex items-center gap-2.5">
        <SysTestLogo
          size="sm"
          onClick={() => setActiveView('dashboard')}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        />

        <span className="text-zinc-700 hidden sm:inline">|</span>

        {/* View Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
            {viewLabels[activeView] || activeView}
          </span>
        </div>
      </div>

      {/* Center: PROJECT: DEMO-LAB | ENVIRONMENT: LOCAL SANDBOX + Pipeline Quick Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        {/* Project Selector Badge */}
        <button
          onClick={() => setActiveView('projects')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0e1420] hover:bg-[#151f30] text-amber-300 border border-amber-500/30 text-[11px] transition-colors"
          title="Alternar Projeto"
        >
          <FolderTree className="w-3 h-3 text-amber-400" />
          <span className="text-zinc-500 font-mono">PROJECT:</span>
          <span className="font-bold text-white uppercase">{activeProject.name}</span>
        </button>

        {/* Environment Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a1019] border border-[#1a2538] text-[11px] text-cyan-300">
          <span className="text-zinc-500 font-mono">ENVIRONMENT:</span>
          <span className="font-bold text-cyan-400">LOCAL SANDBOX</span>
        </div>

        {/* Pipeline Controls */}
        <div className="hidden xl:flex items-center gap-1 bg-[#090d14] p-0.5 rounded border border-[#182232] text-[10px]">
          <button
            onClick={runValidation}
            className={`px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${getStepColor(
              'validating',
            )}`}
            title="Validar regras e integridade"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>VALIDAR</span>
          </button>

          <button
            onClick={runBuild}
            className={`px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${getStepColor(
              'building',
            )}`}
            title="Compilar artefato para laboratório"
          >
            <Play className="w-3 h-3 text-amber-400 fill-amber-400/30" />
            <span>COMPILAR</span>
          </button>

          <button
            onClick={runPreview}
            className={`px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${getStepColor(
              'previewing',
            )}`}
            title="Visualização isolada no sandbox"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>PREVIEW</span>
          </button>

          <button
            onClick={runAnalysis}
            className={`px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${getStepColor(
              'analyzing',
            )}`}
            title="Inspeção AST e entropia"
          >
            <Activity className="w-3 h-3 text-amber-400" />
            <span>ANALISAR</span>
          </button>

          <button
            onClick={runExport}
            className="px-2 py-0.5 rounded border border-[#1d2738] text-zinc-400 hover:text-white hover:bg-[#141b27] flex items-center gap-1 transition-all"
            title="Exportar pacote"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>EXPORT</span>
          </button>
        </div>
      </div>

      {/* Right: ● SANDBOX READY | CPU | RAM | SETTINGS | Ctrl+K */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* ● SANDBOX READY */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-[#09110e] border border-emerald-900/40 text-[11px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">SANDBOX READY</span>
        </div>

        {/* CPU & RAM Telemetry */}
        <div className="hidden 2xl:flex items-center gap-2 text-[10px] text-zinc-400 bg-[#090d14] px-2 py-1 rounded border border-[#182232]">
          <span>CPU: <strong className="text-amber-400">{telemetry.cpu}%</strong></span>
          <span className="text-zinc-700">|</span>
          <span>RAM: <strong className="text-cyan-400">{telemetry.ram.split(' ')[0]}G</strong></span>
        </div>

        {/* Investigação Corp Switcher Pill */}
        <button
          onClick={() => setActiveView('corporate-search')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#11151f] hover:bg-[#1a2130] text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
          title="Abrir Busca Corporativa (CNPJ / QSA)"
        >
          <Search className="w-3 h-3 text-amber-400" />
          <span>Investigar</span>
        </button>

        {/* Command Palette Ctrl+K */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0c1119] hover:bg-[#141c2b] text-zinc-400 hover:text-white border border-[#1b2537] text-xs transition-colors"
          title="Command Palette (Ctrl+K)"
        >
          <Search className="w-3 h-3 text-zinc-500" />
          <kbd className="text-[10px] px-1 py-0.2 rounded bg-black text-amber-400/90 border border-zinc-800">
            Ctrl+K
          </kbd>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setActiveView('settings')}
          className={`p-1.5 rounded border transition-colors ${
            activeView === 'settings'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-[#0c1119] hover:bg-[#141c2b] text-zinc-400 hover:text-white border-[#1b2537]'
          }`}
          title="Configurações do SysTest"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
        </button>

        {/* New Project Quick Button */}
        <button
          onClick={() => setNewProjectModalOpen(true)}
          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded transition-all flex items-center gap-1 shadow-sm font-sans"
          title="Criar novo projeto no laboratório"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">NOVO</span>
        </button>
      </div>
    </header>
  );
};
