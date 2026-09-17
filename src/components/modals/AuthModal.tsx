import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Shield } from 'lucide-react';
import { useWatson } from '../../context/WatsonContext';
import { WatsonLogo } from '../common/WatsonLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { addNotification } = useWatson();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addNotification('Sessão Conectada', `Bem-vindo de volta, ${email}.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0b0e14] border border-[#232a39] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] w-full max-w-md p-6 sm:p-8 font-sans text-xs text-[#cbd5e1] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#1a2130] text-[#718299] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6 text-center">
          <WatsonLogo size="md" />
          <h2 className="text-xl font-bold text-white mt-3">Acessar Conta</h2>
          <p className="text-zinc-400 text-xs mt-1">
            Entre para acessar seu histórico de investigações corporativas.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1">E-mail</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111622] border border-[#232d3e] rounded-lg px-3 py-2.5 pl-9 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1">Senha</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111622] border border-[#232d3e] rounded-lg px-3 py-2.5 pl-9 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>Entrar na Plataforma</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#1a2130] text-center text-zinc-500 text-[11px]">
          Precisa de ajuda? Contate o suporte do laboratório Watson.
        </div>
      </div>
    </div>
  );
};
