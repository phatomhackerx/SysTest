import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import { X, FolderPlus, Shield, Check } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { newProjectModalOpen, setNewProjectModalOpen, createProject, targets } = useWatson();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetId, setTargetId] = useState(targets[0]?.id || '');
  const [templatePreset, setTemplatePreset] = useState<'auth' | 'gateway' | 'cgroups'>('auth');

  if (!newProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name.trim(), description || 'Custom Watson Security Lab Project', targetId);
    setNewProjectModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0b0e15] border border-[#1a2232] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#18202f] bg-[#0e121a]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">NOVO PROJETO DE LABORATÓRIO</span>
          </div>
          <button
            onClick={() => setNewProjectModalOpen(false)}
            className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-[#18202f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 mb-1.5 font-medium">Nome de Código do Projeto:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: DRILL-PAYLOAD-AUDIT-V2"
              className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono text-xs uppercase"
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-1.5 font-medium">Descrição Operacional:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumo do escopo de simulação, defesas testadas e diretrizes de treino..."
              className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-1.5 font-medium">Alvo Designado do Lab:</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-400 text-xs font-mono"
            >
              {targets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.address}) — {t.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-300 mb-2 font-medium">Preset Inicial:</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTemplatePreset('auth')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  templatePreset === 'auth'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'border-[#1a2232] bg-[#07090f] text-zinc-400 hover:border-[#28364e]'
                }`}
              >
                <div className="font-bold text-xs text-white">Auth Drill</div>
                <div className="text-[10px] text-zinc-500 mt-1">Conscientização de credenciais</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplatePreset('gateway')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  templatePreset === 'gateway'
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'border-[#1a2232] bg-[#07090f] text-zinc-400 hover:border-[#28364e]'
                }`}
              >
                <div className="font-bold text-xs text-white">Gateway</div>
                <div className="text-[10px] text-zinc-500 mt-1">Filtro e regras de pacotes</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplatePreset('cgroups')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  templatePreset === 'cgroups'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'border-[#1a2232] bg-[#07090f] text-zinc-400 hover:border-[#28364e]'
                }`}
              >
                <div className="font-bold text-xs text-white">Isolamento</div>
                <div className="text-[10px] text-zinc-500 mt-1">Namespaces de kernel</div>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#07090f] border border-[#1a2232] text-[11px] text-zinc-400 flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>O workspace herdará regras estritas de sandbox airgapped (RFC-1122).</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#18202f]">
            <button
              type="button"
              onClick={() => setNewProjectModalOpen(false)}
              className="px-4 py-2 rounded-full bg-[#111624] hover:bg-[#1a2336] text-zinc-400 hover:text-white border border-[#1e2738] transition-colors text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] text-xs"
            >
              <Check className="w-4 h-4" />
              <span>Criar Projeto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
