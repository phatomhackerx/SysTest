import React from 'react';
import { CorporateDossier } from '../../data/corporateData';
import {
  X,
  Building2,
  ShieldCheck,
  Users,
  MapPin,
  Phone,
  Mail,
  FileText,
  Download,
  Terminal,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import { useWatson } from '../../context/WatsonContext';

interface CorporateDossierModalProps {
  dossier: CorporateDossier | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CorporateDossierModal: React.FC<CorporateDossierModalProps> = ({
  dossier,
  isOpen,
  onClose,
}) => {
  const { setActiveTarget, setActiveView, addNotification } = useWatson();

  if (!isOpen || !dossier) return null;

  const handleSendToToolkit = () => {
    setActiveTarget({
      id: 'target-corp-' + dossier.cnpj.replace(/\D/g, ''),
      name: dossier.nomeFantasia || dossier.razaoSocial,
      address: dossier.cnpj,
      type: 'TEST ENVIRONMENT',
      status: 'ONLINE',
      lastConnection: 'Conectado agora',
      environment: `Corporativo: ${dossier.municipio || dossier.endereco.municipio}/${dossier.endereco.uf}`,
      notes: `Alvo derivado de investigação corporativa SR WATSON. CNAE: ${dossier.cnaePrincipal.codigo}`,
      latencyMs: 1,
      openPorts: [80, 443, 8443],
    });

    addNotification(
      'Alvo Vinculado ao Toolkit',
      `Empresa ${dossier.razaoSocial} agora é o Alvo Ativo do Laboratório de Segurança.`,
      'success'
    );
    onClose();
    setActiveView('analyzer');
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dossie-watson-${dossier.cnpj.replace(/\D/g, '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Dossiê Exportado', 'Relatório salvo com sucesso.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 select-text overflow-y-auto font-sans">
      <div className="bg-[#0b0e15] border border-[#1a2232] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] w-full max-w-4xl max-h-[92vh] flex flex-col text-xs overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#18202f] bg-[#0e121a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-white tracking-wide font-sans">
                  {dossier.razaoSocial}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
                  {dossier.situacaoCadastral}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                CNPJ: <span className="text-cyan-400 font-bold">{dossier.cnpj}</span> · Fantasia: {dossier.nomeFantasia || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-1.5 rounded-full bg-[#121824] hover:bg-[#1a2232] text-cyan-300 border border-cyan-800/40 flex items-center gap-1.5 transition-colors text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </button>

            <button
              onClick={handleSendToToolkit}
              className="px-4 py-1.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] text-xs"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Auditar no Toolkit</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#18202f] text-zinc-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#07090f] border border-[#1a2232]">
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Capital Social</span>
              <div className="text-white font-bold text-sm mt-1">
                {dossier.capitalSocial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07090f] border border-[#1a2232]">
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Data de Abertura</span>
              <div className="text-cyan-300 font-bold text-sm mt-1 font-mono">{dossier.dataAbertura}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#07090f] border border-[#1a2232]">
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Porte / Simples</span>
              <div className="text-white font-bold text-sm mt-1">
                {dossier.porte} · {dossier.simplesNacional ? 'Optante' : 'Não Optante'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07090f] border border-[#1a2232]">
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Score de Conformidade</span>
              <div className="text-emerald-400 font-bold text-sm mt-1 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>{dossier.compliance.score}/100</span>
              </div>
            </div>
          </div>

          {/* Section: Quadro de Sócios e Administradores (QSA) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#18202f]">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white uppercase tracking-wider text-xs font-mono">
                Quadro de Sócios e Administradores (QSA)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dossier.qsa.map((socio, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#07090f] border border-[#1a2232] flex flex-col justify-between"
                >
                  <div>
                    <div className="font-bold text-white text-xs">{socio.nome}</div>
                    <div className="text-cyan-400 text-xs mt-1 font-mono">{socio.qualificacao}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#141b27] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Origem: {socio.paisOrigem}</span>
                    {socio.faixaEtaria && <span>Faixa: {socio.faixaEtaria}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Atividades Econômicas (CNAE) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#18202f]">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white uppercase tracking-wider text-xs font-mono">
                Classificação Nacional de Atividades Econômicas (CNAE)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#07090f] border border-[#1a2232] space-y-3">
              <div>
                <span className="text-[10px] text-amber-400 font-semibold uppercase font-mono">CNAE Principal:</span>
                <div className="text-white font-medium mt-1">
                  <span className="text-cyan-300 font-mono font-bold mr-2">{dossier.cnaePrincipal.codigo}</span>
                  {dossier.cnaePrincipal.descricao}
                </div>
              </div>

              {dossier.cnaesSecundarios.length > 0 && (
                <div className="pt-3 border-t border-[#141b27]">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">CNAEs Secundários:</span>
                  <div className="space-y-2 mt-1.5">
                    {dossier.cnaesSecundarios.map((sec, idx) => (
                      <div key={idx} className="text-zinc-400 text-xs flex items-start gap-2">
                        <span className="text-cyan-400/90 font-mono shrink-0">{sec.codigo}</span>
                        <span>{sec.descricao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Endereço & Contatos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#07090f] border border-[#1a2232] space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs pb-2 border-b border-[#18202f] font-mono">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Endereço Cadastral</span>
              </div>
              <div className="text-zinc-300 leading-relaxed text-xs">
                <div>
                  {dossier.endereco.logradouro}, {dossier.endereco.numero} {dossier.endereco.complemento || ''}
                </div>
                <div className="text-zinc-500 mt-0.5">
                  {dossier.endereco.bairro} · {dossier.endereco.municipio} - {dossier.endereco.uf}
                </div>
                <div className="text-cyan-400 font-mono mt-1">CEP: {dossier.endereco.cep}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07090f] border border-[#1a2232] space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs pb-2 border-b border-[#18202f] font-mono">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Contatos & Comunicação</span>
              </div>
              <div className="space-y-2 text-zinc-300 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{dossier.contato.telefone}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-cyan-300">{dossier.contato.email}</span>
                </div>
                <div className="text-[11px] text-zinc-500 pt-1 font-sans">
                  Fonte: Cadastro Oficial da Receita Federal do Brasil
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#18202f] bg-[#0c1018] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <BadgeCheck className="w-4 h-4 shrink-0" />
            <span>DADOS PÚBLICOS SINCRONIZADOS COM A RECEITA FEDERAL</span>
          </div>
          <button
            onClick={handleSendToToolkit}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Executar Varredura no Watson Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
