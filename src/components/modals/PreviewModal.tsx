import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import { X, ShieldAlert, Monitor, Code, CheckCircle, ExternalLink } from 'lucide-react';

export const PreviewModal: React.FC = () => {
  const { previewModalOpen, setPreviewModalOpen, activeProject, activeTarget, activeFile } = useWatson();
  const [tab, setTab] = useState<'render' | 'headers' | 'raw'>('render');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!previewModalOpen) return null;

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage('Resposta de verificação capturada com segurança no sink local do sandbox (127.0.0.1:8888). Nenhuma transmissão externa.');
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0b0e15] border border-[#1a2232] rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#18202f] bg-[#0e121a]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-xs text-amber-400 font-bold tracking-wider uppercase">PREVIEW DO SANDBOX WATSON</span>
            <span className="text-zinc-600">|</span>
            <span className="font-mono text-xs text-zinc-300">{activeProject.name}</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#121927] text-cyan-400 font-mono border border-cyan-800/40">
              ALVO: {activeTarget.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-[#1d2638] bg-[#07090f] p-1 text-xs font-mono">
              <button
                onClick={() => setTab('render')}
                className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                  tab === 'render' ? 'bg-[#151d2c] text-amber-300 font-bold border border-amber-500/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Render
              </button>
              <button
                onClick={() => setTab('headers')}
                className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                  tab === 'headers' ? 'bg-[#151d2c] text-amber-300 font-bold border border-amber-500/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Cabeçalhos
              </button>
              <button
                onClick={() => setTab('raw')}
                className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                  tab === 'raw' ? 'bg-[#151d2c] text-amber-300 font-bold border border-amber-500/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Payload Bruto
              </button>
            </div>

            <button
              onClick={() => setPreviewModalOpen(false)}
              className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-[#18202f] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner */}
        <div className="px-6 py-2.5 bg-[#0e1219] border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-300 font-mono">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AMBIENTE ISOLADO: Confinamento em loopback RFC-1122. Tráfego externo bloqueado por design.</span>
          </div>
          <span className="text-[10px] text-amber-400/80">SHA-256: {activeProject.lastBuildHash.substring(0, 16)}...</span>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto bg-black watson-grid-bg p-6">
          {tab === 'render' && (
            <div className="max-w-xl mx-auto bg-[#0b0e15] border border-[#1a2232] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#18202e]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-mono text-cyan-300 font-bold">SIMULAÇÃO WATSON LAB #402</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-bold">
                  APENAS TREINAMENTO AUTORIZADO
                </span>
              </div>

              <h2 className="text-base font-bold text-white mb-2 font-sans">Simulação de Single Sign-On Corporativo</h2>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Esta interface de autenticação simulada foi provisionada com segurança para o alvo <span className="font-mono text-amber-400">{activeTarget.name}</span> com objetivo de conscientização em defesa cibernética. Todos os dados permanecem confinados na sandbox.
              </p>

              {submittedMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{submittedMessage}</span>
                </div>
              )}

              <form onSubmit={handleSimulatedSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-zinc-300 mb-1.5 font-medium">Identificador Institucional:</label>
                  <input
                    type="text"
                    defaultValue="corp\john.watson"
                    className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1.5 font-medium">PIN de Verificação do Exercício:</label>
                  <input
                    type="password"
                    defaultValue="drill_token_8891"
                    className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold py-2.5 rounded-full transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 text-xs"
                  >
                    <span>Validar Credenciais de Teste</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-[#18202e] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Rota Sink: /api/sandbox/drill-callback</span>
                <span>Latência: {activeTarget.latencyMs || 1}ms</span>
              </div>
            </div>
          )}

          {tab === 'headers' && (
            <div className="font-mono text-xs text-zinc-300 space-y-3 max-w-2xl mx-auto">
              <div className="p-3.5 rounded-xl bg-[#0b0e15] border border-[#1a2232]">
                <span className="text-amber-400 font-bold">HTTP/1.1 200 OK</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#0b0e15] border border-[#1a2232] space-y-2 text-xs">
                <div><span className="text-cyan-400">Content-Type:</span> text/html; charset=UTF-8</div>
                <div><span className="text-cyan-400">Content-Security-Policy:</span> default-src 'self' 'unsafe-inline'; frame-ancestors 'none';</div>
                <div><span className="text-cyan-400">X-Frame-Options:</span> DENY</div>
                <div><span className="text-cyan-400">X-Content-Type-Options:</span> nosniff</div>
                <div><span className="text-cyan-400">Strict-Transport-Security:</span> max-age=31536000; includeSubDomains</div>
                <div><span className="text-cyan-400">X-Watson-Sandbox-Isolation:</span> STRICT_AIRGAP</div>
                <div><span className="text-cyan-400">X-Watson-Target:</span> {activeTarget.name} ({activeTarget.address})</div>
                <div><span className="text-cyan-400">X-Watson-SHA256:</span> {activeProject.lastBuildHash}</div>
              </div>
            </div>
          )}

          {tab === 'raw' && (
            <pre className="font-mono text-xs text-zinc-300 bg-[#07090f] p-5 rounded-2xl border border-[#1a2232] overflow-x-auto max-w-3xl mx-auto leading-relaxed">
              <code>{activeFile?.content || 'Nenhum conteúdo de arquivo carregado no workspace ativo.'}</code>
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#18202f] bg-[#0e121a] flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Container Sandbox: watson-docker-sandbox-cgroup2</span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Confinamento Verificado
            </span>
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="px-4 py-1.5 bg-[#111724] hover:bg-[#1a2336] text-zinc-300 rounded-full border border-[#1e2738] transition-colors text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
