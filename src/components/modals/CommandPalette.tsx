import React, { useState, useEffect, useRef } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Search,
  Terminal,
  FolderTree,
  FileCode,
  Layers,
  Activity,
  Play,
  CheckCircle,
  Cpu,
  Settings,
  Server,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveView,
    runValidation,
    runBuild,
    runPreview,
    runAnalysis,
    runExport,
    projects,
    setActiveProject,
    targets,
    pingTarget,
  } = useWatson();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const commands: CommandItem[] = [
    {
      id: 'goto-corp-search',
      title: 'Navegar: Investigação Corporativa (CNPJ / Sócios)',
      category: 'Navegação',
      icon: <Search className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveView('corporate-search');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G C',
    },
    {
      id: 'goto-dashboard',
      title: 'Navegar: Dashboard (Hub de Operações)',
      category: 'Navegação',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveView('dashboard');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G D',
    },
    {
      id: 'goto-file-builder',
      title: 'Navegar: File Builder IDE & Inspetor',
      category: 'Navegação',
      icon: <FileCode className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveView('file-builder');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G F',
    },
    {
      id: 'goto-template-builder',
      title: 'Navegar: Template Builder (Compositor Visual)',
      category: 'Navegação',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActiveView('template-builder');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G T',
    },
    {
      id: 'goto-workflow',
      title: 'Navegar: Workflow Builder (Grafo de Nós)',
      category: 'Navegação',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActiveView('workflow');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G W',
    },
    {
      id: 'goto-terminal',
      title: 'Navegar: Terminal Kali (Sandbox CLI)',
      category: 'Navegação',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setActiveView('terminal');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G K',
    },
    {
      id: 'goto-lab-targets',
      title: 'Navegar: Alvos do Lab (Contêineres e Sinks)',
      category: 'Navegação',
      icon: <Server className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setActiveView('lab-targets');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G L',
    },
    {
      id: 'goto-projects',
      title: 'Navegar: Gerenciador de Projetos',
      category: 'Navegação',
      icon: <FolderTree className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveView('projects');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G P',
    },
    {
      id: 'goto-settings',
      title: 'Navegar: Configurações do Sistema Watson',
      category: 'Navegação',
      icon: <Settings className="w-4 h-4 text-zinc-400" />,
      action: () => {
        setActiveView('settings');
        setCommandPaletteOpen(false);
      },
      shortcut: 'G S',
    },
    {
      id: 'run-validation',
      title: 'Pipeline: Executar Validação de Segurança',
      category: 'Pipeline',
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      action: () => {
        runValidation();
        setCommandPaletteOpen(false);
      },
      shortcut: 'P V',
    },
    {
      id: 'run-build',
      title: 'Pipeline: Compilar Artefato Sandbox',
      category: 'Pipeline',
      icon: <Play className="w-4 h-4 text-amber-400" />,
      action: () => {
        runBuild();
        setCommandPaletteOpen(false);
      },
      shortcut: 'P B',
    },
    {
      id: 'run-preview',
      title: 'Pipeline: Abrir Preview do Sandbox',
      category: 'Pipeline',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      action: () => {
        runPreview();
        setCommandPaletteOpen(false);
      },
      shortcut: 'P P',
    },
    {
      id: 'run-analysis',
      title: 'Pipeline: Disparar Análise AST & Entropia',
      category: 'Pipeline',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      action: () => {
        runAnalysis();
        setCommandPaletteOpen(false);
      },
      shortcut: 'P A',
    },
    {
      id: 'run-export',
      title: 'Pipeline: Exportar Pacote de Laboratório',
      category: 'Pipeline',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      action: () => {
        runExport();
        setCommandPaletteOpen(false);
      },
      shortcut: 'P E',
    },
    ...projects.map((p) => ({
      id: `switch-proj-${p.id}`,
      title: `Alternar Projeto: ${p.name}`,
      category: 'Projetos',
      icon: <FolderTree className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveProject(p);
        setCommandPaletteOpen(false);
      },
    })),
    ...targets.map((t) => ({
      id: `ping-target-${t.id}`,
      title: `Testar Conexão (Ping): ${t.name} (${t.address})`,
      category: 'Alvos do Lab',
      icon: <Server className="w-4 h-4 text-emerald-400" />,
      action: () => {
        pingTarget(t.id);
        setCommandPaletteOpen(false);
      },
    })),
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase()),
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0b0e15] border border-[#1a2232] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col font-sans">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#18202f] bg-[#0e121a]">
          <Search className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite um comando, visualização ou ação de pipeline... (ex: build, cnpj, target)"
            className="w-full bg-transparent text-xs text-white focus:outline-none font-mono placeholder:text-zinc-500"
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#141b27] text-zinc-400 border border-[#1e2738]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 font-mono">
              Nenhum comando ou ação encontrado.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all font-mono text-xs ${
                    isSelected
                      ? 'bg-[#141c2b] border border-amber-500/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.1)] font-semibold'
                      : 'text-zinc-300 hover:bg-[#0f1420] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 px-2 py-0.5 rounded-full bg-[#07090f] border border-[#151c2a]">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <kbd className="text-[10px] text-amber-400/90 px-1.5 py-0.5 rounded bg-[#101724] border border-[#1e2738]">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#18202f] bg-[#0e121a] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>Navegar <kbd className="text-zinc-300">↑</kbd> <kbd className="text-zinc-300">↓</kbd></span>
            <span>Executar <kbd className="text-zinc-300">↵</kbd></span>
          </div>
          <span className="text-amber-400/90 font-bold">WATSON COMMAND PALETTE</span>
        </div>
      </div>
    </div>
  );
};
