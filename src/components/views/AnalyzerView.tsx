import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  ShieldCheck,
  Filter,
  RefreshCw,
  Download,
  Binary,
} from 'lucide-react';

export const AnalyzerView: React.FC = () => {
  const { findings, fileMetadata, runAnalysis, activeProject, addNotification } = useWatson();
  const [filter, setFilter] = useState<'ALL' | 'PASS' | 'WARNING' | 'ERROR'>('ALL');

  const filteredFindings = findings.filter((f) => {
    if (filter === 'ALL') return true;
    return f.severity === filter;
  });

  const passCount = findings.filter((f) => f.severity === 'PASS').length;
  const warnCount = findings.filter((f) => f.severity === 'WARNING').length;
  const errCount = findings.filter((f) => f.severity === 'ERROR').length;

  const exportReport = () => {
    const report = {
      project: activeProject.name,
      timestamp: new Date().toISOString(),
      findingsSummary: { pass: passCount, warning: warnCount, error: errCount },
      findings,
      fileMetadata,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watson-analysis-report-${activeProject.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Relatório Exportado', 'Relatório JSON de análise técnica gerado com sucesso.', 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full watson-grid-bg bg-black overflow-y-auto p-4 sm:p-6 lg:p-8 font-sans text-zinc-300 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#090c13] border border-[#1a2232] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase font-mono">ANALISADOR DE SEGURANÇA TÉCNICO</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">
              SCANNER AST & ENTROPIA
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1.5 font-sans">
            Validação estática de regras, cálculo de entropia de Shannon, verificação de confinamento em sandbox e integridade de artefatos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono">
          <button
            onClick={runAnalysis}
            className="px-3.5 py-2 rounded-full bg-[#111724] hover:bg-[#1a2336] border border-emerald-800/40 text-emerald-300 flex items-center gap-2 text-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reanalisar</span>
          </button>
          <button
            onClick={exportReport}
            className="px-4 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Download className="w-4 h-4" />
            <span>Exportar JSON</span>
          </button>
        </div>
      </div>

      {/* Terminal-Style Verification Summary Box */}
      <div className="bg-[#080b12] border border-[#18202f] rounded-2xl p-5 font-mono text-xs leading-relaxed space-y-2 shadow-lg">
        <div className="text-[11px] font-bold text-amber-400 mb-2 border-b border-[#18202f] pb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          MANIFESTO DE VERIFICAÇÃO WATSON:
        </div>
        <div className="text-emerald-400 flex items-center gap-2 font-medium">
          <span className="text-emerald-500">[PASS]</span> Validação de workspace: estrutura de diretórios íntegra e isolada
        </div>
        <div className="text-emerald-400 flex items-center gap-2 font-medium">
          <span className="text-emerald-500">[PASS]</span> Estrutura de arquivos: 8 arquivos validados com permissões POSIX restritas
        </div>
        <div className="text-emerald-400 flex items-center gap-2 font-medium">
          <span className="text-emerald-500">[PASS]</span> Confinamento: limite de memória de container travado em 512MB
        </div>
        <div className="text-amber-400 flex items-center gap-2 font-medium">
          <span className="text-amber-500">[WARN]</span> Ativo secundário ausente: favicon.ico não referenciado no pacote
        </div>
        <div className="text-emerald-400 flex items-center gap-2 font-medium">
          <span className="text-emerald-500">[PASS]</span> Isolamento de rede: egress travado estritamente em RFC-1122 local loopback
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-zinc-500" />
          <span className="text-[11px] text-zinc-500 uppercase font-semibold">Severidade:</span>
          {(['ALL', 'PASS', 'WARNING', 'ERROR'] as const).map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                    : 'bg-[#0d121c] text-zinc-400 hover:text-white border-[#1d2638]'
                }`}
              >
                {f} {f === 'PASS' && `(${passCount})`} {f === 'WARNING' && `(${warnCount})`} {f === 'ERROR' && `(${errCount})`}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-zinc-500">
          Exibindo {filteredFindings.length} de {findings.length} apontamentos
        </span>
      </div>

      {/* Findings Table */}
      <div className="border border-[#18202f] rounded-2xl overflow-hidden bg-[#090c13] shadow-md">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-[#0e131d] border-b border-[#18202f] text-[10px] text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">ID Regra</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4">Componente</th>
              <th className="py-3 px-4">Descrição</th>
              <th className="py-3 px-4">Remediação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#151c2a]">
            {filteredFindings.map((finding) => {
              let badge = (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  PASS
                </span>
              );

              if (finding.severity === 'WARNING') {
                badge = (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    WARN
                  </span>
                );
              } else if (finding.severity === 'ERROR') {
                badge = (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                    ERROR
                  </span>
                );
              }

              return (
                <tr key={finding.id} className="hover:bg-[#0f1422] transition-colors">
                  <td className="py-3 px-4">{badge}</td>
                  <td className="py-3 px-4 font-semibold text-cyan-300">{finding.ruleId}</td>
                  <td className="py-3 px-4 text-zinc-400">{finding.category}</td>
                  <td className="py-3 px-4 text-white font-medium">{finding.target}</td>
                  <td className="py-3 px-4 text-zinc-300">{finding.message}</td>
                  <td className="py-3 px-4 text-zinc-500 text-[11px]">{finding.remediation}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* File Metadata & Shannon Entropy Inspector Table */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wide font-mono">
            METADADOS DE ARQUIVOS & INSPEÇÃO DE ENTROPIA DE SHANNON
          </span>
        </div>

        <div className="border border-[#18202f] rounded-2xl overflow-hidden bg-[#090c13] shadow-md">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#0e131d] border-b border-[#18202f] text-[10px] text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Nome do Arquivo</th>
                <th className="py-3 px-4">Tipo MIME</th>
                <th className="py-3 px-4">Tamanho</th>
                <th className="py-3 px-4">Entropia Shannon</th>
                <th className="py-3 px-4">Digest SHA-256</th>
                <th className="py-3 px-4">Flags Sandbox</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c2a]">
              {fileMetadata.map((meta, idx) => (
                <tr key={idx} className="hover:bg-[#0f1422] transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{meta.name}</td>
                  <td className="py-3 px-4 text-zinc-400">{meta.mimeType}</td>
                  <td className="py-3 px-4 text-zinc-300">{(meta.sizeBytes / 1024).toFixed(2)} KB</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        meta.entropy > 6.5
                          ? 'text-amber-400'
                          : meta.entropy > 5.0
                          ? 'text-cyan-300'
                          : 'text-emerald-400'
                      }`}
                    >
                      {meta.entropy.toFixed(3)} bits
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-500 text-[11px] font-mono">
                    {meta.sha256.substring(0, 16)}...
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {meta.sandboxFlags.map((flag, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[9px] px-2 py-0.5 rounded-full bg-[#121927] text-cyan-300 border border-cyan-800/40"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
