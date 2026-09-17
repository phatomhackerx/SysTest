import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Server,
  Radio,
  Plus,
  Terminal,
  CheckCircle2,
  Trash2,
  Search,
  Check,
  Shield,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { LabTarget } from '../../types';

export const LabTargetsView: React.FC = () => {
  const {
    targets,
    activeTarget,
    setActiveTarget,
    pingTarget,
    addNotification,
    setActiveView,
    setBottomDock,
  } = useWatson();

  const [targetList, setTargetList] = useState<LabTarget[]>([
    {
      id: 'tgt-ubuntu',
      name: 'LAB-UBUNTU-01',
      type: 'TRAINING VM',
      address: '192.168.10.101',
      status: 'ONLINE',
      lastConnection: 'Hoje, 14:32',
      latencyMs: 1.8,
      environment: 'Ubuntu 24.04 LTS (Airgapped)',
      notes: 'Estação de testes principal para simulações',
      openPorts: [22, 80],
    },
    {
      id: 'tgt-win',
      name: 'LAB-WIN-SANDBOX',
      type: 'TEST ENVIRONMENT',
      address: '192.168.10.105',
      status: 'IDLE',
      lastConnection: 'Hoje, 11:20',
      latencyMs: 3.4,
      environment: 'Windows Server 2022 Isolado',
      notes: 'Sandbox com hyper-v isolado',
      openPorts: [3389, 445],
    },
    {
      id: 'tgt-docker',
      name: 'LAB-DOCKER-NODE',
      type: 'LOCAL SANDBOX',
      address: '127.0.0.1:8888',
      status: 'ONLINE',
      lastConnection: 'Há 5 minutos',
      latencyMs: 0.9,
      environment: 'Docker Engine 26.0 (cgroups v2)',
      notes: 'Confinamento de namespaces loopback',
      openPorts: [8888],
    },
    {
      id: 'tgt-api',
      name: 'LAB-API-GATEWAY',
      type: 'CTF DRILL NODE',
      address: '10.0.0.45:8443',
      status: 'ONLINE',
      lastConnection: 'Hoje, 09:15',
      latencyMs: 2.1,
      environment: 'Kong API Gateway Sandbox',
      notes: 'Roteamento seguro de payloads',
      openPorts: [8443, 8000],
    },
    {
      id: 'tgt-web',
      name: 'LAB-WEB-SERVER',
      type: 'TEST ENVIRONMENT',
      address: '192.168.10.200',
      status: 'OFFLINE',
      lastConnection: 'Ontem, 18:40',
      latencyMs: 0,
      environment: 'Nginx Reverse Proxy',
      notes: 'Servidor de mock para testes web',
      openPorts: [],
    },
  ]);

  const [newTargetModal, setNewTargetModal] = useState(false);
  const [inspectTarget, setInspectTarget] = useState<LabTarget | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Linux');
  const [newHost, setNewHost] = useState('');

  const handlePing = (id: string, name: string) => {
    pingTarget(id);
    setTargetList((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, latencyMs: Number((Math.random() * 3 + 0.8).toFixed(1)) } : t
      )
    );
    addNotification('Ping de Alvo', `ICMP echo para ${name} respondido com sucesso.`, 'info');
  };

  const handleConnectTerminal = (target: LabTarget) => {
    setActiveTarget(target);
    setBottomDock({ isOpen: true, activeTab: 'terminal' });
    setActiveView('terminal');
    addNotification('Sessão Conectada', `Terminal SSH vinculado ao alvo ${target.name} (${target.address})`, 'success');
  };

  const handleSetActive = (target: LabTarget) => {
    setActiveTarget(target);
    addNotification('Alvo Definido', `${target.name} é o alvo operacional ativo do laboratório.`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    setTargetList((prev) => prev.filter((t) => t.id !== id));
    addNotification('Alvo Removido', `O alvo ${name} foi desconectado do catálogo.`, 'info');
  };

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newHost.trim()) return;

    const newT: LabTarget = {
      id: `tgt-${Date.now()}`,
      name: newName.trim(),
      type: (newType as any) || 'LOCAL SANDBOX',
      address: newHost.trim(),
      status: 'ONLINE',
      lastConnection: 'Agora mesmo',
      latencyMs: 1.2,
      environment: 'Laboratório Confinado',
      notes: 'Nó registrado manualmente pelo operador',
      openPorts: [22, 80],
    };

    setTargetList((prev) => [newT, ...prev]);
    setNewName('');
    setNewHost('');
    setNewTargetModal(false);
    addNotification('Alvo Cadastrado', `${newT.name} adicionado ao inventário do laboratório.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#040609] overflow-y-auto p-4 sm:p-6 lg:p-7 font-mono text-zinc-300 space-y-5 select-none">
      {/* Header Banner */}
      <div className="bg-[#080c14] border border-[#162030] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">
              [LAB TARGET MANAGER]
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-xs font-sans">Nós e hosts de testes controlados</span>
          </div>
          <h1 className="text-lg font-black text-white tracking-wide uppercase mt-1">
            Gerenciador de Alvos de Laboratório
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Cadastre estações locais, sandboxes confinados e servidores de teste com isolamento total airgapped.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => handlePing(activeTarget.id, activeTarget.name)}
            className="px-3 py-1.5 rounded bg-[#0c121c] hover:bg-[#141e2e] border border-cyan-800/40 text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ping Alvo Ativo ({activeTarget.name})</span>
          </button>

          <button
            onClick={() => setNewTargetModal(true)}
            className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>CADASTRAR ALVO</span>
          </button>
        </div>
      </div>

      {/* Real Targets Table */}
      <div className="bg-[#070a10] border border-[#162030] rounded-xl overflow-hidden shadow-lg">
        <div className="p-3 bg-[#090d14] border-b border-[#141b27] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              INVENTÁRIO DE ALVOS CONECTADOS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#101726] text-cyan-300 border border-cyan-800/40">
              {targetList.length} HOSTS
            </span>
          </div>

          <div className="text-[11px] text-zinc-500">
            Alvo em execução:{' '}
            <strong className="text-amber-400">{activeTarget.name}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#05070c] border-b border-[#141b27] text-zinc-500 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">NOME DO ALVO</th>
                <th className="py-2.5 px-3">TIPO</th>
                <th className="py-2.5 px-3">IP / HOST</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">LATÊNCIA</th>
                <th className="py-2.5 px-3">ÚLTIMO CHECK</th>
                <th className="py-2.5 px-3 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#101622]">
              {targetList.map((tgt) => {
                const isActive = tgt.id === activeTarget.id || tgt.name === activeTarget.name;
                const isOnline = tgt.status === 'ONLINE';

                let statusColor = 'bg-zinc-800 text-zinc-400 border-zinc-700';
                if (tgt.status === 'ONLINE') statusColor = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50';
                else if (tgt.status === ('CONFINADO' as any)) statusColor = 'bg-cyan-950/40 text-cyan-400 border-cyan-800/50';
                else if (tgt.status === ('BUSY' as any)) statusColor = 'bg-amber-950/40 text-amber-400 border-amber-800/50';
                else if (tgt.status === 'OFFLINE') statusColor = 'bg-rose-950/40 text-rose-400 border-rose-800/50';

                return (
                  <tr
                    key={tgt.id}
                    className={`transition-colors ${
                      isActive ? 'bg-[#0e1624]/70 text-white' : 'hover:bg-[#090d15] text-zinc-300'
                    }`}
                  >
                    {/* Nome do Alvo */}
                    <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-amber-400 ring-2 ring-amber-400/40' : isOnline ? 'bg-emerald-400' : 'bg-zinc-600'
                        }`}
                      />
                      <span className="font-mono text-white">{tgt.name}</span>
                      {isActive && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                          ATIVO
                        </span>
                      )}
                    </td>

                    {/* Tipo */}
                    <td className="py-2.5 px-3 text-amber-400/90 font-mono text-[11px]">
                      {tgt.type}
                    </td>

                    {/* IP/Host */}
                    <td className="py-2.5 px-3 text-cyan-300 font-mono text-[11px]">
                      {tgt.address}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${statusColor}`}>
                        {tgt.status}
                      </span>
                    </td>

                    {/* Latência */}
                    <td className="py-2.5 px-3 text-[11px] font-mono">
                      {tgt.latencyMs ? (
                        <span className="text-emerald-400 font-bold">{tgt.latencyMs} ms</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Último Check */}
                    <td className="py-2.5 px-3 text-zinc-400 text-[11px] font-mono">
                      {tgt.lastConnection}
                    </td>

                    {/* AÇÕES: Ping, Conectar Terminal, Definir como Alvo Ativo, Inspecionar Portas, Remover */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ping */}
                        <button
                          onClick={() => handlePing(tgt.id, tgt.name)}
                          className="p-1 rounded bg-[#0c121c] hover:bg-[#152030] text-cyan-400 border border-cyan-800/40 transition-colors"
                          title="Ping ICMP"
                        >
                          <Radio className="w-3.5 h-3.5" />
                        </button>

                        {/* Conectar Terminal */}
                        <button
                          onClick={() => handleConnectTerminal(tgt)}
                          className="p-1 rounded bg-[#0c121c] hover:bg-[#152030] text-emerald-400 border border-emerald-800/40 transition-colors"
                          title="Conectar Terminal Kali"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                        </button>

                        {/* Inspecionar Portas */}
                        <button
                          onClick={() => setInspectTarget(tgt)}
                          className="px-2 py-1 rounded bg-[#0c121c] hover:bg-[#152030] text-zinc-300 hover:text-white border border-[#1a2538] transition-colors text-[10px]"
                          title="Inspecionar Portas e Serviços"
                        >
                          Portas
                        </button>

                        {/* Definir como Alvo Ativo */}
                        <button
                          onClick={() => handleSetActive(tgt)}
                          disabled={isActive}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            isActive
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                              : 'bg-amber-500 hover:bg-amber-400 text-black shadow-sm'
                          }`}
                        >
                          {isActive ? 'SELECIONADO' : 'ATIVAR'}
                        </button>

                        {/* Remover */}
                        <button
                          onClick={() => handleDelete(tgt.id, tgt.name)}
                          className="p-1 rounded bg-[#0c121c] hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 border border-transparent hover:border-rose-800/40 transition-colors"
                          title="Remover alvo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Port Inspection Modal */}
      {inspectTarget && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0f17] border border-[#1e2a3c] rounded-xl p-5 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#182234]">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Inspeção de Portas</span>
                <h3 className="text-sm font-bold text-white font-mono">{inspectTarget.name} ({inspectTarget.address})</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                SANDBOX SCAN
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#07090e] border border-[#162030] flex items-center justify-between">
                <div>
                  <span className="font-bold text-cyan-400">Porta 22/tcp</span>
                  <div className="text-[10px] text-zinc-500">OpenSSH 9.6p1 (Ubuntu)</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">ABERTA</span>
              </div>

              <div className="p-2.5 rounded bg-[#07090e] border border-[#162030] flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-400">Porta 80/tcp</span>
                  <div className="text-[10px] text-zinc-500">nginx/1.24.0 (Sandbox Proxy)</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">ABERTA</span>
              </div>

              <div className="p-2.5 rounded bg-[#07090e] border border-[#162030] flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-400">Porta 8888/tcp</span>
                  <div className="text-[10px] text-zinc-500">SysTest Agent Mock Loopback</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">FILTRADA</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#182234]">
              <button
                onClick={() => setInspectTarget(null)}
                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cadastrar Alvo Modal */}
      {newTargetModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateTarget}
            className="bg-[#0b0f17] border border-[#1e2a3c] rounded-xl p-5 w-full max-w-md space-y-4 shadow-2xl"
          >
            <div className="pb-3 border-b border-[#182234]">
              <h3 className="text-sm font-bold text-white uppercase font-mono">Cadastrar Alvo no Laboratório</h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Defina os parâmetros do host de simulação no ambiente airgapped.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                  Nome do Alvo:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ex: LAB-DOCKER-NODE-02"
                  className="w-full bg-[#07090e] border border-[#1a2538] rounded p-2 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                  Tipo:
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-[#07090e] border border-[#1a2538] rounded p-2 text-zinc-200"
                >
                  <option value="Linux">Linux</option>
                  <option value="Windows">Windows</option>
                  <option value="Container">Container</option>
                  <option value="API">API</option>
                  <option value="Web Server">Web Server</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                  Endereço IP ou Hostname:
                </label>
                <input
                  type="text"
                  value={newHost}
                  onChange={(e) => setNewHost(e.target.value)}
                  placeholder="ex: 192.168.10.120 ou 127.0.0.1:9090"
                  className="w-full bg-[#07090e] border border-[#1a2538] rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#182234]">
              <button
                type="button"
                onClick={() => setNewTargetModal(false)}
                className="px-3 py-1.5 rounded bg-[#131924] text-zinc-400 hover:text-white text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
              >
                Cadastrar Alvo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
