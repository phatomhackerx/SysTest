import React, { useState, useRef, useEffect } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Terminal as TerminalIcon,
  Play,
  Radio,
  ShieldCheck,
  RotateCcw,
  Download,
  Copy,
  Plus,
  Trash2,
  Send,
  CornerDownLeft,
} from 'lucide-react';

export const TerminalView: React.FC = () => {
  const {
    terminalTabs,
    activeTerminalTabId,
    setActiveTerminalTabId,
    executeTerminalCommand,
    clearTerminal,
    createTerminalTab,
    addNotification,
    activeProject,
    activeTarget,
    runBuild,
    runValidation,
    pingTarget,
  } = useWatson();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const activeTab = terminalTabs.find((t) => t.id === activeTerminalTabId) || terminalTabs[0];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTab?.lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputVal.trim()) return;
      executeTerminalCommand(inputVal);
      setHistory((prev) => [...prev, inputVal]);
      setHistoryIdx(-1);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInputVal('');
        }
      }
    }
  };

  const handleRunCommand = (cmd: string) => {
    executeTerminalCommand(cmd);
    setHistory((prev) => [...prev, cmd]);
  };

  const copyTerminalOutput = () => {
    const text = activeTab.lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(text);
    addNotification('Terminal Copiado', 'Logs copiados para a área de transferência.', 'info');
  };

  const exportTerminalLogs = () => {
    const text = activeTab.lines.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `systest-terminal-${activeTab.name}.log`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Logs Exportados', `Arquivo de log salvo com sucesso.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden font-mono text-xs select-none">
      {/* Top Header & Tabs Bar */}
      <div className="h-11 px-4 bg-[#080b12] border-b border-[#161f2e] flex items-center justify-between shrink-0">
        {/* Terminal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {terminalTabs.map((tab) => {
            const isActive = tab.id === activeTerminalTabId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTerminalTabId(tab.id)}
                className={`px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-colors font-mono ${
                  isActive
                    ? 'bg-[#101726] text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#0c1018]'
                }`}
              >
                <TerminalIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
          <button
            onClick={createTerminalTab}
            className="p-1 rounded text-zinc-500 hover:text-amber-400 hover:bg-[#0c1018] transition-colors"
            title="Abrir nova aba de terminal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Prompt info */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <span>ALVO: <strong className="text-cyan-400">{activeTarget.name}</strong></span>
          <span className="text-emerald-400 font-bold">AIRGAP STRICT</span>
        </div>
      </div>

      {/* Action Shortcuts Toolbar (user-specified):
          [Run Project] [Ping Target] [Check Airgap] [Clear] [Export Log] */}
      <div className="h-10 px-4 bg-[#06090e] border-b border-[#141b27] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">ATALHOS:</span>

          {/* [Run Project] */}
          <button
            onClick={() => handleRunCommand('systest run')}
            className="px-2.5 py-1 rounded bg-[#0f1624] hover:bg-[#162136] text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors font-bold text-xs"
          >
            <Play className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>[Run Project]</span>
          </button>

          {/* [Ping Target] */}
          <button
            onClick={() => handleRunCommand(`ping ${activeTarget.address}`)}
            className="px-2.5 py-1 rounded bg-[#0f1624] hover:bg-[#162136] text-cyan-300 border border-cyan-800/40 flex items-center gap-1.5 transition-colors text-xs"
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>[Ping Target]</span>
          </button>

          {/* [Check Airgap] */}
          <button
            onClick={() => handleRunCommand('systest validate')}
            className="px-2.5 py-1 rounded bg-[#0f1624] hover:bg-[#162136] text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5 transition-colors text-xs"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>[Check Airgap]</span>
          </button>

          {/* [Clear] */}
          <button
            onClick={clearTerminal}
            className="px-2.5 py-1 rounded bg-[#0f1624] hover:bg-[#162136] text-zinc-400 hover:text-white border border-[#1b2537] flex items-center gap-1.5 transition-colors text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>[Clear]</span>
          </button>

          {/* [Export Log] */}
          <button
            onClick={exportTerminalLogs}
            className="px-2.5 py-1 rounded bg-[#0f1624] hover:bg-[#162136] text-zinc-300 hover:text-white border border-[#1b2537] flex items-center gap-1.5 transition-colors text-xs"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>[Export Log]</span>
          </button>
        </div>

        <button
          onClick={copyTerminalOutput}
          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Copiar saída do terminal"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Output Area */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-1 bg-[#040608] selection:bg-amber-500/30 selection:text-amber-200 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {activeTab.lines.map((l) => {
          let lineClass = 'text-zinc-300';
          if (l.type === 'command') lineClass = 'text-cyan-400 font-semibold';
          if (l.type === 'system') lineClass = 'text-amber-400/90';
          if (l.type === 'success') lineClass = 'text-emerald-400 font-medium';
          if (l.type === 'error') lineClass = 'text-rose-400 font-bold';
          if (l.type === 'warn') lineClass = 'text-amber-300';

          return (
            <div key={l.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[10px] text-zinc-600 select-none shrink-0 font-mono">
                {l.timestamp}
              </span>
              <span className={`whitespace-pre-wrap break-all ${lineClass}`}>{l.text}</span>
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Bottom Interactive Command Line */}
      <div className="px-4 py-2.5 bg-[#07090e] border-t border-[#161f2e] flex items-center gap-2 shrink-0 select-none">
        <span className="text-emerald-400 font-bold shrink-0">
          systest@kali-lab
        </span>
        <span className="text-zinc-600">:</span>
        <span className="text-cyan-400 font-bold shrink-0">
          ~/projects/{activeProject.name.toLowerCase()}
        </span>
        <span className="text-amber-400 font-bold shrink-0">$</span>

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          placeholder="Digite um comando (ex: help, systest run, ping 127.0.0.1, systest validate)..."
          className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs placeholder:text-zinc-700"
        />

        <button
          onClick={() => {
            if (!inputVal.trim()) return;
            executeTerminalCommand(inputVal);
            setHistory((prev) => [...prev, inputVal]);
            setInputVal('');
          }}
          className="p-1 text-zinc-500 hover:text-amber-400 transition-colors"
          title="Executar comando"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
