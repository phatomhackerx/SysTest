import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Sliders,
  Shield,
  Terminal,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { addNotification } = useWatson();
  const [airgapStrict, setAirgapStrict] = useState(true);
  const [memoryLimit, setMemoryLimit] = useState('512MB');
  const [fontFamily, setFontFamily] = useState('Fira Code');
  const [themeDensity, setThemeDensity] = useState('Compact (Kali Style)');
  const [syntheticSink, setSyntheticSink] = useState('127.0.0.1:8888');

  const handleSave = () => {
    addNotification('Configurações Salvas', 'Parâmetros do ambiente de laboratório atualizados.', 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full watson-grid-bg bg-black overflow-y-auto p-4 sm:p-6 lg:p-8 font-sans text-zinc-300 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#090c13] border border-[#1a2232] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase font-mono">CONFIGURAÇÕES DO TOOLKIT</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono font-semibold">
              WATSON SYSTEM CORE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1.5 font-sans">
            Parâmetros globais de segurança, controles de contenção em sandbox, emulação de terminal e preferências de ambiente.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] font-mono"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sandbox Containment Section */}
        <div className="p-6 rounded-2xl bg-[#0b0e15] border border-[#1a2232] space-y-4 shadow-md">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#18202e] text-amber-400 font-bold font-mono text-xs">
            <Shield className="w-4 h-4" />
            <span>CONTROLES DE SANDBOX & CONFINAMENTO</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#151c2a]">
            <div>
              <div className="text-white font-medium text-xs">Isolamento Estrito Airgap</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Força todo o tráfego de rede via RFC-1122 local loopback.</div>
            </div>
            <input
              type="checkbox"
              checked={airgapStrict}
              onChange={(e) => setAirgapStrict(e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 pt-1 font-mono">
            <label className="text-zinc-300 font-medium block text-xs">Limite de Memória do Container (cgroup):</label>
            <div className="text-[11px] text-zinc-500 font-sans mb-1">Trava o consumo máximo de RAM do kernel para as tarefas de simulação.</div>
            <select
              value={memoryLimit}
              onChange={(e) => setMemoryLimit(e.target.value)}
              className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="256MB">256 MB (Mínimo)</option>
              <option value="512MB">512 MB (Padrão Lab)</option>
              <option value="1024MB">1024 MB (CTF Expandido)</option>
            </select>
          </div>

          <div className="space-y-1.5 pt-1 font-mono">
            <label className="text-zinc-300 font-medium block text-xs">Endereço Sink de Telemetria Local:</label>
            <input
              type="text"
              value={syntheticSink}
              onChange={(e) => setSyntheticSink(e.target.value)}
              className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Interface & Terminal Emulation */}
        <div className="p-6 rounded-2xl bg-[#0b0e15] border border-[#1a2232] space-y-4 shadow-md">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#18202e] text-cyan-400 font-bold font-mono text-xs">
            <Terminal className="w-4 h-4" />
            <span>EMULAÇÃO DE TERMINAL & DISPLAY</span>
          </div>

          <div className="space-y-1.5 font-mono">
            <label className="text-zinc-300 font-medium block text-xs">Tipografia Monospaçada:</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
            >
              <option value="Fira Code">Fira Code (Ligatures Ativas)</option>
              <option value="JetBrains Mono">JetBrains Mono</option>
              <option value="Source Code Pro">Source Code Pro</option>
            </select>
          </div>

          <div className="space-y-1.5 font-mono">
            <label className="text-zinc-300 font-medium block text-xs">Densidade de Layout:</label>
            <select
              value={themeDensity}
              onChange={(e) => setThemeDensity(e.target.value)}
              className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
            >
              <option value="Compact (Kali Style)">Compacto (Estilo Profissional Kali Linux)</option>
              <option value="Comfortable">Confortável</option>
            </select>
          </div>

          <div className="p-4 bg-[#07090f] border border-[#1a2232] rounded-xl text-xs text-zinc-400 space-y-1.5 mt-2">
            <div className="text-emerald-400 font-bold flex items-center gap-2 font-mono">
              <Lock className="w-4 h-4" />
              <span>POLÍTICA ÉTICA DE LABORATÓRIO ATIVA</span>
            </div>
            <p className="leading-relaxed">
              O Watson Security Toolkit opera estritamente sob contenção de sandbox segura. Sondas não sintéticas, alvos reais não autorizados ou payloads perigosos são desativados por design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
