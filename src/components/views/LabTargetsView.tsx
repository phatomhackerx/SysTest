import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Server,
  Radio,
  Power,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { LabTarget } from '../../types';

export const LabTargetsView: React.FC = () => {
  const { targets, activeTarget, setActiveTarget, toggleTargetStatus, pingTarget, addNotification } = useWatson();
  const [newTargetModal, setNewTargetModal] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<LabTarget['type']>('LOCAL SANDBOX');

  return (
    <div className="flex-1 flex flex-col h-full watson-grid-bg bg-black overflow-y-auto p-4 sm:p-6 lg:p-8 font-sans text-zinc-300 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#090c13] border border-[#1a2232] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase font-mono">GERENCIADOR DE ALVOS LAB</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-semibold">
              NODES SINTÉTICOS
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1.5 font-sans">
            Ambientes de teste virtuais autorizados e nós de sandbox isolados (airgapped) para treinamentos e simulações.
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono">
          <button
            onClick={() => pingTarget(activeTarget.id)}
            className="px-3.5 py-2 rounded-full bg-[#111724] hover:bg-[#1a2336] border border-cyan-800/40 text-cyan-300 flex items-center gap-2 text-xs transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ping Ativo ({activeTarget.name})</span>
          </button>
          <button
            onClick={() => setNewTargetModal(true)}
            className="px-4 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Nó</span>
          </button>
        </div>
      </div>

      {/* Target Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {targets.map((tgt) => {
          const isActive = tgt.id === activeTarget.id;
          const isOnline = tgt.status === 'ONLINE';

          return (
            <div
              key={tgt.id}
              className={`bg-[#0b0e15] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'border-cyan-500/50 bg-[#0d131f] shadow-[0_0_20px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/30'
                  : 'border-[#1a2232] hover:border-[#28354c]'
              }`}
            >
              {/* Top Node Header */}
              <div>
                <div className="flex items-start justify-between pb-3 mb-3 border-b border-[#18202e]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white tracking-wide">{tgt.name}</span>
                      {isActive && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                          ALVO ATIVO
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-400 font-medium font-mono mt-0.5">{tgt.type}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold font-mono flex items-center gap-1.5 ${
                        isOnline
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                        }`}
                      />
                      {tgt.status}
                    </span>
                  </div>
                </div>

                {/* Target Parameters */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Endereço / Host:</span>
                    <span className="text-cyan-300 font-semibold">{tgt.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Última Conexão:</span>
                    <span className="text-zinc-300">{tgt.lastConnection}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Latência:</span>
                    <span className={isOnline ? 'text-emerald-400 font-semibold' : 'text-zinc-600'}>
                      {isOnline ? `${tgt.latencyMs || 1} ms` : 'Inacessível'}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block mb-1">Ambiente de Execução:</span>
                    <div className="p-2 bg-[#07090f] border border-[#161d2b] rounded-xl text-zinc-300 text-xs">
                      {tgt.environment}
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-500 block mb-1">Notas de Segurança:</span>
                    <div className="p-2 bg-[#07090f] border border-[#161d2b] rounded-xl text-zinc-400 text-xs leading-relaxed">
                      {tgt.notes}
                    </div>
                  </div>

                  {tgt.openPorts.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-zinc-500 text-[10px]">Portas Abertas:</span>
                      {tgt.openPorts.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-[#101724] text-cyan-300 border border-cyan-800/40"
                        >
                          :{p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions for Target */}
              <div className="pt-4 mt-4 border-t border-[#18202e] flex items-center justify-between gap-2 font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => pingTarget(tgt.id)}
                    className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2334] text-cyan-300 border border-cyan-800/40 text-xs transition-colors flex items-center gap-1"
                  >
                    <Radio className="w-3 h-3" />
                    <span>Ping</span>
                  </button>

                  <button
                    onClick={() => toggleTargetStatus(tgt.id)}
                    className="px-3 py-1.5 rounded-full bg-[#121722] hover:bg-[#1a2334] text-zinc-300 border border-zinc-700/40 text-xs transition-colors flex items-center gap-1"
                  >
                    <Power className="w-3 h-3 text-amber-400" />
                    <span>Alternar Estado</span>
                  </button>
                </div>

                {!isActive ? (
                  <button
                    onClick={() => setActiveTarget(tgt)}
                    className="px-3.5 py-1.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all shadow-sm font-sans"
                  >
                    Vincular ao Projeto
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Vinculado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Target Modal */}
      {newTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0c1018] border border-[#222c3e] rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 font-sans text-xs">
            <h3 className="text-sm font-bold text-white uppercase font-mono">ADICIONAR NÓ DE TESTE LAB</h3>
            <p className="text-zinc-400">Insira as configurações do sandbox virtual isolado.</p>

            <div className="space-y-3 font-mono">
              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">Nome do Nó:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: LAB-SRV-WIN11-02"
                  className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">Endereço Loopback / Host:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ex: 127.0.0.1:8088"
                  className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">Tipo de Ambiente:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as LabTarget['type'])}
                  className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="LOCAL SANDBOX">LOCAL SANDBOX</option>
                  <option value="TRAINING VM">TRAINING VM</option>
                  <option value="TEST ENVIRONMENT">TEST ENVIRONMENT</option>
                  <option value="CTF DRILL NODE">CTF DRILL NODE</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1e2738]">
              <button
                onClick={() => setNewTargetModal(false)}
                className="px-4 py-2 rounded-full bg-[#121722] hover:bg-[#1a2232] text-zinc-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (name.trim()) {
                    targets.push({
                      id: 'lab-target-' + Date.now(),
                      name: name.trim().toUpperCase(),
                      address: address.trim() || '127.0.0.1:9090',
                      type,
                      status: 'ONLINE',
                      lastConnection: 'Agora mesmo',
                      environment: 'Isolated Local Drill VM',
                      notes: 'Nó configurado para simulações de laboratório.',
                      latencyMs: 2,
                      openPorts: [8080],
                    });
                    addNotification('Nó Adicionado', `Nó ${name} configurado no laboratório.`, 'success');
                    setNewTargetModal(false);
                    setName('');
                    setAddress('');
                  }
                }}
                className="px-4 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold transition-all shadow-md"
              >
                Salvar Nó
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
