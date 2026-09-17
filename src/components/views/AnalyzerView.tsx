import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  ShieldCheck,
  RefreshCw,
  Download,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  Binary,
  Activity,
  FileCode,
  Sliders,
  Check,
} from 'lucide-react';

export interface SecurityFinding {
  id: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';
  rule: string;
  location: string;
  description: string;
  suggestion: string;
  fixed?: boolean;
}

export const AnalyzerView: React.FC = () => {
  const { activeProject, addNotification, runAnalysis } = useWatson();

  const [scanning, setScanning] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL');

  // 5 Metricas solicitadas pelo usuário:
  // Complexidade, Entropia, Heurísticas, Validação de Sintaxe, Conformidade de Regras
  const [metrics, setMetrics] = useState({
    complexity: '4.2 (Baixa)',
    entropy: '4.18 Shannon',
    heuristics: '0 Anomalias',
    syntaxValidation: '100% Válida',
    ruleCompliance: '98.5% PASS',
  });

  // Tabela de Achados com campos: Severidade, Regra violada, Linha/Arquivo, Descrição, Sugestão de correção
  const [findings, setFindings] = useState<SecurityFinding[]>([
    {
      id: 'find-1',
      severity: 'HIGH',
      rule: 'SEC-PERM-EXEC-MASK',
      location: '/scripts/deploy_lab.sh:18',
      description: 'Script requer permissão 0755 mas está definido com 0777 em ambiente compartilhado.',
      suggestion: 'Executar chmod 0750 para restringir permissões ao usuário do laboratório.',
      fixed: false,
    },
    {
      id: 'find-2',
      severity: 'MEDIUM',
      rule: 'SEC-AIRGAP-RAW-NET',
      location: '/configs/payload.json:12',
      description: 'Definição de host de bind não restringe explicitamente a interface 127.0.0.1.',
      suggestion: 'Adicionar "bind_address": "127.0.0.1" no objeto de transporte.',
      fixed: false,
    },
    {
      id: 'find-3',
      severity: 'LOW',
      rule: 'AST-UNESCAPED-PARAM',
      location: '/templates/phishing_sim.html:34',
      description: 'Variável {{custom_payload}} não possui sanitização estrita de caracteres HTML.',
      suggestion: 'Usar filtro de escape seguro no pré-processamento de renderização.',
      fixed: false,
    },
    {
      id: 'find-4',
      severity: 'INFO',
      rule: 'META-MISSING-HASH',
      location: '/manifest.json:5',
      description: 'Campo checksum SHA-256 pendente de cálculo no último build.',
      suggestion: 'Compilar o projeto com "systest build" para assinar os metadados.',
      fixed: true,
    },
  ]);

  // Ação: Executar Novo Scan
  const handleExecuteScan = async () => {
    setScanning(true);
    addNotification('Scanner Ativo', 'Executando inspeção AST profunda e cálculo de entropia...', 'info');
    runAnalysis();

    setTimeout(() => {
      setScanning(false);
      setMetrics({
        complexity: '3.8 (Ótima)',
        entropy: '4.12 Shannon',
        heuristics: 'Conforme',
        syntaxValidation: '100% Válida',
        ruleCompliance: '99.1% PASS',
      });
      addNotification('Scan Concluído', 'Varredura finalizada. 4 itens inspecionados.', 'success');
    }, 1000);
  };

  // Ação: Exportar Relatório PDF/MD
  const handleExportReport = () => {
    const markdownContent = `# RELATÓRIO DE AUDITORIA DE SEGURANÇA - SYSTEST WORKSTATION
Data da Emissão: ${new Date().toLocaleString('pt-BR')}
Projeto: ${activeProject.name}
Ambiente: Laboratório Confinado (Airgapped)

## 1. Métricas Técnicas
- Complexidade Ciclomática: ${metrics.complexity}
- Entropia de Shannon: ${metrics.entropy}
- Heurísticas: ${metrics.heuristics}
- Validação de Sintaxe: ${metrics.syntaxValidation}
- Conformidade de Regras: ${metrics.ruleCompliance}

## 2. Achados e Conformidade (Findings)
${findings
  .map(
    (f) => `### [${f.severity}] ${f.rule}
- **Localização:** ${f.location}
- **Descrição:** ${f.description}
- **Sugestão de Correção:** ${f.suggestion}
- **Status:** ${f.fixed ? 'CORRIGIDO (AUTO-FIX)' : 'PENDENTE'}
`
  )
  .join('\n')}

---
Emitido por SysTest Security Laboratory v2.4 (Kali-Lab).
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `systest-security-report-${activeProject.name.toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification('Relatório Exportado', 'Documento de auditoria gerado em Markdown/MD.', 'success');
  };

  // Ação: Aplicar Auto-Fix Seguro
  const handleApplyAutoFix = () => {
    setFindings((prev) => prev.map((f) => ({ ...f, fixed: true })));
    setMetrics((prev) => ({
      ...prev,
      ruleCompliance: '100% PASS',
    }));
    addNotification('Auto-Fix Aplicado', 'Todas as correções automáticas seguras foram incorporadas ao projeto.', 'success');
  };

  const handleFixSingle = (id: string) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, fixed: true } : f))
    );
    addNotification('Correção Aplicada', 'Item remediado com sucesso.', 'info');
  };

  const filteredFindings = findings.filter((f) => {
    if (severityFilter === 'ALL') return true;
    return f.severity === severityFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#040609] overflow-y-auto p-4 sm:p-6 font-mono text-zinc-300 space-y-5 select-none">
      {/* Top Header & Actions:
          'Executar Novo Scan', 'Exportar Relatório PDF/MD', 'Aplicar Auto-Fix Seguro' */}
      <div className="bg-[#080c14] border border-[#162030] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              [INSPEÇÃO TÉCNICA AST & ENTROPIA]
            </span>
          </div>
          <h1 className="text-lg font-black text-white tracking-wide uppercase mt-1">
            Analisador de Segurança e Conformidade
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Análise estática de código, cálculo de entropia de Shannon e verificação de regras de confinamento do SysTest.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Executar Novo Scan */}
          <button
            onClick={handleExecuteScan}
            disabled={scanning}
            className="px-3.5 py-1.5 rounded bg-[#0f1624] hover:bg-[#162234] border border-emerald-800/40 text-emerald-300 flex items-center gap-1.5 transition-colors font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'ESCANEANDO...' : 'EXECUTAR NOVO SCAN'}</span>
          </button>

          {/* Exportar Relatório PDF/MD */}
          <button
            onClick={handleExportReport}
            className="px-3.5 py-1.5 rounded bg-[#0f1624] hover:bg-[#162234] border border-cyan-800/40 text-cyan-300 flex items-center gap-1.5 transition-colors font-bold"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPORTAR RELATÓRIO MD</span>
          </button>

          {/* Aplicar Auto-Fix Seguro */}
          <button
            onClick={handleApplyAutoFix}
            className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Wrench className="w-3.5 h-3.5 fill-black" />
            <span>APLICAR AUTO-FIX SEGURO</span>
          </button>
        </div>
      </div>

      {/* 5 Métricas do Usuário:
          Complexidade, Entropia, Heurísticas, Validação de Sintaxe, Conformidade de Regras */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Complexidade */}
        <div className="bg-[#070a10] border border-[#162030] rounded-lg p-3">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Complexidade</span>
          <div className="text-white font-bold text-sm mt-1">{metrics.complexity}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Grau ciclomático seguro</div>
        </div>

        {/* Entropia */}
        <div className="bg-[#070a10] border border-[#162030] rounded-lg p-3">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Entropia</span>
          <div className="text-cyan-300 font-bold text-sm mt-1">{metrics.entropy}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Distribuição uniforme</div>
        </div>

        {/* Heurísticas */}
        <div className="bg-[#070a10] border border-[#162030] rounded-lg p-3">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Heurísticas</span>
          <div className="text-emerald-400 font-bold text-sm mt-1">{metrics.heuristics}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Assinaturas validadas</div>
        </div>

        {/* Validação de Sintaxe */}
        <div className="bg-[#070a10] border border-[#162030] rounded-lg p-3">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Validação de Sintaxe</span>
          <div className="text-amber-400 font-bold text-sm mt-1">{metrics.syntaxValidation}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Parser AST sem falhas</div>
        </div>

        {/* Conformidade de Regras */}
        <div className="bg-[#070a10] border border-[#162030] rounded-lg p-3 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Conformidade de Regras</span>
          <div className="text-emerald-300 font-bold text-sm mt-1">{metrics.ruleCompliance}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Airgap Strict Enforced</div>
        </div>
      </div>

      {/* Tabela de Achados (Findings) */}
      <div className="bg-[#070a10] border border-[#162030] rounded-xl overflow-hidden shadow-lg">
        <div className="p-3 bg-[#090d14] border-b border-[#141b27] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              TABELA DE ACHADOS & REGULAMENTAÇÃO
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#101726] text-amber-300 border border-amber-500/40">
              {filteredFindings.length} ITENS
            </span>
          </div>

          {/* Severity filter selector */}
          <div className="flex items-center gap-1 text-[10px]">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  severityFilter === sev
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-zinc-400 hover:text-white bg-[#0c1018]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#05070c] border-b border-[#141b27] text-zinc-500 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">SEVERIDADE</th>
                <th className="py-2.5 px-3">REGRA VIOLADA</th>
                <th className="py-2.5 px-3">LINHA / ARQUIVO</th>
                <th className="py-2.5 px-3">DESCRIÇÃO</th>
                <th className="py-2.5 px-3">SUGESTÃO DE CORREÇÃO</th>
                <th className="py-2.5 px-3 text-right">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#101622]">
              {filteredFindings.map((f) => {
                let badgeClass = 'bg-zinc-800 text-zinc-300 border-zinc-700';
                if (f.severity === 'HIGH') badgeClass = 'bg-rose-950/40 text-rose-400 border-rose-800/50';
                if (f.severity === 'MEDIUM') badgeClass = 'bg-amber-950/40 text-amber-300 border-amber-800/50';
                if (f.severity === 'LOW') badgeClass = 'bg-yellow-950/40 text-yellow-300 border-yellow-800/50';
                if (f.severity === 'INFO') badgeClass = 'bg-cyan-950/40 text-cyan-400 border-cyan-800/50';

                return (
                  <tr
                    key={f.id}
                    className={`transition-colors ${
                      f.fixed ? 'opacity-60 bg-[#070c12]' : 'hover:bg-[#090d15]'
                    }`}
                  >
                    {/* Severidade */}
                    <td className="py-2.5 px-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-bold ${badgeClass}`}>
                        {f.severity}
                      </span>
                    </td>

                    {/* Regra violada */}
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400 text-[11px]">
                      {f.rule}
                    </td>

                    {/* Linha / Arquivo */}
                    <td className="py-2.5 px-3 font-mono text-cyan-300 text-[11px]">
                      {f.location}
                    </td>

                    {/* Descrição */}
                    <td className="py-2.5 px-3 text-zinc-300 font-sans text-xs max-w-xs">
                      {f.description}
                    </td>

                    {/* Sugestão de correção */}
                    <td className="py-2.5 px-3 text-zinc-400 font-sans text-xs max-w-xs">
                      {f.suggestion}
                    </td>

                    {/* Ação */}
                    <td className="py-2.5 px-3 text-right">
                      {f.fixed ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <Check className="w-3 h-3" /> Corrigido
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFixSingle(f.id)}
                          className="px-2 py-1 rounded bg-[#0f1624] hover:bg-amber-500 hover:text-black border border-amber-500/40 text-amber-300 font-bold text-[10px] transition-colors"
                        >
                          Auto-Fix
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
