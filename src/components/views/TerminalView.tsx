import React, { useState, useRef, useEffect } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Terminal as TerminalIcon,
  Plus,
  Trash2,
  Copy,
  Download,
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

  const copyTerminalOutput = () => {
    const text = activeTab.lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(text);
    addNotification('Terminal Copiado', 'Logs da sessão copiados para a área de transferência.', 'info');
  };

  const exportTerminalLogs = () => {
    const text = activeTab.lines.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watson-terminal-${activeTab.name}.log`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Logs Exportados', `Arquivo ${activeTab.name}.log salvo.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden font-mono text-xs">
      {/* Top Header & Tabs */}
      <div className="h-12 px-4 bg-[#090c13] border-b border-[#18202f] flex items-center justify-between select-none shrink-0">
        {/* Terminal Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {terminalTabs.map((tab) => {
            const isActive = tab.id === activeTerminalTabId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTerminalTabId(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all font-mono ${
                  isActive
                    ? 'bg-[#121927] text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)] font-bold'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#0e131d] border border-transparent'
                }`}
              >
                <TerminalIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}

          <button
            onClick={createTerminalTab}
            className="p-1.5 rounded-full hover:bg-[#121927] text-zinc-500 hover:text-white transition-colors"
            title="Nova Aba de Terminal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
          <button
            onClick={copyTerminalOutput}
            className="px-2.5 py-1 rounded-full bg-[#0f1422] hover:bg-[#182033] border border-[#1e2738] text-zinc-300 transition-colors flex items-center gap-1.5"
            title="Copiar logs"
          >
            <Copy className="w-3 h-3" />
            <span className="hidden sm:inline">Copiar</span>
          </button>

          <button
            onClick={exportTerminalLogs}
            className="px-2.5 py-1 rounded-full bg-[#0f1422] hover:bg-[#182033] border border-[#1e2738] text-zinc-300 transition-colors flex items-center gap-1.5"
            title="Exportar logs para arquivo"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          <button
            onClick={clearTerminal}
            className="px-2.5 py-1 rounded-full bg-[#0f1422] hover:bg-[#182033] border border-amber-500/30 text-amber-400 transition-colors flex items-center gap-1.5"
            title="Limpar terminal"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* Terminal Main Canvas */}
      <div
        className="flex-1 p-5 overflow-y-auto bg-[#040609] space-y-1.5 text-xs cursor-text select-text watson-grid-bg"
        onClick={() => inputRef.current?.focus()}
      >
        {activeTab.lines.map((line) => {
          let textStyle = 'text-zinc-300';
          if (line.type === 'command') textStyle = 'text-amber-300 font-bold';
          else if (line.type === 'success') textStyle = 'text-emerald-400 font-semibold';
          else if (line.type === 'warn') textStyle = 'text-amber-400';
          else if (line.type === 'error') textStyle = 'text-rose-400';
          else if (line.type === 'system') textStyle = 'text-cyan-400 font-mono';

          return (
            <div key={line.id} className="flex items-start gap-2.5 leading-relaxed font-mono">
              <span className="text-zinc-600 text-[10px] select-none pt-0.5 min-w-[55px]">
                {line.timestamp}
              </span>
              <pre className={`font-mono flex-1 whitespace-pre-wrap ${textStyle}`}>{line.text}</pre>
            </div>
          );
        })}

        {/* Active Command Input Line */}
        <div className="flex items-center gap-2 pt-3 text-xs font-mono">
          <span className="text-zinc-600 text-[10px] select-none min-w-[55px]">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-amber-400 font-bold select-none">
            watson@lab:{activeTab.cwd}$
          </span>
          <div className="flex-1 relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              className="w-full bg-transparent text-amber-200 focus:outline-none font-mono caret-amber-400 text-xs"
            />
          </div>
        </div>

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer Quick Commands Bar */}
      <div className="h-9 px-4 bg-[#090c13] border-t border-[#18202f] flex items-center justify-between text-[11px] text-zinc-500 select-none shrink-0 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Atalhos:</span>
          {['help', 'validate', 'build', 'ls', 'target test', 'analyze'].map((qCmd) => (
            <button
              key={qCmd}
              onClick={() => executeTerminalCommand(qCmd)}
              className="px-2 py-0.5 rounded-full bg-[#111624] hover:bg-[#1a2336] text-cyan-300 text-[10px] border border-cyan-800/40 transition-colors"
            >
              {qCmd}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 text-[10px]">
          <span className="text-amber-400 font-semibold">WATSON_CLI_V2.4</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400">ISOLADO</span>
        </div>
      </div>
    </div>
  );
};
