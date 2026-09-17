import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Clock,
  Square,
  Trash2,
  Download,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { LabSession } from '../../types';

export const SessionsView: React.FC = () => {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    stopSession,
    deleteSession,
    activeProject,
    activeTarget,
    addNotification,
  } = useWatson();

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleSpawnSession = () => {
    const id = 'SESS-' + Math.floor(1000 + Math.random() * 9000);
    const newSess: LabSession = {
      id,
      projectId: activeProject.id,
      targetId: activeTarget.id,
      started: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      duration: '00:00:01',
      status: 'ACTIVE',
      events: [
        {
          id: 'ev-new-1',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'INIT',
          message: `Watson session initialized for ${activeProject.name} -> ${activeTarget.name}`,
          severity: 'info',
        },
      ],
    };
    sessions.unshift(newSess);
    setActiveSessionId(id);
    addNotification('Sessão Iniciada', `Sessão de laboratório ${id} registrada.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full watson-grid-bg bg-black overflow-hidden font-sans text-zinc-300">
      {/* Top Banner */}
      <div className="h-16 px-6 border-b border-[#18202f] bg-[#090c13] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-wide font-mono uppercase">SESSÕES DE LABORATÓRIO</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-semibold">
                {sessions.length} GRAVAÇÕES
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Rastreabilidade, telemetria de conexões e trilhas de auditoria para treinos.</p>
          </div>
        </div>

        <button
          onClick={handleSpawnSession}
          className="px-4 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] font-mono"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Iniciar Nova Sessão</span>
        </button>
      </div>

      {/* Main 2-Pane: Table + Event Timeline */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT: Sessions Table */}
        <div className="flex-1 overflow-y-auto p-5 border-r border-[#18202f] space-y-4">
          <div className="border border-[#18202f] rounded-2xl overflow-hidden bg-[#090c13] shadow-md font-mono">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0e131d] border-b border-[#18202f] text-[10px] text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">ID Sessão</th>
                  <th className="py-3 px-4">Projeto</th>
                  <th className="py-3 px-4">Alvo</th>
                  <th className="py-3 px-4">Início</th>
                  <th className="py-3 px-4">Duração</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c2a]">
                {sessions.map((sess) => {
                  const isSelected = sess.id === activeSessionId;
                  return (
                    <tr
                      key={sess.id}
                      onClick={() => setActiveSessionId(sess.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#111724]' : 'hover:bg-[#0c1018]'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            sess.status === 'ACTIVE'
                              ? 'bg-emerald-400 animate-pulse'
                              : sess.status === 'PAUSED'
                              ? 'bg-amber-400'
                              : 'bg-zinc-600'
                          }`}
                        />
                        <span>{sess.id}</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">{sess.projectId}</td>
                      <td className="py-3 px-4 text-cyan-300 font-semibold">{sess.targetId}</td>
                      <td className="py-3 px-4 text-zinc-500 text-[11px]">{sess.started}</td>
                      <td className="py-3 px-4 text-zinc-300">{sess.duration}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                            sess.status === 'ACTIVE'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : sess.status === 'PAUSED'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {sess.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {sess.status === 'ACTIVE' && (
                            <button
                              onClick={() => stopSession(sess.id)}
                              className="p-1.5 rounded-lg hover:bg-[#1a2334] text-amber-400"
                              title="Pausar Sessão"
                            >
                              <Square className="w-3.5 h-3.5 fill-amber-400/20" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const text = JSON.stringify(sess, null, 2);
                              const blob = new Blob([text], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${sess.id}-report.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                              addNotification('Exportado', `Log de eventos de ${sess.id} exportado.`, 'success');
                            }}
                            className="p-1.5 rounded-lg hover:bg-[#1a2334] text-cyan-400"
                            title="Exportar Trilha de Auditoria"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSession(sess.id)}
                            className="p-1.5 rounded-lg hover:bg-[#1a2334] text-rose-400"
                            title="Remover Sessão"
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

        {/* RIGHT: Session Event Timeline */}
        <div className="w-96 bg-[#080b12] border-l border-[#18202f] flex flex-col shrink-0">
          <div className="px-5 py-3.5 border-b border-[#18202f] bg-[#0c1018] flex items-center justify-between">
            <span className="font-bold text-xs text-white tracking-wide font-mono uppercase">LINHA DO TEMPO DE EVENTOS</span>
            {activeSession && (
              <span className="text-[11px] text-amber-400 font-mono font-semibold">[{activeSession.id}]</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
            {activeSession && activeSession.events.length > 0 ? (
              activeSession.events.map((ev) => {
                let icon = <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
                if (ev.severity === 'success') {
                  icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
                } else if (ev.severity === 'warn') {
                  icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
                }

                return (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-[#0e131e] border border-[#1a2232] text-xs space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        {icon}
                        <span className="font-semibold text-white">[{ev.type}]</span>
                      </div>
                      <span>{ev.timestamp}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{ev.message}</p>
                  </div>
                );
              })
            ) : (
              <div className="text-zinc-600 text-center p-8 text-xs font-sans">Nenhum evento registrado nesta sessão.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
