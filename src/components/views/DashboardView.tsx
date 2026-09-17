import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  FolderPlus,
  FolderOpen,
  FileCode,
  GitGraph,
  Terminal as TerminalIcon,
  ShieldCheck,
  Server,
  Layers,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Cpu,
  Activity,
  HardDrive,
  Box,
  Binary,
  Code2,
  Terminal,
  ExternalLink,
  Lock,
  Search,
} from 'lucide-react';
import { ViewMode } from '../../types';

export const DashboardView: React.FC<{ onOpenPro?: () => void }> = () => {
  const {
    activeProject,
    setActiveProjectId,
    projects,
    activeTarget,
    setActiveView,
    setNewProjectModalOpen,
    pipelineStatus,
    telemetry,
    runValidation,
    runBuild,
    runAnalysis,
    addNotification,
  } = useWatson();

  const handleOpenProject = (id: string, name: string) => {
    setActiveProjectId(id);
    addNotification('Projeto Aberto', `Ambiente de laboratório carregado: ${name}`, 'success');
  };

  const isReady = pipelineStatus === 'ready' || pipelineStatus === 'success';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#040609] overflow-y-auto p-4 sm:p-6 lg:p-7 font-mono text-zinc-300 space-y-6 select-none">
      {/* Top Banner: Workstation Header */}
      <div className="bg-[#080c14] border border-[#162030] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">
              [SYSTEST WORKSTATION]
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-bold text-xs">CENTRAL OPERACIONAL</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase mt-1">
            Visual Security Laboratory
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Ambiente operacional de testes de segurança, validação de arquivos e telemetria de laboratório.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('corporate-search')}
            className="px-3 py-1.5 rounded bg-[#101726] hover:bg-[#182338] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Acessar base de investigação e inteligência corporativa"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Investigação OSINT</span>
          </button>

          <button
            onClick={() => setNewProjectModalOpen(true)}
            className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>NOVO PROJETO</span>
          </button>
        </div>
      </div>

      {/* BLOCO 1: Projeto Atual */}
      <div className="bg-[#070a10] border border-[#162030] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#141b28] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">BLOCO 1:</span>
            <span className="text-sm font-bold text-white uppercase">PROJETO ATUAL</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-bold">
              {activeProject.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveView('file-builder')}
              className="px-3 py-1 rounded bg-[#111724] hover:bg-[#182234] border border-[#1f2a3e] text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors text-[11px]"
            >
              <span>Abrir no File Builder</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Specifications Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 text-xs">
          {/* Projeto */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Projeto</div>
            <div className="text-amber-400 font-bold mt-1 truncate" title={activeProject.name}>
              {activeProject.name}
            </div>
            <div className="text-[10px] text-zinc-600 mt-0.5 font-mono">ID: {activeProject.id}</div>
          </div>

          {/* Ambiente */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Ambiente</div>
            <div className="text-cyan-400 font-bold mt-1 truncate">LOCAL SANDBOX</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Confinado
            </div>
          </div>

          {/* Alvo Ativo */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Alvo Ativo</div>
            <div className="text-white font-bold mt-1 truncate" title={activeTarget.name}>
              {activeTarget.name}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">{activeTarget.status} ({activeTarget.latencyMs || 1}ms)</div>
          </div>

          {/* Status */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Status</div>
            <div className="text-emerald-400 font-bold mt-1">READY</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Airgap ativo</div>
          </div>

          {/* Último Build */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Último Build</div>
            <div className="text-emerald-400 font-bold mt-1">PASS</div>
            <div className="text-[10px] text-amber-400/90 mt-0.5 font-mono">
              {activeProject.lastBuildHash.substring(0, 8)}
            </div>
          </div>

          {/* Arquivos */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Arquivos</div>
            <div className="text-white font-bold mt-1">{activeProject.filesCount}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Árvore montada</div>
          </div>

          {/* Warnings */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Warnings</div>
            <div className="text-amber-400 font-bold mt-1">0{activeProject.warningsCount}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Baixo risco</div>
          </div>
        </div>
      </div>

      {/* BLOCO 2: Ações Rápidas (botões compactos e destacados) */}
      <div className="bg-[#070a10] border border-[#162030] rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">BLOCO 2:</span>
          <span className="text-sm font-bold text-white uppercase">AÇÕES RÁPIDAS</span>
          <span className="text-[11px] text-zinc-500 font-sans">• Atalhos diretos para módulos do laboratório</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* NOVO PROJETO */}
          <button
            onClick={() => setNewProjectModalOpen(true)}
            className="p-3 rounded-lg bg-[#0e1420] hover:bg-[#152033] border border-amber-500/40 hover:border-amber-400 text-amber-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <FolderPlus className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide">NOVO PROJETO</span>
          </button>

          {/* ABRIR PROJETO */}
          <button
            onClick={() => setActiveView('projects')}
            className="p-3 rounded-lg bg-[#0c121c] hover:bg-[#131d2c] border border-[#1e2a3c] hover:border-cyan-400 text-zinc-200 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <FolderOpen className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide">ABRIR PROJETO</span>
          </button>

          {/* FILE BUILDER */}
          <button
            onClick={() => setActiveView('file-builder')}
            className="p-3 rounded-lg bg-[#0c121c] hover:bg-[#131d2c] border border-[#1e2a3c] hover:border-emerald-400 text-zinc-200 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <FileCode className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide">FILE BUILDER</span>
          </button>

          {/* WORKFLOW */}
          <button
            onClick={() => setActiveView('workflow')}
            className="p-3 rounded-lg bg-[#0c121c] hover:bg-[#131d2c] border border-[#1e2a3c] hover:border-amber-400 text-zinc-200 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <GitGraph className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide">WORKFLOW</span>
          </button>

          {/* TERMINAL */}
          <button
            onClick={() => setActiveView('terminal')}
            className="p-3 rounded-lg bg-[#0c121c] hover:bg-[#131d2c] border border-[#1e2a3c] hover:border-emerald-400 text-zinc-200 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <TerminalIcon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide">TERMINAL</span>
          </button>

          {/* ANALYZER */}
          <button
            onClick={() => setActiveView('analyzer')}
            className="p-3 rounded-lg bg-[#0c121c] hover:bg-[#131d2c] border border-[#1e2a3c] hover:border-indigo-400 text-zinc-200 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide">ANALYZER</span>
          </button>

          {/* LAB TARGETS */}
          <button
            onClick={() => setActiveView('lab-targets')}
            className="p-3 rounded-lg bg-[#0c121c] hover:bg-[#131d2c] border border-[#1e2a3c] hover:border-cyan-400 text-zinc-200 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <Server className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide">LAB TARGETS</span>
          </button>
        </div>
      </div>

      {/* BLOCO 3: Projetos Recentes (tabela real) */}
      <div className="bg-[#070a10] border border-[#162030] rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">BLOCO 3:</span>
            <span className="text-sm font-bold text-white uppercase">PROJETOS RECENTES</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#101726] text-cyan-400 border border-cyan-800/40">
              {projects.length} REGISTRADOS
            </span>
          </div>

          <button
            onClick={() => setActiveView('projects')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Real Table */}
        <div className="overflow-x-auto border border-[#141b27] rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#05070c] border-b border-[#141b27] text-zinc-500 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">NOME DO PROJETO</th>
                <th className="py-2.5 px-3">AMBIENTE</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">ÚLTIMA ATIVIDADE</th>
                <th className="py-2.5 px-3 text-right">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#101622]">
              {projects.map((proj) => {
                const isCurrent = proj.id === activeProject.id;
                return (
                  <tr
                    key={proj.id}
                    className={`transition-colors ${
                      isCurrent ? 'bg-[#0f1624]/60 text-white' : 'hover:bg-[#0a0f18] text-zinc-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-400' : 'bg-zinc-600'}`} />
                      <span className="text-white font-mono">{proj.name}</span>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ATIVO
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-zinc-400 font-mono">
                      {proj.environment}
                    </td>

                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          proj.status === 'READY'
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                            : proj.status === 'ANALYZED'
                            ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/40'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-zinc-400 font-mono text-[11px]">
                      {proj.lastBuild}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenProject(proj.id, proj.name)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          isCurrent
                            ? 'bg-[#182336] text-amber-300 border border-amber-500/30 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-400 text-black shadow-sm'
                        }`}
                      >
                        {isCurrent ? 'EM USO' : 'ABRIR'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOCO 4: Sistema */}
      <div className="bg-[#070a10] border border-[#162030] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#141b28]">
          <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">BLOCO 4:</span>
          <span className="text-sm font-bold text-white uppercase">SISTEMA & AMBIENTE DE LABORATÓRIO</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Sandbox Status */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-zinc-500 uppercase font-bold flex items-center justify-between">
              <span>Sandbox</span>
              <span className="text-emerald-400 font-bold">ONLINE / ISOLADO</span>
            </div>
            <div className="flex items-center gap-2 pt-1 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>cgroups v2 Confinement</span>
            </div>
            <p className="text-[10px] text-zinc-500">
              Isolamento estrito de memória (512MB) e rede loopback autorizada.
            </p>
          </div>

          {/* Runtime */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-zinc-500 uppercase font-bold flex items-center justify-between">
              <span>Runtime</span>
              <span className="text-cyan-400 font-bold">LOCAL AIRGAP</span>
            </div>
            <div className="text-white font-mono pt-1">
              Kernel 6.6.15-systest-x86_64
            </div>
            <p className="text-[10px] text-zinc-500">
              Sem telemetria externa, 100% de execução local segura no container.
            </p>
          </div>

          {/* Runtimes detectados */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Runtimes Detectados</div>
            <div className="space-y-0.5 pt-1 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Node.js:</span>
                <span className="text-emerald-400 font-bold">v20.18.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Python:</span>
                <span className="text-emerald-400 font-bold">3.12.3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Git:</span>
                <span className="text-emerald-400 font-bold">2.43.0</span>
              </div>
            </div>
          </div>

          {/* Ferramentas Disponíveis */}
          <div className="bg-[#05070c] border border-[#141b27] rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Ferramentas no Laboratório</div>
            <div className="flex flex-wrap gap-1 pt-1 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-[#101724] border border-[#1a2436] text-amber-300">
                ast-parser
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#101724] border border-[#1a2436] text-cyan-300">
                entropy-calc
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#101724] border border-[#1a2436] text-emerald-300">
                sha256sum
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#101724] border border-[#1a2436] text-zinc-300">
                nmap-cli
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#101724] border border-[#1a2436] text-zinc-300">
                binwalk
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
