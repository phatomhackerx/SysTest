import React, { useState, useRef, useEffect } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Terminal as TerminalIcon,
  Layers,
  Activity,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export const BottomDock: React.FC = () => {
  const {
    bottomDockOpen,
    setBottomDockOpen,
    bottomDockTab,
    setBottomDockTab,
    terminalTabs,
    activeTerminalTabId,
    executeTerminalCommand,
    clearTerminal,
    pipelineStatus,
    activeProject,
    activeTarget,
    sessions,
    runValidation,
    runBuild,
  } = useWatson();

  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const activeTab = terminalTabs.find((t) => t.id === activeTerminalTabId) || terminalTabs[0];

  const activeSession = sessions[0];

  useEffect(() => {
    if (bottomDockOpen && bottomDockTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab?.lines, bottomDockOpen, bottomDockTab]);

  if (!bottomDockOpen) {
    return (
      <div className="h-7 bg-[#07090e] border-t border-[#18202f] px-3 flex items-center justify-between font-mono text-[11px] select-none shrink-0 z-15">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBottomDockOpen(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0f141f] hover:bg-[#161f2e] text-zinc-400 hover:text-white border border-[#1d2638] transition-colors"
          >
            <ChevronUp className="w-3 h-3 text-amber-400" />
            <TerminalIcon className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold text-[10px] uppercase">Console / Terminal</span>
          </button>

          <span className="text-zinc-600 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-2 text-zinc-500 text-[10px]">
            <span>STATUS:</span>
            <span className="text-emerald-400 font-bold uppercase">{pipelineStatus}</span>
            <span>•</span>
            <span>ALVO: {activeTarget.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setBottomDockTab('terminal');
              setBottomDockOpen(true);
            }}
            className="px-2 py-0.5 rounded text-[10px] text-zinc-400 hover:text-white hover:bg-[#121824]"
          >
            Terminal
          </button>
          <button
            onClick={() => {
              setBottomDockTab('output');
              setBottomDockOpen(true);
            }}
            className="px-2 py-0.5 rounded text-[10px] text-zinc-400 hover:text-white hover:bg-[#121824]"
          >
            Build Output
          </button>
          <button
            onClick={() => {
              setBottomDockTab('events');
              setBottomDockOpen(true);
            }}
            className="px-2 py-0.5 rounded text-[10px] text-zinc-400 hover:text-white hover:bg-[#121824]"
          >
            Eventos ({activeSession?.events.length || 0})
          </button>
        </div>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputVal.trim()) return;
      executeTerminalCommand(inputVal);
      setInputVal('');
    }
  };

  return (
    <div
      className={`border-t border-[#18202f] bg-[#05070a] flex flex-col shrink-0 font-mono select-none z-20 transition-all duration-150 ${
        isExpanded ? 'h-80' : 'h-56'
      }`}
    >
      {/* Dock Top Tabs Toolbar */}
      <div className="h-8 bg-[#090c13] border-b border-[#18202f] px-3 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setBottomDockTab('terminal')}
            className={`px-3 py-1 text-[11px] rounded-t flex items-center gap-1.5 transition-colors ${
              bottomDockTab === 'terminal'
                ? 'bg-[#05070a] text-amber-400 font-bold border-t border-x border-[#18202f] -mb-px'
                : 'text-zinc-400 hover:text-white hover:bg-[#0f141f]'
            }`}
          >
            <TerminalIcon className="w-3 h-3 text-emerald-400" />
            <span>TERMINAL</span>
          </button>

          <button
            onClick={() => setBottomDockTab('output')}
            className={`px-3 py-1 text-[11px] rounded-t flex items-center gap-1.5 transition-colors ${
              bottomDockTab === 'output'
                ? 'bg-[#05070a] text-amber-400 font-bold border-t border-x border-[#18202f] -mb-px'
                : 'text-zinc-400 hover:text-white hover:bg-[#0f141f]'
            }`}
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>BUILD OUTPUT</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                pipelineStatus === 'building' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
              }`}
            />
          </button>

          <button
            onClick={() => setBottomDockTab('events')}
            className={`px-3 py-1 text-[11px] rounded-t flex items-center gap-1.5 transition-colors ${
              bottomDockTab === 'events'
                ? 'bg-[#05070a] text-amber-400 font-bold border-t border-x border-[#18202f] -mb-px'
                : 'text-zinc-400 hover:text-white hover:bg-[#0f141f]'
            }`}
          >
            <Activity className="w-3 h-3 text-amber-400" />
            <span>EVENTOS ({activeSession?.events.length || 0})</span>
          </button>
        </div>

        {/* Right Dock Controls */}
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="hidden sm:flex items-center gap-2 text-[10px] mr-2">
            <span className="text-zinc-600">PWD:</span>
            <span className="text-zinc-400">~/projects/{activeProject.name}</span>
          </div>

          <button
            onClick={clearTerminal}
            className="p-1 rounded hover:bg-[#121824] hover:text-zinc-300 transition-colors"
            title="Limpar tela"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-[#121824] hover:text-zinc-300 transition-colors"
            title={isExpanded ? 'Restaurar tamanho' : 'Maximizar dock'}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setBottomDockOpen(false)}
            className="p-1 rounded hover:bg-[#121824] hover:text-rose-400 transition-colors"
            title="Recolher dock"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Dock Content Body */}
      <div className="flex-1 overflow-hidden relative">
        {bottomDockTab === 'terminal' && (
          <div className="h-full flex flex-col justify-between bg-[#040609] p-3 text-[11px] font-mono select-text">
            <div className="flex-1 overflow-y-auto space-y-1">
              {activeTab.lines.map((line) => {
                let color = 'text-zinc-300';
                if (line.type === 'command') color = 'text-amber-400 font-semibold';
                else if (line.type === 'error') color = 'text-rose-400 font-bold';
                else if (line.type === 'success') color = 'text-emerald-400 font-semibold';
                else if (line.type === 'warn') color = 'text-amber-300';
                else if (line.type === 'system') color = 'text-cyan-400/90';

                return (
                  <div key={line.id} className={`leading-relaxed whitespace-pre-wrap ${color}`}>
                    {line.text}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Bar */}
            <div className="pt-2 border-t border-[#141b27] flex items-center gap-2 select-none shrink-0">
              <span className="text-emerald-400 font-bold shrink-0">systest@lab:~$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="digite 'ajuda', 'validate', 'build', 'ls'..."
                className="flex-1 bg-transparent border-none text-zinc-100 text-[11px] focus:outline-none focus:ring-0 font-mono"
              />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={runValidation}
                  className="px-2 py-0.5 rounded bg-[#101724] hover:bg-[#182234] border border-emerald-800/40 text-emerald-400 text-[10px]"
                >
                  validate
                </button>
                <button
                  onClick={runBuild}
                  className="px-2 py-0.5 rounded bg-[#101724] hover:bg-[#182234] border border-amber-800/40 text-amber-400 text-[10px]"
                >
                  build
                </button>
              </div>
            </div>
          </div>
        )}

        {bottomDockTab === 'output' && (
          <div className="h-full overflow-y-auto bg-[#040609] p-3 text-[11px] font-mono text-zinc-300 space-y-1.5 select-text">
            <div className="text-zinc-500 font-bold uppercase text-[10px] pb-1 border-b border-[#141b27] flex items-center justify-between">
              <span>DAEMON DE COMPILAÇÃO & EMPACOTAMENTO DE ARTEFATOS</span>
              <span className="text-emerald-400">STATUS: {pipelineStatus.toUpperCase()}</span>
            </div>
            <div className="text-cyan-400">[DAEMON] Workspace: /home/systest/projects/{activeProject.name}</div>
            <div className="text-zinc-400">[DAEMON] Verificando integridade das assinaturas locais... OK</div>
            <div className="text-zinc-400">[DAEMON] Compilação do target format: SysTest Lab Bundle v0.1</div>
            <div className="text-emerald-400">[PASS] 8/8 arquivos validados sintaticamente sem erros críticos.</div>
            <div className="text-amber-400">[WARN] pipeline.yaml: favicon.ico omitido (modo headless seguro).</div>
            <div className="text-zinc-300">
              [INFO] SHA-256 Digest:{' '}
              <span className="text-amber-300 font-bold">{activeProject.lastBuildHash}</span>
            </div>
            <div className="text-emerald-400">[SUCCESS] Artefato pronto para envio ao alvo {activeTarget.name}.</div>
          </div>
        )}

        {bottomDockTab === 'events' && (
          <div className="h-full overflow-y-auto bg-[#040609] p-3 text-[11px] font-mono space-y-1 select-text">
            <div className="text-zinc-500 font-bold uppercase text-[10px] pb-1 border-b border-[#141b27] flex items-center justify-between">
              <span>LOG DE EVENTOS DA SESSÃO ({activeSession?.id})</span>
              <span className="text-cyan-400">ALVO: {activeTarget.address}</span>
            </div>
            {activeSession?.events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 py-0.5 border-b border-[#0d121c]/40 text-xs">
                <span className="text-zinc-500 text-[10px] shrink-0">[{ev.timestamp}]</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold shrink-0 ${
                    ev.severity === 'success'
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : ev.severity === 'warn'
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                      : 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/40'
                  }`}
                >
                  {ev.type}
                </span>
                <span className="text-zinc-300 truncate">{ev.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
