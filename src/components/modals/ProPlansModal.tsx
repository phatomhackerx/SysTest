import React from 'react';
import { X, Check, Shield, Zap, Lock, Star } from 'lucide-react';
import { useWatson } from '../../context/WatsonContext';

interface ProPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProPlansModal: React.FC<ProPlansModalProps> = ({ isOpen, onClose }) => {
  const { addNotification } = useWatson();

  if (!isOpen) return null;

  const handleSelectPlan = (plan: string) => {
    addNotification('Plano Selecionado', `Você ativou a demonstração do plano ${plan}.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0b0e14] border border-[#232a39] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] w-full max-w-3xl p-6 sm:p-8 font-sans text-xs text-[#cbd5e1] relative overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#1a2130] text-[#718299] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center max-w-md mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>ACESSO ILIMITADO</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            SEJA SR. WATSON PRO
          </h2>
          <p className="text-zinc-400 text-xs mt-2">
            Desbloqueie consultas avançadas de CPF, telefones, e-mails, relatórios de compliance e integração direta com o Security Toolkit.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Plan 1 */}
          <div className="p-5 rounded-xl bg-[#10141e] border border-[#1e2637] flex flex-col justify-between">
            <div>
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Básico</span>
              <div className="text-xl font-bold text-white mt-1">Gratuito</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Para consultas esporádicas</div>

              <div className="space-y-2 mt-5 text-[11px] text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Consultas públicas de CNPJ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Quadro de Sócios (QSA)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Consultas de CPF</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2 rounded-lg bg-[#18202d] text-zinc-300 font-semibold text-xs hover:bg-[#222d3e]"
            >
              Plano Atual
            </button>
          </div>

          {/* Plan 2 (Featured) */}
          <div className="p-5 rounded-xl bg-[#141926] border-2 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black font-black text-[9px] uppercase tracking-wider">
              MAIS POPULAR
            </div>

            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px]">Investigador PRO</span>
              <div className="text-2xl font-black text-white mt-1">
                R$ 89<span className="text-xs font-normal text-zinc-400">/mês</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Para profissionais e compliance</div>

              <div className="space-y-2 mt-5 text-[11px] text-zinc-200">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Consultas ilimitadas de CNPJ & CPF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Rastreio de telefones e e-mails</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Exportação de relatórios em PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Envio para Watson Security Toolkit</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('Investigador PRO')}
              className="mt-6 w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all"
            >
              Assinar PRO
            </button>
          </div>

          {/* Plan 3 */}
          <div className="p-5 rounded-xl bg-[#10141e] border border-[#1e2637] flex flex-col justify-between">
            <div>
              <span className="text-cyan-400 font-bold uppercase text-[10px]">Enterprise</span>
              <div className="text-2xl font-black text-white mt-1">
                R$ 249<span className="text-xs font-normal text-zinc-400">/mês</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Múltiplos peritos & API</div>

              <div className="space-y-2 mt-5 text-[11px] text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Acesso via API RESTful</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Grafos de vínculos complexos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Suporte prioritário 24/7</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('Enterprise')}
              className="mt-6 w-full py-2 rounded-lg bg-[#18202d] hover:bg-[#222d3e] text-cyan-300 border border-cyan-500/30 font-semibold text-xs"
            >
              Contatar Vendas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
