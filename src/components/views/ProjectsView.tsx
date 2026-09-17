import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    activeProject,
    setActiveProject,
    setNewProjectModalOpen,
    setActiveView,
  } = useWatson();

  return (
    <div className="flex-1 flex flex-col h-full watson-grid-bg bg-black overflow-y-auto p-4 sm:p-6 lg:p-8 font-sans text-zinc-300 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#090c13] border border-[#1a2232] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase font-mono">GERENCIADOR DE PROJETOS</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono font-semibold">
              {projects.length} WORKSPACES
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1.5 font-sans">
            Gerencie workspaces do laboratório, vinculação de alvos de teste e históricos de compilação em ambiente isolado.
          </p>
        </div>

        <button
          onClick={() => setNewProjectModalOpen(true)}
          className="px-4 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isActive = proj.id === activeProject.id;
          return (
            <div
              key={proj.id}
              className={`bg-[#0b0e15] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)] ring-1 ring-amber-500/30'
                  : 'border-[#1a2232] hover:border-[#28354c]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between pb-3 mb-3 border-b border-[#18202e]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white tracking-wide">{proj.name}</span>
                      {isActive && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                          ATIVO
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-cyan-400 font-mono mt-0.5 block">{proj.targetId}</span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#121824] text-emerald-400 font-mono font-semibold border border-emerald-900/40">
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{proj.description}</p>

                <div className="space-y-2 text-xs font-mono text-zinc-500 bg-[#07090f] p-3 rounded-xl border border-[#161d2b]">
                  <div className="flex justify-between">
                    <span>Ambiente:</span>
                    <span className="text-zinc-300 font-semibold truncate">{proj.environment.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Último Build:</span>
                    <span className="text-zinc-300">{proj.lastBuild}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hash SHA-256:</span>
                    <span className="text-amber-400/90 font-mono">{proj.lastBuildHash.substring(0, 10)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arquivos / Avisos:</span>
                    <span className="text-white font-medium">
                      {proj.filesCount} arquivos / {proj.warningsCount} alertas
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#10141e] text-zinc-400 border border-[#1d2638] font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#18202e] flex items-center justify-between font-mono">
                {!isActive ? (
                  <button
                    onClick={() => setActiveProject(proj)}
                    className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2232] text-amber-300 border border-amber-500/30 text-xs transition-colors"
                  >
                    Alternar Workspace
                  </button>
                ) : (
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Carregado
                  </span>
                )}

                <button
                  onClick={() => {
                    setActiveProject(proj);
                    setActiveView('file-builder');
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center gap-1.5 text-xs transition-colors font-sans font-semibold"
                >
                  <span>Abrir no Editor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
