import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import { Shield, Radio, Lock } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { activeProject, activeTarget, activeFile, pipelineStatus } = useWatson();

  return (
    <footer className="h-7 bg-[#06080c] border-t border-[#161d2b] px-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 select-none shrink-0 z-10">
      {/* Left items */}
      <div className="flex items-center gap-3">
        {/* Project & Isolation */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Shield className="w-3 h-3 text-amber-400" />
          <span className="text-zinc-500">PROJETO:</span>
          <span className="text-white font-medium">{activeProject.name}</span>
          <span className="text-zinc-700">|</span>
          <span className="text-cyan-400 text-[10px] bg-cyan-950/40 px-1.5 py-0.2 rounded border border-cyan-800/40">AIRGAP</span>
        </div>

        {/* Target Link */}
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span className="text-zinc-500">ALVO:</span>
          <span className="text-zinc-300 font-medium">{activeTarget.name}</span>
          <span className="text-emerald-400 text-[10px]">({activeTarget.status})</span>
          <span className="text-zinc-600">[{activeTarget.latencyMs || 1}ms]</span>
        </div>

        {/* Active file metadata if any */}
        {activeFile && (
          <div className="hidden md:flex items-center gap-2 text-zinc-400">
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-300">{activeFile.path}</span>
            <span className="text-zinc-600">[{activeFile.permissions}]</span>
          </div>
        )}
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        {/* Last Build Hash */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px]">
          <span className="text-zinc-600">HASH:</span>
          <span className="text-amber-400/90 font-mono">{activeProject.lastBuildHash.substring(0, 10)}</span>
        </div>

        {/* Pipeline status */}
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-600">PIPELINE:</span>
          <span
            className={`font-semibold uppercase text-[10px] px-2 py-0.2 rounded-full border ${
              pipelineStatus === 'ready' || pipelineStatus === 'success'
                ? 'text-emerald-300 bg-emerald-950/30 border-emerald-800/40'
                : pipelineStatus === 'building' || pipelineStatus === 'validating'
                ? 'text-amber-300 bg-amber-950/30 border-amber-800/40 animate-pulse'
                : 'text-zinc-400 bg-zinc-900 border-zinc-800'
            }`}
          >
            {pipelineStatus}
          </span>
        </div>

        {/* Confinement Lock */}
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[10px] bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-800/40">
          <Lock className="w-2.5 h-2.5 text-emerald-400" />
          <span>ISOLADO</span>
        </div>
      </div>
    </footer>
  );
};
