import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  FolderPlus,
  FolderOpen,
  Upload,
  Server,
  Play,
  CheckCircle2,
  Eye,
  Download,
  FileCode,
  Layers,
  GitGraph,
  ShieldCheck,
  Terminal,
  Clock,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Cpu,
  AlertTriangle,
  Search,
  Star,
  Shield,
  Building2,
  Users,
  Database,
  Lock,
} from 'lucide-react';
import { ViewMode } from '../../types';
import { WatsonLogo } from '../common/WatsonLogo';

export const DashboardView: React.FC<{ onOpenPro?: () => void }> = ({ onOpenPro }) => {
  const {
    activeProject,
    activeTarget,
    setActiveView,
    setNewProjectModalOpen,
    runValidation,
    runBuild,
    runPreview,
    runExport,
    runAnalysis,
    runFullPipeline,
    pingTarget,
  } = useWatson();

  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('corporate-search');
  };

  const toolModules: {
    id: ViewMode;
    code: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: string;
    accent: string;
    actionLabel: string;
  }[] = [
    {
      id: 'corporate-search',
      code: 'MOD-OSINT',
      title: 'Investigação Corporativa',
      description: 'Dossiês completos de CNPJ, quadro societário (QSA), capital social, filiais e histórico cadastral da Receita Federal.',
      icon: <Search className="w-5 h-5 text-amber-400" />,
      status: 'BASE 67M+',
      accent: 'border-amber-500/40 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.08)]',
      actionLabel: 'Consultar CNPJ',
    },
    {
      id: 'file-builder',
      code: 'MOD-FB01',
      title: 'File Builder',
      description: 'Editor de código integrado, validação de regras sintáticas e gerador de artefatos com empacotamento SHA-256.',
      icon: <FileCode className="w-5 h-5 text-cyan-400" />,
      status: 'IDE ATIVA',
      accent: 'border-cyan-500/30 hover:border-cyan-400',
      actionLabel: 'Abrir Editor',
    },
    {
      id: 'template-builder',
      code: 'MOD-TB02',
      title: 'Template Builder',
      description: 'Construtor visual de templates para treinamentos de conscientização e simulações educativas controladas.',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      status: 'PRONTO',
      accent: 'border-emerald-500/30 hover:border-emerald-400',
      actionLabel: 'Abrir Canvas',
    },
    {
      id: 'workflow',
      code: 'MOD-WF03',
      title: 'Workflow Builder',
      description: 'Pipeline visual em grafo para conectar validações, compiladores, parsers de arquivos e auditores.',
      icon: <GitGraph className="w-5 h-5 text-amber-400" />,
      status: 'GRAFO OK',
      accent: 'border-amber-500/30 hover:border-amber-400',
      actionLabel: 'Editar Grafo',
    },
    {
      id: 'analyzer',
      code: 'MOD-AZ04',
      title: 'Auditoria & Heurística',
      description: 'Mecanismo de inspeção de segurança técnica com análise AST, entropia de Shannon e verificação estática.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      status: '0 VULNS',
      accent: 'border-indigo-500/30 hover:border-indigo-400',
      actionLabel: 'Auditar',
    },
    {
      id: 'terminal',
      code: 'MOD-TM05',
      title: 'Terminal Kali Linux',
      description: 'Terminal interativo simulando ambiente Kali com comandos técnicos sandbox e ferramentas de rede.',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      status: 'BASH ATIVO',
      accent: 'border-emerald-500/30 hover:border-emerald-400',
      actionLabel: 'Abrir Terminal',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full watson-grid-bg bg-black overflow-y-auto p-4 sm:p-6 lg:p-8 font-sans text-zinc-300 space-y-6">
      {/* Hero: Sr. Watson Signature Search Banner */}
      <div className="relative rounded-2xl bg-[#090c13] border border-[#1a2232] p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Subtle radial glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Fedora Hat & Brand Name */}
          <div className="mb-4">
            <WatsonLogo size="lg" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            INVESTIGAÇÃO CORPORATIVA & SEGURANÇA OPERACIONAL
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl mb-6">
            Consulte qualquer empresa do Brasil ou utilize as ferramentas do laboratório em ambiente isolado e seguro.
          </p>

          {/* Quick Search Capsule matching the screenshot */}
          <form
            onSubmit={handleQuickSearch}
            className="w-full max-w-2xl flex items-center bg-[#07090f] border border-[#232b3c] hover:border-[#35435c] focus-within:border-blue-500 rounded-full p-1.5 shadow-xl transition-all"
          >
            <div className="pl-4 text-zinc-500">
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Digite o CNPJ ou Nome da Empresa (ex: 00.000.000/0001-91 ou petrobras)..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Buscar</span>
            </button>
          </form>

          {/* Stats Badges matching the screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d121c] border border-[#1b2434] text-xs text-zinc-300">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>+67 MILHÕES DE EMPRESAS</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d121c] border border-[#1b2434] text-xs text-zinc-300">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>+1 MILHÃO DE PESQUISAS</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d121c] border border-[#1b2434] text-xs text-zinc-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% SEGURO & AIRGAPPED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Actions Toolbar */}
      <div className="bg-[#0b0e15] border border-[#1a2232] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-amber-400 tracking-wider font-mono uppercase">
            AÇÕES RÁPIDAS:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* New Project */}
          <button
            onClick={() => setNewProjectModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2232] border border-[#222c3e] text-white flex items-center gap-1.5 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Novo Projeto</span>
          </button>

          {/* Open Project */}
          <button
            onClick={() => setActiveView('projects')}
            className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2232] border border-[#222c3e] text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Projetos</span>
          </button>

          {/* Import */}
          <button
            onClick={() => setActiveView('file-builder')}
            className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2232] border border-[#222c3e] text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Importar</span>
          </button>

          {/* Lab Target */}
          <button
            onClick={() => setActiveView('lab-targets')}
            className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2232] border border-[#222c3e] text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Alvo Lab</span>
          </button>

          <span className="text-zinc-700 px-1">|</span>

          {/* Build */}
          <button
            onClick={runBuild}
            className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Build</span>
          </button>

          {/* Validate */}
          <button
            onClick={runValidation}
            className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2232] border border-[#222c3e] text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Validate</span>
          </button>

          {/* Preview */}
          <button
            onClick={runPreview}
            className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2232] border border-[#222c3e] text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preview</span>
          </button>

          {/* Export */}
          <button
            onClick={runExport}
            className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2232] border border-[#222c3e] text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ACTIVE PROJECT Operational Panel */}
      <div className="bg-[#0b0e15] border border-[#1a2232] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-[#18202e] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500 tracking-wider uppercase font-mono font-semibold">
                  PROJETO ATIVO:
                </span>
                <span className="text-base font-bold text-white tracking-wide">{activeProject.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  {activeProject.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{activeProject.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={runFullPipeline}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Executar Pipeline Completo</span>
            </button>
            <button
              onClick={() => setActiveView('file-builder')}
              className="px-3 py-1.5 rounded-full bg-[#141a26] hover:bg-[#1e2738] border border-[#242f44] text-white flex items-center gap-1.5 transition-colors"
            >
              <span>Abrir no Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          {/* Environment */}
          <div className="p-3 rounded-xl bg-[#07090f] border border-[#161d2b]">
            <div className="text-[10px] text-zinc-500 uppercase">Ambiente</div>
            <div className="text-zinc-200 font-semibold mt-1 truncate">{activeProject.environment.split(' ')[0]}</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">ISOLADO</div>
          </div>

          {/* Target */}
          <div className="p-3 rounded-xl bg-[#07090f] border border-[#161d2b]">
            <div className="text-[10px] text-zinc-500 uppercase">Alvo</div>
            <div className="text-cyan-300 font-semibold mt-1 truncate">{activeTarget.name}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">{activeTarget.status}</div>
          </div>

          {/* Status */}
          <div className="p-3 rounded-xl bg-[#07090f] border border-[#161d2b]">
            <div className="text-[10px] text-zinc-500 uppercase">Status</div>
            <div className="text-emerald-400 font-semibold mt-1">{activeProject.status}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Online</div>
          </div>

          {/* Last Build */}
          <div className="p-3 rounded-xl bg-[#07090f] border border-[#161d2b]">
            <div className="text-[10px] text-zinc-500 uppercase">Último Build</div>
            <div className="text-zinc-200 font-semibold mt-1 truncate">{activeProject.lastBuild}</div>
            <div className="text-[10px] text-amber-400 font-mono mt-0.5">
              {activeProject.lastBuildHash.substring(0, 8)}
            </div>
          </div>

          {/* Files */}
          <div className="p-3 rounded-xl bg-[#07090f] border border-[#161d2b]">
            <div className="text-[10px] text-zinc-500 uppercase">Arquivos</div>
            <div className="text-white font-semibold mt-1">{activeProject.filesCount} arquivos</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Estrutura OK</div>
          </div>

          {/* Warnings */}
          <div className="p-3 rounded-xl bg-[#07090f] border border-[#161d2b]">
            <div className="text-[10px] text-zinc-500 uppercase">Avisos</div>
            <div className="text-amber-400 font-semibold mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeProject.warningsCount} Alertas</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Não crítico</div>
          </div>

          {/* Target Handshake */}
          <div className="p-3 rounded-xl bg-[#07090f] border border-[#161d2b] flex flex-col justify-between">
            <div className="text-[10px] text-zinc-500 uppercase">Ping Sandbox</div>
            <button
              onClick={() => pingTarget(activeTarget.id)}
              className="mt-1 w-full py-1 rounded-lg bg-[#111724] hover:bg-[#1a2336] text-cyan-300 text-[10px] border border-cyan-800/40 transition-colors"
            >
              Testar ({activeTarget.latencyMs || 1}ms)
            </button>
          </div>
        </div>
      </div>

      {/* TOOL MODULES Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wider font-mono uppercase">
              MÓDULOS OPERACIONAIS
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">| Ferramentas Técnicas do Toolkit</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Selecione uma ferramenta</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => setActiveView(mod.id)}
              className={`bg-[#0b0e15] border ${mod.accent} rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between group relative hover:translate-y-[-2px]`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#121724] border border-[#1f283a]">
                      {mod.icon}
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono">{mod.code}</span>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {mod.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#121724] text-zinc-400 border border-[#20293a] font-mono">
                    {mod.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {mod.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#161d2b] flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {mod.actionLabel}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-zinc-600">ISOLAMENTO ATIVO</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
