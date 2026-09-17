import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import { Shield, Radio, Lock, Terminal as TerminalIcon, ChevronUp } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { activeProject, activeTarget, activeFile, pipelineStatus, telemetry, toggleBottomDock } = useWatson();

  const isReady = pipelineStatus === 'ready' || pipelineStatus === 'success';

  return (
    <footer className="h-7 bg-[#05070a] border-t border-[#141b27] px-3 flex items-center justify-between text-[11px] font-mono text-zinc-500 select-none shrink-0 z-10">
      {/* Left items matching Section 11 format */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* LOCAL SANDBOX */}
        <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
          <Shield className="w-3 h-3 text-amber-400" />
          <span className="text-zinc-300 font-bold uppercase text-[10px] tracking-wider">LOCAL SANDBOX</span>
        </div>

        <span className="text-zinc-700">|</span>

        {/* ● READY */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
          <span className={`font-bold uppercase text-[10px] ${isReady ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isReady ? 'READY' : pipelineStatus}
          </span>
        </div>

        <span className="text-zinc-700">|</span>

        {/* BUILD */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-zinc-500 text-[10px]">BUILD:</span>
          <span
            className={`font-semibold uppercase text-[10px] px-1.5 py-0.2 rounded border ${
              isReady
                ? 'text-emerald-400 border-emerald-800/40 bg-emerald-950/20'
                : 'text-amber-400 border-amber-800/40 bg-amber-950/20'
            }`}
          >
            {isReady ? 'PASS' : pipelineStatus}
          </span>
        </div>

        <span className="text-zinc-700 hidden sm:inline">|</span>

        {/* FILES */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="text-zinc-500 text-[10px]">FILES:</span>
          <span className="text-zinc-200 font-semibold">{activeProject.filesCount}</span>
        </div>

        <span className="text-zinc-700 hidden md:inline">|</span>

        {/* WARNINGS */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <span className="text-zinc-500 text-[10px]">WARNINGS:</span>
          <span className="text-amber-400 font-semibold">0{activeProject.warningsCount}</span>
        </div>

        <span className="text-zinc-700 hidden md:inline">|</span>

        {/* ERRORS */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <span className="text-zinc-500 text-[10px]">ERRORS:</span>
          <span className="text-zinc-400 font-semibold">00</span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Target link */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-zinc-400">
          <Radio className="w-2.5 h-2.5 text-cyan-400" />
          <span className="text-zinc-500">ALVO:</span>
          <span className="text-cyan-400">{activeTarget.name}</span>
        </div>

        {/* Console Toggle */}
        <button
          onClick={toggleBottomDock}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0d121c] hover:bg-[#151c2a] text-zinc-400 hover:text-white border border-[#1b2333] transition-colors text-[10px]"
          title="Alternar console dock"
        >
          <TerminalIcon className="w-3 h-3 text-amber-400" />
          <span>CONSOLE</span>
        </button>

        {/* Version Badge */}
        <span className="text-zinc-400 font-bold text-[10px] px-2 py-0.5 rounded bg-[#0b1018] border border-[#182130]">
          SYSTEST v0.1
        </span>
      </div>
    </footer>
  );
};
