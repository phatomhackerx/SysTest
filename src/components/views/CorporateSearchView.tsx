import React, { useState } from 'react';
import {
  Search,
  Lock,
  Sun,
  TrendingUp,
  ShieldCheck,
  Building2,
  Terminal,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { WatsonLogo } from '../common/WatsonLogo';
import { searchCorporateDatabase, CorporateDossier, SAMPLE_DOSSIERS } from '../../data/corporateData';
import { CorporateDossierModal } from '../modals/CorporateDossierModal';
import { ProPlansModal } from '../modals/ProPlansModal';
import { AuthModal } from '../modals/AuthModal';
import { useWatson } from '../../context/WatsonContext';

export const CorporateSearchView: React.FC = () => {
  const { setActiveView, addNotification } = useWatson();
  const [activeTab, setActiveTab] = useState<'CNPJ' | 'CPF' | 'Email' | 'Telefone'>('CNPJ');
  const [query, setQuery] = useState('');
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<CorporateDossier | null>(null);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const effectiveQuery = query.trim() || '00.000.000/0000-00';
    const dossier = searchCorporateDatabase(effectiveQuery);
    setSelectedDossier(dossier);
    setIsDossierOpen(true);
  };

  const handleTabClick = (tab: 'CNPJ' | 'CPF' | 'Email' | 'Telefone') => {
    if (tab !== 'CNPJ') {
      setIsProOpen(true);
    } else {
      setActiveTab('CNPJ');
    }
  };

  const loadSample = (cnpj: string) => {
    setQuery(cnpj);
    const dossier = searchCorporateDatabase(cnpj);
    setSelectedDossier(dossier);
    setIsDossierOpen(true);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between bg-black text-white relative font-sans select-none overflow-x-hidden"
      style={{
        backgroundColor: '#000000',
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Top Bar / Header */}
      <header className="w-full px-6 sm:px-12 py-5 flex items-center justify-between z-20">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <WatsonLogo size="sm" />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Direct Switch to Security Lab */}
          <button
            onClick={() => setActiveView('dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs border border-zinc-700/60 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Laboratório & Toolkit</span>
          </button>

          {/* Seja PRO Button (Gold Pill) */}
          <button
            onClick={() => setIsProOpen(true)}
            className="px-4 py-1.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            Seja PRO
          </button>

          {/* Acessar Conta */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="text-zinc-400 hover:text-white text-xs font-medium transition-colors"
          >
            Acessar Conta
          </button>

          {/* Theme/Brightness Icon */}
          <button
            onClick={() => addNotification('Modo Noturno', 'Ambiente escuro profissional ativado por padrão.', 'info')}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Ajustar Contraste"
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Center Hero & Search Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 z-10 max-w-4xl mx-auto w-full">
        {/* Fedora Hat & SR WATSON Logo */}
        <div className="mb-6 transform scale-110 sm:scale-125">
          <WatsonLogo size="xl" showSubtitle={true} />
        </div>

        {/* Category Tabs Pill Bar */}
        <div className="flex items-center p-1 rounded-full bg-[#101216] border border-[#21252d] shadow-lg mb-4 text-xs">
          <button
            onClick={() => handleTabClick('CNPJ')}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'CNPJ' ? 'bg-[#1e232b] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            CNPJ
          </button>

          <button
            onClick={() => handleTabClick('CPF')}
            className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
          >
            <span>CPF</span>
            <Lock className="w-3 h-3 text-zinc-500" />
          </button>

          <button
            onClick={() => handleTabClick('Email')}
            className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
          >
            <span>Email</span>
            <Lock className="w-3 h-3 text-zinc-500" />
          </button>

          <button
            onClick={() => handleTabClick('Telefone')}
            className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
          >
            <span>Telefone</span>
            <Lock className="w-3 h-3 text-zinc-500" />
          </button>
        </div>

        {/* Main Search Pill Container (White capsule) */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl bg-white rounded-full p-1.5 pl-6 flex items-center shadow-[0_0_50px_rgba(255,255,255,0.08)] transition-all focus-within:ring-2 focus-within:ring-blue-500"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="flex-1 bg-transparent text-zinc-900 placeholder:text-zinc-400 font-mono text-sm tracking-wider focus:outline-none"
          />

          <button
            type="submit"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-medium text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Buscar</span>
          </button>
        </form>

        {/* Sub-Badges / Stats line */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4 text-[11px] text-zinc-400 font-normal">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
            <span>+67M empresas</span>
          </div>

          <span className="text-zinc-700">·</span>

          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span>+1M buscas</span>
          </div>

          <span className="text-zinc-700">·</span>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            <span>Dados oficiais da Receita Federal</span>
          </div>
        </div>

        {/* Quick Demo Shortcuts */}
        <div className="flex items-center gap-2 mt-5 text-[11px] text-zinc-500">
          <span>Consultas de teste:</span>
          {['00.000.000/0000-00', '33.000.167/0001-01', '06.990.590/0001-23'].map((demo) => (
            <button
              key={demo}
              type="button"
              onClick={() => loadSample(demo)}
              className="text-zinc-400 hover:text-amber-400 font-mono underline decoration-zinc-700 hover:decoration-amber-400 transition-colors"
            >
              {demo}
            </button>
          ))}
        </div>
      </main>

      {/* Bottom 3-Column Information Grid */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-10 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-sans">Como funciona</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Digite o CNPJ e receba em segundos uma ficha completa com sócios, CNAE, Simples Nacional, endereço e contatos — cruzados a partir de fontes públicas oficiais.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-2 md:border-l md:border-zinc-800/80 md:pl-8">
            <h3 className="text-sm font-bold text-white font-sans">Para quem é</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Advogados, contadores, compliance, crédito, jornalistas e investigadores que precisam mapear empresas e relacionamentos com rapidez.
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-2 md:border-l md:border-zinc-800/80 md:pl-8">
            <h3 className="text-sm font-bold text-white font-sans">O que você investiga</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Quadro societário, CNAEs, situação cadastral, capital social, regime tributário, endereço, telefone, e-mails e relacionamentos entre sócios e empresas.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Copyright Footer */}
      <footer className="w-full py-6 text-center text-[11px] text-zinc-500 border-t border-zinc-900/60 z-10">
        © 2026 Sr. Watson. Todos os direitos reservados.
      </footer>

      {/* Interactive Dossier Modal */}
      <CorporateDossierModal
        dossier={selectedDossier}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      {/* Seja PRO Modal */}
      <ProPlansModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />

      {/* Acessar Conta Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
