import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Clock,
  Play,
  Square,
  Download,
  Plus,
  Terminal,
  FileCode,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface DetailedSession {
  id: string;
  project: string;
  target: string;
  started: string;
  duration: string;
  status: 'RUNNING' | 'FINISHED' | 'TERMINATED';
  commands: string[];
  logs: { timestamp: string; text: string; level: 'info' | 'warn' | 'success' | 'error' }[];
  modifiedFiles: string[];
}

export const SessionsView: React.FC = () => {
  const { activeProject, activeTarget, addNotification } = useWatson();

  const [sessionList, setSessionList] = useState<DetailedSession[]>([
    {
      id: 'SESS-8421',
      project: 'DRILL-ALPHA-RECON',
      target: 'LAB-UBUNTU-01 (192.168.10.101)',
      started: '14:22:10 UTC',
      duration: '00:18:42',
      status: 'RUNNING',
      commands: [
        'systest target set tgt-ubuntu',
        'ping 192.168.10.101',
        'systest validate --strict',
        'systest run --mode=confinement',
      ],
      logs: [
        { timestamp: '14:22:10', text: '[INIT] Sessão alocada em namespace de sandbox cgroups_v2.', level: 'info' },
        { timestamp: '14:22:15', text: '[NET] Handshake TCP efetuado com 192.168.10.101:22.', level: 'info' },
        { timestamp: '14:25:30', text: '[AUDIT] Validação sintática AST concluída sem violações.', level: 'success' },
        { timestamp: '14:32:00', text: '[WARN] Resposta de latência oscilou para 4.8ms.', level: 'warn' },
        { timestamp: '14:40:52', text: '[EXEC] Payload simulado operando em loopback.', level: 'info' },
      ],
      modifiedFiles: [
        '/scripts/recon_probe.sh',
        '/configs/network_policy.json',
        '/output/report_alpha.json',
      ],
    },
    {
      id: 'SESS-7934',
      project: 'AWARENESS-CAMPAIGN-04',
      target: 'LAB-WIN-SANDBOX (192.168.10.105)',
      started: '11:10:04 UTC',
      duration: '00:45:10',
      status: 'FINISHED',
      commands: [
        'systest build',
        'systest scan',
        'systest export --target=LAB-WIN-SANDBOX',
      ],
      logs: [
        { timestamp: '11:10:04', text: '[INIT] Ambiente isolado instanciado.', level: 'info' },
        { timestamp: '11:15:22', text: '[SCAN] 4 achados remediados automaticamente.', level: 'success' },
        { timestamp: '11:55:14', text: '[END] Execução finalizada com código 0 (sucesso).', level: 'success' },
      ],
      modifiedFiles: [
        '/templates/credentials_reset.html',
        '/manifest.json',
      ],
    },
    {
      id: 'SESS-6120',
      project: 'SANDBOX-STRESS-TEST',
      target: 'LAB-DOCKER-NODE (127.0.0.1:8888)',
      started: '09:05:40 UTC',
      duration: '00:04:15',
      status: 'TERMINATED',
      commands: [
        'systest run --unconfined-check',
      ],
      logs: [
        { timestamp: '09:05:40', text: '[INIT] Inicialização sob monitoramento estrito.', level: 'info' },
        { timestamp: '09:09:55', text: '[ABORT] Sinal SIGTERM recebido do operador.', level: 'warn' },
      ],
      modifiedFiles: [
        '/configs/stress_test.yaml',
      ],
    },
  ]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>('SESS-8421');
  const [replaying, setReplaying] = useState(false);

  const selectedSession = sessionList.find((s) => s.id === selectedSessionId) || sessionList[0];

  // Iniciar Nova Sessão
  const handleSpawnNewSession = () => {
    const newId = 'SESS-' + Math.floor(1000 + Math.random() * 9000);
    const newSess: DetailedSession = {
      id: newId,
      project: activeProject.name,
      target: `${activeTarget.name} (${activeTarget.address})`,
      started: new Date().toLocaleTimeString() + ' UTC',
      duration: '00:00:01',
      status: 'RUNNING',
      commands: ['systest validate', 'systest run'],
      logs: [
        { timestamp: new Date().toLocaleTimeString(), text: `[INIT] Sessão ${newId} criada para ${activeProject.name}.`, level: 'info' },
      ],
      modifiedFiles: ['/manifest.json', '/scripts/main.sh'],
    };
    setSessionList([newSess, ...sessionList]);
    setSelectedSessionId(newId);
    addNotification('Sessão Criada', `Nova sessão de auditoria ${newId} iniciada.`, 'success');
  };

  // Ação: Replay da Sessão
  const handleReplaySession = () => {
    setReplaying(true);
    addNotification('Replay Iniciado', `Reproduzindo sequência de comandos da sessão ${selectedSession.id}...`, 'info');
    setTimeout(() => {
      setReplaying(false);
      addNotification('Replay Concluído', `Todos os passos da sessão ${selectedSession.id} foram simulados com êxito.`, 'success');
    }, 1500);
  };

  // Ação: Encerrar Sessão
  const handleTerminateSession = () => {
    setSessionList((prev) =>
      prev.map((s) => (s.id === selectedSession.id ? { ...s, status: 'TERMINATED' } : s))
    );
    addNotification('Sessão Encerrada', `Sessão ${selectedSession.id} finalizada com SIGTERM.`, 'warning');
  };

  // Ação: Exportar Relatório
  const handleExportSessionReport = () => {
    const reportData = {
      sessionId: selectedSession.id,
      project: selectedSession.project,
      target: selectedSession.target,
      started: selectedSession.started,
      duration: selectedSession.duration,
      status: selectedSession.status,
      commands: selectedSession.commands,
      logs: selectedSession.logs,
      modifiedFiles: selectedSession.modifiedFiles,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-session-${selectedSession.id.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification('Relatório Exportado', `Auditoria da sessão ${selectedSession.id} salva em JSON.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#040609] overflow-hidden font-mono text-zinc-300 select-none">
      {/* Top Banner */}
      <div className="h-12 px-4 border-b border-[#161f2e] bg-[#070a10] flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 font-bold uppercase text-[11px]">
            GERENCIADOR DE SESSÕES & AUDITORIA
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 text-[11px] font-sans">
            Trilhas completas de execução e telemetria forense
          </span>
        </div>

        <button
          onClick={handleSpawnNewSession}
          className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-colors shadow-sm text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>INICIAR NOVA SESSÃO</span>
        </button>
      </div>

      {/* Main Split: Left Sessions List + Right Session Details */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT: Lista de Sessões (ID, Projeto, Alvo, Início, Duração, Status) */}
        <div className="w-1/2 border-r border-[#161f2e] flex flex-col bg-[#05070c]">
          <div className="h-9 px-3 border-b border-[#141b27] bg-[#070a10] flex items-center justify-between text-[10px] text-zinc-500 uppercase font-bold">
            <span>SESSÕES REGISTRADAS ({sessionList.length})</span>
            <span>ORDENADO POR: RECENTES</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#101622]">
            {sessionList.map((sess) => {
              const isSelected = sess.id === selectedSessionId;

              let statusBadge = 'bg-zinc-800 text-zinc-400 border-zinc-700';
              if (sess.status === 'RUNNING') statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
              if (sess.status === 'FINISHED') statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
              if (sess.status === 'TERMINATED') statusBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';

              return (
                <div
                  key={sess.id}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#0f1726] border-l-2 border-l-amber-400 text-white'
                      : 'hover:bg-[#090d14] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{sess.id}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${statusBadge}`}>
                        {sess.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">{sess.started}</span>
                  </div>

                  <div className="text-xs text-amber-300 font-bold truncate mt-0.5">
                    {sess.project}
                  </div>

                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    Alvo: <span className="text-cyan-300">{sess.target}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-[#121926]">
                    <span>Duração: <strong className="text-white">{sess.duration}</strong></span>
                    <span>{sess.commands.length} comandos • {sess.modifiedFiles.length} arquivos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Detalhes da Sessão:
            - Comandos executados
            - Logs gerados
            - Arquivos modificados
            - Ações: 'Replay da Sessão', 'Encerrar Sessão', 'Exportar Relatório' */}
        <div className="w-1/2 flex flex-col bg-[#06080e] overflow-y-auto">
          {/* Top Actions for Selected Session */}
          <div className="p-3 border-b border-[#141b27] bg-[#070a10] flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold">DETALHES DA SESSÃO</span>
              <div className="font-bold text-white text-xs flex items-center gap-2 mt-0.5">
                <span>{selectedSession.id}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-cyan-400">{selectedSession.project}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {/* Replay da Sessão */}
              <button
                onClick={handleReplaySession}
                disabled={replaying}
                className="px-2.5 py-1 rounded bg-[#0c121c] hover:bg-[#152030] text-cyan-300 border border-cyan-800/40 font-bold flex items-center gap-1 transition-colors text-xs"
                title="Reproduzir comandos no terminal"
              >
                <RotateCcw className={`w-3 h-3 ${replaying ? 'animate-spin' : ''}`} />
                <span>Replay</span>
              </button>

              {/* Encerrar Sessão */}
              {selectedSession.status === 'RUNNING' && (
                <button
                  onClick={handleTerminateSession}
                  className="px-2.5 py-1 rounded bg-[#0c121c] hover:bg-rose-950/40 text-rose-300 border border-rose-800/40 font-bold flex items-center gap-1 transition-colors text-xs"
                >
                  <Square className="w-3 h-3 fill-rose-400" />
                  <span>Encerrar</span>
                </button>
              )}

              {/* Exportar Relatório */}
              <button
                onClick={handleExportSessionReport}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1 transition-colors text-xs shadow-sm"
              >
                <Download className="w-3 h-3" />
                <span>Exportar Relatório</span>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4 text-xs">
            {/* 1. Comandos Executados */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>COMANDOS EXECUTADOS NA SESSÃO</span>
              </span>
              <div className="p-2.5 rounded bg-[#040608] border border-[#162030] space-y-1 font-mono text-xs">
                {selectedSession.commands.map((cmd, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-zinc-200">
                    <span className="text-zinc-600 select-none">$&nbsp;</span>
                    <span className="text-cyan-300">{cmd}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Arquivos Modificados */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>ARQUIVOS MODIFICADOS</span>
              </span>
              <div className="p-2.5 rounded bg-[#040608] border border-[#162030] space-y-1 font-mono text-xs">
                {selectedSession.modifiedFiles.map((file, idx) => (
                  <div key={idx} className="text-emerald-400 flex items-center gap-1.5">
                    <span>•</span>
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Logs Gerados */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>LOGS E TELEMETRIA GERADOS</span>
              </span>
              <div className="p-2.5 rounded bg-[#040608] border border-[#162030] space-y-1.5 font-mono text-[11px] max-h-56 overflow-y-auto">
                {selectedSession.logs.map((log, idx) => {
                  let color = 'text-zinc-300';
                  if (log.level === 'warn') color = 'text-amber-300';
                  if (log.level === 'success') color = 'text-emerald-400';
                  if (log.level === 'error') color = 'text-rose-400';

                  return (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-zinc-600 select-none shrink-0">{log.timestamp}</span>
                      <span className={color}>{log.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
